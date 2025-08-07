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
      if (personMap[p]) {
        personMap[p].push({
          activity: item.activity,
          start_date: item.start_date,
          end_date: item.end_date,
        });
      }
    });
  });

  // Render summary with collapsible cards
  summaryContainer.innerHTML = "";
  for (const person in personMap) {
    const card = document.createElement("div");
    card.className = "summary-card dark-mode";

    // Collapsible header
    const header = document.createElement("button");
    header.className = "collapsible";
    header.textContent = person;
    header.style.width = "100%";
    header.style.textAlign = "left";
    header.style.fontSize = "1.1em";
    header.style.padding = "0.7em 1em";
    header.style.background = "#222";
    header.style.color = "#26c6da";
    header.style.border = "none";
    header.style.borderRadius = "8px 8px 0 0";
    header.style.cursor = "pointer";
    header.style.marginBottom = "0";
    card.appendChild(header);

    // Collapsible content
    const content = document.createElement("div");
    content.className = "collapsible-content";
    content.style.display = "none";
    content.style.padding = "1em";
    content.style.background = "#222";
    content.style.borderRadius = "0 0 8px 8px";

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
    content.appendChild(ul);
    card.appendChild(content);
    summaryContainer.appendChild(card);

    // Toggle collapsible on click
    header.addEventListener("click", function () {
      content.style.display =
        content.style.display === "none" ? "block" : "none";
    });
  }
});
