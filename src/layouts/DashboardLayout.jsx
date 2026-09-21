import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import LogoutModal from "../components/LogoutModal";

const navigationItems = [
    {
        path: "/dashboard",
        label: "Tổng quan",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ),
    },
    {
        path: "/dashboard/appointments",
        label: "Lịch hẹn",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        ),
    },
    {
        path: "/dashboard/relatives",
        label: "Người thân",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
    },
    {
        path: "/dashboard/health-reports",
        label: "Báo cáo sức khỏe",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
        ),
    },
    {
        path: "/chat",
        label: "Tin nhắn",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
        ),
    },
    {
        path: "/dashboard/settings",
        label: "Cài đặt",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // Trạng thái thu gọn/mở rộng thanh sidebar trên Desktop
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("carelink_user");
        setShowLogoutModal(false);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#f7fafc] flex flex-col md:flex-row font-sans text-[#102030] antialiased">
            {/* Sidebar bên trái hỗ trợ thu gọn mượt mà */}
            <aside
                className={`w-full ${
                    isCollapsed ? "md:w-20" : "md:w-64"
                } bg-[#f1f4f6] border-r border-[#c4c6cf4c] flex flex-col shrink-0 transition-all duration-300 ease-in-out md:self-stretch md:min-h-screen`}
            >
                {/* Header của Sidebar */}
                {isCollapsed ? (
                    /* Trạng thái thu gọn: Chỉ hiện icon logo và nút mở rộng */
                    <div className="p-4 border-b border-slate-200/60 flex flex-col items-center gap-3">
                        <Link to="/" className="group cursor-pointer" title="Về trang chủ CareLink">
                            <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                        </Link>

                        {/* Nút Mở rộng Sidebar */}
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                            title="Mở rộng thanh bên (Sidebar)"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    /* Trạng thái mở rộng: Hiện đầy đủ Logo và nút Thu gọn nằm sát mép phải */
                    <div className="p-4 sm:p-5 border-b border-slate-200/60 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer overflow-hidden">
                            <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xl font-bold text-[#002045] tracking-tight group-hover:text-teal-600 transition-colors leading-none truncate">
                                    Care<span className="text-teal-600">Link</span>
                                </span>
                                <span className="text-[10px] tracking-widest text-teal-600 uppercase font-semibold mt-0.5 truncate">
                                    Bảng điều khiển
                                </span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-1">
                            {/* Nút Thu gọn Sidebar trên Desktop (nằm sát bên phải thanh sidebar) */}
                            <button
                                type="button"
                                onClick={() => setIsCollapsed(true)}
                                className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                                title="Thu gọn thanh bên (Sidebar)"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            {/* Nút Hamburger menu trên Mobile */}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-200/60"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Danh sách mục điều hướng */}
                <nav
                    className={`flex-1 ${
                        isCollapsed ? "px-2" : "px-4"
                    } py-6 flex flex-col gap-1.5 ${mobileMenuOpen ? "block" : "hidden md:flex"}`}
                >
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                title={item.label}
                                className={`flex items-center ${
                                    isCollapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3"
                                } rounded-xl text-sm font-semibold transition-all group relative ${
                                    isActive
                                        ? "bg-[#4fd9fd] text-[#005c70] shadow-xs"
                                        : "text-[#43474e] hover:bg-white/80 hover:text-[#102030]"
                                }`}
                            >
                                <div className={`shrink-0 ${isActive ? "text-[#005c70]" : "text-[#43474e]"}`}>
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
                    /* Trạng thái thu gọn: Chỉ hiện Avatar, nút Đăng xuất nhanh và nút thêm */
                    <div className="p-3 border-t border-[#c4c6cf4c] hidden md:flex flex-col items-center gap-2.5">
                        <div className="relative group cursor-pointer" title="Gia đình Bác An">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                                alt="Gia đình Bác An"
                                className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white shadow-2xs"
                            />
                            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#102030] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 shadow-lg">
                                Gia đình Bác An
                            </div>
                        </div>

                        {/* Nút Đăng xuất nhanh màu đỏ khi thu gọn */}
                        <button
                            type="button"
                            onClick={() => setShowLogoutModal(true)}
                            className="w-8.5 h-8.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                            title="Đăng xuất tài khoản"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                        </button>

                        <Link
                            to="/dashboard/relatives"
                            title="Thêm Người Thân"
                            className="w-8.5 h-8.5 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white rounded-xl text-base font-semibold transition-all shadow-xs flex items-center justify-center cursor-pointer"
                        >
                            +
                        </Link>
                    </div>
                ) : (
                    /* Trạng thái mở rộng đầy đủ */
                    <div
                        className={`p-4 border-t border-[#c4c6cf4c] flex flex-col gap-2.5 ${
                            mobileMenuOpen ? "block" : "hidden md:flex"
                        }`}
                    >
                        {/* Profile card kèm nút Đăng xuất màu đỏ sang xịn đẹp */}
                        <div className="flex items-center justify-between p-2.5 bg-[#e5e9eb80] rounded-2xl shadow-xs border border-slate-200/50">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                                    alt="Gia đình Bác An"
                                    className="w-9.5 h-9.5 rounded-full object-cover shrink-0 border border-white shadow-2xs"
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-[#181c1e] truncate">Gia đình Bác An</span>
                                    <span className="text-[9.5px] font-bold text-teal-700 tracking-wider uppercase truncate">
                                        TÀI KHOẢN GIA ĐÌNH
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(true)}
                                className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 shrink-0"
                                title="Đăng xuất tài khoản"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                            </button>
                        </div>

                        <Link
                            to="/dashboard/relatives"
                            className="w-full py-2 px-4 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <span>+</span>
                            <span>Thêm Người Thân</span>
                        </Link>
                    </div>
                )}
            </aside>

            {/* Vùng nội dung chính: Tự động mở rộng khi sidebar thu gọn */}
            <main className="flex-1 w-full overflow-y-auto transition-all duration-300">
                <Outlet />
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