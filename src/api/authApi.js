import axiosClient from "./axiosClient";

// ══════════════════════════════════════════════════════════════════
// Auth & Users API (Xác thực tài khoản & Quản lý profile người dùng)
// ══════════════════════════════════════════════════════════════════
export const authApi = {
    // 1. Đăng ký tài khoản mới (Customer hoặc Nurse)
    register: (payload) => axiosClient.post("/api/v1/auth/register", payload),

    // 2. Đăng nhập bằng Email & Password
    login: (credentials) => axiosClient.post("/api/v1/auth/login", credentials),

    // 3. Đăng nhập bằng Google (Google Sign-In idToken)
    googleLogin: (idToken) => axiosClient.post("/api/v1/auth/google-login", { idToken }),

    // 4. Làm mới Access Token bằng Refresh Token
    refreshToken: (payload) => axiosClient.post("/api/v1/auth/refresh-token", payload),

    // 5. Đăng xuất – Thu hồi Refresh Token
    logout: () => axiosClient.post("/api/v1/auth/logout"),

    // 6. Yêu cầu gửi mã OTP đặt lại mật khẩu về email
    forgotPassword: (email) => axiosClient.post("/api/v1/auth/forgot-password", { email }),

    // 7. Đặt lại mật khẩu mới bằng mã OTP
    resetPassword: (payload) => axiosClient.post("/api/v1/auth/reset-password", payload),

    // 8. Lấy thông tin cá nhân & profile của người dùng hiện tại (Customer hoặc Nurse)
    getMe: () => axiosClient.get("/api/v1/users/me"),

    // 9. Cập nhật thông tin cá nhân cơ bản (họ tên, SĐT, avatar)
    updateMe: (data) => axiosClient.put("/api/v1/users/me", data),
};

export default authApi;
