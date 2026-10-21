const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'quiz_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'quiz_user',
  password: process.env.DB_PASSWORD || 'Quiz#Sec2026!Deploy',
  database: process.env.DB_NAME || 'quiz_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let dbConnected = false;

// Retry connecting to MySQL (Self-healing initialization)
async function initDatabase() {
  const maxRetries = 30;
  let attempt = 0;

  while (attempt < maxRetries && !dbConnected) {
    attempt++;
    try {
      console.log(`[DB INIT] Dang thu ket noi toi MySQL (Lan ${attempt}/${maxRetries}) tai ${dbConfig.host}:${dbConfig.port}...`);
      pool = mysql.createPool(dbConfig);
      
      // Test connection
      const connection = await pool.getConnection();
      console.log('[DB INIT] Ket noi MySQL thanh cong!');
      connection.release();
      dbConnected = true;

      // Seed tables and data
      await setupSchemaAndSeed();
      break;
    } catch (err) {
      console.error(`[DB INIT ERROR] Lan ${attempt} that bai:`, err.message);
      if (attempt >= maxRetries) {
        console.error('[DB INIT FATAL] Khong the ket noi CSDL sau nhieu lan thu.');
      } else {
        await new Promise(res => setTimeout(res, 3000));
      }
    }
  }
}

async function setupSchemaAndSeed() {
  try {
    // Bang cau hoi quiz
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        options JSON NOT NULL,
        correct_answer INT NOT NULL,
        explanation TEXT,
        category VARCHAR(100) DEFAULT 'Triển khai & Quản trị Hệ thống'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Bang ket qua bai thi
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        student_name VARCHAR(100) NOT NULL,
        score INT NOT NULL,
        total INT NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Kiem tra va nap du lieu mau neu chua co
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM questions');
    if (rows[0].count === 0) {
      console.log('[DB SEED] Dang khoi tao 5 cau hoi mau chuan mon Trien khai He thong...');
      const sampleQuestions = [
        [
          'Tại sao trong mô hình Hardening mạng Docker cần phân chia thành frontend_net và backend_net?',
          JSON.stringify([
            'Để tăng tốc độ đường truyền mạng nội bộ',
            'Để cô lập CSDL MySQL, ngăn chặn truy cập trực tiếp từ Internet vào tầng dữ liệu',
            'Để Nginx có thể cấp phát địa chỉ IP tĩnh cho container',
            'Không có tác dụng bảo mật, chỉ để phân nhóm cho dễ quản lý'
          ]),
          1,
          'Cô lập mạng giúp hạn chế bề mặt tấn công; MySQL nằm hoàn toàn trong backend_net không bị lộ cổng ra ngoài host.'
        ],
        [
          'Mục đích của việc sử dụng chỉ thị USER 1000:1000 trong Dockerfile là gì?',
          JSON.stringify([
            'Cấp quyền quản trị tối cao (root) cho ứng dụng trong container',
            'Chạy container dưới quyền user không đặc quyền để chống lỗ hổng leo thang đặc quyền (Privilege Escalation)',
            'Để container tự động cập nhật hệ điều hành Alpine',
            'Tối ưu hóa dung lượng image khi build multi-stage'
          ]),
          1,
          'Non-root container đảm bảo nếu ứng dụng bị chiếm quyền điều khiển, kẻ tấn công không có quyền root trên host OS.'
        ],
        [
          'Header HTTP "X-Frame-Options: SAMEORIGIN" trong Nginx có tác dụng chính gì?',
          JSON.stringify([
            'Ngăn chặn tấn công Clickjacking bằng cách cấm nhúng trang web vào iframe trên domain lạ',
            'Ngăn chặn tấn công SQL Injection vào MySQL',
            'Mã hóa toàn bộ lưu lượng HTTP thành HTTPS',
            'Tự động phát hiện và chặn các cuộc tấn công DDoS'
          ]),
          0,
          'X-Frame-Options ngăn ngừa trang web bị nhúng vào frame/iframe độc hại để lừa người dùng nhấp chuột.'
        ],
        [
          'Trong cấu hình docker-compose, cú pháp nào sau đây giúp kết nối nội bộ giữa các container mà KHÔNG mở cổng ra ngoài host?',
          JSON.stringify([
            'ports: - "3306:3306"',
            'expose: - 3306 hoặc kết nối trực tiếp qua Docker network nội bộ',
            'network_mode: "host"',
            'publish_all_ports: true'
          ]),
          1,
          'Chỉ thị expose hoặc gọi trực tiếp container_name:port trong cùng Docker network giúp giao tiếp an toàn, không map port ra host.'
        ],
        [
          'Nginx Reverse Proxy đóng vai trò gì trong kiến trúc triển khai hệ thống phần mềm?',
          JSON.stringify([
            'Làm điểm tiếp nhận duy nhất (Single Ingress Point), cân bằng tải, định tuyến và thêm Security Headers bảo vệ ứng dụng',
            'Thay thế hoàn toàn cơ sở dữ liệu MySQL',
            'Tự động viết mã nguồn cho ứng dụng backend',
            'Chỉ có nhiệm vụ lưu cache file tĩnh mà không thể chuyển tiếp request'
          ]),
          0,
          'Reverse Proxy là cổng vào an toàn duy nhất bảo vệ các dịch vụ backend, đồng thời kiểm soát header và định tuyến lưu lượng.'
        ]
      ];

      for (const q of sampleQuestions) {
        await pool.query(
          'INSERT INTO questions (question, options, correct_answer, explanation) VALUES (?, ?, ?, ?)',
          q
        );
      }
      console.log('[DB SEED] Da them thanh cong 5 cau hoi mau vao CSDL!');
    }
  } catch (err) {
    console.error('[DB SCHEMA ERROR]:', err.message);
  }
}

// REST API Endpoints

// Middleware to count total HTTP requests
let totalRequests = 0;
app.use((req, res, next) => {
  totalRequests++;
  next();
});

// 1. Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: dbConnected ? 'CONNECTED' : 'CONNECTING',
    timestamp: new Date().toISOString(),
    service: 'quiz-app',
    user_uid: process.getuid ? process.getuid() : 'N/A (Windows/Emulated)'
  });
});

// 1.1. Prometheus Metrics endpoint
app.get('/metrics', (req, res) => {
  const mem = process.memoryUsage();
  const uptime = process.uptime();

  res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.send([
    '# HELP quiz_app_uptime_seconds Total uptime of Quiz App in seconds',
    '# TYPE quiz_app_uptime_seconds gauge',
    `quiz_app_uptime_seconds ${uptime.toFixed(2)}`,
    '',
    '# HELP quiz_app_requests_total Total number of HTTP requests processed',
    '# TYPE quiz_app_requests_total counter',
    `quiz_app_requests_total ${totalRequests}`,
    '',
    '# HELP quiz_app_memory_heap_used_bytes Heap memory used by Node.js in bytes',
    '# TYPE quiz_app_memory_heap_used_bytes gauge',
    `quiz_app_memory_heap_used_bytes ${mem.heapUsed}`,
    '',
    '# HELP quiz_app_memory_heap_total_bytes Total heap allocated by Node.js in bytes',
    '# TYPE quiz_app_memory_heap_total_bytes gauge',
    `quiz_app_memory_heap_total_bytes ${mem.heapTotal}`,
    '',
    '# HELP quiz_app_memory_rss_bytes Resident Set Size in bytes',
    '# TYPE quiz_app_memory_rss_bytes gauge',
    `quiz_app_memory_rss_bytes ${mem.rss}`,
    '',
    '# HELP quiz_app_db_connected Database connection status (1 = connected, 0 = disconnected)',
    '# TYPE quiz_app_db_connected gauge',
    `quiz_app_db_connected ${dbConnected ? 1 : 0}`,
    ''
  ].join('\n'));
});

// 2. Lay danh sach cau hoi (khong gui kem dap an dung)
app.get('/api/questions', async (req, res) => {
  if (!dbConnected) {
    return res.status(503).json({
      error: 'CSDL MySQL dang khoi dong, vui long thu lai trong giay lat.'
    });
  }

  try {
    const [rows] = await pool.query('SELECT id, question, options, category FROM questions ORDER BY id ASC');
    const formatted = rows.map(r => ({
      id: r.id,
      question: r.question,
      options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options,
      category: r.category
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Loi truy van cau hoi: ' + err.message });
  }
});

// 3. Nop bai thi va cham diem
app.post('/api/submit', async (req, res) => {
  if (!dbConnected) {
    return res.status(503).json({ error: 'CSDL MySQL chua san sang.' });
  }

  const { student_id, student_name, answers } = req.body;

  if (!student_id || !student_name || !answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Du lieu nop bai khong hop le. Vui long nhap ma sinh vien va ho ten.' });
  }

  try {
    const [questions] = await pool.query('SELECT id, question, options, correct_answer, explanation FROM questions');
    
    let score = 0;
    const total = questions.length;
    const results = [];

    questions.forEach(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer !== undefined && parseInt(userAnswer, 10) === q.correct_answer;
      if (isCorrect) score++;

      const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;

      results.push({
        id: q.id,
        question: q.question,
        userAnswer: userAnswer !== undefined ? opts[userAnswer] : 'Chưa trả lời',
        correctAnswer: opts[q.correct_answer],
        isCorrect: isCorrect,
        explanation: q.explanation
      });
    });

    const percentage = ((score / total) * 100).toFixed(2);

    // Luu ket qua vao bang quiz_results
    await pool.query(
      'INSERT INTO quiz_results (student_id, student_name, score, total, percentage) VALUES (?, ?, ?, ?, ?)',
      [student_id.trim(), student_name.trim(), score, total, percentage]
    );

    res.json({
      success: true,
      student_id,
      student_name,
      score,
      total,
      percentage: parseFloat(percentage),
      details: results
    });
  } catch (err) {
    res.status(500).json({ error: 'Loi cham diem va luu ket qua: ' + err.message });
  }
});

// 4. Xem lich su ket qua
app.get('/api/results', async (req, res) => {
  if (!dbConnected) {
    return res.status(503).json({ error: 'CSDL MySQL chua san sang.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM quiz_results ORDER BY id DESC LIMIT 20');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Loi lay ket qua: ' + err.message });
  }
});

// Start Express server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[QUIZ APP] He thong dang lang nghe tai http://0.0.0.0:${PORT}`);
  initDatabase();
});
