<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">NestJS Backend E-commerce system that supports multi-tenancy and Role-based Access Control.</p>
    <p align="center">

## Features

REST API for:
1. User Authentication &amp; Authorization:
2. Product Management
3. Order Processing
4. Payment Handling Simulation
5. Email Confirmation when an Order is placed

## Approaches
1. Multi-Tenancy (Database Per Tenant Approach)
2. Event-driven
3. Caching
4. Unit and Integration testing

## Requirements

Node.js v20
PostgreSQL
Redis

## Database ORM

Prisma is chosen as the database ORM because of it has the ability to abstract the database implementation. It provides the same approach to either SQL or NoSQL.

The power of using Prisma is its type-safety approach. The migrations deployed are then build into TypeScript types and stored inside the node_modules. Thus, it makes the developer experience type-safety when dealing with data models.

## Multi-tenancy Strategy

The application has 2 types of database:
1. Management Database, consists of "Tenants" and "Users" table.
2. Tenants Database, consists of "Products" and "Orders". Each Tenant owned a database, so the data are separated.

Implementation:
1. The application connects to the Management Database from the startup.
2. The application lazily connects to the Tenant Database in a Request-scope.

Entity Relationship:
1. Tenant - User: One-to-many
2. Product - Order: One-to-many

Product also store tenantId.
Order also store tenantId, customerId = User.id, and productId.

## Multi-tenancy Security

Every request (except to tenants and users) will get the Tenant information in the Middleware.
Every request guarded by TenantGuard will check somethings:
- Customer users can read allowed records from every Tenants.
- Admin users can only manage its Tenant records. If Admin tries to access records from different tenants, the user will receive 'Tenant is not found' exception.

## Caching

This application employs caching to increase the query performance. The chosen database to do caching is Redis because it is designed for read-heavy operation, thus it fit to the goal to increase the query speed.

It is also claimed that it is highly scalabile, resilient, and flexible to any infrastructure architectures.

## REST API and Microservices

This application designed to be built on top of REST API and Microservices.

REST API are useful for handling request from external clients that want to interact with our system entities (e.g. tenants, users, products, orders).

Microservices are useful for handling either request-response or asynchronous operations. But in this application we only use asynchronous operation to handling order created event (e.g. sending order created email).

## Pagination

Find all operations are wrapped into pagination request and response to control the response size and also increasing query performance.
Pagination request parameters: limit, page, search
Pagination response: totalDocuments, limit, page, hasNextPage, hasPrevPage

## Installation

```bash
$ npm install
```

## Deploy Database migrations

```bash
npx prisma migrate deploy
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Create a new tenant
High level algorithm to create tenants:
1. Create database name from input. Then, act as admin and create a new tenant database using the database name.
2. Create database schema 'public' for the new tenant database.
3. Apply migration to the new tenant database.
4. return the new tenant record.

```bash
curl -H "Content-Type: application/json" -X POST -d '{"name":"Tenant 1","subdomain":"tenant1"}' {host_url}/tenants
```

## Create a new User
High level algorithm to create users:
1. Create a new User. If role == Admin, tenantId is required.
2. If tenantId is defined, check the existence of the Tenant.
3. The server will hash the user's password.
4. Save the new User to the user table.
5. Return the new user ID.

New Customer User
```bash
curl -H "Content-Type: application/json" -X POST -d '{"name": "Customer 1","email": "customer1@gmail.com","password": "Customer1#","role": "Customer"}' {host_url}/users
```

New Admin User
```bash
curl -H "Content-Type: application/json" -X POST -d '{"name": "Admin 1","email":"admin1@gmail.com","password":"AdminAdmin1#","role":"Admin","tenantId":{tenantId} }' {host_url}/users
```

## Login
High level algorithm to login:
1. Login using email and password.
2. The server compares the input password vs hashed password
4. Return the access token, which contains user ID, email, role, and the corresponding tenant ID.

```bash
curl -H "Content-Type: application/json" -X POST -d '{"email": "customer1@gmail.com","password": "Customer1#","role": "Customer"}' {host_url}/users
```

## Apply Migrations to tenants databases using Admin user assigned to the Tenant

```bash
curl -H "Content-Type: application/json" -H "X-TENANT-ID: {TENANT ID}" -H "Authorization: Bearer {token}" -X POST {host_url}/tenants/apply-migrations
```

## Product Management

Admin can create, read, update and delete products in its Tenant.
Customer can read products from every Tenant.

create a new product
```bash
curl -H "Content-Type: application/json" -H "X-TENANT-ID: {TENANT ID}" -H "Authorization: Bearer {tokenAdminTenant}" -X POST -d '{"name": "Product 1","price": 5000}' {host_url}/products
```

update a product
```bash
curl -H "Content-Type: application/json" -H "X-TENANT-ID: {TENANT ID}" -H "Authorization: Bearer {tokenAdminTenant}" -X PATCH -d '{"name": "Product 1","price": 5000}' {host_url}/products/{productId}
```

delete a product
```bash
curl -H "Content-Type: application/json" -H "X-TENANT-ID: {TENANT ID}" -H "Authorization: Bearer {tokenAdminTenant}" -X DELETE {host_url}/products/{productId}
```

read all products
```bash
curl -H "Content-Type: application/json" -H "X-TENANT-ID: {TENANT ID}" -H "Authorization: Bearer {token}" -X GET {host_url}/products?limit=10&page=1&search=
```

read a product
```bash
curl -H "Content-Type: application/json" -H "X-TENANT-ID: {TENANT ID}" -H "Authorization: Bearer {token}" -X GET {host_url}/products/{productId}
```

Product data retrieved from read action is stored to cache REDIS for faster read performance.

## Order Creation & Payment handling

High Level Algorithm:
1. Customer can place a new order.
2. A new Order will have payment status = unpaid. Thus, user must pay in order to trigger the order processing.
3. The new Order placed will be published to the order_created event.
4. The email sender microservice will consume the order_created event. Then, it will send the Your New order email. 
5. In this situation, payment will be simulated via link provided in the incoming email about Your New Order.

place a new order
```bash
curl -H "Content-Type: application/json" -H "X-TENANT-ID: {TENANT ID}" -H "Authorization: Bearer {tokenCustomer}" -X POST -d '{"productId": "Product ID"}' {host_url}/orders
```

## Stay in touch

- Author - Ahmad Fariz
