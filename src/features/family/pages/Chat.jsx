import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BookingSummary from "../components/BookingSummary";

// Tin nhắn trao đổi mẫu ban đầu
const initialMessages = [
    {
        id: 1,
        side: "outgoing",
        text: "Xin chào em, bà của chị năm nay 75 tuổi, vừa xuất viện sau phẫu thuật và\ncần hỗ trợ thay băng cũng như theo dõi huyết áp mỗi ngày.",
        time: "10:05 AM",
    },
    {
        id: 2,
        side: "incoming",
        text: "Dạ em có thể hỗ trợ. Cho em hỏi hiện tại bà có thể tự đi lại hay cần hỗ trợ\nhoàn toàn ạ?",
        time: "10:08 AM",
    },
    {
        id: 3,
        side: "outgoing",
        text: "Bà vẫn đi lại được nhưng khá yếu, cần người hỗ trợ khi di chuyển.",
        time: "10:10 AM",
    },
    {
        id: 4,
        side: "incoming",
        text: "Dạ em hiểu rồi. Em đề xuất chăm sóc khoảng 2 giờ mỗi ngày để theo dõi\nsức khỏe và hỗ trợ sinh hoạt.",
        time: "10:12 AM",
    },
];

// Dữ liệu tóm tắt đặt lịch
const bookingDetails = [
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
        value: "Chăm sóc y tế tại nhà",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
    },
    {
        label: "NGÀY DỰ KIẾN",
        value: "Ngày mai, 24/05/2026",
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
        value: "Đống Đa, Hà Nội",
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
        text: "Điều dưỡng đã xác thực CCCD",
        icon: (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
    },
    {
        text: "Đã xác thực Thẻ sinh viên",
        icon: (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
        ),
    },
    {
        text: "Hồ sơ được CareLink kiểm duyệt",
        icon: (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
];

export default function Chat() {
    const location = useLocation();
    const caregiver = location?.state?.caregiver;

    const avatarUrl = caregiver?.image || "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400";
    const displayName = caregiver?.name || "Nguyễn Thùy Linh";
    const displayRole = caregiver?.role || "Sinh viên Y4 - Đại học Y Hà Nội";

    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState("");
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = message.trim();
        if (!trimmed) return;

        const newMsg = {
            id: Date.now(),
            side: "outgoing",
            text: trimmed,
            time: new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }),
        };

        setMessages((prev) => [...prev, newMsg]);
        setMessage("");
    };

    return (
        <div className="bg-[#f8fafc] py-8 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
                {/* Nút quay lại hồ sơ */}
                <div>
                    <Link
                        to="/caregivers/profile"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00677c] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Quay lại hồ sơ điều dưỡng
                    </Link>
                </div>

                {/* Tiêu đề trang */}
                <header className="flex flex-col gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-prussian-blue">
                        Trao đổi trước khi đặt lịch
                    </h1>
                    <p className="text-lg text-[#43474e]">
                        Trao đổi với điều dưỡng để xác nhận tình trạng sức khỏe, thời gian chăm sóc và các yêu cầu trước khi đặt lịch.
                    </p>
                </header>

                {/* Bố cục lưới: 8 cột Chat + 4 cột Booking Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* CỘT CHÍNH: KHUNG CHAT (8 CỘT) */}
                    <section className="lg:col-span-8 flex flex-col gap-4">
                        {/* Card thông tin người điều dưỡng */}
                        <article className="flex items-start gap-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <img
                                src={avatarUrl}
                                alt={displayName}
                                className="w-16 h-16 rounded-full object-cover shrink-0 border border-slate-200"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400";
                                }}
                            />
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-2xl text-[#181c1e]">
                                        {displayName}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#b2ebff] text-[#001f27]">
                                        Đã xác thực bởi CareLink
                                    </span>
                                </div>
                                <p className="text-base text-[#43474e]">
                                    {displayRole}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#43474e] pt-1">
                                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                                        ★ 4.9 <span className="text-[#43474e] font-normal">(128 đánh giá)</span>
                                    </span>
                                    <span>•</span>
                                    <span>Phản hồi trung bình: 15 phút</span>
                                </div>
                            </div>
                        </article>

                        {/* Vùng hiển thị tin nhắn (Scrollable) */}
                        <section
                            aria-label="Trao đổi với điều dưỡng Nguyễn Thùy Linh"
                            className="flex flex-col h-[520px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                        >
                            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-[#fafbfc]">
                                {messages.map((chatMessage, index) => {
                                    const isOutgoing = chatMessage.side === "outgoing";
                                    return (
                                        <div
                                            key={`${chatMessage.time}-${index}`}
                                            className={`flex flex-col max-w-[80%] ${isOutgoing ? "self-end items-end" : "self-start items-start"
                                                }`}
                                        >
                                            <div
                                                className={`p-4 rounded-xl text-base shadow-xs ${isOutgoing
                                                        ? "bg-[#4fd9fd1a] text-[#181c1e] rounded-br-xs"
                                                        : "bg-[#ebeef0] text-[#181c1e] rounded-bl-xs"
                                                    }`}
                                            >
                                                <p className="whitespace-pre-line leading-relaxed">{chatMessage.text}</p>
                                            </div>
                                            <span className="text-[10px] text-[#43474e] mt-1 px-1">
                                                {chatMessage.time}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Form gửi tin nhắn */}
                            <form
                                onSubmit={handleSubmit}
                                className="p-4 bg-white border-t border-[#c4c6cf] flex items-center gap-4"
                            >
                                <div className="flex-1 flex items-center relative rounded-full bg-[#f1f4f6] border border-[#c4c6cf] px-4 py-1.5">
                                    {/* Icon cảm xúc */}
                                    <button
                                        type="button"
                                        aria-label="Thêm biểu tượng cảm xúc"
                                        className="text-[#43474e] hover:text-[#00677c] transition-colors p-1"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="8.5" />
                                            <path strokeLinecap="round" d="M8.5 14.25c.83 1.08 2.02 1.62 3.5 1.62s2.66-.54 3.5-1.62M9 9.75h.01M15 9.75h.01" />
                                        </svg>
                                    </button>

                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 bg-transparent border-0 outline-none px-3 py-2 text-base text-[#181c1e] placeholder:text-gray-500"
                                    />

                                    {/* Icon đính kèm */}
                                    <button
                                        type="button"
                                        aria-label="Đính kèm tệp"
                                        className="text-[#43474e] hover:text-[#00677c] transition-colors p-1"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.65" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Nút gửi */}
                                <button
                                    type="submit"
                                    aria-label="Gửi tin nhắn"
                                    disabled={!message.trim()}
                                    className="w-12 h-12 rounded-full bg-prussian-blue text-white flex items-center justify-center hover:bg-[#1a365d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shrink-0"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                </button>
                            </form>
                        </section>
                    </section>

                    {/* CỘT PHẢI: TÓM TẮT ĐẶT LỊCH (4 CỘT) */}
                    <div className="lg:col-span-4 sticky top-24">
                        <BookingSummary
                            details={bookingDetails}
                            safetyCommitments={safetyCommitments}
                            bookingConfirmed={bookingConfirmed}
                            onConfirmBooking={() => setBookingConfirmed(true)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}