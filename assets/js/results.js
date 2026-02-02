/* Populate results page from localStorage */

document.addEventListener('DOMContentLoaded', () => {
  const results = JSON.parse(localStorage.getItem('quizResults')) || {};
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const shareMessage = localStorage.getItem('shareMessage') || '';
  const correctEl = document.getElementById('correct-count');
  const totalEl = document.getElementById('total-count');
  const scoreEl = document.getElementById('result-score');
  const analysisEl = document.getElementById('section-analysis');
  const planDescriptionEl = document.getElementById('plan-description');
  const planTableEl = document.getElementById('plan-table');
  const shareTextEl = document.getElementById('share-text');
  // Set share message
  if (shareTextEl) {
    shareTextEl.value = shareMessage;
  }
  // Display counts
  if (results.correctCount !== undefined) {
    correctEl.textContent = results.correctCount;
    totalEl.textContent = results.totalCount;
    // Determine overall rating
    let rating;
    const percentage = (results.correctCount / results.totalCount) * 100;
    if (percentage >= 80) rating = 'متقدم';
    else if (percentage >= 60) rating = 'متوسط';
    else rating = 'مبتدئ';
    scoreEl.textContent = rating;
    // Section analysis
    analysisEl.innerHTML = '';
    for (const sec in results.sectionCounts) {
      const obj = results.sectionCounts[sec];
      const perc = obj.total > 0 ? Math.round((obj.correct / obj.total) * 100) : 0;
      const div = document.createElement('div');
      div.className = 'section-row';
      div.innerHTML = `<strong>${sec}</strong>: ${obj.correct} / ${obj.total} (${perc}%)`;
      analysisEl.appendChild(div);
    }
    // Generate plan only if the test is comprehensive (>= 50 أسئلة)
    if (results.totalCount >= 50) {
      let planType;
      if (percentage >= 80) planType = 'متقدمة';
      else if (percentage >= 60) planType = 'متوسطة';
      else planType = 'أساسية';
      planDescriptionEl.textContent = `نقترح عليك خطة ${planType}. الجدول أدناه يوضح مهامك اليومية.`;
      const days = ['اليوم 1', 'اليوم 2', 'اليوم 3', 'اليوم 4', 'اليوم 5', 'اليوم 6', 'اليوم 7'];
      const tasks = {
        grammar: 'مراجعة قواعد + تمارين',
        vocab: 'تعلم مفردات + بطاقات',
        reading: 'قراءة مقالات وتلخيص',
        listening: 'استماع لمقاطع صوتية',
        mixed: 'مراجعة شاملة + اختبار قصير'
      };
      days.forEach((day, idx) => {
        const tr = document.createElement('tr');
        const tdDay = document.createElement('td');
        tdDay.textContent = day;
        const tdTask = document.createElement('td');
        const keys = Object.keys(tasks);
        tdTask.textContent = tasks[keys[idx % keys.length]];
        tr.appendChild(tdDay);
        tr.appendChild(tdTask);
        planTableEl.appendChild(tr);
      });
    } else {
      // Hide plan section if test is short
      planDescriptionEl.textContent = 'هذا اختبار قصير للتدريب فقط؛ لا توجد خطة مفصلة.';
      planTableEl.innerHTML = '';
    }
  }
  // Copy share message
  const copyBtn = document.getElementById('copy-share');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      shareTextEl.select();
      document.execCommand('copy');
      copyBtn.textContent = 'تم النسخ';
      setTimeout(() => (copyBtn.textContent = 'نسخ الرسالة'), 2000);
    });
  }
  // Download PDF: simply trigger print
  const downloadPdf = document.getElementById('download-pdf');
  if (downloadPdf) {
    downloadPdf.addEventListener('click', () => {
      window.print();
    });
  }
});