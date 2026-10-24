import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    X,
    Calendar,
    Clock,
    User,
    MapPin,
    Stethoscope,
    FileText,
    AlertCircle,
    CheckCircle2,
    Loader2,
    PlusCircle,
    DollarSign,
    Layers,
    Sparkles,
} from "lucide-react";
import familyApi from "../../../api/familyApi";
import conversationApi from "../../../api/conversationApi";

// Dữ liệu mẫu chuẩn cấu trúc DTO Backend khi máy chủ chưa có dữ liệu
const FALLBACK_SERVICES = [
    {
        id: "d3b07384-d113-4c91-9c32-2d113a0e1001",
        serviceName: "Chăm sóc phục hồi sau phẫu thuật",
        description: "Theo dõi sinh hiệu, thay băng vết mổ vô trùng, hỗ trợ tập vận động và nhắc dùng thuốc đúng giờ.",
        basePrice: 350000,
        customPrice: 350000,
        durationMinutes: 120,
        isActive: true,
    },
    {
        id: "d3b07384-d113-4c91-9c32-2d113a0e1002",
        serviceName: "Vật lý trị liệu & Vận động khớp",
        description: "Xoa bóp phục hồi chức năng, hướng dẫn co duỗi chi dưới, tập đi lại an toàn.",
        basePrice: 400000,
        customPrice: 400000,
        durationMinutes: 90,
        isActive: true,
    },
    {
        id: "d3b07384-d113-4c91-9c32-2d113a0e1003",
        serviceName: "Chăm sóc người cao tuổi & Vệ sinh toàn diện",
        description: "Hỗ trợ tắm rửa, gội đầu tại giường, vệ sinh răng miệng, cho ăn qua sonde và đo đường huyết.",
        basePrice: 300000,
        customPrice: 300000,
        durationMinutes: 120,
        isActive: true,
    },
    {
        id: "d3b07384-d113-4c91-9c32-2d113a0e1004",
        serviceName: "Tiêm thuốc & Thay băng vết thương",
        description: "Thực hiện tiêm bắp, tiêm dưới da theo y lệnh bác sĩ, rửa vết thương sạch và thay gạc vô khuẩn.",
        basePrice: 250000,
        customPrice: 250000,
        durationMinutes: 60,
        isActive: true,
    },
];

export default function CreateProposalModal({
    isOpen,
    onClose,
    conversationId,
    caregiverId,
    caregiverName,
    onProposalCreated,
}) {
    const [services, setServices] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [addresses, setAddresses] = useState([]);

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [dataError, setDataError] = useState("");

    // Form inputs — Combo đa dịch vụ
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const [recipientId, setRecipientId] = useState("");
    const [addressId, setAddressId] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [customDealPrice, setCustomDealPrice] = useState("");
    const [notes, setNotes] = useState("");

    const [dealPriceError, setDealPriceError] = useState("");

    // Submit state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Pre-calculate today for min date
    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        setIsLoadingData(true);
        setDataError("");
        setSubmitError("");
        setDealPriceError("");
        setCustomDealPrice("");
        setSelectedServiceIds([]); // Để rỗng mặc định để khách tự chọn dịch vụ mong muốn

        // Set default date to tomorrow and time to 08:30
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduledDate(tomorrow.toISOString().split("T")[0]);
        setScheduledTime("08:30");

        // Gọi đồng thời lấy bảng giá điều dưỡng (hoặc dịch vụ chung), danh sách người thân và sổ địa chỉ
        const pricingPromise = caregiverId
            ? familyApi.getNursePricing(caregiverId).catch(() => null)
            : Promise.resolve(null);

        Promise.allSettled([
            pricingPromise,
            familyApi.getServices(),
            familyApi.getRecipients(),
            familyApi.getAddresses(),
        ])
            .then(([nursePricingRes, servRes, recRes, addrRes]) => {
                if (!isMounted) return;

                // 1. Gói Dịch vụ từ Backend (Ưu tiên bảng giá của Điều dưỡng nếu có)
                let servList = [];
                const nursePricings = nursePricingRes.status === "fulfilled" ? nursePricingRes.value : null;
                const nursePricingItems = Array.isArray(nursePricings)
                    ? nursePricings
                    : (nursePricings?.data || []);

                if (nursePricingItems.length > 0) {
                    servList = nursePricingItems
                        .filter((p) => p.isOffered)
                        .map((p) => ({
                            id: p.serviceId,
                            serviceName: p.serviceName,
                            description: p.description,
                            basePrice: p.basePrice || p.customPrice,
                            customPrice: p.customPrice || p.basePrice,
                            durationMinutes: p.durationMinutes || 60,
                            requiresLicense: p.requiresLicense,
                        }));
                }

                if (servList.length === 0 && servRes.status === "fulfilled") {
                    const rawServ = Array.isArray(servRes.value) ? servRes.value : (servRes.value?.items || []);
                    servList = rawServ.map((s) => ({
                        id: s.id,
                        serviceName: s.serviceName,
                        description: s.description,
                        basePrice: s.basePrice,
                        customPrice: s.basePrice,
                        durationMinutes: s.durationMinutes || 60,
                    }));
                }

                if (servList.length === 0) {
                    servList = FALLBACK_SERVICES;
                }

                setServices(servList);
                // Khách hàng tự do bấm chọn dịch vụ, không ép chọn phần tử đầu tiên
                setSelectedServiceIds([]);

                // 2. Người nhận chăm sóc (Tôn trọng dữ liệu thật từ DB)
                let recList = [];
                if (recRes.status === "fulfilled") {
                    recList = Array.isArray(recRes.value) ? recRes.value : (recRes.value?.items || []);
                }
                setRecipients(recList);
                setRecipientId(recList[0]?.id || "");

                // 3. Sổ địa chỉ
                let addrList = [];
                if (addrRes.status === "fulfilled") {
                    addrList = Array.isArray(addrRes.value) ? addrRes.value : (addrRes.value?.items || []);
                }
                setAddresses(addrList);
                const defaultAddr = addrList.find((a) => a.isDefault) || addrList[0];
                setAddressId(defaultAddr?.id || "");
            })
            .catch(() => {
                if (!isMounted) return;
                setServices(FALLBACK_SERVICES);
                setSelectedServiceIds([]);
                setRecipients([]);
                setRecipientId("");
                setAddresses([]);
                setAddressId("");
            })
            .finally(() => {
                if (isMounted) setIsLoadingData(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen, caregiverId]);

    if (!isOpen) return null;

    // Toggle dịch vụ trong combo
    const toggleService = (srvId) => {
        setSelectedServiceIds((prev) => {
            if (prev.includes(srvId)) {
                return prev.filter((id) => id !== srvId);
            }
            return [...prev, srvId];
        });
    };

    // Danh sách các dịch vụ đang được chọn
    const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
    const totalDurationMinutes = selectedServices.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const totalServiceBasePrice = selectedServices.reduce((acc, s) => acc + Number(s.customPrice || s.basePrice || 0), 0);
    const platformFee = 60000;
    const finalCalculatedTotal = (customDealPrice ? Number(customDealPrice) : totalServiceBasePrice) + platformFee;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        setDealPriceError("");

        if (selectedServiceIds.length === 0) {
            setSubmitError("Vui lòng chọn ít nhất 1 dịch vụ chăm sóc trong danh sách.");
            return;
        }

        if (!recipientId) {
            setSubmitError("Vui lòng chọn hồ sơ người nhận chăm sóc.");
            return;
        }

        if (!scheduledDate || !scheduledTime) {
            setSubmitError("Vui lòng chọn ngày và giờ bắt đầu ca.");
            return;
        }

        if (customDealPrice !== "") {
            const num = Number(customDealPrice);
            if (isNaN(num) || num < 0) {
                setDealPriceError("Vui lòng nhập giá thương lượng hợp lệ (từ 0 VNĐ trở lên hoặc để trống để theo giá niêm yết).");
                return;
            }
        }

        // Xử lý chuẩn xác giờ 24h từ input HH:mm
        const [hoursStr, minutesStr] = scheduledTime.split(":");
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        const startDateTime = new Date(`${scheduledDate}T00:00:00`);
        startDateTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const minLeadTime = new Date(now.getTime() + 30 * 60 * 1000); // Tối thiểu trước 30 phút

        if (startDateTime < minLeadTime) {
            setSubmitError("Thời gian bắt đầu ca phải cách thời điểm hiện tại tối thiểu 30 phút.");
            return;
        }

        const finalDealPrice = customDealPrice !== "" ? Number(customDealPrice) : totalServiceBasePrice;
        const payload = {
            serviceId: selectedServiceIds[0], // Tương thích ngược BE V1
            serviceIds: selectedServiceIds,   // Combo đa dịch vụ BE V2.1
            recipientId: recipientId,
            addressId: addressId || null,
            scheduledStart: startDateTime.toISOString(),
            proposedTotalPrice: finalDealPrice, // Tiền công dịch vụ thỏa thuận (phí sàn 60k được quản lý tập trung)
            notes: notes.trim() || null,
        };

        setIsSubmitting(true);
        try {
            const res = await conversationApi.createProposal(conversationId, payload);
            if (onProposalCreated) {
                onProposalCreated(res);
            }
            onClose();
        } catch (err) {
            console.error("[CareLink] Lỗi khi tạo đề xuất ca:", err);
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Không thể gửi đề xuất ca chăm sóc tới điều dưỡng. Vui lòng kiểm tra lại.";
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-gradient-to-r from-teal-50/70 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-100/70 text-[#00677c] flex items-center justify-center shadow-2xs">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                Đề xuất ca chăm sóc mới
                                <span className="text-[10px] font-semibold bg-teal-100 text-[#00677c] px-2 py-0.5 rounded-full">
                                    Combo đa dịch vụ
                                </span>
                            </h3>
                            <p className="text-xs text-slate-500">
                                Gửi thỏa thuận trực tiếp tới {caregiverName || "Điều dưỡng"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Đóng modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
                    {isLoadingData ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                            <Loader2 className="w-7 h-7 text-[#00677c] animate-spin" />
                            <span className="text-xs font-medium">Đang tải bảng giá dịch vụ và hồ sơ...</span>
                        </div>
                    ) : dataError ? (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{dataError}</span>
                        </div>
                    ) : recipients.length === 0 ? (
                        /* Bắt buộc chọn người nhận chăm sóc trước khi tạo Deal */
                        <div className="py-8 px-5 text-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 space-y-3.5">
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">
                                Chưa có hồ sơ người nhận chăm sóc
                            </h4>
                            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                                Theo quy định an toàn y tế của CareLink, gia đình bắt buộc phải tạo hồ sơ người bệnh (tiền sử bệnh, độ tuổi, dị ứng) trước khi tạo đề xuất ca.
                            </p>
                            <Link
                                to="/dashboard/relatives"
                                onClick={onClose}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00677c] text-white text-xs font-bold hover:bg-[#005566] transition-colors shadow-sm"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Tạo hồ sơ người bệnh ngay</span>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} id="create-proposal-form" noValidate className="space-y-5">
                            {/* Thông báo lỗi Submit */}
                            {submitError && (
                                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">{submitError}</span>
                                </div>
                            )}

                            {/* 1. COMBO ĐA DỊCH VỤ (Multi-select Checkbox) */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Chọn các dịch vụ trong ca <span className="text-rose-500">*</span>
                                    </label>
                                    <span className="text-[11px] text-teal-700 font-semibold">
                                        Đã chọn: {selectedServices.length} dịch vụ ({totalDurationMinutes} phút)
                                    </span>
                                </div>

                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                    {services.map((s) => {
                                        const isChecked = selectedServiceIds.includes(s.id);
                                        const price = Number(s.customPrice || s.basePrice || 0);
                                        return (
                                            <div
                                                key={s.id}
                                                onClick={() => toggleService(s.id)}
                                                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                                                    isChecked
                                                        ? "bg-teal-50/60 border-[#00677c] shadow-2xs"
                                                        : "bg-white border-slate-200 hover:border-slate-300"
                                                }`}
                                            >
                                                <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                                                    isChecked
                                                        ? "bg-[#00677c] border-[#00677c] text-white shadow-2xs"
                                                        : "border-slate-300 bg-white group-hover:border-slate-400"
                                                }`}>
                                                    {isChecked && (
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.8" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-xs font-bold text-slate-900 truncate">
                                                            {s.serviceName}
                                                        </p>
                                                        <span className="text-xs font-extrabold text-[#00677c] shrink-0">
                                                            {price.toLocaleString("vi-VN")} đ
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {s.durationMinutes} phút
                                                        </span>
                                                        {s.requiresLicense && (
                                                            <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded text-[10px] font-semibold border border-amber-200">
                                                                Yêu cầu CCHN
                                                            </span>
                                                        )}
                                                    </div>
                                                    {s.description && (
                                                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                                            {s.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2. CHỌN HỒ SƠ NGƯỜI BỆNH */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Hồ sơ người nhận chăm sóc <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={recipientId}
                                    onChange={(e) => setRecipientId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                >
                                    {recipients.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.fullName} {r.genderName ? `(${r.genderName})` : r.gender === 1 ? "(Nam)" : r.gender === 2 ? "(Nữ)" : ""} {r.medicalHistory ? `— ${r.medicalHistory}` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 3. ĐỊA CHỈ NHẬN CHĂM SÓC */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Địa chỉ chăm sóc (Tại nhà)
                                </label>
                                {addresses.length > 0 ? (
                                    <select
                                        value={addressId}
                                        onChange={(e) => setAddressId(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                    >
                                        <option value="">-- Sử dụng địa chỉ mặc định của người thân --</option>
                                        {addresses.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                [{a.label}] {a.fullAddress} {a.isDefault ? "★ Mặc định" : ""}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                        Hệ thống sẽ tự động sử dụng địa chỉ đăng ký mặc định của người bệnh.
                                    </p>
                                )}
                            </div>

                            {/* 4. NGÀY VÀ GIỜ BẮT ĐẦU */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Ngày chăm sóc <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        min={todayStr}
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Giờ bắt đầu <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* 5. GIÁ THƯƠNG LƯỢNG MONG MUỐN (OPTIONAL DEAL) */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Giá đề xuất thương lượng (VNĐ)
                                    </label>
                                    <span className="text-[11px] text-slate-400">
                                        Mặc định: {totalServiceBasePrice.toLocaleString("vi-VN")} đ
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        placeholder={`Tổng giá niêm yết: ${totalServiceBasePrice.toLocaleString("vi-VN")} đ`}
                                        value={customDealPrice}
                                        onChange={(e) => {
                                            setCustomDealPrice(e.target.value);
                                            setDealPriceError("");
                                        }}
                                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs text-slate-800 font-medium focus:outline-none transition-all placeholder:text-slate-400 ${
                                            dealPriceError
                                                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                                : "border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                        }`}
                                    />
                                </div>
                                {dealPriceError ? (
                                    <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 animate-in fade-in">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        <span>{dealPriceError}</span>
                                    </p>
                                ) : (
                                    <p className="text-[11px] text-slate-400">
                                        Để trống nếu bạn đồng ý với tổng giá niêm yết của các dịch vụ đã chọn.
                                    </p>
                                )}
                            </div>

                            {/* 6. GHI CHÚ THÊM */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Ghi chú đặc biệt cho Điều dưỡng
                                </label>
                                <textarea
                                    rows="2"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Ví dụ: Bác đi lại hơi yếu, nhờ điều dưỡng mang thêm dụng cụ đo đường huyết..."
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-slate-400"
                                    maxLength={500}
                                />
                            </div>

                            {/* 7. BẢNG TÍNH REALTIME CHI PHÍ */}
                            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-2.5">
                                <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                                    <span>Tổng thời lượng dự kiến:</span>
                                    <span className="font-bold text-teal-800">
                                        {totalDurationMinutes} phút
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-600">
                                    <span>Tổng tiền dịch vụ ({selectedServices.length} dịch vụ):</span>
                                    <span className="font-semibold text-slate-800">
                                        {(customDealPrice ? Number(customDealPrice) : totalServiceBasePrice).toLocaleString("vi-VN")} VNĐ
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-600">
                                    <span className="flex items-center gap-1">
                                        Phí nền tảng CareLink:
                                        <span className="text-[10px] text-slate-400 font-normal">(Bảo hiểm & vận hành)</span>
                                    </span>
                                    <span className="font-semibold text-teal-700">
                                        + 60.000 VNĐ
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-teal-200/60 flex items-center justify-between text-xs font-bold text-slate-800">
                                    <span>Tổng thanh toán dự kiến (PayOS Escrow):</span>
                                    <span className="text-sm sm:text-base font-extrabold text-[#00677c]">
                                        {finalCalculatedTotal.toLocaleString("vi-VN")} VNĐ
                                    </span>
                                </div>
                                <p className="text-[11px] text-teal-700/90 italic pt-1">
                                    * Phí nền tảng 60.000 VNĐ được quản lý tập trung theo chính sách CareLink (ADR-002). Số tiền sẽ được giữ an toàn trên PayOS Escrow cho đến khi nghiệm thu hoàn tất.
                                </p>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Hủy bỏ
                    </button>

                    {recipients.length > 0 && !isLoadingData && (
                        <button
                            type="submit"
                            form="create-proposal-form"
                            disabled={isSubmitting || selectedServiceIds.length === 0}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00677c] hover:bg-[#005566] text-white text-xs font-bold shadow-md hover:shadow-teal-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang gửi đề xuất...</span>
                                </>
                            ) : (
                                <span>Gửi đề xuất ({selectedServices.length} DV)</span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
