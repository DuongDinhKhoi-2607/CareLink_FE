import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
    const location = useLocation();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayLocation, setDisplayLocation] = useState(location);

    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            // Bắt đầu hiệu ứng chuyển trang
            setIsTransitioning(true);
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });

            // Đợi loader chạy xong rồi mới đổi nội dung trang
            const timer = setTimeout(() => {
                setDisplayLocation(location);
                setIsTransitioning(false);
            }, 600); // Tăng thời gian nhẹ để user kịp nhìn thấy loader xịn

            return () => clearTimeout(timer);
        }
    }, [location, displayLocation]);

    return (
        <>
            {/* ======================================================== */}
            {/* LỚP PHỦ LOADING (Hiệu ứng xoay tròn Sang xịn)              */}
            {/* ======================================================== */}
            <div
                className={`fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${isTransitioning ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                aria-live="polite"
                aria-label="Đang chuyển trang..."
            >
                <div className="relative flex items-center justify-center">
                    {/* Vòng hào quang tỏa sáng (pulse nhẹ nhàng) */}
                    <div className="absolute w-24 h-24 rounded-full bg-[#00677c]/20 animate-pulse" />

                    {/* Vòng quay kép (Double Spinner) */}
                    <div className="absolute w-16 h-16 rounded-full border-[3px] border-slate-200 border-t-[#00677c] border-r-[#00677c] animate-spin" />
                    <div className="absolute w-12 h-12 rounded-full border-[3px] border-slate-100 border-b-[#102030] border-l-[#102030] animate-[spin_1.5s_reverse_infinite]" />

                    {/* Biểu tượng CareLink ở trung tâm */}
                    <div className="absolute w-8 h-8 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-1.5">
                    <span className="text-sm font-extrabold tracking-[0.2em] text-[#00677c] uppercase">
                        CareLink
                    </span>
                    <span className="text-xs font-medium text-slate-500 tracking-wide animate-pulse">
                        Đang kết nối dữ liệu...
                    </span>
                </div>
            </div>

            {/* ======================================================== */}
            {/* NỘI DUNG TRANG CHÍNH CÓ HIỆU ỨNG FADE-IN                   */}
            {/* ======================================================== */}
            <div
                key={displayLocation.pathname}
                className={`w-full transition-opacity duration-300 ease-out ${isTransitioning ? "opacity-0" : "opacity-100"
                    }`}
            >
                {React.cloneElement(children, { location: displayLocation })}
            </div>
        </>
    );
}