import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { AllocationsComponent } from './components/allocations/allocations.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { LeaveComponent } from './components/leave/leave.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HostelOfficeComponent } from './components/hostel-office/hostel-office.component';
import { ComplaintComponent } from './components/complaint/complaint.component';
import { authGuard, adminGuard } from './guards/auth.guard';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      // Admin-only dashboard (superintendent)
      { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
      // Student-facing dashboard (simplified)
      { path: 'student', component: StudentDashboardComponent },
      { path: 'rooms', component: RoomsComponent },
      { path: 'allocations', component: AllocationsComponent },
      { path: 'maintenance', component: MaintenanceComponent },
      { path: 'leave', component: LeaveComponent },
      { path: 'complaint', component: ComplaintComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'hostel-office', component: HostelOfficeComponent }
    ]
  }
];
