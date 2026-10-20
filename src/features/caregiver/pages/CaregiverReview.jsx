import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate, Link } from "react-router-dom";
import Rating from "../../../components/Rating";
import caregiverApi from "../../../api/caregiverApi";

/* =========================================================
   REVIEW CRITERIA
========================================================= */
const CRITERIA = [
    {
        id: "respect",
        label: "Thái độ tôn trọng",
        description:
            "Gia đình đối xử lịch sự và tôn trọng bạn trong suốt ca chăm sóc.",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s-7-4.35-7-11a4 4 0 017-2.65A4 4 0 0119 10c0 6.65-7 11-7 11z"
                />
            </svg>
        ),
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100",
        activeBorder: "border-violet-200",
        activeBg: "bg-violet-50/60",
    },
    {
        id: "safety",
        label: "Môi trường an toàn",
        description:
            "Không gian chăm sóc gọn gàng, sạch sẽ và hạn chế các nguy cơ mất an toàn.",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 12 2 2 4-4"
                />
            </svg>
        ),
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        activeBorder: "border-emerald-200",
        activeBg: "bg-emerald-50/60",
    },
    {
        id: "supplies",
        label: "Vật tư chăm sóc",
        description:
            "Gia đình chuẩn bị đầy đủ thuốc, thiết bị y tế và vật dụng cần thiết.",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 3h8l1 4H7l1-4zM6 7h12l1 14H5L6 7z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 12h4m-2-2v4"
                />
            </svg>
        ),
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        activeBorder: "border-blue-200",
        activeBg: "bg-blue-50/60",
    },
    {
        id: "payment",
        label: "Phối hợp & thanh toán",
        description:
            "Gia đình phối hợp tốt, thực hiện thanh toán đúng số tiền và thời điểm.",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
            >
                <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18m-13 5h3"
                />
            </svg>
        ),
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        activeBorder: "border-amber-200",
        activeBg: "bg-amber-50/60",
    },
];

/* =========================================================
   ICON COMPONENTS
========================================================= */

function CheckIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 12 4 4L19 6"
            />
        </svg>
    );
}

function StarIcon({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M12 2.8l2.83 5.74 6.33.92-4.58 4.47 1.08 6.31L12 17.26l-5.66 2.98 1.08-6.31L2.84 9.46l6.33-.92L12 2.8z" />
        </svg>
    );
}

/* =========================================================
   COMPLETED SESSION CARD
========================================================= */

function SessionCard({ family, service, date, duration }) {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-slate-100/80 blur-2xl" />

            <div className="relative p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-lg font-bold text-slate-600">
                        {family.charAt(0)}
                    </div>

                    {/* Family information */}
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-bold text-slate-800">
                                {family}
                            </h2>

                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                <CheckIcon className="h-3 w-3" />
                                Hoàn thành
                            </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            {service}
                        </p>
                    </div>
                </div>

                {/* Session details */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50/80 p-3">
                        <p className="text-[11px] font-medium text-slate-400">
                            Ngày chăm sóc
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                            {date}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50/80 p-3">
                        <p className="text-[11px] font-medium text-slate-400">
                            Thời lượng
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                            {duration}
                        </p>
                    </div>

                    <div className="col-span-2 rounded-xl bg-emerald-50/70 p-3 sm:col-span-1">
                        <p className="text-[11px] font-medium text-emerald-700/70">
                            Trạng thái
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                            <CheckIcon className="h-4 w-4" />
                            Đã hoàn tất
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   REVIEW CRITERION CARD
========================================================= */

function CriterionBlock({ criterion, value, onChange }) {
    const isRated = value > 0;

    const ratingLabels = {
        1: "Rất chưa hài lòng",
        2: "Chưa hài lòng",
        3: "Bình thường",
        4: "Hài lòng",
        5: "Rất hài lòng",
    };

    return (
        <article
            className={`
                group relative flex h-full flex-col rounded-2xl border bg-white p-4
                transition-all duration-200 sm:p-5
                ${isRated
                    ? `${criterion.activeBorder} shadow-sm`
                    : `${criterion.border} hover:border-slate-300 hover:shadow-md`
                }
            `}
        >
            {/* Small top accent */}
            <div
                className={`
                    absolute left-4 right-4 top-0 h-[2px] rounded-full
                    transition-opacity duration-200
                    ${criterion.bg}
                    ${isRated ? "opacity-100" : "opacity-0 group-hover:opacity-70"}
                `}
            />

            {/* Criterion heading */}
            <div className="flex items-start gap-3">
                <div
                    className={`
                        flex h-10 w-10 shrink-0 items-center justify-center
                        rounded-xl transition-transform duration-200
                        ${criterion.bg} ${criterion.color}
                        ${isRated ? "scale-105" : "group-hover:scale-105"}
                    `}
                >
                    {criterion.icon}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="text-sm font-bold leading-5 text-slate-800">
                        {criterion.label}
                    </h3>

                    <p className="mt-1.5 text-xs leading-[1.65] text-slate-500">
                        {criterion.description}
                    </p>
                </div>
            </div>

            {/* Rating area */}
            <div
                className={`
                    mt-5 rounded-xl border p-3 transition-colors duration-200
                    ${isRated
                        ? `${criterion.activeBg} ${criterion.activeBorder}`
                        : "border-slate-100 bg-slate-50/70"
                    }
                `}
            >
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Mức đánh giá
                    </span>

                    {isRated && (
                        <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold ${criterion.color}`}
                        >
                            <StarIcon className="h-3.5 w-3.5" />
                            {ratingLabels[value]}
                        </span>
                    )}
                </div>

                <div className="mt-2">
                    <Rating
                        id={`rating-${criterion.id}`}
                        value={value}
                        onChange={onChange}
                        size="md"
                        showLabel
                    />
                </div>
            </div>

            {/* Bottom status */}
            <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                    {isRated ? "Đã chọn mức đánh giá" : "Chọn từ 1 đến 5 sao"}
                </span>

                {isRated && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <CheckIcon className="h-3 w-3" />
                    </span>
                )}
            </div>
        </article>
    );
}

/* =========================================================
   OVERALL RATING SUMMARY
========================================================= */

function OverallRating({ ratings, averageRating, ratedCount }) {
    const progress = (ratedCount / CRITERIA.length) * 100;

    return (
        <section className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)]">
                {/* Score */}
                <div className="flex flex-col items-center justify-center border-b border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50/50 px-5 py-6 text-center sm:border-b-0 sm:border-r">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-white text-amber-500 shadow-sm">
                        <StarIcon className="h-6 w-6" />
                    </div>

                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-700/70">
                        Điểm trung bình
                    </p>

                    <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight text-slate-800">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm font-medium text-slate-400">
                            / 5
                        </span>
                    </div>

                    <Rating
                        value={Math.round(averageRating)}
                        readonly
                        size="sm"
                    />
                </div>

                {/* Progress and description */}
                <div className="flex flex-col justify-center p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-bold text-slate-800">
                            Tổng quan đánh giá
                        </h3>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {ratedCount}/{CRITERIA.length} tiêu chí
                        </span>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {ratedCount === 0
                            ? "Bắt đầu chấm điểm để xem kết quả đánh giá tổng thể."
                            : ratedCount < CRITERIA.length
                                ? "Bạn đã hoàn thành một phần đánh giá. Hãy tiếp tục để có kết quả đầy đủ."
                                : "Bạn đã hoàn tất tất cả tiêu chí. Cảm ơn bạn đã chia sẻ trải nghiệm!"}
                    </p>

                    <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-500">
                                Tiến độ hoàn thành
                            </span>

                            <span className="font-bold text-slate-700">
                                {Math.round(progress)}%
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {ratedCount > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {CRITERIA.filter((criterion) => ratings[criterion.id] > 0).map(
                                (criterion) => (
                                    <span
                                        key={criterion.id}
                                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${criterion.bg} ${criterion.color} ${criterion.border}`}
                                    >
                                        <span>{criterion.label}</span>
                                        <span>
                                            {ratings[criterion.id]}/5
                                        </span>
                                    </span>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   CAREGIVER REVIEW PAGE
========================================================= */

export default function CaregiverReview() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const bookingId = searchParams.get("bookingId") || location.state?.bookingId || null;
    const [bookingInfo, setBookingInfo] = useState({
        family: location.state?.family || "Nguyễn Thị Lan",
        service: location.state?.service || "Chăm sóc người cao tuổi",
        date: location.state?.date || "18/09/2026",
        duration: location.state?.duration || "3 giờ",
    });

    const [ratings, setRatings] = useState({
        respect: 0,
        safety: 0,
        supplies: 0,
        payment: 0,
    });

    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [apiError, setApiError] = useState("");
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    useEffect(() => {
        if (bookingId && !location.state?.family) {
            caregiverApi.getBookingDetail(bookingId)
                .then((res) => {
                    const data = res.data?.data || res.data;
                    if (data) {
                        setBookingInfo({
                            family: data.customerName || data.patientName || "Gia đình",
                            service: data.serviceName || "Dịch vụ chăm sóc",
                            date: data.scheduledAt ? new Date(data.scheduledAt).toLocaleDateString("vi-VN") : "18/09/2026",
                            duration: data.duration || "Theo ca",
                        });
                    }
                })
                .catch(() => {});
        }
    }, [bookingId, location.state]);

    const setRating = (id) => (value) => {
        setRatings((previous) => ({
            ...previous,
            [id]: value,
        }));
    };

    const totalRating = Object.values(ratings).reduce(
        (total, value) => total + value,
        0
    );

    const ratedCount = Object.values(ratings).filter(
        (value) => value > 0
    ).length;

    const averageRating = totalRating / CRITERIA.length;
    const allRated = ratedCount === CRITERIA.length;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!allRated) return;

        if (alreadyReviewed) {
            setApiError("Bạn đã gửi đánh giá cho ca chăm sóc này rồi.");
            return;
        }

        if (!bookingId) {
            setApiError("Không tìm thấy mã ca chăm sóc (bookingId). Vui lòng chọn ca từ danh sách yêu cầu nhận ca.");
            return;
        }

        setSubmitting(true);
        setApiError("");

        try {
            const payload = {
                rating: Math.round(averageRating),
                overallRating: Math.round(averageRating),
                comment: note.trim() || null,
                criteriaRatings: ratings,
            };

            await caregiverApi.reviewCustomer(bookingId, payload);
            setSubmitted(true);
        } catch (err) {
            if (err.response?.status === 409) {
                setAlreadyReviewed(true);
                setApiError("Bạn đã gửi đánh giá cho ca chăm sóc này rồi.");
            } else {
                setApiError(
                    err.response?.data?.detail ||
                    err.response?.data?.message ||
                    err.response?.data?.title ||
                    "Không thể gửi đánh giá lúc này. Vui lòng thử lại sau."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const resetReview = () => {
        setSubmitted(false);
        setRatings({
            respect: 0,
            safety: 0,
            supplies: 0,
            payment: 0,
        });
        setNote("");
        setApiError("");
    };

    /* ===================== SUCCESS STATE ===================== */

    if (submitted) {
        return (
            <div className="min-h-[70vh] bg-slate-50/70 px-4 py-10 sm:px-8">
                <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                        <CheckIcon className="h-10 w-10" />
                    </div>

                    <span className="mt-6 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Đánh giá đã hoàn tất
                    </span>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-800">
                        Cảm ơn bạn!
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                        Phản hồi của bạn góp phần xây dựng môi trường chăm sóc
                        chuyên nghiệp, an toàn và tôn trọng dành cho cả gia đình
                        lẫn điều dưỡng.
                    </p>

                    <div className="mt-6 w-full max-w-sm">
                        <OverallRating
                            ratings={ratings}
                            averageRating={averageRating}
                            ratedCount={ratedCount}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={resetReview}
                        className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00677c] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#005263] hover:shadow-md active:translate-y-0"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h5M20 20v-5h-5M5.5 9A7 7 0 0118 6l2 3M18.5 15A7 7 0 016 18l-2-3"
                            />
                        </svg>
                        Đánh giá ca khác
                    </button>
                </div>
            </div>
        );
    }

    /* ===================== MAIN PAGE ===================== */

    return (
        <div className="min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-6xl animate-page-enter">
                {/* PAGE HEADER */}
                <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 3v18m9-9H3"
                                    />
                                </svg>
                            </span>

                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                                CareLink · Chất lượng dịch vụ
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Đánh giá trải nghiệm
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                            Chia sẻ trải nghiệm thực tế của bạn để cùng xây dựng
                            môi trường chăm sóc chuyên nghiệp và tích cực hơn.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:self-auto">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                            <StarIcon className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Tiêu chí bắt buộc
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-slate-700">
                                {ratedCount}/{CRITERIA.length} đã đánh giá
                            </p>
                        </div>
                    </div>
                </header>

                {/* SESSION INFORMATION */}
                <section className="mb-8">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-bold text-slate-800">
                                Thông tin ca chăm sóc
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Ca chăm sóc đã hoàn tất cần được đánh giá.
                            </p>
                        </div>

                        {bookingId ? (
                            <span className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-[#00677c] sm:inline-flex">
                                Mã ca · {bookingId}
                            </span>
                        ) : (
                            <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 sm:inline-flex">
                                Chưa liên kết ca chăm sóc
                            </span>
                        )}
                    </div>

                    {!bookingId && (
                        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800 flex items-center justify-between gap-3">
                            <span>Vui lòng chọn ca đã hoàn thành từ danh sách để đánh giá chính xác.</span>
                            <Link to="/caregiver/bookings" className="font-bold underline text-[#00677c] shrink-0">
                                Xem danh sách ca &rarr;
                            </Link>
                        </div>
                    )}

                    <SessionCard
                        family={bookingInfo.family}
                        service={bookingInfo.service}
                        date={bookingInfo.date}
                        duration={bookingInfo.duration}
                    />
                </section>

                {/* REVIEW FORM */}
                <form onSubmit={handleSubmit}>
                    {/* Criteria header */}
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-800">
                                Tiêu chí đánh giá
                            </h2>

                            <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                Chọn số sao phù hợp với trải nghiệm của bạn ở
                                từng tiêu chí bên dưới.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                            <StarIcon className="h-3.5 w-3.5 text-amber-400" />
                            Thang điểm 1–5 sao
                        </span>
                    </div>

                    {/* Two-column rating layout */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {CRITERIA.map((criterion) => (
                            <CriterionBlock
                                key={criterion.id}
                                criterion={criterion}
                                value={ratings[criterion.id]}
                                onChange={setRating(criterion.id)}
                            />
                        ))}
                    </div>

                    {/* Overall rating */}
                    <div className="mt-6">
                        <OverallRating
                            ratings={ratings}
                            averageRating={averageRating}
                            ratedCount={ratedCount}
                        />
                    </div>

                    {/* Optional note */}
                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 10h8M8 14h5m-8 7 3.5-3H19a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v13a3 3 0 002 3z"
                                    />
                                </svg>
                            </div>

                            <div className="min-w-0 flex-1">
                                <label
                                    htmlFor="review-note"
                                    className="block text-sm font-bold text-slate-800"
                                >
                                    Nhận xét thêm
                                    <span className="ml-2 text-xs font-normal text-slate-400">
                                        Không bắt buộc
                                    </span>
                                </label>

                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Chia sẻ thêm những điều bạn đánh giá cao
                                    hoặc trải nghiệm mà nền tảng cần cải thiện.
                                </p>
                            </div>
                        </div>

                        <textarea
                            id="review-note"
                            rows={4}
                            maxLength={1000}
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Ví dụ: Gia đình phối hợp tốt, chuẩn bị đầy đủ vật dụng và trao đổi rất rõ ràng..."
                            className="mt-4 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#00677c] focus:bg-white focus:ring-4 focus:ring-[#00677c]/[0.07]"
                        />

                        <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-[11px] leading-relaxed text-slate-400">
                                Vui lòng giữ nội dung nhận xét lịch sự và khách quan.
                            </p>

                            <span className="shrink-0 text-xs text-slate-400">
                                {note.length}/1000
                            </span>
                        </div>
                    </section>

                    {/* Submission notice */}
                    <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div className="flex items-start gap-3">
                            <div
                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${allRated
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-amber-50 text-amber-600"
                                    }`}
                            >
                                {allRated ? (
                                    <CheckIcon className="h-5 w-5" />
                                ) : (
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="12" r="9" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 8v4m0 4h.01"
                                        />
                                    </svg>
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    {allRated
                                        ? "Bạn đã hoàn thành tất cả tiêu chí"
                                        : "Hoàn thành đánh giá của bạn"}
                                </p>

                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    {allRated
                                        ? "Bạn có thể gửi đánh giá ngay bây giờ."
                                        : `Còn ${CRITERIA.length - ratedCount} tiêu chí chưa được đánh giá.`}
                                </p>
                            </div>
                        </div>

                        {apiError && (
                            <div className="w-full text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3">
                                {apiError}
                            </div>
                        )}

                        <button
                            id="submit-review"
                            type="submit"
                            disabled={!allRated || submitting || alreadyReviewed}
                            className={`
                                inline-flex w-full shrink-0 items-center justify-center gap-2
                                rounded-xl px-6 py-3 text-sm font-bold
                                transition-all duration-200 sm:w-auto
                                ${allRated && !submitting && !alreadyReviewed
                                    ? "bg-[#00677c] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#005263] hover:shadow-md active:translate-y-0 cursor-pointer"
                                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                                }
                            `}
                        >
                            {submitting ? (
                                <span className="inline-flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Đang gửi...
                                </span>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4" />
                                    {alreadyReviewed ? "Đã đánh giá" : "Gửi đánh giá"}
                                </>
                            )}
                        </button>
                    </div>

                    <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">
                        CareLink trân trọng mọi phản hồi giúp nâng cao chất
                        lượng dịch vụ chăm sóc.
                    </p>
                </form>
            </div>
        </div>
    );
}