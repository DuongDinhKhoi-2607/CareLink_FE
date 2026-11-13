import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const VISITOR_KEY = "carelink_visitor_id";
const SESSION_KEY = "carelink_session_id";
const LAST_ACTIVE_KEY = "carelink_session_last_active";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 phút không hoạt động thì tạo session mới

/**
 * Sinh UUID an toàn tương thích mọi trình duyệt
 */
function generateUUID() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Lấy hoặc khởi tạo Visitor ID duy nhất trên trình duyệt (First-party LocalStorage)
 */
export function getOrCreateVisitorId() {
    try {
        let visitorId = localStorage.getItem(VISITOR_KEY);
        if (!visitorId || visitorId.length < 5) {
            visitorId = generateUUID();
            localStorage.setItem(VISITOR_KEY, visitorId);
        }
        return visitorId;
    } catch {
        return "guest-fallback-" + Date.now();
    }
}

/**
 * Quản lý Session ID theo thời gian không hoạt động (30 phút)
 * Hỗ trợ đồng bộ đa tab và giữ nguyên phiên khi reload/mở lại tab trong 30 phút
 */
export function getOrCreateSessionId() {
    try {
        const now = Date.now();
        const savedSessionId = localStorage.getItem(SESSION_KEY);
        const lastActiveStr = localStorage.getItem(LAST_ACTIVE_KEY);
        const lastActive = lastActiveStr ? Number(lastActiveStr) : 0;

        // Nếu session đã tồn tại và chưa quá 30 phút không hoạt động -> Tái sử dụng
        if (savedSessionId && lastActive > 0 && now - lastActive < SESSION_TIMEOUT_MS) {
            localStorage.setItem(LAST_ACTIVE_KEY, String(now));
            return savedSessionId;
        }

        // Hết hạn 30 phút hoặc chưa có session -> Tạo session mới
        const newSessionId = generateUUID();
        localStorage.setItem(SESSION_KEY, newSessionId);
        localStorage.setItem(LAST_ACTIVE_KEY, String(now));
        return newSessionId;
    } catch {
        return "session-fallback-" + Date.now();
    }
}

/**
 * Gửi sự kiện tracking lên Backend ngầm (Non-blocking, an toàn)
 * @param {string} eventType Tên sự kiện (VD: 'PAGE_VIEW', 'SEARCH_NURSE'...)
 * @param {object} metadata Dữ liệu nghiệp vụ kèm theo (không lưu thông tin nhạy cảm)
 * @param {string|null} customTitle Tiêu đề trang tuỳ chỉnh
 */
export function trackEvent(eventType, metadata = {}, customTitle = null) {
    try {
        if (!eventType || typeof eventType !== "string") return;

        const visitorId = getOrCreateVisitorId();
        const sessionId = getOrCreateSessionId();

        // Chỉ lấy pathname, loại bỏ query string và hash để chống lộ token/dữ liệu nhạy cảm
        const rawPath = typeof window !== "undefined" && window.location ? window.location.pathname : "/";
        const pageUrl = rawPath || "/";
        const pageTitle = customTitle || (typeof document !== "undefined" ? document.title : "CareLink");

        const payload = {
            visitorId,
            sessionId,
            eventType: eventType.trim().toUpperCase(),
            pageUrl,
            pageTitle: pageTitle ? String(pageTitle).slice(0, 255) : null,
            metadata: metadata && typeof metadata === "object" ? metadata : {},
        };

        // Gửi ngầm qua axiosClient (tự động đính kèm Bearer token nếu đã login)
        axiosClient
            .post("/api/v1/tracking/events", payload, {
                // Timeout ngắn để tracking không bao giờ cản trở ứng dụng
                timeout: 5000,
            })
            .catch(() => {
                // Nuốt lỗi im lặng, tuyệt đối không văng lỗi ra UI người dùng
            });
    } catch {
        // Dự phòng lỗi an toàn tuyệt đối
    }
}

/**
 * Hook lắng nghe thay đổi route React Router để ghi nhận PAGE_VIEW
 * Chống trùng lặp do React StrictMode hoặc re-render nội bộ
 */
export function usePageTracking() {
    const location = useLocation();
    const lastTrackedPathRef = useRef(null);

    useEffect(() => {
        const currentPath = location.pathname || "/";

        // Chỉ ghi nhận khi pathname thực sự đổi khác với lần trước
        if (lastTrackedPathRef.current !== currentPath) {
            lastTrackedPathRef.current = currentPath;
            trackEvent("PAGE_VIEW");
        }
    }, [location.pathname]);
}

/**
 * Component bọc dùng ngay bên trong <BrowserRouter> của App.jsx
 */
export function PageTracker() {
    usePageTracking();
    return null;
}

export default {
    getOrCreateVisitorId,
    getOrCreateSessionId,
    trackEvent,
    usePageTracking,
    PageTracker,
};

