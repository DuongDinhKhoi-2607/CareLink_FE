import React from "react";

const InputField = ({ label, required, type = "text", placeholder, value, onChange, name }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#102030]">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#102030] placeholder-slate-400 focus:outline-none focus:border-[#00677c] focus:ring-2 focus:ring-[#00677c15] transition-all"
        />
    </div>
);

/* Nursing Student form fields */
function StudentForm({ data, onChange }) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-bold text-blue-800">Sinh viên Điều dưỡng</p>
                    <p className="text-xs text-blue-600">Điền thông tin về trường và năm học của bạn</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Tên trường đại học / cao đẳng" required name="university" placeholder="VD: Đại học Y Hà Nội" value={data.university || ""} onChange={onChange} />
                <InputField label="Mã số sinh viên" required name="studentId" placeholder="VD: B21-00123" value={data.studentId || ""} onChange={onChange} />
                <InputField label="Ngành học" required name="major" placeholder="VD: Điều dưỡng đa khoa" value={data.major || ""} onChange={onChange} />
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#102030]">Năm học hiện tại <span className="text-red-500">*</span></label>
                    <select
                        name="year"
                        value={data.year || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#102030] focus:outline-none focus:border-[#00677c] focus:ring-2 focus:ring-[#00677c15] transition-all"
                    >
                        <option value="">Chọn năm học</option>
                        <option value="1">Năm 1</option>
                        <option value="2">Năm 2</option>
                        <option value="3">Năm 3</option>
                        <option value="4">Năm 4</option>
                    </select>
                </div>
                <InputField label="Năm tốt nghiệp dự kiến" name="graduationYear" placeholder="VD: 2026" value={data.graduationYear || ""} onChange={onChange} />
                <InputField label="GPA hiện tại (nếu có)" name="gpa" placeholder="VD: 3.5 / 4.0" value={data.gpa || ""} onChange={onChange} />
            </div>

            <InputField label="Kinh nghiệm thực tập (nếu có)" name="internship" placeholder="Mô tả ngắn về nơi bạn đã thực tập..." value={data.internship || ""} onChange={onChange} />
        </div>
    );
}

/* Practicing Nurse form fields */
function NurseForm({ data, onChange }) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="w-8 h-8 rounded-lg bg-[#00677c] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-bold text-emerald-800">Điều dưỡng hành nghề</p>
                    <p className="text-xs text-emerald-600">Điền thông tin chứng chỉ và kinh nghiệm hành nghề</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Số chứng chỉ hành nghề" required name="licenseNumber" placeholder="VD: 12345/ĐD-HN" value={data.licenseNumber || ""} onChange={onChange} />
                <InputField label="Ngày cấp chứng chỉ" required type="date" name="licenseDate" value={data.licenseDate || ""} onChange={onChange} />
                <InputField label="Nơi cấp" required name="licenseIssuer" placeholder="VD: Sở Y tế TP.HCM" value={data.licenseIssuer || ""} onChange={onChange} />
                <InputField label="Ngày hết hạn" type="date" name="licenseExpiry" value={data.licenseExpiry || ""} onChange={onChange} />
                <InputField label="Cơ sở y tế đang công tác" required name="hospital" placeholder="VD: Bệnh viện Bạch Mai" value={data.hospital || ""} onChange={onChange} />
                <InputField label="Chức vụ / Khoa" required name="department" placeholder="VD: Điều dưỡng - Khoa Nội" value={data.department || ""} onChange={onChange} />
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#102030]">Số năm kinh nghiệm <span className="text-red-500">*</span></label>
                    <select
                        name="experience"
                        value={data.experience || ""}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#102030] focus:outline-none focus:border-[#00677c] focus:ring-2 focus:ring-[#00677c15] transition-all"
                    >
                        <option value="">Chọn kinh nghiệm</option>
                        <option value="1">Dưới 1 năm</option>
                        <option value="1-3">1 – 3 năm</option>
                        <option value="3-5">3 – 5 năm</option>
                        <option value="5-10">5 – 10 năm</option>
                        <option value="10+">Trên 10 năm</option>
                    </select>
                </div>
                <InputField label="Chuyên khoa (nếu có)" name="specialty" placeholder="VD: Tim mạch, Thần kinh..." value={data.specialty || ""} onChange={onChange} />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#102030]">Kỹ năng chuyên biệt</label>
                <textarea
                    name="skills"
                    rows={3}
                    placeholder="Liệt kê các kỹ năng chuyên biệt: chăm sóc người cao tuổi, hỗ trợ hô hấp, quản lý thuốc..."
                    value={data.skills || ""}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#102030] placeholder-slate-400 focus:outline-none focus:border-[#00677c] focus:ring-2 focus:ring-[#00677c15] transition-all resize-none"
                />
            </div>
        </div>
    );
}

export default function EducationForm({ role, data, onChange }) {
    if (!role) {
        return (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <p className="text-sm text-slate-500">Vui lòng chọn vai trò trước khi điền thông tin</p>
            </div>
        );
    }

    return role === "student" ? (
        <StudentForm data={data} onChange={onChange} />
    ) : (
        <NurseForm data={data} onChange={onChange} />
    );
}
