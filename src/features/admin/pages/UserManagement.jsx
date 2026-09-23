import React, { useState } from "react";
import {
    Search,
    RotateCcw,
    Users,
    User,
    Lock,
    Unlock,
    CheckCircle2,
    Phone,
    Mail,
    CalendarDays,
    ShieldCheck,
    ShieldOff,
    AlertCircle,
} from "lucide-react";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const initialFamilies = [
    {
        id: "FAM-001",
        name: "Nguyễn Thu Hà",
        email: "ha.nguyen@gmail.com",
        phone: "0901 234 567",
        joinDate: "15/03/2026",
        status: "Hoạt động",
        totalBookings: 12,
        location: "Quận 1, TP.HCM",
    },
    {
        id: "FAM-002",
        name: "Trần Minh Khoa",
        email: "khoa.tran@gmail.com",
        phone: "0977 111 222",
        joinDate: "02/05/2026",
        status: "Hoạt động",
        totalBookings: 5,
        location: "Quận 3, TP.HCM",
    },
    {
        id: "FAM-003",
        name: "Phạm Thị Bích",
        email: "bich.pham@yahoo.com",
        phone: "0933 456 789",
        joinDate: "20/06/2026",
        status: "Bị khóa",
        totalBookings: 2,
        location: "Quận 5, TP.HCM",
    },
    {
        id: "FAM-004",
        name: "Lê Văn Dũng",
        email: "dung.le@outlook.com",
        phone: "0966 333 444",
        joinDate: "10/07/2026",
        status: "Hoạt động",
        totalBookings: 8,
        location: "Quận 4, TP.HCM",
    },
    {
        id: "FAM-005",
        name: "Võ Thị Thanh",
        email: "thanh.vo@gmail.com",
        phone: "0944 555 666",
        joinDate: "05/08/2026",
        status: "Hoạt động",
        totalBookings: 3,
        location: "Quận 1, TP.HCM",
    },
    {
        id: "FAM-006",
        name: "Hoàng Minh Tuấn",
        email: "tuan.hoang@gmail.com",
        phone: "0911 777 888",
        joinDate: "18/08/2026",
        status: "Bị khóa",
        totalBookings: 1,
        location: "Quận 1, TP.HCM",
    },
    {
        id: "FAM-007",
        name: "Bùi Thị Lan",
        email: "lan.bui@gmail.com",
        phone: "0955 123 456",
        joinDate: "01/09/2026",
        status: "Hoạt động",
        totalBookings: 4,
        location: "Quận 1, TP.HCM",
    },
];

const initialCaregivers = [
    {
        id: "CG-101",
        name: "Trần Thị Mai",
        email: "mai.tran@med.edu.vn",
        phone: "0901 234 567",
        joinDate: "10/03/2026",
        status: "Hoạt động",
        role: "Sinh viên Y khoa",
        completedShifts: 34,
        rating: "4.8",
    },
    {
        id: "CG-102",
        name: "Lê Hoàng Long",
        email: "long.le@hospital.vn",
        phone: "0912 345 678",
        joinDate: "08/02/2026",
        status: "Hoạt động",
        role: "Điều dưỡng chuyên nghiệp",
        completedShifts: 87,
        rating: "4.9",
    },
    {
        id: "CG-103",
        name: "Nguyễn Thị Phương Thảo",
        email: "thao.nguyen@pnt.edu.vn",
        phone: "0988 765 432",
        joinDate: "22/04/2026",
        status: "Hoạt động",
        role: "Sinh viên Y khoa",
        completedShifts: 19,
        rating: "4.7",
    },
    {
        id: "CG-104",
        name: "Phạm Quốc Huy",
        email: "huy.pham@carelink.vn",
        phone: "0933 456 789",
        joinDate: "15/01/2026",
        status: "Bị khóa",
        role: "Điều dưỡng chuyên nghiệp",
        completedShifts: 62,
        rating: "3.9",
    },
    {
        id: "CG-105",
        name: "Vũ Thị Bích Trâm",
        email: "tram.vu@gmail.com",
        phone: "0977 112 233",
        joinDate: "11/07/2026",
        status: "Bị khóa",
        role: "Sinh viên Y khoa",
        completedShifts: 5,
        rating: "3.2",
    },
    {
        id: "CG-106",
        name: "Đặng Văn Bình",
        email: "binh.dang@hospital.vn",
        phone: "0944 888 999",
        joinDate: "03/05/2026",
        status: "Hoạt động",
        role: "Điều dưỡng chuyên nghiệp",
        completedShifts: 45,
        rating: "4.6",
    },
];

// ── TOAST ──────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
    if (!message) return null;
    const isLock = type === "lock";
    return (
        <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg border flex items-center gap-3 ${
                isLock
                    ? "bg-rose-600 text-white border-rose-400"
                    : "bg-[#00677c] text-white border-teal-400"
            }`}
        >
            {isLock ? (
                <ShieldOff className="w-4 h-4 text-rose-200 shrink-0" />
            ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            )}
            <span className="text-xs font-bold">{message}</span>
        </div>
    );
}

// ── USER ROW TABLE ─────────────────────────────────────────────────────────────
function UserRow({ user, onToggleLock, isCaregiver }) {
    const isLocked = user.status === "Bị khóa";
    return (
        <tr className="hover:bg-slate-50/80 transition-colors">
            {/* Avatar & Name */}
            <td className="py-3.5 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center border shrink-0 text-sm ${
                            isCaregiver
                                ? "bg-sky-50 text-sky-600 border-sky-100"
                                : "bg-teal-50 text-[#00677c] border-teal-100"
                        }`}
                    >
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                        <div className="text-[10px] text-slate-400">{user.id}</div>
                    </div>
                </div>
            </td>

            {/* Email */}
            <td className="py-3.5 px-4">
                <span className="text-xs text-slate-600 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user.email}
                </span>
            </td>

            {/* Phone */}
            <td className="py-3.5 px-4">
                <span className="text-xs text-slate-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {user.phone}
                </span>
            </td>

            {/* Join Date */}
            <td className="py-3.5 px-4">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    {user.joinDate}
                </span>
            </td>

            {/* Role / Metric */}
            <td className="py-3.5 px-4">
                {isCaregiver ? (
                    <div>
                        <span
                            className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                                user.role === "Điều dưỡng chuyên nghiệp"
                                    ? "bg-teal-50 text-[#00677c] border border-teal-200"
                                    : "bg-sky-50 text-sky-700 border border-sky-200"
                            }`}
                        >
                            {user.role}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{user.completedShifts} ca · ⭐ {user.rating}</div>
                    </div>
                ) : (
                    <div className="text-xs text-slate-500">
                        {user.totalBookings} lượt đặt · {user.location}
                    </div>
                )}
            </td>

            {/* Status */}
            <td className="py-3.5 px-4">
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        isLocked
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${isLocked ? "bg-rose-500" : "bg-emerald-500"}`}></span>
                    {user.status}
                </span>
            </td>

            {/* Action */}
            <td className="py-3.5 px-4 sm:px-6 text-right">
                <button
                    type="button"
                    onClick={() => onToggleLock(user.id)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 ${
                        isLocked
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200"
                    }`}
                >
                    {isLocked ? (
                        <><Unlock className="w-3.5 h-3.5" /> Mở khóa</>
                    ) : (
                        <><Lock className="w-3.5 h-3.5" /> Khóa</>
                    )}
                </button>
            </td>
        </tr>
    );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function UserManagement() {
    const [families, setFamilies] = useState(initialFamilies);
    const [caregivers, setCaregivers] = useState(initialCaregivers);
    const [activeTab, setActiveTab] = useState("family");
    const [searchQuery, setSearchQuery] = useState("");
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "unlock") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleToggleFamilyLock = (id) => {
        setFamilies((prev) =>
            prev.map((u) => {
                if (u.id !== id) return u;
                const willLock = u.status === "Hoạt động";
                showToast(
                    willLock
                        ? `Đã khóa tài khoản ${u.name}. Người dùng không thể đăng nhập.`
                        : `Đã mở khóa tài khoản ${u.name}. Tài khoản hoạt động trở lại.`,
                    willLock ? "lock" : "unlock"
                );
                return { ...u, status: willLock ? "Bị khóa" : "Hoạt động" };
            })
        );
    };

    const handleToggleCaregiverLock = (id) => {
        setCaregivers((prev) =>
            prev.map((u) => {
                if (u.id !== id) return u;
                const willLock = u.status === "Hoạt động";
                showToast(
                    willLock
                        ? `Đã khóa tài khoản điều dưỡng ${u.name}.`
                        : `Đã mở khóa tài khoản điều dưỡng ${u.name}.`,
                    willLock ? "lock" : "unlock"
                );
                return { ...u, status: willLock ? "Bị khóa" : "Hoạt động" };
            })
        );
    };

    const filteredFamilies = families.filter((u) => {
        const q = searchQuery.toLowerCase();
        return (
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.includes(q)
        );
    });

    const filteredCaregivers = caregivers.filter((u) => {
        const q = searchQuery.toLowerCase();
        return (
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.includes(q)
        );
    });

    const lockedFamilies = families.filter((u) => u.status === "Bị khóa").length;
    const lockedCaregivers = caregivers.filter((u) => u.status === "Bị khóa").length;

    return (
        <div className="space-y-6 pb-12 font-sans">
            {toast && <Toast message={toast.msg} type={toast.type} />}

            {/* ── HEADER ── */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Quản lý Tài khoản Người dùng
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Quản lý danh sách tài khoản Gia đình và Điều dưỡng. Tìm kiếm, xem trạng thái và thực hiện khóa/mở khóa tài khoản.
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <div className="text-center bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2">
                            <div className="text-lg font-black text-slate-900">{families.length + caregivers.length}</div>
                            <div className="text-[10px] text-slate-500 font-semibold">Tổng tài khoản</div>
                        </div>
                        {(lockedFamilies + lockedCaregivers) > 0 && (
                            <div className="text-center bg-rose-50 border border-rose-200 rounded-xl px-4 py-2">
                                <div className="text-lg font-black text-rose-700">{lockedFamilies + lockedCaregivers}</div>
                                <div className="text-[10px] text-rose-500 font-semibold">Đang bị khóa</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── SEARCH & TABS ── */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3">
                {/* Tabs */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
                    <button
                        type="button"
                        onClick={() => { setActiveTab("family"); setSearchQuery(""); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === "family"
                                ? "bg-white text-[#00677c] shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <Users className="w-3.5 h-3.5" />
                        Gia đình
                        <span
                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                                activeTab === "family" ? "bg-teal-50 text-[#00677c]" : "bg-slate-200 text-slate-600"
                            }`}
                        >
                            {families.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab("caregiver"); setSearchQuery(""); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === "caregiver"
                                ? "bg-white text-[#00677c] shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Điều dưỡng
                        <span
                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                                activeTab === "caregiver" ? "bg-teal-50 text-[#00677c]" : "bg-slate-200 text-slate-600"
                            }`}
                        >
                            {caregivers.length}
                        </span>
                    </button>
                </div>

                {/* Search */}
                <div className="relative w-full">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm theo Tên, Email, Số điện thoại..."
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

            {/* ── TABLE ── */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="py-3.5 px-4 sm:px-6">Người dùng</th>
                                <th className="py-3.5 px-4">Email</th>
                                <th className="py-3.5 px-4">Số điện thoại</th>
                                <th className="py-3.5 px-4">Ngày tham gia</th>
                                <th className="py-3.5 px-4">{activeTab === "caregiver" ? "Vai trò & Chỉ số" : "Thông tin"}</th>
                                <th className="py-3.5 px-4">Trạng thái</th>
                                <th className="py-3.5 px-4 sm:px-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {activeTab === "family" ? (
                                filteredFamilies.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center text-slate-400">
                                            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                            <p className="font-semibold">Không tìm thấy tài khoản gia đình nào</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFamilies.map((u) => (
                                        <UserRow
                                            key={u.id}
                                            user={u}
                                            onToggleLock={handleToggleFamilyLock}
                                            isCaregiver={false}
                                        />
                                    ))
                                )
                            ) : filteredCaregivers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-slate-400">
                                        <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p className="font-semibold">Không tìm thấy tài khoản điều dưỡng nào</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredCaregivers.map((u) => (
                                    <UserRow
                                        key={u.id}
                                        user={u}
                                        onToggleLock={handleToggleCaregiverLock}
                                        isCaregiver={true}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60">
                    <span>
                        Đang xem <strong className="text-slate-700">{activeTab === "family" ? filteredFamilies.length : filteredCaregivers.length}</strong>{" "}
                        {activeTab === "family" ? "tài khoản gia đình" : "tài khoản điều dưỡng"}
                    </span>
                    {activeTab === "family" && lockedFamilies > 0 && (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> {lockedFamilies} tài khoản đang bị khóa
                        </span>
                    )}
                    {activeTab === "caregiver" && lockedCaregivers > 0 && (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> {lockedCaregivers} tài khoản đang bị khóa
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
