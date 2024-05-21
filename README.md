# SwiftCart API

Welcome to the **SwiftCart API**! This API provides a comprehensive suite of endpoints for managing an e-commerce platform. It includes functionalities for products, users, orders, payments, shipping, reviews, and wishlist management. Below you will find detailed information on how to set up, run, and utilize this API.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Endpoints](#endpoints)
  - [Admin Routes](#admin-routes)
  - [Cart Routes](#cart-routes)
  - [Order Routes](#order-routes)
  - [Payment Routes](#payment-routes)
  - [Product Routes](#product-routes)
  - [Review Routes](#review-routes)
  - [Shipping Routes](#shipping-routes)
  - [User Routes](#user-routes)
  - [Wishlist Routes](#wishlist-routes)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/download)

### Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/MahmoudAbdelsamie/swiftcart.git
   cd swiftcart
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up PostgreSQL**:
   Create a PostgreSQL database and note the connection details.

4. **Set up Redis**:
   Ensure Redis is installed and running.

### Configuration

Create a `.env` file in the root directory of the project and add the following environment variables:

```
PORT=5000
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASS=
DATABASE_HOST=
DATABASE_PORT=
JWT_SECRET=
REDIS_URL=
STRIPE_SECRET_KEY=
```

### Running the Server

Start the development server:

```sh
npm start
```

The server will start on the port specified in your `.env` file (default is 5000).

## API Documentation

The API documentation is available and can be accessed using Swagger UI. Once the server is running, navigate to:

```
http://localhost:5000/api-docs
```

OR

```
https://app.swaggerhub.com/apis/mhmoud.swe/SwiftCart/1.0.0#
```

Here you will find a comprehensive guide to all the endpoints, including request parameters, request bodies, and responses.

## Features

- User registration and authentication
- Product management
- Order processing
- Payment integration
- Shipping information management
- Review and rating system
- Wishlist functionality
- Admin-specific routes for managing the platform

## Endpoints

### Admin Routes

- **POST /admin/products**: Add a new product
- **PUT /admin/products/:id**: Update a product
- **DELETE /admin/products/:id**: Delete a product
- **GET /admin/products**: Get all products
- **GET /admin/products/:id**: Get a specific product
- **GET /admin/orders**: Get all orders
- **GET /admin/users**: Get all users
- **GET /admin/users/:id**: Get a specific user
- **DELETE /admin/users/:id**: Delete a user
- **GET /admin/reports/sales**: Get sales reports

### Cart Routes

- **POST /cart**: Add an item to the cart
- **GET /cart**: Get the user's cart
- **DELETE /cart/:cartItemId**: Delete an item from the cart

### Order Routes

- **POST /orders**: Create a new order
- **GET /orders/history**: Get the user's order history
- **GET /orders/:id**: Get order details
- **GET /user/orders**: Get the user's orders
- **GET /orders/confirm/:orderId**: Confirm an order
- **GET /orders/track/:orderId**: Track an order

### Payment Routes

- **POST /create-payment-intent**: Create a payment intent
- **POST /orders/:orderId/pay**: Confirm payment for an order

### Product Routes

- **GET /products**: Get all products
- **GET /products/search**: Search for products
- **GET /products/categories**: Get product categories
- **GET /product/:id**: Get a specific product

### Review Routes

- **POST /reviews**: Add a review
- **GET /reviews/:productId**: Get reviews for a product

### Shipping Routes

- **POST /shipping**: Add shipping information
- **GET /shipping/status/:orderId**: Get shipping status

### User Routes

- **POST /user/register**: Register a new user
- **POST /user/login**: Log in a user
- **PUT /user/password**: Update user password
- **POST /user/password-reset/request**: Request a password reset
- **POST /user/password-reset/verify**: Verify password reset
- **GET /user/profile**: Get user profile
- **PUT /user/profile**: Update user profile

### Wishlist Routes

- **POST /wishlist**: Add to wishlist
- **GET /wishlist**: Get wishlist
- **DELETE /wishlist/:itemId**: Delete a wishlist item

## Contributing

I welcome contributions to the api from the community, If you would like to contribute, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Create a new Pull Request
