import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FamilyProfile() {
    const navigate = useNavigate();

    // Section 1: Thông tin cá nhân
    const [personalInfo, setPersonalInfo] = useState({
        name: "Nguyễn Gia Đình",
        email: "nguyengiadinh@example.com",
        phone: "0901 234 567",
        role: "Chủ hộ gia đình (Tài khoản Premium)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    });
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [personalDraft, setPersonalDraft] = useState({ ...personalInfo });

    // Section 2: Liên hệ khẩn cấp
    const [emergencyContact, setEmergencyContact] = useState({
        name: "Nguyễn Văn An",
        relation: "Con trai",
        phone: "0909 123 456",
        secondaryPhone: "0912 345 678",
    });
    const [isEditingEmergency, setIsEditingEmergency] = useState(false);
    const [emergencyDraft, setEmergencyDraft] = useState({ ...emergencyContact });

    // Section 3: Địa chỉ chăm sóc
    const [addressInfo, setAddressInfo] = useState({
        city: "TP. Hồ Chí Minh",
        district: "Quận Bình Thạnh",
        ward: "Phường 25",
        streetAddress: "123 Đường Nguyễn Gia Trí, Căn hộ A12-05",
        noteForCaregiver: "Căn hộ ở tầng 12, bấm chuông 1205. Bảo vệ hướng dẫn gửi xe máy ở cổng hầm B1.",
    });
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressDraft, setAddressDraft] = useState({ ...addressInfo });

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

    const handleSavePersonal = (e) => {
        e.preventDefault();
        setPersonalInfo({ ...personalDraft });
        setIsEditingPersonal(false);
        showSuccessToast("Đã cập nhật thông tin cá nhân thành công!");
    };

    const handleSaveEmergency = (e) => {
        e.preventDefault();
        setEmergencyContact({ ...emergencyDraft });
        setIsEditingEmergency(false);
        showSuccessToast("Đã lưu thông tin liên hệ khẩn cấp mới!");
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        setAddressInfo({ ...addressDraft });
        setIsEditingAddress(false);
        showSuccessToast("Đã cập nhật địa chỉ chăm sóc của gia đình!");
    };

    const handleSavePassword = (e) => {
        e.preventDefault();
        if (passwordForm.newPass !== passwordForm.confirm) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
        setIsPasswordModalOpen(false);
        setPasswordForm({ current: "", newPass: "", confirm: "" });
        showSuccessToast("Đã đổi mật khẩu tài khoản thành công!");
    };

    const handleLogoutAllDevices = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi tất cả các thiết bị?")) {
            localStorage.removeItem("carelink_user");
            navigate("/login");
        }
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

            {/* SECTION 1: THÔNG TIN CÁ NHÂN */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#002045]">Thông tin cá nhân</h3>
                            <p className="text-xs text-slate-500">Thông tin đại diện tài khoản gia đình</p>
                        </div>
                    </div>

                    {!isEditingPersonal && (
                        <button
                            type="button"
                            onClick={() => {
                                setPersonalDraft({ ...personalInfo });
                                setIsEditingPersonal(true);
                            }}
                            className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>

                {isEditingPersonal ? (
                    <form onSubmit={handleSavePersonal} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Họ và tên</label>
                                <input
                                    type="text"
                                    required
                                    value={personalDraft.name}
                                    onChange={(e) => setPersonalDraft({ ...personalDraft, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={personalDraft.email}
                                    onChange={(e) => setPersonalDraft({ ...personalDraft, email: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    required
                                    value={personalDraft.phone}
                                    onChange={(e) => setPersonalDraft({ ...personalDraft, phone: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Gói thành viên</label>
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
                                onClick={() => setIsEditingPersonal(false)}
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
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
                            <strong className="text-sm text-[#002045]">{personalInfo.name}</strong>
                        </div>
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Email:</span>
                            <strong className="text-sm text-slate-700">{personalInfo.email}</strong>
                        </div>
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
                            <strong className="text-sm text-teal-700">{personalInfo.phone}</strong>
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

            {/* SECTION 3: ĐỊA CHỈ CHĂM SÓC */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#002045]">Địa chỉ chăm sóc</h3>
                            <p className="text-xs text-slate-500">Địa chỉ nhà để điều dưỡng tới chăm sóc trực tiếp</p>
                        </div>
                    </div>

                    {!isEditingAddress && (
                        <button
                            type="button"
                            onClick={() => {
                                setAddressDraft({ ...addressInfo });
                                setIsEditingAddress(true);
                            }}
                            className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>

                {isEditingAddress ? (
                    <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Tỉnh / Thành phố</label>
                                <input
                                    type="text"
                                    required
                                    value={addressDraft.city}
                                    onChange={(e) => setAddressDraft({ ...addressDraft, city: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Quận / Huyện</label>
                                <input
                                    type="text"
                                    required
                                    value={addressDraft.district}
                                    onChange={(e) => setAddressDraft({ ...addressDraft, district: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Phường / Xã</label>
                                <input
                                    type="text"
                                    required
                                    value={addressDraft.ward}
                                    onChange={(e) => setAddressDraft({ ...addressDraft, ward: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-slate-700 font-semibold mb-1">Địa chỉ chi tiết (Số nhà, Tên đường, Tòa nhà)</label>
                                <input
                                    type="text"
                                    required
                                    value={addressDraft.streetAddress}
                                    onChange={(e) => setAddressDraft({ ...addressDraft, streetAddress: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-slate-700 font-semibold mb-1">Ghi chú hướng dẫn cho điều dưỡng</label>
                                <textarea
                                    rows={2}
                                    value={addressDraft.noteForCaregiver}
                                    onChange={(e) => setAddressDraft({ ...addressDraft, noteForCaregiver: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsEditingAddress(false)}
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
                    <div className="space-y-3 text-xs">
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Địa chỉ:</span>
                            <strong className="text-sm text-[#002045]">{addressInfo.streetAddress}</strong>
                            <p className="text-slate-600 mt-0.5">
                                {addressInfo.ward}, {addressInfo.district}, {addressInfo.city}
                            </p>
                        </div>
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Ghi chú cho điều dưỡng:</span>
                            <p className="text-slate-700 italic mt-0.5">"{addressInfo.noteForCaregiver}"</p>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 4: BẢO MẬT TÀI KHOẢN */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
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
                            onClick={() => alert("Hiện tại tài khoản chỉ đang hoạt động trên thiết bị này.")}
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
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-page-enter">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
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

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
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
                </div>
            )}
        </div>
    );
}
