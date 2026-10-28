# 🤖 HƯỚNG DẪN DÀNH CHO AI ASSISTANT (CareLink_FE)

> **CHÚ Ý QUAN TRỌNG:** Đây là điểm vào bắt buộc (Entry Point) cho mọi AI coding assistant (Cursor, Antigravity, Copilot, Claude...) khi làm việc trên codebase `CareLink_FE` (React 19 / Vite / Tailwind CSS / Axios).

---

## 📌 I. NGUYÊN TẮC LÀM VIỆC NỀN TẢNG (CORE PRINCIPLES)

1. **Tự xác định ngữ cảnh & Không hardcode đường dẫn:**
   - Luôn sử dụng đường dẫn tương đối trong repository (ví dụ: `docs/ai/AI_WORKING_RULES.md`). Không dùng đường dẫn tuyệt đối theo máy cá nhân (`file:///...`).
   - Tự kiểm tra trạng thái Git (`git status`), bảo vệ các thay đổi chưa commit của đồng đội.
2. **Không mặc định FE sai, BE sai hoặc tài liệu luôn đúng:**
   - Dùng mã nguồn thực tế, các file trong `src/api/`, Controller/DTO của Backend, và hành vi runtime làm căn cứ.
   - Không tin mù quáng vào các tuyên bố "105/105 API đã verified" trong tài liệu cũ nếu chưa có bằng chứng kiểm thử thực tế.
3. **Phân biệt 4 nhóm thông tin:**
   - **Nguyên tắc bất biến (Invariants):** Cấm 100% `alert()`, `confirm()`, `prompt()`; cấm báo thành công giả khi gọi API ghi (Write) bị lỗi; không log token/password ra console; không để FE tự quyết định số tiền thanh toán thực tế; không tự ý commit/push.
   - **Chính sách hiện hành (Policies):** Phí sàn hiện hành **60.000 VNĐ / ca** (theo quyết định nhóm trưởng, đồng bộ hiển thị với BE), thời hạn giữ chỗ 30 phút, điều kiện hủy. Có thể thay đổi khi được phê duyệt.
   - **Thiết kế kỹ thuật hiện tại (Current Technical State):** Các component, page, mock fallback, axios interceptors hiện có. Đây là hiện trạng để rà soát, không mặc nhiên là thiết kế chuẩn cuối cùng.
   - **Trạng thái đã xác minh (Verified State):** Chỉ ghi nhận khi có bằng chứng chạy thực tế trong phiên làm việc.

---

## 📌 II. TÀI LIỆU CHUYÊN MÔN THAM CHIẾU (ON-DEMAND REFERENCES)

AI đọc các tài liệu sau theo nhu cầu của từng task cụ thể:

1. **[Quy tắc làm việc & Chuẩn mực UI/UX](docs/ai/AI_WORKING_RULES.md)**:
   - Tư duy đa chiều N-N mapping (Rà soát ngang đa màn hình, rà soát dọc 3 role `Customer`, `Nurse`, `Admin`).
   - Tự điều chỉnh UI theo DTO thực tế (thêm trường thiếu, dọn trường rác).
   - Mock data phải khớp 100% DTO thật; cấm mock ghi giả mạo thành công.
2. **[Ma trận tích hợp API Frontend](docs/ai/API_INTEGRATION_MATRIX.md)**:
   - Tra cứu 7 tệp API Client (`authApi.js`, `familyApi.js`, `caregiverApi.js`, `conversationApi.js`, `adminApi.js`, `notificationApi.js`, `handbookApi.js`).
   - Kiểm tra cấp độ tích hợp thực tế trên từng màn hình/component.
3. **[Hồ sơ quyết định kiến trúc (ADR)](docs/ai/ARCHITECTURE_DECISIONS.md)**:
   - ADR-001 (Smart Failover `localhost:7183` <-> Render), ADR-002 (Phí sàn 60.000đ), ADR-003 (Đề xuất ca trong Chat), ADR-004 (Loại bỏ hoàn toàn Browser Dialogs).
4. **[Tiêu chuẩn kiểm thử & Khung nghiệm thu](docs/ai/TESTING_AND_ACCEPTANCE.md)**:
   - Khung kiểm chứng 6 cấp độ: `Contract-Verified` -> `FE-Integrated` -> `Build-Passed` -> `Test-Passed` -> `Runtime-Verified` -> `E2E-Verified`.
   - "Build thành công" chỉ là điều kiện cần, không phải bằng chứng hoàn tất.
5. **[Bảng theo dõi tiến độ nhóm](docs/ai/WORK_STATUS.md)**:
   - Theo dõi phân công giữa các thành viên (Vy, Khôi, Quốc), tránh ghi đè component đang làm dở.
6. **[Chỉ mục tài liệu & Bản đồ hiệu lực](docs/ai/DOCUMENTATION_INDEX.md)**:
   - Tra cứu phân loại hiệu lực (`ACTIVE`, `REFERENCE`, `HISTORICAL`, `SUPERSEDED`, `PROPOSAL`) của toàn bộ 26 tài liệu trong dự án.

---

## ⚡ III. QUY TRÌNH 8 BƯỚC BẮT BUỘC CHO MỌI TASK CODE

Mỗi khi nhận task sửa lỗi, tích hợp API, làm UI hoặc phát triển tính năng, AI **BẮT BUỘC** tuân thủ 8 bước sau:

```
[1. Hiểu yêu cầu & Phân loại] ──> [2. Truy vết E2E nguyên nhân gốc] ──> [3. Rà soát N-N chéo màn hình & 3 Role]
                                                                                │
[6. Triển khai đồng bộ]      <── [5. Đề xuất trước khi sửa lớn]     <── [4. Kiểm tra Edge Cases & DTO Contract]
         │
         ▼
[7. Chuẩn UX & Xử lý lỗi]   ──> [8. Kiểm thử có bằng chứng & Cập nhật Docs]
```

### Bước 1 — Hiểu yêu cầu và phân loại phạm vi
- Xác định rõ hành vi mong muốn vs hiện tại.
- Phân loại lỗi thuộc FE (render, state, validation), lỗi BE (HTTP 500, sai logic), hay lỗi Hợp đồng API (lệch DTO).
- Không giới hạn phạm vi ở một component duy nhất nếu luồng dữ liệu bắt nguồn từ nơi khác.

### Bước 2 — Truy vết nguyên nhân gốc (E2E Root-Cause Tracing)
- Đi theo chuỗi dữ liệu thực tế: `UI Component (JSX/State) -> Form Handler -> API Client Function -> Axios Client -> HTTP Request -> Backend Endpoint`.
- So sánh payload gửi đi và response nhận về với Swagger và DTO C# của Backend.
- Không đoán mò tên trường; phải mở đúng file `src/api/*.js` và DTO Backend để đối chiếu.

### Bước 3 — Rà soát quan hệ N–N chéo màn hình & 3 Role
- **Rà soát Ngang:** Cùng một hành động (ví dụ: Chấp nhận ca, Hủy ca, Xem ví) xuất hiện ở những trang, tab, modal nào khác trong cùng một vai trò?
- **Rà soát Dọc:** Ảnh hưởng đến cả 3 role: `Customer`, `Nurse`, `Admin`. Kiểm tra layout và hàm chuẩn hóa dữ liệu tương ứng.
- Kiểm tra các vị trí đang dùng mock fallback hoặc localStorage giả định.

### Bước 4 — Kiểm tra tình huống thực tế & Tính toàn vẹn dữ liệu
- Xử lý các tình huống: Input rỗng, sai định dạng, mạng chập chờn, token hết hạn (401 refresh token queue), người dùng bấm liên tục (chống double-click bằng `disabled` + spinner).
- **Quy tắc tài chính:** Hiển thị đúng số tiền và phí sàn theo hợp đồng từ Backend. Không tự ý gửi `amount` tự chế lên BE để quyết định giá.

### Bước 5 — Đề xuất trước khi sửa lớn
- Khi phát hiện cần đổi DTO, đổi cấu trúc State toàn cục, hoặc BE chưa hỗ trợ API cần thiết: Báo cáo rõ khoảng cách (GAP), đề xuất phương án và xin ý kiến trước khi đập đi xây lại.

### Bước 6 — Triển khai đồng bộ
- Sửa triệt để nguyên nhân gốc. Nếu BE thay đổi DTO, cập nhật đồng bộ API client, form, component hiển thị và xử lý lỗi.
- Đảm bảo State cập nhật mượt mà sau khi mutation thành công (không để lộ dữ liệu cũ / stale data).
- Không tự ý commit/push Git khi chưa có lệnh.

### Bước 7 — Chuẩn UI/UX và xử lý lỗi
- **Tuyệt đối CẤM:** `alert()`, `confirm()`, `prompt()` và các popup mặc định kiểu *"localhost says..."*.
- Validation lỗi: Hiển thị inline text màu đỏ ngay dưới ô nhập liệu.
- Thao tác cần lý do (Hủy ca, Từ chối ca): Dùng Modal chuyên dụng kèm form validate.
- Kết quả: Dùng Toast thông báo tiếng Việt thân thiện (3-5s tự tắt).
- Tải danh sách lỗi: Hiển thị Error State có nút "Thử lại" (Retry).
- Không in raw exception (`AxiosError: Request failed with status code 500`) cho người dùng.
- Console log có cấu trúc ở khối `catch`, không spam trong `render` hay `useEffect` gây lag browser.

### Bước 8 — Kiểm thử có bằng chứng & Cập nhật tài liệu
- Chạy lệnh build: `npm run build` (bắt buộc Exit Code 0, không lỗi cú pháp/import).
- Kiểm tra runtime trên trình duyệt với backend thật (Localhost hoặc Render) khi có thể.
- Báo cáo rõ: lệnh đã chạy, kết quả thực tế, phần chưa thể test và lý do.
- Cập nhật ma trận tích hợp (`API_INTEGRATION_MATRIX.md`) và bảng tiến độ (`WORK_STATUS.md`).

---

## 🚫 IV. CÁC HÀNH VI BỊ NGHIÊM CẤM

- ❌ **Cấm dùng `alert()`, `confirm()`, `prompt()`.**
- ❌ **Cấm báo thành công giả khi thao tác lưu/thanh toán/hủy ca bị lỗi.**
- ❌ **Cấm log token, mật khẩu hoặc dữ liệu nhạy cảm ra console.**
- ❌ **Không tự tiện đổi server sang Render khi nhận mã lỗi nghiệp vụ HTTP 4xx hoặc 5xx.**
- ❌ **Không tự ý commit / push lên Git khi chưa có sự đồng ý rõ ràng.**
- ❌ **Không tự tuyên bố "đã xong / 100% verified" khi chỉ mới build mà chưa có bằng chứng kiểm thử.**

---

## ⚖️ V. THỨ TỰ ƯU TIÊN NGUỒN SỰ THẬT & XỬ LÝ TÀI LIỆU CŨ

Khi gặp mâu thuẫn giữa các tài liệu hoặc giữa tài liệu với code, AI **BẮT BUỘC** áp dụng thứ tự ưu tiên 5 tầng:
1. **Mã nguồn thực tế (JSX, Component, API Client `src/api/*.js`, DTO thật từ BE):** Là nguồn sự thật khách quan về hành vi runtime hiện tại.
2. **Quyết định kiến trúc & Chính sách đã duyệt (`ARCHITECTURE_DECISIONS.md`, Phí sàn 60k):** Có thẩm quyền cao nhất về mặt định hướng nghiệp vụ.
3. **Ma trận tích hợp API hiện hành (`API_INTEGRATION_MATRIX.md`):** Là căn cứ đối chiếu 105 hàm client với các màn hình.
4. **Tài liệu phân loại trong [`DOCUMENTATION_INDEX.md`](docs/ai/DOCUMENTATION_INDEX.md):** Tra cứu rõ trạng thái `ACTIVE` vs `HISTORICAL` vs `SUPERSEDED`.
5. **CẢNH BÁO TÀI LIỆU LỊCH SỬ / HẾT HẠN:**
   - Các file như `FE_BE_GAP_ANALYSIS.md` là tài liệu ghi nhận đợt kiểm tra ban đầu cũ.
   - **Tuyệt đối KHÔNG** tự ý xem các ghi chú cũ của đồng đội là quy tắc cứng bắt buộc cho tính năng mới.
   - Khi phát hiện mâu thuẫn giữa tài liệu cũ và chính sách hiện hành, phải báo cáo người dùng để xác nhận.


---

## 📂 VI. QUY ƯỚC QUẢN LÝ & TỔ CHỨC THƯ MỤC TÀI LIỆU (DOCUMENTATION GOVERNANCE)

Để tránh ô nhiễm ngữ cảnh (context pollution) và bảo đảm tính ngăn nắp cho toàn bộ thành viên và AI, dự án phân chia cấu trúc tài liệu thành 4 khu vực độc lập:

1. **`docs/ai/` (AI Core Context - Bất biến & Quy chuẩn):**
   - Chỉ chứa 6 tệp chuẩn mực bắt buộc: `AI_WORKING_RULES.md`, `API_INTEGRATION_MATRIX.md`, `ARCHITECTURE_DECISIONS.md`, `TESTING_AND_ACCEPTANCE.md`, `DOCUMENTATION_INDEX.md`, `WORK_STATUS.md`.
   - **CẤM** tạo file task tạm hay ghi chú ngắn ngày vào thư mục này.
2. **`docs/specs/` (System Specifications & Blueprints):**
   - Chứa tài liệu đặc tả kỹ thuật, thiết kế nâng cấp UI/UX, hướng dẫn tích hợp từ BE.
   - Mọi tài liệu thiết kế tính năng mới hoặc kế hoạch phân công **BẮT BUỘC** lưu tại đây.
3. **`docs/presentations/` (Demo & Exam Presentation Scripts):**
   - Chứa kịch bản thuyết trình, hướng dẫn demo multi-tab phục vụ bảo vệ đồ án.
4. **`docs/archive/` (Tài liệu lưu trữ lịch sử):**
   - Chứa các phân tích GAP cũ, checklist đã hết hạn (`FE_BE_GAP_ANALYSIS.md`).
   - **CẤM AI** đọc các tài liệu trong archive để làm căn cứ lập trình tính năng mới. Không tạo file mới vào archive.

> **Quy định tuyệt đối:** Cấm tạo file Markdown rải rác ngoài thư mục gốc (`root`) của repository. Mọi tài liệu mới được tạo phải đăng ký đường dẫn vào `docs/ai/DOCUMENTATION_INDEX.md`.
