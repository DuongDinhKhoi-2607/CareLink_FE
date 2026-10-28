# 🧭 CHỈ MỤC TÀI LIỆU QUẢN TRỊ & BẢN ĐỒ HIỆU LỰC (DOCUMENTATION INDEX)
### Dự án: CareLink Frontend (`CareLink_FE`)

> **Mục tiêu:** Định danh, phân loại mục đích, thẩm quyền và trạng thái hiệu lực của **toàn bộ tài liệu Markdown** trong repository Frontend.  
> ⚠️ **Quy tắc cho AI:** Không đọc tài liệu trong `docs/archive/` để làm căn cứ sinh code mới.

---

## 📌 I. BẢNG PHÂN LOẠI HIỆU LỰC TÀI LIỆU FRONTEND

| STT | Tên file & Đường dẫn | Phân loại (Purpose) | Trạng thái | Thẩm quyền & Phạm vi (Authority) | Giới hạn & Cảnh báo mâu thuẫn |
| :---: | :--- | :--- | :---: | :--- | :--- |
| 1 | [`AGENTS.md`](../../AGENTS.md) | Entry Point & Task Protocol | 🟢 **`ACTIVE`** | Toàn bộ AI Assistant làm việc trên `CareLink_FE`. Bắt buộc tuân thủ quy trình 8 bước. | Điểm vào chính cho Frontend. |
| 2 | [`docs/ai/AI_WORKING_RULES.md`](AI_WORKING_RULES.md) | Chuẩn mực UI/UX & N-N Mapping | 🟢 **`ACTIVE`** | Cấm alert/confirm, chuẩn modal/toast, mock chuẩn DTO 100%. | Áp dụng cho mọi task React / JSX / Tailwind / API Client. |
| 3 | [`docs/ai/API_INTEGRATION_MATRIX.md`](API_INTEGRATION_MATRIX.md) | Ma trận tích hợp 105 API | 🟢 **`ACTIVE`** *(Living)* | Bản đồ 105 hàm API client gắn vào 45 màn hình/component. | Cần cập nhật khi có endpoint mới hoặc thay đổi component. |
| 4 | [`docs/ai/ARCHITECTURE_DECISIONS.md`](ARCHITECTURE_DECISIONS.md) | Quyết định kiến trúc Frontend | 🟢 **`ACTIVE`** | ADR-001 (Smart Failover), ADR-002 (Phí sàn), ADR-003 (Chat Proposal), ADR-004 (Loại bỏ dialog). | Quyết định đã duyệt phía Frontend. |
| 5 | [`docs/ai/TESTING_AND_ACCEPTANCE.md`](TESTING_AND_ACCEPTANCE.md) | Khung nghiệm thu chất lượng FE | 🟢 **`ACTIVE`** | Khung kiểm chứng 6 cấp độ đồng bộ. | Đánh giá theo phạm vi khả dụng thực tế. |
| 6 | [`docs/ai/WORK_STATUS.md`](WORK_STATUS.md) | Tiến độ & Phân công Frontend | 🟢 **`ACTIVE`** *(Living)* | Trạng thái tích hợp màn hình và cơ chế failover. | Không tự ý sửa đè component do thành viên khác phụ trách. |
| 7 | [`docs/ai/DOCUMENTATION_INDEX.md`](DOCUMENTATION_INDEX.md) | Bản đồ chỉ mục & Phân loại | 🟢 **`ACTIVE`** | Nguồn sự thật về hiệu lực của mọi tài liệu Markdown FE. | Tra cứu trước khi đọc các file docs khác. |
| 8 | [`docs/presentations/KICH_BAN_DEMO_THUYET_TRINH_3_TAB.md`](../presentations/KICH_BAN_DEMO_THUYET_TRINH_3_TAB.md) | Kịch bản demo 3 tab chuẩn bị chấm đồ án | 🟡 **`REFERENCE`** | Kịch bản chi tiết 8-10 phút phân vai Khách hàng - Điều dưỡng - Admin. | Phục vụ báo cáo và demo sản phẩm. |
| 9 | [`docs/archive/FE_BE_GAP_ANALYSIS.md`](../archive/FE_BE_GAP_ANALYSIS.md) | Báo cáo GAP phân tích ban đầu | 🔴 **`HISTORICAL`** | Báo cáo đợt kiểm tra ban đầu 43 API. | Tài liệu lịch sử tham khảo. |
| 10 | [`docs/archive/README.md`](../archive/README.md) | Hướng dẫn kho lưu trữ lịch sử | 🟡 **`REFERENCE`** | Cảnh báo không dùng tài liệu cũ để sinh code. | Tham khảo lịch sử. |
| 11 | [`README.md`](../../README.md) | Hướng dẫn chạy Vite dev/build | 🟡 **`REFERENCE`** | Hướng dẫn lệnh khởi động Frontend. | Tham khảo lệnh build. |
| 12 | [`.agents/skills/design-taste-frontend/SKILL.md`](../../.agents/skills/design-taste-frontend/SKILL.md) | Skill thẩm mỹ thiết kế UI | 🟡 **`REFERENCE`** | Hướng dẫn nâng cấp giao diện, chống thiết kế rập khuôn. | Tham khảo khi thiết kế màn hình mới. |
| 13 | [`.agents/skills/redesign-existing-projects/SKILL.md`](../../.agents/skills/redesign-existing-projects/SKILL.md) | Skill tái cấu trúc giao diện | 🟡 **`REFERENCE`** | Hướng dẫn quy trình audit và tái thiết kế UI. | Tham khảo khi làm task nâng cấp UX. |

---
