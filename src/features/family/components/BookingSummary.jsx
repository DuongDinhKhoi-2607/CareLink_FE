import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function BookingSummary({
    details = [],
    safetyCommitments = [],
    status = "idle", // 'idle' | 'family_confirmed' | 'caregiver_accepted' | 'caregiver_rejected' | 'counter_offered' | 'closed'
    rejectReason = "",
    bookingInfo = {},
    onUpdateBookingInfo,
    onConfirmBooking,
    onDirectBooking,
    onRevokeBooking,
    onAcceptCounter,
    onCloseChat,
    onResetDemo,
}) {
    const navigate = useNavigate();
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        scheduledDate: "Ngày mai, 14/10/2026",
        scheduledTime: "08:00 – 10:00 (2 giờ)",
        serviceName: "Chăm sóc phục hồi sau phẫu thuật",
        address: "123 Nguyễn Gia Trí, P. 25, Bình Thạnh, TP. HCM",
    });

    const handleOpenEdit = () => {
        if (onConfirmBooking) {
            onConfirmBooking();
            return;
        }
        setEditForm({
            scheduledDate: bookingInfo?.scheduledDate || "Ngày mai, 14/10/2026",
            scheduledTime: bookingInfo?.scheduledTime || "08:00 – 10:00 (2 giờ)",
            serviceName: bookingInfo?.serviceName || "Chăm sóc phục hồi sau phẫu thuật",
            address: bookingInfo?.address || "123 Nguyễn Gia Trí, P. 25, Bình Thạnh, TP. HCM",
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (onUpdateBookingInfo) {
            onUpdateBookingInfo(editForm);
        }
        setShowEditModal(false);
    };

    const handleConfirmClose = () => {
        setShowCloseModal(false);
        if (onCloseChat) {
            onCloseChat();
        } else {
            navigate("/caregivers");
        }
    };

    return (
        <aside className="flex w-full flex-col gap-5">
            {/* ================================================
                BOX 1: TÓM TẮT ĐẶT LỊCH & THỎA THUẬN 2 CHIỀU
            ================================================= */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all hover:shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#edf9fc] to-[#f7fcfd] px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#00677c] shadow-sm ring-1 ring-[#d8eef2]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#17324d]">
                                Thỏa thuận đặt lịch
                            </h2>
                            <p className="text-xs text-slate-500">
                                Yêu cầu chăm sóc 2 chiều
                            </p>
                        </div>
                    </div>

                    {/* Nút làm mới thỏa thuận */}
                    {onResetDemo && (
                        <button
                            type="button"
                            onClick={onResetDemo}
                            title="Làm mới thỏa thuận ban đầu"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#00677c] bg-white rounded-lg border border-slate-200 hover:border-teal-200 transition-colors shadow-2xs cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            <span>Làm mới</span>
                        </button>
                    )}
                </div>

                {/* Chi tiết đặt lịch */}
                <div className="flex flex-col gap-3.5 p-5">
                    {details.map((item, index) => (
                        <div
                            key={item.label}
                            className={`flex items-start gap-3 ${index !== 0 ? "border-t border-slate-100 pt-3" : ""}`}
                        >
                            <div className="mt-0.5 flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-[#f0f8fa] text-[#00677c]">
                                {item.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                    {item.label}
                                </p>
                                <p className="mt-0.5 break-words text-xs sm:text-sm font-semibold leading-relaxed text-slate-800">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* ====================================================
                        TRẠNG THÁI THỎA THUẬN 2 CHIỀU (Dynamic Status Banner)
                    ==================================================== */}
                    <div className="mt-1 rounded-xl p-3.5 border transition-all duration-300">
                        {status === "idle" && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                                    <span className="text-xs font-semibold text-slate-600">Trạng thái thỏa thuận</span>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                                    Đang trao đổi
                                </span>
                            </div>
                        )}

                        {status === "family_confirmed" && (
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                        Đã gửi yêu cầu đặt lịch
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                                        Chờ phản hồi
                                    </span>
                                </div>
                                <p className="text-[11px] text-amber-700/90 leading-relaxed">
                                    Gia đình đã xác nhận yêu cầu. Đang đợi Điều dưỡng xác nhận nhận ca để mở khóa thanh toán.
                                </p>
                            </div>
                        )}

                        {status === "caregiver_accepted" && (
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        Điều dưỡng đã đồng ý nhận ca!
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        Đã thống nhất
                                    </span>
                                </div>
                                <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                                    Cả 2 bên đã cùng đồng thuận. Gia đình có thể bấm sang bước thanh toán ngay bên dưới.
                                </p>
                            </div>
                        )}

                        {status === "caregiver_rejected" && (
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                                        Điều dưỡng không thể nhận ca
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                                        Đã từ chối
                                    </span>
                                </div>
                                <p className="text-[11px] text-rose-600 leading-relaxed">
                                    Lý do: {rejectReason || "Bận đột xuất vào khung giờ này"}. Vui lòng quay lại danh sách để tìm người phù hợp.
                                </p>
                            </div>
                        )}

                        {status === "closed" && (
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                                <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                    Đã dừng cuộc trao đổi
                                </span>
                                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs">
                                    Đã đóng
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Nút chỉnh sửa thỏa thuận (chỉ hiện khi gia đình đang có đề xuất chờ duyệt) */}
                    {status === "family_confirmed" && (
                        <div className="px-5 pb-1">
                            <button
                                type="button"
                                onClick={handleOpenEdit}
                                className="w-full py-2 px-3 text-xs font-semibold text-[#00677c] hover:bg-[#edf9fc] rounded-xl border border-dashed border-[#84d0df] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                Chỉnh sửa ngày giờ & yêu cầu
                            </button>
                        </div>
                    )}

                    {/* BẢNG TỔNG KẾT PHÍ NỀN TẢNG CỐ ĐỊNH & CHI PHÍ CA (ADR-002) */}
                    <div className="rounded-xl border border-teal-200/80 bg-gradient-to-br from-slate-50 to-teal-50/60 p-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-1 font-medium">
                                <span>Phí nền tảng &amp; Bảo hiểm (cố định):</span>
                            </span>
                            <span className="font-extrabold text-slate-900">60.000 VNĐ</span>
                        </div>
                        {bookingInfo?.totalPrice > 0 && (
                            <>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span className="font-medium">Tiền dịch vụ chăm sóc:</span>
                                    <span className="font-extrabold text-slate-900">{Number(bookingInfo.totalPrice).toLocaleString("vi-VN")} VNĐ</span>
                                </div>
                                <div className="pt-2 border-t border-teal-200/80 flex items-center justify-between text-xs sm:text-sm font-black text-[#00677c]">
                                    <span>Tổng thanh toán dự kiến:</span>
                                    <span className="text-sm sm:text-base font-black">
                                        {(Number(bookingInfo.totalPaymentAmount || (Number(bookingInfo.totalPrice) + 60000))).toLocaleString("vi-VN")} VNĐ
                                    </span>
                                </div>
                            </>
                        )}
                        {(!bookingInfo?.totalPrice || bookingInfo?.totalPrice === 0) && (
                            <p className="text-[10px] text-slate-500 italic leading-snug">
                                * Phí nền tảng 60.000 VNĐ áp dụng cố định mỗi ca trực theo quyết định vận hành ADR-002 (đã bao gồm bảo hiểm y tế CareLink).
                            </p>
                        )}
                    </div>

                    {/* Lưu ý nhỏ */}
                    <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-3">
                        <div className="mb-1 flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376L13.303 3.623a1.5 1.5 0 00-2.606 0L2.697 16.126a1.5 1.5 0 001.303 2.249h16a1.5 1.5 0 001.303-2.249zM12 16.5h.008v.008H12V16.5z" />
                            </svg>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                                Nguyên tắc đảm bảo quyền lợi
                            </h3>
                        </div>
                        <ul className="list-disc space-y-1 pl-4 text-[11px] leading-4.5 text-slate-600">
                            <li>Ca chỉ được tạo khi <strong>cả 2 bên cùng bấm đồng ý</strong>.</li>
                            <li>Nếu 1 bên từ chối, cuộc trao đổi dừng lại và <strong>không phát sinh chi phí nào</strong>.</li>
                        </ul>
                    </div>

                    {/* ====================================================
                        NHÓM NÚT HÀNH ĐỘNG DYNAMIC (Action Area)
                    ==================================================== */}
                    <div className="flex flex-col gap-2.5 pt-1">
                        {/* 1. Trạng thái IDLE: Khách bấm đặt lịch ca trực */}
                        {status === "idle" && (
                            <>
                                <button
                                    type="button"
                                    onClick={onDirectBooking || onConfirmBooking}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] px-4 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-[#00677c]/20 transition-all duration-200 hover:from-[#005566] hover:to-[#007489] hover:shadow-lg active:scale-[0.99] cursor-pointer"
                                >
                                    <svg className="h-4 w-4 text-teal-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    <span>Đặt lịch ca trực (Xem lịch rảnh)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCloseModal(true)}
                                    className="w-full py-2 px-3 text-xs font-semibold text-slate-500 hover:text-[#00677c] hover:bg-teal-50/60 rounded-xl transition-colors cursor-pointer text-center"
                                >
                                    Rời cuộc trò chuyện (Quay lại danh sách)
                                </button>
                            </>
                        )}

                        {/* 2. Trạng thái ĐÃ GỬI YÊU CẦU: Chờ Caregiver phản hồi */}
                        {status === "family_confirmed" && (
                            <>
                                <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs sm:text-sm font-bold text-amber-800">
                                    <svg className="w-4 h-4 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Đang chờ điều dưỡng xác nhận...
                                </div>
                                <button
                                    type="button"
                                    onClick={onRevokeBooking}
                                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline transition-all cursor-pointer text-center"
                                >
                                    Rút lại yêu cầu / Điều chỉnh giờ
                                </button>
                            </>
                        )}

                        {/* 3. Trạng thái ĐIỀU DƯỠNG ĐÃ ĐỒNG Ý: Mở nút Thanh toán */}
                        {status === "caregiver_accepted" && (
                            <Link
                                to={bookingInfo?.bookingId ? `/checkout?bookingId=${bookingInfo.bookingId}` : "/checkout"}
                                state={{ bookingId: bookingInfo?.bookingId || bookingInfo?.id, booking: bookingInfo }}
                                className="group flex w-full flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-3.5 text-white shadow-md shadow-emerald-700/20 transition-all hover:from-emerald-700 hover:to-teal-800 hover:shadow-lg active:scale-[0.99] cursor-pointer"
                            >
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-100">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7" />
                                    </svg>
                                    Cả hai bên đã đồng ý nhận ca
                                </span>
                                <span className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold tracking-wide">
                                    Tiến hành thanh toán
                                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            </Link>
                        )}

                        {/* 3.5. Trạng thái ĐIỀU DƯỠNG ĐỀ XUẤT MỨC GIÁ KHÁC (Counter-Offer) */}
                        {status === "counter_offered" && (
                            <div className="flex flex-col gap-2.5">
                                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                                        Điều dưỡng đề xuất mức giá mới
                                    </div>
                                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                                        {rejectReason || "Điều dưỡng đã đề xuất lại mức chi phí phù hợp hơn cho ca chăm sóc này."}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onAcceptCounter}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-800 cursor-pointer"
                                >
                                    ✓ Chấp nhận giá đề xuất mới
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirmBooking}
                                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline transition-all cursor-pointer text-center"
                                >
                                    Thương lượng lại giá khác
                                </button>
                            </div>
                        )}

                        {/* 4. Trạng thái ĐIỀU DƯỠNG TỪ CHỐI */}
                        {status === "caregiver_rejected" && (
                            <div className="flex flex-col gap-2.5">
                                <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                        Điều dưỡng chưa thể nhận ca trực này
                                    </div>
                                    <p className="text-xs text-rose-800 leading-relaxed">
                                        Lý do: <em>"{rejectReason || "Khung giờ hoặc mức chi phí chưa phù hợp."}"</em>
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                                        Bạn có thể bấm bên dưới để điều chỉnh lại giá / khung giờ hoặc quay lại tìm điều dưỡng khác phù hợp hơn.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onDirectBooking || onConfirmBooking}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:from-[#005566] hover:to-[#007489] transition-all cursor-pointer"
                                >
                                    <svg className="w-4 h-4 text-teal-200" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                    <span>Điều chỉnh & Gửi đề xuất mới</span>
                                </button>
                                <Link
                                    to="/caregivers"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 cursor-pointer text-center"
                                >
                                    Quay lại tìm điều dưỡng khác
                                </Link>
                            </div>
                        )}

                        {/* 5. Trạng thái HOÀN TẤT HOẶC ĐÃ DỪNG: Cho phép đặt lại ca trong tương lai */}
                        {(status === "completed" || status === "closed") && (
                            <div className="flex flex-col gap-2.5">
                                <button
                                    type="button"
                                    onClick={onDirectBooking || onConfirmBooking}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:from-[#005566] hover:to-[#007489] transition-all cursor-pointer"
                                >
                                    <svg className="w-4 h-4 text-teal-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span>Tạo đề xuất ca mới với điều dưỡng này</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/caregivers")}
                                    className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-center"
                                >
                                    Quay lại danh sách điều dưỡng
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ================================================
                BOX 2: CAM KẾT AN TOÀN CARELINK
            ================================================= */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#17324d]">
                    Cam kết từ CareLink Medical
                </h3>
                <ul className="space-y-2.5">
                    {safetyCommitments.map((item) => (
                        <li key={item.text} className="flex items-center gap-2.5 text-xs text-slate-700">
                            <span className="shrink-0">{item.icon}</span>
                            <span className="font-medium leading-snug">{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ================================================
                MODAL XÁC NHẬN DỪNG TRAO ĐỔI (Elegant Modal)
            ================================================= */}
            {showCloseModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
                    onClick={() => setShowCloseModal(false)}
                >
                    <div
                        className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-[#00677c] flex items-center justify-center mx-auto sm:mx-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Quay lại danh sách điều dưỡng?
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                                Bạn có thể quay lại tìm kiếm điều dưỡng khác bất cứ lúc nào. Lịch sử cuộc trò chuyện này vẫn được lưu lại an toàn để bạn tiếp tục trao đổi khi cần.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowCloseModal(false)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                Ở lại trò chuyện
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmClose}
                                className="px-4 py-2.5 rounded-xl bg-[#00677c] text-white text-xs sm:text-sm font-bold hover:bg-[#005263] transition-colors cursor-pointer shadow-sm"
                            >
                                Quay lại danh sách
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================
                MODAL CHỈNH SỬA THỎA THUẬN (Edit Agreement Modal)
            ================================================= */}
            {showEditModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
                    onClick={() => setShowEditModal(false)}
                >
                    <div
                        className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col gap-4 animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header modal */}
                        <div className="flex items-start justify-between pb-1 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#edf9fc] text-[#00677c] flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Chỉnh sửa thỏa thuận đặt lịch
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Cập nhật lại thời gian, dịch vụ hoặc địa điểm chăm sóc
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form fields */}
                        <form onSubmit={handleSaveEdit} className="flex flex-col gap-3.5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Ngày dự kiến
                                </label>
                                <select
                                    value={editForm.scheduledDate}
                                    onChange={(e) => setEditForm({ ...editForm, scheduledDate: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                                >
                                    <option value="Ngày mai, 14/10/2026">Ngày mai, 14/10/2026</option>
                                    <option value="Hôm nay, 13/10/2026">Hôm nay, 13/10/2026</option>
                                    <option value="Thứ Năm, 15/10/2026">Thứ Năm, 15/10/2026</option>
                                    <option value="Thứ Sáu, 16/10/2026">Thứ Sáu, 16/10/2026</option>
                                    <option value="Thứ Bảy, 17/10/2026">Thứ Bảy, 17/10/2026</option>
                                    <option value="Chủ Nhật, 18/10/2026">Chủ Nhật, 18/10/2026</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Khung giờ chăm sóc
                                </label>
                                <select
                                    value={editForm.scheduledTime}
                                    onChange={(e) => setEditForm({ ...editForm, scheduledTime: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                                >
                                    <option value="08:00 – 10:00 (2 giờ)">08:00 – 10:00 (2 giờ sáng)</option>
                                    <option value="13:00 – 17:00 (4 giờ)">13:00 – 17:00 (4 giờ chiều)</option>
                                    <option value="08:00 – 16:00 (8 giờ)">08:00 – 16:00 (8 giờ trọn ngày)</option>
                                    <option value="18:00 – 21:00 (3 giờ)">18:00 – 21:00 (3 giờ ca tối)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Dịch vụ chăm sóc
                                </label>
                                <select
                                    value={editForm.serviceName}
                                    onChange={(e) => setEditForm({ ...editForm, serviceName: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                                >
                                    <option value="Chăm sóc phục hồi sau phẫu thuật">Chăm sóc phục hồi sau phẫu thuật</option>
                                    <option value="Chăm sóc người cao tuổi toàn diện">Chăm sóc người cao tuổi toàn diện</option>
                                    <option value="Hỗ trợ vật lý trị liệu & tập vận động">Hỗ trợ vật lý trị liệu & tập vận động</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Địa chỉ chăm sóc
                                </label>
                                <input
                                    type="text"
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    placeholder="Nhập địa chỉ chăm sóc..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                                    required
                                />
                            </div>

                            {/* Alert quy tắc */}
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed flex items-start gap-2">
                                <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376L13.303 3.623a1.5 1.5 0 00-2.606 0L2.697 16.126a1.5 1.5 0 001.303 2.249h16a1.5 1.5 0 001.303-2.249zM12 16.5h.008v.008H12V16.5z" />
                                </svg>
                                <span>
                                    <strong>Lưu ý:</strong> Khi bạn thay đổi ngày/giờ, thỏa thuận cũ sẽ được hủy hiệu lực và hệ thống sẽ gửi tin nhắn yêu cầu điều dưỡng cùng gia đình xác nhận lại.
                                </span>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-[#00677c] text-white text-xs sm:text-sm font-bold hover:bg-[#005566] transition-all cursor-pointer shadow-sm shadow-[#00677c]/20"
                                >
                                    Lưu & Gửi thỏa thuận mới
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </aside>
    );
}
