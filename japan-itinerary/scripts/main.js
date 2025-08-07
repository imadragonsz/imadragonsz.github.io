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
    navContent.style.display = "none";
  }

  const btn = document.getElementById("showSummaryBtn");
  if (btn) {
    btn.addEventListener("click", showActivitySummary);
  }
});

async function loadParticipants() {
  const { data, error } = await supabase
    .from("Itinerary")
    .select("participants");
  if (error) {
    console.error("Error loading participants:", error);
    return;
  }
  // Collect all participants from all rows
  let allNames = [];
  data.forEach((row) => {
    if (row.participants) {
      allNames = allNames.concat(
        row.participants.split(";").map((n) => n.trim())
      );
    }
  });
  // Remove duplicates and empty strings
  participants = [...new Set(allNames)].filter(Boolean);
  people = [...participants]; // If you use 'people' elsewhere
  renderParticipants();
  // If you have checkboxes or other UI, call their render function here
  // renderParticipantCheckboxes();
}

// Render participants list in the collapsible menu
function renderParticipants() {
  const list = document.getElementById("participants-list");
  list.innerHTML = "";
  participants.forEach((name, idx) => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });
}
// Collapsible toggle for participants menu
document.querySelector(".participants-toggle-btn").onclick = function () {
  const content = document.querySelector(".participants-content");
  content.style.display = content.style.display === "none" ? "block" : "none";
};

// Initial load
loadParticipants();
