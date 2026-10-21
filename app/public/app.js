document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const stepIntro = document.getElementById('step-intro');
  const stepQuiz = document.getElementById('step-quiz');
  const stepResult = document.getElementById('step-result');
  const stepHistory = document.getElementById('step-history');

  const studentIdInput = document.getElementById('student-id');
  const studentNameInput = document.getElementById('student-name');
  const btnStart = document.getElementById('btn-start');
  const btnViewHistory = document.getElementById('btn-view-history');
  const btnSubmit = document.getElementById('btn-submit');
  const btnRetry = document.getElementById('btn-retry');
  const btnShowHistoryFromRes = document.getElementById('btn-show-history-from-res');
  const btnBackHome = document.getElementById('btn-back-home');

  const questionsContainer = document.getElementById('questions-container');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const pillId = document.getElementById('pill-id');
  const pillName = document.getElementById('pill-name');

  const dbBadge = document.getElementById('db-badge');
  const systemBadge = document.getElementById('system-badge');

  let questions = [];
  let userAnswers = {};

  // Check backend health & DB connection
  async function checkHealth() {
    try {
      const res = await fetch('/health');
      if (res.ok) {
        const data = await res.json();
        if (data.database === 'CONNECTED') {
          dbBadge.textContent = '● DB: MySQL Connected';
          dbBadge.style.color = '#34d399';
          dbBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        } else {
          dbBadge.textContent = '● DB: Initializing...';
          dbBadge.style.color = '#f59e0b';
        }
      }
    } catch (e) {
      dbBadge.textContent = '● Backend: Offline';
      dbBadge.style.color = '#ef4444';
    }
  }

  checkHealth();
  setInterval(checkHealth, 5000);

  // Switch Views
  function showStep(step) {
    [stepIntro, stepQuiz, stepResult, stepHistory].forEach(el => el.classList.add('hidden'));
    step.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Load Questions & Start Quiz
  btnStart.addEventListener('click', async () => {
    const studentId = studentIdInput.value.trim();
    const studentName = studentNameInput.value.trim();

    if (!studentId || !studentName) {
      alert('Vui lòng nhập đầy đủ Mã số sinh viên và Họ tên!');
      return;
    }

    pillId.textContent = studentId;
    pillName.textContent = studentName;

    btnStart.disabled = true;
    btnStart.textContent = 'Đang nạp câu hỏi...';

    try {
      const res = await fetch('/api/questions');
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Không thể tải câu hỏi.');
      }
      questions = await res.json();

      if (questions.length === 0) {
        alert('Chưa có câu hỏi trong cơ sở dữ liệu!');
        btnStart.disabled = false;
        btnStart.textContent = 'Bắt Đầu Làm Bài Thi';
        return;
      }

      userAnswers = {};
      renderQuestions();
      updateProgress();
      showStep(stepQuiz);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      btnStart.disabled = false;
      btnStart.textContent = 'Bắt Đầu Làm Bài Thi';
    }
  });

  // Render Questions
  function renderQuestions() {
    questionsContainer.innerHTML = '';
    questions.forEach((q, index) => {
      const qCard = document.createElement('div');
      qCard.className = 'question-card';
      qCard.id = `q-card-${q.id}`;

      let optionsHtml = '';
      q.options.forEach((opt, optIdx) => {
        optionsHtml += `
          <label class="option-item" data-qid="${q.id}" data-opt="${optIdx}">
            <input type="radio" name="question_${q.id}" value="${optIdx}" class="option-radio">
            <span class="option-label">${opt}</span>
          </label>
        `;
      });

      qCard.innerHTML = `
        <div class="question-header">
          <div class="question-title">
            <span class="question-num">Câu ${index + 1}:</span> ${q.question}
          </div>
          <span class="category-tag">${q.category || 'Hạ tầng'}</span>
        </div>
        <div class="options-grid">
          ${optionsHtml}
        </div>
      `;
      questionsContainer.appendChild(qCard);
    });

    // Add click listeners to option items
    document.querySelectorAll('.option-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const qid = item.getAttribute('data-qid');
        const opt = parseInt(item.getAttribute('data-opt'), 10);
        userAnswers[qid] = opt;

        const parentGrid = item.closest('.options-grid');
        parentGrid.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        const radio = item.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        updateProgress();
      });
    });
  }

  // Update Progress
  function updateProgress() {
    const answeredCount = Object.keys(userAnswers).length;
    const total = questions.length;
    const pct = total > 0 ? (answeredCount / total) * 100 : 0;
    progressBar.style.width = `${pct}%`;
    progressText.textContent = `Đã làm ${answeredCount}/${total} câu`;
  }

  // Submit Quiz
  btnSubmit.addEventListener('click', async () => {
    const answeredCount = Object.keys(userAnswers).length;
    const total = questions.length;

    if (answeredCount < total) {
      const confirmSubmit = confirm(`Bạn mới trả lời ${answeredCount}/${total} câu. Bạn có chắc chắn muốn nộp bài sớm không?`);
      if (!confirmSubmit) return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Đang chấm điểm...';

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentIdInput.value.trim(),
          student_name: studentNameInput.value.trim(),
          answers: userAnswers
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nộp bài thất bại.');

      displayResult(data);
      showStep(stepResult);
    } catch (err) {
      alert('Lỗi nộp bài: ' + err.message);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Nộp Bài Thi';
    }
  });

  // Display Result
  function displayResult(result) {
    document.getElementById('res-score').textContent = `${result.score}/${result.total}`;
    document.getElementById('res-percent').textContent = `${result.percentage}%`;

    const detailsContainer = document.getElementById('result-details');
    detailsContainer.innerHTML = '';

    result.details.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = `result-item ${item.isCorrect ? 'correct' : 'wrong'}`;
      div.innerHTML = `
        <h4>Câu ${idx + 1}: ${item.question}</h4>
        <div class="answer-row"><strong>Câu trả lời của bạn:</strong> ${item.userAnswer} ${item.isCorrect ? '✅ (Chính xác)' : '❌ (Sai)'}</div>
        ${!item.isCorrect ? `<div class="answer-row" style="color:#34d399"><strong>Đáp án đúng:</strong> ${item.correctAnswer}</div>` : ''}
        ${item.explanation ? `<div class="explanation-box">💡 <strong>Giải trình:</strong> ${item.explanation}</div>` : ''}
      `;
      detailsContainer.appendChild(div);
    });
  }

  // Load and View History
  async function loadHistory() {
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Đang tải dữ liệu...</td></tr>';
    showStep(stepHistory);

    try {
      const res = await fetch('/api/results');
      const list = await res.json();

      if (!Array.isArray(list) || list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có bài thi nào được ghi nhận.</td></tr>';
        return;
      }

      tbody.innerHTML = list.map(item => `
        <tr>
          <td>#${item.id}</td>
          <td><strong>${item.student_id}</strong></td>
          <td>${item.student_name}</td>
          <td><span style="color:#60a5fa; font-weight:700">${item.score}/${item.total}</span></td>
          <td><span style="color:${item.percentage >= 50 ? '#34d399' : '#ef4444'}; font-weight:700">${item.percentage}%</span></td>
          <td>${new Date(item.created_at).toLocaleString('vi-VN')}</td>
        </tr>
      `).join('');
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:#ef4444">Lỗi: ${e.message}</td></tr>`;
    }
  }

  btnViewHistory.addEventListener('click', loadHistory);
  btnShowHistoryFromRes.addEventListener('click', loadHistory);

  // Retry / Back
  btnRetry.addEventListener('click', () => {
    showStep(stepIntro);
  });

  btnBackHome.addEventListener('click', () => {
    showStep(stepIntro);
  });
});
