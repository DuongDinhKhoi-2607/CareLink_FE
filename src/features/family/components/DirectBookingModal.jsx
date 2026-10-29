import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    X,
    Calendar,
    Clock,
    User,
    MapPin,
    Check,
    CheckCircle2,
    ShieldCheck,
    AlertCircle,
    Loader2,
    Sparkles,
    CreditCard,
    QrCode,
    ExternalLink,
    Stethoscope,
    Lock,
    HelpCircle,
} from "lucide-react";
import familyApi from "../../../api/familyApi";

export default function DirectBookingModal({
    isOpen,
    onClose,
    caregiver,
    initialDate,
}) {
    const navigate = useNavigate();
    const nurseId = caregiver?.id || caregiver?.nurseId;
    const nurseName = caregiver?.name || caregiver?.fullName || "Điều dưỡng CareLink";
    const nurseAvatar = caregiver?.image || caregiver?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600";

    // ── DATA STATES ──
    const [recipients, setRecipients] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [services, setServices] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [dataError, setDataError] = useState("");

    // ── FORM INPUTS ──
    const [selectedRecipientId, setSelectedRecipientId] = useState("");
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const [extraMinutes, setExtraMinutes] = useState(0);

    // Ngày chọn lịch (mặc định hôm nay hoặc ngày truyền vào YYYY-MM-DD)
    const todayStr = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }, []);

    const [selectedDate, setSelectedDate] = useState(initialDate || todayStr);

    // ── SLOTS CINEMA (FE-02) ──
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlotIndexes, setSelectedSlotIndexes] = useState([]);

    // ── CONSENT & NOTES (FE-06) ──
    const [consentMedical, setConsentMedical] = useState(true);
    const [customerNotes, setCustomerNotes] = useState("");

    // ── SUBMISSION & PAYMENT POPUP STATES ──
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [bookingSuccessData, setBookingSuccessData] = useState(null); // Lưu kết quả trả về gồm paymentInfo

    // Load initial data (Recipients, Addresses, Nurse Services)
    useEffect(() => {
        if (!isOpen || !nurseId) return;

        let isMounted = true;
        setLoadingData(true);
        setDataError("");

        const loadFormData = async () => {
            try {
                const [recipientsRes, addressesRes, pricingRes] = await Promise.allSettled([
                    familyApi.getRecipients(),
                    familyApi.getAddresses(),
                    familyApi.getNursePricing(nurseId),
                ]);

                if (!isMounted) return;

                // 1. Người thân
                let recList = [];
                if (recipientsRes.status === "fulfilled") {
                    const raw = recipientsRes.value;
                    recList = Array.isArray(raw) ? raw : (raw?.data || raw?.items || []);
                    setRecipients(recList);
                    if (recList.length > 0) {
                        setSelectedRecipientId(recList[0].id || recList[0].recipientId);
                    }
                }

                // 2. Địa chỉ
                let addrList = [];
                if (addressesRes.status === "fulfilled") {
                    const raw = addressesRes.value;
                    addrList = Array.isArray(raw) ? raw : (raw?.data || raw?.items || []);
                    setAddresses(addrList);
                    if (addrList.length > 0) {
                        setSelectedAddressId(addrList[0].id || addrList[0].addressId);
                    }
                }

                // 3. Bảng giá dịch vụ của điều dưỡng
                if (pricingRes.status === "fulfilled") {
                    const raw = pricingRes.value;
                    const pricingList = Array.isArray(raw) ? raw : (raw?.data || []);
                    // Lọc những dịch vụ mà điều dưỡng nhận làm (isOffered !== false)
                    const offered = pricingList.filter((item) => item.isOffered !== false);
                    setServices(offered.length > 0 ? offered : pricingList);
                    if (offered.length > 0) {
                        setSelectedServiceIds([offered[0].serviceId || offered[0].id]);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error("[CareLink] Lỗi tải dữ liệu đặt lịch:", err);
                    setDataError("Không thể tải đầy đủ thông tin dịch vụ. Vui lòng thử lại!");
                }
            } finally {
                if (isMounted) setLoadingData(false);
            }
        };

        loadFormData();

        return () => {
            isMounted = false;
        };
    }, [isOpen, nurseId]);

    // Lấy Customer ID từ localStorage để gọi API available-slots
    const currentCustomerId = useMemo(() => {
        try {
            const raw = localStorage.getItem("carelink_user");
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed?.id || null;
        } catch {
            return null;
        }
    }, []);

    // ── TẢI DANH SÁCH SLOTS RẠP PHIM CHO NGÀY ĐƯỢC CHỌN ──
    const fetchSlots = useCallback(async (date) => {
        if (!nurseId || !date) return;
        setLoadingSlots(true);
        setSelectedSlotIndexes([]);
        try {
            const res = await familyApi.getAvailableSlots(nurseId, date, currentCustomerId);
            const data = res?.data || res;
            if (data?.slots && Array.isArray(data.slots)) {
                setSlots(data.slots);
            } else if (Array.isArray(data)) {
                setSlots(data);
            } else {
                setSlots([]);
            }
        } catch (err) {
            console.warn("[CareLink] Lỗi tải danh sách slots:", err);
            // Fallback 16 slots rạp phim chuẩn 06:00 - 22:00
            const fallbackSlots = [];
            for (let i = 6; i < 22; i++) {
                const startHour = String(i).padStart(2, "0") + ":00";
                const endHour = String(i + 1).padStart(2, "0") + ":00";
                fallbackSlots.push({
                    slotIndex: i - 6,
                    startTime: startHour,
                    endTime: endHour,
                    isAvailable: true,
                    reason: "Còn trống",
                });
            }
            setSlots(fallbackSlots);
        } finally {
            setLoadingSlots(false);
        }
    }, [nurseId, currentCustomerId]);

    // Kích hoạt load slots khi đổi ngày hoặc mở modal
    useEffect(() => {
        if (isOpen && selectedDate) {
            fetchSlots(selectedDate);
        }
    }, [isOpen, selectedDate, fetchSlots]);

    // Cập nhật selectedDate nếu prop initialDate thay đổi
    useEffect(() => {
        if (initialDate) {
            setSelectedDate(initialDate);
        }
    }, [initialDate]);

    // ── XỬ LÝ CHỌN DỊCH VỤ (COMBO) ──
    const handleToggleService = (serviceId) => {
        setSelectedServiceIds((prev) => {
            if (prev.includes(serviceId)) {
                // Không cho bỏ chọn hết, bắt buộc giữ ít nhất 1 dịch vụ
                if (prev.length === 1) return prev;
                return prev.filter((id) => id !== serviceId);
            }
            return [...prev, serviceId];
        });
    };

    // ── TÍNH TOÁN THỜI LƯỢNG ƯỚC TÍNH VÀ TIỀN DỊCH VỤ ──
    const { totalDurationMinutes, baseServicesPrice, platformFee, grandTotal } = useMemo(() => {
        let duration = 0;
        let basePrice = 0;

        selectedServiceIds.forEach((id) => {
            const svc = services.find((s) => (s.serviceId || s.id) === id);
            if (svc) {
                duration += (svc.customDurationMinutes || svc.durationMinutes || 60);
                basePrice += Number(svc.customPrice ?? svc.basePrice ?? 200000);
            }
        });

        duration += extraMinutes;

        // Phí nền tảng cố định 60.000 VNĐ theo ADR-002
        const fee = 60000;
        const total = basePrice + fee;

        return {
            totalDurationMinutes: duration,
            baseServicesPrice: basePrice,
            platformFee: fee,
            grandTotal: total,
        };
    }, [selectedServiceIds, services, extraMinutes]);

    // ── XỬ LÝ CHỌN SLOTS RẠP PHIM ──
    const handleSelectSlot = (slot) => {
        if (!slot.isAvailable) return;

        const idx = slot.slotIndex;
        // Cho phép chọn slot bắt đầu, hoặc click để toggle
        if (selectedSlotIndexes.includes(idx)) {
            setSelectedSlotIndexes(selectedSlotIndexes.filter((i) => i !== idx));
        } else {
            // Tự động chọn 1 slot đơn lẻ hoặc liền kề
            setSelectedSlotIndexes([idx]);
        }
    };

    // Tính thời gian bắt đầu và kết thúc ISO 8601 dựa trên slot đã chọn
    const calculatedTimes = useMemo(() => {
        if (selectedSlotIndexes.length === 0 || !selectedDate) {
            return { scheduledStart: null, scheduledEnd: null, displayTime: "" };
        }

        const sortedIndexes = [...selectedSlotIndexes].sort((a, b) => a - b);
        const firstSlot = slots.find((s) => s.slotIndex === sortedIndexes[0]);
        const lastSlot = slots.find((s) => s.slotIndex === sortedIndexes[sortedIndexes.length - 1]);

        if (!firstSlot) return { scheduledStart: null, scheduledEnd: null, displayTime: "" };

        const startTimeStr = firstSlot.startTime; // e.g. "08:00"
        const endTimeStr = lastSlot ? lastSlot.endTime : firstSlot.endTime; // e.g. "09:00"

        const startIso = `${selectedDate}T${startTimeStr}:00+07:00`;
        const endIso = `${selectedDate}T${endTimeStr}:00+07:00`;

        return {
            scheduledStart: startIso,
            scheduledEnd: endIso,
            displayTime: `${startTimeStr} - ${endTimeStr}, ngày ${new Date(selectedDate).toLocaleDateString("vi-VN")}`,
        };
    }, [selectedSlotIndexes, selectedDate, slots]);

    // ── SUBMIT ĐẶT CA TRỰC ──
    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        setSubmitError("");

        if (!selectedRecipientId) {
            setSubmitError("Vui lòng chọn hoặc thêm người thân cần chăm sóc.");
            return;
        }

        if (selectedServiceIds.length === 0) {
            setSubmitError("Vui lòng chọn ít nhất 1 dịch vụ chăm sóc.");
            return;
        }

        if (selectedSlotIndexes.length === 0 || !calculatedTimes.scheduledStart) {
            setSubmitError("Vui lòng chạm chọn ít nhất 1 khung giờ trực khả dụng trên lưới rạp phim.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                nurseId,
                recipientId: selectedRecipientId,
                serviceId: selectedServiceIds[0],
                serviceIds: selectedServiceIds,
                scheduledStart: calculatedTimes.scheduledStart,
                scheduledEnd: calculatedTimes.scheduledEnd,
                extraMinutes,
                addressId: selectedAddressId || null,
                consentShareMedicalRecords: consentMedical,
                customerNotes: customerNotes.trim() || null,
            };

            const res = await familyApi.createBooking(payload);
            const data = res?.data || res;

            // Thành công! Lưu data kết quả để mở VietQR popup
            setBookingSuccessData(data);
        } catch (err) {
            console.error("[CareLink] Lỗi đặt ca trực:", err);
            const status = err.response?.status;
            let msg = err.response?.data?.detail || err.response?.data?.message;
            if (!msg) {
                if (status === 409) {
                    msg = "Khung giờ này vừa có khách hàng khác đặt hoặc điều dưỡng có ca trực liền kề (vướng đệm di chuyển 60 phút). Vui lòng chọn khung giờ khác!";
                } else if (status === 422) {
                    msg = "Dữ liệu đặt ca chưa hợp lệ. Vui lòng kiểm tra lại dịch vụ và thời gian!";
                } else {
                    msg = "Không thể tạo lịch hẹn lúc này. Vui lòng kiểm tra lại kết nối mạng!";
                }
            }
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/65 p-3 sm:p-4 md:p-6 backdrop-blur-sm overflow-y-auto animate-[fadeIn_150ms_ease-out]"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !isSubmitting) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-3xl overflow-hidden rounded-[26px] sm:rounded-[30px] border border-slate-200/90 bg-white shadow-2xl my-auto max-h-[92vh] flex flex-col"
            >
                {/* ── HEADER MODAL ── */}
                <div className="relative border-b border-slate-100 bg-gradient-to-r from-teal-50/90 via-white to-slate-50/70 p-5 sm:p-6 pb-4 shrink-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5 sm:gap-4">
                            <img
                                src={nurseAvatar}
                                alt={nurseName}
                                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-teal-500/20 shrink-0"
                            />
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100/80 text-[#00677C] border border-teal-200/80 mb-1">
                                    <Sparkles className="w-3 h-3 text-[#00677C]" />
                                    Order Sheet 1 chạm • Cinema Slots
                                </div>
                                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                                    Đặt ca trực với {nurseName}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                    <span>Đệm di chuyển 60p tự động</span>
                                    <span>•</span>
                                    <span>Giữ chỗ 30 phút qua PayOS</span>
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer shrink-0"
                            title="Đóng cửa sổ"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ── NỘI DUNG CHÍNH (SCROLLABLE BODY) ── */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

                    {/* HIỂN THỊ LỖI NẾU CÓ */}
                    {submitError && (
                        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm animate-[shake_200ms_ease-in-out]">
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="flex-1 font-medium">{submitError}</div>
                        </div>
                    )}

                    {loadingData ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin text-[#00677C]" />
                            <p className="text-xs font-semibold">Đang chuẩn bị hồ sơ ca trực và danh mục dịch vụ...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleConfirmBooking} className="space-y-6">

                            {/* 1. CHỌN NGƯỜI THÂN CẦN CHĂM SÓC */}
                            <div className="space-y-2">
                                <label className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-[#00677C]" />
                                        1. Người thân cần chăm sóc <span className="text-rose-500">*</span>
                                    </span>
                                    <span className="text-[11px] font-normal text-slate-400 lowercase">
                                        ({recipients.length} hồ sơ sẵn có)
                                    </span>
                                </label>

                                {recipients.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {recipients.map((rec) => {
                                            const id = rec.id || rec.recipientId;
                                            const isSelected = selectedRecipientId === id;
                                            return (
                                                <button
                                                    key={id}
                                                    type="button"
                                                    onClick={() => setSelectedRecipientId(id)}
                                                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                                        isSelected
                                                            ? "border-[#00677C] bg-teal-50/50 ring-2 ring-[#00677C]/15"
                                                            : "border-slate-200 bg-white hover:border-slate-300"
                                                    }`}
                                                >
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-bold text-slate-900 truncate">
                                                            {rec.fullName || rec.name}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                                                            <span>{rec.relationship || "Người thân"}</span>
                                                            {rec.gender && <span>• {rec.gender}</span>}
                                                            {rec.age && <span>• {rec.age} tuổi</span>}
                                                        </div>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                                        isSelected ? "border-[#00677C] bg-[#00677C] text-white" : "border-slate-300 bg-white"
                                                    }`}>
                                                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-3.5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-600 flex items-center justify-between">
                                        <span>Chưa có hồ sơ người thân nào được lưu.</span>
                                        <button
                                            type="button"
                                            onClick={() => navigate("/dashboard/family-profile")}
                                            className="text-xs font-bold text-[#00677C] hover:underline cursor-pointer"
                                        >
                                            + Tạo hồ sơ người thân
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* 2. CHỌN ĐỊA CHỈ PHỤC VỤ TẠI NHÀ */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    <MapPin className="w-4 h-4 text-[#00677C]" />
                                    2. Địa chỉ tiếp nhận ca trực tại nhà
                                </label>
                                {addresses.length > 0 ? (
                                    <select
                                        value={selectedAddressId}
                                        onChange={(e) => setSelectedAddressId(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                                    >
                                        {addresses.map((addr) => {
                                            const id = addr.id || addr.addressId;
                                            return (
                                                <option key={id} value={id}>
                                                    {addr.label ? `[${addr.label}] ` : ""}{addr.streetAddress || addr.addressLine}, {addr.district || ""}, {addr.city || ""}
                                                </option>
                                            );
                                        })}
                                    </select>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">
                                        Hệ thống sẽ sử dụng địa chỉ đăng ký trên hồ sơ người bệnh.
                                    </p>
                                )}
                            </div>

                            {/* 3. COMBO DỊCH VỤ ĐIỀU DƯỠNG TIẾP NHẬN */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        <Stethoscope className="w-4 h-4 text-[#00677C]" />
                                        3. Chọn dịch vụ trong ca (Combo đa nhiệm) <span className="text-rose-500">*</span>
                                    </label>
                                    <span className="text-xs font-bold text-[#00677C]">
                                        {selectedServiceIds.length} dịch vụ • ~{totalDurationMinutes} phút
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {services.map((svc) => {
                                        const id = svc.serviceId || svc.id;
                                        const isChecked = selectedServiceIds.includes(id);
                                        const price = Number(svc.customPrice ?? svc.basePrice ?? 200000);
                                        const duration = svc.customDurationMinutes || svc.durationMinutes || 60;

                                        return (
                                            <div
                                                key={id}
                                                onClick={() => handleToggleService(id)}
                                                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                                    isChecked
                                                        ? "border-teal-500 bg-teal-50/40 ring-1 ring-teal-500/30"
                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                                                        isChecked ? "border-[#00677C] bg-[#00677C] text-white" : "border-slate-300 bg-white"
                                                    }`}>
                                                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-900">
                                                            {svc.serviceName}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                                                            <span className="inline-flex items-center gap-1 text-slate-600">
                                                                <Clock className="w-3 h-3 text-slate-400" />
                                                                {duration} phút
                                                            </span>
                                                            {svc.requiresLicense && (
                                                                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold border border-amber-200">
                                                                    CCHN y tế
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <div className="text-xs font-extrabold text-slate-900">
                                                        {price.toLocaleString("vi-VN")} đ
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-medium">
                                                        Đơn giá điều dưỡng
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Thêm thời gian phát sinh nếu gia đình muốn */}
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                                    <span className="font-semibold text-slate-700">Chăm sóc phát sinh (Extra Time):</span>
                                    <div className="flex items-center gap-2">
                                        {[0, 30, 60, 90].map((mins) => (
                                            <button
                                                key={mins}
                                                type="button"
                                                onClick={() => setExtraMinutes(mins)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                                    extraMinutes === mins
                                                        ? "bg-[#00677C] text-white"
                                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                                                }`}
                                            >
                                                +{mins}p
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 4. LƯỚI CHỌN SUẤT TRỰC RẠP PHIM (CINEMA SLOTS - FE-02) */}
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        <Calendar className="w-4 h-4 text-[#00677C]" />
                                        4. Suất trực khả dụng (Cinema Slot Picker) <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-slate-500 font-medium">Ngày trực:</span>
                                        <input
                                            type="date"
                                            min={todayStr}
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="px-3 py-1 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:border-teal-500 outline-none cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Legend giải thích các ô slot kiểu rạp phim */}
                                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3.5 h-3.5 rounded-md bg-emerald-50 border border-emerald-300"></span>
                                        <span>Khả dụng (Còn trống)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3.5 h-3.5 rounded-md bg-[#00677C] text-white"></span>
                                        <span className="font-semibold text-slate-700">Đang chọn</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-300"></span>
                                        <span>Đã khóa / Đệm 60p</span>
                                    </div>
                                </div>

                                {/* Lưới 16 Slot Cinema */}
                                {loadingSlots ? (
                                    <div className="py-8 flex items-center justify-center gap-2 text-slate-400">
                                        <Loader2 className="w-5 h-5 animate-spin text-[#00677C]" />
                                        <span className="text-xs">Đang kiểm tra lịch trống và đệm di chuyển 60 phút...</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {slots.map((slot) => {
                                            const isSelected = selectedSlotIndexes.includes(slot.slotIndex);
                                            const isAvailable = slot.isAvailable;

                                            return (
                                                <button
                                                    key={slot.slotIndex}
                                                    type="button"
                                                    disabled={!isAvailable}
                                                    onClick={() => handleSelectSlot(slot)}
                                                    title={!isAvailable ? (slot.reason || "Không khả dụng") : "Nhấn để chọn khung giờ này"}
                                                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer relative ${
                                                        isSelected
                                                            ? "border-[#00677C] bg-[#00677C] text-white shadow-md scale-[1.02]"
                                                            : isAvailable
                                                            ? "border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 hover:border-emerald-400"
                                                            : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                                                    }`}
                                                >
                                                    <span className="text-xs font-black tracking-tight">
                                                        {slot.startTime} - {slot.endTime}
                                                    </span>
                                                    <span className={`text-[10px] font-bold ${
                                                        isSelected
                                                            ? "text-teal-100"
                                                            : isAvailable
                                                            ? "text-emerald-700"
                                                            : "text-slate-400"
                                                    }`}>
                                                        {isSelected ? "Đã chọn" : isAvailable ? "Còn trống" : (slot.reason?.includes("đệm") ? "Đệm 60p" : "Đã kín")}
                                                    </span>
                                                    {!isAvailable && (
                                                        <Lock className="w-3 h-3 absolute top-1.5 right-1.5 text-slate-400" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {calculatedTimes.displayTime && (
                                    <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-[#00677C] font-bold flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#00677C] shrink-0" />
                                        <span>Khung giờ đã chọn: {calculatedTimes.displayTime}</span>
                                    </div>
                                )}
                            </div>

                            {/* 5. GHI CHÚ VÀ CHECKBOX ĐỒNG Ý BỆNH ÁN (FE-06) */}
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Ghi chú dặn dò cho điều dưỡng (Tùy chọn)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Bác hay chóng mặt khi ngồi dậy; bấm chuông cửa số 2..."
                                        value={customerNotes}
                                        onChange={(e) => setCustomerNotes(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 outline-none"
                                    />
                                </div>

                                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={consentMedical}
                                        onChange={(e) => setConsentMedical(e.target.checked)}
                                        className="w-4 h-4 mt-0.5 text-[#00677C] rounded border-slate-300 focus:ring-teal-500 cursor-pointer shrink-0"
                                    />
                                    <span className="text-xs text-slate-700 leading-relaxed font-medium">
                                        <strong className="text-slate-900">Quyền riêng tư y tế:</strong> Tôi đồng ý chia sẻ tóm tắt hồ sơ sức khỏe và tiền sử bệnh án của người thân cho Điều dưỡng tiếp nhận ca này (theo tiêu chuẩn bảo mật y tế CareLink).
                                    </span>
                                </label>
                            </div>

                            {/* 6. BẢNG TỔNG KẾT CHI PHÍ MINH BẠCH (ADR-002) */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/30 border border-slate-200/90 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Tổng tiền dịch vụ chăm sóc ({selectedServiceIds.length} dịch vụ):</span>
                                    <span className="font-bold text-slate-900">{baseServicesPrice.toLocaleString("vi-VN")} đ</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span className="flex items-center gap-1">
                                        <span>Phí bảo hiểm & Nền tảng CareLink (cố định):</span>
                                        <span title="Bảo hiểm trách nhiệm y tế + Vận hành hệ thống giữ chỗ PayOS 30 phút" className="cursor-help text-slate-400">
                                            <HelpCircle className="w-3.5 h-3.5" />
                                        </span>
                                    </span>
                                    <span className="font-bold text-slate-900">{platformFee.toLocaleString("vi-VN")} đ</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm sm:text-base font-black text-slate-900">
                                    <span className="text-[#00677C]">Tổng thanh toán tạm giữ (Escrow):</span>
                                    <span className="text-[#00677C] text-base sm:text-lg">
                                        {grandTotal.toLocaleString("vi-VN")} đ
                                    </span>
                                </div>
                            </div>

                            {/* 7. NÚT XÁC NHẬN ĐẶT LỊCH */}
                            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || selectedSlotIndexes.length === 0}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] text-xs sm:text-sm font-extrabold text-white shadow-md hover:from-[#005566] hover:to-[#007489] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Đang tạo ca & khởi tạo PayOS...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4 text-teal-200" />
                                            <span>Xác nhận đặt lịch & Thanh toán VietQR</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* ── POPUP THÔNG BÁO THANH TOÁN VIETQR PAYOS (NẾU ĐẶT THÀNH CÔNG) ── */}
            {bookingSuccessData && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-[fadeIn_150ms_ease-out]">
                    <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-[#00677C] flex items-center justify-center mx-auto shadow-inner">
                            <QrCode className="w-8 h-8" />
                        </div>

                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                                Đã giữ chỗ thành công (30 phút)
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-2">
                                Thanh toán ca trực CareLink
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Mã ca trực: <strong className="text-slate-800">{bookingSuccessData.id?.slice(0, 8)}</strong> • Số tiền: <strong className="text-[#00677C]">{grandTotal.toLocaleString("vi-VN")} đ</strong>
                            </p>
                        </div>

                        {/* VietQR Code nếu có */}
                        {bookingSuccessData.paymentInfo?.qrCode ? (
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center">
                                <img
                                    src={bookingSuccessData.paymentInfo.qrCode}
                                    alt="VietQR PayOS"
                                    className="w-48 h-48 object-contain rounded-xl border border-white shadow-xs"
                                />
                                <p className="text-[11px] text-slate-500 mt-2">
                                    Quét mã bằng ứng dụng Ngân hàng bất kỳ để thanh toán an toàn
                                </p>
                            </div>
                        ) : null}

                        <div className="space-y-2 pt-2">
                            {bookingSuccessData.paymentInfo?.checkoutUrl && (
                                <a
                                    href={bookingSuccessData.paymentInfo.checkoutUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-3 rounded-xl bg-[#00677c] text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-[#005566] transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Mở cổng thanh toán PayOS</span>
                                    <ExternalLink className="w-4 h-4 text-teal-200" />
                                </a>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    setBookingSuccessData(null);
                                    onClose();
                                    navigate("/dashboard/appointments");
                                }}
                                className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                            >
                                Xem danh sách ca chăm sóc của tôi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
