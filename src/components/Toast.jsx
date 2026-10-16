import { useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

/**
 * Modern Full-Colored Toast Notification Component
 * Features vibrant gradient backgrounds, glassmorphism shadows, and clean auto-dismiss.
 * Default auto-close duration: 3500ms.
 */
export default function Toast({ toast, onClose, duration = 3500 }) {
    const timerRef = useRef(null);

    useEffect(() => {
        if (!toast) return;

        // Tự động đóng toast sau khoảng thời gian duration
        timerRef.current = setTimeout(() => {
            if (onClose) onClose();
        }, duration);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [toast, duration, onClose]);

    if (!toast) return null;

    const { type = "info", title, message } = toast;

    const typeConfig = {
        success: {
            gradient: "from-[#107569] to-[#0A4D45]",
            border: "border-teal-400/30",
            shadow: "shadow-[0_14px_35px_-8px_rgba(16,117,105,0.45)]",
            icon: CheckCircle2,
            defaultTitle: "Thành công",
        },
        error: {
            gradient: "from-[#DC2626] to-[#991B1B]",
            border: "border-rose-400/30",
            shadow: "shadow-[0_14px_35px_-8px_rgba(220,38,38,0.4)]",
            icon: AlertCircle,
            defaultTitle: "Có lỗi xảy ra",
        },
        warning: {
            gradient: "from-[#D97706] to-[#B45309]",
            border: "border-amber-400/30",
            shadow: "shadow-[0_14px_35px_-8px_rgba(217,119,6,0.4)]",
            icon: AlertTriangle,
            defaultTitle: "Cần lưu ý",
        },
        info: {
            gradient: "from-[#0F766E] to-[#1E3A5F]",
            border: "border-teal-400/30",
            shadow: "shadow-[0_14px_35px_-8px_rgba(15,118,110,0.35)]",
            icon: Info,
            defaultTitle: "Thông báo",
        },
    };

    const config = typeConfig[type] || typeConfig.info;
    const IconComponent = config.icon;

    return (
        <div
            className="fixed top-5 right-5 z-[9999] pointer-events-auto max-w-[calc(100vw-2.5rem)] sm:w-[380px] animate-in fade-in slide-in-from-top-3 sm:slide-in-from-right-5 duration-300 transition-all select-none"
            role="status"
            aria-live="polite"
        >
            <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${config.gradient} border ${config.border} ${config.shadow} text-white p-4 backdrop-blur-md`}
            >
                <div className="flex items-start gap-3">
                    {/* Icon container */}
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mt-0.5 shadow-inner">
                        <IconComponent className="w-5 h-5 text-white" strokeWidth={2.3} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-1">
                        <h4 className="text-sm font-bold text-white leading-snug tracking-tight">
                            {title || config.defaultTitle}
                        </h4>
                        <p className="mt-1 text-xs text-white/90 leading-relaxed break-words font-medium">
                            {message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 shrink-0 -mr-1 -mt-1 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
                        title="Đóng thông báo"
                        aria-label="Đóng"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
