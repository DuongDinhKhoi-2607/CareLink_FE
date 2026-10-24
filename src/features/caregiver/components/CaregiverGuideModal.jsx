import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CaregiverGuideModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const tabs = [
        { id: "overview", label: "🌟 Quy trình tổng quan", icon: "clipboard-list" },
        { id: "verification", label: "1. Hồ sơ & Bằng cấp", icon: "identification" },
        { id: "location", label: "2. Điểm xuất phát & Bán kính", icon: "map-pin" },
        { id: "schedule_pricing", label: "3. Lịch rảnh & Bảng giá", icon: "calendar" },
        { id: "proposals_chat", label: "4. Nhận ca & Đàm phán", icon: "chat-bubble" },
        { id: "clinical_record", label: "5. Khám & Bệnh án", icon: "heart" },
        { id: "wallet_payout", label: "6. Ví tiền & Rút thù lao", icon: "banknotes" },
    ];

    const handleNavigate = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 sm:py-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden text-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── HEADER MODAL ── */}
                <div className="px-6 py-5 bg-gradient-to-r from-[#102030] via-[#004e5e] to-[#00677c] text-white flex items-start justify-between gap-4 shrink-0 shadow-sm">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-semibold text-teal-100 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Cẩm nang Điều dưỡng CareLink Medical Care
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            Hướng dẫn sử dụng toàn diện Dashboard Điều dưỡng
                        </h2>
                        <p className="text-xs sm:text-sm text-teal-50/80 mt-1 max-w-2xl font-normal leading-relaxed">
                            Cẩm nang từng bước giúp bạn nộp chứng chỉ, cài đặt lịch rảnh, đàm phán ca trực, ghi bệnh án lâm sàng và rút 100% thù lao an toàn.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                        title="Đóng cẩm nang"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── TABS NAVIGATION (HORIZONTALLY SCROLLABLE) ── */}
                <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 overflow-x-auto no-scrollbar shrink-0">
                    {tabs.map((t) => {
                        const isActive = activeTab === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setActiveTab(t.id)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                                    isActive
                                        ? "bg-[#00677c] text-white shadow-xs"
                                        : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70"
                                }`}
                            >
                                <span>{t.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ── MODAL CONTENT BODY ── */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
                    {/* TAB: OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="space-y-6 animate-in fade-in duration-150">
                            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/70 flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#00677c] text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                                    💡
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-[#102030] text-sm">
                                        Quy tắc 4 Điều kiện sẵn sàng nhận ca (Readiness Invariant)
                                    </h4>
                                    <p className="text-slate-600 mt-1 text-xs">
                                        Để xuất hiện trong danh sách tìm kiếm của các gia đình, tài khoản điều dưỡng cần đạt đủ 4 điều kiện:
                                        <br />
                                        <b>(1) Hồ sơ đã duyệt</b> (Admin phê duyệt CCCD/CCHN) · <b>(2) Điểm xuất phát & bán kính</b> · <b>(3) Có ít nhất 1 khung giờ rảnh trong tuần</b> · <b>(4) Đã bật ít nhất 1 dịch vụ trong bảng giá</b>.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-teal-300 transition-all space-y-2">
                                    <div className="flex items-center gap-2 text-[#00677c] font-bold text-sm">
                                        <span className="w-6 h-6 rounded-lg bg-teal-100 text-[#00677c] flex items-center justify-center text-xs">1</span>
                                        Xác minh danh tính y tế
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Chụp CCCD 2 mặt, thẻ sinh viên y khoa (nếu là sinh viên) hoặc Bằng tốt nghiệp + CCHN. Admin sẽ đối soát và duyệt trong 24h.
                                    </p>
                                </div>

                                <div className="p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-teal-300 transition-all space-y-2">
                                    <div className="flex items-center gap-2 text-[#00677c] font-bold text-sm">
                                        <span className="w-6 h-6 rounded-lg bg-teal-100 text-[#00677c] flex items-center justify-center text-xs">2</span>
                                        Cài đặt Lịch rảnh & Bảng giá
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Bật các ca trực rảnh trong tuần (6:00 - 22:00) và điều chỉnh đơn giá phù hợp cho từng gói chăm sóc mà bạn muốn nhận.
                                    </p>
                                </div>

                                <div className="p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-teal-300 transition-all space-y-2">
                                    <div className="flex items-center gap-2 text-[#00677c] font-bold text-sm">
                                        <span className="w-6 h-6 rounded-lg bg-teal-100 text-[#00677c] flex items-center justify-center text-xs">3</span>
                                        Tiếp nhận ca & Đàm phán Chat
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Gia đình gửi yêu cầu hoặc nhắn tin trao đổi. Khi chấp thuận, hệ thống khóa lịch giữ chỗ 30 phút để gia đình thanh toán Escrow.
                                    </p>
                                </div>

                                <div className="p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-teal-300 transition-all space-y-2">
                                    <div className="flex items-center gap-2 text-[#00677c] font-bold text-sm">
                                        <span className="w-6 h-6 rounded-lg bg-teal-100 text-[#00677c] flex items-center justify-center text-xs">4</span>
                                        Thực hiện ca & Rút 100% thù lao
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Bấm Check-in bắt đầu ca, điền bệnh án sinh hiệu, nghiệm thu 2 chiều. Tiền chuyển ngay vào ví cá nhân và rút về ngân hàng bất kỳ lúc nào.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: VERIFICATION */}
                    {activeTab === "verification" && (
                        <div className="space-y-4 animate-in fade-in duration-150">
                            <h3 className="font-bold text-[#102030] text-base flex items-center gap-2">
                                <span>📑</span> Quy trình xét duyệt hồ sơ & Chứng chỉ hành nghề
                            </h3>
                            <p className="text-slate-600 text-xs">
                                CareLink là nền tảng y tế chuẩn chỉ. Chúng tôi phân loại điều dưỡng thành 2 nhóm chuyên môn:
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
                                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-sky-600 text-white font-bold text-[11px]">
                                        Sinh viên y khoa / Điều dưỡng
                                    </span>
                                    <p className="text-xs text-slate-700">
                                        Yêu cầu: CCCD 2 mặt + Thẻ sinh viên còn hạn hoặc Giấy xác nhận từ trường đại học/cao đẳng y dược. Có thể xác thực nhanh qua Email sinh viên (.edu.vn).
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#00677c] text-white font-bold text-[11px]">
                                        Điều dưỡng chính quy / Cử nhân
                                    </span>
                                    <p className="text-xs text-slate-700">
                                        Yêu cầu: CCCD 2 mặt + Bằng tốt nghiệp Đại học/Cao đẳng Y tế + Chứng chỉ hành nghề (CCHN) do Sở Y tế hoặc Bộ Y tế cấp.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5 text-xs text-amber-900">
                                <strong>⚠️ Lưu ý quan trọng:</strong>
                                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                                    <li>Ảnh chụp cần rõ nét, đủ 4 góc, không lóa sáng hoặc mất chữ.</li>
                                    <li>Thời gian Admin xét duyệt hồ sơ là <b>tối đa 24 giờ làm việc</b>. Nếu có sai sót, bạn sẽ nhận được thông báo yêu cầu nộp lại chứng từ cụ thể.</li>
                                </ul>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => handleNavigate("/caregiver/choose-role")}
                                    className="px-4 py-2.5 rounded-xl bg-[#00677c] hover:bg-[#005466] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                    <span>Đến trang Nộp hồ sơ xác thực</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: LOCATION */}
                    {activeTab === "location" && (
                        <div className="space-y-4 animate-in fade-in duration-150">
                            <h3 className="font-bold text-[#102030] text-base flex items-center gap-2">
                                <span>📍</span> Cấu hình Điểm xuất phát & Bán kính nhận ca (Thuật toán Haversine)
                            </h3>
                            <p className="text-slate-600 text-xs">
                                Khi gia đình tìm điều dưỡng, CareLink sử dụng thuật toán khoảng cách đường chim bay (Haversine Distance) để ghép ca phù hợp nhất nhằm tối ưu quãng đường di chuyển cho bạn.
                            </p>

                            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold">1</div>
                                    <div>
                                        <strong className="text-slate-900">Địa chỉ thường trú / Điểm xuất phát:</strong>
                                        <p className="text-slate-600 mt-0.5">
                                            Là địa chỉ nhà bạn hoặc trạm y tế nơi bạn bắt đầu di chuyển (ví dụ: 123 Đường Gia Trí, P.25, Bình Thạnh, TP.HCM).
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold">2</div>
                                    <div>
                                        <strong className="text-slate-900">Bán kính nhận ca tối đa (Service Radius):</strong>
                                        <p className="text-slate-600 mt-0.5">
                                            Bạn có thể đặt từ <b>1 km đến 50 km</b> (khuyến nghị 10 - 15 km). Hệ thống sẽ không phân phối các ca ở ngoài bán kính này, tránh làm mất thời gian di chuyển của bạn.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold">3</div>
                                    <div>
                                        <strong className="text-slate-900">Đồng bộ 2 chiều:</strong>
                                        <p className="text-slate-600 mt-0.5">
                                            Bạn có thể cập nhật điểm xuất phát ở cả trang <b>Hồ sơ năng lực</b> lẫn trang <b>Lịch làm việc</b>, hệ thống tự động đồng bộ ngay lập tức!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleNavigate("/caregiver/schedule")}
                                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                                >
                                    Xem trên Lịch làm việc
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNavigate("/caregiver/profile")}
                                    className="px-4 py-2.5 rounded-xl bg-[#00677c] hover:bg-[#005466] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                    <span>Cài đặt tại Hồ sơ năng lực</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: SCHEDULE & PRICING */}
                    {activeTab === "schedule_pricing" && (
                        <div className="space-y-4 animate-in fade-in duration-150">
                            <h3 className="font-bold text-[#102030] text-base flex items-center gap-2">
                                <span>📅</span> Quản lý Lịch rảnh tuần & Bảng giá dịch vụ cá nhân
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                                    <h4 className="font-bold text-[#00677c] text-sm">🗓️ Lịch rảnh định kỳ (Weekly Availability)</h4>
                                    <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                                        <li>Bấm trực tiếp vào các ô giờ từ Thứ 2 đến Chủ Nhật (khung giờ 06:00 – 22:00) để bật/tắt rảnh.</li>
                                        <li>Có thể dùng nút <b>"Bật rảnh cả tuần"</b> hoặc <b>"Bật rảnh hôm nay"</b> để cài đặt siêu tốc.</li>
                                        <li>Sau khi chọn, nhớ bấm nút <b>"Lưu & Đồng bộ lịch tuần"</b> để lưu vào máy chủ.</li>
                                        <li>Đăng ký <b>Ngày bận đột xuất (Blackout Dates)</b> khi có việc bận đột xuất để khách không book vào ngày đó.</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                                    <h4 className="font-bold text-[#00677c] text-sm">💵 Bảng giá dịch vụ cá nhân (Custom Pricing)</h4>
                                    <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                                        <li>Mỗi điều dưỡng có quyền tự định giá thù lao dựa trên tay nghề và kinh nghiệm của mình.</li>
                                        <li>Bật/Tắt các dịch vụ bạn tự tin thực hiện (Chăm sóc cơ bản, Thay băng cắt chỉ, Đặt sonde, Phục hồi chức năng...).</li>
                                        <li>Đơn giá này là số tiền bạn sẽ nhận được (chưa bao gồm 60k phí nền tảng mà sàn thu riêng từ khách).</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleNavigate("/caregiver/pricing")}
                                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                                >
                                    Đến Bảng giá dịch vụ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNavigate("/caregiver/schedule")}
                                    className="px-4 py-2.5 rounded-xl bg-[#00677c] hover:bg-[#005466] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                    <span>Đến Lịch làm việc & Nhận ca</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: PROPOSALS & CHAT */}
                    {activeTab === "proposals_chat" && (
                        <div className="space-y-4 animate-in fade-in duration-150">
                            <h3 className="font-bold text-[#102030] text-base flex items-center gap-2">
                                <span>💬</span> Nhận ca trực & Đàm phán Đề xuất trong Hộp thoại (Chat Proposal)
                            </h3>
                            <p className="text-slate-600 text-xs">
                                CareLink mang đến tính năng độc quyền: <b>Đàm phán ca trực trực tiếp qua tin nhắn</b> giữa Gia đình và Điều dưỡng.
                            </p>

                            <div className="space-y-2.5 text-xs">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                                    <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md text-[11px]">1</span>
                                    <div>
                                        <strong className="text-slate-900">Trao đổi tình trạng người bệnh:</strong>
                                        <p className="text-slate-600 mt-0.5">Khách hàng sẽ gửi tin nhắn mô tả tiền sử bệnh án, nhu cầu điều trị hoặc hỏi về kỹ năng của bạn.</p>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                                    <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md text-[11px]">2</span>
                                    <div>
                                        <strong className="text-slate-900">Khách gửi Đề xuất ca (Booking Proposal):</strong>
                                        <p className="text-slate-600 mt-0.5">Thẻ đề xuất sẽ hiện ngay trong khung chat với đầy đủ: Giờ trực, Dịch vụ, Địa chỉ và Tổng tiền.</p>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                                    <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md text-[11px]">3</span>
                                    <div>
                                        <strong className="text-slate-900">Bấm "Chấp thuận" → Khóa lịch 30 phút:</strong>
                                        <p className="text-slate-600 mt-0.5">Khi bạn bấm Chấp thuận, hệ thống lập tức khóa khung giờ đó của bạn và tạo đơn chờ thanh toán trong 30 phút. Nếu khách thanh toán thành công, ca trực chính thức được xác nhận!</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => handleNavigate("/caregiver/messages")}
                                    className="px-4 py-2.5 rounded-xl bg-[#00677c] hover:bg-[#005466] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                    <span>Mở Hộp thư & Đàm phán</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: CLINICAL RECORD */}
                    {activeTab === "clinical_record" && (
                        <div className="space-y-4 animate-in fade-in duration-150">
                            <h3 className="font-bold text-[#102030] text-base flex items-center gap-2">
                                <span>🩺</span> Thực hiện ca trực, Bệnh án lâm sàng & Nghiệm thu 2 chiều
                            </h3>
                            <p className="text-slate-600 text-xs">
                                Nhằm bảo đảm an toàn y tế và sự minh bạch, CareLink áp dụng quy trình kiểm soát chất lượng chuẩn bệnh viện:
                            </p>

                            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-3 text-xs">
                                <div>
                                    <strong className="text-[#00677c] font-bold text-sm block">1. Bắt đầu ca trực (Check-in):</strong>
                                    <p className="text-slate-600 mt-0.5">
                                        Khi có mặt tại nhà khách hàng đúng giờ hẹn, bạn bấm <b>"Bắt đầu ca trực"</b> trên màn hình Chi tiết ca hẹn. Trạng thái ca chuyển sang <code>InProgress</code>.
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-teal-200/50">
                                    <strong className="text-[#00677c] font-bold text-sm block">2. Ghi nhận Bệnh án lâm sàng (Health Record):</strong>
                                    <p className="text-slate-600 mt-0.5">
                                        Trong quá trình chăm sóc, bạn đo và nhập các chỉ số sinh hiệu: Huyết áp (Tâm thu/Tâm trương), Mạch, Nhiệt độ (°C), Đường huyết (mmol/L), Tình trạng vết thương, Vận động và Ghi chú dặn dò.
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-teal-200/50">
                                    <strong className="text-[#00677c] font-bold text-sm block">3. Nghiệm thu 2 chiều & Ký xác nhận:</strong>
                                    <p className="text-slate-600 mt-0.5">
                                        Sau khi nộp bệnh án, Điều dưỡng bấm <b>"Ký xác nhận hoàn tất"</b>. Gia đình xem lại báo cáo y tế và cũng bấm ký xác nhận. Tiền thù lao lập tức được giải ngân vào ví của bạn!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: WALLET & PAYOUT */}
                    {activeTab === "wallet_payout" && (
                        <div className="space-y-4 animate-in fade-in duration-150">
                            <h3 className="font-bold text-[#102030] text-base flex items-center gap-2">
                                <span>💰</span> Ví thu nhập & Tạo lệnh rút tiền về Ngân hàng
                            </h3>

                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5 text-xs text-emerald-900">
                                <strong>💎 Chính sách tài chính minh bạch của CareLink:</strong>
                                <p className="text-slate-700">
                                    CareLink chỉ thu <b>60.000 VNĐ phí sàn / ca</b> được cộng trực tiếp vào hóa đơn của Khách hàng. Toàn bộ số tiền dịch vụ bạn thỏa thuận với khách sẽ được chuyển <b>100% nguyên vẹn</b> vào Ví điều dưỡng của bạn mà không bị trừ hoa hồng!
                                </p>
                            </div>

                            <div className="space-y-2.5 text-xs">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                                    <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md text-[11px]">1</span>
                                    <div>
                                        <strong className="text-slate-900">Kiểm tra số dư khả dụng:</strong>
                                        <p className="text-slate-600 mt-0.5">Vào mục <b>Ví & Rút tiền</b>, bạn có thể xem số dư khả dụng, tổng thu nhập tích lũy và sao kê từng giao dịch cộng/trừ tiền minh bạch.</p>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                                    <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md text-[11px]">2</span>
                                    <div>
                                        <strong className="text-slate-900">Tạo lệnh rút tiền (Payout Request):</strong>
                                        <p className="text-slate-600 mt-0.5">Nhập số tiền muốn rút (tối thiểu 50.000đ), chọn Ngân hàng, nhập Số tài khoản và Tên chủ tài khoản chính chủ.</p>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                                    <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md text-[11px]">3</span>
                                    <div>
                                        <strong className="text-slate-900">Xử lý chuyển khoản:</strong>
                                        <p className="text-slate-600 mt-0.5">Ban quản trị sẽ đối soát và giải ngân qua chuyển khoản ngân hàng trong vòng vài giờ làm việc kèm mã tham chiếu chuyển khoản.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => handleNavigate("/caregiver/wallet")}
                                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                    <span>Đến trang Ví & Rút tiền</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── FOOTER ACTIONS ── */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                        Cần hỗ trợ trực tiếp? Hotline y tế 24/7: <b className="text-slate-700">1900 6868</b>
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#102030] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer ml-auto"
                    >
                        Đã hiểu & Bắt đầu làm việc
                    </button>
                </div>
            </div>
        </div>
    );
}
