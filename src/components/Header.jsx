import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    ArrowRight,
    Calendar,
    ChevronDown,
    LayoutGrid,
    LogOut,
    Menu,
    PieChart,
    ShieldCheck,
    X,
} from "lucide-react";
import { NotificationDropdown } from "../features/shared/notifications";
import authApi, { fetchAndSyncUserMe } from "../api/authApi";

export default function Header() {
    const location = useLocation();
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
        const syncUser = () => {
            try {
                const saved = localStorage.getItem("carelink_user");
                setUser(saved ? JSON.parse(saved) : null);
            } catch {
                setUser(null);
            }
        };

        syncUser();
        window.addEventListener("storage", syncUser);

        // Nếu đã đăng nhập, đồng bộ dữ liệu mới nhất từ API /users/me
        if (localStorage.getItem("carelink_token")) {
            fetchAndSyncUserMe().then((updatedUser) => {
                if (updatedUser) setUser(updatedUser);
            });
        }

        setShowUserDropdown(false);
        setMobileMenuOpen(false);

        return () => window.removeEventListener("storage", syncUser);
    }, [pathname]);

    // Xử lý đăng xuất (Thu hồi token trên Backend và xóa phiên cục bộ)
    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch {
            // bỏ qua lỗi nếu token đã hết hạn
        }
        localStorage.removeItem("carelink_token");
        localStorage.removeItem("carelink_refresh_token");
        localStorage.removeItem("carelink_user");
        setUser(null);
        setShowUserDropdown(false);
        setMobileMenuOpen(false);
        if (window.location.pathname === "/") {
            window.location.reload();
        } else {
            window.location.href = "/";
        }
    };

    // Tên và email hiển thị an toàn, thân thiện
    const getDisplayName = () => {
        if (!user) return "Khách hàng";
        if (typeof user.name === "string" && user.name.trim() && user.name.toLowerCase() !== "user") {
            return user.name;
        }
        if (typeof user.fullName === "string" && user.fullName.trim()) {
            return user.fullName;
        }
        if (user.email) {
            return user.email.split("@")[0];
        }
        if (user.role === "caregiver") return "Điều dưỡng CareLink";
        if (user.role === "admin") return "Ban Quản trị CareLink";
        return "Khách hàng";
    };

    const getDisplayEmail = () => {
        if (!user) return "";
        if (typeof user.email === "string" && user.email.trim()) {
            return user.email;
        }
        return "";
    };

    // Avatar an toàn có fallback chuẩn SVG hoạt hình không bao giờ bị lỗi
    const getUserAvatar = () => {
        if (user?.role === "caregiver") {
            if (!user?.avatar || user.avatar.includes("unsplash.com") || user.avatar.includes("1594824813572") || user.avatar.includes("1594824813629")) {
                return "/images/caregiver_avatar.svg";
            }
            return user.avatar;
        }
        if (user?.role === "admin") {
            return user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80";
        }
        return user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
    };

    // Danh sách menu điều hướng CTA định hướng rõ ràng
    // Khi người dùng đăng nhập vai trò caregiver, ẩn nút "Dành cho Gia đình"
    // Khi người dùng đăng nhập vai trò family, ẩn nút "Dành cho Điều dưỡng"
    const navItems = [
        { name: "Trang chủ", path: "/", exact: true },
        ...(user?.role === "caregiver" ? [] : [{ name: "Dành cho Gia đình", path: "/family", exact: false }]),
        ...(user?.role === "family" ? [] : [{ name: "Dành cho Điều dưỡng", path: "/caregiver", exact: false }]),
        { name: "Cẩm nang y tế", path: "/handbook", exact: false },
    ];

    const isItemActive = (item) => {
        if (item.path === "#") return false;
        if (item.exact) return pathname === item.path;

        // Phân hệ Dành cho Gia đình: bao trọn hành trình tìm kiếm và đặt lịch của Gia đình
        if (item.name === "Dành cho Gia đình") {
            return (
                pathname.startsWith("/family") ||
                pathname.startsWith("/services") ||
                pathname.startsWith("/caregivers") ||
                pathname === "/chat" ||
                pathname === "/checkout" ||
                pathname === "/review"
            );
        }

        // Phân hệ Dành cho Điều dưỡng: chỉ active trên luồng tuyển dụng/hồ sơ của điều dưỡng
        if (item.name === "Dành cho Điều dưỡng") {
            return pathname === "/caregiver" || (pathname.startsWith("/caregiver/") && !pathname.startsWith("/caregivers"));
        }

        // Phân hệ Cẩm nang y tế: trang bài viết y khoa
        if (item.name === "Cẩm nang y tế") {
            return pathname.startsWith("/handbook");
        }

        return false;
    };

    return (
        <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_25px_-5px_rgba(16,32,48,0.05)] sticky top-0 z-50 transition-all">
            {/* Thanh chứa đẩy rộng sát 2 bên mép: Logo xích qua trái, Auth xích qua sát phải */}
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between">

                {/* 1. Logo CareLink nổi bật và tinh tế ở sát bên trái */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0" title="Về trang chủ CareLink">
                    <img
                        src="/images/logo_remove.png"
                        alt="CareLink Medical Care Logo"
                        className="w-10 h-10 object-contain drop-shadow-xs group-hover:scale-105 transition-transform shrink-0"
                    />
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

                        const linkClasses = `px-3 py-1.5 rounded-full text-[13px] transition-all flex items-center gap-1.5 shrink-0 ${active
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
                            {/* Chuông thông báo tương tác đa vai trò */}
                            <NotificationDropdown userRole={user?.role || "family"} align="right" />

                            {/* Avatar người dùng + Dropdown Menu */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    aria-label="Mở menu tài khoản"
                                    aria-expanded={showUserDropdown}
                                    aria-haspopup="menu"
                                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200/90 hover:border-teal-500/40 bg-white hover:bg-slate-50/80 transition-all shadow-2xs cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00677c]/30"
                                >
                                    <img
                                        src={getUserAvatar()}
                                        alt={user.name || "Người dùng"}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = user?.role === "caregiver" ? "/images/caregiver_avatar.svg" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                                        }}
                                        className="w-7.5 h-7.5 rounded-full object-cover ring-1 ring-teal-500/30 shrink-0 bg-teal-50"
                                    />
                                    <div className="hidden sm:flex flex-col text-left">
                                        <span className="text-xs font-bold text-[#002045] leading-tight max-w-[130px] truncate group-hover:text-teal-600 transition-colors">
                                            {getDisplayName()}
                                        </span>
                                        <span className="text-[10px] font-semibold text-teal-600 leading-none">
                                            {user.role === "caregiver" ? "Điều dưỡng" : user.role === "admin" ? "Administrator" : "Gia đình"}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${showUserDropdown ? "rotate-180" : ""}`} />
                                </button>

                                {/* Dropdown menu người dùng */}
                                {showUserDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowUserDropdown(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-page-enter">
                                            {/* Thẻ Profile thân thiện và ấm áp */}
                                            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                                                <img
                                                    src={getUserAvatar()}
                                                    alt="Avatar"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = user?.role === "caregiver" ? "/images/caregiver_avatar.svg" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                                                    }}
                                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/20 shrink-0 bg-teal-50"
                                                />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-bold text-[#002045] truncate">
                                                        {getDisplayName()}
                                                    </span>
                                                    <span className="inline-block w-fit mt-0.5 px-1.5 py-0.2 rounded-md bg-teal-50 text-teal-700 text-[10px] font-semibold">
                                                        {user.role === "caregiver" ? "🩺 Điều dưỡng / SV Y" : user.role === "admin" ? "🛡️ Administrator" : "🏠 Tài khoản Gia đình"}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 truncate mt-0.5">
                                                        {getDisplayEmail()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Danh sách liên kết điều hướng theo đúng Vai trò (Role) */}
                                            <div className="py-1">
                                                {user.role === "caregiver" ? (
                                                    /* Vai trò Caregiver: Chỉ hiện Bảng điều khiển Caregiver & Lịch làm việc */
                                                    <>
                                                        <Link
                                                            to="/caregiver/dashboard"
                                                            onClick={() => setShowUserDropdown(false)}
                                                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition-colors"
                                                        >
                                                            <LayoutGrid className="w-4 h-4 text-teal-600" />
                                                            <span>Bảng điều khiển Caregiver</span>
                                                        </Link>
                                                        <Link
                                                            to="/caregiver/schedule"
                                                            onClick={() => setShowUserDropdown(false)}
                                                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition-colors"
                                                        >
                                                            <Calendar className="w-4 h-4 text-teal-600" />
                                                            <span>Lịch làm việc của tôi</span>
                                                        </Link>
                                                    </>
                                                ) : user.role === "admin" ? (
                                                    /* Vai trò Admin: Chỉ hiện Cổng Quản trị */
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setShowUserDropdown(false)}
                                                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition-colors"
                                                    >
                                                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                                                        <span>Cổng Quản trị Hệ thống</span>
                                                    </Link>
                                                ) : (
                                                    /* Vai trò Gia đình (Family): Đầy đủ Bảng điều khiển, Lịch hẹn, Báo cáo sức khỏe */
                                                    <>
                                                        <Link
                                                            to="/dashboard"
                                                            onClick={() => setShowUserDropdown(false)}
                                                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition-colors"
                                                        >
                                                            <LayoutGrid className="w-4 h-4 text-teal-600" />
                                                            <span>Bảng điều khiển</span>
                                                        </Link>

                                                        <Link
                                                            to="/dashboard/appointments"
                                                            onClick={() => setShowUserDropdown(false)}
                                                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition-colors"
                                                        >
                                                            <Calendar className="w-4 h-4 text-teal-600" />
                                                            <span>Lịch hẹn</span>
                                                        </Link>

                                                        <Link
                                                            to="/dashboard/health-reports"
                                                            onClick={() => setShowUserDropdown(false)}
                                                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition-colors"
                                                        >
                                                            <PieChart className="w-4 h-4 text-teal-600" />
                                                            <span>Báo cáo sức khỏe</span>
                                                        </Link>
                                                    </>
                                                )}
                                            </div>

                                            <div className="pt-1 border-t border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                                                >
                                                    <LogOut className="w-4 h-4" />
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
                                className="px-4 py-2 text-xs sm:text-[13px] font-semibold text-white bg-[#00677c] hover:bg-[#005566] rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5"
                            >
                                <span>Tham gia ngay</span>
                                <ArrowRight className="w-3.5 h-3.5 text-teal-200" strokeWidth={2.2} />
                            </Link>
                        </div>
                    )}

                    {/* Nút Mobile Hamburger (3 gạch) */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00677c]/30"
                        aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5.5 h-5.5" />
                        ) : (
                            <Menu className="w-5.5 h-5.5" />
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

                            const mobileClasses = `px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${active
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
                                        src={getUserAvatar()}
                                        alt={user.name || "Người dùng"}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = user?.role === "caregiver" ? "/images/caregiver_avatar.svg" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                                        }}
                                        className="w-8 h-8 rounded-full object-cover ring-1 ring-teal-500/30 bg-teal-50"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-[#002045]">
                                            {getDisplayName()}
                                        </span>
                                        <span className="text-[11px] text-teal-600 font-medium">
                                            {user.role === "caregiver" ? "Điều dưỡng" : user.role === "admin" ? "Administrator" : "Gia đình"}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    to={user.role === "caregiver" ? "/caregiver/dashboard" : user.role === "admin" ? "/admin" : "/dashboard"}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full text-center py-2 px-3 bg-teal-50 text-teal-700 font-semibold text-xs rounded-xl border border-teal-200"
                                >
                                    {user.role === "caregiver" ? "Truy cập Bảng điều khiển" : user.role === "admin" ? "Truy cập Cổng Quản trị Admin" : "Truy cập Bảng điều khiển"}
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
                                    className="text-center py-2 px-3 bg-[#00677c] hover:bg-[#005566] text-white rounded-xl text-xs font-semibold shadow-sm"
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
