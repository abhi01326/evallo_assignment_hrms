# HRMS Project

## Overview

The Human Resource Management System (HRMS) is a full-stack application designed to manage employee and team information efficiently. This project utilizes Node.js for the backend, React.js for the frontend, and a SQL database for data storage.

## Project Structure

The project is organized into three main directories: `backend`, `frontend`, and `sql`.

### Backend

- **`backend/package.json`**: Configuration for the backend Node.js application, including dependencies and scripts.
- **`backend/.env.example`**: Template for environment variables needed for the backend application.
- **`backend/src/index.js`**: Entry point of the backend application, initializing the Express server and connecting to the database.
- **`backend/src/db/`**: Contains database connection logic and SQL schema.
- **`backend/src/controllers/`**: Contains controller functions for authentication, employees, and teams.
- **`backend/src/models/`**: Defines models for users, employees, and teams.
- **`backend/src/routes/`**: Defines API routes for authentication and resource management.
- **`backend/src/middleware/`**: Contains middleware for user authentication.
- **`backend/src/utils/`**: Utility functions for JWT handling.

### Frontend

- **`frontend/package.json`**: Configuration for the frontend React.js application, including dependencies and scripts.
- **`frontend/.env.example`**: Template for environment variables needed for the frontend application.
- **`frontend/public/index.html`**: Main HTML file for the React application.
- **`frontend/src/`**: Contains the main application logic, components, pages, and styles.

### SQL

- **`sql/migrations/`**: Contains SQL migration scripts for creating necessary tables.
- **`sql/seeds/`**: Contains SQL seed data for populating the database with initial data.

## Setup Instructions

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and configure your environment variables.
4. Run the server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and configure your environment variables.
4. Run the application:
   ```
   npm start
   ```

## Usage

- Access the backend API at `http://localhost:3002/` (or the value of `PORT` in `backend/.env`).
- Access the frontend application at `http://localhost:3001/`.

When you run `backend/npm run init-db` the script will seed a demo user and sample teams/employees. Use `admin@example.com` / `devpassword` to log in.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
