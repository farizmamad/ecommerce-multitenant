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

## Installation

```bash
$ npm install
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

## Multi-tenancy Security

Every request guarded by TenantGuard will get the Tenant information in the Middleware.

Admin users can only manage its Tenant records.
Customer users can read allowed records from every Tenants.

If Admin tries to access records from different tenants, the user will receive 'Tenant is not found' exception.

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
curl -H "Content-Type: application/json" -X POST -d '{"name": "Customer 1","username": "customer1","password": "Customer1#","role": "Customer"}' {host_url}/users
```

New Admin User
```bash
curl -H "Content-Type: application/json" -X POST -d '{"name": "Admin 1","username":"admin1","password":"AdminAdmin1#","role":"Admin","tenantId":"0a98de95-9486-4458-97d3-dfcb197b0aa1"}' {host_url}/users
```

## Login
High level algorithm to login:
1. Login using username and password.
2. The server compares the input password vs hashed password
4. Return the access token, which contains user ID, username, role, and the corresponding tenant ID.

```bash
curl -H "Content-Type: application/json" -X POST -d '{"name": "Customer 1","username": "customer1","password": "Customer1#","role": "Customer"}' {host_url}/users
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

## Stay in touch

- Author - Ahmad Fariz
