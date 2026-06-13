# Brocus Solution — Full-Stack E-Commerce Platform

Brocus Solution is a production-ready, highly interactive, and premium SaaS-style full-stack e-commerce application. It features real-time search, category filtering, a secure purchase flow, product management (CRUD), and animated modal interactions powered by Framer Motion.

---

## Folder Structure

```text
brocussolution/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   └── orderController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── orders/
    │   │   │   └── page.tsx
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/
    │   │   ├── AuthModal.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── ProductCard.tsx
    │   │   ├── ProductModal.tsx
    │   │   └── SkeletonCard.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── hooks/
    │   │   └── useAuth.ts
    │   ├── services/
    │   │   ├── api.ts
    │   │   ├── authService.ts
    │   │   ├── productService.ts
    │   │   └── orderService.ts
    │   └── types/
    │       └── index.ts
    ├── .env.local
    ├── .env.local.example
    ├── next.config.ts
    └── package.json
```

---

## Tech Stack

| Domain | Technology | Details |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) | High-performance React framework with SSR capabilities |
| | Tailwind CSS v4 | Curated sleek Slate theme variables with glassmorphism |
| | React Hook Form | Dynamic client-side input validations |
| | React Hot Toast | Real-time elegant action alert popups |
| | Framer Motion | Fluid hardware-accelerated animations & page entries |
| | Axios | Centralized client instance with automatic JWT interceptors |
| **Backend** | Node.js & Express.js | Secure REST API backend |
| | MongoDB Atlas & Mongoose | Flexible NoSQL document database schema validation |
| | JSON Web Tokens (JWT) | Safe stateless token auth authorization |
| | bcryptjs | Robust password cryptography hashing |

---

## Environment Variables

### Backend (`backend/.env`)
Create a file named `.env` in the `backend/` folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/brocus?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkeychangeinproduction
```

### Frontend (`frontend/.env.local`)
Create a file named `.env.local` in the `frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## API Documentation

### 1. Authentication
* **`POST /api/auth/signup`** (Public)
  * Request Body: `{ "name", "email", "password" }`
  * Action: Registers user and returns token.
* **`POST /api/auth/login`** (Public)
  * Request Body: `{ "email", "password" }`
  * Action: Authenticates credentials and returns token.
* **`GET /api/me`** (Private)
  * Headers: `Authorization: Bearer <token>`
  * Action: Returns current user's profile details.

### 2. Products
* **`GET /api/products`** (Public)
  * Optional Query Params: `search` (filter by title regex), `category`
  * Action: Returns array of matching products.
* **`GET /api/products/:id`** (Public)
  * Action: Returns single product details by ID.
* **`POST /api/products`** (Private)
  * Request Body: `{ "title", "description", "imageUrl", "price", "category", "stock" }`
  * Action: Publishes a new product.
* **`PUT /api/products/:id`** (Private)
  * Request Body: Update fields (e.g. `{ "price", "stock" }`)
  * Action: Modifies product properties by ID.
* **`DELETE /api/products/:id`** (Private)
  * Action: Deletes product by ID.

### 3. Orders
* **`POST /api/purchase`** (Private)
  * Request Body: `{ "productId", "quantity" }`
  * Action: Processes purchase transaction, decrements product stock, saves order log.
* **`GET /api/orders/my-orders`** (Private)
  * Action: Returns chronological purchase log list of the authenticated user.

---

## Installation & Running Locally

### Prerequisites
- Node.js installed (v18+)
- MongoDB daemon running locally (`mongodb://127.0.0.1:27017/brocus`) OR MongoDB Atlas URI

### Steps
1. **Clone the Repository**
2. **Boot the Backend Server**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The backend server will run on `http://localhost:5000`.*
3. **Boot the Frontend Client**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *The Next.js client will run on `http://localhost:3000`.*

---

## Deployment Guide

### Database: MongoDB Atlas
1. Create a free shared cluster.
2. Under Network Access, allow access from `0.0.0.0/0` (or Vercel/Railway IP ranges).
3. Obtain your Database URI connection string and use it as `MONGODB_URI`.

### Backend: Railway
1. Sign in to Railway and create a new project.
2. Select **Deploy from GitHub repo** and point to your project backend folder/repo.
3. In Project settings, add environmental variables: `PORT=5000`, `MONGODB_URI`, `JWT_SECRET`.
4. Railway will automatically deploy and expose a public domain (e.g., `https://brocus-backend.up.railway.app`).

### Frontend: Vercel
1. Sign in to Vercel and click **Add New Project**.
2. Select your repository. Set root directory to `frontend/`.
3. In settings, configure environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL (e.g. `https://brocus-backend.up.railway.app`).
4. Click **Deploy**. Vercel exposes your premium storefront.
