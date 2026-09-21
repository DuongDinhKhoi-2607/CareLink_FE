import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import LogoutModal from "../components/LogoutModal";

const navItems = [
    {
        path: "/caregiver/dashboard",
        label: "Dashboard",
        badge: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
    },
    {
        path: "/caregiver/schedule",
        label: "Lịch làm việc",
        badge: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        ),
    },
    {
        path: "/caregiver/bookings",
        label: "Booking Requests",
        badge: 3,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
    },
    {
        path: "/caregiver/review",
        label: "Đánh giá",
        badge: null,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
        ),
    },
];

export default function CaregiverLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("carelink_user");
        setShowLogoutModal(false);
        setUserMenuOpen(false);
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans">
            {/* ── Top Bar ── */}
            <header className="h-16 bg-white border-b border-slate-200/80 shadow-xs sticky top-0 z-40 flex items-center px-4 sm:px-6 gap-4">
                {/* Mobile hamburger */}
                <button
                    className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Mở menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group shrink-0" title="Về trang chủ CareLink">
                    <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-[#102030] leading-none">
                            Care<span className="text-[#00677c]">Link</span>
                        </span>
                        <span className="text-[8.5px] tracking-widest text-[#00677c] uppercase font-semibold mt-0.5">Medical Care</span>
                    </div>
                </Link>

                <div className="flex-1" />

                {/* Verification badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-semibold text-amber-700 hidden sm:block">Đang xác minh</span>
                </div>

                {/* Avatar & User Dropdown with Logout */}
                <div className="relative flex items-center gap-2 pl-2">
                    <button
                        type="button"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2.5 cursor-pointer group p-1 rounded-xl hover:bg-slate-100 transition-colors"
                        title="Tài khoản Điều dưỡng"
                    >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                            N
                        </div>
                        <div className="hidden sm:flex flex-col text-left">
                            <span className="text-sm font-semibold text-[#102030] leading-tight">Nguyên</span>
                            <span className="text-xs text-slate-400 leading-tight">Caregiver</span>
                        </div>
                    </button>

                    {/* Nút đăng xuất nhanh màu đỏ */}
                    <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        className="w-8.5 h-8.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/80 flex items-center justify-center transition-all shadow-2xs cursor-pointer hover:scale-105 shrink-0"
                        title="Đăng xuất khỏi hệ thống"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                    </button>

                    {/* Dropdown Menu khi nhấn vào Avatar/Tên */}
                    {userMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50">
                                <div className="px-3.5 py-2 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-800">Nguyên</p>
                                    <p className="text-[11px] text-slate-400 truncate">caregiver@carelink.vn</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold text-[10px]">
                                        Vai trò: Caregiver
                                    </span>
                                </div>
                                <div className="py-1">
                                    <Link
                                        to="/"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-[#00677c] transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                        </svg>
                                        <span>Về trang chủ Website</span>
                                    </Link>
                                </div>
                                <div className="pt-1 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            setShowLogoutModal(true);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                                    >
                                        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                        <span>Đăng xuất tài khoản</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* ── Khung nội dung: Sidebar tự động kéo dài 100% theo nội dung từng trang (items-stretch + self-stretch) ── */}
            <div className="flex flex-1 items-stretch min-h-[calc(100vh-4rem)]">
                {/* ── DESKTOP SIDEBAR: Co giãn dài theo đúng độ dài nội dung, không có khoảng trống trắng phía dưới ── */}
                <aside className="hidden lg:flex flex-col w-64 bg-[#102030] shrink-0 self-stretch">
                    {/* Nav items */}
                    <nav className="flex flex-col gap-1 p-4 pt-6 flex-1">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 mb-2">Navigation</p>
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                                        active
                                            ? "bg-[#00677c] text-white shadow-lg shadow-[#00677c40]"
                                            : "text-white/60 hover:text-white hover:bg-white/10"
                                    }`}
                                >
                                    <span className={`transition-colors ${active ? "text-white" : "text-white/50 group-hover:text-white"}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-semibold flex-1">{item.label}</span>
                                    {item.badge && !active && (
                                        <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                            {item.badge}
                                        </span>
                                    )}
                                    {active && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom — Về trang chính */}
                    <div className="p-4 border-t border-white/10 shrink-0">
                        <button
                            type="button"
                            onClick={() => navigate("/caregiver")}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Về trang chính
                        </button>
                    </div>
                </aside>

                {/* ── MOBILE DRAWER OVERLAY ── */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden flex">
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <aside className="relative w-64 bg-[#102030] h-full flex flex-col z-10 shadow-2xl">
                            {/* Sidebar header (mobile) */}
                            <div className="h-16 flex items-center px-5 border-b border-white/10 shrink-0">
                                <span className="text-white font-bold text-lg">Menu</span>
                                <button
                                    type="button"
                                    className="ml-auto p-1.5 rounded-lg hover:bg-white/10 text-white/70 cursor-pointer"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Nav items */}
                            <nav className="flex flex-col gap-1 p-4 pt-6 flex-1 overflow-y-auto">
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 mb-2">Navigation</p>
                                {navItems.map((item) => {
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                                                active
                                                    ? "bg-[#00677c] text-white shadow-lg shadow-[#00677c40]"
                                                    : "text-white/60 hover:text-white hover:bg-white/10"
                                            }`}
                                        >
                                            <span className={`transition-colors ${active ? "text-white" : "text-white/50 group-hover:text-white"}`}>
                                                {item.icon}
                                            </span>
                                            <span className="text-sm font-semibold flex-1">{item.label}</span>
                                            {item.badge && !active && (
                                                <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Bottom — Về trang chính */}
                            <div className="p-4 border-t border-white/10 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSidebarOpen(false);
                                        navigate("/caregiver");
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                    Về trang chính
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                {/* ── Main Content ── */}
                <main className="flex-1 w-full">
                    <Outlet />
                </main>
            </div>

            {/* Popup xác nhận đăng xuất */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                roleName="tài khoản Điều dưỡng (Caregiver)"
            />
        </div>
    );
}
