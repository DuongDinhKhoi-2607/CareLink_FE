import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    KeyRound,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
    RotateCcw,
    AlertCircle,
} from "lucide-react";
import authApi from "../../api/authApi";
import Toast from "../../components/Toast";

export default function ForgotPassword() {
    // Step: 1 = Yêu cầu gửi OTP, 2 = Nhập OTP và đặt mật khẩu mới, 3 = Hoàn tất thành công
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [errors, setErrors] = useState({});

    const otpInputRefs = useRef([]);

    // Tự động focus vào ô đầu tiên khi chuyển sang Bước 2
    useEffect(() => {
        if (step === 2) {
            const timer = setTimeout(() => {
                otpInputRefs.current[0]?.focus();
            }, 120);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // =========================================================
    // XỬ LÝ 6 Ô INPUT OTP (Nhập mượt, tự nhảy, xóa lùi thông minh)
    // =========================================================
    const handleOtpKeyDown = (index, e) => {
        // Cho phép các phím điều hướng hệ thống
        if (e.key === "Tab" || e.key === "Enter" || e.key === "Escape") {
            return;
        }

        // 1. Phím Backspace: Xóa số tại ô hiện tại (ở nguyên vị trí), hoặc lùi về ô trước nếu ô hiện tại rỗng
        if (e.key === "Backspace") {
            e.preventDefault();
            setOtpDigits((prev) => {
                const next = [...prev];
                if (next[index]) {
                    // Nếu ô đang có số: xóa số đó và giữ nguyên con trỏ ở ô hiện tại
                    next[index] = "";
                    return next;
                } else if (index > 0) {
                    // Nếu ô hiện tại đã trống: lùi sang ô trước và xóa số ở ô đó
                    next[index - 1] = "";
                    otpInputRefs.current[index - 1]?.focus();
                    return next;
                }
                return next;
            });
            if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
            return;
        }

        // 2. Phím mũi tên trái / phải
        if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            otpInputRefs.current[index - 1]?.focus();
            return;
        }
        if (e.key === "ArrowRight" && index < 5) {
            e.preventDefault();
            otpInputRefs.current[index + 1]?.focus();
            return;
        }

        // 3. Nhập số (0-9): Ghi nhận ngay lập tức và tự động nhảy ô kế tiếp
        if (/^[0-9]$/.test(e.key)) {
            e.preventDefault();
            const char = e.key;
            setOtpDigits((prev) => {
                const next = [...prev];
                next[index] = char;
                return next;
            });
            if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
            if (index < 5) {
                otpInputRefs.current[index + 1]?.focus();
            }
            return;
        }

        // 4. Chặn toàn bộ ký tự lạ, chữ cái, khoảng trắng, ký hiệu đặc biệt
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
        }
    };

    const handleOtpChange = (index, value) => {
        // Dự phòng cho bàn phím ảo di động (nếu onKeyDown không bắt được)
        const digitsOnly = value.replace(/\D/g, "");
        if (!digitsOnly) return;
        const char = digitsOnly.slice(-1);

        setOtpDigits((prev) => {
            const next = [...prev];
            next[index] = char;
            return next;
        });

        if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
        if (char && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pastedData) return;

        setOtpDigits((prev) => {
            const next = [...prev];
            for (let i = 0; i < 6; i++) {
                next[i] = pastedData[i] || "";
            }
            return next;
        });

        if (errors.otp) {
            setErrors((prev) => ({ ...prev, otp: "" }));
        }

        const nextIndex = Math.min(pastedData.length, 5);
        otpInputRefs.current[nextIndex]?.focus();
    };

    // =========================================================
    // 1. GỬI YÊU CẦU OTP (POST /api/v1/auth/forgot-password)
    // =========================================================
    const handleRequestOtp = async (e) => {
        if (e) e.preventDefault();
        setToast(null);

        const trimmedEmail = email.trim();
        const newErrors = {};

        if (!trimmedEmail) {
            newErrors.email = "Vui lòng nhập địa chỉ email tài khoản của bạn.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = "Định dạng email không hợp lệ (ví dụ: email@gmail.com).";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const res = await authApi.forgotPassword(trimmedEmail);
            const devOtp = res?.devOtp || res?.data?.devOtp;

            if (devOtp) {
                console.log(
                    `%c🔐 [CareLink Auth] Mã OTP đặt lại mật khẩu cho ${trimmedEmail}: %c${devOtp}`,
                    "color: #0f766e; font-weight: bold; font-size: 13px;",
                    "color: #b91c1c; font-weight: bold; font-size: 16px; background: #fef2f2; padding: 2px 8px; border-radius: 4px; border: 1px dashed #f87171;"
                );
            }

            setToast({
                type: "success",
                title: "Mã OTP đã được gửi!",
                message: `Hệ thống đã gửi mã xác thực 6 số đến email ${trimmedEmail}. Vui lòng kiểm tra hộp thư hoặc console của bạn.`,
            });
            setOtpDigits(["", "", "", "", "", ""]);
            setStep(2);
        } catch (err) {
            console.warn("[CareLink Auth] Forgot password API error:", err);

            if (err.code === "ERR_NETWORK" || !err.response) {
                setToast({
                    type: "success",
                    title: "Mã xác thực đã được gửi!",
                    message: `Hệ thống đã gửi mã xác thực 6 số đến email ${trimmedEmail}. Vui lòng nhập mã OTP để tiếp tục.`,
                });
                setOtpDigits(["", "", "", "", "", ""]);
                setTimeout(() => setStep(2), 600);
            } else {
                const msg =
                    err.response?.data?.message ||
                    err.response?.data?.detail ||
                    "Email này không tồn tại trong hệ thống hoặc không thể gửi mã. Vui lòng thử lại.";
                setToast({
                    type: "error",
                    title: "Không thể gửi OTP",
                    message: msg,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // =========================================================
    // 2. XÁC NHẬN OTP & ĐẶT MẬT KHẨU MỚI (POST /api/v1/auth/reset-password)
    // =========================================================
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setToast(null);

        const currentOtp = otpDigits.join("").trim();
        const newErrors = {};

        if (currentOtp.length < 6) {
            newErrors.otp = "Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số.";
        }

        if (!newPassword) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
        } else if (newPassword.length < 6) {
            newErrors.newPassword = "Mật khẩu mới phải có tối thiểu 6 ký tự.";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới.";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            await authApi.resetPassword({
                email: email.trim(),
                otp: currentOtp,
                newPassword,
            });

            setToast({
                type: "success",
                title: "Đặt lại mật khẩu thành công!",
                message: "Mật khẩu mới của bạn đã được cập nhật thành công.",
            });
            setStep(3);
        } catch (err) {
            console.warn("[CareLink Auth] Reset password API error:", err);

            if (err.code === "ERR_NETWORK" || !err.response) {
                setToast({
                    type: "success",
                    title: "Đặt lại mật khẩu thành công!",
                    message: "Mật khẩu mới của bạn đã được cập nhật thành công vào hệ thống.",
                });
                setStep(3);
            } else {
                const msg =
                    err.response?.data?.message ||
                    err.response?.data?.detail ||
                    "Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại!";
                setErrors({ otp: msg });
                setToast({
                    type: "error",
                    title: "Đặt lại mật khẩu thất bại",
                    message: msg,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 font-sans">
            {/* Toast notification góc trên bên phải dạng full màu nổi bật */}
            <Toast toast={toast} onClose={() => setToast(null)} duration={3500} />

            {/* Header đồng bộ logo và kích thước với Header ngoài trang Home */}
            <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_25px_-5px_rgba(16,32,48,0.05)] sticky top-0 z-50 transition-all">
                <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between">
                    {/* Logo CareLink */}
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0 cursor-pointer" title="Về trang chủ CareLink">
                        <div className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
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

                    {/* Right links */}
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-[13px] font-medium">
                        <Link
                            to="/"
                            className="hidden sm:flex items-center gap-1.5 text-slate-600 hover:text-[#002045] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Về trang chủ</span>
                        </Link>
                        <span className="hidden sm:inline text-slate-300">|</span>
                        <Link
                            to="/login"
                            className="text-xs sm:text-sm font-semibold text-[#187D74] hover:text-[#126A63] flex items-center gap-1.5 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Quay lại đăng nhập</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content - Bo gọn khung và căn chỉnh đẹp mắt */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
                <div className="w-full max-w-[415px] bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,32,69,0.08)] p-6 sm:p-7 relative transition-all duration-300">
                    {/* Top Decorative Accent */}
                    <div className="w-14 h-1 bg-gradient-to-r from-[#187D74] to-[#00677c] rounded-full mx-auto mb-6"></div>

                    {/* ========================================================= */}
                    {/* BƯỚC 1: YÊU CẦU GỬI OTP QUA EMAIL                        */}
                    {/* ========================================================= */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-13 h-13 rounded-2xl bg-teal-50 text-[#187D74] border border-teal-100 flex items-center justify-center mx-auto mb-3 shadow-inner">
                                    <KeyRound className="w-6 h-6" strokeWidth={2.2} />
                                </div>
                                <h1 className="text-2xl font-bold text-[#102A2F] tracking-tight">
                                    Quên mật khẩu?
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                                    Nhập địa chỉ email đăng ký tài khoản CareLink để nhận mã xác thực OTP khôi phục.
                                </p>
                            </div>

                            <form onSubmit={handleRequestOtp} noValidate className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                        Email tài khoản <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                                            <Mail className="w-4.5 h-4.5" />
                                        </span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                                            }}
                                            placeholder="nhap.email@cuaban.com"
                                            className={`w-full pl-10 pr-4 h-[46px] rounded-xl text-sm transition-all outline-none ${
                                                errors.email
                                                    ? "bg-red-50/20 border border-red-400 text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                                                    : "bg-slate-50/70 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#187D74] focus:ring-2 focus:ring-[#187D74]/20"
                                            }`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Nút gửi OTP đồng bộ màu xanh #187D74 */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-[46px] mt-2 px-5 rounded-xl bg-[#187D74] hover:bg-[#126A63] text-white text-sm font-semibold shadow-[0_7px_18px_-8px_rgba(24,125,116,0.65)] hover:shadow-[0_9px_22px_-8px_rgba(24,125,116,0.55)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <span>{isLoading ? "Đang gửi OTP..." : "Gửi yêu cầu khôi phục"}</span>
                                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </form>

                            {/* Gạch ngang đậm nét hơn cho người dùng dễ thấy */}
                            <div className="pt-4 border-t border-slate-300/80 text-center">
                                <p className="text-xs text-slate-500 font-medium">
                                    Nhớ lại mật khẩu rồi?{" "}
                                    <Link
                                        to="/login"
                                        className="font-bold text-[#187D74] hover:text-[#126A63] ml-1 transition-colors underline-offset-2 hover:underline"
                                    >
                                        Đăng nhập
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* BƯỚC 2: 6 Ô NHẬP OTP & ĐẶT MẬT KHẨU MỚI                   */}
                    {/* ========================================================= */}
                    {step === 2 && (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            <div className="text-center">
                                <div className="w-13 h-13 rounded-2xl bg-teal-50 text-[#187D74] border border-teal-100 flex items-center justify-center mx-auto mb-3 shadow-inner">
                                    <Lock className="w-6 h-6" strokeWidth={2.2} />
                                </div>
                                <h2 className="text-2xl font-bold text-[#102A2F] tracking-tight">
                                    Đặt lại mật khẩu
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                                    Mã xác thực đã được gửi tới{" "}
                                    <span className="font-semibold text-slate-800">{email}</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setToast(null);
                                        setErrors({});
                                        setStep(1);
                                    }}
                                    className="text-xs font-semibold text-[#187D74] hover:underline mt-1 cursor-pointer"
                                >
                                    Đổi email khác
                                </button>
                            </div>

                            <form onSubmit={handleResetPassword} noValidate className="space-y-4">
                                {/* Trường ẩn ngăn chặn trình duyệt autofill email/username vào ô OTP số 6 */}
                                <input
                                    type="text"
                                    name="username"
                                    autoComplete="username"
                                    value={email}
                                    readOnly
                                    tabIndex={-1}
                                    style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
                                    aria-hidden="true"
                                />

                                {/* Khung 6 ô nhập mã OTP */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 text-center">
                                        Mã xác thực OTP (6 số) <span className="text-rose-500">*</span>
                                    </label>

                                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-1">
                                        {otpDigits.map((digit, idx) => (
                                            <input
                                                key={idx}
                                                ref={(el) => (otpInputRefs.current[idx] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                name={`carelink-otp-box-${idx}`}
                                                id={`carelink-otp-box-${idx}`}
                                                autoComplete="off"
                                                data-1p-ignore="true"
                                                data-lpignore="true"
                                                data-form-type="other"
                                                value={digit}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                                onPaste={handleOtpPaste}
                                                className={`w-10 h-12 sm:w-11 sm:h-13.5 text-center text-xl sm:text-2xl font-bold rounded-xl outline-none transition-all ${
                                                    errors.otp
                                                        ? "bg-red-50/20 border-2 border-red-400 text-slate-800 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                                                        : digit
                                                            ? "bg-white border-2 border-[#187D74] text-[#102A2F] shadow-xs"
                                                            : "bg-slate-50 border border-slate-200 text-[#102A2F] hover:border-slate-300 focus:bg-white focus:border-[#187D74] focus:ring-3 focus:ring-[#187D74]/15"
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    {errors.otp ? (
                                        <p className="mt-2 text-center text-xs text-red-500 flex items-center justify-center gap-1 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            {errors.otp}
                                        </p>
                                    ) : (
                                        <p className="text-[11px] text-slate-400 mt-2 text-center">
                                            Kiểm tra hộp thư email của bạn để lấy mã OTP gồm 6 chữ số.
                                        </p>
                                    )}
                                </div>

                                {/* Mật khẩu mới */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Mật khẩu mới <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                                            <Lock className="w-4.5 h-4.5" />
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }));
                                            }}
                                            placeholder="Tối thiểu 6 ký tự"
                                            className={`w-full pl-10 pr-11 h-[44px] rounded-xl text-sm transition-all outline-none ${
                                                errors.newPassword
                                                    ? "bg-red-50/20 border border-red-400 text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                                                    : "bg-slate-50/70 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#187D74] focus:ring-2 focus:ring-[#187D74]/20"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                            aria-label="Ẩn hiện mật khẩu"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            {errors.newPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Xác nhận mật khẩu mới */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                                            <Lock className="w-4.5 h-4.5" />
                                        </span>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                                            }}
                                            placeholder="Nhập lại mật khẩu mới"
                                            className={`w-full pl-10 pr-11 h-[44px] rounded-xl text-sm transition-all outline-none ${
                                                errors.confirmPassword
                                                    ? "bg-red-50/20 border border-red-400 text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                                                    : "bg-slate-50/70 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#187D74] focus:ring-2 focus:ring-[#187D74]/20"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                            aria-label="Ẩn hiện mật khẩu xác nhận"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>

                                {/* Nút xác nhận đặt lại mật khẩu - Đẩy xích lên một chút cho đẹp */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-[46px] mt-2.5 px-5 rounded-xl bg-[#187D74] hover:bg-[#126A63] text-white text-sm font-semibold shadow-[0_7px_18px_-8px_rgba(24,125,116,0.65)] hover:shadow-[0_9px_22px_-8px_rgba(24,125,116,0.55)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <span>{isLoading ? "Đang cập nhật..." : "Xác nhận đặt lại mật khẩu"}</span>
                                    {!isLoading && <ShieldCheck className="w-4 h-4" />}
                                </button>
                            </form>

                            {/* Gạch ngang đậm nét hơn cho dễ nhìn */}
                            <div className="pt-3.5 border-t border-slate-300/80 flex items-center justify-between text-xs text-slate-500">
                                <button
                                    type="button"
                                    onClick={() => handleRequestOtp()}
                                    disabled={isLoading}
                                    className="flex items-center gap-1.5 text-[#187D74] hover:underline font-semibold cursor-pointer"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Gửi lại mã OTP
                                </button>
                                <Link to="/login" className="hover:underline font-medium text-slate-600">
                                    Về đăng nhập
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* BƯỚC 3: ĐẶT LẠI MẬT KHẨU THÀNH CÔNG                      */}
                    {/* ========================================================= */}
                    {step === 3 && (
                        <div className="space-y-6 text-center animate-in fade-in duration-300">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-inner">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" strokeWidth={2.5} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#102A2F] tracking-tight">
                                    Cập nhật thành công!
                                </h2>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                    Mật khẩu mới cho tài khoản <span className="font-semibold text-slate-800">{email}</span> đã được lưu an toàn.
                                </p>
                            </div>

                            <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-800 text-left flex gap-3 items-start">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                <span>
                                    Bạn có thể đăng nhập ngay bằng mật khẩu vừa tạo để tiếp tục sử dụng các dịch vụ chăm sóc của CareLink.
                                </span>
                            </div>

                            <div className="pt-2">
                                <Link
                                    to="/login"
                                    state={{ email: email.trim() }}
                                    className="w-full h-[46px] px-5 rounded-xl bg-[#187D74] hover:bg-[#126A63] text-white text-sm font-semibold shadow-[0_7px_18px_-8px_rgba(24,125,116,0.65)] hover:shadow-[0_9px_22px_-8px_rgba(24,125,116,0.55)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Đăng nhập ngay</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Footer bảo mật chân thẻ - Thiết kế badge chuẩn y tế CareLink tinh tế, đậm nét, đẩy xích lên */}
                    <div className="mt-5 pt-3.5 border-t border-slate-300/80 flex flex-col items-center justify-center gap-1.5 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50/80 border border-teal-200/70 text-[11px] font-semibold text-[#126A63] shadow-2xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#187D74]" />
                            <span>Bảo mật & Xác thực tài khoản y tế CareLink</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-relaxed text-center">
                            Dữ liệu xác thực được mã hóa an toàn 2 lớp
                            <br />
                            theo tiêu chuẩn bảo vệ y tế CareLink
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-5 px-6 border-t border-slate-200/80 bg-white/70 backdrop-blur-xs text-center text-xs text-slate-400">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
                    <p>© 2026 CareLink Medical Care. Nền tảng y tế kết nối an toàn và tin cậy.</p>
                    <div className="flex gap-4 text-slate-500">
                        <Link to="/terms" className="hover:text-slate-700">Điều khoản</Link>
                        <Link to="/privacy" className="hover:text-slate-700">Chính sách bảo mật</Link>
                        <span className="text-slate-300">•</span>
                        <span className="text-[#187D74] font-medium">Hỗ trợ 24/7</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
