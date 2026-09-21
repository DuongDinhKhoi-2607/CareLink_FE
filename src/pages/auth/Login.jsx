import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const input = (emailOrPhone || "").trim().toLowerCase();
        let targetRole = "family";
        let targetName = "Bác Nguyễn Văn An";
        let targetRoute = "/dashboard";

        if (input.includes("admin")) {
            targetRole = "admin";
            targetName = "Ban Quản trị CareLink";
            targetRoute = "/admin";
        } else if (input.includes("caregiver") || input.includes("dieuduong") || input.includes("nguyen")) {
            targetRole = "caregiver";
            targetName = "Nguyên (Caregiver)";
            targetRoute = "/caregiver/dashboard";
        } else {
            targetRole = "family";
            targetName = emailOrPhone ? (emailOrPhone.includes("@") ? emailOrPhone.split("@")[0] : emailOrPhone) : "Bác Nguyễn Văn An";
            targetRoute = "/dashboard";
        }

        // Lưu phiên đăng nhập người dùng vào localStorage
        localStorage.setItem("carelink_user", JSON.stringify({
            name: targetName,
            email: emailOrPhone || `${targetRole}@carelink.vn`,
            role: targetRole,
            avatar: targetRole === "admin" 
                ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" 
                : targetRole === "caregiver" 
                ? "https://images.unsplash.com/photo-1594824813572-87002fa8c591?w=150&auto=format&fit=crop&q=80" 
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        }));

        // Chuyển hướng đến đúng trang của từng role
        setTimeout(() => {
            setIsLoading(false);
            navigate(targetRoute);
        }, 500);
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#f7fafc] text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 font-sans">
            {/* Header nhỏ phía trên với Logo CareLink và MEDICAL CARE */}
            <header className="w-full bg-white border-b border-slate-200/80 py-3.5 px-6 md:px-12 sticky top-0 z-30 shadow-xs">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group cursor-pointer" title="Về trang chủ CareLink">
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

                    <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
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
                        <span className="hidden sm:inline text-slate-500">Chưa có tài khoản?</span>
                        <Link
                            to="/register"
                            className="px-3.5 py-1.5 rounded-lg border border-[#002045] text-[#002045] hover:bg-slate-50 font-semibold transition-all"
                        >
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content: Chia 2 khu vực (Trái: Visual gia đình ấm áp, Phải: Form đăng nhập) */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
                <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_36px_rgba(0,32,69,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
                    {/* Cột Trái: Visual chăm sóc người cao tuổi tại nhà, ấm áp, chuyên nghiệp */}
                    <div className="lg:col-span-5 relative bg-gradient-to-br from-[#002045] to-[#04336c] text-white p-8 md:p-10 flex flex-col justify-between overflow-hidden">
                        {/* Background Image with Overlay */}
                        <img
                            src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1000"
                            alt="Chăm sóc người cao tuổi tại nhà CareLink"
                            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1000";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#002045] via-[#002045]/70 to-transparent pointer-events-none" />

                        {/* Content Top */}
                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-medium backdrop-blur-md mb-4">
                                <svg className="w-3.5 h-3.5 text-teal-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Nền tảng y tế tin cậy
                            </span>

                            <h2 className="text-2xl lg:text-3xl font-bold leading-snug tracking-tight">
                                Chăm sóc tận tâm, kết nối chuyên môn.
                            </h2>

                            <p className="text-xs lg:text-sm text-slate-200/90 mt-3 leading-relaxed">
                                CareLink kết nối gia đình với Sinh viên Y khoa và Điều dưỡng chuyên nghiệp, mang đến giải pháp chăm sóc tại nhà an toàn và đáng tin cậy.
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] text-teal-300 backdrop-blur-sm border border-white/10">
                                    <svg className="w-3 h-3 text-teal-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Xác minh danh tính
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] text-teal-300 backdrop-blur-sm border border-white/10">
                                    <svg className="w-3 h-3 text-teal-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Đội ngũ chuyên môn
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] text-teal-300 backdrop-blur-sm border border-white/10">
                                    <svg className="w-3 h-3 text-teal-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Kết nối an toàn
                                </span>
                            </div>
                        </div>

                        {/* Content Bottom: Quote & Trust Indicators */}
                        <div className="relative z-10 pt-6 border-t border-white/10 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-teal-400/20 border border-teal-300/40 flex items-center justify-center text-teal-300 shrink-0">
                                    <svg className="w-4 h-4 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white">Bảo vệ quyền lợi &amp; Minh bạch</p>
                                    <p className="text-[11px] text-slate-300">Hồ sơ xác thực CCCD &amp; Thẻ ngành y</p>
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-400 italic">
                                &ldquo;Hơn 12.000+ giờ chăm sóc y tế tại gia đã được thực hiện an toàn trên toàn quốc.&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Cột Phải: Card Đăng nhập */}
                    <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
                        <div className="max-w-md mx-auto w-full space-y-6">
                            {/* Header Card */}
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 block mb-1">
                                    Cổng kết nối y tế
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
                                    Chào mừng trở lại
                                </h1>
                                <p className="text-sm text-slate-500 mt-1.5">
                                    Đăng nhập để tiếp tục sử dụng CareLink.
                                </p>
                            </div>

                            {/* Form Đăng nhập */}
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                        Email hoặc số điện thoại
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            value={emailOrPhone}
                                            onChange={(e) => setEmailOrPhone(e.target.value)}
                                            placeholder="Nhập email hoặc số điện thoại của bạn"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 focus:bg-white transition-all shadow-xs"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Nhập mật khẩu của bạn"
                                            className="w-full pl-10 pr-11 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 focus:bg-white transition-all shadow-xs"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-hidden"
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

                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center">
                                        <input
                                            id="rememberMe"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded text-[#002045] focus:ring-teal-500 border-slate-300 cursor-pointer"
                                        />
                                        <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-600 cursor-pointer select-none">
                                            Ghi nhớ đăng nhập
                                        </label>
                                    </div>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 px-4 bg-[#002045] hover:bg-[#002d60] text-white font-semibold rounded-xl text-sm shadow-md shadow-[#002045]/15 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70"
                                >
                                    <span>{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}</span>
                                    {!isLoading && (
                                        <svg className="w-4 h-4 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    )}
                                </button>
                            </form>

                            {/* Footer của Card Đăng nhập */}
                            <div className="pt-4 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-500">
                                    Chưa có tài khoản?
                                    <Link
                                        to="/register"
                                        className="font-semibold text-teal-600 hover:text-teal-700 ml-1 transition-colors underline-offset-2 hover:underline"
                                    >
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Footer */}
            <footer className="w-full py-5 px-6 border-t border-slate-200/80 bg-white/70 backdrop-blur-sm text-center text-xs text-slate-400">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
                    <p>© 2026 CareLink Medical Care. Nền tảng kết nối y tế trung gian theo quy định bảo mật HIPAA.</p>
                    <div className="flex gap-4 text-slate-500 text-xs">
                        <span className="hover:text-slate-700 cursor-pointer">Điều khoản sử dụng</span>
                        <span className="hover:text-slate-700 cursor-pointer">Chính sách bảo mật</span>
                        <span className="hover:text-slate-700 cursor-pointer">Hỗ trợ khách hàng</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
