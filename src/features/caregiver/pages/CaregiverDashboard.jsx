import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchAndSyncUserMe } from "../../../api/authApi";
import caregiverApi from "../../../api/caregiverApi";

/* ─── Stat Card ─── */
function StatCard({ icon, label, value, sub, color = "#00677c", trend }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: `${color}18` }}
            >
                <span style={{ color }}>{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-2xl font-bold text-[#102030] leading-none">{value}</p>
                {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                    {trend > 0 ? "+" : ""}{trend}%
                </span>
            )}
        </div>
    );
}

/* ─── Booking Request Card ─── */
function BookingCard({ id, family, service, date, time, status = "pending", onAccept, onReject, isProcessing }) {
    const statusMap = {
        pending: { label: "Chờ xác nhận", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
        accepted: { label: "Đã chấp nhận", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
        rejected: { label: "Đã từ chối", bg: "bg-red-50", text: "text-red-500", dot: "bg-red-400" },
        in_progress: { label: "Đang diễn ra", bg: "bg-teal-50", text: "text-teal-600", dot: "bg-teal-500 animate-ping" },
        completed: { label: "Đã hoàn thành", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
    };
    const s = statusMap[status] || statusMap.pending;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {family ? family[0] : "K"}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#102030]">{family}</p>
                        <p className="text-xs text-slate-400">{service}</p>
                    </div>
                </div>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {date}
                </span>
                <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {time}
                </span>
            </div>

            {status === "pending" && onAccept && (
                <div className="flex gap-2 pt-1">
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => onAccept(id)}
                        className="flex-1 py-2 rounded-xl bg-[#00677c] text-white text-xs font-bold hover:bg-[#005263] transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
                    >
                        ✓ Chấp nhận
                    </button>
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => onReject(id)}
                        className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold border border-red-100 hover:bg-red-100 transition-all cursor-pointer disabled:opacity-50"
                    >
                        ✕ Từ chối
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─── Activity Item ─── */
function ActivityItem({ icon, text, time, color }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-[#102030] font-medium leading-snug">{text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{time}</p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   CaregiverDashboard
═══════════════════════════════════════════ */
export default function CaregiverDashboard() {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const raw = localStorage.getItem("carelink_user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const [bookingsList, setBookingsList] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const loadData = useCallback(() => {
        fetchAndSyncUserMe().then((u) => {
            if (u) setCurrentUser(u);
        });

        Promise.all([
            caregiverApi.getProfile().catch(() => null),
            caregiverApi.getVerificationStatus().catch(() => null),
        ]).then(([pRes, vRes]) => {
            const p = pRes?.data || pRes;
            const v = vRes?.data || vRes;
            if (p || v) {
                setCurrentUser((prev) => {
                    const validName = p?.fullName && p.fullName.toLowerCase() !== "nurse" && !p.fullName.includes("@")
                        ? p.fullName
                        : prev?.fullName && prev.fullName.toLowerCase() !== "nurse" && !prev.fullName.includes("@")
                            ? prev.fullName
                            : "Điều dưỡng";

                    const updated = {
                        ...prev,
                        fullName: validName,
                        name: validName,
                        avatar: p?.avatarUrl || prev?.avatar,
                        avatarUrl: p?.avatarUrl || prev?.avatarUrl,
                        nurseStatus: v?.verificationStatus ?? (p?.status ?? prev?.nurseStatus),
                        verificationStatusName: v?.verificationStatusName || null,
                    };
                    try {
                        localStorage.setItem("carelink_user", JSON.stringify(updated));
                    } catch { }
                    return updated;
                });
            }
        });

        caregiverApi.getBookings({ PageNumber: 1, PageSize: 10 })
            .then((res) => {
                const items = Array.isArray(res) ? res : (res?.data || res?.items || []);
                setBookingsList(items);
            })
            .catch(() => { });

        caregiverApi.getWallet()
            .then((res) => {
                setWallet(res);
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAccept = async (id) => {
        try {
            setIsProcessing(true);
            await caregiverApi.acceptBooking(id);
            loadData();
        } catch (err) {
            console.error("Lỗi nhận ca:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async (id) => {
        try {
            setIsProcessing(true);
            await caregiverApi.rejectBooking(id, { reason: "Bận lịch trực" });
            loadData();
        } catch (err) {
            console.error("Lỗi từ chối ca:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const rawDisplayName = currentUser?.fullName || currentUser?.name;
    const displayName = (rawDisplayName && rawDisplayName.toLowerCase() !== "nurse" && !rawDisplayName.includes("@"))
        ? rawDisplayName
        : "Điều dưỡng CareLink";

    // Tính toán số liệu thống kê thực tế
    const todayStr = new Date().toDateString();
    const todayBookingsCount = bookingsList.filter((b) => b.scheduledStart && new Date(b.scheduledStart).toDateString() === todayStr).length;
    const upcomingBookingsCount = bookingsList.filter((b) => {
        const st = typeof b.status === "number" ? b.status : 0;
        return (st === 2 || st === 3) && new Date(b.scheduledStart) >= new Date();
    }).length;
    const completedBookings = bookingsList.filter((b) => b.status === 5 || b.status === "Completed");
    const totalHours = completedBookings.length * 3;
    const earningsVal = wallet?.balance != null
        ? `${Number(wallet.balance).toLocaleString("vi-VN")}đ`
        : "0đ";

    const stats = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: "Ca hôm nay",
            value: String(todayBookingsCount),
            sub: todayBookingsCount > 0 ? "Có ca trong ngày" : "Không có ca trực hôm nay",
            color: "#00677c",
            trend: null,
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            ),
            label: "Ca sắp tới",
            value: String(upcomingBookingsCount),
            sub: "Trong 7 ngày tới",
            color: "#6366f1",
            trend: null,
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
            ),
            label: "Tổng giờ làm",
            value: `${totalHours}h`,
            sub: `${completedBookings.length} ca hoàn thành`,
            color: "#f59e0b",
            trend: null,
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: "Số dư khả dụng",
            value: earningsVal,
            sub: "Ví thu nhập CareLink",
            color: "#10b981",
            trend: null,
        },
    ];

    // Chuyển đổi danh sách ca chăm sóc thực tế
    const displayBookings = bookingsList.length > 0
        ? bookingsList.slice(0, 5).map((b) => {
            const rawSt = typeof b.status === "number" ? b.status : 2;
            let status = "pending";
            if (rawSt === 3 || b.status === "Accepted") status = "accepted";
            else if (rawSt === 4 || b.status === "InProgress") status = "in_progress";
            else if (rawSt === 5 || b.status === "Completed") status = "completed";
            else if (rawSt === 6 || b.status === "Canceled") status = "rejected";

            const sDate = b.scheduledStart ? new Date(b.scheduledStart) : new Date();
            const eDate = b.scheduledEnd ? new Date(b.scheduledEnd) : null;
            const pad = (n) => String(n).padStart(2, "0");
            const dateStr = sDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
            const sTime = `${pad(sDate.getHours())}:${pad(sDate.getMinutes())}`;
            const eTime = eDate ? `${pad(eDate.getHours())}:${pad(eDate.getMinutes())}` : "";

            return {
                id: b.id,
                family: b.customerName || b.recipientName || "Khách hàng CareLink",
                service: `${b.serviceName || "Chăm sóc theo yêu cầu"} · ${Number(b.totalPrice || 0).toLocaleString("vi-VN")}đ`,
                date: dateStr,
                time: eTime ? `${sTime} – ${eTime}` : sTime,
                status,
            };
        })
        : [];

    // Hoạt động gần đây từ dữ liệu thực tế hệ thống
    const activities = [];
    if (bookingsList.length > 0) {
        bookingsList.slice(0, 3).forEach((b) => {
            const rawSt = typeof b.status === "number" ? b.status : 0;
            const cust = b.customerName || b.recipientName || "Khách hàng CareLink";
            const dateStr = b.scheduledStart ? new Date(b.scheduledStart).toLocaleDateString("vi-VN") : "Gần đây";
            if (rawSt === 5 || b.status === "Completed") {
                activities.push({
                    icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    text: `Hoàn thành ca chăm sóc cho ${cust}`,
                    time: dateStr,
                    color: "bg-emerald-500",
                });
            } else if (rawSt === 3 || b.status === "Accepted") {
                activities.push({
                    icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
                    text: `Đã xác nhận nhận ca chăm sóc của ${cust}`,
                    time: dateStr,
                    color: "bg-teal-600",
                });
            } else if (rawSt === 2 || b.status === "PendingAcceptance") {
                activities.push({
                    icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
                    text: `Yêu cầu ca chăm sóc mới từ ${cust}`,
                    time: dateStr,
                    color: "bg-amber-500",
                });
            }
        });
    }

    if (wallet?.balance != null) {
        activities.push({
            icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m0 0v10.5m0-10.5h19.5" /></svg>,
            text: `Số dư ví khả dụng hiện tại: ${Number(wallet.balance).toLocaleString("vi-VN")}đ`,
            time: "Cập nhật trực tiếp",
            color: "bg-[#00677c]",
        });
    }

    const vStatus = currentUser?.nurseStatus;
    activities.push({
        icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
        text: vStatus === 2 ? "Hồ sơ năng lực y tế đã được phê duyệt" : (vStatus === 1 || vStatus === 4 ? "Hồ sơ xác thực đang được Admin kiểm duyệt" : "Hồ sơ xác thực chưa được nộp"),
        time: "Tài khoản CareLink",
        color: vStatus === 2 ? "bg-emerald-600" : (vStatus === 1 || vStatus === 4 ? "bg-amber-500" : "bg-slate-400"),
    });

    const renderVerificationBanner = () => {
        const vStatus = currentUser?.nurseStatus;
        const vStatusName = currentUser?.verificationStatusName;
        const isApproved = vStatus === 2 || vStatus === "Approved" || vStatusName === "Approved";
        const isPending = vStatus === 1 || vStatus === 4 || vStatus === "Pending" || vStatus === "Resubmitted" || vStatusName === "Pending";
        const isRejected = vStatus === 3 || vStatus === "Rejected" || vStatusName === "Rejected";

        if (isApproved) {
            return (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-emerald-800">Tài khoản đã được xác minh</p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                            Hồ sơ năng lực của bạn đã đạt chuẩn. Bạn có thể sẵn sàng nhận lịch hẹn chăm sóc từ các gia đình.
                        </p>
                    </div>
                    <Link
                        to="/caregiver/verification"
                        className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                        Chi tiết hồ sơ
                    </Link>
                </div>
            );
        }

        if (isPending) {
            return (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-amber-800">Tài khoản đang chờ xác minh</p>
                        <p className="text-xs text-amber-600 mt-0.5">
                            Hồ sơ của bạn đang được đội ngũ CareLink đối soát và kiểm duyệt. Thường mất 1–3 ngày làm việc.
                        </p>
                    </div>
                    <Link
                        to="/caregiver/verification"
                        className="shrink-0 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
                    >
                        Xem hồ sơ
                    </Link>
                </div>
            );
        }

        if (isRejected) {
            return (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-rose-800">Hồ sơ cần cập nhật / bổ sung</p>
                        <p className="text-xs text-rose-600 mt-0.5">
                            Hồ sơ xác minh điều dưỡng của bạn cần cập nhật lại thông tin hoặc chứng chỉ theo yêu cầu từ Quản trị viên.
                        </p>
                    </div>
                    <Link
                        to="/caregiver/verification"
                        className="shrink-0 text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1.5 rounded-lg hover:bg-rose-200 transition-colors"
                    >
                        Nộp lại hồ sơ
                    </Link>
                </div>
            );
        }

        // ── ONBOARDING HERO CARD DÀNH CHO ĐIỀU DƯỠNG CHƯA NỘP HỒ SƠ (SOLID CARELINK TEAL, NO GRADIENT) ──
        return (
            <div className="mb-8 rounded-3xl bg-[#00677C] p-6 sm:p-8 text-white shadow-md border border-[#005466]">
                <div>
                    {/* Top row: Status pill */}
                    <div className="flex items-center mb-3.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                            </span>
                            <span>Bắt đầu với CareLink · Hồ sơ chưa kích hoạt</span>
                        </div>
                    </div>

                    {/* Main Title & Subtitle */}
                    <div className="max-w-3xl">
                        <h2 className="text-xl sm:text-2xl lg:text-[25px] font-bold text-white tracking-tight leading-snug">
                            Chào mừng bạn đến với Mạng lưới Điều dưỡng CareLink!
                        </h2>
                        <p className="text-sm sm:text-[15px] text-teal-50/90 mt-2 leading-relaxed font-normal">
                            Chỉ còn 1 bước để mở khóa quyền nhận lịch trực, kết nối với hàng ngàn gia đình và nhận thu nhập hấp dẫn. Vui lòng hoàn tất nộp hồ sơ chứng chỉ chuyên môn và CCCD để Quản trị viên kích hoạt tài khoản của bạn trong 24h.
                        </p>
                    </div>

                    {/* 3-Step Information Road */}
                    <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        <div className="bg-[#005769] rounded-2xl p-4 border border-white/15 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5">
                            <div className="flex items-center justify-between gap-3 mb-2.5">
                                <div className="w-7 h-7 rounded-lg bg-white text-[#00677C] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                    1
                                </div>
                                <span className="text-[10px] font-semibold text-teal-100 bg-white/15 border border-white/20 px-2 py-0.5 rounded-md">
                                    ~ 2 phút
                                </span>
                            </div>
                            <p className="text-sm font-bold text-white">Thông tin năng lực</p>
                            <p className="text-xs text-teal-100/80 mt-1 leading-relaxed">Kinh nghiệm lâm sàng, học vấn & chuyên môn y tế</p>
                        </div>

                        <div className="bg-[#005769] rounded-2xl p-4 border border-white/15 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5">
                            <div className="flex items-center justify-between gap-3 mb-2.5">
                                <div className="w-7 h-7 rounded-lg bg-white text-[#00677C] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                    2
                                </div>
                                <span className="text-[10px] font-semibold text-teal-100 bg-white/15 border border-white/20 px-2 py-0.5 rounded-md">
                                    ~ 3 phút
                                </span>
                            </div>
                            <p className="text-sm font-bold text-white">Chứng từ & CCHN</p>
                            <p className="text-xs text-teal-100/80 mt-1 leading-relaxed">Ảnh CCCD 2 mặt, bằng tốt nghiệp hoặc thẻ SV</p>
                        </div>

                        <div className="bg-[#005769] rounded-2xl p-4 border border-white/15 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5">
                            <div className="flex items-center justify-between gap-3 mb-2.5">
                                <div className="w-7 h-7 rounded-lg bg-white text-[#00677C] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                    3
                                </div>
                                <span className="text-[10px] font-semibold text-teal-100 bg-white/15 border border-white/20 px-2 py-0.5 rounded-md">
                                    Trong 24h
                                </span>
                            </div>
                            <p className="text-sm font-bold text-white">Duyệt & Nhận ca</p>
                            <p className="text-xs text-teal-100/80 mt-1 leading-relaxed">Admin xét duyệt trong 24h và cấp quyền nhận việc</p>
                        </div>
                    </div>

                    {/* Action Buttons & Reassurance Footer */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                to="/caregiver/verification"
                                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-teal-50 text-[#00677C] font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
                            >
                                <span>Nộp hồ sơ xác thực ngay</span>
                                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/caregiver/profile"
                                className="inline-flex items-center gap-2 px-4.5 py-3 rounded-xl bg-[#005769] hover:bg-[#004e5e] text-white font-semibold text-xs border border-white/25 transition-all shadow-xs"
                            >
                                <span>Kiểm tra hồ sơ & chứng chỉ</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-teal-100/90">
                            <svg className="w-4 h-4 text-teal-200 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                            <span>Thông tin y tế và CCCD được mã hóa bảo mật theo tiêu chuẩn CareLink</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-5 sm:p-8 max-w-7xl mx-auto animate-page-enter">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#102030]">Xin chào, {displayName} 👋</h1>
                <p className="text-sm text-slate-400 mt-1">
                    {new Intl.DateTimeFormat("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date())}
                </p>
            </div>

            {/* Verification Banner chuẩn xác theo 4 trạng thái */}
            {renderVerificationBanner()}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                    <StatCard key={i} {...s} />
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking Requests */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-[#102030] flex items-center gap-2">
                            Yêu cầu Booking
                            <span className="w-5 h-5 rounded-full bg-[#00677c] text-white text-[10px] font-bold flex items-center justify-center">
                                {displayBookings.length}
                            </span>
                        </h2>
                        <Link
                            to="/caregiver/booking-requests"
                            className="text-xs font-semibold text-[#00677c] hover:underline"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {displayBookings.length > 0 ? (
                            displayBookings.map((b) => (
                                <BookingCard
                                    key={b.id}
                                    {...b}
                                    isProcessing={isProcessing}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">Chưa có yêu cầu ca chăm sóc nào</h3>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                    Khi khách hàng đặt lịch hoặc chấp thuận báo giá ca trực của bạn, các yêu cầu sẽ xuất hiện tại đây để bạn xác nhận.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-base font-bold text-[#102030] mb-4">Hoạt động gần đây</h2>
                    <div className="flex flex-col">
                        {activities.length > 0 ? (
                            activities.map((a, i) => (
                                <ActivityItem key={i} {...a} />
                            ))
                        ) : (
                            <p className="text-xs text-slate-400 py-6 text-center">Chưa có hoạt động gần đây</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}