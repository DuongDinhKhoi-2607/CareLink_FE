import React, { useState, useEffect, useMemo } from "react";
import {
    DollarSign,
    Wallet,
    Phone,
    Mail,
    Shield,
    Clock,
    RefreshCw,
    Save,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
    Info,
    Calendar,
    MapPin
} from "lucide-react";
import adminApi from "../../../api/adminApi";
import ConfirmSettingModal from "../components/ConfirmSettingModal";

export default function AdminSettings() {
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [settingsList, setSettingsList] = useState([]);
    const [form, setForm] = useState({
        platform_fee: "60000",
        min_payout: "50000",
        hotline: "",
        support_email: "",
        privacy_email: ""
    });
    const [initialForm, setInitialForm] = useState({
        platform_fee: "60000",
        min_payout: "50000",
        hotline: "",
        support_email: "",
        privacy_email: ""
    });
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // ── 1. TẢI DỮ LIỆU CẤU HÌNH TỪ BACKEND ──
    const fetchSettings = async () => {
        try {
            setLoading(true);
            setFetchError(null);
            const res = await adminApi.getSystemSettings();
            const list = Array.isArray(res) ? res : (res?.data || []);
            setSettingsList(list);

            const map = {};
            list.forEach((item) => {
                if (item?.key) {
                    map[item.key] = item.value ?? "";
                }
            });

            const loadedForm = {
                platform_fee: map["platform_fee"] ?? "60000",
                min_payout: map["min_payout"] ?? "50000",
                hotline: map["hotline"] ?? "",
                support_email: map["support_email"] ?? "",
                privacy_email: map["privacy_email"] ?? ""
            };

            setForm(loadedForm);
            setInitialForm(loadedForm);
            setErrors({});
        } catch (err) {
            console.error("[CareLink] Lỗi tải cài đặt hệ thống:", err);
            setFetchError("Không thể tải cấu hình hệ thống từ máy chủ. Vui lòng thử lại sau ít phút.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // ── 2. XỬ LÝ TOAST THÔNG BÁO TỰ TẮT ──
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(timer);
    }, [toast]);

    // ── 3. TÍNH TOÁN DANH SÁCH THAY ĐỔI ──
    const formatVND = (val) => {
        const num = Number(val);
        if (isNaN(num)) return "0 đ";
        return `${num.toLocaleString("vi-VN")} đ`;
    };

    const changedItems = useMemo(() => {
        const items = [];
        const labels = {
            platform_fee: "Phí sàn CareLink",
            min_payout: "Hạn mức rút tiền tối thiểu",
            hotline: "Hotline hỗ trợ 24/7",
            support_email: "Email hỗ trợ khách hàng",
            privacy_email: "Email quyền riêng tư & bảo mật"
        };

        Object.keys(form).forEach((k) => {
            const oldVal = (initialForm[k] ?? "").trim();
            const newVal = (form[k] ?? "").trim();
            if (oldVal !== newVal) {
                const isMoney = k === "platform_fee" || k === "min_payout";
                items.push({
                    key: k,
                    label: labels[k] || k,
                    oldValue: oldVal,
                    newValue: newVal,
                    oldDisplay: isMoney ? formatVND(oldVal) : (oldVal || "(Trống)"),
                    newDisplay: isMoney ? formatVND(newVal) : (newVal || "(Trống)")
                });
            }
        });

        return items;
    }, [form, initialForm]);

    const hasChanges = changedItems.length > 0;

    // ── 4. VALIDATE TRƯỚC KHI MỞ MODAL LƯU ──
    const handlePreSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Phí sàn
        const feeNum = Number(form.platform_fee);
        if (isNaN(feeNum) || feeNum < 0) {
            newErrors.platform_fee = "Phí sàn phải là số tiền hợp lệ và không được nhỏ hơn 0 VNĐ.";
        }

        // Hạn mức rút
        const payoutNum = Number(form.min_payout);
        if (isNaN(payoutNum) || payoutNum < 1000) {
            newErrors.min_payout = "Hạn mức rút tiền tối thiểu phải từ 1.000 VNĐ trở lên.";
        }

        // Validate Email nếu có nhập
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.support_email.trim() && !emailRegex.test(form.support_email.trim())) {
            newErrors.support_email = "Địa chỉ email hỗ trợ không đúng định dạng.";
        }

        if (form.privacy_email.trim() && !emailRegex.test(form.privacy_email.trim())) {
            newErrors.privacy_email = "Địa chỉ email quyền riêng tư không đúng định dạng.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setToast({
                type: "error",
                message: "Vui lòng kiểm tra lại các trường dữ liệu có cảnh báo đỏ!"
            });
            return;
        }

        setErrors({});
        setShowModal(true);
    };

    // ── 5. THỰC THI LƯU CẤU HÌNH VÀO BACKEND ──
    const handleSaveConfirm = async () => {
        try {
            setIsSaving(true);
            const payload = {
                settings: {
                    platform_fee: String(form.platform_fee).trim(),
                    min_payout: String(form.min_payout).trim(),
                    hotline: String(form.hotline).trim(),
                    support_email: String(form.support_email).trim(),
                    privacy_email: String(form.privacy_email).trim()
                }
            };

            await adminApi.updateSystemSettings(payload);

            setShowModal(false);
            setToast({
                type: "success",
                message: "Cập nhật Cài đặt hệ thống thành công! Cấu hình mới đã có hiệu lực trên toàn sàn."
            });
            await fetchSettings();
        } catch (err) {
            console.error("[CareLink] Lỗi lưu cài đặt:", err);
            const msg = err?.response?.data?.detail || err?.response?.data?.title || "Không thể lưu cấu hình hệ thống. Vui lòng thử lại!";
            setToast({
                type: "error",
                message: msg
            });
            setShowModal(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setForm(initialForm);
        setErrors({});
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-800 pb-12">
            {/* ── HEADER BANNER ── */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#00677c] flex items-center justify-center shrink-0 shadow-2xs">
                        <DollarSign className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Cài đặt hệ thống
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Quản lý tham số tài chính, phí sàn và kênh thông tin liên hệ chính thức của sàn CareLink.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        type="button"
                        onClick={fetchSettings}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                        title="Tải lại dữ liệu mới nhất từ máy chủ"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        <span>Làm mới</span>
                    </button>
                </div>
            </div>

            {/* ── TOAST THÔNG BÁO ── */}
            {toast && (
                <div
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-200 ${
                        toast.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                >
                    <div className="flex items-center gap-2.5 text-xs font-medium">
                        {toast.type === "success" ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                        )}
                        <span>{toast.message}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        className="text-xs font-bold opacity-70 hover:opacity-100 cursor-pointer"
                    >
                        Đóng
                    </button>
                </div>
            )}

            {/* ── LỖI TẢI DỮ LIỆU ── */}
            {fetchError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{fetchError}</span>
                    </div>
                    <button
                        type="button"
                        onClick={fetchSettings}
                        className="px-3 py-1 rounded-lg bg-rose-200/60 hover:bg-rose-200 text-rose-900 font-bold transition-colors cursor-pointer"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* ── LOADING SKELETON ── */}
            {loading ? (
                <div className="space-y-6">
                    <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
                    <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
                </div>
            ) : (
                <form onSubmit={handlePreSubmit} className="space-y-6">
                    {/* ════ CARD 1: CẤU HÌNH TÀI CHÍNH & PHÍ SÀN ════ */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                        <div className="px-6 py-4.5 bg-gradient-to-r from-teal-50/70 via-slate-50 to-white border-b border-slate-200/70 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#00677c]/10 text-[#00677c] flex items-center justify-center shrink-0">
                                    <DollarSign className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                        Chính sách Tài chính &amp; Phí nền tảng
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        Quy định mức phí sàn thu trên mỗi ca trực và hạn mức rút tiền khả dụng
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Phí sàn CareLink */}
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <label htmlFor="platform_fee" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <span>Phí sàn CareLink</span>
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <span className="text-[11px] text-slate-500">
                                        Hiện hành: <strong className="text-teal-700 font-bold">{formatVND(initialForm.platform_fee)}</strong>
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        id="platform_fee"
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={form.platform_fee}
                                        onChange={(e) => setForm({ ...form, platform_fee: e.target.value })}
                                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                                            errors.platform_fee
                                                ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
                                                : "border-slate-200 focus:ring-teal-200 focus:border-[#00677c]"
                                        }`}
                                        placeholder="Ví dụ: 60000"
                                    />
                                    <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400 pointer-events-none">
                                        VNĐ / ca
                                    </span>
                                </div>
                                {errors.platform_fee && (
                                    <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        <span>{errors.platform_fee}</span>
                                    </p>
                                )}
                                <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 flex items-start gap-2.5 text-[11px] text-teal-800 leading-relaxed">
                                    <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                    <span>
                                        Mức phí này áp dụng cố định cho <strong>các ca chăm sóc mới</strong> được tạo sau khi lưu. Các ca trực trong lịch sử đã thanh toán vẫn giữ nguyên mức phí tại thời điểm tạo, không bị hồi tố.
                                    </span>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Hạn mức rút tiền tối thiểu */}
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <label htmlFor="min_payout" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <span>Hạn mức rút tiền tối thiểu của Điều dưỡng</span>
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <span className="text-[11px] text-slate-500">
                                        Hiện hành: <strong className="text-teal-700 font-bold">{formatVND(initialForm.min_payout)}</strong>
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        id="min_payout"
                                        type="number"
                                        min="1000"
                                        step="10000"
                                        value={form.min_payout}
                                        onChange={(e) => setForm({ ...form, min_payout: e.target.value })}
                                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                                            errors.min_payout
                                                ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
                                                : "border-slate-200 focus:ring-teal-200 focus:border-[#00677c]"
                                        }`}
                                        placeholder="Ví dụ: 50000"
                                    />
                                    <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400 pointer-events-none">
                                        VNĐ
                                    </span>
                                </div>
                                {errors.min_payout && (
                                    <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        <span>{errors.min_payout}</span>
                                    </p>
                                )}
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Điều dưỡng chỉ có thể gửi yêu cầu rút tiền về tài khoản ngân hàng khi số dư ví khả dụng đạt từ mức này trở lên.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ════ CARD 2: KÊNH THÔNG TIN LIÊN HỆ & HỖ TRỢ ════ */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                        <div className="px-6 py-4.5 bg-gradient-to-r from-teal-50/70 via-slate-50 to-white border-b border-slate-200/70 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                                    <Phone className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                        Thông tin Nền tảng &amp; Kênh Hỗ trợ
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        Đồng bộ hotline và hòm thư chính thức hiển thị tại chân trang và trung tâm trợ giúp
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Hotline hỗ trợ */}
                            <div className="space-y-1.5">
                                <label htmlFor="hotline" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Hotline hỗ trợ tổng đài</span>
                                </label>
                                <input
                                    id="hotline"
                                    type="text"
                                    value={form.hotline}
                                    onChange={(e) => setForm({ ...form, hotline: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-[#00677c] transition-all"
                                    placeholder="Để trống nếu đang cập nhật (Ví dụ: 1900 1234)"
                                />
                                <p className="text-[11px] text-slate-400">
                                    Hiển thị tại Header, Footer và nút gọi SOS khẩn cấp trong tin nhắn. Nếu để trống, giao diện sẽ hiển thị trạng thái "Đang cập nhật".
                                </p>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Email hỗ trợ khách hàng */}
                            <div className="space-y-1.5">
                                <label htmlFor="support_email" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Email hỗ trợ khách hàng</span>
                                </label>
                                <input
                                    id="support_email"
                                    type="email"
                                    value={form.support_email}
                                    onChange={(e) => setForm({ ...form, support_email: e.target.value })}
                                    className={`w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                                        errors.support_email
                                            ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
                                            : "border-slate-200 focus:ring-teal-200 focus:border-[#00677c]"
                                    }`}
                                    placeholder="Để trống nếu đang cập nhật (Ví dụ: hotro@carelink.vn)"
                                />
                                {errors.support_email && (
                                    <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        <span>{errors.support_email}</span>
                                    </p>
                                )}
                                <p className="text-[11px] text-slate-400">
                                    Hòm thư chính thức tiếp nhận giải quyết sự cố và phản hồi dịch vụ từ khách hàng.
                                </p>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Email quyền riêng tư */}
                            <div className="space-y-1.5">
                                <label htmlFor="privacy_email" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Email quyền riêng tư &amp; Bảo mật thông tin</span>
                                </label>
                                <input
                                    id="privacy_email"
                                    type="email"
                                    value={form.privacy_email}
                                    onChange={(e) => setForm({ ...form, privacy_email: e.target.value })}
                                    className={`w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                                        errors.privacy_email
                                            ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
                                            : "border-slate-200 focus:ring-teal-200 focus:border-[#00677c]"
                                    }`}
                                    placeholder="Để trống nếu đang cập nhật (Ví dụ: privacy@carelink.vn)"
                                />
                                {errors.privacy_email && (
                                    <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        <span>{errors.privacy_email}</span>
                                    </p>
                                )}
                                <p className="text-[11px] text-slate-400">
                                    Hiển thị tại trang Chính sách bảo mật dữ liệu phục vụ khiếu nại thông tin cá nhân.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ════ CARD 3: CHÍNH SÁCH VẬN HÀNH THAM CHIẾU ════ */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Quy định Vận hành Y khoa Hiện hành (Tham chiếu)
                                </h3>
                            </div>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                Quy tắc chuẩn sàn
                            </span>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#00677c]" />
                                    Thời hạn giữ chỗ &amp; phản hồi
                                </span>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Mặc định <strong>30 phút</strong>. Hết hạn nếu chưa thanh toán hoặc điều dưỡng không nhận, hệ thống tự động giải phóng lịch để bảo đảm quyền lợi đôi bên.
                                </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#00677c]" />
                                    Khóa đệm di chuyển 60 phút
                                </span>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Hệ thống tự động khóa <strong>60 phút</strong> trước và sau mỗi ca giữa các khách hàng khác nhau để điều dưỡng di chuyển và chuẩn bị vô trùng.
                                </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#00677c]" />
                                    Chính sách hoàn tiền hủy ca
                                </span>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Hủy trước $\ge$ 24 giờ hoàn <strong>100%</strong>; hủy trong 2h – 24h hoàn <strong>50%</strong>; hủy dưới 2 giờ không hoàn tiền (mất cọc bồi thường).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ════ BOTTOM BAR: HÀNH ĐỘNG ════ */}
                    <div className="sticky bottom-4 z-20 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs">
                            {hasChanges ? (
                                <span className="inline-flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Đang có {changedItems.length} thay đổi chưa lưu
                                </span>
                            ) : (
                                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    Cấu hình đang đồng bộ với máy chủ
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={!hasChanges || isSaving}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Hoàn tác</span>
                            </button>
                            <button
                                type="submit"
                                disabled={!hasChanges || isSaving}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00677c] to-[#005566] hover:from-[#005566] hover:to-[#00424f] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                            >
                                <Save className="w-4 h-4" />
                                <span>Lưu thay đổi</span>
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* ── MODAL XÁC NHẬN TRƯỚC KHI LƯU ── */}
            <ConfirmSettingModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleSaveConfirm}
                changedItems={changedItems}
                isSaving={isSaving}
            />
        </div>
    );
}
