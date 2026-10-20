import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ViewHealthRecordModal from "../components/ViewHealthRecordModal";
import CreateDisputeModal from "../components/CreateDisputeModal";
import CancelBookingModal from "../components/CancelBookingModal";
import Toast from "../../../components/Toast";
import familyApi from "../../../api/familyApi";

// Adapter chuyển đổi BookingResponse từ Backend sang cấu trúc hiển thị của giao diện Family
const mapBookingToAppointment = (b) => {
    const rawStatus = typeof b.status === "number" ? b.status : 1;
    let tab = "upcoming";
    let statusLabel = "ĐÃ TIẾP NHẬN";
    let statusBadge = "bg-[#e2f4f2] text-[#007469]";
    let dotColor = "bg-[#00a896]";
    let canCancel = true;
    let statusStr = "confirmed";

    if (rawStatus === 1) { // PendingPayment
        tab = "upcoming";
        statusLabel = "CHỜ THANH TOÁN";
        statusBadge = "bg-amber-50 text-amber-700 border border-amber-200";
        dotColor = "bg-amber-500";
        canCancel = true;
        statusStr = "pending_payment";
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
            avatar: b.nurseAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
            verified: true,
            phone: "0903 888 999",
        },
        service: b.serviceName || "Chăm sóc theo yêu cầu",
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
        canPay: rawStatus === 1,
        price: b.totalPrice ? Number(b.totalPrice).toLocaleString("vi-VN") + "đ" : "0đ",
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

const INITIAL_FALLBACK_APPOINTMENTS = [
    {
        id: "CK-28491",
        tab: "upcoming",
        caregiver: {
            name: "Điều dưỡng Nguyễn Thùy Linh",
            role: "Chăm sóc phục hồi chức năng & Vận động y tế",
            avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
            verified: true,
            phone: "0912 888 999",
        },
        service: "Chăm sóc phục hồi chức năng & Vận động y tế",
        serviceCategory: "health_care",
        recipient: "Bà Nguyễn Thị Lan",
        recipientRelation: "Mẹ, 75 tuổi",
        date: "Thứ Bảy, 24/10/2026",
        time: "08:00 – 12:00 (4 giờ)",
        duration: "4 giờ",
        location: "123 Nguyễn Gia Trí, P. 25, Bình Thạnh, TP.HCM",
        status: "pending_payment",
        statusLabel: "CHỜ THANH TOÁN",
        statusBadge: "bg-amber-50 text-amber-700 border border-amber-200",
        dotColor: "bg-amber-500",
        canCancel: true,
        canPay: true,
        tasks: ["Đo huyết áp & đường huyết", "Hỗ trợ co duỗi khớp gối 20 phút", "Nhắc uống thuốc theo đơn"],
        price: "420.000đ",
    },
    {
        id: "CK-28492",
        tab: "upcoming",
        caregiver: {
            name: "Điều dưỡng Trần Thị Mai",
            role: "Điều dưỡng Đa khoa & Hồi sức ngoại",
            avatar: "https://images.unsplash.com/photo-1594824813682-1c255bc29909?auto=format&fit=crop&q=80&w=300",
            verified: true,
            phone: "0903 888 111",
        },
        service: "Tiêm truyền & Theo dõi vết mổ tại nhà",
        serviceCategory: "health_care",
        recipient: "Bác Lê Văn Dũng",
        recipientRelation: "Bố, 82 tuổi",
        date: "Chủ Nhật, 25/10/2026",
        time: "07:30 – 09:30 (2 giờ)",
        duration: "2 giờ",
        location: "45 Võ Văn Tần, Quận 3, TP.HCM",
        status: "confirmed",
        statusLabel: "ĐÃ TIẾP NHẬN",
        statusBadge: "bg-[#e2f4f2] text-[#007469]",
        dotColor: "bg-[#00a896]",
        canCancel: true,
        canPay: false,
        tasks: ["Kiểm tra vết mổ và thay băng vô trùng", "Đo huyết áp và điện tim cơ bản", "Dặn dò chế độ dinh dưỡng"],
        price: "350.000đ",
    },
    {
        id: "CK-28485",
        tab: "ongoing",
        caregiver: {
            name: "Điều dưỡng Lê Hoàng Nam",
            role: "Chăm sóc bệnh nhân thở máy & Hậu phẫu",
            avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
            verified: true,
            phone: "0918 777 666",
        },
        service: "Chăm sóc toàn diện sau phẫu thuật thay khớp",
        serviceCategory: "health_care",
        recipient: "Bà Trần Thị Bình",
        recipientRelation: "Bác ruột, 65 tuổi",
        date: "Hôm nay",
        time: "14:00 – 18:00 (4 giờ)",
        duration: "4 giờ",
        location: "88 Lê Lợi, Quận 1, TP.HCM",
        status: "in_progress",
        statusLabel: "ĐANG DIỄN RA",
        statusBadge: "bg-teal-50 text-teal-700 ring-1 ring-teal-500/20",
        dotColor: "bg-teal-500 animate-ping",
        canCancel: false,
        canPay: false,
        tasks: ["Theo dõi chỉ số sinh hiệu liên tục", "Hỗ trợ vận động trị liệu khớp", "Vệ sinh cá nhân vô trùng"],
        price: "520.000đ",
    },
    {
        id: "CK-28470",
        tab: "completed",
        caregiver: {
            name: "Điều dưỡng Nguyễn Thùy Linh",
            role: "Chăm sóc phục hồi chức năng & Vận động y tế",
            avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
            verified: true,
            phone: "0912 888 999",
        },
        service: "Chăm sóc phục hồi chức năng & Vận động y tế",
        serviceCategory: "health_care",
        recipient: "Bà Nguyễn Thị Lan",
        recipientRelation: "Mẹ, 75 tuổi",
        date: "Thứ Năm, 15/10/2026",
        time: "08:00 – 11:00 (3 giờ)",
        duration: "3 giờ",
        location: "123 Nguyễn Gia Trí, P. 25, Bình Thạnh, TP.HCM",
        status: "completed",
        statusLabel: "ĐÃ HOÀN THÀNH",
        statusBadge: "bg-slate-100 text-slate-700",
        dotColor: "bg-slate-400",
        canCancel: false,
        canPay: false,
        reviewed: true,
        rating: 5,
        tasks: ["Đo huyết áp & đường huyết", "Hỗ trợ co duỗi khớp gối", "Nhắc uống thuốc theo đơn"],
        price: "360.000đ",
        healthRecord: {
            bloodPressureSystolic: 120,
            bloodPressureDiastolic: 80,
            heartRate: 72,
            temperature: 36.6,
            bloodGlucose: 105,
            woundStatus: "Khô ráo, mép vết mổ phẳng, không rỉ dịch",
            mobilityStatus: "Tập đi lại với gậy hỗ trợ 15 phút, co duỗi khớp gối 90 độ",
            mentalStatus: "Bác tỉnh táo, vui vẻ, ăn uống tốt",
            nurseNotes: "Bác Lan hồi phục rất nhanh. Đã đo huyết áp ổn định 120/80 mmHg, đường huyết 105 mg/dL trước ăn. Bác đã uống thuốc đúng giờ.",
            createdAt: "15/10/2026 · 11:15",
        },
    },
    {
        id: "CK-28461",
        tab: "cancelled",
        caregiver: {
            name: "Điều dưỡng Hoàng Minh Tuấn",
            role: "Chăm sóc người cao tuổi & Bệnh mãn tính",
            avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
            verified: true,
            phone: "0944 555 666",
        },
        service: "Chăm sóc người cao tuổi bán thời gian",
        serviceCategory: "living_support",
        recipient: "Ông Vũ Văn Hùng",
        recipientRelation: "Bố, 78 tuổi",
        date: "Thứ Ba, 13/10/2026",
        time: "13:00 – 17:00 (4 giờ)",
        duration: "4 giờ",
        location: "99 Cách Mạng Tháng 8, Quận 10, TP.HCM",
        status: "cancelled",
        statusLabel: "ĐÃ HỦY",
        statusBadge: "bg-rose-50 text-rose-700 border border-rose-200",
        dotColor: "bg-rose-500",
        canCancel: false,
        canPay: false,
        tasks: ["Hỗ trợ sinh hoạt", "Trò chuyện & dạo bộ", "Uống thuốc đúng đơn"],
        price: "400.000đ",
    },
];

export default function Appointments() {
    const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
    const [searchQuery, setSearchQuery] = useState("");
    const [serviceFilter, setServiceFilter] = useState("all");
    const [monthFilter, setMonthFilter] = useState("09/2026");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedAppointment, setSelectedAppointment] = useState(null); // Cho modal xem chi tiết
    const [viewingHealthRecord, setViewingHealthRecord] = useState(null); // Cho modal xem báo cáo sức khỏe
    const [disputingAppointment, setDisputingAppointment] = useState(null); // Cho modal khiếu nại
    const [viewingDispute, setViewingDispute] = useState(null); // Cho modal xem tiến độ khiếu nại
    const [cancellingAppointment, setCancellingAppointment] = useState(null); // Cho modal xác nhận hủy ca
    const [toastMessage, setToastMessage] = useState(null);

    // Trạng thái dữ liệu thực từ Backend API
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [isUsingFallback, setIsUsingFallback] = useState(false);

    // 1. Tải danh sách ca chăm sóc từ Backend (GET /api/v1/bookings)
    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const res = await familyApi.getBookings({ PageNumber: 1, PageSize: 50 });
            const items = res?.items || (Array.isArray(res) ? res : []);
            const mapped = items.map(mapBookingToAppointment);
            setAppointments(mapped);
            setIsUsingFallback(false);
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
                setAppointments([]);
                setIsUsingFallback(false);
            } else if (!err.response || err.code === "ECONNABORTED" || err.code === "ERR_NETWORK") {
                setIsUsingFallback(true);
                setAppointments(INITIAL_FALLBACK_APPOINTMENTS);
            } else {
                setAppointments([]);
                setIsUsingFallback(false);
            }
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
            setToastMessage({
                type: "success",
                title: "Đã hủy ca chăm sóc thành công",
                message: `Lịch hẹn #${id} đã được hủy. Hệ thống đã cập nhật trạng thái ca.`,
            });
            fetchAppointments();
        } catch (err) {
            console.error("[CareLink] Lỗi khi hủy ca:", err);
            const errorMsg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Không thể hủy ca chăm sóc lúc này. Vui lòng kiểm tra lại kết nối mạng hoặc chính sách hủy ca.";
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

    // Lọc theo Tab, Tìm kiếm, Dịch vụ, Trạng thái
    const filteredAppointments = appointments.filter((apt) => {
        if (apt.tab !== activeTab) return false;

        // Lọc theo từ khóa tìm kiếm điều dưỡng / người nhận
        if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase();
            const matchName = apt.caregiver.name.toLowerCase().includes(q);
            const matchService = apt.service.toLowerCase().includes(q);
            const matchRecipient = apt.recipient.toLowerCase().includes(q);
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
                    to="/services"
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

                {/* Dropdown 2: Tháng này (09/2026) */}
                <div className="relative">
                    <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#f1f5f9]/70 hover:bg-slate-100/90 border border-slate-200/90 focus:border-teal-600 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                        <option value="09/2026">Tháng này (09/2026)</option>
                        <option value="08/2026">Tháng trước (08/2026)</option>
                        <option value="all_months">Tất cả thời gian</option>
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
            ) : apiError && !isUsingFallback ? (
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
                                    </div>
                                </div>

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
                                        {/* Nút Thanh toán ngay nếu ca đang chờ thanh toán */}
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
                                            onClick={() => setSelectedAppointment(apt)}
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
            {selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-page-enter">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Chi tiết ca chăm sóc</h3>
                                <p className="text-xs text-slate-500">Mã ca hẹn: #{selectedAppointment.id}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedAppointment(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                                <img
                                    src={selectedAppointment.caregiver.avatar}
                                    alt={selectedAppointment.caregiver.name}
                                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{selectedAppointment.caregiver.name}</h4>
                                    <p className="text-teal-700 font-medium text-[11px]">{selectedAppointment.service}</p>
                                    <p className="text-slate-500 text-[11px]">SĐT liên hệ: {selectedAppointment.caregiver.phone}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-slate-700">
                                <div className="p-2.5 bg-slate-50/80 rounded-xl">
                                    <span className="text-slate-400 block text-[11px]">Người nhận chăm sóc:</span>
                                    <strong className="text-slate-900 font-semibold">{selectedAppointment.recipient}</strong> ({selectedAppointment.recipientRelation})
                                </div>
                                <div className="p-2.5 bg-slate-50/80 rounded-xl">
                                    <span className="text-slate-400 block text-[11px]">Chi phí dịch vụ:</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedAppointment.price}</span>
                                    <span className="text-[10px] text-emerald-600 block">✓ Đã thanh toán đảm bảo</span>
                                </div>
                                <div className="p-2.5 bg-slate-50/80 rounded-xl col-span-2">
                                    <span className="text-slate-400 block text-[11px]">Thời gian & Địa điểm:</span>
                                    <span className="font-semibold text-slate-800">{selectedAppointment.date} ({selectedAppointment.time})</span>
                                    <p className="text-slate-600 mt-0.5">{selectedAppointment.location}</p>
                                </div>
                            </div>

                            {selectedAppointment.tasks && (
                                <div className="p-3 bg-slate-50/80 rounded-xl">
                                    <span className="text-slate-500 font-semibold block text-[11px] mb-1.5">Nhiệm vụ trong ca chăm sóc:</span>
                                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                                        {selectedAppointment.tasks.map((task, idx) => (
                                            <li key={idx}>{task}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Báo cáo sức khỏe lâm sàng cho ca đã hoàn tất */}
                            {selectedAppointment.tab === "completed" && selectedAppointment.healthRecord && (
                                <div className="p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 font-bold text-teal-900 text-xs">
                                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                                            Báo cáo sức khỏe lâm sàng
                                        </div>
                                        <span className="text-[10px] text-teal-700 font-medium">
                                            Đã cập nhật sinh hiệu
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-700 pt-1">
                                        <div className="flex items-center gap-3">
                                            <span>HA: <strong>{selectedAppointment.healthRecord.bloodPressureSystolic}/{selectedAppointment.healthRecord.bloodPressureDiastolic} mmHg</strong></span>
                                            <span>Mạch: <strong>{selectedAppointment.healthRecord.heartRate} bpm</strong></span>
                                            <span>Nhiệt độ: <strong>{selectedAppointment.healthRecord.temperature}°C</strong></span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentApt = selectedAppointment;
                                                setSelectedAppointment(null);
                                                setViewingHealthRecord(currentApt);
                                            }}
                                            className="px-2.5 py-1 bg-[#00677c] hover:bg-[#005566] text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Đánh giá ca chăm sóc cho ca đã hoàn tất */}
                            {selectedAppointment.tab === "completed" && (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-800 text-[11px]">
                                            Đánh giá chất lượng dịch vụ
                                        </span>
                                        {selectedAppointment.reviewed ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                                ⭐ {selectedAppointment.rating}/5 sao · Đã gửi
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-400">Chưa đánh giá</span>
                                        )}
                                    </div>

                                    {selectedAppointment.reviewed ? (
                                        <p className="text-slate-600 italic text-[11px] leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                                            "{selectedAppointment.reviewComment}"
                                        </p>
                                    ) : (
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-[11px] text-slate-500">
                                                Chia sẻ phản hồi của bạn về ca trực
                                            </span>
                                            <Link
                                                to="/review"
                                                className="px-3 py-1 bg-[#00677c] text-white font-semibold text-[11px] rounded-lg hover:bg-[#005566] transition-colors"
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

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setSelectedAppointment(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                            <Link
                                to="/dashboard/messages"
                                className="px-4 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs"
                            >
                                Nhắn tin điều dưỡng
                            </Link>
                        </div>
                    </div>
                </div>
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
            {viewingDispute && (
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
                </div>
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
