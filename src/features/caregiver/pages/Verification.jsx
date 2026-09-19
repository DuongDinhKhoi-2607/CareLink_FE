import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import VerificationStepper from "../components/VerificationStepper";
import DocumentUpload from "../components/DocumentUpload";

/* ─── Shared input components ─── */
const Field = ({ label, required, type = "text", placeholder, name, value, onChange, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children ?? (
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#102030] placeholder-slate-300 focus:outline-none focus:border-[#00677c] focus:ring-2 focus:ring-[#00677c15] transition-all"
            />
        )}
    </div>
);

const Select = ({ label, required, name, value, onChange, options }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#102030] focus:outline-none focus:border-[#00677c] focus:ring-2 focus:ring-[#00677c15] transition-all"
        >
            {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    </div>
);

/* Simple upload box (CCCD style) */
const UploadBox = ({ label, onFile }) => {
    const [file, setFile] = useState(null);
    const ref = React.useRef();
    const handle = (f) => { if (!f) return; setFile(f); onFile?.(f); };
    return (
        <div
            onClick={() => ref.current?.click()}
            className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-[#00677c60] hover:bg-[#f0f9fb] cursor-pointer transition-all group min-h-[120px]"
        >
            {file ? (
                <div className="flex flex-col items-center gap-1">
                    <svg className="w-8 h-8 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-semibold text-[#00677c] text-center truncate max-w-[120px]">{file.name}</span>
                </div>
            ) : (
                <>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#dceef4] flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-[#00677c] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                    </div>
                    <p className="text-xs font-medium text-slate-400 text-center">{label}</p>
                </>
            )}
            <input ref={ref} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handle(e.target.files[0])} />
        </div>
    );
};

/* Simple row upload (Student card / Certificate style) */
const RowUpload = ({ label, hint, required, onFile }) => {
    const [file, setFile] = useState(null);
    const ref = React.useRef();
    const handle = (f) => { if (!f) return; setFile(f); onFile?.(f); };
    return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-[#00677c40] transition-all">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#e8f4f8] flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5 text-[#00677c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#102030] truncate">
                        {file ? file.name : label}
                        {required && !file && <span className="text-red-400 ml-1">*</span>}
                    </p>
                    <p className="text-xs text-slate-400">{file ? "Đã tải lên" : (hint || "Định dạng: JPG, PNG, PDF · Tối đa 10MB")}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {!file && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-400 border border-red-100">
                        Chưa tải lên
                    </span>
                )}
                <button
                    type="button"
                    onClick={() => ref.current?.click()}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        file
                            ? "bg-[#00677c]/10 text-[#00677c]"
                            : "bg-[#102030] text-white hover:bg-[#00677c]"
                    }`}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    {file ? "Thay đổi" : "Tải lên"}
                </button>
            </div>
            <input ref={ref} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handle(e.target.files[0])} />
        </div>
    );
};

/* Section header */
const SectionHeader = ({ title, optional }) => (
    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <h2 className="text-xs font-black text-[#102030] uppercase tracking-widest">{title}</h2>
        {optional && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">
                {optional}
            </span>
        )}
    </div>
);

/* ─── Interview Waiting Screen ─── */
function InterviewWaiting({ role, steps }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f8fa] px-4 py-16">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 sm:p-14 flex flex-col items-center gap-7 text-center max-w-lg w-full">
                {/* Success icon */}
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[#00677c]/10 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#00677c] flex items-center justify-center shadow-lg shadow-[#00677c]/30">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102030]">
                        Hồ sơ đã được gửi!
                    </h1>
                    <p className="text-base text-slate-500 leading-relaxed">
                        Đội ngũ CareLink sẽ xem xét và xác thực hồ sơ của bạn trong vòng <strong className="text-[#102030]">24–48 giờ làm việc</strong>. Sau đó, chúng tôi sẽ liên hệ để sắp xếp buổi phỏng vấn ngắn.
                    </p>
                </div>

                {/* Progress steps */}
                <div className="w-full flex flex-col gap-2.5">
                    {[
                        { label: "Nộp hồ sơ xác minh", done: true },
                        { label: "CareLink xét duyệt hồ sơ", done: false, active: true },
                        { label: "Phỏng vấn trực tuyến", done: false },
                        { label: "Kích hoạt tài khoản", done: false },
                    ].map((s) => (
                        <div key={s.label} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                            s.done ? "bg-[#e8f4f8]" : s.active ? "bg-amber-50 border border-amber-200" : "bg-slate-50"
                        }`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                s.done ? "bg-[#00677c]" : s.active ? "bg-amber-400" : "bg-slate-200"
                            }`}>
                                {s.done ? (
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </span>
                            <span className={`font-medium ${
                                s.done ? "text-[#00677c]" : s.active ? "text-amber-700" : "text-slate-400"
                            }`}>{s.label}</span>
                            {s.active && (
                                <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                    Đang xử lý
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Link
                        to="/"
                        className="w-full py-3.5 bg-[#102030] text-white rounded-xl font-semibold text-sm text-center hover:bg-[#00677c] transition-all hover:-translate-y-0.5"
                    >
                        Về trang chủ
                    </Link>
                    <p className="text-xs text-slate-400">
                        Câu hỏi? Gọi <span className="font-bold text-[#102030]">1900 1234</span> (Miễn phí · T2–T7 · 8:00–20:00)
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Verification Page ─── */
export default function Verification() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role") || "student";
    const isStudent = role === "student";

    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "", dob: "", gender: "Nam", phone: "", email: "", address: "",
    });
    const [eduData, setEduData] = useState({
        university: "", major: "", year: "1", studentId: "",
        licenseNumber: "", licenseDate: "", licenseIssuer: "", hospital: "", department: "", experience: "",
    });
    const [selectedSkills, setSelectedSkills] = useState([]);

    const handleFormChange = (e) => {
        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    };
    const handleEduChange = (e) => {
        setEduData((p) => ({ ...p, [e.target.name]: e.target.value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* Stepper config */
    const studentSteps = [
        { label: "Thông tin cá nhân" },
        { label: "Xác minh danh tính" },
        { label: "Thẻ sinh viên" },
        { label: "Thông tin học tập" },
        { label: "Gửi xác minh" },
        { label: "Chờ phỏng vấn" },
    ];
    const nurseSteps = [
        { label: "Thông tin cá nhân" },
        { label: "Xác minh danh tính" },
        { label: "Thông tin nghề nghiệp" },
        { label: "Tài liệu" },
        { label: "Gửi xác minh" },
        { label: "Chờ phỏng vấn" },
    ];
    const steps = isStudent ? studentSteps : nurseSteps;

    /* Notes sidebar */
    const sidebarNotes = isStudent
        ? [
            "Chỉ chấp nhận thẻ sinh viên còn hiệu lực",
            "Hồ sơ được duyệt trong 24–48 giờ",
            "Dữ liệu được mã hóa và bảo mật",
        ]
        : [
            "Chứng chỉ hành nghề phải còn hiệu lực",
            "Hồ sơ được duyệt trong 24–48 giờ",
            "Dữ liệu được mã hóa và bảo mật",
        ];

    if (submitted) {
        return <InterviewWaiting role={role} steps={steps} />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f4f8fa]">

            {/* ══ HEADER ══ */}
            <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00677c] to-[#102030] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-[#102030] tracking-tight">
                            Care<span className="text-[#00677c]">Link</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {[
                            { label: "Tìm người chăm sóc", to: "/caregivers" },
                            { label: "Dành cho Gia đình", to: "/family" },
                            { label: "Dành cho Người chăm sóc", to: "/caregiver", active: true },
                            { label: "Tài nguyên", to: "#" },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    item.active
                                        ? "text-[#00677c] font-semibold"
                                        : "text-slate-600 hover:text-[#00677c] hover:bg-slate-100/70"
                                }`}
                            >
                                {item.active && (
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00677c] mr-1.5 align-middle" />
                                )}
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            id="btn-register-job"
                            className="px-5 py-2.5 bg-[#102030] text-white text-sm font-semibold rounded-xl hover:bg-[#1a3248] transition-all hover:-translate-y-0.5 shadow-sm"
                        >
                            Đăng ký việc làm
                        </button>
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {/* ══ PAGE TITLE + STEPPER ══ */}
            <div className="w-full bg-white border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102030]">
                            {isStudent
                                ? "Xác thực Sinh viên Y / Điều dưỡng"
                                : "Xác thực Điều dưỡng Hành nghề"}
                        </h1>
                        <p className="text-sm text-slate-500">
                            Hoàn tất xác thực để bắt đầu nhận các yêu cầu chăm sóc từ gia đình.
                        </p>
                    </div>
                    <VerificationStepper currentStep={1} steps={steps} />
                </div>
            </div>

            {/* ══ MAIN CONTENT ══ */}
            <div className="flex-1 w-full py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col lg:flex-row gap-6 items-start">

                            {/* ── Left: form ── */}
                            <div className="flex-1 flex flex-col gap-5 min-w-0">

                                {/* ─ 1. THÔNG TIN CÁ NHÂN ─ */}
                                <div id="section-personal" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                                    <SectionHeader title="Thông tin cá nhân" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field label="Họ và tên" required name="fullName" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={handleFormChange} />
                                        <Field label="Ngày sinh" required type="date" name="dob" value={formData.dob} onChange={handleFormChange} />
                                        <Select
                                            label="Giới tính" required name="gender" value={formData.gender} onChange={handleFormChange}
                                            options={[{ value: "Nam", label: "Nam" }, { value: "Nữ", label: "Nữ" }, { value: "Khác", label: "Khác" }]}
                                        />
                                        <Field label="Số điện thoại" required type="tel" name="phone" placeholder="090..." value={formData.phone} onChange={handleFormChange} />
                                        <Field label="Email" required type="email" name="email" placeholder="email@example.com" value={formData.email} onChange={handleFormChange} />
                                        <Field label="Địa chỉ hiện tại" name="address" placeholder="Số nhà, tên đường..." value={formData.address} onChange={handleFormChange} />
                                    </div>
                                </div>

                                {/* ─ 2. XÁC MINH DANH TÍNH ─ */}
                                <div id="section-identity" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                                    <SectionHeader title="Xác minh danh tính" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <UploadBox label="CCCD mặt trước" />
                                        <UploadBox label="CCCD mặt sau" />
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Ảnh chụp rõ nét, đủ sáng · Định dạng JPG, PNG · Tối đa 5MB mỗi ảnh
                                    </p>
                                </div>

                                {/* ─ 3a. THẺ SINH VIÊN (student) ─ */}
                                {isStudent && (
                                    <div id="section-student-card" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                                        <SectionHeader title="Thẻ sinh viên" />
                                        <RowUpload label="Upload ảnh thẻ sinh viên" hint="Đảm bảo rõ nét thông tin" required />
                                    </div>
                                )}

                                {/* ─ 3b. THÔNG TIN NGHỀ NGHIỆP (nurse) ─ */}
                                {!isStudent && (
                                    <div id="section-license" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                                        <SectionHeader title="Thông tin nghề nghiệp" />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field label="Số chứng chỉ hành nghề" required name="licenseNumber" placeholder="VD: 12345/ĐD-HN" value={eduData.licenseNumber} onChange={handleEduChange} />
                                            <Field label="Ngày cấp" required type="date" name="licenseDate" value={eduData.licenseDate} onChange={handleEduChange} />
                                            <Field label="Nơi cấp" required name="licenseIssuer" placeholder="VD: Sở Y tế TP.HCM" value={eduData.licenseIssuer} onChange={handleEduChange} />
                                            <Field label="Cơ sở y tế đang công tác" required name="hospital" placeholder="VD: Bệnh viện Bạch Mai" value={eduData.hospital} onChange={handleEduChange} />
                                            <Field label="Chức vụ / Khoa" name="department" placeholder="VD: Điều dưỡng - Khoa Nội" value={eduData.department} onChange={handleEduChange} />
                                            <Select
                                                label="Số năm kinh nghiệm" required name="experience" value={eduData.experience} onChange={handleEduChange}
                                                options={[
                                                    { value: "", label: "Chọn kinh nghiệm" },
                                                    { value: "< 1", label: "Dưới 1 năm" },
                                                    { value: "1-3", label: "1 – 3 năm" },
                                                    { value: "3-5", label: "3 – 5 năm" },
                                                    { value: "5-10", label: "5 – 10 năm" },
                                                    { value: "10+", label: "Trên 10 năm" },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* ─ 4a. THÔNG TIN HỌC TẬP (student) ─ */}
                                {isStudent && (
                                    <div id="section-education" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                                        <SectionHeader title="Thông tin học tập" />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field label="Trường Đại học" required name="university" placeholder="VD: Đại học Y Hà Nội" value={eduData.university} onChange={handleEduChange} />
                                            <Field label="Ngành học" required name="major" placeholder="VD: Điều dưỡng đa khoa" value={eduData.major} onChange={handleEduChange} />
                                            <Select
                                                label="Năm học" required name="year" value={eduData.year} onChange={handleEduChange}
                                                options={[
                                                    { value: "1", label: "Năm 1" },
                                                    { value: "2", label: "Năm 2" },
                                                    { value: "3", label: "Năm 3" },
                                                    { value: "4", label: "Năm 4" },
                                                ]}
                                            />
                                            <Field label="MSSV" required name="studentId" placeholder="VD: B21-00123" value={eduData.studentId} onChange={handleEduChange} />
                                        </div>
                                    </div>
                                )}

                                {/* ─ 4b. TÀI LIỆU HÀNH NGHỀ (nurse) ─ */}
                                {!isStudent && (
                                    <div id="section-nurse-docs" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                                        <SectionHeader title="Tài liệu hành nghề" />
                                        <div className="flex flex-col gap-3">
                                            <RowUpload label="Chứng chỉ hành nghề" hint="Ảnh chụp hoặc scan rõ nét" required />
                                            <RowUpload label="Bằng tốt nghiệp" hint="Ảnh chụp hoặc scan" required />
                                        </div>
                                    </div>
                                )}

                                {/* ─ 5. CHUYÊN MÔN & KỸ NĂNG ─ */}
                                <div id="section-skills" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                                    <div className="flex items-center justify-between">
                                        <SectionHeader title="Chuyên môn & Kỹ năng" />
                                        {selectedSkills.length > 0 && (
                                            <span className="text-xs font-bold text-[#00677c] bg-[#e8f4f8] px-2.5 py-1 rounded-full">
                                                Đã chọn: {selectedSkills.length}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 -mt-2">
                                        Chọn các kỹ năng bạn có thể thực hiện — sẽ hiển thị trên hồ sơ để gia đình tìm đúng được bạn.
                                    </p>
                                    <div className="flex flex-wrap gap-2.5">
                                        {[
                                            { id: "tiem-truyen", label: "💉 Tiêm truyền" },
                                            { id: "thay-bang", label: "🩹 Thay băng" },
                                            { id: "do-sinh-hieu", label: "💓 Đo sinh hiệu" },
                                            { id: "cham-soc-vet-thuong", label: "🧤 Chăm sóc vết thương" },
                                            { id: "quan-ly-thuoc", label: "💊 Quản lý thuốc" },
                                            { id: "vat-ly-tri-lieu", label: "🧘 Vật lý trị liệu" },
                                            { id: "cham-soc-nguoi-cao-tuoi", label: "👴 Người cao tuổi" },
                                            { id: "ho-tro-ho-hap", label: "🤫 Hỗ trợ hô hấp" },
                                            { id: "cham-soc-sau-phau-thuat", label: "🏥 Sau phẫu thuật" },
                                            { id: "cat-chi", label: "✂️ Cắt chỉ" },
                                            { id: "dieu-duong-toan-dien", label: "♥️ Điều dưỡng toàn diện" },
                                            { id: "tro-giup-an-uong", label: "🍽️ Hỗ trợ ăn uống" },
                                        ].map((skill) => {
                                            const active = selectedSkills.includes(skill.id);
                                            return (
                                                <button
                                                    key={skill.id}
                                                    type="button"
                                                    id={`skill-${skill.id}`}
                                                    onClick={() =>
                                                        setSelectedSkills((prev) =>
                                                            active
                                                                ? prev.filter((s) => s !== skill.id)
                                                                : [...prev, skill.id]
                                                        )
                                                    }
                                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:-translate-y-0.5 ${
                                                        active
                                                            ? "bg-[#102030] text-white border-[#102030] shadow-md"
                                                            : "bg-white text-slate-600 border-slate-200 hover:border-[#00677c] hover:text-[#00677c]"
                                                    }`}
                                                >
                                                    {skill.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {selectedSkills.length === 0 && (
                                        <p className="text-xs text-amber-500 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                            </svg>
                                            Vui lòng chọn ít nhất 1 kỹ năng
                                        </p>
                                    )}
                                </div>

                                {/* ─ 6. CHỨNG CHỈ TỰ CHỌN ─ */}
                                <div id="section-certs" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                                    <SectionHeader title="Chứng chỉ tự chọn" optional="Không bắt buộc" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <RowUpload label="Chứng chỉ sơ cứu" hint="Nếu có" />
                                        <RowUpload label="Chứng chỉ ACLS/BLS" hint="Nếu có" />
                                    </div>
                                </div>

                                {/* ─ 6. GIẤY XÁC NHẬN (student only) ─ */}
                                {isStudent && (
                                    <div id="section-enrollment" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
                                        <SectionHeader title="Giấy xác nhận đang theo học" optional="Khuyến khích" />
                                        <RowUpload label="Tải lên giấy xác nhận" hint="Định dạng chấp nhận: PDF, JPG, PNG" />
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Nếu có, CareLink sẽ hiển thị huy hiệu "Đã xác nhận trường học" trên hồ sơ của bạn để tăng mức độ tin cậy với gia đình.
                                        </p>
                                    </div>
                                )}

                                {/* ─ SUBMIT ─ */}
                                <button
                                    id="btn-submit-verification"
                                    type="submit"
                                    className="w-full py-4 bg-[#102030] text-white rounded-2xl font-bold text-base hover:bg-[#00677c] transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-[#00677c]/30 hover:shadow-xl flex items-center justify-center gap-3 group"
                                >
                                    Gửi hồ sơ xác minh
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>

                                <p className="text-center text-xs text-slate-400 pb-4">
                                    Bằng cách gửi hồ sơ, bạn đồng ý với{" "}
                                    <a href="#" className="text-[#00677c] font-semibold hover:underline">Điều khoản dịch vụ</a>{" "}
                                    và{" "}
                                    <a href="#" className="text-[#00677c] font-semibold hover:underline">Chính sách bảo mật</a>{" "}
                                    của CareLink.
                                </p>
                            </div>

                            {/* ── Right: sticky sidebar ── */}
                            <aside className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 lg:sticky lg:top-[88px]">

                                {/* Notes */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-bold text-[#102030]">Lưu ý</span>
                                    </div>
                                    <ul className="flex flex-col gap-2.5">
                                        {sidebarNotes.map((note) => (
                                            <li key={note} className="flex items-start gap-2 text-sm text-slate-500">
                                                <svg className="w-4 h-4 text-[#00677c] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                {note}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Quote card */}
                                <div className="relative rounded-2xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1576765608622-067973a79f53?auto=format&fit=crop&q=80&w=400"
                                        alt="Caregiver with patient"
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#102030]/95 via-[#102030]/50 to-transparent flex flex-col justify-end p-4">
                                        <p className="text-xs text-white/90 italic leading-relaxed">
                                            "Gia đình cảm thấy yên tâm hơn rất nhiều khi biết người chăm sóc đã được đội ngũ y tế xác thực."
                                        </p>
                                        <p className="text-xs text-[#4dd6e8] font-semibold mt-1">— Chị Lan, Hà Nội</p>
                                    </div>
                                </div>

                                {/* Quick nav */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Điều hướng nhanh</p>
                                    {[
                                        { label: "Thông tin cá nhân", href: "#section-personal" },
                                        { label: "Xác minh danh tính", href: "#section-identity" },
                                        isStudent
                                            ? { label: "Thẻ sinh viên", href: "#section-student-card" }
                                            : { label: "Thông tin nghề nghiệp", href: "#section-license" },
                                        isStudent
                                            ? { label: "Thông tin học tập", href: "#section-education" }
                                            : { label: "Tài liệu hành nghề", href: "#section-nurse-docs" },
                                        { label: "Chứng chỉ bổ sung", href: "#section-certs" },
                                        isStudent
                                            ? { label: "Giấy xác nhận học", href: "#section-enrollment" }
                                            : null,
                                    ].filter(Boolean).map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            className="text-sm text-slate-500 hover:text-[#00677c] hover:translate-x-1 transition-all flex items-center gap-1.5 group"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-[#00677c] transition-colors" />
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </aside>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
