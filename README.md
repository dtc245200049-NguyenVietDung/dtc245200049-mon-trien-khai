# HỆ THỐNG QUIZ / THI TRẮC NGHIỆM TRỰC TUYẾN (ĐỀ 35)
### Môn học: Triển khai và Quản trị Hệ thống Phần mềm
**Sinh viên thực hiện:** Nguyễn Viết Dũng  
**Mã số sinh viên:** DTC245200049  
**Repository:** `dtc245200049-mon-trien-khai`  

---

## 1. Giới Thiệu Dự Án
Dự án triển khai một nền tảng thi trắc nghiệm trực tuyến (Quiz System) tự động chấm điểm và lưu trữ kết quả, được thiết kế và vận hành hoàn toàn trên nền tảng container hóa với **Docker Compose**. Hệ thống tuân thủ nghiêm ngặt các tiêu chuẩn **Bảo mật Hạ tầng (Hardening)**, thiết lập mạng cô lập, reverse proxy bảo vệ bởi các Security Headers và chạy với quyền người dùng không đặc quyền.

### Công nghệ sử dụng (Tech Stack):
*   **Web Application:** Node.js (Express), Vanilla JS, CSS3 Modern Glassmorphism.
*   **Database:** MySQL 8.0 (Containerized, Isolated).
*   **Database Management:** phpMyAdmin (Routed through Reverse Proxy).
*   **Reverse Proxy & Ingress:** Nginx 1.27 Alpine (5 Security Headers OWASP).
*   **Monitoring (Milestone 2):** Prometheus + Grafana + cAdvisor.
*   **Logging (Milestone 3):** Loki + Promtail + LogQL.

---

## 2. Kiến Trúc Hạ Tầng & Bảo Mật Hardening

```
[ Client / Browser ] 
        | (HTTP Cổng 80)
        v
+-----------------------------------------------------------------------------------+
| Nginx Reverse Proxy (Cổng Ingress duy nhất - Port 80:80)                          |
|  - 5 Security Headers: X-Frame, X-XSS, X-Content-Type, Referrer, CSP             |
+-----------------------------------------------------------------------------------+
        |                                                   |
        | (http://quiz_app:3000)                            | (http://phpmyadmin:80/)
        v                                                   v
=======[ MẠNG FRONTEND (frontend_net) ]==============================================
        |                                                   |
        v                                                   v
+-----------------------------------+       +---------------------------------------+
| Ứng dụng Quiz (Node.js)           |       | Quản trị CSDL phpMyAdmin              |
|  - Non-root USER 1000:1000        |       |  - Truy cập qua /phpmyadmin/          |
+-----------------------------------+       +---------------------------------------+
        |                                                   |
        | (mysql://quiz_db:3306)                            | (mysql://quiz_db:3306)
        v                                                   v
=======[ MẠNG BACKEND (backend_net) - CÔ LẬP HOÀN TOÀN ]============================
        |                                                   |
        +-------------------------+-------------------------+
                                  |
                                  v
                +-----------------------------------+
                | Cơ sở dữ liệu MySQL 8.0           |
                |  - KHÔNG MỞ CỔNG RA NGOÀI HOST    |
                |  - Mật khẩu mạnh >= 12 ký tự      |
                |  - Volume mount lưu trữ: db_data  |
                +-----------------------------------+
```

### Các biện pháp Hardening bảo mật áp dụng:
1.  **Non-root Container:** Container ứng dụng Quiz thực thi hoàn toàn dưới quyền `USER 1000:1000`, triệt tiêu rủi ro leo thang đặc quyền (Privilege Escalation).
2.  **Network Isolation:** Tách rời mạng `frontend_net` (tầng web) và `backend_net` (tầng dữ liệu). Container MySQL chỉ nằm trong `backend_net`.
3.  **Không hở cổng Database:** MySQL không sử dụng chỉ thị mapping port ra host (không mở `3306:3306`), chỉ giao tiếp nội bộ qua container network.
4.  **Mật khẩu mạnh (Strong Password):** Mật khẩu CSDL được tạo với độ dài trên 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
5.  **Nginx Security Headers:** Trang bị đầy đủ 5 HTTP Security Headers chống Clickjacking, MIME sniffing, và XSS.

---

## 3. Danh Mục Cổng & Dịch Vụ
 
| Dịch vụ | Container Name | Cổng Host | Cổng Nội Bộ | Mạng Docker | Đường dẫn truy cập |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Nginx Reverse Proxy** | `quiz_nginx` | **80:80** | 80/tcp | `frontend_net` | `http://localhost/` |
| **Ứng dụng Quiz** | `quiz_app` | *Không* | 3000/tcp | `frontend_net`, `backend_net` | `http://localhost/` (qua Nginx) |
| **MySQL Database** | `quiz_db` | *Không* | 3306/tcp | `backend_net` | Nội bộ mạng `quiz_db:3306` |
| **phpMyAdmin** | `quiz_phpmyadmin` | *Không* | 80/tcp | `frontend_net`, `backend_net` | `http://localhost/phpmyadmin/` |
| **Prometheus** | `quiz_prometheus` | **9090:9090** | 9090/tcp | `frontend_net`, `monitoring_net` | `http://localhost:9090/targets` |
| **cAdvisor** | `quiz_cadvisor` | **8082:8080** | 8080/tcp | `monitoring_net` | `http://localhost:8082` |
| **Grafana Dashboard** | `quiz_grafana` | **3000:3000** | 3000/tcp | `monitoring_net` | `http://localhost:3000` |

---

## 4. Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu tiên quyết:
*   Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/) (hỗ trợ Docker Compose v2).
*   Đã cài đặt [Git](https://git-scm.com/).

### Các bước thực hiện:

1.  **Clone mã nguồn từ GitHub:**
    ```bash
    git clone https://github.com/dtc245200049-NguyenVietDung/dtc245200049-mon-trien-khai.git
    cd dtc245200049-mon-trien-khai
    ```

2.  **Khởi tạo cấu hình biến môi trường:**
    Sao chép tệp mẫu `.env.example` thành `.env`:
    ```bash
    cp .env.example .env
    ```

3.  **Khởi chạy toàn bộ hệ sinh thái bằng Docker Compose:**
    ```bash
    docker compose up -d --build
    ```

4.  **Kiểm tra trạng thái các container:**
    ```bash
    docker compose ps
    ```
    Toàn bộ 7 dịch vụ phải hiển thị trạng thái `Up` (và `quiz_db` ở trạng thái `healthy`).

---

## 5. Hướng Dẫn Truy Cập & Kiểm Thử

### 5.1. Ứng dụng Web & Quản trị CSDL:
*   **Trang chủ thi trắc nghiệm:** Truy cập `http://localhost/`
    *   Nhập mã sinh viên và họ tên để tiến hành làm bài thi trắc nghiệm.
    *   Hệ thống tự động chấm điểm và lưu kết quả vào CSDL MySQL.
*   **Trang quản trị CSDL phpMyAdmin:** Truy cập `http://localhost/phpmyadmin/`
    *   **Server:** `quiz_db`
    *   **Username:** `quiz_user` (hoặc `root`)
    *   **Password:** Xem trong tệp `.env` (`Quiz#Sec2026!Deploy` hoặc `Root#SecurePass2026!Dtc`)
    *   Kiểm tra bảng `questions` (câu hỏi) và `quiz_results` (kết quả nộp bài).
*   **Kiểm tra Security Headers qua Terminal:**
    ```bash
    curl -i http://localhost/health
    ```
*   **Kiểm tra quyền hạn Non-Root Container:**
    ```bash
    docker compose exec quiz_app id
    ```
    Kết quả trả về: `uid=1000(node) gid=1000(node)`

### 5.2. Hệ thống Giám sát Hệ thống (Monitoring Stack):
*   **Prometheus Targets:** Truy cập `http://localhost:9090/targets`
    *   Xác nhận 3 targets (`cadvisor`, `prometheus`, `quiz_app`) đều hiển thị trạng thái xanh `UP`.
*   **Grafana Dashboard:** Truy cập `http://localhost:3000`
    *   Dashboard tự động tải sẵn tại mục **Dashboards $\rightarrow$ Quiz System $\rightarrow$ Quiz System - Container & Application Metrics**.
    *   Theo dõi trực quan thời gian thực: CPU Usage %, RAM Usage, Network I/O, và Node.js Heap Memory.
*   **cAdvisor UI:** Truy cập `http://localhost:8082` để quan sát số đo tài nguyên chi tiết của Docker host.

---

## 6. Lộ Trình 3 Mốc Commit Giảng Viên Quy Định
*   **Mốc 1 (Commit 1):** Khởi tạo hạ tầng Docker Compose, Web Quiz, CSDL MySQL cô lập, Nginx Reverse Proxy và Hardening bảo mật.
*   **Mốc 2 (Commit 2):** Tích hợp hệ thống giám sát Prometheus + cAdvisor + Grafana Dashboard.
*   **Mốc 3 (Commit 3):** Tích hợp hệ thống ghi log tập trung Loki + Promtail + LogQL + Hoàn thiện Báo cáo học thuật 10 trang.


---
© 2026 Nguyễn Viết Dũng - DTC245200049. Học phần Triển khai và Quản trị Hệ thống Phần mềm.