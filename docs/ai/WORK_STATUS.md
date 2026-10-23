# 📋 BẢNG THEO DÕI TIẾN ĐỘ & PHÂN CÔNG CÔNG VIỆC (CareLink_FE)

> **Cập nhật lần cuối:** 24/10/2026 (Sau đợt Audit toàn diện)  
> **Quy tắc trạng thái theo Khung kiểm chứng thống nhất:**
> - `Planned`: Đã lên kế hoạch, chưa bắt đầu code.
> - `In-Progress`: Đang trong quá trình phát triển.
> - `Build-Passed`: Đã chạy `npm run build` thành công, 0 lỗi cú pháp/import.
> - `Runtime-Verified`: Đã test gọi API thật với Backend Local hoặc Render có log HTTP 200/201.
> - `E2E-Verified`: Đã test trọn vẹn luồng người dùng đa vai trò (Customer -> Nurse -> Admin).
> - `Blocked`: Bị vướng phụ thuộc Backend hoặc thiết kế chưa rõ.

---

## 📌 DANH SÁCH TÍNH NĂNG & TIẾN ĐỘ THỰC TẾ

| Phân hệ / Tính năng | Người phụ trách | Trạng thái nghiệm thu | Files / Components liên quan | Ghi chú & Bằng chứng kiểm thử |
| :--- | :---: | :---: | :--- | :--- |
| **Cơ chế Smart Failover Backend** | Vy | 🥇 `Runtime-Verified` | `src/api/axiosClient.js` | Tự động chuyển `localhost:7183` -> Render khi lỗi kết nối vật lý; hỗ trợ `?api=local`/`?api=render`. Build 1.56s. |
| **Đồng bộ Phí sàn 60.000 VNĐ** | Vy | 🥈 `Build-Passed` | `CaregiverWallet.jsx`, `AdminFinance.jsx` | Đã cập nhật hiển thị 60.000 VNĐ/ca đồng bộ với chính sách hiện hành của Backend (quản lý qua `PayOsOptions`). |
| **Xác thực OTP & Quên mật khẩu** | Vy | 🥇 `Runtime-Verified` | `ForgotPassword.jsx`, `ResetPassword.jsx`, `authApi.js` | Nối xong API OTP 6 số gửi về email qua SMTP, reset password thành công. |
| **Xác thực Hồ sơ Điều dưỡng** | Vy / Quốc | 🥈 `Build-Passed` | `CaregiverVerification.jsx`, `AdminNurseVerification.jsx` | Đã nối API nộp hồ sơ và modal duyệt/từ chối kèm lý do. Chờ test dữ liệu thật trên Supabase. |
| **Đặt lịch & Modal Hủy ca** | Vy | 🥇 `Runtime-Verified` | `BookingPage.jsx`, `CancelBookingModal.jsx`, `familyApi.js` | Đã thay browser dialog bằng Modal chuyên dụng có lý do hủy ca. Đã test gọi API tạo booking thật. |
| **Hội thoại & Đề xuất ca (Chat)** | Vy | 🥇 `Runtime-Verified` | `MessagesPage.jsx`, `CaregiverMessages.jsx`, `conversationApi.js` | Nối 9 endpoint chat, gửi tin nhắn và đề xuất ca làm việc trực tiếp trong chat. |
| **Thông báo & Chuông Unread** | Vy | 🥇 `Runtime-Verified` | `Header.jsx`, `NotificationsDropdown.jsx`, `notificationApi.js` | Hiển thị badge số lượng chưa đọc, tự động làm mới và đánh dấu đã đọc. |
| **Thanh toán PayOS & Kết quả** | Vy / Khôi | 💎 `E2E-Verified` | `CheckoutPage.jsx`, `PaymentSuccess.jsx`, `familyApi.js` | Nhận link PayOS có `bookingId`, callback chuyển hướng đúng trạng thái thanh toán. |
| **Combo Đa Dịch Vụ (Multi-Services)** | Vy | 🥈 `Build-Passed` | `CreateProposalModal.jsx`, `Chat.jsx`, `CaregiverMessages.jsx`, `CaregiverBookingDetailPanel.jsx` | Cho phép tick chọn nhiều dịch vụ, tự cộng thời lượng & phí sàn 60k; BE tính `ScheduledEnd`. Build 0 error. |
| **Bảng giá cá nhân & 4 Điều kiện sẵn sàng** | Vy | 🥈 `Build-Passed` | `CaregiverPricing.jsx`, `CaregiverDashboard.jsx`, `caregiverApi.js` | Màn hình cấu hình giá từng dịch vụ (`/caregiver/pricing`) và widget kiểm tra 4 điều kiện nhận ca. |
| **Bệnh án người bệnh trong Chat/Proposal** | Vy | 🥈 `Build-Passed` | `CreateProposalModal.jsx`, `CaregiverBookingDetailPanel.jsx`, `familyApi.js` | Bắt buộc chọn CareRecipient; modal xem chi tiết tiền sử bệnh án, dị ứng thuốc cho điều dưỡng trước khi nhận ca. |
| **Nghiệm thu ca trực 2 chiều** | Vy | 🥈 `Build-Passed` | `Appointments.jsx`, `SubmitHealthRecordModal.jsx`, `familyApi.js`, `caregiverApi.js` | Điều dưỡng nộp báo cáo y tế ký hoàn thành; Khách hàng xem báo cáo, đánh giá sao và ký nghiệm thu giải ngân ví. |
| **Check-in GPS & Soft Check-in** | Vy | 🥈 `Build-Passed` | `CaregiverBookingRequests.jsx`, `caregiverApi.js` | Gửi `currentLocationText` cùng tọa độ GPS thiết bị khi điều dưỡng bấm bắt đầu ca trực. |
| **Admin Thống kê Điều dưỡng** | Vy | 🥈 `Build-Passed` | `AdminNurseStatistics.jsx`, `AdminLayout.jsx`, `adminApi.js` | Bảng Data Table thống kê ca trực, tỷ lệ hoàn thành, doanh thu, số dư ví và Drawer sao kê chi tiết (`/admin/nurse-statistics`). |
| **Quyết toán Ví & Chuẩn hóa Payout** | Vy | 🥈 `Build-Passed` | `AdminFinance.jsx`, `adminApi.js` | Sửa đảo ngược enum PayoutRequestStatus (`1=Pending, 2=Approved, 3=Rejected`), thêm modal nhập mã tham chiếu ngân hàng và ghi chú. |

---

## 👥 PHÂN CHIA PHẠM VI TRONG NHÓM (2–4 THÀNH VIÊN)

1. **Vy (Lead Frontend & Tích hợp luồng):**
   - Phụ trách kiến trúc API Client, quản lý State người dùng, cơ chế Failover.
   - Rà soát các luồng xuyên suốt giữa Family và Caregiver.
2. **Khôi (Backend Payment & Wallet):**
   - Phụ trách hợp đồng API thanh toán PayOS, ví điều dưỡng, quyết toán thu nhập.
3. **Quốc (Backend Nurse Verification & Admin):**
   - Phụ trách logic xét duyệt chứng chỉ y tế, upload file CCCD/bằng cấp, trạng thái duyệt.
4. **Các thành viên khác:**
   - Khi nhận task mới, chủ động điền tên và đổi trạng thái sang `In-Progress`.
   - Tuyệt đối không sửa đè lên các component đang do thành viên khác phụ trách mà chưa trao đổi.
