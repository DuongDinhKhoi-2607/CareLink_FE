import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Phone,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
    CreditCard,
    MessageSquare,
    X,
    Stethoscope,
    Loader2,
    Sparkles,
    AlertCircle,
    Award,
    Star
} from "lucide-react";
import ViewHealthRecordModal from "../components/ViewHealthRecordModal";
import CreateDisputeModal from "../components/CreateDisputeModal";
import CancelBookingModal from "../components/CancelBookingModal";
import Toast from "../../../components/Toast";
import familyApi from "../../../api/familyApi";

const getConfirmedPaidBookings = () => {
    try {
        return JSON.parse(localStorage.getItem("carelink_confirmed_paid_bookings") || "{}");
    } catch {
        return {};
    }
};

const parseStatus = (val) => {
    if (typeof val === "number") return val;
    const s = String(val || "").trim().toLowerCase();
    if (s === "pendingpayment" || s === "1") return 1;
    if (s === "pendingacceptance" || s === "2") return 2;
    if (s === "accepted" || s === "3") return 3;
    if (s === "inprogress" || s === "in_progress" || s === "4") return 4;
    if (s === "completed" || s === "5") return 5;
    if (s === "canceled" || s === "cancelled" || s === "6") return 6;
    if (s === "disputed" || s === "7") return 7;
    return 1;
};

// Adapter chuyển đổi BookingResponse từ Backend sang cấu trúc hiển thị của giao diện Family
const mapBookingToAppointment = (b) => {
    let rawStatus = parseStatus(b.status);
    const paidMap = getConfirmedPaidBookings();
    const isLocalPaid = Boolean(b.id && paidMap[b.id]);
    // Chỉ áp dụng cờ local paid nếu ca thực sự đang ở trạng thái PendingPayment (1), tuyệt đối KHÔNG ghi đè khi đã Canceled (6) hoặc Completed (5)
    if (rawStatus === 1 && isLocalPaid) {
        // Đã thanh toán thành công qua PayOS: chuyển sang Đã tiếp nhận (Accepted) nếu từ Proposal hoặc Chờ điều dưỡng nhận
        rawStatus = b.conversationId ? 3 : 2;
    }

    const createdAtMs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    const isPaymentExpired = rawStatus === 1 && createdAtMs > 0 && (Date.now() - createdAtMs) > 30 * 60 * 1000;

    let tab = "upcoming";
    let statusLabel = "ĐÃ TIẾP NHẬN";
    let statusBadge = "bg-[#e2f4f2] text-[#007469]";
    let dotColor = "bg-[#00a896]";
    let canCancel = true;
    let statusStr = "confirmed";

    if (rawStatus === 1) { // PendingPayment
        if (isPaymentExpired) {
            tab = "cancelled";
            statusLabel = "HẾT HẠN GIỮ CHỖ (30P)";
            statusBadge = "bg-rose-50 text-rose-700 border border-rose-200";
            dotColor = "bg-rose-500";
            canCancel = false;
            statusStr = "expired";
        } else {
            tab = "upcoming";
            statusLabel = "CHỜ THANH TOÁN";
            statusBadge = "bg-amber-50 text-amber-700 border border-amber-200";
            dotColor = "bg-amber-500";
            canCancel = true;
            statusStr = "pending_payment";
        }
    } else if (rawStatus === 2) { // PendingAcceptance
        tab = "upcoming";
        statusLabel = "CHỜ ĐIỀU DƯỠNG NHẬN";
        statusBadge = "bg-blue-50 text-blue-700 border border-blue-200";
        dotColor = "bg-blue-500";
        canCancel = true;
        statusStr = "pending";
    } else if (rawStatus === 3) { // Accepted
        tab = "upcoming";
        statusLabel = "ĐÃ TIẾP NHẬN";
        statusBadge = "bg-[#e2f4f2] text-[#007469]";
        dotColor = "bg-[#00a896]";
        canCancel = true;
        statusStr = "confirmed";
    } else if (rawStatus === 4) { // InProgress
        tab = "ongoing";
        statusLabel = "ĐANG DIỄN RA";
        statusBadge = "bg-teal-50 text-teal-700 ring-1 ring-teal-500/20";
        dotColor = "bg-teal-500 animate-ping";
        canCancel = false;
        statusStr = "in_progress";
    } else if (rawStatus === 5) { // Completed
        tab = "completed";
        statusLabel = "ĐÃ HOÀN THÀNH";
        statusBadge = "bg-slate-100 text-slate-700";
        dotColor = "bg-slate-400";
        canCancel = false;
        statusStr = "completed";
    } else if (rawStatus === 6) { // Canceled
        tab = "cancelled";
        statusLabel = "ĐÃ HỦY";
        statusBadge = "bg-rose-50 text-rose-700 border border-rose-200";
        dotColor = "bg-rose-500";
        canCancel = false;
        statusStr = "cancelled";
    } else if (rawStatus === 7) { // Disputed
        tab = "completed";
        statusLabel = "ĐANG KHIẾU NẠI";
        statusBadge = "bg-purple-50 text-purple-700 border border-purple-200";
        dotColor = "bg-purple-500";
        canCancel = false;
        statusStr = "disputed";
    }

    // Nghiệm thu 2 chiều: Nếu điều dưỡng đã xác nhận nhưng khách hàng chưa ký nghiệm thu
    const needsCustomerConfirm = (rawStatus === 4 || rawStatus === 5) && Boolean(b.nurseConfirmedAt) && !Boolean(b.customerConfirmedAt);
    if (needsCustomerConfirm) {
        tab = "ongoing";
        statusLabel = "CHỜ BẠN NGHIỆM THU";
        statusBadge = "bg-amber-100 text-amber-900 border border-amber-300 font-bold";
        dotColor = "bg-amber-500 animate-pulse";
        canCancel = false;
        statusStr = "needs_confirm";
    }

    const startDate = b.scheduledStart ? new Date(b.scheduledStart) : new Date();
    const endDate = b.scheduledEnd ? new Date(b.scheduledEnd) : null;
    const formattedDate = startDate.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    const startTimeStr = startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const endTimeStr = endDate ? endDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";
    const timeDisplay = endTimeStr ? `${startTimeStr} – ${endTimeStr}` : startTimeStr;

    return {
        id: b.id,
        rawId: b.id,
        nurseId: b.nurseId || null, // ID điều dưỡng — dùng để xem profile & đánh giá
        tab,
        caregiver: {
            name: b.nurseName || "Điều dưỡng CareLink",
            role: "Điều dưỡng chuyên môn CareLink",
            avatar: (b.nurseAvatarUrl && !b.nurseAvatarUrl.includes("unsplash"))
                ? b.nurseAvatarUrl
                : (b.nurseAvatar && !b.nurseAvatar.includes("unsplash"))
                ? b.nurseAvatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(b.nurseName || "Điều dưỡng")}&background=00677c&color=fff&size=160&bold=true`,
            verified: true,
            phone: b.nursePhone || "0903 888 999",
        },
        customerName: b.customerName || "Gia đình",
        customerAvatar: (b.customerAvatarUrl && !b.customerAvatarUrl.includes("unsplash"))
            ? b.customerAvatarUrl
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(b.customerName || "Khách hàng")}&background=087487&color=fff&size=160&bold=true`,
        customerPhone: b.customerPhone || "",
        service: b.serviceName || "Chăm sóc theo yêu cầu",
        services: Array.isArray(b.services) ? b.services : [],
        platformFee: b.platformFee ?? 60000,
        serviceCategory: "health_care",
        recipient: b.recipientName || "Người thân",
        recipientRelation: "Người nhận chăm sóc",
        date: formattedDate,
        time: timeDisplay,
        duration: "Theo ca",
        location: b.addressSnapshot || "Địa chỉ gia đình",
        status: statusStr,
        statusLabel,
        statusBadge,
        dotColor,
        canCancel,
        canPay: rawStatus === 1 && !isPaymentExpired,
        isPaymentExpired,
        price: b.totalPrice ? Number(b.totalPrice).toLocaleString("vi-VN") + "đ" : "0đ",
        // Luồng 4: Nghiệm thu 2 chiều
        needsCustomerConfirm,
        nurseConfirmedAt: b.nurseConfirmedAt ? new Date(b.nurseConfirmedAt) : null,
        customerConfirmedAt: b.customerConfirmedAt ? new Date(b.customerConfirmedAt) : null,
        // Luồng 5: GPS Check-in & thời gian điều dưỡng bắt đầu ca
        startedAt: b.startedAt ? new Date(b.startedAt) : null,
        checkInLatitude: b.checkInLatitude ?? null,
        checkInLongitude: b.checkInLongitude ?? null,
        checkInNote: b.checkInNote ?? null,
        tasks: ["Đo huyết áp & sinh hiệu", "Theo dõi sức khỏe theo đơn", "Ghi nhật ký thể trạng"],
        // reviewed: backend trả về true nếu khách đã gửi review cho ca này
        reviewed: b.isReviewed || b.reviewed || false,
        reviewRating: b.reviewRating || b.customerRating || null,
        dispute: b.dispute || (rawStatus === 7 ? {
            id: b.disputeId || `DSP-${b.id}`,
            code: `DSP-${b.id}`,
            bookingId: b.id,
            status: "Đang xác minh",
            reason: b.disputeReason || "Gia đình đã gửi khiếu nại đối soát cho ca trực.",
        } : null),
        rawBackendData: b
    };
};

export default function Appointments() {
    const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
    const [searchQuery, setSearchQuery] = useState("");
    const [serviceFilter, setServiceFilter] = useState("all");
    const [monthFilter, setMonthFilter] = useState("all_months");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedAppointment, setSelectedAppointment] = useState(null); // Cho modal xem chi tiết
    const [detailData, setDetailData] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [viewingHealthRecord, setViewingHealthRecord] = useState(null); // Cho modal xem báo cáo sức khỏe
    const [disputingAppointment, setDisputingAppointment] = useState(null); // Cho modal khiếu nại
    const [viewingDispute, setViewingDispute] = useState(null); // Cho modal xem tiến độ khiếu nại
    const [cancellingAppointment, setCancellingAppointment] = useState(null); // Cho modal xác nhận hủy ca
    const [confirmingAppointment, setConfirmingAppointment] = useState(null); // Cho modal nghiệm thu 2 chiều
    const [isSubmittingConfirm, setIsSubmittingConfirm] = useState(false);
    const [confirmRating, setConfirmRating] = useState(5);
    const [confirmFeedback, setConfirmFeedback] = useState("");
    const [confirmAgreement, setConfirmAgreement] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);

    // Mở modal xem chi tiết và nạp dữ liệu chi tiết ca mới nhất từ Backend (GET /api/v1/bookings/{id})
    const handleOpenDetailModal = async (apt) => {
        setSelectedAppointment(apt);
        setDetailData(null);
        setLoadingDetail(true);
        try {
            const id = apt.rawId || apt.id;
            const res = await familyApi.getBookingDetail(id);
            if (res) {
                setDetailData(res);
            }
        } catch (err) {
            console.warn("[CareLink] Lỗi tải chi tiết ca hẹn:", err);
        } finally {
            setLoadingDetail(false);
        }
    };

    // Nghiệm thu 2 chiều: Khách hàng ký xác nhận hoàn tất ca & đánh giá chất lượng
    const handleConfirmBooking = async (e) => {
        if (e) e.preventDefault();
        if (!confirmingAppointment) return;
        setIsSubmittingConfirm(true);
        try {
            const bookingId = confirmingAppointment.rawId || confirmingAppointment.id;
            await familyApi.customerConfirmBooking(bookingId, {
                feedback: confirmFeedback.trim() || undefined,
            });

            if (confirmRating > 0) {
                await familyApi.createReview(bookingId, {
                    overallRating: confirmRating,
                    careQualityRating: confirmRating,
                    comment: confirmFeedback.trim() || "Dịch vụ chăm sóc chu đáo, tận tâm!",
                }).catch(() => {});
            }

            setToastMessage("Ký nghiệm thu thành công! Tiền ca trực đã được giải ngân cho điều dưỡng.");
            setConfirmingAppointment(null);
            setConfirmFeedback("");
            setConfirmRating(5);
            fetchAppointments();
        } catch (err) {
            console.error("Lỗi ký nghiệm thu:", err);
            const msg = err.response?.data?.detail || err.response?.data?.message || "Không thể nghiệm thu lúc này. Vui lòng thử lại.";
            setToastMessage(msg);
        } finally {
            setIsSubmittingConfirm(false);
        }
    };

    // Trạng thái dữ liệu thực từ Backend API
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    // 1. Tải danh sách ca chăm sóc từ Backend (GET /api/v1/bookings)
    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const res = await familyApi.getBookings({ PageNumber: 1, PageSize: 50 });
            const items = res?.items || (Array.isArray(res) ? res : []);
            const mapped = items.map(mapBookingToAppointment);
            setAppointments(mapped);

            // Tự động kiểm tra đối soát ngầm cho các ca đang ở trạng thái PendingPayment (1)
            const pendingList = items.filter((b) => parseStatus(b.status) === 1);
            if (pendingList.length > 0) {
                pendingList.forEach(async (pb) => {
                    try {
                        const payRes = await familyApi.getPaymentDetail(pb.id);
                        if (payRes?.status === 2) {
                            const paidMap = getConfirmedPaidBookings();
                            paidMap[pb.id] = { paidAt: Date.now(), status: 2 };
                            localStorage.setItem("carelink_confirmed_paid_bookings", JSON.stringify(paidMap));
                            setAppointments((prev) =>
                                prev.map((item) => {
                                    if ((item.rawId || item.id) === pb.id) {
                                        return mapBookingToAppointment({
                                            ...item.rawBackendData,
                                            status: pb.conversationId ? 3 : 2,
                                        });
                                    }
                                    return item;
                                })
                            );
                        }
                    } catch (e) {
                        // Silent check
                    }
                });
            }
        } catch (err) {
            console.warn("[CareLink] Tải danh sách booking thất bại:", err);
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Không thể kết nối đến máy chủ để tải lịch hẹn.";
            setApiError(msg);

            const status = err.response?.status;
            if (status === 401 || status === 403) {
                setApiError("Phiên làm việc đã hết hạn hoặc bạn chưa đăng nhập tài khoản gia đình.");
            }
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Xử lý Hủy ca hẹn qua Backend API (PUT /api/v1/bookings/{id}/cancel) từ CancelBookingModal
    const handleConfirmCancelBooking = async (id, reason) => {
        try {
            await familyApi.cancelBooking(id, { reason });
            // 1. Xóa ngay cờ localStorage để không bao giờ ghi đè lại trạng thái hủy
            try {
                const paidMap = getConfirmedPaidBookings();
                if (paidMap[id]) {
                    delete paidMap[id];
                    localStorage.setItem("carelink_confirmed_paid_bookings", JSON.stringify(paidMap));
                }
            } catch {}

            // 2. Cập nhật optimistic trạng thái hủy ngay lập tức trên UI
            setAppointments((prev) =>
                prev.map((item) => {
                    const itemId = item.rawId || item.id;
                    if (itemId === id) {
                        return {
                            ...item,
                            tab: "cancelled",
                            status: "cancelled",
                            statusLabel: "ĐÃ HỦY",
                            statusBadge: "bg-rose-50 text-rose-700 border border-rose-200",
                            dotColor: "bg-rose-500",
                            canCancel: false,
                            cancelReason: reason,
                        };
                    }
                    return item;
                })
            );

            setToastMessage({
                type: "success",
                title: "Đã hủy ca chăm sóc thành công",
                message: `Lịch hẹn #${id} đã được hủy. Hệ thống đã cập nhật trạng thái ca.`,
            });
            await fetchAppointments();
        } catch (err) {
            console.error("[CareLink] Lỗi khi hủy ca:", err);
            let errorMsg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Không thể hủy ca chăm sóc lúc này. Vui lòng kiểm tra lại kết nối mạng hoặc chính sách hủy ca.";
            if (errorMsg.includes("A booking in status 'Canceled' can no longer be canceled") || errorMsg.includes("đã ở trạng thái đã hủy")) {
                errorMsg = "Lịch hẹn này đã ở trạng thái đã hủy trước đó, không thể hủy lại.";
                // Cập nhật lại UI sang trạng thái đã hủy
                setAppointments((prev) =>
                    prev.map((item) =>
                        (item.rawId || item.id) === id
                            ? {
                                  ...item,
                                  tab: "cancelled",
                                  status: "cancelled",
                                  statusLabel: "ĐÃ HỦY",
                                  statusBadge: "bg-rose-50 text-rose-700 border border-rose-200",
                                  dotColor: "bg-rose-500",
                                  canCancel: false,
                              }
                            : item
                    )
                );
            }
            throw new Error(errorMsg);
        }
    };

    // ── 73. GET /api/v1/disputes/{id} ── Xem chi tiết khiếu nại
    const handleViewDispute = async (dispute, apt) => {
        const initial = {
            id: dispute.id || `DSP-${apt.id}`,
            code: dispute.code || `DSP-${apt.id}`,
            bookingId: apt.id,
            caregiverName: apt.caregiver?.name,
            serviceName: apt.service,
            reason: dispute.reason || "Khiếu nại ca trực",
            status: dispute.status || "Đang xác minh",
            evidenceUrls: dispute.evidenceUrls || [],
            statusNote: dispute.statusNote || "Ban Quản trị CareLink đang xem xét đối soát ca trực.",
            resolutionNotes: dispute.resolutionNotes || "",
            createdAt: dispute.createdAt || "Hôm nay",
            loading: true,
        };
        setViewingDispute(initial);

        try {
            const targetId = dispute.rawId || dispute.id || apt.id;
            const res = await familyApi.getDisputeDetail(targetId);
            const detail = res?.data?.data || res?.data;
            if (detail) {
                setViewingDispute((prev) => ({
                    ...prev,
                    reason: detail.reason || prev.reason,
                    description: detail.description || prev.description,
                    status: detail.status || prev.status,
                    evidenceUrls: detail.evidenceUrls || prev.evidenceUrls,
                    resolutionNotes: detail.resolutionNotes || detail.notes || prev.resolutionNotes,
                    statusNote: detail.statusNote || prev.statusNote,
                    loading: false,
                }));
            } else {
                setViewingDispute((prev) => ({ ...prev, loading: false }));
            }
        } catch (err) {
            console.warn("Không thể tải chi tiết khiếu nại từ server, giữ thông tin cục bộ:", err);
            setViewingDispute((prev) => ({ ...prev, loading: false }));
        }
    };

    // Callback xử lý khi tạo khiếu nại thành công từ CreateDisputeModal
    const handleDisputeSuccess = (disputeDto) => {
        setDisputingAppointment(null);
        setToastMessage({
            type: "success",
            title: "Đã gửi khiếu nại thành công",
            message: `Khiếu nại #${disputeDto?.code || disputeDto?.id || "mới"} đã được tiếp nhận và chuyển tới Ban Quản trị để đối soát.`,
        });
        fetchAppointments();
    };

    // Lọc theo Tab, Tìm kiếm, Dịch vụ, Trạng thái
    const filteredAppointments = appointments.filter((apt) => {
        if (apt.tab !== activeTab) return false;

        // Lọc theo từ khóa tìm kiếm điều dưỡng / người nhận
        if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase();
            const matchName = apt.caregiver?.name?.toLowerCase().includes(q) ?? false;
            const matchService = apt.service?.toLowerCase().includes(q) ?? false;
            const matchRecipient = apt.recipient?.toLowerCase().includes(q) ?? false;
            if (!matchName && !matchService && !matchRecipient) return false;
        }

        // Lọc theo loại dịch vụ
        if (serviceFilter !== "all" && apt.serviceCategory !== serviceFilter) {
            return false;
        }

        // Lọc theo trạng thái
        if (statusFilter !== "all" && apt.status !== statusFilter) {
            return false;
        }

        return true;
    });

    const countUpcoming = appointments.filter((a) => a.tab === "upcoming").length;
    const countOngoing = appointments.filter((a) => a.tab === "ongoing").length;
    const countCompleted = appointments.filter((a) => a.tab === "completed").length;
    const countCancelled = appointments.filter((a) => a.tab === "cancelled").length;

    return (
        <div className="p-4 sm:p-8 flex flex-col gap-6 max-w-6xl mx-auto font-sans antialiased text-[#102030]">
            {/* Header trang lịch hẹn */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Lịch hẹn chăm sóc
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Theo dõi lịch trình các ca điều dưỡng đến chăm sóc người thân của bạn.
                    </p>
                </div>

                <Link
                    to="/caregivers"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow hover:-translate-y-0.5 shrink-0 cursor-pointer"
                >
                    <svg className="w-4 h-4 text-cyan-200" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Đặt lịch mới</span>
                </Link>
            </header>

            {/* Thanh Tab gạch chân (Underline Tabs) chuẩn y như hình ảnh mẫu */}
            <div className="border-b border-slate-200">
                <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto">
                    {/* Tab: Sắp tới */}
                    <button
                        type="button"
                        onClick={() => setActiveTab("upcoming")}
                        className={`pb-3.5 flex items-center gap-2 text-sm sm:text-base font-semibold transition-all cursor-pointer relative shrink-0 ${
                            activeTab === "upcoming"
                                ? "text-slate-900 font-bold border-b-2 border-slate-900"
                                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent"
                        }`}
                    >
                        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Sắp tới ({countUpcoming})</span>
                    </button>

                    {/* Tab: Đang diễn ra */}
                    <button
                        type="button"
                        onClick={() => setActiveTab("ongoing")}
                        className={`pb-3.5 flex items-center gap-2 text-sm sm:text-base font-semibold transition-all cursor-pointer relative shrink-0 ${
                            activeTab === "ongoing"
                                ? "text-slate-900 font-bold border-b-2 border-slate-900"
                                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent"
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        <span>Đang diễn ra ({countOngoing})</span>
                    </button>

                    {/* Tab: Đã hoàn thành */}
                    <button
                        type="button"
                        onClick={() => setActiveTab("completed")}
                        className={`pb-3.5 flex items-center gap-2 text-sm sm:text-base font-semibold transition-all cursor-pointer relative shrink-0 ${
                            activeTab === "completed"
                                ? "text-slate-900 font-bold border-b-2 border-slate-900"
                                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent"
                        }`}
                    >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Đã hoàn thành ({countCompleted})</span>
                    </button>

                    {/* Tab: Đã hủy */}
                    <button
                        type="button"
                        onClick={() => setActiveTab("cancelled")}
                        className={`pb-3.5 flex items-center gap-2 text-sm sm:text-base font-semibold transition-all cursor-pointer relative shrink-0 ${
                            activeTab === "cancelled"
                                ? "text-slate-900 font-bold border-b-2 border-slate-900"
                                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent"
                        }`}
                    >
                        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Đã hủy ({countCancelled})</span>
                    </button>
                </div>
            </div>

            {/* Thanh Tìm kiếm & 3 Bộ Lọc (chuẩn giao diện trong ảnh) */}
            <div className="bg-[#f8fafc] sm:bg-transparent rounded-2xl p-2 sm:p-0 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                {/* Tìm theo tên điều dưỡng */}
                <div className="relative flex-1">
                    <svg
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm theo tên điều dưỡng"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#f1f5f9]/70 hover:bg-slate-100/90 focus:bg-white border border-slate-200/90 focus:border-teal-600 rounded-xl text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
                    />
                </div>

                {/* Dropdown 1: Tất cả dịch vụ */}
                <div className="relative">
                    <select
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#f1f5f9]/70 hover:bg-slate-100/90 border border-slate-200/90 focus:border-teal-600 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                        <option value="all">Tất cả dịch vụ</option>
                        <option value="health_care">Chăm sóc y tế</option>
                        <option value="living_support">Hỗ trợ sinh hoạt</option>
                        <option value="companionship">Bầu bạn tâm sự</option>
                    </select>
                    <svg
                        className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>

                {/* Dropdown 2: Bộ lọc thời gian */}
                <div className="relative">
                    <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#f1f5f9]/70 hover:bg-slate-100/90 border border-slate-200/90 focus:border-teal-600 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                        <option value="all_months">Tất cả thời gian</option>
                        <option value="this_month">Tháng này</option>
                        <option value="last_month">Tháng trước</option>
                    </select>
                    <svg
                        className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>

                {/* Dropdown 3: Tất cả trạng thái */}
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#f1f5f9]/70 hover:bg-slate-100/90 border border-slate-200/90 focus:border-teal-600 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="in_progress">Đang diễn ra</option>
                    </select>
                    <svg
                        className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>

            {/* Danh sách các thẻ ca hẹn (Appointments Cards) */}
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs animate-pulse flex flex-col gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                                </div>
                                <div className="h-6 w-24 bg-slate-100 rounded-full" />
                            </div>
                            <div className="h-px bg-slate-100" />
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-slate-100 rounded w-1/4" />
                                <div className="h-8 bg-slate-200 rounded-xl w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : apiError ? (
                <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-bold text-rose-800">Không thể tải lịch hẹn</h3>
                    <p className="text-xs sm:text-sm text-rose-600 max-w-sm mt-1 mb-4">{apiError}</p>
                    <button
                        type="button"
                        onClick={fetchAppointments}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                        Thử tải lại
                    </button>
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-3 shadow-xs">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Chưa có lịch hẹn nào</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-4">
                        {activeTab === "upcoming"
                            ? "Bạn hiện không có ca chăm sóc nào sắp tới. Hãy tìm điều dưỡng phù hợp để đặt lịch ngay!"
                            : "Không có ca chăm sóc nào trong mục này."}
                    </p>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/caregivers"
                            className="px-4 py-2 bg-[#00677c] hover:bg-[#005566] text-white font-semibold rounded-xl text-xs transition-all shadow-xs"
                        >
                            Tìm điều dưỡng ngay
                        </Link>
                        {(searchQuery || serviceFilter !== "all" || statusFilter !== "all") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery("");
                                    setServiceFilter("all");
                                    setStatusFilter("all");
                                }}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                            >
                                Đặt lại bộ lọc
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredAppointments.map((apt) => {
                        return (
                            <div
                                key={apt.id}
                                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                            >
                                {/* ======================================================== */}
                                {/* PHẦN TRÊN: AVATAR, TÊN, CHUYÊN MÔN, NGƯỜI NHẬN & TRẠNG THÁI */}
                                {/* ======================================================== */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    {/* Cột Trái: Avatar + Thông tin điều dưỡng + Dịch vụ + Người nhận chăm sóc */}
                                    <div className="flex items-start gap-4">
                                        <div className="relative shrink-0">
                                            <img
                                                src={apt.caregiver.avatar}
                                                alt={apt.caregiver.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300";
                                                }}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            {/* Tên điều dưỡng + Badge Đã xác minh có icon bao quanh dấu tích */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                                    {apt.caregiver.name}
                                                </h3>
                                                {apt.caregiver.verified && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-medium border border-slate-200/60">
                                                        {/* Icon dấu tích có vòng bao quanh (seal-check) chuẩn như ảnh */}
                                                        <svg className="w-3.5 h-3.5 text-teal-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Đã xác minh</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Tên dịch vụ màu xanh ngọc */}
                                            <p className="text-sm font-semibold text-[#00829d]">
                                                {apt.service}
                                            </p>

                                            {/* Người nhận chăm sóc */}
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                                <span>
                                                    Người nhận chăm sóc:{" "}
                                                    <strong className="text-slate-900 font-bold">{apt.recipient}</strong>{" "}
                                                    <span className="text-slate-500">({apt.recipientRelation})</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột Phải: Trạng thái + Mã lịch hẹn */}
                                    <div className="flex flex-col sm:items-end gap-1 shrink-0">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider ${apt.statusBadge}`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${apt.dotColor}`} />
                                            {apt.statusLabel}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            Mã lịch hẹn: #{apt.id}
                                        </span>
                                        {/* Luồng 5: Hiển thị thời gian check-in của điều dưỡng khi ca đang diễn ra hoặc đã hoàn tất */}
                                        {apt.startedAt && (apt.status === "in_progress" || apt.status === "completed") && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-[11px] font-semibold text-teal-800" title={apt.checkInNote || "Điều dưỡng đã check-in đúng giờ"}>
                                                <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                                                <span>Check-in: {apt.startedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Luồng 4: Banner Nghiệm thu 2 chiều khi điều dưỡng đã nộp báo cáo */}
                                {apt.needsCustomerConfirm && (
                                    <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs my-1">
                                        <div className="flex items-center gap-2.5 text-amber-900">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                                            <div>
                                                <p className="font-bold text-amber-950">Điều dưỡng đã hoàn thành và gửi báo cáo y tế</p>
                                                <p className="text-[11px] text-amber-800">Vui lòng kiểm tra báo cáo y tế và ký nghiệm thu để giải ngân tiền công cho điều dưỡng.</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmingAppointment(apt)}
                                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                            <span>Ký nghiệm thu ngay →</span>
                                        </button>
                                    </div>
                                )}

                                {/* ======================================================== */}
                                {/* ĐƯỜNG GẠCH PHÂN CÁCH NGAY DƯỚI CHỖ NGƯỜI NHẬN CHĂM SÓC   */}
                                {/* ======================================================== */}
                                <hr className="border-t border-slate-200/90 my-1" />

                                {/* ======================================================== */}
                                {/* PHẦN DƯỚI ĐƯỜNG GẠCH: NẰM CHUNG HÀNG VỚI NHAU             */}
                                {/* TRÁI: Thứ, ngày, giờ, địa chỉ                            */}
                                {/* PHẢI: Nút Nhắn tin & Xem chi tiết                        */}
                                {/* ======================================================== */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    {/* Bên trái: Ngày giờ & Địa điểm */}
                                    <div className="flex flex-col gap-1.5 text-xs text-slate-700">
                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                </svg>
                                                <strong className="text-slate-800 font-semibold">{apt.date}</strong>
                                            </div>

                                            <div className="flex items-center gap-1.5 font-medium">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-slate-700">{apt.time}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                            <span>{apt.location}</span>
                                        </div>
                                    </div>

                                    {/* Bên phải: Nằm chung hàng ngang dưới gạch phân cách */}
                                    <div className="flex items-center gap-2.5 sm:self-center shrink-0">
                                        {/* Nút Thanh toán ngay nếu ca đang chờ thanh toán và còn hạn */}
                                        {apt.canPay && (
                                            <Link
                                                to="/checkout"
                                                state={{ bookingId: apt.id, booking: apt }}
                                                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                                                </svg>
                                                <span>Thanh toán ngay</span>
                                            </Link>
                                        )}

                                        {/* Trạng thái hết hạn 30p */}
                                        {apt.isPaymentExpired && (
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1.5 bg-rose-50 text-rose-700 font-semibold rounded-xl text-xs border border-rose-200 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>Đã hết hạn giữ chỗ (30p)</span>
                                                </span>
                                                <Link
                                                    to="/caregivers"
                                                    className="px-3 py-1.5 bg-orient text-white hover:bg-[#005263] font-semibold rounded-xl text-xs transition-colors shadow-2xs"
                                                >
                                                    Đặt lại ca mới
                                                </Link>
                                            </div>
                                        )}

                                        {/* Nút Hủy ca (nếu được phép) */}
                                        {apt.canCancel && (
                                            <button
                                                type="button"
                                                onClick={() => setCancellingAppointment(apt)}
                                                className="text-rose-600 hover:text-rose-700 hover:underline font-semibold text-xs sm:text-sm px-2 py-1.5 cursor-pointer transition-colors"
                                            >
                                                Hủy ca
                                            </button>
                                        )}

                                        {/* Nút Nghiệm thu ca (cho ca đang chờ nghiệm thu) */}
                                        {apt.needsCustomerConfirm && (
                                            <button
                                                type="button"
                                                onClick={() => setConfirmingAppointment(apt)}
                                                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                                <span>Nghiệm thu ca</span>
                                            </button>
                                        )}

                                        {/* Ca đã hoàn thành: Xem báo cáo sức khỏe */}
                                        {apt.tab === "completed" && apt.healthRecord && (
                                            <button
                                                type="button"
                                                onClick={() => setViewingHealthRecord(apt)}
                                                className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-[#00677c] font-bold rounded-xl text-xs sm:text-sm transition-all border border-teal-200/80 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                                title="Xem các chỉ số sinh hiệu và nhật ký chăm sóc"
                                            >
                                                <svg className="w-3.5 h-3.5 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>
                                                <span>Báo cáo sức khỏe</span>
                                            </button>
                                        )}

                                        {/* Ca đã hoàn thành: Hiển thị badge đánh giá hoặc nút Đánh giá */}
                                        {apt.tab === "completed" && (
                                            apt.reviewed ? (
                                                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
                                                    ⭐ {apt.reviewRating ? `${apt.reviewRating}/5` : ""} Đã đánh giá
                                                </span>
                                            ) : (
                                                <Link
                                                    to={`/review?bookingId=${apt.id}`}
                                                    state={{
                                                        bookingId: apt.id,
                                                        nurseId: apt.nurseId,
                                                        nurseName: apt.caregiver.name,
                                                        nurseAvatar: apt.caregiver.avatar,
                                                        serviceName: apt.service,
                                                        bookingDate: apt.date,
                                                        booking: apt,
                                                    }}
                                                    className="px-3.5 py-2 bg-[#00677c] text-white hover:bg-[#005263] font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-2xs"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                    Đánh giá ca
                                                </Link>
                                            )
                                        )}

                                        {/* Ca đã hoàn thành: Khiếu nại / Báo cáo sự cố */}
                                        {apt.tab === "completed" && (
                                            apt.dispute ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewDispute(apt.dispute, apt)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200 transition-colors cursor-pointer shadow-2xs"
                                                    title="Xem tiến độ và kết quả giải quyết khiếu nại"
                                                >
                                                    <svg className="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                    </svg>
                                                    <span>Xem khiếu nại</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setDisputingAppointment(apt)}
                                                    className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 font-semibold rounded-xl text-xs sm:text-sm transition-all border border-rose-200/80 flex items-center gap-1 cursor-pointer"
                                                    title="Báo cáo sự cố hoặc khiếu nại ca trực"
                                                >
                                                    Khiếu nại ca
                                                </button>
                                            )
                                        )}

                                        {/* Nút Nhắn tin cho ca chưa hoàn thành */}
                                        {apt.tab !== "completed" && !apt.canCancel && (
                                            <Link
                                                to="/dashboard/messages"
                                                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-2xs"
                                            >
                                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                                </svg>
                                                <span>Nhắn tin</span>
                                            </Link>
                                        )}

                                        {/* Nút Xem chi tiết */}
                                        <button
                                            type="button"
                                            onClick={() => handleOpenDetailModal(apt)}
                                            className="px-4.5 py-2 bg-white border border-slate-800 hover:bg-slate-900 hover:text-white text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>

                                {/* Thông tin bổ sung cho ca Đang diễn ra */}
                                {apt.tab === "ongoing" && (
                                    <div className="mt-2 pt-3.5 border-t border-slate-100 bg-[#e0f7fa]/30 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl">
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="font-semibold text-teal-800 flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                                                Tiến độ ca chăm sóc trực tiếp ({apt.duration})
                                            </span>
                                            <span className="font-bold text-teal-700">{apt.progressPercent}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-teal-500 to-[#00677c] h-full rounded-full transition-all duration-500"
                                                style={{ width: `${apt.progressPercent}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-600 mt-2 italic">"{apt.currentNote}"</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal xem chi tiết lịch hẹn */}
            {selectedAppointment && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
                    onClick={() => setSelectedAppointment(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="appointment-detail-title"
                >
                    <div
                        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col my-auto max-h-[92vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-teal-50/20 to-slate-50 shrink-0">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#00677c] flex items-center justify-center border border-teal-100/80 shrink-0 shadow-2xs">
                                    <Stethoscope className="w-5 h-5 text-[#00677c]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 id="appointment-detail-title" className="text-base sm:text-lg font-bold text-slate-900">
                                            Chi tiết ca chăm sóc
                                        </h3>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${selectedAppointment.statusBadge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${selectedAppointment.dotColor}`} />
                                            {selectedAppointment.statusLabel}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                                        Mã ca hẹn: #{selectedAppointment.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedAppointment(null)}
                                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Đóng"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
                            {/* Card Thông tin Điều dưỡng phụ trách */}
                            <div className="p-4 bg-gradient-to-r from-teal-50/50 via-slate-50 to-white rounded-2xl border border-teal-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <img
                                        src={
                                            (detailData?.nurseAvatarUrl && !detailData.nurseAvatarUrl.includes("unsplash"))
                                                ? detailData.nurseAvatarUrl
                                                : selectedAppointment.caregiver.avatar
                                        }
                                        alt={detailData?.nurseName || selectedAppointment.caregiver.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            const name = detailData?.nurseName || selectedAppointment.caregiver.name || "Điều dưỡng";
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00677c&color=fff&size=160&bold=true`;
                                        }}
                                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                                                {detailData?.nurseName || selectedAppointment.caregiver.name}
                                            </h4>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 shrink-0">
                                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                Đã xác thực CCHN
                                            </span>
                                        </div>
                                        <p className="text-[#00829d] font-semibold text-xs mt-0.5">
                                            {detailData?.serviceName || selectedAppointment.service}
                                        </p>
                                        <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-1">
                                            <Phone className="w-3 h-3 text-slate-400" />
                                            <span>SĐT liên hệ: <strong>{detailData?.nursePhone || selectedAppointment.caregiver.phone || "0903 888 999"}</strong></span>
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    to="/dashboard/messages"
                                    onClick={() => setSelectedAppointment(null)}
                                    className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center"
                                >
                                    <MessageSquare className="w-3.5 h-3.5 text-[#00677c]" />
                                    <span>Nhắn tin</span>
                                </Link>
                            </div>

                            {/* Grid 2 cột: Người nhận chăm sóc & Chi phí + Thời gian & Địa điểm */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                                {/* Thẻ Người nhận chăm sóc */}
                                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span>Người nhận chăm sóc:</span>
                                    </div>
                                    <div className="text-sm font-bold text-slate-900">
                                        {detailData?.recipientName || selectedAppointment.recipient}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Đối tượng: <span className="font-medium text-slate-700">{selectedAppointment.recipientRelation || "Người nhận chăm sóc"}</span>
                                    </div>
                                </div>

                                {/* Thẻ Chi phí dịch vụ */}
                                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                                        <CreditCard className="w-4 h-4 text-slate-400" />
                                        <span>Chi phí dịch vụ:</span>
                                    </div>
                                    <div className="text-base font-extrabold text-[#00677c]">
                                        {detailData?.totalPrice ? Number(detailData.totalPrice).toLocaleString("vi-VN") + "đ" : selectedAppointment.price}
                                    </div>
                                    <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Thanh toán đảm bảo CareLink PayOS</span>
                                    </div>
                                </div>

                                {/* Thẻ Thời gian & Lịch hẹn */}
                                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span>Thời gian ca trực:</span>
                                    </div>
                                    <div className="text-xs sm:text-sm font-bold text-slate-800">
                                        {selectedAppointment.date}
                                    </div>
                                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Khung giờ: <strong>{selectedAppointment.time}</strong></span>
                                    </div>
                                </div>

                                {/* Thẻ Địa chỉ chăm sóc */}
                                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span>Địa chỉ ca chăm sóc:</span>
                                    </div>
                                    <div className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                                        {detailData?.addressSnapshot || selectedAppointment.location}
                                    </div>
                                </div>
                            </div>

                            {/* Nhiệm vụ chuyên môn trong ca */}
                            {selectedAppointment.tasks && (
                                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                                    <span className="text-slate-700 font-bold block text-xs mb-2">
                                        Nhiệm vụ & Quy trình trong ca:
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        {selectedAppointment.tasks.map((task, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/50 text-xs text-slate-700">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                                <span className="truncate">{task}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Báo cáo sức khỏe lâm sàng cho ca đã hoàn tất */}
                            {selectedAppointment.tab === "completed" && selectedAppointment.healthRecord && (
                                <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-2xl space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-bold text-teal-900 text-xs sm:text-sm">
                                            <Stethoscope className="w-4 h-4 text-teal-600" />
                                            <span>Báo cáo sức khỏe lâm sàng sau ca</span>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                                            Đã ghi nhận sinh hiệu
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 pt-1">
                                        <div className="flex items-center gap-4">
                                            <span>Huyết áp: <strong className="text-slate-900 font-bold">{selectedAppointment.healthRecord.bloodPressureSystolic}/{selectedAppointment.healthRecord.bloodPressureDiastolic} mmHg</strong></span>
                                            <span>Mạch: <strong className="text-slate-900 font-bold">{selectedAppointment.healthRecord.heartRate} bpm</strong></span>
                                            <span>Nhiệt độ: <strong className="text-slate-900 font-bold">{selectedAppointment.healthRecord.temperature}°C</strong></span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentApt = selectedAppointment;
                                                setSelectedAppointment(null);
                                                setViewingHealthRecord(currentApt);
                                            }}
                                            className="px-3 py-1.5 bg-[#00677c] hover:bg-[#005566] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                                        >
                                            Xem bệnh án đầy đủ
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Đánh giá ca chăm sóc cho ca đã hoàn tất */}
                            {selectedAppointment.tab === "completed" && (
                                <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-800 text-xs">
                                            Đánh giá chất lượng dịch vụ
                                        </span>
                                        {selectedAppointment.reviewed ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                                ⭐ {selectedAppointment.reviewRating ? `${selectedAppointment.reviewRating}/5` : "5/5"} sao · Đã gửi
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">Chưa đánh giá</span>
                                        )}
                                    </div>

                                    {selectedAppointment.reviewed ? (
                                        <p className="text-slate-600 italic text-xs leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                                            "{selectedAppointment.reviewComment || "Ca chăm sóc diễn ra chu đáo và tận tâm."}"
                                        </p>
                                    ) : (
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-xs text-slate-500">
                                                Gửi phản hồi để nâng cao chất lượng dịch vụ
                                            </span>
                                            <Link
                                                to={`/review?bookingId=${selectedAppointment.id}`}
                                                state={{
                                                    bookingId: selectedAppointment.id,
                                                    nurseId: selectedAppointment.nurseId,
                                                    nurseName: selectedAppointment.caregiver.name,
                                                    nurseAvatar: selectedAppointment.caregiver.avatar,
                                                    serviceName: selectedAppointment.service,
                                                    bookingDate: selectedAppointment.date,
                                                    booking: selectedAppointment,
                                                }}
                                                className="px-3.5 py-1.5 bg-[#00677c] text-white font-bold text-xs rounded-xl hover:bg-[#005566] transition-colors shadow-xs"
                                            >
                                                Đánh giá ngay
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Khiếu nại ca trực nếu có sự cố */}
                            {selectedAppointment.tab === "completed" && (
                                <div className="flex items-center justify-between pt-1 text-xs">
                                    <span className="text-slate-500">Có vấn đề phát sinh trong ca trực?</span>
                                    {selectedAppointment.dispute ? (
                                        <span className="text-rose-600 font-bold">
                                            ⚠ Đang khiếu nại (#{selectedAppointment.dispute.code})
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentApt = selectedAppointment;
                                                setSelectedAppointment(null);
                                                setDisputingAppointment(currentApt);
                                            }}
                                            className="text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
                                        >
                                            Báo cáo sự cố / Khiếu nại ca
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
                            <div>
                                {selectedAppointment.canCancel && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentApt = selectedAppointment;
                                            setSelectedAppointment(null);
                                            setCancellingAppointment(currentApt);
                                        }}
                                        className="text-rose-600 hover:text-rose-700 hover:underline font-semibold text-xs cursor-pointer"
                                    >
                                        Hủy ca chăm sóc này
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setSelectedAppointment(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                                >
                                    Đóng
                                </button>
                                {selectedAppointment.canPay && (
                                    <Link
                                        to="/checkout"
                                        state={{ bookingId: selectedAppointment.id, booking: selectedAppointment }}
                                        className="px-4.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        <span>Thanh toán ngay</span>
                                    </Link>
                                )}
                                <Link
                                    to="/dashboard/messages"
                                    onClick={() => setSelectedAppointment(null)}
                                    className="px-4.5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Nhắn tin điều dưỡng</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal Xem Báo cáo sức khỏe lâm sàng */}
            <ViewHealthRecordModal
                isOpen={Boolean(viewingHealthRecord)}
                onClose={() => setViewingHealthRecord(null)}
                booking={viewingHealthRecord}
                healthRecord={viewingHealthRecord?.healthRecord}
                showHistoryLink={true}
            />

            {/* Modal Gửi Khiếu nại ca chăm sóc */}
            <CreateDisputeModal
                isOpen={Boolean(disputingAppointment)}
                onClose={() => setDisputingAppointment(null)}
                appointment={disputingAppointment}
                onSubmitSuccess={handleDisputeSuccess}
            />

            {/* Modal Xem chi tiết trạng thái khiếu nại (API 73: GET /api/v1/disputes/{id}) */}
            {viewingDispute && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-hidden"
                    style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)" }}
                    onClick={() => setViewingDispute(null)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 bg-gradient-to-r from-rose-600 to-amber-600 text-white flex items-start justify-between">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20">
                                    Chi tiết khiếu nại ca trực
                                </span>
                                <h3 className="text-base font-bold mt-1">Mã khiếu nại: #{viewingDispute.code || viewingDispute.id}</h3>
                                <p className="text-xs text-rose-100">Ca hẹn: #{viewingDispute.bookingId} · {viewingDispute.serviceName}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewingDispute(null)}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 space-y-4 overflow-y-auto text-xs">
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                                <span className="font-bold text-slate-700">Trạng thái xử lý:</span>
                                <span className="px-2.5 py-1 rounded-full font-bold text-rose-700 bg-rose-50 border border-rose-200">
                                    {viewingDispute.status || "Đang xác minh"}
                                </span>
                            </div>

                            <div className="space-y-1">
                                <span className="font-bold text-slate-800">Lý do & Nội dung phản ánh:</span>
                                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed italic">
                                    "{viewingDispute.reason}"
                                </p>
                            </div>

                            {viewingDispute.resolutionNotes && (
                                <div className="space-y-1 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950">
                                    <span className="font-bold block">Phán quyết từ Ban Quản trị:</span>
                                    <p className="mt-1 leading-relaxed">{viewingDispute.resolutionNotes}</p>
                                </div>
                            )}

                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 leading-relaxed text-[11px]">
                                {viewingDispute.statusNote || "Khiếu nại đang được Ban Quản trị đối soát cùng Điều dưỡng trong vòng 24 giờ làm việc."}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setViewingDispute(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal Nghiệm thu ca chăm sóc 2 chiều (API: PUT /api/v1/bookings/{id}/customer-confirm) */}
            {confirmingAppointment && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
                    onClick={() => !isSubmittingConfirm && setConfirmingAppointment(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col my-auto max-h-[92vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-emerald-50/50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                        Nghiệm thu ca chăm sóc
                                    </h3>
                                    <p className="text-xs text-slate-500">Mã ca: #{confirmingAppointment.id}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                disabled={isSubmittingConfirm}
                                onClick={() => setConfirmingAppointment(null)}
                                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-700">
                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                <img
                                    src={confirmingAppointment.caregiver.avatar}
                                    alt={confirmingAppointment.caregiver.name}
                                    className="w-11 h-11 rounded-full object-cover border border-white shadow-xs"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900">{confirmingAppointment.caregiver.name}</p>
                                    <p className="text-xs text-[#00677c] font-semibold">{confirmingAppointment.service}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{confirmingAppointment.date} · {confirmingAppointment.time}</p>
                                </div>
                            </div>

                            <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-900 text-xs leading-relaxed space-y-1">
                                <p className="font-bold flex items-center gap-1.5 text-emerald-950">
                                    <span>✓ Báo cáo y tế đã được điều dưỡng nộp đầy đủ</span>
                                </p>
                                <p className="text-emerald-800">
                                    Sau khi quý khách ký xác nhận nghiệm thu, ca trực sẽ chuyển sang trạng thái <strong>Đã hoàn thành</strong> và tiền công sẽ được giải ngân vào ví của điều dưỡng.
                                </p>
                            </div>

                            {/* Rating input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                    Đánh giá chất lượng ca chăm sóc:
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setConfirmRating(star)}
                                            className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= confirmRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                                            />
                                        </button>
                                    ))}
                                    <span className="text-xs font-bold text-amber-700 ml-2">
                                        {confirmRating === 5 ? "Rất hài lòng (5/5)" : confirmRating === 4 ? "Hài lòng (4/5)" : `${confirmRating}/5 sao`}
                                    </span>
                                </div>
                            </div>

                            {/* Feedback textarea */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                    Nhận xét nghiệm thu & ý kiến đóng góp:
                                </label>
                                <textarea
                                    rows={3}
                                    value={confirmFeedback}
                                    onChange={(e) => setConfirmFeedback(e.target.value)}
                                    placeholder="Ví dụ: Điều dưỡng đến đúng giờ, thao tác chuyên nghiệp và ân cần..."
                                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-teal-600 focus:outline-none resize-none"
                                />
                            </div>

                            {/* Agreement checkbox */}
                            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={confirmAgreement}
                                    onChange={(e) => setConfirmAgreement(e.target.checked)}
                                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-xs text-slate-600 leading-snug">
                                    Tôi xác nhận điều dưỡng đã hoàn tất ca chăm sóc chu đáo và đồng ý nghiệm thu kết quả ca trực.
                                </span>
                            </label>
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 shrink-0">
                            <button
                                type="button"
                                disabled={isSubmittingConfirm}
                                onClick={() => setConfirmingAppointment(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                Để sau
                            </button>
                            <button
                                type="button"
                                disabled={!confirmAgreement || isSubmittingConfirm}
                                onClick={handleConfirmBooking}
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                            >
                                {isSubmittingConfirm ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                        <span>Đang ký nghiệm thu...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                        <span>Ký nghiệm thu & Hoàn tất</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal Xác nhận Hủy ca chăm sóc chuẩn UI/UX */}
            <CancelBookingModal
                isOpen={Boolean(cancellingAppointment)}
                booking={cancellingAppointment}
                onClose={() => setCancellingAppointment(null)}
                onConfirmCancel={handleConfirmCancelBooking}
            />

            {/* Toast thông báo chuẩn ứng dụng */}
            <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
    );
}
