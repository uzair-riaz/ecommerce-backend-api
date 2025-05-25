# Database Schema Documentation

## Overview
This document describes the database schema for the E-commerce Admin API. The database is designed using MySQL with TypeORM as the ORM, following normalized design principles to prevent redundancy and maintain consistency.

## Database Type
- **Database**: MySQL
- **ORM**: TypeORM

## Tables/Entities

### 1. Categories
**Purpose**: Stores product categories for organization and filtering.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique category identifier |
| name | VARCHAR(255) | NOT NULL | Category name |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Record update timestamp |

**Relationships**:
- One-to-Many with Products (one category can have multiple products)

### 2. Products
**Purpose**: Stores product information including pricing, stock levels, and metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique product identifier |
| name | VARCHAR(255) | NOT NULL | Product name |
| description | TEXT | NULLABLE | Product description |
| price | DECIMAL(10,2) | NOT NULL | Product price |
| sku | VARCHAR(255) | NOT NULL, UNIQUE | Stock Keeping Unit |
| stock | INT | NOT NULL | Current stock quantity |
| categoryId | INT | FOREIGN KEY | Reference to categories.id |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Record update timestamp |

**Relationships**:
- Many-to-One with Categories (many products belong to one category)
- One-to-Many with Sales (one product can have multiple sales)
- One-to-Many with InventoryChanges (one product can have multiple inventory changes)

**Indexes**:
- PRIMARY KEY on id
- UNIQUE INDEX on sku
- INDEX on categoryId (foreign key)
- INDEX on stock (for low stock queries)

### 3. Sales
**Purpose**: Records all sales transactions with quantity and pricing information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique sale identifier |
| productId | INT | FOREIGN KEY, NOT NULL | Reference to products.id |
| quantity | INT | NOT NULL | Quantity sold |
| totalPrice | DECIMAL(10,2) | NOT NULL | Total sale amount |
| soldAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Sale timestamp |

**Relationships**:
- Many-to-One with Products (many sales belong to one product)

**Indexes**:
- PRIMARY KEY on id
- INDEX on productId (foreign key)
- INDEX on soldAt (for date-based queries)
- COMPOSITE INDEX on (soldAt, productId) for analytics queries

### 4. Inventory Changes
**Purpose**: Tracks all inventory movements for audit and analysis purposes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique change identifier |
| productId | INT | FOREIGN KEY, NOT NULL | Reference to products.id |
| changeAmount | INT | NOT NULL | Change in quantity (positive for additions, negative for reductions) |
| reason | VARCHAR(255) | NULLABLE | Reason for the change |
| changedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Change timestamp |

**Relationships**:
- Many-to-One with Products (many inventory changes belong to one product)

**Indexes**:
- PRIMARY KEY on id
- INDEX on productId (foreign key)
- INDEX on changedAt (for date-based queries)