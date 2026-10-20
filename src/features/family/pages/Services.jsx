import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ServiceSelectionCard from "../components/ServiceSelectionCard";
import ServiceDetailModal from "../components/ServiceDetailModal";
import familyApi from "../../../api/familyApi";
import {
    HeartPulse,
    Activity,
    ShieldCheck,
    Clock,
    RefreshCw,
    Sparkles,
    CheckCircle2,
    BriefcaseMedical,
    Footprints,
    HeartHandshake,
    Stethoscope,
    Layers,
} from "lucide-react";

// Dữ liệu dự phòng chuẩn y tế cao cấp khi API backend chưa khởi động
const DEFAULT_SERVICES = [
    {
        id: "s1",
        title: "Hỗ trợ sinh hoạt hàng ngày",
        category: "Chăm sóc Sinh hoạt & Hỗ trợ Đời sống",
        description: "Chăm sóc toàn diện các hoạt động thể chất và dinh dưỡng cho người cao tuổi hoặc người bệnh cần hỗ trợ vận động.",
        badgeText: "Điều dưỡng & SV Y khoa",
        badgeType: "normal",
        priceRange: "65.000đ – 85.000đ / giờ",
        basePrice: 75000,
        recommendedDuration: "Ca 4h – 8h hoặc cả ngày",
        specialtyMatch: "Chăm sóc người già",
        features: [
            "Hỗ trợ ăn uống theo chế độ dinh dưỡng, vệ sinh cá nhân an toàn",
            "Dìu dắt vận động nhẹ nhàng, phòng ngừa nguy cơ té ngã",
            "Nhắc nhở uống thuốc đúng giờ và theo dõi tình trạng thể chất cơ bản"
        ],
    },
    {
        id: "s2",
        title: "Bầu bạn & Chăm sóc tinh thần",
        category: "Chăm sóc Sinh hoạt & Hỗ trợ Đời sống",
        description: "Liệu pháp đồng hành tâm lý, giúp người cao tuổi xoa dịu cảm giác cô đơn, kích thích trí nhớ và duy trì niềm vui sống.",
        badgeText: "Điều dưỡng & SV Y khoa",
        badgeType: "normal",
        priceRange: "60.000đ – 80.000đ / giờ",
        basePrice: 70000,
        recommendedDuration: "Ca 2h – 4h mỗi ngày",
        specialtyMatch: "Chăm sóc người già",
        features: [
            "Đọc sách báo, tâm sự sẻ chia và cùng nghe nhạc thư giãn",
            "Đưa đón đi dạo, hướng dẫn các bài tập rèn luyện trí nhớ nhẹ nhàng",
            "Gắn kết tình cảm, hỗ trợ gọi video cập nhật với con cháu"
        ],
    },
    {
        id: "s3",
        title: "Chăm sóc sau phẫu thuật & Vết thương",
        category: "Chăm sóc Y tế Lâm sàng Chuyên sâu",
        description: "Quy trình chăm sóc ngoại khoa chuẩn y tế, kiểm soát nhiễm khuẩn và đẩy nhanh tốc độ liền sẹo cho người sau xuất viện.",
        badgeText: "Chỉ dành cho Điều dưỡng RN",
        badgeType: "special",
        priceRange: "180.000đ – 250.000đ / giờ",
        basePrice: 200000,
        recommendedDuration: "Theo ca thực hiện hoặc lịch hẹn định kỳ",
        specialtyMatch: "Chăm sóc sau phẫu thuật",
        features: [
            "Rửa và thay băng vết mổ vô khuẩn tuyệt đối theo chuẩn bệnh viện",
            "Theo dõi dịch dẫn lưu, phát hiện sớm nguy cơ nhiễm trùng",
            "Hỗ trợ tiêm truyền và hướng dẫn các bài tập phục hồi chức năng"
        ],
    },
    {
        id: "s4",
        title: "Theo dõi y tế & Bệnh mãn tính",
        category: "Chăm sóc Y tế Lâm sàng Chuyên sâu",
        description: "Giám sát chặt chẽ các chỉ số sinh tồn và quản lý việc tuân thủ phác đồ điều trị cho bệnh nhân tiểu đường, tim mạch, huyết áp.",
        badgeText: "Chỉ dành cho Điều dưỡng RN",
        badgeType: "special",
        priceRange: "150.000đ – 200.000đ / giờ",
        basePrice: 180000,
        recommendedDuration: "Ca theo dõi định kỳ hoặc hằng ngày",
        specialtyMatch: "Chăm sóc vết thương",
        features: [
            "Đo và lập biểu đồ huyết áp, đường huyết mao mạch, SpO2, thân nhiệt",
            "Quản lý lịch dùng thuốc, cảnh báo tương tác thuốc bất lợi",
            "Lập sổ nhật ký sức khỏe điện tử gửi bác sĩ và người thân theo dõi"
        ],
    }
];

export default function Services() {
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState("s1");

    // Modal chi tiết dịch vụ (API 81: GET /api/v1/services/{id})
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [viewingServiceId, setViewingServiceId] = useState(null);

    const getIconForService = (titleOrCategory = "") => {
        const str = titleOrCategory.toLowerCase();
        if (str.includes("vết thương") || str.includes("phẫu thuật")) {
            return <Stethoscope className="w-6 h-6" />;
        }
        if (str.includes("sinh hoạt") || str.includes("đồng hành")) {
            return <Footprints className="w-6 h-6" />;
        }
        if (str.includes("tinh thần") || str.includes("bầu bạn")) {
            return <HeartHandshake className="w-6 h-6" />;
        }
        if (str.includes("chỉ số") || str.includes("theo dõi") || str.includes("mãn tính")) {
            return <Activity className="w-6 h-6" />;
        }
        return <BriefcaseMedical className="w-6 h-6" />;
    };

    // Chuẩn hóa dữ liệu dịch vụ từ API hoặc fallback
    const normalizeService = (svc) => {
        const id = svc.id || svc.serviceId;
        const title = svc.title || svc.serviceName || svc.name || "Gói chăm sóc y tế";
        const category = svc.category || svc.serviceCategory || "Chăm sóc tổng quát";
        const description = svc.description || "Dịch vụ chăm sóc người bệnh và người cao tuổi chuẩn y tế tại nhà.";
        const isSpecial =
            category.toLowerCase().includes("chuyên sâu") ||
            category.toLowerCase().includes("lâm sàng") ||
            category.toLowerCase().includes("y tế") ||
            title.toLowerCase().includes("phẫu thuật") ||
            title.toLowerCase().includes("vết thương");

        const badgeText =
            svc.badgeText || (isSpecial ? "Chỉ dành cho Điều dưỡng RN" : "Điều dưỡng & SV Y khoa");
        const badgeType = isSpecial ? "special" : "normal";

        const priceRange =
            svc.priceRange ||
            (svc.basePrice
                ? `${Number(svc.basePrice).toLocaleString("vi-VN")} ₫ / ca`
                : "65.000đ – 150.000đ / giờ");

        const recommendedDuration =
            svc.recommendedDuration ||
            (svc.durationMinutes ? `${svc.durationMinutes} phút / ca` : svc.duration || "Theo ca yêu cầu");

        const features = Array.isArray(svc.features) && svc.features.length > 0
            ? svc.features
            : Array.isArray(svc.checklist) && svc.checklist.length > 0
            ? svc.checklist
            : [
                  "Thực hiện theo đúng phác đồ và quy trình chuyên môn",
                  "Kiểm tra chỉ số sinh tồn và ghi nhật ký y tế sau ca",
                  "Phối hợp thường xuyên cùng người thân gia đình",
              ];

        return {
            ...svc,
            id,
            title,
            category,
            description,
            badgeText,
            badgeType,
            priceRange,
            recommendedDuration,
            specialtyMatch: title,
            features,
            icon: getIconForService(title + " " + category),
        };
    };

    const fetchServices = async (isManual = false) => {
        if (isManual) setRefreshing(true);
        else setLoading(true);

        try {
            // API 80: GET /api/v1/services
            const res = await familyApi.getServices();
            const rawList = Array.isArray(res)
                ? res
                : Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res?.items)
                ? res.items
                : [];

            if (rawList && rawList.length > 0) {
                const normalized = rawList.map(normalizeService);
                setServices(normalized);
                if (!selectedServiceId || !normalized.some((s) => s.id === selectedServiceId)) {
                    setSelectedServiceId(normalized[0]?.id || "s1");
                }
            } else {
                setServices(DEFAULT_SERVICES.map(normalizeService));
            }
        } catch (err) {
            console.warn("[CareLink] Tải danh mục dịch vụ từ API thất bại, chuyển fallback:", err);
            setServices(DEFAULT_SERVICES.map(normalizeService));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Nhóm dịch vụ thành 2 phân nhóm để hiển thị rõ ràng, chuyên nghiệp
    const basicServices = services.filter((s) => s.badgeType !== "special");
    const advancedServices = services.filter((s) => s.badgeType === "special");

    // Nếu không phân tách được, gom nhóm theo category
    const displayGroups =
        advancedServices.length > 0
            ? [
                  {
                      name: "Chăm sóc Sinh hoạt & Hỗ trợ Đời sống",
                      tag: "Phân nhóm 01",
                      description: "Phù hợp cho người cao tuổi cần hỗ trợ các hoạt động thường ngày và nâng đỡ tinh thần an vui.",
                      color: "teal",
                      items: basicServices,
                  },
                  {
                      name: "Chăm sóc Y tế Lâm sàng Chuyên sâu",
                      tag: "Phân nhóm 02",
                      description: "Được thực hiện trực tiếp bởi Cử nhân Điều dưỡng có chứng chỉ hành nghề (RN) theo y lệnh y khoa.",
                      color: "sky",
                      items: advancedServices,
                  },
              ]
            : [
                  {
                      name: "Danh mục gói dịch vụ CareLink",
                      tag: "Tất cả dịch vụ",
                      description: "Các gói chăm sóc tại nhà được kiểm duyệt chặt chẽ bởi đội ngũ chuyên gia CareLink.",
                      color: "teal",
                      items: services,
                  },
              ];

    const currentSelectedService =
        services.find((s) => s.id === selectedServiceId) ||
        DEFAULT_SERVICES.map(normalizeService).find((s) => s.id === selectedServiceId);

    const handleContinue = () => {
        if (!currentSelectedService) return;
        navigate("/caregivers", {
            state: {
                selectedService: {
                    id: currentSelectedService.id,
                    title: currentSelectedService.title,
                    priceRange: currentSelectedService.priceRange,
                    badgeText: currentSelectedService.badgeText,
                    specialtyMatch: currentSelectedService.specialtyMatch,
                },
            },
        });
    };

    const handleOpenDetail = (serviceId) => {
        setViewingServiceId(serviceId);
        setDetailModalOpen(true);
    };

    const handleSelectFromModal = (service) => {
        setSelectedServiceId(service.id);
    };

    return (
        <div className="w-full bg-[#f8faf9] font-sans antialiased text-[#102030] min-h-screen pb-28">
            {/* Thanh điều hướng ngữ cảnh (Breadcrumb) */}
            <div className="w-full border-b border-[#e5ebe8] bg-white/70 backdrop-blur-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="hover:text-[#00677c] transition-colors">
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <Link to="/family" className="hover:text-[#00677c] transition-colors">
                            Dành cho Gia đình
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-[#102030]">Danh mục dịch vụ</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => fetchServices(true)}
                            disabled={refreshing || loading}
                            className="inline-flex items-center gap-1.5 font-medium text-slate-500 hover:text-[#00677c] transition-colors cursor-pointer"
                            title="Làm mới danh sách dịch vụ từ hệ thống"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#00677c]" : ""}`} />
                            <span className="hidden sm:inline">Làm mới</span>
                        </button>

                        <Link
                            to="/caregivers"
                            className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-[#00677c] hover:text-[#005566] transition-colors"
                        >
                            <span>Bỏ qua & Xem toàn bộ điều dưỡng</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Khối Hero Header giới thiệu giải pháp */}
            <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5f1] border border-[#c6e7dd] text-[#126a63] text-xs font-bold tracking-wide uppercase mb-4">
                        <span className="w-2 h-2 rounded-full bg-[#187d74] animate-pulse" />
                        Giải pháp y tế tại nhà chuẩn hóa
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#102030] tracking-tight leading-[1.18] mb-4">
                        Lựa chọn dịch vụ phù hợp cho người thân
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                        Mỗi gói chăm sóc được thiết kế bài bản theo đúng nhu cầu và thể trạng. Sau khi chọn gói, bạn sẽ được kết nối trực tiếp với đội ngũ chuyên gia có chuyên môn tương ứng.
                    </p>
                </div>

                {/* 3 Cam kết cốt lõi */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-[#e2e8e5]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#dde4e1] flex items-center justify-center text-[#00677c] shadow-2xs shrink-0">
                            <ShieldCheck className="w-5 h-5 text-[#00677c]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#102030]">Xác minh 100% hồ sơ</span>
                            <span className="text-[11px] text-slate-500">Chứng chỉ y tế & lý lịch tư pháp</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#dde4e1] flex items-center justify-center text-[#00677c] shadow-2xs shrink-0">
                            <Clock className="w-5 h-5 text-[#00677c]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#102030]">Linh hoạt theo giờ & ca</span>
                            <span className="text-[11px] text-slate-500">Chủ động hẹn theo lịch gia đình</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#dde4e1] flex items-center justify-center text-[#00677c] shadow-2xs shrink-0">
                            <Sparkles className="w-5 h-5 text-[#00677c]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#102030]">Minh bạch tài chính</span>
                            <span className="text-[11px] text-slate-500">Giá niêm yết, không phụ phí ẩn</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Danh sách Dịch vụ (API 80 & 81) */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
                                    <div className="w-24 h-6 rounded-full bg-slate-200"></div>
                                </div>
                                <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                                <div className="h-4 bg-slate-100 rounded w-4/5"></div>
                                <div className="h-12 bg-slate-50 rounded-xl mt-4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    displayGroups.map((group, gIdx) => (
                        <section key={gIdx}>
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#e2e8e5]">
                                <div>
                                    <div className={`flex items-center gap-2 ${group.color === "sky" ? "text-[#0f4b7a]" : "text-[#00677c]"} font-bold text-xs uppercase tracking-wider mb-1`}>
                                        <span className={`w-2 h-2 rounded-full ${group.color === "sky" ? "bg-[#0f4b7a]" : "bg-[#00677c]"}`} />
                                        {group.tag}
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#102030]">
                                        {group.name}
                                    </h2>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                                    {group.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {group.items.map((service) => (
                                    <ServiceSelectionCard
                                        key={service.id}
                                        {...service}
                                        isSelected={selectedServiceId === service.id}
                                        onClick={() => setSelectedServiceId(service.id)}
                                        onViewDetail={() => handleOpenDetail(service.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    ))
                )}

                {/* Khối Giải đáp thắc mắc về giá & quy trình tìm kiếm */}
                <section className="bg-white rounded-2xl border border-[#dde4e1] p-6 sm:p-8 mt-12 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-[#e8f5f1] text-[#00677c] flex items-center justify-center font-bold text-sm">
                            ?
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#102030]">
                            Gia đình thường hỏi về quy trình & mức phí
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-[#f8faf9] border border-[#e2e8e5] rounded-xl p-5 hover:bg-white hover:border-[#00677c]/30 hover:shadow-2xs transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-5 h-5 rounded-full bg-[#00677c]/10 text-[#00677c] text-[11px] font-bold flex items-center justify-center shrink-0">
                                    1
                                </span>
                                <h4 className="font-bold text-sm text-[#102030]">
                                    Mức phí tham khảo trên được tính như thế nào?
                                </h4>
                            </div>
                            <p className="leading-relaxed text-xs sm:text-sm text-slate-500 pl-7">
                                Mức phí hiển thị là mức giá trung bình của từng nhóm kỹ năng. Ở bước tiếp theo, bạn có thể xem hồ sơ cụ thể và sử dụng thanh trượt lọc mức giá từ 50.000đ – 500.000đ/giờ phù hợp với ngân sách gia đình.
                            </p>
                        </div>

                        <div className="bg-[#f8faf9] border border-[#e2e8e5] rounded-xl p-5 hover:bg-white hover:border-[#00677c]/30 hover:shadow-2xs transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-5 h-5 rounded-full bg-[#00677c]/10 text-[#00677c] text-[11px] font-bold flex items-center justify-center shrink-0">
                                    2
                                </span>
                                <h4 className="font-bold text-sm text-[#102030]">
                                    Tôi có được trao đổi trước khi chốt lịch không?
                                </h4>
                            </div>
                            <p className="leading-relaxed text-xs sm:text-sm text-slate-500 pl-7">
                                Có. Bạn hoàn toàn có thể nhắn tin trao đổi về tình trạng bệnh nhân, lịch hẹn và yêu cầu chi tiết trước khi tiến hành xác nhận đặt lịch và thanh toán.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modal Chi tiết Dịch vụ (API 81: GET /api/v1/services/{id}) */}
            <ServiceDetailModal
                isOpen={detailModalOpen}
                serviceId={viewingServiceId}
                fallbackService={services.find((s) => s.id === viewingServiceId)}
                onClose={() => {
                    setDetailModalOpen(false);
                    setViewingServiceId(null);
                }}
                onSelectService={handleSelectFromModal}
            />

            {/* Thanh Dock cố định ở đáy màn hình (Floating Action Dock) */}
            {currentSelectedService && (
                <aside aria-label="Thanh xác nhận dịch vụ đã chọn" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#d8e2df] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] py-3 sm:py-4 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 w-full sm:w-auto">
                            <div className="w-11 h-11 rounded-xl bg-[#00677c] text-white flex items-center justify-center shrink-0 shadow-sm">
                                {currentSelectedService.icon}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00677c]">
                                        Dịch vụ đang chọn:
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        ({currentSelectedService.badgeText})
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-base font-bold text-[#102030]">
                                        {currentSelectedService.title}
                                    </span>
                                    <span className="hidden md:inline-block text-xs font-semibold text-slate-500">
                                        • Mức phí tham khảo: <strong className="text-[#00677c] font-bold">{currentSelectedService.priceRange}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <button
                                type="button"
                                onClick={() => handleOpenDetail(currentSelectedService.id)}
                                className="hidden sm:inline-flex px-4 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                Xem chi tiết gói
                            </button>
                            <button
                                type="button"
                                onClick={handleContinue}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#00677c] hover:bg-[#005566] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                            >
                                <span>Tìm chuyên gia cho dịch vụ này</span>
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </aside>
            )}
        </div>
    );
}