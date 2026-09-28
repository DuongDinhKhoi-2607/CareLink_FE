import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState("thu-thap");

    const sections = [
        { id: "thu-thap", title: "1. Thu thập dữ liệu y tế & cá nhân" },
        { id: "muc-dich", title: "2. Mục đích sử dụng dữ liệu" },
        { id: "truy-cap", title: "3. Phân quyền truy cập hồ sơ" },
        { id: "hipaa", title: "4. Tiêu chuẩn bảo mật HIPAA & Mã hóa" },
        { id: "chia-se", title: "5. Cam kết không chia sẻ dữ liệu" },
        { id: "quyen-han", title: "6. Quyền của gia đình & bệnh nhân" },
        { id: "lien-he", title: "7. Liên hệ Ban Quản trị Bảo mật" },
    ];

    const scrollTo = (id) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#102030] font-sans antialiased py-8 sm:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
                
                {/* Thanh điều hướng quay lại */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00677c] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Quay lại Trang chủ
                    </Link>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Hiệu lực cập nhật: Tháng 05/2026
                    </span>
                </div>

                {/* Header trang */}
                <header className="bg-gradient-to-r from-[#004d5d] to-[#00677c] text-white p-6 sm:p-10 rounded-3xl shadow-md relative overflow-hidden">
                    <div className="relative z-10 max-w-3xl flex flex-col gap-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-bold uppercase tracking-wider w-fit">
                            PHÁP LÝ & AN TOÀN DỮ LIỆU
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                            Chính Sách Bảo Mật & Quyền Riêng Tư Y Tế
                        </h1>
                        <p className="text-sm sm:text-base text-teal-50/90 leading-relaxed">
                            Tại CareLink, sự tin cậy của gia đình và quyền riêng tư về dữ liệu sức khỏe của người bệnh là ưu tiên số một. Chính sách này quy định minh bạch cách thức thu thập, lưu trữ và bảo vệ dữ liệu y tế theo tiêu chuẩn khắt khe nhất.
                        </p>
                    </div>
                </header>

                {/* Bố cục 2 cột: Mục lục nhanh + Nội dung chi tiết */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Cột trái: Mục lục nội dung (Sticky) */}
                    <aside className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs sticky top-24">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Mục lục chính sách
                        </h2>
                        <nav className="flex flex-col gap-1">
                            {sections.map((sec) => (
                                <button
                                    key={sec.id}
                                    type="button"
                                    onClick={() => scrollTo(sec.id)}
                                    className={`text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all ${
                                        activeSection === sec.id
                                            ? "bg-teal-50 text-[#00677c] font-bold border-l-4 border-[#00677c]"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                >
                                    {sec.title}
                                </button>
                            ))}
                        </nav>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                            <span className="text-[11px] text-slate-400">Hỗ trợ khẩn cấp quyền riêng tư:</span>
                            <a
                                href="mailto:privacy@carelink.vn"
                                className="text-xs font-bold text-[#00677c] hover:underline flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                privacy@carelink.vn
                            </a>
                        </div>
                    </aside>

                    {/* Cột phải: Các điều khoản chi tiết */}
                    <main className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-[15px]">
                        
                        {/* Mục 1 */}
                        <section id="thu-thap" className="scroll-mt-28 space-y-3">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                1. Thu thập dữ liệu y tế & thông tin cá nhân
                            </h2>
                            <p>
                                Để cung cấp dịch vụ kết nối điều dưỡng tại nhà một cách chính xác và đảm bảo an toàn tối đa cho người bệnh, CareLink chỉ thu thập các nhóm dữ liệu thiết yếu sau:
                            </p>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                                <li><strong>Thông tin đại diện gia đình:</strong> Họ tên người liên hệ, số điện thoại, email, địa chỉ nhà diễn ra ca chăm sóc.</li>
                                <li><strong>Hồ sơ người bệnh:</strong> Họ tên, năm sinh, giới tính, tiền sử bệnh lý nền (huyết áp, tiểu đường, di chứng đột quỵ...), dị ứng thuốc và yêu cầu hỗ trợ sinh hoạt đặc thù.</li>
                                <li><strong>Chỉ số sinh tồn phát sinh:</strong> Các số liệu do Điều dưỡng đo đạc tại chỗ trong ca trực (huyết áp, nhịp tim, thân nhiệt, SpO2, tình trạng vết thương).</li>
                            </ul>
                        </section>

                        {/* Mục 2 */}
                        <section id="muc-dich" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                2. Mục đích sử dụng dữ liệu
                            </h2>
                            <p>
                                Dữ liệu y tế và thông tin người dùng được thu thập nghiêm ngặt cho các mục đích:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="font-bold text-slate-800 text-xs block mb-1">🏥 Phục vụ ca chăm sóc</span>
                                    <span className="text-xs text-slate-500">Giúp điều dưỡng nắm bắt tiền sử bệnh lý và chuẩn bị dụng cụ y tế phù hợp trước khi đến nhà.</span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="font-bold text-slate-800 text-xs block mb-1">📈 Báo cáo sức khỏe định kỳ</span>
                                    <span className="text-xs text-slate-500">Lập biểu đồ theo dõi sinh hiệu giúp gia đình và bác sĩ điều trị nắm bắt tiến trình phục hồi.</span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="font-bold text-slate-800 text-xs block mb-1">🚨 Ứng phó sự cố khẩn cấp</span>
                                    <span className="text-xs text-slate-500">Liên hệ số khẩn cấp của con cháu hoặc hỗ trợ trung tâm cấp cứu 115 khi phát sinh tình huống nguy kịch.</span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="font-bold text-slate-800 text-xs block mb-1">⚖️ Kiểm duyệt chất lượng</span>
                                    <span className="text-xs text-slate-500">Ban y khoa CareLink giám sát chất lượng chuyên môn và đạo đức làm việc của nhân sự chăm sóc.</span>
                                </div>
                            </div>
                        </section>

                        {/* Mục 3 */}
                        <section id="truy-cap" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                3. Phân quyền truy cập hồ sơ (Role-based Access)
                            </h2>
                            <p>
                                CareLink áp dụng nguyên tắc đặc quyền tối thiểu (Least Privilege). Chỉ các đối tượng được ủy quyền sau mới có quyền tiếp cận dữ liệu người bệnh:
                            </p>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                                <li><strong>Chủ tài khoản Gia đình:</strong> Có toàn quyền xem, sửa đổi, bổ sung và xuất lịch sử báo cáo sức khỏe bất kỳ lúc nào.</li>
                                <li><strong>Điều dưỡng được phân công ca trực:</strong> Chỉ được cấp quyền xem thông tin ghi chú ca trực trong vòng 24 giờ trước khi ca trực bắt đầu và kết thúc quyền xem chi tiết sau khi hoàn tất bàn giao.</li>
                                <li><strong>Ban Quản trị & Bác sĩ cố vấn CareLink:</strong> Chỉ truy cập khi có yêu cầu hỗ trợ khẩn cấp hoặc điều tra sự cố chuyên môn được gia đình phản ánh.</li>
                            </ul>
                        </section>

                        {/* Mục 4 */}
                        <section id="hipaa" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                    4. Tiêu chuẩn bảo mật HIPAA & Mã hóa dữ liệu
                                </h2>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-100 text-teal-800">
                                    HIPAA Aligned
                                </span>
                            </div>
                            <p>
                                Mặc dù hoạt động tại Việt Nam, CareLink tự nguyện áp dụng các nguyên tắc cốt lõi theo Đạo luật Trách nhiệm Giải trình và Cung cấp Bảo hiểm Y tế (HIPAA - Hoa Kỳ) về bảo vệ hồ sơ sức khỏe điện tử (ePHI):
                            </p>
                            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs sm:text-sm space-y-2">
                                <p><strong>🔒 Mã hóa đường truyền (In-transit):</strong> Toàn bộ dữ liệu trao đổi giữa ứng dụng và máy chủ được mã hóa SSL/TLS 256-bit.</p>
                                <p><strong>🛡️ Mã hóa lưu trữ (At-rest):</strong> Hồ sơ tiền sử bệnh lý và chỉ số sinh tồn được mã hóa phân tách khóa bảo mật độc lập trong cơ sở dữ liệu y tế.</p>
                                <p><strong>📝 Nhật ký truy cập (Audit Logs):</strong> Mọi hành động xem, tải hoặc cập nhật bệnh án đều được hệ thống ghi nhận thời gian và danh tính người thực hiện.</p>
                            </div>
                        </section>

                        {/* Mục 5 */}
                        <section id="chia-se" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                5. Cam kết không chia sẻ dữ liệu cho bên thứ ba
                            </h2>
                            <p>
                                CareLink khẳng định cam kết đạo đức nghề nghiệp:
                            </p>
                            <p className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100 text-xs sm:text-sm text-rose-900 font-medium">
                                ❌ CareLink <strong>tuyệt đối không bán, cho thuê hoặc thương mại hóa</strong> hồ sơ sức khỏe, số điện thoại hay thông tin bệnh nhân cho bất kỳ công ty dược phẩm, bảo hiểm hay bên thứ ba nào vì mục đích quảng cáo thương mại.
                            </p>
                        </section>

                        {/* Mục 6 */}
                        <section id="quyen-han" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                6. Quyền của gia đình & bệnh nhân
                            </h2>
                            <p>
                                Quý gia đình luôn nắm toàn quyền sở hữu đối với dữ liệu của mình:
                            </p>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                                <li><strong>Quyền tra cứu & Trích xuất:</strong> Xuất file PDF Báo cáo theo dõi sức khỏe để mang tới bệnh viện cho bác sĩ điều trị xem xét.</li>
                                <li><strong>Quyền chỉnh sửa:</strong> Cập nhật phác đồ điều trị, toa thuốc mới hoặc chỉ số dị ứng ngay trong mục Cài đặt hoặc Hồ sơ người thân.</li>
                                <li><strong>Quyền xóa vĩnh viễn (Right to be Forgotten):</strong> Yêu cầu xóa toàn bộ lịch sử tài khoản và dữ liệu sức khỏe khi chấm dứt sử dụng dịch vụ.</li>
                            </ul>
                        </section>

                        {/* Mục 7 */}
                        <section id="lien-he" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                7. Liên hệ Ban Quản trị Bảo mật
                            </h2>
                            <p>
                                Nếu có bất kỳ câu hỏi, thắc mắc hoặc yêu cầu liên quan đến chính sách bảo mật thông tin y tế, vui lòng liên hệ trực tiếp:
                            </p>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5">
                                <p><strong>Hội đồng Đạo đức & Bảo mật Dữ liệu CareLink</strong></p>
                                <p>Địa chỉ văn phòng: Tòa nhà CareLink Medical, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh</p>
                                <p>Hotline khẩn cấp: <span className="font-bold text-[#00677c]">1900 1234</span> (24/7)</p>
                                <p>Email tiếp nhận văn bản: <span className="font-bold text-[#00677c]">privacy@carelink.vn</span></p>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}
