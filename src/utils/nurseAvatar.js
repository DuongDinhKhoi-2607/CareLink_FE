/**
 * Bộ ảnh chân dung thật của Điều dưỡng & Sinh viên Điều dưỡng Việt Nam
 * mặc áo blouse trắng chuẩn y khoa phục vụ trình diễn & vận hành CareLink.
 */
export const VIETNAMESE_NURSE_AVATARS = {
    maiLan: "/images/nurses/mai-lan.jpg",
    vanMinh: "/images/nurses/van-minh.jpg",
    leThao: "/images/nurses/le-thao.jpg",
    thuThao: "/images/nurses/thu-thao.jpg",
    hoangNam: "/images/nurses/hoang-nam.jpg",
    kimChi: "/images/nurses/kim-chi.jpg",
    khanhQuoc: "/images/nurses/khanh-quoc.jpg",
    tuongVy: "/images/nurses/tuong-vy.jpg",
};

export const DEFAULT_NURSE_AVATAR = VIETNAMESE_NURSE_AVATARS.maiLan;

/**
 * Chuẩn hóa đường dẫn ảnh chân dung điều dưỡng / sinh viên điều dưỡng Việt Nam mặc áo blouse trắng.
 * Tự động thay thế mọi ảnh mẫu nước ngoài (Unsplash), ảnh lỗi hoặc ảnh hoạt hình SVG
 * bằng ảnh thật điều dưỡng Việt Nam mặc áo blouse trắng tương ứng với từng hồ sơ.
 */
export function resolveNurseAvatar(rawAvatar, fullName = "", email = "", practitionerType = 1) {
    const name = String(fullName || "").toLowerCase();
    const mail = String(email || "").toLowerCase();
    const url = String(rawAvatar || "").trim();

    // 1. Ánh xạ chính xác theo tên hoặc email của các điều dưỡng & sinh viên điều dưỡng trong hệ thống
    if (name.includes("mai lan") || mail.includes("lan.nguyen")) return VIETNAMESE_NURSE_AVATARS.maiLan;
    if (name.includes("văn minh") || name.includes("van minh") || mail.includes("minh.tran")) return VIETNAMESE_NURSE_AVATARS.vanMinh;
    if (name.includes("lê thị thảo") || name.includes("le thi thao") || mail.includes("thao.le")) return VIETNAMESE_NURSE_AVATARS.leThao;
    if (name.includes("thu thảo") || name.includes("thu thao") || mail.includes("thao.dang")) return VIETNAMESE_NURSE_AVATARS.thuThao;
    if (name.includes("hoàng nam") || name.includes("hoang nam") || mail.includes("nam.vu")) return VIETNAMESE_NURSE_AVATARS.hoangNam;
    if (name.includes("kim chi") || mail.includes("chi.hoang")) return VIETNAMESE_NURSE_AVATARS.kimChi;
    if (name.includes("khánh quốc") || name.includes("khanh quoc") || mail.includes("quoctpk")) return VIETNAMESE_NURSE_AVATARS.khanhQuoc;
    if (name.includes("tường vy") || name.includes("tuong vy") || mail.includes("vynnt")) return VIETNAMESE_NURSE_AVATARS.tuongVy;
    if (name.includes("quốc duy") || name.includes("quoc duy") || mail.includes("pham.duy")) return VIETNAMESE_NURSE_AVATARS.vanMinh;
    if (name.includes("thị hằng") || name.includes("thi hang") || mail.includes("hang.vu")) return VIETNAMESE_NURSE_AVATARS.kimChi;

    // 2. Nếu đã là ảnh nội bộ trong /images/nurses/ hoặc /images/caregiver-hero.jpg hoặc ảnh người dùng tự tải lên (data: / blob:)
    if (
        url.startsWith("/images/nurses/") ||
        url === "/images/caregiver-hero.jpg" ||
        url.startsWith("data:image/") ||
        url.startsWith("blob:")
    ) {
        return url;
    }

    // 3. Nếu là ảnh nước ngoài (unsplash, pravatar, ui-avatars) hoặc ảnh vẽ SVG hoặc rỗng -> Chọn ảnh điều dưỡng Việt Nam phù hợp giới tính/ngành học
    const isForeignOrFake =
        !url ||
        url.includes("unsplash.com") ||
        url.includes("caregiver_avatar.svg") ||
        url.includes("pravatar.cc") ||
        url.includes("ui-avatars.com") ||
        url.includes("randomuser.me");

    if (!isForeignOrFake) {
        return url;
    }

    const isStudent =
        practitionerType === 2 ||
        String(practitionerType).toLowerCase().includes("student") ||
        name.includes("sinh viên");

    const isMale =
        name.includes(" văn ") ||
        name.includes(" hoàng ") ||
        name.includes(" quốc ") ||
        name.endsWith(" minh") ||
        name.endsWith(" nam") ||
        name.endsWith(" quốc") ||
        name.endsWith(" duy") ||
        name.endsWith(" hùng") ||
        name.endsWith(" tuấn");

    if (isMale) {
        return isStudent ? VIETNAMESE_NURSE_AVATARS.hoangNam : VIETNAMESE_NURSE_AVATARS.vanMinh;
    }

    if (isStudent) {
        return VIETNAMESE_NURSE_AVATARS.leThao;
    }

    // Băm nhẹ theo tên để phân bổ đa dạng ảnh thật nếu có thêm hồ sơ mới
    if (name.length > 0) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
        }
        const femalePool = [
            VIETNAMESE_NURSE_AVATARS.maiLan,
            VIETNAMESE_NURSE_AVATARS.thuThao,
            VIETNAMESE_NURSE_AVATARS.kimChi,
            VIETNAMESE_NURSE_AVATARS.tuongVy,
            VIETNAMESE_NURSE_AVATARS.leThao,
        ];
        return femalePool[hash % femalePool.length];
    }

    return DEFAULT_NURSE_AVATAR;
}
