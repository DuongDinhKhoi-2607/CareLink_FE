import React from "react";
import { Link } from "react-router-dom";

export default function BookingSummary({
    details = [],
    safetyCommitments = [],
    bookingConfirmed,
    onConfirmBooking,
}) {
    return (
        <aside className="flex w-full flex-col gap-5">
            {/* ================================================
                BOX 1: TÓM TẮT ĐẶT LỊCH
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                {/* Header */}

                <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-[#edf9fc] to-[#f7fcfd] px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#00677c] shadow-sm ring-1 ring-[#d8eef2]">
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                            />
                        </svg>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-[#17324d]">
                            Tóm tắt đặt lịch
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Thông tin chăm sóc dự kiến
                        </p>
                    </div>
                </div>

                {/* Chi tiết */}

                <div className="flex flex-col gap-4 p-5">
                    {details.map((item, index) => (
                        <div
                            key={item.label}
                            className={`flex items-start gap-3 ${index !== 0
                                ? "border-t border-slate-100 pt-3"
                                : ""
                                }`}
                        >
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f8fa] text-[#00677c]">
                                {item.icon}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                    {item.label}
                                </p>

                                <p className="mt-1 break-words text-sm font-medium leading-6 text-slate-800">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Trạng thái */}

                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                        <span className="text-sm font-medium text-slate-600">
                            Trạng thái
                        </span>

                        <span
                            aria-live="polite"
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${bookingConfirmed
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                : "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                                }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${bookingConfirmed
                                    ? "bg-emerald-500"
                                    : "bg-sky-500"
                                    }`}
                            />

                            {bookingConfirmed
                                ? "Đã xác nhận"
                                : "Chờ xác nhận"}
                        </span>
                    </div>

                    {/* Lưu ý */}

                    <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <svg
                                className="h-4 w-4 text-amber-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m9.303 3.376L13.303 3.623a1.5 1.5 0 00-2.606 0L2.697 16.126a1.5 1.5 0 001.303 2.249h16a1.5 1.5 0 001.303-2.249zM12 16.5h.008v.008H12V16.5z"
                                />
                            </svg>

                            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                                Lưu ý
                            </h3>
                        </div>

                        <ul className="list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
                            <li>
                                Điều dưỡng sẽ xác nhận lại lịch hẹn.
                            </li>

                            <li>
                                Chi phí chăm sóc được thanh toán trực tiếp
                                giữa gia đình và điều dưỡng sau khi hoàn
                                thành dịch vụ.
                            </li>

                            <li>
                                Phí nền tảng CareLink sẽ được thanh toán
                                ở bước tiếp theo.
                            </li>
                        </ul>
                    </div>

                    {/* Nút xác nhận */}

                    <div className="flex flex-col gap-3 pt-1">
                        {!bookingConfirmed ? (
                            <button
                                type="button"
                                onClick={onConfirmBooking}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00677c] px-4 py-3.5 text-sm font-bold text-white shadow-sm shadow-[#00677c]/15 transition duration-200 hover:bg-[#005566] hover:shadow-md active:scale-[0.99]"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 12.5l4.5 4.5L19 7"
                                    />
                                </svg>

                                Xác nhận đặt lịch
                            </button>
                        ) : (
                            <Link
                                to="/checkout"
                                className="group flex w-full flex-col items-center justify-center gap-1 rounded-xl bg-emerald-700 px-4 py-3 text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md"
                            >
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-100">
                                    <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 12.5l4.5 4.5L19 7"
                                        />
                                    </svg>

                                    Đã xác nhận đặt lịch
                                </span>

                                <span className="inline-flex items-center gap-2 text-sm font-bold">
                                    Sang thanh toán

                                    <svg
                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 12h14m-7-7l7 7-7 7"
                                        />
                                    </svg>
                                </span>
                            </Link>
                        )}

                        <p className="text-center text-[11px] leading-5 text-slate-400">
                            Gia đình và điều dưỡng sẽ nhận được thông báo
                            sau khi lịch hẹn được xác nhận.
                        </p>
                    </div>
                </div>
            </div>

            {/* ================================================
                BOX 2: CAM KẾT AN TOÀN
            ================================================= */}

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75l2.25 2.25L15.75 9m4.5 3c0 4.418-3.694 8.25-8.25 9-4.556-.75-8.25-4.582-8.25-9V6l8.25-3L20.25 6v6z"
                            />
                        </svg>
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-800">
                            Cam kết an toàn
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-400">
                            Đồng hành cùng gia đình
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {safetyCommitments.map((commitment) => (
                        <div
                            key={commitment.text}
                            className="flex items-start gap-3"
                        >
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f0f8fa] text-[#00677c]">
                                {commitment.icon}
                            </div>

                            <span className="text-sm leading-6 text-slate-600">
                                {commitment.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
