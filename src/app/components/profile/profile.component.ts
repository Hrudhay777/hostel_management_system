import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { AllocationService } from '../../services/allocation.service';
import { RoomService } from '../../services/room.service';
import { BlockService } from '../../services/block.service';
import { AuthService } from '../../services/auth.service';
import { Student, RoomAllocation, UserRole } from '../../models/hostel.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <!-- ADMIN PROFILE -->
      <div *ngIf="isAdmin">
        <div class="profile-header">
          <div class="profile-card-main admin-profile">
            <div class="avatar-section">
              <div class="avatar admin-avatar">HM</div>
              <div class="profile-info">
                <h1>{{ adminInfo.name }}</h1>
                <p class="role">Hostel Superintendent</p>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-content">
          <div class="card">
            <div class="card-header">
              <h2>Contact Information</h2>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Email:</span>
                  <span class="value">{{ adminInfo.email }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Phone:</span>
                  <span class="value">{{ adminInfo.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Office Location:</span>
                  <span class="value">{{ adminInfo.office }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Office Timing:</span>
                  <span class="value">{{ adminInfo.timing }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STUDENT PROFILE -->
      <div *ngIf="!isAdmin">
        <div class="profile-header">
          <div class="profile-card-main">
            <div class="avatar-section">
              <div class="avatar">SK</div>
              <div class="profile-info">
                <h1>{{ currentStudent?.name }}</h1>
                <p class="reg-no">{{ currentStudent?.registrationNumber }}</p>
                <p class="department">{{ currentStudent?.department }} - Semester {{ currentStudent?.semester }}</p>
              </div>
            </div>

            <div class="profile-stats">
              <div class="stat">
                <span class="stat-icon">🏢</span>
                <span class="stat-label">Current Block</span>
                <span class="stat-value">{{ currentBlock?.name || '-' }}</span>
              </div>
              <div class="stat">
                <span class="stat-icon">🛏️</span>
                <span class="stat-label">Current Room</span>
                <span class="stat-value">{{ currentRoom?.roomNumber || '-' }}</span>
              </div>
              <div class="stat">
                <span class="stat-icon">📅</span>
                <span class="stat-label">Check-in Date</span>
                <span class="stat-value">{{ currentAllocation?.checkInDate | date: 'dd MMM yyyy' }}</span>
              </div>
              <div class="stat">
                <span class="stat-icon">✅</span>
                <span class="stat-label">Status</span>
                <span class="stat-value">{{ currentStudent?.status | titlecase }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-content">
          <div class="card">
            <div class="card-header">
              <h2>Personal Information</h2>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Email:</span>
                  <span class="value">{{ currentStudent?.email }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Phone:</span>
                  <span class="value">{{ currentStudent?.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Date of Birth:</span>
                  <span class="value">{{ currentStudent?.dateOfBirth | date: 'dd MMM yyyy' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Address:</span>
                  <span class="value">{{ currentStudent?.address }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Parent Contact:</span>
                  <span class="value">{{ currentStudent?.parentContact }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2>Current Allocation Details</h2>
            </div>
            <div class="card-body">
              <div *ngIf="currentAllocation" class="allocation-details">
                <div class="detail-item">
                  <span class="label">Block:</span>
                  <span class="value">{{ currentBlock?.name }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Room:</span>
                  <span class="value">{{ currentRoom?.roomNumber }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Bed Number:</span>
                  <span class="value">{{ getCurrentBedNumber() }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Academic Year:</span>
                  <span class="value">{{ currentAllocation.academicYear }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Semester:</span>
                  <span class="value">{{ currentAllocation.semester }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Check-in Date:</span>
                  <span class="value">{{ currentAllocation.checkInDate | date: 'dd MMM yyyy, hh:mm a' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Allocation Status:</span>
                  <span class="value" [ngClass]="'status-' + currentAllocation.status">
                    {{ formatAllocationStatus(currentAllocation.status) }}
                  </span>
                </div>
              </div>
              <div *ngIf="!currentAllocation" class="no-allocation">
                <p>No current room allocation</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2>Contact Hostel Management</h2>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Name:</span>
                  <span class="value">{{ adminInfo.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:hostelmanagement@gmail.com">{{ adminInfo.email }}</a></span>
                </div>
                <div class="info-item">
                  <span class="label">Phone:</span>
                  <span class="value">{{ adminInfo.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Office Location:</span>
                  <span class="value">{{ adminInfo.office }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Office Timing:</span>
                  <span class="value">{{ adminInfo.timing }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2>Room Amenities</h2>
            </div>
            <div class="card-body">
              <div *ngIf="currentRoom?.amenities" class="amenities-list">
                <div class="amenity-item" *ngFor="let amenity of currentRoom.amenities">
                  <span class="amenity-icon">✓</span>
                  <span class="amenity-name">{{ amenity }}</span>
                </div>
              </div>
              <div *ngIf="!currentRoom?.amenities" class="empty-message">
                <p>No amenities information available</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div class="card-body">
              <div class="actions-grid">
                <button class="action-btn">
                  <span class="action-icon">📋</span>
                  <span class="action-label">Apply for Leave</span>
                </button>
                <button class="action-btn">
                  <span class="action-icon">🔧</span>
                  <span class="action-label">Report Maintenance</span>
                </button>
                <button class="action-btn">
                  <span class="action-icon">📝</span>
                  <span class="action-label">View Documents</span>
                </button>
                <button class="action-btn">
                  <span class="action-icon">💬</span>
                  <span class="action-label">Contact Warden</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
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

      .profile-header {
        margin-bottom: 2rem;
      }

      .profile-card-main {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .avatar-section {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: bold;
        flex-shrink: 0;
      }

      .avatar.admin-avatar {
        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
        color: #333;
      }

      .admin-profile .avatar-section {
        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
        color: #333;
      }

      .profile-info h1 {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
      }

      .profile-info p {
        margin: 0.25rem 0;
        opacity: 0.9;
      }

      .profile-info .role {
        font-size: 1rem;
        font-weight: 500;
      }

      .reg-no {
        font-size: 0.95rem;
      }

      .department {
        font-size: 0.9rem;
      }

      .profile-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0;
      }

      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
        border-right: 1px solid #e0e0e0;
        border-top: 1px solid #e0e0e0;
        text-align: center;
      }

      .stat:nth-child(4n) {
        border-right: none;
      }

      .stat-icon {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        display: block;
        color: #666;
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
      }

      .stat-value {
        display: block;
        color: #333;
        font-weight: 600;
        font-size: 0.95rem;
      }

      .profile-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1.5rem;
      }

      .card {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }

      .card-header {
        padding: 1.5rem;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-bottom: 1px solid #e0e0e0;
      }

      .card-header h2 {
        margin: 0;
        color: #333;
        font-size: 1.3rem;
      }

      .card-body {
        padding: 1.5rem;
      }

      .info-grid {
        display: grid;
        gap: 1rem;
      }

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .info-item:last-child {
        border-bottom: none;
      }

      .info-item .label {
        font-weight: 600;
        color: #333;
      }

      .info-item .value {
        color: #666;
      }

      .info-item a {
        color: #667eea;
        text-decoration: none;
      }

      .info-item a:hover {
        text-decoration: underline;
      }

      .allocation-details {
        display: grid;
        gap: 1rem;
      }

      .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #f9f9f9;
        border-radius: 0.25rem;
      }

      .detail-item .label {
        font-weight: 600;
        color: #333;
      }

      .detail-item .value {
        color: #666;
      }

      .status-checked_in {
        color: #27ae60;
        font-weight: 600;
      }

      .status-active {
        color: #f39c12;
        font-weight: 600;
      }

      .no-allocation,
      .empty-message {
        text-align: center;
        padding: 2rem;
        color: #666;
      }

      .amenities-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .amenity-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        background: #f9f9f9;
        border-radius: 0.25rem;
      }

      .amenity-icon {
        color: #27ae60;
        font-weight: bold;
      }

      .amenity-name {
        color: #333;
        font-size: 0.95rem;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
      }

      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.5rem;
        border: 2px solid #e0e0e0;
        background: white;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
      }

      .action-btn:hover {
        border-color: #667eea;
        background: #f9f9f9;
        transform: translateY(-2px);
      }

      .action-icon {
        font-size: 2rem;
      }

      .action-label {
        font-size: 0.85rem;
        color: #333;
        text-align: center;
      }

      @media (max-width: 768px) {
        .avatar-section {
          flex-direction: column;
          text-align: center;
        }

        .avatar {
          width: 100px;
          height: 100px;
          font-size: 2rem;
        }

        .profile-info h1 {
          font-size: 1.5rem;
        }

        .profile-stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .stat {
          border-right: 1px solid #e0e0e0;
        }

        .stat:nth-child(2n) {
          border-right: none;
        }

        .profile-content {
          grid-template-columns: 1fr;
        }

        .info-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .amenities-list {
          grid-template-columns: repeat(2, 1fr);
        }

        .actions-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `
  ]
})
export class ProfileComponent implements OnInit {
  isAdmin = false;
  adminInfo: any = {};

  currentStudent: Student | null = null;
  currentAllocation: RoomAllocation | null = null;
  currentBlock: any = null;
  currentRoom: any = null;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private allocationService: AllocationService,
    private roomService: RoomService,
    private blockService: BlockService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.adminInfo = this.authService.getHostelManagementInfo();

    if (user?.role === UserRole.ADMIN) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
      // For demo, use the first student
      this.studentService.getStudents().subscribe(students => {
        if (students.length > 0) {
          this.currentStudent = students[0];
          this.loadStudentDetails(students[0].id);
        }
      });
    }
  }

  private loadStudentDetails(studentId: string): void {
    // Load allocation
    this.allocationService.getAllocationsByStudent(studentId).subscribe(allocations => {
      const activeAllocation = allocations.find(
        a => a.status === 'checked_in' || a.status === 'active'
      );
      if (activeAllocation) {
        this.currentAllocation = activeAllocation;

        // Load room
        this.roomService.getRoomById(activeAllocation.roomId).subscribe(room => {
          this.currentRoom = room;
        });

        // Load block
        this.blockService.getBlockById(activeAllocation.blockId).subscribe(block => {
          this.currentBlock = block;
        });
      }
    });
  }

  getCurrentBedNumber(): string {
    if (this.currentAllocation?.bedId) {
      const parts = this.currentAllocation.bedId.split('-');
      return parts[parts.length - 1];
    }
    return '-';
  }

  formatAllocationStatus(status: string | undefined): string {
    const statusMap: { [key: string]: string } = {
      checked_in: 'Checked In',
      active: 'Active',
      allocated: 'Allocated',
      checked_out: 'Checked Out'
    };
    return statusMap[status || ''] || status || '-';
  }
}
