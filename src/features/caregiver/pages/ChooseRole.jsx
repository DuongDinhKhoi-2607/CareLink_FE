import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ─── Role card data ─── */
const roles = [
    {
        id: "student",
        badge: "Phù hợp với sinh viên",
        badgeColor: "bg-[#dbeef4] text-[#00677c]",
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
        ),
        title: "Sinh viên Y / Sinh viên Điều dưỡng",
        desc: "Dành cho sinh viên đang theo học tại các trường Đại học hoặc Cao đẳng Y, Điều dưỡng và mong muốn nhận các ca chăm sóc bán thời gian.",
        checklist: [
            "Xác minh CCCD",
            "Thẻ sinh viên còn hiệu lực",
            "Thông tin học tập",
            "Chứng chỉ bổ sung (nếu có)",
        ],
        btnLabel: "Tiếp tục với vai trò Sinh viên",
    },
    {
        id: "nurse",
        badge: "Phù hợp với điều dưỡng chuyên nghiệp",
        badgeColor: "bg-[#dbeef4] text-[#00677c]",
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
        ),
        title: "Điều dưỡng đã hành nghề",
        desc: "Dành cho điều dưỡng đã tốt nghiệp hoặc đang làm việc tại các bệnh viện, phòng khám hoặc cơ sở y tế.",
        checklist: [
            "Xác minh CCCD",
            "Chứng chỉ hành nghề",
            "Bằng tốt nghiệp",
            "Kinh nghiệm làm việc",
        ],
        btnLabel: "Tiếp tục với vai trò Điều dưỡng",
    },
];

const trustItems = [
    {
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        label: "Quy trình xác thực minh bạch",
    },
    {
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
        ),
        label: "Duyệt hồ sơ trong 24–48 giờ",
    },
    {
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
        label: "Bảo mật dữ liệu tiêu chuẩn HIPAA",
    },
];

/* ─── Component ─── */
export default function ChooseRole() {
    const navigate = useNavigate();
    const [hoveredRole, setHoveredRole] = useState(null);

    const handleChooseRole = (roleId) => {
        navigate(`/caregiver/verification?role=${roleId}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f4f8fa]">

            {/* ══ HEADER ══ */}
            <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-[#102030] tracking-tight">
                            Care<span className="text-[#00677c]">Link</span>
                        </span>
                    </Link>

                    {/* Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {[
                            { label: "Tìm người chăm sóc", to: "/caregivers" },
                            { label: "Dành cho Gia đình", to: "/family" },
                            { label: "Dành cho Người chăm sóc", to: "/caregiver", active: true },
                            { label: "Tài nguyên", to: "#" },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    item.active
                                        ? "text-[#00677c] font-semibold"
                                        : "text-slate-600 hover:text-[#00677c] hover:bg-slate-100/70"
                                }`}
                            >
                                {item.active && (
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00677c] mr-1.5 align-middle" />
                                )}
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth */}
                    <button
                        id="btn-login-choose-role"
                        className="px-5 py-2.5 bg-[#102030] text-white text-sm font-semibold rounded-xl hover:bg-[#1a3248] transition-all hover:-translate-y-0.5 shadow-sm"
                    >
                        Đăng nhập
                    </button>
                </div>
            </header>

            {/* ══ MAIN ══ */}
            <main className="flex-1 w-full py-14">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">

                    {/* Page heading */}
                    <div className="text-center flex flex-col gap-3 max-w-2xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#102030] tracking-tight">
                            Chọn vai trò người chăm sóc
                        </h1>
                        <p className="text-base text-slate-500 leading-relaxed">
                            CareLink hỗ trợ nhiều nhóm người chăm sóc khác nhau. Vui lòng chọn vai trò phù hợp để hệ thống hiển thị quy trình xác thực chính xác.
                        </p>
                    </div>

                    {/* Role cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                onMouseEnter={() => setHoveredRole(role.id)}
                                onMouseLeave={() => setHoveredRole(null)}
                                className={`relative bg-white rounded-2xl border p-7 flex flex-col gap-5 transition-all duration-300 ${
                                    hoveredRole === role.id
                                        ? "border-[#00677c]/40 shadow-lg shadow-[#00677c]/10 -translate-y-1"
                                        : "border-slate-200 shadow-sm"
                                }`}
                            >
                                {/* Badge */}
                                <div className="absolute top-5 right-5">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${role.badgeColor}`}>
                                        {role.badge}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className="w-13 h-13 w-12 h-12 rounded-xl bg-[#e8f4f8] text-[#00677c] flex items-center justify-center">
                                    {role.icon}
                                </div>

                                {/* Text */}
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-xl font-bold text-[#102030] pr-24">{role.title}</h2>
                                    <p className="text-sm text-slate-500 leading-relaxed">{role.desc}</p>
                                </div>

                                {/* Checklist */}
                                <ul className="flex flex-col gap-2">
                                    {role.checklist.map((item) => (
                                        <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <span className="w-5 h-5 rounded-full bg-[#e8f4f8] flex items-center justify-center shrink-0">
                                                <svg className="w-3 h-3 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA button */}
                                <button
                                    id={`btn-choose-role-${role.id}`}
                                    onClick={() => handleChooseRole(role.id)}
                                    className="w-full py-3.5 bg-[#102030] text-white rounded-xl font-semibold text-sm mt-2 hover:bg-[#00677c] transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-[#00677c]/30 hover:shadow-lg"
                                >
                                    {role.btnLabel}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Info box */}
                    <div className="bg-[#eef5f8] border border-[#c8dfe8] rounded-2xl p-5 flex items-start gap-4 max-w-2xl mx-auto w-full">
                        <div className="w-8 h-8 rounded-full bg-[#00677c]/15 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-bold text-[#102030]">Vì sao cần chọn đúng vai trò?</p>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Mỗi nhóm người chăm sóc có yêu cầu xác thực khác nhau. Việc lựa chọn đúng vai trò giúp CareLink rút ngắn thời gian xét duyệt và đảm bảo tính minh bạch cho các gia đình sử dụng dịch vụ.
                            </p>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 pt-2">
                        {trustItems.map((item) => (
                            <div key={item.label} className="flex items-center gap-2 text-slate-500">
                                <span className="text-[#00677c]">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* ══ FOOTER ══ */}
            <footer className="w-full bg-white border-t border-slate-200 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Logo + copyright */}
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-base font-bold text-[#102030]">
                            Care<span className="text-[#00677c]">Link</span>
                        </span>
                        <span className="text-xs text-slate-400">
                            © 2024 CareLink. All rights reserved. HIPAA Compliant Platform.
                        </span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-5">
                        {["Privacy Policy", "Terms of Service", "HIPAA Notice", "Contact Us"].map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="text-xs text-slate-500 hover:text-[#00677c] transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
