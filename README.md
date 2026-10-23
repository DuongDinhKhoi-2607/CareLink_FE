# 🏥 CareLink - Hệ Thống Kết Nối Chăm Sóc Sức Khỏe Y Tế Tại Nhà

> **Nền tảng kết nối sinh viên Y khoa và Điều dưỡng chuyên nghiệp với các gia đình cần hỗ trợ chăm sóc sức khỏe người cao tuổi và bệnh nhân tại nhà, mang lại sự an tâm trọn vẹn.**

---

## 🌟 Giới Thiệu Dự Án

**CareLink** là giải pháp công nghệ y tế hiện đại giúp các gia đình dễ dàng tiếp cận dịch vụ chăm sóc sức khỏe chất lượng cao ngay tại tổ ấm thân yêu. Hệ thống giải quyết bài toán tìm kiếm người chăm sóc uy tín, minh bạch thông tin chuyên môn, lịch trình và chi phí.

---

## 🚀 Các Tính Năng Nổi Bật

### 🏠 1. Phân hệ Dành cho Gia đình (Family)
- **Trang chủ & Dịch vụ**: Khám phá các gói dịch vụ chăm sóc tại nhà (chăm sóc người già, theo dõi sau phẫu thuật, vật lý trị liệu, chăm sóc vết thương).
- **Tìm kiếm & Tuyển chọn**: Bộ lọc đa năng theo chuyên khoa, trình độ chuyên môn, mức giá và khu vực sinh sống.
- **Hồ sơ chuyên gia**: Xem chi tiết chứng chỉ y tế, kinh nghiệm làm việc và đánh giá thực tế từ các gia đình khác.
- **Quy trình đặt lịch & Trao đổi**: Trực tiếp nhắn tin trao đổi tình trạng sức khỏe trước khi chốt ca chăm sóc.
- **Bảng điều khiển Gia đình (Family Dashboard)**:
  - Quản lý lịch hẹn chăm sóc (sắp tới, đang diễn ra, lịch sử hoàn thành).
  - Quản lý hồ sơ sức khỏe người thân trong gia đình.
  - Theo dõi báo cáo sức khỏe định kỳ.
  - Cài đặt tài khoản & thông báo.

### 🩺 2. Phân hệ Dành cho Người Chăm Sóc (Caregiver)
- **Cổng thông tin tuyển dụng**: Tìm hiểu quyền lợi, quy trình gia nhập và chính sách bảo hiểm nghề nghiệp.
- **Chọn vai trò & Xác minh hồ sơ**:
  - Dành cho Sinh viên Y / Sinh viên Điều dưỡng.
  - Dành cho Điều dưỡng đã hành nghề.
  - Quy trình xác thực nhiều bước: CCCD, bằng cấp, thẻ sinh viên và chứng chỉ hành nghề.
- **Bảng điều khiển Điều dưỡng (Caregiver Dashboard)**: Quản lý lịch trực tuần, nhận yêu cầu booking mới, theo dõi thu nhập và đánh giá từ khách hàng.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend Core**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: Lucide Icons & Custom Medical SVG Icons
- **Deployment**: [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/)

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local)

### 📋 Yêu cầu môi trường
- Đã cài đặt [Node.js](https://nodejs.org/) (khuyến nghị phiên bản LTS từ 18 trở lên).
- Trình quản lý gói `npm`.

### ⚙️ Các bước khởi chạy

1. **Clone mã nguồn dự án về máy**:
   ```bash
   git clone https://github.com/DuongDinhKhoi-2607/CareLink_FE.git
   cd CareLink_FE
   ```

2. **Cài đặt các thư viện phụ thuộc**:
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển (Development Server)**:
   ```bash
   npm run dev
   ```
   > Sau khi lệnh chạy thành công, mở trình duyệt và truy cập: `http://localhost:5173`

4. **Đóng gói dự án (Production Build)**:
   ```bash
   npm run build
   ```

---

## 🌐 Bản Quyền

Dự án được phát triển bởi đội ngũ **CareLink Team**. Mọi quyền được bảo lưu.

```
CareLink_FE
├─ .oxlintrc.json
├─ AGENTS.md
├─ docs
│  └─ ai
│     ├─ AI_WORKING_RULES.md
│     ├─ API_INTEGRATION_MATRIX.md
│     ├─ ARCHITECTURE_DECISIONS.md
│     ├─ DOCUMENTATION_INDEX.md
│     ├─ TESTING_AND_ACCEPTANCE.md
│     └─ WORK_STATUS.md
├─ FE_BE_GAP_ANALYSIS.md
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.svg
│  ├─ icons.svg
│  ├─ images
│  │  ├─ caregiver-hero.jpg
│  │  ├─ caregiver_avatar.svg
│  │  ├─ elderly_caregiver.jpg
│  │  ├─ erder-caregiver.jpg
│  │  ├─ home_hero.jpg
│  │  ├─ home_hero_option2.jpg
│  │  ├─ home_hero_original.jpg
│  │  ├─ imagess.jpg
│  │  ├─ images_elderly.jpg
│  │  ├─ istockphoto-1029340354-612x612.jpg
│  │  ├─ istockphoto-1917170366-612x612.jpg
│  │  ├─ istockphoto-2129584121-612x612.jpg
│  │  ├─ login_caregiver.jpg
│  │  ├─ login_caregiver_tight.jpg
│  │  ├─ parentis-health-Why-Become-a-Caregiver_.jpg
│  │  └─ senior_caregiver.jpg
│  └─ _redirects
├─ README.md
├─ src
│  ├─ api
│  │  ├─ adminApi.js
│  │  ├─ authApi.js
│  │  ├─ axiosClient.js
│  │  ├─ caregiverApi.js
│  │  ├─ conversationApi.js
│  │  ├─ familyApi.js
│  │  ├─ handbookApi.js
│  │  ├─ index.js
│  │  └─ notificationApi.js
│  ├─ App.css
│  ├─ App.jsx
│  ├─ components
│  │  ├─ Footer.jsx
│  │  ├─ Header.jsx
│  │  ├─ LogoutModal.jsx
│  │  ├─ PageTransition.jsx
│  │  ├─ Rating.jsx
│  │  └─ Toast.jsx
│  ├─ data
│  │  ├─ chatDemoStore.js
│  │  └─ handbookData.js
│  ├─ features
│  │  ├─ admin
│  │  │  ├─ components
│  │  │  │  ├─ AppointmentDetailModal.jsx
│  │  │  │  ├─ ApprovalDetailModal.jsx
│  │  │  │  ├─ HandbookModals.jsx
│  │  │  │  └─ ServiceFormModal.jsx
│  │  │  └─ pages
│  │  │     ├─ AdminAppointments.jsx
│  │  │     ├─ AdminDashboard.jsx
│  │  │     ├─ AdminDisputes.jsx
│  │  │     ├─ AdminFinance.jsx
│  │  │     ├─ AdminHandbook.jsx
│  │  │     ├─ AdminServices.jsx
│  │  │     ├─ CaregiverApprovals.jsx
│  │  │     ├─ ServiceManagement.jsx
│  │  │     └─ UserManagement.jsx
│  │  ├─ caregiver
│  │  │  ├─ components
│  │  │  │  ├─ CaregiverBookingDetailPanel.jsx
│  │  │  │  ├─ CaregiverChatThread.jsx
│  │  │  │  ├─ HealthRecordModal.jsx
│  │  │  │  ├─ RejectBookingModal.jsx
│  │  │  │  ├─ SubmitHealthRecordModal.jsx
│  │  │  │  └─ VerificationStepper.jsx
│  │  │  └─ pages
│  │  │     ├─ CaregiverBookingRequests.jsx
│  │  │     ├─ CaregiverDashboard.jsx
│  │  │     ├─ CaregiverMessages.jsx
│  │  │     ├─ CaregiverProfile.jsx
│  │  │     ├─ CaregiverProfilePage.jsx
│  │  │     ├─ CaregiverReview.jsx
│  │  │     ├─ CaregiverSchedule.jsx
│  │  │     ├─ CaregiverWallet.jsx
│  │  │     ├─ ChooseRole.jsx
│  │  │     ├─ ForCaregiver.jsx
│  │  │     └─ Verification.jsx
│  │  ├─ family
│  │  │  ├─ components
│  │  │  │  ├─ BookingSummary.jsx
│  │  │  │  ├─ CancelBookingModal.jsx
│  │  │  │  ├─ CaregiverCard.jsx
│  │  │  │  ├─ CaregiverFilterSidebar.jsx
│  │  │  │  ├─ CreateDisputeModal.jsx
│  │  │  │  ├─ CreateProposalModal.jsx
│  │  │  │  ├─ RelativeModals.jsx
│  │  │  │  ├─ ServiceCard.jsx
│  │  │  │  ├─ ServiceDetailModal.jsx
│  │  │  │  ├─ ServiceSelectionCard.jsx
│  │  │  │  └─ ViewHealthRecordModal.jsx
│  │  │  └─ pages
│  │  │     ├─ Appointments.jsx
│  │  │     ├─ CaregiverList.jsx
│  │  │     ├─ CaregiverProfile.jsx
│  │  │     ├─ Chat.jsx
│  │  │     ├─ Checkout.jsx
│  │  │     ├─ Dashboard.jsx
│  │  │     ├─ DashboardMessages.jsx
│  │  │     ├─ FamilyProfile.jsx
│  │  │     ├─ ForFamily.jsx
│  │  │     ├─ HealthRecords.jsx
│  │  │     ├─ HealthReports.jsx
│  │  │     ├─ PaymentResult.jsx
│  │  │     ├─ Relatives.jsx
│  │  │     ├─ Review.jsx
│  │  │     └─ Services.jsx
│  │  └─ shared
│  │     └─ notifications
│  │        ├─ index.js
│  │        ├─ NotificationDropdown.jsx
│  │        ├─ NotificationItem.jsx
│  │        ├─ notificationMockData.js
│  │        └─ notificationUtils.jsx
│  ├─ index.css
│  ├─ layouts
│  │  ├─ AdminLayout.jsx
│  │  ├─ CaregiverLayout.jsx
│  │  ├─ DashboardLayout.jsx
│  │  └─ MainLayout.jsx
│  ├─ main.jsx
│  └─ pages
│     ├─ auth
│     │  ├─ ForgotPassword.jsx
│     │  ├─ Login.jsx
│     │  └─ Register.jsx
│     └─ public
│        ├─ HandbookDetail.jsx
│        ├─ Home.jsx
│        ├─ MedicalHandbook.jsx
│        ├─ PrivacyPolicy.jsx
│        └─ TermsOfService.jsx
├─ vercel.json
└─ vite.config.js

```