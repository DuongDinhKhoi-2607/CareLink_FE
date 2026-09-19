import React, { useState } from "react";

/**
 * Rating — Shared star-rating component
 * Dùng chung cho toàn hệ thống CareLink (cả Family và Caregiver)
 *
 * Props:
 *   value      {number}   Current rating (1–5), or 0 for none
 *   onChange   {function} Called with the new rating number (undefined when readonly)
 *   label      {string}   Optional label above the stars
 *   max        {number}   Number of stars (default 5)
 *   readonly   {boolean}  If true, stars are display-only
 *   size       {string}   "sm" | "md" | "lg"  (default "md")
 *   showValue  {boolean}  Show numeric value next to stars (default false)
 */
export default function Rating({
    value = 0,
    onChange,
    label,
    max = 5,
    readonly = false,
    size = "md",
    showValue = false,
}) {
    const [hovered, setHovered] = useState(0);

    const sizeMap = {
        sm: "w-5 h-5",
        md: "w-7 h-7",
        lg: "w-9 h-9",
    };

    const starSize = sizeMap[size] ?? sizeMap.md;
    const active = readonly ? value : hovered || value;
    const labels = ["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"];

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <span className="text-sm font-semibold text-[#102030]">{label}</span>
            )}

            <div className="flex items-center gap-2">
                {/* Stars */}
                <div
                    className="flex items-center gap-1"
                    onMouseLeave={() => !readonly && setHovered(0)}
                >
                    {Array.from({ length: max }, (_, i) => {
                        const star = i + 1;
                        const filled = star <= active;
                        return (
                            <button
                                key={star}
                                type="button"
                                disabled={readonly}
                                onClick={() => !readonly && onChange?.(star)}
                                onMouseEnter={() => !readonly && setHovered(star)}
                                className={`transition-all duration-150 focus:outline-none ${
                                    readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
                                }`}
                                aria-label={`${star} sao`}
                            >
                                <svg
                                    className={`${starSize} transition-colors duration-150 ${
                                        filled
                                            ? "text-amber-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.5)]"
                                            : "text-slate-200"
                                    }`}
                                    viewBox="0 0 24 24"
                                    fill={filled ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    strokeWidth={filled ? "0" : "1.5"}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                </svg>
                            </button>
                        );
                    })}
                </div>

                {/* Value label */}
                {!readonly && active > 0 && (
                    <span className="text-xs font-semibold text-amber-500 animate-fade-in">
                        {labels[active]}
                    </span>
                )}

                {showValue && value > 0 && (
                    <span className="text-sm font-bold text-[#102030]">
                        {value.toFixed(1)}
                    </span>
                )}
            </div>
        </div>
    );
}
