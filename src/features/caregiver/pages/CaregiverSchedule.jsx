import React, { useState } from "react";

/* ─── Constants ─── */
const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const DATES = ["15/09", "16/09", "17/09", "18/09", "19/09", "20/09", "21/09"];
const TIME_SLOTS = [
    "06:00 – 08:00",
    "08:00 – 10:00",
    "10:00 – 12:00",
    "13:00 – 15:00",
    "15:00 – 17:00",
    "17:00 – 19:00",
    "19:00 – 21:00",
];

/* Mocked initial slot states: key = "dayIndex-slotIndex", value = "available"|"booked"|"off" */
const initSlots = () => {
    const map = {};
    DAYS.forEach((_, d) => {
        TIME_SLOTS.forEach((_, t) => {
            const r = Math.random();
            map[`${d}-${t}`] = r < 0.15 ? "booked" : r < 0.55 ? "available" : "off";
        });
    });
    return map;
};

/* ─── Slot Cell ─── */
function SlotCell({ state, onClick }) {
    const styles = {
        booked:    "bg-[#00677c] text-white cursor-not-allowed",
        available: "bg-emerald-50 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100 cursor-pointer",
        off:       "bg-slate-50 border-2 border-slate-100 text-slate-300 hover:border-slate-300 hover:text-slate-400 cursor-pointer",
    };
    const labels = { booked: "Đã đặt", available: "Rảnh", off: "Không nhận" };

    return (
        <div
            onClick={state !== "booked" ? onClick : undefined}
            title={labels[state]}
            className={`relative h-12 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-150 select-none ${styles[state]}`}
        >
            {state === "booked" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )}
            {state === "available" && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
        </div>
    );
}

/* ─── Booking Request Card ─── */
function BookingRequest({ id, family, service, date, time, note, onAccept, onReject }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 animate-fade-in">
            {/* Family info */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {family[0]}
                </div>
                <div>
                    <p className="text-sm font-bold text-[#102030]">{family}</p>
                    <p className="text-xs text-slate-400">{service}</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Mới
                </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5 bg-slate-50 rounded-xl p-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Ngày</span>
                    <span className="text-xs font-semibold text-[#102030]">{date}</span>
                </div>
                <div className="flex flex-col gap-0.5 bg-slate-50 rounded-xl p-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Giờ</span>
                    <span className="text-xs font-semibold text-[#102030]">{time}</span>
                </div>
            </div>

            {note && (
                <p className="text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2 leading-relaxed">
                    💬 {note}
                </p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    id={`accept-${id}`}
                    onClick={() => onAccept(id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#00677c] text-white text-xs font-bold hover:bg-[#005263] active:scale-95 transition-all shadow-sm hover:shadow-md"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Accept
                </button>
                <button
                    id={`reject-${id}`}
                    onClick={() => onReject(id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 active:scale-95 transition-all"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                </button>
            </div>
        </div>
    );
}

/* ─── Legend Item ─── */
function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-xs text-slate-500">{label}</span>
        </div>
    );
}

/* ═══════════════════════════════════════════
   CaregiverSchedule
═══════════════════════════════════════════ */
export default function CaregiverSchedule() {
    const [slots, setSlots] = useState(initSlots);
    const [requests] = useState([
        { id: 1, family: "Nguyễn Thị Lan", service: "Chăm sóc người cao tuổi · 3h", date: "19/09/2026", time: "08:00 – 11:00", note: "Bà ngoại cần hỗ trợ đi lại và uống thuốc." },
        { id: 2, family: "Trần Văn Minh", service: "Phục hồi chức năng · 2h", date: "20/09/2026", time: "14:00 – 16:00", note: null },
        { id: 3, family: "Phạm Ngọc Anh", service: "Chăm sóc trẻ sơ sinh · 4h", date: "21/09/2026", time: "06:00 – 10:00", note: "Em bé 3 tháng tuổi, gia đình cần người thay ca ban đêm." },
    ]);
    const [responded, setResponded] = useState({}); // id -> "accepted" | "rejected"
    const [globalAvailable, setGlobalAvailable] = useState(true);

    const toggleSlot = (key) => {
        setSlots((prev) => ({
            ...prev,
            [key]: prev[key] === "available" ? "off" : "available",
        }));
    };

    const handleAccept = (id) => setResponded((p) => ({ ...p, [id]: "accepted" }));
    const handleReject = (id) => setResponded((p) => ({ ...p, [id]: "rejected" }));

    const pendingRequests = requests.filter((r) => !responded[r.id]);
    const doneRequests = requests.filter((r) => responded[r.id]);

    return (
        <div className="p-5 sm:p-8 max-w-7xl mx-auto animate-page-enter">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#102030]">Lịch làm việc</h1>
                    <p className="text-sm text-slate-400 mt-1">Tuần 15 – 21 tháng 9 năm 2026</p>
                </div>

                {/* Global availability toggle */}
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div>
                        <p className="text-sm font-bold text-[#102030]">Nhận ca mới</p>
                        <p className="text-xs text-slate-400">{globalAvailable ? "Đang bật" : "Đang tắt"}</p>
                    </div>
                    <button
                        id="toggle-availability"
                        onClick={() => setGlobalAvailable((p) => !p)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                            globalAvailable ? "bg-[#00677c]" : "bg-slate-200"
                        }`}
                    >
                        <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
                                globalAvailable ? "left-7" : "left-1"
                            }`}
                        />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ── Weekly Calendar ── */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Calendar header */}
                    <div className="px-5 pt-5 pb-3 border-b border-slate-50">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-[#102030]">Lịch theo tuần</h2>
                            <div className="flex items-center gap-3">
                                <LegendItem color="bg-[#00677c]" label="Đã đặt" />
                                <LegendItem color="bg-emerald-200 border border-emerald-300" label="Rảnh" />
                                <LegendItem color="bg-slate-100 border border-slate-200" label="Không nhận" />
                            </div>
                        </div>

                        {/* Day headers */}
                        <div className="grid" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
                            <div />
                            {DAYS.map((d, i) => (
                                <div key={d} className="flex flex-col items-center gap-0.5 pb-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${i === 3 ? "bg-[#00677c] text-white" : "text-[#102030]"}`}>
                                        {DATES[i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Slot grid */}
                    <div className="p-3">
                        {TIME_SLOTS.map((slot, t) => (
                            <div
                                key={slot}
                                className="grid gap-1.5 mb-1.5"
                                style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
                            >
                                <div className="flex items-center justify-end pr-2">
                                    <span className="text-[9px] font-semibold text-slate-400 text-right leading-tight">
                                        {slot}
                                    </span>
                                </div>
                                {DAYS.map((_, d) => {
                                    const key = `${d}-${t}`;
                                    return (
                                        <SlotCell
                                            key={key}
                                            state={slots[key]}
                                            onClick={() => toggleSlot(key)}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="px-5 pb-4 text-xs text-slate-400 text-center">
                        Bấm vào ô để bật / tắt khung giờ nhận ca
                    </div>
                </div>

                {/* ── Booking Requests Panel ── */}
                <div className="flex flex-col gap-4">
                    {/* Pending */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-[#102030] flex items-center gap-2">
                            Booking Requests
                            {pendingRequests.length > 0 && (
                                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </h2>
                    </div>

                    {pendingRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center gap-3 text-center">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-slate-400">Không có yêu cầu mới</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {pendingRequests.map((r) => (
                                <BookingRequest key={r.id} {...r} onAccept={handleAccept} onReject={handleReject} />
                            ))}
                        </div>
                    )}

                    {/* Responded */}
                    {doneRequests.length > 0 && (
                        <>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-2">Đã xử lý</p>
                            <div className="flex flex-col gap-2">
                                {doneRequests.map((r) => {
                                    const status = responded[r.id];
                                    return (
                                        <div key={r.id} className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-[#102030]">{r.family}</p>
                                                <p className="text-xs text-slate-400">{r.date} · {r.time}</p>
                                            </div>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                                status === "accepted"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-red-50 text-red-500"
                                            }`}>
                                                {status === "accepted" ? "✓ Accepted" : "✕ Rejected"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
