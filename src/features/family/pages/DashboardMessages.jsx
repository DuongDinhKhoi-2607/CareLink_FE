import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Dữ liệu danh sách các cuộc trò chuyện trong Dashboard
const initialConversations = [
    {
        id: "caregiver-1",
        name: "ĐD. Nguyễn Thùy Linh",
        role: "Cử nhân Y4 • ĐH Y Dược TP.HCM",
        // Dùng chung ảnh online với trang Báo cáo sức khỏe & Dashboard
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
        online: true,
        type: "active", // Đang trong ca chăm sóc
        careTarget: "Bà Nguyễn Thị Lan (75 tuổi) • Mẹ anh An",
        shiftInfo: "Ca hôm nay: 08:00 - 10:00 (Đang diễn ra)",
        serviceName: "Chăm sóc phục hồi sau phẫu thuật",
        address: "123 Nguyễn Gia Trí, P. 25, Bình Thạnh, TP. HCM",
        unreadCount: 1,
        lastMessage: "Dạ em vừa hoàn thành đo các chỉ số sinh hiệu cho bà Lan...",
        lastTime: "10:14",
        vitals: {
            bp: "125/80 mmHg",
            heartRate: "74 bpm",
            temp: "36.8 °C",
            spo2: "98%",
            updatedAt: "10:10 hôm nay",
            status: "Ổn định",
        },
    },
    {
        id: "caregiver-2",
        name: "KTV. Trần Quốc Tuấn",
        role: "Kỹ thuật viên PHCN • BV Chợ Rẫy",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
        online: false,
        type: "upcoming", // Lịch tiếp theo
        careTarget: "Bà Nguyễn Thị Lan (75 tuổi) • Mẹ anh An",
        shiftInfo: "Ca tiếp theo: Chiều mai, 14:00 - 16:00",
        serviceName: "Vật lý trị liệu & Vận động khớp gối",
        address: "123 Nguyễn Gia Trí, P. 25, Bình Thạnh, TP. HCM",
        unreadCount: 0,
        lastMessage: "Chào anh An, chiều mai 14h em qua hướng dẫn bà tập vận động nhẹ nhé.",
        lastTime: "Hôm qua",
        vitals: null,
    },
    {
        id: "support-carelink",
        name: "Trung Tâm Y Tế CareLink 24/7",
        role: "Đội ngũ Bác sĩ Trực ban & CSKH",
        avatar: "/carelink-logo.png",
        isCareLinkBot: true,
        online: true,
        type: "support", // Kênh hỗ trợ
        careTarget: "Hỗ trợ thành viên Gia đình Bác An",
        shiftInfo: "Hỗ trợ y tế khẩn cấp 24/7",
        serviceName: "Tư vấn & Điều phối khẩn cấp",
        address: "Hỗ trợ trực tuyến TP. Hồ Chí Minh",
        unreadCount: 0,
        lastMessage: "Hệ thống đã cập nhật Báo cáo sức khỏe mới nhất của Bà Lan.",
        lastTime: "23/09",
        vitals: null,
    },
];

// Lịch sử tin nhắn khởi tạo cho từng hội thoại (Chào anh An theo hồ sơ Family)
const initialMessagesMap = {
    "caregiver-1": [
        {
            id: 1,
            sender: "caregiver",
            text: "Chào anh An, em đã có mặt tại nhà và đang chuẩn bị hỗ trợ bà vệ sinh cá nhân buổi sáng ạ.",
            time: "08:00 AM",
            type: "text",
        },
        {
            id: 2,
            sender: "family",
            text: "Cảm ơn em nhiều nhé! Sáng nay bà có than đau mỏi khớp gối nhiều không em?",
            time: "08:05 AM",
            type: "text",
        },
        {
            id: 3,
            sender: "caregiver",
            text: "Dạ bà bảo khớp gối đỡ sưng hơn hôm qua nhiều rồi anh ạ. Em vừa hỗ trợ bà co duỗi nhẹ nhàng 15 phút tại giường rất tốt.",
            time: "08:12 AM",
            type: "text",
        },
        {
            id: 4,
            sender: "family",
            text: "May quá! Anh có để sẵn hộp sữa chua với thuốc huyết áp sau ăn ở tủ thứ 2, em nhắc bà giúp anh với nhé.",
            time: "08:25 AM",
            type: "text",
        },
        {
            id: 5,
            sender: "caregiver",
            text: "Dạ vâng, bà đã dùng bữa nhẹ và uống thuốc đầy đủ theo toa rồi anh yên tâm nha!",
            time: "08:40 AM",
            type: "text",
        },
        {
            id: 6,
            sender: "caregiver",
            text: "Em vừa hoàn thành kiểm tra các chỉ số sinh hiệu cho bà Lan lúc 10:10. Em gửi kết quả cập nhật trực tiếp vào hệ thống nhé:",
            time: "10:14 AM",
            type: "vital_card",
            vitals: {
                bp: "125/80 mmHg",
                heartRate: "74 bpm",
                temp: "36.8 °C",
                spo2: "98%",
                note: "Vết mổ khô ráo, không sưng đỏ. Tinh thần bà minh mẫn, vui vẻ.",
            },
        },
        {
            id: 7,
            sender: "caregiver",
            text: "Anh kiểm tra xem gia đình có cần em dặn dò thêm gì trước khi kết thúc ca trực 10:00 không ạ?",
            time: "10:15 AM",
            type: "text",
        },
    ],
    "caregiver-2": [
        {
            id: 101,
            sender: "family",
            text: "Chào em Tuấn, lịch chiều mai 14h của bà Lan nhà anh em vẫn qua đúng giờ được chứ?",
            time: "09:30 AM",
            type: "text",
        },
        {
            id: 102,
            sender: "caregiver",
            text: "Chào anh An, chiều mai 14h em qua hướng dẫn bà tập vận động nhẹ nhé. Em sẽ mang theo bóng tập và đai hỗ trợ gối ạ.",
            time: "10:00 AM",
            type: "text",
        },
    ],
    "support-carelink": [
        {
            id: 201,
            sender: "caregiver",
            text: "Kính chào anh Nguyễn Văn An! CareLink sẵn sàng hỗ trợ điều phối điều dưỡng khẩn cấp và giải đáp mọi vấn đề kỹ thuật 24/7.",
            time: "07:00 AM",
            type: "text",
        },
        {
            id: 202,
            sender: "caregiver",
            text: "Hệ thống đã tự động đồng bộ Báo cáo sức khỏe mới nhất của Bà Nguyễn Thị Lan từ Điều dưỡng Nguyễn Thùy Linh. Quý gia đình có thể theo dõi trực tiếp tại mục Báo cáo sức khỏe.",
            time: "10:15 AM",
            type: "text",
        },
    ],
};

// Gợi ý tin nhắn y tế nhanh 1 chạm (Quick Smart Chips)
const quickReplies = [
    "🩺 Hôm nay bà ăn uống có ngon miệng không em?",
    "💊 Bà đã uống thuốc theo toa sáng nay chưa?",
    "🩹 Nhờ em kiểm tra kỹ vết mổ giúp anh nhé.",
    "🥣 Em dặn bà uống thêm nước ấm giúp anh với nha.",
];

export default function DashboardMessages() {
    const [conversations] = useState(initialConversations);
    const [activeChatId, setActiveChatId] = useState("caregiver-1");
    const [messagesMap, setMessagesMap] = useState(initialMessagesMap);
    const [inputText, setInputText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [isTyping, setIsTyping] = useState(false);
    const [showRightDrawer, setShowRightDrawer] = useState(false);

    const messagesContainerRef = useRef(null);
    const activeConv = conversations.find((c) => c.id === activeChatId) || conversations[0];
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
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.careTarget.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;
        if (activeFilter === "active") return c.type === "active";
        if (activeFilter === "support") return c.type === "support";
        return true;
    });

    // Xử lý gửi tin nhắn
    const handleSendMessage = (textToSend) => {
        const text = (textToSend || inputText).trim();
        if (!text) return;

        const newMsgId = Date.now();
        const nowTime = new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const newMsg = {
            id: newMsgId,
            sender: "family",
            text: text,
            time: nowTime,
            type: "text",
        };

        setMessagesMap((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newMsg],
        }));

        setInputText("");
        setTimeout(() => scrollToBottom("smooth"), 50);

        // Giả lập Điều dưỡng hoặc Bot tự động trả lời chân thực (Auto-reply Simulation)
        if (activeChatId === "caregiver-1" || activeChatId === "support-carelink") {
            setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => scrollToBottom("smooth"), 50);
            }, 800);

            setTimeout(() => {
                setIsTyping(false);
                let replyContent = "Dạ vâng, em đã ghi nhận thông tin dặn dò của anh An ạ. Em đang theo dõi sát tình trạng của bà, anh cứ yên tâm nhé!";

                if (text.includes("ăn uống") || text.includes("ngon miệng")) {
                    replyContent = "Dạ sáng nay bà ăn được hơn nửa bát cháo yến mạch và 1 hũ sữa chua, tinh thần rất vui vẻ anh nhé!";
                } else if (text.includes("thuốc")) {
                    replyContent = "Dạ vâng, bà đã uống đúng 2 viên thuốc huyết áp và 1 viên kháng viêm sau bữa ăn lúc 08:35 rồi ạ.";
                } else if (text.includes("vết mổ") || text.includes("băng")) {
                    replyContent = "Dạ vết mổ liền miệng rất đẹp, dịch không rỉ ra băng, em đã sát khuẩn và thay gạc mới vô trùng cho bà rồi ạ.";
                } else if (activeChatId === "support-carelink") {
                    replyContent = "Tổng đài CSKH CareLink đã tiếp nhận yêu cầu từ anh An. Chuyên viên chăm sóc khách hàng sẽ liên hệ lại ngay trong 5 phút.";
                }

                const replyMsg = {
                    id: Date.now() + 1,
                    sender: "caregiver",
                    text: replyContent,
                    time: new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    type: "text",
                };

                setMessagesMap((prev) => ({
                    ...prev,
                    [activeChatId]: [...(prev[activeChatId] || []), replyMsg],
                }));
                setTimeout(() => scrollToBottom("smooth"), 80);
            }, 2300);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex-1 flex flex-col font-sans bg-[#f7fafc] min-h-[calc(100vh-80px)] animate-page-enter">
            {/* Header thanh điều hướng trang Chat trong Dashboard */}
            <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
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
            <div className="flex-1 flex overflow-hidden h-[calc(100vh-145px)]">
                {/* ═══ CỘT TRÁI: DANH SÁCH CUỘC TRÒ CHUYỆN (310px - 360px) ═══ */}
                <div className="w-full sm:w-80 md:w-[340px] bg-white border-r border-slate-200/80 flex flex-col shrink-0">
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
                                    onClick={() => setActiveChatId(conv.id)}
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
                <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden min-w-0">
                    {/* Header cuộc trò chuyện đang chọn */}
                    <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs z-10">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                                {activeConv.isCareLinkBot ? (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00677c] to-[#002045] flex items-center justify-center text-white shadow-2xs">
                                        <svg className="w-5 h-5 text-teal-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.18-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                ) : (
                                    <img
                                        src={activeConv.avatar}
                                        alt={activeConv.name}
                                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shadow-2xs"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/images/caregiver_avatar.svg";
                                        }}
                                    />
                                )}
                                {activeConv.online && (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                                )}
                            </div>

                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm sm:text-base font-extrabold text-[#002045] truncate">
                                        {activeConv.name}
                                    </h2>
                                    <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/50">
                                        ✓ Đã xác thực y tế
                                    </span>
                                </div>
                                <span className="text-[11.5px] text-slate-500 truncate flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {activeConv.shiftInfo}
                                </span>
                            </div>
                        </div>

                        {/* Các nút công cụ thao tác */}
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => alert(`Đang kết nối cuộc gọi thoại với ${activeConv.name}...`)}
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
                    <div ref={messagesContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                        {/* Mốc thời gian */}
                        <div className="flex items-center justify-center my-2">
                            <span className="px-3 py-1 bg-slate-200/70 text-slate-600 rounded-full text-[11px] font-semibold">
                                Hôm nay, 24/05/2026
                            </span>
                        </div>

                        {currentMessages.map((msg) => {
                            const isOutgoing = msg.sender === "family";

                            return (
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

                                        {/* Timestamp + Read Status */}
                                        <div className={`flex items-center gap-1 text-[10px] text-slate-400 px-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                            <span>{msg.time}</span>
                                            {isOutgoing && (
                                                <span className="text-teal-600 font-bold" title="Đã xem">
                                                    ✓✓
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

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
                            onClick={() => alert("Chức năng đính kèm: Đã chọn ảnh vết mổ / đơn thuốc từ thư viện thiết bị.")}
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
                                    <p><strong>Dịch vụ:</strong> {activeConv.serviceName}</p>
                                    <p><strong>Khung giờ:</strong> 08:00 - 10:00 (Hôm nay)</p>
                                    <p><strong>Địa chỉ:</strong> {activeConv.address}</p>
                                </div>
                            </div>

                            {/* Thẻ chỉ số sinh hiệu trực tiếp mới nhất */}
                            {activeConv.vitals && (
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
                                            <span className="font-extrabold text-teal-700">{activeConv.vitals.bp}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-500">Nhịp tim:</span>
                                            <span className="font-extrabold text-rose-600">{activeConv.vitals.heartRate}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                                            <span className="text-slate-500">Thân nhiệt:</span>
                                            <span className="font-extrabold text-amber-600">{activeConv.vitals.temp}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1">
                                            <span className="text-slate-500">Nồng độ SpO2:</span>
                                            <span className="font-extrabold text-blue-600">{activeConv.vitals.spo2}</span>
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
        </div>
    );
}
