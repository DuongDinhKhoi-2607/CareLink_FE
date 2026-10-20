import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CaregiverCard from "../components/CaregiverCard";
import CaregiverFilterSidebar from "../components/CaregiverFilterSidebar";
import familyApi from "../../../api/familyApi";

// Helper chuyển đổi dữ liệu từ Backend API (GET /api/v1/nurses/search) sang cấu trúc Card
const normalizeNurse = (item) => ({
    id: item.nurseId || item.id,
    nurseId: item.nurseId || item.id,
    name: item.fullName || item.name || "Điều dưỡng CareLink",
    fullName: item.fullName || item.name || "Điều dưỡng CareLink",
    role: item.educationLevel || item.role || "Điều dưỡng chuyên nghiệp",
    educationLevel: item.educationLevel || item.role || "Điều dưỡng chuyên nghiệp",
    rate: item.rate || "Từ 200.000đ/ca",
    rateNumber: item.rateNumber || 200000,
    experience: item.experienceYears ? `${item.experienceYears} năm KN` : (item.experience || "Nhiều năm KN"),
    experienceYears: item.experienceYears || 1,
    specialty: item.specialty || (item.educationLevel || "Chăm sóc toàn diện"),
    qualifications: item.educationLevel || item.qualifications || "Điều dưỡng",
    availability: item.availability || ["Ngày thường", "Ca ngày"],
    location: item.workDistrict || item.location || "TP. Hồ Chí Minh",
    city: item.city || "Thành phố Hồ Chí Minh",
    quote: item.bio || item.quote || "Điều dưỡng được xác thực chuyên môn, tận tâm hỗ trợ gia đình.",
    bio: item.bio || item.quote || "Điều dưỡng được xác thực chuyên môn, tận tâm hỗ trợ gia đình.",
    rating: item.averageRating != null ? Number(item.averageRating).toFixed(1) : (item.rating || 5.0),
    averageRating: item.averageRating != null ? Number(item.averageRating) : (item.rating || 5.0),
    totalReviews: item.totalReviews || 0,
    distanceKm: item.distanceKm,
    serviceRadiusKm: item.serviceRadiusKm,
    image: item.avatarUrl || item.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    avatarUrl: item.avatarUrl || item.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    rawBackendData: item,
});

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
        location: "Bình Thạnh, TP. HCM",
        city: "Thành phố Hồ Chí Minh",
        quote: "Sinh viên điều dưỡng ĐH Y Dược TP.HCM tận tâm, chu đáo trong việc hỗ trợ vận động, ăn uống và theo dõi sức khỏe người cao tuổi.",
        rating: 4.9,
        image:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
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
    // STATE: Bộ lọc UI & API Parameters
    // ========================================================
    const [location, setLocation] = useState("");
    const [keyword, setKeyword] = useState("");
    const [minRating, setMinRating] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [selectedQualifications, setSelectedQualifications] = useState([]);
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
    // STATE: Dữ liệu thực từ Backend API
    // ========================================================
    const [nurses, setNurses] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [isUsingFallback, setIsUsingFallback] = useState(false);
    const [searchTrigger, setSearchTrigger] = useState(0);

    // 1. Tải danh mục dịch vụ thực từ Backend (GET /api/v1/services)
    useEffect(() => {
        let isMounted = true;
        familyApi
            .getServices()
            .then((data) => {
                if (isMounted && Array.isArray(data)) {
                    setServicesList(data);
                }
            })
            .catch((err) => {
                console.warn("[CareLink] Tải danh mục dịch vụ thất bại:", err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Gọi API tìm kiếm điều dưỡng từ Backend (GET /api/v1/nurses/search)
    const fetchNurses = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);

        const params = {
            PageNumber: pageNumber,
            PageSize: pageSize,
        };

        const trimmedLocation = location.trim();
        if (trimmedLocation) {
            params.District = trimmedLocation;
        }

        if (activeService?.id) {
            params.ServiceId = activeService.id;
        }

        if (minRating != null) {
            params.MinRating = minRating;
        }

        try {
            const res = await familyApi.searchNurses(params);
            const items = res?.items || (Array.isArray(res) ? res : []);
            const normalized = items.map(normalizeNurse);
            setNurses(normalized);
            setTotalCount(res?.totalCount ?? items.length);
            setTotalPages(
                res?.totalPages ??
                    (items.length > 0 ? Math.ceil((res?.totalCount || items.length) / pageSize) : 0)
            );
            setIsUsingFallback(false);
        } catch (err) {
            console.warn("[CareLink] Nurse search API error:", err);
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Không thể kết nối đến máy chủ để tải danh sách điều dưỡng.";
            setApiError(msg);

            // Safety fallback: Khi mất kết nối mạng để không làm sập giao diện demo
            if (err.code === "ERR_NETWORK" || !err.response) {
                setIsUsingFallback(true);
                setNurses(caregiversData.map(normalizeNurse));
                setTotalCount(caregiversData.length);
                setTotalPages(1);
            } else {
                setNurses([]);
                setTotalCount(0);
                setTotalPages(0);
            }
        } finally {
            setIsLoading(false);
        }
    }, [pageNumber, pageSize, location, activeService, minRating]);

    useEffect(() => {
        fetchNurses();
    }, [fetchNurses, searchTrigger]);

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

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setPageNumber(1);
        setSearchTrigger((prev) => prev + 1);
    };

    // Reset bộ lọc
    const resetFilters = () => {
        setLocation("");
        setKeyword("");
        setMinRating(null);
        setSelectedQualifications([]);
        setSelectedSpecialties(
            activeService?.specialtyMatch
                ? [activeService.specialtyMatch]
                : []
        );
        setSelectedAvailability([]);
        setPriceRange(275000);
        setPageNumber(1);
        setSearchTrigger((prev) => prev + 1);
    };

    // Xem toàn bộ điều dưỡng
    const showAllCaregivers = () => {
        setActiveService(null);
        setSelectedSpecialties([]);
        setPageNumber(1);
        navigate("/caregivers", {
            replace: true,
            state: {},
        });
        setSearchTrigger((prev) => prev + 1);
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
    // FILTER & SORT DỮ LIỆU
    // ========================================================
    const filteredCaregivers = nurses
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

                const matchName = (caregiver.name || "").toLowerCase().includes(kw);
                const matchSpecialty = (caregiver.specialty || "").toLowerCase().includes(kw);
                const matchRole = (caregiver.role || "").toLowerCase().includes(kw);
                const matchBio = (caregiver.bio || "").toLowerCase().includes(kw);
                const matchDistrict = (caregiver.workDistrict || "").toLowerCase().includes(kw);

                if (!matchName && !matchSpecialty && !matchRole && !matchBio && !matchDistrict) {
                    return false;
                }
            }

            return true;
        })
        .sort((a, b) => {
            if (sort === "Đánh giá cao nhất") {
                return Number(b.rating || 0) - Number(a.rating || 0);
            }

            if (sort === "Kinh nghiệm nhiều nhất") {
                return (b.experienceYears || 0) - (a.experienceYears || 0);
            }

            if (sort === "Giá thấp nhất") {
                return (a.rateNumber || 0) - (b.rateNumber || 0);
            }

            if (sort === "Giá cao nhất") {
                return (b.rateNumber || 0) - (a.rateNumber || 0);
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
                        onSubmit={handleSearchSubmit}
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
                                    placeholder="Khu vực hoặc thành phố (VD: Quận 1, Bình Thạnh)"
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

                    <CaregiverFilterSidebar
                        qualifications={qualifications}
                        specialties={specialties}
                        availabilityOptions={availabilityOptions}
                        selectedQualifications={selectedQualifications}
                        setSelectedQualifications={setSelectedQualifications}
                        selectedSpecialties={selectedSpecialties}
                        setSelectedSpecialties={setSelectedSpecialties}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedAvailability={selectedAvailability}
                        setSelectedAvailability={setSelectedAvailability}
                        minRating={minRating}
                        setMinRating={(r) => {
                            setMinRating(r);
                            setPageNumber(1);
                        }}
                        servicesList={servicesList}
                        activeService={activeService}
                        setActiveService={(s) => {
                            setActiveService(s);
                            setPageNumber(1);
                        }}
                        resetFilters={resetFilters}
                        toggleItem={toggleItem}
                    />


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
                                        {isLoading ? "Đang tải..." : `${filteredCaregivers.length} hồ sơ`}
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
                            minRating != null ||
                            activeService ||
                            priceRange < 275000) && (
                                <div className="flex flex-wrap items-center gap-2 mb-5">

                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                                        Đang lọc:
                                    </span>

                                    {activeService && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00677c]/10 text-[#00677c] text-[10px] font-bold">
                                            Dịch vụ: {activeService.name || activeService.title}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveService(null);
                                                    setPageNumber(1);
                                                }}
                                                className="ml-1 text-slate-400 hover:text-[#00677c]"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}

                                    {minRating && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                            {minRating}★ trở lên
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMinRating(null);
                                                    setPageNumber(1);
                                                }}
                                                className="ml-1 text-slate-400 hover:text-amber-700"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}

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
                            CAREGIVER GRID / LOADING / ERROR / EMPTY STATES
                        ================================================== */}

                        {isLoading ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                                {[1, 2, 3, 4].map((n) => (
                                    <div
                                        key={n}
                                        className="bg-white rounded-2xl border border-[#dfe8e5] p-5 animate-pulse flex flex-col gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-slate-200 rounded w-2/3" />
                                                <div className="h-3 bg-slate-100 rounded w-1/3" />
                                            </div>
                                        </div>
                                        <div className="h-10 bg-slate-100 rounded-xl" />
                                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                                            <div className="h-9 bg-slate-200 rounded-xl flex-1" />
                                            <div className="h-9 bg-slate-200 rounded-xl flex-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : apiError && !isUsingFallback ? (
                            <div className="bg-white border border-rose-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-rose-800">Không thể kết nối đến máy chủ tìm kiếm</h3>
                                <p className="text-xs text-rose-600 max-w-sm mt-1">{apiError}</p>
                                <button
                                    type="button"
                                    onClick={fetchNurses}
                                    className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer"
                                >
                                    Thử tải lại
                                </button>
                            </div>
                        ) : filteredCaregivers.length > 0 ? (
                            <>
                                {isUsingFallback && (
                                    <div className="mb-4 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                                        <span>Đang kết nối chế độ dự phòng do máy chủ tạm thời không khả dụng.</span>
                                    </div>
                                )}
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

                                {totalPages > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            disabled={pageNumber <= 1}
                                            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                                            className="px-3.5 py-2 rounded-xl border border-[#dfe8e5] bg-white text-xs font-semibold text-[#102030] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f6f9f8] transition-colors cursor-pointer"
                                        >
                                            Trang trước
                                        </button>
                                        <span className="text-xs text-slate-500 font-medium px-2">
                                            Trang {pageNumber} / {totalPages} ({totalCount} kết quả)
                                        </span>
                                        <button
                                            type="button"
                                            disabled={pageNumber >= totalPages}
                                            onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
                                            className="px-3.5 py-2 rounded-xl border border-[#dfe8e5] bg-white text-xs font-semibold text-[#102030] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f6f9f8] transition-colors cursor-pointer"
                                        >
                                            Trang sau
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white border border-[#dfe8e5] rounded-2xl p-12 flex flex-col items-center justify-center text-center">

                                <div className="w-14 h-14 rounded-2xl bg-[#eef3f2] text-slate-400 flex items-center justify-center mb-4">
                                    <SearchIcon className="w-6 h-6" />
                                </div>

                                <h3 className="text-base font-bold text-[#102030]">
                                    Chưa tìm thấy điều dưỡng phù hợp
                                </h3>

                                <p className="text-xs text-slate-500 max-w-sm leading-relaxed mt-2">
                                    Không có điều dưỡng nào khớp với tiêu chí tìm kiếm hiện tại. Thử đổi khu vực hoặc chọn bộ lọc khác.
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