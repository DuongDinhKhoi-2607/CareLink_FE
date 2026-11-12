# BÁO CÁO AUDIT TOÀN DIỆN UI/UX & KIẾN TRÚC GIAO DIỆN — `CareLink_FE`

> **Trạng thái:** Audit-Only (Chưa chỉnh sửa bất kỳ file `.jsx`, `.css`, API client hay Backend nào)  
> **Phạm vi kiểm tra:** Toàn bộ 84 tệp `.jsx` (`src/pages/`, `src/features/family/`, `src/features/caregiver/`, `src/features/admin/`, `src/layouts/`, `src/components/`, `src/features/shared/`), `src/App.jsx`, `src/index.css`, `index.html`, `package.json`, `public/images/*`, đối chiếu với 23 Controller trong `CareLink_BE`.  
> **Cập nhật bối cảnh:** Đã rà soát lại hiện trạng code **sau các commit Nhóm 1** (`1777b18`, `26fff88`), tôn trọng nguyên tắc **chừa lại các khối mock/static UI nơi Backend chưa có API** (phân tách rạch ròi với các bug/mock đã có API BE), không thay đổi hợp đồng API hay logic thanh toán PayOS / phí sàn 60.000đ.

---

## CẢNH BÁO QUAN TRỌNG CẦN CHỐT TRƯỚC KHI REDESIGN (XUNG ĐỘT BẢNG MÀU)

Trong yêu cầu định hướng có nêu: *"Màu sắc kem, be, nâu và trắng theo định hướng thương hiệu hiện tại"*, nhưng **kết quả quét trực tiếp toàn bộ `CareLink_FE` cho thấy thực tế codebase đang đi theo hai hướng khác và KHÔNG có tông nâu làm màu chủ đạo**:

| Tông màu | Tần suất xuất hiện thực tế trong `.jsx` | Nơi đang dùng |
| :--- | :--- | :--- |
| **Medical Teal + Deep Navy** (`#00677c`, `#102030`, `#002045`, `#087E78`, `#087F8C`, `#005566`, `#f8fafc`) | `#00677c` (565 lần), `#102030` (125), `#002045` (76), `#087E78` (56), `#087F8C` (50), `#005566` (49), `#f8fafc` (25) | Toàn bộ Dashboard Family, Caregiver, Admin, Auth Login/ForgotPassword, Layouts, Modals, Terms/Privacy, Checkout |
| **Warm Cream + Deep Teal** (`#F7F6F2`, `#FCFDFB`, `#fdfbf8`, `#187D74`, `#218579`) | `#187d74` (45 lần), `#218579` (30), nền kem chỉ có ở 4 trang | `ForFamily.jsx`, `ForCaregiver.jsx`, `Register.jsx`, `MedicalHandbook.jsx` |
| **Tông Nâu (`#4d4233`, `#ede4d6`)** | Chỉ xuất hiện cục bộ làm màu nhấn chữ/viền nhẹ | `MedicalHandbook.jsx` (category/accordion), còn lại chỉ là badge `amber` cảnh báo |

**Khuyến nghị kiến trúc (cần bạn chốt 1 trong 2 phương án trước P1):**
- **Phương án A (Khuyến nghị — Nhất quán hệ thống hiện tại):** Hợp nhất thành **"Warm Medical Teal"**: nền tổng thể giữ trắng sạch / kem rất nhẹ (`#FAFAF7` hoặc `#f8fafc`), màu thương hiệu chính là `#00677c` / `#087E78` (tin cậy y tế), nhấn phụ bằng vàng cát ấm rất tiết chế cho CTA phụ. Không bị đứt gãy thị giác khi chuyển từ Landing -> Dashboard.
- **Phương án B (Nếu nhóm thật sự muốn đổi sang Kem – Be – Nâu – Trắng):** Phải thiết kế lại toàn bộ CSS Design Tokens cho cả Public + Family + Caregiver + Admin để không tạo cảm giác "nửa nạc nửa mỡ" giữa landing page màu nâu-kem và dashboard màu xanh teal.

---

## 1. ĐÁNH GIÁ TỔNG QUAN CHẤT LƯỢNG UI/UX (GÓC NHÌN NGƯỜI DÙNG LẦN ĐẦU)

Nếu đặt mình là **một người con bận rộn lần đầu tìm điều dưỡng chăm mẹ già**, hoặc **một điều dưỡng mới đăng ký tài khoản**, ấn tượng tổng thể về `CareLink_FE` hiện nay là **"chức năng phong phú, nghiệp vụ sâu, nhưng quá tải thị giác và nặng cảm giác kỹ thuật nội bộ"**:

### 1.1. 9 vấn đề cốt lõi trên toàn hệ thống
1. **Quá nhiều chữ giải thích, microcopy thừa và "văn phong tài liệu nội bộ":** Nhiều modal/card cố gắng giải thích cả quy trình 3-4 dòng ngay trên màn hình chính (`DirectBookingModal.jsx`, `Checkout.jsx`, `Verification.jsx`, `Appointments.jsx`, `ForCaregiver.jsx`). Người dùng lần đầu chỉ cần biết **"Bấm nút này để làm gì tiếp theo?"**.
2. **Lạm dụng Card lồng Card, Badge, Border và Shadow:** Trên 1 thẻ lịch hẹn ở `Appointments.jsx` hoặc `CaregiverBookingRequests.jsx` cùng lúc xuất hiện: badge trạng thái, badge loại dịch vụ, badge giờ có mặt, box thông tin bệnh nhân, box địa chỉ, box ghi chú, box thanh toán — làm mắt không tìm ra điểm neo chính.
3. **File UI quá phình to (Monolithic Components):** Có tới **9 file `.jsx` vượt quá 1.000 dòng** (đứng đầu là `Verification.jsx` 2.456 dòng, `Appointments.jsx` 1.837 dòng, `DirectBookingModal.jsx` 1.758 dòng, `FamilyProfile.jsx` 1.401 dòng, `Register.jsx` 1.365 dòng, `CaregiverMessages.jsx` 1.195 dòng, `Checkout.jsx` 1.138 dòng, `CaregiverList.jsx` 1.104 dòng, `CaregiverReview.jsx` 1.075 dòng, `CaregiverProfilePage.jsx` 1.070 dòng, `CaregiverSchedule.jsx` 1.054 dòng, `AdminFinance.jsx` 1.028 dòng). Code dài làm mỗi lần sửa dễ sót trường hợp và lặp lại markup.
4. **Dùng song song 2 hệ icon và emoji trong UI:** 47 file dùng `lucide-react`, nhưng 44 file vẫn viết `<svg>` inline thủ công (ví dụ `Header.jsx`, `DashboardLayout.jsx`, `Checkout.jsx`, `Chat.jsx`, `Register.jsx` định nghĩa wrapper `Icon` riêng dù đã import `lucide-react`). Cá biệt có `FamilyProfile.jsx:13-38`, `DashboardMessages.jsx:38-41`, `CaregiverDashboard.jsx:83,91` còn trộn cả emoji (`🏠`, `🏢`, `🩺`, `💊`, `✓`, `✕`) thay cho SVG.
5. **Tên nút / nhãn / thuật ngữ chưa thống nhất:** Cùng một đối tượng lúc gọi *"Điều dưỡng"*, lúc gọi *"Người chăm sóc"*, lúc gọi *"Caregiver"*; cùng một khu vực Chat nhưng Family có tới 2 trang khác nhau (`Chat.jsx` ở `/chat` và `DashboardMessages.jsx` ở `/dashboard/messages` & `/dashboard/chat`) với giao diện hoàn toàn khác nhau!
6. **Phân cấp thị giác (Visual Hierarchy) phẳng trên Dashboard & Bảng dữ liệu:** Số liệu KPI ở `AdminDashboard.jsx`, `CaregiverDashboard.jsx`, `Dashboard.jsx` dàn ngang đều nhau, thiếu phân biệt giữa **Việc cần làm ngay (Actionable)** và **Số liệu tham khảo**.
7. **Sidebar Admin dàn trải, thiếu gom nhóm nhận thức:** `AdminLayout.jsx` liệt kê 8 mục phẳng kèm badge, chữ vừa dài vừa sát nhau, người quản trị mới vào khó phân biệt cụm **Vận hành hàng ngày** vs **Tài chính & Khiếu nại** vs **Danh mục hệ thống**.
8. **Form & Modal dồn 1 màn hình hoặc chia bước nặng nề:** `DirectBookingModal.jsx` (1.758 dòng) nén cùng lúc chọn người thân + địa chỉ + combo dịch vụ + ngày + lưới slot 30 phút + giờ có mặt + ghi chú vào 1 modal dài cuộn mệt; ngược lại `Verification.jsx` (2.456 dòng) trải 5 bước có bước quá dài (upload nhiều loại giấy tờ cùng lúc).
9. **Thao tác lặp lại & Lệch hình ảnh thương hiệu:** Có **25 file `.jsx` đang nhúng trực tiếp URL `images.unsplash.com`** (kể cả khi đã có ảnh cục bộ trong `public/images/`), và `public/images/` còn sót 3 file `istockphoto-*.jpg`. Thêm vào đó, **chưa có Code Splitting** ở `src/App.jsx` khiến bundle JS build ra tới **1.890,68 kB** (`dist/assets/index-DMyrOgyj.js`).

### 1.2. Điểm tốt cần GIỮ NGUYÊN (không được làm mất khi redesign)
- `ForgotPassword.jsx` xử lý 6 ô OTP rất tốt (auto-focus, ArrowLeft/Right, Backspace thông minh).
- `Appointments.jsx` và `AdminDisputes.jsx` đã cập nhật sạch sau Nhóm 1: countdown giữ chỗ 30 phút, tách rõ trạng thái duyệt hoàn tiền vs chuyển khoản, loại bỏ `MOCK_DISPUTES` và không dùng `alert()`/`confirm()`/`prompt()` của trình duyệt (`0` lần xuất hiện toàn dự án).
- `TermsOfService.jsx` & `PrivacyPolicy.jsx` có thanh tiến độ đọc + mục lục điều hướng rõ ràng, tông chữ dễ đọc.
- Lịch lưới chọn slot ở `DirectBookingModal.jsx` trực quan theo kiểu đặt vé/giờ trống real-time.

### 1.3. Cập nhật trạng thái sau các commit Nhóm 1 (`1777b18`, `26fff88`)
- **Đã xử lý ở code hiện tại (không ghi nhầm thành lỗi tồn đọng):** `AdminDisputes.jsx` đã bỏ `MOCK_DISPUTES` và dùng DTO API thật; hiển thị rõ *"Đã duyệt hoàn · Chờ chuyển khoản"*; `Appointments.jsx` đồng bộ giữ chỗ 30 phút theo `paymentHoldStartedAt`/`paymentHoldExpiresAt`; `CaregiverWallet.jsx` & `AdminNurseStatistics.jsx` hỗ trợ ví âm.

---

## 2. PHÂN TÍCH CHI TIẾT TỪNG TRANG THEO 5 NHÓM & COMPONENT DÙNG CHUNG

### 2.1. Khu vực Public (7 trang)

| Trang | File (Số dòng) | Đánh giá hiện trạng & Điểm nghẽn UX | Mức độ chỉnh |
| :--- | :--- | :--- | :--- |
| **Trang chủ** | `src/pages/public/Home.jsx` (441) | Hero dùng `/images/home_hero.jpg` ổn nhưng Section Top điều dưỡng nổi bật (`Home.jsx:106-122`) và banner (`Home.jsx:306`) vẫn hardcode Unsplash; chưa có API BE cho Top điều dưỡng nên giữ khung UI này nhưng chuyển ảnh fallback về `/images/caregiver_avatar.svg` và ghi chú rõ dữ liệu minh họa. | Chỉnh nhẹ |
| **Cho Gia đình** | `src/pages/public/ForFamily` -> `src/features/family/pages/ForFamily.jsx` (837) | Dùng nền kem `#F7F6F2` + teal `#187d74`, tương phản với `Home.jsx` nền `#f8fafc`/`#00677c`; ảnh (`ForFamily.jsx:293,494`) dùng Unsplash; quá dài khi cuộn, nhiều thẻ chữ giải thích quy trình có thể rút gọn 30%. | Redesign vừa phải |
| **Cho Điều dưỡng** | `src/features/caregiver/pages/ForCaregiver.jsx` (676) | Cũng dùng nền `#F7F6F2`, ảnh testimonial (`ForCaregiver.jsx:85,94,103`) là Unsplash; các bước đăng ký giải thích hơi dài dòng so với nút CTA vào `/choose-role` và `/caregiver/verification`. | Redesign vừa phải |
| **Cẩm nang Y tế** | `src/pages/public/MedicalHandbook.jsx` (729) | Nền `#fdfbf8` + accent nâu `#4d4233`/`#ede4d6` lạc tông với Dashboard `#00677c`. Fallback `handbookData.js` hoàn toàn ổn định làm dữ liệu đọc khi BE chưa trả đủ bài, nhưng cần đồng bộ header/badge về bảng màu chuẩn. | Chỉnh nhẹ |
| **Chi tiết Cẩm nang** | `src/pages/public/HandbookDetail.jsx` (383) | Bố cục bài viết dễ đọc, nút Share copy link nhanh, có skeleton loading. Chỉ cần đồng bộ fallback image (`HandbookDetail.jsx:274`) thay vì Unsplash. | Giữ nguyên / Chỉnh nhẹ |
| **Chính sách bảo mật** | `src/pages/public/PrivacyPolicy.jsx` (464) | Clean editorial layout, đọc dễ, có scroll progress bar. Điểm trừ duy nhất: tự viết `ArrowLeft`, `ShieldIcon`, `MailIcon` SVG inline thay vì `lucide-react`. | Giữ nguyên |
| **Điều khoản sử dụng** | `src/pages/public/TermsOfService.jsx` (459) | Cấu trúc tốt, có InfoCard phân tách Bước 1-2-3. Cần rà soát lại phần phí & hoàn tiền để đồng bộ chữ nghĩa với phí sàn 60.000đ và chính sách B+ (PayOS + quy trình yêu cầu hoàn tiền). | Chỉnh nhẹ |

### 2.2. Khu vực Auth & Onboarding (4 trang)

| Trang | File (Số dòng) | Đánh giá hiện trạng & Điểm nghẽn UX | Mức độ chỉnh |
| :--- | :--- | :--- | :--- |
| **Đăng nhập** | `src/pages/auth/Login.jsx` (725) | Giao diện 2 cột gọn, nhưng **rủi ro nghiêm trọng**: dòng `291` vẫn tạo `mock_google_token_` khi Google One Tap lỗi/bị chặn! Cần hiển thị lỗi đăng nhập thật thay vì cho vào bằng mock token. Ảnh fallback cũng trỏ Unsplash (`Login.jsx:130-138,225-228`). | Chỉnh nhẹ UI / **P0 sửa auth mock** |
| **Đăng ký** | `src/pages/auth/Register.jsx` (1.365) | Quá dài (1.365 dòng), 2 bước nhưng nhồi nhiều panel trust badge; trộn inline `<svg>` `Icon` wrapper dù đã import `lucide-react`; dùng nền `#FCFDFB` + teal `#218579`; đặc biệt dòng `529`, `631`, `707` còn `mock_reg_token_` & `mock_google_token_` bypass! | Redesign vừa phải + **P0 sửa auth mock** |
| **Quên mật khẩu** | `src/pages/auth/ForgotPassword.jsx` (684) | UX 3 bước rõ ràng, 6 ô OTP bàn phím mượt nhất hệ thống. Chỉ nên tách component OTP riêng để tái sử dụng cho gọn code. | Giữ nguyên |
| **Chọn vai trò** | `src/features/caregiver/pages/ChooseRole.jsx` (609) | Trình bày 2 lựa chọn (Điều dưỡng chuyên nghiệp vs Sinh viên Y khoa) khá ổn nhưng chữ mô tả điều kiện hồ sơ dài, nên chuyển sang checklist bullet ngắn 3 gạch đầu dòng mỗi card để quét trong 3 giây. | Chỉnh nhẹ |

### 2.3. Khu vực Family — Khách hàng / Gia đình (14 trang + 12 component/modal)

| Trang / Component | File (Số dòng) | Đánh giá hiện trạng & Điểm nghẽn UX | Mức độ chỉnh |
| :--- | :--- | :--- | :--- |
| **Tổng quan Gia đình** | `src/features/family/pages/Dashboard.jsx` (655) | Bị chia sự chú ý bởi nhiều thẻ hành động nhanh + banner + lịch sắp tới + báo cáo gần đây. Người dùng mới (chưa có người thân, chưa đặt ca) chưa thấy **3 bước Onboarding rõ ràng** (1. Thêm người thân -> 2. Chọn điều dưỡng -> 3. Theo dõi ca). | Redesign vừa phải |
| **Danh mục Dịch vụ** | `src/features/family/pages/Services.jsx` (523) | Hiển thị danh mục dịch vụ y tế tốt, mở `ServiceDetailModal.jsx` (215 dòng) xem mô tả. Nên làm rõ sự khác biệt giữa **"Xem gói tham khảo"** vs **"Đặt lịch thực tế theo đơn giá của từng điều dưỡng"** để khách không hiểu nhầm giá cố định. | Chỉnh nhẹ |
| **Tìm Điều dưỡng** | `src/features/family/pages/CaregiverList.jsx` (1.104) + `CaregiverFilterSidebar.jsx` (244) + `CaregiverCard.jsx` (354) | Sidebar lọc + grid card chuẩn marketplace nhưng 1.104 dòng gộp cả logic normalize dữ liệu và UI; `CaregiverCard.jsx` gắn nhiều badge (xác thực, khoảng cách, sao, giá, chuyên môn) nên mặt card hơi chật trên màn hình laptop 1366px. | Redesign vừa phải |
| **Hồ sơ Điều dưỡng** | `src/features/family/pages/CaregiverProfile.jsx` (865) | Rất nhiều section dài (giới thiệu, chứng chỉ, kinh nghiệm làm việc, đánh giá, dịch vụ & giá). **Lưu ý BE:** BE chưa có API trả CV chi tiết/chứng chỉ/kinh nghiệm (`NurseSearchItemResponse` chỉ có thông tin cơ bản + `services` + reviews). Phải **giữ lại** các block UI/mock CV này theo đúng yêu cầu user, nhưng **dán nhãn trung thực** (ví dụ: *"Hồ sơ năng lực mẫu / đang đồng bộ"* khi API trả rỗng) và gom thành **Tabs** (`Giới thiệu & Năng lực` / `Bảng giá dịch vụ` / `Đánh giá`) thay vì cuộn dài. | Redesign vừa phải (dùng Tabs, giữ mock chưa có API) |
| **Modal Đặt lịch** | `src/features/family/components/DirectBookingModal.jsx` (1.758) | **Điểm nghẽn UX #1 của Family.** Gồm 1.758 dòng trong 1 modal duy nhất: chọn người thân + địa chỉ + nhiều dịch vụ + tăng giảm số lượng + ngày + ma trận slot 30 phút + giờ có mặt + ghi chú + popup đồng ý quyền riêng tư y tế. Người lớn tuổi hoặc người mới rất dễ bỏ dở giữa chừng. | **Redesign lớn (tách Stepper 3 bước)** |
| **Thanh toán PayOS** | `src/features/family/pages/Checkout.jsx` (1.138) | Nhìn tin cậy (VietQR, bank transfer, ATM, ví điện tử) nhưng **hiển thị tới 4 lựa chọn phương thức thanh toán tạo cảm giác tách cổng**, thực tế BE dùng chung cổng PayOS! Nên gọn lại thành 1 luồng **Thanh toán an toàn qua PayOS (VietQR / Chuyển khoản / Thẻ)** + tóm tắt rõ Phí dịch vụ + Phí nền tảng 60.000đ + Timer giữ chỗ 30 phút. | Redesign vừa phải |
| **Kết quả Thanh toán** | `src/features/family/pages/PaymentResult.jsx` (529) | Trạng thái Thành công / Hủy / Chờ xác minh rõ ràng, có nút về Lịch hẹn. Chỉnh nhẹ icon & wording cho bớt chữ phụ. | Chỉnh nhẹ |
| **Lịch hẹn của tôi** | `src/features/family/pages/Appointments.jsx` (1.837) | File 1.837 dòng, mỗi card lịch hẹn quá dày thông tin (badges chồng badges, nhiều nút điều kiện như Thanh toán ngay / Đếm ngược 30p / Xem hồ sơ sức khỏe / Đánh giá / Khiếu nại / Hủy ca). Thiếu một **Banner "Cần xử lý ngay"** trên đầu danh sách (ví dụ ca sắp hết hạn giữ chỗ PayOS). | **Redesign lớn** |
| **Tin nhắn (2 trang trùng!)** | `src/features/family/pages/Chat.jsx` (924) & `src/features/family/pages/DashboardMessages.jsx` (929) | **Vấn đề kiến trúc lớn:** Family tồn tại 2 UI chat khác hẳn nhau (`/chat` dùng `Chat.jsx` + `BookingSummary.jsx` 618 dòng; còn `/dashboard/messages` và `/dashboard/chat` dùng `DashboardMessages.jsx` có smart emoji chips `🩺 💊 🩹 🥣`). Ngoài ra `Chat.jsx` tự vẽ 8 SVG inline (`safetyCommitments` + `defaultIcons`). | **Redesign lớn (Hợp nhất 1 trải nghiệm Chat + Proposal Card)** |
| **Hồ sơ Người thân** | `src/features/family/pages/Relatives.jsx` (487) + `RelativeModals.jsx` (348) | Tương đối gọn, CRUD rõ ràng. Chỉ cần thay fallback Unsplash (`Relatives.jsx:49-50,338`) bằng avatar SVG theo giới tính/tuổi, giữ cấu trúc chính. | Chỉnh nhẹ |
| **Báo cáo Sức khỏe** | `src/features/family/pages/HealthReports.jsx` (683) + `ViewHealthRecordModal.jsx` (344) | Note: `HealthRecords.jsx` là file stub 1 dòng (`export { default } from "./HealthReports"`). Khi API chưa có ca hoàn tất có báo cáo, nên tách rõ nút **"Xem báo cáo mẫu"** thay vì trộn ngầm dữ liệu mẫu (`HealthReports.jsx:171-245` còn hardcode ảnh Unsplash). | Chỉnh nhẹ |
| **Ví Gia đình** | `src/features/family/pages/Wallet.jsx` (948) | **Lưu ý BE & Chính sách B+:** BE hiện **không có API Ví Family**, trong khi `Wallet.jsx:56-63` khởi tạo số dư `110000` trong `localStorage` và giao diện modal rút tiền mock. Theo yêu cầu giữ mock chưa có API của user + hướng B+: **giữ lại giao diện Ví/Lịch sử giao dịch PayOS + Yêu cầu hoàn tiền làm khung minh họa**, nhưng **xóa/ẩn số dư 110k giả** hoặc gắn nhãn rõ `"Dữ liệu minh họa · Thanh toán thực tế qua PayOS"`, tuyệt đối không cho tạo kỳ vọng thanh toán trừ ví giả. | Redesign vừa phải (giữ khung an toàn, bỏ số dư giả gây hiểu nhầm) |
| **Đánh giá Điều dưỡng** | `src/features/family/pages/Review.jsx` (661) + `Rating.jsx` (101) | Gọn, dễ dùng, hiển thị sao + nhận xét. Chỉ thay ảnh lỗi Unsplash (`Review.jsx:399`). | Giữ nguyên |
| **Hồ sơ Tài khoản** | `src/features/family/pages/FamilyProfile.jsx` (1.401) | Dài 1.401 dòng vì gộp 4 khối (Thông tin cá nhân, Liên hệ khẩn cấp, Sổ địa chỉ, Đổi mật khẩu/Đăng xuất tất cả). `getAddressLabelBadge` dùng emoji (`🏠`, `🏡`, `🏢`, `📍`). Nên tách thành Tab/Accordion rõ ràng. | Redesign vừa phải |

### 2.4. Khu vực Caregiver — Điều dưỡng (10 trang + 7 component/modal)

| Trang / Component | File (Số dòng) | Đánh giá hiện trạng & Điểm nghẽn UX | Mức độ chỉnh |
| :--- | :--- | :--- | :--- |
| **Dashboard Điều dưỡng** | `src/features/caregiver/pages/CaregiverDashboard.jsx` (763) | Nhồi cả banner xác minh, 4 StatCard, danh sách ca chờ nhận, lịch hôm nay và hướng dẫn (`CaregiverGuideModal.jsx` 464 dòng). Nút ở dòng `83, 91` còn dùng text `✓` / `✕` thay vì icon thống nhất. Nên đưa **"Hồ sơ chờ xác minh / Ca cần nhận gấp"** làm điểm nhấn duy nhất phía trên. | Redesign vừa phải |
| **Xác minh Hồ sơ** | `src/features/caregiver/pages/Verification.jsx` (2.456) + `VerificationStepper.jsx` (161) | **File lớn nhất dự án (2.456 dòng).** 5 bước xác minh đầy đủ cho cả Điều dưỡng & Sinh viên Y khoa, nhưng code gộp hết vào 1 component khổng lồ; các bước upload nhiều file cùng lúc gây choáng trên mobile. | **Redesign lớn (chia 5 sub-component, rút gọn field thừa)** |
| **Bảng giá Dịch vụ** | `src/features/caregiver/pages/CaregiverPricing.jsx` (754) | Cho phép cấu hình giá từng dịch vụ điều dưỡng cung cấp — chức năng rất thiết thực, nhưng cần cảnh báo trực quan hơn khi đặt giá quá cao/thấp hoặc khi tắt dịch vụ có thể ảnh hưởng đề xuất giá. | Chỉnh nhẹ |
| **Lịch làm việc** | `src/features/caregiver/pages/CaregiverSchedule.jsx` (1.054) | Lưới 30 phút kéo dài theo chiều dọc gây mỏi mắt và khó chọn hàng loạt trên mobile; cần gom khối trực quan theo **Sáng / Chiều / Tối** hoặc lưới 1 giờ cho phép kéo/chọn nhanh theo buổi. | **Redesign lớn** |
| **Yêu cầu Đặt lịch** | `src/features/caregiver/pages/CaregiverBookingRequests.jsx` (918) + `RejectBookingModal.jsx` (223) + `SubmitHealthRecordModal.jsx` (574) | Rất giống `Appointments.jsx` ở chỗ 1 card chứa quá nhiều chi tiết + hành động (`Bắt đầu ca`, `Nộp báo cáo sức khỏe`, `Xem báo cáo`, `Từ chối`). Cần tách Tab + thanh tóm tắt nhanh (Ai? Ở đâu? Mấy giờ? Bao nhiêu tiền thực nhận?) ra mặt trước, chi tiết bệnh án vào Drawer. | **Redesign lớn** |
| **Tin nhắn Điều dưỡng** | `src/features/caregiver/pages/CaregiverMessages.jsx` (1.195) + `CaregiverChatThread.jsx` (410) + `CaregiverBookingDetailPanel.jsx` (797) | Tốt hơn Family Chat nhờ đã tách 2 component con và giữ được luồng đề xuất ca + câu trả lời nhanh. Tuy nhiên panel chi tiết (`797 dòng`) khi mở trên màn hình nhỏ khá chật; dòng `37` vẫn còn biến `mockOtherConversations = []` dư thừa từ demo store (`chatDemoStore.js`). | Redesign vừa phải |
| **Ví & Thu nhập** | `src/features/caregiver/pages/CaregiverWallet.jsx` (681) | **Bug nghiêm trọng dòng `31-32`:** `payoutForm` khởi tạo sẵn `accountNumber: "1018992345"` và `accountHolder: "NGUYEN THUY LINH"` cứng! Điều dưỡng khác đăng nhập mà bấm rút tiền không để ý sẽ chuyển nhầm thông tin mẫu. Phải rỗng hoặc lấy từ `wallet.bankAccount` trả về từ API. Hỗ trợ hiển thị số dư âm (phạt/bù trừ) đã có, cần chú thích màu đỏ dịu dễ hiểu lý do âm. | Redesign vừa phải (**P0 xóa STK hardcode**) |
| **Đánh giá nhận được** | `src/features/caregiver/pages/CaregiverReview.jsx` (1.075) | Layout đọc review tốt nhưng 1.075 dòng là quá dài cho 1 trang danh sách đánh giá + phân bố sao. | Chỉnh nhẹ |
| **Hồ sơ Điều dưỡng** | `src/features/caregiver/pages/CaregiverProfilePage.jsx` (1.070) | Note: `CaregiverProfile.jsx` là stub 1 dòng. Trang 1.070 dòng gộp form thông tin cá nhân + bán kính phục vụ + quận huyện + modal đổi mật khẩu + modal xem giấy tờ xác minh. Dòng `401` fallback Unsplash. Nên chia Tab giống Family Profile. | Redesign vừa phải |

### 2.5. Khu vực Admin — Quản trị viên (9 trang + 4 modal)

| Trang / Component | File (Số dòng) | Đánh giá hiện trạng & Điểm nghẽn UX | Mức độ chỉnh |
| :--- | :--- | :--- | :--- |
| **Tổng quan Admin** | `src/features/admin/pages/AdminDashboard.jsx` (517) | Đã nối API `getDashboardSummary`, `getNurseVerifications`, `getServices`, `getAllBookings`. Tuy nhiên ở dòng `44`, `adminApi.getRevenueMetrics({ range: timeRange })` gọi API nhưng **bỏ trống `.then()`**, không cập nhật state biểu đồ/doanh thu theo `timeRange`! | Chỉnh nhẹ (**Sửa dead API fetch**) |
| **Duyệt Điều dưỡng** | `src/features/admin/pages/CaregiverApprovals.jsx` (485) + `ApprovalDetailModal.jsx` (335) | Luồng lọc & mở modal xem ảnh CCCD/chứng chỉ khá rõ ràng. Chỉnh nhẹ bảng hiển thị cột trạng thái, thêm zoom/xoay ảnh giấy tờ khi duyệt nhanh. | Chỉnh nhẹ |
| **Quản lý Người dùng** | `src/features/admin/pages/UserManagement.jsx` (468) | **Lưu ý BE:** Backend **chưa có API** lấy danh sách User / khóa-mở khóa tài khoản. Toàn bộ bảng hiện tại là dữ liệu mẫu nội bộ. Theo yêu cầu user: **chừa lại UI này để sẵn sàng ghép BE sau**, nhưng phải thêm **Banner thông báo rõ: "Chế độ xem trước — Chưa kết nối API quản lý User"** và không để nhầm là dữ liệu production thật. | Chỉnh nhẹ (gắn nhãn rõ, giữ mock theo yêu cầu) |
| **Quản lý Lịch hẹn** | `src/features/admin/pages/AdminAppointments.jsx` (425) + `AppointmentDetailModal.jsx` (894) | Danh sách sạch, modal chi tiết 894 dòng có thể gọn lại bằng Tabs (`Thông tin ca` / `Thanh toán & Phí 60k` / `Hồ sơ sức khỏe`). | Redesign vừa phải |
| **Quản lý Dịch vụ** | `src/features/admin/pages/AdminServices.jsx` (953) + `ServiceFormModal.jsx` (385) | Note: `ServiceManagement.jsx` là stub 3 dòng trỏ về `AdminServices`. Đã nối `adminApi.getServices()` nhưng còn mảng `initialServices` khá dài làm fallback; form thêm/sửa dịch vụ ổn, chỉ cần gọn badge. | Chỉnh nhẹ |
| **Tài chính & Rút tiền** | `src/features/admin/pages/AdminFinance.jsx` (1.028) | **Bug nghiêm trọng dòng `373`:** `const [transactions] = useState(initialTransactions);` — **KHÔNG CÓ `setTransactions`!** Vì vậy phần `fetchFinancialData` từ dòng 400 trở đi dù tính `realTxs` cũng không thể gọi setter (hoặc đang bỏ sót cập nhật transactions thật), khiến tab Giao dịch luôn kẹt trong `initialTransactions` mock cũ! Cần kiểm tra và nối `setTransactions(realTxs)` ngay ở nhánh sửa lỗi dữ liệu thật. | Redesign vừa phải (**P0 sửa bug thiếu `setTransactions`**) |
| **Xử lý Khiếu nại** | `src/features/admin/pages/AdminDisputes.jsx` (771) | Đã bỏ `MOCK_DISPUTES` và tách rõ badge `"Đã duyệt hoàn · Chờ chuyển khoản"`. Cần thêm bộ lọc nhanh `"Chờ xử lý"` ưu tiên đầu trang và gọn phần modal xử lý. | Chỉnh nhẹ |
| **Quản lý Cẩm nang** | `src/features/admin/pages/AdminHandbook.jsx` (910) + `HandbookModals.jsx` (578) | Chức năng tạo/sửa bài viết đầy đủ, nhưng form soạn bài có nhiều trường lồng nhau + fallback Unsplash (`HandbookModals.jsx:35,60,265,274`). | Chỉnh nhẹ |
| **Thống kê Điều dưỡng** | `src/features/admin/pages/AdminNurseStatistics.jsx` (601) | Bảng thống kê sạch, có Drawer xem chi tiết `bookings` & `transactions` theo từng điều dưỡng (kể cả ví âm). Chỉ cần thu gọn filter ngày tháng trên thanh ngang. | Chỉnh nhẹ |

### 2.6. Layouts, Header, Footer, Shared Modals & Files Dư/Stub

| Thành phần | File (Số dòng) | Vấn đề cụ thể |
| :--- | :--- | :--- |
| **Header chung** | `src/components/Header.jsx` (509) | Dài 509 dòng, chứa nhiều URL Unsplash fallback (`lines 98-106, 223, 255, 458`) và SVG inline; ở chế độ chưa đăng nhập và đã đăng nhập cần gọn lại tối đa 5 link cấp 1. |
| **Footer chung** | `src/components/Footer.jsx` (137) | Tốt, gọn, nhưng cần kiểm tra đồng nhất route liên kết (`/terms`, `/privacy`, `/handbook`) và màu với bản nâng cấp. |
| **Layout Family** | `src/layouts/DashboardLayout.jsx` (406) | Còn avatar Unsplash fallback cứng ở dòng `279, 329`; thanh nav cần làm nổi bật badge thông báo/tin nhắn thật thay vì dàn đều. |
| **Layout Caregiver** | `src/layouts/CaregiverLayout.jsx` (614) | Dòng `342` fallback Unsplash; sidebar 7-8 mục + banner trạng thái duyệt hồ sơ có thể làm gọn thanh lịch hơn. |
| **Layout Admin** | `src/layouts/AdminLayout.jsx` (519) | 8 mục sidebar liệt kê thẳng hàng, nhiều nhãn dài xuống dòng hẹp. Cần gom thành **3 nhóm tiêu đề nhỏ**: *Vận hành*, *Tài chính & Rủi ro*, *Hệ thống*. |
| **Chuông Thông báo** | `src/features/shared/notifications/NotificationDropdown.jsx` (345) | **Bug JS tiềm ẩn dòng `26` & `173`:** Khai báo `const [isDemoMode] = useState(false);` (thiếu `setIsDemoMode`), nhưng dòng `173` lại gọi `setIsDemoMode((prev) => !prev)` -> sẽ văng `ReferenceError` nếu hàm `handleToggleDemoMode` được kích hoạt! |
| **Modal Khiếu nại** | `src/features/family/components/CreateDisputeModal.jsx` (362) | **2 Bug nghiêm trọng:** (1) Dòng `41-43` tự động nhét sẵn 1 ảnh Unsplash mẫu vào `evidenceFiles` ngay khi mở modal (người dùng gửi khiếu nại không đính kèm ảnh sẽ gửi nhầm ảnh mẫu lên BE!); (2) Dòng `118-134` khi API trả lỗi HTTP 5xx/ERR_NETWORK vẫn gọi `onSubmitSuccess(fallbackDto)` và đóng modal, báo **thành công giả**! |
| **4 File Stub 1-3 dòng** | `ServiceManagement.jsx` (3), `HealthRecordModal.jsx` (1), `CaregiverProfile.jsx` [caregiver] (1), `HealthRecords.jsx` (1) | Re-export thừa dễ gây nhầm file khi đọc/maintain. Nên dọn dần khi refactor route/import (trừ khi giữ alias tạm). |

---

## 3. BẢNG TỔNG HỢP VẤN ĐỀ KÈM BẰNG CHỨNG CODE

| Mã | Mức độ | Khu vực / File & Dòng | Bằng chứng kỹ thuật đo từ code |
| :--- | :--- | :--- | :--- |
| **UX-001** | **Critical** | `src/features/family/components/DirectBookingModal.jsx` (1.758 dòng) | 1 modal duy nhất nhồi 7 loại input (người thân, địa chỉ, combo dịch vụ, số lượng, ngày, lưới slot 30p, giờ đến + ghi chú + modal xác nhận y tế). |
| **UX-002** | **Critical** | `src/features/caregiver/pages/Verification.jsx` (2.456 dòng) | File UI lớn nhất dự án; 5 bước đều viết chung 1 component khổng lồ, form upload nhiều giấy tờ dễ quá tải trên màn hình nhỏ. |
| **UX-003** | **High** | `src/features/family/pages/Chat.jsx` (924) & `DashboardMessages.jsx` (929) | 2 giao diện chat khác nhau cho cùng 1 role Family (`/chat` vs `/dashboard/messages`), `Chat.jsx` tự vẽ SVG inline, `DashboardMessages` dùng emoji chips. |
| **UX-004** | **Critical (Bug)** | `src/features/caregiver/pages/CaregiverWallet.jsx:31-32` | `payoutForm` hardcode sẵn STK `"1018992345"` và tên `"NGUYEN THUY LINH"`. |
| **UX-005** | **Critical (Bug)** | `src/features/admin/pages/AdminFinance.jsx:373` | `const [transactions] = useState(initialTransactions)` thiếu setter `setTransactions`, khóa dữ liệu giao dịch thật. |
| **UX-006** | **Critical (Bug)** | `src/features/family/components/CreateDisputeModal.jsx:41-43,118-134` | Pre-fill ảnh Unsplash vào bằng chứng khiếu nại và báo thành công giả (`onSubmitSuccess(fallbackDto)`) khi API lỗi 5xx. |
| **UX-007** | **Critical (Bug)** | `src/pages/auth/Login.jsx:291` & `Register.jsx:529,631,707` | Sinh `mock_google_token_*` / `mock_reg_token_*` cho phép đăng nhập giả khi Google SDK / flow gặp sự cố. |
| **UX-008** | **High (Bug)** | `src/features/shared/notifications/NotificationDropdown.jsx:26,173` | Gọi `setIsDemoMode` nhưng không khai báo setter ở `useState`. |
| **UX-009** | **High** | `src/features/admin/pages/AdminDashboard.jsx:44` | Gọi `adminApi.getRevenueMetrics({ range: timeRange })` nhưng không lưu kết quả vào state nào. |
| **UX-010** | **High** | `src/features/family/pages/Wallet.jsx:56-63` | BE chưa có API Ví Family; FE tự khởi tạo số dư `110000` trong `localStorage`, dễ gây hiểu lầm có ví thật ngoài PayOS. |
| **UX-011** | **High** | `src/features/family/pages/Appointments.jsx` (1.837) & `CaregiverBookingRequests.jsx` (918) | Card lịch hẹn dày đặc badge và action; thiếu Banner *"Việc cần làm ngay"* trên cùng. |
| **UX-012** | **High** | Toàn cục bảng màu (`ForFamily`, `ForCaregiver`, `MedicalHandbook`, `Register` vs phần còn lại) | 2 bảng màu nền không thống nhất (`#00677c`/`#f8fafc` vs `#F7F6F2`/`#187d74` vs `#4d4233`). |
| **UX-013** | **High** | `src/features/family/pages/Checkout.jsx` (1.138 dòng) | Bày 4 thẻ phương thức thanh toán độc lập (`paymentMethods:6-65`) trong khi luồng BE đi qua 1 cổng PayOS duy nhất. |
| **UX-014** | **Medium** | `src/features/caregiver/pages/CaregiverSchedule.jsx` (1.054 dòng) | Ma trận lưới theo bước 30 phút kéo dài, khó thao tác nhanh trên điện thoại. |
| **UX-015** | **Medium** | `src/layouts/AdminLayout.jsx` (519 dòng) | Menu 8 mục dàn phẳng không chia cụm chức năng. |
| **UX-016** | **Medium** | **25 file `.jsx`** + `public/images/*` | Lệch hệ asset: 25 file gọi URL ngoài `images.unsplash.com`, `public/images/` còn 3 ảnh `istockphoto-*.jpg`. |
| **UX-017** | **Medium** | Toàn cục Icon (47 file Lucide / 44 file inline SVG / 3+ file trộn emoji) | Hệ thống icon phân mảnh (`Checkout.jsx`, `Chat.jsx`, `Register.jsx`, `PrivacyPolicy.jsx`, `FamilyProfile.jsx`). |
| **UX-018** | **Medium (A11y)** | Scan toàn bộ `src/*.jsx` | **17 vị trí dùng `outline-none`** không kèm `focus:`/`focus-visible:`; **494 `<button>` nhưng chỉ có 36 `aria-label`** (nhiều nút chỉ có icon như chuông, đóng modal `X`, xóa không có nhãn đọc màn hình). |
| **UX-019** | **Medium (Perf)** | `src/App.jsx` & kết quả `npm run build` | Toàn bộ 40+ pages import tĩnh (không `React.lazy`), tạo 1 chunk JS đơn **1.890,68 kB** (gzip 436,14 kB). |
| **UX-020** | **Low** | 4 file stub 1-3 dòng | `ServiceManagement.jsx`, `HealthRecordModal.jsx`, `CaregiverProfile.jsx` (caregiver), `HealthRecords.jsx` dư thừa. |

---

## 4. ĐÁNH GIÁ USER FLOW & SỐ BƯỚC THAO TÁC

### 4.1. Luồng Family: Tìm điều dưỡng -> Đặt ca -> Thanh toán -> Hậu chăm sóc
- **Hiện tại:** `Home / Dashboard` -> `CaregiverList` (lọc nhiều tiêu chí) -> `CaregiverProfile` (cuộn rất dài) -> `DirectBookingModal` (dồn ~7 cụm nhập liệu + 1 popup xác nhận quyền riêng tư y tế) -> `Checkout` (chọn lại 1 trong 4 thẻ cổng) -> PayOS -> `PaymentResult` -> `Appointments` -> `Review` / `CreateDisputeModal`.  
  *(Tổng: ~7 màn hình, riêng bước cấu hình ca trong Modal đòi hỏi ~12-15 lần chạm/chọn trên 1 mặt phẳng).*
- **Đề xuất:** Rút gọn `CaregiverProfile` thành 3 Tab; biến `DirectBookingModal` thành **Stepper 3 bước rõ ràng** (1. Ai & Ở đâu? -> 2. Chọn dịch vụ & Khung giờ -> 3. Kiểm tra giá + Đồng ý & Thanh toán PayOS); gộp `Checkout` thành 1 nút xác nhận cổng PayOS duy nhất (giữ được số bước nhận thức tối thiểu, giảm ~40% quyết định thừa).

### 4.2. Luồng Điều dưỡng: Đăng ký -> Xác minh -> Thiết lập giá & lịch -> Nhận ca
- **Hiện tại:** `Register` (2 bước) -> `ChooseRole` -> `Verification` (5 bước, 2.456 dòng, upload nhiều giấy tờ cùng lúc) -> `CaregiverDashboard` -> `CaregiverPricing` & `CaregiverSchedule` (phải tự nhớ sang 2 trang riêng để mở lịch & giá sau khi duyệt!) -> `CaregiverBookingRequests`.
- **Đề xuất:** Thêm **Onboarding Checklist 3 việc trên `CaregiverDashboard`** (*1. Xác minh hồ sơ -> 2. Bật bảng giá dịch vụ -> 3. Mở khung giờ rảnh*), liên kết trực tiếp 1 chạm tới đúng phần cần cài.

### 4.3. Luồng Admin: Kiểm tra hằng ngày -> Duyệt / Tài chính / Khiếu nại
- **Hiện tại:** `AdminDashboard` -> dò từng mục trong 8 link phẳng trên `AdminLayout` (`CaregiverApprovals`, `AdminFinance`, `AdminDisputes`, `AdminAppointments`, `AdminNurseStatistics`, `AdminServices`, `AdminHandbook`, `UserManagement`).
- **Đề xuất:** `AdminDashboard` đặt khối **"Hàng đợi cần duyệt hôm nay"** (Hồ sơ chờ duyệt, Yêu cầu rút tiền chờ chi, Khiếu nại chờ xử lý) với link nhảy thẳng tới tab `pending` của từng trang; Sidebar chia 3 nhóm rõ ràng.

---

## 5. DANH SÁCH THÀNH PHẦN NÊN BỎ / GIỮ / THAY THẾ / SẮP XẾP LẠI

*(Phân tách rõ phần Mock giữ lại theo yêu cầu của bạn vs phần Bug/Mock có API phải sửa)*

| Nhóm hành động | Thành phần cụ thể | Lý do & Định hướng |
| :--- | :--- | :--- |
| **GIỮ LẠI — MOCK DO BE CHƯA CÓ API (Gắn nhãn minh họa rõ)** | 1. Dữ liệu bảng `UserManagement.jsx`<br>2. Các block CV/chứng chỉ/kinh nghiệm mở rộng ở `CaregiverProfile.jsx`<br>3. Khung lịch sử/UI xem trước của `Wallet.jsx` (Family)<br>4. Khối Điều dưỡng nổi bật ở `Home.jsx`<br>5. Nút/chế độ xem mẫu ở `HealthReports.jsx` & `Handbook` fallback | BE hiện chưa có Endpoint tương ứng (`UserController`, `CustomerWallet`, `NursePublicCV`, `FeaturedNurses`). Giữ lại để minh họa cho đồ án & làm khung sẵn cho sprint BE tiếp theo, nhưng **bắt buộc dán badge `"Dữ liệu mẫu / Xem trước"`** để không gây hiểu lầm hoặc sai lệch số liệu thật. |
| **BỎ / SỬA TRIỆT ĐỂ (LỖI & MOCK CHỒNG LÊN API THẬT)** | 1. STK hardcode `"1018992345" / "NGUYEN THUY LINH"` (`CaregiverWallet.jsx`)<br>2. Số dư `110000` mặc định (`Wallet.jsx` Family)<br>3. Ảnh Unsplash tự động đính kèm trong `CreateDisputeModal.jsx:42` & nhánh báo thành công giả khi HTTP 500<br>4. `mock_google_token_` / `mock_reg_token_` trong `Login.jsx` & `Register.jsx`<br>5. Thiếu `setTransactions` ở `AdminFinance.jsx:373`<br>6. Lỗi `setIsDemoMode` ở `NotificationDropdown.jsx:173`<br>7. 4 file stub 1-3 dòng (`ServiceManagement.jsx`, `HealthRecordModal.jsx`, `CaregiverProfile.jsx`, `HealthRecords.jsx`)<br>8. Biến rỗng `mockOtherConversations = []` & emoji cứng trong JSX | Sửa bug chạy sai dữ liệu thật, chấm dứt rủi ro chuyển khoản nhầm, báo thành công giả, bypass đăng nhập và rác codebase. |
| **THAY THẾ** | 1. Toàn bộ 44 file tự viết `<svg>` inline & emoji UI -> dùng chuẩn `lucide-react`<br>2. 25 chỗ gọi URL `images.unsplash.com` + 3 ảnh `istockphoto` -> dùng asset cục bộ trong `public/images/` (SVG avatar mặc định sạch theo role)<br>3. 4 thẻ thanh toán tách rời ở `Checkout.jsx` -> 1 khối PayOS thống nhất | Đồng nhất thương hiệu, hết phụ thuộc mạng ngoài để ảnh không bao giờ vỡ, trung thực với cổng PayOS của BE. |
| **SẮP XẾP LẠI** | 1. Hợp nhất `Chat.jsx` và `DashboardMessages.jsx` thành 1 module Chat chuẩn cho Family<br>2. Chia `DirectBookingModal` (1.758 dòng) thành 3 bước ngắn<br>3. Chia `Verification` (2.456 dòng) thành 5 sub-component theo bước<br>4. Gom Sidebar `AdminLayout` thành 3 cụm<br>5. Chuyển `CaregiverProfile` & `FamilyProfile` sang Tabs | Giảm 50% tải nhận thức cho người mới dùng, dễ maintain & review code. |

---

## 6. ĐỀ XUẤT BỐ CỤC MỚI CHO CÁC TRANG TRỌNG ĐIỂM (WIREFRAME)

### 6.1. `DirectBookingModal.jsx` (Tách thành Stepper 3 bước gọn nhẹ)
```text
+-------------------------------------------------------------------+
| Đặt lịch với ĐD [Tên] · [Đánh giá]                        [X Đóng] |
| (1) Ai & Ở đâu ────── (2) Dịch vụ & Giờ ────── (3) Xác nhận PayOS |
+-------------------------------------------------------------------+
| [Bước 1] Chọn người thân (Radio Cards 1 chạm) + [+ Thêm mới]      |
|          Chọn địa chỉ chăm sóc (Radio Cards) + [+ Thêm địa chỉ]   |
|-------------------------------------------------------------------|
| [Bước 2] Dịch vụ của ĐD (Checkbox + số lượng)                     |
|          Chọn Ngày -> Gợi ý Khung giờ trống (Sáng / Chiều / Tối)  |
|          Giờ có mặt mong muốn + Ghi chú ngắn cho ĐD               |
|-------------------------------------------------------------------|
| [Bước 3] Tóm tắt ca · Phí dịch vụ + Phí nền tảng 60.000đ          |
|          [x] Đồng ý chia sẻ hồ sơ sức khỏe cho ca này             |
|          [ Quay lại ]               [ Tạo lịch & Thanh toán PayOS ]|
+-------------------------------------------------------------------+
```

### 6.2. `Appointments.jsx` & `CaregiverBookingRequests.jsx` (Card tối giản + Banner Hành động)
```text
+-------------------------------------------------------------------+
| [!] CẦN XỬ LÝ NGAY: Ca #CA-2041 chờ thanh toán — còn 18:42  [Trả] |
+-------------------------------------------------------------------+
| Tabs: [Sắp tới (2)] [Chờ xác nhận (1)] [Hoàn thành] [Đã hủy/Tranh] |
+-------------------------------------------------------------------+
| +---------------------------------------------------------------+ |
| | [Trang thái: Đã tiếp nhận]          14:00 - 16:00 · 15/11     | |
| | ĐD Nguyễn Thị A  ·  Chăm sóc người cao tuổi (Bà Trần Thị B)   | |
| | 📍 Quận 3, TP.HCM                            Tổng: 460.000 đ  | |
| |---------------------------------------------------------------| |
| | [Xem chi tiết] [Nhắn tin]        [Hủy ca] / [Đánh giá / Báo cáo]|
| +---------------------------------------------------------------+ |
+-------------------------------------------------------------------+
```

### 6.3. `Dashboard.jsx` (Family) & `CaregiverDashboard.jsx` (Onboarding + Priority-First)
```text
Family Dashboard:
+-------------------------------------------------------------------+
| Chào [Tên],                                      [+ Tìm Điều dưỡng]|
| [Nếu user mới] Lộ trình 3 bước: (1✓) Người thân -> (2) Tìm ĐD -> (3)|
|-------------------------------------------------------------------|
| CỘT TRÁI (2/3): Ca chăm sóc tiếp theo (1 card nổi bật nhất)       |
|                 Hoạt động / Báo cáo sức khỏe mới nhất (3 dòng)    |
| CỘT PHẢI (1/3): Tóm tắt Người thân (Avatar + tên) · Lối tắt nhanh |
+-------------------------------------------------------------------+

Caregiver Dashboard:
+-------------------------------------------------------------------+
| [Trạng thái tài khoản: Chờ duyệt / Đã duyệt]   [Onboarding 1-2-3] |
|-------------------------------------------------------------------|
| 3 KPI chính (Thu nhập tháng · Số dư ví · Ca tuần này)             |
|-------------------------------------------------------------------|
| HÀNG CHỜ DUYỆT GẤP (Pending Requests) | LỊCH TRỰC HÔM NAY         |
+-------------------------------------------------------------------+
```

### 6.4. Hợp nhất Chat Family (`Chat.jsx` + `DashboardMessages.jsx`)
```text
+--------------------+---------------------------------+------------+
| Hội thoại          | ĐD Nguyễn A · Đang trực tuyến   | Chi tiết   |
| [Tìm kiếm...]      |---------------------------------| ca hiện tại|
| [Tất cả][Có ca]    | [Tin nhắn trao đổi...]          | (Drawer có |
| - ĐD Nguyễn A      | +-----------------------------+ | thể thu    |
| - ĐD Trần B        | | PROPOSAL CA CHĂM SÓC        | | gọn trên   |
|                    | | Ngày/Giờ · Tổng tiền (+60k) | | màn nhỏ)   |
|                    | | [Xác nhận & Thanh toán]     | |            |
|                    | +-----------------------------+ |            |
|                    | [Gợi ý nhanh 2 chip] [Nhập...]  |            |
+--------------------+---------------------------------+------------+
```

### 6.5. Sidebar `AdminLayout.jsx` (Gom 3 cụm thay vì 8 dòng phẳng)
```text
VẬN HÀNH HẰNG NGÀY
  • Tổng quan
  • Duyệt Điều dưỡng [badge]
  • Quản lý Lịch hẹn
TÀI CHÍNH & AN TOÀN
  • Tài chính & Rút tiền [badge]
  • Xử lý Khiếu nại [badge]
  • Thống kê Điều dưỡng
HỆ THỐNG & NỘI DUNG
  • Dịch vụ y tế
  • Cẩm nang y tế
  • Tài khoản (Xem trước)
```

---

## 7. PHÂN LOẠI TOÀN BỘ TRANG THEO 4 MỨC CẢI TẠO

| Mức độ | Danh sách các trang / layout |
| :--- | :--- |
| **1. Giữ nguyên** (Chỉ đồng bộ icon/link nhỏ) | `PrivacyPolicy.jsx`, `ForgotPassword.jsx`, `HandbookDetail.jsx`, `Review.jsx` |
| **2. Chỉnh nhẹ** (Sửa bug/fallback ảnh/nội dung chữ) | `Home.jsx`, `MedicalHandbook.jsx`, `TermsOfService.jsx`, `Login.jsx` *(ui nhẹ + P0 bỏ mock token)*, `ChooseRole.jsx`, `Services.jsx`, `Relatives.jsx`, `HealthReports.jsx`, `PaymentResult.jsx`, `CaregiverPricing.jsx`, `CaregiverReview.jsx`, `AdminDashboard.jsx`, `CaregiverApprovals.jsx`, `UserManagement.jsx`, `AdminServices.jsx`, `AdminDisputes.jsx`, `AdminHandbook.jsx`, `AdminNurseStatistics.jsx`, `Footer.jsx` |
| **3. Redesign vừa phải** (Sắp xếp tab, thu gọn chữ, chuẩn hóa token màu) | `ForFamily.jsx`, `ForCaregiver.jsx`, `Register.jsx`, `Dashboard.jsx`, `CaregiverList.jsx`, `CaregiverProfile.jsx` *(chuyển Tabs)*, `Checkout.jsx` *(gom 1 cổng PayOS)*, `Wallet.jsx` *(giữ khung minh họa an toàn)*, `FamilyProfile.jsx`, `CaregiverDashboard.jsx`, `CaregiverMessages.jsx`, `CaregiverWallet.jsx`, `CaregiverProfilePage.jsx`, `AdminAppointments.jsx`, `AdminFinance.jsx`, `Header.jsx`, `DashboardLayout.jsx`, `CaregiverLayout.jsx`, `AdminLayout.jsx` |
| **4. Redesign lớn** (Tách kiến trúc component & luồng UX) | `DirectBookingModal.jsx` (1.758 dòng -> Stepper 3 bước), `Appointments.jsx` (1.837 dòng), `Chat.jsx` + `DashboardMessages.jsx` (hợp nhất thành 1 Chat), `Verification.jsx` (2.456 dòng -> 5 sub-components), `CaregiverSchedule.jsx`, `CaregiverBookingRequests.jsx` |

---

## 8. ROADMAP TRIỂN KHAI THEO 4 GIAI ĐOẠN (P0 -> P3)

### P0 — Sửa lỗi an toàn dữ liệu, auth & hiển thị sai (Làm trước khi đụng giao diện)
1. Xóa STK hardcode `"1018992345" / "NGUYEN THUY LINH"` ở `CaregiverWallet.jsx:31-32`.
2. Sửa `AdminFinance.jsx:373` thêm `setTransactions` và nạp `realTxs` đúng cách.
3. Sửa `CreateDisputeModal.jsx`: bỏ ảnh Unsplash nhét sẵn ở dòng `42`; không gọi `onSubmitSuccess` báo thành công giả khi API 5xx/ERR_NETWORK (`118-134`).
4. Gỡ `mock_google_token_` và `mock_reg_token_` khỏi `Login.jsx:291` và `Register.jsx:529,631,707`.
5. Sửa `NotificationDropdown.jsx:26` thêm `setIsDemoMode` (hoặc gỡ toggle demo thừa) và nối dữ liệu `getRevenueMetrics` ở `AdminDashboard.jsx:44`.
6. Ở `Wallet.jsx` (Family), bỏ mặc định `110000` `localStorage`, dán nhãn `"Chế độ xem trước — Thanh toán thực tế qua PayOS"`.

### P1 — Chuẩn hóa Design System, Assets & Navigation (Nền tảng toàn app)
1. **Chốt bảng màu duy nhất** (sau khi user chọn Phương án A hoặc B) qua `@theme` / CSS variables trong `src/index.css` và font chữ nhất quán.
2. Thay dần toàn bộ `<svg>` tự vẽ & emoji UI sang `lucide-react`; đưa ảnh mặc định về SVG/local assets trong `public/images/` (loại bỏ 25 file gọi URL Unsplash ngẫu nhiên & 3 ảnh `istockphoto`).
3. Bổ sung `focus-visible:ring-2` cho 17 vị trí `outline-none` và `aria-label` cho nút chỉ có icon.
4. Gom nhóm Sidebar `AdminLayout.jsx` thành 3 cụm; dọn 4 file stub 1-3 dòng; thêm `React.lazy` + `Suspense` trong `src/App.jsx` để giảm chunk JS từ 1,89 MB.

### P2 — Redesign Lớn cho Các Luồng Cốt Lõi (Tác động lớn nhất tới người dùng)
1. `DirectBookingModal.jsx`: Tách thành 3 bước độc lập + component con sạch theo Composition Patterns.
2. Hợp nhất `Chat.jsx` & `DashboardMessages.jsx` cho Family, đồng nhất UI Proposal Card với `CaregiverMessages.jsx`.
3. `Appointments.jsx` & `CaregiverBookingRequests.jsx`: Thiết kế lại thẻ lịch hẹn tối giản + Next Action Banner + Drawer chi tiết.
4. `CaregiverSchedule.jsx`: Tối ưu chọn khung giờ rảnh nhanh theo buổi (Sáng/Chiều/Tối) & responsive mobile.
5. `Verification.jsx`: Tách 5 bước thành 5 module riêng, giữ nguyên DTO upload/submit của BE.

### P3 — Polish & Tối ưu Trải Nghiệm Phụ
1. Chuyển `CaregiverProfile.jsx`, `FamilyProfile.jsx`, `CaregiverProfilePage.jsx` sang bố cục Tabs.
2. Gọn `Checkout.jsx` thành luồng PayOS thống nhất, giữ nguyên đếm ngược 30 phút và breakdown phí sàn 60.000đ.
3. Gọt microcopy dư thừa trên `ForFamily.jsx`, `ForCaregiver.jsx`, `ChooseRole.jsx`, `Dashboard.jsx` (thêm Onboarding 3 bước), `UserManagement.jsx` (gắn banner xem trước rõ ràng).

---

## 9. RỦI RO ẢNH HƯỞNG API/NGHIỆP VỤ & PHẠM VI ĐÃ KIỂM CHỨNG

### 9.1. Rủi ro cần canh chừng khi tiến hành Redesign
| Rủi ro | Điểm dễ gãy nếu sửa vội | Biện pháp phòng tránh |
| :--- | :--- | :--- |
| **Sai lệch hợp đồng đặt ca & đề xuất giá** | `DirectBookingModal.jsx`, `Chat.jsx`, `CreateProposalModal.jsx` gửi `services` + `quantities` + `selectedSlotIndexes` + `requestedArrivalTime`. Note: `CaregiverBookingRequests.jsx:73` đang parse regex `[Giờ yêu cầu có mặt: ...]` từ `customerNotes`. | Giữ nguyên hàm map payload sang `familyApi.createBooking` & `conversationApi.createProposal`; không đổi format chuỗi `[Giờ yêu cầu có mặt: ...]` khi chưa đổi ở BE. |
| **Gãy luồng đồng bộ PayOS 30 phút & Phí sàn 60k** | `Checkout.jsx`, `PaymentResult.jsx`, `Appointments.jsx` đọc `paymentHoldStartedAt`, `paymentHoldExpiresAt`, `carelink_confirmed_paid_bookings`. | Chỉ rút gọn UI 4 thẻ cổng thành 1 khung PayOS, tuyệt đối giữ nguyên các field tính giờ giữ chỗ và không tự tính lại tổng tiền gửi lên BE. |
| **Mất field xác minh 2 phân hệ (Nurse vs Student)** | `Verification.jsx` phân nhánh field & giấy tờ giữa `practitionerType = 1` (Điều dưỡng) và `2` (Sinh viên Y khoa). | Khi tách thành 5 sub-components phải test đủ cả 2 nhánh `Student` và `Nurse`. |
| **Nhầm giữa "xóa mock" và "xóa UI chưa có API"** | `UserManagement.jsx`, `CaregiverProfile.jsx` CV, `Wallet.jsx` Family. | Chỉ xóa mock ở nơi đã có API thật; các màn hình BE chưa hỗ trợ chỉ gắn nhãn trung thực, không xóa layout. |

### 9.2. Phân định trung thực phạm vi đã kiểm chứng
| Hạng mục | Trạng thái | Ghi chú bằng chứng |
| :--- | :--- | :--- |
| Quét toàn bộ 84 tệp `.jsx`, đếm dòng, quét màu Hex, Lucide/SVG, Unsplash/iStock, `alert/confirm/prompt`, accessibility (`outline-none`, `aria-label`), file stub & đối chiếu 23 BE Controller | **ĐÃ KIỂM CHỨNG TRỰC TIẾP** | Xác minh trực tiếp bằng `read_file` và công cụ quét mã nguồn trên workspace `CareLink_FE` & `CareLink_BE`. |
| Build đóng gói Vite (`npm run build`) | **ĐÃ KIỂM CHỨNG TRỰC TIẾP** | Thoát mã `0` (`vite build` 1.46s, chunk JS `1,890.68 kB`). |
| Quan sát giao diện thực tế đang chạy trên trình duyệt cho từng trạng thái đăng nhập (Family / Caregiver / Admin) | **CHƯA KIỂM CHỨNG RUNTIME** | Chưa khởi động dev server mở trình duyệt và đăng nhập 3 role live ở phiên Audit này; toàn bộ đánh giá về mật độ card, overflow màn hình nhỏ và spacing được **suy luận từ mã nguồn JSX/Tailwind thực tế** và cần xác nhận thị giác trên trình duyệt khi bước vào P0/P1. |
