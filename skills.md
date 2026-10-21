# ==============================================================================
# HỆ THỐNG KỸ NĂNG TÁC NHÂN (AGENT SKILLS SPECIFICATION)
# Dự án: Hệ thống Quiz (Đề 35)
# Học phần: Triển khai và Quản trị Hệ thống Phần mềm
# Mã dự án: dtc245200049-mon-trien-khai
# ==============================================================================

Tài liệu này định nghĩa chi tiết 3 Kỹ năng Tác nhân (Agent Skills) cốt lõi bắt buộc Agent AI phải kích hoạt và tự động vận hành trong toàn bộ vòng đời phát triển dự án Hệ thống Quiz (Đề 35).

---

## 1. SKILL: CODE_AND_TEST_AUTONOMOUSLY
> **Tên kỹ năng**: Tự động hóa phát triển, thẩm định và phục hồi lỗi (Autonomous Code, Test & Self-Healing)  
> **Mục tiêu**: Đảm bảo mọi file cấu hình và mã nguồn được tạo ra đều hoạt động trơn tru trên môi trường thực tế trước khi bàn giao cho người dùng.

### 1.1. Quy trình thực thi tự động (Autonomous Execution Pipeline):
1. **Khởi tạo / Chỉnh sửa mã nguồn & Cấu hình**:
   - Khi được giao nhiệm vụ viết mã nguồn (Quiz App) hoặc file cấu hình hạ tầng (`docker-compose.yml`, Dockerfile, `nginx.conf`, cấu hình Prometheus/Grafana/cơ sở dữ liệu), Agent lập tức sinh file với đầy đủ các tiêu chuẩn bảo mật Hardening đã cam kết trong `.cursorrules`.
2. **Kích hoạt Terminal kiểm tra tức thời**:
   - Ngay sau khi ghi file, Agent **bắt buộc** tự động mở và chạy lệnh trong Terminal ảo của IDE để kiểm tra:
     + Thẩm định cú pháp cấu hình Docker: `docker compose config` hoặc `docker-compose config`.
     + Kiểm tra cú pháp Nginx: `docker compose exec nginx nginx -t` (hoặc kiểm tra file cấu hình cục bộ).
     + Khởi chạy hệ thống: `docker compose up -d --build`.
     + Giám sát trạng thái container: `docker compose ps`.
3. **Thu thập log và đánh giá sức khỏe hệ thống (Health Check)**:
   - Agent tự động chạy `docker compose logs --tail=100 <service_name>` để đọc log khởi động của ứng dụng Quiz, MySQL, Nginx và các dịch vụ liên quan.
   - Kiểm tra mã phản hồi HTTP nội bộ qua curl hoặc kiểm tra kết nối cổng để chắc chắn ứng dụng không rơi vào trạng thái `CrashLoopBackOff` hoặc restart liên tục.

### 1.2. Cơ chế tự khắc phục lỗi (Autonomous Self-Healing Loop - Tối thiểu 3 chu kỳ):
- Khi phát hiện có lỗi (lỗi cú pháp, container thoát bất thường với Exit Code != 0, lỗi kết nối CSDL, phân quyền file, v.v.):
  + **Tuyệt đối không dừng lại hỏi người dùng ngay lập tức**.
  + Agent phải tự động phân tích chi tiết chuỗi lỗi (Stack trace / Exception / Error message).
  + Xác định nguyên nhân gốc rễ (Root Cause Analysis - RCA), ví dụ: thiếu thư viện, sai thông số môi trường, quyền hạn non-root `USER 1000:1000` bị chặn ghi volume, cổng bị xung đột...
  + Tự động sửa lại file code / file cấu hình.
  + Chạy lại lệnh build và kiểm tra trong Terminal.
- **Quy tắc 3 lần thử (Rule of 3 Retries)**:
  + Agent bắt buộc phải thực hiện độc lập **ít nhất 3 chu kỳ** điều chỉnh và thử nghiệm sửa lỗi khác nhau.
  + Chỉ khi đã thử đủ 3 phương án xử lý kỹ thuật độc lập mà vẫn gặp trở ngại do yếu tố bên ngoài (như thiếu tài nguyên máy chủ chủ, xung đột phần mềm ngoài tầm kiểm soát của container), Agent mới được phép báo cáo người dùng kèm theo:
    * Log lỗi chính xác.
    * 3 phương án kỹ thuật đã tự động thử nghiệm và kết quả cụ thể của từng phương án.
    * Đề xuất hướng xử lý cho người dùng.

---

## 2. SKILL: DETAILED_TECHNICAL_DOCUMENTATION
> **Tên kỹ năng**: Soạn thảo tài liệu kỹ thuật & Báo cáo học thuật chuyên sâu (Deep-dive Technical Documentation)  
> **Mục tiêu**: Xây dựng tài liệu Đặc tả Yêu cầu Phần mềm (SRS) và Báo cáo tổng kết 10 trang đạt chuẩn chất lượng học thuật cao nhất, không sơ sài, không ảo giác.

### 2.1. Phương pháp phân tích "Cuốn chiếu" (Progressive Deep-Dive Architecture):
- **Bám sát thực tế 100% (Zero-Abstraction / Ground-Truth)**:
  + Tuyệt đối cấm viết tài liệu chung chung, lý thuyết suông hoặc tóm tắt sơ sài.
  + Phân tích từng file mã nguồn và cấu hình thực tế đang tồn tại trong workspace (`docker-compose.yml`, Dockerfile, `nginx.conf`, file kết nối CSDL, mã nguồn Quiz App...).
- **Cấu trúc mổ xẻ từng thành phần kỹ thuật**:
  + Trích dẫn khối cấu hình / đoạn mã then chốt có trong dự án.
  + **Giải trình kỹ thuật chuyên sâu (Technical Rationale)**: Phân tích tường tận *Tại sao lại dùng lệnh/thông số này?*, *Cơ chế hoạt động ở tầng nhân Linux/Container ra sao?*.
  + **Đánh giá an ninh & Hardening**: Làm rõ vai trò bảo mật của từng thiết lập (ví dụ: cơ chế non-root ngăn ngừa privilege escalation như thế nào; tách biệt `frontend_net` và `backend_net` bảo vệ CSDL ra sao).
  + **Bảng thông số định lượng**: Liệt kê cổng thực (Host port vs Container port), biến môi trường (.env), đường dẫn volume mount, phân bổ RAM/CPU.

### 2.2. Trực quan hóa dữ liệu học thuật:
- Tối ưu hóa dung lượng học thuật 10 trang thông qua:
  + **Bảng ma trận (Markdown Tables)**: Bảng đối chiếu cổng, bảng phân quyền user, bảng thông số biến môi trường, bảng tiêu đề HTTP Security Headers.
  + **Sơ đồ khối ký tự (ASCII / Unicode Diagrams)**: Vẽ trực quan sơ đồ luồng dữ liệu mạng giữa Client -> Nginx Reverse Proxy -> Quiz App / phpMyAdmin -> MySQL Container.
  + **Danh sách phân cấp có hệ thống**: Sử dụng hệ thống đánh số đề mục phân tầng (1.1 -> 1.1.1) theo đúng quy chuẩn báo cáo khoa học kỹ thuật.

---

## 3. SKILL: GIT_COMMIT_COMPLIANCE
> **Tên kỹ năng**: Chuẩn hóa quy trình kiểm soát phiên bản theo mốc (Git Milestone & Commit Compliance)  
> **Mục tiêu**: Quản lý lịch sử mã nguồn dự án chuyên nghiệp, minh bạch, bám sát 3 mốc yêu cầu của giảng viên và tuân thủ định dạng Conventional Commits.

### 3.1. Khung 3 Mốc Commit Bắt Buộc (3 Project Milestones):
Mỗi mốc chỉ được phép tiến hành commit sau khi Agent đã kích hoạt **SKILL: CODE_AND_TEST_AUTONOMOUSLY** và xác nhận hệ thống chạy ổn định 100% trong Terminal ảo:

1. **MỐC 1 (Milestone 1) - Khởi tạo Hạ tầng & Bảo mật Cơ sở (Infra Baseline & Hardening)**:
   - *Phạm vi*: File `docker-compose.yml` hoàn chỉnh (cô lập 2 mạng `frontend_net`, `backend_net`), Nginx Reverse Proxy với 5 Security Headers, MySQL được cô lập hoàn toàn (không expose cổng), Dockerfile non-root chuẩn cho app, và biến môi trường mật khẩu mạnh.
   - *Chuẩn thông điệp*:
     ```bash
     feat(infra): initialize hardened docker compose, nginx reverse proxy and isolated mysql
     ```

2. **MỐC 2 (Milestone 2) - Triển khai Logic Nghiệp vụ Quiz App (Core Business Logic & App Delivery)**:
   - *Phạm vi*: Ứng dụng Quiz hoàn thiện kết nối CSDL MySQL qua mạng nội bộ `backend_net`, giao diện thi trắc nghiệm, tính năng chấm điểm, quản lý câu hỏi, chạy ổn định dưới `USER 1000:1000`.
   - *Chuẩn thông điệp*:
     ```bash
     feat(quiz-app): implement core quiz functionality, database connectivity and secure routing
     ```

3. **MỐC 3 (Milestone 3) - Giám sát Hệ thống, SRS & Hoàn thiện Báo cáo (Monitoring & Academic Documentation)**:
   - *Phạm vi*: Tích hợp hệ thống giám sát tải/hiệu năng (Prometheus / Grafana / Node Exporter / cAdvisor - nếu đề bài yêu cầu mở rộng), tài liệu SRS hoàn chỉnh và Báo cáo kỹ thuật chuyên sâu 10 trang bằng tiếng Việt.
   - *Chuẩn thông điệp*:
     ```bash
     docs(report): complete comprehensive srs and in-depth academic deployment report
     ```

### 3.2. Quy trình hướng dẫn và chuẩn bị lệnh Git:
- Sau mỗi mốc thành công, Agent phải tự động soạn thảo:
  + Trạng thái kiểm thử đã vượt qua (Test validation summary).
  + Khối lệnh Git đầy đủ để người dùng chỉ cần copy/paste hoặc Agent tự động thực thi khi được yêu cầu:
    ```bash
    git status
    git add .
    git commit -m "<type>(<scope>): <mô_tả_ngắn_gọn_chuẩn_conventional_commits>"
    git log -1 --stat
    ```
- Hỗ trợ thông báo và giải thích cho người dùng lý do mã nguồn đã đủ điều kiện chuyển giao sang mốc tiếp theo.

---

## 4. SKILL: PROACTIVE_RUBRIC_TRACKING_AND_USER_GUIDANCE
> **Tên kỹ năng**: Bám sát tiêu chí chấm điểm & Chủ động điều hướng hành động người dùng  
> **Mục tiêu**: Đảm bảo dù ở bất kỳ cửa sổ chat mới nào, Agent luôn tự động nạp đề cương đề tài, giám sát 7 tiêu chí đánh giá và nhắc nhở người dùng thao tác chính xác từng bước.

### 4.1. Cơ chế tự động nạp ngữ cảnh (Session Context Reloading):
- Ở mỗi phiên chat mới hoặc khi người dùng làm mới phiên làm việc, Agent bắt buộc phải tự động nạp:
  + Tệp đề tài: `./docs/DE_TAI_THUC_HANH_DE35.md`
  + Tệp quy tắc: `./.cursorrules` & `./AGENTS.md`
  + Tệp kỹ năng: `./skills.md`

### 4.2. Quy trình chủ động nhắc nhở người dùng (Proactive User Reminders):
- Trong **MỖI PHẢN HỒI**, Agent không chỉ trả lời câu hỏi thụ động mà phải chủ động kèm theo:
  1. **Bảng tiến độ hiện tại** theo thang điểm 10 của Giảng viên.
  2. **Hành động kỹ thuật người dùng cần làm tiếp theo:**
     * Lệnh Terminal cụ thể cần chạy (kèm giải thích rõ tại sao phải chạy lệnh này).
     * Ảnh minh chứng cần chụp (trong 14 ảnh) để đưa vào Báo cáo 10 trang.
     * Mốc Git commit tiếp theo cần thực hiện.

---

## 5. MA TRẬN KẾT HỢP GIỮA CÁC SKILLS VÀ .CURSORRULES

```
+-----------------------------------------------------------------------------------+
|                            .cursorrules & AGENTS.md (Luật Cốt Lõi)               |
| (Docker Compose Hardening | Non-root Dockerfile | 5 Nginx Headers | VN Docs Ground-truth) |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                              skills.md (Kỹ Năng Hành Động)                        |
+-----------------------------------------------------------------------------------+
| 1. CODE_AND_TEST_AUTONOMOUSLY  --> Tự chạy Terminal, tự debug & self-healing >= 3 lần |
| 2. DETAILED_TECHNICAL_DOCS     --> Viết cuốn chiếu, mổ xẻ code thực tế, bảng & sơ đồ|
| 3. GIT_COMMIT_COMPLIANCE       --> 3 Mốc commit chuẩn Conventional Commits         |
| 4. PROACTIVE_RUBRIC_TRACKING   --> Luôn bám sát phiếu điểm & nhắc nhở người dùng  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                docs/DE_TAI_THUC_HANH_DE35.md (Đích Đến: 10.0 / 10 Điểm)           |
+-----------------------------------------------------------------------------------+
```
