import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Rating from "../../../components/Rating";

// 1. Danh sách 4 tiêu chí đánh giá kèm mô tả phụ tinh tế chuẩn y tế
const ratingCriteria = [
    {
        id: "chuyen_mon",
        label: "Chuyên môn",
        desc: "Kỹ năng & thao tác điều dưỡng",
    },
    {
        id: "giao_tiep",
        label: "Giao tiếp",
        desc: "Thái độ ân cần, lắng nghe",
    },
    {
        id: "dung_gio",
        label: "Đúng giờ",
        desc: "Có mặt đúng khung giờ đã hẹn",
    },
    {
        id: "chat_luong",
        label: "Chất lượng chăm sóc",
        desc: "Chăm sóc chu đáo, tận tâm",
    },
];

export default function Review() {
    const navigate = useNavigate();

    // MẶC ĐỊNH BAN ĐẦU: 0 sao (Chưa đánh giá, để khách tự bấm chọn)
    const [overallRating, setOverallRating] = useState(0);
    const [criteriaRatings, setCriteriaRatings] = useState({
        chuyen_mon: 0,
        giao_tiep: 0,
        dung_gio: 0,
        chat_luong: 0,
    });

    // Tùy chọn thuê lại (null: chưa chọn, "yes": Có, "no": Không)
    const [comment, setComment] = useState("");
    const [rehire, setRehire] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");

    // Hàm cập nhật số sao cho từng tiêu chí riêng biệt
    const handleCriterionChange = (criterionId, rating) => {
        setCriteriaRatings((prev) => ({
            ...prev,
            [criterionId]: rating,
        }));
    };

    // Hàm xử lý gửi đánh giá (không tự động chuyển trang, hiển thị màn cảm ơn để người dùng tự bấm)
    const handleSubmitReview = (e) => {
        e.preventDefault();
        // Bắt buộc khách phải chọn mức độ hài lòng tổng thể trước
        if (overallRating === 0) {
            setFeedbackMessage("Vui lòng chạm vào các ngôi sao để chọn mức độ hài lòng tổng thể trước khi gửi!");
            return;
        }

        setSubmitted(true);
        setFeedbackMessage("");
    };

    // Hàm bỏ qua đánh giá
    const handleSkipReview = () => {
        navigate("/dashboard");
    };

    return (
        <div className="bg-[#f8fafc] py-10 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex flex-col items-center">
            {/* CONTAINER MỞ RỘNG BỀ NGANG (max-w-4xl lên tới max-w-5xl) GIÚP FORM CỰC KỲ RỘNG RÃI & SANG TRỌNG */}
            <div className="max-w-4xl lg:max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

                {/* Nút quay lại Bảng điều khiển */}
                <div>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00677c] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Quay lại Bảng điều khiển
                    </Link>
                </div>

                {/* Header trang đánh giá */}
                <header className="flex flex-col gap-2 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-[#102030] tracking-tight">
                        Đánh giá dịch vụ
                    </h1>
                    <p className="text-base text-slate-500">
                        Sự đóng góp của bạn giúp CareLink nâng cao chất lượng chuyên môn y tế cho cộng đồng.
                    </p>
                </header>

                {/* ============================================================ */}
                {/* 1. CARD CHI TIẾT CA CHĂM SÓC HOÀN THÀNH                       */}
                {/* ============================================================ */}
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
                        <img
                            src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300"
                            alt="Nguyễn Thùy Linh"
                            className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-xs"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300";
                            }}
                        />
                        <div className="flex-1 flex flex-col min-w-0">
                            <h2 className="text-xl font-extrabold text-[#102030] leading-tight">
                                Nguyễn Thùy Linh
                            </h2>
                            <p className="text-sm font-semibold text-[#00677c] mt-0.5">
                                Chăm sóc y tế chuyên sâu • Phục hồi chức năng
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                        <line x1="16" x2="16" y1="2" y2="6" />
                                        <line x1="8" x2="8" y1="2" y2="6" />
                                        <line x1="3" x2="21" y1="10" y2="10" />
                                    </svg>
                                    Hôm nay, 15/10/2026
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    Thời lượng: 4 giờ
                                </span>
                            </div>
                        </div>
                    </div>
                </article>

                {/* ============================================================ */}
                {/* 2. KHỐI FORM NHẬP ĐÁNH GIÁ HOẶC MÀN HÌNH CẢM ƠN              */}
                {/* ============================================================ */}
                {!submitted ? (
                    <form
                        onSubmit={handleSubmitReview}
                        className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-10"
                    >
                    {/* KHỐI 1: ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG TỔNG THỂ */}
                    <div className="flex flex-col items-center text-center gap-3 pb-8 border-b border-slate-100">
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
                            Mức độ hài lòng tổng thể
                        </span>

                        {/* Cụm sao to lớn, nổi bật (Lúc đầu 0 sao -> tất cả sao ruột TRẮNG viền xám, chọn tới đâu sáng VÀNG KIM tới đó) */}
                        <div className="pt-2">
                            <Rating
                                value={overallRating}
                                onChange={setOverallRating}
                                size="lg"
                            />
                        </div>

                        {/* Dòng chữ mô tả mức độ: 0 sao không hiện 5/5 mà hiện hướng dẫn */}
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

                    {/* KHỐI 2: ĐÁNH GIÁ THEO 4 TIÊU CHÍ (THIẾT KẾ DẠNG THẺ RIÊNG BIỆT, CỰC KỲ RỘNG RÃI & KHÔNG BỊ DÍNH CHỮ) */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                ĐÁNH GIÁ THEO TỪNG TIÊU CHÍ
                            </h3>
                            <span className="text-xs text-slate-400">
                                Tự chọn số sao cho từng phần
                            </span>
                        </div>

                        {/* Lưới 2 cột rộng rãi trên màn hình lớn */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            {ratingCriteria.map((criterion) => {
                                const currentStar = criteriaRatings[criterion.id] || 0;
                                return (
                                    <div
                                        key={criterion.id}
                                        className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                    >
                                        {/* Tiêu đề & mô tả tiêu chí */}
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm sm:text-base font-bold text-[#102030]">
                                                {criterion.label}
                                            </span>
                                            <span className="text-xs text-slate-400 mt-0.5 truncate">
                                                {criterion.desc}
                                            </span>
                                        </div>

                                        {/* Dãy sao tách biệt rõ ràng ở bên phải */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Rating
                                                value={currentStar}
                                                onChange={(val) => handleCriterionChange(criterion.id, val)}
                                                size="sm"
                                            />
                                            {/* Hiển thị số sao nhỏ tinh tế bên cạnh */}
                                            <span className={`text-xs font-bold min-w-[26px] text-right ${currentStar > 0 ? "text-[#f59e0b]" : "text-slate-300"
                                                }`}>
                                                {currentStar > 0 ? `${currentStar}/5` : ""}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* KHỐI 3: Ô NHẬP CHIA SẺ TRẢI NGHIỆM */}
                    <div className="flex flex-col gap-3">
                        <label htmlFor="caregiver-review-comment" className="text-sm font-bold text-[#102030]">
                            Chia sẻ trải nghiệm của bạn
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

                    {/* KHỐI 4: CÂU HỎI THUÊ LẠI */}
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

                    {/* KHỐI 5: NHÓM NÚT GỬI ĐÁNH GIÁ & BỎ QUA */}
                    <div className="flex flex-col gap-3.5 pt-2">
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white rounded-xl text-base font-bold transition-all shadow-md hover:shadow-lg hover:shadow-[#00677c]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                        >
                            <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                            <span>{submitted ? "Đã gửi đánh giá thành công" : "Gửi đánh giá"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleSkipReview}
                            className="w-full py-3 text-slate-500 hover:text-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                        >
                            Bỏ qua lúc này
                        </button>

                        {feedbackMessage && (
                            <p
                                role="status"
                                className={`text-sm text-center font-bold mt-1 ${submitted ? "text-emerald-600" : "text-rose-500"
                                    } animate-pulse`}
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
                /* ============================================================ */
                /* 3. MÀN HÌNH CẢM ƠN — NGƯỜI DÙNG TỰ BẤM VỀ DASHBOARD          */
                /* ============================================================ */
                <div className="p-8 sm:p-14 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-6 animate-fade-in">
                    {/* Icon tích xanh lớn */}
                    <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>

                    {/* Tiêu đề & nội dung cảm ơn */}
                    <div className="flex flex-col gap-2 max-w-lg">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/70 inline-block self-center">
                            ĐÃ GỬI ĐÁNH GIÁ THÀNH CÔNG
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102030] mt-1">
                            Cảm ơn bạn đã đóng góp ý kiến!
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 leading-relaxed mt-1">
                            Ý kiến phản hồi chân thực của bạn là cơ sở quan trọng giúp điều dưỡng <strong>Nguyễn Thùy Linh</strong> và cộng đồng y tế CareLink không ngừng nâng cao chất lượng dịch vụ.
                        </p>
                    </div>

                    {/* Tóm tắt nhanh số sao đã chấm */}
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
                                {rehire === "yes" ? "Thuê lại: Có" : "Thuê lại: Không"}
                            </span>
                        )}
                    </div>

                    {/* Nút hành động quay về Dashboard hoặc Trang chủ: 2 nút đều nhau, chữ nằm gọn trên 1 hàng */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg pt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="w-full min-h-[52px] py-3.5 px-5 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg hover:shadow-[#00677c]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] whitespace-nowrap"
                        >
                            <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            <span>Quay về Bảng điều khiển</span>
                        </button>
                        <Link
                            to="/"
                            className="w-full min-h-[52px] py-3.5 px-5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-xl text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 text-center cursor-pointer whitespace-nowrap active:scale-[0.98]"
                        >
                            <svg className="w-4.5 h-4.5 text-slate-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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