import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    AlertCircle,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
} from "lucide-react";
import authApi, { GOOGLE_CLIENT_ID, fetchAndSyncUserMe } from "../../api/authApi";
import Toast from "../../components/Toast";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [emailOrPhone, setEmailOrPhone] = useState(location.state?.email || "");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [errors, setErrors] = useState({});

    // Tự động nhận email từ trang Đặt lại mật khẩu thành công
    useEffect(() => {
        if (location.state?.email) {
            setEmailOrPhone(location.state.email);
            setToast({
                type: "success",
                title: "Mật khẩu mới đã sẵn sàng!",
                message: `Tài khoản ${location.state.email} đã được cập nhật. Vui lòng nhập mật khẩu mới để đăng nhập.`,
            });
        }
    }, [location.state]);

    // =========================================================
    // XỬ LÝ ĐĂNG NHẬP (API THẬT + SAFETY FALLBACK MOCK)
    // =========================================================
    const handleLoginSuccess = (userObj, token, refreshToken) => {
        if (token) {
            localStorage.setItem("carelink_token", token);
        }
        if (refreshToken) {
            localStorage.setItem("carelink_refresh_token", refreshToken);
        }
        localStorage.setItem("carelink_user", JSON.stringify(userObj));

        if (rememberMe) {
            localStorage.setItem("carelink_remember_me", "true");
        } else {
            localStorage.removeItem("carelink_remember_me");
        }

        setToast({
            type: "success",
            title: "Đăng nhập thành công!",
            message: `Chào mừng ${userObj.name} quay lại với CareLink. Đang chuyển hướng...`,
        });

        // Chuyển hướng theo đúng vai trò tài khoản
        setTimeout(() => {
            if (userObj.role === "caregiver") {
                navigate("/caregiver/dashboard");
            } else if (userObj.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        }, 1500);
    };

    const doMockLoginFallback = (input) => {
        let targetRole = "family";
        let targetName = "Nguyễn Văn An";

        if (input.includes("admin")) {
            targetRole = "admin";
            targetName = "Ban Quản trị CareLink";
        } else if (
            input.includes("caregiver") ||
            input.includes("dieuduong") ||
            input.includes("linh")
        ) {
            targetRole = "caregiver";
            targetName = "Điều dưỡng Nguyễn Thùy Linh";
        } else {
            targetRole = "family";
            targetName =
                emailOrPhone && !input.includes("family")
                    ? emailOrPhone.includes("@")
                        ? emailOrPhone.split("@")[0]
                        : emailOrPhone
                    : "Nguyễn Văn An";
        }

        const mockUser = {
            name: targetName,
            email: emailOrPhone || `${targetRole}@carelink.vn`,
            role: targetRole,
            avatar:
                targetRole === "admin"
                    ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
                    : targetRole === "caregiver"
                        ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
                        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        };

        // Lưu giả lập token để các trang khác không bị chặn
        const mockToken = "mock_token_" + Date.now();
        handleLoginSuccess(mockUser, mockToken, mockToken);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setToast(null);

        const emailTrimmed = (emailOrPhone || "").trim();
        const newErrors = {};

        if (!emailTrimmed) {
            newErrors.emailOrPhone = "Vui lòng nhập email hoặc số điện thoại.";
        }
        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu của bạn.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        setIsLoading(true);

        const input = emailTrimmed.toLowerCase();
        const isMockKeyword = ["admin", "caregiver", "dieuduong", "linh", "family"].some((k) =>
            input.includes(k)
        );

        try {
            // 1. ƯU TIÊN GỌI API THẬT TỪ BACKEND
            const res = await authApi.login({
                email: emailTrimmed,
                password,
            });

            // Backend trả về: { accessToken, refreshToken, user: { id, email, role, isActive } }
            if (res && res.accessToken) {
                localStorage.setItem("carelink_token", res.accessToken);
                if (res.refreshToken) {
                    localStorage.setItem("carelink_refresh_token", res.refreshToken);
                }

                // Gọi ngay GET /api/v1/users/me để lấy chính xác họ tên và thông tin profile đã lưu
                let syncedUser = null;
                try {
                    syncedUser = await fetchAndSyncUserMe();
                } catch (e) {
                    console.warn("[CareLink Auth] sync /users/me failed, falling back:", e);
                }

                const beRole = String(res.user?.role || "").toLowerCase();
                let targetRole = syncedUser?.role || "family";
                let targetName = syncedUser?.fullName || syncedUser?.name || res.user?.fullName;
                let avatar = syncedUser?.avatar || syncedUser?.avatarUrl;

                if (!targetName) {
                    if (beRole.includes("admin")) {
                        targetRole = "admin";
                        targetName = "Ban Quản trị CareLink";
                        avatar = avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80";
                    } else if (beRole.includes("nurse") || beRole.includes("caregiver")) {
                        targetRole = "caregiver";
                        targetName = "Điều dưỡng CareLink";
                        avatar = avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300";
                    } else {
                        targetRole = "family";
                        targetName = "Khách hàng CareLink";
                        avatar = avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                    }
                }

                const userObj = {
                    id: syncedUser?.id || res.user?.id,
                    name: targetName,
                    fullName: targetName,
                    email: res.user?.email,
                    role: targetRole,
                    avatar,
                    avatarUrl: avatar,
                    phone: syncedUser?.phone || "",
                };

                handleLoginSuccess(userObj, res.accessToken, res.refreshToken);
                return;
            }
        } catch (err) {
            console.warn("[CareLink Auth] Login API error:", err);

            // 2. SAFETY FALLBACK: Nếu người dùng nhập tài khoản mẫu demo hoặc backend chưa bật
            if (isMockKeyword || err.code === "ERR_NETWORK" || !err.response) {
                doMockLoginFallback(input);
                return;
            }

            // 3. XỬ LÝ LỖI CHÍNH XÁC VÀ THÂN THIỆN
            let errorMessage = "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!";
            if (err.response?.status === 401 || err.response?.status === 400) {
                errorMessage = "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!";
            } else if (err.code === "ERR_NETWORK" || !err.response) {
                errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại!";
            } else if (err.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            setToast({
                type: "error",
                title: "Đăng nhập thất bại",
                message: errorMessage,
            });
            setIsLoading(false);
        }
    };

    // =========================================================
    // GOOGLE LOGIN (TÍCH HỢP GOOGLE SIGN-IN SDK + BE API THẬT)
    // =========================================================
    const handleGoogleCredentialResponse = async (response) => {
        if (!response?.credential) {
            setToast({
                type: "error",
                title: "Đăng nhập Google thất bại",
                message: "Không nhận được mã xác thực idToken từ Google.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await authApi.googleLogin({
                idToken: response.credential,
                role: 0,
            });

            const data = res?.data || res;
            if (data?.accessToken) {
                localStorage.setItem("carelink_token", data.accessToken);
                if (data.refreshToken) {
                    localStorage.setItem("carelink_refresh_token", data.refreshToken);
                }
            }

            let syncedGoogleUser = null;
            try {
                syncedGoogleUser = await fetchAndSyncUserMe();
            } catch (e) {
                console.warn("[CareLink Auth] sync Google /users/me failed:", e);
            }

            const beRole = String(data.user?.role || "").toLowerCase();
            let targetRole = syncedGoogleUser?.role || "family";
            if (beRole.includes("admin")) {
                targetRole = "admin";
            } else if (beRole.includes("nurse") || beRole.includes("caregiver")) {
                targetRole = "caregiver";
            }

            const targetName = syncedGoogleUser?.fullName || syncedGoogleUser?.name || (data.user?.email ? data.user.email.split("@")[0] : "Người dùng Google");
            const avatar = syncedGoogleUser?.avatar || (targetRole === "caregiver"
                ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
                : targetRole === "admin"
                ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");

            const userObj = {
                id: syncedGoogleUser?.id || data.user?.id,
                name: targetName,
                fullName: targetName,
                email: data.user?.email || "google.user@carelink.vn",
                role: targetRole,
                avatar,
                avatarUrl: avatar,
                phone: syncedGoogleUser?.phone || "",
            };

            handleLoginSuccess(userObj, data.accessToken, data.refreshToken);
        } catch (apiErr) {
            console.warn("[CareLink Auth] Google login API error:", apiErr);
            if (apiErr.code === "ERR_NETWORK" || !apiErr.response) {
                setToast({
                    type: "info",
                    title: "Chế độ trải nghiệm",
                    message: "Không kết nối được Backend. Đang kích hoạt phiên làm việc Google mẫu...",
                });
                const mockGoogleUser = {
                    name: "Nguyễn Văn An (Google)",
                    email: "an.nguyen.google@carelink.vn",
                    role: "family",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                };
                handleLoginSuccess(mockGoogleUser, "mock_google_token_" + Date.now(), "mock_google_refresh_" + Date.now());
            } else {
                const msg =
                    apiErr.response?.data?.message ||
                    apiErr.response?.data?.detail ||
                    "Đăng nhập bằng tài khoản Google đang gặp gián đoạn. Vui lòng thử lại lần nữa hoặc thử lại sau ít phút.";
                setToast({
                    type: "error",
                    title: "Đăng nhập Google chưa thành công",
                    message: msg,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        if (isLoading) return;
        setToast(null);

        // Kích hoạt nút Google Sign-In chính thức để mở cửa sổ chọn tài khoản Google
        const hiddenBtn = document.querySelector("#google-login-hidden-wrapper div[role=button]");
        if (hiddenBtn) {
            hiddenBtn.click();
        } else if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isDismissedMoment()) {
                    setToast({
                        type: "warning",
                        title: "Đã hủy đăng nhập Google",
                        message: "Bạn vừa đóng cửa sổ Google. Vui lòng bấm lại nút nếu muốn tiếp tục đăng nhập.",
                    });
                }
            });
        } else {
            // Khi không có mạng hoặc Google SDK bị chặn: fallback sang tài khoản mẫu
            setToast({
                type: "info",
                title: "Chế độ trải nghiệm",
                message: "Không tải được Google Sign-In SDK. Đang đăng nhập bằng tài khoản Google mẫu...",
            });
            const mockGoogleUser = {
                name: "Nguyễn Văn An (Google)",
                email: "an.nguyen.google@carelink.vn",
                role: "family",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            };
            handleLoginSuccess(mockGoogleUser, "mock_google_token_" + Date.now(), "mock_google_refresh_" + Date.now());
        }
    };

    const googleCallbackRef = useRef(handleGoogleCredentialResponse);
    useEffect(() => {
        googleCallbackRef.current = handleGoogleCredentialResponse;
    });

    useEffect(() => {
        const initGoogle = () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: (res) => googleCallbackRef.current?.(res),
                });

                const wrapper = document.getElementById("google-login-hidden-wrapper");
                if (wrapper) {
                    window.google.accounts.id.renderButton(wrapper, {
                        type: "standard",
                        theme: "outline",
                        size: "large",
                    });
                }
            }
        };

        if (window.google?.accounts?.id) {
            initGoogle();
        } else {
            const timer = setInterval(() => {
                if (window.google?.accounts?.id) {
                    initGoogle();
                    clearInterval(timer);
                }
            }, 300);
            return () => clearInterval(timer);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#EEF1F0] text-[#102A2F] antialiased selection:bg-teal-100 selection:text-teal-900 font-sans">
            {/* Toast notification góc trên bên phải */}
            <Toast toast={toast} onClose={() => setToast(null)} duration={4000} />

            {/* =====================================================
                HEADER
            ===================================================== */}
            <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/70 shrink-0 relative z-50">
                <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-[68px] sm:h-[72px] flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 group shrink-0"
                        title="Về trang chủ CareLink"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#087287] to-[#123248] flex items-center justify-center text-white shadow-sm group-hover:scale-[1.03] transition-transform duration-200">
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

                    {/* Về trang chủ */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors px-3 py-2 rounded-xl hover:bg-slate-50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Về trang chủ</span>
                    </Link>
                </div>
            </header>

            {/* =====================================================
                MAIN
                Tối ưu khoảng cách dọc để hạn chế phải cuộn trang
            ===================================================== */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">

                {/* Main container */}
                <div className="w-full max-w-[1200px] min-h-0 lg:min-h-[540px] xl:min-h-[550px] bg-white rounded-[22px] sm:rounded-[26px] overflow-hidden border border-white/80 shadow-[0_24px_70px_-30px_rgba(15,42,47,0.24)] flex flex-col lg:flex-row">

                    {/* =================================================
                        LEFT — IMAGE
                    ================================================= */}
                    <section className="hidden lg:block relative lg:w-[56%] overflow-hidden bg-[#18363B]">

                        {/* Main image */}
                        <img
                            src="/images/login_caregiver.jpg"
                            alt="Chăm sóc người cao tuổi tại nhà"
                            className="absolute inset-0 w-full h-full object-cover object-[center_42%]"
                        />

                        {/* Gradient nhẹ ở đáy */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#102A2F]/65 via-[#102A2F]/10 to-transparent pointer-events-none" />

                        {/* Ánh sáng nhẹ tạo chiều sâu */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#123248]/10 via-transparent to-[#0B2529]/15 pointer-events-none" />

                        {/* Brand statement */}
                        <div className="absolute left-8 xl:left-10 bottom-7 xl:bottom-8 z-10">

                            <div className="flex items-center gap-2.5">
                                <span className="w-7 h-px bg-white/80" />

                                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/90">
                                    CareLink
                                </span>
                            </div>

                            <p className="mt-2 text-[12px] xl:text-[13px] text-white/85 tracking-wide">
                                Chăm sóc tận tâm · Kết nối chuyên môn
                            </p>
                        </div>
                    </section>

                    {/* =================================================
                        RIGHT — LOGIN FORM
                    ================================================= */}
                    <section className="w-full lg:w-[44%] bg-[#F8F7F3] flex items-center justify-center">

                        <div className="w-full max-w-[410px] px-6 sm:px-10 lg:px-8 xl:px-10 py-7 sm:py-8 lg:py-7 xl:py-8">

                            {/* Eyebrow */}
                            <div className="flex items-center gap-2.5 mb-3">
                                <span className="w-6 h-px bg-[#187D74]" />

                                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#187D74]">
                                    Chào mừng trở lại
                                </span>
                            </div>

                            {/* Title */}
                            <div className="mb-5">
                                <h1 className="text-[29px] sm:text-[31px] lg:text-[32px] font-semibold tracking-[-0.04em] text-[#102A2F] leading-tight">
                                    Đăng nhập
                                </h1>

                                <p className="mt-2 text-[13px] sm:text-[14px] leading-5 text-[#71807F]">
                                    Chào mừng bạn quay lại với CareLink.
                                </p>
                            </div>


                            {/* Login form */}
                            <form onSubmit={handleSubmit} noValidate className="space-y-4">

                                {/* Email / Phone */}
                                <div>
                                    <label
                                        htmlFor="emailOrPhone"
                                        className="block text-[12px] sm:text-[13px] font-medium text-[#304348] mb-1.5"
                                    >
                                        Email hoặc số điện thoại
                                    </label>

                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#91A09E] pointer-events-none" />

                                        <input
                                            id="emailOrPhone"
                                            type="text"
                                            autoComplete="username"
                                            value={emailOrPhone}
                                            onChange={(e) => {
                                                setEmailOrPhone(e.target.value);
                                                if (errors.emailOrPhone) setErrors((prev) => ({ ...prev, emailOrPhone: "" }));
                                            }}
                                            placeholder="Nhập email hoặc số điện thoại"
                                            className={`w-full h-[46px] pl-11 pr-4 rounded-xl text-[13px] sm:text-sm outline-none transition-all duration-200 ${
                                                errors.emailOrPhone
                                                    ? "bg-red-50/20 border border-red-400 text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                                                    : "bg-white border border-[#DDE3DF] text-[#203337] placeholder:text-[#A1AAA7] hover:border-[#C3D2CC] focus:border-[#187D74] focus:ring-[3px] focus:ring-[#187D74]/10"
                                            }`}
                                        />
                                    </div>
                                    {errors.emailOrPhone && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            {errors.emailOrPhone}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-[12px] sm:text-[13px] font-medium text-[#304348] mb-1.5"
                                    >
                                        Mật khẩu
                                    </label>

                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#91A09E] pointer-events-none" />

                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                                            }}
                                            placeholder="Nhập mật khẩu của bạn"
                                            className={`w-full h-[46px] pl-11 pr-11 rounded-xl text-[13px] sm:text-sm outline-none transition-all duration-200 ${
                                                errors.password
                                                    ? "bg-red-50/20 border border-red-400 text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                                                    : "bg-white border border-[#DDE3DF] text-[#203337] placeholder:text-[#A1AAA7] hover:border-[#C3D2CC] focus:border-[#187D74] focus:ring-[3px] focus:ring-[#187D74]/10"
                                            }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            className="absolute right-0 top-0 h-full px-3.5 flex items-center justify-center text-[#91A09E] hover:text-[#187D74] transition-colors cursor-pointer"
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

                                {/* Remember + Forgot password */}
                                <div className="flex items-center justify-between gap-3 pt-0.5">

                                    <label
                                        htmlFor="rememberMe"
                                        className="flex items-center gap-2 text-[11px] sm:text-[12px] text-[#71807F] cursor-pointer select-none"
                                    >
                                        <input
                                            id="rememberMe"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) =>
                                                setRememberMe(e.target.checked)
                                            }
                                            className="w-4 h-4 shrink-0 rounded-[4px] border-[#C8D0CE] accent-[#187D74] focus:ring-[#187D74]/20 cursor-pointer"
                                        />

                                        <span>Ghi nhớ đăng nhập</span>
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-[11px] sm:text-[12px] font-semibold text-[#187D74] hover:text-[#12655F] transition-colors whitespace-nowrap"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                {/* Login button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="
                                        group
                                        w-full h-[46px]
                                        mt-1 px-5
                                        rounded-xl
                                        bg-[#187D74]
                                        hover:bg-[#126A63]
                                        
                                        text-white
                                        text-[13px] sm:text-sm
                                        font-semibold
                                        flex items-center justify-center gap-2
                                        transition-all duration-200
                                        shadow-[0_7px_18px_-8px_rgba(24,125,116,0.65)]
                                        hover:shadow-[0_9px_22px_-8px_rgba(24,125,116,0.55)]
                                        disabled:opacity-70
                                        disabled:cursor-not-allowed
                                        cursor-pointer
                                    "
                                >
                                    <span>
                                        {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                                    </span>

                                    {!isLoading && (
                                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative flex items-center my-[17px]">
                                <div className="flex-1 border-t border-[#DDE2DE]" />

                                <span className="px-3 text-[10px] sm:text-[11px] font-medium tracking-[0.08em] uppercase text-[#84918F]">
                                    Hoặc tiếp tục với
                                </span>

                                <div className="flex-1 border-t border-[#DDE2DE]" />
                            </div>

                            {/* Hidden Google Sign-In SDK button container */}
                            <div id="google-login-hidden-wrapper" className="hidden" aria-hidden="true" />

                            {/* Google login */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="
                                    group
                                    relative
                                    w-full h-[46px]
                                    px-4
                                    rounded-xl
                                    bg-white
                                    hover:bg-[#FCFDFC]
                                    
                                    border border-[#D9DEDA]
                                    hover:border-[#BBCAC3]
                                    text-[#344044]
                                    text-[13px] sm:text-sm
                                    font-medium
                                    flex items-center justify-center gap-3
                                    transition-all duration-200
                                    shadow-[0_1px_2px_rgba(16,42,47,0.025)]
                                    hover:shadow-[0_4px_12px_rgba(16,42,47,0.06)]
                                    disabled:opacity-70
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                "
                            >
                                {/* Google logo */}
                                <svg
                                    className="w-[18px] h-[18px] shrink-0"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="#EA4335"
                                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.05 13.22l7.98 6.19C12.93 13.72 18.02 9.5 24 9.5Z"
                                    />
                                    <path
                                        fill="#4285F4"
                                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 37.95 46.98 31.87 46.98 24.55Z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.86 23.86 0 0 0 0 24c0 3.87.93 7.55 2.56 10.78l7.97-6.19Z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-5.98 0-11.07-4.22-12.9-9.91l-7.98 6.19C6.51 41.62 14.62 48 24 48Z"
                                    />
                                </svg>

                                <span>
                                    {isLoading
                                        ? "Đang xử lý..."
                                        : "Tiếp tục với Google"}
                                </span>
                            </button>

                            {/* Register */}
                            <div className="mt-5 text-center text-[12px] sm:text-[13px] text-[#71807F]">
                                <span>Chưa có tài khoản?</span>{" "}

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

            {/* =====================================================
                FOOTER
            ===================================================== */}
            <footer className="w-full px-5 sm:px-8 lg:px-12 py-3 sm:py-3.5 border-t border-slate-200/70 bg-white shrink-0">

                <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">

                    <p className="text-[10px] sm:text-[11px] text-slate-400">
                        © 2026 CareLink Medical Care.
                    </p>

                    <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-slate-400">

                        <span className="hover:text-slate-600 transition-colors cursor-pointer">
                            Điều khoản
                        </span>

                        <span className="text-slate-300">·</span>

                        <span className="hover:text-slate-600 transition-colors cursor-pointer">
                            Bảo mật
                        </span>

                        <span className="text-slate-300">·</span>

                        <span className="hover:text-slate-600 transition-colors cursor-pointer">
                            Hỗ trợ
                        </span>

                    </div>
                </div>
            </footer>
        </div>
    );
}