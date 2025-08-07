document.addEventListener("DOMContentLoaded", async function () {
  const calendarDiv = document.getElementById("calendar");

  // Dark mode toggle implementation
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

  // Collapsible navigation menu
  const navToggleBtn = document.querySelector(".nav-toggle-btn");
  const navContent = document.querySelector(".nav-content");
  if (navToggleBtn && navContent) {
    navToggleBtn.addEventListener("click", function () {
      navContent.style.display =
        navContent.style.display === "block" ? "none" : "block";
    });
    navContent.style.display = "none";
  }

  // Fetch activities from Supabase (now includes subactivities)
  const { data, error } = await supabase
    .from("Itinerary")
    .select(
      "activity,start_date,end_date,week,participants,duration,subactivities"
    );
  if (error) {
    calendarDiv.innerHTML = "<p>Error loading calendar data.</p>";
    console.error(error);
    return;
  }

  // Map activities to FullCalendar events
  const events = data
    .filter((item) => item.start_date)
    .map((item) => ({
      title: item.activity + (item.week ? ` (${item.week})` : ""),
      start: item.start_date,
      end: item.end_date || undefined,
      allDay: true,
      extendedProps: {
        participants: item.participants,
        duration: item.duration,
        week: item.week,
        activity: item.activity,
        start_date: item.start_date,
        end_date: item.end_date,
        subactivities: item.subactivities,
      },
    }));

  // Create modal for details
  let modal = document.getElementById("calendar-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "calendar-modal";
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(0,0,0,0.7)";
    modal.style.zIndex = "9999";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.innerHTML = `
      <div id="calendar-modal-content" style="
        background:#222;
        color:#fff;
        padding:2em;
        border-radius:10px;
        max-width:400px;
        margin:auto;
        position:relative;
        top:20vh;
        box-shadow:0 2px 12px rgba(0,0,0,0.5);
      ">
        <button id="calendar-modal-close" style="
          position:absolute;
          top:10px;
          right:10px;
          background:#444;
          color:#fff;
          border:none;
          border-radius:4px;
          padding:4px 10px;
          cursor:pointer;
        ">✖</button>
        <div id="calendar-modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("calendar-modal-close").onclick = function () {
      modal.style.display = "none";
    };
  }

  // Modal rendering function with add/delete logic
  function renderActivityModal(props) {
    let participants = props.participants
      ? props.participants.split(";").join(", ")
      : "None";
    let subs = Array.isArray(props.subactivities)
      ? props.subactivities
      : (props.subactivities || "")
          .split(/[,;]/)
          .map((s) => s.trim())
          .filter(Boolean);

    let subactivitiesList = subs.length
      ? `<p><strong>Subactivities:</strong></p>
        <ul>
          ${subs
            .map(
              (sub, idx) =>
                `<li>${sub} <button class="delete-subactivity-btn" data-idx="${idx}">🗑️</button></li>`
            )
            .join("")}
        </ul>`
      : "";

    document.getElementById("calendar-modal-body").innerHTML = `
      <h2>${props.activity}</h2>
      <p><strong>Week:</strong> ${props.week || ""}</p>
      <p><strong>Start:</strong> ${props.start_date || ""}</p>
      <p><strong>End:</strong> ${props.end_date || ""}</p>
      <p><strong>Duration:</strong> ${props.duration || ""}</p>
      <p><strong>Participants:</strong> ${participants}</p>
      ${subactivitiesList}
      <div style="margin-top:1em;">
        <input type="text" id="subactivity-input" placeholder="Add subactivity" style="width:70%;" />
        <button id="add-subactivity-btn">Add</button>
      </div>
    `;

    // Add subactivity
    const addBtn = document.getElementById("add-subactivity-btn");
    const input = document.getElementById("subactivity-input");
    if (addBtn && input) {
      addBtn.onclick = async function () {
        const newSub = input.value.trim();
        if (!newSub) return;
        subs.push(newSub);
        console.log("Trying to update subactivities for:", {
          activity: props.activity,
          start_date: props.start_date,
        });
        await supabase
          .from("Itinerary")
          .update({ subactivities: subs }) // subs is an array
          .match({ activity: props.activity, start_date: props.start_date });
        props.subactivities = subs.join(";");
        renderActivityModal(props); // Re-render modal
      };
    }

    // Delete subactivity
    document.querySelectorAll(".delete-subactivity-btn").forEach((btn) => {
      btn.onclick = async function () {
        const idx = parseInt(btn.getAttribute("data-idx"));
        subs.splice(idx, 1);
        await supabase
          .from("Itinerary")
          .update({ subactivities: subs })
          .match({ activity: props.activity, start_date: props.start_date });
        props.subactivities = subs.join(";");
        renderActivityModal(props); // Re-render modal
      };
    });
  }

  // Initialize FullCalendar
  const calendar = new FullCalendar.Calendar(calendarDiv, {
    initialView: "dayGridMonth",
    events: events,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek",
    },
    eventClick: function (info) {
      renderActivityModal(info.event.extendedProps);
      modal.style.display = "flex";
    },
  });
  calendar.render();

  // Fullscreen controls
  const fullscreenBtn = document.getElementById("calendar-fullscreen-btn");
  const exitFullscreenBtn = document.getElementById(
    "calendar-exit-fullscreen-btn"
  );

  fullscreenBtn.onclick = function () {
    calendarDiv.classList.add("calendar-fullscreen");
    fullscreenBtn.style.display = "none";
    exitFullscreenBtn.style.display = "inline-block";
    exitFullscreenBtn.classList.add("calendar-exit-inline");
    document.body.style.overflow = "hidden";
    calendar.updateSize();
  };

  exitFullscreenBtn.onclick = function () {
    calendarDiv.classList.remove("calendar-fullscreen");
    fullscreenBtn.style.display = "inline-block";
    exitFullscreenBtn.style.display = "none";
    exitFullscreenBtn.classList.remove("calendar-exit-inline");
    document.body.style.overflow = "";
    calendar.updateSize();
  };

  // Move exit button next to the calendar title
  const fcTitle = calendarDiv.querySelector(".fc-toolbar-title");
  if (fcTitle && exitFullscreenBtn) {
    fcTitle.parentNode.insertBefore(exitFullscreenBtn, fcTitle.nextSibling);
  }

  // Keyboard shortcuts for fullscreen
  document.addEventListener("keydown", function (e) {
    // ESC exits fullscreen
    if (
      e.key === "Escape" &&
      calendarDiv.classList.contains("calendar-fullscreen")
    ) {
      calendarDiv.classList.remove("calendar-fullscreen");
      fullscreenBtn.style.display = "inline-block";
      exitFullscreenBtn.style.display = "none";
      exitFullscreenBtn.classList.remove("calendar-exit-inline");
      document.body.style.overflow = "";
      calendar.updateSize();
    }
    // F enters fullscreen (ignore if typing in input/textarea)
    if (
      (e.key === "f" || e.key === "F") &&
      !calendarDiv.classList.contains("calendar-fullscreen") &&
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "TEXTAREA"
    ) {
      calendarDiv.classList.add("calendar-fullscreen");
      fullscreenBtn.style.display = "none";
      exitFullscreenBtn.style.display = "inline-block";
      exitFullscreenBtn.classList.add("calendar-exit-inline");
      document.body.style.overflow = "hidden";
      calendar.updateSize();
    }
  });
});
