import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { ShieldAlert, UserCheck, Stethoscope, ArrowRight, LogIn, UserPlus, X } from "lucide-react";

const roles = [
    {
        id: "student",
        eyebrow: "Dành cho người đang đi học",
        title: "Sinh viên Y / Điều dưỡng",
        description:
            "Dành cho sinh viên ngành Y, Điều dưỡng đang theo học tại Đại học hoặc Cao đẳng và muốn nhận các ca chăm sóc phù hợp.",
        theme: {
            accent: "#087E8B",
            dark: "#075C66",
            soft: "#E8F6F7",
            border: "#A8DADD",
        },
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.5 9.2 12 4l9.5 5.2L12 14.4 2.5 9.2Z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.5 11.5v4.1c3.5 2.5 7.5 2.5 11 0v-4.1M21.5 9.2v5"
                />
            </svg>
        ),
        checklist: [
            "CCCD còn rõ thông tin",
            "Thẻ sinh viên còn hiệu lực",
            "Thông tin trường và ngành học",
            "Chứng chỉ bổ sung nếu có",
        ],
        button: "Tiếp tục với vai trò Sinh viên",
    },
    {
        id: "nurse",
        eyebrow: "Dành cho người đã hành nghề",
        title: "Điều dưỡng đã hành nghề",
        description:
            "Dành cho điều dưỡng đã tốt nghiệp, có hồ sơ chuyên môn và đang hoặc từng làm việc tại cơ sở y tế.",
        theme: {
            accent: "#6652A3",
            dark: "#49377F",
            soft: "#F1EDFA",
            border: "#C9BDEB",
        },
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3.5" y="7" width="17" height="13.5" rx="2.5" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M12 10v6m-3-3h6"
                />
            </svg>
        ),
        checklist: [
            "CCCD còn rõ thông tin",
            "Thông tin chứng chỉ hành nghề",
            "Bằng tốt nghiệp chuyên môn",
            "Thông tin kinh nghiệm làm việc",
        ],
        button: "Tiếp tục với vai trò Điều dưỡng",
    },
];

const trustItems = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.5 12 2.2 2.2 4.8-4.8"
                />
            </svg>
        ),
        label: "Quy trình xác thực rõ ràng",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 7v5l3.5 2" />
            </svg>
        ),
        label: "Thời gian xét duyệt dự kiến 24–48 giờ",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                />
            </svg>
        ),
        label: "Ưu tiên bảo mật thông tin",
    },
];

export default function ChooseRole() {
    const navigate = useNavigate();
    const [authModal, setAuthModal] = useState({ open: false, type: "unauthenticated", targetRole: "student" });

    const handleChooseRole = (roleId) => {
        const token = localStorage.getItem("carelink_token");
        const rawUser = localStorage.getItem("carelink_user");
        let user = null;
        try {
            user = rawUser ? JSON.parse(rawUser) : null;
        } catch {}

        // 1. Kiểm tra nếu chưa đăng nhập (khách vãng lai)
        if (!token) {
            setAuthModal({ open: true, type: "unauthenticated", targetRole: roleId });
            return;
        }

        // 2. Kiểm tra nếu người dùng đang đăng nhập với vai trò Customer (Gia đình)
        const role = user?.role?.toLowerCase();
        const roleIdNum = Number(user?.roleId);
        const isNurse = role === "nurse" || role === "caregiver" || roleIdNum === 3;

        if (!isNurse) {
            setAuthModal({ open: true, type: "wrong_role", targetRole: roleId });
            return;
        }

        // 3. Đã có tài khoản Điều dưỡng hợp lệ -> Chuyển sang bước xác minh
        navigate(`/caregiver/verification?role=${roleId}`);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F5F7FA] text-slate-800">
            <Header />

            <main className="flex-1 px-4 py-7 sm:px-6 sm:py-9">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-7">
                    {/* Heading */}
                    <header className="mx-auto max-w-2xl text-center">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            BẮT ĐẦU XÁC THỰC HỒ SƠ
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight text-[#152536] sm:text-4xl">
                            Bạn đang ở vai trò nào?
                        </h1>

                        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                            Chọn đúng nhóm để CareLink hướng dẫn bạn chuẩn bị giấy tờ
                            và thông tin phù hợp.
                        </p>
                    </header>

                    {/* Role cards */}
                    <section
                        aria-label="Chọn vai trò"
                        className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2"
                    >
                        {roles.map((role) => (
                            <article
                                key={role.id}
                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_3px_12px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_12px_28px_rgba(15,23,42,0.09)]"
                            >
                                <div
                                    className="h-1.5 w-full"
                                    style={{ backgroundColor: role.theme.accent }}
                                />

                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
                                            style={{
                                                backgroundColor: role.theme.soft,
                                                borderColor: role.theme.border,
                                                color: role.theme.accent,
                                            }}
                                        >
                                            <svg
                                                className="h-6 w-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                            >
                                                {role.id === "student" ? (
                                                    <>
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.5 9.2 12 4l9.5 5.2L12 14.4 2.5 9.2Z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6.5 11.5v4.1c3.5 2.5 7.5 2.5 11 0v-4.1M21.5 9.2v5"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <rect x="3.5" y="7" width="17" height="13.5" rx="2.5" />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M12 10v6m-3-3h6"
                                                        />
                                                    </>
                                                )}
                                            </svg>
                                        </div>

                                        <div className="min-w-0 flex-1 pt-0.5">
                                            <span
                                                className="inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold sm:text-xs"
                                                style={{
                                                    color: role.theme.dark,
                                                    backgroundColor: role.theme.soft,
                                                    borderColor: role.theme.border,
                                                }}
                                            >
                                                {role.eyebrow}
                                            </span>

                                            <h2 className="mt-2 text-lg font-extrabold leading-snug text-[#152536] sm:text-xl">
                                                {role.title}
                                            </h2>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm leading-6 text-slate-600">
                                        {role.description}
                                    </p>

                                    <div className="my-5 h-px bg-slate-200" />

                                    <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                                        Hồ sơ cần chuẩn bị
                                    </p>

                                    <ul className="flex flex-1 flex-col gap-3">
                                        {role.checklist.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-2.5 text-sm text-slate-700"
                                            >
                                                <span
                                                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                                                    style={{
                                                        backgroundColor: role.theme.soft,
                                                        color: role.theme.accent,
                                                    }}
                                                >
                                                    <svg
                                                        className="h-3.5 w-3.5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m5 12 4 4L19 6"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="leading-5">{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        id={`btn-choose-role-${role.id}`}
                                        type="button"
                                        onClick={() => handleChooseRole(role.id)}
                                        className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-offset-2 active:translate-y-0"
                                        style={{
                                            backgroundColor: role.theme.accent,
                                            "--tw-ring-color": `${role.theme.accent}35`,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = role.theme.dark;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = role.theme.accent;
                                        }}
                                    >
                                        {role.button}
                                        <svg
                                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 12h14m-6-6 6 6-6 6"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>

                    {/* Helpful note */}
                    <section className="flex items-start gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm sm:p-5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path strokeLinecap="round" d="M12 11v5m0-8h.01" />
                            </svg>
                        </span>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Chưa chắc nên chọn vai trò nào?
                            </h3>
                            <p className="mt-1 text-sm leading-5 text-slate-600">
                                Nếu bạn vẫn đang theo học ngành Y hoặc Điều dưỡng, hãy chọn
                                Sinh viên. Nếu đã tốt nghiệp và cần xác thực hồ sơ hành nghề,
                                hãy chọn Điều dưỡng đã hành nghề.
                            </p>
                        </div>
                    </section>

                    {/* Trust points */}
                    <div className="grid grid-cols-1 gap-3 border-t border-slate-300 pt-5 sm:grid-cols-3 sm:gap-4">
                        {trustItems.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center justify-center gap-2.5 text-center text-xs font-medium text-slate-600 sm:text-sm"
                            >
                                <span className="h-5 w-5 shrink-0 text-emerald-700">
                                    {React.cloneElement(item.icon, {
                                        className: "h-5 w-5",
                                    })}
                                </span>
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Modal cảnh báo yêu cầu tài khoản Điều dưỡng hoặc đúng vai trò */}
            {authModal.open && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setAuthModal((prev) => ({ ...prev, open: false }));
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
                    >
                        {/* Header Modal */}
                        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                                        authModal.type === "unauthenticated"
                                            ? "bg-[#eaf5f7] text-[#087E8B]"
                                            : "bg-amber-50 text-amber-600 border border-amber-200"
                                    }`}
                                >
                                    {authModal.type === "unauthenticated" ? (
                                        <Stethoscope className="h-6 w-6" />
                                    ) : (
                                        <ShieldAlert className="h-6 w-6" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900">
                                        {authModal.type === "unauthenticated"
                                            ? "Yêu cầu tài khoản Điều dưỡng"
                                            : "Tài khoản hiện tại là Khách hàng"}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Hệ thống quản lý xác thực CareLink
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAuthModal((prev) => ({ ...prev, open: false }))}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-5 sm:p-6 space-y-4">
                            {authModal.type === "unauthenticated" ? (
                                <>
                                    <p className="text-sm leading-relaxed text-slate-600">
                                        Để tham gia quy trình xác minh hồ sơ năng lực và nhận ca chăm sóc trên CareLink, bạn cần có tài khoản dành cho <strong>Điều dưỡng</strong> hoặc <strong>Sinh viên Y</strong>.
                                    </p>
                                    <div className="rounded-2xl border border-[#cbe4e8] bg-[#f0f8fa] p-3.5 text-xs text-[#065b65] space-y-1.5">
                                        <div className="flex items-center gap-2 font-bold text-[#087E8B]">
                                            <UserCheck className="h-4 w-4 shrink-0" />
                                            <span>Bạn chưa đăng nhập?</span>
                                        </div>
                                        <p className="leading-relaxed">
                                            Vui lòng tạo tài khoản mới với vai trò Điều dưỡng hoặc đăng nhập nếu bạn đã có tài khoản từ trước.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm leading-relaxed text-slate-600">
                                        Bạn đang đăng nhập bằng tài khoản <strong>Gia đình / Khách hàng</strong>. Quy trình nộp hồ sơ này chỉ dành riêng cho tài khoản <strong>Điều dưỡng</strong> hoặc <strong>Sinh viên Y</strong>.
                                    </p>
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 leading-relaxed">
                                        Vui lòng đăng xuất khỏi tài khoản hiện tại để đăng ký tài khoản Điều dưỡng riêng biệt, hoặc quay lại khu vực dành cho Gia đình.
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                            <button
                                type="button"
                                onClick={() => setAuthModal((prev) => ({ ...prev, open: false }))}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                            >
                                {authModal.type === "unauthenticated" ? "Để sau" : "Đóng"}
                            </button>

                            {authModal.type === "unauthenticated" ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            navigate(`/login?redirect=${encodeURIComponent(`/caregiver/choose-role`)}`);
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#087E8B] transition"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Đăng nhập
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            navigate("/register?role=nurse");
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#087E8B] text-xs font-bold text-white shadow-sm hover:bg-[#066274] transition"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Đăng ký Điều dưỡng
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            navigate("/family");
                                        }}
                                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                    >
                                        Về trang Gia đình
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            localStorage.removeItem("carelink_token");
                                            localStorage.removeItem("carelink_user");
                                            navigate("/register?role=nurse");
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
                                    >
                                        Đăng xuất & Tạo tài khoản mới
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}