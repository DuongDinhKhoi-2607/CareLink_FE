import axiosClient from "./axiosClient";

// Khung API Xác thực & Người dùng (Dùng chung cho cả 3 Role)
export const authApi = {
    // Đăng nhập hệ thống
    login: (credentials) => axiosClient.post("/api/auth/login", credentials),

    // Đăng ký tài khoản (Family / Caregiver)
    register: (data) => axiosClient.post("/api/auth/register", data),

    // Lấy thông tin cá nhân hiện tại theo Token
    getMe: () => axiosClient.get("/api/auth/me"),

    // Đăng xuất
    logout: () => axiosClient.post("/api/auth/logout"),

    // Quên mật khẩu & Đổi mật khẩu
    forgotPassword: (email) => axiosClient.post("/api/auth/forgot-password", { email }),
    resetPassword: (payload) => axiosClient.post("/api/auth/reset-password", payload),
};

export default authApi;
