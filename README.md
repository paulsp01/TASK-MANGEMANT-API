# TASK-MANGEMANT-API

deployment link:https://task-mangemant-api-1.onrender.com



Approach
Folder Structure and Organization:

The project was organized into a standard MVC (Model-View-Controller) architecture. The code was structured into src/ for the core application logic, including models, controllers, routes, and middleware.
The server.js file serves as the entry point for the application, setting up the Express server and routing.
Authentication & Authorization:

User authentication was implemented using JWT (JSON Web Tokens). The /api/login route handles user login, generating a token upon successful authentication.
Role-based access control (RBAC) was implemented to allow only users with specific roles (e.g., admin) to access certain features, such as task management and deletion.
Task Management:

CRUD (Create, Read, Update, Delete) operations for tasks were implemented via routes under /api/tasks.
Task models were created with validation rules to ensure that required fields such as title, status, and user were enforced.
Each task was associated with a user, ensuring that only the relevant user could interact with their own tasks, unless an admin was accessing or modifying the tasks.
Testing:

Integration tests were written using supertest and Jest to test the core features of the API, including user registration, login, and task creation, updating, and deletion.
Mock data was created for the tests to simulate real-world interactions, such as generating tokens and assigning tasks to users.
Error Handling and Validation:

Error handling middleware was incorporated to provide standardized error responses.
Validation was enforced at the Mongoose schema level, particularly ensuring that all required fields were provided during task creation.
Continuous Integration/Continuous Deployment (CI/CD):

A CI/CD pipeline was created using GitHub Actions, automating the build, test, and deployment process. It ensured that all code changes were automatically tested and deployed to the production environment, eliminating manual errors.
Dockerization was implemented to standardize the environment across development, testing, and production, ensuring that the application runs consistently.
Deployment:

The application was deployed using Render, and the environment was configured with proper startup scripts (e.g., npm start) to ensure the server starts correctly.
Environment variables, such as database connection strings, were securely managed via .env files and properly loaded during deployment.
Assumptions Made
Authentication:

It was assumed that JWT would be sufficient for securing API routes. The system was designed to handle token-based authentication and enforce role-based access control based on the user’s role (e.g., admin, user).
Database:

The application assumes the use of MongoDB for storing user and task data. MongoDB’s flexibility was leveraged for managing relationships between users and tasks.
User Roles:

The system assumes that users are either regular users or admins, with admins having elevated privileges to perform actions such as updating and deleting tasks.
Task Management:

Each task is assumed to have a mandatory assigned user (assignedUser) and a mandatory creator (user). These relationships are necessary for maintaining task ownership and assignment.
Error Handling:

It was assumed that all validation errors would be caught at the Mongoose schema level, ensuring that invalid data does not get saved to the database.
Environment:

The CI/CD pipeline assumes that the environment (e.g., Docker) is consistent across all stages (development, testing, production), and all environment variables, like database URIs, are correctly set.

