# ShopKart — Full-Stack E-Commerce Application

ShopKart is a full-stack e-commerce web application built using the MERN stack. It provides a shopping workflow covering customer authentication, product discovery, wishlist management, shopping cart operations, checkout, and order tracking.

The project was developed through six engineering labs, covering backend development, frontend integration, database modelling, authentication, state management, and payment integration.

## Features

### 1. Customer Authentication
- Customer registration and login.
- Password hashing using bcrypt.
- JWT-based authentication using HttpOnly cookies.
- Protected routes and customer profile retrieval.
- Logout and authentication state management.

### 2. Product Catalog
- Dynamic product listing from MongoDB.
- Individual product details pages.
- Product search by name.
- Filtering products by category.
- Product information including price, description, image, category, and stock.

### 3. Wishlist Management
- Add products to a personal wishlist.
- Prevent duplicate wishlist entries.
- View and remove saved products.
- Persistent wishlist data in MongoDB.
- Protected, user-specific wishlist operations.

### 4. Shopping Cart
- Add products to the cart.
- Increase or decrease item quantities.
- Remove products from the cart.
- Persist cart data for authenticated customers.
- Display cart item count and subtotal.
- Validate requested quantities against available stock.
- Manage shared cart state using React Context.

### 5. Checkout and Orders
- Checkout page with shipping details.
- Review cart items before purchase.
- Validate product availability.
- Store orders with product and price snapshots.
- Razorpay test-mode payment integration.
- Backend payment signature verification.
- Order confirmation and order history.
- Clear the cart after successful payment verification.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Routing | React Router DOM |
| API communication | Axios |
| State management | React Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt, cookie-parser |
| Payment integration | Razorpay Test Mode |
| Version control | Git, GitHub |

## Project Structure

```text
ShopKart/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── .env
├── fronted/
│   └── shopkart/
│       ├── public/
│       ├── src/
│       ├── package.json
│       └── vite.config.js
├── .gitignore
└── README.md
```

**Note:** The frontend directory is named `fronted` in the current project structure.

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database or MongoDB Atlas account
- Razorpay test-mode credentials

### 1. Clone the Repository

```bash
git clone https://github.com/KanishkaSingh-18/ShopKart.git
cd ShopKart
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=8003
dbUrl=your_mongodb_connection_string
jwt_secret=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Replace the placeholders with your own credentials. Keep the variable names exactly as shown because they must match the backend code.

Start the backend from the `backend/` directory:

```bash
npx nodemon index.js
```

### 3. Configure and Start the Frontend

Open a second terminal:

```bash
cd ~/ShopKart/fronted/shopkart
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

In the current development setup, the frontend uses port `5177` and the backend uses port `8003`. Ensure the frontend API base URL and backend CORS configuration match your local setup.

## Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend port, if read by the application |
| `dbUrl` | MongoDB connection string |
| `jwt_secret` | Secret used to sign and verify JWTs |
| `RAZORPAY_KEY_ID` | Razorpay test key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay test key secret |

**Security:** Never commit `.env` files, database credentials, JWT secrets, or payment secrets to GitHub. Use Razorpay test credentials for development and payment testing.

## Application Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Customer login |
| `/signup` | Customer registration |
| `/home` | Customer home page |
| `/products` | Product catalog |
| `/products/:id` | Product details |
| `/wishlist` | Saved products |
| `/cart` | Shopping cart |
| `/checkout` | Checkout and payment |
| `/orders` | Order history |
| `/orders/:id` | Order details |

Protected pages require customer authentication.

## Learning Outcomes

Through this project, I practised:

- Building REST APIs with Express.js and MongoDB.
- Implementing authentication and protected resources.
- Modelling relationships using Mongoose references and population.
- Integrating React with backend APIs.
- Managing shared application state using React Context.
- Validating inventory and order data.
- Integrating a payment gateway with server-side verification.
- Organising a full-stack application into reusable frontend components and backend modules.

## Payment Testing

ShopKart uses Razorpay test-mode payment integration. Use test credentials and supported test payment methods when testing the checkout flow. Test transactions are not intended to collect real payments.

## Author

**Kanishka Singh**

GitHub: [KanishkaSingh-18](https://github.com/KanishkaSingh-18)
