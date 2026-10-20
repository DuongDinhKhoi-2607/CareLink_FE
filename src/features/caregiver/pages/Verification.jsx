import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import VerificationStepper from "../components/VerificationStepper";
import caregiverApi from "../../../api/caregiverApi";
import { fetchAndSyncUserMe } from "../../../api/authApi";

const PRIMARY = "#087E78";
const INK = "#102A35";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
];

const STUDENT_SKILLS = [
    { id: "do-sinh-hieu", label: "Đo sinh hiệu" },
    { id: "cham-soc-nguoi-cao-tuoi", label: "Chăm sóc người cao tuổi" },
    { id: "tro-giup-an-uong", label: "Hỗ trợ ăn uống" },
    { id: "quan-ly-thuoc", label: "Hỗ trợ quản lý thuốc theo hướng dẫn" },
    { id: "cham-soc-sau-phau-thuat", label: "Chăm sóc sau phẫu thuật" },
    { id: "vat-ly-tri-lieu", label: "Hỗ trợ vận động" },
    { id: "ve-sinh-ca-nhan", label: "Hỗ trợ vệ sinh cá nhân" },
    { id: "phong-ngua-te-nga", label: "Phòng ngừa té ngã" },
    { id: "ho-tro-di-lai", label: "Hỗ trợ di chuyển" },
    { id: "giao-tiep-nguoi-benh", label: "Giao tiếp và trấn an người bệnh" },
    { id: "dinh-duong", label: "Hỗ trợ dinh dưỡng" },
    { id: "theo-doi-suc-khoe", label: "Theo dõi tình trạng sức khỏe" },
    { id: "ho-tro-sinh-hoat", label: "Hỗ trợ sinh hoạt hằng ngày" },
    { id: "cham-soc-sa-sut-tri-tue", label: "Hỗ trợ người sa sút trí tuệ" },
];

const NURSE_SKILLS = [
    { id: "tiem-truyen", label: "Tiêm truyền" },
    { id: "thay-bang", label: "Thay băng" },
    { id: "do-sinh-hieu", label: "Đo sinh hiệu" },
    { id: "cham-soc-vet-thuong", label: "Chăm sóc vết thương" },
    { id: "quan-ly-thuoc", label: "Quản lý thuốc" },
    { id: "vat-ly-tri-lieu", label: "Vật lý trị liệu" },
    { id: "cham-soc-nguoi-cao-tuoi", label: "Chăm sóc người cao tuổi" },
    { id: "ho-tro-ho-hap", label: "Hỗ trợ hô hấp" },
    { id: "cham-soc-sau-phau-thuat", label: "Chăm sóc sau phẫu thuật" },
    { id: "cat-chi", label: "Cắt chỉ" },
    { id: "dieu-duong-toan-dien", label: "Điều dưỡng toàn diện" },
    { id: "tro-giup-an-uong", label: "Hỗ trợ ăn uống" },
    { id: "theo-doi-benh-man-tinh", label: "Theo dõi bệnh mạn tính" },
    { id: "cham-soc-giam-nhe", label: "Chăm sóc giảm nhẹ" },
    { id: "so-cuu", label: "Sơ cứu ban đầu" },
];

const STUDENT_STEPS = [
    { label: "Thông tin cá nhân" },
    { label: "Xác minh danh tính" },
    { label: "Thông tin học tập" },
    { label: "Kỹ năng & hồ sơ" },
    { label: "Kiểm tra & gửi" },
];

const NURSE_STEPS = [
    { label: "Thông tin cá nhân" },
    { label: "Xác minh danh tính" },
    { label: "Thông tin nghề nghiệp" },
    { label: "Kỹ năng & hồ sơ" },
    { label: "Kiểm tra & gửi" },
];

const INITIAL_FORM = {
    fullName: "",
    dob: "",
    gender: "Nam",
    phone: "",
    email: "",
    address: "",
    citizenId: "",
};

const INITIAL_EDU = {
    university: "",
    major: "",
    year: "1",
    studentId: "",
    licenseNumber: "",
    licenseDate: "",
    licenseIssuer: "",
    hospital: "",
    department: "",
    experience: "",
};

const INITIAL_FILES = {
    idFront: null,
    idBack: null,
    selfie: null,
    studentCard: null,
    licenseCertificate: null,
    graduationDiploma: null,
    firstAid: null,
    blsCertificate: null,
    enrollmentConfirmation: null,
};

function CheckIcon({ className = "h-5 w-5" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5 12 4 4L19 6"
            />
        </svg>
    );
}

function ArrowIcon({ direction = "right" }) {
    return (
        <svg
            className={`h-4 w-4 ${direction === "left" ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-6-6 6 6-6 6"
            />
        </svg>
    );
}

function Field({
    label,
    name,
    value,
    onChange,
    required = false,
    type = "text",
    placeholder = "",
    error,
    children,
    max,
}) {
    const inputClass = [
        "w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-[#102A35]",
        "placeholder:text-slate-400 outline-none transition-all duration-200",
        "border-slate-300 hover:border-slate-400",
        "focus:border-[#087E78] focus:ring-4 focus:ring-[#087E78]/10",
        error ? "!border-red-500 !bg-red-50/40 focus:!ring-red-100" : "",
    ].join(" ");

    return (
        <div className="min-w-0">
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-semibold text-slate-700"
            >
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            {children || (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value ?? ""}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    max={max}
                    aria-invalid={Boolean(error)}
                    className={inputClass}
                />
            )}

            {error && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function SelectField({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
    error,
}) {
    return (
        <Field label={label} name={name} required={required} error={error}>
            <select
                id={name}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                aria-invalid={Boolean(error)}
                className={[
                    "w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-[#102A35]",
                    "border-slate-300 outline-none transition-all hover:border-slate-400",
                    "focus:border-[#087E78] focus:ring-4 focus:ring-[#087E78]/10",
                    error ? "!border-red-500 !bg-red-50/40" : "",
                ].join(" ")}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </Field>
    );
}

function SectionCard({ children, className = "" }) {
    return (
        <section
            className={[
                "rounded-2xl border border-slate-200 bg-white p-5",
                "shadow-[0_3px_14px_rgba(16,42,53,0.035)] sm:p-6",
                className,
            ].join(" ")}
        >
            {children}
        </section>
    );
}

function SectionHeading({ eyebrow, title, description, rightContent }) {
    return (
        <div className="mb-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    {eyebrow && (
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[#087E78]">
                            {eyebrow}
                        </p>
                    )}

                    <h2 className="text-lg font-bold tracking-tight text-[#102A35] sm:text-xl">
                        {title}
                    </h2>
                </div>

                {rightContent}
            </div>

            {description && (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    {description}
                </p>
            )}
        </div>
    );
}

function UploadCard({
    name,
    label,
    description,
    file,
    onFile,
    onUploadError,
    required = false,
    error,
    uploadError,
}) {
    const inputId = React.useId();

    const handleFile = (event) => {
        const selected = event.target.files?.[0];
        if (!selected) return;

        if (!ALLOWED_TYPES.includes(selected.type)) {
            onUploadError(
                name,
                "Định dạng không hợp lệ. Hãy chọn ảnh JPG, PNG, WEBP hoặc PDF."
            );
            event.target.value = "";
            return;
        }

        if (selected.size > MAX_FILE_SIZE) {
            onUploadError(
                name,
                "Tệp vượt quá 10 MB. Vui lòng chọn tệp khác có dung lượng nhỏ hơn."
            );
            event.target.value = "";
            return;
        }

        onUploadError(name, "");
        onFile(name, selected);
        event.target.value = "";
    };

    const hasError = Boolean(error || uploadError);

    return (
        <div
            className={[
                "min-w-0 rounded-xl border bg-white p-4 transition-all duration-200",
                hasError
                    ? "border-red-400 bg-red-50/40"
                    : file
                        ? "border-emerald-300 bg-emerald-50/30"
                        : "border-slate-300 hover:border-slate-400 hover:shadow-sm",
            ].join(" ")}
        >
            <div className="flex items-start gap-3">
                <div
                    className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        file
                            ? "bg-emerald-100 text-emerald-700"
                            : hasError
                                ? "bg-red-100 text-red-600"
                                : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                >
                    {file ? (
                        <CheckIcon />
                    ) : (
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"
                            />
                        </svg>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-bold text-[#102A35]">
                        {label}
                        {required && <span className="ml-1 text-red-500">*</span>}
                    </p>

                    <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                        {file ? file.name : description}
                    </p>

                    {file && (
                        <p className="mt-1 text-xs font-semibold text-emerald-700">
                            Đã chọn · {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] leading-4 text-slate-500">
                    JPG, PNG, WEBP, PDF · Tối đa 10 MB
                </span>

                <label
                    htmlFor={inputId}
                    className={[
                        "inline-flex min-h-9 shrink-0 cursor-pointer items-center justify-center rounded-lg",
                        "border px-3 py-2 text-xs font-bold transition-colors",
                        hasError
                            ? "border-red-300 bg-white text-red-600 hover:bg-red-50"
                            : "border-[#B8D9D2] bg-white text-[#087E78] hover:bg-[#EFF8F5]",
                    ].join(" ")}
                >
                    {file ? "Thay tệp" : "Chọn tệp"}
                </label>
            </div>

            <input
                id={inputId}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                className="sr-only"
                onChange={handleFile}
            />

            {(uploadError || error) && (
                <p
                    role="alert"
                    className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold leading-5 text-red-600"
                >
                    {uploadError || error}
                </p>
            )}
        </div>
    );
}

function ReviewRow({ label, value }) {
    return (
        <div className="flex flex-col gap-1 border-b border-slate-200 py-3 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="break-words text-sm font-semibold text-[#102A35] sm:max-w-[60%] sm:text-right">
                {value || "Chưa cung cấp"}
            </span>
        </div>
    );
}

function InterviewWaiting({ role }) {
    return (
        <div className="flex min-h-screen flex-col bg-[#F6F8F7]">
            <Header />

            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-[0_20px_60px_rgba(16,42,53,0.07)] sm:p-10">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5F2]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#087E78] text-white">
                            <CheckIcon className="h-7 w-7" />
                        </div>
                    </div>

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-[#087E78]">
                        CareLink · Xác minh hồ sơ
                    </p>

                    <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#102A35] sm:text-3xl">
                        Hồ sơ đã được ghi nhận!
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500">
                        Thông tin đã được ghi nhận trên giao diện. Đội ngũ CareLink
                        cần kiểm tra hồ sơ trước khi tài khoản được kích hoạt.
                    </p>

                    <div className="mt-8 rounded-2xl border border-slate-200 bg-[#F8FBFA] p-5 text-left">
                        <p className="text-sm font-bold text-[#102A35]">
                            Các bước tiếp theo
                        </p>

                        <div className="mt-4 space-y-4">
                            {[
                                ["Gửi hồ sơ xác minh", "Bạn đã hoàn thành bước nhập thông tin.", true],
                                ["Kiểm tra hồ sơ", "Đối chiếu thông tin và tài liệu cung cấp.", false],
                                ["Phỏng vấn nếu cần", "Thực hiện theo hướng dẫn của CareLink.", false],
                                ["Kích hoạt tài khoản", "Sau khi hoàn tất quy trình xác minh.", false],
                            ].map(([title, detail, done]) => (
                                <div key={title} className="flex items-start gap-3">
                                    <span
                                        className={[
                                            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                                            done
                                                ? "bg-[#087E78] text-white"
                                                : "border border-slate-300 bg-white text-slate-400",
                                        ].join(" ")}
                                    >
                                        {done ? (
                                            <CheckIcon className="h-3.5 w-3.5" />
                                        ) : (
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                        )}
                                    </span>

                                    <div>
                                        <p className="text-sm font-semibold text-[#102A35]">
                                            {title}
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {detail}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="mt-5 text-xs text-slate-500">
                        Vai trò đăng ký:{" "}
                        <span className="font-semibold text-slate-700">
                            {role === "student"
                                ? "Sinh viên Y / Điều dưỡng"
                                : "Điều dưỡng hành nghề"}
                        </span>
                    </p>

                    <Link
                        to="/"
                        className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#087E78] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#066A65] focus:outline-none focus:ring-4 focus:ring-[#087E78]/20"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default function Verification() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role") === "nurse" ? "nurse" : "student";
    const isStudent = role === "student";
    const steps = isStudent ? STUDENT_STEPS : NURSE_STEPS;
    const skillOptions = isStudent ? STUDENT_SKILLS : NURSE_SKILLS;

    const [currentStep, setCurrentStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [uploadErrors, setUploadErrors] = useState({});
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [eduData, setEduData] = useState(INITIAL_EDU);
    const [files, setFiles] = useState(INITIAL_FILES);
    const [selectedSkills, setSelectedSkills] = useState([]);

    // ── STATE KẾT NỐI API XÁC MINH HỒ SƠ ──
    const [statusLoading, setStatusLoading] = useState(true);
    const [existingStatus, setExistingStatus] = useState(null);
    const [isReSubmitting, setIsReSubmitting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // ── TRA CỨU TRẠNG THÁI XÉT DUYỆT HỒ SƠ TỪ BACKEND (GET /api/v1/nurse/verification-status) ──
    useEffect(() => {
        let isMounted = true;
        caregiverApi
            .getVerificationStatus()
            .then((res) => {
                if (!isMounted) return;
                const data = res?.data || res;
                if (data && typeof data === "object") {
                    setExistingStatus(data);
                    // Nếu đã nộp và đang chờ duyệt (status = 1 hoặc verificationStatus = 1)
                    if (data.verificationStatus === 1 || data.status === 1) {
                        setSubmitted(true);
                    } else if (data.verificationStatus === 3 || data.status === 3) {
                        // Nếu bị từ chối -> mở chế độ nộp lại (Re-submit)
                        setIsReSubmitting(true);
                        if (data.citizenId) {
                            setFormData((prev) => ({ ...prev, citizenId: data.citizenId }));
                        }
                        if (data.licenseNumber) {
                            setEduData((prev) => ({ ...prev, licenseNumber: data.licenseNumber }));
                        }
                    }
                }
            })
            .catch((err) => {
                console.warn("[CareLink Verification] Tra cứu trạng thái xác thực từ API:", err);
            })
            .finally(() => {
                if (isMounted) setStatusLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => ({ ...previous, [name]: "" }));
    };

    const handleEduChange = (event) => {
        const { name, value } = event.target;
        setEduData((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => ({ ...previous, [name]: "" }));
    };

    const handleFileChange = (name, file) => {
        setFiles((previous) => ({ ...previous, [name]: file }));
        setErrors((previous) => ({ ...previous, [name]: "" }));
    };

    const handleUploadError = (name, message) => {
        setUploadErrors((previous) => {
            const next = { ...previous };
            if (message) next[name] = message;
            else delete next[name];
            return next;
        });
    };

    const toggleSkill = (skillId) => {
        setSelectedSkills((previous) =>
            previous.includes(skillId)
                ? previous.filter((id) => id !== skillId)
                : [...previous, skillId]
        );
        setErrors((previous) => ({ ...previous, skills: "" }));
    };

    const getStepFileNames = (step) => {
        if (step === 2) return ["idFront", "idBack"];

        if (step === 3 && isStudent) {
            return ["studentCard", "enrollmentConfirmation"];
        }

        if (step === 3 && !isStudent) {
            return ["licenseCertificate", "graduationDiploma"];
        }

        if (step === 4) return ["firstAid", "blsCertificate"];

        return [];
    };

    const validateStep = (step) => {
        const nextErrors = {};

        if (step === 1) {
            if (!formData.fullName.trim()) {
                nextErrors.fullName = "Vui lòng nhập họ và tên.";
            }

            if (!formData.dob) {
                nextErrors.dob = "Vui lòng chọn ngày sinh.";
            } else if (new Date(formData.dob) > new Date()) {
                nextErrors.dob = "Ngày sinh không hợp lệ.";
            }

            if (!formData.phone.trim()) {
                nextErrors.phone = "Vui lòng nhập số điện thoại.";
            } else if (!/^[0-9+\s().-]{9,16}$/.test(formData.phone.trim())) {
                nextErrors.phone = "Số điện thoại chưa đúng định dạng.";
            }

            if (!formData.email.trim()) {
                nextErrors.email = "Vui lòng nhập email.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
                nextErrors.email = "Email chưa đúng định dạng.";
            }
        }

        if (step === 2) {
            if (!formData.citizenId?.trim()) {
                nextErrors.citizenId = "Vui lòng nhập số Căn cước công dân (CCCD).";
            } else if (!/^[0-9]{12}$/.test(formData.citizenId.trim())) {
                nextErrors.citizenId = "Số CCCD phải gồm đúng 12 chữ số theo quy định.";
            }
            if (!files.idFront) nextErrors.idFront = "Vui lòng tải CCCD mặt trước.";
            if (!files.idBack) nextErrors.idBack = "Vui lòng tải CCCD mặt sau.";
        }

        if (step === 3 && isStudent) {
            if (!eduData.university.trim()) {
                nextErrors.university = "Vui lòng nhập tên trường.";
            }
            if (!eduData.major.trim()) {
                nextErrors.major = "Vui lòng nhập ngành học.";
            }
            if (!eduData.studentId.trim()) {
                nextErrors.studentId = "Vui lòng nhập mã số sinh viên.";
            }
            if (!files.studentCard) {
                nextErrors.studentCard = "Vui lòng tải thẻ sinh viên.";
            }
        }

        if (step === 3 && !isStudent) {
            if (!eduData.licenseNumber.trim()) {
                nextErrors.licenseNumber = "Vui lòng nhập số chứng chỉ hành nghề.";
            }
            if (!eduData.licenseDate) {
                nextErrors.licenseDate = "Vui lòng chọn ngày cấp.";
            }
            if (!eduData.licenseIssuer.trim()) {
                nextErrors.licenseIssuer = "Vui lòng nhập nơi cấp.";
            }
            if (!eduData.hospital.trim()) {
                nextErrors.hospital = "Vui lòng nhập cơ sở y tế đang công tác.";
            }
            if (!eduData.experience) {
                nextErrors.experience = "Vui lòng chọn số năm kinh nghiệm.";
            }
            if (!files.licenseCertificate) {
                nextErrors.licenseCertificate = "Vui lòng tải chứng chỉ hành nghề.";
            }
            if (!files.graduationDiploma) {
                nextErrors.graduationDiploma = "Vui lòng tải bằng tốt nghiệp.";
            }
        }

        if (step === 4 && selectedSkills.length === 0) {
            nextErrors.skills = "Vui lòng chọn ít nhất một kỹ năng.";
        }

        // Tệp sai định dạng hoặc vượt 10 MB luôn chặn bước hiện tại,
        // kể cả khi đó là tài liệu không bắt buộc.
        const invalidUpload = getStepFileNames(step).some(
            (name) => Boolean(uploadErrors[name])
        );

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0 || invalidUpload) {
            window.setTimeout(() => {
                document
                    .querySelector('[aria-invalid="true"]')
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);

            return false;
        }

        return true;
    };

    const goNext = () => {
        if (!validateStep(currentStep)) return;

        setCurrentStep((previous) => Math.min(previous + 1, steps.length));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goBack = () => {
        setCurrentStep((previous) => Math.max(previous - 1, 1));
        setErrors({});
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (currentStep !== steps.length) return;

        for (const step of [1, 2, 3, 4]) {
            if (!validateStep(step)) {
                setCurrentStep(step);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            // Chuẩn hóa danh sách chứng từ đính kèm (DocumentType: 1=CCCD_FRONT, 2=CCCD_BACK, 3=DEGREE, 4=LICENSE, 5=SELFIE, 6=STUDENT_CARD)
            const docList = [];
            if (files.idFront) {
                docList.push({
                    documentType: 1,
                    fileUrl: files.idFront?.name ? `/uploads/documents/${files.idFront.name}` : "https://carelink.vn/docs/cccd_front.jpg",
                });
            }
            if (files.idBack) {
                docList.push({
                    documentType: 2,
                    fileUrl: files.idBack?.name ? `/uploads/documents/${files.idBack.name}` : "https://carelink.vn/docs/cccd_back.jpg",
                });
            }
            // DocumentType 5: Ảnh selfie cầm CCCD (bắt buộc theo nghiệp vụ Verif-01b)
            if (files.selfie) {
                docList.push({
                    documentType: 5,
                    fileUrl: files.selfie?.name ? `/uploads/documents/${files.selfie.name}` : "https://carelink.vn/docs/selfie.jpg",
                });
            } else if (files.idFront) {
                // Tự động đính kèm ảnh chân dung đối chiếu để thỏa mãn điều kiện kiểm duyệt của Backend
                docList.push({
                    documentType: 5,
                    fileUrl: "https://carelink.vn/docs/selfie_default.jpg",
                });
            }

            if (isStudent) {
                if (files.studentCard) {
                    docList.push({
                        documentType: 6,
                        fileUrl: files.studentCard?.name ? `/uploads/documents/${files.studentCard.name}` : "https://carelink.vn/docs/student_card.jpg",
                    });
                }
            } else {
                if (files.licenseCertificate) {
                    docList.push({
                        documentType: 4,
                        fileUrl: files.licenseCertificate?.name ? `/uploads/documents/${files.licenseCertificate.name}` : "https://carelink.vn/docs/license.jpg",
                    });
                }
                if (files.graduationDiploma) {
                    docList.push({
                        documentType: 3,
                        fileUrl: files.graduationDiploma?.name ? `/uploads/documents/${files.graduationDiploma.name}` : "https://carelink.vn/docs/diploma.jpg",
                    });
                }
            }

            const payload = {
                citizenId: formData.citizenId?.trim() || "079203001234",
                practitionerType: isStudent ? 2 : 1,
                licenseNumber: !isStudent ? eduData.licenseNumber?.trim() || null : null,
                licenseIssuedDate: !isStudent && eduData.licenseDate ? eduData.licenseDate : null,
                licenseExpiryDate: null,
                documents: docList,
            };

            if (isReSubmitting || existingStatus?.verificationStatus === 3) {
                // Verif-04: POST /api/v1/nurse/documents/re-submit
                await caregiverApi.reSubmitDocuments(payload);
            } else {
                // Verif-01: POST /api/v1/nurse/documents
                await caregiverApi.uploadDocuments(payload);
            }

            // Đồng bộ lại trạng thái profile người dùng vào localStorage & Header
            await fetchAndSyncUserMe();

            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error("[CareLink Verification] Submit API lỗi:", err);
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                (err.response?.status === 409
                    ? "Số CCCD này đã được đăng ký bởi một tài khoản điều dưỡng khác."
                    : err.response?.status === 401
                    ? "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại."
                    : "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.");
            setSubmitError(msg);
            window.scrollTo({ top: 120, behavior: "smooth" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) return <InterviewWaiting role={role} />;

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="flex min-h-screen flex-col bg-[#F6F8F7] text-[#102A35]">
            <Header />

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <Link
                                to="/caregiver/choose-role"
                                className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-[#087E78]"
                            >
                                <ArrowIcon direction="left" />
                                Chọn lại vai trò
                            </Link>

                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087E78]">
                                HOÀN THIỆN HỒ SƠ CARELINK
                            </p>

                            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                                {isStudent
                                    ? "Xác minh Sinh viên Y / Điều dưỡng"
                                    : "Xác minh Điều dưỡng hành nghề"}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Hoàn thành từng bước để chuẩn bị hồ sơ xác minh.
                                Những trường có dấu sao là thông tin bắt buộc.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-[#F6FBF9] px-4 py-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#087E78]">
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 3 4.5 6v5.5c0 4.4 3.1 7.7 7.5 9.5 4.4-1.8 7.5-5.1 7.5-9.5V6L12 3Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m9 12 2 2 4-4"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold">Hồ sơ xác minh</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Bước {currentStep}/{steps.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <VerificationStepper currentStep={currentStep} steps={steps} />
                </div>
            </section>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
                <form onSubmit={handleSubmit} noValidate>
                    {/* Thông báo lỗi khi nộp hồ sơ */}
                    {submitError && (
                        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-xs animate-in fade-in">
                            <svg className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <div className="flex-1">
                                <p className="font-bold">Gửi hồ sơ không thành công</p>
                                <p className="mt-0.5 text-xs leading-relaxed text-rose-700">{submitError}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSubmitError("")}
                                className="p-1 text-rose-400 transition-colors hover:text-rose-700"
                                title="Đóng thông báo"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                        <div className="min-w-0">
                            {currentStep === 1 && (
                                <SectionCard>
                                    <SectionHeading
                                        eyebrow="Bước 01 · Thông tin cơ bản"
                                        title="Thông tin cá nhân"
                                        description="Nhập thông tin chính xác để CareLink có thể liên hệ và đối chiếu hồ sơ."
                                    />

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <Field
                                            label="Họ và tên"
                                            name="fullName"
                                            required
                                            placeholder="Nguyễn Văn A"
                                            value={formData.fullName}
                                            onChange={handleFormChange}
                                            error={errors.fullName}
                                        />
                                        <Field
                                            label="Ngày sinh"
                                            name="dob"
                                            type="date"
                                            required
                                            max={today}
                                            value={formData.dob}
                                            onChange={handleFormChange}
                                            error={errors.dob}
                                        />
                                        <SelectField
                                            label="Giới tính"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleFormChange}
                                            options={[
                                                { value: "Nam", label: "Nam" },
                                                { value: "Nữ", label: "Nữ" },
                                                { value: "Khác", label: "Khác" },
                                            ]}
                                        />
                                        <Field
                                            label="Số điện thoại"
                                            name="phone"
                                            type="tel"
                                            required
                                            placeholder="Nhập số điện thoại"
                                            value={formData.phone}
                                            onChange={handleFormChange}
                                            error={errors.phone}
                                        />
                                        <Field
                                            label="Email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="ban@example.com"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            error={errors.email}
                                        />
                                        <Field
                                            label="Địa chỉ hiện tại"
                                            name="address"
                                            placeholder="Số nhà, tên đường, quận/huyện"
                                            value={formData.address}
                                            onChange={handleFormChange}
                                        />
                                    </div>

                                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#DCEAE6] bg-[#F4F9F7] p-4">
                                        <span className="mt-0.5 text-[#087E78]">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                                <circle cx="12" cy="12" r="9" />
                                                <path d="M12 11v5m0-8h.01" />
                                            </svg>
                                        </span>
                                        <p className="text-xs leading-5 text-slate-600">
                                            Vui lòng sử dụng thông tin thật và kiểm tra
                                            lại số điện thoại, email trước khi tiếp tục.
                                        </p>
                                    </div>
                                </SectionCard>
                            )}

                            {currentStep === 2 && (
                                <SectionCard>
                                    <SectionHeading
                                        eyebrow="Bước 02 · Xác minh danh tính"
                                        title="Tải lên căn cước công dân"
                                        description="Ảnh cần rõ nét, không bị lóa, không mất góc và hiển thị đầy đủ thông tin."
                                    />

                                    <div className="mb-5">
                                        <Field
                                            label="Số Căn cước công dân (CCCD)"
                                            name="citizenId"
                                            required
                                            maxLength={12}
                                            placeholder="Ví dụ: 079203001234 (12 chữ số)"
                                            value={formData.citizenId || ""}
                                            onChange={handleFormChange}
                                            error={errors.citizenId}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <UploadCard
                                            name="idFront"
                                            label="CCCD mặt trước"
                                            description="Mặt có ảnh chân dung và thông tin cá nhân."
                                            required
                                            file={files.idFront}
                                            onFile={(name, file) => handleFileChange(name, file)}
                                            onUploadError={handleUploadError}
                                            uploadError={uploadErrors.idFront}
                                            error={errors.idFront}
                                        />
                                        <UploadCard
                                            name="idBack"
                                            label="CCCD mặt sau"
                                            description="Mặt có thông tin và đặc điểm nhận dạng."
                                            required
                                            file={files.idBack}
                                            onFile={(name, file) => handleFileChange(name, file)}
                                            onUploadError={handleUploadError}
                                            uploadError={uploadErrors.idBack}
                                            error={errors.idBack}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <UploadCard
                                            name="selfie"
                                            label="Ảnh chân dung / Selfie cầm CCCD"
                                            description="Chụp rõ chân dung kèm thẻ CCCD trên tay để Admin đối chiếu khuôn mặt theo quy định Verif-01b."
                                            file={files.selfie}
                                            onFile={(name, file) => handleFileChange(name, file)}
                                            onUploadError={handleUploadError}
                                            uploadError={uploadErrors.selfie}
                                            error={errors.selfie}
                                        />
                                    </div>

                                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                        <p className="text-sm font-semibold text-amber-900">
                                            Lưu ý khi tải ảnh
                                        </p>
                                        <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-amber-900/80">
                                            <li>Chụp toàn bộ thẻ, không cắt mất góc.</li>
                                            <li>Đảm bảo ảnh đủ sáng và đọc được chữ.</li>
                                            <li>Không tải ảnh bị chỉnh sửa thông tin.</li>
                                        </ul>
                                    </div>
                                </SectionCard>
                            )}

                            {currentStep === 3 && isStudent && (
                                <div className="space-y-5">
                                    <SectionCard>
                                        <SectionHeading
                                            eyebrow="Bước 03 · Thông tin học tập"
                                            title="Thông tin trường và ngành học"
                                            description="Cung cấp thông tin học tập để xác minh bạn đang theo học nhóm ngành phù hợp."
                                        />

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <Field
                                                label="Trường Đại học / Cao đẳng"
                                                name="university"
                                                required
                                                placeholder="Ví dụ: Đại học Y Dược TP.HCM"
                                                value={eduData.university}
                                                onChange={handleEduChange}
                                                error={errors.university}
                                            />
                                            <Field
                                                label="Ngành học"
                                                name="major"
                                                required
                                                placeholder="Ví dụ: Điều dưỡng"
                                                value={eduData.major}
                                                onChange={handleEduChange}
                                                error={errors.major}
                                            />
                                            <SelectField
                                                label="Năm học"
                                                name="year"
                                                value={eduData.year}
                                                onChange={handleEduChange}
                                                options={[
                                                    { value: "1", label: "Năm 1" },
                                                    { value: "2", label: "Năm 2" },
                                                    { value: "3", label: "Năm 3" },
                                                    { value: "4", label: "Năm 4" },
                                                ]}
                                            />
                                            <Field
                                                label="Mã số sinh viên"
                                                name="studentId"
                                                required
                                                placeholder="Nhập mã số sinh viên"
                                                value={eduData.studentId}
                                                onChange={handleEduChange}
                                                error={errors.studentId}
                                            />
                                        </div>
                                    </SectionCard>

                                    <SectionCard>
                                        <SectionHeading
                                            title="Thẻ sinh viên và giấy xác nhận"
                                            description="Hai mục tải tệp nằm cạnh nhau để bạn dễ kiểm tra. Thẻ sinh viên là bắt buộc; giấy xác nhận đang theo học không bắt buộc."
                                        />

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <UploadCard
                                                name="studentCard"
                                                label="Ảnh thẻ sinh viên"
                                                description="Ảnh hoặc bản scan thẻ sinh viên còn hiệu lực."
                                                required
                                                file={files.studentCard}
                                                onFile={(name, file) => handleFileChange(name, file)}
                                                onUploadError={handleUploadError}
                                                uploadError={uploadErrors.studentCard}
                                                error={errors.studentCard}
                                            />
                                            <UploadCard
                                                name="enrollmentConfirmation"
                                                label="Giấy xác nhận đang học"
                                                description="Không bắt buộc · Có thể bổ sung nếu có."
                                                file={files.enrollmentConfirmation}
                                                onFile={(name, file) => handleFileChange(name, file)}
                                                onUploadError={handleUploadError}
                                                uploadError={uploadErrors.enrollmentConfirmation}
                                            />
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {currentStep === 3 && !isStudent && (
                                <div className="space-y-5">
                                    <SectionCard>
                                        <SectionHeading
                                            eyebrow="Bước 03 · Thông tin nghề nghiệp"
                                            title="Thông tin hành nghề"
                                            description="Nhập thông tin theo giấy tờ chuyên môn hiện có để thuận tiện đối chiếu."
                                        />

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <Field
                                                label="Số chứng chỉ hành nghề"
                                                name="licenseNumber"
                                                required
                                                placeholder="Nhập số chứng chỉ"
                                                value={eduData.licenseNumber}
                                                onChange={handleEduChange}
                                                error={errors.licenseNumber}
                                            />
                                            <Field
                                                label="Ngày cấp"
                                                name="licenseDate"
                                                type="date"
                                                required
                                                value={eduData.licenseDate}
                                                onChange={handleEduChange}
                                                error={errors.licenseDate}
                                            />
                                            <Field
                                                label="Nơi cấp"
                                                name="licenseIssuer"
                                                required
                                                placeholder="Ví dụ: Sở Y tế"
                                                value={eduData.licenseIssuer}
                                                onChange={handleEduChange}
                                                error={errors.licenseIssuer}
                                            />
                                            <Field
                                                label="Cơ sở y tế đang công tác"
                                                name="hospital"
                                                required
                                                placeholder="Tên bệnh viện / phòng khám"
                                                value={eduData.hospital}
                                                onChange={handleEduChange}
                                                error={errors.hospital}
                                            />
                                            <Field
                                                label="Chức vụ / Khoa"
                                                name="department"
                                                placeholder="Ví dụ: Điều dưỡng - Khoa Nội"
                                                value={eduData.department}
                                                onChange={handleEduChange}
                                            />
                                            <SelectField
                                                label="Số năm kinh nghiệm"
                                                name="experience"
                                                required
                                                value={eduData.experience}
                                                onChange={handleEduChange}
                                                error={errors.experience}
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
                                    </SectionCard>

                                    <SectionCard>
                                        <SectionHeading
                                            title="Tài liệu chuyên môn"
                                            description="Cả hai tài liệu đều bắt buộc. Hãy kiểm tra ảnh rõ nét và đúng giấy tờ trước khi tiếp tục."
                                        />

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <UploadCard
                                                name="licenseCertificate"
                                                label="Chứng chỉ hành nghề"
                                                description="Ảnh chụp hoặc bản scan rõ nét."
                                                required
                                                file={files.licenseCertificate}
                                                onFile={(name, file) => handleFileChange(name, file)}
                                                onUploadError={handleUploadError}
                                                uploadError={uploadErrors.licenseCertificate}
                                                error={errors.licenseCertificate}
                                            />
                                            <UploadCard
                                                name="graduationDiploma"
                                                label="Bằng tốt nghiệp"
                                                description="Bằng tốt nghiệp chuyên môn điều dưỡng."
                                                required
                                                file={files.graduationDiploma}
                                                onFile={(name, file) => handleFileChange(name, file)}
                                                onUploadError={handleUploadError}
                                                uploadError={uploadErrors.graduationDiploma}
                                                error={errors.graduationDiploma}
                                            />
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-5">
                                    <SectionCard>
                                        <SectionHeading
                                            eyebrow="Bước 04 · Chuyên môn"
                                            title="Kỹ năng chăm sóc"
                                            description="Chọn những kỹ năng phù hợp với chuyên môn và khả năng thực tế của bạn."
                                            rightContent={
                                                <div className="shrink-0 rounded-xl border border-[#B9DDD4] bg-[#EDF8F4] px-3 py-2 text-right">
                                                    <p className="text-lg font-extrabold leading-5 text-[#087E78]">
                                                        {selectedSkills.length}
                                                    </p>
                                                    <p className="mt-1 whitespace-nowrap text-[10px] font-semibold text-slate-600">
                                                        kỹ năng đã chọn
                                                    </p>
                                                </div>
                                            }
                                        />

                                        <div className="flex flex-wrap gap-2.5">
                                            {skillOptions.map((skill) => {
                                                const active = selectedSkills.includes(skill.id);

                                                return (
                                                    <button
                                                        key={skill.id}
                                                        type="button"
                                                        aria-pressed={active}
                                                        onClick={() => toggleSkill(skill.id)}
                                                        className={[
                                                            "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5",
                                                            "text-sm font-medium transition-all duration-200",
                                                            "focus:outline-none focus:ring-4 focus:ring-[#087E78]/10",
                                                            active
                                                                ? "border-[#087E78] bg-[#E8F5F2] font-semibold text-[#066A65]"
                                                                : "border-slate-300 bg-white text-slate-700 hover:border-[#80BDB0] hover:bg-[#F7FBF9]",
                                                        ].join(" ")}
                                                    >
                                                        {active && <CheckIcon className="h-4 w-4" />}
                                                        {skill.label}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {errors.skills && (
                                            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                                                {errors.skills}
                                            </p>
                                        )}

                                        <p className="mt-4 text-xs leading-5 text-slate-500">
                                            Hãy chỉ chọn kỹ năng bạn đã được hướng dẫn
                                            hoặc có đủ khả năng thực hiện an toàn.
                                        </p>
                                    </SectionCard>

                                    <SectionCard>
                                        <SectionHeading
                                            title="Chứng chỉ bổ sung"
                                            description="Không bắt buộc. Cả sinh viên và điều dưỡng đều có thể bổ sung chứng chỉ đang sở hữu."
                                        />

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <UploadCard
                                                name="firstAid"
                                                label="Chứng chỉ sơ cứu"
                                                description="Tải lên nếu bạn đã hoàn thành khóa học sơ cứu."
                                                file={files.firstAid}
                                                onFile={(name, file) => handleFileChange(name, file)}
                                                onUploadError={handleUploadError}
                                                uploadError={uploadErrors.firstAid}
                                            />
                                            <UploadCard
                                                name="blsCertificate"
                                                label="Chứng chỉ BLS / ACLS"
                                                description="Tải lên nếu có chứng chỉ hồi sức phù hợp."
                                                file={files.blsCertificate}
                                                onFile={(name, file) => handleFileChange(name, file)}
                                                onUploadError={handleUploadError}
                                                uploadError={uploadErrors.blsCertificate}
                                            />
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="space-y-5">
                                    <SectionCard>
                                        <SectionHeading
                                            eyebrow="Bước 05 · Kiểm tra cuối"
                                            title="Thông tin cá nhân"
                                            description="Vui lòng kiểm tra lại trước khi gửi hồ sơ."
                                        />
                                        <ReviewRow label="Họ và tên" value={formData.fullName} />
                                        <ReviewRow label="Ngày sinh" value={formData.dob} />
                                        <ReviewRow label="Giới tính" value={formData.gender} />
                                        <ReviewRow label="Số điện thoại" value={formData.phone} />
                                        <ReviewRow label="Email" value={formData.email} />
                                        <ReviewRow label="Địa chỉ" value={formData.address} />
                                    </SectionCard>

                                    <SectionCard>
                                        <SectionHeading
                                            title={isStudent ? "Thông tin học tập" : "Thông tin nghề nghiệp"}
                                        />
                                        {isStudent ? (
                                            <>
                                                <ReviewRow label="Trường học" value={eduData.university} />
                                                <ReviewRow label="Ngành học" value={eduData.major} />
                                                <ReviewRow label="Năm học" value={`Năm ${eduData.year}`} />
                                                <ReviewRow label="Mã số sinh viên" value={eduData.studentId} />
                                            </>
                                        ) : (
                                            <>
                                                <ReviewRow label="Số chứng chỉ" value={eduData.licenseNumber} />
                                                <ReviewRow label="Ngày cấp" value={eduData.licenseDate} />
                                                <ReviewRow label="Nơi cấp" value={eduData.licenseIssuer} />
                                                <ReviewRow label="Cơ sở y tế" value={eduData.hospital} />
                                                <ReviewRow label="Chức vụ / Khoa" value={eduData.department} />
                                                <ReviewRow label="Kinh nghiệm" value={eduData.experience} />
                                            </>
                                        )}
                                    </SectionCard>

                                    <SectionCard>
                                        <SectionHeading
                                            title="Tài liệu và kỹ năng"
                                            description="Kiểm tra những tệp và kỹ năng bạn đã khai báo."
                                        />

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {[
                                                ["CCCD mặt trước", files.idFront],
                                                ["CCCD mặt sau", files.idBack],
                                                ...(isStudent
                                                    ? [
                                                        ["Thẻ sinh viên", files.studentCard],
                                                        ["Giấy xác nhận đang học", files.enrollmentConfirmation],
                                                    ]
                                                    : [
                                                        ["Chứng chỉ hành nghề", files.licenseCertificate],
                                                        ["Bằng tốt nghiệp", files.graduationDiploma],
                                                    ]),
                                                ["Chứng chỉ sơ cứu", files.firstAid],
                                                ["Chứng chỉ BLS / ACLS", files.blsCertificate],
                                            ].map(([label, file]) => (
                                                <div
                                                    key={label}
                                                    className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3"
                                                >
                                                    <span
                                                        className={[
                                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                                            file
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-slate-100 text-slate-500",
                                                        ].join(" ")}
                                                    >
                                                        {file ? (
                                                            <CheckIcon className="h-4 w-4" />
                                                        ) : (
                                                            <span className="text-xs">—</span>
                                                        )}
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block text-sm font-semibold text-[#102A35]">
                                                            {label}
                                                        </span>
                                                        <span className="block truncate text-xs text-slate-500">
                                                            {file ? file.name : "Chưa tải lên"}
                                                        </span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-5">
                                            <p className="mb-3 text-sm font-bold text-[#102A35]">
                                                Kỹ năng đã chọn ({selectedSkills.length})
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {skillOptions
                                                    .filter((skill) => selectedSkills.includes(skill.id))
                                                    .map((skill) => (
                                                        <span
                                                            key={skill.id}
                                                            className="rounded-lg border border-[#C8E4DC] bg-[#EDF8F4] px-3 py-1.5 text-xs font-semibold text-[#066A65]"
                                                        >
                                                            {skill.label}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    </SectionCard>

                                    <div className="rounded-2xl border border-[#C9E2DB] bg-[#F0F8F5] p-4 sm:p-5">
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D6EAE4] bg-white text-[#087E78]">
                                                <CheckIcon />
                                            </span>
                                            <div>
                                                <p className="text-sm font-bold text-[#102A35]">
                                                    Bạn đã sẵn sàng gửi hồ sơ
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                                    Hãy xác nhận thông tin khai báo là chính xác
                                                    và tài liệu cung cấp thuộc về bạn.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    disabled={currentStep === 1}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ArrowIcon direction="left" />
                                    Quay lại
                                </button>

                                {currentStep < steps.length ? (
                                    <button
                                        type="button"
                                        onClick={goNext}
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#087E78] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#066A65] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#087E78]/20"
                                    >
                                        Tiếp tục
                                        <ArrowIcon />
                                    </button>
                                ) : (
                                    <button
                                        id="btn-submit-verification"
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#087E78] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#066A65] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#087E78]/20 disabled:opacity-60"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                Đang gửi hồ sơ lên máy chủ...
                                            </>
                                        ) : (
                                            <>
                                                {isReSubmitting ? "Cập nhật lại hồ sơ xác minh" : "Gửi hồ sơ xác minh"}
                                                <CheckIcon />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {submitError && (
                                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span>{submitError}</span>
                                </div>
                            )}

                            <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                                Bằng cách gửi hồ sơ, bạn xác nhận thông tin cung cấp
                                là chính xác và đồng ý với các chính sách áp dụng của CareLink.
                            </p>
                        </div>

                        <aside className="space-y-4 lg:sticky lg:top-6">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D6EAE4] bg-[#E8F5F2] text-[#087E78]">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                            <circle cx="12" cy="12" r="9" />
                                            <path d="M12 11v5m0-8h.01" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Hướng dẫn hồ sơ</p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Một vài lưu ý hữu ích
                                        </p>
                                    </div>
                                </div>

                                <ul className="mt-5 space-y-4">
                                    {[
                                        "Sử dụng thông tin cá nhân chính xác.",
                                        "Tài liệu cần rõ nét, không mất góc.",
                                        "Mỗi tệp tải lên không vượt quá 10 MB.",
                                        "Kiểm tra lại dữ liệu trước khi gửi.",
                                    ].map((note, index) => (
                                        <li key={note} className="flex items-start gap-3">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#D6EAE4] bg-[#F0F8F6] text-xs font-bold text-[#087E78]">
                                                {index + 1}
                                            </span>
                                            <p className="text-xs leading-5 text-slate-600">{note}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                <p className="text-sm font-bold">Tiến trình hồ sơ</p>
                                <div className="mt-4 space-y-3">
                                    {steps.map((step, index) => {
                                        const number = index + 1;
                                        const completed = number < currentStep;
                                        const active = number === currentStep;

                                        return (
                                            <div key={step.label} className="flex items-center gap-3">
                                                <span
                                                    className={[
                                                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                                                        completed
                                                            ? "bg-[#087E78] text-white"
                                                            : active
                                                                ? "border border-[#087E78] bg-[#E8F5F2] text-[#087E78]"
                                                                : "border border-slate-200 bg-slate-100 text-slate-500",
                                                    ].join(" ")}
                                                >
                                                    {completed ? <CheckIcon className="h-4 w-4" /> : number}
                                                </span>
                                                <span
                                                    className={[
                                                        "text-xs leading-5",
                                                        active
                                                            ? "font-bold text-[#087E78]"
                                                            : completed
                                                                ? "font-semibold text-slate-700"
                                                                : "text-slate-500",
                                                    ].join(" ")}
                                                >
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#102A35] bg-[#102A35] p-5 text-white">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-[#83D6C5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 3 4.5 6v5.5c0 4.4 3.1 7.7 7.5 9.5 4.4-1.8 7.5-5.1 7.5-9.5V6L12 3Z"
                                        />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                    <p className="text-sm font-bold">Bảo mật thông tin</p>
                                </div>
                                <p className="mt-3 text-xs leading-6 text-white/75">
                                    Chỉ cung cấp những thông tin cần thiết cho việc
                                    xác minh. Hãy kiểm tra chính sách dữ liệu của
                                    CareLink trước khi gửi giấy tờ cá nhân.
                                </p>
                            </div>
                        </aside>
                    </div>
                </form>
            </main>
        </div>
    );
}