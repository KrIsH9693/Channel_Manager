(function () {
  if (window.__AUTH_GUARD__) return;
  window.__AUTH_GUARD__ = true;

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    window.location.href = "/auth/login.html";
  }
})();