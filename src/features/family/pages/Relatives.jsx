import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { RelativeDetailModal, RelativeFormModal, DeleteConfirmModal } from "../components/RelativeModals";
import Toast from "../../../components/Toast";
import familyApi from "../../../api/familyApi";

// ── Helpers ánh xạ dữ liệu Backend → UI ─────────────────────────────────────
const GENDER_MAP = { 0: "Nam", 1: "Nữ", Male: "Nam", Female: "Nữ" };
const BLOOD_MAP = {
    0: "A+", 1: "A-", 2: "B+", 3: "B-",
    4: "AB+", 5: "AB-", 6: "O+", 7: "O-",
    A_positive: "A+", A_negative: "A-",
    B_positive: "B+", B_negative: "B-",
    AB_positive: "AB+", AB_negative: "AB-",
    O_positive: "O+", O_negative: "O-",
};
const GENDER_TO_API = { "Nam": "Male", "Nữ": "Female" };
const BLOOD_TO_API = {
    "A+": "A_positive", "A-": "A_negative",
    "B+": "B_positive", "B-": "B_negative",
    "AB+": "AB_positive", "AB-": "AB_negative",
    "O+": "O_positive", "O-": "O_negative",
};

function mapRecipient(r) {
    const dob = r.dateOfBirth || r.birthDate || "";
    let age = "—";
    if (dob) {
        const birth = new Date(dob);
        if (!isNaN(birth)) age = new Date().getFullYear() - birth.getFullYear();
    }
    const genderLabel = GENDER_MAP[r.gender] ?? r.gender ?? "—";
    return {
        id: r.id,
        name: r.fullName || r.name || "Không rõ",
        relation: r.relationship || r.relation || "Người thân",
        relationBadge: r.relationship || r.relation || "Người thân",
        age,
        birthDate: dob ? new Date(dob).toLocaleDateString("vi-VN") : "—",
        birthDateRaw: dob,
        gender: genderLabel,
        bloodType: BLOOD_MAP[r.bloodType] ?? r.bloodType ?? "—",
        phone: r.phone || r.phoneNumber || "",
        healthCondition: r.medicalCondition || r.healthCondition || "Chưa cập nhật",
        preExistingConditions: r.preExistingConditions || "",
        allergies: r.allergies || "",
        medicationsSummary: r.currentMedications || r.medicationsSummary || "Chưa ghi nhận đơn thuốc",
        medications: r.medications || [],
        medicalNote: r.notes || r.medicalNote || "",
        assignedCaregiver: r.assignedNurseName || r.assignedCaregiver || "Đang phân công",
        lastVisit: r.lastVisitDate
            ? new Date(r.lastVisitDate).toLocaleDateString("vi-VN")
            : "Chưa có ca chăm sóc",
        nextAppointment: r.nextAppointmentDate
            ? new Date(r.nextAppointmentDate).toLocaleDateString("vi-VN")
            : "Chưa có lịch hẹn",
        image:
            r.avatarUrl ||
            (genderLabel === "Nam"
                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"),
        statusBadges: [
            { label: r.currentStatus || "Đang theo dõi", type: "teal", icon: "dot" },
            { label: r.medicalCondition ? "Có hồ sơ y tế" : "Chưa có hồ sơ y tế", type: "slate", icon: "card" },
        ],
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
        <div className="col-span-2 flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            </div>
            <div>
                <p className="font-bold text-slate-800 text-base">Chưa có hồ sơ người thân nào</p>
                <p className="text-slate-500 text-sm mt-1 max-w-xs">Thêm người thân để CareLink hỗ trợ quản lý sức khỏe và đặt lịch chăm sóc tại nhà.</p>
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
    name: "", relation: "Mẹ", birthDate: "",
    gender: "Nữ", bloodType: "O+", phone: "",
    healthCondition: "", medicationsSummary: "", medicalNote: "",
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

    // ── 44. GET /api/v1/recipients ──────────────────────────────────────────
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

    useEffect(() => { fetchRecipients(); }, [fetchRecipients]);

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
            relation: rel.relation || "Khác",
            birthDate: rel.birthDateRaw || "",
            gender: rel.gender || "Nữ",
            bloodType: rel.bloodType || "O+",
            phone: rel.phone || "",
            healthCondition: rel.healthCondition || "",
            medicationsSummary: rel.medicationsSummary || "",
            medicalNote: rel.medicalNote || "",
        });
        setIsFormOpen(true);
    };

    // ── Build payload gửi Backend ──────────────────────────────────────────
    const buildPayload = () => ({
        fullName: formData.name.trim(),
        relationship: formData.relation,
        dateOfBirth: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        gender: GENDER_TO_API[formData.gender] ?? formData.gender,
        bloodType: BLOOD_TO_API[formData.bloodType] ?? formData.bloodType,
        phone: formData.phone.trim(),
        notes: formData.medicalNote.trim(),
    });

    // ── 45. POST + 47. PUT recipients ─────────────────────────────────────
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
            const msg = err?.response?.data?.message || err?.response?.data?.title ||
                (editingRelative ? "Cập nhật thất bại. Vui lòng thử lại." : "Thêm người thân thất bại. Vui lòng thử lại.");
            setToast({ type: "error", message: msg });
        } finally {
            setSubmitting(false);
        }
    };

    // ── 48. DELETE /api/v1/recipients/{id} ────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await familyApi.deleteRecipient(deleteTarget.id);
            setToast({ type: "success", message: `Đã xóa hồ sơ "${deleteTarget.name}" khỏi danh sách.` });
            setDeleteTarget(null);
            await fetchRecipients();
        } catch (err) {
            const msg = err?.response?.data?.message || "Xóa hồ sơ thất bại. Vui lòng thử lại.";
            setToast({ type: "error", message: msg });
        } finally {
            setDeleting(false);
        }
    };

    const nextAppt = relatives.find(r => r.nextAppointment && r.nextAppointment !== "Chưa có lịch hẹn");

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
                                {loading ? "—" : String(relatives.length).padStart(2, "0")}
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
                            <span className="text-base font-bold text-slate-900 leading-none">
                                {loading ? "—" : nextAppt ? nextAppt.nextAppointment : "Chưa có lịch"}
                            </span>
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
                                {loading ? "—" : relatives.length > 0 ? "100%" : "0%"}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">cập nhật định kỳ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách thẻ người thân */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <><SkeletonCard /><SkeletonCard /></>
                ) : relatives.length === 0 ? (
                    <EmptyState onAdd={handleOpenAddModal} />
                ) : (
                relatives.map((rel) => (
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

                            {/* Nút hành động */}
                            <div className="pt-2 flex items-center gap-2.5">
                                {/* Xóa */}
                                <button
                                    type="button"
                                    onClick={() => setDeleteTarget({ id: rel.id, name: rel.name })}
                                    className="py-2.5 px-3 bg-white border border-red-200 hover:bg-red-50 text-red-500 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                                    title="Xóa hồ sơ"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>

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
