import React, { useState } from "react";
import {
    Search,
    RotateCcw,
    CalendarClock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    ChevronRight,
    Activity,
} from "lucide-react";
import AppointmentDetailModal from "../components/AppointmentDetailModal";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const initialAppointments = [
    {
        id: "CA-2001",
        family: "Nguyễn Thu Hà",
        familyPhone: "0901 234 567",
        familyAddress: "123 Nguyễn Trãi, P. Bến Thành, Q.1, TP.HCM",
        caregiver: "Lê Hoàng Long",
        caregiverPhone: "0912 345 678",
        caregiverRole: "Điều dưỡng chuyên nghiệp",
        service: "Chăm sóc người cao tuổi",
        date: "23/09/2026",
        time: "08:00 – 16:00",
        duration: "8 giờ",
        status: "Đang thực hiện",
        notes: "Bệnh nhân 78 tuổi, tiểu đường type 2. Cần đo đường huyết 2 lần/ca, hỗ trợ vật lý trị liệu nhẹ.",
        totalAmount: "960.000 ₫",
        relative: "Cụ Nguyễn Văn Sơn",
        relativeAge: "78 tuổi",
    },
    {
        id: "CA-2002",
        family: "Trần Minh Khoa",
        familyPhone: "0977 111 222",
        familyAddress: "45 Lê Lợi, P. Bến Nghé, Q.1, TP.HCM",
        caregiver: "Trần Thị Mai",
        caregiverPhone: "0901 234 567",
        caregiverRole: "Sinh viên Y khoa",
        service: "Theo dõi sức khỏe & sinh hiệu",
        date: "23/09/2026",
        time: "14:00 – 20:00",
        duration: "6 giờ",
        status: "Chờ xác nhận",
        notes: "Bệnh nhân cao huyết áp, cần đo sinh hiệu mỗi 2 giờ và nhắc uống thuốc đúng giờ.",
        totalAmount: "540.000 ₫",
        relative: "Bà Trần Thị Lan",
        relativeAge: "65 tuổi",
    },
    {
        id: "CA-2003",
        family: "Phạm Thị Bích",
        familyPhone: "0933 456 789",
        familyAddress: "78 Võ Văn Tần, P.6, Q.3, TP.HCM",
        caregiver: "Nguyễn Thị Phương Thảo",
        caregiverPhone: "0988 765 432",
        caregiverRole: "Sinh viên Y khoa",
        service: "Chăm sóc sau phẫu thuật",
        date: "22/09/2026",
        time: "06:00 – 14:00",
        duration: "8 giờ",
        status: "Hoàn thành",
        notes: "Bệnh nhân mới phẫu thuật thay khớp háng. Thay băng 1 lần/ca, hỗ trợ di chuyển nhẹ nhàng.",
        totalAmount: "960.000 ₫",
        relative: "Ông Phạm Quốc Bình",
        relativeAge: "72 tuổi",
    },
    {
        id: "CA-2004",
        family: "Lê Văn Dũng",
        familyPhone: "0966 333 444",
        familyAddress: "210 Hoàng Diệu, P.8, Q.4, TP.HCM",
        caregiver: "Phạm Quốc Huy",
        caregiverPhone: "0933 456 789",
        caregiverRole: "Điều dưỡng chuyên nghiệp",
        service: "Phục hồi chức năng",
        date: "21/09/2026",
        time: "09:00 – 13:00",
        duration: "4 giờ",
        status: "Đã hủy",
        notes: "Gia đình hủy do bệnh nhân phải nhập viện khẩn cấp.",
        totalAmount: "480.000 ₫",
        relative: "Bà Lê Thị Hoa",
        relativeAge: "68 tuổi",
    },
    {
        id: "CA-2005",
        family: "Võ Thị Thanh",
        familyPhone: "0944 555 666",
        familyAddress: "55 Đinh Tiên Hoàng, P. Đa Kao, Q.1, TP.HCM",
        caregiver: "Vũ Thị Bích Trâm",
        caregiverPhone: "0977 112 233",
        caregiverRole: "Sinh viên Y khoa",
        service: "Đồng hành hỗ trợ sinh hoạt",
        date: "20/09/2026",
        time: "07:00 – 15:00",
        duration: "8 giờ",
        status: "Có khiếu nại",
        notes: "Gia đình phản ánh điều dưỡng đến muộn 45 phút và không thực hiện đúng gói dịch vụ đã đăng ký.",
        totalAmount: "720.000 ₫",
        relative: "Cụ Võ Văn Nam",
        relativeAge: "82 tuổi",
    },
    {
        id: "CA-2006",
        family: "Hoàng Minh Tuấn",
        familyPhone: "0911 777 888",
        familyAddress: "300 Trần Hưng Đạo, P. Cầu Kho, Q.1, TP.HCM",
        caregiver: "Lê Hoàng Long",
        caregiverPhone: "0912 345 678",
        caregiverRole: "Điều dưỡng chuyên nghiệp",
        service: "Theo dõi sức khỏe & sinh hiệu",
        date: "24/09/2026",
        time: "08:00 – 12:00",
        duration: "4 giờ",
        status: "Chờ xác nhận",
        notes: "Bệnh nhân COPD. Cần theo dõi SpO2 liên tục và hỗ trợ xông khí dung.",
        totalAmount: "360.000 ₫",
        relative: "Ông Hoàng Văn Phúc",
        relativeAge: "75 tuổi",
    },
    {
        id: "CA-2007",
        family: "Bùi Thị Lan",
        familyPhone: "0955 123 456",
        familyAddress: "17 Pasteur, P. Nguyễn Thái Bình, Q.1, TP.HCM",
        caregiver: "Trần Thị Mai",
        caregiverPhone: "0901 234 567",
        caregiverRole: "Sinh viên Y khoa",
        service: "Chăm sóc người cao tuổi",
        date: "22/09/2026",
        time: "06:00 – 18:00",
        duration: "12 giờ",
        status: "Hoàn thành",
        notes: "Ca chăm sóc dài ngày. Bệnh nhân mất trí nhớ nhẹ, cần giám sát hoạt động sinh hoạt và nhắc ăn uống.",
        totalAmount: "1.440.000 ₫",
        relative: "Bà Bùi Thị Nga",
        relativeAge: "80 tuổi",
    },
];

// ── STATUS CONFIG ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    "Chờ xác nhận": {
        dot: "bg-amber-500",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        card: "bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20",
        icon: <Clock className="w-4.5 h-4.5" strokeWidth={2.2} />,
        iconBg: "bg-amber-100 text-amber-700",
        label: "Chờ xác nhận",
    },
    "Đang thực hiện": {
        dot: "bg-blue-500 animate-pulse",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        card: "bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/20",
        icon: <Activity className="w-4.5 h-4.5" strokeWidth={2.2} />,
        iconBg: "bg-blue-100 text-blue-700",
        label: "Đang thực hiện",
    },
    "Hoàn thành": {
        dot: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        card: "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20",
        icon: <CheckCircle2 className="w-4.5 h-4.5" strokeWidth={2.2} />,
        iconBg: "bg-emerald-100 text-emerald-700",
        label: "Hoàn thành",
    },
    "Đã hủy": {
        dot: "bg-slate-400",
        badge: "bg-slate-100 text-slate-600 border-slate-300",
        card: "bg-slate-100/80 border-slate-300 ring-2 ring-slate-300/20",
        icon: <XCircle className="w-4.5 h-4.5" strokeWidth={2.2} />,
        iconBg: "bg-slate-200 text-slate-600",
        label: "Đã hủy",
    },
    "Có khiếu nại": {
        dot: "bg-rose-500",
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        card: "bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/20",
        icon: <AlertCircle className="w-4.5 h-4.5" strokeWidth={2.2} />,
        iconBg: "bg-rose-100 text-rose-700",
        label: "Có khiếu nại",
    },
};


// ── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function AdminAppointments() {
    const [appointments] = useState(initialAppointments);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const countByStatus = (s) => appointments.filter((a) => a.status === s).length;

    const filtered = appointments.filter((a) => {
        const q = searchQuery.toLowerCase();
        const matchSearch =
            a.family.toLowerCase().includes(q) ||
            a.caregiver.toLowerCase().includes(q) ||
            a.id.toLowerCase().includes(q) ||
            a.service.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || a.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const summaryCards = [
        { label: "Chờ xác nhận", status: "Chờ xác nhận" },
        { label: "Đang thực hiện", status: "Đang thực hiện" },
        { label: "Hoàn thành", status: "Hoàn thành" },
        { label: "Đã hủy", status: "Đã hủy" },
        { label: "Có khiếu nại", status: "Có khiếu nại" },
    ];

    return (
        <div className="space-y-6 pb-12 font-sans">
            {/* Modal chi tiết ca trực — component tách riêng tại admin/components/ */}
            {selectedAppointment && (
                <AppointmentDetailModal
                    appointment={selectedAppointment}
                    statusConfig={STATUS_CONFIG}
                    onClose={() => setSelectedAppointment(null)}
                />
            )}

            {/* ── HEADER ── */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Giám sát Lịch hẹn & Ca trực
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                <Activity className="w-3 h-3 animate-pulse" />
                                {countByStatus("Đang thực hiện")} ca đang chạy
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Theo dõi toàn bộ lịch đặt trong hệ thống CareLink. Lọc theo trạng thái và xem chi tiết từng ca chăm sóc.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl shrink-0">
                        <CalendarClock className="w-4 h-4 text-[#00677c]" />
                        <span>Tổng: <strong className="text-slate-800">{appointments.length} ca</strong></span>
                    </div>
                </div>
            </div>

            {/* ── SUMMARY CARDS ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {summaryCards.map(({ label, status }) => {
                    const sc = STATUS_CONFIG[status];
                    const count = countByStatus(status);
                    const isActive = statusFilter === status;
                    return (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setStatusFilter(isActive ? "all" : status)}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                isActive
                                    ? sc.card
                                    : "bg-white border-slate-200/90 hover:shadow-xs hover:border-slate-300"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${sc.iconBg}`}>
                                    {sc.icon}
                                </span>
                            </div>
                            <div className="text-2xl font-black text-slate-900">{count}</div>
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-tight">{label}</p>
                        </button>
                    );
                })}
            </div>

            {/* ── SEARCH & FILTER BAR ── */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center gap-3">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm theo tên gia đình, điều dưỡng, mã ca, dịch vụ..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-slate-500">
                        Hiển thị <strong className="text-slate-800">{filtered.length}</strong> ca
                    </span>
                    {(searchQuery || statusFilter !== "all") && (
                        <button
                            type="button"
                            onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                            className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Đặt lại
                        </button>
                    )}
                </div>
            </div>

            {/* ── DATA TABLE ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="py-3.5 px-4 sm:px-6">Mã ca</th>
                                <th className="py-3.5 px-4">Gia đình</th>
                                <th className="py-3.5 px-4">Điều dưỡng</th>
                                <th className="py-3.5 px-4">Dịch vụ</th>
                                <th className="py-3.5 px-4">Ngày & Giờ</th>
                                <th className="py-3.5 px-4">Trạng thái</th>
                                <th className="py-3.5 px-4 sm:px-6 text-right">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-slate-400">
                                        <CalendarClock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p className="font-semibold">Không tìm thấy ca nào phù hợp</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((a) => {
                                    const sc = STATUS_CONFIG[a.status];
                                    return (
                                        <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                                            {/* Mã ca */}
                                            <td className="py-3.5 px-4 sm:px-6">
                                                <span className="font-black text-[#00677c]">{a.id}</span>
                                            </td>

                                            {/* Gia đình */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00677c] font-bold flex items-center justify-center border border-teal-100 shrink-0 text-[11px]">
                                                        {a.family.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-800 whitespace-nowrap">{a.family}</span>
                                                </div>
                                            </td>

                                            {/* Điều dưỡng */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 font-bold flex items-center justify-center border border-sky-100 shrink-0 text-[11px]">
                                                        {a.caregiver.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800 whitespace-nowrap">{a.caregiver}</div>
                                                        <div className="text-[10px] text-slate-400">{a.caregiverRole}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Dịch vụ */}
                                            <td className="py-3.5 px-4">
                                                <span className="text-slate-600 whitespace-nowrap">{a.service}</span>
                                            </td>

                                            {/* Ngày & Giờ */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-slate-700 whitespace-nowrap">{a.date}</div>
                                                <div className="text-[11px] text-slate-400">{a.time}</div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${sc.badge}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                                                    {a.status}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="py-3.5 px-4 sm:px-6 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedAppointment(a)}
                                                    className="px-3.5 py-1.5 rounded-xl bg-teal-50 text-[#00677c] hover:bg-[#00677c] hover:text-white font-bold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                                                >
                                                    Xem <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {filtered.length > 0 && (
                    <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60">
                        <span>Tổng <strong className="text-slate-700">{filtered.length}</strong> ca chăm sóc</span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-blue-600 font-semibold">{countByStatus("Đang thực hiện")} ca đang diễn ra</span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
