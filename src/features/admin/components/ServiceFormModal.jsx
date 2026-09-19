import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

export default function ServiceFormModal({ service, isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        category: "Chăm sóc người cao tuổi",
        description: "",
        duration: "4 giờ / ca",
        basePrice: "450.000 ₫",
        status: "Đang hoạt động",
    });

    useEffect(() => {
        if (service) {
            setFormData(service);
        } else {
            setFormData({
                name: "",
                category: "Chăm sóc người cao tuổi",
                description: "",
                duration: "4 giờ / ca",
                basePrice: "450.000 ₫",
                status: "Đang hoạt động",
            });
        }
    }, [service, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert("Vui lòng nhập tên gói dịch vụ!");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 font-sans">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-white border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            {service ? "Chỉnh sửa thông tin dịch vụ" : "Thêm dịch vụ chăm sóc mới"}
                        </h3>
                        <p className="text-xs text-slate-500">Cấu hình danh mục và thời lượng ca chăm sóc CareLink</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Tên dịch vụ */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Tên gói dịch vụ *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ví dụ: Chăm sóc người cao tuổi toàn diện..."
                            required
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                        />
                    </div>

                    {/* Phân loại & Thời lượng */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Nhóm dịch vụ</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#00677c] cursor-pointer"
                            >
                                <option value="Chăm sóc người cao tuổi">Chăm sóc người cao tuổi</option>
                                <option value="Chăm sóc y tế chuyên môn">Chăm sóc y tế chuyên môn</option>
                                <option value="Phục hồi chức năng">Phục hồi chức năng</option>
                                <option value="Hỗ trợ sinh hoạt">Hỗ trợ sinh hoạt</option>
                                <option value="Theo dõi sức khỏe">Theo dõi sức khỏe</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Thời lượng chuẩn ca trực</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="Ví dụ: 4 giờ / ca, 8 giờ / ca"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                            />
                        </div>
                    </div>

                    {/* Giá tham khảo & Trạng thái */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                                Giá tham khảo (Mock Data)
                            </label>
                            <input
                                type="text"
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                placeholder="Ví dụ: 500.000 ₫"
                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                            />
                            <span className="text-[10px] text-slate-400 mt-0.5 block">* Giá hiển thị minh họa UI</span>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Trạng thái phát hành</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#00677c] cursor-pointer"
                            >
                                <option value="Đang hoạt động">Đang hoạt động</option>
                                <option value="Tạm ngưng">Tạm ngưng nhận ca</option>
                            </select>
                        </div>
                    </div>

                    {/* Mô tả dịch vụ */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả tóm tắt dịch vụ</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả các công việc điều dưỡng thực hiện trong ca trực này..."
                            rows={3}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                        />
                    </div>

                    {/* Footer buttons */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-[#00677c] hover:bg-[#005566] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                            <Check className="w-4 h-4" strokeWidth={2.5} />
                            {service ? "Lưu thay đổi" : "Tạo gói dịch vụ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
