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
} from "lucide-react";
import familyApi from "../../../api/familyApi";

export default function PaymentResult() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Xác định luồng: Cancel hay Success dựa trên route hoặc query param
    const isCancelRoute = location.pathname.includes("cancel") || searchParams.get("cancel") === "true";

    // Lấy bookingId từ query param hoặc từ sessionStorage đã lưu lúc Checkout
    const bookingId = searchParams.get("bookingId") || sessionStorage.getItem("carelink_pending_payment_booking_id");
    const payOsCode = searchParams.get("code"); // "00" = PayOS gateway báo thành công
    const payOsStatus = searchParams.get("status"); // "PAID", "CANCELLED", etc.
    const orderCode = searchParams.get("orderCode");

    const [payment, setPayment] = useState(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");

    const maxRetries = 4;
    const pollingTimerRef = useRef(null);

    // Hàm gọi Backend để kiểm tra trạng thái thanh toán thực tế (không tin query params)
    const verifyPaymentStatus = useCallback(async (isPolling = false) => {
        if (!bookingId) {
            setLoading(false);
            return;
        }

        if (!isPolling) setVerifying(true);
        setErrorMsg("");

        try {
            // 1. Lấy thông tin thanh toán từ Backend
            const paymentRes = await familyApi.getPaymentDetail(bookingId);
            setPayment(paymentRes);

            // 2. Lấy thông tin chi tiết booking để hiển thị đẹp
            try {
                const bookingRes = await familyApi.getBookingDetail(bookingId);
                setBooking(bookingRes);
            } catch {
                // Không chặn luồng nếu chỉ lỗi lấy chi tiết booking
            }

            // Status: 1 = Pending, 2 = Paid, 3 = Failed, 4 = Refunded
            const status = paymentRes?.status;

            if (status === 2) {
                // Đã thanh toán thành công được Backend xác nhận!
                sessionStorage.removeItem("carelink_pending_payment_booking_id");
                setLoading(false);
                setVerifying(false);
                if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
                return;
            }

            // Nếu vẫn đang Pending mà người dùng từ PayOS trở về báo "00", có thể webhook đến trễ
            if (status === 1 && !isCancelRoute) {
                setRetryCount((prev) => {
                    const next = prev + 1;
                    if (next <= maxRetries) {
                        pollingTimerRef.current = setTimeout(() => {
                            verifyPaymentStatus(true);
                        }, 3000);
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
            console.error("[CareLink] Lỗi xác minh trạng thái thanh toán từ Backend:", err);
            setLoading(false);
            setVerifying(false);
            const status = err.response?.status;
            if (status === 404) {
                setErrorMsg("Chưa tìm thấy thông tin giao dịch thanh toán cho ca chăm sóc này. Nếu bạn vừa thanh toán qua PayOS, hệ thống có thể cần 5-10 giây để nhận webhook. Vui lòng bấm 'Kiểm tra lại'.");
            } else if (status === 401 || status === 403) {
                setErrorMsg("Phiên làm việc hết hạn hoặc bạn không có quyền xem thông tin ca này. Vui lòng đăng nhập lại.");
            } else {
                setErrorMsg("Chưa thể kết nối tới máy chủ để xác minh giao dịch. Vui lòng kiểm tra kết nối mạng và thử lại.");
            }
        }
    }, [bookingId, isCancelRoute]);

    useEffect(() => {
        verifyPaymentStatus();
        return () => {
            if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
        };
    }, [verifyPaymentStatus]);

    // Format tiền tệ
    const formatCurrency = (val) => {
        if (!val && val !== 0) return "---";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    };

    // Format ngày giờ
    const formatDateTime = (val) => {
        if (!val) return "---";
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
            <div className="bg-[#f8fafc] py-16 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex items-center justify-center">
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy thông tin ca chăm sóc</h1>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                        Hệ thống không tìm thấy mã ca tương ứng với phiên thanh toán này. Vui lòng mở lại từ danh sách lịch hẹn để kiểm tra trạng thái.
                    </p>
                    <Link
                        to="/dashboard/appointments"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00677c] hover:bg-[#005566] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                        <span>Xem danh sách lịch hẹn</span>
                    </Link>
                </div>
            </div>
        );
    }

    // =========================================================================
    // TRƯỜNG HỢP 2: Người dùng huỷ thanh toán (Route /payment/cancel hoặc cancel=true)
    // =========================================================================
    if (isCancelRoute && payment?.status !== 2) {
        return (
            <div className="bg-[#f8fafc] py-12 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)]">
                <div className="max-w-xl mx-auto px-4 sm:px-6">
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] p-6 sm:p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 mx-auto mb-4 shadow-inner">
                            <Clock className="w-8 h-8" />
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-800 border border-amber-200 mb-3 inline-block">
                            Chưa hoàn tất thanh toán
                        </span>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Giao dịch đã được tạm dừng</h1>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-md mx-auto">
                            Bạn đã hủy hoặc chưa hoàn tất thao tác thanh toán trên cổng PayOS. Ca chăm sóc của bạn vẫn được lưu giữ trong vòng 30 phút kể từ lúc đặt.
                        </p>

                        {/* Thẻ tóm tắt ca */}
                        {booking && (
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 text-left text-sm space-y-2.5">
                                <div className="flex justify-between items-center text-slate-500">
                                    <span>Dịch vụ:</span>
                                    <span className="font-semibold text-slate-800">{booking.serviceName || "Chăm sóc gia đình"}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span>Điều dưỡng:</span>
                                    <span className="font-semibold text-slate-800">{booking.nurseName || "Chuyên viên CareLink"}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span>Thời gian:</span>
                                    <span className="font-semibold text-slate-800">{formatDateTime(booking.scheduledStart)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-slate-800 font-bold">
                                    <span>Tổng số tiền:</span>
                                    <span className="text-[#00677c] text-base">{formatCurrency(booking.totalPrice)}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                type="button"
                                onClick={() => navigate(`/checkout?bookingId=${bookingId}`)}
                                className="px-5 py-2.5 bg-[#00677c] hover:bg-[#005566] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>Tiếp tục thanh toán</span>
                            </button>
                            <Link
                                to="/dashboard/appointments"
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Quay về Lịch hẹn</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // TRƯỜNG HỢP 3: Đang xác minh hoặc Webhook đang đồng bộ (Pending)
    // =========================================================================
    if (loading || (payment?.status === 1 && retryCount < maxRetries)) {
        return (
            <div className="bg-[#f8fafc] py-16 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)] flex items-center justify-center">
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[#00677c] mx-auto mb-4 animate-spin">
                        <RefreshCw className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Đang xác minh giao dịch...</h1>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                        Hệ thống đang đối soát dữ liệu với cổng thanh toán an toàn PayOS. Quá trình này thường diễn ra trong vài giây.
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
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
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
    // TRƯỜNG HỢP 4: Thanh toán THÀNH CÔNG (Backend xác nhận status === 2)
    // =========================================================================
    if (payment?.status === 2) {
        return (
            <div className="bg-[#f8fafc] py-12 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)]">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_-8px_rgba(0,103,124,0.12)] p-6 sm:p-10 text-center relative overflow-hidden">
                        {/* Gradient viền đỉnh */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-[#00677c] to-teal-500" />

                        {/* Huy hiệu thành công */}
                        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-sm">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>

                        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3 inline-block">
                            Đã xác nhận thanh toán
                        </span>

                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Thanh toán thành công!</h1>
                        <p className="text-slate-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                            Lịch chăm sóc đã được hệ thống và điều dưỡng xác nhận. Bạn có thể theo dõi tiến trình và trao đổi trực tiếp với điều dưỡng qua kênh Chat.
                        </p>

                        {/* Thẻ chi tiết hóa đơn & ca chăm sóc */}
                        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 text-left mb-8 space-y-3">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-sm">
                                <span className="text-slate-500">Mã giao dịch PayOS:</span>
                                <span className="font-mono font-semibold text-slate-800">{payment.paymentCode || orderCode || "CL-" + bookingId.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Dịch vụ chăm sóc:</span>
                                <span className="font-semibold text-slate-800">{booking?.serviceName || "Gói chăm sóc gia đình"}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Điều dưỡng phụ trách:</span>
                                <span className="font-semibold text-slate-800">{booking?.nurseName || "Chuyên viên CareLink"}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Thời gian ca:</span>
                                <span className="font-semibold text-slate-800">{formatDateTime(booking?.scheduledStart)}</span>
                            </div>
                            {booking?.addressSnapshot && (
                                <div className="flex items-start justify-between text-sm pt-1">
                                    <span className="text-slate-500 shrink-0">Địa chỉ:</span>
                                    <span className="font-medium text-slate-700 text-right max-w-xs">{booking.addressSnapshot}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-200 font-bold text-base text-slate-900">
                                <span>Số tiền đã thanh toán:</span>
                                <span className="text-emerald-700 text-lg font-bold">{formatCurrency(payment.amount)}</span>
                            </div>
                        </div>

                        {/* Điều hướng hành động */}
                        <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                            <Link
                                to="/dashboard/appointments"
                                className="px-6 py-3 bg-[#00677c] hover:bg-[#005566] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Xem lịch hẹn của tôi</span>
                            </Link>
                            <Link
                                to="/dashboard/chat"
                                className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
                            >
                                <MessageSquare className="w-4 h-4 text-[#00677c]" />
                                <span>Nhắn tin với Điều dưỡng</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // TRƯỜNG HỢP 5: Thanh toán THẤT BẠI hoặc HẾT HẠN
    // =========================================================================
    return (
        <div className="bg-[#f8fafc] py-12 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)]">
            <div className="max-w-xl mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto mb-4">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 mb-3 inline-block">
                        Giao dịch chưa hoàn tất
                    </span>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Thanh toán chưa thành công</h1>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-md mx-auto">
                        {errorMsg || "Giao dịch thanh toán chưa được xác nhận bởi cổng PayOS hoặc ca chăm sóc đã hết thời gian giữ chỗ. Bạn có thể kiểm tra lại trạng thái hoặc thử lại."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            type="button"
                            onClick={() => verifyPaymentStatus(false)}
                            disabled={verifying}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <RefreshCw className={`w-4 h-4 ${verifying ? "animate-spin" : ""}`} />
                            <span>Kiểm tra lại</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/checkout?bookingId=${bookingId}`)}
                            className="px-5 py-2.5 bg-[#00677c] hover:bg-[#005566] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>Thử thanh toán lại</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
