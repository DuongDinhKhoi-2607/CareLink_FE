import React, { useState } from "react";
import { X, FileText, Check, AlertCircle, Eye, ShieldCheck, XCircle } from "lucide-react";

export default function ApprovalDetailModal({ caregiver, onClose, onApprove, onReject }) {
    const [rejectReason, setRejectReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);
    const [selectedDocPreview, setSelectedDocPreview] = useState(null);

    if (!caregiver) return null;

    const handleConfirmReject = () => {
        if (!rejectReason.trim()) {
            alert("Vui lòng nhập lý do từ chối để gửi thông báo cho điều dưỡng!");
            return;
        }
        onReject(caregiver.id, rejectReason);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 font-sans">
                {/* ── MODAL HEADER ── */}
                <div className="px-6 py-5 bg-gradient-to-r from-teal-50 to-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#00677c] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                            {caregiver.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                {caregiver.name}
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-100/70 text-[#00677c]">
                                    {caregiver.role}
                                </span>
                            </h3>
                            <p className="text-xs text-slate-500">Mã hồ sơ: #{caregiver.id} • Gửi ngày {caregiver.submittedDate}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── MODAL BODY ── */}
                <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
                    {/* 1. Thông tin cá nhân & đào tạo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                        <div>
                            <span className="text-slate-400 font-medium">Số điện thoại:</span>
                            <div className="font-bold text-slate-800 mt-0.5">{caregiver.phone}</div>
                        </div>
                        <div>
                            <span className="text-slate-400 font-medium">Email:</span>
                            <div className="font-bold text-slate-800 mt-0.5">{caregiver.email}</div>
                        </div>
                        <div>
                            <span className="text-slate-400 font-medium">Trường / Nơi công tác:</span>
                            <div className="font-bold text-slate-800 mt-0.5">{caregiver.workplace}</div>
                        </div>
                        <div>
                            <span className="text-slate-400 font-medium">Kinh nghiệm chăm sóc:</span>
                            <div className="font-bold text-slate-800 mt-0.5">{caregiver.experience}</div>
                        </div>
                    </div>

                    {/* Kỹ năng chuyên môn */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Kỹ năng chuyên môn xác nhận</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {caregiver.skills.map((skill, index) => (
                                <span key={index} className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 text-[#00677c] font-medium border border-teal-100 flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5 text-[#00677c]" /> {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 2. Danh sách tài liệu xác minh (CCCD, Bằng cấp, Chứng chỉ) */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tài liệu xác minh đính kèm</h4>
                            <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> 4/4 tài liệu hợp lệ
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            {caregiver.documents.map((doc, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 hover:border-teal-300 bg-white transition-all"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00677c] flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="truncate">
                                            <div className="text-xs font-bold text-slate-800 truncate">{doc.name}</div>
                                            <div className="text-[11px] text-slate-400">{doc.type} • Tải lên ngày {caregiver.submittedDate}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            {doc.status}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDocPreview(doc.name)}
                                            className="text-xs font-bold text-[#00677c] hover:underline px-2 py-1 rounded hover:bg-teal-50 transition-colors cursor-pointer flex items-center gap-1"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Xem tài liệu</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview Giả lập Tài liệu */}
                    {selectedDocPreview && (
                        <div className="p-4 rounded-xl bg-slate-900/95 text-white text-xs space-y-2 animate-in fade-in">
                            <div className="flex justify-between items-center">
                                <span className="font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span> Đang xem: {selectedDocPreview}
                                </span>
                                <button onClick={() => setSelectedDocPreview(null)} className="text-slate-400 hover:text-white cursor-pointer">✕ Đóng xem trước</button>
                            </div>
                            <div className="h-32 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 text-slate-400">
                                [Bản xem trước hình ảnh giấy tờ chứng chỉ y tế được bảo mật]
                            </div>
                        </div>
                    )}

                    {/* Form Lý do từ chối nếu Admin bấm từ chối */}
                    {isRejecting && (
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2.5">
                            <label className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4" />
                                Nhập lý do từ chối hồ sơ (Điều dưỡng sẽ nhận được thông báo này):
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Ví dụ: Ảnh chụp CCCD bị mờ góc hoặc Chứng chỉ hành nghề đã hết hạn..."
                                rows={3}
                                className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                            />
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRejecting(false)}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white rounded-lg cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmReject}
                                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer"
                                >
                                    Xác nhận từ chối
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── MODAL FOOTER ACTIONS ── */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                    >
                        Đóng lại
                    </button>

                    <div className="flex items-center gap-2.5">
                        {!isRejecting && (
                            <button
                                type="button"
                                onClick={() => setIsRejecting(true)}
                                className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                                <XCircle className="w-4 h-4" />
                                Từ chối hồ sơ
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onApprove(caregiver.id)}
                            className="px-5 py-2 text-xs font-bold text-white bg-[#00677c] hover:bg-[#005566] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <Check className="w-4 h-4" strokeWidth={2.5} />
                            Phê duyệt hồ sơ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
