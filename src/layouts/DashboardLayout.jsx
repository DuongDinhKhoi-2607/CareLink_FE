import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    ChevronsLeft,
    ChevronsRight,
    Home,
    LayoutGrid,
    LogOut,
    Menu,
    MessageSquare,
    PieChart,
    Plus,
    Settings,
    Users,
    Wallet,
} from "lucide-react";
import LogoutModal from "../components/LogoutModal";
import { NotificationDropdown } from "../features/shared/notifications";
import authApi, { fetchAndSyncUserMe } from "../api/authApi";

// 6 tính năng cốt lõi của Bảng điều khiển Gia đình (Đã tách nút Về trang chủ ra khu vực riêng để tránh bấm nhầm)
const navigationItems = [
    {
        path: "/dashboard",
        label: "Tổng quan",
        icon: <LayoutGrid className="w-5 h-5" strokeWidth={1.9} />,
    },
    {
        path: "/dashboard/appointments",
        label: "Lịch hẹn",
        icon: <Calendar className="w-5 h-5" strokeWidth={1.9} />,
    },
    {
        path: "/dashboard/relatives",
        label: "Người thân",
        icon: <Users className="w-5 h-5" strokeWidth={1.9} />,
    },
    {
        path: "/dashboard/health-reports",
        label: "Báo cáo sức khỏe",
        icon: <PieChart className="w-5 h-5" strokeWidth={1.9} />,
    },
    {
        path: "/dashboard/wallet",
        label: "Ví tiền",
        icon: <Wallet className="w-5 h-5" strokeWidth={1.9} />,
    },
    {
        path: "/dashboard/messages",
        label: "Tin nhắn",
        icon: <MessageSquare className="w-5 h-5" strokeWidth={1.9} />,
    },
    {
        path: "/dashboard/settings",
        label: "Cài đặt",
        icon: <Settings className="w-5 h-5" strokeWidth={1.9} />,
    },
];

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mainRef = useRef(null);

    const isMessagesTab = location.pathname.startsWith("/dashboard/messages");

    // Thông tin người dùng hiện tại từ localStorage
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const raw = localStorage.getItem("carelink_user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        const handleSync = () => {
            try {
                const raw = localStorage.getItem("carelink_user");
                setCurrentUser(raw ? JSON.parse(raw) : null);
            } catch {
                setCurrentUser(null);
            }
        };
        window.addEventListener("storage", handleSync);

        // Nạp và đồng bộ thông tin tài khoản Gia đình mới nhất từ API /users/me
        fetchAndSyncUserMe().then((u) => {
            if (u) setCurrentUser(u);
        });

        return () => window.removeEventListener("storage", handleSync);
    }, []);

    // Tự động cuộn lên đầu trang khi chuyển đổi giữa các tab dịch vụ trong Dashboard
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }
    }, [location.pathname]);

    // Lưu và giữ nguyên trạng thái thu gọn sidebar theo lựa chọn của người dùng (không bị tự bung ra khi chuyển tab)
    const [isCollapsed, setIsCollapsed] = useState(() => {
        try {
            return localStorage.getItem("carelink_family_sidebar_collapsed") === "true";
        } catch {
            return false;
        }
    });

    const handleToggleCollapse = (collapsed) => {
        setIsCollapsed(collapsed);
        try {
            localStorage.setItem("carelink_family_sidebar_collapsed", String(collapsed));
        } catch {
            // ignore
        }
    };

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch {
            // ignore
        }
        localStorage.removeItem("carelink_token");
        localStorage.removeItem("carelink_refresh_token");
        localStorage.removeItem("carelink_user");
        setShowLogoutModal(false);
        navigate("/");
    };

    return (
        <div className="min-h-screen md:h-screen bg-[#f7fafc] flex flex-col md:flex-row font-sans text-[#102030] antialiased md:overflow-hidden">
            {/* Sidebar bên trái: Chiều rộng 245px, màu sắc ngà ánh xanh dịu mắt, ấm áp chuẩn Gia đình */}
            <aside
                className={`w-full ${isCollapsed ? "md:w-[72px]" : "md:w-[245px]"
                    } bg-[#f0f5f7] border-r border-slate-200/80 flex flex-col shrink-0 transition-all duration-300 ease-in-out md:self-stretch md:h-screen`}
            >
                {/* Header của Sidebar */}
                {isCollapsed ? (
                    /* Trạng thái thu gọn: Chỉ hiện icon logo và nút mở rộng */
                    <div className="p-3.5 border-b border-slate-200/60 flex flex-col items-center gap-3">
                        <Link to="/" className="group cursor-pointer" title="Về trang chủ CareLink">
                            <img
                                src="/images/logo_remove.png"
                                alt="CareLink Logo"
                                className="w-9 h-9 object-contain drop-shadow-xs group-hover:scale-105 transition-transform shrink-0"
                            />
                        </Link>

                        {/* Notification Bell khi thu gọn */}
                        <NotificationDropdown userRole="family" align="left" />

                        {/* Nút Mở rộng Sidebar */}
                        <button
                            type="button"
                            onClick={() => handleToggleCollapse(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                            title="Mở rộng thanh bên (Sidebar)"
                            aria-label="Mở rộng thanh điều hướng"
                            aria-expanded={false}
                        >
                            <ChevronsRight className="w-4.5 h-4.5" />
                        </button>
                    </div>
                ) : (
                    /* Trạng thái mở rộng: Hiện đầy đủ Logo và nút Thu gọn nằm sát mép phải */
                    <div className="p-4 border-b border-slate-200/60 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 group cursor-pointer overflow-hidden">
                            <img
                                src="/images/logo_remove.png"
                                alt="CareLink Logo"
                                className="w-8.5 h-8.5 object-contain drop-shadow-xs group-hover:scale-105 transition-transform shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                                <span className="text-lg font-bold text-[#002045] tracking-tight group-hover:text-teal-600 transition-colors leading-none truncate">
                                    Care<span className="text-teal-600">Link</span>
                                </span>
                                <span className="text-[9.5px] tracking-wider text-slate-500 uppercase font-bold mt-0.5 truncate">
                                    BẢNG ĐIỀU KHIỂN
                                </span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-1.5">
                            {/* Notification Bell khi mở rộng */}
                            <NotificationDropdown userRole="family" align="left" />

                            {/* Nút Thu gọn Sidebar trên Desktop */}
                            <button
                                type="button"
                                onClick={() => handleToggleCollapse(true)}
                                className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                                title="Thu gọn thanh bên (Sidebar)"
                                aria-label="Thu gọn thanh điều hướng"
                                aria-expanded={true}
                            >
                                <ChevronsLeft className="w-4.5 h-4.5" />
                            </button>

                            {/* Nút Hamburger menu trên Mobile */}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 cursor-pointer"
                                aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
                                aria-expanded={mobileMenuOpen}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Danh sách mục điều hướng */}
                <nav
                    className={`flex-1 ${isCollapsed ? "px-2" : "px-3"
                        } py-4 flex flex-col gap-1.5 ${mobileMenuOpen ? "block" : "hidden md:flex"}`}
                >
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                title={item.label}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center ${isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
                                    } rounded-xl text-[13.5px] sm:text-[14px] font-semibold transition-all duration-200 active:scale-[0.98] group relative ${isActive
                                        ? "bg-gradient-to-r from-[#00677c] to-[#005566] text-white shadow-xs"
                                        : "text-slate-600 hover:bg-white hover:text-[#00677c] hover:translate-x-0.5"
                                    }`}
                            >
                                <div className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#00677c]"}`}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && <span className="truncate">{item.label}</span>}

                                {/* Tooltip hiển thị khi thanh bên đang ở trạng thái thu gọn */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#102030] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-lg">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}

                </nav>

                {/* Phần thông tin hồ sơ dưới cùng của Sidebar */}
                {isCollapsed ? (
                    /* Trạng thái thu gọn: Avatar, Đăng xuất, Thêm và Về trang chủ */
                    <div className="p-3 border-t border-slate-200/70 hidden md:flex flex-col items-center gap-2.5">
                        <div className="relative group cursor-pointer" title={currentUser?.name || currentUser?.fullName || "Tài khoản Gia đình"}>
                            <img
                                src={currentUser?.avatar || currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                                alt={currentUser?.name || currentUser?.fullName || "Tài khoản Gia đình"}
                                className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white shadow-2xs"
                            />
                            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#102030] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-lg">
                                {currentUser?.name || currentUser?.fullName || "Tài khoản Gia đình"}
                            </div>
                        </div>

                        {/* Nút Đăng xuất nhanh màu đỏ khi thu gọn */}
                        <button
                            type="button"
                            onClick={() => setShowLogoutModal(true)}
                            className="w-8.5 h-8.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                            title="Đăng xuất tài khoản"
                            aria-label="Đăng xuất tài khoản"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>

                        <Link
                            to="/dashboard/relatives"
                            title="Thêm Người Thân"
                            aria-label="Thêm Người Thân"
                            className="w-8.5 h-8.5 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white rounded-xl text-base font-semibold transition-all shadow-xs flex items-center justify-center cursor-pointer"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2.3} />
                        </Link>

                        {/* Nút Home khi thu gọn */}
                        <Link
                            to="/"
                            title="Về trang chủ CareLink"
                            aria-label="Về trang chủ CareLink"
                            className="w-8.5 h-8.5 rounded-xl text-slate-400 hover:text-[#00677c] hover:bg-slate-200/70 flex items-center justify-center transition-all cursor-pointer"
                        >
                            <Home className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    /* Trạng thái mở rộng đầy đủ */
                    <div
                        className={`p-4 border-t border-slate-200/70 flex flex-col gap-2.5 ${mobileMenuOpen ? "block" : "hidden md:flex"
                            }`}
                    >
                        {/* Profile card kèm nút Đăng xuất màu đỏ */}
                        <div className="flex items-center justify-between p-2.5 bg-[#e5e9eb80] rounded-2xl shadow-xs border border-slate-200/50">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                    src={currentUser?.avatar || currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                                    alt={currentUser?.name || currentUser?.fullName || "Người dùng"}
                                    className="w-9.5 h-9.5 rounded-full object-cover shrink-0 border border-white shadow-2xs"
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-[#181c1e] truncate">
                                        {currentUser?.name || currentUser?.fullName || "Tài khoản Gia đình"}
                                    </span>
                                    <span className="text-[9.5px] font-bold text-teal-700 tracking-wider uppercase truncate">
                                        {currentUser?.role === "family" || currentUser?.role === "customer"
                                            ? "TÀI KHOẢN GIA ĐÌNH"
                                            : (currentUser?.role || "GIA ĐÌNH")}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(true)}
                                className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 shrink-0"
                                title="Đăng xuất tài khoản"
                                aria-label="Đăng xuất tài khoản"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Nút + Thêm Người Thân */}
                        <Link
                            to="/dashboard/relatives"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full py-2 px-4 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                            <span>Thêm Người Thân</span>
                        </Link>

                        {/* Nút Về trang chủ đặt ngay dưới Thêm Người Thân, cực kỳ gọn gàng và tự nhiên */}
                        <Link
                            to="/"
                            title="Quay lại trang chủ CareLink"
                            className="w-full py-1.5 px-3 text-slate-500 hover:text-[#00677c] hover:bg-slate-200/60 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                            <span>Về trang chủ</span>
                        </Link>
                    </div>
                )}
            </aside>

            {/* Vùng nội dung chính: Tab tin nhắn giữ cố định màn hình, các tab khác cuộn tự nhiên mượt mà */}
            <main
                ref={mainRef}
                className={`flex-1 min-w-0 w-full h-full flex flex-col ${
                    isMessagesTab ? "overflow-hidden" : "overflow-y-auto"
                } transition-all duration-300`}
            >
                <div
                    key={location.pathname}
                    className={`animate-dashboard-tab w-full ${
                        isMessagesTab ? "h-full flex-1 flex flex-col min-h-0" : "min-h-full flex-1 flex flex-col"
                    }`}
                >
                    <Outlet />
                </div>
            </main>

            {/* Popup xác nhận đăng xuất cho Gia đình */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                roleName="tài khoản Gia đình"
            />
        </div>
    );
}