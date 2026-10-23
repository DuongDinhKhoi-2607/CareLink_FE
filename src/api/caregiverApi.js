import axiosClient from "./axiosClient";

// ══════════════════════════════════════════════════════════════════
// Caregiver / Nurse API (Dành cho Điều dưỡng viên)
// ══════════════════════════════════════════════════════════════════
export const caregiverApi = {
    // ── 1. Hồ sơ năng lực & Khu vực hoạt động ──
    getProfile: () => axiosClient.get("/api/v1/nurse/profile"),
    updateProfile: (data) => axiosClient.put("/api/v1/nurse/profile", data),

    // ── 2. Quản lý lịch làm việc rảnh / bận & Nghỉ đột xuất ──
    getAvailability: () => axiosClient.get("/api/v1/nurse/availability"),
    addAvailability: (data) => axiosClient.post("/api/v1/nurse/availability", data),
    setAvailability: (data) => axiosClient.put("/api/v1/nurse/availability", data),
    deleteAvailability: (id) => axiosClient.delete(`/api/v1/nurse/availability/${id}`),

    // Luồng 2: Bật/Tắt chế độ nhận ca (Online / Offline Toggle)
    setAcceptingBookings: (isAcceptingBookings) =>
        axiosClient.put("/api/v1/nurse/accepting-bookings", { isAcceptingBookings }),
    updateAcceptingBookings: (isAcceptingBookings) =>
        axiosClient.patch("/api/v1/nurse/status/accepting-bookings", { isAcceptingBookings }),

    // Luồng 2: Quản lý ngày nghỉ đột xuất / Lịch bận (Blackout Dates)
    getUnavailabilities: (params) =>
        axiosClient.get("/api/v1/nurse/unavailabilities", { params }),
    addUnavailability: (data) =>
        axiosClient.post("/api/v1/nurse/unavailabilities", data),
    deleteUnavailability: (id) =>
        axiosClient.delete(`/api/v1/nurse/unavailabilities/${id}`),

    // ── 3. Nộp hồ sơ chứng thực & Giấy phép hành nghề & OTP Sinh viên ──
    uploadFile: (formData) => axiosClient.post("/api/v1/uploads", formData),
    uploadDocuments: (data) => axiosClient.post("/api/v1/nurse/documents", data),
    getDocuments: () => axiosClient.get("/api/v1/nurse/documents"),
    reSubmitDocuments: (data) => axiosClient.post("/api/v1/nurse/documents/re-submit", data),
    getVerificationStatus: () => axiosClient.get("/api/v1/nurse/verification-status"),

    // Luồng 1: Xác thực OTP Email trường (.edu.vn / .edu) cho Sinh viên Y khoa
    sendStudentEmailOtp: (data) =>
        axiosClient.post("/api/v1/nurse/student-email/send-otp", data),
    verifyStudentEmailOtp: (data) =>
        axiosClient.post("/api/v1/nurse/student-email/verify-otp", data),

    // ── 4. Tiếp nhận & Quản lý ca chăm sóc (Bookings) ──
    getBookings: (params) => axiosClient.get("/api/v1/bookings", { params }),
    getBookingDetail: (id) => axiosClient.get(`/api/v1/bookings/${id}`),
    acceptBooking: (id) => axiosClient.put(`/api/v1/bookings/${id}/accept`),
    rejectBooking: (id, data) => axiosClient.put(`/api/v1/bookings/${id}/reject`, data),
    startBooking: (id, data) => axiosClient.put(`/api/v1/bookings/${id}/start`, data || {}),
    finishBooking: (id) => axiosClient.put(`/api/v1/bookings/${id}/finish`),
    nurseConfirmBooking: (id) => axiosClient.put(`/api/v1/bookings/${id}/nurse-confirm`),
    cancelBooking: (id, data) => axiosClient.put(`/api/v1/bookings/${id}/cancel`, data),

    // ── 5. Ghi nhận bệnh án lâm sàng (Health Records) ──
    submitHealthRecord: (bookingId, data) =>
        axiosClient.post(`/api/v1/bookings/${bookingId}/health-record`, data),
    updateHealthRecord: (bookingId, data) =>
        axiosClient.put(`/api/v1/bookings/${bookingId}/health-record`, data),
    getHealthRecord: (bookingId) =>
        axiosClient.get(`/api/v1/bookings/${bookingId}/health-record`),

    // ── 6. Ví điều dưỡng & Rút tiền (Wallet & Payouts) ──
    getWallet: () => axiosClient.get("/api/v1/wallet/me"),
    getWalletTransactions: (params) =>
        axiosClient.get("/api/v1/wallet/me/transactions", { params }),
    requestPayout: (data) => axiosClient.post("/api/v1/wallet/payouts", data),
    getMyPayouts: () => axiosClient.get("/api/v1/wallet/payouts"),

    // ── 7. Đánh giá nhận xét ──
    getReviewsReceived: (userId, params) =>
        axiosClient.get(`/api/v1/reviews/users/${userId}`, { params }),
    reviewCustomer: (bookingId, data) =>
        axiosClient.post(`/api/v1/bookings/${bookingId}/reviews`, data),

    // ── 8. Bảng giá cá nhân & Sẵn sàng nhận việc (Nurse Pricing & Readiness) ──
    getMyPricing: () => axiosClient.get("/api/v1/nurses/pricing/me"),
    updateMyPricing: (data) => axiosClient.put("/api/v1/nurses/pricing/me", data),
    getMyReadiness: () => axiosClient.get("/api/v1/nurses/pricing/me/readiness"),
    getNursePricing: (nurseId) => axiosClient.get(`/api/v1/nurses/pricing/${nurseId}`),
};

export default caregiverApi;
