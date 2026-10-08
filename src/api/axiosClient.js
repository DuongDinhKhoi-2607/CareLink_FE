import axios from "axios";

// Cấu hình hạ tầng HTTP Axios dùng chung cho toàn bộ dự án CareLink
// Đọc URL từ biến môi trường VITE_API_URL hoặc fallback về localhost:5000 khi chạy local
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
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

// 2. Response Interceptor: Trả về trực tiếp data & xử lý lỗi HTTP chung (401, 403, 500)
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Phiên đăng nhập hết hạn hoặc chưa đăng nhập
            console.warn("[CareLink API] Phiên đăng nhập đã hết hạn (401)");
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
