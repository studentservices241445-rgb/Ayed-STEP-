/* Custom quiz logic based on selected section and count */
document.addEventListener('DOMContentLoaded', () => {
  // Parse query params
  const params = new URLSearchParams(window.location.search);
  const section = params.get('section');
  const count = parseInt(params.get('count'), 10) || 5;
  // Elements
  const totalEl = document.getElementById('custom-total');
  const currentEl = document.getElementById('custom-current');
  const questionEl = document.getElementById('custom-question');
  const optionsEl = document.getElementById('custom-options');
  const feedbackEl = document.getElementById('custom-feedback');
  const prevBtn = document.getElementById('custom-prev');
  const nextBtn = document.getElementById('custom-next');
  // For results
  const container = document.querySelector('.quiz-main .container');
  let customQuestions = [];
  let currentIndex = 0;
  let userAnswers = [];
  // Load question bank
  fetch('assets/data/question-bank.json')
    .then((res) => res.json())
    .then((data) => {
      // Filter by section
      const filtered = data.filter((q) => q.section === section);
      // Shuffle and slice
      filtered.sort(() => Math.random() - 0.5);
      customQuestions = filtered.slice(0, Math.min(count, filtered.length));
      totalEl.textContent = customQuestions.length;
      renderQuestion();
    });
  function renderQuestion() {
    const q = customQuestions[currentIndex];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';
    feedbackEl.textContent = '';
    q.options.forEach((opt, idx) => {
      const div = document.createElement('div');
      div.className = 'option';
      const id = `custom-${currentIndex}-${idx}`;
      div.innerHTML = `<input type="radio" id="${id}" name="customOption" value="${idx}" /> <label for="${id}">${opt}</label>`;
      optionsEl.appendChild(div);
    });
    prevBtn.disabled = currentIndex === 0;
    nextBtn.textContent = currentIndex === customQuestions.length - 1 ? 'إنهاء' : 'التالي';
    // Pre-select answer
    if (userAnswers[currentIndex] !== undefined) {
      const input = document.querySelector(`input[name='customOption'][value='${userAnswers[currentIndex]}']`);
      if (input) {
        input.checked = true;
        showFeedback(userAnswers[currentIndex]);
      }
    }
    currentEl.textContent = currentIndex + 1;
  }
  function showFeedback(selected) {
    const q = customQuestions[currentIndex];
    if (selected === q.answer) {
      feedbackEl.textContent = 'إجابة صحيحة! ' + q.explanation;
      feedbackEl.style.color = '#059669';
    } else {
      feedbackEl.textContent = 'إجابة خاطئة. ' + q.explanation;
      feedbackEl.style.color = '#b91c1c';
    }
  }
  optionsEl.addEventListener('change', (e) => {
    const value = parseInt(e.target.value, 10);
    userAnswers[currentIndex] = value;
    showFeedback(value);
  });
  nextBtn.addEventListener('click', () => {
    if (currentIndex < customQuestions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  });
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });
  function finishQuiz() {
    let correct = 0;
    customQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correct++;
    });
    // Clear container and show summary
    container.innerHTML = '';
    const summary = document.createElement('div');
    summary.className = 'support-response';
    summary.innerHTML =
      `<p>انتهى الاختبار!</p><p>عدد الإجابات الصحيحة: ${correct} من ${customQuestions.length}.</p>`;
    const share = document.createElement('p');
    share.textContent =
      'يمكنك إنشاء اختبار جديد أو مشاركة الرابط مع أصدقائك من خلال صفحة إنشاء الاختبار.';
    summary.appendChild(share);
    container.appendChild(summary);
  }
});