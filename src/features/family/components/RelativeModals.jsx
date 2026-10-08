import React from "react";
import { Link } from "react-router-dom";

// ══════════════════════════════════════════════════════════════════════
// 1. MODAL CHI TIẾT HỒ SƠ Y TẾ NGƯỜI THÂN ("Xem hồ sơ chi tiết")
// ══════════════════════════════════════════════════════════════════════
export function RelativeDetailModal({ selectedRelative, onClose, onEdit }) {
    if (!selectedRelative) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-page-enter">
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
                                Hồ sơ y tế: {selectedRelative.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Quan hệ: <strong className="text-slate-700 font-semibold">{selectedRelative.relation}</strong> •{" "}
                                {selectedRelative.age} tuổi • Giới tính: {selectedRelative.gender} • Nhóm máu:{" "}
                                <strong className="text-teal-700 font-bold">{selectedRelative.bloodType}</strong>
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
                    {/* 1. Thông tin cá nhân & Liên hệ */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-600" />
                            1. Thông tin hành chính & liên hệ
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                            <div>
                                <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
                                <span className="font-bold text-slate-900">{selectedRelative.name}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[11px]">Ngày sinh:</span>
                                <span>{selectedRelative.birthDate}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[11px]">Nhóm máu:</span>
                                <span className="font-bold text-teal-700">{selectedRelative.bloodType}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
                                <span>{selectedRelative.phone || "0908 123 456"}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Bệnh học & Thuốc men */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-3">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-600" />
                            2. Tình trạng bệnh & Phác đồ dùng thuốc
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                            <div className="sm:col-span-2">
                                <span className="text-slate-400 block text-[11px]">Chẩn đoán y tế:</span>
                                <span className="font-semibold text-slate-800">{selectedRelative.healthCondition}</span>
                            </div>
                            <div className="sm:col-span-2">
                                <span className="text-slate-400 block text-[11px]">Thuốc đang dùng:</span>
                                <span className="font-semibold text-slate-800">{selectedRelative.medicationsSummary}</span>
                            </div>
                            <div className="sm:col-span-2">
                                <span className="text-slate-400 block text-[11px]">Ghi chú chăm sóc:</span>
                                <p className="text-slate-700 italic bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 text-[11px]">
                                    "{selectedRelative.medicalNote}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Phụ trách chuyên môn */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-600" />
                            3. Điều dưỡng CareLink phụ trách
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                            <div>
                                <span className="text-slate-400 block text-[11px]">Điều dưỡng phụ trách:</span>
                                <strong className="text-slate-900">{selectedRelative.assignedCaregiver}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[11px]">Ca chăm sóc gần nhất:</span>
                                <span>{selectedRelative.lastVisit}</span>
                            </div>
                        </div>
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
                        Chỉnh sửa thông tin
                    </button>
                </div>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════
// 2. MODAL THÊM / CHỈNH SỬA THÔNG TIN NGƯỜI THÂN
// ══════════════════════════════════════════════════════════════════════
export function RelativeFormModal({
    isOpen,
    editingRelative,
    formData,
    setFormData,
    onClose,
    onSave,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-page-enter">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editingRelative ? "Chỉnh sửa thông tin người thân" : "Thêm người thân mới"}
                            </h3>
                            <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[11px] font-semibold">
                                Vai trò: Gia đình
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Gia đình quản lý thông tin hành chính, liên hệ và ghi chú dặn dò sinh hoạt.
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
                    {/* KHỐI 1: THÔNG TIN GIA ĐÌNH CÓ TOÀN QUYỀN CHỈNH SỬA */}
                    <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-1 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            Thông tin hành chính & Gia đình
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">
                                    Họ và tên người thân <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ví dụ: Bà Nguyễn Thị Lan"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Mối quan hệ</label>
                                <select
                                    value={formData.relation}
                                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 cursor-pointer text-slate-800"
                                >
                                    <option value="Mẹ">Mẹ</option>
                                    <option value="Bố">Bố</option>
                                    <option value="Ông">Ông</option>
                                    <option value="Bà">Bà</option>
                                    <option value="Vợ/Chồng">Vợ/Chồng</option>
                                    <option value="Khác">Người thân khác</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Giới tính</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 cursor-pointer text-slate-800"
                                >
                                    <option value="Nữ">Nữ</option>
                                    <option value="Nam">Nam</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Nhóm máu</label>
                                <select
                                    value={formData.bloodType}
                                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 cursor-pointer text-slate-800"
                                >
                                    <option value="O+">O+</option>
                                    <option value="A+">A+</option>
                                    <option value="B+">B+</option>
                                    <option value="AB+">AB+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-slate-700 font-semibold mb-1">Số điện thoại liên hệ</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Số điện thoại của người thân hoặc người giám hộ"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">
                                Ghi chú & Dặn dò của gia đình gửi Điều dưỡng
                            </label>
                            <textarea
                                rows={2}
                                value={formData.medicalNote}
                                onChange={(e) => setFormData({ ...formData, medicalNote: e.target.value })}
                                placeholder="Ví dụ: Hạn chế ăn mặn, cần hỗ trợ tập co duỗi khớp gối 20 phút mỗi buổi sáng, cụ thích đi dạo nhẹ trong nhà..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800"
                            />
                        </div>
                    </div>

                    {/* KHỐI 2: HỒ SƠ Y KHOA CHUYÊN MÔN (READ-ONLY DO ĐIỀU DƯỠNG QUẢN LÝ) */}
                    <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                Hồ sơ y khoa chuyên môn (Được quản lý bởi Điều dưỡng)
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium italic">Chỉ xem (Read-only)</span>
                        </div>

                        <div>
                            <label className="block text-slate-500 font-medium mb-1 text-[11px]">
                                Tình trạng sức khỏe & Chẩn đoán lâm sàng:
                            </label>
                            <div className="px-3 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-slate-700 font-medium select-none">
                                {formData.healthCondition || "Chưa ghi nhận"}
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-500 font-medium mb-1 text-[11px]">
                                Thuốc đang dùng theo phác đồ bác sĩ:
                            </label>
                            <div className="px-3 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-slate-700 font-medium select-none">
                                {formData.medicationsSummary || "Theo chỉ định"}
                            </div>
                        </div>

                        <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
                            <svg className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                            <p>
                                Để đảm bảo tính chuẩn xác và an toàn y tế, đơn thuốc và bệnh lý chỉ được xác nhận bởi Điều dưỡng phụ trách. Nếu người thân có toa thuốc mới từ bệnh viện, vui lòng{" "}
                                <Link to="/chat" className="text-teal-700 font-bold hover:underline">
                                    gửi ảnh toa thuốc tại đây →
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                        >
                            {editingRelative ? "Lưu thay đổi" : "Thêm hồ sơ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
