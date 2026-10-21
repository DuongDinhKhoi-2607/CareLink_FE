import React, { useState, useEffect, useCallback } from "react";
import caregiverApi from "../../../api/caregiverApi";

export default function CaregiverWallet() {
    // ── STATE SỐ DƯ & VÍ ĐIỀU DƯỠNG (KHỚP CHUẨN DTO BACKEND: WalletResponse & PayoutResponse) ──
    const [wallet, setWallet] = useState({
        balance: 0,
        availableBalance: 0,
        pendingPayout: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        bankAccount: {
            bankName: "",
            accountNumber: "",
            accountHolder: "",
        },
    });

    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingPayout, setSubmittingPayout] = useState(false);

    // ── LỊCH SỬ BIẾN ĐỘNG SỐ DƯ (TRANSACTIONS - CỐ ĐỊNH PHÍ SÀN 60K/CA THEO NGHIỆP VỤ) ──
    const [transactions, setTransactions] = useState([]);

    // ── MODAL RÚT TIỀN ──
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [payoutForm, setPayoutForm] = useState({
        amount: "",
        bankName: "Vietcombank",
        accountNumber: "1018992345",
        accountHolder: "NGUYEN THUY LINH",
        note: "",
    });
    const [payoutError, setPayoutError] = useState("");
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // ── 60. GET /api/v1/wallet/me (Xem số dư ví) ──────────────────────────────────
    const fetchWallet = useCallback(async () => {
        try {
            const res = await caregiverApi.getWallet();
            const data = res?.data || res;
            if (data && typeof data === "object") {
                setWallet((prev) => ({
                    ...prev,
                    balance: Number(data.balance ?? data.currentBalance ?? prev.balance),
                    availableBalance: Number(
                        data.availableBalance ??
                        (data.balance !== undefined && data.pendingPayout !== undefined
                            ? data.balance - data.pendingPayout
                            : prev.availableBalance)
                    ),
                    pendingPayout: Number(data.pendingPayout ?? data.pendingBalance ?? prev.pendingPayout),
                    totalEarned: Number(data.totalEarned ?? data.totalIncome ?? prev.totalEarned),
                    totalWithdrawn: Number(data.totalWithdrawn ?? data.totalPayout ?? prev.totalWithdrawn),
                    bankAccount: {
                        bankName: data.bankName || data.bankAccount?.bankName || prev.bankAccount.bankName,
                        accountNumber: data.accountNumber || data.bankAccount?.accountNumber || prev.bankAccount.accountNumber,
                        accountHolder: data.accountHolder || data.bankAccount?.accountHolder || prev.bankAccount.accountHolder,
                    },
                }));
            }
        } catch (err) {
            console.warn("Lỗi tải số dư ví:", err);
        }
    }, []);

    // ── 61. GET /api/v1/wallet/me/transactions (Xem lịch sử giao dịch) ─────────────
    const fetchTransactions = useCallback(async () => {
        try {
            const res = await caregiverApi.getWalletTransactions();
            const list = Array.isArray(res)
                ? res
                : Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res?.items)
                ? res.items
                : [];
            if (list.length > 0) {
                setTransactions(
                    list.map((t, idx) => ({
                        id: t.id || `TX-${t.bookingId || idx + 100}`,
                        date: t.createdAt ? new Date(t.createdAt).toLocaleString("vi-VN") : t.date || "Vừa xong",
                        title: t.title || t.description || "Biến động số dư",
                        type: t.type || (t.amount > 0 ? "earning" : "platform_fee"),
                        amount: Number(t.amount || 0),
                        balanceAfter: Number(t.balanceAfter ?? t.balance ?? 0),
                        note: t.note || t.reference || "",
                    }))
                );
            } else {
                setTransactions([]);
            }
        } catch (err) {
            console.warn("Lỗi tải lịch sử giao dịch:", err);
            setTransactions([]);
        }
    }, []);

    // ── 63. GET /api/v1/wallet/payouts (Xem lịch sử yêu cầu rút tiền) ───────────────
    const fetchPayouts = useCallback(async () => {
        try {
            const res = await caregiverApi.getMyPayouts();
            const list = Array.isArray(res)
                ? res
                : Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res?.items)
                ? res.items
                : [];
            if (list.length > 0) {
                setPayouts(
                    list.map((p) => {
                        const statusStr = (p.status || "").toLowerCase();
                        const isApproved = statusStr === "approved" || p.status === 1;
                        const isRejected = statusStr === "rejected" || p.status === 2;
                        return {
                            id: p.id || `PO-${p.code || "N/A"}`,
                            createdAt: p.createdAt ? new Date(p.createdAt).toLocaleString("vi-VN") : p.requestDate || "Vừa xong",
                            amount: Number(p.amount || 0),
                            bankName: p.bankName || p.bank || "Ngân hàng",
                            accountNumber: p.accountNumber || "—",
                            accountHolder: p.accountHolder || "—",
                            status: isApproved ? "approved" : isRejected ? "rejected" : "pending",
                            statusLabel: isApproved ? "Đã chuyển khoản" : isRejected ? "Từ chối" : "Đang chờ đối soát",
                            statusColor: isApproved
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isRejected
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200",
                            referenceCode: p.referenceCode || p.transactionCode || null,
                            note: p.note || p.rejectReason || "",
                        };
                    })
                );
            } else {
                setPayouts([]);
            }
        } catch (err) {
            console.warn("Lỗi tải lịch sử rút tiền:", err);
            setPayouts([]);
        }
    }, []);

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([fetchWallet(), fetchTransactions(), fetchPayouts()]);
            setLoading(false);
        };
        loadAll();
    }, [fetchWallet, fetchTransactions, fetchPayouts]);

    // ── 62. POST /api/v1/wallet/payouts (Tạo yêu cầu rút tiền — Không tự ý sửa số dư khi BE chưa xác nhận) ──
    const handleCreatePayout = async (e) => {
        e.preventDefault();
        setPayoutError("");
        const withdrawAmount = Number(payoutForm.amount);

        // Quy chuẩn Backend CreatePayoutRequest: Range(50_000, 1_000_000_000)
        if (isNaN(withdrawAmount) || withdrawAmount < 50000) {
            setPayoutError("Số tiền rút tối thiểu là 50.000 VNĐ theo quy định hệ thống!");
            return;
        }

        if (withdrawAmount > wallet.availableBalance) {
            setPayoutError(`Số tiền rút vượt quá số dư khả dụng hiện có (${wallet.availableBalance.toLocaleString("vi-VN")} ₫)!`);
            return;
        }

        const cleanAccNumber = payoutForm.accountNumber.trim();
        // Quy chuẩn Backend: RegularExpression(@"^[0-9]{6,30}$")
        if (!/^\d{6,30}$/.test(cleanAccNumber)) {
            setPayoutError("Số tài khoản ngân hàng chỉ được gồm từ 6 đến 30 chữ số!");
            return;
        }

        setSubmittingPayout(true);
        try {
            const payload = {
                amount: withdrawAmount,
                bankName: payoutForm.bankName,
                accountNumber: cleanAccNumber,
                accountHolder: payoutForm.accountHolder.trim().toUpperCase(),
                note: payoutForm.note?.trim() || "Yêu cầu rút tiền về tài khoản ngân hàng",
            };

            await caregiverApi.requestPayout(payload);

            // BẮT BUỘC: Không tự đổi số dư trên giao diện! Gọi fetch từ Backend để nhận số dư chuẩn xác sau khi tạo lệnh
            await Promise.all([fetchWallet(), fetchPayouts(), fetchTransactions()]);

            setIsPayoutModalOpen(false);
            setPayoutForm({ ...payoutForm, amount: "", note: "" });
            showToast("✓ Đã gửi yêu cầu rút tiền thành công! Admin sẽ đối soát và giải ngân.");
        } catch (err) {
            console.error("Lỗi gửi yêu cầu rút tiền:", err);
            const msg = err?.response?.data?.message || err?.response?.data?.title || "Không thể tạo yêu cầu rút tiền. Vui lòng kiểm tra lại!";
            setPayoutError(msg);
            showToast(`⚠️ ${msg}`);
        } finally {
            setSubmittingPayout(false);
        }
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
                        <span className="text-slate-400 text-xs font-semibold tracking-wide uppercase">Đang chờ đối soát giải ngân</span>
                        <h2 className="text-3xl font-extrabold text-[#002045] mt-1 tracking-tight">
                            {wallet.pendingPayout.toLocaleString("vi-VN")} <span className="text-lg font-bold text-slate-400">₫</span>
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                        Tổng các lệnh rút đang chờ Quản trị viên đối soát & giải ngân vào tài khoản
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
                        Đã khấu trừ phí sàn 60.000đ/ca minh bạch theo từng ca trực
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
                        Chính sách phí nền tảng CareLink: Cố định 60.000 VNĐ / ca trực hoàn thành
                    </strong>
                    CareLink chỉ thu một mức phí vận hành duy nhất là 60.000đ khi ca trực hoàn tất thành công. Nền tảng không thu thêm bất kỳ tỷ lệ phần trăm nào trên tiền thù lao của điều dưỡng. Thu nhập của bạn được đảm bảo minh bạch 100%.
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

                            {payoutError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    <span>{payoutError}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsPayoutModalOpen(false)}
                                    disabled={submittingPayout}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingPayout}
                                    className="px-5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:opacity-60 inline-flex items-center gap-2"
                                >
                                    {submittingPayout && (
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                    )}
                                    {submittingPayout ? "Đang gửi yêu cầu..." : "Xác nhận gửi yêu cầu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
