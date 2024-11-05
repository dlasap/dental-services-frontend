# Dom's Dental Frontend App

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)

---

## Description

This application serves as an appointment booking app for users who want the ease of booking an appointment
to our dental clinic.

## Features

- Login and Register, Authenticated users can see their booked appointments
- Authenticated users can reschedule and cancel their upcoming appointments ahead of time
- Smart scheduling logic, so no overlapping appointed schedules from different doctors
- Specialized Doctors to offer wide range of services
- EKS Deployment scripts

## Technologies

- **Frontend:** React, TailwindCSS, Shadcn UI, React Router, Vite, React-Query
- **Other services:** JWT, Docker, AWS EKS deployment, Axios

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dlasap/dental-services-frontend.git
   cd your-project
   ```
2. **Install Dependencies**
   ```
   npm install
   ```
3. **Set up environmental variables**
   Request environment variables to the repository owner.

   ```
   VITE_API_BASE_URL=YOUR_DEPLOYED_FRONTEND_URL
   VITE_DEV_API_BASE_URL=http://localhost:8080
   ```

4. **Run the Application**
   ````
   npm run dev - to run on local development  #should be on localhost:3000
   ````
