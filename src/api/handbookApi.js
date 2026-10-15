import axiosClient from "./axiosClient";

// ══════════════════════════════════════════════════════════════════
// Medical Handbook API (Cẩm nang y tế – Public & Admin)
// ══════════════════════════════════════════════════════════════════
export const handbookApi = {
    // ── 1. Public Endpoints (Khách, Gia đình, Điều dưỡng) ──
    getPublishedArticles: (params) =>
        axiosClient.get("/api/v1/handbook", { params }),

    getArticleDetail: (idOrSlug) =>
        axiosClient.get(`/api/v1/handbook/${idOrSlug}`),

    // ── 2. Admin Endpoints (Quản trị viên) ──
    getAdminArticles: (params) =>
        axiosClient.get("/api/v1/handbook/admin", { params }),

    getAdminArticleDetail: (id) =>
        axiosClient.get(`/api/v1/handbook/admin/${id}`),

    createArticle: (data) =>
        axiosClient.post("/api/v1/handbook/admin", data),

    updateArticle: (id, data) =>
        axiosClient.put(`/api/v1/handbook/admin/${id}`, data),

    updateArticleStatus: (id, status) =>
        axiosClient.patch(`/api/v1/handbook/admin/${id}/status`, { status }),

    toggleFeatured: (id, featured) =>
        axiosClient.patch(`/api/v1/handbook/admin/${id}/featured`, { featured }),

    deleteArticle: (id, hardDelete = false) =>
        axiosClient.delete(`/api/v1/handbook/admin/${id}`, { params: { hardDelete } }),
};

export default handbookApi;
