import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import familyApi from "../../../api/familyApi";

// 1. Danh sách phương thức thanh toán "Sang - Xịn" với Brand Colors riêng biệt
const paymentMethods = [
    {
        id: "vnpay",
        label: "Ví VNPay",
        brandHex: "#005BAA", // Xanh đặc trưng VNPay
        activeCard: "border-[#005BAA] bg-[#005BAA]/5 shadow-[0_4px_20px_-4px_rgba(0,91,170,0.15)] scale-[1.02]",
        idleCard: "border-[#c4c6cf] bg-white hover:bg-[#005BAA]/5 hover:border-[#005BAA]/40",
        activeText: "text-[#005BAA]",
        idleText: "text-[#181c1e] group-hover:text-[#005BAA]",
        activeIcon: "text-[#005BAA] scale-110",
        idleIcon: "text-slate-400 group-hover:text-[#005BAA] group-hover:scale-110",
        activeDot: "border-[#005BAA]",
        idleDot: "border-slate-300 group-hover:border-[#005BAA]/50",
        // Chú ý: Đã gỡ bỏ class quy định màu cứng trong thẻ svg để icon tự ăn màu theo thẻ cha
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
            </svg>
        ),
    },
    {
        id: "momo",
        label: "Ví MoMo",
        brandHex: "#A50064", // Hồng magenta MoMo
        activeCard: "border-[#A50064] bg-[#A50064]/5 shadow-[0_4px_20px_-4px_rgba(165,0,100,0.15)] scale-[1.02]",
        idleCard: "border-[#c4c6cf] bg-white hover:bg-[#A50064]/5 hover:border-[#A50064]/40",
        activeText: "text-[#A50064]",
        idleText: "text-[#181c1e] group-hover:text-[#A50064]",
        activeIcon: "text-[#A50064] scale-110",
        idleIcon: "text-slate-400 group-hover:text-[#A50064] group-hover:scale-110",
        activeDot: "border-[#A50064]",
        idleDot: "border-slate-300 group-hover:border-[#A50064]/50",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <rect width="18" height="18" x="3" y="3" rx="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 10v4m5-4v4m5-4v4" />
            </svg>
        ),
    },
    {
        id: "zalopay",
        label: "ZaloPay",
        brandHex: "#0068FF", // Xanh dương sáng ZaloPay
        activeCard: "border-[#0068FF] bg-[#0068FF]/5 shadow-[0_4px_20px_-4px_rgba(0,104,255,0.15)] scale-[1.02]",
        idleCard: "border-[#c4c6cf] bg-white hover:bg-[#0068FF]/5 hover:border-[#0068FF]/40",
        activeText: "text-[#0068FF]",
        idleText: "text-[#181c1e] group-hover:text-[#0068FF]",
        activeIcon: "text-[#0068FF] scale-110",
        idleIcon: "text-slate-400 group-hover:text-[#0068FF] group-hover:scale-110",
        activeDot: "border-[#0068FF]",
        idleDot: "border-slate-300 group-hover:border-[#0068FF]/50",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
                <circle cx="12" cy="12" r="9" />
            </svg>
        ),
    },
    {
        id: "bank-card",
        label: "Thẻ ngân hàng (ATM / Visa / Master)",
        brandHex: "#00677c", // Tông màu xanh mòng két chủ đạo của CareLink
        activeCard: "border-[#00677c] bg-[#00677c]/5 shadow-[0_4px_20px_-4px_rgba(0,103,124,0.15)] scale-[1.02]",
        idleCard: "border-[#c4c6cf] bg-white hover:bg-[#00677c]/5 hover:border-[#00677c]/40",
        activeText: "text-[#00677c]",
        idleText: "text-[#181c1e] group-hover:text-[#00677c]",
        activeIcon: "text-[#00677c] scale-110",
        idleIcon: "text-slate-400 group-hover:text-[#00677c] group-hover:scale-110",
        activeDot: "border-[#00677c]",
        idleDot: "border-slate-300 group-hover:border-[#00677c]/50",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
        ),
    },
];

// 2. Các bước tiến trình thực hiện
const progressItems = [
    "Lịch hẹn đã được xác nhận",
    "Điều dưỡng đã nhận lịch",
    "Gia đình theo dõi tại Bảng điều khiển",
];

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Lấy bookingId từ router state hoặc search query params
    const bookingId = location.state?.bookingId || searchParams.get("bookingId");
    const [booking, setBooking] = useState(location.state?.booking || null);
    const [isLoadingBooking, setIsLoadingBooking] = useState(Boolean(bookingId && !location.state?.booking));

    const [selectedPayment, setSelectedPayment] = useState("vnpay");
    const [acceptedTerms, setAcceptedTerms] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paymentError, setPaymentError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tải thông tin booking thật nếu có bookingId
    useEffect(() => {
        if (!bookingId) return;
        let isMounted = true;
        setIsLoadingBooking(true);
        familyApi.getBookingDetail(bookingId)
            .then((res) => {
                if (isMounted) {
                    setBooking(res);
                    setIsLoadingBooking(false);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setIsLoadingBooking(false);
                }
            });
        return () => {
            isMounted = false;
        };
    }, [bookingId]);

    // Lấy data của phương thức đang được chọn để làm màu chủ đạo cho các nút bấm
    const selectedMethodData = paymentMethods.find((m) => m.id === selectedPayment);

    const handlePayment = async (e) => {
        e.preventDefault();
        setPaymentError("");
        if (!acceptedTerms) {
            setPaymentError("Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách thanh toán trước khi tiếp tục.");
            return;
        }

        if (!bookingId) {
            setPaymentError("Không tìm thấy mã ca chăm sóc để thanh toán. Vui lòng mở lại từ danh sách Lịch hẹn của bạn.");
            return;
        }

        setIsSubmitting(true);
        setPaymentStatus("Đang khởi tạo liên kết thanh toán PayOS bảo mật...");
        try {
            const res = await familyApi.createPaymentLink(bookingId);
            if (res?.checkoutUrl) {
                sessionStorage.setItem("carelink_pending_payment_booking_id", bookingId);
                setPaymentStatus("Đang chuyển hướng tới cổng thanh toán an toàn PayOS...");
                window.location.href = res.checkoutUrl;
            } else {
                setPaymentError("Không nhận được liên kết thanh toán từ cổng PayOS. Vui lòng thử lại sau.");
                setPaymentStatus("");
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error("[CareLink] Lỗi khi tạo liên kết thanh toán PayOS:", err);
            setIsSubmitting(false);
            setPaymentStatus("");
            const status = err.response?.status;
            let msg = err.response?.data?.detail || err.response?.data?.message;
            if (!msg) {
                if (status === 409) {
                    msg = "Ca chăm sóc này đã được thanh toán hoặc không ở trạng thái chờ thanh toán.";
                } else if (status === 401 || status === 403) {
                    msg = "Phiên làm việc đã hết hạn hoặc bạn không có quyền thanh toán cho ca này.";
                } else if (status === 404) {
                    msg = "Không tìm thấy thông tin ca chăm sóc trên hệ thống.";
                } else {
                    msg = "Chưa thể tạo liên kết thanh toán PayOS lúc này. Vui lòng kiểm tra đường truyền và thử lại.";
                }
            }
            setPaymentError(msg);
            setPaymentStatus("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#f8fafc] py-8 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

                {/* Nút quay lại */}
                <div>
                    <Link
                        to="/dashboard/messages"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00677c] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Quay lại khung trao đổi
                    </Link>
                </div>

                {/* Tiêu đề trang */}
                <header className="flex flex-col items-center text-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-[#8ae5fa] flex items-center justify-center text-[#003742] mb-1.5 shadow-[0_4px_16px_rgba(138,229,250,0.35)] border-2 border-white/80 transition-transform hover:scale-105">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-prussian-blue">Hoàn tất đặt lịch</h1>
                    <p className="text-base text-[#43474e] max-w-lg leading-relaxed">
                        Lịch hẹn đã được xác nhận. Chỉ còn một bước cuối cùng để hoàn tất quá trình đặt lịch.
                    </p>
                </header>

                {/* Bố cục lưới: 7 cột Thanh toán + 5 cột Tóm tắt & Bảo mật */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ============================================================ */}
                    {/* CỘT TRÁI: KHỐI THANH TOÁN (7 CỘT)                            */}
                    {/* ============================================================ */}
                    <section className="lg:col-span-7 flex flex-col gap-6">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e0e3e5] shadow-sm flex flex-col gap-6">

                            {/* Phí nền tảng */}
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-semibold text-prussian-blue">Phí nền tảng</h2>
                                <p className="text-sm text-[#43474e] leading-relaxed">
                                    Khoản phí này giúp CareLink vận hành hệ thống, hỗ trợ xác thực điều dưỡng và chăm sóc khách hàng.
                                </p>
                            </div>

                            {/* Thẻ tổng cộng phí */}
                            <div className="p-6 rounded-xl bg-[#f1f4f6] border border-[#c4c6cf4c] flex flex-col gap-1">
                                <span className="text-sm text-[#43474e]">
                                    {booking?.serviceName ? `Tổng cộng phí dịch vụ (${booking.serviceName})` : "Tổng cộng phí dịch vụ"}
                                </span>
                                <span className="text-3xl sm:text-4xl font-bold text-prussian-blue">
                                    {booking?.totalPrice
                                        ? Number(booking.totalPrice).toLocaleString("vi-VN") + " VNĐ"
                                        : "60.000 VNĐ"}
                                </span>
                                {booking?.recipientName && (
                                    <span className="text-xs text-slate-500 mt-1">
                                        Người nhận: <strong>{booking.recipientName}</strong> · Điều dưỡng: <strong>{booking.nurseName || "Đang xếp lịch"}</strong>
                                    </span>
                                )}
                            </div>

                            {/* Phương thức thanh toán - Áp dụng màu thương hiệu */}
                            <div className="flex flex-col gap-3 pt-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#181c1e]">
                                    PHƯƠNG THỨC THANH TOÁN
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {paymentMethods.map((method) => {
                                        const isSelected = selectedPayment === method.id;
                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPayment(method.id);
                                                    setPaymentStatus("");
                                                }}
                                                // Group hover phối hợp màu thẻ, viền và shadow cực xịn
                                                className={`group flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${isSelected ? method.activeCard : method.idleCard
                                                    }`}
                                            >
                                                {/* Hiệu ứng Scale nhẹ cho Icon khi Hover / Selected */}
                                                <div className={`shrink-0 transition-all duration-300 ${isSelected ? method.activeIcon : method.idleIcon}`}>
                                                    {method.icon}
                                                </div>

                                                <span className={`text-base font-semibold flex-1 transition-colors duration-300 ${isSelected ? method.activeText : method.idleText}`}>
                                                    {method.label}
                                                </span>

                                                {/* Nút Check Radio mượt mà */}
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${isSelected ? method.activeDot : method.idleDot
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <div
                                                            className="w-2.5 h-2.5 rounded-full animate-fade-in"
                                                            style={{ backgroundColor: method.brandHex }}
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Checkbox điều khoản */}
                            <div className="pt-2">
                                <label className="flex items-start gap-3 cursor-pointer select-none group">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => {
                                            setAcceptedTerms(e.target.checked);
                                            if (e.target.checked) setPaymentStatus("");
                                        }}
                                        className="w-5 h-5 mt-0.5 rounded border-slate-300 focus:ring-0 transition-colors"
                                        style={{ accentColor: selectedMethodData?.brandHex || '#00677c' }}
                                    />
                                    <span className="text-sm text-[#43474e] leading-relaxed group-hover:text-[#181c1e] transition-colors">
                                        Tôi đồng ý với{" "}
                                        <a href="#" className="font-medium underline transition-colors" style={{ color: selectedMethodData?.brandHex || '#00677c' }}>
                                            Điều khoản dịch vụ
                                        </a>{" "}
                                        và{" "}
                                        <a href="#" className="font-medium underline transition-colors" style={{ color: selectedMethodData?.brandHex || '#00677c' }}>
                                            Chính sách thanh toán
                                        </a>{" "}
                                        của CareLink.
                                    </span>
                                </label>
                            </div>

                            {/* Nút hành động thanh toán thay đổi màu Động theo Phương thức thanh toán */}
                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handlePayment}
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-6 text-white rounded-xl text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                    style={{ backgroundColor: selectedMethodData?.brandHex || '#102030' }}
                                >
                                    {isSubmitting ? "Đang kết nối cổng PayOS..." : `Thanh toán qua ${selectedMethodData?.label}`}
                                </button>

                                {paymentError && (
                                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium leading-relaxed">
                                        {paymentError}
                                    </div>
                                )}

                                {paymentStatus && (
                                    <p
                                        role="status"
                                        className="text-sm text-center font-medium animate-pulse"
                                        style={{ color: selectedMethodData?.brandHex || '#00677c' }}
                                    >
                                        {paymentStatus}
                                    </p>
                                )}

                                <p className="text-xs text-center italic text-[#44474e] pt-1">
                                    Giao dịch được bảo mật và xác thực bởi cổng thanh toán PayOS.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* ============================================================ */}
                    {/* CỘT PHẢI: THÔNG TIN THANH TOÁN & BẢO MẬT (5 CỘT)             */}
                    {/* ============================================================ */}
                    <aside className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">

                        {/* Thẻ 1: Thông tin thanh toán & Tiến trình */}
                        <div className="p-6 rounded-2xl bg-[#9ae5fd4c] border border-[#9ae5fd] flex flex-col gap-4 shadow-xs">
                            <div className="flex items-center gap-2 text-prussian-blue">
                                <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-[#03687d]">
                                    THÔNG TIN THANH TOÁN
                                </h2>
                            </div>

                            <p className="text-sm text-[#03687d] leading-relaxed">
                                Chi phí chăm sóc sẽ được thanh toán trực tiếp giữa gia đình và điều dưỡng sau khi hoàn thành dịch vụ hoặc theo thỏa thuận giữa hai bên. CareLink chỉ thu phí nền tảng và không thu hộ chi phí chăm sóc.
                            </p>

                            {/* 3 Bước tiến trình có tích xanh */}
                            <div className="flex flex-col gap-3 pt-2">
                                {progressItems.map((line, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-[#181c1e]">{line}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Thẻ 2: Bảo mật & Tin cậy */}
                        <div className="p-6 bg-white rounded-2xl border border-[#e0e3e5] shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-[#00677c]">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-base font-bold text-[#00091b]">Bảo mật &amp; Tin cậy</h3>
                                <p className="text-xs text-[#44474e] leading-relaxed">
                                    Giao dịch được mã hóa 256-bit theo tiêu chuẩn bảo mật y tế HIPAA.
                                </p>
                            </div>
                        </div>

                        {/* Thẻ 3: Banner hỗ trợ 24/7 có ảnh nền */}
                        <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-sm flex items-end p-6 group cursor-pointer">
                            <img
                                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600"
                                alt="Đội ngũ hỗ trợ CareLink"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#091b1f]/90 via-[#091b1f]/50 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                            <p className="relative z-10 text-sm font-semibold text-white leading-relaxed">
                                Đội ngũ hỗ trợ CareLink luôn sẵn sàng đồng hành cùng gia đình bạn 24/7.
                            </p>
                        </div>

                    </aside>

                </div>
            </div>
        </div>
    );
}