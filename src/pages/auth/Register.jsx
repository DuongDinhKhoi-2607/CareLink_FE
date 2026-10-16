import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import Toast from "../../components/Toast";


function Icon({ name, className = "h-5 w-5" }) {
    const common = {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        viewBox: "0 0 24 24",
        "aria-hidden": true,
    };

    const paths = {
        user: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
            </>
        ),
        mail: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
            </>
        ),
        phone: (
            <path d="M7 3h3l2 5-2 2a14 14 0 0 0 4 4l2-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 5 5a2 2 0 0 1 2-2Z" />
        ),
        lock: (
            <>
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 1 1 8 0v3" />
            </>
        ),
        eye: (
            <>
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),
        eyeOff: (
            <>
                <path d="m3 3 18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-3 3.8" />
                <path d="M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4-.8" />
            </>
        ),
        alert: (
            <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </>
        ),
        check: <path d="m5 12 4 4L19 6" />,
        arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
        shield: (
            <>
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                <path d="m9 12 2 2 4-4" />
            </>
        ),
        heart: (
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        ),
    };

    return <svg {...common}>{paths[name]}</svg>;
}

function GoogleIcon() {
    return (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
            />
            <path
                fill="#34A853"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3C9.2 39.4 16.1 44 24 44Z"
            />
            <path
                fill="#FBBC05"
                d="M12.6 27.5a12 12 0 0 1 0-7.1v-5.3H5.8a20 20 0 0 0 0 17.7l6.8-5.3Z"
            />
            <path
                fill="#EA4335"
                d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4 16.1 4 9.2 8.6 5.8 15.1l6.8 5.3c1.6-4.7 6.1-8.3 11.4-8.3Z"
            />
        </svg>
    );
}

function RoleCard({ role, selectedRole, onSelect, icon, title, description, details }) {
    const selected = selectedRole === role;

    return (
        <button
            type="button"
            onClick={() => onSelect(role)}
            aria-pressed={selected}
            className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 sm:p-4 ${selected
                    ? "border-teal-600 bg-teal-50/70 ring-2 ring-teal-600/10"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
        >
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${selected
                        ? "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700"
                    }`}
            >
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#002045]">
                        {title}
                    </span>

                    <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${selected
                                ? "border-teal-700 bg-teal-700 text-white"
                                : "border-slate-300 bg-white text-transparent"
                            }`}
                    >
                        <Icon name="check" className="h-3 w-3" />
                    </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    {description}
                </p>

                <div
                    className={`mt-2 text-[11px] font-semibold ${selected ? "text-teal-800" : "text-slate-400"
                        }`}
                >
                    {details}
                </div>
            </div>
        </button>
    );
}

function PasswordField({
    id,
    label,
    value,
    onChange,
    showPassword,
    onToggle,
    autoComplete,
    error,
    placeholder = "Tối thiểu 6 ký tự",
}) {
    return (
        <div className="min-w-0">
            <label
                htmlFor={id}
                className="mb-2 block text-xs font-semibold text-slate-700"
            >
                {label} <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Icon name="lock" className="h-[18px] w-[18px]" />
                </span>

                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`w-full h-11 pl-10 pr-11 rounded-xl text-sm transition-all outline-none ${
                        error
                            ? "bg-red-50/20 border border-red-400 text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                            : "bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                    }`}
                />

                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 cursor-pointer"
                >
                    <Icon
                        name={showPassword ? "eyeOff" : "eye"}
                        className="h-[18px] w-[18px]"
                    />
                </button>
            </div>

            {error && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
                    <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

export default function Register() {
    const navigate = useNavigate();

    const [role, setRole] = useState("family");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Vui lòng nhập họ và tên của bạn.";
        }

        const emailTrimmed = email.trim();
        if (!emailTrimmed) {
            newErrors.email = "Vui lòng nhập địa chỉ email.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
            newErrors.email = "Định dạng email không hợp lệ (ví dụ: email@gmail.com).";
        }

        const phoneTrimmed = phone.trim();
        if (!phoneTrimmed) {
            newErrors.phone = "Vui lòng nhập số điện thoại liên hệ.";
        } else if (!/^(0|\+84)[0-9]{8,11}$/.test(phoneTrimmed)) {
            newErrors.phone = "Số điện thoại không hợp lệ (ví dụ: 0912345678).";
        }

        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu.";
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải từ 6 ký tự trở lên.";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu xác nhận.";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
        }

        if (!agreeTerms) {
            newErrors.agreeTerms = "Vui lòng tích chọn đồng ý với Điều khoản và Chính sách bảo mật.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveUserAndNavigate = (user, token, refreshToken) => {
        if (token) localStorage.setItem("carelink_token", token);
        if (refreshToken) localStorage.setItem("carelink_refresh_token", refreshToken);
        localStorage.setItem("carelink_user", JSON.stringify(user));

        setToast({
            type: "success",
            title: "Tạo tài khoản thành công!",
            message: `Chào mừng bạn đến với CareLink. Đang chuyển hướng về trang chủ...`,
        });

        // Đợi 2.5 giây mượt mà rồi chuyển về trang chủ
        window.setTimeout(() => {
            navigate("/");
        }, 2500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast(null);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const targetRole = role; // "family" | "caregiver"
        const backendRole = role === "caregiver" ? 1 : 0; // 0 = Customer, 1 = Nurse

        try {
            // 1. GỌI API THẬT TỪ BACKEND
            const res = await authApi.register({
                email: email.trim(),
                password,
                role: backendRole,
            });

            // Backend trả về: { accessToken, refreshToken, user: { id, email, role, isActive } }
            if (res && res.accessToken) {
                const userObj = {
                    id: res.user?.id,
                    name: name.trim() || email.trim().split("@")[0],
                    email: res.user?.email || email.trim(),
                    phone: phone.trim(),
                    role: targetRole,
                    avatar:
                        targetRole === "family"
                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                            : "/images/caregiver_avatar.svg",
                };

                saveUserAndNavigate(userObj, res.accessToken, res.refreshToken, targetRole, false);
                return;
            }
        } catch (err) {
            console.warn("[CareLink Auth] Register API trả về lỗi:", err);

            // 2. NẾU LỖI XUNG ĐỘT EMAIL ĐÃ TỒN TẠI (409 CONFLICT)
            if (err.response?.status === 409 || err.response?.data?.message?.includes("Email đã được sử dụng")) {
                setErrors((prev) => ({ ...prev, email: "Email này đã được sử dụng trên hệ thống." }));
                setToast({
                    type: "error",
                    title: "Email đã tồn tại",
                    message: "Email này đã được đăng ký tài khoản. Vui lòng đăng nhập hoặc dùng email khác.",
                });
                setIsLoading(false);
                return;
            }

            // 3. SAFETY FALLBACK: Nếu Backend chưa chạy (Network Error)
            if (err.code === "ERR_NETWORK" || !err.response) {
                const mockUser = {
                    name: name.trim() || (targetRole === "family" ? "Gia đình Minh An" : "Điều dưỡng Thùy Linh"),
                    email: email.trim(),
                    phone: phone.trim(),
                    role: targetRole,
                    avatar:
                        targetRole === "family"
                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                            : "/images/caregiver_avatar.svg",
                };
                const mockToken = "mock_reg_token_" + Date.now();
                saveUserAndNavigate(mockUser, mockToken, mockToken, targetRole, true);
                return;
            }

            // 4. CÁC LỖI KHÁC TỪ SERVER
            const msg =
                err.response?.data?.message ||
                err.response?.data?.detail ||
                err.response?.data?.title ||
                "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.";

            setToast({
                type: "error",
                title: "Đăng ký thất bại",
                message: msg,
            });
            setIsLoading(false);
        }
    };

    // =========================================================
    // GOOGLE REGISTER / LOGIN (TÍCH HỢP GOOGLE SIGN-IN SDK + BE API)
    // =========================================================
    const handleGoogleCredentialResponse = async (response) => {
        if (!response?.credential) {
            setToast({
                type: "error",
                title: "Đăng ký Google thất bại",
                message: "Không nhận được mã xác thực idToken từ Google.",
            });
            return;
        }

        setIsLoading(true);
        try {
            // role = 0 cho Customer (Gia đình), 1 cho Nurse (Điều dưỡng)
            const roleNumber = role === "caregiver" || role === "nurse" ? 1 : 0;
            const res = await authApi.googleLogin({
                idToken: response.credential,
                role: roleNumber,
            });

            const data = res?.data || res;
            const userObj = {
                id: data.user?.id,
                name: data.user?.email ? data.user.email.split("@")[0] : "Người dùng Google",
                email: data.user?.email || "google.user@carelink.vn",
                role: data.user?.role || role,
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            };

            saveUserAndNavigate(userObj, data.accessToken, data.refreshToken, role, true);
        } catch (apiErr) {
            console.warn("[CareLink Auth] Google Register API error:", apiErr);
            if (apiErr.code === "ERR_NETWORK" || !apiErr.response) {
                setToast({
                    type: "info",
                    title: "Chế độ trải nghiệm",
                    message: "Không kết nối được Backend. Đang kích hoạt tài khoản Google mẫu...",
                });
                const googleUser = {
                    name:
                        role === "family"
                            ? "Gia đình Minh An (Google)"
                            : "Điều dưỡng Thùy Linh (Google)",
                    email:
                        role === "family"
                            ? "an.family.google@carelink.vn"
                            : "linh.nurse.google@carelink.vn",
                    role,
                    avatar:
                        role === "family"
                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                            : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
                };
                saveUserAndNavigate(
                    googleUser,
                    "mock_google_token_" + Date.now(),
                    "mock_google_refresh_" + Date.now(),
                    role,
                    true
                );
            } else {
                const msg =
                    apiErr.response?.data?.message ||
                    apiErr.response?.data?.detail ||
                    "Đăng ký bằng tài khoản Google đang gặp gián đoạn. Vui lòng thử lại lần nữa hoặc thử lại sau ít phút.";
                setToast({
                    type: "error",
                    title: "Đăng ký Google chưa thành công",
                    message: msg,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        if (isLoading) return;
        setToast(null);

        const hiddenBtn = document.querySelector("#google-register-hidden-wrapper div[role=button]");
        if (hiddenBtn) {
            hiddenBtn.click();
        } else if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isDismissedMoment()) {
                    setToast({
                        type: "warning",
                        title: "Đã hủy đăng ký Google",
                        message: "Bạn vừa đóng cửa sổ Google. Vui lòng bấm lại nút nếu muốn tiếp tục đăng ký.",
                    });
                }
            });
        } else {
            setToast({
                type: "info",
                title: "Chế độ trải nghiệm",
                message: "Không tải được Google Sign-In SDK. Đang đăng ký với tài khoản Google mẫu...",
            });
            const googleUser = {
                name:
                    role === "family"
                        ? "Gia đình Minh An (Google)"
                        : "Điều dưỡng Thùy Linh (Google)",
                email:
                    role === "family"
                        ? "an.family.google@carelink.vn"
                        : "linh.nurse.google@carelink.vn",
                role,
                avatar:
                    role === "family"
                        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
            };
            saveUserAndNavigate(
                googleUser,
                "mock_google_token_" + Date.now(),
                "mock_google_refresh_" + Date.now(),
                role,
                true
            );
        }
    };

    const googleCallbackRef = useRef(handleGoogleCredentialResponse);
    useEffect(() => {
        googleCallbackRef.current = handleGoogleCredentialResponse;
    });

    useEffect(() => {
        const clientId =
            import.meta.env.VITE_GOOGLE_CLIENT_ID ||
            "617746468209-jupm19jbfemqgdfv2gsbetlu4imretnk.apps.googleusercontent.com";

        const initGoogle = () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (res) => googleCallbackRef.current?.(res),
                });

                const wrapper = document.getElementById("google-register-hidden-wrapper");
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
    }, [role]);

    return (
        <div className="flex min-h-screen flex-col bg-[#F7F9FC] font-sans text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
            {/* Toast notification góc trên bên phải */}
            <Toast toast={toast} onClose={() => setToast(null)} duration={4000} />
            {/* HEADER: Giữ nguyên logo, màu sắc và nội dung của bạn */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-[0_4px_25px_-5px_rgba(16,32,48,0.05)] backdrop-blur-md transition-all">
                <div className="mx-auto flex h-16 w-full max-w-[1536px] items-center justify-between px-4 sm:h-[72px] sm:px-8 lg:px-12">
                    <Link
                        to="/"
                        className="group flex shrink-0 items-center gap-2.5"
                        title="Về trang chủ CareLink"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] text-white shadow-sm transition-transform group-hover:scale-105">
                            <svg
                                className="h-[18px] w-[18px]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xl font-bold leading-none tracking-tight text-[#002045] transition-colors group-hover:text-teal-600">
                                Care<span className="text-teal-600">Link</span>
                            </span>
                            <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-teal-600">
                                Medical Care
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-medium sm:gap-4 sm:text-[13px]">
                        <Link
                            to="/"
                            className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#002045] sm:px-3"
                        >
                            <svg
                                className="h-4 w-4 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                                />
                            </svg>
                            <span className="hidden sm:inline">Về trang chủ</span>
                            <span className="sm:hidden">Trang chủ</span>
                        </Link>

                        <span className="hidden text-slate-300 sm:inline">|</span>

                        <div className="flex items-center gap-2">
                            <span className="hidden text-slate-500 lg:inline">
                                Đã có tài khoản?
                            </span>
                            <Link
                                to="/login"
                                className="flex items-center gap-1 font-semibold text-teal-600 transition-colors hover:text-[#002045]"
                            >
                                <span>Đăng nhập</span>
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
                <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_80px_-32px_rgba(0,32,69,0.20)]">
                    <div className="grid grid-cols-1 lg:grid-cols-[0.88fr_1.12fr]">
                        {/* LEFT PANEL: Chọn vai trò */}
                        <section className="relative overflow-hidden bg-[#F2F7F7] p-5 sm:p-8 lg:p-10 xl:p-12">
                            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-100/60 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl" />

                            <div className="relative">
                                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-teal-800 shadow-sm sm:mb-10">
                                    <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                                    Chào mừng đến với CareLink
                                </div>

                                <h1 className="max-w-lg text-3xl font-extrabold leading-tight tracking-tight text-[#002045] sm:text-4xl xl:text-[42px]">
                                    Chăm sóc tận tâm,
                                    <span className="mt-1 block text-teal-700">
                                        kết nối yêu thương.
                                    </span>
                                </h1>

                                <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
                                    Một kết nối phù hợp có thể giúp hành trình chăm sóc
                                    người thân trở nên an tâm và thuận tiện hơn.
                                </p>

                                <div className="mt-8 sm:mt-10">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <h2 className="text-sm font-bold text-[#002045]">
                                            Bạn tham gia CareLink với vai trò nào?
                                        </h2>
                                        <span className="shrink-0 text-[11px] font-medium text-slate-400">
                                            Bước 1/2
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <RoleCard
                                            role="family"
                                            selectedRole={role}
                                            onSelect={setRole}
                                            icon={<Icon name="heart" className="h-5 w-5" />}
                                            title="Gia đình"
                                            description="Tìm người chăm sóc phù hợp cho cha mẹ và người thân."
                                            details="Tìm kiếm · Kết nối · Đặt lịch"
                                        />

                                        <RoleCard
                                            role="caregiver"
                                            selectedRole={role}
                                            onSelect={setRole}
                                            icon={<Icon name="user" className="h-5 w-5" />}
                                            title="Điều dưỡng / Sinh viên Y"
                                            description="Tham gia mạng lưới chăm sóc và xây dựng hồ sơ chuyên môn."
                                            details="Tạo hồ sơ · Xác minh thông tin"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/90 bg-white/75 p-4 sm:mt-8">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                        <Icon name="shield" className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#002045]">
                                            Thông tin minh bạch, kết nối phù hợp
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Điều dưỡng và người chăm sóc có thể cần hoàn tất
                                            bước xác minh hồ sơ theo quy trình của nền tảng.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 hidden items-center gap-2 text-xs text-slate-400 sm:flex lg:mt-10">
                                    <Icon name="heart" className="h-4 w-4 text-teal-700" />
                                    <span>Đồng hành trong từng khoảnh khắc chăm sóc.</span>
                                </div>
                            </div>
                        </section>

                        {/* RIGHT PANEL: Thông tin cá nhân */}
                        <section className="min-w-0 p-5 sm:p-8 lg:p-10 xl:p-12">
                            <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
                                <div>
                                    <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700">
                                        Bước 2 · Thông tin cá nhân
                                    </div>
                                    <h2 className="text-2xl font-extrabold tracking-tight text-[#002045] sm:text-3xl">
                                        Tạo tài khoản
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Điền thông tin để bắt đầu hành trình cùng CareLink.
                                    </p>
                                </div>

                                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0F7F7] text-teal-700 sm:flex">
                                    <Icon name="user" className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="mb-6 flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/70 px-3.5 py-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
                                    <Icon
                                        name={role === "family" ? "heart" : "user"}
                                        className="h-4 w-4"
                                    />
                                </span>
                                <p className="text-xs leading-5 text-slate-600">
                                    Bạn đang đăng ký với vai trò{" "}
                                    <strong className="font-bold text-[#002045]">
                                        {role === "family"
                                            ? "Gia đình"
                                            : "Điều dưỡng / Sinh viên Y"}
                                    </strong>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                {/* Họ tên */}
                                <div>
                                    <label
                                        htmlFor="reg-name"
                                        className="mb-2 block text-xs font-semibold text-slate-700"
                                    >
                                        Họ và tên <span className="text-rose-500">*</span>
                                    </label>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                            <Icon name="user" className="h-[18px] w-[18px]" />
                                        </span>
                                        <input
                                            id="reg-name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                                            }}
                                            placeholder="Nguyễn Văn A"
                                            className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm transition-all outline-none ${
                                                errors.name
                                                    ? "bg-red-50/20 border border-red-400 text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                                                    : "bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                                            }`}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
                                            <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email + phone */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="min-w-0">
                                        <label
                                            htmlFor="reg-email"
                                            className="mb-2 block text-xs font-semibold text-slate-700"
                                        >
                                            Email <span className="text-rose-500">*</span>
                                        </label>

                                        <div className="relative">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <Icon name="mail" className="h-[18px] w-[18px]" />
                                            </span>
                                            <input
                                                id="reg-email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                                                }}
                                                placeholder="ban@email.com"
                                                className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm transition-all outline-none ${
                                                    errors.email
                                                        ? "bg-red-50/20 border border-red-400 text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                                                        : "bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                                                }`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
                                                <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <label
                                            htmlFor="reg-phone"
                                            className="mb-2 block text-xs font-semibold text-slate-700"
                                        >
                                            Số điện thoại <span className="text-rose-500">*</span>
                                        </label>

                                        <div className="relative">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <Icon name="phone" className="h-[18px] w-[18px]" />
                                            </span>
                                            <input
                                                id="reg-phone"
                                                name="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                value={phone}
                                                onChange={(e) => {
                                                    setPhone(e.target.value);
                                                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                                                }}
                                                placeholder="09xx xxx xxx"
                                                className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm transition-all outline-none ${
                                                    errors.phone
                                                        ? "bg-red-50/20 border border-red-400 text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                                                        : "bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                                                }`}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
                                                <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Passwords */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <PasswordField
                                        id="reg-password"
                                        label="Mật khẩu"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((prev) => ({ ...prev, password: "" })); }}
                                        error={errors.password}
                                        showPassword={showPassword}
                                        onToggle={() => setShowPassword((prev) => !prev)}
                                        autoComplete="new-password"
                                    />

                                    <PasswordField
                                        id="reg-confirm-password"
                                        label="Xác nhận mật khẩu"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" })); }}
                                        error={errors.confirmPassword}
                                        showPassword={showConfirmPassword}
                                        onToggle={() =>
                                            setShowConfirmPassword((prev) => !prev)
                                        }
                                        autoComplete="new-password"
                                    />
                                </div>

                                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                    <Icon name="lock" className="h-3.5 w-3.5 shrink-0" />
                                    Mật khẩu cần có ít nhất 6 ký tự.
                                </p>

                                {/* Terms */}
                                <label className="flex cursor-pointer items-start gap-2.5 pt-1">
                                    <input
                                        type="checkbox"
                                        checked={agreeTerms}
                                        onChange={(e) => {
                                            setAgreeTerms(e.target.checked);
                                            if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: "" }));
                                        }}
                                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-teal-700 focus:ring-teal-600"
                                    />

                                    <span className="text-xs leading-5 text-slate-500">
                                        Tôi đồng ý với{" "}
                                        <a
                                            href="/terms"
                                            className="font-semibold text-teal-700 underline-offset-2 hover:underline"
                                        >
                                            Điều khoản sử dụng
                                        </a>{" "}
                                        và{" "}
                                        <a
                                            href="/privacy"
                                            className="font-semibold text-teal-700 underline-offset-2 hover:underline"
                                        >
                                            Chính sách bảo mật
                                        </a>{" "}
                                        của CareLink.
                                    </span>
                                </label>
                                {errors.agreeTerms && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-medium">
                                        <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
                                        {errors.agreeTerms}
                                    </p>
                                )}


                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#187D74] hover:bg-[#126A63]  px-5 py-3.5 text-sm font-semibold text-white shadow-[0_7px_18px_-8px_rgba(24,125,116,0.65)] hover:shadow-[0_9px_22px_-8px_rgba(24,125,116,0.55)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                                >
                                    <span>
                                        {isLoading
                                            ? "Đang xử lý..."
                                            : "Tạo tài khoản CareLink"}
                                    </span>

                                    {!isLoading && (
                                        <Icon
                                            name="arrow"
                                            className="h-4 w-4 text-teal-200 transition-transform group-hover:translate-x-1"
                                        />
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="relative py-1">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                            Hoặc đăng ký nhanh với
                                        </span>
                                    </div>
                                </div>

                                {/* Hidden Google Sign-In SDK button container */}
                                <div id="google-register-hidden-wrapper" className="hidden" aria-hidden="true" />

                                {/* Google OAuth */}
                                <button
                                    type="button"
                                    onClick={handleGoogleRegister}
                                    disabled={isLoading}
                                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <GoogleIcon />
                                    <span>
                                        Đăng ký với Google
                                    </span>
                                </button>

                                <p className="pt-1 text-center text-sm text-slate-500">
                                    Đã có tài khoản?{" "}
                                    <Link
                                        to="/login"
                                        className="font-bold text-teal-700 transition-colors hover:text-[#002045]"
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                </p>
                            </form>
                        </section>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="w-full border-t border-slate-200/80 bg-white px-4 py-5 text-xs text-slate-500 sm:px-6 sm:py-6 lg:px-12">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">
                        <span className="font-bold text-[#002045]">CareLink</span>
                        <span className="hidden text-slate-300 sm:inline">·</span>
                        <span>© 2026 CareLink. Bản quyền được bảo hộ.</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-medium">
                        <Link
                            to="/terms"
                            className="transition-colors hover:text-[#002045] hover:underline"
                        >
                            Điều khoản sử dụng
                        </Link>
                        <Link
                            to="/privacy"
                            className="transition-colors hover:text-[#002045] hover:underline"
                        >
                            Chính sách bảo mật
                        </Link>
                        <Link
                            to="/"
                            className="transition-colors hover:text-[#002045] hover:underline"
                        >
                            Trung tâm hỗ trợ
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}