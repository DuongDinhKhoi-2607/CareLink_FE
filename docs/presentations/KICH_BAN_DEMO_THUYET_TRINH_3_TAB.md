# 🎙️ KỊCH BẢN THUYẾT TRÌNH & DEMO TỔNG THỂ DỰ ÁN CARELINK (CHI TIẾT 3 TAB ROLES)

> **Dành cho:** Buổi bảo vệ Đồ án / Báo cáo Tiến độ với Giảng viên & Hội đồng Đánh giá  
> **Thời lượng demo chuẩn:** **8 – 10 phút** (Mạch lạc, chuyên nghiệp, tự nhiên, bao quát 100% tính năng cốt lõi và giá trị y tế)  
> **Mật khẩu chung cho tất cả tài khoản:** `123456`

---

## 🛠️ PHẦN 0: CHIẾN LƯỢC CHUẨN BỊ & TỔ CHỨC 3 TAB

### 1. Phân bổ 3 Cửa sổ Trình duyệt (Chrome Profiles hoặc Ẩn danh):
Đặt 3 cửa sổ cạnh nhau hoặc dùng 3 tab mở sẵn để chuyển đổi nhanh bằng phím tắt `Ctrl + Tab`:

| Cửa sổ | Vai trò (Role) | Tài khoản sử dụng | Mật khẩu | Trang mở sẵn |
| :---: | :--- | :--- | :---: | :--- |
| **Tab 1** | **Khách hàng (Family)** | `khachhang.long@carelink.vn` | `123456` | `http://localhost:5173/` *(Trang chủ)* |
| **Tab 2** | **Điều dưỡng (Nurse)** | `lan.nguyen@carelink.vn`<br>*(kèm 1 tab phụ để đăng ký thử)* | `123456` | `http://localhost:5173/caregiver/dashboard` |
| **Tab 3** | **Quản trị viên (Admin)** | `admin@carelink.vn` | `123456` | `http://localhost:5173/admin/dashboard` |

---

### 2. Chiến lược xử lý tài khoản demo thông minh & tự nhiên:
* **Giai đoạn 1 (Đăng ký Điều dưỡng & Thẩm định CCCD/Bằng cấp):** 
  - Mở form đăng ký nhanh vai trò Sinh viên Y khoa / Điều dưỡng hoặc cho Thầy/Cô xem trực tiếp hồ sơ chờ duyệt của `Phạm Quốc Duy` trong trang Admin. 
  - Thể hiện rõ: Tính năng OTP email trường `.edu.vn`, CCCD 2 mặt và quy trình Admin thẩm định chất lượng y tế nghiêm ngặt.
* **Giai đoạn 2 (Đặt ca trực, Deal giá trong Chat, Thanh toán PayOS, Bệnh án & Ví tiền):** 
  - Sử dụng tài khoản chính của **Anh Long** (`khachhang.long@carelink.vn`) và **Cô Lan** (`lan.nguyen@carelink.vn`).
  - *Lý do:* Tài khoản này đã có sẵn người thân là cụ An (82 tuổi), địa chỉ thực tế tại Q.1, lịch rảnh đồng bộ, tọa độ GPS check-in và ca trực thực tế. Demo mượt mà 100%, không bị vấp hay tốn thời gian gõ form.
  - *Câu nối tự nhiên với Giảng viên:* *"Sau khi tài khoản điều dưỡng được thẩm định và kích hoạt, em xin phép mở một ca trực thực tế giữa gia đình anh Nguyễn Hoàng Long và điều dưỡng cô Nguyễn Thị Mai Lan để Thầy/Cô quan sát trọn vẹn luồng Đặt lịch linh hoạt, Đàm phán đề xuất trong Chat, Bệnh án lâm sàng và Nghiệm thu giải ngân ví ạ."*

---

### 3. Lệnh Reset Database về trạng thái mẫu ban đầu (Khi cần tập dượt lại):
```bash
dotnet test --filter "FullyQualifiedName=CareLinkAPI.Tests.DemoDbSeeder.ResetAndSeedDemoDataAsync"
```

---

## 🎬 KỊCH BẢN CHI TIẾT THEO TỪNG BƯỚC (STEP-BY-STEP SPEAKER SCRIPT)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               LỘ TRÌNH DEMO TOÀN DIỆN                                  │
│                                                                                        │
│ [1. Mở đầu Trang chủ] ──> [2. Đăng ký & Duyệt Điều dưỡng] ──> [3. Bảng giá & Lịch rảnh]│
│                                                                           │            │
│ [5. Bệnh án & Nghiệm thu] <── [4. Đặt lịch, Deal Chat & PayOS] <──────────┘            │
│            │                                                                           │
│            └──> [6. Ví tiền & Duyệt rút Admin] ──> [7. Đánh giá, Khiếu nại & Cẩm nang] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 📍 BƯỚC 1: MỞ ĐẦU & GIỚI THIỆU TỔNG QUAN TẠI TRANG CHỦ (1 PHÚT)
* **Vị trí màn hình:** **Tab 1 (Trang chủ `http://localhost:5173/`)**

#### 🖱️ Thao tác:
1. Đứng tại **Trang chủ (`/`)**, cuộn nhẹ lướt qua Hero banner, 3 trụ cột giá trị y tế và các gói dịch vụ nổi bật (Chăm sóc người cao tuổi, Chăm sóc mẹ & bé sơ sinh, Chăm sóc sau phẫu thuật...).
2. Rê chuột chỉ vào nút **"Dành cho Gia đình"** và **"Dành cho Điều dưỡng"** trên thanh Header.

#### 🎙️ Lời thoại với Giảng viên:
> *"Em kính chào Thầy/Cô ạ. Hôm nay nhóm em xin phép demo hệ thống **CareLink - Nền tảng kết nối điều dưỡng và chăm sóc y tế tại gia**.*  
>
> *Xuất phát từ thực tế hiện nay, khi các gia đình có người thân lớn tuổi cần chăm sóc, người bệnh sau mổ hay cần tiêm truyền tại nhà, việc tìm kiếm điều dưỡng có chuyên môn y khoa thật sự rất khó khăn và thiếu an tâm. Ngược lại, hàng ngàn điều dưỡng viên và sinh viên y khoa năm cuối lại thiếu một kênh chính thống để gia tăng thu nhập đúng với chuyên môn.*  
>
> *CareLink ra đời nhằm giải quyết bài toán này với 3 vai trò rõ rệt: **Gia đình**, **Điều dưỡng viên**, và **Ban Quản trị kiểm soát chất lượng y tế**. Sau đây em xin phép bắt đầu từ hành trình gia nhập của một Điều dưỡng viên mới ạ."*

---

### 📍 BƯỚC 2: ĐĂNG KÝ SINH VIÊN Y KHOA & ADMIN PHÊ DUYỆT (2 PHÚT)
* **Vị trí màn hình:** Chuyển đổi giữa **Tab 2 (Điều dưỡng)** và **Tab 3 (Admin)**

#### 🖱️ Thao tác tại Tab 2 (Điều dưỡng):
1. Bấm vào nút **"Tham gia mạng lưới điều dưỡng"** (hoặc mở trang Đăng ký `/caregiver/choose-role`).
2. Chọn vai trò: **"Sinh viên Y khoa / Điều dưỡng thực tập"**.
3. Điền nhanh form đăng ký:
   - Nhập email trường có đuôi `.edu.vn` (hệ thống có bước xác thực mã OTP gửi về email sinh viên để đảm bảo đúng sinh viên y khoa).
   - Tải lên ảnh chụp **Thẻ sinh viên** và **CCCD 2 mặt**.
   - Bấm **"Gửi hồ sơ thẩm định"**.
4. Màn hình Dashboard điều dưỡng xuất hiện:
   - Trên Header: Badge hiển thị trạng thái màu vàng: **`Đang xác minh (Pending)`**.
   - Trên Dashboard: Hiện banner thông báo: *"Hồ sơ đang chờ Quản trị viên thẩm định chứng chỉ trong vòng 24h"*.
   - Bấm vào nút **"Hướng dẫn sử dụng"** trên thanh Header: Mở ra **Cẩm nang Điều dưỡng CareLink**.
   - Lướt nhanh qua các tab hướng dẫn: giải thích cho cô thấy người mới vào sẽ đọc cẩm nang này để biết rõ quy trình 6 bước tiếp nhận và xử lý ca trực.

#### 🎙️ Lời thoại Tab 2:
> *"Thưa Cô, CareLink có chính sách đặc thù nhằm tạo điều kiện cho các bạn sinh viên y khoa từ năm 3 trở lên tham gia hỗ trợ cộng đồng. Khi đăng ký, sinh viên bắt buộc phải xác thực qua Email trường y khoa và nộp ảnh chụp Thẻ SV, CCCD 2 mặt.*  
>
> *Khi vừa vào Dashboard, tài khoản sẽ ở trạng thái **Chưa kích hoạt**. Điều dưỡng có thể bấm vào nút **Cẩm nang hướng dẫn** ngay trên Header để nắm rõ toàn bộ quy trình làm việc. Lúc này, điều dưỡng chưa thể nhận việc cho đến khi Admin kiểm duyệt."*

---

#### 🖱️ Thao tác chuyển sang Tab 3 (Admin duyệt hồ sơ):
1. Chuyển sang **Tab 3 (Admin `admin@carelink.vn`)**.
2. Bấm vào menu **"Duyệt điều dưỡng"** (`/admin/approvals`):
   - Chỉ vào Badge số **`2`** trên sidebar (khớp chính xác với số hồ sơ chờ duyệt thực tế trong hệ thống).
   - Cho cô xem danh sách có hồ sơ chờ duyệt (như `Phạm Quốc Duy` hoặc hồ sơ mới nộp).
3. Bấm nút **"Xem hồ sơ"**:
   - Modal thẩm định mở ra: Cho cô xem ảnh CCCD 2 mặt, bằng tốt nghiệp hoặc thẻ SV.
   - Admin kiểm tra checklist đối soát: *Đúng định danh CCCD, Đúng chuyên môn y tế*.
   - Nhấn mạnh: *"Nếu hồ sơ không đạt, Admin có nút **Từ chối** kèm ô nhập lý do cụ thể để điều dưỡng bổ sung lại. Nếu đạt chuẩn, Admin bấm **Phê duyệt hồ sơ**."*
4. Bấm **"Phê duyệt"** (Approve).
5. Quay lại **Tab 2 (Điều dưỡng)** nhấn F5: Badge lập tức đổi sang màu xanh ngọc: **`Đã xác minh (Approved)`**!

---

### 📍 BƯỚC 3: CÀI ĐẶT BẢNG GIÁ DỊCH VỤ & LỊCH RẢNH ĐIỀU PHỐI (1.5 PHÚT)
* **Vị trí màn hình:** **Tại Tab 2 (Điều dưỡng cô Lan)**

#### 🖱️ Thao tác:
1. **Vào mục "Bảng giá dịch vụ" (`/caregiver/pricing`):**
   - Cho cô xem danh sách dịch vụ: Bật các dịch vụ đúng chuyên môn (ví dụ: *Chăm sóc cơ bản, Chăm sóc người cao tuổi, Chăm sóc sau phẫu thuật*).
   - Chỉ vào ô nhập đơn giá: Tự chủ nhập giá (ví dụ: `250.000 VNĐ`), thời lượng ước tính (`60 phút`).
   - Bấm nút xoay tròn `RotateCcw` bên cạnh: Trả về đơn giá niêm yết chuẩn nếu muốn đặt lại.
   - Bấm **"Lưu cấu hình bảng giá"** -> Thông báo Toast xanh xác nhận thành công.
2. **Vào mục "Lịch làm việc & Nhận ca" (`/caregiver/schedule`):**
   - Chỉ vào thanh: **"Khu vực điều phối & Nhận ca"**:
     - Hiển thị rõ: 📍 Điểm xuất phát (Quận 1, TP. HCM) và 🚗 Bán kính nhận ca (10 km).
     - Bấm nút *"Cập nhật vị trí & bán kính"* để cho cô xem popup điều chỉnh nhanh tại chỗ (tự động đồng bộ 2 chiều với Hồ sơ năng lực).
   - Chỉ vào lưới lịch tuần: Bấm nút nhanh **"Bật rảnh cả tuần (06:00 – 22:00)"** hoặc bật rảnh hôm nay -> Bấm **"Lưu & Đồng bộ lịch tuần"**.
   - Cuộn xuống phần **"Đăng ký ngày nghỉ đột xuất (Blackout Dates)"**: Giải thích nếu có việc bận cá nhân thì đăng ký ngày nghỉ tại đây để hệ thống tự động khóa lịch, khách không thể book vào ngày đó.

#### 🎙️ Lời thoại Tab 2:
> *"Sau khi được phê duyệt, để sẵn sàng nhận ca, điều dưỡng sẽ thực hiện 2 thao tác chuyên nghiệp:*  
> *1. **Cài đặt Bảng giá:** Tự chủ bật/tắt các dịch vụ đúng với tay nghề của mình và định giá thù lao minh bạch.*  
> *2. **Cài đặt Lịch làm việc:** Bật các ô giờ rảnh trong tuần. Hệ thống có ràng buộc chặt chẽ: Chỉ những khung giờ điều dưỡng bật rảnh và nằm trong bán kính hoạt động thì khách hàng mới có thể tìm thấy và đặt ca.*  
>
> *Bây giờ, em xin phép chuyển sang vai trò **Gia đình khách hàng** để thực hiện luồng tìm kiếm, trao đổi và đặt lịch ca chăm sóc ạ."*

---

### 📍 BƯỚC 4: KHÁCH HÀNG TÌM KIẾM, PHIẾU ĐẶT LỊCH NHANH, DEAL GIÁ TRONG CHAT & THANH TOÁN VIETQR PAYOS (2 PHÚT)
* **Vị trí màn hình:** Chuyển đổi giữa **Tab 1 (Khách hàng Long)** và **Tab 2 (Điều dưỡng Lan)**

#### 🖱️ Thao tác 1 (Tại Tab 1 - Khách hàng Long):
1. Vào mục **"Tìm điều dưỡng"** (`/caregivers`):
   - Giải thích: Thuật toán Haversine chỉ hiển thị những điều dưỡng **đã được Admin xác minh**, **đang online nhận việc** và **nằm trong bán kính di chuyển**.
   - Thấy hồ sơ cô **Đặng Thị Thu Thảo** hoặc **Nguyễn Thị Mai Lan** (5.0 ⭐, Cử nhân ĐH Y Dược TP.HCM).
2. Bấm vào hồ sơ để xem chi tiết:
   - Thấy bảng giá minh bạch, các dịch vụ nhận làm và đánh giá từ các gia đình khác.
   - Bấm nút **"Đặt ca chăm sóc ngay"**:
     - Modal chuẩn hóa **"Phiếu đặt lịch nhanh • Chọn giờ linh hoạt"** mở ra:
       - **Mục 1 (Người thân):** Chọn cụ *Nguyễn Văn An (82 tuổi)*. Bấm nút **`(i)`** bên cạnh: Xem tóm tắt y tế (tiền sử dị ứng, khả năng di chuyển).
       - **Mục 2 (Địa chỉ):** Chọn địa chỉ nhà riêng tại Quận 1.
       - **Mục 3 (Dịch vụ):** Bấm chọn *Chăm sóc người cao tuổi*, bấm dấu `+` tăng 2 ca hoặc chọn thêm gói phụ, chọn chăm sóc tăng cường `+30p`.
       - **Mục 4 (Khung giờ trực khả dụng):** Hệ thống gọi API realtime `available-slots`, hiển thị các ô giờ còn trống (màu xanh lá) và khóa các ô đã kín/quá giờ. Chọn khung giờ mong muốn.
       - **Mục 5 (Giờ yêu cầu & Cam kết y tế):** Nhập giờ cụ thể (ví dụ: `Có mặt lúc 17:15`), tích chọn cam kết chia sẻ tóm tắt bệnh án y tế.
       - **Mục 6 (Tài chính minh bạch):** Hiển thị rõ tổng tiền dịch vụ + **60.000 VNĐ phí nền tảng CareLink**.
3. **Thử nghiệm tính năng Trao đổi & Đàm phán trực tiếp trong Chat:**
   - Đóng modal, bấm nút **"Nhắn tin & Trao đổi"** (`/chat`):
   - Mở cuộc trò chuyện 2 chiều bảo mật giữa anh Long và Điều dưỡng.
   - Góc phải màn hình: Tóm tắt tiến trình thỏa thuận, nguyên tắc bảo vệ quyền lợi.
   - Nút **"Đặt lịch ca trực (Xem lịch rảnh)"** với icon lịch hẹn y tế chuẩn. Nút **"Rời cuộc trò chuyện (Quay lại danh sách)"** giúp khách an tâm quay lại tìm điều dưỡng khác khi cần mà không mất tin nhắn cũ.
   - Bấm nút đặt lịch trong chat: Bật công tắc **"Thương lượng giá theo thỏa thuận (Proposal)"** -> Nhập mức giá đề xuất (ví dụ: `280.000 VNĐ`) kèm ghi chú dặn dò -> Bấm **"Gửi đề xuất thỏa thuận"**.
   - Thẻ đề xuất ca trực lập tức xuất hiện ngay trong luồng tin nhắn!

---

#### 🖱️ Thao tác 2 (Tại Tab 2 - Điều dưỡng Lan chấp thuận đề xuất):
1. Chuyển sang **Tab 2 (Điều dưỡng Lan)** -> Mục **"Tin nhắn & Trao đổi"**:
   - Nhận được thẻ đề xuất ca từ anh Long.
   - Điều dưỡng có 3 nút hành động chuẩn: *Chấp nhận ca*, *Đề xuất giá mới (Counter-offer)* hoặc *Từ chối*.
   - Cô Lan bấm **"Chấp thuận ca trực"**.
   - Hệ thống tự động chuyển trạng thái ca sang `PendingPayment` và giữ chỗ độc quyền trong vòng 30 phút.

---

#### 🖱️ Thao tác 3 (Tại Tab 1 - Khách thanh toán VietQR PayOS):
1. Quay lại Tab anh Long: Nút **"Thanh toán ngay qua PayOS"** kích hoạt.
2. Bấm thanh toán -> Chuyển sang màn hình **Thanh toán VietQR PayOS**:
   - Hiển thị mã QR ngân hàng tự động, đúng số tiền (tiền dịch vụ + 60.000đ phí sàn).
   - Nội dung chuyển khoản chuẩn theo mã đơn.
3. Sau khi thanh toán hoàn tất, chuyển về trang **Lịch hẹn của tôi** (`/appointments`):
   - Ca trực của cụ An xuất hiện ngay trên đầu với trạng thái màu xanh ngọc: **`ĐÃ TIẾP NHẬN`**!

#### 🎙️ Lời thoại Bước 4:
> *"Thưa Thầy/Cô, CareLink mang đến trải nghiệm 2 trong 1: Khách hàng có thể **Đặt lịch nhanh 1 chạm** theo lịch rảnh thực tế, hoặc **Đàm phán trong Chat** nếu ca bệnh phức tạp cần thương lượng giá.*  
>
> *Về mặt tài chính, CareLink áp dụng chính sách **Phí nền tảng cố định 60.000 VNĐ / ca** theo quyết định kiến trúc ADR-002. Toàn bộ tiền thanh toán được tạm giữ an toàn trong Quỹ giữ chỗ (Escrow), bảo vệ 100% quyền lợi của gia đình cho đến khi ca trực được hoàn thành trọn vẹn ạ."*

---

### 📍 BƯỚC 5: ĐIỀU DƯỠNG BẮT ĐẦU CA, GHI BỆNH ÁN SINH HIỆU & NGHIỆM THU 2 CHIỀU (2.5 PHÚT)
* **Vị trí màn hình:** Chuyển đổi giữa **Tab 2 (Điều dưỡng)** và **Tab 1 (Khách hàng)**
* **Bối cảnh:** Điều dưỡng đã đến nhà anh Long chăm sóc cho cụ An.

#### 🖱️ Thao tác 1 (Tại Tab 2 - Điều dưỡng tiếp nhận và bắt đầu ca):
1. Vào mục **"Yêu cầu nhận ca"** (`/caregiver/booking-requests`):
   - Thấy ngay ca trực của cụ **Nguyễn Văn An**.
   - **Xem thông tin chi tiết:**
     - Thẻ bệnh nhân: Tuổi thật (82 tuổi), Giới tính Nam, Tiền sử bệnh án (Tăng huyết áp, thoái hóa khớp).
     - Badge bảo mật: *"Chia sẻ bệnh án y tế: Đã đồng ý"*.
     - Giờ yêu cầu có mặt: Nổi bật với nhãn *"Yêu cầu có mặt tại nhà: 17:15"*.
     - Chi tiết Combo dịch vụ: Liệt kê rõ các gói kèm số lượng, thời lượng và phụ phí extra time.
     - Ghi chú dặn dò từ gia đình.
2. Đến giờ hẹn, điều dưỡng bấm nút **"Bắt đầu ca chăm sóc"**:
   - Hệ thống kích hoạt **GPS Check-in**: Lấy tọa độ GPS thiết bị thực tế để đối chiếu với địa chỉ nhà bệnh nhân.
   - Trạng thái ca trực chuyển sang: **`ĐANG THỰC HIỆN (In Progress)`**.
3. Đến cuối ca trực, điều dưỡng bấm nút **"Ghi nhận Bệnh án & Hoàn thành ca"**:
   - Modal bệnh án mở ra, điều dưỡng nhập các chỉ số lâm sàng đo thực tế:
     - Huyết áp: `125/82 mmHg` | Nhịp tim: `76 bpm` | Đường huyết: `5.6 mmol/L` | Nhiệt độ: `36.8°C`.
     - Vết mổ / Vết thương: *Vết mổ khô ráo, đã thay băng vô khuẩn*.
     - Vận động & Dặn dò: *Cụ tập co duỗi khớp nhẹ nhàng 15 phút, đã nhắc cụ uống thuốc lúc 18:00*.
4. Bấm nút: **"Lưu bệnh án & Ký hoàn thành"**.
5. Ca trực chuyển sang trạng thái chờ gia đình kiểm tra và nghiệm thu.

---

#### 🖱️ Thao tác 2 (Tại Tab 1 - Khách hàng Long ký nghiệm thu):
1. Tại Tab anh Long, chuông thông báo hiển thị tin nhắn mới:  
   *`"Điều dưỡng đã gửi báo cáo y tế và ký hoàn thành ca. Quý khách vui lòng kiểm tra và ký nghiệm thu."`*
2. Vào mục **"Lịch hẹn"** -> Bấm nút **"Xem báo cáo y tế"**:
   - Gia đình xem được trọn vẹn toàn bộ hồ sơ sinh hiệu huyết áp, đường huyết mà điều dưỡng vừa đo cho cụ An.
3. Bấm vào nút: **"Ký xác nhận nghiệm thu hoàn tất"** (Customer Confirm).
4. Ca trực chính thức chuyển sang trạng thái: **`ĐÃ HOÀN THÀNH`**.
5. **Giá trị gia tăng:** Báo cáo sinh hiệu này đồng thời được tự động lưu vào mục **"Hồ sơ sức khỏe"** bên menu trái của gia đình để theo dõi biểu đồ tiến triển lâu dài của cụ An!

#### 🎙️ Lời thoại Bước 5:
> *"Thưa Cô, đây là chốt chặn an toàn y tế quan trọng nhất của dự án: **Cơ chế Nghiệm thu 2 chiều (Two-way Confirmation)**.*  
> *Điều dưỡng đến nơi phải check-in GPS và lập bệnh án điện tử với các chỉ số sinh hiệu cụ thể. Chỉ khi gia đình kiểm tra báo cáo y tế và bấm **Ký xác nhận nghiệm thu** thì ca trực mới chính thức hoàn tất và hệ thống mới giải ngân tiền công vào ví. Cơ chế này loại bỏ hoàn toàn rủi ro điều dưỡng làm ẩu hay bỏ ca giữa chừng ạ."*

---

### 📍 BƯỚC 6: GIẢI NGÂN VÍ ĐIỀU DƯỠNG & RÚT TIỀN TẠI ADMIN (1.5 PHÚT)
* **Vị trí màn hình:** Chuyển sang **Tab 2 (Điều dưỡng)** rồi sang **Tab 3 (Admin)**

#### 🖱️ Thao tác 1 (Tại Tab 2 - Điều dưỡng xem ví & tạo lệnh rút):
1. Tại Tab Điều dưỡng, nhấp vào mục **"Ví & Rút tiền"** (`/caregiver/wallet`):
   - Số dư khả dụng lập tức được cộng thêm tiền công ca trực.
   - Cuộn xuống Lịch sử giao dịch: Dòng sao kê `+250.000đ · Thù lao ca trực cụ Nguyễn Văn An`.
   - Nhấn mạnh: Điều dưỡng nhận trọn vẹn 100% tiền công thỏa thuận, không bị trừ thêm bất kỳ % hoa hồng nào từ tiền công.
2. Bấm nút **"Yêu cầu rút tiền"**:
   - Nhập số tiền muốn rút: `250.000đ`.
   - Chọn ngân hàng: `Vietcombank` | STK: `0071001234567` | Chủ TK: `NGUYEN THI MAI LAN`.
   - Bấm **"Gửi yêu cầu rút tiền"** -> Lệnh rút xuất hiện ở trạng thái *Chờ đối soát*.

---

#### 🖱️ Thao tác 2 (Tại Tab 3 - Admin duyệt chi chuyển khoản):
1. Chuyển sang Tab Admin -> Vào mục **"Tài chính & Ví"** (`/admin/finance`) -> Tab **"Yêu cầu rút tiền"**:
   - Thấy ngay lệnh rút 250.000đ của điều dưỡng nằm ở đầu danh sách.
2. Bấm nút **"Phê duyệt"**:
   - Nhập mã giao dịch tham chiếu ngân hàng: `VCB-987654`.
   - Bấm **"Xác nhận chuyển khoản"**.
   - Trạng thái lập tức đổi thành **"Đã chuyển khoản"**.
3. Quay lại Tab Điều dưỡng F5: Dòng giao dịch đổi sang màu xanh lá **"Đã chuyển khoản thành công"**!

---

### 📍 BƯỚC 7: CÁC GIÁ TRỊ VẬN HÀNH BỔ TRỢ (1 PHÚT)

#### 🌟 1. Cơ chế Đánh giá & Chính sách Bảo mật 7 ngày (Blind Review Policy):
* **Tại Tab 1 (Anh Long):** Vào Lịch hẹn -> Ca đã hoàn thành -> Bấm **"Đánh giá ca trực"**.
  - Khách hàng chấm điểm 4 tiêu chí chuyên môn và nhập nhận xét thực tế -> Bấm **Gửi đánh giá**.
  - Nhận xét và điểm số thực tế được lưu vào hệ thống và hiển thị lên Hồ sơ công khai của Điều dưỡng trên sàn.
  - **Điểm sáng nghiệp vụ (Chính sách Đánh giá mù đôi - Blind Review):**
    > *"Thưa Cô, để đảm bảo tính khách quan tối đa và triệt tiêu hoàn toàn rủi ro hiềm khích hay trả đũa đánh giá giữa hai bên, CareLink áp dụng **Cơ chế đánh giá mù đôi (Blind Review Policy)**: Sau khi gửi, nhận xét của Điều dưỡng dành cho Gia đình sẽ được hệ thống tạm thời bảo mật và chỉ tự động công khai sau **7 ngày**. Điều này giúp cả khách hàng và điều dưỡng hoàn toàn yên tâm đánh giá trung thực mà không sợ bị đối phương phản ứng tiêu cực ạ."*

#### 🌟 2. Xử lý Khiếu nại (Disputes) & Bảo vệ Quỹ Escrow:
* **Tại Tab 3 (Admin):** Vào mục **"Khiếu nại"** (`/admin/disputes`):
  - Cho cô xem danh sách khiếu nại thực tế từ các ca trực.
  - Bấm xem chi tiết một ca khiếu nại: Admin đọc tường trình từ khách hàng, phản hồi của điều dưỡng và ảnh chụp bằng chứng y tế.
  - Giải thích 3 kịch bản phân xử có thẩm quyền:
    - **Hoàn tiền 100%:** Khi điều dưỡng vi phạm y đức nghiêm trọng hoặc vắng mặt không lý do.
    - **Hoàn tiền 50%:** Khi ca trực bị gián đoạn hoặc hai bên cùng có thiếu sót thỏa thuận.
    - **Bác bỏ khiếu nại:** Khi điều dưỡng thực hiện đúng quy trình chuyên môn nhưng khách hàng phản ánh không có căn cứ.

#### 🌟 3. Cẩm nang Y tế CareLink (Medical Handbook):
* **Tại Tab 3 (Admin):** Vào mục **"Cẩm nang y tế"** (`/admin/handbook`): Admin đăng tải các bài viết y khoa được biên soạn từ các nguồn bệnh viện uy tín (Vinmec, Bệnh viện Lão khoa, Bộ Y tế).
* **Tại Tab 1 (Family):** Bấm vào mục **"Cẩm nang y tế"** trên thanh Header:
  - Chỉ vào Banner khuyến cáo: *"Bài viết mang tính tham khảo y khoa, không thay thế chẩn đoán bác sĩ"*.
  - Bấm mở bài viết *"5 Dấu hiệu suy giảm sức khỏe ở người cao tuổi"*:
    - Cho cô xem giao diện bài viết chuyên nghiệp, biểu tượng ống nghe y tế trang nhã.
    - Cuộn xuống chân bài viết: Có mục **"Tài liệu tham khảo"** trích dẫn nguồn uy tín để người dân bấm vào đọc bài báo gốc.

---

### 🎯 LỜI KẾT BÀI TỰ TIN TRƯỚC HỘI ĐỒNG:
> *"Thưa Thầy/Cô, qua toàn bộ kịch bản vừa rồi, nhóm em đã chứng minh CareLink không chỉ là một ứng dụng kết nối đơn thuần, mà là một **hệ sinh thái y tế hoàn chỉnh**:  
> 1. **Đảm bảo an toàn chuyên môn y tế:** Kiểm duyệt chặt chẽ chứng chỉ hành nghề, xác thực thẻ SV Y khoa, check-in GPS và lập bệnh án điện tử bắt buộc.  
> 2. **Đảm bảo công bằng & minh bạch tài chính:** Cơ chế tạm giữ tiền Escrow, phí sàn cố định 60k/ca và giải ngân tự động qua quy trình Nghiệm thu 2 chiều.  
> 3. **Nâng cao giá trị cộng đồng:** Hồ sơ sức khỏe người thân lưu trữ lâu dài và Cẩm nang y tế chính thống được thẩm định.  
>
> Toàn bộ hệ sinh thái đã được kết nối API thật E2E giữa Backend .NET 10, Supabase PostgreSQL và Frontend React 19.  
> 
> **Dạ phần trình bày về luồng vận hành hệ thống của em đến đây là kết thúc. Nhóm em rất mong nhận được những góp ý quý báu từ Thầy/Cô ạ!**"*
