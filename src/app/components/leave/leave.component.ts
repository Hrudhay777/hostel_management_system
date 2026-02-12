import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { StudentService } from '../../services/student.service';
import { LeaveApplication, LeaveStatus } from '../../models/hostel.models';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="leave-container">
      <div class="page-header">
        <h1>Leave Applications</h1>
        <button class="btn btn-primary">+ New Application</button>
      </div>

      <div class="tabs">
        <button
          class="tab"
          [ngClass]="{ active: selectedTab === 'all' }"
          (click)="selectedTab = 'all'; filterApplications()"
        >
          All
        </button>
        <button
          class="tab"
          [ngClass]="{ active: selectedTab === 'pending' }"
          (click)="selectedTab = 'pending'; filterApplications()"
        >
          Pending
        </button>
        <button
          class="tab"
          [ngClass]="{ active: selectedTab === 'approved' }"
          (click)="selectedTab = 'approved'; filterApplications()"
        >
          Approved
        </button>
        <button
          class="tab"
          [ngClass]="{ active: selectedTab === 'rejected' }"
          (click)="selectedTab = 'rejected'; filterApplications()"
        >
          Rejected
        </button>
      </div>

      <div class="applications-list">
        <div class="app-card" *ngFor="let app of filteredApplications" [ngClass]="'status-' + app.status">
          <div class="app-header">
            <div class="app-title">
              <h3>{{ getStudentName(app.studentId) }}</h3>
              <p class="app-type">{{ formatLeaveType(app.type) }}</p>
            </div>
            <span class="status-badge" [ngClass]="'badge-' + getStatusCategory(app.status)">
              {{ formatStatus(app.status) }}
            </span>
          </div>

          <div class="app-body">
            <div class="date-range">
              <div class="date-item">
                <span class="label">From:</span>
                <span class="value">{{ app.startDate | date: 'dd MMM yyyy' }}</span>
              </div>
              <div class="date-item">
                <span class="label">To:</span>
                <span class="value">{{ app.endDate | date: 'dd MMM yyyy' }}</span>
              </div>
              <div class="date-item">
                <span class="label">Duration:</span>
                <span class="value">{{ calculateDuration(app.startDate, app.endDate) }} days</span>
              </div>
            </div>

            <div class="app-reason">
              <strong>Reason:</strong>
              <p>{{ app.reason }}</p>
            </div>

            <div class="app-meta">
              <div class="meta-item" *ngIf="app.parentConsent">
                <span class="icon">✓</span>
                <span>Parent Consent Received</span>
              </div>
              <div class="meta-item" *ngIf="app.approvedBy">
                <span class="icon">✓</span>
                <span>Approved by {{ app.approvedBy }}</span>
              </div>
              <div class="meta-item" *ngIf="app.rejectionReason">
                <span class="icon">✗</span>
                <span>{{ app.rejectionReason }}</span>
              </div>
            </div>

            <div class="approval-workflow" *ngIf="isWaitingApproval(app.status)">
              <div class="workflow-step" [ngClass]="{ completed: isStepCompleted('warden', app.status) }">
                <span class="step-icon">📋</span>
                <span class="step-label">Warden Approval</span>
              </div>
              <div class="workflow-arrow">→</div>
              <div class="workflow-step" [ngClass]="{ completed: isStepCompleted('admin', app.status) }">
                <span class="step-icon">👤</span>
                <span class="step-label">Admin Approval</span>
              </div>
            </div>
          </div>

          <div class="app-footer">
            <button class="btn btn-small btn-secondary">View Details</button>
            <button
              class="btn btn-small btn-primary"
              *ngIf="app.status === 'warden_pending' || app.status === 'admin_pending'"
            >
              Review
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredApplications.length === 0">
        <p>No leave applications found</p>
      </div>
    </div>
  `,
  styles: [
    `
      .leave-container {
        animation: fadeIn 0.5s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .page-header h1 {
        color: #333;
        font-size: 2rem;
        margin: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        font-size: 0.95rem;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .btn-small {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
      }

      .btn-secondary {
        background: #f0f0f0;
        color: #333;
      }

      .btn-secondary:hover {
        background: #e0e0e0;
      }

      .tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid #e0e0e0;
      }

      .tab {
        padding: 1rem 1.5rem;
        border: none;
        background: transparent;
        cursor: pointer;
        font-weight: 600;
        color: #666;
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
        margin-bottom: -2px;
      }

      .tab:hover {
        color: #667eea;
      }

      .tab.active {
        color: #667eea;
        border-bottom-color: #667eea;
      }

      .applications-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .app-card {
        background: white;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        border-top: 4px solid #667eea;
      }

      .app-card.status-approved {
        border-top-color: #27ae60;
      }

      .app-card.status-rejected {
        border-top-color: #e74c3c;
      }

      .app-card.status-warden_pending,
      .app-card.status-admin_pending {
        border-top-color: #f39c12;
      }

      .app-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      }

      .app-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 1.5rem;
        background: #f9f9f9;
        border-bottom: 1px solid #e0e0e0;
      }

      .app-title h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .app-type {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      .status-badge {
        padding: 0.35rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .badge-approved {
        background: #e0ffe0;
        color: #27ae60;
      }

      .badge-rejected {
        background: #ffe0e0;
        color: #e74c3c;
      }

      .badge-pending {
        background: #fff8e0;
        color: #f39c12;
      }

      .app-body {
        flex: 1;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .date-range {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }

      .date-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .date-item .label {
        font-weight: 600;
        color: #333;
        font-size: 0.8rem;
        text-transform: uppercase;
      }

      .date-item .value {
        color: #666;
        font-size: 0.95rem;
      }

      .app-reason {
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 0.25rem;
      }

      .app-reason strong {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
      }

      .app-reason p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      .app-meta {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #666;
      }

      .meta-item .icon {
        font-size: 1rem;
        display: flex;
        align-items: center;
      }

      .approval-workflow {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 0.25rem;
      }

      .workflow-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        opacity: 0.5;
        transition: opacity 0.3s ease;
      }

      .workflow-step.completed {
        opacity: 1;
        color: #27ae60;
      }

      .step-icon {
        font-size: 1.5rem;
      }

      .step-label {
        font-size: 0.75rem;
        text-align: center;
        color: #666;
      }

      .workflow-arrow {
        color: #ddd;
        font-weight: bold;
      }

      .app-footer {
        display: flex;
        gap: 0.75rem;
        padding: 1rem;
        border-top: 1px solid #e0e0e0;
      }

      .app-footer .btn {
        flex: 1;
      }

      .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
      }

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .applications-list {
          grid-template-columns: 1fr;
        }

        .date-range {
          grid-template-columns: 1fr;
        }

        .tabs {
          flex-wrap: wrap;
        }
      }
    `
  ]
})
export class LeaveComponent implements OnInit {
  applications: LeaveApplication[] = [];
  filteredApplications: LeaveApplication[] = [];
  selectedTab = 'all';
  students: any[] = [];

  constructor(
    private leaveService: LeaveService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.leaveService.getApplications().subscribe(apps => {
      this.applications = apps;
      this.filterApplications();
    });

    this.studentService.getStudents().subscribe(students => {
      this.students = students;
    });
  }

  filterApplications(): void {
    let filtered = this.applications;

    if (this.selectedTab === 'pending') {
      filtered = filtered.filter(app => this.isPending(app.status));
    } else if (this.selectedTab === 'approved') {
      filtered = filtered.filter(app => app.status === LeaveStatus.APPROVED);
    } else if (this.selectedTab === 'rejected') {
      filtered = filtered.filter(app => this.isRejected(app.status));
    }

    this.filteredApplications = filtered;
  }

  isPending(status: LeaveStatus): boolean {
    return status === LeaveStatus.WARDEN_PENDING || status === LeaveStatus.ADMIN_PENDING;
  }

  isRejected(status: LeaveStatus): boolean {
    return status === LeaveStatus.WARDEN_REJECTED || status === LeaveStatus.REJECTED;
  }

  isWaitingApproval(status: LeaveStatus): boolean {
    return (
      status === LeaveStatus.WARDEN_PENDING ||
      status === LeaveStatus.ADMIN_PENDING ||
      status === LeaveStatus.WARDEN_APPROVED
    );
  }

  isStepCompleted(step: string, status: LeaveStatus): boolean {
    if (step === 'warden') {
      return (
        status === LeaveStatus.WARDEN_APPROVED ||
        status === LeaveStatus.ADMIN_PENDING ||
        status === LeaveStatus.APPROVED
      );
    }
    return status === LeaveStatus.APPROVED;
  }

  getStudentName(studentId: string): string {
    return this.students.find(s => s.id === studentId)?.name || 'Unknown';
  }

  calculateDuration(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      draft: 'Draft',
      submitted: 'Submitted',
      warden_pending: 'Warden Pending',
      warden_approved: 'Warden Approved',
      warden_rejected: 'Warden Rejected',
      admin_pending: 'Admin Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  }

  getStatusCategory(status: string): string {
    if (status === LeaveStatus.APPROVED) return 'approved';
    if (this.isRejected(status as LeaveStatus)) return 'rejected';
    return 'pending';
  }

  formatLeaveType(type: string): string {
    const typeMap: { [key: string]: string } = {
      semester_break: 'Semester Break',
      emergency: 'Emergency',
      medical: 'Medical',
      festival: 'Festival',
      family_event: 'Family Event',
      other: 'Other'
    };
    return typeMap[type] || type;
  }
}
