import React, { useState } from "react";

/**
 * Component Rating (Đánh giá sao) chuẩn hiện đại:
 * - Dùng chung cho toàn hệ thống CareLink (cả Family và Caregiver).
 * - Mặc định chưa chọn: Ngôi sao ruột TRẮNG, viền xám thanh lịch.
 * - Khi chọn / hover: Sáng VÀNG KIM rực rỡ đúng số lượng sao được chọn.
 * - Không bao giờ bị đen hay lỗi hiển thị trên mọi trình duyệt.
 */
export default function Rating({
    value = 0,
    onChange,
    max = 5,
    size = "md",
    readonly = false,
}) {
    // State lưu số sao đang được hover chuột
    const [hoverValue, setHoverValue] = useState(0);

    // Kích thước ngôi sao theo từng mức hiển thị
    const sizeMap = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-11 h-11",
    };

    return (
        <div
            className="inline-flex items-center gap-2"
            role="group"
            aria-label={`Đánh giá ${value}/${max} sao`}
            onMouseLeave={() => !readonly && setHoverValue(0)}
        >
            {Array.from({ length: max }, (_, index) => {
                const starValue = index + 1;
                // Ngôi sao sáng vàng nếu nhỏ hơn hoặc bằng số sao đang hover (nếu có),
                // hoặc nhỏ hơn/bằng giá trị đã click chọn
                const isFilled = starValue <= (hoverValue || value);

                return (
                    <button
                        key={starValue}
                        type="button"
                        disabled={readonly}
                        onClick={() => onChange && onChange(starValue)}
                        onMouseEnter={() => !readonly && setHoverValue(starValue)}
                        className={`transition-transform duration-150 p-0.5 focus:outline-hidden ${
                            readonly
                                ? "cursor-default"
                                : "hover:scale-120 active:scale-95 cursor-pointer"
                        }`}
                        aria-label={`${starValue} trên ${max} sao`}
                    >
                        <svg
                            className={`${sizeMap[size] || sizeMap.md} transition-colors duration-200 drop-shadow-xs`}
                            viewBox="0 0 24 24"
                            fill={isFilled ? "#f59e0b" : "#ffffff"} // Ruột vàng khi chọn, ruột trắng khi chưa chọn
                            stroke={isFilled ? "#f59e0b" : "#cbd5e1"} // Viền vàng khi chọn, viền xám khi chưa chọn
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {/* Đường dẫn ngôi sao 5 cánh chuẩn tỉ lệ vàng */}
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </button>
                );
            })}
        </div>
    );
}
