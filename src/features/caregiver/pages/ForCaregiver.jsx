import React from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────── Static data ─────────────────────────── */

const benefits = [
    {
        id: "clinical-experience",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
        title: "Clinical experience",
        desc: "Trực tiếp tiếp xúc với bệnh nhân và thực hành các kỹ năng chăm sóc cơ bản dưới sự hỗ trợ từ nền tảng. Đây là bước đệm hoàn hảo cho sự nghiệp điều dưỡng và bác sĩ tương lai của bạn.",
        style: "bg-white border border-slate-100",
        iconStyle: "bg-[#e8f4f8] text-[#00677c]",
        titleStyle: "text-[#102030]",
        descStyle: "text-slate-500",
        showAvatars: true,
    },
    {
        id: "flexible-hours",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
        ),
        title: "Flexible hours",
        desc: "Làm chủ thời gian của bạn. Tự do lựa chọn ca làm việc phù hợp với lịch học, quản sự, làm sáng hay thi cử.",
        style: "bg-[#102030]",
        iconStyle: "bg-white/10 text-white",
        titleStyle: "text-white",
        descStyle: "text-white/60",
        showAvatars: false,
    },
    {
        id: "extra-income",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: "Extra income",
        desc: "Mức thu nhập cạnh tranh được chi trả minh bạch theo từng ca làm việc. Thưởng thêm dựa trên đánh giá tích cực từ khách hàng.",
        style: "bg-[#dceef3]",
        iconStyle: "bg-[#00677c]/15 text-[#00677c]",
        titleStyle: "text-[#102030]",
        descStyle: "text-slate-600",
        showAvatars: false,
    },
    {
        id: "community-support",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: "Community & Support",
        desc: "Tham gia cộng đồng CareLink để học hỏi kinh nghiệm từ các anh chị khóa trên và nhận hỗ trợ 24/7 từ đội ngũ quản lý chuyên môn.",
        style: "bg-white border border-slate-100",
        iconStyle: "bg-[#e8f4f8] text-[#00677c]",
        titleStyle: "text-[#102030]",
        descStyle: "text-slate-500",
        showLink: true,
    },
];

const steps = [
    {
        num: 1,
        title: "Đăng ký thông tin",
        desc: "Cung cấp thông tin cá nhân, trình độ học vấn và các chứng chỉ liên quan (Thẻ sinh viên, chứng chỉ hành nghề nếu có).",
    },
    {
        num: 2,
        title: "Xác thực hồ sơ",
        desc: "Đội ngũ chuyên gia của CareLink sẽ kiểm tra và xác thực thông tin chuyên môn của bạn trong vòng 24–48 giờ làm việc.",
    },
    {
        num: 3,
        title: "Phỏng vấn trực tuyến",
        desc: "Một buổi trò chuyện ngắn để tìm hiểu về kỹ năng giao tiếp và thái độ làm việc của bạn, đảm bảo chất lượng dịch vụ tốt nhất.",
    },
    {
        num: 4,
        title: "Nhận việc ngay",
        desc: 'Bật trạng thái "Online" trên ứng dụng và bắt đầu nhận các yêu cầu chăm sóc từ những gia đình xung quanh bạn.',
    },
];

const testimonials = [
    {
        name: "Lê Hoàng Nam",
        role: "Sinh viên Y đa khoa · Năm 4",
        quote:
            '"CareLink không chỉ giúp mình có thêm thu nhập trang trải học phí mà còn là nơi mình được thực hành những gì đã học. Những lời cảm ơn của bệnh nhân là động lực rất lớn."',
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=80",
        featured: false,
    },
    {
        name: "Nguyễn Thị Mai",
        role: "Điều dưỡng viên · 2 năm KN",
        quote:
            '"Nền tảng rất minh bạch và dễ sử dụng. Mình có thể chủ động sắp xếp thời gian làm thêm sau giờ trực tại bệnh viện mà không cảm thấy bị áp lực."',
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=80",
        featured: true,
    },
    {
        name: "Trần Thu Hà",
        role: "SV Điều dưỡng · Năm 3",
        quote:
            '"Điều mình thích nhất là cộng đồng CareLink. Mọi người hỗ trợ nhau rất nhiều về kiến thức lẫn kỹ năng xử lý tình huống thực tế."',
        avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=80",
        featured: false,
    },
];

/* ────────────────────────── Component ────────────────────────── */
export default function ForCaregiver() {
    return (
        <div className="flex flex-col w-full bg-white">

            {/* ══════════════════════════════════════════════════════ */}
            {/* HERO                                                   */}
            {/* ══════════════════════════════════════════════════════ */}
            <section className="w-full py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                        {/* Left — text */}
                        <div className="flex-1 flex flex-col gap-7 max-w-lg">
                            <span className="text-xs font-bold tracking-widest text-[#00677c] uppercase">
                                Join our network
                            </span>

                            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#102030] leading-[1.15] tracking-tight">
                                Cơ hội việc làm ý nghĩa cho{" "}
                                <span className="text-[#00677c]">Sinh viên Y &amp; Điều dưỡng</span>
                            </h1>

                            <p className="text-base text-slate-500 leading-relaxed">
                                Hợp tác cùng CareLink để vừa rèn luyện kỹ năng lâm sàng, vừa tạo thu nhập và giúp đỡ cộng đồng trong thời gian rảnh của bạn.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                <Link
                                    to="/caregiver/choose-role"
                                    id="cta-hero-start"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#00677c] text-white rounded-xl font-semibold text-sm hover:bg-[#005264] transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg group cursor-pointer"
                                >
                                    Đăng ký đi làm
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                                <a
                                    href="#joining-process"
                                    className="inline-flex items-center justify-center px-7 py-3.5 border border-slate-200 text-[#102030] rounded-xl font-semibold text-sm hover:border-[#00677c] hover:text-[#00677c] transition-all"
                                >
                                    Tìm hiểu quy trình
                                </a>
                            </div>
                        </div>

                        {/* Right — image card */}
                        <div className="flex-1 flex justify-center lg:justify-end relative w-full max-w-md">
                            {/* Rounded image container */}
                            <div className="relative w-full max-w-sm">
                                <div className="rounded-3xl overflow-hidden bg-[#c8e8ef] aspect-[4/5]">
                                    <img
                                        src="/images/caregiver-hero.jpg"
                                        alt="Điều dưỡng CareLink"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>

                                {/* Floating verified card */}
                                <div className="absolute -bottom-5 -left-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-start gap-3 max-w-[220px]">
                                    <div className="w-10 h-10 rounded-xl bg-[#00677c] flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#102030]">Verified Status</p>
                                        <p className="text-xs text-slate-500 leading-snug mt-0.5">
                                            Giấy chứng nhận chuyên môn được xác thực bởi đội ngũ chuyên gia.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════ */}
            {/* BENEFITS — "Tại sao nên chọn CareLink?"               */}
            {/* ══════════════════════════════════════════════════════ */}
            <section className="w-full py-20 bg-[#f0f6f8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
                    {/* Heading */}
                    <div className="text-center flex flex-col gap-3 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#102030]">
                            Tại sao nên chọn CareLink?
                        </h2>
                        <p className="text-slate-500 text-base leading-relaxed">
                            Chúng tôi hiểu áp lực của sinh viên ngành Y. Nền tảng được thiết kế để tối ưu hóa trải nghiệm và quyền lợi của bạn.
                        </p>
                    </div>

                    {/* 2×2 benefit cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {benefits.map((b) => (
                            <div
                                key={b.id}
                                className={`rounded-2xl p-7 flex flex-col gap-5 ${b.style} hover:-translate-y-1 transition-transform duration-300`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${b.iconStyle}`}>
                                    {b.icon}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className={`text-lg font-bold ${b.titleStyle}`}>{b.title}</h3>
                                    <p className={`text-sm leading-relaxed ${b.descStyle}`}>{b.desc}</p>
                                </div>

                                {/* Avatar row for clinical-experience card */}
                                {b.showAvatars && (
                                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100 mt-auto">
                                        <div className="flex -space-x-2">
                                            {[
                                                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=50",
                                                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=50",
                                                "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=50",
                                            ].map((src, i) => (
                                                <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                                            ))}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500">+500 sinh viên đã tham gia</span>
                                    </div>
                                )}

                                {/* "Xem thêm" link for community card */}
                                {b.showLink && (
                                    <div className="mt-auto">
                                        <a
                                            href="#joining-process"
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#00677c] hover:gap-2 transition-all"
                                        >
                                            Xem thêm quyền lợi
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════ */}
            {/* JOINING PROCESS — 4 bước                             */}
            {/* ══════════════════════════════════════════════════════ */}
            <section id="joining-process" className="w-full py-20 bg-[#f8f9fa]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">

                        {/* Left */}
                        <div className="flex-1 flex flex-col gap-6 max-w-sm lg:sticky lg:top-24">
                            <h2 className="text-3xl font-bold text-[#102030] leading-snug">
                                Trở thành Caregiver<br />chỉ với 4 bước
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Quy trình đăng ký nhanh chóng, đảm bảo tính chuyên môn và an toàn cho cả người chăm sóc lẫn bệnh nhân.
                            </p>
                            {/* Quote */}
                            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
                                <p className="text-sm text-slate-600 italic leading-relaxed">
                                    "Quy trình xét duyệt giúp mình cảm thấy chuyên nghiệp và tự tin hơn khi bắt đầu ca đầu tiên."
                                </p>
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=50"
                                        alt="Minh Anh"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-xs font-semibold text-[#00677c]">— Minh Anh, SV Y3</span>
                                </div>
                            </div>
                        </div>

                        {/* Right — numbered steps */}
                        <div className="flex-1 flex flex-col gap-0">
                            {steps.map((step, i) => (
                                <div key={step.num} className="flex items-start gap-6 group">
                                    {/* Step number + connector */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-[#102030] text-white flex items-center justify-center text-base font-bold shrink-0 group-hover:bg-[#00677c] transition-colors duration-300">
                                            {step.num}
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className="w-px flex-1 bg-slate-200 my-2 min-h-[40px]" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-1.5 pb-10">
                                        <h3 className="text-base font-bold text-[#102030]">{step.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════ */}
            {/* TESTIMONIALS                                           */}
            {/* ══════════════════════════════════════════════════════ */}
            <section className="w-full py-20 bg-[#102030] relative overflow-hidden">
                {/* Subtle background texture */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                    backgroundImage: "radial-gradient(circle at 20% 50%, #00677c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00677c 0%, transparent 40%)"
                }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
                    <h2 className="text-3xl font-bold text-white text-center">
                        Lắng nghe chia sẻ từ Caregivers
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {testimonials.map((t) => (
                            <div
                                key={t.name}
                                className={`rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 ${t.featured
                                    ? "bg-white shadow-2xl"
                                    : "bg-white/10 border border-white/10"
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-center gap-3">
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                                    />
                                    <div>
                                        <p className={`text-sm font-bold ${t.featured ? "text-[#102030]" : "text-white"}`}>
                                            {t.name}
                                        </p>
                                        <p className={`text-xs ${t.featured ? "text-[#00677c]" : "text-white/50"}`}>
                                            {t.role}
                                        </p>
                                    </div>
                                </div>
                                {/* Stars */}
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 ${t.featured ? "text-amber-400" : "text-amber-300/60"}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className={`text-sm leading-relaxed ${t.featured ? "text-slate-600" : "text-white/70"}`}>
                                    {t.quote}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════ */}
            {/* CTA                                                    */}
            {/* ══════════════════════════════════════════════════════ */}
            <section className="w-full py-20 bg-[#f0f6f8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 sm:p-14 flex flex-col items-center gap-7 text-center max-w-2xl w-full">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#102030] leading-snug">
                                Sẵn sàng để bắt đầu<br />hành trình ý nghĩa?
                            </h2>
                            <p className="text-slate-500 text-base leading-relaxed">
                                Đăng ký ngay để trở thành một phần của mạng lưới chăm sóc y tế chuyên nghiệp hàng đầu.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                            <Link
                                to="/caregiver/choose-role"
                                id="cta-footer-start"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#00677c] text-white rounded-xl font-semibold text-sm hover:bg-[#005264] transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg group cursor-pointer"
                            >
                                Đăng ký đi làm
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <button
                                id="cta-footer-app"
                                className="inline-flex items-center justify-center px-7 py-3.5 border-2 border-[#00677c] text-[#00677c] rounded-xl font-semibold text-sm hover:bg-[#00677c] hover:text-white transition-all hover:-translate-y-0.5"
                            >
                                Tải app cho Caregiver
                            </button>
                        </div>

                        <p className="text-sm text-slate-400">
                            Hỗ trợ đăng ký:{" "}
                            <span className="font-bold text-[#102030]">1900 1234</span>{" "}
                            (Miễn phí)
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════ */}
            {/* FOOTER                                                 */}
            {/* ══════════════════════════════════════════════════════ */}
            <footer className="w-full bg-[#102030] py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#00677c] flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Care<span className="text-[#4dd6e8]">Link</span>
                            </span>
                        </div>

                        {/* Links */}
                        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            {["Privacy Policy", "Terms of Service", "Trust & Safety", "Contact Support", "HIPAA Compliance"].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-xs text-white/50 hover:text-white/90 transition-colors"
                                >
                                    {link}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Bottom row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6">
                        <p className="text-xs text-white/30 leading-relaxed max-w-lg">
                            © 2024 CareLink Medical Care. All rights reserved. CareLink là nền tảng kết nối trung gian. Chúng tôi không chịu trách nhiệm pháp lý về các vấn đề chuyên môn phát sinh giữa gia đình và người chăm sóc.
                        </p>
                        {/* Social icons */}
                        <div className="flex items-center gap-3">
                            {[
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />,
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />,
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />,
                            ].map((d, i) => (
                                <button key={i} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        {d}
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
