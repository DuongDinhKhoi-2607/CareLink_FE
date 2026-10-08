import axiosClient from "./axiosClient";

// Khung API Khách hàng / Gia đình (Nguyên phụ trách - Khớp với các controller BE)
export const familyApi = {
    // 1. Tìm kiếm điều dưỡng (NurseSearchController)
    searchCaregivers: (params) => axiosClient.get("/api/nurses/search", { params }),
    getCaregiverDetail: (id) => axiosClient.get(`/api/nurses/${id}`),

    // 2. Đặt lịch & Quản lý lịch hẹn (BookingsController)
    createBooking: (data) => axiosClient.post("/api/bookings", data),
    getMyBookings: (params) => axiosClient.get("/api/bookings/my", { params }),
    getBookingDetail: (id) => axiosClient.get(`/api/bookings/${id}`),
    cancelBooking: (id, reason) => axiosClient.post(`/api/bookings/${id}/cancel`, { reason }),

    // 3. Hồ sơ người thân & Bệnh án (HealthRecordsController)
    getRelatives: () => axiosClient.get("/api/relatives"),
    createRelative: (data) => axiosClient.post("/api/relatives", data),
    updateRelative: (id, data) => axiosClient.put(`/api/relatives/${id}`, data),
    getHealthRecords: (relativeId) => axiosClient.get(`/api/health-records/${relativeId}`),

    // 4. Đánh giá & Nhận xét điều dưỡng (ReviewsController)
    createReview: (bookingId, data) => axiosClient.post(`/api/bookings/${bookingId}/reviews`, data),
    getCaregiverReviews: (caregiverId) => axiosClient.get(`/api/reviews/caregiver/${caregiverId}`),
};

export default familyApi;
