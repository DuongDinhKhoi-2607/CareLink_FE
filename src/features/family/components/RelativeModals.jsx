import React from "react";
import { createPortal } from "react-dom";

// ══════════════════════════════════════════════════════════════════════
// 1. MODAL CHI TIẾT HỒ SƠ Y TẾ NGƯỜI THÂN ("Xem hồ sơ chi tiết")
// ══════════════════════════════════════════════════════════════════════
export function RelativeDetailModal({ selectedRelative, onClose, onEdit }) {
    if (!selectedRelative) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                        <img
                            src={selectedRelative.image}
                            alt={selectedRelative.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                        />
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Hồ sơ người thân: {selectedRelative.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {selectedRelative.age !== "—" ? `${selectedRelative.age} tuổi • ` : ""}
                                Giới tính: <strong className="text-slate-700 font-semibold">{selectedRelative.gender}</strong>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Nội dung chi tiết */}
                <div className="space-y-4 text-xs">
                    {/* 1. Thông tin cá nhân & Địa chỉ */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-600" />
                            1. Thông tin hành chính & Nơi chăm sóc
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                            <div>
                                <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
                                <span className="font-bold text-slate-900">{selectedRelative.name}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[11px]">Ngày sinh:</span>
                                <span>{selectedRelative.birthDate || "Chưa cập nhật"}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[11px]">Giới tính:</span>
                                <span>{selectedRelative.gender}</span>
                            </div>
                            <div className="sm:col-span-3 pt-1 border-t border-slate-200/60">
                                <span className="text-slate-400 block text-[11px]">Địa chỉ nhận chăm sóc:</span>
                                <span className="font-semibold text-slate-800">
                                    {selectedRelative.address || "Chưa thiết lập địa chỉ"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Tiền sử bệnh lý & Tình trạng sức khỏe */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-3">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-600" />
                            2. Tiền sử bệnh lý & Tình trạng sức khỏe
                        </h4>
                        <div className="text-slate-700">
                            <p className="font-semibold text-slate-800 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed text-xs">
                                {selectedRelative.medicalHistory || "Chưa ghi nhận tiền sử bệnh lý."}
                            </p>
                        </div>
                    </div>

                    {/* 3. Ghi chú & Dặn dò điều dưỡng */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-600" />
                            3. Ghi chú đặc biệt cho Điều dưỡng
                        </h4>
                        <p className="text-slate-700 italic bg-amber-50/80 p-3 rounded-xl border border-amber-200/70 text-xs leading-relaxed">
                            {selectedRelative.specialNotes || "Không có ghi chú đặc biệt."}
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                        Đóng
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(selectedRelative)}
                        className="px-4 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                    >
                        Chỉnh sửa hồ sơ
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ══════════════════════════════════════════════════════════════════════
// 2. MODAL THÊM / CHỈNH SỬA THÔNG TIN NGƯỜI THÂN (Khớp 100% Swagger API)
// ══════════════════════════════════════════════════════════════════════
export function RelativeFormModal({
    isOpen,
    editingRelative,
    formData,
    setFormData,
    onClose,
    onSave,
    submitting = false,
}) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editingRelative ? "Chỉnh sửa hồ sơ người thân" : "Thêm người thân mới"}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-semibold border border-teal-200/60">
                                Hồ sơ y tế bảo mật
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Cập nhật thông tin hành chính, địa chỉ và tiền sử y tế để điều dưỡng chăm sóc chu đáo nhất.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={onSave} className="space-y-4 text-xs">
                    {/* KHỐI 1: THÔNG TIN HÀNH CHÍNH */}
                    <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            1. Thông tin người nhận chăm sóc
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                                <label className="block text-slate-700 font-semibold mb-1">
                                    Họ và tên người thân <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={100}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ví dụ: Bà Nguyễn Thị Lan"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800 text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Giới tính</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 cursor-pointer text-slate-800 text-xs"
                                >
                                    <option value="Nữ">Nữ</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Ngày sinh</label>
                                <input
                                    type="date"
                                    value={formData.birthDate || ""}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800 text-xs"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-slate-700 font-semibold mb-1">
                                    Địa chỉ nhận chăm sóc / Thường trú
                                </label>
                                <input
                                    type="text"
                                    maxLength={255}
                                    value={formData.address || ""}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Ví dụ: 123 Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, TP.HCM"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800 text-xs"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Địa chỉ này sẽ dùng làm vị trí mặc định khi gia đình đặt ca cho người thân.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI 2: TIỀN SỬ BỆNH LÝ & GHI CHÚ ĐẶC BIỆT */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            2. Tình trạng sức khỏe & Ghi chú y tế
                        </span>

                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">
                                Tiền sử bệnh lý & Chẩn đoán hiện tại
                            </label>
                            <textarea
                                rows={3}
                                value={formData.medicalHistory || ""}
                                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                                placeholder="Ví dụ: Hậu phẫu phục hồi khớp gối, cao huyết áp độ 1, tiền sử dị ứng kháng sinh penicillin..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800 text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">
                                Ghi chú đặc biệt & Dặn dò điều dưỡng
                            </label>
                            <textarea
                                rows={2}
                                value={formData.specialNotes || ""}
                                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                                placeholder="Ví dụ: Cần hỗ trợ tập co duỗi khớp gối 20 phút mỗi buổi sáng, hạn chế ăn mặn, cụ thích đi dạo nhẹ trong sân..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800 text-xs"
                            />
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:opacity-60 inline-flex items-center gap-2"
                        >
                            {submitting && (
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                            )}
                            {submitting ? "Đang lưu..." : editingRelative ? "Lưu thay đổi" : "Thêm hồ sơ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

// ══════════════════════════════════════════════════════════════════════
// 3. MODAL XÁC NHẬN XÓA HỒ SƠ NGƯỜI THÂN
// ══════════════════════════════════════════════════════════════════════
export function DeleteConfirmModal({ name, deleting, onConfirm, onCancel }) {
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-base">Xóa hồ sơ người thân</h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                            Hành động này không thể hoàn tác.
                        </p>
                    </div>
                </div>

                <p className="text-sm text-slate-700 bg-red-50/60 border border-red-100 rounded-xl p-3">
                    Bạn có chắc chắn muốn xóa hồ sơ <strong className="text-slate-900">"{name}"</strong> khỏi hệ thống không? Toàn bộ dữ liệu liên quan sẽ bị xóa vĩnh viễn.
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={deleting}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-60 inline-flex items-center gap-2"
                    >
                        {deleting && (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                        )}
                        {deleting ? "Đang xóa..." : "Xác nhận xóa"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
