import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-overlay"></div>
      
      <div class="login-card">
        <div class="login-header">
          <div class="university-emblem">
            <img src="/images/centurion-logo.png" alt="Centurion University" class="emblem-img" />
          </div>
          <h1>Centurion University</h1>
          <p class="subtitle">Boys Hostel Management System</p>
          <div class="login-mode">
            <button type="button" [class.active]="mode==='student'" (click)="mode='student'">Student</button>
            <button type="button" [class.active]="mode==='admin'" (click)="mode='admin'">Admin</button>
          </div>
        </div>
        <form class="login-form" (ngSubmit)="onLogin()">
          <!-- Student Mode -->
          <ng-container *ngIf="mode === 'student'">
            <div class="form-group">
              <label for="studentName" class="form-label">Student Name</label>
              <input
                type="text"
                id="studentName"
                [(ngModel)]="studentName"
                name="studentName"
                class="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                name="email"
                class="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div class="form-group" *ngIf="showPassword">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                class="form-input"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div class="form-group" *ngIf="!showPassword">
              <button type="button" class="btn btn-secondary" (click)="requestOTP()" [disabled]="isLoading()">Request OTP</button>
            </div>
            
            <!-- New Account Creation Section -->
            <div class="form-group" *ngIf="showNewAccountForm">
              <button type="button" class="btn btn-tertiary" (click)="toggleNewAccountForm()">Sign in with existing account</button>
            </div>
            
            <div class="form-group" *ngIf="showNewAccountForm">
              <label for="newStudentName" class="form-label">Full Name</label>
              <input
                type="text"
                id="newStudentName"
                [(ngModel)]="newStudentName"
                name="newStudentName"
                class="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div class="form-group" *ngIf="showNewAccountForm">
              <label for="newStudentEmail" class="form-label">Email Address</label>
              <input
                type="email"
                id="newStudentEmail"
                [(ngModel)]="newStudentEmail"
                name="newStudentEmail"
                class="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div class="form-group" *ngIf="showNewAccountForm && !newAccountOtpSent">
              <button type="button" class="btn btn-secondary" (click)="requestNewAccountOTP()" [disabled]="isLoading()">Send OTP</button>
            </div>
            
            <div class="form-group" *ngIf="showNewAccountForm && newAccountOtpSent">
              <label for="newAccountOtp" class="form-label">Enter OTP</label>
              <input
                type="text"
                id="newAccountOtp"
                [(ngModel)]="newAccountOtp"
                name="newAccountOtp"
                class="form-input"
                placeholder="Enter OTP sent to your email"
                required
              />
            </div>
            
            <div class="form-group" *ngIf="showNewAccountForm && newAccountOtpVerified">
              <label for="newPassword" class="form-label">Create Password</label>
              <input
                type="password"
                id="newPassword"
                [(ngModel)]="newPassword"
                name="newPassword"
                class="form-input"
                placeholder="Create a password"
                required
              />
            </div>
            
            <div class="form-group" *ngIf="showNewAccountForm && newAccountOtpVerified">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                class="form-input"
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <div class="form-group" *ngIf="showNewAccountForm && newAccountOtpVerified">
              <button type="button" class="btn btn-primary" (click)="createNewAccount()" [disabled]="isLoading()">Create Account</button>
            </div>
          </ng-container>

          <!-- Admin Mode -->
          <ng-container *ngIf="mode === 'admin'">
            <div class="form-group">
              <label for="emailAdmin" class="form-label">Admin Email</label>
              <input
                type="email"
                id="emailAdmin"
                [(ngModel)]="email"
                name="emailAdmin"
                class="form-input"
                placeholder="hostelmanagement@gmail.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                class="form-input"
                placeholder="Enter admin password"
                required
              />
            </div>
          </ng-container>

          <div class="form-group checkbox" *ngIf="mode === 'student'">
            <input
              type="checkbox"
              id="rememberMe"
              [(ngModel)]="rememberMe"
              name="rememberMe"
              class="checkbox-input"
            />
            <label for="rememberMe" class="checkbox-label">Remember me</label>
          </div>

          <div class="form-error" *ngIf="errorMessage">{{ errorMessage }}</div>

          <button type="submit" class="login-btn">
            <span *ngIf="!isLoading()">Sign In</span>
            <span *ngIf="isLoading()">Signing In...</span>
          </button>
        </form>

        <div class="login-footer">
          <p>
            <a href="#forgot" class="forgot-link">Forgot Password?</a>
          </p>
          <p class="help-text">
            Contact Hostel Office for account assistance
          </p>
        </div>
      </div>

      <div class="login-info">
        <h2>Welcome to Boys Hostel</h2>
        <ul class="feature-list">
          <li>✓ Room Allocation Management</li>
          <li>✓ Maintenance Request Tracking</li>
          <li>✓ Leave Application Workflow</li>
          <li>✓ Student Profile Management</li>
          <li>✓ Occupancy Dashboard</li>
          <li>✓ 24/7 Online Support</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: url('/images/centurion-campus.avif'), url('/images/centurion-campus.jpg');
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .login-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      /* lighter overlay so background is more visible */
      background: linear-gradient(135deg, rgba(139,35,24,0.20) 0%, rgba(220,184,36,0.12) 50%, rgba(33,100,66,0.18) 100%);
      backdrop-filter: blur(1px);
      pointer-events: none;
    }

    .login-card {
      position: absolute;
      z-index: 12;
      background: rgba(255,255,255,0.95);
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
      width: 420px;
      max-width: 90%;
      animation: slideInUp 0.6s ease-out;
      /* position the card over the gate area (adjusts to the blue-marked area) */
      left: 52%;
      top: 52%;
      transform: translate(-50%, -50%);
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .university-emblem {
      margin-bottom: 1rem;
      display: flex;
      justify-content: center;
    }

    .emblem-img {
      width: 80px;
      height: 80px;
      object-fit: contain;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }

    .login-header h1 {
      font-size: 1.8rem;
      color: #8B2318;
      margin: 0.5rem 0 0.25rem 0;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .login-mode {
      margin-top: 0.75rem;
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .login-mode button {
      padding: 0.35rem 0.65rem;
      border-radius: 0.35rem;
      border: 1px solid rgba(0,0,0,0.06);
      background: #fff;
      cursor: pointer;
      font-weight: 600;
    }

    .login-mode button.active {
      background: linear-gradient(135deg, #8B2318 0%, #C73E1D 100%);
      color: #fff;
    }

    .subtitle {
      font-size: 0.95rem;
      color: #216642;
      margin: 0;
      font-weight: 500;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.checkbox {
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #333;
      letter-spacing: 0.3px;
    }

    .form-input {
      padding: 0.85rem 1rem;
      font-size: 0.95rem;
      border: 2px solid #DCB824;
      border-radius: 0.5rem;
      font-family: inherit;
      transition: all 0.3s ease;
      background: #fafafa;
    }

    .form-input:focus {
      outline: none;
      border-color: #216642;
      background: white;
      box-shadow: 0 0 0 3px rgba(33, 102, 66, 0.1);
    }

    .checkbox-input {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #8B2318;
    }

    .checkbox-label {
      font-size: 0.9rem;
      color: #555;
      cursor: pointer;
      font-weight: 500;
    }

    .login-btn {
      padding: 0.95rem 1.5rem;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: white;
      background: linear-gradient(135deg, #8B2318 0%, #C73E1D 100%);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      box-shadow: 0 4px 15px rgba(139, 35, 24, 0.3);
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 35, 24, 0.4);
    }

    .login-btn:active {
      transform: translateY(0);
    }

    .login-footer {
      text-align: center;
      font-size: 0.9rem;
      color: #666;
    }

    .forgot-link {
      color: #216642;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .forgot-link:hover {
      color: #8B2318;
      text-decoration: underline;
    }

    .help-text {
      margin: 0.75rem 0 0 0;
      color: #999;
      font-size: 0.85rem;
    }

    .login-info {
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      color: white;
      max-width: 300px;
      z-index: 5;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .login-info h2 {
      font-size: 1.5rem;
      margin: 0 0 1rem 0;
      font-weight: 700;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.8;
    }

    .feature-list li {
      margin: 0.5rem 0;
      font-weight: 500;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, #216642 0%, #3d9970 100%);
      color: white;
      width: 100%;
    }
    
    .btn-secondary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(33, 102, 66, 0.3);
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-tertiary {
      background: linear-gradient(135deg, #8B2318 0%, #C73E1D 100%);
      color: white;
      width: 100%;
      margin-top: 10px;
    }
    
    .btn-tertiary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 35, 24, 0.3);
    }

    @media (max-width: 768px) {
      .login-container {
        background-attachment: scroll;
      }

      .login-card {
        padding: 2rem;
        max-width: 95%;
      }

      .login-info {
        position: static;
        text-align: center;
        margin-top: 2rem;
      }

      .login-header h1 {
        font-size: 1.5rem;
      }

      .form-input {
        padding: 0.75rem 0.85rem;
        font-size: 0.9rem;
      }

      .login-btn {
        padding: 0.85rem 1.25rem;
        font-size: 0.95rem;
      }
    }
  `]
})
export class LoginComponent {
  studentName = '';
  email = '';
  password = '';
  rememberMe = false;
  isLoading = signal(false);
  mode: 'student' | 'admin' = 'student';
  errorMessage = '';
  showPassword = false;
  showNewAccountForm = false;
  newStudentName = '';
  newStudentEmail = '';
  newAccountOtp = '';
  newPassword = '';
  confirmPassword = '';
  newAccountOtpSent = false;
  newAccountOtpVerified = false;

  constructor(private router: Router, private authService: AuthService) {}

  onLogin(): void {
    this.errorMessage = '';
    if (this.mode === 'student') {
      if (!this.studentName || !this.email) {
        this.errorMessage = 'Student name and email are required.';
        return;
      }
      
      if (!this.showPassword) {
        this.errorMessage = 'Please request OTP first and enter the password.';
        return;
      }
      
      if (!this.password) {
        this.errorMessage = 'Password is required.';
        return;
      }
      
      this.isLoading.set(true);
      setTimeout(() => {
        this.authService.loginStudentWithCredentials(this.studentName, this.email, this.password);
        this.router.navigate(['/student']);
        this.isLoading.set(false);
      }, 700);
      return;
    }

    // Admin flow
    if (this.mode === 'admin') {
      if (!this.email || !this.password) {
        this.errorMessage = 'Email and password are required for admin.';
        return;
      }
      this.isLoading.set(true);
      setTimeout(() => {
        const ok = this.authService.loginAdmin(this.email, this.password);
        if (ok) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid admin credentials.';
        }
        this.isLoading.set(false);
      }, 700);
    }
  }
  
  requestOTP(): void {
    if (!this.email) {
      this.errorMessage = 'Email is required to request OTP.';
      return;
    }
    
    this.isLoading.set(true);
    
    // Call the backend API to send OTP
    this.authService.requestOTP(this.email).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        this.showPassword = true;
        this.errorMessage = 'OTP has been sent to your email. Please check your inbox.';
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.errorMessage = 'Failed to send OTP. Please check your email and try again.';
      }
    });
  }
  
  toggleNewAccountForm(): void {
    this.showNewAccountForm = !this.showNewAccountForm;
    this.errorMessage = '';
  }
  
  requestNewAccountOTP(): void {
    if (!this.newStudentName || !this.newStudentEmail) {
      this.errorMessage = 'Name and email are required.';
      return;
    }
    
    this.isLoading.set(true);
    
    // Call the backend API to send OTP for new account
    this.authService.requestNewAccountOTP(this.newStudentName, this.newStudentEmail).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        this.newAccountOtpSent = true;
        this.errorMessage = 'OTP has been sent to your email. Please check your inbox.';
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.errorMessage = error.error?.message || 'Failed to send OTP. Please check your email and try again.';
      }
    });
  }
  
  verifyNewAccountOTP(): void {
    if (!this.newStudentEmail || !this.newAccountOtp) {
      this.errorMessage = 'Email and OTP are required.';
      return;
    }
    
    this.isLoading.set(true);
    
    // Call the backend API to verify OTP
    this.authService.verifyNewAccountOTP(this.newStudentEmail, this.newAccountOtp).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        this.newAccountOtpVerified = true;
        this.errorMessage = 'OTP verified successfully. You can now create your password.';
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.errorMessage = error.error?.message || 'Invalid OTP. Please try again.';
      }
    });
  }
  
  createNewAccount(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.'
      return;
    }
    
    if (!this.newStudentName || !this.newStudentEmail || !this.newPassword) {
      this.errorMessage = 'All fields are required to create an account.';
      return;
    }
    
    this.isLoading.set(true);
    
    // Call the backend API to create new account
    this.authService.createNewAccount(this.newStudentName, this.newStudentEmail, this.newPassword).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        this.errorMessage = 'Account created successfully! You can now login with your credentials.';
        // Reset form and switch to login mode
        this.resetNewAccountForm();
        this.showNewAccountForm = false;
        this.mode = 'student';
        this.studentName = this.newStudentName;
        this.email = this.newStudentEmail;
        this.password = this.newPassword;
        this.showPassword = true;
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.errorMessage = error.error?.message || 'Failed to create account. Please try again.';
      }
    });
  }
  
  resetNewAccountForm(): void {
    this.newStudentName = '';
    this.newStudentEmail = '';
    this.newAccountOtp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.newAccountOtpSent = false;
    this.newAccountOtpVerified = false;
  }
}
