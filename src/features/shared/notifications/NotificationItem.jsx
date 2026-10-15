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
            className={`w-full text-left p-3.5 transition-all duration-200 border-b border-slate-100 flex items-start gap-3 relative group cursor-pointer ${isRead
                    ? "bg-white hover:bg-slate-50/80 opacity-90"
                    : "bg-teal-50/30 hover:bg-teal-50/60"
                }`}
        >
            {/* Unread Accent Bar on Left edge */}
            {!isRead && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#00677c] rounded-r-full" />
            )}

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
                        className={`text-xs font-semibold truncate ${isRead ? "text-slate-700" : "text-slate-900 font-bold"
                            }`}
                    >
                        {title}
                    </span>
                    {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#00677c] shrink-0" title="Chưa đọc" />
                    )}
                </div>

                <p
                    className={`text-[12px] leading-relaxed line-clamp-2 ${isRead ? "text-slate-500" : "text-slate-700"
                        }`}
                >
                    {message}
                </p>

                {/* Footer metadata: Category + Relative Time */}
                <div className="flex items-center gap-2 mt-1.5 text-[10.5px] text-slate-400">
                    <span className="inline-block px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium tracking-tight">
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
