
  //  PROPERTY CRUD


const table = document.getElementById("propertyTable");

let properties = JSON.parse(localStorage.getItem("properties")) || [];

  //  RENDER


function renderProperties() {
  table.innerHTML = "";

  if (!properties.length) {
    table.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-3">
          No properties added
        </td>
      </tr>`;
    return;
  }

  properties.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.city}</td>
      <td>${p.rooms}</td>
      <td>
        <span class="badge ${p.status === "Active" ? "bg-success" : "bg-secondary"}">
          ${p.status}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-dark" onclick="editProperty(${p.id})">Edit</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteProperty(${p.id})">Delete</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

  //  SAVE / UPDATE


window.saveProperty = function () {

  const id     = propertyId.value;
  const name   = propertyName.value.trim();
  const city   = propertyCity.value.trim();
  const rooms  = parseInt(propertyRooms.value);
  const status = propertyStatus.value;

  if (!name || !city || !rooms) {
    alert("Fill all fields");
    return;
  }

  if (id) {
    const p = properties.find(x => x.id == id);
    p.name = name;
    p.city = city;
    p.rooms = rooms;
    p.status = status;
  } else {
    properties.push({
      id: Date.now(),
      name,
      city,
      rooms,
      status
    });
  }

  localStorage.setItem("properties", JSON.stringify(properties));
  window.dispatchEvent(new Event("propertyUpdated"));

  bootstrap.Modal.getInstance(
    document.getElementById("propertyModal")
  ).hide();

  clearForm();
  renderProperties();
};


  //  EDIT / DELETE


window.editProperty = function (id) {
  const p = properties.find(x => x.id === id);
  if (!p) return;

  propertyId.value = p.id;
  propertyName.value = p.name;
  propertyCity.value = p.city;
  propertyRooms.value = p.rooms;
  propertyStatus.value = p.status;

  new bootstrap.Modal(
    document.getElementById("propertyModal")
  ).show();
};

window.deleteProperty = function (id) {
  if (!confirm("Delete this property?")) return;
  properties = properties.filter(p => p.id !== id);
  localStorage.setItem("properties", JSON.stringify(properties));
  window.dispatchEvent(new Event("propertyUpdated"));
  renderProperties();
};

  //  HELPERS


function clearForm() {
  propertyId.value = "";
  propertyName.value = "";
  propertyCity.value = "";
  propertyRooms.value = "";
  propertyStatus.value = "Active";
}

  //  INIT


renderProperties();