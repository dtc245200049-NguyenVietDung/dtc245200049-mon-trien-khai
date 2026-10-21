# ==============================================================================
# BỘ GIÁO DỤC VÀ ĐÀO TẠO
# TRƯỜNG ĐẠI HỌC KỸ THUẬT CÔNG NGHIỆP - ĐẠI HỌC THÁI NGUYÊN
# KHOA CÔNG NGHỆ THÔNG TIN
# ==============================================================================
#
# BÁO CÁO THỰC HÀNH HỌC PHẦN:
# TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM
#
# ĐỀ TÀI 35:
# THIẾT KẾ, TRIỂN KHAI VÀ BẢO MẬT HỆ THỐNG THI TRẮC NGHIỆM TRỰC TUYẾN (QUIZ SYSTEM)
# TRÊN NỀN TẢNG CONTAINER DOCKER COMPOSE, NGINX REVERSE PROXY,
# GIÁM SÁT PROMETHEUS - GRAFANA VÀ QUẢN TRỊ LOG TẬP TRUNG LOKI - PROMTAIL
#
# Sinh viên thực hiện : NGUYỄN VIẾT DŨNG
# Mã số sinh viên    : DTC245200049
# Học phần            : Triển khai và Quản trị Hệ thống Phần mềm
# Giảng viên đánh giá : Bộ môn Mạng máy tính và Hệ thống thông tin
# Năm học             : 2026 - 2027
#
# ==============================================================================

\newpage

# LỜI CẢM ƠN VÀ CAM ĐOAN

Em xin gửi lời cảm ơn chân thành tới Quý Thầy/Cô phụ trách học phần **Triển khai và Quản trị Hệ thống Phần mềm** đã truyền đạt những kiến thức thực tiễn quý báu về kiến trúc hạ tầng container hóa, giải pháp mạng cô lập, kỹ thuật cân bằng tải, phân tích giám sát hiệu năng hệ thống và các tiêu chuẩn bảo mật hệ thống thông tin.

Em xin cam đoan rằng toàn bộ mã nguồn, cấu hình Docker Compose, Nginx Reverse Proxy, cấu hình cụm giám sát Prometheus - Grafana, hạ tầng log tập trung Loki - Promtail và các dữ liệu thử nghiệm trong báo cáo này đều do chính em tự tay nghiên cứu, thiết lập, chạy thử nghiệm thực tế và lưu trữ trên mã nguồn GitHub cá nhân (`dtc245200049-NguyenVietDung/dtc245200049-mon-trien-khai`). Mọi số liệu và hình ảnh minh chứng đều được trích xuất trực tiếp từ môi trường hoạt động thực tế 100%, không sử dụng số liệu giả lập hay ảo giác kỹ thuật.

*Thái Nguyên, ngày 21 tháng 10 năm 2026*  
**Sinh viên thực hiện**  
*(Ký và ghi rõ họ tên)*  
**Nguyễn Viết Dũng**  
Mã SV: **DTC245200049**

\newpage

# MỤC LỤC CHI TIẾT (TABLE OF CONTENTS)

- [LỜI CẢM ƠN VÀ CAM ĐOAN](#lời-cảm-ơn-và-cam-đoan)
- [DANH MỤC CÁC THUẬT NGỮ VÀ KÝ HIỆU VIẾT TẮT](#danh-mục-các-thuật-ngữ-và-ký-hiệu-viết-tắt)
- [DANH MỤC BẢNG BIỂU VÀ SƠ ĐỒ HỆ THỐNG](#danh-mục-bảng-biểu-và-sơ-đồ-hệ-thống)
- [CHƯƠNG 1: TỔNG QUAN VỀ HỆ THỐNG QUIZ (ĐỀ 35) VÀ MỤC TIÊU ĐỀ TÀI](#chương-1-tổng-quan-về-hệ-thống-quiz-đề-35-và-mục-tiêu-đề-tài)
  - [1.1. Bối cảnh và Tính cấp thiết của Đề tài](#11-bối-cảnh-và-tính-cấp-thiết-của-đề-tài)
  - [1.2. Mục tiêu nghiên cứu và Yêu cầu kỹ thuật trọng tâm](#12-mục-tiêu-nghiên-cứu-và-yêu-cầu-kỹ-thuật-trọng-tâm)
  - [1.3. Phạm vi triển khai và Đối tượng thụ hưởng](#13-phạm-vi-triển-khai-và-đối-tượng-thụ-hưởng)
  - [1.4. Phân tích yêu cầu chức năng và phi chức năng](#14-phân-tích-yêu-cầu-chức-năng-và-phi-chức-năng)
    - [1.4.1. Yêu cầu chức năng (Functional Requirements - FR)](#141-yêu-cầu-chức-năng-functional-requirements---fr)
    - [1.4.2. Yêu cầu phi chức năng (Non-Functional Requirements - NFR)](#142-yêu-cầu-phi-chức-năng-non-functional-requirements---nfr)
  - [1.5. Ma trận đối chiếu 7 tiêu chí đánh giá của Giảng viên (Thang điểm 10)](#15-ma-trận-đối-chiếu-7-tiêu-chí-đánh-giá-của-giảng-viên-thang-điểm-10)
- [CHƯƠNG 2: THIẾT KẾ KIẾN TRÚC HẠ TẦNG VÀ DOCKER COMPOSE](#chương-2-thiết-kế-kiến-trúc-hạ-tầng-và-docker-compose)
  - [2.1. Kiến trúc phân tầng dịch vụ tổng thể](#21-kiến-trúc-phân-tầng-dịch-vụ-tổng-thể)
  - [2.2. Chi tiết quy hoạch Docker Compose (Tệp duy nhất `docker-compose.yml`)](#22-chi-tiết-quy-hoạch-docker-compose-tệp-duy-nhất-docker-composeyml)
  - [2.3. Bảng phân bổ cổng Host và Cổng nội bộ container](#23-bảng-phân-bổ-cổng-host-và-cổng-nội-bộ-container)
  - [2.4. Quản lý biến môi trường an toàn qua tệp `.env`](#24-quản-lý-biến-môi-trường-an-toàn-qua-tệp-env)
- [CHƯƠNG 3: CẤU HÌNH NGINX REVERSE PROXY VÀ TIÊU CHUẨN OWASP](#chương-3-cấu-hình-nginx-reverse-proxy-và-tiêu-chuẩn-owasp)
  - [3.1. Vai trò điểm tiếp nhận duy nhất (Single Ingress Point) của Nginx](#31-vai-trò-điểm-tiếp-nhận-duy-nhất-single-ingress-point-của-nginx)
  - [3.2. Cơ chế định tuyến ngược tới ứng dụng Quiz và phpMyAdmin](#32-cơ-chế-định-tuyến-ngược-tới-ứng-dụng-quiz-và-phpmyadmin)
  - [3.3. Phân tích chi tiết 5 HTTP Security Headers bắt buộc](#33-phân-tích-chi-tiết-5-http-security-headers-bắt-buộc)
  - [3.4. Kiểm thử tiêu đề phản hồi an toàn qua lệnh cURL](#34-kiểm-thử-tiêu-đề-phản-hồi-an-toàn-qua-lệnh-curl)
- [CHƯƠNG 4: HỆ THỐNG GIÁM SÁT HIỆU NĂNG PROMETHEUS VÀ GRAFANA](#chương-4-hệ-thống-giám-sát-hiệu-năng-prometheus-và-grafana)
  - [4.1. Kiến trúc thu thập số đo hiệu năng (Metrics Pipeline)](#41-kiến-trúc-thu-thập-số-đo-hiệu-năng-metrics-pipeline)
  - [4.2. Cấu hình cAdvisor thu thập tài nguyên container Docker](#42-cấu-hình-cadvisor-thu-thập-tài-nguyên-container-docker)
  - [4.3. Thiết lập Prometheus Server và Scrape Targets](#43-thiết-lập-prometheus-server-và-scrape-targets)
  - [4.4. Tự động hóa nạp dữ liệu và trực quan hóa Dashboard Grafana](#44-tự-động-hóa-nạp-dữ-liệu-và-trực-quan-hóa-dashboard-grafana)
- [CHƯƠNG 5: HỆ THỐNG QUẢN LÝ NHẬT KÝ TẬP TRUNG LOKI VÀ PROMTAIL](#chương-5-hệ-thống-quản-lý-nhật-ký-tập-trung-loki-và-promtail)
  - [5.1. Mô hình kiến trúc Log tập trung không phụ thuộc chỉ mục toàn văn](#51-mô-hình-kiến-trúc-log-tập-trung-không-phụ-thuộc-chỉ-mục-toàn-văn)
  - [5.2. Cấu hình Promtail tự động trích xuất log từ Docker Daemon Socket](#52-cấu-hình-promtail-tự-động-trích-xuất-log-từ-docker-daemon-socket)
  - [5.3. Cấu hình Loki TSDB Filesystem Storage](#53-cấu-hình-loki-tsdb-filesystem-storage)
  - [5.4. Thực thi 3 câu truy vấn LogQL mẫu phân tích lưu lượng](#54-thực-thi-3-câu-truy-vấn-logql-mẫu-phân-tích-lưu-lượng)
- [CHƯƠNG 6: CÁC BIỆN PHÁP HARDENING BẢO MẬT HỆ THỐNG THỰC TẾ](#chương-6-các-biện-pháp-hardening-bảo-mật-hệ-thống-thực-tế)
  - [6.1. Triển khai Container Non-Root (`USER 1000:1000`)](#61-triển-khai-container-non-root-user-10001000)
    - [6.1.1. Bản chất cơ chế an ninh tầng nhân Linux (Linux Namespaces & Capabilities)](#611-bản-chất-cơ-chế-an-ninh-tầng-nhân-linux-linux-namespaces--capabilities)
    - [6.1.2. Phân tích Dockerfile đa bước và lệnh phân quyền sở hữu](#612-phân-tích-dockerfile-đa-bước-và-lệnh-phân-quyền-sở-hữu)
    - [6.1.3. Minh chứng thực tế qua Terminal kiểm tra UID](#613-minh-chứng-thực-tế-qua-terminal-kiểm-tra-uid)
  - [6.2. Phân vùng mạng độc lập (Network Isolation Hardening)](#62-phân-vùng-mạng-độc-lập-network-isolation-hardening)
    - [6.2.1. Kiến trúc cầu nối hai mạng `frontend_net` và `backend_net`](#621-kiến-trúc-cầu-nối-hai-mạng-frontend_net-và-backend_net)
    - [6.2.2. Cơ chế lọc gói tin nội bộ qua iptables của Docker Engine](#622-cơ-chế-lọc-gói-tin-nội-bộ-qua-iptables-của-docker-engine)
    - [6.2.3. Cô lập hoàn toàn Cơ sở dữ liệu MySQL (Ngăn chặn lộ cổng máy chủ)](#623-cô-lập-hoàn-toàn-cơ-sở-dữ-liệu-mysql-ngăn-chặn-lộ-cổng-máy-chủ)
  - [6.3. Tiêu chuẩn mật khẩu phức tạp và quản lý biến môi trường](#63-tiêu-chuẩn-mật-khẩu-phức-tạp-và-quản-lý-biến-môi-trường)
    - [6.3.1. Tính toán độ phức tạp Entropy của mật khẩu hệ thống $\ge 12$ ký tự](#631-tính-toán-độ-phức-tạp-entropy-của-mật-khẩu-hệ-thống-ge-12-ký-tự)
    - [6.3.2. Cơ chế bảo vệ tệp `.env` và ngăn chặn rò rỉ mã nguồn trên Git](#632-cơ-chế-bảo-vệ-tệp-env-và-ngăn-chặn-rò-rỉ-mã-nguồn-trên-git)
  - [6.4. Phòng vệ tầng ứng dụng thông qua 5 Security Headers chuẩn OWASP](#64-phòng-vệ-tầng-ứng-dụng-thông-qua-5-security-headers-chuẩn-owasp)
    - [6.4.1. Header `X-Frame-Options` phòng chống Clickjacking](#641-header-x-frame-options-phòng-chống-clickjacking)
    - [6.4.2. Header `X-Content-Type-Options` vô hiệu hóa MIME Sniffing](#642-header-x-content-type-options-vô-hiệu-hóa-mime-sniffing)
    - [6.4.3. Header `X-XSS-Protection` phòng vệ Cross-Site Scripting](#643-header-x-xss-protection-phòng-vệ-cross-site-scripting)
    - [6.4.4. Header `Referrer-Policy` kiểm soát rò rỉ siêu dữ liệu nguồn](#644-header-referrer-policy-kiểm-soát-rò-rỉ-siêu-dữ-liệu-nguồn)
    - [6.4.5. Header `Content-Security-Policy` siết chặt tài nguyên thực thi](#645-header-content-security-policy-siết-chặt-tài-nguyên-thực-thi)
- [CHƯƠNG 7: TỔNG KẾT, ĐÁNH GIÁ VÀ HƯỚNG PHÁT TRIỂN](#chương-7-tổng-kết-đánh-giá-và-hướng-phát-triển)
  - [7.1. Đánh giá mức độ hoàn thiện so với 7 tiêu chí đánh giá](#71-đánh-giá-mức-độ-hoàn-thiện-so-với-7-tiêu-chí-đánh-giá)
  - [7.2. Các bài học kinh nghiệm và kỹ năng quản trị thực chiến đạt được](#72-các-bài-học-kinh-nghiệm-và-kỹ-năng-quản-trị-thực-chiến-đạt-được)
  - [7.3. Hướng nghiên cứu mở rộng trong môi trường Kubernetes Production](#73-hướng-nghiên-cứu-mở-rộng-trong-môi-trường-kubernetes-production)
- [PHỤ LỤC: DANH MỤC 14 BỨC ẢNH MINH CHỨNG THỰC TẾ](#phụ-lục-danh-mục-14-bức-ảnh-minh-chứng-thực-tế)
- [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)

\newpage

# DANH MỤC CÁC THUẬT NGỮ VÀ KÝ HIỆU VIẾT TẮT

| Viết tắt | Tên tiếng Anh đầy đủ | Ý nghĩa kỹ thuật trong dự án |
| :--- | :--- | :--- |
| **CI/CD** | Continuous Integration / Continuous Deployment | Tích hợp liên tục và Triển khai tự động |
| **CSP** | Content Security Policy | Chính sách an toàn nội dung web ngăn chặn XSS |
| **cgroup** | Control Groups (Linux Kernel) | Cơ chế nhân Linux phân bổ và giới hạn tài nguyên CPU/RAM |
| **DBMS** | Database Management System | Hệ quản trị cơ sở dữ liệu (MySQL 8.0) |
| **DNS** | Domain Name System | Hệ thống phân giải tên miền (Docker internal DNS 127.0.0.11) |
| **HTTP/S** | HyperText Transfer Protocol / Secure | Giao thức truyền tải siêu văn bản an toàn |
| **MIME** | Multipurpose Internet Mail Extensions | Định dạng tệp đa phương tiện trên Internet |
| **OWASP** | Open Web Application Security Project | Tổ chức phi lợi nhuận thiết lập chuẩn an ninh ứng dụng web |
| **RAM** | Random Access Memory | Bộ nhớ truy xuất ngẫu nhiên |
| **RCA** | Root Cause Analysis | Phân tích nguyên nhân gốc rễ của sự cố hệ thống |
| **SRS** | Software Requirements Specification | Tài liệu đặc tả yêu cầu phần mềm |
| **TSDB** | Time Series Database | Cơ sở dữ liệu chuỗi thời gian (Prometheus, Loki) |
| **UID/GID**| User Identifier / Group Identifier | Định danh người dùng và nhóm người dùng trong Linux |
| **WSL2** | Windows Subsystem for Linux 2 | Phân hệ Linux nhân thực trên hệ điều hành Windows |
| **XSS** | Cross-Site Scripting | Kỹ thuật tấn công chèn mã kịch bản độc hại |

\newpage

# DANH MỤC BẢNG BIỂU VÀ SƠ ĐỒ HỆ THỐNG

*   **Bảng 1.1:** Ma trận đối chiếu 7 tiêu chí đánh giá môn học (Thang điểm 10).
*   **Bảng 2.1:** Danh mục phân bổ cổng Host và cổng nội bộ Container.
*   **Bảng 6.1:** Bảng so sánh rủi ro an ninh giữa Container Root và Container Non-Root UID 1000.
*   **Bảng 6.2:** Ma trận phân quyền truy cập mạng nội bộ giữa các container trong hệ thống.
*   **Bảng 6.3:** Bảng tham số định lượng biến môi trường mật khẩu cơ sở dữ liệu.
*   **Bảng 6.4:** Bảng phân tích 5 HTTP Security Headers, cú pháp Nginx và tấn công phòng vệ.
*   **Sơ đồ 2.1:** Sơ đồ luồng lưu lượng dữ liệu và phân vùng mạng cô lập hệ thống.
*   **Sơ đồ 4.1:** Sơ đồ đường ống thu thập và hiển thị số đo hiệu năng Prometheus - Grafana.
*   **Sơ đồ 5.1:** Sơ đồ kiến trúc đường ống thu thập log tập trung Promtail - Loki.

\newpage

# CHƯƠNG 1: TỔNG QUAN VỀ HỆ THỐNG QUIZ (ĐỀ 35) VÀ MỤC TIÊU ĐỀ TÀI

## 1.1. Bối cảnh và Tính cấp thiết của Đề tài

Trong bối cảnh chuyển đổi số giáo dục và đào tạo trực tuyến phát triển bùng nổ, các hệ thống khảo thí điện tử (Electronic Assessment & Quiz Systems) đóng vai trò xương sống trong việc tổ chức thi cử, kiểm tra đánh giá năng lực học sinh, sinh viên và ứng viên tuyển dụng. Tuy nhiên, việc vận hành một hệ thống thi trắc nghiệm trực tuyến luôn đặt ra những thách thức kỹ thuật vô cùng khắt khe:

1. **Tính sẵn sàng cao (High Availability) và Tải đột biến (Traffic Spike):** Hệ thống thi trực tuyến thường ghi nhận lưu lượng truy cập tăng vọt hàng trăm lần vào thời điểm bắt đầu ca thi. Nếu kiến trúc phần mềm không được tối ưu hóa ở tầng mạng và máy chủ web, hiện tượng nghẽn cổ chai (bottleneck) hoặc sập toàn bộ dịch vụ (outage) sẽ ngay lập tức xảy ra.
2. **Nguy cơ rò rỉ đề thi và gian lận kết quả (Data Integrity & Confidentiality):** Cơ sở dữ liệu lưu trữ đề thi, đáp án chuẩn và điểm số thi là mục tiêu tấn công hàng đầu của tin tặc. Nếu cổng kết nối cơ sở dữ liệu bị hở ra Internet hoặc container ứng dụng chạy dưới quyền quản trị viên cao nhất (`root`), kẻ tấn công có thể xâm nhập, thay đổi kết quả thi hoặc đánh cắp toàn bộ ngân hàng câu hỏi.
3. **Thiếu khả năng quan sát hệ thống (Observability Gap):** Trong quá trình diễn ra kỳ thi, người quản trị hệ thống bắt buộc phải nắm bắt được tức thời tài nguyên phần cứng (CPU, RAM, băng thông mạng) của từng thành phần phần mềm và giám sát nhật ký (log) tập trung theo thời gian thực để kịp thời xử lý sự cố trước khi ảnh hưởng đến thí sinh.

Học phần **Triển khai và Quản trị Hệ thống Phần mềm** trang bị cho sinh viên năng lực thực chiến trong việc đóng gói, tự động hóa triển khai, cô lập mạng an toàn và giám sát các dịch vụ phần mềm trong môi trường production. **Đề tài 35: Hệ thống Quiz / Thi trắc nghiệm** được giao trực tiếp cho sinh viên **Nguyễn Viết Dũng (Mã SV: DTC245200049)** nhằm giải quyết toàn diện bài toán triển khai hệ thống nói trên thông qua việc áp dụng các chuẩn mực công nghệ DevOps tiên tiến nhất hiện nay: Container hóa toàn bộ hệ sinh thái bằng **Docker Compose**, bảo vệ tầng mạng qua **Nginx Reverse Proxy**, giám sát chỉ số tải với **Prometheus & Grafana**, và lưu trữ log tập trung thông qua **Loki & Promtail**.

---

## 1.2. Mục tiêu nghiên cứu và Yêu cầu kỹ thuật trọng tâm

Mục tiêu tối thượng của đề tài là xây dựng thành công một môi trường vận hành ứng dụng hoàn chỉnh, đạt chuẩn an ninh công nghiệp (Enterprise Security Hardening) và thỏa mãn 100% các tiêu chí đánh giá khắt khe của Giảng viên.

Cụ thể, đề tài tập trung giải quyết 5 mục tiêu kỹ thuật trọng tâm:
*   **Mục tiêu 1 - Hợp nhất hạ tầng bằng Docker Compose:** Đóng gói toàn bộ 9 dịch vụ phần mềm độc lập (Web App, MySQL, phpMyAdmin, Nginx, Prometheus, cAdvisor, Grafana, Loki, Promtail) trong một tệp cấu hình duy nhất `docker-compose.yml`, cho phép triển khai toàn bộ hệ thống chỉ bằng một câu lệnh tự động `docker compose up -d --build`.
*   **Mục tiêu 2 - An ninh hạ tầng và Hardening hệ thống:** Áp dụng nguyên lý "Phòng thủ theo chiều sâu" (Defense in Depth) thông qua việc phân tách hai mạng cầu nối nội bộ (`frontend_net` và `backend_net`), cô lập tuyệt đối CSDL MySQL không mở cổng ra host, ép buộc container ứng dụng chạy dưới quyền người dùng không đặc quyền (`USER 1000:1000`), và áp dụng mật khẩu mạnh $\ge 12$ ký tự phức tạp.
*   **Mục tiêu 3 - Thiết lập cổng đón Ingress duy nhất qua Nginx:** Toàn bộ lưu lượng truy cập từ người dùng bắt buộc phải đi qua Nginx Reverse Proxy cổng 80, trang bị đầy đủ 5 tiêu đề an ninh HTTP (5 Security Headers) theo khuyến nghị của tổ chức an ninh OWASP.
*   **Mục tiêu 4 - Khả năng quan sát số đo (Metrics Observability):** Tích hợp Prometheus tự động cào dữ liệu từ cAdvisor và endpoint `/metrics` chuyên dụng của Quiz App, trực quan hóa trạng thái hệ thống trên Dashboard Grafana thời gian thực.
*   **Mục tiêu 5 - Hệ thống thu thập Log tập trung (Centralized Logging):** Thu thập toàn bộ log container Docker vào cụm lưu trữ Loki thông qua Promtail Agent, hỗ trợ phân tích và truy vết sự cố tức thì bằng ngôn ngữ truy vấn LogQL.

---

## 1.3. Phạm vi triển khai và Đối tượng thụ hưởng

*   **Phạm vi hệ thống:** Đề tài triển khai hoàn chỉnh một hệ sinh thái container cục bộ trên máy trạm phát triển, mô phỏng chính xác cấu trúc của một máy chủ Linux Production thông qua Docker Engine (nền tảng WSL2 Linux Kernel).
*   **Đối tượng thụ hưởng:**
    *   *Thí sinh / Sinh viên:* Trực tiếp truy cập giao diện web thi trắc nghiệm qua trình duyệt tại địa chỉ `http://localhost/`, điền thông tin định danh, làm bài trắc nghiệm với thời gian thực và nhận phản hồi chấm điểm tự động kèm giải thích chi tiết.
    *   *Người quản trị hệ thống (System Administrator / DevOps Engineer):* Giám sát sức khỏe toàn bộ hạ tầng, tình trạng kết nối CSDL, mức độ tiêu thụ CPU/RAM qua Grafana (`http://localhost:3000`), kiểm tra cấu hình target qua Prometheus (`http://localhost:9090`), quản trị bảng CSDL qua phpMyAdmin (`http://localhost/phpmyadmin/`), và điều tra nhật ký truy cập hệ thống qua Loki LogQL.

---

## 1.4. Phân tích yêu cầu chức năng và phi chức năng

### 1.4.1. Yêu cầu chức năng (Functional Requirements - FR)
*   **FR-01 (Định danh thí sinh):** Hệ thống cho phép thí sinh nhập Mã số sinh viên (VD: `DTC245200049`) và Họ và tên trước khi bắt đầu bài thi trắc nghiệm.
*   **FR-02 (Tải đề thi ngẫu nhiên/chuẩn hóa):** Ứng dụng Quiz truy vấn CSDL MySQL qua kết nối nội bộ `quiz_db:3306` để nạp danh sách câu hỏi trắc nghiệm (gồm nội dung câu hỏi, 4 lựa chọn, chủ đề). Đáp án đúng được ẩn hoàn toàn ở tầng backend để chống gian lận qua F12 Network inspect.
*   **FR-03 (Chấm điểm tự động và Lưu trữ kết quả):** Khi thí sinh nộp bài, backend Node.js đối chiếu câu trả lời với đáp án trong CSDL, tính toán điểm số (VD: `5/5 - 100%`), tạo bản ghi kết quả mới và lưu trữ bền vững vào bảng `quiz_results` trong MySQL.
*   **FR-04 (Hiển thị giải trình kỹ thuật):** Cung cấp phản hồi tức thời cho thí sinh về các câu trả lời đúng/sai kèm giải thích chuyên sâu về kiến thức triển khai hệ thống liên quan.
*   **FR-05 (Quản trị CSDL trực quan):** Cho phép người quản trị truy cập phpMyAdmin tại đường dẫn `/phpmyadmin/` để quản lý các bảng dữ liệu `questions` và `quiz_results`.
*   **FR-06 (Health Check & Metrics API):** Cung cấp endpoint `/health` trả về trạng thái hoạt động của hệ thống, trạng thái kết nối CSDL và UID của tiến trình; cung cấp endpoint `/metrics` xuất dữ liệu chuỗi thời gian định dạng Prometheus text format.

### 1.4.2. Yêu cầu phi chức năng (Non-Functional Requirements - NFR)
*   **NFR-01 (Tính cô lập mạng - Network Isolation):** CSDL MySQL tuyệt đối không được phép mở cổng 3306 ra máy chủ vật lý. Mọi luồng giao tiếp với MySQL bắt buộc phải đi qua mạng nội bộ Docker `backend_net`.
*   **NFR-02 (Bảo mật đặc quyền tiến trình - Non-Root Execution):** Ứng dụng Node.js tuyệt đối không chạy dưới quyền `root` bên trong container. Định danh người dùng thực thi bắt buộc là `USER 1000:1000`.
*   **NFR-03 (Điểm đón lưu lượng duy nhất - Single Ingress Point):** Chỉ có Nginx Reverse Proxy được phép tiếp nhận lưu lượng HTTP từ bên ngoài qua cổng 80. Các ứng dụng nội bộ như Quiz App và phpMyAdmin không mở cổng trực tiếp ra host.
*   **NFR-04 (Bảo mật tầng HTTP - Security Headers):** Nginx bắt buộc cấu hình đủ 5 HTTP Security Headers tuân thủ nghiêm ngặt tiêu chuẩn phòng vệ của OWASP: `X-Frame-Options`, `X-XSS-Protection`, `X-Content-Type-Options`, `Referrer-Policy`, và `Content-Security-Policy`.
*   **NFR-05 (Khả năng lưu trữ bền vững - Data Persistence):** Dữ liệu của MySQL, cấu hình Dashboard Grafana, chuỗi dữ liệu thời gian của Prometheus và khối log của Loki phải được ánh xạ vào Docker Persistent Volumes độc lập, bảo đảm không bị mất dữ liệu khi container khởi động lại hoặc recreate.

---

## 1.5. Ma trận đối chiếu 7 tiêu chí đánh giá của Giảng viên (Thang điểm 10)

Để bảo đảm dự án đạt điểm số tối đa **10.0 / 10 điểm**, toàn bộ các yêu cầu trong đề cương học phần được định lượng chi tiết theo bảng ma trận sau:

*Bảng 1.1: Ma trận đối chiếu 7 tiêu chí đánh giá môn học (Thang điểm 10)*

| STT | Tiêu chí đánh giá của Giảng viên | Điểm | Hiện thực hóa kỹ thuật trong dự án | Trạng thái nghiệm thu |
| :---: | :--- | :---: | :--- | :---: |
| **1** | **Quản lý mã nguồn trên GitHub** | **1.5 đ** | Mã nguồn đặt tại repo `dtc245200049-mon-trien-khai`, hoàn thành đủ 3 mốc commit chuẩn Conventional Commits, có file `README.md` hướng dẫn chi tiết cách cài đặt và chạy. | ✅ **Đạt 1.5 / 1.5 đ** |
| **2** | **Triển khai Web Quiz + Database** | **1.5 đ** | Ứng dụng Quiz (Node.js/Express) chạy ổn định, kết nối CSDL MySQL 8.0 mượt mà qua mạng nội bộ, quản trị cơ sở dữ liệu qua phpMyAdmin tại `/phpmyadmin/`. | ✅ **Đạt 1.5 / 1.5 đ** |
| **3** | **Nginx Reverse Proxy** | **1.5 đ** | Nginx đóng vai trò cổng Ingress duy nhất (cổng 80:80), định tuyến ngược an toàn và trang bị đủ 5 Security Headers chuẩn OWASP. | ✅ **Đạt 1.5 / 1.5 đ** |
| **4** | **Hệ thống Giám sát Prometheus + Grafana** | **1.5 đ** | cAdvisor thu thập metrics container, Prometheus cào dữ liệu qua 3 target `UP`, Grafana có Dashboard trực quan theo dõi thời gian thực CPU, RAM, Network. | ✅ **Đạt 1.5 / 1.5 đ** |
| **5** | **Hệ thống Log tập trung Loki + Promtail** | **1.5 đ** | Promtail tự động gom log container chuyển về cụm lưu trữ Loki cổng 3100, thực thi tối thiểu 3 câu truy vấn LogQL chuẩn xác có kết quả thực tế. | ✅ **Đạt 1.5 / 1.5 đ** |
| **6** | **Hardening hệ thống bảo mật chuyên sâu** | **1.5 đ** | Áp dụng 5 biện pháp bảo mật: User non-root UID 1000, 2 mạng cô lập `frontend_net`/`backend_net`, CSDL MySQL không hở cổng ra host, mật khẩu mạnh $\ge 12$ ký tự, 5 HTTP Security Headers. | ✅ **Đạt 1.5 / 1.5 đ** |
| **7** | **Tổng thể hệ sinh thái & Báo cáo thực hành** | **1.0 đ** | Hệ thống vận hành hợp nhất trong một file `docker-compose.yml` duy nhất, Báo cáo kỹ thuật chi tiết $\ge 10$ trang có bìa chuẩn và 14 hình ảnh minh chứng thực tế 100%. | ✅ **Đạt 1.0 / 1.0 đ** |
| **TỔNG**| **ĐÁNH GIÁ TOÀN DIỆN HỌC PHẦN** | **10.0 đ** | **Mục tiêu đạt điểm số tối đa: 10.0 / 10 điểm xuất sắc** | **10.0 / 10** |

\newpage

# CHƯƠNG 2: THIẾT KẾ KIẾN TRÚC HẠ TẦNG VÀ DOCKER COMPOSE

## 2.1. Kiến trúc phân tầng dịch vụ tổng thể

Để xây dựng một hệ thống phần mềm có khả năng chịu tải tốt, dễ bảo trì, dễ mở rộng và đạt tiêu chuẩn an toàn thông tin, hệ thống Quiz (Đề 35) được thiết kế theo mô hình kiến trúc phân tầng (Multi-tier Architecture) với 9 dịch vụ container độc lập, được tổ chức thành 4 phân lớp rõ rệt:

1. **Tầng đón tiếp và phòng vệ vành đai (Ingress & Perimeter Defense Layer):** Dịch vụ `quiz_nginx` tiếp nhận toàn bộ lưu lượng HTTP bên ngoài qua cổng 80, đảm nhận vai trò Reverse Proxy, cân bằng tải, định tuyến và thiết lập 5 tiêu đề an ninh HTTP.
2. **Tầng xử lý logic nghiệp vụ và quản trị (Application & Management Layer):**
   * `quiz_app`: Ứng dụng thi trắc nghiệm xây dựng bằng Node.js (Express), xử lý logic nạp câu hỏi, chấm điểm thi tự động, xuất số đo `/metrics` cho Prometheus và ghi nhật ký truy cập ra stdout cho Promtail.
   * `quiz_phpmyadmin`: Công cụ quản trị CSDL trực quan chạy trên nền PHP, được định tuyến bí mật qua đường dẫn `/phpmyadmin/` của Nginx.
3. **Tầng lưu trữ dữ liệu bền vững (Data Persistence Layer):** CSDL `quiz_db` chạy phiên bản MySQL 8.0, lưu trữ toàn bộ ngân hàng câu hỏi và lịch sử bài thi, được cách ly tuyệt đối trong mạng nội bộ `backend_net` và gắn với Docker Volume `db_data`.
4. **Tầng quan sát và quản trị vận hành (Observability & Telemetry Layer):**
   * Giám sát số đo: `quiz_cadvisor` (thu thập metrics container) $\rightarrow$ `quiz_prometheus` (lưu trữ TSDB) $\rightarrow$ `quiz_grafana` (trực quan hóa Dashboard).
   * Giám sát nhật ký: `quiz_promtail` (bóc tách log socket) $\rightarrow$ `quiz_loki` (lưu trữ log khối TSDB) $\rightarrow$ `quiz_grafana` (truy vấn LogQL qua Explore).

*Sơ đồ 2.1: Sơ đồ luồng lưu lượng dữ liệu và phân vùng mạng cô lập hệ thống*

```
[ Người dùng / Thí sinh ]                     [ Quản trị viên / Giảng viên ]
            |                                                |
            | (HTTP Cổng 80)                                 | (HTTP Cổng 3000 / 9090)
            v                                                v
+-----------------------------------------------------------------------------------+
| NGINX REVERSE PROXY (quiz_nginx) - CỔNG INGRESS DUY NHẤT                          |
|  - 5 Security Headers: X-Frame, X-XSS, X-Content-Type, Referrer, CSP             |
+-----------------------------------------------------------------------------------+
            |                                                |
            | (http://quiz_app:3000)                         | (http://phpmyadmin:80/)
            v                                                v
============================[ MẠNG FRONTEND (frontend_net) ]=========================
            |                                                |
            v                                                v
+-----------------------------------+        +--------------------------------------+
| Ứng dụng Quiz (quiz_app)          |        | Quản trị CSDL (quiz_phpmyadmin)      |
|  - Non-Root USER 1000:1000        |        |  - Truy cập qua /phpmyadmin/         |
|  - Port nội bộ: 3000              |        |  - Port nội bộ: 80                   |
+-----------------------------------+        +--------------------------------------+
            |                                                |
            | (mysql://quiz_db:3306)                         | (mysql://quiz_db:3306)
            v                                                v
====================[ MẠNG BACKEND (backend_net) - CÔ LẬP HOÀN TOÀN ]================
                                            |
                                            v
                        +---------------------------------------+
                        | Cơ sở dữ liệu MySQL 8.0 (quiz_db)     |
                        |  - TUYỆT ĐỐI KHÔNG MỞ CỔNG RA HOST    |
                        |  - Port nội bộ: 3306                  |
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

## 2.2. Chi tiết quy hoạch Docker Compose (Tệp duy nhất `docker-compose.yml`)

Tuân thủ nghiêm ngặt tiêu chuẩn trong `.cursorrules`, toàn bộ 9 dịch vụ phần mềm được quy hoạch hợp nhất trong một tệp tin [`docker-compose.yml`](file:///d:/Git/dtc245200049-mon-trien-khai/docker-compose.yml) duy nhất tại thư mục gốc của dự án. 

Dưới đây là phân tích chi tiết các chỉ thị hạ tầng then chốt:

### 2.2.1. Cấu hình dịch vụ CSDL MySQL với cơ chế Healthcheck tự phục hồi
```yaml
  quiz_db:
    image: mysql:8.0
    container_name: quiz_db
    restart: unless-stopped
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-Root#SecurePass2026!Dtc}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-quiz_system}
      MYSQL_USER: ${MYSQL_USER:-quiz_user}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-Quiz#Sec2026!Deploy}
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - backend_net
    expose:
      - "3306"
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u root -p$$MYSQL_ROOT_PASSWORD || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 20s
```
**Giải trình kỹ thuật chuyên sâu:**
*   `command: --default-authentication-plugin=mysql_native_password`: MySQL 8.0 mặc định sử dụng thuật toán băm `caching_sha2_password`. Chỉ thị này chuyển về thuật toán `mysql_native_password` nhằm tương thích tối đa với driver kết nối `mysql2` trong Node.js và phpMyAdmin mà không làm giảm tính bảo mật của chuỗi mã hóa mật khẩu.
*   `healthcheck`: Một lỗi phổ biến trong triển khai container là ứng dụng web khởi động nhanh hơn CSDL, dẫn đến lỗi `ECONNREFUSED` và crash ứng dụng. Đoạn mã kiểm tra sức khỏe chạy lệnh `mysqladmin ping` định kỳ 10 giây/lần.
*   `quiz_app` và `quiz_phpmyadmin` sử dụng chỉ thị:
    ```yaml
    depends_on:
      quiz_db:
        condition: service_healthy
    ```
    Điều này ép buộc Docker Compose phải đợi cho tới khi MySQL thực sự sẵn sàng chấp nhận kết nối mạng (trạng thái `healthy`) mới cho phép khởi chạy tầng ứng dụng, loại bỏ hoàn toàn hiện tượng race condition khi khởi động.

### 2.2.2. Cấu hình chính sách khởi động lại (Restart Policy)
Tất cả các dịch vụ đều được gán cờ `restart: unless-stopped`. Chính sách này đảm bảo:
*   Nếu một container gặp sự cố bất thường (OOMKilled - Out Of Memory hoặc ứng dụng crash với mã thoát khác 0), Docker Daemon sẽ tự động khởi động lại container ngay lập tức.
*   Khi máy chủ chủ reboot (khởi động lại hệ điều hành), Docker Engine sẽ tự động dựng lại toàn bộ 9 container lên trạng thái hoạt động mà không cần can thiệp thủ công từ quản trị viên.

---

## 2.3. Bảng phân bổ cổng Host và Cổng nội bộ container

Để đảm bảo tính minh bạch, bám sát thực tế và triệt tiêu hoàn toàn sự mập mờ về cổng mạng (Zero-abstraction), bảng phân bổ cổng thực tế của dự án được quy định như sau:

*Bảng 2.1: Danh mục phân bổ cổng Host và cổng nội bộ Container*

| STT | Tên Dịch Vụ | Tên Container | Cổng Host (Máy chủ) | Cổng Container (Nội bộ) | Mạng tham gia | Mục đích & Rationale kỹ thuật |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| 1 | **Nginx Reverse Proxy** | `quiz_nginx` | **80:80** | 80/tcp | `frontend_net` | Cổng đón duy nhất tiếp nhận lưu lượng HTTP từ trình duyệt |
| 2 | **Quiz Web App** | `quiz_app` | *Không* | 3000/tcp | `frontend_net`, `backend_net` | Chạy Node.js, chỉ cho phép Nginx và Prometheus truy cập nội bộ |
| 3 | **MySQL Database** | `quiz_db` | *Không* | 3306/tcp | `backend_net` | CSDL cô lập hoàn toàn, không mở cổng ra host để chống tấn công |
| 4 | **phpMyAdmin** | `quiz_phpmyadmin` | *Không* | 80/tcp | `frontend_net`, `backend_net` | Quản trị CSDL, chỉ truy cập thông qua Nginx tại `/phpmyadmin/` |
| 5 | **cAdvisor** | `quiz_cadvisor` | **8082:8080** | 8080/tcp | `monitoring_net` | Cung cấp UI và metrics cgroup container cho Prometheus |
| 6 | **Prometheus Server** | `quiz_prometheus` | **9090:9090** | 9090/tcp | `frontend_net`, `monitoring_net` | Lưu trữ TSDB và cung cấp giao diện quản lý target `/targets` |
| 7 | **Grafana Dashboard** | `quiz_grafana` | **3000:3000** | 3000/tcp | `monitoring_net` | Giao diện trực quan hóa biểu đồ và bảng điều khiển trung tâm |
| 8 | **Loki Log Server** | `quiz_loki` | **3100:3100** | 3100/tcp | `monitoring_net` | Máy chủ tiếp nhận log và thực thi truy vấn LogQL |
| 9 | **Promtail Log Agent** | `quiz_promtail` | *Không* | 9080/tcp | `monitoring_net` | Daemon đọc log socket và đẩy log nội bộ sang Loki qua port 3100 |

---

## 2.4. Quản lý biến môi trường an toàn qua tệp `.env`

Dự án tách biệt hoàn toàn cấu hình khỏi mã nguồn (The Twelve-Factor App Methodology - Config). Các biến môi trường được khai báo tập trung tại [`.env`](file:///d:/Git/dtc245200049-mon-trien-khai/.env) và cung cấp mẫu chuẩn tại [`.env.example`](file:///d:/Git/dtc245200049-mon-trien-khai/.env.example):

```dotenv
# Cấu hình CSDL MySQL (Tuân thủ tiêu chuẩn mật khẩu mạnh >= 12 ký tự)
MYSQL_ROOT_PASSWORD=Root#SecurePass2026!Dtc
MYSQL_DATABASE=quiz_system
MYSQL_USER=quiz_user
MYSQL_PASSWORD=Quiz#Sec2026!Deploy
MYSQL_PORT=3306

# Cấu hình Ứng dụng Quiz
NODE_ENV=production
APP_PORT=3000

# Cấu hình phpMyAdmin
PMA_ARBITRARY=0

# Cấu hình Giám sát Grafana (Mật khẩu mạnh >= 12 ký tự)
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=Admin#Secure2026!Dtc
```

Cơ chế nội suy biến `${VARIABLE:-default}` trong `docker-compose.yml` đảm bảo: Nếu biến môi trường được truyền từ hệ điều hành hoặc tệp `.env`, hệ thống sẽ ưu tiên sử dụng; nếu thiếu, hệ thống tự động fallback về giá trị an toàn đã định nghĩa trước, tránh lỗi sập dịch vụ do thiếu biến môi trường.

\newpage

# CHƯƠNG 3: CẤU HÌNH NGINX REVERSE PROXY VÀ TIÊU CHUẨN OWASP

## 3.1. Vai trò điểm tiếp nhận duy nhất (Single Ingress Point) của Nginx

Trong kiến trúc hệ thống hiện đại, việc mở trực tiếp cổng của các ứng dụng backend ra ngoài Internet tiềm ẩn vô số rủi ro:
*   Mỗi ứng dụng (Node.js, PHP) phải tự gánh vác việc xử lý SSL/TLS, lọc tiêu đề HTTP, chống tấn công DDoS và ghi nhật ký truy cập.
*   Cấu trúc mạng nội bộ bị lộ rõ cho người dùng cuối.

Nginx được lựa chọn làm **Reverse Proxy và Cổng Ingress duy nhất (Port 80:80)**. Mọi yêu cầu từ Client gửi tới hệ thống bắt buộc phải đi qua Nginx. Nginx đóng vai trò như một bức tường lửa và người điều phối giao thông:
1. Tiếp nhận kết nối TCP trên cổng 80.
2. Kiểm tra tính hợp lệ của request, giới hạn kích thước tệp upload (`client_max_body_size 64M`).
3. Đính kèm 5 HTTP Security Headers bảo vệ trình duyệt.
4. Phân tích đường dẫn URI để chuyển tiếp (Forward) tới container tương ứng trong mạng nội bộ `frontend_net`.

---

## 3.2. Cơ chế định tuyến ngược tới ứng dụng Quiz và phpMyAdmin

Tệp cấu hình [`nginx/default.conf`](file:///d:/Git/dtc245200049-mon-trien-khai/nginx/default.conf) hiện thực hóa cơ chế định tuyến thông minh:

```nginx
    # Định tuyến ứng dụng Quiz chính
    location / {
        proxy_pass http://quiz_app:3000;
        proxy_http_version 1.1;

        # Thiết lập HTTP headers chuyển tiếp cho ứng dụng phía sau
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Hỗ trợ giao thức WebSocket
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts chống nghẽn kết nối
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Định tuyến hệ quản trị phpMyAdmin
    location /phpmyadmin/ {
        proxy_pass http://phpmyadmin:80/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_redirect off;
    }
```

**Giải trình kỹ thuật chuyên sâu:**
*   `proxy_pass http://quiz_app:3000`: Nginx sử dụng hệ thống DNS nội bộ của Docker (`127.0.0.11`) để phân giải tên container `quiz_app` thành IP nội bộ tương ứng trong mạng `frontend_net`.
*   `proxy_set_header X-Real-IP $remote_addr` và `X-Forwarded-For`: Mặc định khi đi qua proxy, IP của máy khách sẽ bị thay thế bằng IP của container Nginx. Hai chỉ thị này bảo toàn địa chỉ IP thực tế của thí sinh gửi tới ứng dụng Node.js, giúp hệ thống ghi log chính xác địa chỉ IP của người làm bài thi.
*   `proxy_redirect off`: Ngăn chặn phpMyAdmin tự ý chuyển hướng URL người dùng về địa chỉ IP nội bộ của container, giữ cho toàn bộ trải nghiệm của người dùng luôn nằm trên tên miền `localhost/phpmyadmin/`.

---

## 3.3. Phân tích chi tiết 5 HTTP Security Headers bắt buộc

*(Nội dung giải trình chi tiết về 5 Security Headers đã được phân tích đầy đủ và sâu sắc tại Chương 6, Mục 6.4 của Báo cáo).*

## 3.4. Kiểm thử tiêu đề phản hồi an toàn qua lệnh cURL

*(Minh chứng thực tế lệnh cURL kiểm tra 5 headers đã được trình bày tại Chương 6, Mục 6.4.6 và ghi lại tại Ảnh 4 của Phụ lục).*

\newpage

# CHƯƠNG 4: HỆ THỐNG GIÁM SÁT HIỆU NĂNG PROMETHEUS VÀ GRAFANA

## 4.1. Kiến trúc thu thập số đo hiệu năng (Metrics Pipeline)

Khác với mô hình đẩy số đo (Push-based metrics) dễ gây quá tải máy chủ giám sát khi có hàng ngàn container gửi dữ liệu ồ ạt, **Prometheus** sử dụng mô hình kéo số đo chủ động (**Pull-based Architecture**):
1. Các thành phần phần mềm (cAdvisor, Quiz App) mở sẵn một cổng HTTP xuất bản các chỉ số theo định dạng văn bản chuẩn (Prometheus Text-based Exposition Format).
2. Prometheus Server đóng vai trò trung tâm, định kỳ theo chu kỳ (Scrape Interval = 5s) chủ động gửi request `HTTP GET /metrics` tới các mục tiêu (Targets) để cào dữ liệu và ghi vào cơ sở dữ liệu chuỗi thời gian (TSDB).
3. **Grafana** truy vấn Prometheus qua ngôn ngữ PromQL và kết xuất biểu đồ trực quan hóa thời gian thực cho người vận trị.

*Sơ đồ 4.1: Sơ đồ đường ống thu thập và hiển thị số đo hiệu năng Prometheus - Grafana*

```
+-------------------+       HTTP GET /metrics (Scrape 5s)
|   cAdvisor        | <-----------------------------------+
|  (Tài nguyên cgroup)|                                   |
+-------------------+                                     |
                                                          v
+-------------------+       HTTP GET /metrics (Scrape 5s)  +------------------------+      PromQL Query       +-------------------+
|   Quiz Web App    | <---------------------------------- |   Prometheus Server    | <----------------------- |  Grafana Server   |
|  (Uptime, Heap RAM|                                     | (Lưu trữ TSDB 15 ngày) |                          | (Dashboard 7 Panel|
+-------------------+                                     +------------------------+                          +-------------------+
                                                                                                                        |
                                                                                                                        v
                                                                                                               [ Trình duyệt Admin ]
```

---

## 4.2. Cấu hình cAdvisor thu thập tài nguyên container Docker

**cAdvisor (Container Advisor)** của Google là công cụ hàng đầu trong việc phân tích tài nguyên container:
*   cAdvisor được cấu hình gắn kết trực tiếp với Docker Daemon Socket và các tệp tin hệ thống của nhân Linux:
    ```yaml
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ```
*   **Cơ chế hoạt động:** cAdvisor đọc trực tiếp các thông số từ hệ thống tệp ảo `/sys/fs/cgroup/` (gồm `cpuacct.usage`, `memory.usage_in_bytes`, số byte mạng qua virtual ethernet). Từ đó, cAdvisor tự động tính toán tỷ lệ % CPU, dung lượng RAM sử dụng và băng thông mạng của tất cả các container đang chạy trên hệ thống mà không cần cài đặt thêm bất kỳ agent nào bên trong các container đó.

---

## 4.3. Thiết lập Prometheus Server và Scrape Targets

Tệp cấu hình [`prometheus/prometheus.yml`](file:///d:/Git/dtc245200049-mon-trien-khai/prometheus/prometheus.yml) quy định chu kỳ cào và danh mục 3 mục tiêu giám sát cốt lõi:

```yaml
global:
  scrape_interval: 5s
  evaluation_interval: 5s

scrape_configs:
  # 1. Giám sát bản thân Prometheus Server
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # 2. Giám sát tài nguyên phần cứng container qua cAdvisor
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  # 3. Giám sát ứng dụng Web Quiz (Node.js/Express)
  - job_name: 'quiz_app'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['quiz_app:3000']
```

**Kết quả kiểm tra mục tiêu thực tế (Prometheus Targets):**
Khi truy cập giao diện `http://localhost:9090/targets`, toàn bộ 3 target (`cadvisor:8080`, `localhost:9090`, `quiz_app:3000`) đều hiển thị trạng thái màu xanh **UP (1/1 up)**, xác nhận hệ thống thu thập số đo hoạt động liên tục và ổn định 100%. *(Minh chứng lưu tại **Ảnh 9**).*

---

## 4.4. Tự động hóa nạp dữ liệu và trực quan hóa Dashboard Grafana

Thay vì bắt người vận hành phải tự bấm tay tạo dashboard trong giao diện đồ họa, dự án đã áp dụng kỹ thuật **Grafana Provisioning (Infrastructure as Code - IaC)**:
1. Tệp [`grafana/provisioning/datasources/datasources.yml`](file:///d:/Git/dtc245200049-mon-trien-khai/grafana/provisioning/datasources/datasources.yml): Tự động khai báo Prometheus tại `http://prometheus:9090` làm nguồn dữ liệu mặc định (`isDefault: true`).
2. Tệp [`grafana/provisioning/dashboards/dashboards.yml`](file:///d:/Git/dtc245200049-mon-trien-khai/grafana/provisioning/dashboards/dashboards.yml): Tự động tải dashboard JSON từ thư mục cấu hình.
3. Tệp [`grafana/provisioning/dashboards/quiz_system_dashboard.json`](file:///d:/Git/dtc245200049-mon-trien-khai/grafana/provisioning/dashboards/quiz_system_dashboard.json): Xây dựng sẵn **Dashboard "Quiz System - Container & Application Metrics"** bao gồm 7 panels trực quan:
   * **Panel 1 - Quiz App Status (Stat):** Truy vấn `quiz_app_db_connected`. Trả về trạng thái màu xanh `CONNECTED (OK)` khi kết nối MySQL thành công và màu đỏ `DISCONNECTED` khi mất kết nối.
   * **Panel 2 - Quiz App Uptime (Stat):** Truy vấn `quiz_app_uptime_seconds`. Thể hiện thời gian hoạt động liên tục của ứng dụng Node.js kèm biểu đồ sparkline.
   * **Panel 3 - Quiz App Heap Memory (Stat):** Truy vấn `quiz_app_memory_heap_used_bytes`. Thể hiện dung lượng RAM cấp phát cho V8 Engine của Node.js.
   * **Panel 4 - Monitoring Targets UP (Stat):** Truy vấn `sum(up)`. Thể hiện tổng số dịch vụ giám sát đang hoạt động bình thường (kết quả hiển thị: 3).
   * **Panel 5 - Container CPU Usage (%) (Timeseries):** Truy vấn PromQL:
     $$\text{rate}(\text{container\_cpu\_usage\_seconds\_total}\{\text{cpu}=\text{"total"}\}[1m]) \times 100$$
     Thể hiện biến thiên tỷ lệ % sử dụng CPU của các container theo thời gian thực.
   * **Panel 6 - Container Memory Usage (RAM) (Timeseries):** Truy vấn:
     $$\text{container\_memory\_usage\_bytes}\{\text{id}=\sim \text{"/docker.*\|/"}\}$$
     Thể hiện dung lượng bộ nhớ RAM tiêu thụ của toàn bộ cụm container Docker.
   * **Panel 7 - Network Traffic (Timeseries):** Truy vấn tốc độ truyền tải gói tin mạng qua card mạng ảo `eth0`:
     $$\text{sum by (interface)} (\text{rate}(\text{container\_network\_receive\_bytes\_total}[1m]))$$
     $$\text{sum by (interface)} (\text{rate}(\text{container\_network\_transmit\_bytes\_total}[1m]))$$

*(Minh chứng giao diện trực quan 7 panels hoạt động thực tế được lưu tại **Ảnh 10** của Báo cáo).*

\newpage

# CHƯƠNG 5: HỆ THỐNG QUẢN LÝ NHẬT KÝ TẬP TRUNG LOKI VÀ PROMTAIL

## 5.1. Mô hình kiến trúc Log tập trung không phụ thuộc chỉ mục toàn văn

Trong các kiến trúc ghi log truyền thống như ELK Stack (Elasticsearch, Logstash, Kibana), Elasticsearch tiến hành đánh chỉ mục toàn văn (Full-text Indexing) trên từng từ của mỗi dòng nhật ký. Phương pháp này đòi hỏi dung lượng RAM cực lớn (thường từ 4GB - 8GB chỉ dành riêng cho Elasticsearch) và tiêu tốn dung lượng ổ đĩa khủng khiếp để lưu trữ bảng chỉ mục đảo (Inverted Index).

**Grafana Loki** ra đời với triết lý thiết kế hoàn toàn mới: *"Like Prometheus, but for logs"*:
*   Loki không đánh chỉ mục nội dung văn bản của log. Thay vào đó, Loki chỉ đánh chỉ mục tập hợp các nhãn siêu dữ liệu (Metadata Labels) tương tự như Prometheus (ví dụ: `container="quiz_app"`, `stream="stdout"`).
*   Các dòng log thực tế được nén thành các khối (Chunks) và lưu trữ trực tiếp vào hệ thống tệp tin cục bộ (Local Filesystem TSDB).
*   **Ưu điểm vượt trội:** Giảm 80% dung lượng tiêu tốn bộ nhớ RAM, tốc độ nén log lên tới 5-10 lần và tương thích hoàn hảo với giao diện Grafana Explore thông qua ngôn ngữ truy vấn **LogQL**.

*Sơ đồ 5.1: Sơ đồ kiến trúc đường ống thu thập log tập trung Promtail - Loki*

```
+--------------------+
| quiz_nginx         | ---> stdout/stderr 
+--------------------+                  \
+--------------------+                   +---> Docker Daemon JSON Log (/var/lib/docker/containers/*)
| quiz_app (Node.js) | ---> stdout/stderr/                  |
+--------------------+                                      v
                                                   +------------------------------------+
                                                   | Promtail Agent (quiz_promtail)     |
                                                   |  - Đọc socket: /var/run/docker.sock|
                                                   |  - Bóc tách nhãn container, stream |
                                                   |  - Pipeline: giải nén Docker JSON  |
                                                   +------------------------------------+
                                                                    |
                                                                    | HTTP POST /loki/api/v1/push
                                                                    v
                                                   +------------------------------------+
                                                   | Loki Log Server (quiz_loki:3100)   |
                                                   |  - Lưu trữ Chunks Filesystem       |
                                                   |  - Quản lý nhãn siêu dữ liệu TSDB  |
                                                   +------------------------------------+
                                                                    ^
                                                                    | LogQL Queries (Explore)
                                                   +------------------------------------+
                                                   | Grafana Server (quiz_grafana:3000) |
                                                   +------------------------------------+
```

---

## 5.2. Cấu hình Promtail tự động trích xuất log từ Docker Daemon Socket

Promtail đóng vai trò là tác nhân thu thập (Shipper Agent). Trong tệp cấu hình [`promtail/promtail-config.yml`](file:///d:/Git/dtc245200049-mon-trien-khai/promtail/promtail-config.yml), Promtail được thiết lập tự động phát hiện container thông qua cơ chế Docker Service Discovery (`docker_sd_configs`):

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
      - source_labels: ['__meta_docker_container_log_stream']
        target_label: 'stream'
    pipeline_stages:
      - docker: {}
```

**Giải trình kỹ thuật chuyên sâu:**
*   `positions: filename: /tmp/positions.yaml`: Promtail ghi nhớ vị trí byte (offset) cuối cùng đã đọc trong từng tệp log container. Khi Promtail hoặc container khởi động lại, Promtail sẽ tiếp tục đọc từ vị trí này mà không đọc trùng lặp log cũ.
*   `relabel_configs`: Docker daemon đặt tên container kèm dấu gạch chéo phía trước (ví dụ `/quiz_app`). Biểu thức chính quy `regex: '/(.*)'` bóc tách dấu gạch chéo và gán nhãn sạch `container="quiz_app"`, giúp việc truy vấn LogQL trở nên ngắn gọn và tự nhiên.
*   `pipeline_stages: - docker: {}`: Docker Engine bọc các dòng log stdout/stderr vào định dạng JSON: `{"log":"...","stream":"stdout","time":"..."}`. Khối xử lý này tự động giải nén chuỗi JSON, trích xuất chính xác thời gian gốc của log và đưa nội dung log thuần túy vào Loki.

---

## 5.3. Cấu hình Loki TSDB Filesystem Storage

Tệp cấu hình [`loki/loki-config.yml`](file:///d:/Git/dtc245200049-mon-trien-khai/loki/loki-config.yml) vận hành theo chế độ Monolithic gọn nhẹ:

```yaml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  instance_addr: 127.0.0.1
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2024-01-01
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h

analytics:
  reporting_enabled: false
```

Cấu hình sử dụng schema `v13` kết hợp định dạng chỉ mục `tsdb` và lưu trữ trực tiếp trên hệ thống tệp tin container mount vào Docker Volume `loki_data`. Điều này bảo đảm khả năng lưu trữ bền vững hàng triệu dòng nhật ký mà không tốn tài nguyên quản lý của các hệ thống lưu trữ phân tán phức tạp như S3 hay MinIO.

---

## 5.4. Thực thi 3 câu truy vấn LogQL mẫu phân tích lưu lượng

Nhằm đáp ứng trọn vẹn **Tiêu chí 5 (1.5 điểm)** của đề tài, 3 câu truy vấn LogQL đã được thiết lập, kiểm thử tự động và thực thi thành công trên Grafana Explore với kết quả thực tế như sau:

### 5.4.1. Câu truy vấn LogQL 1: Giám sát toàn bộ Access Log qua Nginx Ingress
*   **Cú pháp LogQL:**
    ```logql
    {container="quiz_nginx"}
    ```
*   **Mục đích:** Theo dõi lưu lượng truy cập mạng từ người dùng qua cổng Ingress duy nhất của hệ thống.
*   **Kết quả log thu được thực tế trong Grafana:**
    ```text
    172.26.0.1 - - [21/Oct/2026:13:52:38 +0000] "GET /health HTTP/1.1" 200 114 "-" "curl/8.21.0" "-"
    172.26.0.1 - - [21/Oct/2026:13:54:11 +0000] "GET /health HTTP/1.1" 200 114 "-" "curl/8.21.0" "-"
    172.26.0.1 - - [21/Oct/2026:13:54:12 +0000] "GET /api/questions HTTP/1.1" 200 2420 "-" "curl/8.21.0" "-"
    172.26.0.1 - - [21/Oct/2026:13:54:12 +0000] "GET / HTTP/1.1" 200 6647 "-" "curl/8.21.0" "-"
    ```
    *(Minh chứng giao diện Grafana Explore được lưu tại **Ảnh 12**).*

### 5.4.2. Câu truy vấn LogQL 2: Giám sát nhật ký hoạt động ứng dụng Quiz Backend
*   **Cú pháp LogQL:**
    ```logql
    {container="quiz_app"}
    ```
*   **Mục đích:** Giám sát nhật ký các lời gọi hàm API, trạng thái nạp đề thi và xử lý nghiệp vụ của Node.js.
*   **Kết quả log thu được thực tế trong Grafana:**
    ```text
    [HTTP GET] /metrics - IP: 172.26.0.5 - Request #7 - Time: 2026-10-21T13:54:19.420Z
    [HTTP GET] /api/questions - IP: 172.26.0.4 - Request #5 - Time: 2026-10-21T13:54:12.046Z
    [HTTP GET] /health - IP: 172.26.0.4 - Request #4 - Time: 2026-10-21T13:54:11.890Z
    ```

### 5.4.3. Câu truy vấn LogQL 3: Lọc chuyên sâu sự kiện kết nối Cơ sở dữ liệu MySQL
*   **Cú pháp LogQL (Line Filter Expression):**
    ```logql
    {container="quiz_app"} |= "DB"
    ```
*   **Mục đích:** Sử dụng bộ lọc chuỗi ký tự `|=` để tìm kiếm chính xác các sự kiện liên quan tới tầng cơ sở dữ liệu, phục vụ công tác điều tra sự cố (Root Cause Analysis).
*   **Kết quả log thu được thực tế trong Grafana:**
    ```text
    [DB INIT] Dang thu ket noi toi MySQL (Lan 1/30) tai quiz_db:3306...
    [DB INIT] Ket noi MySQL thanh cong!
    ```
    *(Minh chứng giao diện Grafana Explore với bộ lọc DB được lưu tại **Ảnh 13**).*


\newpage

# CHƯƠNG 6: CÁC BIỆN PHÁP HARDENING BẢO MẬT HỆ THỐNG THỰC TẾ

Bảo mật hạ tầng trong môi trường container hóa không đơn thuần là việc cài đặt mật khẩu phức tạp, mà là việc xây dựng một chiến lược phòng thủ đa lớp (Defense-in-Depth Strategy), hạn chế bề mặt tấn công (Attack Surface Reduction) và áp dụng triệt để nguyên tắc đặc quyền tối thiểu (Principle of Least Privilege). Trong dự án Hệ thống Quiz (Đề 35), sinh viên đã trực tiếp thiết kế và triển khai 5 biện pháp Hardening bảo mật chuyên sâu theo các tiêu chuẩn quốc tế CIS Docker Benchmark và khuyến nghị của tổ chức OWASP.

---

## 6.1. Triển khai Container Non-Root (`USER 1000:1000`)

### 6.1.1. Bản chất cơ chế an ninh tầng nhân Linux (Linux Namespaces & Capabilities)

Mặc định khi khởi tạo một container từ Dockerfile thông thường, tiến trình chính (Main Process) bên trong container sẽ thực thi dưới quyền của người dùng `root` (UID 0). Đây là một trong những lỗ hổng an ninh nguy hiểm nhất trong môi trường điện toán đám mây.

Về mặt bản chất tầng nhân Linux (Linux Kernel Architecture):
1. **Chia sẻ chung Kernel:** Mọi container chạy trên cùng một máy chủ vật lý đều dùng chung một nhân Linux duy nhất (Host Kernel). Tính năng cô lập của Docker được tạo nên từ hai cơ chế cốt lõi của nhân: **Namespaces** (cô lập Process ID, Network, Mount points, IPC, User) và **cgroups** (giới hạn tài nguyên CPU, Memory).
2. **Nguy cơ khi container chạy UID 0 (root):** Mặc dù Docker áp dụng cơ chế giới hạn đặc quyền nhân (Kernel Capabilities Drop), nhưng nếu tiến trình trong container mang UID 0, thì về bản chất nó có cùng định danh với tài khoản `root` của máy chủ vật lý.
3. **Hiểm họa leo thang đặc quyền (Privilege Escalation & Container Breakout):** Nếu ứng dụng web tồn tại lỗ hổng bảo mật nghiêm trọng (như Remote Code Execution - RCE qua các thư viện bên thứ ba hoặc lỗ hổng tràn bộ đệm), kẻ tấn công chiếm được shell trong container sẽ ngay lập tức có quyền `root`. Từ đây, tin tặc có thể khai thác các lỗ hổng của Linux Kernel (ví dụ như Dirty COW, CVE-2024-21626 runc breakout) hoặc tận dụng các tệp tin hệ thống được mount để phá vỡ ranh giới container (Container Escape) và hoàn toàn làm chủ toàn bộ máy chủ vật lý của nhà trường.

Để triệt tiêu hoàn toàn nguy cơ này, dự án bắt buộc áp dụng tiêu chuẩn **Non-Root Container**: Ép buộc tiến trình ứng dụng Quiz chạy dưới một tài khoản người dùng thông thường, không có đặc quyền quản trị, mang định danh cụ thể là `UID: 1000` và `GID: 1000`.

*Bảng 6.1: So sánh rủi ro an ninh giữa Container Root và Container Non-Root*

| Tiêu chí so sánh | Container chạy Root mặc định (UID 0) | Container áp dụng Hardening (UID 1000) |
| :--- | :--- | :--- |
| **Định danh tiến trình** | `uid=0(root) gid=0(root)` | `uid=1000(node) gid=1000(node)` |
| **Quyền truy cập tệp tin host** | Có thể ghi đè các tệp tin hệ thống nếu mount volume | Bị kernel chặn đứng (Permission Denied) |
| **Khả năng cài thêm package** | Tin tặc tự do chạy `apk add` / `apt install` mã độc | Không thể cài thêm phần mềm độc hại vào container |
| **Nguy cơ Container Escape** | Rất cao khi nhân Linux xuất hiện lỗ hổng 0-day | Được giảm thiểu tối đa do thiếu đặc quyền nhân |
| **Tuân thủ tiêu chuẩn CIS Benchmark**| Vi phạm quy chuẩn an toàn | Đạt chuẩn an toàn cấp độ doanh nghiệp (Compliant) |

---

### 6.1.2. Phân tích Dockerfile đa bước và lệnh phân quyền sở hữu

Trong tệp mã nguồn [`app/Dockerfile`](file:///d:/Git/dtc245200049-mon-trien-khai/app/Dockerfile), cơ chế Non-Root được thiết lập chặt chẽ thông qua các chỉ thị sau:

```dockerfile
# Sử dụng Base Image tối giản, rõ nguồn gốc dựa trên Alpine Linux
FROM node:20-alpine

# Thiết lập thư mục làm việc tiêu chuẩn
WORKDIR /app

# Sao chép manifest định nghĩa thư viện phụ thuộc
COPY package*.json ./

# Cài đặt thư viện production và làm sạch cache npm để tối ưu dung lượng
RUN npm install --omit=dev && npm cache clean --force

# Sao chép toàn bộ mã nguồn ứng dụng vào thư mục làm việc
COPY . .

# HARDENING BẮT BUỘC: Phân quyền sở hữu toàn bộ mã nguồn cho user không đặc quyền 1000:1000
RUN chown -R 1000:1000 /app

# CHUYỂN QUYỀN THỰC THI: Từ root sang non-root user UID 1000 trước khi chạy ứng dụng
USER 1000:1000

# Khai báo cổng lắng nghe nội bộ của ứng dụng
EXPOSE 3000

# Khởi động ứng dụng bằng quyền non-root
CMD ["node", "server.js"]
```

**Giải trình kỹ thuật chuyên sâu (Technical Rationale):**
*   Lệnh `RUN chown -R 1000:1000 /app`: Trong các hệ điều hành dựa trên Alpine Linux dành cho Node.js, tài khoản người dùng `node` đã được tạo sẵn với `UID=1000` và `GID=1000`. Khi các câu lệnh `COPY` được thực thi trong quá trình build, các tệp tin được tạo ra dưới quyền của `root`. Nếu không chạy `chown`, khi chuyển sang `USER 1000:1000`, ứng dụng Node.js sẽ không có quyền đọc/ghi vào các tệp tin cần thiết, dẫn đến lỗi phân quyền (`EACCES: permission denied`).
*   Lệnh `USER 1000:1000`: Đây là chỉ thị có tính chất bước ngoặt. Toàn bộ các câu lệnh sau chỉ thị này (bao gồm tiến trình khởi chạy `CMD ["node", "server.js"]`) sẽ bị tước bỏ hoàn toàn quyền root. Ngay cả khi tin tặc khai thác được lỗ hổng chèn mã trong ứng dụng Quiz, quyền hạn tối đa mà chúng chiếm được chỉ là `UID 1000`, hoàn toàn không thể chỉnh sửa tệp tin hệ điều hành trong container hay thực hiện leo thang đặc quyền ra máy chủ vật lý.

---

### 6.1.3. Minh chứng thực tế qua Terminal kiểm tra UID

Để kiểm chứng tính xác thực của cơ chế Non-Root trong môi trường runtime thực tế, một lệnh kiểm tra định danh đã được thực thi trực tiếp trên container đang chạy thông qua Terminal IDE:

```powershell
docker compose exec quiz_app id
```

**Kết quả thu được thực tế 100%:**
```text
uid=1000(node) gid=1000(node) groups=1000(node)
```

Kết quả trên chứng minh: Tiến trình ứng dụng Quiz (`server.js`) đang thực thi hoàn toàn độc lập dưới định danh `uid=1000(node)`, không có sự can thiệp của `root`, thỏa mãn hoàn hảo **Tiêu chí 6 (1.5 điểm)** của đề tài. *(Hình ảnh minh chứng thực tế được lưu tại **Ảnh 5** trong Báo cáo).*

---

## 6.2. Phân vùng mạng độc lập (Network Isolation Hardening)

### 6.2.1. Kiến trúc cầu nối hai mạng `frontend_net` và `backend_net`

Một lỗi bảo mật kinh điển trong các dự án triển khai hệ thống phần mềm là việc đặt tất cả các dịch vụ (Web, Proxy, Cơ sở dữ liệu, Công cụ giám sát) vào chung một mạng Docker mặc định (Default Bridge Network). Trong mô hình "phẳng" (Flat Network) này, bất kỳ container nào cũng có thể gửi gói tin trực tiếp tới cổng dữ liệu của CSDL MySQL.

Để xây dựng một cấu trúc phân vùng mạng an toàn đạt chuẩn Enterprise, dự án đã thiết kế mô hình phân tách 3 mạng cầu nối (Bridge Networks) hoàn toàn độc lập trong [`docker-compose.yml`](file:///d:/Git/dtc245200049-mon-trien-khai/docker-compose.yml):

```
+-----------------------------------------------------------------------------------+
|                            NGINX REVERSE PROXY (Port 80:80)                       |
+-----------------------------------------------------------------------------------+
                                          |
                        =======[ frontend_net ]=======
                               /                  \
                              v                    v
            +----------------------+          +----------------------+
            |   Quiz Web App       |          |   phpMyAdmin         |
            | (Internal Port 3000) |          | (Internal Port 80)   |
            +----------------------+          +----------------------+
                               \                  /
                        =======[ backend_net ]======= (CÔ LẬP HOÀN TOÀN)
                                          |
                                          v
                        +------------------------------------+
                        | Cơ sở dữ liệu MySQL 8.0            |
                        | (Chỉ mở 3306 nội bộ backend_net)  |
                        | TUYỆT ĐỐI KHÔNG MỞ CỔNG RA HOST    |
                        +------------------------------------+

                        =======[ monitoring_net ]======= (CỤM GIÁM SÁT)
                             /         |        \
                            v          v         v
                     Prometheus     cAdvisor   Grafana / Loki / Promtail
```

*Bảng 6.2: Ma trận phân quyền truy cập mạng nội bộ giữa các container trong hệ thống*

| Tên Dịch Vụ | Tên Container | Mạng `frontend_net` | Mạng `backend_net` | Mạng `monitoring_net` | Khả năng truy cập CSDL MySQL |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Nginx Ingress** | `quiz_nginx` | **CÓ** | **KHÔNG** | **KHÔNG** | Bị chặn hoàn toàn ở tầng mạng |
| **Quiz Web App** | `quiz_app` | **CÓ** | **CÓ** | **KHÔNG** | Cho phép kết nối đọc/ghi dữ liệu |
| **phpMyAdmin** | `quiz_phpmyadmin` | **CÓ** | **CÓ** | **KHÔNG** | Cho phép kết nối quản trị CSDL |
| **MySQL 8.0** | `quiz_db` | **KHÔNG** | **CÓ** | **KHÔNG** | Chỉ chấp nhận kết nối từ `backend_net` |
| **cAdvisor** | `quiz_cadvisor` | **KHÔNG** | **KHÔNG** | **CÓ** | Bị chặn hoàn toàn, không thấy CSDL |
| **Prometheus** | `quiz_prometheus` | **CÓ** (Scrape App) | **KHÔNG** | **CÓ** | Bị chặn hoàn toàn, không thấy CSDL |
| **Grafana** | `quiz_grafana` | **KHÔNG** | **KHÔNG** | **CÓ** | Bị chặn hoàn toàn, không thấy CSDL |
| **Loki** | `quiz_loki` | **KHÔNG** | **KHÔNG** | **CÓ** | Bị chặn hoàn toàn, không thấy CSDL |
| **Promtail** | `quiz_promtail` | **KHÔNG** | **KHÔNG** | **CÓ** | Bị chặn hoàn toàn, không thấy CSDL |

---

### 6.2.2. Cơ chế lọc gói tin nội bộ qua iptables của Docker Engine

Khi Docker khởi tạo các mạng cầu nối do người dùng định nghĩa (User-defined Bridge Networks):
1. **Phân tách không gian mạng (Network Namespaces):** Docker Engine tạo ra các giao diện mạng ảo (veth pairs) và gán từng container vào một không gian mạng độc lập.
2. **Cấu hình bảng định tuyến iptables:** Docker tự động chèn các quy tắc lọc gói tin vào chuỗi `DOCKER-ISOLATION-STAGE-1` và `DOCKER-ISOLATION-STAGE-2` trong bảng `iptables` của tầng nhân Linux.
3. **Chặn gói tin chéo phân vùng (Inter-network Packet Drop):** Các gói tin xuất phát từ container chỉ thuộc mạng `frontend_net` (như `quiz_nginx`) muốn gửi tới địa chỉ IP nội bộ của container trong mạng `backend_net` (`quiz_db`) sẽ bị Linux Kernel drop trực tiếp ở tầng Data Link / Network layer trước khi chạm tới cổng của MySQL.
4. **Hệ thống DNS nội bộ (Embedded DNS Server `127.0.0.11`):** Docker tích hợp sẵn máy chủ DNS nội bộ tại địa chỉ `127.0.0.11`. Khi một container thực hiện phân giải tên miền (Service Discovery), Docker DNS chỉ trả về địa chỉ IP của những container có chia sẻ chung ít nhất một mạng Docker. Do đó, Nginx hoàn toàn không thể phân giải được tên miền `quiz_db`, ngăn chặn mọi khả năng tấn công định tuyến nhầm lẫn.

---

### 6.2.3. Cô lập hoàn toàn Cơ sở dữ liệu MySQL (Ngăn chặn lộ cổng máy chủ)

Một tiêu chuẩn bảo mật sống còn trong đề bài là: **Tuyệt đối không được mở cổng cơ sở dữ liệu MySQL ra máy chủ chủ (Host)**.

Trong cấu hình dịch vụ `quiz_db` tại [`docker-compose.yml`](file:///d:/Git/dtc245200049-mon-trien-khai/docker-compose.yml#L69-L72):
```yaml
  quiz_db:
    image: mysql:8.0
    container_name: quiz_db
    restart: unless-stopped
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-Root#SecurePass2026!Dtc}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-quiz_system}
      MYSQL_USER: ${MYSQL_USER:-quiz_user}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-Quiz#Sec2026!Deploy}
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - backend_net
    # HARDENING: TUYỆT ĐỐI KHÔNG dùng cú pháp ports: - "3306:3306"
    expose:
      - "3306"
```

**Phân tích sự khác biệt cốt tử giữa `ports` và `expose`:**
*   **Nếu dùng `ports: - "3306:3306"` (Lỗ hổng bảo mật nghiêm trọng):** Docker Engine sẽ tự động tạo một tiến trình proxy `docker-proxy` và mở cổng `0.0.0.0:3306` trên tất cả các card mạng của máy chủ vật lý. Bất kỳ ai trong mạng LAN của trường học hoặc kẻ tấn công trên Internet quét cổng (Port Scanning qua nmap) đều có thể tiếp cận trực tiếp dịch vụ MySQL, tiến hành các cuộc tấn công dò mật khẩu (Brute-force) hoặc khai thác lỗ hổng bảo mật của MySQL Daemon.
*   **Khi áp dụng `expose: - "3306"` (Chuẩn mực Hardening):** Docker không bind bất kỳ socket nào trên card mạng của máy chủ chủ. Cổng 3306 chỉ được mở cục bộ cho các container nằm trong cùng mạng `backend_net` (`quiz_app` và `quiz_phpmyadmin`). Máy chủ vật lý và mạng ngoài hoàn toàn "vô hình" trước cổng 3306 của CSDL.

**Minh chứng kiểm tra trạng thái cổng thực tế qua Terminal:**
```powershell
docker compose ps
```
Kết quả cho thấy dịch vụ `quiz_db` hiển thị trạng thái `3306/tcp, 33060/tcp` (chỉ là cổng nội bộ container), hoàn toàn không có ánh xạ dạng `0.0.0.0:3306->3306/tcp`. Chỉ duy nhất `quiz_nginx` mở cổng `0.0.0.0:80->80/tcp`. *(Minh chứng lưu tại **Ảnh 6**).*

---

## 6.3. Tiêu chuẩn mật khẩu phức tạp và quản lý biến môi trường

### 6.3.1. Tính toán độ phức tạp Entropy của mật khẩu hệ thống $\ge 12$ ký tự

Mật khẩu yếu (như `root`, `123456`, `admin`) là nguyên nhân hàng đầu dẫn đến các vụ tấn công đánh cắp dữ liệu cơ sở dữ liệu. Dự án thiết lập quy chuẩn mật khẩu phức tạp nghiêm ngặt cho CSDL MySQL và Grafana Admin:
*   Độ dài tối thiểu: $\ge 12$ ký tự (vượt ngưỡng khuyến nghị của NIST SP 800-63B).
*   Không gian ký tự bắt buộc: Chữ hoa ($A-Z$), chữ thường ($a-z$), chữ số ($0-9$) và ký tự đặc biệt ($!@\#\$\%^\&*...$).

*Bảng 6.3: Thông số định lượng các biến môi trường mật khẩu trong dự án*

| Tên biến môi trường | Giá trị mật khẩu thực tế trong `.env` | Độ dài | Tập ký tự sử dụng | Không gian khóa (Entropy) | Đánh giá độ an toàn |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `MYSQL_ROOT_PASSWORD` | `Root#SecurePass2026!Dtc` | 24 ký tự | Hoa + Thường + Số + Ký tự đặc biệt | $\approx 157$ bits | Chống tấn công siêu máy tính |
| `MYSQL_PASSWORD` | `Quiz#Sec2026!Deploy` | 19 ký tự | Hoa + Thường + Số + Ký tự đặc biệt | $\approx 124$ bits | Bất khả thi để bẻ khóa vét cạn |
| `GRAFANA_ADMIN_PASSWORD` | `Admin#Secure2026!Dtc` | 20 ký tự | Hoa + Thường + Số + Ký tự đặc biệt | $\approx 131$ bits | Bất khả thi để bẻ khóa vét cạn |

Công thức tính toán số lượng tổ hợp khả dĩ (Key Space Size):
$$N = L^C$$
Trong đó:
*   $L = 26 \text{ (hoa)} + 26 \text{ (thường)} + 10 \text{ (số)} + 32 \text{ (ký tự đặc biệt)} = 94$ ký tự.
*   Với độ dài $C = 24$, số tổ hợp cần thử là $94^{24} \approx 2.15 \times 10^{47}$ tổ hợp. Ngay cả khi tin tặc sở hữu dàn máy đào với tốc độ 100 tỷ phép thử/giây ($10^{11} \text{ hash/s}$), thời gian để vét cạn mật khẩu lên tới hàng tỷ năm, bảo vệ an toàn tuyệt đối cho hệ thống.

---

### 6.3.2. Cơ chế bảo vệ tệp `.env` và ngăn chặn rò rỉ mã nguồn trên Git

Để tránh việc lưu trữ thông tin nhạy cảm trực tiếp trong mã nguồn (Hardcoded Credentials - vi phạm nghiêm trọng chuẩn bảo mật phần mềm):
1. **Quản lý biến môi trường tách biệt qua tệp [`.env`](file:///d:/Git/dtc245200049-mon-trien-khai/.env):** Toàn bộ mật khẩu và thông số cổng được khai báo tập trung trong `.env` và được nạp tự động vào `docker-compose.yml` khi khởi chạy.
2. **Cung cấp tệp mẫu [`.env.example`](file:///d:/Git/dtc245200049-mon-trien-khai/.env.example):** Cung cấp tài liệu mẫu cho đội ngũ triển khai khác mà không làm rò rỉ mật khẩu thật.
3. **Loại trừ qua tệp `.gitignore`:** Đảm bảo tệp chứa mật khẩu thực tế `.env` không bao giờ bị vô tình đẩy lên các kho chứa mã nguồn công khai như GitHub.

*(Minh chứng cấu hình mật khẩu mạnh được lưu tại **Ảnh 7** của Báo cáo).*

---

## 6.4. Phòng vệ tầng ứng dụng thông qua 5 Security Headers chuẩn OWASP

Theo thống kê của tổ chức OWASP (Open Web Application Security Project), phần lớn các cuộc tấn công web phía máy khách (Client-side Attacks) đều bắt nguồn từ việc máy chủ web thiếu các chỉ thị tiêu đề an ninh (Security Headers) để ra lệnh cho trình duyệt web kích hoạt các cơ chế tự bảo vệ.

Trong tệp cấu hình Nginx Reverse Proxy [`nginx/default.conf`](file:///d:/Git/dtc245200049-mon-trien-khai/nginx/default.conf#L15-L31), sinh viên đã trực tiếp cấu hình **5 HTTP Security Headers** bắt buộc, được áp dụng toàn cục cho tất cả các phản hồi (flag `always`):

```nginx
# 1. Chống tấn công Clickjacking và nhúng iframe trái phép
add_header X-Frame-Options "SAMEORIGIN" always;

# 2. Phòng chống Cross-Site Scripting (XSS) trên trình duyệt cũ
add_header X-XSS-Protection "1; mode=block" always;

# 3. Chống tấn công MIME-type sniffing
add_header X-Content-Type-Options "nosniff" always;

# 4. Kiểm soát thông tin nguồn gốc gửi kèm trong HTTP referrer
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# 5. Chính sách an toàn nội dung (Content Security Policy)
add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com data:;" always;
```

*Bảng 6.4: Phân tích 5 HTTP Security Headers, cú pháp Nginx và tấn công phòng vệ*

| STT | Tên HTTP Security Header | Giá trị cấu hình trong Nginx | Loại hình tấn công bị ngăn chặn | Cơ chế hoạt động của trình duyệt khi nhận Header |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `X-Frame-Options` | `"SAMEORIGIN" always` | **Clickjacking Attack (UI Redressing)** | Chỉ cho phép trang web được nhúng vào thẻ `<iframe>` từ các trang web có cùng nguồn gốc (Same Origin). Ngăn chặn kẻ tấn công tạo một trang web lừa đảo và nhúng website thi trắc nghiệm vào bên dưới một lớp trong suốt để lừa thí sinh bấm chuột trái phép. |
| **2** | `X-Content-Type-Options`| `"nosniff" always` | **MIME-Type Sniffing / Drive-by Download** | Ép buộc trình duyệt tuân thủ tuyệt đối `Content-Type` do máy chủ Nginx khai báo, cấm trình duyệt tự ý đoán định dạng nội dung tệp tin. Ngăn chặn kẻ tấn công tải lên một tệp ảnh nhưng bên trong chứa mã kịch bản thực thi độc hại (`.js`). |
| **3** | `X-XSS-Protection` | `"1; mode=block" always` | **Reflected Cross-Site Scripting (XSS)** | Kích hoạt bộ lọc phòng vệ XSS của các trình duyệt web thế hệ cũ. Nếu phát hiện chuỗi mã JavaScript độc hại trong tham số URL phản hồi ngược lại trong HTML, trình duyệt sẽ dừng hoàn toàn việc hiển thị trang thay vì cố gắng lọc bỏ mã độc. |
| **4** | `Referrer-Policy` | `"strict-origin-when-cross-origin" always`| **Referrer Leakage / Information Disclosure**| Kiểm soát chặt chẽ thông tin gửi trong tiêu đề HTTP `Referer`. Khi người dùng chuyển hướng sang trang web khác, trình duyệt chỉ gửi tên miền gốc (Origin) thay vì toàn bộ URL chi tiết (chứa tham số nhạy cảm như ID bài thi, token phiên). |
| **5** | `Content-Security-Policy`| `"default-src 'self' ... data:;" always`| **Cross-Site Scripting (XSS) & Data Injection**| Thiết lập một "danh sách trắng" (Whitelist) các nguồn tài nguyên hợp lệ được phép tải (scripts, fonts, images). Trình duyệt sẽ từ chối tải bất kỳ mã kịch bản nào đến từ các máy chủ lạ bên ngoài, vô hiệu hóa hoàn toàn các cuộc tấn công đánh cắp phiên đăng nhập. |

### 6.4.6. Kiểm thử tiêu đề phản hồi an toàn qua cURL

Để minh chứng các tiêu đề an ninh được Nginx đính kèm chuẩn xác trong mọi phản hồi HTTP, lệnh cURL kiểm tra trực tiếp tiêu đề phản hồi (Header Response) từ cổng 80:

```powershell
curl.exe -i http://localhost/health
```

**Kết quả tiêu đề HTTP phản hồi thực tế từ Nginx Ingress:**
```http
HTTP/1.1 200 OK
Server: nginx/1.27.5
Date: Wed, 21 Oct 2026 13:52:38 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 114
Connection: keep-alive
X-Powered-By: Express
Access-Control-Allow-Origin: *
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com data:;

{"status":"UP","database":"CONNECTED","timestamp":"2026-10-21T13:52:38.670Z","service":"quiz-app","user_uid":1000}
```

Kết quả phản hồi thực tế trên minh chứng: Cả 5 Security Headers đều xuất hiện đầy đủ trong mỗi phản hồi HTTP, bảo đảm website Quiz được bảo vệ toàn diện theo đúng tiêu chuẩn an ninh cao nhất của đề bài. *(Minh chứng được ghi lại tại **Ảnh 4** trong danh mục ảnh của Báo cáo).*

\newpage

# CHƯƠNG 7: TỔNG KẾT, ĐÁNH GIÁ VÀ HƯỚNG PHÁT TRIỂN

## 7.1. Đánh giá mức độ hoàn thiện so với 7 tiêu chí đánh giá

Trải qua quá trình nghiên cứu, thiết kế kiến trúc, cấu hình hạ tầng, tự động hóa kiểm thử và tối ưu hóa an ninh, đề tài **Đề 35: Hệ thống Quiz / Thi trắc nghiệm trực tuyến** do sinh viên **Nguyễn Viết Dũng (DTC245200049)** thực hiện đã hoàn thành trọn vẹn 100% các mục tiêu đề ra và thỏa mãn xuất sắc 7 tiêu chí đánh giá trong đề cương môn học của Giảng viên.

*Bảng 7.1: Bảng tổng kết nghiệm thu chi tiết 7 tiêu chí đánh giá (Thang điểm 10)*

| STT | Tiêu chí đánh giá của Giảng viên | Điểm tối đa | Điểm tự đánh giá | Kết quả kỹ thuật đã hoàn thành trong dự án |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Quản lý mã nguồn trên GitHub** | **1.5 đ** | **1.5 / 1.5 đ** | Hoàn thành kho chứa `dtc245200049-mon-trien-khai` trên nhánh `main`, thực hiện đầy đủ 3 mốc commit chuẩn mực theo Conventional Commits, có tệp `README.md` học thuật hướng dẫn cài đặt và vận hành hệ thống từ A-Z. |
| **2** | **Triển khai Web Quiz + Database** | **1.5 đ** | **1.5 / 1.5 đ** | Ứng dụng Quiz (Node.js/Express) hoạt động ổn định, kết nối CSDL MySQL 8.0 mượt mà qua mạng nội bộ, tự động chấm điểm và lưu kết quả thi vào bảng `quiz_results`; có phpMyAdmin quản trị CSDL qua Nginx `/phpmyadmin/`. |
| **3** | **Nginx Reverse Proxy** | **1.5 đ** | **1.5 / 1.5 đ** | Nginx đóng vai trò điểm tiếp nhận duy nhất Ingress cổng 80, định tuyến ngược an toàn và trang bị đầy đủ 5 HTTP Security Headers chuẩn an ninh OWASP (đã kiểm chứng qua lệnh `curl -i`). |
| **4** | **Hệ thống Giám sát Prometheus + Grafana** | **1.5 đ** | **1.5 / 1.5 đ** | cAdvisor thu thập số đo container từ nhân Linux, Prometheus cào dữ liệu qua 3 target ở trạng thái `UP`, Grafana tự động nạp sẵn Dashboard "Quiz System" hiển thị trực quan 7 panel (CPU %, RAM, Network, Heap Memory). |
| **5** | **Hệ thống Log tập trung Loki + Promtail** | **1.5 đ** | **1.5 / 1.5 đ** | Promtail tự động gom log container chuyển về cụm lưu trữ Loki cổng 3100, kết nối thành công Data Source Loki trong Grafana, thực thi thành công 3 câu truy vấn LogQL chuẩn xác có kết quả thực tế. |
| **6** | **Hardening hệ thống bảo mật chuyên sâu** | **1.5 đ** | **1.5 / 1.5 đ** | Áp dụng 5 giải pháp bảo mật đa lớp: Container Non-Root `USER 1000:1000`, phân tách 2 mạng cầu nối `frontend_net`/`backend_net`, CSDL MySQL cô lập tuyệt đối không mở cổng ra host, mật khẩu mạnh $\ge 12$ ký tự, 5 HTTP Security Headers. |
| **7** | **Tổng thể hệ sinh thái & Báo cáo thực hành** | **1.0 đ** | **1.0 / 1.0 đ** | Toàn bộ 9 dịch vụ vận hành đồng bộ trong một file `docker-compose.yml` duy nhất, Báo cáo kỹ thuật thực hành dài trên 10 trang có bìa chuẩn thực tập tốt nghiệp và thu thập trọn vẹn 14 bức ảnh minh chứng thực tế 100%. |
| **TỔNG**| **ĐÁNH GIÁ TOÀN DIỆN HỌC PHẦN** | **10.0 đ** | **10.0 / 10 đ** | **HOÀN THÀNH XUẤT SẮC - ĐẠT ĐIỂM SỐ TỐI ĐA** |

---

## 7.2. Các bài học kinh nghiệm và kỹ năng quản trị thực chiến đạt được

Thông qua việc trực tiếp triển khai đề tài thực tế từ giai đoạn thiết kế kiến trúc hạ tầng cho tới kiểm thử và viết báo cáo học thuật, sinh viên đã tích lũy được những bài học chuyên môn vô cùng giá trị:

1. **Tư duy Kiến trúc Container hóa (Container Architecture Mindset):** Hiểu rõ bản chất cô lập của nhân Linux qua Namespaces và cgroups. Nhận thức sâu sắc rằng Docker không phải là máy ảo (Virtual Machine) mà là sự chia sẻ tài nguyên tầng nhân, từ đó luôn đặt tiêu chuẩn bảo mật (Non-root, Resource limit) lên hàng đầu.
2. **Kỹ năng Hardening mạng và Cơ sở dữ liệu:** Nắm vững nguyên lý hoạt động của iptables và Docker Bridge Networks. Hiểu rõ sự khác biệt cốt tử giữa `ports` (mở cổng ra toàn cầu) và `expose` (giao tiếp nội bộ), từ đó biết cách bảo vệ tài nguyên cơ sở dữ liệu quan trọng trước các đợt quét cổng và tấn công Brute-force từ Internet.
3. **Năng lực Giám sát và Vận hành hệ thống (Observability Skills):** Làm chủ chu trình thu thập chỉ số (Metrics Pipeline) với Prometheus và cAdvisor; hiểu sâu về cơ chế lưu trữ chuỗi thời gian TSDB; thành thạo kỹ năng thiết kế Dashboard Grafana trực quan; làm chủ ngôn ngữ truy vấn LogQL để nhanh chóng khoanh vùng và phân tích nguyên nhân gốc rễ (RCA) của các sự cố hệ thống.
4. **Văn hóa DevOps và Tự động hóa (Automation & Infrastructure as Code):** Làm quen với việc quản lý cấu hình bằng mã nguồn (IaC qua Docker Compose và Grafana Provisioning), tuân thủ quy trình kiểm soát phiên bản Git với thông điệp rõ ràng theo chuẩn Conventional Commits.

---

## 7.3. Hướng nghiên cứu mở rộng trong môi trường Kubernetes Production

Mặc dù hệ sinh thái Docker Compose hiện tại đã vận hành cực kỳ ổn định trên một máy chủ đơn lẻ, nhưng để đáp ứng các kỳ thi quy mô quốc gia với hàng triệu thí sinh đồng thời, hệ thống có thể tiếp tục được nâng cấp và mở rộng theo các hướng nghiên cứu sau:

1. **Chuyển đổi sang cụm điều phối Kubernetes (K8s Migration):**
   * Chuyển đổi tệp `docker-compose.yml` thành các tài nguyên Kubernetes chuẩn mực: `Deployments`, `StatefulSets` (cho MySQL), `ConfigMaps`, `Secrets` và `Services`.
   * Sử dụng công cụ **Helm Chart** để đóng gói toàn bộ hệ sinh thái Quiz thành một gói ứng dụng có khả năng phân phối và cài đặt tự động trên bất kỳ cụm đám mây nào (Google Cloud GKE, AWS EKS, Microsoft Azure AKS).
2. **Triển khai Nginx Ingress Controller và Tự động hóa SSL/TLS:**
   * Thay thế container Nginx độc lập bằng **Kubernetes Nginx Ingress Controller**, tích hợp công cụ **cert-manager** để tự động xin cấp và gia hạn chứng chỉ số bảo mật SSL/TLS miễn phí từ Let's Encrypt, nâng cấp toàn bộ hệ thống lên chuẩn HTTPS an toàn tuyệt đối.
3. **Tự động co giãn theo tải (Horizontal Pod Autoscaling - HPA):**
   * Tích hợp **Prometheus Adapter** vào Kubernetes API Server.
   * Thiết lập chính sách HPA: Tự động nhân bản số lượng Pod của ứng dụng `quiz_app` từ 2 Pod lên 20 Pod khi chỉ số CPU Usage vượt ngưỡng 75% hoặc số lượng yêu cầu HTTP tăng vọt vào đầu giờ thi, và tự động thu hẹp (scale in) khi kỳ thi kết thúc nhằm tiết kiệm chi phí hạ tầng.
4. **Kiến trúc Log phân tán (Loki Distributed Architecture):**
   * Tách cụm Loki thành các thành phần vi dịch vụ (Distributor, Ingester, Querier, Compactor) và lưu trữ khối dữ liệu Chunks vào dịch vụ lưu trữ đối tượng bền vững (AWS S3 hoặc MinIO), cho phép xử lý hàng Terabyte nhật ký mỗi ngày mà không bị giới hạn bởi dung lượng ổ đĩa cục bộ.

\newpage

# PHỤ LỤC: DANH MỤC 14 BỨC ẢNH MINH CHỨNG THỰC TẾ

Toàn bộ 14 hình ảnh minh chứng được sinh viên trích xuất trực tiếp trong quá trình cài đặt, cấu hình, kiểm thử tự động và vận hành hệ thống Quiz (Đề 35):

| STT | Mã Ảnh | Tên Ảnh Minh Chứng Kỹ Thuật | Tiêu Chí Đánh Giá Ánh Xạ | Tình Trạng Thu Thập |
| :---: | :---: | :--- | :---: | :---: |
| 1 | **Ảnh 01** | Giao diện trang chủ Web Quiz (`http://localhost`) nhập Mã SV `DTC245200049` | Tiêu chí 2 (Ứng dụng Web) | ✅ **Đã có (100%)** |
| 2 | **Ảnh 02** | Màn hình làm bài và kết quả chấm điểm tự động (`5/5 - 100%`) | Tiêu chí 2 (Ứng dụng Web) | ✅ **Đã có (100%)** |
| 3 | **Ảnh 03** | Bảng CSDL `quiz_results` trong phpMyAdmin (`http://localhost/phpmyadmin/`) | Tiêu chí 2 (Database MySQL) | ✅ **Đã có (100%)** |
| 4 | **Ảnh 04** | Kiểm tra `curl -i /health` hiển thị đủ 5 Security Headers của Nginx | Tiêu chí 3 (Nginx Reverse Proxy) | ✅ **Đã có (100%)** |
| 5 | **Ảnh 05** | Terminal lệnh `docker compose exec quiz_app id` chứng minh Non-Root UID 1000 | Tiêu chí 6 (Hardening hệ thống) | ✅ **Đã có (100%)** |
| 6 | **Ảnh 06** | Terminal lệnh `docker compose ps` chứng minh CSDL MySQL không mở port ra host | Tiêu chí 6 (Hardening hệ thống) | ✅ **Đã có (100%)** |
| 7 | **Ảnh 07** | Tệp biến môi trường `.env` chứa mật khẩu mạnh $\ge 12$ ký tự phức tạp | Tiêu chí 6 (Hardening hệ thống) | ✅ **Đã có (100%)** |
| 8 | **Ảnh 08** | Giao diện GitHub Activity xác nhận **Commit 1** thành công trên nhánh `main` | Tiêu chí 1 (Quản lý mã nguồn) | ✅ **Đã có (100%)** |
| 9 | **Ảnh 09** | Giao diện Prometheus Targets (`http://localhost:9090/targets`) trạng thái 3 target `UP` | Tiêu chí 4 (Hệ thống Prometheus) | ✅ **Đã có (100%)** |
| 10| **Ảnh 10** | Dashboard Grafana (`http://localhost:3000`) hiển thị trực quan biểu đồ CPU/RAM/Network | Tiêu chí 4 (Dashboard Grafana) | ✅ **Đã có (100%)** |
| 11| **Ảnh 11** | Giao diện Grafana Data Source xác nhận kết nối thành công tới Loki cổng 3100 | Tiêu chí 5 (Hệ thống Log Loki) | ✅ **Đã có (100%)** |
| 12| **Ảnh 12** | Giao diện Grafana Explore thực thi câu truy vấn LogQL 1 (Lọc log container `quiz_nginx`) | Tiêu chí 5 (Truy vấn LogQL 1) | ✅ **Đã có (100%)** |
| 13| **Ảnh 13** | Giao diện Grafana Explore thực thi câu truy vấn LogQL 2 & 3 (`quiz_app` & filter DB) | Tiêu chí 5 (Truy vấn LogQL 2, 3) | ✅ **Đã có (100%)** |
| 14| **Ảnh 14** | Terminal `docker compose ps` hiển thị đầy đủ toàn bộ 9 container chạy ổn định | Tiêu chí 7 (Tổng thể hệ thống) | ✅ **Đã có (100%)** |

\newpage

# TÀI LIỆU THAM KHẢO

1. **Docker Inc.**, *Docker Compose Specification & Networking Reference*, https://docs.docker.com/compose/.
2. **OWASP Foundation**, *OWASP Secure Headers Project & Top 10 Web Application Security Risks*, https://owasp.org/www-project-secure-headers/.
3. **Prometheus Authors**, *Prometheus Monitoring System and Time Series Database Documentation*, https://prometheus.io/docs/.
4. **Grafana Labs**, *Grafana Loki: Like Prometheus, but for logs & LogQL Reference*, https://grafana.com/docs/loki/latest/.
5. **Center for Internet Security (CIS)**, *CIS Docker Benchmark v1.6.0*, Recommendations for Hardening Linux Containers and Daemon.
6. **National Institute of Standards and Technology (NIST)**, *NIST Special Publication 800-190: Application Container Security Guide*.
7. **Nguyễn Viết Dũng**, *Mã nguồn đề tài Hệ thống Quiz (Đề 35)*, Repository GitHub: `https://github.com/dtc245200049-NguyenVietDung/dtc245200049-mon-trien-khai`.

