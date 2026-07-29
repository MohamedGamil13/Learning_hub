# LearningHub

A comprehensive **online learning platform** backend API built with Node.js, Express, and MongoDB. LearningHub enables instructors to create and manage courses with lessons, while students can enroll, track progress, review courses, and access educational content. The platform supports multiple user roles with role-based access control.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-variables)
  - [Running the Application](#running-the-application)
- [Data Models](#data-models)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling & Response Format](#error-handling--response-format)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **User Management** – Registration, authentication, and role-based profiles (Student, Instructor, Admin, Guest)
- **Course Management** – Instructors can create, update, delete, and publish courses with thumbnails, pricing, and ratings
- **Lesson Management** – Organize course content into structured lessons with video URLs, duration, ordering, preview options, and bulk reordering
- **Enrollment System** – Students can enroll in courses, track learning progress (0–100%), and cancel enrollments
- **Reviews & Ratings** – Students can rate and review courses; average rating auto-recalculates on changes
- **Role-Based Access Control (RBAC)** – Granular permissions ensuring only authorized users can perform specific actions
- **Input Validation** – Comprehensive validation using `express-validator` for all API endpoints
- **JWT Authentication** – Secure token-based authentication with Bearer tokens
- **Unified Error Handling** – Global error handling middleware with consistent response format, including CastError, duplicate key, and validation error handling
- **CORS Support** – Cross-origin resource sharing enabled for frontend integration
- **Static File Serving** – Upload and serve course thumbnails and user avatars
- **HTTP Logging** – Request logging via Morgan in development mode

## Tech Stack

| Category                  | Technology                  |
| ------------------------- | --------------------------- |
| **Runtime**               | Node.js                     |
| **Framework**             | Express.js v5.2.1           |
| **Database**              | MongoDB v7.5.0              |
| **ODM**                   | Mongoose v9.8.0             |
| **Authentication**        | JSON Web Token (JWT) v9.0.3 |
| **Password Hashing**      | bcrypt v6.0.0               |
| **Validation**            | express-validator v7.3.2    |
| **CORS**                  | cors v2.8.6                 |
| **HTTP Logging**          | morgan v1.11.0              |
| **Environment Variables** | dotenv v17.4.2              |
| **Dev Tools**             | nodemon v3.1.14             |

## System Architecture

LearningHub follows a **Layered Architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Frontend)                    │
└───────────────────────────────┬─────────────────────────────┘
                                │ HTTP Requests
┌───────────────────────────────▼─────────────────────────────┐
│                      Express.js Server                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Middleware Layer                      │ │
│  │  • CORS • Body Parser • Auth • Authorization • Validation│ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                      Routes Layer                        │ │
│  │  /api/users  /api/courses  /api/lessons                  │ │
│  │  /api/enrollments  /api/reviews                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Controllers Layer                      │ │
│  │  Handle business logic, coordinate models & responses    │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                      Models Layer                        │ │
│  │  User, Course, Lesson, Enrollment, Review (Mongoose)     │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                       MongoDB Database                       │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Client** sends HTTP request to Express server
2. **Middleware Chain** processes request (CORS → JSON parsing → Authentication → Authorization → Validation)
3. **Router** directs request to appropriate controller based on endpoint
4. **Controller** executes business logic, interacts with models
5. **Model** performs database operations via Mongoose ODM
6. **Response** is formatted with status and data, sent back to client

## Project Structure

```
LearningHub/
├── config/
│   └── db.config.js              # MongoDB connection configuration
├── constants/
│   ├── response.status.js        # Standardized response status constants (success, error, fail)
│   └── user.types.js             # User role definitions (student, instructor, admin, guest)
├── controllers/
│   ├── course.controller.js      # Course CRUD operations & business logic
│   ├── enrollment.controller.js  # Enrollment management & progress tracking
│   ├── lesson.controller.js      # Lesson CRUD operations within courses
│   ├── review.controller.js      # Review CRUD & rating management
│   └── user.controller.js        # User registration & authentication
├── middlewares/
│   ├── asnyc.wrapper.js          # Async error handling wrapper (handles CastError, duplicate key, ValidationError)
│   ├── auth.middleware.js        # JWT token verification
│   ├── authorization.js          # Role-based access control
│   ├── check.course.owner.middleware.js # Course ownership validation (supports courseId & enrollmentId)
│   ├── check.review.owner.js     # Review ownership validation
│   └── validation.middleware.js  # Centralized validation error handling
├── models/
│   ├── courses.model.js          # Course schema with instructor, pricing, ratings
│   ├── enrollment.model.js       # Student-course enrollment with progress tracking
│   ├── lesson.model.js           # Lesson schema with video, duration, ordering
│   ├── reviews.model.js          # Review schema with rating, comment, student-course uniqueness
│   └── user.model.js             # User schema with roles, authentication
├── routes/
│   ├── course.route.js           # Course API endpoints
│   ├── enrollment.route.js       # Enrollment API endpoints
│   ├── lesson.route.js           # Lesson API endpoints (nested under courses)
│   ├── review.routes.js          # Review API endpoints
│   └── user.routes.js            # User authentication endpoints
├── utils/
│   ├── api.response.js           # Unified API response handler (sendSuccess, sendCreated, sendError)
│   ├── app.error.js              # Custom error class with statusCode and status properties
│   ├── check.email.exist.js      # Email uniqueness validation utility
│   ├── check.exist.js            # Generic existence check utility (null, undefined, empty array)
│   ├── display.user.js           # User data formatting utility (strips password & __v)
│   ├── generate.token.js         # JWT token generation (10min expiry)
│   ├── logger.js                 # Application logging utility
│   └── recalculate.course.rating.js # Auto-recalculate course average rating from reviews
├── validators/
│   ├── course.validation.js      # Course input validation rules
│   ├── enrollment.validation.js  # Enrollment validation rules
│   ├── lesson.validation.js      # Lesson input validation rules
│   ├── review.validation.js      # Review input validation rules
│   └── users.validator.js        # User registration/login validation
├── uploads/                      # Static directory for uploaded files (thumbnails, avatars)
├── .gitignore                    # Git ignore rules (.env, DB_details.txt)
├── index.js                      # Application entry point & server setup
├── package.json                  # Dependencies & scripts
└── README.md                     # This file
```

### Directory & File Descriptions

| Path           | Purpose                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| `config/`      | Database connection and configuration                                     |
| `constants/`   | Application-wide constants (response statuses, user roles)                |
| `controllers/` | Request handlers containing business logic                                |
| `middlewares/` | Express middleware for auth, authorization, validation, error handling    |
| `models/`      | Mongoose schemas defining data structure and relationships                |
| `routes/`      | Express routers defining API endpoints and middleware chains              |
| `utils/`       | Helper functions for common operations (token generation, email checks)   |
| `validators/`  | Input validation rules using express-validator                            |
| `uploads/`     | Directory for serving static uploaded files                               |
| `index.js`     | Main application file - Express setup, middleware, routes, error handling |

## API Endpoints

### Authentication & Users

| Method | Endpoint              | Description                | Access |
| ------ | --------------------- | -------------------------- | ------ |
| POST   | `/api/users/register` | Register new user          | Public |
| POST   | `/api/users/login`    | User login & get JWT token | Public |

### Courses

| Method | Endpoint                        | Description                      | Access                         |
| ------ | ------------------------------- | -------------------------------- | ------------------------------ |
| GET    | `/api/courses/`                 | Get all courses                  | Public                         |
| GET    | `/api/courses/:courseId`        | Get course by ID                 | Public                         |
| GET    | `/api/courses/enrolled_courses` | Get student's enrolled courses   | Student, Admin                 |
| GET    | `/api/courses/added_courses`    | Get instructor's created courses | Instructor, Admin              |
| POST   | `/api/courses/`                 | Create new course                | Instructor, Admin              |
| PATCH  | `/api/courses/:courseId`        | Update course                    | Instructor, Admin (owner only) |
| DELETE | `/api/courses/:courseId`        | Delete course                    | Instructor, Admin (owner only) |

### Lessons (Nested under Courses)

| Method | Endpoint                                         | Description                  | Access                         |
| ------ | ------------------------------------------------ | ---------------------------- | ------------------------------ |
| GET    | `/api/courses/:courseId/lessons`                 | Get all lessons for a course | Public                         |
| GET    | `/api/courses/:courseId/lessons/:lessonId`       | Get single lesson            | Public                         |
| POST   | `/api/courses/:courseId/lessons`                 | Add lesson to course         | Instructor, Admin (owner only) |
| PATCH  | `/api/courses/:courseId/lessons/:lessonId`       | Update lesson                | Instructor, Admin (owner only) |
| DELETE | `/api/courses/:courseId/lessons/:lessonId`       | Delete lesson                | Instructor, Admin (owner only) |
| PATCH  | `/api/courses/:courseId/lessons/:lessonId/order` | Change single lesson order   | Instructor, Admin (owner only) |
| PATCH  | `/api/courses/:courseId/lessons/order`           | Bulk update lessons order    | Instructor, Admin (owner only) |

### Enrollments

| Method | Endpoint                              | Description                | Access                         |
| ------ | ------------------------------------- | -------------------------- | ------------------------------ |
| GET    | `/api/enrollments/student/:studentId` | Get student's enrollments  | Student, Admin                 |
| GET    | `/api/enrollments/course/:courseId`   | Get all students in course | Instructor, Admin (owner only) |
| GET    | `/api/enrollments/:enrollmentId`      | Get enrollment details     | Admin, Instructor (owner only) |
| POST   | `/api/enrollments/:courseId`          | Enroll in course           | Student                        |
| DELETE | `/api/enrollments/:enrollmentId`      | Cancel enrollment          | Student, Admin, Instructor     |

### Reviews

| Method | Endpoint                        | Description                | Access                                  |
| ------ | ------------------------------- | -------------------------- | --------------------------------------- |
| GET    | `/api/reviews/course/:courseId` | Get all reviews for course | Public                                  |
| GET    | `/api/reviews/:reviewId`        | Get review by ID           | Public                                  |
| POST   | `/api/reviews/:courseId`        | Add review to course       | Student                                 |
| PATCH  | `/api/reviews/:reviewId`        | Update review              | Student (owner only)                    |
| DELETE | `/api/reviews/:reviewId`        | Delete review              | Student, Instructor, Admin (owner only) |

## Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** v18+ (recommended) or v16+
- **npm** v8+ or **yarn** v1.22+
- **MongoDB** – Either:
  - Local MongoDB instance running on default port (27017)
  - MongoDB Atlas cloud database (recommended for production)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MohamedGamil13/Learning_hub.git
   cd Learning_hub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (see below)

4. **Run the application**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode (without nodemon)
   node index.js
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT_NUMBER=3000

# MongoDB Connection (replace with your connection string)
CONNECTION_STRING=mongodb://localhost:27017/learninghub

# JWT Secret Key (use a strong, random secret in production)
JWT_SECERT_KEY=your_super_secret_jwt_key_change_this_in_production

# Optional: Node environment
NODE_ENV=development
```

> **⚠️ Security Note:** Never commit your `.env` file to version control. The `.env` file is already listed in `.gitignore`.

### Running the Application

After completing the installation and environment setup:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `PORT_NUMBER`).

You should see the following output in the console:

```
Server is running
MongoDB Connected=====
```

### Testing the API

You can test the API using tools like:

- **Postman** – Import the endpoints and test manually
- **curl** – Command-line HTTP client
- **Thunder Client** – VS Code extension
- **Insomnia** – Cross-platform REST client

Example: Register a new user

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"student"}'
```

## Data Models

### User

```javascript
{
  name: String,           // Required, trimmed
  email: String,          // Required, unique, validated with regex
  password: String,       // Required, min 8 chars, hashed with bcrypt, excluded from queries by default
  role: String,           // Enum: student, instructor, admin, guest (default: student)
  avatar: String,         // Optional, URL to avatar image
  bio: String,            // Optional
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-updated
}
```

### Course

```javascript
{
  title: String,                    // Required, trimmed
  description: String,              // Required, trimmed
  instructor: ObjectId (ref: User), // Required, references User (indexed)
  price: Number,                    // Required, min 0
  thumbnail: String,                // Optional, URL to thumbnail (default: "")
  published: Boolean,               // Default: false (indexed)
  averageRating: Number,            // Default: 0, auto-calculated from reviews
  ratingsCount: Number,             // Default: 0, auto-calculated from reviews
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-updated
}
```

### Lesson

```javascript
{
  course: ObjectId (ref: Course), // Required, references Course (indexed)
  title: String,                  // Required, trimmed
  description: String,            // Optional, trimmed (default: "")
  videoUrl: String,               // Required, trimmed
  duration: Number,               // Default: 0 (minutes), min 0
  order: Number,                  // Required, min 1 (lesson sequence)
  isPreview: Boolean,             // Default: false (free preview)
  createdAt: Date,                // Auto-generated
  updatedAt: Date                 // Auto-updated
}
```

### Enrollment

```javascript
{
  student: ObjectId (ref: User),  // Required, references User
  course: ObjectId (ref: Course), // Required, references Course
  progress: Number,               // 0-100, default: 0
  enrollmentAt: Date,             // Created timestamp (custom name)
  updatedAt: Date                 // Updated timestamp
}
// Compound unique index on { student, course } prevents duplicate enrollments
```

### Review

```javascript
{
  course: ObjectId (ref: Course), // Required, references Course (indexed)
  student: ObjectId (ref: User),  // Required, references User
  comment: String,                // Optional, trimmed
  rating: Number,                 // Required, min 1, max 5
  createdAt: Date,                // Auto-generated
  updatedAt: Date                 // Auto-updated
}
// Compound unique index on { student, course } ensures one review per student per course
```

## Authentication & Authorization

### Authentication Flow

1. User registers via `POST /api/users/register`
2. User logs in via `POST /api/users/login` → receives JWT token
3. Include token in subsequent requests: `Authorization: Bearer <token>`
4. Token expires after **10 minutes** (configured in `utils/generate.token.js`)

### Authorization (RBAC)

The application implements Role-Based Access Control with four roles:

| Role           | Permissions                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| **Student**    | Enroll in courses, view own progress, access enrolled content, review courses |
| **Instructor** | Create/manage own courses & lessons, view enrolled students                   |
| **Admin**      | Full access to all resources and operations                                   |
| **Guest**      | View public courses and lessons only                                          |

Protected routes require:

1. Valid JWT token in `Authorization` header
2. Appropriate user role for the operation

### Ownership Checks

- **Course Ownership**: Instructors can only modify their own courses. The `check.course.owner.middleware.js` middleware supports both direct `courseId` param and `enrollmentId` param lookup. Admin users bypass ownership checks.
- **Review Ownership**: Students can only modify their own reviews. The `check.review.owner.js` middleware ensures the authenticated user is the review author (admin users bypass this check).

## Error Handling & Response Format

### Unified Response Format

All API responses follow a consistent structure:

```json
{
  "status": "success" | "fail" | "error",
  "message": "Optional message string",
  "data": { ... }
}
```

### Response Helpers (`utils/api.response.js`)

| Function      | HTTP Status   | Usage                              |
| ------------- | ------------- | ---------------------------------- |
| `sendSuccess` | 200           | Successful GET/PATCH/DELETE        |
| `sendCreated` | 201           | Successful POST (resource created) |
| `sendError`   | 400 (default) | Client error responses             |

### Global Error Handling

The async wrapper (`middlewares/asnyc.wrapper.js`) automatically catches errors and handles common Mongoose errors:

| Error Type            | HTTP Status  | Description                        |
| --------------------- | ------------ | ---------------------------------- |
| `CastError`           | 400          | Invalid MongoDB ID format          |
| Duplicate Key (11000) | 409          | Duplicate value for unique field   |
| `ValidationError`     | 400          | Mongoose schema validation failure |
| Custom `AppError`     | As specified | Application-level errors           |
| Unhandled Errors      | 500          | Internal server errors             |

### Custom Error Class (`utils/app.error.js`)

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    // statusCode 4xx → status: "fail"
    // statusCode 5xx → status: "error"
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

---

**Repository:** [Learning_hub](https://github.com/MohamedGamil13/Learning_hub)  
**Issues:** [Report bugs or request features](https://github.com/MohamedGamil13/Learning_hub/issues)
