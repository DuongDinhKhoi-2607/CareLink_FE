import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, AlertCircle, CheckCircle2, XCircle, RotateCcw, Clock, ShieldAlert, Loader2, RefreshCw } from "lucide-react";
import adminApi from "../../../api/adminApi";

const mapDisputeDto = (d) => {
    const rawSt = d.status;
    const stLower = String(rawSt ?? "").toLowerCase();
    const resType = Number(d.resolutionType);

    let status = "pending";
    let statusLabel = rawSt === 2 || stLower === "processing" ? "Đang xử lý" : "Chờ xử lý";

    if (rawSt === 3 || stLower === "resolved" || resType === 1) {
        status = "refunded";
        statusLabel = "Đã duyệt hoàn · Chờ chuyển khoản";
    } else if (rawSt === 4 || stLower === "dismissed" || stLower === "rejected" || resType === 2) {
        status = "rejected";
        statusLabel = "Đã bác bỏ";
    }

    const evidenceList = Array.isArray(d.evidenceUrls) && d.evidenceUrls.length > 0
        ? d.evidenceUrls
        : Array.isArray(d.evidence) && d.evidence.length > 0
        ? d.evidence
        : (d.evidence ? [d.evidence] : []);

    return {
        id: d.code || (d.id ? `DSP-${String(d.id).slice(0, 8).toUpperCase()}` : "DSP"),
        rawId: d.id,
        bookingId: d.bookingCode || (d.bookingId ? `CA-${String(d.bookingId).slice(0, 8).toUpperCase()}` : "CA"),
        rawBookingId: d.bookingId,
        createdAt: d.createdAt ? new Date(d.createdAt).toLocaleString("vi-VN") : "Chưa rõ",
        service: d.serviceName || d.service || "Dịch vụ chăm sóc",
        totalAmount: Number(d.totalAmount ?? d.bookingAmount ?? d.amount ?? 0),
        family: {
            name: d.customerName || d.familyName || "Gia đình khách hàng",
            phone: d.customerPhone || d.familyPhone || "Chưa cập nhật",
            avatar: d.customerAvatar || d.familyAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.customerName || "Gia đình")}&background=087487&color=fff`,
            address: d.bookingAddress || d.address || "Chưa cập nhật",
            relative: d.recipientName || d.patientName || "Người nhận chăm sóc",
        },
        caregiver: {
            name: d.nurseName || d.caregiverName || "Điều dưỡng CareLink",
            phone: d.nursePhone || d.caregiverPhone || "Chưa cập nhật",
            avatar: d.nurseAvatar || d.caregiverAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.nurseName || "Điều dưỡng")}&background=00677c&color=fff`,
            title: d.nurseTitle || "Điều dưỡng viên",
        },
        reason: d.reason || "",
        description: d.description || "",
        evidence: evidenceList,
        caregiverExplanation: d.caregiverExplanation || d.nurseExplanation || "Chưa có văn bản giải trình bổ sung từ điều dưỡng.",
        status,
        statusLabel,
        resolutionNotes: d.resolutionNote || d.resolutionNotes || d.notes || "",
        refundAmount: Number(d.refundAmount || 0),
        resolvedAt: d.resolvedAt ? new Date(d.resolvedAt).toLocaleString("vi-VN") : null,
    };
};

export default function AdminDisputes() {
    const [disputes, setDisputes] = useState([]);

    const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pending' | 'refunded' | 'rejected'
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDispute, setSelectedDispute] = useState(null); // Cho modal phân xử
    const [resolutionAction, setResolutionAction] = useState("refund_full"); // 'refund_full' | 'refund_partial' | 'reject'
    const [partialAmount, setPartialAmount] = useState(0);
    const [adminNotes, setAdminNotes] = useState("");
    const [toastMessage, setToastMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [resolving, setResolving] = useState(false);
    const [actionError, setActionError] = useState("");
    const [fetchingDetail, setFetchingDetail] = useState(false);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4500);
    };

    // ── 74. GET /api/v1/admin/disputes ── Lấy danh sách khiếu nại toàn sàn
    const fetchDisputes = useCallback(async () => {
        setLoading(true);
        setFetchError("");
        try {
            const res = await adminApi.getDisputes({ pageNumber: 1, pageSize: 50 });
            const rawList = Array.isArray(res)
                ? res
                : Array.isArray(res?.items)
                ? res.items
                : Array.isArray(res?.data?.items)
                ? res.data.items
                : Array.isArray(res?.data)
                ? res.data
                : [];

            setDisputes(rawList.map(mapDisputeDto));
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Không thể tải danh sách khiếu nại từ máy chủ. Vui lòng thử lại.";
            console.error("[CareLink Admin] Tải danh sách khiếu nại thất bại:", err);
            setFetchError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDisputes();
    }, [fetchDisputes]);

    // Lọc danh sách khiếu nại
    const filteredDisputes = disputes.filter((d) => {
        if (activeTab !== "all" && d.status !== activeTab) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            d.id.toLowerCase().includes(q) ||
            d.bookingId.toLowerCase().includes(q) ||
            d.family.name.toLowerCase().includes(q) ||
            d.caregiver.name.toLowerCase().includes(q) ||
            d.reason.toLowerCase().includes(q)
        );
    });

    const pendingCount = disputes.filter((d) => d.status === "pending").length;
    const refundedCount = disputes.filter((d) => d.status === "refunded").length;
    const rejectedCount = disputes.filter((d) => d.status === "rejected").length;

    // ── 73. GET /api/v1/disputes/{id} ── Mở modal phân xử & lấy chi tiết khiếu nại mới nhất
    const handleOpenResolution = async (dispute) => {
        setSelectedDispute(dispute);
        setResolutionAction("refund_full");
        setPartialAmount(Math.max(1000, Math.round(dispute.totalAmount / 2)));
        setAdminNotes("");
        setActionError("");

        const targetId = dispute.rawId || dispute.id;
        if (targetId) {
            setFetchingDetail(true);
            try {
                const res = await adminApi.getDisputeDetail(targetId);
                const detail = res?.data && !res?.id ? res.data : res;
                if (detail && detail.id) {
                    const mappedDetail = mapDisputeDto(detail);
                    setSelectedDispute((prev) => (prev ? { ...prev, ...mappedDetail } : mappedDetail));
                }
            } catch (err) {
                console.warn("[CareLink Admin] Không thể tải chi tiết khiếu nại mới nhất:", err);
            } finally {
                setFetchingDetail(false);
            }
        }
    };

    // ── 75. PUT /api/v1/admin/disputes/{id} ── Phê duyệt / phân xử khiếu nại
    const handleConfirmResolution = async (e) => {
        e.preventDefault();
        if (!selectedDispute) return;

        const trimmedNote = adminNotes.trim();
        if (!trimmedNote) {
            setActionError("Vui lòng nhập ghi chú kết luận phân xử.");
            return;
        }

        const isReject = resolutionAction === "reject";
        let actualRefund = selectedDispute.totalAmount;
        if (resolutionAction === "refund_partial") {
            actualRefund = Number(partialAmount);
        } else if (isReject) {
            actualRefund = 0;
        }

        if (!isReject) {
            if (!Number.isFinite(actualRefund) || actualRefund <= 0) {
                setActionError("Số tiền duyệt hoàn phải lớn hơn 0 đ.");
                return;
            }
            if (actualRefund > selectedDispute.totalAmount) {
                setActionError(
                    `Số tiền duyệt hoàn (${actualRefund.toLocaleString("vi-VN")} ₫) không được vượt quá giá trị ca (${selectedDispute.totalAmount.toLocaleString("vi-VN")} ₫).`
                );
                return;
            }
        }

        setActionError("");
        setResolving(true);
        const targetId = selectedDispute.rawId || selectedDispute.id;
        const resolutionPayload = {
            resolutionType: isReject ? 2 : 1,
            refundAmount: actualRefund,
            resolutionNote: trimmedNote,
        };

        try {
            const res = await adminApi.resolveDispute(targetId, resolutionPayload);
            const updatedDto = res?.data && !res?.id ? res.data : res;
            const mappedUpdated = updatedDto?.id ? mapDisputeDto(updatedDto) : null;

            setDisputes((prev) =>
                prev.map((item) => {
                    if ((item.rawId || item.id) !== targetId) return item;
                    return (
                        mappedUpdated || {
                            ...item,
                            status: isReject ? "rejected" : "refunded",
                            statusLabel: isReject ? "Đã bác bỏ" : "Đã duyệt hoàn · Chờ chuyển khoản",
                            refundAmount: actualRefund,
                            resolutionNotes: trimmedNote,
                            resolvedAt: new Date().toLocaleString("vi-VN"),
                        }
                    );
                })
            );

            setSelectedDispute(null);
            window.dispatchEvent(new Event("carelink:admin-refresh-badges"));
            showToast(
                isReject
                    ? `Đã bác bỏ khiếu nại ${selectedDispute.id}.`
                    : `Đã duyệt hoàn ${actualRefund.toLocaleString("vi-VN")} ₫ cho gia đình và đối soát vào ví điều dưỡng. Bộ phận tài chính cần chuyển khoản hoàn tiền cho khách hàng.`
            );
            fetchDisputes();
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                err?.message ||
                "Không thể lưu kết quả phân xử. Vui lòng kiểm tra lại và thử lại.";
            console.error("[CareLink Admin] Lỗi phân xử khiếu nại:", err);
            setActionError(msg);
        } finally {
            setResolving(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col gap-8 max-w-[1460px] w-full mx-auto font-sans">
            {/* Toast thông báo */}
            {toastMessage && (
                <div className="fixed top-20 right-6 z-50 bg-[#00677c] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-teal-300/30 text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
                    <CheckCircle2 className="w-5 h-5 text-teal-200" />
                    {toastMessage}
                </div>
            )}

            {/* Header trang */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200/60 flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Phân xử & Tranh chấp
                        </span>
                        {pendingCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/60">
                                {pendingCount} khiếu nại đang chờ giải quyết
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002045] mt-1.5 tracking-tight">
                        Quản lý Khiếu nại & Tranh chấp
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Đối chiếu phản ánh từ khách hàng và giải trình điều dưỡng để đưa ra quyết định hoàn tiền hoặc bác bỏ
                    </p>
                </div>
            </header>

            {/* ── KPI THỐNG KÊ NHANH ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Tổng khiếu nại</span>
                    <p className="text-2xl font-extrabold text-[#002045] mt-1">{disputes.length}</p>
                </div>
                <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
                    <span className="text-xs text-amber-700 font-semibold uppercase">Chờ xử lý</span>
                    <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
                </div>
                <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200/80 shadow-2xs">
                    <span className="text-xs text-emerald-700 font-semibold uppercase">Đã duyệt hoàn</span>
                    <p className="text-2xl font-extrabold text-emerald-600 mt-1">{refundedCount}</p>
                </div>
                <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200/80 shadow-2xs">
                    <span className="text-xs text-rose-700 font-semibold uppercase">Đã bác bỏ</span>
                    <p className="text-2xl font-extrabold text-rose-600 mt-1">{rejectedCount}</p>
                </div>
            </div>

            {fetchError && (
                <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-rose-800 text-xs font-medium">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{fetchError}</span>
                    </div>
                    <button
                        type="button"
                        onClick={fetchDisputes}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Thử lại
                    </button>
                </div>
            )}

            {/* ── TABS & THANH TÌM KIẾM ── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start">
                    {[
                        { key: "all", label: `Tất cả (${disputes.length})` },
                        { key: "pending", label: `Chờ xử lý (${pendingCount})` },
                        { key: "refunded", label: `Đã duyệt hoàn (${refundedCount})` },
                        { key: "rejected", label: `Đã bác bỏ (${rejectedCount})` },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                activeTab === tab.key
                                    ? "bg-white text-[#002045] shadow-xs"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm mã khiếu nại, mã ca, họ tên..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-600"
                    />
                </div>
            </div>

            {/* ── BẢNG DANH SÁCH KHIẾU NẠI ── */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                                <th className="p-4">Mã khiếu nại</th>
                                <th className="p-4">Ca chăm sóc</th>
                                <th className="p-4">Người khiếu nại (Gia đình)</th>
                                <th className="p-4">Điều dưỡng phụ trách</th>
                                <th className="p-4">Số tiền ca</th>
                                <th className="p-4">Trạng thái</th>
                                <th className="p-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-400">
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                                            Đang tải danh sách khiếu nại...
                                        </span>
                                    </td>
                                </tr>
                            ) : filteredDisputes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-400">
                                        {fetchError
                                            ? "Không thể hiển thị danh sách khiếu nại do lỗi kết nối."
                                            : "Không tìm thấy khiếu nại nào phù hợp với bộ lọc."}
                                    </td>
                                </tr>
                            ) : (
                                filteredDisputes.map((d) => (
                                    <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-4">
                                            <span className="font-bold font-mono text-[#002045] text-sm block">{d.id}</span>
                                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                <Clock className="w-3 h-3" /> {d.createdAt}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-teal-800 font-mono block">{d.bookingId}</span>
                                            <span className="text-[11px] text-slate-500">{d.service}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2.5">
                                                <img src={d.family.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                                                <div>
                                                    <strong className="text-slate-800 block text-xs">{d.family.name}</strong>
                                                    <span className="text-[10px] text-slate-400">Chăm sóc: {d.family.relative}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2.5">
                                                <img src={d.caregiver.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                                                <div>
                                                    <strong className="text-slate-800 block text-xs">{d.caregiver.name}</strong>
                                                    <span className="text-[10px] text-teal-600 font-medium">{d.caregiver.title}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-bold text-slate-800 text-sm">
                                            {d.totalAmount.toLocaleString("vi-VN")} ₫
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border ${
                                                    d.status === "pending"
                                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                                        : d.status === "refunded"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-rose-50 text-rose-700 border-rose-200/90"
                                                }`}
                                            >
                                                {d.status === "pending" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                                                {d.status === "rejected" && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
                                                {d.status === "refunded" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                                                {d.statusLabel}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenResolution(d)}
                                                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-teal-600 text-slate-700 hover:text-teal-700 text-xs font-semibold transition-all shadow-2xs"
                                            >
                                                {d.status === "pending" ? "Phân xử ngay" : "Xem chi tiết"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL XEM CHI TIẾT & PHÂN XỬ KHIẾU NẠI (ADMIN DISPUTE RESOLUTION DESK) ── */}
            {selectedDispute && createPortal(
                <div
                    className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden"
                    onClick={() => setSelectedDispute(null)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ── MODAL HEADER ── */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200/80 shadow-2xs shrink-0">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base sm:text-lg font-bold text-[#002045]">
                                            Hồ sơ Phân xử Khiếu nại #{selectedDispute.id}
                                        </h3>
                                        <span className="font-mono text-xs text-teal-800 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                                            Ca: {selectedDispute.bookingId}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Thời gian gửi: {selectedDispute.createdAt} · Dịch vụ: <strong>{selectedDispute.service}</strong>
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedDispute(null)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* ── MODAL BODY: 2-COLUMN SPLIT DESK (OVERFLOW-Y SCROLLABLE) ── */}
                        <div className="overflow-y-auto flex-1 p-5 sm:p-7">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
                                {/* CỘT TRÁI (LG: 7): HỒ SƠ 2 BÊN & BẰNG CHỨNG PHẢN ÁNH */}
                                <div className="lg:col-span-7 space-y-4">
                                    {/* Thẻ 2 bên tham gia */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                                                Bên khiếu nại (Gia đình):
                                            </span>
                                            <div className="flex items-center gap-2.5">
                                                <img src={selectedDispute.family.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                                                <div className="min-w-0">
                                                    <strong className="text-slate-800 text-xs block truncate">{selectedDispute.family.name}</strong>
                                                    <p className="text-slate-500 text-[11px]">{selectedDispute.family.phone}</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-[11px] pt-1.5 border-t border-slate-200/60">
                                                Người thân: <strong>{selectedDispute.family.relative}</strong>
                                            </p>
                                        </div>

                                        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">
                                                Bên bị khiếu nại (Điều dưỡng):
                                            </span>
                                            <div className="flex items-center gap-2.5">
                                                <img src={selectedDispute.caregiver.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                                                <div className="min-w-0">
                                                    <strong className="text-slate-800 text-xs block truncate">{selectedDispute.caregiver.name}</strong>
                                                    <p className="text-teal-700 font-medium text-[11px] truncate">{selectedDispute.caregiver.title}</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-[11px] pt-1.5 border-t border-slate-200/60">
                                                Tiền ca: <strong className="text-teal-800 font-bold">{selectedDispute.totalAmount.toLocaleString("vi-VN")} ₫</strong>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phản ánh từ khách hàng & Bằng chứng */}
                                    <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-rose-800 font-bold flex items-center gap-1.5 text-xs">
                                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                                Nội dung phản ánh từ khách hàng:
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-rose-100/70 text-rose-700 text-[10px] font-bold">
                                                Khiếu nại ca trực
                                            </span>
                                        </div>
                                        <p className="text-slate-700 italic leading-relaxed bg-white/70 p-3 rounded-xl border border-rose-100">
                                            "{selectedDispute.reason}"
                                        </p>
                                        {selectedDispute.evidence.length > 0 && (
                                            <div className="pt-2 border-t border-rose-200/60">
                                                <span className="text-slate-500 font-bold text-[11px] block mb-1">
                                                    Minh chứng xác thực đính kèm ({selectedDispute.evidence.length}):
                                                </span>
                                                <ul className="list-disc list-inside text-slate-600 space-y-1 text-[11px]">
                                                    {selectedDispute.evidence.map((ev, i) => (
                                                        <li key={i}>{ev}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bản giải trình từ phía Điều dưỡng */}
                                    <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-teal-800 font-bold flex items-center gap-1.5 text-xs">
                                                <RotateCcw className="w-4 h-4 text-teal-600 shrink-0" />
                                                Giải trình từ phía Điều dưỡng:
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-teal-100/70 text-teal-700 text-[10px] font-bold">
                                                Bản tường trình
                                            </span>
                                        </div>
                                        <p className="text-slate-700 italic leading-relaxed bg-white/70 p-3 rounded-xl border border-teal-100">
                                            "{selectedDispute.caregiverExplanation}"
                                        </p>
                                    </div>

                                    {/* Trạng thái đã phân xử trước đó nếu có */}
                                    {selectedDispute.resolvedAt && (
                                        <div className="p-4 bg-slate-100 rounded-2xl space-y-1.5">
                                            <span className="font-bold text-slate-800 block text-xs">
                                                Kết luận đã ban hành ({selectedDispute.resolvedAt}):
                                            </span>
                                            <p className="text-slate-600 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                                                {selectedDispute.resolutionNotes}
                                            </p>
                                            {selectedDispute.refundAmount > 0 && (
                                                <p className="text-emerald-700 font-bold text-xs pt-1">
                                                    Khoản hoàn tiền đã duyệt (chờ chuyển khoản cho gia đình): {selectedDispute.refundAmount.toLocaleString("vi-VN")} ₫
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* CỘT PHẢI (LG: 5): BÀN PHÁN QUYẾT & HÀNH ĐỘNG CỦA ADMIN */}
                                <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                                    {selectedDispute.status === "pending" ? (
                                        <form onSubmit={handleConfirmResolution} className="space-y-4">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-slate-800 font-bold uppercase tracking-wider text-[11px] block">
                                                        Phán quyết của Quản trị viên:
                                                    </label>
                                                    <span className="text-[10px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md font-bold">
                                                        Cần xử lý
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                                                    Chọn hình thức tài chính phù hợp dựa trên đối soát thực tế.
                                                </p>

                                                <div className="space-y-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setResolutionAction("refund_full")}
                                                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                                                            resolutionAction === "refund_full"
                                                                ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs font-bold"
                                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                                <span className="font-bold">Chấp thuận hoàn 100% tiền ca</span>
                                                            </div>
                                                            <span className="text-emerald-700 font-extrabold text-xs">
                                                                {selectedDispute.totalAmount.toLocaleString("vi-VN")} ₫
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] font-normal text-slate-500">
                                                            Khấu trừ đối soát ví điều dưỡng; bộ phận tài chính chuyển khoản hoàn lại cho gia đình.
                                                        </p>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setResolutionAction("refund_partial")}
                                                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                                                            resolutionAction === "refund_partial"
                                                                ? "bg-teal-50 border-teal-600 text-teal-950 shadow-xs font-bold"
                                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <RotateCcw className="w-4 h-4 text-teal-600" />
                                                                <span className="font-bold">Chấp thuận hoàn một phần tiền ca</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] font-normal text-slate-500">
                                                            Hoàn một phần theo thỏa thuận 2 bên; bộ phận tài chính chuyển khoản cho gia đình.
                                                        </p>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setResolutionAction("reject")}
                                                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                                                            resolutionAction === "reject"
                                                                ? "bg-rose-50 border-rose-600 text-rose-950 shadow-xs font-bold"
                                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <XCircle className="w-4 h-4 text-rose-600" />
                                                                <span className="font-bold">Bác bỏ khiếu nại</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] font-normal text-slate-500">
                                                            Khiếu nại không có căn cứ, bảo vệ quyền lợi điều dưỡng.
                                                        </p>
                                                    </button>
                                                </div>
                                            </div>

                                            {resolutionAction === "refund_partial" && (
                                                <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-1.5">
                                                    <label className="block text-slate-700 font-bold text-[11px]">
                                                        Số tiền hoàn lại cho gia đình (VNĐ) *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        required
                                                        max={selectedDispute.totalAmount}
                                                        value={partialAmount}
                                                        onChange={(e) => setPartialAmount(Number(e.target.value))}
                                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 focus:bg-white font-bold text-xs"
                                                    />
                                                    <span className="text-[10px] text-slate-400 block">
                                                        Tối đa: {selectedDispute.totalAmount.toLocaleString("vi-VN")} ₫
                                                    </span>
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-slate-700 font-bold text-[11px] mb-1">
                                                    Ghi chú kết luận phân xử (Gửi tới 2 bên) *
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    required
                                                    value={adminNotes}
                                                    onChange={(e) => {
                                                        setAdminNotes(e.target.value);
                                                        if (actionError) setActionError("");
                                                    }}
                                                    placeholder="Nhập căn cứ xử lý của Ban Quản trị CareLink..."
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-600 text-xs leading-relaxed"
                                                />
                                                {actionError && (
                                                    <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                                                        {actionError}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedDispute(null)}
                                                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={resolving || fetchingDetail}
                                                    className="px-5 py-2 bg-gradient-to-r from-[#00677c] to-[#008ba3] hover:from-[#005566] hover:to-[#007489] text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {resolving ? (
                                                        <>
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            Đang ghi nhận...
                                                        </>
                                                    ) : (
                                                        "Xác nhận phán quyết"
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                    <h4 className="font-bold text-[#002045] text-xs">Vụ việc đã được phân xử</h4>
                                                </div>
                                                <p className="text-[11px] text-slate-500">
                                                    {selectedDispute.status === "refunded"
                                                        ? "Quyết định hoàn tiền đã được ghi nhận và đối soát vào ví điều dưỡng. Bộ phận tài chính cần thực hiện chuyển khoản hoàn tiền thực tế cho gia đình theo đúng số tiền đã duyệt."
                                                        : "Hồ sơ này đã có kết luận chính thức bác bỏ khiếu nại."}
                                                </p>
                                            </div>

                                            <div className="flex justify-end pt-2 border-t border-slate-200/60">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedDispute(null)}
                                                    className="px-5 py-2 bg-[#00677c] hover:bg-[#005566] text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                                                >
                                                    Đóng hồ sơ
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
