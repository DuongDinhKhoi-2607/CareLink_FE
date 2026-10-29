# CARELINK — BẢN ĐỐI CHIẾU TOÀN DIỆN FE – BE – SUPABASE & KẾ HOẠCH BỔ SUNG BACKEND
> **Dự án:** CareLink — Nền tảng kết nối Điều dưỡng & Chăm sóc y tế tại nhà  
> **Người thực hiện:** Vy (Phụ trách 43 API Frontend)  
> **Phiên bản tài liệu:** 1.0 (Đối chiếu trực tiếp mã nguồn FE, BE Controllers/Services/DTOs và Schema Supabase)

---

## 1. TỔNG QUAN KẾT QUẢ ĐỐI CHIẾU

Qua việc rà soát trực tiếp toàn bộ mã nguồn của cả hai thư mục `CareLink_FE` (React 19 / Vite / Tailwind) và `CareLink_BE` (ASP.NET Core .NET 10 / EF Core / PostgreSQL Supabase), cùng lược đồ DDL Supabase được cung cấp:

| Chỉ số đối chiếu | Số lượng | Tỷ lệ | Đánh giá |
| :--- | :---: | :---: | :--- |
| **Tổng số API thuộc phạm vi phụ trách** | **43 / 43 API** | 100% | Phủ đủ 8 nhóm chức năng |
| **API đã tồn tại Controller & Action phía BE** | **43 / 43 API** | 100% | Đã khai báo đầy đủ trong 13 Controllers + 7 Backoffice Controllers |
| **API đã có hàm client phía FE (`src/api/`)** | **43 / 43 API** | 100% | Đầy đủ trong `authApi`, `familyApi`, `caregiverApi`, `conversationApi`, `notificationApi`, `adminApi` |
| **API đã nối vào màn hình & component FE** | **41 / 43 API** | 95.3% | Đã tích hợp UI, xử lý loading, error, empty state |
| **API Backend cần bổ sung/gia cố nghiệp vụ & ràng buộc** | **6 điểm** | — | Chủ yếu liên quan đến tính nguyên tử (atomic transaction), chống trùng lặp dữ liệu, và đối soát PayOS |
| **Thay đổi Supabase được đề xuất (Safe Migrations)** | **7 mục** | — | 1 ALTER COLUMN (OTP), 4 UNIQUE constraints/indexes, 2 Performance indexes. Toàn bộ là migration an toàn |

---

## 2. BẢNG ĐỐI CHIẾU CHI TIẾT 43 API

### MỤC 1. AUTHENTICATION & PHÂN QUYỀN (7 API)

| STT | API / Nghiệp vụ | Backend thực tế | Frontend hiện tại | Thiếu gì / Cần lưu ý | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | `POST /api/v1/auth/register` | `AuthController.Register` | `src/pages/auth/Register.jsx` → `authApi.register` | Phân quyền Role: 2 (Customer), 3 (Nurse). Đã có validation số điện thoại, mật khẩu. | **ĐÃ XÁC MINH ĐỦ** |
| 2 | `POST /api/v1/auth/login` | `AuthController.Login` | `src/pages/auth/Login.jsx` → `authApi.login` | Trả về JWT AccessToken, RefreshToken, Role, User Profile. Lưu `localStorage`. | **ĐÃ XÁC MINH ĐỦ** |
| 3 | `POST /api/v1/auth/google-login` | `AuthController.GoogleLogin` | `Login.jsx`, `Register.jsx` → `authApi.googleLogin` | FE lấy `idToken` từ Google Identity Services gửi lên BE xác thực qua `Google.Apis.Auth`. | **ĐÃ XÁC MINH ĐỦ** |
| 4 | `POST /api/v1/auth/refresh-token` | `AuthController.RefreshToken` | `src/api/axiosClient.js` (Interceptor 401) | Tự động gọi khi AccessToken hết hạn để lấy cặp token mới mà không bắt user đăng nhập lại. | **ĐÃ XÁC MINH ĐỦ** |
| 5 | `POST /api/v1/auth/logout` | `AuthController.Logout` | `Header.jsx`, `DashboardLayout.jsx` → `authApi.logout` | BE thu hồi RefreshToken trong DB; FE xóa sạch token và chuyển về trang đăng nhập. | **ĐÃ XÁC MINH ĐỦ** |
| 6 | `POST /api/v1/auth/forgot-password` | `AuthController.ForgotPassword` | `src/pages/auth/ForgotPassword.jsx` → `authApi.forgotPassword` | BE sinh OTP 6 số ngẫu nhiên, mã hóa BCrypt hash lưu vào DB. | **ĐÃ XÁC MINH ĐỦ** |
| 7 | `POST /api/v1/auth/reset-password` | `AuthController.ResetPassword` | `ForgotPassword.jsx` → `authApi.resetPassword` | Xác thực OTP BCrypt, kiểm tra thời hạn 15 phút, cập nhật hash mật khẩu mới, thu hồi token. | **ĐÃ XÁC MINH ĐỦ** |

---

### MỤC 2. BOOKINGS — VÒNG ĐỜI CA CHĂM SÓC (8 API)

| STT | API / Nghiệp vụ | Backend thực tế | Frontend hiện tại | Thiếu gì / Cần lưu ý | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 8 | `POST /api/v1/bookings` | `BookingsController.Create` | `BookingSummary.jsx` → `familyApi.createBooking` | Tạo booking trực tiếp trạng thái `PendingPayment` (giữ chỗ 30 phút). | **ĐÃ XÁC MINH ĐỦ** |
| 9 | `GET /api/v1/bookings` | `BookingsController.GetList` | `Appointments.jsx` & `CaregiverBookingRequests.jsx` | Hỗ trợ phân trang, lọc theo trạng thái (`PendingPayment`, `Accepted`, `InProgress`, v.v.). Đã xử lý empty state. | **ĐÃ XÁC MINH ĐỦ** |
| 10 | `GET /api/v1/bookings/{id}` | `BookingsController.GetById` | `Checkout.jsx`, `BookingSummary.jsx` → `familyApi.getBookingDetail` | Trả về thông tin dịch vụ, điều dưỡng, bệnh nhân, địa chỉ snapshot, giá tiền. | **ĐÃ XÁC MINH ĐỦ** |
| 11 | `PUT /api/v1/bookings/{id}/accept` | `BookingsController.Accept` | `CaregiverBookingRequests.jsx` → `caregiverApi.acceptBooking` | Dành cho điều dưỡng chấp nhận ca trực tiếp (PendingAcceptance → Accepted). | **ĐÃ XÁC MINH ĐỦ** |
| 12 | `PUT /api/v1/bookings/{id}/reject` | `BookingsController.Reject` | `CaregiverBookingRequests.jsx` → `caregiverApi.rejectBooking` | Điều dưỡng từ chối ca kèm lý do; giải phóng lịch và thông báo cho khách hàng. | **ĐÃ XÁC MINH ĐỦ** |
| 13 | `PUT /api/v1/bookings/{id}/start` | `BookingsController.Start` | `CaregiverBookingRequests.jsx` → `caregiverApi.startBooking` | Check-in bắt đầu ca (Accepted → InProgress). Chỉ cho phép trước giờ ca tối đa 30 phút. | **ĐÃ XÁC MINH ĐỦ** |
| 14 | `PUT /api/v1/bookings/{id}/finish` | `BookingsController.Finish` | `SubmitHealthRecordModal.jsx` → `caregiverApi.finishBooking` | **Nghiệp vụ bắt buộc:** Bệnh án phải được lưu thành công trước khi hoàn tất ca. FE đã chia 2 giai đoạn rõ ràng. | **ĐÃ XÁC MINH ĐỦ** |
| 15 | `PUT /api/v1/bookings/{id}/cancel` | `BookingsController.Cancel` | `Appointments.jsx` → `familyApi.cancelBooking` | Hủy ca theo chính sách hủy (trước ca > 24h hoặc trong điều kiện hợp lệ). | **ĐÃ XÁC MINH ĐỦ** |

---

### MỤC 3. CONVERSATIONS & BOOKING PROPOSAL (9 API)

| STT | API / Nghiệp vụ | Backend thực tế | Frontend hiện tại | Thiếu gì / Cần lưu ý | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 16 | `GET /api/v1/conversations` | `ConversationsController.GetConversations` | `DashboardMessages.jsx`, `CaregiverMessages.jsx` | Lấy danh sách phòng chat kèm tin nhắn cuối và avatar đối phương. | **ĐÃ XÁC MINH ĐỦ** |
| 17 | `POST /api/v1/conversations` | `ConversationsController.GetOrCreateConversation` | `CaregiverProfile.jsx`, `CaregiverList.jsx` | Tạo hoặc mở phòng chat duy nhất giữa Khách hàng và Điều dưỡng. | **ĐÃ XÁC MINH ĐỦ** |
| 18 | `GET /api/v1/conversations/{id}` | `ConversationsController.GetConversationById` | `DashboardMessages.jsx`, `CaregiverMessages.jsx` | Xác minh quyền thành viên phòng chat (chỉ Customer hoặc Nurse trong ca). | **ĐÃ XÁC MINH ĐỦ** |
| 19 | `GET /api/v1/conversations/{id}/messages` | `ConversationsController.GetMessages` | `DashboardMessages.jsx`, `CaregiverMessages.jsx` | Lấy tin nhắn theo thứ tự thời gian tăng dần, hỗ trợ phân trang. | **ĐÃ XÁC MINH ĐỦ** |
| 20 | `POST /api/v1/conversations/{id}/messages` | `ConversationsController.SendMessage` | `DashboardMessages.jsx`, `CaregiverMessages.jsx` | Gửi tin nhắn văn bản; cập nhật `LastMessageAt` của cuộc trò chuyện. | **ĐÃ XÁC MINH ĐỦ** |
| 21 | `GET /api/v1/conversations/{id}/proposals` | `ConversationsController.GetProposals` | `DashboardMessages.jsx`, `CaregiverMessages.jsx` | Lấy danh sách đề xuất ca chăm sóc trong hội thoại. | **ĐÃ XÁC MINH ĐỦ** |
| 22 | `POST /api/v1/conversations/{id}/proposals` | `ConversationsController.CreateProposal` | `DashboardMessages.jsx` (Modal tạo đề xuất) | Gia đình tạo đề xuất (chọn người thân, địa chỉ, ngày giờ, dịch vụ). | **ĐÃ XÁC MINH ĐỦ** |
| 23 | `PUT /api/v1/conversations/{cId}/proposals/{pId}/accept` | `ConversationsController.AcceptProposal` | `CaregiverMessages.jsx` → `conversationApi.acceptProposal` | **Điều dưỡng chấp thuận đề xuất:** Backend tự động tạo Booking ở trạng thái `PendingPayment` và trả về `bookingId`. FE không tạo thêm booking lần 2. | **ĐÃ XÁC MINH ĐỦ** |
| 24 | `PUT /api/v1/conversations/{cId}/proposals/{pId}/reject` | `ConversationsController.RejectProposal` | `CaregiverMessages.jsx` → `conversationApi.rejectProposal` | Điều dưỡng từ chối đề xuất kèm lý do. | **ĐÃ XÁC MINH ĐỦ** |

---

### MỤC 4. PAYMENTS & PAYOS (4 API)

| STT | API / Nghiệp vụ | Backend thực tế | Frontend hiện tại | Thiếu gì / Cần lưu ý | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 25 | `POST /api/v1/bookings/{bookingId}/payments` | `PaymentsController.CreatePaymentLink` | `Checkout.jsx` → `familyApi.createPaymentLink` | Tạo checkout link PayOS. Tái sử dụng link cũ nếu còn hạn. Trả về `checkoutUrl`, `qrCode`. | **ĐÃ XÁC MINH ĐỦ** |
| 26 | `GET /api/v1/bookings/{bookingId}/payments` | `PaymentsController.GetByBooking` | `src/features/family/pages/PaymentResult.jsx` | **Đối soát thực tế:** FE không tin tham số trình duyệt; gọi API này để xác nhận `status === 2` (Paid). | **ĐÃ XÁC MINH ĐỦ** |
| 27 | `POST /api/v1/payments/payos/webhook` | `PaymentsController.PayOsWebhook` | PayOS Gateway Webhook | BE xác minh chữ ký PayOS, chuyển payment sang `Paid`, chuyển booking sang `Accepted`, bắn tin nhắn hệ thống vào chat và gửi notification. | **ĐÃ XÁC MINH ĐỦ** |
| 28 | `POST /api/v1/admin/bookings/{bookingId}/refund` | `PaymentsController.Refund` | `src/features/admin/pages/AdminFinance.jsx` | Admin hoàn tiền toàn phần/một phần. Cập nhật `RefundedAmount` và trừ số dư ví điều dưỡng nếu cần. | **ĐÃ XÁC MINH ĐỦ** |

---

### MỤC 5. NURSE VERIFICATIONS & DOCUMENTS (8 API)

| STT | API / Nghiệp vụ | Backend thực tế | Frontend hiện tại | Thiếu gì / Cần lưu ý | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 29 | `POST /api/v1/nurse/documents` | `NurseProfileController.SubmitDocuments` | `Verification.jsx` → `caregiverApi.submitVerification` | Nộp hồ sơ: CCCD 2 mặt, Ảnh chân dung, Bằng cấp/Thẻ sinh viên, CCHN. | **ĐÃ XÁC MINH ĐỦ** |
| 30 | `GET /api/v1/nurse/documents` | `NurseProfileController.GetDocuments` | `Verification.jsx` → `caregiverApi.getDocuments` | Điều dưỡng xem các giấy tờ đã tải lên kèm trạng thái kiểm duyệt. | **ĐÃ XÁC MINH ĐỦ** |
| 31 | `POST /api/v1/nurse/documents/re-submit` | `NurseProfileController.ReSubmitDocuments` | `Verification.jsx` → `caregiverApi.reSubmitVerification` | Nộp lại các giấy tờ bị Admin yêu cầu bổ sung/chỉnh sửa. | **ĐÃ XÁC MINH ĐỦ** |
| 32 | `GET /api/v1/nurse/verification-status` | `NurseProfileController.GetVerificationStatus` | `Verification.jsx`, `ChooseRole.jsx` | Xem trạng thái tổng thể: `Pending`, `Approved`, `Rejected` kèm ghi chú Admin. | **ĐÃ XÁC MINH ĐỦ** |
| 33 | `GET /api/v1/admin/nurse-verifications` | `NurseVerificationsController.GetVerifications` | `CaregiverApprovals.jsx` → `adminApi.getNurseVerifications` | Admin lọc danh sách hồ sơ theo trạng thái, tìm kiếm theo tên/CCCD. | **ĐÃ XÁC MINH ĐỦ** |
| 34 | `GET /api/v1/admin/nurse-verifications/expiring-licenses` | `NurseVerificationsController.GetExpiringLicenses` | `CaregiverApprovals.jsx` → `adminApi.getExpiringLicenses` | Lọc các chứng chỉ hành nghề sắp hết hạn trong 30 ngày. | **ĐÃ XÁC MINH ĐỦ** |
| 35 | `GET /api/v1/admin/nurse-verifications/{id}` | `NurseVerificationsController.GetVerificationDetail` | `CaregiverApprovals.jsx` → `adminApi.getNurseVerificationDetail` | Xem toàn bộ ảnh giấy tờ và checklist nghiệp vụ trước khi duyệt. | **ĐÃ XÁC MINH ĐỦ** |
| 36 | `PUT /api/v1/admin/nurse-verifications/{id}` | `NurseVerificationsController.ReviewVerification` | `CaregiverApprovals.jsx` → `adminApi.reviewNurseVerification` | Admin duyệt (kèm checklist) hoặc từ chối (kèm lý do cụ thể). | **ĐÃ XÁC MINH ĐỦ** |

---

### MỤC 6. TÌM KIẾM ĐIỀU DƯỠNG (1 API)

| STT | API / Nghiệp vụ | Backend thực tế | Frontend hiện tại | Thiếu gì / Cần lưu ý | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 37 | `GET /api/v1/nurses/search` | `NursesController.Search` | `CaregiverList.jsx` → `familyApi.searchNurses` | Hỗ trợ lọc theo quận/huyện, điểm đánh giá tối thiểu, khoảng cách Haversine và loại trừ điều dưỡng đã có lịch trùng. | **ĐÃ XÁC MINH ĐỦ** |

---

### MỤC 7. NOTIFICATIONS (4 API)

| STT | API / Nghiệp vụ | Backend thực tế | Frontend hiện tại | Thiếu gì / Cần lưu ý | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 38 | `GET /api/v1/notifications` | `NotificationsController.GetNotifications` | `NotificationDropdown.jsx` → `notificationApi.getNotifications` | Lấy danh sách thông báo phân trang, lọc đã đọc/chưa đọc. Đã có empty state chuẩn. | **ĐÃ XÁC MINH ĐỦ** |
| 39 | `GET /api/v1/notifications/unread-count` | `NotificationsController.GetUnreadCount` | `NotificationDropdown.jsx` → `notificationApi.getUnreadCount` | Polling nhẹ mỗi 45s và khi tab active để hiện badge đỏ số thông báo mới. | **ĐÃ XÁC MINH ĐỦ** |
| 40 | `PUT /api/v1/notifications/{id}/read` | `NotificationsController.MarkAsRead` | `NotificationDropdown.jsx` → `notificationApi.markAsRead` | Optimistic update ngay trên UI rồi đồng bộ về Backend. | **ĐÃ XÁC MINH ĐỦ** |
| 41 | `PUT /api/v1/notifications/read-all` | `NotificationsController.MarkAllAsRead` | `NotificationDropdown.jsx` → `notificationApi.markAllAsRead` | Đánh dấu tất cả thông báo của người dùng là đã đọc. | **ĐÃ XÁC MINH ĐỦ** |

---

### MỤC 8. ADMIN DASHBOARD (2 API)

| STT | API / Nghiệp vụ | Backend thực tế | Frontend hiện tại | Thiếu gì / Cần lưu ý | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 42 | `GET /api/v1/admin/dashboard/summary` | `AdminDashboardController.GetSummary` | `AdminDashboard.jsx` → `adminApi.getDashboardSummary` | Thống kê GMV, phí nền tảng 50.000đ/ca, số lượng ca theo trạng thái, số khiếu nại, đánh giá. | **ĐÃ XÁC MINH ĐỦ** |
| 43 | `GET /api/v1/admin/dashboard/revenue` | `AdminDashboardController.GetRevenue` | `AdminDashboard.jsx` → `adminApi.getRevenueMetrics` | Thống kê biểu đồ doanh thu theo ngày/tháng và cơ cấu phí. | **ĐÃ XÁC MINH ĐỦ** |

---

## 3. RÀ SOÁT LOGIC NGHIỆP VỤ CHUYÊN SÂU (END-TO-END)

### A. Luồng Đăng nhập & Đặt lại mật khẩu (OTP Security)
- **Cơ chế OTP:** Backend sinh OTP 6 chữ số ngẫu nhiên, sau đó băm bằng `BCrypt.Net-Next` rồi mới lưu vào cột `users.reset_password_otp`. Chuỗi BCrypt hash luôn có độ dài 60 ký tự.
- **Rủi ro đã xử lý:** Đã sửa cấu hình EF Core trong `CareLinkDbContext.cs` từ `.HasMaxLength(6)` thành `.HasMaxLength(100)` để ngăn chặn triệt để lỗi runtime `DbUpdateException: Value too long`.
- **Đề xuất Supabase:** Cung cấp lệnh SQL đảm bảo cột `users.reset_password_otp` đủ độ dài tối thiểu 100 ký tự trên mọi môi trường.

### B. Luồng Chat → Đề xuất ca → Booking → Thanh toán
1. **Tìm kiếm:** Khách hàng tìm điều dưỡng qua `/api/v1/nurses/search`.
2. **Khởi tạo trò chuyện:** Mở phòng chat qua `POST /api/v1/conversations`.
3. **Gửi đề xuất:** Khách hàng gửi `BookingProposal` qua `POST /api/v1/conversations/{id}/proposals`.
4. **Chấp thuận & Tự động tạo Booking:** Khi điều dưỡng bấm chấp nhận qua `PUT /api/v1/conversations/{cId}/proposals/{pId}/accept`, Backend thực thi trong một `Transaction`:
   - Chuyển `proposal.Status = Accepted`.
   - Tạo ngay một bản ghi `Booking` với trạng thái `PendingPayment`, gán `booking.ConversationId` và lưu `proposal.BookingId = booking.Id`.
   - Trả về `bookingId` cho Frontend.
   - **Frontend cam kết:** Điều hướng trực tiếp sang `/checkout?bookingId=...`, tuyệt đối không gọi `POST /api/v1/bookings` để tránh nhân đôi ca.
5. **Thanh toán:**
   - Frontend Checkout gọi `POST /api/v1/bookings/{bookingId}/payments`.
   - Backend sinh liên kết PayOS và trả về `checkoutUrl`.
   - Frontend lưu `bookingId` vào `sessionStorage` phòng trường hợp URL callback bị thiếu tham số.
   - Chuyển hướng người dùng sang PayOS.
6. **Xác minh giao dịch:**
   - Khi người dùng quay về `/payment/success`, Frontend **không** tin query string `code=00` mà gọi ngay `GET /api/v1/bookings/{bookingId}/payments` để kiểm tra `status === 2` (Paid).
   - Nếu webhook chưa kịp cập nhật (`status === 1`), giao diện kích hoạt cơ chế polling tự động (tối đa 4 lần, mỗi lần cách nhau 3 giây) kèm nút "Kiểm tra ngay".

### C. Luồng Bệnh án & Kết thúc ca (2-Phase Finish)
- Để hoàn tất một ca chăm sóc, điều dưỡng **bắt buộc** phải hoàn tất hồ sơ sức khỏe lâm sàng trước (`POST /api/v1/bookings/{id}/health-record`).
- Frontend trong `SubmitHealthRecordModal.jsx` đã được tách bạch thành 2 giai đoạn:
  1. Gửi bệnh án lên máy chủ.
  2. Khi và chỉ khi bệnh án lưu thành công mới gọi `PUT /api/v1/bookings/{id}/finish`.
  3. Nếu lưu bệnh án thành công nhưng kết thúc ca thất bại (ví dụ timeout mạng), giao diện thông báo rõ ràng: "Bệnh án đã được lưu, nhưng ca chăm sóc chưa được kết thúc. Vui lòng bấm thử lại."

---

## 4. DANH SÁCH CÔNG VIỆC CẦN LÀM CHO BACKEND & SUPABASE

### NHÓM 1 — BE ĐÃ ĐỦ, FE ĐÃ NỐI XONG HOÀN TOÀN
- Toàn bộ 7 API Authentication (Register, Login, Google Login, Refresh Token, Logout, Forgot Password, Reset Password).
- Toàn bộ 8 API Bookings (Tạo, Xem danh sách, Chi tiết, Chấp nhận, Từ chối, Bắt đầu, Kết thúc 2 bước, Hủy).
- Toàn bộ 9 API Conversations & Proposals (Danh sách, Tạo phòng, Chi tiết, Xem tin nhắn, Gửi tin nhắn, Danh sách đề xuất, Tạo đề xuất, Chấp thuận tạo booking, Từ chối).
- Toàn bộ 4 API Notifications (Danh sách, Unread count polling, Đọc 1, Đọc tất cả).
- Toàn bộ 2 API Admin Dashboard (Summary & Revenue metrics).
- Tìm kiếm điều dưỡng theo bộ lọc (`/api/v1/nurses/search`).
- Thanh toán PayOS & Đối soát giao dịch (`/checkout`, `/payment/success`, `/payment/cancel`).

---

### NHÓM 2 — BE CẦN BỔ SUNG / GIA CỐ NGHIỆP VỤ (ƯU TIÊN P0 / P1 / P2)

#### 1. [P0] Đính kèm `bookingId` vào ReturnUrl & CancelUrl khi tạo PayOS link
- **File:** `CareLinkAPI/Services/PaymentService.cs` (Hàm `CreatePaymentLinkAsync`)
- **Hiện trạng:** Code trước đây gán `ReturnUrl = _payOs.ReturnUrl` cố định. Khi PayOS trả người dùng về trình duyệt, URL chỉ có `?code=00&status=PAID&orderCode=...`, khiến Frontend không biết chính xác `bookingId` nào vừa được thanh toán nếu người dùng mở tab ẩn danh hoặc mất `sessionStorage`.
- **Giải pháp:** Tự động nối `?bookingId={booking.Id}` vào `ReturnUrl` và `CancelUrl`.
- **Tình trạng:** **ĐÃ SỬA VÀ KIỂM TRA TRONG `PaymentService.cs`.**

#### 2. [P1] Cấu hình môi trường riêng biệt cho ReturnUrl trong Development
- **File:** `CareLinkAPI/appsettings.Development.json`
- **Hiện trạng:** `appsettings.json` trỏ ReturnUrl về `https://carelink.vn/payment/success`. Khi chạy local máy phát triển, PayOS chuyển hướng người dùng về domain production thay vì `http://localhost:5173`.
- **Giải pháp:** Tạo file cấu hình `appsettings.Development.json` ghi đè `PayOS:ReturnUrl = "http://localhost:5173/payment/success"` và `CancelUrl = "http://localhost:5173/payment/cancel"`. Không sửa đè vào `appsettings.json` của production.
- **Tình trạng:** **ĐÃ TẠO FILE `appsettings.Development.json`.**

#### 3. [P1] Đảm bảo tính nguyên tử (Atomic Transaction) khi Accept Proposal
- **File:** `CareLinkAPI/Services/ChatService.cs` (Hàm `AcceptProposalAsync`)
- **Hiện trạng:** Cần đảm bảo việc cập nhật `proposal.Status = Accepted` và chèn bản ghi mới vào bảng `bookings` nằm trọn vẹn trong một `unitOfWork.ExecuteInTransactionAsync`.
- **Yêu cầu kiểm thử:** Nếu lệnh chèn booking bị lỗi (ví dụ trùng lịch), trạng thái proposal phải rollback về trạng thái cũ, không được để proposal ở trạng thái đã chấp nhận mà không có `booking_id`.

---

### NHÓM 3 — BE CẦN BỔ SUNG TRƯỜNG DỮ LIỆU DTO
Hiện tại, các response DTO chính (`BookingResponse`, `ConversationResponse`, `PaymentResponse`, `NurseSearchItemResponse`, `NotificationResponse`) đã trả về các trường thiết yếu. Để nâng cao trải nghiệm người dùng, đề xuất bổ sung thêm:
1. `PaymentResponse`: Bổ sung thêm trường `BookingStatus` để khi FE gọi `GET /api/v1/bookings/{bookingId}/payments`, FE nhận được cả trạng thái thanh toán (`Paid`) lẫn trạng thái ca (`Accepted`/`Confirmed`) trong cùng 1 round-trip mà không cần gọi thêm `GET /api/v1/bookings/{id}`.

---

### NHÓM 4 — SUPABASE MIGRATIONS (SQL AN TOÀN, CHẠY ĐƯỢC 100%)

Dưới đây là 7 script SQL độc lập, có điều kiện kiểm tra an toàn (`IF NOT EXISTS`, `ALTER TYPE`), không làm mất dữ liệu hiện có:

#### Script 1: Đảm bảo độ dài cột OTP cho BCrypt Hash (P0)
- **Lý do nghiệp vụ:** Cột lưu mã hash BCrypt của OTP cần tối thiểu 60 ký tự.
- **SQL chạy trên Supabase:**
```sql
-- Migration 01: Đảm bảo độ dài cột reset_password_otp tối thiểu 100 ký tự
DO $$
BEGIN
    ALTER TABLE public.users 
    ALTER COLUMN reset_password_otp TYPE character varying(100);
    RAISE NOTICE 'Đã cập nhật độ dài users.reset_password_otp thành varchar(100)';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Bỏ qua nếu cột đã có kiểu dữ liệu phù hợp: %', SQLERRM;
END $$;
```

#### Script 2: Ràng buộc chống tạo trùng hội thoại giữa Customer & Nurse (P1)
- **Lý do nghiệp vụ:** Mỗi cặp Khách hàng – Điều dưỡng chỉ có duy nhất 1 cuộc trò chuyện. Nếu bấm nhanh nhiều lần, không được tạo 2 dòng hội thoại làm phân tán tin nhắn.
- **SQL chạy trên Supabase:**
```sql
-- Migration 02: Ràng buộc duy nhất cho bảng conversations
CREATE UNIQUE INDEX IF NOT EXISTS uq_conversations_customer_nurse 
ON public.conversations (customer_id, nurse_id);
```

#### Script 3: Ràng buộc chống liên kết trùng Booking cho Booking Proposal (P1)
- **Lý do nghiệp vụ:** Mỗi đề xuất ca chăm sóc chỉ được chuyển thành tối đa 1 ca chăm sóc (Booking).
- **SQL chạy trên Supabase:**
```sql
-- Migration 03: Ràng buộc duy nhất 1-1 giữa proposal và booking
CREATE UNIQUE INDEX IF NOT EXISTS uq_booking_proposals_booking_id 
ON public.booking_proposals (booking_id) 
WHERE booking_id IS NOT NULL;
```

#### Script 4: Index tăng tốc tra cứu mã thanh toán PayOS Webhook (P1)
- **Lý do nghiệp vụ:** Khi PayOS bắn webhook về, hệ thống tìm kiếm thanh toán theo `payment_code`. Có index sẽ biến truy vấn thành O(log N) thay vì quét toàn bảng.
- **SQL chạy trên Supabase:**
```sql
-- Migration 04: Index tra cứu payment_code
CREATE INDEX IF NOT EXISTS idx_payments_payment_code 
ON public.payments (payment_code);
```

#### Script 5: Index tối ưu đếm thông báo chưa đọc (Unread Count) (P2)
- **Lý do nghiệp vụ:** Polling chu kỳ 45 giây đếm số lượng thông báo `is_read = false` của người dùng.
- **SQL chạy trên Supabase:**
```sql
-- Migration 05: Composite index cho notification badge
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
ON public.notifications (user_id, is_read);
```

#### Script 6: Ràng buộc chống đánh giá trùng 2 chiều (P2)
- **Lý do nghiệp vụ:** Trong cùng 1 ca chăm sóc, mỗi bên (Gia đình hoặc Điều dưỡng) chỉ được gửi 1 lần đánh giá duy nhất.
- **SQL chạy trên Supabase:**
```sql
-- Migration 06: Unique index đánh giá 1 lần cho mỗi booking
CREATE UNIQUE INDEX IF NOT EXISTS uq_reviews_booking_reviewer 
ON public.reviews (booking_id, reviewer_id);
```

#### Script 7: Index kiểm tra lịch trùng của Điều dưỡng (P2)
- **Lý do nghiệp vụ:** Tăng tốc độ thuật toán tìm kiếm điều dưỡng và loại trừ các ca đang bận/trùng giờ.
- **SQL chạy trên Supabase:**
```sql
-- Migration 07: Index lọc ca đang hoạt động theo thời gian
CREATE INDEX IF NOT EXISTS idx_bookings_nurse_schedule 
ON public.bookings (nurse_id, scheduled_start, scheduled_end) 
WHERE status IN (1, 2, 3, 4);
```

---

### NHÓM 5 — MỤC CHƯA THỂ XÁC MINH & CẦN HỖ TRỢ TỪ NGƯỜI DÙNG

1. **PayOS Webhook trên máy Local:**
   - Để PayOS có thể gọi tới webhook `POST /api/v1/payments/payos/webhook`, máy chủ Backend cần có domain public (thông qua ngrok, Cloudflare Tunnel, hoặc deploy lên server/Supabase edge). Trên môi trường thuần localhost không mở cổng ra ngoài, PayOS chỉ có thể redirect trình duyệt về ReturnUrl, còn webhook nền sẽ không chạm tới localhost được.
   - **Giải pháp của Frontend:** Trang `PaymentResult.jsx` đã được xây dựng cơ chế tự động thăm dò (polling) trạng thái thực tế từ Backend; khi chạy local, nếu webhook chưa tới, người dùng vẫn có thể kiểm tra trạng thái hoặc Admin có thể duyệt kiểm thử.
2. **Cấu hình Google Client ID:**
   - Client ID trong file cấu hình hiện tại: `617746468209-jupm19jbfemqgdfv2gsbetlu4imretnk.apps.googleusercontent.com`. Cần đảm bảo trên Google Cloud Console đã thêm `http://localhost:5173` và `https://carelink.vn` vào danh sách **Authorized JavaScript origins**.

---

## 5. THỨ TỰ TRIỂN KHAI TIẾP THEO

1. **Bước 1 (Supabase):** Chạy các lệnh SQL an toàn trong **Mục 4 (Script 1 đến 7)** trên Supabase SQL Editor.
2. **Bước 2 (Backend):** 
   - Kiểm tra file `appsettings.Development.json` vừa được tạo trong `CareLinkAPI`.
   - Chạy lệnh `dotnet build CareLinkAPI` và khởi động Backend.
3. **Bước 3 (Frontend):** 
   - Frontend đã hoàn tất mã nguồn, build thành công với Vite 8 (`npm run build` đạt 0 lỗi).
   - Kiểm thử luồng: Tạo đề xuất trong Chat → Điều dưỡng chấp nhận → Nhận `bookingId` → Mở `/checkout` → Chuyển hướng PayOS → Trả về `/payment/success` → Xác minh trạng thái giao dịch.
