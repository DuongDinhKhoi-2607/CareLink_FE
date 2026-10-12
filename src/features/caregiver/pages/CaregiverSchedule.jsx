import React, { useState } from "react";

/* ─── Constants ─── */
const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const DATES = ["13/10", "14/10", "15/10", "16/10", "17/10", "18/10", "19/10"];
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
function BookingRequest({ id, family, service, date, time, note, source = "direct", onAccept, onReject }) {
    const isFromChat = source === "chat";

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm p-4 flex flex-col gap-3 transition-all duration-200">
            {/* Family info */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00677c] to-[#004e5f] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-2xs">
                    {family[0]}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#102030] truncate">{family}</p>
                    <p className="text-xs text-slate-500 truncate">{service}</p>
                </div>
                {isFromChat ? (
                    <span className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-[11px] font-semibold text-cyan-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        Qua Chat
                    </span>
                ) : (
                    <span className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Đặt trực tiếp
                    </span>
                )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Ngày
                    </span>
                    <span className="text-xs font-semibold text-[#102030]">{date}</span>
                </div>
                <div className="flex flex-col gap-0.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Giờ
                    </span>
                    <span className="text-xs font-semibold text-[#102030]">{time}</span>
                </div>
            </div>

            {note && (
                <p className="text-xs text-slate-600 bg-slate-50 rounded-xl px-3 py-2 leading-relaxed border border-slate-100">
                    💬 {note}
                </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-0.5">
                <button
                    id={`accept-${id}`}
                    type="button"
                    onClick={() => onAccept(id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#00677c] text-white text-xs font-bold hover:bg-[#005263] active:scale-98 transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Nhận ca
                </button>
                <button
                    id={`reject-${id}`}
                    type="button"
                    onClick={() => onReject(id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 active:scale-98 transition-all cursor-pointer"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Từ chối
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
        { id: 1, family: "Nguyễn Thị Lan (Mẹ anh An)", service: "Chăm sóc phục hồi sau phẫu thuật · 2h", date: "14/10/2026", time: "08:00 – 10:00", note: "Ca đã thống nhất qua Chat. Bác An vừa mổ khớp gối.", source: "chat" },
        { id: 2, family: "Trần Văn Minh", service: "Phục hồi chức năng vận động · 2h", date: "15/10/2026", time: "14:00 – 16:00", note: null, source: "direct" },
        { id: 3, family: "Phạm Ngọc Anh", service: "Chăm sóc trẻ sơ sinh ban đêm · 4h", date: "16/10/2026", time: "06:00 – 10:00", note: "Em bé 3 tháng tuổi, gia đình cần người thay ca ban đêm.", source: "direct" },
    ]);
    const [responded, setResponded] = useState({ 1: "accepted" }); // Ca 1 đã được chốt qua Chat & thanh toán
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
                    <p className="text-sm text-slate-400 mt-1">Tuần 13 – 19 tháng 10 năm 2026</p>
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
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    {/* Calendar header bar */}
                    <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-sm font-bold text-[#102030]">Lịch theo tuần</h2>
                        <div className="flex items-center gap-3">
                            <LegendItem color="bg-[#00677c]" label="Đã đặt" />
                            <LegendItem color="bg-emerald-200 border border-emerald-300" label="Rảnh" />
                            <LegendItem color="bg-slate-100 border border-slate-200" label="Không nhận" />
                        </div>
                    </div>

                    {/* Vùng cuộn ngang riêng biệt trên màn hình nhỏ, bảo vệ layout desktop */}
                    <div className="overflow-x-auto w-full">
                        <div className="min-w-[640px] p-3 sm:p-4">
                            {/* Day headers */}
                            <div className="grid mb-2" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
                                <div />
                                {DAYS.map((d, i) => (
                                    <div key={d} className="flex flex-col items-center gap-0.5 pb-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${i === 1 ? "bg-[#00677c] text-white" : "text-[#102030]"}`}>
                                            {DATES[i]}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Slot grid */}
                            <div className="space-y-1.5">
                                {TIME_SLOTS.map((slot, t) => (
                                    <div
                                        key={slot}
                                        className="grid gap-1.5"
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
                        </div>
                    </div>

                    <div className="px-5 pb-4 text-xs text-slate-400 text-center">
                        Bấm vào ô để bật / tắt khung giờ nhận ca · Vuốt ngang để xem đủ các ngày trong tuần
                    </div>
                </div>

                {/* ── Booking Requests Panel (Việt hóa thành Yêu cầu nhận ca) ── */}
                <div className="flex flex-col gap-4">
                    {/* Pending */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-[#102030] flex items-center gap-2">
                            Yêu cầu nhận ca
                            {pendingRequests.length > 0 && (
                                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
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
                            <p className="text-sm font-semibold text-slate-400">Không có yêu cầu chờ xử lý</p>
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
                                        <div key={r.id} className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center justify-between gap-3 shadow-2xs">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-[#102030] truncate">{r.family}</p>
                                                <p className="text-xs text-slate-400 truncate">{r.date} · {r.time}</p>
                                            </div>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                                                status === "accepted"
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                            }`}>
                                                {status === "accepted" ? "✓ Đã nhận ca" : "✕ Đã từ chối"}
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
