const WORKER_URL = 'https://shy-mud-4771.tnkissac828.workers.dev';

document.addEventListener('DOMContentLoaded', () => {

  // Scroll fade-in
  const sections = document.querySelectorAll('.fade-section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  sections.forEach((section) => observer.observe(section));

  // Visitor registry form
  const form = document.getElementById('registryForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('formBtn');
    const successEl = document.getElementById('formSuccess');
    const errorEl = document.getElementById('formError');

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const message = document.getElementById('reg-message').value.trim();

    btn.disabled = true;
    btn.textContent = 'Sending…';
    successEl.style.display = 'none';
    errorEl.style.display = 'none';

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        form.reset();
        successEl.style.display = 'block';
        btn.textContent = 'Sign the Registry';
        btn.disabled = false;
      } else {
        throw new Error('Server error');
      }
    } catch {
      errorEl.style.display = 'block';
      btn.textContent = 'Sign the Registry';
      btn.disabled = false;
    }
  });
});
