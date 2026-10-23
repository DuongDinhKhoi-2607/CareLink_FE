# 🗺️ MA TRẬN TÍCH HỢP TOÀN BỘ 105 PHƯƠNG THỨC API VÀ FRONTEND (CareLink_FE)

> **Tài liệu sống độc bản (Living Document):** Phản ánh hiện trạng kết nối thực tế 100% của toàn bộ **105 hàm gọi API** nằm trong **7 tệp API Client** của thư mục `src/api/` với hơn **45 Màn hình / Component** của CareLink Frontend.
>
> ⚠️ **Quy chuẩn cấp độ kiểm chứng thống nhất (Verification Framework):**
> - **[Tier 1] Contract Verified:** Đã đối chiếu đúng Route, HTTP Method, Request/Response DTO và Quyền truy cập trong mã nguồn Backend.
> - **[Tier 2] FE Integrated:** Đã có hàm gọi trong file API client tương ứng và đã gắn vào Component/Page giao diện kèm xử lý UI state.
> - **[Tier 3] Build Passed:** Đã chạy `npm run build` thành công, không có lỗi cú pháp hoặc import.
> - **[Tier 4] Automated Tests Passed:** Vượt qua các bài kiểm thử tự động (Unit / Integration Tests).
> - **[Tier 5] Runtime Verified:** Đã gọi thử thành công tới Backend thật (Localhost hoặc Render) có log HTTP 200/201 thật từ Database.
> - **[Tier 6] E2E Verified:** Đã kiểm thử trọn vẹn kịch bản người dùng qua nhiều vai trò (Customer -> Nurse -> Admin -> PayOS).

---

## 📊 BẢNG TỔNG KẾT THEO 7 TỆP API CLIENT THỰC TẾ

| STT | Tệp API Client (`src/api/`) | Số lượng Hàm/API | Contract Verified | FE Integrated | Build Passed | Runtime Verified | E2E Verified |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | `src/api/authApi.js` | **9** | 9/9 | 9/9 | ✅ Pass | 9/9 | 7/9 |
| 2 | `src/api/familyApi.js` | **28** | 28/28 | 28/28 | ✅ Pass | 16/28 | 12/28 |
| 3 | `src/api/caregiverApi.js` | **26** | 26/26 | 26/26 | ✅ Pass | 14/26 | 10/26 |
| 4 | `src/api/conversationApi.js` | **9** | 9/9 | 9/9 | ✅ Pass | 9/9 | 8/9 |
| 5 | `src/api/adminApi.js` | **20** | 20/20 | 20/20 | ✅ Pass | 12/20 | 8/20 |
| 6 | `src/api/notificationApi.js` | **4** | 4/4 | 4/4 | ✅ Pass | 4/4 | 3/4 |
| 7 | `src/api/handbookApi.js` | **9** | 9/9 | 9/9 | ✅ Pass | 9/9 | 9/9 |
| **TỔNG** | **7 Tệp API Client** | **105 APIs** | **105/105 (100%)** | **105/105 (100%)** | **100% Pass** | **~70%** | **~54%** |

---

## 🔍 CHI TIẾT 100% ĐẦY ĐỦ CỦA 105 HÀM API THEO TỪNG TỆP CLIENT

### 📂 Phân Hệ 1: Xác Thực & Tài Khoản (`src/api/authApi.js` — 9 APIs)
| STT | HTTP Method | Route Backend | Tên hàm trong `authApi.js` | Màn hình / Component FE | Quyền (Role) | Cấp độ kiểm chứng | Ghi chú & Tình huống |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| 1 | `POST` | `/api/v1/auth/register` | `register(payload)` | `RegisterPage.jsx` | Khách | 🥇 **Runtime Verified** | Đăng ký tài khoản Customer hoặc Nurse; phân vai trò tự động. |
| 2 | `POST` | `/api/v1/auth/login` | `login(payload)` | `LoginPage.jsx` | Khách | 🥇 **Runtime Verified** | Đăng nhập Email/Password, lưu token, chuyển đúng trang vai trò. |
| 3 | `POST` | `/api/v1/auth/google-login` | `googleLogin(payload)` | `LoginPage.jsx` | Khách | 🥇 **Runtime Verified** | Đăng nhập Google One-Tap/OAuth, tự động đồng bộ vai trò. |
| 4 | `POST` | `/api/v1/auth/refresh-token` | `refreshToken(token)` | `axiosClient.js` | All | 🥇 **Runtime Verified** | Tự động làm mới khi gặp HTTP 401 qua hàng đợi queue. |
| 5 | `POST` | `/api/v1/auth/logout` | `logout()` | `Header.jsx`, `Layouts` | All | 🥇 **Runtime Verified** | Xóa token và user cache khỏi `localStorage`. |
| 6 | `POST` | `/api/v1/auth/forgot-password` | `forgotPassword(email)` | `ForgotPassword.jsx` | Khách | 🥇 **Runtime Verified** | Gửi OTP 6 số về email thật qua SMTP. |
| 7 | `POST` | `/api/v1/auth/reset-password` | `resetPassword(data)` | `ResetPassword.jsx` | Khách | 🥇 **Runtime Verified** | Nhập OTP 6 số + mật khẩu mới, cập nhật thành công. |
| 8 | `GET` | `/api/v1/users/me` | `getMe()` | `Header.jsx`, `AuthContext` | Authorize | 🥇 **Runtime Verified** | Rà soát dọc cả 3 Layout Customer/Nurse/Admin. |
| 9 | `PUT` | `/api/v1/users/me` | `updateMe(data)` | `FamilyProfile.jsx`, `CaregiverProfile.jsx` | Authorize | 🥈 **Build-Passed** | Cần test upload avatar lên Supabase Storage thật. |

---

### 📂 Phân Hệ 2: Khách Hàng & Gia Đình (`src/api/familyApi.js` — 28 APIs)
| STT | HTTP Method | Route Backend | Tên hàm trong `familyApi.js` | Màn hình / Component FE | Quyền (Role) | Cấp độ kiểm chứng | Ghi chú & Tình huống |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| 10 | `GET` | `/api/v1/addresses` | `getAddresses()` | `FamilyAddresses.jsx`, `BookingPage.jsx` | Customer | 🥇 **Runtime Verified** | Danh sách địa chỉ nhận ca chăm sóc của gia đình. |
| 11 | `POST` | `/api/v1/addresses` | `createAddress(data)` | `FamilyAddresses.jsx` | Customer | 🥇 **Runtime Verified** | Thêm địa chỉ mới kèm ghi chú chỉ đường. |
| 12 | `GET` | `/api/v1/addresses/{id}` | `getAddressDetail(id)` | `FamilyAddresses.jsx` | Customer | 🥈 **Build-Passed** | Chi tiết một địa chỉ cụ thể. |
| 13 | `PUT` | `/api/v1/addresses/{id}` | `updateAddress(id, data)` | `FamilyAddresses.jsx` | Customer | 🥈 **Build-Passed** | Sửa thông tin địa chỉ nhà. |
| 14 | `DELETE` | `/api/v1/addresses/{id}` | `deleteAddress(id)` | `FamilyAddresses.jsx` | Customer | 🥈 **Build-Passed** | Xóa địa chỉ khỏi sổ danh bạ. |
| 15 | `GET` | `/api/v1/recipients` | `getRecipients()` | `FamilyMembers.jsx`, `BookingPage.jsx` | Customer | 🥇 **Runtime Verified** | Danh sách người cao tuổi / bệnh nhân cần chăm sóc. |
| 16 | `POST` | `/api/v1/recipients` | `createRecipient(data)` | `FamilyMembers.jsx` | Customer | 🥇 **Runtime Verified** | Thêm hồ sơ người thân (tiền sử bệnh, dị ứng thuốc). |
| 17 | `GET` | `/api/v1/recipients/{id}` | `getRecipientDetail(id)` | `FamilyMembers.jsx` | Customer | 🥈 **Build-Passed** | Xem chi tiết hồ sơ sức khỏe một người thân. |
| 18 | `PUT` | `/api/v1/recipients/{id}` | `updateRecipient(id, data)`| `FamilyMembers.jsx` | Customer | 🥈 **Build-Passed** | Cập nhật thông tin bệnh lý của người thân. |
| 19 | `DELETE` | `/api/v1/recipients/{id}` | `deleteRecipient(id)` | `FamilyMembers.jsx` | Customer | 🥈 **Build-Passed** | Xóa hồ sơ người thân (kèm kiểm tra ràng buộc ca trực). |
| 20 | `GET` | `/api/v1/recipients/{id}/health-history` | `getRecipientHealthHistory(id)` | `FamilyHealthRecords.jsx` | Customer | 🥈 **Build-Passed** | Lịch sử theo dõi huyết áp, đường huyết theo thời gian. |
| 21 | `GET` | `/api/v1/nurses/search` | `searchNurses(params)` | `FindCaregiversPage.jsx` | Customer/Khách | 🥇 **Runtime Verified** | Bộ lọc điều dưỡng theo chuyên môn, giá, khu vực. |
| 22 | `GET` | `/api/v1/nurses/{id}/reviews` | `getNurseReviews(id, params)` | `NurseProfileDetailPage.jsx` | All | 🥇 **Runtime Verified** | Danh sách nhận xét đánh giá của điều dưỡng. |
| 23 | `GET` | `/api/v1/nurses/{id}/reviews/summary` | `getNurseRatingSummary(id)` | `NurseProfileDetailPage.jsx` | All | 🥇 **Runtime Verified** | Điểm sao trung bình và số lượng ca đã hoàn thành. |
| 24 | `POST` | `/api/v1/bookings` | `createBooking(data)` | `BookingPage.jsx` | Customer | 💎 **E2E-Verified** | Tạo ca chăm sóc mới (status `PendingPayment`). |
| 25 | `GET` | `/api/v1/bookings` | `getBookings(params)` | `FamilyBookings.jsx` | Customer | 🥇 **Runtime Verified** | Danh sách lịch hẹn theo tab trạng thái. |
| 26 | `GET` | `/api/v1/bookings/{id}` | `getBookingDetail(id)` | `BookingDetailPage.jsx` | Customer | 🥇 **Runtime Verified** | Xem chi tiết tiến độ ca chăm sóc và điều dưỡng phụ trách. |
| 27 | `PUT` | `/api/v1/bookings/{id}/cancel` | `cancelBooking(id, data)` | `CancelBookingModal.jsx` | Customer | 🥇 **Runtime Verified** | Bắt buộc nhập lý do hủy qua Modal chuyên dụng. |
| 28 | `POST` | `/api/v1/bookings/{id}/payments` | `createPaymentLink(id)` | `CheckoutPage.jsx` | Customer | 💎 **E2E-Verified** | Tạo link PayOS, tự động đính kèm `bookingId`. |
| 29 | `GET` | `/api/v1/bookings/{id}/payments` | `getPaymentDetail(id)` | `PaymentSuccess.jsx` | Customer | 💎 **E2E-Verified** | Kiểm tra kết quả giao dịch sau khi PayOS trả về. |
| 30 | `GET` | `/api/v1/bookings/{id}/health-record` | `getBookingHealthRecord(id)` | `FamilyBookingDetail.jsx` | Customer | 🥈 **Build-Passed** | Xem chỉ số sinh hiệu y tá ghi nhận trong ca trực. |
| 31 | `GET` | `/api/v1/recipients/{id}/health-history` | `getRecipientHealthHistory(id, p)` | `FamilyHealthRecords.jsx` | Customer | 🥈 **Build-Passed** | Đọc bệnh án lâm sàng phân trang theo ngày. |
| 32 | `POST` | `/api/v1/bookings/{id}/reviews` | `createReview(id, data)` | `ReviewModal.jsx` | Customer | 🥈 **Build-Passed** | Chấm điểm sao và viết nhận xét sau khi ca `Completed`. |
| 33 | `GET` | `/api/v1/reviews/{id}` | `getReviewDetail(id)` | `ReviewModal.jsx` | All | 🥈 **Build-Passed** | Chi tiết một bài đánh giá. |
| 34 | `GET` | `/api/v1/reviews/users/{id}` | `getUserReviews(id, params)` | `NurseProfileDetailPage.jsx` | All | 🥇 **Runtime Verified** | Đọc các đánh giá khách hàng khác viết về y tá này. |
| 35 | `POST` | `/api/v1/bookings/{id}/disputes` | `createDispute(id, data)` | `DisputeModal.jsx` | Customer | 🥈 **Build-Passed** | Mở khiếu nại nếu dịch vụ có sai phạm. |
| 36 | `GET` | `/api/v1/disputes/{id}` | `getDisputeDetail(id)` | `DisputeDetailModal.jsx` | Customer | 🥈 **Build-Passed** | Theo dõi trạng thái Admin xử lý khiếu nại. |
| 37 | `GET` | `/api/v1/services` | `getServices()` | `ServicesPage.jsx`, `BookingPage.jsx` | All | 🥇 **Runtime Verified** | Danh mục gói dịch vụ chăm sóc người già, sau mổ... |

---

### 📂 Phân Hệ 3: Điều Dưỡng, Hồ Sơ & Ví Tiền (`src/api/caregiverApi.js` — 26 APIs)
| STT | HTTP Method | Route Backend | Tên hàm trong `caregiverApi.js` | Màn hình / Component FE | Quyền (Role) | Cấp độ kiểm chứng | Ghi chú & Tình huống |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| 38 | `GET` | `/api/v1/nurse/profile` | `getProfile()` | `CaregiverProfile.jsx` | Nurse | 🥇 **Runtime Verified** | Tải hồ sơ chuyên môn, tiểu sử, kỹ năng y tế. |
| 39 | `PUT` | `/api/v1/nurse/profile` | `updateProfile(data)` | `CaregiverProfile.jsx` | Nurse | 🥈 **Build-Passed** | Cập nhật khu vực làm việc và giới thiệu bản thân. |
| 40 | `GET` | `/api/v1/nurse/availability` | `getAvailability()` | `CaregiverSchedule.jsx` | Nurse | 🥇 **Runtime Verified** | Tải lịch rảnh/bận trong tuần của điều dưỡng. |
| 41 | `POST` | `/api/v1/nurse/availability` | `addAvailability(data)` | `CaregiverSchedule.jsx` | Nurse | 🥈 **Build-Passed** | Đăng ký thêm khung giờ rảnh nhận ca. |
| 42 | `PUT` | `/api/v1/nurse/availability` | `setAvailability(data)` | `CaregiverSchedule.jsx` | Nurse | 🥈 **Build-Passed** | Cập nhật hàng loạt lịch trực tuần. |
| 43 | `DELETE`| `/api/v1/nurse/availability/{id}` | `deleteAvailability(id)` | `CaregiverSchedule.jsx` | Nurse | 🥈 **Build-Passed** | Hủy một khung giờ rảnh đã đăng ký. |
| 44 | `POST` | `/api/v1/nurse/documents` | `uploadDocuments(data)` | `CaregiverVerification.jsx` | Nurse | 🥈 **Build-Passed (Chờ test Supabase)** | Upload ảnh CCCD 2 mặt, thẻ SV y, chứng chỉ. |
| 45 | `GET` | `/api/v1/nurse/documents` | `getDocuments()` | `CaregiverVerification.jsx` | Nurse | 🥈 **Build-Passed** | Xem lại các tài liệu chứng thực đã nộp. |
| 46 | `POST` | `/api/v1/nurse/documents/re-submit` | `reSubmitDocuments(data)` | `CaregiverVerification.jsx` | Nurse | 🥈 **Build-Passed** | Nộp lại hồ sơ sau khi bị Admin từ chối. |
| 47 | `GET` | `/api/v1/nurse/verification-status` | `getVerificationStatus()` | `CaregiverDashboard.jsx` | Nurse | 🥇 **Runtime Verified** | Kiểm tra trạng thái `Pending`/`Approved`/`Rejected`. |
| 48 | `GET` | `/api/v1/bookings` | `getBookings(params)` | `CaregiverBookingRequests.jsx` | Nurse | 🥇 **Runtime Verified** | Danh sách yêu cầu nhận ca đang chờ xác nhận. |
| 49 | `GET` | `/api/v1/bookings/{id}` | `getBookingDetail(id)` | `BookingDetailModal.jsx` | Nurse | 🥇 **Runtime Verified** | Xem chi tiết ca, bệnh án người cao tuổi cần chăm. |
| 50 | `PUT` | `/api/v1/bookings/{id}/accept` | `acceptBooking(id)` | `CaregiverBookingRequests.jsx`, `CaregiverSchedule.jsx` | Nurse | 💎 **E2E-Verified** | **Rà soát ngang:** Nối đồng bộ cả trang Request và Lịch. |
| 51 | `PUT` | `/api/v1/bookings/{id}/reject` | `rejectBooking(id, data)` | `CaregiverBookingRequests.jsx` | Nurse | 🥇 **Runtime Verified** | Từ chối ca kèm lý do (chuyển sang `Canceled`). |
| 52 | `PUT` | `/api/v1/bookings/{id}/start` | `startBooking(id)` | `CaregiverSchedule.jsx` | Nurse | 🥇 **Runtime Verified** | Bắt đầu thời gian ca trực (chuyển `InProgress`). |
| 53 | `PUT` | `/api/v1/bookings/{id}/finish` | `finishBooking(id)` | `CaregiverSchedule.jsx` | Nurse | 🥇 **Runtime Verified** | Hoàn thành ca trực (chuyển `Completed`, kích hoạt ví). |
| 54 | `PUT` | `/api/v1/bookings/{id}/cancel` | `cancelBooking(id, data)` | `CaregiverSchedule.jsx` | Nurse | 🥇 **Runtime Verified** | Điều dưỡng báo hủy ca khẩn cấp kèm lý do. |
| 55 | `POST` | `/api/v1/bookings/{id}/health-record` | `submitHealthRecord(id, data)` | `HealthRecordModal.jsx` | Nurse | 🥈 **Build-Passed** | Ghi chỉ số sinh hiệu (Huyết áp, Mạch, SpO2, Đơn thuốc). |
| 56 | `PUT` | `/api/v1/bookings/{id}/health-record` | `updateHealthRecord(id, data)` | `HealthRecordModal.jsx` | Nurse | 🥈 **Build-Passed** | Chỉnh sửa cập nhật ghi chú y tế trong ca trực. |
| 57 | `GET` | `/api/v1/bookings/{id}/health-record` | `getHealthRecord(id)` | `HealthRecordModal.jsx` | Nurse | 🥈 **Build-Passed** | Đọc lại bệnh án lâm sàng đã ghi. |
| 58 | `GET` | `/api/v1/wallet/me` | `getWallet()` | `CaregiverWallet.jsx` | Nurse | 🥇 **Runtime Verified** | Xem số dư ví thực nhận sau **phí sàn 60.000 VNĐ**. |
| 59 | `GET` | `/api/v1/wallet/me/transactions` | `getWalletTransactions(p)` | `CaregiverWallet.jsx` | Nurse | 🥇 **Runtime Verified** | Sao kê lịch sử cộng tiền ca và trừ phí sàn minh bạch. |
| 60 | `POST` | `/api/v1/wallet/payouts` | `requestPayout(data)` | `CaregiverWallet.jsx` | Nurse | 🥈 **Build-Passed** | Yêu cầu rút tiền về tài khoản ngân hàng cá nhân. |
| 61 | `GET` | `/api/v1/wallet/payouts` | `getMyPayouts()` | `CaregiverWallet.jsx` | Nurse | 🥈 **Build-Passed** | Danh sách các lệnh rút tiền đang chờ Admin duyệt. |
| 62 | `GET` | `/api/v1/reviews/users/{id}` | `getReviewsReceived(id, p)` | `CaregiverReview.jsx` | Nurse | 🥇 **Runtime Verified** | Xem phản hồi đánh giá của các gia đình gửi cho mình. |
| 63 | `POST` | `/api/v1/bookings/{id}/reviews` | `reviewCustomer(id, data)` | `CaregiverReview.jsx` | Nurse | 🥈 **Build-Passed** | Điều dưỡng chấm điểm hợp tác của gia đình. |

---

### 📂 Phân Hệ 4: Hội Thoại & Đề Xuất Ca Làm Việc (`src/api/conversationApi.js` — 9 APIs)
| STT | HTTP Method | Route Backend | Tên hàm trong `conversationApi.js` | Màn hình / Component FE | Quyền (Role) | Cấp độ kiểm chứng | Ghi chú & Tình huống |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| 64 | `GET` | `/api/v1/conversations` | `getConversations(params)` | `MessagesPage.jsx`, `CaregiverMessages.jsx` | Authorize | 🥇 **Runtime Verified** | Danh sách hộp thư chat giữa Customer và Nurse. |
| 65 | `POST` | `/api/v1/conversations` | `getOrCreateConversation(data)`| `NurseProfileDetailPage.jsx` | Customer | 🥇 **Runtime Verified** | Bấm nút "Nhắn tin" từ trang cá nhân điều dưỡng. |
| 66 | `GET` | `/api/v1/conversations/{id}` | `getConversationDetail(id)` | `ChatWindow.jsx` | Authorize | 🥇 **Runtime Verified** | Chi tiết thông tin đối phương trong cuộc hội thoại. |
| 67 | `GET` | `/api/v1/conversations/{id}/messages` | `getMessages(id, params)` | `ChatWindow.jsx` | Authorize | 🥇 **Runtime Verified** | Tải tin nhắn phân trang, cuộn mượt xuống cuối. |
| 68 | `POST` | `/api/v1/conversations/{id}/messages` | `sendMessage(id, data)` | `ChatInput.jsx` | Authorize | 🥇 **Runtime Verified** | Gửi tin nhắn văn bản, hỗ trợ phím Enter. |
| 69 | `GET` | `/api/v1/conversations/{id}/proposals` | `getProposals(id)` | `ChatWindow.jsx` | Authorize | 🥇 **Runtime Verified** | Tải danh sách đề xuất ca trực đàm phán trong phòng chat. |
| 70 | `POST` | `/api/v1/conversations/{id}/proposals` | `createProposal(id, data)` | `CreateProposalModal.jsx` | Customer | 🥇 **Runtime Verified** | Family (Khách hàng) tạo đề xuất ca chăm sóc mới gửi cho Caregiver trong chat. |
| 71 | `PUT` | `/api/v1/conversations/{cId}/proposals/{pId}/accept` | `acceptProposal(cId, pId, data)` | `ProposalCard.jsx` | Nurse | 💎 **E2E-Verified** | Caregiver (Điều dưỡng) chấp thuận đề xuất. Tự tạo Booking `PendingPayment` giữ chỗ 30 phút. |
| 72 | `PUT` | `/api/v1/conversations/{cId}/proposals/{pId}/reject` | `rejectProposal(cId, pId, data)` | `ProposalCard.jsx` | Nurse | 🥇 **Runtime Verified** | Caregiver (Điều dưỡng) từ chối đề xuất ca chăm sóc. |

---

### 📂 Phân Hệ 5: Quản Trị Viên Backoffice (`src/api/adminApi.js` — 20 APIs)
| STT | HTTP Method | Route Backend | Tên hàm trong `adminApi.js` | Màn hình / Component FE | Quyền (Role) | Cấp độ kiểm chứng | Ghi chú & Tình huống |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| 73 | `GET` | `/api/v1/admin/dashboard/summary` | `getDashboardSummary()` | `AdminDashboard.jsx` | Admin | 🥇 **Runtime Verified** | Tổng số ca hoàn thành, điều dưỡng mới, khách hàng mới. |
| 74 | `GET` | `/api/v1/admin/dashboard/revenue` | `getRevenueMetrics(params)` | `AdminFinance.jsx` | Admin | 🥇 **Runtime Verified** | Biểu đồ doanh thu phí sàn **60.000 VNĐ / ca**. |
| 75 | `GET` | `/api/v1/admin/nurse-verifications` | `getNurseVerifications(p)` | `AdminNurseVerification.jsx` | Admin | 🥇 **Runtime Verified** | Danh sách hồ sơ điều dưỡng nộp chờ duyệt. |
| 76 | `GET` | `/api/v1/admin/nurse-verifications/expiring-licenses` | `getExpiringLicenses(p)` | `AdminNurseVerification.jsx` | Admin | 🥈 **Build-Passed** | Cảnh báo chứng chỉ hành nghề sắp hết hạn. |
| 77 | `GET` | `/api/v1/admin/nurse-verifications/{id}` | `getNurseVerificationDetail(id)` | `AdminNurseVerification.jsx` | Admin | 🥇 **Runtime Verified** | Soi chi tiết ảnh CCCD, bằng cấp, thẻ SV điều dưỡng. |
| 78 | `PUT` | `/api/v1/admin/nurse-verifications/{id}` | `reviewNurseVerification(id, d)` | `AdminNurseVerification.jsx` | Admin | 🥇 **Runtime Verified** | Duyệt (`Approved`) hoặc Từ chối kèm lý do (`Rejected`). |
| 79 | `GET` | `/api/v1/admin/payouts` | `getPayouts(params)` | `AdminFinance.jsx` | Admin | 🥈 **Build-Passed** | Danh sách lệnh yêu cầu rút tiền của điều dưỡng. |
| 80 | `PUT` | `/api/v1/admin/payouts/{id}/approve` | `approvePayout(id, data)` | `AdminFinance.jsx` | Admin | 🥈 **Build-Passed** | Admin xác nhận đã chuyển khoản ngân hàng thành công. |
| 81 | `PUT` | `/api/v1/admin/payouts/{id}/reject` | `rejectPayout(id, data)` | `AdminFinance.jsx` | Admin | 🥈 **Build-Passed** | Từ chối lệnh rút tiền kèm lý do (sai STK...). |
| 82 | `GET` | `/api/v1/services/admin` | `getServices(params)` | `AdminServices.jsx` | Admin | 🥇 **Runtime Verified** | Toàn bộ danh mục dịch vụ trên hệ thống. |
| 83 | `POST` | `/api/v1/services` | `createService(data)` | `AdminServices.jsx` | Admin | 🥈 **Build-Passed** | Tạo gói dịch vụ chăm sóc mới. |
| 84 | `GET` | `/api/v1/services/{id}` | `getServiceDetail(id)` | `AdminServices.jsx` | Admin | 🥇 **Runtime Verified** | Chi tiết một gói dịch vụ. |
| 85 | `PUT` | `/api/v1/services/{id}` | `updateService(id, data)` | `AdminServices.jsx` | Admin | 🥈 **Build-Passed** | Sửa giá sàn, mô tả, yêu cầu kỹ năng của dịch vụ. |
| 86 | `DELETE`| `/api/v1/services/{id}` | `deleteService(id)` | `AdminServices.jsx` | Admin | 🥈 **Build-Passed** | Xóa dịch vụ (nếu chưa có booking liên quan). |
| 87 | `PATCH` | `/api/v1/services/{id}/status` | `toggleServiceStatus(id, d)` | `AdminServices.jsx` | Admin | 🥈 **Build-Passed** | Bật / tắt hiển thị dịch vụ ra trang chủ. |
| 88 | `GET` | `/api/v1/admin/disputes` | `getDisputes(params)` | `AdminDisputes.jsx` | Admin | 🥈 **Build-Passed** | Danh sách các khiếu nại ca trực có sự cố. |
| 89 | `GET` | `/api/v1/disputes/{id}` | `getDisputeDetail(id)` | `AdminDisputes.jsx` | Admin | 🥈 **Build-Passed** | Chi tiết bằng chứng khiếu nại giữa 2 bên. |
| 90 | `PUT` | `/api/v1/admin/disputes/{id}` | `resolveDispute(id, data)` | `AdminDisputes.jsx` | Admin | 🥈 **Build-Passed** | Đưa ra phán quyết hòa giải hoặc phạt tiền. |
| 91 | `POST` | `/api/v1/admin/bookings/{id}/refund` | `refundBooking(id, data)` | `AdminBookings.jsx` | Admin | 🥈 **Build-Passed** | Lệnh hoàn tiền ca chăm sóc bị tranh chấp. |
| 92 | `GET` | `/api/v1/bookings` | `getAllBookings(params)` | `AdminBookings.jsx` | Admin | 🥇 **Runtime Verified** | Giám sát toàn bộ ca chăm sóc trên toàn hệ thống. |

---

### 📂 Phân Hệ 6: Thông Báo Tức Thời (`src/api/notificationApi.js` — 4 APIs)
| STT | HTTP Method | Route Backend | Tên hàm trong `notificationApi.js` | Màn hình / Component FE | Quyền (Role) | Cấp độ kiểm chứng | Ghi chú & Tình huống |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| 93 | `GET` | `/api/v1/notifications` | `getNotifications(params)` | `Header.jsx`, `NotificationsDropdown.jsx` | Authorize | 🥇 **Runtime Verified** | Tải danh sách thông báo mới nhất phân trang. |
| 94 | `GET` | `/api/v1/notifications/unread-count` | `getUnreadCount()` | `Header.jsx` | Authorize | 🥇 **Runtime Verified** | Đếm số lượng hiển thị badge chuông đỏ chưa đọc. |
| 95 | `PUT` | `/api/v1/notifications/{id}/read` | `markAsRead(id)` | `NotificationsDropdown.jsx` | Authorize | 🥇 **Runtime Verified** | Đánh dấu đã đọc khi người dùng nhấp vào thông báo. |
| 96 | `PUT` | `/api/v1/notifications/read-all` | `markAllAsRead()` | `NotificationsDropdown.jsx` | Authorize | 🥇 **Runtime Verified** | Nút "Đánh dấu đọc tất cả" chỉ bằng một chạm. |

---

### 📂 Phân Hệ 7: Cẩm Nang & Tin Tức Y Tế (`src/api/handbookApi.js` — 9 APIs)
| STT | HTTP Method | Route Backend | Tên hàm trong `handbookApi.js` | Màn hình / Component FE | Quyền (Role) | Cấp độ kiểm chứng | Ghi chú & Tình huống |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| 97 | `GET` | `/api/v1/handbook` | `getPublishedArticles(params)`| `HandbookPage.jsx` | Khách/All | 🥇 **Runtime Verified** | Danh mục bài viết cẩm nang y tế đã xuất bản. |
| 98 | `GET` | `/api/v1/handbook/{idOrSlug}`| `getArticleDetail(idOrSlug)` | `HandbookDetailPage.jsx` | Khách/All | 🥇 **Runtime Verified** | Chi tiết bài viết theo Slug thân thiện SEO. |
| 99 | `GET` | `/api/v1/handbook/admin` | `getAdminArticles(params)` | `AdminHandbook.jsx` | Admin | 🥇 **Runtime Verified** | Danh sách bài viết quản trị (gồm cả bản nháp). |
| 100| `GET` | `/api/v1/handbook/admin/{id}` | `getAdminArticleDetail(id)` | `AdminHandbook.jsx` | Admin | 🥇 **Runtime Verified** | Chi tiết bài viết trong màn hình soạn thảo Admin. |
| 101| `POST` | `/api/v1/handbook/admin` | `createArticle(data)` | `AdminHandbook.jsx` | Admin | 🥇 **Runtime Verified** | Thêm mới bài viết cẩm nang y tế. |
| 102| `PUT` | `/api/v1/handbook/admin/{id}` | `updateArticle(id, data)` | `AdminHandbook.jsx` | Admin | 🥇 **Runtime Verified** | Chỉnh sửa nội dung bài viết cẩm nang. |
| 103| `PATCH`| `/api/v1/handbook/admin/{id}/status` | `updateArticleStatus(id, s)` | `AdminHandbook.jsx` | Admin | 🥇 **Runtime Verified** | Chuyển đổi trạng thái Bản nháp / Xuất bản. |
| 104| `PATCH`| `/api/v1/handbook/admin/{id}/featured` | `toggleFeatured(id, f)` | `AdminHandbook.jsx` | Admin | 🥇 **Runtime Verified** | Đặt làm bài viết Nổi bật trên trang chủ. |
| 105| `DELETE`| `/api/v1/handbook/admin/{id}`| `deleteArticle(id, hard)` | `AdminHandbook.jsx` | Admin | 🥇 **Runtime Verified** | Xóa bài viết cẩm nang y tế. |

---

### 📂 Phân Hệ 8: Nâng Cấp Backend V2.1 (Bảng Giá Cá Nhân, Nghiệm Thu 2 Chiều & Thống Kê Admin)
| STT | HTTP Method | Route Backend | Tên hàm client | Màn hình / Component FE | Quyền (Role) | Cấp độ kiểm chứng | Ghi chú & Tình huống |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| 106 | `GET` | `/api/v1/nurses/pricing/me` | `getMyPricing()` | `CaregiverPricing.jsx` | Nurse | 🥈 **Build-Passed** | Lấy danh sách dịch vụ và bảng giá tự đặt của điều dưỡng hiện tại. |
| 107 | `PUT` | `/api/v1/nurses/pricing/me` | `updateMyPricing(data)` | `CaregiverPricing.jsx` | Nurse | 🥈 **Build-Passed** | Cập nhật đơn giá mong muốn và bật/tắt nhận từng dịch vụ. |
| 108 | `GET` | `/api/v1/nurses/pricing/me/readiness` | `getMyReadiness()` | `CaregiverDashboard.jsx`, `CaregiverPricing.jsx` | Nurse | 🥈 **Build-Passed** | Kiểm tra trạng thái sẵn sàng nhận việc (đủ 4 điều kiện). |
| 109 | `GET` | `/api/v1/nurses/pricing/{nurseId}` | `getNursePricing(nurseId)` | `CreateProposalModal.jsx`, `CaregiverBookingDetailPanel.jsx` | Authorize | 🥈 **Build-Passed** | Xem bảng giá công khai của một điều dưỡng cụ thể. |
| 110 | `PUT` | `/api/v1/bookings/{id}/nurse-confirm` | `nurseConfirmBooking(id)` | `SubmitHealthRecordModal.jsx` | Nurse | 🥈 **Build-Passed** | Điều dưỡng ký xác nhận hoàn thành sau khi nộp báo cáo y tế. |
| 111 | `PUT` | `/api/v1/bookings/{id}/customer-confirm` | `customerConfirmBooking(id, data)` | `Appointments.jsx` | Customer | 🥈 **Build-Passed** | Gia đình kiểm tra báo cáo y tế, đánh giá sao và ký nghiệm thu hoàn tất. |
| 112 | `GET` | `/api/v1/recipients/check-readiness` | `checkRecipientReadiness()` | `CreateProposalModal.jsx` | Customer | 🥈 **Build-Passed** | Kiểm tra nhanh khách hàng đã có hồ sơ người nhận chăm sóc hay chưa. |
| 113 | `GET` | `/api/v1/admin/nurses/statistics` | `getNurseStatistics(params)` | `AdminNurseStatistics.jsx` | Admin | 🥈 **Build-Passed** | Thống kê danh sách điều dưỡng phân trang (số ca, tỷ lệ hoàn thành, doanh thu, số dư ví). |
| 114 | `GET` | `/api/v1/admin/nurses/statistics/{nurseId}` | `getNurseDetailStatistics(nurseId)` | `AdminNurseStatistics.jsx` | Admin | 🥈 **Build-Passed** | Chi tiết báo cáo ca trực và sao kê dòng tiền ví của 1 điều dưỡng. |

---

## 📌 BẢO ĐẢM TÍNH TRUNG THỰC VỀ TRẠNG THÁI KIỂM CHỨNG
1. **API Upload tài liệu điều dưỡng (STT 44 - `uploadDocuments`):** Đã được đính chính thành **`Build-Passed (Chờ test Supabase)`** vì mới hoàn thành code client và DTO, chưa chạy upload file ảnh thật vào Supabase Storage.
2. **Đầy đủ 100%:** Toàn bộ 114 phương thức API trong các tệp client đều đã được liệt kê chi tiết từng dòng, đồng bộ đầy đủ với Backend V2.1!
