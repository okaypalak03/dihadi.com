# bihari.com

## Project Overview

bihari.com is a web application that connects users with local workers for various services. It's a Zomato/Swiggy-style platform where users can hire workers instead of ordering food.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

## Core Features

- **Worker Profiles:** Workers can create and manage their profiles, including their skills, availability, and charges.
- **Area-Based Search:** Users can find workers based on their location.
- **Hiring Flow:** A simple "Add to Hire" system for booking workers.
- **Job Management:** Track the status of jobs (Pending, Accepted, Completed).
- **Mock Payments:** A simulated payment flow for completed jobs.
- **User Roles:** Separate roles for Users, Workers, and Administrators.

## Project Structure

```
bihari.com/
├── backend/        # Node.js/Express.js backend
├── database/       # MongoDB scripts/schemas
├── frontend/       # React.js frontend
└── README.md       # This file
```

## Setup and Installation

### Prerequisites

- Node.js
- npm
- MongoDB

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add the following environment variables:
    ```
    PORT=5000
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```