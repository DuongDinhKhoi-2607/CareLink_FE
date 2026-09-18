import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    // Trạng thái người dùng đã đăng nhập (lấy từ localStorage hoặc phiên làm việc)
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("carelink_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Lắng nghe thay đổi đường dẫn hoặc cập nhật từ tab khác
    useEffect(() => {
        try {
            const saved = localStorage.getItem("carelink_user");
            setUser(saved ? JSON.parse(saved) : null);
        } catch {
            setUser(null);
        }
        setShowUserDropdown(false);
        setMobileMenuOpen(false);
    }, [pathname]);

    // Xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("carelink_user");
        setUser(null);
        setShowUserDropdown(false);
        setMobileMenuOpen(false);
        navigate("/");
    };

    // Danh sách menu điều hướng CTA định hướng rõ ràng
    const navItems = [
        { name: "Trang chủ", path: "/", exact: true },
        { name: "Dành cho Gia đình", path: "/family", exact: false },
        { name: "Tìm Điều dưỡng", path: "/caregivers", exact: false },
        { name: "Trở thành Điều dưỡng", path: "/register", exact: false },
        { name: "Cẩm nang y tế", path: "#", exact: false },
    ];

    const isItemActive = (item) => {
        if (item.path === "#") return false;
        if (item.exact) return pathname === item.path;
        if (item.name === "Dành cho Gia đình") return pathname.startsWith("/family");
        if (item.name === "Tìm Điều dưỡng") return pathname.startsWith("/caregivers");
        return false;
    };

    return (
        <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_25px_-5px_rgba(16,32,48,0.05)] sticky top-0 z-50 transition-all">
            {/* Thanh chứa đẩy rộng sát 2 bên mép: Logo xích qua trái, Auth xích qua sát phải */}
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
                
                {/* 1. Logo CareLink nổi bật và tinh tế ở sát bên trái */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0" title="Về trang chủ CareLink">
                    <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                        <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-[#002045] tracking-tight group-hover:text-teal-600 transition-colors leading-none">
                            Care<span className="text-teal-600">Link</span>
                        </span>
                        <span className="text-[10px] tracking-widest text-teal-600 uppercase font-semibold mt-0.5">Medical Care</span>
                    </div>
                </Link>

                {/* 2. Menu liên kết ở giữa với font chữ vừa vặn thanh lịch (không bị to bè) */}
                <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                    {navItems.map((item) => {
                        const active = isItemActive(item);
                        const isLink = item.path !== "#";

                        const linkClasses = `px-3 py-1.5 rounded-full text-[13px] transition-all flex items-center gap-1.5 shrink-0 ${
                            active
                                ? "bg-teal-50 text-teal-700 font-semibold shadow-2xs"
                                : "text-slate-600 hover:text-teal-700 hover:bg-slate-100/70 font-medium"
                        }`;

                        if (isLink) {
                            return (
                                <Link key={item.name} to={item.path} className={linkClasses}>
                                    {active && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                                    )}
                                    <span>{item.name}</span>
                                    {item.name === "Trở thành Điều dưỡng" && (
                                        <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                            Tuyển dụng
                                        </span>
                                    )}
                                </Link>
                            );
                        }

                        return (
                            <a key={item.name} href={item.path} className={linkClasses}>
                                <span>{item.name}</span>
                            </a>
                        );
                    })}
                </nav>

                {/* 3. Khu vực Auth / Người dùng xích qua sát bên phải */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                    {user ? (
                        /* Trạng thái: ĐÃ ĐĂNG NHẬP */
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            {/* Chuông thông báo */}
                            <button
                                type="button"
                                title="Thông báo mới"
                                className="w-8.5 h-8.5 rounded-full flex items-center justify-center text-slate-500 hover:text-[#002045] hover:bg-slate-100 transition-colors relative cursor-pointer"
                            >
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </button>

                            {/* Avatar người dùng + Dropdown Menu */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200/90 hover:border-teal-500/40 bg-white hover:bg-slate-50/80 transition-all shadow-2xs cursor-pointer group"
                                >
                                    <img
                                        src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                                        alt={user.name || "Người dùng"}
                                        className="w-7.5 h-7.5 rounded-full object-cover ring-1 ring-teal-500/30 shrink-0"
                                    />
                                    <div className="hidden sm:flex flex-col text-left">
                                        <span className="text-xs font-bold text-[#002045] leading-tight max-w-[120px] truncate group-hover:text-teal-600 transition-colors">
                                            {user.name && user.name !== "user" ? user.name : (user.role === "caregiver" ? "ĐD. Minh Tâm" : "Gia đình Bác An")}
                                        </span>
                                        <span className="text-[10px] font-semibold text-teal-600 leading-none">
                                            {user.role === "caregiver" ? "Điều dưỡng" : "Gia đình"}
                                        </span>
                                    </div>
                                    <svg className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${showUserDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>

                                {/* Dropdown menu người dùng */}
                                {showUserDropdown && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setShowUserDropdown(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-page-enter">
                                            {/* Thẻ Profile thân thiện và ấm áp */}
                                            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                                                <img
                                                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                                                    alt="Avatar"
                                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/20 shrink-0"
                                                />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-bold text-[#002045] truncate">
                                                        {user.name && user.name !== "user" ? user.name : (user.role === "caregiver" ? "ĐD. Minh Tâm" : "Gia đình Bác An")}
                                                    </span>
                                                    <span className="inline-block w-fit mt-0.5 px-1.5 py-0.2 rounded-md bg-teal-50 text-teal-700 text-[10px] font-semibold">
                                                        {user.role === "caregiver" ? "🩺 Điều dưỡng / SV Y" : "🏠 Tài khoản Gia đình"}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 truncate mt-0.5">
                                                        {user.email && user.email !== "user@example.com" ? user.email : "giadinh@carelink.vn"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="py-1">
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                                    </svg>
                                                    <span>Bảng điều khiển</span>
                                                </Link>

                                                <Link
                                                    to="/dashboard/appointments"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                    </svg>
                                                    <span>Lịch hẹn của tôi</span>
                                                </Link>

                                                <Link
                                                    to="/dashboard/health-reports"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                                                    </svg>
                                                    <span>Báo cáo sức khỏe</span>
                                                </Link>
                                            </div>

                                            <div className="pt-1 border-t border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                                    </svg>
                                                    <span>Đăng xuất</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Trạng thái: CHƯA ĐĂNG NHẬP (Khách vãng lai) */
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                to="/login"
                                className="text-xs sm:text-[13px] font-semibold text-slate-700 hover:text-teal-700 px-3 py-1.5 rounded-xl hover:bg-slate-100/70 transition-colors"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-xs sm:text-[13px] font-semibold text-white bg-[#002045] hover:bg-[#002d60] rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5"
                            >
                                <span>Tham gia ngay</span>
                                <svg className="w-3.5 h-3.5 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    )}

                    {/* Nút Mobile Hamburger (3 gạch) */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Menu Dropdown hiển thị trên thiết bị di động (Mobile Menu) */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-slate-200/80 bg-white px-5 py-4 space-y-3 shadow-lg animate-page-enter">
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const active = isItemActive(item);
                            const isLink = item.path !== "#";

                            const mobileClasses = `px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                                active
                                    ? "bg-teal-50 text-teal-700 font-semibold"
                                    : "text-slate-700 hover:bg-slate-50"
                            }`;

                            if (isLink) {
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={mobileClasses}
                                    >
                                        <span>{item.name}</span>
                                        {active && <span className="w-2 h-2 rounded-full bg-teal-600" />}
                                    </Link>
                                );
                            }

                            return (
                                <a
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={mobileClasses}
                                >
                                    <span>{item.name}</span>
                                </a>
                            );
                        })}
                    </nav>

                    {/* Phân khu Auth trên Mobile */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-2 py-1">
                                    <img
                                        src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover ring-1 ring-teal-500/30"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-[#002045]">{user.name}</span>
                                        <span className="text-[11px] text-teal-600 font-medium">
                                            {user.role === "caregiver" ? "Điều dưỡng" : "Gia đình"}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full text-center py-2 px-3 bg-teal-50 text-teal-700 font-semibold text-xs rounded-xl border border-teal-200"
                                >
                                    Truy cập Bảng điều khiển
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full text-center py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center py-2 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center py-2 px-3 bg-[#002045] text-white rounded-xl text-xs font-semibold"
                                >
                                    Tham gia ngay
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}