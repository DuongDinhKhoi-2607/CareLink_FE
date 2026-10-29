import axiosClient from "./axiosClient";

// ══════════════════════════════════════════════════════════════════
// Conversation, Messages & Booking Proposals API (Mục 4 — 8 API)
// ══════════════════════════════════════════════════════════════════
export const conversationApi = {
    // 1. Danh sách hội thoại (GET /api/v1/conversations)
    getConversations: (params) =>
        axiosClient.get("/api/v1/conversations", { params }),

    // 2. Mở hoặc tạo mới hội thoại giữa Customer & Nurse (POST /api/v1/conversations)
    getOrCreateConversation: (data) =>
        axiosClient.post("/api/v1/conversations", data),

    // 3. Chi tiết hội thoại theo ID (GET /api/v1/conversations/{id})
    getConversationDetail: (id) =>
        axiosClient.get(`/api/v1/conversations/${id}`),

    // 4. Lấy danh sách tin nhắn phân trang (GET /api/v1/conversations/{id}/messages)
    getMessages: (id, params) =>
        axiosClient.get(`/api/v1/conversations/${id}/messages`, { params }),

    // 5. Gửi tin nhắn văn bản (POST /api/v1/conversations/{id}/messages)
    sendMessage: (id, data) =>
        axiosClient.post(`/api/v1/conversations/${id}/messages`, data),

    // 6. Lấy danh sách đề xuất ca chăm sóc (GET /api/v1/conversations/{id}/proposals)
    getProposals: (id) =>
        axiosClient.get(`/api/v1/conversations/${id}/proposals`),

    // 7. Family tạo đề xuất ca chăm sóc mới (POST /api/v1/conversations/{id}/proposals)
    createProposal: (id, data) =>
        axiosClient.post(`/api/v1/conversations/${id}/proposals`, data),

    // 8. Caregiver chấp thuận đề xuất ca (PUT /api/v1/conversations/{conversationId}/proposals/{proposalId}/accept)
    // Tự động sinh Booking status PendingPayment phía Backend
    acceptProposal: (conversationId, proposalId, data) =>
        axiosClient.put(
            `/api/v1/conversations/${conversationId}/proposals/${proposalId}/accept`,
            data
        ),

    // 9. Caregiver từ chối đề xuất ca (PUT /api/v1/conversations/{conversationId}/proposals/{proposalId}/reject)
    rejectProposal: (conversationId, proposalId, data) =>
        axiosClient.put(
            `/api/v1/conversations/${conversationId}/proposals/${proposalId}/reject`,
            data
        ),

    // 10. Caregiver đề xuất mức giá mới (Counter-Offer)
    counterProposal: (conversationId, proposalId, data) =>
        axiosClient.put(
            `/api/v1/conversations/${conversationId}/proposals/${proposalId}/counter`,
            data
        ),

    // 11. Family chấp nhận mức giá mới từ Điều dưỡng (Accept Counter-Offer)
    acceptCounterProposal: (conversationId, proposalId) =>
        axiosClient.put(
            `/api/v1/conversations/${conversationId}/proposals/${proposalId}/accept-counter`
        ),
};

export default conversationApi;
