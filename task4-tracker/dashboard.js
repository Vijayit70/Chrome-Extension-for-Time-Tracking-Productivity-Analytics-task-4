chrome.storage.local.get("categoryData", ({ categoryData }) => {
  if (!categoryData) return;

  const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
};


  document.getElementById("productive").innerText =
  formatTime(categoryData.productive);

document.getElementById("unproductive").innerText =
  formatTime(categoryData.unproductive);

document.getElementById("neutral").innerText =
  formatTime(categoryData.neutral);


  const ctx = document.getElementById("chart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Productive", "Unproductive", "Neutral"],
      datasets: [{
        data: [
          categoryData.productive,
          categoryData.unproductive,
          categoryData.neutral
        ],
        backgroundColor: ["#2ecc71", "#e74c3c", "#95a5a6"]
      }]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });
});
