import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    getDemoChatState,
    subscribeDemoChat,
    setDemoStatus,
    addDemoMessage,
    resetDemoChat,
} from "../../../data/chatDemoStore";
import {
    MessageSquare,
    Search,
    Clock,
    Calendar,
    MapPin,
    User,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Send,
    RotateCcw,
    Sparkles,
    ShieldCheck,
    Phone,
    Info,
    ChevronRight,
    Filter,
} from "lucide-react";

// Danh sách các cuộc trao đổi mẫu bổ sung bên cạnh cuộc hội thoại chính
const mockOtherConversations = [
    {
        id: "conv-2",
        name: "Chị Lê Thảo Quyên",
        patient: "Bé Bo (8 tháng)",
        lastMessage: "Dạ em cảm ơn chị, lịch sáng thứ Năm tuần tới em sẽ đến đúng 8h30 ạ.",
        time: "Hôm qua",
        unread: 0,
        status: "accepted",
        statusText: "Đã hoàn thành ca",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    },
    {
        id: "conv-3",
        name: "Bác Trần Minh Tuấn",
        patient: "Bác Tuấn (68 tuổi)",
        lastMessage: "Bác ơi, kết quả đo đường huyết chiều nay của bác ổn định rồi nhé ạ.",
        time: "3 ngày trước",
        unread: 0,
        status: "idle",
        statusText: "Tư vấn định kỳ",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    {
        id: "conv-4",
        name: "Bộ phận CSKH CareLink",
        patient: "Hỗ trợ chuyên môn",
        lastMessage: "Hồ sơ xác thực chứng chỉ hành nghề của bạn đã được phê duyệt.",
        time: "5 ngày trước",
        unread: 0,
        status: "system",
        statusText: "Thông báo hệ thống",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
    },
];

// Danh mục phản hồi nhanh dành cho điều dưỡng
const quickReplies = [
    "Dạ em chào anh An ạ, khung giờ này em hoàn toàn trống lịch!",
    "Dạ em đã xem thông tin sức khỏe của bác Lan, em có thể hỗ trợ tốt ạ.",
    "Anh cho em hỏi trước phẫu thuật bác có tiền sử dị ứng thuốc gì không ạ?",
    "Dạ em đồng ý nhận ca, anh tiến hành xác nhận đặt lịch nhé ạ!",
];

export default function CaregiverMessages() {
    const [demoState, setDemoState] = useState(() => getDemoChatState());
    const [activeTab, setActiveTab] = useState("active"); // 'active' | 'other' | 'all'
    const [inputText, setInputText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("Bận lịch đột xuất");
    const [customReason, setCustomReason] = useState("");

    // Mobile view selector: 'list' | 'chat' | 'details'
    const [mobileSection, setMobileSection] = useState("chat");

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Lắng nghe thay đổi store từ màn hình Family hoặc tab khác
    useEffect(() => {
        const unsubscribe = subscribeDemoChat((updated) => {
            setDemoState(updated);
        });
        return unsubscribe;
    }, []);

    // Tự cuộn tin nhắn xuống cuối
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        });
    }, [demoState.messages]);

    // Gửi tin nhắn từ phía Caregiver
    const handleSendMessage = (e) => {
        e?.preventDefault();
        const trimmed = inputText.trim();
        if (!trimmed) return;
        if (demoState.status === "closed" || demoState.status === "caregiver_rejected") return;

        addDemoMessage("caregiver", trimmed);
        setInputText("");
    };

    // Chọn phản hồi nhanh
    const handleQuickReply = (text) => {
        if (demoState.status === "closed" || demoState.status === "caregiver_rejected") return;
        addDemoMessage("caregiver", text);
    };

    // Hành động chấp nhận nhận ca
    const handleAcceptRequest = () => {
        setDemoStatus("caregiver_accepted");
    };

    // Hành động từ chối yêu cầu
    const handleConfirmReject = () => {
        const finalReason = rejectReason === "Lý do khác" ? customReason : rejectReason;
        setDemoStatus("caregiver_rejected", finalReason || "Điều dưỡng bận lịch");
        setShowRejectModal(false);
        setCustomReason("");
    };

    // Reset lại dữ liệu demo
    const handleResetDemo = () => {
        resetDemoChat();
    };

    const booking = demoState.bookingInfo;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] flex flex-col font-sans">
            {/* Header trang */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#102030]">
                            Tin nhắn & Trao đổi
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e7f7fc] text-[#00677c] border border-[#c5eaf3]">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#00677c]" />
                            Kênh bảo mật • Điều dưỡng
                        </span>
                    </div>
                    <p className="text-[14px] sm:text-[15px] text-slate-600 mt-1.5">
                        Trao đổi nhu cầu chăm sóc với gia đình bệnh nhân và xác nhận nhận ca trước khi tạo lịch hẹn.
                    </p>
                </div>

                {/* Các nút tiện ích */}
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleResetDemo}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:text-[#00677c] bg-white rounded-xl border border-slate-200 hover:border-teal-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
                        title="Làm mới trạng thái cuộc trao đổi ban đầu"
                    >
                        <RotateCcw className="w-4 h-4 text-slate-500" />
                        Làm mới cuộc trò chuyện
                    </button>
                    <Link
                        to="/caregiver/bookings"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-[#00677c] bg-[#e7f7fc] hover:bg-[#d8f2f8] rounded-xl border border-[#c5eaf3] transition-all"
                    >
                        Xem tất cả yêu cầu
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Thanh điều hướng Tab cho màn hình nhỏ (Mobile) */}
            <div className="flex lg:hidden bg-slate-200/80 p-1 rounded-xl mb-4 text-xs font-semibold">
                <button
                    type="button"
                    onClick={() => setMobileSection("list")}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                        mobileSection === "list" ? "bg-white text-[#102030] shadow-xs" : "text-slate-600"
                    }`}
                >
                    Hội thoại
                </button>
                <button
                    type="button"
                    onClick={() => setMobileSection("chat")}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                        mobileSection === "chat" ? "bg-white text-[#00677c] shadow-xs" : "text-slate-600"
                    }`}
                >
                    Khung chat trực tiếp
                </button>
                <button
                    type="button"
                    onClick={() => setMobileSection("details")}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                        mobileSection === "details" ? "bg-white text-[#102030] shadow-xs" : "text-slate-600"
                    }`}
                >
                    Phiếu yêu cầu ca
                </button>
            </div>

            {/* BỐ CỤC 3 CỘT: DANH SÁCH HỘI THOẠI (3 CỘT) | KHUNG CHAT (5 CỘT) | CHI TIẾT CA & QUYẾT ĐỊNH (4 CỘT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">

                {/* ==============================================================
                    CỘT 1: DANH SÁCH CUỘC TRAO ĐỔI (lg:col-span-3)
                ============================================================== */}
                <aside
                    className={`lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden ${
                        mobileSection !== "list" ? "hidden lg:flex" : "flex"
                    }`}
                >
                    {/* Header danh sách + Ô tìm kiếm */}
                    <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-[#102030]">Hộp thư trao đổi</span>
                            <span className="text-xs font-medium text-slate-400">4 cuộc trò chuyện</span>
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên gia đình..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#00677c] focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Danh sách người dùng */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {/* ITEM CHÍNH: GIA ĐÌNH ANH AN (Liên thông Demo) */}
                        <div
                            onClick={() => setMobileSection("chat")}
                            className="p-3.5 bg-gradient-to-r from-[#edf9fc] to-[#f6fcfd] border-l-4 border-[#00677c] cursor-pointer transition-all hover:bg-[#e6f7fa]"
                        >
                            <div className="flex items-start gap-3">
                                <div className="relative shrink-0">
                                    <div className="w-11 h-11 rounded-full bg-[#00677c] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                                        NA
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                        <p className="text-sm font-bold text-[#102030] truncate">
                                            Gia đình anh Nguyễn Văn An
                                        </p>
                                        <span className="text-[10px] text-slate-400 shrink-0">Vừa xong</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mb-1.5">
                                        Người bệnh: {booking.recipientName} ({booking.recipientAge})
                                    </p>

                                    {/* Badge trạng thái thỏa thuận thời gian thực */}
                                    {demoState.status === "family_confirmed" && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                            <AlertCircle className="w-3 h-3" />
                                            Yêu cầu nhận ca mới!
                                        </span>
                                    )}
                                    {demoState.status === "caregiver_accepted" && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Đã đồng ý nhận ca
                                        </span>
                                    )}
                                    {demoState.status === "caregiver_rejected" && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                                            <XCircle className="w-3 h-3" />
                                            Đã từ chối nhận ca
                                        </span>
                                    )}
                                    {demoState.status === "idle" && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
                                            <MessageSquare className="w-3 h-3" />
                                            Đang trao đổi nhu cầu
                                        </span>
                                    )}
                                    {demoState.status === "closed" && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                                            Cuộc trao đổi đã dừng
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Các item phụ khác */}
                        {mockOtherConversations.map((c) => (
                            <div
                                key={c.id}
                                className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors opacity-75 hover:opacity-100"
                            >
                                <div className="flex items-start gap-3">
                                    <img
                                        src={c.avatar}
                                        alt={c.name}
                                        className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1 mb-0.5">
                                            <p className="text-sm font-semibold text-slate-800 truncate">
                                                {c.name}
                                            </p>
                                            <span className="text-[10px] text-slate-400 shrink-0">{c.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate mb-1">
                                            {c.lastMessage}
                                        </p>
                                        <span className="text-[10px] text-slate-400">
                                            {c.statusText}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ==============================================================
                    CỘT 2: KHUNG CHAT TRỰC TIẾP (lg:col-span-5)
                ============================================================== */}
                <main
                    className={`lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden ${
                        mobileSection !== "chat" ? "hidden lg:flex" : "flex"
                    }`}
                >
                    {/* Header khung chat */}
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-[#00677c] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                                NA
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm sm:text-base font-bold text-[#102030] truncate">
                                        Anh Nguyễn Văn An
                                    </h2>
                                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Người nhà bệnh nhân
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">
                                    Bệnh nhân: {booking.recipientName} • SĐT: 0901 234 567
                                </p>
                            </div>
                        </div>

                        {/* Nút xem chi tiết trên Mobile */}
                        <button
                            type="button"
                            onClick={() => setMobileSection("details")}
                            className="lg:hidden text-xs text-[#00677c] font-semibold bg-[#edf9fc] px-2.5 py-1.5 rounded-lg border border-[#cbeaf2]"
                        >
                            Xem ca
                        </button>
                    </div>

                    {/* Vùng tin nhắn */}
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 min-h-[380px] max-h-[520px] overflow-y-auto px-4 sm:px-6 py-5 flex flex-col gap-3.5 bg-[#f8fafc] scroll-smooth"
                        style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
                    >
                        {demoState.messages.map((msg, idx) => {
                            // Tin nhắn thông báo hệ thống
                            if (msg.sender === "system") {
                                return (
                                    <div
                                        key={msg.id ?? idx}
                                        className="flex flex-col items-center my-1.5 animate-[fadeIn_200ms_ease-out]"
                                    >
                                        <div className="max-w-[90%] px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 text-center font-medium shadow-2xs">
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-0.5">
                                            {msg.time}
                                        </span>
                                    </div>
                                );
                            }

                            // Tin nhắn người gửi: Điều dưỡng là bên Outgoing ở màn hình này!
                            const isCaregiverSender = msg.sender === "caregiver";

                            return (
                                <div
                                    key={msg.id ?? idx}
                                    className={`flex flex-col w-full ${
                                        isCaregiverSender ? "items-end" : "items-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] shadow-2xs ${
                                            isCaregiverSender
                                                ? "bg-[#00677c] text-white rounded-br-xs"
                                                : "bg-white text-[#102030] rounded-bl-xs border border-slate-200/90"
                                        }`}
                                    >
                                        <p className="whitespace-pre-line leading-relaxed break-words">
                                            {msg.text}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                                        {msg.time} • {isCaregiverSender ? "Bạn (Điều dưỡng Linh)" : "Anh An (Gia đình)"}
                                    </span>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} className="h-px shrink-0" />
                    </div>

                    {/* Quick reply bar */}
                    <div className="px-3 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-1" />
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0">Trả lời nhanh:</span>
                        {quickReplies.map((reply, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleQuickReply(reply)}
                                disabled={demoState.status === "closed" || demoState.status === "caregiver_rejected"}
                                className="text-xs px-2.5 py-1 rounded-full bg-white hover:bg-[#edf9fc] text-slate-700 hover:text-[#00677c] border border-slate-200 hover:border-teal-300 transition-colors shrink-0 disabled:opacity-50"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>

                    {/* Input form */}
                    <form
                        onSubmit={handleSendMessage}
                        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={
                                demoState.status === "closed"
                                    ? "Cuộc trao đổi đã dừng..."
                                    : demoState.status === "caregiver_rejected"
                                    ? "Bạn đã từ chối nhận ca này..."
                                    : "Nhập tin nhắn phản hồi cho gia đình..."
                            }
                            disabled={demoState.status === "closed" || demoState.status === "caregiver_rejected"}
                            className="flex-1 px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00677c] focus:bg-white transition-colors disabled:opacity-60"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() || demoState.status === "closed" || demoState.status === "caregiver_rejected"}
                            className="p-2.5 rounded-xl bg-[#00677c] hover:bg-[#005566] text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all active:scale-95 shrink-0"
                            title="Gửi tin nhắn"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </main>

                {/* ==============================================================
                    CỘT 3: PHIẾU YÊU CẦU CA & HÀNH ĐỘNG QUYẾT ĐỊNH (lg:col-span-4)
                ============================================================== */}
                <aside
                    className={`lg:col-span-4 flex flex-col gap-4 ${
                        mobileSection !== "details" ? "hidden lg:flex" : "flex"
                    }`}
                >
                    {/* Card tóm tắt yêu cầu nhận ca */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                        {/* Header card */}
                        <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-[#edf9fc] to-[#f8fcfd] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-white text-[#00677c] shadow-2xs flex items-center justify-center border border-[#d8eff4]">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#102030]">Yêu cầu chăm sóc</h3>
                                    <p className="text-[11px] text-slate-500">Chi tiết ca dự kiến</p>
                                </div>
                            </div>

                            {/* Badge trạng thái */}
                            {demoState.status === "family_confirmed" && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    Chờ bạn duyệt
                                </span>
                            )}
                            {demoState.status === "caregiver_accepted" && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    Đã đồng ý nhận
                                </span>
                            )}
                            {demoState.status === "caregiver_rejected" && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                                    Đã từ chối
                                </span>
                            )}
                            {demoState.status === "idle" && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                    Chưa gửi yêu cầu
                                </span>
                            )}
                            {demoState.status === "closed" && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                    Đã đóng
                                </span>
                            )}
                        </div>

                        {/* Nội dung thông tin bệnh nhân & ca chăm sóc */}
                        <div className="p-5 flex flex-col gap-4 text-xs">
                            {/* Bệnh nhân */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                                <User className="w-4 h-4 text-[#00677c] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                        Bệnh nhân
                                    </p>
                                    <p className="text-sm font-bold text-[#102030]">
                                        {booking.recipientName} ({booking.recipientAge})
                                    </p>
                                    <p className="text-slate-500 mt-0.5">
                                        {booking.condition}
                                    </p>
                                </div>
                            </div>

                            {/* Dịch vụ & Thời gian */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                        Dịch vụ
                                    </p>
                                    <p className="text-xs font-bold text-[#102030] mt-0.5">
                                        {booking.serviceName}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                        Khung giờ
                                    </p>
                                    <p className="text-xs font-bold text-[#102030] mt-0.5">
                                        {booking.scheduledTime}
                                    </p>
                                </div>
                            </div>

                            {/* Ngày & Địa chỉ */}
                            <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="font-semibold">{booking.scheduledDate}</span>
                                </div>
                                <div className="flex items-start gap-2 text-slate-700">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                    <span>{booking.address}</span>
                                </div>
                            </div>

                            {/* Thu nhập dự kiến */}
                            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800">
                                        Thu nhập thực nhận
                                    </span>
                                    <p className="text-[11px] text-emerald-700">Sau khi trừ phí nền tảng CareLink</p>
                                </div>
                                <span className="text-base font-extrabold text-emerald-800">
                                    {booking.fee}
                                </span>
                            </div>
                        </div>

                        {/* KHU VỰC NÚT QUYẾT ĐỊNH (HÀNH ĐỘNG 2 CHIỀU) */}
                        <div className="p-5 border-t border-slate-100 bg-[#fbfcfd] flex flex-col gap-3">
                            {/* Trường hợp 1: Family đã gửi yêu cầu -> Caregiver ra quyết định */}
                            {demoState.status === "family_confirmed" && (
                                <div className="flex flex-col gap-2.5">
                                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                                        🔔 Gia đình anh An đã gửi đề nghị đặt lịch! Hãy quyết định nhận ca hoặc từ chối để thông báo lại cho gia đình.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAcceptRequest}
                                        className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Đồng ý nhận ca này
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRejectModal(true)}
                                        className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-rose-700 bg-white hover:bg-rose-50 border border-rose-300 transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Từ chối yêu cầu
                                    </button>
                                </div>
                            )}

                            {/* Trường hợp 2: Caregiver đã chấp nhận */}
                            {demoState.status === "caregiver_accepted" && (
                                <div className="flex flex-col gap-3">
                                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                                        <p className="font-bold flex items-center gap-1.5 text-emerald-950 mb-1">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Bạn đã đồng ý nhận ca thành công!
                                        </p>
                                        Phía Gia đình hiện đã nhận được phản hồi và có thể bấm nút <strong className="underline">Tiến hành thanh toán</strong> để hoàn tất lịch hẹn.
                                    </div>
                                    <Link
                                        to="/caregiver/schedule"
                                        className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-[#00677c] bg-[#edf9fc] hover:bg-[#d8f2f8] border border-[#cbeaf2] transition-colors text-center block"
                                    >
                                        Xem lịch làm việc của bạn
                                    </Link>
                                </div>
                            )}

                            {/* Trường hợp 3: Caregiver đã từ chối */}
                            {demoState.status === "caregiver_rejected" && (
                                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed">
                                    <p className="font-bold flex items-center gap-1.5 text-rose-950 mb-1">
                                        <XCircle className="w-4 h-4 text-rose-600" />
                                        Đã từ chối nhận ca
                                    </p>
                                    Lý do: "{demoState.rejectReason || "Bận đột xuất"}". Ca này sẽ không được đưa vào lịch hẹn của bạn.
                                </div>
                            )}

                            {/* Trường hợp 4: Đang trao đổi (chưa bấm gửi yêu cầu) */}
                            {demoState.status === "idle" && (
                                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-relaxed">
                                    <p className="font-bold text-sky-950 mb-1">
                                        💬 Đang trao đổi nhu cầu
                                    </p>
                                    Gia đình đang tìm hiểu và nhắn tin với bạn. Khi hai bên thống nhất, gia đình sẽ bấm <span className="font-semibold">"Xác nhận muốn đặt lịch"</span> ở màn hình của họ để chuyển yêu cầu qua cho bạn duyệt.
                                </div>
                            )}

                            {/* Trường hợp 5: Đã đóng */}
                            {demoState.status === "closed" && (
                                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                                    Gia đình đã dừng cuộc trao đổi này.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hướng dẫn an toàn dành cho Điều dưỡng */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs text-slate-600 flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Quy tắc nhận ca an toàn
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 leading-relaxed">
                            <li>Chỉ nhận ca khi đảm bảo đúng chuyên môn và trống lịch trực.</li>
                            <li>Không trao đổi số tài khoản cá nhân để nhận tiền ngoài nền tảng.</li>
                            <li>CareLink hỗ trợ bảo hiểm trách nhiệm nghề nghiệp trong suốt ca làm.</li>
                        </ul>
                    </div>
                </aside>
            </div>

            {/* ==============================================================
                MODAL TỪ CHỐI YÊU CẦU NHẬN CA (Có chọn lý do trang nhã)
            ============================================================== */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-[fadeIn_150ms_ease-out]">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                                <XCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-slate-900">
                                    Từ chối yêu cầu nhận ca?
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Vui lòng chọn lý do để hệ thống gửi lời xin lỗi trang nhã đến gia đình.
                                </p>
                            </div>
                        </div>

                        {/* Danh sách lý do */}
                        <div className="flex flex-col gap-2 text-xs">
                            {[
                                "Bận lịch đột xuất vào khung giờ này",
                                "Địa chỉ nằm ngoài bán kính di chuyển",
                                "Yêu cầu chăm sóc vượt ngoài chuyên môn hiện tại",
                                "Lý do khác",
                            ].map((reason) => (
                                <label
                                    key={reason}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                        rejectReason === reason
                                            ? "border-[#00677c] bg-[#edf9fc] text-[#00677c] font-semibold"
                                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="rejectReason"
                                        checked={rejectReason === reason}
                                        onChange={() => setRejectReason(reason)}
                                        className="text-[#00677c] focus:ring-[#00677c]"
                                    />
                                    <span>{reason}</span>
                                </label>
                            ))}

                            {rejectReason === "Lý do khác" && (
                                <textarea
                                    rows={2}
                                    placeholder="Nhập lý do cụ thể..."
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#00677c]"
                                />
                            )}
                        </div>

                        {/* Nút hành động modal */}
                        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmReject}
                                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
                            >
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
