import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Complaint,
  ComplaintStatus
} from '../models/hostel.models';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private storageKey = 'hms_complaints';

  private complaintsSubject = new BehaviorSubject<Complaint[]>([]);
  complaints$ = this.complaintsSubject.asObservable();

  private selectedComplaintSubject = new BehaviorSubject<Complaint | null>(null);
  selectedComplaint$ = this.selectedComplaintSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  // ==============================
  // LOAD DATA FROM LOCAL STORAGE
  // ==============================
  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      this.complaintsSubject.next(JSON.parse(stored));
    }
  }

  // ==============================
  // SAVE DATA TO LOCAL STORAGE
  // ==============================
  private saveToStorage(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.complaintsSubject.getValue())
    );
  }

  // ==============================
  // GET ALL COMPLAINTS
  // ==============================
  getComplaints(): Observable<Complaint[]> {
    return this.complaints$;
  }

  // ==============================
  // GET BY ID
  // ==============================
  getComplaintById(id: string): Complaint | undefined {
    return this.complaintsSubject.getValue().find(c => c.id === id);
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
  addComplaint(complaint: Complaint): void {
    const updated = [...this.complaintsSubject.getValue(), complaint];
    this.complaintsSubject.next(updated);
    this.saveToStorage();
  }

  // ==============================
  // UPDATE COMPLAINT (Admin)
  // ==============================
  updateComplaint(id: string, updates: Partial<Complaint>): void {

    const complaints = this.complaintsSubject.getValue();

    const updatedList = complaints.map(c =>
      c.id === id
        ? { ...c, ...updates, updatedAt: new Date() }
        : c
    );

    this.complaintsSubject.next(updatedList);
    this.saveToStorage();
  }

  // ==============================
  // RESOLVE COMPLAINT (Admin)
  // ==============================
  resolveComplaint(id: string, resolutionMessage: string): void {
    this.updateComplaint(id, {
      status: ComplaintStatus.RESOLVED,
      resolution: resolutionMessage,
      resolvedAt: new Date()
    });
  }

  // ==============================
  // DELETE COMPLAINT
  // ==============================
  removeComplaint(id: string): void {
    const updated = this.complaintsSubject
      .getValue()
      .filter(c => c.id !== id);

    this.complaintsSubject.next(updated);
    this.saveToStorage();
  }

  // ==============================
  // GET BY STUDENT
  // ==============================
  getComplaintsByStudent(studentId: string): Observable<Complaint[]> {
    return new Observable(observer => {
      const filtered = this.complaintsSubject
        .getValue()
        .filter(c => c.studentId === studentId);

      observer.next(filtered);
      observer.complete();
    });
  }

  // ==============================
  // GET BY STATUS
  // ==============================
  getComplaintsByStatus(status: ComplaintStatus): Observable<Complaint[]> {
    return new Observable(observer => {
      const filtered = this.complaintsSubject
        .getValue()
        .filter(c => c.status === status);

      observer.next(filtered);
      observer.complete();
    });
  }
}
