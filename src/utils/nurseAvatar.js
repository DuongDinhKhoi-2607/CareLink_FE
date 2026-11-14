import { resolveDocumentUrl } from "../api/axiosClient";

/**
 * Bộ ảnh chân dung thật của 4 Điều dưỡng & Sinh viên Điều dưỡng cốt lõi của CareLink
 * mặc áo blouse trắng chuẩn y khoa phục vụ trình diễn & vận hành.
 */
export const VIETNAMESE_NURSE_AVATARS = {
    maiLan: "/images/nurses/mai-lan.jpg",
    vanMinh: "/images/nurses/van-minh.jpg",
    leThao: "/images/nurses/le-thao.jpg",
    kimChi: "/images/nurses/kim-chi.jpg",
    thuThao: "/images/nurses/thu-thao.jpg",
    hoangNam: "/images/nurses/hoang-nam.jpg",
    khanhQuoc: "/images/nurses/khanh-quoc.jpg",
    tuongVy: "/images/nurses/tuong-vy.jpg",
};

/**
 * Avatar hoạt hình chuẩn y khoa mặc định dành cho tất cả điều dưỡng mới tạo tài khoản
 * khi chưa cập nhật hoặc tải lên ảnh đại diện cá nhân.
 */
export const DEFAULT_NURSE_AVATAR = "/images/caregiver_avatar.svg";

/**
 * Chuẩn hóa đường dẫn ảnh chân dung điều dưỡng:
 * 1. Ưu tiên 100% ảnh thật người dùng tự tải lên (/uploads/documents/..., data:, blob:, google avatar).
 * 2. Loại bỏ hoàn toàn ảnh mẫu stock photo người đeo khẩu trang cầm ống nghiệm (/images/caregiver-hero.jpg).
 * 3. Ánh xạ đúng 4 điều dưỡng cốt lõi (Trần Văn Minh, Hoàng Kim Chi, Nguyễn Thị Mai Lan, Lê Thị Thảo).
 * 4. Tất cả điều dưỡng mới tạo chưa có ảnh -> Trả về avatar hoạt hình chuẩn y khoa (/images/caregiver_avatar.svg).
 */
export function resolveNurseAvatar(rawAvatar, fullName = "", email = "", practitionerType = 1) {
    const name = String(fullName || "").toLowerCase();
    const mail = String(email || "").toLowerCase();
    const url = String(rawAvatar || "").trim();

    // 1. Nếu là ảnh người dùng tự tải lên (qua API /api/v1/uploads, data URI hoặc blob) -> Ưu tiên số 1
    if (
        url.startsWith("data:image/") ||
        url.startsWith("blob:") ||
        url.includes("/uploads/documents/") ||
        url.startsWith("/uploads/")
    ) {
        return resolveDocumentUrl ? resolveDocumentUrl(url) : url;
    }

    // 2. Nếu là ảnh thật trong kho /images/nurses/
    if (url.startsWith("/images/nurses/")) {
        return url;
    }

    // 3. Nếu là URL tuyệt đối hợp lệ (ví dụ ảnh đại diện Google Login của người dùng, trừ Unsplash/Pravatar mẫu)
    if (url.startsWith("http://") || url.startsWith("https://")) {
        const isStockPlaceholder =
            url.includes("unsplash.com") ||
            url.includes("pravatar.cc") ||
            url.includes("ui-avatars.com") ||
            url.includes("randomuser.me");
        if (!isStockPlaceholder) {
            return url;
        }
    }

    // 4. Ánh xạ danh tính 4 điều dưỡng mẫu theo tên hoặc email
    if (name.includes("mai lan") || mail.includes("lan.nguyen")) return VIETNAMESE_NURSE_AVATARS.maiLan;
    if (name.includes("văn minh") || name.includes("van minh") || mail.includes("minh.tran")) return VIETNAMESE_NURSE_AVATARS.vanMinh;
    if (name.includes("kim chi") || mail.includes("chi.hoang")) return VIETNAMESE_NURSE_AVATARS.kimChi;
    if (name.includes("lê thị thảo") || name.includes("le thi thao") || mail.includes("thao.le")) return VIETNAMESE_NURSE_AVATARS.leThao;
    if (name.includes("thu thảo") || name.includes("thu thao") || mail.includes("thao.dang")) return VIETNAMESE_NURSE_AVATARS.thuThao;
    if (name.includes("hoàng nam") || name.includes("hoang nam") || mail.includes("nam.vu")) return VIETNAMESE_NURSE_AVATARS.hoangNam;
    if (name.includes("khánh quốc") || name.includes("khanh quoc") || mail.includes("quoctpk")) return VIETNAMESE_NURSE_AVATARS.khanhQuoc;
    if (name.includes("tường vy") || name.includes("tuong vy") || mail.includes("vynnt")) return VIETNAMESE_NURSE_AVATARS.tuongVy;

    // 5. Nếu đã là avatar hoạt hình SVG hợp lệ
    if (url === "/images/caregiver_avatar.svg") {
        return url;
    }

    // 6. Mặc định mọi điều dưỡng mới tạo tài khoản -> Avatar hoạt hình chuẩn y khoa CareLink
    return DEFAULT_NURSE_AVATAR;
}
