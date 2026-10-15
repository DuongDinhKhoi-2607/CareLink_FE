import React, { useState } from "react";

export default function CaregiverWallet() {
    // ── STATE SỐ DƯ & VÍ ĐIỀU DƯỠNG (KHỚP CHUẨN DTO BACKEND: WalletResponse & PayoutResponse) ──
    const [wallet, setWallet] = useState({
        balance: 4250000, // Tổng số dư ví thực tế
        availableBalance: 2250000, // Số dư khả dụng (Balance - PendingPayout theo DTO BE)
        pendingPayout: 2000000, // Tiền đang chờ Admin đối soát & duyệt rút (PendingPayout)
        totalEarned: 18600000, // Tổng thu nhập lũy kế
        totalWithdrawn: 5000000, // Tổng tiền đã rút thành công
        bankAccount: {
            bankName: "Vietcombank (Ngân hàng Ngoại thương Việt Nam)",
            accountNumber: "1018992345",
            accountHolder: "NGUYEN THUY LINH",
        },
    });

    // ── DANH SÁCH YÊU CẦU RÚT TIỀN (PAYOUTS) ──
    const [payouts, setPayouts] = useState([
        {
            id: "PO-20261014-01",
            createdAt: "14/10/2026 – 09:30",
            amount: 2000000,
            bankName: "Vietcombank",
            accountNumber: "1018992345",
            accountHolder: "NGUYEN THUY LINH",
            status: "pending", // pending | approved | rejected
            statusLabel: "Chờ Admin duyệt",
            statusColor: "bg-amber-50 text-amber-700 border-amber-200",
            referenceCode: null,
            note: "Rút tiền phụ cấp đợt 1 tháng 10",
        },
        {
            id: "PO-20261005-02",
            createdAt: "05/10/2026 – 16:45",
            amount: 3500000,
            bankName: "Vietcombank",
            accountNumber: "1018992345",
            accountHolder: "NGUYEN THUY LINH",
            status: "approved",
            statusLabel: "Đã chuyển khoản",
            statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
            referenceCode: "FT261005881923",
            note: "Thanh toán thành công qua Napas247",
        },
        {
            id: "PO-20260925-01",
            createdAt: "25/09/2026 – 14:10",
            amount: 1500000,
            bankName: "Vietcombank",
            accountNumber: "1018992345",
            accountHolder: "NGUYEN THUY LINH",
            status: "approved",
            statusLabel: "Đã chuyển khoản",
            statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
            referenceCode: "FT260925102941",
            note: "Đã giải ngân",
        },
    ]);

    // ── LỊCH SỬ BIẾN ĐỘNG SỐ DƯ (TRANSACTIONS - CỐ ĐỊNH PHÍ SÀN 50K/CA THEO NGHIỆP VỤ) ──
    const [transactions, setTransactions] = useState([
        {
            id: "TX-109",
            date: "14/10/2026 18:00",
            title: "Thu nhập ca chăm sóc #CK-28491",
            type: "earning",
            amount: 420000,
            balanceAfter: 4250000,
            note: "Bà Nguyễn Thị Lan – Phục hồi chức năng 4 giờ",
        },
        {
            id: "TX-108",
            date: "14/10/2026 18:00",
            title: "Phí dịch vụ nền tảng CareLink",
            type: "platform_fee",
            amount: -50000,
            balanceAfter: 3830000,
            note: "Phí sàn cố định 50.000 VNĐ / ca hoàn thành",
        },
        {
            id: "TX-107",
            date: "14/10/2026 09:30",
            title: "Tạo lệnh rút tiền về ngân hàng",
            type: "payout",
            amount: -2000000,
            balanceAfter: 3880000,
            note: "Lệnh PO-20261014-01 đang chờ xử lý",
        },
        {
            id: "TX-106",
            date: "13/10/2026 12:30",
            title: "Thu nhập ca chăm sóc #CK-28310",
            type: "earning",
            amount: 540000,
            balanceAfter: 5880000,
            note: "Ông Nguyễn Văn Bình – Kiểm tra huyết áp & vận động",
        },
        {
            id: "TX-105",
            date: "13/10/2026 12:30",
            title: "Phí dịch vụ nền tảng CareLink",
            type: "platform_fee",
            amount: -50000,
            balanceAfter: 5340000,
            note: "Phí sàn cố định 50.000 VNĐ / ca hoàn thành",
        },
    ]);

    // ── MODAL RÚT TIỀN ──
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [payoutForm, setPayoutForm] = useState({
        amount: "",
        bankName: "Vietcombank",
        accountNumber: "1018992345",
        accountHolder: "NGUYEN THUY LINH",
        note: "",
    });
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleCreatePayout = (e) => {
        e.preventDefault();
        const withdrawAmount = Number(payoutForm.amount);

        // Quy chuẩn Backend CreatePayoutRequest: Range(50_000, 1_000_000_000)
        if (isNaN(withdrawAmount) || withdrawAmount < 50000) {
            alert("Số tiền rút tối thiểu là 50.000 VNĐ theo quy định hệ thống!");
            return;
        }

        if (withdrawAmount > wallet.availableBalance) {
            alert(`Số tiền rút vượt quá số dư khả dụng hiện có (${wallet.availableBalance.toLocaleString("vi-VN")} ₫)!`);
            return;
        }

        const cleanAccNumber = payoutForm.accountNumber.trim();
        // Quy chuẩn Backend: RegularExpression(@"^[0-9]{6,30}$")
        if (!/^\d{6,30}$/.test(cleanAccNumber)) {
            alert("Số tài khoản ngân hàng chỉ được gồm từ 6 đến 30 chữ số!");
            return;
        }

        const newPayout = {
            id: `PO-${Date.now().toString().slice(-8)}`,
            createdAt: "Vừa xong",
            amount: withdrawAmount,
            bankName: payoutForm.bankName,
            accountNumber: cleanAccNumber,
            accountHolder: payoutForm.accountHolder.trim().toUpperCase(),
            status: "pending",
            statusLabel: "Chờ Admin duyệt",
            statusColor: "bg-amber-50 text-amber-700 border-amber-200",
            referenceCode: null,
            note: payoutForm.note || "Yêu cầu rút tiền về tài khoản",
        };

        const newTransaction = {
            id: `TX-${Date.now().toString().slice(-4)}`,
            date: "Vừa xong",
            title: "Lệnh rút tiền (Chờ đối soát)",
            type: "payout",
            amount: -withdrawAmount,
            balanceAfter: wallet.availableBalance - withdrawAmount,
            note: `Lệnh ${newPayout.id} gửi tới ${payoutForm.bankName}`,
        };

        // Khấu trừ số dư khả dụng và tăng pendingPayout (Khớp chuẩn logic Backend: AvailableBalance = Balance - PendingPayout)
        setWallet((prev) => ({
            ...prev,
            availableBalance: prev.availableBalance - withdrawAmount,
            pendingPayout: prev.pendingPayout + withdrawAmount,
        }));
        setPayouts((prev) => [newPayout, ...prev]);
        setTransactions((prev) => [newTransaction, ...prev]);
        setIsPayoutModalOpen(false);
        setPayoutForm({ ...payoutForm, amount: "", note: "" });
        showToast("Đã gửi yêu cầu rút tiền thành công! Admin sẽ duyệt và giải ngân.");
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
                            Tài chính điều dưỡng
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                            Cập nhật theo thời gian thực
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002045] mt-1.5 tracking-tight">
                        Ví thu nhập & Yêu cầu rút tiền
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Theo dõi số dư nhận ca, biến động ví và rút tiền về tài khoản ngân hàng cá nhân
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsPayoutModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer self-start sm:self-auto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Yêu cầu rút tiền
                </button>
            </header>

            {/* ── CARD 1: CÁC THẺ CHỈ SỐ TÀI CHÍNH (ĐỒNG BỘ CHÍNH XÁC BACKEND DTO: WalletResponse) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Số dư khả dụng (AvailableBalance = Balance - PendingPayout) */}
                <div className="bg-gradient-to-br from-[#00677c] to-[#004756] text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                    <div className="relative z-10">
                        <span className="text-teal-200 text-xs font-semibold tracking-wide uppercase">Số dư khả dụng</span>
                        <h2 className="text-3xl font-extrabold mt-1 tracking-tight">
                            {wallet.availableBalance.toLocaleString("vi-VN")} <span className="text-lg font-bold text-teal-200">₫</span>
                        </h2>
                    </div>
                    <div className="relative z-10 flex items-center justify-between text-xs text-teal-100 pt-2 border-t border-teal-500/30">
                        <span>Sẵn sàng rút về ngân hàng</span>
                        <span className="underline cursor-pointer" onClick={() => setIsPayoutModalOpen(true)}>Rút ngay →</span>
                    </div>
                    {/* Decorative shape */}
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-md pointer-events-none"></div>
                </div>

                {/* Tiền chờ duyệt rút (PendingPayout) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between min-h-[140px]">
                    <div>
                        <span className="text-slate-400 text-xs font-semibold tracking-wide uppercase">Chờ Admin duyệt rút (Pending)</span>
                        <h2 className="text-3xl font-extrabold text-[#002045] mt-1 tracking-tight">
                            {wallet.pendingPayout.toLocaleString("vi-VN")} <span className="text-lg font-bold text-slate-400">₫</span>
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                        Tổng các lệnh rút đang chờ Quản trị viên đối soát & giải ngân Napas
                    </p>
                </div>

                {/* Tổng thu nhập tích lũy */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between min-h-[140px]">
                    <div>
                        <span className="text-slate-400 text-xs font-semibold tracking-wide uppercase">Tổng thu nhập tích lũy</span>
                        <h2 className="text-3xl font-extrabold text-emerald-700 mt-1 tracking-tight">
                            {wallet.totalEarned.toLocaleString("vi-VN")} <span className="text-lg font-bold text-slate-400">₫</span>
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                        Đã khấu trừ phí sàn 50.000đ/ca minh bạch theo từng ca trực
                    </p>
                </div>
            </div>

            {/* ── BANNER CHÍNH SÁCH PHÍ NỀN TẢNG (QUY TẮC BẮT BUỘC) ── */}
            <div className="bg-teal-50/60 border border-teal-200/70 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-teal-900 font-bold block mb-0.5">
                        Chính sách phí nền tảng CareLink: Cố định 50.000 VNĐ / ca trực hoàn thành
                    </strong>
                    CareLink chỉ thu một mức phí vận hành duy nhất là 50.000đ khi ca trực hoàn tất thành công. Nền tảng không thu thêm bất kỳ tỷ lệ phần trăm nào trên tiền thù lao của điều dưỡng. Thu nhập của bạn được đảm bảo minh bạch 100%.
                </div>
            </div>

            {/* ── SECTION 2: LỊCH SỬ YÊU CẦU RÚT TIỀN (PAYOUTS) ── */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#002045]">Yêu cầu rút tiền gần đây</h3>
                            <p className="text-xs text-slate-500">Trạng thái giải ngân về tài khoản ngân hàng của bạn</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                                <th className="pb-3">Mã yêu cầu</th>
                                <th className="pb-3">Thời gian tạo</th>
                                <th className="pb-3">Số tiền rút</th>
                                <th className="pb-3">Ngân hàng thụ hưởng</th>
                                <th className="pb-3">Trạng thái</th>
                                <th className="pb-3">Mã tham chiếu / Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payouts.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-3.5 font-bold font-mono text-[#002045]">{p.id}</td>
                                    <td className="py-3.5 text-slate-500">{p.createdAt}</td>
                                    <td className="py-3.5 font-bold text-teal-800 text-sm">
                                        {p.amount.toLocaleString("vi-VN")} ₫
                                    </td>
                                    <td className="py-3.5 text-slate-700">
                                        <div>{p.bankName}</div>
                                        <span className="text-[11px] text-slate-400 font-mono">{p.accountNumber}</span>
                                    </td>
                                    <td className="py-3.5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${p.statusColor}`}>
                                            {p.statusLabel}
                                        </span>
                                    </td>
                                    <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                                        {p.referenceCode ? (
                                            <span className="text-emerald-700 font-semibold">Ref: {p.referenceCode}</span>
                                        ) : (
                                            <span className="text-slate-400 italic">{p.note}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── SECTION 3: LỊCH SỬ BIẾN ĐỘNG SỐ DƯ (TRANSACTIONS) ── */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#002045]">Lịch sử giao dịch ví</h3>
                            <p className="text-xs text-slate-500">Minh bạch từng dòng tiền cộng tiền ca và trừ phí dịch vụ</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                        <div key={t.id} className="py-3.5 flex items-center justify-between gap-4 text-xs hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                                        t.type === "earning"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : t.type === "platform_fee"
                                            ? "bg-amber-50 text-amber-600"
                                            : "bg-blue-50 text-blue-600"
                                    }`}
                                >
                                    {t.type === "earning" ? "↓" : t.type === "platform_fee" ? "⚡" : "↑"}
                                </div>
                                <div>
                                    <p className="font-bold text-[#002045] text-sm">{t.title}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{t.date} · {t.note}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p
                                    className={`font-bold text-sm ${
                                        t.amount > 0 ? "text-emerald-600" : "text-slate-700"
                                    }`}
                                >
                                    {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString("vi-VN")} ₫
                                </p>
                                <span className="text-[10px] text-slate-400">
                                    Số dư sau GD: {t.balanceAfter.toLocaleString("vi-VN")} ₫
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── MODAL TẠO YÊU CẦU RÚT TIỀN ── */}
            {isPayoutModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-lg p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-[#002045]">Yêu cầu rút tiền về ngân hàng</h3>
                                <p className="text-xs text-slate-500">Chuyển tiền từ ví CareLink về tài khoản chính chủ của bạn</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPayoutModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Thẻ hiển thị số dư khả dụng */}
                        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
                            <div>
                                <span className="text-slate-500 text-xs block">Số dư khả dụng hiện tại:</span>
                                <strong className="text-xl text-[#00677c] font-extrabold">
                                    {wallet.availableBalance.toLocaleString("vi-VN")} ₫
                                </strong>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPayoutForm({ ...payoutForm, amount: wallet.availableBalance.toString() })}
                                className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                            >
                                Rút tất cả
                            </button>
                        </div>

                        <form onSubmit={handleCreatePayout} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Số tiền muốn rút (VNĐ) *</label>
                                <input
                                    type="number"
                                    required
                                    min="50000"
                                    max={wallet.availableBalance}
                                    step="50000"
                                    value={payoutForm.amount}
                                    onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                                    placeholder="Tối thiểu 50.000 ₫ (Khớp DTO BE)"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white text-sm font-bold text-[#002045]"
                                />
                                <div className="flex gap-2 pt-2">
                                    {[200000, 500000, 1000000, 2000000].map((quick) => (
                                        <button
                                            key={quick}
                                            type="button"
                                            disabled={quick > wallet.availableBalance}
                                            onClick={() => setPayoutForm({ ...payoutForm, amount: quick.toString() })}
                                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 text-[11px] font-medium cursor-pointer"
                                        >
                                            {(quick / 1000).toLocaleString("vi-VN")}k
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-700 font-semibold mb-1">Ngân hàng thụ hưởng *</label>
                                    <select
                                        value={payoutForm.bankName}
                                        onChange={(e) => setPayoutForm({ ...payoutForm, bankName: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                    >
                                        <option value="Vietcombank">Vietcombank</option>
                                        <option value="MB Bank">MB Bank (Quân đội)</option>
                                        <option value="Techcombank">Techcombank</option>
                                        <option value="BIDV">BIDV</option>
                                        <option value="VietinBank">VietinBank</option>
                                        <option value="VPBank">VPBank</option>
                                        <option value="ACB">ACB</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-semibold mb-1">Số tài khoản ngân hàng *</label>
                                    <input
                                        type="text"
                                        required
                                        value={payoutForm.accountNumber}
                                        onChange={(e) => setPayoutForm({ ...payoutForm, accountNumber: e.target.value })}
                                        placeholder="Ví dụ: 1018992345"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Tên chủ tài khoản (In hoa không dấu) *</label>
                                <input
                                    type="text"
                                    required
                                    value={payoutForm.accountHolder}
                                    onChange={(e) => setPayoutForm({ ...payoutForm, accountHolder: e.target.value.toUpperCase() })}
                                    placeholder="Ví dụ: NGUYEN THUY LINH"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white uppercase font-bold text-slate-800"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    * Tên chủ tài khoản ngân hàng phải trùng khớp với tên trên Căn cước công dân đã xác minh.
                                </p>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-1">Ghi chú (Tùy chọn)</label>
                                <input
                                    type="text"
                                    value={payoutForm.note}
                                    onChange={(e) => setPayoutForm({ ...payoutForm, note: e.target.value })}
                                    placeholder="Ví dụ: Rút tiền thu nhập ca tuần 2 tháng 10"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsPayoutModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                                >
                                    Xác nhận gửi yêu cầu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
