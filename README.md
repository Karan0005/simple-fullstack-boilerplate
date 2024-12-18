# NX Monorepo Boilerplate with Next.js & Nest.js

This repository serves as a powerful **monorepo boilerplate** for building fullstack applications
with **Next.js**, **Nest.js**, and **MongoDB**. Built using **Nx Dev Tools**, it offers a scalable
architecture with essential user authentication features and robust testing.

## Features

-   **Monorepo Architecture**: Seamlessly manage frontend and backend code using **Nx Dev Tools**.
-   **User Authentication**: Pre-built sign-up and login flow with JWT-based authentication.
-   **MongoDB Integration**: Fully configured connection to MongoDB for backend data persistence.
-   **Environment Configurations**: Easy parameterization for development and production
    environments.
-   **Testing with Jest**: Includes basic test cases for both frontend and backend to ensure
    functionality.
-   **Optimized Builds**: Dedicated scripts to build the frontend and backend for different
    environments.
-   **Scalable Code Structure**: Well-organized project directories to simplify development and
    future enhancements.

This boilerplate is the perfect starting point for building modern and scalable fullstack
applications.

## Future Improvements

-   **Enhanced Security**:

    -   Switch from **HS256** to **RS256** for JWT signing to ensure better security through
        asymmetric encryption.
    -   Implement **short-lived tokens** with a **refresh token strategy** to ensure enhanced
        security while maintaining a seamless user experience.

-   **Rate Limiting & Load Balancing**:
    -   Implement **rate limiting** at the **API gateway level** to protect APIs from abuse.
    -   Use **load balancing** at the **API gateway level** to ensure high availability and improved
        performance across distributed systems.

## Prerequisites

Ensure that you have the following installed:

-   [Node.js (>= 20.17.0)](https://nodejs.org/en/download/package-manager)
-   [Visual Studio Code (Recommended)](https://code.visualstudio.com/Download)

## Tech Stack

| **Technology** | **Purpose**                      |
| -------------- | -------------------------------- |
| Next.js        | Frontend framework (React-based) |
| Nest.js        | Backend framework (Node.js)      |
| MongoDB        | NoSQL Database                   |
| Nx Dev Tools   | Monorepo management and tooling  |
| Jest           | Unit and integration testing     |

## Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/Karan0005/simple-fullstack-app.git
cd simple-fullstack-app

# Install dependencies
npm install
```

## Repository Structure

```sh
└── simple-fullstack-app/
    ├── .github
    │   └── workflows
    ├── LICENSE
    ├── README.md
    ├── apps
    │   ├── backend
    │   ├── frontend
    ├── jest.config.ts
    ├── jest.preset.js
    ├── nx.json
    ├── package-lock.json
    ├── package.json
    └── tsconfig.base.json
```

## Commands

Here are the key commands to run and build the applications:

### Development

Start the **frontend** and **backend** applications in development mode:

```bash
# Start frontend
npm run start:frontend

# Start backend
npm run start:backend
```

### Build

Build the **frontend** and **backend** for development or production:

```bash
# Build frontend for development
npm run build:frontend:dev

# Build frontend for production
npm run build:frontend:prod

# Build backend
npm run build:backend
```

### Testing

This project includes **basic unit and integration tests** using Jest:

-   **Frontend**: Tests React components, pages, and utilities.
-   **Backend**: Tests Nest.js controllers, services, and endpoints.

Add more tests by creating files with `.spec.ts` or `.test.ts` extensions under `apps/frontend` or
`apps/backend` directories.

Run all tests effortlessly with the provided test scripts.

Run test cases for **frontend** and **backend** using Jest:

```bash
# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
```

## User Sign-Up and Login Flow

This boilerplate includes a foundational implementation for user authentication:

1. **User Sign-Up**: Users can create a new account with their name, email and password.
2. **User Login**: Authenticate with credentials to receive a JWT token.
3. **Protected Routes**: Access secured backend endpoints with a valid token.

The backend interacts with MongoDB to store and retrieve user information securely.

## Sample Environment Variables

Below is a sample `.env` file. This file should not contain sensitive or production-specific values.
For real environment variables, ensure they are managed securely.

```env
# ====================== DISCLAIMER =======================
# This file is a sample configuration for environment variables.
# It should be committed to version control to provide a reference
# for required variables and their names. However, it should not
# contain sensitive or production-specific values.
#
# The actual `.env` file should contain real values and must be
# added to .gitignore to prevent it from being tracked in the
# repository. Ensure that sensitive information is securely managed
# and kept private.
# =========================================================

# Note: PORT_FRONTEND change required inside apps/frontend/src/config too
PORT_FRONTEND=4200

# Note: PORT_BACKEND change required inside apps/frontend/src/config too
PORT_BACKEND=8000

# Note: APP_ENV can be only LOCAL, DEV, UAT, or PROD
APP_ENV=LOCAL

# Note: ROUTE_PREFIX change required inside apps/frontend/src/config files and spec file too
ROUTE_PREFIX=api

SERVER_SECRET=Welcome@1

# Database Variables
MONGO_CONNECTION_URI=mongodb://localhost:27017/
MONGO_DB_NAME=local-fullstack-app
```

## Sample Backend Response Format

```json
{
    "IsSuccess": true,
    "Message": "Record created.",
    "Data": null,
    "Errors": []
}
```

## Default Ports

-   Frontend: http://localhost:4200
-   Backend: http://localhost:8000

## Recommended Branching Strategy

This document outlines a solid branching strategy for your Nx monorepo architecture, considering
from medium to large development team and CI/CD pipelines attached to the main (production), uat
(user acceptance testing), and develop (development) branches. Checkout link below for detailed
information about the branching strategy.

[Branching Strategy](docs/BRANCHING_STRATEGY.md)

## Author Information

-   **Author**: Karan Gupta
-   **LinkedIn**: [Karan Gupta](https://www.linkedin.com/in/karangupta0005)
-   **GitHub**: [Karan Gupta](https://github.com/Karan0005)
-   **Contact**: +91-8396919047
-   **Email**: [karangupta0005@gmail.com](mailto:karangupta0005@gmail.com)

## Contribution

Contributions are welcome! Here are several ways you can contribute:

1. **Fork the Repository**: Start by forking the project repository to your github account.

2. **Clone Locally**: Clone the forked repository to your local machine using a git client.

    ```sh
    git clone https://github.com/Karan0005/simple-fullstack-app.git
    ```

3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.

    ```sh
    git checkout -b new-feature-x
    ```

4. **Make Your Changes**: Develop and test your changes locally.

5. **Commit Your Changes**: Commit with a clear message describing your updates.

    ```sh
    git commit -m 'Implemented new feature x.'
    ```

6. **Push to github**: Push the changes to your forked repository.

    ```sh
    git push origin new-feature-x
    ```

7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe
   the changes and their motivations.

8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch.
   Congratulations on your contribution!

-   **[Report Issues](https://github.com/Karan0005/simple-fullstack-app/issues)**: Submit bugs found
    or log feature requests for the `simple-fullstack-app` project.

## License

This project is licensed under the MIT License.
