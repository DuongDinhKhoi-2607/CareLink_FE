import axiosClient from "./axiosClient";

// Khung API Điều dưỡng viên (Khớp với các controller BE)
export const caregiverApi = {
    // 1. Hồ sơ cá nhân & Nộp duyệt chứng chỉ (CaregiverProfile)
    getProfile: () => axiosClient.get("/api/caregiver/profile"),
    updateProfile: (data) => axiosClient.put("/api/caregiver/profile", data),
    submitVerification: (data) => axiosClient.post("/api/caregiver/verification", data),

    // 2. Tiếp nhận & Xử lý yêu cầu đặt lịch (BookingsController)
    getBookingRequests: (params) => axiosClient.get("/api/caregiver/bookings/requests", { params }),
    acceptBooking: (bookingId) => axiosClient.post(`/api/bookings/${bookingId}/accept`),
    rejectBooking: (bookingId, reason) => axiosClient.post(`/api/bookings/${bookingId}/reject`, { reason }),

    // 3. Lịch làm việc & Ca trực (Schedule)
    getSchedule: (params) => axiosClient.get("/api/caregiver/schedule", { params }),
    updateAvailability: (availability) => axiosClient.put("/api/caregiver/schedule/availability", availability),
};

export default caregiverApi;
