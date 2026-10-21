import React, { useState, useEffect, useCallback } from "react";
import { RelativeDetailModal, RelativeFormModal, DeleteConfirmModal } from "../components/RelativeModals";
import Toast from "../../../components/Toast";
import familyApi from "../../../api/familyApi";

// ── Helpers ánh xạ dữ liệu Backend → UI ─────────────────────────────────────
const GENDER_MAP = {
    1: "Nam",
    2: "Nữ",
    3: "Khác",
    0: "Khác",
    Male: "Nam",
    Female: "Nữ",
};

const GENDER_TO_INT = {
    "Nam": 1,
    "Nữ": 2,
    "Khác": 3,
    "Male": 1,
    "Female": 2,
    "Other": 3,
    1: 1,
    2: 2,
    3: 3,
};

function mapRecipient(r) {
    const dob = r.dateOfBirth || "";
    let age = "—";
    if (dob) {
        const birth = new Date(dob);
        if (!isNaN(birth)) age = new Date().getFullYear() - birth.getFullYear();
    }
    const genderLabel = GENDER_MAP[r.gender] ?? r.genderName ?? "—";
    return {
        id: r.id,
        name: r.fullName || "Không rõ",
        birthDate: dob ? new Date(dob).toLocaleDateString("vi-VN") : "—",
        birthDateRaw: dob,
        age,
        gender: genderLabel,
        address: r.address || "",
        medicalHistory: r.medicalHistory || "",
        specialNotes: r.specialNotes || "",
        createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "—",
        image:
            genderLabel === "Nam"
                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs animate-pulse flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/5" />
                    <div className="h-3 bg-slate-200 rounded w-2/5" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-4/5" />
            </div>
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="flex gap-3 pt-2">
                <div className="flex-1 h-9 bg-slate-200 rounded-xl" />
                <div className="flex-1 h-9 bg-slate-200 rounded-xl" />
            </div>
        </div>
    );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ onAdd }) {
    return (
        <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            </div>
            <div>
                <p className="font-bold text-slate-800 text-base">Chưa có hồ sơ người thân nào</p>
                <p className="text-slate-500 text-sm mt-1 max-w-xs">
                    Thêm người thân để CareLink quản lý hồ sơ sức khỏe và dễ dàng đặt lịch chăm sóc tại nhà.
                </p>
            </div>
            <button
                type="button"
                onClick={onAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00677c] to-[#008ba3] text-white rounded-xl text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow transition-all cursor-pointer"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Thêm người thân đầu tiên
            </button>
        </div>
    );
}

const BLANK_FORM = {
    name: "",
    birthDate: "",
    gender: "Nữ",
    address: "",
    medicalHistory: "",
    specialNotes: "",
};

export default function Relatives() {
    const [toast, setToast] = useState(null);
    const [relatives, setRelatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Modal states
    const [selectedRelative, setSelectedRelative] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRelative, setEditingRelative] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({ ...BLANK_FORM });

    // ── GET /api/v1/recipients ──────────────────────────────────────────
    const fetchRecipients = useCallback(async () => {
        setLoading(true);
        try {
            const res = await familyApi.getRecipients();
            const list = Array.isArray(res)
                ? res
                : Array.isArray(res?.data) ? res.data
                : Array.isArray(res?.items) ? res.items
                : [];
            setRelatives(list.map(mapRecipient));
        } catch (err) {
            console.error("Lỗi tải danh sách người thân:", err);
            setToast({ type: "error", message: "Không thể tải danh sách người thân. Vui lòng thử lại." });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecipients();
    }, [fetchRecipients]);

    // ── Mở modal Thêm mới ─────────────────────────────────────────────────
    const handleOpenAddModal = () => {
        setEditingRelative(null);
        setFormData({ ...BLANK_FORM });
        setIsFormOpen(true);
    };

    // ── Mở modal Chỉnh sửa ────────────────────────────────────────────────
    const handleOpenEditModal = (rel) => {
        setEditingRelative(rel);
        setFormData({
            name: rel.name || "",
            birthDate: rel.birthDateRaw || "",
            gender: rel.gender || "Nữ",
            address: rel.address || "",
            medicalHistory: rel.medicalHistory || "",
            specialNotes: rel.specialNotes || "",
        });
        setIsFormOpen(true);
    };

    // ── Build payload gửi Backend (Khớp 100% CreateCareRecipientRequest) ─────
    const buildPayload = () => {
        let dob = null;
        if (formData.birthDate) {
            if (/^\d{4}-\d{2}-\d{2}$/.test(formData.birthDate)) {
                dob = formData.birthDate;
            } else {
                const parsed = new Date(formData.birthDate);
                if (!isNaN(parsed.getTime())) {
                    dob = parsed.toISOString().split("T")[0];
                }
            }
        }

        return {
            fullName: formData.name.trim(),
            dateOfBirth: dob,
            gender: GENDER_TO_INT[formData.gender] ?? 1,
            address: formData.address?.trim() || null,
            medicalHistory: formData.medicalHistory?.trim() || null,
            specialNotes: formData.specialNotes?.trim() || null,
        };
    };

    // ── POST /api/v1/recipients & PUT /api/v1/recipients/{id} ──────────────
    const handleSaveForm = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setToast({ type: "warning", message: "Vui lòng nhập họ và tên người thân!" });
            return;
        }
        setSubmitting(true);
        try {
            const payload = buildPayload();
            if (editingRelative) {
                await familyApi.updateRecipient(editingRelative.id, payload);
                setToast({ type: "success", message: "Đã cập nhật hồ sơ người thân thành công!" });
            } else {
                await familyApi.createRecipient(payload);
                setToast({ type: "success", message: "Đã thêm người thân mới vào danh sách!" });
            }
            setIsFormOpen(false);
            await fetchRecipients();
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                (editingRelative ? "Cập nhật hồ sơ thất bại. Vui lòng thử lại." : "Thêm người thân thất bại. Vui lòng kiểm tra lại thông tin.");
            setToast({ type: "error", message: msg });
        } finally {
            setSubmitting(false);
        }
    };

    // ── DELETE /api/v1/recipients/{id} ────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await familyApi.deleteRecipient(deleteTarget.id);
            setToast({ type: "success", message: `Đã xóa hồ sơ "${deleteTarget.name}" khỏi danh sách.` });
            setDeleteTarget(null);
            await fetchRecipients();
        } catch (err) {
            const msg = err?.response?.data?.detail || err?.response?.data?.message || "Xóa hồ sơ thất bại. Vui lòng thử lại.";
            setToast({ type: "error", message: msg });
        } finally {
            setDeleting(false);
        }
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
                        Quản lý thông tin hành chính, địa chỉ và tiền sử y tế của người nhận chăm sóc.
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

            {/* Thẻ Thống kê tổng số người thân */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            TỔNG SỐ NGƯỜI THÂN ĐÃ ĐĂNG KÝ
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-2xl font-black text-slate-900 leading-none">
                                {loading ? "—" : relatives.length}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">thành viên</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            TRẠNG THÁI BẢO MẬT HỒ SƠ
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-base font-bold text-slate-800 leading-none">
                                Đã sẵn sàng kết nối điều dưỡng
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                            Tiền sử bệnh án &amp; chỉ dẫn chăm sóc được lưu trữ bảo mật
                        </p>
                    </div>
                </div>
            </div>

            {/* Danh sách thẻ người thân */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : relatives.length === 0 ? (
                    <EmptyState onAdd={handleOpenAddModal} />
                ) : (
                    relatives.map((rel) => (
                        <div
                            key={rel.id}
                            className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5"
                        >
                            <div className="space-y-4">
                                {/* Header Card: Avatar + Tên + Badge Giới tính */}
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
                                                    {rel.gender}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                                {rel.age !== "—" ? `${rel.age} tuổi • ` : ""}
                                                Ngày sinh: {rel.birthDate}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Nút xóa nhanh */}
                                    <button
                                        type="button"
                                        onClick={() => setDeleteTarget({ id: rel.id, name: rel.name })}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                        title="Xóa hồ sơ người thân"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Khung Thông tin chi tiết sức khỏe */}
                                <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs text-slate-700">
                                    {/* Địa chỉ */}
                                    <div className="flex items-start gap-2">
                                        <span className="shrink-0 text-teal-600 mt-0.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                        </span>
                                        <p className="leading-relaxed">
                                            <span className="text-slate-500 font-medium">Địa chỉ:</span>{" "}
                                            <span className="text-slate-900 font-semibold">
                                                {rel.address || "Chưa thiết lập địa chỉ"}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Tiền sử bệnh lý */}
                                    <div className="flex items-start gap-2">
                                        <span className="shrink-0 text-teal-600 mt-0.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                            </svg>
                                        </span>
                                        <p className="leading-relaxed">
                                            <span className="text-slate-500 font-medium">Tiền sử bệnh lý:</span>{" "}
                                            <span className="text-slate-900 font-semibold">
                                                {rel.medicalHistory || "Chưa ghi nhận"}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Ghi chú chăm sóc */}
                                    {rel.specialNotes && (
                                        <div className="flex items-start gap-2 pt-2 border-t border-slate-200/70">
                                            <span className="shrink-0 text-amber-600 mt-0.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                </svg>
                                            </span>
                                            <p className="leading-relaxed text-amber-900 font-medium">
                                                {rel.specialNotes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="pt-2 flex items-center gap-2.5">
                                {/* Chỉnh sửa */}
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

                                {/* Xem chi tiết */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedRelative(rel)}
                                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                                >
                                    <svg className="w-4 h-4 text-cyan-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                    <span>Xem hồ sơ</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Chi tiết */}
            {selectedRelative && (
                <RelativeDetailModal
                    selectedRelative={selectedRelative}
                    onClose={() => setSelectedRelative(null)}
                    onEdit={(toEdit) => { setSelectedRelative(null); handleOpenEditModal(toEdit); }}
                />
            )}

            {/* Modal Thêm / Sửa */}
            {isFormOpen && (
                <RelativeFormModal
                    isOpen={isFormOpen}
                    editingRelative={editingRelative}
                    formData={formData}
                    setFormData={setFormData}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSaveForm}
                    submitting={submitting}
                />
            )}

            {/* Modal Xác nhận xóa */}
            {deleteTarget && (
                <DeleteConfirmModal
                    name={deleteTarget.name}
                    deleting={deleting}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* Toast */}
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
}
