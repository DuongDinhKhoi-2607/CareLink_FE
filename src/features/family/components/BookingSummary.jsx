import React from "react";
import { Link } from "react-router-dom";

export default function BookingSummary({
    details,
    safetyCommitments,
    bookingConfirmed,
    onConfirmBooking,
}) {
    return (
        <aside className="w-full flex flex-col gap-6">
            {/* Box 1: Tóm tắt đặt lịch */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                {/* Header Tóm tắt */}
                <div className="p-4 bg-[#4fd9fd1a] border-b border-[#c4c6cf4c] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-prussian-blue">Tóm tắt đặt lịch</h2>
                    </div>
                </div>

                {/* Danh sách thông tin chi tiết */}
                <div className="p-6 flex flex-col gap-4">
                    {details.map((item, idx) => (
                        <div key={item.label} className={`flex items-start gap-3 ${idx !== 0 ? "pt-2 border-t border-slate-100" : ""}`}>
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-[#00677c] mt-0.5">
                                {item.icon}
                            </div>
                            <div className="flex flex-col min-h-[38px]">
                                <span className="font-semibold uppercase tracking-wider text-[11px] text-[#43474e]">
                                    {item.label}
                                </span>
                                <span className="font-normal text-[#181c1e] text-base mt-0.5">
                                    {item.value}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Trạng thái xác nhận */}
                    <div className="pt-3 border-t border-[#c4c6cf] flex items-center justify-between">
                        <span className="text-base text-[#43474e]">Trạng thái</span>
                        <div
                            aria-live="polite"
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${bookingConfirmed
                                    ? "bg-[#d9f7df] text-[#12451d]"
                                    : "bg-[#b2ebff] text-prussian-blue"
                                }`}
                        >
                            {bookingConfirmed ? "Đã xác nhận" : "Đang chờ xác nhận"}
                        </div>
                    </div>

                    {/* Khối LƯU Ý */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#43474e]">
                            LƯU Ý
                        </h3>
                        <ul className="list-disc pl-4 space-y-1.5 text-sm text-[#181c1e] leading-relaxed">
                            <li>Điều dưỡng sẽ xác nhận lại lịch hẹn.</li>
                            <li>Chi phí chăm sóc sẽ được thanh toán trực tiếp giữa gia đình và điều dưỡng sau khi hoàn thành dịch vụ.</li>
                            <li>Phí nền tảng CareLink sẽ được thanh toán ở bước tiếp theo.</li>
                        </ul>
                    </div>

                    {/* Nút thao tác xác nhận đặt lịch */}
                    <div className="pt-2 flex flex-col items-center gap-2">
                        {!bookingConfirmed ? (
                            <button
                                type="button"
                                onClick={onConfirmBooking}
                                className="w-full py-3.5 px-4 bg-prussian-blue text-white rounded-xl text-base font-normal hover:bg-[#1a365d] transition-colors shadow-md flex items-center justify-center"
                            >
                                Xác nhận đặt lịch
                            </button>
                        ) : (
                            <Link
                                to="/checkout"
                                className="w-full py-3 px-4 bg-[#1e7a36] text-white rounded-xl hover:bg-[#16652c] transition-all shadow-md hover:shadow-lg flex flex-col items-center justify-center gap-1 group"
                            >
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-100">
                                    <svg className="w-3.5 h-3.5 text-emerald-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Đã xác nhận đặt lịch
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-base font-bold">
                                    Sang thanh toán
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            </Link>
                        )}

                        <p className="text-xs text-center italic text-[#43474e]">
                            Gia đình và điều dưỡng sẽ nhận được thông báo sau khi lịch hẹn được xác nhận.
                        </p>
                    </div>
                </div>
            </div>

            {/* Box 2: CAM KẾT AN TOÀN */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#43474e]">
                    CAM KẾT AN TOÀN
                </h2>
                <div className="flex flex-col gap-3">
                    {safetyCommitments.map((commitment) => (
                        <div key={commitment.text} className="flex items-center gap-3">
                            <div className="w-6 h-6 shrink-0 text-[#00677c]">
                                {commitment.icon}
                            </div>
                            <span className="text-base text-[#181c1e]">
                                {commitment.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}