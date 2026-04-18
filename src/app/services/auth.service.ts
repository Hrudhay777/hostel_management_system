import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole } from '../models/hostel.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSig = signal<boolean>(this.checkLocalStorage());
  isAuthenticated$ = this.isAuthenticatedSig.asReadonly();

  // Admin credentials (single superintendent account as requested)
  private readonly ADMIN_EMAIL = 'cutmhostelmanagement@gmail.com';
  private readonly ADMIN_PASSWORD = 'Cutm@777';
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  private checkLocalStorage(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('hms_user');
    }
    return false;
  }

  /** Login as a student. We store a minimal user object in localStorage so role-aware guards
   *  and UI can read it. Student login in this MVP is by `studentId` (admin will allocate records).
   */
  loginStudent(studentId: string, email?: string): void {
    const user = { id: studentId, email: email || '', role: UserRole.STUDENT };
    localStorage.setItem('hms_user', JSON.stringify(user));
    this.isAuthenticatedSig.set(true);
  }

  loginStudentWithCredentials(email: string, password: string): Observable<any> {
    // Make an HTTP request to the backend for student login
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password });
  }

  saveStudentUser(student: any): void {
    const user = { ...student, role: UserRole.STUDENT };
    localStorage.setItem('hms_user', JSON.stringify(user));
    this.isAuthenticatedSig.set(true);
  }

  requestOTP(email: string): Observable<any> {
    // Make an HTTP request to the backend to send OTP
    return this.http.post<any>('http://localhost:3000/api/auth/request-otp', { email });
  }

  requestNewAccountOTP(name: string, email: string): Observable<any> {
    // Make an HTTP request to the backend to send OTP for new account
    return this.http.post<any>('http://localhost:3000/api/auth/request-new-account-otp', { name, email });
  }

  verifyNewAccountOTP(email: string, otp: string): Observable<any> {
    // Verify OTP for new account
    return this.http.post<any>('http://localhost:3000/api/auth/verify-new-account-otp', { email, otp });
  }

  createNewAccount(name: string, email: string, password: string): Observable<any> {
    // Create a new account
    return this.http.post<any>('http://localhost:3000/api/auth/create-account', { name, email, password });
  }

  /** Admin login checks the fixed superintendent credentials and stores an admin user. */
  loginAdmin(email: string, password: string): boolean {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    console.log('Admin login attempt:', { trimmedEmail, trimmedPassword });
    console.log('Comparing with:', { expectedEmail: this.ADMIN_EMAIL.toLowerCase(), expectedPassword: this.ADMIN_PASSWORD });

    if (trimmedEmail === this.ADMIN_EMAIL.toLowerCase() && trimmedPassword === this.ADMIN_PASSWORD) {
      const user = { id: 'superintendent', email: trimmedEmail, role: UserRole.ADMIN };
      console.log('Login successful, storing user:', user);
      localStorage.setItem('hms_user', JSON.stringify(user));
      this.isAuthenticatedSig.set(true);
      return true;
    }
    console.log('Login failed: Credentials mismatch.');
    return false;
  }

  // --- Forgot Password Methods ---

  forgotPasswordRequestOtp(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password-request-otp`, { email });
  }

  forgotPasswordVerifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password-verify-otp`, { email, otp });
  }

  forgotPasswordReset(email: string, resetToken: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password-reset`, { email, resetToken, newPassword });
  }

  logout(): void {
    localStorage.removeItem('hms_user');
    this.isAuthenticatedSig.set(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSig();
  }

  /** Return the parsed user object from localStorage (or null). */
  getCurrentUser(): { id?: string; email?: string; role?: UserRole } | null {
    try {
      const raw = localStorage.getItem('hms_user');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  /** Get admin/hostel management contact information for students */
  getHostelManagementInfo() {
    return {
      name: 'Hostel Management',
      email: 'cutmhostelmanagement@gmail.com',
      phone: '+91-674-2301-234',
      office: 'Boys Hostel Office',
      timing: 'Mon-Fri: 9 AM - 5 PM'
    };
  }
}
