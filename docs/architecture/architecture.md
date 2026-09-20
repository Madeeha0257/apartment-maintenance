# Apartment Maintenance Management System
## Cloud Architecture

### 1. Project Overview

The Apartment Maintenance Management System is a cloud-based application
designed to digitize and streamline maintenance requests in residential
apartments.

Residents can report maintenance issues, administrators can manage and
assign requests, and maintenance workers can update the progress and
resolution of assigned requests.

### 2. Architecture

The application follows a serverless cloud architecture.

Frontend:
- React
- Vite

AWS Services:
- Amazon Cognito
- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon S3
- Amazon CloudWatch

### 3. AWS Service Responsibilities

#### Amazon Cognito
Used for user authentication and identity management.

The application will support three roles:
- Resident
- Administrator
- Maintenance Worker

#### Amazon API Gateway
Acts as the HTTP API entry point between the frontend and backend.

#### AWS Lambda
Handles backend application logic without requiring dedicated servers.

#### Amazon DynamoDB
Stores maintenance requests and application data.

#### Amazon S3
Stores maintenance issue images uploaded by residents.

#### Amazon CloudWatch
Used for application logging and debugging.

### 4. Data Flow

1. A user accesses the React application.
2. Cognito authenticates the user.
3. The frontend communicates with the backend through API Gateway.
4. Lambda processes the request.
5. DynamoDB stores and retrieves application data.
6. S3 stores maintenance-related images.
7. CloudWatch stores application logs.

### 5. Cloud Design

The project uses a serverless architecture to minimize infrastructure
management and resource usage.

The system avoids dedicated servers and unnecessary cloud services.
Only services required by the application's core functionality are used.

### 6. Project Scope

The application includes:

- User authentication
- Role-based access
- Maintenance request creation
- Maintenance image uploads
- Complaint tracking
- Complaint assignment
- Worker task management
- Maintenance history
- Admin dashboard
- Basic analytics
- Feedback

Notifications are outside the scope of this project.