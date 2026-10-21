# SYSTEM DIRECTIVES & AGENT BEHAVIORAL PROTOCOL (AGENTS.md)
# Project: dtc245200049-mon-trien-khai (Đề 35: Hệ thống Quiz / Thi trắc nghiệm)
# Subject: Triển khai và Quản trị Hệ thống Phần mềm
# Student: Nguyễn Viết Dũng - DTC245200049

> [!IMPORTANT]
> **ALWAYS ON DIRECTIVE FOR EVERY NEW CHAT SESSION / AGENT REFRESH:**
> Whenever this workspace is loaded or a new conversation starts, the Agent **MUST** immediately load and enforce the following 3 source-of-truth documents:
> 1. [`.cursorrules`](file:///d:/Git/dtc245200049-mon-trien-khai/.cursorrules): Quy chuẩn Docker Compose (1 file, cô lập mạng), Dockerfile Non-root (`USER 1000:1000`), Nginx 5 Security Headers, và Mật khẩu mạnh $\ge 12$ ký tự.
> 2. [`skills.md`](file:///d:/Git/dtc245200049-mon-trien-khai/skills.md): 3 kỹ năng tác nhân (Tự test Terminal & Self-healing $\ge 3$ lần, Viết tài liệu học thuật cuốn chiếu, Tuân thủ 3 mốc commit Git).
> 3. [`docs/DE_TAI_THUC_HANH_DE35.md`](file:///d:/Git/dtc245200049-mon-trien-khai/docs/DE_TAI_THUC_HANH_DE35.md): Đề cương đề tài, phiếu chấm 7 tiêu chí (Thang điểm 10) và yêu cầu demo của giảng viên.

---

## 1. NGUYÊN TẮC BÁM SÁT TIÊU CHÍ ĐỀ TÀI & NHẮC NHỞ NGƯỜI DÙNG (PROACTIVE TRACKING)
Ở **MỖI PHIÊN LÀM VIỆC VÀ TRONG MỖI CÂU TRẢ LỜI**, Agent bắt buộc phải:
1.  **Kiểm tra đối chiếu tiến độ:** Rà soát trạng thái hiện tại của dự án so với 7 tiêu chí trong [`docs/DE_TAI_THUC_HANH_DE35.md`](file:///d:/Git/dtc245200049-mon-trien-khai/docs/DE_TAI_THUC_HANH_DE35.md).
2.  **Chủ động nhắc nhở người dùng hành động tiếp theo:**
    *   Lệnh Terminal cụ thể cần gõ để kiểm thử hoặc chạy hệ thống.
    *   Ảnh minh chứng cụ thể cần chụp (trong danh sách 14 ảnh) để lưu vào Báo cáo 10 trang.
    *   Mốc Git commit tiếp theo cần đẩy lên GitHub (`main`).
3.  **Không chờ người dùng hỏi:** Luôn đề xuất bước kỹ thuật tối ưu tiếp theo để hoàn thiện điểm số tối đa (10/10).

---

## 2. MA TRẬN TIÊU CHÍ ĐÁNH GIÁ (THANG ĐIỂM 10) CẦN THEO SÁT

| STT | Tiêu chí đánh giá | Điểm | Hướng dẫn Agent xử lý |
| :---: | :--- | :---: | :--- |
| **1** | **Quản lý mã nguồn GitHub** | **1.5 đ** | Kiểm tra đủ 3 commit chuẩn mốc, `README.md` cập nhật chi tiết cách cài đặt & chạy. |
| **2** | **Ứng dụng Web + Database** | **1.5 đ** | Web Quiz (Node.js/Express) kết nối MySQL 8.0, phpMyAdmin truy cập qua Nginx `/phpmyadmin/`. |
| **3** | **Nginx Reverse Proxy** | **1.5 đ** | Cổng vào duy nhất Ingress cổng 80, bắt buộc 5 Security Headers chuẩn OWASP. |
| **4** | **Prometheus + Grafana** | **1.5 đ** | Mốc 2: Prometheus thu thập metrics (cAdvisor, container), Grafana có dashboard trực quan. |
| **5** | **Loki + Promtail + LogQL** | **1.5 đ** | Mốc 3: Thu thập log tập trung, tối thiểu 2-3 câu truy vấn LogQL có dữ liệu thật. |
| **6** | **Hardening hệ thống** | **1.5 đ** | Non-root `USER 1000:1000`, 2 mạng cô lập `frontend_net`/`backend_net`, mật khẩu mạnh $\ge 12$ ký tự, MySQL không mở cổng ra host. |
| **7** | **Tổng thể & Trình bày** | **1.0 đ** | Chạy bằng Docker Compose duy nhất, Báo cáo kỹ thuật $\ge 10$ trang có bìa chuẩn và 14 ảnh minh chứng. |

---

## 3. LỘ TRÌNH 3 MỐC COMMIT BẮT BUỘC
*   **MỐC 1 (ĐÃ XONG):** `commit 1: trien khai ung dung web quiz, mysql, phpmyadmin va nginx reverse proxy` (Hạ tầng, Nginx, App non-root, DB cô lập).
*   **MỐC 2 (BƯỚC TIẾP THEO):** `feat(monitoring): integrate prometheus and grafana monitoring with custom dashboard` (Giám sát tải).
*   **MỐC 3:** `feat(logging): setup loki and promtail centralized logging with logql queries and academic report` (Log tập trung + Báo cáo 10 trang).
