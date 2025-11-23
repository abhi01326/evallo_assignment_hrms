# HRMS Backend Documentation

## Overview
This is the backend for the Human Resource Management System (HRMS) built using Node.js and Express. It provides RESTful APIs for user authentication, employee management, and team management.

## Technologies Used
- Node.js
- Express.js
- SQLite
- bcrypt for password hashing
- jsonwebtoken for authentication

## Setup Instructions

### Prerequisites
- Node.js installed on your machine
- SQLite database

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd hrms-app/backend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and configure your environment variables.

### Database Setup
1. Run the SQL schema to create the necessary tables:
   ```
   sqlite3 hrms.db < src/db/schema.sql
   ```

2. (Optional) Seed the database with initial data:
   ```
   sqlite3 hrms.db < ../sql/seeds/seed-data.sql
   ```

### Running the Server
Start the server using the following command:
```
npm start
```
The server will run on `http://localhost:3000`.

## API Endpoints

### Authentication
- **POST /register**: Register a new user.
- **POST /login**: Log in an existing user.

### Employees
- **GET /employees**: Retrieve a list of employees.
- **POST /employees**: Add a new employee.
- **DELETE /employees/:id**: Delete an employee by ID.

### Teams
- **GET /teams**: Retrieve a list of teams.
- **POST /teams**: Add a new team.
- **DELETE /teams/:id**: Delete a team by ID.
- **POST /teams/:id/assign**: Assign an employee to a team.

## Usage Guidelines
- Ensure that you have the correct environment variables set in your `.env` file.
- Use Postman or any API client to test the endpoints.
- Make sure to handle JWT tokens properly for authenticated routes.

## License
This project is licensed under the MIT License.