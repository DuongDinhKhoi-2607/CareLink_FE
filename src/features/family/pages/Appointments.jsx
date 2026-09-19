import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Appointments() {
    const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' | 'ongoing' | 'completed'
    const [searchQuery, setSearchQuery] = useState("");
    const [serviceFilter, setServiceFilter] = useState("all");
    const [monthFilter, setMonthFilter] = useState("09/2026");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedAppointment, setSelectedAppointment] = useState(null); // Cho modal xem chi tiết

    // Mock data chuẩn theo đúng giao diện thực tế và ảnh mẫu của user
    const [appointments, setAppointments] = useState([
        {
            id: "CK-28491",
            tab: "upcoming",
            caregiver: {
                name: "Điều dưỡng Nguyễn Thùy Linh",
                role: "Chăm sóc phục hồi chức năng & Vận động y tế",
                avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
                verified: true,
                phone: "0912 888 999",
            },
            service: "Chăm sóc phục hồi chức năng & Vận động y tế",
            serviceCategory: "health_care",
            recipient: "Bà Nguyễn Thị Lan",
            recipientRelation: "Mẹ, 75 tuổi",
            date: "Thứ Bảy, 20/09/2026",
            time: "08:00 – 12:00 (4 giờ)",
            duration: "4 giờ",
            location: "Quận Bình Thạnh, TP. Hồ Chí Minh",
            status: "confirmed",
            statusLabel: "ĐÃ XÁC NHẬN",
            statusBadge: "bg-[#e2f4f2] text-[#007469]",
            dotColor: "bg-[#00a896]",
            canCancel: false,
            tasks: ["Đo huyết áp & đường huyết", "Hỗ trợ co duỗi khớp gối 20 phút", "Nhắc uống thuốc theo đơn"],
            price: "420.000đ",
        },
        {
            id: "CK-28503",
            tab: "upcoming",
            caregiver: {
                name: "Điều dưỡng Trần Văn An",
                role: "Kiểm tra huyết áp định kỳ & Theo dõi dùng thuốc",
                avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
                verified: true,
                phone: "0903 111 222",
            },
            service: "Kiểm tra huyết áp định kỳ & Theo dõi dùng thuốc",
            serviceCategory: "health_care",
            recipient: "Ông Nguyễn Văn Bình",
            recipientRelation: "Bố, 82 tuổi",
            date: "Chủ Nhật, 21/09/2026",
            time: "14:30 – 16:30 (2 giờ)",
            duration: "2 giờ",
            location: "Quận Bình Thạnh, TP. Hồ Chí Minh",
            status: "pending",
            statusLabel: "CHỜ XÁC NHẬN",
            statusBadge: "bg-[#e0f2f4] text-[#007d8a]",
            dotColor: "bg-[#009bb9]",
            canCancel: true,
            tasks: ["Đo huyết áp sau giấc ngủ trưa", "Hỗ trợ tập đi với khung tập", "Theo dõi uống đủ 500ml nước"],
            price: "350.000đ",
        },
        {
            id: "CK-28540",
            tab: "upcoming",
            caregiver: {
                name: "Điều dưỡng Nguyễn Thùy Linh",
                role: "Vận động trị liệu khớp gối & Hỗ trợ sinh hoạt",
                avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
                verified: true,
                phone: "0912 888 999",
            },
            service: "Vận động trị liệu khớp gối & Hỗ trợ sinh hoạt",
            serviceCategory: "living_support",
            recipient: "Bà Nguyễn Thị Lan",
            recipientRelation: "Mẹ, 75 tuổi",
            date: "Thứ Tư, 24/09/2026",
            time: "09:00 – 11:00 (2 giờ)",
            duration: "2 giờ",
            location: "Quận Bình Thạnh, TP. Hồ Chí Minh",
            status: "confirmed",
            statusLabel: "ĐÃ XÁC NHẬN",
            statusBadge: "bg-[#e2f4f2] text-[#007469]",
            dotColor: "bg-[#00a896]",
            canCancel: false,
            tasks: ["Vận động khớp gối phục hồi", "Bầu bạn đi dạo nhẹ trong nhà", "Ghi nhật ký thể trạng"],
            price: "320.000đ",
        },
        {
            id: "CK-28410",
            tab: "ongoing",
            caregiver: {
                name: "Điều dưỡng Nguyễn Thùy Linh",
                role: "Chăm sóc phục hồi chức năng & Vận động y tế",
                avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
                verified: true,
                phone: "0912 888 999",
            },
            service: "Chăm sóc toàn diện & Theo dõi huyết áp",
            serviceCategory: "health_care",
            recipient: "Bà Nguyễn Thị Lan",
            recipientRelation: "Mẹ, 75 tuổi",
            date: "Hôm nay, 19/09/2026",
            time: "09:00 – 13:00 (4 giờ)",
            duration: "4 giờ (Đang diễn ra 2h 15m)",
            progressPercent: 56,
            location: "Quận Bình Thạnh, TP. Hồ Chí Minh",
            status: "in_progress",
            statusLabel: "ĐANG DIỄN RA",
            statusBadge: "bg-teal-50 text-teal-700 ring-1 ring-teal-500/20",
            dotColor: "bg-teal-500 animate-ping",
            canCancel: false,
            currentNote: "Điều dưỡng đang hướng dẫn bài tập phục hồi chức năng khớp gối và kiểm tra chỉ số huyết áp sau uống thuốc.",
            tasks: ["Đo huyết áp & đường huyết", "Uống thuốc đúng giờ", "Bài tập phục hồi khớp gối"],
            price: "420.000đ",
        },
        {
            id: "CK-28312",
            tab: "completed",
            caregiver: {
                name: "Điều dưỡng Trần Văn An",
                role: "Cử nhân Điều dưỡng chuyên khoa",
                avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
                verified: true,
                phone: "0903 111 222",
            },
            service: "Bầu bạn & Trò chuyện tinh thần",
            serviceCategory: "companionship",
            recipient: "Ông Nguyễn Văn Bình",
            recipientRelation: "Bố, 82 tuổi",
            date: "16/09/2026",
            time: "08:30 – 11:30 (3 giờ)",
            duration: "3 giờ",
            location: "Quận Bình Thạnh, TP. Hồ Chí Minh",
            status: "completed",
            statusLabel: "ĐÃ HOÀN THÀNH",
            statusBadge: "bg-slate-100 text-slate-700",
            dotColor: "bg-slate-400",
            canCancel: false,
            reviewed: true,
            rating: 5,
            reviewComment: "Điều dưỡng An rất đúng giờ, trò chuyện chu đáo giúp bố tôi vui vẻ và tích cực tập đi hơn.",
            tasks: ["Trò chuyện, đọc sách báo", "Đi dạo công viên nhẹ nhàng"],
            price: "350.000đ",
        },
    ]);

    // Xử lý Hủy ca hẹn
    const handleCancelAppointment = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn yêu cầu hủy ca chăm sóc này không?")) {
            setAppointments((prev) => prev.filter((apt) => apt.id !== id));
        }
    };

    // Lọc theo Tab, Tìm kiếm, Dịch vụ, Trạng thái
    const filteredAppointments = appointments.filter((apt) => {
        if (apt.tab !== activeTab) return false;

        // Lọc theo từ khóa tìm kiếm điều dưỡng / người nhận
        if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase();
            const matchName = apt.caregiver.name.toLowerCase().includes(q);
            const matchService = apt.service.toLowerCase().includes(q);
            const matchRecipient = apt.recipient.toLowerCase().includes(q);
            if (!matchName && !matchService && !matchRecipient) return false;
        }

        // Lọc theo loại dịch vụ
        if (serviceFilter !== "all" && apt.serviceCategory !== serviceFilter) {
            return false;
        }

        // Lọc theo trạng thái
        if (statusFilter !== "all" && apt.status !== statusFilter) {
            return false;
        }

        return true;
    });

    const countUpcoming = appointments.filter((a) => a.tab === "upcoming").length;
    const countOngoing = appointments.filter((a) => a.tab === "ongoing").length;
    const countCompleted = 12; // Chuẩn theo số liệu trên mockup của user: "Đã hoàn thành (12)"

    return (
        <div className="p-4 sm:p-8 flex flex-col gap-6 max-w-6xl mx-auto font-sans antialiased text-[#102030]">
            {/* Header trang lịch hẹn */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Lịch hẹn chăm sóc
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Theo dõi lịch trình các ca điều dưỡng đến chăm sóc người thân của bạn.
                    </p>
                </div>

                <Link
                    to="/services"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow hover:-translate-y-0.5 shrink-0 cursor-pointer"
                >
                    <svg className="w-4 h-4 text-cyan-200" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Đặt lịch mới</span>
                </Link>
            </header>

            {/* Thanh Tab gạch chân (Underline Tabs) chuẩn y như hình ảnh mẫu */}
            <div className="border-b border-slate-200">
                <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto">
                    {/* Tab: Sắp tới */}
                    <button
                        type="button"
                        onClick={() => setActiveTab("upcoming")}
                        className={`pb-3.5 flex items-center gap-2 text-sm sm:text-base font-semibold transition-all cursor-pointer relative shrink-0 ${
                            activeTab === "upcoming"
                                ? "text-slate-900 font-bold border-b-2 border-slate-900"
                                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent"
                        }`}
                    >
                        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Sắp tới ({countUpcoming})</span>
                    </button>

                    {/* Tab: Đang diễn ra */}
                    <button
                        type="button"
                        onClick={() => setActiveTab("ongoing")}
                        className={`pb-3.5 flex items-center gap-2 text-sm sm:text-base font-semibold transition-all cursor-pointer relative shrink-0 ${
                            activeTab === "ongoing"
                                ? "text-slate-900 font-bold border-b-2 border-slate-900"
                                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent"
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        <span>Đang diễn ra ({countOngoing})</span>
                    </button>

                    {/* Tab: Đã hoàn thành */}
                    <button
                        type="button"
                        onClick={() => setActiveTab("completed")}
                        className={`pb-3.5 flex items-center gap-2 text-sm sm:text-base font-semibold transition-all cursor-pointer relative shrink-0 ${
                            activeTab === "completed"
                                ? "text-slate-900 font-bold border-b-2 border-slate-900"
                                : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent"
                        }`}
                    >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Đã hoàn thành ({countCompleted})</span>
                    </button>
                </div>
            </div>

            {/* Thanh Tìm kiếm & 3 Bộ Lọc (chuẩn giao diện trong ảnh) */}
            <div className="bg-[#f8fafc] sm:bg-transparent rounded-2xl p-2 sm:p-0 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                {/* Tìm theo tên điều dưỡng */}
                <div className="relative flex-1">
                    <svg
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm theo tên điều dưỡng"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#f1f5f9]/70 hover:bg-slate-100/90 focus:bg-white border border-slate-200/90 focus:border-teal-600 rounded-xl text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
                    />
                </div>

                {/* Dropdown 1: Tất cả dịch vụ */}
                <div className="relative">
                    <select
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#f1f5f9]/70 hover:bg-slate-100/90 border border-slate-200/90 focus:border-teal-600 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                        <option value="all">Tất cả dịch vụ</option>
                        <option value="health_care">Chăm sóc y tế</option>
                        <option value="living_support">Hỗ trợ sinh hoạt</option>
                        <option value="companionship">Bầu bạn tâm sự</option>
                    </select>
                    <svg
                        className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>

                {/* Dropdown 2: Tháng này (09/2026) */}
                <div className="relative">
                    <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#f1f5f9]/70 hover:bg-slate-100/90 border border-slate-200/90 focus:border-teal-600 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                        <option value="09/2026">Tháng này (09/2026)</option>
                        <option value="08/2026">Tháng trước (08/2026)</option>
                        <option value="all_months">Tất cả thời gian</option>
                    </select>
                    <svg
                        className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>

                {/* Dropdown 3: Tất cả trạng thái */}
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#f1f5f9]/70 hover:bg-slate-100/90 border border-slate-200/90 focus:border-teal-600 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer transition-colors"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="in_progress">Đang diễn ra</option>
                    </select>
                    <svg
                        className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>

            {/* Danh sách các thẻ ca hẹn (Appointments Cards) */}
            {filteredAppointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-3 shadow-xs">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Không tìm thấy ca hẹn</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-4">
                        Không có lịch chăm sóc nào phù hợp với bộ lọc tìm kiếm hiện tại.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            setServiceFilter("all");
                            setStatusFilter("all");
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                    >
                        Đặt lại bộ lọc
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredAppointments.map((apt) => {
                        return (
                            <div
                                key={apt.id}
                                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                            >
                                {/* ======================================================== */}
                                {/* PHẦN TRÊN: AVATAR, TÊN, CHUYÊN MÔN, NGƯỜI NHẬN & TRẠNG THÁI */}
                                {/* ======================================================== */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    {/* Cột Trái: Avatar + Thông tin điều dưỡng + Dịch vụ + Người nhận chăm sóc */}
                                    <div className="flex items-start gap-4">
                                        <div className="relative shrink-0">
                                            <img
                                                src={apt.caregiver.avatar}
                                                alt={apt.caregiver.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300";
                                                }}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            {/* Tên điều dưỡng + Badge Đã xác minh có icon bao quanh dấu tích */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                                    {apt.caregiver.name}
                                                </h3>
                                                {apt.caregiver.verified && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-medium border border-slate-200/60">
                                                        {/* Icon dấu tích có vòng bao quanh (seal-check) chuẩn như ảnh */}
                                                        <svg className="w-3.5 h-3.5 text-teal-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Đã xác minh</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Tên dịch vụ màu xanh ngọc */}
                                            <p className="text-sm font-semibold text-[#00829d]">
                                                {apt.service}
                                            </p>

                                            {/* Người nhận chăm sóc */}
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                                <span>
                                                    Người nhận chăm sóc:{" "}
                                                    <strong className="text-slate-900 font-bold">{apt.recipient}</strong>{" "}
                                                    <span className="text-slate-500">({apt.recipientRelation})</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột Phải: Trạng thái + Mã lịch hẹn */}
                                    <div className="flex flex-col sm:items-end gap-1 shrink-0">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider ${apt.statusBadge}`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${apt.dotColor}`} />
                                            {apt.statusLabel}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            Mã lịch hẹn: #{apt.id}
                                        </span>
                                    </div>
                                </div>

                                {/* ======================================================== */}
                                {/* ĐƯỜNG GẠCH PHÂN CÁCH NGAY DƯỚI CHỖ NGƯỜI NHẬN CHĂM SÓC   */}
                                {/* ======================================================== */}
                                <hr className="border-t border-slate-200/90 my-1" />

                                {/* ======================================================== */}
                                {/* PHẦN DƯỚI ĐƯỜNG GẠCH: NẰM CHUNG HÀNG VỚI NHAU             */}
                                {/* TRÁI: Thứ, ngày, giờ, địa chỉ                            */}
                                {/* PHẢI: Nút Nhắn tin & Xem chi tiết                        */}
                                {/* ======================================================== */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    {/* Bên trái: Ngày giờ & Địa điểm */}
                                    <div className="flex flex-col gap-1.5 text-xs text-slate-700">
                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                </svg>
                                                <strong className="text-slate-800 font-semibold">{apt.date}</strong>
                                            </div>

                                            <div className="flex items-center gap-1.5 font-medium">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-slate-700">{apt.time}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                            <span>{apt.location}</span>
                                        </div>
                                    </div>

                                    {/* Bên phải: Nằm chung hàng ngang dưới gạch phân cách */}
                                    <div className="flex items-center gap-2.5 sm:self-center shrink-0">
                                        {/* Nút Hủy ca (nếu được phép) */}
                                        {apt.canCancel && (
                                            <button
                                                type="button"
                                                onClick={() => handleCancelAppointment(apt.id)}
                                                className="text-rose-600 hover:text-rose-700 hover:underline font-semibold text-xs sm:text-sm px-2 py-1.5 cursor-pointer transition-colors"
                                            >
                                                Hủy ca
                                            </button>
                                        )}

                                        {/* Nút Nhắn tin */}
                                        {!apt.canCancel && (
                                            <Link
                                                to="/chat"
                                                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-2xs"
                                            >
                                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                                </svg>
                                                <span>Nhắn tin</span>
                                            </Link>
                                        )}

                                        {/* Nút Xem chi tiết */}
                                        <button
                                            type="button"
                                            onClick={() => setSelectedAppointment(apt)}
                                            className="px-4.5 py-2 bg-white border border-slate-800 hover:bg-slate-900 hover:text-white text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>

                                {/* Thông tin bổ sung cho ca Đang diễn ra */}
                                {apt.tab === "ongoing" && (
                                    <div className="mt-2 pt-3.5 border-t border-slate-100 bg-[#e0f7fa]/30 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl">
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="font-semibold text-teal-800 flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                                                Tiến độ ca chăm sóc trực tiếp ({apt.duration})
                                            </span>
                                            <span className="font-bold text-teal-700">{apt.progressPercent}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-teal-500 to-[#00677c] h-full rounded-full transition-all duration-500"
                                                style={{ width: `${apt.progressPercent}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-600 mt-2 italic">"{apt.currentNote}"</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal xem chi tiết lịch hẹn */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-page-enter">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Chi tiết ca chăm sóc</h3>
                                <p className="text-xs text-slate-500">Mã ca hẹn: #{selectedAppointment.id}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedAppointment(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                                <img
                                    src={selectedAppointment.caregiver.avatar}
                                    alt={selectedAppointment.caregiver.name}
                                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{selectedAppointment.caregiver.name}</h4>
                                    <p className="text-teal-700 font-medium text-[11px]">{selectedAppointment.service}</p>
                                    <p className="text-slate-500 text-[11px]">SĐT liên hệ: {selectedAppointment.caregiver.phone}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-slate-700">
                                <div className="p-2.5 bg-slate-50/80 rounded-xl">
                                    <span className="text-slate-400 block text-[11px]">Người nhận chăm sóc:</span>
                                    <strong className="text-slate-900 font-semibold">{selectedAppointment.recipient}</strong> ({selectedAppointment.recipientRelation})
                                </div>
                                <div className="p-2.5 bg-slate-50/80 rounded-xl">
                                    <span className="text-slate-400 block text-[11px]">Chi phí dịch vụ:</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedAppointment.price}</span>
                                    <span className="text-[10px] text-emerald-600 block">✓ Đã thanh toán đảm bảo</span>
                                </div>
                                <div className="p-2.5 bg-slate-50/80 rounded-xl col-span-2">
                                    <span className="text-slate-400 block text-[11px]">Thời gian & Địa điểm:</span>
                                    <span className="font-semibold text-slate-800">{selectedAppointment.date} ({selectedAppointment.time})</span>
                                    <p className="text-slate-600 mt-0.5">{selectedAppointment.location}</p>
                                </div>
                            </div>

                            {selectedAppointment.tasks && (
                                <div className="p-3 bg-slate-50/80 rounded-xl">
                                    <span className="text-slate-500 font-semibold block text-[11px] mb-1.5">Nhiệm vụ trong ca chăm sóc:</span>
                                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                                        {selectedAppointment.tasks.map((task, idx) => (
                                            <li key={idx}>{task}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setSelectedAppointment(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                            <Link
                                to="/chat"
                                className="px-4 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs"
                            >
                                Nhắn tin điều dưỡng
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
