import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

// 1. Danh mục cẩm nang (Đã thay Emojis bằng Inline SVGs sang trọng)
const categories = [
    {
        id: "all",
        label: "Tất cả bài viết",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        )
    },
    {
        id: "elderly",
        label: "Chăm sóc người cao tuổi",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        )
    },
    {
        id: "post-surgery",
        label: "Phục hồi sau phẫu thuật",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
        )
    },
    {
        id: "therapy",
        label: "Vật lý trị liệu",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        )
    },
    {
        id: "nutrition",
        label: "Dinh dưỡng & Dược phẩm",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
        )
    },
    {
        id: "first-aid",
        label: "Sơ cấp cứu tại nhà",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
];

// Danh sách bài viết chuyên môn
const articlesData = [
    {
        id: 1,
        featured: true,
        category: "elderly",
        categoryName: "Chăm sóc người cao tuổi",
        title: "5 Dấu hiệu suy giảm sức khỏe ở người cao tuổi gia đình không nên chủ quan",
        summary: "Nhận biết sớm các triệu chứng thầm lặng về tim mạch, huyết áp và sa sút trí tuệ để có biện pháp can thiệp y tế kịp thời, bảo vệ an toàn cho cha mẹ.",
        readTime: "6 phút đọc",
        date: "20/09/2026",
        author: {
            name: "BS. CKII Nguyễn Minh Tuấn",
            role: "Chuyên khoa Lão khoa - Cố vấn Y khoa CareLink",
            avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150",
        },
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200",
        content: `
            <h3>1. Sự thay đổi đột ngột về giấc ngủ và cảm xúc</h3>
            <p>Người cao tuổi thường ngủ ít hơn, nhưng nếu đột ngột ngủ li bì cả ngày hoặc mất ngủ kéo dài kèm theo cảm giác bồn chồn, đây có thể là dấu hiệu cảnh báo của rối loạn tuần hoàn não hoặc trầm cảm tuổi già.</p>
            
            <h3>2. Khó khăn trong việc giữ thăng bằng và di chuyển</h3>
            <p>Những bước đi ngập ngừng, loạng choạng hay thường xuyên va quẹt đồ đạc là biểu hiện của suy giảm chức năng tiền đình hoặc yếu cơ chi dưới. Cần có người chăm sóc hỗ trợ khi di chuyển trong nhà vệ sinh hoặc cầu thang.</p>

            <h3>3. Hay quên các sự kiện vừa mới diễn ra</h3>
            <p>Nếu người thân quên chìa khóa hay quên kính mắt thì bình thường, nhưng nếu họ quên tên con cháu, quên đã ăn cơm chưa hay đi lạc ngay trên con đường quen thuộc, gia đình cần đưa đi khám chuyên khoa thần kinh ngay.</p>

            <h3>4. Khẩu vị thay đổi, chán ăn và sụt cân không rõ nguyên nhân</h3>
            <p>Mất cảm giác thèm ăn kéo dài có thể xuất phát từ các vấn đề răng miệng, tiêu hóa hoặc bệnh lý chuyển hóa tiềm ẩn như đái tháo đường, suy thận mạn.</p>

            <h3>5. Huyết áp dao động thất thường</h3>
            <p>Cần theo dõi huyết áp định kỳ 2 lần mỗi ngày (sáng và tối). Huyết áp tăng vọt trên 140/90 mmHg hoặc tụt đột ngột đều tiềm ẩn nguy cơ đột quỵ và té ngã.</p>
        `,
    },
    {
        id: 2,
        featured: false,
        category: "nutrition",
        categoryName: "Dinh dưỡng & Dược phẩm",
        title: "Chế độ dinh dưỡng vàng cho bệnh nhân cao huyết áp và đái tháo đường",
        summary: "Nguyên tắc thiết kế thực đơn khoa học kiểm soát đường huyết, giảm muối và tăng cường vi khoáng giúp tim mạch luôn khỏe mạnh.",
        readTime: "5 phút đọc",
        date: "18/09/2026",
        author: {
            name: "ThS. BS Trần Hoài Nam",
            role: "Chuyên gia Dinh dưỡng Lâm sàng",
            avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150",
        },
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800",
        content: `
            <h3>Nguyên tắc giảm muối DASH</h3>
            <p>Lượng muối nạp vào mỗi ngày không nên vượt quá 5g (khoảng 1 muỗng cà phê gạt ngang). Hạn chế thực phẩm chế biến sẵn, đồ hộp, nước chấm cô đặc.</p>
            <h3>Ưu tiên ngũ cốc nguyên hạt</h3>
            <p>Thay gạo trắng bằng gạo lứt, yến mạch hoặc khoai lang luộc giúp phóng thích đường chậm, không làm đường huyết tăng vọt sau bữa ăn.</p>
            <h3>Chia nhỏ bữa ăn</h3>
            <p>Nên chia thành 4-5 bữa nhỏ trong ngày để dạ dày người cao tuổi dễ tiêu hóa và hấp thu tối ưu.</p>
        `,
    },
    {
        id: 3,
        featured: false,
        category: "elderly",
        categoryName: "Chăm sóc người cao tuổi",
        title: "Kỹ thuật lật trở và phòng ngừa loét tì đè ở người nằm bất động lâu ngày",
        summary: "Hướng dẫn thực hành chuẩn điều dưỡng về chu kỳ xoay trở 2 giờ một lần, chăm sóc da và sử dụng đệm hơi chống loét chuyên dụng.",
        readTime: "7 phút đọc",
        date: "15/09/2026",
        author: {
            name: "ĐD. Lê Thị Mai",
            role: "Điều dưỡng Trưởng BV Chợ Rẫy (8 năm KN)",
            avatar: "https://images.unsplash.com/photo-1594824813589-9a2bf405e3f4?auto=format&fit=crop&q=80&w=150",
        },
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
        content: `
            <h3>Quy tắc 2 giờ vàng</h3>
            <p>Đối với bệnh nhân nằm liệt giường hoặc sau đột quỵ, cần thay đổi tư thế nằm nghiêng trái, nằm ngửa, nằm nghiêng phải đều đặn mỗi 2 tiếng một lần.</p>
            <h3>Vệ sinh da khô thoáng</h3>
            <p>Lau rửa nhẹ nhàng vùng cùng cụt, gót chân, bả vai bằng nước ấm, lau khô bằng khăn mềm và thoa kem dưỡng ẩm bảo vệ da.</p>
        `,
    },
    {
        id: 4,
        featured: false,
        category: "first-aid",
        categoryName: "Sơ cấp cứu tại nhà",
        title: "Nhận diện cơn Đột quỵ trong 'Giờ Vàng' với quy tắc F.A.S.T cứu sống người bệnh",
        summary: "Thời gian là não bộ! Hướng dẫn xử trí đúng cách trong 3-4.5 giờ đầu tiên khi người thân có dấu hiệu tai biến mạch máu não.",
        readTime: "4 phút đọc",
        date: "12/09/2026",
        author: {
            name: "BS. CKI Hoàng Việt",
            role: "Bác sĩ Cấp cứu Hồi sức",
            avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150",
        },
        image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800",
        content: `
            <h3>Quy tắc FAST cần thuộc lòng</h3>
            <ul>
                <li><strong>F (Face - Mặt):</strong> Mặt mất cân đối, méo miệng khi cười.</li>
                <li><strong>A (Arm - Tay):</strong> Yếu hoặc liệt một bên tay, không nhấc lên được.</li>
                <li><strong>S (Speech - Lời nói):</strong> Nói ngọng, phát âm khó hoặc không hiểu lời nói.</li>
                <li><strong>T (Time - Thời gian):</strong> Gọi ngay cấp cứu 115, không châm cứu, cạo gió hay cho uống thuốc hạ áp tùy tiện.</li>
            </ul>
        `,
    },
    {
        id: 5,
        featured: false,
        category: "therapy",
        categoryName: "Vật lý trị liệu",
        title: "Các bài tập vận động nhẹ nhàng giúp cải thiện giấc ngủ và khớp gối cho ông bà",
        summary: "5 động tác co duỗi thụ động và chủ động giúp lưu thông khí huyết, giảm cứng khớp buổi sáng và kích thích giấc ngủ ngon tự nhiên.",
        readTime: "5 phút đọc",
        date: "10/09/2026",
        author: {
            name: "KTV. Phạm Đức Anh",
            role: "Chuyên viên Phục hồi chức năng",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        },
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800",
        content: `
            <h3>Động tác 1: Gập duỗi cổ chân trên giường</h3>
            <p>Giúp bơm máu tĩnh mạch từ chi dưới về tim, phòng ngừa thuyên tắc mạch sâu.</p>
            <h3>Động tác 2: Nâng chân thẳng</h3>
            <p>Tăng cường cơ tứ đầu đùi, giảm áp lực tì đè lên khớp gối khi đứng dậy.</p>
        `,
    },
    {
        id: 6,
        featured: false,
        category: "post-surgery",
        categoryName: "Phục hồi sau phẫu thuật",
        title: "Lộ trình chăm sóc 30 ngày vàng sau mổ thay khớp háng và khớp gối",
        summary: "Những lưu ý an toàn về tư thế ngồi, đi vệ sinh, phòng tránh trật khớp nhân tạo và chế độ tập luyện phục hồi cử động.",
        readTime: "8 phút đọc",
        date: "05/09/2026",
        author: {
            name: "BS. Đoàn Minh Khoa",
            role: "Chấn thương Chỉnh hình",
            avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150",
        },
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
        content: `
            <h3>Tránh bắt chéo chân</h3>
            <p>Tuyệt đối không bắt chéo chân hoặc gập háng quá 90 độ trong 3 tháng đầu sau mổ.</p>
            <h3>Sử dụng khung tập đi</h3>
            <p>Luôn có điều dưỡng hoặc người nhà giám sát khi tập bước đi với khung hỗ trợ.</p>
        `,
    },
];

// Hỏi đáp thường gặp
const faqs = [
    {
        q: "Làm thế nào để biết người cao tuổi cần được chăm sóc y tế chuyên nghiệp tại nhà?",
        a: "Khi người thân gặp khó khăn trong sinh hoạt hàng ngày (tắm rửa, ăn uống, đi lại), có vết thương hở cần thay băng, đặt sonde dạ dày/sonde tiểu, hoặc sau phẫu thuật cần theo dõi sinh hiệu liên tục.",
    },
    {
        q: "Đo huyết áp cho người cao tuổi vào thời điểm nào là chuẩn xác nhất?",
        a: "Nên đo 2 lần mỗi ngày: buổi sáng sau khi thức dậy và đi vệ sinh (trước khi ăn sáng và uống thuốc), và buổi tối trước khi đi ngủ. Nghỉ ngơi yên tĩnh 5-10 phút trước khi đo.",
    },
    {
        q: "Khi nào cần gọi Điều dưỡng CareLink đến hỗ trợ gấp?",
        a: "Khi gia đình cần hỗ trợ tiêm truyền theo y lệnh bác sĩ, thay ống thông tiểu, chăm sóc vết loét có dấu hiệu nhiễm trùng, hoặc cần điều dưỡng túc trực ca đêm theo dõi sát sinh hiệu.",
    },
];

export default function MedicalHandbook() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeArticleModal, setActiveArticleModal] = useState(null);
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    // Lọc bài viết
    const filteredArticles = useMemo(() => {
        return articlesData.filter((article) => {
            const matchesCategory =
                selectedCategory === "all" || article.category === selectedCategory;
            const matchesSearch =
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const featuredArticle = articlesData.find((a) => a.featured);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
            {/* ═══ 1. HERO BANNER CHUYÊN MÔN ═══ */}
            <section className="relative bg-gradient-to-b from-teal-900 via-[#004857] to-[#00677c] text-white py-16 lg:py-20 overflow-hidden">
                {/* Background patterns */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-teal-200 tracking-wide uppercase shadow-sm">
                        <svg className="w-4 h-4 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Kiến thức y khoa thường thức CareLink
                    </span>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl leading-[1.2]">
                        Cẩm Nang Y Tế & Chăm Sóc Sức Khỏe Gia Đình
                    </h1>

                    <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl leading-relaxed">
                        Tập hợp kiến thức chuẩn y khoa từ các bác sĩ chuyên khoa và điều dưỡng tận tâm. Cùng bạn lắng nghe, thấu hiểu và chăm sóc người thân yêu trọn vẹn mỗi ngày.
                    </p>

                    {/* Thanh tìm kiếm nhanh */}
                    <div className="w-full max-w-2xl mt-4 relative">
                        <div className="relative flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl bg-white text-slate-700 overflow-hidden border border-white/30 focus-within:ring-4 focus-within:ring-teal-400/40 transition-all duration-300">
                            <span className="pl-5 text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm bài viết theo bệnh lý, triệu chứng, chế độ ăn..."
                                className="w-full py-4 pl-3 pr-5 text-sm sm:text-base outline-none bg-transparent placeholder-slate-400 font-medium"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="pr-4 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ 2. THANH DANH MỤC LỌC BÀI VIẾT ═══ */}
            <nav className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
                    {categories.map((cat) => {
                        const active = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2 cursor-pointer border ${active
                                    ? "bg-[#00677c] text-white border-[#00677c] shadow-lg shadow-[#00677c]/25 transform scale-105"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300"
                                    }`}
                            >
                                <span className={active ? "text-white" : "text-slate-500"}>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* ═══ 3. THÂN TRANG & BÀI VIẾT ═══ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">

                {/* 3.1 BÀI VIẾT TIÊU ĐIỂM (FEATURED ARTICLE) */}
                {selectedCategory === "all" && !searchQuery && featuredArticle && (
                    <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-pointer" onClick={() => setActiveArticleModal(featuredArticle)}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                            <div className="lg:col-span-7 h-72 lg:h-auto relative overflow-hidden">
                                <img
                                    src={featuredArticle.image}
                                    alt={featuredArticle.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute top-4 left-4 bg-[#00677c] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm border border-white/20">
                                    <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Chuyên mục khuyên đọc
                                </div>
                            </div>

                            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 bg-white">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
                                        <span className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200/70">
                                            {featuredArticle.categoryName}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-500">{featuredArticle.readTime}</span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002045] group-hover:text-[#00677c] transition-colors leading-snug">
                                        {featuredArticle.title}
                                    </h2>

                                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 font-medium">
                                        {featuredArticle.summary}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={featuredArticle.author.avatar}
                                            alt={featuredArticle.author.name}
                                            className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500/20"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#002045]">
                                                {featuredArticle.author.name}
                                            </span>
                                            <span className="text-[11px] font-medium text-slate-500 truncate max-w-[200px]">
                                                {featuredArticle.author.role}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00677c] group-hover:text-teal-700 group-hover:translate-x-1 transition-all cursor-pointer bg-teal-50 px-4 py-2 rounded-xl"
                                    >
                                        Đọc ngay
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 3.2 LƯỚI BÀI VIẾT (ARTICLES GRID) */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-end justify-between border-b border-slate-200/60 pb-4">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-[#002045]">
                            {selectedCategory === "all" ? "Tất cả bài viết y khoa" : `Chuyên mục: ${categories.find(c => c.id === selectedCategory)?.label}`}
                        </h3>
                        <span className="text-xs sm:text-sm text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">
                            Hiển thị {filteredArticles.length} bài viết
                        </span>
                    </div>

                    {filteredArticles.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-2">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <p className="text-lg font-bold text-slate-700">Không tìm thấy bài viết phù hợp</p>
                            <p className="text-sm text-slate-500 font-medium max-w-sm">Hãy thử tìm kiếm bằng từ khóa khác hoặc chọn chuyên mục "Tất cả bài viết".</p>
                            <button
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setSearchQuery("");
                                }}
                                className="mt-4 px-6 py-2.5 bg-[#00677c] text-white rounded-xl text-sm font-bold hover:bg-[#005264] transition-colors shadow-md"
                            >
                                Xem tất cả bài viết
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredArticles.map((article) => (
                                <article
                                    key={article.id}
                                    onClick={() => setActiveArticleModal(article)}
                                    className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_-5px_rgba(0,103,124,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                                >
                                    {/* Ảnh đại diện */}
                                    <div className="h-52 relative overflow-hidden bg-slate-100">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm text-[11px] font-extrabold text-teal-800 shadow-sm border border-white/40">
                                            {article.categoryName}
                                        </span>
                                    </div>

                                    {/* Nội dung tóm tắt */}
                                    <div className="p-6 flex-1 flex flex-col justify-between gap-5 bg-white">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                                <span>{article.date}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {article.readTime}
                                                </span>
                                            </div>

                                            <h4 className="text-lg font-extrabold text-[#002045] group-hover:text-[#00677c] transition-colors leading-snug line-clamp-2">
                                                {article.title}
                                            </h4>

                                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium">
                                                {article.summary}
                                            </p>
                                        </div>

                                        {/* Tác giả & CTA */}
                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <img
                                                    src={article.author.avatar}
                                                    alt={article.author.name}
                                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/10"
                                                />
                                                <span className="text-xs font-bold text-slate-700 truncate max-w-[130px]">
                                                    {article.author.name}
                                                </span>
                                            </div>

                                            <button className="text-xs font-extrabold text-[#00677c] flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                Chi tiết
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* ═══ 4. HỎI ĐÁP Y TẾ THƯỜNG GẶP (FAQ ACCORDION SANG TRỌNG) ═══ */}
                <section className="bg-gradient-to-br from-teal-50/80 to-[#f0f8f9] rounded-[2rem] p-8 sm:p-12 border border-teal-100/60 shadow-sm flex flex-col gap-10">
                    <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
                        <span className="inline-block px-3 py-1 bg-teal-100 text-[#00677c] text-xs font-extrabold uppercase tracking-widest rounded-full w-fit mx-auto">
                            Hỏi đáp y tế
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#002045]">
                            Câu hỏi thường gặp từ các gia đình
                        </h3>
                    </div>

                    <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 border ${isOpen ? "border-[#00677c]/30 shadow-md ring-1 ring-[#00677c]/10" : "border-slate-200/60 hover:border-slate-300"
                                        }`}
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#002045] hover:text-[#00677c] transition-colors cursor-pointer outline-none"
                                    >
                                        <span className="pr-4 leading-snug">{faq.q}</span>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-[#00677c] text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </span>
                                    </button>

                                    {/* Animation xổ xuống mượt mà bằng CSS Grid */}
                                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                        <div className="overflow-hidden">
                                            <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-4">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ═══ 5. BANNER KÊU GỌI HÀNH ĐỘNG (CTA BANNER VỚI SHINE EFFECT) ═══ */}
                <section className="relative overflow-hidden bg-gradient-to-r from-[#003846] via-[#004857] to-[#00677c] rounded-[2rem] p-8 sm:p-14 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl border border-[#00677c]/50">
                    {/* Họa tiết nền */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

                    <div className="relative flex flex-col gap-4 text-center lg:text-left max-w-2xl z-10">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-teal-200 uppercase tracking-widest w-fit mx-auto lg:mx-0 backdrop-blur-sm border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                            Hỗ trợ trực tuyến 24/7
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                            Gia đình cần điều dưỡng chuyên môn <span className="text-teal-300">chăm sóc tại nhà?</span>
                        </h3>
                        <p className="text-teal-50 text-base sm:text-lg opacity-90 font-medium leading-relaxed">
                            Đội ngũ điều dưỡng và sinh viên Y khoa CareLink đã được kiểm định chứng chỉ và sẵn sàng hỗ trợ tận tâm.
                        </p>
                    </div>

                    <div className="relative flex flex-col sm:flex-row items-center gap-4 shrink-0 z-10 w-full lg:w-auto">
                        <Link
                            to="/family"
                            className="group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-white text-[#00677c] font-extrabold text-sm rounded-xl transition-all shadow-lg text-center"
                        >
                            {/* Hiệu ứng Shine sáng lướt qua */}
                            <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                            <span className="relative">Tìm Điều dưỡng ngay</span>
                        </Link>
                        <a
                            href="tel:19001234"
                            className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-extrabold text-sm rounded-xl transition-all text-center flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.292-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                            Hotline: 1900 1234
                        </a>
                    </div>
                </section>
            </main>

            {/* ═══ 6. POPUP XEM NHANH BÀI VIẾT (MODAL VỚI BACKDROP BLUR) ═══ */}
            {activeArticleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
                    {/* Hiệu ứng scale in mượt mà */}
                    <div className="bg-white rounded-[2rem] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-white z-10 shadow-sm">
                            <span className="px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-100">
                                {activeArticleModal.categoryName}
                            </span>
                            <button
                                onClick={() => setActiveArticleModal(null)}
                                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Thân bài viết cuộn */}
                        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 no-scrollbar bg-slate-50/50">
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002045] leading-tight">
                                {activeArticleModal.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-slate-200/60">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={activeArticleModal.author.avatar}
                                        alt={activeArticleModal.author.name}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500/20"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-extrabold text-[#002045]">{activeArticleModal.author.name}</span>
                                        <span className="text-xs font-medium text-slate-500">{activeArticleModal.author.role}</span>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-3 text-sm text-slate-400 font-semibold ml-auto bg-white px-3 py-1.5 rounded-lg border border-slate-200/60">
                                    <span>{activeArticleModal.date}</span>
                                    <span>•</span>
                                    <span>{activeArticleModal.readTime}</span>
                                </div>
                            </div>

                            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 bg-white p-2">
                                <img
                                    src={activeArticleModal.image}
                                    alt={activeArticleModal.title}
                                    className="w-full h-64 sm:h-96 object-cover rounded-xl"
                                />
                            </div>

                            <div
                                className="text-sm sm:text-base text-slate-700 leading-loose space-y-5 
                                [&>h3]:text-xl [&>h3]:font-extrabold [&>h3]:text-[#002045] [&>h3]:pt-4 
                                [&>ul]:list-disc [&>ul]:pl-5 [&>p]:font-medium"
                                dangerouslySetInnerHTML={{ __html: activeArticleModal.content }}
                            />
                        </div>

                        {/* Footer Modal */}
                        <div className="p-5 sm:p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                            <span className="text-xs font-bold text-slate-400 hidden sm:block flex-1">
                                Chia sẻ kiến thức vì sức khỏe cộng đồng
                            </span>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                <button
                                    onClick={() => setActiveArticleModal(null)}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                                >
                                    Đóng bài viết
                                </button>
                                <Link
                                    to="/family"
                                    className="px-6 py-3 bg-[#00677c] text-white text-sm font-bold rounded-xl hover:bg-[#005264] hover:shadow-lg hover:shadow-teal-900/20 transition-all"
                                >
                                    Đặt ca chăm sóc ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cấu hình keyframes cho hiệu ứng Shine */}
            <style jsx>{`
                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}