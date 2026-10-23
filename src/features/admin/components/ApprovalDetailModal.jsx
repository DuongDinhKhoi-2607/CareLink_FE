import React, { useState } from "react";
import { X, FileText, Check, AlertCircle, Eye, ShieldCheck, XCircle, ExternalLink, Loader2 } from "lucide-react";
import { resolveDocumentUrl } from "../../../api/axiosClient";

export default function ApprovalDetailModal({ caregiver, onClose, onApprove, onReject }) {
    const [rejectReason, setRejectReason] = useState("");
    const [rejectError, setRejectError] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);
    const [selectedDocPreview, setSelectedDocPreview] = useState(null);

    if (!caregiver) return null;

    const handleConfirmReject = () => {
        if (!rejectReason.trim()) {
            setRejectError("Vui lòng nhập lý do từ chối để gửi thông báo cho điều dưỡng!");
            return;
        }
        setRejectError("");
        onReject(caregiver.id, rejectReason.trim());
    };

    const documents = Array.isArray(caregiver.documents) ? caregiver.documents : [];
    const validCount = documents.filter((d) => d.status === "Hợp lệ" || d.rawStatus === 1).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 font-sans">
                {/* ── MODAL HEADER ── */}
                <div className="px-6 py-5 bg-gradient-to-r from-teal-50 to-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#00677c] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                            {caregiver.name?.charAt(0) || "Đ"}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                {caregiver.name}
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-100/70 text-[#00677c]">
                                    {caregiver.role || "Điều dưỡng chuyên nghiệp"}
                                </span>
                            </h3>
                            <p className="text-xs text-slate-500">Mã hồ sơ: #{caregiver.id} • Gửi ngày {caregiver.submittedDate || "Gần đây"}</p>
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
                    {caregiver.isLoadingDetail && (
                        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2 animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                            <span>Đang nạp chi tiết chứng chỉ và giấy tờ thực tế từ máy chủ...</span>
                        </div>
                    )}

                    {/* 1. Thông tin cá nhân & đào tạo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                        <div>
                            <span className="text-slate-400 font-medium">Đối tượng chuyên môn:</span>
                            <div className="mt-1">
                                {caregiver.practitionerType === 2 || caregiver.role?.includes("Sinh viên") ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold border border-blue-200">
                                        🎓 Sinh viên Y khoa
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                                        👩‍⚕️ Điều dưỡng chính quy
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium">Số điện thoại:</span>
                            <div className="font-bold text-slate-800 mt-0.5">{caregiver.phone || "Chưa cập nhật"}</div>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium">Email tài khoản:</span>
                            <div className="font-bold text-slate-800 mt-0.5">{caregiver.email || "Chưa cập nhật"}</div>
                        </div>

                        {(caregiver.practitionerType === 2 || caregiver.role?.includes("Sinh viên")) && (
                            <div>
                                <span className="text-slate-400 font-medium">Email trường cấp (.edu.vn):</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="font-bold text-blue-900 font-mono">{caregiver.studentEmail || caregiver.email}</span>
                                    {caregiver.isStudentEmailVerified ? (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                            ✓ Đã xác thực OTP
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                            Chưa xác thực OTP
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div>
                            <span className="text-slate-400 font-medium">Số Căn cước công dân (CCCD):</span>
                            <div className="font-bold text-slate-900 font-mono mt-0.5">{caregiver.citizenId || "Chưa cung cấp"}</div>
                        </div>

                        <div>
                            <span className="text-slate-400 font-medium">Kinh nghiệm chăm sóc:</span>
                            <div className="font-bold text-slate-800 mt-0.5">
                                {caregiver.experienceYears != null ? `${caregiver.experienceYears} năm kinh nghiệm` : (caregiver.experience || "Theo hồ sơ")}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <span className="text-slate-400 font-medium">Trường đào tạo / Nơi công tác:</span>
                            <div className="font-bold text-slate-800 mt-0.5">{caregiver.workplace || caregiver.educationLevel || "Chưa cập nhật"}</div>
                        </div>

                        {caregiver.practitionerType === 2 || caregiver.role?.includes("Sinh viên") ? (
                            <div className="sm:col-span-2 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-800 text-[11px]">
                                ℹ️ <strong>Hồ sơ Sinh viên Y khoa:</strong> Không bắt buộc Chứng chỉ hành nghề y tế (CCHN). Yêu cầu đối chiếu Thẻ sinh viên và Giấy xác nhận trường.
                            </div>
                        ) : (
                            <>
                                <div>
                                    <span className="text-slate-400 font-medium">Số Chứng chỉ hành nghề (CCHN):</span>
                                    <div className="font-bold text-[#00677c] font-mono mt-0.5">{caregiver.licenseNumber || "Chưa có"}</div>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-medium">Thời hạn CCHN:</span>
                                    <div className="font-bold text-slate-800 mt-0.5">{caregiver.licenseExpiryDate || "Vô thời hạn / Dài hạn"}</div>
                                </div>
                            </>
                        )}

                        {caregiver.bio && (
                            <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                                <span className="text-slate-400 font-medium">Giới thiệu bản thân & kỹ năng:</span>
                                <p className="text-slate-700 leading-relaxed mt-0.5 italic">{caregiver.bio}</p>
                            </div>
                        )}
                    </div>

                    {/* Kỹ năng chuyên môn */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Kỹ năng chuyên môn xác nhận</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {(caregiver.skills || ["Đo dấu hiệu sinh tồn", "Chăm sóc người cao tuổi", "Theo dõi y tế"]).map((skill, index) => (
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
                                <ShieldCheck className="w-3.5 h-3.5" /> {validCount > 0 ? `${validCount}/${documents.length} tài liệu hợp lệ` : `${documents.length} tài liệu đính kèm`}
                            </span>
                        </div>

                        {documents.length === 0 ? (
                            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 bg-slate-50">
                                Chưa có tài liệu nào được đính kèm trong hồ sơ này.
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {documents.map((doc, idx) => {
                                    const docUrl = doc.url || doc.fileUrl;
                                    return (
                                        <div
                                            key={doc.id || idx}
                                            className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 hover:border-teal-300 bg-white transition-all shadow-2xs"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#00677c] flex items-center justify-center shrink-0">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="truncate">
                                                    <div className="text-xs font-bold text-slate-800 truncate">{doc.name}</div>
                                                    <div className="text-[11px] text-slate-400">{doc.type} • Tải lên ngày {caregiver.submittedDate || "Gần đây"}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                                                    doc.status === "Hợp lệ" || doc.rawStatus === 1
                                                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                                        : doc.status === "Từ chối" || doc.rawStatus === 2
                                                        ? "text-rose-700 bg-rose-50 border-rose-200"
                                                        : "text-amber-700 bg-amber-50 border-amber-200"
                                                }`}>
                                                    {doc.status || "Chờ duyệt"}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedDocPreview(doc)}
                                                    className="text-xs font-bold text-[#00677c] hover:underline px-2.5 py-1 rounded hover:bg-teal-50 transition-colors cursor-pointer flex items-center gap-1 border border-teal-100"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Xem ảnh/tệp</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Preview Tài liệu THỰC TẾ (Hiển thị ảnh thật hoặc link tệp) */}
                    {selectedDocPreview && (
                        <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-3 animate-in fade-in">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <span className="font-bold flex items-center gap-2 text-teal-300">
                                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                                    Đang xem: {selectedDocPreview.name} ({selectedDocPreview.type})
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDocPreview(null)}
                                    className="text-slate-400 hover:text-white cursor-pointer px-2 py-0.5 rounded hover:bg-slate-800"
                                >
                                    ✕ Đóng xem trước
                                </button>
                            </div>

                            <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center min-h-48 border border-slate-800">
                                {(() => {
                                    const rawUrl = selectedDocPreview.url || selectedDocPreview.fileUrl;
                                    const resolvedUrl = resolveDocumentUrl(rawUrl);
                                    if (!resolvedUrl) {
                                        return (
                                            <div className="py-8 text-center text-slate-400">
                                                Không tìm thấy đường dẫn tệp tài liệu này trên hệ thống.
                                            </div>
                                        );
                                    }
                                    return (
                                        <>
                                            <img
                                                src={resolvedUrl}
                                                alt={selectedDocPreview.name}
                                                className="max-h-[380px] w-auto max-w-full object-contain rounded-lg border border-slate-700 shadow-md"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    const fallback = document.getElementById("doc-preview-fallback");
                                                    if (fallback) fallback.style.display = "block";
                                                }}
                                            />
                                            <div id="doc-preview-fallback" style={{ display: "none" }} className="py-8 text-center text-slate-400">
                                                <p className="font-semibold">Tệp tài liệu PDF hoặc định dạng cần xem ngoài trình duyệt.</p>
                                            </div>
                                            <div className="mt-3 flex items-center gap-3">
                                                <a
                                                    href={resolvedUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    <span>Mở tệp gốc trong tab mới</span>
                                                </a>
                                            </div>
                                        </>
                                    );
                                })()}
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
                            {rejectError && (
                                <p className="text-xs text-rose-600 font-semibold">{rejectError}</p>
                            )}
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
