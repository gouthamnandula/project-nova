# NOVA Backend

NOVA is a team productivity and project management platform that helps teams create projects, manage tasks, collaborate with members, and track project progress.

This repository contains the backend REST API for NOVA.

---

## 🚀 Features

### Authentication

- User registration
- Secure password hashing using bcrypt
- User login
- JWT-based authentication
- Protected API routes
- Current authenticated user endpoint

### Project Management

- Create projects
- View projects
- View individual projects
- Update projects
- Delete projects
- Project ownership

### Team Collaboration

- Add users to projects
- View project members
- Remove project members
- Project owner and member roles
- Prevent duplicate project memberships
- Prevent project owners from being removed

### Task Management

- Create tasks
- View all tasks belonging to a project
- View individual tasks
- Update tasks
- Delete tasks
- Assign tasks to project members
- Task status management
- Task priority management
- Due dates

### Dashboard Statistics

The API provides project-level statistics including:

- Total tasks
- TODO tasks
- In-progress tasks
- Completed tasks
- Overall project completion percentage

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| TypeScript | Type-safe backend development |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and schema management |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin request handling |
| dotenv | Environment variable management |

---

## 📁 Project Structure

```text
backend/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── project.controller.ts
│   │   └── task.controller.ts
│   │
│   ├── middleware/
│   │   └── auth.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── project.routes.ts
│   │   └── task.routes.ts
│   │
│   ├── app.ts
│   ├── prisma.ts
│   └── server.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL

Recommended versions:

```text
Node.js 20+
PostgreSQL 15+
npm 10+
```

---

## 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the backend:

```bash
cd nova/backend
```

Install dependencies:

```bash
npm install
```

---

## 🗄️ Database Setup

Create a PostgreSQL database for NOVA.

Example:

```text
Database: nova_db
User: nova_user
Port: 5433
```

The database configuration is provided through the `DATABASE_URL` environment variable.

---

## 🔐 Environment Variables

Create a `.env` file inside the backend directory:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_secure_jwt_secret"
```

Example:

```env
DATABASE_URL="postgresql://nova_user:nova_password@localhost:5433/nova_db"
JWT_SECRET="your_secure_jwt_secret"
```

> ⚠️ Never commit `.env` files or production secrets to Git.

---

## 🧬 Prisma Setup

Generate the Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

For production deployments:

```bash
npx prisma migrate deploy
```

---

## ▶️ Running the Backend

### Development

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

You should see:

```text
NOVA API is running on port 5000
```

### Production Build

Build the TypeScript project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## ❤️ Health Check

The backend provides a health endpoint:

```http
GET /health
```

Example:

```bash
curl http://localhost:5000/health
```

Successful response:

```json
{
  "status": "OK",
  "database": "connected"
}
```

---

## 🔑 Authentication API

### Register

```http
POST /auth/register
```

Request:

```json
{
  "name": "Goutham",
  "email": "goutham@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "name": "Goutham",
    "email": "goutham@example.com"
  }
}
```

### Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "goutham@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "Goutham",
    "email": "goutham@example.com"
  }
}
```

Use the returned token for protected endpoints:

```text
Authorization: Bearer <token>
```

### Current User

```http
GET /auth/me
```

Authentication required. Returns the currently authenticated user.

---

## 📂 Project API

### Create Project

```http
POST /projects
```

Request:

```json
{
  "name": "NOVA Platform",
  "description": "Team productivity platform"
}
```

Authentication required.

### Get Projects

```http
GET /projects
```

Returns projects owned by the authenticated user.

### Get Project

```http
GET /projects/:id
```

Returns a specific project.

### Update Project

```http
PUT /projects/:id
```

Request:

```json
{
  "name": "Updated NOVA Platform",
  "description": "Updated project description"
}
```

### Delete Project

```http
DELETE /projects/:id
```

Deletes the project and its related tasks and memberships.

---

## 👥 Project Member API

### Add Member

```http
POST /projects/:id/members
```

Request:

```json
{
  "email": "member@example.com"
}
```

The user must already have a NOVA account.

### Get Members

```http
GET /projects/:id/members
```

Returns all members belonging to the project.

### Remove Member

```http
DELETE /projects/:id/members/:userId
```

Removes a member from the project. The project owner cannot be removed.

---

## ✅ Task API

### Create Task

```http
POST /projects/:projectId/tasks
```

Request:

```json
{
  "title": "Build dashboard",
  "description": "Create the main dashboard UI",
  "priority": "HIGH",
  "dueDate": "2026-09-15T00:00:00.000Z",
  "assigneeId": "user-id"
}
```

`priority`, `dueDate`, and `assigneeId` are optional.

Available priorities:

```text
LOW
MEDIUM
HIGH
```

### Get Project Tasks

```http
GET /projects/:projectId/tasks
```

Returns all tasks belonging to a project.

### Get Task

```http
GET /tasks/:id
```

Returns a specific task.

### Update Task

```http
PUT /tasks/:id
```

Example:

```json
{
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

Available statuses:

```text
TODO
IN_PROGRESS
DONE
```

Available priorities:

```text
LOW
MEDIUM
HIGH
```

### Delete Task

```http
DELETE /tasks/:id
```

Deletes a task.

---

## 📊 Project Statistics API

### Get Project Statistics

```http
GET /projects/:projectId/stats
```

Example response:

```json
{
  "totalTasks": 10,
  "todoTasks": 3,
  "inProgressTasks": 4,
  "completedTasks": 3,
  "progress": 30
}
```

The `progress` value represents the percentage of completed tasks.

---

## 🗃️ Database Models

The application uses the following main database models:

```text
User
 │
 ├── Projects
 │
 ├── Project Memberships
 │
 └── Assigned Tasks
       │
       └── Project

Project
 │
 ├── Owner
 ├── Members
 └── Tasks

ProjectMember
 │
 ├── User
 └── Project

Task
 │
 ├── Project
 └── Assignee
```

| Model | Description |
|-------|--------------|
| **User** | Stores registered NOVA users |
| **Project** | Stores projects and their owners |
| **ProjectMember** | Creates the relationship between users and projects |
| **Task** | Stores project tasks, their status, priority, due date, and optional assignee |

---

## 🔒 Security

The backend implements several security measures:

- Passwords are hashed using bcrypt
- Password hashes are never returned through API responses
- Protected routes require JWT authentication
- Project ownership is checked before modifying projects
- Project ownership is checked before managing members
- Tasks are restricted to projects owned by the authenticated user
- Task assignees must belong to the corresponding project
- Environment secrets are stored outside the source code

> For production deployment, use a strong randomly generated JWT secret and secure database credentials.

---

## 🧪 API Testing

The API can be tested using:

- cURL
- Postman
- Insomnia

Example:

```bash
curl http://localhost:5000/health
```

Protected endpoint example:

```bash
curl http://localhost:5000/auth/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 🔄 Development Workflow

```text
1. Start PostgreSQL
       ↓
2. Start backend
       ↓
3. React frontend sends API request
       ↓
4. Express receives request
       ↓
5. Authentication middleware validates JWT
       ↓
6. Controller processes business logic
       ↓
7. Prisma communicates with PostgreSQL
       ↓
8. API returns JSON response
```

---

## 🏗️ Architecture

NOVA follows a layered backend architecture:

```text
Client
  │
  ▼
Express Routes
  │
  ▼
Authentication Middleware
  │
  ▼
Controllers
  │
  ▼
Prisma ORM
  │
  ▼
PostgreSQL
```

| Layer | Responsibility |
|-------|-----------------|
| **Routes** | Define API endpoints and connect them to controllers |
| **Middleware** | Handles authentication and request-level processing |
| **Controllers** | Contain the application's business logic |
| **Prisma** | Provides type-safe database access |
| **PostgreSQL** | Provides persistent relational data storage |

---

## 📌 API Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/` | API status | No |
| GET | `/health` | Database health | No |
| POST | `/auth/register` | Register user | No |
| POST | `/auth/login` | Login | No |
| GET | `/auth/me` | Current user | Yes |
| POST | `/projects` | Create project | Yes |
| GET | `/projects` | Get projects | Yes |
| GET | `/projects/:id` | Get project | Yes |
| PUT | `/projects/:id` | Update project | Yes |
| DELETE | `/projects/:id` | Delete project | Yes |
| POST | `/projects/:id/members` | Add member | Yes |
| GET | `/projects/:id/members` | Get members | Yes |
| DELETE | `/projects/:id/members/:userId` | Remove member | Yes |
| GET | `/projects/:projectId/stats` | Project statistics | Yes |
| POST | `/projects/:projectId/tasks` | Create task | Yes |
| GET | `/projects/:projectId/tasks` | Get project tasks | Yes |
| GET | `/tasks/:id` | Get task | Yes |
| PUT | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes |

---

## 🚀 Deployment

Before deploying:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

Configure the following environment variables on the production server:

```env
DATABASE_URL="production-database-url"
JWT_SECRET="production-secret"
```

The frontend should use the deployed backend URL when making API requests.

---

## 👨‍💻 NOVA

**Plan. Collaborate. Deliver.**

NOVA is designed to provide teams with a simple and centralized workspace for managing projects, tasks, responsibilities, and progress.