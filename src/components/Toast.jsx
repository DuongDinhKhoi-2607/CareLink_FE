import { useState, useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

/**
 * Toast Notification Component
 * Displays an animated notification toast in the top-right corner.
 * Default auto-close duration: 4000ms (4 seconds - UX optimal for reading).
 * Includes progress bar, close button, and hover-to-pause.
 */
export default function Toast({ toast, onClose, duration = 4000 }) {
    const [progress, setProgress] = useState(100);
    const isHoveredRef = useRef(false);
    const timerRef = useRef(null);
    const startTimeRef = useRef(0);
    const remainingTimeRef = useRef(duration);

    useEffect(() => {
        if (!toast) return;

        remainingTimeRef.current = duration;
        startTimeRef.current = Date.now();

        const stepInterval = 25;
        timerRef.current = setInterval(() => {
            if (isHoveredRef.current) return;

            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, remainingTimeRef.current - elapsed);
            const percentage = (remaining / duration) * 100;

            setProgress(percentage);

            if (remaining <= 0) {
                clearInterval(timerRef.current);
                if (onClose) onClose();
            }
        }, stepInterval);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [toast, duration, onClose]);

    const handleMouseEnter = () => {
        isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
        isHoveredRef.current = false;
        startTimeRef.current = Date.now();
        remainingTimeRef.current = (progress / 100) * duration;
    };

    if (!toast) return null;

    const { type = "info", title, message } = toast;

    const typeConfig = {
        success: {
            bg: "bg-white",
            border: "border-emerald-200",
            iconBg: "bg-emerald-50 text-emerald-600",
            titleColor: "text-emerald-950",
            messageColor: "text-slate-600",
            barColor: "bg-emerald-500",
            icon: CheckCircle2,
            defaultTitle: "Thành công",
        },
        error: {
            bg: "bg-white",
            border: "border-rose-200",
            iconBg: "bg-rose-50 text-rose-600",
            titleColor: "text-rose-950",
            messageColor: "text-slate-600",
            barColor: "bg-rose-500",
            icon: AlertCircle,
            defaultTitle: "Có lỗi xảy ra",
        },
        warning: {
            bg: "bg-white",
            border: "border-amber-200",
            iconBg: "bg-amber-50 text-amber-600",
            titleColor: "text-amber-950",
            messageColor: "text-slate-600",
            barColor: "bg-amber-500",
            icon: AlertTriangle,
            defaultTitle: "Cần lưu ý",
        },
        info: {
            bg: "bg-white",
            border: "border-teal-200",
            iconBg: "bg-teal-50 text-teal-700",
            titleColor: "text-teal-950",
            messageColor: "text-slate-600",
            barColor: "bg-teal-600",
            icon: Info,
            defaultTitle: "Thông báo",
        },
    };

    const config = typeConfig[type] || typeConfig.info;
    const IconComponent = config.icon;

    return (
        <div
            className="fixed top-5 right-5 z-[9999] pointer-events-auto max-w-[calc(100vw-2.5rem)] sm:w-[380px] animate-in fade-in slide-in-from-top-3 sm:slide-in-from-right-5 duration-300 transition-all select-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="status"
            aria-live="polite"
        >
            <div
                className={`relative overflow-hidden rounded-2xl ${config.bg} border ${config.border} shadow-[0_12px_36px_-6px_rgba(0,32,69,0.18)] backdrop-blur-md p-4 transition-all`}
            >
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                        className={`w-9 h-9 shrink-0 rounded-xl ${config.iconBg} flex items-center justify-center mt-0.5`}
                    >
                        <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-1">
                        <h4 className={`text-sm font-bold ${config.titleColor} leading-snug`}>
                            {title || config.defaultTitle}
                        </h4>
                        <p className={`mt-0.5 text-xs ${config.messageColor} leading-relaxed break-words`}>
                            {message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 shrink-0 -mr-1 -mt-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors flex items-center justify-center cursor-pointer"
                        title="Đóng thông báo"
                        aria-label="Đóng"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Animated countdown progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                    <div
                        className={`h-full ${config.barColor} transition-all duration-75 ease-linear`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
