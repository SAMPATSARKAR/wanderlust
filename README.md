# 🏡 WanderLust: Rental Booking Platform

A lightweight, modern full-stack rental platform built with the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.

## 🚀 Key Engineering Highlights (Resume Focus)
- **Role-Based Authorization (RBAC)**: Custom authorization middleware restricting property updates and deletions strictly to verified property owners and administrators.
- **RESTful API Architecture**: 20+ modular RESTful endpoints covering properties, reservations, and reviews following MVC architecture.
- **Server-Side Pagination**: Efficient pagination and multi-parameter filtering (category, price, search query).
- **Authentication**: Stateless JWT authentication with bcrypt password hashing and 1-click demo role switching (Host, Traveler, Admin).

## 🛠️ Quickstart (Run with 1 Command)
```bash
# 1. Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# 2. Start full-stack app (Backend on :5050, Frontend on :5173)
npm run dev
```

> **Note**: Comes with a built-in embedded in-memory MongoDB fallback server. It connects to local MongoDB if running, or automatically launches an in-memory database with pre-seeded properties!
