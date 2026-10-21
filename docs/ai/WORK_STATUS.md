# 📋 BẢNG THEO DÕI TIẾN ĐỘ & PHÂN CÔNG CÔNG VIỆC (CareLink_FE)

> **Cập nhật lần cuối:** 21/10/2026  
> **Quy tắc trạng thái theo 4 cấp độ nghiệm thu:**
> - `Planned`: Đã lên kế hoạch, chưa bắt đầu code.
> - `In-Progress`: Đang trong quá trình phát triển.
> - `Build-Passed`: Đã chạy `npm run build` thành công, chưa test API thật.
> - `Runtime-Verified`: Đã test gọi API thật với Backend Local hoặc Render có log HTTP 200/201.
> - `E2E-Verified`: Đã test trọn vẹn luồng người dùng đa vai trò (Customer -> Nurse -> Admin).
> - `Blocked`: Bị vướng phụ thuộc Backend hoặc thiết kế chưa rõ.

---

## 📌 DANH SÁCH TÍNH NĂNG & TIẾN ĐỘ THỰC TẾ

| Phân hệ / Tính năng | Người phụ trách | Trạng thái nghiệm thu | Files / Components liên quan | Ghi chú & Bằng chứng kiểm thử |
| :--- | :---: | :---: | :--- | :--- |
| **Cơ chế Smart Failover Backend** | Vy | 🥇 `Runtime-Verified` | `src/api/axiosClient.js` | Tự động chuyển `localhost:7183` -> Render khi lỗi kết nối vật lý; hỗ trợ `?api=local`/`?api=render`. Build 1.11s. |
| **Đồng bộ Phí sàn 60.000 VNĐ** | Vy | 🥈 `Build-Passed` | `CaregiverWallet.jsx`, `AdminFinance.jsx` | Đã cập nhật hiển thị 60.000 VNĐ/ca. Cần đồng bộ cấu hình BE (`PayOsOptions.cs` đang để default 50k). |
| **Xác thực OTP & Quên mật khẩu** | Vy | 🥇 `Runtime-Verified` | `ForgotPassword.jsx`, `ResetPassword.jsx`, `authApi.js` | Nối xong API OTP 6 số gửi về email qua SMTP, reset password thành công. |
| **Xác thực Hồ sơ Điều dưỡng** | Vy / Quốc | 🥈 `Build-Passed` | `CaregiverVerification.jsx`, `AdminNurseVerification.jsx` | Đã nối API nộp hồ sơ và modal duyệt/từ chối kèm lý do. Chờ test dữ liệu thật trên Supabase. |
| **Đặt lịch & Modal Hủy ca** | Vy | 🥇 `Runtime-Verified` | `BookingPage.jsx`, `CancelBookingModal.jsx`, `familyApi.js` | Đã thay browser dialog bằng Modal chuyên dụng có lý do hủy ca. Đã test gọi API tạo booking thật. |
| **Hội thoại & Đề xuất ca (Chat)** | Vy | 🥇 `Runtime-Verified` | `MessagesPage.jsx`, `CaregiverMessages.jsx`, `conversationApi.js` | Nối 9 endpoint chat, gửi tin nhắn và đề xuất ca làm việc trực tiếp trong chat. |
| **Thông báo & Chuông Unread** | Vy | 🥇 `Runtime-Verified` | `Header.jsx`, `NotificationsDropdown.jsx`, `notificationApi.js` | Hiển thị badge số lượng chưa đọc, tự động làm mới và đánh dấu đã đọc. |
| **Thanh toán PayOS & Kết quả** | Vy / Khôi | 💎 `E2E-Verified` | `CheckoutPage.jsx`, `PaymentSuccess.jsx`, `familyApi.js` | Nhận link PayOS có `bookingId`, callback chuyển hướng đúng trạng thái thanh toán. |

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
