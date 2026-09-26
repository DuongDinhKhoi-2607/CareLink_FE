import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    UserCheck,
    BriefcaseMedical,
    Calendar,
    Users,
    Wallet,
    Settings,
    Home,
    Search,
    Bell,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
    ChevronRight,
    Plus,
    LogOut,
} from "lucide-react";
import LogoutModal from "../components/LogoutModal";

const adminNavItems = [
    {
        path: "/admin",
        aliases: ["/admin", "/admin/dashboard"],
        label: "Tổng quan",
        icon: <LayoutDashboard className="w-5 h-5 shrink-0" strokeWidth={1.9} />,
    },
    {
        path: "/admin/approvals",
        aliases: ["/admin/approvals"],
        label: "Duyệt điều dưỡng",
        badge: 12,
        icon: <UserCheck className="w-5 h-5 shrink-0" strokeWidth={1.9} />,
    },
    {
        path: "/admin/services",
        aliases: ["/admin/services"],
        label: "Dịch vụ",
        icon: <BriefcaseMedical className="w-5 h-5 shrink-0" strokeWidth={1.9} />,
    },
    {
        path: "/admin/appointments",
        aliases: ["/admin/appointments"],
        label: "Lịch hẹn",
        icon: <Calendar className="w-5 h-5 shrink-0" strokeWidth={1.9} />,
    },
    {
        path: "/admin/users",
        aliases: ["/admin/users"],
        label: "Người dùng",
        icon: <Users className="w-5 h-5 shrink-0" strokeWidth={1.9} />,
    },
    {
        path: "/admin/finance",
        aliases: ["/admin/finance"],
        label: "Tài chính",
        icon: <Wallet className="w-5 h-5 shrink-0" strokeWidth={1.9} />,
    },
];

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("carelink_user");
        setShowLogoutModal(false);
        setUserMenuOpen(false);
        navigate("/");
    };

    // Xử lý active item chính xác
    const isCurrentActive = (item) => {
        if (item.path === "/admin") {
            return location.pathname === "/admin" || location.pathname === "/admin/dashboard";
        }
        return location.pathname.startsWith(item.path);
    };

    // Tạo breadcrumb tương ứng
    const getBreadcrumbTitle = () => {
        const currentItem = adminNavItems.find((item) => isCurrentActive(item));
        return currentItem ? currentItem.label : "Quản trị";
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800 antialiased">
            {/* ── TOP HEADER ── */}
            <header className="h-16 bg-white border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Mobile Hamburger toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Mở menu di động"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Breadcrumbs thuần Tiếng Việt sát lề trái thanh lịch */}
                    <nav className="flex items-center gap-2 text-xs sm:text-sm">
                        <Link to="/" className="text-slate-400 hover:text-[#00677c] transition-colors flex items-center gap-1.5 font-medium">
                            <Home className="w-3.5 h-3.5" />
                            Trang chủ
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <Link to="/admin" className="text-slate-500 hover:text-[#00677c] transition-colors font-medium">
                            Cổng Quản trị
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="text-[#00677c] font-bold">{getBreadcrumbTitle()}</span>
                    </nav>
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Search box */}
                    <div className="relative hidden md:block w-56 lg:w-72">
                        <input
                            type="text"
                            placeholder="Tìm nhanh trên hệ thống..."
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c] transition-all"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
                    </div>

                    {/* Notification Bell */}
                    <button
                        type="button"
                        className="relative p-2 rounded-xl text-slate-500 hover:text-[#00677c] hover:bg-teal-50 transition-colors cursor-pointer"
                        title="12 thông báo mới"
                    >
                        <Bell className="w-5 h-5" strokeWidth={1.9} />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                    </button>

                    {/* Admin Profile Chip with Logout Dropdown & Quick Logout Button */}
                    <div className="relative flex items-center gap-2 pl-2 border-l border-slate-200">
                        <button
                            type="button"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group text-left"
                            title="Tài khoản quản trị viên"
                        >
                            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 text-[#00677c] font-black text-xs flex items-center justify-center border border-teal-200 shadow-2xs group-hover:scale-105 transition-transform">
                                AD
                            </div>
                            <div className="hidden sm:block text-left">
                                <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                    Ban Quản trị CareLink
                                </div>
                                <div className="text-[10px] text-teal-700 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Administrator
                                </div>
                            </div>
                        </button>

                        {/* Nút đăng xuất nhanh màu đỏ */}
                        <button
                            type="button"
                            onClick={() => setShowLogoutModal(true)}
                            className="w-8.5 h-8.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/80 flex items-center justify-center transition-all shadow-2xs cursor-pointer hover:scale-105 shrink-0"
                            title="Đăng xuất khỏi hệ thống"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>

                        {/* Menu Dropdown khi nhấn vào Avatar/Tên */}
                        {userMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50">
                                    <div className="px-3.5 py-2 border-b border-slate-100">
                                        <p className="text-xs font-bold text-slate-800">Ban Quản trị CareLink</p>
                                        <p className="text-[11px] text-slate-400 truncate">admin@carelink.vn</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold text-[10px]">
                                            Vai trò: Administrator
                                        </span>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            to="/"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-[#00677c] transition-colors"
                                        >
                                            <Home className="w-4 h-4 text-slate-400" />
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
                                            <LogOut className="w-4 h-4 text-rose-500" />
                                            <span>Đăng xuất tài khoản</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* ── BODY (SIDEBAR + MAIN CONTENT: Sidebar kéo dài tự nhiên theo nội dung từng trang) ── */}
            <div className="flex flex-1 items-stretch min-h-[calc(100vh-4rem)]">
                {/* ── DESKTOP SIDEBAR: Tự động co giãn dài theo đúng độ dài nội dung của trang, bắt đầu sát dưới header ── */}
                <aside
                    className={`hidden lg:flex flex-col bg-[#1c2a38] border-r border-[#2a3c4e] shadow-[4px_0_15px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out shrink-0 self-stretch ${
                        isCollapsed ? "w-20" : "w-64"
                    }`}
                >
                    {/* Brand Banner - Logo chuẩn CareLink kèm nút Toggle ngay bên trong góc phải */}
                    <div
                        className={`h-16 flex items-center border-b border-[#2a3c4e]/80 overflow-hidden transition-all ${
                            isCollapsed ? "justify-center px-2" : "justify-between px-4"
                        }`}
                    >
                        {!isCollapsed ? (
                            <>
                                <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden group">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00677c] to-[#008ba3] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                                        <Plus className="w-4.5 h-4.5 text-white" strokeWidth={2.6} />
                                    </div>
                                    <div className="flex flex-col truncate leading-tight">
                                        <span className="text-lg font-bold text-white tracking-tight group-hover:text-teal-300 transition-colors leading-none">
                                            Care<span className="text-teal-400">Link</span>
                                        </span>
                                        <span className="text-[9px] tracking-widest text-teal-400 uppercase font-bold mt-1">
                                            ADMIN PORTAL
                                        </span>
                                    </div>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setIsCollapsed(true)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer shrink-0"
                                    title="Thu gọn thanh menu"
                                >
                                    <PanelLeftClose className="w-4.5 h-4.5" />
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsCollapsed(false)}
                                className="w-10 h-10 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 flex items-center justify-center transition-colors cursor-pointer border border-teal-500/30 shadow-2xs"
                                title="Mở rộng thanh menu"
                            >
                                <PanelLeftOpen className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
                        {!isCollapsed && (
                            <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400/80 uppercase tracking-widest">
                                Quản trị hệ thống
                            </div>
                        )}
                        {adminNavItems.map((item) => {
                            const active = isCurrentActive(item);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                                        active
                                            ? "bg-teal-500/20 text-teal-300 font-semibold shadow-xs"
                                            : "text-slate-300 hover:text-white hover:bg-white/8"
                                    } ${isCollapsed ? "justify-center" : ""}`}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <span className={active ? "text-teal-400" : "text-slate-400 group-hover:text-slate-200"}>
                                        {item.icon}
                                    </span>
                                    {!isCollapsed && <span className="truncate">{item.label}</span>}

                                    {/* Badge count */}
                                    {item.badge && (
                                        <span
                                            className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                                                isCollapsed
                                                    ? "absolute top-1 right-1 w-2 h-2 p-0 bg-rose-500 rounded-full"
                                                    : "ml-auto bg-teal-500/25 text-teal-300 border border-teal-400/30"
                                            }`}
                                        >
                                            {!isCollapsed && item.badge}
                                        </span>
                                    )}

                                    {/* Active border indicator */}
                                    {active && (
                                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-teal-400 rounded-r-full shadow-[0_0_8px_rgba(45,212,191,0.6)]"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer — Đã lược bỏ nút Đăng xuất vì góc trên bên phải đã có nút exit */}
                    <div className="p-3 border-t border-[#2a3c4e]/80 space-y-1">
                        <Link
                            to="/admin"
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/8 transition-colors ${
                                isCollapsed ? "justify-center" : ""
                            }`}
                            title="Cài đặt hệ thống"
                        >
                            <Settings className="w-4 h-4 shrink-0 text-slate-400" />
                            {!isCollapsed && <span>Cài đặt hệ thống</span>}
                        </Link>
                        <Link
                            to="/"
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-teal-300 hover:bg-white/8 transition-colors ${
                                isCollapsed ? "justify-center" : ""
                            }`}
                            title="Về Website CareLink"
                        >
                            <Home className="w-4 h-4 shrink-0 text-slate-400" />
                            {!isCollapsed && <span>Về trang chủ</span>}
                        </Link>
                    </div>
                </aside>

                {/* ── MOBILE DRAWER OVERLAY ── */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden flex">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)}></div>
                        <div className="relative w-72 bg-[#1c2a38] text-white h-full flex flex-col shadow-2xl z-10 border-r border-[#2a3c4e]">
                            <div className="h-16 flex items-center justify-between px-5 border-b border-[#2a3c4e]/80">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00677c] to-[#008ba3] flex items-center justify-center text-white shadow-xs">
                                        <Plus className="w-4 h-4 text-white" strokeWidth={2.6} />
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-white">Care<span className="text-teal-400">Link</span></div>
                                        <div className="text-[9px] font-bold text-teal-400 uppercase">ADMIN PORTAL</div>
                                    </div>
                                </div>
                                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                                {adminNavItems.map((item) => {
                                    const active = isCurrentActive(item);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                                                active ? "bg-teal-500/20 text-teal-300 font-semibold" : "text-slate-300 hover:bg-white/8"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={active ? "text-teal-400" : "text-slate-400"}>{item.icon}</span>
                                                <span>{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/25 text-teal-300 border border-teal-400/30">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                )}

                {/* ── MAIN CONTENT OUTLET: Tự do co giãn theo nội dung từng trang ── */}
                <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Popup xác nhận đăng xuất cho Quản trị viên */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                roleName="tài khoản Quản trị viên (Admin)"
            />
        </div>
    );
}
