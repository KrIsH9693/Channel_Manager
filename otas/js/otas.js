// Optimized OTA management JS
(function () {

  const tableBody = document.querySelector("#otaTable tbody");
  const otaModalEl = document.getElementById("otaModal");
  const otaId = document.getElementById("otaId");
  const otaName = document.getElementById("otaName");
  const otaStatus = document.getElementById("otaStatus");
  const propertyCheckboxes = document.getElementById("propertyCheckboxes");
  const roomTypeCheckboxes = document.getElementById("roomTypeCheckboxes");
  const addOtaBtn = document.getElementById("addOtaBtn");
  const saveOtaBtn = document.getElementById("saveOtaBtn");

  const otaModal = new bootstrap.Modal(otaModalEl);

  // ----- Local Storage Helpers -----
  const getOTAs = () => JSON.parse(localStorage.getItem("otas")) || [];
  const saveOTAs = (data) => {
    localStorage.setItem("otas", JSON.stringify(data));
    window.dispatchEvent(new Event("otaUpdated"));
  };
  const getProperties = () => JSON.parse(localStorage.getItem("properties")) || [];
  const getInventory = () => JSON.parse(localStorage.getItem("inventory")) || { roomTypes: [] };

  // ----- Render OTAs Table -----
  function renderOTAs() {
    const otas = getOTAs();
    tableBody.innerHTML = "";

    if (!otas.length) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No OTAs</td></tr>`;
      return;
    }

    otas.forEach(o => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${o.name}</td>
        <td>${(o.properties || []).length}</td>
        <td>${(o.roomTypes || []).length}</td>
        <td>${o.status}</td>
        <td>
          <button class="btn btn-sm btn-outline-dark edit-btn" data-id="${o.id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${o.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // ----- Render Checkboxes -----
  function renderPropertyCheckboxes(selected = []) {
    propertyCheckboxes.innerHTML = "";
    getProperties().forEach(p => {
      const div = document.createElement("div");
      div.className = "form-check";
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${p.id}" ${selected.includes(p.id) ? "checked" : ""}>
        <label class="form-check-label">${p.name}</label>
      `;
      propertyCheckboxes.appendChild(div);
    });
  }

  function renderRoomTypes(selected = []) {
    roomTypeCheckboxes.innerHTML = "";
    getInventory().roomTypes.forEach(r => {
      const div = document.createElement("div");
      div.className = "form-check";
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${r.id}" ${selected.includes(r.id) ? "checked" : ""}>
        <label class="form-check-label">${r.name}</label>
      `;
      roomTypeCheckboxes.appendChild(div);
    });
  }

  // ----- Open Modal for Add OTA -----
  addOtaBtn.addEventListener("click", () => {
    otaId.value = "";
    otaName.value = "";
    otaStatus.value = "active";
    renderPropertyCheckboxes();
    renderRoomTypes();
    otaModal.show();
  });

  // ----- Save OTA -----
  saveOtaBtn.addEventListener("click", () => {
    const id = otaId.value;
    const name = otaName.value.trim();
    const status = otaStatus.value;

    if (!name) return alert("Enter OTA name");

    const properties = [...propertyCheckboxes.querySelectorAll("input:checked")].map(i => +i.value);
    const roomTypes = [...roomTypeCheckboxes.querySelectorAll("input:checked")].map(i => +i.value);

    const otas = getOTAs();

    if (id) {
      const existing = otas.find(o => o.id == id);
      Object.assign(existing, { name, status, properties, roomTypes });
    } else {
      otas.push({ id: Date.now(), name, status, properties, roomTypes });
    }

    saveOTAs(otas);
    otaModal.hide();
    renderOTAs();
  });

  // ----- Table Event Delegation for Edit/Delete -----
  tableBody.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("edit-btn")) {
      const o = getOTAs().find(x => x.id == id);
      if (!o) return;

      otaId.value = o.id;
      otaName.value = o.name;
      otaStatus.value = o.status;
      renderPropertyCheckboxes(o.properties || []);
      renderRoomTypes(o.roomTypes || []);
      otaModal.show();

    } else if (e.target.classList.contains("delete-btn")) {
      if (!confirm("Are you sure you want to delete this OTA?")) return;
      saveOTAs(getOTAs().filter(o => o.id != id));
      renderOTAs();
    }
  });

  // ----- Initial Render -----
  renderOTAs();

})();