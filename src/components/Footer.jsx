
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminApi from "../api/adminApi";

const footerLinkGroups = [
    {
        title: "VỀ CHÚNG TÔI",
        links: [
            { label: "Giới thiệu CareLink", path: "/handbook" },
            { label: "Tuyển dụng Điều dưỡng", path: "/caregiver/choose-role" },
            { label: "Cẩm nang y tế", path: "/handbook" },
        ],
    },
    {
        title: "DỊCH VỤ",
        links: [
            { label: "Chăm sóc người già", path: "/services" },
            { label: "Chăm sóc bệnh nhân", path: "/services" },
            { label: "Phục hồi chức năng", path: "/services" },
        ],
    },
    {
        title: "PHÁP LÝ & BẢO MẬT",
        links: [
            { label: "Chính sách bảo mật", path: "/privacy" },
            { label: "Điều khoản dịch vụ", path: "/terms" },
            { label: "Quy định bảo mật dữ liệu", path: "/privacy" },
        ],
    },
];

export default function Footer() {
    const [publicConfig, setPublicConfig] = useState(null);

    useEffect(() => {
        let isMounted = true;

        adminApi.getPublicConfig()
            .then((res) => {
                if (isMounted && res) {
                    const data = res.data || res;
                    setPublicConfig(data);
                }
            })
            .catch(() => {
                // Silently fallback to defaults
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const displayHotline = publicConfig?.hotline?.trim()
        ? publicConfig.hotline.trim()
        : "1900 1234";

    return (
        <footer className="relative w-full bg-[#1B303A] text-white py-8 sm:py-9 px-6 sm:px-10 lg:px-16 border-t border-white/[0.08]">
            {/* Đường nhấn thương hiệu */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#38c1dc]/40 to-transparent" />

            <div className="max-w-7xl mx-auto flex flex-col gap-6">

                {/* Nội dung chính */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

                    {/* Cột thương hiệu */}
                    <div className="lg:col-span-2 flex flex-col gap-3">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2.5 group w-fit"
                            title="Về trang chủ CareLink"
                        >
                            <img
                                src="/images/logo_remove_white.png"
                                alt="CareLink Logo"
                                className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0"
                            />

                            <span className="text-2xl font-bold tracking-tight text-white">
                                Care<span className="text-[#38c1dc]">Link</span>
                            </span>
                        </Link>

                        <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                            Giải pháp công nghệ kết nối y tế cộng đồng, mang chuyên môn tới từng gia đình Việt. Đội ngũ điều dưỡng và sinh viên Y khoa tận tâm, đồng hành chăm sóc sức khỏe người thân yêu 24/7.
                        </p>

                        {/* Mạng xã hội và Hotline */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
                            <div className="flex items-center gap-3">

                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com/people/CareLink/61594764240143/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Truy cập Facebook CareLink"
                                    title="Facebook CareLink"
                                    className="w-9 h-9 flex items-center justify-center rounded-full
                                        bg-[#1877F2] border border-[#1877F2]
                                        text-white shadow-sm shadow-black/10
                                        hover:bg-[#0866FF] hover:border-[#0866FF]
                                        hover:scale-110 active:scale-95
                                        transition-all duration-200"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-[19px] h-[19px] fill-current"
                                        aria-hidden="true"
                                    >
                                        <path d="M13.5 21v-8.2h2.76l.41-3.2H13.5V7.56c0-.93.26-1.56 1.59-1.56h1.69V3.14C15.96 3.05 15.13 3 14.29 3c-2.49 0-4.19 1.52-4.19 4.31V9.6H7.28v3.2h2.82V21h3.4Z" />
                                    </svg>
                                </a>

                                {/* TikTok */}
                                <a
                                    href="https://www.tiktok.com/@carelink201"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Truy cập TikTok CareLink"
                                    title="TikTok CareLink"
                                    className="w-9 h-9 flex items-center justify-center rounded-full
        bg-white border border-white
        shadow-sm shadow-black/10
        hover:bg-slate-100 hover:border-slate-100
        hover:scale-110 active:scale-95
        transition-all duration-200"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-[19px] h-[19px]"
                                        aria-hidden="true"
                                    >
                                        {/* Lớp màu cyan */}
                                        <path
                                            fill="#25F4EE"
                                            d="M19.59 6.69a4.83 4.83 0 0 1-3.01-3.01V3h-3.4v12.7a2.9 2.9 0 1 1-2.9-2.9c.3 0 .59.05.86.14v-3.5a6.4 6.4 0 1 0 5.44 6.33V9.32a8.2 8.2 0 0 0 4.8 1.54V7.43c-.61 0-1.22-.25-1.79-.74Z"
                                            transform="translate(-0.7 0)"
                                        />

                                        {/* Lớp màu hồng */}
                                        <path
                                            fill="#FE2C55"
                                            d="M19.59 6.69a4.83 4.83 0 0 1-3.01-3.01V3h-3.4v12.7a2.9 2.9 0 1 1-2.9-2.9c.3 0 .59.05.86.14v-3.5a6.4 6.4 0 1 0 5.44 6.33V9.32a8.2 8.2 0 0 0 4.8 1.54V7.43c-.61 0-1.22-.25-1.79-.74Z"
                                            transform="translate(0.45 0.25)"
                                        />

                                        {/* Logo chính màu đen */}
                                        <path
                                            fill="#000000"
                                            d="M19.59 6.69a4.83 4.83 0 0 1-3.01-3.01V3h-3.4v12.7a2.9 2.9 0 1 1-2.9-2.9c.3 0 .59.05.86.14v-3.5a6.4 6.4 0 1 0 5.44 6.33V9.32a8.2 8.2 0 0 0 4.8 1.54V7.43c-.61 0-1.22-.25-1.79-.74Z"
                                        />
                                    </svg>
                                </a>

                            </div>

                            <span className="text-[11.5px] text-slate-400">
                                Hotline:{" "}
                                <a
                                    href={`tel:${displayHotline.replace(/\s+/g, "")}`}
                                    className="text-cyan-300 font-semibold hover:text-white hover:underline transition-colors"
                                >
                                    {displayHotline}
                                </a>{" "}
                                (24/7)
                            </span>
                        </div>
                    </div>

                    {/* Các nhóm liên kết */}
                    {footerLinkGroups.map((group) => (
                        <div
                            key={group.title}
                            className="flex flex-col gap-3 lg:col-span-1"
                        >
                            <h3 className="text-xs font-bold text-white/90 tracking-wider uppercase">
                                {group.title}
                            </h3>

                            <ul className="flex flex-col gap-2">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.path}
                                            className="text-xs text-slate-300 hover:text-cyan-300 transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Phân cách và thông tin bản quyền */}
                <div className="border-t border-white/[0.10] pt-4 mt-1 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">

                    <div className="flex flex-col gap-0.5 text-center md:text-left">
                        <p className="text-slate-200 text-xs font-medium">
                            © 2026 CareLink Medical Care. All rights reserved.
                        </p>

                        <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed">
                            CareLink là nền tảng kết nối trung gian giữa người dùng và người cung cấp dịch vụ y tế. Chúng tôi không trực tiếp cung cấp dịch vụ y tế và không chịu trách nhiệm pháp lý về chuyên môn giữa hai bên.
                        </p>
                    </div>

                    <div className="flex items-center gap-5 text-xs text-slate-400 font-medium whitespace-nowrap">
                        <Link
                            to="/handbook"
                            className="hover:text-cyan-300 transition-colors duration-200"
                        >
                            Quy trình & An toàn
                        </Link>

                        <Link
                            to="/chat"
                            className="hover:text-cyan-300 transition-colors duration-200"
                        >
                            Hỗ trợ trực tuyến
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
