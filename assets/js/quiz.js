/* Handles the user form and quiz logic */

// Global variables
let questions = [];
let currentIndex = 0;
let userAnswers = [];
let sectionCounts = {};
let sections = {};

// Check attempt limit: user can take test once every 24 hours
const attemptWarningEl = document.getElementById('attempt-warning');
if (attemptWarningEl) {
  const lastTime = localStorage.getItem('lastTestTime');
  if (lastTime) {
    const diff = Date.now() - parseInt(lastTime, 10);
    if (diff < 24 * 60 * 60 * 1000) {
      // Show warning and disable start button
      attemptWarningEl.classList.remove('hidden');
      attemptWarningEl.textContent =
        'يمكنك إجراء الاختبار مرة واحدة كل 24 ساعة. يرجى العودة لاحقًا أو مراجعة خطة المذاكرة الخاصة بك.';
      if (startButton) {
        startButton.disabled = true;
      }
    }
  }
}

// DOM elements
const startButton = document.getElementById('start-quiz');
const userInfoForm = document.getElementById('user-info-form');
const quizContainer = document.getElementById('quiz-container');
const quizQuestionEl = document.getElementById('quiz-question');
const quizOptionsEl = document.getElementById('quiz-options');
const quizFeedbackEl = document.getElementById('quiz-feedback');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');

// Start quiz on button click
if (startButton) {
  startButton.addEventListener('click', async () => {
    // Save user info to localStorage
    const formData = new FormData(userInfoForm);
    const userInfo = Object.fromEntries(formData.entries());
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // Hide form and show quiz
    userInfoForm.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    // Load questions
    await loadQuestions();
    if (questions.length > 0) {
      // Initialize counts per section
      questions.forEach((q) => {
        if (!sectionCounts[q.section]) {
          sectionCounts[q.section] = { correct: 0, total: 0 };
        }
        sectionCounts[q.section].total++;
      });
      totalQuestionsSpan.textContent = questions.length;
      currentQuestionSpan.textContent = 1;
      renderQuestion();
    }
  });
}

// Load questions from JSON
async function loadQuestions() {
  try {
    const res = await fetch('assets/data/question-bank.json');
    const data = await res.json();
    // Shuffle questions and pick first 10 or 50
    data.sort(() => Math.random() - 0.5);
    const limit = data.length >= 50 ? 50 : data.length;
    questions = data.slice(0, limit);
  } catch (err) {
    console.error('Error loading questions:', err);
  }
}

// Render current question
function renderQuestion() {
  const q = questions[currentIndex];
  quizQuestionEl.textContent = q.question;
  quizOptionsEl.innerHTML = '';
  quizFeedbackEl.textContent = '';
  q.options.forEach((opt, idx) => {
    const div = document.createElement('div');
    div.className = 'option';
    const id = `option-${currentIndex}-${idx}`;
    div.innerHTML = `<input type="radio" id="${id}" name="option" value="${idx}" /> <label for="${id}">${opt}</label>`;
    quizOptionsEl.appendChild(div);
  });
  // Set nav buttons
  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === questions.length - 1 ? 'إنهاء الاختبار' : 'التالي';
  // Pre-select previously chosen answer if exists
  if (userAnswers[currentIndex] !== undefined) {
    const chosen = userAnswers[currentIndex];
    const input = document.querySelector(`input[name='option'][value='${chosen}']`);
    if (input) {
      input.checked = true;
      // Show feedback again
      showFeedback(chosen);
    }
  }
}

// Show feedback
function showFeedback(selectedIndex) {
  const q = questions[currentIndex];
  const correct = q.answer;
  if (selectedIndex === correct) {
    quizFeedbackEl.textContent = 'إجابة صحيحة! ' + q.explanation;
    quizFeedbackEl.style.color = '#059669';
  } else {
    quizFeedbackEl.textContent = 'إجابة خاطئة. ' + q.explanation;
    quizFeedbackEl.style.color = '#b91c1c';
  }
}

// Option change event
quizOptionsEl.addEventListener('change', (e) => {
  const selectedValue = parseInt(e.target.value, 10);
  userAnswers[currentIndex] = selectedValue;
  showFeedback(selectedValue);
});

// Next/Prev navigation
nextBtn.addEventListener('click', () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    currentQuestionSpan.textContent = currentIndex + 1;
    renderQuestion();
  } else {
    finishQuiz();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    currentQuestionSpan.textContent = currentIndex + 1;
    renderQuestion();
  }
});

// Finish quiz and compute results
function finishQuiz() {
  let correctCount = 0;
  // Reset per-section counts
  Object.keys(sectionCounts).forEach((sec) => {
    sectionCounts[sec].correct = 0;
  });
  questions.forEach((q, idx) => {
    const answer = userAnswers[idx];
    if (answer === q.answer) {
      correctCount++;
      sectionCounts[q.section].correct++;
    }
  });
  // Save results to localStorage
  const results = {
    correctCount,
    totalCount: questions.length,
    sectionCounts,
  };
  localStorage.setItem('quizResults', JSON.stringify(results));
  // Generate a shareable message
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const shareMessage =
    '﴿وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى﴾\n\n' +
    'جربت برنامج اختبار تحديد المستوى المجاني من أكاديمية عايد الرسمية وساعدني على تقييم مستواي ووضع خطة مذاكرة مفصلة.\n' +
    'يقيس مستواك عبر أسئلة متنوعة ويعرض لك نقاط القوة والضعف مع نصائح. البرنامج مجاني تمامًا ويهدف لخدمة الطلاب.\n' +
    'جرّبه الآن عبر هذا الرابط: ' +
    window.location.origin +
    '/index.html';
  localStorage.setItem('shareMessage', shareMessage);
  // Save timestamp for attempt limit
  localStorage.setItem('lastTestTime', Date.now().toString());
  // Redirect to results page
  window.location.href = 'results.html';
}