// Hàm định dạng ngày phân cách tin nhắn chuẩn phong cách Zalo / Messenger
function formatMessageDateDivider(dateValue) {
    if (!dateValue) {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        return `Hôm nay, ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    }
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "Hôm nay";

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));

    const pad = (n) => String(n).padStart(2, "0");
    const dStr = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

    if (diffDays === 0) {
        return `Hôm nay, ${dStr}`;
    } else if (diffDays === 1) {
        return `Hôm qua, ${dStr}`;
    } else {
        const weekdays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
        const weekday = weekdays[date.getDay()] || "Ngày";
        return `${weekday}, ${dStr}`;
    }
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import conversationApi from "../../../api/conversationApi";
import DirectBookingModal from "../components/DirectBookingModal";

// Gợi ý tin nhắn y tế nhanh 1 chạm (Quick Smart Chips)
const quickReplies = [
    "🩺 Hôm nay bà ăn uống có ngon miệng không em?",
    "💊 Bà đã uống thuốc theo toa sáng nay chưa?",
    "🩹 Nhờ em kiểm tra kỹ vết mổ giúp anh nhé.",
    "🥣 Em dặn bà uống thêm nước ấm giúp anh với nha.",
];

export default function DashboardMessages() {
    const [conversations, setConversations] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [messagesMap, setMessagesMap] = useState({});
    const [inputText, setInputText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showRightDrawer, setShowRightDrawer] = useState(false);
    const [mobileView, setMobileView] = useState("chat"); // 'list' | 'chat'
    const [toastMessage, setToastMessage] = useState(null);
    const [showDirectBookingModal, setShowDirectBookingModal] = useState(false);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // 1. Tải danh sách hội thoại thực từ Backend API (GET /api/v1/conversations) kèm Polling 3.5s
    const fetchConversations = useCallback(async (isInitial = false) => {
        try {
            const res = await conversationApi.getConversations({ PageNumber: 1, PageSize: 50 });
            const items = res?.items || (Array.isArray(res) ? res : []);
            if (items.length > 0) {
                const mapped = items.map((c) => ({
                    id: c.id,
                    name: c.otherPartyName || c.nurseName || "Điều dưỡng",
                    role: c.otherPartyRole === "Nurse" ? "Điều dưỡng chuyên nghiệp" : "Thành viên gia đình",
                    avatar: c.otherPartyAvatar || c.nurseAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
                    online: true,
                    type: "active",
                    careTarget: "Trao đổi kế hoạch chăm sóc",
                    shiftInfo: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString("vi-VN") : "Hội thoại mới",
                    serviceName: "Dịch vụ điều dưỡng CareLink",
                    address: "TP. Hồ Chí Minh",
                    unreadCount: 0,
                    lastMessage: c.lastMessageContent || "Chưa có tin nhắn mới",
                    lastTime: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "",
                    vitals: null,
                    isRealApi: true,
                    nurseId: c.nurseId || c.caregiverId || (c.otherPartyRole === "Nurse" ? (c.otherPartyId || c.otherUserId || c.userId) : null),
                    otherUserId: c.otherPartyId || c.otherUserId || c.nurseId,
                }));
                setConversations(mapped);
                setActiveChatId((prev) => (prev && mapped.some((m) => m.id === prev) ? prev : mapped[0].id));
            } else {
                setConversations([]);
                if (isInitial) setActiveChatId(null);
            }
        } catch (err) {
            console.warn("[CareLink] Lỗi tải hội thoại:", err);
            if (isInitial) {
                setConversations([]);
                setActiveChatId(null);
            }
        }
    }, []);

    useEffect(() => {
        fetchConversations(true);
        const interval = setInterval(() => {
            fetchConversations(false);
        }, 3500);
        return () => clearInterval(interval);
    }, [fetchConversations]);

    // 2. Tải & Polling tin nhắn của hội thoại đang chọn
    const fetchMessages = useCallback(async (convId) => {
        if (!convId) return;
        try {
            const res = await conversationApi.getMessages(convId, { PageNumber: 1, PageSize: 50 });
            const items = res?.items || (Array.isArray(res) ? res : []);
            const mappedMsgs = items.map((m) => ({
                id: m.id,
                sender: m.isMine ? "family" : "caregiver",
                text: m.content,
                createdAt: m.createdAt,
                time: new Date(m.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                type: m.type === 2 ? "proposal_card" : "text",
                proposalId: m.proposalId,
                bookingId: m.bookingId,
            }));
            setMessagesMap((prev) => ({
                ...prev,
                [convId]: mappedMsgs,
            }));
        } catch (err) {
            console.warn("[CareLink] Lỗi tải tin nhắn:", err);
        }
    }, []);

    useEffect(() => {
        if (!activeChatId) return;
        fetchMessages(activeChatId);
        const msgInterval = setInterval(() => {
            fetchMessages(activeChatId);
        }, 3500);
        return () => clearInterval(msgInterval);
    }, [activeChatId, fetchMessages]);

    const handleProposalCreated = (newProposal) => {
        showToast("Đã gửi đề xuất ca chăm sóc thành công! Đang chờ điều dưỡng phản hồi.");
        if (activeChatId) {
            fetchMessages(activeChatId);
            fetchConversations(false);
        }
    };
    const messagesContainerRef = useRef(null);
    const activeConv = conversations.find((c) => c.id === activeChatId) || conversations[0] || null;
    const currentMessages = messagesMap[activeChatId] || [];

    // Luôn giữ ở đầu trang khi mới vào trang chat hoặc khi chuyển đổi hội thoại
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = 0;
        }
    }, [activeChatId]);

    // Hàm cuộn tin nhắn cục bộ (chỉ cuộn khung tin nhắn, TUYỆT ĐỐI không cuộn cả trang web)
    const scrollToBottom = (behavior = "smooth") => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: behavior,
            });
        }
    };

    // Lọc danh sách hội thoại
    const filteredConversations = conversations.filter((c) => {
        const matchesSearch =
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.careTarget?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;
        if (activeFilter === "active") return c.type === "active";
        if (activeFilter === "support") return c.type === "support";
        return true;
    });

    // Xử lý gửi tin nhắn
    const handleSendMessage = async (textToSend) => {
        const text = (textToSend || inputText).trim();
        if (!text || isSending || !activeChatId) return;

        setIsSending(true);
        try {
            const res = await conversationApi.sendMessage(activeChatId, { content: text });
            const newMsg = {
                id: res.id || Date.now(),
                sender: "family",
                text: res.content || text,
                createdAt: res.createdAt || new Date().toISOString(),
                time: new Date(res.createdAt || Date.now()).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                type: "text",
            };
            setMessagesMap((prev) => ({
                ...prev,
                [activeChatId]: [...(prev[activeChatId] || []), newMsg],
            }));
            setInputText("");
            setTimeout(() => scrollToBottom("smooth"), 50);
            fetchConversations(false);
        } catch (err) {
            console.error("[CareLink] Gửi tin nhắn thất bại:", err);
            const msg = err.response?.data?.detail || err.response?.data?.message || "Không thể gửi tin nhắn. Vui lòng thử lại.";
            showToast(msg);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="w-full h-full flex-1 flex flex-col min-h-0 overflow-hidden font-sans bg-[#f7fafc] animate-page-enter">
            {/* Header thanh điều hướng trang Chat trong Dashboard */}
            <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00677c] flex items-center justify-center border border-teal-100 shadow-2xs">
                        <svg className="w-5 h-5 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg sm:text-xl font-extrabold text-[#002045]">
                                Tin nhắn Chăm sóc
                            </h1>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
                                2 ca trực đang kết nối
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Kênh trao đổi trực tiếp giữa Gia đình Bác An và Điều dưỡng trong quá trình thực hiện dịch vụ
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link
                        to="/dashboard/health-reports"
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                        <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                        </svg>
                        <span>Nhật ký sức khỏe</span>
                    </Link>

                    <a
                        href="tel:19001234"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors shadow-2xs"
                        title="Đường dây nóng khẩn cấp"
                    >
                        <svg className="w-3.5 h-3.5 text-rose-600 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <span>SOS: 1900 1234</span>
                    </a>
                </div>
            </div>

            {/* Bố cục chính 2 hoặc 3 cột chuẩn App Chat Premium */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* ═══ CỘT TRÁI: DANH SÁCH CUỘC TRÒ CHUYỆN (310px - 360px) ═══ */}
                <div className={`${mobileView === "list" ? "flex" : "hidden sm:flex"} w-full sm:w-80 md:w-[340px] bg-white border-r border-slate-200/80 flex-col shrink-0 h-full min-h-0`}>
                    {/* Ô tìm kiếm & bộ lọc */}
                    <div className="p-3.5 border-b border-slate-100 flex flex-col gap-2.5">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm điều dưỡng, nội dung tin nhắn..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-800 rounded-xl border border-transparent focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-slate-400"
                            />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>

                        {/* Bộ lọc tab */}
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setActiveFilter("all")}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeFilter === "all"
                                        ? "bg-[#00677c] text-white shadow-2xs"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                                }`}
                            >
                                Tất cả ({conversations.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter("active")}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeFilter === "active"
                                        ? "bg-teal-700 text-white shadow-2xs"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                                }`}
                            >
                                🩺 Đang ca trực (1)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter("support")}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeFilter === "support"
                                        ? "bg-[#00677c] text-white shadow-2xs"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                                }`}
                            >
                                Hỗ trợ 24/7
                            </button>
                        </div>
                    </div>

                    {/* Danh sách hội thoại cuộn */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                        {filteredConversations.map((conv) => {
                            const isSelected = conv.id === activeChatId;
                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => {
                                        setActiveChatId(conv.id);
                                        setMobileView("chat");
                                    }}
                                    className={`relative p-3 rounded-2xl flex items-start gap-3 cursor-pointer transition-all duration-200 ${
                                        isSelected
                                            ? "bg-teal-50/90 ring-1 ring-teal-200/80 shadow-2xs"
                                            : "hover:bg-slate-50/80"
                                    }`}
                                >
                                    {/* Thanh chỉ báo active bo tròn mềm mại (thay thế cho đường kẻ viền thẳng đứng cũ) */}
                                    {isSelected && (
                                        <span className="absolute left-1.5 top-3.5 bottom-3.5 w-1 rounded-full bg-[#00677c]" />
                                    )}

                                    {/* Avatar với chỉ báo online */}
                                    <div className="relative shrink-0 ml-1">
                                        {conv.isCareLinkBot ? (
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00677c] to-[#002045] flex items-center justify-center text-white shadow-sm ring-2 ring-teal-200/50">
                                                <svg className="w-5.5 h-5.5 text-teal-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.18-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <img
                                                src={conv.avatar}
                                                alt={conv.name}
                                                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100 shadow-2xs"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = "/images/caregiver_avatar.svg";
                                                }}
                                            />
                                        )}
                                        {conv.online && (
                                            <span
                                                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"
                                                title="Đang hoạt động"
                                            />
                                        )}
                                    </div>

                                    {/* Thông tin vắn tắt */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1 mb-0.5">
                                            <h3 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? "text-[#002045]" : "text-slate-800"}`}>
                                                {conv.name}
                                            </h3>
                                            <span className="text-[10.5px] text-slate-400 font-semibold shrink-0">
                                                {conv.lastTime}
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-teal-700 font-semibold truncate mb-1">
                                            {conv.type === "active" ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Đang trong ca trực
                                                </span>
                                            ) : (
                                                conv.role
                                            )}
                                        </p>

                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs text-slate-500 truncate leading-snug">
                                                {conv.lastMessage}
                                            </p>
                                            {conv.unreadCount > 0 && (
                                                <span className="w-4.5 h-4.5 rounded-full bg-[#00677c] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 shadow-2xs">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ═══ CỘT GIỮA: VÙNG TRÒ CHUYỆN CHÍNH ═══ */}
                <div className={`${mobileView === "chat" ? "flex" : "hidden sm:flex"} flex-1 h-full min-h-0 flex-col bg-[#f8fafc] overflow-hidden min-w-0`}>
                    {!activeConv ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f8fafc]">
                            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#00677c] flex items-center justify-center mb-3">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-800">Chưa có cuộc trò chuyện nào</h3>
                            <p className="text-xs text-slate-500 max-w-sm mt-1">
                                Kênh trao đổi với Điều dưỡng sẽ xuất hiện khi bạn đặt lịch ca chăm sóc hoặc bắt đầu tư vấn.
                            </p>
                            <Link
                                to="/services"
                                className="mt-4 px-4 py-2 bg-[#00677c] hover:bg-[#005566] text-white text-xs font-semibold rounded-xl transition shadow-xs"
                            >
                                Khám phá dịch vụ
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Header cuộc trò chuyện đang chọn */}
                            <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs z-10 shrink-0">
                                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                    {/* Nút quay lại danh sách trên Mobile */}
                                    <button
                                        type="button"
                                        onClick={() => setMobileView("list")}
                                        className="sm:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer shrink-0"
                                        title="Quay lại danh sách hội thoại"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>

                                    <div className="relative shrink-0">
                                        {activeConv?.isCareLinkBot ? (
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00677c] to-[#002045] flex items-center justify-center text-white shadow-2xs">
                                                <svg className="w-5 h-5 text-teal-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.18-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <img
                                                src={activeConv?.avatar || "/images/caregiver_avatar.svg"}
                                                alt={activeConv?.name || "Người liên hệ"}
                                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shadow-2xs"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = "/images/caregiver_avatar.svg";
                                                }}
                                            />
                                        )}
                                        {activeConv?.online && (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                                        )}
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-sm sm:text-base font-extrabold text-[#002045] truncate">
                                                {activeConv?.name || "Hội thoại"}
                                            </h2>
                                            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/50">
                                                ✓ Đã xác thực y tế
                                            </span>
                                        </div>
                                        <span className="text-[11.5px] text-slate-500 truncate flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {activeConv?.shiftInfo || "Đang kết nối"}
                                        </span>
                                    </div>
                                </div>

                                {/* Các nút công cụ thao tác */}
                                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                    {/* Nút Đặt lịch ca trực chuẩn duy nhất */}
                                    {(activeConv?.nurseId || activeConv?.otherUserId || activeConv?.isRealApi) && (
                                        <button
                                            type="button"
                                            onClick={() => setShowDirectBookingModal(true)}
                                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] text-white hover:from-[#005566] hover:to-[#007489] font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                                            title="Đặt lịch ca trực từ bảng giờ rảnh thực tế của điều dưỡng"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>Đặt lịch ca trực</span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => showToast(`Đang kết nối cuộc gọi thoại với ${activeConv?.name || "điều dưỡng"}...`)}
                                        className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-teal-700 hover:bg-slate-50 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                        title="Gọi thoại trực tiếp"
                                    >
                                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                        <span className="hidden lg:inline">Gọi điện</span>
                                    </button>

                            {/* Nút bật/tắt ngăn thông tin ca trực kèm tooltip và trạng thái active */}
                            <button
                                type="button"
                                onClick={() => setShowRightDrawer(!showRightDrawer)}
                                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer shadow-2xs ${
                                    showRightDrawer
                                        ? "bg-[#00677c] border-[#00677c] text-white ring-2 ring-teal-500/20"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-teal-700"
                                }`}
                                title={showRightDrawer ? "Ẩn thông tin ca trực" : "Xem thông tin ca trực & Bệnh nhân"}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Vùng hiển thị bong bóng tin nhắn (Cuộn) */}
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/50 to-white"
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(0, 103, 124, 0.25) transparent",
                        }}
                    >
                        {(() => {
                            let lastDateKey = null;
                            return currentMessages.map((msg, index) => {
                                const msgDate = msg.createdAt ? new Date(msg.createdAt) : null;
                                const dateKey = msgDate && !isNaN(msgDate.getTime())
                                    ? `${msgDate.getFullYear()}-${msgDate.getMonth()}-${msgDate.getDate()}`
                                    : "today";
                                const showDivider = dateKey !== lastDateKey;
                                if (showDivider) {
                                    lastDateKey = dateKey;
                                }
                                const isOutgoing = msg.sender === "family";

                                return (
                                    <React.Fragment key={msg.id || index}>
                                        {showDivider && (
                                            <div className="flex items-center justify-center my-3">
                                                <span className="px-3.5 py-1 bg-slate-200/80 text-slate-600 rounded-full text-[11px] font-semibold shadow-2xs">
                                                    {formatMessageDateDivider(msg.createdAt)}
                                                </span>
                                            </div>
                                        )}
                                        <div
                                            key={msg.id}
                                    className={`flex items-end gap-2.5 max-w-[85%] sm:max-w-[75%] ${
                                        isOutgoing ? "ml-auto flex-row-reverse" : "mr-auto"
                                    }`}
                                >
                                    {/* Avatar bên cạnh tin nhắn đối phương */}
                                    {!isOutgoing && (
                                        <img
                                            src={activeConv.avatar}
                                            alt=""
                                            className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 ring-1 ring-slate-200"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/images/caregiver_avatar.svg";
                                            }}
                                        />
                                    )}

                                    <div className="flex flex-col gap-1">
                                        {/* Nội dung dạng Thẻ Chỉ Số Y Tế (Vital Signs Card) */}
                                        {msg.type === "vital_card" && msg.vitals ? (
                                            <div className="p-4 rounded-2xl bg-white border border-teal-200 shadow-md text-slate-800 space-y-3">
                                                <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                                                    <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                                                        </svg>
                                                        Kết quả đo sinh hiệu vừa thực hiện
                                                    </span>
                                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                        Đã lưu vào Báo cáo
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="bg-slate-50 p-2 rounded-xl">
                                                        <span className="text-slate-400 block text-[10px]">Huyết áp</span>
                                                        <span className="font-extrabold text-slate-800 text-sm text-teal-700">{msg.vitals.bp}</span>
                                                    </div>
                                                    <div className="bg-slate-50 p-2 rounded-xl">
                                                        <span className="text-slate-400 block text-[10px]">Nhịp tim</span>
                                                        <span className="font-extrabold text-slate-800 text-sm text-rose-600">{msg.vitals.heartRate}</span>
                                                    </div>
                                                    <div className="bg-slate-50 p-2 rounded-xl">
                                                        <span className="text-slate-400 block text-[10px]">Nhiệt độ</span>
                                                        <span className="font-extrabold text-slate-800 text-sm text-amber-600">{msg.vitals.temp}</span>
                                                    </div>
                                                    <div className="bg-slate-50 p-2 rounded-xl">
                                                        <span className="text-slate-400 block text-[10px]">SpO2 oxy</span>
                                                        <span className="font-extrabold text-slate-800 text-sm text-blue-600">{msg.vitals.spo2}</span>
                                                    </div>
                                                </div>

                                                <p className="text-xs text-slate-600 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                                                    <strong>Ghi chú:</strong> {msg.vitals.note}
                                                </p>
                                            </div>
                                        ) : msg.type === "proposal_card" ? (
                                            /* Thẻ đề xuất ca chăm sóc (Proposal Card) */
                                            <div className="p-4 rounded-2xl bg-white border border-teal-200 shadow-sm text-slate-800 space-y-2.5 max-w-sm">
                                                <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                                                    <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.09 1.976 1.053 1.976 2.188V8.25" />
                                                        </svg>
                                                        Đề xuất lịch chăm sóc
                                                    </span>
                                                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                                                        Thỏa thuận 2 chiều
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-700 leading-relaxed">{msg.text}</p>
                                                {msg.bookingId && (
                                                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                                                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                            </svg>
                                                            Đã tạo ca thành công (Chờ thanh toán)
                                                        </span>
                                                        <Link
                                                            to="/checkout"
                                                            state={{ bookingId: msg.bookingId }}
                                                            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold shadow-xs hover:from-emerald-700 hover:to-teal-800 transition-all cursor-pointer"
                                                        >
                                                            Tiến hành thanh toán
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Bong bóng tin nhắn text thông thường */
                                            <div
                                                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                                                    isOutgoing
                                                        ? "bg-gradient-to-r from-[#00677c] to-[#005566] text-white rounded-br-xs"
                                                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                                                }`}
                                            >
                                                {msg.text}
                                            </div>
                                        )}

                                        {/* Timestamp */}
                                        <div className={`flex items-center gap-1 text-[10px] text-slate-400 px-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                            <span>{msg.time}</span>
                                        </div>
                                    </div>
                                </div>
                                    </React.Fragment>
                                );
                            });
                        })()}

                        {/* Chỉ báo Điều dưỡng đang nhập tin nhắn (Typing indicator) */}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 italic animate-pulse">
                                <img
                                    src={activeConv.avatar}
                                    alt=""
                                    className="w-6 h-6 rounded-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/images/caregiver_avatar.svg";
                                    }}
                                />
                                <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                                    <span className="text-[11px] text-slate-500 ml-1">{activeConv.name} đang soạn tin nhắn...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Thanh gợi ý tin nhắn nhanh (Quick replies) */}
                    <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                            ⚡ Gợi ý:
                        </span>
                        {quickReplies.map((qr, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSendMessage(qr.replace(/^[^\s]+\s/, ""))}
                                className="px-3 py-1 rounded-full bg-white border border-slate-200/80 text-slate-700 hover:text-[#00677c] hover:border-teal-300 text-xs font-medium whitespace-nowrap transition-all shadow-2xs hover:scale-[1.02] cursor-pointer"
                            >
                                {qr}
                            </button>
                        ))}
                    </div>

                    {/* Vùng thanh soạn thảo tin nhắn (Input Bar) */}
                    <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex items-center gap-2 sm:gap-3">
                        {/* Nút gửi ảnh / tài liệu xét nghiệm */}
                        <button
                            type="button"
                            onClick={() => showToast("Đã đính kèm ảnh kết quả xét nghiệm / đơn thuốc từ thư viện thiết bị.")}
                            className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                            title="Đính kèm ảnh vết mổ hoặc đơn thuốc"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                        </button>

                        <div className="flex-1 relative flex items-center">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Nhắn tin cho ${activeConv.name}... (Nhấn Enter để gửi)`}
                                className="w-full pl-4 pr-10 py-2.5 sm:py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-slate-800 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                onClick={() => setInputText((prev) => prev + " 😊")}
                                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                title="Biểu tượng cảm xúc"
                            >
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="8.5" />
                                    <path strokeLinecap="round" d="M8.5 14.25c.83 1.08 2.02 1.62 3.5 1.62s2.66-.54 3.5-1.62M9 9.75h.01M15 9.75h.01" />
                                </svg>
                            </button>
                        </div>

                        {/* Nút gửi tin nhắn */}
                        <button
                            type="button"
                            onClick={() => handleSendMessage()}
                            disabled={!inputText.trim()}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#00677c] hover:bg-[#005566] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-teal-900/20 active:scale-95 shrink-0 cursor-pointer"
                            title="Gửi tin nhắn"
                        >
                            <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>

                {/* ═══ CỘT PHẢI (SMOOTH ANIMATED DRAWER): THÔNG TIN CA TRỰC & SỨC KHỎE ═══ */}
                <div
                    className={`bg-white border-l border-slate-200/80 flex flex-col overflow-y-auto shrink-0 transition-all duration-300 ease-in-out ${
                        showRightDrawer
                            ? "w-72 lg:w-80 p-4 space-y-5 opacity-100"
                            : "w-0 p-0 border-l-0 opacity-0 overflow-hidden pointer-events-none"
                    }`}
                >
                    {showRightDrawer && (
                        <>
                            {/* Nút đóng nhanh drawer trên mobile */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Chi tiết ca trực
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowRightDrawer(false)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Thu gọn"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Card người bệnh đang được chăm sóc */}
                            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex flex-col gap-2.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                                    Ca trực đang diễn ra
                                </span>
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                                        alt="Bà Nguyễn Thị Lan"
                                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-2xs shrink-0"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/images/caregiver_avatar.svg";
                                        }}
                                    />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-[#002045] truncate">
                                            Bà Nguyễn Thị Lan
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            75 tuổi • Mẹ của anh An
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-teal-100">
                                    <p><strong>Dịch vụ:</strong> {activeConv?.serviceName || "Dịch vụ điều dưỡng CareLink"}</p>
                                    <p><strong>Khung giờ:</strong> 08:00 - 10:00 (Hôm nay)</p>
                                    <p><strong>Địa chỉ:</strong> {activeConv?.address || "TP. Hồ Chí Minh"}</p>
                                </div>
                            </div>

                            {/* Thẻ chỉ số sinh hiệu trực tiếp mới nhất */}
                            {activeConv?.vitals && (
                                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-[#002045]">
                                            Chỉ số sinh hiệu đo hôm nay
                                        </span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-500">Huyết áp:</span>
                                            <span className="font-extrabold text-teal-700">{activeConv.vitals?.bp}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-500">Nhịp tim:</span>
                                            <span className="font-extrabold text-rose-600">{activeConv.vitals?.heartRate}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-500">Thân nhiệt:</span>
                                            <span className="font-extrabold text-amber-600">{activeConv.vitals?.temp}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1">
                                            <span className="text-slate-500">Nồng độ SpO2:</span>
                                            <span className="font-extrabold text-blue-600">{activeConv.vitals?.spo2}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to="/dashboard/health-reports"
                                        className="block w-full py-2 text-center text-xs font-bold text-[#00677c] bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
                                    >
                                        Xem toàn bộ Báo cáo sức khỏe →
                                    </Link>
                                </div>
                            )}

                            {/* Cam kết tiêu chuẩn y tế CareLink */}
                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
                                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                                    Tiêu chuẩn an toàn y khoa
                                </span>
                                <ul className="space-y-1.5 text-[11.5px]">
                                    <li className="flex items-center gap-1.5 text-emerald-700">
                                        <span>✓</span> Đã ký cam kết bảo mật y tế
                                    </li>
                                    <li className="flex items-center gap-1.5 text-emerald-700">
                                        <span>✓</span> Giám sát lâm sàng từ Bác sĩ CareLink
                                    </li>
                                    <li className="flex items-center gap-1.5 text-emerald-700">
                                        <span>✓</span> Bảo hiểm trách nhiệm ca trực 100%
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal đặt lịch ca trực nhanh (Xem lịch rảnh thực tế & Đề xuất đàm phán) */}
            {showDirectBookingModal && (activeConv?.nurseId || activeConv?.otherUserId) && (
                <DirectBookingModal
                    isOpen={showDirectBookingModal}
                    onClose={() => setShowDirectBookingModal(false)}
                    nurseId={activeConv.nurseId || activeConv.otherUserId}
                    nurseName={activeConv?.name}
                    nurseAvatar={activeConv?.avatar}
                    conversationId={activeConv?.id}
                    onProposalCreated={() => {
                        showToast("Đã gửi đề xuất ca trực thành công vào cuộc trò chuyện!");
                    }}
                />
            )}

            {/* Toast feedback */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium border border-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
