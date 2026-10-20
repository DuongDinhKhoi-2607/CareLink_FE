import axiosClient from "./axiosClient";

// ══════════════════════════════════════════════════════════════════
// Module 4: Notification System API Client
// ══════════════════════════════════════════════════════════════════
export const notificationApi = {
    /**
     * Lấy danh sách thông báo của người dùng hiện tại (có phân trang & lọc).
     * @param {Object} params - { isRead?: boolean, pageNumber?: number, pageSize?: number }
     * @returns {Promise<{ items: Array, totalCount: number, pageNumber: number, pageSize: number, totalPages: number, hasPreviousPage: boolean, hasNextPage: boolean }>}
     */
    getNotifications: (params = {}) =>
        axiosClient.get("/api/v1/notifications", { params }),

    /**
     * Lấy số lượng thông báo chưa đọc của người dùng hiện tại.
     * @returns {Promise<{ unreadCount: number }>}
     */
    getUnreadCount: () =>
        axiosClient.get("/api/v1/notifications/unread-count"),

    /**
     * Đánh dấu một thông báo cụ thể là đã đọc.
     * @param {string} id - UUID của thông báo
     * @returns {Promise<{ success: boolean, message: string }>}
     */
    markAsRead: (id) =>
        axiosClient.put(`/api/v1/notifications/${id}/read`),

    /**
     * Đánh dấu tất cả thông báo chưa đọc của người dùng là đã đọc.
     * @returns {Promise<{ success: boolean, markedCount: number, message: string }>}
     */
    markAllAsRead: () =>
        axiosClient.put("/api/v1/notifications/read-all"),
};

export default notificationApi;
