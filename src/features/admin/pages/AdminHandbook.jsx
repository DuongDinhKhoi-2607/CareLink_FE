import React, { useState, useEffect } from "react";
import {
    BookOpen,
    Search,
    Plus,
    Filter,
    Edit3,
    Trash2,
    Eye,
    CheckCircle2,
    Star,
    Clock,
    Calendar,
    X,
    Check,
    AlertCircle,
    LayoutGrid,
    Table as TableIcon,
    ShieldCheck,
    RefreshCw,
} from "lucide-react";
import { categories, articles as initialArticles } from "../../../data/handbookData";

const STORAGE_KEY = "carelink_admin_handbook_articles";

const SOURCE_SUGGESTIONS = [
    "Vinmec",
    "Báo Sức khỏe & Đời sống (Bộ Y tế)",
    "Bệnh viện Bạch Mai",
    "Bệnh viện Chợ Rẫy",
    "Hội Lão khoa Việt Nam",
    "Viện Dinh dưỡng Quốc gia",
    "Hội Thần kinh học Việt Nam",
];

export default function AdminHandbook() {
    // Khởi tạo state từ localStorage hoặc dữ liệu mẫu chuẩn
    const [articlesList, setArticlesList] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {
            // fallback nếu parse lỗi
        }
        return initialArticles.map((art) => ({
            ...art,
            status: art.status || "published", // "published" | "draft"
        }));
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
    const [toastMessage, setToastMessage] = useState(null);

    // Modal states
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [previewArticle, setPreviewArticle] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);

    // Lưu vào localStorage khi danh sách thay đổi
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(articlesList));
        } catch {
            // ignore quota errors
        }
    }, [articlesList]);

    // Toast timer
    useEffect(() => {
        if (!toastMessage) return;
        const timer = setTimeout(() => setToastMessage(null), 3000);
        return () => clearTimeout(timer);
    }, [toastMessage]);

    // Thống kê nhanh
    const totalCount = articlesList.length;
    const publishedCount = articlesList.filter((a) => a.status === "published").length;
    const draftCount = articlesList.filter((a) => a.status === "draft").length;
    const featuredCount = articlesList.filter((a) => a.featured).length;

    // Lọc danh sách bài viết
    const filteredArticles = articlesList.filter((art) => {
        const matchesSearch =
            art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (art.source && art.source.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
            categoryFilter === "all" || art.category === categoryFilter;

        const matchesStatus =
            statusFilter === "all"
                ? true
                : statusFilter === "featured"
                ? art.featured
                : art.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Thao tác bật/tắt trạng thái hiển thị
    const handleToggleStatus = (id) => {
        setArticlesList((prev) =>
            prev.map((art) => {
                if (art.id === id) {
                    const newStatus = art.status === "published" ? "draft" : "published";
                    setToastMessage(
                        newStatus === "published"
                            ? `Đã chuyển bài viết sang trạng thái "Đang hiển thị"`
                            : `Đã ẩn bài viết sang trạng thái "Bản nháp"`
                    );
                    return { ...art, status: newStatus };
                }
                return art;
            })
        );
    };

    // Thao tác bật/tắt nổi bật
    const handleToggleFeatured = (id) => {
        setArticlesList((prev) =>
            prev.map((art) => {
                if (art.id === id) {
                    const newFeatured = !art.featured;
                    setToastMessage(
                        newFeatured
                            ? "Đã đánh dấu bài viết nổi bật"
                            : "Đã bỏ đánh dấu bài viết nổi bật"
                    );
                    return { ...art, featured: newFeatured };
                }
                return art;
            })
        );
    };

    // Xử lý lưu (Thêm mới hoặc Cập nhật)
    const handleSaveArticle = (savedData) => {
        if (editingArticle) {
            setArticlesList((prev) =>
                prev.map((art) => (art.id === editingArticle.id ? { ...savedData, id: art.id } : art))
            );
            setToastMessage("Cập nhật bài viết cẩm nang thành công!");
        } else {
            const newArticle = {
                ...savedData,
                id: Date.now(),
                date: new Date().toLocaleDateString("vi-VN"),
            };
            setArticlesList((prev) => [newArticle, ...prev]);
            setToastMessage("Thêm bài viết mới vào Cẩm nang thành công!");
        }
        setFormModalOpen(false);
        setEditingArticle(null);
    };

    // Xử lý xóa
    const handleConfirmDelete = () => {
        if (!articleToDelete) return;
        setArticlesList((prev) => prev.filter((a) => a.id !== articleToDelete.id));
        setToastMessage(`Đã xóa bài viết "${articleToDelete.title.slice(0, 30)}..."`);
        setDeleteModalOpen(false);
        setArticleToDelete(null);
    };

    // Khôi phục dữ liệu gốc
    const handleResetData = () => {
        if (window.confirm("Khôi phục toàn bộ bài viết Cẩm nang về mặc định? Các chỉnh sửa thử nghiệm sẽ bị xóa.")) {
            localStorage.removeItem(STORAGE_KEY);
            setArticlesList(initialArticles.map(a => ({ ...a, status: "published" })));
            setToastMessage("Đã khôi phục dữ liệu Cẩm nang ban đầu!");
        }
    };

    return (
        <div className="space-y-6 font-sans">
            {/* ── TOAST THÔNG BÁO ── */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs sm:text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* ── HEADER & TIÊU ĐỀ CHÍNH ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span>Quản lý Nội dung Y tế & Truyền thông</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        Quản lý Cẩm Nang Y Tế
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Biên tập, phân loại và xuất bản các bài viết hướng dẫn chăm sóc chuẩn y khoa cho gia đình
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleResetData}
                        className="px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title="Khôi phục dữ liệu bài viết mẫu"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Dữ liệu mẫu</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setEditingArticle(null);
                            setFormModalOpen(true);
                        }}
                        className="px-4 py-2 bg-[#00677c] hover:bg-[#005566] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm bài viết mới</span>
                    </button>
                </div>
            </div>

            {/* ── STATS CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Tổng bài viết</span>
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                            <BookOpen className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">{totalCount}</div>
                    <span className="text-[11px] text-slate-400 font-medium">Kho kiến thức y tế</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Đang xuất bản</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600 mt-2">{publishedCount}</div>
                    <span className="text-[11px] text-slate-400 font-medium">Hiển thị cho người dùng</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Bài nổi bật</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                            <Star className="w-4 h-4 fill-amber-400" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-600 mt-2">{featuredCount}</div>
                    <span className="text-[11px] text-slate-400 font-medium">Được ghim trang chủ</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Bản nháp / Đã ẩn</span>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-700 mt-2">{draftCount}</div>
                    <span className="text-[11px] text-slate-400 font-medium">Đang chỉnh lý nội dung</span>
                </div>
            </div>

            {/* ── BỘ LỌC & TÌM KIẾM ── */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm bài viết theo tiêu đề, triệu chứng, nguồn tham khảo..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c] transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 font-medium hidden sm:inline">Chuyên mục:</span>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                        <span className="text-slate-500 font-medium hidden sm:inline">Trạng thái:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="published">Đang hiển thị</option>
                            <option value="draft">Bản nháp / Đã ẩn</option>
                            <option value="featured">Bài nổi bật ⭐</option>
                        </select>
                    </div>

                    {/* View Switch */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setViewMode("table")}
                            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                viewMode === "table"
                                    ? "bg-white text-teal-800 shadow-2xs font-bold"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                            title="Xem dạng bảng"
                        >
                            <TableIcon className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                viewMode === "grid"
                                    ? "bg-white text-teal-800 shadow-2xs font-bold"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                            title="Xem dạng lưới card"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── NỘI DUNG DANH SÁCH BÀI VIẾT ── */}
            {filteredArticles.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Không tìm thấy bài viết phù hợp</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                        Thử điều chỉnh từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc chuyên mục / trạng thái.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            setCategoryFilter("all");
                            setStatusFilter("all");
                        }}
                        className="text-xs font-bold text-[#00677c] hover:underline cursor-pointer"
                    >
                        Xóa tất cả bộ lọc
                    </button>
                </div>
            ) : viewMode === "table" ? (
                /* ── DẠNG BẢNG (TABLE VIEW) ── */
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                                <tr>
                                    <th className="py-3.5 px-4">Bài viết & Chuyên mục</th>
                                    <th className="py-3.5 px-4 hidden md:table-cell">Nguồn y khoa uy tín</th>
                                    <th className="py-3.5 px-4 text-center">Trạng thái</th>
                                    <th className="py-3.5 px-4 hidden lg:table-cell">Thời lượng</th>
                                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredArticles.map((art) => (
                                    <tr key={art.id} className="hover:bg-slate-50/70 transition-colors group">
                                        {/* Cột 1: Thông tin bài viết */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-start gap-3">
                                                <img
                                                    src={art.image}
                                                    alt={art.title}
                                                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200/80 shadow-2xs"
                                                />
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
                                                            {art.categoryName || art.category}
                                                        </span>
                                                        {art.featured && (
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center gap-1">
                                                                <Star className="w-2.5 h-2.5 fill-amber-500" />
                                                                Nổi bật
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 group-hover:text-[#00677c] transition-colors line-clamp-1 leading-snug">
                                                        {art.title}
                                                    </h4>
                                                    <p className="text-slate-500 text-xs line-clamp-1 hidden sm:block">
                                                        {art.summary}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Cột 2: Nguồn tham khảo */}
                                        <td className="py-3.5 px-4 hidden md:table-cell">
                                            <div className="space-y-0.5">
                                                <div className="font-semibold text-slate-800 flex items-center gap-1 text-xs">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                    <span>{art.source}</span>
                                                </div>
                                                <div className="text-[11px] text-slate-400 line-clamp-1">
                                                    {art.sourceDetail || "Tài liệu y khoa chính thức"}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Cột 3: Trạng thái & Toggle */}
                                        <td className="py-3.5 px-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStatus(art.id)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                                                    art.status === "published"
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                                        : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                                                }`}
                                                title="Bấm để đổi trạng thái"
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        art.status === "published"
                                                            ? "bg-emerald-500"
                                                            : "bg-slate-400"
                                                    }`}
                                                ></span>
                                                <span>{art.status === "published" ? "Hiển thị" : "Bản nháp"}</span>
                                            </button>
                                        </td>

                                        {/* Cột 4: Thời gian */}
                                        <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{art.readTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                <span>{art.date}</span>
                                            </div>
                                        </td>

                                        {/* Cột 5: Thao tác */}
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {/* Nút Xem thử */}
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewArticle(art)}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                                                    title="Xem trước bài viết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                {/* Nút Đánh dấu nổi bật */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleFeatured(art.id)}
                                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                                        art.featured
                                                            ? "text-amber-500 hover:bg-amber-50"
                                                            : "text-slate-400 hover:text-amber-500 hover:bg-amber-50/60"
                                                    }`}
                                                    title={art.featured ? "Bỏ ghim nổi bật" : "Ghim bài viết nổi bật"}
                                                >
                                                    <Star
                                                        className={`w-4 h-4 ${
                                                            art.featured ? "fill-amber-400" : ""
                                                        }`}
                                                    />
                                                </button>

                                                {/* Nút Sửa */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingArticle(art);
                                                        setFormModalOpen(true);
                                                    }}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                                                    title="Chỉnh sửa bài viết"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>

                                                {/* Nút Xóa */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setArticleToDelete(art);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                    title="Xóa bài viết"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* ── DẠNG LƯỚI CARDS (GRID VIEW) ── */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredArticles.map((art) => (
                        <div
                            key={art.id}
                            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
                        >
                            {/* Card Image */}
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={art.image}
                                    alt={art.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-teal-800 shadow-xs backdrop-blur-xs">
                                        {art.categoryName || art.category}
                                    </span>
                                    {art.featured && (
                                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1">
                                            <Star className="w-2.5 h-2.5 fill-white" />
                                            Nổi bật
                                        </span>
                                    )}
                                </div>
                                <div className="absolute top-3 right-3">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleStatus(art.id)}
                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs cursor-pointer backdrop-blur-xs ${
                                            art.status === "published"
                                                ? "bg-emerald-500/90 text-white"
                                                : "bg-slate-700/80 text-white"
                                        }`}
                                    >
                                        {art.status === "published" ? "Hiển thị" : "Bản nháp"}
                                    </button>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2 mb-1.5">
                                    <span>{art.date}</span>
                                    <span>•</span>
                                    <span>{art.readTime}</span>
                                </div>

                                <h3 className="font-bold text-slate-900 group-hover:text-[#00677c] transition-colors line-clamp-2 text-sm leading-snug mb-2">
                                    {art.title}
                                </h3>

                                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4 flex-1">
                                    {art.summary}
                                </p>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                                    <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="truncate max-w-[120px]">{art.source}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewArticle(art)}
                                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 cursor-pointer"
                                            title="Xem trước"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingArticle(art);
                                                setFormModalOpen(true);
                                            }}
                                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                            title="Sửa"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setArticleToDelete(art);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                            title="Xóa"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                MODAL THÊM / CHỈNH SỬA BÀI VIẾT (HandbookArticleFormModal)
            ═══════════════════════════════════════════════════════════════ */}
            {formModalOpen && (
                <HandbookArticleFormModal
                    isOpen={formModalOpen}
                    initialData={editingArticle}
                    onClose={() => {
                        setFormModalOpen(false);
                        setEditingArticle(null);
                    }}
                    onSave={handleSaveArticle}
                />
            )}

            {/* ═══════════════════════════════════════════════════════════════
                MODAL XEM TRƯỚC BÀI VIẾT (HandbookPreviewModal)
            ═══════════════════════════════════════════════════════════════ */}
            {previewArticle && (
                <HandbookPreviewModal
                    article={previewArticle}
                    onClose={() => setPreviewArticle(null)}
                />
            )}

            {/* ═══════════════════════════════════════════════════════════════
                MODAL XÁC NHẬN XÓA (DeleteConfirmModal)
            ═══════════════════════════════════════════════════════════════ */}
            {deleteModalOpen && articleToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-base font-bold text-slate-900">
                                Xác nhận xóa bài viết?
                            </h3>
                            <p className="text-xs text-slate-500">
                                Bài viết <span className="font-semibold text-slate-700">"{articleToDelete.title}"</span> sẽ bị gỡ bỏ khỏi cẩm nang y tế.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setArticleToDelete(null);
                                }}
                                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs sm:text-sm cursor-pointer transition-colors shadow-xs"
                            >
                                Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── COMPONENT MODAL THÊM / SỬA BÀI VIẾT ──────────────────────────
function HandbookArticleFormModal({ isOpen, initialData, onClose, onSave }) {
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
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleCategoryChange = (catId) => {
        const found = categories.find((c) => c.id === catId);
        setFormData((prev) => ({
            ...prev,
            category: catId,
            categoryName: found ? found.label : catId,
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
        onSave(formData);
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

// ─── COMPONENT MODAL XEM TRƯỚC BÀI VIẾT ──────────────────────────
function HandbookPreviewModal({ article, onClose }) {
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
                            {article.readTime} • {article.date}
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
