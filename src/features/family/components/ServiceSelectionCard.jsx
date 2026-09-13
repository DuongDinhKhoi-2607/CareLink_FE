import React from "react";

export default function ServiceSelectionCard({
    title,
    description,
    icon,
    badgeText,
    badgeType = "normal", // 'normal' | 'special'
    isSelected,
    onClick,
}) {
    return (
        <article
            onClick={onClick}
            className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                    ? "border-[#00677c] bg-[#f0f9fa] shadow-[0_12px_30px_-8px_rgba(0,103,124,0.18)] ring-1 ring-[#00677c]/20 scale-[1.02]"
                    : "border-slate-200/80 bg-white hover:border-[#00677c]/40 hover:shadow-md hover:-translate-y-0.5"
            }`}
        >
            {/* Nếu đang được chọn, hiển thị icon checkmark góc phải */}
            {isSelected && (
                <div className="absolute top-4 right-4 text-[#00677c]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                </div>
            )}

            <div className="flex items-start justify-between mb-4 pr-7">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? "bg-[#00677c] text-white shadow-sm" : "bg-slate-50 text-[#00677c] border border-slate-100"}`}>
                    {icon}
                </div>

                {/* Badge phân loại chuyên môn được tối ưu màu sắc sang xịn theo Phương án 1 */}
                <div className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    badgeType === "special"
                        ? isSelected
                            ? "bg-white text-blue-700 border border-blue-300 shadow-xs"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        : isSelected
                            ? "bg-white text-[#00677c] border border-[#00677c]/30 shadow-xs"
                            : "bg-teal-50/80 text-[#00677c] border border-teal-200/70"
                }`}>
                    {badgeText}
                </div>
            </div>

            <h3 className={`text-lg font-bold mb-2 transition-colors ${isSelected ? "text-[#00677c]" : "text-[#102030]"}`}>
                {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
                {description}
            </p>
        </article>
    );
}