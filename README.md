# Hospital Management System

A robust and secure Spring Boot backend application built using Spring Data JPA, PostgreSQL, and Spring Security to manage hospital resources, patients, doctors, appointments, and insurance details.

---

## 🚀 Technologies Used
- **Java 21**
- **Spring Boot 3.5.3** (Web, Data JPA, Security)
- **PostgreSQL**
- **Lombok**
- **ModelMapper** (for DTO mappings)
- **Maven** (Dependency Management)

---

## 🔑 Key Features
- **Patient Management**: Complete CRUD operations for patient profiles.
- **Appointment Scheduling**: Create and schedule appointments mapping patients to specific doctors.
- **Insurance Management**: Bidirectional mapping for patient insurance policies.
- **Hospital Analytics Dashboard**: Real-time statistics including patient count, appointments, doctors, and blood group distributions.
- **API Security**: Endpoints secured using Spring Security, with role-based access control (e.g., `/admin/**` restricted to admins, `/public/**` permit all, and role-based login).
- **Automated Data Seeding**: Automatic database initialization via `data.sql`.

---

## 📂 Project Structure
All source code files are organized under the clean package structure:
`com.learning.project.hospitalManagement`

- `config/`: Configuration classes for Security (`WebSecurityConfig`) and Beans (`AppConfig`).
- `controller/`: REST controllers defining public, user-specific, and administrative endpoints.
- `dto/`: Data Transfer Objects for decoupled API inputs and outputs.
- `entity/`: JPA entities defining database schemas (`Patient`, `Doctor`, `Appointment`, `Insurance`, `Department`).
- `repository/`: Spring Data JPA repository interfaces for database access.
- `service/`: Service layer hosting core business logic.

---

## 🛠️ Configuration & Setup

### 1. Database Configuration
Update the database connection details in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/HospMgmt
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### 2. Build & Test the Project
Build the application and run automated tests using Maven:
```bash
./mvnw clean test
```

### 3. Run the Application
Start the Spring Boot application:
```bash
./mvnw spring-boot:run
```
Once started, the backend services will be available at:
`http://localhost:8080/api/v1`
