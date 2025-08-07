document.addEventListener("DOMContentLoaded", function () {
  loadItinerary();

  document.body.classList.add("dark-mode");

  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    toggleBtn.textContent = "🌞";
    toggleBtn.addEventListener("click", function () {
      const isDark = document.body.classList.contains("dark-mode");
      document.body.classList.toggle("dark-mode", !isDark);
      toggleBtn.textContent = isDark ? "🌙" : "🌞";
      document
        .querySelectorAll(
          ".week-section, .collapsible, .content, li, .summary-card"
        )
        .forEach((el) => {
          el.classList.toggle("dark-mode", !isDark);
        });
    });
  }
  const navToggleBtn = document.querySelector(".nav-toggle-btn");
  const navContent = document.querySelector(".nav-content");
  if (navToggleBtn && navContent) {
    navToggleBtn.addEventListener("click", function () {
      navContent.style.display =
        navContent.style.display === "block" ? "none" : "block";
    });
    // Hide menu by default
    navContent.style.display = "none";
  }

  const btn = document.getElementById("showSummaryBtn");
  if (btn) {
    btn.addEventListener("click", showActivitySummary);
  }
});
