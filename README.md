# Learning Management System (LMS) Backend

## Overview

This project is a backend system for a Learning Management System (LMS) built using Node.js, Express, and MongoDB. It provides RESTful API endpoints for managing courses, students, instructors, and enrollments.

## Features

- User authentication and authorization
- CRUD operations for courses, students, and instructors
- Enrollment management
- Middleware for logging and error handling
- Token-based authentication with JWT
- Role-based access control

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcrypt

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (v14.x or higher)
- MongoDB installed and running
- npm (Node Package Manager)



## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

   The server will start on the port specified in your `.env` file (default is 3000).

2. To run in development mode with nodemon:
   ```bash
   npm run dev
   ```

## Some API Endpoints

### Authentication

- **POST /api/v1/user/register**
  - Register a new user (student or admin)
  
- **POST /api/v1/user/login**
  - Authenticate a user and receive a JWT

- **GET /api/v1/user/me**
  - Get profile information of current user (login check required)

### Courses

- **GET /api/v1/course**
  - Get a list of all courses

- **POST /api/v1/course**
  - Create a new course (admin access required)

- **GET /api/v1/course/:id**
  - Get details of a specific course

- **PUT /api/v1/course/:id**
  - Update a course (admin access required)

- **DELETE /api/courses/:id**
  - Delete a course (admin access required)
### Payments
- **GET /api/v1/payment/razorpay-key**

    - Get Razorpay API key (requires login)

- **POST /api/v1/payment/subscribe**

    - Buy a subscription (requires login)

- **POST /api/v1/payment/verify**

   - Verify a subscription (requires login)

- **POST /api/v1/payment/unsubscribe**

   - Cancel a subscription (requires login)

- **GET /api/v1/payment**

    - Get all payments (requires login and admin role)
## Project Structure

```
server/

├── config/
│   ├── connectDatabase.js

├── controllers/
│   ├── userController.js
│   ├── courseController.js
│   ├── paymentController.js

├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── multerMiddleware.js
│   ├── asyncHandlerMiddleware.js

├── models/
│   ├── courseModel.js
│   ├── paymentModel.js
│   ├── userModel.js
├── routes/
│   ├── userRoute.js
│   ├── courseRoute.js
│   ├── paymentRoute.js

├── utils/
│   ├── appError.js
│   └── sendEmail.js
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## Contributing

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any issues, please contact [your email] or create an issue in this repository.

---

Thank you for using our Learning Management System backend project!
