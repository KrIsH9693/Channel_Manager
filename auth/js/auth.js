
  //  STORAGE


export function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

export function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/auth/login.html";
}


  //  REGISTER


export function registerUser() {
  const owner = ownerInput();
  const hotel = hotelInput();
  const email = emailInput();
  const phone = phoneInput();
  const password = passwordInput();

  if (!owner || !hotel || !email || !phone || !password) {
    alert("Fill all fields");
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    alert("User already exists, login");
    return;
  }

  users.push({
    id: Date.now(),
    owner,
    hotel,
    email,
    phone,
    password
  });

  saveUsers(users);
  alert("Registered successfully");
  window.location.href = "login.html";
}

  //  LOGIN


export function loginUser() {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("❌ Invalid user, please register first");
    return;
  }

  setCurrentUser(user);
  window.location.href = "../index.html";
}


  //  RESET PASSWORD


export function resetPassword() {
  const email = document.getElementById("resetEmail").value.trim().toLowerCase();
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    alert("❌ User not found");
    return;
  }

  const newPass = Math.random().toString(36).slice(-8);
  user.password = newPass;

  saveUsers(users);
  alert("✅ New password: " + newPass);
}

  //  AUTH GUARD


export function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href = "/auth/login.html";
  }
}

// INPUT HELPERS

function ownerInput() {
  return document.getElementById("owner").value.trim();
}
function hotelInput() {
  return document.getElementById("hotel").value.trim();
}
function emailInput() {
  return document.getElementById("email").value.trim().toLowerCase();
}
function phoneInput() {
  return document.getElementById("phone").value.trim();
}
function passwordInput() {
  return document.getElementById("password").value;
}
