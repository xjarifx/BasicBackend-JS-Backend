# Inventory Management API

A RESTful API for managing inventory items with user authentication and role-based access control.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)

## Features
- User authentication with JWT
- Role-based access control (Admin/User)
- CRUD operations for inventory items
- MongoDB integration
- Express.js REST API

## Prerequisites
- Node.js
- MongoDB
- npm

## Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the server:
```bash
node --watch server.js
```

## Configuration
The application uses the following environment variables:
- `MONGO_URI`: MongoDB connection string
- `SECRET_KEY`: JWT secret key
- `PORT`: Server port (default: 3000)

## API Endpoints

### Authentication

#### Register User
```
POST /auth/register
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"  // Optional, defaults to "user"
}
```
**Response:** 201 Created
```json
{
  "msg": "User registered successfully"
}
```

#### Login
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:** 200 OK
```json
{
  "token": "JWT_TOKEN"
}
```

### Items

#### Get All Items
```
GET /items
```
**Headers:**
- Authorization: Bearer JWT_TOKEN

**Response:** 200 OK
```json
[
  {
    "_id": "item_id",
    "name": "Item Name",
    "description": "Item Description",
    "quantity": 10
  }
]
```

#### Create Item (Admin Only)
```
POST /items
```
**Headers:**
- Authorization: Bearer JWT_TOKEN

**Request Body:**
```json
{
  "name": "New Item",
  "description": "Item Description",
  "quantity": 10
}
```
**Response:** 201 Created
```json
{
  "msg": "Item created successfully"
}
```

#### Update Item (Admin Only)
```
PUT /items/:id
```
**Headers:**
- Authorization: Bearer JWT_TOKEN

**Request Body:**
```json
{
  "name": "Updated Item",
  "description": "Updated Description",
  "quantity": 15
}
```
**Response:** 200 OK
```json
{
  "msg": "Item updated successfully",
  "updatedItem": {
    "_id": "item_id",
    "name": "Updated Item",
    "description": "Updated Description",
    "quantity": 15
  }
}
```

#### Delete Item (Admin Only)
```
DELETE /items/:id
```
**Headers:**
- Authorization: Bearer JWT_TOKEN

**Response:** 200 OK
```json
{
  "msg": "Item deleted successfully"
}
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:
1. Register a user account
2. Login to receive a JWT token
3. Include the token in the Authorization header of subsequent requests:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Resource created
- 400: Bad request / Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Resource not found
- 500: Server error

Error responses follow this format:
```json
{
  "msg": "Error message",
  "error": "Detailed error information"
}
```

## Security Considerations

1. Move sensitive configuration to environment variables:
   - MongoDB connection string
   - JWT secret key
   - Server port

2. In production:
   - Use strong JWT secret keys
   - Implement rate limiting
   - Enable CORS protection
   - Use HTTPS
   - Add input validation and sanitization


MONGO_URI=mongodb+srv://xjarifx:nca2aesv3fkEt8MA@cluster0.uh9xe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
