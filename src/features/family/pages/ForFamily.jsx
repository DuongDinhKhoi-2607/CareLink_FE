import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ServiceCard from "../components/ServiceCard";

// 1. Dữ liệu các dịch vụ phục hồi & sinh hoạt (HomeCareServicesSection)
const recoveryServices = [
    "Thay băng, rửa vết thương",
    "Quản lý thuốc và liều lượng",
    "Hỗ trợ vận động phục hồi",
];

const dailyAssistanceTags = [
    "Vệ sinh cá nhân",
    "Chuẩn bị bữa ăn",
    "Bầu bạn tâm sự",
];

// 2. Dữ liệu quy trình xác minh & chỉ số (CareQualityAssuranceSection)
const verificationSteps = [
    {
        title: "Kiểm tra lý lịch tư pháp",
        description: "Xác minh hồ sơ sạch, không có tiền án tiền sự thông qua cơ quan chức năng.",
    },
    {
        title: "Xác thực chứng chỉ hành nghề",
        description: "Mọi điều dưỡng đều phải có bằng cấp từ các trường y tế chính quy.",
    },
    {
        title: "Đánh giá kỹ năng chuyên môn",
        description: "Thực hiện bài kiểm tra thực hành nghiêm ngặt tại trung tâm đào tạo của chúng tôi.",
    },
];

const assuranceMetrics = [
    {
        value: "100%",
        label: "ĐÃ XÁC MINH",
        borderColor: "border-[#00677c33]",
        icon: (
            <svg className="w-8 h-8 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
    },
    {
        value: "Zero",
        label: "SỰ CỐ AN NINH",
        borderColor: "border-[#0020451a]",
        icon: (
            <svg className="w-8 h-8 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
            </svg>
        ),
    },
    {
        value: "4.9/5",
        label: "ĐÁNH GIÁ TRUNG BÌNH",
        borderColor: "border-[#0020451a]",
        icon: (
            <svg className="w-8 h-8 text-[#00677c]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ),
    },
    {
        value: "Bảo mật",
        label: "CHUẨN HIPAA",
        borderColor: "border-[#00677c33]",
        icon: (
            <svg className="w-8 h-8 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
    },
];

// 3. Dữ liệu các bước đặt lịch (CareSpecialistBookingSection)
const bookingSteps = [
    {
        number: "01",
        title: "Mô tả nhu cầu",
        description: "Cho chúng tôi biết tình trạng sức khỏe và thời gian bạn cần hỗ trợ thông qua ứng dụng hoặc website.",
    },
    {
        number: "02",
        title: "Chọn chuyên gia",
        description: "Hệ thống sẽ gợi ý danh sách 3 chuyên gia phù hợp nhất dựa trên kỹ năng và vị trí địa lý.",
    },
    {
        number: "03",
        title: "Bắt đầu chăm sóc",
        description: "Phỏng vấn nhanh và xác nhận lịch hẹn. Chuyên gia sẽ có mặt tại nhà bạn đúng thời gian cam kết.",
    },
];

export default function ForFamily() {
    return (
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
            <Header />

            <main className="flex flex-col w-full flex-1">
                {/* ============================================================ */}
                {/* 1. ELDER CARE HERO SECTION                                   */}
                {/* ============================================================ */}
                <section className="relative w-full py-16 lg:py-24 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
                        {/* Cột thông tin văn bản */}
                        <div className="flex-1 flex flex-col items-start gap-6 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f3f5] border border-[#00677c33]">
                                <svg className="w-4 h-4 text-[#00677c]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-semibold text-[#00677c]">Đã được kiểm định y tế</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-bold text-[#102030] tracking-tight leading-tight">
                                Chăm sóc chuyên nghiệp <br />
                                <span className="text-[#00677c]">cho ông bà, cha mẹ tại nhà</span>
                            </h1>

                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                Kết nối với đội ngũ điều dưỡng và chuyên gia chăm sóc sức khỏe tận tâm, mang lại sự an tâm tuyệt đối cho gia đình bạn ngay tại tổ ấm thân thương.
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                                <button
                                    type="button"
                                    className="px-8 py-3.5 bg-[#102030] text-white rounded-xl font-semibold hover:bg-[#1a365d] transition-all shadow-md"
                                >
                                    Tìm chuyên gia phù hợp
                                </button>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 w-full">
                                <div className="flex -space-x-2">
                                    <img
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
                                        alt="Chuyên gia y tế"
                                    />
                                    <img
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100"
                                        alt="Điều dưỡng viên"
                                    />
                                    <img
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                        src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400"
                                        alt="Người chăm sóc"
                                    />
                                </div>
                                <div>
                                    <strong className="text-sm font-bold text-[#102030] block">2,500+</strong>
                                    <span className="text-xs text-gray-500">Chuyên gia đã sẵn sàng</span>
                                </div>
                            </div>
                        </div>

                        {/* Cột ảnh hero */}
                        <div className="flex-1 w-full relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                                <img
                                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1000"
                                    alt="Chăm sóc người già tại nhà"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="absolute -bottom-6 left-6 right-6 sm:left-10 sm:right-10 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-gray-200 shadow-xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#e6f3f5] flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#102030]">Bảo hiểm trách nhiệm 10 tỷ VNĐ</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Cam kết an toàn tuyệt đối cho người thân của bạn.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============================================================ */}
                {/* 2. HOME CARE SERVICES SECTION (Bento Grid)                   */}
                {/* ============================================================ */}
                <section className="w-full py-20 bg-[#f4f7f8] border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
                        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
                            <h2 className="text-3xl font-bold text-[#102030]">Dịch vụ chăm sóc toàn diện</h2>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Chúng tôi cung cấp các giải pháp y tế chuyên biệt, được thiết kế riêng cho nhu cầu của từng thành viên trong gia đình.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                            {/* ĐÃ CHỈNH: lg:col-span-8 thành lg:col-span-7 để thu hẹp lại 1 chút */}
                            <div className="lg:col-span-7">
                                <ServiceCard
                                    title="Chăm sóc sau phẫu thuật (Post-op care)"
                                    description="Chăm sóc phục hồi sau phẫu thuật chuyên nghiệp. Đảm bảo vết thương mau lành và ngăn ngừa biến chứng với sự giám sát của điều dưỡng có bằng cấp."
                                    tags={recoveryServices}
                                    icon={
                                        <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    }
                                    className="bg-white h-full"
                                />
                            </div>

                            {/* ĐÃ CHỈNH: lg:col-span-4 thành lg:col-span-5 để kéo giãn sang trái & Thêm border, shadow để sang xịn hơn */}
                            <div className="lg:col-span-5">
                                <article className="h-full bg-[#102030] text-white rounded-3xl p-8 flex flex-col justify-between shadow-2xl border border-white/10 relative overflow-hidden transition-transform hover:-translate-y-1">
                                    {/* Ánh sáng glow mờ nền xanh tôn vinh màu sắc */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00677c] rounded-full blur-3xl opacity-20 pointer-events-none" />

                                    <div className="flex flex-col gap-3 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/5">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold mt-2">Hỗ trợ sinh hoạt (Daily assistance)</h3>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            Hỗ trợ các hoạt động sinh hoạt hàng ngày với sự tôn trọng và thấu hiểu sâu sắc.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-6 relative z-10">
                                        {dailyAssistanceTags.map((tag) => (
                                            <span key={tag} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/5 text-xs font-medium text-white shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </article>
                            </div>

                            <div className="lg:col-span-4">
                                <ServiceCard
                                    title="Theo dõi y tế chuyên sâu"
                                    description="Theo dõi sát sao các chỉ số sinh tồn và diễn biến bệnh lý mãn tính như tiểu đường, huyết áp."
                                    icon={
                                        <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                        </svg>
                                    }
                                    className="bg-white h-full"
                                />
                            </div>

                            <div className="lg:col-span-8">
                                <article className="h-full bg-[#e6f3f5] rounded-3xl p-8 border border-[#00677c33] flex flex-col sm:flex-row items-center justify-between gap-6 transition-transform hover:-translate-y-1">
                                    <div className="flex flex-col gap-3 max-w-md">
                                        <h3 className="text-xl font-bold text-[#102030]">Chăm sóc theo yêu cầu 24/7</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Đội ngũ phản ứng nhanh luôn sẵn sàng cho các tình huống cần hỗ trợ khẩn cấp hoặc chăm sóc ngắn hạn.
                                        </p>
                                        <button
                                            type="button"
                                            className="w-fit mt-2 px-6 py-2.5 bg-[#00677c] text-white rounded-xl text-sm font-semibold hover:bg-[#005263] transition-all shadow-md hover:shadow-lg"
                                        >
                                            Kết nối ngay bây giờ
                                        </button>
                                    </div>
                                    <img
                                        src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400"
                                        alt="Chăm sóc 24/7"
                                        className="w-full sm:w-48 h-36 object-cover rounded-2xl shadow-md border border-white"
                                    />
                                </article>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============================================================ */}
                {/* 3. CARE QUALITY ASSURANCE SECTION                            */}
                {/* ============================================================ */}
                <section className="w-full py-20 bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 flex flex-col gap-8">
                            <div>
                                <h2 className="text-3xl font-bold text-[#102030] leading-tight">
                                    An tâm với hệ thống <br />
                                    <span className="text-[#00677c]">xác minh 5 bước nghiêm ngặt</span>
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base mt-3">
                                    Tiêu chuẩn tuyển chọn khắt khe để đảm bảo chỉ những điều dưỡng viên ưu tú nhất được đồng hành cùng gia đình bạn.
                                </p>
                            </div>

                            <div className="flex flex-col gap-6">
                                {verificationSteps.map((step, idx) => (
                                    <div key={step.title} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#00677c] text-white font-bold flex items-center justify-center shrink-0 shadow-md">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-[#102030]">{step.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                            {assuranceMetrics.map((metric) => (
                                <div
                                    key={metric.label}
                                    className={`p-6 rounded-3xl bg-[#f4f7f8] border ${metric.borderColor} flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md transition-all`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                        {metric.icon}
                                    </div>
                                    <strong className="text-3xl font-bold text-[#102030]">{metric.value}</strong>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{metric.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============================================================ */}
                {/* 4. CARE SPECIALIST BOOKING SECTION                           */}
                {/* ============================================================ */}
                <section className="w-full py-20 bg-[#f4f7f8] border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
                        {/* ĐÃ CHỈNH: Thêm hiệu ứng shadow, border để nền #102030 sang hơn */}
                        <div className="w-full bg-[#102030] text-white rounded-[40px] p-8 sm:p-14 flex flex-col gap-12 shadow-2xl border border-gray-800 relative overflow-hidden">
                            {/* Highlight nhạt phía trên bên phải */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00677c] rounded-full blur-[80px] opacity-30 pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-3xl sm:text-4xl font-bold">Cách đặt chuyên gia chăm sóc</h2>
                                <p className="text-gray-300 text-sm sm:text-base mt-2">
                                    Đơn giản, nhanh chóng và minh bạch chỉ trong vài phút.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                {bookingSteps.map((step) => (
                                    // ĐÃ CHỈNH: Bo khung từng bước, làm nền kính mờ để nổi bật con số
                                    <div key={step.number} className="flex flex-col gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shadow-inner backdrop-blur-sm">
                                        <div className="w-14 h-14 rounded-2xl bg-[#00677c] flex items-center justify-center shadow-lg">
                                            <span className="text-2xl font-extrabold text-white">{step.number}</span>
                                        </div>
                                        <h3 className="text-xl font-bold">{step.title}</h3>
                                        <p className="text-sm text-gray-300 leading-relaxed">{step.description}</p>
                                    </div>
                                ))}
                            </div>

                            <aside className="border-t border-gray-700/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                                <div>
                                    <h4 className="text-lg font-bold">Bạn cần tư vấn trực tiếp?</h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Đội ngũ chuyên viên y tế của chúng tôi luôn sẵn sàng hỗ trợ bạn lựa chọn.
                                    </p>
                                </div>
                                <a
                                    href="tel:19006868"
                                    className="px-8 py-3.5 bg-[#00677c] text-white rounded-xl font-bold hover:bg-[#005263] transition-all shadow-md whitespace-nowrap border border-[#00677c] hover:border-white/20"
                                >
                                    Gọi: 1900 6868 (Miễn phí)
                                </a>
                            </aside>
                        </div>
                    </div>
                </section>

                {/* ============================================================ */}
                {/* 5. ELDER CARE CTA SECTION                                    */}
                {/* ============================================================ */}
                {/* ĐÃ CHỈNH: Đổi màu nền sang bg-[#f4f7f8] (Xám nhạt) */}
                <section className="w-full py-24 bg-[#f4f7f8]">
                    <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-6">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#102030] leading-tight">
                            Sẵn sàng để người thân được <br />
                            <span className="text-[#00677c]">chăm sóc tốt nhất?</span>
                        </h2>

                        <p className="text-gray-600 text-base max-w-xl leading-relaxed">
                            Hàng ngàn gia đình đã tin tưởng chọn CareLink để đồng hành cùng sức khỏe của ông bà, cha mẹ.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            <button
                                type="button"
                                className="px-8 py-4 bg-[#102030] text-white font-semibold rounded-xl hover:bg-[#1a365d] transition-all shadow-xl hover:-translate-y-0.5"
                            >
                                Tìm chuyên gia phù hợp
                            </button>
                            <button
                                type="button"
                                className="px-8 py-4 bg-white border border-gray-200 text-[#102030] font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                            >
                                Tải ứng dụng cho gia đình
                            </button>
                        </div>

                        {/* ĐÃ CHỈNH: Thêm 3 huy hiệu chứng nhận (Trust Badges) y hệt như thiết kế Figma */}
                        <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-200/60">
                            {/* Huy hiệu 1: Chứng chỉ chất lượng */}
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 text-[#00677c] hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            {/* Huy hiệu 2: Y tế chuẩn mực */}
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#e6f3f5] shadow-sm border border-[#00677c]/10 text-[#00677c] hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            {/* Huy hiệu 3: Bảo mật tuyệt đối */}
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 text-[#00677c] hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div >
    );
}