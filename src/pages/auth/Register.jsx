import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [role, setRole] = useState("family"); // 'family' | 'caregiver'
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!");
            return;
        }

        setIsLoading(true);
        // Lưu phiên đăng ký người dùng vào localStorage
        localStorage.setItem("carelink_user", JSON.stringify({
            name: name || (role === "family" ? "Gia đình Bác An" : "Điều dưỡng Minh Tâm"),
            email: email || (role === "family" ? "giadinh@carelink.vn" : "dieuduong@carelink.vn"),
            role: role,
            avatar: role === "family"
                ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                : "https://images.unsplash.com/photo-1594824813629-8736d5e7a9e3?w=150&auto=format&fit=crop&q=80"
        }));
        // Giả lập tiến trình đăng ký tài khoản
        setTimeout(() => {
            setIsLoading(false);
            if (role === "family") {
                navigate("/dashboard");
            } else {
                // Đối với điều dưỡng, điều hướng tới trang hồ sơ điều dưỡng
                navigate("/caregivers/profile");
            }
        }, 800);
    };

    return (
        <div className="bg-[#F8FAFC] text-slate-800 font-sans min-h-screen flex flex-col justify-between antialiased selection:bg-teal-100 selection:text-teal-900">
            {/* Header đồng bộ logo và kích thước với Header ngoài trang Home */}
            <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_25px_-5px_rgba(16,32,48,0.05)] sticky top-0 z-50 transition-all">
                <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
                    {/* Logo CareLink */}
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0 cursor-pointer" title="Về trang chủ CareLink">
                        <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-[#002045] tracking-tight group-hover:text-teal-600 transition-colors leading-none">
                                Care<span className="text-teal-600">Link</span>
                            </span>
                            <span className="text-[10px] tracking-widest text-teal-600 uppercase font-semibold mt-0.5">
                                Medical Care
                            </span>
                        </div>
                    </Link>

                    {/* Right Link */}
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-[13px] font-medium">
                        <Link
                            to="/"
                            className="flex items-center gap-1.5 text-slate-600 hover:text-[#002045] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            <span>Về trang chủ</span>
                        </Link>
                        <span className="text-slate-300">|</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 hidden sm:inline">Đã có tài khoản?</span>
                            <Link
                                to="/login"
                                className="font-semibold text-teal-600 hover:text-[#002045] hover:underline transition-colors flex items-center gap-1"
                            >
                                <span>Đăng nhập ngay</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Container: Centered Card Form - ĐÃ NỚI RỘNG RÃI SANG max-w-3xl (768px) */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-4 sm:my-6">
                <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-10 lg:p-12">
                    
                    {/* Top Title & Badge */}
                    <div className="text-center max-w-lg mx-auto mb-8">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-3">
                            <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.1-6.2-4.6-6.2 4.6 2.3-7.1-6.1-4.5h7.6z" />
                            </svg>
                            Khởi đầu cùng CareLink
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002045] tracking-tight">Tạo tài khoản CareLink</h1>
                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                            Chọn vai trò phù hợp để bắt đầu sử dụng hệ thống y tế và chăm sóc sức khỏe.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* PHẦN CHỌN VAI TRÒ (ROLE SELECTOR) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3">
                                1. Chọn vai trò của bạn <span className="text-rose-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                {/* Option 1: Gia đình */}
                                <button
                                    type="button"
                                    onClick={() => setRole("family")}
                                    className={`relative text-left flex flex-col p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${
                                        role === "family"
                                            ? "border-teal-600 bg-teal-50/20 shadow-sm"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        {/* Icon Gia đình: Biểu tượng gia đình gắn kết sạch đẹp, sắc nét chuẩn quốc tế */}
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                                            role === "family" 
                                                ? "bg-teal-600 text-white shadow-sm shadow-teal-600/30" 
                                                : "bg-teal-50 text-teal-700"
                                        }`}>
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                {/* Thành viên lớn */}
                                                <path d="M9 11c1.66 0 3-1.34 3-3S10.66 5 9 5 6 6.34 6 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                                {/* Thành viên gia đình thân yêu */}
                                                <path d="M16.5 11c1.38 0 2.5-1.12 2.5-2.5S17.88 6 16.5 6s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5zm0 2c-.67 0-1.32.1-1.92.27 1.48.97 2.42 2.27 2.42 3.73V19h5v-2c0-2.21-3.58-4-5.5-4z" />
                                            </svg>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            role === "family"
                                                ? "border-teal-600 bg-teal-600 text-white"
                                                : "border-slate-300 bg-white"
                                        }`}>
                                            {role === "family" && (
                                                <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-bold text-base text-[#002045] tracking-tight mb-1">Gia đình</span>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                                        Tìm kiếm và kết nối với người chăm sóc phù hợp cho người thân lớn tuổi.
                                    </p>
                                    <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-teal-700">
                                        {/* Icon chiếc khiên nửa đậm nửa nhạt chuẩn hình thiết kế */}
                                        <svg className="w-3.5 h-3.5 text-teal-600 shrink-0" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 3.5L5.5 5.9v5.3c0 4.2 2.8 8.1 6.5 9.1V3.5z" fill="currentColor" />
                                            <path d="M12 3.5v16.8c3.7-1 6.5-4.9 6.5-9.1V5.9L12 3.5z" fill="currentColor" fillOpacity="0.25" />
                                        </svg>
                                        <span>Được bảo vệ bởi bảo hiểm & chuẩn HIPAA</span>
                                    </div>
                                </button>

                                {/* Option 2: Điều dưỡng / Sinh viên Y */}
                                <button
                                    type="button"
                                    onClick={() => setRole("caregiver")}
                                    className={`relative text-left flex flex-col p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group ${
                                        role === "caregiver"
                                            ? "border-teal-600 bg-teal-50/20 shadow-sm"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        {/* Icon người Điều dưỡng / Y sinh chuyên môn */}
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                                            role === "caregiver" 
                                                ? "bg-[#002045] text-teal-300 shadow-sm shadow-[#002045]/30" 
                                                : "bg-blue-50 text-[#002045]"
                                        }`}>
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                {/* Đầu người điều dưỡng */}
                                                <circle cx="12" cy="6.5" r="3.2" />
                                                {/* Thân áo y tế blouse */}
                                                <path d="M5.5 16.5c0-2.2 2.2-4 4.8-4h3.4c2.6 0 4.8 1.8 4.8 4V20h-13v-3.5z" />
                                                {/* Dấu thập y tế trên ngực áo blouse */}
                                                <path d="M12 14v3.5m-1.75-1.75h3.5" stroke={role === "caregiver" ? "#002045" : "#fff"} strokeWidth="1.8" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            role === "caregiver"
                                                ? "border-teal-600 bg-teal-600 text-white"
                                                : "border-slate-300 bg-white"
                                        }`}>
                                            {role === "caregiver" && (
                                                <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-bold text-base text-[#002045] tracking-tight mb-1">Điều dưỡng / Sinh viên Y</span>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                                        Tham gia mạng lưới chăm sóc và tìm kiếm cơ hội làm việc, thực hành lâm sàng.
                                    </p>
                                    <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                        <svg className="w-3.5 h-3.5 text-teal-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                        </svg>
                                        <span>Xác minh chứng chỉ chuyên môn</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* FORM THÔNG TIN CÁ NHÂN */}
                        <div className="space-y-4 pt-1">
                            {/* Họ và tên */}
                            <div>
                                <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Họ và tên <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative rounded-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="reg-name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nhập họ và tên"
                                        className="block w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 focus:bg-white transition-all shadow-xs"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email & Số điện thoại (2 cột trên desktop) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Email <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative rounded-xl">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="email" 
                                            id="reg-email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Nhập email của bạn"
                                            className="block w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 focus:bg-white transition-all shadow-xs"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Số điện thoại <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative rounded-xl">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H3.75A2.25 2.25 0 001.5 4.5v2.25z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="tel" 
                                            id="reg-phone" 
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Nhập số điện thoại"
                                            className="block w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 focus:bg-white transition-all shadow-xs"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mật khẩu & Xác nhận mật khẩu (2 cột) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Mật khẩu <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative rounded-xl">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            id="reg-password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Nhập mật khẩu"
                                            className="block w-full pl-11 pr-10 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 focus:bg-white transition-all shadow-xs"
                                            required
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Xác nhận mật khẩu <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative rounded-xl">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                            </svg>
                                        </div>
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"} 
                                            id="reg-confirm-password" 
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Nhập lại mật khẩu"
                                            className="block w-full pl-11 pr-10 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 focus:bg-white transition-all shadow-xs"
                                            required
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                                            aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkbox Terms */}
                        <div>
                            <label className="flex items-start gap-2.5 cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                                    required
                                />
                                <span className="text-xs text-slate-600 leading-normal">
                                    Tôi đồng ý với{" "}
                                    <a href="#" className="font-semibold text-teal-600 hover:underline">
                                        Điều khoản sử dụng
                                    </a>{" "}
                                    và{" "}
                                    <a href="#" className="font-semibold text-teal-600 hover:underline">
                                        Chính sách bảo mật
                                    </a>{" "}
                                    của CareLink.
                                </span>
                            </label>
                        </div>

                        {/* Banner thông báo động theo vai trò (Đặt ngay trên nút submit) */}
                        <div className="p-3 sm:p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-start gap-2.5 text-xs text-[#065f46] animate-fadeIn">
                            <svg className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                            <p className="leading-relaxed">
                                {role === "family" ? (
                                    <>
                                        Bạn đang đăng ký với vai trò <strong className="font-bold text-[#064e3b]">Gia đình</strong>. Bạn có thể tìm kiếm và đặt lịch ngay sau khi kích hoạt.
                                    </>
                                ) : (
                                    <>
                                        Bạn đang đăng ký vai trò <strong className="font-bold text-[#064e3b]">Điều dưỡng / Y sinh</strong>. Sau bước này, bạn sẽ được chuyển sang quy trình Xác minh chứng chỉ & thẻ ngành.
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Button Submit với icon mũi tên sang phải chuẩn thiết kế */}
                        <button 
                            type="submit" 
                            disabled={isLoading || !agreeTerms}
                            className="w-full py-3.5 px-6 rounded-xl bg-[#002045] hover:bg-[#002d60] text-white font-semibold text-sm tracking-wide shadow-md shadow-[#002045]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
                        >
                            <span>{isLoading ? "Đang tạo tài khoản..." : "Đăng ký tài khoản"}</span>
                            {!isLoading && (
                                <svg className="w-4 h-4 text-teal-300 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            )}
                        </button>

                        {/* Login Prompt */}
                        <div className="text-center pt-1">
                            <p className="text-sm text-slate-600">
                                Đã có tài khoản?{" "}
                                <Link to="/login" className="font-bold text-teal-600 hover:text-[#002045] transition-colors ml-1">
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>

                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-white border-t border-slate-200/80 py-6 px-6 md:px-12 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[#002045]">CareLink</span>
                        <span>© 2026 CareLink. Bản quyền được bảo hộ. Nền tảng kết nối y tế trung gian.</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 font-medium">
                        <a href="#" className="hover:text-[#002045] hover:underline transition-colors">Điều khoản sử dụng</a>
                        <a href="#" className="hover:text-[#002045] hover:underline transition-colors">Chính sách bảo mật</a>
                        <a href="#" className="hover:text-[#002045] hover:underline transition-colors">Trung tâm hỗ trợ</a>
                        <a href="#" className="hover:text-[#002045] hover:underline transition-colors">Tiêu chuẩn an toàn HIPAA</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
