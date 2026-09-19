import React, { useState } from "react";
import Rating from "../../../components/Rating";

/* ─── Review criteria ─── */
const CRITERIA = [
    {
        id: "respect",
        label: "Thái độ tôn trọng nhân viên y tế",
        description: "Gia đình đối xử lịch sự, tôn trọng với bạn trong suốt ca chăm sóc.",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
        ),
        color: "text-violet-600",
        bg: "bg-violet-50",
    },
    {
        id: "safety",
        label: "Môi trường làm việc an toàn, sạch sẽ",
        description: "Không gian nhà ở gọn gàng, không có nguy cơ mất an toàn cho bạn.",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        id: "supplies",
        label: "Hỗ trợ đầy đủ vật tư cần thiết",
        description: "Gia đình cung cấp đầy đủ thuốc, thiết bị y tế và vật dụng chăm sóc.",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        ),
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        id: "payment",
        label: "Thanh toán đúng hẹn",
        description: "Gia đình thanh toán đúng số tiền và đúng thời điểm đã thỏa thuận.",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: "text-amber-600",
        bg: "bg-amber-50",
    },
];

/* ─── Completed session card ─── */
function SessionCard({ family, service, date, duration }) {
    return (
        <div className="bg-gradient-to-br from-[#00677c] to-[#102030] rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg shrink-0 backdrop-blur-sm">
                    {family[0]}
                </div>
                <div>
                    <p className="font-bold text-base leading-tight">{family}</p>
                    <p className="text-white/70 text-sm mt-0.5">{service}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-wide">Ngày</span>
                    <span className="text-sm font-semibold">{date}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-wide">Thời lượng</span>
                    <span className="text-sm font-semibold">{duration}</span>
                </div>
                <div className="ml-auto">
                    <span className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-300/30 px-3 py-1 rounded-full text-emerald-200 text-xs font-bold">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Hoàn thành
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ─── Criterion Rating Block ─── */
function CriterionBlock({ criterion, value, onChange }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-md hover:border-slate-200">
            <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl ${criterion.bg} flex items-center justify-center shrink-0 ${criterion.color}`}>
                    {criterion.icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-[#102030] leading-tight">{criterion.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{criterion.description}</p>
                </div>
            </div>
            <div className="pl-12">
                <Rating
                    id={`rating-${criterion.id}`}
                    value={value}
                    onChange={onChange}
                    size="md"
                />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   CaregiverReview
═══════════════════════════════════════════ */
export default function CaregiverReview() {
    const [ratings, setRatings] = useState({ respect: 0, safety: 0, supplies: 0, payment: 0 });
    const [note, setNote] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const setRating = (id) => (val) => setRatings((p) => ({ ...p, [id]: val }));

    const averageRating = Object.values(ratings).reduce((a, b) => a + b, 0) / CRITERIA.length;
    const allRated = Object.values(ratings).every((v) => v > 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!allRated) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="p-5 sm:p-8 max-w-2xl mx-auto animate-page-enter flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-[#00677c] flex items-center justify-center shadow-lg shadow-emerald-200">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[#102030]">Cảm ơn bạn!</h2>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                        Đánh giá của bạn giúp CareLink nâng cao chất lượng dịch vụ và xây dựng môi trường làm việc tốt hơn cho Caregiver.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Rating value={Math.round(averageRating)} readonly size="lg" />
                    <span className="text-2xl font-bold text-[#102030]">{averageRating.toFixed(1)}</span>
                </div>
                <button
                    onClick={() => { setSubmitted(false); setRatings({ respect: 0, safety: 0, supplies: 0, payment: 0 }); setNote(""); }}
                    className="px-6 py-2.5 rounded-xl bg-[#00677c] text-white text-sm font-semibold hover:bg-[#005263] transition-all shadow-sm hover:shadow-md"
                >
                    Đánh giá ca khác
                </button>
            </div>
        );
    }

    return (
        <div className="p-5 sm:p-8 max-w-2xl mx-auto animate-page-enter">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#102030]">Đánh giá trải nghiệm</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Chia sẻ phản hồi của bạn về ca chăm sóc vừa hoàn thành.
                </p>
            </div>

            {/* Completed Session */}
            <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Ca chăm sóc</p>
                <SessionCard
                    family="Nguyễn Thị Lan"
                    service="Chăm sóc người cao tuổi"
                    date="18/09/2026"
                    duration="3 giờ"
                />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Criteria */}
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tiêu chí đánh giá</p>
                {CRITERIA.map((c) => (
                    <CriterionBlock
                        key={c.id}
                        criterion={c}
                        value={ratings[c.id]}
                        onChange={setRating(c.id)}
                    />
                ))}

                {/* Overall preview */}
                {averageRating > 0 && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Đánh giá tổng thể</p>
                            <p className="text-3xl font-bold text-[#102030] leading-none mt-1">{averageRating.toFixed(1)}</p>
                        </div>
                        <div className="flex-1">
                            <Rating value={Math.round(averageRating)} readonly size="lg" />
                        </div>
                    </div>
                )}

                {/* Note */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        Nhận xét thêm <span className="text-slate-300 font-normal normal-case">(tuỳ chọn)</span>
                    </label>
                    <textarea
                        id="review-note"
                        rows={4}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Chia sẻ thêm về trải nghiệm của bạn với gia đình này..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-[#102030] placeholder-slate-300 focus:outline-none focus:border-[#00677c] focus:ring-2 focus:ring-[#00677c15] transition-all resize-none"
                    />
                </div>

                {/* Notice */}
                {!allRated && (
                    <p className="text-xs text-amber-600 flex items-center gap-1.5">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        Vui lòng đánh giá đầy đủ tất cả 4 tiêu chí trước khi gửi.
                    </p>
                )}

                {/* Submit */}
                <button
                    id="submit-review"
                    type="submit"
                    disabled={!allRated}
                    className={`w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all duration-200 shadow-sm ${
                        allRated
                            ? "bg-[#00677c] hover:bg-[#005263] hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                >
                    Gửi đánh giá
                </button>
            </form>
        </div>
    );
}
