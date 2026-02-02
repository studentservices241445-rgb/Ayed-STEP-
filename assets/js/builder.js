/* Quiz builder logic */
document.addEventListener('DOMContentLoaded', () => {
  const createBtn = document.getElementById('create-quiz');
  const sectionEl = document.getElementById('builder-section');
  const countEl = document.getElementById('builder-count');
  const linkContainer = document.getElementById('quiz-link');
  const linkInput = document.getElementById('custom-link');
  const copyCustom = document.getElementById('copy-custom');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const sec = sectionEl.value;
      const count = parseInt(countEl.value, 10);
      if (count < 3 || count > 20) {
        alert('يرجى اختيار عدد أسئلة بين 3 و 20.');
        return;
      }
      // Build URL
      const url = `${window.location.origin}/custom-quiz.html?section=${sec}&count=${count}`;
      linkInput.value = url;
      linkContainer.classList.remove('hidden');
    });
  }
  if (copyCustom) {
    copyCustom.addEventListener('click', () => {
      linkInput.select();
      document.execCommand('copy');
      copyCustom.textContent = 'تم النسخ';
      setTimeout(() => (copyCustom.textContent = 'نسخ الرابط'), 2000);
    });
  }
});