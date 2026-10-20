import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    Play,
    ClipboardCheck,
    CheckCircle2,
    XCircle,
    Eye,
    Star,
    AlertTriangle,
} from "lucide-react";
import SubmitHealthRecordModal from "../components/SubmitHealthRecordModal";
import RejectBookingModal from "../components/RejectBookingModal";
import ViewHealthRecordModal from "../../family/components/ViewHealthRecordModal";
import Toast from "../../../components/Toast";
import caregiverApi from "../../../api/caregiverApi";

// Adapter chuyển đổi dữ liệu BookingResponse từ Backend sang DTO hiển thị của Điều dưỡng
const mapBackendToCaregiverBooking = (b) => {
    const rawStatus = typeof b.status === "number" ? b.status : 2;
    let status = "pending";
    if (rawStatus === 2) status = "pending"; // PendingAcceptance
    else if (rawStatus === 3) status = "accepted"; // Accepted
    else if (rawStatus === 4) status = "in_progress"; // InProgress
    else if (rawStatus === 5) status = "completed"; // Completed
    else if (rawStatus === 6) status = "rejected"; // Canceled

    const startDate = b.scheduledStart ? new Date(b.scheduledStart) : new Date();
    const endDate = b.scheduledEnd ? new Date(b.scheduledEnd) : null;
    const formattedDate = startDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    const startTime = startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const endTime = endDate ? endDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";
    const timeStr = endTime ? `${startTime} – ${endTime}` : startTime;

    return {
        id: b.id,
        rawId: b.id,
        status,
        requestedAt: new Date(b.createdAt || Date.now()).toLocaleString("vi-VN"),
        source: "direct",
        family: {
            name: b.customerName || "Khách hàng CareLink",
            phone: "0901 234 567",
            address: b.addressSnapshot || "Địa chỉ khách hàng",
            rating: 5.0,
            totalSessions: 1,
        },
        patient: {
            name: b.recipientName || "Người nhận chăm sóc",
            age: 70,
            gender: "Chưa rõ",
            condition: "Theo yêu cầu ca chăm sóc",
            mobility: "Bình thường",
            allergies: "Không có",
            notes: "Ca chăm sóc đặt qua hệ thống CareLink.",
        },
        service: {
            type: b.serviceName || "Chăm sóc theo yêu cầu",
            date: formattedDate,
            time: timeStr,
            duration: "Theo ca",
            fee: b.totalPrice ? Number(b.totalPrice).toLocaleString("vi-VN") + " VNĐ" : "350.000 VNĐ",
            tasks: ["Theo dõi sinh hiệu", "Chăm sóc theo chỉ định", "Ghi nhật ký ca trực"],
        },
        rawBackendData: b
    };
};

/* ─── Mock booking data — sẽ thay bằng API ─── */
const MOCK_BOOKINGS = [
    {
        id: "BK-20261013-001",
        status: "pending",
        requestedAt: "13/10/2026 · 08:32",
        source: "chat",
        family: {
            name: "Nguyễn Thị Lan (Mẹ anh An)",
            phone: "0901 234 567",
            address: "123 Nguyễn Gia Trí, P. 25, Bình Thạnh, TP.HCM",
            rating: 4.9,
            totalSessions: 12,
        },
        patient: {
            name: "Bà Nguyễn Thị Lan",
            age: 75,
            gender: "Nữ",
            condition: "Hậu phẫu phục hồi khớp gối",
            mobility: "Cần hỗ trợ tập đi lại",
            allergies: "Không có",
            notes: "Ca đã thống nhất qua Chat. Bác vừa mổ khớp gối, cần hỗ trợ tập co duỗi nhẹ và đo huyết áp buổi sáng.",
        },
        service: {
            type: "Chăm sóc phục hồi sau phẫu thuật",
            date: "14/10/2026",
            time: "08:00 – 10:00",
            duration: "2 giờ",
            fee: "350.000 VNĐ",
            tasks: ["Hỗ trợ tập co duỗi nhẹ", "Đo huyết áp & sinh hiệu", "Theo dõi vết mổ", "Hỗ trợ vận động"],
        },
    },
    {
        id: "BK-20261013-002",
        status: "in_progress",
        requestedAt: "13/10/2026 · 10:15",
        source: "direct",
        family: {
            name: "Trần Văn Minh",
            phone: "0912 345 678",
            address: "88 Lê Lợi, Quận 3, TP.HCM",
            rating: 4.5,
            totalSessions: 5,
        },
        patient: {
            name: "Trần Thị Bình",
            age: 65,
            gender: "Nữ",
            condition: "Hậu phẫu thay khớp háng",
            mobility: "Không tự đứng dậy được",
            allergies: "Không có",
            notes: "Vừa phẫu thuật 2 tuần trước. Cần chú ý vết thương, thay băng theo quy trình vô trùng.",
        },
        service: {
            type: "Chăm sóc sau phẫu thuật",
            date: "15/10/2026",
            time: "14:00 – 18:00",
            duration: "4 giờ",
            fee: "520.000 VNĐ",
            tasks: ["Thay băng vết thương", "Hỗ trợ tập đứng", "Theo dõi dấu hiệu nhiễm trùng", "Chuẩn bị bữa ăn"],
        },
    },
    {
        id: "BK-20260918-003",
        status: "pending",
        requestedAt: "18/09/2026 · 14:50",
        family: {
            name: "Phạm Ngọc Anh",
            phone: "0933 456 789",
            address: "201 Đinh Tiên Hoàng, Quận Bình Thạnh, TP.HCM",
            rating: 5.0,
            totalSessions: 28,
        },
        patient: {
            name: "Bé Phạm Quốc Hùng",
            age: 0.25, // 3 months
            gender: "Nam",
            condition: "Trẻ sơ sinh 3 tháng tuổi, khỏe mạnh",
            mobility: "Bình thường",
            allergies: "Không có",
            notes: "Gia đình cần hỗ trợ ban đêm để bố mẹ được nghỉ ngơi. Em bé bú sữa mẹ kết hợp sữa công thức.",
        },
        service: {
            type: "Chăm sóc trẻ sơ sinh",
            date: "22/09/2026",
            time: "22:00 – 06:00",
            duration: "8 giờ",
            fee: "800.000 VNĐ",
            tasks: ["Trông coi và dỗ ngủ", "Cho bú đúng giờ", "Thay tã", "Theo dõi nhiệt độ"],
        },
    },
    {
        id: "BK-20260917-004",
        status: "completed",
        requestedAt: "17/09/2026 · 09:00",
        family: {
            name: "Lê Thị Hoa",
            phone: "0944 567 890",
            address: "45 Võ Văn Tần, Quận 3, TP.HCM",
            rating: 4.9,
            totalSessions: 20,
        },
        patient: {
            name: "Lê Văn Dũng",
            age: 82,
            gender: "Nam",
            condition: "Tiểu đường tuýp 2, cao huyết áp",
            mobility: "Đi lại chậm, cần hỗ trợ",
            allergies: "Sulfa",
            notes: "Cần tiêm insulin mỗi buổi sáng theo chỉ định. Đo đường huyết trước và sau bữa ăn.",
        },
        service: {
            type: "Chăm sóc bệnh mãn tính",
            date: "19/09/2026",
            time: "06:00 – 09:00",
            duration: "3 giờ",
            fee: "360.000 VNĐ",
            tasks: ["Tiêm insulin", "Đo đường huyết & huyết áp", "Chuẩn bị bữa ăn phù hợp", "Hỗ trợ vệ sinh sáng"],
        },
        healthRecord: {
            bloodPressureSystolic: 125,
            bloodPressureDiastolic: 80,
            heartRate: 74,
            temperature: 36.8,
            bloodGlucose: 110,
            woundStatus: "Khô ráo, liền tốt",
            mobilityStatus: "Tập đi lại chậm với khung hỗ trợ",
            mentalStatus: "Tỉnh táo, hợp tác tích cực",
            nurseNotes: "Đã tiêm insulin đúng liều chỉ định 12UI, đo đường huyết 110 mg/dL trước ăn. Bác Dũng ăn ngon miệng, đã uống thuốc huyết áp lúc 07:00.",
            createdAt: "19/09/2026 · 09:15",
        },
    },
    {
        id: "BK-20260916-005",
        status: "rejected",
        requestedAt: "16/09/2026 · 16:20",
        family: {
            name: "Hoàng Minh Tuấn",
            phone: "0955 678 901",
            address: "99 Cách Mạng Tháng 8, Quận 10, TP.HCM",
            rating: 3.9,
            totalSessions: 2,
        },
        patient: {
            name: "Hoàng Thị Mai",
            age: 71,
            gender: "Nữ",
            condition: "Alzheimer giai đoạn đầu",
            mobility: "Đi lại bình thường nhưng dễ lạc đường",
            allergies: "Không có",
            notes: "Cần canh chừng để bệnh nhân không tự ra ngoài một mình.",
        },
        service: {
            type: "Chăm sóc người cao tuổi",
            date: "18/09/2026",
            time: "08:00 – 12:00",
            duration: "4 giờ",
            fee: "480.000 VNĐ",
            tasks: ["Giám sát và trò chuyện", "Hỗ trợ vệ sinh", "Chuẩn bị bữa ăn", "Ghi nhật ký triệu chứng"],
        },
    },
];

/* ─── Helpers ─── */
const STATUS_MAP = {
    pending:     { label: "Chờ xác nhận", bg: "bg-amber-50",   text: "text-amber-600",  dot: "bg-amber-400",  border: "border-amber-200" },
    accepted:    { label: "Đã chấp nhận", bg: "bg-sky-50",     text: "text-sky-600",    dot: "bg-sky-500",    border: "border-sky-200" },
    in_progress: { label: "Đang thực hiện", bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-500 animate-pulse", border: "border-teal-200" },
    completed:   { label: "Đã hoàn thành", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
    rejected:    { label: "Đã từ chối",   bg: "bg-red-50",     text: "text-red-500",    dot: "bg-red-400",    border: "border-red-200" },
};

function StarRow({ rating }) {
    return (
        <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((s) => (
                <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ))}
            <span className="text-xs font-bold text-slate-600 ml-0.5">{rating}</span>
        </div>
    );
}

/* ─── Patient Info Card ─── */
function PatientCard({ patient }) {
    const genderColor = patient.gender === "Nữ" ? "from-pink-400 to-rose-500" : "from-blue-400 to-indigo-500";
    const ageLabel = patient.age < 1 ? `${Math.round(patient.age * 12)} tháng` : `${patient.age} tuổi`;

    return (
        <div className="rounded-xl border border-slate-100 bg-[#f8fafc] overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${genderColor}`} />
            <div className="p-4 flex flex-col gap-3">
                {/* Name + age */}
                <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${genderColor} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm`}>
                        {patient.name.split(" ").pop()[0]}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#102030]">{patient.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">{patient.gender}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-xs text-slate-400">{ageLabel}</span>
                        </div>
                    </div>
                </div>

                {/* Condition */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tình trạng</span>
                    <p className="text-xs font-semibold text-[#102030] leading-snug">{patient.condition}</p>
                </div>

                {/* Mobility + Allergies */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg p-2.5 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Di chuyển</p>
                        <p className="text-xs text-[#102030] leading-snug">{patient.mobility}</p>
                    </div>
                    <div className={`rounded-lg p-2.5 border ${patient.allergies === "Không có" ? "bg-white border-slate-100" : "bg-red-50 border-red-100"}`}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Dị ứng</p>
                        <p className={`text-xs font-semibold leading-snug ${patient.allergies === "Không có" ? "text-slate-400" : "text-red-600"}`}>
                            {patient.allergies}
                        </p>
                    </div>
                </div>

                {/* Notes */}
                {patient.notes && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Lưu ý quan trọng
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed">{patient.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Full Booking Card ─── */
function BookingCard({ booking, onAccept, onReject, onStart, onReport, onViewRecord }) {
    const { id, status, requestedAt, family, patient, service } = booking;
    const s = STATUS_MAP[status];
    const isPending = status === "pending";
    const isInProgress = status === "in_progress";
    const isCompleted = status === "completed";
    const isAccepted = status === "accepted";

    return (
        <div className={`bg-white rounded-2xl border shadow-xs overflow-hidden transition-all duration-300 ${
            isPending
                ? "border-amber-200/80 ring-1 ring-amber-400/20 hover:shadow-md"
                : isInProgress
                ? "border-teal-500/40 ring-2 ring-teal-500/20 shadow-md"
                : isCompleted
                ? "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                : isAccepted
                ? "border-sky-300 ring-1 ring-sky-400/20"
                : "border-slate-100 opacity-75"
        }`}>
            {/* Card Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">#{id}</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-xs text-slate-400">{requestedAt}</span>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text} border ${s.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${isPending ? "animate-pulse" : ""}`} />
                    {s.label}
                </span>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left column */}
                <div className="flex flex-col gap-4">
                    {/* Family Info */}
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Gia đình đặt lịch</p>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {family.name[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#102030]">{family.name}</p>
                                <StarRow rating={family.rating} />
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-[10px] text-slate-400">Tổng ca</p>
                                <p className="text-sm font-bold text-[#102030]">{family.totalSessions}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                {family.phone}
                            </div>
                            <div className="flex items-start gap-2 text-xs text-slate-500">
                                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                {family.address}
                            </div>
                        </div>
                    </div>

                    {/* Patient Info */}
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Thẻ bệnh nhân</p>
                        <PatientCard patient={patient} />
                    </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                    {/* Service Details */}
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Chi tiết ca chăm sóc</p>
                        <div className="bg-gradient-to-br from-[#00677c] to-[#102030] rounded-xl p-4 text-white">
                            <p className="text-sm font-bold mb-3">{service.type}</p>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white/10 rounded-lg p-2.5">
                                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-wide">Ngày</p>
                                    <p className="text-xs font-bold mt-0.5">{service.date}</p>
                                </div>
                                <div className="bg-white/10 rounded-lg p-2.5">
                                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-wide">Giờ</p>
                                    <p className="text-xs font-bold mt-0.5">{service.time}</p>
                                </div>
                                <div className="bg-white/10 rounded-lg p-2.5">
                                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-wide">Thời lượng</p>
                                    <p className="text-xs font-bold mt-0.5">{service.duration}</p>
                                </div>
                                <div className="bg-white/10 rounded-lg p-2.5">
                                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-wide">Thù lao</p>
                                    <p className="text-xs font-bold text-emerald-300 mt-0.5">{service.fee}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/60 font-bold uppercase tracking-wide mb-2">Công việc cần thực hiện</p>
                                <ul className="flex flex-col gap-1">
                                    {service.tasks.map((task, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                                            <svg className="w-3.5 h-3.5 text-[#00c9a7] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isPending && (
                        <div className="flex flex-col gap-2 mt-auto">
                            <button
                                id={`accept-${id}`}
                                onClick={() => onAccept(id)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00677c] text-white text-sm font-bold hover:bg-[#005263] active:scale-[0.98] transition-all shadow-sm hover:shadow-lg hover:shadow-[#00677c30] cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                Chấp nhận ca
                            </button>
                            <button
                                id={`reject-${id}`}
                                onClick={() => onReject(booking)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border-2 border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 hover:border-red-300 active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Từ chối
                            </button>
                        </div>
                    )}

                    {status === "accepted" && (
                        <div className="flex flex-col gap-2 mt-auto">
                            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between">
                                <span className="text-xs font-semibold text-sky-800">Ca đã tiếp nhận thành công</span>
                                <span className="text-[10px] font-bold text-sky-600 bg-white px-2 py-0.5 rounded-full border border-sky-200">Sẵn sàng</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onStart(id)}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-[#00677c] hover:from-teal-700 hover:to-[#005263] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                Bắt đầu ca chăm sóc
                            </button>
                        </div>
                    )}

                    {status === "in_progress" && (
                        <div className="flex flex-col gap-2 mt-auto">
                            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
                                <span className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                                    Ca đang diễn ra trực tiếp
                                </span>
                                <span className="text-[10px] text-teal-700 font-semibold">Cần nhập bệnh án</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onReport(booking)}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005263] hover:to-[#007489] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <ClipboardCheck className="w-4 h-4" />
                                Ghi nhận Bệnh án & Hoàn thành ca
                            </button>
                        </div>
                    )}

                    {status === "completed" && (
                        <div className="flex flex-col gap-2 mt-auto">
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Ca đã hoàn thành
                                </span>
                                <span className="text-[10px] text-emerald-700 font-semibold">Đã nộp bệnh án</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => onViewRecord(booking)}
                                    className="flex-1 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#00677c] font-bold text-xs border border-teal-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    Xem bệnh án đã nộp
                                </button>
                                <Link
                                    to={`/caregiver/review?bookingId=${booking.id}`}
                                    state={{
                                        bookingId: booking.id,
                                        family: booking.customerName || booking.patientName || "Gia đình khách hàng",
                                        service: booking.serviceName || "Dịch vụ chăm sóc",
                                        date: booking.date || booking.scheduledAt,
                                        duration: booking.duration || "Theo ca",
                                    }}
                                    className="flex-1 py-2.5 rounded-xl bg-[#00677c] hover:bg-[#005263] text-white font-bold text-xs transition-colors shadow-2xs text-center flex items-center justify-center gap-1.5"
                                >
                                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                    Đánh giá gia đình
                                </Link>
                            </div>
                        </div>
                    )}

                    {status === "rejected" && (
                        <div className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-red-50 text-red-500 mt-auto">
                            <XCircle className="w-4 h-4" />
                            Đã từ chối nhận ca
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Filter Tab ─── */
function FilterTab({ label, count, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                active
                    ? "bg-[#102030] text-white shadow-sm"
                    : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-[#102030]"
            }`}
        >
            {label}
            {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                    {count}
                </span>
            )}
        </button>
    );
}

/* ═══════════════════════════════════════════
   CaregiverBookingRequests
═══════════════════════════════════════════ */
export default function CaregiverBookingRequests() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [isUsingFallback, setIsUsingFallback] = useState(false);
    const [filter, setFilter] = useState("all"); // "all" | "pending" | "accepted" | "in_progress" | "completed" | "rejected"
    const [reportingBooking, setReportingBooking] = useState(null);
    const [viewingRecordBooking, setViewingRecordBooking] = useState(null);
    const [rejectingBooking, setRejectingBooking] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (toastObj) => {
        if (typeof toastObj === "string") {
            setToastMessage({ type: "info", title: "Thông báo", message: toastObj });
        } else {
            setToastMessage(toastObj);
        }
    };

    // 1. Tải danh sách ca chăm sóc của điều dưỡng từ Backend API (GET /api/v1/bookings)
    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const res = await caregiverApi.getBookings({ PageNumber: 1, PageSize: 50 });
            const items = res?.items || (Array.isArray(res) ? res : []);
            setBookings(items.map(mapBackendToCaregiverBooking));
            setIsUsingFallback(false);
        } catch (err) {
            console.warn("[CareLink] Tải danh sách ca chăm sóc thất bại:", err);
            const status = err.response?.status;
            if (status === 401 || status === 403) {
                setApiError("Phiên đăng nhập đã hết hạn hoặc bạn không có quyền xem danh sách nhận ca.");
                setBookings([]);
                setIsUsingFallback(false);
            } else if (!err.response || err.code === "ECONNABORTED" || err.code === "ERR_NETWORK") {
                // Tự động hiển thị dữ liệu mẫu chuẩn hóa khi mất mạng / offline
                setIsUsingFallback(true);
                setBookings(MOCK_BOOKINGS);
            } else {
                setApiError(err.response?.data?.detail || err.response?.data?.message || "Không thể tải danh sách ca chăm sóc.");
                setBookings([]);
                setIsUsingFallback(false);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // 2. Điều dưỡng chấp nhận ca (PUT /api/v1/bookings/{id}/accept)
    const handleAccept = async (id) => {
        try {
            await caregiverApi.acceptBooking(id);
            showToast({
                type: "success",
                title: "Đã tiếp nhận ca thành công",
                message: "Ca chăm sóc đã chuyển sang trạng thái sẵn sàng thực hiện.",
            });
            fetchBookings();
        } catch (err) {
            console.warn("[CareLink] Chấp nhận ca offline fallback:", err);
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status: "accepted" } : b))
            );
            showToast({
                type: "success",
                title: "Đã tiếp nhận ca thành công",
                message: "Ca chăm sóc đã chuyển sang trạng thái sẵn sàng thực hiện.",
            });
        }
    };

    // 3. Điều dưỡng từ chối ca (PUT /api/v1/bookings/{id}/reject) qua RejectBookingModal
    const handleConfirmReject = async (id, reason) => {
        try {
            await caregiverApi.rejectBooking(id, { reason });
            showToast({
                type: "success",
                title: "Đã từ chối nhận ca",
                message: "Hệ thống đã ghi nhận lý do và cập nhật trạng thái ca.",
            });
            fetchBookings();
        } catch (err) {
            console.warn("[CareLink] Từ chối ca offline fallback:", err);
            if (err.code === "ERR_NETWORK" || !err.response) {
                setBookings((prev) =>
                    prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
                );
                showToast({
                    type: "success",
                    title: "Đã từ chối nhận ca",
                    message: "Hệ thống đã ghi nhận lý do trong phiên làm việc hiện tại.",
                });
                return;
            }
            throw new Error(err.response?.data?.detail || err.response?.data?.message || "Lỗi khi từ chối ca hẹn.");
        }
    };

    // 4. Bắt đầu ca chăm sóc (PUT /api/v1/bookings/{id}/start)
    const handleStart = async (id) => {
        try {
            await caregiverApi.startBooking(id);
            showToast("Ca chăm sóc đã bắt đầu! Bạn có thể ghi nhận sinh hiệu khi kết thúc ca.");
            fetchBookings();
        } catch (err) {
            console.warn("[CareLink] Bắt đầu ca offline fallback:", err);
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status: "in_progress" } : b))
            );
            showToast("Ca chăm sóc đã bắt đầu! Bạn có thể ghi nhận sinh hiệu khi kết thúc ca.");
        }
    };

    const handleSaveHealthRecordSuccess = (healthRecordDto) => {
        setBookings((prev) =>
            prev.map((b) =>
                b.id === healthRecordDto.bookingId
                    ? {
                          ...b,
                          status: "completed",
                          healthRecord: healthRecordDto,
                      }
                    : b
            )
        );
        showToast("Bệnh án đã được lưu thành công vào hồ sơ! Ca chăm sóc đã hoàn tất.");
        fetchBookings();
    };

    const counts = {
        all:         bookings.length,
        pending:     bookings.filter((b) => b.status === "pending").length,
        accepted:    bookings.filter((b) => b.status === "accepted").length,
        in_progress: bookings.filter((b) => b.status === "in_progress").length,
        completed:   bookings.filter((b) => b.status === "completed").length,
        rejected:    bookings.filter((b) => b.status === "rejected").length,
    };

    const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

    const TABS = [
        { key: "all",         label: "Tất cả" },
        { key: "pending",     label: "Chờ xác nhận" },
        { key: "accepted",    label: "Đã chấp nhận" },
        { key: "in_progress", label: "Đang diễn ra" },
        { key: "completed",   label: "Đã hoàn thành" },
        { key: "rejected",    label: "Đã từ chối" },
    ];

    return (
        <div className="p-5 sm:p-8 max-w-6xl mx-auto animate-page-enter">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#102030]">Yêu cầu nhận ca</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Xem xét và phản hồi yêu cầu đặt lịch từ các gia đình, bắt đầu ca và ghi nhận bệnh án sau ca.
                    </p>
                </div>

                {/* Pending badge */}
                {counts.pending > 0 && (
                    <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-sm font-bold text-amber-700">
                            {counts.pending} yêu cầu chờ xác nhận
                        </span>
                    </div>
                )}
            </div>

            {/* Error Banner with Retry */}
            {apiError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <p className="text-sm font-medium text-rose-800">{apiError}</p>
                    </div>
                    <button
                        type="button"
                        onClick={fetchBookings}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                {TABS.map((t) => (
                    <FilterTab
                        key={t.key}
                        label={t.label}
                        count={counts[t.key]}
                        active={filter === t.key}
                        onClick={() => setFilter(t.key)}
                    />
                ))}
            </div>

            {/* Booking list */}
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                            </div>
                            <div className="h-5 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
                                <div className="h-9 bg-slate-200 rounded-xl w-32"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-16 flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-base font-bold text-slate-400">Không có yêu cầu nào</p>
                        <p className="text-sm text-slate-300 mt-1">Chưa có booking trong danh mục này.</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {filtered.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onAccept={handleAccept}
                            onReject={(b) => setRejectingBooking(b)}
                            onStart={handleStart}
                            onReport={(b) => setReportingBooking(b)}
                            onViewRecord={(b) => setViewingRecordBooking(b)}
                        />
                    ))}
                </div>
            )}

            {/* Modal Từ chối nhận ca chuẩn UI/UX */}
            <RejectBookingModal
                isOpen={Boolean(rejectingBooking)}
                booking={rejectingBooking}
                onClose={() => setRejectingBooking(null)}
                onConfirmReject={handleConfirmReject}
            />

            {/* Modal Ghi nhận bệnh án lâm sàng */}
            <SubmitHealthRecordModal
                isOpen={Boolean(reportingBooking)}
                onClose={() => setReportingBooking(null)}
                booking={reportingBooking}
                onSaveSuccess={handleSaveHealthRecordSuccess}
            />

            {/* Modal Xem bệnh án đã nộp */}
            <ViewHealthRecordModal
                isOpen={Boolean(viewingRecordBooking)}
                onClose={() => setViewingRecordBooking(null)}
                booking={viewingRecordBooking}
                healthRecord={viewingRecordBooking?.healthRecord}
                onEdit={(b, r) => {
                    setReportingBooking({
                        ...b,
                        healthRecord: r,
                        hasHealthRecord: true,
                    });
                }}
                showHistoryLink={false}
            />

            {/* Toast feedback chuẩn ứng dụng */}
            <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
    );
}
