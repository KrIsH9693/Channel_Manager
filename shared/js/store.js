export function getProperties() {
    return JSON.parse(localStorage.getItem("properties")) || [];
}

export function getOTAs() {
    return JSON.parse(localStorage.getItem("otas")) || [];
}

export function getReservations() {
    return JSON.parse(localStorage.getItem("reservations")) || [];
}

export function getRevenue() {
    const reservations = getReservations();
    return reservations.reduce((sum, r) => sum + (r.amount || 0), 0);
}
