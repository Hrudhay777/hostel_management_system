import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/hostel.models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout-container">
      <nav class="navbar">

        <!-- ================= BRAND ================= -->
        <div class="navbar-brand">
          <div class="logo">
            <div class="logo-wrap">
              <img src="/images/centurion-logo.png"
                   alt="Centurion University"
                   class="logo-icon-img" />
            </div>
            <span class="logo-text">Boys Hostel</span>
          </div>
        </div>

        <!-- ================= MENU ================= -->
        <div class="navbar-menu">

          <!-- 👨‍🎓 STUDENT MENU -->
          <ng-container *ngIf="user?.role === userRole.STUDENT">

            <a routerLink="/student" class="nav-link">My Room</a>
            <a routerLink="/maintenance" class="nav-link">Maintenance</a>
            <a routerLink="/complaint" class="nav-link">Complaint</a>
            <a routerLink="/leave" class="nav-link">Leave</a>
            <a routerLink="/profile" class="nav-link">Profile</a>

          </ng-container>

          <!-- 👑 ADMIN MENU -->
          <ng-container *ngIf="user?.role === userRole.ADMIN">

            <a routerLink="/admin" class="nav-link">Dashboard</a>
            <a routerLink="/rooms" class="nav-link">Rooms</a>
            <a routerLink="/allocations" class="nav-link">Allocations</a>
            <a routerLink="/maintenance" class="nav-link">Maintenance</a>
            <a routerLink="/complaint" class="nav-link">Complaint</a>
            <a routerLink="/leave" class="nav-link">Leave</a>
            <a routerLink="/profile" class="nav-link">Profile</a>

          </ng-container>

        </div>

        <!-- ================= USER ================= -->
        <div class="navbar-user">
          <div class="user-avatar" (click)="toggleDropdown()">
            <span *ngIf="user">
              {{ user.email ? (user.email.charAt(0) | uppercase) : 'U' }}
            </span>
            <span *ngIf="!user">U</span>
          </div>

          <div class="dropdown-menu" *ngIf="showDropdown()">
            <div style="padding:0.6rem 1rem; border-bottom:1px solid #eee; color:#333">
              <div style="font-weight:700">
                {{ user?.email || 'User' }}
              </div>
              <div style="font-size:0.85rem; color:#666">
                Role: {{ user?.role || 'guest' }}
              </div>
            </div>

            <a href="#" (click)="onLogout($event)">Logout</a>
          </div>
        </div>

      </nav>

      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
      /* 🔹 KEEPING YOUR ORIGINAL STYLES — NO CHANGE */

      .layout-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      }

      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #8B2318 0%, #216642 100%);
        color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .navbar-brand {
        display: flex;
        align-items: center;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .logo-wrap {
        width: 50px;
        height: 50px;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-right: 0.75rem;
        background: rgba(255, 255, 255, 0.15);
        border: 2px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .logo-icon-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      .logo-text {
        background: linear-gradient(135deg, #FFE066 0%, #fff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .navbar-menu {
        display: flex;
        gap: 2rem;
        flex: 1;
        margin-left: 3rem;
      }

      .nav-link {
        color: white;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        transition: all 0.3s ease;
      }

      .nav-link:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }

      .navbar-user {
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #DCB824 0%, #E8C547 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #333;
        cursor: pointer;
      }

      .dropdown-menu {
        position: absolute;
        top: 50px;
        right: 0;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 150px;
        overflow: hidden;
      }

      .dropdown-menu a {
        display: block;
        padding: 0.75rem 1rem;
        color: #333;
        text-decoration: none;
      }

      .dropdown-menu a:hover {
        background: #216642;
        color: white;
      }

      .main-content {
        flex: 1;
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
      }
  `]
})
export class LayoutComponent {

  showDropdown = signal(false);
  userRole = UserRole;

  constructor(private authService: AuthService,
              private router: Router) {}

  get user() {
    return this.authService.getCurrentUser();
  }

  toggleDropdown(): void {
    this.showDropdown.update(v => !v);
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
