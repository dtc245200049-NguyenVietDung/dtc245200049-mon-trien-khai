# ==============================================================================
# DOCKERFILE - QUIZ APPLICATION (NON-ROOT HARDENED)
# Học phần: Triển khai & Quản trị Hệ thống Phần mềm
# Tuân thủ nghiêm ngặt tiêu chuẩn .cursorrules (USER 1000:1000)
# ==============================================================================

FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Khai báo môi trường Production
ENV NODE_ENV=production

# Sao chép manifest và cài đặt dependencies
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Sao chép toàn bộ mã nguồn ứng dụng
COPY . .

# HARDENING: Phân quyền toàn bộ thư mục cho người dùng không đặc quyền (UID/GID 1000)
RUN chown -R 1000:1000 /app

# BẮT BUỘC: Chuyển sang người dùng thường (non-root) để ngăn ngừa Privilege Escalation
USER 1000:1000

# Khai báo cổng nội bộ của ứng dụng
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["node", "server.js"]
