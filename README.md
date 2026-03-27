# Nexus — Production-Ready Full Stack Web Application

> React + Node.js + Express + MongoDB + Passport.js (Local Strategy) + Session Auth

---

## 📁 Full Project Structure

```
project/
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── passport.js            # Passport Local Strategy
│   ├── controllers/
│   │   ├── authController.js      # Signup / Login / Logout
│   │   ├── dashboardController.js # Dashboard + seed data
│   │   └── dataController.js      # CRUD operations
│   ├── middleware/
│   │   ├── auth.js                # ensureAuthenticated / ensureGuest
│   │   └── errorHandler.js        # Global error handler + AppError class
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt pre-save hook)
│   │   └── Item.js                # Item schema (task/lead/user)
│   ├── routes/
│   │   ├── authRoutes.js          # /login /signup /logout /api/auth/user
│   │   ├── dashboardRoutes.js     # /dashboard /
│   │   └── apiRoutes.js           # /api/data CRUD
│   ├── views/
│   │   ├── login.ejs
│   │   ├── signup.ejs
│   │   ├── dashboard.ejs
│   │   └── error.ejs
│   ├── server.js                  # Express entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state (useReducer)
    │   ├── hooks/
    │   │   └── useData.js         # CRUD hook (create/read/update/delete)
    │   ├── services/
    │   │   └── api.js             # Axios instance + interceptors
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx # Auth guard
    │   │   ├── GuestRoute.jsx     # Redirect authenticated users
    │   │   ├── ItemModal.jsx      # Create/Edit modal
    │   │   ├── Spinner.jsx        # Loading indicator
    │   │   └── Toast.jsx          # Toast notification system
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx      # Full CRUD dashboard
    │   ├── App.jsx                # Router + providers
    │   └── index.js
    ├── package.json
    └── .env.example
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm or yarn

---

### Step 1 — Clone and Install

```bash
# Clone or copy the project
cd project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nexus_db
SESSION_SECRET=your_super_secret_key_minimum_32_chars_change_this
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000
```

> ⚠️ Never commit `.env` files. Use `.env.example` as a template.

---

### Step 3 — Start MongoDB

```bash
# If running locally
mongod

# Or use MongoDB Atlas — paste your connection string in MONGO_URI
```

---

### Step 4 — Start the Backend

```bash
cd backend
npm run dev     # Development (nodemon)
# OR
npm start       # Production
```

Server starts at: `http://localhost:5000`

---

### Step 5 — Start the React Frontend

```bash
cd frontend
npm start
```

App opens at: `http://localhost:3000`

---

## 🔐 Authentication Flow

```
Signup:
  POST /signup → validate → hash pw → save User → redirect /login

Login:
  POST /login → Passport LocalStrategy → serialize user ID into session
             → session stored in MongoDB via connect-mongo
             → redirect /dashboard

Session Check (React):
  On app mount → GET /api/auth/user
  → 200 OK: set user in AuthContext → render protected routes
  → 401: stay on guest routes

Logout:
  GET /logout → req.logout() → req.session.destroy() → clear cookie → redirect /login
```

---

## 🛣️ Complete Route Reference

### Auth Routes (EJS)

| Method | Path     | Auth Required | Description             |
|--------|----------|---------------|-------------------------|
| GET    | /signup  | No (guest)    | Render signup form      |
| POST   | /signup  | No (guest)    | Register new user       |
| GET    | /login   | No (guest)    | Render login form       |
| POST   | /login   | No (guest)    | Authenticate user       |
| GET    | /logout  | Yes           | Destroy session + logout|

### Dashboard Route (EJS)

| Method | Path       | Auth Required | Description             |
|--------|------------|---------------|-------------------------|
| GET    | /dashboard | Yes           | Render full dashboard   |

### API Routes (JSON)

| Method | Path             | Auth Required | Description             |
|--------|------------------|---------------|-------------------------|
| GET    | /api/auth/user   | No            | Get current session user|
| GET    | /api/data        | Yes           | Get all items (paginated)|
| POST   | /api/data        | Yes           | Create item             |
| PUT    | /api/data/:id    | Yes           | Update item             |
| DELETE | /api/data/:id    | Yes           | Delete item             |

---

## 📮 API Testing (Postman / curl)

### 1. Register a User

```bash
curl -X POST http://localhost:5000/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123","confirmPassword":"secret123"}'
```

### 2. Login

```bash
curl -c cookies.txt -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'
```

### 3. Get Current User

```bash
curl -b cookies.txt http://localhost:5000/api/auth/user
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Create an Item

```bash
curl -b cookies.txt -X POST http://localhost:5000/api/data \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix login bug","category":"task","priority":"high","status":"active"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Item created successfully.",
  "data": {
    "_id": "...",
    "title": "Fix login bug",
    "category": "task",
    "priority": "high",
    "status": "active",
    "owner": "...",
    "createdAt": "..."
  }
}
```

### 5. Get All Items (with filters)

```bash
# All items
curl -b cookies.txt "http://localhost:5000/api/data"

# Filter by category and status
curl -b cookies.txt "http://localhost:5000/api/data?category=task&status=active"

# Paginated
curl -b cookies.txt "http://localhost:5000/api/data?page=1&limit=10"
```

### 6. Update an Item

```bash
curl -b cookies.txt -X PUT http://localhost:5000/api/data/{ITEM_ID} \
  -H "Content-Type: application/json" \
  -d '{"status":"completed","priority":"low"}'
```

### 7. Delete an Item

```bash
curl -b cookies.txt -X DELETE http://localhost:5000/api/data/{ITEM_ID}
```

### 8. Logout

```bash
curl -b cookies.txt http://localhost:5000/logout
```

---

## 🛡️ Security Features

| Feature | Implementation |
|---------|---------------|
| Password hashing | bcryptjs, salt rounds = 12 |
| Session storage | MongoDB via connect-mongo |
| httpOnly cookies | `httpOnly: true` in session config |
| Secure cookies | `secure: true` in production |
| Session fixation prevention | `req.session.regenerate()` on login |
| Cookie name obscuring | `name: 'sessionId'` |
| Input validation | Frontend + backend |
| Duplicate email guard | MongoDB unique index + pre-check |
| Route protection | `ensureAuthenticated` middleware |
| CORS | Restricted to FRONTEND_URL |
| Global error handler | Normalizes all errors, hides internals in prod |

---

## ⚠️ Error Handling

All errors flow through `middleware/errorHandler.js`:

| Error Type | HTTP Status | Handling |
|------------|-------------|---------|
| Invalid credentials | 401 | Flash message → redirect /login |
| Duplicate email | 409 | Flash message → redirect /signup |
| Validation errors | 422 | Field-level error messages |
| Unauthorized | 401 | API → JSON, HTML → redirect /login |
| Not found | 404 | API → JSON, HTML → error.ejs |
| Server error | 500 | Sanitized message in production |
| Session expired | 401 | React interceptor → redirect /login |

---

## 🚀 Production Deployment

```bash
# Backend
NODE_ENV=production
SESSION_SECRET=<random 64-char string>
MONGO_URI=<atlas connection string>

# Build React
cd frontend && npm run build

# Serve static build from Express (optional)
# Add to server.js:
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
```

---

## 📦 All Dependencies

### Backend
| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| passport | Auth middleware |
| passport-local | Username/password strategy |
| express-session | Session management |
| connect-mongo | Session store (MongoDB) |
| bcryptjs | Password hashing |
| connect-flash | Flash messages for EJS |
| dotenv | Environment variables |
| ejs | Server-side templating |

### Frontend
| Package | Purpose |
|---------|---------|
| react | UI library |
| react-dom | DOM rendering |
| react-router-dom | Client-side routing |
| axios | HTTP client with interceptors |
