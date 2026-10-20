import React from "react";
import {
    Bell,
    CalendarCheck,
    CalendarX,
    CalendarPlus,
    Clock,
    CreditCard,
    Wallet,
    RotateCcw,
    MessageSquare,
    ShieldCheck,
    ShieldAlert,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

/**
 * Format relative time in Vietnamese (e.g., "Vừa xong", "5 phút trước", "2 giờ trước")
 * @param {string|Date} dateValue
 * @returns {string}
 */
export function formatNotificationTime(dateValue) {
    if (!dateValue) return "";

    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return "";

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 45) return "Vừa xong";
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays === 1) return "Hôm qua";
        if (diffDays < 7) return `${diffDays} ngày trước`;

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return "";
    }
}

/**
 * Configuration mapping for notification types (Icons, color badges, semantic category)
 * @param {string} type
 * @returns {{ Icon: React.ComponentType, badgeBg: string, iconColor: string, categoryLabel: string }}
 */
export function getNotificationConfig(type) {
    switch (type) {
        case "BOOKING_ACCEPTED":
            return {
                Icon: CalendarCheck,
                badgeBg: "bg-emerald-50 border-emerald-200",
                iconColor: "text-emerald-600",
                categoryLabel: "Lịch hẹn xác nhận",
            };

        case "BOOKING_COMPLETED":
            return {
                Icon: CheckCircle2,
                badgeBg: "bg-teal-50 border-teal-200",
                iconColor: "text-[#00677c]",
                categoryLabel: "Ca hoàn thành",
            };

        case "BOOKING_REJECTED":
        case "BOOKING_CANCELED":
        case "BOOKING_AUTO_REJECTED":
            return {
                Icon: CalendarX,
                badgeBg: "bg-rose-50 border-rose-200",
                iconColor: "text-rose-600",
                categoryLabel: "Lịch hẹn hủy / từ chối",
            };

        case "BOOKING_STARTED":
            return {
                Icon: Clock,
                badgeBg: "bg-sky-50 border-sky-200",
                iconColor: "text-sky-600",
                categoryLabel: "Ca đang thực hiện",
            };

        case "BOOKING_NEW_REQUEST":
            return {
                Icon: CalendarPlus,
                badgeBg: "bg-amber-50 border-amber-200",
                iconColor: "text-amber-600",
                categoryLabel: "Yêu cầu ca mới",
            };

        case "PAYMENT_SUCCEEDED":
            return {
                Icon: CreditCard,
                badgeBg: "bg-emerald-50 border-emerald-200",
                iconColor: "text-emerald-600",
                categoryLabel: "Thanh toán thành công",
            };

        case "PAYMENT_REFUNDED":
            return {
                Icon: RotateCcw,
                badgeBg: "bg-amber-50 border-amber-200",
                iconColor: "text-amber-700",
                categoryLabel: "Hoàn tiền",
            };

        case "WALLET_CREDITED":
        case "PAYOUT_APPROVED":
            return {
                Icon: Wallet,
                badgeBg: "bg-teal-50 border-teal-200",
                iconColor: "text-[#00677c]",
                categoryLabel: "Biến động số dư ví",
            };

        case "PAYOUT_REJECTED":
            return {
                Icon: AlertCircle,
                badgeBg: "bg-rose-50 border-rose-200",
                iconColor: "text-rose-600",
                categoryLabel: "Rút tiền bị từ chối",
            };

        case "PROPOSAL_CREATED":
        case "PROPOSAL_ACCEPTED":
        case "PROPOSAL_REJECTED":
            return {
                Icon: MessageSquare,
                badgeBg: "bg-indigo-50 border-indigo-200",
                iconColor: "text-indigo-600",
                categoryLabel: "Đề xuất chăm sóc",
            };

        case "NurseVerificationApproved":
            return {
                Icon: ShieldCheck,
                badgeBg: "bg-emerald-50 border-emerald-200",
                iconColor: "text-emerald-600",
                categoryLabel: "Hồ sơ đã duyệt",
            };

        case "NurseVerificationRejected":
            return {
                Icon: ShieldAlert,
                badgeBg: "bg-rose-50 border-rose-200",
                iconColor: "text-rose-600",
                categoryLabel: "Hồ sơ từ chối",
            };

        default:
            return {
                Icon: Bell,
                badgeBg: "bg-slate-100 border-slate-200",
                iconColor: "text-slate-600",
                categoryLabel: "Thông báo hệ thống",
            };
    }
}

/**
 * Determine navigation destination when clicking a notification
 * @param {string} type - Notification type
 * @param {string} referenceId - UUID reference
 * @param {string} role - Current user role ('customer'|'family'|'caregiver'|'nurse'|'admin')
 * @returns {string|null} - Destination path or null
 */
export function resolveNotificationRoute(type, referenceId, role = "") {
    const normalizedRole = (role || "").toLowerCase();
    const isCaregiver = normalizedRole === "caregiver" || normalizedRole === "nurse";
    const isAdmin = normalizedRole === "admin";

    if (!type) return null;

    // Booking lifecycle
    if (type.startsWith("BOOKING_")) {
        if (isCaregiver) {
            return "/caregiver/bookings";
        }
        return "/dashboard/appointments";
    }

    // Payment & Wallet
    if (type.startsWith("PAYMENT_")) {
        return "/dashboard/appointments";
    }
    if (type === "WALLET_CREDITED" || type.startsWith("PAYOUT_")) {
        if (isAdmin) return "/admin/finance";
        return "/caregiver/wallet";
    }

    // Proposal / Chat
    if (type.startsWith("PROPOSAL_")) {
        if (isCaregiver) {
            return "/caregiver/messages";
        }
        return "/dashboard/messages";
    }

    // Nurse Verification
    if (type.startsWith("NurseVerification")) {
        if (isAdmin) return "/admin/approvals";
        return "/caregiver/verification";
    }

    // Disputes
    if (type.startsWith("DISPUTE_")) {
        return isAdmin ? "/admin/disputes" : "/dashboard/appointments";
    }

    return null;
}
