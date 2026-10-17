// PrivacyPolicy.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const sections = [
    { id: "thu-thap", title: "Thu thập dữ liệu" },
    { id: "muc-dich", title: "Mục đích sử dụng" },
    { id: "truy-cap", title: "Phân quyền truy cập" },
    { id: "hipaa", title: "Bảo mật dữ liệu" },
    { id: "chia-se", title: "Chia sẻ dữ liệu" },
    { id: "quyen-han", title: "Quyền của người dùng" },
    { id: "lien-he", title: "Liên hệ" },
];

function ArrowLeft() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
            className="h-4 w-4" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    );
}

function ShieldIcon({ className = "h-5 w-5" }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
            className={className} stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
            className="h-4 w-4" stroke="currentColor" strokeWidth="1.7"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}

function SectionHeading({ number, children, label }) {
    return (
        <div className="mb-4 flex items-start gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                border border-teal-100 bg-teal-50 text-sm font-semibold text-[#087F8C]">
                {number}
            </span>
            <div className="min-w-0 pt-0.5">
                {label && (
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#087F8C]">
                        {label}
                    </p>
                )}
                <h2 className="text-lg font-semibold leading-snug tracking-[-0.025em] text-slate-900 sm:text-xl">
                    {children}
                </h2>
            </div>
        </div>
    );
}

function InfoCard({ title, children }) {
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-[#F8FAF9] p-4 sm:p-5">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
            <div className="text-sm leading-7 text-slate-600">{children}</div>
        </div>
    );
}

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState("thu-thap");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollable =
                document.documentElement.scrollHeight - window.innerHeight;
            const next = scrollable > 0
                ? (window.scrollY / scrollable) * 100
                : 0;

            setProgress(Math.min(100, Math.max(0, next)));
        };

        updateProgress();
        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress);

        return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }, []);

    useEffect(() => {
        const elements = sections
            .map(({ id }) => document.getElementById(id))
            .filter(Boolean);

        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top
                    );

                if (visible[0]) setActiveSection(visible[0].target.id);
            },
            {
                rootMargin: "-18% 0px -68% 0px",
                threshold: 0,
            }
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, []);

    const scrollTo = (id) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            block: "start",
        });
    };

    return (
        <div className="min-h-screen bg-[#F6F8F7] font-sans text-slate-800 antialiased">
            <div
                className="fixed left-0 top-0 z-50 h-[3px] bg-[#087F8C] transition-[width] duration-150"
                style={{ width: `${progress}%` }}
                aria-hidden="true"
            />

            <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-9 lg:px-8">
                <nav className="mb-8 flex items-center justify-between gap-3">
                    <Link
                        to="/"
                        className="group inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#087F8C]"
                    >
                        <span className="transition-transform duration-200 group-hover:-translate-x-1">
                            <ArrowLeft />
                        </span>
                        Trang chủ
                    </Link>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-500 sm:text-xs">
                        Cập nhật: Tháng 05/2026
                    </span>
                </nav>

                <header className="relative mb-8 overflow-hidden rounded-[28px] border border-[#DCE9E5] bg-white px-6 py-8 shadow-[0_12px_40px_-28px_rgba(15,60,55,0.24)] sm:px-10 sm:py-11">
                    <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 right-1/4 h-40 w-40 rounded-full bg-emerald-50/70 blur-3xl" />

                    <div className="relative">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-[#087F8C]">
                            <ShieldIcon className="h-6 w-6" />
                        </div>

                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#087F8C] sm:text-xs">
                            CARELINK / QUYỀN RIÊNG TƯ
                        </p>

                        <h1 className="max-w-3xl text-[30px] font-semibold leading-[1.15] tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[44px]">
                            Chính sách bảo mật
                            <span className="block text-[#087F8C]">
                                & quyền riêng tư y tế
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            Sự an tâm của gia đình bắt đầu từ việc hiểu rõ dữ liệu
                            được sử dụng như thế nào. Chính sách này trình bày các
                            nguyên tắc thu thập, sử dụng, truy cập và bảo vệ thông
                            tin trong quá trình sử dụng CareLink.
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-slate-100 pt-5">
                            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                                <ShieldIcon className="h-4 w-4 text-[#087F8C]" />
                                Quyền riêng tư là ưu tiên
                            </span>
                            <span className="text-xs text-slate-400">
                                7 mục nội dung
                            </span>
                        </div>
                    </div>
                </header>

                <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Trong chính sách này
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Chọn một mục để chuyển đến nội dung tương ứng.
                            </p>
                        </div>
                        <span className="shrink-0 text-xs tabular-nums text-slate-400">
                            {Math.round(progress)}% đã đọc
                        </span>
                    </div>

                    <div className="mb-4 h-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-[#087F8C] transition-[width] duration-150"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <nav
                        aria-label="Mục lục chính sách bảo mật"
                        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]"
                    >
                        {sections.map((section, index) => (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => scrollTo(section.id)}
                                aria-current={activeSection === section.id ? "location" : undefined}
                                className={`shrink-0 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${activeSection === section.id
                                    ? "border-[#087F8C] bg-[#087F8C] text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-[#087F8C]"
                                    }`}
                            >
                                <span className="mr-1.5 opacity-70">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </section>

                <main className="rounded-[26px] border border-slate-200/80 bg-white px-5 py-7 shadow-[0_16px_50px_-38px_rgba(15,23,42,0.22)] sm:px-9 sm:py-10 lg:px-12">
                    <div className="mx-auto max-w-3xl space-y-10 text-[14px] leading-7 text-slate-600 sm:text-[15px] sm:leading-8">
                        <section id="thu-thap" className="scroll-mt-8 animate-[fade-up_.5s_ease-out_both]">
                            <SectionHeading number="01" label="Dữ liệu">
                                Thu thập dữ liệu y tế và thông tin cá nhân
                            </SectionHeading>
                            <p>
                                Để cung cấp dịch vụ kết nối điều dưỡng tại nhà một
                                cách phù hợp, CareLink có thể thu thập các nhóm
                                thông tin cần thiết cho quá trình cung cấp dịch vụ:
                            </p>
                            <ul className="mt-4 space-y-3">
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Thông tin đại diện gia đình:</strong> Họ tên người liên hệ, số điện thoại, email và địa chỉ nơi diễn ra ca chăm sóc.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Hồ sơ người bệnh:</strong> Họ tên, năm sinh, giới tính, tiền sử bệnh lý, dị ứng thuốc và nhu cầu hỗ trợ sinh hoạt.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Chỉ số sức khỏe phát sinh:</strong> Các chỉ số do điều dưỡng ghi nhận trong ca chăm sóc như huyết áp, nhịp tim, thân nhiệt, SpO₂ và tình trạng vết thương.</span>
                                </li>
                            </ul>
                        </section>

                        <section id="muc-dich" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="02" label="Mục đích">
                                Mục đích sử dụng dữ liệu
                            </SectionHeading>
                            <p>
                                Thông tin được sử dụng nhằm hỗ trợ quá trình chăm
                                sóc, phối hợp giữa gia đình và nhân sự được phân
                                công, trong phạm vi cần thiết cho dịch vụ.
                            </p>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <InfoCard title="Phục vụ ca chăm sóc">
                                    Hỗ trợ điều dưỡng nắm bắt thông tin liên quan
                                    đến người bệnh và chuẩn bị phù hợp trước ca trực.
                                </InfoCard>
                                <InfoCard title="Theo dõi sức khỏe">
                                    Hỗ trợ ghi nhận và theo dõi các chỉ số sức khỏe
                                    được thu thập trong quá trình chăm sóc.
                                </InfoCard>
                                <InfoCard title="Ứng phó tình huống khẩn cấp">
                                    Hỗ trợ liên hệ đầu mối cần thiết khi phát sinh
                                    tình huống cần trợ giúp khẩn cấp.
                                </InfoCard>
                                <InfoCard title="Kiểm soát chất lượng">
                                    Hỗ trợ tiếp nhận phản hồi và xem xét chất lượng
                                    dịch vụ theo quy trình của nền tảng.
                                </InfoCard>
                            </div>
                        </section>

                        <section id="truy-cap" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="03" label="Phân quyền">
                                Phân quyền truy cập hồ sơ
                            </SectionHeading>
                            <p>
                                Quyền truy cập dữ liệu nên được giới hạn theo vai
                                trò và nhu cầu công việc. Theo nội dung chính sách
                                hiện tại của CareLink, các nhóm quyền được mô tả
                                như sau:
                            </p>
                            <ul className="mt-4 space-y-3">
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Tài khoản gia đình:</strong> Truy cập và quản lý thông tin liên quan đến hồ sơ người thân theo quyền được cấp.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Điều dưỡng được phân công:</strong> Truy cập thông tin cần thiết để thực hiện ca chăm sóc theo phạm vi được cấp quyền.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Nhân sự quản trị hoặc cố vấn:</strong> Việc truy cập cần tuân theo nhiệm vụ được giao và quy trình nội bộ áp dụng.</span>
                                </li>
                            </ul>
                        </section>

                        <section id="hipaa" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="04" label="An toàn thông tin">
                                Tiêu chuẩn bảo mật và mã hóa dữ liệu
                            </SectionHeading>
                            <p>
                                Chính sách hiện tại đề cập đến các nguyên tắc bảo
                                vệ dữ liệu theo định hướng HIPAA. Việc sử dụng
                                thuật ngữ hoặc nhãn tuân thủ cần phản ánh chính xác
                                những biện pháp đã được triển khai và xác minh.
                            </p>
                            <div className="mt-5 space-y-3">
                                <InfoCard title="Mã hóa dữ liệu khi truyền">
                                    Thông tin truyền giữa ứng dụng và máy chủ cần
                                    được bảo vệ bằng cấu hình mã hóa phù hợp.
                                </InfoCard>
                                <InfoCard title="Bảo vệ dữ liệu lưu trữ">
                                    Hồ sơ và dữ liệu sức khỏe cần được bảo vệ bằng
                                    các biện pháp kỹ thuật và quản lý truy cập phù hợp.
                                </InfoCard>
                                <InfoCard title="Ghi nhận hoạt động truy cập">
                                    Nhật ký truy cập, cập nhật hoặc xuất dữ liệu
                                    nên được lưu giữ theo quy trình và thời hạn áp dụng.
                                </InfoCard>
                            </div>
                            <p className="mt-4 text-xs leading-6 text-slate-500">
                                Lưu ý: các biện pháp kỹ thuật cụ thể và tình trạng
                                tuân thủ cần được xác minh với hệ thống thực tế
                                trước khi công bố như một cam kết chính thức.
                            </p>
                        </section>

                        <section id="chia-se" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="05" label="Chia sẻ dữ liệu">
                                Cam kết về việc chia sẻ dữ liệu
                            </SectionHeading>
                            <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5 sm:p-6">
                                <div className="mb-2 flex items-center gap-2 text-[#087F8C]">
                                    <ShieldIcon className="h-5 w-5" />
                                    <h3 className="text-sm font-semibold">Tôn trọng quyền riêng tư</h3>
                                </div>
                                <p className="text-sm leading-7 text-slate-700">
                                    Theo cam kết được nêu trong bản chính sách ban
                                    đầu, CareLink không bán, cho thuê hoặc thương
                                    mại hóa hồ sơ sức khỏe và thông tin cá nhân
                                    cho bên thứ ba vì mục đích quảng cáo thương mại.
                                </p>
                            </div>
                        </section>

                        <section id="quyen-han" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="06" label="Quyền người dùng">
                                Quyền của gia đình và người bệnh
                            </SectionHeading>
                            <p>
                                Gia đình có thể thực hiện các yêu cầu liên quan
                                đến dữ liệu theo chức năng hiện có của nền tảng
                                và quy trình áp dụng:
                            </p>
                            <ul className="mt-4 space-y-3">
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Tra cứu và trích xuất:</strong> Yêu cầu truy cập hoặc nhận bản sao dữ liệu theo chức năng được hỗ trợ.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Chỉnh sửa:</strong> Yêu cầu cập nhật thông tin không chính xác theo quy trình của CareLink.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Yêu cầu xóa dữ liệu:</strong> Gửi yêu cầu xóa tài khoản hoặc dữ liệu để được xem xét theo quy định áp dụng và các nghĩa vụ lưu trữ liên quan.</span>
                                </li>
                            </ul>
                        </section>

                        <section id="lien-he" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="07" label="Hỗ trợ">
                                Liên hệ về quyền riêng tư
                            </SectionHeading>
                            <p>
                                Nếu có câu hỏi hoặc yêu cầu liên quan đến việc xử
                                lý thông tin cá nhân và dữ liệu sức khỏe, bạn có
                                thể liên hệ qua thông tin dưới đây.
                            </p>
                            <div className="mt-5 rounded-2xl border border-slate-200 bg-[#F8FAF9] p-5 sm:p-6">
                                <p className="font-semibold text-slate-900">
                                    Bộ phận tiếp nhận yêu cầu quyền riêng tư
                                </p>
                                <a
                                    href="mailto:privacy@carelink.vn"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#087F8C] transition-colors hover:text-[#055D67]"
                                >
                                    <MailIcon />
                                    privacy@carelink.vn
                                </a>
                                <p className="mt-3 text-xs leading-6 text-slate-500">
                                    Thông tin địa chỉ văn phòng và hotline cần
                                    được xác nhận trước khi công bố chính thức.
                                </p>
                            </div>
                        </section>

                        <footer className="border-t border-slate-100 pt-6 text-xs leading-6 text-slate-400">
                            Chính sách cần được rà soát định kỳ để bảo đảm phù hợp
                            với chức năng thực tế của CareLink và quy định pháp
                            luật có liên quan.
                        </footer>
                    </div>
                </main>

                <div className="flex flex-col items-center justify-between gap-4 px-1 pt-2 text-xs text-slate-400 sm:flex-row">
                    <Link to="/" className="transition-colors hover:text-[#087F8C]">
                        Quay lại CareLink
                    </Link>
                    <span>CareLink · Quyền riêng tư và sự an tâm</span>
                </div>
            </div>

            <style>{`
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </div>
    );
}