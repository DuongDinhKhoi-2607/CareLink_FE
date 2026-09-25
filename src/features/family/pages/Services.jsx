import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ServiceSelectionCard from "../components/ServiceSelectionCard";

export default function Services() {
    const navigate = useNavigate();

    // Dịch vụ đang được chọn (mặc định chọn s1 để trải nghiệm liền mạch hoặc để null)
    const [selectedServiceId, setSelectedServiceId] = useState("s1");

    // Dữ liệu dịch vụ chi tiết & minh bạch theo chuẩn y tế cao cấp
    const basicServices = [
        {
            id: "s1",
            title: "Hỗ trợ sinh hoạt hàng ngày",
            description: "Chăm sóc toàn diện các hoạt động thể chất và dinh dưỡng cho người cao tuổi hoặc người bệnh cần hỗ trợ vận động.",
            badgeText: "Điều dưỡng & SV Y khoa",
            badgeType: "normal",
            priceRange: "65.000đ – 85.000đ / giờ",
            recommendedDuration: "Ca 4h – 8h hoặc cả ngày",
            specialtyMatch: "Chăm sóc người già",
            features: [
                "Hỗ trợ ăn uống theo chế độ dinh dưỡng, vệ sinh cá nhân an toàn",
                "Dìu dắt vận động nhẹ nhàng, phòng ngừa nguy cơ té ngã",
                "Nhắc nhở uống thuốc đúng giờ và theo dõi tình trạng thể chất cơ bản"
            ],
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m-2-2h4" />
                </svg>
            )
        },
        {
            id: "s2",
            title: "Bầu bạn & Chăm sóc tinh thần",
            description: "Liệu pháp đồng hành tâm lý, giúp người cao tuổi xoa dịu cảm giác cô đơn, kích thích trí nhớ và duy trì niềm vui sống.",
            badgeText: "Điều dưỡng & SV Y khoa",
            badgeType: "normal",
            priceRange: "60.000đ – 80.000đ / giờ",
            recommendedDuration: "Ca 2h – 4h mỗi ngày",
            specialtyMatch: "Chăm sóc người già",
            features: [
                "Đọc sách báo, tâm sự sẻ chia và cùng nghe nhạc thư giãn",
                "Đưa đón đi dạo, hướng dẫn các bài tập rèn luyện trí nhớ nhẹ nhàng",
                "Gắn kết tình cảm, hỗ trợ gọi video cập nhật với con cháu"
            ],
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
            )
        }
    ];

    const advancedServices = [
        {
            id: "s3",
            title: "Chăm sóc sau phẫu thuật & Vết thương",
            description: "Quy trình chăm sóc ngoại khoa chuẩn y tế, kiểm soát nhiễm khuẩn và đẩy nhanh tốc độ liền sẹo cho người sau xuất viện.",
            badgeText: "Chỉ dành cho Điều dưỡng RN",
            badgeType: "special",
            priceRange: "180.000đ – 250.000đ / giờ",
            recommendedDuration: "Theo ca thực hiện hoặc lịch hẹn định kỳ",
            specialtyMatch: "Chăm sóc sau phẫu thuật",
            features: [
                "Rửa và thay băng vết mổ vô khuẩn tuyệt đối theo chuẩn bệnh viện",
                "Theo dõi dịch dẫn lưu, phát hiện sớm nguy cơ nhiễm trùng",
                "Hỗ trợ tiêm truyền và hướng dẫn các bài tập phục hồi chức năng"
            ],
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 10.5v10.125c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125V10.5m17.25 0c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.75c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25 0h-17.25m8.625 3.75v4.5m-2.25-2.25h4.5" />
                </svg>
            )
        },
        {
            id: "s4",
            title: "Theo dõi y tế & Bệnh mãn tính",
            description: "Giám sát chặt chẽ các chỉ số sinh tồn và quản lý việc tuân thủ phác đồ điều trị cho bệnh nhân tiểu đường, tim mạch, huyết áp.",
            badgeText: "Chỉ dành cho Điều dưỡng RN",
            badgeType: "special",
            priceRange: "150.000đ – 200.000đ / giờ",
            recommendedDuration: "Ca theo dõi định kỳ hoặc hằng ngày",
            specialtyMatch: "Chăm sóc vết thương",
            features: [
                "Đo và lập biểu đồ huyết áp, đường huyết mao mạch, SpO2, thân nhiệt",
                "Quản lý lịch dùng thuốc, cảnh báo tương tác thuốc bất lợi",
                "Lập sổ nhật ký sức khỏe điện tử gửi bác sĩ và người thân theo dõi"
            ],
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
            )
        }
    ];

    const allServices = [...basicServices, ...advancedServices];
    const currentSelectedService = allServices.find((s) => s.id === selectedServiceId);

    // Chuyển sang trang tìm điều dưỡng kèm thông tin dịch vụ đã chọn
    const handleContinue = () => {
        if (!currentSelectedService) return;
        navigate("/caregivers", {
            state: {
                selectedService: {
                    id: currentSelectedService.id,
                    title: currentSelectedService.title,
                    priceRange: currentSelectedService.priceRange,
                    badgeText: currentSelectedService.badgeText,
                    specialtyMatch: currentSelectedService.specialtyMatch,
                },
            },
        });
    };

    return (
        <div className="w-full bg-[#f8faf9] font-sans antialiased text-[#102030] min-h-screen pb-28">
            {/* Thanh điều hướng ngữ cảnh (Breadcrumb) */}
            <div className="w-full border-b border-[#e5ebe8] bg-white/70 backdrop-blur-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="hover:text-[#00677c] transition-colors">
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <Link to="/family" className="hover:text-[#00677c] transition-colors">
                            Dành cho Gia đình
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-[#102030]">Danh mục dịch vụ</span>
                    </div>

                    <Link
                        to="/caregivers"
                        className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-[#00677c] hover:text-[#005566] transition-colors"
                    >
                        <span>Bỏ qua & Xem toàn bộ điều dưỡng</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Khối Hero Header giới thiệu giải pháp */}
            <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5f1] border border-[#c6e7dd] text-[#126a63] text-xs font-bold tracking-wide uppercase mb-4">
                        <span className="w-2 h-2 rounded-full bg-[#187d74] animate-pulse" />
                        Giải pháp y tế tại nhà chuẩn hóa
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#102030] tracking-tight leading-[1.18] mb-4">
                        Lựa chọn dịch vụ phù hợp cho người thân
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                        Mỗi gói chăm sóc được thiết kế bài bản theo đúng nhu cầu và thể trạng. Sau khi chọn gói, bạn sẽ được kết nối trực tiếp với đội ngũ chuyên gia có chuyên môn tương ứng.
                    </p>
                </div>

                {/* 3 Cam kết cốt lõi */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-[#e2e8e5]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#dde4e1] flex items-center justify-center text-[#00677c] shadow-2xs shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#102030]">Xác minh 100% hồ sơ</span>
                            <span className="text-[11px] text-slate-500">Chứng chỉ y tế & lý lịch tư pháp</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#dde4e1] flex items-center justify-center text-[#00677c] shadow-2xs shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#102030]">Linh hoạt theo giờ & ca</span>
                            <span className="text-[11px] text-slate-500">Chủ động hẹn theo lịch gia đình</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#dde4e1] flex items-center justify-center text-[#00677c] shadow-2xs shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6H2.25m0 0v1.5c0 .621.504 1.125 1.125 1.125H3.75m0 0h16.5m0 0H21.75c.621 0 1.125-.504 1.125-1.125V6m0 0H21" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#102030]">Minh bạch tài chính</span>
                            <span className="text-[11px] text-slate-500">Giá niêm yết, không phụ phí ẩn</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Danh sách Dịch vụ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* NHÓM 1: CHĂM SÓC SINH HOẠT & HỖ TRỢ ĐỜI SỐNG */}
                <section>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#e2e8e5]">
                        <div>
                            <div className="flex items-center gap-2 text-[#00677c] font-bold text-xs uppercase tracking-wider mb-1">
                                <span className="w-2 h-2 rounded-full bg-[#00677c]" />
                                Phân nhóm 01
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#102030]">
                                Chăm sóc Sinh hoạt & Hỗ trợ Đời sống
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                            Phù hợp cho người cao tuổi cần hỗ trợ các hoạt động thường ngày và nâng đỡ tinh thần an vui.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {basicServices.map((service) => (
                            <ServiceSelectionCard
                                key={service.id}
                                {...service}
                                isSelected={selectedServiceId === service.id}
                                onClick={() => setSelectedServiceId(service.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* NHÓM 2: CHĂM SÓC Y TẾ LÂM SÀNG CHUYÊN SÂU */}
                <section>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#e2e8e5]">
                        <div>
                            <div className="flex items-center gap-2 text-[#0f4b7a] font-bold text-xs uppercase tracking-wider mb-1">
                                <span className="w-2 h-2 rounded-full bg-[#0f4b7a]" />
                                Phân nhóm 02
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#102030]">
                                Chăm sóc Y tế Lâm sàng Chuyên sâu
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                            Được thực hiện trực tiếp bởi Cử nhân Điều dưỡng có chứng chỉ hành nghề (RN) theo y lệnh y khoa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {advancedServices.map((service) => (
                            <ServiceSelectionCard
                                key={service.id}
                                {...service}
                                isSelected={selectedServiceId === service.id}
                                onClick={() => setSelectedServiceId(service.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* Khối Giải đáp thắc mắc về giá & quy trình tìm kiếm */}
                <section className="bg-white rounded-2xl border border-[#dde4e1] p-6 sm:p-8 mt-12 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-[#e8f5f1] text-[#00677c] flex items-center justify-center font-bold text-sm">
                            ?
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#102030]">
                            Gia đình thường hỏi về quy trình & mức phí
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Hộp câu hỏi 1 */}
                        <div className="bg-[#f8faf9] border border-[#e2e8e5] rounded-xl p-5 hover:bg-white hover:border-[#00677c]/30 hover:shadow-2xs transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-5 h-5 rounded-full bg-[#00677c]/10 text-[#00677c] text-[11px] font-bold flex items-center justify-center shrink-0">
                                    1
                                </span>
                                <h4 className="font-bold text-sm text-[#102030]">
                                    Mức phí tham khảo trên được tính như thế nào?
                                </h4>
                            </div>
                            <p className="leading-relaxed text-xs sm:text-sm text-slate-500 pl-7">
                                Mức phí hiển thị là mức giá trung bình của từng nhóm kỹ năng. Ở bước tiếp theo, bạn có thể xem hồ sơ cụ thể và sử dụng thanh trượt lọc mức giá từ 50.000đ – 500.000đ/giờ phù hợp với ngân sách gia đình.
                            </p>
                        </div>

                        {/* Hộp câu hỏi 2 */}
                        <div className="bg-[#f8faf9] border border-[#e2e8e5] rounded-xl p-5 hover:bg-white hover:border-[#00677c]/30 hover:shadow-2xs transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-5 h-5 rounded-full bg-[#00677c]/10 text-[#00677c] text-[11px] font-bold flex items-center justify-center shrink-0">
                                    2
                                </span>
                                <h4 className="font-bold text-sm text-[#102030]">
                                    Tôi có được trao đổi trước khi chốt lịch không?
                                </h4>
                            </div>
                            <p className="leading-relaxed text-xs sm:text-sm text-slate-500 pl-7">
                                Có. Bạn hoàn toàn có thể nhắn tin trao đổi về tình trạng bệnh nhân, lịch hẹn và yêu cầu chi tiết trước khi tiến hành xác nhận đặt lịch và thanh toán.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* ============================================================ */}
            {/* THANH DOCK CỐ ĐỊNH Ở ĐÁY MÀN HÌNH (FLOATING ACTION DOCK)      */}
            {/* ============================================================ */}
            {currentSelectedService && (
                <aside aria-label="Thanh xác nhận dịch vụ đã chọn" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#d8e2df] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] py-3 sm:py-4 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Thông tin dịch vụ được chọn */}
                        <div className="flex items-center gap-3.5 w-full sm:w-auto">
                            <div className="w-11 h-11 rounded-xl bg-[#00677c] text-white flex items-center justify-center shrink-0 shadow-sm">
                                {currentSelectedService.icon}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00677c]">
                                        Dịch vụ đang chọn:
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        ({currentSelectedService.badgeText})
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-base font-bold text-[#102030]">
                                        {currentSelectedService.title}
                                    </span>
                                    <span className="hidden md:inline-block text-xs font-semibold text-slate-500">
                                        • Mức phí tham khảo: <strong className="text-[#00677c] font-bold">{currentSelectedService.priceRange}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Nút hành động chính */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <button
                                type="button"
                                onClick={handleContinue}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#00677c] hover:bg-[#005566] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                            >
                                <span>Tìm chuyên gia cho dịch vụ này</span>
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </aside>
            )}
        </div>
    );
}