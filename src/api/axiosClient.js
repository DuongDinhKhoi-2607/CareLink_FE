import axios from "axios";

// Cấu hình hạ tầng HTTP Axios dùng chung cho toàn bộ dự án CareLink
// Mặc định kết nối cổng 7183 (Visual Studio tím) theo yêu cầu của Vy, tự động dự phòng 5024 khi cần
const PRIMARY_URL = import.meta.env.VITE_API_URL || "https://localhost:7183";
const FALLBACK_URL = "http://localhost:5024";

const axiosClient = axios.create({
    baseURL: PRIMARY_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// 1. Request Interceptor: Tự động gắn Bearer Token từ localStorage vào header
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("carelink_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Trả về trực tiếp data & tự động làm mới token khi 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Chuyển đổi cổng thông minh an toàn giữa 7183 (Visual Studio tím) và 5024 khi một cổng chưa chạy
        const currentBase = originalRequest?.baseURL || axiosClient.defaults.baseURL || PRIMARY_URL;
        const isLocalhost = currentBase.includes("localhost") || currentBase.includes("127.0.0.1");

        // Chỉ fallback cổng local khi kết nối bị từ chối hoàn toàn (ECONNREFUSED / ERR_NETWORK trước khi gửi)
        // và KHÔNG retry mù các mutation khi timeout để tránh tạo duplicate booking / duplicate payment
        const isTimeout = error.code === "ECONNABORTED" || error.message?.includes("timeout");
        const isConnectionRefused = (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") && !error.response && !isTimeout;
        const method = (originalRequest?.method || "get").toLowerCase();
        const isSafeIdempotent = ["get", "head", "options"].includes(method);

        if (
            isLocalhost &&
            isConnectionRefused &&
            originalRequest &&
            !originalRequest._portFallbackTried
        ) {
            originalRequest._portFallbackTried = true;
            const targetBase = currentBase.includes("7183") ? FALLBACK_URL : "https://localhost:7183";
            // Cập nhật ngay baseURL mặc định để các request tiếp theo không phải đợi thử lại
            axiosClient.defaults.baseURL = targetBase;
            originalRequest.baseURL = targetBase;

            // Chỉ tự động replay nếu là GET/idempotent hoặc connection chưa từng thiết lập
            if (isSafeIdempotent || isConnectionRefused) {
                return axiosClient(originalRequest);
            }
        }

        if (
            error.response &&
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/refresh-token") &&
            !originalRequest.url?.includes("/auth/register")
        ) {
            const storedRefreshToken = localStorage.getItem("carelink_refresh_token");
            if (storedRefreshToken) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((newToken) => {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return axiosClient(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const res = await axios.post(
                        `${axiosClient.defaults.baseURL}/api/v1/auth/refresh-token`,
                        { refreshToken: storedRefreshToken },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    const data = res.data;
                    const newAccessToken = data.accessToken;
                    const newRefreshToken = data.refreshToken;

                    if (newAccessToken) {
                        localStorage.setItem("carelink_token", newAccessToken);
                        if (newRefreshToken) {
                            localStorage.setItem("carelink_refresh_token", newRefreshToken);
                        }
                        processQueue(null, newAccessToken);
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axiosClient(originalRequest);
                    }
                } catch (refreshErr) {
                    processQueue(refreshErr, null);
                    // Thu hồi phiên làm việc khi refresh token thất bại
                    localStorage.removeItem("carelink_token");
                    localStorage.removeItem("carelink_refresh_token");
                    localStorage.removeItem("carelink_user");
                    if (
                        window.location.pathname.startsWith("/dashboard") ||
                        window.location.pathname.startsWith("/caregiver/dashboard") ||
                        window.location.pathname.startsWith("/admin")
                    ) {
                        window.location.href = "/login";
                    }
                    return Promise.reject(refreshErr);
                } finally {
                    isRefreshing = false;
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
