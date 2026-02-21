ITD110 Lab Exercise 1 – StudentDB (MongoDB)

Simple CRUD app using a Node.js/Express backend with MongoDB (Mongoose) and a plain HTML/CSS/JS frontend.

Features
- Add, view, update, delete students
- Numeric GPA (1.00–5.00 in 0.25 steps) + INC
- Displays computed `gradeDisplay` from the backend

Tech Stack
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Community Edition + MongoDB Compass
- Frontend: HTML, CSS, JavaScript (no framework)

Setup (Local)
Prerequisites
- Node.js installed
- MongoDB running locally

Backend
cd backend
npm install
npm run dev

API Test
http://localhost:5001/api/students