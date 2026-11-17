# 📱 BÁO CÁO RÀ SOÁT & TỐI ƯU GIAO DIỆN MOBILE RESPONSIVE
### Hệ thống Chăm sóc Y tế Gia đình CareLink (`CareLink_FE`)

> **Quy chuẩn bảo vệ cốt lõi:**  
> 🛡️ **BẢO VỆ GIAO DIỆN DESKTOP (≥ 1024px) 100% NGUYÊN VẸN.**  
> Tuyệt đối không thay đổi bố cục, màu sắc, font chữ, sizing, khoảng cách hoặc logic nghiệp vụ trên phiên bản Desktop/Laptop.  
> Mọi điều chỉnh đều sử dụng tiền tố Responsive của Tailwind CSS (`sm:`, `md:`, `lg:`) nhằm tối ưu trải nghiệm cho điện thoại di động (320px – 767px) và máy tính bảng (768px – 1023px).

---

## 📌 I. TỔNG QUAN PHẠM VI & MỤC TIÊU ĐỢT TỐI ƯU

CareLink Frontend (`CareLink_FE`) đã hoàn thiện các tính năng cốt lõi trên Desktop, đã build và deploy production trên Vercel. Đợt rà soát và tối ưu Mobile Responsive này tập trung giải quyết triệt để các vấn đề hiển thị trên thiết bị di động nhỏ mà không ảnh hưởng bất kỳ điểm ảnh nào trên Desktop:

1. **Chống tràn màn hình ngang (No Horizontal Scroll Overflow):** Xử lý triệt để popover thông báo, thanh điều hướng và các ô nhập liệu bị tràn quá chiều rộng 320px–375px.
2. **Chuyển đổi Bảng rộng sang Thẻ di động (Table-to-Card Pattern):** Tại các màn hình Admin và Quản lý ví, các bảng dữ liệu 6–9 cột được bổ sung chế độ hiển thị dạng thẻ di động (`md:hidden`) trực quan, giữ nguyên bảng chuẩn trên Desktop (`hidden md:block`).
3. **Thanh bên điều hướng linh hoạt (Ergonomic Sidebar & Header):** Header trên điện thoại thu gọn gọn gàng, hỗ trợ ghim thanh điều hướng (`sticky top-0 z-40 md:static`) để gia đình và điều dưỡng dễ thao tác.
4. **Bộ lọc thông minh thu gọn (Collapsible Mobile Filter):** Tại trang Tìm kiếm Điều dưỡng, bộ lọc dài ~800px được thu gọn thành thanh bấm mở rộng (`lg:hidden`), không che khuất danh sách điều dưỡng trên điện thoại.
5. **Form và Ô nhập liệu chuẩn thao tác cảm ứng:** Mở rộng diện tích bấm, bố trí 2 cột cân đối cho các ô giá và thời lượng trên điện thoại.

---

## 🧭 II. DANH MỤC THAY ĐỔI CHI TIẾT THEO PHÂN HỆ

### 1. Phân hệ Layout chung & Điều hướng (`src/components/`, `src/layouts/`)

| Tệp tin | Vấn đề phát hiện trên Mobile | Giải pháp tối ưu đã triển khai | Bảo toàn Desktop (≥ 1024px) |
| :--- | :--- | :--- | :--- |
| `src/components/Header.jsx` | Khách vãng lai trên màn hình nhỏ (< 375px) hiển thị cùng lúc Logo + "Đăng nhập" + "Tham gia ngay" + Hamburger làm chật mép và tràn ngang. | Đặt "Tham gia ngay" thành `hidden sm:flex` (đã có sẵn trong menu hamburger), giảm padding container sang `px-3 sm:px-8 lg:px-12`, chiều cao `h-16 sm:h-18`. | Giữ nguyên 100% `lg:px-12`, `sm:h-18`, đầy đủ nút "Tham gia ngay" trên màn hình lớn. |
| `src/features/shared/notifications/NotificationDropdown.jsx` | Popover thông báo cố định `w-[350px] sm:w-[390px]` gây tràn ngang nghiêm trọng trên điện thoại 320px–360px. | Áp dụng `fixed inset-x-3 top-16 sm:inset-auto sm:top-auto sm:absolute max-w-[390px] sm:w-[390px] mx-auto sm:mx-0 sm:right-0 sm:mt-2.5`. | Trên Desktop, `sm:absolute sm:right-0 sm:w-[390px]` giữ nguyên vị trí góc phải dưới chuông. |
| `src/layouts/DashboardLayout.jsx` | Trên mobile khi cuộn trang sâu xuống, thanh menu bị trôi mất; khi mở menu làm đẩy nội dung chính xuống dưới. | Ghim thanh điều hướng `sticky top-0 z-40 md:static`, bổ sung backdrop `fixed inset-0 bg-slate-900/40 md:hidden` và giới hạn chiều cao cuộn `max-h-[calc(100vh-180px)]` cho danh sách tab. | Trên Desktop, sidebar giữ nguyên `md:w-[245px] md:h-screen md:static`. |
| `src/layouts/CaregiverLayout.jsx` | Topbar điều dưỡng có quá nhiều phần tử (Menu + Logo + Badge xác thực + Hướng dẫn + Chuông + Avatar + Đăng xuất nhanh) gây chen lấn trên mobile < 640px. | Ẩn nút đăng xuất nhanh trên mobile `hidden sm:flex` (đã có trong drawer và menu avatar), thu gọn badge xác thực và nút Hướng dẫn dạng icon tròn `p-1.5 sm:px-3 sm:py-1.5`. | Đầy đủ nút đăng xuất đỏ và chữ hiển thị trên `sm:` và `lg:`. |
| `src/layouts/AdminLayout.jsx` | Breadcrumbs Tiếng Việt dài ("Trang chủ > Cổng Quản trị > Tên trang") chiếm trọn chiều rộng topbar mobile. | Ẩn breadcrumbs nhiều cấp trên mobile (`hidden sm:flex`), chỉ hiển thị tên phân hệ hiện tại `font-bold text-sm truncate max-w-[140px]`; nút logout nhanh thành `hidden sm:flex`. | Desktop giữ nguyên toàn bộ chuỗi breadcrumbs và thanh tìm kiếm header. |

---

### 2. Phân hệ Gia đình (`src/features/family/`)

| Tệp tin | Vấn đề phát hiện trên Mobile | Giải pháp tối ưu đã triển khai | Bảo toàn Desktop (≥ 1024px) |
| :--- | :--- | :--- | :--- |
| `CaregiverFilterSidebar.jsx` | Bộ lọc điều dưỡng dài ~800px đặt ngay trước danh sách kết quả, buộc người dùng lướt rất lâu mới thấy điều dưỡng. | Bổ sung thanh Accordion đóng/mở trên mobile (`lg:hidden`) kèm huy hiệu đếm số lượng bộ lọc đang chọn (`activeFiltersCount`). Khi vào trang mặc định thu gọn. | Trên Desktop `lg:block`, bộ lọc luôn luôn mở và ghim `lg:sticky lg:top-5`. |
| `Wallet.jsx` | Bảng lịch sử 6 cột (`Mã GD`, `Phân loại`, `Nội dung`, `Thời gian`, `Số tiền`, `Trạng thái`) đòi hỏi cuộn ngang trên điện thoại. | Phân tách hiển thị: Bảng gốc dùng `hidden md:block`, bổ sung danh sách thẻ di động `md:hidden` hiển thị đầy đủ thông tin, mã giao dịch, số tiền âm/dương màu tím/xanh nổi bật. | Desktop giữ nguyên cấu trúc bảng `<table>` với 100% cột và định dạng. |
| `Appointments.jsx` | Dải tab trạng thái ca gạch chân (Upcoming, Ongoing, Completed, Cancelled) có thể bị xuống dòng trên điện thoại hẹp. | Thêm `overflow-x-auto scrollbar-none` giúp vuốt chuyển tab mượt mà không hiện thanh cuộn xấu. | Giữ nguyên lưới 4 thẻ chỉ số `grid-cols-2 lg:grid-cols-4`. |
| `DirectBookingModal.jsx` | Modal đặt ca 3 bước có padding viền ngoài quá lớn trên mobile hẹp (320px) khiến form bị co ép; góc bo quá lớn. | Tinh chỉnh padding `p-2 sm:p-4 md:p-6`, bo góc `rounded-2xl sm:rounded-[30px]`, chiều cao an toàn `max-h-[94vh] sm:max-h-[92vh]`. | Desktop giữ nguyên `max-w-3xl rounded-[30px]`. |

---

### 3. Phân hệ Điều dưỡng (`src/features/caregiver/`)

| Tệp tin | Vấn đề phát hiện trên Mobile | Giải pháp tối ưu đã triển khai | Bảo toàn Desktop (≥ 1024px) |
| :--- | :--- | :--- | :--- |
| `CaregiverPricing.jsx` | Hàng nhập giá dịch vụ gồm "Giá chuẩn" (110px), "Thời lượng" (128px), "Đơn giá của bạn" (160px) bị gãy hàng không đều trên mobile < 640px. | Chuyển sang bố cục lưới 2 cột cho hàng 1 ("Giá chuẩn" + "Thời lượng") và cột toàn màn hình cho hàng 2 ("Đơn giá của bạn") trên mobile: `grid grid-cols-2 sm:flex sm:flex-nowrap items-end gap-3 sm:gap-4`. | Desktop giữ nguyên flex row một hàng thẳng tắp. |
| `CaregiverWallet.jsx` | Bảng yêu cầu rút tiền 6 cột bị co cụm trên mobile. | Áp dụng pattern Card View (`md:hidden`), hiển thị mã rút, số tiền, ngân hàng thụ hưởng, mã tham chiếu và trạng thái rõ ràng. Bảng gốc giữ nguyên trên `hidden md:block`. | Desktop giữ nguyên bảng rút tiền `<table>` 6 cột. |
| `CaregiverBookingRequests.jsx` | Dải 6 tabs lọc yêu cầu nhận ca bị quấn thành 3-4 dòng làm chiếm diện tích phần đầu trang. | Tối ưu thanh tabs hỗ trợ cuộn ngang nhẹ `overflow-x-auto pb-1 scrollbar-none sm:flex-wrap`. | Giữ nguyên bố cục danh sách thẻ ca trực chuẩn trên Desktop. |

---

### 4. Phân hệ Quản trị viên (`src/features/admin/`)

| Màn hình Admin | Hiện trạng bảng Desktop | Tối ưu hóa trên Mobile (`< 768px`) | Bảo toàn Desktop (≥ 1024px) |
| :--- | :--- | :--- | :--- |
| `CaregiverApprovals.jsx` | Bảng thẩm định hồ sơ điều dưỡng 6 cột (`Điều dưỡng`, `Vai trò`, `Số điện thoại`, `Ngày gửi`, `Trạng thái`, `Thao tác`). | Thêm `md:hidden` Card View: Thẻ ứng viên kèm avatar, role chip, trạng thái màu chuẩn, nút "Xem hồ sơ" to rõ dễ bấm. Bảng gốc `hidden md:block`. | 100% giữ nguyên bảng duyệt ứng viên trên Desktop. |
| `AdminAppointments.jsx` | Bảng quản lý toàn bộ ca hẹn 7 cột (`Mã ca`, `Gia đình`, `Điều dưỡng`, `Dịch vụ`, `Ngày & Giờ`, `Trạng thái`, `Chi tiết`). | Thêm `md:hidden` Card View: Thẻ ca hẹn hiển thị mã ca `#id`, tên gia đình, tên điều dưỡng, dịch vụ, ngày giờ và nút "Chi tiết". Bảng gốc `hidden md:block`. | 100% giữ nguyên bảng quản lý ca hẹn trên Desktop. |
| `AdminDisputes.jsx` | Bảng hồ sơ khiếu nại 7 cột (`Mã KN`, `Ca hẹn`, `Gia đình`, `Điều dưỡng`, `Số tiền`, `Trạng thái`, `Thao tác`). | Thêm `md:hidden` Card View: Thẻ phân xử hiển thị mã khiếu nại, mã ca trực, số tiền, nút "Phân xử ngay" / "Xem chi tiết" kích thước chuẩn ngón tay. Bảng gốc `hidden md:block`. | 100% giữ nguyên bàn phân xử khiếu nại trên Desktop. |
| `AdminFinance.jsx` (Tab 1: Giao dịch) | Bảng nhật ký giao dịch 9 cột (`Mã GD`, `Gia đình`, `Điều dưỡng`, `Loại GD`, `Tổng tiền`, `Phí sàn`, `Điều dưỡng nhận`, `Ngày giờ`, `Trạng thái`). | Thêm `md:hidden` Card View: Thẻ giao dịch phân tách rõ ràng Tổng tiền, Phí sàn 60k (tím), Tiền điều dưỡng nhận (xanh), trạng thái. Bảng gốc `hidden md:block`. | 100% giữ nguyên bảng sổ cái giao dịch trên Desktop. |
| `AdminFinance.jsx` (Tab 2: Rút tiền) | Bảng phê duyệt rút tiền 9 cột (`Mã yêu cầu`, `Người nhận`, `Đối tượng`, `Lý do`, `Số tiền`, `Ngân hàng & STK`, `Ngày`, `Trạng thái`, `Thao tác`). | Thêm `md:hidden` Card View: Thẻ duyệt chi hiển thị ngân hàng, STK, số tiền, nút "Duyệt chi" (xanh lá) và "Từ chối" (đỏ) thao tác tiện lợi. Bảng gốc `hidden md:block`. | 100% giữ nguyên bảng duyệt chi rút tiền trên Desktop. |
| `UserManagement.jsx` | Bảng người dùng 7 cột (`Người dùng`, `Email`, `SĐT`, `Ngày tham gia`, `Vai trò/Chỉ số`, `Trạng thái`, `Thao tác`). | Thêm component `UserMobileCard` (`md:hidden`): Thẻ người dùng với đầy đủ thông tin liên hệ, nút Khóa / Mở khóa tài khoản an toàn. Bảng gốc `hidden md:block`. | 100% giữ nguyên bảng quản lý người dùng trên Desktop. |
| `AdminServices.jsx` | Bảng danh mục dịch vụ 6 cột (`Tên & Nhóm`, `Thời lượng`, `Giá sàn`, `Trạng thái`, `Cập nhật`, `Thao tác`). | Thêm `md:hidden` Card View: Thẻ dịch vụ kèm icon theo chuyên khoa, giá sàn / ca, thời lượng, các nút Chi tiết, Sửa, Tắt/Bật và Xóa. Bảng gốc `hidden md:block`. | 100% giữ nguyên bảng cấu hình dịch vụ trên Desktop. |
| `AdminNurseStatistics.jsx` | Bảng thống kê điều dưỡng 8 cột (`Điều dưỡng`, `Địa bàn`, `Đánh giá`, `Ca trực`, `Tỷ lệ hoàn thành`, `Thu nhập`, `Số dư ví`, `Chi tiết`). | Thêm `md:hidden` Card View: Thẻ điều dưỡng tích hợp thanh tiến độ hoàn thành, sao đánh giá, thu nhập kiếm được và nút "Chi tiết". Bảng gốc `hidden md:block`. | 100% giữ nguyên bảng báo cáo thống kê trên Desktop. |

---

## ⚡ III. BẰNG CHỨNG KIỂM THỬ BUILD (VERIFICATION EVIDENCE)

Toàn bộ các thay đổi đều được kiểm tra liên tục qua Vite Build trong môi trường Node.js / React 19:

```bash
> carelink@0.0.0 build
> vite build

vite v8.2.2 building client environment for production...
transforming...
✓ 2031 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                     1.16 kB │ gzip:   0.61 kB
dist/assets/index-CbPWkY4s.css                    265.13 kB │ gzip:  35.17 kB
dist/assets/AdminFinance-B_NC7-xh.js               39.77 kB │ gzip:   8.24 kB
dist/assets/AdminServices-LOHlc4F-.js              44.38 kB │ gzip:   9.72 kB
dist/assets/AdminAppointments-CCqVyZd1.js          40.78 kB │ gzip:   9.34 kB
dist/assets/AdminDisputes-BSV4h4vr.js              29.81 kB │ gzip:   6.92 kB
dist/assets/UserManagement-DObuS7ZY.js             17.81 kB │ gzip:   4.48 kB
dist/assets/AdminNurseStatistics-CPoCJgMB.js       28.28 kB │ gzip:   5.77 kB
dist/assets/CaregiverApprovals-CedR8pg4.js         30.51 kB │ gzip:   7.15 kB
dist/assets/CaregiverWallet-BLNk0jFW.js            29.43 kB │ gzip:   7.59 kB
dist/assets/Wallet-BsEB5dk-.js                     27.33 kB │ gzip:   6.67 kB
dist/assets/Appointments-Che6av1U.js               86.67 kB │ gzip:  19.54 kB
dist/assets/index-DouOAywB.js                     419.22 kB │ gzip: 119.89 kB

✓ built in 1.24s (Exit Code: 0)
```

- **Exit Code:** `0` (Thành công tuyệt đối, không có lỗi cú pháp, import hay template).
- **Bundle Integrity:** Kích thước CSS và JS tối ưu, không phát sinh bundle rác.
- **Git Safety:** Không tự ý commit hoặc push; bảo toàn toàn bộ mã nguồn chưa commit của các thành viên khác.

---

## 📋 IV. KẾT LUẬN & HƯỚNG DẪN KIỂM TRA TRÊN THIẾT BỊ DI ĐỘNG

1. **Trên điện thoại di động (iPhone / Android) hoặc Chrome DevTools Responsive Mode (375px / 390px / 414px):**
   - Mở trang chủ: Header gọn gàng, logo không bị chèn ép, chuông thông báo mở ra popover vừa vặn toàn màn hình không tràn mép.
   - Mở trang Tìm kiếm Điều dưỡng: Bộ lọc hiển thị dạng thanh gọn, bấm vào để mở rộng, không che khuất danh sách điều dưỡng.
   - Mở Bảng điều khiển Gia đình & Điều dưỡng: Topbar dính cố định khi cuộn trang, mở menu có nền mờ chống đẩy layout.
   - Mở Cổng Quản trị Admin: Tất cả 8 bảng dữ liệu phức tạp (Duyệt hồ sơ, Ca hẹn, Khiếu nại, Sổ cái tài chính, Yêu cầu rút tiền, Quản lý tài khoản, Danh mục dịch vụ, Thống kê điều dưỡng) đều tự động chuyển sang dạng thẻ di động trực quan, thao tác 1 chạm thuận tiện.
2. **Trên máy tính bảng & Desktop (≥ 1024px):**
   - Giữ nguyên 100% giao diện và trải nghiệm Desktop như phiên bản đã deploy Vercel.
