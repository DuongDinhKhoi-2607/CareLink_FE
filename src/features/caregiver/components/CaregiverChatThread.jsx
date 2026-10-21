import React from "react";
import {
    MessageSquare,
    MessageCircle,
    Send,
    Sparkles,
    ShieldCheck,
    ChevronRight,
    ChevronDown,
    HeartPulse,
    Info,
} from "lucide-react";

/**
 * CaregiverChatThread
 * Khung chat chính giữa Điều dưỡng và Gia đình.
 * Quản lý header hội thoại, context banner, danh sách tin nhắn,
 * gợi ý trả lời nhanh (quick replies) và ô nhập tin nhắn (composer).
 */
export default function CaregiverChatThread({
    demoState,
    booking,
    locked,
    inputText,
    setInputText,
    inputRef,
    messagesContainerRef,
    quickRepliesOpen,
    setQuickRepliesOpen,
    handleSendMessage,
    handleQuickReply,
    mobileSection,
    setMobileSection,
    quickReplies = [],
    Avatar,
    StatusBadge,
    SystemMessage,
}) {
    const currentUser = React.useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("carelink_user") || "{}");
        } catch {
            return {};
        }
    }, []);

    return (
        <main
            className={`${
                mobileSection !== "chat" ? "hidden lg:flex" : "flex"
            } min-h-[620px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-8 xl:col-span-6`}
        >
            {/* Chat header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                    <Avatar
                        name={demoState.activeConvName || booking.customerName || "Khách hàng"}
                        image={demoState.activeConvAvatar}
                        size="lg"
                        online={true}
                    />

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                                {demoState.activeConvName || booking.customerName || "Khách hàng"}
                            </h2>

                            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 sm:inline-flex">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Người nhà bệnh nhân
                            </span>
                        </div>

                        <p className="mt-1 truncate text-[11px] text-slate-500">
                            Người bệnh: {booking.recipientName || "Người nhận chăm sóc"}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <div className="hidden flex-col items-end gap-1 sm:flex">
                        <StatusBadge status={demoState.status} compact />

                        <span className="text-[10px] text-slate-400">
                            <ShieldCheck className="mr-1 inline h-3 w-3" />
                            Trao đổi riêng tư
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileSection("details")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-[#a8d5dd] hover:bg-[#f0f8fa] hover:text-[#087487] lg:hidden"
                    >
                        Thông tin ca
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Context banner */}
            <div className="flex items-start gap-2.5 border-b border-[#e3eef1] bg-[#f3f9fa] px-4 py-3 sm:px-5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#087487] shadow-sm">
                    <HeartPulse className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">
                        Trao đổi về lịch chăm sóc
                    </p>

                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                        {booking.serviceName} · {booking.duration}
                    </p>
                </div>
            </div>

            {/* Message list */}
            <div
                ref={messagesContainerRef}
                className="flex-1 space-y-4 overflow-y-auto bg-[#f7f9fb] px-4 py-5 sm:px-5"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#cbd5e1 transparent",
                }}
            >
                {demoState.messages.length === 0 ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#087487] shadow-sm">
                            <MessageSquare className="h-6 w-6" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-800">
                            Bắt đầu cuộc trao đổi
                        </p>

                        <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                            Gửi tin nhắn để trao đổi nhu cầu chăm sóc với gia đình.
                        </p>
                    </div>
                ) : (
                    demoState.messages.map((message, index) => {
                        if (message.sender === "system") {
                            return (
                                <SystemMessage
                                    key={message.id ?? index}
                                    message={message}
                                />
                            );
                        }

                        const isCaregiver = message.sender === "caregiver";

                        return (
                            <div
                                key={message.id ?? index}
                                className={`flex w-full ${
                                    isCaregiver
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`flex max-w-[90%] items-end gap-2 sm:max-w-[82%] ${
                                        isCaregiver
                                            ? "flex-row-reverse"
                                            : "flex-row"
                                    }`}
                                >
                                    {!isCaregiver && (
                                        <Avatar
                                            name={demoState.activeConvName || booking.customerName || "Khách hàng"}
                                            image={demoState.activeConvAvatar}
                                            size="sm"
                                        />
                                    )}

                                    <div
                                        className={`flex min-w-0 flex-col ${
                                            isCaregiver
                                                ? "items-end"
                                                : "items-start"
                                        }`}
                                    >
                                        <div
                                            className={`mb-1.5 px-1 text-[10px] font-medium text-slate-400 ${
                                                isCaregiver
                                                    ? "text-right"
                                                    : "text-left"
                                            }`}
                                        >
                                            {isCaregiver
                                                ? (currentUser?.name || currentUser?.fullName ? `Bạn · ${currentUser.name || currentUser.fullName}` : "Bạn")
                                                : (demoState.activeConvName || booking.customerName || "Khách hàng")}
                                        </div>

                                        <div
                                            className={`rounded-2xl px-4 py-3 text-[13px] leading-[1.75] shadow-sm ${
                                                isCaregiver
                                                    ? "rounded-br-md bg-[#087487] text-white"
                                                    : "rounded-bl-md border border-slate-200/80 bg-white text-slate-700"
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap break-words">
                                                {message.text}
                                            </p>
                                        </div>

                                        <span className="mt-1.5 px-1 text-[10px] text-slate-400">
                                            {message.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Quick reply accordion */}
            <div className="border-t border-slate-100 bg-white">
                <button
                    type="button"
                    onClick={() =>
                        setQuickRepliesOpen((previous) => !previous)
                    }
                    disabled={locked}
                    aria-expanded={quickRepliesOpen}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
                >
                    <span className="flex min-w-0 items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <Sparkles className="h-3.5 w-3.5" />
                        </span>

                        <span>
                            <span className="block text-xs font-semibold text-slate-700">
                                Gợi ý trả lời
                            </span>

                            <span className="mt-0.5 block text-[10px] text-slate-400">
                                Chọn mẫu để điền nhanh vào tin nhắn
                            </span>
                        </span>
                    </span>

                    <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                            quickRepliesOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {quickRepliesOpen && !locked && (
                    <div className="grid gap-2 border-t border-slate-100 bg-slate-50/70 p-3 sm:grid-cols-2 sm:p-4">
                        {quickReplies.map((reply) => (
                            <button
                                key={reply.label}
                                type="button"
                                onClick={() =>
                                    handleQuickReply(reply.text)
                                }
                                className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-[#9dcbd4] hover:bg-[#f1f9fa]"
                            >
                                <span className="block text-xs font-bold text-slate-700">
                                    {reply.label}
                                </span>

                                <span className="mt-1.5 line-clamp-2 block text-[11px] leading-relaxed text-slate-500">
                                    {reply.text}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Composer */}
            <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-100 bg-white p-3 sm:p-4"
            >
                {locked ? (
                    <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                        <p className="text-xs leading-relaxed text-slate-500">
                            {demoState.status === "closed"
                                ? "Cuộc trao đổi đã kết thúc. Bạn không thể gửi thêm tin nhắn."
                                : "Bạn đã từ chối yêu cầu nhận ca này nên không thể tiếp tục gửi tin nhắn."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-end gap-2">
                            <div className="min-w-0 flex-1">
                                <label
                                    htmlFor="caregiver-chat-input"
                                    className="sr-only"
                                >
                                    Nhập tin nhắn
                                </label>

                                <textarea
                                    id="caregiver-chat-input"
                                    ref={inputRef}
                                    rows={1}
                                    value={inputText}
                                    onChange={(event) =>
                                        setInputText(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" &&
                                            !event.shiftKey
                                        ) {
                                            event.preventDefault();
                                            handleSendMessage(event);
                                        }
                                    }}
                                    placeholder="Nhập tin nhắn..."
                                    className="max-h-28 min-h-[44px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-relaxed text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#82bdc8] focus:bg-white focus:ring-4 focus:ring-[#087487]/5"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                aria-label="Gửi tin nhắn"
                                title="Gửi tin nhắn"
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#087487] text-white shadow-sm transition hover:bg-[#066274] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2 px-1">
                            <p className="text-[10px] text-slate-400">
                                Enter để gửi · Shift + Enter xuống dòng
                            </p>

                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                                <ShieldCheck className="h-3 w-3" />
                                CareLink
                            </span>
                        </div>
                    </>
                )}
            </form>
        </main>
    );
}
