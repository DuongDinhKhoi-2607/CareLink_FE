import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Rating from "../../../components/Rating";
import familyApi from "../../../api/familyApi";

// 1. Danh sách 4 tiêu chí đánh giá kèm mô tả phụ tinh tế chuẩn y tế
const ratingCriteria = [
    { id: "professionalism", label: "Chuyên môn", desc: "Kỹ năng & thao tác điều dưỡng" },
    { id: "communication", label: "Giao tiếp", desc: "Thái độ ân cần, lắng nghe" },
    { id: "punctuality", label: "Đúng giờ", desc: "Có mặt đúng khung giờ đã hẹn" },
    { id: "careQuality", label: "Chất lượng chăm sóc", desc: "Chăm sóc chu đáo, tận tâm" },
];

export default function Review() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // ── Lấy bookingId từ nhiều nguồn (URL param → location.state → sessionStorage)
    const bookingIdFromParam = searchParams.get("bookingId");
    const bookingIdFromState = location?.state?.bookingId;
    const bookingIdFromSession = sessionStorage.getItem("pendingReviewBookingId");
    const bookingId = bookingIdFromParam || bookingIdFromState || bookingIdFromSession;

    // ── Thông tin booking từ location.state
    const bookingState = location?.state?.booking || null;
    const nurseName = location?.state?.nurseName || bookingState?.caregiver?.name || "Điều dưỡng CareLink";
    const nurseAvatar = location?.state?.nurseAvatar || bookingState?.caregiver?.avatar || null;
    const serviceName = location?.state?.serviceName || bookingState?.service || "Ca chăm sóc";
    const bookingDate = location?.state?.bookingDate || bookingState?.date || "";

    // ── STATE biểu mẫu đánh giá
    const [overallRating, setOverallRating] = useState(0);
    const [criteriaRatings, setCriteriaRatings] = useState({
        professionalism: 0,
        communication: 0,
        punctuality: 0,
        careQuality: 0,
    });
    const [comment, setComment] = useState("");
    const [rehire, setRehire] = useState(null);

    // ── STATE điều khiển UI
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState("error"); // "error" | "success"
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);
    const [existingReview, setExistingReview] = useState(null);

    // ── Khi mount: kiểm tra bookingId hợp lệ + check đã đánh giá chưa
    useEffect(() => {
        if (!bookingId) return;

        // Lưu vào sessionStorage để dự phòng nếu user refresh
        sessionStorage.setItem("pendingReviewBookingId", bookingId);

        // Check xem ca này đã có review chưa
        const checkExistingReview = async () => {
            try {
                const res = await familyApi.getReviewDetail(bookingId);
                const data = res?.data || res;
                if (data?.id) {
                    setAlreadyReviewed(true);
                    setExistingReview(data);
                }
            } catch {
                // 404 = chưa đánh giá => ok
            }
        };
        checkExistingReview();
    }, [bookingId]);

    // ── Cập nhật tiêu chí
    const handleCriterionChange = (criterionId, rating) => {
        setCriteriaRatings((prev) => ({ ...prev, [criterionId]: rating }));
    };

    // ── Gửi đánh giá lên backend: POST /api/v1/bookings/{bookingId}/reviews
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!bookingId) {
            setFeedbackType("error");
            setFeedbackMessage("Không tìm thấy thông tin ca chăm sóc. Vui lòng quay lại từ trang Lịch hẹn.");
            return;
        }

        if (overallRating === 0) {
            setFeedbackType("error");
            setFeedbackMessage("Vui lòng chạm vào các ngôi sao để chọn mức độ hài lòng tổng thể trước khi gửi!");
            return;
        }

        if (alreadyReviewed) {
            setFeedbackType("error");
            setFeedbackMessage("Bạn đã gửi đánh giá cho ca chăm sóc này rồi.");
            return;
        }

        setSubmitting(true);
        setFeedbackMessage("");

        try {
            const payload = {
                overallRating: Number(overallRating),
                expertiseRating: criteriaRatings.professionalism > 0 ? criteriaRatings.professionalism : null,
                communicationRating: criteriaRatings.communication > 0 ? criteriaRatings.communication : null,
                punctualityRating: criteriaRatings.punctuality > 0 ? criteriaRatings.punctuality : null,
                careQualityRating: criteriaRatings.careQuality > 0 ? criteriaRatings.careQuality : null,
                wouldRehire: rehire === "yes" ? true : rehire === "no" ? false : null,
                comment: comment.trim() || null,
            };

            await familyApi.createReview(bookingId, payload);

            // Xóa sessionStorage sau khi gửi thành công
            sessionStorage.removeItem("pendingReviewBookingId");
            setSubmitted(true);
            setFeedbackType("success");
            setFeedbackMessage("");
        } catch (err) {
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Không thể gửi đánh giá lúc này. Vui lòng thử lại.";

            // Phát hiện đã đánh giá rồi từ backend (409 Conflict)
            if (err.response?.status === 409) {
                setAlreadyReviewed(true);
                setFeedbackType("error");
                setFeedbackMessage("Bạn đã gửi đánh giá cho ca chăm sóc này rồi.");
            } else {
                setFeedbackType("error");
                setFeedbackMessage(msg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // ── Bỏ qua đánh giá
    const handleSkipReview = () => {
        sessionStorage.removeItem("pendingReviewBookingId");
        navigate("/dashboard/appointments");
    };

    // ── Màn hình không có bookingId hợp lệ
    if (!bookingId) {
        return (
            <div className="bg-[#f8fafc] py-10 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex flex-col items-center justify-center">
                <div className="max-w-md w-full mx-auto px-6 text-center flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy ca chăm sóc</h2>
                        <p className="text-sm text-slate-500 mt-2">
                            Vui lòng mở trang đánh giá từ danh sách Lịch hẹn của bạn.
                        </p>
                    </div>
                    <Link
                        to="/dashboard/appointments"
                        className="px-6 py-3 bg-[#00677c] text-white rounded-xl text-sm font-bold hover:bg-[#005566] transition-colors"
                    >
                        Quay lại Lịch hẹn
                    </Link>
                </div>
            </div>
        );
    }

    // ── Màn hình đã đánh giá rồi (từ backend hoặc state)
    if (alreadyReviewed && !submitted) {
        return (
            <div className="bg-[#f8fafc] py-10 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex flex-col items-center">
                <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 flex flex-col gap-6">
                    <div>
                        <Link to="/dashboard/appointments" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00677c] transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Quay lại Lịch hẹn
                        </Link>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-amber-200 flex flex-col items-center text-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center text-3xl">⭐</div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Bạn đã đánh giá ca này rồi</h2>
                            <p className="text-sm text-slate-500 mt-1.5">
                                Mỗi ca chăm sóc chỉ được đánh giá một lần.
                                {existingReview?.overallRating && (
                                    <span className="block font-semibold text-amber-600 mt-1">
                                        Bạn đã chấm {existingReview.overallRating}/5 sao cho ca này.
                                    </span>
                                )}
                            </p>
                        </div>
                        <Link to="/dashboard/appointments" className="px-6 py-3 bg-[#00677c] text-white rounded-xl text-sm font-bold hover:bg-[#005566] transition-colors">
                            Xem lịch hẹn của tôi
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] py-10 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex flex-col items-center">
            <div className="max-w-4xl lg:max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

                {/* Nút quay lại */}
                <div>
                    <Link
                        to="/dashboard/appointments"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00677c] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Quay lại Lịch hẹn
                    </Link>
                </div>

                {/* Header */}
                <header className="flex flex-col gap-2 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-[#102030] tracking-tight">Đánh giá dịch vụ</h1>
                    <p className="text-base text-slate-500">
                        Sự đóng góp của bạn giúp CareLink nâng cao chất lượng chuyên môn y tế cho cộng đồng.
                    </p>
                </header>

                {/* Card chi tiết ca chăm sóc */}
                <article className="p-6 sm:p-7 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                            CHI TIẾT CA CHĂM SÓC HOÀN THÀNH
                        </span>
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            ✓ Đã hoàn thành
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        {nurseAvatar ? (
                            <img
                                src={nurseAvatar}
                                alt={nurseName}
                                className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-xs"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"; }}
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                                <svg className="w-8 h-8 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                        )}
                        <div className="flex-1 flex flex-col min-w-0">
                            <h2 className="text-xl font-extrabold text-[#102030] leading-tight">{nurseName}</h2>
                            <p className="text-sm font-semibold text-[#00677c] mt-0.5">{serviceName}</p>
                            {bookingDate && (
                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                            <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                                        </svg>
                                        {bookingDate}
                                    </span>
                                </div>
                            )}
                            {bookingId && (
                                <p className="text-[11px] text-slate-400 mt-1">Mã lịch hẹn: #{bookingId}</p>
                            )}
                        </div>
                    </div>
                </article>

                {/* Form đánh giá hoặc màn cảm ơn */}
                {!submitted ? (
                    <form onSubmit={handleSubmitReview} className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-10">

                        {/* KHỐI 1: Đánh giá tổng thể */}
                        <div className="flex flex-col items-center text-center gap-3 pb-8 border-b border-slate-100">
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                Mức độ hài lòng tổng thể
                            </span>
                            <div className="pt-2">
                                <Rating value={overallRating} onChange={setOverallRating} size="lg" />
                            </div>
                            <div className="min-h-[28px] flex items-center justify-center">
                                {overallRating === 0 ? (
                                    <span className="text-sm font-medium text-slate-400 italic">
                                        Chạm vào sao để đánh giá mức độ hài lòng
                                    </span>
                                ) : (
                                    <span className="text-base font-extrabold text-[#00677c] bg-[#e6f3f5] px-4 py-1 rounded-full border border-[#00677c]/20">
                                        {overallRating === 5 && "⭐ Rất hài lòng (5/5)"}
                                        {overallRating === 4 && "⭐ Hài lòng (4/5)"}
                                        {overallRating === 3 && "⭐ Bình thường (3/5)"}
                                        {overallRating === 2 && "⭐ Chưa hài lòng (2/5)"}
                                        {overallRating === 1 && "⭐ Rất không hài lòng (1/5)"}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* KHỐI 2: Tiêu chí chi tiết */}
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">ĐÁNH GIÁ THEO TỪNG TIÊU CHÍ</h3>
                                <span className="text-xs text-slate-400">Tự chọn số sao cho từng phần</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                {ratingCriteria.map((criterion) => {
                                    const currentStar = criteriaRatings[criterion.id] || 0;
                                    return (
                                        <div
                                            key={criterion.id}
                                            className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                        >
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm sm:text-base font-bold text-[#102030]">{criterion.label}</span>
                                                <span className="text-xs text-slate-400 mt-0.5 truncate">{criterion.desc}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Rating
                                                    value={currentStar}
                                                    onChange={(val) => handleCriterionChange(criterion.id, val)}
                                                    size="sm"
                                                />
                                                <span className={`text-xs font-bold min-w-[26px] text-right ${currentStar > 0 ? "text-[#f59e0b]" : "text-slate-300"}`}>
                                                    {currentStar > 0 ? `${currentStar}/5` : ""}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* KHỐI 3: Nhận xét */}
                        <div className="flex flex-col gap-3">
                            <label htmlFor="caregiver-review-comment" className="text-sm font-bold text-[#102030]">
                                Chia sẻ trải nghiệm của bạn
                                <span className="ml-1 text-xs font-normal text-slate-400">(Tùy chọn)</span>
                            </label>
                            <textarea
                                id="caregiver-review-comment"
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Chia sẻ cảm nhận của bạn về thái độ phục vụ, tay nghề chuyên môn và sự hỗ trợ của điều dưỡng..."
                                className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:bg-white focus:border-[#00677c] focus:ring-2 focus:ring-[#00677c]/20 transition-all resize-none placeholder:text-slate-400 shadow-2xs"
                            />
                        </div>

                        {/* KHỐI 4: Có muốn thuê lại không? */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#102030]">
                                    Bạn có muốn tiếp tục thuê người chăm sóc này lần nữa không?
                                </span>
                                <span className="text-xs text-slate-400 mt-0.5">
                                    Gợi ý này giúp CareLink ưu tiên kết nối điều dưỡng quen thuộc cho gia đình bạn.
                                </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setRehire("yes")}
                                    className={`px-7 py-2.5 rounded-xl text-sm font-bold transition-all border cursor-pointer ${rehire === "yes"
                                        ? "bg-[#00677c] text-white border-[#00677c] shadow-sm scale-105"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    Có
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRehire("no")}
                                    className={`px-7 py-2.5 rounded-xl text-sm font-bold transition-all border cursor-pointer ${rehire === "no"
                                        ? "bg-slate-700 text-white border-slate-700 shadow-sm scale-105"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    Không
                                </button>
                            </div>
                        </div>

                        {/* KHỐI 5: Nút gửi */}
                        <div className="flex flex-col gap-3.5 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-base font-bold transition-all shadow-md hover:shadow-lg hover:shadow-[#00677c]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Đang gửi đánh giá…</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>
                                        <span>Gửi đánh giá</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleSkipReview}
                                disabled={submitting}
                                className="w-full py-3 text-slate-500 hover:text-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
                            >
                                Bỏ qua lúc này
                            </button>

                            {feedbackMessage && (
                                <p
                                    role="alert"
                                    className={`text-sm text-center font-semibold mt-1 ${feedbackType === "success" ? "text-emerald-600" : "text-rose-500"}`}
                                >
                                    {feedbackMessage}
                                </p>
                            )}

                            <p className="text-xs text-center text-slate-400 mt-2">
                                Đánh giá của bạn giúp duy trì sự tin cậy và minh bạch trong cộng đồng y tế CareLink.
                            </p>
                        </div>
                    </form>
                ) : (
                    /* Màn hình cảm ơn sau khi gửi thành công */
                    <div className="p-8 sm:p-14 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-6 animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>

                        <div className="flex flex-col gap-2 max-w-lg">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/70 inline-block self-center">
                                ĐÃ GỬI ĐÁNH GIÁ THÀNH CÔNG
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102030] mt-1">
                                Cảm ơn bạn đã đóng góp ý kiến!
                            </h2>
                            <p className="text-sm sm:text-base text-slate-500 leading-relaxed mt-1">
                                Ý kiến phản hồi chân thực của bạn là cơ sở quan trọng giúp{" "}
                                <strong>{nurseName}</strong> và cộng đồng y tế CareLink không ngừng nâng cao chất lượng dịch vụ.
                            </p>
                        </div>

                        {/* Tóm tắt nhanh */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-xl text-left">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">⭐</span>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Đánh giá tổng thể</p>
                                    <p className="text-sm font-extrabold text-[#00677c]">
                                        {overallRating === 5 && "Rất hài lòng (5/5 sao)"}
                                        {overallRating === 4 && "Hài lòng (4/5 sao)"}
                                        {overallRating === 3 && "Bình thường (3/5 sao)"}
                                        {overallRating === 2 && "Chưa hài lòng (2/5 sao)"}
                                        {overallRating === 1 && "Rất không hài lòng (1/5 sao)"}
                                    </p>
                                </div>
                            </div>
                            {rehire && (
                                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-50 text-[#00677c] border border-teal-200/60">
                                    {rehire === "yes" ? "Thuê lại: Có ✓" : "Thuê lại: Không"}
                                </span>
                            )}
                        </div>

                        {/* Nút hành động */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg pt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard/appointments")}
                                className="w-full min-h-[52px] py-3.5 px-5 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] whitespace-nowrap"
                            >
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                <span>Xem lịch hẹn</span>
                            </button>
                            <Link
                                to="/"
                                className="w-full min-h-[52px] py-3.5 px-5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
                            >
                                <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span>Về Trang chủ</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}