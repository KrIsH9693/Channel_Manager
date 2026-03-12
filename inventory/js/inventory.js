
  //  LOAD INVENTORY


let inventory = JSON.parse(localStorage.getItem("inventory")) || {
  propertyId: 1,
  roomTypes: []
};

function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
  window.dispatchEvent(new Event("inventoryUpdated"));
}


  //  CREATE ROOM TYPE


function createRoomType() {

  const name  = rtName.value.trim();
  const count = Number(rtCount.value);
  const price = Number(rtPrice.value);

  if (!name || !count || !price) {
    alert("Fill all fields");
    return;
  }

  const rooms = [];

  for (let i = 1; i <= count; i++) {
    rooms.push({
      roomNo: 100 + i,
      basePrice: price,
      active: true,
      calendar: {}
    });
  }

  inventory.roomTypes.push({
    id: Date.now(),
    name,
    rooms
  });

  saveInventory();
  renderInventory();
}


  //  RENDER INVENTORY


function renderInventory() {

  const box = document.getElementById("inventoryContainer");
  if (!box) return;

  box.innerHTML = "";

  inventory.roomTypes.forEach(type => {
    type.rooms.forEach(room => {

      const div = document.createElement("div");
      div.className = "room-box";

      div.innerHTML = `
        <h4>${type.name} - Room ${room.roomNo}</h4>
        <div>Base Price: ₹${room.basePrice}</div>
        <div id="cal-${type.id}-${room.roomNo}"></div>
      `;

      box.appendChild(div);
      renderCalendar(type.id, room.roomNo);
    });
  });
}


  //  MONTH UTILS


function getMonthDays(year, month) {

  const days = [];
  const d = new Date(year, month, 1);

  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

  //  CALENDAR RENDER (2 MONTH)


function renderCalendar(typeId, roomNo) {

  const room = getRoom(typeId, roomNo);
  if (!room) return;

  const box = document.getElementById(`cal-${typeId}-${roomNo}`);
  if (!box) return;

  box.innerHTML = "";

  const today = new Date();

  const months = [
    { y: today.getFullYear(), m: today.getMonth() },
    { y: today.getFullYear(), m: today.getMonth() + 1 }
    
  ];

  months.forEach(({ y, m }) => {

    const title = document.createElement("h5");
    title.innerText = new Date(y, m).toLocaleString("default", {
      month: "long",
      year: "numeric"
    });
    box.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    getMonthDays(y, m).forEach(d => {

      const dStr = d.toISOString().split("T")[0];
      const data = room.calendar[dStr] || {};

      const cell = document.createElement("div");
      cell.className = "day";

      if (data.status === "booked" || data.status === "stopsell") {
        cell.classList.add("stopsell"); // 🔴
      } else if (data.price) {
        cell.classList.add("override"); // 🟡
      } else {
        cell.classList.add("available"); // 🟢
      }

      cell.innerText = d.getDate();
      cell.onclick = () => openDayModal(typeId, roomNo, dStr);

      grid.appendChild(cell);
    });

    box.appendChild(grid);
  });
}


  //  MODAL LOGIC


let selectedRoom = null;
let selectedDate = null;

function openDayModal(typeId, roomNo, date) {

  selectedRoom = getRoom(typeId, roomNo);
  selectedDate = date;

  const data = selectedRoom.calendar[date] || {};
  modalDate.innerText = date;
  modalPrice.value = data.price || "";

  dayModal.style.display = "flex";
}

function closeModal() {
  dayModal.style.display = "none";
}

function setAvailable() {

  selectedRoom.calendar[selectedDate] = {
    price: modalPrice.value ? Number(modalPrice.value) : null,
    status: "available"
  };

  saveInventory();
  closeModal();
  renderInventory();
}

function setStopSell() {

  selectedRoom.calendar[selectedDate] = {
    price: null,
    status: "stopsell"
  };

  saveInventory();
  closeModal();
  renderInventory();
}

  //  RESERVATION SYNC (CORE)


window.addEventListener("reservationUpdated", syncReservations);

function syncReservations() {

  const reservations =
    JSON.parse(localStorage.getItem("reservations")) || [];

  inventory.roomTypes.forEach(type => {
    type.rooms.forEach(room => {

      Object.keys(room.calendar).forEach(d => {
        if (room.calendar[d].status === "booked") {
          delete room.calendar[d];
        }
      });

      reservations.forEach(res => {

        if (res.roomNo !== room.roomNo) return;

        const dates = getDatesBetween(res.checkIn, res.checkOut);

        dates.forEach(date => {
          room.calendar[date] = {
            status: "booked",
            reservationId: res.id
          };
        });
      });
    });
  });

  saveInventory();
  renderInventory();
}


  //  DATE RANGE UTIL

function getDatesBetween(start, end) {

  const dates = [];
  let current = new Date(start);

  while (current < new Date(end)) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

  //  HELPERS


function getRoom(typeId, roomNo) {
  return inventory.roomTypes
    .find(t => t.id === typeId)
    ?.rooms.find(r => r.roomNo === roomNo);
}

/* ========================= */

renderInventory();
syncReservations();