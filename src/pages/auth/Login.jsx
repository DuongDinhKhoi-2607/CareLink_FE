import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
} from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // =========================================================
    // LOGIN LOGIC
    // Giữ nguyên logic hiện tại của CareLink
    // =========================================================
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
        } else if (
            input.includes("caregiver") ||
            input.includes("dieuduong") ||
            input.includes("nguyen")
        ) {
            targetRole = "caregiver";
            targetName = "Nguyên (Caregiver)";
            targetRoute = "/caregiver/dashboard";
        } else {
            targetRole = "family";

            targetName = emailOrPhone
                ? emailOrPhone.includes("@")
                    ? emailOrPhone.split("@")[0]
                    : emailOrPhone
                : "Bác Nguyễn Văn An";

            targetRoute = "/dashboard";
        }

        // Lưu thông tin user vào localStorage
        localStorage.setItem(
            "carelink_user",
            JSON.stringify({
                name: targetName,
                email: emailOrPhone || `${targetRole}@carelink.vn`,
                role: targetRole,
                avatar:
                    targetRole === "admin"
                        ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
                        : targetRole === "caregiver"
                            ? "https://images.unsplash.com/photo-1594824813572-87002fa8c591?w=150&auto=format&fit=crop&q=80"
                            : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            })
        );

        // Chuyển hướng sau khi đăng nhập
        setTimeout(() => {
            setIsLoading(false);
            navigate(targetRoute);
        }, 500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#EEF1F0] text-[#102A2F] antialiased selection:bg-teal-100 selection:text-teal-900 font-sans">

            {/* =========================================================
                HEADER
            ========================================================= */}
            <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-50">
                <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-[76px] flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 group shrink-0"
                        title="Về trang chủ CareLink"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#087287] to-[#123248] flex items-center justify-center text-white shadow-sm group-hover:scale-[1.02] transition-transform duration-200">
                            <svg
                                className="w-[18px] h-[18px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-[#002045] tracking-tight leading-none">
                                Care<span className="text-teal-600">Link</span>
                            </span>

                            <span className="text-[10px] tracking-[0.18em] text-teal-600 uppercase font-semibold mt-1">
                                Medical Care
                            </span>
                        </div>
                    </Link>

                    {/* Chỉ giữ Về trang chủ
                        Không lặp CTA Đăng ký ở header */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors px-2 py-2 rounded-lg hover:bg-slate-50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Về trang chủ</span>
                    </Link>
                </div>
            </header>

            {/* =========================================================
                MAIN
            ========================================================= */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

                {/* =====================================================
                    MAIN CONTAINER
                    Desktop: 58% image / 42% form
                ===================================================== */}
                <div className="w-full max-w-[1240px] min-h-[580px] lg:min-h-[620px] bg-white rounded-[24px] overflow-hidden border border-slate-200/90 shadow-[0_22px_60px_-24px_rgba(15,23,42,0.18)] flex flex-col lg:flex-row">

                    {/* =================================================
                        LEFT — IMAGE 58%
                    ================================================= */}
                    <section className="hidden lg:block relative lg:w-[58%] overflow-hidden bg-slate-900">

                        {/* Main image */}
                        <img
                            src="/images/login_caregiver.jpg"
                            alt="Chăm sóc người cao tuổi tại nhà"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />

                        {/* Very subtle bottom gradient
                            Chỉ để ảnh không bị cháy ở phần đáy */}
                        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/35 via-black/8 to-transparent pointer-events-none" />

                        {/* Small brand statement
                            Không dùng headline lớn nữa */}
                        <div className="absolute left-8 xl:left-10 bottom-8 xl:bottom-9 z-10">

                            <div className="flex items-center gap-2.5">
                                <span className="w-6 h-px bg-white/80" />

                                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/90">
                                    CareLink
                                </span>
                            </div>

                            <p className="mt-2 text-[12px] text-white/75 tracking-wide">
                                Chăm sóc tận tâm · Kết nối chuyên môn
                            </p>
                        </div>
                    </section>

                    {/* =================================================
                        RIGHT — FORM 42%
                    ================================================= */}
                    <section className="w-full lg:w-[42%] bg-[#F6F4EF] flex items-center justify-center">

                        <div className="w-full max-w-[400px] px-6 sm:px-10 lg:px-8 xl:px-10 py-10 sm:py-12 lg:py-14">

                            {/* =================================================
                                EYEBROW
                            ================================================= */}
                            <div className="flex items-center gap-2.5 mb-4">
                                <span className="w-6 h-px bg-teal-600" />

                                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-700">
                                    Chào mừng trở lại
                                </span>
                            </div>

                            {/* =================================================
                                TITLE
                            ================================================= */}
                            <div className="mb-8">
                                <h1 className="text-[30px] sm:text-[32px] lg:text-[34px] font-semibold tracking-[-0.035em] text-[#102A2F] leading-[1.1]">
                                    Đăng nhập
                                </h1>

                                <p className="mt-3 text-[14px] leading-6 text-[#667575]">
                                    Chào mừng bạn quay lại với CareLink.
                                </p>
                            </div>

                            {/* =================================================
                                FORM
                            ================================================= */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* ==============================
                                    EMAIL / PHONE
                                ============================== */}
                                <div>
                                    <label
                                        htmlFor="emailOrPhone"
                                        className="block text-[13px] font-medium text-[#304348] mb-2"
                                    >
                                        Email hoặc số điện thoại
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-slate-400 pointer-events-none"
                                        />

                                        <input
                                            id="emailOrPhone"
                                            type="text"
                                            required
                                            value={emailOrPhone}
                                            onChange={(e) =>
                                                setEmailOrPhone(e.target.value)
                                            }
                                            placeholder="Nhập email hoặc số điện thoại"
                                            className="
                                                w-full
                                                h-12
                                                pl-11
                                                pr-4
                                                bg-[#FBFAF7]
                                                border
                                                border-[#D9DEDA]
                                                rounded-xl
                                                text-sm
                                                text-[#203337]
                                                placeholder:text-[#9AA5A4]
                                                outline-none
                                                transition-all
                                                duration-200
                                                focus:bg-white
                                                focus:border-[#187D74]
                                                focus:ring-[3px]
                                                focus:ring-[#187D74]/10
                                            "
                                        />
                                    </div>
                                </div>

                                {/* ==============================
                                    PASSWORD
                                ============================== */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-[13px] font-medium text-[#304348] mb-2"
                                    >
                                        Mật khẩu
                                    </label>

                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-slate-400 pointer-events-none"
                                        />

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            required
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Nhập mật khẩu của bạn"
                                            className="
                                                w-full
                                                h-12
                                                pl-11
                                                pr-11
                                                bg-[#FBFAF7]
                                                border
                                                border-[#D9DEDA]
                                                rounded-xl
                                                text-sm
                                                text-[#203337]
                                                placeholder:text-[#9AA5A4]
                                                outline-none
                                                transition-all
                                                duration-200
                                                focus:bg-white
                                                focus:border-[#187D74]
                                                focus:ring-[3px]
                                                focus:ring-[#187D74]/10
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            className="absolute right-0 top-0 h-full px-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                            aria-label={
                                                showPassword
                                                    ? "Ẩn mật khẩu"
                                                    : "Hiện mật khẩu"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-[17px] h-[17px]" />
                                            ) : (
                                                <Eye className="w-[17px] h-[17px]" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* ==============================
                                    REMEMBER + FORGOT
                                ============================== */}
                                <div className="flex items-center justify-between pt-0.5">

                                    <label
                                        htmlFor="rememberMe"
                                        className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#667575] cursor-pointer select-none"
                                    >
                                        <input
                                            id="rememberMe"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) =>
                                                setRememberMe(
                                                    e.target.checked
                                                )
                                            }
                                            className="w-4 h-4 rounded-[4px] border-[#C8D0CE] text-[#187D74] focus:ring-[#187D74]/20 cursor-pointer"
                                        />

                                        <span>
                                            Ghi nhớ đăng nhập
                                        </span>
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-[12px] sm:text-[13px] font-medium text-[#187D74] hover:text-[#12655F] transition-colors"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                {/* ==============================
                                    LOGIN BUTTON
                                ============================== */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="
                                        w-full
                                        h-12
                                        mt-2
                                        px-5
                                        rounded-xl
                                        bg-[#187D74]
                                        hover:bg-[#126A63]
                                        active:scale-[0.99]
                                        text-white
                                        text-sm
                                        font-semibold
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        transition-all
                                        duration-200
                                        shadow-[0_6px_16px_-7px_rgba(24,125,116,0.55)]
                                        disabled:opacity-70
                                        disabled:cursor-not-allowed
                                        cursor-pointer
                                    "
                                >
                                    <span>
                                        {isLoading
                                            ? "Đang xử lý..."
                                            : "Đăng nhập"}
                                    </span>

                                    {!isLoading && (
                                        <ArrowRight className="w-4 h-4" />
                                    )}
                                </button>
                            </form>

                            {/* =================================================
                                REGISTER
                                Không divider — giữ thật nhẹ
                            ================================================= */}
                            <div className="mt-8 text-center text-[12px] sm:text-[13px] text-[#71807F]">
                                <span>
                                    Chưa có tài khoản?{" "}
                                </span>

                                <Link
                                    to="/register"
                                    className="font-semibold text-[#187D74] hover:text-[#12655F] transition-colors"
                                >
                                    Đăng ký ngay
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* =========================================================
                FOOTER
            ========================================================= */}
            <footer className="w-full px-5 sm:px-8 lg:px-12 py-4 border-t border-slate-200/80 bg-white">

                <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">

                    <p className="text-[11px] text-slate-400">
                        © 2026 CareLink Medical Care.
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">

                        <span className="hover:text-slate-600 transition-colors cursor-pointer">
                            Điều khoản
                        </span>

                        <span className="text-slate-300">
                            ·
                        </span>

                        <span className="hover:text-slate-600 transition-colors cursor-pointer">
                            Bảo mật
                        </span>

                        <span className="text-slate-300">
                            ·
                        </span>

                        <span className="hover:text-slate-600 transition-colors cursor-pointer">
                            Hỗ trợ
                        </span>

                    </div>
                </div>
            </footer>
        </div>
    );
}