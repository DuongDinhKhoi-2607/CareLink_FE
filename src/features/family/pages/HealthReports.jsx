import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function HealthReports() {
    const [selectedRelativeId, setSelectedRelativeId] = useState("lan");
    const [timeRange, setTimeRange] = useState("week"); // 'week' | 'month'

    // Dữ liệu báo cáo sức khỏe theo từng người thân
    const reportsData = {
        lan: {
            name: "Bà Nguyễn Thị Lan",
            relation: "Mẹ (75 tuổi)",
            summary: {
                bloodPressure: "128/82",
                bloodPressureUnit: "mmHg",
                bloodPressureStatus: "Bình thường",
                bloodPressureBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
                heartRate: "76",
                heartRateUnit: "BPM",
                heartRateStatus: "Nhịp đều",
                temperature: "36.7",
                temperatureUnit: "°C",
                temperatureStatus: "Ổn định",
                lastUpdate: "18/09/2026 – 10:30",
                updatedBy: "ĐD. Nguyễn Thùy Linh",
            },
            notes: "Bà Lan cần được theo dõi huyết áp định kỳ vào mỗi buổi sáng và tối. Tránh đồ ăn nhiều muối, duy trì uống thuốc huyết áp đúng giờ và vận động khớp gối nhẹ nhàng 20 phút mỗi ngày.",
            chartData: {
                week: [
                    { day: "T2", systolic: 130, diastolic: 84, heartRate: 78 },
                    { day: "T3", systolic: 126, diastolic: 82, heartRate: 75 },
                    { day: "T4", systolic: 132, diastolic: 85, heartRate: 79 },
                    { day: "T5", systolic: 125, diastolic: 80, heartRate: 74 },
                    { day: "T6", systolic: 129, diastolic: 83, heartRate: 77 },
                    { day: "T7", systolic: 128, diastolic: 82, heartRate: 76 },
                    { day: "CN", systolic: 127, diastolic: 81, heartRate: 75 },
                ],
                month: [
                    { day: "Tuần 1", systolic: 132, diastolic: 85, heartRate: 79 },
                    { day: "Tuần 2", systolic: 129, diastolic: 83, heartRate: 77 },
                    { day: "Tuần 3", systolic: 128, diastolic: 82, heartRate: 76 },
                    { day: "Tuần 4", systolic: 126, diastolic: 81, heartRate: 75 },
                ],
            },
            journal: [
                {
                    id: "j-1",
                    date: "18/09/2026",
                    time: "10:30",
                    caregiver: "Điều dưỡng Nguyễn Thùy Linh",
                    caregiverAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
                    content: "Đo huyết áp (128/82 mmHg), kiểm tra nhịp tim (76 BPM) và hỗ trợ uống thuốc theo đơn buổi sáng. Bà ăn ngon miệng, tinh thần vui vẻ.",
                    vitals: { bp: "128/82 mmHg", hr: "76 BPM", temp: "36.7°C" },
                },
                {
                    id: "j-2",
                    date: "16/09/2026",
                    time: "09:15",
                    caregiver: "Điều dưỡng Nguyễn Thùy Linh",
                    caregiverAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
                    content: "Hỗ trợ vận động đi dạo quanh sân 20 phút, hướng dẫn bài tập thở sâu và xoa bóp khớp gối giảm nhức mỏi.",
                    vitals: { bp: "129/83 mmHg", hr: "77 BPM", temp: "36.6°C" },
                },
                {
                    id: "j-3",
                    date: "13/09/2026",
                    time: "14:00",
                    caregiver: "Điều dưỡng Lê Minh Tâm",
                    caregiverAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150",
                    content: "Kiểm tra sinh hiệu sau giấc ngủ trưa, đo đường huyết mao mạch trước bữa xế (6.1 mmol/L). Nhắc gia đình chuẩn bị tái khám theo hẹn.",
                    vitals: { bp: "131/84 mmHg", hr: "78 BPM", temp: "36.8°C" },
                },
            ],
        },
        binh: {
            name: "Ông Nguyễn Văn Bình",
            relation: "Bố (82 tuổi)",
            summary: {
                bloodPressure: "122/78",
                bloodPressureUnit: "mmHg",
                bloodPressureStatus: "Rất tốt",
                bloodPressureBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
                heartRate: "72",
                heartRateUnit: "BPM",
                heartRateStatus: "Ổn định",
                temperature: "36.8",
                temperatureUnit: "°C",
                temperatureStatus: "Bình thường",
                lastUpdate: "16/09/2026 – 15:45",
                updatedBy: "ĐD. Lê Minh Tâm",
            },
            notes: "Ông Bình đang trong giai đoạn hồi phục sau phẫu thuật thay khớp gối. Cần hỗ trợ tập vật lý trị liệu với khung tập đi, tránh té ngã và kiểm tra độ khô của vết mổ.",
            chartData: {
                week: [
                    { day: "T2", systolic: 125, diastolic: 80, heartRate: 74 },
                    { day: "T3", systolic: 123, diastolic: 79, heartRate: 73 },
                    { day: "T4", systolic: 124, diastolic: 79, heartRate: 75 },
                    { day: "T5", systolic: 121, diastolic: 78, heartRate: 72 },
                    { day: "T6", systolic: 122, diastolic: 78, heartRate: 72 },
                    { day: "T7", systolic: 120, diastolic: 77, heartRate: 71 },
                    { day: "CN", systolic: 122, diastolic: 78, heartRate: 72 },
                ],
                month: [
                    { day: "Tuần 1", systolic: 128, diastolic: 82, heartRate: 76 },
                    { day: "Tuần 2", systolic: 125, diastolic: 80, heartRate: 74 },
                    { day: "Tuần 3", systolic: 123, diastolic: 79, heartRate: 73 },
                    { day: "Tuần 4", systolic: 122, diastolic: 78, heartRate: 72 },
                ],
            },
            journal: [
                {
                    id: "j-b1",
                    date: "16/09/2026",
                    time: "15:45",
                    caregiver: "Điều dưỡng Lê Minh Tâm",
                    caregiverAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150",
                    content: "Kiểm tra vết mổ khớp gối khô ráo, không sưng đỏ. Hỗ trợ ông bước đi 30 mét với khung tập đi. Đo chỉ số sinh tồn ổn định.",
                    vitals: { bp: "122/78 mmHg", hr: "72 BPM", temp: "36.8°C" },
                },
                {
                    id: "j-b2",
                    date: "12/09/2026",
                    time: "14:30",
                    caregiver: "Điều dưỡng Lê Minh Tâm",
                    caregiverAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150",
                    content: "Thay băng vô trùng vết thương, massage cẳng chân giảm phù nề, hướng dẫn các bài gập duỗi thụ động tại giường.",
                    vitals: { bp: "124/80 mmHg", hr: "73 BPM", temp: "36.9°C" },
                },
            ],
        },
    };

    const currentReport = reportsData[selectedRelativeId];
    const currentChartData = currentReport.chartData[timeRange];

    return (
        <div className="p-6 sm:p-10 flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Header trang & Bộ chọn người thân */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200/60">
                            Theo dõi lâm sàng & Nhật ký
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#002045] mt-1.5 tracking-tight">
                        Báo cáo sức khỏe
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">
                        Theo dõi các chỉ số sức khỏe và nhật ký chăm sóc của người thân.
                    </p>
                </div>

                {/* Dropdown chọn người được chăm sóc */}
                <div className="flex items-center gap-2.5 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <label htmlFor="relativeSelect" className="text-xs font-semibold text-slate-500 pl-2">
                        Người được chăm sóc:
                    </label>
                    <select
                        id="relativeSelect"
                        value={selectedRelativeId}
                        onChange={(e) => setSelectedRelativeId(e.target.value)}
                        className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-[#002045] focus:outline-none focus:border-teal-600 cursor-pointer shadow-2xs"
                    >
                        <option value="lan">Bà Nguyễn Thị Lan (Mẹ)</option>
                        <option value="binh">Ông Nguyễn Văn Bình (Bố)</option>
                    </select>
                </div>
            </header>

            {/* Khu vực Tổng quan: 4 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Card 1: Huyết áp gần nhất */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Huyết áp gần nhất</span>
                        <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-bold text-[#002045]">
                                {currentReport.summary.bloodPressure}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{currentReport.summary.bloodPressureUnit}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${currentReport.summary.bloodPressureBadge}`}>
                                {currentReport.summary.bloodPressureStatus}
                            </span>
                            <span className="text-[11px] text-slate-400">Đạt mức mục tiêu</span>
                        </div>
                    </div>
                </div>

                {/* Card 2: Nhịp tim */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nhịp tim</span>
                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-bold text-[#002045]">
                                {currentReport.summary.heartRate}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{currentReport.summary.heartRateUnit}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {currentReport.summary.heartRateStatus}
                            </span>
                            <span className="text-[11px] text-slate-400">60 - 100 BPM chuẩn</span>
                        </div>
                    </div>
                </div>

                {/* Card 3: Thân nhiệt */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thân nhiệt</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 0a3.75 3.75 0 11-3.75-3.75H12z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-bold text-[#002045]">
                                {currentReport.summary.temperature}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{currentReport.summary.temperatureUnit}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {currentReport.summary.temperatureStatus}
                            </span>
                            <span className="text-[11px] text-slate-400">Không có sốt</span>
                        </div>
                    </div>
                </div>

                {/* Card 4: Cập nhật gần nhất */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lần cập nhật gần nhất</span>
                        <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <span className="text-sm sm:text-base font-bold text-[#002045] block">
                            {currentReport.summary.lastUpdate}
                        </span>
                        <p className="text-xs text-teal-700 font-semibold mt-1">
                            Bởi: {currentReport.summary.updatedBy}
                        </p>
                    </div>
                </div>
            </div>

            {/* Khu vực Biểu đồ Sức khỏe */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-base font-bold text-[#002045]">Chỉ số sức khỏe theo thời gian</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Biểu đồ biến thiên Huyết áp và Nhịp tim của {currentReport.name}</p>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setTimeRange("week")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                timeRange === "week"
                                    ? "bg-white text-[#002045] shadow-2xs"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            Tuần này
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeRange("month")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                timeRange === "month"
                                    ? "bg-white text-[#002045] shadow-2xs"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            Tháng này
                        </button>
                    </div>
                </div>

                {/* 2 Cột Biểu đồ: Huyết áp & Nhịp tim */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Biểu đồ 1: Huyết áp (Tâm thu / Tâm trương) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                            <h4 className="font-bold text-[#002045]">Huyết áp (mmHg)</h4>
                            <div className="flex items-center gap-3 text-[11px]">
                                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#002045]" />
                                    Tâm thu (Max)
                                </span>
                                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                                    Tâm trương (Min)
                                </span>
                            </div>
                        </div>

                        {/* Thanh Bar Visual */}
                        <div className="h-48 pt-4 flex items-end justify-between gap-2 border-b border-slate-100">
                            {currentChartData.map((item, idx) => {
                                // Scale max 160mmHg
                                const systolicHeight = (item.systolic / 160) * 100;
                                const diastolicHeight = (item.diastolic / 160) * 100;

                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                                        <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-36">
                                            {/* Bar Tâm thu */}
                                            <div
                                                className="w-3 bg-[#002045] hover:bg-[#003470] rounded-t-sm transition-all"
                                                style={{ height: `${systolicHeight}%` }}
                                                title={`Tâm thu: ${item.systolic} mmHg`}
                                            />
                                            {/* Bar Tâm trương */}
                                            <div
                                                className="w-3 bg-teal-500 hover:bg-teal-600 rounded-t-sm transition-all"
                                                style={{ height: `${diastolicHeight}%` }}
                                                title={`Tâm trương: ${item.diastolic} mmHg`}
                                            />
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-500">{item.day}</span>

                                        {/* Tooltip Hover */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#102030] text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-md">
                                            {item.systolic}/{item.diastolic} mmHg
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Biểu đồ 2: Nhịp tim (BPM) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                            <h4 className="font-bold text-[#002045]">Nhịp tim theo ngày (BPM)</h4>
                            <span className="text-[11px] text-slate-400">Trung bình: ~75 BPM</span>
                        </div>

                        {/* Đường xu hướng nhịp tim */}
                        <div className="h-48 pt-4 flex items-end justify-between gap-2 border-b border-slate-100">
                            {currentChartData.map((item, idx) => {
                                // Scale max 100 BPM
                                const heightPercent = (item.heartRate / 100) * 100;

                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                                        <div className="w-full flex items-end justify-center h-36">
                                            <div
                                                className="w-full max-w-[20px] bg-gradient-to-t from-rose-100 to-rose-400 hover:to-rose-500 rounded-t-md transition-all relative"
                                                style={{ height: `${heightPercent}%` }}
                                            >
                                                <span className="w-2 h-2 rounded-full bg-rose-600 absolute -top-1 left-1/2 -translate-x-1/2 ring-2 ring-white" />
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-500">{item.day}</span>

                                        {/* Tooltip Hover */}
                                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#102030] text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-md">
                                            {item.heartRate} BPM
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Khu vực Nhật ký Chăm sóc (Care Timeline) */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                        <h3 className="text-base font-bold text-[#002045]">Nhật ký chăm sóc điều dưỡng</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Ghi nhận trực tiếp từ điều dưỡng viên sau mỗi buổi chăm sóc tại nhà.
                        </p>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                        {currentReport.journal.length} lần cập nhật
                    </span>
                </div>

                {/* Timeline danh sách */}
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {currentReport.journal.map((log) => {
                        return (
                            <div key={log.id} className="relative group">
                                {/* Dấu chấm tròn trên trục timeline */}
                                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-3 border-teal-600 ring-4 ring-white" />

                                <div className="bg-slate-50/80 hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60">
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                src={log.caregiverAvatar}
                                                alt={log.caregiver}
                                                className="w-8 h-8 rounded-full object-cover ring-1 ring-teal-500/30"
                                            />
                                            <div>
                                                <h4 className="text-xs sm:text-sm font-bold text-[#002045]">
                                                    {log.caregiver}
                                                </h4>
                                                <span className="text-[11px] text-teal-700 font-medium">
                                                    Đã xác thực chữ ký y tế
                                                </span>
                                            </div>
                                        </div>

                                        <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 self-start sm:self-auto">
                                            {log.date} • {log.time}
                                        </span>
                                    </div>

                                    {/* Nội dung ghi chú */}
                                    <p className="text-xs sm:text-sm text-slate-700 mt-3 leading-relaxed">
                                        {log.content}
                                    </p>

                                    {/* Chỉ số đo được */}
                                    {log.vitals && (
                                        <div className="mt-3 pt-2.5 flex flex-wrap gap-2 text-xs">
                                            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                                                Huyết áp: <strong className="text-[#002045]">{log.vitals.bp}</strong>
                                            </span>
                                            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                                                Nhịp tim: <strong className="text-rose-600">{log.vitals.hr}</strong>
                                            </span>
                                            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                                                Thân nhiệt: <strong className="text-amber-700">{log.vitals.temp}</strong>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lưu ý sức khỏe quan trọng */}
            <div className="bg-teal-50/80 border border-teal-200/80 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-[#002045]">Lưu ý sức khỏe quan trọng từ Điều dưỡng</h4>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                        {currentReport.notes}
                    </p>
                </div>
            </div>
        </div>
    );
}
