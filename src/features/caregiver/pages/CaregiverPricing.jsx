import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    DollarSign,
    Save,
    CheckCircle2,
    AlertCircle,
    Clock,
    ShieldAlert,
    RefreshCw,
    Sparkles,
    Sliders,
    Layers,
    Info,
    ArrowLeft,
    Check,
    MapPin,
    Calendar,
    FileCheck2,
    RotateCcw,
} from "lucide-react";
import caregiverApi from "../../../api/caregiverApi";
import Toast from "../../../components/Toast";

export default function CaregiverPricing() {
    const [pricings, setPricings] = useState([]);
    const [readiness, setReadiness] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const loadPricingAndReadiness = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const [pricingRes, readinessRes] = await Promise.allSettled([
                caregiverApi.getMyPricing(),
                caregiverApi.getMyReadiness(),
            ]);

            if (pricingRes.status === "fulfilled") {
                const list = Array.isArray(pricingRes.value)
                    ? pricingRes.value
                    : pricingRes.value?.data || [];
                setPricings(list);
            } else {
                console.warn("[CareLink] Lỗi tải bảng giá:", pricingRes.reason);
                setApiError("Không thể tải bảng giá dịch vụ cá nhân từ máy chủ.");
            }

            if (readinessRes.status === "fulfilled") {
                const r = readinessRes.value?.data || readinessRes.value;
                setReadiness(r);
            }
        } catch (err) {
            console.error("[CareLink] Lỗi nạp dữ liệu bảng giá:", err);
            setApiError("Không thể kết nối đến máy chủ.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPricingAndReadiness();
    }, [loadPricingAndReadiness]);

    const handleToggleService = (serviceId) => {
        setPricings((prev) =>
            prev.map((item) =>
                item.serviceId === serviceId
                    ? { ...item, isOffered: !item.isOffered }
                    : item
            )
        );
    };

    const handlePriceChange = (serviceId, rawValue) => {
        // Chỉ lấy chữ số; cho phép rỗng khi đang gõ/xóa
        const digits = String(rawValue).replace(/[^\d]/g, "");
        setPricings((prev) =>
            prev.map((item) =>
                item.serviceId === serviceId
                    ? { ...item, customPrice: digits }
                    : item
            )
        );
    };

    const handlePriceBlur = (serviceId, basePrice) => {
        setPricings((prev) =>
            prev.map((item) => {
                if (item.serviceId !== serviceId) return item;
                if (item.customPrice === "" || item.customPrice === null || item.customPrice === undefined) {
                    return { ...item, customPrice: basePrice };
                }
                const digits = String(item.customPrice).replace(/[^\d]/g, "");
                const num = digits ? parseInt(digits, 10) : basePrice;
                return { ...item, customPrice: num };
            })
        );
    };

    const handleDurationChange = (serviceId, rawValue) => {
        // Chỉ lấy chữ số; cho phép rỗng khi đang gõ/xóa
        const digits = String(rawValue).replace(/[^\d]/g, "");
        setPricings((prev) =>
            prev.map((item) =>
                item.serviceId === serviceId
                    ? { ...item, customDurationMinutes: digits }
                    : item
            )
        );
    };

    const handleDurationBlur = (serviceId, defaultDuration) => {
        setPricings((prev) =>
            prev.map((item) => {
                if (item.serviceId !== serviceId) return item;
                if (item.customDurationMinutes === "" || item.customDurationMinutes === null || item.customDurationMinutes === undefined) {
                    return { ...item, customDurationMinutes: defaultDuration };
                }
                const digits = String(item.customDurationMinutes).replace(/[^\d]/g, "");
                const num = digits ? Math.max(15, Math.min(480, parseInt(digits, 10))) : defaultDuration;
                return { ...item, customDurationMinutes: num };
            })
        );
    };

    const handleResetToDefault = (serviceId, basePrice, defaultDuration) => {
        setPricings((prev) =>
            prev.map((item) =>
                item.serviceId === serviceId
                    ? { ...item, customPrice: basePrice, customDurationMinutes: defaultDuration }
                    : item
            )
        );
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setApiError(null);

        try {
            const payload = {
                pricings: pricings.map((p) => {
                    const rawPrice = String(p.customPrice ?? "").replace(/[^\d]/g, "");
                    const rawDuration = String(p.customDurationMinutes ?? "").replace(/[^\d]/g, "");
                    return {
                        serviceId: p.serviceId,
                        customPrice: rawPrice ? Number(rawPrice) : Number(p.basePrice) || 0,
                        customDurationMinutes: rawDuration ? Number(rawDuration) : Number(p.durationMinutes) || 60,
                        isOffered: Boolean(p.isOffered),
                    };
                }),
            };

            await caregiverApi.updateMyPricing(payload);
            showToast("Đã lưu bảng giá dịch vụ thành công!", "success");
            loadPricingAndReadiness();
        } catch (err) {
            console.error("[CareLink] Lưu bảng giá thất bại:", err);
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Không thể lưu bảng giá. Vui lòng thử lại!";
            setApiError(msg);
            showToast(msg, "error");
        } finally {
            setIsSaving(false);
        }
    };

    // Filter by search
    const filteredPricings = pricings.filter((p) =>
        p.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const offeredCount = pricings.filter((p) => p.isOffered).length;
    const avgPrice =
        offeredCount > 0
            ? Math.round(
                  pricings
                      .filter((p) => p.isOffered)
                      .reduce((sum, p) => sum + Number(p.customPrice || p.basePrice || 0), 0) /
                      offeredCount
              )
            : 0;

    return (
        <div className="p-4 sm:p-7 max-w-6xl mx-auto space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* Back button & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            to="/caregiver/dashboard"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#00677c] transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Quay lại Tổng quan
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-[#102030] flex items-center gap-2.5">
                        <Sliders className="w-6 h-6 text-[#00677c]" />
                        Cài đặt Bảng giá Dịch vụ
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Tự chủ thiết lập đơn giá mong muốn và lựa chọn danh mục dịch vụ bạn sẵn sàng tiếp nhận chăm sóc.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={loadPricingAndReadiness}
                        disabled={isLoading || isSaving}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Tải lại dữ liệu"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                        <span>Làm mới</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isLoading || isSaving || pricings.length === 0}
                        className="px-5 py-2.5 rounded-xl bg-[#00677c] hover:bg-[#005566] text-white text-xs font-bold transition-all shadow-md hover:shadow-teal-900/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? "Đang lưu..." : "Lưu bảng giá"}</span>
                    </button>
                </div>
            </div>

            {/* Readiness 4-Condition Checklist Block */}
            {readiness && (
                <div
                    className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                        readiness.isReadyToReceiveBookings
                            ? "bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border-emerald-200 shadow-sm"
                            : "bg-gradient-to-br from-amber-50/90 via-slate-50/50 to-white border-amber-200/90 shadow-sm"
                    }`}
                >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60">
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                                    readiness.isReadyToReceiveBookings
                                        ? "bg-emerald-100 text-emerald-700 shadow-2xs"
                                        : "bg-amber-100 text-amber-700 shadow-2xs"
                                }`}
                            >
                                {readiness.isReadyToReceiveBookings ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm sm:text-base font-extrabold text-[#102030]">
                                    {readiness.isReadyToReceiveBookings
                                        ? "Hồ sơ đã đạt chuẩn và sẵn sàng xuất hiện trong kết quả tìm kiếm!"
                                        : "Hoàn thiện 4 điều kiện để xuất hiện trong kết quả tìm kiếm của khách hàng"}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    CareLink yêu cầu hoàn thiện đủ 4 tiêu chuẩn để đảm bảo an toàn y tế và trải nghiệm tốt nhất cho gia đình.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    readiness.isReadyToReceiveBookings
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                        : "bg-amber-100 text-amber-900 border-amber-300"
                                }`}
                            >
                                {readiness.isReadyToReceiveBookings
                                    ? "✓ 4/4 Sẵn sàng nhận ca"
                                    : `Đã hoàn thành ${
                                          [
                                              readiness.isProfileApproved,
                                              readiness.hasWorkLocation,
                                              readiness.hasAvailability,
                                              readiness.hasServicePricing,
                                          ].filter(Boolean).length
                                      }/4`}
                            </span>
                        </div>
                    </div>

                    {/* 4 Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
                        {/* 1. Duyệt hồ sơ */}
                        <div
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                                readiness.isProfileApproved
                                    ? "bg-white/90 border-emerald-200 shadow-2xs"
                                    : "bg-white border-slate-200 hover:border-amber-300 shadow-2xs"
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                                            readiness.isProfileApproved
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <FileCheck2 className="w-4 h-4" />
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                            readiness.isProfileApproved
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-amber-50 text-amber-700 border border-amber-200"
                                        }`}
                                    >
                                        {readiness.isProfileApproved ? "✓ Đã duyệt" : "Chưa duyệt"}
                                    </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900">1. Xét duyệt hồ sơ</h4>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                    {readiness.isProfileApproved
                                        ? "Chứng từ & lý lịch đã được Ban Quản trị phê duyệt."
                                        : "Cần nộp CCCD và bằng cấp chuyên môn để Admin duyệt."}
                                </p>
                            </div>
                            {!readiness.isProfileApproved && (
                                <Link
                                    to="/caregiver/choose-role"
                                    className="mt-3 w-full py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold text-center border border-amber-200 transition"
                                >
                                    Nộp hồ sơ ngay
                                </Link>
                            )}
                        </div>

                        {/* 2. Địa bàn làm việc */}
                        <div
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                                readiness.hasWorkLocation
                                    ? "bg-white/90 border-emerald-200 shadow-2xs"
                                    : "bg-white border-slate-200 hover:border-amber-300 shadow-2xs"
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                                            readiness.hasWorkLocation
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                            readiness.hasWorkLocation
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-amber-50 text-amber-700 border border-amber-200"
                                        }`}
                                    >
                                        {readiness.hasWorkLocation ? "✓ Đã cài đặt" : "Chưa cài"}
                                    </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900">2. Địa bàn & Bán kính</h4>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                    {readiness.hasWorkLocation
                                        ? "Đã lưu vị trí xuất phát và khoảng cách nhận ca tối đa."
                                        : "Cần cấu hình địa chỉ thường trú và bán kính nhận việc."}
                                </p>
                            </div>
                            {!readiness.hasWorkLocation && (
                                <Link
                                    to="/caregiver/profile"
                                    className="mt-3 w-full py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold text-center border border-amber-200 transition"
                                >
                                    Chọn địa bàn
                                </Link>
                            )}
                        </div>

                        {/* 3. Lịch rảnh trong tuần */}
                        <div
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                                readiness.hasAvailability
                                    ? "bg-white/90 border-emerald-200 shadow-2xs"
                                    : "bg-white border-slate-200 hover:border-amber-300 shadow-2xs"
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                                            readiness.hasAvailability
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                            readiness.hasAvailability
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-amber-50 text-amber-700 border border-amber-200"
                                        }`}
                                    >
                                        {readiness.hasAvailability ? "✓ Đã có lịch" : "Chưa cài"}
                                    </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900">3. Lịch rảnh định kỳ</h4>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                    {readiness.hasAvailability
                                        ? "Đã thiết lập các khung giờ sẵn sàng nhận ca trong tuần."
                                        : "Cần bật ít nhất 1 khung giờ rảnh để khách đặt lịch."}
                                </p>
                            </div>
                            {!readiness.hasAvailability && (
                                <Link
                                    to="/caregiver/schedule"
                                    className="mt-3 w-full py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold text-center border border-amber-200 transition"
                                >
                                    Cài lịch rảnh
                                </Link>
                            )}
                        </div>

                        {/* 4. Bảng giá dịch vụ */}
                        <div
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                                readiness.hasServicePricing
                                    ? "bg-white/90 border-emerald-200 shadow-2xs"
                                    : "bg-white border-slate-200 hover:border-amber-300 shadow-2xs"
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                                            readiness.hasServicePricing
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                            readiness.hasServicePricing
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-amber-50 text-amber-700 border border-amber-200"
                                        }`}
                                    >
                                        {readiness.hasServicePricing ? "✓ Đã bật giá" : "Chưa bật"}
                                    </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900">4. Bảng giá dịch vụ</h4>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                    {readiness.hasServicePricing
                                        ? `Đang bật ${offeredCount} dịch vụ nhận làm ở bảng bên dưới.`
                                        : "Cần bật công tắc nhận làm cho ít nhất 1 dịch vụ bên dưới."}
                                </p>
                            </div>
                            {!readiness.hasServicePricing && (
                                <div className="mt-3 py-1.5 px-3 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-bold text-center border border-slate-200">
                                    Bật ở danh sách dưới 👇
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Error state */}
            {apiError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{apiError}</span>
                </div>
            )}

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-teal-50/80 via-emerald-50/30 to-white border border-teal-200/90 shadow-2xs">
                    <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                        Dịch vụ sẵn sàng tiếp nhận
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-extrabold text-[#102030]">{offeredCount}</span>
                        <span className="text-xs text-slate-500">/ {pricings.length} dịch vụ</span>
                    </div>
                    <p className="text-[11px] text-teal-700 mt-1">
                        {offeredCount > 0 ? "Đã bật nhận ca cho các gói này" : "Chưa bật dịch vụ nào"}
                    </p>
                </div>

                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-sky-50/80 via-blue-50/30 to-white border border-sky-200/90 shadow-2xs">
                    <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                        Đơn giá trung bình của bạn
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-extrabold text-[#00677c]">
                            {avgPrice.toLocaleString("vi-VN")}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">VNĐ / ca</span>
                    </div>
                    <p className="text-[11px] text-sky-700 mt-1">
                        Dựa trên các dịch vụ đang được kích hoạt
                    </p>
                </div>

                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-50/90 via-slate-50/40 to-white border border-slate-200/90 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Chính sách phí nền tảng CareLink
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-extrabold text-slate-700">60.000</span>
                        <span className="text-xs text-slate-500 font-semibold">VNĐ / ca</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                        Cố định theo quyết định vận hành (ADR-002)
                    </p>
                </div>
            </div>

            {/* Search Filter */}
            <div className="flex items-center justify-between gap-3">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên dịch vụ hoặc mô tả chuyên môn..."
                    className="w-full sm:max-w-md px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                />
                <span className="text-xs text-slate-500 shrink-0 hidden sm:inline">
                    Hiển thị {filteredPricings.length} dịch vụ
                </span>
            </div>

            {/* List of Services */}
            {isLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white rounded-3xl border border-slate-200/80">
                    <RefreshCw className="w-7 h-7 text-[#00677c] animate-spin" />
                    <span className="text-xs font-medium">Đang tải bảng giá dịch vụ cá nhân...</span>
                </div>
            ) : filteredPricings.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-white space-y-2">
                    <p className="text-sm font-bold text-slate-700">Không tìm thấy dịch vụ phù hợp</p>
                    <p className="text-xs text-slate-400">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
                </div>
            ) : (
                <div className="space-y-3.5">
                    {filteredPricings.map((item) => {
                        const basePrice = Number(item.basePrice || 0);
                        const customPrice = Number(item.customPrice || basePrice);
                        const diff = customPrice - basePrice;

                        return (
                            <div
                                key={item.serviceId}
                                className={`p-5 rounded-2xl border transition-all ${
                                    item.isOffered
                                        ? "bg-white border-slate-200/90 shadow-2xs hover:shadow-xs"
                                        : "bg-slate-50/70 border-slate-200/60 opacity-75"
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Left: Info */}
                                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                        {/* Toggle switch */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleService(item.serviceId)}
                                            className={`mt-0.5 w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                                                item.isOffered ? "bg-[#00677c]" : "bg-slate-300"
                                            }`}
                                            title={item.isOffered ? "Đang bật nhận ca" : "Đang tắt nhận ca"}
                                        >
                                            <div
                                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                                    item.isOffered ? "translate-x-5" : "translate-x-0"
                                                }`}
                                            />
                                        </button>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-sm font-bold text-slate-900">
                                                    {item.serviceName}
                                                </h3>
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                    {item.durationMinutes} phút
                                                </span>
                                                {item.requiresLicense && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                                        <ShieldAlert className="w-3 h-3 text-amber-600" />
                                                        Yêu cầu CCHN y tế
                                                    </span>
                                                )}
                                            </div>

                                            {item.description && (
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Pricing configuration */}
                                    <div className="flex flex-wrap sm:flex-nowrap items-end gap-3 sm:gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                                        {/* Giá chuẩn hệ thống */}
                                        <div className="min-w-[110px] text-left sm:text-right">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                                Giá chuẩn hệ thống
                                            </span>
                                            <div className="h-10 flex items-center justify-start sm:justify-end">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs font-bold text-slate-700">
                                                    {basePrice.toLocaleString("vi-VN")} đ
                                                </span>
                                            </div>
                                        </div>

                                        {/* Thời lượng ước tính */}
                                        <div className="w-28 sm:w-32">
                                            <label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1.5 truncate">
                                                Thời lượng ước tính
                                            </label>
                                            <div className={`h-10 flex items-center rounded-xl border bg-white px-2.5 shadow-2xs transition-all ${
                                                item.isOffered
                                                    ? "border-slate-200 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20"
                                                    : "border-slate-200 bg-slate-100/80 opacity-60"
                                            }`}>
                                                <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0 mr-1.5" />
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    disabled={!item.isOffered}
                                                    value={item.customDurationMinutes !== undefined && item.customDurationMinutes !== null ? item.customDurationMinutes : (item.durationMinutes || 60)}
                                                    onChange={(e) =>
                                                        handleDurationChange(item.serviceId, e.target.value)
                                                    }
                                                    onBlur={() =>
                                                        handleDurationBlur(item.serviceId, item.durationMinutes || 60)
                                                    }
                                                    placeholder={String(item.durationMinutes || 60)}
                                                    className="w-full text-xs font-black text-slate-900 text-center outline-none bg-transparent disabled:text-slate-400"
                                                />
                                                <span className="text-[11px] font-bold text-slate-400 select-none shrink-0 pl-1">
                                                    phút
                                                </span>
                                            </div>
                                        </div>

                                        {/* Đơn giá riêng của điều dưỡng */}
                                        <div className="w-36 sm:w-40">
                                            <label className="text-[10px] font-bold text-[#00677c] uppercase tracking-wider block mb-1.5 truncate">
                                                Đơn giá của bạn (VNĐ)
                                            </label>
                                            <div className={`h-10 flex items-center rounded-xl border bg-white px-3 shadow-2xs transition-all ${
                                                item.isOffered
                                                    ? "border-slate-200 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/20"
                                                    : "border-slate-200 bg-slate-100/80 opacity-60"
                                            }`}>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    disabled={!item.isOffered}
                                                    value={
                                                        item.customPrice === ""
                                                            ? ""
                                                            : item.customPrice !== undefined && item.customPrice !== null
                                                            ? Number(String(item.customPrice).replace(/[^\d]/g, "") || 0).toLocaleString("vi-VN")
                                                            : Number(basePrice).toLocaleString("vi-VN")
                                                    }
                                                    onChange={(e) =>
                                                        handlePriceChange(item.serviceId, e.target.value)
                                                    }
                                                    onBlur={() =>
                                                        handlePriceBlur(item.serviceId, basePrice)
                                                    }
                                                    placeholder={Number(basePrice).toLocaleString("vi-VN")}
                                                    className="w-full text-xs font-black text-[#00677C] text-right outline-none bg-transparent disabled:text-slate-400"
                                                />
                                                <span className="text-[11px] font-bold text-slate-400 select-none shrink-0 pl-1.5">
                                                    đ
                                                </span>
                                            </div>
                                        </div>

                                        {/* Nút đặt lại về giá gốc & thời lượng chuẩn */}
                                        <button
                                            type="button"
                                            disabled={!item.isOffered}
                                            onClick={() => handleResetToDefault(item.serviceId, basePrice, item.durationMinutes || 60)}
                                            className="h-10 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-teal-700 transition disabled:opacity-30 cursor-pointer shadow-2xs flex items-center justify-center gap-1 shrink-0"
                                            title="Khôi phục thời lượng và đơn giá chuẩn của CareLink"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span className="hidden xl:inline text-[10px] font-bold">Chuẩn</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bottom floating save bar */}
            {pricings.length > 0 && (
                <div className="sticky bottom-4 z-20 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>
                            Đang nhận <strong>{offeredCount}</strong> / {pricings.length} dịch vụ
                        </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isLoading || isSaving}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#00677c] hover:bg-[#005566] text-white text-xs font-bold transition-all shadow-md hover:shadow-teal-900/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? "Đang lưu thay đổi..." : "Lưu cấu hình bảng giá"}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
