import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    X,
    Clock,
    User,
    MapPin,
    Check,
    AlertCircle,
    Loader2,
    Sparkles,
    Stethoscope,
    Plus,
    Minus,
    AlertTriangle,
    UserPlus,
    Info,
    ArrowLeft,
    ArrowRight,
    CalendarClock,
    ShieldCheck,
    ShieldAlert,
} from "lucide-react";
import familyApi from "../../../api/familyApi";
import conversationApi from "../../../api/conversationApi";

// ── BỘ CHỈ BÁO TIẾN TRÌNH 3 BƯỚC (NỘI BỘ) ──
const BOOKING_STEPS = [
    {
        step: 1,
        title: "Người nhận & Địa chỉ",
        subtitle: "Hồ sơ chăm sóc",
        icon: User,
    },
    {
        step: 2,
        title: "Dịch vụ & Khung giờ",
        subtitle: "Gói & Suất trực",
        icon: CalendarClock,
    },
    {
        step: 3,
        title: "Xác nhận & Chi phí",
        subtitle: "Bảo đảm minh bạch",
        icon: ShieldCheck,
    },
];

function BookingStepIndicator({ currentStep, onSelectStep, maxReachedStep = 1 }) {
    return (
        <div className="w-full bg-slate-50/80 border-b border-slate-200/80 px-4 sm:px-6 py-3 shrink-0">
            <nav aria-label="Các bước đặt lịch" className="flex items-center justify-between max-w-xl mx-auto relative">
                {/* Connecting background progress track */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
                <div
                    className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#00677C] transition-all duration-300 -z-0"
                    style={{
                        width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "calc(100% - 3rem)",
                    }}
                />

                {BOOKING_STEPS.map((s) => {
                    const isCompleted = s.step < currentStep;
                    const isCurrent = s.step === currentStep;
                    const isClickable = s.step <= maxReachedStep;
                    const IconComp = s.icon;

                    return (
                        <button
                            key={s.step}
                            type="button"
                            disabled={!isClickable}
                            onClick={() => isClickable && onSelectStep && onSelectStep(s.step)}
                            aria-current={isCurrent ? "step" : undefined}
                            className={`flex flex-col items-center gap-1.5 relative z-10 transition-all ${
                                isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-75"
                            }`}
                        >
                            <div
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 border-2 ${
                                    isCurrent
                                        ? "bg-[#00677C] text-white border-[#00677C] ring-4 ring-teal-500/20 shadow-md scale-105"
                                        : isCompleted
                                        ? "bg-teal-600 text-white border-teal-600"
                                        : "bg-white text-slate-400 border-slate-300"
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                ) : (
                                    <IconComp className="w-4 h-4" />
                                )}
                            </div>
                            <div className="text-center">
                                <span
                                    className={`block text-[11px] sm:text-xs font-bold leading-tight ${
                                        isCurrent
                                            ? "text-[#00677C]"
                                            : isCompleted
                                            ? "text-slate-800"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {s.title}
                                </span>
                                <span className="hidden sm:block text-[10px] text-slate-500 font-medium">
                                    {s.subtitle}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

// ── ĐỊNH DẠNG ĐỊA CHỈ TRỰC QUAN & ĐẦY ĐỦ ──
const formatAddressDisplay = (addr) => {
    if (!addr) return "Địa chỉ mặc định";
    if (addr.fullAddress && addr.fullAddress.trim()) {
        return addr.fullAddress.trim();
    }
    const street = (addr.streetAddress || addr.addressLine || "").trim();
    const ward = (addr.ward || "").trim();
    const district = (addr.district || "").trim();
    const city = (addr.city || "").trim();
    const parts = [street, ward, district, city].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Địa chỉ mặc định";
};

export default function DirectBookingModal({
    isOpen,
    onClose,
    caregiver,
    nurseId: propNurseId,
    nurseName: propNurseName,
    nurseAvatar: propNurseAvatar,
    conversationId,
    onProposalCreated,
    initialDate,
}) {
    const navigate = useNavigate();

    // Hỗ trợ cả 2 cách truyền props: qua object `caregiver` hoặc trực tiếp qua `nurseId`, `nurseName`, `nurseAvatar`
    const nurseId = propNurseId || caregiver?.id || caregiver?.nurseId;
    const nurseName = propNurseName || caregiver?.name || caregiver?.fullName || "Điều dưỡng CareLink";
    const nurseAvatar =
        propNurseAvatar ||
        caregiver?.image ||
        caregiver?.avatar ||
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600";

    // ── STEPPER CONTROLLER ──
    const [currentStep, setCurrentStep] = useState(1); // 1: Người nhận & Địa chỉ, 2: Dịch vụ & Thời gian, 3: Xác nhận & Chi phí
    const [maxReachedStep, setMaxReachedStep] = useState(1);

    // ── DATA STATES ──
    const [recipients, setRecipients] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [services, setServices] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [dataError, setDataError] = useState("");

    // ── STEP 1: FORM INPUTS (Người nhận & Địa chỉ) ──
    const [selectedRecipientId, setSelectedRecipientId] = useState("");
    const [selectedAddressId, setSelectedAddressId] = useState("");

    // ── STEP 2: FORM INPUTS (Dịch vụ & Khung giờ) ──
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const [serviceQuantities, setServiceQuantities] = useState({}); // { [serviceId]: number }
    const [requestedArrivalTime, setRequestedArrivalTime] = useState("");

    const todayStr = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }, []);

    const [selectedDate, setSelectedDate] = useState(initialDate || todayStr);
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlotIndexes, setSelectedSlotIndexes] = useState([]);

    // ── STEP 3: FORM INPUTS (Ghi chú & Xác nhận) ──
    const [customerNotes, setCustomerNotes] = useState("");
    const [consentMedical, setConsentMedical] = useState(false); // Checkbox quyền riêng tư y tế
    const [validationError, setValidationError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── THƯƠNG LƯỢNG GIÁ QUA CHAT (NẾU MỞ TỪ PHÒNG CHAT) ──
    const [isProposalMode, setIsProposalMode] = useState(false);
    const [proposedPrice, setProposedPrice] = useState("");

    // ── REALTIME CẢNH BÁO GIÁ THAY ĐỔI ──
    const [priceUpdateAlert, setPriceUpdateAlert] = useState("");
    const previousPricingRef = useRef(null);

    // ── POPUPS NỘI BỘ (Xem bệnh án, Thêm người thân, Xác nhận điều khoản) ──
    const [selectedViewingRecipient, setSelectedViewingRecipient] = useState(null);
    const [showAddRelativeModal, setShowAddRelativeModal] = useState(false);
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [newRelativeForm, setNewRelativeForm] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: 1, // 1=Nam, 2=Nữ, 3=Khác
        medicalHistory: "",
        specialNotes: "",
        address: "",
    });
    const [isSavingRelative, setIsSavingRelative] = useState(false);
    const [addRelativeError, setAddRelativeError] = useState("");

    // Customer ID từ localStorage
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

    // Helper tính tuổi
    const calculateAge = useCallback((dobString) => {
        if (!dobString) return null;
        const dob = new Date(dobString);
        if (isNaN(dob.getTime())) return null;
        const diff = Date.now() - dob.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }, []);

    // ── 1. TẢI DỮ LIỆU BAN ĐẦU (Người thân, Địa chỉ, Bảng giá) ──
    const loadFormData = useCallback(async (isInitial = true) => {
        if (!nurseId) return;
        if (isInitial) setLoadingData(true);
        setDataError("");

        try {
            const [recipientsRes, addressesRes, pricingRes] = await Promise.allSettled([
                familyApi.getRecipients(),
                familyApi.getAddresses(),
                familyApi.getNursePricing(nurseId),
            ]);

            // 1. Người thân
            if (recipientsRes.status === "fulfilled") {
                const raw = recipientsRes.value;
                const recList = Array.isArray(raw) ? raw : (raw?.data || raw?.items || []);
                setRecipients(recList);
                setSelectedRecipientId((prev) => (prev && recList.some((r) => (r.id || r.recipientId) === prev) ? prev : (recList[0]?.id || recList[0]?.recipientId || "")));
            }

            // 2. Địa chỉ
            if (addressesRes.status === "fulfilled") {
                const raw = addressesRes.value;
                const addrList = Array.isArray(raw) ? raw : (raw?.data || raw?.items || []);
                setAddresses(addrList);
                setSelectedAddressId((prev) => (prev && addrList.some((a) => (a.id || a.addressId) === prev) ? prev : (addrList[0]?.id || addrList[0]?.addressId || "")));
            }

            // 3. Bảng giá dịch vụ
            if (pricingRes.status === "fulfilled") {
                const raw = pricingRes.value;
                const pricingList = Array.isArray(raw) ? raw : (raw?.data || []);
                const offered = pricingList.filter((item) => item.isOffered !== false);
                const finalPricing = offered.length > 0 ? offered : pricingList;

                if (previousPricingRef.current && previousPricingRef.current.length > 0) {
                    let hasChanged = false;
                    for (const item of finalPricing) {
                        const oldItem = previousPricingRef.current.find((p) => (p.serviceId || p.id) === (item.serviceId || item.id));
                        if (oldItem && (Number(oldItem.customPrice ?? oldItem.basePrice) !== Number(item.customPrice ?? item.basePrice) || oldItem.durationMinutes !== item.durationMinutes)) {
                            hasChanged = true;
                            break;
                        }
                    }
                    if (hasChanged) {
                        setPriceUpdateAlert("Điều dưỡng vừa cập nhật lại đơn giá/thời lượng dịch vụ. Hệ thống đã đồng bộ giá mới nhất.");
                    }
                }
                previousPricingRef.current = finalPricing;
                setServices(finalPricing);
            }
        } catch (err) {
            console.error("[CareLink] Lỗi tải dữ liệu đặt lịch:", err);
            setDataError("Không thể tải đầy đủ danh mục dịch vụ. Vui lòng kiểm tra lại kết nối!");
        } finally {
            if (isInitial) setLoadingData(false);
        }
    }, [nurseId]);

    useEffect(() => {
        if (!isOpen || !nurseId) return;
        loadFormData(true);

        const pricingTimer = setInterval(() => {
            loadFormData(false);
        }, 8000);

        return () => clearInterval(pricingTimer);
    }, [isOpen, nurseId, loadFormData]);

    // ── 2. TẢI SLOTS CHO NGÀY ĐƯỢC CHỌN ──
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

    useEffect(() => {
        if (isOpen && selectedDate) {
            fetchSlots(selectedDate);
        }
    }, [isOpen, selectedDate, fetchSlots]);

    useEffect(() => {
        if (initialDate) setSelectedDate(initialDate);
    }, [initialDate]);

    // ── 3. TÍNH TOÁN THỜI LƯỢNG & SỐ KHUNG GIỜ BẮT BUỘC (Mỗi khung = 60 phút) ──
    const { totalMinutes, requiredSlots, baseServicesPrice } = useMemo(() => {
        let mins = 0;
        let price = 0;

        selectedServiceIds.forEach((id) => {
            const svc = services.find((s) => (s.serviceId || s.id) === id);
            if (svc) {
                const qty = serviceQuantities[id] || 1;
                const d = Number(svc.customDurationMinutes || svc.durationMinutes || 60);
                const p = Number(svc.customPrice ?? svc.basePrice ?? 200000);
                mins += d * qty;
                price += p * qty;
            }
        });

        const needed = mins > 0 ? Math.ceil(mins / 60) : 0;
        return { totalMinutes: mins, requiredSlots: needed, baseServicesPrice: price };
    }, [selectedServiceIds, serviceQuantities, services]);

    // Phí sàn cố định ADR-002: 60.000 VNĐ
    const platformFee = 60000;

    // Giờ làm thêm (Overtime) do khách chủ động chọn thêm slot
    const extraSlotsCount = Math.max(0, selectedSlotIndexes.length - requiredSlots);
    const extraMinutes = extraSlotsCount * 60;
    const effectiveHourlyRate = totalMinutes > 0 ? (baseServicesPrice / (totalMinutes / 60)) : 100000;
    const extraMinutesPrice = extraMinutes > 0 ? Math.round((extraMinutes / 60) * effectiveHourlyRate) : 0;

    const totalServicePrice = baseServicesPrice + extraMinutesPrice;
    const grandTotal = totalServicePrice > 0 ? totalServicePrice + platformFee : platformFee;

    // ── 4. CHỌN/BỎ CHỌN DỊCH VỤ & TĂNG/GIẢM SỐ LƯỢNG CA ──
    const handleToggleService = (serviceId) => {
        setValidationError("");
        setSelectedServiceIds((prev) => {
            if (prev.includes(serviceId)) {
                return prev.filter((id) => id !== serviceId);
            } else {
                if (!serviceQuantities[serviceId]) {
                    setServiceQuantities((q) => ({ ...q, [serviceId]: 1 }));
                }
                return [...prev, serviceId];
            }
        });
        setSelectedSlotIndexes([]);
    };

    const handleUpdateQuantity = (e, serviceId, delta) => {
        e.stopPropagation();
        setValidationError("");
        setServiceQuantities((prev) => {
            const current = prev[serviceId] || 1;
            const updated = Math.max(1, Math.min(8, current + delta));
            return { ...prev, [serviceId]: updated };
        });
        setSelectedSlotIndexes([]);
    };

    // ── 5. THUẬT TOÁN CHỌN SUẤT TRỰC THÔNG MINH (CINEMA SLOTS) ──
    const isConsecutive = (indexes) => {
        if (indexes.length <= 1) return true;
        const sorted = [...indexes].sort((a, b) => a - b);
        for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i + 1] !== sorted[i] + 1) {
                return false;
            }
        }
        return true;
    };

    const handleSelectSlot = (slot) => {
        setValidationError("");
        if (!slot.isAvailable) return;

        if (requiredSlots === 0) {
            setValidationError("Vui lòng chọn dịch vụ chăm sóc y tế ở trên trước khi chọn khung giờ!");
            return;
        }

        const idx = slot.slotIndex;

        // Nếu đã chọn slot này và muốn bỏ chọn toàn bộ
        if (selectedSlotIndexes.includes(idx) && selectedSlotIndexes.length === 1) {
            setSelectedSlotIndexes([]);
            return;
        }

        // Tự động quét chọn chuỗi requiredSlots liên tiếp từ ô click
        const targetIndexes = [];
        let canAutoSelect = true;

        for (let step = 0; step < requiredSlots; step++) {
            const targetIdx = idx + step;
            const targetSlot = slots.find((s) => s.slotIndex === targetIdx);
            if (!targetSlot || !targetSlot.isAvailable) {
                canAutoSelect = false;
                break;
            }
            targetIndexes.push(targetIdx);
        }

        if (canAutoSelect) {
            setSelectedSlotIndexes(targetIndexes);
            setValidationError("");
        } else {
            setSelectedSlotIndexes([idx]);
            setValidationError(
                `Dịch vụ cần ${requiredSlots} khung giờ liên tiếp (${totalMinutes} phút). Từ mốc ${slot.startTime} không đủ số suất trực trống liền kề. Vui lòng chọn mốc giờ bắt đầu khác!`
            );
        }
    };

    // ── 6. ĐIỀU HƯỚNG WIZARD TỪNG BƯỚC ──
    const handleNextFromStep1 = () => {
        setValidationError("");
        if (!selectedRecipientId) {
            setValidationError("Vui lòng chọn người thân cần chăm sóc để tiếp tục.");
            return;
        }
        if (!selectedAddressId && addresses.length > 0) {
            setValidationError("Vui lòng chọn địa chỉ nhận ca trực tại nhà.");
            return;
        }
        setCurrentStep(2);
        setMaxReachedStep((prev) => Math.max(prev, 2));
    };

    const handleNextFromStep2 = () => {
        setValidationError("");
        if (selectedServiceIds.length === 0) {
            setValidationError("Vui lòng chọn ít nhất 1 gói dịch vụ chăm sóc.");
            return;
        }
        if (!selectedDate) {
            setValidationError("Vui lòng chọn ngày thực hiện ca trực.");
            return;
        }
        if (selectedSlotIndexes.length < requiredSlots) {
            const missing = requiredSlots - selectedSlotIndexes.length;
            setValidationError(`Gói dịch vụ bạn chọn có tổng thời lượng ${totalMinutes} phút (cần tối thiểu ${requiredSlots} khung giờ). Bạn cần chọn thêm ${missing} khung giờ liên tiếp còn thiếu.`);
            return;
        }
        if (!isConsecutive(selectedSlotIndexes)) {
            setValidationError("Các khung giờ trong một ca trực phải liên tiếp nhau. Vui lòng chọn các khung giờ liền kề!");
            return;
        }
        setCurrentStep(3);
        setMaxReachedStep((prev) => Math.max(prev, 3));
    };

    const handleJumpStep = (step) => {
        if (step <= maxReachedStep) {
            setValidationError("");
            setCurrentStep(step);
        }
    };

    // ── 7. XỬ LÝ GỬI ĐỀ XUẤT THƯƠNG LƯỢNG GIÁ QUA CHAT ──
    const handleSubmitProposal = async () => {
        setIsSubmitting(true);
        setValidationError("");

        try {
            const sortedIndexes = [...selectedSlotIndexes].sort((a, b) => a - b);
            const firstSlot = slots.find((s) => s.slotIndex === sortedIndexes[0]);
            const startTimeStr = firstSlot?.startTime || "08:00";
            const scheduledStart = `${selectedDate}T${startTimeStr}:00+07:00`;

            const parsedCustomPrice = proposedPrice ? parseInt(proposedPrice.replace(/[^\d]/g, ""), 10) : null;

            let fullNotes = requestedArrivalTime.trim()
                ? `[Giờ yêu cầu có mặt: ${requestedArrivalTime.trim()}] ${customerNotes.trim()}`
                : customerNotes.trim();

            if (consentMedical) {
                fullNotes = fullNotes
                    ? `${fullNotes}\n[Đồng ý chia sẻ hồ sơ sức khỏe & tiền sử bệnh án]`
                    : "[Đồng ý chia sẻ hồ sơ sức khỏe & tiền sử bệnh án]";
            }

            const proposalPayload = {
                serviceIds: selectedServiceIds,
                serviceId: selectedServiceIds[0] || null,
                recipientId: selectedRecipientId,
                addressId: selectedAddressId || null,
                scheduledStart,
                proposedTotalPrice: parsedCustomPrice || baseServicesPrice,
                notes: fullNotes || null,
            };

            let targetConvId = conversationId;
            if (!targetConvId && nurseId) {
                const convRes = await conversationApi.getOrCreateConversation({
                    nurseId: nurseId,
                    NurseId: nurseId,
                    caregiverId: nurseId,
                });
                targetConvId = convRes?.id || convRes?.data?.id;
            }

            if (!targetConvId) {
                throw new Error("Không thể khởi tạo kênh trao đổi với điều dưỡng. Vui lòng thử lại!");
            }

            await conversationApi.createProposal(targetConvId, proposalPayload);

            onProposalCreated?.();
            onClose();

            if (!conversationId) {
                navigate(`/chat?nurseId=${nurseId}`, {
                    state: {
                        conversationId: targetConvId,
                        nurseId,
                        nurseName,
                    },
                });
            }
        } catch (err) {
            console.error("[CareLink] Lỗi gửi đề xuất giá:", err);
            const msg = err.response?.data?.detail || err.response?.data?.message || "Không thể gửi đề xuất ca lúc này. Vui lòng thử lại!";
            setValidationError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── 8. XỬ LÝ GỬI ĐẶT LỊCH TRỰC TIẾP & ĐIỀU HƯỚNG SANG PAYOS ──
    const handleFinalConfirmBooking = () => {
        if (isProposalMode) {
            handleSubmitProposal();
            return;
        }
        // Mở modal cảnh báo màu vàng xác nhận quyền riêng tư & chia sẻ hồ sơ bệnh án
        setShowConsentModal(true);
    };

    const executeDirectBooking = async () => {
        setIsSubmitting(true);
        setValidationError("");

        try {
            const sortedIndexes = [...selectedSlotIndexes].sort((a, b) => a - b);
            const firstIndex = sortedIndexes[0];
            const lastIndex = sortedIndexes[sortedIndexes.length - 1];

            const firstSlot = slots.find((s) => s.slotIndex === firstIndex);
            const lastSlot = slots.find((s) => s.slotIndex === lastIndex);

            const startTimeStr = firstSlot?.startTime || "08:00";
            const endTimeStr = lastSlot?.endTime || "09:00";

            const scheduledStart = `${selectedDate}T${startTimeStr}:00+07:00`;
            const scheduledEnd = `${selectedDate}T${endTimeStr}:00+07:00`;

            const serviceItems = selectedServiceIds.map((id) => ({
                serviceId: id,
                quantity: serviceQuantities[id] || 1,
            }));

            const payload = {
                nurseId,
                recipientId: selectedRecipientId,
                serviceItems,
                serviceIds: selectedServiceIds,
                serviceId: selectedServiceIds[0] || null,
                scheduledStart,
                scheduledEnd,
                extraMinutes,
                requestedArrivalTime: requestedArrivalTime.trim() || null,
                addressId: selectedAddressId || null,
                consentShareMedicalRecords: consentMedical,
                customerNotes: customerNotes.trim() || null,
            };

            const createdBooking = await familyApi.createBooking(payload);
            const targetBookingId = createdBooking?.id || createdBooking?.bookingId;

            setShowConsentModal(false);
            onClose();

            if (targetBookingId && (createdBooking?.status === 1 || createdBooking?.status === "PendingPayment")) {
                navigate(`/checkout?bookingId=${targetBookingId}`, {
                    state: { bookingId: targetBookingId, booking: createdBooking },
                });
            } else {
                navigate("/dashboard/appointments", {
                    state: {
                        newBookingId: targetBookingId,
                        message: "Đặt ca hẹn thành công! Đang chờ điều dưỡng xác nhận tiếp nhận.",
                    },
                });
            }
        } catch (err) {
            console.error("[CareLink] Lỗi đặt ca trực:", err);
            const status = err.response?.status;
            let msg = err.response?.data?.detail || err.response?.data?.message;
            if (!msg) {
                if (status === 409) {
                    msg = "Khung giờ này vừa có người đặt hoặc điều dưỡng có ca trực liền kề. Vui lòng chọn khung giờ khác!";
                } else if (status === 422) {
                    msg = "Dữ liệu đặt ca chưa hợp lệ. Vui lòng kiểm tra lại dịch vụ và thời gian!";
                } else {
                    msg = "Không thể tạo lịch hẹn lúc này. Vui lòng kiểm tra lại kết nối mạng!";
                }
            }
            setValidationError(msg);
            setShowConsentModal(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── 9. THÊM NGƯỜI THÂN TỨC THÌ (MODAL LỒNG) ──
    const handleSaveNewRelative = async (e) => {
        e.preventDefault();
        setAddRelativeError("");
        if (!newRelativeForm.fullName.trim()) {
            setAddRelativeError("Vui lòng nhập họ và tên của người thân.");
            return;
        }

        setIsSavingRelative(true);
        try {
            const payload = {
                fullName: newRelativeForm.fullName.trim(),
                dateOfBirth: newRelativeForm.dateOfBirth || null,
                gender: Number(newRelativeForm.gender) || 1,
                medicalHistory: newRelativeForm.medicalHistory.trim() || null,
                specialNotes: newRelativeForm.specialNotes.trim() || null,
                address: newRelativeForm.address.trim() || null,
                isMedicalRecordShared: true,
            };

            const created = await familyApi.createRecipient(payload);
            const newId = created?.id || created?.recipientId;

            const updatedRecipients = await familyApi.getRecipients();
            const recList = Array.isArray(updatedRecipients) ? updatedRecipients : (updatedRecipients?.data || updatedRecipients?.items || []);
            setRecipients(recList);
            if (newId) setSelectedRecipientId(newId);

            setShowAddRelativeModal(false);
            setNewRelativeForm({
                fullName: "",
                dateOfBirth: "",
                gender: 1,
                medicalHistory: "",
                specialNotes: "",
                address: "",
            });
        } catch (err) {
            console.error("[CareLink] Lỗi tạo hồ sơ người thân:", err);
            const msg = err.response?.data?.detail || err.response?.data?.message || "Không thể tạo hồ sơ người thân. Vui lòng thử lại!";
            setAddRelativeError(msg);
        } finally {
            setIsSavingRelative(false);
        }
    };

    if (!isOpen) return null;

    // Lấy thông tin tóm tắt để hiển thị ở Bước 3
    const selectedRecipientObj = recipients.find((r) => (r.id || r.recipientId) === selectedRecipientId);
    const selectedAddressObj = addresses.find((a) => (a.id || a.addressId) === selectedAddressId);
    const sortedIndexes = [...selectedSlotIndexes].sort((a, b) => a - b);
    const firstSlotObj = slots.find((s) => s.slotIndex === sortedIndexes[0]);
    const lastSlotObj = slots.find((s) => s.slotIndex === sortedIndexes[sortedIndexes.length - 1]);
    const timeRangeStr = firstSlotObj && lastSlotObj ? `${firstSlotObj.startTime} – ${lastSlotObj.endTime}` : "Chưa chọn khung giờ";

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/65 p-3 sm:p-4 md:p-6 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !isSubmitting) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-3xl overflow-hidden rounded-[26px] sm:rounded-[30px] border border-slate-200/90 bg-white shadow-2xl my-auto m-auto max-h-[92vh] flex flex-col"
            >
                {/* ── HEADER MODAL ── */}
                <div className="relative border-b border-slate-100 bg-gradient-to-r from-teal-50/90 via-white to-slate-50/70 p-5 sm:p-6 pb-4 shrink-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5 sm:gap-4">
                            <img
                                src={nurseAvatar}
                                alt={nurseName}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-teal-500/20 shrink-0"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600";
                                }}
                            />
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100/80 text-[#00677C] border border-teal-200/80 mb-1">
                                    <Sparkles className="w-3 h-3 text-[#00677C]" />
                                    Phiếu đặt lịch chăm sóc y tế
                                </div>
                                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                                    Đặt ca trực với {nurseName}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                    <span>Đảm bảo đúng giờ ca trực</span>
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

                {/* ── STEPPER INDICATOR ── */}
                <BookingStepIndicator
                    currentStep={currentStep}
                    maxReachedStep={maxReachedStep}
                    onSelectStep={handleJumpStep}
                />

                {/* Cảnh báo lỗi tải dữ liệu */}
                {dataError && (
                    <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 shrink-0">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span className="flex-1 font-medium">{dataError}</span>
                        <button
                            type="button"
                            onClick={() => setDataError("")}
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                        >
                            Đã hiểu
                        </button>
                    </div>
                )}

                {/* Cảnh báo cập nhật bảng giá realtime */}
                {priceUpdateAlert && (
                    <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 shrink-0">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="flex-1 font-medium">{priceUpdateAlert}</span>
                        <button
                            type="button"
                            onClick={() => setPriceUpdateAlert("")}
                            className="text-amber-500 hover:text-amber-700 text-xs font-bold"
                        >
                            Đã hiểu
                        </button>
                    </div>
                )}

                {/* ── NỘI DUNG CHÍNH (SCROLLABLE WIZARD CONTENT) ── */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                    {loadingData ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin text-[#00677C]" />
                            <p className="text-xs font-semibold">Đang chuẩn bị hồ sơ ca trực và danh mục dịch vụ...</p>
                        </div>
                    ) : (
                        <div>
                            {/* ════════ BƯỚC 1: NGƯỜI NHẬN & ĐỊA CHỈ ════════ */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in duration-150">
                                    {/* 1. Người thân cần chăm sóc */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5">
                                                <User className="w-4 h-4 text-[#00677C]" />
                                                1. Chọn người thân cần chăm sóc <span className="text-rose-500">*</span>
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddRelativeModal(true)}
                                                className="text-[11px] font-bold text-[#00677C] hover:text-[#005263] flex items-center gap-1 cursor-pointer hover:underline"
                                            >
                                                <UserPlus className="w-3.5 h-3.5" />
                                                <span>Thêm người thân</span>
                                            </button>
                                        </div>

                                        {recipients.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {recipients.map((rec) => {
                                                    const id = rec.id || rec.recipientId;
                                                    const isSelected = selectedRecipientId === id;
                                                    const age = calculateAge(rec.dateOfBirth);
                                                    const genderText = rec.gender === 1 || rec.genderName === "Nam" ? "Nam" : rec.gender === 2 || rec.genderName === "Nữ" ? "Nữ" : "Khác";

                                                    return (
                                                        <div
                                                            key={id}
                                                            onClick={() => {
                                                                setSelectedRecipientId(id);
                                                                setValidationError("");
                                                            }}
                                                            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                                                isSelected
                                                                    ? "border-[#00677C] bg-teal-50/60 ring-2 ring-[#00677C]/20 shadow-xs"
                                                                    : "border-slate-200 bg-white hover:border-slate-300"
                                                            }`}
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs font-bold text-slate-900 truncate">
                                                                        {rec.fullName || rec.name}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedViewingRecipient(rec);
                                                                        }}
                                                                        className="p-1 rounded-lg text-slate-400 hover:text-[#00677C] hover:bg-teal-100/60 transition cursor-pointer"
                                                                        title="Xem chi tiết hồ sơ y tế & tiền sử bệnh"
                                                                    >
                                                                        <Info className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                                                                    <span>{rec.relationship || "Người thân"}</span>
                                                                    <span>•</span>
                                                                    <span>{genderText}</span>
                                                                    <span>•</span>
                                                                    <span>{age ? `${age} tuổi` : (rec.dateOfBirth ? `Sinh ${rec.dateOfBirth}` : "Chưa rõ năm sinh")}</span>
                                                                </div>
                                                            </div>
                                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                                                isSelected ? "border-[#00677C] bg-[#00677C] text-white" : "border-slate-300 bg-white"
                                                            }`}>
                                                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-4 rounded-2xl border border-dashed border-teal-300 bg-teal-50/40 text-xs text-slate-700 flex items-center justify-between">
                                                <span>Chưa có hồ sơ người thân nào được lưu.</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddRelativeModal(true)}
                                                    className="px-3.5 py-1.5 rounded-xl bg-[#00677C] text-white text-xs font-bold hover:bg-[#005566] transition shadow-xs cursor-pointer"
                                                >
                                                    + Tạo hồ sơ người thân ngay
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Chọn địa chỉ tiếp nhận */}
                                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                            <MapPin className="w-4 h-4 text-[#00677C]" />
                                            2. Địa chỉ tiếp nhận ca trực tại nhà <span className="text-rose-500">*</span>
                                        </label>
                                        {addresses.length > 0 ? (
                                            <select
                                                value={selectedAddressId}
                                                onChange={(e) => {
                                                    setSelectedAddressId(e.target.value);
                                                    setValidationError("");
                                                }}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                                            >
                                                {addresses.map((addr) => {
                                                    const id = addr.id || addr.addressId;
                                                    return (
                                                        <option key={id} value={id}>
                                                            {addr.label ? `[${addr.label}] ` : ""}{formatAddressDisplay(addr)}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        ) : (
                                            <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                                                Hệ thống sẽ sử dụng địa chỉ mặc định trên hồ sơ người bệnh để điều dưỡng đến tiếp nhận.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ════════ BƯỚC 2: DỊCH VỤ & KHUNG GIỜ ════════ */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-150">
                                    {/* 1. Chọn dịch vụ chăm sóc */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                <Stethoscope className="w-4 h-4 text-[#00677C]" />
                                                1. Chọn dịch vụ y tế <span className="text-rose-500">*</span>
                                            </label>
                                            <span className="text-xs font-extrabold text-[#00677C]">
                                                {selectedServiceIds.length} dịch vụ • ~{totalMinutes} phút ({requiredSlots} ca/khung giờ)
                                            </span>
                                        </div>

                                        {services.length === 0 ? (
                                            <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl border">
                                                Đang tải bảng giá dịch vụ của điều dưỡng...
                                            </p>
                                        ) : (
                                            <div className="space-y-2.5">
                                                {services.map((svc) => {
                                                    const id = svc.serviceId || svc.id;
                                                    const isChecked = selectedServiceIds.includes(id);
                                                    const basePrice = Number(svc.customPrice ?? svc.basePrice ?? 200000);
                                                    const duration = Number(svc.customDurationMinutes || svc.durationMinutes || 60);
                                                    const qty = serviceQuantities[id] || 1;

                                                    return (
                                                        <div
                                                            key={id}
                                                            onClick={() => handleToggleService(id)}
                                                            className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                                                                isChecked
                                                                    ? "border-[#00677C] bg-teal-50/40 ring-1 ring-[#00677C]/30 shadow-2xs"
                                                                    : "border-slate-200 bg-white hover:border-slate-300"
                                                            }`}
                                                        >
                                                            <div className="flex items-start gap-3 min-w-0">
                                                                <div className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                                                                    isChecked ? "border-[#00677C] bg-[#00677C] text-white" : "border-slate-300 bg-white"
                                                                }`}>
                                                                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                                                            {svc.serviceName || svc.name}
                                                                        </h4>
                                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                                            ⏱ {duration} phút
                                                                        </span>
                                                                    </div>
                                                                    {svc.description && (
                                                                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                                            {svc.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                                                {isChecked && (
                                                                    <div
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="flex items-center gap-1.5 bg-white border border-teal-200 rounded-xl px-2 py-1 shadow-2xs"
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => handleUpdateQuantity(e, id, -1)}
                                                                            disabled={qty <= 1}
                                                                            className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-900 border border-slate-300/80 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                                                                            title="Giảm số lượng"
                                                                        >
                                                                            <Minus className="w-3.5 h-3.5 stroke-[2.75] text-slate-900" />
                                                                        </button>
                                                                        <span className="text-xs font-black text-[#00677C] px-1.5 min-w-[24px] text-center">
                                                                            {qty}
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => handleUpdateQuantity(e, id, 1)}
                                                                            disabled={qty >= 8}
                                                                            className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-900 border border-slate-300/80 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                                                                            title="Tăng số lượng"
                                                                        >
                                                                            <Plus className="w-3.5 h-3.5 stroke-[2.75] text-slate-900" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                <span className="text-xs sm:text-sm font-black text-slate-900">
                                                                    {(basePrice * qty).toLocaleString("vi-VN")} đ
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Ngày & Giờ có mặt */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                Ngày thực hiện <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    min={todayStr}
                                                    value={selectedDate}
                                                    onChange={(e) => {
                                                        setSelectedDate(e.target.value);
                                                        setValidationError("");
                                                    }}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-teal-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                Giờ yêu cầu có mặt tại nhà (Tùy chọn)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ví dụ: 17:15, hoặc Có mặt đúng 17:00..."
                                                value={requestedArrivalTime}
                                                onChange={(e) => setRequestedArrivalTime(e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* 3. Khung giờ ca trực (Cinema Slots Grid) */}
                                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                <Clock className="w-4 h-4 text-[#00677C]" />
                                                Chọn suất trực trong ngày <span className="text-rose-500">*</span>
                                            </label>
                                            <span className="text-[11px] text-slate-500">
                                                Mỗi ô = 60 phút • Cần tối thiểu {requiredSlots} ô liền kề
                                            </span>
                                        </div>

                                        {loadingSlots ? (
                                            <div className="py-8 flex items-center justify-center gap-2 text-slate-400 text-xs">
                                                <Loader2 className="w-4 h-4 animate-spin text-[#00677C]" />
                                                <span>Đang tải lịch rảnh của điều dưỡng...</span>
                                            </div>
                                        ) : slots.length === 0 ? (
                                            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border">
                                                Không có khung giờ rảnh nào trong ngày này. Vui lòng chọn ngày khác!
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                                {slots.map((s) => {
                                                    const idx = s.slotIndex;
                                                    const isSelected = selectedSlotIndexes.includes(idx);
                                                    const isAvailable = s.isAvailable;

                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            disabled={!isAvailable}
                                                            onClick={() => handleSelectSlot(s)}
                                                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                                                isSelected
                                                                    ? "border-[#00677C] bg-[#00677C] text-white shadow-sm ring-2 ring-[#00677C]/30 scale-102"
                                                                    : isAvailable
                                                                    ? "border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50/40 text-slate-800"
                                                                    : "border-slate-100 bg-slate-100 text-slate-300 cursor-not-allowed opacity-60"
                                                            }`}
                                                        >
                                                            <div className="text-xs font-bold leading-tight">
                                                                {s.startTime}
                                                            </div>
                                                            <div className={`text-[10px] mt-0.5 ${isSelected ? "text-teal-100" : isAvailable ? "text-slate-500" : "text-slate-400"}`}>
                                                                {s.endTime}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ════════ BƯỚC 3: XÁC NHẬN & CHI PHÍ ════════ */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in duration-150">
                                    {/* 1. Tóm tắt thông tin ca hẹn */}
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-3.5">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                                <Sparkles className="w-4 h-4 text-[#00677C]" />
                                                Tóm tắt phiếu đặt ca
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(1)}
                                                className="text-[11px] font-bold text-[#00677C] hover:underline cursor-pointer"
                                            >
                                                Sửa thông tin
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="text-slate-400 block text-[11px]">Người nhận chăm sóc:</span>
                                                <span className="font-bold text-slate-900">
                                                    {selectedRecipientObj?.fullName || selectedRecipientObj?.name || "Chưa chọn"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[11px]">Điều dưỡng phụ trách:</span>
                                                <span className="font-bold text-slate-900">{nurseName}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[11px]">Thời gian ca trực:</span>
                                                <span className="font-bold text-slate-900">
                                                    {selectedDate} ({timeRangeStr})
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[11px]">Địa chỉ tiếp nhận:</span>
                                                <span className="font-bold text-slate-900 truncate block" title={formatAddressDisplay(selectedAddressObj)}>
                                                    {formatAddressDisplay(selectedAddressObj)}
                                                </span>
                                            </div>
                                        </div>

                                        {requestedArrivalTime && (
                                            <div className="text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                                                <strong>Giờ yêu cầu có mặt:</strong> {requestedArrivalTime}
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Tùy chọn đề xuất giá đàm phán trong Chat */}
                                    <div className={`p-4 rounded-2xl border transition-all ${
                                        isProposalMode
                                            ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20"
                                            : "bg-white border-slate-200"
                                    }`}>
                                        <label className="flex items-start gap-3 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={isProposalMode}
                                                onChange={(e) => setIsProposalMode(e.target.checked)}
                                                className="w-4 h-4 mt-0.5 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer shrink-0"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                                                        Thương lượng giá theo thỏa thuận
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                                                        Đàm phán qua chat
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    Gửi đề xuất ca kèm mức giá mong muốn để điều dưỡng duyệt trước trong phòng chat trước khi bạn thanh toán.
                                                </p>
                                            </div>
                                        </label>

                                        {isProposalMode && (
                                            <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-2">
                                                <label className="block text-xs font-bold text-slate-700">
                                                    Mức giá bạn mong muốn đề xuất (VNĐ)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={proposedPrice}
                                                    onChange={(e) => setProposedPrice(e.target.value)}
                                                    placeholder={`Ví dụ: ${baseServicesPrice.toLocaleString("vi-VN")} đ`}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-amber-500/20"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* 3. Ghi chú dặn dò */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                                            Ghi chú dặn dò điều dưỡng (Tùy chọn)
                                        </label>
                                        <textarea
                                            rows={2}
                                            placeholder="Ví dụ: Bác hay chóng mặt khi ngồi dậy; bấm chuông cửa số 2..."
                                            value={customerNotes}
                                            onChange={(e) => setCustomerNotes(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 outline-none resize-none"
                                        />
                                    </div>

                                    {/* 4. Checkbox đồng ý chia sẻ thông tin y tế (Chỉ hiển thị khi thương lượng qua Chat) */}
                                    {isProposalMode && (
                                        <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/80">
                                            <label className="flex items-start gap-2.5 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={consentMedical}
                                                    onChange={(e) => setConsentMedical(e.target.checked)}
                                                    className="w-4 h-4 mt-0.5 text-[#00677C] rounded border-slate-300 focus:ring-teal-500 cursor-pointer shrink-0"
                                                />
                                                <div className="text-xs text-slate-700 leading-relaxed">
                                                    <strong className="text-slate-900">Chia sẻ tóm tắt tiền sử bệnh:</strong>{" "}
                                                    Tôi đồng ý chia sẻ tiền sử dị ứng, bệnh nền và lưu ý y tế của người thân để điều dưỡng chuẩn bị dụng cụ chuyên môn chu đáo nhất.
                                                </div>
                                            </label>
                                        </div>
                                    )}

                                    {/* 5. Bảng phân rã chi phí minh bạch */}
                                    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-2.5 shadow-xs">
                                        <div className="flex items-center justify-between text-xs text-slate-600">
                                            <span>Tiền dịch vụ chăm sóc:</span>
                                            <span className="font-bold text-slate-900">
                                                {baseServicesPrice.toLocaleString("vi-VN")} đ
                                            </span>
                                        </div>

                                        {extraMinutesPrice > 0 && (
                                            <div className="flex items-center justify-between text-xs text-slate-600">
                                                <span>Thời gian chăm sóc thêm ({extraMinutes} phút):</span>
                                                <span className="font-bold text-slate-900">
                                                    +{extraMinutesPrice.toLocaleString("vi-VN")} đ
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-slate-600">
                                            <span className="flex items-center gap-1">
                                                <span>Phí nền tảng CareLink</span>
                                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-semibold">Cố định</span>
                                            </span>
                                            <span className="font-bold text-slate-900">
                                                +{platformFee.toLocaleString("vi-VN")} đ
                                            </span>
                                        </div>

                                        <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                                            <span className="text-xs sm:text-sm font-black text-slate-900">
                                                Tổng thanh toán:
                                            </span>
                                            <span className="text-base sm:text-lg font-black text-[#00677C]">
                                                {grandTotal.toLocaleString("vi-VN")} VNĐ
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 italic text-right">
                                            Thanh toán an toàn qua cổng PayOS • Giữ chỗ trong 30 phút
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── FOOTER MODAL & NÚT ĐIỀU HƯỚNG BƯỚC ── */}
                <div className="border-t border-slate-100 bg-slate-50/90 p-4 sm:p-5 shrink-0">
                    {validationError && (
                        <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-3">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => {
                                    setValidationError("");
                                    setCurrentStep((prev) => Math.max(1, prev - 1));
                                }}
                                className="px-4 sm:px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Quay lại</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                        )}

                        {currentStep === 1 && (
                            <button
                                type="button"
                                onClick={handleNextFromStep1}
                                className="px-6 py-2.5 rounded-xl bg-[#00677C] hover:bg-[#005566] text-white font-bold text-xs transition shadow-sm hover:shadow flex items-center gap-2 cursor-pointer ml-auto"
                            >
                                <span>Tiếp tục: Dịch vụ & Giờ</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}

                        {currentStep === 2 && (
                            <button
                                type="button"
                                onClick={handleNextFromStep2}
                                className="px-6 py-2.5 rounded-xl bg-[#00677C] hover:bg-[#005566] text-white font-bold text-xs transition shadow-sm hover:shadow flex items-center gap-2 cursor-pointer ml-auto"
                            >
                                <span>Tiếp tục: Xem lại & Chi phí</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}

                        {currentStep === 3 && (
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleFinalConfirmBooking}
                                className="px-6 py-2.5 rounded-xl bg-[#00677C] hover:bg-[#005566] text-white font-black text-xs sm:text-sm transition shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-60 ml-auto"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSubmitting
                                    ? "Đang khởi tạo lịch hẹn..."
                                    : isProposalMode
                                    ? "Gửi đề xuất thương lượng giá"
                                    : "Xác nhận đặt lịch qua PayOS"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── MODAL PHỤ: XEM CHI TIẾT HỒ SƠ Y TẾ NGƯỜI THÂN ── */}
            {selectedViewingRecipient && (
                <div
                    className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs"
                    onClick={() => setSelectedViewingRecipient(null)}
                >
                    <div
                        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-[#00677C]" />
                                Tóm tắt bệnh án • {selectedViewingRecipient.fullName || selectedViewingRecipient.name}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedViewingRecipient(null)}
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3 text-xs">
                            <div>
                                <span className="font-bold text-slate-700 block">Tiền sử bệnh án:</span>
                                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl mt-1 border">
                                    {selectedViewingRecipient.medicalHistory || "Không ghi nhận tiền sử bệnh lý đặc biệt."}
                                </p>
                            </div>
                            <div>
                                <span className="font-bold text-slate-700 block">Lưu ý chăm sóc đặc biệt:</span>
                                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl mt-1 border">
                                    {selectedViewingRecipient.specialNotes || "Không có lưu ý đặc biệt."}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedViewingRecipient(null)}
                            className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                        >
                            Đóng cửa sổ
                        </button>
                    </div>
                </div>
            )}

            {/* ── MODAL PHỤ: THÊM NGƯỜI THÂN TỨC THÌ ── */}
            {showAddRelativeModal && (
                <div
                    className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs"
                    onClick={() => !isSavingRelative && setShowAddRelativeModal(false)}
                >
                    <div
                        className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-[#00677C]" />
                                Thêm hồ sơ người thân mới
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowAddRelativeModal(false)}
                                disabled={isSavingRelative}
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {addRelativeError && (
                            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                                {addRelativeError}
                            </div>
                        )}

                        <form onSubmit={handleSaveNewRelative} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">
                                    Họ và tên người thân <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={newRelativeForm.fullName}
                                    onChange={(e) => setNewRelativeForm((prev) => ({ ...prev, fullName: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-teal-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Ngày sinh</label>
                                    <input
                                        type="date"
                                        value={newRelativeForm.dateOfBirth}
                                        onChange={(e) => setNewRelativeForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Giới tính</label>
                                    <select
                                        value={newRelativeForm.gender}
                                        onChange={(e) => setNewRelativeForm((prev) => ({ ...prev, gender: e.target.value }))}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-teal-500 bg-white"
                                    >
                                        <option value={1}>Nam</option>
                                        <option value={2}>Nữ</option>
                                        <option value={3}>Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Tiền sử bệnh lý (Nếu có)</label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Cao huyết áp, tiểu đường type 2..."
                                    value={newRelativeForm.medicalHistory}
                                    onChange={(e) => setNewRelativeForm((prev) => ({ ...prev, medicalHistory: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Ghi chú đặc biệt</label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Khó đi lại, cần đỡ khi di chuyển..."
                                    value={newRelativeForm.specialNotes}
                                    onChange={(e) => setNewRelativeForm((prev) => ({ ...prev, specialNotes: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-teal-500"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowAddRelativeModal(false)}
                                    disabled={isSavingRelative}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingRelative}
                                    className="px-5 py-2 rounded-xl bg-[#00677C] text-white font-bold hover:bg-[#005566] transition flex items-center gap-2"
                                >
                                    {isSavingRelative && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>Lưu hồ sơ người thân</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL CẢNH BÁO VÀNG: XÁC NHẬN QUYỀN RIÊNG TƯ & CHIA SẺ HỒ SƠ Y TẾ ── */}
            {showConsentModal && (
                <div
                    className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs animate-in fade-in duration-200"
                    onClick={() => !isSubmitting && setShowConsentModal(false)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-amber-200 space-y-5 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900">
                                        Quyền riêng tư & Hồ sơ y tế
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                        Bảo mật thông tin sức khỏe cho {selectedRecipientObj?.name || "người thân"}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowConsentModal(false)}
                                disabled={isSubmitting}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Nội dung cảnh báo vàng */}
                        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 space-y-2 leading-relaxed">
                            <p className="font-bold flex items-center gap-1.5 text-amber-800">
                                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                                Lưu ý về dữ liệu sức khỏe cá nhân:
                            </p>
                            <p>
                                Tiền sử bệnh lý, dị ứng thuốc và ghi chú điều trị là thông tin y tế nhạy cảm. CareLink cam kết bảo mật theo quy định và chỉ chia sẻ cho điều dưỡng phụ trách khi có sự đồng ý của gia đình.
                            </p>
                        </div>

                        {/* Checkbox chia sẻ hồ sơ (Mặc định không tích) */}
                        <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={consentMedical}
                                onChange={(e) => setConsentMedical(e.target.checked)}
                                className="w-4 h-4 mt-0.5 text-[#00677C] rounded border-slate-300 focus:ring-teal-500 cursor-pointer shrink-0"
                            />
                            <div className="text-xs text-slate-700 leading-relaxed">
                                <strong className="text-slate-900 block mb-0.5">
                                    Đồng ý chia sẻ tóm tắt bệnh án cho điều dưỡng
                                </strong>
                                Cho phép điều dưỡng phụ trách ca trực xem trước tiền sử bệnh nền, dị ứng và lưu ý chăm sóc để chuẩn bị dụng cụ chu đáo nhất.
                            </div>
                        </label>

                        <p className="text-[11px] text-slate-400 italic px-1">
                            💡 Nếu không tích chọn, điều dưỡng chỉ nhận thông tin dịch vụ và địa chỉ mà không thể xem hồ sơ bệnh án.
                        </p>

                        {validationError && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                                {validationError}
                            </div>
                        )}

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowConsentModal(false)}
                                disabled={isSubmitting}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                                Xem lại
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={executeDirectBooking}
                                className="px-6 py-2.5 rounded-xl bg-[#00677C] hover:bg-[#005566] text-white text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>Tiếp tục thanh toán</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
