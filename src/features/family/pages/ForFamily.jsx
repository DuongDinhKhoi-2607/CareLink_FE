import React from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";

// ============================================================
// DATA
// ============================================================

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

const verificationSteps = [
    {
        number: "01",
        title: "Xác minh hồ sơ",
        description:
            "Kiểm tra thông tin cá nhân và hồ sơ chuyên môn trước khi tham gia nền tảng.",
    },
    {
        number: "02",
        title: "Xác thực chuyên môn",
        description:
            "Đối chiếu bằng cấp, chứng chỉ và kinh nghiệm phù hợp với từng nhóm dịch vụ.",
    },
    {
        number: "03",
        title: "Đánh giá & kết nối",
        description:
            "Đánh giá mức độ phù hợp để gia đình có thêm thông tin trước khi lựa chọn người chăm sóc.",
    },
];

const bookingSteps = [
    {
        number: "01",
        title: "Mô tả nhu cầu",
        description:
            "Cho chúng tôi biết người thân cần hỗ trợ gì, thời gian và khu vực chăm sóc.",
    },
    {
        number: "02",
        title: "Khám phá người chăm sóc",
        description:
            "Xem hồ sơ, chuyên môn và thông tin liên quan để tìm người phù hợp.",
    },
    {
        number: "03",
        title: "Xác nhận lịch chăm sóc",
        description:
            "Trao đổi, xác nhận lịch hẹn và bắt đầu hành trình chăm sóc tại nhà.",
    },
];

// ============================================================
// SMALL ICON COMPONENTS
// ============================================================

function CheckIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

function ArrowIcon({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}

function HeartIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
        </svg>
    );
}

function ShieldIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 3 20 6v5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function UserIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20c.8-3.6 3.2-5.5 7.5-5.5s6.7 1.9 7.5 5.5" />
        </svg>
    );
}

function ActivityIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12h4l2.2-6 4.1 12 2.2-6H21" />
        </svg>
    );
}

// ============================================================
// PAGE
// ============================================================

export default function ForFamily() {
    return (
        <div className="w-full bg-[#F7F6F2] text-[#102A2F] antialiased">

            {/* ========================================================
                1. HERO
            ======================================================== */}

            <section className="relative overflow-hidden">

                {/* Soft background decoration */}
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#DDEDEA]/50 blur-3xl pointer-events-none" />

                <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 lg:pt-16 pb-16 lg:pb-24">

                    <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-12 lg:gap-16 items-center">

                        {/* =========================
                            HERO COPY
                        ========================= */}

                        <div className="max-w-[590px]">

                            {/* Eyebrow */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-8 h-px bg-[#187D74]" />

                                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#187D74]">
                                    Dành cho gia đình
                                </span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-[42px] sm:text-[50px] lg:text-[55px] font-semibold tracking-[-0.045em] leading-[1.04] text-[#102A2F]">
                                Chăm sóc người thân,
                                <span className="block text-[#187D74]">
                                    an tâm ở nhà.
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="mt-7 max-w-[520px] text-[16px] sm:text-[17px] leading-7 text-[#657473]">
                                Kết nối gia đình với những người chăm sóc phù hợp
                                cho nhu cầu sức khỏe và sinh hoạt hằng ngày —
                                ngay tại không gian thân thuộc của người thân.
                            </p>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-9">

                                <Link
                                    to="/services"
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        h-12
                                        px-6
                                        rounded-xl
                                        bg-[#187D74]
                                        text-white
                                        text-sm
                                        font-semibold
                                        shadow-[0_10px_25px_-12px_rgba(24,125,116,0.7)]
                                        hover:bg-[#126A63]
                                        hover:-translate-y-0.5
                                        transition-all
                                    "
                                >
                                    Tìm người chăm sóc
                                    <ArrowIcon />
                                </Link>

                                <Link
                                    to="/services"
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        h-12
                                        px-6
                                        rounded-xl
                                        border
                                        border-[#CBD5D2]
                                        bg-white/60
                                        text-[#294247]
                                        text-sm
                                        font-semibold
                                        hover:bg-white
                                        hover:border-[#AFC0BC]
                                        transition-all
                                    "
                                >
                                    Khám phá dịch vụ
                                </Link>
                            </div>

                            {/* Trust line */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 pt-7 border-t border-[#DDE3E0]">

                                <div className="flex items-center gap-2 text-[12px] text-[#61706F]">
                                    <ShieldIcon className="w-4 h-4 text-[#187D74]" />
                                    <span>Thông tin hồ sơ rõ ràng</span>
                                </div>

                                <div className="flex items-center gap-2 text-[12px] text-[#61706F]">
                                    <HeartIcon className="w-4 h-4 text-[#187D74]" />
                                    <span>Chăm sóc tại nhà</span>
                                </div>

                            </div>
                        </div>

                        {/* =========================
                            HERO IMAGE
                        ========================= */}

                        <div className="relative">

                            <div className="relative overflow-hidden rounded-[28px] aspect-[4/3] lg:aspect-[1.08/1] shadow-[0_28px_70px_-30px_rgba(15,42,47,0.35)]">

                                <img
                                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=85&w=1400"
                                    alt="Người chăm sóc đồng hành cùng người cao tuổi tại nhà"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Soft image gradient */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#102A2F]/20 via-transparent to-white/10 pointer-events-none" />

                            </div>

                            {/* Floating information — intentionally subtle */}
                            <div className="absolute left-5 sm:left-7 bottom-5 sm:bottom-7">

                                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/92 backdrop-blur-md border border-white/70 shadow-[0_12px_35px_-15px_rgba(15,42,47,0.3)]">

                                    <div className="w-9 h-9 rounded-xl bg-[#E4F1EE] flex items-center justify-center text-[#187D74]">
                                        <CheckIcon className="w-4 h-4" />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-semibold text-[#263C40]">
                                            Quy trình lựa chọn rõ ràng
                                        </p>

                                        <p className="text-[10px] text-[#7A8785] mt-0.5">
                                            Tìm hiểu trước khi kết nối
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
                2. SERVICES
            ======================================================== */}

            <section className="bg-[#EEEFEA] border-y border-[#E0E3DE]">

                <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-20 lg:py-24">

                    {/* Section heading */}
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">

                        <div className="max-w-[650px]">

                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-7 h-px bg-[#187D74]" />

                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#187D74]">
                                    Dịch vụ chăm sóc
                                </span>
                            </div>

                            <h2 className="text-[34px] sm:text-[40px] font-semibold tracking-[-0.035em] leading-tight text-[#102A2F]">
                                Một người chăm sóc phù hợp
                                <span className="block text-[#687675]">
                                    có thể tạo nên rất nhiều khác biệt.
                                </span>
                            </h2>

                        </div>

                        <p className="max-w-[380px] text-sm leading-6 text-[#697876]">
                            Từ hỗ trợ sinh hoạt hằng ngày đến theo dõi sức khỏe,
                            gia đình có thể lựa chọn dịch vụ dựa trên nhu cầu
                            thực tế của người thân.
                        </p>

                    </div>

                    {/* Editorial service grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                        {/* Large service */}
                        <div className="lg:col-span-7">
                            <ServiceCard
                                title="Chăm sóc sau phẫu thuật"
                                description="Hỗ trợ quá trình phục hồi tại nhà với các công việc chăm sóc phù hợp và sự theo dõi cần thiết."
                                tags={recoveryServices}
                                icon={
                                    <ActivityIcon className="w-5 h-5 text-[#187D74]" />
                                }
                                className="
                                    h-full
                                    bg-[#FBFAF7]
                                    border
                                    border-[#E1E5E1]
                                    rounded-[24px]
                                    shadow-none
                                    hover:shadow-[0_18px_40px_-28px_rgba(15,42,47,0.35)]
                                    transition-all
                                "
                            />
                        </div>

                        {/* Dark editorial card */}
                        <div className="lg:col-span-5">

                            <article className="
                                h-full
                                min-h-[280px]
                                relative
                                overflow-hidden
                                rounded-[24px]
                                bg-[#16383B]
                                text-white
                                p-8
                                sm:p-9
                                flex
                                flex-col
                                justify-between
                            ">

                                {/* Decorative circle */}
                                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#4AA69C]/20 blur-2xl" />

                                <div className="relative z-10">

                                    <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                                        <HeartIcon className="w-5 h-5 text-[#B9E1DB]" />
                                    </div>

                                    <h3 className="mt-7 text-[25px] font-semibold tracking-[-0.025em]">
                                        Hỗ trợ sinh hoạt
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-white/65 max-w-[400px]">
                                        Những hỗ trợ nhỏ trong cuộc sống hằng ngày
                                        có thể giúp người thân cảm thấy thoải mái
                                        và được đồng hành hơn.
                                    </p>

                                </div>

                                <div className="relative z-10 flex flex-wrap gap-2 mt-8">

                                    {dailyAssistanceTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="
                                                px-3
                                                py-1.5
                                                rounded-lg
                                                bg-white/[0.08]
                                                border
                                                border-white/10
                                                text-[11px]
                                                text-white/80
                                            "
                                        >
                                            {tag}
                                        </span>
                                    ))}

                                </div>

                            </article>

                        </div>

                        {/* Smaller service */}
                        <div className="lg:col-span-5">

                            <ServiceCard
                                title="Theo dõi sức khỏe"
                                description="Hỗ trợ theo dõi các chỉ số và tình trạng sức khỏe theo nhu cầu của từng người."
                                icon={
                                    <ActivityIcon className="w-5 h-5 text-[#187D74]" />
                                }
                                className="
                                    h-full
                                    bg-[#FBFAF7]
                                    border
                                    border-[#E1E5E1]
                                    rounded-[24px]
                                    shadow-none
                                    hover:shadow-[0_18px_40px_-28px_rgba(15,42,47,0.35)]
                                    transition-all
                                "
                            />

                        </div>

                        {/* Image editorial card */}
                        <div className="lg:col-span-7">

                            <article className="
                                h-full
                                min-h-[260px]
                                relative
                                overflow-hidden
                                rounded-[24px]
                                bg-[#DCEAE7]
                            ">

                                <img
                                    src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=85&w=1000"
                                    alt="Chăm sóc người cao tuổi"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-r from-[#102A2F]/80 via-[#102A2F]/35 to-transparent" />

                                <div className="relative z-10 h-full min-h-[260px] p-8 sm:p-9 flex flex-col justify-end">

                                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70">
                                        Linh hoạt theo nhu cầu
                                    </span>

                                    <h3 className="mt-2 text-[26px] font-semibold text-white tracking-[-0.025em]">
                                        Chăm sóc tại nhà
                                    </h3>

                                    <p className="mt-2 max-w-[430px] text-sm leading-6 text-white/75">
                                        Gia đình có thể tìm kiếm và kết nối với
                                        người chăm sóc phù hợp với thời gian
                                        và nhu cầu cụ thể.
                                    </p>

                                </div>

                            </article>

                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================================
                3. VERIFICATION
            ======================================================== */}

            <section className="bg-[#F7F6F2]">

                <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-20 lg:py-28">

                    <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-14 lg:gap-24 items-start">

                        {/* Left */}
                        <div className="lg:sticky lg:top-24">

                            <div className="flex items-center gap-3 mb-5">
                                <span className="w-7 h-px bg-[#187D74]" />

                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#187D74]">
                                    Minh bạch & tin cậy
                                </span>
                            </div>

                            <h2 className="text-[36px] sm:text-[42px] font-semibold tracking-[-0.04em] leading-[1.08] text-[#102A2F]">
                                Biết rõ người
                                <span className="block text-[#187D74]">
                                    bạn đang kết nối.
                                </span>
                            </h2>

                            <p className="mt-6 text-[15px] leading-7 text-[#697876] max-w-[460px]">
                                CareLink hướng đến một quy trình minh bạch,
                                nơi gia đình có thể tìm hiểu thông tin trước
                                khi lựa chọn người chăm sóc.
                            </p>

                            <div className="mt-8 flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-[#E3EFEC] flex items-center justify-center text-[#187D74]">
                                    <ShieldIcon className="w-5 h-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-[#304447]">
                                        Quy trình xác minh
                                    </p>

                                    <p className="text-[11px] text-[#7B8785] mt-0.5">
                                        Từ hồ sơ đến thông tin chuyên môn
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Right timeline */}
                        <div className="relative">

                            {/* Vertical line */}
                            <div className="absolute left-[19px] top-5 bottom-5 w-px bg-[#D6DFDC]" />

                            <div className="space-y-10">

                                {verificationSteps.map((step) => (
                                    <div
                                        key={step.number}
                                        className="relative flex gap-6"
                                    >

                                        {/* Number */}
                                        <div className="
                                            relative
                                            z-10
                                            w-10
                                            h-10
                                            shrink-0
                                            rounded-full
                                            bg-[#187D74]
                                            text-white
                                            flex
                                            items-center
                                            justify-center
                                            text-[11px]
                                            font-semibold
                                            shadow-[0_5px_15px_-8px_rgba(24,125,116,0.7)]
                                        ">
                                            {step.number}
                                        </div>

                                        {/* Content */}
                                        <div className="pt-1 pb-2">

                                            <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-[#20373B]">
                                                {step.title}
                                            </h3>

                                            <p className="mt-2 max-w-[570px] text-[14px] leading-6 text-[#71807E]">
                                                {step.description}
                                            </p>

                                        </div>

                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================================
                4. HOW IT WORKS
            ======================================================== */}

            <section className="bg-[#16383B] text-white overflow-hidden">

                <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-20 lg:py-24">

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">

                        <div>

                            <div className="flex items-center gap-3 mb-5">
                                <span className="w-7 h-px bg-[#8FCBC3]" />

                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A9D8D2]">
                                    Bắt đầu thật đơn giản
                                </span>
                            </div>

                            <h2 className="text-[36px] sm:text-[44px] font-semibold tracking-[-0.04em] leading-tight">
                                Từ nhu cầu
                                <span className="text-[#A9D8D2]">
                                    {" "}đến kết nối.
                                </span>
                            </h2>

                        </div>

                        <p className="max-w-[390px] text-sm leading-6 text-white/60">
                            Một quy trình ngắn gọn để gia đình có thể tập trung
                            vào điều quan trọng nhất: người thân của mình.
                        </p>

                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/10">

                        {bookingSteps.map((step, index) => (
                            <div
                                key={step.number}
                                className={`
                                    relative
                                    py-9
                                    md:px-8
                                    ${index !== 0 ? "md:border-l border-white/10" : ""}
                                `}
                            >

                                <span className="text-[12px] font-semibold tracking-[0.16em] text-[#8FCBC3]">
                                    {step.number}
                                </span>

                                <h3 className="mt-5 text-[23px] font-semibold tracking-[-0.02em]">
                                    {step.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-white/55 max-w-[330px]">
                                    {step.description}
                                </p>

                            </div>
                        ))}

                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-[#A9D8D2]" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    Bạn chưa biết bắt đầu từ đâu?
                                </p>

                                <p className="text-[11px] text-white/50 mt-0.5">
                                    Khám phá các dịch vụ phù hợp với gia đình.
                                </p>
                            </div>

                        </div>

                        <Link
                            to="/services"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                h-11
                                px-5
                                rounded-xl
                                bg-[#A9D8D2]
                                text-[#16383B]
                                text-sm
                                font-semibold
                                hover:bg-white
                                transition-colors
                            "
                        >
                            Xem người chăm sóc
                            <ArrowIcon className="w-4 h-4" />
                        </Link>

                    </div>

                </div>
            </section>

            {/* ========================================================
                5. FINAL CTA
            ======================================================== */}

            <section className="bg-[#F7F6F2]">

                <div className="max-w-[1000px] mx-auto px-5 sm:px-8 py-24 lg:py-32 text-center">

                    <div className="flex justify-center mb-6">

                        <div className="w-11 h-11 rounded-2xl bg-[#E1EFEC] text-[#187D74] flex items-center justify-center">
                            <HeartIcon className="w-5 h-5" />
                        </div>

                    </div>

                    <h2 className="text-[36px] sm:text-[46px] font-semibold tracking-[-0.045em] leading-[1.08] text-[#102A2F]">
                        Để việc chăm sóc
                        <span className="block text-[#187D74]">
                            trở nên nhẹ nhàng hơn.
                        </span>
                    </h2>

                    <p className="max-w-[560px] mx-auto mt-6 text-[15px] leading-7 text-[#6D7B79]">
                        Bắt đầu tìm hiểu các dịch vụ và người chăm sóc phù hợp
                        với nhu cầu của gia đình bạn.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-9">

                        <Link
                            to="/services"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                h-12
                                px-7
                                rounded-xl
                                bg-[#187D74]
                                text-white
                                text-sm
                                font-semibold
                                shadow-[0_10px_25px_-12px_rgba(24,125,116,0.65)]
                                hover:bg-[#126A63]
                                hover:-translate-y-0.5
                                transition-all
                            "
                        >
                            Tìm người chăm sóc
                            <ArrowIcon />
                        </Link>

                        <Link
                            to="/"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                h-12
                                px-7
                                rounded-xl
                                bg-white
                                border
                                border-[#D8DFDC]
                                text-[#304447]
                                text-sm
                                font-semibold
                                hover:bg-[#FBFAF7]
                                transition-all
                            "
                        >
                            Tìm hiểu thêm về CareLink
                        </Link>

                    </div>

                </div>
            </section>

        </div>
    );
}