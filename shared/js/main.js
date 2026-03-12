import { requireAuth, logout } from "../../auth/js/auth.js";

/* =========================
   AUTH GUARD
========================= */
requireAuth();

/* =========================
   INIT APP
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("shared/components/sidebar.html", "sidebar");
    await loadComponent("shared/components/header.html", "header");

    bindHeaderActions();
    bindSidebarNavigation();

    loadPage("dashboard");
});


//    PAGE LOADER (SPA)


window.loadPage = loadPage;

function loadPage(page) {
    const content = document.getElementById("app-content");
    if (!content) return;

    content.innerHTML = "<p class='text-muted'>Loading...</p>";

    fetch(`${page}/${page}.html`)
        .then(res => {
            if (!res.ok) throw new Error("Page not found");
            return res.text();
        })
        .then(html => {
            content.innerHTML = html;
            loadPageScript(page);
        })
        .catch(() => {
            content.innerHTML =
                "<p class='text-danger'>Failed to load page</p>";
        });
}

function loadPageScript(page) {
    const oldScript = document.getElementById("page-script");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = "page-script";
    script.src = `${page}/js/${page}.js`;
    script.defer = true;

    document.body.appendChild(script);
}


//    COMPONENT LOADER


function loadComponent(path, targetId) {
    return fetch(path)
        .then(res => res.text())
        .then(html => {
            document.getElementById(targetId).innerHTML = html;
        });
}

//    SIDEBAR NAVIGATION


function bindSidebarNavigation() {
    document.addEventListener("click", (e) => {
        const link = e.target.closest("[data-page]");
        if (!link) return;

        e.preventDefault();
        const page = link.getAttribute("data-page");
        if (page) loadPage(page);
    });
}

//    HEADER ACTIONS

function bindHeaderActions() {
    const sidebar = document.getElementById("sidebar");

    document.addEventListener("click", (e) => {

        if (e.target.id === "sidebarToggle") {
            sidebar?.classList.toggle("d-none");
        }

        if (e.target.id === "logoutBtn") {
            logout();
        }
    });
}
