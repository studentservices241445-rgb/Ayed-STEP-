/* Handle support form submission */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('support-form');
  const responseEl = document.getElementById('support-response');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Pretend to send the message
      form.classList.add('hidden');
      responseEl.classList.remove('hidden');
    });
  }
});