import React, { useState, useEffect, useRef } from "react";
import { XCircle, X, Loader2, Calendar, Clock, User, AlertCircle } from "lucide-react";

const REJECT_REASONS = [
    "Bận lịch trùng ca khác",
    "Địa chỉ nằm ngoài bán kính di chuyển",
    "Yêu cầu chăm sóc vượt ngoài chuyên môn hiện tại",
    "Lý do cá nhân đột xuất",
];

export default function RejectBookingModal({
    isOpen,
    booking,
    onClose,
    onConfirmReject,
}) {
    const [selectedReason, setSelectedReason] = useState(REJECT_REASONS[0]);
    const [customReason, setCustomReason] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedReason(REJECT_REASONS[0]);
            setCustomReason("");
            setError("");
            setIsSubmitting(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !isSubmitting) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isSubmitting, onClose]);

    if (!isOpen || !booking) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalReason = selectedReason === "Lý do khác" ? customReason.trim() : (customReason.trim() || selectedReason);
        if (!finalReason) {
            setError("Vui lòng cung cấp lý do từ chối để hệ thống thông báo cho gia đình.");
            textareaRef.current?.focus();
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await onConfirmReject(booking.id, finalReason);
            onClose();
        } catch (err) {
            setError(err?.message || "Lỗi khi từ chối ca hẹn. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isSubmitting) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-modal-title"
        >
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                            <XCircle className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                        <div>
                            <h3 id="reject-modal-title" className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                Từ chối nhận ca chăm sóc
                            </h3>
                            <p className="text-xs text-slate-500">Mã ca: #{booking.id}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
                        title="Đóng"
                        aria-label="Đóng modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
                    {/* Tóm tắt ca */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col gap-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 truncate">
                                {booking.service?.type || "Chăm sóc theo yêu cầu"}
                            </span>
                            <span className="font-bold text-[#00677c] shrink-0">
                                {booking.service?.fee}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 pt-1 border-t border-slate-200/50">
                            <span className="flex items-center gap-1 truncate">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {booking.patient?.name} ({booking.patient?.gender})
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 truncate">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {booking.service?.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 truncate">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {booking.service?.time}
                            </span>
                        </div>
                    </div>

                    {/* Radio Options */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">
                            Lý do từ chối nhận ca:
                        </label>
                        <div className="flex flex-col gap-2">
                            {REJECT_REASONS.map((reason) => (
                                <label
                                    key={reason}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                                        selectedReason === reason
                                            ? "border-[#00677c] bg-[#00677c]/5 text-[#00677c]"
                                            : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="rejectReason"
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={() => {
                                            setSelectedReason(reason);
                                            if (error) setError("");
                                        }}
                                        className="w-4 h-4 text-[#00677c] focus:ring-0"
                                    />
                                    <span>{reason}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Textarea bổ sung */}
                    <div>
                        <label htmlFor="custom-reject-reason" className="block text-xs font-bold text-slate-700 mb-1.5">
                            Ghi chú thêm cho gia đình:
                        </label>
                        <textarea
                            id="custom-reject-reason"
                            ref={textareaRef}
                            rows={2}
                            value={customReason}
                            onChange={(e) => {
                                setCustomReason(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="Nhập thêm chi tiết nếu cần dặn dò hoặc hỗ trợ gia đình..."
                            disabled={isSubmitting}
                            className={`w-full p-3 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none transition-all resize-none ${
                                error
                                    ? "border-rose-400 ring-2 ring-rose-400/20"
                                    : "border-slate-200 focus:border-[#00677c] focus:ring-2 focus:ring-[#00677c]/20"
                            }`}
                        />
                        {error && (
                            <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-shake">
                                <AlertCircle className="w-3.5 h-3.5" /> {error}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Quay lại
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <span>Xác nhận từ chối</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
