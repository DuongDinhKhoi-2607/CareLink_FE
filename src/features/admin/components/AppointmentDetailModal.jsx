import React, { useEffect, useState } from "react";
import {
    X,
    MapPin,
    CalendarDays,
    ClipboardList,
    Phone,
    Stethoscope,
    Clock,
    Star,
    AlertTriangle,
    UserRound,
    HeartPulse,
    Wallet,
    ShieldCheck,
    CheckCircle2,
    ChevronRight,
    Activity,
} from "lucide-react";

/**
 * AppointmentDetailModal
 *
 * Modal chi tiết lịch hẹn dành cho Admin CareLink.
 *
 * Giữ nguyên dữ liệu và cấu trúc appointment hiện tại:
 * - Thông tin lịch chăm sóc
 * - Người thân được chăm sóc
 * - Gia đình đặt ca
 * - Điều dưỡng phụ trách
 * - Ghi chú chăm sóc
 * - Thông tin khiếu nại (nếu có)
 * - Đánh giá hai chiều (nếu có)
 * - Tổng thanh toán
 *
 * Props:
 * appointment  : Object chứa dữ liệu lịch hẹn
 * statusConfig : Cấu hình trạng thái được truyền từ AdminAppointments
 * onClose      : Hàm đóng modal
 */

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT PHỤ: NHÃN TRẠNG THÁI
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status, config }) {
    return (
        <span
            className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${config.badge}`}
        >
            <span
                className={`h-2 w-2 shrink-0 rounded-full ${config.dot}`}
            />
            <span>{status}</span>
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT PHỤ: TIÊU ĐỀ MỤC
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeading({ icon: Icon, title, description }) {
    return (
        <div className="mb-3 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#00677c] shadow-sm">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </div>

            <div className="min-w-0 pt-0.5">
                <h3 className="text-sm font-bold tracking-tight text-slate-800">
                    {title}
                </h3>

                {description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT PHỤ: Ô THÔNG TIN LỊCH CHĂM SÓC
// ─────────────────────────────────────────────────────────────────────────────

function ScheduleItem({ icon: Icon, label, value, highlight = false }) {
    return (
        <div
            className={`min-w-0 rounded-xl border p-3 ${highlight
                    ? "border-[#00677c]/20 bg-[#f0f8f9]"
                    : "border-slate-200 bg-white"
                }`}
        >
            <div className="flex items-center gap-2 text-slate-500">
                <Icon className="h-4 w-4 shrink-0 text-[#00677c]" />

                <span className="text-[11px] font-semibold">
                    {label}
                </span>
            </div>

            <p
                className={`mt-2 break-words text-sm font-bold ${highlight ? "text-[#00677c]" : "text-slate-800"
                    }`}
            >
                {value || "Chưa cập nhật"}
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT PHỤ: THẺ THÔNG TIN NGƯỜI DÙNG
// ─────────────────────────────────────────────────────────────────────────────

function PersonCard({
    title,
    name,
    subtitle,
    phone,
    address,
    avatarColor = "teal",
    icon: Icon = UserRound,
}) {
    const avatarStyles = {
        teal: "border-teal-100 bg-teal-50 text-[#00677c]",
        sky: "border-sky-100 bg-sky-50 text-sky-700",
        purple: "border-purple-100 bg-purple-50 text-purple-700",
    };

    return (
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <Icon className="h-4 w-4" />
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {title}
                </h4>
            </div>

            <div className="flex min-w-0 items-start gap-3">
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-base font-extrabold ${avatarStyles[avatarColor] || avatarStyles.teal
                        }`}
                >
                    {(name || "?").charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-bold leading-snug text-slate-900">
                        {name || "Chưa cập nhật"}
                    </p>

                    {subtitle && (
                        <p className="mt-1 break-words text-xs leading-relaxed text-slate-500">
                            {subtitle}
                        </p>
                    )}

                    {phone && (
                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-2.5 py-2">
                            <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00677c]" />

                            <span className="break-all text-xs font-semibold text-slate-700">
                                {phone}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {address && (
                <div className="mt-3 flex items-start gap-2 border-t border-slate-100 pt-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                    <p className="break-words text-xs leading-relaxed text-slate-600">
                        {address}
                    </p>
                </div>
            )}
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT PHỤ: THẺ ĐÁNH GIÁ
// ─────────────────────────────────────────────────────────────────────────────

function ReviewCard({ title, review }) {
    return (
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                        <UserRound className="h-4 w-4" />
                    </div>

                    <span className="text-xs font-bold text-slate-800">
                        {title}
                    </span>
                </div>

                {review ? (
                    <div className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-extrabold text-amber-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        {review.rating}/5
                    </div>
                ) : (
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-400">
                        Chưa gửi
                    </span>
                )}
            </div>

            {review ? (
                <>
                    <p className="mt-3 break-words text-xs leading-relaxed text-slate-600">
                        “{review.comment}”
                    </p>

                    {review.date && (
                        <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {review.date}
                        </div>
                    )}
                </>
            ) : (
                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    Chưa có phản hồi từ người dùng.
                </p>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MODAL
// ─────────────────────────────────────────────────────────────────────────────

export default function AppointmentDetailModal({
    appointment,
    statusConfig,
    onClose,
    onResolveDispute,
}) {
    const [isResolving, setIsResolving] = useState(false);
    const [resolveType, setResolveType] = useState(1); // 1 = Refunded, 2 = Dismissed
    const [refundAmount, setRefundAmount] = useState(
        appointment?.totalAmount ? parseInt(appointment.totalAmount.replace(/[^\d]/g, ""), 10) : 500000
    );
    const [resolveNote, setResolveNote] = useState("");

    // Cho phép đóng modal bằng phím Escape.
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Ngăn cuộn trang nền khi modal đang mở.
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose]);

    if (!appointment) {
        return null;
    }

    const handleConfirmResolution = () => {
        if (!resolveNote.trim()) {
            alert("Vui lòng nhập ghi chú kết quả đối soát / lý do giải quyết.");
            return;
        }
        if (onResolveDispute) {
            onResolveDispute(appointment.id, {
                resolutionType: resolveType,
                refundAmount: resolveType === 1 ? Number(refundAmount) : 0,
                resolutionNote: resolveNote.trim(),
            });
        }
        setIsResolving(false);
    };

    const sc = statusConfig?.[appointment.status] ?? {
        dot: "bg-slate-400",
        badge: "border-slate-200 bg-slate-100 text-slate-600",
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 sm:p-5"
            style={{
                backgroundColor: "rgba(15, 23, 42, 0.52)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
            }}
            onClick={onClose}
            role="presentation"
        >
            {/* Modal container */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="appointment-modal-title"
                className="relative my-auto flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#fcfdfd] shadow-[0_24px_80px_rgba(15,23,42,0.24)] sm:rounded-3xl"
                onClick={(event) => event.stopPropagation()}
            >
                {/* ───────────────── HEADER ───────────────── */}
                <header className="relative shrink-0 border-b border-slate-200 bg-white">
                    {/* Dải nhận diện CareLink */}
                    <div className="h-1 w-full bg-gradient-to-r from-[#00677c] via-teal-500 to-emerald-400" />

                    <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6">
                        <div className="flex min-w-0 items-start gap-3.5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-[#00677c]">
                                <CalendarDays
                                    className="h-6 w-6"
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                        Hồ sơ lịch hẹn
                                    </span>

                                    <span className="rounded-md border border-teal-100 bg-teal-50 px-2 py-0.5 text-[11px] font-extrabold text-[#00677c]">
                                        {appointment.id}
                                    </span>
                                </div>

                                <h2
                                    id="appointment-modal-title"
                                    className="mt-1.5 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl"
                                >
                                    Chi tiết ca chăm sóc
                                </h2>

                                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                                    Thông tin lịch hẹn, người tham gia và quá trình chăm sóc.
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Đóng cửa sổ chi tiết"
                                title="Đóng"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 hover:border-teal-200 hover:bg-teal-50 hover:text-[#00677c] focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                            >
                                <X className="h-[18px] w-[18px]" />
                            </button>

                            <StatusBadge
                                status={appointment.status}
                                config={sc}
                            />
                        </div>
                    </div>
                </header>

                {/* ───────────────── SCROLLABLE BODY ───────────────── */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div className="space-y-6 p-5 sm:space-y-7 sm:p-7">
                        {/* Dịch vụ và lịch chăm sóc */}
                        <section>
                            <SectionHeading
                                icon={Stethoscope}
                                title="Thông tin ca chăm sóc"
                                description="Dịch vụ đã đăng ký và thời gian thực hiện."
                            />

                            <div className="overflow-hidden rounded-2xl border border-teal-100 bg-[#f0f8f9] p-4 sm:p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-white text-[#00677c]">
                                        <HeartPulse className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#00677c]/70">
                                            Dịch vụ đăng ký
                                        </p>

                                        <h3 className="mt-1 break-words text-base font-extrabold leading-snug text-slate-900 sm:text-lg">
                                            {appointment.service}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                    <ScheduleItem
                                        icon={CalendarDays}
                                        label="Ngày chăm sóc"
                                        value={appointment.date}
                                    />

                                    <ScheduleItem
                                        icon={Clock}
                                        label="Khung giờ"
                                        value={appointment.time}
                                        highlight
                                    />

                                    <ScheduleItem
                                        icon={CalendarDays}
                                        label="Thời lượng"
                                        value={appointment.duration}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Người thân được chăm sóc */}
                        <section>
                            <SectionHeading
                                icon={HeartPulse}
                                title="Người thân được chăm sóc"
                                description="Thông tin người nhận dịch vụ."
                            />

                            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 text-lg font-extrabold text-purple-700">
                                    {(appointment.relative || "?").charAt(0)}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="break-words text-sm font-extrabold text-slate-900 sm:text-base">
                                        {appointment.relative || "Chưa cập nhật"}
                                    </p>

                                    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                        <UserRound className="h-3.5 w-3.5 text-slate-400" />
                                        {appointment.relativeAge || "Chưa cập nhật độ tuổi"}
                                    </div>
                                </div>

                                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-500 sm:flex">
                                    <HeartPulse className="h-5 w-5" />
                                </div>
                            </div>
                        </section>

                        {/* Gia đình và điều dưỡng */}
                        <section>
                            <SectionHeading
                                icon={UserRound}
                                title="Thông tin các bên"
                                description="Thông tin liên hệ của gia đình và điều dưỡng phụ trách."
                            />

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <PersonCard
                                    title="Gia đình đặt ca"
                                    name={appointment.family}
                                    subtitle="Người đăng ký dịch vụ"
                                    phone={appointment.familyPhone}
                                    address={appointment.familyAddress}
                                    avatarColor="teal"
                                    icon={UserRound}
                                />

                                <PersonCard
                                    title="Điều dưỡng phụ trách"
                                    name={appointment.caregiver}
                                    subtitle={appointment.caregiverRole}
                                    phone={appointment.caregiverPhone}
                                    avatarColor="sky"
                                    icon={ShieldCheck}
                                />
                            </div>
                        </section>

                        {/* Ghi chú chăm sóc */}
                        <section>
                            <SectionHeading
                                icon={ClipboardList}
                                title="Ghi chú chăm sóc"
                                description="Thông tin gia đình cung cấp để hỗ trợ quá trình chăm sóc."
                            />

                            <div className="rounded-2xl border border-amber-200 bg-[#fffaf0] p-4 sm:p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-600">
                                        <ClipboardList className="h-[18px] w-[18px]" />
                                    </div>

                                    <p className="min-w-0 flex-1 break-words whitespace-pre-line text-xs leading-6 text-slate-700 sm:text-sm">
                                        {appointment.notes || "Chưa có ghi chú chăm sóc."}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Hồ sơ sức khỏe lâm sàng sau ca */}
                        {appointment.healthRecord && (
                            <section>
                                <SectionHeading
                                    icon={Activity}
                                    title="Báo cáo sức khỏe lâm sàng sau ca"
                                    description="Chỉ số sinh hiệu và diễn biến sức khỏe do điều dưỡng ghi nhận sau ca."
                                />

                                <div className="overflow-hidden rounded-2xl border border-teal-200 bg-[#f4fbfa]">
                                    <div className="flex flex-col gap-2 border-b border-teal-200/70 bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-[#00677c]">
                                            <HeartPulse className="h-4 w-4 text-rose-500" />
                                            <span>Hồ sơ y tế điện tử CareLink</span>
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#00677c]">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                                            Đã nghiệm thu lâm sàng
                                        </span>
                                    </div>

                                    <div className="p-4 sm:p-5 space-y-4">
                                        {/* Lưới chỉ số sinh hiệu */}
                                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                            <div className="rounded-xl border border-teal-100 bg-white p-3 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Huyết áp</p>
                                                <p className="mt-1 text-base font-black text-slate-800">
                                                    {appointment.healthRecord.bloodPressureSystolic && appointment.healthRecord.bloodPressureDiastolic
                                                        ? `${appointment.healthRecord.bloodPressureSystolic}/${appointment.healthRecord.bloodPressureDiastolic}`
                                                        : "---"}
                                                </p>
                                                <p className="text-[10px] text-slate-400">mmHg</p>
                                            </div>

                                            <div className="rounded-xl border border-teal-100 bg-white p-3 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nhịp tim</p>
                                                <p className="mt-1 text-base font-black text-rose-600">
                                                    {appointment.healthRecord.heartRate || "---"}
                                                </p>
                                                <p className="text-[10px] text-slate-400">lần/phút (bpm)</p>
                                            </div>

                                            <div className="rounded-xl border border-teal-100 bg-white p-3 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Thân nhiệt</p>
                                                <p className="mt-1 text-base font-black text-amber-600">
                                                    {appointment.healthRecord.temperature ? `${appointment.healthRecord.temperature}°` : "---"}
                                                </p>
                                                <p className="text-[10px] text-slate-400">°C</p>
                                            </div>

                                            <div className="rounded-xl border border-teal-100 bg-white p-3 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Đường huyết</p>
                                                <p className="mt-1 text-base font-black text-teal-700">
                                                    {appointment.healthRecord.bloodGlucose || "---"}
                                                </p>
                                                <p className="text-[10px] text-slate-400">mg/dL</p>
                                            </div>
                                        </div>

                                        {/* Tình trạng chi tiết */}
                                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
                                            <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                                                <p className="font-bold text-slate-600">Tri giác / Tinh thần</p>
                                                <p className="mt-1 text-slate-800 font-medium">{appointment.healthRecord.mentalStatus || "Tỉnh táo, tiếp xúc tốt"}</p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                                                <p className="font-bold text-slate-600">Vận động & Thể trạng</p>
                                                <p className="mt-1 text-slate-800 font-medium">{appointment.healthRecord.mobilityStatus || "Vận động nhẹ tại giường"}</p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                                                <p className="font-bold text-slate-600">Vết thương / Xâm lấn</p>
                                                <p className="mt-1 text-slate-800 font-medium">{appointment.healthRecord.woundStatus || "Không có vết loét/vết mổ"}</p>
                                            </div>
                                        </div>

                                        {/* Ghi chú & dặn dò */}
                                        {appointment.healthRecord.nurseNotes && (
                                            <div className="rounded-xl border border-teal-100 bg-white p-3.5 text-xs">
                                                <p className="font-bold text-[#00677c] mb-1">Nhật ký chăm sóc & Dặn dò của điều dưỡng:</p>
                                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{appointment.healthRecord.nurseNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Khiếu nại */}
                        {appointment.dispute && (
                            <section>
                                <SectionHeading
                                    icon={AlertTriangle}
                                    title="Thông tin khiếu nại"
                                    description="Nội dung phản ánh và trạng thái xử lý của ca chăm sóc."
                                />

                                <div className="overflow-hidden rounded-2xl border border-rose-200 bg-[#fff7f8]">
                                    <div className="flex flex-col gap-3 border-b border-rose-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600">
                                                <AlertTriangle className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="break-words text-sm font-extrabold text-rose-950">
                                                    {appointment.dispute.code}
                                                </p>

                                                <p className="mt-1 text-[11px] text-rose-700">
                                                    Tiếp nhận: {appointment.dispute.createdAt}
                                                </p>
                                            </div>
                                        </div>

                                        <span className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                                            appointment.dispute.status === "Đã giải quyết"
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : appointment.dispute.status === "Bác bỏ"
                                                ? "border-slate-300 bg-slate-100 text-slate-700"
                                                : "border-rose-200 bg-white text-rose-700"
                                        }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${
                                                appointment.dispute.status === "Đã giải quyết"
                                                    ? "bg-emerald-500"
                                                    : appointment.dispute.status === "Bác bỏ"
                                                    ? "bg-slate-400"
                                                    : "bg-rose-500"
                                            }`} />
                                            {appointment.dispute.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3 p-4 sm:p-5">
                                        <div className="rounded-xl border border-rose-100 bg-white p-4">
                                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">
                                                Nội dung phản ánh từ gia đình
                                            </p>

                                            <p className="mt-2 break-words text-xs leading-6 text-slate-700 sm:text-sm">
                                                “{appointment.dispute.reason}”
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-2.5 rounded-xl border border-rose-200/80 bg-rose-50 p-3.5">
                                            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />

                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold text-rose-900">
                                                    Trạng thái xử lý
                                                </p>

                                                <p className="mt-1 break-words text-xs leading-relaxed text-rose-800">
                                                    {appointment.dispute.statusNote}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Khu vực đối soát & phán quyết của Admin */}
                                        {appointment.dispute.status !== "Đã giải quyết" && appointment.dispute.status !== "Bác bỏ" && (
                                            <div className="mt-3 border-t border-rose-200/80 pt-3">
                                                {!isResolving ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsResolving(true)}
                                                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 shadow-sm transition hover:bg-rose-100"
                                                    >
                                                        <ShieldCheck className="h-4 w-4 text-rose-600" />
                                                        Tiến hành xử lý & phán quyết khiếu nại này
                                                    </button>
                                                ) : (
                                                    <div className="rounded-xl border border-rose-200 bg-white p-4 space-y-3.5">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs font-bold text-slate-800">
                                                                Phán quyết khiếu nại (Admin Backoffice)
                                                            </p>
                                                            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                                                                ResolveDisputeDto
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <button
                                                                type="button"
                                                                onClick={() => setResolveType(1)}
                                                                className={`rounded-lg border p-2.5 font-bold transition text-left ${
                                                                    resolveType === 1
                                                                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                                    Chấp nhận hoàn tiền
                                                                </div>
                                                                <p className="text-[10px] font-normal text-slate-500">Hoàn lại tiền cho gia đình</p>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => setResolveType(2)}
                                                                className={`rounded-lg border p-2.5 font-bold transition text-left ${
                                                                    resolveType === 2
                                                                        ? "border-slate-700 bg-slate-100 text-slate-900"
                                                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                                                                    Bác bỏ khiếu nại
                                                                </div>
                                                                <p className="text-[10px] font-normal text-slate-500">Từ chối khiếu nại không hợp lệ</p>
                                                            </button>
                                                        </div>

                                                        {resolveType === 1 && (
                                                            <div>
                                                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                                    Số tiền hoàn trả (VNĐ)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={refundAmount}
                                                                    onChange={(e) => setRefundAmount(e.target.value)}
                                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#00677c] focus:outline-none"
                                                                    placeholder="500000"
                                                                />
                                                            </div>
                                                        )}

                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                                                Ghi chú đối soát & Lý do phán quyết <span className="text-rose-500">*</span>
                                                            </label>
                                                            <textarea
                                                                rows={2}
                                                                value={resolveNote}
                                                                onChange={(e) => setResolveNote(e.target.value)}
                                                                placeholder="Ví dụ: Đã đối soát camera và xác nhận điều dưỡng vắng mặt 15 phút. Đồng ý hoàn 50% chi phí cho gia đình..."
                                                                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-[#00677c] focus:outline-none"
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-end gap-2 pt-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsResolving(false)}
                                                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                                                            >
                                                                Hủy
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleConfirmResolution}
                                                                className="rounded-lg bg-[#00677c] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#005565] transition"
                                                            >
                                                                Xác nhận kết luận
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Đánh giá hai chiều */}
                        {(appointment.familyReview || appointment.caregiverReview) && (
                            <section>
                                <SectionHeading
                                    icon={Star}
                                    title="Đánh giá hai chiều"
                                    description="Phản hồi sau ca chăm sóc từ gia đình và điều dưỡng."
                                />

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <ReviewCard
                                        title="Gia đình đánh giá"
                                        review={appointment.familyReview}
                                    />

                                    <ReviewCard
                                        title="Điều dưỡng đánh giá"
                                        review={appointment.caregiverReview}
                                    />
                                </div>
                            </section>
                        )}

                        {/* Tổng thanh toán */}
                        <section className="overflow-hidden rounded-2xl border border-teal-200 bg-white">
                            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-[#00677c]">
                                        <Wallet className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            Tổng thanh toán
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Giá trị của ca chăm sóc
                                        </p>
                                    </div>
                                </div>

                                <div className="sm:text-right">
                                    <p className="break-words text-2xl font-black tracking-tight text-[#00677c]">
                                        {appointment.totalAmount}
                                    </p>

                                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        CareLink
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* ───────────────── FOOTER ───────────────── */}
                <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-[#00677c]" />

                            <span>Thông tin hồ sơ ca chăm sóc</span>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#00677c] bg-[#00677c] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:border-[#005565] hover:bg-[#005565] focus:outline-none focus:ring-2 focus:ring-[#00677c]/30 focus:ring-offset-2 sm:w-auto"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Đã xem, đóng cửa sổ
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}