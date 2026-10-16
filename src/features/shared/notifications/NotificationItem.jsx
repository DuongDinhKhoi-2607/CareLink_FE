import React from "react";
import { formatNotificationTime, getNotificationConfig } from "./notificationUtils";

export default function NotificationItem({ notification, onItemClick }) {
    if (!notification) return null;

    const { title, message, type, isRead, createdAt } = notification;
    const config = getNotificationConfig(type);
    const IconComponent = config.Icon;
    const timeDisplay = formatNotificationTime(createdAt);

    const handleClick = () => {
        if (onItemClick) {
            onItemClick(notification);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`w-full text-left p-3.5 transition-all duration-200 border-b border-slate-100 flex items-start gap-3 relative group cursor-pointer ${
                isRead
                    ? "bg-white hover:bg-slate-50/80 text-slate-700"
                    : "bg-teal-50/35 hover:bg-teal-50/65 text-slate-900 font-medium"
            }`}
        >
            {/* Semantic SVG Icon badge */}
            <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform ${config.badgeBg}`}
            >
                <IconComponent className={`w-4.5 h-4.5 ${config.iconColor}`} strokeWidth={2} />
            </div>

            {/* Notification Text content */}
            <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span
                        className={`text-xs truncate ${
                            isRead ? "text-slate-800 font-semibold" : "text-[#002045] font-bold"
                        }`}
                    >
                        {title}
                    </span>

                    {/* Chấm tròn ngọc bích phát sáng tinh tế báo chưa đọc (thay thế hoàn toàn thanh dọc cũ) */}
                    {!isRead && (
                        <span
                            className="w-2 h-2 rounded-full bg-teal-500 ring-3 ring-teal-100 shrink-0 animate-pulse"
                            title="Thông báo mới chưa đọc"
                        />
                    )}
                </div>

                <p
                    className={`text-[12px] leading-relaxed line-clamp-2 ${
                        isRead ? "text-slate-500 font-normal" : "text-slate-700 font-medium"
                    }`}
                >
                    {message}
                </p>

                {/* Footer metadata: Category + Relative Time */}
                <div className="flex items-center gap-2 mt-1.5 text-[10.5px] text-slate-400">
                    <span className="inline-block px-1.5 py-0.5 rounded-md bg-slate-100/90 text-slate-600 font-medium tracking-tight">
                        {config.categoryLabel}
                    </span>
                    {timeDisplay && (
                        <>
                            <span>•</span>
                            <time dateTime={createdAt}>{timeDisplay}</time>
                        </>
                    )}
                </div>
            </div>
        </button>
    );
}
