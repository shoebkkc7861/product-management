
– Product Management System

# 1. Setup

cd user-management-api
npm install

Create .env:

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=secret
DB_NAME=product_management
JWT_SECRET=your_jwt_secret
PORT=3000

Start:
node --watch index.js



-------------------------------------------------------

# 2. Project Architecture (Backend) 
Controllers → Request handling

Services → Business logic

Utils → CSV/XLSX parser, file helpers

DB Models → SQL queries + validation

----------------------------------


# 3. API Endpoints

User
POST /user/signup
POST /user/login
PUT /user/update
PATCH /user/activate
PATCH /user/deactivate


Category
POST /category/create
PUT /category/update
GET /category/list
DELETE /category/delete


Product
POST /product/create
PUT /product/update
GET /product/findOne/:unique_id
DELETE /product/delete
GET /product/list?page=1&limit=20&sort=price_asc&category_id=3&q=shirt


Bulk Upload
POST /product/bulk-upload
GET /product/bulk-upload/status/:jobId


Report
POST /product/report
GET /product/report/status/:jobId

------------------------------------------------------


# 4. Features (Assignment Requirements)

User CRUD

Category CRUD (UUID auto-generated)

Product CRUD (UUID auto-generated)

Server-side pagination

Price sorting (asc/desc)

Search by product/category name

Bulk product upload (async, no timeout)

CSV/XLSX reports (async job)



-------------------------


# 5. Database Schema (Exact CREATE TABLE Queries)

Users

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `gender` enum('male','female','other') NOT NULL,
  `dob` date DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `country` varchar(50) DEFAULT 'India',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
);



Categories

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) DEFAULT NULL,
  `uuid` varchar(50) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`)
);


Products

CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `image` varchar(512) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `unique_id` char(36) DEFAULT (uuid()),
  `category_id` int NOT NULL,
  `stock` int DEFAULT '0',
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`)
);




Bulk Upload Jobs

CREATE TABLE `products_bulk_jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` char(36) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `total_rows` int DEFAULT '0',
  `processed_rows` int DEFAULT '0',
  `failed_rows` int DEFAULT '0',
  `status` enum('pending','processing','completed','failed') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_id` (`job_id`)
);



Report Jobs

CREATE TABLE `product_report_jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` char(36) DEFAULT NULL,
  `file_path` varchar(512) DEFAULT NULL,
  `filters` json DEFAULT NULL,
  `status` enum('pending','processing','completed','failed') DEFAULT 'pending',
  `total_rows` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_id` (`job_id`)
);




-----------------

# 6. Postman Collection

ProductManagement.postman_collection.json included.



---------------

# 7. Background Jobs

Bulk upload → processes CSV in batches

Report generator → async XLSX/CSV export


Prevents timeout (504)
Jobs → Long running tasks (avoids timeout 504)

-----------------------


# 7. Features

JWT authentication

User, Category, Product CRUD (product → category required)

Server-side pagination + search + price sorting

Bulk CSV upload (async job → no timeout)

CSV report generation (async job)


------------------------

# 8. Bulk Upload (Simple Explanation)

POST /product/bulk-upload

Accepts CSV file (multipart/form-data)

Creates a job entry in products_bulk_jobs

Background worker processes file in batches and updates progress

Flow:

Upload CSV

Get jobId

Check progress: GET /product/bulk-upload/status/:jobId



------------------------


# 9. Report Generation (Simple Explanation)

POST /product/report

Accepts filters (category, price, search term)

Creates a report job

Worker generates CSV file and saves under reports/

Flow:

Send POST request with { format: 'csv', filters: {...} }

System generates CSV

Response returns file path


-----------------------


# 10. Authorization header JWT 

-  must send the token in the Authorization header: Authorization: Bearer <token>. - In code the token is the second word in req.headers.authorization:

js const auth = req.headers.authorization; // 'Bearer eyJ...' if (!auth) return res.status(401).send('Missing Authorization header'); const token = auth.split(' ')[1]; // second word is the JWT



Report filters (summary) -
 POST /product/report
accepts { format: 'csv', filters: { category_id, min_price, max_price, q, is_active } }. -
Current behavior: - missing category_id => include all categories - missing min_price => default 0 (include prices >= 0) - missing max_price => no upper bound - missing is_active => include both active and inactive If you want different defaults or behavior, tell me and I'll update the service and README.