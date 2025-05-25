# E-commerce Admin API

A comprehensive backend API that powers a web admin dashboard for e-commerce managers, providing detailed insights into sales, revenue, and inventory management.

## 🛠 Technology Stack

### Programming Language and Framework
- **Language**: TypeScript (Node.js)
- **Framework**: Express.js
- **Runtime**: Node.js v18+

### API Type
- **API Standard**: RESTful API
- **Architecture**: REST (Representational State Transfer)
- **Response Format**: JSON
- **HTTP Methods**: GET, POST, PATCH
- **Status Codes**: Standard HTTP status codes (200, 201, 400, 404, 500, etc.)

### Database
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Features**: ACID compliance, relational data integrity, optimized indexing

### Additional Technologies
- **Validation**: Joi schema validation
- **Security**: Helmet.js, CORS
- **Environment Management**: dotenv
- **Build System**: TypeScript compiler
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed on your machine
- Docker Compose (comes with Docker Desktop)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-backend-api
   ```

2. **Build and start the application**
   ```bash
   docker-compose up --d
   ```

3. **Access the application**
   - API: http://localhost:3000
   - MySQL Database: localhost:3306

### Docker Services
- **Application**: Node.js/TypeScript app running on port 3000
- **MySQL Database**: MySQL 8.0 on port 3306 with database `ecommerce_dev`

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### 1. Products (`/products`)
**Purpose**: Manage product catalog and inventory

- **`GET /products`** - Retrieve products with filtering
  - Query params: `page`, `limit`, `category`, `lowStock`, `search`
  
- **`POST /products`** - Create new products
  - Body: `name`, `price`, `sku`, `stock`, `categoryId`
  
- **`GET /products/inventory`** - Get inventory overview
  - Returns total value, low stock alerts, product counts
  
- **`PATCH /products/:id/inventory`** - Update product stock
  - Body: `changeAmount`, `reason`

### 2. Sales (`/sales`)
**Purpose**: Handle sales transactions and analytics

- **`GET /sales`** - Retrieve sales with filtering
  - Query params: `page`, `limit`, `startDate`, `endDate`, `productId`, `categoryId`
  
- **`POST /sales`** - Record new sales
  - Body: `productId`, `quantity`
  
- **`GET /sales/analytics/revenue`** - Revenue analytics
  - Query params: `period` (daily/weekly/monthly/yearly), `startDate`, `endDate`
  
- **`GET /sales/analytics/category`** - Sales by category
  - Query params: `startDate`, `endDate`
  
- **`GET /sales/analytics/comparison`** - Compare periods
  - Query params: `currentStartDate`, `currentEndDate`, `previousStartDate`, `previousEndDate`