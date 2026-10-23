import React from "react";
import { Link } from "react-router-dom";
import {
    ClipboardList,
    UserRound,
    HeartPulse,
    Stethoscope,
    CalendarClock,
    Clock,
    MapPin,
    Wallet,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ChevronRight,
    MessageCircle,
    CircleX,
    ShieldCheck,
    CircleCheck,
    X,
    FileText,
} from "lucide-react";

/**
 * CaregiverBookingDetailPanel
 * Panel thông tin chi tiết ca chăm sóc ở cột bên phải và modal từ chối nhận ca.
 * Hiển thị người cần chăm sóc, dịch vụ, lịch hẹn, địa chỉ, thu nhập dự kiến,
 * các hành động chấp nhận/từ chối ca và lưu ý an toàn chuyên môn.
 */
export default function CaregiverBookingDetailPanel({
    demoState,
    booking,
    handleAcceptRequest,
    handleOpenRejectModal,
    showRejectModal,
    setShowRejectModal,
    rejectReason,
    setRejectReason,
    customReason,
    setCustomReason,
    rejectError,
    setRejectError,
    handleConfirmReject,
    rejectionReasons = [],
    mobileSection,
    StatusBadge,
    DetailItem,
}) {
    const [showPatientModal, setShowPatientModal] = React.useState(false);

    return (
        <>
            <aside
                className={`${
                    mobileSection !== "details" ? "hidden lg:flex" : "flex"
                } h-full min-h-0 flex-col gap-4 overflow-y-auto pr-0.5 lg:col-span-12 xl:col-span-3`}
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(8,116,135,0.25) transparent",
                }}
            >
                {/* Booking card — shrink-0 để không bị co ép mất nút thao tác và thông tin */}
                <div className="shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf5f7] text-[#087487]">
                                    <ClipboardList className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Chi tiết ca {booking?.proposalNumber ? `#${booking.proposalNumber}` : ""}
                                    </h3>

                                    <p className="mt-1 text-[11px] text-slate-500">
                                        Thông tin yêu cầu chăm sóc từ khách hàng
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3">
                            <StatusBadge status={demoState.status} />
                        </div>
                    </div>

                    <div className="space-y-5 p-4 sm:p-5">
                        {/* Patient */}
                        <section>
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                                Người cần chăm sóc
                            </p>

                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f8fa] text-[#087487]">
                                    <UserRound className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900">
                                        {booking.recipientName}
                                    </p>

                                    {(booking.recipientAge || booking.relation) ? (
                                        <p className="mt-1 text-xs text-slate-500">
                                            {[booking.recipientAge, booking.relation].filter(Boolean).join(" · ")}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mt-3 rounded-xl bg-slate-50 p-3.5">
                                <div className="mb-2 flex items-center gap-2">
                                    <HeartPulse className="h-4 w-4 shrink-0 text-[#087487]" />

                                    <p className="text-xs font-bold text-slate-700">
                                        Tình trạng sức khỏe
                                    </p>
                                </div>

                                <p className="text-xs leading-[1.8] text-slate-600">
                                    {booking.condition || "Chưa có ghi chú tình trạng sức khỏe"}
                                </p>
                            </div>

                            {/* Nút xem bệnh án chi tiết từ BookingProposalResponse */}
                            <button
                                type="button"
                                onClick={() => setShowPatientModal(true)}
                                className="mt-2.5 w-full py-2 px-3 text-xs font-bold text-[#087487] bg-[#edf7f9] hover:bg-[#e0f1f4] rounded-xl border border-[#c9e4e9] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Xem bệnh án & tiền sử y tế</span>
                            </button>
                        </section>

                        <div className="h-px bg-slate-100" />

                        {/* Service (Hỗ trợ Combo nhiều dịch vụ) */}
                        <section>
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                                Thông tin dịch vụ {booking.services && booking.services.length > 1 ? `(Combo ${booking.services.length} dịch vụ)` : ""}
                            </p>

                            {booking.services && booking.services.length > 1 ? (
                                <div className="space-y-2">
                                    {booking.services.map((s, idx) => (
                                        <div key={s.serviceId || idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                                            <div className="min-w-0 pr-2">
                                                <p className="font-bold text-slate-800 truncate">{s.serviceName}</p>
                                                <p className="text-[10px] text-slate-400">{s.durationMinutes} phút</p>
                                            </div>
                                            <span className="font-semibold text-emerald-700 shrink-0">
                                                {Number(s.price).toLocaleString("vi-VN")} đ
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <DetailItem
                                    icon={Stethoscope}
                                    label="Dịch vụ chăm sóc"
                                >
                                    {booking.serviceName}
                                </DetailItem>
                            )}
                        </section>

                        <div className="h-px bg-slate-100" />

                        {/* Schedule */}
                        <section>
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                                Thời gian và địa điểm
                            </p>

                            <div className="space-y-4">
                                <DetailItem
                                    icon={CalendarClock}
                                    label="Ngày chăm sóc"
                                >
                                    {booking.scheduledDate}
                                </DetailItem>

                                <DetailItem
                                    icon={Clock}
                                    label="Khung giờ"
                                >
                                    {booking.scheduledTime}
                                </DetailItem>

                                <DetailItem
                                    icon={MapPin}
                                    label="Địa chỉ"
                                >
                                    {booking.address}
                                </DetailItem>
                            </div>
                        </section>

                        <div className="h-px bg-slate-100" />

                        {/* Income */}
                        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-800">
                                        Thu nhập dự kiến
                                    </p>

                                    <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-700">
                                        Tổng chi phí dịch vụ từ khách
                                    </p>
                                </div>

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
                                    <Wallet className="h-4 w-4" />
                                </div>
                            </div>

                            <p className="mt-3 text-xl font-extrabold tracking-tight text-emerald-800">
                                {booking.fee}
                            </p>
                            {booking.fee && booking.fee !== "Thỏa thuận" && (
                                <p className="mt-1 text-[10px] text-emerald-600 font-medium">
                                    (Khấu trừ phí nền tảng CareLink 60.000đ khi hoàn tất ca theo ADR-002)
                                </p>
                            )}
                        </section>
                    </div>

                    {/* Action area */}
                    <div className="border-t border-slate-100 bg-[#fbfcfd] p-4 sm:p-5">
                        {demoState.status === "family_confirmed" && (
                            <div className="space-y-3">
                                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                                    <p className="text-xs leading-relaxed text-amber-900">
                                        Gia đình đã gửi yêu cầu. Vui lòng kiểm tra thông tin trước khi quyết định nhận ca.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAcceptRequest}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#087487] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#066274] active:scale-[0.99]"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Đồng ý nhận ca
                                </button>

                                <button
                                    type="button"
                                    onClick={handleOpenRejectModal}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Từ chối yêu cầu
                                </button>
                            </div>
                        )}

                        {demoState.status === "caregiver_accepted" && (
                            <div className="space-y-3">
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                                        <p className="text-xs font-bold text-emerald-900">
                                            Bạn đã đồng ý nhận ca
                                        </p>
                                    </div>

                                    <p className="mt-2 text-xs leading-relaxed text-emerald-800">
                                        Gia đình có thể tiếp tục quy trình thanh toán theo luồng demo hiện tại.
                                    </p>
                                </div>

                                <Link
                                    to="/caregiver/schedule"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#c9e4e9] bg-[#edf7f9] px-4 py-2.5 text-xs font-semibold text-[#087487] transition hover:bg-[#e0f1f4]"
                                >
                                    Xem lịch làm việc
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        )}

                        {demoState.status === "caregiver_rejected" && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 shrink-0 text-rose-600" />

                                    <p className="text-xs font-bold text-rose-900">
                                        Bạn đã từ chối nhận ca
                                    </p>
                                </div>

                                <p className="mt-2 break-words text-xs leading-relaxed text-rose-800">
                                    Lý do:{" "}
                                    {demoState.rejectReason ||
                                        "Điều dưỡng bận lịch."}
                                </p>
                            </div>
                        )}

                        {demoState.status === "idle" && (
                            <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3.5">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 shrink-0 text-sky-700" />

                                    <p className="text-xs font-bold text-sky-900">
                                        Đang trao đổi nhu cầu
                                    </p>
                                </div>

                                <p className="mt-2 text-xs leading-relaxed text-sky-800">
                                    Hai bên có thể tiếp tục trao đổi. Khi gia đình gửi yêu cầu đặt lịch, bạn sẽ có thể xác nhận nhận ca tại đây.
                                </p>
                            </div>
                        )}

                        {demoState.status === "closed" && (
                            <div className="rounded-xl border border-slate-200 bg-slate-100 p-3.5">
                                <div className="flex items-center gap-2">
                                    <CircleX className="h-4 w-4 shrink-0 text-slate-500" />

                                    <p className="text-xs font-bold text-slate-700">
                                        Ca chăm sóc đã kết thúc
                                    </p>
                                </div>

                                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                    Ca chăm sóc này đã hoàn tất. Bạn và gia đình vẫn có thể tiếp tục nhắn tin trao đổi hoặc lên lịch cho ca tiếp theo.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Safety note — shrink-0 giữ cố định cấu trúc đẹp mắt */}
                <div className="shrink-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <ShieldCheck className="h-4 w-4" />
                        </div>

                        <h3 className="text-xs font-bold text-slate-800">
                            Lưu ý khi nhận ca
                        </h3>
                    </div>

                    <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-500">
                        <li className="flex items-start gap-2">
                            <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            Kiểm tra yêu cầu có phù hợp chuyên môn và lịch làm việc.
                        </li>

                        <li className="flex items-start gap-2">
                            <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            Xác nhận rõ thời gian, địa chỉ và nhu cầu chăm sóc.
                        </li>

                        <li className="flex items-start gap-2">
                            <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            Trao đổi thông tin người bệnh phù hợp với mục đích chăm sóc.
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Modal từ chối nhận ca */}
            {showRejectModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowRejectModal(false);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reject-modal-title"
                        className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
                    >
                        <div className="flex items-start gap-3.5 border-b border-slate-100 p-5 sm:p-6">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                                <XCircle className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3
                                    id="reject-modal-title"
                                    className="text-base font-bold text-slate-900"
                                >
                                    Từ chối yêu cầu nhận ca?
                                </h3>

                                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                                    Chọn lý do phù hợp để gia đình hiểu tình trạng của bạn.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                aria-label="Đóng"
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-2 p-5 sm:p-6">
                            {rejectionReasons.map((reason) => {
                                const selected = rejectReason === reason;

                                return (
                                    <label
                                        key={reason}
                                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${
                                            selected
                                                ? "border-[#7ab8c4] bg-[#f0f8fa]"
                                                : "border-slate-200 bg-white hover:bg-slate-50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="rejectReason"
                                            value={reason}
                                            checked={selected}
                                            onChange={() => {
                                                setRejectReason(reason);
                                                setRejectError("");
                                            }}
                                            className="mt-0.5 h-4 w-4 accent-[#087487]"
                                        />

                                        <span
                                            className={`text-xs leading-relaxed ${
                                                selected
                                                    ? "font-semibold text-[#087487]"
                                                    : "text-slate-600"
                                            }`}
                                        >
                                            {reason}
                                        </span>
                                    </label>
                                );
                            })}

                            {rejectReason === "Lý do khác" && (
                                <textarea
                                    rows={3}
                                    maxLength={300}
                                    value={customReason}
                                    onChange={(event) => {
                                        setCustomReason(event.target.value);
                                        setRejectError("");
                                    }}
                                    placeholder="Nhập lý do cụ thể..."
                                    className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#82bdc8] focus:ring-4 focus:ring-[#087487]/5"
                                />
                            )}

                            {rejectError && (
                                <p
                                    role="alert"
                                    className="text-xs font-medium text-rose-600"
                                >
                                    {rejectError}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2.5 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                            >
                                Quay lại
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmReject}
                                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700"
                            >
                                <XCircle className="h-3.5 w-3.5" />
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal xem chi tiết bệnh án người bệnh (BookingProposalResponse) */}
            {showPatientModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setShowPatientModal(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#edf7f9] to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#087487]/10 text-[#087487] flex items-center justify-center">
                                    <UserRound className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Hồ sơ bệnh án người bệnh
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Thông tin sức khỏe & tiền sử y tế từ gia đình
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPatientModal(false)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Họ và tên</span>
                                    <p className="text-sm font-bold text-slate-900 mt-0.5">{booking.recipientName}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Độ tuổi / Giới tính</span>
                                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                                        {[booking.recipientAge, booking.recipientGenderName].filter(Boolean).join(" · ") || "Chưa cập nhật"}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Tiền sử bệnh án</span>
                                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                                    {booking.recipientMedicalHistory || "Không ghi nhận tiền sử bệnh đặc biệt."}
                                </p>
                            </div>

                            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 space-y-1">
                                <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                    Lưu ý đặc biệt / Dị ứng thuốc
                                </span>
                                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                                    {booking.recipientSpecialNotes || "Không có lưu ý dị ứng hoặc chống chỉ định."}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Địa chỉ chăm sóc</span>
                                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                                    {booking.recipientAddress || booking.address || "Địa chỉ theo thỏa thuận"}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowPatientModal(false)}
                                className="px-4 py-2 rounded-xl bg-[#087487] text-white text-xs font-bold hover:bg-[#066274] transition cursor-pointer"
                            >
                                Đã xem và hiểu rõ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
