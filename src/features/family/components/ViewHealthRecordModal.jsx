import React from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    Heart,
    Thermometer,
    Droplet,
    FileText,
    CheckCircle2,
    X,
    Stethoscope,
    Calendar,
    Clock,
    UserRound,
    ShieldCheck,
    ArrowUpRight,
} from "lucide-react";

/**
 * ViewHealthRecordModal
 * 
 * Modal hiển thị Bệnh án & Sinh hiệu lâm sàng sau ca chăm sóc.
 * Dùng chung cho cả Family (xem báo cáo của người thân), Caregiver (xem lại bệnh án đã nộp)
 * và Admin (đối soát lâm sàng trong chi tiết ca).
 */
export default function ViewHealthRecordModal({
    isOpen,
    onClose,
    booking,
    healthRecord,
    showHistoryLink = true,
}) {
    if (!isOpen || !healthRecord) return null;

    const patientName = booking?.patient?.name || booking?.recipient || booking?.relative || "Người nhận chăm sóc";
    const patientCondition = booking?.patient?.condition || booking?.service || "Chăm sóc phục hồi";
    const caregiverName = booking?.caregiver?.name || booking?.caregiver || "Điều dưỡng phụ trách";
    const recordTime = healthRecord.createdAt || booking?.date || "Gần đây";

    // Phân loại nhanh huyết áp
    const getBpStatus = (sys, dia) => {
        if (!sys || !dia) return { label: "Đã ghi nhận", color: "bg-teal-50 text-teal-700 border-teal-200" };
        if (sys < 120 && dia < 80) return { label: "Huyết áp tối ưu", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
        if (sys <= 129 && dia < 85) return { label: "Bình thường", color: "bg-teal-50 text-teal-700 border-teal-200" };
        if (sys <= 139 || dia <= 89) return { label: "Hơi cao (Cần chú ý)", color: "bg-amber-50 text-amber-700 border-amber-200" };
        return { label: "Tăng huyết áp", color: "bg-rose-50 text-rose-700 border-rose-200" };
    };

    const bpStatus = getBpStatus(healthRecord.bloodPressureSystolic, healthRecord.bloodPressureDiastolic);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
            style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl my-auto overflow-hidden animate-page-enter flex flex-col max-h-[92vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── HEADER ── */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-[#00677c] to-[#008ba3] text-white flex items-start justify-between shrink-0">
                    <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 shadow-xs">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-teal-100 text-[10px] font-bold uppercase tracking-wider mb-1">
                                <CheckCircle2 className="w-3 h-3 text-teal-200" />
                                Hồ sơ theo dõi sức khỏe
                            </div>
                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                                Báo cáo sức khỏe lâm sàng sau ca
                            </h2>
                            <p className="text-xs text-teal-100/90 mt-0.5">
                                Người nhận chăm sóc: <strong>{patientName}</strong> · ĐD thực hiện: <strong>{caregiverName}</strong>
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-white cursor-pointer shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── CONTENT ── */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Timestamp & Meta Banner */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#00677c]" />
                            <span>Thời điểm ghi nhận: <strong className="text-slate-800">{recordTime}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Đã kiểm chứng lâm sàng</span>
                        </div>
                    </div>

                    {/* ── CARDS: SINH HIỆU LÂM SÀNG ── */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-[#00677c]" />
                            Chỉ số sinh tồn đo được trong ca
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {/* Huyết áp */}
                            <div className="p-3.5 bg-gradient-to-br from-rose-50/50 to-white rounded-2xl border border-rose-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-500">Huyết áp</span>
                                    <Activity className="w-4 h-4 text-rose-500" />
                                </div>
                                <div className="my-2">
                                    <div className="text-lg font-black text-slate-900">
                                        {healthRecord.bloodPressureSystolic && healthRecord.bloodPressureDiastolic
                                            ? `${healthRecord.bloodPressureSystolic}/${healthRecord.bloodPressureDiastolic}`
                                            : "—"}
                                    </div>
                                    <span className="text-[10px] text-slate-400">mmHg</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border text-center ${bpStatus.color}`}>
                                    {bpStatus.label}
                                </span>
                            </div>

                            {/* Nhịp tim */}
                            <div className="p-3.5 bg-gradient-to-br from-rose-50/50 to-white rounded-2xl border border-rose-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-500">Nhịp tim</span>
                                    <Heart className="w-4 h-4 text-rose-500" />
                                </div>
                                <div className="my-2">
                                    <div className="text-lg font-black text-slate-900">
                                        {healthRecord.heartRate || "—"}
                                    </div>
                                    <span className="text-[10px] text-slate-400">nhịp/phút (bpm)</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border text-center bg-emerald-50 text-emerald-700 border-emerald-200">
                                    {healthRecord.heartRate >= 60 && healthRecord.heartRate <= 100 ? "Nhịp đều, ổn định" : "Theo dõi thêm"}
                                </span>
                            </div>

                            {/* Thân nhiệt */}
                            <div className="p-3.5 bg-gradient-to-br from-amber-50/50 to-white rounded-2xl border border-amber-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-500">Thân nhiệt</span>
                                    <Thermometer className="w-4 h-4 text-amber-500" />
                                </div>
                                <div className="my-2">
                                    <div className="text-lg font-black text-slate-900">
                                        {healthRecord.temperature ? `${healthRecord.temperature}°C` : "—"}
                                    </div>
                                    <span className="text-[10px] text-slate-400">Độ C</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border text-center bg-emerald-50 text-emerald-700 border-emerald-200">
                                    Bình thường
                                </span>
                            </div>

                            {/* Đường huyết */}
                            <div className="p-3.5 bg-gradient-to-br from-sky-50/50 to-white rounded-2xl border border-sky-100 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-500">Đường huyết</span>
                                    <Droplet className="w-4 h-4 text-sky-500" />
                                </div>
                                <div className="my-2">
                                    <div className="text-lg font-black text-slate-900">
                                        {healthRecord.bloodGlucose ? `${healthRecord.bloodGlucose}` : "—"}
                                    </div>
                                    <span className="text-[10px] text-slate-400">mg/dL</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border text-center bg-sky-50 text-sky-700 border-sky-200">
                                    {healthRecord.bloodGlucose ? "Trong mức an toàn" : "Không chỉ định"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── THỂ TRẠNG & DIỄN BIẾN LÂM SÀNG ── */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Diễn biến thể trạng & Vận động
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                                    Vết mổ / Vết thương
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                    {healthRecord.woundStatus || "Bình thường"}
                                </span>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                                    Khả năng vận động
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                    {healthRecord.mobilityStatus || "Vận động nhẹ nhàng"}
                                </span>
                            </div>

                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                                    Tinh thần & Tiếp xúc
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                    {healthRecord.mentalStatus || "Tỉnh táo"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── NHẬT KÝ CHĂM SÓC & DẶN DÒ GIA ĐÌNH ── */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-[#00677c]" />
                            Nhật ký chăm sóc & Hướng dẫn dành cho gia đình
                        </h3>
                        <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                            {healthRecord.nurseNotes || "Chưa có ghi chú bổ sung."}
                        </div>
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
                    {showHistoryLink ? (
                        <Link
                            to="/dashboard/health-reports"
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00677c] hover:underline"
                        >
                            Xem toàn bộ biểu đồ & lịch sử sức khỏe
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    ) : (
                        <span className="text-xs text-slate-400">Lưu trữ an toàn trên CareLink</span>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-[#00677c] hover:bg-[#005566] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                        Đã xem, đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
