# Employee & Family Registry System

A production-quality full-stack application for managing employee profiles and family relationships. Built with .NET Core, React, and PostgreSQL.

## Features
- **Employee Management**: CRUD operations with validation for NID and Phone numbers.
- **Family Relationships**: Manage one-to-one spouse and one-to-many children relationships.
- **Search**: Case-insensitive partial matching search by Name, NID, or Department.
- **Role-Based Auth**: Admin (full access) and Viewer (read-only) roles via JWT.
- **PDF Reports**: Export current employee list or individual CV profiles.

## Tech Stack
- **Backend**: ASP.NET Core 6 Web API, EF Core, PostgreSQL
- **Frontend**: React (Vite), Ant Design, Axios, React Router
- **PDF Generation**: QuestPDF
- **Validation**: FluentValidation
- **Auth**: JWT with BCrypt password hashing

## Project Structure
```
/employee-family-registry
  /backend     - .NET API project
  /frontend    - React Vite project
  /database    - Database scripts
  /docs        - SRS and documentation
```

## Setup Instructions

### Prerequisites
- .NET 6 SDK
- Node.js & npm
- PostgreSQL

### Backend Setup
1. Navigate to `/backend`.
2. Update the connection string in `appsettings.json` if necessary.
3. Run migrations and update database:
   ```bash
   dotnet ef database update
   ```
4. Start the backend:
   ```bash
   dotnet run
   ```

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React server:
   ```bash
   npm run dev
   ```

### Default Credentials
- **Admin**: `admin` / `admin123`
- **Viewer**: `viewer` / `viewer123`
