import React, { useState } from "react";
import { Link } from "react-router-dom";

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
function BookingCard({ family, service, date, time, status = "pending" }) {
    const [localStatus, setLocalStatus] = useState(status);

    const statusMap = {
        pending: { label: "Chờ xác nhận", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
        accepted: { label: "Đã chấp nhận", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
        rejected: { label: "Đã từ chối", bg: "bg-red-50", text: "text-red-500", dot: "bg-red-400" },
    };
    const s = statusMap[localStatus];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {family[0]}
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

            {localStatus === "pending" && (
                <div className="flex gap-2 pt-1">
                    <button
                        id={`accept-${family.replace(/\s/g, "-")}`}
                        onClick={() => setLocalStatus("accepted")}
                        className="flex-1 py-2 rounded-xl bg-[#00677c] text-white text-xs font-bold hover:bg-[#005263] transition-all shadow-sm hover:shadow-md"
                    >
                        ✓ Chấp nhận
                    </button>
                    <button
                        id={`reject-${family.replace(/\s/g, "-")}`}
                        onClick={() => setLocalStatus("rejected")}
                        className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold border border-red-100 hover:bg-red-100 transition-all"
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
    const stats = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: "Ca hôm nay",
            value: "2",
            sub: "07:00 – 09:00 & 14:00 – 17:00",
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
            value: "5",
            sub: "Trong 7 ngày tới",
            color: "#6366f1",
            trend: 12,
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
            ),
            label: "Tổng giờ làm",
            value: "48h",
            sub: "Tháng 9/2026",
            color: "#f59e0b",
            trend: 8,
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: "Thu nhập",
            value: "4.8M",
            sub: "Tháng này · VNĐ",
            color: "#10b981",
            trend: 15,
        },
    ];

    const bookings = [
        { family: "Nguyễn Thị Lan", service: "Chăm sóc người cao tuổi · 3h", date: "19/09/2026", time: "08:00 – 11:00", status: "pending" },
        { family: "Trần Văn Minh", service: "Hỗ trợ phục hồi chức năng · 2h", date: "20/09/2026", time: "14:00 – 16:00", status: "pending" },
        { family: "Lê Thị Hoa", service: "Chăm sóc sau phẫu thuật · 4h", date: "21/09/2026", time: "09:00 – 13:00", status: "accepted" },
    ];

    const activities = [
        {
            icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            text: "Hoàn thành ca chăm sóc cho gia đình Nguyễn – 3 giờ",
            time: "Hôm nay, 10:30",
            color: "bg-emerald-500",
        },
        {
            icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
            text: "Yêu cầu booking mới từ gia đình Trần Văn Minh",
            time: "Hôm nay, 09:15",
            color: "bg-[#00677c]",
        },
        {
            icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
            text: "Gia đình Lê Thị Hoa đã để lại đánh giá 5 sao",
            time: "Hôm qua, 18:00",
            color: "bg-amber-400",
        },
        {
            icon: <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
            text: "Hồ sơ xác minh đang được xem xét",
            time: "18/09/2026",
            color: "bg-indigo-500",
        },
    ];

    return (
        <div className="p-5 sm:p-8 max-w-7xl mx-auto animate-page-enter">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#102030]">Xin chào, Nguyên 👋</h1>
                <p className="text-sm text-slate-400 mt-1">Thứ Năm, 18 tháng 9 năm 2026</p>
            </div>

            {/* Verification Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-amber-800">Tài khoản đang chờ xác minh</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                        Hồ sơ của bạn đang được đội ngũ CareLink xem xét. Thường mất 1–3 ngày làm việc.
                    </p>
                </div>
                <Link
                    to="/caregiver/verification"
                    className="shrink-0 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
                >
                    Xem hồ sơ
                </Link>
            </div>

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
                            <span className="w-5 h-5 rounded-full bg-[#00677c] text-white text-[10px] font-bold flex items-center justify-center">2</span>
                        </h2>
                        <Link
                            to="/caregiver/schedule"
                            className="text-xs font-semibold text-[#00677c] hover:underline"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {bookings.map((b, i) => (
                            <BookingCard key={i} {...b} />
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="text-base font-bold text-[#102030] mb-4">Hoạt động gần đây</h2>
                    <div className="flex flex-col">
                        {activities.map((a, i) => (
                            <ActivityItem key={i} {...a} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
