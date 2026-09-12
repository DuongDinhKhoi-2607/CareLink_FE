import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const pathname = location.pathname;

    const navItems = [
        { name: "Trang chủ", path: "/", exact: true },
        { name: "Dành cho Gia đình", path: "/family", exact: false },
        { name: "Tìm người chăm sóc", path: "/family", exact: false },
        { name: "Dành cho Người chăm sóc", path: "#", exact: false },
        { name: "Tài nguyên", path: "#", exact: false },
    ];

    const isItemActive = (item) => {
        if (item.path === "#") return false;
        if (item.exact) return pathname === item.path;
        // Với "Dành cho Gia đình", kích hoạt khi đang ở /family
        if (item.name === "Dành cho Gia đình") return pathname === "/family";
        return false;
    };

    return (
        <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_25px_-5px_rgba(16,32,48,0.06)] sticky top-0 z-50 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                {/* Logo CareLink nổi bật và tinh tế */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-[#102030] tracking-tight group-hover:text-[#00677c] transition-colors leading-none">
                            Care<span className="text-[#00677c]">Link</span>
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">Medical Care</span>
                    </div>
                </Link>

                {/* Menu liên kết với hiệu ứng active nổi bật */}
                <nav className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => {
                        const active = isItemActive(item);
                        const isLink = item.path !== "#";

                        const linkClasses = `px-4 py-2 rounded-full text-sm transition-all flex items-center gap-1.5 ${
                            active
                                ? "bg-[#00677c]/10 text-[#00677c] font-bold shadow-xs"
                                : "text-slate-600 hover:text-[#00677c] hover:bg-slate-100/70 font-medium"
                        }`;

                        if (isLink) {
                            return (
                                <Link key={item.name} to={item.path} className={linkClasses}>
                                    {active && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00677c] animate-pulse" />
                                    )}
                                    {item.name}
                                </Link>
                            );
                        }

                        return (
                            <a key={item.name} href={item.path} className={linkClasses}>
                                {item.name}
                            </a>
                        );
                    })}
                </nav>

                {/* Nút đăng nhập / Đăng ký sắc nét */}
                <div className="flex items-center gap-3">
                    <button className="text-sm font-semibold text-slate-700 hover:text-[#00677c] px-3.5 py-2 rounded-xl hover:bg-slate-100/70 transition-colors">
                        Đăng nhập
                    </button>
                    <button className="px-5 py-2.5 text-sm font-semibold text-white bg-[#00677c] rounded-xl hover:bg-[#005263] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                        Tham gia ngay
                    </button>
                </div>
            </div>
        </header>
    );
}