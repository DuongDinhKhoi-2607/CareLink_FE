import React, { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CaregiverCard from "../components/CaregiverCard";

// Dữ liệu danh mục lọc
const qualifications = [
    "Điều dưỡng (RN)",
    "Sinh viên Điều dưỡng",
    "Y tá thực hành",
];

const specialties = [
    "Chăm sóc người già",
    "Vật lý trị liệu",
    "Chăm sóc vết thương",
    "Chăm sóc sau phẫu thuật",
];

const availabilityOptions = ["Ngày thường", "Cuối tuần", "Ca ngày", "Ca đêm"];

// Dữ liệu người chăm sóc (Ảnh trực tuyến nét, bền vững, không lỗi)
const caregiversData = [
    {
        id: 1,
        name: "Nguyễn Thùy Linh",
        role: "Sinh viên Điều dưỡng năm 4",
        rate: "80.000đ/giờ",
        experience: "2 năm KN",
        specialty: "Chăm sóc người già",
        quote: "Sinh viên điều dưỡng tận tâm, tập trung vào việc cung cấp dịch vụ chăm sóc chu đáo, nhẹ nhàng.",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 2,
        name: "Nguyễn Hoàng Nam",
        role: "Điều dưỡng (RN)",
        rate: "200.000đ/giờ",
        experience: "8 năm KN",
        specialty: "Chăm sóc vết thương",
        quote: "Điều dưỡng chuyên môn cao chuyên về phục hồi sau phẫu thuật, xử lý vết thương ngoại khoa.",
        rating: "5.0",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 3,
        name: "Trần Thị Kim Chi",
        role: "Cử nhân Phục hồi Chức năng",
        rate: "150.000đ/giờ",
        experience: "5 năm KN",
        specialty: "Vật lý trị liệu",
        quote: "Tập trung vào phục hồi chức năng vận động và các bài tập phục hồi chức năng thể chất cho người cao tuổi.",
        rating: "4.8",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 4,
        name: "Phạm Quốc Huy",
        role: "Sinh viên Điều dưỡng năm 3",
        rate: "65.000đ/giờ",
        experience: "1 năm KN",
        specialty: "Chăm sóc cơ bản",
        quote: "Năng động và nhiệt huyết, mong muốn hỗ trợ các hoạt động sinh hoạt hàng ngày và bầu bạn cùng người thân.",
        rating: "4.7",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    },
];

export default function CaregiverList() {
    // State tìm kiếm & bộ lọc
    const [location, setLocation] = useState("");
    const [keyword, setKeyword] = useState("");
    const [selectedQualifications, setSelectedQualifications] = useState([]);
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState([]);
    const [priceRange, setPriceRange] = useState(275000);
    const [sort, setSort] = useState("Đánh giá cao nhất");
    const [currentPage, setCurrentPage] = useState(1);

    // Toggle checkbox / button lọc
    const toggleItem = (item, list, setList) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const clearFilters = () => {
        setLocation("");
        setKeyword("");
        setSelectedQualifications([]);
        setSelectedSpecialties([]);
        setSelectedAvailability([]);
        setPriceRange(275000);
    };

    const handleProfile = (caregiver) => {
        alert(`Xem chi tiết hồ sơ của: ${caregiver.name}`);
    };

    const handleBook = (caregiver) => {
        alert(`Tiến hành đặt lịch với: ${caregiver.name}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans antialiased text-[#102030]">
            <Header />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

                {/* ============================================================ */}
                {/* THANH TÌM KIẾM NHANH                                          */}
                {/* ============================================================ */}
                <div className="w-full bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end"
                    >
                        {/* Input Địa điểm */}
                        <div className="sm:col-span-5 flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Vị trí
                            </label>
                            <div className="relative flex items-center">
                                <svg className="w-5 h-5 text-slate-400 absolute left-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Thành phố, Quận, hoặc Mã bưu điện"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00677c] focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Input Kỹ năng / Từ khóa */}
                        <div className="sm:col-span-5 flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Kỹ năng hoặc Từ khóa
                            </label>
                            <div className="relative flex items-center">
                                <svg className="w-5 h-5 text-slate-400 absolute left-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="VD: Vật lý trị liệu, Chăm sóc vết thương..."
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00677c] focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Nút Tìm kiếm */}
                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                className="w-full py-3 px-6 bg-[#00677c] text-white rounded-xl text-sm font-bold hover:bg-[#005566] transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <span>Tìm kiếm</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* ============================================================ */}
                {/* KHU VỰC CHÍNH: BỘ LỌC BÊN TRÁI + KẾT QUẢ BÊN PHẢI            */}
                {/* ============================================================ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* CỘT BỘ LỌC (SIDEBAR - 4 CỘT) */}
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <h2 className="text-base font-bold text-[#102030]">Bộ lọc tìm kiếm</h2>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-xs font-semibold text-[#00677c] hover:underline"
                                >
                                    Xóa tất cả
                                </button>
                            </div>

                            {/* Lọc: Trình độ chuyên môn */}
                            <div className="flex flex-col gap-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Trình độ chuyên môn
                                </h3>
                                <div className="flex flex-col gap-2.5">
                                    {qualifications.map((q) => (
                                        <label key={q} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={selectedQualifications.includes(q)}
                                                onChange={() => toggleItem(q, selectedQualifications, setSelectedQualifications)}
                                                className="w-4 h-4 rounded border-slate-300 text-[#00677c] focus:ring-[#00677c]"
                                            />
                                            <span>{q}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Lọc: Chuyên khoa */}
                            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Chuyên khoa
                                </h3>
                                <div className="flex flex-col gap-2.5">
                                    {specialties.map((s) => (
                                        <label key={s} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={selectedSpecialties.includes(s)}
                                                onChange={() => toggleItem(s, selectedSpecialties, setSelectedSpecialties)}
                                                className="w-4 h-4 rounded border-slate-300 text-[#00677c] focus:ring-[#00677c]"
                                            />
                                            <span>{s}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Lọc: Mức giá theo giờ */}
                            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Mức giá theo giờ
                                    </h3>
                                    <span className="text-xs font-bold text-[#00677c]">
                                        {priceRange.toLocaleString("vi-VN")} đ/h
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="50000"
                                    max="500000"
                                    step="25000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00677c]"
                                />
                                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                                    <span>50.000 đ</span>
                                    <span>500.000 đ</span>
                                </div>
                            </div>

                            {/* Lọc: Thời gian rảnh */}
                            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Thời gian rảnh
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {availabilityOptions.map((opt) => {
                                        const isSelected = selectedAvailability.includes(opt);
                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => toggleItem(opt, selectedAvailability, setSelectedAvailability)}
                                                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${isSelected
                                                        ? "bg-[#00677c] text-white border-[#00677c]"
                                                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Banner Cam kết an toàn & lý lịch */}
                        <div className="bg-[#102030] text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col gap-3 relative overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.48-5.72A11.956 11.956 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h4 className="text-sm font-bold">Xác minh & Kiểm tra lý lịch</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Tất cả người chăm sóc của chúng tôi đều trải qua quy trình sàng lọc 5 bước nghiêm ngặt trước khi nhận việc.
                            </p>
                        </div>
                    </aside>

                    {/* CỘT DANH SÁCH KẾT QUẢ (8 CỘT) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* Thanh tiêu đề & Sắp xếp kết quả */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                            <p className="text-sm text-slate-500">
                                Hiển thị <strong className="text-[#102030] font-bold">124</strong> chuyên gia y tế tại{" "}
                                <strong className="text-[#102030] font-bold">Thành phố Hồ Chí Minh</strong>
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Sắp xếp theo:</span>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 text-xs font-bold text-[#102030] py-2 px-3 rounded-xl focus:outline-none focus:border-[#00677c]"
                                >
                                    <option>Đánh giá cao nhất</option>
                                    <option>Kinh nghiệm nhiều nhất</option>
                                    <option>Giá thấp nhất</option>
                                    <option>Giá cao nhất</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid danh sách Caregivers (chia 2 cột) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {caregiversData.map((caregiver) => (
                                <CaregiverCard
                                    key={caregiver.id}
                                    caregiver={caregiver}
                                    onProfile={handleProfile}
                                    onBook={handleBook}
                                />
                            ))}
                        </div>

                        {/* Phân trang (Pagination) */}
                        <nav className="flex items-center justify-center gap-2 pt-6">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                            >
                                &lt;
                            </button>

                            {[1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setCurrentPage(num)}
                                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === num
                                            ? "bg-[#102030] text-white shadow-xs"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}

                            <span className="px-1 text-slate-400 font-bold">...</span>

                            <button
                                type="button"
                                onClick={() => setCurrentPage(12)}
                                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === 12
                                        ? "bg-[#102030] text-white shadow-xs"
                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                12
                            </button>

                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.min(12, p + 1))}
                                disabled={currentPage === 12}
                                className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                            >
                                &gt;
                            </button>
                        </nav>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}