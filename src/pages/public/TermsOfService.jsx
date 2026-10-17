// TermsOfService.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const sections = [
    { id: "dinh-nghia", title: "Phạm vi nền tảng" },
    { id: "xac-nhan-hai-chieu", title: "Quy trình đặt lịch" },
    { id: "trach-nhiem-gia-dinh", title: "Trách nhiệm gia đình" },
    { id: "tieu-chuan-dieu-duong", title: "Trách nhiệm điều dưỡng" },
    { id: "thanh-toan-hoan-tien", title: "Phí và hoàn tiền" },
    { id: "gioi-han-trach-nhiem", title: "Sự cố khẩn cấp" },
    { id: "giai-quyet-tranh-chap", title: "Khiếu nại và tranh chấp" },
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

function DocumentIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
            className="h-6 w-6" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6M8 13h8M8 17h8" />
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

function InfoCard({ title, children, tone = "neutral" }) {
    const tones = {
        neutral: "border-slate-200/80 bg-[#F8FAF9]",
        teal: "border-teal-100 bg-teal-50/60",
        amber: "border-amber-200/80 bg-amber-50/60",
        rose: "border-rose-200/80 bg-rose-50/60",
    };

    return (
        <div className={`rounded-2xl border p-4 sm:p-5 ${tones[tone] || tones.neutral}`}>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
            <div className="text-sm leading-7 text-slate-600">{children}</div>
        </div>
    );
}

export default function TermsOfService() {
    const [activeSection, setActiveSection] = useState("dinh-nghia");
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
                        Phiên bản 2.4 · Tháng 05/2026
                    </span>
                </nav>

                <header className="relative mb-8 overflow-hidden rounded-[28px] border border-[#DCE9E5] bg-white px-6 py-8 shadow-[0_12px_40px_-28px_rgba(15,60,55,0.24)] sm:px-10 sm:py-11">
                    <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-50/80 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 right-1/4 h-40 w-40 rounded-full bg-emerald-50/70 blur-3xl" />

                    <div className="relative">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-[#087F8C]">
                            <DocumentIcon />
                        </div>

                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#087F8C] sm:text-xs">
                            CARELINK / QUY CHẾ HOẠT ĐỘNG
                        </p>

                        <h1 className="max-w-3xl text-[30px] font-semibold leading-[1.15] tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[44px]">
                            Điều khoản dịch vụ
                            <span className="block text-[#087F8C]">
                                & tiêu chuẩn hoạt động
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            Những nguyên tắc giúp gia đình và nhân sự chăm sóc
                            hiểu rõ trách nhiệm, quy trình đặt lịch và cách xử
                            lý các tình huống có thể phát sinh khi sử dụng CareLink.
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-slate-100 pt-5">
                            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                                <DocumentIcon />
                                Quy chế sử dụng nền tảng
                            </span>
                            <span className="text-xs text-slate-400">
                                7 mục điều khoản
                            </span>
                        </div>
                    </div>
                </header>

                <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Nội dung điều khoản
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
                        aria-label="Mục lục điều khoản dịch vụ"
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
                        <section id="dinh-nghia" className="scroll-mt-8">
                            <SectionHeading number="01" label="Phạm vi">
                                Định nghĩa và phạm vi hoạt động nền tảng
                            </SectionHeading>
                            <p>
                                <strong className="font-semibold text-slate-800">CareLink</strong>{" "}
                                là nền tảng công nghệ kết nối gia đình có nhu cầu
                                chăm sóc người thân tại nhà với nhân sự điều dưỡng
                                và sinh viên Y khoa đã qua quy trình kiểm duyệt hồ sơ.
                            </p>
                            <p className="mt-3">
                                CareLink hỗ trợ kết nối, lên lịch, ghi nhận thông
                                tin chăm sóc và tiếp nhận phản hồi về chất lượng
                                dịch vụ. Nền tảng không thay thế cơ sở khám chữa
                                bệnh hoặc dịch vụ cấp cứu ngoại viện.
                            </p>
                        </section>

                        <section id="xac-nhan-hai-chieu" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="02" label="Quy trình">
                                Cơ chế đặt lịch xác nhận hai chiều
                            </SectionHeading>
                            <p>
                                Ca chăm sóc chỉ nên được xem là đã xác nhận khi
                                yêu cầu của gia đình và khả năng tiếp nhận của
                                người chăm sóc đã được hai bên xác nhận theo quy
                                trình của nền tảng.
                            </p>

                            <div className="mt-5 space-y-3">
                                <InfoCard title="Bước 1 — Gia đình gửi yêu cầu" tone="teal">
                                    Gia đình cung cấp thông tin cần thiết, chọn lịch
                                    chăm sóc và thực hiện các bước thanh toán được
                                    hiển thị trong ứng dụng, nếu có.
                                </InfoCard>
                                <InfoCard title="Bước 2 — Người chăm sóc xem xét">
                                    Người chăm sóc kiểm tra lịch trình và thông tin
                                    liên quan, sau đó phản hồi yêu cầu đặt lịch.
                                </InfoCard>
                                <InfoCard title="Bước 3 — Xác nhận ca chăm sóc">
                                    Trạng thái ca trực được cập nhật theo kết quả
                                    xác nhận của hai bên và quy trình thực tế của
                                    CareLink.
                                </InfoCard>
                            </div>
                        </section>

                        <section id="trach-nhiem-gia-dinh" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="03" label="Dành cho gia đình">
                                Trách nhiệm của phía gia đình
                            </SectionHeading>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Cung cấp thông tin trung thực:</strong> Chia sẻ những thông tin sức khỏe có liên quan, bao gồm tiền sử bệnh, dị ứng và hướng dẫn điều trị mà gia đình biết.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Bảo đảm môi trường an toàn:</strong> Chuẩn bị không gian chăm sóc phù hợp và tôn trọng an toàn, phẩm giá của người chăm sóc.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Tôn trọng phạm vi dịch vụ:</strong> Không yêu cầu người chăm sóc thực hiện công việc ngoài phạm vi chuyên môn hoặc thỏa thuận của ca chăm sóc.</span>
                                </li>
                            </ul>
                        </section>

                        <section id="tieu-chuan-dieu-duong" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="04" label="Dành cho người chăm sóc">
                                Tiêu chuẩn và trách nhiệm điều dưỡng
                            </SectionHeading>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Hồ sơ hợp lệ:</strong> Cung cấp giấy tờ và chứng chỉ phù hợp với vai trò đăng ký theo yêu cầu của nền tảng.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Tuân thủ lịch đã xác nhận:</strong> Có mặt theo lịch hẹn hoặc thông báo kịp thời khi phát sinh trở ngại.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Làm việc trong phạm vi chuyên môn:</strong> Thực hiện công việc phù hợp với trình độ, năng lực và hướng dẫn chuyên môn có liên quan.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087F8C]" />
                                    <span><strong className="font-semibold text-slate-800">Bảo đảm vệ sinh và an toàn:</strong> Tuân thủ các biện pháp vệ sinh, phòng ngừa lây nhiễm phù hợp trong quá trình chăm sóc.</span>
                                </li>
                            </ul>
                        </section>

                        <section id="thanh-toan-hoan-tien" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="05" label="Thanh toán">
                                Phí dịch vụ, hủy ca và hoàn tiền
                            </SectionHeading>
                            <p>
                                Các khoản phí, điều kiện hủy và thời gian hoàn tiền
                                cần được hiển thị rõ ràng cho người dùng trước khi
                                xác nhận giao dịch. Các nội dung dưới đây là những
                                chính sách được nêu trong bản điều khoản hiện tại
                                và cần đối chiếu với cấu hình thanh toán thực tế.
                            </p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <InfoCard title="Hủy trước 4 giờ" tone="teal">
                                    Bản hiện tại nêu mức hoàn 100% khoản tiền tạm
                                    giữ trong trường hợp đáp ứng điều kiện hủy trước
                                    4 giờ.
                                </InfoCard>
                                <InfoCard title="Hủy sát giờ dưới 2 giờ" tone="amber">
                                    Bản hiện tại nêu khoản phí phụ cấp di chuyển
                                    bằng 30%. Cần xác nhận cách tính và trường hợp
                                    áp dụng cụ thể.
                                </InfoCard>
                                <InfoCard title="Người chăm sóc hủy ca" tone="rose">
                                    Bản hiện tại đề cập hoàn tiền cho gia đình và
                                    biện pháp xử lý uy tín. Cần xác minh điều kiện
                                    và cách thực hiện.
                                </InfoCard>
                                <InfoCard title="Biểu phí nền tảng">
                                    Bản hiện tại ghi phí nền tảng 60.000 đồng mỗi
                                    ca. Cần bảo đảm mức phí này khớp với giá đang
                                    hiển thị trong ứng dụng.
                                </InfoCard>
                            </div>
                        </section>

                        <section id="gioi-han-trach-nhiem" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="06" label="An toàn">
                                Giới hạn trách nhiệm và tình huống khẩn cấp
                            </SectionHeading>
                            <p>
                                Nếu người bệnh có dấu hiệu chuyển biến nguy kịch,
                                gia đình và người chăm sóc cần ưu tiên liên hệ
                                dịch vụ cấp cứu phù hợp. Không nên trì hoãn việc
                                tìm kiếm trợ giúp khẩn cấp để chờ phản hồi từ nền tảng.
                            </p>

                            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/70 p-5 sm:p-6">
                                <p className="text-sm font-semibold text-rose-900">
                                    Quy trình xử lý tình huống khẩn cấp
                                </p>
                                <ol className="mt-3 space-y-3 text-sm leading-7 text-rose-950/80">
                                    <li>
                                        <span className="mr-2 font-semibold text-rose-800">01.</span>
                                        Thực hiện sơ cứu phù hợp trong phạm vi
                                        năng lực và đào tạo.
                                    </li>
                                    <li>
                                        <span className="mr-2 font-semibold text-rose-800">02.</span>
                                        Gọi cấp cứu 115 khi có dấu hiệu nguy kịch
                                        cần hỗ trợ y tế khẩn cấp.
                                    </li>
                                    <li>
                                        <span className="mr-2 font-semibold text-rose-800">03.</span>
                                        Liên hệ kênh hỗ trợ CareLink nếu cần, nhưng
                                        không thay thế việc gọi cấp cứu.
                                    </li>
                                </ol>
                            </div>
                        </section>

                        <section id="giai-quyet-tranh-chap" className="scroll-mt-8 border-t border-slate-100 pt-8">
                            <SectionHeading number="07" label="Hỗ trợ">
                                Giải quyết khiếu nại và tranh chấp
                            </SectionHeading>
                            <p>
                                Người dùng có thể gửi phản hồi hoặc khiếu nại
                                liên quan đến chất lượng dịch vụ qua kênh hỗ trợ
                                chính thức của CareLink. Thông tin tiếp nhận nên
                                nêu rõ cách gửi yêu cầu, các bước xem xét và thời
                                gian phản hồi dự kiến.
                            </p>
                            <InfoCard title="Thông tin cần công bố rõ ràng">
                                Thời hạn giải quyết khiếu nại, cơ quan hoặc bộ
                                phận chịu trách nhiệm và quy trình xử lý cần được
                                xác nhận theo khả năng vận hành thực tế của nền tảng.
                            </InfoCard>
                            <p className="mt-4 text-xs leading-6 text-slate-500">
                                Điều khoản cần được rà soát định kỳ để phù hợp
                                với hoạt động thực tế của CareLink và quy định
                                pháp luật có liên quan.
                            </p>
                        </section>

                        <footer className="border-t border-slate-100 pt-6 text-xs leading-6 text-slate-400">
                            Việc tiếp tục sử dụng nền tảng cần tuân theo các điều
                            khoản đã được công bố chính thức và áp dụng hợp lệ.
                        </footer>
                    </div>
                </main>

                <div className="flex flex-col items-center justify-between gap-4 px-1 pt-2 text-xs text-slate-400 sm:flex-row">
                    <Link to="/" className="transition-colors hover:text-[#087F8C]">
                        Quay lại CareLink
                    </Link>
                    <span>CareLink · Kết nối chăm sóc tận tâm</span>
                </div>
            </div>

            <style>{`
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