import React from "react";

export default function UserManagement() {
    return (
        <div className="space-y-6 pb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Quản lý tài khoản khách hàng (Gia đình) và tài khoản Người chăm sóc / Điều dưỡng.
                        </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Phân công: Nguyên phụ trách
                    </span>
                </div>
            </div>

            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto text-2xl">
                    👥
                </div>
                <div className="max-w-md mx-auto">
                    <h3 className="text-base font-bold text-slate-800">Module Quản trị Tài khoản thành viên</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        Khu vực này dành cho bạn Nguyên phát triển danh sách phân tab (Gia đình / Điều dưỡng), thanh tìm kiếm nhanh, kiểm tra trạng thái hoạt động và thao tác Khóa/Mở khóa tài khoản khi có vi phạm.
                    </p>
                </div>
            </div>
        </div>
    );
}
