# 🏛️ HỒ SƠ QUYẾT ĐỊNH KIẾN TRÚC (ARCHITECTURE DECISION RECORDS - ADR)
## Dự án: CareLink Frontend (`CareLink_FE`)

> **Mục đích:** Ghi nhận các quyết định kiến trúc quan trọng, lý do lựa chọn, các phương án đã cân nhắc và tác động lâu dài đối với dự án.

---

### 📝 ADR-001: Quản Lý Môi Trường Kết Nối Backend & Cơ Chế Smart Failover
- **Trạng thái:** `Accepted`
- **Ngày quyết định:** 20/10/2026
- **Người đề xuất:** Vy (Lead FE)
- **Bối cảnh:**
  - Nhóm phát triển gồm nhiều thành viên, đôi khi chạy Backend Visual Studio local (`https://localhost:7183`), đôi khi kiểm thử trên môi trường deploy Render Cloud (`https://carelink-be.onrender.com`).
  - Nếu hardcode URL, các thành viên FE thường xuyên gặp lỗi kết nối (màn hình trắng) khi chưa bật Visual Studio Backend.
- **Quyết định:**
  - Triển khai cơ chế trong `src/api/axiosClient.js`:
    1. Ưu tiên biến môi trường `VITE_API_URL` (nếu có).
    2. Hỗ trợ chuyển đổi chủ động qua query string URL: `?api=local` hoặc `?api=render`.
    3. Khi chạy local (`npm run dev`), mặc định trỏ `https://localhost:7183`. Nếu gặp lỗi kết nối vật lý (`ERR_NETWORK` / `ECONNREFUSED`), tự động thử lại sang Render Backend.
    4. **Không failover khi nhận mã lỗi nghiệp vụ HTTP 4xx hoặc 5xx**.
- **Hệ quả & Đánh giá rủi ro:**
  - *Tích cực:* Thành viên FE có thể phát triển giao diện ngay cả khi chưa bật Backend local.
  - *Lưu ý:* Cơ sở dữ liệu local và cloud có thể lệch nhau. Cần dùng `?api=local` khi test các tính năng phụ thuộc dữ liệu vừa tạo.

---

### 📝 ADR-002: Thống Nhất Chính Sách Phí Sàn 60.000 VNĐ / Ca & Lộ Trình Tiến Hóa
- **Trạng thái:** `Accepted`
- **Ngày quyết định:** 21/10/2026
- **Bối cảnh:**
  - Trước đây hệ thống tạm tính phí sàn 50.000 VNĐ/ca. Ban dự án đã chốt chính sách mới: Phí sàn CareLink là **60.000 VNĐ / ca chăm sóc hoàn thành**.
- **Quyết định:**
  - Đồng bộ hiển thị 60.000 VNĐ ở tất cả màn hình: `CaregiverWallet.jsx` (Khấu trừ ví) và `AdminFinance.jsx` (Doanh thu sàn).
  - Ghi nhận đây là **Chính sách nghiệp vụ hiện hành (Current Policy)**, không phải luật bất biến.
  - Sau này nếu chuyển sang thu theo tỷ lệ % hoặc biểu phí theo gói dịch vụ, sẽ cập nhật qua biến cấu hình tập trung thay vì hardcode ở các trang con.
- **Hệ quả:**
  - Cần yêu cầu Backend cập nhật cấu hình `PayOsOptions.PlatformFeePerBooking = 60000m` để số tiền thực nhận trong Database khớp với số tiền hiển thị trên Frontend.

---

### 📝 ADR-003: Kiến Trúc Đề Xuất Ca Trực Đàm Phán Trong Khung Chat (Booking Proposals)
- **Trạng thái:** `Accepted` (Cập nhật chuẩn xác theo Swagger `/openapi/v1.json`)
- **Ngày quyết định:** 19/10/2026 (Cập nhật 21/10/2026)
- **Bối cảnh:**
  - Nhiều ca chăm sóc cần gia đình và điều dưỡng trao đổi cụ thể về tình trạng bệnh nhân trước khi chốt giá và lịch trình, không thể đặt lịch cứng nhắc ngay từ đầu.
- **Quyết định:**
  - Tích hợp tính năng Đề xuất ca (`BookingProposal`) trực tiếp vào khung chat (`src/api/conversationApi.js`):
    1. **Khách hàng (Family)** tạo đề xuất ca làm việc gửi cho Caregiver: `POST /api/v1/conversations/{id}/proposals`.
    2. **Điều dưỡng (Caregiver)** xem xét và bấm **Chấp thuận (Accept)**: `PUT /api/v1/conversations/{conversationId}/proposals/{proposalId}/accept`.
    3. Hệ thống tự động tạo Booking ở trạng thái `PendingPayment` và **giữ chỗ trong 30 phút** để Khách hàng hoàn tất thanh toán PayOS.
    4. Nếu Khách hàng không thanh toán trong 30 phút, Booking tự động hủy (`Canceled`) và giải phóng lịch của Điều dưỡng.
    5. Nếu Điều dưỡng bấm **Từ chối (Reject)**: `PUT /api/v1/conversations/{conversationId}/proposals/{proposalId}/reject`, cuộc trò chuyện tiếp tục bình thường mà không sinh đơn rác.
- **Hệ quả:**
  - Giảm thiểu tối đa ca đặt lịch bị hủy hoặc không phù hợp chuyên môn, quy trình đàm phán 2 chiều minh bạch.

---

### 📝 ADR-004: Loại Bỏ Toàn Bộ Native Browser Dialogs & Chiến Lược Phản Hồi Lỗi Đa Tầng
- **Trạng thái:** `Accepted`
- **Ngày quyết định:** 21/10/2026
- **Bối cảnh:**
  - Việc dùng `window.alert()`, `window.confirm()`, `window.prompt()` làm trải nghiệm người dùng kém chuyên nghiệp, không thể tùy biến giao diện và dễ bị trình duyệt chặn pop-up.
- **Quyết định:**
  - Cấm 100% native dialogs.
  - Áp dụng chiến lược phản hồi đa tầng:
    - Form Validation -> Inline text lỗi màu đỏ dưới từng ô nhập liệu.
    - Fetching List Error -> Error State kèm nút Thử lại (Retry).
    - Thao tác quan trọng (Hủy ca, Duyệt hồ sơ) -> Modal chuyên dụng kèm validation lý do.
    - Kết quả nhanh -> Toast thông báo tự tắt sau 3-5s.
- **Hệ quả:**
  - Nâng cao tính chuyên nghiệp và thẩm mỹ chuẩn Y tế của ứng dụng.
