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

/**
 * Chuẩn hóa DTO UserProfileResponse từ Backend (GET /api/v1/users/me)
 * hỗ trợ đầy đủ cả 3 vai trò: Family (Customer), Caregiver (Nurse), Admin
 */
export const normalizeUserProfile = (data) => {
    if (!data) return null;
    const raw = data?.data || data?.user || data;
    const beRole = String(raw.role || "").toLowerCase();
    let role = "family";
    if (beRole.includes("admin") || raw.roleId === 1) role = "admin";
    else if (beRole.includes("nurse") || beRole.includes("caregiver") || raw.roleId === 3) role = "caregiver";
    else role = "family";

    const name =
        raw.customerProfile?.fullName ||
        raw.nurseProfile?.fullName ||
        raw.fullName ||
        raw.name ||
        (raw.email ? raw.email.split("@")[0] : "Người dùng CareLink");

    const phone =
        raw.customerProfile?.phone ||
        raw.nurseProfile?.phone ||
        raw.phone ||
        raw.phoneNumber ||
        "";

    const avatar =
        raw.customerProfile?.avatarUrl ||
        raw.nurseProfile?.avatarUrl ||
        raw.avatarUrl ||
        raw.avatar ||
        (role === "caregiver"
            ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
            : role === "admin"
            ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
            : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200");

    const nurseStatus = raw.nurseProfile?.status ?? (raw.verificationStatus ?? null);

    return {
        id: raw.id || null,
        email: raw.email || "",
        name,
        fullName: name,
        phone,
        phoneNumber: phone,
        role,
        avatar,
        avatarUrl: avatar,
        nurseStatus,
        customerProfile: raw.customerProfile || null,
        nurseProfile: raw.nurseProfile || null,
    };
};

/**
 * Tự động tải /api/v1/users/me và đồng bộ vào localStorage cho tất cả các Layouts / Header
 */
export const fetchAndSyncUserMe = async () => {
    try {
        const token = localStorage.getItem("carelink_token");
        if (!token) return null;
        const res = await authApi.getMe();
        const normalized = normalizeUserProfile(res?.data || res);
        if (normalized) {
            let current = {};
            try {
                current = JSON.parse(localStorage.getItem("carelink_user") || "{}");
            } catch {
                current = {};
            }
            const merged = { ...current, ...normalized };
            localStorage.setItem("carelink_user", JSON.stringify(merged));
            window.dispatchEvent(new Event("storage"));
            return merged;
        }
    } catch (err) {
        // Token hết hạn hoặc offline: giữ nguyên user đã cache
        console.warn("[CareLink] getMe sync info:", err?.response?.status || err.message);
    }
    return null;
};

export default authApi;

