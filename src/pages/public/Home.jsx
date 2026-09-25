import React from "react";
import { Link } from "react-router-dom";

// 1. Dữ liệu các thẻ tính năng (Tại sao chọn CareLink)
const featureCards = [
    {
        title: "Chuyên môn xác thực",
        description: (
            <>
                100% người chăm sóc là sinh viên Y/Điều dưỡng từ các trường Đại học danh tiếng, đã qua xác thực chứng chỉ và kỹ năng chuyên môn.
            </>
        ),
        iconNode: (
            <svg className="w-10 h-10 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        title: "Giá cả minh bạch",
        description: (
            <>
                Không phí ẩn, thanh toán dễ dàng qua nền tảng với biểu phí chi tiết theo từng loại dịch vụ.
            </>
        ),
        iconNode: (
            <svg className="w-10 h-10 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        title: "Hỗ trợ 24/7",
        description: (
            <>
                Đội ngũ điều phối viên chuyên nghiệp luôn sẵn sàng giải quyết mọi tình huống phát sinh ngay lập tức.
            </>
        ),
        iconNode: (
            <svg className="w-10 h-10 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        title: "Chăm sóc từ tâm",
        description: (
            <>
                Chúng tôi không chỉ chăm sóc sức khỏe thể chất mà còn là người bạn đồng hành tinh thần cho người cao tuổi.
            </>
        ),
        iconNode: (
            <svg className="w-10 h-10 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
];

// 2. Dữ liệu các bước quy trình hoạt động (Đã làm nhỏ icon lại cho tinh tế)
const processSteps = [
    {
        title: "Tìm kiếm",
        description: "Lựa chọn nhu cầu chăm sóc và địa điểm của bạn.",
        iconNode: (
            <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        title: "Ghép cặp",
        description: "Hệ thống đề xuất các ứng viên phù hợp nhất với yêu cầu.",
        iconNode: (
            <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },
    {
        title: "Đặt lịch",
        description: "Xác nhận thời gian và bắt đầu dịch vụ chăm sóc.",
        iconNode: (
            <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        title: "Đánh giá",
        description: "Nhận báo cáo và đánh giá chất lượng người chăm sóc.",
        iconNode: (
            <svg className="w-6 h-6 text-[#00677c]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ),
    },
];

// 3. Dữ liệu danh sách điều dưỡng (Đã thay link ảnh chuẩn, không lỗi)
const caregivers = [
    {
        name: "Nguyễn Thùy Linh",
        role: "Sinh viên Y4 - ĐH Y Hà Nội",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400", // Đã fix
        skills: ["TIÊM TRUYỀN", "THAY BĂNG", "VẬT LÝ TRỊ LIỆU"],
        quote: `"Luôn coi bệnh nhân như người thân trong gia đình, chăm sóc bằng cả trái tim và kiến thức chuyên môn."`,
    },
    {
        name: "Trần Minh Quân",
        role: "Điều dưỡng đa khoa - 3 năm KN",
        rating: "5.0",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400", // Đã fix
        skills: ["CHĂM SÓC SAU MỔ", "CẤP CỨU"],
        quote: `"Chuyên môn vững vàng, bình tĩnh trong mọi tình huống. Luôn nỗ lực đem lại sự thoải mái nhất cho bệnh nhân."`,
    },
    {
        name: "Lê Phương Hoa",
        role: "Cử nhân Phục hồi chức năng",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400", // Đã fix
        skills: ["XOA BÓP BẤM HUYỆT", "DINH DƯỠNG"],
        quote: `"Kết hợp y học hiện đại và các phương pháp phục hồi tự nhiên để tăng cường sức khỏe cho người lớn tuổi."`,
    },
];

// Component con: Thẻ tính năng
const FeatureCard = ({ feature }) => (
    <article className="relative flex flex-col p-6 items-start bg-white rounded-xl border border-gray-100 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1">
        <div className="mb-4">
            {feature.iconNode}
        </div>
        <h3 className="font-semibold text-[#102030] text-lg mb-2">
            {feature.title}
        </h3>
        <p className="text-[#43474e] text-sm leading-relaxed">
            {feature.description}
        </p>
    </article>
);

// Component con: Thẻ điều dưỡng
const CaregiverCard = ({ caregiver }) => (
    <article className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-transform hover:shadow-lg">
        <div className="h-48 w-full relative">
            <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${caregiver.image})` }}
            />
            <div className="inline-flex items-center gap-1 px-3 py-1 absolute top-4 right-4 bg-teal-500 rounded-full shadow-sm">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold text-white text-xs whitespace-nowrap">
                    Đã xác thực
                </span>
            </div>
        </div>
        <div className="flex flex-col gap-4 p-5 flex-1">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-[#102030] text-lg">
                        {caregiver.name}
                    </h3>
                    <p className="font-medium text-xs text-gray-500 mt-1">
                        {caregiver.role}
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-[#102030] text-sm">
                        {caregiver.rating}
                    </span>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {caregiver.skills.map((skill) => (
                    <span
                        key={skill}
                        className="px-2 py-1 bg-gray-100 rounded text-[#43474e] font-bold text-[10px] tracking-wide uppercase"
                    >
                        {skill}
                    </span>
                ))}
            </div>
            <p className="text-[#43474e] text-sm italic leading-relaxed flex-1">
                {caregiver.quote}
            </p>
            <button
                type="button"
                className="w-full py-2.5 mt-2 bg-[#e6f3f5] rounded-lg hover:bg-[#cce7eb] transition-colors font-medium text-[#00677c] text-sm"
            >
                Xem hồ sơ chi tiết
            </button>
        </div>
    </article>
);

export default function Home() {
    return (
        <div className="flex flex-col w-full">

            {/* 1. HERO SECTION */}
            <section className="relative w-full h-[560px] sm:h-[620px] lg:h-[700px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div
                        className="w-full h-full bg-cover bg-[position:82%_center] sm:bg-[position:85%_center] lg:bg-[position:right_center]"
                        style={{
                            backgroundImage: `url('/images/home_hero.jpg')`,
                        }}
                    />
                    {/* Lớp phủ dải màu êm dịu: Chuyển màu mượt mà, khử chói sáng, giúp đọc chữ rõ nét và thư thái cho mắt */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 via-28% via-white/25 via-42% to-transparent pointer-events-none" />
                </div>

                <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl flex flex-col gap-6">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50/90 text-[#00677c] text-xs sm:text-sm font-semibold w-fit border border-teal-200/70 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-[#00677c] animate-pulse" />
                            Hệ thống kết nối chăm sóc sức khỏe 24/7
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102030] tracking-tight leading-[1.15]">
                            Chăm sóc tận tâm,
                            <br />
                            <span className="text-[#00677c]">Kết nối chuyên môn</span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-lg">
                            Nền tảng kết nối sinh viên Y khoa và Điều dưỡng chuyên nghiệp với các gia đình cần hỗ trợ chăm sóc người cao tuổi, mang lại sự an tâm tuyệt đối.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link
                                to="/family"
                                className="inline-flex items-center justify-center gap-2 h-[50px] px-7 bg-[#00677c] text-white rounded-xl font-semibold hover:bg-[#005566] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Tìm người chăm sóc
                            </Link>
                            <Link
                                to="/caregiver"
                                className="inline-flex items-center justify-center gap-2 h-[50px] px-7 bg-white/95 backdrop-blur-xs border-2 border-[#00677c] text-[#00677c] rounded-xl font-semibold hover:bg-teal-50 hover:border-[#005566] hover:text-[#005566] transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Đăng ký đi làm
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. SECTION: TẠI SAO CHỌN CARELINK? */}
            <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-10">
                <div className="flex flex-col items-center text-center gap-3">
                    <h2 className="text-3xl font-bold text-[#102030]">Tại sao chọn CareLink?</h2>
                    <div className="w-24 h-1.5 bg-[#00677c] rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-4">
                        <FeatureCard feature={featureCards[0]} />
                    </div>

                    <article className="lg:col-span-8 flex flex-col sm:flex-row rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-[#003846] to-[#00677c]">
                        <div className="p-8 flex flex-col justify-center w-full sm:w-3/5 text-white">
                            <h3 className="text-2xl font-bold mb-4">An tâm cho mọi gia đình</h3>
                            <p className="text-gray-200 text-sm leading-relaxed mb-8">
                                Hệ thống giám sát lộ trình chăm sóc, bảo hiểm y tế đi kèm và báo cáo sức khỏe chi tiết được gửi trực tiếp đến người thân mỗi ngày.
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/20">
                                <div>
                                    <strong className="text-3xl font-bold block">5000+</strong>
                                    <span className="text-xs text-blue-100">Gia đình tin dùng</span>
                                </div>
                                <div>
                                    <strong className="text-3xl font-bold block">1200+</strong>
                                    <span className="text-xs text-blue-100">Điều dưỡng viên</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="hidden sm:block w-2/5 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600)`,
                            }}
                        />
                    </article>

                    {featureCards.slice(1).map((feature) => (
                        <div key={feature.title} className="lg:col-span-4">
                            <FeatureCard feature={feature} />
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. SECTION: QUY TRÌNH HOẠT ĐỘNG */}
            {/* Đã đổi background thành xám đậm hơn một chút: bg-[#f4f7f8] */}
            <section className="w-full bg-[#f4f7f8] py-20 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
                    <div className="flex flex-col items-center text-center gap-3">
                        <h2 className="text-3xl font-bold text-[#102030]">Quy trình hoạt động</h2>
                        <p className="text-gray-600">Dễ dàng tìm kiếm sự hỗ trợ chuyên nghiệp chỉ trong 4 bước</p>
                    </div>

                    <div className="relative">
                        {/* ĐƯỜNG KẺ NGANG ĐẸP MẮT (Chỉ hiện trên màn hình lớn) */}
                        <div className="hidden lg:block absolute top-[40px] left-[12.5%] right-[12.5%] h-[2px] bg-gray-200 z-0" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                            {processSteps.map((step) => (
                                <div key={step.title} className="flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 mb-6 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                                        {step.iconNode}
                                    </div>
                                    <h3 className="text-lg font-bold text-[#102030] mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. SECTION: ĐỘI NGŨ ĐIỀU DƯỠNG TIÊU BIỂU */}
            <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-[#102030] mb-2">Đội ngũ điều dưỡng tiêu biểu</h2>
                        <p className="text-gray-600">Gặp gỡ những người đồng hành tận tâm nhất của chúng tôi</p>
                    </div>
                    <button className="inline-flex items-center gap-2 font-semibold text-[#00677c] hover:underline">
                        Xem tất cả ứng viên
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {caregivers.map((caregiver) => (
                        <CaregiverCard key={caregiver.name} caregiver={caregiver} />
                    ))}
                </div>
            </section>

            {/* 5. SECTION: CTA BANNER CUỐI TRANG - Thiết kế Sang xịn, tông màu dịu mắt, trang nhã và dễ nhìn */}
            <section className="w-full pt-1 pb-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-b from-slate-50 to-[#f1f5f9] border border-slate-200/90 p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">

                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-4.5">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs font-semibold text-[#00677c] shadow-2xs border border-slate-200">
                            <span className="w-2 h-2 rounded-full bg-[#00677c]" />
                            Mạng lưới chăm sóc y tế chuyên nghiệp
                        </span>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight leading-snug">
                            Sẵn sàng để bắt đầu hành trình chăm sóc?
                        </h2>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                            Gia nhập cộng đồng CareLink ngay hôm nay để nhận được sự hỗ trợ tốt nhất cho gia đình bạn hoặc bắt đầu sự nghiệp chăm sóc chuyên nghiệp.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-2">
                            <Link
                                to="/family"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#00677c] text-white font-semibold text-sm sm:text-base rounded-xl hover:bg-[#005466] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 shadow-sm group"
                            >
                                <span>Tôi cần tìm người chăm sóc</span>
                                <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>

                            <Link
                                to="/caregiver/choose-role"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base rounded-xl border border-slate-300 hover:border-[#00677c] hover:text-[#00677c] transition-all duration-200 hover:-translate-y-0.5 shadow-2xs group"
                            >
                                <svg className="w-4.5 h-4.5 text-[#00677c] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.765z" />
                                </svg>
                                <span>Tôi muốn đăng ký đi làm</span>
                            </Link>
                        </div>

                        {/* 3 cam kết nhỏ bên dưới tạo sự tin cậy chuẩn y tế */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mt-2 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-teal-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                100% nhân sự y tế xác thực
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-teal-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Hỗ trợ & kết nối nhanh 24/7
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-teal-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Chi phí minh bạch rõ ràng
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}