# Brocus Solution – Full Stack E-Commerce Platform

## Live Demo

### Frontend (Vercel)

https://brocus.vercel.app/

### Backend API (Render)

https://brocus-backend.onrender.com/

### Source Code (GitHub)

https://github.com/rohanvarankar/brocus

---

# Project Overview

Brocus Solution is a production-ready full-stack e-commerce application developed as part of a Full Stack Developer assessment.

The application provides:

* User Authentication
* Role-Based Access Control
* Product Management
* Cart Management
* Checkout Process
* Order Management
* Admin Dashboard
* Search & Filtering
* Responsive Design
* Secure REST APIs

The project follows a modern client-server architecture using Next.js, Express.js, MongoDB Atlas, JWT Authentication, and cloud deployment services.

---

# Tech Stack

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Axios
* Framer Motion
* React Hook Form
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* Helmet
* Express Rate Limit
* CORS

## Deployment & DevOps

### Frontend Hosting

* Vercel

### Backend Hosting

* Render

### Database

* MongoDB Atlas

### Repository Hosting

* GitHub

### Backend Uptime Monitoring

* Uptime Robot

### Development Environment

* Visual Studio Code (VS Code)

---

# Project Structure

```text
brocus/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# Assignment Features

## Authentication

* User Registration
* User Login
* Password Hashing using bcryptjs
* JWT Authentication
* Protected Routes
* Protected APIs
* Logout Functionality

---

## User Features

Users can:

* Browse Products
* Search Products
* Filter Products
* Add Products to Cart
* Update Cart Quantity
* Remove Products from Cart
* Clear Cart
* Checkout Orders
* View Order History
* Track Order Status

Users cannot:

* Create Products
* Edit Products
* Delete Products
* Access Admin Dashboard

---

## Admin Features

Admins can:

* Access Admin Dashboard
* Create Products
* Edit Products
* Delete Products
* View Orders
* Update Order Status

Admins cannot:

* Add Products to Cart
* Checkout Products
* Purchase Products

---

# Product Search & Filtering

Implemented Features:

* Real-Time Search
* Dynamic Categories
* Price Filtering
* Stock Availability Filtering
* Pagination

---

# Cart Workflow

```text
Browse Products
       ↓
Add To Cart
       ↓
Update Cart
       ↓
Checkout
       ↓
Create Order
       ↓
Track Order Status
```

---

# Order Management

Supported Order Statuses:

* Pending
* Processing
* Shipped
* Delivered
* Cancelled

Admins can update order status.

Users can view the latest order status in real time.

---

# Role-Based Access Control (RBAC)

The application implements secure role-based authorization.

```text
User
 ├── Products
 ├── Cart
 ├── Checkout
 └── Orders

Admin
 ├── Dashboard
 ├── Product CRUD
 ├── Order Management
 └── Status Updates
```

All sensitive operations are protected both on:

* Frontend
* Backend APIs

Unauthorized actions return:

```http
403 Forbidden
```

---

# Test Credentials

## User Account

Email:

```text
testuser1@gmail.com
```

Password:

```text
Test@123
```

---

## Admin Account

Email:

```text
admin@brocus.com
```

Password:

```text
Admin123
```

---

# How To Use

## User Flow

### Step 1

Open:

https://brocus.vercel.app/

### Step 2

Login using User credentials.

### Step 3

Browse products.

### Step 4

Use search and filters.

### Step 5

Add products to cart.

### Step 6

Proceed to checkout.

### Step 7

View order history and status.

---

## Admin Flow

### Step 1

Login using Admin credentials.

### Step 2

Access Admin Dashboard.

### Step 3

Create new products.

### Step 4

Update product details.

### Step 5

Delete products.

### Step 6

View customer orders.

### Step 7

Update order statuses.

---

# API Security

Implemented Security Features:

* JWT Authentication
* Password Hashing (bcryptjs)
* Protected Routes
* Protected APIs
* Role-Based Authorization
* Helmet Security Headers
* Rate Limiting
* Input Validation
* Environment Variables

---

# Local Development Setup

## Clone Repository

```bash
git clone https://github.com/rohanvarankar/brocus.git
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

## Backend

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# Deployment Architecture

```text
User Browser
      │
      ▼
Frontend (Vercel)
https://brocus.vercel.app
      │
      ▼
Backend API (Render)
https://brocus-backend.onrender.com
      │
      ▼
MongoDB Atlas
```

---

# Notes

* Backend is hosted on Render Free Tier.
* Uptime Robot is used to keep the backend awake and reduce cold starts.
* Frontend is deployed on Vercel.
* MongoDB Atlas is used as the cloud database.
* GitHub is used for source code management and version control.
* VS Code was used for development.

---

# Author

Rohan Varankar

Full Stack Developer

Tech Stack:
React • Next.js • Node.js • Express.js • MongoDB • TypeScript
