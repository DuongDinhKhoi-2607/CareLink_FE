import axiosClient from "./axiosClient";

// Google OAuth 2.0 Client ID của CareLink
export const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "617746468209-jupm19jbfemqgdfv2gsbetlu4imretnk.apps.googleusercontent.com";

// ══════════════════════════════════════════════════════════════════
// Auth & Users API (Xác thực tài khoản & Quản lý profile người dùng)
// ══════════════════════════════════════════════════════════════════
export const authApi = {
    // 1. Đăng ký tài khoản mới (Customer = 0 hoặc Nurse = 1)
    register: ({ email, password, role = 0 }) => {
        const normalizedRole =
            role === 1 || role === "caregiver" || role === "nurse" || role === "Nurse"
                ? 1
                : 0;
        return axiosClient.post("/api/v1/auth/register", {
            email: email?.trim(),
            password,
            role: normalizedRole,
        });
    },

    // 2. Đăng nhập bằng Email & Password
    login: ({ email, password }) =>
        axiosClient.post("/api/v1/auth/login", {
            email: email?.trim(),
            password,
        }),

    // 3. Đăng nhập bằng Google (Google Sign-In idToken)
    googleLogin: (idTokenOrPayload, role = 0) => {
        if (typeof idTokenOrPayload === "object" && idTokenOrPayload !== null) {
            return axiosClient.post("/api/v1/auth/google-login", idTokenOrPayload);
        }
        return axiosClient.post("/api/v1/auth/google-login", {
            idToken: idTokenOrPayload,
            role: role === 1 || role === "caregiver" || role === "nurse" ? 1 : 0,
        });
    },

    // 4. Làm mới Access Token bằng Refresh Token
    refreshToken: (tokenOrPayload) => {
        const refreshToken =
            typeof tokenOrPayload === "string"
                ? tokenOrPayload
                : tokenOrPayload?.refreshToken;
        return axiosClient.post("/api/v1/auth/refresh-token", { refreshToken });
    },

    // 5. Đăng xuất – Thu hồi Refresh Token
    logout: () => axiosClient.post("/api/v1/auth/logout"),

    // 6. Yêu cầu gửi mã OTP đặt lại mật khẩu về email
    forgotPassword: (email) =>
        axiosClient.post("/api/v1/auth/forgot-password", {
            email: typeof email === "string" ? email.trim() : email?.email?.trim(),
        }),

    // 7. Đặt lại mật khẩu mới bằng mã OTP
    resetPassword: ({ email, otp, newPassword }) =>
        axiosClient.post("/api/v1/auth/reset-password", {
            email: email?.trim(),
            otp: String(otp || "").trim(),
            newPassword,
        }),

    // 8. Lấy thông tin cá nhân & profile của người dùng hiện tại (Customer hoặc Nurse)
    getMe: () => axiosClient.get("/api/v1/users/me"),

    // 9. Cập nhật thông tin cá nhân cơ bản (họ tên, SĐT, avatar)
    updateMe: (data) => axiosClient.put("/api/v1/users/me", data),
};

export default authApi;
