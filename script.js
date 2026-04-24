const SUPABASE_URL      = 'https://jtifhcvbgxqwlywugvjv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aWZoY3ZiZ3hxd2x5d3Vndmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDc5NTgsImV4cCI6MjA4ODA4Mzk1OH0.UfRVLuvM8_HPvKXUEDXb0cxR50znv16L5Tf99AnSc7g';

async function submitGuestBook(name, email, message) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/issac-guest-book`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, message }),
  });
  if (!res.ok) throw new Error(`submission failed: ${res.status}`);
  return res.json();
}

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
      await submitGuestBook(name, email, message);
      form.reset();
      successEl.style.display = 'block';
      btn.textContent = 'Sign the Registry';
      btn.disabled = false;
    } catch {
      errorEl.style.display = 'block';
      btn.textContent = 'Sign the Registry';
      btn.disabled = false;
    }
  });
});
