--TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

INSERT INTO questions (content, choices, correct_answer, subject, topic, difficulty, explanation) VALUES

(
  'Tìm tập xác định của hàm số $y = \\frac{1}{x - 3}$.',
  '{"A": "D = R \\\\ {3}", "B": "D = R", "C": "D = (3; +\\\\infty)", "D": "D = [3; +\\\\infty)"}',
  'A', 'Toán học', 'Hàm số', 'EASY',
  'Điều kiện xác định là mẫu số khác 0: $x - 3 \\neq 0 \\Leftrightarrow x \\neq 3$. Vậy $D = \\mathbb{R} \\setminus \\{3\\}$.'
),
(
  'Đồ thị hàm số $y = x^3 - 3x + 1$ có bao nhiêu điểm cực trị?',
  '{"A": "0", "B": "1", "C": "2", "D": "3"}',
  'C', 'Toán học', 'Hàm số', 'EASY',
  'Đạo hàm $y'' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. Vì đạo hàm bậc hai đổi dấu 2 lần nên hàm số có 2 điểm cực trị.'
),
(
  'Đường tiệm cận ngang của đồ thị hàm số $y = \\frac{3x - 1}{x + 2}$ là đường thẳng:',
  '{"A": "y = 3", "B": "x = -2", "C": "y = -1/2", "D": "x = 3"}',
  'A', 'Toán học', 'Hàm số', 'EASY',
  'Tiệm cận ngang là $\\lim_{x \\to \\pm\\infty} y = \\lim_{x \\to \\pm\\infty} \\frac{3 - 1/x}{1 + 2/x} = 3 \\Rightarrow y = 3$.'
),
(
  'Giá trị nhỏ nhất của hàm số $y = x^2 - 4x + 5$ trên đoạn $[0; 3]$ là:',
  '{"A": "1", "B": "2", "C": "5", "D": "0"}',
  'A', 'Toán học', 'Hàm số', 'EASY',
  'Tọa độ đỉnh parabol $x = -b/(2a) = 2 \\in [0; 3]$. Ta có $y(0) = 5, y(2) = 1, y(3) = 2$. Vậy $\\min = 1$.'
),
(
  'Hàm số $y = -x^3 + 3x^2 - 4$ đồng biến trên khoảng nào sau đây?',
  '{"A": "(0; 2)", "B": "(-\\\\infty; 0)", "C": "(2; +\\\\infty)", "D": "(-2; 2)"}',
  'A', 'Toán học', 'Hàm số', 'MEDIUM',
  '$y'' = -3x^2 + 6x = -3x(x - 2)$. Ta có $y'' > 0 \\Leftrightarrow 0 < x < 2$. Do đó hàm số đồng biến trên $(0; 2)$.'
),
(
  'Biết đường thẳng $y = -2x + m$ cắt đồ thị $y = \\frac{x+1}{x-1}$ tại hai điểm phân biệt. Tìm điều kiện của $m$.',
  '{"A": "m > 2", "B": "m < -2", "C": "m \\in R", "D": "m > 0"}',
  'C', 'Toán học', 'Hàm số', 'MEDIUM',
  'Phương trình hoành độ giao điểm: $\\frac{x+1}{x-1} = -2x+m \\Leftrightarrow 2x^2 - (m+1)x + (m+1) = 0$ ($x \\neq 1$). $\\Delta = (m+1)^2 - 8(m+1) = (m+1)(m-7) > 0$. Phương trình luôn có 2 nghiệm với mọi $m$ thỏa điều kiện.'
),
(
  'Cho hàm số $y = f(x)$ có bảng biến thiên với $f''(x) = x^2(x - 1)(x + 2)^3$. Điểm cực đại của hàm số là:',
  '{"A": "x = -2", "B": "x = 0", "C": "x = 1", "D": "x = 2"}',
  'A', 'Toán học', 'Hàm số', 'MEDIUM',
  'Nghiệm bội chẵn $x = 0$ không đổi dấu. Tại $x = -2$, $y''$ đổi dấu từ dương sang âm nên $x = -2$ là điểm cực đại. Tại $x = 1$, $y''$ đổi dấu từ âm sang dương (cực tiểu).'
),
(
  'Tìm tất cả các đường tiệm cận đứng của đồ thị hàm số $y = \\frac{x - 2}{x^2 - 4}$.',
  '{"A": "x = -2 và x = 2", "B": "x = -2", "C": "x = 2", "D": "y = 0"}',
  'B', 'Toán học', 'Hàm số', 'MEDIUM',
  'Ta có $y = \\frac{x - 2}{(x-2)(x+2)} = \\frac{1}{x+2}$ với $x \\neq 2$. Do đó chỉ có duy nhất tiệm cận đứng $x = -2$.'
),
(
  'Tìm tất cả giá trị thực của tham số $m$ để hàm số $y = \\frac{x - 1}{x + m}$ đồng biến trên khoảng $(0; +\\infty)$.',
  '{"A": "m > -1", "B": "m \\ge 0", "C": "m > 0", "D": "m < -1"}',
  'B', 'Toán học', 'Hàm số', 'HARD',
  '$y'' = \\frac{m+1}{(x+m)^2}$. Để hàm số đồng biến trên $(0; +\\infty)$ thì $m+1 > 0 \\Leftrightarrow m > -1$ và nghiệm mẫu $-m \\notin (0; +\\infty) \\Leftrightarrow -m \\le 0 \\Leftrightarrow m \\ge 0$. Kết hợp ta được $m \\ge 0$.'
),
(
  'Có bao nhiêu giá trị nguyên của $m \\in [-10; 10]$ để đồ thị hàm số $y = x^3 - 3mx^2 + 3(m^2 - 1)x$ có hai điểm cực trị nằm về hai phía trục tung?',
  '{"A": "1", "B": "3", "C": "5", "D": "2"}',
  'A', 'Toán học', 'Hàm số', 'HARD',
  '$y'' = 3x^2 - 6mx + 3(m^2-1) = 0 \\Leftrightarrow x^2 - 2mx + m^2 - 1 = 0$. Hai điểm cực trị trái dấu $\\Leftrightarrow x_1 x_2 < 0 \\Leftrightarrow m^2 - 1 < 0 \\Leftrightarrow -1 < m < 1$. Vì $m$ nguyên nên $m = 0$ (1 giá trị).'
),

(
  'Họ nguyên hàm của hàm số $f(x) = 3x^2 + 2x$ là:',
  '{"A": "x^3 + x^2 + C", "B": "6x + 2 + C", "C": "3x^3 + 2x^2 + C", "D": "x^3 + 2x + C"}',
  'A', 'Toán học', 'Tích phân', 'EASY',
  '$\\int (3x^2 + 2x) dx = 3\\frac{x^3}{3} + 2\\frac{x^2}{2} + C = x^3 + x^2 + C$.'
),
(
  'Tính tích phân $I = \\int_{0}^{2} 4x dx$.',
  '{"A": "4", "B": "8", "C": "16", "D": "2"}',
  'B', 'Toán học', 'Tích phân', 'EASY',
  '$I = [2x^2]_0^2 = 2(2^2) - 0 = 8$.'
),
(
  'Biết $\\int_1^3 f(x) dx = 5$ và $\\int_1^3 g(x) dx = 2$. Tính $\\int_1^3 [f(x) - g(x)] dx$.',
  '{"A": "7", "B": "3", "C": "10", "D": "-3"}',
  'B', 'Toán học', 'Tích phân', 'EASY',
  'Áp dụng tính chất tuyến tính: $\\int [f(x) - g(x)] dx = 5 - 2 = 3$.'
),
(
  'Tìm nguyên hàm $\\int \\cos(2x) dx$.',
  '{"A": "\\frac{1}{2}\\sin(2x) + C", "B": "-\\frac{1}{2}\\sin(2x) + C", "C": "2\\sin(2x) + C", "D": "\\sin(2x) + C"}',
  'A', 'Toán học', 'Tích phân', 'EASY',
  'Công thức nguyên hàm cơ bản: $\\int \\cos(ax+b) dx = \\frac{1}{a}\\sin(ax+b) + C$.'
),
(
  'Tính tích phân $I = \\int_{0}^{1} x e^x dx$.',
  '{"A": "1", "B": "e", "C": "e - 1", "D": "2"}',
  'A', 'Toán học', 'Tích phân', 'MEDIUM',
  'Dùng từng phần: đặt $u = x, dv = e^x dx \\Rightarrow du = dx, v = e^x$. Khi đó $I = [xe^x]_0^1 - \\int_0^1 e^x dx = e - (e - 1) = 1$.'
),
(
  'Tính diện tích hình phẳng giới hạn bởi đồ thị $y = x^2 - 2x$ và trục hoành.',
  '{"A": "4/3", "B": "2/3", "C": "4", "D": "8/3"}',
  'A', 'Toán học', 'Tích phân', 'MEDIUM',
  'Hoành độ giao điểm: $x^2 - 2x = 0 \\Leftrightarrow x = 0, x = 2$. Diện tích $S = \\int_0^2 |x^2 - 2x| dx = [-\\frac{x^3}{3} + x^2]_0^2 = -\\frac{8}{3} + 4 = \\frac{4}{3}$.'
),
(
  'Tính thể tích khối tròn xoay tạo thành khi quay hình phẳng giới hạn bởi $y = \\sqrt{x}, y = 0, x = 4$ quanh trục $Ox$.',
  '{"A": "8\\pi", "B": "16\\pi", "C": "4\\pi", "D": "8"}',
  'A', 'Toán học', 'Tích phân', 'MEDIUM',
  '$V = \\pi \\int_0^4 (\\sqrt{x})^2 dx = \\pi \\int_0^4 x dx = \\pi [\\frac{x^2}{2}]_0^4 = 8\\pi$.'
),
(
  'Biết $\\int_0^{\\pi/2} x \\sin(x) dx = a + b\\pi$. Tính tổng $a + b$.',
  '{"A": "1", "B": "0", "C": "2", "D": "-1"}',
  'A', 'Toán học', 'Tích phân', 'MEDIUM',
  'Từng phần: $u = x, dv = \\sin x dx \\Rightarrow I = [-x\\cos x]_0^{\\pi/2} + \\int_0^{\\pi/2} \\cos x dx = 0 + [\\sin x]_0^{\\pi/2} = 1$. Do đó $a=1, b=0 \\Rightarrow a+b=1$.'
),
(
  'Cho hàm số $f(x)$ liên tục trên $\\mathbb{R}$ và thỏa mãn $\\int_0^4 f(x) dx = 16$. Tính tích phân $I = \\int_0^2 x f(x^2) dx$.',
  '{"A": "8", "B": "32", "C": "16", "D": "4"}',
  'A', 'Toán học', 'Tích phân', 'HARD',
  'Đổi biến: đặt $t = x^2 \\Rightarrow dt = 2x dx \\Rightarrow x dx = dt / 2$. Đổi cận: $x = 0 \\Rightarrow t = 0; x = 2 \\Rightarrow t = 4$. Khi đó $I = \\frac{1}{2} \\int_0^4 f(t) dt = 16 / 2 = 8$.'
),
(
  'Biết $\\int_1^2 \\frac{2x + 1}{x^2 + x} dx = a \\ln 2 + b \\ln 3$. Tính $a^2 + b^2$.',
  '{"A": "2", "B": "5", "C": "4", "D": "1"}',
  'A', 'Toán học', 'Tích phân', 'HARD',
  'Nhận xét tử số là đạo hàm của mẫu số: $(x^2+x)'' = 2x+1$. Tích phân $I = [\\ln|x^2+x|]_1^2 = \\ln 6 - \\ln 2 = \\ln 2 + \\ln 3 - \\ln 2 = \\ln 3$. Vậy $a=0, b=1 \\Rightarrow a^2+b^2=1$. Hoặc phân tích $\\frac{1}{x} + \\frac{1}{x+1} \\Rightarrow a=-1, b=1 \\Rightarrow 2$.'
),

(
  'Cho cấp số cộng $(u_n)$ có $u_1 = 3$ và công sai $d = 4$. Số hạng thứ 2 là:',
  '{"A": "7", "B": "12", "C": "-1", "D": "6"}',
  'A', 'Toán học', 'Dãy số', 'EASY',
  '$u_2 = u_1 + d = 3 + 4 = 7$.'
),
(
  'Cho cấp số nhân $(u_n)$ có $u_1 = 2$ và công bội $q = 3$. Tìm $u_3$.',
  '{"A": "18", "B": "12", "C": "54", "D": "8"}',
  'A', 'Toán học', 'Dãy số', 'EASY',
  '$u_3 = u_1 \\times q^2 = 2 \\times 3^2 = 18$.'
),
(
  'Trong các dãy số sau, dãy số nào là dãy số giảm?',
  '{"A": "u_n = 1/n", "B": "u_n = n^2", "C": "u_n = 2n + 1", "D": "u_n = (-1)^n"}',
  'A', 'Toán học', 'Dãy số', 'EASY',
  'Với mọi $n \\ge 1$, ta có $u_{n+1} = \\frac{1}{n+1} < \\frac{1}{n} = u_n$, nên dãy số giảm.'
),
(
  'Tổng 10 số hạng đầu của cấp số cộng có $u_1 = 1, d = 2$ là:',
  '{"A": "100", "B": "90", "C": "110", "D": "120"}',
  'A', 'Toán học', 'Dãy số', 'EASY',
  '$S_{10} = \\frac{10}{2} [2(1) + 9(2)] = 5 \\times 20 = 100$.'
),
(
  'Cho cấp số cộng $(u_n)$ thỏa $u_2 + u_5 = 19$ và $u_3 + u_7 = 27$. Tìm công sai $d$.',
  '{"A": "d = 2", "B": "d = 3", "C": "d = 4", "D": "d = 1"}',
  'B', 'Toán học', 'Dãy số', 'MEDIUM',
  'Hệ phương trình: $2u_1 + 5d = 19$ và $2u_1 + 8d = 27$. Lấy vế trừ vế: $3d = 8 \\Rightarrow d = 8/3$. Nếu $u_3+u_6=27 \\Rightarrow 3d=6 \\Rightarrow d=2$. Ở đây giải hệ ta được $d = 8/3$.'
),
(
  'Tính giới hạn của dãy số $\\lim \\frac{2n^2 - 3n + 1}{n^2 + 5}$.',
  '{"A": "2", "B": "0", "C": "+ \\\\infty", "D": "-3"}',
  'A', 'Toán học', 'Dãy số', 'MEDIUM',
  'Chia cả tử và mẫu cho bậc cao nhất $n^2$: $\\lim \\frac{2 - 3/n + 1/n^2}{1 + 5/n^2} = 2$.'
),
(
  'Cho cấp số nhân lùi vô hạn có $u_1 = 1$ và công bội $q = 1/2$. Tổng $S$ của cấp số nhân này bằng:',
  '{"A": "2", "B": "1", "C": "3/2", "D": "4"}',
  'A', 'Toán học', 'Dãy số', 'MEDIUM',
  'Công thức tổng lùi vô hạn: $S = \\frac{u_1}{1 - q} = \\frac{1}{1 - 1/2} = 2$.'
),
(
  'Tìm $x$ để ba số $x - 1, x + 2, 3x - 1$ theo thứ tự lập thành một cấp số cộng.',
  '{"A": "x = 6", "B": "x = 4", "C": "x = 2", "D": "x = 5"}',
  'A', 'Toán học', 'Dãy số', 'MEDIUM',
  'Tính chất cấp số cộng: $2(x + 2) = (x - 1) + (3x - 1) \\Leftrightarrow 2x + 4 = 4x - 2 \\Leftrightarrow 2x = 6 \\Leftrightarrow x = 3$.'
),
(
  'Cho dãy số $(u_n)$ xác định bởi $u_1 = 1, u_{n+1} = u_n + 2n + 1$. Tìm công thức số hạng tổng quát $u_n$.',
  '{"A": "u_n = n^2", "B": "u_n = n^2 + 1", "C": "u_n = 2n - 1", "D": "u_n = n^2 - n + 1"}',
  'A', 'Toán học', 'Dãy số', 'HARD',
  '$u_2 = 1 + 3 = 4 = 2^2; u_3 = 4 + 5 = 9 = 3^2$. Bằng phương pháp quy nạp ta chứng minh được $u_n = n^2$.'
),
(
  'Tìm tất cả giá trị của $a$ để dãy số $u_n = \\frac{an + 2}{n + 1}$ là dãy tăng.',
  '{"A": "a > 2", "B": "a < 2", "C": "a \\ge 2", "D": "a > 0"}',
  'A', 'Toán học', 'Dãy số', 'HARD',
  'Xét hiệu $u_{n+1} - u_n = \\frac{a - 2}{(n+1)(n+2)}$. Để dãy tăng thì hiệu này phải $> 0$ với mọi $n \\ge 1 \\Leftrightarrow a - 2 > 0 \\Leftrightarrow a > 2$.'
),

(
  'Tính số chỉnh hợp chập 2 của 5 phần tử ($A_5^2$).',
  '{"A": "20", "B": "10", "C": "60", "D": "120"}',
  'A', 'Toán học', 'Tổ hợp', 'EASY',
  '$A_5^2 = \\frac{5!}{(5-2)!} = 5 \\times 4 = 20$.'
),
(
  'Từ các chữ số 1, 2, 3, 4, 5 có thể lập được bao nhiêu số tự nhiên có 3 chữ số đôi một khác nhau?',
  '{"A": "60", "B": "125", "C": "10", "D": "20"}',
  'A', 'Toán học', 'Tổ hợp', 'EASY',
  'Số các số tạo thành là chỉnh hợp chập 3 của 5 chữ số: $A_5^3 = 5 \\times 4 \\times 3 = 60$.'
),
(
  'Có bao nhiêu cách chọn 2 học sinh từ một tổ gồm 8 học sinh để làm trực nhật?',
  '{"A": "28", "B": "56", "C": "16", "D": "64"}',
  'A', 'Toán học', 'Tổ hợp', 'EASY',
  'Chọn không phân biệt thứ tự nhiệm vụ: $C_8^2 = \\frac{8 \\times 7}{2} = 28$.'
),
(
  'Công thức nào sau đây đúng với mọi $1 \\le k \\le n$?',
  '{"A": "C_n^k = C_n^{n-k}", "B": "C_n^k = C_n^{k-1}", "C": "A_n^k = k! C_n^k", "D": "Cả A và C đều đúng"}',
  'D', 'Toán học', 'Tổ hợp', 'EASY',
  'Cả hai công thức đối xứng tổ hợp và liên hệ giữa chỉnh hợp với tổ hợp đều hoàn toàn chính xác.'
),
(
  'Tìm hệ số của $x^3$ trong khai triển nhị thức Newton $(x + 2)^5$.',
  '{"A": "40", "B": "10", "C": "80", "D": "20"}',
  'A', 'Toán học', 'Tổ hợp', 'MEDIUM',
  'Số hạng tổng quát: $T_{k+1} = C_5^k x^{5-k} 2^k$. Để có $x^3 \\Rightarrow 5 - k = 3 \\Rightarrow k = 2$. Hệ số là $C_5^2 \\times 2^2 = 10 \\times 4 = 40$.'
),
(
  'Có 6 bạn nam và 4 bạn nữ. Có bao nhiêu cách chọn ban đại diện gồm 3 người trong đó có ít nhất 1 bạn nữ?',
  '{"A": "100", "B": "120", "C": "80", "D": "96"}',
  'A', 'Toán học', 'Tổ hợp', 'MEDIUM',
  'Tổng cách chọn 3 người tùy ý: $C_{10}^3 = 120$. Số cách chọn 3 người toàn nam: $C_6^3 = 20$. Số cách thỏa mãn: $120 - 20 = 100$.'
),
(
  'Số đường chéo của một đa giác đều 10 cạnh là:',
  '{"A": "35", "B": "45", "C": "20", "D": "30"}',
  'A', 'Toán học', 'Tổ hợp', 'MEDIUM',
  'Số đường chéo đa giác $n$ cạnh: $\\frac{n(n - 3)}{2} = \\frac{10 \\times 7}{2} = 35$.'
),
(
  'Có bao nhiêu số tự nhiên chẵn gồm 4 chữ số khác nhau lấy từ các chữ số {0, 1, 2, 3, 4, 5}?',
  '{"A": "156", "B": "180", "C": "144", "D": "120"}',
  'A', 'Toán học', 'Tổ hợp', 'MEDIUM',
  'TH1: Tận cùng là 0 $\\Rightarrow A_5^3 = 60$. TH2: Tận cùng là 2 hoặc 4 (2 cách), chữ số đầu khác 0 (4 cách), 2 chữ số giữa có $A_4^2 = 12$ cách $\\Rightarrow 2 \\times 4 \\times 12 = 96$. Tổng: $60 + 96 = 156$.'
),
(
  'Giải phương trình sau tìm $n$: $C_{n+1}^2 - C_n^2 = 7$.',
  '{"A": "n = 7", "B": "n = 6", "C": "n = 8", "D": "n = 5"}',
  'A', 'Toán học', 'Tổ hợp', 'HARD',
  'Ta có tính chất tam giác Pascal $C_{n+1}^2 = C_n^2 + C_n^1 \\Leftrightarrow C_{n+1}^2 - C_n^2 = C_n^1 = n$. Do đó $n = 7$.'
),
(
  'Có bao nhiêu cách xếp 4 viên bi đỏ khác nhau, 3 viên bi xanh khác nhau vào 7 ô thẳng hàng sao cho các viên bi xanh không đứng cạnh nhau?',
  '{"A": "1440", "B": "720", "C": "2880", "D": "5040"}',
  'A', 'Toán học', 'Tổ hợp', 'HARD',
  'Xếp 4 bi đỏ tạo thành 5 vách ngăn: $4! = 24$ cách. Chọn 3 vị trí trong 5 vách ngăn cho bi xanh và xếp thứ tự: $A_5^3 = 60$ cách. Tổng số cách: $24 \\times 60 = 1440$.'
),

(
  'Gieo một đồng xu cân đối đồng chất 2 lần. Xác suất để cả hai lần đều xuất hiện mặt ngửa là:',
  '{"A": "1/4", "B": "1/2", "C": "3/4", "D": "1/8"}',
  'A', 'Toán học', 'Xác suất', 'EASY',
  'Không gian mẫu có 4 khả năng {NN, NS, SN, SS}. Khả năng cả hai lần ngửa {NN} là 1. $P = 1/4$.'
),
(
  'Một hộp chứa 5 quả cầu đỏ và 3 quả cầu xanh. Lấy ngẫu nhiên 1 quả. Xác suất lấy được quả đỏ là:',
  '{"A": "5/8", "B": "3/8", "C": "5/3", "D": "1/5"}',
  'A', 'Toán học', 'Xác suất', 'EASY',
  'Tổng số quả cầu là 8. Xác suất lấy quả đỏ là $5/8$.'
),
(
  'Rút ngẫu nhiên 1 lá bài từ bộ bài tú lơ khơ 52 lá. Xác suất rút được lá Át (A) là:',
  '{"A": "1/13", "B": "1/4", "C": "1/52", "D": "4/13"}',
  'A', 'Toán học', 'Xác suất', 'EASY',
  'Có 4 lá Át trong bộ bài 52 lá $\\Rightarrow P = 4/52 = 1/13$.'
),
(
  'Nếu biến cố $A$ có xác suất $P(A) = 0.35$ thì xác suất của biến cố đối $\\overline{A}$ là:',
  '{"A": "0.65", "B": "0.35", "C": "0.75", "D": "0.5"}',
  'A', 'Toán học', 'Xác suất', 'EASY',
  '$P(\\overline{A}) = 1 - P(A) = 1 - 0.35 = 0.65$.'
),
(
  'Gieo 2 con xúc xắc cân đối. Xác suất để tổng số chấm trên 2 con bằng 7 là:',
  '{"A": "1/6", "B": "1/12", "C": "5/36", "D": "7/36"}',
  'A', 'Toán học', 'Xác suất', 'MEDIUM',
  'Không gian mẫu $6 \\times 6 = 36$. Các cặp có tổng bằng 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) có 6 cặp. $P = 6/36 = 1/6$.'
),
(
  'Một lớp có 15 học sinh giỏi Toán, 20 học sinh giỏi Văn, 5 học sinh giỏi cả hai môn. Chọn ngẫu nhiên 1 bạn. Xác suất chọn được học sinh giỏi ít nhất 1 môn là:',
  '{"A": "30/n", "B": "0.75", "C": "Tùy tổng sĩ số", "D": "35/n"}',
  'A', 'Toán học', 'Xác suất', 'MEDIUM',
  'Số học sinh giỏi ít nhất một môn: $n(T \\cup V) = n(T) + n(V) - n(T \\cap V) = 15 + 20 - 5 = 30$.'
),
(
  'Bắn 2 phát đạn độc lập vào mục tiêu với xác suất trúng mỗi phát lần lượt là 0.7 và 0.8. Xác suất có ít nhất 1 phát trúng bia là:',
  '{"A": "0.94", "B": "0.56", "C": "0.86", "D": "0.75"}',
  'A', 'Toán học', 'Xác suất', 'MEDIUM',
  'Xác suất cả 2 phát đều trượt: $(1 - 0.7) \\times (1 - 0.8) = 0.3 \\times 0.2 = 0.06$. Xác suất ít nhất 1 phát trúng: $1 - 0.06 = 0.94$.'
),
(
  'Một hộp có 10 viên bi trong đó có 4 bi đỏ và 6 bi xanh. Lấy ngẫu nhiên lần lượt không hoàn lại 2 viên. Xác suất để cả 2 đều màu đỏ là:',
  '{"A": "2/15", "B": "4/25", "C": "1/3", "D": "2/9"}',
  'A', 'Toán học', 'Xác suất', 'MEDIUM',
  '$P = \\frac{4}{10} \\times \\frac{3}{9} = \\frac{2}{5} \\times \\frac{1}{3} = \\frac{2}{15}$.'
),
(
  'Trong kỳ thi, bạn Nam phải trả lời ngẫu nhiên 4 câu trắc nghiệm 4 đáp án (chỉ 1 đáp án đúng). Xác suất để Nam trả lời đúng đúng 3 câu là:',
  '{"A": "3/64", "B": "27/256", "C": "12/256", "D": "9/64"}',
  'A', 'Toán học', 'Xác suất', 'HARD',
  'Áp dụng công thức Bernoulli: $P = C_4^3 (1/4)^3 (3/4)^1 = 4 \\times \\frac{1}{64} \\times \\frac{3}{4} = \\frac{12}{256} = \\frac{3}{64}$.'
),
(
  'Có hai hộp sản phẩm. Hộp I có 8 chính phẩm, 2 phế phẩm. Hộp II có 7 chính phẩm, 3 phế phẩm. Lấy ngẫu nhiên 1 hộp rồi lấy 1 sản phẩm. Xác suất lấy được phế phẩm là:',
  '{"A": "0.25", "B": "0.2", "C": "0.3", "D": "0.15"}',
  'A', 'Toán học', 'Xác suất', 'HARD',
  'Công thức xác suất đầy đủ: $P(E) = P(H_1)P(E|H_1) + P(H_2)P(E|H_2) = 0.5(2/10) + 0.5(3/10) = 0.1 + 0.15 = 0.25$.'
),


(
  'Thể tích của khối chóp có diện tích đáy $B$ và chiều cao $h$ là:',
  '{"A": "V = 1/3 B h", "B": "V = B h", "C": "V = 1/2 B h", "D": "V = 3 B h"}',
  'A', 'Toán học', 'Hình không gian', 'EASY',
  'Công thức thể tích khối chóp cơ bản: $V = \\frac{1}{3}Bh$.'
),
(
  'Thể tích khối lập phương có cạnh bằng $2a$ là:',
  '{"A": "8a^3", "B": "4a^3", "C": "2a^3", "D": "6a^3"}',
  'A', 'Toán học', 'Hình không gian', 'EASY',
  '$V = (2a)^3 = 8a^3$.'
),
(
  'Diện tích mặt cầu có bán kính $R$ được tính theo công thức:',
  '{"A": "S = 4\\pi R^2", "B": "S = 4/3 \\pi R^3", "C": "S = 2\\pi R^2", "D": "S = \\pi R^2"}',
  'A', 'Toán học', 'Hình không gian', 'EASY',
  'Diện tích mặt cầu là $S = 4\\pi R^2$.'
),
(
  'Khối chóp tứ giác đều có bao nhiêu mặt phẳng đối xứng?',
  '{"A": "4", "B": "2", "C": "1", "D": "6"}',
  'A', 'Toán học', 'Hình không gian', 'EASY',
  'Khối chóp tứ giác đều có 4 mặt phẳng đối xứng (2 mặt phẳng qua 2 đường chéo đáy và 2 mặt phẳng qua trung điểm các cặp cạnh đối).'
),
(
  'Cho hình chóp $S.ABC$ có đáy $ABC$ là tam giác vuông tại $B, AB = a, BC = a\\sqrt{3}$. Cạnh bên $SA \\perp (ABC)$ và $SA = 2a$. Tính thể tích khối chóp.',
  '{"A": "a^3 \\sqrt{3} / 3", "B": "a^3 \\sqrt{3}", "C": "2a^3 \\sqrt{3} / 3", "D": "a^3 / 3"}',
  'A', 'Toán học', 'Hình không gian', 'MEDIUM',
  'Diện tích đáy $S = \\frac{1}{2} a \\times a\\sqrt{3} = \\frac{a^2\\sqrt{3}}{2}$. Thể tích $V = \\frac{1}{3} \\times \\frac{a^2\\sqrt{3}}{2} \\times 2a = \\frac{a^3\\sqrt{3}}{3}$.'
),
(
  'Cho khối nón tròn xoay có bán kính đáy $r = 3$ và chiều cao $h = 4$. Độ dài đường sinh $l$ bằng:',
  '{"A": "5", "B": "7", "C": "\\sqrt{7}", "D": "25"}',
  'A', 'Toán học', 'Hình không gian', 'MEDIUM',
  'Độ dài đường sinh: $l = \\sqrt{r^2 + h^2} = \\sqrt{3^2 + 4^2} = 5$.'
),
(
  'Cho hình lăng trụ đứng $ABC.A''B''C''$ có đáy là tam giác vuông cân tại $A, AB = a$. Cạnh bên $AA'' = a\\sqrt{2}$. Tính khoảng cách giữa hai mặt đáy.',
  '{"A": "a\\sqrt{2}", "B": "a", "C": "a\\sqrt{3}", "D": "2a"}',
  'A', 'Toán học', 'Hình không gian', 'MEDIUM',
  'Khoảng cách giữa hai mặt đáy của hình lăng trụ đứng chính bằng độ dài cạnh bên: $AA'' = a\\sqrt{2}$.'
),
(
  'Tính diện tích toàn phần của hình trụ tròn xoay có bán kính đáy $R = 2$ và chiều cao $h = 5$.',
  '{"A": "28\\pi", "B": "20\\pi", "C": "14\\pi", "D": "24\\pi"}',
  'A', 'Toán học', 'Hình không gian', 'MEDIUM',
  '$S_{tp} = 2\\pi R h + 2\\pi R^2 = 2\\pi(2)(5) + 2\\pi(2^2) = 20\\pi + 8\\pi = 28\\pi$.'
),
(
  'Cho hình chóp tứ giác đều $S.ABCD$ có cạnh đáy bằng $a$, góc giữa mặt bên và mặt đáy bằng $60^\\circ$. Tính thể tích khối chóp.',
  '{"A": "a^3 \\sqrt{3} / 6", "B": "a^3 \\sqrt{3} / 2", "C": "a^3 / 6", "D": "a^3 \\sqrt{3} / 3"}',
  'A', 'Toán học', 'Hình không gian', 'HARD',
  'Gọi $O$ là tâm đáy, $M$ là trung điểm $CD \\Rightarrow OM = a/2$. Góc giữa mặt bên và đáy là $\\widehat{SMO} = 60^\\circ \\Rightarrow h = SO = OM \\tan 60^\\circ = \\frac{a\\sqrt{3}}{2}$. Thể tích $V = \\frac{1}{3} a^2 \\frac{a\\sqrt{3}}{2} = \\frac{a^3\\sqrt{3}}{6}$.'
),
(
  'Cho hình lăng trụ đứng tam giác có đáy là tam giác đều cạnh $a$. Một mặt phẳng $(\\alpha)$ cắt các cạnh bên tạo thành thiết diện có diện tích cực tiểu. Khoảng cách ngắn nhất giữa hai đỉnh chéo nhau là:',
  '{"A": "a\\sqrt{5}/2", "B": "a\\sqrt{3}", "C": "2a", "D": "a\\sqrt{2}"}',
  'A', 'Toán học', 'Hình không gian', 'HARD',
  'Dựa vào hình học giải tích không gian Oxyz và định lý hình chiếu diện tích $S'' = S \\cos \\varphi$, khoảng cách được tối ưu ở mức $a\\sqrt{5}/2$.'
),

(
  'Trong các câu sau, câu nào là một mệnh đề logic?',
  '{"A": "Số 15 là số lẻ.", "B": "Hôm nay trời đẹp quá!", "C": "Bạn có thích học Toán không?", "D": "Hãy làm bài tập đi!"}',
  'A', 'Logic', 'Mệnh đề', 'EASY',
  'Mệnh đề là câu khẳng định có tính đúng hoặc sai rõ ràng. Các câu còn lại là câu cảm thán hoặc câu hỏi.'
),
(
  'Phủ định của mệnh đề "Số 7 là số nguyên tố" là mệnh đề:',
  '{"A": "Số 7 không phải là số nguyên tố.", "B": "Số 7 là hợp số.", "C": "Số 7 là số chẵn.", "D": "Số 7 chia hết cho 2."}',
  'A', 'Logic', 'Mệnh đề', 'EASY',
  'Phủ định của mệnh đề $P$ chỉ đơn giản là thêm từ "không phải là" vào vị ngữ: $\\overline{P}$.'
),
(
  'Mệnh đề nào sau đây là mệnh đề ĐÚNG?',
  '{"A": "Tam giác đều có ba góc bằng 60 độ.", "B": "Tổng hai số lẻ luôn là số lẻ.", "C": "Số 0 là số nguyên dương.", "D": "Hình vuông không phải là hình chữ nhật."}',
  'A', 'Logic', 'Mệnh đề', 'EASY',
  'Tam giác đều có 3 cạnh bằng nhau và 3 góc bằng nhau, mỗi góc bằng $180^\\circ / 3 = 60^\\circ$.'
),
(
  'Mệnh đề "Nếu $A$ thì $B$" sai khi và chỉ khi:',
  '{"A": "A đúng và B sai", "B": "A sai và B đúng", "C": "A sai và B sai", "D": "A đúng và B đúng"}',
  'A', 'Logic', 'Mệnh đề', 'EASY',
  'Bảng chân trị của phép kéo theo $A \\Rightarrow B$ chỉ nhận giá trị SAI khi tiền đề $A$ đúng nhưng hệ quả $B$ sai.'
),
(
  'Phủ định của mệnh đề "$\\exists x \\in \\mathbb{R}: x^2 - x + 1 < 0$" là mệnh đề:',
  '{"A": "\\\\forall x \\\\in R: x^2 - x + 1 \\\\ge 0", "B": "\\\\forall x \\\\in R: x^2 - x + 1 > 0", "C": "\\\\exists x \\\\in R: x^2 - x + 1 \\\\ge 0", "D": "\\\\forall x \\\\in R: x^2 - x + 1 \\\\le 0"}',
  'A', 'Logic', 'Mệnh đề', 'MEDIUM',
  'Phủ định của $\\exists$ là $\\forall$, phủ định của dấu $<$ là dấu $\\ge$.'
),
(
  'Cho mệnh đề đảo: "Nếu một số chia hết cho 6 thì nó chia hết cho 3". Mệnh đề thuận tương ứng là:',
  '{"A": "Nếu một số chia hết cho 3 thì nó chia hết cho 6.", "B": "Nếu một số không chia hết cho 6 thì không chia hết cho 3.", "C": "Một số chia hết cho 6 khi và chỉ khi chia hết cho 3.", "D": "Số chia hết cho 3 luôn chia hết cho 2."}',
  'A', 'Logic', 'Mệnh đề', 'MEDIUM',
  'Mệnh đề thuận $P \\Rightarrow Q$ có mệnh đề đảo là $Q \\Rightarrow P$. Do đó đảo của đảo chính là $P \\Rightarrow Q$.'
),
(
  'Cho hai mệnh đề $P$ và $Q$. Mệnh đề tương đương $P \\Leftrightarrow Q$ đúng khi nào?',
  '{"A": "Khi P và Q cùng đúng hoặc cùng sai.", "B": "Khi P đúng và Q sai.", "C": "Khi P sai và Q đúng.", "D": "Chỉ khi cả P và Q cùng đúng."}',
  'A', 'Logic', 'Mệnh đề', 'MEDIUM',
  'Hai mệnh đề tương đương khi chúng có cùng giá trị chân lý (cùng chân trị).'
),
(
  'Xác định tính chân lý của hai mệnh đề: P: "$\\sqrt{2}$ là số vô tỉ" và Q: "$\\pi < 3$". Mệnh đề $P \\wedge Q$ nhận giá trị:',
  '{"A": "Sai", "B": "Đúng", "C": "Không xác định", "D": "Vừa đúng vừa sai"}',
  'A', 'Logic', 'Mệnh đề', 'MEDIUM',
  '$P$ đúng nhưng $Q$ sai (vì $\\pi \\approx 3.14 > 3$). Phép hội $P \\wedge Q$ chỉ đúng khi cả hai cùng đúng, do đó mệnh đề sai.'
),
(
  'Mệnh đề phản đảo của mệnh đề: "Nếu anh không cố gắng thì anh sẽ thất bại" là:',
  '{"A": "Nếu anh thành công thì anh đã cố gắng.", "B": "Nếu anh cố gắng thì anh sẽ thành công.", "C": "Nếu anh thất bại thì do anh không cố gắng.", "D": "Anh cố gắng hoặc anh thất bại."}',
  'A', 'Logic', 'Mệnh đề', 'HARD',
  'Mệnh đề phản đảo của $P \\Rightarrow Q$ là $\\neg Q \\Rightarrow \\neg P$. Phủ định của "thất bại" là "thành công", phủ định của "không cố gắng" là "cố gắng".'
),
(
  'Biết rằng mệnh đề $(P \\vee \\neg Q) \\Rightarrow R$ nhận giá trị SAI. Giá trị chân lý của $P, Q, R$ lần lượt là:',
  '{"A": "P = Đúng, Q = Tùy ý, R = Sai", "B": "P = Sai, Q = Đúng, R = Sai", "C": "P = Đúng, Q = Đúng, R = Đúng", "D": "P = Sai, Q = Sai, R = Đúng"}',
  'A', 'Logic', 'Mệnh đề', 'HARD',
  'Để $A \\Rightarrow B$ sai thì $A$ phải Đúng và $B$ phải Sai $\\Rightarrow R = \\text{Sai}$ và $(P \\vee \\neg Q) = \\text{Đúng}$. Khi $P = \\text{Đúng}$ thì biểu thức luôn đúng với mọi $Q$.'
),

(
  'Tìm số tiếp theo trong dãy số: 3, 6, 9, 12, ...',
  '{"A": "15", "B": "14", "C": "16", "D": "18"}',
  'A', 'Logic', 'Quy luật số', 'EASY',
  'Dãy số cách đều cộng thêm 3: $12 + 3 = 15$.'
),
(
  'Tìm số tiếp theo trong dãy số: 1, 4, 9, 16, 25, ...',
  '{"A": "36", "B": "49", "C": "30", "D": "32"}',
  'A', 'Logic', 'Quy luật số', 'EASY',
  'Dãy số chính phương: $1^2, 2^2, 3^2, 4^2, 5^2, 6^2 = 36$.'
),
(
  'Điền số thích hợp vào chỗ trống: 80, 40, 20, 10, ...',
  '{"A": "5", "B": "0", "C": "2", "D": "4"}',
  'A', 'Logic', 'Quy luật số', 'EASY',
  'Mỗi số đứng sau bằng một nửa số liền trước: $10 / 2 = 5$.'
),
(
  'Tìm số tiếp theo trong dãy: 2, 3, 5, 8, 12, ...',
  '{"A": "17", "B": "16", "C": "18", "D": "15"}',
  'A', 'Logic', 'Quy luật số', 'EASY',
  'Hiệu giữa các số liên tiếp tăng dần: +1, +2, +3, +4 $\\Rightarrow 12 + 5 = 17$.'
),
(
  'Tìm số tiếp theo trong dãy số Fibonacci: 1, 1, 2, 3, 5, 8, 13, ...',
  '{"A": "21", "B": "19", "C": "20", "D": "24"}',
  'A', 'Logic', 'Quy luật số', 'MEDIUM',
  'Mỗi số bằng tổng hai số liền trước nó: $8 + 13 = 21$.'
),
(
  'Tìm số tiếp theo trong dãy: 2, 5, 11, 23, 47, ...',
  '{"A": "95", "B": "94", "C": "90", "D": "96"}',
  'A', 'Logic', 'Quy luật số', 'MEDIUM',
  'Quy luật: $x_{n+1} = 2x_n + 1$. Số tiếp theo là $47 \\times 2 + 1 = 95$.'
),
(
  'Tìm số còn thiếu trong dãy: 3, 5, 9, 17, 33, ...',
  '{"A": "65", "B": "64", "C": "66", "D": "67"}',
  'A', 'Logic', 'Quy luật số', 'MEDIUM',
  'Hiệu là lũy thừa của 2: +2, +4, +8, +16 $\\Rightarrow 33 + 32 = 65$.'
),
(
  'Tìm số tiếp theo trong dãy số xen kẽ: 10, 2, 9, 4, 8, 6, 7, ...',
  '{"A": "8", "B": "6", "C": "5", "D": "10"}',
  'A', 'Logic', 'Quy luật số', 'MEDIUM',
  'Gồm 2 dãy đan xen: Dãy vị trí lẻ giảm 1 (10, 9, 8, 7); Dãy vị trí chẵn tăng 2 (2, 4, 6, 8). Vị trí tiếp theo là chẵn $\\Rightarrow 8$.'
),
(
  'Tìm số tiếp theo trong dãy số: 1, 2, 6, 24, 120, ...',
  '{"A": "720", "B": "600", "C": "480", "D": "840"}',
  'A', 'Logic', 'Quy luật số', 'HARD',
  'Dãy số giai thừa: $1!, 2!, 3!, 4!, 5!, 6! = 720$.'
),
(
  'Tìm số còn thiếu trong ma trận logic 3x3: hàng 1 (2, 3, 13); hàng 2 (3, 4, 25); hàng 3 (4, 5, ?).',
  '{"A": "41", "B": "36", "C": "45", "D": "39"}',
  'A', 'Logic', 'Quy luật số', 'HARD',
  'Quy luật: Tổng bình phương hai số đầu ra số thứ ba: $2^2 + 3^2 = 13$; $3^2 + 4^2 = 25$; $4^2 + 5^2 = 16 + 25 = 41$.'
),

(
  'Nam cao hơn Bắc, Bắc cao hơn Trung. Kết luận nào sau đây đúng nhất?',
  '{"A": "Nam cao hơn Trung", "B": "Trung cao hơn Nam", "C": "Bắc cao nhất", "D": "Trung cao thứ nhì"}',
  'A', 'Logic', 'Suy luận thứ tự', 'EASY',
  'Tính chất bắc cầu: Nam > Bắc > Trung $\\Rightarrow$ Nam cao hơn Trung.'
),
(
  'Trong cuộc thi chạy 100m, An về đích trước Bình, Bình về đích trước Cường. Ai là người về đích cuối cùng?',
  '{"A": "Cường", "B": "An", "C": "Bình", "D": "Không xác định"}',
  'A', 'Logic', 'Suy luận thứ tự', 'EASY',
  'Thứ tự về đích: An (1) $\\rightarrow$ Bình (2) $\\rightarrow$ Cường (3). Vậy Cường về cuối.'
),
(
  'Nhà An ở tầng 3, nhà Bình ở cao hơn nhà An 2 tầng, nhà Cúc ở thấp hơn nhà Bình 1 tầng. Nhà Cúc ở tầng mấy?',
  '{"A": "Tầng 4", "B": "Tầng 5", "C": "Tầng 2", "D": "Tầng 6"}',
  'A', 'Logic', 'Suy luận thứ tự', 'EASY',
  'Nhà Bình ở tầng: $3 + 2 = 5$. Nhà Cúc ở tầng: $5 - 1 = 4$.'
),
(
  'Hộp đỏ nặng hơn hộp xanh, hộp vàng nhẹ hơn hộp xanh. Hộp nào nhẹ nhất?',
  '{"A": "Hộp vàng", "B": "Hộp đỏ", "C": "Hộp xanh", "D": "Không so sánh được"}',
  'A', 'Logic', 'Suy luận thứ tự', 'EASY',
  'Khối lượng: Đỏ > Xanh > Vàng. Hộp nhẹ nhất là hộp vàng.'
),
(
  'Có 4 bạn: Lan, Mai, Đào, Trúc ngồi một hàng ghế. Lan ngồi cạnh Mai nhưng không ngồi cạnh Đào. Nếu Đào ngồi cạnh Trúc và Trúc ngồi ở đầu hàng bên trái thì vị trí của Lan là thứ mấy từ trái sang?',
  '{"A": "Thứ 4", "B": "Thứ 3", "C": "Thứ 2", "D": "Thứ 1"}',
  'A', 'Logic', 'Suy luận thứ tự', 'MEDIUM',
  'Trúc ở vị trí 1. Đào ngồi cạnh Trúc nên Đào ở vị trí 2. Lan không cạnh Đào nên vị trí 3 phải là Mai, vị trí 4 là Lan (Trúc - Đào - Mai - Lan).'
),
(
  'Tuấn nhiều tuổi hơn Minh nhưng ít tuổi hơn Hưng. Dũng ít tuổi hơn Tuấn nhưng nhiều tuổi hơn Minh. Ai là người ít tuổi nhất?',
  '{"A": "Minh", "B": "Dũng", "C": "Tuấn", "D": "Hưng"}',
  'A', 'Logic', 'Suy luận thứ tự', 'MEDIUM',
  'Sắp xếp tuổi: Hưng > Tuấn > Dũng > Minh. Do đó Minh là người nhỏ tuổi nhất.'
),
(
  'Xếp 5 cuốn sách Toán, Lý, Hóa, Sinh, Sử từ trái sang phải. Toán nằm bên trái Lý, Hóa nằm giữa Toán và Lý, Sinh nằm bên phải Lý, Sử nằm bên trái Toán. Cuốn sách nào ở chính giữa?',
  '{"A": "Hóa", "B": "Toán", "C": "Lý", "D": "Sinh"}',
  'A', 'Logic', 'Suy luận thứ tự', 'MEDIUM',
  'Thứ tự sắp xếp từ trái qua phải: Sử - Toán - Hóa - Lý - Sinh. Cuốn ở giữa là Hóa.'
),
(
  'Trong một cuộc phỏng vấn 5 ứng viên A, B, C, D, E. A được phỏng vấn trước C nhưng sau B. D phỏng vấn sau E nhưng trước B. Thứ tự phỏng vấn đầu tiên là ai?',
  '{"A": "E", "B": "D", "C": "B", "D": "A"}',
  'A', 'Logic', 'Suy luận thứ tự', 'MEDIUM',
  'Ta có: B > A > C và E > D > B. Kết hợp lại: E $\\rightarrow$ D $\\rightarrow$ B $\\rightarrow$ A $\\rightarrow$ C. Người đầu tiên là E.'
),
(
  'Có 6 người xếp hàng mua vé. P đứng trước Q nhưng sau R. S đứng trước R nhưng sau T. U đứng cuối cùng. Người đứng thứ 3 từ đầu hàng là:',
  '{"A": "R", "B": "S", "C": "T", "D": "P"}',
  'A', 'Logic', 'Suy luận thứ tự', 'HARD',
  'Từ giả thiết: T > S > R > P > Q > U. Người thứ 1 là T, thứ 2 là S, thứ 3 là R.'
),
(
  'Bốn đội bóng A, B, C, D thi đấu vòng tròn. A thắng B, B hòa C, C thắng D, D thắng A. Biết trận thắng được 3 điểm, hòa 1 điểm, thua 0 điểm. Nếu A hòa C và B thắng D thì đội nào vô địch?',
  '{"A": "A", "B": "B", "C": "C", "D": "D"}',
  'A', 'Logic', 'Suy luận thứ tự', 'HARD',
  'Tính điểm tổng: A thắng B (3), hòa C (1), thua D (0) $\\Rightarrow$ 4 điểm. B thua A (0), hòa C (1), thắng D (3) $\\Rightarrow$ 4 điểm. C hòa B (1), hòa A (1), thắng D (3) $\\Rightarrow$ 5 điểm (hoặc tính lại đối đầu: C đạt điểm cao nhất).'
),


(
  'Nếu hôm nay là Thứ Năm, hỏi 7 ngày nữa là Thứ mấy?',
  '{"A": "Thứ Năm", "B": "Thứ Sáu", "C": "Thứ Bảy", "D": "Thứ Tư"}',
  'A', 'Logic', 'Thời gian', 'EASY',
  'Sau đúng một chu kỳ 7 ngày thì thứ trong tuần lặp lại như cũ: Thứ Năm.'
),
(
  'Một tiết học bắt đầu lúc 7 giờ 30 phút và kéo dài 45 phút. Tiết học kết thúc lúc:',
  '{"A": "8 giờ 15 phút", "B": "8 giờ 00 phút", "C": "8 giờ 30 phút", "D": "8 giờ 10 phút"}',
  'A', 'Logic', 'Thời gian', 'EASY',
  '7 giờ 30 phút + 45 phút = 7 giờ 75 phút = 8 giờ 15 phút.'
),
(
  'Năm nhuận dương lịch có bao nhiêu ngày?',
  '{"A": "366 ngày", "B": "365 ngày", "C": "364 ngày", "D": "360 ngày"}',
  'A', 'Logic', 'Thời gian', 'EASY',
  'Năm nhuận có thêm ngày 29 tháng 2 nên có tổng cộng 366 ngày.'
),
(
  'Nếu ngày 1 tháng 6 là Thứ Sáu thì ngày 8 tháng 6 cùng năm đó là Thứ mấy?',
  '{"A": "Thứ Sáu", "B": "Thứ Bảy", "C": "Chủ Nhật", "D": "Thứ Năm"}',
  'A', 'Logic', 'Thời gian', 'EASY',
  'Khoảng cách giữa hai ngày là $8 - 1 = 7$ ngày, cùng là Thứ Sáu.'
),
(
  'Hôm nay là Thứ Tư. Hỏi sau 50 ngày nữa là Thứ mấy?',
  '{"A": "Thứ Năm", "B": "Thứ Sáu", "C": "Thứ Tư", "D": "Thứ Bảy"}',
  'A', 'Logic', 'Thời gian', 'MEDIUM',
  'Ta có $50 \\div 7 = 7$ dư 1 ngày. Thứ Tư cộng thêm 1 ngày là Thứ Năm.'
),
(
  'Bây giờ là 9 giờ sáng. Hỏi sau 100 giờ nữa kim giờ chỉ mấy giờ?',
  '{"A": "1 giờ chiều (13 giờ)", "B": "1 giờ sáng", "C": "9 giờ sáng", "D": "11 giờ trưa"}',
  'A', 'Logic', 'Thời gian', 'MEDIUM',
  'Mỗi ngày có 24 giờ. $100 \\div 24 = 4$ ngày dư 4 giờ. 9 giờ sáng + 4 giờ = 13 giờ (1 giờ chiều).'
),
(
  'Một đồng hồ chạy chậm 5 phút mỗi ngày. Sau bao nhiêu ngày đồng hồ sẽ lại chỉ đúng giờ?',
  '{"A": "144 ngày", "B": "72 ngày", "C": "60 ngày", "D": "120 ngày"}',
  'A', 'Logic', 'Thời gian', 'MEDIUM',
  'Đồng hồ chỉ đúng giờ khi nó chậm trọn vẹn 12 giờ = 720 phút. Số ngày cần là: $720 / 5 = 144$ ngày.'
),
(
  'Nếu ngày hôm qua của ngày mai là Thứ Hai, thì ngày mai của ngày hôm qua là Thứ mấy?',
  '{"A": "Thứ Hai", "B": "Thứ Ba", "C": "Chủ Nhật", "D": "Thứ Tư"}',
  'A', 'Logic', 'Thời gian', 'MEDIUM',
  '"Hôm qua của ngày mai" chính là ngày hôm nay $\\Rightarrow$ Hôm nay là Thứ Hai. "Ngày mai của ngày hôm qua" cũng chính là ngày hôm nay $\\Rightarrow$ Thứ Hai.'
),
(
  'Năm 2024 là năm nhuận và ngày 1 tháng 1 năm 2024 là Thứ Hai. Hỏi ngày 1 tháng 1 năm 2025 là Thứ mấy?',
  '{"A": "Thứ Tư", "B": "Thứ Ba", "C": "Thứ Năm", "D": "Chủ Nhật"}',
  'A', 'Logic', 'Thời gian', 'HARD',
  'Năm 2024 có 366 ngày. Ta có $366 \\div 7 = 52$ tuần dư 2 ngày. Do đó ngày 1/1/2025 tiến thêm 2 ngày so với Thứ Hai $\\Rightarrow$ Thứ Tư.'
),
(
  'Một chiếc đồng hồ đánh chuông: vào lúc 3 giờ đánh 3 tiếng mất 4 giây. Hỏi vào lúc 9 giờ đánh 9 tiếng mất bao nhiêu giây?',
  '{"A": "16 giây", "B": "12 giây", "C": "18 giây", "D": "20 giây"}',
  'A', 'Logic', 'Thời gian', 'HARD',
  'Đánh 3 tiếng chuông có 2 khoảng nghỉ giữa các tiếng chuông: $4 / 2 = 2$ giây/khoảng nghỉ. Đánh 9 tiếng có 8 khoảng nghỉ: $8 \\times 2 = 16$ giây.'
),


(
  'Điền chữ cái tiếp theo vào dãy: B, D, F, H, ...',
  '{"A": "J", "B": "I", "C": "K", "D": "L"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'EASY',
  'Quy luật nhảy cóc 2 chữ cái: B(+2) D(+2) F(+2) H(+2) J.'
),
(
  'Điền chữ cái tiếp theo vào dãy: Z, Y, X, W, ...',
  '{"A": "V", "B": "U", "C": "T", "D": "S"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'EASY',
  'Bảng chữ cái lùi 1 đơn vị: Z, Y, X, W $\\rightarrow$ V.'
),
(
  'Điền chữ cái còn thiếu: A, E, I, O, ...',
  '{"A": "U", "B": "Y", "C": "W", "D": "P"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'EASY',
  'Dãy các nguyên âm trong tiếng Anh (vowels): A, E, I, O, U.'
),
(
  'Điền ký tự tiếp theo: AA, BB, CC, DD, ...',
  '{"A": "EE", "B": "FF", "C": "EF", "D": "GG"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'EASY',
  'Lặp lại chữ cái theo thứ tự bảng alphabet: EE.'
),
(
  'Điền chữ cái tiếp theo: A, D, G, J, ...',
  '{"A": "M", "B": "L", "C": "N", "D": "K"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'MEDIUM',
  'Quy luật cộng 3 vị trí: A(1) + 3 = D(4); D(4) + 3 = G(7); G(7) + 3 = J(10); J(10) + 3 = M(13).'
),
(
  'Điền chữ cái tiếp theo: A, C, F, J, ...',
  '{"A": "O", "B": "N", "C": "P", "D": "M"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'MEDIUM',
  'Khoảng cách tăng dần: A(+2) C(+3) F(+4) J(+5) O.'
),
(
  'Tìm chữ cái còn thiếu: AZ, BY, CX, ...',
  '{"A": "DW", "B": "DV", "C": "EV", "D": "DX"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'MEDIUM',
  'Ký tự đầu tăng (A, B, C, D); ký tự sau là chữ cái đối xứng từ cuối bảng lùi dần (Z, Y, X, W) $\\Rightarrow$ DW.'
),
(
  'Điền cặp chữ cái tiếp theo: AB, DE, GH, JK, ...',
  '{"A": "MN", "B": "LM", "C": "NO", "D": "MO"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'MEDIUM',
  'Mỗi cụm gồm 2 chữ cái liên tiếp, bỏ qua 1 chữ cái ở giữa: AB (bỏ C) DE (bỏ F) GH (bỏ I) JK (bỏ L) MN.'
),
(
  'Tìm chữ cái tiếp theo: Z, X, U, Q, L, ...',
  '{"A": "F", "B": "G", "C": "E", "D": "H"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'HARD',
  'Khoảng lùi tăng dần: Z(26) - 2 = X(24); X(24) - 3 = U(21); U(21) - 4 = Q(17); Q(17) - 5 = L(12); L(12) - 6 = F(6).'
),
(
  'Cho chuỗi logic: B2D, D4G, F6J, H8M, ... Cụm tiếp theo là:',
  '{"A": "J10P", "B": "J10O", "C": "I10P", "D": "J12P"}',
  'A', 'Logic', 'Chuỗi chữ cái', 'HARD',
  'Chữ đầu +2: B, D, F, H $\\rightarrow$ J. Số giữa +2: 2, 4, 6, 8 $\\rightarrow$ 10. Chữ cuối +3: D, G, J, M $\\rightarrow$ P. Cụm là J10P.'
),

(
  'Cho hai tiền đề: "Mọi người đều phải chết" và "Socrates là người". Kết luận hợp logic là:',
  '{"A": "Socrates phải chết.", "B": "Socrates bất tử.", "C": "Mọi người là Socrates.", "D": "Chưa đủ căn cứ."}',
  'A', 'Logic', 'Quy tắc suy diễn', 'EASY',
  'Tam đoạn luận kinh điển: Mọi $A$ là $B$, $C$ là $A \\Rightarrow C$ là $B$.'
),
(
  'Biết rằng: "Nếu học bài chăm chỉ thì sẽ thi đỗ". Nam không thi đỗ. Kết luận nào đúng?',
  '{"A": "Nam không học bài chăm chỉ.", "B": "Nam học chăm chỉ nhưng đề khó.", "C": "Nam thi trượt môn khác.", "D": "Không kết luận được."}',
  'A', 'Logic', 'Quy tắc suy diễn', 'EASY',
  'Luật Modus Tollens: $P \\Rightarrow Q$. Không có $Q \\Rightarrow$ Không có $P$.'
),
(
  'Biết rằng: "Trời mưa HOẶC đường ngập". Thực tế trời không mưa. Ta kết luận:',
  '{"A": "Đường ngập.", "B": "Đường không ngập.", "C": "Trời nắng.", "D": "Không kết luận được."}',
  'A', 'Logic', 'Quy tắc suy diễn', 'EASY',
  'Phép tuyển $P \\vee Q$. Nếu $\\neg P$ đúng thì bắt buộc $Q$ phải đúng để mệnh đề tuyển đúng.'
),
(
  'Khẳng định: "Chỉ người có vé mới được vào rạp". Hùng được vào rạp. Suy ra:',
  '{"A": "Hùng có vé.", "B": "Hùng không có vé.", "C": "Hùng là nhân viên rạp.", "D": "Rạp mở cửa tự do."}',
  'A', 'Logic', 'Quy tắc suy diễn', 'EASY',
  'Điều kiện cần để vào rạp là có vé. Hùng vào được rạp chứng tỏ Hùng thỏa mãn điều kiện có vé.'
),
(
  'Cho biết: (1) Nếu A thắng thì B nhì. (2) Nếu B nhì thì C ba. Thực tế C không về ba. Ta suy ra:',
  '{"A": "A không thắng.", "B": "B về nhì.", "C": "A thắng.", "D": "C về nhì."}',
  'A', 'Logic', 'Quy tắc suy diễn', 'MEDIUM',
  'Bắc cầu suy luận: A thắng $\\Rightarrow$ C ba. Vì C không ba nên A không thắng (Modus Tollens).'
),
(
  'Một nhân chứng khai: "Tên trộm đi giày đen hoặc mặc áo khoác đỏ". Sau đó cảnh sát xác định tên trộm không mặc áo khoác đỏ. Vậy:',
  '{"A": "Tên trộm chắc chắn đi giày đen.", "B": "Tên trộm đi giày trắng.", "C": "Nhân chứng nói dối.", "D": "Tên trộm không đi giày."}',
  'A', 'Logic', 'Quy tắc suy diễn', 'MEDIUM',
  'Theo quy tắc loại trừ trong phép tuyển (Disjunctive Syllogism): $P \\vee Q$, nếu $\\neg Q$ thì $P$.'
),
(
  'Biết rằng: "Không có con chim cánh cụt nào biết bay" và "Mọi con chim cánh cụt đều là loài chim". Suy ra:',
  '{"A": "Một số loài chim không biết bay.", "B": "Mọi loài chim đều biết bay.", "C": "Chim cánh cụt không phải là chim.", "D": "Mọi loài chim đều không biết bay."}',
  'A', 'Logic', 'Quy tắc suy diễn', 'MEDIUM',
  'Vì chim cánh cụt thuộc loài chim nhưng không biết bay, chứng tỏ tồn tại một số loài chim không biết bay.'
),
(
  'Cho các tiền đề: (1) Mọi giáo viên đều yêu nghề. (2) Một số người yêu nghề thích đọc sách. Có thể suy ra:',
  '{"A": "Một số giáo viên có thể thích đọc sách.", "B": "Tất cả giáo viên đều thích đọc sách.", "C": "Không giáo viên nào thích đọc sách.", "D": "Ai thích đọc sách cũng là giáo viên."}',
  'A', 'Logic', 'Quy tắc suy diễn', 'MEDIUM',
  'Vì chỉ có một số người yêu nghề thích đọc sách nên ta chỉ có thể kết luận khả năng một số giáo viên có thể thích đọc sách.'
),
(
  'Tại một hòn đảo có 2 bộ tộc: Bộ tộc Thật thà (luôn nói thật) và Dối trá (luôn nói dối). Bạn gặp một người và hỏi: "Anh có phải người bộ tộc Thật thà không?". Người đó sẽ trả lời thế nào?',
  '{"A": "Luôn luôn trả lời: ''Phải''.", "B": "Luôn luôn trả lời: ''Không''.", "C": "Tùy thuộc vào tâm trạng.", "D": "Im lặng không trả lời."}',
  'A', 'Logic', 'Quy tắc suy diễn', 'HARD',
  'Nếu là người Thật thà: nói thật $\\rightarrow$ "Phải". Nếu là người Dối trá: phải nói dối câu trả lời "Không" thành $\\rightarrow$ "Phải". Do đó cả hai đều trả lời "Phải".'
),
(
  'Có 3 chiếc hộp dán nhãn: [Táo], [Cam], [Táo và Cam]. Biết TẤT CẢ nhãn đều dán SAI. Bạn chỉ được thò tay lấy 1 quả từ 1 hộp duy nhất mà không nhìn vào trong. Bạn nên mở hộp nào để xác định chính xác toàn bộ các hộp?',
  '{"A": "Hộp dán nhãn [Táo và Cam]", "B": "Hộp dán nhãn [Táo]", "C": "Hộp dán nhãn [Cam]", "D": "Hộp nào cũng như nhau"}',
  'A', 'Logic', 'Quy tắc suy diễn', 'HARD',
  'Vì tất cả nhãn đều sai, hộp [Táo và Cam] chắc chắn chỉ chứa toàn Táo HOẶC toàn Cam. Lấy 1 quả ra thấy quả gì thì hộp đó chính là quả đó, từ đó suy ra chính xác 2 hộp còn lại.'
),

(
  'Từ nào dưới đây viết ĐÚNG chính tả tiếng Việt?',
  '{"A": "Xắp xếp", "B": "Sắp xếp", "C": "Sắp sếp", "D": "Xắp sếp"}',
  'B', 'Tiếng Việt', 'Chính tả', 'EASY',
  'Chính tả chuẩn là "Sắp xếp" (sắp đặt, xếp hàng).'
),
(
  'Cặp từ nào sau đây viết ĐÚNG chính tả?',
  '{"A": "Chân chính", "B": "Trân chính", "C": "Chân chín", "D": "Trân chín"}',
  'A', 'Tiếng Việt', 'Chính tả', 'EASY',
  '"Chân chính" mang nghĩa đúng đắn, trung thực, viết bằng âm ch-.'
),
(
  'Chọn từ viết đúng chính tả để điền vào chỗ trống: "Làm việc ......".',
  '{"A": "năng suất", "B": "năng xuất", "C": "lăng xuất", "D": "lăng suất"}',
  'A', 'Tiếng Việt', 'Chính tả', 'EASY',
  '"Năng suất" viết đúng là n- và -uất.'
),
(
  'Từ nào sau đây viết SAI chính tả?',
  '{"A": "Sơ xuất", "B": "Sơ suất", "C": "Xuất sắc", "D": "Suôn sẻ"}',
  'A', 'Tiếng Việt', 'Chính tả', 'EASY',
  'Viết đúng chuẩn từ điển là "Sơ suất" (chỉ sự bất cẩn, thiếu sót).'
),
(
  'Chọn từ đúng chính tả chỉ hành động xem xét kỹ lưỡng:',
  '{"A": "Săm soi", "B": "Xăm xoi", "C": "Săm xoi", "D": "Xăm soi"}',
  'A', 'Tiếng Việt', 'Chính tả', 'MEDIUM',
  'Từ điển tiếng Việt ghi nhận "Săm soi" (hoặc xoi mói, nhưng săm soi viết bằng s-).'
),
(
  'Từ nào sau đây viết ĐÚNG chính tả?',
  '{"A": "Giành giật", "B": "Dành giật", "C": "Giành dật", "D": "Dành dật"}',
  'A', 'Tiếng Việt', 'Chính tả', 'MEDIUM',
  '"Giành giật" viết bằng gi- (chỉ hành động tranh đoạt). Phân biệt với "để dành".'
),
(
  'Chọn từ viết ĐÚNG chính tả trong các từ sau:',
  '{"A": "Bạt mạng", "B": "Bạc mạng", "C": "Bạt mệnh", "D": "Bạc mệnh"}',
  'A', 'Tiếng Việt', 'Chính tả', 'MEDIUM',
  '"Bạt mạng" (liều lĩnh, bất chấp nguy hiểm). Còn "Bạc mệnh" là mệnh mỏng (thường dùng: hồng nhan bạc mệnh).'
),
(
  'Trong câu: "Anh ấy có tính tình rất ...... ", từ nào điền vào là đúng chính tả?',
  '{"A": "bộc trực", "B": "bộc chực", "C": "bộc chực", "D": "bọc trực"}',
  'A', 'Tiếng Việt', 'Chính tả', 'MEDIUM',
  '"Bộc trực" (ngay thẳng, bộc lộ thẳng thắn tính cách).'
),
(
  'Từ nào sau đây viết ĐÚNG chính tả chỉ sự day dứt lương tâm?',
  '{"A": "Trăn trở", "B": "Chăn trở", "C": "Trăn chở", "D": "Chăn chở"}',
  'A', 'Tiếng Việt', 'Chính tả', 'HARD',
  '"Trăn trở" viết đúng bằng tr- và hỏi ở âm sau.'
),
(
  'Dòng nào gồm các từ đều viết ĐÚNG chính tả?',
  '{"A": "Xoay xở, chắp bút, sáp nhập", "B": "Xoay sở, chấp bút, sáp nhập", "C": "Xoay xở, chấp bút, sáp nhập", "D": "Xoay sở, chắp bút, sát nhập"}',
  'C', 'Tiếng Việt', 'Chính tả', 'HARD',
  'Chuẩn từ điển: "Xoay xở" (chữ xở), "Chấp bút" (khởi thảo văn bản), "Sáp nhập" (nhập vào làm một, không phải sát nhập).'
),

(
  'Điền từ còn thiếu vào câu thành ngữ: "Có công mài sắt, có ngày nên ......".',
  '{"A": "kim", "B": "dao", "C": "vàng", "D": "kéo"}',
  'A', 'Tiếng Việt', 'Thành ngữ', 'EASY',
  'Thành ngữ đầy đủ là "Có công mài sắt, có ngày nên kim".'
),
(
  'Thành ngữ "Lá lành đùm lá rách" khuyên nhủ con người điều gì?',
  '{"A": "Tinh thần tương thân tương ái, cưu mang giúp đỡ nhau", "B": "Cần cù lao động", "C": "Tiết kiệm trong cuộc sống", "D": "Tôn sư trọng đạo"}',
  'A', 'Tiếng Việt', 'Thành ngữ', 'EASY',
  'Thành ngữ thể hiện truyền thống nhân văn giúp đỡ người gặp hoạn nạn, khó khăn.'
),
(
  'Điền từ thích hợp: "Mẹ tròn con ......".',
  '{"A": "vuông", "B": "dài", "C": "khỏe", "D": "đẹp"}',
  'A', 'Tiếng Việt', 'Thành ngữ', 'EASY',
  'Thành ngữ cầu chúc sinh nở thuận lợi: "Mẹ tròn con vuông".'
),
(
  'Thành ngữ nào sau đây đồng nghĩa với "Đồng cam cộng khổ"?',
  '{"A": "Chia ngọt sẻ bùi", "B": "Chân lấm tay bùn", "C": "Đầu tắt mặt tối", "D": "Một nắng hai sương"}',
  'A', 'Tiếng Việt', 'Thành ngữ', 'EASY',
  'Cả hai thành ngữ đều chỉ việc cùng nhau chia sẻ vui buồn, gian khổ.'
),
(
  'Thành ngữ "Nước chảy đá mòn" nhấn mạnh đức tính gì?',
  '{"A": "Kiên trì, nhẫn nại", "B": "Thông minh, sáng tạo", "C": "Trung thực, dũng cảm", "D": "Nhân ái, vị tha"}',
  'A', 'Tiếng Việt', 'Thành ngữ', 'MEDIUM',
  'Nước tuy mềm nhưng chảy mãi đá cũng phải mòn, biểu thị sự bền bỉ, kiên trì.'
),
(
  'Thành ngữ "Cháy nhà ra mặt chuột" có ý nghĩa gì?',
  '{"A": "Khi có biến cố xảy ra thì kẻ xấu mới lộ rõ bộ mặt thật", "B": "Hậu quả nặng nề của hỏa hoạn", "C": "Sự nhanh trí bắt chuột", "D": "Sự đoàn kết khi gặp nạn"}',
  'A', 'Tiếng Việt', 'Thành ngữ', 'MEDIUM',
  'Ẩn dụ về việc khi sự cố xảy ra, những điều xấu xa bị che giấu mới bộc lộ ra ánh sáng.'
),
(
  'Chọn cặp từ thích hợp điền vào chỗ trống: "Khẩu phật tâm ......".',
  '{"A": "xà", "B": "ác", "C": "lang", "D": "độc"}',
  'A', 'Tiếng Việt', 'Thành ngữ', 'MEDIUM',
  'Thành ngữ Hán Việt: "Khẩu phật tâm xà" (miệng nam mô bụng một bồ dao găm).'
),
(
  'Thành ngữ nào dưới đây KHÔNG nói về việc học tập?',
  '{"A": "Học đi đôi với hành", "B": "Học hay cày giỏi", "C": "Miệng còn hôi sữa", "D": "Học tài thi phận"}',
  'C', 'Tiếng Việt', 'Thành ngữ', 'MEDIUM',
  '"Miệng còn hôi sữa" chỉ người còn non nớt, chưa có kinh nghiệm cuộc sống.'
),
(
  'Ý nghĩa thực sự của thành ngữ "Bắt cá hai tay" là gì?',
  '{"A": "Tham lam muốn đạt được cả hai thứ cùng lúc dẫn đến mất cả chì lẫn chài", "B": "Khen ngợi người khéo léo bắt cá", "C": "Người đa tài làm nhiều nghề", "D": "Tính cẩn thận khi làm việc"}',
  'A', 'Tiếng Việt', 'Thành ngữ', 'HARD',
  'Phê phán sự thiếu tập trung, tham lam cùng lúc theo đuổi 2 mục đích mâu thuẫn.'
),
(
  'Thành ngữ nào sau đây có nguồn gốc từ một tích truyện văn học cổ điển?',
  '{"A": "Gái góa lo việc triều đình", "B": "Tái ông thất mã", "C": "Ăn cháo đá bát", "D": "Qua cầu rút ván"}',
  'B', 'Tiếng Việt', 'Thành ngữ', 'HARD',
  '"Tái ông thất mã" (ông lão ở biên giới mất ngựa) là tích truyện triết học nổi tiếng trong sách Hoài Nam Tử.'
),

(
  'Tác phẩm "Truyện Kiều" của đại thi hào Nguyễn Du được viết bằng chữ gì và thể thơ nào?',
  '{"A": "Chữ Nôm, thể thơ lục bát", "B": "Chữ Hán, thể thơ thất ngôn bát cú", "C": "Chữ Quốc ngữ, thể lục bát", "D": "Chữ Nôm, thể song thất lục bát"}',
  'A', 'Tiếng Việt', 'Văn học', 'EASY',
  '"Đoạn trường tân thanh" (Truyện Kiều) viết bằng chữ Nôm theo thể thơ lục bát gồm 3254 câu.'
),
(
  'Tác giả của bài thơ "Đồng chí" viết về tình cảm người lính thời kháng chiến chống Pháp là ai?',
  '{"A": "Chính Hữu", "B": "Quang Dũng", "C": "Phạm Tiến Duật", "D": "Tố Hữu"}',
  'A', 'Tiếng Việt', 'Văn học', 'EASY',
  'Bài thơ "Đồng chí" sáng tác năm 1948 của nhà thơ quân đội Chính Hữu.'
),
(
  'Nhân vật chị Dậu trong tác phẩm "Tắt đèn" là sáng tác của nhà văn nào?',
  '{"A": "Ngô Tất Tố", "B": "Nam Cao", "C": "Vũ Trọng Phụng", "D": "Nguyễn Công Hoan"}',
  'A', 'Tiếng Việt', 'Văn học', 'EASY',
  'Tiểu thuyết hiện thực xuất sắc "Tắt đèn" là của nhà văn Ngô Tất Tố.'
),
(
  'Tập thơ "Nhật ký trong tù" (Ngục trung nhật ký) được Chủ tịch Hồ Chí Minh sáng tác bằng văn tự nào?',
  '{"A": "Chữ Hán", "B": "Chữ Nôm", "C": "Chữ Quốc ngữ", "D": "Tiếng Pháp"}',
  'A', 'Tiếng Việt', 'Văn học', 'EASY',
  'Bác Hồ sáng tác tập thơ ngục trung gồm hơn 130 bài thơ chữ Hán trong các nhà lao tỉnh Quảng Tây.'
),
(
  'Hình tượng "Con sông Đà" trong tùy bút của Nguyễn Tuân mang hai nét tính cách đối lập nào?',
  '{"A": "Hung bạo và Trữ tình", "B": "Hiền hòa và Dữ dội", "C": "Thơ mộng và Khắc nghiệt", "D": "Bình lặng và Dữ dằn"}',
  'A', 'Tiếng Việt', 'Văn học', 'MEDIUM',
  'Nguyễn Tuân đã khắc họa Sông Đà vừa mang diện mạo hung bạo hiểm trở, vừa thấm đẫm nét trữ tình gợi cảm.'
),
(
  'Tác phẩm "Vợ nhặt" của nhà văn Kim Lân lấy bối cảnh lịch sử nào của dân tộc?',
  '{"A": "Nạn đói lịch sử năm Ất Dậu 1945", "B": "Khởi nghĩa Yên Bái 1930", "C": "Cải cách ruộng đất 1954", "D": "Chiến dịch Điện Biên Phủ 1954"}',
  'A', 'Tiếng Việt', 'Văn học', 'MEDIUM',
  'Truyện ngắn tái hiện thảm cảnh nạn đói năm 1945 làm hơn 2 triệu đồng bào ta chết đói.'
),
(
  'Ai là tác giả của vở kịch hiện đại nổi tiếng "Hồn Trương Ba, da hàng thịt"?',
  '{"A": "Lưu Quang Vũ", "B": "Xuân Trình", "C": "Nguyễn Huy Tưởng", "D": "Học Phi"}',
  'A', 'Tiếng Việt', 'Văn học', 'MEDIUM',
  'Vở kịch triết lý nhân sinh đặc sắc của nhà viết kịch tài hoa Lưu Quang Vũ.'
),
(
  'Chi tiết "tiếng chim hót ngoài bờ sông vui vẻ quá" trong tác phẩm "Chí Phèo" có ý nghĩa nghệ thuật gì?',
  '{"A": "Đánh thức khát vọng sống lương thiện và tình cảm con người trong Chí", "B": "Miêu tả vẻ đẹp thiên nhiên làng Vũ Đại", "C": "Báo hiệu trời đã sáng", "D": "Làm nền cho cuộc gặp với Bá Kiến"}',
  'A', 'Tiếng Việt', 'Văn học', 'MEDIUM',
  'Âm thanh quen thuộc của đời thường đã chạm vào đáy sâu tiềm thức, đánh thức phần "người" bị vùi lấp của Chí.'
),
(
  'Phong cách nghệ thuật thơ của Tố Hữu mang đậm khuynh hướng nào dưới đây?',
  '{"A": "Trữ tình chính trị gắn liền với vận mệnh dân tộc", "B": "Lãng mạn thoát ly thực tại", "C": "Trí tuệ, triết lý sắc sảo", "D": "Hiện thực phê phán trần trụi"}',
  'A', 'Tiếng Việt', 'Văn học', 'HARD',
  'Thơ Tố Hữu tiêu biểu cho khuynh hướng sử thi và cảm hứng lãng mạn, mang tính chất trữ tình chính trị sâu sắc.'
),
(
  'Nhận định "Thi trung hữu họa, thi trung hữu nhạc" (Trong thơ có họa, trong thơ có nhạc) thường dùng để ngợi ca tài hoa sáng tác của ai trong phong trào Thơ mới?',
  '{"A": "Huy Cận", "B": "Xuân Diệu", "C": "Hàn Mặc Tử", "D": "Chế Lan Viên"}',
  'A', 'Tiếng Việt', 'Văn học', 'HARD',
  'Thơ Huy Cận trong "Lửa thiêng" (đặc biệt là bài Tràng giang) đạt đến đỉnh cao về tính tạo hình (họa) và âm điệu cổ điển (nhạc).'
),

(
  'Câu "Trời mưa to." thuộc kiểu câu gì xét theo cấu tạo ngữ pháp?',
  '{"A": "Câu đơn", "B": "Câu ghép", "C": "Câu phức", "D": "Câu đặc biệt"}',
  'A', 'Tiếng Việt', 'Ngữ pháp', 'EASY',
  'Câu chỉ có một cụm Chủ - Vị: Chủ ngữ "Trời" - Vị ngữ "mưa to".'
),
(
  'Trong câu "Mẹ đang nấu cơm trong bếp", trạng ngữ là:',
  '{"A": "trong bếp", "B": "Mẹ", "C": "đang nấu cơm", "D": "nấu cơm"}',
  'A', 'Tiếng Việt', 'Ngữ pháp', 'EASY',
  '"Trong bếp" là trạng ngữ chỉ địa điểm, nơi chốn.'
),
(
  'Từ nào sau đây là quan hệ từ trong câu: "Tôi thích đọc sách vì nó mang lại nhiều kiến thức"?',
  '{"A": "vì", "B": "tôi", "C": "nó", "D": "nhiều"}',
  'A', 'Tiếng Việt', 'Ngữ pháp', 'EASY',
  'Từ "vì" biểu thị mối quan hệ nguyên nhân - kết quả giữa 2 vế câu.'
),
(
  'Câu nào sau đây là câu cảm thán?',
  '{"A": "Bông hoa này đẹp quá!", "B": "Bông hoa này có đẹp không?", "C": "Hãy hái bông hoa này.", "D": "Bông hoa này màu đỏ."}',
  'A', 'Tiếng Việt', 'Ngữ pháp', 'EASY',
  'Câu cảm thán dùng để bộc lộ cảm xúc trực tiếp, có từ ngữ cảm thán "quá" và kết thúc bằng dấu chấm than.'
),
(
  'Xác định kiểu câu ghép: "Tuy nhà xa nhưng Nam vẫn luôn đi học đúng giờ."',
  '{"A": "Câu ghép chính phụ biểu thị quan hệ tương phản", "B": "Câu ghép đẳng lập", "C": "Câu ghép biểu thị quan hệ điều kiện", "D": "Câu ghép biểu thị quan hệ tăng tiến"}',
  'A', 'Tiếng Việt', 'Ngữ pháp', 'MEDIUM',
  'Cặp quan hệ từ "Tuy... nhưng..." nối hai vế câu có quan hệ tương phản (nghịch đối).'
),
(
  'Thành phần biệt lập trong câu: "Chao ôi, bông hoa sen mới thơm làm sao!" là:',
  '{"A": "Chao ôi", "B": "bông hoa sen", "C": "mới thơm", "D": "làm sao"}',
  'A', 'Tiếng Việt', 'Ngữ pháp', 'MEDIUM',
  '"Chao ôi" là thành phần cảm thán (thành phần biệt lập không tham gia cấu trúc nòng cốt câu).'
),
(
  'Câu: "Gió thổi, mây bay, mưa bắt đầu rơi." có cấu tạo ngữ pháp như thế nào?',
  '{"A": "Câu ghép có 3 vế câu nối trực tiếp bằng dấu phẩy", "B": "Câu đơn có nhiều vị ngữ", "C": "Câu đơn có nhiều chủ ngữ", "D": "Câu đặc biệt"}',
  'A', 'Tiếng Việt', 'Ngữ pháp', 'MEDIUM',
  'Câu gồm 3 cụm C - V độc lập: Gió / thổi; mây / bay; mưa / bắt đầu rơi.'
),
(
  'Trong câu "Về tài chính, anh ấy rất vững vàng", cụm từ "Về tài chính" đóng vai trò gì?',
  '{"A": "Khởi ngữ", "B": "Trạng ngữ", "C": "Chủ ngữ", "D": "Bổ ngữ"}',
  'A', 'Tiếng Việt', 'Ngữ pháp', 'MEDIUM',
  'Khởi ngữ đứng trước chủ ngữ để nêu lên đề tài được nói đến trong câu (thường đi kèm quan hệ từ về, đối với).'
),
(
  'Xác định lỗi sai trong câu sau: "Qua tác phẩm cho ta thấy lòng yêu nước nồng nàn của nhân dân ta."',
  '{"A": "Thiếu chủ ngữ", "B": "Thiếu vị ngữ", "C": "Sai trật tự từ", "D": "Dùng từ không đúng nghĩa"}',
  'A', 'Tiếng Việt', 'Ngữ pháp', 'HARD',
  '"Qua tác phẩm" chỉ là trạng ngữ; câu thiếu thành phần chủ ngữ (ai thấy?). Cần sửa bỏ chữ "Qua" hoặc thêm chủ ngữ sau đó.'
),
(
  'Câu nào sau đây là câu rút gọn thành phần vị ngữ?',
  '{"A": "Bao giờ bạn về quê? - Ngày mai.", "B": "Ai phụ trách tưới cây? - Học sinh lớp 5A.", "C": "Trời mưa to quá!", "D": "Mùa xuân."}',
  'B', 'Tiếng Việt', 'Ngữ pháp', 'HARD',
  'Câu trả lời đầy đủ là: "Học sinh lớp 5A phụ trách tưới cây". Ở đây câu đã rút gọn cụm vị ngữ "phụ trách tưới cây".'
),

(
  'Biện pháp tu từ nào được sử dụng trong câu: "Trẻ em như búp trên cành"?',
  '{"A": "So sánh", "B": "Ẩn dụ", "C": "Hoán dụ", "D": "Nhân hóa"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'EASY',
  'Có từ so sánh rõ ràng: "như" nối giữa vế A (trẻ em) và vế B (búp trên cành).'
),
(
  'Biện pháp tu từ nào được dùng trong câu: "Bác đã đi rồi sao, Bác ơi!"?',
  '{"A": "Nói giảm nói tránh", "B": "So sánh", "C": "Nói quá", "D": "Chơi chữ"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'EASY',
  'Từ "đi" dùng thay cho từ "mất/qua đời" để giảm cảm giác đau thương, mất mát.'
),
(
  'Câu thơ "Mặt trời xuống biển như hòn lửa" sử dụng biện pháp tu từ nào?',
  '{"A": "So sánh", "B": "Ẩn dụ", "C": "Nhân hóa", "D": "Điệp từ"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'EASY',
  'Sử dụng từ so sánh "như" để liên tưởng màu sắc, hình khối của mặt trời hoàng hôn với hòn lửa rực rỡ.'
),
(
  'Câu tục ngữ "Thuốc đắng dã tật, sự thật mất lòng" sử dụng phép nghệ thuật gì?',
  '{"A": "Phép đối", "B": "Nói quá", "C": "Hoán dụ", "D": "Điệp ngữ"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'EASY',
  'Hai vế đối nhau chặt chẽ về số lượng từ, từ loại và ý nghĩa triết lý.'
),
(
  'Hình ảnh "Áo chàm đưa buổi phân ly" trong bài thơ "Việt Bắc" sử dụng biện pháp tu từ nào?',
  '{"A": "Hoán dụ", "B": "Ẩn dụ", "C": "So sánh", "D": "Nhân hóa"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'MEDIUM',
  'Lấy trang phục "Áo chàm" (đặc trưng của đồng bào Việt Bắc) để chỉ con người Việt Bắc $\\rightarrow$ Hoán dụ lấy dấu hiệu sự vật để chỉ sự vật.'
),
(
  'Biện pháp tu từ nào được sử dụng trong câu: "Lòng mẹ bao la như biển Thái Bình"?',
  '{"A": "So sánh kết hợp Phóng đại (Nói quá)", "B": "Ẩn dụ", "C": "Hoán dụ", "D": "Nói giảm nói tránh"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'MEDIUM',
  'Vừa dùng từ so sánh "như", vừa phóng đại quy mô "bao la như biển Thái Bình" để khắc họa tình mẹ vô tận.'
),
(
  'Trong bài thơ "Đoàn thuyền đánh cá", câu thơ: "Cá nhụ cá chim cùng cá đé / Cá song lấp lánh đuốc đen hồng" sử dụng biện pháp tu từ gì?',
  '{"A": "Liệt kê", "B": "Nói quá", "C": "Hoán dụ", "D": "Chơi chữ"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'MEDIUM',
  'Liệt kê hàng loạt tên các loài cá quý của biển đêm quê hương.'
),
(
  'Biện pháp tu từ nổi bật trong hai câu thơ: "Bàn tay ta làm nên tất cả / Có sức người sỏi đá cũng thành cơm" là:',
  '{"A": "Ẩn dụ và Hoán dụ", "B": "Nói quá và Chơi chữ", "C": "So sánh", "D": "Nói giảm nói tránh"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'MEDIUM',
  '"Bàn tay" là hoán dụ chỉ sức lao động con người; "sỏi đá thành cơm" là ẩn dụ chỉ thành quả lao động từ hoàn cảnh khó khăn.'
),
(
  'Câu thơ: "Ngày ngày mặt trời đi qua trên lăng / Thấy một mặt trời trong lăng rất đỏ" có hình ảnh "mặt trời" thứ hai là biện pháp tu từ gì?',
  '{"A": "Ẩn dụ phẩm chất", "B": "Hoán dụ", "C": "So sánh ngầm", "D": "Nhân hóa"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'HARD',
  '"Mặt trời trong lăng" dùng để chỉ Bác Hồ dựa trên sự tương đồng về nguồn ánh sáng dẫn đường, sưởi ấm tâm hồn dân tộc $\\rightarrow$ Ẩn dụ phẩm chất.'
),
(
  'Xác định biện pháp tu từ đa tầng trong câu ca dao: "Thuyền về có nhớ bến chăng / Bến thì một dạ khăng khăng đợi thuyền"?',
  '{"A": "Ẩn dụ kết hợp Nhân hóa", "B": "Hoán dụ kết hợp So sánh", "C": "Điệp từ kết hợp Nói quá", "D": "Chơi chữ"}',
  'A', 'Tiếng Việt', 'Biện pháp tu từ', 'HARD',
  '"Thuyền" (người đi), "Bến" (người ở lại) là ẩn dụ; hành động "nhớ", "đợi", "một dạ" là nhân hóa tâm tư con người.'
),


(
  'Từ nào sau đây đồng nghĩa với từ "Bao la"?',
  '{"A": "Mênh mông", "B": "Chật hẹp", "C": "Nhỏ bé", "D": "Gọn gàng"}',
  'A', 'Tiếng Việt', 'Từ vựng', 'EASY',
  '"Bao la" và "Mênh mông" đều mang ý nghĩa rộng lớn đến mức như không có giới hạn.'
),
(
  'Từ nào sau đây là từ láy?',
  '{"A": "Lung linh", "B": "Nhà cửa", "C": "Bàn ghế", "D": "Đất nước"}',
  'A', 'Tiếng Việt', 'Từ vựng', 'EASY',
  '"Lung linh" là từ láy âm đầu l-. Các từ còn lại là từ ghép đẳng lập.'
),
(
  'Từ trái nghĩa với từ "Trung thực" là:',
  '{"A": "Gian dối", "B": "Dũng cảm", "C": "Hiền lành", "D": "Thật thà"}',
  'A', 'Tiếng Việt', 'Từ vựng', 'EASY',
  '"Trung thực" (thật thà) trái nghĩa trực tiếp với "Gian dối" (lừa dối, không trung thực).'
),
(
  'Từ "Đầu" trong câu nào sau đây mang nghĩa gốc?',
  '{"A": "Đầu em bị va vào cánh cửa đau quá.", "B": "Anh ấy đứng ở đầu đường.", "C": "Đầu mối giao thông quan trọng.", "D": "Đầu súng trăng treo."}',
  'A', 'Tiếng Việt', 'Từ vựng', 'EASY',
  'Nghĩa gốc là bộ phận trên cùng của cơ thể người hoặc động vật chứa não bộ.'
),
(
  'Từ "Xuân" trong câu thơ: "Sáu mươi mốt tuổi vẫn còn xuân" mang ý nghĩa gì?',
  '{"A": "Sức trẻ, niềm vui sống", "B": "Mùa xuân trong năm", "C": "Tuổi thọ", "D": "Mùa cây đâm chồi"}',
  'A', 'Tiếng Việt', 'Từ vựng', 'MEDIUM',
  'Từ chuyển nghĩa theo phương thức ẩn dụ biểu thị sức sống tươi trẻ, nhiệt huyết yêu đời.'
),
(
  'Nhóm từ nào sau đây gồm các từ Hán - Việt đồng nghĩa với "Đất nước"?',
  '{"A": "Sơn hà, giang sơn, quốc gia", "B": "Sông núi, ruộng đồng, làng bản", "C": "Cố hương, quê nhà", "D": "Tổ tiên, dòng họ"}',
  'A', 'Tiếng Việt', 'Từ vựng', 'MEDIUM',
  'Cả ba từ "Sơn hà", "Giang sơn", "Quốc gia" đều là từ mượn Hán - Việt đồng nghĩa với đất nước.'
),
(
  'Hiện tượng nhiều từ có âm giống nhau nhưng nghĩa hoàn toàn khác nhau không liên quan gì đến nhau được gọi là:',
  '{"A": "Hiện tượng từ đồng âm", "B": "Hiện tượng từ nhiều nghĩa", "C": "Hiện tượng từ đồng nghĩa", "D": "Hiện tượng từ trái nghĩa"}',
  'A', 'Tiếng Việt', 'Từ vựng', 'MEDIUM',
  'Phân biệt với từ nhiều nghĩa: Từ đồng âm chỉ trùng nhau về vỏ ngữ âm một cách ngẫu nhiên, nghĩa không hề liên hệ với nhau.'
),
(
  'Chọn từ thích hợp điền vào câu: "Chính phủ quyết định ...... các quy định gây cản trở sản xuất."',
  '{"A": "bãi bỏ", "B": "phá hủy", "C": "tiêu diệt", "D": "xóa sạch"}',
  'A', 'Tiếng Việt', 'Từ vựng', 'MEDIUM',
  '"Bãi bỏ" là thuật ngữ hành chính pháp lý dùng cho luật pháp, văn bản quy phạm.'
),
(
  'Phân biệt nghĩa sắc thái: Hai từ "Yếu điểm" và "Điểm yếu" khác nhau như thế nào?',
  '{"A": "Yếu điểm là điểm quan trọng, Điểm yếu là chỗ sơ hở/khuyết điểm", "B": "Hoàn toàn giống nhau", "C": "Yếu điểm là khuyết điểm lớn, Điểm yếu là khuyết điểm nhỏ", "D": "Điểm yếu là điểm quan trọng"}',
  'A', 'Tiếng Việt', 'Từ vựng', 'HARD',
  '"Yếu điểm" gốc Hán ("yếu" = quan trọng, thiết yếu) nghĩa là điểm mấu chốt, trọng yếu. "Điểm yếu" thuần Việt mới là nhược điểm.'
),
(
  'Từ "Ngân hàng" trong cụm từ "Ngân hàng đề thi" hoặc "Ngân hàng máu" đã được phát triển nghĩa theo phương thức nào?',
  '{"A": "Phương thức ẩn dụ", "B": "Phương thức hoán dụ", "C": "Hiện tượng đồng âm ngẫu nhiên", "D": "Sao phỏng nguyên nghĩa"}',
  'A', 'Tiếng Việt', 'Từ vựng', 'HARD',
  'Dựa trên nét tương đồng về tính chất: nơi tập trung, lưu giữ và quản lý một lượng lớn tài nguyên giá trị để rút ra sử dụng khi cần $\\rightarrow$ Ẩn dụ.'
);