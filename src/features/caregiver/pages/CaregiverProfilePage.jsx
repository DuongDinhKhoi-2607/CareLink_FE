import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import caregiverApi from "../../../api/caregiverApi";

export default function CaregiverProfilePage() {
    // ── STATE HỒ SƠ ĐIỀU DƯỠNG (KHỚP DTO BACKEND: NurseProfileResponse & UpdateNurseProfileRequest) ──
    const [profile, setProfile] = useState({
        fullName: "Điều dưỡng Nguyễn Thùy Linh",
        title: "Cử nhân Điều dưỡng ĐH Y Dược TP.HCM",
        email: "thuylinh.nurse@carelink.vn",
        phone: "0912 888 999",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
        rating: 4.9,
        reviewsCount: 128,
        completedBookings: 154,
        experienceYears: 5,
        bio: "Với hơn 5 năm kinh nghiệm công tác tại Khoa Nội tổng hợp và phục hồi chức năng, tôi luôn tận tâm, chu đáo và kiên nhẫn trong từng ca trực. Thành thạo kỹ thuật theo dõi sinh hiệu, chăm sóc người cao tuổi tai biến, bệnh nền tiểu đường, cao huyết áp và hỗ trợ tập vận động tại nhà.",
        maxDistanceKm: 10,
        serviceRadiusKm: 10, // Khớp chuẩn DTO Backend: ServiceRadiusKm
        workDistrict: "Quận Bình Thạnh", // Khớp DTO Backend: WorkDistrict
        baseAddress: "182 Bạch Đằng, Phường 24, Quận Bình Thạnh, TP.HCM",
        preferredDistricts: ["Quận Bình Thạnh", "Quận 1", "Quận Phú Nhuận", "Quận 3"],
        skills: [
            "Theo dõi & Đo sinh hiệu (HA, Tim, SpO2, Đường huyết)",
            "Chăm sóc phục hồi chức năng sau tai biến",
            "Thay băng, rửa vết thương y tế vô khuẩn",
            "Nhắc và hỗ trợ uống thuốc theo phác đồ",
            "Hỗ trợ vệ sinh, tắm gội tại giường cho người cao tuổi",
            "Xoa bóp, tập co duỗi khớp gối phòng teo cơ",
        ],
        verificationStatus: "verified", // verified | pending | rejected
        licenseNumber: "CCHN-003891/BYT-HCM",
        licenseExpiry: "15/12/2028",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState({ ...profile });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // ── 54. GET /api/v1/nurse/profile ──
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const res = await caregiverApi.getProfile();
            const data = res?.data || res;
            if (data && typeof data === "object") {
                setProfile((prev) => {
                    const merged = {
                        ...prev,
                        fullName: data.fullName || data.name || prev.fullName,
                        title: data.title || data.degree || data.qualification || prev.title,
                        email: data.email || prev.email,
                        phone: data.phone || data.phoneNumber || prev.phone,
                        avatar: data.avatar || data.avatarUrl || prev.avatar,
                        rating: Number(data.rating ?? data.averageRating ?? prev.rating),
                        reviewsCount: Number(data.reviewsCount ?? data.totalReviews ?? prev.reviewsCount),
                        completedBookings: Number(data.completedBookings ?? data.totalBookings ?? prev.completedBookings),
                        experienceYears: Number(data.experienceYears ?? data.yearsOfExperience ?? prev.experienceYears),
                        bio: data.bio || data.description || prev.bio,
                        maxDistanceKm: Number(data.maxDistanceKm ?? data.serviceRadiusKm ?? prev.maxDistanceKm),
                        serviceRadiusKm: Number(data.serviceRadiusKm ?? data.maxDistanceKm ?? prev.serviceRadiusKm),
                        workDistrict: data.workDistrict || data.district || prev.workDistrict,
                        baseAddress: data.baseAddress || data.address || prev.baseAddress,
                        preferredDistricts: Array.isArray(data.preferredDistricts) && data.preferredDistricts.length > 0
                            ? data.preferredDistricts
                            : prev.preferredDistricts,
                        skills: Array.isArray(data.skills) && data.skills.length > 0
                            ? data.skills.map((s) => (typeof s === "string" ? s : s?.name || String(s)))
                            : typeof data.skills === "string" && data.skills.trim()
                            ? data.skills.split(",").map((s) => s.trim())
                            : prev.skills,
                        verificationStatus: data.verificationStatus || data.status || prev.verificationStatus,
                        licenseNumber: data.licenseNumber || prev.licenseNumber,
                        licenseExpiry: data.licenseExpiry || prev.licenseExpiry,
                    };
                    setDraft(merged);
                    return merged;
                });
            }
        } catch (err) {
            console.warn("Lỗi tải hồ sơ điều dưỡng từ server, giữ thông tin dự phòng:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // ── 55. PUT /api/v1/nurse/profile ──
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                fullName: draft.fullName,
                title: draft.title,
                bio: draft.bio,
                experienceYears: Number(draft.experienceYears),
                serviceRadiusKm: Number(draft.serviceRadiusKm || draft.maxDistanceKm),
                maxDistanceKm: Number(draft.maxDistanceKm || draft.serviceRadiusKm),
                workDistrict: draft.workDistrict,
                baseAddress: draft.baseAddress,
                preferredDistricts: draft.preferredDistricts,
                skills: draft.skills,
            };
            await caregiverApi.updateProfile(payload);
            setProfile({ ...draft });
            setIsEditing(false);
            showToast("✓ Đã cập nhật hồ sơ năng lực và cấu hình nhận việc thành công!");
            await fetchProfile();
        } catch (err) {
            console.error("Lỗi cập nhật hồ sơ điều dưỡng:", err);
            const msg = err?.response?.data?.message || err?.response?.data?.title || "Cập nhật hồ sơ thất bại. Vui lòng kiểm tra lại!";
            showToast(`⚠️ ${msg}`);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setDraft({ ...profile });
        setIsEditing(false);
    };

    const allSkillsList = [
        "Theo dõi & Đo sinh hiệu (HA, Tim, SpO2, Đường huyết)",
        "Chăm sóc phục hồi chức năng sau tai biến",
        "Thay băng, rửa vết thương y tế vô khuẩn",
        "Nhắc và hỗ trợ uống thuốc theo phác đồ",
        "Hỗ trợ vệ sinh, tắm gội tại giường cho người cao tuổi",
        "Xoa bóp, tập co duỗi khớp gối phòng teo cơ",
        "Đặt sonde dạ dày & Chăm sóc ống ăn",
        "Hút đờm dãi & Xông khí dung hô hấp",
        "Cấp cứu hồi sinh tim phổi ban đầu (CPR)",
    ];

    const toggleSkill = (skill) => {
        if (!isEditing) return;
        setDraft((prev) => {
            const exists = prev.skills.includes(skill);
            if (exists) {
                return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
            } else {
                return { ...prev, skills: [...prev.skills, skill] };
            }
        });
    };

    return (
        <div className="p-6 sm:p-10 flex flex-col gap-8 max-w-5xl mx-auto font-sans">
            {/* Toast thông báo */}
            {toastMessage && (
                <div className="fixed top-20 right-6 z-50 bg-[#00677c] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-teal-300/30 text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
                    <svg className="w-5 h-5 text-teal-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {toastMessage}
                </div>
            )}

            {/* Header trang */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200/60">
                            Điều dưỡng chuyên nghiệp
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Chứng chỉ đã xác minh
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002045] mt-1.5 tracking-tight">
                        Hồ sơ năng lực & Cấu hình nhận việc
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Quản lý phần giới thiệu, số năm kinh nghiệm, kỹ năng và bán kính nhận ca tối đa
                    </p>
                </div>

                {!isEditing && (
                    <button
                        type="button"
                        onClick={() => {
                            setDraft({ ...profile });
                            setIsEditing(true);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer self-start sm:self-auto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Chỉnh sửa hồ sơ
                    </button>
                )}
            </header>

            <form onSubmit={handleSave} className="space-y-6">
                {/* ── CARD 1: THÔNG TIN TỔNG QUAN ── */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
                        <div className="relative">
                            <img
                                src={profile.avatar}
                                alt={profile.fullName}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-teal-600/30 shadow-md"
                            />
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => showToast("Đã kích hoạt tải ảnh đại diện mới từ thiết bị.")}
                                    className="absolute -bottom-2 -right-2 p-1.5 bg-[#00677c] text-white rounded-xl shadow-md hover:bg-[#005566] transition-colors"
                                    title="Thay đổi ảnh đại diện"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-[#002045]">{profile.fullName}</h2>
                                <span className="p-1 rounded-full bg-teal-100 text-teal-700" title="Đã xác thực y tế">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-teal-700 mt-0.5">{profile.title}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1 text-amber-500 font-bold">
                                    ★ {profile.rating} <span className="text-slate-400 font-normal">({profile.reviewsCount} đánh giá)</span>
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{profile.completedBookings} ca trực hoàn thành</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{profile.phone}</span>
                            </div>
                        </div>

                        <Link
                            to="/caregiver/verification"
                            className="px-3.5 py-1.5 rounded-xl border border-teal-200 bg-teal-50/50 text-teal-800 text-xs font-semibold hover:bg-teal-100/60 transition-colors inline-flex items-center gap-1.5 shrink-0"
                        >
                            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.18-4.987A2.25 2.25 0 0010.5 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h10.5A2.25 2.25 0 0019.5 17.25V13.5a2.25 2.25 0 00-.663-1.59l-5.324-5.324z" />
                            </svg>
                            Xem chứng chỉ đã nộp
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 text-xs">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Chứng chỉ hành nghề (CCHN):</span>
                            <strong className="text-sm text-[#002045] font-mono mt-0.5 block">{profile.licenseNumber}</strong>
                            <span className="text-[10px] text-slate-500">Hiệu lực đến: {profile.licenseExpiry}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Kinh nghiệm lâm sàng:</span>
                            <strong className="text-sm text-teal-700 font-bold mt-0.5 block">{profile.experienceYears} năm kinh nghiệm</strong>
                            <span className="text-[10px] text-slate-500">Khoa Nội & Phục hồi chức năng</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Bán kính nhận ca tối đa:</span>
                            <strong className="text-sm text-emerald-700 font-bold mt-0.5 block">Trong vòng {profile.maxDistanceKm} km</strong>
                            <span className="text-[10px] text-slate-500">Tính từ trạm thường trú Q. Bình Thạnh</span>
                        </div>
                    </div>
                </div>

                {/* ── CARD 2: GIỚI THIỆU BẢN THÂN (BIO) & KINH NGHIỆM ── */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#002045]">Giới thiệu chuyên môn & Kinh nghiệm</h3>
                            <p className="text-xs text-slate-500">Thông tin xuất hiện trên hồ sơ công khai khi gia đình tìm kiếm điều dưỡng</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Chức danh / Trình độ chuyên môn *</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={isEditing ? draft.title : profile.title}
                                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                                        isEditing
                                            ? "bg-white border-slate-300 focus:border-teal-600 focus:outline-none"
                                            : "bg-slate-50 border-slate-200 text-slate-700"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Số năm kinh nghiệm làm nghề *</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="1"
                                        max="40"
                                        disabled={!isEditing}
                                        value={isEditing ? draft.experienceYears : profile.experienceYears}
                                        onChange={(e) => setDraft({ ...draft, experienceYears: Number(e.target.value) })}
                                        className={`w-32 px-3.5 py-2.5 rounded-xl border text-xs font-bold text-teal-800 ${
                                            isEditing
                                                ? "bg-white border-slate-300 focus:border-teal-600 focus:outline-none"
                                                : "bg-slate-50 border-slate-200 text-slate-700"
                                        }`}
                                    />
                                    <span className="text-slate-500">năm kinh nghiệm thực tế</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Tiểu sử & Triết lý chăm sóc (Bio) *</label>
                            <textarea
                                rows={4}
                                disabled={!isEditing}
                                value={isEditing ? draft.bio : profile.bio}
                                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                                placeholder="Mô tả kinh nghiệm, phương pháp chăm sóc và điểm mạnh của bạn..."
                                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed ${
                                    isEditing
                                        ? "bg-white border-slate-300 focus:border-teal-600 focus:outline-none"
                                        : "bg-slate-50 border-slate-200 text-slate-700"
                                }`}
                            />
                        </div>

                        {/* Danh sách Kỹ năng chuyên môn */}
                        <div>
                            <label className="block text-slate-700 font-semibold mb-2">
                                Kỹ năng y tế & Chuyên môn kỹ thuật
                                {isEditing && <span className="text-slate-400 font-normal ml-1">(Bấm để chọn/bỏ chọn)</span>}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {(isEditing ? allSkillsList : profile.skills).map((skill) => {
                                    const active = isEditing
                                        ? draft.skills.includes(skill)
                                        : profile.skills.includes(skill);
                                    return (
                                        <button
                                            key={skill}
                                            type="button"
                                            disabled={!isEditing}
                                            onClick={() => toggleSkill(skill)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                                active
                                                    ? "bg-teal-50 border border-teal-300 text-teal-800 shadow-2xs font-semibold"
                                                    : "bg-slate-100 text-slate-400 border border-transparent hover:bg-slate-200"
                                            }`}
                                        >
                                            {active ? "✓ " : "+ "}{skill}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CARD 3: CẤU HÌNH BÁN KÍNH & KHU VỰC NHẬN CA (HAIVERSINE MATCHING) ── */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#002045]">Khu vực hoạt động & Bán kính nhận ca</h3>
                            <p className="text-xs text-slate-500">Hệ thống sẽ lọc và ưu tiên các ca chăm sóc trong phạm vi bán kính này</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                        {/* CỘT TRÁI (MD: 7): ĐỊA CHỈ XUẤT PHÁT & QUẬN ƯU TIÊN */}
                        <div className="md:col-span-7 bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-teal-100/70 text-teal-800 flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </div>
                                    <label className="text-slate-800 font-bold text-xs">
                                        Địa chỉ thường trú / Điểm xuất phát *
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={isEditing ? draft.baseAddress : profile.baseAddress}
                                    onChange={(e) => setDraft({ ...draft, baseAddress: e.target.value })}
                                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed ${
                                        isEditing
                                            ? "bg-white border-slate-300 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15"
                                            : "bg-white/80 border-slate-200/90 text-slate-700 font-medium shadow-2xs"
                                    }`}
                                />
                                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                    Khoảng cách tới nhà khách hàng sẽ được tính toán tự động dựa trên địa chỉ này.
                                </p>
                            </div>

                            {/* Các quận / huyện ưu tiên */}
                            <div className="pt-3 border-t border-slate-200/60">
                                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-2">
                                    Quận / Huyện ưu tiên nhận ca:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {profile.preferredDistricts.map((d) => (
                                        <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-slate-700 text-[11px] font-medium shadow-2xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI (MD: 5): BÁN KÍNH NHẬN CA VÀ ƯỚC TÍNH */}
                        <div className="md:col-span-5 bg-gradient-to-br from-teal-50/50 via-white to-slate-50 rounded-2xl border border-teal-100/90 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                                        Phạm vi nhận ca:
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#00677c] to-[#008ba3] text-white font-extrabold text-xs shadow-xs">
                                        Bán kính {isEditing ? draft.maxDistanceKm : profile.maxDistanceKm} km
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-white/90 border border-teal-100/80 shadow-2xs space-y-1.5">
                                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                                        <span>Ước tính di chuyển:</span>
                                        <strong className="text-teal-800 font-bold">
                                            ~{Math.round((isEditing ? draft.maxDistanceKm : profile.maxDistanceKm) * 2.2)} phút (xe máy)
                                        </strong>
                                    </div>
                                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                                        <span>Phạm vi phù hợp:</span>
                                        <span className="text-emerald-700 font-semibold">
                                            {(isEditing ? draft.maxDistanceKm : profile.maxDistanceKm) <= 5
                                                ? "Cực nhanh · Cùng phường / quận"
                                                : (isEditing ? draft.maxDistanceKm : profile.maxDistanceKm) <= 12
                                                ? "Lý tưởng · Nội thành TP.HCM"
                                                : "Mở rộng · Khu vực lân cận"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="space-y-3 pt-1">
                                    <div className="space-y-1.5">
                                        <input
                                            type="range"
                                            min="3"
                                            max="25"
                                            step="1"
                                            value={draft.maxDistanceKm}
                                            onChange={(e) => {
                                                const km = Number(e.target.value);
                                                setDraft({ ...draft, maxDistanceKm: km, serviceRadiusKm: km });
                                            }}
                                            className="w-full accent-[#00677c] cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                                            <span>3 km (Gần)</span>
                                            <span>10 km (Chuẩn)</span>
                                            <span>25 km (Rộng)</span>
                                        </div>
                                    </div>

                                    {/* Nút chọn nhanh */}
                                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                                        {[5, 10, 15, 20].map((km) => (
                                            <button
                                                key={km}
                                                type="button"
                                                onClick={() => setDraft({ ...draft, maxDistanceKm: km, serviceRadiusKm: km })}
                                                className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                                    draft.maxDistanceKm === km
                                                        ? "bg-[#00677c] border-[#00677c] text-white shadow-2xs"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                                                }`}
                                            >
                                                {km} km
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-1">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                                            <span>Điểm xuất phát</span>
                                            <span>Tối đa 25 km</span>
                                        </div>
                                        <div className="w-full h-2.5 rounded-full bg-slate-200/90 overflow-hidden relative">
                                            <div
                                                className="h-full bg-gradient-to-r from-teal-400 via-[#008ba3] to-[#00677c] rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(100, Math.max(12, (profile.maxDistanceKm / 25) * 100))}%` }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400 text-center mt-2.5">
                                        Nhấn <strong className="text-teal-700 font-semibold">Chỉnh sửa hồ sơ</strong> để điều chỉnh bán kính.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nút lưu thay đổi */}
                {isEditing && (
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-60 inline-flex items-center gap-2"
                        >
                            {saving && (
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                            )}
                            {saving ? "Đang lưu thay đổi..." : "Lưu thay đổi hồ sơ"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
