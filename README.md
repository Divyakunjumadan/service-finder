# ⚡ Service Finder — Full-Stack Setup Guide

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

---

## 🗄️ MongoDB Setup (Choose ONE)

### Option A — MongoDB Atlas (Cloud, Free) RECOMMENDED
1. Go to https://cloud.mongodb.com → Sign up free
2. Create a free **M0** cluster (any region)
3. Under **Security → Database Access** → Add a DB user with a password
4. Under **Security → Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Click **Connect** → **Drivers** → copy the URI
6. Paste it in `backend/.env` as `MONGO_URI=mongodb+srv://...`

### Option B — Local MongoDB
1. Download MongoDB Community: https://www.mongodb.com/try/download/community
2. Install and start the service
3. Set `MONGO_URI=mongodb://localhost:27017/service-finder` in `backend/.env`

---

## ⚙️ Environment Setup

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=<your MongoDB URI here>
JWT_SECRET=ServiceFinder_SuperSecret_JWT_Key_2024!
NODE_ENV=development
```

---

## 🚀 Running the Application

### Terminal 1 — Backend
```bash
cd service-finder/backend
npm install          # (already done)
npm run seed         # Creates admin account
npm run dev          # Starts API on http://localhost:5000
```

### Terminal 2 — Frontend
```bash
cd service-finder/frontend
npm install          # (already done)
npm run dev          # Starts UI on http://localhost:5173
```

---

## 🔐 Default Admin Login
```
Email:    admin@servicefinder.com
Password: Admin@123
```

---

## 📁 Project Structure
```
service-finder/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/      (auth, user, vendor, request, review, admin)
│   │   ├── middleware/        (auth.js, role.js)
│   │   ├── models/            (User, Vendor, Request, Review, Notification)
│   │   ├── routes/            (auth, user, vendor, request, review, admin)
│   │   ├── jobs/autoCancelJob.js
│   │   ├── seeds/adminSeed.js
│   │   └── server.js
│   ├── uploads/               (vendor images)
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/               (axios, auth, vendors, requests, admin)
    │   ├── components/        (Navbar, VendorCard, StatusBadge, LoadingSpinner)
    │   ├── context/AuthContext.jsx
    │   ├── routes/ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── user/          (Home, VendorDetail, RequestService, History, Notifications, Profile)
    │   │   ├── vendor/        (Dashboard, History, Notifications, Profile)
    │   │   └── admin/         (Dashboard, Users, Vendors, Requests, Feedback)
    │   ├── App.jsx
    │   └── index.css
    ├── vite.config.js
    └── package.json
```

---

## 🌐 API Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/auth/register | — | Register user or vendor |
| POST | /api/auth/login | — | Login, returns JWT |
| GET | /api/auth/me | Any | Get current user |
| GET | /api/vendors | User | List vendors (filterable) |
| GET | /api/vendors/:id | User | Vendor details + reviews |
| PATCH | /api/vendors/status | Vendor | Toggle open/closed, busy |
| POST | /api/requests | User | Submit service request |
| GET | /api/requests/user | User | User's request history |
| GET | /api/requests/vendor | Vendor | Vendor's requests |
| PATCH | /api/requests/:id | Vendor | Accept/Reject/Complete |
| POST | /api/reviews | User | Submit rating & review |
| GET | /api/admin/analytics | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | All users |
| PATCH | /api/admin/users/:id/block | Admin | Block/unblock user |
| GET | /api/admin/vendors | Admin | All vendors |
| PATCH | /api/admin/vendors/:id/approve | Admin | Approve/reject vendor |
| DELETE | /api/admin/vendors/:id | Admin | Remove vendor |
| GET | /api/admin/requests | Admin | All requests (filterable) |
| GET | /api/admin/reviews | Admin | All reviews |

---

## 🔄 Full User Flow

### As a Customer:
1. Register as **User** at `/register`
2. Browse vendors at `/dashboard`
3. Click a vendor → View details
4. Click **Request Service** → Fill form → Submit
5. Wait for vendor response (15 min auto-cancel)
6. Check `/history` for request status
7. After completion → Leave a ⭐ review

### As a Vendor:
1. Register as **Vendor** at `/register`
2. Dashboard auto-loads at `/vendor/dashboard`
3. Toggle **Open/Closed** and **Available/Busy**
4. Incoming requests appear in the table
5. **Accept** → becomes Busy; **Reject** → request rejected
6. Go to History → Mark accepted request as **Complete**
7. Customer can now leave a review

### As Admin:
1. Login with `admin@servicefinder.com / Admin@123`
2. View analytics at `/admin`
3. Block users at `/admin/users`
4. Approve/remove vendors at `/admin/vendors`
5. Monitor all requests at `/admin/requests`
6. Review feedback at `/admin/feedback`

---

## ⏱️ Auto-Cancel Logic
- A `node-cron` job runs **every minute**
- Finds all `pending` requests older than **15 minutes**
- Updates their status to `auto-cancelled`
- Sends notifications to both user and vendor
