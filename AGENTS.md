# 🤖 HƯỚNG DẪN DÀNH CHO AI ASSISTANT (CareLink_FE)

> **CHÚ Ý QUAN TRỌNG:** Đây là điểm vào bắt buộc (Entry Point) cho mọi AI coding assistant (Cursor, Antigravity, Copilot, Claude...) khi làm việc trên codebase `CareLink_FE`.

---

## 📌 QUY TẮC BẮT BUỘC TRƯỚC KHI VIẾT HOẶC SỬA CODE

Trước khi thực hiện bất kỳ chỉnh sửa nào trong thư mục `src/`, AI **BẮT BUỘC PHẢI ĐỌC VÀ TUÂN THỦ** các tài liệu quản trị sau đây:

1. **[Quy tắc làm việc & Chuẩn mực UI/UX](file:///d:/Bai_Tap_FPT/EXE201/CareLink_FE/docs/ai/AI_WORKING_RULES.md)** (`docs/ai/AI_WORKING_RULES.md`):
   - **Tư duy Đa chiều N-N Mapping:** Rà soát Ngang (nối 1 API phải tìm hết các trang, tab, modal cùng chức năng trong role) và Rà soát Dọc (kiểm tra cả 3 role Customer/Nurse/Admin).
   - **Tự điều chỉnh Giao diện (UI Adaptation):** Thấy DTO trả về trường quan trọng mà UI thiếu -> phải chủ động vẽ thêm; thừa trường rác -> phải dọn dẹp.
   - **Phản hồi người dùng vs. Console log:** Mọi thông báo cho người dùng phải qua UI (Modal, Inline error, Toast tiếng Việt), cấm hiện popup mặc định `localhost says...` (`alert/confirm/prompt`). Log trong console phải có cấu trúc ở `catch`, **nghiêm cấm log rác trong vòng lặp / render gây lag browser**.
   - **Mock Data chuẩn DTO:** Cấm báo thành công giả khi thao tác ghi bị lỗi; nếu dùng mock hiển thị fallback thì **100% cấu trúc trường phải khớp DTO thật**.
   - Nắm rõ **Quy trình 8 bước phát triển tính năng mới & tiến hóa hệ thống**; kịch bản thực tế (khách đổi ý không trả tiền, trùng lịch ca trực).

2. **[Ma trận tích hợp đầy đủ 105 API](file:///d:/Bai_Tap_FPT/EXE201/CareLink_FE/docs/ai/API_INTEGRATION_MATRIX.md)** (`docs/ai/API_INTEGRATION_MATRIX.md`):
   - Tra cứu chính xác Endpoint, HTTP Method, và hàm trong 7 file API Client thực tế (`authApi.js`, `familyApi.js`, `caregiverApi.js`, `conversationApi.js`, `adminApi.js`, `notificationApi.js`, `handbookApi.js`).
   - Phân biệt rõ các cấp độ kiểm chứng: `Contract Verified`, `FE Integrated`, `Build Passed`, `Runtime Verified`, `E2E Verified`.

3. **[Hồ sơ quyết định kiến trúc (ADR)](file:///d:/Bai_Tap_FPT/EXE201/CareLink_FE/docs/ai/ARCHITECTURE_DECISIONS.md)** (`docs/ai/ARCHITECTURE_DECISIONS.md`):
   - Nắm rõ các quyết định nền tảng: ADR-001 (Smart Failover `localhost` <-> Render), ADR-002 (Phí sàn 60.000 VNĐ), ADR-003 (Đề xuất ca đàm phán trong Chat).

4. **[Tiêu chuẩn kiểm thử & Nghiệm thu đa tầng](file:///d:/Bai_Tap_FPT/EXE201/CareLink_FE/docs/ai/TESTING_AND_ACCEPTANCE.md)** (`docs/ai/TESTING_AND_ACCEPTANCE.md`):
   - **"Build thành công" chỉ là điều kiện cần (Build Gate), tuyệt đối KHÔNG ĐƯỢC coi là tính năng đã Verified.**
   - Bắt buộc kiểm tra runtime, kiểm tra chống Double-Click và giao diện responsive.

5. **[Bảng theo dõi tiến độ nhóm](file:///d:/Bai_Tap_FPT/EXE201/CareLink_FE/docs/ai/WORK_STATUS.md)** (`docs/ai/WORK_STATUS.md`):
   - Kiểm tra task đang thuộc về ai (Vy, Khôi, Quốc...) để tránh sửa chồng chéo code chưa commit của đồng đội.

---

## 🚫 CÁC HÀNH VI BỊ NGHIÊM CẤM

- ❌ **Không tự ý commit / push lên Git** khi chưa có sự đồng ý hoặc lệnh rõ ràng từ người dùng.
- ❌ **Không tự ý sửa file ngoài phạm vi được giao** mà chưa phân tích tác động chéo.
- ❌ **Không để lộ API keys, token hoặc thông tin cá nhân** vào mã nguồn hoặc console log.
- ❌ **Không tuyên bố hoàn thành (Verified)** khi chỉ mới chạy lệnh build mà chưa kiểm tra luồng runtime thực tế.
