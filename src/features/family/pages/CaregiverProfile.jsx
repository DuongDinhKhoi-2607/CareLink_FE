import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import familyApi from "../../../api/familyApi";
import conversationApi from "../../../api/conversationApi";
import { MessageSquare, LogIn, UserPlus, HeartHandshake, X, ShieldAlert, CheckCircle2 } from "lucide-react";

// Dữ liệu mục xác minh
const verificationItems = [
    "CCCD gắn chip",
    "Thẻ sinh viên y khoa",
    "Chứng chỉ chuyên môn",
    "Phỏng vấn trực tiếp",
    "Hồ sơ đã xác minh",
];

// Danh sách kỹ năng mặc định nếu chưa cập nhật
const defaultSkills = [
    "Tiêm truyền",
    "Thay băng",
    "Chăm sóc người già",
    "Vật lý trị liệu",
    "Sơ cứu cơ bản",
];

// Chứng chỉ y tế
const certificates = [
    {
        name: "Chứng chỉ Điều dưỡng Cơ bản",
        provider: "ĐH Y DƯỢC TP.HCM • 2022",
    },
    {
        name: "Chứng chỉ Kỹ thuật Tiêm truyền",
        provider: "BV CHỢ RẪY • 2023",
    },
];

// Kinh nghiệm làm việc
const experiences = [
    {
        period: "HIỆN TẠI",
        current: true,
        title: "Thực tập sinh Điều dưỡng",
        organization: "Bệnh viện Chợ Rẫy TP.HCM",
        description:
            "Hỗ trợ chăm sóc bệnh nhân tại khoa Nội tổng hợp, theo dõi chỉ số sinh tồn, thực hiện y lệnh của bác sĩ và hướng dẫn phục hồi chức năng cơ bản cho bệnh nhân sau phẫu thuật.",
    },
    {
        period: "2022 - 2023",
        current: false,
        title: "Điều dưỡng gia đình (Part-time)",
        organization: "Dịch vụ Chăm sóc sức khỏe HomeCare",
        description:
            "Chăm sóc người cao tuổi bị tai biến mạch máu não tại nhà. Thực hiện thay băng, vệ sinh vết loét, và hỗ trợ các bài tập vật lý trị liệu nhẹ nhàng hằng ngày.",
    },
];

// Đánh giá từ khách hàng
const reviews = [
    {
        initials: "VH",
        name: "Vũ Hoàng",
        date: "2 tuần trước",
        color: "bg-[#102030]",
        rating: 5,
        text: "Linh rất nhiệt tình và chuyên nghiệp. Bạn đến rất đúng giờ để hỗ trợ thay băng cho bố tôi. Tay nghề rất vững và tính cách hòa nhã khiến gia đình rất yên tâm.",
    },
    {
        initials: "ML",
        name: "Mai Lan",
        date: "1 tháng trước",
        color: "bg-[#00677c]",
        rating: 5,
        text: "Kỹ năng tiêm truyền của Linh rất tốt, không gây đau cho mẹ tôi. Rất hài lòng với dịch vụ của CareLink đã giới thiệu sinh viên chất lượng như thế này.",
    },
];

// Lợi ích dịch vụ cột bên phải
const serviceBenefits = [
    "Bảo hiểm trách nhiệm đầy đủ",
    "Phản hồi nhanh (trong 15p)",
    "Sẵn sàng làm việc cuối tuần",
];

// Lịch rảnh trong tuần
const availability = [
    { day: "T2", available: true },
    { day: "T3", available: false },
    { day: "T4", available: true },
    { day: "T5", available: true },
    { day: "T6", available: false },
    { day: "T7", available: true },
    { day: "CN", available: true },
];

// Chủ đề gợi ý trao đổi
const discussionTopics = [
    "Tình trạng sức khỏe người bệnh",
    "Thời gian chăm sóc chi tiết",
    "Chi phí dự kiến và phụ cấp",
    "Thiết bị y tế cần chuẩn bị mang theo",
];

export default function CaregiverProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const caregiver = location?.state?.caregiver;
    const searchParams = new URLSearchParams(location.search);
    const queryNurseId = searchParams.get("id") || searchParams.get("nurseId");
    const nurseId = caregiver?.id || caregiver?.nurseId || queryNurseId || null;

    const [saved, setSaved] = useState(false);
    const [contacted, setContacted] = useState(false);
    const [authModal, setAuthModal] = useState({ open: false, type: "unauthenticated" });

    // Fallback ảnh online chất lượng cao, bền vững (dùng chung avatar ĐD. Nguyễn Thùy Linh)
    const avatarUrl = caregiver?.image || caregiver?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600";
    const displayName = caregiver?.name || caregiver?.fullName || "Điều dưỡng CareLink";
    const displayRole = caregiver?.role || caregiver?.title || "Nhân viên y tế CareLink";

    const handleContact = async () => {
        const token = localStorage.getItem("carelink_token");
        const rawUser = localStorage.getItem("carelink_user");
        let user = null;
        try {
            user = rawUser ? JSON.parse(rawUser) : null;
        } catch {}

        // 1. Kiểm tra nếu khách vãng lai chưa đăng nhập
        if (!token) {
            setAuthModal({ open: true, type: "unauthenticated" });
            return;
        }

        // 2. Kiểm tra nếu đang đăng nhập bằng tài khoản Điều dưỡng
        const role = user?.role?.toLowerCase();
        const roleIdNum = Number(user?.roleId);
        if (role === "nurse" || role === "caregiver" || roleIdNum === 3) {
            setAuthModal({ open: true, type: "nurse_role" });
            return;
        }

        setContacted(true);
        if (nurseId) {
            try {
                const res = await conversationApi.getOrCreateConversation({ caregiverId: nurseId });
                const convId = res?.id || res?.data?.id;
                if (convId) {
                    navigate("/dashboard/messages", { state: { conversationId: convId, caregiver } });
                    return;
                }
            } catch (err) {
                console.warn("[CareLink] Chưa mở được hội thoại API, chuyển sang giao diện chat:", err);
            }
        }
        navigate("/chat", { state: { caregiver } });
    };

    // ── STATE: Đánh giá & Tổng quan
    const [reviews, setReviews] = useState([]);
    const [reviewSummary, setReviewSummary] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [reviewsHasMore, setReviewsHasMore] = useState(false);
    const REVIEWS_PAGE_SIZE = 5;

    // ── 70. GET /api/v1/nurses/{nurseId}/reviews
    const fetchReviews = useCallback(async (page = 1) => {
        if (!nurseId) return;
        setReviewsLoading(true);
        try {
            const res = await familyApi.getNurseReviews(nurseId, {
                PageNumber: page,
                PageSize: REVIEWS_PAGE_SIZE,
            });
            const items = res?.items || res?.data?.items || (Array.isArray(res) ? res : []);
            const totalCount = res?.totalCount || res?.data?.totalCount || items.length;
            const mappedItems = items.map((r, i) => ({
                id: r.id || i,
                name: r.reviewerName || "Khách hàng CareLink",
                initials: (r.reviewerName ? r.reviewerName.charAt(0) : "K").toUpperCase(),
                date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "Gần đây",
                rating: Math.round(Number(r.overallRating || 5)),
                text: r.comment || "Dịch vụ tận tâm, chăm sóc chu đáo.",
                color: i % 2 === 0 ? "bg-[#102030]" : "bg-[#00677c]",
            }));
            if (page === 1) {
                setReviews(mappedItems);
            } else {
                setReviews((prev) => [...prev, ...mappedItems]);
            }
            setReviewsHasMore(page * REVIEWS_PAGE_SIZE < totalCount);
            setReviewsPage(page);
        } catch {
            // Reviews không load được — hiển thị empty state
        } finally {
            setReviewsLoading(false);
        }
    }, [nurseId]);

    // ── 71. GET /api/v1/nurses/{nurseId}/reviews/summary
    const fetchReviewSummary = useCallback(async () => {
        if (!nurseId) return;
        try {
            const res = await familyApi.getNurseRatingSummary(nurseId);
            const data = res?.data || res;
            if (data && typeof data === "object") {
                setReviewSummary(data);
            }
        } catch {
            // Summary không ảnh hưởng đến UI chính
        }
    }, [nurseId]);

    useEffect(() => {
        fetchReviews(1);
        fetchReviewSummary();
    }, [fetchReviews, fetchReviewSummary]);

    return (
        <div className="bg-[#f8fafc] py-8 font-sans antialiased text-[#102030]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

                {/* Nút quay lại danh sách */}
                <div>
                    <Link
                        to="/caregivers"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00677c] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Quay lại danh sách chuyên gia
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ============================================================ */}
                    {/* CỘT CHÍNH TRÁI: THÔNG TIN HỒ SƠ CHI TIẾT (8 CỘT)              */}
                    {/* ============================================================ */}
                    <section className="lg:col-span-8 flex flex-col gap-6">

                        {/* 1. Card thông tin cơ bản & Xác minh */}
                        <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-100 shadow-xs">
                                    <img
                                        src={avatarUrl}
                                        alt={displayName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600";
                                        }}
                                    />
                                </div>

                                <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102030]">
                                            {displayName}
                                        </h1>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#00677c] border border-teal-200/80">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Đã xác thực
                                        </span>
                                    </div>

                                    <p className="text-base font-semibold text-slate-500">
                                        {displayRole}
                                    </p>

                                    {/* Pills thông tin rating, địa chỉ, kinh nghiệm */}
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                                        {[
                                            {
                                                text: `${Number(reviewSummary?.averageRating ?? caregiver?.averageRating ?? caregiver?.rating ?? 4.9).toFixed(1)} (${reviewSummary?.totalReviews ?? caregiver?.totalReviews ?? caregiver?.reviewsCount ?? 128} đánh giá)`,
                                                isRating: true,
                                            },
                                            {
                                                text: caregiver?.workDistrict || caregiver?.district || "Bình Thạnh, TP. HCM",
                                                isRating: false,
                                            },
                                            {
                                                text: caregiver?.experienceYears ? `${caregiver.experienceYears} năm kinh nghiệm` : "3 năm kinh nghiệm",
                                                isRating: false,
                                            },
                                        ].map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700"
                                            >
                                                {item.isRating ? (
                                                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ) : (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00677c]" />
                                                )}
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Banner huy hiệu xác minh 5 bước */}
                            <div className="p-4 rounded-2xl bg-[#e6f3f5] border border-[#00677c33] flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#00677c]">
                                        Đã xác thực bởi CareLink
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {verificationItems.map((v) => (
                                        <div key={v} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                            <svg className="w-4 h-4 text-[#00677c] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>

                        {/* 2. Card Kỹ năng & Chứng chỉ */}
                        <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-6">
                            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                                <svg className="w-5 h-5 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.496m5.007 0a3 3 0 002.996-2.67l.803-8.032a1.5 1.5 0 00-1.493-1.648H6.19a1.5 1.5 0 00-1.493 1.648l.803 8.032a3 3 0 002.996 2.67" />
                                </svg>
                                <h2 className="text-lg font-bold text-[#102030]">Kỹ năng & Chứng chỉ</h2>
                            </div>

                            {/* Kỹ năng */}
                            <div className="flex flex-col gap-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Kỹ năng chuyên môn
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {((Array.isArray(caregiver?.skills) && caregiver.skills.length > 0) ? caregiver.skills : defaultSkills).map((skill) => {
                                        const skillName = typeof skill === "string" ? skill : (skill?.name || String(skill));
                                        return (
                                            <span
                                                key={skillName}
                                                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200/70 transition-colors"
                                            >
                                                {skillName}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Chứng chỉ y tế */}
                            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Chứng chỉ y tế
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {certificates.map((cert) => (
                                        <div
                                            key={cert.name}
                                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-[#102030]">{cert.name}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{cert.provider}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>

                        {/* 3. Card Kinh nghiệm làm việc (Timeline) */}
                        <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-6">
                            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                                <svg className="w-5 h-5 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                <h2 className="text-lg font-bold text-[#102030]">Kinh nghiệm làm việc</h2>
                            </div>

                            <div className="relative pl-6 border-l-2 border-slate-200 flex flex-col gap-6 ml-2">
                                {experiences.map((exp, idx) => (
                                    <div key={idx} className="relative flex flex-col gap-1.5">
                                        {/* Chấm tròn timeline */}
                                        <span
                                            className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${exp.current ? "bg-[#00677c] ring-4 ring-[#00677c]/20" : "bg-slate-300"
                                                }`}
                                        />

                                        <span
                                            className={`inline-block w-fit px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${exp.current ? "bg-[#e6f3f5] text-[#00677c]" : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {exp.period}
                                        </span>

                                        <h3 className="text-base font-bold text-[#102030] mt-1">{exp.title}</h3>
                                        <h4 className="text-xs font-semibold text-slate-500">{exp.organization}</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed mt-1">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </article>

                        {/* 4. Card Đánh giá từ khách hàng */}
                        <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-6">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                    <h2 className="text-lg font-bold text-[#102030]">Đánh giá từ khách hàng</h2>
                                </div>
                                <button type="button" className="text-xs font-semibold text-[#00677c] hover:underline">
                                    Xem tất cả
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {reviews.map((rev, idx) => (
                                    <blockquote
                                        key={idx}
                                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-9 h-9 rounded-full ${rev.color} text-white font-bold text-xs flex items-center justify-center shadow-xs`}
                                                >
                                                    {rev.initials}
                                                </div>
                                                <div>
                                                    <cite className="not-italic text-sm font-bold text-[#102030] block">
                                                        {rev.name}
                                                    </cite>
                                                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex text-amber-400 text-xs">
                                                {"★".repeat(rev.rating)}
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-600 italic leading-relaxed">
                                            "{rev.text}"
                                        </p>
                                    </blockquote>
                                ))}
                            </div>
                        </article>
                    </section>

                    {/* ============================================================ */}
                    {/* CỘT PHẢI: BOOKING CARD & THỜI GIAN RẢNH (4 CỘT - STICKY)      */}
                    {/* ============================================================ */}
                    <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-24">

                        {/* Box đặt lịch chính */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex flex-col gap-6">
                            <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Chi phí dịch vụ
                                </span>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-3xl font-extrabold text-[#102030]">
                                        {Number(caregiver?.hourlyRate || caregiver?.price || 180000).toLocaleString("vi-VN")}đ
                                    </span>
                                    <span className="text-xs font-semibold text-slate-400">/ giờ</span>
                                </div>
                            </div>

                            {/* Lợi ích */}
                            <ul className="flex flex-col gap-2.5">
                                {serviceBenefits.map((b) => (
                                    <li key={b} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                        <svg className="w-4 h-4 text-[#00677c] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Nhóm nút hành động */}
                            <div className="flex flex-col gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={handleContact}
                                    className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all shadow-sm ${contacted
                                        ? "bg-slate-100 text-slate-500 cursor-default"
                                        : "bg-[#00677c] text-white hover:bg-[#005263] hover:shadow-md"
                                        }`}
                                >
                                    {contacted ? "Đã gửi yêu cầu liên hệ" : "Liên hệ ngay"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSaved(!saved)}
                                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${saved
                                        ? "bg-rose-50 text-rose-600 border-rose-200"
                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    <span>{saved ? "♥" : "♡"}</span>
                                    <span>{saved ? "Đã lưu hồ sơ" : "Lưu hồ sơ"}</span>
                                </button>
                            </div>

                            <p className="text-[11px] text-center font-medium text-slate-400">
                                Không mất phí khi hủy lịch trước 24 giờ
                            </p>
                        </div>

                        {/* Box Thời gian rảnh tuần này */}
                        <div className="bg-[#e6f3f5] p-6 rounded-3xl border border-[#00677c33] flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                <h3 className="text-xs font-bold text-[#00677c] uppercase tracking-wider">
                                    Thời gian rảnh tuần này
                                </h3>
                            </div>

                            <div className="grid grid-cols-7 gap-1.5 text-center">
                                {availability.map((item) => (
                                    <div
                                        key={item.day}
                                        className="p-2 rounded-xl bg-white/80 border border-slate-200/60 flex flex-col items-center gap-1.5"
                                    >
                                        <span className="text-xs font-bold text-slate-600">{item.day}</span>
                                        <span
                                            className={`w-2 h-2 rounded-full ${item.available ? "bg-[#00677c]" : "bg-slate-300"
                                                }`}
                                            title={item.available ? "Có lịch trống" : "Bận"}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Box Chủ đề trao đổi trước khi đặt lịch */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
                            <h3 className="text-xs font-bold text-[#102030] uppercase tracking-wider">
                                Bạn có thể trao đổi trước khi đặt lịch về:
                            </h3>
                            <ul className="flex flex-col gap-2">
                                {discussionTopics.map((topic) => (
                                    <li key={topic} className="flex items-start gap-2 text-xs text-slate-600">
                                        <span className="text-[#00677c] font-bold">•</span>
                                        <span>{topic}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </aside>
                </div>
            </div>

            {/* Modal cảnh báo yêu cầu tài khoản Gia đình */}
            {authModal.open && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-[fadeIn_150ms_ease-out]"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setAuthModal((prev) => ({ ...prev, open: false }));
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative w-full max-w-[580px] overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-2xl ring-1 ring-black/5"
                    >
                        {/* Header Modal */}
                        <div className="relative border-b border-slate-100 bg-gradient-to-br from-teal-50/70 via-white to-slate-50/50 p-6 pb-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                                            authModal.type === "unauthenticated"
                                                ? "border-teal-200 bg-white text-[#00677C] shadow-sm"
                                                : "border-amber-200 bg-white text-amber-600 shadow-sm"
                                        }`}
                                    >
                                        {authModal.type === "unauthenticated" ? (
                                            <HeartHandshake className="h-6 w-6" />
                                        ) : (
                                            <ShieldAlert className="h-6 w-6" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-100/70 text-[#00677C] border border-teal-200/80 mb-1.5">
                                            Dành cho Gia đình & Khách hàng
                                        </div>
                                        <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                                            {authModal.type === "unauthenticated"
                                                ? "Đăng nhập để đặt lịch chăm sóc"
                                                : "Tài khoản hiện tại là Điều dưỡng"}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            CareLink Medical Care • Chăm sóc an tâm cho cha mẹ và người thân
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAuthModal((prev) => ({ ...prev, open: false }))}
                                    className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 space-y-4">
                            {authModal.type === "unauthenticated" ? (
                                <>
                                    <p className="text-sm leading-relaxed text-slate-700">
                                        Để liên hệ trao đổi trực tiếp, gửi đề xuất ca và đặt lịch chăm sóc với <strong>{displayName}</strong>, quý khách vui lòng đăng nhập hoặc tạo tài khoản <strong>Gia đình</strong>.
                                    </p>

                                    {/* Giá trị nổi bật */}
                                    <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                                        <div className="flex items-start gap-2.5 text-xs text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00677C] mt-0.5" />
                                            <span>100% Điều dưỡng đã xác thực lý lịch, bằng cấp & chứng chỉ chuyên môn</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-xs text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00677C] mt-0.5" />
                                            <span>Theo dõi chỉ số sinh hiệu (HA, Tim, SpO2) và bệnh án sau từng ca</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-xs text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00677C] mt-0.5" />
                                            <span>Nghiệm thu ca trực 2 chiều và chính sách bảo vệ thanh toán an toàn</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 rounded-xl border border-teal-300 bg-teal-100/90 px-4 py-3 text-xs text-teal-950 font-semibold shadow-2xs">
                                        <MessageSquare className="h-4 w-4 shrink-0 text-[#00677C]" />
                                        <span>Tạo tài khoản nhanh chóng chỉ mất 30 giây để tìm người chăm sóc phù hợp.</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm leading-relaxed text-slate-600">
                                        Bạn đang đăng nhập bằng tài khoản <strong>Điều dưỡng</strong>. Để đặt lịch chăm sóc cho người thân, vui lòng chuyển sang hoặc tạo tài khoản <strong>Gia đình</strong>.
                                    </p>
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 leading-relaxed">
                                        Bạn có thể chuyển về trang tổng quan dành cho Điều dưỡng hoặc đăng xuất để đăng nhập tài khoản Khách hàng.
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setAuthModal((prev) => ({ ...prev, open: false }))}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                            >
                                {authModal.type === "unauthenticated" ? "Để sau" : "Đóng"}
                            </button>

                            {authModal.type === "unauthenticated" ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#00677c] transition"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Đăng nhập
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            navigate("/register?role=family");
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00677c] text-xs font-bold text-white shadow-sm hover:bg-[#065363] transition"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Đăng ký Gia đình
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            navigate("/caregiver/dashboard");
                                        }}
                                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                    >
                                        Về trang Điều dưỡng
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            localStorage.removeItem("carelink_token");
                                            localStorage.removeItem("carelink_user");
                                            navigate("/login");
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
                                    >
                                        Đăng xuất tài khoản
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}