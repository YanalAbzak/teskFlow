# Personal Task Management Application

A modern, secure, and user-friendly web application for managing personal tasks, with user authentication, categories, statistics, and advanced UI features.

---

Demo

![Demo](demo.gif)

*Modern login screen demo – RTL, responsive, and beautiful* 

---

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Personal Task Management**: Each user sees only their own tasks
- **Custom Categories**: Add, edit, and color-code categories
- **Task Filtering**: By status (completed/pending) and by category
- **Pagination**: 10 tasks per page
- **Due Dates**: Set deadlines for tasks
- **Modern UI**: Responsive, RTL-friendly, Bootstrap 5
- **Security**: SQL injection/XSS protection, session management, input validation
- **Statistics & Reports**: Interactive charts (Chart.js) for completed/pending tasks, by category and by month
- **Dark Mode / Light Mode**: User toggle, saved in localStorage
- **Drag & Drop Task Reordering**: SortableJS, order saved in DB
- **Quick Add, Inline Edit, Swipe, Keyboard Shortcuts**: *(in development)*
- **Custom Icons & Colors for Categories**

---

## Installation & Setup

### Prerequisites
- **Node.js** v14 or higher (recommended: latest LTS)
- **MySQL** v5.7 or higher
- **npm** (comes with Node.js)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
- Create a new MySQL database named `personal_tasks_db` (or your preferred name)
- Import the provided `database_export.sql` to create tables and demo data:

```bash
mysql -u <user> -p < personal_tasks_db.sql
```

- Make sure the `tasks` table includes the `sort_order` column (see `database_export.sql`)
- Update your DB credentials in `config/database.js` if needed

### 4. Run the Application
- For production:
```bash
npm start
```
- For development (with auto-reload):
```bash
npm run dev
```

### 5. Access the App
- Open your browser at: [http://localhost:3000](http://localhost:3000)
- Default admin user: `admin` / `admin123`

---

## Project Structure

```
project-root/
├── config/
│   └── database.js
├── middleware/
│   ├── user_Mid.js
│   ├── tasks_Mid.js
│   └── categories_Mid.js
├── Routers/
│   ├── auth_R.js
│   ├── users_R.js
│   ├── tasks_R.js
│   └── categories_R.js
├── views/
│   ├── partials/
│   ├── ... (EJS templates)
├── app.js
├── package.json
├── database_export.sql
└── README.md
```

---

## Database Schema (Main Tables)

### users
- `id` (PK)
- `name`
- `uname` (unique)
- `passwd` (hashed)
- `email`
- `type_id`
- `tz`
- `created_at`

### categories
- `id` (PK)
- `user_id` (FK)
- `name`
- `color`
- `created_at`

### tasks
- `id` (PK)
- `user_id` (FK)
- `category_id` (FK)
- `description`
- `due_date`
- `is_completed`
- `sort_order`
- `created_at`
- `updated_at`

---

## Security Highlights
- All SQL queries are parameterized (prevents SQL injection)
- User input is validated and sanitized
- JWT-based authentication for all protected routes
- Session and cookie security best practices
- Each user can access only their own data

---

## Recent Enhancements
- **Statistics & Reports**: Visual charts for task completion, by category/month
- **Drag & Drop**: Reorder tasks with instant DB sync
- **Dark Mode**: User toggle, persistent
- **UI/UX**: Modern, mobile-friendly, RTL support
- **Security**: Improved password handling, error handling, and session management

---

## Contribution
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---


