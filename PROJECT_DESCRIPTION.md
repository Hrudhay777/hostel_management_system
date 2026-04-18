# HostelHub - Project Description & Technical Overview

## 1. Project Overview
**HostelHub** is a modern, comprehensive Hostel Management System designed specifically as a real-life implementation for **Centurion University of Technology and Management** (Vizianagaram, AP). The system provides an end-to-end solution for managing hostel operations, student accommodations, and administrative tasks with a strong focus on user experience and efficiency.

## 2. Technology Stack
*   **Frontend Framework**: Angular 21 (Standalone Components)
*   **Language**: TypeScript 5.9
*   **Styling**: CSS3 (Gradients, animations, responsive design, CSS Variables)
*   **State Management**: RxJS & BehaviorSubjects (Observable-based state)
*   **Backend**: Node.js (v24+), Express.js
*   **Database**: MySQL
*   **Package Manager**: npm 11+

## 3. Real Hostel Structure Built-in
The system maps to a real 4-floor Boys Hostel building with an exact configuration:
*   **Ground Floor**: Rooms 101-116 (16 rooms) + Administrative Office (Room G01)
*   **First Floor**: Rooms 201-218 (18 rooms)
*   **Second Floor**: Rooms 301-318 (18 rooms)
*   **Third Floor**: Rooms 401-418 (18 rooms)
*   **Total Capacity**: 68 Rooms, 136 Beds (Double occupancy)

## 4. Core Modules & Features

### A. Dashboard Module (`/dashboard`)
*   Real-time metrics: Occupancy rate, total students, available beds.
*   Visualizes pending maintenance and leave applications.
*   Color-coded status indicators with dynamic SVG charts.

### B. Administrative Hostel Office (`/hostel-office`)
*   Central hub for all administrative details (located on the Ground Floor).
*   Displays real warden contact information (Dr. Rajesh Kumar) and emergency support details.
*   Lists 12 core services provided (Room allocation, Maintenance, Grievances, etc.).

### C. Room Management (`/rooms`)
*   Detailed list of all 68 rooms across mapped floors.
*   Tracks real-time bed availability and occupancy status.
*   Filters by block, floor, or specific room search.
*   Displays amenities (WiFi, AC, Study table).

### D. Room Allocations (`/allocations`)
*   Manages student-to-room mappings.
*   Tracks check-in and check-out dates and history.

### E. Maintenance Tracking (`/maintenance`)
*   Students can submit maintenance requests categorized by type (Plumbing, Electrical, etc.).
*   Priority queues (Low, Medium, High, Urgent - color-coded).
*   Workflow tracking from "Reported" to "Completed".

### F. Leave Management (`/leave`)
*   Students can apply for leave (Semester break, medical, etc.).
*   Multi-stage approval workflow: Warden Approval -> Admin Final Approval.
*   Monitors parent consent.

### G. Student Profiles (`/profile`)
*   Displays personal and academic information, tying students to their university departments (CS, EC, ME, CE).
*   Shows current room allocation and contact details.

## 5. UI/UX Design System
*   **Aesthetics**: Glassmorphism, smooth gradients (Periwinkle Blue to Deep Purple), modern card-based components.
*   **Responsiveness**: Mobile-first approach, fully responsive on tablets and desktops.
*   **Interactivity**: Hover animations, smooth transitions, and distinct color alerts for user feedback.

## 6. How to Run the Project Locally
To run the system on your personal machine, ensure you have Node.js and Angular CLI installed.

1.  **Start the Backend Database Connection**:
    Navigate to the `backend` folder and start the Node server which handles the MySQL DB connection:
    ```bash
    cd backend
    node server.js
    ```
2.  **Start the Frontend Angular App**:
    In the root of the project directory, run:
    ```bash
    npm install
    npm start
    ```
    The application will be accessible in your browser at `http://localhost:4200/`.
