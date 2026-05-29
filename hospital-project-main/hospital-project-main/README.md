# Cloud-Based Hospital Management System

A full-stack hospital management system built with React, Node.js/Express, and MongoDB Atlas.

## Folder Structure

- backend
  - src/config
  - src/controllers
  - src/middleware
  - src/models
  - src/routes
  - src/utils
- frontend
  - src/api
  - src/components
  - src/context
  - src/pages

## Core Features

- JWT authentication with Admin, Doctor, and Patient roles
- Patient, doctor, appointment, prescription, inventory, billing, and analytics APIs
- Clean React dashboard with protected routes
- Cloud-ready MongoDB Atlas integration
- RBAC, rate limiting, validation, and security headers

## Backend APIs

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Patients
- GET /api/patients
- POST /api/patients
- GET /api/patients/:id
- PUT /api/patients/:id
- DELETE /api/patients/:id

### Doctors
- GET /api/doctors
- POST /api/doctors
- GET /api/doctors/:id
- PUT /api/doctors/:id
- POST /api/doctors/:id/shift
- DELETE /api/doctors/:id

### Appointments
- GET /api/appointments
- POST /api/appointments
- PUT /api/appointments/:id
- POST /api/appointments/:id/cancel

### Prescriptions
- GET /api/prescriptions
- POST /api/prescriptions

### Inventory
- GET /api/inventory
- POST /api/inventory
- PUT /api/inventory/:id
- DELETE /api/inventory/:id

### Billing
- GET /api/billing/invoices
- POST /api/billing/invoices
- POST /api/billing/payments

### Analytics
- GET /api/analytics/dashboard

## Database Schema Summary

- User: authentication and roles
- Patient: medical history, reports, diagnosis
- Doctor: profiles, schedules, shifts
- Appointment: booking workflow and status
- Prescription: medicines and dosage instructions
- InventoryItem: pharmacy stock tracking
- Invoice: billing records
- Payment: payment tracking
- Notification: automated notifications

## Local Setup

### 1) Backend
1. Copy backend/.env.example to backend/.env
2. Set MONGODB_URI and JWT_SECRET
3. Install dependencies in backend
4. Run the API server in development mode

### 2) Frontend
1. Optionally create frontend/.env with VITE_API_URL=http://localhost:5000/api
2. Install dependencies in frontend
3. Run the React app

## Cloud Deployment Steps

### Backend on AWS / Azure / GCP
1. Push the backend to a Git repository.
2. Provision a managed Node.js runtime:
   - AWS Elastic Beanstalk, ECS, or App Runner
   - Azure App Service or Container Apps
   - GCP Cloud Run or App Engine
3. Configure environment variables:
   - MONGODB_URI
   - JWT_SECRET
   - CLIENT_URL
   - NODE_ENV=production
4. Enable HTTPS and restrict CORS to the frontend domain.
5. Use a cloud secret manager for JWT and database credentials.
6. Add health checks to /api/health.

### MongoDB Atlas
1. Create an Atlas cluster.
2. Create a database user with least privilege.
3. Whitelist the backend hosting IP or use 0.0.0.0/0 with strict secrets handling during development only.
4. Copy the connection string into MONGODB_URI.

### Frontend Hosting
1. Build the React app.
2. Deploy to Vercel, Netlify, Azure Static Web Apps, or Cloud Storage CDN.
3. Set VITE_API_URL to the deployed backend URL.

## Security Notes

- JWT-based authentication
- RBAC enforced by middleware
- Helmet and rate limiting enabled
- Input validation on API routes
- Password hashing with bcrypt
- Production deployment should use HTTPS and secure cookies or authorization headers

## Suggested Demo Admin

Create an Admin user through the backend register route while authenticated as an Admin, or seed one manually in MongoDB for the first login.
