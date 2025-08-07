let people = ["Mittchel", "Okke", "Patrick"];
let itineraryData = [];

function groupByWeek(data) {
  const weeks = {};
  data.forEach((item) => {
    if (!weeks[item.week]) weeks[item.week] = [];
    item.participants = item.participants ? item.participants.split(";") : [];
    weeks[item.week].push(item);
  });
  return Object.entries(weeks)
    .sort(([a], [b]) => {
      const numA = parseInt(a.match(/Week (\d+)/)?.[1] || 0, 10);
      const numB = parseInt(b.match(/Week (\d+)/)?.[1] || 0, 10);
      return numA - numB;
    })
    .map(([week, items]) => ({ week, items }));
}
