function renderItinerary() {
  const container = document.getElementById("itinerary-container");
  container.innerHTML = "";
  itineraryData.forEach((weekData, weekIndex) => {
    // Sort activities by start_date, then activity name
    weekData.items.sort((a, b) => {
      if (a.start_date && b.start_date) {
        if (a.start_date < b.start_date) return -1;
        if (a.start_date > b.start_date) return 1;
      } else if (a.start_date && !b.start_date) {
        return -1;
      } else if (!a.start_date && b.start_date) {
        return 1;
      }
      return a.activity.localeCompare(b.activity);
    });

    const section = document.createElement("div");
    section.className = "week-section dark-mode";
    const header = document.createElement("h2");
    header.className = "collapsible dark-mode";
    header.textContent = "🗓️ " + weekData.week;
    section.appendChild(header);

    const content = document.createElement("div");
    content.className = "content dark-mode";
    const ul = document.createElement("ul");

    weekData.items.forEach((item, itemIndex) => {
      const li = document.createElement("li");
      li.className = "dark-mode";

      const editableDiv = document.createElement("div");
      editableDiv.contentEditable = true;
      editableDiv.textContent = item.activity;
      editableDiv.className = "activity-card dark-mode";
      editableDiv.addEventListener("input", function () {
        itineraryData[weekIndex].items[itemIndex].activity = this.textContent;
      });
      li.appendChild(editableDiv);

      const startDateInput = document.createElement("input");
      startDateInput.type = "date";
      startDateInput.value = item.start_date || "";
      startDateInput.className = "dark-mode";
      startDateInput.placeholder = "Start date";
      startDateInput.addEventListener("change", function () {
        itineraryData[weekIndex].items[itemIndex].start_date = this.value;
      });
      li.appendChild(document.createTextNode("Start: "));
      li.appendChild(startDateInput);

      const endDateInput = document.createElement("input");
      endDateInput.type = "date";
      endDateInput.value = item.end_date || "";
      endDateInput.className = "dark-mode";
      endDateInput.placeholder = "End date";
      endDateInput.addEventListener("change", function () {
        itineraryData[weekIndex].items[itemIndex].end_date = this.value;
      });
      li.appendChild(document.createTextNode(" End: "));
      li.appendChild(endDateInput);

      people.forEach((person) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.participants.includes(person);
        checkbox.className = "dark-mode";
        checkbox.addEventListener("change", function () {
          const participants =
            itineraryData[weekIndex].items[itemIndex].participants;
          if (this.checked) {
            if (!participants.includes(person)) participants.push(person);
          } else {
            const idx = participants.indexOf(person);
            if (idx !== -1) participants.splice(idx, 1);
          }
        });
        li.appendChild(checkbox);

        const label = document.createElement("label");
        label.textContent = person;
        label.className = "dark-mode";
        li.appendChild(label);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.className = "delete-btn dark-mode";
      deleteBtn.addEventListener("click", async function () {
        const itemToDelete = itineraryData[weekIndex].items[itemIndex];
        itineraryData[weekIndex].items.splice(itemIndex, 1);
        renderItinerary();
        if (itemToDelete.id !== undefined) {
          const { error } = await supabase
            .from("Itinerary")
            .delete()
            .eq("id", itemToDelete.id);
          if (error) {
            alert("Failed to delete from database!");
            console.error(error);
          } else {
            await loadItinerary();
          }
        }
      });
      li.appendChild(deleteBtn);

      ul.appendChild(li);
    });

    const addBtn = document.createElement("button");
    addBtn.textContent = "➕ Add Activity";
    addBtn.className = "add-btn dark-mode";
    addBtn.addEventListener("click", function () {
      weekData.items.push({
        activity: "New Activity",
        duration: "",
        participants: [],
        start_date: "",
        end_date: "",
      });
      renderItinerary();
    });
    content.appendChild(ul);
    content.appendChild(addBtn);
    section.appendChild(content);
    container.appendChild(section);
  });

  document.querySelectorAll(".collapsible").forEach((header) => {
    header.addEventListener("click", function () {
      const content = this.nextElementSibling;
      content.style.display =
        content.style.display === "block" ? "none" : "block";
    });
  });
}

function showActivitySummary() {
  const summaryContainer = document.getElementById("summaryContainer");
  if (!summaryContainer) {
    // Optionally, show a message or do nothing
    alert("Summary container not found on this page.");
    return;
  }
  summaryContainer.innerHTML = "";
  const personMap = {};
  people.forEach((p) => (personMap[p] = []));
  itineraryData.forEach((week) => {
    week.items.forEach((item) => {
      item.participants.forEach((p) => {
        personMap[p].push(item.activity);
      });
    });
  });
  for (const person in personMap) {
    const card = document.createElement("div");
    card.className = "summary-card dark-mode";
    const title = document.createElement("h3");
    title.textContent = person;
    card.appendChild(title);
    const ul = document.createElement("ul");
    personMap[person].forEach((act) => {
      const li = document.createElement("li");
      li.textContent = act;
      li.className = "dark-mode";
      ul.appendChild(li);
    });
    card.appendChild(ul);
    summaryContainer.appendChild(card);
  }
  summaryContainer.style.display = "block";
}
