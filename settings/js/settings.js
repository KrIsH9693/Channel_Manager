document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     AUTH CHECK
  ========================= */

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "/auth/login.html";
    return;
  }

  /* =========================
     ELEMENTS
  ========================= */

  const profileForm = document.getElementById("profileForm");
  const passwordForm = document.getElementById("passwordForm");

  const ownerInput = document.getElementById("ownerName");
  const hotelInput = document.getElementById("hotelName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const oldPasswordInput = document.getElementById("oldPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  /* =========================
     LOAD PROFILE DATA
  ========================= */

  ownerInput.value = currentUser.owner;
  hotelInput.value = currentUser.hotel;
  emailInput.value = currentUser.email;
  phoneInput.value = currentUser.phone;

  /* =========================
     UPDATE PROFILE
  ========================= */

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.email === currentUser.email);

    if (index === -1) {
      alert("❌ User not found");
      return;
    }

    users[index].owner = ownerInput.value.trim();
    users[index].hotel = hotelInput.value.trim();
    users[index].phone = phoneInput.value.trim();

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(users[index]));

    alert("✅ Profile updated successfully");
  });

  /* =========================
     CHANGE PASSWORD
  ========================= */

  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const oldPass = oldPasswordInput.value;
    const newPass = newPasswordInput.value;
    const confirmPass = confirmPasswordInput.value;

    if (oldPass !== currentUser.password) {
      alert("❌ Old password incorrect");
      return;
    }

    if (newPass.length < 6) {
      alert("⚠️ Password must be at least 6 characters");
      return;
    }

    if (newPass !== confirmPass) {
      alert("❌ Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.email === currentUser.email);

    if (index === -1) {
      alert("❌ User not found");
      return;
    }

    users[index].password = newPass;

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(users[index]));

    passwordForm.reset();
    alert("🔐 Password changed successfully");
  });

});
