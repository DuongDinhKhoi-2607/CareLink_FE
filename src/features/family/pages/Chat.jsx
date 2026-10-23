import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import BookingSummary from "../components/BookingSummary";
import CreateProposalModal from "../components/CreateProposalModal";
import conversationApi from "../../../api/conversationApi";
import familyApi from "../../../api/familyApi";

// Cam kết an toàn CareLink
const safetyCommitments = [
    {
        text: "Điều dưỡng đã xác thực CCCD & Bằng cấp chuyên môn",
        icon: (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
    },
    {
        text: "Chỉ thanh toán khi 2 bên đã cùng bấm đồng thuận",
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

// Icons hỗ trợ
const defaultIcons = {
    user: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    ),
    service: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    ),
    date: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
    ),
    time: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    address: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
    ),
};

export default function Chat() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Dữ liệu điều dưỡng được truyền qua state hoặc query param
    const passedCaregiver = location?.state?.caregiver;
    const queryNurseId = searchParams.get("nurseId");
    const queryConvId = searchParams.get("conversationId");

    const targetNurseId = passedCaregiver?.nurseId || passedCaregiver?.id || queryNurseId;

    // State hội thoại thật từ Backend API
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [nurseRating, setNurseRating] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoadingConv, setIsLoadingConv] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [convError, setConvError] = useState("");
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    // Tải điểm đánh giá thật của điều dưỡng
    const currentNurseId = conversation?.nurseId || targetNurseId;
    useEffect(() => {
        if (!currentNurseId) return;
        familyApi.getNurseRatingSummary(currentNurseId)
            .then((res) => setNurseRating(res))
            .catch(() => setNurseRating(null));
    }, [currentNurseId]);

    // Refs
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // Kiểm tra đăng nhập
    const token = localStorage.getItem("carelink_token");

    // Thông tin hiển thị điều dưỡng
    const displayName =
        conversation?.nurseName ||
        passedCaregiver?.fullName ||
        passedCaregiver?.name ||
        "Điều dưỡng CareLink";

    const avatarUrl =
        conversation?.nurseAvatar ||
        passedCaregiver?.avatarUrl ||
        passedCaregiver?.image ||
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300";

    const displayRole =
        passedCaregiver?.educationLevel ||
        passedCaregiver?.role ||
        "Điều dưỡng chuyên nghiệp CareLink";

    // 1. Tải hoặc Khởi tạo Hội thoại thật với Điều dưỡng (POST /api/v1/conversations hoặc GET /api/v1/conversations/{id})
    useEffect(() => {
        let isMounted = true;
        setIsLoadingConv(true);
        setConvError("");

        if (!token) {
            setIsLoadingConv(false);
            setConvError("auth_required");
            return;
        }

        const initConversation = async () => {
            try {
                // Trường hợp 1: Có sẵn conversationId trên URL
                if (queryConvId) {
                    const convDetail = await conversationApi.getConversationDetail(queryConvId);
                    if (isMounted) {
                        setConversation(convDetail);
                        setIsLoadingConv(false);
                    }
                    return;
                }

                // Trường hợp 2: Có nurseId -> Mở hoặc tạo hội thoại lâu dài giữa Customer và Nurse
                if (targetNurseId) {
                    const res = await conversationApi.getOrCreateConversation({ nurseId: targetNurseId });
                    if (isMounted) {
                        setConversation(res);
                        setIsLoadingConv(false);
                    }
                    return;
                }

                // Trường hợp 3: Không có id nào truyền vào -> Tải danh sách hội thoại của user, lấy hội thoại gần nhất
                const listRes = await conversationApi.getConversations({ PageNumber: 1, PageSize: 10 });
                const items = listRes?.items || (Array.isArray(listRes) ? listRes : []);
                if (items.length > 0) {
                    if (isMounted) {
                        setConversation(items[0]);
                        setIsLoadingConv(false);
                    }
                } else {
                    if (isMounted) {
                        setConversation(null);
                        setIsLoadingConv(false);
                        setConvError("no_active_chat");
                    }
                }
            } catch (err) {
                console.error("[CareLink] Lỗi khởi tạo hội thoại chat:", err);
                if (isMounted) {
                    setIsLoadingConv(false);
                    const msg = err.response?.data?.detail || err.response?.data?.message || "Không thể kết nối hội thoại với điều dưỡng.";
                    setConvError(msg);
                }
            }
        };

        initConversation();

        return () => {
            isMounted = false;
        };
    }, [queryConvId, targetNurseId, token]);

    // 2. Tải tin nhắn & đề xuất ca (Proposals) kèm Polling 3.5s
    const fetchMessagesAndProposals = useCallback(async (convId, isInitial = false) => {
        if (!convId) return;
        if (isInitial) setIsLoadingMessages(true);
        try {
            const [msgRes, propRes] = await Promise.all([
                conversationApi.getMessages(convId, { PageNumber: 1, PageSize: 50 }).catch(() => ({ items: [] })),
                conversationApi.getProposals(convId).catch(() => []),
            ]);

            const msgItems = msgRes?.items || (Array.isArray(msgRes) ? msgRes : []);
            const propList = Array.isArray(propRes) ? propRes : (propRes?.data || []);

            const formattedMsgs = msgItems.map((m) => ({
                id: m.id,
                sender: m.isMine ? "family" : "caregiver",
                text: m.content,
                time: m.createdAt
                    ? new Date(m.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                    : "",
                type: m.type,
                proposalId: m.proposalId,
                bookingId: m.bookingId,
            }));

            setMessages(formattedMsgs);
            setProposals(propList);
        } catch (err) {
            console.warn("[CareLink] Polling tin nhắn/đề xuất ca thất bại:", err);
        } finally {
            if (isInitial) setIsLoadingMessages(false);
        }
    }, []);

    useEffect(() => {
        if (!conversation?.id) return;
        fetchMessagesAndProposals(conversation.id, true);

        const pollTimer = setInterval(() => {
            fetchMessagesAndProposals(conversation.id, false);
        }, 3500);

        return () => clearInterval(pollTimer);
    }, [conversation?.id, fetchMessagesAndProposals]);

    // 3. Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    // 4. Phân tích đề xuất ca gần nhất để hiển thị trạng thái và nút thanh toán
    const pendingProposal = proposals.find((p) => p.status === 1 || p.status === "Pending");
    const acceptedProposal = [...proposals].reverse().find((p) => p.status === 2 || p.status === "Accepted");
    const rejectedProposal = [...proposals].reverse().find((p) => p.status === 3 || p.status === "Rejected");
    const activeProposal = pendingProposal || acceptedProposal || rejectedProposal || proposals[proposals.length - 1];

    let currentStatus = "idle";
    let rejectReason = "";

    if (pendingProposal) {
        currentStatus = "family_confirmed";
    } else if (acceptedProposal && (!activeProposal || activeProposal.id === acceptedProposal.id)) {
        currentStatus = "caregiver_accepted";
    } else if (activeProposal?.status === 3 || activeProposal?.status === "Rejected") {
        currentStatus = "caregiver_rejected";
        rejectReason = activeProposal.responseNote || "Bận lịch đột xuất vào khung giờ này";
    }

    // 5. Gửi tin nhắn thực tế (POST /api/v1/conversations/{id}/messages)
    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        const trimmed = messageInput.trim();
        if (!trimmed || isSending || !conversation?.id) return;

        const optimisticId = `temp-${Date.now()}`;
        const nowTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

        const optimisticMsg = {
            id: optimisticId,
            sender: "family",
            text: trimmed,
            time: nowTime,
            type: 1,
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setMessageInput("");
        setIsSending(true);

        try {
            const res = await conversationApi.sendMessage(conversation.id, { content: trimmed });
            if (res?.id) {
                setMessages((prev) =>
                    prev.map((m) => (m.id === optimisticId ? { ...m, id: res.id, time: res.createdAt ? new Date(res.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : nowTime } : m))
                );
            }
        } catch (err) {
            console.error("[CareLink] Lỗi gửi tin nhắn:", err);
            showToast("Chưa gửi được tin nhắn. Vui lòng kiểm tra lại kết nối mạng.");
        } finally {
            setIsSending(false);
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    };

    // 6. Xử lý sau khi tạo đề xuất ca thành công
    const handleProposalCreated = (newProposal) => {
        showToast("Đã gửi đề xuất đặt lịch chăm sóc tới điều dưỡng thành công!");
        setShowProposalModal(false);
        if (conversation?.id) {
            fetchMessagesAndProposals(conversation.id, false);
        }
    };

    // 7. Định dạng chi tiết đặt lịch hiển thị ở cột tóm tắt bên phải
    const bookingDetails = activeProposal
        ? [
              {
                  label: "NGƯỜI CẦN CHĂM SÓC",
                  value: activeProposal.recipientName || "Người thân",
                  icon: defaultIcons.user,
              },
              {
                  label: "DỊCH VỤ",
                  value:
                      activeProposal.services && activeProposal.services.length > 1
                          ? `${activeProposal.services.map((s) => s.serviceName).join(" + ")} (${activeProposal.services.length} dịch vụ)`
                          : activeProposal.serviceName || "Chăm sóc phục hồi sức khỏe",
                  icon: defaultIcons.service,
              },
              {
                  label: "NGÀY DỰ KIẾN",
                  value: activeProposal.scheduledStart
                      ? new Date(activeProposal.scheduledStart).toLocaleDateString("vi-VN", {
                            weekday: "short",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                      : "Theo thỏa thuận",
                  icon: defaultIcons.date,
              },
              {
                  label: "THỜI GIAN",
                  value:
                      activeProposal.scheduledStart && activeProposal.scheduledEnd
                          ? `${new Date(activeProposal.scheduledStart).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })} – ${new Date(activeProposal.scheduledEnd).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })} (${activeProposal.serviceDurationMinutes || 120} phút)`
                          : "Theo thỏa thuận",
                  icon: defaultIcons.time,
              },
              {
                  label: "ĐỊA ĐIỂM",
                  value: activeProposal.addressSnapshot || "Địa chỉ gia đình",
                  icon: defaultIcons.address,
              },
              {
                  label: "CHI PHÍ CA",
                  value: activeProposal.totalPrice
                      ? `${Number(activeProposal.totalPrice).toLocaleString("vi-VN")} đ + 60.000 đ phí sàn = ${Number(activeProposal.totalPaymentAmount || (Number(activeProposal.totalPrice) + 60000)).toLocaleString("vi-VN")} đ`
                      : "Theo thỏa thuận",
                  icon: defaultIcons.service,
              },
          ]
        : [
              {
                  label: "NGƯỜI CẦN CHĂM SÓC",
                  value: "Chưa chọn người nhận chăm sóc",
                  icon: defaultIcons.user,
              },
              {
                  label: "DỊCH VỤ",
                  value: "Chưa chọn gói dịch vụ",
                  icon: defaultIcons.service,
              },
              {
                  label: "NGÀY DỰ KIẾN",
                  value: "Chưa xác định ngày",
                  icon: defaultIcons.date,
              },
              {
                  label: "THỜI GIAN",
                  value: "Chưa xác định khung giờ",
                  icon: defaultIcons.time,
              },
              {
                  label: "ĐỊA ĐIỂM",
                  value: "Chưa chọn địa chỉ chăm sóc",
                  icon: defaultIcons.address,
              },
          ];

    const bookingInfoForSummary = {
        bookingId: activeProposal?.bookingId || null,
        id: activeProposal?.bookingId || null,
        proposalId: activeProposal?.id || null,
        recipientName: activeProposal?.recipientName || "Người thân",
        serviceName:
            activeProposal?.services && activeProposal.services.length > 1
                ? activeProposal.services.map((s) => s.serviceName).join(" + ")
                : (activeProposal?.serviceName || "Chăm sóc chuyên môn"),
        services: activeProposal?.services || [],
        scheduledDate: activeProposal?.scheduledStart
            ? new Date(activeProposal.scheduledStart).toLocaleDateString("vi-VN")
            : "",
        scheduledTime: activeProposal?.scheduledStart
            ? new Date(activeProposal.scheduledStart).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
            : "",
        address: activeProposal?.addressSnapshot || "",
        totalPrice: activeProposal?.totalPrice || 0,
        platformFee: activeProposal?.platformFee || 60000,
        totalPaymentAmount: activeProposal?.totalPaymentAmount || ((activeProposal?.totalPrice || 0) + 60000),
    };

    // Khi người dùng bấm "Xác nhận muốn đặt lịch" ở cột phải
    const handleOpenProposalModal = () => {
        setShowProposalModal(true);
    };

    return (
        <div className="bg-[#f8fafc] py-6 lg:py-8 font-sans antialiased text-[#102030] min-h-[calc(100vh-140px)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5 lg:gap-6">
                {/* Toast phản hồi nhanh */}
                {toastMessage && (
                    <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl flex items-center gap-2.5 animate-[fadeIn_200ms_ease-out]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
                    </div>
                )}

                {/* Thanh điều hướng nhanh phía trên */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/caregivers"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00677c] transition-colors group"
                    >
                        <svg
                            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Quay lại danh sách điều dưỡng
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
                        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#102030]">
                            Trao đổi trước khi đặt lịch
                        </h1>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Phía Gia Đình
                        </span>
                    </div>

                    <p className="text-[14px] sm:text-[15px] text-slate-600 leading-relaxed max-w-3xl mt-0.5">
                        Trao đổi tình trạng sức khỏe và khung giờ chăm sóc với điều dưỡng. Khi hai bên thống nhất, điều dưỡng bấm xác nhận nhận ca thì mới tiến hành thanh toán.
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
                                            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300";
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

                                <p className="text-sm text-slate-600 line-clamp-1">{displayRole}</p>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500 pt-1">
                                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                                        ★ {nurseRating?.averageRating ? Number(nurseRating.averageRating).toFixed(1) : (passedCaregiver?.rating || "5.0")}{" "}
                                        <span className="text-slate-500 font-normal">
                                            ({nurseRating?.totalReviews ?? (passedCaregiver?.reviewsCount || passedCaregiver?.reviewCount || 0)} đánh giá)
                                        </span>
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Tỷ lệ nhận ca: 98%</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="text-emerald-700 font-semibold">Phản hồi: ~5 phút</span>
                                </div>
                            </div>
                        </article>

                        {/* BANNER TRẠNG THÁI THỎA THUẬN TRỰC QUAN */}
                        {currentStatus === "family_confirmed" && (
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
                                        Đang chờ {displayName} xem xét và bấm "Đồng ý nhận ca" bên ứng dụng Điều dưỡng.
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStatus === "caregiver_accepted" && (
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
                                        Hai bên đã đạt thỏa thuận thành công. Bạn có thể bấm{" "}
                                        <strong className="underline">Tiến hành thanh toán</strong> ở khung bên phải để hoàn tất đặt ca và giữ lịch trong 30 phút.
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStatus === "caregiver_rejected" && (
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
                                        Lý do: "{rejectReason}". Bạn có thể bấm "Tạo đề xuất mới" để đổi giờ hoặc quay lại tìm điều dưỡng khác.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* KHUNG CHAT CHÍNH */}
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
                                        <p className="text-sm font-bold text-[#102030]">Trao đổi trực tiếp</p>
                                        <p className="text-xs text-slate-500">với điều dưỡng {displayName}</p>
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
                                {/* Thẻ giới thiệu trang nhã đầu cuộc trao đổi */}
                                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs text-center mb-4 mx-auto max-w-md w-full shrink-0">
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
                                        {displayRole} • Đã xác thực năng lực chuyên môn
                                    </p>
                                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f0f9fa] border border-[#d0eef3] text-[10px] font-semibold text-[#00677c]">
                                        <svg className="w-3 h-3 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.732a9 9 0 014.28 0m-8.56 0a9 9 0 014.28 0M12 3v1.5m0 15v1.5m-7.5-9h1.5m12 0h1.5" />
                                        </svg>
                                        Kênh trò chuyện bảo mật 2 chiều • Thỏa thuận có cấu trúc
                                    </div>
                                </div>

                                {/* LOADING STATE KHI ĐANG TẢI TIN NHẮN */}
                                {isLoadingMessages && messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center my-auto py-12 gap-3 text-slate-400">
                                        <div className="w-7 h-7 border-2 border-[#00677c] border-t-transparent rounded-full animate-spin" />
                                        <p className="text-xs font-medium">Đang tải lịch sử trao đổi...</p>
                                    </div>
                                )}

                                {/* EMPTY STATE TRANG NHÃ KHI KHUNG CHAT TRỐNG */}
                                {!isLoadingMessages && messages.length === 0 && (
                                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto">
                                        <div className="w-16 h-16 rounded-2xl bg-[#e7f7fc] border border-[#c2eaf4] flex items-center justify-center text-[#00677c] mb-3 shadow-2xs">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.817-.168.75.75 0 01-.168-.817c.214-.64.38-1.32.493-2.02A7.868 7.868 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                            </svg>
                                        </div>

                                        <h3 className="text-base font-bold text-[#102030]">
                                            Chưa có tin nhắn trong cuộc trò chuyện
                                        </h3>

                                        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                                            Hãy gửi tin nhắn đầu tiên để chào hỏi và trao đổi trực tiếp với điều dưỡng <strong>{displayName}</strong> về tình trạng sức khỏe của người thân, thời gian và địa điểm chăm sóc mong muốn.
                                        </p>

                                        {/* Gợi ý mở lời nhanh 1 chạm */}
                                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-md">
                                            <button
                                                type="button"
                                                onClick={() => setMessageInput("Dạ em chào điều dưỡng, gia đình em muốn trao đổi về ca chăm sóc người thân sắp tới ạ.")}
                                                className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-teal-50 hover:text-[#00677c] text-slate-600 transition-colors border border-slate-200 shadow-2xs cursor-pointer"
                                            >
                                                👋 Chào điều dưỡng
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMessageInput("Chào bạn, bạn có thể tư vấn giúp gia đình khung giờ chăm sóc phù hợp trong tuần này không ạ?")}
                                                className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-teal-50 hover:text-[#00677c] text-slate-600 transition-colors border border-slate-200 shadow-2xs cursor-pointer"
                                            >
                                                🩺 Tư vấn khung giờ
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMessageInput("Dạ sáng mai khung giờ 08:00 – 10:00 bạn có trống lịch nhận ca không ạ?")}
                                                className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-teal-50 hover:text-[#00677c] text-slate-600 transition-colors border border-slate-200 shadow-2xs cursor-pointer"
                                            >
                                                ⏰ Hỏi lịch sáng mai
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* DANH SÁCH TIN NHẮN THỰC TẾ */}
                                {messages.length > 0 && (
                                    <div className="flex flex-col gap-3.5 mt-auto">
                                        {messages.map((chatMessage, index) => {
                                            // Tin nhắn sự kiện/hệ thống hoặc Proposal card
                                            if (chatMessage.type === 2 || chatMessage.type === 3 || chatMessage.type === 4) {
                                                const isAccept = chatMessage.text.includes("chấp thuận") || chatMessage.text.includes("đồng ý");
                                                const isReject = chatMessage.text.includes("từ chối");

                                                return (
                                                    <div key={chatMessage.id ?? index} className="flex flex-col items-center my-1.5 animate-[fadeIn_250ms_ease-out]">
                                                        <div
                                                            className={`max-w-[92%] sm:max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] shadow-2xs font-medium leading-relaxed border flex items-center gap-2.5 ${
                                                                isAccept
                                                                    ? "bg-emerald-50/95 border-emerald-200 text-emerald-900"
                                                                    : isReject
                                                                    ? "bg-rose-50/95 border-rose-200 text-rose-900"
                                                                    : "bg-amber-50/95 border-amber-200 text-amber-900"
                                                            }`}
                                                        >
                                                            <span
                                                                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                                                    isAccept
                                                                        ? "bg-emerald-100 text-emerald-600"
                                                                        : isReject
                                                                        ? "bg-rose-100 text-rose-600"
                                                                        : "bg-amber-100 text-amber-700"
                                                                }`}
                                                            >
                                                                {isAccept ? (
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                    </svg>
                                                                ) : isReject ? (
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            <span className="flex-1 text-left">{chatMessage.text}</span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 mt-1">{chatMessage.time}</span>
                                                    </div>
                                                );
                                            }

                                            const isOutgoing = chatMessage.sender === "family";

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
                                    </div>
                                )}

                                <div ref={messagesEndRef} className="h-px shrink-0" />
                            </div>

                            {/* Khung nhập tin nhắn */}
                            <form onSubmit={handleSendMessage} className="shrink-0 p-3 sm:p-4 bg-white border-t border-slate-200">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex-1 min-w-0 flex items-center relative rounded-full bg-[#f4f6f8] border border-slate-200 px-3 sm:px-4 py-1.5 transition-colors focus-within:border-[#00677c] focus-within:ring-2 focus-within:ring-[#00677c]/10">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="Nhập tin nhắn trao đổi với điều dưỡng..."
                                            autoComplete="off"
                                            disabled={isSending || isLoadingConv || !conversation?.id}
                                            className="flex-1 min-w-0 bg-transparent border-0 outline-none px-2 py-2 text-sm sm:text-base text-[#102030] placeholder:text-slate-400 disabled:opacity-60"
                                        />
                                    </div>

                                    {/* Nút gửi */}
                                    <button
                                        type="submit"
                                        aria-label="Gửi tin nhắn"
                                        disabled={!messageInput.trim() || isSending || !conversation?.id}
                                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#00677c] text-white flex items-center justify-center hover:bg-[#005566] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs hover:shadow-sm active:scale-95 shrink-0 cursor-pointer"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
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
                            status={currentStatus}
                            rejectReason={rejectReason}
                            bookingInfo={bookingInfoForSummary}
                            onConfirmBooking={handleOpenProposalModal}
                            onRevokeBooking={handleOpenProposalModal}
                            onCloseChat={() => navigate("/caregivers")}
                        />
                    </div>
                </div>
            </div>

            {/* MODAL TẠO ĐỀ XUẤT CA CHĂM SÓC MỚI (POST /api/v1/conversations/{id}/proposals) */}
            {conversation?.id && (
                <CreateProposalModal
                    isOpen={showProposalModal}
                    onClose={() => setShowProposalModal(false)}
                    conversationId={conversation.id}
                    caregiverName={displayName}
                    caregiverId={currentNurseId}
                    onProposalCreated={handleProposalCreated}
                />
            )}

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
            `}</style>
        </div>
    );
}