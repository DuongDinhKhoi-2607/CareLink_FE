import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
    const [activeSection, setActiveSection] = useState("dinh-nghia");

    const sections = [
        { id: "dinh-nghia", title: "1. Định nghĩa & Phạm vi nền tảng" },
        { id: "xac-nhan-hai-chieu", title: "2. Cơ chế Đặt lịch 2 chiều" },
        { id: "trach-nhiem-gia-dinh", title: "3. Trách nhiệm của Phía Gia đình" },
        { id: "tieu-chuan-dieu-duong", title: "4. Tiêu chuẩn & Trách nhiệm Điều dưỡng" },
        { id: "thanh-toan-hoan-tien", title: "5. Phí dịch vụ, Hủy ca & Hoàn tiền" },
        { id: "gioi-han-trach-nhiem", title: "6. Giới hạn trách nhiệm & Sự cố khẩn cấp" },
        { id: "giai-quyet-tranh-chap", title: "7. Giải quyết khiếu nại & Tranh chấp" },
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

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Phiên bản: 2.4 • Tháng 05/2026
                    </span>
                </div>

                {/* Header trang */}
                <header className="bg-gradient-to-r from-[#003445] to-[#00677c] text-white p-6 sm:p-10 rounded-3xl shadow-md relative overflow-hidden">
                    <div className="relative z-10 max-w-3xl flex flex-col gap-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-bold uppercase tracking-wider w-fit">
                            QUY CHẾ HOẠT ĐỘNG NỀN TẢNG
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                            Điều Khoản Dịch Vụ & Tiêu Chuẩn Hoạt Động
                        </h1>
                        <p className="text-sm sm:text-base text-teal-50/90 leading-relaxed">
                            Chào mừng bạn đến với CareLink. Khi đăng ký tài khoản và sử dụng các tính năng kết nối chăm sóc sức khỏe, bạn xác nhận đã đọc, hiểu rõ và đồng thuận tuân thủ các quy tắc an toàn y tế và điều khoản dưới đây.
                        </p>
                    </div>
                </header>

                {/* Bố cục 2 cột: Mục lục nhanh + Nội dung chi tiết */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Cột trái: Mục lục nội dung (Sticky) */}
                    <aside className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs sticky top-24">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Mục lục điều khoản
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
                            <span className="text-[11px] text-slate-400">Tư vấn pháp chế y tế:</span>
                            <a
                                href="tel:19001234"
                                className="text-xs font-bold text-[#00677c] hover:underline flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                Tổng đài Pháp chế: 1900 1234
                            </a>
                        </div>
                    </aside>

                    {/* Cột phải: Các điều khoản chi tiết */}
                    <main className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-[15px]">
                        
                        {/* Mục 1 */}
                        <section id="dinh-nghia" className="scroll-mt-28 space-y-3">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                1. Định nghĩa & Phạm vi hoạt động nền tảng
                            </h2>
                            <p>
                                <strong>CareLink</strong> là nền tảng công nghệ kết nối trực tiếp giữa <strong>Gia đình có nhu cầu chăm sóc người thân tại nhà</strong> và <strong>Nhân sự điều dưỡng, sinh viên Y khoa chính quy</strong> đã qua kiểm duyệt hồ sơ.
                            </p>
                            <p>
                                CareLink cung cấp môi trường kiểm duyệt danh tính, hỗ trợ lên lịch, số hóa theo dõi sinh hiệu và giám sát chất lượng ca trực. CareLink không thay thế cơ sở khám chữa bệnh hay dịch vụ vận chuyển cấp cứu ngoại viện của bệnh viện nhà nước.
                            </p>
                        </section>

                        {/* Mục 2 */}
                        <section id="xac-nhan-hai-chieu" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                2. Cơ chế Đặt lịch Xác nhận Hai chiều (Two-Way Confirmation)
                            </h2>
                            <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-100 text-xs sm:text-sm space-y-2">
                                <p className="font-bold text-[#004d5d]">
                                    ⭐ Quy trình cốt lõi bảo vệ hai bên:
                                </p>
                                <p>
                                    1. <strong>Bước 1 - Gia đình yêu cầu:</strong> Sau khi tham vấn trước đặt lịch, gia đình gửi yêu cầu và thanh toán tạm giữ phí nền tảng. Lúc này ca trực ở trạng thái <em>Đang chờ người chăm sóc xác nhận</em>.
                                </p>
                                <p>
                                    2. <strong>Bước 2 - Điều dưỡng kiểm tra & Chấp nhận:</strong> Người chăm sóc xem xét lịch trình và tình trạng bệnh nhân trong danh sách <em>Yêu cầu đặt lịch (Booking Requests)</em> rồi bấm <strong>Chấp nhận ca</strong>.
                                </p>
                                <p>
                                    3. <strong>Bước 3 - Khởi tạo ca trực chính thức:</strong> Chỉ khi có sự đồng thuận từ cả 2 phía, hợp đồng ca trực mới có hiệu lực và được ghi vào lịch làm việc chính thức.
                                </p>
                            </div>
                        </section>

                        {/* Mục 3 */}
                        <section id="trach-nhiem-gia-dinh" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                3. Trách nhiệm của Phía Gia đình
                            </h2>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                                <li><strong>Cung cấp thông tin trung thực:</strong> Thông báo rõ ràng về bệnh án, các bệnh truyền nhiễm (nếu có), vết thương hở và các toa thuốc bác sĩ đã kê.</li>
                                <li><strong>Môi trường chăm sóc an toàn:</strong> Đảm bảo không gian phòng nghỉ của người bệnh thoáng đãng, đủ ánh sáng và tôn trọng phẩm giá của điều dưỡng viên.</li>
                                <li><strong>Không giao việc trái chuyên môn:</strong> Tuyệt đối không yêu cầu điều dưỡng làm các công việc nhà nặng nhọc (lau dọn nhà cửa toàn diện, nấu cỗ, chăm sóc thú cưng) ngoài phạm vi hợp đồng chăm sóc người bệnh.</li>
                            </ul>
                        </section>

                        {/* Mục 4 */}
                        <section id="tieu-chuan-dieu-duong" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                4. Tiêu chuẩn & Trách nhiệm của Điều dưỡng
                            </h2>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                                <li><strong>Kiểm duyệt đầu vào:</strong> Phải có CCCD gắn chip hợp lệ, thẻ sinh viên y khoa hoặc chứng chỉ hành nghề điều dưỡng còn hiệu lực do cơ quan y tế có thẩm quyền cấp.</li>
                                <li><strong>Tuân thủ giờ giấc:</strong> Có mặt đúng giờ hẹn. Trường hợp bất khả kháng phải thông báo qua ứng dụng tối thiểu 2 giờ trước giờ trực.</li>
                                <li><strong>Thực hiện đúng y lệnh:</strong> Tuân thủ phác đồ điều trị và toa thuốc của bác sĩ; ghi nhận trung thực các chỉ số sinh hiệu vào Báo cáo sức khỏe trên hệ thống.</li>
                                <li><strong>Quy tắc vô trùng:</strong> Mang găng tay y tế, khẩu trang và sát khuẩn tay chuẩn y khoa trước và sau mỗi thủ thuật chăm sóc.</li>
                            </ul>
                        </section>

                        {/* Mục 5 */}
                        <section id="thanh-toan-hoan-tien" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                5. Phí dịch vụ, Quy định Hủy ca & Hoàn tiền
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                                    <span className="font-bold text-emerald-800 block mb-1">Gia đình hủy trước 4 giờ</span>
                                    <p className="text-slate-600">Hoàn lại 100% tiền tạm giữ về ví tài khoản hoặc phương thức thanh toán ban đầu trong vòng 24 giờ.</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                                    <span className="font-bold text-amber-800 block mb-1">Gia đình hủy sát giờ (&lt; 2 giờ)</span>
                                    <p className="text-slate-600">Thu phí phụ cấp di chuyển 30% để bồi hoàn công sức chuẩn bị của điều dưỡng viên.</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                                    <span className="font-bold text-rose-800 block mb-1">Điều dưỡng tự ý hủy ca</span>
                                    <p className="text-slate-600">Hoàn 100% cho gia đình kèm voucher ưu đãi 50.000đ; hạ điểm uy tín chuyên môn của điều dưỡng.</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                                    <span className="font-bold text-teal-800 block mb-1">Minh bạch biểu phí</span>
                                    <p className="text-slate-600">Phí nền tảng chỉ 60.000đ/ca; mức thù lao trả trực tiếp cho điều dưỡng thể hiện công khai trên ứng dụng.</p>
                                </div>
                            </div>
                        </section>

                        {/* Mục 6 */}
                        <section id="gioi-han-trach-nhiem" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                6. Giới hạn trách nhiệm & Xử lý tình huống khẩn cấp
                            </h2>
                            <p>
                                Trong trường hợp người bệnh có dấu hiệu chuyển biến xấu nguy kịch (ngừng thở, huyết áp tụt sâu, đột quỵ cấp, hôn mê):
                            </p>
                            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs sm:text-sm text-rose-950 space-y-1.5 font-medium">
                                <p>🚨 <strong>Quy trình phản ứng nhanh:</strong></p>
                                <p>1. Điều dưỡng lập tức thực hiện sơ cứu ban đầu (CPR, thông đường thở) theo đúng năng lực đào tạo.</p>
                                <p>2. Gia đình hoặc điều dưỡng gọi ngay tổng đài <strong>115</strong> để yêu cầu xe cấp cứu của bệnh viện gần nhất.</p>
                                <p>3. Nhấn nút <strong>SOS: 1900 1234</strong> trên thanh ứng dụng CareLink để được Bác sĩ trực ban cố vấn từ xa.</p>
                            </div>
                        </section>

                        {/* Mục 7 */}
                        <section id="giai-quyet-tranh-chap" className="scroll-mt-28 space-y-3 pt-6 border-t border-slate-100">
                            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                                7. Giải quyết khiếu nại & Tranh chấp
                            </h2>
                            <p>
                                Cơ chế đánh giá sao 2 chiều sau mỗi ca trực (Gia đình đánh giá Điều dưỡng và ngược lại) là cơ sở dữ liệu quan trọng để CareLink bảo đảm tính công bằng. Mọi tranh chấp về chất lượng dịch vụ sẽ được Hội đồng Chuyên môn CareLink xử lý trong thời hạn tối đa 48 giờ làm việc.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Điều khoản này có hiệu lực từ ngày công bố và được điều chỉnh định kỳ để phù hợp với quy định pháp luật y tế hiện hành tại Việt Nam.
                            </p>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}
