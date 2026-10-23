# 🧪 TIÊU CHUẨN KIỂM THỬ & NGHIỆM THU ĐA TẦNG (CareLink_FE)

> **Mục tiêu:** Định nghĩa khung kiểm thử chất lượng thống nhất trên toàn hệ thống CareLink.  
> ⚠️ **Quy tắc vàng:** **"Build thành công" chỉ là điều kiện cần (Build Gate), tuyệt đối KHÔNG ĐƯỢC coi là bằng chứng tính năng đã hoạt động đúng (Verified).**

---

## I. KHUNG KIỂM CHỨNG CHẤT LƯỢNG 6 CẤP ĐỘ (6-TIER VERIFICATION FRAMEWORK)

Mọi tính năng mới hoặc bản sửa lỗi phải được đánh giá qua các tầng kiểm tra sau:

### 📄 [Tier 1] Contract Verified (Đối chiếu Hợp đồng API)
- Đã đối chiếu chính xác Route, HTTP Method, Query/Path params, Request Payload, Response DTO và Quyền truy cập (`Roles`) với mã nguồn C# và Swagger của Backend.
- Không tồn tại sự lệch lạc về tên trường (`camelCase` vs `snake_case`), kiểu dữ liệu hoặc enum.

### 🎨 [Tier 2] FE Integrated (Tích hợp Giao diện & Component State)
- Đã nối hàm API client (`src/api/*.js`) vào Component/Page thực tế.
- **Form Validation:** Lỗi hiển thị đúng dạng inline text dưới ô nhập liệu khi người dùng để trống hoặc nhập sai định dạng.
- **Chống Double-Click:** Nút gửi dữ liệu phải bị `disabled` và hiển thị icon xoay (spinner) khi đang chờ request.
- **Xử lý hộp thoại:** Đóng mở mượt mà bằng Modal chuyên dụng, cấm 100% `window.alert/confirm/prompt`.
- **Trạng thái kết quả:** Toast tiếng Việt cho thao tác nhanh, Error State có nút "Thử lại" khi tải danh sách thất bại.

### 🥉 [Tier 3] Build Passed (Biên dịch không lỗi)
- **Lệnh thực thi:**
  ```bash
  npm run build
  ```
- **Tiêu chí Pass:** Mã thoát `Exit Code 0`, 0 lỗi cú pháp JSX, không import sai file, bundle tạo ra đầy đủ trong `dist/`.
- **Ý nghĩa:** Chỉ chứng minh code không bị lỗi cú pháp tĩnh. **Chưa chứng minh API chạy được.**

### 🥈 [Tier 4] Automated Tests Passed (Kiểm thử tự động - nếu có cấu hình)
- Chạy các bộ test unit/integration của FE (nếu có script test). Đối với BE, 100% test trong `CareLinkAPI.Tests` phải Pass.
- *Lưu ý phạm vi FE:* Hiện tại `CareLink_FE` tập trung kiểm soát chất lượng qua Tier 3 (Build Gate `npm run build` không warning/lỗi), Tier 2 (Form validation & disabled state) và Tier 5 (Runtime kết nối BE). Nếu repo chưa thiết lập test runner (như Vitest/Jest), Tier 4 được ghi nhận là `N/A (Chưa cấu hình test runner)`, không coi là tính năng bị lỗi.

### 🥇 [Tier 5] Runtime Verified (Kết nối Backend thật)
- **Gọi API thật:** Endpoint trả về HTTP 200/201 với dữ liệu thực tế từ Database (qua `https://localhost:7183` hoặc Render).
- **Kiểm tra mã lỗi nghiệp vụ & Giao diện phản hồi:**
  - 400 Bad Request: Hiển thị đúng thông báo lỗi từ Backend `ProblemDetails`.
  - 401 Unauthorized: Kích hoạt cơ chế refresh token hoặc điều hướng về `/login`.
  - 403 Forbidden: Hiển thị thông báo không có quyền, không crash giao diện.
  - 404 Not Found: Hiển thị Empty State hoặc trang 404.
  - *Quy tắc đánh giá kết quả:* Nếu kịch bản kiểm tra cố ý nhập sai để xác minh cơ chế bẫy lỗi và UI hiển thị đúng Error State / Inline error / Toast theo thiết kế, kịch bản đó được tính là **Test Passed**, không ép buộc mọi thao tác phải trả về 200/201.
- **Kiểm tra Smart Failover:**
  - Khi Backend local bị tắt (`ERR_NETWORK`), ứng dụng tự động kết nối sang Render mà không gây màn hình trắng.
  - Khi Backend trả về lỗi nghiệp vụ 4xx hoặc 5xx, hệ thống **không** được tự tiện đổi server.

### 💎 [Tier 6] E2E User Flow Verified (Luồng người dùng trọn vẹn)
- Kiểm tra toàn bộ vòng đời nghiệp vụ qua nhiều vai trò:
  1. *Khách hàng:* Đăng nhập -> Chọn dịch vụ -> Đặt lịch hẹn -> Nhận link PayOS -> Thanh toán.
  2. *Hệ thống:* Gửi thông báo đến chuông điều dưỡng -> Cập nhật trạng thái `PendingAcceptance`.
  3. *Điều dưỡng:* Mở xem yêu cầu -> Bấm "Chấp nhận" -> Bắt đầu ca -> Hoàn thành ca -> Nhận tiền vào ví.
  4. *Khách hàng & Điều dưỡng:* Đánh giá nhận xét 5 sao và viết review.

---

## II. QUY TẮC GHI NHẬN TRẠNG THÁI TRONG BẢNG TIẾN ĐỘ

Phân biệt rõ 5 trạng thái kiểm thử:
- `Passed`: Đã chạy kiểm tra thực tế và đạt yêu cầu.
- `Failed`: Đã chạy và phát hiện lỗi.
- `Not Tested`: Chưa kiểm tra do chưa có môi trường (DB live, PayOS live, tài khoản thật).
- `N/A`: Không áp dụng cho loại task hoặc repository này.
- `Blocked`: Bị nghẽn do phụ thuộc bên ngoài hoặc thiết kế chưa rõ.

Khi cập nhật [WORK_STATUS.md](WORK_STATUS.md), chỉ được dùng các trạng thái chuẩn xác sau:

| Trạng thái | Điều kiện để được đánh dấu | Bằng chứng bắt buộc |
| :--- | :--- | :--- |
| `Planned` | Tính năng mới nằm trên kế hoạch, chưa viết code. | Mô tả yêu cầu. |
| `In-Progress` | Đang viết code trong component hoặc file API client. | Git diff hiện có. |
| `Build-Passed` | Đã chạy `npm run build` thành công nhưng chưa test API thật. | Log build 0 lỗi. |
| `Runtime-Verified` | Đã gọi API thật thành công với Backend local hoặc Render. | Log mạng Network DevTools / response JSON thật từ Database. |
| `E2E-Verified` | Đã kiểm thử trọn vẹn kịch bản người dùng qua nhiều vai trò. | Kịch bản test step-by-step đã vượt qua. |
| `Blocked` | Đang bị vướng lỗi Backend hoặc thiếu tài liệu nghiệp vụ. | Ghi rõ nguyên nhân gây nghẽn. |

---

## III. BẰNG CHỨNG NGHIỆM THU BẮT BUỘC (ACCEPTANCE EVIDENCE)

Trước khi tuyên bố một task hoàn tất, AI hoặc Lập trình viên phải ghi rõ:
1. Lệnh build đã chạy và thời gian hoàn thành (`npm run build`).
2. Môi trường Backend đã thử nghiệm (`localhost:7183` hay Render Cloud).
3. Các vai trò (`Customer`, `Nurse`, `Admin`) đã được kiểm tra thực tế.
4. Danh sách các trường hợp ngoại lệ (Edge Cases) đã xử lý: mất mạng, nhập sai dữ liệu, click đúp, hủy giao dịch.
