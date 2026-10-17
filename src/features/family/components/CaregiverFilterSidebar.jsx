import React from "react";

function CheckIcon({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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

export default function CaregiverFilterSidebar({
    qualifications,
    specialties,
    availabilityOptions,
    selectedQualifications,
    setSelectedQualifications,
    selectedSpecialties,
    setSelectedSpecialties,
    priceRange,
    setPriceRange,
    selectedAvailability,
    setSelectedAvailability,
    minRating = null,
    setMinRating,
    servicesList = [],
    activeService = null,
    setActiveService,
    resetFilters,
    toggleItem,
}) {
    return (
        <aside className="lg:sticky lg:top-5">
            <div className="bg-white border border-[#dfe8e5] rounded-2xl overflow-hidden shadow-[0_10px_35px_-28px_rgba(16,32,48,0.3)]">
                <div className="px-5 py-4 border-b border-[#edf1ef] flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-[#102030]">
                            Bộ lọc
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Tùy chỉnh kết quả
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={resetFilters}
                        className="text-[11px] font-bold text-[#00677c] hover:text-[#005566] cursor-pointer"
                    >
                        Đặt lại
                    </button>
                </div>

                <div className="p-5 space-y-6">
                    {/* QUALIFICATION */}
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-3">
                            Trình độ
                        </h3>

                        <div className="space-y-2.5">
                            {qualifications.map((q) => (
                                <label
                                    key={q}
                                    className="flex items-start gap-2.5 cursor-pointer group"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedQualifications.includes(q)}
                                        onChange={() =>
                                            toggleItem(
                                                q,
                                                selectedQualifications,
                                                setSelectedQualifications
                                            )
                                        }
                                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#00677c] focus:ring-[#00677c]/20"
                                    />
                                    <span className="text-xs leading-5 text-slate-600 group-hover:text-[#102030] transition-colors">
                                        {q}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* SPECIALTY */}
                    <div className="pt-5 border-t border-[#edf1ef]">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-3">
                            Chuyên môn
                        </h3>

                        <div className="space-y-2.5">
                            {specialties.map((specialty) => (
                                <label
                                    key={specialty}
                                    className="flex items-start gap-2.5 cursor-pointer group"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedSpecialties.includes(specialty)}
                                        onChange={() =>
                                            toggleItem(
                                                specialty,
                                                selectedSpecialties,
                                                setSelectedSpecialties
                                            )
                                        }
                                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#00677c] focus:ring-[#00677c]/20"
                                    />
                                    <span className="text-xs leading-5 text-slate-600 group-hover:text-[#102030] transition-colors">
                                        {specialty}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* PRICE */}
                    <div className="pt-5 border-t border-[#edf1ef]">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                                Ngân sách / giờ
                            </h3>
                            <span className="text-xs font-bold text-[#00677c]">
                                {priceRange.toLocaleString("vi-VN")}đ
                            </span>
                        </div>

                        <input
                            type="range"
                            min="50000"
                            max="500000"
                            step="25000"
                            value={priceRange}
                            onChange={(e) =>
                                setPriceRange(
                                    Number(e.target.value)
                                )
                            }
                            className="w-full accent-[#00677c] cursor-pointer"
                        />

                        <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                            <span>50.000đ</span>
                            <span>500.000đ</span>
                        </div>
                    </div>

                    {/* RATING (MinRating parameter in Backend) */}
                    {setMinRating && (
                        <div className="pt-5 border-t border-[#edf1ef]">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-3">
                                Đánh giá tối thiểu
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    { label: "Tất cả", value: null },
                                    { label: "4.5★ trở lên", value: 4.5 },
                                    { label: "4.0★ trở lên", value: 4.0 },
                                    { label: "3.5★ trở lên", value: 3.5 },
                                ].map((r) => {
                                    const isSelected = minRating === r.value;
                                    return (
                                        <button
                                            key={r.label}
                                            type="button"
                                            onClick={() => setMinRating(r.value)}
                                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                                                isSelected
                                                    ? "bg-[#00677c] border-[#00677c] text-white shadow-2xs"
                                                    : "bg-[#f8faf9] border-[#e1e9e6] text-slate-600 hover:border-[#a8d4ca] hover:text-[#00677c]"
                                            }`}
                                        >
                                            {r.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* SERVICES (ServiceId parameter in Backend) */}
                    {servicesList && servicesList.length > 0 && setActiveService && (
                        <div className="pt-5 border-t border-[#edf1ef]">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                                    Gói dịch vụ
                                </h3>
                                {activeService && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveService(null)}
                                        className="text-[10px] font-semibold text-[#00677c] hover:underline cursor-pointer"
                                    >
                                        Bỏ chọn
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                {servicesList.map((srv) => {
                                    const isSelected = activeService?.id === srv.id;
                                    return (
                                        <button
                                            key={srv.id}
                                            type="button"
                                            onClick={() =>
                                                setActiveService(isSelected ? null : srv)
                                            }
                                            className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                                isSelected
                                                    ? "bg-[#eef7f4] border-[#00677c] text-[#00677c]"
                                                    : "bg-[#f8faf9] border-[#e1e9e6] text-slate-700 hover:border-[#b4dcd3]"
                                            }`}
                                        >
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold truncate">
                                                    {srv.serviceName || srv.title}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    {srv.basePrice
                                                        ? `${Number(srv.basePrice).toLocaleString("vi-VN")}đ / ca`
                                                        : srv.durationMinutes
                                                        ? `${srv.durationMinutes} phút`
                                                        : ""}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <CheckIcon className="w-3.5 h-3.5 shrink-0 text-[#00677c]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* AVAILABILITY */}
                    <div className="pt-5 border-t border-[#edf1ef]">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-3">
                            Thời gian
                        </h3>

                        <div className="grid grid-cols-2 gap-2">
                            {availabilityOptions.map((option) => {
                                const isSelected =
                                    selectedAvailability.includes(option);

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() =>
                                            toggleItem(
                                                option,
                                                selectedAvailability,
                                                setSelectedAvailability
                                            )
                                        }
                                        className={`px-2.5 py-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                                            isSelected
                                                ? "bg-[#00677c] border-[#00677c] text-white"
                                                : "bg-[#f8faf9] border-[#e1e9e6] text-slate-600 hover:border-[#a8d4ca] hover:text-[#00677c]"
                                        }`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* TRUST NOTE */}
            <div className="mt-4 px-1">
                <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#e8f5f1] text-[#00677c] flex items-center justify-center shrink-0">
                        <CheckIcon className="w-3.5 h-3.5" />
                    </div>

                    <div>
                        <p className="text-[11px] font-bold text-[#102030]">
                            Hồ sơ minh bạch
                        </p>
                        <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                            Xem thông tin chuyên môn, kinh nghiệm và đánh giá trước khi đặt lịch.
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
