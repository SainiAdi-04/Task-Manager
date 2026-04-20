# Task Manager

An end-to-end task manager app with an admin dashboard, built using the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Authentication:** Secure login and registration using JSON Web Tokens (JWT) and bcrypt password hashing.
- **Task Management:** Create, read, update, and delete tasks.
- **Admin Dashboard:** Overview of tasks, user statistics, and data visualization using Recharts.
- **File Uploads:** Support for attaching files to tasks using Multer.
- **Export Data:** Export task/user data to Excel spreadsheets (via exceljs).
- **Responsive UI:** Modern, responsive interface built with React and Tailwind CSS.

## Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Icons:** React Icons

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken) & bcryptjs
- **File Uploads:** Multer
- **Data Export:** exceljs

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance running

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Setup Backend:
   ```bash
   cd backend
   npm install
   # Create a .env file based on backend configuration (e.g., PORT, MONGO_URI, JWT_SECRET)
   npm run dev
   ```

3. Setup Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## License
ISC
