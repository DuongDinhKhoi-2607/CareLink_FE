import axios from "axios";

// Cấu hình hạ tầng HTTP Axios dùng chung cho toàn bộ dự án CareLink
const RENDER_BACKEND_URL = "https://carelink-be.onrender.com";
const LOCAL_HTTPS_URL = "https://localhost:7183";
const LOCAL_HTTP_URL = "http://localhost:5024";

// 1. Xác định URL khởi đầu thông minh:
// - Hỗ trợ query ?api=local hoặc ?api=render để dev/test luân phiên ngay trên browser
// - Ưu tiên biến môi trường VITE_API_URL (nếu có trong .env / .env.local)
// - Khi deploy Production (Vercel): mặc định Render Backend
// - Khi chạy Development (npm run dev): mặc định cổng 7183 (Visual Studio tím)
const getInitialBaseURL = () => {
    try {
        if (typeof window !== "undefined" && window.location) {
            const urlParams = new URLSearchParams(window.location.search);
            const queryApi = urlParams.get("api");
            if (queryApi === "local" || queryApi === "7183") {
                localStorage.setItem("carelink_api_mode", "local");
                return LOCAL_HTTPS_URL;
            }
            if (queryApi === "render" || queryApi === "cloud") {
                localStorage.setItem("carelink_api_mode", "render");
                return RENDER_BACKEND_URL;
            }
            const savedMode = localStorage.getItem("carelink_api_mode");
            if (savedMode === "render") return RENDER_BACKEND_URL;
            if (savedMode === "local") return LOCAL_HTTPS_URL;
        }
    } catch {}

    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    return import.meta.env.PROD ? RENDER_BACKEND_URL : LOCAL_HTTPS_URL;
};

const PRIMARY_URL = getInitialBaseURL();

const axiosClient = axios.create({
    baseURL: PRIMARY_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 45000,
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

        // Chuyển đổi thông minh an toàn giữa Localhost (7183 / 5024) và Render BE:
        // Nếu chạy local mà Visual Studio chưa mở, request bị từ chối kết nối (ERR_NETWORK / ECONNREFUSED),
        // hệ thống sẽ tự động chuyển thẳng sang Render Backend để ứng dụng vẫn chạy mượt mà!
        const currentBase = originalRequest?.baseURL || axiosClient.defaults.baseURL || PRIMARY_URL;
        const isLocalhost = currentBase.includes("localhost") || currentBase.includes("127.0.0.1");

        const isTimeout = error.code === "ECONNABORTED" || error.message?.includes("timeout");
        const isConnectionRefused = (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") && !error.response && !isTimeout;
        const method = (originalRequest?.method || "get").toLowerCase();
        const isSafeIdempotent = ["get", "head", "options"].includes(method);

        if (
            isLocalhost &&
            isConnectionRefused &&
            originalRequest &&
            (originalRequest._localFallbackAttempts || 0) < 2
        ) {
            originalRequest._localFallbackAttempts = (originalRequest._localFallbackAttempts || 0) + 1;

            let nextTarget = RENDER_BACKEND_URL;
            if (originalRequest._localFallbackAttempts === 1 && currentBase.includes("7183")) {
                nextTarget = LOCAL_HTTP_URL;
            } else {
                nextTarget = RENDER_BACKEND_URL;
            }

            console.info(`[CareLink API] ${currentBase} không hoạt động, tự động chuyển kết nối sang ${nextTarget}`);
            axiosClient.defaults.baseURL = nextTarget;
            originalRequest.baseURL = nextTarget;

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
