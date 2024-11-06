# Dom's Dental Frontend App

For documentation: <a href='https://docs.google.com/document/d/1kuxg5S8xTBo_8tzfEUvX9ZkATqh2mjzJO5ewUWe_cDs/edit?usp=sharing'  target="_blank" rel="noopener noreferrer"> Documentation File </a>

Have fun browsing the code!

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

   #To deploy:
   1) Build dockerfile
   2) Push latest docker image to docker hub
   3) Update image on frontend-deployment.yaml to latest version of image
   4) Run 'npm run deploy-frontend' to trigger kubectl pulling latest image
   ````
