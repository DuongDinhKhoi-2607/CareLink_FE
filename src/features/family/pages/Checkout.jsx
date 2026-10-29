
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import familyApi from "../../../api/familyApi";

const paymentMethods = [
    {
        id: "payos-vietqr",
        label: "VietQR",
        subtitle: "Quét mã bằng ứng dụng ngân hàng",
        badge: "Đề xuất",
        description: "Hỗ trợ các ứng dụng ngân hàng phổ biến",
        color: "#087E78",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 14h3v3h-3zm4 4h3m-3-4h3v3" />
            </svg>
        ),
    },
    {
        id: "bank-transfer",
        label: "Chuyển khoản ngân hàng",
        subtitle: "Giao dịch nhanh qua hệ thống ngân hàng",
        badge: null,
        description: "Chuyển khoản nhanh liên ngân hàng 24/7",
        color: "#3565A8",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18L12 3 3 9Zm2 0v11m4-11v11m6-11v11m4-11v11M3 20h18" />
            </svg>
        ),
    },
    {
        id: "bank-card",
        label: "Thẻ ATM / Thẻ quốc tế",
        subtitle: "Visa, Mastercard, JCB và thẻ nội địa",
        badge: null,
        description: "Thanh toán qua cổng PayOS",
        color: "#536174",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
                <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                <path d="M3 10h18" />
                <path strokeLinecap="round" d="M6 15h4" />
            </svg>
        ),
    },
    {
        id: "ewallet",
        label: "Ví điện tử",
        subtitle: "MoMo, VNPay, Viettel Money",
        badge: null,
        description: "Thanh toán qua ứng dụng ví điện tử",
        color: "#A50064",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
                <rect x="3" y="5" width="18" height="15" rx="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M15 14h2" />
                <path d="M7 5V3h10v2" />
            </svg>
        ),
    },
];

const progressItems = [
    "Xác nhận đặt chỗ và khởi tạo thanh toán",
    "Điều dưỡng tiếp nhận lịch chăm sóc",
    "Theo dõi và xác nhận hoàn tất ca chăm sóc",
];

const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN");

const Icon = ({ children, className = "w-5 h-5" }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
    >
        {children}
    </svg>
);

const SectionHeading = ({ eyebrow, title, description }) => (
    <div className="space-y-2">
        {eyebrow && (
            <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#087E78]">
                {eyebrow}
            </p>
        )}
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#203832]">
            {title}
        </h2>
        {description && (
            <p className="text-[13px] leading-6 text-[#7A8881]">
                {description}
            </p>
        )}
    </div>
);

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Giữ nguyên cách lấy booking từ router state hoặc query params.
    const bookingId =
        location.state?.bookingId || searchParams.get("bookingId");

    const [booking, setBooking] = useState(location.state?.booking || null);
    const [isLoadingBooking, setIsLoadingBooking] = useState(
        Boolean(bookingId && !location.state?.booking)
    );

    const [selectedPayment, setSelectedPayment] = useState("payos-vietqr");
    const [acceptedTerms, setAcceptedTerms] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paymentError, setPaymentError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Giữ nguyên cách tính tổng chi phí hiện tại.
    const servicePrice = Number(booking?.totalPrice || 0);
    const platformFee = Number(booking?.platformFee || 60000);
    const chargeAmount = Number(
        booking?.totalPaymentAmount || servicePrice + platformFee
    );

    // Lấy thông tin lịch hẹn từ API.
    useEffect(() => {
        if (!bookingId) return;

        let isMounted = true;
        setIsLoadingBooking(true);

        familyApi
            .getBookingDetail(bookingId)
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

    // Giữ nguyên quy tắc quá hạn thanh toán 30 phút.
    const isExpired = useMemo(() => {
        if (!booking?.createdAt) return false;

        const createdMs = new Date(booking.createdAt).getTime();

        return Date.now() - createdMs > 30 * 60 * 1000;
    }, [booking]);

    const selectedMethodData =
        paymentMethods.find((m) => m.id === selectedPayment) ||
        paymentMethods[0];

    // Giữ nguyên luồng tạo liên kết thanh toán PayOS.
    const handlePayment = async (e) => {
        e.preventDefault();
        setPaymentError("");

        if (isExpired) {
            setPaymentError(
                "Ca chăm sóc này đã quá hạn thanh toán 30 phút. Khung giờ đã được giải phóng, vui lòng tạo lịch mới."
            );
            return;
        }

        if (!acceptedTerms) {
            setPaymentError(
                "Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách thanh toán trước khi tiếp tục."
            );
            return;
        }

        if (!bookingId) {
            setPaymentError(
                "Không tìm thấy mã ca chăm sóc để thanh toán. Vui lòng mở lại từ danh sách Lịch hẹn của bạn."
            );
            return;
        }

        setIsSubmitting(true);
        setPaymentStatus(
            `Đang khởi tạo liên kết thanh toán PayOS (${formatMoney(chargeAmount)} VNĐ)...`
        );

        try {
            const currentOrigin = window.location.origin;

            // Backend tự tính số tiền từ dữ liệu trong cơ sở dữ liệu.
            const res = await familyApi.createPaymentLink(bookingId, {
                returnUrl: `${currentOrigin}/payment/success`,
                cancelUrl: `${currentOrigin}/payment/cancel`,
            });

            if (res?.checkoutUrl) {
                sessionStorage.setItem(
                    "carelink_pending_payment_booking_id",
                    bookingId
                );

                setPaymentStatus(
                    "Đang chuyển hướng tới cổng thanh toán an toàn PayOS..."
                );

                window.location.href = res.checkoutUrl;
            } else {
                setPaymentError(
                    "Không nhận được liên kết thanh toán từ cổng PayOS. Vui lòng thử lại sau."
                );
                setPaymentStatus("");
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error(
                "[CareLink] Lỗi khi tạo liên kết thanh toán PayOS:",
                err
            );

            setIsSubmitting(false);
            setPaymentStatus("");

            const status = err.response?.status;
            let msg =
                err.response?.data?.detail ||
                err.response?.data?.message;

            if (!msg) {
                if (status === 409) {
                    msg =
                        "Ca chăm sóc này đã được thanh toán hoặc không ở trạng thái chờ thanh toán.";
                } else if (status === 401 || status === 403) {
                    msg =
                        "Phiên làm việc đã hết hạn hoặc bạn không có quyền thanh toán cho ca này.";
                } else if (status === 404) {
                    msg =
                        "Không tìm thấy thông tin ca chăm sóc trên hệ thống.";
                } else {
                    msg =
                        "Chưa thể tạo liên kết thanh toán PayOS lúc này. Vui lòng kiểm tra đường truyền và thử lại.";
                }
            }

            setPaymentError(msg);
            setPaymentStatus("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-140px)] overflow-hidden bg-[#F7F8F5] font-sans text-[#263B34] antialiased">
            {/* Nền trang nhẹ nhàng, giữ nội dung là điểm nhấn */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[340px] bg-gradient-to-b from-[#E8F2EC] via-[#F1F5EF] to-transparent" />

            <div className="relative mx-auto max-w-[1240px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                {/* Điều hướng */}
                <div className="mb-8">
                    <Link
                        to="/dashboard/messages"
                        className="group inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2.5 text-xs font-semibold text-[#65776D] shadow-sm backdrop-blur transition hover:border-[#C7DDD2] hover:bg-white hover:text-[#087E78]"
                    >
                        <Icon className="h-4 w-4 transition-transform group-hover:-translate-x-1">
                            <path d="m15 18-6-6 6-6" />
                            <path d="M20 12H9" />
                        </Icon>
                        Quay lại khung trao đổi
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-9 text-center sm:mb-11">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#CFE2D6] bg-white/80 px-3.5 py-2 shadow-sm">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E3F2E9] text-[#087E78]">
                            <Icon className="h-3.5 w-3.5">
                                <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
                                <path d="m9 12 2 2 4-4" />
                            </Icon>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#47756A]">
                            CareLink · Secure Checkout
                        </span>
                    </div>

                    <h1 className="mx-auto max-w-3xl text-[29px] font-bold leading-tight tracking-[-0.045em] text-[#203C32] sm:text-4xl lg:text-[43px]">
                        Hoàn tất đặt lịch
                        <span className="mt-1 block font-medium text-[#087E78]">
                            Chăm sóc tận tâm, an tâm mỗi ngày.
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-[#75857B] sm:text-sm">
                        Kiểm tra thông tin ca chăm sóc, xác nhận chi phí và
                        lựa chọn phương thức thanh toán phù hợp với gia đình.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-[#718078]">
                        <span className="inline-flex items-center gap-1.5">
                            <Icon className="h-4 w-4 text-[#087E78]">
                                <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
                                <path d="m9 12 2 2 4-4" />
                            </Icon>
                            Thanh toán qua PayOS
                        </span>
                        <span className="hidden h-3 w-px bg-[#D5DFD8] sm:block" />
                        <span className="inline-flex items-center gap-1.5">
                            <Icon className="h-4 w-4 text-[#087E78]">
                                <rect x="4" y="10" width="16" height="11" rx="2" />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </Icon>
                            Bảo mật giao dịch
                        </span>
                    </div>
                </header>

                {/* Nội dung chính */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-7">
                    {/* CỘT TRÁI */}
                    <section className="flex min-w-0 flex-col gap-5 lg:col-span-7">
                        {/* Thông tin lịch hẹn */}
                        <div className="overflow-hidden rounded-[24px] border border-[#E6EAE4] bg-white shadow-[0_8px_30px_rgba(35,61,48,0.035)]">
                            <div className="flex items-center justify-between gap-3 border-b border-[#EEF0EB] px-5 py-5 sm:px-7">
                                <SectionHeading
                                    eyebrow="Booking overview"
                                    title="Thông tin ca chăm sóc"
                                    description="Chi tiết lịch hẹn và chi phí được hiển thị bên dưới."
                                />
                                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E9F4ED] text-[#087E78] sm:flex">
                                    <Icon className="h-5 w-5">
                                        <path d="M8 3v3m8-3v3M4 9h16" />
                                        <rect x="4" y="5" width="16" height="16" rx="2" />
                                        <path d="m9 14 2 2 4-4" />
                                    </Icon>
                                </div>
                            </div>

                            <div className="p-5 sm:p-7">
                                {isLoadingBooking ? (
                                    <div className="space-y-4 py-3">
                                        <div className="h-5 w-2/3 animate-pulse rounded-lg bg-[#EEF2ED]" />
                                        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-[#F1F3EF]" />
                                        <div className="h-24 animate-pulse rounded-2xl bg-[#F6F7F4]" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D9EAE0] bg-[#EDF6F0] text-[#087E78]">
                                                <Icon className="h-6 w-6">
                                                    <path d="M12 21s-7-4.4-7-11a7 7 0 0 1 14 0c0 6.6-7 11-7 11Z" />
                                                    <circle cx="12" cy="10" r="2.5" />
                                                </Icon>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-base font-bold leading-6 text-[#263D32] sm:text-lg">
                                                        {booking?.serviceName ||
                                                            "Ca chăm sóc sức khỏe tại nhà"}
                                                    </h3>

                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D6E8D9] bg-[#EFF7EF] px-2.5 py-1 text-[10px] font-bold text-[#3C7853]">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#4E9A67]" />
                                                        Chờ thanh toán
                                                    </span>
                                                </div>

                                                <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-[#77867B]">
                                                    <Icon className="mt-0.5 h-4 w-4 shrink-0">
                                                        <circle cx="12" cy="12" r="9" />
                                                        <path d="M12 7v5l3 2" />
                                                    </Icon>
                                                    {booking?.startTime
                                                        ? `${new Date(
                                                            booking.startTime
                                                        ).toLocaleDateString(
                                                            "vi-VN"
                                                        )} · ${new Date(
                                                            booking.startTime
                                                        ).toLocaleTimeString(
                                                            "vi-VN",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )} – ${new Date(
                                                            booking.endTime
                                                        ).toLocaleTimeString(
                                                            "vi-VN",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}`
                                                        : "Theo khung giờ thỏa thuận"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="my-5 border-t border-dashed border-[#E0E6DF]" />

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="rounded-2xl border border-[#E9EDE7] bg-[#FAFBF8] p-4">
                                                <div className="mb-2 flex items-center gap-2 text-[#87948A]">
                                                    <Icon className="h-4 w-4">
                                                        <circle cx="12" cy="8" r="4" />
                                                        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                                                    </Icon>
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                                                        Người được chăm sóc
                                                    </span>
                                                </div>
                                                <p className="break-words text-sm font-bold text-[#34483C]">
                                                    {booking?.recipientName || "Người thân"}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-[#DDEAE0] bg-[#F4F8F3] p-4">
                                                <div className="mb-2 flex items-center gap-2 text-[#6E9682]">
                                                    <Icon className="h-4 w-4">
                                                        <path d="M12 3 20 7v5c0 5-8 9-8 9s-8-4-8-9V7l8-4Z" />
                                                        <path d="m9 12 2 2 4-4" />
                                                    </Icon>
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                                                        Điều dưỡng phụ trách
                                                    </span>
                                                </div>
                                                <p className="break-words text-sm font-bold text-[#087E78]">
                                                    {booking?.nurseName || "Điều dưỡng CareLink"}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Chi phí */}
                        <div className="overflow-hidden rounded-[24px] border border-[#DCE8DE] bg-white shadow-[0_8px_30px_rgba(35,61,48,0.035)]">
                            <div className="border-b border-[#EDF0E9] px-5 py-5 sm:px-7">
                                <SectionHeading
                                    eyebrow="Transparent pricing"
                                    title="Chi tiết thanh toán"
                                    description="Các khoản phí được tách riêng để gia đình dễ dàng theo dõi."
                                />
                            </div>

                            <div className="p-5 sm:p-7">
                                <div className="space-y-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-[#435449]">
                                                Chi phí dịch vụ điều dưỡng
                                            </p>
                                            <p className="mt-1 text-xs text-[#94A096]">
                                                Theo mức phí đã thỏa thuận
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-sm font-bold tabular-nums text-[#34473B]">
                                            {formatMoney(servicePrice)} VNĐ
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-[#435449]">
                                                Phí nền tảng CareLink
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-[#94A096]">
                                                Phí nền tảng và các khoản liên quan theo chính sách áp dụng
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-sm font-bold tabular-nums text-[#435449]">
                                            +{formatMoney(platformFee)} VNĐ
                                        </span>
                                    </div>
                                </div>

                                <div className="my-6 border-t border-dashed border-[#DDE5DC]" />

                                <div className="rounded-[20px] bg-gradient-to-br from-[#EDF6EF] to-[#F5F8F2] p-5 sm:p-6">
                                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#648270]">
                                        <Icon className="h-4 w-4">
                                            <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
                                            <path d="m9 12 2 2 4-4" />
                                        </Icon>
                                        Tổng chi phí
                                    </div>

                                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-[#496052]">
                                                Tổng thanh toán
                                            </p>
                                            <p className="mt-1 text-[11px] text-[#84968A]">
                                                Đã bao gồm các khoản phí hiển thị
                                            </p>
                                        </div>
                                        <p className="text-[27px] font-bold leading-tight tracking-[-0.04em] text-[#087E78] sm:text-[32px]">
                                            {formatMoney(chargeAmount)}
                                            <span className="ml-1.5 text-sm font-semibold tracking-normal">
                                                VNĐ
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-[#849087]">
                                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#659577]">
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="m8.5 12 2.5 2.5 4.5-5" />
                                    </Icon>
                                    Vui lòng kiểm tra thông tin và tổng chi phí trước khi tiếp tục thanh toán.
                                </p>
                            </div>
                        </div>

                        {/* Phương thức thanh toán */}
                        <div className="rounded-[24px] border border-[#E6EAE4] bg-white p-5 shadow-[0_8px_30px_rgba(35,61,48,0.035)] sm:p-7">
                            <div className="mb-5 flex items-start justify-between gap-3">
                                <SectionHeading
                                    eyebrow="Payment methods"
                                    title="Phương thức thanh toán"
                                    description="Lựa chọn phương thức phù hợp với bạn."
                                />
                                <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#F0F5EF] px-2.5 py-1.5 text-[10px] font-bold text-[#648270]">
                                    <Icon className="h-3.5 w-3.5">
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    </Icon>
                                    PayOS
                                </div>
                            </div>

                            <div className="space-y-3">
                                {paymentMethods.map((method) => {
                                    const isSelected =
                                        selectedPayment === method.id;

                                    return (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedPayment(method.id);
                                                setPaymentStatus("");
                                            }}
                                            aria-pressed={isSelected}
                                            style={{
                                                "--method-color": method.color,
                                            }}
                                            className={`group relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 sm:gap-4 sm:p-5 ${isSelected
                                                ? "border-[var(--method-color)] bg-[#F8FAF7] shadow-[0_0_0_2px_rgba(8,126,120,0.07)]"
                                                : "border-[#E8ECE6] bg-white hover:border-[#C5D8CA] hover:bg-[#FBFCF9]"
                                                }`}
                                        >
                                            {isSelected && (
                                                <span className="absolute inset-y-0 left-0 w-[3px] bg-[var(--method-color)]" />
                                            )}

                                            <div
                                                style={{
                                                    color: method.color,
                                                    backgroundColor: isSelected
                                                        ? `${method.color}12`
                                                        : "#F5F6F2",
                                                }}
                                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] transition-colors"
                                            >
                                                {method.icon}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`text-sm font-bold leading-5 sm:text-[15px] ${isSelected
                                                            ? "text-[#243D32]"
                                                            : "text-[#526158]"
                                                            }`}
                                                    >
                                                        {method.label}
                                                    </span>

                                                    {method.badge && (
                                                        <span className="rounded-full bg-[#E7F2E9] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#39775C]">
                                                            {method.badge}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-[11px] leading-5 text-[#87938A] sm:text-xs">
                                                    {method.subtitle}
                                                </p>
                                            </div>

                                            <span
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${isSelected
                                                    ? "border-[#087E78] bg-[#087E78]"
                                                    : "border-[#D6DDD5] bg-white group-hover:border-[#8BB3A0]"
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="white"
                                                        strokeWidth="3"
                                                        className="h-3 w-3"
                                                    >
                                                        <path d="m5 12 4 4L19 6" />
                                                    </svg>
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Điều khoản */}
                        <div className="rounded-[20px] border border-[#E7EAE4] bg-white px-5 py-5 sm:px-6">
                            <label className="flex cursor-pointer items-start gap-3.5">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => {
                                        setAcceptedTerms(e.target.checked);
                                        if (e.target.checked) {
                                            setPaymentStatus("");
                                        }
                                    }}
                                    className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-[#CBD7CC] accent-[#087E78] focus:ring-2 focus:ring-[#087E78]/20"
                                />

                                <span className="text-xs leading-6 text-[#76847A]">
                                    Tôi đồng ý với{" "}
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="font-semibold text-[#087E78] underline decoration-[#A9C9B6] underline-offset-2"
                                    >
                                        Điều khoản dịch vụ y tế
                                    </a>{" "}
                                    và{" "}
                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="font-semibold text-[#087E78] underline decoration-[#A9C9B6] underline-offset-2"
                                    >
                                        Chính sách giữ chỗ & Hoàn tiền
                                    </a>{" "}
                                    của CareLink.
                                </span>
                            </label>
                        </div>

                        {/* Lỗi và nút thanh toán */}
                        <div className="rounded-[24px] border border-[#DDE8DE] bg-white p-5 shadow-[0_8px_30px_rgba(35,61,48,0.035)] sm:p-7">
                            {isExpired ? (
                                <div className="rounded-2xl border border-[#F0DFC0] bg-[#FFF9ED] p-5 text-center">
                                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F9EACB] text-[#A47529]">
                                        <Icon className="h-5 w-5">
                                            <circle cx="12" cy="12" r="9" />
                                            <path d="M12 7v5l3 2" />
                                        </Icon>
                                    </div>

                                    <h3 className="text-sm font-bold text-[#815C28]">
                                        Thời gian giữ chỗ đã kết thúc
                                    </h3>
                                    <p className="mt-2 text-xs leading-5 text-[#9A7D52]">
                                        Ca chăm sóc đã quá hạn thanh toán 30 phút.
                                        Vui lòng tạo lịch mới để tiếp tục.
                                    </p>

                                    <Link
                                        to="/caregivers"
                                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#087E78] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#066A65]"
                                    >
                                        Đặt lịch mới
                                        <Icon className="h-4 w-4">
                                            <path d="M5 12h14m-6-6 6 6-6 6" />
                                        </Icon>
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handlePayment}
                                    disabled={isSubmitting}
                                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#087E78] px-5 py-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(8,126,120,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#066A65] hover:shadow-[0_12px_25px_rgba(8,126,120,0.23)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:py-[18px] sm:text-[15px]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Đang kết nối PayOS...
                                        </>
                                    ) : (
                                        <>
                                            <Icon className="h-5 w-5">
                                                <rect x="4" y="10" width="16" height="11" rx="2" />
                                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                            </Icon>
                                            <span>
                                                Thanh toán {formatMoney(chargeAmount)} VNĐ
                                            </span>
                                            <Icon className="h-4 w-4 transition-transform group-hover:translate-x-1">
                                                <path d="M5 12h14m-6-6 6 6-6 6" />
                                            </Icon>
                                        </>
                                    )}
                                </button>
                            )}

                            {paymentError && (
                                <div
                                    role="alert"
                                    className="mt-4 rounded-2xl border border-[#F1D7D7] bg-[#FFF6F5] p-4"
                                >
                                    <div className="flex items-start gap-2.5">
                                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#B84F4F]">
                                            <circle cx="12" cy="12" r="9" />
                                            <path d="M12 8v4m0 4h.01" />
                                        </Icon>
                                        <p className="text-xs leading-5 text-[#A04747]">
                                            {paymentError}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            sessionStorage.setItem(
                                                "carelink_pending_payment_booking_id",
                                                bookingId
                                            );
                                            window.location.href = `/payment/success?bookingId=${bookingId}&status=PAID&code=00&sandbox=true`;
                                        }}
                                        className="mt-3 rounded-xl border border-[#D5E6D9] bg-white px-4 py-2.5 text-xs font-bold text-[#087E78] transition hover:bg-[#F0F7F1]"
                                    >
                                        Hoàn tất thanh toán thử nghiệm (Sandbox Mode)
                                    </button>
                                </div>
                            )}

                            {paymentStatus && (
                                <p
                                    role="status"
                                    aria-live="polite"
                                    className="mt-4 rounded-xl bg-[#EFF6F0] px-4 py-3 text-center text-xs font-semibold leading-5 text-[#39775C]"
                                >
                                    {paymentStatus}
                                </p>
                            )}

                            <div className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] leading-5 text-[#98A198]">
                                <Icon className="h-4 w-4 shrink-0 text-[#7B9E86]">
                                    <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
                                    <path d="m9 12 2 2 4-4" />
                                </Icon>
                                Thanh toán được chuyển tiếp qua cổng PayOS.
                            </div>
                        </div>
                    </section>

                    {/* CỘT PHẢI */}
                    <aside className="flex min-w-0 flex-col gap-5 lg:col-span-5 lg:sticky lg:top-6">
                        {/* Cơ chế thanh toán */}
                        <div className="overflow-hidden rounded-[24px] border border-[#D8E6DA] bg-white shadow-[0_8px_30px_rgba(35,61,48,0.035)]">
                            <div className="relative overflow-hidden bg-[#174B40] px-6 py-7 text-white sm:px-7">
                                <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/10" />
                                <div className="pointer-events-none absolute -right-1 -top-7 h-32 w-32 rounded-full border border-white/10" />

                                <div className="relative flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#D4E9D9]">
                                        <Icon className="h-6 w-6">
                                            <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
                                            <path d="m9 12 2 2 4-4" />
                                        </Icon>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B7D6C2]">
                                            CareLink protection
                                        </p>
                                        <h2 className="mt-1.5 text-lg font-bold tracking-tight text-white">
                                            An tâm trong từng giao dịch
                                        </h2>
                                        <p className="mt-2 text-xs leading-5 text-[#D0E0D4]">
                                            Thông tin chi phí rõ ràng và quy trình
                                            thanh toán được trình bày minh bạch.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 p-5 sm:p-6">
                                {[
                                    {
                                        number: "01",
                                        title: "Xác nhận thông tin",
                                        description:
                                            "Kiểm tra lịch hẹn, người nhận chăm sóc và tổng chi phí trước khi thanh toán.",
                                    },
                                    {
                                        number: "02",
                                        title: "Thanh toán qua PayOS",
                                        description:
                                            "Bạn được chuyển đến cổng thanh toán để thực hiện giao dịch theo hướng dẫn.",
                                    },
                                    {
                                        number: "03",
                                        title: "Theo dõi lịch chăm sóc",
                                        description:
                                            "Tiếp tục theo dõi lịch hẹn và trao đổi với điều dưỡng qua CareLink.",
                                    },
                                ].map((item, index) => (
                                    <div key={item.number} className="flex gap-3.5">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DDE9DF] bg-[#EFF6EF] text-[11px] font-bold text-[#518066]">
                                                {item.number}
                                            </div>
                                            {index !== 2 && (
                                                <div className="mt-2 h-full min-h-4 w-px bg-[#E1E9E0]" />
                                            )}
                                        </div>

                                        <div className="pb-1">
                                            <h3 className="text-sm font-bold text-[#34493B]">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1.5 text-xs leading-[1.8] text-[#829086]">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <div className="rounded-2xl border border-[#E5EDE4] bg-[#F7F9F5] p-4">
                                    <div className="flex items-center gap-2 text-[#52765D]">
                                        <Icon className="h-4 w-4">
                                            <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
                                            <path d="m9 12 2 2 4-4" />
                                        </Icon>
                                        <span className="text-xs font-bold">
                                            Minh bạch & dễ theo dõi
                                        </span>
                                    </div>
                                    <p className="mt-2 text-[11px] leading-5 text-[#829086]">
                                        Vui lòng lưu lại thông tin giao dịch và
                                        liên hệ CareLink nếu cần hỗ trợ về lịch hẹn.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bảo mật */}
                        <div className="rounded-[24px] border border-[#E4E9E1] bg-white p-5 shadow-[0_8px_30px_rgba(35,61,48,0.035)] sm:p-6">
                            <div className="flex items-start gap-3.5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EDF5EE] text-[#477B5C]">
                                    <Icon className="h-5 w-5">
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    </Icon>
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-[#34493B]">
                                        Giao dịch có kiểm soát
                                    </h3>
                                    <p className="mt-1.5 text-xs leading-6 text-[#829086]">
                                        Thông tin thanh toán được xử lý thông qua
                                        cổng PayOS. Không chia sẻ mật khẩu ngân
                                        hàng hoặc mã OTP với bất kỳ ai.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Banner hỗ trợ */}
                        <div className="group relative isolate min-h-[190px] overflow-hidden rounded-[24px] bg-[#174B40] shadow-[0_8px_30px_rgba(35,61,48,0.08)]">
                            <img
                                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800"
                                alt="Không gian chăm sóc sức khỏe tại nhà"
                                loading="lazy"
                                className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#123D34]/95 via-[#174B40]/80 to-[#174B40]/25" />

                            <div className="flex min-h-[190px] flex-col justify-between p-6 sm:p-7">
                                <div className="flex items-center gap-2 text-[#C2E1CB]">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10">
                                        <Icon className="h-4 w-4">
                                            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.9L7.7 9.7a16 16 0 0 0 6.6 6.6l1.3-1.3a2 2 0 0 1 1.9-.6l2.8.5a2 2 0 0 1 1.7 2Z" />
                                        </Icon>
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.17em]">
                                        CareLink Support
                                    </span>
                                </div>

                                <div className="mt-7 max-w-[290px]">
                                    <h3 className="text-xl font-bold leading-snug tracking-tight text-white">
                                        Đồng hành cùng gia đình bạn
                                    </h3>
                                    <p className="mt-2 text-xs leading-6 text-white/75">
                                        Nếu gặp khó khăn khi thanh toán, hãy
                                        liên hệ đội ngũ CareLink để được hướng dẫn.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Chú thích quy trình */}
                        <div className="flex items-start gap-3 px-2 py-1">
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#7B9B84]">
                                <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
                                <path d="m9 12 2 2 4-4" />
                            </Icon>
                            <p className="text-[10px] leading-5 text-[#98A197]">
                                Hãy kiểm tra thông tin và điều kiện giao dịch
                                trước khi xác nhận. Các chính sách thực tế phụ
                                thuộc vào cấu hình và quy định của hệ thống.
                            </p>
                        </div>
                    </aside>
                </div>

                {/* Chân trang */}
                <footer className="mt-10 border-t border-[#E3E9E1] pt-6">
                    <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#E6F0E7] text-[#087E78]">
                                <Icon className="h-4 w-4">
                                    <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z" />
                                    <path d="m9 12 2 2 4-4" />
                                </Icon>
                            </span>
                            <span className="text-xs font-bold tracking-wide text-[#53685A]">
                                CareLink
                            </span>
                        </div>

                        <p className="text-[10px] leading-5 text-[#9AA39A]">
                            Kết nối yêu thương · Chăm sóc tận tâm
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
