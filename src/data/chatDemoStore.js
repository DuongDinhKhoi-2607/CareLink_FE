// Quản lý trạng thái trao đổi Demo 2 chiều giữa Family và Caregiver
// Dữ liệu lưu trong localStorage để đồng bộ tức thì giữa màn hình Family và Caregiver

const STORAGE_KEY = "carelink_chat_demo_state_v2";
const EVENT_NAME = "carelink_chat_demo_update";

const DEFAULT_STATE = {
    // Trạng thái thỏa thuận đặt lịch:
    // 'idle': Đang trao đổi tự do, chưa ai bấm xác nhận
    // 'family_confirmed': Family đã bấm "Gửi yêu cầu đặt lịch", đang chờ Caregiver duyệt
    // 'caregiver_accepted': Caregiver đã bấm "Đồng ý nhận ca", Family được mở khóa sang /checkout
    // 'caregiver_rejected': Caregiver từ chối yêu cầu
    // 'closed': Family bấm dừng trao đổi
    status: "idle",
    rejectReason: "",
    updatedAt: new Date().toISOString(),

    // Dữ liệu chi tiết ca chăm sóc dự kiến
    bookingInfo: {
        recipientName: "Bà Nguyễn Thị Lan",
        recipientAge: "75 tuổi",
        relation: "Mẹ anh An",
        condition: "Hậu phẫu khớp gối giai đoạn hồi phục, cần đo huyết áp & hỗ trợ vận động nhẹ",
        serviceName: "Chăm sóc phục hồi sau phẫu thuật",
        scheduledDate: "Ngày mai, 14/10/2026",
        scheduledTime: "08:00 – 10:00 (2 giờ)",
        duration: "2 giờ",
        address: "123 Nguyễn Gia Trí, P. 25, Bình Thạnh, TP. HCM",
        fee: "360.000 VNĐ",
        familyContact: "Anh Nguyễn Văn An (0901 234 567)",
        caregiverName: "Nguyễn Thùy Linh",
        caregiverRole: "Cử nhân Y4 • Đại học Y Dược TP.HCM",
        caregiverAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    },

    // Lịch sử tin nhắn trao đổi
    messages: [
        {
            id: 1,
            sender: "family", // 'family' | 'caregiver' | 'system'
            text: "Chào em Linh, mẹ anh năm nay 75 tuổi, vừa mổ khớp gối về. Anh muốn tìm điều dưỡng hỗ trợ tập co duỗi nhẹ và đo huyết áp buổi sáng.",
            time: "08:15",
        },
        {
            id: 2,
            sender: "caregiver",
            text: "Dạ em chào anh An ạ! Em có kinh nghiệm thực tập khoa Ngoại chấn thương chỉnh hình BV Chợ Rẫy, em có thể hỗ trợ bác bài tập phục hồi tại giường rất tốt ạ.",
            time: "08:18",
        },
        {
            id: 3,
            sender: "family",
            text: "Tốt quá! Sáng mai từ 08:00 đến 10:00 em có tiện qua nhà anh ở Bình Thạnh được không?",
            time: "08:20",
        },
        {
            id: 4,
            sender: "caregiver",
            text: "Dạ sáng mai khung giờ 08:00 – 10:00 em đang trống lịch và ở ngay gần khu vực Bình Thạnh luôn anh nhé. Anh có thể gửi yêu cầu đặt lịch để em xác nhận nhận ca ạ!",
            time: "08:22",
        },
    ],
};

export const getDemoChatState = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_STATE;
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_STATE, ...parsed };
    } catch {
        return DEFAULT_STATE;
    }
};

export const saveDemoChatState = (newState) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newState }));
    } catch (e) {
        console.error("Failed to save demo chat state", e);
    }
};

export const setDemoStatus = (status, rejectReason = "") => {
    const current = getDemoChatState();
    const updated = {
        ...current,
        status,
        rejectReason: rejectReason || (status === "caregiver_rejected" ? "Điều dưỡng bận đột xuất vào khung giờ này" : ""),
        updatedAt: new Date().toISOString(),
    };

    // Tự động thêm tin nhắn thông báo hệ thống vào khung chat
    if (status === "family_confirmed") {
        updated.messages = [
            ...updated.messages,
            {
                id: Date.now(),
                sender: "system",
                systemType: "confirm",
                text: "Gia đình đã gửi yêu cầu đặt lịch chăm sóc (08:00 – 10:00 ngày mai). Đang chờ Điều dưỡng xác nhận nhận ca.",
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            },
        ];
    } else if (status === "idle" && current.status === "family_confirmed") {
        updated.messages = [
            ...updated.messages,
            {
                id: Date.now(),
                sender: "system",
                systemType: "revoke",
                text: "Gia đình đã rút lại yêu cầu đặt lịch để tiếp tục trao đổi thêm.",
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            },
        ];
    } else if (status === "caregiver_accepted") {
        updated.messages = [
            ...updated.messages,
            {
                id: Date.now(),
                sender: "system",
                systemType: "accept",
                text: "Điều dưỡng Nguyễn Thùy Linh đã đồng ý nhận ca! Gia đình vui lòng tiến hành thanh toán để hoàn tất đặt lịch.",
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            },
        ];
    } else if (status === "caregiver_rejected") {
        updated.messages = [
            ...updated.messages,
            {
                id: Date.now(),
                sender: "system",
                systemType: "reject",
                text: `Điều dưỡng từ chối yêu cầu: "${rejectReason || "Bận đột xuất vào khung giờ này"}". Cuộc trao đổi đã kết thúc.`,
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            },
        ];
    } else if (status === "closed") {
        updated.messages = [
            ...updated.messages,
            {
                id: Date.now(),
                sender: "system",
                systemType: "close",
                text: "Gia đình đã dừng cuộc trao đổi này.",
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            },
        ];
    }

    saveDemoChatState(updated);
    return updated;
};

export const addDemoMessage = (sender, text) => {
    const current = getDemoChatState();
    const newMsg = {
        id: Date.now(),
        sender,
        text: text.trim(),
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = {
        ...current,
        messages: [...current.messages, newMsg],
        updatedAt: new Date().toISOString(),
    };
    saveDemoChatState(updated);
    return updated;
};

export const updateDemoBookingInfo = (partialInfo) => {
    const current = getDemoChatState();
    const updated = {
        ...current,
        bookingInfo: {
            ...current.bookingInfo,
            ...partialInfo,
        },
        // Nếu đang ở family_confirmed thì chuyển về idle để 2 bên xác nhận lại lịch mới
        status: current.status === "family_confirmed" ? "idle" : current.status,
        messages: [
            ...current.messages,
            {
                id: Date.now(),
                sender: "system",
                systemType: "update",
                text: `Gia đình đã cập nhật lịch: ${partialInfo.scheduledTime || current.bookingInfo.scheduledTime}, ${partialInfo.scheduledDate || current.bookingInfo.scheduledDate}. Hai bên vui lòng kiểm tra và xác nhận lại thỏa thuận mới.`,
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            },
        ],
        updatedAt: new Date().toISOString(),
    };
    saveDemoChatState(updated);
    return updated;
};

export const resetDemoChat = () => {
    saveDemoChatState(DEFAULT_STATE);
    return DEFAULT_STATE;
};

export const subscribeDemoChat = (callback) => {
    const handler = (e) => {
        callback(e.detail || getDemoChatState());
    };
    const storageHandler = (e) => {
        if (e.key === STORAGE_KEY) {
            try {
                const parsed = e.newValue ? JSON.parse(e.newValue) : DEFAULT_STATE;
                callback({ ...DEFAULT_STATE, ...parsed });
            } catch {
                callback(getDemoChatState());
            }
        }
    };
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("storage", storageHandler);
    return () => {
        window.removeEventListener(EVENT_NAME, handler);
        window.removeEventListener("storage", storageHandler);
    };
};
