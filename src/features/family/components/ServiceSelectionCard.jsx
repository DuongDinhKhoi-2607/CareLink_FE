import React from "react";

export default function ServiceSelectionCard({
    title,
    description,
    icon,
    badgeText,
    badgeType = "normal", // 'normal' | 'special'
    priceRange,
    recommendedDuration,
    features = [],
    isSelected,
    onClick,
}) {
    const isSpecial = badgeType === "special";

    return (
        <article
            onClick={onClick}
            tabIndex={0}
            role="radio"
            aria-checked={isSelected}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl transition-all duration-200 cursor-pointer select-none outline-none ${
                isSelected
                    ? "bg-[#f4f9f8] border-2 border-[#00677c] shadow-[0_12px_32px_-8px_rgba(0,103,124,0.18)] ring-2 ring-[#00677c]/10 -translate-y-0.5"
                    : "bg-white border border-[#dde4e1] hover:border-[#00677c]/50 hover:shadow-[0_10px_28px_-6px_rgba(16,32,48,0.06)] hover:-translate-y-0.5"
            }`}
        >
            {/* Vùng thông tin chính */}
            <div>
                {/* Hàng 1: Icon đại diện + Badge chuyên môn + Checkmark trạng thái */}
                <div className="flex items-center justify-between gap-3 mb-5">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                            isSelected
                                ? "bg-[#00677c] text-white shadow-sm"
                                : "bg-[#f0f6f4] text-[#00677c] border border-[#dce8e4] group-hover:bg-[#00677c] group-hover:text-white"
                        }`}
                    >
                        {icon}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Badge tiêu chuẩn nhân sự */}
                        <span
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-all ${
                                isSpecial
                                    ? isSelected
                                        ? "bg-sky-100 text-sky-900 border border-sky-300"
                                        : "bg-[#edf4fa] text-[#0f4b7a] border border-[#cbe0f1]"
                                    : isSelected
                                        ? "bg-teal-100 text-teal-900 border border-teal-300"
                                        : "bg-[#eaf5f2] text-[#11685e] border border-[#c4e6dc]"
                            }`}
                        >
                            {badgeText}
                        </span>

                        {/* Icon Checkmark xác nhận đã chọn */}
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                isSelected
                                    ? "bg-[#00677c] text-white scale-100"
                                    : "border-2 border-slate-300 text-transparent group-hover:border-slate-400 scale-95"
                            }`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Tiêu đề dịch vụ */}
                <h3
                    className={`text-lg sm:text-xl font-bold tracking-tight mb-2.5 transition-colors ${
                        isSelected ? "text-[#00677c]" : "text-[#102030] group-hover:text-[#00677c]"
                    }`}
                >
                    {title}
                </h3>

                {/* Mô tả giải pháp */}
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {description}
                </p>

                {/* Danh mục công việc chính (Checklist cụ thể) */}
                {features.length > 0 && (
                    <ul className="flex flex-col gap-2 mb-6 pt-1">
                        {features.map((feat, index) => (
                            <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 leading-normal">
                                <svg
                                    className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                                        isSelected ? "text-[#00677c]" : "text-[#187d74]/80"
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                <span>{feat}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Vùng chân thẻ: Mức phí tham khảo minh bạch + Thời lượng khuyến nghị */}
            <div className="pt-4 border-t border-slate-200/80 flex items-end justify-between gap-3 mt-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                        Chi phí tham khảo
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#102030]">
                        {priceRange}
                    </span>
                    {recommendedDuration && (
                        <span className="text-[11px] text-slate-600 mt-0.5">
                            {recommendedDuration}
                        </span>
                    )}
                </div>

                <div className="shrink-0">
                    <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                            isSelected
                                ? "bg-[#00677c] text-white shadow-xs"
                                : "text-[#00677c] bg-[#eef6f4] group-hover:bg-[#00677c] group-hover:text-white"
                        }`}
                    >
                        {isSelected ? "Đã chọn" : "Chọn dịch vụ"}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </article>
    );
}