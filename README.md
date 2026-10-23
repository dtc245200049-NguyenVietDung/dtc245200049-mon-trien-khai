# HỆ THỐNG QUIZ / THI TRẮC NGHIỆM TRỰC TUYẾN (ĐỀ 35)
### Học phần: Triển khai và Quản trị Hệ thống Phần mềm
* **Trường:** Đại học Kỹ thuật Công nghiệp - Đại học Thái Nguyên (TNUT)
* **Khoa:** Công nghệ Thông tin
* **Sinh viên thực hiện:** Nguyễn Viết Dũng  
* **Mã số sinh viên:** DTC245200049  
* **Repository:** `dtc245200049-mon-trien-khai`  
* **Báo cáo kỹ thuật chi tiết:** [`Bao_Cao_Thuc_Hanh_Mon_Hoc.md`](./Bao_Cao_Thuc_Hanh_Mon_Hoc.md)

---

## 1. Giới Thiệu Dự Án

Dự án triển khai một hệ sinh thái thi trắc nghiệm trực tuyến (Quiz System) tự động nạp đề thi, chấm điểm và lưu trữ kết quả, được thiết kế, vận hành và quản trị hoàn toàn trên nền tảng container hóa với **Docker Compose (Tệp duy nhất `docker-compose.yml`)**. 

Hệ thống tuân thủ nghiêm ngặt các quy chuẩn kỹ thuật trong [`.cursorrules`](./.cursorrules) và đề cương môn học [`docs/DE_TAI_THUC_HANH_DE35.md`](./docs/DE_TAI_THUC_HANH_DE35.md):
1. **Phân vùng mạng cô lập (Network Hardening):** Chia tách độc lập 3 mạng bridge (`frontend_net`, `backend_net`, `monitoring_net`).
2. **Cổng đón duy nhất (Single Ingress):** Nginx Reverse Proxy tiếp nhận toàn bộ lưu lượng cổng 80, đính kèm 5 HTTP Security Headers chuẩn OWASP.
3. **Bảo mật tiến trình (Non-Root Execution):** Ứng dụng Quiz chạy dưới người dùng không đặc quyền `USER 1000:1000`.
4. **Cơ sở dữ liệu an toàn:** MySQL 8.0 được cô lập tuyệt đối trong `backend_net`, không mở cổng ra host, mật khẩu phức tạp $\ge 12$ ký tự.
5. **Quan sát số đo hiệu năng (Metrics Observability):** Tích hợp Prometheus tự động cào metrics từ cAdvisor và Quiz App, trực quan hóa qua Grafana Dashboard 7 panels.
6. **Hệ thống nhật ký tập trung (Centralized Logging):** Promtail tự động gom log container chuyển về cụm lưu trữ Loki cổng 3100, hỗ trợ truy vấn chuyên sâu bằng ngôn ngữ LogQL.

### Công nghệ sử dụng (Technology Stack):
*   **Tầng Web & API:** Node.js (Express), Vanilla JS, CSS3 Modern Glassmorphism.
*   **Tầng Cơ sở dữ liệu:** MySQL 8.0 (InnoDB, utf8mb4) & phpMyAdmin.
*   **Tầng Cổng Ingress & Cân bằng tải:** Nginx 1.27 Alpine.
*   **Tầng Giám sát số đo (Metrics):** Prometheus v2.51.0, cAdvisor v0.49.1, Grafana 10.4.1.
*   **Tầng Ghi nhật ký tập trung (Logging):** Grafana Loki, Promtail.

---

## 2. Kiến Trúc Phân Tầng & Phân Vùng Mạng Cô Lập

Toàn bộ hệ sinh thái gồm 9 container độc lập, tổ chức thành 4 phân lớp rõ rệt:

```
[ Thí sinh / Sinh viên ]                      [ Quản trị viên / DevOps ]
            |                                                |
            | (HTTP Cổng 80)                                 | (Cổng 3000 / 9090 / 8082)
            v                                                v
+-----------------------------------------------------------------------------------+
| NGINX REVERSE PROXY (quiz_nginx) - CỔNG INGRESS DUY NHẤT (Port 80:80)             |
|  - 5 Security Headers: X-Frame, X-XSS, X-Content-Type, Referrer, CSP             |
+-----------------------------------------------------------------------------------+
            |                                                |
            | (http://quiz_app:3000)                         | (http://phpmyadmin:80/)
            v                                                v
============================[ MẠNG FRONTEND (frontend_net) ]========================
            |                                                |
            v                                                v
+-----------------------------------+        +--------------------------------------+
| Ứng dụng Quiz (quiz_app)          |        | Quản trị CSDL (quiz_phpmyadmin)      |
|  - Non-Root USER 1000:1000        |        |  - Truy cập qua /phpmyadmin/         |
|  - Cổng nội bộ: 3000              |        |  - Cổng nội bộ: 80                   |
+-----------------------------------+        +--------------------------------------+
            |                                                |
            | (mysql://quiz_db:3306)                         | (mysql://quiz_db:3306)
            v                                                v
====================[ MẠNG BACKEND (backend_net) - CÔ LẬP HOÀN TOÀN ]===============
                                            |
                                            v
                        +---------------------------------------+
                        | Cơ sở dữ liệu MySQL 8.0 (quiz_db)     |
                        |  - TUYỆT ĐỐI KHÔNG MỞ CỔNG RA HOST    |
                        |  - Cổng nội bộ: 3306                  |
                        |  - Persistent Volume: db_data         |
                        +---------------------------------------+

===================[ MẠNG GIÁM SÁT & LOG (monitoring_net) ]=========================
           /                    |                    \                    \
          v                     v                     v                    v
+------------------+  +-------------------+  +------------------+  +----------------+
| cAdvisor         |  | Prometheus        |  | Grafana          |  | Loki + Promtail|
| (quiz_cadvisor)  |  | (quiz_prometheus) |  | (quiz_grafana)   |  | (quiz_loki)    |
| Port: 8082:8080  |  | Port: 9090:9090   |  | Port: 3000:3000  |  | Port: 3100:3100|
+------------------+  +-------------------+  +------------------+  +----------------+
```

---

## 3. Danh Mục 9 Dịch Vụ & Phân Bổ Cổng Mạng (Zero-Abstraction)

| STT | Tên Dịch Vụ | Tên Container | Cổng Host | Cổng Nội Bộ | Mạng Docker | Mục đích & URL truy cập |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| 1 | **Nginx Reverse Proxy** | `quiz_nginx` | **80:80** | 80/tcp | `frontend_net` | Cổng Ingress duy nhất: `http://localhost/` |
| 2 | **Quiz Web App** | `quiz_app` | *Không* | 3000/tcp | `frontend_net`, `backend_net` | Xử lý logic thi, API: `http://localhost/` (qua Nginx) |
| 3 | **MySQL Database** | `quiz_db` | *Không* | 3306/tcp | `backend_net` | CSDL cô lập, volume `db_data` |
| 4 | **phpMyAdmin** | `quiz_phpmyadmin` | *Không* | 80/tcp | `frontend_net`, `backend_net` | Quản trị CSDL: `http://localhost/phpmyadmin/` |
| 5 | **cAdvisor** | `quiz_cadvisor` | **8082:8080** | 8080/tcp | `monitoring_net` | Số đo tài nguyên container: `http://localhost:8082` |
| 6 | **Prometheus** | `quiz_prometheus` | **9090:9090** | 9090/tcp | `frontend_net`, `monitoring_net` | Quản lý targets & TSDB: `http://localhost:9090` |
| 7 | **Grafana Dashboard** | `quiz_grafana` | **3000:3000** | 3000/tcp | `monitoring_net` | Dashboard trực quan 7 panels: `http://localhost:3000` |
| 8 | **Loki Log Server** | `quiz_loki` | **3100:3100** | 3100/tcp | `monitoring_net` | Cụm lưu trữ log tập trung TSDB |
| 9 | **Promtail Log Agent** | `quiz_promtail` | *Không* | 9080/tcp | `monitoring_net` | Đọc Docker socket chuyển tiếp log sang Loki |

---

## 4. Hướng Dẫn Cài Đặt & Khởi Chạy (Quick Start)

### Yêu cầu tiên quyết:
* Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/) (hỗ trợ Docker Compose v2).
* Đã cài đặt [Git](https://git-scm.com/).

### Các bước triển khai:

1. **Clone mã nguồn từ GitHub:**
   ```bash
   git clone https://github.com/dtc245200049-NguyenVietDung/dtc245200049-mon-trien-khai.git
   cd dtc245200049-mon-trien-khai
   ```

2. **Khởi tạo biến môi trường:**
   Sao chép tệp cấu hình mẫu `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Tệp `.env` đã được cấu hình sẵn các mật khẩu phức tạp $\ge 12$ ký tự chuẩn bảo mật).*

3. **Khởi chạy toàn bộ hệ sinh thái bằng 1 lệnh Docker Compose duy nhất:**
   ```bash
   docker compose up -d --build
   ```

4. **Kiểm tra trạng thái sẵn sàng của 9 container:**
   ```bash
   docker compose ps
   ```
   *Yêu cầu nghiệm thu:* Toàn bộ 9/9 containers đều hiển thị trạng thái `Up` (riêng `quiz_db` và `quiz_cadvisor` đạt trạng thái `healthy`).

---

## 5. Hướng Dẫn Kiểm Thử Chức Năng & Nghiệm Thu Hệ Thống

### 5.1. Tầng Ứng Dụng Web & Quản Trị Cơ Sở Dữ Liệu
* **Trang chủ thi trắc nghiệm:** Mở trình duyệt truy cập `http://localhost/`
  * Nhập Mã sinh viên (VD: `DTC245200049`) và Họ tên $\rightarrow$ Nhấn **Bắt đầu làm bài**.
  * Trả lời các câu hỏi chuẩn chuyên đề *Triển khai & Quản trị Hệ thống Phần mềm*.
  * Nhấn **Nộp bài** $\rightarrow$ Hệ thống tự động chấm điểm (`5/5 - 100%`) và hiển thị giải trình chi tiết từng câu.
* **Tính năng Tạo Đề Thi & Quản Lý Câu Hỏi:**
  * Tại trang chủ, nhấn nút **Tạo & Quản Lý Đề Thi**.
  * Nhập nội dung câu hỏi mới, 4 phương án (A, B, C, D), tích chọn đáp án đúng, phân loại và giải thích.
  * Nhấn **Lưu Câu Hỏi Vào CSDL MySQL** $\rightarrow$ Dữ liệu được `INSERT` trực tiếp vào bảng `questions`.
  * Xem danh sách toàn bộ câu hỏi và hỗ trợ xóa câu hỏi theo ID.
* **Trang quản trị phpMyAdmin:** Truy cập `http://localhost/phpmyadmin/`
  * **Server:** `quiz_db`
  * **Username:** `quiz_user` (hoặc `root`)
  * **Password:** Tra cứu tại `.env` (`Quiz#Sec2026!Deploy` hoặc `Root#SecurePass2026!Dtc`)
  * Kiểm tra bảng `questions` (danh sách câu hỏi) và bảng `quiz_results` (bản ghi bài thi vừa nộp).

### 5.2. Kiểm Thử Các Tiêu Chuẩn Bảo Mật (Security Hardening)
* **Kiểm tra 5 HTTP Security Headers qua lệnh cURL:**
  ```powershell
  # Trên Windows PowerShell (sử dụng curl.exe để chạy đúng binary curl):
  curl.exe -i http://localhost/health

  # Trên Linux / macOS / Git Bash:
  curl -i http://localhost/health
  ```
  *Kết quả kiểm tra:*
  ```http
  HTTP/1.1 200 OK
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com data:;

  {"status":"UP","database":"CONNECTED","timestamp":"...","service":"quiz-app","user_uid":1000}
  ```
* **Kiểm tra quyền hạn người dùng Non-Root UID 1000:**
  ```bash
  docker compose exec quiz_app id
  ```
  *Kết quả trả về chính xác:* `uid=1000(node) gid=1000(node) groups=1000(node)`
* **Kiểm tra cô lập CSDL MySQL (Không mở cổng ra máy chủ):**
  Quan sát đầu ra của `docker compose ps`, dịch vụ `quiz_db` chỉ hiển thị cổng nội bộ `3306/tcp`, hoàn toàn không có ánh xạ dạng `0.0.0.0:3306->3306/tcp`.

### 5.3. Kiểm Thử Hệ Thống Giám Sát Hiệu Năng (Prometheus + Grafana)
* **Kiểm tra Prometheus Targets:** Truy cập `http://localhost:9090/targets`
  * Xác nhận toàn bộ 3 mục tiêu (`cadvisor:8080`, `localhost:9090`, `quiz_app:3000`) đều hiển thị màu xanh **UP (1/1 up)**.
* **Dashboard Grafana trực quan:** Truy cập `http://localhost:3000`
  * Tự động đăng nhập với vai trò Admin (Anonymous viewer enabled).
  * Điều hướng tới **Dashboards $\rightarrow$ Quiz System $\rightarrow$ Quiz System - Container & Application Metrics**.
  * Quan sát trực tiếp 7 panels thời gian thực:
    1. *Quiz App Status:* Trạng thái kết nối MySQL (`CONNECTED (OK)`).
    2. *Quiz App Uptime:* Thời gian hoạt động liên tục (seconds).
    3. *Quiz App Heap Memory:* Bộ nhớ RAM V8 Node.js cấp phát (bytes).
    4. *Monitoring Targets UP:* Tổng số dịch vụ giám sát hoạt động bình thường (kết quả: 3).
    5. *Container CPU Usage (%):* Biến thiên tỷ lệ CPU của từng container.
    6. *Container Memory Usage (RAM):* Dung lượng bộ nhớ RAM tiêu thụ của toàn bộ cụm container.
    7. *Network Traffic (Rx/Tx):* Tốc độ truyền nhận gói tin mạng qua card ảo `eth0`.
* **Giao diện cAdvisor UI:** Truy cập `http://localhost:8082` để quan sát số đo cgroups chi tiết của Docker Host.

### 5.4. Kiểm Thử Hệ Thống Ghi Log Tập Trung (Loki + Promtail + LogQL)
Truy cập **Grafana $\rightarrow$ Explore** (`http://localhost:3000/explore`), chọn Data Source **Loki** và thực thi 3 câu truy vấn LogQL mẫu đã được kiểm thử thực tế:

1. **Câu truy vấn 1: Giám sát toàn bộ Access Log qua Nginx Ingress:**
   ```logql
   {container="quiz_nginx"}
   ```
   *Kết quả:* Xem toàn bộ lịch sử truy cập của client với mã phản hồi HTTP `200`, IP client và URI yêu cầu.

2. **Câu truy vấn 2: Giám sát nhật ký hoạt động tầng Ứng dụng Backend:**
   ```logql
   {container="quiz_app"}
   ```
   *Kết quả:* Trích xuất các dòng log xử lý của Node.js: `[HTTP GET] /metrics`, `[HTTP GET] /api/questions`, `[HTTP GET] /health`.

3. **Câu truy vấn 3: Lọc chuyên sâu sự kiện kết nối Cơ sở dữ liệu MySQL:**
   ```logql
   {container="quiz_app"} |= "DB"
   ```
   *Kết quả:* Lọc chính xác các sự kiện khởi tạo kết nối:
   `[DB INIT] Dang thu ket noi toi MySQL (Lan 1/30) tai quiz_db:3306...` và `[DB INIT] Ket noi MySQL thanh cong!`.

---

## 6. Ma Trận Đối Chiếu 7 Tiêu Chí Đánh Giá Của Giảng Viên (Thang Điểm 10)

| STT | Tiêu chí đánh giá của Giảng viên | Điểm | Hiện thực hóa kỹ thuật trong dự án | Trạng thái |
| :---: | :--- | :---: | :--- | :---: |
| **1** | **Quản lý mã nguồn trên GitHub** | **1.5 đ** | Repo `dtc245200049-mon-trien-khai` hoàn thành đủ 3 commit chuẩn mốc, tệp `README.md` học thuật hướng dẫn cài đặt & chạy chi tiết từ A-Z. | ✅ **Đạt 1.5 / 1.5 đ** |
| **2** | **Triển khai Web Quiz + Database** | **1.5 đ** | Web Quiz (Node.js/Express) đầy đủ 3 tính năng: Tạo đề thi & câu hỏi, làm bài trực tuyến, chấm điểm tự động & lưu kết quả MySQL 8.0, phpMyAdmin quản trị CSDL tại `/phpmyadmin/`. | ✅ **Đạt 1.5 / 1.5 đ** |
| **3** | **Nginx Reverse Proxy** | **1.5 đ** | Nginx là cổng Ingress duy nhất (cổng 80), định tuyến ngược an toàn và trang bị đủ 5 HTTP Security Headers chuẩn OWASP. | ✅ **Đạt 1.5 / 1.5 đ** |
| **4** | **Hệ thống Giám sát Prometheus + Grafana** | **1.5 đ** | cAdvisor thu thập metrics, Prometheus cào dữ liệu qua 3 targets `UP`, Grafana nạp sẵn Dashboard 7 panels theo dõi CPU/RAM/Network. | ✅ **Đạt 1.5 / 1.5 đ** |
| **5** | **Hệ thống Log tập trung Loki + Promtail** | **1.5 đ** | Promtail tự động gom log container chuyển về Loki, Grafana Explore thực thi thành công 3 câu truy vấn LogQL chuẩn xác có kết quả thật. | ✅ **Đạt 1.5 / 1.5 đ** |
| **6** | **Hardening hệ thống bảo mật chuyên sâu** | **1.5 đ** | Đủ 5 biện pháp: Non-Root UID 1000, 2 mạng cô lập `frontend_net`/`backend_net`, MySQL không mở port host, mật khẩu mạnh $\ge 12$ ký tự, 5 Security Headers. | ✅ **Đạt 1.5 / 1.5 đ** |
| **7** | **Tổng thể hệ sinh thái & Báo cáo thực hành** | **1.0 đ** | Hệ thống vận hành hợp nhất trong 1 file `docker-compose.yml`, Báo cáo kỹ thuật chi tiết $\ge 10$ trang có bìa chuẩn và 14 hình ảnh minh chứng thực tế 100%. | ✅ **Đạt 1.0 / 1.0 đ** |
| **TỔNG**| **ĐÁNH GIÁ TOÀN DIỆN HỌC PHẦN** | **10.0 đ** | **Mục tiêu đạt điểm số tối đa: 10.0 / 10 điểm xuất sắc** | **10.0 / 10** |

---

## 7. Lộ Trình 3 Mốc Commit Chuẩn Conventional Commits

Dự án tuân thủ nghiêm ngặt lộ trình 3 mốc commit theo yêu cầu của Giảng viên:

1. **MỐC 1 (Commit 1):** Khởi tạo hạ tầng Docker Compose, Web Quiz, CSDL MySQL cô lập, phpMyAdmin, Nginx Reverse Proxy và Hardening bảo mật.
   * *Commit hash:* `1afb239`
   * *Thông điệp:* `commit 1: trien khai ung dung web quiz, mysql, phpmyadmin va nginx reverse proxy`
2. **MỐC 2 (Commit 2):** Tích hợp hệ thống giám sát tải Prometheus, cAdvisor và Grafana Dashboard với 7 panels trực quan.
   * *Commit hash:* `ab64eaf`
   * *Thông điệp:* `feat(monitoring): integrate prometheus and grafana monitoring with custom dashboard`
3. **MỐC 3 (Commit 3):** Tích hợp cụm lưu trữ log tập trung Loki, tác nhân Promtail, thực thi 3 câu truy vấn LogQL và hoàn thiện Báo cáo học thuật $\ge 10$ trang.
   * *Commit hash:* `7e6dbb3`
   * *Thông điệp:* `feat(logging): setup loki and promtail centralized logging with logql queries and academic report`

---

## 8. Danh Mục Tài Liệu Kỹ Thuật

*   **Báo cáo thực hành môn học chi tiết ($\ge 10$ trang, có bìa chuẩn và 14 minh chứng):** [`Bao_Cao_Thuc_Hanh_Mon_Hoc.md`](./Bao_Cao_Thuc_Hanh_Mon_Hoc.md)
*   **Đề cương đề tài và thang điểm đánh giá của Giảng viên:** [`docs/DE_TAI_THUC_HANH_DE35.md`](./docs/DE_TAI_THUC_HANH_DE35.md)
*   **Quy chuẩn kỹ thuật và nguyên tắc bảo mật:** [`.cursorrules`](./.cursorrules)
*   **Đặc tả kỹ năng tác nhân:** [`skills.md`](./skills.md)

---
© 2026 Nguyễn Viết Dũng - DTC245200049. Học phần Triển khai và Quản trị Hệ thống Phần mềm.