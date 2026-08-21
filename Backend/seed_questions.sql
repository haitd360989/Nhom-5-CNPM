-- TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

INSERT INTO questions (content, choices, correct_answer, subject, topic, difficulty, explanation) VALUES
-- =========================================================================
-- 1. TOÁN HỌC & TƯ DUY ĐỊNH LƯỢNG (10 CÂU)
-- =========================================================================
(
  'Cho hàm số $y = x^3 - 3x + 2$. Giá trị cực đại của hàm số là gì?',
  '{"A": "2", "B": "4", "C": "0", "D": "1"}',
  'B', 'Toán học', 'Hàm số', 'MEDIUM',
  'Đạo hàm $y'' = 3x^2 - 3 = 0 \Leftrightarrow x = \pm 1$. Ta có $y(1) = 0$ (cực tiểu), $y(-1) = 4$ (cực đại). Vậy giá trị cực đại là 4.'
),
(
  'Tính tích phân $I = \int_0^1 (2x + 1) dx$.',
  '{"A": "1", "B": "2", "C": "3", "D": "4"}',
  'B', 'Toán học', 'Tích phân', 'EASY',
  'Nguyên hàm của $(2x + 1)$ là $x^2 + x$. Thay cận từ 0 đến 1: $(1^2 + 1) - (0^2 + 0) = 2$.'
),
(
  'Cho cấp số cộng có $u_1 = 2$ và công sai $d = 3$. Tìm số hạng $u_5$.',
  '{"A": "14", "B": "17", "C": "11", "D": "15"}',
  'A', 'Toán học', 'Dãy số', 'EASY',
  'Công thức số hạng tổng quát của cấp số cộng: $u_n = u_1 + (n - 1)d \Rightarrow u_5 = 2 + 4 \times 3 = 14$.'
),
(
  'Có bao nhiêu cách xếp 5 học sinh thành một hàng ngang?',
  '{"A": "24", "B": "120", "C": "60", "D": "720"}',
  'B', 'Toán học', 'Tổ hợp', 'MEDIUM',
  'Số cách sắp xếp 5 phần tử theo thứ tự là hoán vị của 5: $P_5 = 5! = 5 \times 4 \times 3 \times 2 \times 1 = 120$.'
),
(
  'Xác suất để gieo một con súc sắc cân đối xuất hiện mặt chấm chẵn là bao nhiêu?',
  '{"A": "1/2", "B": "1/3", "C": "1/6", "D": "2/3"}',
  'A', 'Toán học', 'Xác suất', 'EASY',
  'Không gian mẫu có 6 khả năng {1, 2, 3, 4, 5, 6}. Các mặt chẵn là {2, 4, 6} (3 kết quả thuận lợi). Xác suất $P = 3/6 = 1/2$.'
),
(
  'Tìm giá trị lớn nhất của hàm số $y = -x^2 + 4x + 1$ trên đoạn $[0; 3]$.',
  '{"A": "4", "B": "5", "C": "1", "D": "3"}',
  'B', 'Toán học', 'Hàm số', 'EASY',
  'Đỉnh parabol tại $x = 2 \in [0; 3]$. Giá trị tại đỉnh $y(2) = 5$. Tại biên $y(0) = 1, y(3) = 4$. Vậy GTLN là 5.'
),
(
  'Một lớp có 20 học sinh nam và 15 học sinh nữ. Chọn ngẫu nhiên 3 học sinh. Xác suất để chọn được ít nhất 1 học sinh nữ là bao nhiêu?',
  '{"A": "114/650", "B": "536/650", "C": "137/187", "D": "50/187"}',
  'C', 'Toán học', 'Xác suất', 'MEDIUM',
  'Số cách chọn 3 học sinh bất kỳ là $C_{35}^3 = 6545$. Số cách chọn 3 học sinh toàn nam là $C_{20}^3 = 1140$. Xác suất cần tìm là $P = 1 - (1140 / 6545) = 137/187$.'
),
(
  'Cho hình lăng trụ tam giác đều $ABC.A''B''C''$ có tất cả các cạnh bằng $a$. Thể tích khối lăng trụ bằng bao nhiêu?',
  '{"A": "a^3 \\sqrt{3} / 4", "B": "a^3 \\sqrt{3} / 12", "C": "a^3 / 4", "D": "a^3 \\sqrt{3} / 2"}',
  'A', 'Toán học', 'Hình không gian', 'MEDIUM',
  'Diện tích đáy $S = a^2 \sqrt{3} / 4$. Chiều cao $h = a$. Thể tích lăng trụ $V = S \times h = a^3 \sqrt{3} / 4$.'
),
(
  'Tập nghiệm của bất phương trình $\log_2(x - 1) < 3$ là gì?',
  '{"A": "(-\\infty; 9)", "B": "(1; 9)", "C": "(1; 7)", "D": "(0; 9)"}',
  'B', 'Toán học', 'Mũ - Logarit', 'EASY',
  'Điều kiện $x > 1$. Bất phương trình tương đương $x - 1 < 2^3 = 8 \Leftrightarrow x < 9$. Kết hợp điều kiện ta có $S = (1; 9)$.'
),
(
  'Tìm nguyên hàm $\int e^{2x + 1} dx$.',
  '{"A": "e^{2x+1} + C", "B": "2e^{2x+1} + C", "C": "\\frac{1}{2}e^{2x+1} + C", "D": "\\frac{1}{2}e^{2x} + C"}',
  'C', 'Toán học', 'Tích phân', 'EASY',
  'Áp dụng công thức $\int e^{ax+b} dx = \frac{1}{a} e^{ax+b} + C$ với $a = 2, b = 1$, ta được $\frac{1}{2}e^{2x+1} + C$.'
),

-- =========================================================================
-- 2. TƯ DUY LOGIC & SUY LUẬN (10 CÂU)
-- =========================================================================
(
  'Nếu tất cả A là B, và một số B là C, mệnh đề nào sau đây chắc chắn đúng?',
  '{"A": "Tất cả A là C", "B": "Một số A có thể là C", "C": "Không có A nào là C", "D": "Mọi C đều là A"}',
  'B', 'Logic', 'Mệnh đề', 'MEDIUM',
  'Vì tập hợp A nằm hoàn toàn trong B, và B giao với C, nên hoàn toàn có khả năng phần giao của B và C chứa các phần tử thuộc A.'
),
(
  'Tìm số tiếp theo trong dãy số: 2, 6, 12, 20, 30, ...',
  '{"A": "36", "B": "40", "C": "42", "D": "48"}',
  'C', 'Logic', 'Quy luật số', 'EASY',
  'Hiệu giữa hai số liên tiếp tăng dần: +4, +6, +8, +10, +12. Số tiếp theo là 30 + 12 = 42.'
),
(
  'An cao hơn Bình, Cường thấp hơn An. Khẳng định nào sau đây là ĐÚNG NHẤT?',
  '{"A": "Bình cao hơn Cường", "B": "Cường cao hơn Bình", "C": "An là người cao nhất", "D": "Bình thấp nhất"}',
  'C', 'Logic', 'Suy luận thứ tự', 'MEDIUM',
  'An cao hơn cả Bình và Cường, do đó An chắc chắn là người cao nhất trong 3 người (chưa đủ dữ kiện so sánh giữa Bình và Cường).'
),
(
  'Nếu hôm nay là Thứ Hai, thì 100 ngày nữa sẽ là Thứ mấy?',
  '{"A": "Thứ Ba", "B": "Thứ Tư", "C": "Thứ Năm", "D": "Thứ Sáu"}',
  'B', 'Logic', 'Thời gian', 'EASY',
  'Chu kỳ tuần có 7 ngày. Ta có 100 mod 7 = 2. Từ Thứ Hai cộng thêm 2 ngày sẽ là Thứ Tư.'
),
(
  'Điền ký tự tiếp theo vào dãy: A, C, F, J, O, ...',
  '{"A": "S", "B": "T", "C": "U", "D": "V"}',
  'C', 'Logic', 'Chuỗi chữ cái', 'MEDIUM',
  'Khoảng cách giữa các chữ cái tăng dần: +2, +3, +4, +5, +6. Từ O (thứ 15) cộng 6 bước sẽ đến chữ U (thứ 21).'
),
(
  'Có 4 bạn An, Bình, Cúc, Dũng thi chạy. An không về nhất nhưng chạy nhanh hơn Bình. Dũng không về bét và chạy chậm hơn Cúc. Nếu Cúc về nhì thì ai về nhất?',
  '{"A": "An", "B": "Bình", "C": "Cúc", "D": "Dũng"}',
  'D', 'Logic', 'Suy luận thứ tự', 'MEDIUM',
  'Cúc về nhì. An chạy nhanh hơn Bình và không về nhất nên An về ba, Bình về bét. Dũng không về bét nên bắt buộc Dũng về nhất.'
),
(
  'Mệnh đề phủ định của mệnh đề "Mọi học sinh trong lớp đều thích học Toán" là gì?',
  '{"A": "Không có học sinh nào thích học Toán", "B": "Tất cả học sinh đều ghét học Toán", "C": "Có ít nhất một học sinh trong lớp không thích học Toán", "D": "Có một học sinh thích học Văn"}',
  'C', 'Logic', 'Mệnh đề', 'EASY',
  'Phủ định của lượng từ "Mọi (với mọi)" là "Tồn tại ít nhất một". Phủ định đúng: "Có ít nhất một học sinh không thích học Toán".'
),
(
  'Cho dãy chữ cái: Z, W, S, N, ... Ký tự tiếp theo là gì?',
  '{"A": "H", "B": "I", "C": "J", "D": "G"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'HARD',
  'Quy luật lùi chữ cái trong bảng Alphabet: Z(26) - 3 = W(23); W(23) - 4 = S(19); S(19) - 5 = N(14); Tiếp theo là N(14) - 6 = H(8).'
),
(
  'Biết rằng: Nếu trời mưa thì đường trơn. Thực tế đường không trơn. Ta rút ra kết luận logic nào?',
  '{"A": "Trời đang mưa to", "B": "Trời không mưa", "C": "Đường mới làm", "D": "Không thể kết luận"}',
  'B', 'Logic', 'Quy tắc suy diễn', 'EASY',
  'Theo quy tắc suy diễn Modus Tollens: P => Q, khi không có Q (đường không trơn) thì kết luận không có P (Trời không mưa).'
),
(
  'Trong một cuộc họp, mỗi người bắt tay với tất cả những người còn lại đúng 1 lần. Có tổng cộng 45 cái bắt tay. Hỏi có bao nhiêu người tham dự cuộc họp?',
  '{"A": "9", "B": "10", "C": "11", "D": "12"}',
  'B', 'Logic', 'Tổ hợp logic', 'MEDIUM',
  'Số cái bắt tay là $n(n - 1) / 2 = 45 \Leftrightarrow n^2 - n - 90 = 0 \Rightarrow n = 10$.'
),

-- =========================================================================
-- 3. TIẾNG VIỆT & ĐỌC HIỂU (10 CÂU)
-- =========================================================================
(
  'Từ nào sau đây viết đúng chính tả tiếng Việt?',
  '{"A": "Xơ xát", "B": "Sơ sát", "C": "Sơ xát", "D": "Xơ sát"}',
  'C', 'Tiếng Việt', 'Chính tả', 'EASY',
  'Từ đúng chính tả trong từ điển tiếng Việt là "Sơ xát" (chỉ thương tích nhẹ ngoài da).'
),
(
  'Thành ngữ nào dưới đây đồng nghĩa với "Uống nước nhớ nguồn"?',
  '{"A": "Ăn quả nhớ kẻ trồng cây", "B": "Lá lành đùm lá rách", "C": "Có công mài sắt có ngày nên kim", "D": "Đi một ngày đàng học một nấc khôn"}',
  'A', 'Tiếng Việt', 'Thành ngữ', 'EASY',
  'Cả hai thành ngữ đều thể hiện truyền thống đạo lý biết ơn những người đã tạo ra thành quả cho mình hưởng.'
),
(
  'Trong tác phẩm "Chí Phèo", chi tiết nào đánh dấu sự thức tỉnh bản tính người của Chí Phèo?',
  '{"A": "Bát cháo hành của Thị Nở", "B": "Tiếng chim hót buổi sáng", "C": "Chén rượu của Bá Kiến", "D": "Cuộc gặp ở bờ sông"}',
  'A', 'Tiếng Việt', 'Văn học', 'MEDIUM',
  'Bát cháo hành của Thị Nở là biểu tượng của tình thương mộc mạc đã đánh thức phần lương tri và khát khao làm người lương thiện của Chí Phèo.'
),
(
  'Chủ ngữ trong câu "Những cánh buồm trắng xa xa đang lướt sóng ra khơi." là gì?',
  '{"A": "Những cánh buồm", "B": "Những cánh buồm trắng", "C": "Những cánh buồm trắng xa xa", "D": "Cánh buồm"}',
  'C', 'Tiếng Việt', 'Ngữ pháp', 'MEDIUM',
  'Cụm danh từ "Những cánh buồm trắng xa xa" đóng vai trò làm chủ ngữ hoàn chỉnh của câu.'
),
(
  'Biện pháp nghệ thuật chủ đạo trong câu thơ "Thân em vừa trắng lại vừa tròn" là gì?',
  '{"A": "Ẩn dụ", "B": "So sánh", "C": "Nhân hóa", "D": "Hoán dụ"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'EASY',
  'Bài thơ mượn hình ảnh chiếc bánh trôi nước để ẩn dụ cho vẻ đẹp và thân phận chìm nổi của người phụ nữ trong xã hội phong kiến.'
),
(
  'Từ nào dưới đây KHÔNG phải là từ Hán - Việt?',
  '{"A": "Quốc gia", "B": "Thiên nhiên", "C": "Nhà cửa", "D": "Giang sơn"}',
  'C', 'Tiếng Việt', 'Từ vựng', 'EASY',
  '"Nhà cửa" là từ ghép thuần Việt. Các từ còn lại đều có nguồn gốc Hán - Việt.'
),
(
  'Xác định thành phần khởi ngữ trong câu: "Về bài toán này, em đã tìm ra ba cách giải."',
  '{"A": "Về bài toán này", "B": "em", "C": "đã tìm ra", "D": "ba cách giải"}',
  'A', 'Tiếng Việt', 'Ngữ pháp', 'MEDIUM',
  'Khởi ngữ "Về bài toán này" đứng trước chủ ngữ để nêu lên chủ đề sẽ được thuyết minh trong câu.'
),
(
  'Đoạn thơ "Sông Mã xa rồi Tây Tiến ơi / Nhớ về rừng núi nhớ chơi vơi" nằm trong tác phẩm của ai?',
  '{"A": "Quang Dũng", "B": "Huy Cận", "C": "Tố Hữu", "D": "Chế Lan Viên"}',
  'A', 'Tiếng Việt', 'Văn học', 'EASY',
  'Đây là 2 câu thơ mở đầu bài thơ "Tây Tiến" nổi tiếng của nhà thơ Quang Dũng.'
),
(
  'Câu tục ngữ "Ăn cây nào rào cây ấy" mang ý nghĩa gì?',
  '{"A": "Chăm sóc bảo vệ môi trường", "B": "Có trách nhiệm và trung thành với nơi đem lại quyền lợi cho mình", "C": "Tiết kiệm trong cuộc sống", "D": "Biết ơn tổ tiên"}',
  'B', 'Tiếng Việt', 'Thành ngữ', 'EASY',
  'Câu tục ngữ khuyên răn con người phải có trách nhiệm gìn giữ, bảo vệ và trung thành với nơi đã nuôi dưỡng, cưu mang mình.'
),
(
  'Từ "chân" trong câu nào sau đây được dùng theo nghĩa chuyển phương thức ẩn dụ?',
  '{"A": "Bé bị đau chân", "B": "Chân bàn bị gãy một góc", "C": "Anh ấy có chân trong ban đại diện", "D": "Đứng ở chân núi nhìn lên"}',
  'D', 'Tiếng Việt', 'Biện pháp tu từ', 'MEDIUM',
  '"Chân núi" là nghĩa chuyển theo phương thức ẩn dụ (dựa trên nét tương đồng về vị trí thấp nhất tiếp giáp mặt đất).'
);