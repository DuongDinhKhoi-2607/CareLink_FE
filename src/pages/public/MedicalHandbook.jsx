import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

// Danh mục cẩm nang
const categories = [
    { id: "all", label: "Tất cả bài viết", icon: "📚" },
    { id: "elderly", label: "Chăm sóc người cao tuổi", icon: "👵" },
    { id: "post-surgery", label: "Phục hồi sau phẫu thuật", icon: "🏥" },
    { id: "therapy", label: "Vật lý trị liệu", icon: "🏃‍♂️" },
    { id: "nutrition", label: "Dinh dưỡng & Dược phẩm", icon: "🥗" },
    { id: "first-aid", label: "Sơ cấp cứu tại nhà", icon: "🚨" },
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
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-teal-200 tracking-wide uppercase">
                        🩺 Kiến thức y khoa thường thức CareLink
                    </span>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl leading-[1.2]">
                        Cẩm Nang Y Tế & Chăm Sóc Sức Khỏe Gia Đình
                    </h1>

                    <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl leading-relaxed">
                        Tập hợp kiến thức chuẩn y khoa từ các bác sĩ chuyên khoa và điều dưỡng tận tâm. Cùng bạn lắng nghe, thấu hiểu và chăm sóc người thân yêu trọn vẹn mỗi ngày.
                    </p>

                    {/* Thanh tìm kiếm nhanh */}
                    <div className="w-full max-w-2xl mt-4 relative">
                        <div className="relative flex items-center shadow-xl rounded-2xl bg-white text-slate-700 overflow-hidden border border-white/30 focus-within:ring-4 focus-within:ring-teal-400/30 transition-all">
                            <span className="pl-5 text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm bài viết theo bệnh lý, triệu chứng, chế độ ăn..."
                                className="w-full py-4 pl-3 pr-5 text-sm sm:text-base outline-none bg-transparent placeholder-slate-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="pr-4 text-xs font-semibold text-slate-400 hover:text-slate-600"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ 2. THANH DANH MỤC LỌC BÀI VIẾT ═══ */}
            <nav className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {categories.map((cat) => {
                        const active = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                                    active
                                        ? "bg-[#00677c] text-white shadow-md shadow-[#00677c]/20"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                                }`}
                            >
                                <span>{cat.icon}</span>
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
                    <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                            <div className="lg:col-span-7 h-72 lg:h-auto relative overflow-hidden group">
                                <img
                                    src={featuredArticle.image}
                                    alt={featuredArticle.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-[#00677c] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider flex items-center gap-1.5">
                                    <span>⭐</span> Chuyên mục khuyên đọc
                                </div>
                            </div>

                            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
                                        <span className="px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200/70">
                                            {featuredArticle.categoryName}
                                        </span>
                                        <span>•</span>
                                        <span className="text-slate-500">{featuredArticle.readTime}</span>
                                    </div>

                                    <h2
                                        onClick={() => setActiveArticleModal(featuredArticle)}
                                        className="text-2xl sm:text-3xl font-extrabold text-[#002045] hover:text-[#00677c] cursor-pointer transition-colors leading-snug"
                                    >
                                        {featuredArticle.title}
                                    </h2>

                                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                                        {featuredArticle.summary}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={featuredArticle.author.avatar}
                                            alt={featuredArticle.author.name}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/20"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-[#002045]">
                                                {featuredArticle.author.name}
                                            </span>
                                            <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                                                {featuredArticle.author.role}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setActiveArticleModal(featuredArticle)}
                                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00677c] hover:text-teal-700 hover:translate-x-0.5 transition-all cursor-pointer"
                                    >
                                        <span>Đọc ngay</span>
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
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#002045]">
                            {selectedCategory === "all" ? "Tất cả bài viết y khoa" : `Chuyên mục: ${categories.find(c => c.id === selectedCategory)?.label}`}
                        </h3>
                        <span className="text-xs sm:text-sm text-slate-500 font-medium">
                            Hiển thị {filteredArticles.length} bài viết
                        </span>
                    </div>

                    {filteredArticles.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 flex flex-col items-center gap-3">
                            <span className="text-4xl">🔍</span>
                            <p className="text-base font-bold text-slate-700">Không tìm thấy bài viết phù hợp</p>
                            <p className="text-sm text-slate-500">Hãy thử tìm kiếm bằng từ khóa khác hoặc chọn chuyên mục "Tất cả bài viết".</p>
                            <button
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setSearchQuery("");
                                }}
                                className="mt-2 px-4 py-2 bg-[#00677c] text-white rounded-xl text-xs font-semibold hover:bg-[#005264]"
                            >
                                Xem tất cả bài viết
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.map((article) => (
                                <article
                                    key={article.id}
                                    className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
                                >
                                    {/* Ảnh đại diện */}
                                    <div className="h-48 relative overflow-hidden bg-slate-100">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-[11px] font-bold text-teal-800 shadow-xs">
                                            {article.categoryName}
                                        </span>
                                    </div>

                                    {/* Nội dung tóm tắt */}
                                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                                <span>{article.date}</span>
                                                <span>•</span>
                                                <span>{article.readTime}</span>
                                            </div>

                                            <h4
                                                onClick={() => setActiveArticleModal(article)}
                                                className="text-base font-bold text-[#002045] group-hover:text-[#00677c] cursor-pointer transition-colors leading-snug line-clamp-2"
                                            >
                                                {article.title}
                                            </h4>

                                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                                {article.summary}
                                            </p>
                                        </div>

                                        {/* Tác giả & CTA */}
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={article.author.avatar}
                                                    alt={article.author.name}
                                                    className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-500/20"
                                                />
                                                <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">
                                                    {article.author.name}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => setActiveArticleModal(article)}
                                                className="text-xs font-bold text-[#00677c] hover:underline cursor-pointer"
                                            >
                                                Chi tiết →
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* ═══ 4. HỎI ĐÁP Y TẾ THƯỜNG GẶP (FAQ ACCORDION) ═══ */}
                <section className="bg-gradient-to-br from-teal-50/70 to-blue-50/40 rounded-3xl p-6 sm:p-10 border border-teal-100 flex flex-col gap-6">
                    <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
                        <span className="text-xs font-bold text-[#00677c] uppercase tracking-wider">Hỏi đáp y tế</span>
                        <h3 className="text-2xl font-extrabold text-[#002045]">Câu hỏi thường gặp từ các gia đình</h3>
                    </div>

                    <div className="max-w-3xl mx-auto w-full flex flex-col gap-3">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all"
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#002045] hover:text-[#00677c] transition-colors cursor-pointer"
                                    >
                                        <span>{faq.q}</span>
                                        <svg
                                            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#00677c]" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ═══ 5. BANNER KÊU GỌI HÀNH ĐỘNG (CTA BANNER) ═══ */}
                <section className="bg-gradient-to-r from-[#004857] to-[#00677c] rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
                    <div className="flex flex-col gap-2 text-center sm:text-left max-w-xl">
                        <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">Hỗ trợ 24/7</span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Gia đình cần điều dưỡng chuyên môn chăm sóc tại nhà?
                        </h3>
                        <p className="text-teal-100 text-sm sm:text-base">
                            Đội ngũ điều dưỡng và sinh viên Y khoa CareLink đã được kiểm định chứng chỉ và sẵn sàng hỗ trợ tận tâm.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                        <Link
                            to="/family"
                            className="w-full sm:w-auto px-7 py-3.5 bg-white text-[#00677c] hover:bg-teal-50 font-bold text-sm rounded-xl transition-all shadow-md text-center"
                        >
                            Tìm Điều dưỡng ngay
                        </Link>
                        <a
                            href="tel:19001234"
                            className="w-full sm:w-auto px-7 py-3.5 border-2 border-white/40 hover:border-white text-white font-bold text-sm rounded-xl transition-all text-center"
                        >
                            Hotline: 1900 1234
                        </a>
                    </div>
                </section>
            </main>

            {/* ═══ 6. POPUP XEM NHANH BÀI VIẾT (QUICK READ MODAL) ═══ */}
            {activeArticleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-page-enter">
                    <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
                        {/* Header Modal */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
                            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold">
                                {activeArticleModal.categoryName}
                            </span>
                            <button
                                onClick={() => setActiveArticleModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Thân bài viết cuộn */}
                        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002045] leading-snug">
                                {activeArticleModal.title}
                            </h2>

                            <div className="flex items-center gap-3 pt-1 pb-4 border-b border-slate-100">
                                <img
                                    src={activeArticleModal.author.avatar}
                                    alt={activeArticleModal.author.name}
                                    className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500/20"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#002045]">{activeArticleModal.author.name}</span>
                                    <span className="text-xs text-slate-500">{activeArticleModal.author.role}</span>
                                </div>
                                <span className="text-slate-300 ml-auto hidden sm:block">•</span>
                                <span className="text-xs text-slate-400 hidden sm:block">{activeArticleModal.date}</span>
                            </div>

                            <img
                                src={activeArticleModal.image}
                                alt={activeArticleModal.title}
                                className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-sm"
                            />

                            <div
                                className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-[#002045] [&>h3]:pt-3 [&>ul]:list-disc [&>ul]:pl-5"
                                dangerouslySetInnerHTML={{ __html: activeArticleModal.content }}
                            />
                        </div>

                        {/* Footer Modal */}
                        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                            <span className="text-xs text-slate-500 hidden sm:block">
                                Chia sẻ kiến thức vì sức khỏe cộng đồng
                            </span>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                <button
                                    onClick={() => setActiveArticleModal(null)}
                                    className="px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-white transition-all cursor-pointer"
                                >
                                    Đóng
                                </button>
                                <Link
                                    to="/family"
                                    className="px-5 py-2.5 bg-[#00677c] text-white text-xs font-bold rounded-xl hover:bg-[#005264] transition-all shadow-sm"
                                >
                                    Đặt ca chăm sóc ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
