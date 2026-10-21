# 🧪 TIÊU CHUẨN KIỂM THỬ & NGHIỆM THU ĐA TẦNG (CareLink_FE)

> **Mục tiêu:** Định nghĩa khung kiểm thử chất lượng 4 cấp độ (4-Tier Quality Framework).  
> ⚠️ **Quy tắc vàng:** **"Build thành công" chỉ là điều kiện cần (Build Gate), tuyệt đối KHÔNG ĐƯỢC coi là bằng chứng tính năng đã hoạt động đúng (Verified).**

---

## I. KHUNG NGHIỆM THU 4 CẤP ĐỘ (4-TIER ACCEPTANCE FRAMEWORK)

Mọi tính năng mới hoặc bản sửa lỗi phải được đánh giá qua 4 tầng kiểm tra:

### 🥉 Tầng 1: Build Gate (Biên dịch không lỗi)
- **Lệnh thực thi:**
  ```bash
  npm run build
  ```
- **Tiêu chí Pass:** Mã thoát `Exit Code 0`, 0 lỗi cú pháp JSX, không import sai file, bundle tạo ra đầy đủ trong `dist/`.
- **Ý nghĩa:** Chỉ chứng minh code không bị lỗi cú pháp tĩnh. **Chưa chứng minh API chạy được.**

### 🥈 Tầng 2: Form & Component State Gate (Kiểm tra tương tác UI)
- **Form Validation:** Lỗi hiển thị đúng dạng inline text dưới ô nhập liệu khi người dùng để trống hoặc nhập sai định dạng.
- **Vô hiệu hóa nút (Disabled State):** Nút gửi dữ liệu phải bị disabled và hiển thị icon xoay khi đang chờ request để **ngăn chặn Double-Click**.
- **Xử lý hộp thoại (Modal/Dialog):** Đóng mở mượt mà bằng nút Hủy, phím ESC hoặc bấm vùng ngoài backdrop. Tuyệt đối không dùng `window.alert/confirm`.
- **Phản hồi lỗi theo ngữ cảnh:**
  - Lỗi thao tác nhanh: Toast thông báo (3–5s tự tắt).
  - Lỗi tải danh sách: Khối Error State có nút "Thử lại" (Retry).
  - Lỗi thanh toán: Điều hướng về trang kết quả hủy/thất bại (`PaymentCancel.jsx`).

### 🥇 Tầng 3: Runtime Integration Gate (Kết nối Backend thật)
- **Gọi API thật:** Endpoint trả về HTTP 200/201 với dữ liệu thực tế từ Database (qua `https://localhost:7183` hoặc Render).
- **Kiểm tra mã lỗi nghiệp vụ:**
  - 400 Bad Request: Hiển thị đúng thông báo lỗi từ Backend DTO.
  - 401 Unauthorized: Kích hoạt cơ chế refresh token hoặc điều hướng về `/login`.
  - 403 Forbidden: Hiển thị thông báo không có quyền, không crash giao diện.
  - 404 Not Found: Hiển thị Empty State hoặc trang 404.
- **Kiểm tra Smart Failover:**
  - Khi Backend local bị tắt (`ERR_NETWORK`), ứng dụng tự động kết nối sang Render mà không gây màn hình trắng.
  - Khi Backend trả về lỗi 400 hoặc 500, hệ thống **không** được tự tiện đổi server.

### 💎 Tầng 4: E2E User Flow Gate (Luồng người dùng trọn vẹn)
- Kiểm tra toàn bộ vòng đời nghiệp vụ:
  1. *Khách hàng:* Đăng nhập -> Chọn dịch vụ -> Đặt lịch hẹn -> Nhận link PayOS -> Thanh toán.
  2. *Hệ thống:* Gửi thông báo đến chuông điều dưỡng -> Cập nhật trạng thái `PendingAcceptance`.
  3. *Điều dưỡng:* Mở xem yêu cầu -> Bấm "Chấp nhận" -> Bắt đầu ca -> Hoàn thành ca -> Nhận tiền vào ví.
  4. *Khách hàng & Điều dưỡng:* Đánh giá nhận xét 5 sao và viết review.

---

## II. QUY TẮC GHI NHẬN TRẠNG THÁI TRONG BẢNG TIẾN ĐỘ

Khi cập nhật [WORK_STATUS.md](file:///d:/Bai_Tap_FPT/EXE201/CareLink_FE/docs/ai/WORK_STATUS.md), chỉ được dùng các trạng thái chuẩn xác sau:

| Trạng thái | Điều kiện để được đánh dấu | Bằng chứng bắt buộc |
| :--- | :--- | :--- |
| `Planned` | Tính năng mới nằm trên kế hoạch, chưa viết code. | Mô tả yêu cầu. |
| `In-Progress` | Đang viết code trong component hoặc file API client. | Git diff hiện có. |
| `Build-Passed` | Đã chạy `npm run build` thành công nhưng chưa test API thật. | Log build 0 lỗi. |
| `Runtime-Verified` | Đã gọi API thật thành công với Backend local hoặc Render. | Log mạng Network DevTools / response JSON thật. |
| `E2E-Verified` | Đã kiểm thử trọn vẹn kịch bản người dùng qua nhiều vai trò. | Kịch bản test step-by-step đã vượt qua. |
| `Blocked` | Đang bị vướng lỗi Backend hoặc thiếu tài liệu nghiệp vụ. | Ghi rõ nguyên nhân gây nghẽn. |

---

## III. BẰNG CHỨNG NGHIỆM THU BẮT BUỘC (ACCEPTANCE EVIDENCE)

Trước khi tuyên bố một task hoàn tất, AI hoặc Lập trình viên phải ghi rõ:
1. Lệnh build đã chạy và thời gian hoàn thành (`npm run build`).
2. Môi trường Backend đã thử nghiệm (`localhost:7183` hay Render Cloud).
3. Các vai trò (`Customer`, `Nurse`, `Admin`) đã được kiểm tra thực tế.
4. Danh sách các trường hợp ngoại lệ (Edge Cases) đã xử lý: mất mạng, nhập sai dữ liệu, click đúp, hủy giao dịch.
