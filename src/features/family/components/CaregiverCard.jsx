import React from "react";

function StarIcon() {
    return (
        <svg
            className="w-3.5 h-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

function CheckIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 12.5 4 4L19 7"
            />
        </svg>
    );
}

function MapPinIcon() {
    return (
        <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.14-7.5 11.25-7.5 11.25S4.5 17.64 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="12" r="9" />

            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7v5l3 2"
            />
        </svg>
    );
}

export default function CaregiverCard({
    caregiver,
    onProfile,
    onBook,
}) {
    return (
        <article
            className="
                group
                relative
                flex
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-[#dfe8e5]
                bg-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#b7d8d0]
                hover:shadow-[0_18px_45px_-25px_rgba(16,32,48,0.28)]
            "
        >

            {/* ========================================================
                MAIN CARD
            ======================================================== */}

            <div className="p-5">

                <div className="flex gap-4">

                    {/* ==================================================
                        AVATAR
                    ================================================== */}

                    <div className="relative w-[96px] h-[112px] sm:w-[108px] sm:h-[124px] shrink-0 rounded-xl overflow-hidden bg-[#edf3f1]">

                        <img
                            src={caregiver.image}
                            alt={`Chân dung ${caregiver.name}`}
                            className="
                                w-full
                                h-full
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-[1.035]
                            "
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400";
                            }}
                        />

                        {/* Rating */}

                        <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/95 backdrop-blur-sm shadow-sm">

                            <StarIcon />

                            <span className="text-[10px] font-extrabold text-[#102030]">
                                {caregiver.rating}
                            </span>

                        </div>

                    </div>

                    {/* ==================================================
                        INFORMATION
                    ================================================== */}

                    <div className="flex-1 min-w-0 flex flex-col">

                        {/* Name + price */}

                        <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                                <h3
                                    className="
                                        text-[17px]
                                        leading-tight
                                        font-bold
                                        tracking-tight
                                        text-[#102030]
                                        truncate
                                        group-hover:text-[#00677c]
                                        transition-colors
                                    "
                                >
                                    {caregiver.name}
                                </h3>

                                <p className="text-[11px] font-semibold text-[#00677c] mt-1 leading-relaxed">
                                    {caregiver.role}
                                </p>

                            </div>

                            <div className="text-right shrink-0">

                                <p className="text-[10px] text-slate-400 font-medium">
                                    Từ
                                </p>

                                <p className="text-sm font-extrabold text-[#102030] whitespace-nowrap">
                                    {caregiver.rate}
                                </p>

                            </div>

                        </div>

                        {/* Location + experience */}

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3">

                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                                <MapPinIcon />
                                {caregiver.location}
                            </span>

                            <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />

                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                                <ClockIcon />
                                {caregiver.experience}
                            </span>

                        </div>

                        {/* Specialty */}

                        <div className="mt-3">

                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#eef7f4] text-[#126a63] text-[10px] font-bold">

                                <CheckIcon className="w-3 h-3" />

                                {caregiver.specialty}

                            </span>

                        </div>

                    </div>

                </div>

                {/* ========================================================
                    DESCRIPTION
                ======================================================== */}

                <div className="mt-4 pt-4 border-t border-[#edf1ef]">

                    <p className="text-[11px] leading-[1.65] text-slate-500 line-clamp-2">
                        “{caregiver.quote}”
                    </p>

                </div>

                {/* ========================================================
                    CREDENTIALS / AVAILABILITY
                ======================================================== */}

                <div className="flex flex-wrap items-center gap-2 mt-3">

                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

                        <span className="w-1 h-1 rounded-full bg-[#00677c]" />

                        {caregiver.qualifications}

                    </span>

                    {caregiver.availability?.slice(0, 2).map((item) => (
                        <span
                            key={item}
                            className="px-2 py-1 rounded-md bg-[#f6f8f7] text-[9px] font-medium text-slate-500"
                        >
                            {item}
                        </span>
                    ))}

                </div>

            </div>

            {/* ========================================================
                ACTION AREA
            ======================================================== */}

            <div className="mt-auto border-t border-[#edf1ef] bg-[#fbfcfc] px-5 py-3.5">

                <div className="flex items-center gap-3 w-full">

                    {/* XEM HỒ SƠ */}

                    <button
                        type="button"
                        onClick={() => onProfile(caregiver)}
                        className="
                            flex-1
                            h-10
                            px-4
                            rounded-xl
                            border
                            border-[#d7e1de]
                            bg-[#f1f4f3]
                            text-[#26383d]
                            text-[11px]
                            font-bold
                            hover:bg-[#e8eeec]
                            hover:border-[#a9c9c1]
                            hover:text-[#00677c]
                            transition-all
                            cursor-pointer
                        "
                    >
                        Xem hồ sơ
                    </button>

                    {/* CHỌN ĐIỀU DƯỠNG */}

                    <button
                        type="button"
                        onClick={() => onBook(caregiver)}
                        className="
                            flex-1
                            h-10
                            px-4
                            rounded-xl
                            bg-[#00677c]
                            text-white
                            text-[11px]
                            font-bold
                            hover:bg-[#00596b]
                            hover:-translate-y-0.5
                            shadow-[0_7px_16px_-9px_rgba(0,103,124,0.8)]
                            transition-all
                            cursor-pointer
                        "
                    >
                        Chọn điều dưỡng
                    </button>

                </div>

            </div>

        </article>
    );
}