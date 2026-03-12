(function () {

  const table = document.getElementById("otaTable");

  function getOTAs() {
    return JSON.parse(localStorage.getItem("otas")) || [];
  }

  function saveOTAs(data) {
    localStorage.setItem("otas", JSON.stringify(data));
    window.dispatchEvent(new Event("otaUpdated"));
  }

  function getProperties() {
    return JSON.parse(localStorage.getItem("properties")) || [];
  }

  function getInventory() {
    return JSON.parse(localStorage.getItem("inventory")) || { roomTypes: [] };
  }

  renderOTAs();

  function renderOTAs() {

    const otas = getOTAs();
    table.innerHTML = "";

    if (!otas.length) {
      table.innerHTML = `<tr><td colspan="5" class="text-center">No OTAs</td></tr>`;
      return;
    }

    otas.forEach(o => {
      table.innerHTML += `
        <tr>
          <td>${o.name}</td>
          <td>${(o.properties || []).length}</td>
          <td>${(o.roomTypes || []).length}</td>
          <td>${o.status}</td>
          <td>
            <button class="btn btn-sm btn-outline-dark" onclick="editOTA(${o.id})">Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteOTA(${o.id})">Delete</button>
          </td>
        </tr>
      `;
    });
  }

  window.saveOTA = function () {

    const id = otaId.value;
    const name = otaName.value.trim();
    const status = otaStatus.value;

    if (!name) return alert("Enter OTA name");

    const properties = [...document.querySelectorAll("#propertyCheckboxes input:checked")]
      .map(i => +i.value);

    const roomTypes = [...document.querySelectorAll("#roomTypeCheckboxes input:checked")]
      .map(i => +i.value);

    const otas = getOTAs();

    if (id) {
      const o = otas.find(x => x.id == id);
      Object.assign(o, { name, status, properties, roomTypes });
    } else {
      otas.push({
        id: Date.now(),
        name,
        status,
        properties,
        roomTypes
      });
    }

    saveOTAs(otas);
    bootstrap.Modal.getInstance(otaModal).hide();
    renderOTAs();
  };

  window.editOTA = function (id) {

    const o = getOTAs().find(x => x.id === id);
    if (!o) return;

    otaId.value = o.id;
    otaName.value = o.name;
    otaStatus.value = o.status;

    renderPropertyCheckboxes(o.properties || []);
    renderRoomTypes(o.roomTypes || []);

    new bootstrap.Modal(otaModal).show();
  };

  window.deleteOTA = function (id) {
    saveOTAs(getOTAs().filter(o => o.id !== id));
    renderOTAs();
  };

  otaModal.addEventListener("show.bs.modal", () => {
    renderPropertyCheckboxes([]);
    renderRoomTypes([]);
  });

  function renderPropertyCheckboxes(selected) {
    propertyCheckboxes.innerHTML = "";
    getProperties().forEach(p => {
      propertyCheckboxes.innerHTML += `
        <div class="form-check">
          <input type="checkbox" value="${p.id}" ${selected.includes(p.id) ? "checked" : ""}>
          ${p.name}
        </div>`;
    });
  }

  function renderRoomTypes(selected) {
    roomTypeCheckboxes.innerHTML = "";
    getInventory().roomTypes.forEach(r => {
      roomTypeCheckboxes.innerHTML += `
        <div class="form-check">
          <input type="checkbox" value="${r.id}" ${selected.includes(r.id) ? "checked" : ""}>
          ${r.name}
        </div>`;
    });
  }

})();