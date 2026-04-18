import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  Complaint,
  ComplaintStatus
} from '../models/hostel.models';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private apiUrl = 'http://localhost:3000/api/complaints';

  private complaintsSubject = new BehaviorSubject<Complaint[]>([]);
  complaints$ = this.complaintsSubject.asObservable();

  private selectedComplaintSubject = new BehaviorSubject<Complaint | null>(null);
  selectedComplaint$ = this.selectedComplaintSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshComplaints();
  }

  // ==============================
  // REFRESH DATA FROM BACKEND
  // ==============================
  refreshComplaints(): void {
    this.http.get<Complaint[]>(this.apiUrl).subscribe(all => {
      this.complaintsSubject.next(all);
    });
  }

  // ==============================
  // GET ALL COMPLAINTS
  // ==============================
  getComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl).pipe(
      tap(all => this.complaintsSubject.next(all))
    );
  }

  // ==============================
  // GET BY ID
  // ==============================
  getComplaintById(id: string): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`);
  }

  // ==============================
  // SELECT COMPLAINT
  // ==============================
  selectComplaint(complaint: Complaint): void {
    this.selectedComplaintSubject.next(complaint);
  }

  getSelectedComplaint(): Observable<Complaint | null> {
    return this.selectedComplaint$;
  }

  // ==============================
  // ADD NEW COMPLAINT (Student)
  // ==============================
  addComplaint(complaint: Complaint): Observable<any> {
    return this.http.post(this.apiUrl, complaint).pipe(
      tap(() => this.refreshComplaints())
    );
  }

  // ==============================
  // UPDATE COMPLAINT (Admin)
  // ==============================
  updateComplaint(id: string, updates: Partial<Complaint>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updates).pipe(
      tap(() => this.refreshComplaints())
    );
  }

  // ==============================
  // RESOLVE COMPLAINT (Admin)
  // ==============================
  resolveComplaint(id: string, resolutionMessage: string): Observable<any> {
    const updates = {
      status: ComplaintStatus.RESOLVED,
      resolution: resolutionMessage,
      resolvedAt: new Date()
    };
    return this.updateComplaint(id, updates);
  }

  // ==============================
  // DELETE COMPLAINT
  // ==============================
  removeComplaint(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshComplaints())
    );
  }

  // ==============================
  // GET BY STUDENT
  // ==============================
  getComplaintsByStudent(studentId: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl).pipe(
      tap(all => {
        const filtered = all.filter(c => c.studentId === studentId);
        // We don't update the global subject with filtered data
      }),
      // Actually, it's better to just filter the result of getComplaints
      tap(all => this.complaintsSubject.next(all))
    );
  }
}
