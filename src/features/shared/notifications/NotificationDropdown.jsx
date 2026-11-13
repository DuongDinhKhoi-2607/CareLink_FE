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
import adminApi from "../../../api/adminApi";
import NotificationItem from "./NotificationItem";
import { resolveNotificationRoute } from "./notificationUtils";
import { getMockNotificationsByRole, getMockUnreadCountByRole } from "./notificationMockData";

// Helper đọc và lưu danh sách ID thông báo vận hành của Admin đã đọc
const getAdminReadOpIds = () => {
    try {
        const raw = localStorage.getItem("carelink_admin_read_op_notifs");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveAdminReadOpId = (id) => {
    try {
        const readIds = getAdminReadOpIds();
        if (!readIds.includes(id)) {
            readIds.push(id);
            localStorage.setItem("carelink_admin_read_op_notifs", JSON.stringify(readIds));
        }
    } catch {}
};

export default function NotificationDropdown({ userRole = "", align = "right" }) {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // State
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    // ── 0. Lấy danh sách các sự kiện nghiệp vụ thực tế dành cho Quản trị viên ──
    const fetchAdminOperationalItems = useCallback(async () => {
        const readIds = getAdminReadOpIds();
        const opItems = [];

        try {
            const [payoutsRes, verifsRes, disputesRes] = await Promise.allSettled([
                adminApi.getPayouts({ pageNumber: 1, pageSize: 50 }),
                adminApi.getNurseVerifications({ pageNumber: 1, pageSize: 50 }),
                adminApi.getDisputes({ pageNumber: 1, pageSize: 50 }),
            ]);

            // 1. Yêu cầu rút tiền từ Điều dưỡng đang chờ duyệt
            if (payoutsRes.status === "fulfilled") {
                const res = payoutsRes.value;
                const list = Array.isArray(res) ? res : res?.items || res?.data?.items || res?.data || [];
                const pending = list.filter(
                    (w) => w.status === 1 || w.status === "Pending" || w.status === "Chờ duyệt"
                );
                pending.forEach((w) => {
                    const id = `op-payout-${w.id}`;
                    opItems.push({
                        id,
                        title: "Yêu cầu rút tiền cần duyệt",
                        message: `Điều dưỡng ${w.nurseName || w.caregiverName || w.bankAccountName || "Điều dưỡng"} vừa gửi yêu cầu rút ${Number(w.amount || 0).toLocaleString("vi-VN")} ₫ về ${w.bankName || "ngân hàng"}.`,
                        type: "PAYOUT_REQUESTED",
                        referenceId: w.id,
                        isRead: readIds.includes(id),
                        createdAt: w.createdAt || new Date().toISOString(),
                        isOperational: true,
                        targetRoute: "/admin/finance?tab=withdrawals",
                    });
                });
            }

            // 2. Hồ sơ chứng chỉ y tế của Điều dưỡng đang chờ thẩm định
            if (verifsRes.status === "fulfilled") {
                const res = verifsRes.value;
                const list = Array.isArray(res) ? res : res?.items || res?.data?.items || res?.data || [];
                const pending = list.filter(
                    (v) => v.verificationStatus === 1 || v.verificationStatus === 4 || v.status === "Pending"
                );
                pending.forEach((v) => {
                    const id = `op-verif-${v.id || v.nurseId}`;
                    opItems.push({
                        id,
                        title: "Hồ sơ điều dưỡng cần thẩm định",
                        message: `Ứng viên ${v.fullName || v.nurseName || "Điều dưỡng"} vừa nộp hồ sơ chứng chỉ hành nghề y tế cần thẩm định duyệt.`,
                        type: "NURSE_VERIFICATION_SUBMITTED",
                        referenceId: v.id || v.nurseId,
                        isRead: readIds.includes(id),
                        createdAt: v.submittedAt || v.createdAt || new Date().toISOString(),
                        isOperational: true,
                        targetRoute: "/admin/approvals",
                    });
                });
            }

            // 3. Khiếu nại từ khách hàng / ca chăm sóc đang chờ can thiệp
            if (disputesRes.status === "fulfilled") {
                const res = disputesRes.value;
                const list = Array.isArray(res) ? res : res?.items || res?.data?.items || res?.data || [];
                const open = list.filter(
                    (d) => d.status === 1 || d.status === "Open" || d.status === "Đang xác minh"
                );
                open.forEach((d) => {
                    const id = `op-disp-${d.id}`;
                    opItems.push({
                        id,
                        title: "Khiếu nại ca chăm sóc mới",
                        message: `Ca ${d.bookingCode || "trực"} có khiếu nại: "${d.reason || d.title || "Cần can thiệp hỗ trợ giải quyết"}"`,
                        type: "DISPUTE_SUBMITTED",
                        referenceId: d.id,
                        isRead: readIds.includes(id),
                        createdAt: d.createdAt || new Date().toISOString(),
                        isOperational: true,
                        targetRoute: "/admin/disputes",
                    });
                });
            }
        } catch {
            // Không chặn ứng dụng nếu API phụ gặp sự cố
        }

        return opItems;
    }, []);

    // ── 1. Lấy số lượng thông báo chưa đọc (Polling nhẹ mỗi 30s) ──
    const fetchUnreadCount = useCallback(async () => {
        try {
            let totalUnread = 0;

            // Lấy từ API notification hệ thống
            try {
                const res = await notificationApi.getUnreadCount();
                if (typeof res?.unreadCount === "number") {
                    totalUnread += res.unreadCount;
                }
            } catch {
                // ignore
            }

            // Nếu vai trò là Admin: Đồng bộ thêm các nghiệp vụ chờ duyệt
            if (userRole === "admin") {
                try {
                    const opItems = await fetchAdminOperationalItems();
                    const opUnread = opItems.filter((item) => !item.isRead).length;
                    totalUnread += opUnread;
                } catch {
                    // ignore
                }
            }

            setUnreadCount(totalUnread);
        } catch (err) {
            console.warn("[CareLink Notifications] Không thể lấy unread count:", err?.message);
            setUnreadCount(0);
        }
    }, [userRole, fetchAdminOperationalItems]);

    // ── 2. Lấy danh sách thông báo khi mở dropdown ──
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (isDemoMode) {
            setNotifications(getMockNotificationsByRole(userRole));
            setUnreadCount(getMockUnreadCountByRole(userRole));
            setLoading(false);
            return;
        }

        try {
            let combined = [];

            // Nếu là Admin: ưu tiên nạp các sự kiện nghiệp vụ thực tế lên đầu
            if (userRole === "admin") {
                try {
                    const opItems = await fetchAdminOperationalItems();
                    combined = [...opItems];
                } catch {
                    // ignore
                }
            }

            // Nạp thông báo từ DB
            try {
                const res = await notificationApi.getNotifications({ pageNumber: 1, pageSize: 12 });
                const items = Array.isArray(res?.items) ? res.items : (Array.isArray(res) ? res : []);
                combined = [...combined, ...items];
            } catch (apiErr) {
                if (userRole !== "admin") {
                    throw apiErr;
                }
            }

            // Sắp xếp theo ngày tạo mới nhất lên trước
            combined.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

            setNotifications(combined);

            const unreadTotal = combined.filter((n) => !n.isRead).length;
            setUnreadCount(unreadTotal);
        } catch (err) {
            console.warn("[CareLink Notifications] Lỗi tải thông báo:", err);
            setNotifications([]);
            setUnreadCount(0);
            setError("Không thể tải thông báo lúc này. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, [isDemoMode, userRole, fetchAdminOperationalItems]);

    // ── 3. Polling chu kỳ 30s & Cập nhật khi tab hoạt động trở lại ──
    useEffect(() => {
        fetchUnreadCount();

        const interval = setInterval(() => {
            if (document.visibilityState === "visible") {
                fetchUnreadCount();
            }
        }, 30000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchUnreadCount();
            }
        };

        const handleBadgeRefresh = () => {
            fetchUnreadCount();
            if (isOpen) {
                fetchNotifications();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleVisibilityChange);
        window.addEventListener("carelink:admin-refresh-badges", handleBadgeRefresh);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", handleVisibilityChange);
            window.removeEventListener("carelink:admin-refresh-badges", handleBadgeRefresh);
        };
    }, [fetchUnreadCount, fetchNotifications, isOpen]);

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

            if (item.isOperational) {
                saveAdminReadOpId(item.id);
            } else if (!isDemoMode && !String(item.id).startsWith("demo-")) {
                try {
                    await notificationApi.markAsRead(item.id);
                } catch (err) {
                    console.warn("[CareLink Notifications] Không thể cập nhật trạng thái đã đọc:", err);
                }
            }
        }

        // Tự động đóng dropdown
        setIsOpen(false);

        // Điều hướng đến đúng phân hệ theo vai trò
        const route = item.targetRoute || resolveNotificationRoute(item.type, item.referenceId, userRole);
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

        if (userRole === "admin") {
            try {
                notifications.filter((n) => n.isOperational).forEach((n) => saveAdminReadOpId(n.id));
            } catch {}
        }

        if (!isDemoMode) {
            try {
                await notificationApi.markAllAsRead();
            } catch (err) {
                console.error("[CareLink Notifications] Lỗi khi đánh dấu tất cả đã đọc:", err);
                fetchNotifications();
            }
        }
    };

    // ── 7. Bật / Tắt Demo Mode khi kiểm thử giao diện ──
    const handleToggleDemoMode = () => {
        setIsDemoMode((prev) => !prev);
        setError(null);
    };

    const getRoleDisplayName = () => {
        const norm = (userRole || "").toLowerCase();
        if (norm === "admin") return "Quản trị viên";
        if (norm === "caregiver" || norm === "nurse") return "Điều dưỡng";
        return "Gia đình";
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Nút Chuông Thông Báo (Trigger) */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center group ${
                    isOpen
                        ? "bg-teal-50 text-[#00677c] ring-2 ring-[#00677c]/20"
                        : "text-slate-600 hover:text-[#00677c] hover:bg-slate-100/80 active:scale-95"
                }`}
                title={unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Thông báo"}
                aria-label="Xem thông báo"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Bell className="w-5 h-5 transition-transform group-hover:scale-105" strokeWidth={1.9} />

                {/* Huy hiệu Badge số lượng thông báo chưa đọc */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 bg-rose-500 text-white text-[10.5px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Popover */}
            {isOpen && (
                <div
                    className={`absolute ${
                        align === "left" ? "left-0" : "right-0"
                    } mt-2.5 w-[350px] sm:w-[390px] bg-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,32,69,0.22),0_10px_20px_-5px_rgba(0,0,0,0.08)] border border-slate-200/90 ring-1 ring-slate-900/10 overflow-hidden z-50 animate-modal-pop origin-top-right`}
                >
                    {/* Đường viền dải màu Gradient thương hiệu CareLink ở đỉnh Popover */}
                    <div className="h-[2.5px] w-full bg-gradient-to-r from-teal-500 via-[#00677c] to-emerald-400" />

                    {/* Header của Dropdown */}
                    <div className="p-3.5 px-4 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-800">Thông báo</h3>
                            {unreadCount > 0 ? (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#00677c]/10 text-[#00677c] border border-teal-600/15">
                                    {unreadCount} mới
                                </span>
                            ) : (
                                <span className="text-[11px] text-slate-400 font-medium">Hệ thống</span>
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

                    {/* Banner hiển thị Chế độ Demo theo Role (Nếu đang bật) */}
                    {isDemoMode && (
                        <div className="bg-amber-50/90 border-b border-amber-200/70 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-amber-800">
                            <div className="flex items-center gap-1.5 font-medium truncate">
                                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span className="truncate">Dữ liệu mẫu ({getRoleDisplayName()})</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleDemoMode}
                                className="text-amber-900 font-bold hover:underline cursor-pointer text-[10.5px] shrink-0 ml-2"
                                title="Chuyển sang gọi API thật"
                            >
                                Tắt demo
                            </button>
                        </div>
                    )}

                    {/* Danh sách thông báo */}
                    <div className="max-h-[390px] overflow-y-auto divide-y divide-slate-100">
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
                                <p className="text-[11px] text-slate-400 max-w-[220px] leading-relaxed">
                                    Các thông báo mới về ca chăm sóc và yêu cầu phê duyệt sẽ xuất hiện tại đây.
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
                    <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                        <span className="text-[11px] text-slate-400 font-medium">CareLink Operational System</span>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-[11.5px] font-semibold text-slate-600 hover:text-[#00677c] transition-colors cursor-pointer"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
