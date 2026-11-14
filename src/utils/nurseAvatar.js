import { resolveDocumentUrl } from "../api/axiosClient";

/**
 * Bộ ảnh chân dung thật của DUY NHẤT 4 Điều dưỡng cốt lõi của CareLink
 * phục vụ trình diễn và vận hành chuẩn y tế.
 */
export const VIETNAMESE_NURSE_AVATARS = {
    maiLan: "/images/nurses/mai-lan.jpg",
    vanMinh: "/images/nurses/van-minh.jpg",
    kimChi: "/images/nurses/kim-chi.jpg",
    leThao: "/images/nurses/le-thao.jpg",
};

/**
 * Avatar hoạt hình y tế mặc định dành cho tất cả điều dưỡng mới tạo tài khoản
 * khi chưa cập nhật hoặc tải lên ảnh đại diện cá nhân.
 */
export const DEFAULT_NURSE_AVATAR = "/images/caregiver_avatar.svg";

/**
 * Chuẩn hóa ảnh đại diện điều dưỡng:
 * 1. Ưu tiên 100% ảnh thật người dùng tự tải lên (/uploads/documents/..., data:, blob:, google avatar).
 * 2. Loại bỏ hoàn toàn ảnh mẫu stock photo đeo khẩu trang (/images/caregiver-hero.jpg).
 * 3. Chỉ ánh xạ đúng 4 điều dưỡng mẫu cốt lõi (Trần Văn Minh, Hoàng Kim Chi, Nguyễn Thị Mai Lan, Lê Thị Thảo).
 * 4. TẤT CẢ các tài khoản khác (người dùng mới, tài khoản thật, tên bất kỳ khác):
 *    -> Hiển thị avatar hoạt hình y tế mặc định (/images/caregiver_avatar.svg) để người dùng tự do tải ảnh của chính mình lên.
 */
export function resolveNurseAvatar(rawAvatar, fullName = "", email = "", practitionerType = 1) {
    const name = String(fullName || "").toLowerCase();
    const mail = String(email || "").toLowerCase();
    const url = String(rawAvatar || "").trim();

    // 1. Ưu tiên 1: Ảnh người dùng tự tải lên qua API /api/v1/uploads, data URI hoặc blob
    if (
        url.startsWith("data:image/") ||
        url.startsWith("blob:") ||
        url.includes("/uploads/documents/") ||
        url.startsWith("/uploads/")
    ) {
        return resolveDocumentUrl ? resolveDocumentUrl(url) : url;
    }

    // 2. Nếu là URL từ Google login (lh3.googleusercontent.com) hoặc URL hợp lệ người dùng cung cấp
    if (url.startsWith("http://") || url.startsWith("https://")) {
        const isStockPlaceholder =
            url.includes("unsplash.com") ||
            url.includes("pravatar.cc") ||
            url.includes("ui-avatars.com") ||
            url.includes("randomuser.me") ||
            url.includes("caregiver-hero.jpg");
        if (!isStockPlaceholder) {
            return url;
        }
    }

    // 3. Nếu là ảnh trong kho /images/nurses/ đã được gán trực tiếp
    if (url.startsWith("/images/nurses/")) {
        return url;
    }

    // 4. DUY NHẤT 4 điều dưỡng mẫu của hệ thống được hiển thị ảnh chân dung mẫu
    if (name.includes("mai lan") || mail.includes("lan.nguyen")) return VIETNAMESE_NURSE_AVATARS.maiLan;
    if (name.includes("văn minh") || name.includes("van minh") || mail.includes("minh.tran")) return VIETNAMESE_NURSE_AVATARS.vanMinh;
    if (name.includes("kim chi") || mail.includes("chi.hoang")) return VIETNAMESE_NURSE_AVATARS.kimChi;
    if (name.includes("lê thị thảo") || name.includes("le thi thảo") || mail.includes("thao.le")) return VIETNAMESE_NURSE_AVATARS.leThao;

    // 5. Nếu ảnh hiện tại đã là avatar hoạt hình SVG hợp lệ
    if (url === "/images/caregiver_avatar.svg") {
        return url;
    }

    // 6. Mặc định 100% cho TẤT CẢ các tài khoản mới / người dùng khác -> Avatar hoạt hình y tế để họ tự đổi
    return DEFAULT_NURSE_AVATAR;
}
