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
  private readonly ADMIN_EMAIL = 'hostelmanagement@gmail.com';
  private readonly ADMIN_PASSWORD = 'cutm@11';

  constructor(private http: HttpClient) {}

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
  
  loginStudentWithCredentials(name: string, email: string, password: string): void {
    // For now, we'll store the user info with email as ID
    const user = { id: email, name, email, role: UserRole.STUDENT };
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
    if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      const user = { id: 'superintendent', email, role: UserRole.ADMIN };
      localStorage.setItem('hms_user', JSON.stringify(user));
      this.isAuthenticatedSig.set(true);
      return true;
    }
    return false;
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
      email: 'hostelmanagement@gmail.com',
      phone: '+91-674-2301-234',
      office: 'Boys Hostel Office',
      timing: 'Mon-Fri: 9 AM - 5 PM'
    };
  }
}
