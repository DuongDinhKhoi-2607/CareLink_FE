import React from "react";

export default function Header() {
    return (
        <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <span className="text-2xl font-bold text-blue-900 tracking-tight">CareLink</span>
                </div>

                {/* Menu liên kết */}
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-900 transition-colors">
                        Tìm người chăm sóc
                    </a>
                    <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-900 transition-colors">
                        Dành cho Gia đình
                    </a>
                    <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-900 transition-colors">
                        Dành cho Người chăm sóc
                    </a>
                    <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-900 transition-colors">
                        Tài nguyên
                    </a>
                </nav>

                {/* Nút đăng nhập / Đăng ký */}
                <div className="flex items-center gap-4">
                    <button className="text-sm font-medium text-gray-700 hover:text-blue-900">
                        Đăng nhập
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors">
                        Tham gia ngay
                    </button>
                </div>
            </div>
        </header>
    );
}