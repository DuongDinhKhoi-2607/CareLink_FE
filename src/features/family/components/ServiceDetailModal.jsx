import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Clock, ShieldCheck, HeartPulse, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import familyApi from "../../../api/familyApi";

export default function ServiceDetailModal({
    isOpen,
    onClose,
    serviceId,
    fallbackService,
    onSelectService,
}) {
    const [serviceDetail, setServiceDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !serviceId) {
            setServiceDetail(null);
            setError(null);
            return;
        }

        let isMounted = true;
        setLoading(true);
        setError(null);

        familyApi
            .getServiceDetail(serviceId)
            .then((data) => {
                if (!isMounted) return;
                const result = data?.data || data;
                if (result && typeof result === "object") {
                    setServiceDetail(result);
                } else if (fallbackService) {
                    setServiceDetail(fallbackService);
                }
            })
            .catch((err) => {
                console.warn("[CareLink] Tải chi tiết dịch vụ thất bại, dùng dữ liệu dự phòng:", err);
                if (isMounted) {
                    if (fallbackService) {
                        setServiceDetail(fallbackService);
                    } else {
                        setError("Không thể tải thông tin chi tiết dịch vụ này.");
                    }
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen, serviceId, fallbackService]);

    if (!isOpen) return null;

    const data = serviceDetail || fallbackService;
    const title = data?.title || data?.serviceName || data?.name || "Chi tiết dịch vụ";
    const description = data?.description || "Không có mô tả chi tiết";
    const category = data?.category || data?.serviceCategory || "Chăm sóc sức khỏe";
    const badgeText = data?.badgeText || (data?.badgeType === "special" ? "Chỉ dành cho Điều dưỡng RN" : "Điều dưỡng & Y sinh");
    const priceText = data?.priceRange || (data?.basePrice ? `${Number(data.basePrice).toLocaleString("vi-VN")} ₫` : "Theo thỏa thuận");
    const durationText = data?.recommendedDuration || (data?.durationMinutes ? `${data.durationMinutes} phút` : data?.duration || "Linh hoạt");
    const features = data?.features || data?.checklist || [
        "Đánh giá và kiểm tra thể trạng trước khi chăm sóc",
        "Thực hiện quy trình kỹ thuật chuẩn y khoa",
        "Ghi chép và cập nhật sổ theo dõi sức khỏe điện tử",
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 font-sans">
                {/* Header Modal */}
                <div className="px-6 py-5 bg-gradient-to-r from-teal-50 via-white to-sky-50 border-b border-slate-100 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#00677c] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                            <HeartPulse className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="inline-block text-[11px] font-bold text-[#00677c] uppercase tracking-wider bg-teal-100/60 px-2.5 py-0.5 rounded-full mb-1">
                                {category}
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                                {title}
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                                <span>Tiêu chuẩn nhân sự: <strong className="text-slate-700">{badgeText}</strong></span>
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {loading ? (
                        <div className="space-y-4 py-8">
                            <div className="h-4 bg-slate-200 rounded-full animate-pulse w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded-full animate-pulse w-1/2"></div>
                            <div className="h-24 bg-slate-100 rounded-2xl animate-pulse mt-4"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block mb-1">
                                        Mức phí tham khảo
                                    </span>
                                    <span className="text-xl font-extrabold text-[#00677c]">
                                        {priceText}
                                    </span>
                                    <p className="text-[11px] text-teal-700 mt-1">
                                        Đã bao gồm bảo hiểm trách nhiệm & phí dịch vụ
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 block mb-1 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        Thời lượng tiêu chuẩn
                                    </span>
                                    <span className="text-xl font-extrabold text-[#0f4b7a]">
                                        {durationText}
                                    </span>
                                    <p className="text-[11px] text-sky-700 mt-1">
                                        Tùy chỉnh linh hoạt theo ca hoặc theo giờ
                                    </p>
                                </div>
                            </div>

                            {/* Mô tả giải pháp */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    Mô tả dịch vụ chi tiết
                                </h4>
                                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                                    {description}
                                </p>
                            </div>

                            {/* Danh mục công việc & quy trình thực hiện */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-teal-600" />
                                    Các hạng mục công việc thực hiện trong ca
                                </h4>
                                <div className="space-y-2.5">
                                    {features.map((feat, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-teal-300 transition-colors"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                            <span className="text-xs sm:text-sm text-slate-700 font-medium">
                                                {feat}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cam kết tiêu chuẩn y tế */}
                            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                                <strong className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    Cam kết an toàn & minh bạch
                                </strong>
                                100% người cung cấp dịch vụ đều được xác minh danh tính, bằng cấp y tế hợp lệ và được ký quỹ bảo đảm dịch vụ tại CareLink.
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Modal */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                    >
                        Đóng
                    </button>
                    {onSelectService && data && (
                        <button
                            type="button"
                            onClick={() => {
                                onSelectService(data);
                                onClose();
                            }}
                            className="px-5 py-2.5 text-xs font-bold text-white bg-[#00677c] hover:bg-[#005566] rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer hover:shadow-md"
                        >
                            <span>Chọn dịch vụ này</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
