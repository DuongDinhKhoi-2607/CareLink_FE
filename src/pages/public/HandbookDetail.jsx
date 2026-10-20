import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import handbookApi from "../../api/handbookApi";
import { articles as fallbackArticles, categories } from "../../data/handbookData";
import {
    ArrowLeft,
    Clock,
    Calendar,
    ShieldCheck,
    Share2,
    BookOpen,
    AlertTriangle,
    CheckCircle2,
    HeartHandshake,
    Activity,
    Stethoscope,
    Baby,
    Sparkles,
    Copy,
    ChevronRight,
    ExternalLink,
} from "lucide-react";

export default function HandbookDetail() {
    const { idOrSlug } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    // Kiểm tra quyền Admin để cho phép xem trước bài nháp
    const userRole = localStorage.getItem("carelink_role");
    const isAdmin = userRole === "admin" || userRole === "Admin";

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        // API 88: GET /api/v1/handbook/{idOrSlug}
        handbookApi
            .getArticleDetail(idOrSlug)
            .then((res) => {
                if (!isMounted) return;
                const data = res?.data || res;
                if (data && typeof data === "object") {
                    setArticle(data);
                } else {
                    findFallback();
                }
            })
            .catch((err) => {
                console.warn("[CareLink] Tải bài viết cẩm nang từ API thất bại, chuyển fallback cục bộ:", err);
                if (isMounted) {
                    findFallback();
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        function findFallback() {
            const found = fallbackArticles.find(
                (a) =>
                    a.slug === idOrSlug ||
                    String(a.id) === String(idOrSlug) ||
                    (a.title && a.title.toLowerCase().includes(String(idOrSlug).toLowerCase()))
            );
            if (found) {
                setArticle(found);
            } else {
                setError("Không tìm thấy bài viết cẩm nang y tế này hoặc bài viết đã bị gỡ bỏ.");
            }
        }

        return () => {
            isMounted = false;
        };
    }, [idOrSlug]);

    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    // Bài viết liên quan cùng chuyên mục
    const relatedArticles = article
        ? fallbackArticles
              .filter((a) => a.category === article.category && String(a.id) !== String(article.id))
              .slice(0, 3)
        : [];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] py-16 px-4">
                <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-10 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-96 bg-slate-200 rounded-3xl"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-lg">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy bài viết</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                        {error || "Bài viết bạn đang tìm không tồn tại hoặc đã bị ẩn khỏi hệ thống."}
                    </p>
                    <Link
                        to="/handbook"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00677c] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#005566] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Quay lại Cẩm nang y tế</span>
                    </Link>
                </div>
            </div>
        );
    }

    // Kiểm tra trạng thái xuất bản: Nếu là bản nháp mà không phải Admin, chặn hiển thị theo yêu cầu nghiệp vụ
    const isDraft = article.status === "draft" || article.isPublished === false;
    if (isDraft && !isAdmin) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-lg">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4 border border-slate-200">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Bài viết chưa xuất bản</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                        Nội dung này hiện đang ở trạng thái bản nháp hoặc đang được hội đồng y khoa kiểm duyệt. Vui lòng quay lại sau khi bài viết được xuất bản chính thức.
                    </p>
                    <Link
                        to="/handbook"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00677c] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#005566] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Xem các bài viết đã xuất bản</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 pb-24">
            {/* Thanh thông báo chế độ xem trước dành cho Admin */}
            {isDraft && isAdmin && (
                <div className="w-full bg-amber-500 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 shadow-md flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Chế độ Xem trước Quản trị viên: Bài viết này đang ở trạng thái Bản nháp (chưa xuất bản ra ngoài)</span>
                </div>
            )}

            {/* Breadcrumb Header */}
            <div className="w-full bg-white border-b border-slate-200/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2 min-w-0">
                        <Link to="/" className="hover:text-[#00677c] transition-colors shrink-0">
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <Link to="/handbook" className="hover:text-[#00677c] transition-colors shrink-0">
                            Cẩm nang y tế
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-slate-800 truncate">
                            {article.categoryName || article.category}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                    >
                        {copied ? (
                            <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Đã chép link!</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Chia sẻ</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Article Container */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8">
                {/* Header Meta */}
                <header className="space-y-4">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#00677c] border border-teal-200/70">
                            {article.categoryName || article.category}
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Đã kiểm duyệt chuyên môn y khoa
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                        {article.title}
                    </h1>

                    {/* Metadata Hàng ngang */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80 text-xs sm:text-sm text-slate-500">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#00677c] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                                CL
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">
                                    Nguồn tham khảo: {article.source || "CareLink Y tế"}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {article.sourceDetail || "Tổng hợp từ các nghiên cứu và phác đồ lâm sàng"}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {article.date || "Cập nhật mới nhất"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {article.readTime || "5 phút đọc"}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Sơ lược tóm tắt (Lead Box) */}
                {article.summary && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-50/80 via-white to-sky-50/60 border border-teal-100 text-slate-700 text-sm sm:text-base leading-relaxed font-medium shadow-2xs">
                        <strong className="text-[#00677c] font-bold block mb-1">Tóm tắt nội dung:</strong>
                        {article.summary}
                    </div>
                )}

                {/* Ảnh bìa bài viết */}
                {article.image && (
                    <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-72 sm:h-[420px] object-cover"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200";
                            }}
                        />
                    </div>
                )}

                {/* Nội dung bài viết chính (HTML) */}
                <div
                    className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-5
                    [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:pt-4
                    [&>p]:leading-relaxed [&>p]:text-slate-600
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5"
                    dangerouslySetInnerHTML={{ __html: article.content || "<p>Nội dung đang được cập nhật...</p>" }}
                />

                {/* Tài liệu tham khảo minh bạch */}
                {article.references && article.references.length > 0 && (
                    <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#00677c]" />
                            Tài liệu tham khảo chuyên môn uy tín
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            {article.references.map((ref, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-slate-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00677c]" />
                                    {ref.url ? (
                                        <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#00677c] hover:underline font-medium flex items-center gap-1"
                                        >
                                            <span>{ref.text || ref.url}</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <span>{ref.text}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Cảnh báo Y khoa bắt buộc (Medical Disclaimer) */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3 leading-relaxed">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <strong className="font-bold block mb-0.5 text-amber-950">Lưu ý miễn trừ trách nhiệm y khoa:</strong>
                        Các bài viết trên Cẩm nang CareLink được biên soạn nhằm mục đích chia sẻ kiến thức phổ thông và hướng dẫn chăm sóc cơ bản. Thông tin này không thay thế cho chẩn đoán y khoa, phác đồ điều trị hay chỉ định của bác sĩ chuyên khoa. Khi xuất hiện các dấu hiệu bất thường cấp tính, gia đình cần đưa người bệnh đến ngay cơ sở y tế gần nhất.
                    </div>
                </div>

                {/* CTA Đặt lịch chăm sóc y tế tại nhà */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 to-[#00677c] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="space-y-1.5 text-center sm:text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
                            Chăm sóc chuẩn y khoa CareLink
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                            Bạn cần điều dưỡng hỗ trợ chăm sóc tại nhà?
                        </h3>
                        <p className="text-xs sm:text-sm text-teal-100 max-w-lg">
                            Đội ngũ Cử nhân Điều dưỡng và Sinh viên Y khoa được đào tạo bài bản, sẵn sàng đồng hành cùng gia đình bạn 24/7.
                        </p>
                    </div>

                    <Link
                        to="/caregivers"
                        className="px-6 py-3.5 bg-white hover:bg-teal-50 text-[#00677c] font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 hover:scale-105"
                    >
                        Đặt lịch điều dưỡng ngay
                    </Link>
                </div>

                {/* Bài viết liên quan */}
                {relatedArticles.length > 0 && (
                    <div className="pt-8 space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Bài viết cùng chuyên mục</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {relatedArticles.map((rel) => (
                                <Link
                                    key={rel.id}
                                    to={`/handbook/${rel.slug || rel.id}`}
                                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        <img
                                            src={rel.image}
                                            alt={rel.title}
                                            className="w-full h-32 object-cover rounded-xl mb-3"
                                        />
                                        <span className="text-[10px] font-bold text-[#00677c] uppercase">
                                            {rel.categoryName}
                                        </span>
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 line-clamp-2 group-hover:text-[#00677c] transition-colors">
                                            {rel.title}
                                        </h4>
                                    </div>
                                    <span className="text-[11px] text-slate-400 mt-3 block">{rel.readTime}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}
