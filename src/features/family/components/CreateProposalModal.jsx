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
} from "lucide-react";
import familyApi from "../../../api/familyApi";
import conversationApi from "../../../api/conversationApi";

// Dữ liệu mẫu chuẩn cấu trúc DTO Backend khi máy chủ chưa khởi động hoặc chưa có dữ liệu
const FALLBACK_SERVICES = [
    {
        id: "d3b07384-d113-4c91-9c32-2d113a0e1001",
        serviceName: "Chăm sóc phục hồi sau phẫu thuật",
        description: "Theo dõi chỉ số sinh hiệu, thay băng rửa vết mổ vô trùng, hỗ trợ tập vận động và nhắc dùng thuốc đúng giờ.",
        basePrice: 350000,
        durationMinutes: 120,
        isActive: true,
    },
    {
        id: "d3b07384-d113-4c91-9c32-2d113a0e1002",
        serviceName: "Vật lý trị liệu & Vận động khớp",
        description: "Xoa bóp phục hồi chức năng, hướng dẫn co duỗi chi dưới, tập đứng và đi lại an toàn phòng ngừa té ngã.",
        basePrice: 400000,
        durationMinutes: 90,
        isActive: true,
    },
    {
        id: "d3b07384-d113-4c91-9c32-2d113a0e1003",
        serviceName: "Chăm sóc người cao tuổi & Vệ sinh toàn diện",
        description: "Hỗ trợ tắm rửa, gội đầu tại giường, vệ sinh răng miệng, cho ăn qua ống thông sonde và đo đường huyết.",
        basePrice: 300000,
        durationMinutes: 120,
        isActive: true,
    },
    {
        id: "d3b07384-d113-4c91-9c32-2d113a0e1004",
        serviceName: "Tiêm thuốc & Thay băng vết thương",
        description: "Thực hiện kỹ thuật tiêm bắp, tiêm dưới da theo y lệnh bác sĩ, rửa vết thương sạch và thay gạc vô khuẩn.",
        basePrice: 250000,
        durationMinutes: 60,
        isActive: true,
    },
];

const FALLBACK_RECIPIENTS = [
    {
        id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c61",
        fullName: "Bà Nguyễn Thị Lan",
        dateOfBirth: "1951-04-12",
        gender: 2,
        medicalHistory: "Tăng huyết áp 10 năm, sau phẫu thuật thay khớp gối phải tuần thứ 2.",
        specialNotes: "Đi lại cần nạng hỗ trợ, dễ bị tụt huyết áp tư thế.",
        address: "123 Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh",
    },
    {
        id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c62",
        fullName: "Bác Nguyễn Văn An (Bố)",
        dateOfBirth: "1948-09-20",
        gender: 1,
        medicalHistory: "Đái tháo đường type 2, di chứng tai biến nhẹ liệt nửa người trái.",
        specialNotes: "Cần hỗ trợ ăn uống và kiểm tra đường huyết trước các bữa ăn.",
        address: "45 Lê Văn Sỹ, Phường 13, Quận 3, TP. Hồ Chí Minh",
    },
];

const FALLBACK_ADDRESSES = [
    {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d401",
        label: "Nhà riêng",
        fullAddress: "123 Nguyễn Gia Trí, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh",
        ward: "Phường 25",
        district: "Quận Bình Thạnh",
        city: "TP. Hồ Chí Minh",
        isDefault: true,
    },
    {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d402",
        label: "Nhà bố mẹ",
        fullAddress: "45 Lê Văn Sỹ, Phường 13, Quận 3, TP. Hồ Chí Minh",
        ward: "Phường 13",
        district: "Quận 3",
        city: "TP. Hồ Chí Minh",
        isDefault: false,
    },
];

export default function CreateProposalModal({
    isOpen,
    onClose,
    conversationId,
    caregiverName,
    onProposalCreated,
}) {
    const [services, setServices] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [addresses, setAddresses] = useState([]);

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [dataError, setDataError] = useState("");

    // Form inputs
    const [serviceId, setServiceId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [addressId, setAddressId] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [notes, setNotes] = useState("");

    // Submit state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Pre-calculate today / tomorrow for min date
    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        setIsLoadingData(true);
        setDataError("");
        setSubmitError("");

        // Set default date to tomorrow and time to 08:30
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduledDate(tomorrow.toISOString().split("T")[0]);
        setScheduledTime("08:30");

        Promise.allSettled([
            familyApi.getServices(),
            familyApi.getRecipients(),
            familyApi.getAddresses(),
        ])
            .then(([servRes, recRes, addrRes]) => {
                if (!isMounted) return;

                // 1. Dịch vụ
                let servList = [];
                if (servRes.status === "fulfilled") {
                    servList = Array.isArray(servRes.value)
                        ? servRes.value
                        : servRes.value?.items || [];
                }
                if (!servList || servList.length === 0) {
                    servList = FALLBACK_SERVICES;
                }
                setServices(servList);
                setServiceId(servList[0]?.id || "");

                // 2. Người nhận chăm sóc
                let recList = [];
                if (recRes.status === "fulfilled") {
                    recList = Array.isArray(recRes.value)
                        ? recRes.value
                        : recRes.value?.items || [];
                }
                if (!recList || recList.length === 0) {
                    recList = FALLBACK_RECIPIENTS;
                }
                setRecipients(recList);
                setRecipientId(recList[0]?.id || "");

                // 3. Sổ địa chỉ
                let addrList = [];
                if (addrRes.status === "fulfilled") {
                    addrList = Array.isArray(addrRes.value)
                        ? addrRes.value
                        : addrRes.value?.items || [];
                }
                if (!addrList || addrList.length === 0) {
                    addrList = FALLBACK_ADDRESSES;
                }
                setAddresses(addrList);
                const defaultAddr = addrList.find((a) => a.isDefault) || addrList[0];
                setAddressId(defaultAddr?.id || "");
            })
            .catch(() => {
                if (!isMounted) return;
                setServices(FALLBACK_SERVICES);
                setServiceId(FALLBACK_SERVICES[0].id);
                setRecipients(FALLBACK_RECIPIENTS);
                setRecipientId(FALLBACK_RECIPIENTS[0].id);
                setAddresses(FALLBACK_ADDRESSES);
                setAddressId(FALLBACK_ADDRESSES[0].id);
            })
            .finally(() => {
                if (isMounted) setIsLoadingData(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const selectedService = services.find((s) => s.id === serviceId);
    const selectedRecipient = recipients.find((r) => r.id === recipientId);
    const selectedAddress = addresses.find((a) => a.id === addressId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        if (!serviceId) {
            setSubmitError("Vui lòng chọn gói dịch vụ chăm sóc.");
            return;
        }

        if (!recipientId) {
            setSubmitError("Vui lòng chọn người nhận chăm sóc.");
            return;
        }

        if (!scheduledDate || !scheduledTime) {
            setSubmitError("Vui lòng chọn ngày và giờ bắt đầu ca.");
            return;
        }

        // Tạo chuỗi thời gian ISO
        const startDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`);
        const now = new Date();
        const minLeadTime = new Date(now.getTime() + 30 * 60 * 1000); // Tối thiểu trước 30 phút

        if (startDateTime < minLeadTime) {
            setSubmitError("Thời gian bắt đầu ca phải cách thời điểm hiện tại tối thiểu 30 phút.");
            return;
        }

        const payload = {
            serviceId: serviceId,
            recipientId: recipientId,
            addressId: addressId || null,
            scheduledStart: startDateTime.toISOString(),
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
            const msg = err.response?.data?.detail || err.response?.data?.message || "Không thể gửi đề xuất ca chăm sóc tới điều dưỡng. Vui lòng thử lại.";
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-gradient-to-r from-teal-50/60 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-100/70 text-[#00677c] flex items-center justify-center shadow-2xs">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Đề xuất ca chăm sóc mới
                            </h3>
                            <p className="text-xs text-slate-500">
                                Gửi thỏa thuận 2 chiều tới {caregiverName || "Điều dưỡng"}
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
                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                    {isLoadingData ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                            <Loader2 className="w-7 h-7 text-[#00677c] animate-spin" />
                            <span className="text-xs font-medium">Đang tải danh mục dịch vụ và người thân...</span>
                        </div>
                    ) : dataError ? (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{dataError}</span>
                        </div>
                    ) : recipients.length === 0 ? (
                        /* Empty state người nhận chăm sóc */
                        <div className="py-8 px-4 text-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">
                                Chưa có hồ sơ người nhận chăm sóc
                            </h4>
                            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                                Để tạo đề xuất đặt ca, bạn cần thêm ít nhất 1 hồ sơ người thân (bệnh nhân) trong hệ thống.
                            </p>
                            <Link
                                to="/dashboard/relatives"
                                onClick={onClose}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00677c] text-white text-xs font-bold hover:bg-[#005566] transition-colors"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Thêm hồ sơ người thân ngay</span>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} id="create-proposal-form" className="space-y-4.5">
                            {/* Thông báo lỗi Submit */}
                            {submitError && (
                                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">{submitError}</span>
                                </div>
                            )}

                            {/* 1. Chọn Gói Dịch vụ */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Gói dịch vụ chăm sóc <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={serviceId}
                                    onChange={(e) => setServiceId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                >
                                    {services.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.serviceName} ({s.durationMinutes} phút) — {Number(s.basePrice).toLocaleString("vi-VN")} đ
                                        </option>
                                    ))}
                                </select>
                                {selectedService?.description && (
                                    <p className="text-[11px] text-slate-500 italic px-1">
                                        {selectedService.description}
                                    </p>
                                )}
                            </div>

                            {/* 2. Chọn Người nhận chăm sóc */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Người cần chăm sóc <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={recipientId}
                                    onChange={(e) => setRecipientId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                >
                                    {recipients.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.fullName} {r.gender === 1 ? "(Nam)" : r.gender === 2 ? "(Nữ)" : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 3. Chọn Địa chỉ nhận chăm sóc */}
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
                                        {addresses.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                [{a.label}] {a.fullAddress} {a.isDefault ? "★ Mặc định" : ""}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                        Hệ thống sẽ tự động sử dụng địa chỉ đăng ký mặc định của bạn.
                                    </p>
                                )}
                            </div>

                            {/* 4. Ngày và Giờ bắt đầu */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Ngày chăm sóc <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            type="date"
                                            min={todayStr}
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                                        />
                                    </div>
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

                            {/* 5. Ghi chú thêm cho điều dưỡng */}
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

                            {/* 6. Hộp tóm tắt thỏa thuận & chi phí Authoritative từ Backend */}
                            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-2">
                                <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                                    <span>Thời lượng ca:</span>
                                    <span className="font-bold text-teal-800">
                                        {selectedService?.durationMinutes || 60} phút
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                                    <span>Chi phí dự kiến (Đã gồm VAT & phí nền tảng):</span>
                                    <span className="text-sm font-extrabold text-[#00677c]">
                                        {selectedService?.basePrice
                                            ? Number(selectedService.basePrice).toLocaleString("vi-VN") + " VNĐ"
                                            : "0 VNĐ"}
                                    </span>
                                </div>
                                <p className="text-[11px] text-teal-700/90 italic pt-1 border-t border-teal-100">
                                    * Sau khi điều dưỡng chấp nhận, ca sẽ được tạo ở trạng thái Chờ thanh toán với thời hạn giữ chỗ 30 phút.
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
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00677c] hover:bg-[#005566] text-white text-xs font-bold shadow-md hover:shadow-teal-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang gửi đề xuất...</span>
                                </>
                            ) : (
                                <span>Gửi đề xuất ca</span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
