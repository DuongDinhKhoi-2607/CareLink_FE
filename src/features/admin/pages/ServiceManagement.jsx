import React, { useState } from "react";
import ServiceFormModal from "../components/ServiceFormModal";
import {
    Plus,
    Search,
    Edit3,
    Power,
    CheckCircle2,
    HeartPulse,
    Activity,
    HeartHandshake,
    Footprints,
    Stethoscope,
    BriefcaseMedical,
} from "lucide-react";

const initialServices = [
    {
        id: "SVC-01",
        name: "Chăm sóc người cao tuổi",
        category: "Chăm sóc người cao tuổi",
        description: "Hỗ trợ ăn uống, vệ sinh cá nhân, trò chuyện, kiểm tra huyết áp và nhắc uống thuốc đúng giờ.",
        duration: "4 giờ hoặc 8 giờ / ca",
        basePrice: "450.000 ₫",
        status: "Đang hoạt động",
        updatedAt: "18/09/2026",
    },
    {
        id: "SVC-02",
        name: "Đồng hành và hỗ trợ sinh hoạt",
        category: "Hỗ trợ sinh hoạt",
        description: "Hỗ trợ di chuyển, dắt đi dạo, hỗ trợ dinh dưỡng nhẹ và đồng hành cùng người bệnh tại nhà.",
        duration: "4 giờ / ca",
        basePrice: "350.000 ₫",
        status: "Đang hoạt động",
        updatedAt: "15/09/2026",
    },
    {
        id: "SVC-03",
        name: "Phục hồi chức năng & Vật lý trị liệu",
        category: "Phục hồi chức năng",
        description: "Bài tập phục hồi khớp, cơ bắp cho người sau tai biến mạch máu não hoặc chấn thương chỉnh hình.",
        duration: "2 giờ / ca",
        basePrice: "550.000 ₫",
        status: "Đang hoạt động",
        updatedAt: "16/09/2026",
    },
    {
        id: "SVC-04",
        name: "Chăm sóc y tế chuyên môn",
        category: "Chăm sóc y tế chuyên môn",
        description: "Thực hiện tiêm bắp, tiêm tĩnh mạch, truyền dịch, thay băng cắt chỉ vết mổ vô trùng chuẩn y khoa.",
        duration: "Theo ca thủ thuật (1 - 2h)",
        basePrice: "400.000 ₫",
        status: "Đang hoạt động",
        updatedAt: "19/09/2026",
    },
    {
        id: "SVC-05",
        name: "Theo dõi sức khỏe & Chỉ số sinh tồn",
        category: "Theo dõi sức khỏe",
        description: "Đo SpO2, đường huyết mao mạch, huyết áp điện tử và ghi chép nhật ký chỉ số cho bác sĩ điều trị.",
        duration: "1 - 2 giờ / ca",
        basePrice: "250.000 ₫",
        status: "Đang hoạt động",
        updatedAt: "14/09/2026",
    },
];

export default function ServiceManagement() {
    const [services, setServices] = useState(initialServices);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    // Lọc dịch vụ
    const filteredServices = services.filter((svc) => {
        const matchesSearch =
            svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            svc.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || svc.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getServiceIcon = (svc) => {
        switch (svc.id) {
            case "SVC-01":
                return (
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/80 shrink-0">
                        <HeartHandshake className="w-5 h-5" strokeWidth={2} />
                    </div>
                );
            case "SVC-02":
                return (
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200/80 shrink-0">
                        <Footprints className="w-5 h-5" strokeWidth={2} />
                    </div>
                );
            case "SVC-03":
                return (
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 shrink-0">
                        <Activity className="w-5 h-5" strokeWidth={2} />
                    </div>
                );
            case "SVC-04":
                return (
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00677c] flex items-center justify-center border border-teal-200/80 shrink-0">
                        <Stethoscope className="w-5 h-5" strokeWidth={2} />
                    </div>
                );
            case "SVC-05":
                return (
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200/80 shrink-0">
                        <HeartPulse className="w-5 h-5" strokeWidth={2} />
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00677c] flex items-center justify-center border border-teal-200/80 shrink-0">
                        <BriefcaseMedical className="w-5 h-5" strokeWidth={2} />
                    </div>
                );
        }
    };

    const handleSaveService = (savedData) => {
        if (editingService) {
            // Cập nhật dịch vụ cũ
            setServices((prev) =>
                prev.map((s) => (s.id === editingService.id ? { ...s, ...savedData, updatedAt: "Hôm nay" } : s))
            );
            showToast(`Đã cập nhật dịch vụ "${savedData.name}" thành công!`);
        } else {
            // Thêm dịch vụ mới
            const newService = {
                ...savedData,
                id: `SVC-0${services.length + 1}`,
                updatedAt: "Hôm nay",
            };
            setServices((prev) => [newService, ...prev]);
            showToast(`Đã thêm mới gói dịch vụ "${savedData.name}"!`);
        }
        setModalOpen(false);
        setEditingService(null);
    };

    const handleToggleStatus = (id) => {
        setServices((prev) =>
            prev.map((s) => {
                if (s.id === id) {
                    const nextStatus = s.status === "Đang hoạt động" ? "Tạm ngưng" : "Đang hoạt động";
                    showToast(`Dịch vụ ${s.name} đã chuyển sang: ${nextStatus}`);
                    return { ...s, status: nextStatus };
                }
                return s;
            })
        );
    };

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    return (
        <div className="space-y-6 pb-12 font-sans">
            {/* Toast Thông báo */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#00677c] text-white px-5 py-3 rounded-2xl shadow-lg border border-teal-400 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-300" />
                    <span className="text-xs font-bold">{toastMessage}</span>
                </div>
            )}

            {/* ── HEADER TRANG ── */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        Quản lý dịch vụ
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-50 text-[#00677c] border border-teal-200/60 flex items-center gap-1">
                            <HeartPulse className="w-3.5 h-3.5" /> {services.length} gói dịch vụ
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Quản lý danh mục và thông tin các dịch vụ chăm sóc sức khỏe tại nhà trên hệ thống CareLink.
                    </p>
                </div>

                {/* Nút Thêm dịch vụ */}
                <button
                    type="button"
                    onClick={() => {
                        setEditingService(null);
                        setModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#00677c] hover:bg-[#005566] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    Thêm dịch vụ mới
                </button>
            </div>

            {/* ── BỘ LỌC VÀ TÌM KIẾM ── */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm theo tên hoặc mô tả dịch vụ..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => setStatusFilter("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            statusFilter === "all" ? "bg-teal-50 text-[#00677c] font-bold border border-teal-200" : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Tất cả ({services.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusFilter("Đang hoạt động")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            statusFilter === "Đang hoạt động" ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200" : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Đang hoạt động ({services.filter((s) => s.status === "Đang hoạt động").length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusFilter("Tạm ngưng")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            statusFilter === "Tạm ngưng" ? "bg-slate-100 text-slate-700 font-bold border border-slate-300" : "text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        Tạm ngưng ({services.filter((s) => s.status === "Tạm ngưng").length})
                    </button>
                </div>
            </div>

            {/* ── DANH SÁCH DỊCH VỤ (TABLE) ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="py-3.5 px-4 sm:px-6">Tên dịch vụ</th>
                                <th className="py-3.5 px-4">Thời lượng ca</th>
                                <th className="py-3.5 px-4">Đơn giá tham khảo</th>
                                <th className="py-3.5 px-4">Trạng thái</th>
                                <th className="py-3.5 px-4">Ngày cập nhật</th>
                                <th className="py-3.5 px-4 sm:px-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        Không tìm thấy dịch vụ nào phù hợp với bộ lọc.
                                    </td>
                                </tr>
                            ) : (
                                filteredServices.map((svc) => (
                                    <tr key={svc.id} className="hover:bg-slate-50/80 transition-colors">
                                        {/* Icon & Name */}
                                        <td className="py-4 px-4 sm:px-6">
                                            <div className="flex items-start gap-3">
                                                {getServiceIcon(svc)}
                                                <div className="max-w-xs sm:max-w-sm">
                                                    <div className="font-bold text-slate-900 text-sm">{svc.name}</div>
                                                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{svc.description}</p>
                                                    <span className="inline-block mt-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                                                        {svc.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Duration */}
                                        <td className="py-4 px-4 font-medium text-slate-600">{svc.duration}</td>

                                        {/* Price */}
                                        <td className="py-4 px-4">
                                            <span className="font-extrabold text-[#00677c] text-xs sm:text-sm">
                                                {svc.basePrice}
                                            </span>
                                            <span className="block text-[10px] text-slate-400">Giá sàn tham khảo</span>
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                                    svc.status === "Đang hoạt động"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-slate-100 text-slate-600 border-slate-200"
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        svc.status === "Đang hoạt động" ? "bg-emerald-500" : "bg-slate-400"
                                                    }`}
                                                ></span>
                                                {svc.status}
                                            </span>
                                        </td>

                                        {/* Updated date */}
                                        <td className="py-4 px-4 text-slate-400">{svc.updatedAt}</td>

                                        {/* Action buttons */}
                                        <td className="py-4 px-4 sm:px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingService(svc);
                                                        setModalOpen(true);
                                                    }}
                                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-[#00677c] font-bold text-slate-700 text-xs transition-colors cursor-pointer flex items-center gap-1"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    <span>Chỉnh sửa</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(svc.id)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                                                        svc.status === "Đang hoạt động"
                                                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                                                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                                    }`}
                                                    title={svc.status === "Đang hoạt động" ? "Bấm để tạm ngưng" : "Bấm để kích hoạt lại"}
                                                >
                                                    <Power className="w-3.5 h-3.5" />
                                                    <span>{svc.status === "Đang hoạt động" ? "Tạm ngưng" : "Kích hoạt"}</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL FORM THÊM / SỬA DỊCH VỤ ── */}
            <ServiceFormModal
                service={editingService}
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingService(null);
                }}
                onSave={handleSaveService}
            />
        </div>
    );
}
