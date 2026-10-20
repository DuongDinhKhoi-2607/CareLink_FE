import React, { useEffect, useMemo, useRef, useState } from "react";
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

const mockOtherConversations = [
    {
        id: "conv-2",
        name: "Chị Lê Thảo Quyên",
        patient: "Bé Bo · 8 tháng",
        lastMessage:
            "Dạ em cảm ơn chị, lịch sáng thứ Năm tuần tới em sẽ đến đúng 8h30 ạ.",
        time: "Hôm qua",
        status: "accepted",
        statusText: "Đã xác nhận ca",
        avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    },
    {
        id: "conv-3",
        name: "Bác Trần Minh Tuấn",
        patient: "Bác Tuấn · 68 tuổi",
        lastMessage:
            "Bác ơi, kết quả đo đường huyết chiều nay của bác ổn định rồi nhé ạ.",
        time: "3 ngày trước",
        status: "idle",
        statusText: "Đang trao đổi",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    {
        id: "conv-4",
        name: "Bộ phận CSKH CareLink",
        patient: "Hỗ trợ chuyên môn",
        lastMessage:
            "Hồ sơ xác thực chứng chỉ hành nghề của bạn đã được phê duyệt.",
        time: "5 ngày trước",
        status: "system",
        statusText: "Thông báo hệ thống",
        avatar: null,
    },
];

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

const isChatLocked = (status) =>
    status === "closed" || status === "caregiver_rejected";

const getStatusConfig = (status) => {
    switch (status) {
        case "family_confirmed":
            return {
                label: "Chờ xác nhận",
                shortLabel: "Chờ bạn duyệt",
                icon: AlertCircle,
                className:
                    "bg-amber-50 text-amber-700 border-amber-200",
                dotClassName: "bg-amber-500",
            };

        case "caregiver_accepted":
            return {
                label: "Đã nhận ca",
                shortLabel: "Đã đồng ý nhận ca",
                icon: CheckCircle2,
                className:
                    "bg-emerald-50 text-emerald-700 border-emerald-200",
                dotClassName: "bg-emerald-500",
            };

        case "caregiver_rejected":
            return {
                label: "Đã từ chối",
                shortLabel: "Đã từ chối nhận ca",
                icon: XCircle,
                className: "bg-rose-50 text-rose-700 border-rose-200",
                dotClassName: "bg-rose-500",
            };

        case "closed":
            return {
                label: "Đã kết thúc",
                shortLabel: "Cuộc trao đổi đã dừng",
                icon: CircleX,
                className: "bg-slate-100 text-slate-600 border-slate-200",
                dotClassName: "bg-slate-400",
            };

        default:
            return {
                label: "Đang trao đổi",
                shortLabel: "Đang trao đổi nhu cầu",
                icon: MessageCircle,
                className: "bg-sky-50 text-sky-700 border-sky-200",
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

    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    const booking = demoState.bookingInfo;
    const locked = isChatLocked(demoState.status);

    const statusConfig = getStatusConfig(demoState.status);

    // Lắng nghe cập nhật từ trang Family và các tab cùng nguồn.
    useEffect(() => {
        const unsubscribe = subscribeDemoChat((updated) => {
            setDemoState(updated);
        });

        return unsubscribe;
    }, []);

    // Tải danh sách hội thoại từ Backend nếu người dùng đã đăng nhập tài khoản Điều dưỡng
    useEffect(() => {
        let isMounted = true;
        conversationApi
            .getConversations({ PageNumber: 1, PageSize: 50 })
            .then(async (res) => {
                if (!isMounted) return;
                const items = res?.items || (Array.isArray(res) ? res : []);
                if (items.length > 0) {
                    const firstConv = items[0];
                    try {
                        const [proposals, messagesRes] = await Promise.all([
                            conversationApi.getProposals(firstConv.id).catch(() => []),
                            conversationApi.getMessages(firstConv.id, { PageNumber: 1, PageSize: 50 }).catch(() => [])
                        ]);

                        const proposalList = Array.isArray(proposals) ? proposals : (proposals?.data || []);
                        const pendingProposal = proposalList.find((p) => p.status === 1 || p.status === "Pending");

                        const msgItems = messagesRes?.items || (Array.isArray(messagesRes) ? messagesRes : []);
                        const realMessages = msgItems.length > 0 ? msgItems.map((m) => ({
                            id: m.id,
                            sender: m.isMine ? "caregiver" : "family",
                            text: m.content,
                            time: new Date(m.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                            type: m.type === 2 ? "proposal_card" : "text",
                            proposalId: m.proposalId,
                            bookingId: m.bookingId,
                        })) : null;

                        if (isMounted) {
                            setDemoState((prev) => ({
                                ...prev,
                                activeConversationId: firstConv.id,
                                ...(realMessages ? { messages: realMessages } : {}),
                                ...(pendingProposal ? {
                                    status: "family_confirmed",
                                    activeProposalId: pendingProposal.id,
                                    bookingInfo: {
                                        ...prev.bookingInfo,
                                        serviceName: pendingProposal.serviceName || prev.bookingInfo.serviceName,
                                        recipientName: pendingProposal.recipientName || prev.bookingInfo.recipientName,
                                        address: pendingProposal.addressSnapshot || prev.bookingInfo.address,
                                        fee: pendingProposal.totalPrice ? Number(pendingProposal.totalPrice).toLocaleString("vi-VN") + " VNĐ" : prev.bookingInfo.fee,
                                    }
                                } : {})
                            }));
                        }
                    } catch {
                        // ignore loading errors silently
                    }
                }
            })
            .catch(() => {
                // Fallback gracefully to demo chat store
            });
        return () => {
            isMounted = false;
        };
    }, []);

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

        const primaryConversation = {
            id: "primary",
            name: "Anh Nguyễn Văn An",
            patient: `${booking.recipientName} · ${booking.recipientAge}`,
            lastMessage:
                demoState.messages[demoState.messages.length - 1]?.text ||
                "Chưa có tin nhắn",
            time:
                demoState.messages[demoState.messages.length - 1]?.time ||
                "",
            status: demoState.status,
            statusText: statusConfig.shortLabel,
            primary: true,
        };

        const conversations = [
            primaryConversation,
            ...mockOtherConversations,
        ];

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
        searchQuery,
        booking.recipientName,
        booking.recipientAge,
        demoState.messages,
        demoState.status,
        statusConfig.shortLabel,
    ]);

    // Gửi tin nhắn.
    const handleSendMessage = async (event) => {
        event?.preventDefault();

        const trimmed = inputText.trim();

        if (!trimmed || locked) return;

        addDemoMessage("caregiver", trimmed);

        const newCaregiverMsg = {
            id: Date.now(),
            sender: "caregiver",
            text: trimmed,
            time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            type: "text",
        };

        setDemoState((prev) => ({
            ...prev,
            messages: [...prev.messages, newCaregiverMsg],
        }));

        if (demoState.activeConversationId) {
            try {
                await conversationApi.sendMessage(demoState.activeConversationId, { content: trimmed });
            } catch (err) {
                console.warn("[CareLink] Gửi tin nhắn thực tế thất bại:", err);
            }
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
                const msg = err.response?.data?.detail || err.response?.data?.message || "Không thể kết nối đến máy chủ hoặc lỗi xử lý khi nhận ca.";
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

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                <MessageCircle className="h-3.5 w-3.5" />
                                Bản trình diễn
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowResetModal(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Làm mới demo
                        </button>

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

                {/* Main Layout: 3 Cột (Bảo vệ 100% bố cục Laptop/Desktop) */}
                <div className="grid min-h-[680px] grid-cols-1 items-stretch gap-4 lg:grid-cols-12 xl:gap-5">
                    {/* CỘT 1: DANH SÁCH HỘI THOẠI */}
                    <aside
                        className={`${
                            mobileSection !== "list" ? "hidden lg:flex" : "flex"
                        } min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-4 xl:col-span-3`}
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
                                                if (isPrimary) {
                                                    setMobileSection("chat");
                                                }
                                            }}
                                            disabled={!isPrimary}
                                            className={`relative w-full p-4 text-left transition ${
                                                isPrimary
                                                    ? "bg-[#f0f8fa]/80 hover:bg-[#e8f4f7]"
                                                    : "cursor-default bg-white hover:bg-slate-50/70"
                                            }`}
                                        >
                                            {isPrimary && (
                                                <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-[#087487]" />
                                            )}

                                            <div className="flex items-start gap-3">
                                                <Avatar
                                                    name={
                                                        isPrimary
                                                            ? "Nguyễn Văn An"
                                                            : conversation.name
                                                    }
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
                                                            {isPrimary
                                                                ? "Anh Nguyễn Văn An"
                                                                : conversation.name}
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
                                                        {isPrimary ? (
                                                            <StatusBadge
                                                                status={demoState.status}
                                                                compact
                                                            />
                                                        ) : (
                                                            <>
                                                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500">
                                                                    {conversation.statusText}
                                                                </span>

                                                                <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-400">
                                                                    Mẫu
                                                                </span>
                                                            </>
                                                        )}
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
                                Các hội thoại phụ là dữ liệu minh họa cho giao diện demo.
                            </p>
                        </div>
                    </aside>

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