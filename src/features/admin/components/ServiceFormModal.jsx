import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle, Plus, Trash2, Coins, Clock, Layers } from "lucide-react";

export default function ServiceFormModal({ service, isOpen, onClose, onSave, isSubmitting = false }) {
    const [formData, setFormData] = useState({
        name: "",
        category: "Chăm sóc người cao tuổi",
        description: "",
        durationMinutes: 240,
        duration: "4 giờ / ca",
        basePrice: 450000,
        status: "Đang hoạt động",
        isActive: true,
        features: [
            "Kiểm tra chỉ số sinh tồn cơ bản trước ca trực",
            "Hỗ trợ các hoạt động chăm sóc theo tiêu chuẩn y tế",
            "Ghi nhật ký ca trực và báo cáo cho gia đình",
        ],
    });

    const [nameError, setNameError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [newFeatureText, setNewFeatureText] = useState("");

    useEffect(() => {
        if (service) {
            const rawPrice =
                typeof service.basePrice === "number"
                    ? service.basePrice
                    : parseInt(String(service.basePrice || "0").replace(/\D/g, ""), 10) || 450000;

            const isAct = service.isActive !== undefined
                ? Boolean(service.isActive)
                : service.status === "Đang hoạt động" || service.status === "ACTIVE";

            setFormData({
                name: service.name || service.serviceName || service.title || "",
                category: service.category || service.serviceCategory || "Chăm sóc người cao tuổi",
                description: service.description || "",
                durationMinutes: service.durationMinutes || 240,
                duration: service.duration || (service.durationMinutes ? `${service.durationMinutes} phút` : "4 giờ / ca"),
                basePrice: rawPrice,
                status: isAct ? "Đang hoạt động" : "Tạm ngưng",
                isActive: isAct,
                features: Array.isArray(service.features) && service.features.length > 0
                    ? [...service.features]
                    : [
                          "Kiểm tra chỉ số sinh tồn cơ bản trước ca trực",
                          "Hỗ trợ các hoạt động chăm sóc theo tiêu chuẩn y tế",
                          "Ghi nhật ký ca trực và báo cáo cho gia đình",
                      ],
            });
        } else {
            setFormData({
                name: "",
                category: "Chăm sóc người cao tuổi",
                description: "",
                durationMinutes: 240,
                duration: "4 giờ / ca",
                basePrice: 450000,
                status: "Đang hoạt động",
                isActive: true,
                features: [
                    "Kiểm tra chỉ số sinh tồn cơ bản trước ca trực",
                    "Hỗ trợ các hoạt động chăm sóc theo tiêu chuẩn y tế",
                    "Ghi nhật ký ca trực và báo cáo cho gia đình",
                ],
            });
        }
        setNameError("");
        setPriceError("");
        setNewFeatureText("");
    }, [service, isOpen]);

    if (!isOpen) return null;

    const handleAddFeature = (e) => {
        e.preventDefault();
        const trimmed = newFeatureText.trim();
        if (!trimmed) return;
        setFormData((prev) => ({
            ...prev,
            features: [...prev.features, trimmed],
        }));
        setNewFeatureText("");
    };

    const handleRemoveFeature = (idx) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let valid = true;

        if (!formData.name.trim()) {
            setNameError("Vui lòng nhập tên gói dịch vụ!");
            valid = false;
        } else {
            setNameError("");
        }

        if (Number(formData.basePrice) < 10000) {
            setPriceError("Đơn giá cơ sở tối thiểu là 10.000 ₫!");
            valid = false;
        } else {
            setPriceError("");
        }

        if (!valid) return;

        // Chuẩn bị payload tương thích cả DTO backend
        const payload = {
            name: formData.name.trim(),
            serviceName: formData.name.trim(),
            category: formData.category,
            serviceCategory: formData.category,
            description: formData.description.trim(),
            basePrice: Number(formData.basePrice),
            durationMinutes: Number(formData.durationMinutes),
            duration: formData.duration || `${formData.durationMinutes} phút`,
            isActive: formData.isActive,
            status: formData.isActive ? "ACTIVE" : "INACTIVE",
            features: formData.features,
        };

        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 font-sans">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-white border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            {service ? "Chỉnh sửa thông tin dịch vụ" : "Thêm gói dịch vụ chăm sóc mới"}
                        </h3>
                        <p className="text-xs text-slate-500">Cấu hình danh mục và thời lượng ca chăm sóc CareLink</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Tên dịch vụ */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                            Tên gói dịch vụ <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (nameError) setNameError("");
                            }}
                            placeholder="Ví dụ: Chăm sóc người cao tuổi toàn diện..."
                            required
                            disabled={isSubmitting}
                            className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                                nameError ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                            } rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2`}
                        />
                        {nameError && (
                            <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {nameError}
                            </p>
                        )}
                    </div>

                    {/* Phân loại & Trạng thái */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Nhóm dịch vụ</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                disabled={isSubmitting}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#00677c] cursor-pointer"
                            >
                                <option value="Chăm sóc người cao tuổi">Chăm sóc người cao tuổi</option>
                                <option value="Chăm sóc y tế chuyên môn">Chăm sóc y tế chuyên môn</option>
                                <option value="Phục hồi chức năng">Phục hồi chức năng</option>
                                <option value="Hỗ trợ sinh hoạt">Hỗ trợ sinh hoạt</option>
                                <option value="Theo dõi sức khỏe">Theo dõi sức khỏe</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Trạng thái phát hành</label>
                            <select
                                value={formData.isActive ? "ACTIVE" : "INACTIVE"}
                                onChange={(e) => {
                                    const act = e.target.value === "ACTIVE";
                                    setFormData({
                                        ...formData,
                                        isActive: act,
                                        status: act ? "Đang hoạt động" : "Tạm ngưng",
                                    });
                                }}
                                disabled={isSubmitting}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#00677c] cursor-pointer"
                            >
                                <option value="ACTIVE">Đang hoạt động (Công khai)</option>
                                <option value="INACTIVE">Tạm ngưng nhận ca</option>
                            </select>
                        </div>
                    </div>

                    {/* Đơn giá & Thời lượng */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                                Đơn giá sàn cơ sở (VNĐ) <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min={10000}
                                    step={10000}
                                    value={formData.basePrice}
                                    onChange={(e) => {
                                        setFormData({ ...formData, basePrice: Number(e.target.value) });
                                        if (priceError) setPriceError("");
                                    }}
                                    placeholder="Ví dụ: 450000"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                                />
                                <Coins className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                            </div>
                            <span className="text-[10px] text-teal-700 font-semibold mt-1 block">
                                {Number(formData.basePrice || 0).toLocaleString("vi-VN")} ₫ / ca
                            </span>
                            {priceError && (
                                <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> {priceError}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Thời lượng chuẩn ca trực</label>
                            <div className="flex gap-2">
                                <select
                                    value={formData.durationMinutes}
                                    onChange={(e) => {
                                        const mins = Number(e.target.value);
                                        setFormData({
                                            ...formData,
                                            durationMinutes: mins,
                                            duration: `${mins / 60} giờ / ca`,
                                        });
                                    }}
                                    disabled={isSubmitting}
                                    className="w-1/2 px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#00677c] cursor-pointer"
                                >
                                    <option value={60}>1 giờ</option>
                                    <option value={120}>2 giờ</option>
                                    <option value={240}>4 giờ</option>
                                    <option value={480}>8 giờ</option>
                                    <option value={720}>12 giờ</option>
                                    <option value={1440}>24 giờ</option>
                                </select>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="4 giờ / ca"
                                    disabled={isSubmitting}
                                    className="w-1/2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mô tả dịch vụ */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả tóm tắt dịch vụ</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả các nội dung và mục tiêu chăm sóc người bệnh..."
                            rows={3}
                            disabled={isSubmitting}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                        />
                    </div>

                    {/* Danh mục công việc / Checklist */}
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                            Các hạng mục công việc thực hiện trong ca
                        </label>
                        <div className="space-y-2 mb-2">
                            {formData.features.map((feat, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between gap-2 p-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700"
                                >
                                    <span className="line-clamp-1">{feat}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(idx)}
                                        disabled={isSubmitting}
                                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                                        title="Xóa hạng mục"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newFeatureText}
                                onChange={(e) => setNewFeatureText(e.target.value)}
                                placeholder="Thêm đầu việc mới (nhấn Thêm)..."
                                disabled={isSubmitting}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddFeature(e);
                                    }
                                }}
                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#00677c]"
                            />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                disabled={isSubmitting || !newFeatureText.trim()}
                                className="px-3 py-2 bg-teal-50 text-[#00677c] font-bold text-xs rounded-xl hover:bg-teal-100 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Thêm
                            </button>
                        </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-xs font-bold text-white bg-[#00677c] hover:bg-[#005566] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Đang lưu...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" strokeWidth={2.5} />
                                    <span>{service ? "Lưu thay đổi" : "Tạo gói dịch vụ"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
