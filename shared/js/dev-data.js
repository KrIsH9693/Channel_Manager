(function seedData() {
    if (!localStorage.getItem("properties")) {
        localStorage.setItem(
            "properties",
            JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
        );
    }

    if (!localStorage.getItem("otas")) {
        localStorage.setItem(
            "otas",
            JSON.stringify([{ id: 1 }, { id: 2 }])
        );
    }

    if (!localStorage.getItem("reservations")) {
        localStorage.setItem(
            "reservations",
            JSON.stringify([
                {
                    date: new Date().toISOString().split("T")[0],
                    amount: 5000
                },
                {
                    date: new Date().toISOString().split("T")[0],
                    amount: 3500
                }
            ])
        );
    }
})();
