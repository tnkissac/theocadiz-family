document.addEventListener('DOMContentLoaded', () => {
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
});
