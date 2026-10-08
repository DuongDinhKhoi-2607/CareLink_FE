import React, { useState, useEffect } from "react";
import { X, Check, Star, Eye, ShieldCheck, AlertCircle, Plus, Trash2, ExternalLink } from "lucide-react";
import { categories } from "../../../data/handbookData";

const SOURCE_SUGGESTIONS = [
    "Vinmec",
    "Báo Sức khỏe & Đời sống (Bộ Y tế)",
    "Bệnh viện Bạch Mai",
    "Bệnh viện Chợ Rẫy",
    "Hội Lão khoa Việt Nam",
    "Viện Dinh dưỡng Quốc gia",
    "Hội Thần kinh học Việt Nam",
];

// ══════════════════════════════════════════════════════════════════════
// 1. MODAL THÊM / CHỈNH SỬA BÀI VIẾT CẨM NANG
// ══════════════════════════════════════════════════════════════════════
export function HandbookArticleFormModal({ isOpen, initialData, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: "",
        category: "elderly",
        categoryName: "Chăm sóc người cao tuổi",
        summary: "",
        readTime: "5 phút đọc",
        source: "Vinmec",
        sourceDetail: "Tổng hợp từ chuyên mục Lão khoa",
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200",
        featured: false,
        status: "published",
        content: `<h3>1. Hướng dẫn chăm sóc tổng quan</h3>
<p>Nội dung chi tiết về các nguyên tắc chăm sóc sức khỏe và hướng dẫn phòng ngừa...</p>`,
        references: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                references: Array.isArray(initialData.references) ? initialData.references : [],
            });
        } else {
            setFormData({
                title: "",
                category: "elderly",
                categoryName: "Chăm sóc người cao tuổi",
                summary: "",
                readTime: "5 phút đọc",
                source: "Vinmec",
                sourceDetail: "Tổng hợp từ chuyên mục Lão khoa",
                image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200",
                featured: false,
                status: "published",
                content: `<h3>1. Hướng dẫn chăm sóc tổng quan</h3>
<p>Nội dung chi tiết về các nguyên tắc chăm sóc sức khỏe và hướng dẫn phòng ngừa...</p>`,
                references: [],
            });
        }
    }, [initialData, isOpen]);

    const handleCategoryChange = (catId) => {
        const found = categories.find((c) => c.id === catId);
        setFormData((prev) => ({
            ...prev,
            category: catId,
            categoryName: found ? found.label : catId,
        }));
    };

    const handleAddReference = () => {
        setFormData((prev) => ({
            ...prev,
            references: [...(prev.references || []), { text: "", url: "" }],
        }));
    };

    const handleUpdateReference = (index, field, value) => {
        setFormData((prev) => {
            const nextRefs = [...(prev.references || [])];
            nextRefs[index] = { ...nextRefs[index], [field]: value };
            return { ...prev, references: nextRefs };
        });
    };

    const handleRemoveReference = (index) => {
        setFormData((prev) => ({
            ...prev,
            references: (prev.references || []).filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert("Vui lòng nhập tiêu đề bài viết!");
            return;
        }
        if (!formData.summary.trim()) {
            alert("Vui lòng nhập tóm tắt ngắn cho bài viết!");
            return;
        }
        const cleanedReferences = (formData.references || []).filter(
            (r) => (r.text && r.text.trim()) || (r.url && r.url.trim())
        );
        onSave({
            ...formData,
            references: cleanedReferences,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 font-sans flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-white border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            {initialData ? "Chỉnh sửa bài viết cẩm nang" : "Thêm bài viết cẩm nang mới"}
                        </h3>
                        <p className="text-xs text-slate-500">
                            Cung cấp kiến thức chăm sóc người thân chính xác và có cơ sở tham khảo uy tín
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body Scrollable */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
                    {/* Tiêu đề */}
                    <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 flex items-center justify-between">
                            <span>Tiêu đề bài viết <span className="text-rose-500">*</span></span>
                            <span className="text-[11px] font-normal text-slate-400">{formData.title.length}/120 ký tự</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ví dụ: 5 Dấu hiệu suy giảm sức khỏe ở người cao tuổi..."
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c] font-medium"
                        />
                    </div>

                    {/* Hàng 2: Chuyên mục & Thời gian đọc */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-700">Chuyên mục y tế</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c] font-medium cursor-pointer"
                            >
                                {categories
                                    .filter((c) => c.id !== "all")
                                    .map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.label}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-700">Thời gian đọc ước tính</label>
                            <input
                                type="text"
                                value={formData.readTime}
                                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                placeholder="Ví dụ: 6 phút đọc"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c] font-medium"
                            />
                        </div>
                    </div>

                    {/* Hàng 3: Nguồn uy tín & Chi tiết nguồn */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-700">Nguồn tham khảo uy tín</label>
                            <input
                                type="text"
                                list="sources-list"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                placeholder="Ví dụ: Vinmec, Báo SK&ĐS..."
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c] font-medium"
                            />
                            <datalist id="sources-list">
                                {SOURCE_SUGGESTIONS.map((s) => (
                                    <option key={s} value={s} />
                                ))}
                            </datalist>
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-700">Chi tiết chuyên khoa / chuyên mục</label>
                            <input
                                type="text"
                                value={formData.sourceDetail}
                                onChange={(e) => setFormData({ ...formData, sourceDetail: e.target.value })}
                                placeholder="Ví dụ: Chuyên mục Lão khoa & Phục hồi"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c] font-medium"
                            />
                        </div>
                    </div>

                    {/* Ảnh bìa bài viết */}
                    <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">Link ảnh bìa (URL)</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://images.unsplash.com/..."
                                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c] font-medium"
                            />
                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Xem trước ảnh"
                                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600";
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Tóm tắt ngắn */}
                    <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">
                            Tóm tắt nội dung (Lead) <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            required
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            placeholder="Mô tả súc tích thông điệp chính của bài viết, thu hút người đọc..."
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c] font-medium resize-none"
                        />
                    </div>

                    {/* Nội dung chi tiết bài viết */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-700">Nội dung bài viết (HTML / Đoạn văn)</label>
                            <span className="text-[11px] text-slate-400">Hỗ trợ các thẻ &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;</span>
                        </div>
                        <textarea
                            rows={6}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Nhập nội dung bài viết..."
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c] font-mono text-xs resize-y"
                        />
                    </div>

                    {/* Danh sách tài liệu tham khảo */}
                    <div className="space-y-2.5 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-bold text-slate-700 block">
                                    Tài liệu tham khảo liên kết ({formData.references?.length || 0})
                                </label>
                                <span className="text-[11px] text-slate-500">
                                    Nguồn trích dẫn minh bạch giúp bài viết tăng độ tin cậy
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddReference}
                                className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#00677c] font-bold text-xs rounded-lg border border-teal-200 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Thêm nguồn</span>
                            </button>
                        </div>

                        {(!formData.references || formData.references.length === 0) ? (
                            <p className="text-xs text-slate-400 italic py-1">
                                Chưa có tài liệu tham khảo nào. Bấm "Thêm nguồn" nếu bài viết có trích dẫn từ bài báo/nghiên cứu y khoa.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {formData.references.map((ref, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={ref.text}
                                            onChange={(e) => handleUpdateReference(idx, "text", e.target.value)}
                                            placeholder="Tên bài báo / tài liệu (VD: Vinmec - Bệnh sa sút trí tuệ)"
                                            className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00677c]"
                                        />
                                        <input
                                            type="url"
                                            value={ref.url}
                                            onChange={(e) => handleUpdateReference(idx, "url", e.target.value)}
                                            placeholder="Đường dẫn URL (https://...)"
                                            className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00677c]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveReference(idx)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors shrink-0"
                                            title="Xóa tài liệu"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Switches: Nổi bật & Trạng thái xuất bản */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4 text-[#00677c] rounded-md focus:ring-teal-500 cursor-pointer"
                            />
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                                <span className="font-bold text-slate-800 text-xs sm:text-sm">Đặt làm bài viết Nổi bật</span>
                            </div>
                        </label>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Trạng thái:</span>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                            >
                                <option value="published">Đang hiển thị</option>
                                <option value="draft">Bản nháp (Ẩn)</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-[#00677c] hover:bg-[#005566] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <Check className="w-4 h-4" />
                            <span>{initialData ? "Lưu thay đổi" : "Xuất bản bài viết"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════
// 2. MODAL XEM TRƯỚC BÀI VIẾT CẨM NANG (PREVIEW)
// ══════════════════════════════════════════════════════════════════════
export function HandbookPreviewModal({ article, onClose }) {
    if (!article) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 font-sans flex flex-col max-h-[92vh]">
                {/* Header thanh lịch */}
                <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                        <Eye className="w-4 h-4 text-teal-600" />
                        <span>Xem trước bài viết trên giao diện Cẩm nang</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body xem trước */}
                <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
                    {/* Badge & Meta */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                            {article.categoryName || article.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Nguồn tham khảo uy tín</span>
                        </span>
                        {article.featured && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400" />
                                Bài nổi bật
                            </span>
                        )}
                        <span className="text-xs text-slate-400 ml-auto font-medium">
                            {article.readTime} • {article.date || "Vừa cập nhật"}
                        </span>
                    </div>

                    {/* Tiêu đề */}
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                        {article.title}
                    </h2>

                    {/* Tóm tắt */}
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {article.summary}
                    </p>

                    {/* Ảnh bìa */}
                    {article.image && (
                        <div className="rounded-2xl overflow-hidden border border-slate-100 max-h-72">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Hộp nguồn tham khảo */}
                    <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                                CL
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">
                                    Nguồn tham khảo: {article.source}
                                </div>
                                <div className="text-slate-500">{article.sourceDetail}</div>
                            </div>
                        </div>
                    </div>

                    {/* Nội dung chi tiết */}
                    <div
                        className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Danh sách tài liệu tham khảo preview */}
                    {article.references && article.references.length > 0 && (
                        <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-xl border border-slate-200/80">
                            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                                Tài liệu tham khảo ({article.references.length})
                            </h4>
                            <ul className="space-y-2">
                                {article.references.map((ref, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-xs">
                                        <span className="text-teal-700 font-bold shrink-0 bg-teal-50 w-5 h-5 rounded flex items-center justify-center border border-teal-200 text-[11px]">
                                            {idx + 1}
                                        </span>
                                        {ref.url ? (
                                            <a
                                                href={ref.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-600 hover:text-[#00677c] underline underline-offset-2 flex items-center gap-1.5 break-all font-medium"
                                            >
                                                <span>{ref.text || ref.url}</span>
                                                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                                            </a>
                                        ) : (
                                            <span className="text-slate-600 font-medium">{ref.text}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Khung Lưu ý y khoa bắt buộc */}
                    <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                            <strong>Lưu ý:</strong> Nội dung mang tính tham khảo từ các nguồn y khoa uy tín, không thay thế chẩn đoán hoặc chỉ định điều trị của bác sĩ. Vui lòng tham vấn nhân viên y tế khi cần thiết.
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs sm:text-sm cursor-pointer"
                    >
                        Đóng xem trước
                    </button>
                </div>
            </div>
        </div>
    );
}
