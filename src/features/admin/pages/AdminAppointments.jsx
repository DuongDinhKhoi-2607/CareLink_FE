import React from "react";

export default function AdminAppointments() {
    return (
        <div className="space-y-6 pb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Quản lý Lịch hẹn & Ca trực</h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Giám sát toàn bộ các ca chăm sóc, trạng thái thực hiện và điều phối giữa Gia đình - Điều dưỡng.
                        </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Phân công: Nguyên phụ trách
                    </span>
                </div>
            </div>

            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
                    📅
                </div>
                <div className="max-w-md mx-auto">
                    <h3 className="text-base font-bold text-slate-800">Module Quản lý Ca trực toàn sàn</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        Khu vực này dành riêng cho bạn Nguyên phát triển bảng theo dõi ca trực, bộ lọc trạng thái (Chờ xác nhận, Đang làm, Hoàn tất, Khiếu nại) và popup xem chi tiết hợp đồng ca trực.
                    </p>
                </div>
            </div>
        </div>
    );
}
