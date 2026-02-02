/* global setInterval */

// Menu toggle for mobile
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });
}

// Accordion functionality
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach((header) => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    item.classList.toggle('active');
  });
});

// Social proof notifications
const notificationContainer = document.getElementById('notification-container');
if (notificationContainer) {
  // Example names and messages; these can be extended to 300+ easily
  const notifications = [
    'شهد أنهت خطة 7 أيام ✅ وتقول: “التحاسب اليومي فرق معي بشكل مو طبيعي.”',
    'عبدالله الحربي شارك خطته مع صديقه 📤 — “إذا ما شاركتها ما ألتزم!”',
    'فهد السبيعي رفع مستواه في القراءة خلال أسبوع 📈 — “صرت أفهم أسرع.”',
    'تركي القحطاني: “التصحيح الفوري يخليك تنتبه لخطأك بنفس اللحظة.”',
    'جود تقول: “جربت أكثر من مصدر… هنا الخطة مرتبة وواضحة.”',
    'نورة: “ركزت على القواعد اللي تتكرر… وفرق معي.”',
    'سارة: “قسم الاستماع كان مرعب… الحين صار عندي أسلوب أجاوب.”',
    'ريان سجّل نتيجته وشارك الخطة 🔥',
    'مشاعل: “الخطة يوم بيوم خلتني ما أضيع.”',
    'عبدالرحمن: “أول مرة أحس اختبار تحديد مستوى فعلاً مفيد.”'
  ];
  let index = 0;
  const showNotification = () => {
    // Create element
    const div = document.createElement('div');
    div.className = 'notification';
    div.textContent = notifications[index];
    // Append
    notificationContainer.appendChild(div);
    // Remove after 8 seconds
    setTimeout(() => {
      div.remove();
    }, 8000);
    // Increment index
    index = (index + 1) % notifications.length;
  };
  // Start cycle every 45 seconds
  showNotification();
  setInterval(showNotification, 45000);
}

// Register service worker for PWA (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.error('Service Worker registration failed', err));
  });
}