import React from "react";
import { Link } from "react-router-dom";

/* =========================================================
   DỮ LIỆU TRANG
========================================================= */

const benefits = [
    {
        id: "experience",
        title: "Tích lũy kinh nghiệm thực tế",
        desc: "Có cơ hội vận dụng kiến thức đã học, rèn luyện kỹ năng chăm sóc cơ bản và tích lũy kinh nghiệm trong quá trình đồng hành cùng người bệnh.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
        theme: "light",
    },
    {
        id: "flexibility",
        title: "Chủ động thời gian",
        desc: "Lựa chọn những ca chăm sóc phù hợp với lịch học, lịch trực và kế hoạch cá nhân, giúp bạn cân bằng tốt hơn giữa công việc và cuộc sống.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
            </svg>
        ),
        theme: "dark",
    },
    {
        id: "income",
        title: "Gia tăng thu nhập",
        desc: "Nhận thù lao theo từng ca chăm sóc với thông tin rõ ràng, giúp bạn chủ động hơn trong việc trang trải học phí và chi phí sinh hoạt.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
        theme: "mint",
    },
    {
        id: "community",
        title: "Đồng hành và phát triển",
        desc: "Từng bước hoàn thiện kỹ năng giao tiếp, tinh thần trách nhiệm và thái độ làm việc chuyên nghiệp trong môi trường chăm sóc tại nhà.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 2.25 2.25L15 9.75m-2.48-5.72A11.956 11.956 0 0 1 12 2.944a11.956 11.956 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        theme: "light",
    },
];

const steps = [
    {
        num: "01",
        title: "Đăng ký thông tin",
        desc: "Điền thông tin cá nhân, trình độ học vấn và cung cấp các giấy tờ liên quan đến quá trình học tập hoặc hành nghề.",
    },
    {
        num: "02",
        title: "Xác minh hồ sơ",
        desc: "CareLink tiếp nhận và kiểm tra thông tin, giấy tờ để hỗ trợ xác định mức độ phù hợp với công việc chăm sóc.",
    },
    {
        num: "03",
        title: "Trao đổi và đánh giá",
        desc: "Trao đổi về kỹ năng, kinh nghiệm, thời gian có thể làm việc và những yêu cầu cần thiết trước khi tham gia.",
    },
    {
        num: "04",
        title: "Bắt đầu nhận lịch",
        desc: "Sau khi hồ sơ được thông qua, bạn có thể tìm hiểu các yêu cầu chăm sóc phù hợp với năng lực và thời gian của mình.",
    },
];

const testimonials = [
    {
        name: "Lê Hoàng Nam",
        role: "Sinh viên Y đa khoa · Năm 4",
        quote:
            "CareLink giúp mình có thêm cơ hội vận dụng kiến thức đã học và chủ động hơn về thu nhập. Mỗi lần nhận được lời cảm ơn đều là một động lực rất lớn.",
        avatar:
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=80",
        featured: false,
    },
    {
        name: "Nguyễn Thị Mai",
        role: "Điều dưỡng viên · 2 năm kinh nghiệm",
        quote:
            "Mình thích việc có thể chủ động sắp xếp thời gian và tìm hiểu thông tin ca chăm sóc trước khi nhận lịch. Điều đó giúp mình cân đối công việc tốt hơn.",
        avatar:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=80",
        featured: true,
    },
    {
        name: "Trần Thu Hà",
        role: "Sinh viên Điều dưỡng · Năm 3",
        quote:
            "Mình muốn trau dồi thêm kỹ năng giao tiếp và cách đồng hành cùng người cao tuổi. Đây cũng là cơ hội để mình học hỏi và trưởng thành hơn.",
        avatar:
            "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=80",
        featured: false,
    },
];

/* =========================================================
   BIỂU TƯỢNG DÙNG CHUNG
========================================================= */

function ArrowIcon({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m13 6 6 6-6 6" />
        </svg>
    );
}

function ShieldIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3 20 6v5c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-3Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
        </svg>
    );
}

function HeartIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
            />
        </svg>
    );
}

function CheckIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
        </svg>
    );
}

/* =========================================================
   TRANG DÀNH CHO NGƯỜI CHĂM SÓC
========================================================= */

export default function ForCaregiver() {
    return (
        <main className="w-full overflow-hidden bg-[#F7F6F2] text-[#183538] antialiased">
            {/* =====================================================
                1. PHẦN GIỚI THIỆU
            ===================================================== */}
            <section className="relative">
                <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#DDEDE8]/70 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-[#EAE6D9]/60 blur-3xl" />

                <div className="relative mx-auto max-w-[1320px] px-5 pb-16 pt-10 sm:px-8 lg:px-10 lg:pb-20 lg:pt-14">
                    <div className="grid items-center gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">
                        {/* Nội dung bên trái */}
                        <div className="max-w-[620px]">
                            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#D5E5DF] bg-white/80 px-3.5 py-2">
                                <span className="h-2 w-2 rounded-full bg-[#218579]" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#26776F]">
                                    Dành cho điều dưỡng và sinh viên ngành Y
                                </span>
                            </div>

                            <h1 className="text-[39px] font-semibold leading-[1.12] tracking-[-0.045em] text-[#173538] sm:text-[48px] lg:text-[56px]">
                                Chăm sóc bằng
                                <span className="block text-[#218579]">
                                    sự tận tâm.
                                </span>
                                <span className="block">Phát triển bằng trải nghiệm.</span>
                            </h1>

                            <p className="mt-6 max-w-[550px] text-[15px] leading-7 text-[#697B78] sm:text-base">
                                Cùng CareLink mang sự chăm sóc chu đáo đến với
                                các gia đình, trau dồi kỹ năng thực tế và chủ
                                động tìm kiếm công việc phù hợp với bản thân.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/caregiver/choose-role"
                                    id="cta-hero-start"
                                    className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-[#218579] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_9px_22px_-10px_rgba(33,133,121,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#176D64] hover:shadow-[0_12px_25px_-10px_rgba(33,133,121,0.75)]"
                                >
                                    Đăng ký tham gia
                                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>

                                <a
                                    href="#joining-process"
                                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#CCDAD5] bg-white/80 px-6 py-3.5 text-sm font-semibold text-[#294847] transition-all hover:border-[#218579] hover:bg-white hover:text-[#218579]"
                                >
                                    Tìm hiểu quy trình
                                </a>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#DCE5E0] pt-6">
                                <div className="flex items-center gap-2 text-[12px] font-medium text-[#5D716D]">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E2EFEB] text-[#218579]">
                                        <ShieldIcon className="h-4 w-4" />
                                    </span>
                                    Quy trình xét duyệt hồ sơ
                                </div>

                                <div className="flex items-center gap-2 text-[12px] font-medium text-[#5D716D]">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E2EFEB] text-[#218579]">
                                        <HeartIcon className="h-4 w-4" />
                                    </span>
                                    Đồng hành cùng gia đình
                                </div>
                            </div>
                        </div>

                        {/* Hình ảnh chính: giữ nguyên đường dẫn */}
                        <div className="relative mx-auto w-full max-w-[480px] lg:ml-auto">
                            <div className="absolute -inset-3 rounded-[32px] border border-[#D8E6E0] sm:-inset-4" />

                            <div className="relative aspect-[4/4.35] overflow-hidden rounded-[27px] bg-[#D8E9E4] shadow-[0_24px_55px_-28px_rgba(24,64,60,0.42)]">
                                <img
                                    src="/images/caregiver-hero.jpg"
                                    alt="Người chăm sóc của CareLink"
                                    className="h-full w-full object-cover object-top"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#102F31]/30 via-transparent to-white/5" />
                            </div>

                            {/* Thẻ thông tin nổi */}
                            <div className="absolute -bottom-4 left-3 right-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_14px_40px_-20px_rgba(23,53,56,0.4)] backdrop-blur-md sm:-left-8 sm:right-8 sm:p-5">
                                <div className="flex items-start gap-3.5">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F0EC] text-[#218579]">
                                        <ShieldIcon className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-[#203D3D]">
                                            Hồ sơ rõ ràng, quy trình minh bạch
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-[#71817D]">
                                            Cung cấp thông tin cần thiết để
                                            được xem xét trước khi tham gia.
                                        </p>
                                    </div>

                                    <div className="ml-auto hidden shrink-0 rounded-full bg-[#E6F3EC] px-2.5 py-1 text-[10px] font-semibold text-[#28765B] sm:block">
                                        <span className="inline-flex items-center gap-1">
                                            <CheckIcon className="h-3 w-3" />
                                            Rõ ràng
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                2. QUYỀN LỢI
            ===================================================== */}
            <section className="border-y border-[#E0E7E1] bg-[#EEF2ED]">
                <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-10 lg:py-[76px]">
                    <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-[670px]">
                            <div className="mb-3 flex items-center gap-2.5">
                                <span className="h-px w-7 bg-[#218579]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#218579]">
                                    Cùng CareLink phát triển
                                </span>
                            </div>

                            <h2 className="text-[31px] font-semibold leading-tight tracking-[-0.035em] text-[#183538] sm:text-[39px]">
                                Công việc ý nghĩa,
                                <span className="block text-[#218579]">
                                    giá trị lâu dài.
                                </span>
                            </h2>
                        </div>

                        <p className="max-w-[400px] text-sm leading-6 text-[#697B76]">
                            Tìm kiếm cơ hội phù hợp, phát triển năng lực và
                            đóng góp những điều thiết thực cho người cần chăm sóc.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {benefits.map((benefit) => {
                            const isDark = benefit.theme === "dark";
                            const isMint = benefit.theme === "mint";

                            return (
                                <article
                                    key={benefit.id}
                                    className={[
                                        "group flex min-h-[245px] flex-col rounded-[21px] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_-25px_rgba(24,64,60,0.4)]",
                                        isDark
                                            ? "border-[#1C4B49] bg-[#1B4442] text-white"
                                            : isMint
                                                ? "border-[#D2E7DF] bg-[#DFEEE7] text-[#183538]"
                                                : "border-[#E1E6DF] bg-[#FCFBF8] text-[#183538]",
                                    ].join(" ")}
                                >
                                    <div
                                        className={[
                                            "mb-5 flex h-11 w-11 items-center justify-center rounded-xl",
                                            isDark
                                                ? "bg-white/10 text-[#B7E0D6]"
                                                : "bg-[#E4F0EB] text-[#218579]",
                                        ].join(" ")}
                                    >
                                        {benefit.icon}
                                    </div>

                                    <h3
                                        className={[
                                            "text-[16px] font-bold leading-6 tracking-[-0.015em]",
                                            isDark ? "text-white" : "text-[#244342]",
                                        ].join(" ")}
                                    >
                                        {benefit.title}
                                    </h3>

                                    <p
                                        className={[
                                            "mt-3 text-[13px] leading-[1.8]",
                                            isDark ? "text-white/65" : "text-[#6C7C77]",
                                        ].join(" ")}
                                    >
                                        {benefit.desc}
                                    </p>

                                    <div
                                        className={[
                                            "mt-auto flex items-center gap-2 pt-5 text-[11px] font-semibold",
                                            isDark ? "text-[#B7E0D6]" : "text-[#218579]",
                                        ].join(" ")}
                                    >
                                        <span className="h-px w-5 bg-current opacity-70" />
                                        Cùng nhau tiến bộ
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =====================================================
                3. QUY TRÌNH THAM GIA
            ===================================================== */}
            <section id="joining-process" className="bg-[#F7F6F2]">
                <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-10 lg:py-[76px]">
                    <div className="grid items-start gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
                        {/* Phần giới thiệu bên trái */}
                        <div className="lg:sticky lg:top-24">
                            <div className="mb-4 flex items-center gap-2.5">
                                <span className="h-px w-7 bg-[#218579]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#218579]">
                                    Bắt đầu cùng CareLink
                                </span>
                            </div>

                            <h2 className="text-[33px] font-semibold leading-[1.13] tracking-[-0.04em] text-[#183538] sm:text-[40px]">
                                Bốn bước để
                                <span className="block text-[#218579]">
                                    bắt đầu hành trình.
                                </span>
                            </h2>

                            <p className="mt-5 max-w-[420px] text-sm leading-7 text-[#697B76]">
                                Từng bước rõ ràng giúp bạn chuẩn bị hồ sơ,
                                tìm hiểu yêu cầu và sẵn sàng tham gia công việc
                                chăm sóc phù hợp.
                            </p>

                            <div className="mt-7 rounded-[20px] border border-[#DCE6E0] bg-white p-5 sm:p-6">
                                <div className="flex items-start gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E4F0EB] text-[#218579]">
                                        <HeartIcon className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-[#254342]">
                                            Sự tận tâm luôn được trân trọng
                                        </h3>
                                        <p className="mt-2 text-xs leading-6 text-[#71817C]">
                                            Thái độ trách nhiệm, sự tôn trọng
                                            và khả năng lắng nghe là những điều
                                            quan trọng khi chăm sóc người khác.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/caregiver/choose-role"
                                className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#218579] transition-colors hover:text-[#155E57]"
                            >
                                Chuẩn bị hồ sơ đăng ký
                                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* Các bước bên phải */}
                        <div className="rounded-[24px] border border-[#E0E6DF] bg-[#FCFBF8] p-5 shadow-[0_12px_35px_-30px_rgba(24,64,60,0.3)] sm:p-7 lg:p-8">
                            {steps.map((step, index) => (
                                <div
                                    key={step.num}
                                    className={[
                                        "group relative flex gap-4 sm:gap-5",
                                        index !== steps.length - 1 ? "pb-7" : "",
                                    ].join(" ")}
                                >
                                    {/* Số thứ tự và đường nối */}
                                    <div className="flex shrink-0 flex-col items-center">
                                        <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#D7E7E0] bg-[#E9F2ED] text-[12px] font-bold text-[#218579] transition-all duration-200 group-hover:border-[#218579] group-hover:bg-[#218579] group-hover:text-white">
                                            {step.num}
                                        </div>

                                        {index !== steps.length - 1 && (
                                            <div className="mt-2 w-px flex-1 bg-[#DCE5DF]" />
                                        )}
                                    </div>

                                    {/* Nội dung từng bước */}
                                    <div className="min-w-0 flex-1 pt-1">
                                        <h3 className="text-[16px] font-bold tracking-[-0.015em] text-[#254342] sm:text-[17px]">
                                            {step.title}
                                        </h3>

                                        <p className="mt-2 max-w-[570px] text-[13px] leading-6 text-[#71817C] sm:text-sm">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                4. CHIA SẺ TỪ NGƯỜI THAM GIA
            ===================================================== */}
            <section className="relative overflow-hidden bg-[#173B3A]">
                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 10% 20%, #438E7F 0%, transparent 35%), radial-gradient(circle at 90% 80%, #2D7066 0%, transparent 35%)",
                    }}
                />

                <div className="relative mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-10 lg:py-[72px]">
                    <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2.5">
                                <span className="h-px w-7 bg-[#A8D9CD]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B7DED4]">
                                    Những câu chuyện đồng hành
                                </span>
                            </div>

                            <h2 className="text-[30px] font-semibold leading-tight tracking-[-0.035em] text-white sm:text-[38px]">
                                Chia sẻ từ những người
                                <span className="block text-[#B7DED4]">
                                    cùng chung sự tận tâm.
                                </span>
                            </h2>
                        </div>

                        <p className="max-w-[350px] text-sm leading-6 text-white/60">
                            Mỗi hành trình chăm sóc đều bắt đầu từ sự lắng nghe
                            và mong muốn mang lại điều tốt đẹp cho người khác.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {testimonials.map((person) => (
                            <article
                                key={person.name}
                                className={[
                                    "flex h-full flex-col rounded-[21px] border p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6",
                                    person.featured
                                        ? "border-white bg-[#FCFBF8] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.4)]"
                                        : "border-white/10 bg-white/[0.07] hover:bg-white/[0.11]",
                                ].join(" ")}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={person.avatar}
                                        alt={person.name}
                                        className="h-11 w-11 shrink-0 rounded-full border-2 border-white/40 object-cover"
                                    />

                                    <div className="min-w-0">
                                        <h3
                                            className={[
                                                "text-sm font-bold",
                                                person.featured
                                                    ? "text-[#254342]"
                                                    : "text-white",
                                            ].join(" ")}
                                        >
                                            {person.name}
                                        </h3>

                                        <p
                                            className={[
                                                "mt-1 text-[11px] leading-5",
                                                person.featured
                                                    ? "text-[#218579]"
                                                    : "text-white/55",
                                            ].join(" ")}
                                        >
                                            {person.role}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={[
                                        "mt-5 flex items-center gap-1",
                                        person.featured
                                            ? "text-[#D5A74A]"
                                            : "text-[#E4C47A]",
                                    ].join(" ")}
                                    aria-label="Đánh giá năm sao"
                                >
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className="h-4 w-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            aria-hidden="true"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
                                        </svg>
                                    ))}
                                </div>

                                <p
                                    className={[
                                        "mt-4 flex-1 text-[13px] leading-[1.85]",
                                        person.featured
                                            ? "text-[#667773]"
                                            : "text-white/70",
                                    ].join(" ")}
                                >
                                    {person.quote}
                                </p>

                                <div
                                    className={[
                                        "mt-5 border-t pt-4 text-[10px] font-semibold uppercase tracking-[0.12em]",
                                        person.featured
                                            ? "border-[#E5EAE3] text-[#218579]"
                                            : "border-white/10 text-[#A8D9CD]",
                                    ].join(" ")}
                                >
                                    Hành trình chăm sóc
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* =====================================================
                5. LỜI KÊU GỌI ĐĂNG KÝ
            ===================================================== */}
            <section className="bg-[#EEF2ED]">
                <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-[68px]">
                    <div className="relative overflow-hidden rounded-[26px] border border-[#D6E5DD] bg-[#FCFBF8] px-6 py-10 shadow-[0_18px_45px_-35px_rgba(24,64,60,0.4)] sm:px-10 sm:py-12 lg:px-14">
                        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#DCEDE5]/80 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#EDE9DB]/70 blur-2xl" />

                        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                            <div className="max-w-[650px]">
                                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2F0E9] text-[#218579]">
                                    <HeartIcon className="h-5 w-5" />
                                </div>

                                <h2 className="text-[29px] font-semibold leading-[1.17] tracking-[-0.04em] text-[#183538] sm:text-[38px]">
                                    Sẵn sàng bắt đầu
                                    <span className="block text-[#218579]">
                                        hành trình ý nghĩa của bạn?
                                    </span>
                                </h2>

                                <p className="mt-4 max-w-[550px] text-sm leading-7 text-[#697B76]">
                                    Đăng ký thông tin để bắt đầu quy trình xét
                                    duyệt và tìm hiểu cơ hội chăm sóc phù hợp
                                    với năng lực của bạn.
                                </p>
                            </div>

                            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
                                <Link
                                    to="/caregiver/choose-role"
                                    id="cta-footer-start"
                                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#218579] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(33,133,121,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#176D64]"
                                >
                                    Đăng ký tham gia
                                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>

                                <a
                                    href="#joining-process"
                                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#CCDAD5] bg-white px-6 py-3.5 text-sm font-semibold text-[#294847] transition-all hover:border-[#218579] hover:text-[#218579]"
                                >
                                    Xem các bước tham gia
                                </a>
                            </div>
                        </div>

                        <div className="relative mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#E1E8E1] pt-5 text-xs text-[#71817C]">
                            <span className="inline-flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-[#218579]" />
                                Thông tin đăng ký rõ ràng
                            </span>

                            <span className="inline-flex items-center gap-2">
                                <CheckIcon className="h-4 w-4 text-[#218579]" />
                                Xét duyệt hồ sơ trước khi tham gia
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}