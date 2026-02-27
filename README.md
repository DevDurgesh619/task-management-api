Task Management System — Secure Scalable Backend with Role-Based Access

This project is a full-stack task management system designed to demonstrate real-world backend engineering practices including authentication, authorization, API design, and scalability considerations.

The system is built with a strong focus on security, modular architecture, and clean separation of concerns, while also providing a minimal frontend interface to interact with the APIs.

Basic frontend integration (i use tanstack for optimistic updates and background caching)

NOTE: I only use AI to polish the frontend UI for both dashboard  and to create this README.md file to demonstrate the functionality of this backend focused project well. 


🌐 Live Application

Access the deployed application here:
👉 https://task-management-api-git-main-devdurgesh619s-projects.vercel.app/

🧠 Project Overview

The application allows users to manage tasks through a secure API layer while enforcing role-based access control. Two roles are supported:

User → Can manage their own todos (CRUD operations)

Admin → Has elevated privileges including viewing all users and deleting them

The system is designed in a way that mirrors production backend systems, with proper layering, validation, and security mechanisms in place.

🔐 Authentication & Authorization Design

Authentication is implemented using JWT (JSON Web Tokens) with a dual-token strategy:

Access Token (short-lived, 10 minutes) → Used for API access

Refresh Token (long-lived, 7 days) → Used to regenerate access tokens

Both tokens are securely stored in HTTP-only cookies, mitigating XSS risks. Additional cookie configurations (secure, same-site) are applied to reduce CSRF attack vectors.

During token generation, essential user information such as:

userId

email

role

is embedded in the payload, enabling efficient authorization checks without repeated database queries.

🛡️ Route Protection & Middleware

A centralized authentication flow is enforced using:

Middleware layer → Ensures every protected request contains a valid access token

requireAuth utility → Verifies and decodes JWT, returning authenticated user data

This decoded user object is then used to enforce role-based restrictions, ensuring that:

Only admins can access sensitive operations (e.g., deleting users)

Unauthorized attempts are blocked with proper HTTP responses (403 Forbidden)

🧱 Backend Architecture

The backend follows a modular and scalable architecture pattern:

Controller → Service → Repository → Database

Controller Layer handles HTTP requests and responses

Service Layer contains business logic

Repository Layer interacts with the database (via Prisma)

This separation ensures:

Better maintainability

Easier scalability

Clean debugging and testing

🧪 Validation & Error Handling

To ensure robustness and security:

Zod is used for request validation and input sanitization

Invalid or malicious data is rejected before reaching the database

Validation errors are also propagated to the frontend for better UX

A centralized error handling system is implemented using:

A custom AppError class

A global error handler

A consistent API response format

This results in predictable and clean error management across the application.

⚡ Rate Limiting & Abuse Prevention

To prevent abuse and spamming:

Authentication endpoints (signup/signin) are protected using rate limiting

Each user is restricted to 5 requests per minute

This adds a basic but effective layer of protection against brute-force attacks.

📝 Core Functionality
User Capabilities

Register and login securely

Create, update, delete, and fetch personal todos

Access protected dashboard

Admin Capabilities

View all registered users

Delete users from the system

💻 Frontend Integration

A lightweight frontend is built using Next.js to demonstrate API usability.

It includes:

Authentication flows (signup/signin)

Protected dashboard access

Todo CRUD interactions

Real-time error/success feedback from API responses

The frontend acts as a simple client to validate backend behavior rather than a full production UI.

📮 API Usage (Postman Guide)

To test APIs using Postman:

Step 1: Register or Login

Send a request to:

POST /api/v1/auth/signup
POST /api/v1/auth/signin

Upon successful login:

Access & refresh tokens are automatically set in cookies

Step 2: Access Protected Routes

Once authenticated, you can call:

GET /api/v1/todos

POST /api/v1/todos

PUT /api/v1/todos/:id

DELETE /api/v1/todos/:id

Step 3: Refresh Token

If access token expires:

POST /api/v1/auth/refresh
Step 4: Admin Testing

Use the following credentials:

Email: admin@gmail.com
Password: admin123

Admin-only endpoints:

GET /api/v1/users

DELETE /api/v1/users/:id

🔒 Security Considerations

This project incorporates several important security practices:

HTTP-only cookie storage for tokens

Short-lived access tokens

Input validation via Zod

Role-based authorization

Rate limiting on sensitive endpoints

⚙️ Tech Stack

Backend: Node.js, Next.js API Routes

Database: Prisma ORM

Authentication: JWT (jose)

Validation: Zod

Frontend: Next.js

Deployment: Vercel

📈 Scalability & Future Improvements

The system is intentionally designed to support future scaling:

Modular structure allows easy migration to microservices

Repository layer enables database abstraction

Can be extended with:

Redis caching

Message queues (Kafka/RabbitMQ)

Load balancing

Docker-based deployment

Future enhancements could include:

Email/OTP-based verification for admin roles


Token rotation strategies

Advanced monitoring and logging

app/
├── api/
│   └── v1/                     # Versioned API layer
│       ├── auth/              # Authentication routes (signin, signup, refresh)
│       ├── todos/             # Todo CRUD routes
│       ├── users/             # Admin-only user management routes
│
├── modules/                   # Business logic (feature-based modules)
│   ├── auth/                  # Auth controller, service, repository
│   ├── todos/                 # Todo logic (CRUD operations)
│   ├── users/                 # User management (admin controls)
│
├── utils/                     # Shared utilities
│   ├── error handling (AppError)
│   ├── API response formatter
│   ├── validation helpers
│
├── lib/                       # Core configurations & reusable services
│   ├── prisma client
│   ├── rate limiter
│   ├── auth helpers (JWT, requireAuth)
│
├── middleware.ts              # Route protection & token validation
