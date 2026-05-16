# Task Manager API

> A robust, secure, and production-ready REST API for managing personal tasks. Built with Node.js, Express, and structured for local JSON file persistence.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

##  Key Features

- **Robust Input Validation:** Utilizes `express-validator` to ensure all incoming data is clean, secure, and formatted correctly.
- **Advanced Error Handling:** A centralized global error handler catches all asynchronous errors and returns industry-standard HTTP status codes and structured responses.
- **JWT Authentication:** Secure user authentication protecting all task-related routes.
- **Advanced Querying:** Supports pagination, filtering (by search term or completion status), and dynamic sorting (e.g., `?sort=-createdAt`).
- **File-Based Persistence:** No database setup required. Data is cleanly stored in auto-generated JSON files within the `/data` directory.

---

##  Setup & Installation

**1. Clone the repository and navigate into it**

**2. Install Dependencies**
```bash
npm install
```

**3. Environment Variables**
Create a `.env` file in the root directory based on the `.env.example` (or simply create one with the following):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_key_please_change_in_production
JWT_EXPIRES_IN=7d
```

**4. Start the Application**
```bash
npm run dev   # Development mode with nodemon auto-restart
npm start     # Production mode
```

---

##  API Documentation

###  Authentication Endpoints

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| `POST` | `/api/auth/register` | Register a new user | `201 Created` |
| `POST` | `/api/auth/login` | Authenticate & receive JWT | `200 OK` |

###  Task Endpoints *(Requires Bearer Token)*

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| `GET`  | `/api/tasks` | Retrieve all user tasks | `200 OK` |
| `POST` | `/api/tasks` | Create a new task | `201 Created` |
| `GET`  | `/api/tasks/:id` | Get a specific task by ID | `200 OK` |
| `PUT`  | `/api/tasks/:id` | Update task details | `200 OK` |
| `PATCH`| `/api/tasks/:id/toggle` | Toggle completion status | `200 OK` |
| `DELETE`| `/api/tasks/:id` | Delete a task completely | `200 OK` |

---

##  Advanced Query Parameters (GET `/api/tasks`)

Enhance your GET requests using these query parameters:

- **Filtering:** 
  - `?search=meeting` (Searches for "meeting" in the title)
  - `?completed=true` (Filters only completed tasks)
- **Sorting:**
  - `?sort=-createdAt` (Sort by creation date, newest first - *Default*)
  - `?sort=title` (Sort alphabetically by title)
- **Pagination:**
  - `?page=1&limit=5` (Get first 5 tasks)

---

##  Project Structure Overview

```text
task-manager-api/
├── controllers/      # Route logic & response handling
├── data/             # JSON files for data persistence
├── middleware/       # JWT Auth, Validation, & Error Handlers
├── models/           # File System (fs) data interaction
├── routes/           # Express Routers
├── utils/            # catchAsync wrapper, AppError classes
├── .env              # Environment configurations
├── server.js         # Entry point & Express setup
└── package.json      # Dependencies & Scripts
```
