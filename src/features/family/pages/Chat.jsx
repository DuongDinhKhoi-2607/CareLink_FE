import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BookingSummary from "../components/BookingSummary";
import {
    getDemoChatState,
    setDemoStatus,
    addDemoMessage,
    updateDemoBookingInfo,
    resetDemoChat,
    subscribeDemoChat,
} from "../../../data/chatDemoStore";

// Dữ liệu chi tiết đặt lịch hiển thị ở cột tóm tắt
const defaultBookingDetails = [
    {
        label: "NGƯỜI CẦN CHĂM SÓC",
        value: "Nguyễn Thị Lan (75 tuổi)",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    },
    {
        label: "DỊCH VỤ",
        value: "Chăm sóc phục hồi sau phẫu thuật",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
    },
    {
        label: "NGÀY DỰ KIẾN",
        value: "Ngày mai, 14/10/2026",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        ),
    },
    {
        label: "THỜI GIAN",
        value: "08:00 - 10:00 (2 giờ)",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        label: "ĐỊA ĐIỂM",
        value: "123 Nguyễn Gia Trí, P. 25, Bình Thạnh, TP. HCM",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
        ),
    },
];

// Cam kết an toàn
const safetyCommitments = [
    {
        text: "Điều dưỡng đã xác thực CCCD & Thẻ SV",
        icon: (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
    },
    {
        text: "Chỉ thanh toán khi 2 bên đã thỏa thuận",
        icon: (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        text: "Bảo hiểm trách nhiệm & Hỗ trợ CSKH 24/7",
        icon: (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
        ),
    },
];

export default function Chat() {
    const location = useLocation();
    const caregiver = location?.state?.caregiver;

    // Dữ liệu điều dưỡng
    const avatarUrl =
        caregiver?.image ||
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300";
    const displayName = caregiver?.name || "Nguyễn Thùy Linh";
    const displayRole =
        caregiver?.role || "Sinh viên Y4 - Đại học Y Dược TP.HCM";

    // Trạng thái demo lấy từ store tập trung
    const [demoState, setDemoState] = useState(() => getDemoChatState());
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Refs
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    // Đăng ký nhận thông báo thay đổi trạng thái từ store (khi Caregiver chấp nhận / từ chối ở tab khác)
    useEffect(() => {
        const unsubscribe = subscribeDemoChat((updated) => {
            setDemoState(updated);
        });
        return unsubscribe;
    }, []);

    // Tự động cuộn đến tin nhắn cuối cùng
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        });
    }, [demoState.messages, isTyping]);

    // Gửi tin nhắn thủ công từ phía Family
    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = message.trim();
        if (!trimmed) return;
        if (demoState.status === "closed" || demoState.status === "caregiver_rejected") return;

        // Thêm vào store demo
        addDemoMessage("family", trimmed);
        setMessage("");

        // Giả lập điều dưỡng trả lời nếu đang ở trạng thái idle
        if (demoState.status === "idle") {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                addDemoMessage(
                    "caregiver",
                    "Dạ em đã ghi nhận yêu cầu của gia đình. Anh có thể bấm 'Xác nhận muốn đặt lịch' ở bảng bên phải để em chính thức nhận ca nhé ạ!"
                );
            }, 1400);
        }
    };

    // Các hành động tương tác với trạng thái đặt lịch
    const handleConfirmBooking = () => {
        setDemoStatus("family_confirmed");
    };

    const handleRevokeBooking = () => {
        setDemoStatus("idle");
    };

    const handleCloseChat = () => {
        setDemoStatus("closed");
    };

    const handleResetDemo = () => {
        resetDemoChat();
    };

    const handleUpdateBookingInfo = (newInfo) => {
        updateDemoBookingInfo(newInfo);
    };

    // Chuẩn bị dữ liệu hiển thị tóm tắt
    const bookingDetails = [
        {
            label: "NGƯỜI CẦN CHĂM SÓC",
            value: `${demoState.bookingInfo?.recipientName} (${demoState.bookingInfo?.recipientAge})`,
            icon: defaultBookingDetails[0].icon,
        },
        {
            label: "DỊCH VỤ",
            value: demoState.bookingInfo?.serviceName || "Chăm sóc phục hồi sau phẫu thuật",
            icon: defaultBookingDetails[1].icon,
        },
        {
            label: "NGÀY DỰ KIẾN",
            value: demoState.bookingInfo?.scheduledDate || "Ngày mai, 14/10/2026",
            icon: defaultBookingDetails[2].icon,
        },
        {
            label: "THỜI GIAN",
            value: demoState.bookingInfo?.scheduledTime || "08:00 - 10:00 (2 giờ)",
            icon: defaultBookingDetails[3].icon,
        },
        {
            label: "ĐỊA ĐIỂM",
            value: demoState.bookingInfo?.address || "123 Nguyễn Gia Trí, P. 25, Bình Thạnh, TP. HCM",
            icon: defaultBookingDetails[4].icon,
        },
    ];

    return (
        <div className="bg-[#f8fafc] py-6 lg:py-8 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5 lg:gap-6">

                {/* Thanh điều hướng nhanh phía trên */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/caregivers/profile"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00677c] transition-colors group"
                    >
                        <svg
                            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                            />
                        </svg>
                        Quay lại hồ sơ điều dưỡng
                    </Link>

                    {/* Badge kênh trao đổi bảo mật */}
                    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e7f7fc] text-[#00677c] border border-[#c2eaf4]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Kênh trao đổi bảo mật 2 chiều
                    </div>
                </div>

                {/* Tiêu đề trang */}
                <header className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                        <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#102030]">
                            Trao đổi trước khi đặt lịch
                        </h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Phía Gia Đình
                        </span>
                    </div>

                    <p className="text-[14.5px] sm:text-[15.5px] text-slate-600 leading-relaxed max-w-3xl mt-0.5">
                        Trao đổi tình trạng sức khỏe và khung giờ chăm sóc với điều dưỡng. Khi hai bên thống nhất, điều dưỡng xác nhận nhận ca thì mới tiến hành thanh toán.
                    </p>
                </header>

                {/* Bố cục lưới: 8 cột Chat + 4 cột Booking Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                    {/* CỘT CHÍNH: KHUNG CHAT */}
                    <section className="lg:col-span-8 flex flex-col gap-4 min-w-0">

                        {/* Card thông tin điều dưỡng */}
                        <article className="flex items-center sm:items-start gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                            <div className="relative shrink-0">
                                <img
                                    src={avatarUrl}
                                    alt={displayName}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#e7f7fc]"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400";
                                    }}
                                />
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-300" />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-bold text-lg sm:text-xl text-[#102030]">
                                        {displayName}
                                    </span>

                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#e7f7fc] text-[#00677c] border border-[#cbeaf4]">
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                                        </svg>
                                        Đã xác thực CareLink
                                    </span>
                                </div>

                                <p className="text-sm text-slate-600 line-clamp-1">
                                    {displayRole}
                                </p>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500 pt-1">
                                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                                        ★ 4.9
                                        <span className="text-slate-500 font-normal">(128 đánh giá)</span>
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Tỷ lệ nhận ca: 98%</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="text-emerald-700 font-semibold">Phản hồi: ~5 phút</span>
                                </div>
                            </div>
                        </article>

                        {/* BANNER TRẠNG THÁI THỎA THUẬN TRỰC QUAN */}
                        {demoState.status === "family_confirmed" && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 shadow-2xs animate-[fadeIn_300ms_ease-out]">
                                <div className="w-9 h-9 rounded-xl bg-amber-100/80 flex items-center justify-center shrink-0 text-amber-700">
                                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-sm">
                                    <p className="font-semibold text-amber-950">
                                        Đã gửi yêu cầu đặt lịch cho điều dưỡng
                                    </p>
                                    <p className="text-xs text-amber-800 mt-0.5">
                                        Đang chờ {displayName} xem xét và bấm "Đồng ý nhận ca" bên giao diện Điều dưỡng.
                                    </p>
                                </div>
                            </div>
                        )}

                        {demoState.status === "caregiver_accepted" && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 shadow-2xs animate-[fadeIn_300ms_ease-out]">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 flex items-center justify-center shrink-0 text-emerald-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-sm">
                                    <p className="font-semibold text-emerald-950">
                                        {displayName} đã đồng ý nhận ca chăm sóc!
                                    </p>
                                    <p className="text-xs text-emerald-800 mt-0.5">
                                        Hai bên đã đạt thỏa thuận thành công. Bạn có thể bấm <strong className="underline">Tiến hành thanh toán</strong> ở khung bên phải để hoàn tất đặt ca.
                                    </p>
                                </div>
                            </div>
                        )}

                        {demoState.status === "caregiver_rejected" && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-900 shadow-2xs animate-[fadeIn_300ms_ease-out]">
                                <div className="w-9 h-9 rounded-xl bg-rose-100/80 flex items-center justify-center shrink-0 text-rose-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-sm">
                                    <p className="font-semibold text-rose-950">
                                        Điều dưỡng không thể nhận ca này
                                    </p>
                                    <p className="text-xs text-rose-800 mt-0.5">
                                        Lý do: "{demoState.rejectReason || "Bận lịch vào khung giờ này"}". Bạn có thể quay lại tìm điều dưỡng khác phù hợp.
                                    </p>
                                </div>
                            </div>
                        )}

                        {demoState.status === "closed" && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-900 shadow-2xs animate-[fadeIn_300ms_ease-out]">
                                <div className="w-9 h-9 rounded-xl bg-rose-100/80 flex items-center justify-center shrink-0 text-rose-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-sm">
                                    <p className="font-bold text-rose-950">
                                        Đã dừng cuộc trao đổi
                                    </p>
                                    <p className="text-xs text-rose-800 mt-0.5">
                                        Bạn đã dừng trao đổi với điều dưỡng này. Bấm vào nút "Quay lại tìm điều dưỡng khác" để tiếp tục tìm kiếm.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* KHUNG CHAT CHÍNH (Kéo dài chiều dọc thoải mái, không bị co ngắn ở zoom 100%) */}
                        <section
                            aria-label="Trao đổi với điều dưỡng"
                            className="flex flex-col h-[680px] lg:h-[720px] min-h-[560px] bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
                        >
                            {/* Thanh header khung chat */}
                            <div className="shrink-0 px-4 sm:px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-9 rounded-xl bg-[#e7f7fc] text-[#00677c] flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3.75h5.25M21 12c0 4.142-4.03 7.5-9 7.5a10.1 10.1 0 01-4.17-.88L3 20l1.38-3.68A7.1 7.1 0 013 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5z" />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-[#102030]">
                                            Trao đổi trực tiếp
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            với điều dưỡng {displayName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-100">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Trực tuyến
                                    </span>
                                </div>
                            </div>

                            {/* Vùng hiển thị tin nhắn */}
                            <div
                                ref={messagesContainerRef}
                                className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 flex flex-col bg-[#f8fafc] scroll-smooth"
                                style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#cbd5e1 transparent",
                                }}
                            >
                                {/* Thẻ chào y tế trang nhã đầu cuộc trao đổi */}
                                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs text-center mb-2 mx-auto max-w-md w-full shrink-0">
                                    <div className="relative mb-2">
                                        <img
                                            src={avatarUrl}
                                            alt={displayName}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400/40 shadow-sm"
                                        />
                                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-[#102030]">
                                        Tư vấn trực tiếp với {displayName}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs leading-relaxed">
                                        Sinh viên Y4 - ĐH Y Dược TP.HCM • Đã xác thực chứng chỉ chuyên môn
                                    </p>
                                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f0f9fa] border border-[#d0eef3] text-[10px] font-semibold text-[#00677c]">
                                        <svg className="w-3 h-3 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.732a9 9 0 014.28 0m-8.56 0a9 9 0 014.28 0M12 3v1.5m0 15v1.5m-7.5-9h1.5m12 0h1.5" />
                                        </svg>
                                        Kênh trò chuyện bảo mật 2 chiều • Thỏa thuận có cấu trúc
                                    </div>
                                </div>

                                <div className="flex items-center justify-center my-2 shrink-0">
                                    <span className="px-3 py-0.5 bg-slate-200/60 text-slate-500 rounded-full text-[10px] font-semibold">
                                        Hôm nay, 13/10/2026
                                    </span>
                                </div>

                                {/* Khối tin nhắn: dùng mt-auto để dồn tin nhắn xuống dưới sát input, không bị hổng khoảng trống thừa */}
                                <div className="flex flex-col gap-3.5 mt-auto">
                                    {demoState.messages.map((chatMessage, index) => {
                                        // Tin nhắn hệ thống (System banner in chat)
                                        if (chatMessage.sender === "system") {
                                            const isClosedOrRejected =
                                                chatMessage.systemType === "reject" ||
                                                chatMessage.systemType === "close" ||
                                                chatMessage.text.includes("dừng") ||
                                                chatMessage.text.includes("từ chối");
                                            const isAccepted = chatMessage.systemType === "accept" || chatMessage.text.includes("đồng ý");
                                            const isConfirmed = chatMessage.systemType === "confirm" || chatMessage.text.includes("đã gửi yêu cầu");
                                            const isRevoked = chatMessage.systemType === "revoke" || chatMessage.text.includes("rút lại");
                                            const isUpdated = chatMessage.systemType === "update" || chatMessage.text.includes("cập nhật");

                                            return (
                                                <div
                                                    key={chatMessage.id ?? index}
                                                    className="flex flex-col items-center my-1.5 animate-[fadeIn_250ms_ease-out]"
                                                >
                                                    <div
                                                        className={`max-w-[92%] sm:max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] shadow-2xs font-medium leading-relaxed border flex items-center gap-2.5 ${
                                                            isClosedOrRejected
                                                                ? "bg-rose-50/95 border-rose-200 text-rose-800"
                                                                : isAccepted
                                                                ? "bg-emerald-50/95 border-emerald-200 text-emerald-900"
                                                                : isConfirmed
                                                                ? "bg-amber-50/95 border-amber-200 text-amber-900"
                                                                : isUpdated
                                                                ? "bg-sky-50/95 border-sky-200 text-sky-900"
                                                                : isRevoked
                                                                ? "bg-slate-100 border-slate-200 text-slate-700"
                                                                : "bg-slate-50 border-slate-200 text-slate-700"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                                                isClosedOrRejected
                                                                    ? "bg-rose-100 text-rose-600"
                                                                    : isAccepted
                                                                    ? "bg-emerald-100 text-emerald-600"
                                                                    : isConfirmed
                                                                    ? "bg-amber-100 text-amber-600"
                                                                    : isUpdated
                                                                    ? "bg-sky-100 text-sky-700"
                                                                    : "bg-slate-200 text-slate-600"
                                                            }`}
                                                        >
                                                            {isClosedOrRejected && (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                </svg>
                                                            )}
                                                            {isAccepted && (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                </svg>
                                                            )}
                                                            {isConfirmed && (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            )}
                                                            {isUpdated && (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                                </svg>
                                                            )}
                                                            {isRevoked && (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                                                </svg>
                                                            )}
                                                            {!isClosedOrRejected && !isAccepted && !isConfirmed && !isUpdated && !isRevoked && (
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                                </svg>
                                                            )}
                                                        </span>
                                                        <span className="flex-1 text-left">{chatMessage.text}</span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 mt-1">
                                                        {chatMessage.time}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        const isOutgoing = chatMessage.sender === "family" || chatMessage.side === "outgoing";

                                        return (
                                            <div
                                                key={chatMessage.id ?? index}
                                                className={`flex flex-col w-full animate-[chatMessageIn_220ms_ease-out] ${
                                                    isOutgoing ? "items-end" : "items-start"
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[88%] sm:max-w-[80%] px-4 py-3 rounded-2xl text-[14px] sm:text-[15px] shadow-2xs ${
                                                        isOutgoing
                                                            ? "bg-[#e7f7fc] text-[#102030] rounded-br-xs border border-[#cde8f1]"
                                                            : "bg-white text-[#102030] rounded-bl-xs border border-slate-200/90"
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-line leading-[1.65] break-words">
                                                        {chatMessage.text}
                                                    </p>
                                                </div>

                                                <span className="text-[10px] text-slate-400 mt-1 px-1">
                                                    {chatMessage.time} • {isOutgoing ? "Gia đình" : displayName}
                                                </span>
                                            </div>
                                        );
                                    })}

                                    {/* Hiệu ứng điều dưỡng đang gõ */}
                                    {isTyping && (
                                        <div className="flex flex-col items-start animate-[chatMessageIn_220ms_ease-out]">
                                            <div className="px-4 py-3 bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs shadow-2xs">
                                                <div className="flex items-center gap-1.5" aria-label="Điều dưỡng đang soạn tin nhắn">
                                                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-[typingDot_1s_infinite]" />
                                                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-[typingDot_1s_150ms_infinite]" />
                                                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-[typingDot_1s_300ms_infinite]" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                                                {displayName} đang nhập...
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div ref={messagesEndRef} className="h-px shrink-0" />
                            </div>

                            {/* Khung nhập tin nhắn */}
                            <form
                                onSubmit={handleSubmit}
                                className="shrink-0 p-3 sm:p-4 bg-white border-t border-slate-200"
                            >
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex-1 min-w-0 flex items-center relative rounded-full bg-[#f4f6f8] border border-slate-200 px-3 sm:px-4 py-1.5 transition-colors focus-within:border-[#00677c] focus-within:ring-2 focus-within:ring-[#00677c]/10">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={
                                                demoState.status === "closed"
                                                    ? "Cuộc trao đổi đã kết thúc..."
                                                    : demoState.status === "caregiver_rejected"
                                                    ? "Điều dưỡng đã từ chối nhận ca..."
                                                    : "Nhập tin nhắn trao đổi với điều dưỡng..."
                                            }
                                            autoComplete="off"
                                            disabled={
                                                demoState.status === "closed" ||
                                                demoState.status === "caregiver_rejected"
                                            }
                                            className="flex-1 min-w-0 bg-transparent border-0 outline-none px-2 py-2 text-sm sm:text-base text-[#102030] placeholder:text-slate-400 disabled:opacity-60"
                                        />
                                    </div>

                                    {/* Nút gửi */}
                                    <button
                                        type="submit"
                                        aria-label="Gửi tin nhắn"
                                        disabled={
                                            !message.trim() ||
                                            demoState.status === "closed" ||
                                            demoState.status === "caregiver_rejected"
                                        }
                                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#00677c] text-white flex items-center justify-center hover:bg-[#005566] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs hover:shadow-sm active:scale-95 shrink-0"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </section>
                    </section>

                    {/* CỘT PHẢI: TÓM TẮT ĐẶT LỊCH & THỎA THUẬN 2 CHIỀU */}
                    <div className="lg:col-span-4 lg:sticky lg:top-6">
                        <BookingSummary
                            details={bookingDetails}
                            safetyCommitments={safetyCommitments}
                            status={demoState.status}
                            rejectReason={demoState.rejectReason}
                            bookingInfo={demoState.bookingInfo}
                            onUpdateBookingInfo={handleUpdateBookingInfo}
                            onConfirmBooking={handleConfirmBooking}
                            onRevokeBooking={handleRevokeBooking}
                            onCloseChat={handleCloseChat}
                            onResetDemo={handleResetDemo}
                        />
                    </div>
                </div>
            </div>

            {/* Animation nhẹ nhàng */}
            <style>{`
                @keyframes chatMessageIn {
                    from {
                        opacity: 0;
                        transform: translateY(4px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes typingDot {
                    0%, 60%, 100% {
                        opacity: 0.35;
                        transform: translateY(0);
                    }
                    30% {
                        opacity: 1;
                        transform: translateY(-3px);
                    }
                }
            `}</style>
        </div>
    );
}