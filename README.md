# 🖥️🖥️ Backend Task | Admin Panel API

## Made With

- **Node.js**
- **Express.js**
- **TypeScript**
- **PostgreSQL**
- **Sequelize ORM**
- **JWT (jsonwebtoken)**
- **Joi**

  
## Objective

Create a backend API using **Node.js**, **Express**, and **PostgreSQL** to support an **Admin Panel** with the following features:

- **Admin** can create projects and assign managers to them.
- **Managers** can assign employees to the projects they manage.
- **Employees** can view the projects assigned to them.
- Only the **Admin** can create new users by adding their email address and providing them with a password, which the employee or manager can use to log in.

### Through this task, the following aspects will be measured:

- Problem-solving approach and thought process.
- Proficiency in Node.js, Express, and JavaScript concepts.
- Understanding of REST API principles and HTTP methods.
- Ability to design database schemas/models.
- Use of middleware for authentication, access control, and validations.
- Implementation of authentication using JWT tokens.
- Ability to comprehend and execute the requirements of a given task.

## Task Requirements

- **User Authentication:** Create API for user login, allowing all users to log in with their credentials.
- **Admin Registration:** Create an API for Admin registration/signup (only accessible by Admin).
- **Admin User Creation:** Admin can create new users by providing basic details like username, password, email, and role.
- **JWT Authentication:** Use JWT tokens for authentication. Optionally, Passport.js can be used.
- **Authentication Middleware:** Create middleware to verify the user's role and restrict access to specific routes based on their access level.
- **Multi-level Authorization:** Ensure that only Admins can perform certain tasks like user creation and role assignments, while Managers and Employees have restricted access.
- **User Management APIs:** Implement APIs to fetch, update, and soft-delete user data.
- **Role Management APIs:** Implement APIs to assign or reassign roles to users.
- **Project Management APIs:** Implement CRUD APIs for project management.
- **Audit Logs:** Record actions like creating, updating, or deleting resources, along with metadata (who performed the action, what action was taken, and on which entity).
- **Soft Delete Retrieval:** In addition to soft delete, add a route to retrieve soft-deleted resources (e.g., `/users/restore`).
- **Permanent Deletion:** Provide an option to permanently delete soft-deleted resources. (OPTIONAL)
- **Validation Middleware:** Add input validation using **Joi** or **celebrate** for all routes to ensure data integrity. (OPTIONAL)
- **Use an `.env` file:** Store sensitive information like database credentials and authentication secrets in an `.env` file to avoid exposing them in version control (Git).
- **Host the application and database:** Host the application and database on services like **Render**, **Heroku**, or **Railway**.
- **Follow the given checklist:** Make sure to go through the provided checklist for additional requirements and mark items as completed accordingly.

## User Role Based Access

Below is a breakdown of the permissions and restrictions for each user role. Each user can only have one assigned role.

### Admin

- **Full Access:** Entire admin panel and all routes.
- **User Management:** Create, update, and delete users; assign and reassign roles.
- **Project Management:** Create, update, and delete project data; assign managers to projects.
- **Soft Delete:** Deleted projects are restorable through soft delete implementation.
- **View All Projects:** Including soft-deleted ones.
- **Audit Logs:** Only Admin has access.
- **Single Admin:** Any user created through the signup/register route is automatically assigned the Admin role. There can only be one Admin in this application.

### Manager

- **Project Viewing:** Can view all projects in the admin panel.
- **Employee Assignment:** Assign employees to projects assigned to them by the Admin.
- **Restrictions:** 
  - Cannot update or delete any projects.
  - Only permitted to assign or unassign employees to/from a project.
  - Cannot view deleted projects, even if previously assigned to them.
  - Can view information about any employee but cannot update any user information, including their own.
  - Cannot view the Admin's user information.
- **Multiple Projects:** A Manager can have multiple projects assigned to them.

### Employee

- **Project Access:** Can only see the projects assigned to them. Projects not assigned should not be visible.
- **Restrictions:**
  - Cannot view deleted projects, even if previously assigned to them.
  - Can view their own profile information but cannot update it.
  - Cannot view the profile information of any other employee.
- **Multiple Projects:** An Employee can have multiple projects assigned to them.

## Routes and Resources


### Authentication Routes

- **Signup (POST /auth/signup):** Allows you to create an Admin user. There can only be one admin.
- **Register User (POST /auth/register):** Allows the Admin to register new users. *(Only Admin can access this route.)*
- **Login (POST /auth/login):** Allows users to log in with their credentials (username and password) and receive a JWT token for authentication.

### User Management Routes

- **Create User (POST /users):** Allows the Admin to create a new user.
- **Get Users (GET /users):** Accessible by Admin and Manager. Retrieves a list of all users.
- **Get User by ID (GET /users/:id):** Accessible by all users. Retrieves the details of a specific user.
- **Update User (PUT /users/:id):** Accessible by Admin. Updates the information of a specific user.
- **Delete User (DELETE /users/:id):** Accessible by Admin. Soft deletes a user.
- **Restore User (PATCH /users/restore/:id):** Accessible by Admin. Restores a soft-deleted user.

### Role Management Routes

- **Assign Role to User (POST /users/:id/assign-role):** Allows the Admin to assign a role to a user.
- **Revoke Role from User (POST /users/:id/revoke-role):** Allows the Admin to revoke a user's role.

### Project Management Routes

- **Create Project (POST /project):** Accessible by Admin. Creates a new project that users can be assigned to.
- **Get Projects (GET /project):** Accessible by all users. Retrieves a list of projects available to the user based on their role.
- **Get Project by ID (GET /project/:id):** Accessible by all users. Retrieves the details of a specific project.
- **Update Project (PUT /project/:id):** Accessible by Admin. Updates the details of a project.
- **Delete Project (DELETE /project/:id):** Accessible by Admin. Soft deletes a project.
- **Restore Project (PATCH /project/restore/:id):** Accessible by Admin. Restores a soft-deleted project.

### Audit Logs Routes

- **Get Audit Logs (GET /audit-logs):** Accessible by Admin. Retrieves a list of audit logs that track important actions within the system.
