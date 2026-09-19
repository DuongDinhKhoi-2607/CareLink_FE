import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Relatives() {
    // Danh sách người thân mock data chuẩn y như hình ảnh thực tế của CareLink
    const [relatives, setRelatives] = useState([
        {
            id: "rel-1",
            name: "Bà Nguyễn Thị Lan",
            relation: "Mẹ",
            relationBadge: "Mẹ",
            age: 75,
            birthDate: "15/04/1951",
            gender: "Nữ",
            bloodType: "O+",
            phone: "0908 123 456",
            statusBadges: [
                { label: "Đang được chăm sóc", type: "teal", icon: "dot" },
                { label: "Đang theo dõi huyết áp", type: "slate", icon: "card" },
            ],
            healthCondition: "Cao huyết áp độ 2, suy giảm vận động nhẹ khớp gối.",
            preExistingConditions: "Tăng huyết áp vô căn (10 năm), thoái hóa khớp gối",
            allergies: "Dị ứng Penicillin, mẫn cảm với hải sản tôm cua",
            medicationsSummary: "2 loại (Amlodipine 5mg, Glucosamine).",
            medications: [
                { name: "Amlodipine 5mg", dosage: "1 viên/ngày (08:00 sáng)" },
                { name: "Glucosamine", dosage: "2 viên/ngày (Sau bữa ăn)" },
            ],
            assignedCaregiver: "Điều dưỡng Nguyễn Thùy Linh",
            lastVisit: "Hôm qua, 16:30",
            nextAppointment: "Thứ Bảy, 20/09 (08:00)",
            medicalNote: "Hạn chế ăn mặn, cần hỗ trợ tập co duỗi khớp gối 20 phút mỗi buổi sáng.",
            // Khôi phục ảnh cũ của Mẹ
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
        },
        {
            id: "rel-2",
            name: "Ông Nguyễn Văn Bình",
            relation: "Bố",
            relationBadge: "Bố",
            age: 82,
            birthDate: "20/11/1944",
            gender: "Nam",
            bloodType: "A+",
            phone: "0903 456 789",
            statusBadges: [
                { label: "Tình trạng ổn định", type: "teal", icon: "dot" },
                { label: "Phục hồi vận động", type: "slate", icon: "walk" },
            ],
            healthCondition: "Ổn định sau phục hồi chức năng vận động.",
            preExistingConditions: "Tiểu đường tuýp 2 nhẹ, phục hồi sau phẫu thuật khớp gối",
            allergies: "Không có dị ứng thuốc",
            medicationsSummary: "1 loại (Thuốc bổ trợ tuần hoàn não).",
            medications: [
                { name: "Thuốc bổ trợ tuần hoàn não", dosage: "1 viên/ngày (Sau bữa ăn sáng)" },
            ],
            assignedCaregiver: "Điều dưỡng Trần Văn An",
            lastVisit: "15/09/2026",
            nextAppointment: "Chủ Nhật, 21/09 (14:30)",
            medicalNote: "Thường xuyên quên uống nước, cân nhắc nhờ vận động đi dạo nhẹ trong nhà.",
            // Khôi phục ảnh cũ của Bố
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
        },
    ]);

    // Trạng thái modal Xem hồ sơ chi tiết
    const [selectedRelative, setSelectedRelative] = useState(null);

    // Trạng thái modal Thêm / Sửa người thân
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRelative, setEditingRelative] = useState(null);

    // Form state (phân định rõ: Thông tin cá nhân do gia đình sửa, Thông tin y tế chỉ xem/gửi yêu cầu)
    const [formData, setFormData] = useState({
        name: "",
        relation: "Mẹ",
        birthDate: "15/04/1951",
        gender: "Nữ",
        bloodType: "O+",
        phone: "",
        healthCondition: "",
        medicationsSummary: "",
        assignedCaregiver: "Điều dưỡng Nguyễn Thùy Linh",
        medicalNote: "",
    });

    // Mở modal Thêm mới
    const handleOpenAddModal = () => {
        setEditingRelative(null);
        setFormData({
            name: "",
            relation: "Mẹ",
            birthDate: "01/01/1955",
            gender: "Nữ",
            bloodType: "O+",
            phone: "",
            healthCondition: "Huyết áp ổn định, vận động bình thường (Đang chờ điều dưỡng xác nhận)",
            medicationsSummary: "Chưa có đơn thuốc chỉ định",
            assignedCaregiver: "Điều dưỡng CareLink sẽ phân công",
            medicalNote: "Theo dõi dinh dưỡng và nhắc uống đủ nước mỗi ngày",
        });
        setIsFormOpen(true);
    };

    // Mở modal Chỉnh sửa
    const handleOpenEditModal = (rel) => {
        setEditingRelative(rel);
        setFormData({
            name: rel.name,
            relation: rel.relation,
            birthDate: rel.birthDate || "15/04/1951",
            gender: rel.gender,
            bloodType: rel.bloodType,
            phone: rel.phone || "",
            healthCondition: rel.healthCondition,
            medicationsSummary: rel.medicationsSummary,
            assignedCaregiver: rel.assignedCaregiver,
            medicalNote: rel.medicalNote,
        });
        setIsFormOpen(true);
    };

    // Lưu form Thêm / Sửa (chỉ lưu các thông tin mà vai trò Gia đình được phép quản lý)
    const handleSaveForm = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert("Vui lòng nhập họ và tên người thân!");
            return;
        }

        if (editingRelative) {
            setRelatives((prev) =>
                prev.map((r) =>
                    r.id === editingRelative.id
                        ? {
                              ...r,
                              name: formData.name,
                              relation: formData.relation,
                              relationBadge: formData.relation,
                              gender: formData.gender,
                              bloodType: formData.bloodType,
                              phone: formData.phone,
                              birthDate: formData.birthDate,
                              medicalNote: formData.medicalNote, // Dặn dò của gia đình
                          }
                        : r
                )
            );
        } else {
            const newRel = {
                id: `rel-${Date.now()}`,
                name: formData.name,
                relation: formData.relation,
                relationBadge: formData.relation,
                gender: formData.gender,
                bloodType: formData.bloodType,
                phone: formData.phone,
                birthDate: formData.birthDate,
                medicalNote: formData.medicalNote,
                healthCondition: "Chờ điều dưỡng thăm khám & cập nhật",
                medicationsSummary: "Chưa ghi nhận đơn thuốc",
                age: 70,
                statusBadges: [
                    { label: "Mới tạo hồ sơ", type: "teal", icon: "dot" },
                    { label: "Theo dõi định kỳ", type: "slate", icon: "card" },
                ],
                lastVisit: "Chưa có ca chăm sóc",
                nextAppointment: "Chưa có lịch hẹn mới",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
                medications: [],
                assignedCaregiver: "Đang phân công",
            };
            setRelatives((prev) => [...prev, newRel]);
        }

        setIsFormOpen(false);
    };

    return (
        <div className="p-4 sm:p-8 flex flex-col gap-6 max-w-6xl mx-auto font-sans antialiased text-[#102030]">
            {/* Header trang */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Hồ sơ người thân
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Quản lý chỉ số y tế và tình trạng sức khỏe của từng thành viên trong gia đình.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer shrink-0"
                >
                    <svg className="w-4 h-4 text-cyan-200" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Thêm người thân</span>
                </button>
            </header>

            {/* 3 Thẻ Tóm tắt / Chỉ số ở trên đầu (Tổng số người thân, Ca chăm sóc kế tiếp, Chỉ số theo dõi) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Thẻ 1: Tổng số người thân */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            TỔNG SỐ NGƯỜI THÂN
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-2xl font-black text-slate-900 leading-none">
                                {String(relatives.length).padStart(2, "0")}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">thành viên</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ 2: Ca chăm sóc kế tiếp */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            CA CHĂM SÓC KẾ TIẾP
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-lg sm:text-xl font-bold text-slate-900 leading-none">
                                Thứ Bảy
                            </span>
                            <span className="text-xs text-slate-500 font-medium">20/09 - 08:00</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ 3: Chỉ số theo dõi */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            CHỈ SỐ THEO DÕI
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-2xl font-black text-teal-600 leading-none">
                                100%
                            </span>
                            <span className="text-xs text-slate-500 font-medium">cập nhật định kỳ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2 Cột Thẻ Người Thân (chuẩn y xì hình ảnh thứ 2 của user) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {relatives.map((rel) => {
                    return (
                        <div
                            key={rel.id}
                            className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5"
                        >
                            <div className="space-y-4">
                                {/* Header Card: Avatar + Tên + Badge Mẹ/Bố + 3 chấm menu */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3.5">
                                        <img
                                            src={rel.image}
                                            alt={rel.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300";
                                            }}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                                                    {rel.name}
                                                </h2>
                                                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                                                    {rel.relationBadge}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                                {rel.age} tuổi • Giới tính: {rel.gender} • Nhóm máu:{" "}
                                                <strong className="text-slate-700 font-bold">{rel.bloodType}</strong>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Nút menu 3 chấm */}
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEditModal(rel)}
                                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                        title="Tùy chọn chỉnh sửa"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Hàng Badges trạng thái */}
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    {rel.statusBadges.map((b, i) => (
                                        <span
                                            key={i}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                                b.type === "teal"
                                                    ? "bg-[#e2f4f2] text-[#007469]"
                                                    : "bg-slate-100 text-slate-700"
                                            }`}
                                        >
                                            {b.icon === "dot" && <span className="w-2 h-2 rounded-full bg-teal-600" />}
                                            {b.icon === "card" && (
                                                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                                </svg>
                                            )}
                                            {b.icon === "walk" && (
                                                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                            )}
                                            <span>{b.label}</span>
                                        </span>
                                    ))}
                                </div>

                                {/* Khung Thông tin chi tiết sức khỏe (bg-slate-50/80) */}
                                <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs text-slate-700">
                                    {/* Tình trạng sức khỏe */}
                                    <div className="flex items-start gap-2">
                                        <span className="shrink-0 text-teal-600 mt-0.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                            </svg>
                                        </span>
                                        <p className="leading-relaxed">
                                            <span className="text-slate-500 font-medium">Tình trạng sức khỏe:</span>{" "}
                                            <span className="text-slate-900 font-semibold">{rel.healthCondition}</span>
                                        </p>
                                    </div>

                                    {/* Thuốc đang dùng */}
                                    <div className="flex items-start gap-2">
                                        <span className="shrink-0 text-teal-600 mt-0.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                        </span>
                                        <p className="leading-relaxed">
                                            <span className="text-slate-500 font-medium">Thuốc đang dùng:</span>{" "}
                                            <span className="text-slate-900 font-semibold">{rel.medicationsSummary}</span>
                                        </p>
                                    </div>

                                    {/* Phụ trách chính */}
                                    <div className="flex items-start gap-2">
                                        <span className="shrink-0 text-teal-600 mt-0.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        </span>
                                        <p className="leading-relaxed">
                                            <span className="text-slate-500 font-medium">Phụ trách chính:</span>{" "}
                                            <strong className="text-slate-900 font-bold">{rel.assignedCaregiver}</strong>
                                        </p>
                                    </div>

                                    {/* 2 Cột thời gian: Ca gần nhất & Lịch hẹn kế tiếp */}
                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200/70">
                                        <div>
                                            <span className="text-[11px] text-slate-400 block font-medium">
                                                Ca chăm sóc gần nhất:
                                            </span>
                                            <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                                                {rel.lastVisit}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[11px] text-slate-400 block font-medium">
                                                Lịch hẹn kế tiếp:
                                            </span>
                                            <span className="text-xs font-bold text-[#00829d] mt-0.5 block">
                                                {rel.nextAppointment}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Khung Ghi chú y tế */}
                                <div className="bg-[#f0f9ff]/70 border-l-3 border-[#009bb9] p-3 rounded-r-xl flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-[#009bb9] shrink-0 mt-0.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                        </svg>
                                    </span>
                                    <p className="leading-relaxed">
                                        <strong className="text-slate-800 font-semibold">Ghi chú y tế:</strong> {rel.medicalNote}
                                    </p>
                                </div>
                            </div>

                            {/* 2 Nút bấm hành động (Chỉnh sửa - Xem hồ sơ chi tiết) */}
                            <div className="pt-2 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(rel)}
                                    className="flex-1 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                                >
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                    <span>Chỉnh sửa</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedRelative(rel)}
                                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                                >
                                    <svg className="w-4 h-4 text-cyan-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                    <span>Xem hồ sơ chi tiết</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Chi tiết thông tin hồ sơ người thân ("Xem hồ sơ chi tiết") */}
            {selectedRelative && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-page-enter">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3.5">
                                <img
                                    src={selectedRelative.image}
                                    alt={selectedRelative.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Hồ sơ y tế: {selectedRelative.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Quan hệ: <strong className="text-slate-700 font-semibold">{selectedRelative.relation}</strong> •{" "}
                                        {selectedRelative.age} tuổi • Giới tính: {selectedRelative.gender} • Nhóm máu:{" "}
                                        <strong className="text-teal-700 font-bold">{selectedRelative.bloodType}</strong>
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedRelative(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Nội dung chi tiết */}
                        <div className="space-y-4 text-xs">
                            {/* 1. Thông tin cá nhân & Liên hệ */}
                            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                                    1. Thông tin hành chính & liên hệ
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
                                        <span className="font-bold text-slate-900">{selectedRelative.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Ngày sinh:</span>
                                        <span>{selectedRelative.birthDate}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Nhóm máu:</span>
                                        <span className="font-bold text-teal-700">{selectedRelative.bloodType}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
                                        <span>{selectedRelative.phone || "0908 123 456"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Bệnh học & Thuốc men */}
                            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-3">
                                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                                    2. Tình trạng bệnh & Phác đồ dùng thuốc
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                                    <div className="sm:col-span-2">
                                        <span className="text-slate-400 block text-[11px]">Chẩn đoán y tế:</span>
                                        <span className="font-semibold text-slate-800">{selectedRelative.healthCondition}</span>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-slate-400 block text-[11px]">Thuốc đang dùng:</span>
                                        <span className="font-semibold text-slate-800">{selectedRelative.medicationsSummary}</span>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-slate-400 block text-[11px]">Ghi chú chăm sóc:</span>
                                        <p className="text-slate-700 italic bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 text-[11px]">
                                            "{selectedRelative.medicalNote}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Phụ trách chuyên môn */}
                            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                                    3. Điều dưỡng CareLink phụ trách
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Điều dưỡng phụ trách:</span>
                                        <strong className="text-slate-900">{selectedRelative.assignedCaregiver}</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Ca chăm sóc gần nhất:</span>
                                        <span>{selectedRelative.lastVisit}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setSelectedRelative(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const toEdit = selectedRelative;
                                    setSelectedRelative(null);
                                    handleOpenEditModal(toEdit);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                            >
                                Chỉnh sửa thông tin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chỉnh sửa thông tin người thân (Chuẩn vai trò Gia Đình / Khách hàng) */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-page-enter">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {editingRelative ? "Chỉnh sửa thông tin người thân" : "Thêm người thân mới"}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[11px] font-semibold">
                                        Vai trò: Gia đình
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Gia đình quản lý thông tin hành chính, liên hệ và ghi chú dặn dò sinh hoạt.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
                            {/* KHỐI 1: THÔNG TIN GIA ĐÌNH CÓ TOÀN QUYỀN CHỈNH SỬA */}
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-1 flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    Thông tin hành chính & Gia đình
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-slate-700 font-semibold mb-1">
                                            Họ và tên người thân <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ví dụ: Bà Nguyễn Thị Lan"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 font-semibold mb-1">Mối quan hệ</label>
                                        <select
                                            value={formData.relation}
                                            onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 cursor-pointer text-slate-800"
                                        >
                                            <option value="Mẹ">Mẹ</option>
                                            <option value="Bố">Bố</option>
                                            <option value="Ông">Ông</option>
                                            <option value="Bà">Bà</option>
                                            <option value="Vợ/Chồng">Vợ/Chồng</option>
                                            <option value="Khác">Người thân khác</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 font-semibold mb-1">Giới tính</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 cursor-pointer text-slate-800"
                                        >
                                            <option value="Nữ">Nữ</option>
                                            <option value="Nam">Nam</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 font-semibold mb-1">Nhóm máu</label>
                                        <select
                                            value={formData.bloodType}
                                            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 cursor-pointer text-slate-800"
                                        >
                                            <option value="O+">O+</option>
                                            <option value="A+">A+</option>
                                            <option value="B+">B+</option>
                                            <option value="AB+">AB+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-slate-700 font-semibold mb-1">Số điện thoại liên hệ</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Số điện thoại của người thân hoặc người giám hộ"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-semibold mb-1">
                                        Ghi chú & Dặn dò của gia đình gửi Điều dưỡng
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={formData.medicalNote}
                                        onChange={(e) => setFormData({ ...formData, medicalNote: e.target.value })}
                                        placeholder="Ví dụ: Hạn chế ăn mặn, cần hỗ trợ tập co duỗi khớp gối 20 phút mỗi buổi sáng, cụ thích đi dạo nhẹ trong nhà..."
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-slate-800"
                                    />
                                </div>
                            </div>

                            {/* KHỐI 2: HỒ SƠ Y KHOA CHUYÊN MÔN (READ-ONLY DO ĐIỀU DƯỠNG QUẢN LÝ) */}
                            <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                        Hồ sơ y khoa chuyên môn (Được quản lý bởi Điều dưỡng)
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium italic">Chỉ xem (Read-only)</span>
                                </div>

                                <div>
                                    <label className="block text-slate-500 font-medium mb-1 text-[11px]">
                                        Tình trạng sức khỏe & Chẩn đoán lâm sàng:
                                    </label>
                                    <div className="px-3 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-slate-700 font-medium select-none">
                                        {formData.healthCondition || "Chưa ghi nhận"}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-500 font-medium mb-1 text-[11px]">
                                        Thuốc đang dùng theo phác đồ bác sĩ:
                                    </label>
                                    <div className="px-3 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-slate-700 font-medium select-none">
                                        {formData.medicationsSummary || "Theo chỉ định"}
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
                                    <svg className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    <p>
                                        Để đảm bảo tính chuẩn xác và an toàn y tế, đơn thuốc và bệnh lý chỉ được xác nhận bởi Điều dưỡng phụ trách. Nếu người thân có toa thuốc mới từ bệnh viện, vui lòng{" "}
                                        <Link to="/chat" className="text-teal-700 font-bold hover:underline">
                                            gửi ảnh toa thuốc tại đây →
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                                >
                                    {editingRelative ? "Lưu thay đổi" : "Thêm hồ sơ"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
