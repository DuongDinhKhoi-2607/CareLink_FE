import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
    RotateCcw,
    ShieldCheck,
    ChevronRight,
    MessageCircle,
    X,
    SearchX,
    ClipboardList,
    Info,
    AlertCircle,
    CheckCircle2,
    XCircle,
    CircleX,
} from "lucide-react";
import CaregiverChatThread from "../components/CaregiverChatThread";
import CaregiverBookingDetailPanel from "../components/CaregiverBookingDetailPanel";
import conversationApi from "../../../api/conversationApi";

// ============================================================
// DỮ LIỆU MOCK CHO DANH SÁCH HỘI THOẠI PHỤ
// Chỉ dùng để hoàn thiện giao diện demo.
// Những hội thoại này chưa có lịch sử chat riêng.
// ============================================================

// Danh sách hội thoại rỗng mặc định khi chưa có dữ liệu từ Backend API
const mockOtherConversations = [];

// Các câu trả lời nhanh dành cho điều dưỡng.
const quickReplies = [
    {
        label: "Xác nhận lịch",
        text: "Dạ em chào anh ạ! Em xác nhận khung giờ này phù hợp với lịch của em.",
    },
    {
        label: "Hỏi thêm thông tin",
        text: "Dạ anh có thể chia sẻ thêm về tình trạng sức khỏe hiện tại và những lưu ý khi chăm sóc bác không ạ?",
    },
    {
        label: "Xác nhận chuyên môn",
        text: "Dạ em đã xem thông tin sức khỏe của bác. Em sẽ kiểm tra kỹ các yêu cầu chăm sóc để đảm bảo phù hợp với chuyên môn của mình ạ.",
    },
    {
        label: "Trao đổi thời gian",
        text: "Dạ anh cho em hỏi mình có thể linh động khung giờ chăm sóc một chút được không ạ?",
    },
];

const rejectionReasons = [
    "Bận lịch đột xuất vào khung giờ này",
    "Địa chỉ nằm ngoài bán kính di chuyển",
    "Yêu cầu chăm sóc vượt ngoài chuyên môn hiện tại",
    "Lý do khác",
];

// ============================================================
// CÁC HÀM HỖ TRỢ GIAO DIỆN
// ============================================================

// Kênh trò chuyện CareLink là kênh mở liên tục giữa Khách hàng và Điều dưỡng,
// cho phép tiếp tục kết nối trao đổi hoặc đàm phán đặt các ca mới trong tương lai.
const isChatLocked = () => false;

const getStatusConfig = (status) => {
    switch (status) {
        case "family_confirmed":
            return {
                label: "Chờ xác nhận",
                shortLabel: "Chờ bạn duyệt ca",
                icon: AlertCircle,
                className:
                    "bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-xs",
                dotClassName: "bg-amber-500",
            };

        case "caregiver_accepted":
        case "accepted":
            return {
                label: "Đã nhận ca",
                shortLabel: "Đã xác nhận ca",
                icon: CheckCircle2,
                className:
                    "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold shadow-xs",
                dotClassName: "bg-emerald-500",
            };

        case "caregiver_rejected":
        case "rejected":
            return {
                label: "Đã từ chối",
                shortLabel: "Đã từ chối ca",
                icon: XCircle,
                className:
                    "bg-rose-100 text-rose-900 border-rose-300 font-bold shadow-xs",
                dotClassName: "bg-rose-500",
            };

        case "closed":
        case "completed":
            return {
                label: "Đã kết thúc",
                shortLabel: "Đã hoàn thành ca",
                icon: CircleX,
                className:
                    "bg-slate-100 text-slate-800 border-slate-300 font-semibold shadow-xs",
                dotClassName: "bg-slate-500",
            };

        case "system":
            return {
                label: "Hệ thống",
                shortLabel: "Thông báo hệ thống",
                icon: Info,
                className:
                    "bg-purple-100 text-purple-900 border-purple-300 font-semibold shadow-xs",
                dotClassName: "bg-purple-500",
            };

        default:
            return {
                label: "Đang trao đổi",
                shortLabel: "Đang trao đổi nhu cầu",
                icon: MessageCircle,
                className:
                    "bg-sky-100 text-sky-900 border-sky-300 font-semibold shadow-xs",
                dotClassName: "bg-sky-500",
            };
    }
};

// Avatar dạng chữ cái cho các cuộc hội thoại.
function Avatar({
    name = "",
    image,
    size = "md",
    online = false,
}) {
    const sizeClasses = {
        sm: "w-10 h-10 text-xs",
        md: "w-11 h-11 text-sm",
        lg: "w-12 h-12 text-sm",
    };

    const initials = name
        .trim()
        .split(/\s+/)
        .slice(-2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <div className="relative shrink-0">
            {image ? (
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className={`${sizeClasses[size]} rounded-full object-cover border border-slate-200`}
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                    }}
                />
            ) : (
                <div
                    className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-[#087d91] to-[#075669]`}
                >
                    {initials || "CL"}
                </div>
            )}

            {online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            )}
        </div>
    );
}

// Badge trạng thái.
function StatusBadge({ status, compact = false }) {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${
                compact
                    ? "px-2 py-1 text-[10px]"
                    : "px-2.5 py-1.5 text-xs"
            } ${config.className}`}
        >
            <Icon className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
            {compact ? config.shortLabel : config.label}
        </span>
    );
}

// Thẻ thông tin nhỏ.
function DetailItem({ icon: Icon, label, children }) {
    return (
        <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#f0f8fa] text-[#087487] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 mb-1">
                    {label}
                </p>

                <div className="text-[13px] font-semibold text-slate-800 leading-relaxed break-words">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Tin nhắn hệ thống.
function SystemMessage({ message }) {
    return (
        <div className="flex justify-center py-1.5">
            <div className="max-w-[94%] flex flex-col items-center gap-2">
                <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="w-7 h-7 rounded-full bg-[#edf7f9] text-[#087487] flex items-center justify-center shrink-0">
                        <Info className="w-3.5 h-3.5" />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed text-center pt-1">
                        {message.text}
                    </p>
                </div>

                <span className="text-[10px] text-slate-400">
                    {message.time}
                </span>
            </div>
        </div>
    );
}

// Modal xác nhận hành động.
function ConfirmModal({
    open,
    title,
    description,
    confirmText,
    cancelText = "Quay lại",
    onConfirm,
    onCancel,
    danger = false,
    icon: Icon = AlertCircle,
}) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onCancel();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-[fadeIn_150ms_ease-out]"
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                danger
                                    ? "bg-rose-50 text-rose-600"
                                    : "bg-[#edf7f9] text-[#087487]"
                            }`}
                        >
                            <Icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-slate-900">
                                {title}
                            </h3>

                            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${
                            danger
                                ? "bg-rose-600 hover:bg-rose-700"
                                : "bg-[#087487] hover:bg-[#066274]"
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// COMPONENT CHÍNH
// ============================================================

export default function CaregiverMessages() {
    const [demoState, setDemoState] = useState(() =>
        getDemoChatState()
    );

    const [inputText, setInputText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [mobileSection, setMobileSection] = useState("chat");

    const [quickRepliesOpen, setQuickRepliesOpen] = useState(false);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState(
        "Bận lịch đột xuất vào khung giờ này"
    );
    const [customReason, setCustomReason] = useState("");
    const [rejectError, setRejectError] = useState("");

    const [showResetModal, setShowResetModal] = useState(false);

    // Quản lý danh sách hội thoại thực từ Backend API
    const [realConversations, setRealConversations] = useState([]);
    const realConversationsRef = useRef([]);
    const [isUsingRealApi, setIsUsingRealApi] = useState(false);
    const [activeConvId, setActiveConvId] = useState(null);
    const activeConvIdRef = useRef(null);

    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    const booking = demoState.bookingInfo;
    const locked = isChatLocked(demoState.status);

    const statusConfig = getStatusConfig(demoState.status);

    // Lắng nghe cập nhật từ trang Family và các tab cùng nguồn (CHỈ khi ở chế độ demo thuần).
    useEffect(() => {
        const unsubscribe = subscribeDemoChat((updated) => {
            if (isUsingRealApi) return; // Không cho demo state ghi đè khi đang nối API thật
            setDemoState(updated);
        });

        return unsubscribe;
    }, [isUsingRealApi]);

    // Tải chi tiết tin nhắn và đề xuất ca của một hội thoại
    const loadConversationDetails = useCallback(async (convId, convItem = null) => {
        if (!convId) return;
        try {
            const [proposals, messagesRes] = await Promise.all([
                conversationApi.getProposals(convId).catch(() => []),
                conversationApi.getMessages(convId, { PageNumber: 1, PageSize: 50 }).catch(() => [])
            ]);

            const proposalList = Array.isArray(proposals) ? proposals : (proposals?.data || []);
            const pendingProposal = proposalList.find((p) => p.status === 1 || p.status === "Pending");
            const latestProposal = proposalList[proposalList.length - 1];
            const targetProposal = pendingProposal || latestProposal;

            const pad = (n) => String(n).padStart(2, "0");

            let formattedDate = "";
            let formattedTime = "";
            if (targetProposal?.scheduledStart) {
                const sDate = new Date(targetProposal.scheduledStart);
                const eDate = targetProposal.scheduledEnd ? new Date(targetProposal.scheduledEnd) : null;
                formattedDate = sDate.toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });
                const sTime = `${pad(sDate.getHours())}:${pad(sDate.getMinutes())}`;
                const eTime = eDate ? `${pad(eDate.getHours())}:${pad(eDate.getMinutes())}` : "";
                const durMin = targetProposal.serviceDurationMinutes ? ` (${targetProposal.serviceDurationMinutes} phút)` : "";
                formattedTime = eTime ? `${sTime} – ${eTime}${durMin}` : sTime;
            }

            const msgItems = messagesRes?.items || (Array.isArray(messagesRes) ? messagesRes : []);
            const realMessages = msgItems.length > 0 ? msgItems.map((m) => {
                const mDate = new Date(m.createdAt);
                return {
                    id: m.id,
                    sender: m.isMine ? "caregiver" : "family",
                    text: m.content,
                    createdAt: m.createdAt,
                    time: `${pad(mDate.getHours())}:${pad(mDate.getMinutes())}`,
                    type: m.type === 2 ? "proposal_card" : "text",
                    proposalId: m.proposalId,
                    bookingId: m.bookingId,
                };
            }) : [];

            setDemoState((prev) => {
                const targetConv = convItem || realConversationsRef.current.find((c) => c.id === convId);
                const activeName = targetConv?.name || targetConv?.otherPartyName || prev.activeConvName || "Khách hàng";
                const activeAvatar = targetConv?.avatar || targetConv?.otherPartyAvatar || prev.activeConvAvatar || null;

                const isProposalPending = pendingProposal && (pendingProposal.status === 1 || pendingProposal.status === "Pending");
                const isProposalAccepted = latestProposal && (latestProposal.status === 2 || latestProposal.status === "Accepted" || latestProposal.status === 6 || latestProposal.status === "BookedAndPaid");
                const isProposalRejected = latestProposal && (latestProposal.status === 3 || latestProposal.status === "Rejected");

                const computedStatus = isProposalPending
                    ? "family_confirmed"
                    : isProposalAccepted
                    ? "caregiver_accepted"
                    : isProposalRejected
                    ? "caregiver_rejected"
                    : "idle";

                return {
                    ...prev,
                    activeConversationId: convId,
                    activeConvName: activeName,
                    activeConvAvatar: activeAvatar,
                    messages: realMessages.length > 0 ? realMessages : (prev.activeConversationId === convId ? prev.messages : []),
                    status: computedStatus,
                    activeProposalId: pendingProposal?.id || latestProposal?.id || null,
                    bookingInfo: targetProposal ? {
                        customerName: activeName,
                        serviceName: targetProposal.serviceName || "Chăm sóc sức khỏe",
                        recipientName: targetProposal.recipientName || "Người nhận chăm sóc",
                        recipientAge: "",
                        relation: "",
                        condition: targetProposal.notes || "Chăm sóc theo nhu cầu gia đình",
                        scheduledDate: formattedDate || "Đang thỏa thuận",
                        scheduledTime: formattedTime || "Đang thỏa thuận",
                        address: targetProposal.addressSnapshot || "Địa chỉ gia đình",
                        fee: targetProposal.totalPrice ? Number(targetProposal.totalPrice).toLocaleString("vi-VN") + " VNĐ" : "Thỏa thuận",
                    } : {
                        customerName: activeName,
                        serviceName: "Chưa có đề xuất ca",
                        recipientName: "Người nhận chăm sóc",
                        recipientAge: "",
                        relation: "",
                        condition: "Hai bên đang trao đổi nhu cầu chăm sóc",
                        scheduledDate: "Đang thỏa thuận",
                        scheduledTime: "Đang thỏa thuận",
                        address: "Địa chỉ gia đình",
                        fee: "Thỏa thuận",
                    }
                };
            });
        } catch {
            // ignore loading error
        }
    }, []);

    // Tải danh sách hội thoại từ Backend
    const fetchConversations = useCallback(async (isInitial = false) => {
        try {
            const res = await conversationApi.getConversations({ PageNumber: 1, PageSize: 50 });
            const items = res?.items || (Array.isArray(res) ? res : []);
            if (items.length > 0) {
                const pad = (n) => String(n).padStart(2, "0");
                const mappedList = items.map((c) => {
                    const lastMsg = c.lastMessageContent || "";
                    let cStatus = "idle";
                    let cStatusText = "Đang trao đổi";
                    if (lastMsg.includes("từ chối") || lastMsg.includes("từ chối đề xuất") || lastMsg.includes("từ chối nhận ca")) {
                        cStatus = "caregiver_rejected";
                        cStatusText = "Đã từ chối ca";
                    } else if (lastMsg.includes("chấp thuận") || lastMsg.includes("chấp thuận đề xuất") || lastMsg.includes("đã được tạo ở trạng thái") || lastMsg.includes("xác nhận")) {
                        cStatus = "caregiver_accepted";
                        cStatusText = "Đã nhận ca";
                    } else if (lastMsg.includes("gửi đề xuất") || lastMsg.includes("đề xuất ca chăm sóc")) {
                        cStatus = "family_confirmed";
                        cStatusText = "Chờ bạn duyệt ca";
                    }

                    const mTime = c.lastMessageAt ? new Date(c.lastMessageAt) : null;
                    const timeStr = mTime ? `${pad(mTime.getHours())}:${pad(mTime.getMinutes())}` : "";

                    return {
                        id: c.id,
                        name: c.otherPartyName || c.customerName || "Khách hàng",
                        patient: "Trao đổi kế hoạch chăm sóc",
                        lastMessage: c.lastMessageContent || "Chưa có tin nhắn mới",
                        time: timeStr,
                        status: cStatus,
                        statusText: cStatusText,
                        avatar: c.otherPartyAvatar || c.customerAvatar || null,
                        primary: false,
                        isReal: true,
                    };
                });

                setRealConversations(mappedList);
                realConversationsRef.current = mappedList;
                setIsUsingRealApi(true);

                const currentActive = activeConvIdRef.current;
                const activeExists = currentActive && mappedList.some((item) => item.id === currentActive);

                if (!activeExists && mappedList.length > 0) {
                    const firstItem = mappedList[0];
                    setActiveConvId(firstItem.id);
                    activeConvIdRef.current = firstItem.id;
                    loadConversationDetails(firstItem.id, firstItem);
                }
            } else {
                setIsUsingRealApi(true);
                setRealConversations([]);
                realConversationsRef.current = [];
                if (isInitial) {
                    setActiveConvId(null);
                    activeConvIdRef.current = null;
                }
            }
        } catch {
            setIsUsingRealApi(true);
            setRealConversations([]);
            realConversationsRef.current = [];
        }
    }, [loadConversationDetails]);

    useEffect(() => {
        fetchConversations(true);
        const interval = setInterval(() => {
            fetchConversations(false);
            const currentId = activeConvIdRef.current;
            if (currentId) {
                loadConversationDetails(currentId);
            }
        }, 3500);
        return () => clearInterval(interval);
    }, [fetchConversations, loadConversationDetails]);

    // Tự cuộn xuống tin nhắn mới nhất.
    useEffect(() => {
        const container = messagesContainerRef.current;

        if (!container) return;

        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        });
    }, [demoState.messages]);

    // Lọc các cuộc hội thoại theo tên, bệnh nhân và nội dung.
    const filteredConversations = useMemo(() => {
        const query = searchQuery.trim().toLocaleLowerCase("vi");

        let conversations = realConversations.map((c) => ({
            ...c,
            primary: c.id === activeConvId,
            status: c.id === activeConvId ? demoState.status : c.status,
            statusText: c.id === activeConvId ? statusConfig.shortLabel : c.statusText,
            lastMessage: c.id === activeConvId && demoState.messages.length > 0 ? demoState.messages[demoState.messages.length - 1]?.text : c.lastMessage,
            time: c.id === activeConvId && demoState.messages.length > 0 ? demoState.messages[demoState.messages.length - 1]?.time : c.time,
        }));

        if (!query) return conversations;

        return conversations.filter((conversation) => {
            const searchableText = [
                conversation.name,
                conversation.patient,
                conversation.lastMessage,
                conversation.statusText,
            ]
                .join(" ")
                .toLocaleLowerCase("vi");

            return searchableText.includes(query);
        });
    }, [
        realConversations,
        activeConvId,
        searchQuery,
        demoState.messages,
        demoState.status,
        statusConfig.shortLabel,
    ]);

    // Gửi tin nhắn.
    const handleSendMessage = async (event) => {
        event?.preventDefault();

        const trimmed = inputText.trim();

        if (!trimmed || locked) return;

        const nowTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

        if (isUsingRealApi && demoState.activeConversationId) {
            const newCaregiverMsg = {
                id: Date.now(),
                sender: "caregiver",
                text: trimmed,
                createdAt: new Date().toISOString(),
                time: nowTime,
                type: "text",
            };

            setDemoState((prev) => ({
                ...prev,
                messages: [...prev.messages, newCaregiverMsg],
            }));

            try {
                const res = await conversationApi.sendMessage(demoState.activeConversationId, { content: trimmed });
                if (res?.id) {
                    setDemoState((prev) => ({
                        ...prev,
                        messages: prev.messages.map((m) => m.id === newCaregiverMsg.id ? { ...m, id: res.id, createdAt: res.createdAt || newCaregiverMsg.createdAt } : m),
                    }));
                }
            } catch (err) {
                console.warn("[CareLink] Gửi tin nhắn thực tế thất bại:", err);
            }
        } else {
            // Chế độ demo: addDemoMessage sẽ kích hoạt subscribeDemoChat tự cập nhật demoState một lần duy nhất
            addDemoMessage("caregiver", trimmed);
        }

        setInputText("");
        setQuickRepliesOpen(false);

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    // Chọn câu trả lời nhanh.
    const handleQuickReply = (text) => {
        if (locked) return;

        setInputText(text);
        setQuickRepliesOpen(false);

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // Chấp nhận yêu cầu nhận ca (Tự động sinh Booking status PendingPayment phía Backend)
    const handleAcceptRequest = async () => {
        if (demoState.status !== "family_confirmed") return;

        // Nếu có conversation/proposal từ real API
        if (demoState.activeProposalId && demoState.activeConversationId) {
            try {
                const res = await conversationApi.acceptProposal(
                    demoState.activeConversationId,
                    demoState.activeProposalId,
                    { responseNote: "Điều dưỡng đã xác nhận nhận ca." }
                );
                showToast("Đã đồng ý nhận ca! Ca chăm sóc đã được tạo ở trạng thái Chờ thanh toán.");
                if (res.bookingId) {
                    // Cập nhật bookingId vào state
                    setDemoStatus("caregiver_accepted");
                    return;
                }
            } catch (err) {
                console.error("[CareLink] Lỗi khi chấp thuận đề xuất ca:", err);
                let msg = err.response?.data?.detail || err.response?.data?.message || "Không thể chấp nhận ca lúc này.";
                if (msg.toLowerCase().includes("lịch rảnh")) {
                    msg = "Bạn chưa có lịch rảnh vào khung giờ này. Vui lòng vào tab 'Lịch làm việc' bấm 'Bật rảnh cả tuần' hoặc thêm giờ rảnh rồi nhấn 'Lưu & Đồng bộ lịch tuần' trước khi nhận ca!";
                }
                showToast(msg);
                return;
            }
        }

        setDemoStatus("caregiver_accepted");
    };

    // Mở modal từ chối.
    const handleOpenRejectModal = () => {
        setRejectError("");
        setCustomReason("");
        setRejectReason("Bận lịch đột xuất vào khung giờ này");
        setShowRejectModal(true);
    };

    // Xác nhận từ chối.
    const handleConfirmReject = async () => {
        if (demoState.status !== "family_confirmed") return;

        const finalReason =
            rejectReason === "Lý do khác"
                ? customReason.trim()
                : rejectReason;

        if (!finalReason) {
            setRejectError("Vui lòng nhập lý do từ chối.");
            return;
        }

        if (demoState.activeProposalId && demoState.activeConversationId) {
            try {
                await conversationApi.rejectProposal(
                    demoState.activeConversationId,
                    demoState.activeProposalId,
                    { reason: finalReason }
                );
                showToast("Đã từ chối đề xuất nhận ca.");
                setDemoStatus("caregiver_rejected", finalReason);
                setShowRejectModal(false);
                return;
            } catch (err) {
                console.error("[CareLink] Lỗi khi từ chối đề xuất ca:", err);
                const msg = err.response?.data?.detail || err.response?.data?.message || "Không thể kết nối đến máy chủ hoặc lỗi xử lý khi từ chối ca.";
                showToast(msg);
                return;
            }
        }

        setDemoStatus("caregiver_rejected", finalReason);

        setShowRejectModal(false);
        setRejectError("");
        setCustomReason("");
    };

    // Reset dữ liệu demo sau khi người dùng xác nhận.
    const handleResetDemo = () => {
        resetDemoChat();
        setInputText("");
        setShowResetModal(false);
        setQuickRepliesOpen(false);
    };

    return (
        <div className="w-full bg-[#f8fafc] text-slate-800">
            <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                {/* Header */}
                <header className="mb-4 sm:mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f4f7] text-[#087487]">
                                <MessageSquare className="h-5 w-5" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                                    Tin nhắn
                                </h1>

                                <p className="mt-0.5 text-sm text-slate-500">
                                    Trao đổi và xác nhận lịch chăm sóc cùng gia đình.
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Trao đổi riêng tư
                            </span>

                            {isUsingRealApi ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Máy chủ trực tuyến
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    Bản trình diễn
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {!isUsingRealApi && (
                            <button
                                type="button"
                                onClick={() => setShowResetModal(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Làm mới demo
                            </button>
                        )}

                        <Link
                            to="/caregiver/bookings"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087487] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#066274] active:scale-[0.98]"
                        >
                            <ClipboardList className="h-4 w-4" />
                            Quản lý yêu cầu
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </header>

                {/* Mobile Navigation */}
                <div className="mb-4 grid grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm lg:hidden">
                    {[
                        {
                            id: "list",
                            label: "Hội thoại",
                            icon: MessageSquare,
                        },
                        {
                            id: "chat",
                            label: "Tin nhắn",
                            icon: MessageCircle,
                        },
                        {
                            id: "details",
                            label: "Thông tin ca",
                            icon: ClipboardList,
                        },
                    ].map((item) => {
                        const Icon = item.icon;
                        const active = mobileSection === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setMobileSection(item.id)}
                                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-[11px] font-semibold transition ${
                                    active
                                        ? "bg-[#eaf5f7] text-[#087487]"
                                        : "text-slate-500 hover:bg-slate-50"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main Layout: 3 Cột (Bảo vệ 100% bố cục Laptop/Desktop - Bằng nhau không khoảng trắng) */}
                <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 xl:gap-5 lg:h-[calc(100vh-140px)] lg:min-h-[660px]">
                    {/* CỘT 1: DANH SÁCH HỘI THOẠI */}
                    <aside
                        className={`${
                            mobileSection !== "list" ? "hidden lg:flex" : "flex"
                        } h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-4 xl:col-span-3`}
                    >
                        <div className="border-b border-slate-100 p-4">
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Hộp thư
                                    </h2>

                                    <p className="mt-1 text-[11px] text-slate-500">
                                        Trao đổi với gia đình và bộ phận hỗ trợ
                                    </p>
                                </div>

                                <span className="flex h-8 min-w-8 items-center justify-center rounded-xl bg-[#edf7f9] px-2 text-xs font-bold text-[#087487]">
                                    {filteredConversations.length}
                                </span>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    placeholder="Tìm tên hoặc nội dung..."
                                    aria-label="Tìm kiếm hội thoại"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#78b9c5] focus:bg-white focus:ring-4 focus:ring-[#087487]/5"
                                />

                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        aria-label="Xóa tìm kiếm"
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
                            {filteredConversations.length === 0 ? (
                                <div className="flex flex-col items-center px-5 py-12 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                        <SearchX className="h-5 w-5" />
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-slate-700">
                                        Không tìm thấy hội thoại
                                    </p>

                                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                        Thử tìm bằng tên người liên hệ hoặc nội dung tin nhắn.
                                    </p>
                                </div>
                            ) : (
                                filteredConversations.map((conversation) => {
                                    const isPrimary = conversation.primary;

                                    return (
                                        <button
                                            key={conversation.id}
                                            type="button"
                                            onClick={() => {
                                                setActiveConvId(conversation.id);
                                                activeConvIdRef.current = conversation.id;
                                                loadConversationDetails(conversation.id, conversation);
                                                setMobileSection("chat");
                                            }}
                                            className={`relative w-full p-4 text-left transition cursor-pointer ${
                                                isPrimary
                                                    ? "bg-[#f0f8fa]/80 hover:bg-[#e8f4f7]"
                                                    : "bg-white hover:bg-slate-50"
                                            }`}
                                        >
                                            {isPrimary && (
                                                <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-[#087487]" />
                                            )}

                                            <div className="flex items-start gap-3">
                                                <Avatar
                                                    name={conversation.name}
                                                    image={conversation.avatar}
                                                    online={isPrimary}
                                                    size="md"
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p
                                                            className={`truncate text-[13px] ${
                                                                isPrimary
                                                                    ? "font-bold text-slate-900"
                                                                    : "font-semibold text-slate-700"
                                                            }`}
                                                        >
                                                            {conversation.name}
                                                        </p>

                                                        <span className="shrink-0 pt-0.5 text-[10px] text-slate-400">
                                                            {conversation.time}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 truncate text-[11px] text-slate-500">
                                                        {conversation.patient}
                                                    </p>

                                                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
                                                        {conversation.lastMessage}
                                                    </p>

                                                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                                        <StatusBadge
                                                            status={isPrimary ? demoState.status : conversation.status}
                                                            compact
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
                            <p className="flex items-center gap-2 text-[10px] leading-relaxed text-slate-500">
                                <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                {isUsingRealApi
                                    ? "Đang hiển thị danh sách hội thoại thực từ hệ thống CareLink."
                                    : "Các hội thoại phụ là dữ liệu minh họa cho giao diện demo."}
                            </p>
                        </div>
                    </aside>

                    {isUsingRealApi && realConversations.length === 0 ? (
                        <div
                            className={`${
                                mobileSection === "list" ? "hidden lg:flex" : "flex"
                            } min-h-[500px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm lg:col-span-8 xl:col-span-9`}
                        >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf7f9] text-[#087487]">
                                <MessageSquare className="h-8 w-8" />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">
                                Chưa có cuộc hội thoại nào
                            </h3>
                            <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                                Hộp thư của bạn hiện đang trống. Khi có gia đình hoặc người thân liên hệ đặt lịch chăm sóc, tin nhắn sẽ hiển thị tại đây.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* CỘT 2: KHUNG CHAT CHÍNH (Đã bóc tách thành CaregiverChatThread) */}
                            <CaregiverChatThread
                                demoState={demoState}
                                booking={booking}
                                locked={locked}
                                inputText={inputText}
                                setInputText={setInputText}
                                inputRef={inputRef}
                                messagesContainerRef={messagesContainerRef}
                                quickRepliesOpen={quickRepliesOpen}
                                setQuickRepliesOpen={setQuickRepliesOpen}
                                handleSendMessage={handleSendMessage}
                                handleQuickReply={handleQuickReply}
                                mobileSection={mobileSection}
                                setMobileSection={setMobileSection}
                                quickReplies={quickReplies}
                                Avatar={Avatar}
                                StatusBadge={StatusBadge}
                                SystemMessage={SystemMessage}
                            />

                            {/* CỘT 3: CHI TIẾT CA CHĂM SÓC & MODAL TỪ CHỐI (Đã bóc tách thành CaregiverBookingDetailPanel) */}
                            <CaregiverBookingDetailPanel
                                demoState={demoState}
                                booking={booking}
                                handleAcceptRequest={handleAcceptRequest}
                                handleOpenRejectModal={handleOpenRejectModal}
                                showRejectModal={showRejectModal}
                                setShowRejectModal={setShowRejectModal}
                                rejectReason={rejectReason}
                                setRejectReason={setRejectReason}
                                customReason={customReason}
                                setCustomReason={setCustomReason}
                                rejectError={rejectError}
                                setRejectError={setRejectError}
                                handleConfirmReject={handleConfirmReject}
                                rejectionReasons={rejectionReasons}
                                mobileSection={mobileSection}
                                StatusBadge={StatusBadge}
                                DetailItem={DetailItem}
                            />
                        </>
                    )}
                </div>

                {/* MODAL XÁC NHẬN RESET DEMO */}
                <ConfirmModal
                    open={showResetModal}
                    title="Làm mới cuộc trò chuyện?"
                    description="Toàn bộ tin nhắn và trạng thái demo hiện tại sẽ được đưa về dữ liệu ban đầu. Hành động này có thể ảnh hưởng đến màn hình Family đang sử dụng cùng dữ liệu demo."
                    confirmText="Làm mới demo"
                    cancelText="Giữ nguyên"
                    onConfirm={handleResetDemo}
                    onCancel={() => setShowResetModal(false)}
                    danger={true}
                    icon={RotateCcw}
                />

                {/* Toast feedback */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium border border-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                        <span>{toastMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
}