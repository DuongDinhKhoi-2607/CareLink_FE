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

export const roleMockNotifications = {
    admin: [
        {
            id: "demo-adm-001",
            title: "Yêu cầu rút tiền #PAY-7712 cần duyệt",
            message: "Điều dưỡng Trần Thị Mai vừa gửi yêu cầu rút 1.250.000đ về tài khoản ngân hàng Vietcombank.",
            type: "PAYOUT_APPROVED",
            referenceId: "w0000000-0000-0000-0000-000000000001",
            isRead: false,
            createdAt: new Date(now.getTime() - 12 * 60 * 1000).toISOString(),
        },
        {
            id: "demo-adm-002",
            title: "Hồ sơ điều dưỡng mới cần thẩm định",
            message: "Ứng viên Nguyễn Văn Minh vừa nộp đủ CCCD, ảnh chân dung và CCHN y tế cần xét duyệt.",
            type: "NurseVerificationApproved",
            referenceId: "n0000000-0000-0000-0000-000000000002",
            isRead: false,
            createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
        },
        {
            id: "demo-adm-003",
            title: "Khiếu nại ca chăm sóc mới #DISP-088",
            message: "Khách hàng Bác An gửi khiếu nại về ca chăm sóc ngày 15/10 cần can thiệp xử lý.",
            type: "DISPUTE_OPENED",
            referenceId: "d0000000-0000-0000-0000-000000000003",
            isRead: true,
            createdAt: new Date(now.getTime() - 3 * 3600 * 1000).toISOString(),
        },
    ],

    caregiver: [
        {
            id: "demo-cg-001",
            title: "Yêu cầu ca chăm sóc mới",
            message: "Gia đình Bác An muốn đặt ca hỗ trợ phục hồi chức năng 3 giờ lúc 09:00 sáng mai.",
            type: "BOOKING_NEW_REQUEST",
            referenceId: "b0000000-0000-0000-0000-000000000001",
            isRead: false,
            createdAt: new Date(now.getTime() - 8 * 60 * 1000).toISOString(),
        },
        {
            id: "demo-cg-002",
            title: "Đề xuất ca chăm sóc #1024",
            message: "Gia đình đã gửi một đề xuất ca trực mới kèm chi tiết mức giá và ghi chú sức khỏe.",
            type: "PROPOSAL_CREATED",
            referenceId: "c0000000-0000-0000-0000-000000000002",
            isRead: false,
            createdAt: new Date(now.getTime() - 35 * 60 * 1000).toISOString(),
        },
        {
            id: "demo-cg-003",
            title: "Ví điều dưỡng được cộng tiền",
            message: "Bạn đã nhận được 405.000đ thu nhập từ ca chăm sóc vừa hoàn tất. Số dư: 1.850.000đ.",
            type: "WALLET_CREDITED",
            referenceId: "w0000000-0000-0000-0000-000000000003",
            isRead: true,
            createdAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
        },
        {
            id: "demo-cg-004",
            title: "Hồ sơ điều dưỡng đã được phê duyệt!",
            message: "Chúc mừng bạn! Hồ sơ chứng chỉ hành nghề y tế đã được Ban Quản trị CareLink kích hoạt.",
            type: "NurseVerificationApproved",
            referenceId: "n0000000-0000-0000-0000-000000000004",
            isRead: true,
            createdAt: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
        },
    ],

    family: [
        {
            id: "demo-fam-001",
            title: "Lịch hẹn đã được xác nhận",
            message: "Điều dưỡng Nguyễn Thùy Linh đã nhận lịch hẹn chăm sóc người cao tuổi lúc 08:30 ngày mai.",
            type: "BOOKING_ACCEPTED",
            referenceId: "b0000000-0000-0000-0000-000000000001",
            isRead: false,
            createdAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
        },
        {
            id: "demo-fam-002",
            title: "Thanh toán thành công qua PayOS",
            message: "Bạn đã hoàn tất thanh toán 450.000đ cho ca chăm sóc định kỳ. Mã giao dịch: PAY-8921.",
            type: "PAYMENT_SUCCEEDED",
            referenceId: "b0000000-0000-0000-0000-000000000002",
            isRead: false,
            createdAt: new Date(now.getTime() - 40 * 60 * 1000).toISOString(),
        },
        {
            id: "demo-fam-003",
            title: "Điều dưỡng đã check-in tại nhà",
            message: "Điều dưỡng đã có mặt và bắt đầu thực hiện theo dõi huyết áp và hỗ trợ sinh hoạt.",
            type: "BOOKING_STARTED",
            referenceId: "b0000000-0000-0000-0000-000000000003",
            isRead: true,
            createdAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
        },
        {
            id: "demo-fam-004",
            title: "Đề xuất ca chăm sóc được chấp thuận",
            message: "Điều dưỡng Thùy Linh đã chấp thuận đề xuất ca chăm sóc. Bạn có 30 phút để thanh toán.",
            type: "PROPOSAL_ACCEPTED",
            referenceId: "c0000000-0000-0000-0000-000000000004",
            isRead: true,
            createdAt: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
        },
    ],
};

/**
 * Lấy danh sách thông báo mẫu theo vai trò người dùng
 * @param {string} role - 'admin' | 'caregiver' | 'family' | 'customer'
 */
export function getMockNotificationsByRole(role = "family") {
    const normalized = (role || "").toLowerCase();
    if (normalized === "admin") return roleMockNotifications.admin;
    if (normalized === "caregiver" || normalized === "nurse") return roleMockNotifications.caregiver;
    return roleMockNotifications.family;
}

/**
 * Lấy số lượng thông báo chưa đọc mẫu theo vai trò
 */
export function getMockUnreadCountByRole(role = "family") {
    const list = getMockNotificationsByRole(role);
    return list.filter((n) => !n.isRead).length;
}

// Backward-compatible export
export const mockNotifications = roleMockNotifications.family;
export const mockUnreadCount = roleMockNotifications.family.filter((n) => !n.isRead).length;
