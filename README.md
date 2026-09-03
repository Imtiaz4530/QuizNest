## 🚀 QuizNest

**QuizNest** is a full-stack online quiz platform built specifically for Bangladeshi students and competitive-exam candidates. It features a high-performance user application, a dedicated admin dashboard, and a secure REST API.

---

### 🔗 Live Demos & Access

- **Client App:** [Live Demo](https://quiznest-eight-pi.vercel.app)
- **Admin Panel:** [Live Demo](https://quiz-nest-admin.vercel.app)
- **API Endpoint:** [Live API](https://quiz-nest-server.vercel.app)

> [!NOTE]
> **Demo Admin Account:** Use these credentials to test the admin panel safely. Do not store sensitive information here.
>
> - **Email:** `test1@gmail.com`
> - **Password:** `123`

---

### 🧱 Project Architecture

QuizNest is structured as a monorepo containing three distinct applications communicating seamlessly:

```text
QuizNest/
├── client/    # User-facing React application
├── admin/     # Admin dashboard
└── server/    # Express REST API

```

```text
Client ──┐
         ├──> REST API (Express + TS) ──> MongoDB
Admin  ──┘

```

---

### 🛠️ Tech Stack

#### **Frontend**

- **Core:** React, TypeScript, React Router
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **Utilities:** Axios, React Toastify

#### **Backend**

- **Core:** Node.js, Express.js, TypeScript
- **Database:** MongoDB, Mongoose
- **Security:** JWT (JSON Web Tokens), bcrypt (Password Hashing)

#### **Tools & Deployment**

- Git & GitHub
- RESTful Architecture
- Environment-based Configuration

---

### ✨ Core Features

| User Application                  | Admin Dashboard |
| --------------------------------- | --------------- |
| \* JWT-based registration & login |                 |

- Browse categories & exams
- Timed multiple-choice quizzes
- Instant results & score calculation
- Quiz history & performance tracking
- Global leaderboard
- Light/Dark mode toggle
- Fully responsive layout | \* Overview statistics & analytics
- Full CRUD for Categories, Exams & Questions
- Comprehensive user management
- Quiz attempt monitoring
- Leaderboard management
- Protected routes with Role-Based Access Control (RBAC) |

---

### 🔐 Authentication & Security

QuizNest employs strict **JWT-based authentication** coupled with **Role-Based Access Control (RBAC)** to ensure data integrity.

- **Regular Users:** Access exams, take timed quizzes, view personal results, track performance history, and manage profile settings.
- **Administrators:** Access protected administrative panels to manage categories, monitor active attempts, oversee user profiles, and review system-wide analytics.

---

### 📱 User Experience & Interface

- **Responsive Design:** Fully optimized layouts tailored for desktops, tablets, and mobile phones with dynamic sidebars and mobile navigation menus.
- **Theme Support:** Built-in support for native light and dark mode preferences across all user interfaces.

---

### 🚀 Project Status

The platform is fully developed, deployed, and operational with the following milestones completed:

- [x] Client application & Admin dashboard
- [x] REST API with TypeScript & Express
- [x] Authentication & Role-based authorization
- [x] Interactive timed quiz system & attempt logging
- [x] Results, performance tracking, & Global Leaderboard
- [x] Complete management modules (Users, Categories, Exams, Questions)
- [x] Responsive UI with Light/Dark Mode

---

### 👨‍💻 Author

Built with passion using React, Node.js, Express, MongoDB, TypeScript, and Tailwind CSS.
