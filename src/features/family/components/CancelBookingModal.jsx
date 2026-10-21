import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X, Loader2, Calendar, Clock, User, ShieldAlert } from "lucide-react";

const QUICK_REASONS = [
    "Gia đình có việc bận đột xuất",
    "Bệnh nhân thay đổi lịch tái khám",
    "Tìm được người thân chăm sóc",
    "Đổi sang khung giờ hoặc ngày khác",
];

export default function CancelBookingModal({
    isOpen,
    booking,
    onClose,
    onConfirmCancel,
}) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setReason("");
            setError("");
            setIsSubmitting(false);
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Đóng khi bấm phím Escape
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

    const handleSelectQuickReason = (text) => {
        setReason(text);
        if (error) setError("");
        textareaRef.current?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = reason.trim();
        if (!trimmed) {
            setError("Vui lòng nhập hoặc chọn lý do hủy ca chăm sóc.");
            textareaRef.current?.focus();
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await onConfirmCancel(booking.id, trimmed);
            onClose();
        } catch (err) {
            setError(err?.message || "Không thể hủy ca chăm sóc lúc này. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isSubmitting) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
        >
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                            <AlertTriangle className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                        <div>
                            <h3 id="cancel-modal-title" className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                Xác nhận hủy ca chăm sóc
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

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
                    {/* Tóm tắt ca */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                                {booking.service}
                            </span>
                            <span className="text-xs font-bold text-[#00677c] shrink-0">
                                {booking.price}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200/50">
                            <div className="flex items-center gap-1.5 truncate">
                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{booking.caregiver?.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:col-span-2 truncate">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{booking.time}</span>
                            </div>
                        </div>
                    </div>

                    {/* Gợi ý lý do nhanh */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Gợi ý lý do thường gặp:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {QUICK_REASONS.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => handleSelectQuickReason(item)}
                                    disabled={isSubmitting}
                                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                                        reason === item
                                            ? "bg-[#00677c] text-white shadow-xs"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ô nhập lý do (Textarea) */}
                    <div>
                        <label htmlFor="cancel-reason-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                            Lý do hủy ca <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            id="cancel-reason-input"
                            ref={textareaRef}
                            rows={3}
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="Vui lòng cung cấp lý do để điều dưỡng và hệ thống được biết..."
                            disabled={isSubmitting}
                            className={`w-full p-3 text-xs sm:text-sm rounded-xl border bg-white focus:outline-none transition-all resize-none ${
                                error
                                    ? "border-rose-400 ring-2 ring-rose-400/20"
                                    : "border-slate-200 focus:border-[#00677c] focus:ring-2 focus:ring-[#00677c]/20"
                            }`}
                        />
                        {error && (
                            <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-shake">
                                <span>•</span> {error}
                            </p>
                        )}
                    </div>

                    {/* Chính sách hủy */}
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="leading-relaxed">
                            <strong>Chính sách hủy:</strong> Trước thời điểm bắt đầu ca, gia đình có thể hủy ca mà không bị tính phí phạt. Nếu ca đã thanh toán trực tuyến, yêu cầu hoàn tiền sẽ được ghi nhận tự động.
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Giữ lại ca
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang hủy ca...</span>
                                </>
                            ) : (
                                <span>Xác nhận hủy ca</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
