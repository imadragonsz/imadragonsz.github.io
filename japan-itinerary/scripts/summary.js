document.addEventListener("DOMContentLoaded", async function () {
  const summaryContainer = document.getElementById("summaryContainer");

  document.body.classList.add("dark-mode"); // Always start in dark mode

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
      localStorage.setItem("mode", !isDark ? "dark" : "light");
    });
  }
  // Load itinerary data from Supabase
  const { data, error } = await supabase
    .from("Itinerary")
    .select("activity,participants,start_date,end_date");
  if (error) {
    summaryContainer.innerHTML = "<p>Error loading data.</p>";
    console.error(error);
    return;
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

  // Prepare summary map
  const personMap = {};
  people.forEach((p) => (personMap[p] = []));
  data.forEach((item) => {
    const participants = item.participants ? item.participants.split(";") : [];
    participants.forEach((p) => {
      personMap[p].push({
        activity: item.activity,
        start_date: item.start_date,
        end_date: item.end_date,
      });
    });
  });

  // Render summary
  summaryContainer.innerHTML = "";
  for (const person in personMap) {
    const card = document.createElement("div");
    card.className = "summary-card dark-mode";
    const title = document.createElement("h3");
    title.textContent = person;
    card.appendChild(title);
    const ul = document.createElement("ul");
    personMap[person].forEach((act) => {
      const li = document.createElement("li");
      li.className = "dark-mode";
      li.textContent = act.activity;
      if (act.start_date || act.end_date) {
        li.textContent += ` (${act.start_date || ""}${
          act.end_date ? " - " + act.end_date : ""
        })`;
      }
      ul.appendChild(li);
    });
    card.appendChild(ul);
    summaryContainer.appendChild(card);
  }
});
