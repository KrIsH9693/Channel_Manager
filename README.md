# Channel Manager (Inventory-Driven)

A lightweight, frontend-first **Channel Manager system** built using vanilla JavaScript and Bootstrap.
The system is **inventory-centric**, OTA-ready, and designed for easy backend integration.

---

## 🔥 Key Philosophy

> **Inventory Calendar is the Single Source of Truth**

There is **no PMS / reservation dependency**.
All dashboards and reports are derived from inventory availability, pricing, and stop-sell logic.

---

## 🚀 Features

### Inventory Management
- Room Types & Individual Rooms
- Base Price per Room
- Calendar-based price override
- Stop Sell (block room on specific dates)
- Active / Inactive rooms
- Month-wise calendar (Current + Next month)

### Dashboard (Live)
- Total Properties
- Active OTAs
- Rooms Blocked Today
- Today’s Revenue
- Occupancy %
- Weekly Revenue Line Chart
- Today Room Status Bubble Chart
- Real-time updates via events

### Reports
- Date range based reporting
- Blocked room nights
- Occupancy %
- Potential revenue calculation
- Daily revenue bar chart
- Tabular daily breakdown
- Export to **PDF**
- Export to **Excel**

---

## 🧠 Architecture Highlights

- Frontend-only MVP
- Event-driven updates (`inventoryUpdated`)
- Backend-ready data models
- OTA integration friendly
- Clean separation of concerns

---

## 🛠 Tech Stack

- HTML5
- CSS3 (Bootstrap 5)
- Vanilla JavaScript (ES6)
- Chart.js
- jsPDF + html2canvas (PDF Export)
- SheetJS (Excel Export)

---

## 📂 Folder Structure

/project-root
│
├── index.html
│
├── assets/
│ ├── css/
│ │ └── main.css
│ └── js/
│ └── auth.js
│
├── shared/
│ ├── components/
│ │ ├── header.html
│ │ └── sidebar.html
│ └── js/
│ └── main.js
│
├── inventory/
│ ├── inventory.html
│ └── js/
│ └── inventory.js
|
├── properties/
│ ├── properties.html
│ └── js/
│ └── properties.js
|
├── otas/
│ ├── otas.html
│ └── js/
│ └── otas.js
│
├── dashboard/
│ ├── dashboard.html
│ └── js/
│ └── dashboard.js
│
├── reports/
│ ├── reports.html
│ └── js/
│ └── reports.js
│
└── README.md



---

## 🔁 Event System

| Event Name | Purpose |
|-----------|--------|
| inventoryUpdated | Refresh dashboard & reports |
| future: otaSync | Push updates to OTAs |
| future: webhook | Pull OTA bookings |

---

## 📦 Core Data Model (Inventory)

```json
{
  "propertyId": 1,
  "roomTypes": [
    {
      "id": 123,
      "name": "Deluxe",
      "rooms": [
        {
          "roomNo": 101,
          "basePrice": 2500,
          "active": true,
          "calendar": {
            "2026-02-25": {
              "status": "stopsell",
              "price": 3200
            }
          }
        }
      ]
    }
  ]
}