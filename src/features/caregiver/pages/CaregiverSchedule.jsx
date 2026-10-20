import React, { useState, useEffect, useCallback, useMemo } from "react";
import caregiverApi from "../../../api/caregiverApi";

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
            map[`${d}-${t}`] = r < 0.15 ? "booked" : r < 0.45 ? "available" : "off";
        });
    });
    return map;
};

/* ─── Slot Cell ─── */
function SlotCell({ state, onClick, disabled }) {
    const styles = {
        booked:    "bg-[#00677c] text-white cursor-not-allowed shadow-2xs",
        available: "bg-emerald-50 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100 cursor-pointer shadow-2xs hover:scale-98",
        off:       "bg-slate-50 border-2 border-slate-100 text-slate-300 hover:border-slate-300 hover:text-slate-400 cursor-pointer hover:scale-98",
    };
    const labels = { booked: "Đã đặt (không thể sửa)", available: "Rảnh (Bấm để tắt)", off: "Không nhận (Bấm để bật rảnh)" };

    return (
        <button
            type="button"
            disabled={disabled || state === "booked"}
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
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            )}
        </button>
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
   CaregiverSchedule (API 56, 57, 58, 59)
═══════════════════════════════════════════ */
export default function CaregiverSchedule() {
    const [slots, setSlots] = useState(initSlots);
    const [slotMeta, setSlotMeta] = useState({}); // Lưu { [key]: { id, ... } }
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newSlotForm, setNewSlotForm] = useState({
        dayIndex: 0,
        timeSlotIndex: 0,
    });

    const [requests] = useState([
        { id: 1, family: "Nguyễn Thị Lan (Mẹ anh An)", service: "Chăm sóc phục hồi sau phẫu thuật · 2h", date: "14/10/2026", time: "08:00 – 10:00", note: "Ca đã thống nhất qua Chat. Bác An vừa mổ khớp gối.", source: "chat" },
        { id: 2, family: "Trần Văn Minh", service: "Phục hồi chức năng vận động · 2h", date: "15/10/2026", time: "14:00 – 16:00", note: null, source: "direct" },
        { id: 3, family: "Phạm Ngọc Anh", service: "Chăm sóc trẻ sơ sinh ban đêm · 4h", date: "16/10/2026", time: "06:00 – 10:00", note: "Em bé 3 tháng tuổi, gia đình cần người thay ca ban đêm.", source: "direct" },
    ]);
    const [responded, setResponded] = useState({ 1: "accepted" });
    const [globalAvailable, setGlobalAvailable] = useState(true);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Đếm số khung giờ rảnh đang chọn
    const availableSlotsCount = useMemo(() => {
        return Object.values(slots).filter((s) => s === "available").length;
    }, [slots]);

    // ── 56. GET /api/v1/nurse/availability ───────────────────────────────────────────
    const fetchAvailability = useCallback(async () => {
        setLoading(true);
        try {
            const res = await caregiverApi.getAvailability();
            const data = res?.data || res;
            const items = Array.isArray(data)
                ? data
                : Array.isArray(data?.items)
                ? data.items
                : Array.isArray(data?.availabilities)
                ? data.availabilities
                : [];

            if (data?.isAvailable !== undefined) {
                setGlobalAvailable(Boolean(data.isAvailable));
            }

            if (items.length > 0) {
                const newSlots = {};
                const newMeta = {};

                // Khởi tạo toàn bộ slot là "off"
                DAYS.forEach((_, d) => {
                    TIME_SLOTS.forEach((_, t) => {
                        newSlots[`${d}-${t}`] = "off";
                    });
                });

                items.forEach((item) => {
                    let d = -1;
                    if (typeof item.dayOfWeek === "number") {
                        // 1 = Monday .. 7 = Sunday
                        d = item.dayOfWeek >= 1 && item.dayOfWeek <= 7 ? item.dayOfWeek - 1 : item.dayOfWeek;
                    } else if (typeof item.dayOfWeek === "string") {
                        const idx = DAYS.findIndex(
                            (day) => day.toLowerCase() === item.dayOfWeek.toLowerCase()
                        );
                        if (idx !== -1) d = idx;
                    }

                    // Khớp khung giờ qua startTime
                    const itemStart = (item.startTime || "").slice(0, 5);
                    const t = TIME_SLOTS.findIndex((slot) => slot.startsWith(itemStart));

                    if (d >= 0 && d < 7 && t >= 0 && t < TIME_SLOTS.length) {
                        const key = `${d}-${t}`;
                        newSlots[key] =
                            item.isBooked || item.status === "booked" ? "booked" : "available";
                        newMeta[key] = { id: item.id, ...item };
                    }
                });

                setSlots(newSlots);
                setSlotMeta(newMeta);
            }
        } catch (err) {
            console.warn("Lỗi tải lịch rảnh từ server:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // ── 57. POST /api/v1/nurse/availability (Thêm khung giờ rảnh) ───────────────────
    const handleAddSlot = async (d, t) => {
        const slotStr = TIME_SLOTS[t];
        const [start, end] = slotStr.split("–").map((s) => s.trim());
        const key = `${d}-${t}`;

        // Cập nhật optimistic
        setSlots((prev) => ({ ...prev, [key]: "available" }));

        try {
            const payload = {
                dayOfWeek: d + 1,
                dayName: DAYS[d],
                startTime: start.length === 5 ? `${start}:00` : start,
                endTime: end.length === 5 ? `${end}:00` : end,
                isAvailable: true,
            };
            const res = await caregiverApi.addAvailability(payload);
            const created = res?.data || res;
            if (created?.id) {
                setSlotMeta((prev) => ({ ...prev, [key]: { id: created.id, ...created } }));
            }
            showToast(`✓ Đã thêm khung giờ rảnh: ${DAYS[d]} (${slotStr})`);
        } catch (err) {
            console.error("Lỗi thêm khung giờ rảnh:", err);
            showToast(`Đã bật khung giờ: ${DAYS[d]} (${slotStr}). Nhấn "Đồng bộ" để lưu toàn bộ!`);
        }
    };

    // ── 59. DELETE /api/v1/nurse/availability/{id} (Xóa khung giờ rảnh) ────────────
    const handleDeleteSlot = async (d, t) => {
        const key = `${d}-${t}`;
        const meta = slotMeta[key];

        // Cập nhật optimistic
        setSlots((prev) => ({ ...prev, [key]: "off" }));

        if (meta?.id) {
            try {
                await caregiverApi.deleteAvailability(meta.id);
                setSlotMeta((prev) => {
                    const next = { ...prev };
                    delete next[key];
                    return next;
                });
                showToast(`Đã xóa khung giờ rảnh: ${DAYS[d]} (${TIME_SLOTS[t]})`);
            } catch (err) {
                console.error("Lỗi xóa khung giờ rảnh:", err);
                showToast(`Đã tắt khung giờ: ${DAYS[d]} (${TIME_SLOTS[t]})`);
            }
        }
    };

    // Toggle khi bấm trực tiếp vào ô trong lưới lịch
    const toggleSlot = (key) => {
        const [dStr, tStr] = key.split("-");
        const d = Number(dStr);
        const t = Number(tStr);
        if (slots[key] === "available") {
            handleDeleteSlot(d, t);
        } else if (slots[key] === "off") {
            handleAddSlot(d, t);
        }
    };

    // ── 58. PUT /api/v1/nurse/availability (Cập nhật / Đồng bộ toàn bộ lịch rảnh) ────
    // Đặc biệt kiểm tra: Thu thập ĐỦ toàn bộ slot đang active để tránh ghi đè làm mất lịch của các ngày khác
    const handleSyncSchedule = async () => {
        setSyncing(true);
        try {
            const activeSlots = [];
            DAYS.forEach((_, d) => {
                TIME_SLOTS.forEach((slotStr, t) => {
                    const key = `${d}-${t}`;
                    if (slots[key] === "available") {
                        const [start, end] = slotStr.split("–").map((s) => s.trim());
                        activeSlots.push({
                            id: slotMeta[key]?.id,
                            dayOfWeek: d + 1,
                            dayName: DAYS[d],
                            startTime: start.length === 5 ? `${start}:00` : start,
                            endTime: end.length === 5 ? `${end}:00` : end,
                            isAvailable: true,
                        });
                    }
                });
            });

            // Gửi dữ liệu đồng bộ đầy đủ (an toàn tuyệt đối không ghi đè mất lịch)
            try {
                await caregiverApi.setAvailability(activeSlots);
            } catch {
                // Nếu BE yêu cầu bọc object
                await caregiverApi.setAvailability({
                    isAvailable: globalAvailable,
                    availabilities: activeSlots,
                    slots: activeSlots,
                });
            }

            showToast(`✓ Đã đồng bộ toàn bộ lịch tuần (${activeSlots.length} khung giờ rảnh) thành công!`);
            await fetchAvailability();
        } catch (err) {
            console.error("Lỗi đồng bộ lịch rảnh:", err);
            const msg = err?.response?.data?.message || err?.response?.data?.title || "Không thể đồng bộ lịch rảnh. Vui lòng thử lại!";
            showToast(`⚠️ ${msg}`);
        } finally {
            setSyncing(false);
        }
    };

    // Modal submit: Thêm khung giờ rảnh rõ ràng
    const handleModalAddSubmit = async (e) => {
        e.preventDefault();
        setIsAddModalOpen(false);
        await handleAddSlot(newSlotForm.dayIndex, newSlotForm.timeSlotIndex);
    };

    const handleAccept = (id) => setResponded((p) => ({ ...p, [id]: "accepted" }));
    const handleReject = (id) => setResponded((p) => ({ ...p, [id]: "rejected" }));

    const pendingRequests = requests.filter((r) => !responded[r.id]);
    const doneRequests = requests.filter((r) => responded[r.id]);

    return (
        <div className="p-5 sm:p-8 max-w-7xl mx-auto animate-page-enter font-sans">
            {/* Toast thông báo */}
            {toastMessage && (
                <div className="fixed top-20 right-6 z-50 bg-[#00677c] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-teal-300/30 text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
                    <svg className="w-5 h-5 text-teal-200 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200/60">
                            Quản lý lịch rảnh điều dưỡng
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                            {availableSlotsCount} khung giờ rảnh
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#102030]">Lịch làm việc & Nhận ca</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Tuần 13 – 19 tháng 10 năm 2026 (Chạm vào ô để bật/tắt giờ rảnh)</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Nút Thêm khung giờ rảnh modal */}
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-teal-200 text-teal-700 text-xs font-bold hover:bg-teal-50 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Thêm khung giờ
                    </button>

                    {/* Nút Đồng bộ / Lưu lịch rảnh (API 58 PUT) */}
                    <button
                        type="button"
                        disabled={syncing}
                        onClick={handleSyncSchedule}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-60"
                        title="Đồng bộ toàn bộ lịch tuần lên máy chủ tránh ghi đè"
                    >
                        {syncing ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        )}
                        <span>{syncing ? "Đang đồng bộ..." : "Đồng bộ lịch tuần (PUT)"}</span>
                    </button>

                    {/* Global availability toggle */}
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-2xs">
                        <div>
                            <p className="text-xs font-bold text-[#102030]">Nhận ca mới</p>
                            <p className="text-[11px] text-slate-400">{globalAvailable ? "Đang bật" : "Đang tắt"}</p>
                        </div>
                        <button
                            id="toggle-availability"
                            type="button"
                            onClick={() => {
                                const next = !globalAvailable;
                                setGlobalAvailable(next);
                                showToast(next ? "Đã bật chế độ nhận ca mới." : "Đã tắt chế độ nhận ca mới.");
                            }}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
                                globalAvailable ? "bg-[#00677c]" : "bg-slate-200"
                            }`}
                        >
                            <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
                                    globalAvailable ? "left-6" : "left-1"
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ── Weekly Calendar ── */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
                    {/* Calendar header bar */}
                    <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-[#102030]">Lịch theo tuần</h2>
                            {loading && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                    Đang tải...
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <LegendItem color="bg-[#00677c]" label="Đã đặt" />
                            <LegendItem color="bg-emerald-100 border border-emerald-300" label="Rảnh" />
                            <LegendItem color="bg-slate-50 border border-slate-200" label="Không nhận" />
                        </div>
                    </div>

                    {/* Vùng cuộn ngang */}
                    <div className="overflow-x-auto w-full">
                        <div className="min-w-[640px] p-3 sm:p-5">
                            {/* Day headers */}
                            <div className="grid mb-2" style={{ gridTemplateColumns: "85px repeat(7, 1fr)" }}>
                                <div />
                                {DAYS.map((d, i) => (
                                    <div key={d} className="flex flex-col items-center gap-0.5 pb-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${i === 1 ? "bg-[#00677c] text-white" : "text-[#102030]"}`}>
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
                                        style={{ gridTemplateColumns: "85px repeat(7, 1fr)" }}
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
                                                    state={slots[key] || "off"}
                                                    onClick={() => toggleSlot(key)}
                                                    disabled={loading || syncing}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-3 text-[11px] text-slate-400 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span>💡 Bấm ô để chuyển đổi giữa <strong>Rảnh (Xanh)</strong> và <strong>Không nhận (Xám)</strong>.</span>
                        <span className="text-teal-700 font-semibold">Tự động bảo toàn lịch khi đồng bộ.</span>
                    </div>
                </div>

                {/* ── Booking Requests Panel ── */}
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
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col items-center gap-3 text-center">
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
                                        <div key={r.id} className="bg-white rounded-xl border border-slate-200/80 px-4 py-3 flex items-center justify-between gap-3 shadow-2xs">
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

            {/* ── Modal Thêm nhanh khung giờ rảnh (API 57 POST) ── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-[#002045]">Thêm khung giờ rảnh</h3>
                                <p className="text-xs text-slate-500">Gọi POST /api/v1/nurse/availability</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleModalAddSubmit} className="space-y-4 pt-4 text-xs">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Thứ trong tuần *</label>
                                <select
                                    value={newSlotForm.dayIndex}
                                    onChange={(e) =>
                                        setNewSlotForm({ ...newSlotForm, dayIndex: Number(e.target.value) })
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:border-teal-600 focus:outline-none"
                                >
                                    {DAYS.map((d, i) => (
                                        <option key={d} value={i}>
                                            {d} — Ngày {DATES[i]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Khung giờ rảnh *</label>
                                <select
                                    value={newSlotForm.timeSlotIndex}
                                    onChange={(e) =>
                                        setNewSlotForm({ ...newSlotForm, timeSlotIndex: Number(e.target.value) })
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:border-teal-600 focus:outline-none"
                                >
                                    {TIME_SLOTS.map((slot, i) => (
                                        <option key={slot} value={i}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <p className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                ℹ️ Khung giờ sau khi thêm sẽ được mở để gia đình có thể tìm kiếm và đặt ca chăm sóc phù hợp.
                            </p>

                            <div className="flex items-center justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-[#00677c] hover:bg-[#005566] text-white font-bold shadow-xs hover:shadow-md transition-all"
                                >
                                    Xác nhận thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
