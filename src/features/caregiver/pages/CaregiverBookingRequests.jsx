import React, { useState } from "react";

/* ─── Mock booking data — sẽ thay bằng API ─── */
const MOCK_BOOKINGS = [
    {
        id: "BK-20260918-001",
        status: "pending",
        requestedAt: "18/09/2026 · 08:32",
        family: {
            name: "Nguyễn Thị Lan",
            phone: "0901 234 567",
            address: "15 Nguyễn Trãi, Quận 1, TP.HCM",
            rating: 4.8,
            totalSessions: 12,
        },
        patient: {
            name: "Nguyễn Văn An",
            age: 78,
            gender: "Nam",
            condition: "Tai biến mạch máu não (phục hồi giai đoạn 2)",
            mobility: "Cần hỗ trợ di chuyển",
            allergies: "Penicillin",
            notes: "Bệnh nhân đang uống thuốc chống đông máu. Cần theo dõi huyết áp 2 lần/ngày.",
        },
        service: {
            type: "Chăm sóc người cao tuổi",
            date: "20/09/2026",
            time: "07:00 – 11:00",
            duration: "4 giờ",
            fee: "480.000 VNĐ",
            tasks: ["Hỗ trợ vệ sinh cá nhân", "Cho ăn và uống thuốc", "Vật lý trị liệu nhẹ", "Theo dõi huyết áp"],
        },
    },
    {
        id: "BK-20260918-002",
        status: "pending",
        requestedAt: "18/09/2026 · 10:15",
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
            date: "21/09/2026",
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
        status: "accepted",
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
    pending:  { label: "Chờ xác nhận", bg: "bg-amber-50",   text: "text-amber-600",  dot: "bg-amber-400",  border: "border-amber-200" },
    accepted: { label: "Đã chấp nhận", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500", border: "border-emerald-200" },
    rejected: { label: "Đã từ chối",   bg: "bg-red-50",     text: "text-red-500",    dot: "bg-red-400",    border: "border-red-200" },
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
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1">⚠ Lưu ý quan trọng</p>
                        <p className="text-xs text-amber-800 leading-relaxed">{patient.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Full Booking Card ─── */
function BookingCard({ booking, onAccept, onReject }) {
    const { id, status, requestedAt, family, patient, service } = booking;
    const s = STATUS_MAP[status];
    const isPending = status === "pending";

    return (
        <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${isPending ? "border-slate-200 hover:shadow-md" : "border-slate-100 opacity-80"}`}>
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
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00677c] text-white text-sm font-bold hover:bg-[#005263] active:scale-[0.98] transition-all shadow-sm hover:shadow-lg hover:shadow-[#00677c30]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                Chấp nhận ca
                            </button>
                            <button
                                id={`reject-${id}`}
                                onClick={() => onReject(id)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border-2 border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 hover:border-red-300 active:scale-[0.98] transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Từ chối
                            </button>
                        </div>
                    )}

                    {!isPending && (
                        <div className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold ${
                            status === "accepted" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                        }`}>
                            {status === "accepted" ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Đã chấp nhận ca
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Đã từ chối
                                </>
                            )}
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
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
    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    const [filter, setFilter] = useState("pending"); // "all" | "pending" | "accepted" | "rejected"

    const handleAccept = (id) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "accepted" } : b))
        );
    };

    const handleReject = (id) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
        );
    };

    const counts = {
        all:      bookings.length,
        pending:  bookings.filter((b) => b.status === "pending").length,
        accepted: bookings.filter((b) => b.status === "accepted").length,
        rejected: bookings.filter((b) => b.status === "rejected").length,
    };

    const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

    const TABS = [
        { key: "pending",  label: "Chờ xác nhận" },
        { key: "all",      label: "Tất cả" },
        { key: "accepted", label: "Đã chấp nhận" },
        { key: "rejected", label: "Đã từ chối" },
    ];

    return (
        <div className="p-5 sm:p-8 max-w-6xl mx-auto animate-page-enter">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#102030]">Booking Requests</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Xem xét và phản hồi yêu cầu đặt lịch từ các gia đình.
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
            {filtered.length === 0 ? (
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
                            onReject={handleReject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
