import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CaregiverCard from "../components/CaregiverCard";
import CaregiverFilterSidebar from "../components/CaregiverFilterSidebar";
import familyApi from "../../../api/familyApi";
import { HeartHandshake, ShieldAlert, LogIn, UserPlus, X, MessageSquare, CheckCircle2 } from "lucide-react";

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
    "Điều dưỡng chính quy",
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
// ICONS
// ============================================================

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
        } catch (err) {
            console.error("[CareLink Search Error] Chi tiết lỗi tìm kiếm điều dưỡng:", err);
            const rawDetail = err.response?.data?.detail || err.response?.data?.message || "";
            let msg = "Không thể kết nối đến máy chủ để tải danh sách điều dưỡng. Vui lòng thử lại sau ít phút.";
            if (rawDetail && !rawDetail.toLowerCase().includes("unexpected error") && !rawDetail.toLowerCase().includes("exception")) {
                msg = rawDetail;
            } else if (err.response?.status === 500) {
                msg = "Máy chủ đang gián đoạn kết nối hoặc đang được bảo trì. Vui lòng thử tải lại sau ít phút.";
            }
            setApiError(msg);
            setNurses([]);
            setTotalCount(0);
            setTotalPages(0);
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

    const [authModal, setAuthModal] = useState({ open: false, type: "unauthenticated", caregiver: null });

    const handleProfile = (caregiver) => {
        navigate("/caregivers/profile", {
            state: {
                caregiver,
                selectedService: activeService,
            },
        });
    };

    const handleBook = (caregiver) => {
        const token = localStorage.getItem("carelink_token");
        const rawUser = localStorage.getItem("carelink_user");
        let user = null;
        try {
            user = rawUser ? JSON.parse(rawUser) : null;
        } catch {}

        // 1. Kiểm tra nếu khách vãng lai chưa đăng nhập
        if (!token) {
            setAuthModal({ open: true, type: "unauthenticated", caregiver });
            return;
        }

        // 2. Kiểm tra nếu người dùng đang đăng nhập bằng tài khoản Điều dưỡng
        const role = user?.role?.toLowerCase();
        const roleIdNum = Number(user?.roleId);
        if (role === "nurse" || role === "caregiver" || roleIdNum === 3) {
            setAuthModal({ open: true, type: "nurse_role", caregiver });
            return;
        }

        // 3. Đã có tài khoản Gia đình -> chuyển sang trang hồ sơ điều dưỡng để đặt lịch
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

                {/* BANNER TẤT CẢ ĐIỀU DƯỠNG */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[#dfe8e5]">
                    <div>
                        <p className="text-xs font-bold text-[#102030]">
                            Tất cả điều dưỡng CareLink
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Danh sách chuyên viên y tế và điều dưỡng đã được xác thực hồ sơ chuyên môn.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-emerald-700">
                            Hồ sơ đã được kiểm định
                        </span>
                    </div>
                </div>

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
                        ) : apiError ? (
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
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                                    {filteredCaregivers.map((caregiver) => (
                                        <CaregiverCard
                                            key={caregiver.id}
                                            caregiver={caregiver}
                                            onProfile={handleProfile}
                                            onBook={handleBook}
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

            {/* Modal cảnh báo yêu cầu tài khoản Gia đình */}
            {authModal.open && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-[fadeIn_150ms_ease-out]"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setAuthModal((prev) => ({ ...prev, open: false }));
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative w-full max-w-[580px] overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-2xl ring-1 ring-black/5"
                    >
                        {/* Header Modal */}
                        <div className="relative border-b border-slate-100 bg-gradient-to-br from-teal-50/70 via-white to-slate-50/50 p-6 pb-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                                            authModal.type === "unauthenticated"
                                                ? "border-teal-200 bg-white text-[#00677C] shadow-sm"
                                                : "border-amber-200 bg-white text-amber-600 shadow-sm"
                                        }`}
                                    >
                                        {authModal.type === "unauthenticated" ? (
                                            <HeartHandshake className="h-6 w-6" />
                                        ) : (
                                            <ShieldAlert className="h-6 w-6" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-100/70 text-[#00677C] border border-teal-200/80 mb-1.5">
                                            Dành cho Gia đình & Khách hàng
                                        </div>
                                        <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                                            {authModal.type === "unauthenticated"
                                                ? "Đăng nhập để đặt lịch chăm sóc"
                                                : "Tài khoản hiện tại là Điều dưỡng"}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            CareLink Medical Care • Chăm sóc an tâm cho cha mẹ và người thân
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAuthModal((prev) => ({ ...prev, open: false }))}
                                    className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 space-y-4">
                            {authModal.type === "unauthenticated" ? (
                                <>
                                    <p className="text-sm leading-relaxed text-slate-700">
                                        Để liên hệ trao đổi trực tiếp, gửi đề xuất ca và đặt lịch chăm sóc với người chăm sóc, quý khách vui lòng đăng nhập hoặc tạo tài khoản <strong>Gia đình</strong>.
                                    </p>

                                    {/* Giá trị nổi bật */}
                                    <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                                        <div className="flex items-start gap-2.5 text-xs text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00677C] mt-0.5" />
                                            <span>100% Điều dưỡng đã xác thực lý lịch, bằng cấp & chứng chỉ chuyên môn</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-xs text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00677C] mt-0.5" />
                                            <span>Theo dõi chỉ số sinh hiệu (HA, Tim, SpO2) và bệnh án sau từng ca</span>
                                        </div>
                                        <div className="flex items-start gap-2.5 text-xs text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00677C] mt-0.5" />
                                            <span>Nghiệm thu ca trực 2 chiều và chính sách bảo vệ thanh toán an toàn</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 rounded-xl border border-teal-300 bg-teal-100/90 px-4 py-3 text-xs text-teal-950 font-semibold shadow-2xs">
                                        <MessageSquare className="h-4 w-4 shrink-0 text-[#00677C]" />
                                        <span>Tạo tài khoản nhanh chóng chỉ mất 30 giây để tìm người chăm sóc phù hợp.</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm leading-relaxed text-slate-600">
                                        Bạn đang đăng nhập bằng tài khoản <strong>Điều dưỡng</strong>. Để đặt lịch chăm sóc cho người thân, vui lòng chuyển sang hoặc tạo tài khoản <strong>Gia đình</strong>.
                                    </p>
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 leading-relaxed">
                                        Bạn có thể chuyển về trang tổng quan dành cho Điều dưỡng hoặc đăng xuất để đăng nhập tài khoản Khách hàng.
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setAuthModal((prev) => ({ ...prev, open: false }))}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                            >
                                {authModal.type === "unauthenticated" ? "Để sau" : "Đóng"}
                            </button>

                            {authModal.type === "unauthenticated" ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#00677c] transition"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Đăng nhập
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            navigate("/register?role=family");
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00677c] text-xs font-bold text-white shadow-sm hover:bg-[#065363] transition"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Đăng ký Gia đình
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            navigate("/caregiver/dashboard");
                                        }}
                                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                    >
                                        Về trang Điều dưỡng
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAuthModal((prev) => ({ ...prev, open: false }));
                                            localStorage.removeItem("carelink_token");
                                            localStorage.removeItem("carelink_user");
                                            navigate("/login");
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
                                    >
                                        Đăng xuất tài khoản
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}