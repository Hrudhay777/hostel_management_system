# 🏢 HostelHub - Modern Hostel Management System

A comprehensive, student-friendly hostel management system built with Angular 21, featuring vibrant colors, smooth animations, and a complete set of tools for managing hostel operations.

## ✨ Features

### 📊 Dashboard
- **Real-time Statistics**: View total students, blocks, rooms, and beds at a glance
- **Visual Analytics**: Occupancy charts and pending action summaries
- **Quick Overview**: All critical hostel information in one place
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🛏️ Room Management
- **Room Inventory**: Browse all hostel rooms with detailed information
- **Occupancy Tracking**: Real-time bed occupancy status
- **Room Details**: 
  - Room type (Single, Double, Triple, Quad)
  - Floor and block information
  - Amenities list
  - Rental rates
  - Individual bed status tracking
- **Advanced Filtering**: Search by room number or filter by block
- **Status Indicators**: Visual indicators for room status (Available, Occupied, Maintenance)

### 👥 Student Profiles
- **Comprehensive Profiles**: Student details including:
  - Personal information (Name, Email, Phone, DOB)
  - Academic details (Department, Semester, Registration Number)
  - Current room allocation
  - Parent contact information
- **Profile Dashboard**: Quick view of current allocation and amenities
- **Document Management**: Track student documents and certificates

### 🏠 Room Allocation
- **Allocation Management**: Track all student room allocations
- **Check-in/Check-out**: Monitor student entry and exit
- **Allocation Status**: View allocation history and status
- **Quick Statistics**: Active, completed, and pending allocations at a glance

### 🔧 Maintenance Tracking
- **Request Management**: Report and track maintenance issues
- **Priority Levels**: Urgent, High, Medium, Low priority classification
- **Categories**: Plumbing, Electrical, Furniture, Cleaning, Painting, Other
- **Status Workflow**: Reported → Acknowledged → In Progress → Completed
- **Assignment Tracking**: Track which maintenance staff is assigned
- **Image Upload**: Add photos of maintenance issues
- **Notes & Updates**: Keep detailed notes on each request

### 📋 Leave Application Workflow
- **Easy Application**: Students can apply for leave with:
  - Leave type (Semester Break, Emergency, Medical, Festival, Family Event)
  - Date range selection
  - Reason for leave
- **Multi-level Approval**: 
  - Warden approval
  - Admin approval
  - Parent consent tracking
- **Status Tracking**: 
  - Draft → Submitted → Warden Pending → Admin Pending → Approved/Rejected
- **Application History**: View all past applications and their status

### 🎨 Modern UI/UX
- **Vibrant Color Scheme**:
  - Primary: Purple gradient (#667eea → #764ba2)
  - Secondary: Pink/Red gradient (#f093fb → #f5576c)
  - Success: Cyan gradient (#4facfe → #00f2fe)
  - Warning: Orange/Yellow gradient (#fa709a → #fee140)
  - Danger: Red gradient (#ff6b6b → #ff8e53)

- **Visual Elements**:
  - Smooth animations and transitions
  - Card-based layouts for better organization
  - Progress bars for occupancy tracking
  - Status badges with color coding
  - Responsive grid layouts
  - Hover effects and interactive elements

- **Responsive Design**:
  - Mobile-first approach
  - Tablet optimization
  - Desktop full layout
  - Touch-friendly controls
  - Optimized navigation

### 📱 Navigation
- **Top Navigation Bar**: 
  - Sticky navbar with quick links
  - User avatar and profile menu
  - Logo and branding
  - Responsive mobile menu

- **Navigation Sections**:
  - Dashboard
  - Rooms
  - Allocations
  - Maintenance
  - Leave
  - Profile

## 🏗️ Project Structure

```
src/
├── app/
│   ├── models/
│   │   └── hostel.models.ts          # All TypeScript interfaces and enums
│   ├── services/
│   │   ├── block.service.ts          # Block management service
│   │   ├── room.service.ts           # Room management service
│   │   ├── student.service.ts        # Student service
│   │   ├── allocation.service.ts     # Room allocation service
│   │   ├── maintenance.service.ts    # Maintenance tracking service
│   │   └── leave.service.ts          # Leave application service
│   ├── components/
│   │   ├── layout/
│   │   │   └── layout.component.ts   # Main layout with navbar
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts # Dashboard with statistics
│   │   ├── rooms/
│   │   │   └── rooms.component.ts     # Room management
│   │   ├── allocations/
│   │   │   └── allocations.component.ts # Room allocation tracking
│   │   ├── maintenance/
│   │   │   └── maintenance.component.ts # Maintenance requests
│   │   ├── leave/
│   │   │   └── leave.component.ts     # Leave application system
│   │   └── profile/
│   │       └── profile.component.ts   # Student profile
│   ├── app.ts                         # Root component
│   ├── app.html                       # Root template
│   ├── app.routes.ts                  # Routing configuration
│   └── app.css                        # Root styles
├── styles.css                         # Global styles
└── main.ts                            # Entry point
```

## 🎯 Data Models

### Core Entities
- **HostelBlock**: Represents a hostel building block
- **Room**: Individual hostel room with capacity and amenities
- **Student**: Student profile with academic details
- **RoomAllocation**: Links students to rooms with check-in/out tracking
- **MaintenanceRequest**: Tracks maintenance issues with priority and status
- **LeaveApplication**: Manages leave requests with approval workflow
- **CheckInOut**: Monitors student entry and exit

### Status Enums
- **RoomStatus**: Available, Occupied, Maintenance, Blocked
- **BedStatus**: Available, Occupied, Reserved, Maintenance
- **AllocationStatus**: Allocated, Active, Checked In, Checked Out, Cancelled
- **MaintenanceStatus**: Reported, Acknowledged, In Progress, Completed
- **LeaveStatus**: Draft, Submitted, Warden Pending, Admin Pending, Approved, Rejected
- **UserRole**: Student, Warden, Admin, Maintenance

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 11.6.2 or higher
- Angular CLI 21.x

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## 🎨 Styling & Customization

### Global Variables
Edit `src/styles.css` to customize:
- Primary and secondary colors
- Gradients
- Border colors
- Background colors

### Component Styles
Each component includes its own styling with:
- Responsive breakpoints
- Color variables
- Smooth transitions
- Hover effects

## 📊 Features Breakdown

### Dashboard Analytics
- **Real-time Statistics**: Total students, blocks, rooms, and beds
- **Occupancy Tracker**: Visual representation of bed occupancy
- **Pending Actions**: Quick access to pending leave applications and maintenance requests
- **Block Overview**: Detailed block-wise occupancy and amenities

### Room Management
- **Comprehensive Filtering**: Search and filter rooms by various criteria
- **Bed-level Tracking**: Individual bed status and student assignment
- **Amenity Display**: List of facilities in each room
- **Capacity Management**: Visual bed occupancy tracking

### Leave Management
- **Multi-stage Workflow**: Warden and Admin approval process
- **Parent Consent**: Track parent approval for leave applications
- **Application History**: View all submitted and approved leave applications
- **Quick Approval**: Fast-track leave requests from the dashboard

### Maintenance System
- **Priority-based Sorting**: Urgent issues highlighted at the top
- **Assignment Tracking**: Track maintenance staff assignments
- **Status Updates**: Keep residents informed of maintenance progress
- **Estimated Completion**: Display expected completion dates

## 🔐 Security Considerations

### Current Implementation
- Role-based access (Student, Warden, Admin, Maintenance)
- Basic authentication framework
- Service-based data access

### Production Recommendations
1. Implement JWT-based authentication
2. Add role-based access control (RBAC)
3. Encrypt sensitive data in transit
4. Implement API security headers
5. Add input validation and sanitization
6. Regular security audits

## 📈 Scalability

### Architecture Design
- **Service-based**: Loose coupling between components
- **Reactive Programming**: RxJS observables for data management
- **State Management**: BehaviorSubjects for state management
- **Modular Components**: Each feature is self-contained

### Performance Optimization
- OnPush change detection strategy
- Lazy loading support for routes
- Image optimization
- CSS and JS minification

## 🐛 Mock Data

The system includes mock data for demonstration:
- 3 Hostel Blocks with 144-180 beds each
- 3+ Rooms per block with varying capacities
- 5 Student records
- Room allocations with check-in status
- Maintenance requests in various stages
- Leave applications with approval workflow

## 📝 Customization Guide

### Adding New Features
1. Create model in `models/hostel.models.ts`
2. Add service in `services/`
3. Create component in `components/`
4. Register route in `app.routes.ts`
5. Add styles following component convention

### Styling Conventions
- Use CSS variables for colors
- Follow BEM naming for CSS classes
- Include responsive breakpoints
- Use smooth transitions

## 🤝 Contributing

To contribute to this project:
1. Create a new branch for your feature
2. Follow the existing code style
3. Add appropriate comments
4. Test your changes
5. Create a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Educational Value

This project demonstrates:
- Modern Angular 21 best practices
- Standalone components
- RxJS reactive programming
- Component composition
- CSS Grid and Flexbox
- Responsive design patterns
- Service-based architecture
- Angular routing
- Type safety with TypeScript

## 🚀 Future Enhancements

Planned features:
- Dashboard with advanced charts (Chart.js integration)
- Real-time notifications
- Email/SMS integration for notifications
- Payment processing for hostel fees
- Visitor management system
- Complaint management system
- Food/Mess management
- Asset tracking
- PDF report generation
- Mobile app (React Native/Flutter)
- Backend API integration
- Database persistence (MongoDB/PostgreSQL)
- Advanced analytics and reporting

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🎉 Version History

### v1.0.0 (Current)
- Initial release
- Core features implemented
- Responsive design
- Mock data integration
- Comprehensive UI components

---

**Built with ❤️ using Angular 21**

For more information about Angular, visit [angular.dev](https://angular.dev)
