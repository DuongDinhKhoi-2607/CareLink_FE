
import { useEffect, useRef, useState } from "react";
import {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
    X,
} from "lucide-react";

const TOAST_CONFIG = {
    success: {
        background: "bg-[#15803D]",
        icon: CheckCircle2,
        title: "Thành công",
    },
    error: {
        background: "bg-[#B91C1C]",
        icon: AlertCircle,
        title: "Có lỗi xảy ra",
    },
    warning: {
        background: "bg-[#B45309]",
        icon: AlertTriangle,
        title: "Cần lưu ý",
    },
    info: {
        background: "bg-[#334155]",
        icon: Info,
        title: "Thông báo",
    },
};

export default function Toast({
    toast,
    onClose,
    duration = 3500,
}) {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);
    const exitTimerRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!toast) {
            setVisible(false);
            return;
        }

        clearTimeout(timerRef.current);
        clearTimeout(exitTimerRef.current);

        setVisible(false);

        const frame = requestAnimationFrame(() => {
            setVisible(true);
        });

        timerRef.current = setTimeout(() => {
            setVisible(false);

            exitTimerRef.current = setTimeout(() => {
                onCloseRef.current?.();
            }, 220);
        }, duration);

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timerRef.current);
            clearTimeout(exitTimerRef.current);
        };
    }, [toast, duration]);

    const closeToast = () => {
        clearTimeout(timerRef.current);
        clearTimeout(exitTimerRef.current);

        setVisible(false);

        exitTimerRef.current = setTimeout(() => {
            onCloseRef.current?.();
        }, 220);
    };

    if (!toast) return null;

    const { type = "info", title, message } = toast;
    const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;
    const Icon = config.icon;

    return (
        <div
            className={`
                fixed top-5 right-5 z-[9999]
                w-[calc(100vw-2.5rem)] sm:w-[380px]
                pointer-events-none
                transition-all duration-300 ease-out
                ${visible
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-3 opacity-0"
                }
            `}
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
        >
            <div
                className={`
                    ${config.background}
                    pointer-events-auto
                    overflow-hidden
                    rounded-xl
                    border border-white/10
                    text-white
                    shadow-[0_10px_30px_rgba(15,23,42,0.16)]
                `}
            >
                <div className="flex items-start gap-3.5 p-4">
                    {/* Status icon */}
                    <div className="
                        mt-0.5 flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-lg bg-white/10
                    ">
                        <Icon
                            className="h-[19px] w-[19px] text-white"
                            strokeWidth={1.9}
                        />
                    </div>

                    {/* Notification content */}
                    <div className="min-w-0 flex-1 pt-0.5">
                        <h4 className="
                            text-[13px] font-semibold
                            leading-5 tracking-[-0.01em]
                            text-white
                        ">
                            {title || config.title}
                        </h4>

                        {message && (
                            <p className="
                                mt-1 break-words
                                text-[13px] font-normal
                                leading-[1.65] text-white/85
                            ">
                                {message}
                            </p>
                        )}
                    </div>

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={closeToast}
                        className="
                            -mr-1 -mt-1
                            flex h-7 w-7 shrink-0
                            items-center justify-center
                            rounded-lg
                            text-white/65
                            transition-colors duration-200
                            hover:bg-white/10 hover:text-white
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-white/60
                        "
                        title="Đóng thông báo"
                        aria-label="Đóng"
                    >
                        <X
                            className="h-4 w-4"
                            strokeWidth={1.8}
                        />
                    </button>
                </div>
            </div>

            <style>{`
                @media (prefers-reduced-motion: reduce) {
                    .transition-all,
                    .transition-colors {
                        transition-duration: 0ms !important;
                    }
                }
            `}</style>
        </div>
    );
}
