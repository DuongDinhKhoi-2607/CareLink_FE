// ═══════════════════════════════════════════════════════════════
// handbookData.js — Dữ liệu Cẩm Nang Y Tế CareLink
// Gộp: Danh mục, Bài viết (với nguồn tham khảo thật), FAQ
// ═══════════════════════════════════════════════════════════════

// ─── 1. DANH MỤC ──────────────────────────────────────────────
export const categories = [
    { id: "all", label: "Tất cả bài viết" },
    { id: "elderly", label: "Chăm sóc người cao tuổi" },
    { id: "post-surgery", label: "Phục hồi sau phẫu thuật" },
    { id: "therapy", label: "Vật lý trị liệu" },
    { id: "nutrition", label: "Dinh dưỡng & Dược phẩm" },
    { id: "first-aid", label: "Sơ cấp cứu tại nhà" },
];

// ─── 2. BÀI VIẾT ──────────────────────────────────────────────
export const articles = [
    {
        id: 1,
        featured: true,
        category: "elderly",
        categoryName: "Chăm sóc người cao tuổi",
        title: "5 Dấu hiệu suy giảm sức khỏe ở người cao tuổi gia đình không nên chủ quan",
        summary:
            "Nhận biết sớm các triệu chứng thầm lặng về tim mạch, huyết áp và sa sút trí tuệ để có biện pháp can thiệp y tế kịp thời, bảo vệ an toàn cho cha mẹ...",
        readTime: "6 phút đọc",
        date: "20/09/2026",
        source: "Vinmec",
        sourceDetail: "Tổng hợp từ chuyên mục Lão khoa",
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200",
        reviewed: true,
        content: `
            <h3>1. Sự thay đổi đột ngột về giấc ngủ và cảm xúc</h3>
            <p>Người cao tuổi thường ngủ ít hơn, nhưng nếu đột ngột ngủ li bì cả ngày hoặc mất ngủ kéo dài kèm theo cảm giác bồn chồn, đây có thể là dấu hiệu cảnh báo của rối loạn tuần hoàn não hoặc trầm cảm tuổi già. Tình trạng mệt mỏi kéo dài không cải thiện sau khi nghỉ ngơi cũng có thể liên quan đến thiếu máu, bệnh tim mạch hoặc rối loạn giấc ngủ.</p>
            
            <h3>2. Khó khăn trong việc giữ thăng bằng và di chuyển</h3>
            <p>Những bước đi ngập ngừng, loạng choạng hay thường xuyên va quẹt đồ đạc là biểu hiện của suy giảm chức năng tiền đình hoặc yếu cơ chi dưới. Hệ thống gân xương yếu và phản xạ giảm theo tuổi tác khiến người cao tuổi có nguy cơ té ngã rất cao. Cần có người chăm sóc hỗ trợ khi di chuyển trong nhà vệ sinh hoặc cầu thang, đồng thời sắp xếp không gian sống an toàn, loại bỏ thảm trải sàn và dây điện trên sàn.</p>

            <h3>3. Hay quên các sự kiện vừa mới diễn ra</h3>
            <p>Nếu người thân quên chìa khóa hay quên kính mắt thì bình thường, nhưng nếu họ quên tên con cháu, quên đã ăn cơm chưa hay đi lạc ngay trên con đường quen thuộc, đây có thể là dấu hiệu sớm của sa sút trí tuệ (dementia) hoặc Alzheimer. Gia đình cần đưa đi khám chuyên khoa thần kinh ngay để được chẩn đoán và can thiệp kịp thời.</p>

            <h3>4. Khẩu vị thay đổi, chán ăn và sụt cân không rõ nguyên nhân</h3>
            <p>Mất cảm giác thèm ăn kéo dài có thể xuất phát từ các vấn đề răng miệng, tiêu hóa hoặc bệnh lý chuyển hóa tiềm ẩn như đái tháo đường, suy thận mạn. Nếu người cao tuổi giảm từ 5% trọng lượng cơ thể trở lên trong vòng 6-12 tháng mà không có ý định giảm cân, đây là cảnh báo nghiêm trọng cần thăm khám ngay.</p>

            <h3>5. Huyết áp dao động thất thường</h3>
            <p>Cần theo dõi huyết áp định kỳ 2 lần mỗi ngày: buổi sáng sau khi thức dậy (trước khi ăn sáng và uống thuốc), và buổi tối trước khi đi ngủ. Nghỉ ngơi yên tĩnh 5-10 phút trước khi đo. Huyết áp tăng vọt trên 140/90 mmHg hoặc tụt đột ngột đều tiềm ẩn nguy cơ đột quỵ và té ngã.</p>

            <h3>⚠️ Khi nào cần đưa đi cấp cứu ngay?</h3>
            <p>Nếu xuất hiện các triệu chứng sau, cần gọi cấp cứu 115 ngay lập tức:</p>
            <ul>
                <li>Yếu liệt chi, liệt mặt hoặc méo miệng (nghi đột quỵ)</li>
                <li>Tím tái bất thường, khó thở, thở nhanh hoặc ngừng thở từng cơn</li>
                <li>Đau ngực nặng kéo dài</li>
                <li>Bất tỉnh, mê sảng hoặc lơ mơ đột ngột</li>
                <li>Đau đầu dữ dội "sét đánh" chưa từng có tiền lệ</li>
            </ul>
        `,
        references: [
            {
                text: "Vinmec — Hội chứng dễ bị tổn thương ở người cao tuổi: 5 dấu hiệu suy giảm cần biết",
                url: "https://www.vinmec.com/vie/bai-viet/hoi-chung-de-bi-ton-thuong-o-nguoi-cao-tuoi-vi",
            },
            {
                text: "Báo Sức khỏe & Đời sống (Bộ Y tế) — Những triệu chứng cảnh báo ở người lớn tuổi không nên bỏ qua",
                url: "https://suckhoedoisong.vn/nhung-trieu-chung-o-nguoi-lon-tuoi-khong-nen-bo-qua-16923603.htm",
            },
            {
                text: "Vinmec — Các dấu hiệu sa sút trí tuệ ở người cao tuổi và cách chăm sóc",
                url: "https://www.vinmec.com/vie/bai-viet/cac-dau-hieu-sa-sut-tri-tue-o-nguoi-cao-tuoi-va-cach-cham-soc-vi",
            },
        ],
    },
    {
        id: 2,
        featured: false,
        category: "nutrition",
        categoryName: "Dinh dưỡng & Dược phẩm",
        title: "Chế độ dinh dưỡng vàng cho bệnh nhân cao huyết áp và đái tháo đường",
        summary:
            "Nguyên tắc thiết kế thực đơn khoa học theo chế độ DASH, kiểm soát đường huyết, giảm muối và tăng cường vi khoáng giúp tim mạch luôn khỏe mạnh.",
        readTime: "7 phút đọc",
        date: "18/09/2026",
        source: "Vinmec & Báo SK&ĐS",
        sourceDetail: "Chuyên mục Dinh dưỡng lâm sàng & Tim mạch",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800",
        reviewed: true,
        content: `
            <h3>Chế độ DASH — Phương pháp dinh dưỡng hàng đầu</h3>
            <p>DASH (Dietary Approaches to Stop Hypertension) là chế độ ăn được các chuyên gia y tế khuyến nghị rộng rãi nhất cho người bị cao huyết áp kèm đái tháo đường. Chế độ này tập trung cung cấp kali, canxi, magie và chất xơ — các dưỡng chất giúp giãn mạch và điều hòa huyết áp.</p>

            <h3>Nguyên tắc giảm muối — Chìa khóa giảm huyết áp</h3>
            <p>Lượng natri nạp vào mỗi ngày không nên vượt quá 2.300 mg (khoảng 1 muỗng cà phê muối gạt ngang), lý tưởng nhất là dưới 1.500 mg/ngày. Hạn chế thực phẩm chế biến sẵn, đồ hộp, thịt xông khói, xúc xích và nước chấm cô đặc vì chứa hàm lượng muối rất cao. Thay vào đó, sử dụng gia vị tự nhiên như tỏi, gừng, húng quế, nước cốt chanh để tăng hương vị.</p>

            <h3>Ưu tiên ngũ cốc nguyên hạt</h3>
            <p>Thay gạo trắng bằng gạo lứt, yến mạch hoặc khoai lang luộc giúp phóng thích đường chậm, không làm đường huyết tăng vọt sau bữa ăn. Ngũ cốc nguyên hạt giàu chất xơ giúp tạo cảm giác no lâu, hỗ trợ kiểm soát cân nặng hiệu quả.</p>

            <h3>Thực phẩm nên tăng cường</h3>
            <ul>
                <li><strong>Rau xanh và trái cây:</strong> Cung cấp kali, vitamin và chất chống oxy hóa</li>
                <li><strong>Các loại đậu và hạt:</strong> Giàu protein thực vật và chất xơ</li>
                <li><strong>Sữa ít béo:</strong> Bổ sung canxi mà không tăng cholesterol xấu</li>
                <li><strong>Cá béo (cá hồi, cá thu):</strong> Giàu omega-3 tốt cho tim mạch</li>
            </ul>

            <h3>Chia nhỏ bữa ăn</h3>
            <p>Nên chia thành 4-5 bữa nhỏ trong ngày để dạ dày người cao tuổi dễ tiêu hóa và hấp thu tối ưu. Việc chia nhỏ bữa ăn còn giúp ổn định đường huyết suốt cả ngày, tránh hiện tượng đường huyết tăng đột biến sau bữa ăn lớn.</p>

            <h3>Lưu ý quan trọng</h3>
            <p>DASH không phải là chế độ ăn "kiêng khem" khắc nghiệt mà là một lối sống dinh dưỡng bền vững. Bạn có thể bắt đầu bằng những thay đổi nhỏ như tăng thêm một phần rau trong bữa tối hoặc thay cơm trắng bằng gạo lứt. Luôn đọc nhãn dinh dưỡng trên bao bì để kiểm tra lượng natri trước khi mua sản phẩm.</p>
        `,
        references: [
            {
                text: "Vinmec — Chế độ ăn DASH cho sức khỏe tim mạch – Giảm huyết áp và Cholesterol",
                url: "https://www.vinmec.com/vie/bai-viet/che-do-an-dash-cho-suc-khoe-tim-mach-giam-huyet-ap-va-cholesterol-vi",
            },
            {
                text: "Báo Sức khỏe & Đời sống (Bộ Y tế) — DASH: Chế độ ăn giúp phòng ngừa và hỗ trợ điều trị bệnh tăng huyết áp",
                url: "https://suckhoedoisong.vn/dash-che-do-an-giup-phong-ngua-va-ho-tro-dieu-tri-benh-tang-huyet-ap-169210709141935567.htm",
            },
            {
                text: "Vinmec — Hướng dẫn chế độ ăn uống khoa học khi bị cao huyết áp",
                url: "https://www.vinmec.com/vie/bai-viet/che-do-uong-khi-bi-cao-huyet-ap-vi",
            },
        ],
    },
    {
        id: 3,
        featured: false,
        category: "elderly",
        categoryName: "Chăm sóc người cao tuổi",
        title: "Kỹ thuật lật trở và phòng ngừa loét tì đè ở người nằm bất động lâu ngày",
        summary:
            "Hướng dẫn thực hành chuẩn điều dưỡng về chu kỳ xoay trở 2 giờ một lần, chăm sóc da và sử dụng đệm hơi chống loét chuyên dụng.",
        readTime: "8 phút đọc",
        date: "15/09/2026",
        source: "Vinmec",
        sourceDetail: "Khoa Điều dưỡng & Phục hồi chức năng",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
        reviewed: true,
        content: `
            <h3>Quy tắc 2 giờ vàng</h3>
            <p>Đối với bệnh nhân nằm liệt giường hoặc sau đột quỵ, cần thay đổi tư thế nằm nghiêng trái, nằm ngửa, nằm nghiêng phải đều đặn mỗi 2 tiếng một lần (cả ngày lẫn đêm) để giải phóng áp lực, giúp máu lưu thông trở lại nuôi dưỡng da.</p>

            <h3>Kỹ thuật xoay trở an toàn</h3>
            <p>Tuyệt đối <strong>không kéo lê</strong> bệnh nhân trên bề mặt giường vì lực ma sát sẽ làm tổn thương lớp biểu bì, dễ gây loét. Cần nâng bệnh nhân lên hoặc sử dụng tấm lót hỗ trợ để di chuyển. Khi lật nghiêng, nên nghiêng khoảng 30 độ và chèn gối dọc theo lưng để giữ tư thế ổn định. Đặt gối lót giữa hai đầu gối và dưới cánh tay để giảm áp lực cục bộ.</p>

            <h3>Các vị trí cần đặc biệt lưu ý</h3>
            <ul>
                <li><strong>Khi nằm ngửa:</strong> Xương sọ, bả vai, khuỷu tay, xương cùng cụt và gót chân</li>
                <li><strong>Khi nằm nghiêng:</strong> Tai, vai, hông, đầu gối và mắt cá chân</li>
                <li><strong>Khi ngồi xe lăn:</strong> Vùng ụ ngồi và xương cùng — cần thay đổi tư thế mỗi 15-30 phút</li>
            </ul>

            <h3>Vệ sinh da khô thoáng</h3>
            <p>Lau rửa nhẹ nhàng vùng cùng cụt, gót chân, bả vai bằng nước ấm, lau khô bằng khăn mềm và thoa kem dưỡng ẩm bảo vệ da. Vệ sinh ngay lập tức nếu da bị ẩm ướt do mồ hôi, nước tiểu hoặc phân. Giữ ga trải giường luôn phẳng, sạch và khô thoáng.</p>

            <h3>Dinh dưỡng phòng ngừa loét</h3>
            <p>Cung cấp đầy đủ protein, vitamin C, kẽm và khoáng chất để da khỏe mạnh và vết thương (nếu có) nhanh hồi phục. Đảm bảo người bệnh uống đủ nước mỗi ngày.</p>

            <h3>Dấu hiệu cảnh báo sớm</h3>
            <p>Kiểm tra các vùng da có nguy cơ bị tì đè hàng ngày. Dấu hiệu sớm nhất là <strong>da đỏ, nóng rát và không biến mất khi ấn vào</strong>. Khi phát hiện, cần xoay trở tư thế ngay lập tức, giảm áp lực và thông báo cho bác sĩ để can thiệp kịp thời.</p>
        `,
        references: [
            {
                text: "Vinmec — Hướng dẫn chăm sóc bệnh nhân bị loét áp lực do tỳ đè nằm lâu ngày",
                url: "https://www.vinmec.com/vie/bai-viet/cham-soc-benh-nhan-bi-loet-ap-luc-do-ty-de-vi",
            },
            {
                text: "Vinmec — Kỹ thuật chăm sóc và xử lý các giai đoạn loét do tỳ đè",
                url: "https://www.vinmec.com/vie/bai-viet/xu-ly-loet-do-ty-de-vi",
            },
            {
                text: "Vinmec — Đánh giá nguy cơ loét tì đè theo thang điểm lâm sàng Braden",
                url: "https://www.vinmec.com/vie/bai-viet/du-doan-thang-diem-danh-gia-nguy-co-loet-do-ti-de-vi",
            },
        ],
    },
    {
        id: 4,
        featured: false,
        category: "first-aid",
        categoryName: "Sơ cấp cứu tại nhà",
        title: "Nhận diện cơn Đột quỵ trong 'Giờ Vàng' với quy tắc F.A.S.T cứu sống người bệnh",
        summary:
            "Thời gian là não bộ! Hướng dẫn xử trí đúng cách trong 3-4.5 giờ đầu tiên khi người thân có dấu hiệu tai biến mạch máu não.",
        readTime: "5 phút đọc",
        date: "12/09/2026",
        source: "BV Bạch Mai & Vinmec",
        sourceDetail: "Trung tâm Đột quỵ & Cấp cứu can thiệp",
        image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800",
        reviewed: true,
        content: `
            <h3>Quy tắc FAST cần thuộc lòng</h3>
            <ul>
                <li><strong>F (Face - Mặt):</strong> Mặt mất cân đối, méo miệng khi cười. Yêu cầu người bệnh cười thử — nếu một bên mặt xệ xuống là dấu hiệu nghi ngờ.</li>
                <li><strong>A (Arm - Tay):</strong> Yếu hoặc liệt một bên tay, không nhấc lên được. Yêu cầu giơ cả hai tay lên — nếu một tay rơi xuống là cảnh báo.</li>
                <li><strong>S (Speech - Lời nói):</strong> Nói ngọng, phát âm khó, nói lắp hoặc không hiểu lời nói người khác.</li>
                <li><strong>T (Time - Thời gian):</strong> Gọi ngay cấp cứu 115! Mỗi phút trôi qua, khoảng 1,9 triệu tế bào thần kinh bị chết.</li>
            </ul>

            <h3>Những việc KHÔNG ĐƯỢC LÀM khi nghi đột quỵ</h3>
            <ul>
                <li>❌ Không châm cứu, bấm huyệt, cạo gió</li>
                <li>❌ Không cho uống thuốc hạ áp hoặc bất kỳ loại thuốc nào</li>
                <li>❌ Không cho ăn uống (nguy cơ sặc do yếu cơ hầu họng)</li>
                <li>❌ Không tự ý di chuyển bằng xe máy — gọi xe cấp cứu</li>
            </ul>

            <h3>Những việc CẦN LÀM ngay lập tức</h3>
            <ul>
                <li>✅ Gọi cấp cứu 115 — thông báo rõ nghi ngờ "đột quỵ não" để điều phối bệnh viện phù hợp</li>
                <li>✅ Đặt người bệnh nằm nghiêng an toàn (phòng sặc nếu nôn), kê cao đầu 30 độ</li>
                <li>✅ Nới lỏng quần áo, thắt lưng cho thoáng khí</li>
                <li>✅ Giữ yên tĩnh, trấn an người bệnh</li>
                <li>✅ Ghi lại chính xác giờ khởi phát triệu chứng để báo bác sĩ cấp cứu</li>
            </ul>
        `,
        references: [
            {
                text: "Bệnh viện Bạch Mai — 6 điều cần làm và 3 điều nên tránh đối với bệnh nhân đột quỵ não",
                url: "https://bachmai.gov.vn/bai-viet/sau-dieu-can-lam-va-ba-dieu-nen-tranh-doi-voi-benh-nhan-dot-quy",
            },
            {
                text: "Vinmec — 6 dấu hiệu nhận biết cơn đột quỵ sớm theo chuẩn y khoa",
                url: "https://www.vinmec.com/vie/bai-viet/6-dau-hieu-nhan-biet-dot-quy-som-vi",
            },
            {
                text: "Vinmec — Hướng dẫn trực quan nhận diện và xử trí cơn đột quỵ trong giờ vàng",
                url: "https://www.vinmec.com/vie/bai-viet/huong-dan-truc-quan-de-hieu-ve-dot-quy-vi",
            },
        ],
    },
    {
        id: 5,
        featured: false,
        category: "therapy",
        categoryName: "Vật lý trị liệu",
        title: "Các bài tập vận động nhẹ nhàng giúp cải thiện giấc ngủ và khớp gối cho ông bà",
        summary:
            "Hướng dẫn chi tiết các động tác co duỗi an toàn giúp lưu thông khí huyết, giảm cứng khớp buổi sáng và kích thích giấc ngủ ngon tự nhiên.",
        readTime: "7 phút đọc",
        date: "10/09/2026",
        source: "Vinmec",
        sourceDetail: "Chuyên khoa Vật lý trị liệu & Phục hồi chức năng",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800",
        reviewed: true,
        content: `
            <h3>Lưu ý trước khi tập</h3>
            <p>Trước khi bắt đầu, người cao tuổi nên tham khảo ý kiến bác sĩ hoặc chuyên gia vật lý trị liệu, đặc biệt nếu có bệnh nền như loãng xương hoặc viêm khớp nặng. Luôn khởi động nhẹ nhàng bằng cách đi bộ tại chỗ hoặc co duỗi gối trước khi tập chính.</p>

            <h3>Động tác 1: Gập duỗi cổ chân trên giường</h3>
            <p>Nằm ngửa, từ từ gập bàn chân lên rồi duỗi xuống, lặp lại 15-20 lần mỗi bên. Bài tập này giúp bơm máu tĩnh mạch từ chi dưới về tim, phòng ngừa thuyên tắc mạch sâu — đặc biệt quan trọng cho người ít vận động.</p>

            <h3>Động tác 2: Nâng chân thẳng (Straight Leg Raise)</h3>
            <p>Nằm ngửa, giữ một chân thẳng và từ từ nâng lên khoảng 30-45 độ, giữ 5 giây rồi hạ xuống. Lặp lại 10 lần mỗi bên. Tăng cường cơ tứ đầu đùi, giảm áp lực tì đè lên khớp gối khi đứng dậy mà không gây áp lực trực tiếp lên sụn khớp.</p>

            <h3>Động tác 3: Căng gân khoeo</h3>
            <p>Ngồi trên giường, duỗi thẳng một chân, từ từ cúi người về phía trước cho đến khi cảm thấy căng nhẹ ở mặt sau đùi. Giữ 15-20 giây. Giúp cải thiện độ dẻo dai, giảm cứng khớp buổi sáng.</p>

            <h3>Động tác 4: Đạp xe trên không</h3>
            <p>Nằm ngửa, nâng hai chân lên và thực hiện động tác đạp xe trong không khí. Tập chậm, đều đặn trong 30-60 giây. Vận động nhẹ nhàng giúp khớp gối linh hoạt hơn mà không chịu trọng lượng cơ thể.</p>

            <h3>Cải thiện giấc ngủ nhờ vận động</h3>
            <p>Tập luyện nhẹ nhàng 20-30 phút mỗi ngày (đi bộ, yoga, các bài tập trên) giúp cơ thể thư giãn, giảm căng thẳng và sản sinh hormone hỗ trợ giấc ngủ. Lưu ý tránh tập cường độ cao sát giờ đi ngủ.</p>

            <h3>Nguyên tắc an toàn</h3>
            <ul>
                <li>Tập chậm, đều đặn — tránh bật nhảy hoặc xoay vặn gối mạnh</li>
                <li>Dừng tập ngay nếu cảm thấy đau nhói hoặc khớp gối sưng nóng</li>
                <li>Kết hợp ngâm chân nước ấm trước khi ngủ để hỗ trợ giấc ngủ sâu</li>
                <li>Giữ phòng ngủ tối, yên tĩnh và nhiệt độ mát mẻ</li>
            </ul>
        `,
        references: [
            {
                text: "Vinmec — 7 bài tập vật lý trị liệu khớp gối an toàn và hiệu quả",
                url: "https://www.vinmec.com/vie/bai-viet/cac-bai-tap-vat-ly-tri-lieu-khop-goi-vi",
            },
            {
                text: "Vinmec — Các bài tập phục hồi chức năng thoái hóa khớp gối nên áp dụng",
                url: "https://www.vinmec.com/vie/bai-viet/cac-bai-tap-thoai-hoa-khop-goi-nen-ap-dung-vi",
            },
            {
                text: "Vinmec — Cách để ngủ ngon hơn khi bạn già đi nhờ vận động và điều chỉnh sinh hoạt",
                url: "https://www.vinmec.com/vie/bai-viet/cach-de-ngu-ngon-hon-khi-ban-gia-di-vi",
            },
        ],
    },
    {
        id: 6,
        featured: false,
        category: "post-surgery",
        categoryName: "Phục hồi sau phẫu thuật",
        title: "Lộ trình chăm sóc 30 ngày vàng sau mổ thay khớp háng và khớp gối",
        summary:
            "Những lưu ý an toàn về tư thế ngồi, đi vệ sinh, phòng tránh trật khớp nhân tạo và chế độ tập luyện phục hồi cử động.",
        readTime: "9 phút đọc",
        date: "05/09/2026",
        source: "Vinmec",
        sourceDetail: "Trung tâm Chấn thương Chỉnh hình & Y học thể thao",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
        reviewed: true,
        content: `
            <h3>Tại sao 30 ngày đầu quan trọng?</h3>
            <p>Giai đoạn 30 ngày đầu sau phẫu thuật thay khớp là thời gian "vàng" để ổn định khớp nhân tạo và ngăn ngừa biến chứng. Việc tập phục hồi chức năng nên bắt đầu ngay từ ngày đầu sau mổ theo hướng dẫn của bác sĩ để tăng sức cơ, duy trì vận động và phòng ngừa tắc mạch.</p>

            <h3>Lưu ý đặc biệt sau thay khớp háng</h3>
            <ul>
                <li><strong>Không bắt chéo chân:</strong> Tuyệt đối không vắt chéo chân đã mổ qua chân kia trong ít nhất 3 tháng đầu</li>
                <li><strong>Không gập háng quá 90 độ:</strong> Không cúi nhặt đồ dưới đất, không ngồi ghế quá thấp</li>
                <li><strong>Tư thế ngủ:</strong> Đặt gối giữa hai chân để giữ khớp háng ở vị trí trung lập, tránh chân mổ xoay vào trong</li>
                <li><strong>Khi ngồi:</strong> Sử dụng ghế có tay vịn và bàn cầu cao để không gập khớp háng quá mức khi đứng dậy</li>
            </ul>

            <h3>Lưu ý đặc biệt sau thay khớp gối</h3>
            <ul>
                <li><strong>Chườm đá:</strong> Chườm túi đá quanh khớp gối khoảng 20 phút/giờ (tối thiểu 3 lần/ngày) trong 6 tuần đầu để giảm sưng</li>
                <li><strong>Tập duỗi thẳng gối:</strong> Tập gập gối nhẹ nhàng theo chỉ định, dần dần tăng biên độ</li>
                <li><strong>Chịu lực:</strong> Chỉ đặt trọng lượng lên chân phẫu thuật theo đúng chỉ định, dùng khung tập đi hoặc nạng trong thời gian đầu</li>
            </ul>

            <h3>Chăm sóc vết mổ</h3>
            <p>Giữ vết mổ khô ráo, sạch sẽ. Thường sau 14 ngày sẽ cắt chỉ. Không tự ý tháo băng hoặc ngâm vết thương trong nước — tránh tắm bồn cho đến khi vết thương lành hoàn toàn (thường sau 5-6 tuần). Khi tắm, hãy che chắn vết mổ bằng băng chống thấm nước.</p>

            <h3>Sử dụng khung tập đi</h3>
            <p>Luôn có điều dưỡng hoặc người nhà giám sát khi tập bước đi với khung hỗ trợ. Sắp xếp không gian sống an toàn: loại bỏ thảm trải sàn, dây cáp trên sàn, đảm bảo nhà tắm và nhà bếp chống trơn trượt.</p>

            <h3>⚠️ Dấu hiệu cần báo bác sĩ ngay</h3>
            <ul>
                <li>Vết mổ đỏ, sưng, nóng, chảy dịch hoặc có mùi lạ</li>
                <li>Cơn đau tăng lên bất thường, không đáp ứng thuốc giảm đau</li>
                <li>Sốt, ớn lạnh hoặc cảm thấy không khỏe</li>
                <li>Sưng phù chân nghiêm trọng (đặc biệt sưng cả bắp chân kèm đau — nghi tắc mạch)</li>
            </ul>
        `,
        references: [
            {
                text: "Vinmec — Các tư thế nên tránh vận động và lưu ý sau phẫu thuật thay khớp háng",
                url: "https://www.vinmec.com/vie/bai-viet/cac-tu-nen-tranh-van-dong-sau-thay-khop-hang-vi",
            },
            {
                text: "Vinmec — Hướng dẫn các tư thế nằm ngủ an toàn cho người thay khớp háng nhân tạo",
                url: "https://www.vinmec.com/vie/bai-viet/cac-tu-ngu-hop-cho-nguoi-thay-khop-hang-vi",
            },
            {
                text: "Vinmec — Phục hồi chức năng và chăm sóc khớp gối sau phẫu thuật",
                url: "https://www.vinmec.com/vie/bai-viet/phuc-hoi-chuc-nang-cung-khop-goi-sau-mo-vi",
            },
        ],
    },
];

// ─── 3. HỎI ĐÁP THƯỜNG GẶP ───────────────────────────────────
export const faqs = [
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
    {
        q: "Chi phí dịch vụ chăm sóc tại nhà của CareLink được tính như thế nào?",
        a: "Chi phí được tính theo ca (4 giờ hoặc 8 giờ) tùy theo loại dịch vụ và mức độ chăm sóc. Gia đình có thể xem bảng giá chi tiết trên trang Dịch Vụ hoặc liên hệ hotline để được tư vấn miễn phí.",
    },
];
