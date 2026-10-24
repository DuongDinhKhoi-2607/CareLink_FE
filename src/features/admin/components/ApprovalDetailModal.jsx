import React, { useState } from "react";
import { X, FileText, Check, AlertCircle, ShieldCheck, XCircle, ExternalLink, Loader2 } from "lucide-react";
import { resolveDocumentUrl } from "../../../api/axiosClient";

export const formatDocumentTypeName = (docType, docTypeName) => {
    const raw = String(docTypeName || docType || "").toLowerCase();
    if (raw.includes("selfie") || raw === "5") return "Ảnh chân dung cầm CCCD";
    if (raw.includes("degree") || raw === "3") return "Bằng cấp y tế / Thẻ sinh viên";
    if (raw.includes("license") || raw === "4") return "Chứng chỉ hành nghề (CCHN)";
    if (raw.includes("front") || raw === "cccdfront" || raw === "1") return "Căn cước công dân (Mặt trước)";
    if (raw.includes("back") || raw === "cccdback" || raw === "2") return "Căn cước công dân (Mặt sau)";
    if (raw.includes("student") || raw === "6") return "Thẻ sinh viên y khoa / Giấy trường cấp";
    return docTypeName || "Tài liệu xác minh";
};

export default function ApprovalDetailModal({ caregiver, onClose, onApprove, onReject }) {
    const [rejectReason, setRejectReason] = useState("");
    const [rejectError, setRejectError] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    if (!caregiver) return null;

    const isAlreadyApproved =
        caregiver.status === "Đã duyệt" ||
        caregiver.rawStatus === 1 ||
        caregiver.verificationStatus === 2 ||
        caregiver.verificationStatusName === "Approved" ||
        caregiver.statusName === "Active";

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

                    {/* Form Lý do từ chối - ĐƯỢC ĐẨY LÊN TRÊN ĐẦU MODAL ĐỂ ADMIN DỄ NHÌN VÀ NHẬP */}
                    {isRejecting && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2.5 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-rose-600" />
                                Nhập lý do từ chối hồ sơ (Điều dưỡng sẽ nhận được thông báo này):
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Ví dụ: Ảnh chụp CCCD bị mờ góc hoặc Chứng chỉ hành nghề đã hết hạn..."
                                rows={3}
                                className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-slate-400"
                                autoFocus
                            />
                            {rejectError && (
                                <p className="text-xs text-rose-600 font-semibold">{rejectError}</p>
                            )}
                            <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsRejecting(false);
                                        setRejectError("");
                                    }}
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
                                    const rawUrl = doc.url || doc.fileUrl;
                                    const resolvedUrl = resolveDocumentUrl(rawUrl);
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
                                                    <div className="text-xs font-bold text-slate-800 truncate">{formatDocumentTypeName(doc.documentType, doc.name)}</div>
                                                    <div className="text-[11px] text-slate-400">{formatDocumentTypeName(doc.documentType, doc.type)} • Tải lên ngày {caregiver.submittedDate || "Gần đây"}</div>
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
                                                {resolvedUrl ? (
                                                    <a
                                                        href={resolvedUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-bold text-[#00677c] hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border border-teal-200 shadow-2xs"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        <span>Mở xem ảnh / tệp</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Không có tệp</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
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

                    {isAlreadyApproved ? (
                        <div className="flex items-center gap-2.5">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
                                <Check className="w-4 h-4 text-emerald-600" />
                                ✓ Hồ sơ đã được phê duyệt hoạt động
                            </span>
                            {!isRejecting && (
                                <button
                                    type="button"
                                    onClick={() => setIsRejecting(true)}
                                    className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                                    title="Thu hồi hoặc từ chối lại hồ sơ nếu phát hiện thông tin không hợp lệ"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Từ chối / Thu hồi
                                </button>
                            )}
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    );
}
