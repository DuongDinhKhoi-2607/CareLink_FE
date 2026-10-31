import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    RotateCcw,
    Building2,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Clock,
    X,
    Loader2,
    Search,
    AlertTriangle,
    Coins,
    CreditCard,
    Info,
    HelpCircle,
    Calendar,
    UserCheck,
} from "lucide-react";
import familyApi from "../../../api/familyApi";

const POPULAR_BANKS = [
    "Vietcombank (Ngoại thương Việt Nam)",
    "MB Bank (Ngân hàng Quân đội)",
    "Techcombank (Kỹ thương Việt Nam)",
    "BIDV (Đầu tư & Phát triển)",
    "VietinBank (Công thương Việt Nam)",
    "VPBank (Việt Nam Thịnh Vượng)",
    "ACB (Á Châu)",
    "TPBank (Tiên Phong)",
    "Sacombank (Sài Gòn Thương Tín)",
    "VIB (Quốc tế Việt Nam)",
    "HDBank (Phát triển TP.HCM)",
    "MSB (Hàng Hải)",
];

const parseStatus = (val) => {
    if (typeof val === "number") return val;
    const s = String(val || "").trim().toLowerCase();
    if (s === "pendingpayment" || s === "1") return 1;
    if (s === "pendingacceptance" || s === "2") return 2;
    if (s === "accepted" || s === "3") return 3;
    if (s === "inprogress" || s === "in_progress" || s === "4") return 4;
    if (s === "completed" || s === "5") return 5;
    if (s === "canceled" || s === "cancelled" || s === "6") return 6;
    if (s === "disputed" || s === "7") return 7;
    return 1;
};

export default function FamilyWallet() {
    // 1. Số dư ví cá nhân (lưu trữ đồng bộ)
    const [balance, setBalance] = useState(() => {
        try {
            const saved = localStorage.getItem("carelink_family_wallet_balance");
            return saved !== null ? Number(saved) : 110000;
        } catch {
            return 110000;
        }
    });

    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);

    // Filter & Search states
    const [activeTab, setActiveTab] = useState("all"); // 'all' | 'refund' | 'payment' | 'withdraw'
    const [searchQuery, setSearchQuery] = useState("");

    // Modal rút tiền
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [selectedBank, setSelectedBank] = useState(POPULAR_BANKS[0]);
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [withdrawNote, setWithdrawNote] = useState("");
    const [withdrawError, setWithdrawError] = useState("");
    const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

    // Tổng số liệu thống kê
    const [stats, setStats] = useState({
        totalRefunded: 0,
        totalSpent: 0,
        completedBookingsCount: 0,
        refundedBookingsCount: 0,
    });

    const showToast = (msg, type = "success") => {
        setToastMessage({ msg, type });
        setTimeout(() => setToastMessage(null), 3800);
    };

    // Tải dữ liệu giao dịch từ API Bookings của gia đình
    const fetchWalletData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await familyApi.getBookings({ PageNumber: 1, PageSize: 50 });
            const items = res?.items || res?.Items || (Array.isArray(res) ? res : []);

            let totalRefunded = 0;
            let totalSpent = 0;
            let completedCount = 0;
            let refundedCount = 0;
            const mappedTxs = [];

            items.forEach((b) => {
                const rawSt = parseStatus(b.status || b.Status);
                const idStr = String(b.id || b.Id || "").trim();
                const shortId = idStr ? idStr.substring(0, 8).toUpperCase() : "CA";
                const basePrice = Number(b.totalPrice || b.TotalPrice || 0);
                const platformFee = Number(b.platformFee || b.PlatformFee || 60000);
                const totalPaid = Number(b.totalPaymentAmount || b.TotalPaymentAmount || (basePrice + platformFee));
                const serviceName = b.serviceName || b.ServiceName || "Chăm sóc theo yêu cầu";
                const nurseName = b.nurseName || b.NurseName || "Điều dưỡng CareLink";

                if (rawSt === 6) {
                    // Ca đã hủy: Hoàn tiền
                    refundedCount += 1;
                    const refundAmt = Number(b.refundedAmount || b.RefundedAmount || totalPaid);
                    totalRefunded += refundAmt;

                    const cancelDate = b.canceledAt || b.CanceledAt || b.updatedAt || b.UpdatedAt || b.createdAt || b.CreatedAt;
                    const d = cancelDate ? new Date(cancelDate) : new Date();

                    mappedTxs.push({
                        id: `REF-${shortId}`,
                        bookingId: idStr,
                        type: "refund",
                        title: `Hoàn tiền ca chăm sóc #${shortId}`,
                        amount: refundAmt,
                        date: d.toLocaleDateString("vi-VN"),
                        time: d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                        timestamp: d.getTime(),
                        status: "Đã hoàn vào ví",
                        service: serviceName,
                        nurse: nurseName,
                        note: b.cancelReason || b.CancelReason
                            ? `Lý do: ${b.cancelReason || b.CancelReason}`
                            : "Hoàn tiền tự động theo chính sách bảo vệ gia đình",
                    });
                } else if (rawSt >= 2) {
                    // Ca đã thanh toán hoặc đã tiếp nhận/hoàn thành
                    if (rawSt === 5) completedCount += 1;
                    totalSpent += totalPaid;

                    const createdDate = b.createdAt || b.CreatedAt;
                    const d = createdDate ? new Date(createdDate) : new Date();

                    mappedTxs.push({
                        id: `PAY-${shortId}`,
                        bookingId: idStr,
                        type: "payment",
                        title: `Thanh toán ca chăm sóc #${shortId}`,
                        amount: totalPaid,
                        date: d.toLocaleDateString("vi-VN"),
                        time: d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                        timestamp: d.getTime(),
                        status: rawSt === 5 ? "Đã nghiệm thu ca" : rawSt === 4 ? "Đang diễn ra" : "Đã thanh toán PayOS",
                        service: serviceName,
                        nurse: nurseName,
                        note: `Điều dưỡng: ${nurseName} • Dịch vụ: ${serviceName}`,
                    });
                }
            });

            // 2. Tải thêm các yêu cầu rút tiền cá nhân từ localStorage (nếu có)
            try {
                const savedWithdrawals = JSON.parse(localStorage.getItem("carelink_family_withdraw_requests") || "[]");
                savedWithdrawals.forEach((w) => {
                    mappedTxs.push({
                        id: w.id,
                        bookingId: null,
                        type: "withdraw",
                        title: `Rút tiền về ${w.bank}`,
                        amount: w.amount,
                        date: w.date,
                        time: w.time || "",
                        timestamp: w.timestamp || Date.now(),
                        status: w.status || "Chờ giải ngân (24h)",
                        service: "Rút tiền về ngân hàng",
                        nurse: null,
                        note: `STK: ${w.accountNumber} • Chủ TK: ${w.accountName}`,
                    });
                });
            } catch {
                // ignore
            }

            // Sắp xếp giao dịch mới nhất lên đầu
            mappedTxs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            setTransactions(mappedTxs);
            setStats({
                totalRefunded,
                totalSpent,
                completedBookingsCount: completedCount,
                refundedBookingsCount: refundedCount,
            });
        } catch (err) {
            console.warn("Lỗi tải thông tin ví gia đình:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWalletData();
    }, [fetchWalletData]);

    // Lọc giao dịch theo Tab và ô tìm kiếm
    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            if (activeTab !== "all" && tx.type !== activeTab) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchId = tx.id.toLowerCase().includes(q);
                const matchTitle = tx.title.toLowerCase().includes(q);
                const matchService = (tx.service || "").toLowerCase().includes(q);
                const matchNurse = (tx.nurse || "").toLowerCase().includes(q);
                const matchNote = (tx.note || "").toLowerCase().includes(q);
                return matchId || matchTitle || matchService || matchNurse || matchNote;
            }
            return true;
        });
    }, [transactions, activeTab, searchQuery]);

    // Xử lý gửi yêu cầu rút tiền
    const handleConfirmWithdraw = async (e) => {
        e.preventDefault();
        setWithdrawError("");

        const numAmount = Number(withdrawAmount);
        if (!numAmount || isNaN(numAmount) || numAmount < 50000) {
            setWithdrawError("Số tiền rút tối thiểu là 50.000 VNĐ.");
            return;
        }

        if (numAmount > balance) {
            setWithdrawError("Số dư khả dụng hiện tại không đủ để thực hiện yêu cầu.");
            return;
        }

        if (!accountNumber.trim()) {
            setWithdrawError("Vui lòng nhập số tài khoản ngân hàng thụ hưởng.");
            return;
        }

        if (!accountName.trim()) {
            setWithdrawError("Vui lòng nhập tên chủ tài khoản (in hoa không dấu).");
            return;
        }

        setIsSubmittingWithdraw(true);

        try {
            const newReq = {
                id: `WD-${Date.now().toString().slice(-6)}`,
                amount: numAmount,
                bank: selectedBank.split(" (")[0],
                accountNumber: accountNumber.trim(),
                accountName: accountName.trim().toUpperCase(),
                date: new Date().toLocaleDateString("vi-VN"),
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                timestamp: Date.now(),
                status: "Đang đối soát sao kê",
            };

            const existing = JSON.parse(localStorage.getItem("carelink_family_withdraw_requests") || "[]");
            existing.unshift(newReq);
            localStorage.setItem("carelink_family_withdraw_requests", JSON.stringify(existing));

            const newBalance = Math.max(0, balance - numAmount);
            setBalance(newBalance);
            localStorage.setItem("carelink_family_wallet_balance", String(newBalance));

            showToast(`Gửi yêu cầu rút ${numAmount.toLocaleString("vi-VN")} đ thành công! CareLink sẽ giải ngân trong vòng 24 giờ.`);
            setShowWithdrawModal(false);
            setWithdrawAmount("");
            setAccountNumber("");
            setAccountName("");
            setWithdrawNote("");

            fetchWalletData();
        } catch {
            setWithdrawError("Không thể gửi yêu cầu rút tiền lúc này. Vui lòng thử lại sau.");
        } finally {
            setIsSubmittingWithdraw(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-7">
            {/* Toast thông báo cao cấp */}
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 bg-[#0c242c] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm border border-teal-500/30 animate-in fade-in slide-in-from-top-3 duration-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-medium">{toastMessage.msg}</span>
                </div>
            )}

            {/* Header trang & Thanh công cụ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-[#00677c]/10 text-[#00677c] flex items-center justify-center shrink-0">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Ví tiền & Hoàn phí
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Quản lý số dư hoàn tiền từ ca hủy, chi tiêu chăm sóc và lịch sử giao dịch minh bạch.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <button
                        type="button"
                        onClick={fetchWalletData}
                        disabled={isLoading}
                        className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 shadow-2xs flex items-center gap-2 transition cursor-pointer disabled:opacity-60"
                        title="Đồng bộ giao dịch mới nhất"
                    >
                        <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
                        <span>Làm mới</span>
                    </button>
                    <Link
                        to="/caregivers"
                        className="px-5 py-2.5 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-bold rounded-xl text-xs transition shadow-sm hover:shadow flex items-center gap-2"
                    >
                        <span>Đặt ca mới</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Grid 4 Thẻ Tài chính Bento (Hero Balance + 3 Stat Tiles) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Thẻ Hero: Số dư khả dụng (Chiếm 7 cột) */}
                <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#0c3944] via-[#005465] to-[#002d36] text-white p-7 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden border border-teal-500/20">
                    {/* Ambient Glow mesh decoration */}
                    <div className="absolute right-0 top-0 -mt-10 -mr-10 w-60 h-60 rounded-full bg-teal-400/10 pointer-events-none blur-3xl" />
                    <div className="absolute left-1/3 bottom-0 -mb-10 w-44 h-44 rounded-full bg-emerald-400/10 pointer-events-none blur-2xl" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
                                    Số dư khả dụng trong ví CareLink
                                </span>
                            </div>
                            <span className="px-3.5 py-1 rounded-full bg-white text-[#005465] text-xs font-extrabold shadow-sm border border-emerald-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Sẵn sàng giao dịch</span>
                            </span>
                        </div>

                        <div className="mt-4 flex items-baseline gap-2.5">
                            <span className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                                {balance.toLocaleString("vi-VN")}
                            </span>
                            <span className="text-lg sm:text-xl font-bold text-teal-200">VNĐ</span>
                        </div>

                        <p className="mt-2.5 text-xs sm:text-sm text-teal-100/85 leading-relaxed max-w-xl">
                            Số dư này được dùng để <strong>cấn trừ trực tiếp khi đặt ca mới</strong> hoặc bạn có thể <strong>rút về tài khoản ngân hàng</strong> bất kỳ lúc nào với 0đ phí phát sinh.
                        </p>
                    </div>

                    <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3 relative z-10">
                        <button
                            type="button"
                            onClick={() => setShowWithdrawModal(true)}
                            className="px-5 py-2.5 rounded-xl bg-white text-[#00677c] hover:bg-teal-50 font-bold text-xs sm:text-sm shadow-md transition active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                        >
                            <Building2 className="w-4 h-4 text-[#00677c]" />
                            <span>Rút tiền về ngân hàng</span>
                        </button>

                        <Link
                            to="/caregivers"
                            className="px-5 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-white font-bold text-xs sm:text-sm border border-teal-300/30 backdrop-blur-xs transition flex items-center gap-2"
                        >
                            <span>Dùng số dư đặt ca mới</span>
                            <ArrowUpRight className="w-4 h-4 text-teal-200" />
                        </Link>
                    </div>
                </div>

                {/* 2 Thẻ Thống kê phụ (Chiếm 5 cột) */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {/* Thẻ 1: Tổng tiền hoàn từ ca hủy */}
                    <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Tiền hoàn tích lũy
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <ArrowDownLeft className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                                    +{stats.totalRefunded.toLocaleString("vi-VN")}
                                </span>
                                <span className="text-xs font-bold text-slate-500">VNĐ</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                                Ghi nhận từ <strong>{stats.refundedBookingsCount}</strong> ca trực hủy được hoàn tiền theo quy định.
                            </p>
                        </div>
                    </div>

                    {/* Thẻ 2: Tổng chi tiêu dịch vụ */}
                    <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Tổng chi tiêu dịch vụ
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                                <CreditCard className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                                    {stats.totalSpent.toLocaleString("vi-VN")}
                                </span>
                                <span className="text-xs font-bold text-slate-500">VNĐ</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                                Thanh toán an toàn qua cổng PayOS Escrow giữ tiền cho tới khi ca hoàn tất.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* KHU VỰC ĐẶC BIỆT: CHÍNH SÁCH HOÀN TIỀN & LƯU Ý HỦY CA SÁT GIỜ  */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span>Quy định Hoàn tiền & Lưu ý Khi hủy ca chăm sóc</span>
                                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-[#00677c] text-[10px] font-bold uppercase tracking-wider">
                                    Minh bạch 100%
                                </span>
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                CareLink áp dụng chuẩn mực hoàn tiền rõ ràng nhằm đảm bảo quyền lợi gia đình và công sức của đội ngũ điều dưỡng.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Bảo vệ quyền lợi gia đình theo quy chế CareLink</span>
                    </div>
                </div>

                {/* 3 Thẻ quy định so sánh trực quan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Trường hợp 1: Hủy sớm >= 12 tiếng */}
                    <div className="rounded-2xl bg-emerald-50/40 border border-emerald-200/80 p-5 flex flex-col justify-between space-y-3">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                <Clock className="w-3.5 h-3.5" />
                                <span>HỦY TRƯỚC CA TRỰC ≥ 12 GIỜ</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 mt-3">
                                Hoàn 100% Tiền công dịch vụ
                            </h3>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                Gia đình được hoàn lại <strong>100% tiền công dịch vụ</strong> trực tiếp vào Ví CareLink ngay lập tức.
                            </p>
                        </div>
                        <div className="pt-3 border-t border-emerald-200/60 text-[11px] text-emerald-800 font-medium">
                            💡 Phí nền tảng y tế 60.000 VNĐ được giữ lại để bù chi phí vận hành & kết nối hệ thống.
                        </div>
                    </div>

                    {/* Trường hợp 2: Hủy sát ca < 12 tiếng */}
                    <div className="rounded-2xl bg-amber-50/50 border border-amber-300/90 p-5 flex flex-col justify-between space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase px-3 py-0.5 rounded-bl-lg">
                            Lưu ý quan trọng
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>HỦY SÁT GIỜ CA TRỰC &lt; 12 GIỜ</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 mt-3">
                                Bồi hoàn 50% cho Điều dưỡng
                            </h3>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                Do điều dưỡng đã chuẩn bị dụng cụ y tế và khóa lịch không nhận khách khác: Hệ thống bồi thường <strong>50% tiền công cho Điều dưỡng</strong>, và <strong>hoàn 50% còn lại vào Ví</strong> của bạn.
                            </p>
                        </div>
                        <div className="pt-3 border-t border-amber-200/80 text-[11px] text-amber-900 font-medium">
                            ⚠️ Khuyến cáo: Nếu có việc bận, gia đình vui lòng hủy trước 12h để bảo toàn trọn vẹn số tiền.
                        </div>
                    </div>

                    {/* Trường hợp 3: Điều dưỡng hủy hoặc vắng mặt - Sử dụng màu Xanh dương Sky khác biệt hoàn toàn */}
                    <div className="rounded-2xl bg-sky-50/70 border border-sky-300 p-5 flex flex-col justify-between space-y-3">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-[11px] font-bold">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>ĐIỀU DƯỠNG HỦY / VẮNG MẶT</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 mt-3">
                                Hoàn 100% Toàn bộ chi phí
                            </h3>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                Hệ thống tự động hoàn <strong>100% toàn bộ số tiền đã trả</strong> (bao gồm cả tiền công dịch vụ và 60.000 VNĐ phí nền tảng) vào Ví ngay lập tức.
                            </p>
                        </div>
                        <div className="pt-3 border-t border-sky-200 text-[11px] text-sky-900 font-medium">
                            🛡️ <strong>Hỗ trợ điều phối:</strong> CareLink liên hệ khẩn cấp hỗ trợ kết nối điều dưỡng thay thế phù hợp.
                        </div>
                    </div>
                </div>

                {/* Đường gạch ngang phân cách tinh tế phía trên 3 khung cam kết */}
                <div className="pt-4 border-t border-slate-200/90">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {/* Cột 1: Hoàn tiền tức thì */}
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors flex items-center gap-3 text-xs text-slate-700">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                                <Coins className="w-4.5 h-4.5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Hoàn tiền tức thì</p>
                                <p className="text-[11px] text-slate-500">Cộng vào ví ngay khi ca trực được xác nhận hủy.</p>
                            </div>
                        </div>

                        {/* Cột 2 (Giữa): Miễn phí rút tiền */}
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors flex items-center gap-3 text-xs text-slate-700">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4.5 h-4.5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Miễn 100% phí rút tiền</p>
                                <p className="text-[11px] text-slate-500">CareLink hỗ trợ toàn bộ phí chuyển khoản ngân hàng.</p>
                            </div>
                        </div>

                        {/* Cột 3: Rút tiền trong 24h */}
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-colors flex items-center gap-3 text-xs text-slate-700">
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                                <Clock className="w-4.5 h-4.5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Rút tiền trong 24h</p>
                                <p className="text-[11px] text-slate-500">Chuyển khoản trực tiếp về tài khoản ngân hàng cá nhân.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* BẢNG LỊCH SỬ BIẾN ĐỘNG SỐ DƯ (TRANSACTION LEDGER)              */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
                {/* Header Bảng + Tabs lọc + Ô tìm kiếm */}
                <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                Lịch sử biến động số dư
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Toàn bộ các khoản hoàn tiền ca hủy, thanh toán dịch vụ và yêu cầu rút tiền.
                            </p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full w-fit">
                            Tổng {filteredTransactions.length} giao dịch
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        {/* 4 Tabs phân loại */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl w-fit">
                            <button
                                type="button"
                                onClick={() => setActiveTab("all")}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    activeTab === "all"
                                        ? "bg-white text-slate-900 shadow-2xs"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Tất cả
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("refund")}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    activeTab === "refund"
                                        ? "bg-white text-emerald-700 shadow-2xs"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Tiền hoàn vào ví
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("payment")}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    activeTab === "payment"
                                        ? "bg-white text-slate-900 shadow-2xs"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Chi tiêu đặt ca
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("withdraw")}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    activeTab === "withdraw"
                                        ? "bg-white text-amber-700 shadow-2xs"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Rút tiền
                            </button>
                        </div>

                        {/* Ô tìm kiếm */}
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm mã ca, dịch vụ, điều dưỡng..."
                                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00677c] bg-white"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Danh sách Table */}
                {isLoading ? (
                    <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                        <Loader2 className="w-7 h-7 animate-spin text-[#00677c]" />
                        <span>Đang đồng bộ sổ phụ giao dịch từ CareLink...</span>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                            <Wallet className="w-7 h-7 stroke-[1.5]" />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">
                            {searchQuery ? "Không tìm thấy giao dịch phù hợp" : "Chưa có biến động số dư nào"}
                        </span>
                        <p className="text-slate-400 max-w-sm">
                            {searchQuery
                                ? "Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc đổi sang tab phân loại khác."
                                : "Khi bạn đặt ca chăm sóc hoặc nhận tiền hoàn từ các ca trực bị hủy, thông tin chi tiết sẽ được ghi nhận tại đây."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                                    <th className="py-3.5 px-6">Mã giao dịch</th>
                                    <th className="py-3.5 px-6">Phân loại</th>
                                    <th className="py-3.5 px-6">Chi tiết nội dung</th>
                                    <th className="py-3.5 px-6">Thời gian</th>
                                    <th className="py-3.5 px-6 text-right">Số tiền</th>
                                    <th className="py-3.5 px-6 text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredTransactions.map((tx) => {
                                    const isPositive = tx.type === "refund";
                                    return (
                                        <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-4 px-6 font-bold text-slate-800 font-mono">
                                                {tx.id}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                        isPositive
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : tx.type === "withdraw"
                                                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                            : "bg-slate-100 text-slate-700 border border-slate-200"
                                                    }`}
                                                >
                                                    {isPositive ? (
                                                        <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                                                    ) : (
                                                        <ArrowUpRight className="w-3 h-3 text-slate-500" />
                                                    )}
                                                    <span>
                                                        {tx.type === "refund"
                                                            ? "Tiền hoàn vào ví"
                                                            : tx.type === "withdraw"
                                                            ? "Rút về ngân hàng"
                                                            : "Chi tiêu đặt ca"}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-bold text-slate-900">{tx.title}</p>
                                                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{tx.note}</p>
                                            </td>
                                            <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                                                <span className="font-medium">{tx.date}</span>
                                                {tx.time && (
                                                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{tx.time}</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right font-extrabold text-sm whitespace-nowrap">
                                                <span className={isPositive ? "text-emerald-600" : "text-slate-800"}>
                                                    {isPositive ? "+" : "-"}
                                                    {tx.amount.toLocaleString("vi-VN")} đ
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                                        isPositive
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : tx.type === "withdraw"
                                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                                            : "bg-teal-50 text-[#00677c] border-teal-200"
                                                    }`}
                                                >
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* MODAL RÚT TIỀN VỀ TÀI KHOẢN NGÂN HÀNG                          */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {showWithdrawModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => !isSubmittingWithdraw && setShowWithdrawModal(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/80 via-white to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#00677c]/10 text-[#00677c] flex items-center justify-center">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Rút tiền về tài khoản ngân hàng
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Số dư khả dụng: <strong className="text-emerald-600">{balance.toLocaleString("vi-VN")} đ</strong>
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowWithdrawModal(false)}
                                disabled={isSubmittingWithdraw}
                                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleConfirmWithdraw} className="p-6 space-y-4 text-xs">
                            {withdrawError && (
                                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span className="font-medium leading-relaxed">{withdrawError}</span>
                                </div>
                            )}

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">
                                    Ngân hàng thụ hưởng <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:border-[#00677c] cursor-pointer"
                                >
                                    {POPULAR_BANKS.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1.5">
                                        Số tài khoản <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        placeholder="Ví dụ: 1018992345"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-[#00677c]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1.5">
                                        Tên chủ tài khoản <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                                        placeholder="NGUYEN THI THU HA"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 uppercase focus:outline-none focus:border-[#00677c]"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="font-bold text-slate-700">
                                        Số tiền muốn rút (VNĐ) <span className="text-rose-500">*</span>
                                    </label>
                                    <span className="text-[11px] text-slate-400">Tối thiểu: 50.000 VNĐ</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="Nhập số tiền cần rút..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 text-sm focus:outline-none focus:border-[#00677c]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setWithdrawAmount(String(balance))}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-teal-50 text-[#00677c] font-bold text-[11px] hover:bg-teal-100 transition cursor-pointer"
                                    >
                                        Rút tất cả
                                    </button>
                                </div>

                                {/* Các nút gợi ý số tiền nhanh */}
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[11px] text-slate-400 font-medium">Gợi ý nhanh:</span>
                                    {[50000, 100000, 200000].map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setWithdrawAmount(String(amt))}
                                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition"
                                        >
                                            {amt.toLocaleString("vi-VN")} đ
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">
                                    Ghi chú rút tiền (tùy chọn)
                                </label>
                                <input
                                    type="text"
                                    value={withdrawNote}
                                    onChange={(e) => setWithdrawNote(e.target.value)}
                                    placeholder="Ví dụ: Rút tiền hoàn ca chăm sóc ngày 30/10"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:border-[#00677c]"
                                />
                            </div>

                            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 text-[11px] text-[#00677c] leading-relaxed flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#00677c]" />
                                <span>
                                    <strong>Cam kết an toàn:</strong> Yêu cầu rút tiền được Ban quản trị CareLink đối soát sao kê và chuyển khoản trực tiếp về ngân hàng trong vòng <strong>24 giờ làm việc</strong> (miễn 100% phí chuyển khoản).
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowWithdrawModal(false)}
                                    disabled={isSubmittingWithdraw}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingWithdraw}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-60 shadow-sm"
                                >
                                    {isSubmittingWithdraw && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span>Gửi yêu cầu rút tiền</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
