import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    CircleDollarSign,
    CalendarCheck,
    Users,
    ShieldCheck,
    ArrowUpRight,
    FileCheck2,
    CalendarClock,
    CheckCircle2,
    RefreshCw,
    ChevronRight,
    Activity,
    Clock,
} from "lucide-react";

export default function AdminDashboard() {
    const [timeRange, setTimeRange] = useState("30days");
    const [chartMode, setChartMode] = useState("month");

    // Dữ liệu mô phỏng KPI theo thời gian
    const kpiData = {
        "7days": {
            revenue: "32.800.000 ₫",
            revenueGrowth: "+9.4%",
            completedShifts: "78",
            shiftsGrowth: "+5.1%",
            newFamilies: "19",
            familyGrowth: "+8.3%",
            activeCaregivers: "142",
            caregiverNote: "+2 mới tuần này",
        },
        "30days": {
            revenue: "128.500.000 ₫",
            revenueGrowth: "+14.2%",
            completedShifts: "324",
            shiftsGrowth: "+8.5%",
            newFamilies: "86",
            familyGrowth: "+12.0%",
            activeCaregivers: "142",
            caregiverNote: "+5 mới tháng này",
        },
        "3months": {
            revenue: "385.200.000 ₫",
            revenueGrowth: "+22.8%",
            completedShifts: "940",
            shiftsGrowth: "+16.2%",
            newFamilies: "240",
            familyGrowth: "+18.5%",
            activeCaregivers: "142",
            caregiverNote: "+18 điều dưỡng tích cực",
        },
    };

    const currentKpi = kpiData[timeRange];

    // Hoạt động gần đây (Mock data với Lucide icons)
    const recentActivities = [
        {
            id: 1,
            type: "verification",
            title: "Hồ sơ xác minh mới",
            description: "ĐD. Trần Thị Mai (ĐH Y Dược TP.HCM) vừa nộp bằng cấp & CCCD.",
            time: "10 phút trước",
            badge: "Chờ duyệt",
            badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
            iconColor: "bg-amber-50 text-amber-600 border border-amber-200/60",
            icon: <FileCheck2 className="w-4.5 h-4.5" strokeWidth={2} />,
        },
        {
            id: 2,
            type: "booking",
            title: "Lịch hẹn mới được xác nhận",
            description: "Gia đình chị Nguyễn Thu Hà đặt ca chăm sóc người già 8 giờ.",
            time: "25 phút trước",
            badge: "Đã cọc",
            badgeColor: "bg-teal-50 text-[#00677c] border-teal-200",
            iconColor: "bg-teal-50 text-[#00677c] border border-teal-200/60",
            icon: <CalendarClock className="w-4.5 h-4.5" strokeWidth={2} />,
        },
        {
            id: 3,
            type: "completed",
            title: "Ca chăm sóc hoàn tất",
            description: "ĐD. Lê Hoàng Long hoàn thành ca trực tiêm thuốc & đo sinh hiệu tại Quận 7.",
            time: "1 giờ trước",
            badge: "Hoàn tất",
            badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
            iconColor: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
            icon: <CheckCircle2 className="w-4.5 h-4.5" strokeWidth={2} />,
        },
        {
            id: 4,
            type: "update",
            title: "Cập nhật chứng chỉ y tế",
            description: "ĐD. Bùi Văn Hùng vừa bổ sung Giấy chứng nhận hồi sức cấp cứu CPR.",
            time: "3 giờ trước",
            badge: "Đã cập nhật",
            badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
            iconColor: "bg-blue-50 text-blue-600 border border-blue-200/60",
            icon: <RefreshCw className="w-4.5 h-4.5" strokeWidth={2} />,
        },
    ];

    // Tỷ lệ dịch vụ
    const serviceShares = [
        { name: "Chăm sóc người cao tuổi", percent: 42, color: "bg-[#00677c]", textColor: "text-[#00677c]" },
        { name: "Theo dõi sức khỏe & sinh hiệu", percent: 24, color: "bg-teal-500", textColor: "text-teal-600" },
        { name: "Phục hồi chức năng", percent: 18, color: "bg-emerald-500", textColor: "text-emerald-600" },
        { name: "Chăm sóc sau phẫu thuật", percent: 11, color: "bg-sky-500", textColor: "text-sky-600" },
        { name: "Đồng hành hỗ trợ sinh hoạt", percent: 5, color: "bg-amber-500", textColor: "text-amber-600" },
    ];

    return (
        <div className="space-y-6 pb-12 font-sans">
            {/* ── TOP BANNER / HEADER TRANG ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        Tổng quan hệ thống
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-50 text-[#00677c] border border-teal-200/60 flex items-center gap-1">
                            <Activity className="w-3 h-3 animate-pulse" /> Live Telemetry
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Theo dõi hoạt động, doanh thu và các ca chăm sóc trên nền tảng CareLink.
                    </p>
                </div>

                {/* Filter thời gian */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setTimeRange("7days")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            timeRange === "7days"
                                ? "bg-white text-[#00677c] shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        7 ngày qua
                    </button>
                    <button
                        type="button"
                        onClick={() => setTimeRange("30days")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            timeRange === "30days"
                                ? "bg-white text-[#00677c] shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        30 ngày qua
                    </button>
                    <button
                        type="button"
                        onClick={() => setTimeRange("3months")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            timeRange === "3months"
                                ? "bg-white text-[#00677c] shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        3 tháng qua
                    </button>
                </div>
            </div>

            {/* ── 4 THẺ KPI CHÍNH (VỚI LUCIDE ICONS) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Tổng doanh thu */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng doanh thu</span>
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00677c] flex items-center justify-center border border-teal-100">
                            <CircleDollarSign className="w-5 h-5" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentKpi.revenue}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                {currentKpi.revenueGrowth}
                            </span>
                            <span className="text-xs text-slate-400">so với kỳ trước</span>
                        </div>
                    </div>
                </div>

                {/* 2. Ca chăm sóc hoàn thành */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ca hoàn thành</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                            <CalendarCheck className="w-5 h-5" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentKpi.completedShifts}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                {currentKpi.shiftsGrowth}
                            </span>
                            <span className="text-xs text-slate-400">tỷ lệ hoàn thành 98.2%</span>
                        </div>
                    </div>
                </div>

                {/* 3. Gia đình mới */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gia đình mới</span>
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                            <Users className="w-5 h-5" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentKpi.newFamilies}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                {currentKpi.familyGrowth}
                            </span>
                            <span className="text-xs text-slate-400">gia đình đăng ký</span>
                        </div>
                    </div>
                </div>

                {/* 4. Điều dưỡng đang hoạt động */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điều dưỡng Online</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                            <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentKpi.activeCaregivers}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00677c] bg-teal-50 px-2 py-0.5 rounded-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                {currentKpi.caregiverNote}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BIỂU ĐỒ DOANH THU & TỶ LỆ DỊCH VỤ ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Biểu đồ Doanh thu (Area / Line Chart) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Doanh thu & Lượt đặt ca trực</h3>
                                <p className="text-xs text-slate-500">Biểu đồ ước tính dòng tiền qua nền tảng CareLink (Mock data)</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                    <span className="w-3 h-3 rounded-full bg-[#00677c]"></span> Doanh thu
                                </span>
                                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                                    <button
                                        onClick={() => setChartMode("week")}
                                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                            chartMode === "week" ? "bg-white text-[#00677c] font-bold shadow-xs" : "text-slate-600"
                                        }`}
                                    >
                                        Theo tuần
                                    </button>
                                    <button
                                        onClick={() => setChartMode("month")}
                                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                            chartMode === "month" ? "bg-white text-[#00677c] font-bold shadow-xs" : "text-slate-600"
                                        }`}
                                    >
                                        Theo tháng
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Visual SVG Chart */}
                        <div className="mt-6 relative h-60 w-full flex items-end">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00677c" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#00677c" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>

                                {/* Grid horizontal lines */}
                                <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="0" y1="190" x2="600" y2="190" stroke="#e2e8f0" strokeWidth="1" />

                                {/* Area fill */}
                                <path
                                    d="M 0,160 Q 75,130 150,110 T 300,80 T 450,45 T 600,25 L 600,190 L 0,190 Z"
                                    fill="url(#tealGradient)"
                                />

                                {/* Line stroke */}
                                <path
                                    d="M 0,160 Q 75,130 150,110 T 300,80 T 450,45 T 600,25"
                                    fill="none"
                                    stroke="#00677c"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />

                                {/* Data points */}
                                <circle cx="150" cy="110" r="5" fill="#ffffff" stroke="#00677c" strokeWidth="3" />
                                <circle cx="300" cy="80" r="5" fill="#ffffff" stroke="#00677c" strokeWidth="3" />
                                <circle cx="450" cy="45" r="5" fill="#ffffff" stroke="#00677c" strokeWidth="3" />
                                <circle cx="600" cy="25" r="6" fill="#00677c" stroke="#ffffff" strokeWidth="2" />
                            </svg>
                        </div>

                        {/* Chart X Labels */}
                        <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-1">
                            <span>T2 (Tuần 1)</span>
                            <span>T3 (Tuần 2)</span>
                            <span>T4 (Tuần 3)</span>
                            <span>T5 (Tuần 4)</span>
                            <span>Hiện tại</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Trung bình doanh thu/ngày: <strong className="text-slate-800">4.280.000 ₫</strong></span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tăng trưởng ổn định
                        </span>
                    </div>
                </div>

                {/* Tỷ lệ sử dụng dịch vụ */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Tỷ lệ sử dụng dịch vụ</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Phân bổ các yêu cầu đặt ca chăm sóc</p>

                        <div className="mt-5 space-y-3.5">
                            {serviceShares.map((service, index) => (
                                <div key={index} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-slate-700 truncate">{service.name}</span>
                                        <span className={`font-bold ${service.textColor}`}>{service.percent}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`${service.color} h-full rounded-full transition-all duration-500`}
                                            style={{ width: `${service.percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <Link
                            to="/admin/services"
                            className="w-full py-2.5 px-4 rounded-xl bg-teal-50 text-[#00677c] hover:bg-teal-100/80 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            Quản lý cấu hình dịch vụ
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── HOẠT ĐỘNG GẦN ĐÂY & WIDGET NHẮC NHỞ HỒ SƠ ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Danh sách Hoạt động gần đây */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Hoạt động gần đây</h3>
                            <p className="text-xs text-slate-500">Các giao dịch và hồ sơ vừa phát sinh trên CareLink</p>
                        </div>
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Tự động cập nhật
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100 mt-2">
                        {recentActivities.map((act) => (
                            <div key={act.id} className="py-3.5 flex items-start gap-3 sm:gap-4 hover:bg-slate-50/70 p-2 rounded-xl transition-colors">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.iconColor}`}>
                                    {act.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">{act.title}</h4>
                                        <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md border ${act.badgeColor}`}>
                                            {act.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{act.description}</p>
                                    <span className="text-[11px] text-slate-400 font-medium block mt-1">{act.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Widget Nhắc nhở hồ sơ chờ duyệt (Quick Action) */}
                <div className="bg-gradient-to-br from-teal-50/80 via-white to-sky-50/60 p-6 rounded-2xl border border-teal-100 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#00677c] flex items-center justify-center mb-4 border border-teal-200">
                            <FileCheck2 className="w-6 h-6" strokeWidth={2} />
                        </div>

                        <span className="text-xs font-bold uppercase tracking-wider text-[#00677c]">Hồ sơ đang chờ duyệt</span>
                        <h4 className="text-3xl font-extrabold text-slate-900 mt-1">12 hồ sơ</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                            Có 12 điều dưỡng và sinh viên y khoa mới tải lên chứng chỉ hành nghề và CCCD cần được xác minh trước khi nhận lịch.
                        </p>

                        <div className="mt-4 p-3 bg-white/90 rounded-xl border border-teal-100 text-xs text-slate-600 space-y-1">
                            <div className="flex justify-between">
                                <span>Sinh viên Y khoa:</span>
                                <strong className="text-slate-800">8 hồ sơ</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Điều dưỡng cử nhân:</span>
                                <strong className="text-slate-800">4 hồ sơ</strong>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-2">
                        <Link
                            to="/admin/approvals"
                            className="w-full py-3 px-4 rounded-xl bg-[#00677c] text-white hover:bg-[#005566] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                            Xem & Kiểm tra hồ sơ ngay
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
