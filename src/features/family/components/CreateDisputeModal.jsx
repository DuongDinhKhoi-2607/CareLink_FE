import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
    AlertTriangle,
    ShieldAlert,
    CheckCircle2,
    X,
    FileText,
    Camera,
    Info,
    HelpCircle,
} from "lucide-react";

/**
 * CreateDisputeModal
 * 
 * Modal gửi Khiếu nại / Báo cáo sự cố ca chăm sóc dành cho Gia đình (Family).
 * Khớp chuẩn DTO Backend: CreateDisputeDto
 * - Reason (Bắt buộc, max 500 ký tự)
 * - Description (Chi tiết sự việc)
 * - EvidenceUrls (Ảnh / Tệp minh chứng)
 */
export default function CreateDisputeModal({
    isOpen,
    onClose,
    appointment,
    onSubmitSuccess,
}) {
    if (!isOpen || !appointment) return null;

    const [reasonCategory, setReasonCategory] = useState("Điều dưỡng đến muộn >30 phút");
    const [description, setDescription] = useState("");
    const [evidenceFiles, setEvidenceFiles] = useState([
        "bien_ban_xac_nhan_tre_gio.jpg",
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const REASON_CATEGORIES = [
        "Điều dưỡng đến muộn >30 phút mà không báo trước",
        "Thái độ phục vụ không đúng mực / thiếu tôn trọng",
        "Không hoàn thành đủ các hạng mục chăm sóc đã đăng ký",
        "Vi phạm quy tắc an toàn y tế / quy trình vệ sinh",
        "Không có mặt tại địa điểm hẹn (Vắng mặt không lý do)",
        "Lý do khác",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullReason = `${reasonCategory}: ${description.trim() || "Gia đình yêu cầu đối soát lại ca trực."}`;

        if (!description.trim() && reasonCategory === "Lý do khác") {
            setError("Vui lòng mô tả chi tiết sự việc khi chọn lý do khác.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        const disputeDto = {
            id: `DSP-${Date.now().toString().slice(-4)}`,
            code: `DSP-${appointment.id.replace("CK-", "").replace("CA-", "")}`,
            bookingId: appointment.id,
            reason: fullReason,
            description: description.trim(),
            evidenceUrls: evidenceFiles,
            status: "Đang xác minh",
            statusNote: "Hệ thống đã ghi nhận khiếu nại và chuyển tới Ban Quản trị xử lý trong vòng 24h.",
            createdAt: new Date().toLocaleString("vi-VN"),
        };

        setTimeout(() => {
            setIsSubmitting(false);
            if (onSubmitSuccess) {
                onSubmitSuccess(disputeDto);
            }
            onClose();
        }, 500);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-hidden"
            style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── HEADER ── */}
                <div className="p-5 bg-gradient-to-r from-rose-600 to-amber-600 text-white flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
                            <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold">Báo cáo sự cố / Khiếu nại ca trực</h2>
                            <p className="text-xs text-rose-100 mt-0.5">
                                Ca hẹn #{appointment.id} · {appointment.caregiver?.name || appointment.caregiver}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── FORM ── */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            Khiếu nại của bạn sẽ được <strong>Ban Quản trị CareLink</strong> tiếp nhận ngay lập tức. Tiền quyết toán ca trực sẽ được tạm giữ để đảm bảo quyền lợi của bạn.
                        </div>
                    </div>

                    {/* Lý do khiếu nại */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Lý do phản ánh chính *
                        </label>
                        <select
                            value={reasonCategory}
                            onChange={(e) => setReasonCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        >
                            {REASON_CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mô tả chi tiết */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Mô tả chi tiết sự việc *
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Mô tả cụ thể thời gian, diễn biến sự việc để Ban Quản trị có căn cứ đối soát nhanh nhất..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        />
                        {error && <span className="text-[11px] text-rose-500 font-semibold mt-1 block">{error}</span>}
                    </div>

                    {/* Minh chứng demo */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span>Tệp/Ảnh minh chứng (nếu có)</span>
                            <span className="text-[10px] text-slate-400 font-normal">Hỗ trợ JPG, PNG</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                                <Camera className="w-4 h-4 text-slate-400" />
                                <span className="truncate">{evidenceFiles.join(", ")}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEvidenceFiles((prev) => [...prev, `anh_minh_chung_${prev.length + 1}.jpg`])}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                            >
                                + Thêm ảnh
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {isSubmitting ? "Đang gửi..." : "Gửi khiếu nại tới Admin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
