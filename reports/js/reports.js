let reportChart = null;

function generateReport() {

  const from = fromDate.value;
  const to = toDate.value;
  if (!from || !to) return alert("Select date range");

  const inventory = JSON.parse(localStorage.getItem("inventory")) || {};
  const roomTypes = inventory.roomTypes || [];

  const dates = getDatesBetween(from, to);

  let totalRooms = 0;
  roomTypes.forEach(rt => totalRooms += rt.rooms.length);

  let totalBlocked = 0;
  let totalRevenue = 0;

  const dailyMap = {};

  dates.forEach(d => dailyMap[d] = { blocked: 0, revenue: 0 });

  roomTypes.forEach(rt => {
    rt.rooms.forEach(room => {
      dates.forEach(d => {
        const cal = room.calendar?.[d];
        if (cal?.status === "stopsell") {
          dailyMap[d].blocked++;
          dailyMap[d].revenue += Number(cal.price ?? room.basePrice ?? 0);
          totalBlocked++;
          totalRevenue += Number(cal.price ?? room.basePrice ?? 0);
        }
      });
    });
  });

  // SUMMARY
  repTotalRooms.innerText = totalRooms;
  repBlocked.innerText = totalBlocked;

  const possibleRoomNights = totalRooms * dates.length;
  const occ = possibleRoomNights === 0
    ? 0
    : ((totalBlocked / possibleRoomNights) * 100).toFixed(1);

  repOcc.innerText = occ + "%";
  repRevenue.innerText = "₹" + totalRevenue.toLocaleString();

  // TABLE
  reportTable.innerHTML = "";
  Object.entries(dailyMap).forEach(([date, d]) => {
    reportTable.innerHTML += `
      <tr>
        <td>${date}</td>
        <td>${d.blocked}</td>
        <td>₹${d.revenue}</td>
      </tr>
    `;
  });

  // CHART
  if (reportChart) reportChart.destroy();

  reportChart = new Chart(reportChartCanvas(), {
    type: "bar",
    data: {
      labels: Object.keys(dailyMap),
      datasets: [{
        data: Object.values(dailyMap).map(d => d.revenue),
        backgroundColor: "#0d6efd"
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function reportChartCanvas() {
  return document.getElementById("reportChart");
}

function getDatesBetween(start, end) {
  const dates = [];
  let d = new Date(start);
  while (d <= new Date(end)) {
    dates.push(d.toISOString().split("T")[0]);
    d.setDate(d.getDate() + 1);
  }
  return dates;
}
function exportExcel() {

  const tableRows = [];
  const rows = document.querySelectorAll("#reportTable tr");

  rows.forEach(r => {
    const cells = r.querySelectorAll("td");
    tableRows.push({
      Date: cells[0].innerText,
      "Blocked Rooms": cells[1].innerText,
      Revenue: cells[2].innerText.replace("₹", "")
    });
  });

  if (tableRows.length === 0) {
    alert("Generate report first");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(tableRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

  XLSX.writeFile(workbook, "Inventory_Report.xlsx");
}
function exportExcel() {

  const tableRows = [];
  const rows = document.querySelectorAll("#reportTable tr");

  rows.forEach(r => {
    const cells = r.querySelectorAll("td");
    tableRows.push({
      Date: cells[0].innerText,
      "Blocked Rooms": cells[1].innerText,
      Revenue: cells[2].innerText.replace("₹", "")
    });
  });

  if (tableRows.length === 0) {
    alert("Generate report first");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(tableRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

  XLSX.writeFile(workbook, "Inventory_Report.xlsx");
}