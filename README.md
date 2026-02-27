Task Management API (Backend + Basic Frontend)

A secure, scalable full-stack task management system built as part of a Backend Developer Internship assignment.

This project demonstrates:

Authentication (JWT + Refresh Tokens)

Role-Based Access (User vs Admin)

Scalable backend architecture

Secure API design

Basic frontend integration

NOTE: I only use AI to polish the frontend UI for both dashboard  and to create this README.md file to demonstrate the functionality of this be focused project well. 

🌐 Live Demo

👉 https://task-management-api-git-main-devdurgesh619s-projects.vercel.app/

📌 Features
🔐 Authentication & Security

User Signup & Signin

Password hashing (secure storage)

JWT-based authentication:

Access Token (10 min expiry)

Refresh Token (7 days expiry)

Tokens stored in HTTP-only cookies

Protection against:

XSS (httpOnly cookies)

CSRF (secure cookie settings)

Rate limiting:

Max 5 requests/min for auth routes

👥 Role-Based Access Control

Two roles:

User

Admin

Authorization handled via middleware

Example:

Only admin can delete users

Unauthorized access → 403 Forbidden

📝 Todo Management (CRUD)

User can:

Create Todo

Get all Todos

Update Todo

Delete Todo

Admin can:

View all users

Delete users

🧠 Backend Architecture

Follows a clean, scalable structure:

Controller → Service → Repository → Database

Controller → handles request/response

Service → business logic

Repository → DB queries (Prisma)

🛡️ Validation & Error Handling

Input validation using Zod

Prevents invalid/malicious data

Structured error system:

AppError class

Global error handler

Consistent API response format

📦 API Design

RESTful principles followed

Proper HTTP status codes

Versioned APIs (/api/v1)

Modular structure for scalability

💻 Frontend (Basic UI)

Built with Next.js

Features:

Signup / Signin

Protected dashboard

Todo CRUD operations

Error/success messages display

🔑 Admin Credentials (For Testing)
Email: admin@gmail.com
Password: admin123

⚠️ Note:
If time permitted, admin creation would include email/OTP verification.
For now, use the above credentials to test admin features.

📮 API Documentation

Postman Collection included (recommended for testing APIs).

▶️ How to Test APIs (Step-by-Step in Postman)
1. Sign Up (User)

Method: POST

Endpoint: /api/v1/auth/signup

Body (JSON):

{
  "email": "test@gmail.com",
  "password": "123456"
}
2. Sign In

Method: POST

Endpoint: /api/v1/auth/signin

✅ This will:

Set access token + refresh token in cookies

3. Access Protected Routes

Now you can call:

👉 Get Todos

GET /api/v1/todos

👉 Create Todo

POST /api/v1/todos

👉 Update Todo

PUT /api/v1/todos/:id

👉 Delete Todo

DELETE /api/v1/todos/:id

4. Refresh Token

POST /api/v1/auth/refresh

➡️ Generates new access token when expired

5. Admin Testing

Login using admin credentials, then:

👉 Get All Users

GET /api/v1/users

👉 Delete User

DELETE /api/v1/users/:id

⚙️ Security Highlights

JWT stored in httpOnly cookies

Short-lived access tokens

Refresh token rotation

Zod validation (prevents bad input)

Rate limiting (anti-spam)

Role-based authorization

🧱 Tech Stack

Backend: Node.js, Next.js API routes

Database: Prisma ORM

Auth: JWT (jose)

Validation: Zod

Frontend: Next.js

Deployment: Vercel

📈 Scalability Notes

This project is designed to scale:

Modular architecture (easy to split into microservices)

Repository pattern for DB abstraction

Can add:

Redis caching

Message queues

Load balancing

Docker containerization

📂 Project Structure (Simplified)
app/
 ├── modules/
 │    ├── auth/
 │    ├── todos/
 │    ├── users/
 ├── utils/
 ├── lib/
 ├── middleware.ts