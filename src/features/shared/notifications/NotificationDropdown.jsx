import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    BellOff,
    CheckCheck,
    RefreshCw,
    AlertCircle,
    Info,
} from "lucide-react";
import notificationApi from "../../../api/notificationApi";
import NotificationItem from "./NotificationItem";
import { resolveNotificationRoute } from "./notificationUtils";
import { mockNotifications, mockUnreadCount } from "./notificationMockData";

export default function NotificationDropdown({ userRole = "", align = "right" }) {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // State
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(() => {
        return import.meta.env.VITE_ENABLE_NOTIFICATION_DEMO === "true";
    });

    // ── 1. Lấy số lượng thông báo chưa đọc (Polling nhẹ mỗi 45s) ──
    const fetchUnreadCount = useCallback(async () => {
        if (isDemoMode) {
            setUnreadCount(mockUnreadCount);
            return;
        }

        try {
            const res = await notificationApi.getUnreadCount();
            if (typeof res?.unreadCount === "number") {
                setUnreadCount(res.unreadCount);
            }
        } catch (err) {
            // Không set error ở polling nền để tránh làm phiền giao diện
            console.warn("[CareLink Notifications] Không thể lấy unread count:", err?.message);
        }
    }, [isDemoMode]);

    // ── 2. Lấy danh sách 5 thông báo gần nhất khi mở dropdown ──
    const fetchNotifications = useCallback(async () => {
        if (isDemoMode) {
            setNotifications(mockNotifications);
            setUnreadCount(mockNotifications.filter((n) => !n.isRead).length);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await notificationApi.getNotifications({ pageNumber: 1, pageSize: 6 });
            const items = Array.isArray(res?.items) ? res.items : [];
            setNotifications(items);

            // Cập nhật lại unread count từ danh sách hoặc từ endpoint
            const unreadInList = items.filter((n) => !n.isRead).length;
            setUnreadCount(unreadInList);
        } catch (err) {
            console.error("[CareLink Notifications] Lỗi tải thông báo:", err);
            setError("Không thể tải thông báo từ máy chủ. Vui lòng kiểm tra kết nối API.");
        } finally {
            setLoading(false);
        }
    }, [isDemoMode]);

    // ── 3. Polling chu kỳ 45s & Cập nhật khi tab hoạt động trở lại ──
    useEffect(() => {
        fetchUnreadCount();

        const interval = setInterval(() => {
            if (document.visibilityState === "visible") {
                fetchUnreadCount();
            }
        }, 45000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchUnreadCount();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [fetchUnreadCount]);

    // Khi người dùng bấm mở dropdown: nạp danh sách chi tiết
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    // ── 4. Đóng dropdown khi click ra ngoài hoặc bấm phím Escape ──
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    // ── 5. Xử lý Đánh dấu 1 thông báo đã đọc và Chuyển trang ──
    const handleItemClick = async (item) => {
        if (!item) return;

        // Optimistic UI update: Đổi trạng thái sang đã đọc ngay lập tức
        if (!item.isRead) {
            setNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));

            if (!isDemoMode && !item.id.startsWith("demo-")) {
                try {
                    await notificationApi.markAsRead(item.id);
                } catch (err) {
                    console.warn("[CareLink Notifications] Không thể cập nhật trạng thái đã đọc:", err);
                }
            }
        }

        // Tự động đóng dropdown
        setIsOpen(false);

        // Điều hướng đến đúng phân hệ
        const route = resolveNotificationRoute(item.type, item.referenceId, userRole);
        if (route) {
            navigate(route);
        }
    };

    // ── 6. Xử lý Đánh dấu tất cả thông báo là đã đọc ──
    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;

        // Optimistic update
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);

        if (!isDemoMode) {
            try {
                await notificationApi.markAllAsRead();
            } catch (err) {
                console.error("[CareLink Notifications] Lỗi khi đánh dấu tất cả đã đọc:", err);
                // Rollback nếu cần thiết
                fetchNotifications();
            }
        }
    };

    // ── 7. Bật / Tắt Demo Mode khi kiểm thử giao diện ──
    const handleToggleDemoMode = () => {
        setIsDemoMode((prev) => !prev);
        setError(null);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Nút Chuông Thông Báo (Trigger) */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center group ${isOpen
                        ? "bg-teal-50 text-[#00677c] ring-2 ring-[#00677c]/20"
                        : "text-slate-600 hover:text-[#00677c] hover:bg-slate-100/80 active:scale-95"
                    }`}
                title={unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Thông báo"}
                aria-label="Xem thông báo"
                aria-expanded={isOpen}
            >
                <Bell className="w-5 h-5 transition-transform group-hover:scale-105" strokeWidth={1.9} />

                {/* Huy hiệu Badge số lượng thông báo chưa đọc */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 bg-rose-500 text-white text-[10.5px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-75 duration-200">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Popover */}
            {isOpen && (
                <div
                    className={`absolute ${align === "left" ? "left-0" : "right-0"
                        } mt-2 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right`}
                >
                    {/* Header của Dropdown */}
                    <div className="p-3.5 px-4 bg-slate-50/90 border-b border-slate-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-800">Thông báo</h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#00677c]/10 text-[#00677c]">
                                    {unreadCount} mới
                                </span>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                className="text-[11.5px] text-[#00677c] hover:text-[#005566] font-semibold flex items-center gap-1 transition-colors hover:underline cursor-pointer"
                                title="Đánh dấu tất cả thông báo là đã đọc"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>Đã đọc tất cả</span>
                            </button>
                        )}
                    </div>

                    {/* Banner hiển thị Chế độ Demo / Dữ liệu mẫu (Nếu đang bật) */}
                    {isDemoMode && (
                        <div className="bg-amber-50/90 border-b border-amber-200/70 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-amber-800">
                            <div className="flex items-center gap-1.5 font-medium">
                                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>Dữ liệu mẫu — API chưa kết nối</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleDemoMode}
                                className="text-amber-900 font-bold hover:underline cursor-pointer text-[10.5px]"
                                title="Chuyển sang gọi API thật"
                            >
                                Tắt demo
                            </button>
                        </div>
                    )}

                    {/* Danh sách thông báo */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                        {loading ? (
                            /* Skeleton Loading */
                            <div className="p-4 flex flex-col gap-3">
                                {[1, 2, 3].map((key) => (
                                    <div key={key} className="flex gap-3 animate-pulse">
                                        <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-3 bg-slate-200 rounded-md w-3/4" />
                                            <div className="h-2.5 bg-slate-100 rounded-md w-full" />
                                            <div className="h-2 bg-slate-100 rounded-md w-1/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            /* Error State with Retry Button & Demo Option */
                            <div className="p-6 text-center flex flex-col items-center gap-2.5">
                                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <p className="text-xs text-slate-700 font-medium px-4 leading-relaxed">
                                    {error}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <button
                                        type="button"
                                        onClick={fetchNotifications}
                                        className="px-3 py-1.5 bg-[#00677c] hover:bg-[#005566] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        <span>Thử lại</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleToggleDemoMode}
                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                                    >
                                        Xem dữ liệu mẫu
                                    </button>
                                </div>
                            </div>
                        ) : notifications.length === 0 ? (
                            /* Empty State */
                            <div className="p-8 text-center flex flex-col items-center gap-2 text-slate-400">
                                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 mb-1">
                                    <BellOff className="w-6 h-6 stroke-[1.5]" />
                                </div>
                                <p className="text-xs font-semibold text-slate-600">Bạn chưa có thông báo nào</p>
                                <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                                    Các thông báo mới về ca chăm sóc và lịch hẹn sẽ xuất hiện tại đây.
                                </p>
                            </div>
                        ) : (
                            /* Danh sách các NotificationItem */
                            notifications.map((item) => (
                                <NotificationItem
                                    key={item.id}
                                    notification={item}
                                    onItemClick={handleItemClick}
                                    userRole={userRole}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer của Dropdown */}
                    <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                        <span className="text-[11px] text-slate-400">CareLink Realtime System</span>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-[11.5px] font-medium text-slate-600 hover:text-[#00677c] transition-colors cursor-pointer"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
