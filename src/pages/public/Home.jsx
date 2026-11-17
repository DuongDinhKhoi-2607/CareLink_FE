
import React from "react";
import { Link } from "react-router-dom";

// ============================================================
// 1. DATA - TẠI SAO CHỌN CARELINK?
// ============================================================

const featureCards = [
    {
        title: "Chuyên môn xác thực",
        description: (
            <>
                100% người chăm sóc là sinh viên Y/Điều dưỡng từ các trường Đại học danh tiếng, đã qua xác thực chứng chỉ và kỹ năng chuyên môn.
            </>
        ),
        iconNode: (
            <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
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
            <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
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
            <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
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
            <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
];

// ============================================================
// 2. DATA - QUY TRÌNH HOẠT ĐỘNG
// ============================================================

const processSteps = [
    {
        number: "01",
        title: "Tìm kiếm",
        description: "Lựa chọn nhu cầu chăm sóc và địa điểm của bạn.",
        iconNode: (
            <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        number: "02",
        title: "Ghép cặp",
        description: "Hệ thống đề xuất các ứng viên phù hợp nhất với yêu cầu.",
        iconNode: (
            <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },
    {
        number: "03",
        title: "Đặt lịch",
        description: "Xác nhận thời gian và bắt đầu dịch vụ chăm sóc.",
        iconNode: (
            <svg className="w-6 h-6 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        number: "04",
        title: "Đánh giá",
        description: "Nhận báo cáo và đánh giá chất lượng người chăm sóc.",
        iconNode: (
            <svg className="w-6 h-6 text-[#00677c]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ),
    },
];

// ============================================================
// 3. DATA - ĐỘI NGŨ ĐIỀU DƯỠNG
// ============================================================

const caregivers = [
    {
        name: "Nguyễn Thị Mai Lan",
        role: "Cử nhân Điều dưỡng - ĐH Y Dược TP.HCM",
        rating: "5.0",
        image: "/images/nurses/mai-lan.jpg",
        imagePosition: "center 8%",
        skills: ["TIÊM TRUYỀN", "THAY BĂNG", "VẬT LÝ TRỊ LIỆU"],
        quote: `"Luôn coi bệnh nhân như người thân trong gia đình, chăm sóc bằng cả trái tim và kiến thức chuyên môn."`,
    },
    {
        name: "Trần Văn Minh",
        role: "Cử nhân Điều dưỡng - ĐH Y khoa Phạm Ngọc Thạch",
        rating: "4.9",
        image: "/images/nurses/van-minh.jpg",
        imagePosition: "center 22%",
        skills: ["CHĂM SÓC SAU MỔ", "THAY BĂNG VÔ KHUẨN"],
        quote: `"Chuyên môn vững vàng, bình tĩnh trong mọi tình huống. Luôn nỗ lực đem lại sự thoải mái nhất cho bệnh nhân."`,
    },
    {
        name: "Lê Thị Thảo",
        role: "Sinh viên Y đa khoa năm 5 - ĐH Y Dược TP.HCM",
        rating: "4.8",
        image: "/images/nurses/le-thao.jpg",
        imagePosition: "center 35%",
        skills: ["CHĂM SÓC CƠ BẢN", "THEO DÕI SINH HIỆU"],
        quote: `"Kết hợp kiến thức y khoa bài bản và sự tận tâm để đồng hành chăm sóc sức khỏe cho ông bà mỗi ngày."`,
    },
];

// ============================================================
// 4. COMPONENT - SECTION HEADING
// ============================================================

const SectionHeading = ({ eyebrow, title, description }) => (
    <div className="flex flex-col items-center text-center gap-3">
        {eyebrow && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#00677c]">
                <span className="w-5 h-px bg-[#00677c]/50" />
                {eyebrow}
                <span className="w-5 h-px bg-[#00677c]/50" />
            </span>
        )}

        <h2 className="text-3xl font-bold text-[#102030] tracking-tight">
            {title}
        </h2>

        <span className="w-12 h-1 rounded-full bg-[#00677c]" />

        {description && (
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                {description}
            </p>
        )}
    </div>
);

// ============================================================
// 5. COMPONENT - FEATURE CARD
// ============================================================

const FeatureCard = ({ feature, index }) => (
    <article className="group relative flex flex-col items-start h-full p-6 bg-white rounded-2xl border border-slate-200/80 shadow-[0_3px_18px_rgba(15,35,45,0.035)] hover:shadow-[0_12px_32px_rgba(0,103,124,0.09)] hover:border-[#00677c]/25 hover:-translate-y-1 transition-all duration-300 overflow-hidden">

        <span className="absolute top-5 right-5 text-xs font-semibold text-slate-200 group-hover:text-[#00677c]/30 transition-colors">
            0{index + 1}
        </span>

        <div className="w-12 h-12 rounded-xl bg-[#eaf5f6] border border-[#d9ecef] flex items-center justify-center mb-5 group-hover:bg-[#00677c] group-hover:border-[#00677c] transition-all duration-300">
            <div className="group-hover:[&_svg]:text-white transition-colors">
                {feature.iconNode}
            </div>
        </div>

        <h3 className="font-semibold text-[#102030] text-lg mb-2 group-hover:text-[#00677c] transition-colors">
            {feature.title}
        </h3>

        <p className="text-[#64717c] text-sm leading-relaxed">
            {feature.description}
        </p>

        <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#00677c] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
    </article>
);

// ============================================================
// 6. COMPONENT - CAREGIVER CARD
// ============================================================

const CaregiverCard = ({ caregiver }) => (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-[0_4px_18px_rgba(15,35,45,0.045)] hover:shadow-[0_14px_35px_rgba(15,35,45,0.10)] hover:-translate-y-1 transition-all duration-300">

        <div className="h-56 sm:h-60 w-full relative overflow-hidden bg-slate-100">
            <div
                className="w-full h-full bg-cover group-hover:scale-105 transition-transform duration-700"
                style={{
                    backgroundImage: `url(${caregiver.image})`,
                    backgroundPosition: caregiver.imagePosition || "center center",
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-white/70">
                <svg className="w-3.5 h-3.5 text-[#00856f]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold text-[#087765] text-xs whitespace-nowrap">
                    Đã xác thực
                </span>
            </div>

            <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/45 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                <svg className="w-3.5 h-3.5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {caregiver.rating}
            </div>
        </div>

        <div className="flex flex-col gap-4 p-5 flex-1">

            <div className="min-h-[58px]">
                <h3 className="font-semibold text-[#102030] text-lg group-hover:text-[#00677c] transition-colors">
                    {caregiver.name}
                </h3>

                <p className="font-medium text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {caregiver.role}
                </p>
            </div>

            <div className="h-px bg-slate-100" />

            <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
                    Kỹ năng chuyên môn
                </p>

                <div className="flex flex-wrap gap-2">
                    {caregiver.skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-2.5 py-1.5 bg-[#f0f6f7] border border-[#e0edef] rounded-md text-[#38616a] font-semibold text-[10px] tracking-wide"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <p className="text-[#64717c] text-sm italic leading-relaxed flex-1">
                {caregiver.quote}
            </p>

            <button
                type="button"
                className="w-full py-2.5 mt-1 bg-[#eaf5f6] border border-[#dcecef] rounded-xl hover:bg-[#00677c] hover:border-[#00677c] transition-all duration-200 font-semibold text-[#00677c] hover:text-white text-sm"
            >
                Xem hồ sơ chi tiết
            </button>
        </div>
    </article>
);

// ============================================================
// 7. COMPONENT - PROCESS STEP
// ============================================================

const ProcessStep = ({ step, index }) => (
    <div className="relative flex flex-col items-center text-center group">

        <div className="relative mb-5">
            <div className="w-[76px] h-[76px] rounded-2xl bg-white border border-slate-200 shadow-[0_5px_18px_rgba(15,35,45,0.06)] flex items-center justify-center group-hover:border-[#00677c]/40 group-hover:shadow-[0_8px_22px_rgba(0,103,124,0.12)] group-hover:-translate-y-1 transition-all duration-300">
                {step.iconNode}
            </div>

            <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#00677c] text-white text-[10px] font-bold flex items-center justify-center border-[3px] border-[#f5f8f9]">
                {step.number}
            </span>
        </div>

        <h3 className="text-lg font-bold text-[#102030] mb-2 group-hover:text-[#00677c] transition-colors">
            {step.title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
            {step.description}
        </p>
    </div>
);

// ============================================================
// 8. MAIN HOME
// ============================================================

export default function Home() {

    // Giữ nguyên logic lấy thông tin user từ localStorage
    const [user] = React.useState(() => {
        try {
            const saved = localStorage.getItem("carelink_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    return (
        <div className="flex flex-col w-full bg-white">

            {/* ==================================================
                1. HERO SECTION
                GIỮ NGUYÊN TOÀN BỘ THIẾT KẾ, ẢNH VÀ ĐỘ MỜ
            ================================================== */}

            <section className="relative w-full h-auto py-12 sm:py-0 sm:h-[620px] lg:h-[700px] flex items-center overflow-hidden">

                {/* BACKGROUND DESKTOP - GIỮ NGUYÊN */}
                <div className="hidden sm:block absolute inset-0 z-0">
                    <div
                        className="w-full h-full bg-cover bg-[position:85%_center] lg:bg-[position:right_center]"
                        style={{
                            backgroundImage: `url('/images/home_hero.jpg')`,
                        }}
                    />

                    {/* Không chỉnh sửa độ mờ của lớp phủ */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 via-28% via-white/25 via-42% to-transparent pointer-events-none" />
                </div>

                {/* BACKGROUND MOBILE - GIỮ NGUYÊN */}
                <div className="sm:hidden absolute inset-0 z-0 bg-gradient-to-b from-teal-50/60 via-white to-slate-50/30 pointer-events-none">
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-100/40 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -left-16 w-52 h-52 bg-sky-100/30 rounded-full blur-2xl" />
                </div>

                {/* HERO CONTENT - GIỮ NGUYÊN */}
                <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl flex flex-col gap-5 sm:gap-6">

                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50/90 text-[#00677c] text-xs sm:text-sm font-semibold w-fit border border-teal-200/70 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-[#00677c] animate-pulse" />
                            Hệ thống kết nối chăm sóc sức khỏe 24/7
                        </span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102030] tracking-tight leading-[1.18] sm:leading-[1.15]">
                            Chăm sóc tận tâm,
                            <br />
                            <span className="text-[#00677c]">Kết nối chuyên môn</span>
                        </h1>

                        <p className="text-sm sm:text-base lg:text-lg text-slate-600 sm:text-slate-700 font-normal leading-relaxed max-w-lg">
                            Nền tảng kết nối sinh viên Y khoa và Điều dưỡng chuyên nghiệp với các gia đình cần hỗ trợ chăm sóc người cao tuổi, mang lại sự an tâm tuyệt đối.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">

                            {user?.role !== "caregiver" && (
                                <Link
                                    to="/family"
                                    className="inline-flex items-center justify-center gap-2 h-[48px] sm:h-[50px] px-6 sm:px-7 bg-[#00677c] text-white rounded-xl font-semibold hover:bg-[#005566] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base text-center"
                                >
                                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Tìm người chăm sóc
                                </Link>
                            )}

                            {user?.role !== "family" && (
                                <Link
                                    to={user?.role === "caregiver" ? "/caregiver/dashboard" : "/caregiver"}
                                    className="inline-flex items-center justify-center gap-2 h-[48px] sm:h-[50px] px-6 sm:px-7 bg-white/95 backdrop-blur-xs border-2 border-[#00677c] text-[#00677c] rounded-xl font-semibold hover:bg-teal-50 hover:border-[#005566] hover:text-[#005566] transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base text-center"
                                >
                                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {user?.role === "caregiver" ? "Bảng điều khiển Caregiver" : "Đăng ký đi làm"}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                2. TẠI SAO CHỌN CARELINK?
            ================================================== */}

            <section className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-10">

                <SectionHeading
                    eyebrow="Giá trị khác biệt"
                    title="Tại sao chọn CareLink?"
                    description="Sự an tâm của gia đình bắt đầu từ đội ngũ chăm sóc đáng tin cậy và một nền tảng kết nối minh bạch."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">

                    {/* FEATURE CARD 01 */}
                    <div className="lg:col-span-4">
                        <FeatureCard feature={featureCards[0]} index={0} />
                    </div>

                    {/* FEATURE HIGHLIGHT */}
                    <article className="lg:col-span-8 relative flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-gradient-to-br from-[#003846] via-[#00586a] to-[#00677c] shadow-[0_10px_30px_rgba(0,65,80,0.13)] group">

                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full border border-white/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                        <div className="absolute bottom-0 left-1/2 w-44 h-44 rounded-full border border-white/10 translate-y-1/2 pointer-events-none" />

                        <div className="relative z-10 p-8 flex flex-col justify-center w-full sm:w-3/5 text-white">

                            <span className="text-xs font-semibold text-teal-100/80 tracking-wider uppercase mb-3">
                                CareLink Commitment
                            </span>

                            <h3 className="text-2xl font-bold mb-4 leading-snug">
                                An tâm cho mọi gia đình
                            </h3>

                            <p className="text-teal-50/85 text-sm leading-relaxed mb-8">
                                Hệ thống giám sát lộ trình chăm sóc, bảo hiểm y tế đi kèm và báo cáo sức khỏe chi tiết được gửi trực tiếp đến người thân mỗi ngày.
                            </p>

                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/20">
                                <div>
                                    <strong className="text-3xl font-bold block tracking-tight">5000+</strong>
                                    <span className="text-xs text-teal-100/80 mt-1 block">Gia đình tin dùng</span>
                                </div>

                                <div>
                                    <strong className="text-3xl font-bold block tracking-tight">1200+</strong>
                                    <span className="text-xs text-teal-100/80 mt-1 block">Điều dưỡng viên</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="hidden sm:block relative w-2/5 min-h-full overflow-hidden"
                            style={{
                                backgroundImage: `url(https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600)`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#004c5d]/35 to-transparent" />
                        </div>
                    </article>

                    {/* FEATURE CARDS 02-04 */}
                    {featureCards.slice(1).map((feature, index) => (
                        <div key={feature.title} className="lg:col-span-4">
                            <FeatureCard feature={feature} index={index + 1} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ==================================================
                3. QUY TRÌNH HOẠT ĐỘNG
            ================================================== */}

            <section className="relative w-full bg-[#f5f8f9] py-20 border-y border-slate-200/80 overflow-hidden">

                <div className="absolute top-0 right-0 w-72 h-72 bg-[#dceff1]/35 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">

                    <SectionHeading
                        eyebrow="Đơn giản và thuận tiện"
                        title="Quy trình hoạt động"
                        description="Dễ dàng tìm kiếm sự hỗ trợ chuyên nghiệp chỉ trong 4 bước."
                    />

                    <div className="relative">

                        {/* CONNECTING LINE - DESKTOP */}
                        <div className="hidden lg:block absolute top-[38px] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-[#c9e1e4] via-[#00677c]/35 to-[#c9e1e4] z-0" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                            {processSteps.map((step, index) => (
                                <ProcessStep
                                    key={step.title}
                                    step={step}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                4. ĐỘI NGŨ ĐIỀU DƯỠNG TIÊU BIỂU
            ================================================== */}

            <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 flex flex-col gap-8">

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

                    <div>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#00677c] mb-2">
                            <span className="w-5 h-px bg-[#00677c]/50" />
                            Đội ngũ của chúng tôi
                        </span>

                        <h2 className="text-3xl font-bold text-[#102030] tracking-tight mb-2">
                            Đội ngũ điều dưỡng tiêu biểu
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Gặp gỡ những người đồng hành tận tâm nhất của chúng tôi
                        </p>
                    </div>

                    <Link
                        to="/family"
                        className="inline-flex items-center gap-2 font-semibold text-[#00677c] text-sm hover:gap-3 transition-all duration-200 w-fit group"
                    >
                        Xem tất cả ứng viên

                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {caregivers.map((caregiver) => (
                        <CaregiverCard
                            key={caregiver.name}
                            caregiver={caregiver}
                        />
                    ))}
                </div>
            </section>

            {/* ==================================================
                5. CTA BANNER CUỐI TRANG
            ================================================== */}

            <section className="w-full pt-2 pb-12 px-4 sm:px-6 lg:px-8">

                <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-br from-[#f4f9fa] via-white to-[#edf5f7] border border-[#dce9ec] p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_8px_30px_rgba(15,35,45,0.045)]">

                    {/* DECORATIVE ELEMENTS */}
                    <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full border border-[#00677c]/[0.07] pointer-events-none" />
                    <div className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full border border-[#00677c]/[0.07] pointer-events-none" />

                    <div className="absolute top-0 right-0 w-52 h-52 bg-[#d9eef0]/30 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-4">

                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs font-semibold text-[#00677c] shadow-sm border border-[#dce9ec]">
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

                            {user?.role !== "caregiver" && (
                                <Link
                                    to="/family"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#00677c] text-white font-semibold text-sm sm:text-base rounded-xl hover:bg-[#005466] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 shadow-sm group"
                                >
                                    <span>Tôi cần tìm người chăm sóc</span>

                                    <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            )}

                            {user?.role !== "family" && (
                                <Link
                                    to={user?.role === "caregiver" ? "/caregiver/dashboard" : "/caregiver/choose-role"}
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base rounded-xl border border-slate-300 hover:border-[#00677c] hover:text-[#00677c] transition-all duration-200 hover:-translate-y-0.5 shadow-sm group"
                                >
                                    <svg className="w-4.5 h-4.5 text-[#00677c] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.765z" />
                                    </svg>

                                    <span>
                                        {user?.role === "caregiver"
                                            ? "Vào Bảng điều khiển Caregiver"
                                            : "Tôi muốn đăng ký đi làm"}
                                    </span>
                                </Link>
                            )}
                        </div>

                        {/* TRUST POINTS */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mt-3 text-xs text-slate-500 font-medium">

                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-[#087e78] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                100% nhân sự y tế xác thực
                            </span>

                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-[#087e78] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Hỗ trợ & kết nối nhanh 24/7
                            </span>

                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-[#087e78] shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
