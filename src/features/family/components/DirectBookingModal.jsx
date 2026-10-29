import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    X,
    Calendar,
    Clock,
    User,
    MapPin,
    Check,
    CheckCircle2,
    ShieldAlert,
    AlertCircle,
    Loader2,
    Sparkles,
    CreditCard,
    Stethoscope,
    Lock,
    HelpCircle,
    Plus,
    Minus,
    AlertTriangle,
    UserPlus,
    Info,
    Send,
    MessageSquare,
} from "lucide-react";
import familyApi from "../../../api/familyApi";
import conversationApi from "../../../api/conversationApi";

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
    const [serviceQuantities, setServiceQuantities] = useState({}); // { [serviceId]: number }

    // Giờ yêu cầu có mặt tại nhà (I.2)
    const [requestedArrivalTime, setRequestedArrivalTime] = useState("");

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

    // ── GHI CHÚ DẶN DÒ & LỖI VALIDATION (HIỂN THỊ DƯỚI TỔNG TIỀN) ──
    const [customerNotes, setCustomerNotes] = useState("");
    const [validationError, setValidationError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── REALTIME CẢNH BÁO GIÁ THAY ĐỔI ──
    const [priceUpdateAlert, setPriceUpdateAlert] = useState("");
    const previousPricingRef = useRef(null);

    // ── THƯƠNG LƯỢNG GIÁ QUA CHAT (NẾU MỞ TỪ PHÒNG CHAT) ──
    const [isProposalMode, setIsProposalMode] = useState(false);
    const [proposedPrice, setProposedPrice] = useState("");

    // ── MODAL XEM CHI TIẾT HỒ SƠ Y TẾ NGƯỜI THÂN (NÚT I) ──
    const [selectedViewingRecipient, setSelectedViewingRecipient] = useState(null);

    // ── MODAL LỒNG: THÊM HỒ SƠ NGƯỜI THÂN TỨC THÌ ──
    const [showAddRelativeModal, setShowAddRelativeModal] = useState(false);
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

    // ── POPUP XÁC NHẬN QUYỀN RIÊNG TƯ Y TẾ (MÀU VÀNG/AMBER, MẶC ĐỊNH CHƯA TÍCH) ──
    const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);
    const [consentMedical, setConsentMedical] = useState(false); // Mặc định CHƯA TÍCH theo yêu cầu user

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

    // ── HELPER TÍNH TUỔI TỪ NGÀY SINH ──
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

            // 3. Bảng giá dịch vụ của điều dưỡng
            if (pricingRes.status === "fulfilled") {
                const raw = pricingRes.value;
                const pricingList = Array.isArray(raw) ? raw : (raw?.data || []);
                const offered = pricingList.filter((item) => item.isOffered !== false);
                const finalPricing = offered.length > 0 ? offered : pricingList;

                // Kiểm tra Realtime xem giá có vừa bị điều dưỡng sửa đổi không
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
                        setPriceUpdateAlert("Điều dưỡng vừa cập nhật lại đơn giá/thời lượng dịch vụ. Hệ thống đã đồng bộ giá mới nhất, vui lòng xem lại trước khi xác nhận!");
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

        // Realtime Polling: Kiểm tra bảng giá cập nhật mỗi 8 giây khi modal đang mở
        const pricingTimer = setInterval(() => {
            loadFormData(false);
        }, 8000);

        return () => clearInterval(pricingTimer);
    }, [isOpen, nurseId, loadFormData]);

    // ── 2. TẢI SLOTS RẠP PHIM CHO NGÀY ĐƯỢC CHỌN ──
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

    // Cập nhật selectedDate nếu prop initialDate thay đổi
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

        // Mỗi slot rạp phim chuẩn là 60 phút (Smart Cinema Slot Selection: Math.ceil(mins / 60))
        const needed = mins > 0 ? Math.ceil(mins / 60) : 0;
        return { totalMinutes: mins, requiredSlots: needed, baseServicesPrice: price };
    }, [selectedServiceIds, serviceQuantities, services]);

    // Phí sàn cố định ADR-002
    const platformFee = 60000;

    // Giờ làm thêm (Overtime) do khách chủ động chọn thêm slot nán lại (Section IV doc)
    const extraSlotsCount = Math.max(0, selectedSlotIndexes.length - requiredSlots);
    const extraMinutes = extraSlotsCount * 60;
    const effectiveHourlyRate = totalMinutes > 0 ? (baseServicesPrice / (totalMinutes / 60)) : 100000;
    const extraMinutesPrice = extraMinutes > 0 ? Math.round((extraMinutes / 60) * effectiveHourlyRate) : 0;

    const totalServicePrice = baseServicesPrice + extraMinutesPrice;
    const grandTotal = totalServicePrice > 0 ? totalServicePrice + platformFee : 0;

    // ── 4. CHỌN/BỎ CHỌN DỊCH VỤ & TĂNG/GIẢM SỐ LƯỢNG CA (SLOT) ──
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

    // ── 5. THUẬT TOÁN CHỌN SUẤT TRỰC THÔNG MINH (SMART CINEMA SLOTS) ──
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
            setValidationError("Vui lòng chọn dịch vụ chăm sóc y tế ở mục 3 trước khi chọn khung giờ!");
            return;
        }

        const idx = slot.slotIndex;

        // Nếu đã chọn slot này và muốn bỏ chọn toàn bộ
        if (selectedSlotIndexes.includes(idx) && selectedSlotIndexes.length === 1) {
            setSelectedSlotIndexes([]);
            return;
        }

        // Tự động quét chọn chuỗi requiredSlots liên tiếp từ ô click (Quy tắc Cinema Auto-Select)
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
            // Không đủ slot liên tiếp từ mốc này
            const missingSlot = slots.find((s) => s.slotIndex >= idx && (!s.isAvailable || s.slotIndex >= idx + requiredSlots));
            setSelectedSlotIndexes([idx]);
            setValidationError(
                `Dịch vụ cần ${requiredSlots} khung giờ liên tiếp (${totalMinutes} phút). Từ mốc ${slot.startTime} không đủ số suất trực trống liền kề. Vui lòng chọn mốc giờ bắt đầu khác!`
            );
        }
    };

    // ── 6. BƯỚC 1: XÁC THỰC DỮ LIỆU & MỞ POPUP QUYỀN RIÊNG TƯ Y TẾ ──
    const handleInitiateBooking = (e) => {
        e.preventDefault();
        setValidationError("");

        if (!selectedRecipientId) {
            setValidationError("Vui lòng chọn người thân cần chăm sóc hoặc bấm 'Thêm người thân' để tạo hồ sơ.");
            return;
        }

        if (selectedServiceIds.length === 0) {
            setValidationError("Vui lòng chọn ít nhất một gói dịch vụ chăm sóc y tế.");
            return;
        }

        if (selectedSlotIndexes.length === 0) {
            setValidationError(`Vui lòng chọn ${requiredSlots} khung giờ liên tiếp cho gói dịch vụ (${totalMinutes} phút).`);
            return;
        }

        if (selectedSlotIndexes.length < requiredSlots) {
            const missing = requiredSlots - selectedSlotIndexes.length;
            setValidationError(`Gói dịch vụ bạn chọn có tổng thời lượng ${totalMinutes} phút (cần tối thiểu ${requiredSlots} khung giờ). Bạn cần chọn thêm ${missing} khung giờ liên tiếp còn thiếu.`);
            return;
        }

        if (!isConsecutive(selectedSlotIndexes)) {
            setValidationError("Các khung giờ trong một ca trực phải liên tiếp nhau (không được ngắt quãng). Vui lòng chọn các khung giờ liền kề!");
            return;
        }

        // Nếu đang ở chế độ Đề xuất giá đàm phán trong Chat: Gửi thẳng proposal không qua PayOS
        if (isProposalMode && conversationId) {
            handleSubmitProposal();
            return;
        }

        // Tất cả hợp lệ -> Mở popup Quyền riêng tư y tế
        setShowPrivacyPopup(true);
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

            const fullNotes = requestedArrivalTime.trim()
                ? `[Giờ yêu cầu có mặt: ${requestedArrivalTime.trim()}] ${customerNotes.trim()}`
                : customerNotes.trim();

            const proposalPayload = {
                serviceIds: selectedServiceIds,
                serviceId: selectedServiceIds[0] || null,
                recipientId: selectedRecipientId,
                addressId: selectedAddressId || null,
                scheduledStart,
                proposedTotalPrice: parsedCustomPrice || baseServicesPrice,
                notes: fullNotes || null,
            };

            await conversationApi.createProposal(conversationId, proposalPayload);

            onProposalCreated?.();
            onClose();
        } catch (err) {
            console.error("[CareLink] Lỗi gửi đề xuất ca trực:", err);
            const msg = err.response?.data?.detail || err.response?.data?.message || "Không thể gửi đề xuất ca qua Chat lúc này. Vui lòng thử lại!";
            setValidationError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── 8. BƯỚC 2: GỬI LỊCH ĐẶT VÀ CHUYỂN TỚI CHECKOUT (PAYOS VIETQR) ──
    const handleFinalConfirmBooking = async () => {
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

            // Xây dựng danh sách serviceItems theo chuẩn V2.1 của Q
            const serviceItems = selectedServiceIds.map((id) => ({
                serviceId: id,
                quantity: serviceQuantities[id] || 1,
            }));

            const fullNotes = requestedArrivalTime.trim()
                ? `[Giờ yêu cầu có mặt: ${requestedArrivalTime.trim()}] ${customerNotes.trim()}`
                : customerNotes.trim();

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
                customerNotes: fullNotes || null,
            };

            const createdBooking = await familyApi.createBooking(payload);
            const targetBookingId = createdBooking?.id || createdBooking?.bookingId;

            setShowPrivacyPopup(false);
            onClose();

            if (targetBookingId) {
                navigate(`/checkout?bookingId=${targetBookingId}`, {
                    state: { bookingId: targetBookingId, booking: createdBooking },
                });
            } else {
                navigate("/dashboard/appointments");
            }
        } catch (err) {
            console.error("[CareLink] Lỗi đặt ca trực:", err);
            setShowPrivacyPopup(false);
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

            // Nạp lại danh sách người thân và tự động chọn người vừa thêm
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
                                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-teal-500/20 shrink-0"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600";
                                }}
                            />
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100/80 text-[#00677C] border border-teal-200/80 mb-1">
                                    <Sparkles className="w-3 h-3 text-[#00677C]" />
                                    Phiếu đặt lịch nhanh • Chọn giờ linh hoạt
                                </div>
                                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
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

                {/* ── NỘI DUNG CHÍNH (SCROLLABLE BODY) ── */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

                    {loadingData ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin text-[#00677C]" />
                            <p className="text-xs font-semibold">Đang chuẩn bị hồ sơ ca trực và danh mục dịch vụ...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleInitiateBooking} className="space-y-6">

                            {/* 1. CHỌN NGƯỜI THÂN CẦN CHĂM SÓC */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-[#00677C]" />
                                        1. Người thân cần chăm sóc <span className="text-rose-500">*</span>
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                                                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
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
                                                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
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
                                            className="px-3 py-1.5 rounded-xl bg-[#00677C] text-white text-xs font-bold hover:bg-[#005566] transition shadow-xs cursor-pointer"
                                        >
                                            + Tạo hồ sơ người thân ngay
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* 2. CHỌN ĐỊA CHỈ TIẾP NHẬN TẠI NHÀ */}
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
                                    <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        Hệ thống sẽ sử dụng địa chỉ đăng ký trên hồ sơ người bệnh để điều dưỡng đến tiếp nhận.
                                    </p>
                                )}
                            </div>

                            {/* 3. DANH MỤC DỊCH VỤ & THỜI LƯỢNG (+ / - SLOT) */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        <Stethoscope className="w-4 h-4 text-[#00677C]" />
                                        3. Chọn dịch vụ chăm sóc y tế (Có thể chọn nhiều gói) <span className="text-rose-500">*</span>
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
                                                        {/* Bộ đếm số lượng ca / slots (+ / -) */}
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
                                                                    title="Giảm số ca"
                                                                >
                                                                    <Minus className="w-3.5 h-3.5 stroke-[2.75] text-slate-900" />
                                                                </button>
                                                                <span className="text-xs font-black text-[#00677C] px-1.5 min-w-[24px] text-center">
                                                                    {qty} ca
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => handleUpdateQuantity(e, id, 1)}
                                                                    disabled={qty >= 8}
                                                                    className="w-6 h-6 rounded-lg bg-teal-100 hover:bg-teal-200 flex items-center justify-center text-[#00677C] border border-teal-300/80 cursor-pointer transition shadow-2xs"
                                                                    title="Tăng số ca / slot"
                                                                >
                                                                    <Plus className="w-3.5 h-3.5 stroke-[2.75] text-[#00677C]" />
                                                                </button>
                                                            </div>
                                                        )}

                                                        <div className="text-right">
                                                            <div className="text-xs sm:text-sm font-black text-[#00677C]">
                                                                {(basePrice * qty).toLocaleString("vi-VN")} đ
                                                            </div>
                                                            <div className="text-[10px] text-slate-400">
                                                                {qty > 1 ? `${basePrice.toLocaleString("vi-VN")} đ x ${qty}` : "Đơn giá điều dưỡng"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Cảnh báo cập nhật giá Realtime (Chuyển xuống dưới Mục 3 theo yêu cầu user, bỏ icon chuông) */}
                                {priceUpdateAlert && (
                                    <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs animate-in fade-in duration-200 mt-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <div className="flex-1 font-semibold leading-relaxed">{priceUpdateAlert}</div>
                                    </div>
                                )}
                            </div>

                            {/* 4. CHỌN NGÀY & KHUNG GIỜ TRỰC KHẢ DỤNG (CINEMA SLOTS) */}
                            <div className="space-y-3 pt-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        <Clock className="w-4 h-4 text-[#00677C]" />
                                        4. Khung giờ trực khả dụng <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 font-medium">Ngày trực:</span>
                                        <input
                                            type="date"
                                            min={todayStr}
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none focus:border-teal-500"
                                        />
                                    </div>
                                </div>

                                {/* Chú thích trạng thái slot */}
                                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3.5 h-3.5 rounded-md bg-emerald-50 border border-emerald-300"></span>
                                        <span>Còn trống</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3.5 h-3.5 rounded-md bg-[#00677C] text-white"></span>
                                        <span className="font-semibold text-slate-700">Đang chọn</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-300"></span>
                                        <span>Đã kín / Quá giờ</span>
                                    </div>
                                </div>

                                {/* Lưới 16 Slot Cinema */}
                                {loadingSlots ? (
                                    <div className="py-8 flex items-center justify-center gap-2 text-slate-400">
                                        <Loader2 className="w-5 h-5 animate-spin text-[#00677C]" />
                                        <span className="text-xs font-medium">Đang đồng bộ lịch trống thực tế của điều dưỡng...</span>
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
                                                    title={!isAvailable ? (slot.reason || "Không khả dụng") : "Nhấn để tự động chọn chuỗi suất trực liên tiếp"}
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
                                                        {isSelected
                                                            ? "Đã chọn"
                                                            : isAvailable
                                                            ? "Còn trống"
                                                            : slot.reason?.toLowerCase().includes("qua")
                                                            ? "Đã qua giờ"
                                                            : "Đã kín"}
                                                    </span>
                                                    {!isAvailable && (
                                                        <Lock className="w-3 h-3 text-slate-400 absolute top-1.5 right-1.5" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Hướng dẫn trực quan về số khung giờ cần chọn */}
                                {requiredSlots > 0 && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-600">
                                        <span>
                                            Yêu cầu chọn: <strong className="text-slate-900">{requiredSlots} khung giờ liên tiếp</strong> (~{totalMinutes} phút)
                                        </span>
                                        <span className={`font-bold ${
                                            selectedSlotIndexes.length >= requiredSlots && isConsecutive(selectedSlotIndexes)
                                                ? "text-emerald-600"
                                                : "text-amber-600"
                                        }`}>
                                            Đã chọn {selectedSlotIndexes.length}/{requiredSlots} khung giờ {extraSlotsCount > 0 ? `(+${extraSlotsCount} ca thêm)` : ""}
                                        </span>
                                    </div>
                                )}

                                {/* Chú thích nghiệp vụ y tế bắt buộc theo tài liệu V2.1 */}
                                <div className="text-[11px] text-slate-500 italic bg-teal-50/50 p-2.5 rounded-xl border border-teal-100/80 flex items-start gap-2">
                                    <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                    <span>
                                        Thời gian ca trực là khung giờ giữ chỗ. Thời lượng chăm sóc thực tế phụ thuộc vào việc hoàn tất đầy đủ quy trình chuyên môn y tế của các gói dịch vụ đã chọn.
                                    </span>
                                </div>
                            </div>

                            {/* 5. GIỜ YÊU CẦU CÓ MẶT TẠI NHÀ & GHI CHÚ */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Giờ yêu cầu có mặt (Tùy chọn)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: 17:15, hoặc Có mặt đúng 17:00..."
                                        value={requestedArrivalTime}
                                        onChange={(e) => setRequestedArrivalTime(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Ghi chú dặn dò điều dưỡng (Tùy chọn)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Bác hay chóng mặt; bấm chuông cửa số 2..."
                                        value={customerNotes}
                                        onChange={(e) => setCustomerNotes(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* 6. TÙY CHỌN ĐÀM PHÁN GIÁ TRONG PHÒNG CHAT (NẾU MỞ TỪ CHAT) */}
                            {conversationId && (
                                <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/90 space-y-2.5 text-xs">
                                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={isProposalMode}
                                            onChange={(e) => setIsProposalMode(e.target.checked)}
                                            className="w-4 h-4 mt-0.5 text-teal-600 rounded border-teal-300 focus:ring-teal-500 cursor-pointer shrink-0"
                                        />
                                        <div>
                                            <span className="font-black text-[#00677C] block">
                                                Thương lượng giá trực tiếp với điều dưỡng (Đề xuất qua tin nhắn Chat)
                                            </span>
                                            <span className="text-[11px] text-slate-500 block mt-0.5">
                                                Gửi phiếu đề xuất ca vào phòng chat để điều dưỡng {nurseName} xem xét và chấp thuận trước khi bạn thanh toán.
                                            </span>
                                        </div>
                                    </label>

                                    {isProposalMode && (
                                        <div className="pt-2 border-t border-teal-100 space-y-1.5 animate-in fade-in duration-150">
                                            <label className="block font-bold text-slate-700">
                                                Mức giá bạn mong muốn đề xuất (VNĐ)
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={proposedPrice}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/[^\d]/g, "");
                                                    setProposedPrice(raw ? Number(raw).toLocaleString("vi-VN") : "");
                                                }}
                                                placeholder={`Mặc định: ${baseServicesPrice.toLocaleString("vi-VN")} VNĐ`}
                                                className="w-full px-3.5 py-2 rounded-xl border border-teal-300 bg-white text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20"
                                            />
                                            <p className="text-[10px] text-slate-500 italic">
                                                * Để trống nếu bạn đồng ý với tổng giá niêm yết của các dịch vụ đã chọn ({baseServicesPrice.toLocaleString("vi-VN")} đ).
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 7. BẢNG TỔNG KẾT CHI PHÍ MINH BẠCH (ADR-002) */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/40 border border-slate-200/90 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Tổng tiền dịch vụ chăm sóc ({selectedServiceIds.length} dịch vụ • ~{totalMinutes} phút):</span>
                                    <span className="font-bold text-slate-900">{baseServicesPrice.toLocaleString("vi-VN")} VNĐ</span>
                                </div>
                                {extraMinutesPrice > 0 && (
                                    <div className="flex items-center justify-between text-teal-700">
                                        <span>Phí suất trực thêm giờ ({extraSlotsCount} ca • ~{extraMinutes} phút):</span>
                                        <span className="font-bold">+{extraMinutesPrice.toLocaleString("vi-VN")} VNĐ</span>
                                    </div>
                                )}
                                {!isProposalMode && (
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <span>Phí bảo hiểm &amp; Nền tảng CareLink (cố định):</span>
                                            <span title="Bảo hiểm trách nhiệm y tế + Vận hành hệ thống giữ chỗ PayOS 30 phút" className="cursor-help text-slate-400">
                                                <HelpCircle className="w-3.5 h-3.5" />
                                            </span>
                                        </span>
                                        <span className="font-bold text-slate-900">{platformFee.toLocaleString("vi-VN")} VNĐ</span>
                                    </div>
                                )}
                                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm sm:text-base font-black text-slate-900">
                                    <span className="text-[#00677C]">
                                        {isProposalMode ? "Tổng giá trị đề xuất:" : "Tổng thanh toán tạm giữ (PayOS):"}
                                    </span>
                                    <span className="text-[#00677C] text-base sm:text-xl font-black">
                                        {(isProposalMode && proposedPrice
                                            ? parseInt(proposedPrice.replace(/[^\d]/g, ""), 10)
                                            : grandTotal
                                        ).toLocaleString("vi-VN")} VNĐ
                                    </span>
                                </div>
                            </div>

                            {/* 8. HIỂN THỊ THÔNG BÁO LỖI (ĐẶT NGAY DƯỚI TỔNG TIỀN THEO YÊU CẦU USER) */}
                            {validationError && (
                                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200">
                                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                    <div className="flex-1 font-semibold leading-relaxed">{validationError}</div>
                                </div>
                            )}

                            {/* 9. NÚT XÁC NHẬN ĐẶT LỊCH / GỬI ĐỀ XUẤT */}
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
                                            <span>{isProposalMode ? "Đang gửi đề xuất..." : "Đang tạo lịch giữ chỗ..."}</span>
                                        </>
                                    ) : isProposalMode ? (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Gửi đề xuất thỏa thuận qua Chat</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4" />
                                            <span>Xác nhận đặt lịch &amp; Thanh toán</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════════════ */}
            {/* MODAL XEM CHI TIẾT HỒ SƠ Y TẾ NGƯỜI THÂN (KHI CLICK NÚT I KẾ TÊN)       */}
            {/* ══════════════════════════════════════════════════════════════════════════ */}
            {selectedViewingRecipient && (
                <div
                    className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) setSelectedViewingRecipient(null);
                    }}
                >
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 my-auto">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#00677C] flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                                        {selectedViewingRecipient.fullName || selectedViewingRecipient.name}
                                    </h3>
                                    <p className="text-[11px] text-slate-500">
                                        Hồ sơ y tế người thân
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedViewingRecipient(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Mối quan hệ</span>
                                    <span className="font-bold text-slate-800">{selectedViewingRecipient.relationship || "Người thân"}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Giới tính</span>
                                    <span className="font-bold text-slate-800">
                                        {selectedViewingRecipient.gender === 1 || selectedViewingRecipient.genderName === "Nam" ? "Nam" : selectedViewingRecipient.gender === 2 || selectedViewingRecipient.genderName === "Nữ" ? "Nữ" : "Khác"}
                                    </span>
                                </div>
                                <div className="col-span-2 pt-1 border-t border-slate-200/60">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Ngày sinh / Tuổi</span>
                                    <span className="font-bold text-slate-800">
                                        {selectedViewingRecipient.dateOfBirth || "Chưa rõ năm sinh"}
                                        {calculateAge(selectedViewingRecipient.dateOfBirth) ? ` (${calculateAge(selectedViewingRecipient.dateOfBirth)} tuổi)` : ""}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Địa chỉ thường trú / nhận ca</span>
                                <p className="p-2.5 rounded-xl bg-slate-50 text-slate-700 font-medium border border-slate-100">
                                    {selectedViewingRecipient.address || "Chưa cập nhật địa chỉ riêng"}
                                </p>
                            </div>

                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Tiền sử bệnh án &amp; Dị ứng</span>
                                <p className="p-2.5 rounded-xl bg-slate-50 text-slate-700 font-medium border border-slate-100">
                                    {selectedViewingRecipient.medicalHistory || "Không có tiền sử bệnh lý đặc biệt"}
                                </p>
                            </div>

                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Lưu ý chăm sóc đặc biệt</span>
                                <p className="p-2.5 rounded-xl bg-slate-50 text-slate-700 font-medium border border-slate-100">
                                    {selectedViewingRecipient.specialNotes || "Không có ghi chú thêm"}
                                </p>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedViewingRecipient(null)}
                                className="px-5 py-2 rounded-xl bg-[#00677C] text-white text-xs font-bold hover:bg-[#005566] transition cursor-pointer shadow-xs"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════════════ */}
            {/* POPUP XÁC NHẬN QUYỀN RIÊNG TƯ Y TẾ (MÀU VÀNG/AMBER NỔI BẬT, MẶC ĐỊNH CHƯA TÍCH) */}
            {/* ══════════════════════════════════════════════════════════════════════════ */}
            {showPrivacyPopup && (
                <div
                    className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget && !isSubmitting) setShowPrivacyPopup(false);
                    }}
                >
                    <div className="w-full max-w-md bg-white rounded-3xl border border-amber-300 shadow-2xl overflow-hidden p-6 space-y-4 my-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900">
                                    Quyền riêng tư &amp; Bảo mật Y tế
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Tiêu chuẩn bảo vệ dữ liệu sức khỏe CareLink
                                </p>
                            </div>
                        </div>

                        {/* Hộp cam kết màu vàng/amber nổi bật */}
                        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2.5 text-xs leading-relaxed">
                            <p className="font-medium">
                                Để Điều dưỡng chuẩn bị đầy đủ trang thiết bị y tế và chăm sóc an toàn nhất cho người thân của bạn, hệ thống khuyến nghị chia sẻ tóm tắt hồ sơ sức khỏe và tiền sử bệnh án.
                            </p>
                            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={consentMedical}
                                    onChange={(e) => setConsentMedical(e.target.checked)}
                                    className="w-4.5 h-4.5 mt-0.5 text-amber-600 rounded border-amber-400 focus:ring-amber-500 cursor-pointer shrink-0"
                                />
                                <span className="font-bold text-amber-950 leading-tight">
                                    Tôi đồng ý chia sẻ tóm tắt hồ sơ sức khỏe và tiền sử bệnh án của người thân cho Điều dưỡng tiếp nhận ca này.
                                </span>
                            </label>
                            <p className="text-[11px] text-amber-800 italic">
                                * Nếu bạn không tích chọn, điều dưỡng sẽ chỉ tiếp nhận dịch vụ mà không thể xem chi tiết tiền sử bệnh án trước đó.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowPrivacyPopup(false)}
                                disabled={isSubmitting}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                            >
                                Quay lại
                            </button>
                            <button
                                type="button"
                                onClick={handleFinalConfirmBooking}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00677C] to-[#008BA3] text-xs font-extrabold text-white shadow-md hover:from-[#005566] hover:to-[#007489] transition flex items-center gap-2 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Đang chuyển cổng PayOS...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Tiếp tục thanh toán</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════════════ */}
            {/* MODAL LỒNG: THÊM HỒ SƠ NGƯỜI THÂN TỨC THÌ (KHÔNG CẦN CHUYỂN TRANG)        */}
            {/* ══════════════════════════════════════════════════════════════════════════ */}
            {showAddRelativeModal && (
                <div
                    className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget && !isSavingRelative) setShowAddRelativeModal(false);
                    }}
                >
                    <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#00677C] flex items-center justify-center">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Thêm hồ sơ người thân mới
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddRelativeModal(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {addRelativeError && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                                {addRelativeError}
                            </div>
                        )}

                        <form onSubmit={handleSaveNewRelative} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">
                                    Họ và tên người nhận chăm sóc <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ví dụ: Cụ Nguyễn Văn An"
                                    value={newRelativeForm.fullName}
                                    onChange={(e) => setNewRelativeForm({ ...newRelativeForm, fullName: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-teal-500 font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Ngày sinh</label>
                                    <input
                                        type="date"
                                        value={newRelativeForm.dateOfBirth}
                                        onChange={(e) => setNewRelativeForm({ ...newRelativeForm, dateOfBirth: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Giới tính</label>
                                    <select
                                        value={newRelativeForm.gender}
                                        onChange={(e) => setNewRelativeForm({ ...newRelativeForm, gender: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-teal-500 font-medium"
                                    >
                                        <option value={1}>Nam</option>
                                        <option value={2}>Nữ</option>
                                        <option value={3}>Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">
                                    Tiền sử bệnh án &amp; Dị ứng
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Tăng huyết áp 10 năm, dị ứng phấn hoa..."
                                    value={newRelativeForm.medicalHistory}
                                    onChange={(e) => setNewRelativeForm({ ...newRelativeForm, medicalHistory: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">
                                    Địa chỉ người bệnh đang ở
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: 120 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. HCM"
                                    value={newRelativeForm.address}
                                    onChange={(e) => setNewRelativeForm({ ...newRelativeForm, address: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">
                                    Lưu ý đặc biệt cho điều dưỡng
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Đi lại chậm, cần hỗ trợ khi lên xuống cầu thang..."
                                    value={newRelativeForm.specialNotes}
                                    onChange={(e) => setNewRelativeForm({ ...newRelativeForm, specialNotes: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-teal-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowAddRelativeModal(false)}
                                    disabled={isSavingRelative}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingRelative}
                                    className="px-5 py-2 rounded-xl bg-[#00677C] text-white font-extrabold hover:bg-[#005566] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                    {isSavingRelative ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Đang lưu...</span>
                                        </>
                                    ) : (
                                        <span>Lưu hồ sơ người thân</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
