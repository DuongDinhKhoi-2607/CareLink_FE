import axiosClient from "./axiosClient";

// Khung API Quản trị viên (Vy phụ trách - Khớp với các controller BE)
export const adminApi = {
    // 1. Thống kê & Báo cáo tổng quan (AdminDashboardController)
    getDashboardMetrics: () => axiosClient.get("/api/admin/dashboard"),
    getRevenueMetrics: (params) => axiosClient.get("/api/admin/dashboard/revenue", { params }),

    // 2. Quản lý gói dịch vụ chăm sóc (ServicesController)
    getServices: () => axiosClient.get("/api/services"),
    createService: (data) => axiosClient.post("/api/services", data),
    updateService: (id, data) => axiosClient.put(`/api/services/${id}`, data),
    deleteService: (id) => axiosClient.delete(`/api/services/${id}`),

    // 3. Phê duyệt hồ sơ điều dưỡng (CaregiverApprovals)
    getPendingApprovals: (params) => axiosClient.get("/api/admin/approvals", { params }),
    approveCaregiver: (id, data) => axiosClient.post(`/api/admin/approvals/${id}/approve`, data),
    rejectCaregiver: (id, reason) => axiosClient.post(`/api/admin/approvals/${id}/reject`, { reason }),

    // 4. Quản lý người dùng & phân quyền (UserManagement)
    getUsers: (params) => axiosClient.get("/api/admin/users", { params }),
    toggleUserStatus: (id, status) => axiosClient.patch(`/api/admin/users/${id}/status`, { status }),

    // 5. Quản lý khiếu nại & tranh chấp (DisputesController)
    getDisputes: (params) => axiosClient.get("/api/disputes", { params }),
    resolveDispute: (id, resolution) => axiosClient.post(`/api/disputes/${id}/resolve`, resolution),
};

export default adminApi;
