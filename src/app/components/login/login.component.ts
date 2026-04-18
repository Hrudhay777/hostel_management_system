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
            <div class="auth-toggle">
              <button type="button" [class.active]="!showNewAccountForm" (click)="showNewAccountForm = false">Sign In</button>
              <button type="button" [class.active]="showNewAccountForm" (click)="showNewAccountForm = true">Register</button>
            </div>

            <!-- Sign In Flow -->
            <ng-container *ngIf="!showNewAccountForm && !showForgotPassword">
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
              
              <div class="form-group">
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

              <div class="forgot-password-link">
                <a href="javascript:void(0)" (click)="toggleForgotPassword(true)">Forgot Password?</a>
              </div>
            </ng-container>

            <!-- Forgot Password Flow -->
            <ng-container *ngIf="showForgotPassword && !showNewAccountForm">
              <div class="forgot-password-header">
                <h3>Reset Password</h3>
                <p>Follow the steps to reset your password</p>
              </div>

              <!-- Step 1: Email -->
              <div class="form-group" *ngIf="forgotPasswordStep === 1">
                <label for="resetEmail" class="form-label">Enter Registered Email</label>
                <input
                  type="email"
                  id="resetEmail"
                  [(ngModel)]="resetEmail"
                  name="resetEmail"
                  class="form-input"
                  placeholder="Enter your email"
                  required
                />
                <button type="button" class="btn btn-secondary mt-3" (click)="requestResetOTP()" [disabled]="isLoading()">Send OTP</button>
              </div>

              <!-- Step 2: OTP -->
              <div class="form-group" *ngIf="forgotPasswordStep === 2">
                <label for="resetOtp" class="form-label">Enter OTP</label>
                <input
                  type="text"
                  id="resetOtp"
                  [(ngModel)]="resetOtp"
                  name="resetOtp"
                  class="form-input"
                  placeholder="Enter 6-digit OTP"
                  required
                />
                <button type="button" class="btn btn-secondary mt-3" (click)="verifyResetOTP()" [disabled]="isLoading()">Verify OTP</button>
              </div>

              <!-- Step 3: New Password -->
              <div *ngIf="forgotPasswordStep === 3">
                <div class="form-group">
                  <label for="resetNewPassword" class="form-label">New Password</label>
                  <input
                    type="password"
                    id="resetNewPassword"
                    [(ngModel)]="resetNewPassword"
                    name="resetNewPassword"
                    class="form-input"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="resetConfirmPassword" class="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    id="resetConfirmPassword"
                    [(ngModel)]="resetConfirmPassword"
                    name="resetConfirmPassword"
                    class="form-input"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <button type="button" class="btn btn-primary mt-2" (click)="resetPassword()" [disabled]="isLoading()">Reset Password</button>
              </div>

              <div class="mt-3 text-center">
                <a href="javascript:void(0)" (click)="toggleForgotPassword(false)">Back to Sign In</a>
              </div>
            </ng-container>

            <!-- Register Flow -->
            <ng-container *ngIf="showNewAccountForm">
              <div class="form-group">
                <label for="newStudentName" class="form-label">Full Name</label>
                <input
                  type="text"
                  id="newStudentName"
                  [(ngModel)]="newStudentName"
                  name="newStudentName"
                  class="form-input"
                  placeholder="Enter your full name"
                  [disabled]="newAccountOtpSent"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="newStudentEmail" class="form-label">Email Address</label>
                <input
                  type="email"
                  id="newStudentEmail"
                  [(ngModel)]="newStudentEmail"
                  name="newStudentEmail"
                  class="form-input"
                  placeholder="Enter your email"
                  [disabled]="newAccountOtpSent"
                  required
                />
              </div>
              
              <div class="form-group" *ngIf="!newAccountOtpSent">
                <button type="button" class="btn btn-secondary" (click)="requestNewAccountOTP()" [disabled]="isLoading()">Send OTP</button>
              </div>
              
              <div class="form-group" *ngIf="newAccountOtpSent && !newAccountOtpVerified">
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
                <button type="button" class="btn btn-secondary mt-2" (click)="verifyNewAccountOTP()" [disabled]="isLoading()">Verify OTP</button>
              </div>
              
              <div class="form-group" *ngIf="newAccountOtpVerified">
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
              
              <div class="form-group" *ngIf="newAccountOtpVerified">
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
              
              <div class="form-group" *ngIf="newAccountOtpVerified">
                <button type="button" class="btn btn-primary" (click)="createNewAccount()" [disabled]="isLoading()">Create Account</button>
              </div>
            </ng-container>
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
                placeholder="cutmhostelmanagement@gmail.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="passwordAdmin" class="form-label">Password</label>
              <input
                type="password"
                id="passwordAdmin"
                [(ngModel)]="password"
                name="passwordAdmin"
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
          <div class="form-success" *ngIf="successMessage">{{ successMessage }}</div>

          <button type="submit" class="login-btn" *ngIf="!showNewAccountForm || mode === 'admin'">
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
      background-image: url('/images/centurion-campus.jpg');
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
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%);
      backdrop-filter: blur(2px);
      pointer-events: none;
    }

    .login-card {
      position: relative;
      z-index: 10;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
      width: 400px;
      max-width: 90%;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
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
    }

    .login-header h1 {
      font-size: 1.8rem;
      color: #333;
      margin: 0.5rem 0 0.25rem 0;
    }

    .subtitle {
      font-size: 1rem;
      color: #666;
      margin: 0;
    }

    .login-mode {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .login-mode button {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      border: 1px solid #ddd;
      background: #f8f9fa;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .login-mode button.active {
      background: #8B2318;
      color: #fff;
      border-color: #8B2318;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.checkbox {
      flex-direction: row;
      align-items: center;
    }

    .form-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #555;
    }

    .form-input {
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #8B2318;
      box-shadow: 0 0 0 3px rgba(139, 35, 24, 0.1);
    }

    .checkbox-input {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .checkbox-label {
      font-size: 0.9rem;
      color: #666;
      cursor: pointer;
    }

    .login-btn {
      padding: 0.85rem;
      border: none;
      border-radius: 0.5rem;
      background: #8B2318;
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;
      margin-top: 0.5rem;
    }

    .login-btn:hover:not(:disabled) {
      background: #7a1f15;
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .login-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
    }

    .forgot-link {
      color: #8B2318;
      text-decoration: none;
      font-weight: 500;
    }

    .help-text {
      margin-top: 0.5rem;
      color: #999;
    }

    .login-info {
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      color: #fff;
      text-align: right;
      z-index: 5;
    }

    .login-info h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      font-size: 0.9rem;
    }

    .auth-toggle {
      display: flex;
      gap: 10px;
      margin-bottom: 1.5rem;
      background: #f0f0f0;
      padding: 5px;
      border-radius: 8px;
    }

    .auth-toggle button {
      flex: 1;
      padding: 8px;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: 6px;
      font-weight: 600;
      color: #666;
    }

    .auth-toggle button.active {
      background: #fff;
      color: #8B2318;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .mt-2 {
      margin-top: 10px;
    }

    .mt-3 {
      margin-top: 15px;
    }

    .text-center {
      text-align: center;
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

    .btn-primary {
      background: linear-gradient(135deg, #8B2318 0%, #C73E1D 100%);
      color: white;
      width: 100%;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 35, 24, 0.3);
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

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .forgot-password-link {
      text-align: right;
      margin-top: 8px;
    }

    .forgot-password-link a {
      color: #666;
      font-size: 0.85rem;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .forgot-password-link a:hover {
      color: #8B2318;
    }

    .forgot-password-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .forgot-password-header h3 {
      color: #8B2318;
      margin-bottom: 5px;
    }

    .forgot-password-header p {
      font-size: 0.85rem;
      color: #666;
    }

    .form-success {
      background-color: rgba(40, 167, 69, 0.1);
      color: #28a745;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      text-align: center;
      border: 1px solid rgba(40, 167, 69, 0.2);
    }

    .form-error {
      padding: 0.75rem;
      background: #fee;
      color: #c00;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      text-align: center;
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
        display: none;
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

  // Forgot Password State
  showForgotPassword = false;
  forgotPasswordStep = 1;
  resetEmail = '';
  resetOtp = '';
  resetNewPassword = '';
  resetConfirmPassword = '';
  resetToken = '';
  successMessage = '';

  constructor(private router: Router, private authService: AuthService) { }

  onLogin(): void {
    this.errorMessage = '';
    if (this.mode === 'student') {
      if (this.showNewAccountForm) return; // Registration has its own buttons

      if (!this.email || !this.password) {
        this.errorMessage = 'Email and password are required.';
        return;
      }

      this.isLoading.set(true);
      this.authService.loginStudentWithCredentials(this.email, this.password).subscribe({
        next: (response: any) => {
          this.authService.saveStudentUser(response.student);
          this.router.navigate(['/student']);
          this.isLoading.set(false);
        },
        error: (error: any) => {
          this.isLoading.set(false);
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        }
      });
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
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!this.newStudentName || !this.newStudentEmail || !this.newPassword) {
      this.errorMessage = 'All fields are required to create an account.';
      return;
    }

    this.isLoading.set(true);

    this.authService.createNewAccount(this.newStudentName, this.newStudentEmail, this.newPassword).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        this.errorMessage = 'Account created successfully! You can now login with your credentials.';
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

  // --- Forgot Password Methods ---
  toggleForgotPassword(show: boolean) {
    this.showForgotPassword = show;
    this.forgotPasswordStep = 1;
    this.errorMessage = '';
    this.successMessage = '';
  }

  requestResetOTP() {
    if (!this.resetEmail) {
      this.errorMessage = 'Email is required.';
      return;
    }
    this.isLoading.set(true);
    this.authService.forgotPasswordRequestOtp(this.resetEmail).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.forgotPasswordStep = 2;
        this.successMessage = 'OTP sent to your email.';
        this.errorMessage = '';
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = err.error?.message || 'Failed to send OTP.';
      }
    });
  }

  verifyResetOTP() {
    if (!this.resetOtp) {
      this.errorMessage = 'OTP is required.';
      return;
    }
    this.isLoading.set(true);
    this.authService.forgotPasswordVerifyOtp(this.resetEmail, this.resetOtp).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.forgotPasswordStep = 3;
        this.resetToken = res.resetToken;
        this.successMessage = 'OTP verified successfully.';
        this.errorMessage = '';
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = err.error?.message || 'Invalid OTP.';
      }
    });
  }

  resetPassword() {
    if (!this.resetNewPassword || !this.resetConfirmPassword) {
      this.errorMessage = 'Password fields are required.';
      return;
    }
    if (this.resetNewPassword !== this.resetConfirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.isLoading.set(true);
    this.authService.forgotPasswordReset(this.resetEmail, this.resetToken, this.resetNewPassword).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.showForgotPassword = false;
        this.successMessage = 'Password reset successful. Please sign in.';
        this.errorMessage = '';
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = err.error?.message || 'Failed to reset password.';
      }
    });
  }
}
