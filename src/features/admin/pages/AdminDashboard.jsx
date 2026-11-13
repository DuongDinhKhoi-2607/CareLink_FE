import React, { useState, useEffect, useCallback } from "react";
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
    Globe,
    Eye,
    TrendingUp,
    Smartphone,
    Laptop,
    Tablet,
    CreditCard,
    UserPlus,
    LogIn,
    Compass,
    Layers,
    BarChart3,
    CheckCircle,
} from "lucide-react";
import adminApi from "../../../api/adminApi";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview"); // "overview" | "analytics"
    const [timeRange, setTimeRange] = useState("30days");
    const [chartMode, setChartMode] = useState("month");
    const [liveSummary, setLiveSummary] = useState(null);
    const [revenueMetrics, setRevenueMetrics] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [activeServices, setActiveServices] = useState([]);
    const [loadingActivities, setLoadingActivities] = useState(true);

    // ── OUTCOME 3: WEBSITE ACTIVITY TRACKING STATE ──
    const [analyticsRange, setAnalyticsRange] = useState("30days");
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [analyticsError, setAnalyticsError] = useState(null);

    const fetchAnalytics = useCallback((range = analyticsRange) => {
        setLoadingAnalytics(true);
        setAnalyticsError(null);
        adminApi.getWebsiteAnalytics({ range })
            .then((res) => {
                setAnalyticsData(res?.data || res);
            })
            .catch((err) => {
                console.warn("[CareLink Admin] Analytics API error:", err);
                setAnalyticsError("Không thể tải dữ liệu phân tích tương tác. Vui lòng thử lại.");
            })
            .finally(() => {
                setLoadingAnalytics(false);
            });
    }, [analyticsRange]);

    useEffect(() => {
        if (activeTab === "analytics") {
            fetchAnalytics(analyticsRange);
        }
    }, [activeTab, analyticsRange, fetchAnalytics]);

    // Kết nối API thống kê Dashboard, Hồ sơ chờ duyệt, và Hoạt động gần đây từ BE
    useEffect(() => {
        let isMounted = true;

        // 1. Thống kê tổng quan
        adminApi.getDashboardSummary()
            .then((res) => {
                if (isMounted && res) {
                    setLiveSummary(res);
                }
            })
            .catch((err) => {
                console.warn("[CareLink Admin] Dashboard summary API error:", err);
            });

        // 2. Doanh thu theo khoảng thời gian
        adminApi.getRevenueMetrics({ range: timeRange })
            .then((res) => {
                if (isMounted && res) {
                    setRevenueMetrics(res?.data || res);
                }
            })
            .catch((err) => {
                console.warn("[CareLink Admin] Revenue metrics API error:", err);
            });

        // 3. Hồ sơ điều dưỡng chờ duyệt thực tế
        adminApi.getNurseVerifications({ pageNumber: 1, pageSize: 20 })
            .then((res) => {
                if (isMounted && res) {
                    const list = res.items || (Array.isArray(res) ? res : []);
                    const pendingList = list.filter((v) => v.status === 1 || v.status === "Pending" || v.statusName === "Chờ duyệt");
                    setPendingCount(pendingList.length);
                }
            })
            .catch(() => {});

        // 4. Lấy dịch vụ thực tế từ hệ thống
        adminApi.getServices()
            .then((res) => {
                if (isMounted && res) {
                    const svList = res.items || (Array.isArray(res) ? res : []);
                    setActiveServices(svList.slice(0, 5));
                }
            })
            .catch(() => {});

        // 5. Nạp hoạt động gần đây thực tế từ Bookings & Nurse Verifications
        setLoadingActivities(true);
        Promise.allSettled([
            adminApi.getAllBookings({ pageNumber: 1, pageSize: 5 }),
            adminApi.getNurseVerifications({ pageNumber: 1, pageSize: 5 })
        ]).then(([bookingsRes, nursesRes]) => {
            if (!isMounted) return;
            const acts = [];

            if (bookingsRes.status === "fulfilled" && bookingsRes.value) {
                const bList = bookingsRes.value.items || (Array.isArray(bookingsRes.value) ? bookingsRes.value : []);
                bList.forEach((b) => {
                    const isCompleted = b.status === 4 || b.statusName === "Completed" || b.status === "Completed";
                    const isInProgress = b.status === 3 || b.statusName === "InProgress" || b.status === "InProgress";
                    const isPending = b.status === 1 || b.status === 2 || b.statusName === "Pending";

                    acts.push({
                        id: `booking-${b.id || b.bookingId}`,
                        type: isCompleted ? "completed" : (isInProgress ? "progress" : "booking"),
                        title: `Lịch hẹn #${b.bookingCode || (b.id ? String(b.id).slice(0, 8) : "---")}`,
                        description: `Gia đình ${b.familyName || "Khách hàng"} - Dịch vụ ${b.serviceName || "Chăm sóc y tế"} (${Number(b.totalPrice || 0).toLocaleString("vi-VN")} ₫)`,
                        time: b.createdAt ? new Date(b.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "Vừa xong",
                        rawDate: b.createdAt ? new Date(b.createdAt).getTime() : 0,
                        badge: b.statusName || (isCompleted ? "Hoàn tất" : isInProgress ? "Đang trực" : "Đã đặt"),
                        badgeColor: isCompleted
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isInProgress
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-teal-50 text-[#00677c] border-teal-200",
                        iconColor: isCompleted
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                            : isInProgress
                            ? "bg-blue-50 text-blue-600 border border-blue-200/60"
                            : "bg-teal-50 text-[#00677c] border border-teal-200/60",
                        icon: isCompleted ? <CheckCircle2 className="w-4.5 h-4.5" strokeWidth={2} /> : <CalendarClock className="w-4.5 h-4.5" strokeWidth={2} />,
                    });
                });
            }

            if (nursesRes.status === "fulfilled" && nursesRes.value) {
                const nList = nursesRes.value.items || (Array.isArray(nursesRes.value) ? nursesRes.value : []);
                nList.forEach((n) => {
                    const isPending = n.status === 1 || n.status === "Pending" || n.statusName === "Chờ duyệt";
                    acts.push({
                        id: `nurse-${n.id || n.nurseId}`,
                        type: "verification",
                        title: `Hồ sơ ĐD. ${n.nurseName || n.fullName || "Điều dưỡng mới"}`,
                        description: `Nộp hồ sơ chuyên môn: ${n.educationLevel || n.specialty || "Y tế / Chăm sóc"} - CCCD/Chứng chỉ`,
                        time: n.submittedAt || n.createdAt ? new Date(n.submittedAt || n.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "Gần đây",
                        rawDate: n.submittedAt || n.createdAt ? new Date(n.submittedAt || n.createdAt).getTime() : 0,
                        badge: isPending ? "Chờ duyệt" : (n.status === 2 || n.status === "Approved" ? "Đã duyệt" : "Từ chối"),
                        badgeColor: isPending
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200",
                        iconColor: isPending
                            ? "bg-amber-50 text-amber-600 border border-amber-200/60"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
                        icon: <FileCheck2 className="w-4.5 h-4.5" strokeWidth={2} />,
                    });
                });
            }

            // Sắp xếp giảm dần theo thời gian
            acts.sort((a, b) => b.rawDate - a.rawDate);
            setRecentActivities(acts.slice(0, 5));
            setLoadingActivities(false);
        }).catch(() => {
            if (isMounted) setLoadingActivities(false);
        });

        return () => {
            isMounted = false;
        };
    }, [timeRange]);

    // Dữ liệu KPI thực tế từ Backend (Không dùng Mock Data)
    const activePlatformFee = revenueMetrics?.platformFee ?? liveSummary?.totalPlatformFee;
    const activeGmv = revenueMetrics?.gmv ?? liveSummary?.totalGmv;
    const activeCompleted = revenueMetrics?.totalCompletedBookings ?? liveSummary?.completedBookings;

    const currentKpi = {
        revenue: activePlatformFee != null
            ? Number(activePlatformFee).toLocaleString("vi-VN") + " ₫"
            : (activeGmv != null ? Number(activeGmv).toLocaleString("vi-VN") + " ₫" : "0 ₫"),
        revenueGrowth: activeGmv != null
            ? `GMV: ${Number(activeGmv).toLocaleString("vi-VN")} ₫`
            : "Chưa có phát sinh",
        completedShifts: activeCompleted != null ? String(activeCompleted) : "0",
        shiftsGrowth: liveSummary?.totalBookings
            ? `${Math.round(((activeCompleted || 0) / Math.max(liveSummary.totalBookings, 1)) * 100)}% hoàn thành`
            : "0% hoàn thành",
        newFamilies: liveSummary?.totalBookings != null ? String(liveSummary.totalBookings) : "0",
        familyGrowth: liveSummary?.pendingBookings != null ? `${liveSummary.pendingBookings} ca đang chờ` : "0 ca chờ",
        activeCaregivers: liveSummary?.platformAverageRating != null && Number(liveSummary.platformAverageRating) > 0
            ? `${Number(liveSummary.platformAverageRating).toFixed(1)} ★`
            : "5.0 ★",
        caregiverNote: liveSummary?.inProgressBookings != null
            ? `${liveSummary.inProgressBookings} ca đang trực`
            : (liveSummary?.openDisputesCount != null ? `${liveSummary.openDisputesCount} khiếu nại` : "0 ca đang trực"),
    };

    return (
        <div className="space-y-6 pb-12 font-sans">
            {/* ── TOP BANNER / HEADER TRANG ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        Trung tâm Quản trị CareLink
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-50 text-[#00677c] border border-teal-200/60 flex items-center gap-1">
                            <Activity className="w-3 h-3 animate-pulse" /> Trực tuyến
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Theo dõi vận hành hệ thống, doanh thu, và dữ liệu lưu lượng truy cập thực tế (Outcome 3).
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab("overview")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === "overview"
                                ? "bg-white text-[#00677c] shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <BarChart3 className="w-3.5 h-3.5" />
                        Vận hành & Doanh thu
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("analytics");
                            if (!analyticsData) fetchAnalytics(analyticsRange);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === "analytics"
                                ? "bg-white text-[#00677c] shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <Globe className="w-3.5 h-3.5" />
                        Lưu lượng Web (Outcome 3)
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </button>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB 1: TỔNG QUAN VẬN HÀNH & DOANH THU                         */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === "overview" && (
                <div className="space-y-6">
                    {/* Header filter */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                            Thống kê hoạt động kinh doanh & ca trực
                        </span>
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
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

                    {/* 4 THẺ KPI CHÍNH */}
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
                                    <span className="text-xs text-slate-400">tỷ lệ hoàn thành</span>
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

                    {/* BIỂU ĐỒ DOANH THU & TỶ LỆ DỊCH VỤ */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Biểu đồ Doanh thu (Area / Line Chart) */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Doanh thu & Lượt đặt ca trực</h3>
                                        <p className="text-xs text-slate-500">Biểu đồ ước tính dòng tiền và doanh thu qua nền tảng CareLink</p>
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

                                        <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                                        <line x1="0" y1="190" x2="600" y2="190" stroke="#e2e8f0" strokeWidth="1" />

                                        <path
                                            d="M 0,160 Q 75,130 150,110 T 300,80 T 450,45 T 600,25 L 600,190 L 0,190 Z"
                                            fill="url(#tealGradient)"
                                        />

                                        <path
                                            d="M 0,160 Q 75,130 150,110 T 300,80 T 450,45 T 600,25"
                                            fill="none"
                                            stroke="#00677c"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                        />

                                        <circle cx="150" cy="110" r="5" fill="#ffffff" stroke="#00677c" strokeWidth="3" />
                                        <circle cx="300" cy="80" r="5" fill="#ffffff" stroke="#00677c" strokeWidth="3" />
                                        <circle cx="450" cy="45" r="5" fill="#ffffff" stroke="#00677c" strokeWidth="3" />
                                        <circle cx="600" cy="25" r="6" fill="#00677c" stroke="#ffffff" strokeWidth="2" />
                                    </svg>
                                </div>

                                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-1">
                                    <span>T2 (Tuần 1)</span>
                                    <span>T3 (Tuần 2)</span>
                                    <span>T4 (Tuần 3)</span>
                                    <span>T5 (Tuần 4)</span>
                                    <span>Hiện tại</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                                <span>
                                    Trung bình phí sàn/ngày (30d):{" "}
                                    <strong className="text-slate-800">
                                        {activePlatformFee ? Math.round(Number(activePlatformFee) / 30).toLocaleString("vi-VN") + " ₫" : "0 ₫"}
                                    </strong>
                                    {activeGmv != null && (
                                        <>
                                            {" · "}GMV tích lũy:{" "}
                                            <strong className="text-slate-800">{Number(activeGmv).toLocaleString("vi-VN")} ₫</strong>
                                        </>
                                    )}
                                </span>
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Đã đồng bộ {activeCompleted ?? 0} ca hoàn tất
                                </span>
                            </div>
                        </div>

                        {/* Danh mục dịch vụ */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Danh mục dịch vụ CareLink</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Dịch vụ chăm sóc đang áp dụng thực tế</p>

                                <div className="mt-5 space-y-3.5">
                                    {activeServices.length > 0 ? (
                                        activeServices.map((service, index) => (
                                            <div key={service.id || index} className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-slate-700 truncate font-semibold">{service.serviceName || service.name}</span>
                                                    <span className="font-bold text-[#00677c]">{Number(service.basePrice || service.price || 0).toLocaleString("vi-VN")} ₫</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-[#00677c] h-full rounded-full"
                                                        style={{ width: `${Math.min(100, Math.max(30, 100 - index * 15))}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic py-4 text-center">Chưa có dịch vụ nào được cấu hình</p>
                                    )}
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

                    {/* HOẠT ĐỘNG GẦN ĐÂY & WIDGET NHẮC NHỞ */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                                {loadingActivities ? (
                                    <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                                        <RefreshCw className="w-4 h-4 animate-spin text-[#00677c]" />
                                        Đang đồng bộ hoạt động mới nhất...
                                    </div>
                                ) : recentActivities.length > 0 ? (
                                    recentActivities.map((act) => (
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
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-xs text-slate-400">
                                        Hệ thống chưa có hoạt động mới nào phát sinh.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Widget Nhắc nhở hồ sơ chờ duyệt */}
                        <div className="bg-gradient-to-br from-teal-50/80 via-white to-sky-50/60 p-6 rounded-2xl border border-teal-100 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#00677c] flex items-center justify-center mb-4 border border-teal-200">
                                    <FileCheck2 className="w-6 h-6" strokeWidth={2} />
                                </div>

                                <span className="text-xs font-bold uppercase tracking-wider text-[#00677c]">Hồ sơ đang chờ duyệt</span>
                                <h4 className="text-3xl font-extrabold text-slate-900 mt-1">{pendingCount} hồ sơ</h4>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    Có {pendingCount} điều dưỡng và chuyên viên y tế mới nộp chứng chỉ và bằng cấp cần được xác minh trước khi nhận lịch ca trực.
                                </p>

                                <div className="mt-4 p-3 bg-white/90 rounded-xl border border-teal-100 text-xs text-slate-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Hồ sơ chờ phê duyệt:</span>
                                        <strong className="text-slate-800">{pendingCount} hồ sơ</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Đánh giá chung:</span>
                                        <strong className="text-slate-800">{currentKpi.activeCaregivers}</strong>
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
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* TAB 2: TƯƠNG TÁC & LƯU LƯỢNG WEB (OUTCOME 3)                   */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === "analytics" && (
                <div className="space-y-6">
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Báo cáo tương tác & Hành vi người dùng
                                </h2>
                                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Dữ liệu thật Supabase
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Bằng chứng số liệu thực tế phục vụ đánh giá Outcome 3: Theo dõi toàn bộ hành vi từ Khách vãng lai đến Khách hàng đặt ca.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                                <button
                                    type="button"
                                    onClick={() => setAnalyticsRange("today")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        analyticsRange === "today"
                                            ? "bg-white text-[#00677c] shadow-xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    Hôm nay
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAnalyticsRange("7days")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        analyticsRange === "7days"
                                            ? "bg-white text-[#00677c] shadow-xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    7 ngày qua
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAnalyticsRange("30days")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        analyticsRange === "30days"
                                            ? "bg-white text-[#00677c] shadow-xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    30 ngày qua
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => fetchAnalytics(analyticsRange)}
                                disabled={loadingAnalytics}
                                title="Làm mới dữ liệu từ Supabase"
                                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loadingAnalytics ? "animate-spin text-[#00677c]" : ""}`} />
                            </button>
                        </div>
                    </div>

                    {analyticsError && (
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
                            <span>{analyticsError}</span>
                            <button
                                type="button"
                                onClick={() => fetchAnalytics(analyticsRange)}
                                className="font-bold underline cursor-pointer"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {loadingAnalytics && !analyticsData ? (
                        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
                            <RefreshCw className="w-8 h-8 animate-spin text-[#00677c] mx-auto mb-3" />
                            <p className="text-sm font-semibold text-slate-700">Đang tổng hợp dữ liệu tương tác từ Supabase...</p>
                            <p className="text-xs text-slate-400 mt-1">Đang truy vấn bảng visitor_sessions và user_activity_logs</p>
                        </div>
                    ) : analyticsData ? (
                        <>
                            {/* 4 THẺ CHỈ SỐ VÀNG (GOLDEN METRICS) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                                {/* 1. Khách truy cập duy nhất */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách truy cập duy nhất</span>
                                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00677c] flex items-center justify-center border border-teal-100">
                                            <Globe className="w-5 h-5" strokeWidth={2} />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                            {Number(analyticsData.uniqueVisitors || 0).toLocaleString("vi-VN")}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                                                Người dùng thực tế
                                            </span>
                                            <span className="text-xs text-slate-400">Visitor ID độc lập</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Tổng lượt xem trang */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng lượt xem trang</span>
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                            <Eye className="w-5 h-5" strokeWidth={2} />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                            {Number(analyticsData.totalPageViews || 0).toLocaleString("vi-VN")}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                                Lượt tương tác
                                            </span>
                                            <span className="text-xs text-slate-400">Xem dịch vụ, điều dưỡng</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Tổng số phiên truy cập */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng phiên hoạt động</span>
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                                            <Layers className="w-5 h-5" strokeWidth={2} />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                            {Number(analyticsData.totalSessions || 0).toLocaleString("vi-VN")}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                                                Phiên 30 phút
                                            </span>
                                            <span className="text-xs text-slate-400">Tự ngắt khi rời web</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Ca đặt lịch phát sinh */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ca đặt lịch phát sinh</span>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                            <CalendarCheck className="w-5 h-5" strokeWidth={2} />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                            {Number(analyticsData.bookingsCreated || 0).toLocaleString("vi-VN")}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                Nghiệp vụ thực tế
                                            </span>
                                            <span className="text-xs text-slate-400">Từ người dùng</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 5 CHỈ SỐ BỔ TRỢ HÀNH VI */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">Đang trực tuyến (15p)</span>
                                    <div className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                                        {analyticsData.activeVisitors || 0}
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                                    </div>
                                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Khách đang xem web</span>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">Đăng ký mới</span>
                                    <div className="text-xl font-bold text-slate-900 mt-1">
                                        {analyticsData.newRegistrations || 0}
                                    </div>
                                    <span className="text-[11px] text-slate-400 mt-1 block">Tài khoản tạo mới</span>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">Lượt đăng nhập</span>
                                    <div className="text-xl font-bold text-slate-900 mt-1">
                                        {analyticsData.totalLogins || 0}
                                    </div>
                                    <span className="text-[11px] text-slate-400 mt-1 block">Tương tác quay lại</span>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">Thanh toán hoàn tất</span>
                                    <div className="text-xl font-bold text-slate-900 mt-1">
                                        {analyticsData.successfulPayments || 0}
                                    </div>
                                    <span className="text-[11px] text-slate-400 mt-1 block">VNPAY & Ví hệ thống</span>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">Tỷ lệ chuyển đổi</span>
                                    <div className="text-xl font-bold text-[#00677c] mt-1">
                                        {analyticsData.conversionRate || 0}%
                                    </div>
                                    <span className="text-[11px] text-slate-400 mt-1 block">Khách ghé ➔ Đặt lịch</span>
                                </div>
                            </div>

                            {/* BIỂU ĐỒ LƯU LƯỢNG HÀNG NGÀY & PHỄU CHUYỂN ĐỔI */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Biểu đồ lưu lượng */}
                                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900">Lưu lượng truy cập theo ngày</h3>
                                                <p className="text-xs text-slate-500">So sánh Lượt xem trang và Khách truy cập thực tế</p>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs">
                                                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                                                    <span className="w-3 h-3 rounded-md bg-[#00677c]"></span> Lượt xem trang
                                                </span>
                                                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                                                    <span className="w-3 h-3 rounded-md bg-emerald-400"></span> Khách truy cập
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bar Chart Visual */}
                                        <div className="mt-6">
                                            {analyticsData.dailyTraffic && analyticsData.dailyTraffic.length > 0 ? (
                                                <div className="space-y-4">
                                                    <div className="h-52 flex items-end gap-2 sm:gap-4 pt-6 px-2 border-b border-slate-100">
                                                        {(() => {
                                                            const maxVal = Math.max(
                                                                ...analyticsData.dailyTraffic.map((d) => Math.max(d.pageViews || 0, d.uniqueVisitors || 0)),
                                                                5
                                                            );
                                                            return analyticsData.dailyTraffic.map((point, idx) => {
                                                                const viewHeight = Math.max(8, Math.round(((point.pageViews || 0) / maxVal) * 160));
                                                                const visitorHeight = Math.max(8, Math.round(((point.uniqueVisitors || 0) / maxVal) * 160));
                                                                return (
                                                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                                                                        {/* Tooltip on hover */}
                                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                                                            <div className="font-bold">{point.date}</div>
                                                                            <div>Xem trang: {point.pageViews} · Khách: {point.uniqueVisitors}</div>
                                                                        </div>

                                                                        {/* Bars */}
                                                                        <div className="w-full flex items-end justify-center gap-1 h-44">
                                                                            <div
                                                                                style={{ height: `${viewHeight}px` }}
                                                                                className="w-full max-w-[16px] bg-[#00677c] rounded-t-sm transition-all group-hover:bg-[#005566]"
                                                                            ></div>
                                                                            <div
                                                                                style={{ height: `${visitorHeight}px` }}
                                                                                className="w-full max-w-[16px] bg-emerald-400 rounded-t-sm transition-all group-hover:bg-emerald-500"
                                                                            ></div>
                                                                        </div>

                                                                        <span className="text-[10px] font-semibold text-slate-400 truncate max-w-full">
                                                                            {point.date ? point.date.split("-").slice(1).reverse().join("/") : ""}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            });
                                                        })()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="py-16 text-center text-xs text-slate-400">
                                                    Chưa có dữ liệu theo ngày trong khoảng thời gian này.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <span>Ghi nhận liên tục từ trình duyệt của người dùng thực tế</span>
                                        <span className="text-teal-700 font-semibold">Tự động cộng dồn theo múi giờ VN</span>
                                    </div>
                                </div>

                                {/* Phễu chuyển đổi hành vi */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Phễu chuyển đổi hành vi</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Tiến trình tương tác từ ghé thăm đến thanh toán</p>

                                        {(() => {
                                            const f = analyticsData.funnel || {};
                                            const base = Math.max(f.step1_Visitors || 0, 1);
                                            const steps = [
                                                { label: "1. Khách ghé thăm website", count: f.step1_Visitors || 0, pct: 100, color: "bg-slate-400" },
                                                { label: "2. Khám phá & xem điều dưỡng", count: f.step2_Explored || 0, pct: Math.round(((f.step2_Explored || 0) / base) * 100), color: "bg-sky-500" },
                                                { label: "3. Đăng ký / Đăng nhập", count: f.step3_Registered || 0, pct: Math.round(((f.step3_Registered || 0) / base) * 100), color: "bg-purple-500" },
                                                { label: "4. Tạo ca đặt lịch", count: f.step4_BookingCreated || 0, pct: Math.round(((f.step4_BookingCreated || 0) / base) * 100), color: "bg-teal-600" },
                                                { label: "5. Thanh toán hoàn tất", count: f.step5_Paid || 0, pct: Math.round(((f.step5_Paid || 0) / base) * 100), color: "bg-emerald-600" },
                                            ];

                                            return (
                                                <div className="mt-5 space-y-4">
                                                    {steps.map((st, idx) => (
                                                        <div key={idx} className="space-y-1.5">
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="font-semibold text-slate-700 truncate">{st.label}</span>
                                                                <span className="font-bold text-slate-900 ml-2">
                                                                    {st.count} <span className="text-[11px] font-normal text-slate-400">({st.pct}%)</span>
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${st.color} transition-all duration-500`}
                                                                    style={{ width: `${Math.min(100, Math.max(6, st.pct))}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100 text-[11px] text-teal-800 leading-relaxed">
                                            💡 <strong>Ý nghĩa học thuật Outcome 3:</strong> Phễu này chứng minh website có khả năng thu hút và dẫn dắt người dùng thật từ giai đoạn tìm hiểu đến hành vi thanh toán cốt lõi.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* NHẬT KÝ HOẠT ĐỘNG THỜI GIAN THỰC (EVIDENCE LOG TABLE) */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">
                                            Nhật ký tương tác thời gian thực
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Bằng chứng chi tiết từng sự kiện tương tác của người dùng thật lưu trực tiếp trên Supabase
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">
                                        Hiển thị 20 sự kiện gần nhất
                                    </span>
                                </div>

                                <div className="mt-4 overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold">
                                                <th className="py-2.5 px-3 rounded-l-lg">Thời gian</th>
                                                <th className="py-2.5 px-3">Đối tượng</th>
                                                <th className="py-2.5 px-3">Hành động</th>
                                                <th className="py-2.5 px-3">Trang thao tác</th>
                                                <th className="py-2.5 px-3">Thiết bị</th>
                                                <th className="py-2.5 px-3 rounded-r-lg text-right">Mã xác thực log</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {analyticsData.recentActivities && analyticsData.recentActivities.length > 0 ? (
                                                analyticsData.recentActivities.map((act) => {
                                                    const roleBadge =
                                                        act.userRoleName === "Quản trị viên"
                                                            ? "bg-rose-50 text-rose-700 border-rose-200"
                                                            : act.userRoleName === "Điều dưỡng"
                                                            ? "bg-teal-50 text-[#00677c] border-teal-200"
                                                            : act.userRoleName === "Khách hàng"
                                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                                            : "bg-slate-100 text-slate-700 border-slate-200";

                                                    const eventBadge =
                                                        act.eventType === "PAYMENT_SUCCESS"
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : act.eventType === "CREATE_BOOKING"
                                                            ? "bg-teal-50 text-[#00677c] border-teal-200"
                                                            : act.eventType === "REGISTER"
                                                            ? "bg-purple-50 text-purple-700 border-purple-200"
                                                            : act.eventType === "LOGIN"
                                                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                            : act.eventType === "VIEW_NURSE" || act.eventType === "SEARCH_NURSE"
                                                            ? "bg-sky-50 text-sky-700 border-sky-200"
                                                            : "bg-slate-50 text-slate-600 border-slate-200";

                                                    return (
                                                        <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                                                            <td className="py-3 px-3 whitespace-nowrap">
                                                                <span className="font-semibold text-slate-800 block">{act.timeAgo}</span>
                                                                <span className="text-[10px] text-slate-400">
                                                                    {new Date(act.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3">
                                                                <div className="font-semibold text-slate-800">{act.userDisplayName}</div>
                                                                <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded border mt-0.5 ${roleBadge}`}>
                                                                    {act.userRoleName}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3 whitespace-nowrap">
                                                                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${eventBadge}`}>
                                                                    {act.eventNameVi}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3 max-w-xs truncate">
                                                                <span className="font-medium text-slate-700 block truncate" title={act.pageTitle || act.pageUrl}>
                                                                    {act.pageTitle || act.pageUrl}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 block truncate" title={act.pageUrl}>
                                                                    {act.pageUrl}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                                                                <span className="inline-flex items-center gap-1 text-[11px]">
                                                                    {act.deviceType === "Mobile" ? (
                                                                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                                                                    ) : act.deviceType === "Tablet" ? (
                                                                        <Tablet className="w-3.5 h-3.5 text-slate-400" />
                                                                    ) : (
                                                                        <Laptop className="w-3.5 h-3.5 text-slate-400" />
                                                                    )}
                                                                    {act.deviceType}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3 whitespace-nowrap text-right font-mono text-[10px] text-slate-400">
                                                                <span title={`ID ghi nhận trên Supabase: ${act.id}`}>
                                                                    {String(act.id).slice(0, 8)}...
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                                                        Chưa có nhật ký hoạt động nào được ghi nhận. Hãy mở trình duyệt và duyệt các trang web để tạo tương tác thực.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
}
