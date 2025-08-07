async function loadItinerary() {
  const { data, error } = await supabase
    .from("Itinerary")
    .select("id,week,activity,duration,participants,start_date,end_date");
  if (error) {
    console.error("Supabase error:", error);
    return;
  }
  itineraryData = groupByWeek(data);
  renderItinerary();
}

function showSaveToast() {
  const toast = document.createElement("div");
  toast.textContent = "Changes saved!";
  toast.style.cssText =
    "position:fixed;bottom:20px;right:20px;background:#26c6da;color:#fff;padding:10px 20px;border-radius:6px;z-index:9999;";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

async function saveItinerary() {
  const saveBtn = document.getElementById("save-btn");
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
  }

  const flatData = [];
  itineraryData.forEach((week) => {
    week.items.forEach((item) => {
      flatData.push({
        id: item.id,
        week: week.week,
        activity: item.activity,
        duration: item.duration,
        participants: Array.isArray(item.participants)
          ? item.participants.join(";")
          : item.participants,
        start_date: item.start_date || null,
        end_date: item.end_date || null,
      });
    });
  });

  let errors = [];
  // Update existing items
  for (const item of flatData.filter((i) => i.id !== undefined)) {
    const { error } = await supabase
      .from("Itinerary")
      .update({
        week: item.week,
        activity: item.activity,
        duration: item.duration,
        participants: item.participants,
        start_date: item.start_date,
        end_date: item.end_date,
      })
      .eq("id", item.id);
    if (error) errors.push(error);
  }

  // Insert new items
  const newItems = flatData.filter((i) => i.id === undefined);
  if (newItems.length > 0) {
    const itemsToInsert = newItems.map(({ id, ...rest }) => rest);
    const { error } = await supabase.from("Itinerary").insert(itemsToInsert);
    if (error) errors.push(error);
  }

  if (saveBtn) {
    saveBtn.textContent = "Save";
    saveBtn.disabled = false;
  }

  if (errors.length === 0) {
    showSaveToast();
    await loadItinerary();
  } else {
    alert("Some items failed to save. See console for details.");
    console.error(errors);
  }
}
