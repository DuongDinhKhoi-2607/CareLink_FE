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

    const handlePriceChange = (serviceId, value) => {
        const num = Math.max(0, parseInt(value, 10) || 0);
        setPricings((prev) =>
            prev.map((item) =>
                item.serviceId === serviceId
                    ? { ...item, customPrice: num }
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
                pricings: pricings.map((p) => ({
                    serviceId: p.serviceId,
                    customPrice: Number(p.customPrice) || Number(p.basePrice) || 0,
                    isOffered: Boolean(p.isOffered),
                })),
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

            {/* Readiness Notification Banner */}
            {readiness && (
                <div
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        readiness.isReadyToReceiveBookings
                            ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                            : "bg-amber-50/90 border-amber-200 text-amber-950"
                    }`}
                >
                    <div className="flex items-start gap-3">
                        <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                readiness.isReadyToReceiveBookings
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                            }`}
                        >
                            {readiness.isReadyToReceiveBookings ? (
                                <CheckCircle2 className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-bold">
                                {readiness.isReadyToReceiveBookings
                                    ? "Hồ sơ của bạn đã sẵn sàng nhận ca và hiển thị trên bộ tìm kiếm!"
                                    : "Bạn cần hoàn thiện 4 điều kiện để xuất hiện trong kết quả tìm kiếm của khách hàng"}
                            </p>
                            {!readiness.isReadyToReceiveBookings && readiness.missingRequirements?.length > 0 && (
                                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                                    Còn thiếu: {readiness.missingRequirements.join(" • ")}
                                </p>
                            )}
                        </div>
                    </div>

                    {!readiness.isReadyToReceiveBookings && (
                        <div className="flex items-center gap-2 shrink-0">
                            {!readiness.hasAvailability && (
                                <Link
                                    to="/caregiver/schedule"
                                    className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100/60 transition"
                                >
                                    Cài lịch rảnh
                                </Link>
                            )}
                            {!readiness.hasWorkLocation && (
                                <Link
                                    to="/caregiver/profile"
                                    className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100/60 transition"
                                >
                                    Chọn địa bàn
                                </Link>
                            )}
                        </div>
                    )}
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
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
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

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Đơn giá trung bình của bạn
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-extrabold text-[#00677c]">
                            {avgPrice.toLocaleString("vi-VN")}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">đ / ca</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                        Dựa trên các dịch vụ đang được kích hoạt
                    </p>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Chính sách phí nền tảng CareLink
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-extrabold text-slate-700">60.000</span>
                        <span className="text-xs text-slate-500 font-semibold">đ / ca</span>
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
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                                        <div className="text-left sm:text-right">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Giá sàn hệ thống
                                            </span>
                                            <span className="text-xs font-semibold text-slate-600">
                                                {basePrice.toLocaleString("vi-VN")} đ
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div>
                                                <label className="text-[10px] font-bold text-[#00677c] uppercase tracking-wider block mb-1">
                                                    Đơn giá của bạn (VNĐ)
                                                </label>
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="10000"
                                                        disabled={!item.isOffered}
                                                        value={item.customPrice || ""}
                                                        onChange={(e) =>
                                                            handlePriceChange(item.serviceId, e.target.value)
                                                        }
                                                        className="w-36 sm:w-44 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-extrabold text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400 text-right pr-7"
                                                    />
                                                    <span className="absolute right-2.5 text-xs text-slate-400 font-bold pointer-events-none">
                                                        đ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
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
