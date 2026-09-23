import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { categories, articles, faqs } from "../../data/handbookData";

// ─── Icon map cho danh mục (giữ SVG ở component, data thuần ở file riêng) ───
const categoryIcons = {
    all: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
    ),
    elderly: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    ),
    "post-surgery": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        </svg>
    ),
    therapy: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    ),
    nutrition: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
    ),
    "first-aid": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

// ─── Source icon nhỏ dùng chung ───
const SourceIcon = () => (
    <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

// ─── Theme màu & style riêng cho từng danh mục để không trùng lặp và dịu mắt ───
const categoryStyles = {
    all: {
        badge: "bg-slate-100 text-slate-800 border-slate-200/90",
        pill: "bg-white/95 text-slate-800 border-slate-200/80 shadow-xs",
        iconColor: "text-slate-600",
    },
    elderly: {
        badge: "bg-amber-50 text-amber-900 border-amber-200/90",
        pill: "bg-amber-50/95 text-amber-950 border-amber-200/80 shadow-xs",
        iconColor: "text-amber-700",
    },
    nutrition: {
        badge: "bg-orange-50 text-orange-950 border-orange-200/90",
        pill: "bg-orange-50/95 text-orange-950 border-orange-200/80 shadow-xs",
        iconColor: "text-orange-700",
    },
    "post-surgery": {
        badge: "bg-indigo-50 text-indigo-950 border-indigo-200/90",
        pill: "bg-indigo-50/95 text-indigo-950 border-indigo-200/80 shadow-xs",
        iconColor: "text-indigo-700",
    },
    therapy: {
        badge: "bg-sky-50 text-sky-950 border-sky-200/90",
        pill: "bg-sky-50/95 text-sky-950 border-sky-200/80 shadow-xs",
        iconColor: "text-sky-700",
    },
    "first-aid": {
        badge: "bg-rose-50 text-rose-950 border-rose-200/90",
        pill: "bg-rose-50/95 text-rose-950 border-rose-200/80 shadow-xs",
        iconColor: "text-rose-700",
    },
};

// ─── Badge "Đã kiểm duyệt y khoa" với icon Khiên y tế chuyên môn ───
const ReviewedBadge = ({ variant = "default" }) => {
    if (variant === "card") {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-emerald-800 text-[10px] font-extrabold border border-emerald-200/80 shadow-xs backdrop-blur-sm">
                <svg className="w-3 h-3 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Đã kiểm duyệt</span>
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-bold border border-emerald-500/25 shadow-2xs">
            <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM13.707 8.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Đã kiểm duyệt y khoa</span>
        </span>
    );
};

export default function MedicalHandbook() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeArticleModal, setActiveArticleModal] = useState(null);
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    const filteredArticles = useMemo(() => {
        return articles.filter((article) => {
            const matchesCategory =
                selectedCategory === "all" || article.category === selectedCategory;
            const matchesSearch =
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const featuredArticle = articles.find((a) => a.featured);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
            {/* ═══ 1. HERO BANNER ═══ */}
            <section className="relative bg-gradient-to-b from-teal-900 via-[#004857] to-[#00677c] text-white py-16 lg:py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-teal-200 tracking-wide uppercase shadow-sm">
                        <svg className="w-4 h-4 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Kiến thức y khoa thường thức CareLink
                    </span>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl leading-[1.2]">
                        Cẩm Nang Y Tế & Chăm Sóc Sức Khỏe Gia Đình
                    </h1>

                    <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl leading-relaxed">
                        Tập hợp kiến thức chuẩn y khoa từ các nguồn uy tín tại Việt Nam. Cùng bạn lắng nghe, thấu hiểu và chăm sóc người thân yêu trọn vẹn mỗi ngày.
                    </p>

                    {/* Thanh tìm kiếm */}
                    <div className="w-full max-w-2xl mt-4 relative">
                        <div className="relative flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl bg-white text-slate-700 overflow-hidden border border-white/30 focus-within:ring-4 focus-within:ring-teal-400/40 transition-all duration-300">
                            <span className="pl-5 text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm bài viết theo bệnh lý, triệu chứng, chế độ ăn..."
                                className="w-full py-4 pl-3 pr-5 text-sm sm:text-base outline-none bg-transparent placeholder-slate-400 font-medium"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="pr-4 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ DISCLAIMER Y KHOA ═══ */}
            <div className="bg-amber-50/80 border-b border-amber-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm text-amber-900 font-medium text-center flex-wrap">
                    <svg className="w-4 h-4 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>Nội dung được tổng hợp từ các nguồn y khoa uy tín, mang tính tham khảo. Vui lòng tham vấn bác sĩ trước khi áp dụng.</span>
                </div>
            </div>

            {/* ═══ 2. THANH DANH MỤC ═══ */}
            <nav className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
                    {categories.map((cat) => {
                        const active = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2 cursor-pointer border ${active
                                    ? "bg-[#00677c] text-white border-[#00677c] shadow-lg shadow-[#00677c]/25 transform scale-105"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300"
                                    }`}
                            >
                                <span className={active ? "text-white" : "text-slate-500"}>{categoryIcons[cat.id]}</span>
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* ═══ 3. THÂN TRANG ═══ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">

                {/* 3.1 BÀI VIẾT TIÊU ĐIỂM */}
                {selectedCategory === "all" && !searchQuery && featuredArticle && (
                    <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-pointer" onClick={() => setActiveArticleModal(featuredArticle)}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                            <div className="lg:col-span-7 h-72 lg:h-auto relative overflow-hidden">
                                <img
                                    src={featuredArticle.image}
                                    alt={featuredArticle.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute top-4 left-4 bg-[#00677c] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm border border-white/20">
                                    <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Chuyên mục khuyên đọc
                                </div>
                            </div>

                            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 bg-white">
                                <div className="flex flex-col gap-5 sm:gap-6">
                                    <div className="flex items-center gap-2.5 text-xs font-bold">
                                        <span className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 shadow-2xs ${categoryStyles[featuredArticle.category]?.badge || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                            <span className={categoryStyles[featuredArticle.category]?.iconColor}>
                                                {categoryIcons[featuredArticle.category]}
                                            </span>
                                            <span>{featuredArticle.categoryName}</span>
                                        </span>
                                        {featuredArticle.reviewed && <ReviewedBadge />}
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002045] group-hover:text-[#00677c] transition-colors leading-snug">
                                        {featuredArticle.title}
                                    </h2>

                                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                                        {featuredArticle.summary}
                                        <span className="inline-flex items-center gap-1.5 ml-2.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-bold align-middle whitespace-nowrap border border-slate-200/80 shadow-2xs">
                                            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{featuredArticle.readTime}</span>
                                        </span>
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-2">
                                    {/* Nguồn tham khảo thay cho tác giả giả */}
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center">
                                            <SourceIcon />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#002045]">
                                                {featuredArticle.source}
                                            </span>
                                            <span className="text-[11px] font-medium text-slate-500 truncate max-w-[240px]">
                                                {featuredArticle.sourceDetail} • {featuredArticle.date}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00677c] group-hover:text-teal-700 group-hover:translate-x-1 transition-all cursor-pointer bg-teal-50 px-4 py-2 rounded-xl"
                                    >
                                        Đọc ngay
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 3.2 LƯỚI BÀI VIẾT */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-end justify-between border-b border-slate-200/60 pb-4">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-[#002045]">
                            {selectedCategory === "all" ? "Tất cả bài viết y khoa" : `Chuyên mục: ${categories.find(c => c.id === selectedCategory)?.label}`}
                        </h3>
                        <span className="text-xs sm:text-sm text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">
                            Hiển thị {filteredArticles.length} bài viết
                        </span>
                    </div>

                    {filteredArticles.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-2">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <p className="text-lg font-bold text-slate-700">Không tìm thấy bài viết phù hợp</p>
                            <p className="text-sm text-slate-500 font-medium max-w-sm">Hãy thử tìm kiếm bằng từ khóa khác hoặc chọn chuyên mục "Tất cả bài viết".</p>
                            <button
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setSearchQuery("");
                                }}
                                className="mt-4 px-6 py-2.5 bg-[#00677c] text-white rounded-xl text-sm font-bold hover:bg-[#005264] transition-colors shadow-md"
                            >
                                Xem tất cả bài viết
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredArticles.map((article) => (
                                <article
                                    key={article.id}
                                    onClick={() => setActiveArticleModal(article)}
                                    className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_-5px_rgba(0,103,124,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                                >
                                    {/* Ảnh đại diện */}
                                    <div className="h-52 relative overflow-hidden bg-slate-100">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        {/* Category pill */}
                                        <span className={`absolute top-4 left-4 px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold shadow-sm border backdrop-blur-md flex items-center gap-1.5 ${categoryStyles[article.category]?.pill || 'bg-white/95 text-slate-800 border-white/60'}`}>
                                            <span className={categoryStyles[article.category]?.iconColor}>
                                                {categoryIcons[article.category]}
                                            </span>
                                            <span>{article.categoryName}</span>
                                        </span>
                                        {/* Badge kiểm duyệt */}
                                        {article.reviewed && (
                                            <span className="absolute top-4 right-4">
                                                <ReviewedBadge variant="card" />
                                            </span>
                                        )}
                                    </div>

                                    {/* Nội dung tóm tắt */}
                                    <div className="p-6 flex-1 flex flex-col justify-between gap-5 bg-white">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                                <span>{article.date}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {article.readTime}
                                                </span>
                                            </div>

                                            <h4 className="text-lg font-extrabold text-[#002045] group-hover:text-[#00677c] transition-colors leading-snug line-clamp-2">
                                                {article.title}
                                            </h4>

                                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium">
                                                {article.summary}
                                            </p>
                                        </div>

                                        {/* Nguồn thay cho tác giả */}
                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200/50 flex items-center justify-center">
                                                    <SourceIcon />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                                                    {article.source}
                                                </span>
                                            </div>

                                            <button className="text-xs font-extrabold text-[#00677c] flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                Chi tiết
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* ═══ 4. FAQ ═══ */}
                <section className="bg-gradient-to-br from-[#fbf8f3] via-[#f7f2ea] to-[#efe7da] rounded-[2rem] p-8 sm:p-12 border border-[#e8dfd1] shadow-[0_4px_24px_-8px_rgba(60,40,20,0.06)] flex flex-col gap-10">
                    <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#ede2d1] text-[#7a5833] text-xs font-extrabold uppercase tracking-widest rounded-full w-fit mx-auto border border-[#dfd2bd] shadow-2xs">
                            <svg className="w-3.5 h-3.5 text-[#966d3b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                            Hỏi đáp y tế
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2a221b] tracking-tight">
                            Câu hỏi thường gặp từ các gia đình
                        </h3>
                        <p className="text-sm sm:text-base text-[#6f6254] font-medium max-w-lg mx-auto">
                            Giải đáp những thắc mắc phổ biến giúp người nhà an tâm hơn khi chăm sóc và lựa chọn dịch vụ y tế.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto w-full flex flex-col gap-3.5">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    className={`bg-white/95 backdrop-blur-xs rounded-2xl shadow-xs overflow-hidden transition-all duration-300 border ${isOpen
                                        ? "border-[#00677c]/40 shadow-md ring-2 ring-[#00677c]/10 bg-white"
                                        : "border-[#e5dcce] hover:border-[#d5c6b2]"
                                        }`}
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#2a221b] hover:text-[#00677c] transition-colors cursor-pointer outline-none"
                                    >
                                        <span className="pr-4 leading-snug">{faq.q}</span>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-[#00677c] text-white rotate-180 shadow-xs' : 'bg-[#f4ede2] text-[#7a6a57]'}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </span>
                                    </button>

                                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                        <div className="overflow-hidden">
                                            <div className="px-6 pb-6 text-sm text-[#4d4233] leading-relaxed font-medium border-t border-[#ede4d6] pt-4 bg-[#fdfbf8]/60">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ═══ 5. CTA BANNER ═══ */}
                <section className="relative overflow-hidden bg-gradient-to-r from-[#003846] via-[#004857] to-[#00677c] rounded-[2rem] p-8 sm:p-14 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl border border-[#00677c]/50">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

                    <div className="relative flex flex-col gap-4 text-center lg:text-left max-w-2xl z-10">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-teal-200 uppercase tracking-widest w-fit mx-auto lg:mx-0 backdrop-blur-sm border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                            Hỗ trợ trực tuyến 24/7
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                            Gia đình cần điều dưỡng chuyên môn <span className="text-teal-300">chăm sóc tại nhà?</span>
                        </h3>
                        <p className="text-teal-50 text-base sm:text-lg opacity-90 font-medium leading-relaxed">
                            Đội ngũ điều dưỡng và sinh viên Y khoa CareLink đã được kiểm định chứng chỉ và sẵn sàng hỗ trợ tận tâm.
                        </p>
                    </div>

                    <div className="relative flex flex-col sm:flex-row items-center gap-4 shrink-0 z-10 w-full lg:w-auto">
                        <Link
                            to="/family"
                            className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-white text-[#00677c] font-extrabold text-sm rounded-xl transition-all shadow-lg text-center"
                        >
                            <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                            <span className="relative">Tìm Điều dưỡng ngay</span>
                        </Link>
                        <a
                            href="tel:19001234"
                            className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-extrabold text-sm rounded-xl transition-all text-center flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                            Hotline: 1900 1234
                        </a>
                    </div>
                </section>
            </main>

            {/* ═══ 6. MODAL XEM BÀI VIẾT ═══ */}
            {activeArticleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="px-6 py-4.5 sm:px-8 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-50/70 via-white to-slate-50/40 z-10 shadow-2xs">
                            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                                {/* Category Tag with icon */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border shadow-2xs ${categoryStyles[activeArticleModal.category]?.badge || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                    <span className={categoryStyles[activeArticleModal.category]?.iconColor}>
                                        {categoryIcons[activeArticleModal.category]}
                                    </span>
                                    <span>{activeArticleModal.categoryName}</span>
                                </span>

                                {/* Divider dot */}
                                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />

                                {/* Medical Verification Seal */}
                                {activeArticleModal.reviewed && <ReviewedBadge />}

                                {/* Read time badge */}
                                <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-white px-2.5 py-1 rounded-md border border-slate-200/70 shadow-2xs">
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{activeArticleModal.readTime}</span>
                                </span>
                            </div>

                            <button
                                onClick={() => setActiveArticleModal(null)}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs hover:rotate-90 duration-200"
                                title="Đóng bài viết"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Thân bài viết cuộn */}
                        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 no-scrollbar bg-slate-50/50">
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002045] leading-tight">
                                {activeArticleModal.title}
                            </h2>

                            {/* Nguồn + ngày */}
                            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-slate-200/60">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-teal-50 border-2 border-teal-200/50 flex items-center justify-center">
                                        <SourceIcon />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-extrabold text-[#002045]">Nguồn: {activeArticleModal.source}</span>
                                        <span className="text-xs font-medium text-slate-500">{activeArticleModal.sourceDetail}</span>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-3 text-sm text-slate-400 font-semibold ml-auto bg-white px-3 py-1.5 rounded-lg border border-slate-200/60">
                                    <span>{activeArticleModal.date}</span>
                                    <span>•</span>
                                    <span>{activeArticleModal.readTime}</span>
                                </div>
                            </div>

                            {/* Ảnh minh hoạ */}
                            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 bg-white p-2">
                                <img
                                    src={activeArticleModal.image}
                                    alt={activeArticleModal.title}
                                    className="w-full h-64 sm:h-96 object-cover rounded-xl"
                                />
                            </div>

                            {/* Nội dung HTML */}
                            <div
                                className="text-sm sm:text-base text-slate-700 leading-[1.9] space-y-5 
                                [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:font-extrabold [&>h3]:text-[#002045] [&>h3]:pt-4 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul>li]:pl-1
                                [&>p]:font-medium [&>p]:text-slate-600"
                                dangerouslySetInnerHTML={{ __html: activeArticleModal.content }}
                            />

                            {/* ═══ TÀI LIỆU THAM KHẢO ═══ */}
                            {activeArticleModal.references && activeArticleModal.references.length > 0 && (
                                <div className="mt-6 bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl p-6 sm:p-8 border border-slate-200/60">
                                    <h4 className="text-sm font-extrabold text-[#002045] flex items-center gap-2 mb-5">
                                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                        </svg>
                                        Tài liệu tham khảo
                                    </h4>
                                    <ul className="space-y-3">
                                        {activeArticleModal.references.map((ref, i) => (
                                            <li key={i} className="flex items-start gap-3 group/ref">
                                                <span className="text-teal-600 font-extrabold text-xs mt-0.5 shrink-0 bg-teal-50 w-6 h-6 rounded-md flex items-center justify-center border border-teal-200/50">{i + 1}</span>
                                                <a
                                                    href={ref.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs sm:text-sm text-slate-600 font-medium hover:text-[#00677c] transition-colors group-hover/ref:underline underline-offset-2 flex items-center gap-1.5"
                                                >
                                                    <span>{ref.text}</span>
                                                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover/ref:text-[#00677c] shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Disclaimer nhỏ */}
                            <div className="flex items-start gap-2.5 bg-amber-50/70 rounded-xl p-4 border border-amber-200/50 text-xs text-amber-800 font-medium">
                                <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                                </svg>
                                <span>Bài viết được tổng hợp từ các nguồn y khoa uy tín tại Việt Nam, mang tính chất tham khảo và giáo dục sức khỏe. Không thay thế cho việc thăm khám và tư vấn trực tiếp từ bác sĩ chuyên khoa.</span>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-5 sm:p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                            <span className="text-xs font-bold text-slate-400 hidden sm:block flex-1">
                                Chia sẻ kiến thức vì sức khỏe cộng đồng
                            </span>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                <button
                                    onClick={() => setActiveArticleModal(null)}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                                >
                                    Đóng bài viết
                                </button>
                                <Link
                                    to="/family"
                                    className="px-6 py-3 bg-[#00677c] text-white text-sm font-bold rounded-xl hover:bg-[#005264] hover:shadow-lg hover:shadow-teal-900/20 transition-all"
                                >
                                    Đặt ca chăm sóc ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Keyframes cho hiệu ứng Shine */}
            <style>{`
                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}