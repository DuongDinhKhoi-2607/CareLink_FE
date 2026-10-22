import axiosClient from "./axiosClient";

// ══════════════════════════════════════════════════════════════════
// Family / Customer API (Dành cho Khách hàng & Gia đình)
// ══════════════════════════════════════════════════════════════════
export const familyApi = {
    // ── 1. Sổ địa chỉ nhận chăm sóc (Addresses) ──
    getAddresses: () => axiosClient.get("/api/v1/addresses"),
    createAddress: (data) => axiosClient.post("/api/v1/addresses", data),
    getAddressDetail: (id) => axiosClient.get(`/api/v1/addresses/${id}`),
    updateAddress: (id, data) => axiosClient.put(`/api/v1/addresses/${id}`, data),
    deleteAddress: (id) => axiosClient.delete(`/api/v1/addresses/${id}`),

    // ── 2. Hồ sơ người nhận chăm sóc (Recipients) ──
    getRecipients: () => axiosClient.get("/api/v1/recipients"),
    createRecipient: (data) => axiosClient.post("/api/v1/recipients", data),
    getRecipientDetail: (id) => axiosClient.get(`/api/v1/recipients/${id}`),
    updateRecipient: (id, data) => axiosClient.put(`/api/v1/recipients/${id}`, data),
    deleteRecipient: (id) => axiosClient.delete(`/api/v1/recipients/${id}`),
    getRecipientHealthHistory: (recipientId) =>
        axiosClient.get(`/api/v1/recipients/${recipientId}/health-history`),

    // ── 3. Tìm kiếm & Xem thông tin điều dưỡng (Nurses Search) ──
    searchNurses: (params) => axiosClient.get("/api/v1/nurses/search", { params }),
    getNurseReviews: (nurseId, params) =>
        axiosClient.get(`/api/v1/nurses/${nurseId}/reviews`, { params }),
    getNurseRatingSummary: (nurseId) =>
        axiosClient.get(`/api/v1/nurses/${nurseId}/reviews/summary`),

    // ── 4. Đặt lịch & Quản lý ca chăm sóc (Bookings) ──
    createBooking: (data) => axiosClient.post("/api/v1/bookings", data),
    getBookings: (params) => axiosClient.get("/api/v1/bookings", { params }),
    getBookingDetail: (id) => axiosClient.get(`/api/v1/bookings/${id}`),
    cancelBooking: (id, data) => axiosClient.put(`/api/v1/bookings/${id}/cancel`, data),

    // ── 5. Thanh toán trực tuyến PayOS (Payments) ──
    createPaymentLink: (bookingId, params) =>
        axiosClient.post(`/api/v1/bookings/${bookingId}/payments`, null, { params }),
    getPaymentDetail: (bookingId) =>
        axiosClient.get(`/api/v1/bookings/${bookingId}/payments`),

    // ── 6. Xem bệnh án theo ca (Health Records) ──
    getBookingHealthRecord: (bookingId) =>
        axiosClient.get(`/api/v1/bookings/${bookingId}/health-record`),
    getRecipientHealthHistory: (recipientId, params) =>
        axiosClient.get(`/api/v1/recipients/${recipientId}/health-history`, { params }),

    // ── 7. Đánh giá & Khiếu nại (Reviews & Disputes) ──
    createReview: (bookingId, data) =>
        axiosClient.post(`/api/v1/bookings/${bookingId}/reviews`, data),
    getReviewDetail: (id) => axiosClient.get(`/api/v1/reviews/${id}`),
    getUserReviews: (userId, params) =>
        axiosClient.get(`/api/v1/reviews/users/${userId}`, { params }),
    createDispute: (bookingId, data) =>
        axiosClient.post(`/api/v1/bookings/${bookingId}/disputes`, data),
    getDisputeDetail: (id) => axiosClient.get(`/api/v1/disputes/${id}`),

    // ── 8. Gói dịch vụ chăm sóc đang hoạt động (Services) ──
    getServices: () => axiosClient.get("/api/v1/services"),
    getServiceDetail: (id) => axiosClient.get(`/api/v1/services/${id}`),
};

export default familyApi;
