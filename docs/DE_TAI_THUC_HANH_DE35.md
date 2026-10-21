# ==============================================================================
# ĐỀ TÀI THỰC HÀNH - MÔN TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM
# ĐỀ 35: HỆ THỐNG QUIZ / THI TRẮC NGHIỆM
# Sinh viên thực hiện: DTC245200049 - Nguyễn Viết Dũng
# Repository: dtc245200049-mon-trien-khai
# ==============================================================================

Tài liệu này lưu trữ nguyên văn và chi tiết toàn bộ các yêu cầu, quy chuẩn kỹ thuật và thang điểm đánh giá từ đề cương môn học của Giảng viên để toàn bộ Agent và Nhà phát triển theo sát 100% trong suốt quá trình triển khai dự án.

---

## 1. THÔNG TIN ĐỀ TÀI GIAO TRỰC TIẾP (ĐỀ 35)

*   **Tên đề tài:** Đề 35: Hệ thống Quiz / Thi trắc nghiệm
*   **Phần mềm cần triển khai:** Website tạo đề thi trắc nghiệm, làm bài, chấm điểm tự động.
*   **Cơ sở dữ liệu:** MySQL + phpMyAdmin.
*   **Công nghệ & Stack gợi ý:** Node.js/Express + MySQL + phpMyAdmin + Nginx + Prometheus + Grafana + Loki (+ Promtail).

---

## 2. YÊU CẦU CHUNG CHO DỰ ÁN (BẮT BUỘC)

1.  **Quản lý mã nguồn trên GitHub:**
    *   Quản lý toàn bộ mã nguồn và file cấu hình (`docker-compose.yml`, Nginx, Prometheus, Grafana, Loki, Promtail...) trên GitHub.
    *   Commit rõ ràng, có tệp `README.md` hướng dẫn chạy chi tiết.
    *   Tài khoản và repository đặt tên theo mã số sinh viên: `dtc245200049-mon-trien-khai`.
2.  **Triển khai Ứng dụng Web & Database:**
    *   Triển khai ứng dụng Web Quiz trắc nghiệm, tích hợp CSDL MySQL 8.0 và công cụ quản trị phpMyAdmin.
3.  **Cấu hình Nginx Reverse Proxy (-> Mốc Commit 1):**
    *   Nginx làm reverse proxy làm cổng đón duy nhất (Ingress).
    *   Bắt buộc có cấu hình Security Headers cơ bản (5 headers chuẩn OWASP) hoặc HTTPS tự ký.
4.  **Tích hợp Prometheus + Grafana (-> Mốc Commit 2):**
    *   Thu thập metrics container, web server và database.
    *   Xây dựng Dashboard Grafana trực quan theo dõi CPU, RAM, Network traffic.
5.  **Hệ thống Log tập trung Loki + Promtail (-> Mốc Commit 3):**
    *   Thu thập toàn bộ log container vào Loki qua Promtail.
    *   Truy vấn log bằng cú pháp LogQL (ít nhất 2–3 query cơ bản có kết quả minh chứng).
6.  **Hardening Hệ thống (Bảo mật chuyên sâu):**
    *   Áp dụng tối thiểu 3–4 biện pháp bảo mật:
        + Non-root container (`USER 1000:1000`).
        + Network isolation (tách mạng `frontend_net` và `backend_net`).
        + Mật khẩu mạnh cho Database ($\ge 12$ ký tự phức tạp).
        + Security headers Nginx đầy đủ.
        + MySQL cô lập tuyệt đối, không mở cổng trực tiếp ra host.
7.  **Viết Báo cáo tổng hợp tối thiểu 10 trang:**
    *   **a) Bìa ngoài cùng:** Thông tin sinh viên, chủ đề được định dạng chuẩn như báo cáo thực tập tốt nghiệp.
    *   **b) Nội dung:** Mô tả cấu trúc hệ thống, cách thức hoạt động, kết quả của 6 bước trên kèm theo hình ảnh chụp minh chứng thực tế đưa vào báo cáo.

> *Lưu ý sống còn từ đề bài:* Tất cả dịch vụ bắt buộc phải triển khai bằng Docker Compose trong một hệ sinh thái duy nhất.

---

## 3. TIÊU CHÍ ĐÁNH GIÁ & THANG ĐIỂM CHI TIẾT (10 ĐIỂM)

| STT | Tiêu chí đánh giá | Nội dung đánh giá chi tiết | Điểm tối đa | Trạng thái dự án |
| :---: | :--- | :--- | :---: | :---: |
| **1** | **Quản lý mã nguồn trên GitHub** | Repository đầy đủ (source + cấu hình), đủ **03 commit** và nội dung có ý nghĩa chuẩn Conventional Commits, có `README.md` hướng dẫn chạy hệ thống rõ ràng. | **1.5 điểm** | Đang tiến hành (Sẵn sàng commit 1) |
| **2** | **Triển khai ứng dụng + Database** | Ứng dụng Quiz chạy ổn định, kết nối CSDL MySQL thành công, có phpMyAdmin hoạt động mượt mà. | **1.5 điểm** | **HOÀN THÀNH (100%)** |
| **3** | **Nginx Reverse Proxy** | Cấu hình reverse proxy đúng đắn, truy cập website qua Nginx cổng 80/443 (có 5 Security Headers bảo vệ). | **1.5 điểm** | **HOÀN THÀNH (100%)** |
| **4** | **Hệ thống giám sát (Prometheus + Grafana)** | Prometheus thu thập metrics, Grafana có dashboard giám sát container / web / DB theo thời gian thực (Mốc commit 2). | **1.5 điểm** | Chuẩn bị triển khai |
| **5** | **Hệ thống log tập trung (Loki + Promtail)** | Loki + Promtail hoạt động, thu thập log container, truy vấn được log bằng cú pháp LogQL (ít nhất 2–3 query cơ bản) (Mốc commit 3). | **1.5 điểm** | Chuẩn bị triển khai |
| **6** | **Hardening hệ thống** | Áp dụng ít nhất 3–4 biện pháp bảo mật: non-root container (`USER 1000:1000`), network isolation (`frontend_net`/`backend_net`), mật khẩu mạnh $\ge 12$ ký tự, Nginx security headers, MySQL cô lập không hở port. | **1.5 điểm** | **HOÀN THÀNH (100%)** |
| **7** | **Tổng thể & Trình bày** | Hệ thống chạy hoàn chỉnh bằng Docker Compose, demo rõ ràng, có screenshot/minh chứng đầy đủ trong báo cáo 10 trang, chắc kiến thức, hiểu bài. | **1.0 điểm** | Đang theo sát tiến độ |
| **TỔNG**| **ĐÁNH GIÁ TOÀN DIỆN** | **Mục tiêu đạt điểm số tối đa** | **10.0 / 10** | |

---

## 4. LỘ TRÌNH 3 MỐC COMMIT THEO YÊU CẦU GIẢNG VIÊN

*   **MỐC 1 (Commit 1):** Hạ tầng Web Quiz + CSDL MySQL + phpMyAdmin + Nginx Reverse Proxy + Hardening bảo mật.
    *   *Thông điệp chuẩn:* `feat(infra): initialize hardened docker compose, nginx reverse proxy and isolated mysql`
*   **MỐC 2 (Commit 2):** Tích hợp hệ thống giám sát Prometheus + cAdvisor + Grafana Dashboard.
    *   *Thông điệp chuẩn:* `feat(monitoring): integrate prometheus and grafana monitoring with custom dashboard`
*   **MỐC 3 (Commit 3):** Tích hợp hệ thống ghi log tập trung Loki + Promtail + 3 truy vấn LogQL + Báo cáo kỹ thuật 10 trang.
    *   *Thông điệp chuẩn:* `feat(logging): setup loki and promtail centralized logging with logql queries and academic report`
