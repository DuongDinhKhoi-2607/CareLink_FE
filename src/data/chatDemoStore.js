// Quản lý trạng thái trao đổi giữa Family và Caregiver
// Dữ liệu lưu trong localStorage để đồng bộ tức thì giữa màn hình Family và Caregiver

const STORAGE_KEY = "carelink_chat_demo_state_v3";
const EVENT_NAME = "carelink_chat_demo_update";

const DEFAULT_STATE = {
    // Trạng thái thỏa thuận đặt lịch:
    // 'idle': Đang trao đổi tự do, chưa ai bấm xác nhận
    // 'family_confirmed': Family đã gửi đề xuất ca chăm sóc, đang chờ Caregiver duyệt
    // 'caregiver_accepted': Caregiver đã chấp thuận ca, Family chuyển sang thanh toán
    // 'caregiver_rejected': Caregiver từ chối đề xuất
    // 'closed': Kết thúc trao đổi
    status: "idle",
    rejectReason: "",
    updatedAt: new Date().toISOString(),

    // Dữ liệu chi tiết ca chăm sóc
    bookingInfo: {
        recipientName: "Người nhận chăm sóc",
        recipientAge: "",
        relation: "",
        condition: "Chăm sóc theo nhu cầu gia đình và đề xuất ca",
        serviceName: "Dịch vụ chăm sóc",
        scheduledDate: "Đang thỏa thuận",
        scheduledTime: "Đang thỏa thuận",
        duration: "Theo ca",
        address: "Địa chỉ gia đình",
        fee: "Thỏa thuận",
        familyContact: "Gia đình khách hàng",
        caregiverName: "Điều dưỡng CareLink",
        caregiverRole: "Điều dưỡng chuyên nghiệp",
        caregiverAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    },

    // Lịch sử tin nhắn trao đổi
    messages: [],
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
                text: "Gia đình đã gửi đề xuất ca chăm sóc. Đang chờ Điều dưỡng xem xét và xác nhận nhận ca.",
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
                text: "Điều dưỡng đã đồng ý nhận ca! Gia đình vui lòng tiến hành thanh toán để xác nhận ca chăm sóc.",
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
                text: `Điều dưỡng từ chối yêu cầu: "${rejectReason || "Bận đột xuất vào khung giờ này"}".`,
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
