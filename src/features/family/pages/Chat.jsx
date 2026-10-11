import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BookingSummary from "../components/BookingSummary";

// Tin nhắn trao đổi mẫu ban đầu.
// Giữ nguyên dữ liệu gốc để tiện đối chiếu khi cần.
// Chế độ hội thoại tự động bên dưới sẽ bắt đầu bằng khung chat trống.
const initialMessages = [
    {
        id: 1,
        side: "outgoing",
        text: "Xin chào em, mẹ của anh năm nay 75 tuổi, vừa xuất viện sau phẫu thuật,\ncần hỗ trợ thay băng cũng như theo dõi huyết áp mỗi ngày.",
        time: "10:05 AM",
    },
    {
        id: 2,
        side: "incoming",
        text: "Dạ em có thể hỗ trợ. Cho em hỏi hiện tại bà có thể tự đi lại hay cần hỗ trợ hoàn toàn ạ?",
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
        text: "Dạ em hiểu rồi. Em đề xuất chăm sóc khoảng 2 giờ mỗi ngày để theo dõi sức khỏe và hỗ trợ sinh hoạt.",
        time: "10:12 AM",
    },
];

// Kịch bản hội thoại tự động dành cho video giới thiệu CareLink.
// Toàn bộ tin nhắn chỉ hiển thị ở frontend.
// Không gửi tin nhắn lên backend và không tạo booking thật.
const conversationScript = [
    {
        side: "outgoing",
        text: "Chào em, mẹ anh vừa xuất viện sau phẫu thuật. Anh muốn tìm người hỗ trợ chăm sóc tại nhà cho mẹ.",
        time: "10:05 AM",
    },
    {
        side: "incoming",
        text: "Dạ, em có thể hỗ trợ ạ. Anh muốn đặt lịch chăm sóc vào khung giờ nào ạ?",
        time: "10:06 AM",
    },
    {
        side: "outgoing",
        text: "Anh muốn đặt lịch khoảng 2 tiếng mỗi sáng, bắt đầu từ ngày mai.",
        time: "10:07 AM",
    },
    {
        side: "incoming",
        text: "Dạ được anh nhé. Ngày mai em có thể đến từ 08:00 đến 10:00 ạ.",
        time: "10:08 AM",
    },
    {
        side: "outgoing",
        text: "Vậy anh xác nhận lịch 08:00–10:00 ngày mai nhé. Cảm ơn em!",
        time: "10:09 AM",
    },
    {
        side: "incoming",
        text: "Dạ, em xác nhận lịch chăm sóc ngày mai từ 08:00 đến 10:00 ạ. Em sẽ đến đúng giờ và hỗ trợ bác theo nhu cầu của gia đình.",
        time: "10:10 AM",
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

    // Giữ nguyên ảnh và thông tin điều dưỡng ban đầu.
    const avatarUrl =
        caregiver?.image ||
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300";

    const displayName = caregiver?.name || "Nguyễn Thùy Linh";
    const displayRole =
        caregiver?.role || "Sinh viên Y4 - Đại học Y Dược TP.HCM";

    // Bắt đầu với hội thoại trống để tạo trải nghiệm tự nhiên khi quay video.
    // initialMessages vẫn được giữ nguyên ở phía trên để không mất dữ liệu gốc.
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    // Trạng thái phục vụ hiệu ứng gõ chữ và dấu ba chấm.
    const [isTyping, setIsTyping] = useState(false);
    const [isConversationRunning, setIsConversationRunning] = useState(false);
    const [conversationFinished, setConversationFinished] = useState(false);

    // Ref để tự cuộn và quản lý các timer.
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);
    const timersRef = useRef([]);
    const isMountedRef = useRef(true);

    // Tạo timer có thể được dọn dẹp khi rời trang.
    const wait = (duration) =>
        new Promise((resolve) => {
            const timer = window.setTimeout(resolve, duration);
            timersRef.current.push(timer);
        });

    // Tự động cuộn đến tin nhắn cuối cùng.
    useEffect(() => {
        const container = messagesContainerRef.current;

        if (!container) return;

        container.scrollTo({
            top: container.scrollHeight,
            behavior: isConversationRunning ? "auto" : "smooth",
        });
    }, [messages, message, isTyping, isConversationRunning]);

    // Tự động chạy kịch bản sau 3 giây.
    // Không cần thêm chữ demo vào URL hoặc nút điều khiển trên giao diện.
    useEffect(() => {
        isMountedRef.current = true;

        const sleep = (duration) =>
            new Promise((resolve) => {
                const timer = window.setTimeout(() => {
                    resolve();
                }, duration);

                timersRef.current.push(timer);
            });

        const runConversation = async () => {
            // Chờ 3 giây để bạn chuẩn bị quay màn hình.
            await sleep(3000);

            if (!isMountedRef.current) return;

            setIsConversationRunning(true);

            for (let index = 0; index < conversationScript.length; index += 1) {
                if (!isMountedRef.current) return;

                const currentMessage = conversationScript[index];

                // Với tin nhắn từ khách hàng, mô phỏng gõ từng ký tự.
                if (currentMessage.side === "outgoing") {
                    setIsTyping(false);

                    let typedText = "";

                    for (
                        let charIndex = 0;
                        charIndex < currentMessage.text.length;
                        charIndex += 1
                    ) {
                        if (!isMountedRef.current) return;

                        typedText += currentMessage.text[charIndex];
                        setMessage(typedText);

                        // Tốc độ gõ tương đối nhanh để video không quá dài.
                        await sleep(19);
                    }

                    // Tạm dừng nhẹ trước khi tự gửi.
                    await sleep(220);

                    if (!isMountedRef.current) return;

                    setMessages((previousMessages) => [
                        ...previousMessages,
                        {
                            id: `conversation-${index}-${Date.now()}`,
                            side: "outgoing",
                            text: currentMessage.text,
                            time: currentMessage.time,
                        },
                    ]);

                    setMessage("");

                    // Cho người xem kịp nhận biết tin nhắn đã được gửi.
                    await sleep(450);
                } else {
                    // Điều dưỡng bắt đầu nhập: hiện dấu ba chấm.
                    setIsTyping(true);

                    await sleep(1000);

                    if (!isMountedRef.current) return;

                    // Hiện tin nhắn trả lời của điều dưỡng.
                    setIsTyping(false);

                    setMessages((previousMessages) => [
                        ...previousMessages,
                        {
                            id: `conversation-${index}-${Date.now()}`,
                            side: "incoming",
                            text: currentMessage.text,
                            time: currentMessage.time,
                        },
                    ]);

                    // Nghỉ ngắn để nội dung không xuất hiện dồn dập.
                    await sleep(550);
                }
            }

            if (!isMountedRef.current) return;

            setMessage("");
            setIsTyping(false);
            setIsConversationRunning(false);
            setConversationFinished(true);
        };

        runConversation();

        return () => {
            isMountedRef.current = false;

            timersRef.current.forEach((timer) => {
                window.clearTimeout(timer);
            });

            timersRef.current = [];
        };
    }, []);

    // Cho phép gửi tin nhắn thủ công khi kịch bản tự động chưa chạy
    // hoặc đã kết thúc.
    const handleSubmit = (e) => {
        e.preventDefault();

        // Tránh người dùng gửi xen kẽ với kịch bản đang chạy.
        if (isConversationRunning) return;

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

        setMessages((previousMessages) => [...previousMessages, newMsg]);
        setMessage("");
    };

    return (
        <div className="bg-[#f8fafc] py-6 lg:py-8 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5 lg:gap-6">

                {/* Nút quay lại hồ sơ: giữ nguyên chức năng hiện tại */}
                <div>
                    <Link
                        to="/caregivers/profile"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00677c] transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
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
                </div>

                {/* Tiêu đề trang: giữ nguyên nội dung */}
                <header className="flex flex-col gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-prussian-blue">
                        Trao đổi trước khi đặt lịch
                    </h1>

                    <p className="text-base sm:text-lg text-[#43474e] leading-relaxed">
                        Trao đổi với điều dưỡng để xác nhận tình trạng sức khỏe,
                        thời gian chăm sóc và các yêu cầu trước khi đặt lịch.
                    </p>
                </header>

                {/* Bố cục lưới: 8 cột Chat + 4 cột Booking Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                    {/* CỘT CHÍNH: KHUNG CHAT */}
                    <section className="lg:col-span-8 flex flex-col gap-4 min-w-0">

                        {/* Card thông tin điều dưỡng: giữ ảnh online và thông tin gốc */}
                        <article className="flex items-center sm:items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="relative shrink-0">
                                <img
                                    src={avatarUrl}
                                    alt={displayName}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-slate-200"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400";
                                    }}
                                />

                                {/* Chấm trạng thái trực tuyến */}
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-xl sm:text-2xl text-[#181c1e]">
                                        {displayName}
                                    </span>

                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#b2ebff] text-[#001f27]">
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12.75L11.25 15 15 9.75"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"
                                            />
                                        </svg>

                                        Đã xác thực bởi CareLink
                                    </span>
                                </div>

                                <p className="text-sm sm:text-base text-[#43474e]">
                                    {displayRole}
                                </p>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#43474e] pt-1">
                                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                                        ★ 4.9
                                        <span className="text-[#43474e] font-normal">
                                            (128 đánh giá)
                                        </span>
                                    </span>

                                    <span className="hidden sm:inline">•</span>

                                    <span>Phản hồi trung bình: 15 phút</span>
                                </div>
                            </div>
                        </article>

                        {/* Khung chat:
                            - Chiều cao ổn định để bố cục không nhảy.
                            - Chỉ vùng tin nhắn được cuộn.
                            - Ô nhập luôn nằm ở dưới cùng.
                        */}
                        <section
                            aria-label="Trao đổi với điều dưỡng"
                            className="flex flex-col h-[min(560px,calc(100vh-250px))] min-h-[360px] bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
                        >
                            {/* Thanh tiêu đề nhỏ của cuộc trò chuyện */}
                            <div className="shrink-0 px-4 sm:px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-9 rounded-xl bg-[#e8f8fc] text-[#00677c] flex items-center justify-center shrink-0">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M7.5 8.25h9m-9 3.75h5.25M21 12c0 4.142-4.03 7.5-9 7.5a10.1 10.1 0 01-4.17-.88L3 20l1.38-3.68A7.1 7.1 0 013 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5z"
                                            />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#183247]">
                                            Cuộc trò chuyện
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Trao đổi trực tiếp với điều dưỡng
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Sẵn sàng hỗ trợ
                                </div>
                            </div>

                            {/* Vùng tin nhắn có thể cuộn độc lập */}
                            <div
                                ref={messagesContainerRef}
                                className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-5 sm:py-6 flex flex-col gap-4 bg-[#f8fafc] scroll-smooth"
                                style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#cbd5e1 transparent",
                                }}
                            >
                                {/* Lời chào nhẹ khi hội thoại đang trống */}
                                {messages.length === 0 && !isTyping && (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#00677c] mb-3">
                                            <svg
                                                className="w-7 h-7"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M7.5 8.25h9m-9 3.75h5.25M21 12c0 4.142-4.03 7.5-9 7.5a10.1 10.1 0 01-4.17-.88L3 20l1.38-3.68A7.1 7.1 0 013 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5z"
                                                />
                                            </svg>
                                        </div>

                                        <p className="text-sm font-semibold text-slate-700">
                                            Bắt đầu cuộc trò chuyện
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1 max-w-[250px] leading-relaxed">
                                            Trao đổi nhu cầu chăm sóc để tìm ra lịch hẹn phù hợp với gia đình.
                                        </p>
                                    </div>
                                )}

                                {/* Danh sách tin nhắn */}
                                {messages.map((chatMessage, index) => {
                                    const isOutgoing =
                                        chatMessage.side === "outgoing";

                                    return (
                                        <div
                                            key={chatMessage.id ?? `${chatMessage.time}-${index}`}
                                            className={`flex flex-col w-full animate-[chatMessageIn_220ms_ease-out] ${isOutgoing
                                                ? "items-end"
                                                : "items-start"
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[88%] sm:max-w-[82%] px-4 py-3 rounded-2xl text-[14px] sm:text-[15px] shadow-sm ${isOutgoing
                                                    ? "bg-[#e7f7fc] text-[#183247] rounded-br-md border border-[#d6eff7]"
                                                    : "bg-white text-[#243746] rounded-bl-md border border-slate-200/80"
                                                    }`}
                                            >
                                                <p className="whitespace-pre-line leading-[1.7] break-words">
                                                    {chatMessage.text}
                                                </p>
                                            </div>

                                            <span className="text-[10px] text-slate-400 mt-1.5 px-1">
                                                {chatMessage.time}
                                            </span>
                                        </div>
                                    );
                                })}

                                {/* Ba dấu chấm khi điều dưỡng đang nhập */}
                                {isTyping && (
                                    <div className="flex flex-col items-start animate-[chatMessageIn_220ms_ease-out]">
                                        <div className="px-4 py-3.5 bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm">
                                            <div
                                                className="flex items-center gap-1.5"
                                                aria-label="Điều dưỡng đang nhập tin nhắn"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-slate-400 animate-[typingDot_1s_infinite]" />
                                                <span className="w-2 h-2 rounded-full bg-slate-400 animate-[typingDot_1s_150ms_infinite]" />
                                                <span className="w-2 h-2 rounded-full bg-slate-400 animate-[typingDot_1s_300ms_infinite]" />
                                            </div>
                                        </div>

                                        <span className="text-[10px] text-slate-400 mt-1.5 px-1">
                                            Đang nhập...
                                        </span>
                                    </div>
                                )}

                                {/* Phần tử neo để cuộn đến cuối */}
                                <div
                                    ref={messagesEndRef}
                                    className="h-px shrink-0"
                                />
                            </div>

                            {/* Form nhập tin nhắn cố định ở đáy */}
                            <form
                                onSubmit={handleSubmit}
                                className="shrink-0 p-3 sm:p-4 bg-white border-t border-slate-200"
                            >
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex-1 min-w-0 flex items-center relative rounded-full bg-[#f4f6f8] border border-slate-200 px-3 sm:px-4 py-1.5 transition-colors focus-within:border-[#78cbdc] focus-within:ring-2 focus-within:ring-[#00677c]/10">
                                        {/* Icon cảm xúc */}
                                        <button
                                            type="button"
                                            aria-label="Thêm biểu tượng cảm xúc"
                                            className="text-slate-500 hover:text-[#00677c] transition-colors p-1 shrink-0"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.6"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="8.5"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    d="M8.5 14.25c.83 1.08 2.02 1.62 3.5 1.62s2.66-.54 3.5-1.62M9 9.75h.01M15 9.75h.01"
                                                />
                                            </svg>
                                        </button>

                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={message}
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                            placeholder="Nhập tin nhắn..."
                                            autoComplete="off"
                                            disabled={isConversationRunning}
                                            className="flex-1 min-w-0 bg-transparent border-0 outline-none px-2 sm:px-3 py-2 text-sm sm:text-base text-[#181c1e] placeholder:text-slate-400 disabled:opacity-100"
                                        />

                                        {/* Icon đính kèm */}
                                        <button
                                            type="button"
                                            aria-label="Đính kèm tệp"
                                            className="text-slate-500 hover:text-[#00677c] transition-colors p-1 shrink-0"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.65"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Nút gửi tin nhắn */}
                                    <button
                                        type="submit"
                                        aria-label="Gửi tin nhắn"
                                        disabled={
                                            !message.trim() ||
                                            isConversationRunning
                                        }
                                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#00677c] text-white flex items-center justify-center hover:bg-[#005566] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95 shrink-0"
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

                    {/* CỘT PHẢI: TÓM TẮT ĐẶT LỊCH */}
                    <div className="lg:col-span-4 lg:sticky lg:top-6">
                        <BookingSummary
                            details={bookingDetails}
                            safetyCommitments={safetyCommitments}
                            bookingConfirmed={bookingConfirmed}
                            onConfirmBooking={() =>
                                setBookingConfirmed(true)
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Hiệu ứng chỉ áp dụng cho tin nhắn và dấu ba chấm.
                Không cần cài thêm thư viện animation. */}
            <style>{`
                @keyframes chatMessageIn {
                    from {
                        opacity: 0;
                        transform: translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
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

                @media (prefers-reduced-motion: reduce) {
                    [class*="chatMessageIn"],
                    [class*="typingDot"] {
                        animation-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </div>
    );
}