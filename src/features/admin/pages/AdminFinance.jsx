import React, { useState, useEffect, useCallback } from "react";
import adminApi from "../../../api/adminApi";
import {
    CircleDollarSign,
    ArrowUpRight,
    ArrowDownLeft,
    Banknote,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    RotateCcw,
    X,
    AlertCircle,
    Landmark,
    TrendingUp,
    Wallet,
    ChevronRight,
} from "lucide-react";

// ── MOCK DATA: TRANSACTIONS ────────────────────────────────────────────────────
const initialTransactions = [
    {
        id: "TXN-5001",
        family: "Nguyễn Thu Hà",
        caregiver: "Lê Hoàng Long",
        type: "Gia đình thanh toán",
        amount: 960000,
        platformFee: 60000,
        caregiverPay: 900000,
        date: "23/09/2026",
        time: "08:42",
        status: "Thành công",
        shiftId: "CA-2001",
    },
    {
        id: "TXN-5002",
        family: "Phạm Thị Bích",
        caregiver: "Nguyễn Thị Phương Thảo",
        type: "Gia đình thanh toán",
        amount: 960000,
        platformFee: 60000,
        caregiverPay: 900000,
        date: "22/09/2026",
        time: "06:15",
        status: "Thành công",
        shiftId: "CA-2003",
    },
    {
        id: "TXN-5003",
        family: "Bùi Thị Lan",
        caregiver: "Trần Thị Mai",
        type: "Gia đình thanh toán",
        amount: 1440000,
        platformFee: 60000,
        caregiverPay: 1380000,
        date: "22/09/2026",
        time: "18:30",
        status: "Thành công",
        shiftId: "CA-2007",
    },
    {
        id: "TXN-5004",
        family: "Lê Văn Dũng",
        caregiver: "Phạm Quốc Huy",
        type: "Hoàn tiền",
        amount: 480000,
        platformFee: 0,
        caregiverPay: 0,
        date: "21/09/2026",
        time: "14:20",
        status: "Hoàn tiền",
        shiftId: "CA-2004",
    },
    {
        id: "TXN-5005",
        family: "Hoàng Minh Tuấn",
        caregiver: "Lê Hoàng Long",
        type: "Đặt cọc",
        amount: 180000,
        platformFee: 0,
        caregiverPay: 0,
        date: "24/09/2026",
        time: "09:10",
        status: "Đang giữ cọc",
        shiftId: "CA-2006",
    },
    {
        id: "TXN-5006",
        family: "Võ Thị Thanh",
        caregiver: "Vũ Thị Bích Trâm",
        type: "Gia đình thanh toán",
        amount: 720000,
        platformFee: 60000,
        caregiverPay: 660000,
        date: "20/09/2026",
        time: "15:45",
        status: "Đang khiếu nại",
        shiftId: "CA-2005",
    },
    {
        id: "TXN-5007",
        family: "Trần Minh Khoa",
        caregiver: "Trần Thị Mai",
        type: "Đặt cọc",
        amount: 135000,
        platformFee: 0,
        caregiverPay: 0,
        date: "23/09/2026",
        time: "13:05",
        status: "Đang giữ cọc",
        shiftId: "CA-2002",
    },
];

// ── MOCK DATA: WITHDRAWAL REQUESTS ────────────────────────────────────────────
const initialWithdrawals = [
    {
        id: "WD-301",
        caregiver: "Lê Hoàng Long",
        caregiverPhone: "0912 345 678",
        amount: 3200000,
        bank: "Vietcombank",
        accountNumber: "1234 5678 9012",
        requestDate: "23/09/2026",
        status: "Chờ duyệt",
        note: "",
    },
    {
        id: "WD-302",
        caregiver: "Trần Thị Mai",
        caregiverPhone: "0901 234 567",
        amount: 1500000,
        bank: "Techcombank",
        accountNumber: "9876 5432 1098",
        requestDate: "22/09/2026",
        status: "Chờ duyệt",
        note: "",
    },
    {
        id: "WD-303",
        caregiver: "Nguyễn Thị Phương Thảo",
        caregiverPhone: "0988 765 432",
        amount: 800000,
        bank: "MB Bank",
        accountNumber: "5555 1234 6789",
        requestDate: "21/09/2026",
        status: "Đã duyệt",
        note: "",
    },
    {
        id: "WD-304",
        caregiver: "Đặng Văn Bình",
        caregiverPhone: "0944 888 999",
        amount: 2100000,
        bank: "BIDV",
        accountNumber: "7777 8888 9999",
        requestDate: "20/09/2026",
        status: "Từ chối",
        note: "Thông tin tài khoản không khớp với hồ sơ đăng ký.",
    },
    {
        id: "WD-305",
        caregiver: "Phạm Quốc Huy",
        caregiverPhone: "0933 456 789",
        amount: 4500000,
        bank: "Sacombank",
        accountNumber: "3333 4444 5555",
        requestDate: "18/09/2026",
        status: "Đã duyệt",
        note: "",
    },
];

// ── HELPER ─────────────────────────────────────────────────────────────────────
const formatVND = (n) =>
    n.toLocaleString("vi-VN", { style: "currency", currency: "VND" }).replace("₫", "₫");

// ── REJECT MODAL ───────────────────────────────────────────────────────────────
function RejectModal({ withdrawal, onClose, onConfirm }) {
    const [reason, setReason] = useState("");
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900">Từ chối yêu cầu rút tiền</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Mã yêu cầu: <strong className="text-rose-600">{withdrawal.id}</strong> · {withdrawal.caregiver}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                    >
                        <X className="w-4 h-4 text-slate-600" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-700 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Điều dưỡng sẽ nhận được thông báo từ chối kèm lý do. Yêu cầu có thể được gửi lại sau khi bổ sung thông tin.</span>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Lý do từ chối <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Nhập lý do từ chối rõ ràng để điều dưỡng có thể bổ sung thông tin..."
                            rows={4}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400 resize-none"
                        />
                    </div>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={() => reason.trim() && onConfirm(withdrawal.id, reason)}
                        disabled={!reason.trim()}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            reason.trim()
                                ? "bg-rose-600 text-white hover:bg-rose-700"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        Xác nhận từ chối
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── APPROVE MODAL ──────────────────────────────────────────────────────────────
function ApproveModal({ withdrawal, onClose, onConfirm }) {
    const [bankReferenceCode, setBankReferenceCode] = useState(`REF-${Date.now().toString().slice(-6)}`);
    const [adminNote, setAdminNote] = useState("Đã chuyển khoản thành công qua ngân hàng.");
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900">Duyệt lệnh rút tiền</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Mã yêu cầu: <strong className="text-emerald-700">{withdrawal.id}</strong> · {withdrawal.caregiver}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                    >
                        <X className="w-4 h-4 text-slate-600" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 space-y-1">
                        <p className="font-bold">Số tiền: {formatVND(withdrawal.amount)}</p>
                        <p>Ngân hàng: {withdrawal.bank} — STK: {withdrawal.accountNumber} ({withdrawal.accountName || withdrawal.caregiver})</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Mã tham chiếu ngân hàng (Bank Reference Code) <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={bankReferenceCode}
                            onChange={(e) => setBankReferenceCode(e.target.value)}
                            placeholder="Ví dụ: FT2409228899 hoặc mã giao dịch..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Ghi chú quản trị viên (Tùy chọn)
                        </label>
                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Ghi chú xác nhận chuyển tiền..."
                            rows={2}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-500 resize-none"
                        />
                    </div>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={() => bankReferenceCode.trim() && onConfirm(withdrawal.id, { bankReferenceCode: bankReferenceCode.trim(), adminNote: adminNote.trim() || undefined })}
                        disabled={!bankReferenceCode.trim()}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            bankReferenceCode.trim()
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        Xác nhận duyệt chi
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── TOAST ──────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
    if (!message) return null;
    return (
        <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg border flex items-center gap-3 ${
                type === "success"
                    ? "bg-[#00677c] text-white border-teal-400"
                    : "bg-rose-600 text-white border-rose-400"
            }`}
        >
            {type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            ) : (
                <XCircle className="w-4 h-4 text-rose-200 shrink-0" />
            )}
            <span className="text-xs font-bold">{message}</span>
        </div>
    );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function AdminFinance() {
    const [activeTab, setActiveTab] = useState("transactions");
    const [searchQuery, setSearchQuery] = useState("");
    const [transactions] = useState(initialTransactions);
    const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
    const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [approveTarget, setApproveTarget] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ── 64. GET /api/v1/admin/payouts (Admin xem danh sách yêu cầu rút tiền) ─────────
    const fetchPayouts = useCallback(async () => {
        setLoadingWithdrawals(true);
        try {
            const res = await adminApi.getPayouts();
            const list = Array.isArray(res)
                ? res
                : Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res?.items)
                ? res.items
                : [];
            if (list.length > 0) {
                setWithdrawals(
                    list.map((w) => {
                        // Backend PayoutRequestStatus: 1 = Pending, 2 = Approved, 3 = Rejected
                        const rawSt = typeof w.status === "number" ? w.status : (w.status === "Approved" ? 2 : w.status === "Rejected" ? 3 : 1);
                        const isApproved = rawSt === 2;
                        const isRejected = rawSt === 3;
                        const statusText = isApproved ? "Đã duyệt" : isRejected ? "Từ chối" : "Chờ duyệt";
                        return {
                            id: w.id || `WD-${w.code || "N/A"}`,
                            caregiver: w.nurseName || w.caregiverName || w.user?.fullName || w.caregiver || "Điều dưỡng",
                            caregiverPhone: w.nursePhone || w.caregiverPhone || w.user?.phoneNumber || "—",
                            amount: Number(w.amount || 0),
                            bank: w.bankName || w.bank || "Ngân hàng",
                            accountNumber: w.bankAccountNumber || w.accountNumber || "—",
                            accountName: w.bankAccountName || w.accountName || "",
                            requestDate: w.createdAt ? new Date(w.createdAt).toLocaleDateString("vi-VN") : w.requestDate || "Hôm nay",
                            status: statusText,
                            note: w.adminNote || w.rejectReason || w.note || "",
                        };
                    })
                );
            }
        } catch (err) {
            console.warn("Lỗi tải danh sách yêu cầu rút tiền của Admin:", err);
        } finally {
            setLoadingWithdrawals(false);
        }
    }, []);

    useEffect(() => {
        fetchPayouts();
    }, [fetchPayouts]);

    // KPI
    const totalRevenue = transactions
        .filter((t) => t.status === "Thành công")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalPlatformFee = transactions
        .filter((t) => t.status === "Thành công")
        .reduce((sum, t) => sum + t.platformFee, 0);
    const totalCaregiverPay = transactions
        .filter((t) => t.status === "Thành công")
        .reduce((sum, t) => sum + t.caregiverPay, 0);
    const pendingWithdrawals = withdrawals.filter((w) => w.status === "Chờ duyệt").length;

    // Transaction status config
    const TX_STATUS = {
        "Thành công": "bg-emerald-50 text-emerald-700 border-emerald-200",
        "Hoàn tiền": "bg-amber-50 text-amber-700 border-amber-200",
        "Đang giữ cọc": "bg-sky-50 text-sky-700 border-sky-200",
        "Đang khiếu nại": "bg-rose-50 text-rose-700 border-rose-200",
    };

    const WD_STATUS = {
        "Chờ duyệt": { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
        "Đã duyệt": { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
        "Từ chối": { badge: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" },
    };

    const filteredTx = transactions.filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
            t.id.toLowerCase().includes(q) ||
            t.family.toLowerCase().includes(q) ||
            t.caregiver.toLowerCase().includes(q) ||
            t.type.toLowerCase().includes(q)
        );
    });

    const filteredWd = withdrawals.filter((w) => {
        const q = searchQuery.toLowerCase();
        return (
            w.id.toLowerCase().includes(q) ||
            w.caregiver.toLowerCase().includes(q) ||
            w.bank.toLowerCase().includes(q)
        );
    });

    // ── 65. PUT /api/v1/admin/payouts/{id}/approve (Admin duyệt yêu cầu rút tiền) ────
    const handleApprove = async (id, payload) => {
        setActionLoadingId(id);
        try {
            await adminApi.approvePayout(id, {
                bankReferenceCode: payload?.bankReferenceCode || `REF-${Date.now().toString().slice(-6)}`,
                adminNote: payload?.adminNote || "Đã duyệt chi giải ngân thành công",
            });
            showToast(`✓ Đã duyệt chi trả thành công cho yêu cầu ${id}! Lệnh chuyển tiền đang được xử lý.`, "success");
            setApproveTarget(null);
            await fetchPayouts();
        } catch (err) {
            console.error("Lỗi duyệt yêu cầu rút tiền:", err);
            const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.response?.data?.title || "Không thể duyệt yêu cầu rút tiền. Vui lòng thử lại!";
            showToast(`⚠️ ${msg}`, "error");
        } finally {
            setActionLoadingId(null);
        }
    };

    // ── 66. PUT /api/v1/admin/payouts/{id}/reject (Admin từ chối yêu cầu rút tiền) ───
    const handleReject = async (id, reason) => {
        setActionLoadingId(id);
        try {
            await adminApi.rejectPayout(id, { adminNote: reason });
            showToast(`Đã từ chối yêu cầu rút tiền ${id}. Thông báo đã được gửi đến điều dưỡng.`, "error");
            setRejectTarget(null);
            await fetchPayouts();
        } catch (err) {
            console.error("Lỗi từ chối yêu cầu rút tiền:", err);
            const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.response?.data?.title || "Không thể từ chối yêu cầu. Vui lòng thử lại!";
            showToast(`⚠️ ${msg}`, "error");
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-6 pb-12 font-sans">
            {toast && <Toast message={toast.msg} type={toast.type} />}
            {approveTarget && (
                <ApproveModal
                    withdrawal={approveTarget}
                    onClose={() => setApproveTarget(null)}
                    onConfirm={handleApprove}
                />
            )}
            {rejectTarget && (
                <RejectModal
                    withdrawal={rejectTarget}
                    onClose={() => setRejectTarget(null)}
                    onConfirm={handleReject}
                />
            )}

            {/* ── HEADER ── */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Quản lý Tài chính & Quyết toán
                            {pendingWithdrawals > 0 && (
                                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {pendingWithdrawals} yêu cầu rút tiền chờ duyệt
                                </span>
                            )}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Theo dõi dòng tiền qua nền tảng, phí sàn và xét duyệt lệnh rút tiền của điều dưỡng.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Tổng thu */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng thu nền tảng</span>
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00677c] flex items-center justify-center border border-teal-100">
                            <TrendingUp className="w-5 h-5" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-xl font-extrabold text-slate-900 tracking-tight">{formatVND(totalRevenue)}</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <ArrowUpRight className="w-3.5 h-3.5" />+14.2%
                            </span>
                            <span className="text-xs text-slate-400">so với tháng trước</span>
                        </div>
                    </div>
                </div>

                {/* Phí sàn */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phí sàn (60.000₫/ca)</span>
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                            <CircleDollarSign className="w-5 h-5" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-xl font-extrabold text-slate-900 tracking-tight">{formatVND(totalPlatformFee)}</div>
                        <div className="text-xs text-slate-400 mt-2">Cố định 60.000₫ mỗi ca hoàn thành</div>
                    </div>
                </div>

                {/* Đã chi trả điều dưỡng */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chi trả điều dưỡng</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                            <Wallet className="w-5 h-5" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-xl font-extrabold text-slate-900 tracking-tight">{formatVND(totalCaregiverPay)}</div>
                        <div className="text-xs text-slate-400 mt-2">Thu nhập điều dưỡng sau khi trừ phí sàn 60.000₫/ca</div>
                    </div>
                </div>
            </div>

            {/* ── TABS & SEARCH ── */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3">
                {/* Tabs */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
                    <button
                        type="button"
                        onClick={() => { setActiveTab("transactions"); setSearchQuery(""); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === "transactions"
                                ? "bg-white text-[#00677c] shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Nhật ký giao dịch
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${activeTab === "transactions" ? "bg-teal-50 text-[#00677c]" : "bg-slate-200 text-slate-600"}`}>
                            {transactions.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab("withdrawals"); setSearchQuery(""); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === "withdrawals"
                                ? "bg-white text-[#00677c] shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <Banknote className="w-3.5 h-3.5" />
                        Yêu cầu rút tiền
                        {pendingWithdrawals > 0 && (
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${activeTab === "withdrawals" ? "bg-amber-50 text-amber-700" : "bg-amber-100 text-amber-700"}`}>
                                {pendingWithdrawals}
                            </span>
                        )}
                    </button>
                </div>

                {/* Search */}
                <div className="relative w-full">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                            activeTab === "transactions"
                                ? "Tìm theo mã GD, tên gia đình, điều dưỡng, loại giao dịch..."
                                : "Tìm theo mã yêu cầu, tên điều dưỡng, ngân hàng..."
                        }
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00677c]/20 focus:border-[#00677c]"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Xóa
                    </button>
                )}
            </div>

            {/* ── TRANSACTION TABLE ── */}
            {activeTab === "transactions" && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3.5 px-4 sm:px-6">Mã GD</th>
                                    <th className="py-3.5 px-4">Gia đình</th>
                                    <th className="py-3.5 px-4">Điều dưỡng</th>
                                    <th className="py-3.5 px-4">Loại GD</th>
                                    <th className="py-3.5 px-4">Tổng tiền</th>
                                    <th className="py-3.5 px-4">Phí sàn</th>
                                    <th className="py-3.5 px-4">Điều dưỡng nhận</th>
                                    <th className="py-3.5 px-4">Ngày & Giờ</th>
                                    <th className="py-3.5 px-4 sm:px-6">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {filteredTx.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-16 text-center text-slate-400">
                                            <CircleDollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                            <p className="font-semibold">Không tìm thấy giao dịch nào</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTx.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3.5 px-4 sm:px-6">
                                                <span className="font-black text-[#00677c]">{t.id}</span>
                                            </td>
                                            <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">{t.family}</td>
                                            <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{t.caregiver}</td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                                                    t.type === "Gia đình thanh toán" ? "text-[#00677c]" :
                                                    t.type === "Hoàn tiền" ? "text-amber-600" : "text-sky-600"
                                                }`}>
                                                    {t.type === "Gia đình thanh toán" ? <ArrowUpRight className="w-3.5 h-3.5" /> :
                                                     t.type === "Hoàn tiền" ? <ArrowDownLeft className="w-3.5 h-3.5" /> :
                                                     <CircleDollarSign className="w-3.5 h-3.5" />}
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-900">{formatVND(t.amount)}</td>
                                            <td className="py-3.5 px-4 text-purple-600 font-semibold">
                                                {t.platformFee > 0 ? formatVND(t.platformFee) : "—"}
                                            </td>
                                            <td className="py-3.5 px-4 text-emerald-700 font-semibold">
                                                {t.caregiverPay > 0 ? formatVND(t.caregiverPay) : "—"}
                                            </td>
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="font-semibold text-slate-700">{t.date}</div>
                                                <div className="text-[11px] text-slate-400">{t.time}</div>
                                            </td>
                                            <td className="py-3.5 px-4 sm:px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${TX_STATUS[t.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60">
                        <span>Tổng <strong className="text-slate-700">{filteredTx.length}</strong> giao dịch</span>
                        <span className="text-emerald-600 font-semibold">
                            Tổng thu: <strong>{formatVND(totalRevenue)}</strong>
                        </span>
                    </div>
                </div>
            )}

            {/* ── WITHDRAWAL TABLE ── */}
            {activeTab === "withdrawals" && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3.5 px-4 sm:px-5 w-24 whitespace-nowrap">Mã yêu cầu</th>
                                    <th className="py-3.5 px-4 min-w-[140px]">Điều dưỡng</th>
                                    <th className="py-3.5 px-4 whitespace-nowrap">Số tiền</th>
                                    <th className="py-3.5 px-4 min-w-[150px]">Ngân hàng & Số TK</th>
                                    <th className="py-3.5 px-4 whitespace-nowrap">Ngày yêu cầu</th>
                                    <th className="py-3.5 px-4 whitespace-nowrap">Trạng thái</th>
                                    <th className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {filteredWd.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center text-slate-400">
                                            <Banknote className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                            <p className="font-semibold">Không tìm thấy yêu cầu rút tiền nào</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredWd.map((w) => {
                                        const sc = WD_STATUS[w.status];
                                        const isPending = w.status === "Chờ duyệt";
                                        return (
                                            <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                                                    <span className="font-black text-[#00677c]">{w.id}</span>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 font-bold flex items-center justify-center border border-sky-100 shrink-0 text-[11px]">
                                                            {w.caregiver.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 whitespace-nowrap">{w.caregiver}</div>
                                                            <div className="text-[10px] text-slate-400">{w.caregiverPhone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className="font-black text-slate-900">{formatVND(w.amount)}</span>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                                        <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span>{w.bank}</span>
                                                    </div>
                                                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">{w.accountNumber}</div>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{w.requestDate}</td>
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div>
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${sc.badge}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                                                            {w.status}
                                                        </span>
                                                        {w.note && (
                                                            <div className="text-[10px] text-rose-500 mt-1 max-w-[160px] truncate" title={w.note}>
                                                                {w.note}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                                                    {isPending ? (
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={() => setApproveTarget(w)}
                                                                disabled={actionLoadingId === w.id}
                                                                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all border border-emerald-200 cursor-pointer inline-flex items-center gap-1 shadow-2xs disabled:opacity-50"
                                                            >
                                                                {actionLoadingId === w.id ? (
                                                                    <span className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                                )}
                                                                Duyệt chi
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setRejectTarget(w)}
                                                                disabled={actionLoadingId === w.id}
                                                                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white font-bold text-xs transition-all border border-rose-200 cursor-pointer inline-flex items-center gap-1 shadow-2xs disabled:opacity-50"
                                                            >
                                                                <XCircle className="w-3.5 h-3.5" />
                                                                Từ chối
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 text-right block pr-4">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60">
                        <span>Tổng <strong className="text-slate-700">{filteredWd.length}</strong> yêu cầu rút tiền</span>
                        {pendingWithdrawals > 0 && (
                            <span className="text-amber-600 font-semibold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {pendingWithdrawals} yêu cầu đang chờ duyệt
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
