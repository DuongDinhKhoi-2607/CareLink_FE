import React from "react";
import {
    X,
    MapPin,
    CalendarDays,
    ClipboardList,
    Phone,
    Stethoscope,
    Clock,
} from "lucide-react";

/**
 * AppointmentDetailModal
 * Hiển thị thông tin chi tiết một ca chăm sóc:
 * - Dịch vụ, ngày giờ, thời lượng
 * - Người thân được chăm sóc
 * - Gia đình đặt ca (địa chỉ, SĐT)
 * - Điều dưỡng phụ trách (vai trò, SĐT)
 * - Ghi chú chăm sóc (y tế)
 * - Tổng thanh toán
 *
 * Props:
 *   appointment  {object}   – Dữ liệu ca trực (xem mock data trong AdminAppointments)
 *   statusConfig {object}   – Map trạng thái → badge/dot class (STATUS_CONFIG)
 *   onClose      {function} – Đóng modal
 */
export default function AppointmentDetailModal({ appointment, statusConfig, onClose }) {
    const sc = statusConfig[appointment.status] ?? {
        dot: "bg-slate-400",
        badge: "bg-slate-100 text-slate-600 border-slate-300",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Modal Header ── */}
                <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Mã ca trực
                            </span>
                            <span className="text-xs font-black text-[#00677c] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                                {appointment.id}
                            </span>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900">Chi tiết ca chăm sóc</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sc.badge}`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                            {appointment.status}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* ── Modal Body ── */}
                <div className="p-6 space-y-5">
                    {/* Dịch vụ & Thời gian */}
                    <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Stethoscope className="w-4 h-4 text-[#00677c]" />
                            <span className="text-xs font-bold text-[#00677c] uppercase tracking-wider">
                                Dịch vụ
                            </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{appointment.service}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                                <CalendarDays className="w-3.5 h-3.5" />
                                {appointment.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {appointment.time}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">{appointment.duration}</span>
                        </div>
                    </div>

                    {/* Người thân được chăm sóc */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                            Người thân được chăm sóc
                        </h4>
                        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-200 shrink-0">
                                {appointment.relative.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900">{appointment.relative}</div>
                                <div className="text-xs text-slate-500">{appointment.relativeAge}</div>
                            </div>
                        </div>
                    </div>

                    {/* Gia đình đặt ca */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                            Gia đình đặt ca
                        </h4>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00677c] flex items-center justify-center font-bold text-sm border border-teal-100 shrink-0">
                                    {appointment.family.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">{appointment.family}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        {appointment.familyPhone}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200/80">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                <span>{appointment.familyAddress}</span>
                            </div>
                        </div>
                    </div>

                    {/* Điều dưỡng phụ trách */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                            Điều dưỡng phụ trách
                        </h4>
                        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm border border-sky-100 shrink-0">
                                {appointment.caregiver.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900">{appointment.caregiver}</div>
                                <div className="text-xs text-slate-500">{appointment.caregiverRole}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3" />
                                    {appointment.caregiverPhone}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ghi chú chăm sóc / Y tế */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <ClipboardList className="w-3.5 h-3.5" />
                            Ghi chú chăm sóc
                        </h4>
                        <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-slate-700 leading-relaxed">
                            {appointment.notes}
                        </div>
                    </div>

                    {/* Tổng tiền */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100">
                        <span className="text-sm font-bold text-slate-700">Tổng thanh toán</span>
                        <span className="text-lg font-black text-[#00677c]">{appointment.totalAmount}</span>
                    </div>
                </div>

                {/* ── Modal Footer ── */}
                <div className="p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
