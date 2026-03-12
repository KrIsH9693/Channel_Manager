/* =========================
   STORAGE HELPERS
========================= */

const getArray = k => JSON.parse(localStorage.getItem(k)) || [];
const getObject = k => JSON.parse(localStorage.getItem(k)) || {};
const setObject = (k,v) => localStorage.setItem(k, JSON.stringify(v));

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  loadOTAs();
  loadProperties();
  loadRoomTypes();
});

/* =========================
   LOAD DROPDOWNS
========================= */

function loadOTAs() {
  const otas = getArray("otas");
  otaSelect.innerHTML =
    `<option value="">Select OTA</option>` +
    otas.map(o => `<option value="${o.id}">${o.name}</option>`).join("");
}

function loadProperties() {
  const props = getArray("properties");
  propertySelect.innerHTML =
    `<option value="">Select Property</option>` +
    props.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
}

function loadRoomTypes() {
  const inventory = getObject("inventory");
  roomTypeSelect.innerHTML =
    `<option value="">Select Room Type</option>` +
    (inventory.roomTypes || [])
      .map(rt => `<option value="${rt.id}">${rt.name}</option>`)
      .join("");
}

/* =========================
   LOAD ROOMS BY TYPE
========================= */

roomTypeSelect.addEventListener("change", () => {

  const inventory = getObject("inventory");
  const type = inventory.roomTypes
    .find(t => t.id == roomTypeSelect.value);

  roomNoSelect.innerHTML = `<option value="">Select Room</option>`;

  if (!type) return;

  type.rooms
    .filter(r => r.active)
    .forEach(r => {
      roomNoSelect.innerHTML +=
        `<option value="${r.roomNo}">${r.roomNo}</option>`;
    });
});

/* =========================
   DATE UTIL
========================= */

function getDatesBetween(start, end) {

  const dates = [];
  let current = new Date(start);

  while (current < new Date(end)) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/* =========================
   CHECK AVAILABILITY
========================= */

function isRoomAvailable(room, checkIn, checkOut) {

  const dates = getDatesBetween(checkIn, checkOut);

  for (let d of dates) {
    const day = room.calendar[d];
    if (day?.status === "stopsell" || day?.status === "booked") {
      return false;
    }
  }
  return true;
}

/* =========================
   CALCULATE PRICE
========================= */

function calculateAmount(room, checkIn, checkOut) {

  const dates = getDatesBetween(checkIn, checkOut);
  let total = 0;

  dates.forEach(d => {
    const day = room.calendar[d];
    total += day?.price || room.basePrice;
  });

  return total;
}

/* =========================
   CREATE RESERVATION
========================= */

window.createReservation = function () {

  const guestName = guestName.value.trim();
  const otaId = Number(otaSelect.value);
  const propertyId = Number(propertySelect.value);
  const roomTypeId = Number(roomTypeSelect.value);
  const roomNo = Number(roomNoSelect.value);
  const checkIn = checkIn.value;
  const checkOut = checkOut.value;

  if (!guestName || !roomNo || !checkIn || !checkOut) {
    alert("Fill all fields");
    return;
  }

  const inventory = getObject("inventory");
  const roomType = inventory.roomTypes
    .find(t => t.id === roomTypeId);

  const room = roomType?.rooms
    .find(r => r.roomNo === roomNo);

  if (!room) {
    alert("Room not found");
    return;
  }

  if (!isRoomAvailable(room, checkIn, checkOut)) {
    alert("Room not available for selected dates");
    return;
  }

  const amount = calculateAmount(room, checkIn, checkOut);
  const nights =
    (new Date(checkOut) - new Date(checkIn)) / 86400000;

  /* =========================
     BLOCK CALENDAR (BOOKED)
  ========================= */

  getDatesBetween(checkIn, checkOut).forEach(d => {
    room.calendar[d] = {
      status: "booked"
    };
  });

  setObject("inventory", inventory);
  window.dispatchEvent(new Event("inventoryUpdated"));

  /* =========================
     SAVE RESERVATION
  ========================= */

  const reservations = getArray("reservations");

  reservations.push({
    id: Date.now(),
    guestName,
    otaId,
    propertyId,
    roomTypeId,
    roomNo,
    checkIn,
    checkOut,
    nights,
    amount,
    status: "Confirmed",
    date: new Date().toISOString().split("T")[0]
  });

  setObject("reservations", reservations);
  window.dispatchEvent(new Event("reservationUpdated"));

  alert("Reservation Created Successfully");
};