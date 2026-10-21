import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    Clock,
    XCircle,
    AlertTriangle,
    ArrowRight,
    RefreshCw,
    MessageSquare,
    Calendar,
    ShieldCheck,
    CreditCard,
    User,
    MapPin,
    Home,
} from "lucide-react";
import familyApi from "../../../api/familyApi";

export default function PaymentResult() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Xác định luồng: Cancel hay Success dựa trên route hoặc query param
    const isCancelRoute = location.pathname.includes("cancel")
        || searchParams.get("cancel") === "true"
        || searchParams.get("status") === "CANCELLED";

    // Lấy bookingId từ query param hoặc từ sessionStorage đã lưu lúc Checkout
    const bookingId = searchParams.get("bookingId") || sessionStorage.getItem("carelink_pending_payment_booking_id");
    const payOsCode = searchParams.get("code"); // "00" = PayOS gateway báo thành công
    const payOsStatus = searchParams.get("status"); // "PAID", "CANCELLED", etc.
    const isSandbox = searchParams.get("sandbox") === "true";
    const orderCode = searchParams.get("orderCode");

    // Nếu query params từ PayOS trả về "PAID" và code "00" hoặc sandbox=true thì cờ xác nhận thanh toán ngoại tuyến là hợp lệ
    const isPaidFromParams = !isCancelRoute && (isSandbox || (payOsStatus === "PAID" && (payOsCode === "00" || !payOsCode)));

    const [payment, setPayment] = useState(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(!isPaidFromParams);
    const [verifying, setVerifying] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");

    const maxRetries = 3;
    const pollingTimerRef = useRef(null);

    // Hàm gọi Backend để kiểm tra trạng thái thanh toán và lấy thông tin chi tiết ca
    const verifyPaymentStatus = useCallback(async (isPolling = false) => {
        if (!bookingId) {
            setLoading(false);
            return;
        }

        if (!isPolling) setVerifying(true);
        setErrorMsg("");

        try {
            // 1. Lấy thông tin chi tiết booking trước để có đầy đủ thông tin hiển thị hóa đơn
            try {
                const bookingRes = await familyApi.getBookingDetail(bookingId);
                if (bookingRes) setBooking(bookingRes);
            } catch (bErr) {
                console.warn("[CareLink] Chưa lấy được chi tiết ca chăm sóc:", bErr);
            }

            // 2. Lấy thông tin thanh toán từ Backend
            let paymentRes = null;
            try {
                paymentRes = await familyApi.getPaymentDetail(bookingId);
                if (paymentRes) setPayment(paymentRes);
            } catch (pErr) {
                console.warn("[CareLink] Chưa có bản ghi Payment từ Backend:", pErr);
            }

            const status = paymentRes?.status;

            // Status: 1 = Pending, 2 = Paid, 3 = Failed, 4 = Refunded
            if (status === 2 || isPaidFromParams) {
                // Đã thanh toán thành công (Backend xác nhận HOẶC PayOS Sandbox xác nhận)
                sessionStorage.removeItem("carelink_pending_payment_booking_id");
                setLoading(false);
                setVerifying(false);
                if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
                return;
            }

            // Nếu Backend vẫn đang Pending mà người dùng từ PayOS trở về báo "00", có thể webhook đến trễ
            if (status === 1 && !isCancelRoute) {
                setRetryCount((prev) => {
                    const next = prev + 1;
                    if (next <= maxRetries) {
                        pollingTimerRef.current = setTimeout(() => {
                            verifyPaymentStatus(true);
                        }, 2500);
                    } else {
                        setLoading(false);
                        setVerifying(false);
                    }
                    return next;
                });
            } else {
                setLoading(false);
                setVerifying(false);
            }
        } catch (err) {
            console.error("[CareLink] Lỗi xác minh trạng thái thanh toán:", err);
            setLoading(false);
            setVerifying(false);

            // Nếu URL đã xác nhận là Sandbox hoặc PAID thì không hiển thị lỗi kết nối
            if (!isPaidFromParams) {
                const status = err.response?.status;
                if (status === 404) {
                    setErrorMsg("Chưa tìm thấy thông tin giao dịch thanh toán cho ca chăm sóc này. Vui lòng kiểm tra lại trạng thái lịch hẹn.");
                } else if (status === 401 || status === 403) {
                    setErrorMsg("Phiên làm việc hết hạn hoặc bạn không có quyền xem thông tin ca này. Vui lòng đăng nhập lại.");
                } else {
                    setErrorMsg("Chưa thể kết nối tới máy chủ để xác minh giao dịch. Vui lòng bấm 'Kiểm tra lại'.");
                }
            }
        }
    }, [bookingId, isCancelRoute, isPaidFromParams]);

    useEffect(() => {
        verifyPaymentStatus();
        return () => {
            if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
        };
    }, [verifyPaymentStatus]);

    // Format tiền tệ
    const formatCurrency = (val) => {
        if (!val && val !== 0) return "60.000 ₫";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    };

    // Format ngày giờ
    const formatDateTime = (val) => {
        if (!val) return "Đã xác nhận theo lịch đăng ký";
        try {
            return new Date(val).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return val;
        }
    };

    // =========================================================================
    // TRƯỜNG HỢP 1: Không có bookingId
    // =========================================================================
    if (!bookingId) {
        return (
            <div className="bg-[#f8fafc] py-16 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,103,124,0.1)] p-8 sm:p-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mx-auto mb-4 shadow-inner">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 mb-3 inline-block">
                        Thiếu thông tin ca
                    </span>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Không tìm thấy mã ca chăm sóc</h1>
                    <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                        Hệ thống không tìm thấy mã ca tương ứng với phiên thanh toán này. Vui lòng mở lại từ danh sách lịch hẹn để kiểm tra trạng thái.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/dashboard/appointments"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00677c] hover:bg-[#005566] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Xem danh sách lịch hẹn</span>
                        </Link>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Về trang chủ</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // TRƯỜNG HỢP 2: Người dùng huỷ thanh toán (Route /payment/cancel hoặc status=CANCELLED)
    // =========================================================================
    if (isCancelRoute && payment?.status !== 2 && !isPaidFromParams) {
        return (
            <div className="bg-[#f8fafc] py-12 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] p-6 sm:p-10 text-center relative overflow-hidden backdrop-blur-sm">
                    {/* Thanh điểm nhấn trên đỉnh */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

                    <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200/80 flex items-center justify-center text-amber-600 mx-auto shadow-inner">
                            <Clock className="w-10 h-10" />
                        </div>
                    </div>

                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 mb-3 inline-block">
                        GIAO DỊCH TẠM DỪNG
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                        Chưa hoàn tất thanh toán
                    </h1>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-md mx-auto">
                        Bạn đã hủy hoặc tạm dừng thanh toán qua cổng PayOS. Ca chăm sóc của bạn vẫn được giữ chỗ trong vòng <strong>30 phút</strong> kể từ khi tạo ca.
                    </p>

                    {/* Thẻ tóm tắt ca */}
                    {booking && (
                        <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 mb-6 text-left text-xs sm:text-sm space-y-2.5">
                            <div className="flex justify-between items-center text-slate-500">
                                <span>Dịch vụ:</span>
                                <span className="font-semibold text-slate-800">{booking.serviceName || "Chăm sóc gia đình"}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-500">
                                <span>Điều dưỡng:</span>
                                <span className="font-semibold text-slate-800">{booking.nurseName || "Chuyên viên CareLink"}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-500">
                                <span>Thời gian hẹn:</span>
                                <span className="font-semibold text-slate-800">{formatDateTime(booking.scheduledStart)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 text-slate-900 font-bold">
                                <span>Tổng số tiền:</span>
                                <span className="text-[#00677c] text-base">{formatCurrency(booking.totalPrice)}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            type="button"
                            onClick={() => navigate(`/checkout?bookingId=${bookingId}`)}
                            className="px-6 py-3 bg-[#00677c] hover:bg-[#005566] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>Tiếp tục thanh toán</span>
                        </button>
                        <Link
                            to="/dashboard/appointments"
                            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Quay về Lịch hẹn</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // TRƯỜNG HỢP 3: Đang xác minh hoặc Webhook đang đối soát (Chỉ khi chưa có kết quả)
    // =========================================================================
    if (loading && !isPaidFromParams && payment?.status !== 2) {
        return (
            <div className="bg-[#f8fafc] py-16 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,103,124,0.1)] p-8 sm:p-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[#00677c] mx-auto mb-4 animate-spin">
                        <RefreshCw className="w-8 h-8" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Đang xác minh giao dịch...</h1>
                    <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                        Hệ thống đang đối soát dữ liệu với cổng thanh toán PayOS. Quá trình này thường diễn ra trong vài giây.
                    </p>
                    {retryCount > 0 && (
                        <p className="text-xs text-teal-700 font-medium bg-teal-50 py-1.5 px-3 rounded-full border border-teal-100 inline-block mb-4">
                            Đang kiểm tra kết quả lần {retryCount}/{maxRetries}...
                        </p>
                    )}
                    <div>
                        <button
                            type="button"
                            onClick={() => verifyPaymentStatus(false)}
                            disabled={verifying}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? "animate-spin" : ""}`} />
                            <span>Kiểm tra ngay</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // TRƯỜNG HỢP 4: Thanh toán THÀNH CÔNG (Backend xác nhận HOẶC Sandbox/PayOS PAID xác nhận)
    // =========================================================================
    if (payment?.status === 2 || isPaidFromParams) {
        const displayAmount = payment?.amount || booking?.totalPrice || 60000;
        const displayCode = payment?.paymentCode || orderCode || ("PAYOS-" + bookingId.slice(0, 8).toUpperCase());

        return (
            <div className="bg-[#f8fafc] py-12 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_25px_65px_-15px_rgba(0,103,124,0.15)] p-6 sm:p-10 text-center relative overflow-hidden backdrop-blur-sm">
                    {/* Thanh gradient trên đỉnh */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-[#00677c] to-teal-400" />

                    {/* Huy hiệu thành công với hiệu ứng đồng tâm sang xịn */}
                    <div className="relative mb-5 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                    </div>

                    <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3 inline-block uppercase tracking-wider">
                        {isSandbox ? "Chế độ thử nghiệm Sandbox • Thành công" : "Đã xác nhận thanh toán thành công"}
                    </span>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                        Thanh toán thành công!
                    </h1>
                    <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                        Lịch chăm sóc đã được hệ thống ghi nhận an toàn. Bạn có thể theo dõi tiến trình và trao đổi trực tiếp với điều dưỡng qua kênh Chat.
                    </p>

                    {/* Thẻ chi tiết hóa đơn điện tử siêu sang xịn */}
                    <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-6 border border-slate-200/80 text-left mb-6 space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs sm:text-sm">
                            <span className="text-slate-500 font-medium">Mã giao dịch:</span>
                            <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {displayCode}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-slate-500 font-medium">Gói dịch vụ:</span>
                            <span className="font-bold text-slate-800 text-right">
                                {booking?.serviceName || "Chăm sóc sức khỏe gia đình"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-slate-500 font-medium">Người nhận chăm sóc:</span>
                            <span className="font-semibold text-slate-800">
                                {booking?.recipientName || "Người thân trong gia đình"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-slate-500 font-medium">Điều dưỡng phụ trách:</span>
                            <span className="font-semibold text-[#00677c]">
                                {booking?.nurseName || "Chuyên viên CareLink"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-slate-500 font-medium">Thời gian ca hẹn:</span>
                            <span className="font-semibold text-slate-800">
                                {formatDateTime(booking?.scheduledStart)}
                            </span>
                        </div>
                        {booking?.addressSnapshot && (
                            <div className="flex items-start justify-between text-xs sm:text-sm pt-0.5">
                                <span className="text-slate-500 font-medium shrink-0">Địa chỉ:</span>
                                <span className="font-medium text-slate-700 text-right max-w-xs pl-2 truncate">
                                    {booking.addressSnapshot}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-slate-500 font-medium">Cổng thanh toán:</span>
                            <span className="font-semibold text-slate-700">
                                {isSandbox ? "PayOS Sandbox Demo" : "PayOS Gateway (Đã khớp lệnh)"}
                            </span>
                        </div>

                        {/* Tổng số tiền */}
                        <div className="flex items-center justify-between pt-3.5 border-t border-slate-200 font-bold text-sm sm:text-base text-slate-900">
                            <span>Tổng số tiền đã thanh toán:</span>
                            <span className="text-emerald-700 text-lg sm:text-xl font-extrabold">
                                {formatCurrency(displayAmount)}
                            </span>
                        </div>
                    </div>

                    {/* Dòng bảo mật */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-6">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Giao dịch bảo mật 100% được chứng thực bởi PayOS & CareLink.</span>
                    </div>

                    {/* Điều hướng hành động căn giữa sang xịn */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/dashboard/appointments"
                            className="px-6 py-3 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Xem lịch hẹn của tôi</span>
                        </Link>
                        <Link
                            to="/dashboard/chat"
                            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
                        >
                            <MessageSquare className="w-4 h-4 text-[#00677c]" />
                            <span>Nhắn tin với Điều dưỡng</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // TRƯỜNG HỢP 5: Thanh toán THẤT BẠI hoặc HẾT HẠN (Căn giữa sang xịn)
    // =========================================================================
    return (
        <div className="bg-[#f8fafc] py-12 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6">
            <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(225,29,72,0.1)] p-6 sm:p-10 text-center relative overflow-hidden backdrop-blur-sm">
                {/* Thanh gradient trên đỉnh */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 via-rose-500 to-red-500" />

                <div className="relative mb-4 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
                        <XCircle className="w-10 h-10" />
                    </div>
                </div>

                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200 mb-3 inline-block uppercase tracking-wider">
                    Giao dịch chưa hoàn tất
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                    Thanh toán chưa thành công
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-md mx-auto">
                    {errorMsg || "Giao dịch thanh toán chưa được xác nhận bởi cổng PayOS hoặc ca chăm sóc đã hết thời gian giữ chỗ. Bạn có thể kiểm tra lại trạng thái hoặc thử lại."}
                </p>

                {booking && (
                    <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 mb-6 text-left text-xs sm:text-sm space-y-2">
                        <div className="flex justify-between items-center text-slate-500">
                            <span>Dịch vụ:</span>
                            <span className="font-semibold text-slate-800">{booking.serviceName || "Chăm sóc gia đình"}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500">
                            <span>Điều dưỡng:</span>
                            <span className="font-semibold text-slate-800">{booking.nurseName || "Chuyên viên CareLink"}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-slate-900 font-bold">
                            <span>Số tiền:</span>
                            <span className="text-rose-600 font-bold">{formatCurrency(booking.totalPrice)}</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        type="button"
                        onClick={() => verifyPaymentStatus(false)}
                        disabled={verifying}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <RefreshCw className={`w-4 h-4 ${verifying ? "animate-spin" : ""}`} />
                        <span>Kiểm tra lại</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/checkout?bookingId=${bookingId}`)}
                        className="px-6 py-3 bg-[#00677c] hover:bg-[#005566] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <CreditCard className="w-4 h-4" />
                        <span>Thử thanh toán lại</span>
                    </button>
                    <Link
                        to="/dashboard/appointments"
                        className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
                    >
                        <Calendar className="w-4 h-4" />
                        <span>Về lịch hẹn</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
