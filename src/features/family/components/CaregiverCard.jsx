import React from "react";

export default function CaregiverCard({ caregiver, onProfile, onBook }) {
    return (
        <article className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row gap-5 flex-1">
                {/* Cột ảnh đại diện */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-100 mx-auto sm:mx-0">
                    <img
                        className="w-full h-full object-cover"
                        src={caregiver.image}
                        alt={`Chân dung ${caregiver.name}`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400";
                        }}
                    />
                    {/* Badge Rating */}
                    <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f4fbf7] border border-emerald-200/60 shadow-xs">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold text-emerald-700">{caregiver.rating}</span>
                    </div>
                </div>

                {/* Cột nội dung thông tin */}
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                            <div>
                                <h3 className="text-lg font-bold text-[#102030] hover:text-[#00677c] transition-colors cursor-pointer">
                                    {caregiver.name}
                                </h3>
                                <p className="text-xs font-semibold text-[#00677c] mt-0.5">{caregiver.role}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <span className="text-base font-extrabold text-[#102030]">{caregiver.rate}</span>
                            </div>
                        </div>

                        {/* Badges kinh nghiệm & chuyên môn */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-[#43474e] text-xs font-medium">
                                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {caregiver.experience}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-[#00677c] text-xs font-semibold border border-teal-100/80">
                                <svg className="w-3.5 h-3.5 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {caregiver.specialty}
                            </span>
                        </div>

                        <p className="text-xs text-slate-600 italic mt-3 line-clamp-2 leading-relaxed">
                            "{caregiver.quote}"
                        </p>
                    </div>
                </div>
            </div>

            {/* 2 Nút thao tác dưới chân thẻ */}
            <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/40">
                <button
                    type="button"
                    onClick={() => onProfile(caregiver)}
                    className="py-3 px-4 text-xs font-bold text-[#102030] hover:bg-slate-100 transition-colors border-r border-slate-100 flex items-center justify-center gap-1.5"
                >
                    Xem hồ sơ
                </button>
                <button
                    type="button"
                    onClick={() => onBook(caregiver)}
                    className="py-3 px-4 text-xs font-bold text-white bg-[#00677c] hover:bg-[#005566] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                    Đặt ngay
                </button>
            </div>
        </article>
    );
}