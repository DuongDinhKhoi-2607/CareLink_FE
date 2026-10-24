import React, { useState, useEffect, useCallback } from "react";
import adminApi from "../../../api/adminApi";
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

// Dữ liệu ca chăm sóc được đồng bộ 100% từ Backend API (adminApi.getAllBookings)

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
    "Đã hoàn tiền": {
        dot: "bg-teal-500",
        badge: "bg-teal-50 text-teal-700 border-teal-200",
        card: "bg-teal-50/80 border-teal-300 ring-2 ring-teal-400/20",
        icon: <RotateCcw className="w-4.5 h-4.5" strokeWidth={2.2} />,
        iconBg: "bg-teal-100 text-teal-700",
        label: "Đã hoàn tiền",
    },
};


// ── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(false);

    // ── 58. GET /api/v1/bookings ── Lấy toàn bộ ca chăm sóc trên hệ thống dành cho Admin
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminApi.getAllBookings({ pageNumber: 1, pageSize: 100 });
            const list = Array.isArray(res)
                ? res
                : Array.isArray(res?.items)
                ? res.items
                : Array.isArray(res?.data)
                ? res.data
                : [];

            const mapped = list.map((b) => {
                const rawStatus = typeof b.status === "number" ? b.status : 1;
                let status = "Chờ xác nhận";
                if (rawStatus === 7) {
                    status = "Có khiếu nại";
                } else if (b.refundedAmount && Number(b.refundedAmount) > 0) {
                    status = "Đã hoàn tiền";
                } else if (rawStatus === 1 || rawStatus === 2) {
                    status = "Chờ xác nhận";
                } else if (rawStatus === 3 || rawStatus === 4) {
                    status = "Đang thực hiện";
                } else if (rawStatus === 5) {
                    status = "Hoàn thành";
                } else if (rawStatus === 6) {
                    status = "Đã hủy";
                }

                // Chi phí đã gồm phí sàn 60.000 VNĐ
                const totalCalculated = Number(b.totalPaymentAmount || (Number(b.totalPrice || 0) + (b.platformFee || 60000)));

                return {
                    id: b.bookingCode || (b.id ? `CA-${String(b.id).slice(0, 8).toUpperCase()}` : "CA-NEW"),
                    rawId: b.id,
                    family: b.customerName || "Gia đình khách hàng",
                    familyPhone: b.customerPhone || "Chưa cập nhật",
                    familyAddress: b.addressSnapshot || "Địa chỉ nhận chăm sóc",
                    caregiver: b.nurseName || "Điều dưỡng CareLink",
                    caregiverPhone: b.nursePhone || "Chưa cập nhật",
                    caregiverRole: "Điều dưỡng chuyên môn",
                    service: b.serviceName || "Chăm sóc theo yêu cầu",
                    date: b.scheduledStart ? new Date(b.scheduledStart).toLocaleDateString("vi-VN") : "Hôm nay",
                    time: b.scheduledStart ? new Date(b.scheduledStart).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "08:00",
                    duration: "Theo ca trực",
                    status,
                    notes: b.note || "Ca chăm sóc đặt trên sàn CareLink.",
                    totalAmount: `${totalCalculated.toLocaleString("vi-VN")} ₫`,
                    relative: b.recipientName || "Người thân",
                    relativeAge: "Người nhận chăm sóc",
                };
            });
            setAppointments(mapped);
        } catch (err) {
            console.warn("[CareLink Admin] Tải danh sách ca chăm sóc thất bại:", err);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleResolveDispute = (appointmentId, resolution) => {
        setAppointments((prev) =>
            prev.map((app) => {
                if (app.id !== appointmentId) return app;
                const isRefund = resolution.resolutionType === 1;
                const updatedDispute = {
                    ...app.dispute,
                    status: isRefund ? "Đã giải quyết" : "Bác bỏ",
                    statusNote: `Admin kết luận: ${isRefund ? `Hoàn trả ${Number(resolution.refundAmount).toLocaleString("vi-VN")} ₫.` : "Bác bỏ khiếu nại."} Ghi chú: ${resolution.resolutionNote}`,
                };
                const updatedApp = {
                    ...app,
                    status: isRefund ? "Đã hoàn tiền" : "Hoàn thành",
                    dispute: updatedDispute,
                };
                if (selectedAppointment?.id === appointmentId) {
                    setSelectedAppointment(updatedApp);
                }
                return updatedApp;
            })
        );
    };

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
                    onResolveDispute={handleResolveDispute}
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
