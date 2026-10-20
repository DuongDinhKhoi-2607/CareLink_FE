import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Trash2, LogOut, X, Loader2, Camera, ShieldCheck, Mail, Phone, User } from "lucide-react";
import familyApi from "../../../api/familyApi";
import authApi, { normalizeUserProfile } from "../../../api/authApi";

const getAddressLabelBadge = (label) => {
    switch (label) {
        case "Nhà riêng":
            return {
                badge: "bg-sky-50 text-sky-700 border-sky-200/90",
                icon: "🏠",
                dot: "bg-sky-500",
            };
        case "Nhà bố mẹ":
            return {
                badge: "bg-purple-50 text-purple-700 border-purple-200/90",
                icon: "🏡",
                dot: "bg-purple-500",
            };
        case "Cơ quan":
            return {
                badge: "bg-amber-50 text-amber-700 border-amber-200/90",
                icon: "🏢",
                dot: "bg-amber-500",
            };
        case "Nhà người thân":
            return {
                badge: "bg-teal-50 text-teal-700 border-teal-200/90",
                icon: "📍",
                dot: "bg-teal-500",
            };
        default:
            return {
                badge: "bg-slate-100 text-[#002045] border-slate-200",
                icon: "📍",
                dot: "bg-slate-500",
            };
    }
};

const getStoredUser = () => {
    try {
        const raw = localStorage.getItem("carelink_user");
        if (raw) {
            const u = JSON.parse(raw);
            return {
                id: u.id || null,
                name: u.fullName || u.name || "",
                email: u.email || "",
                phone: u.phoneNumber || u.phone || "",
                role: u.role === "family" || u.role === "customer"
                    ? "Tài khoản Gia đình (Customer)"
                    : (u.role || "Tài khoản Gia đình"),
                avatar: u.avatar || u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
            };
        }
    } catch {}
    return {
        id: null,
        name: "",
        email: "",
        phone: "",
        role: "Tài khoản Gia đình",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    };
};

export default function FamilyProfile() {
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState("");
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [isLogoutAllOpen, setIsLogoutAllOpen] = useState(false);

    // Section 1: Thông tin cá nhân (Đồng bộ API 96 GET /api/v1/users/me & API 97 PUT /api/v1/users/me)
    const [personalInfo, setPersonalInfo] = useState(getStoredUser);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [personalDraft, setPersonalDraft] = useState(getStoredUser);
    const [personalLoading, setPersonalLoading] = useState(true);
    const [personalSubmitting, setPersonalSubmitting] = useState(false);

    // Section 2: Liên hệ khẩn cấp
    const [emergencyContact, setEmergencyContact] = useState({
        name: "Nguyễn Văn An",
        relation: "Con trai",
        phone: "0909 123 456",
        secondaryPhone: "0912 345 678",
    });
    const [emergencyDraft, setEmergencyDraft] = useState({ ...emergencyContact });
    const [isEditingEmergency, setIsEditingEmergency] = useState(false);

    // Section 3: Sổ địa chỉ chăm sóc (Address Book) — API-driven
    const [addressList, setAddressList] = useState([]);
    const [addressLoading, setAddressLoading] = useState(true);
    const [addressSubmitting, setAddressSubmitting] = useState(false);
    const [addressDeleting, setAddressDeleting] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        label: "Nhà riêng",
        city: "TP. Hồ Chí Minh",
        district: "Quận Bình Thạnh",
        ward: "",
        streetAddress: "",
        noteForCaregiver: "",
        isDefault: false,
    });

    // ── Helper map Backend → FE ───────────────────────────────────────────────────────
    const mapAddress = (a) => ({
        id: a.id,
        label: a.label || a.title || a.addressLabel || "Khác",
        isDefault: a.isDefault ?? a.isMain ?? false,
        city: a.city || a.province || "",
        district: a.district || "",
        ward: a.ward || "",
        streetAddress: a.streetAddress || a.street || a.addressLine || "",
        noteForCaregiver: a.noteForCaregiver || a.notes || a.note || "",
        latitude: a.latitude,
        longitude: a.longitude,
    });

    // ── Build payload BE ────────────────────────────────────────────────────────────
    const buildAddressPayload = () => ({
        label: addressForm.label,
        city: addressForm.city,
        district: addressForm.district,
        ward: addressForm.ward,
        streetAddress: addressForm.streetAddress.trim(),
        noteForCaregiver: addressForm.noteForCaregiver.trim(),
        isDefault: addressForm.isDefault,
    });

    // Section 4: Modal đổi mật khẩu
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });

    // Thông báo lưu thành công
    const [saveAlert, setSaveAlert] = useState("");

    const showSuccessToast = (msg) => {
        setSaveAlert(msg);
        setTimeout(() => setSaveAlert(""), 3000);
    };

    // ── 96. GET /api/v1/users/me — Lấy thông tin tài khoản hiện tại ────────────────────
    const fetchUserProfile = useCallback(async () => {
        setPersonalLoading(true);
        try {
            const res = await authApi.getMe();
            const rawData = res?.data || res?.user || res;
            if (rawData && typeof rawData === "object") {
                const norm = normalizeUserProfile(rawData);
                const fresh = {
                    id: norm.id || personalInfo.id,
                    name: norm.name || personalInfo.name,
                    email: norm.email || personalInfo.email,
                    phone: norm.phone || personalInfo.phone,
                    role: "Tài khoản Gia đình (Customer)",
                    avatar: norm.avatar || personalInfo.avatar,
                };
                setPersonalInfo(fresh);
                setPersonalDraft(fresh);

                // Đồng bộ với localStorage để Header/Sidebar không bị lệch
                try {
                    const saved = JSON.parse(localStorage.getItem("carelink_user") || "{}");
                    localStorage.setItem(
                        "carelink_user",
                        JSON.stringify({
                            ...saved,
                            ...norm,
                            role: "family",
                        })
                    );
                    window.dispatchEvent(new Event("storage"));
                } catch {
                    // ignore
                }
            }
        } catch (err) {
            console.warn("Lỗi tải thông tin cá nhân từ /api/v1/users/me:", err);
            // Giữ nguyên thông tin đã nạp từ localStorage, không ghi đè dữ liệu mẫu
        } finally {
            setPersonalLoading(false);
        }
    }, [personalInfo.id, personalInfo.name, personalInfo.email, personalInfo.phone, personalInfo.avatar]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    // ── 97. PUT /api/v1/users/me — Cập nhật thông tin tài khoản hiện tại ───────────────
    const handleSavePersonal = async (e) => {
        e.preventDefault();
        setPersonalSubmitting(true);
        try {
            const payload = {
                fullName: personalDraft.name.trim(),
                phone: personalDraft.phone.trim(),
                avatarUrl: personalDraft.avatar?.startsWith("http") ? personalDraft.avatar.trim() : null,
            };

            const res = await authApi.updateMe(payload);
            const rawData = res?.data || res?.user || res;
            const norm = normalizeUserProfile(rawData);

            const updated = {
                ...personalDraft,
                name: norm.name || personalDraft.name.trim(),
                phone: norm.phone || personalDraft.phone.trim(),
                avatar: norm.avatar || personalDraft.avatar,
            };

            setPersonalInfo(updated);
            setPersonalDraft(updated);
            setIsEditingPersonal(false);

            // Cập nhật localStorage & thông báo tới Header / Sidebar
            try {
                const saved = JSON.parse(localStorage.getItem("carelink_user") || "{}");
                localStorage.setItem(
                    "carelink_user",
                    JSON.stringify({
                        ...saved,
                        name: updated.name,
                        fullName: updated.name,
                        phone: updated.phone,
                        phoneNumber: updated.phone,
                        avatar: updated.avatar,
                        avatarUrl: updated.avatar,
                    })
                );
                window.dispatchEvent(new Event("storage"));
            } catch {
                // ignore
            }

            showSuccessToast("Đã cập nhật thông tin tài khoản thành công!");
        } catch (err) {
            console.warn("Lỗi gọi PUT /api/v1/users/me:", err);
            const msg = err?.response?.data?.message || err?.response?.data?.title;

            // Xử lý an toàn khi mất kết nối backend hoặc offline demo
            if (err.code === "ERR_NETWORK" || !err.response) {
                const updated = { ...personalDraft };
                setPersonalInfo(updated);
                setIsEditingPersonal(false);
                try {
                    const saved = JSON.parse(localStorage.getItem("carelink_user") || "{}");
                    localStorage.setItem(
                        "carelink_user",
                        JSON.stringify({
                            ...saved,
                            name: updated.name,
                            fullName: updated.name,
                            phone: updated.phone,
                            phoneNumber: updated.phone,
                            avatar: updated.avatar,
                            avatarUrl: updated.avatar,
                        })
                    );
                    window.dispatchEvent(new Event("storage"));
                } catch {}
                showSuccessToast("Đã lưu thông tin tài khoản vào phiên làm việc!");
            } else {
                showSuccessToast(`⚠️ ${msg || "Cập nhật thông tin thất bại. Vui lòng thử lại!"}`);
            }
        } finally {
            setPersonalSubmitting(false);
        }
    };

    const handleSaveEmergency = (e) => {
        e.preventDefault();
        setEmergencyContact({ ...emergencyDraft });
        setIsEditingEmergency(false);
        showSuccessToast("Đã lưu thông tin liên hệ khẩn cấp mới!");
    };

    // ── 49. GET /api/v1/addresses ─────────────────────────────────────────────────────
    const fetchAddresses = useCallback(async () => {
        setAddressLoading(true);
        try {
            const res = await familyApi.getAddresses();
            const list = Array.isArray(res)
                ? res
                : Array.isArray(res?.data) ? res.data
                : Array.isArray(res?.items) ? res.items
                : [];
            setAddressList(list.map(mapAddress));
        } catch (err) {
            console.error("Lỗi tải sổ địa chỉ:", err);
            showSuccessToast("⚠️ Không thể tải sổ địa chỉ. Vui lòng thử lại.");
        } finally {
            setAddressLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

    const handleOpenAddAddress = () => {
        setEditingAddressId(null);
        setAddressForm({
            label: "Nhà riêng",
            city: "TP. Hồ Chí Minh",
            district: "Quận Bình Thạnh",
            ward: "",
            streetAddress: "",
            noteForCaregiver: "",
            isDefault: addressList.length === 0,
        });
        setIsAddressModalOpen(true);
    };

    // ── 51. GET /api/v1/addresses/{id} ───────────────────────────────────────────
    const handleOpenEditAddress = async (addr) => {
        setEditingAddressId(addr.id);
        setAddressForm({
            label: addr.label,
            city: addr.city,
            district: addr.district,
            ward: addr.ward,
            streetAddress: addr.streetAddress,
            noteForCaregiver: addr.noteForCaregiver || "",
            isDefault: addr.isDefault,
        });
        setIsAddressModalOpen(true);
        try {
            const res = await familyApi.getAddressDetail(addr.id);
            const d = res?.data || res || addr;
            setAddressForm({
                label: d.label || d.title || addr.label,
                city: d.city || addr.city,
                district: d.district || addr.district,
                ward: d.ward || addr.ward || "",
                streetAddress: d.streetAddress || d.street || addr.streetAddress,
                noteForCaregiver: d.noteForCaregiver || d.notes || addr.noteForCaregiver || "",
                isDefault: d.isDefault ?? addr.isDefault,
            });
        } catch (err) {
            console.warn("Không thể tải chi tiết địa chỉ từ API 51, dùng dữ liệu danh sách:", err);
        }
    };

    // ── 50. POST + 52. PUT /api/v1/addresses ───────────────────────────────────────
    const handleSaveAddressForm = async (e) => {
        e.preventDefault();
        if (!addressForm.streetAddress.trim()) {
            showSuccessToast("⚠️ Vui lòng nhập địa chỉ cụ thể!");
            return;
        }
        setAddressSubmitting(true);
        try {
            const payload = buildAddressPayload();
            if (editingAddressId) {
                // 52. PUT /api/v1/addresses/{id}
                await familyApi.updateAddress(editingAddressId, payload);
                showSuccessToast("Đã cập nhật địa chỉ chăm sóc thành công!");
            } else {
                // 50. POST /api/v1/addresses
                await familyApi.createAddress(payload);
                showSuccessToast("Đã thêm địa chỉ mới vào sổ địa chỉ!");
            }
            setIsAddressModalOpen(false);
            await fetchAddresses();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data?.title ||
                (editingAddressId ? "Cập nhật thất bại. Vui lòng thử lại." : "Thêm địa chỉ thất bại. Vui lòng thử lại.");
            showSuccessToast(`⚠️ ${msg}`);
        } finally {
            setAddressSubmitting(false);
        }
    };

    const handleDeleteAddress = (id) => {
        const target = addressList.find((a) => a.id === id);
        if (!target) return;
        if (target.isDefault && addressList.length > 1) {
            showSuccessToast("Đây là địa chỉ mặc định. Vui lòng chọn địa chỉ khác làm mặc định trước khi xóa!");
            return;
        }
        setAddressToDelete(target);
    };

    // ── 53. DELETE /api/v1/addresses/{id} ─────────────────────────────────────────
    const confirmDeleteAddress = async () => {
        if (!addressToDelete) return;
        setAddressDeleting(true);
        try {
            await familyApi.deleteAddress(addressToDelete.id);
            showSuccessToast(`Đã xóa địa chỉ "${addressToDelete.label}"!`);
            setAddressToDelete(null);
            await fetchAddresses();
        } catch (err) {
            const msg = err?.response?.data?.message || "Xóa địa chỉ thất bại. Vui lòng thử lại.";
            showSuccessToast(`⚠️ ${msg}`);
        } finally {
            setAddressDeleting(false);
        }
    };

    // ── Đặt mặc định — gọi PUT để flip isDefault ────────────────────────────────────
    const handleSetDefaultAddress = async (id) => {
        const target = addressList.find((a) => a.id === id);
        if (!target) return;
        try {
            await familyApi.updateAddress(id, { ...target, isDefault: true });
            showSuccessToast("Đã đặt làm địa chỉ chăm sóc mặc định!");
            await fetchAddresses();
        } catch {
            // Fallback optimistic update
            setAddressList((prev) =>
                prev.map((item) => ({ ...item, isDefault: item.id === id }))
            );
            showSuccessToast("Đã đặt làm địa chỉ mặc định (có thể chưa đồng bộ server)!");
        }
    };

    const handleSavePassword = (e) => {
        e.preventDefault();
        setPasswordError("");
        if (passwordForm.newPass.length < 8) {
            setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự!");
            return;
        }
        if (passwordForm.newPass !== passwordForm.confirm) {
            setPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
        setIsPasswordModalOpen(false);
        setPasswordForm({ current: "", newPass: "", confirm: "" });
        setPasswordError("");
        showSuccessToast("Đã đổi mật khẩu tài khoản thành công!");
    };

    const handleLogoutAllDevices = () => {
        setIsLogoutAllOpen(true);
    };

    const confirmLogoutAll = () => {
        localStorage.removeItem("carelink_user");
        setIsLogoutAllOpen(false);
        navigate("/login");
    };

    return (
        <div className="p-6 sm:p-10 flex flex-col gap-8 max-w-5xl mx-auto">
            {/* Header trang */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200/60">
                            Cấu hình tài khoản
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#002045] mt-1.5 tracking-tight">
                        Cài đặt
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">
                        Quản lý thông tin tài khoản và thông tin liên hệ của gia đình.
                    </p>
                </div>
            </header>

            {/* Thông báo Toast nếu có */}
            {saveAlert && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-page-enter">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{saveAlert}</span>
                    </div>
                    <button type="button" onClick={() => setSaveAlert("")} className="text-emerald-500 hover:text-emerald-700 text-sm">
                        ✕
                    </button>
                </div>
            )}

            {/* SECTION 1: THÔNG TIN CÁ NHÂN (API 96 GET /api/v1/users/me & API 97 PUT /api/v1/users/me) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-[#002045]">Thông tin cá nhân</h3>
                                {personalLoading && (
                                    <span className="flex items-center gap-1 text-[11px] text-teal-600 font-medium">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Đang đồng bộ...
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">Thông tin tài khoản đang đăng nhập trên hệ thống CareLink</p>
                        </div>
                    </div>

                    {!isEditingPersonal && (
                        <button
                            type="button"
                            onClick={() => {
                                setPersonalDraft({ ...personalInfo });
                                setIsEditingPersonal(true);
                            }}
                            className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                            Chỉnh sửa
                        </button>
                    )}
                </div>

                {isEditingPersonal ? (
                    <form onSubmit={handleSavePersonal} className="space-y-5 text-xs">
                        {/* Ảnh đại diện & URL */}
                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                            <div className="flex items-center gap-2 font-semibold text-slate-700">
                                <Camera className="w-4 h-4 text-teal-600" />
                                <span>Ảnh đại diện (Avatar)</span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative shrink-0">
                                    <img
                                        src={personalDraft.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                                        alt="Avatar Preview"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
                                        }}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-teal-500 shadow-sm"
                                    />
                                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-teal-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
                                        ✓
                                    </span>
                                </div>

                                <div className="flex-1 w-full space-y-2">
                                    <div>
                                        <label className="block text-slate-600 font-medium mb-1">
                                            Đường dẫn ảnh đại diện (URL)
                                        </label>
                                        <input
                                            type="url"
                                            value={personalDraft.avatar}
                                            onChange={(e) => setPersonalDraft({ ...personalDraft, avatar: e.target.value })}
                                            placeholder="https://... ảnh avatar"
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs"
                                        />
                                    </div>

                                    {/* Mẫu ảnh đại diện nhanh */}
                                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                                        <span className="text-[11px] text-slate-400">Chọn nhanh avatar:</span>
                                        {[
                                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
                                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
                                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
                                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
                                        ].map((imgUrl, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setPersonalDraft({ ...personalDraft, avatar: imgUrl })}
                                                className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 cursor-pointer ${
                                                    personalDraft.avatar === imgUrl ? "border-teal-600 ring-2 ring-teal-200" : "border-slate-300"
                                                }`}
                                            >
                                                <img src={imgUrl} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin Họ tên, Email, SĐT, Vai trò */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">
                                    Họ và tên <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={personalDraft.name}
                                    onChange={(e) => setPersonalDraft({ ...personalDraft, name: e.target.value })}
                                    placeholder="Nhập họ và tên..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">
                                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={personalDraft.phone}
                                    onChange={(e) => setPersonalDraft({ ...personalDraft, phone: e.target.value })}
                                    placeholder="Ví dụ: 0901234567"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-slate-700 font-semibold">Email tài khoản</label>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Không thể thay đổi
                                    </span>
                                </div>
                                <input
                                    type="email"
                                    disabled
                                    value={personalDraft.email}
                                    className="w-full px-3 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Vai trò tài khoản</label>
                                <input
                                    type="text"
                                    disabled
                                    value={personalDraft.role}
                                    className="w-full px-3 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                disabled={personalSubmitting}
                                onClick={() => {
                                    setPersonalDraft({ ...personalInfo });
                                    setIsEditingPersonal(false);
                                }}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={personalSubmitting}
                                className="px-5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                                {personalSubmitting ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Đang cập nhật...</span>
                                    </>
                                ) : (
                                    <span>Lưu thay đổi</span>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-teal-50/20 rounded-2xl border border-slate-100">
                        {/* Avatar xem */}
                        <div className="relative shrink-0">
                            <img
                                src={personalInfo.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                                alt={personalInfo.name}
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
                                }}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-teal-500/30"
                            />
                            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Trực tuyến" />
                        </div>

                        {/* Thông tin chính */}
                        <div className="flex-1 w-full space-y-3 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h4 className="text-lg font-bold text-[#002045]">
                                        {personalInfo.name || "Chưa cập nhật tên"}
                                    </h4>
                                    <p className="text-xs text-slate-500">{personalInfo.role}</p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 self-center sm:self-auto px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Tài khoản đã xác thực
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                                <div className="p-3 bg-white rounded-xl border border-slate-200/70 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email</span>
                                        <strong className="text-slate-700 truncate block">{personalInfo.email || "—"}</strong>
                                    </div>
                                </div>

                                <div className="p-3 bg-white rounded-xl border border-slate-200/70 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Số điện thoại</span>
                                        <strong className="text-teal-700 truncate block">{personalInfo.phone || "Chưa cập nhật"}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 2: THÔNG TIN LIÊN HỆ KHẨN CẤP */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#002045]">Liên hệ khẩn cấp</h3>
                            <p className="text-xs text-slate-500">
                                Điều dưỡng sẽ gọi số này khi phát sinh tình huống bất thường trong quá trình chăm sóc.
                            </p>
                        </div>
                    </div>

                    {!isEditingEmergency && (
                        <button
                            type="button"
                            onClick={() => {
                                setEmergencyDraft({ ...emergencyContact });
                                setIsEditingEmergency(true);
                            }}
                            className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>

                {isEditingEmergency ? (
                    <form onSubmit={handleSaveEmergency} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Tên người liên hệ</label>
                                <input
                                    type="text"
                                    required
                                    value={emergencyDraft.name}
                                    onChange={(e) => setEmergencyDraft({ ...emergencyDraft, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Mối quan hệ</label>
                                <input
                                    type="text"
                                    required
                                    value={emergencyDraft.relation}
                                    onChange={(e) => setEmergencyDraft({ ...emergencyDraft, relation: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Số điện thoại khẩn cấp *</label>
                                <input
                                    type="text"
                                    required
                                    value={emergencyDraft.phone}
                                    onChange={(e) => setEmergencyDraft({ ...emergencyDraft, phone: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsEditingEmergency(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-100">
                            <span className="text-slate-400 block text-[11px]">Tên người liên hệ:</span>
                            <strong className="text-sm text-[#002045]">{emergencyContact.name}</strong>
                        </div>
                        <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-100">
                            <span className="text-slate-400 block text-[11px]">Mối quan hệ:</span>
                            <strong className="text-sm text-slate-700">{emergencyContact.relation}</strong>
                        </div>
                        <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-100">
                            <span className="text-slate-400 block text-[11px]">Số điện thoại khẩn cấp:</span>
                            <strong className="text-sm text-rose-600">{emergencyContact.phone}</strong>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 3: SỔ ĐỊA CHỈ CHĂM SÓC (ADDRESS BOOK) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-[#002045]">Sổ địa chỉ chăm sóc</h3>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                                    {addressLoading ? "..." : `${addressList.length} địa chỉ`}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">Quản lý các địa điểm để điều dưỡng tới chăm sóc người thân</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenAddAddress}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Thêm địa chỉ mới
                    </button>
                </div>

                {/* Danh sách thẻ địa chỉ */}
                {addressLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse p-4 rounded-2xl border border-slate-200 bg-white flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="h-6 w-24 bg-slate-200 rounded-lg" />
                                    <div className="flex gap-1">
                                        <div className="h-7 w-7 bg-slate-200 rounded-lg" />
                                        <div className="h-7 w-7 bg-slate-200 rounded-lg" />
                                    </div>
                                </div>
                                <div className="h-4 bg-slate-200 rounded w-4/5" />
                                <div className="h-3 bg-slate-200 rounded w-3/5" />
                                <div className="h-10 bg-slate-100 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : addressList.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">Chưa có địa chỉ nào trong sổ</p>
                        <p className="text-xs text-slate-400 mt-0.5">Bấm nút "Thêm địa chỉ mới" để lưu địa chỉ đầu tiên của bạn</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addressList.map((addr) => (
                            <div
                                key={addr.id}
                                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                    addr.isDefault
                                        ? "bg-teal-50/20 border-teal-200/80 shadow-2xs"
                                        : "bg-white border-slate-200/80 hover:border-slate-300"
                                }`}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const badgeStyle = getAddressLabelBadge(addr.label);
                                                return (
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold border shadow-2xs ${badgeStyle.badge}`}>
                                                        <span>{badgeStyle.icon}</span>
                                                        <span>{addr.label}</span>
                                                    </span>
                                                );
                                            })()}
                                            {addr.isDefault && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-100/70 text-teal-800 text-[10px] font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                                                    MẶC ĐỊNH
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditAddress(addr)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition-colors"
                                                title="Chỉnh sửa địa chỉ"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                title="Xóa địa chỉ"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#002045] leading-snug">
                                            {addr.streetAddress}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {addr.ward ? `${addr.ward}, ` : ""}{addr.district}, {addr.city}
                                        </p>
                                    </div>

                                    {addr.noteForCaregiver && (
                                        <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 border border-slate-100 flex items-start gap-1.5">
                                            <span className="text-slate-400 font-semibold shrink-0">Lưu ý:</span>
                                            <span className="italic">{addr.noteForCaregiver}</span>
                                        </div>
                                    )}
                                </div>

                                {!addr.isDefault && (
                                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleSetDefaultAddress(addr.id)}
                                            className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer"
                                        >
                                            Đặt làm mặc định
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL THÊM / CHỈNH SỬA ĐỊA CHỈ */}
            {isAddressModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-lg p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-[#002045]">
                                    {editingAddressId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                                </h3>
                                <p className="text-xs text-slate-500">Lưu thông tin vị trí để gọi điều dưỡng tới chăm sóc</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddressModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveAddressForm} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Tên nhãn địa chỉ *</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {["Nhà riêng", "Nhà bố mẹ", "Nhà người thân", "Cơ quan"].map((preset) => {
                                        const badgeStyle = getAddressLabelBadge(preset);
                                        return (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => setAddressForm({ ...addressForm, label: preset })}
                                                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                                    addressForm.label === preset
                                                        ? `${badgeStyle.badge} ring-2 ring-teal-500/20 shadow-2xs`
                                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                                }`}
                                            >
                                                <span>{badgeStyle.icon}</span>
                                                <span>{preset}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.label}
                                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                    placeholder="Hoặc tự đặt tên: Ví dụ: Căn hộ Landmark 81"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-slate-700 font-semibold mb-1">Tỉnh / Thành phố *</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-semibold mb-1">Quận / Huyện *</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.district}
                                        onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-semibold mb-1">Phường / Xã</label>
                                    <input
                                        type="text"
                                        value={addressForm.ward}
                                        onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })}
                                        placeholder="Ví dụ: Phường 25"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Địa chỉ cụ thể (Số nhà, Tên đường, Căn hộ) *</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.streetAddress}
                                    onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                                    placeholder="Ví dụ: 123 Đường Nguyễn Gia Trí, Căn hộ A12-05"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Ghi chú hướng dẫn cho điều dưỡng</label>
                                <textarea
                                    rows={2}
                                    value={addressForm.noteForCaregiver}
                                    onChange={(e) => setAddressForm({ ...addressForm, noteForCaregiver: e.target.value })}
                                    placeholder="Ví dụ: Bấm chuông tầng 12, hầm gửi xe máy ở cổng B1..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={addressForm.isDefault}
                                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                                />
                                <span className="text-slate-700 font-medium">Đặt làm địa chỉ chăm sóc mặc định</span>
                            </label>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(false)}
                                    disabled={addressSubmitting}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={addressSubmitting}
                                    className="px-5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:opacity-60 inline-flex items-center gap-2"
                                >
                                    {addressSubmitting && (
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                    )}
                                    {addressSubmitting ? "Đang lưu..." : editingAddressId ? "Lưu thay đổi" : "Lưu địa chỉ mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* SECTION 4: BẢO MẬT TÀI KHOẢN */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100/90 text-indigo-600 flex items-center justify-center shadow-xs shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#002045]">Bảo mật tài khoản</h3>
                            <p className="text-xs text-slate-500">Mật khẩu và thiết bị đăng nhập</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                    {/* Đổi mật khẩu */}
                    <div className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-[#002045] text-sm">Đổi mật khẩu</h4>
                            <p className="text-slate-500">Nên sử dụng mật khẩu mạnh có ít nhất 8 ký tự.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors cursor-pointer shadow-2xs shrink-0"
                        >
                            Thay đổi
                        </button>
                    </div>

                    {/* Thiết bị đăng nhập */}
                    <div className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-[#002045] text-sm">Thiết bị đang đăng nhập</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-slate-600">Trình duyệt Chrome trên Windows 11 (Thiết bị hiện tại)</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => showSuccessToast("Hiện tại tài khoản chỉ đang hoạt động trên thiết bị này.")}
                            className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors cursor-pointer shadow-2xs shrink-0"
                        >
                            Quản lý
                        </button>
                    </div>

                    {/* Đăng xuất khỏi tất cả thiết bị */}
                    <div className="pt-3.5 flex items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-red-600 text-sm">Đăng xuất khỏi tất cả thiết bị</h4>
                            <p className="text-slate-500">Thu hồi phiên truy cập trên tất cả trình duyệt và điện thoại khác.</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogoutAllDevices}
                            className="px-4 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition-colors cursor-pointer shadow-2xs shrink-0"
                        >
                            Đăng xuất tất cả
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Đổi mật khẩu */}
            {isPasswordModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-hidden">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-base font-bold text-[#002045]">Đổi mật khẩu tài khoản</h3>
                            <button
                                type="button"
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSavePassword} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Nhập mật khẩu hiện tại"
                                    value={passwordForm.current}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Tối thiểu 8 ký tự"
                                    value={passwordForm.newPass}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={passwordForm.confirm}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>

                            {passwordError && (
                                <p className="text-xs text-red-500 font-medium">{passwordError}</p>
                            )}

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPasswordModalOpen(false);
                                        setPasswordError("");
                                    }}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs shadow-xs"
                                >
                                    Cập nhật mật khẩu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* In-app Modal: Xác nhận xóa địa chỉ */}
            {addressToDelete && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-base font-bold text-slate-900">Xóa địa chỉ chăm sóc?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Bạn có chắc chắn muốn xóa địa chỉ <span className="font-semibold text-slate-700">"{addressToDelete.label}"</span> khỏi sổ địa chỉ? Thao tác này không thể khôi phục.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setAddressToDelete(null)}
                                disabled={addressDeleting}
                                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors disabled:opacity-50"
                            >
                                Giữ lại
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteAddress}
                                disabled={addressDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs disabled:opacity-60 inline-flex items-center justify-center gap-2"
                            >
                                {addressDeleting && (
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                )}
                                {addressDeleting ? "Đang xóa..." : "Xóa địa chỉ"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* In-app Modal: Xác nhận đăng xuất tất cả thiết bị */}
            {isLogoutAllOpen && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                            <LogOut className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-base font-bold text-slate-900">Đăng xuất khỏi tất cả thiết bị?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Bạn sẽ bị đăng xuất khỏi tất cả phiên trình duyệt hiện tại và cần đăng nhập lại bằng thông tin tài khoản.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsLogoutAllOpen(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={confirmLogoutAll}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                            >
                                Xác nhận đăng xuất
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
