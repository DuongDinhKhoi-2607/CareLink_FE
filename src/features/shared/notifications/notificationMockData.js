/**
 * Dữ liệu mẫu (Demo / Fallback Mock Data) cho Hệ thống Thông báo CareLink.
 * Cấu trúc hoàn toàn đồng bộ với DTO `NotificationResponse` từ Backend:
 * - id: string (UUID)
 * - title: string
 * - message: string
 * - type: string (NotificationTypes)
 * - referenceId: string | null (UUID)
 * - isRead: boolean
 * - createdAt: ISO 8601 string
 */

const now = new Date();

export const mockNotifications = [
    {
        id: "demo-001-booking-accepted",
        title: "Lịch hẹn đã được xác nhận",
        message: "Điều dưỡng Nguyễn Thùy Linh đã nhận lịch hẹn chăm sóc người cao tuổi lúc 08:30 ngày mai.",
        type: "BOOKING_ACCEPTED",
        referenceId: "b0000000-0000-0000-0000-000000000001",
        isRead: false,
        createdAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 phút trước
    },
    {
        id: "demo-002-proposal-created",
        title: "Đề xuất ca chăm sóc mới #1024",
        message: "Gia đình Bác An đã gửi một đề xuất ca chăm sóc phục hồi chức năng kèm theo ghi chú y tế.",
        type: "PROPOSAL_CREATED",
        referenceId: "c0000000-0000-0000-0000-000000000002",
        isRead: false,
        createdAt: new Date(now.getTime() - 42 * 60 * 1000).toISOString(), // 42 phút trước
    },
    {
        id: "demo-003-payment-succeeded",
        title: "Thanh toán thành công qua PayOS",
        message: "Bạn đã hoàn tất thanh toán 450.000đ cho ca chăm sóc định kỳ. Mã giao dịch: PAY-8921.",
        type: "PAYMENT_SUCCEEDED",
        referenceId: "b0000000-0000-0000-0000-000000000003",
        isRead: false,
        createdAt: new Date(now.getTime() - 3 * 3600 * 1000).toISOString(), // 3 giờ trước
    },
    {
        id: "demo-004-nurse-verified",
        title: "Hồ sơ điều dưỡng đã được phê duyệt!",
        message: "Chúc mừng bạn! Hồ sơ chứng chỉ hành nghề y tế đã được Ban Quản trị phê duyệt thành công.",
        type: "NurseVerificationApproved",
        referenceId: "n0000000-0000-0000-0000-000000000004",
        isRead: true,
        createdAt: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(), // 1 ngày trước
    },
    {
        id: "demo-005-wallet-credited",
        title: "Ví điều dưỡng đã được cộng tiền",
        message: "Bạn đã nhận được 405.000đ thu nhập từ ca chăm sóc vừa hoàn thành. Số dư ví khả dụng: 1.850.000đ.",
        type: "WALLET_CREDITED",
        referenceId: "w0000000-0000-0000-0000-000000000005",
        isRead: true,
        createdAt: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(), // 3 ngày trước
    },
];

export const mockUnreadCount = mockNotifications.filter((n) => !n.isRead).length;
