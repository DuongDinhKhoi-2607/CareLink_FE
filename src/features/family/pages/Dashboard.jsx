import React, { useState } from "react";
import { Link } from "react-router-dom";

// Dữ liệu người thân trong gia đình
const relativesData = [
    {
        id: "lan",
        name: "Bà Nguyễn Thị Lan",
        description: "75 tuổi • Sức khỏe ổn định",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
        statusClass: "bg-orient",
    },
    {
        id: "binh",
        name: "Ông Nguyễn Văn Bình",
        description: "82 tuổi • Đang phục hồi",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        statusClass: "bg-[#003d3a66]",
    },
];

// Cột biểu đồ huyết áp 7 ngày
const chartBars = [
    { height: "76px", bg: "bg-[#4fd9fd66]" },
    { height: "96px", bg: "bg-[#4fd9fd66]" },
    { height: "58px", bg: "bg-[#4fd9fd66]" },
    { height: "102px", bg: "bg-[#4fd9fd66]" },
    { height: "83px", bg: "bg-[#4fd9fd99]" },
    { height: "90px", bg: "bg-[#4fd9fd66]" },
    { height: "92px", bg: "bg-orient" }, // Điểm nhấn hôm nay
];

const bloodPressureDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const heartRateTimes = ["08:00", "12:00", "16:00", "20:00"];

// Cấu hình các trạng thái ca chăm sóc chuẩn y tế
const statusConfig = {
    completed: {
        label: "ĐÃ HOÀN THÀNH",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotClass: "bg-emerald-500",
    },
    in_progress: {
        label: "ĐANG THỰC HIỆN",
        badgeClass: "bg-sky-50 text-sky-700 border-sky-200/80",
        dotClass: "bg-sky-500 animate-pulse",
    },
    pending: {
        label: "CHƯA HOÀN THÀNH",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
        dotClass: "bg-amber-500",
    },
};

export default function Dashboard() {
    const [selectedPerson, setSelectedPerson] = useState("Bà Nguyễn Thị Lan");
    const [careStatus, setCareStatus] = useState("completed");

    return (
        <div className="p-6 sm:p-10 flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Tiêu đề & Lời chào buổi sáng */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-prussian-blue">
                        Chào buổi sáng, Gia đình
                    </h1>
                    <p className="text-base text-[#43474e] mt-1">
                        Dưới đây là cập nhật sức khỏe mới nhất của người thân bạn.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/caregivers"
                        className="px-4 py-2 bg-orient text-white rounded-xl text-sm font-semibold hover:bg-[#005263] transition-colors shadow-xs"
                    >
                        Đặt lịch mới
                    </Link>
                </div>
            </header>

            {/* Bố cục lưới Dashboard: 8 Cột Trái + 4 Cột Phải */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ============================================================ */}
                {/* CỘT TRÁI (8 CỘT): LỊCH HẸN & BÁO CÁO SỨC KHỎE                */}
                {/* ============================================================ */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* 1. Thẻ Buổi chăm sóc tiếp theo */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#00677c1a] text-orient">
                                ĐÃ XÁC NHẬN
                            </span>
                            <span className="text-xs font-semibold text-slate-400">Care Session #829</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-prussian-blue">Buổi chăm sóc tiếp theo</h2>
                                <p className="text-sm font-medium text-[#43474e] mt-1">
                                    Thời gian: <strong className="text-prussian-blue">Ngày mai, 09:00 - 11:00</strong>
                                </p>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <img
                                    src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300"
                                    alt="Nguyễn Thùy Linh"
                                    className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300";
                                    }}
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#181c1e]">Điều dưỡng: Nguyễn Thùy Linh</span>
                                    <span className="text-xs text-slate-500">Chuyên khoa Phục hồi chức năng</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <Link
                                to="/chat"
                                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Nhắn tin
                            </Link>
                            <Link
                                to="/caregivers/profile"
                                className="px-4 py-2 bg-prussian-blue text-white rounded-lg text-sm font-semibold hover:bg-[#1a365d] transition-colors"
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    </section>

                    {/* 2. Thẻ Ca chăm sóc gần nhất -> Dẫn sang Màn 12 Đánh giá */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border shadow-xs transition-all select-none ${statusConfig[careStatus]?.badgeClass || statusConfig.completed.badgeClass}`}
                                    title="Bấm để chuyển đổi giữa các trạng thái demo (Đã hoàn thành / Đang thực hiện / Chưa hoàn thành)"
                                    onClick={() => {
                                        const statuses = ["completed", "in_progress", "pending"];
                                        const next = statuses[(statuses.indexOf(careStatus) + 1) % statuses.length];
                                        setCareStatus(next);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${statusConfig[careStatus]?.dotClass || statusConfig.completed.dotClass}`} />
                                    <span>TRẠNG THÁI: {statusConfig[careStatus]?.label || "ĐÃ HOÀN THÀNH"}</span>
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-prussian-blue mt-1">Ca chăm sóc gần nhất</h3>
                            <p className="text-xs text-[#43474e]">
                                Điều dưỡng: <strong className="text-slate-800">Nguyễn Thùy Linh</strong> • Hôm nay 16:30
                            </p>
                        </div>

                        <Link
                            to="/review"
                            className="px-6 py-3 bg-prussian-blue text-white rounded-xl text-sm font-bold hover:bg-[#1a365d] transition-all shadow-xs text-center shrink-0"
                        >
                            Đánh giá dịch vụ
                        </Link>
                    </section>

                    {/* 3. Khối Chỉ số sức khỏe (Huyết áp + Nhịp tim) */}
                    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-prussian-blue">Chỉ số sức khỏe</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Cập nhật cuối cùng: 2 giờ trước bởi Điều dưỡng Linh</p>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                <span className="text-xs font-semibold text-slate-700 px-2">{selectedPerson}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            {/* Biểu đồ Huyết áp */}
                            <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#43474e]">Huyết áp (mmHg)</span>
                                    <span className="text-2xl font-bold text-prussian-blue">120/80</span>
                                </div>

                                <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
                                    {chartBars.map((bar, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                            <div
                                                className={`w-full rounded-t-md transition-all ${bar.bg}`}
                                                style={{ height: bar.height }}
                                            />
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {bloodPressureDays[i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Biểu đồ Nhịp tim */}
                            <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#43474e]">Nhịp tim (BPM)</span>
                                    <span className="text-2xl font-bold text-prussian-blue">72</span>
                                </div>

                                <div className="h-32 flex flex-col justify-between pt-4">
                                    <svg className="w-full h-20 text-orient" viewBox="0 0 300 80" fill="none">
                                        <path
                                            d="M0 40 H50 L60 20 L75 60 L90 10 L105 50 L120 40 H180 L190 25 L205 55 L220 15 L235 40 H300"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    <div className="flex justify-between px-2 text-[10px] font-bold text-slate-400">
                                        {heartRateTimes.map((t) => (
                                            <span key={t}>{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ============================================================ */}
                {/* CỘT PHẢI (4 CỘT): NGƯỜI THÂN, HÓA ĐƠN & KHÁM ĐỊNH KỲ         */}
                {/* ============================================================ */}
                <aside className="lg:col-span-4 flex flex-col gap-6">
                    {/* Thẻ 1: Danh sách Người thân */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-base font-bold text-prussian-blue">Người thân</h3>
                            <button
                                type="button"
                                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-orient hover:text-white transition-colors flex items-center justify-center font-bold text-sm"
                                aria-label="Thêm người thân"
                            >
                                +
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {relativesData.map((person) => (
                                <button
                                    key={person.id}
                                    type="button"
                                    onClick={() => setSelectedPerson(person.name)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${selectedPerson === person.name
                                            ? "border-orient bg-[#f0f9fa] shadow-xs"
                                            : "border-slate-100 bg-slate-50/60 hover:bg-slate-100"
                                        }`}
                                >
                                    <img
                                        src={person.image}
                                        alt={person.name}
                                        className="w-11 h-11 rounded-full object-cover shrink-0 border border-white"
                                    />
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-[#181c1e] truncate">{person.name}</span>
                                        <span className="text-xs text-[#43474e] truncate">{person.description}</span>
                                    </div>
                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${person.statusClass}`} />
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Thẻ 2: Hóa đơn & Phí nền tảng */}
                    <section className="bg-prussian-blue text-white p-6 rounded-2xl shadow-sm flex flex-col gap-4 relative overflow-hidden">
                        <div className="flex items-center justify-between relative z-10">
                            <h3 className="text-base font-bold">Chi phí dịch vụ</h3>
                            <svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                            </svg>
                        </div>

                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300">
                                PHÍ NỀN TẢNG CARELINK
                            </span>
                            <span className="text-3xl font-extrabold text-white">60.000đ</span>
                            <div className="inline-flex items-center gap-1 text-xs text-teal-300 mt-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Trạng thái: Đã thanh toán</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-colors relative z-10"
                        >
                            Xem hóa đơn
                        </button>
                    </section>

                    {/* Thẻ 3: Lịch kiểm tra định kỳ sắp tới */}
                    <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orient text-white">
                                SẮP TỚI
                            </span>
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-prussian-blue">Kiểm tra định kỳ</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Bà Nguyễn Thị Lan • 14:30 Hôm nay</p>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                            <span className="font-semibold text-prussian-blue">Điều dưỡng: Nguyễn Thùy Linh</span>
                        </div>
                    </section>

                    {/* Thẻ 4: Tin nhắn nhanh với Điều dưỡng */}
                    <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-prussian-blue">
                            Tin nhắn với điều dưỡng
                        </h4>
                        <Link
                            to="/chat"
                            className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=150"
                                alt="Linh"
                                className="w-10 h-10 rounded-full object-cover shrink-0 border border-white"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=150";
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-800">Nguyễn Thùy Linh</span>
                                    <span className="text-[10px] text-slate-400">16:45</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                    Chào gia đình, buổi chăm sóc hôm nay của bà Lan đã hoàn thành tốt...
                                </p>
                            </div>
                        </Link>
                    </section>
                </aside>
            </div>
        </div>
    );
}