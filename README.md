#Inventory Management System 📦

DeskSV is a full-stack enterprise resource planning (ERP) and inventory management platform designed to efficiently manage your product catalog and control stock inflows and outflows in real time.


## 🚀 Technologies Used

This project is built with a modern stack, strictly separating the server logic from the user interface:

### Backend (REST API)
* **Language:** Go (Golang)
* **Database:** PostgreSQL
* **Infrastructure:** Docker & Docker Compose

### Frontend (Single Page Application)
* **Library:** React
* **Build Tool:** Vite
* **Styles:** Tailwind CSS
* **Routation:** React Router DOM
* **Icons:** Boxicons

## ✨ Main Features

* **Dashboard:** General catalog overview with reactive stock calculation.

* **Product Management (CRUD):** Creation, reading, and deletion of products (SKU, name, price, category, supplier).

* **Movement Log:** Control of incoming (purchases/manufacturing) and outgoing (sales/shrinkage) items that dynamically update available inventory.

* **Reactive Interface:** Smooth navigation without page reloads (SPA) and a design adapted to modern UI/UX standards.

## 🛠️ Installation and Use

To run this project on your local environment, you need to have Node.js (https://nodejs.org/), Go (https://go.dev/), and Docker (https://www.docker.com/) installed.

Setting Up the Database and Backend
Make sure Docker is running and execute:
```bash
docker-compose up -d
Setting Up the Frontend
Open a new terminal, navigate to the client folder, and start the Vite server:
Bash
cd frontend
npm install
npm run dev
The frontend will be available at http://localhost:5173/ and will consume the API hosted on port 8080.

👨‍💻 Author
Erick Francis - Software Developer
