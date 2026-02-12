import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeaveApplication, LeaveStatus } from '../models/hostel.models';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private applications$ = new BehaviorSubject<LeaveApplication[]>([]);

  constructor() {
    this.initializeApplications();
  }

  private initializeApplications(): void {
    const mockApplications: LeaveApplication[] = [
      {
        id: 'leave-001',
        studentId: 'std-001',
        startDate: new Date('2024-12-15'),
        endDate: new Date('2024-12-25'),
        reason: 'Winter vacation',
        type: 'semester_break' as any,
        status: LeaveStatus.APPROVED,
        createdAt: new Date('2024-11-10'),
        approvedBy: 'warden-001',
        approvedAt: new Date('2024-11-12'),
        parentConsent: true
      },
      {
        id: 'leave-002',
        studentId: 'std-002',
        startDate: new Date('2024-11-22'),
        endDate: new Date('2024-11-24'),
        reason: 'Family event',
        type: 'family_event' as any,
        status: LeaveStatus.WARDEN_PENDING,
        createdAt: new Date('2024-11-18'),
        parentConsent: true
      },
      {
        id: 'leave-003',
        studentId: 'std-003',
        startDate: new Date('2024-11-25'),
        endDate: new Date('2024-11-27'),
        reason: 'Medical appointment',
        type: 'medical' as any,
        status: LeaveStatus.ADMIN_PENDING,
        createdAt: new Date('2024-11-15'),
        approvedBy: 'warden-002',
        approvedAt: new Date('2024-11-16'),
        parentConsent: true
      }
    ];
    this.applications$.next(mockApplications);
  }

  getApplications(): Observable<LeaveApplication[]> {
    return this.applications$.asObservable();
  }

  getApplicationsByStudent(studentId: string): Observable<LeaveApplication[]> {
    return new Observable(observer => {
      const apps = this.applications$.getValue().filter(a => a.studentId === studentId);
      observer.next(apps);
      observer.complete();
    });
  }

  getApplicationsByStatus(status: LeaveStatus): Observable<LeaveApplication[]> {
    return new Observable(observer => {
      const apps = this.applications$.getValue().filter(a => a.status === status);
      observer.next(apps);
      observer.complete();
    });
  }

  addApplication(application: LeaveApplication): void {
    const applications = this.applications$.getValue();
    this.applications$.next([...applications, application]);
  }

  updateApplication(id: string, updatedApplication: Partial<LeaveApplication>): void {
    const applications = this.applications$.getValue();
    const index = applications.findIndex(a => a.id === id);
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updatedApplication };
      this.applications$.next([...applications]);
    }
  }

  getPendingApplications(): Observable<LeaveApplication[]> {
    return new Observable(observer => {
      const pending = this.applications$
        .getValue()
        .filter(
          a =>
            a.status === LeaveStatus.WARDEN_PENDING ||
            a.status === LeaveStatus.ADMIN_PENDING
        );
      observer.next(pending);
      observer.complete();
    });
  }
}
