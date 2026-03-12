# Software Requirements Specification (SRS)
## Full-Stack Employee & Family Registry System

---

### 1. Introduction
The Employee & Family Registry System is a robust full-stack application designed to serve as a central repository for employee profiles and their primary family relationships. The system aims to provide organizational efficiency by centralizing employee-related data, facilitating administrative control, and offering restricted viewing access for general users. This document outlines the technical specifications, architectural decisions, and functional requirements of the system.

### 2. System Overview
The system is built using modern web technologies to ensure scalability, maintainability, and security.
- **Backend**: ASP.NET Core 6.0 Web API (configured for forward compatibility with .NET 10).
- **Frontend**: React (Vite-based) with Ant Design for a premium UI/UX.
- **Database**: PostgreSQL (migrated from SQLite) for enterprise-grade relational data management.
- **Reporting**: QuestPDF for high-performance PDF generation.
- **Security**: Role-Based Access Control (RBAC) via JWT (JSON Web Tokens).

### 3. Architecture Design
The system adheres to **Clean Architecture** and **SOLID** principles to minimize coupling and maximize testability.

#### 3.1. Layered Decomposition
1.  **API Layer (Controllers)**:
    - Handles HTTP requests and responses.
    - Implements route protection via `[Authorize]` attributes.
    - Manages API versioning and documentation (Swagger/OpenAPI).
2.  **Service Layer (Business Logic)**:
    - Orchestrates data flow between controllers and repositories.
    - Performs complex business calculations (e.g., salary aggregation, age calculation).
    - Maps domain models to DTOs (Data Transfer Objects) to maintain abstraction.
3.  **Repository Layer (Data Access)**:
    - Encapsulates Object-Relational Mapping (ORM) using Entity Framework Core.
    - Provides a generic or specialized interface for database operations.
    - Abstracted away from specific database providers (PostgreSQL).
4.  **Domain/Model Layer**:
    - Defines the core entities (Employee, Spouse, Child, User).
    - Contains base validation attributes and relationship configurations.

#### 3.2. Frontend Component Architecture
- **State Management**: React Hooks (useState, useEffect) and Context API for global authentication state.
- **Networking**: Axios instance with request/response interceptors for persistent JWT handling.
- **Routing**: React Router with Protected Route wrappers to enforce RBAC.

### 4. Database Design
The schema is designed to optimize relational integrity and supporting complex family trees.

#### 4.1. Entity Relationships
- **Employee**: Primary entity.
    - `Id` (PK), `Name`, `NID` (Unique Index), `PhoneNumber`, `Department`, `BasicSalary`.
- **Spouse**: One-to-One relationship with Employee.
    - `Id` (PK), `Name`, `NID`, `EmployeeId` (FK, Cascade Delete).
- **Child**: One-to-Many relationship with Employee.
    - `Id` (PK), `Name`, `DateOfBirth`, `EmployeeId` (FK, Cascade Delete).
- **User**: Authentication entity.
    - `Id` (PK), `Username`, `PasswordHash` (BCrypt), `Role` (Admin/Viewer).

#### 4.2. Seeding Strategy
The database is initialized with 10 production-quality records featuring realistic Bangladeshi names (e.g., Tanvir, Rahat, Nusrat) to facilitate immediate demonstration and testing.

### 5. API Endpoints
Detailed catalog of RESTful services:
- `POST /api/auth/login`: Identity verification; returns Bearer Token.
- `GET /api/employees`: Search/List with support for partial matching on Name, NID, or Dept.
- `GET /api/employees/{id}`: Full profile retrieval including family nested objects.
- `POST /api/employees`: Administrative creation with multi-entity atomicity.
- `PUT /api/employees/{id}`: Profile updates; restricted to Admin.
- `DELETE /api/employees/{id}`: Permanent removal; triggers cascading deletion of family data.
- `GET /api/reports/employee-list`: Streamed PDF roster of filtered results.
- `GET /api/reports/employee-cv/{id}`: Individual career professional summary (PDF).

### 6. Validation & Integrity Rules
Data integrity is enforced at both the API and database levels.

#### 6.1. National ID (NID)
- **Format**: Must be exactly 10 or 17 digits.
- **Constraint**: Must be unique system-wide.
- **Edge Case**: Duplicate NID entries from different employees are rejected with a 400 Bad Request.

#### 6.2. Phone Numbers
- **Format**: Bangladesh numbering plan compliance (`01XXXXXXXXX` or `+8801XXXXXXXXX`).
- **Logic**: Regular Expression mapping ensures only valid mobile digits are stored.

#### 6.3. Salaries
- **Currency**: Bangladeshi Taka (৳/BDT).
- **Constraint**: Must be a positive decimal value.

### 7. Security Model
- **Authentication**: JWT tokens issued upon successful BCrypt password verification.
- **Authorization**:
    - **Viewer**: Read-only access to lists and details. Exporting is allowed, but all modification endpoints return 403 Forbidden.
    - **Admin**: Full authority including creation, modification, and deletion.

### 8. Edge Case Analysis
- **Missing Spouse**: Spouse data is optional; the system handles null navigation properties gracefully in both UI and PDF.
- **Multiple Children**: The list view and individual CV scale dynamically to accommodate many children.
- **Empty Search**: Returns the full roster if no search criteria are provided.
- **Partial Search**: Matches "tan" to "Tanvir", "Sultana", etc., regardless of case.
- **Cascading Deletes**: When an employee is removed, the database automatically cleans up the corresponding Spouse and Children records to prevent orphaned data.

### 9. Reporting (QuestPDF)
The reporting engine generates high-quality BDT-currency-aware PDFs.
- **Roster Report**: Table-based overview optimized for printing.
- **Individual CV**: Professional layout including header, personal details, spouse block, and children bullet points with age calculations based on Date of Birth.

---
*End of Specification*
