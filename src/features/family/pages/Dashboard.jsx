import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import familyApi from "../../../api/familyApi";
import conversationApi from "../../../api/conversationApi";

// Dữ liệu người thân dự phòng
const fallbackRelativesData = [
    {
        id: "lan",
        name: "Bà Nguyễn Thị Lan",
        description: "75 tuổi • Sức khỏe ổn định",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
        statusClass: "bg-orient",
    },
];

const calculateAge = (dob) => {
    if (!dob) return 75;
    const birthYear = new Date(dob).getFullYear();
    if (isNaN(birthYear)) return 75;
    const age = new Date().getFullYear() - birthYear;
    return age > 0 ? age : 75;
};

const getConfirmedPaidBookings = () => {
    try {
        return JSON.parse(localStorage.getItem("carelink_confirmed_paid_bookings") || "{}");
    } catch {
        return {};
    }
};

// Cột biểu đồ huyết áp 7 ngày
const chartBars = [
    { height: "76px", bg: "bg-[#4fd9fd66]" },
    { height: "96px", bg: "bg-[#4fd9fd66]" },
    { height: "58px", bg: "bg-[#4fd9fd66]" },
    { height: "102px", bg: "bg-[#4fd9fd66]" },
    { height: "83px", bg: "bg-[#4fd9fd99]" },
    { height: "90px", bg: "bg-[#4fd9fd66]" },
    { height: "92px", bg: "bg-orient" }, // Điểm nhấn hôm nay
];

const bloodPressureDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const heartRateTimes = ["08:00", "12:00", "16:00", "20:00"];

// Cấu hình các trạng thái ca chăm sóc chuẩn y tế
const statusConfig = {
    completed: {
        label: "ĐÃ HOÀN THÀNH",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotClass: "bg-emerald-500",
    },
    in_progress: {
        label: "ĐANG THỰC HIỆN",
        badgeClass: "bg-sky-50 text-sky-700 border-sky-200/80",
        dotClass: "bg-sky-500 animate-pulse",
    },
    pending: {
        label: "CHƯA HOÀN THÀNH",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
        dotClass: "bg-amber-500",
    },
};

export default function Dashboard() {
    const [recipients, setRecipients] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [careStatus, setCareStatus] = useState("completed");
    const [bookings, setBookings] = useState([]);
    const [recentConversation, setRecentConversation] = useState(null);

    const userStr = localStorage.getItem("carelink_user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const userName = currentUser?.fullName || currentUser?.name || "bạn";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Chào buổi sáng";
        if (hour < 18) return "Chào buổi chiều";
        return "Chào buổi tối";
    };

    useEffect(() => {
        let isMounted = true;
        familyApi.getRecipients()
            .then((res) => {
                if (!isMounted) return;
                const list = Array.isArray(res)
                    ? res
                    : Array.isArray(res?.data) ? res.data
                    : Array.isArray(res?.items) ? res.items
                    : [];
                if (list.length > 0) {
                    const mapped = list.map((r, idx) => ({
                        id: r.id || `rel-${idx}`,
                        name: r.fullName || r.name || "Người thân",
                        description: `${calculateAge(r.dateOfBirth)} tuổi • ${r.specialNotes || r.medicalHistory || "Sức khỏe ổn định"}`,
                        image: r.gender === 1
                            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                            : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
                        statusClass: "bg-orient",
                    }));
                    setRecipients(mapped);
                    setSelectedPerson(mapped[0]?.name);
                } else {
                    setRecipients([]);
                    setSelectedPerson(null);
                }
            })
            .catch((err) => {
                if (!err.response || err.code === "ECONNABORTED" || err.code === "ERR_NETWORK") {
                    setRecipients(fallbackRelativesData);
                    setSelectedPerson(fallbackRelativesData[0]?.name || "Bà Nguyễn Thị Lan");
                } else {
                    setRecipients([]);
                    setSelectedPerson(null);
                }
            });

        // Tải danh sách các ca chăm sóc thực tế của gia đình
        familyApi.getBookings({ PageNumber: 1, PageSize: 20 })
            .then((res) => {
                if (!isMounted) return;
                const list = Array.isArray(res)
                    ? res
                    : Array.isArray(res?.data) ? res.data
                    : Array.isArray(res?.items) ? res.items
                    : [];
                setBookings(list);

                // Tự động kiểm tra đối soát ngầm cho ca PendingPayment
                const pendingList = list.filter((b) => (typeof b.status === "number" ? b.status : 1) === 1);
                if (pendingList.length > 0) {
                    pendingList.forEach(async (pb) => {
                        try {
                            const pRes = await familyApi.getPaymentDetail(pb.id);
                            if (pRes?.status === 2 && isMounted) {
                                const paidMap = getConfirmedPaidBookings();
                                paidMap[pb.id] = { paidAt: Date.now(), status: 2 };
                                localStorage.setItem("carelink_confirmed_paid_bookings", JSON.stringify(paidMap));
                                setBookings((prev) =>
                                    prev.map((item) =>
                                        item.id === pb.id ? { ...item, status: pb.conversationId ? 3 : 2 } : item
                                    )
                                );
                            }
                        } catch {}
                    });
                }
            })
        // Tải tin nhắn gần nhất để hiển thị thẻ trao đổi
        conversationApi.getConversations({ PageNumber: 1, PageSize: 1 })
            .then((res) => {
                if (!isMounted) return;
                const items = Array.isArray(res) ? res : (res?.data || res?.items || []);
                if (items.length > 0) {
                    setRecentConversation(items[0]);
                }
            })
            .catch(() => {});

        return () => {
            isMounted = false;
        };
    }, []);

    // Tìm ca chăm sóc sắp tới (Accepted=3, InProgress=4, PendingAcceptance=2)
    const upcomingBooking = useMemo(() => {
        const paidMap = getConfirmedPaidBookings();
        const active = bookings.filter((b) => {
            const isLocalPaid = Boolean(b.id && paidMap[b.id]);
            const st = typeof b.status === "number" ? b.status : 0;
            return st === 3 || st === 4 || st === 2 || (isLocalPaid && st === 1) || b.status === "Accepted" || b.status === "InProgress" || b.status === "PendingAcceptance";
        });
        if (active.length === 0) return null;
        return active.sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart))[0];
    }, [bookings]);

    // Tìm ca đang chờ thanh toán (PendingPayment=1)
    const pendingPaymentBooking = useMemo(() => {
        const paidMap = getConfirmedPaidBookings();
        const list = bookings.filter((b) => {
            if (b.id && paidMap[b.id]) return false;
            const st = typeof b.status === "number" ? b.status : 0;
            return st === 1 || b.status === "PendingPayment";
        });
        if (list.length === 0) return null;
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    }, [bookings]);

    // Kiểm tra thời hạn thanh toán 30 phút
    const isPendingPaymentExpired = useMemo(() => {
        if (!pendingPaymentBooking?.createdAt) return false;
        return (Date.now() - new Date(pendingPaymentBooking.createdAt).getTime()) > 30 * 60 * 1000;
    }, [pendingPaymentBooking]);

    // Tìm ca chăm sóc đã hoàn thành gần nhất (Completed=5)
    const recentBooking = useMemo(() => {
        const completed = bookings.filter((b) => {
            const st = typeof b.status === "number" ? b.status : 0;
            return st === 5 || b.status === "Completed";
        });
        if (completed.length === 0) return null;
        return completed.sort((a, b) => new Date(b.completedAt || b.scheduledEnd) - new Date(a.completedAt || a.scheduledEnd))[0];
    }, [bookings]);

    const formatBookingTime = (booking) => {
        if (!booking?.scheduledStart) return { dateStr: "Đang thỏa thuận", timeStr: "" };
        const sDate = new Date(booking.scheduledStart);
        const eDate = booking.scheduledEnd ? new Date(booking.scheduledEnd) : null;
        const pad = (n) => String(n).padStart(2, "0");
        const sTime = `${pad(sDate.getHours())}:${pad(sDate.getMinutes())}`;
        const eTime = eDate ? `${pad(eDate.getHours())}:${pad(eDate.getMinutes())}` : "";
        const dateStr = sDate.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        return { dateStr, timeStr: eTime ? `${sTime} – ${eTime}` : sTime };
    };

    return (
        <div className="p-6 sm:p-10 flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Tiêu đề & Lời chào buổi sáng */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-prussian-blue">
                        {getGreeting()}, {userName}
                    </h1>
                    <p className="text-base text-[#43474e] mt-1">
                        Dưới đây là cập nhật sức khỏe mới nhất của người thân bạn.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/caregivers"
                        className="px-4 py-2 bg-orient text-white rounded-xl text-sm font-semibold hover:bg-[#005263] transition-colors shadow-xs"
                    >
                        Đặt lịch mới
                    </Link>
                </div>
            </header>

            {/* Bố cục lưới Dashboard: 8 Cột Trái + 4 Cột Phải */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ============================================================ */}
                {/* CỘT TRÁI (8 CỘT): LỊCH HẸN & BÁO CÁO SỨC KHỎE                */}
                {/* ============================================================ */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* 1. Thẻ Buổi chăm sóc tiếp theo */}
                    {upcomingBooking ? (
                        <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                {upcomingBooking.status === 3 || upcomingBooking.status === "Accepted" ? (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        ĐÃ XÁC NHẬN
                                    </span>
                                ) : upcomingBooking.status === 4 || upcomingBooking.status === "InProgress" ? (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-50 text-sky-700 border border-sky-200 animate-pulse">
                                        ĐANG THỰC HIỆN
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200">
                                        CHỜ ĐIỀU DƯỠNG DUYỆT
                                    </span>
                                )}
                                <span className="text-xs font-semibold text-slate-400">
                                    Ca #{upcomingBooking.id.slice(0, 8).toUpperCase()}
                                </span>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-prussian-blue">
                                    {upcomingBooking.serviceName || "Buổi chăm sóc tiếp theo"}
                                </h2>
                                <p className="text-sm font-normal text-[#43474e] mt-1">
                                    Thời gian: <strong className="text-slate-800">{formatBookingTime(upcomingBooking).dateStr} ({formatBookingTime(upcomingBooking).timeStr})</strong>
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Người nhận: {upcomingBooking.recipientName || "Người thân"}
                                </p>
                            </div>

                            {/* Hàng dưới: Thông tin Điều dưỡng bên trái & Các nút hành động bên phải */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-[#00677c] to-[#005263] border border-slate-200 shrink-0">
                                        {upcomingBooking.nurseName?.charAt(0) || "D"}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#181c1e]">
                                            Điều dưỡng: {upcomingBooking.nurseName}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Đã xác thực chuyên môn CareLink
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <Link
                                        to="/chat"
                                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Nhắn tin
                                    </Link>
                                    <Link
                                        to="/dashboard/appointments"
                                        className="px-4 py-2 bg-orient text-white rounded-xl text-sm font-semibold hover:bg-[#005263] transition-colors shadow-xs"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="bg-white p-6 rounded-2xl border border-dashed border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-prussian-blue">
                                    Chưa có lịch hẹn sắp tới
                                </h2>
                                <p className="text-xs text-[#43474e] mt-1">
                                    Bạn chưa có ca chăm sóc nào sắp diễn ra. Hãy đặt lịch mới để điều dưỡng đồng hành cùng gia đình bạn.
                                </p>
                            </div>
                            <Link
                                to="/caregivers"
                                className="px-5 py-2.5 bg-orient text-white rounded-xl text-sm font-semibold hover:bg-[#005263] transition shadow-xs shrink-0"
                            >
                                Đặt lịch ngay
                            </Link>
                        </section>
                    )}

                    {/* 2. Thẻ Ca chăm sóc gần nhất -> Dẫn sang Đánh giá */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border shadow-xs transition-all select-none ${statusConfig[careStatus]?.badgeClass || statusConfig.completed.badgeClass}`}
                                    title="Trạng thái ca chăm sóc"
                                >
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${statusConfig[careStatus]?.dotClass || statusConfig.completed.dotClass}`} />
                                    <span>TRẠNG THÁI: {recentBooking ? "ĐÃ HOÀN THÀNH" : (statusConfig[careStatus]?.label || "ĐÃ HOÀN THÀNH")}</span>
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-prussian-blue mt-1">
                                {recentBooking ? `Ca gần nhất: ${recentBooking.serviceName}` : "Ca chăm sóc gần nhất"}
                            </h3>
                            <p className="text-xs text-[#43474e]">
                                {recentBooking ? (
                                    <>
                                        Điều dưỡng: <strong className="text-slate-800">{recentBooking.nurseName}</strong> • Người nhận: {recentBooking.recipientName} ({formatBookingTime(recentBooking).dateStr})
                                    </>
                                ) : (
                                    <>
                                        Điều dưỡng: <strong className="text-slate-800">Nguyễn Thùy Linh</strong> • Hôm nay 16:30
                                    </>
                                )}
                            </p>
                        </div>

                        <Link
                            to={recentBooking ? `/review?bookingId=${recentBooking.id}` : "/review"}
                            className="px-6 py-2.5 bg-orient text-white rounded-xl text-sm font-semibold hover:bg-[#005263] transition-all shadow-xs hover:shadow-md text-center shrink-0"
                        >
                            Đánh giá dịch vụ
                        </Link>
                    </section>

                    {/* 3. Khối Chỉ số sức khỏe (Huyết áp + Nhịp tim) */}
                    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-prussian-blue">Chỉ số sức khỏe</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Cập nhật cuối cùng: 2 giờ trước bởi Điều dưỡng Linh</p>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                <span className="text-xs font-semibold text-slate-700 px-2">{selectedPerson}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            {/* Biểu đồ Huyết áp */}
                            <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#43474e]">Huyết áp (mmHg)</span>
                                    <span className="text-2xl font-bold text-prussian-blue">120/80</span>
                                </div>

                                <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
                                    {chartBars.map((bar, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                            <div
                                                className={`w-full rounded-t-md transition-all ${bar.bg}`}
                                                style={{ height: bar.height }}
                                            />
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {bloodPressureDays[i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Biểu đồ Nhịp tim */}
                            <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#43474e]">Nhịp tim (BPM)</span>
                                    <span className="text-2xl font-bold text-prussian-blue">72</span>
                                </div>

                                <div className="h-32 flex flex-col justify-between pt-4">
                                    <svg className="w-full h-20 text-orient" viewBox="0 0 300 80" fill="none">
                                        <path
                                            d="M0 40 H50 L60 20 L75 60 L90 10 L105 50 L120 40 H180 L190 25 L205 55 L220 15 L235 40 H300"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    <div className="flex justify-between px-2 text-[10px] font-bold text-slate-400">
                                        {heartRateTimes.map((t) => (
                                            <span key={t}>{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ============================================================ */}
                {/* CỘT PHẢI (4 CỘT): NGƯỜI THÂN, HÓA ĐƠN & KHÁM ĐỊNH KỲ         */}
                {/* ============================================================ */}
                <aside className="lg:col-span-4 flex flex-col gap-6">
                    {/* Thẻ 1: Danh sách Người thân */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-prussian-blue">Người thân</h3>
                            <Link
                                to="/dashboard/relatives"
                                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-orient hover:text-white transition-colors flex items-center justify-center font-bold text-sm"
                                title="Xem danh sách & Thêm người thân"
                            >
                                +
                            </Link>
                        </div>

                        <div className="flex flex-col gap-3">
                            {recipients.length === 0 ? (
                                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                                    Chưa có hồ sơ người thân.{" "}
                                    <Link to="/dashboard/relatives" className="text-orient font-semibold hover:underline">
                                        Thêm ngay
                                    </Link>
                                </div>
                            ) : (
                                recipients.map((person) => (
                                    <button
                                        key={person.id}
                                        type="button"
                                        onClick={() => setSelectedPerson(person.name)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                            selectedPerson === person.name
                                                ? "border-orient bg-[#f0f9fa] shadow-xs"
                                                : "border-slate-100 bg-slate-50/60 hover:bg-slate-100"
                                        }`}
                                    >
                                        <img
                                            src={person.image}
                                            alt={person.name}
                                            className="w-11 h-11 rounded-full object-cover shrink-0 border border-white"
                                        />
                                        <div className="flex-1 flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-[#181c1e] truncate">{person.name}</span>
                                            <span className="text-xs text-[#43474e] truncate">{person.description}</span>
                                        </div>
                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${person.statusClass}`} />
                                    </button>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Thẻ 2: Hóa đơn & Phí nền tảng (Động theo tình trạng ca thực tế) */}
                    <section className="bg-gradient-to-br from-[#00677c] to-[#004f5e] text-white p-6 rounded-2xl shadow-sm flex flex-col gap-4 relative overflow-hidden">
                        <div className="flex items-center justify-between relative z-10">
                            <h3 className="text-base font-bold">Chi phí dịch vụ</h3>
                            <svg className="w-5 h-5 text-cyan-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                            </svg>
                        </div>

                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-100/90">
                                {pendingPaymentBooking ? "PHÍ CA CHĂM SÓC HIỆN TẠI" : "TỔNG CHI PHÍ DỊCH VỤ"}
                            </span>
                            <span className="text-3xl font-extrabold text-white">
                                {pendingPaymentBooking
                                    ? (Number(pendingPaymentBooking.totalPrice || 60000).toLocaleString("vi-VN") + "đ")
                                    : (upcomingBooking?.totalPrice || recentBooking?.totalPrice
                                        ? Number(upcomingBooking?.totalPrice || recentBooking?.totalPrice).toLocaleString("vi-VN") + "đ"
                                        : "0đ")}
                            </span>
                            <span className="text-[11px] text-cyan-100/80">
                                (Đã bao gồm 60.000đ phí nền tảng CareLink)
                            </span>

                            {pendingPaymentBooking ? (
                                isPendingPaymentExpired ? (
                                    <div className="inline-flex items-center gap-1.5 text-xs text-rose-200 mt-1">
                                        <svg className="w-4 h-4 text-rose-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span>Trạng thái: Hết hạn thanh toán (30p)</span>
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-1.5 text-xs text-amber-200 mt-1 font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                        <span>Trạng thái: Chờ thanh toán</span>
                                    </div>
                                )
                            ) : (upcomingBooking || recentBooking) ? (
                                <div className="inline-flex items-center gap-1.5 text-xs text-cyan-200 mt-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Trạng thái: Đã thanh toán</span>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-1.5 text-xs text-cyan-200 mt-1">
                                    <span>Chưa phát sinh ca trực</span>
                                </div>
                            )}
                        </div>

                        {pendingPaymentBooking && !isPendingPaymentExpired ? (
                            <Link
                                to="/checkout"
                                state={{ bookingId: pendingPaymentBooking.id, booking: pendingPaymentBooking }}
                                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-slate-900 transition-colors relative z-10 text-center shadow-xs"
                            >
                                Thanh toán ngay
                            </Link>
                        ) : pendingPaymentBooking && isPendingPaymentExpired ? (
                            <Link
                                to="/caregivers"
                                className="w-full py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-xs font-bold text-white transition-colors relative z-10 text-center"
                            >
                                Đặt lại ca mới
                            </Link>
                        ) : (
                            <Link
                                to="/dashboard/appointments"
                                className="w-full py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl text-xs font-bold text-white transition-colors relative z-10 text-center"
                            >
                                Xem lịch hẹn
                            </Link>
                        )}
                    </section>

                    {/* Thẻ 3: Lịch kiểm tra định kỳ sắp tới (Động theo upcomingBooking) */}
                    <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orient text-white">
                                SẮP TỚI
                            </span>
                        </div>
                        {upcomingBooking ? (
                            <>
                                <div>
                                    <h4 className="text-base font-bold text-prussian-blue">
                                        {upcomingBooking.serviceName || "Chăm sóc theo yêu cầu"}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {upcomingBooking.recipientName || "Người thân"} • {formatBookingTime(upcomingBooking).timeStr} {formatBookingTime(upcomingBooking).dateStr}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                                    <span className="font-semibold text-prussian-blue">
                                        Điều dưỡng: {upcomingBooking.nurseName || "Điều dưỡng CareLink"}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700">Chưa có lịch hẹn sắp tới</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Đặt lịch để điều dưỡng đồng hành chăm sóc người thân.</p>
                                <Link to="/caregivers" className="inline-block mt-2 text-xs font-bold text-orient hover:underline">
                                    Tìm điều dưỡng ngay →
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Thẻ 4: Tin nhắn nhanh với Điều dưỡng (Động theo recentConversation) */}
                    <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-prussian-blue">
                            Tin nhắn với điều dưỡng
                        </h4>
                        {recentConversation ? (
                            <Link
                                to="/dashboard/messages"
                                className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <img
                                    src={recentConversation.otherPartyAvatar || recentConversation.nurseAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"}
                                    alt="Caregiver"
                                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-white"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150";
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-800 truncate">
                                            {recentConversation.otherPartyName || recentConversation.nurseName || "Điều dưỡng CareLink"}
                                        </span>
                                        <span className="text-[10px] text-slate-400 shrink-0">
                                            {recentConversation.lastMessageAt
                                                ? new Date(recentConversation.lastMessageAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                                                : ""}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                        {recentConversation.lastMessageContent || recentConversation.lastMessage || "Đang trao đổi ca chăm sóc..."}
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <div className="p-3 bg-slate-50 rounded-xl text-center">
                                <p className="text-xs text-slate-500">Chưa có cuộc trò chuyện nào</p>
                                <Link to="/caregivers" className="text-xs font-bold text-orient hover:underline mt-1 inline-block">
                                    Liên hệ điều dưỡng
                                </Link>
                            </div>
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
}