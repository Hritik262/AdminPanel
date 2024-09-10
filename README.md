# Admin Panel API

This project is a backend API built with Node.js, Express, and PostgreSQL, designed to support an Admin Panel with user management, role-based access control, and project management features. The API allows Admins to create and assign users, manage projects, and keep track of important actions via audit logs.

## Objective

The goal of this project is to implement a backend system where:

- **Admins** can manage users and projects.
- **Managers** can assign employees to projects.
- **Employees** can view their assigned projects.

The API implements authentication and authorization, ensuring that users have appropriate access based on their roles.

## Task Requirements

- **User Authentication**: User login, signup, and JWT token-based authentication.
- **User Role Management**: Admins can create users and assign them roles (Admin, Manager, or Employee).
- **Project Management**: Admins can create, update, and soft delete projects. Managers can assign employees to the projects assigned to them.
- **Audit Logs**: Records key actions such as creating, updating, or deleting resources.

## Features

- **JWT Authentication**: Secure authentication using JWT tokens for protected routes.
- **Role-Based Access Control**: Different access levels for Admin, Manager, and Employee roles.
- **Soft Delete**: Soft delete and restore functionalities for users and projects.
- **Audit Logs**: Track who performed actions like creating, updating, and deleting resources.
- **SQL (PostgreSQL) Integration**: Use PostgreSQL as the database, with Sequelize as the ORM.

## Routes and Resources

### Authentication Routes

| Route                  | Method | Description                            | Role Access |
|------------------------|--------|----------------------------------------|-------------|
| `/auth/signup`          | POST   | Create the Admin user (only one Admin) | Public      |
| `/auth/register`        | POST   | Register new users (Admin only)        | Admin       |
| `/auth/login`           | POST   | Log in to get a JWT token              | All         |

### User Management Routes

| Route                        | Method  | Description                            | Role Access       |
|------------------------------|---------|----------------------------------------|-------------------|
| `/users`                     | POST    | Create a new user                      | Admin             |
| `/users`                     | GET     | Get a list of all users                | Admin, Manager    |
| `/users/:id`                 | GET     | Get details of a specific user         | All               |
| `/users/:id`                 | PUT     | Update user information                | Admin             |
| `/users/:id`                 | DELETE  | Soft delete a user                     | Admin             |
| `/users/restore/:id`         | PATCH   | Restore a soft-deleted user            | Admin             |

### Role Management Routes

| Route                             | Method | Description               | Role Access |
|-----------------------------------|--------|---------------------------|-------------|
| `/users/:id/assign-role`          | POST   | Assign a role to a user    | Admin       |
| `/users/:id/revoke-role`          | POST   | Revoke a user's role       | Admin       |

### Project Management Routes

| Route                             | Method  | Description                            | Role Access   |
|-----------------------------------|---------|----------------------------------------|---------------|
| `/project`                        | POST    | Create a new project                   | Admin         |
| `/project`                        | GET     | Get a list of all projects             | Admin, Manager, Employee |
| `/project/:id`                    | GET     | Get details of a specific project      | Admin, Manager, Employee |
| `/project/:id`                    | PUT     | Update project details                 | Admin         |
| `/project/:id`                    | DELETE  | Soft delete a project                  | Admin         |
| `/project/restore/:id`            | PATCH   | Restore a soft-deleted project         | Admin         |

### Audit Log Routes

| Route                      | Method | Description                            | Role Access |
|----------------------------|--------|----------------------------------------|-------------|
| `/audit-logs`               | GET    | Get audit logs                         | Admin       |

