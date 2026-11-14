import React from "react";
import { X, AlertTriangle, Check, Loader2, ArrowRight } from "lucide-react";

export default function ConfirmSettingModal({
    isOpen,
    onClose,
    onConfirm,
    changedItems = [],
    isSaving = false
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 font-sans">
                {/* Header */}
                <div className="px-6 py-4.5 bg-gradient-to-r from-teal-50/80 via-white to-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 leading-tight">
                                Xác nhận lưu Cài đặt hệ thống
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Vui lòng kiểm tra lại các thay đổi trước khi áp dụng
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="p-3.5 rounded-xl bg-teal-50/80 border border-teal-100 text-xs text-teal-800 leading-relaxed">
                        <p className="font-semibold mb-1 flex items-center gap-1.5 text-teal-900">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                            Phạm vi tác động của thay đổi:
                        </p>
                        <p className="text-teal-700">
                            Thay đổi phí sàn hoặc hạn mức rút tiền sẽ áp dụng cho <strong>các đơn đặt lịch và giao dịch mới</strong> phát sinh từ thời điểm này. Toàn bộ các ca chăm sóc trong lịch sử vẫn <strong>giữ nguyên 100%</strong> số tiền đã ghi nhận.
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Danh sách thông số cập nhật ({changedItems.length})
                        </p>
                        <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
                            {changedItems.map((item) => (
                                <div key={item.key} className="pt-2 first:pt-0 flex flex-col gap-1 text-xs">
                                    <span className="font-semibold text-slate-800">{item.label}</span>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium line-through">
                                            {item.oldDisplay || "(Trống)"}
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                            {item.newDisplay || "(Trống)"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Quay lại
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00677c] to-[#005264] hover:from-[#005264] hover:to-[#003d4a] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Đang lưu...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Xác nhận &amp; Lưu</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
