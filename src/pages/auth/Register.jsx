
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import authApi, { GOOGLE_CLIENT_ID } from "../../api/authApi";
import Toast from "../../components/Toast";

/* =========================================================
   ICONS
========================================================= */
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
        stethoscope: (
            <>
                <path d="M4 3H3a1 1 0 0 0-1 1v5a6 6 0 0 0 12 0V4a1 1 0 0 0-1-1h-1" />
                <path d="M8 15v1a6 6 0 0 0 12 0v-4" />
                <circle cx="20" cy="10" r="2" />
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

    return <svg {...common}>{paths[name] || paths.user}</svg>;
}

function GoogleIcon() {
    return (
        <svg
            className="h-5 w-5 shrink-0"
            viewBox="0 0 48 48"
            aria-hidden="true"
        >
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

/* =========================================================
   SHARED FORM STYLES
========================================================= */
const inputBase =
    "h-11 w-full rounded-xl border pl-10 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400";

const inputNormal =
    "border-slate-200 bg-white hover:border-slate-300 focus:border-[#087F8C] focus:ring-4 focus:ring-[#087F8C]/10";

const inputError =
    "border-rose-400 bg-rose-50/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10";

function FieldError({ children }) {
    if (!children) return null;

    return (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium leading-relaxed text-rose-600">
            <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{children}</span>
        </p>
    );
}

/* =========================================================
   ROLE CARD
========================================================= */
function RoleCard({
    role,
    selectedRole,
    onSelect,
    icon,
    title,
    badge,
    description,
    tags,
}) {
    const selected = selectedRole === role;
    const isFamily = role === "family";

    return (
        <button
            type="button"
            onClick={() => onSelect(role)}
            aria-pressed={selected}
            className={`group relative w-full rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 ${selected
                ? isFamily
                    ? "border-emerald-300 bg-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.45)] ring-2 ring-emerald-400/25"
                    : "border-sky-300 bg-white shadow-[0_8px_24px_-12px_rgba(14,165,233,0.4)] ring-2 ring-sky-400/25"
                : "border-white/15 bg-white/[0.045] hover:border-white/30 hover:bg-white/[0.085] focus-visible:ring-white/20"
                }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${selected
                        ? isFamily
                            ? "bg-emerald-600 text-white"
                            : "bg-sky-600 text-white"
                        : "bg-white/10 text-slate-200 group-hover:bg-white/15"
                        }`}
                >
                    {icon}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p
                                className={`text-sm font-bold leading-5 ${selected
                                    ? "text-[#17313A]"
                                    : "text-white"
                                    }`}
                            >
                                {title}
                            </p>

                            <span
                                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${selected
                                    ? isFamily
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-sky-50 text-sky-700"
                                    : "bg-white/10 text-slate-300"
                                    }`}
                            >
                                {badge}
                            </span>
                        </div>

                        <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${selected
                                ? isFamily
                                    ? "border-emerald-600 bg-emerald-600 text-white"
                                    : "border-sky-600 bg-sky-600 text-white"
                                : "border-white/35 text-transparent"
                                }`}
                        >
                            <Icon name="check" className="h-3 w-3" />
                        </span>
                    </div>

                    <p
                        className={`mt-2 text-xs leading-relaxed ${selected ? "text-slate-600" : "text-slate-300"
                            }`}
                    >
                        {description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className={`rounded-md px-2 py-1 text-[10px] font-semibold ${selected
                                    ? isFamily
                                        ? "bg-emerald-50 text-emerald-800"
                                        : "bg-sky-50 text-sky-800"
                                    : "bg-white/[0.09] text-slate-300"
                                    }`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </button>
    );
}

/* =========================================================
   PASSWORD FIELD
========================================================= */
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
                className="mb-2 block text-xs font-bold text-slate-700"
            >
                {label} <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Icon name="lock" className="h-[18px] w-[18px]" />
                </span>

                <input
                    id={id}
                    name={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`${inputBase} ${error ? inputError : inputNormal
                        } pr-10`}
                />

                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                    }
                    className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-slate-400 transition-colors hover:text-[#087F8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#087F8C]"
                >
                    <Icon
                        name={showPassword ? "eyeOff" : "eye"}
                        className="h-[18px] w-[18px]"
                    />
                </button>
            </div>

            <FieldError>{error}</FieldError>
        </div>
    );
}

/* =========================================================
   REGISTER PAGE
========================================================= */
export default function Register() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Khởi tạo role từ query param ?role=family hoặc ?role=caregiver; nếu không truyền thì để null (không chọn mặc định)
    const initialRole = (() => {
        const r = searchParams.get("role")?.toLowerCase();
        if (r === "caregiver" || r === "nurse") return "caregiver";
        if (r === "family" || r === "customer") return "family";
        return null;
    })();

    const [role, setRole] = useState(initialRole);

    // Đồng bộ role khi query parameter thay đổi
    useEffect(() => {
        const r = searchParams.get("role")?.toLowerCase();
        if (r === "caregiver" || r === "nurse") {
            setRole("caregiver");
        } else if (r === "family" || r === "customer") {
            setRole("family");
        }
    }, [searchParams]);

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

    const isFamilyRole = role === "family";
    const isCaregiverRole = role === "caregiver";
    const selectedRoleLabel = isFamilyRole
        ? "Gia đình"
        : isCaregiverRole
        ? "Điều dưỡng / Sinh viên Y"
        : "Chưa chọn vai trò";

    /* VALIDATION */
    const validateForm = () => {
        const newErrors = {};

        if (!role) {
            newErrors.role = "Vui lòng chọn vai trò bạn muốn tham gia (Gia đình hoặc Điều dưỡng).";
        }

        if (!name.trim()) {
            newErrors.name = "Vui lòng nhập họ và tên của bạn.";
        }

        const emailTrimmed = email.trim();

        if (!emailTrimmed) {
            newErrors.email = "Vui lòng nhập địa chỉ email.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)
        ) {
            newErrors.email =
                "Định dạng email không hợp lệ (ví dụ: email@gmail.com).";
        }

        const phoneTrimmed = phone.trim();

        if (!phoneTrimmed) {
            newErrors.phone = "Vui lòng nhập số điện thoại liên hệ.";
        } else if (!/^(0|\+84)[0-9]{8,11}$/.test(phoneTrimmed)) {
            newErrors.phone =
                "Số điện thoại không hợp lệ (ví dụ: 0912345678).";
        }

        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu.";
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải từ 6 ký tự trở lên.";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword =
                "Vui lòng nhập lại mật khẩu xác nhận.";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword =
                "Mật khẩu xác nhận không trùng khớp.";
        }

        if (!agreeTerms) {
            newErrors.agreeTerms =
                "Vui lòng tích chọn đồng ý với Điều khoản và Chính sách bảo mật.";
        }

        setErrors(newErrors);
        if (newErrors.role) {
            setToast({
                type: "warning",
                title: "Chưa chọn vai trò",
                message: newErrors.role,
            });
        }
        return Object.keys(newErrors).length === 0;
    };

    /* SAVE USER + REDIRECT */
    const saveUserAndNavigate = (user, token, refreshToken) => {
        if (token) {
            localStorage.setItem("carelink_token", token);
        }

        if (refreshToken) {
            localStorage.setItem("carelink_refresh_token", refreshToken);
        }

        localStorage.setItem("carelink_user", JSON.stringify(user));

        setToast({
            type: "success",
            title: "Tạo tài khoản thành công!",
            message:
                "Chào mừng bạn đến với CareLink. Đang chuyển hướng về trang chủ...",
        });

        window.setTimeout(() => {
            if (user.role === "caregiver") {
                navigate("/caregiver/dashboard");
            } else if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        }, 1500);
    };

    /* REGISTER WITH EMAIL + PASSWORD */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast(null);

        if (!validateForm()) return;

        setIsLoading(true);

        const targetRole = role;
        const backendRole = role === "caregiver" ? 1 : 0;

        try {
            const res = await authApi.register({
                email: email.trim(),
                password,
                role: backendRole,
                fullName: name.trim(),
                phone: phone.trim(),
            });

            if (res && res.accessToken) {
                const effectiveFullName = res.user?.fullName || name.trim() || email.trim().split("@")[0];
                const effectivePhone = res.user?.phone || phone.trim();
                const userObj = {
                    id: res.user?.id,
                    name: effectiveFullName,
                    fullName: effectiveFullName,
                    email: res.user?.email || email.trim(),
                    phone: effectivePhone,
                    role: targetRole,
                    avatar:
                        res.user?.avatarUrl ||
                        (targetRole === "family"
                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                            : "/images/caregiver_avatar.svg"),
                };

                saveUserAndNavigate(
                    userObj,
                    res.accessToken,
                    res.refreshToken
                );
                return;
            }

            setIsLoading(false);
        } catch (err) {
            console.warn("[CareLink Auth] Register API trả về lỗi:", err);

            if (
                err.response?.status === 409 ||
                err.response?.data?.message?.includes(
                    "Email đã được sử dụng"
                )
            ) {
                setErrors((prev) => ({
                    ...prev,
                    email: "Email này đã được sử dụng trên hệ thống.",
                }));

                setToast({
                    type: "error",
                    title: "Email đã tồn tại",
                    message:
                        "Email này đã được đăng ký tài khoản. Vui lòng đăng nhập hoặc dùng email khác.",
                });

                setIsLoading(false);
                return;
            }

            if (err.code === "ERR_NETWORK" || !err.response) {
                const effectiveName =
                    name.trim() ||
                    (email.trim() ? email.trim().split("@")[0] : "Người dùng CareLink");
                const mockUser = {
                    name: effectiveName,
                    email: email.trim(),
                    phone: phone.trim(),
                    role: targetRole,
                    avatar:
                        targetRole === "family"
                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                            : "/images/caregiver_avatar.svg",
                };

                const mockToken = "mock_reg_token_" + Date.now();

                saveUserAndNavigate(mockUser, mockToken, mockToken);
                return;
            }

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

    /* GOOGLE REGISTER / LOGIN */
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
            const roleNumber =
                role === "caregiver" || role === "nurse" ? 1 : 0;

            const res = await authApi.googleLogin({
                idToken: response.credential,
                role: roleNumber,
            });

            const data = res?.data || res;
            const beRole = String(data.user?.role || "").toLowerCase();
            let targetRole = role === "caregiver" || role === "nurse" ? "caregiver" : "family";
            if (beRole.includes("nurse") || beRole.includes("caregiver")) {
                targetRole = "caregiver";
            } else if (beRole.includes("admin")) {
                targetRole = "admin";
            } else if (beRole.includes("customer") || beRole.includes("family")) {
                targetRole = "family";
            }

            const fallbackName =
                data.user?.fullName ||
                data.user?.name ||
                (data.user?.email ? data.user.email.split("@")[0] : "Người dùng Google");

            const userObj = {
                id: data.user?.id,
                name: fallbackName,
                email: data.user?.email || "google.user@carelink.vn",
                role: targetRole,
                avatar:
                    targetRole === "caregiver"
                        ? "/images/caregiver_avatar.svg"
                        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            };

            saveUserAndNavigate(
                userObj,
                data.accessToken,
                data.refreshToken
            );
        } catch (apiErr) {
            console.warn(
                "[CareLink Auth] Google Register API error:",
                apiErr
            );

            if (apiErr.code === "ERR_NETWORK" || !apiErr.response) {
                setToast({
                    type: "info",
                    title: "Chế độ trải nghiệm",
                    message:
                        "Không kết nối được Backend. Đang kích hoạt tài khoản Google...",
                });

                const googleUser = {
                    name: "Người dùng CareLink (Google)",
                    email: "user.google@carelink.vn",
                    role,
                    avatar:
                        role === "family"
                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                            : "/images/caregiver_avatar.svg",
                };

                saveUserAndNavigate(
                    googleUser,
                    "mock_google_token_" + Date.now(),
                    "mock_google_refresh_" + Date.now()
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

        // Bắt buộc người dùng phải chọn vai trò trước khi đăng ký bằng Google
        if (!role) {
            setToast({
                type: "warning",
                title: "Chưa chọn vai trò",
                message: "Vui lòng chọn vai trò bạn muốn tham gia (Gia đình hoặc Điều dưỡng) trước khi đăng ký bằng Google.",
            });
            setErrors((prev) => ({
                ...prev,
                role: "Vui lòng chọn vai trò bạn muốn tham gia.",
            }));
            return;
        }

        const hiddenBtn = document.querySelector(
            "#google-register-hidden-wrapper div[role=button]"
        );

        if (hiddenBtn) {
            hiddenBtn.click();
        } else if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isDismissedMoment()) {
                    setToast({
                        type: "warning",
                        title: "Đã hủy đăng ký Google",
                        message:
                            "Bạn vừa đóng cửa sổ Google. Vui lòng bấm lại nút nếu muốn tiếp tục đăng ký.",
                    });
                }
            });
        } else {
            setToast({
                type: "info",
                title: "Chế độ trải nghiệm",
                message:
                    "Không tải được Google Sign-In SDK. Đang đăng ký với tài khoản Google...",
            });

            const googleUser = {
                name: "Người dùng Google",
                email: "user.google@carelink.vn",
                role,
                avatar:
                    role === "family"
                        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        : "/images/caregiver_avatar.svg",
            };

            saveUserAndNavigate(
                googleUser,
                "mock_google_token_" + Date.now(),
                "mock_google_refresh_" + Date.now()
            );
        }
    };

    /* GOOGLE SDK INITIALIZATION */
    const googleCallbackRef = useRef(handleGoogleCredentialResponse);

    useEffect(() => {
        googleCallbackRef.current = handleGoogleCredentialResponse;
    });

    useEffect(() => {
        let timer;

        const initGoogle = () => {
            if (!window.google?.accounts?.id) return false;

            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (res) => googleCallbackRef.current?.(res),
            });

            const wrapper = document.getElementById(
                "google-register-hidden-wrapper"
            );

            if (wrapper) {
                wrapper.innerHTML = "";

                window.google.accounts.id.renderButton(wrapper, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                });
            }

            return true;
        };

        if (!initGoogle()) {
            timer = window.setInterval(() => {
                if (initGoogle()) {
                    window.clearInterval(timer);
                }
            }, 300);
        }

        return () => {
            if (timer) window.clearInterval(timer);
        };
    }, [role]);

    const getInputClass = (error) =>
        `${inputBase} ${error ? inputError : inputNormal}`;

    return (
        <div className="flex min-h-screen flex-col bg-[#F1F4F2] font-sans text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-950">
            <Toast
                toast={toast}
                onClose={() => setToast(null)}
                duration={4000}
            />

            {/* HEADER — Đồng bộ hoàn toàn kích thước, màu sắc & bố cục với trang Login */}
            <header className="sticky top-0 z-40 w-full shrink-0 border-b border-slate-200/70 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-[68px] sm:h-[72px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
                    {/* Logo CareLink y chang Login.jsx */}
                    <Link
                        to="/"
                        className="group flex shrink-0 items-center gap-2.5"
                        title="Về trang chủ CareLink"
                    >
                        <img
                            src="/images/logo_remove.png"
                            alt="CareLink Logo"
                            className="h-10 w-10 object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-[1.03] shrink-0"
                        />

                        <div className="flex flex-col">
                            <span className="text-xl font-bold leading-none tracking-tight text-[#002045]">
                                Care<span className="text-teal-600">Link</span>
                            </span>
                            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-600">
                                Medical Care
                            </span>
                        </div>
                    </Link>

                    {/* Về trang chủ | Đã có tài khoản? Đăng nhập → */}
                    <div className="flex items-center gap-2.5 sm:gap-4">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] sm:text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-teal-700 sm:px-3"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Về trang chủ</span>
                        </Link>

                        <span className="hidden sm:block h-5 w-px bg-slate-200" />

                        <div className="flex items-center gap-2">
                            <span className="hidden text-[13px] sm:text-sm text-slate-500 sm:inline">
                                Đã có tài khoản?
                            </span>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] sm:text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50 hover:text-teal-800"
                            >
                                <span>Đăng nhập</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN REGISTER CARD */}
            <main className="flex flex-1 items-center justify-center px-3 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-6">
                <div className="w-full max-w-[1240px] overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_24px_70px_-34px_rgba(23,49,58,0.24)] lg:rounded-[28px]">
                    <div className="grid grid-cols-1 lg:grid-cols-[0.96fr_1.04fr]">
                        {/* LEFT PANEL */}
                        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#315B60] via-[#285057] to-[#21434A] px-5 py-6 text-white sm:px-7 sm:py-8 lg:px-7 lg:py-7 xl:px-9">
                            {/* Background decoration */}
                            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" />
                                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-300/[0.10] blur-3xl" />
                                <div
                                    className="absolute inset-0 opacity-[0.045]"
                                    style={{
                                        backgroundImage:
                                            "radial-gradient(#ffffff 0.7px, transparent 0.7px)",
                                        backgroundSize: "18px 18px",
                                    }}
                                />
                            </div>

                            <div className="relative z-10">
                                {/* INTRO — no duplicate heart icon */}
                                <div className="mb-6 sm:mb-7 lg:mb-6">
                                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100/20 bg-white/[0.07] px-3 py-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.7)]" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-100 sm:text-[11px]">
                                            Nền tảng chăm sóc sức khỏe
                                        </span>
                                    </div>

                                    {/* Minimal accent instead of an icon tile */}
                                    <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-emerald-200 to-teal-400" />

                                    <h1 className="max-w-lg text-[27px] font-extrabold leading-[1.2] tracking-tight sm:text-[31px] xl:text-[34px]">
                                        Chăm sóc tận tâm,
                                        <span className="mt-1.5 block text-emerald-200">
                                            kết nối yêu thương.
                                        </span>
                                    </h1>

                                    <p className="mt-4 max-w-md text-[12px] leading-[1.85] text-slate-200/90 sm:text-[13px]">
                                        Kết nối gia đình với người chăm sóc phù
                                        hợp, để mỗi hành trình chăm sóc đều bắt
                                        đầu bằng sự an tâm và tin tưởng.
                                    </p>

                                    <div className="mt-5 flex items-center gap-3">
                                        <span className="h-px w-10 bg-emerald-300/70" />
                                        <span className="text-[10px] font-semibold tracking-wide text-emerald-100/90">
                                            Thấu hiểu · Đồng hành · An tâm
                                        </span>
                                    </div>
                                </div>

                                {/* ROLE SELECTION */}
                                <div className="mt-6 border-t border-white/15 pt-5 sm:mt-7 sm:pt-6 lg:mt-6 lg:pt-5">
                                    <div className="mb-3.5 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[13px] font-bold text-white">
                                                Bạn tham gia CareLink với vai trò nào?
                                            </p>
                                            <p className="mt-1 text-[11px] leading-relaxed text-slate-200/75">
                                                Chọn vai trò phù hợp với bạn.
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-lg border border-white/25 bg-white/15 px-2.5 py-1 text-[10.5px] font-bold tracking-wider text-white shadow-2xs backdrop-blur-sm">
                                            BƯỚC 1/2
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {errors.role && (
                                            <div className="flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-950/60 px-3.5 py-2.5 text-xs font-bold text-rose-200 shadow-sm animate-pulse">
                                                <Icon name="alert" className="h-4 w-4 shrink-0 text-rose-400" />
                                                <span>{errors.role}</span>
                                            </div>
                                        )}
                                        <RoleCard
                                            role="family"
                                            selectedRole={role}
                                            onSelect={(r) => {
                                                setRole(r);
                                                if (errors.role) {
                                                    setErrors((prev) => ({ ...prev, role: "" }));
                                                }
                                            }}
                                            icon={
                                                <Icon
                                                    name="heart"
                                                    className="h-5 w-5"
                                                />
                                            }
                                            title="Gia đình"
                                            badge="Khách hàng"
                                            description="Tìm người chăm sóc tận tâm, phù hợp với nhu cầu của cha mẹ và người thân."
                                            tags={[
                                                "Tìm người chăm sóc",
                                                "Đặt lịch hẹn",
                                            ]}
                                        />

                                        <RoleCard
                                            role="caregiver"
                                            selectedRole={role}
                                            onSelect={(r) => {
                                                setRole(r);
                                                if (errors.role) {
                                                    setErrors((prev) => ({ ...prev, role: "" }));
                                                }
                                            }}
                                            icon={
                                                <Icon
                                                    name="stethoscope"
                                                    className="h-5 w-5"
                                                />
                                            }
                                            title="Điều dưỡng / Sinh viên Y"
                                            badge="Người chăm sóc"
                                            description="Xây dựng hồ sơ chuyên môn và tiếp nhận lịch chăm sóc phù hợp."
                                            tags={[
                                                "Hồ sơ chuyên môn",
                                                "Nhận lịch chăm sóc",
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECURITY NOTE */}
                            <div className="relative z-10 mt-5 border-t border-white/15 pt-4 sm:mt-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-200/10 text-teal-100">
                                        <Icon name="shield" className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">
                                            An tâm trong từng kết nối
                                        </p>
                                        <p className="mt-1 text-[11px] leading-relaxed text-slate-200/75">
                                            Trải nghiệm chăm sóc minh bạch, an
                                            toàn và đáng tin cậy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* RIGHT PANEL */}
                        <section className="min-w-0 bg-[#FCFDFB] px-5 py-7 sm:px-7 sm:py-8 lg:px-8 lg:py-8 xl:px-9">
                            {/* FORM HEADING */}
                            <div className="mb-5 border-b border-slate-200/80 pb-5 sm:mb-6 sm:pb-5">
                                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#087F8C] sm:text-[11px]">
                                    BƯỚC 2 · THÔNG TIN TÀI KHOẢN
                                </p>
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-[25px] font-extrabold leading-tight tracking-tight text-[#17313A] sm:text-[28px]">
                                            Tạo tài khoản
                                        </h2>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                                            Hoàn tất thông tin để bắt đầu cùng CareLink.
                                        </p>
                                    </div>

                                    {/* SELECTED ROLE BADGE */}
                                    <div
                                        className={`flex shrink-0 items-center gap-2.5 rounded-2xl border px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-2xs transition-all ${
                                            !role
                                                ? "border-amber-200/90 bg-amber-50/90 text-amber-900"
                                                : isFamilyRole
                                                ? "border-emerald-200/90 bg-emerald-50/90 text-emerald-900"
                                                : "border-sky-200/90 bg-sky-50/90 text-sky-900"
                                        }`}
                                    >
                                        <span
                                            className={`flex h-8.5 w-8.5 items-center justify-center rounded-xl text-white shadow-xs ${
                                                !role
                                                    ? "bg-amber-500"
                                                    : isFamilyRole
                                                    ? "bg-emerald-600"
                                                    : "bg-sky-700"
                                            }`}
                                        >
                                            <Icon
                                                name={
                                                    !role
                                                        ? "user"
                                                        : isFamilyRole
                                                        ? "heart"
                                                        : "stethoscope"
                                                }
                                                className="h-4.5 w-4.5"
                                            />
                                        </span>
                                        <div className="hidden min-w-0 sm:block">
                                            <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                                                Vai trò
                                            </p>
                                            <p className="mt-0.5 max-w-[150px] text-xs sm:text-[12.5px] font-extrabold leading-snug text-[#17313A]">
                                                {selectedRoleLabel}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* REGISTRATION FORM */}
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="space-y-4 sm:space-y-[18px]"
                            >
                                {/* FULL NAME */}
                                <div>
                                    <label
                                        htmlFor="reg-name"
                                        className="mb-2 block text-xs font-bold text-slate-700"
                                    >
                                        Họ và tên{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                            <Icon
                                                name="user"
                                                className="h-[18px] w-[18px]"
                                            />
                                        </span>
                                        <input
                                            id="reg-name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                if (errors.name) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        name: "",
                                                    }));
                                                }
                                            }}
                                            placeholder={
                                                isFamilyRole
                                                    ? "Ví dụ: Nguyễn Văn An"
                                                    : "Ví dụ: Trần Thùy Linh"
                                            }
                                            className={getInputClass(errors.name)}
                                        />
                                    </div>
                                    <FieldError>{errors.name}</FieldError>
                                </div>

                                {/* EMAIL + PHONE */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="min-w-0">
                                        <label
                                            htmlFor="reg-email"
                                            className="mb-2 block text-xs font-bold text-slate-700"
                                        >
                                            Địa chỉ Email{" "}
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <Icon
                                                    name="mail"
                                                    className="h-[18px] w-[18px]"
                                                />
                                            </span>
                                            <input
                                                id="reg-email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (errors.email) {
                                                        setErrors((prev) => ({
                                                            ...prev,
                                                            email: "",
                                                        }));
                                                    }
                                                }}
                                                placeholder="ban@email.com"
                                                className={getInputClass(errors.email)}
                                            />
                                        </div>
                                        <FieldError>{errors.email}</FieldError>
                                    </div>

                                    <div className="min-w-0">
                                        <label
                                            htmlFor="reg-phone"
                                            className="mb-2 block text-xs font-bold text-slate-700"
                                        >
                                            Số điện thoại{" "}
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <Icon
                                                    name="phone"
                                                    className="h-[18px] w-[18px]"
                                                />
                                            </span>
                                            <input
                                                id="reg-phone"
                                                name="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                value={phone}
                                                onChange={(e) => {
                                                    setPhone(e.target.value);
                                                    if (errors.phone) {
                                                        setErrors((prev) => ({
                                                            ...prev,
                                                            phone: "",
                                                        }));
                                                    }
                                                }}
                                                placeholder="0912 xxx xxx"
                                                className={getInputClass(errors.phone)}
                                            />
                                        </div>
                                        <FieldError>{errors.phone}</FieldError>
                                    </div>
                                </div>

                                {/* PASSWORDS */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <PasswordField
                                        id="reg-password"
                                        label="Mật khẩu"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) {
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    password: "",
                                                }));
                                            }
                                        }}
                                        error={errors.password}
                                        showPassword={showPassword}
                                        onToggle={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        autoComplete="new-password"
                                    />

                                    <PasswordField
                                        id="reg-confirm-password"
                                        label="Xác nhận mật khẩu"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (errors.confirmPassword) {
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    confirmPassword: "",
                                                }));
                                            }
                                        }}
                                        error={errors.confirmPassword}
                                        showPassword={showConfirmPassword}
                                        onToggle={() =>
                                            setShowConfirmPassword((prev) => !prev)
                                        }
                                        autoComplete="new-password"
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                </div>

                                {/* TERMS */}
                                <div className="pt-0.5">
                                    <label className="flex cursor-pointer select-none items-start gap-2.5">
                                        <input
                                            type="checkbox"
                                            checked={agreeTerms}
                                            onChange={(e) => {
                                                setAgreeTerms(e.target.checked);
                                                if (errors.agreeTerms) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        agreeTerms: "",
                                                    }));
                                                }
                                            }}
                                            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-[#087F8C] focus:ring-[#087F8C]"
                                        />
                                        <span className="text-xs leading-5 text-slate-600">
                                            Tôi đồng ý với{" "}
                                            <Link
                                                to="/terms"
                                                className="font-bold text-[#087F8C] underline-offset-2 hover:underline"
                                            >
                                                Điều khoản sử dụng
                                            </Link>{" "}
                                            và{" "}
                                            <Link
                                                to="/privacy"
                                                className="font-bold text-[#087F8C] underline-offset-2 hover:underline"
                                            >
                                                Chính sách bảo mật
                                            </Link>{" "}
                                            của CareLink.
                                        </span>
                                    </label>
                                    <FieldError>{errors.agreeTerms}</FieldError>
                                </div>

                                {/* SUBMIT */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`group flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${isFamilyRole
                                        ? "bg-[#087F8C] shadow-[0_7px_18px_-7px_rgba(8,127,140,0.6)] hover:bg-[#076D77] hover:shadow-[0_9px_22px_-7px_rgba(8,127,140,0.55)] focus-visible:ring-emerald-500/25"
                                        : "bg-[#244F70] shadow-[0_7px_18px_-7px_rgba(36,79,112,0.55)] hover:bg-[#1C405D] hover:shadow-[0_9px_22px_-7px_rgba(36,79,112,0.5)] focus-visible:ring-sky-500/25"
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg
                                                className="h-4 w-4 animate-spin"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                aria-hidden="true"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-80"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                                                />
                                            </svg>
                                            <span>Đang khởi tạo tài khoản...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>
                                                {role
                                                    ? `Tạo tài khoản ${selectedRoleLabel}`
                                                    : "Tạo tài khoản CareLink"}
                                            </span>
                                            <Icon
                                                name="arrow"
                                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                            />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* GOOGLE REGISTRATION */}
                            <div className="mt-5 sm:mt-6">
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-x-0 top-1/2 border-t border-slate-200" />
                                    <span className="relative bg-[#FCFDFB] px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                        HOẶC
                                    </span>
                                </div>

                                <div
                                    id="google-register-hidden-wrapper"
                                    className="hidden"
                                    aria-hidden="true"
                                />

                                <button
                                    type="button"
                                    onClick={handleGoogleRegister}
                                    disabled={isLoading}
                                    className="mt-3.5 flex min-h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_22px_-14px_rgba(15,23,42,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <GoogleIcon />
                                    <span>Đăng ký nhanh bằng Google</span>
                                </button>

                                <p className="mt-4 text-center text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                                    Bạn đã có tài khoản CareLink?{" "}
                                    <Link
                                        to="/login"
                                        className="font-extrabold text-[#087F8C] underline-offset-4 hover:text-[#17313A] hover:underline"
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="shrink-0 border-t border-slate-200/80 bg-white/90 px-4 py-3.5 sm:px-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-slate-500 sm:justify-start sm:text-xs">
                        <span className="font-extrabold text-[#17313A]">
                            CareLink
                        </span>
                        <span className="hidden text-slate-300 sm:inline">·</span>
                        <span>© 2026 CareLink. Bản quyền được bảo hộ.</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-500 sm:text-xs">
                        <Link
                            to="/terms"
                            className="transition-colors hover:text-[#17313A] hover:underline"
                        >
                            Điều khoản sử dụng
                        </Link>
                        <Link
                            to="/privacy"
                            className="transition-colors hover:text-[#17313A] hover:underline"
                        >
                            Chính sách bảo mật
                        </Link>
                        <Link
                            to="/"
                            className="transition-colors hover:text-[#17313A] hover:underline"
                        >
                            Trung tâm hỗ trợ
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
