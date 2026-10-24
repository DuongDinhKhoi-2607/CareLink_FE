import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import caregiverApi from "../../../api/caregiverApi";

/* ─── Constants & Helpers ─── */
const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const TIME_SLOTS = [
    "06:00 – 08:00",
    "08:00 – 10:00",
    "10:00 – 12:00",
    "12:00 – 14:00",
    "14:00 – 16:00",
    "16:00 – 18:00",
    "18:00 – 20:00",
    "20:00 – 22:00",
];

// Chuyển đổi chỉ số ngày Frontend (0=T2..6=CN) sang chuẩn Backend DayOfWeek (0=CN, 1=T2..6=T7)
const feIndexToBeDay = (d) => (d === 6 ? 0 : d + 1);
const beDayToFeIndex = (beDay) => (beDay === 0 ? 6 : beDay - 1);

/* Khởi tạo toàn bộ slot là "off" cho đến khi API getAvailability trả về dữ liệu */
const initSlots = () => {
    const map = {};
    DAYS.forEach((_, d) => {
        TIME_SLOTS.forEach((_, t) => {
            map[`${d}-${t}`] = "off";
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
    const [weekOffset, setWeekOffset] = useState(0);
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

    // ── Luồng 2: Quản lý Ngày bận đột xuất (Blackout Dates) & Nhận việc ──
    const [unavailabilities, setUnavailabilities] = useState([]);
    const [loadingUnavail, setLoadingUnavail] = useState(false);
    const [unavailForm, setUnavailForm] = useState({
        date: "",
        reason: "",
    });
    const [addingUnavail, setAddingUnavail] = useState(false);
    const [togglingAccepting, setTogglingAccepting] = useState(false);

    // Tính toán ngày thực tế của tuần đang chọn
    const weekData = useMemo(() => {
        const now = new Date();
        const currentDay = now.getDay(); // 0 = CN, 1 = T2
        const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

        const monday = new Date(now);
        monday.setDate(now.getDate() + diffToMonday + weekOffset * 7);
        monday.setHours(0, 0, 0, 0);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            const isToday = d.toDateString() === now.toDateString();
            days.push({
                dayName: DAYS[i],
                dateLabel: `${day}/${month}`,
                fullDateStr: `${day}/${month}/${year}`,
                isToday,
            });
        }

        const startLabel = days[0].dateLabel;
        const endLabel = days[6].dateLabel;
        const year = monday.getFullYear();
        let weekTag = "";
        if (weekOffset === 0) weekTag = " (Tuần này)";
        else if (weekOffset === 1) weekTag = " (Tuần sau)";
        else if (weekOffset === -1) weekTag = " (Tuần trước)";
        else if (weekOffset > 1) weekTag = ` (+${weekOffset} tuần)`;
        else weekTag = ` (${weekOffset} tuần)`;

        const title = `Tuần ${startLabel} – ${endLabel}/${year}${weekTag}`;
        return { days, title };
    }, [weekOffset]);

    const [globalAvailable, setGlobalAvailable] = useState(true);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // ── Luồng 2: Lấy danh sách ngày bận/nghỉ đột xuất (Blackout Dates) ──
    const fetchUnavailabilities = useCallback(async () => {
        setLoadingUnavail(true);
        try {
            const res = await caregiverApi.getUnavailabilities();
            const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : res?.items || [];
            setUnavailabilities(items);
        } catch (err) {
            console.warn("Lỗi tải danh sách ngày nghỉ đột xuất:", err);
        } finally {
            setLoadingUnavail(false);
        }
    }, []);

    useEffect(() => {
        fetchUnavailabilities();
    }, [fetchUnavailabilities]);

    // Đồng bộ trạng thái IsAcceptingBookings từ Profile
    useEffect(() => {
        caregiverApi
            .getProfile()
            .then((res) => {
                const data = res?.data || res;
                if (data?.isAcceptingBookings !== undefined) {
                    setGlobalAvailable(Boolean(data.isAcceptingBookings));
                }
            })
            .catch(() => {});
    }, []);

    // ── Luồng 2: Bật/Tắt chế độ nhận ca (PATCH /api/v1/nurse/status/accepting-bookings) ──
    const handleToggleAcceptingBookings = async () => {
        const next = !globalAvailable;
        setGlobalAvailable(next);
        setTogglingAccepting(true);
        try {
            await caregiverApi.setAcceptingBookings(next);
            showToast(
                next
                    ? "✓ Đã BẬT nhận ca (Online). Hồ sơ sẽ hiển thị khi khách tìm kiếm."
                    : "✓ Đã TẮT nhận ca (Offline). Hồ sơ tạm ẩn khỏi kết quả tìm kiếm."
            );
        } catch (err) {
            setGlobalAvailable(!next); // Hoàn tác
            showToast("⚠️ Không thể cập nhật trạng thái nhận việc. Vui lòng thử lại!");
        } finally {
            setTogglingAccepting(false);
        }
    };

    // ── Luồng 2: Đăng ký ngày bận đột xuất (POST /api/v1/nurse/unavailabilities) ──
    const handleAddUnavailability = async (e) => {
        e.preventDefault();
        if (!unavailForm.date) {
            showToast("⚠️ Vui lòng chọn ngày nghỉ.");
            return;
        }
        setAddingUnavail(true);
        try {
            await caregiverApi.addUnavailability({
                date: unavailForm.date,
                reason: unavailForm.reason.trim() || "Bận việc đột xuất",
            });
            showToast(`✓ Đã đăng ký ngày nghỉ đột xuất: ${unavailForm.date}`);
            setUnavailForm({ date: "", reason: "" });
            fetchUnavailabilities();
        } catch (err) {
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Không thể đăng ký ngày nghỉ. Ngày này có thể đã được đăng ký trước đó.";
            showToast(`⚠️ ${msg}`);
        } finally {
            setAddingUnavail(false);
        }
    };

    // ── Luồng 2: Hủy đăng ký ngày bận (DELETE /api/v1/nurse/unavailabilities/{id}) ──
    const handleDeleteUnavailability = async (id, dateStr) => {
        try {
            await caregiverApi.deleteUnavailability(id);
            showToast(`✓ Đã hủy ngày nghỉ: ${dateStr}`);
            setUnavailabilities((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            showToast("⚠️ Không thể hủy ngày nghỉ. Vui lòng thử lại!");
        }
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

            const newSlots = {};
            const newMeta = {};

            // Khởi tạo toàn bộ slot là "off"
            DAYS.forEach((_, d) => {
                TIME_SLOTS.forEach((_, t) => {
                    newSlots[`${d}-${t}`] = "off";
                });
            });

            if (items.length > 0) {
                items.forEach((item) => {
                    let dayIndices = [];
                    if (item.dayOfWeek === null || item.dayOfWeek === undefined) {
                        // null / undefined nghĩa là rảnh TẤT CẢ các ngày trong tuần
                        dayIndices = [0, 1, 2, 3, 4, 5, 6];
                    } else if (typeof item.dayOfWeek === "number") {
                        dayIndices = [beDayToFeIndex(item.dayOfWeek)];
                    } else if (typeof item.dayOfWeek === "string") {
                        const idx = DAYS.findIndex(
                            (day) => day.toLowerCase() === item.dayOfWeek.toLowerCase()
                        );
                        if (idx !== -1) dayIndices = [idx];
                    }

                    const itemStart = (item.startTime || "").slice(0, 5); // "HH:mm"
                    const itemEnd = (item.endTime || "").slice(0, 5);     // "HH:mm"

                    dayIndices.forEach((d) => {
                        if (d >= 0 && d < 7) {
                            TIME_SLOTS.forEach((slotStr, t) => {
                                const [slotStart, slotEnd] = slotStr.split("–").map((s) => s.trim());
                                // Đánh dấu rảnh nếu ô slot nằm trong dải thời gian rảnh của server
                                if (itemStart <= slotStart && itemEnd >= slotEnd) {
                                    const key = `${d}-${t}`;
                                    newSlots[key] = item.isBooked || item.status === "booked" ? "booked" : "available";
                                    newMeta[key] = { id: item.id, ...item };
                                }
                            });
                        }
                    });
                });
            }

            setSlots(newSlots);
            setSlotMeta(newMeta);
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
                dayOfWeek: feIndexToBeDay(d),
                startTime: start.length === 5 ? `${start}:00` : start,
                endTime: end.length === 5 ? `${end}:00` : end,
                isActive: true,
            };
            const res = await caregiverApi.addAvailability(payload);
            const created = res?.data || res;
            if (created?.id) {
                setSlotMeta((prev) => ({ ...prev, [key]: { id: created.id, ...created } }));
            }
            showToast(`✓ Đã thêm khung giờ rảnh: ${DAYS[d]} (${slotStr})`);
        } catch (err) {
            console.error("Lỗi thêm khung giờ rảnh:", err);
            showToast(`Đã bật khung giờ: ${DAYS[d]} (${slotStr}). Nhấn "Lưu & Đồng bộ lịch tuần" để lưu!`);
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
    // Tự động HỢP NHẤT các khung giờ liền kề (Contiguous Slot Merging) để bao trùm mọi ca nhận
    const handleSyncSchedule = async () => {
        setSyncing(true);
        try {
            const schedules = [];
            DAYS.forEach((_, d) => {
                const activeInDay = [];
                TIME_SLOTS.forEach((slotStr, t) => {
                    const key = `${d}-${t}`;
                    if (slots[key] === "available") {
                        const [start, end] = slotStr.split("–").map((s) => s.trim());
                        activeInDay.push({
                            start: start.length === 5 ? `${start}:00` : start,
                            end: end.length === 5 ? `${end}:00` : end,
                        });
                    }
                });

                if (activeInDay.length > 0) {
                    // Sắp xếp theo startTime
                    activeInDay.sort((a, b) => a.start.localeCompare(b.start));

                    // Hợp nhất các khung giờ liền nhau: ví dụ 08:00-10:00 & 10:00-12:00 -> 08:00-12:00
                    const merged = [activeInDay[0]];
                    for (let i = 1; i < activeInDay.length; i++) {
                        const curr = activeInDay[i];
                        const last = merged[merged.length - 1];
                        if (curr.start <= last.end) {
                            if (curr.end > last.end) {
                                last.end = curr.end;
                            }
                        } else {
                            merged.push(curr);
                        }
                    }

                    const beDay = feIndexToBeDay(d);
                    merged.forEach((m) => {
                        schedules.push({
                            dayOfWeek: beDay,
                            startTime: m.start,
                            endTime: m.end,
                            isActive: true,
                        });
                    });
                }
            });

            // Gửi chuẩn DTO SetNurseAvailabilityRequest: { schedules: [...] }
            await caregiverApi.setAvailability({ schedules });

            showToast(`✓ Đã lưu thành công ${schedules.length} dải lịch rảnh vào cơ sở dữ liệu!`);
            await fetchAvailability();
        } catch (err) {
            console.error("Lỗi đồng bộ lịch rảnh:", err);
            const msg = err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data?.title || "Không thể đồng bộ lịch rảnh. Vui lòng thử lại!";
            showToast(`⚠️ ${msg}`);
        } finally {
            setSyncing(false);
        }
    };

    // ── Quick Presets (Thao tác nhanh 1 chạm) ──
    const handleSetAllWeekAvailable = () => {
        const newSlots = {};
        DAYS.forEach((_, d) => {
            TIME_SLOTS.forEach((_, t) => {
                newSlots[`${d}-${t}`] = "available";
            });
        });
        setSlots(newSlots);
        showToast("✓ Đã bật rảnh cả tuần (06:00 – 22:00). Nhấn 'Lưu & Đồng bộ lịch tuần' để hoàn tất!");
    };

    const handleSetTodayAvailable = () => {
        const now = new Date();
        const currentDay = now.getDay(); // 0=CN, 1=T2...
        const feDay = beDayToFeIndex(currentDay);
        setSlots((prev) => {
            const next = { ...prev };
            TIME_SLOTS.forEach((_, t) => {
                next[`${feDay}-${t}`] = "available";
            });
            return next;
        });
        showToast(`✓ Đã bật rảnh cả ngày hôm nay (${DAYS[feDay]}). Nhấn 'Lưu & Đồng bộ lịch tuần' để lưu!`);
    };

    const handleClearAllSlots = () => {
        const newSlots = {};
        DAYS.forEach((_, d) => {
            TIME_SLOTS.forEach((_, t) => {
                newSlots[`${d}-${t}`] = "off";
            });
        });
        setSlots(newSlots);
        showToast("Đã dọn trống lịch. Nhấn 'Lưu & Đồng bộ lịch tuần' nếu muốn làm sạch hệ thống!");
    };

    // Modal submit: Thêm khung giờ rảnh rõ ràng
    const handleModalAddSubmit = async (e) => {
        e.preventDefault();
        setIsAddModalOpen(false);
        await handleAddSlot(newSlotForm.dayIndex, newSlotForm.timeSlotIndex);
    };



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
                    <p className="text-sm text-slate-500 mt-0.5 font-medium">{weekData.title} · (Chạm vào ô để bật/tắt giờ rảnh)</p>

                    {/* Quick Presets Bar */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Cài nhanh:</span>
                        <button
                            type="button"
                            onClick={handleSetAllWeekAvailable}
                            className="px-2.5 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all border border-teal-200/80 cursor-pointer shadow-2xs"
                            title="Bật rảnh toàn bộ các ngày từ Thứ 2 đến Chủ nhật"
                        >
                            ⚡ Bật rảnh cả tuần (06:00 – 22:00)
                        </button>
                        <button
                            type="button"
                            onClick={handleSetTodayAvailable}
                            className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all border border-emerald-200/80 cursor-pointer shadow-2xs"
                            title="Bật rảnh toàn bộ khung giờ cho ngày hôm nay"
                        >
                            📅 Bật rảnh hôm nay
                        </button>
                        <button
                            type="button"
                            onClick={handleClearAllSlots}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-all cursor-pointer"
                            title="Tắt toàn bộ để cài lại"
                        >
                            Dọn trống
                        </button>
                    </div>
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

                    {/* Nút Đồng bộ / Lưu lịch rảnh */}
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
                        <span>{syncing ? "Đang lưu..." : "Lưu & Đồng bộ lịch tuần"}</span>
                    </button>

                    {/* Global availability toggle (Luồng 2: IsAcceptingBookings) */}
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-2xs">
                        <div>
                            <p className="text-xs font-bold text-[#102030]">Nhận ca mới</p>
                            <p className="text-[11px] text-slate-400">
                                {togglingAccepting ? "Đang lưu..." : globalAvailable ? "Đang bật (Online)" : "Đang tắt (Offline)"}
                            </p>
                        </div>
                        <button
                            id="toggle-availability"
                            type="button"
                            disabled={togglingAccepting}
                            onClick={handleToggleAcceptingBookings}
                            title="Bật/Tắt chế độ nhận ca (Online/Offline)"
                            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer disabled:opacity-50 ${
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

            {/* ── Weekly Calendar (Full-Width Option 1) ── */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
                {/* Calendar header bar */}
                <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-sm font-bold text-[#102030]">Lịch theo tuần</h2>
                        
                        {/* Nút điều hướng tuần */}
                        <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/80">
                            <button
                                type="button"
                                onClick={() => setWeekOffset((w) => w - 1)}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-[#00677c] hover:bg-white rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                title="Xem tuần trước"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                                Tuần trước
                            </button>
                            <button
                                type="button"
                                onClick={() => setWeekOffset(0)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                    weekOffset === 0
                                        ? "bg-[#00677c] text-white shadow-2xs"
                                        : "text-slate-600 hover:text-[#00677c] hover:bg-white"
                                }`}
                                title="Quay về tuần hiện tại"
                            >
                                Tuần này
                            </button>
                            <button
                                type="button"
                                onClick={() => setWeekOffset((w) => w + 1)}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-[#00677c] hover:bg-white rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                title="Xem tuần sau"
                            >
                                Tuần sau
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>

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

                {/* Vùng cuộn ngang / hiển thị lịch 100% full width */}
                <div className="overflow-x-auto w-full">
                    <div className="min-w-[720px] p-4 sm:p-6">
                        {/* Day headers */}
                        <div className="grid mb-2" style={{ gridTemplateColumns: "90px repeat(7, 1fr)" }}>
                            <div />
                            {weekData.days.map((item) => (
                                <div key={item.dayName} className="flex flex-col items-center gap-0.5 pb-1">
                                    <span className={`text-[11px] font-bold uppercase ${item.isToday ? "text-[#00677c]" : "text-slate-400"}`}>
                                        {item.dayName}
                                    </span>
                                    <span className={`text-xs font-bold px-3 py-0.5 rounded-full transition-all ${
                                        item.isToday
                                            ? "bg-[#00677c] text-white shadow-2xs ring-2 ring-teal-200"
                                            : "text-[#102030]"
                                    }`}>
                                        {item.dateLabel}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Slot grid */}
                        <div className="space-y-2">
                            {TIME_SLOTS.map((slot, t) => (
                                <div
                                    key={slot}
                                    className="grid gap-2"
                                    style={{ gridTemplateColumns: "90px repeat(7, 1fr)" }}
                                >
                                    <div className="flex items-center justify-end pr-2.5">
                                        <span className="text-[10px] font-semibold text-slate-400 text-right leading-tight">
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

                {/* Calendar footer & link to Yêu cầu nhận ca */}
                <div className="px-5 py-3.5 text-xs text-slate-500 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span>💡 Bấm trực tiếp vào từng ô để đổi giữa <strong>Rảnh (Xanh)</strong> và <strong>Không nhận (Xám)</strong>.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-[11px]">Cần xem đơn nhận việc?</span>
                        <Link
                            to="/caregiver/bookings"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#00677c] font-bold text-xs border border-teal-200 transition-all shadow-2xs"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                            Mở Tab Yêu cầu nhận ca
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Luồng 2: Quản lý Ngày bận / Nghỉ phép đột xuất (Blackout Dates) ── */}
            <div className="mt-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/60">
                                Lịch nghỉ đột xuất
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                ({unavailabilities.length} ngày đã đăng ký nghỉ)
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-[#102030]">Lịch nghỉ đột xuất & Ngày bận</h2>
                        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                            Đăng ký các ngày bạn bận thi cử, về quê hoặc có việc gia đình đột xuất. Trong các ngày này, hệ thống sẽ <strong>tự động ẩn bạn khỏi kết quả tìm kiếm</strong> và từ chối các lượt đặt lịch mới mà không làm mất cấu hình lịch rảnh hàng tuần.
                        </p>
                    </div>
                </div>

                {/* Form đăng ký ngày nghỉ */}
                <form onSubmit={handleAddUnavailability} className="mt-5 p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex flex-col md:flex-row items-end gap-3">
                    <div className="w-full md:w-56">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Ngày xin nghỉ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={unavailForm.date}
                            onChange={(e) => setUnavailForm((prev) => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:border-teal-600 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Lý do xin nghỉ (Tùy chọn)
                        </label>
                        <input
                            type="text"
                            placeholder="Ví dụ: Bận thi kết thúc môn, về quê, việc cá nhân..."
                            value={unavailForm.reason}
                            onChange={(e) => setUnavailForm((prev) => ({ ...prev, reason: e.target.value }))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:border-teal-600 focus:outline-none placeholder:text-slate-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={addingUnavail || !unavailForm.date}
                        className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-50 cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                    >
                        {addingUnavail ? "Đang lưu..." : "+ Đăng ký ngày nghỉ"}
                    </button>
                </form>

                {/* Danh sách ngày nghỉ đã đăng ký */}
                <div className="mt-6">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                        Danh sách các ngày bận đã đăng ký
                    </h3>
                    {loadingUnavail ? (
                        <p className="text-xs text-slate-400 py-3">Đang tải danh sách ngày nghỉ...</p>
                    ) : unavailabilities.length === 0 ? (
                        <div className="py-8 text-center rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                            Hiện bạn chưa đăng ký ngày nghỉ đột xuất nào. Lịch làm việc đang hoàn toàn sẵn sàng!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {unavailabilities.map((item) => {
                                const d = new Date(item.date);
                                const formattedDate = isNaN(d.getTime()) ? item.date : d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
                                return (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-rose-200/80 bg-rose-50/40 p-3.5 flex items-start justify-between gap-3 shadow-2xs hover:shadow-xs transition-all"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                                                <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formattedDate}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-1 truncate" title={item.reason || "Nghỉ đột xuất"}>
                                                {item.reason || "Nghỉ việc riêng"}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteUnavailability(item.id, formattedDate)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/60 transition-colors cursor-pointer"
                                            title="Hủy đăng ký ngày nghỉ này"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal Thêm nhanh khung giờ rảnh (API 57 POST) ── */}
            {isAddModalOpen && typeof document !== "undefined" && createPortal(
                <div className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 relative my-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-[#002045]">Thêm khung giờ rảnh</h3>
                                <p className="text-xs text-slate-500">Thêm khung giờ định kỳ sẵn sàng nhận ca</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
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
                                            {d} — Ngày {weekData.days[i]?.dateLabel || ""}
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
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-[#00677c] hover:bg-[#005566] text-white font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                                >
                                    Xác nhận thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
