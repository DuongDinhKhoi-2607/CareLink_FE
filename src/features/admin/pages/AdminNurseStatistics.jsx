import React, { useState, useEffect, useCallback } from "react";
import adminApi from "../../../api/adminApi";
import {
    Users,
    Search,
    Filter,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Star,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    DollarSign,
    FileText,
    Activity,
    Shield,
    X,
    ExternalLink,
    RefreshCw,
    MapPin,
    Award
} from "lucide-react";

const formatVND = (n) =>
    Number(n || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" }).replace("₫", " VNĐ");

export default function AdminNurseStatistics() {
    const [statsData, setStatsData] = useState({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [search, setSearch] = useState("");
    const [district, setDistrict] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 10;

    // Detail drawer state
    const [selectedNurseId, setSelectedNurseId] = useState(null);
    const [nurseDetail, setNurseDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [detailTab, setDetailTab] = useState("bookings"); // 'bookings' | 'transactions'

    // Fetch list of nurse statistics
    const fetchStatistics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                PageNumber: pageNumber,
                PageSize: pageSize,
                Search: search.trim() || undefined,
                District: district || undefined,
                FromDate: fromDate || undefined,
                ToDate: toDate || undefined,
            };
            const res = await adminApi.getNurseStatistics(params);
            const data = res?.data || res;
            setStatsData({
                items: Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [],
                totalCount: data?.totalCount || (data?.items?.length || 0),
                pageNumber: data?.pageNumber || pageNumber,
                pageSize: data?.pageSize || pageSize,
                totalPages: data?.totalPages || 1,
            });
        } catch (err) {
            console.error("Lỗi tải thống kê điều dưỡng:", err);
            setError(err?.response?.data?.detail || err?.response?.data?.message || "Không thể tải danh sách thống kê điều dưỡng.");
        } finally {
            setLoading(false);
        }
    }, [pageNumber, search, district, fromDate, toDate]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    // Fetch detail when selectedNurseId changes
    const handleOpenDetail = async (nurseId) => {
        setSelectedNurseId(nurseId);
        setLoadingDetail(true);
        setNurseDetail(null);
        try {
            const res = await adminApi.getNurseDetailStatistics(nurseId);
            setNurseDetail(res?.data || res);
        } catch (err) {
            console.error("Lỗi tải chi tiết thống kê điều dưỡng:", err);
        } finally {
            setLoadingDetail(false);
        }
    };

    // Calculate aggregated metrics from loaded items
    const totalNurses = statsData.totalCount;
    const totalBookingsAgg = statsData.items.reduce((acc, curr) => acc + (curr.bookingStats?.totalBookings || 0), 0);
    const totalCompletedAgg = statsData.items.reduce((acc, curr) => acc + (curr.bookingStats?.completedBookings || 0), 0);
    const totalEarnedAgg = statsData.items.reduce((acc, curr) => acc + (curr.financialStats?.totalEarned || 0), 0);
    const totalWalletBalanceAgg = statsData.items.reduce((acc, curr) => acc + (curr.financialStats?.currentWalletBalance || 0), 0);

    return (
        <div className="space-y-6 pb-12 font-sans">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Activity className="w-6 h-6 text-[#00677c]" />
                        Thống kê Điều dưỡng & Quyết toán Ca trực
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Báo cáo năng suất ca trực, tỷ lệ hoàn thành, đánh giá sao và chi tiết biến động số dư ví của từng điều dưỡng.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={fetchStatistics}
                    disabled={loading}
                    className="self-start md:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Làm mới</span>
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#00677c] flex items-center justify-center font-bold shrink-0">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tổng điều dưỡng</p>
                        <p className="text-2xl font-bold text-slate-900">{totalNurses}</p>
                        <p className="text-[11px] text-teal-600 font-medium mt-0.5">Hồ sơ trong hệ thống</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Ca hoàn thành (Trang này)</p>
                        <p className="text-2xl font-bold text-slate-900">{totalCompletedAgg} <span className="text-xs text-slate-400 font-normal">/ {totalBookingsAgg} ca</span></p>
                        <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                            {totalBookingsAgg > 0 ? `${Math.round((totalCompletedAgg / totalBookingsAgg) * 100)}% hoàn thành` : "0%"}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tổng thu nhập giải ngân</p>
                        <p className="text-xl font-bold text-slate-900">{formatVND(totalEarnedAgg)}</p>
                        <p className="text-[11px] text-blue-600 font-medium mt-0.5">Cộng vào ví điều dưỡng</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Số dư ví hiện tại</p>
                        <p className="text-xl font-bold text-slate-900">{formatVND(totalWalletBalanceAgg)}</p>
                        <p className="text-[11px] text-amber-600 font-medium mt-0.5">Đang lưu giữ trong ví</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo tên, SĐT, email điều dưỡng..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00677c]"
                        />
                    </div>

                    {/* District Filter */}
                    <div className="w-44">
                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#00677c] cursor-pointer"
                        >
                            <option value="">Tất cả quận / huyện</option>
                            <option value="Quận 1">Quận 1</option>
                            <option value="Quận 3">Quận 3</option>
                            <option value="Quận 5">Quận 5</option>
                            <option value="Quận 7">Quận 7</option>
                            <option value="Quận 10">Quận 10</option>
                            <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                            <option value="Quận Tân Bình">Quận Tân Bình</option>
                            <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                            <option value="Quận Gò Vấp">Quận Gò Vấp</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {(search || district || fromDate || toDate) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setDistrict("");
                                setFromDate("");
                                setToDate("");
                                setPageNumber(1);
                            }}
                            className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors cursor-pointer"
                        >
                            Xóa lọc
                        </button>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="py-3.5 px-4 sm:px-6">Điều dưỡng</th>
                                <th className="py-3.5 px-4">Địa bàn</th>
                                <th className="py-3.5 px-4">Đánh giá ⭐</th>
                                <th className="py-3.5 px-4">Ca trực</th>
                                <th className="py-3.5 px-4">Tỷ lệ hoàn thành</th>
                                <th className="py-3.5 px-4">Thu nhập kiếm được</th>
                                <th className="py-3.5 px-4">Số dư ví / Đã rút</th>
                                <th className="py-3.5 px-4 text-right">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-slate-400">
                                        <div className="w-8 h-8 border-3 border-[#00677c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                        <p className="font-semibold">Đang tải dữ liệu thống kê...</p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-rose-500">
                                        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-rose-400" />
                                        <p className="font-bold">{error}</p>
                                        <button
                                            type="button"
                                            onClick={fetchStatistics}
                                            className="mt-3 px-4 py-1.5 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700 transition-colors cursor-pointer"
                                        >
                                            Thử lại
                                        </button>
                                    </td>
                                </tr>
                            ) : statsData.items.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-slate-400">
                                        <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                        <p className="font-semibold">Không tìm thấy điều dưỡng nào phù hợp</p>
                                    </td>
                                </tr>
                            ) : (
                                statsData.items.map((nurse) => (
                                    <tr key={nurse.nurseId} className="hover:bg-slate-50/80 transition-colors">
                                        {/* Nurse info */}
                                        <td className="py-3.5 px-4 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={nurse.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(nurse.fullName || "Nurse")}&background=00677c&color=fff`}
                                                    alt={nurse.fullName}
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-900 leading-snug">{nurse.fullName}</p>
                                                    <p className="text-[11px] text-slate-400">{nurse.phoneNumber || nurse.email || "—"}</p>
                                                    <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${nurse.isAcceptingBookings ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-500"}`}>
                                                        {nurse.isAcceptingBookings ? "Sẵn sàng nhận việc" : "Đang tạm nghỉ"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* District */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1 text-slate-700">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{nurse.workDistrict || "Chưa cài đặt"}</span>
                                            </div>
                                        </td>

                                        {/* Rating */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1 font-bold text-slate-800">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                                                <span>{Number(nurse.averageRating || 5).toFixed(1)}</span>
                                                <span className="text-[11px] text-slate-400 font-normal">({nurse.totalReviews || 0})</span>
                                            </div>
                                        </td>

                                        {/* Booking stats */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <div>
                                                <span className="font-bold text-slate-900">{nurse.bookingStats?.totalBookings || 0} ca</span>
                                                <div className="text-[11px] text-slate-500 mt-0.5">
                                                    <span className="text-emerald-600 font-semibold">{nurse.bookingStats?.completedBookings || 0} HT</span> ·{" "}
                                                    <span className="text-rose-500">{nurse.bookingStats?.canceledBookings || 0} Hủy</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Completion rate */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-emerald-500 h-full rounded-full"
                                                        style={{ width: `${Math.min(100, Math.max(0, nurse.bookingStats?.completionRate || 0))}%` }}
                                                    />
                                                </div>
                                                <span className="font-bold text-slate-700">{Math.round(nurse.bookingStats?.completionRate || 0)}%</span>
                                            </div>
                                        </td>

                                        {/* Total Earned */}
                                        <td className="py-3.5 px-4 whitespace-nowrap font-bold text-teal-700">
                                            {formatVND(nurse.financialStats?.totalEarned || 0)}
                                        </td>

                                        {/* Wallet / Withdrawn */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <p className="font-bold text-slate-900">{formatVND(nurse.financialStats?.currentWalletBalance || 0)}</p>
                                            <p className="text-[10px] text-slate-400">Đã rút: {formatVND(nurse.financialStats?.totalWithdrawn || 0)}</p>
                                        </td>

                                        {/* Action */}
                                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenDetail(nurse.nurseId)}
                                                className="px-3 py-1.5 rounded-xl bg-[#00677c]/10 text-[#00677c] hover:bg-[#00677c] hover:text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                                            >
                                                <span>Chi tiết</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {statsData.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Trang {statsData.pageNumber} / {statsData.totalPages} ({statsData.totalCount} điều dưỡng)</span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={statsData.pageNumber <= 1}
                                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                disabled={statsData.pageNumber >= statsData.totalPages}
                                onClick={() => setPageNumber((p) => p + 1)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Drawer Modal */}
            {selectedNurseId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
                    onClick={() => setSelectedNurseId(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col my-auto max-h-[92vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 via-white to-slate-50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00677c]/10 text-[#00677c] flex items-center justify-center font-bold">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                        Báo cáo & Sao kê Dòng tiền Điều dưỡng
                                    </h3>
                                    <p className="text-xs text-slate-500">Mã ID: {selectedNurseId}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedNurseId(null)}
                                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700">
                            {loadingDetail ? (
                                <div className="py-24 text-center text-slate-400">
                                    <div className="w-8 h-8 border-3 border-[#00677c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                    <p className="font-semibold">Đang tải chi tiết hồ sơ & sao kê...</p>
                                </div>
                            ) : !nurseDetail ? (
                                <div className="py-16 text-center text-slate-400">
                                    <AlertCircle className="w-10 h-10 mx-auto mb-2 text-rose-400" />
                                    <p className="font-bold">Không thể tải thông tin điều dưỡng</p>
                                </div>
                            ) : (
                                <>
                                    {/* Nurse Profile Overview */}
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start gap-4">
                                        <img
                                            src={nurseDetail.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(nurseDetail.fullName)}&background=00677c&color=fff`}
                                            alt={nurseDetail.fullName}
                                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-base font-bold text-slate-900">{nurseDetail.fullName}</h4>
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#00677c] border border-teal-200">
                                                    ⭐ {Number(nurseDetail.averageRating || 5).toFixed(1)} / 5 ({nurseDetail.totalReviews || 0} đánh giá)
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                SĐT: <strong className="text-slate-800">{nurseDetail.phoneNumber || "—"}</strong> · Email: <strong className="text-slate-800">{nurseDetail.email || "—"}</strong>
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Địa bàn làm việc: <strong className="text-[#00677c]">{nurseDetail.workDistrict || "Toàn thành phố"}</strong> · Chứng chỉ hành nghề: <strong className="text-slate-800">{nurseDetail.licenseNumber || "Đã xác thực"}</strong>
                                            </p>
                                            {nurseDetail.bio && (
                                                <p className="text-xs text-slate-600 italic mt-2 border-t border-slate-200 pt-2">
                                                    "{nurseDetail.bio}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* 4 Financial & Booking stats cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Tổng ca trực</p>
                                            <p className="text-lg font-bold text-slate-900 mt-1">{nurseDetail.bookingStats?.totalBookings || 0}</p>
                                            <p className="text-[11px] text-emerald-600 font-semibold">{nurseDetail.bookingStats?.completedBookings || 0} hoàn thành</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Tổng thu nhập</p>
                                            <p className="text-lg font-bold text-teal-700 mt-1">{formatVND(nurseDetail.financialStats?.totalEarned || 0)}</p>
                                            <p className="text-[11px] text-slate-400">Từ các ca hoàn tất</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Số dư ví hiện tại</p>
                                            <p className="text-lg font-bold text-emerald-700 mt-1">{formatVND(nurseDetail.financialStats?.currentWalletBalance || 0)}</p>
                                            <p className="text-[11px] text-slate-400">Khả dụng trong ví</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Đã rút về NH</p>
                                            <p className="text-lg font-bold text-slate-800 mt-1">{formatVND(nurseDetail.financialStats?.totalWithdrawn || 0)}</p>
                                            <p className="text-[11px] text-amber-600">Chờ rút: {formatVND(nurseDetail.financialStats?.pendingPayout || 0)}</p>
                                        </div>
                                    </div>

                                    {/* Tabs for Recent Bookings vs Recent Transactions */}
                                    <div className="border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setDetailTab("bookings")}
                                            className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${detailTab === "bookings" ? "border-[#00677c] text-[#00677c]" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                                        >
                                            Ca trực gần đây ({nurseDetail.recentBookings?.length || 0})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDetailTab("transactions")}
                                            className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${detailTab === "transactions" ? "border-[#00677c] text-[#00677c]" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                                        >
                                            Sao kê biến động số dư ví ({nurseDetail.recentTransactions?.length || 0})
                                        </button>
                                    </div>

                                    {/* Tab 1: Recent Bookings */}
                                    {detailTab === "bookings" && (
                                        <div className="space-y-2">
                                            {nurseDetail.recentBookings?.length === 0 ? (
                                                <p className="text-center text-slate-400 py-8">Chưa có ca trực nào được ghi nhận</p>
                                            ) : (
                                                nurseDetail.recentBookings?.map((b) => (
                                                    <div key={b.bookingId} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                                                        <div>
                                                            <p className="font-bold text-slate-900">
                                                                #{b.bookingId.slice(0, 8)} · Khách hàng: {b.customerName}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                                Người nhận: {b.recipientName} · {new Date(b.scheduledStart).toLocaleDateString("vi-VN")}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-teal-800">{formatVND(b.totalPrice)}</p>
                                                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                                                                {b.statusName || (b.status === 5 ? "Đã hoàn thành" : b.status === 6 ? "Đã hủy" : "Đang thực hiện")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {/* Tab 2: Recent Transactions */}
                                    {detailTab === "transactions" && (
                                        <div className="space-y-2">
                                            {nurseDetail.recentTransactions?.length === 0 ? (
                                                <p className="text-center text-slate-400 py-8">Chưa có giao dịch ví nào</p>
                                            ) : (
                                                nurseDetail.recentTransactions?.map((t) => {
                                                    const isPlus = t.amount > 0;
                                                    return (
                                                        <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${isPlus ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                                                    {isPlus ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-900">{t.description || t.typeName}</p>
                                                                    <p className="text-[10px] text-slate-400">{new Date(t.createdAt).toLocaleString("vi-VN")}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className={`font-bold ${isPlus ? "text-emerald-600" : "text-rose-600"}`}>
                                                                    {isPlus ? "+" : ""}{formatVND(t.amount)}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400">Số dư sau GD: {formatVND(t.balanceAfter)}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Drawer Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50 shrink-0">
                            <button
                                type="button"
                                onClick={() => setSelectedNurseId(null)}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
