import React, { useState } from "react";
import ApprovalDetailModal from "../components/ApprovalDetailModal";
import {
    Clock,
    CheckCircle2,
    XCircle,
    Search,
    RotateCcw,
    ChevronRight,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";

const initialCaregivers = [
    {
        id: "CG-101",
        name: "Trần Thị Mai",
        role: "Sinh viên Y khoa",
        phone: "0901 234 567",
        email: "mai.tran@med.edu.vn",
        workplace: "Đại học Y Dược TP.HCM (Năm 4)",
        experience: "2 năm thực tập lâm sàng tại BV Chợ Rẫy",
        submittedDate: "20/09/2026",
        status: "Chờ duyệt",
        skills: ["Đo huyết áp & đường huyết", "Thay băng rửa vết thương", "Hỗ trợ phục hồi vận động"],
        documents: [
            { name: "Căn cước công dân (Mặt trước & sau)", type: "Định danh", status: "Hợp lệ" },
            { name: "Thẻ sinh viên Y khoa niên khóa 2022-2028", type: "Học vấn", status: "Hợp lệ" },
            { name: "Chứng nhận thực tập lâm sàng BV Chợ Rẫy", type: "Kinh nghiệm", status: "Hợp lệ" },
            { name: "Giấy khám sức khỏe định kỳ loại 1", type: "Sức khỏe", status: "Hợp lệ" },
        ],
    },
    {
        id: "CG-102",
        name: "Lê Hoàng Long",
        role: "Điều dưỡng chuyên nghiệp",
        phone: "0912 345 678",
        email: "long.le@hospital.vn",
        workplace: "BV Nhân Dân Gia Định",
        experience: "4 năm điều dưỡng khoa Hồi sức tích cực",
        submittedDate: "19/09/2026",
        status: "Chờ duyệt",
        skills: ["Đặt ống thông tiểu", "Tiêm tĩnh mạch & truyền dịch", "Chăm sóc bệnh nhân thở máy"],
        documents: [
            { name: "Căn cước công dân (CCCD chip)", type: "Định danh", status: "Hợp lệ" },
            { name: "Bằng Cử nhân Điều dưỡng chính quy", type: "Bằng cấp", status: "Hợp lệ" },
            { name: "Chứng chỉ hành nghề y tế do Sở Y Tế cấp", type: "Chứng chỉ", status: "Hợp lệ" },
            { name: "Chứng chỉ hồi sức cấp cứu nâng cao (ACLS)", type: "Kỹ năng", status: "Hợp lệ" },
        ],
    },
    {
        id: "CG-103",
        name: "Nguyễn Thị Phương Thảo",
        role: "Sinh viên Y khoa",
        phone: "0988 765 432",
        email: "thao.nguyen@pnt.edu.vn",
        workplace: "ĐH Y Khoa Phạm Ngọc Thạch (Năm 5)",
        experience: "3 năm hỗ trợ chăm sóc người già tại viện dưỡng lão",
        submittedDate: "18/09/2026",
        status: "Chờ duyệt",
        skills: ["Đo dấu hiệu sinh tồn", "Vệ sinh cá nhân người cao tuổi", "Hỗ trợ tập vận động thụ động"],
        documents: [
            { name: "Căn cước công dân", type: "Định danh", status: "Hợp lệ" },
            { name: "Thẻ sinh viên Y khoa PNT", type: "Học vấn", status: "Hợp lệ" },
            { name: "Chứng chỉ sơ cấp cứu Hội Chữ Thập Đỏ", type: "Chứng chỉ", status: "Hợp lệ" },
            { name: "Giấy xác nhận thực tập BV Trưng Vương", type: "Kinh nghiệm", status: "Hợp lệ" },
        ],
    },
    {
        id: "CG-104",
        name: "Phạm Quốc Huy",
        role: "Điều dưỡng chuyên nghiệp",
        phone: "0933 456 789",
        email: "huy.pham@carelink.vn",
        workplace: "Phòng khám Đa khoa Quốc tế",
        experience: "5 năm điều dưỡng chăm sóc gia đình",
        submittedDate: "15/09/2026",
        status: "Đã duyệt",
        skills: ["Chăm sóc người tai biến", "Vật lý trị liệu khớp", "Dinh dưỡng bệnh lý"],
        documents: [
            { name: "Căn cước công dân", type: "Định danh", status: "Hợp lệ" },
            { name: "Bằng Cử nhân Điều dưỡng ĐH Y Hà Nội", type: "Bằng cấp", status: "Hợp lệ" },
            { name: "Chứng chỉ hành nghề y tế", type: "Chứng chỉ", status: "Hợp lệ" },
        ],
    },
    {
        id: "CG-105",
        name: "Vũ Thị Bích Trâm",
        role: "Sinh viên Y khoa",
        phone: "0977 112 233",
        email: "tram.vu@gmail.com",
        workplace: "Cao đẳng Y Dược Hồng Đức",
        experience: "1 năm thực tập tại phòng khám tư",
        submittedDate: "12/09/2026",
        status: "Từ chối",
        skills: ["Thay băng", "Đo huyết áp"],
        documents: [
            { name: "Căn cước công dân (Ảnh mờ)", type: "Định danh", status: "Cần chụp lại" },
            { name: "Bảng điểm chưa công chứng", type: "Học vấn", status: "Chưa hợp lệ" },
        ],
    },
];

export default function CaregiverApprovals() {
    const [caregivers, setCaregivers] = useState(initialCaregivers);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedCaregiver, setSelectedCaregiver] = useState(null);
    const [alertToast, setAlertToast] = useState(null);

    // Tính toán số lượng theo trạng thái
    const countPending = caregivers.filter((c) => c.status === "Chờ duyệt").length;
    const countApproved = caregivers.filter((c) => c.status === "Đã duyệt").length;
    const countRejected = caregivers.filter((c) => c.status === "Từ chối").length;

    // Lọc danh sách
    const filteredCaregivers = caregivers.filter((c) => {
        const matchesSearch =
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "all" || c.role === roleFilter;
        const matchesStatus = statusFilter === "all" || c.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleApprove = (id) => {
        setCaregivers((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: "Đã duyệt" } : c))
        );
        setSelectedCaregiver(null);
        showToast("Đã phê duyệt hồ sơ thành công! Thông báo kích hoạt tài khoản đã được gửi.");
    };

    const handleReject = (id, reason) => {
        setCaregivers((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: "Từ chối" } : c))
        );
        setSelectedCaregiver(null);
        showToast(`Đã từ chối hồ sơ #${id}. Lý do: "${reason}"`);
    };

    const showToast = (msg) => {
        setAlertToast(msg);
        setTimeout(() => setAlertToast(null), 4000);
    };

    return (
        <div className="space-y-6 pb-12 font-sans">
            {/* Toast Alert */}
            {alertToast && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#00677c] text-white px-5 py-3 rounded-2xl shadow-lg border border-teal-400 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-300" />
                    <span className="text-xs font-bold">{alertToast}</span>
                </div>
            )}

            {/* ── TOP HEADER TRANG ── */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    Duyệt hồ sơ điều dưỡng
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {countPending} hồ sơ chờ xử lý
                    </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Kiểm tra và xác minh thông tin bằng cấp, chứng chỉ y tế trước khi điều dưỡng được nhận ca trực trên CareLink.
                </p>
            </div>

            {/* ── 3 THẺ TÓM TẮT TRẠNG THÁI (SUMMARY CARDS) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Chờ duyệt */}
                <button
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === "Chờ duyệt" ? "all" : "Chờ duyệt")}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                        statusFilter === "Chờ duyệt"
                            ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20 shadow-xs"
                            : "bg-white border-slate-200/90 hover:border-amber-200 hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Hồ sơ chờ duyệt</span>
                        <span className="w-8.5 h-8.5 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                            <Clock className="w-4.5 h-4.5" strokeWidth={2.2} />
                        </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{countPending}</div>
                    <p className="text-xs text-slate-500 mt-1">Cần xem xét tài liệu y tế</p>
                </button>

                {/* Đã duyệt */}
                <button
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === "Đã duyệt" ? "all" : "Đã duyệt")}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                        statusFilter === "Đã duyệt"
                            ? "bg-teal-50/80 border-teal-300 ring-2 ring-teal-400/20 shadow-xs"
                            : "bg-white border-slate-200/90 hover:border-teal-200 hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00677c] uppercase tracking-wider">Đã phê duyệt</span>
                        <span className="w-8.5 h-8.5 rounded-xl bg-teal-100 text-[#00677c] flex items-center justify-center">
                            <CheckCircle2 className="w-4.5 h-4.5" strokeWidth={2.2} />
                        </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{countApproved}</div>
                    <p className="text-xs text-slate-500 mt-1">Đang hoạt động trên sàn</p>
                </button>

                {/* Từ chối */}
                <button
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === "Từ chối" ? "all" : "Từ chối")}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                        statusFilter === "Từ chối"
                            ? "bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/20 shadow-xs"
                            : "bg-white border-slate-200/90 hover:border-rose-200 hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Hồ sơ từ chối</span>
                        <span className="w-8.5 h-8.5 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                            <XCircle className="w-4.5 h-4.5" strokeWidth={2.2} />
                        </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{countRejected}</div>
                    <p className="text-xs text-slate-500 mt-1">Yêu cầu bổ sung thêm giấy tờ</p>
                </button>
            </div>

            {/* ── BỘ LỌC & TÌM KIẾM ── */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Search bar */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm theo tên, email, số điện thoại..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
                    {/* Filter Vai trò */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#00677c] cursor-pointer"
                    >
                        <option value="all">Tất cả vai trò</option>
                        <option value="Sinh viên Y khoa">Sinh viên Y khoa</option>
                        <option value="Điều dưỡng chuyên nghiệp">Điều dưỡng chuyên nghiệp</option>
                    </select>

                    {/* Filter Trạng thái */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#00677c] cursor-pointer"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="Chờ duyệt">Chờ duyệt</option>
                        <option value="Đã duyệt">Đã duyệt</option>
                        <option value="Từ chối">Từ chối</option>
                    </select>

                    {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                setRoleFilter("all");
                                setStatusFilter("all");
                            }}
                            className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Đặt lại
                        </button>
                    )}
                </div>
            </div>

            {/* ── BẢNG DANH SÁCH ĐIỀU DƯỠNG (TABLE) ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="py-3.5 px-4 sm:px-6">Điều dưỡng</th>
                                <th className="py-3.5 px-4">Vai trò</th>
                                <th className="py-3.5 px-4">Số điện thoại</th>
                                <th className="py-3.5 px-4">Ngày gửi hồ sơ</th>
                                <th className="py-3.5 px-4">Trạng thái</th>
                                <th className="py-3.5 px-4 sm:px-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {filteredCaregivers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        Không tìm thấy hồ sơ điều dưỡng nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredCaregivers.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                                        {/* Avatar & Name */}
                                        <td className="py-3.5 px-4 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00677c] font-bold flex items-center justify-center border border-teal-100 shrink-0">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{c.name}</div>
                                                    <div className="text-[11px] text-slate-400">{c.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role badge */}
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                                                    c.role === "Sinh viên Y khoa"
                                                        ? "bg-sky-50 text-sky-700 border border-sky-200"
                                                        : "bg-teal-50 text-[#00677c] border border-teal-200"
                                                }`}
                                            >
                                                {c.role}
                                            </span>
                                        </td>

                                        {/* Phone */}
                                        <td className="py-3.5 px-4 font-medium text-slate-600">{c.phone}</td>

                                        {/* Submitted date */}
                                        <td className="py-3.5 px-4 text-slate-500">{c.submittedDate}</td>

                                        {/* Status badge */}
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                                    c.status === "Chờ duyệt"
                                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                                        : c.status === "Đã duyệt"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-rose-50 text-rose-700 border-rose-200"
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        c.status === "Chờ duyệt"
                                                            ? "bg-amber-500"
                                                            : c.status === "Đã duyệt"
                                                            ? "bg-emerald-500"
                                                            : "bg-rose-500"
                                                    }`}
                                                ></span>
                                                {c.status}
                                            </span>
                                        </td>

                                        {/* Action Button */}
                                        <td className="py-3.5 px-4 sm:px-6 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedCaregiver(c)}
                                                className="px-3.5 py-1.5 rounded-xl bg-teal-50 text-[#00677c] hover:bg-[#00677c] hover:text-white font-bold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                                            >
                                                <span>Xem hồ sơ</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL CHI TIẾT XÁC MINH ── */}
            {selectedCaregiver && (
                <ApprovalDetailModal
                    caregiver={selectedCaregiver}
                    onClose={() => setSelectedCaregiver(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}
