// DASHBOARD INIT

initDashboard();

function initDashboard() {

  requestAnimationFrame(() => {

    renderStats();

    renderRevenueChart();
    renderTodayChart();

    renderMonthlyRevenueChart();
    renderOTAChart();
    renderOccupancyChart();

    renderHeatmap();
    renderForecast();

    enableDragWidgets();

  });

}


// STATS

function renderStats() {

  const properties = getArray("properties");
  const otas = getArray("otas");
  const inventory = getObject("inventory");

  const roomTypes = inventory.roomTypes || [];
  const today = new Date().toISOString().split("T")[0];

  let totalRooms = 0;
  let soldToday = 0;
  let revenueToday = 0;

  roomTypes.forEach(rt => {

    (rt.rooms || []).forEach(room => {

      totalRooms++;

      const cal = room.calendar?.[today];

      if (cal?.status === "stopsell") {

        soldToday++;
        revenueToday += Number(cal.price ?? room.basePrice ?? 0);

      }

    });

  });

  setText("totalProperties", properties.length);
  setText("activeOTAs", otas.length);
  setText("todayBookings", soldToday);
  setText("totalRevenue", "₹" + revenueToday.toLocaleString());

  setText("totalRoomTypes", roomTypes.length);
  setText("totalRooms", totalRooms);

  const occupancy =
    totalRooms === 0 ? 0 : ((soldToday / totalRooms) * 100).toFixed(1);

  setText("occupancyRate", occupancy + "%");

}


// REVENUE CHART (7 DAYS)

let revenueChart = null;

function renderRevenueChart() {

  const canvas = document.getElementById("revenueChart");
  if (!canvas || typeof Chart === "undefined") return;

  canvas.style.height = "260px";

  const labels = getLast7Days();
  const data = getWeeklyRevenue();

  if (revenueChart) {

    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = data;
    revenueChart.update("none");
    return;

  }

  revenueChart = new Chart(canvas, {

    type: "line",

    data: {

      labels,

      datasets: [{

        data,
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13,110,253,0.1)",
        fill: true,
        tension: 0.3

      }]

    },

    options: {

      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false } }

    }

  });

}


// TODAY STATUS

let todayChart = null;

function renderTodayChart() {

  const canvas = document.getElementById("todayChart");
  if (!canvas || typeof Chart === "undefined") return;

  canvas.style.height = "260px";

  const inventory = getObject("inventory");
  const roomTypes = inventory.roomTypes || [];

  const today = new Date().toISOString().split("T")[0];

  let total = 0;
  let sold = 0;

  roomTypes.forEach(rt => {

    (rt.rooms || []).forEach(room => {

      total++;

      if (room.calendar?.[today]?.status === "stopsell") sold++;

    });

  });

  const available = total - sold;

  const datasets = [

    {
      label: "Sold",
      data: [{ x: 1, y: sold, r: 20 }],
      backgroundColor: "#dc3545"
    },

    {
      label: "Available",
      data: [{ x: 2, y: available, r: 20 }],
      backgroundColor: "#198754"
    }

  ];

  if (todayChart) {

    todayChart.data.datasets = datasets;
    todayChart.update("none");
    return;

  }

  todayChart = new Chart(canvas, {

    type: "bubble",
    data: { datasets },

    options: {

      responsive: true,
      maintainAspectRatio: false,
      animation: false

    }

  });

}


// MONTHLY REVENUE

let monthlyRevenueChart = null;

function renderMonthlyRevenueChart() {

  const canvas = document.getElementById("monthlyRevenueChart");
  if (!canvas || typeof Chart === "undefined") return;

  canvas.style.height = "260px";

  const labels = getLast30Days();
  const data = getMonthlyRevenue();

  if (monthlyRevenueChart) {

    monthlyRevenueChart.data.labels = labels;
    monthlyRevenueChart.data.datasets[0].data = data;
    monthlyRevenueChart.update("none");
    return;

  }

  monthlyRevenueChart = new Chart(canvas, {

    type: "bar",

    data: {

      labels,

      datasets: [{

        data,
        backgroundColor: "#0d6efd"

      }]

    },

    options: {

      responsive: true,
      maintainAspectRatio: false,
      animation: false

    }

  });

}


// OTA SHARE

let otaChart = null;

function renderOTAChart() {

  const canvas = document.getElementById("otaChart");
  if (!canvas || typeof Chart === "undefined") return;

  const otas = getArray("otas");

  const labels = otas.map(o => o.name);
  const data = otas.map(o => o.bookings || 0);

  otaChart = new Chart(canvas, {

    type: "pie",

    data: {

      labels,

      datasets: [{

        data,
        backgroundColor: [
          "#0d6efd",
          "#dc3545",
          "#198754",
          "#ffc107",
          "#6f42c1"
        ]

      }]

    }

  });

}


// OCCUPANCY TREND

let occupancyChart = null;

function renderOccupancyChart() {

  const canvas = document.getElementById("occupancyChart");
  if (!canvas || typeof Chart === "undefined") return;

  const labels = getLast7Days();
  const data = getOccupancyTrend();

  occupancyChart = new Chart(canvas, {

    type: "line",

    data: {

      labels,

      datasets: [{

        label: "Occupancy %",
        data,
        borderColor: "#198754",
        fill: true,
        backgroundColor: "rgba(25,135,84,0.1)"

      }]

    }

  });

}


// HEATMAP

function renderHeatmap() {

  const container = document.getElementById("calendarHeatmap");
  if (!container) return;

  container.innerHTML = "";

  const days = getLast30Days();

  days.forEach(day => {

    const div = document.createElement("div");

    const value = Math.floor(Math.random() * 5);

    const colors = [
      "#eee",
      "#c6e48b",
      "#7bc96f",
      "#239a3b",
      "#196127"
    ];

    div.style.background = colors[value];
    div.style.width = "18px";
    div.style.height = "18px";
    div.style.margin = "2px";
    div.style.display = "inline-block";

    container.appendChild(div);

  });

}


// FORECAST (Simple AI style prediction)

function renderForecast() {

  const data = getWeeklyRevenue();

  const avg =
    data.reduce((a, b) => a + b, 0) / (data.length || 1);

  const prediction = Math.round(avg * 1.1);

  setText("forecastRevenue", "₹" + prediction.toLocaleString());

}


// DRAG WIDGETS

function enableDragWidgets() {

  const widgets = document.querySelectorAll(".widget");

  widgets.forEach(widget => {

    widget.draggable = true;

    widget.addEventListener("dragstart", e => {

      e.dataTransfer.setData("id", widget.id);

    });

  });

  const container = document.getElementById("dashboardGrid");

  if (!container) return;

  container.addEventListener("dragover", e => e.preventDefault());

  container.addEventListener("drop", e => {

    const id = e.dataTransfer.getData("id");
    const el = document.getElementById(id);

    if (el) container.appendChild(el);

  });

}


// DATA FUNCTIONS

function getWeeklyRevenue() {

  const inventory = getObject("inventory");
  const roomTypes = inventory.roomTypes || [];

  const days = getLast7Days();
  const map = {};

  days.forEach(d => map[d] = 0);

  roomTypes.forEach(rt => {

    (rt.rooms || []).forEach(room => {

      Object.entries(room.calendar || {}).forEach(([date, cal]) => {

        if (cal.status === "stopsell" && map[date] !== undefined) {

          map[date] += Number(cal.price ?? room.basePrice ?? 0);

        }

      });

    });

  });

  return Object.values(map);

}


function getMonthlyRevenue() {

  const inventory = getObject("inventory");
  const roomTypes = inventory.roomTypes || [];

  const days = getLast30Days();
  const map = {};

  days.forEach(d => map[d] = 0);

  roomTypes.forEach(rt => {

    (rt.rooms || []).forEach(room => {

      Object.entries(room.calendar || {}).forEach(([date, cal]) => {

        if (cal.status === "stopsell" && map[date] !== undefined) {

          map[date] += Number(cal.price ?? room.basePrice ?? 0);

        }

      });

    });

  });

  return Object.values(map);

}


function getOccupancyTrend() {

  const inventory = getObject("inventory");
  const roomTypes = inventory.roomTypes || [];

  const days = getLast7Days();
  const result = [];

  days.forEach(day => {

    let total = 0;
    let sold = 0;

    roomTypes.forEach(rt => {

      (rt.rooms || []).forEach(room => {

        total++;

        if (room.calendar?.[day]?.status === "stopsell") sold++;

      });

    });

    const occ = total === 0 ? 0 : ((sold / total) * 100).toFixed(1);

    result.push(occ);

  });

  return result;

}


function getLast7Days() {

  const arr = [];

  for (let i = 6; i >= 0; i--) {

    const d = new Date();
    d.setDate(d.getDate() - i);

    arr.push(d.toISOString().split("T")[0]);

  }

  return arr;

}


function getLast30Days() {

  const arr = [];

  for (let i = 29; i >= 0; i--) {

    const d = new Date();
    d.setDate(d.getDate() - i);

    arr.push(d.toISOString().split("T")[0]);

  }

  return arr;

}


// HELPERS

function getArray(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function getObject(key) {
  return JSON.parse(localStorage.getItem(key)) || {};
}

function setText(id, value) {

  const el = document.getElementById(id);
  if (el) el.innerText = value;

}


window.addEventListener("inventoryUpdated", initDashboard);