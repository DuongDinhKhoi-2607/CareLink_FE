import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
    Activity,
    Heart,
    Thermometer,
    Droplet,
    ClipboardCheck,
    AlertCircle,
    CheckCircle2,
    X,
    FileText,
    ShieldAlert,
    Stethoscope,
    Sparkles,
} from "lucide-react";

/**
 * SubmitHealthRecordModal
 * 
 * Modal nhập Báo cáo sức khỏe & Sinh hiệu lâm sàng dành cho Điều dưỡng (Caregiver).
 * Tuân thủ đúng DTO của Backend CareLink: SubmitHealthRecordDto
 * - BloodPressureSystolic (40 - 300 mmHg)
 * - BloodPressureDiastolic (30 - 200 mmHg)
 * - HeartRate (20 - 250 bpm)
 * - Temperature (25.0 - 45.0 °C)
 * - BloodGlucose (10 - 1000 mg/dL)
 * - WoundStatus, MobilityStatus, MentalStatus, NurseNotes
 */
export default function SubmitHealthRecordModal({
    isOpen,
    onClose,
    booking,
    initialData = null,
    onSaveSuccess,
}) {
    if (!isOpen || !booking) return null;

    const patientName = booking.patient?.name || booking.family?.name || "Người nhận chăm sóc";
    const patientCondition = booking.patient?.condition || booking.service?.type || "Chăm sóc phục hồi";

    // Form state
    const [systolic, setSystolic] = useState(initialData?.bloodPressureSystolic || "");
    const [diastolic, setDiastolic] = useState(initialData?.bloodPressureDiastolic || "");
    const [heartRate, setHeartRate] = useState(initialData?.heartRate || "");
    const [temperature, setTemperature] = useState(initialData?.temperature || "36.8");
    const [bloodGlucose, setBloodGlucose] = useState(initialData?.bloodGlucose || "");
    const [woundStatus, setWoundStatus] = useState(initialData?.woundStatus || "Khô ráo, liền tốt");
    const [mobilityStatus, setMobilityStatus] = useState(initialData?.mobilityStatus || "Hỗ trợ nhẹ");
    const [mentalStatus, setMentalStatus] = useState(initialData?.mentalStatus || "Tỉnh táo, hợp tác");
    const [nurseNotes, setNurseNotes] = useState(initialData?.nurseNotes || "");

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Danh sách gợi ý nhanh
    const woundOptions = [
        "Khô ráo, liền tốt",
        "Thay băng vô khuẩn, vết mổ sạch",
        "Sưng đỏ nhẹ, cần theo dõi",
        "Không có vết thương hở",
    ];

    const mobilityOptions = [
        "Tự đi lại tốt",
        "Hỗ trợ nhẹ (khung tập đi/gậy)",
        "Cần trợ giúp nâng đỡ toàn phần",
        "Nghỉ ngơi tại giường",
    ];

    const mentalOptions = [
        "Tỉnh táo, hợp tác tích cực",
        "Vui vẻ, ăn uống tốt",
        "Hơi mệt mỏi sau tập luyện",
        "Cần ngủ nghỉ yên tĩnh",
    ];

    // Validate theo đúng DataAnnotations của Backend DTO
    const validate = () => {
        const errs = {};
        if (systolic) {
            const sys = Number(systolic);
            if (isNaN(sys) || sys < 40 || sys > 300) {
                errs.systolic = "Huyết áp tâm thu từ 40 đến 300 mmHg";
            }
        }
        if (diastolic) {
            const dia = Number(diastolic);
            if (isNaN(dia) || dia < 30 || dia > 200) {
                errs.diastolic = "Huyết áp tâm trương từ 30 đến 200 mmHg";
            }
        }
        if (heartRate) {
            const hr = Number(heartRate);
            if (isNaN(hr) || hr < 20 || hr > 250) {
                errs.heartRate = "Nhịp tim từ 20 đến 250 bpm";
            }
        }
        if (temperature) {
            const temp = Number(temperature);
            if (isNaN(temp) || temp < 25.0 || temp > 45.0) {
                errs.temperature = "Nhiệt độ cơ thể từ 25.0 đến 45.0 °C";
            }
        }
        if (bloodGlucose) {
            const bg = Number(bloodGlucose);
            if (isNaN(bg) || bg < 10 || bg > 1000) {
                errs.bloodGlucose = "Đường huyết từ 10 đến 1000 mg/dL";
            }
        }
        if (!nurseNotes.trim()) {
            errs.nurseNotes = "Vui lòng nhập nhật ký chăm sóc & dặn dò gia đình";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        // Giả lập DTO chuẩn gửi lên API /api/v1/bookings/{id}/health-record
        const healthRecordDto = {
            bookingId: booking.id,
            bloodPressureSystolic: systolic ? parseInt(systolic, 10) : null,
            bloodPressureDiastolic: diastolic ? parseInt(diastolic, 10) : null,
            heartRate: heartRate ? parseInt(heartRate, 10) : null,
            temperature: temperature ? parseFloat(temperature) : null,
            bloodGlucose: bloodGlucose ? parseFloat(bloodGlucose) : null,
            woundStatus,
            mobilityStatus,
            mentalStatus,
            nurseNotes: nurseNotes.trim(),
            createdAt: new Date().toISOString(),
        };

        setTimeout(() => {
            setIsSubmitting(false);
            if (onSaveSuccess) {
                onSaveSuccess(healthRecordDto);
            }
            onClose();
        }, 500);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-hidden"
            style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── MODAL HEADER ── */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-[#00677c] to-[#008ba3] text-white flex items-start justify-between shrink-0">
                    <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 shadow-xs">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-teal-100 text-[10px] font-bold uppercase tracking-wider mb-1">
                                <Sparkles className="w-3 h-3 text-teal-200" />
                                Bệnh án lâm sàng bắt buộc
                            </div>
                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                                Ghi nhận Báo cáo sức khỏe sau ca
                            </h2>
                            <p className="text-xs text-teal-100/90 mt-0.5">
                                Ca #{booking.id} · Người chăm sóc: <strong>{patientName}</strong> ({patientCondition})
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-white cursor-pointer shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── MODAL BODY (SCROLLABLE) ── */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Notice */}
                    <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                        <div className="text-xs text-teal-900 leading-relaxed">
                            <strong>Quy định nghiệp vụ CareLink:</strong> Dữ liệu sinh hiệu và nhật ký chăm sóc sẽ được lưu trữ vào Hồ sơ sức khỏe của gia đình. Vui lòng nhập thông tin chính xác theo thực tế đo lường.
                        </div>
                    </div>

                    {/* ── PHẦN 1: CHỈ SỐ SINH HIỆU CƠ BẢN ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Activity className="w-4 h-4 text-[#00677c]" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                1. Chỉ số sinh hiệu & Đo lường
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Huyết áp tâm thu / tâm trương */}
                            <div className="sm:col-span-2 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80">
                                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5 text-rose-500" />
                                    Huyết áp (Tâm thu / Tâm trương)
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                placeholder="Tâm thu (VD: 120)"
                                                value={systolic}
                                                onChange={(e) => setSystolic(e.target.value)}
                                                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 ${
                                                    errors.systolic ? "border-rose-400" : "border-slate-200"
                                                }`}
                                            />
                                        </div>
                                        {errors.systolic && (
                                            <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                                                {errors.systolic}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-slate-400 font-bold">/</span>
                                    <div className="flex-1">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                placeholder="Tâm trương (VD: 80)"
                                                value={diastolic}
                                                onChange={(e) => setDiastolic(e.target.value)}
                                                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 ${
                                                    errors.diastolic ? "border-rose-400" : "border-slate-200"
                                                }`}
                                            />
                                        </div>
                                        {errors.diastolic && (
                                            <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                                                {errors.diastolic}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 shrink-0">mmHg</span>
                                </div>
                            </div>

                            {/* Nhịp tim */}
                            <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80">
                                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                                    Nhịp tim
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="VD: 75"
                                        value={heartRate}
                                        onChange={(e) => setHeartRate(e.target.value)}
                                        className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 ${
                                            errors.heartRate ? "border-rose-400" : "border-slate-200"
                                        }`}
                                    />
                                    <span className="text-xs font-semibold text-slate-400 shrink-0">bpm</span>
                                </div>
                                {errors.heartRate && (
                                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                                        {errors.heartRate}
                                    </span>
                                )}
                            </div>

                            {/* Thân nhiệt */}
                            <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80">
                                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                                    Thân nhiệt
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="VD: 36.8"
                                        value={temperature}
                                        onChange={(e) => setTemperature(e.target.value)}
                                        className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 ${
                                            errors.temperature ? "border-rose-400" : "border-slate-200"
                                        }`}
                                    />
                                    <span className="text-xs font-semibold text-slate-400 shrink-0">°C</span>
                                </div>
                                {errors.temperature && (
                                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                                        {errors.temperature}
                                    </span>
                                )}
                            </div>

                            {/* Đường huyết (nếu có đo) */}
                            <div className="sm:col-span-2 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80">
                                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <Droplet className="w-3.5 h-3.5 text-sky-500" />
                                        Đường huyết mao mạch (tùy chọn)
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-normal">Chỉ đo khi có chỉ định</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="VD: 105 (hoặc để trống nếu không đo)"
                                        value={bloodGlucose}
                                        onChange={(e) => setBloodGlucose(e.target.value)}
                                        className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 ${
                                            errors.bloodGlucose ? "border-rose-400" : "border-slate-200"
                                        }`}
                                    />
                                    <span className="text-xs font-semibold text-slate-400 shrink-0">mg/dL</span>
                                </div>
                                {errors.bloodGlucose && (
                                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                                        {errors.bloodGlucose}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── PHẦN 2: DIỄN BIẾN LÂM SÀNG & THỂ TRẠNG ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ClipboardCheck className="w-4 h-4 text-[#00677c]" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                2. Diễn biến lâm sàng & Khả năng vận động
                            </h3>
                        </div>

                        <div className="space-y-3.5">
                            {/* Tình trạng vết thương */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                                    Tình trạng vết mổ / vết thương
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {woundOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setWoundStatus(opt)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                woundStatus === opt
                                                    ? "bg-[#00677c] text-white shadow-xs"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={woundStatus}
                                    onChange={(e) => setWoundStatus(e.target.value)}
                                    placeholder="Hoặc tự ghi tình trạng vết thương..."
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20"
                                />
                            </div>

                            {/* Khả năng vận động */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                                    Khả năng vận động trong ca
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {mobilityOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setMobilityStatus(opt)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                mobilityStatus === opt
                                                    ? "bg-[#00677c] text-white shadow-xs"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={mobilityStatus}
                                    onChange={(e) => setMobilityStatus(e.target.value)}
                                    placeholder="Ghi chú thêm về khả năng đi lại..."
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20"
                                />
                            </div>

                            {/* Trạng thái tinh thần */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                                    Trạng thái tinh thần & Tiếp xúc
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {mentalOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setMentalStatus(opt)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                mentalStatus === opt
                                                    ? "bg-[#00677c] text-white shadow-xs"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── PHẦN 3: NHẬT KÝ CHĂM SÓC & DẶN DÒ GIA ĐÌNH ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-[#00677c]" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                3. Nhật ký chăm sóc & Dặn dò gia đình *
                            </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">
                            Mô tả các thao tác chuyên môn đã thực hiện (thay băng, cho uống thuốc, tập phục hồi) và dặn dò người nhà theo dõi tiếp theo.
                        </p>
                        <textarea
                            rows={4}
                            placeholder="Ví dụ: Đã đo sinh hiệu lúc 08:30 (huyết áp 125/80 mmHg). Hỗ trợ bác tập co duỗi khớp gối 25 phút. Thay băng vô khuẩn vết mổ khô ráo. Nhắc người nhà cho uống thuốc sau ăn trưa 30 phút..."
                            value={nurseNotes}
                            onChange={(e) => setNurseNotes(e.target.value)}
                            className={`w-full p-3.5 bg-white border rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 leading-relaxed ${
                                errors.nurseNotes ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                            }`}
                        />
                        {errors.nurseNotes && (
                            <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                                {errors.nurseNotes}
                            </span>
                        )}
                    </div>

                    {/* ── MODAL ACTIONS ── */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                        >
                            Đóng, quay lại ca
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007387] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang lưu bệnh án...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Lưu Bệnh án & Hoàn thành ca
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
