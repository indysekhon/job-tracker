# 🎯 Job Application Tracker

A full-stack web application to track job applications through the hiring pipeline with a visual Kanban board and analytics dashboard.

<img width="2550" height="1262" alt="Screenshot 2026-04-20 234014" src="https://github.com/user-attachments/assets/7f5e7704-345d-4216-976e-4147ec62af23" />

## 🌐 Live Demo

**[View Live App](https://job-tracker-ten-rose.vercel.app)**

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login/register system
- 📋 **Dashboard** - Overview of all applications with key stats
- 🎯 **Kanban Board** - Drag-and-drop interface to track application stages
- 📊 **Analytics** - Visual charts showing response rates and trends
- 📝 **Full CRUD** - Create, read, update, and delete applications
- 📱 **Responsive** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router v6
- Axios
- Recharts
- @hello-pangea/dnd (drag-and-drop)

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database
- PostgreSQL (Neon)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon

## 📸 Screenshots

### Dashboard
<img width="2550" height="1262" alt="Screenshot 2026-04-20 234014" src="https://github.com/user-attachments/assets/e4c3cd5e-59a2-4a7e-bd74-f56c9a50ad6f" />
(screenshots/dashboard.png)

### Kanban Board
<img width="2546" height="679" alt="Screenshot 2026-04-20 234116" src="https://github.com/user-attachments/assets/7f38ec97-93a3-4c72-9867-a5ef8492ce2c" />

### Analytics
<img width="2542" height="920" alt="Screenshot 2026-04-20 234124" src="https://github.com/user-attachments/assets/db74db35-82ea-4fae-9283-2d3b78bf8790" />


## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
```
2. Install backend dependencies
```bash
cd backend
npm install
```
3. Install frontend dependencies
```bash
cd ../frontend
npm install
```
4. Set up environment variables
  - Backend .env:
  ```bash
  DATABASE_URL=your_postgresql_connection_string
  JWT_SECRET=your_secret_key
  PORT=5000
  ```
  - Frontend .env:
  ```bash
  REACT_APP_API_URL=http://localhost:5000/api
  ```
5. Set up the database
```bash
-- Run the SQL commands in backend/schema.sql
```
6. Start the development servers
  - Backend:
```bash
cd backend
npm run dev
```
 - Frontend:
```bash
cd frontend
npm start
```

📄 License
MIT License
