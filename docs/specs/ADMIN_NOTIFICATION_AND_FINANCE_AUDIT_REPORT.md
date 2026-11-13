# 📋 BÁO CÁO RÀ SOÁT LỖI HỆ THỐNG THÔNG BÁO, TASKBAR VÀ TÀI CHÍNH ADMIN
> **Dự án:** CareLink (`CareLink_FE` & `CareLink_BE`)  
> **Ngày rà soát:** 13/11/2026  
> **Người thực hiện:** AI Assistant (Antigravity)  
> **Phạm vi kiểm tra:** Chuông thông báo Admin (`NotificationDropdown`), Thanh Taskbar/Sidebar (`AdminLayout`), Phân hệ Tài chính Admin (`AdminFinance`), và toàn bộ chuỗi luồng dữ liệu E2E từ Frontend sang Backend (`CareLink_BE`).

---

## 📌 I. TỔNG QUAN & KẾT LUẬN NHANH (EXECUTIVE SUMMARY)

Sau khi rà soát toàn diện mã nguồn Frontend (`CareLink_FE`) và đối chiếu trực tiếp với mã nguồn Backend C# (`CareLink_BE`), chúng tôi xác nhận các hiện tượng bạn gặp phải là **HOÀN TOÀN CÓ THẬT** và bắt nguồn từ 3 nhóm nguyên nhân kỹ thuật cụ thể sau:

1. **Chuông thông báo Admin không reo / không nhận được gì:**
   - **Backend (`CareLink_BE`) hoàn toàn chưa có logic gửi thông báo cho tài khoản Quản trị viên (Admin).**
   - Khi Điều dưỡng nộp hồ sơ, tạo yêu cầu rút tiền, hoặc khi Khách hàng gửi khiếu nại, Backend **chỉ gửi thông báo cho Khách hàng hoặc Điều dưỡng**, hoàn toàn không tạo bản ghi nào trong bảng `notifications` cho Admin. Do đó API trả về số lượng chưa đọc là `0`, chuông thông báo luôn đứng im.
2. **Thanh Taskbar (Sidebar bên trái) không hiển thị số lượng chờ xử lý ở mục Tài chính:**
   - Trong `src/layouts/AdminLayout.jsx`, code hiện tại **chỉ mới cài đặt đếm badge cho 2 mục**: "Duyệt điều dưỡng" (2) và "Khiếu nại" (1).
   - **Mục "Tài chính" hoàn toàn chưa được viết hàm đếm số lượng yêu cầu rút tiền chờ duyệt**, nên không thể hiển thị huy hiệu (badge) thông báo số lượng để Admin biết và giải quyết.
3. **Chỗ Tài chính Admin không hiện lên gì khi Điều dưỡng gửi yêu cầu rút tiền:**
   - Màn hình Tài chính (`/admin/finance`) được chia làm 2 tab: `"Nhật ký giao dịch"` và `"Yêu cầu rút tiền"`. **Tab mặc định khi bấm vào là "Nhật ký giao dịch"** (chỉ hiện lịch sử thanh toán đơn ca). Admin phải bấm thủ công sang tab "Yêu cầu rút tiền" mới thấy.
   - Khi ở tab "Yêu cầu rút tiền", API Backend mặc định chỉ lấy 10 bản ghi (`PageSize: 10`) nếu không truyền tham số phân trang.
   - DTO trả về từ Backend (`PayoutResponse`) thiếu trường số điện thoại điều dưỡng (`nursePhone`), khiến cột thông tin liên hệ bị gạch ngang `"—"`.

---

## 🔍 II. CHI TIẾT VẤN ĐỀ 1: CHUÔNG THÔNG BÁO CỦA ADMIN

### 1. Hiện trạng trên giao diện
- Nút chuông góc trên bên phải thanh Header (`NotificationDropdown.jsx`) không hiển thị số đỏ (badge unread count = 0).
- Khi nhấn vào chuông, hệ thống hiển thị màn hình trống *"Bạn chưa có thông báo nào"*.

### 2. Truy vết nguyên nhân kỹ thuật (E2E Root-Cause Tracing)

```
[Điều dưỡng: Bấm Rút tiền] 
       │
       ▼ (Gọi API)
POST /api/v1/wallet/payouts
       │
       ▼ (Backend xử lý)
WalletService.cs ──> Lưu PayoutRequest vào DB (Status = Pending)
       │
       ├─❌ KHÔNG tạo bản ghi nào trong bảng `notifications` cho Admin!
       ▼
Admin gọi GET /api/v1/notifications/unread-count ──> Trả về { unreadCount: 0 }
Admin gọi GET /api/v1/notifications ──────────────> Trả về { items: [] }
       │
       ▼
Chuông thông báo của Admin hoàn toàn im lặng, không có dữ liệu!
```

- **Bằng chứng từ Backend (`CareLink_BE\CareLinkAPI\Services\WalletService.cs`):**
  - Tại hàm `RequestPayoutAsync` (dòng 176 - 195): Sau khi tạo lệnh rút tiền `PayoutRequest`, Backend chỉ lưu vào DB và trả về kết quả cho Điều dưỡng. **Hoàn toàn không có lệnh `NotifyAsync(...)` hay `notifications.AddAsync(...)` gửi cho Quản trị viên.**
  - Chỉ khi Admin đã duyệt (`ApprovePayoutAsync`) hoặc từ chối (`RejectPayoutAsync`), Backend mới gửi thông báo cho Điều dưỡng (`payout.Nurse.UserId`).
- **Bằng chứng từ `CareLinkAPI\Common\Constants\NotificationTypes.cs`:**
  - Danh mục thông báo của hệ thống hiện tại chỉ có: `BOOKING_*`, `PAYMENT_*`, `WALLET_CREDITED`, `PAYOUT_APPROVED`, `PAYOUT_REJECTED`, `PROPOSAL_*`, `NurseVerification*`.
  - **Hoàn toàn thiếu các Notification Type dành cho Admin** như:
    + `PAYOUT_REQUESTED` (Có yêu cầu rút tiền mới)
    + `NURSE_VERIFICATION_SUBMITTED` (Có hồ sơ chứng chỉ y tế mới cần duyệt)
    + `DISPUTE_SUBMITTED` (Có khiếu nại ca chăm sóc mới cần xử lý)
- **Bằng chứng từ các Service khác (`NurseVerificationService.cs`, `DisputeService.cs`):**
  - Khi Điều dưỡng nộp chứng chỉ hành nghề, Backend chỉ lưu trạng thái `Pending`, không gửi thông báo cho Admin.
  - Khi Khách hàng khiếu nại, `DisputeService` thậm chí không tiêm (inject) `INotificationRepository`.

---

## 🔍 III. CHI TIẾT VẤN ĐỀ 2: THANH TASKBAR / SIDEBAR BÊN TRÁI

### 1. Hiện trạng trên giao diện
- Thanh menu bên trái hiển thị:
  + **Duyệt điều dưỡng:** Có huy hiệu số **`2`** (Hồ sơ chờ duyệt thực tế từ API).
  + **Khiếu nại:** Có huy hiệu số **`1`** (Khiếu nại đang mở thực tế từ API).
  + **Tài chính:** **Hoàn toàn không có huy hiệu (Trống trơn).**

### 2. Truy vết mã nguồn (`src/layouts/AdminLayout.jsx`)

- **State đếm số lượng (Dòng 108 - 109):**
  ```javascript
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [openDisputesCount, setOpenDisputesCount] = useState(0);
  // ❌ THIẾU: Không có state `pendingPayoutsCount` để theo dõi yêu cầu rút tiền!
  ```

- **Hàm tải số lượng thực tế `fetchRealCounts` (Dòng 137 - 151):**
  ```javascript
  const fetchRealCounts = () => {
      // 1. Lấy hồ sơ chờ duyệt -> CÓ GỌI API
      adminApi.getNurseVerifications({ pageNumber: 1, pageSize: 100 }).then(...);

      // 2. Lấy khiếu nại đang mở -> CÓ GỌI API
      adminApi.getDisputes({ pageNumber: 1, pageSize: 100 }).then(...);

      // ❌ THIẾU HOÀN TOÀN: Không gọi adminApi.getPayouts() để lấy số lượng rút tiền chờ duyệt!
  };
  ```

- **Logic hiển thị Badge trên Menu (Dòng 398 - 416):**
  ```javascript
  {/* Badge count */}
  {(() => {
      const count = item.path === "/admin/approvals" 
          ? pendingApprovalsCount 
          : item.path === "/admin/disputes" 
          ? openDisputesCount 
          : item.badge;
      if (!count) return null; // Với /admin/finance, count là undefined nên bị ẩn hoàn toàn!
      return (
          <span className="...">
              {!isCollapsed && count}
          </span>
      );
  })()}
  ```

- **Cơ chế tự động làm mới (Auto Refresh / Polling):**
  - Hàm `fetchRealCounts` chỉ được kích hoạt khi:
    + Người dùng tải lại trang hoặc chuyển đổi giữa các trang Admin (`[location.pathname]`).
    + Bắt được Custom Event nội bộ `carelink:admin-refresh-badges`.
  - **Chưa có chu kỳ Polling định kỳ (ví dụ mỗi 30s - 45s)**: Nếu Admin đang ngồi xem màn hình Tổng quan mà bên kia có Điều dưỡng vừa gửi yêu cầu rút tiền, số trên Taskbar cũng sẽ không tự động nhảy lên.

---

## 🔍 IV. CHI TIẾT VẤN ĐỀ 3: TẠI SAO PHÂN HỆ TÀI CHÍNH KHÔNG HIỆN THÔNG BÁO / YÊU CẦU RÚT TIỀN?

### 1. Hiện tượng nhầm lẫn giữa 2 Tab hiển thị (`AdminFinance.jsx`)
- Khi Admin nhấn vào menu **"Tài chính"** (`/admin/finance`), trang được khởi tạo với trạng thái:
  ```javascript
  const [activeTab, setActiveTab] = useState("transactions"); // Dòng 217
  ```
- Tab hiển thị mặc định trước mắt Admin là **"Nhật ký giao dịch"** (hiển thị danh sách các ca chăm sóc được thanh toán, phí sàn 60k, tạm giữ cọc).
- **Yêu cầu rút tiền của Điều dưỡng nằm ở Tab thứ 2: "Yêu cầu rút tiền" (`withdrawals`).**
- **Điểm yếu UX:**
  + Khi vừa vào trang, Admin không hề thấy bảng yêu cầu rút tiền mà chỉ thấy bảng giao dịch ca chăm sóc.
  + Nút tab "Yêu cầu rút tiền" tuy có số đếm `pendingWithdrawals`, nhưng nếu người dùng không chú ý nhìn vào thanh tab con ở giữa trang thì sẽ lầm tưởng là yêu cầu rút tiền không đến được hệ thống.

### 2. Giới hạn phân trang ngầm của Backend Payouts
- Trong `AdminFinance.jsx` (dòng 319):
  ```javascript
  const res = await adminApi.getPayouts(); // Không truyền pageNumber hay pageSize
  ```
- Trong Backend C# (`PayoutsController.cs`):
  ```csharp
  public class PagingQuery {
      public int PageNumber { get; init; } = 1;
      public int PageSize { get; init; } = 10; // Giới hạn mặc định 10 bản ghi!
  }
  ```
- Nếu hệ thống có nhiều hơn 10 yêu cầu, những yêu cầu mới hoặc cũ hơn có thể bị đẩy ra ngoài phạm vi trang đầu mà Admin không thấy nếu giao diện chưa có thanh phân trang Pagination cho tab rút tiền.

### 3. Lệch trường DTO thông tin Điều dưỡng
- Backend `PayoutResponse` trả về: `NurseName`, `BankName`, `BankAccountNumber`, `BankAccountName`, `Amount`, `Status`.
- **Backend KHÔNG trả về `NursePhone`** (Số điện thoại điều dưỡng).
- Frontend đang cố gắng bóc tách `w.nursePhone || w.caregiverPhone || w.user?.phoneNumber || "—"`, dẫn đến cột số điện thoại người thụ hưởng trên bảng luôn hiển thị `"—"`.

### 4. Bất đồng bộ dữ liệu giữa Rút tiền của Điều dưỡng và Khách hàng
- **Điều dưỡng:** Gửi lệnh qua API thật `POST /api/v1/wallet/payouts` -> Lưu vào Database Backend thật.
- **Khách hàng (Gia đình):** Do Backend chưa hỗ trợ Ví điện tử cho Khách hàng (`user.Role == Nurse` mới có ví), nên phần rút tiền của Khách hàng tại `Checkout.jsx` đang lưu tạm vào `localStorage` của trình duyệt (`carelink_family_withdraw_requests`).
- Nếu Admin mở trên một trình duyệt khác (hoặc tab ẩn danh Incognito) so với tab của Khách hàng, Admin sẽ **không thể nhìn thấy** yêu cầu rút tiền của Khách hàng.

---

## 📊 V. BẢNG MA TRẬN PHÂN LOẠI LỖI (DEFECT MATRIX)

| Mã lỗi | Phân loại | Vị trí phát hiện | Mức độ | Mô tả hiện tượng & Nguyên nhân |
| :---: | :---: | :--- | :---: | :--- |
| **DEF-01** | Backend & Hợp đồng API | `CareLinkAPI/Services/WalletService.cs`, `BookingService.cs`, `DisputeService.cs` | 🔴 **Nghiêm trọng (High)** | Backend không có cơ chế phát sinh Notification cho Admin khi có Payout, Verification, Dispute mới. |
| **DEF-02** | Frontend Layout | `src/layouts/AdminLayout.jsx` (L108-151, L398-416) | 🔴 **Nghiêm trọng (High)** | Thanh Sidebar/Taskbar thiếu biến đếm `pendingPayoutsCount` và không hiển thị badge số lượng ở mục "Tài chính". |
| **DEF-03** | Frontend UI/UX | `src/features/admin/pages/AdminFinance.jsx` (L217) | 🟡 **Trung bình (Medium)** | Màn hình Tài chính mặc định mở Tab "Nhật ký giao dịch", không tự cảnh báo hoặc điều hướng đến Tab "Yêu cầu rút tiền" khi có yêu cầu mới. |
| **DEF-04** | Frontend / Realtime | `src/layouts/AdminLayout.jsx` | 🟡 **Trung bình (Medium)** | Thanh Taskbar chưa có Polling chu kỳ (ví dụ mỗi 30s) để tự cập nhật badge khi Admin đang xem trang khác. |
| **DEF-05** | Hợp đồng API (DTO) | `CareLinkAPI/DTOs/Wallet/WalletDtos.cs` & `AdminFinance.jsx` | 🟢 **Nhẹ (Low)** | `PayoutResponse` của BE thiếu trường `NursePhone`, khiến cột số điện thoại điều dưỡng bị hiển thị `"—"`. |
| **DEF-06** | Kiến trúc dữ liệu | `Checkout.jsx` vs `AdminFinance.jsx` | 🟡 **Trung bình (Medium)** | Rút tiền Khách hàng dùng `localStorage` cục bộ, không đồng bộ được sang tài khoản Admin trên máy khác/trình duyệt khác. |

---

## 🛠️ VI. ĐỀ XUẤT GIẢI PHÁP KHẮC PHỤC ĐỒNG BỘ (RECOMMENDED FIXES)

> ⚠️ *Lưu ý: Theo đúng yêu cầu của bạn ("Nên xem xét lại các lỗi trước không cần sửa liền"), đây là kế hoạch giải pháp chi tiết để đội ngũ xem xét trước khi thực hiện chỉnh sửa.*

### 1. Phía Frontend (`CareLink_FE`) — Có thể chủ động xử lý ngay:
- **Nâng cấp Taskbar (`AdminLayout.jsx`):**
  1. Thêm state `pendingPayoutsCount` vào `AdminLayout`.
  2. Bổ sung hàm gọi `adminApi.getPayouts({ pageNumber: 1, pageSize: 100 })` trong `fetchRealCounts` để đếm số lượng yêu cầu có trạng thái `Pending` (`status === 1` hoặc `"Pending"`).
  3. Gắn badge số lượng này vào mục `{ path: "/admin/finance" }`.
  4. Bổ sung chu kỳ Polling (30s - 45s) đồng bộ với `NotificationDropdown` để Taskbar tự nhảy số khi có yêu cầu mới phát sinh.
- **Tối ưu trải nghiệm màn hình Tài chính (`AdminFinance.jsx`):**
  1. Bổ sung banner nổi bật hoặc tự động chuyển sang tab "Yêu cầu rút tiền" nếu có yêu cầu rút tiền đang chờ duyệt.
  2. Truyền tham số `pageSize: 100` khi gọi `adminApi.getPayouts` để không bị mất bản ghi quá giới hạn 10 mặc định.
  3. Thêm nút chuyển nhanh giữa 2 tab kèm thông báo số lượng rõ ràng.

### 2. Phía Backend (`CareLink_BE`) — Cần phối hợp cập nhật:
- **Bổ sung Notification Types cho Admin:**
  + Thêm hằng số `NotificationTypes.PayoutRequested = "PAYOUT_REQUESTED"`.
  + Thêm hằng số `NotificationTypes.NurseVerificationSubmitted = "NURSE_VERIFICATION_SUBMITTED"`.
  + Thêm hằng số `NotificationTypes.DisputeSubmitted = "DISPUTE_SUBMITTED"`.
- **Thêm logic tạo Notification cho Admin khi có sự kiện:**
  + Trong `WalletService.RequestPayoutAsync`: Tìm danh sách User có Role là `Admin`, gọi `notifications.AddAsync(...)` để đẩy thông báo *"Điều dưỡng [Tên] vừa yêu cầu rút [Số tiền]đ"*.
  + Trong `NurseVerificationService.SubmitVerificationAsync`: Gửi thông báo *"Có hồ sơ điều dưỡng mới cần thẩm định"*.
  + Trong `DisputeService`: Gửi thông báo *"Có khiếu nại ca chăm sóc mới cần xử lý"*.
- **Bổ sung trường `NursePhone` vào `PayoutResponse`:**
  + Giúp Admin xem được ngay số điện thoại liên hệ của Điều dưỡng khi duyệt chi.

---
*Báo cáo được lập tự động dựa trên kiểm tra mã nguồn thực tế tại kho lưu trữ CareLink.*
