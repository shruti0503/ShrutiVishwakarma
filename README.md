# Daily Expenses Sharing Application

This is a backend service for managing daily expenses and splitting them between multiple users. 
It supports different methods of splitting expenses, such as **equal split**, **exact amounts**, and **percentage split**. 
The application also includes user authentication, expense management, and the ability to download a balance sheet for all users.

## Features
- **User Authentication**: JWT-based authentication is implemented to secure the application.
- **Expense Management**: Users can add, retrieve, and manage expenses.
  - Split expenses equally, by exact amounts, or by percentage.
- **Balance Sheet**: Generate and download a balance sheet that summarizes how much each user owes or is owed.
- **Middleware**: Authentication middleware protects routes and ensures that only logged-in users can access the expense routes.

## Technologies Used
- **Node.js**
- **Express**
- **Mongoose** (MongoDB ORM)
- **JWT (JSON Web Token)** for authentication
- **dotenv** for environment variables
- **bcrypt** for password hashing
- **json2csv** for generating balance sheets in CSV format

## Prerequisites
Before starting, ensure that you have the following installed:
- **Node.js**: Download and install Node.js from [here](https://nodejs.org/).
- **MongoDB**: You need access to a running MongoDB instance (local or cloud-based).

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies
Install the required npm packages by running the following command:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory of the project and set the following environment variables:

```
JWT_SECRET=your_jwt_secret_key
DB_URL=your_mongodb_connection_string
```

- `JWT_SECRET`: This is the secret key used for signing JWT tokens.
- `DB_URL`: MongoDB connection string. It can be a local MongoDB instance or a MongoDB Atlas connection.

Example `.env` file:
```
JWT_SECRET=mySuperSecretKey
DB_URL=""
```

### 4. Start the Application
After configuring your environment, start the application by running:
```bash
npm start
```

If everything is configured correctly, the server will be running at `http://localhost:8000`.

### 5. API Endpoints

#### Auth Routes
- **POST /auth/register**: Register a new user
- **POST /auth/login**: Login an existing user and get a JWT token

#### Expense Routes (Protected - Requires Authentication)
- **POST /expense/add-expense**: Add a new expense
  ![Screenshot 2024-10-18 at 3 01 29 PM](https://github.com/user-attachments/assets/6a0cd955-0903-4013-99ea-8c13c50e12c5)
  
- **GET /expense/user/:userId**: Retrieve expenses for an individual user
  ![Screenshot 2024-10-18 at 3 04 39 PM](https://github.com/user-attachments/assets/619e7c78-2389-4b67-8552-303277f8356a)
  
- **GET /expense/overall-expenses**: Retrieve overall expenses for all users
  ![Screenshot 2024-10-18 at 3 04 39 PM](https://github.com/user-attachments/assets/876f7b0b-bc13-4f3e-a349-f983d6e6d679)

- **GET /expense/balance-sheet**: Download the balance sheet for all users
  ![Screenshot 2024-10-18 at 3 47 27 PM](https://github.com/user-attachments/assets/14314dd7-1cb6-4df7-b181-ad102cc129b2)


### Example Requests

#### Register a User
```bash
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "password123"
}
```

#### Login a User
```bash
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Add an Expense
```bash
POST /expense/add-expense
Headers: Authorization: Bearer <token>
{
  "description": "Dinner with friends",
  "amount": 3000,
  "splitType": "equal",  // Can be 'equal', 'exact', or 'percentage'
  "participants": [
    { "user": "user_id_1", "owedAmount": 1000 },
    { "user": "user_id_2", "owedAmount": 1000 },
    { "user": "user_id_3", "owedAmount": 1000 }
  ],
  "payer": "payer_user_id"
}
```

#### Get User Expenses
```bash
GET /expense/user/:userId
Headers: Authorization: Bearer <token>
```

#### Download Balance Sheet
```bash
GET /expense/balance-sheet
Headers: Authorization: Bearer <token>
```

### Folder Structure

```
/models
  User.js               // Mongoose model for users
  Expense.js            // Mongoose model for expenses
/routes
  authRoutes.js         // Routes for user authentication
  expenseRoutes.js      // Routes for handling expenses
/controllers
  authController.js     // Controller functions for authentication
  expenseController.js  // Controller functions for expenses
/middleware
  authMiddleware.js     // Middleware for JWT authentication
/utils
  sheet.js              // Utility for generating the balance sheet
server.js               // Entry point of the application
.env                    // Environment variables file
```

### License
This project is open-source and available under the MIT License.

---

This README provides a comprehensive guide for setting up, running, and using your daily expenses sharing application with JWT authentication.
