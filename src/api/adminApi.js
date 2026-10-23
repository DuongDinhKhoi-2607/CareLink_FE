import axiosClient from "./axiosClient";

// ══════════════════════════════════════════════════════════════════
// Admin / Backoffice API (Dành riêng cho Quản trị viên)
// ══════════════════════════════════════════════════════════════════
export const adminApi = {
    // ── 1. Thống kê Dashboard & Doanh thu ──
    getDashboardSummary: () =>
        axiosClient.get("/api/v1/admin/dashboard/summary"),
    getRevenueMetrics: (params) =>
        axiosClient.get("/api/v1/admin/dashboard/revenue", { params }),

    // ── 2. Xét duyệt hồ sơ Điều dưỡng (Nurse Verifications) ──
    getNurseVerifications: (params) =>
        axiosClient.get("/api/v1/admin/nurse-verifications", { params }),
    getExpiringLicenses: (params) =>
        axiosClient.get("/api/v1/admin/nurse-verifications/expiring-licenses", { params }),
    getNurseVerificationDetail: (id) =>
        axiosClient.get(`/api/v1/admin/nurse-verifications/${id}`),
    reviewNurseVerification: (id, data) =>
        axiosClient.put(`/api/v1/admin/nurse-verifications/${id}`, data),

    // ── 3. Quản lý yêu cầu rút tiền (Payouts) ──
    getPayouts: (params) =>
        axiosClient.get("/api/v1/admin/payouts", { params }),
    approvePayout: (id, data) =>
        axiosClient.put(`/api/v1/admin/payouts/${id}/approve`, data),
    rejectPayout: (id, data) =>
        axiosClient.put(`/api/v1/admin/payouts/${id}/reject`, data),

    // ── 4. Quản lý gói dịch vụ chăm sóc (Services) ──
    getServices: (params) =>
        axiosClient.get("/api/v1/services/admin", { params }),
    createService: (data) =>
        axiosClient.post("/api/v1/services", data),
    getServiceDetail: (id) =>
        axiosClient.get(`/api/v1/services/${id}`),
    updateService: (id, data) =>
        axiosClient.put(`/api/v1/services/${id}`, data),
    deleteService: (id) =>
        axiosClient.delete(`/api/v1/services/${id}`),
    toggleServiceStatus: (id, data) =>
        axiosClient.patch(`/api/v1/services/${id}/status`, data),

    // ── 5. Xử lý khiếu nại & Tranh chấp (Disputes) ──
    getDisputes: (params) =>
        axiosClient.get("/api/v1/admin/disputes", { params }),
    getDisputeDetail: (id) =>
        axiosClient.get(`/api/v1/disputes/${id}`),
    resolveDispute: (id, data) =>
        axiosClient.put(`/api/v1/admin/disputes/${id}`, data),

    // ── 6. Hoàn tiền ca chăm sóc (Refunds) ──
    refundBooking: (bookingId, data) =>
        axiosClient.post(`/api/v1/admin/bookings/${bookingId}/refund`, data),

    // ── 7. Giám sát toàn bộ ca chăm sóc trên hệ thống ──
    getAllBookings: (params) =>
        axiosClient.get("/api/v1/bookings", { params }),

    // ── 8. Thống kê & Sao kê Điều dưỡng (Admin Nurse Statistics) ──
    getNurseStatistics: (params) =>
        axiosClient.get("/api/v1/admin/nurses/statistics", { params }),
    getNurseDetailStatistics: (nurseId) =>
        axiosClient.get(`/api/v1/admin/nurses/statistics/${nurseId}`),
};

export default adminApi;
