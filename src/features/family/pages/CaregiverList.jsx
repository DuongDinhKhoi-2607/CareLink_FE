import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CaregiverCard from "../components/CaregiverCard";

// ============================================================
// DỮ LIỆU BỘ LỌC
// ============================================================

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

const availabilityOptions = [
    "Ngày thường",
    "Cuối tuần",
    "Ca ngày",
    "Ca đêm",
];

// ============================================================
// MOCK DATA - SAU NÀY CÓ THỂ THAY BẰNG API
// ============================================================

const caregiversData = [
    {
        id: 1,
        name: "Nguyễn Thùy Linh",
        role: "Sinh viên Điều dưỡng năm 4",
        rate: "80.000đ/giờ",
        rateNumber: 80000,
        experience: "2 năm KN",
        experienceYears: 2,
        specialty: "Chăm sóc người già",
        qualifications: "Sinh viên Điều dưỡng",
        availability: ["Ngày thường", "Cuối tuần", "Ca ngày"],
        location: "Đống Đa, Hà Nội",
        city: "Hà Nội",
        quote: "Sinh viên điều dưỡng tận tâm, chu đáo trong việc hỗ trợ vận động, ăn uống và trò chuyện cùng người cao tuổi.",
        rating: 4.9,
        image:
            "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 2,
        name: "Nguyễn Hoàng Nam",
        role: "Điều dưỡng (RN)",
        rate: "200.000đ/giờ",
        rateNumber: 200000,
        experience: "8 năm KN",
        experienceYears: 8,
        specialty: "Chăm sóc vết thương",
        qualifications: "Điều dưỡng (RN)",
        availability: ["Ngày thường", "Ca ngày", "Ca đêm"],
        location: "Quận 1, TP. Hồ Chí Minh",
        city: "Thành phố Hồ Chí Minh",
        quote: "Điều dưỡng chuyên môn cao chuyên về phục hồi sau phẫu thuật, rửa vết thương và theo dõi y tế.",
        rating: 5.0,
        image:
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 3,
        name: "Trần Thị Kim Chi",
        role: "Cử nhân Phục hồi Chức năng",
        rate: "150.000đ/giờ",
        rateNumber: 150000,
        experience: "5 năm KN",
        experienceYears: 5,
        specialty: "Vật lý trị liệu",
        qualifications: "Điều dưỡng (RN)",
        availability: ["Ngày thường", "Cuối tuần", "Ca ngày"],
        location: "Bình Thạnh, TP. Hồ Chí Minh",
        city: "Thành phố Hồ Chí Minh",
        quote: "Tập trung vào phục hồi chức năng vận động và các bài tập thể chất chuyên sâu cho người sau tai biến.",
        rating: 4.8,
        image:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 4,
        name: "Phạm Quốc Huy",
        role: "Sinh viên Điều dưỡng năm 3",
        rate: "65.000đ/giờ",
        rateNumber: 65000,
        experience: "1 năm KN",
        experienceYears: 1,
        specialty: "Chăm sóc người già",
        qualifications: "Sinh viên Điều dưỡng",
        availability: ["Cuối tuần", "Ca ngày"],
        location: "Thủ Đức, TP. Hồ Chí Minh",
        city: "Thành phố Hồ Chí Minh",
        quote: "Năng động và nhiệt huyết, mong muốn hỗ trợ các hoạt động sinh hoạt hàng ngày và bầu bạn cùng các cụ.",
        rating: 4.7,
        image:
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 5,
        name: "Lê Hoàng Yến",
        role: "Điều dưỡng Ngoại khoa (RN)",
        rate: "220.000đ/giờ",
        rateNumber: 220000,
        experience: "6 năm KN",
        experienceYears: 6,
        specialty: "Chăm sóc sau phẫu thuật",
        qualifications: "Điều dưỡng (RN)",
        availability: ["Ngày thường", "Cuối tuần", "Ca đêm"],
        location: "Quận 3, TP. Hồ Chí Minh",
        city: "Thành phố Hồ Chí Minh",
        quote: "Chuyên trách chăm sóc vết mổ ngoại khoa, theo dõi dịch dẫn lưu và hỗ trợ phục hồi hậu phẫu tại nhà.",
        rating: 4.9,
        image:
            "https://images.unsplash.com/photo-1594824813583-0498b8feae6e?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 6,
        name: "Vũ Đức Trọng",
        role: "Y tá thực hành chuyên khoa",
        rate: "120.000đ/giờ",
        rateNumber: 120000,
        experience: "4 năm KN",
        experienceYears: 4,
        specialty: "Chăm sóc sau phẫu thuật",
        qualifications: "Y tá thực hành",
        availability: ["Ngày thường", "Ca ngày"],
        location: "Quận 10, TP. Hồ Chí Minh",
        city: "Thành phố Hồ Chí Minh",
        quote: "Thành thạo kỹ thuật tiêm truyền, thay băng vô khuẩn và chăm sóc người bệnh hạn chế khả năng tự chủ.",
        rating: 4.8,
        image:
            "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400",
    },
];

// ============================================================
// ICONS
// ============================================================

function SearchIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
            />
        </svg>
    );
}

function LocationIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.14-7.5 11.25-7.5 11.25S4.5 17.64 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
        </svg>
    );
}

function CheckIcon({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 12.5 4 4L19 7"
            />
        </svg>
    );
}

function ChevronRightIcon({ className = "w-4 h-4" }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 18 6-6-6-6"
            />
        </svg>
    );
}

// ============================================================
// COMPONENT CHÍNH
// ============================================================

export default function CaregiverList() {
    const navigate = useNavigate();
    const locationState = useLocation();

    const serviceFromState = locationState.state?.selectedService;

    // ========================================================
    // STATE
    // ========================================================

    const [location, setLocation] = useState("");
    const [keyword, setKeyword] = useState("");

    const [selectedQualifications, setSelectedQualifications] =
        useState([]);

    const [selectedSpecialties, setSelectedSpecialties] = useState(
        serviceFromState?.specialtyMatch
            ? [serviceFromState.specialtyMatch]
            : []
    );

    const [selectedAvailability, setSelectedAvailability] = useState([]);

    const [priceRange, setPriceRange] = useState(275000);

    const [sort, setSort] = useState("Đánh giá cao nhất");

    const [activeService, setActiveService] = useState(
        serviceFromState || null
    );

    // ========================================================
    // FILTER HELPERS
    // ========================================================

    const toggleItem = (item, list, setList) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    // Reset bộ lọc nhưng vẫn giữ dịch vụ đang chọn
    const resetFilters = () => {
        setLocation("");
        setKeyword("");
        setSelectedQualifications([]);
        setSelectedSpecialties(
            activeService?.specialtyMatch
                ? [activeService.specialtyMatch]
                : []
        );
        setSelectedAvailability([]);
        setPriceRange(275000);
    };

    // Xem toàn bộ điều dưỡng
    const showAllCaregivers = () => {
        setActiveService(null);
        setSelectedSpecialties([]);

        navigate("/caregivers", {
            replace: true,
            state: {},
        });
    };

    const handleProfile = (caregiver) => {
        navigate("/caregivers/profile", {
            state: {
                caregiver,
                selectedService: activeService,
            },
        });
    };

    // ========================================================
    // FILTER LOGIC
    // ========================================================

    const filteredCaregivers = caregiversData
        .filter((caregiver) => {
            if (
                selectedSpecialties.length > 0 &&
                !selectedSpecialties.includes(caregiver.specialty)
            ) {
                return false;
            }

            if (
                selectedQualifications.length > 0 &&
                !selectedQualifications.includes(caregiver.qualifications)
            ) {
                return false;
            }

            if (
                caregiver.rateNumber &&
                caregiver.rateNumber > priceRange
            ) {
                return false;
            }

            if (selectedAvailability.length > 0) {
                const hasMatchAvailability =
                    selectedAvailability.some((option) =>
                        caregiver.availability?.includes(option)
                    );

                if (!hasMatchAvailability) return false;
            }

            if (keyword.trim() !== "") {
                const kw = keyword.toLowerCase();

                const matchName = caregiver.name
                    .toLowerCase()
                    .includes(kw);

                const matchSpecialty = caregiver.specialty
                    .toLowerCase()
                    .includes(kw);

                const matchRole = caregiver.role
                    .toLowerCase()
                    .includes(kw);

                if (!matchName && !matchSpecialty && !matchRole) {
                    return false;
                }
            }

            if (location.trim() !== "") {
                const loc = location.toLowerCase();

                const matchLocation = caregiver.location
                    ?.toLowerCase()
                    .includes(loc);

                const matchCity = caregiver.city
                    ?.toLowerCase()
                    .includes(loc);

                if (!matchLocation && !matchCity) {
                    return false;
                }
            }

            return true;
        })
        .sort((a, b) => {
            if (sort === "Đánh giá cao nhất") {
                return b.rating - a.rating;
            }

            if (sort === "Kinh nghiệm nhiều nhất") {
                return b.experienceYears - a.experienceYears;
            }

            if (sort === "Giá thấp nhất") {
                return a.rateNumber - b.rateNumber;
            }

            if (sort === "Giá cao nhất") {
                return b.rateNumber - a.rateNumber;
            }

            return 0;
        });

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen w-full bg-[#f6f9f8] text-[#102030] font-sans antialiased pb-20">

            {/* ====================================================
                TOP CONTEXT
            ==================================================== */}

            <div className="border-b border-[#e3ebe8] bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">

                    <div className="flex items-center gap-2 text-xs">

                        <Link
                            to="/"
                            className="text-slate-400 hover:text-[#00677c] transition-colors"
                        >
                            Trang chủ
                        </Link>

                        <ChevronRightIcon className="w-3.5 h-3.5 text-slate-300" />

                        <Link
                            to="/services"
                            className="text-slate-400 hover:text-[#00677c] transition-colors"
                        >
                            Dịch vụ
                        </Link>

                        <ChevronRightIcon className="w-3.5 h-3.5 text-slate-300" />

                        <span className="font-semibold text-[#102030]">
                            Tìm điều dưỡng
                        </span>

                    </div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ====================================================
                    PAGE HEADER
                ==================================================== */}

                <section className="pt-8">

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

                        <div>

                            <p className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#00677c] mb-2">
                                CareLink
                            </p>

                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102030]">
                                Tìm người chăm sóc phù hợp
                            </h1>

                            <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                                Khám phá và lựa chọn điều dưỡng phù hợp với
                                nhu cầu chăm sóc của gia đình bạn.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={showAllCaregivers}
                            className="self-start lg:self-auto inline-flex items-center justify-center h-10 px-4 rounded-xl border border-[#d7e3df] bg-white text-[#102030] text-xs font-bold hover:border-[#a8cec5] hover:text-[#00677c] hover:bg-[#f7faf9] transition-all cursor-pointer whitespace-nowrap"
                        >
                            Xem tất cả điều dưỡng
                        </button>

                    </div>

                </section>

                {/* ====================================================
                    ACTIVE SERVICE
                ==================================================== */}

                {activeService ? (
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-[#eef7f4] border border-[#d2e9e2]">

                        <div className="flex items-center gap-3 min-w-0">

                            <div className="w-8 h-8 rounded-lg bg-[#00677c] text-white flex items-center justify-center shrink-0">
                                <CheckIcon className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">

                                <p className="text-[10px] uppercase tracking-wider font-bold text-[#167267]">
                                    Dịch vụ đang chọn
                                </p>

                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">

                                    <span className="text-sm font-bold text-[#102030]">
                                        {activeService.title}
                                    </span>

                                    {activeService.priceRange && (
                                        <span className="text-xs text-slate-500">
                                            · {activeService.priceRange}
                                        </span>
                                    )}

                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-4 pl-11 sm:pl-0">

                            <button
                                type="button"
                                onClick={showAllCaregivers}
                                className="text-xs font-bold text-[#00677c] hover:text-[#005566] transition-colors cursor-pointer"
                            >
                                Xem tất cả điều dưỡng
                            </button>

                            <Link
                                to="/services"
                                className="text-xs font-semibold text-slate-500 hover:text-[#00677c] transition-colors"
                            >
                                Đổi dịch vụ
                            </Link>

                        </div>

                    </div>
                ) : (
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[#dfe8e5]">

                        <div>
                            <p className="text-xs font-bold text-[#102030]">
                                Tất cả điều dưỡng
                            </p>

                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Bạn đang xem toàn bộ danh sách điều dưỡng.
                            </p>
                        </div>

                        <Link
                            to="/services"
                            className="text-xs font-bold text-[#00677c] hover:text-[#005566] transition-colors"
                        >
                            Chọn theo dịch vụ
                        </Link>

                    </div>
                )}

                {/* ====================================================
                    SEARCH
                ==================================================== */}

                <section className="mt-7">

                    <div className="mb-4">

                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                            Tìm kiếm
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                            Tìm theo khu vực, tên hoặc chuyên môn.
                        </p>

                    </div>

                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="bg-white border border-[#dfe8e5] rounded-2xl p-3 sm:p-4 shadow-[0_10px_35px_-25px_rgba(16,32,48,0.22)]"
                    >

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

                            {/* LOCATION */}

                            <div className="md:col-span-4 relative">

                                <LocationIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    placeholder="Khu vực hoặc thành phố"
                                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#f7faf9] border border-transparent text-sm text-[#102030] placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-[#a8d4ca] focus:ring-4 focus:ring-[#00677c]/5"
                                />

                            </div>

                            {/* KEYWORD */}

                            <div className="md:col-span-5 relative">

                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) =>
                                        setKeyword(e.target.value)
                                    }
                                    placeholder="Tìm theo tên hoặc chuyên môn..."
                                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#f7faf9] border border-transparent text-sm text-[#102030] placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-[#a8d4ca] focus:ring-4 focus:ring-[#00677c]/5"
                                />

                            </div>

                            {/* SEARCH BUTTON */}

                            <div className="md:col-span-3">

                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-[#00677c] hover:bg-[#00596b] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_8px_18px_-10px_rgba(0,103,124,0.7)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                                >
                                    <SearchIcon className="w-4 h-4" />
                                    Tìm kiếm
                                </button>

                            </div>

                        </div>

                    </form>

                </section>

                {/* ====================================================
                    MAIN CONTENT
                ==================================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-7 lg:gap-9 mt-8 items-start">

                    {/* ==================================================
                        FILTER SIDEBAR
                    ================================================== */}

                    <aside className="lg:sticky lg:top-5">

                        <div className="bg-white border border-[#dfe8e5] rounded-2xl overflow-hidden shadow-[0_10px_35px_-28px_rgba(16,32,48,0.3)]">

                            <div className="px-5 py-4 border-b border-[#edf1ef] flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-bold text-[#102030]">
                                        Bộ lọc
                                    </p>

                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Tùy chỉnh kết quả
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="text-[11px] font-bold text-[#00677c] hover:text-[#005566] cursor-pointer"
                                >
                                    Đặt lại
                                </button>

                            </div>

                            <div className="p-5 space-y-6">

                                {/* QUALIFICATION */}

                                <div>

                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-3">
                                        Trình độ
                                    </h3>

                                    <div className="space-y-2.5">

                                        {qualifications.map((q) => (
                                            <label
                                                key={q}
                                                className="flex items-start gap-2.5 cursor-pointer group"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={selectedQualifications.includes(q)}
                                                    onChange={() =>
                                                        toggleItem(
                                                            q,
                                                            selectedQualifications,
                                                            setSelectedQualifications
                                                        )
                                                    }
                                                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#00677c] focus:ring-[#00677c]/20"
                                                />

                                                <span className="text-xs leading-5 text-slate-600 group-hover:text-[#102030] transition-colors">
                                                    {q}
                                                </span>

                                            </label>
                                        ))}

                                    </div>

                                </div>

                                {/* SPECIALTY */}

                                <div className="pt-5 border-t border-[#edf1ef]">

                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-3">
                                        Chuyên môn
                                    </h3>

                                    <div className="space-y-2.5">

                                        {specialties.map((specialty) => (
                                            <label
                                                key={specialty}
                                                className="flex items-start gap-2.5 cursor-pointer group"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={selectedSpecialties.includes(specialty)}
                                                    onChange={() =>
                                                        toggleItem(
                                                            specialty,
                                                            selectedSpecialties,
                                                            setSelectedSpecialties
                                                        )
                                                    }
                                                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#00677c] focus:ring-[#00677c]/20"
                                                />

                                                <span className="text-xs leading-5 text-slate-600 group-hover:text-[#102030] transition-colors">
                                                    {specialty}
                                                </span>

                                            </label>
                                        ))}

                                    </div>

                                </div>

                                {/* PRICE */}

                                <div className="pt-5 border-t border-[#edf1ef]">

                                    <div className="flex items-center justify-between mb-3">

                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                                            Ngân sách / giờ
                                        </h3>

                                        <span className="text-xs font-bold text-[#00677c]">
                                            {priceRange.toLocaleString("vi-VN")}đ
                                        </span>

                                    </div>

                                    <input
                                        type="range"
                                        min="50000"
                                        max="500000"
                                        step="25000"
                                        value={priceRange}
                                        onChange={(e) =>
                                            setPriceRange(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full accent-[#00677c] cursor-pointer"
                                    />

                                    <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                                        <span>50.000đ</span>
                                        <span>500.000đ</span>
                                    </div>

                                </div>

                                {/* AVAILABILITY */}

                                <div className="pt-5 border-t border-[#edf1ef]">

                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-3">
                                        Thời gian
                                    </h3>

                                    <div className="grid grid-cols-2 gap-2">

                                        {availabilityOptions.map((option) => {

                                            const isSelected =
                                                selectedAvailability.includes(
                                                    option
                                                );

                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleItem(
                                                            option,
                                                            selectedAvailability,
                                                            setSelectedAvailability
                                                        )
                                                    }
                                                    className={`px-2.5 py-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${isSelected
                                                            ? "bg-[#00677c] border-[#00677c] text-white"
                                                            : "bg-[#f8faf9] border-[#e1e9e6] text-slate-600 hover:border-[#a8d4ca] hover:text-[#00677c]"
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* TRUST NOTE */}

                        <div className="mt-4 px-1">

                            <div className="flex items-start gap-2.5">

                                <div className="w-7 h-7 rounded-lg bg-[#e8f5f1] text-[#00677c] flex items-center justify-center shrink-0">
                                    <CheckIcon className="w-3.5 h-3.5" />
                                </div>

                                <div>

                                    <p className="text-[11px] font-bold text-[#102030]">
                                        Hồ sơ minh bạch
                                    </p>

                                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                                        Xem thông tin chuyên môn, kinh nghiệm và đánh giá trước khi đặt lịch.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </aside>

                    {/* ==================================================
                        RESULTS
                    ================================================== */}

                    <main className="min-w-0">

                        {/* RESULTS HEADER */}

                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">

                            <div>

                                <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-slate-400">
                                    Kết quả
                                </p>

                                <div className="flex items-baseline gap-2 mt-1">

                                    <h2 className="text-xl font-bold text-[#102030]">
                                        Điều dưỡng
                                    </h2>

                                    <span className="text-sm font-semibold text-[#00677c]">
                                        {filteredCaregivers.length} hồ sơ
                                    </span>

                                </div>

                                {selectedSpecialties.length > 0 && (
                                    <p className="text-xs text-slate-500 mt-1">

                                        Đang tìm theo chuyên môn{" "}

                                        <strong className="text-[#00677c]">
                                            {selectedSpecialties.join(", ")}
                                        </strong>

                                    </p>
                                )}

                            </div>

                            {/* SORT */}

                            <div className="flex items-center gap-2">

                                <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                                    Sắp xếp
                                </span>

                                <select
                                    value={sort}
                                    onChange={(e) =>
                                        setSort(e.target.value)
                                    }
                                    className="h-9 bg-white border border-[#dfe8e5] text-xs font-semibold text-[#102030] px-3 rounded-lg outline-none focus:border-[#8fcabd] cursor-pointer"
                                >
                                    <option>
                                        Đánh giá cao nhất
                                    </option>

                                    <option>
                                        Kinh nghiệm nhiều nhất
                                    </option>

                                    <option>
                                        Giá thấp nhất
                                    </option>

                                    <option>
                                        Giá cao nhất
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* ACTIVE FILTERS */}

                        {(selectedQualifications.length > 0 ||
                            selectedSpecialties.length > 0 ||
                            selectedAvailability.length > 0 ||
                            priceRange < 275000) && (
                                <div className="flex flex-wrap items-center gap-2 mb-5">

                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                                        Đang lọc:
                                    </span>

                                    {selectedQualifications.map((item) => (
                                        <span
                                            key={item}
                                            className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#edf6f3] text-[#126a63] text-[10px] font-semibold"
                                        >
                                            {item}
                                        </span>
                                    ))}

                                    {selectedSpecialties.map((item) => (
                                        <span
                                            key={item}
                                            className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#edf6f3] text-[#126a63] text-[10px] font-semibold"
                                        >
                                            {item}
                                        </span>
                                    ))}

                                    {selectedAvailability.map((item) => (
                                        <span
                                            key={item}
                                            className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f1f5f4] text-slate-600 text-[10px] font-semibold"
                                        >
                                            {item}
                                        </span>
                                    ))}

                                </div>
                            )}

                        {/* ==================================================
                            CAREGIVER GRID
                        ================================================== */}

                        {filteredCaregivers.length > 0 ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                                {filteredCaregivers.map((caregiver) => (
                                    <CaregiverCard
                                        key={caregiver.id}
                                        caregiver={caregiver}
                                        onProfile={handleProfile}
                                        onBook={handleProfile}
                                    />
                                ))}

                            </div>
                        ) : (
                            <div className="bg-white border border-[#dfe8e5] rounded-2xl p-12 flex flex-col items-center justify-center text-center">

                                <div className="w-14 h-14 rounded-2xl bg-[#eef3f2] text-slate-400 flex items-center justify-center mb-4">
                                    <SearchIcon className="w-6 h-6" />
                                </div>

                                <h3 className="text-base font-bold text-[#102030]">
                                    Chưa tìm thấy hồ sơ phù hợp
                                </h3>

                                <p className="text-xs text-slate-500 max-w-sm leading-relaxed mt-2">
                                    Thử mở rộng khu vực tìm kiếm, tăng ngân
                                    sách hoặc bỏ bớt một vài tiêu chí lọc.
                                </p>

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="mt-5 px-5 py-2.5 rounded-xl bg-[#00677c] text-white text-xs font-bold hover:bg-[#005566] transition-colors cursor-pointer"
                                >
                                    Đặt lại bộ lọc
                                </button>

                            </div>
                        )}

                    </main>

                </div>

            </div>
        </div>
    );
}