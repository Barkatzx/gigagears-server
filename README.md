# Gigagears Server

Gigagears Server is the backend for the Gigagears platform, built with **Node.js** and **Express**. It provides a scalable and secure **RESTful API** for handling authentication, database operations, and core business logic. The server is powered by **MongoDB** for efficient data management and integrates seamlessly with front-end services.

## 🚀 Features

- Secure **JWT-based authentication**
- **User management** (registration, login, profile updates)
- **CRUD operations** for resources
- **MongoDB** database integration
- **Express.js** for handling API requests
- **Error handling and logging**
- **CORS support** for cross-origin requests

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose ORM)
- **JWT (JSON Web Tokens)** for authentication
- **dotenv** for environment variables
- **bcrypt** for password hashing
- **Multer** for file uploads (if applicable)

## 🔥 API Endpoints

### **Auth Routes**

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | User login          |
| GET    | `/api/auth/profile`  | Get user profile    |

## 📜 License

This project is licensed under the **MIT License**.
