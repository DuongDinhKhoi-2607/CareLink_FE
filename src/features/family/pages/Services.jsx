import React, { useState } from "react";
import { Link } from "react-router-dom";
import ServiceSelectionCard from "../components/ServiceSelectionCard";

export default function Services() {
    // State lưu trữ dịch vụ đang được user chọn
    const [selectedService, setSelectedService] = useState(null);

    // Dữ liệu các dịch vụ
    const basicServices = [
        {
            id: "s1",
            title: "Hỗ trợ sinh hoạt",
            description: "Hỗ trợ ăn uống, vệ sinh, vận động nhẹ nhàng và bầu bạn.",
            badgeText: "Điều dưỡng & Sinh viên Y khoa",
            badgeType: "normal",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m-2-2h4" />
                </svg>
            )
        },
        {
            id: "s2",
            title: "Bầu bạn & Trò chuyện",
            description: "Chia sẻ, đọc sách, đi dạo và hỗ trợ tinh thần cho người cao tuổi.",
            badgeText: "Điều dưỡng & Sinh viên Y khoa",
            badgeType: "normal",
            // ĐÃ SỬA ICON TRÒ CHUYỆN: Icon bong bóng chat đơn giản, gọn gàng, không bị lỗi
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
            )
        }
    ];

    const advancedServices = [
        {
            id: "s3",
            title: "Chăm sóc sau phẫu thuật",
            description: "Thay băng, tiêm truyền, chăm sóc vết thương và theo dõi lâm sàng chuyên sâu.",
            badgeText: "Chỉ dành cho Điều dưỡng",
            badgeType: "special", // Đổi màu khác biệt
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 10.5v10.125c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125V10.5m17.25 0c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.75c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25 0h-17.25m8.625 3.75v4.5m-2.25-2.25h4.5" />
                </svg>
            )
        },
        {
            id: "s4",
            title: "Theo dõi y tế",
            description: "Kiểm tra chỉ số sinh tồn, nhắc thuốc và báo cáo bác sĩ định kỳ.",
            badgeText: "Chỉ dành cho Điều dưỡng",
            badgeType: "special",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col animate-page-enter">

            {/* Header thu gọn cho luồng Booking */}
            <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
                    {/* Logo CareLink chuẩn theo phong cách trang chủ & dành cho gia đình */}
                    <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
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
                    <Link to="/family" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Hủy đặt lịch
                    </Link>
                </div>
            </header>

            {/* ĐÃ SỬA pt-6 THÀNH pt-12 ĐỂ ĐẨY TOÀN BỘ NỘI DUNG XUỐNG DƯỚI 1 CHÚT */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-12 pb-12 flex flex-col">

                {/* Stepper (Tiến trình 4 bước) */}
                <div className="w-full max-w-2xl mx-auto mb-8 relative">
                    {/* Đường kẻ ngang chạy ngầm */}
                    <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-slate-200 -z-10" />

                    <div className="flex justify-between items-center relative z-10">
                        {/* Step 1: Active */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#102030] text-white flex items-center justify-center text-sm font-bold shadow-md">1</div>
                            <span className="text-xs font-bold text-[#102030]">Dịch vụ</span>
                        </div>
                        {/* Step 2, 3, 4: Inactive */}
                        {[2, 3, 4].map((step, index) => {
                            const labels = ["Thời gian", "Người chăm sóc", "Xác nhận"];
                            return (
                                <div key={step} className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-sm font-bold border border-gray-200">{step}</div>
                                    <span className="text-xs font-semibold text-gray-400">{labels[index]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tiêu đề trang */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#102030] mb-2">Chọn loại dịch vụ</h1>
                    <p className="text-gray-500 text-sm sm:text-base">Vui lòng chọn dịch vụ phù hợp với nhu cầu y tế của người thân.</p>
                </div>

                {/* Danh sách dịch vụ - Nhóm 1 */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <h2 className="text-xs font-bold text-[#00677c] tracking-wider uppercase">Chăm sóc sinh hoạt</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {basicServices.map(service => (
                            <ServiceSelectionCard
                                key={service.id}
                                {...service}
                                isSelected={selectedService === service.id}
                                onClick={() => setSelectedService(service.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Danh sách dịch vụ - Nhóm 2 */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        {/* ĐÃ SỬA ICON NHÓM: Biểu tượng vòng tròn dấu thập (Plus Circle) chuẩn y tế, không trùng với thẻ */}
                        <svg className="w-4 h-4 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xs font-bold text-[#00677c] tracking-wider uppercase">Chăm sóc y tế chuyên sâu</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {advancedServices.map(service => (
                            <ServiceSelectionCard
                                key={service.id}
                                {...service}
                                isSelected={selectedService === service.id}
                                onClick={() => setSelectedService(service.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Nút Tiếp tục (Sang xịn: Mờ đi nếu chưa chọn, Sáng lên và chuyển trang nếu đã chọn) */}
                <div className="flex justify-end pt-6 border-t border-gray-100">
                    {selectedService ? (
                        <Link
                            to="/caregivers"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all bg-[#102030] text-white hover:bg-[#1a365d] shadow-md hover:-translate-y-0.5 cursor-pointer"
                        >
                            Tiếp tục
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all bg-gray-100 text-gray-400 cursor-not-allowed"
                        >
                            Tiếp tục
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    )}
                </div>

            </main>
        </div>
    );
}