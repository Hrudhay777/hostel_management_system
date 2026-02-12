import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../services/maintenance.service';
import { StudentService } from '../../services/student.service';
import { RoomService } from '../../services/room.service';
import { MaintenanceRequest, MaintenanceStatus, MaintenancePriority } from '../../models/hostel.models';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="maintenance-container">
      <div class="page-header">
        <h1>Maintenance Requests</h1>
        <button class="btn btn-primary">+ Report Issue</button>
      </div>

      <div class="filter-bar">
        <select class="filter-select" [(ngModel)]="selectedStatus" (ngModelChange)="filterRequests()">
          <option value="">All Status</option>
          <option value="reported">Reported</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select class="filter-select" [(ngModel)]="selectedPriority" (ngModelChange)="filterRequests()">
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div class="requests-grid">
        <div class="request-card" *ngFor="let request of filteredRequests" [ngClass]="'priority-' + request.priority">
          <div class="request-header">
            <div class="request-title">
              <h3>{{ request.description }}</h3>
              <p class="request-room">Room: {{ getRoomNumber(request.roomId) }}</p>
            </div>
            <span class="priority-badge" [ngClass]="'badge-' + request.priority">
              {{ formatPriority(request.priority) }}
            </span>
          </div>

          <div class="request-body">
            <div class="request-info">
              <div class="info-item">
                <span class="label">Category:</span>
                <span class="value">{{ formatCategory(request.category) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Status:</span>
                <span class="value" [ngClass]="'status-' + request.status">
                  {{ formatStatus(request.status) }}
                </span>
              </div>
              <div class="info-item">
                <span class="label">Reported:</span>
                <span class="value">{{ request.createdAt | date: 'dd MMM yyyy' }}</span>
              </div>
              <div class="info-item" *ngIf="request.assignedTo">
                <span class="label">Assigned To:</span>
                <span class="value">{{ request.assignedTo }}</span>
              </div>
            </div>

            <div class="request-timeline">
              <div class="timeline-item" [ngClass]="'status-' + request.status">
                <span class="timeline-dot"></span>
                <span class="timeline-text">{{ formatStatus(request.status) }}</span>
              </div>
            </div>

            <div class="request-notes" *ngIf="request.notes">
              <strong>Notes:</strong>
              <p>{{ request.notes }}</p>
            </div>
          </div>

          <div class="request-footer">
            <button class="btn btn-small btn-secondary">View Details</button>
            <button class="btn btn-small btn-primary" *ngIf="request.status !== 'completed'">
              Update Status
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredRequests.length === 0">
        <p>No maintenance requests found</p>
      </div>
    </div>
  `,
  styles: [
    `
      .maintenance-container {
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

      .filter-bar {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }

      .filter-select {
        padding: 0.75rem 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        font-size: 0.95rem;
        flex: 1;
        min-width: 150px;
      }

      .requests-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .request-card {
        background: white;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        border-left: 4px solid #667eea;
      }

      .request-card.priority-urgent {
        border-left-color: #ff6b6b;
      }

      .request-card.priority-high {
        border-left-color: #fa709a;
      }

      .request-card.priority-medium {
        border-left-color: #fee140;
      }

      .request-card.priority-low {
        border-left-color: #4facfe;
      }

      .request-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      }

      .request-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 1.5rem;
        background: #f9f9f9;
        border-bottom: 1px solid #e0e0e0;
      }

      .request-title h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .request-room {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      .priority-badge {
        padding: 0.35rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .badge-urgent {
        background: #ff6b6b;
        color: white;
      }

      .badge-high {
        background: #fa709a;
        color: white;
      }

      .badge-medium {
        background: #fee140;
        color: #333;
      }

      .badge-low {
        background: #4facfe;
        color: white;
      }

      .request-body {
        flex: 1;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .request-info {
        display: grid;
        gap: 0.75rem;
      }

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .info-item .label {
        font-weight: 600;
        color: #333;
        font-size: 0.9rem;
      }

      .info-item .value {
        color: #666;
        font-size: 0.9rem;
      }

      .status-reported {
        color: #666;
      }

      .status-acknowledged {
        color: #0284c7;
      }

      .status-in_progress {
        color: #f39c12;
      }

      .status-completed {
        color: #27ae60;
      }

      .request-timeline {
        padding: 1rem 0;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
      }

      .timeline-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .timeline-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #667eea;
      }

      .timeline-item.status-urgent .timeline-dot {
        background: #ff6b6b;
      }

      .timeline-text {
        color: #666;
        font-size: 0.95rem;
      }

      .request-notes {
        background: #f9f9f9;
        padding: 0.75rem;
        border-radius: 0.25rem;
      }

      .request-notes strong {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
      }

      .request-notes p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      .request-footer {
        display: flex;
        gap: 0.75rem;
        padding: 1rem;
        border-top: 1px solid #e0e0e0;
      }

      .request-footer .btn {
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

        .requests-grid {
          grid-template-columns: 1fr;
        }

        .filter-bar {
          flex-direction: column;
        }

        .filter-select {
          min-width: unset;
        }
      }
    `
  ]
})
export class MaintenanceComponent implements OnInit {
  requests: MaintenanceRequest[] = [];
  filteredRequests: MaintenanceRequest[] = [];
  selectedStatus = '';
  selectedPriority = '';
  rooms: any[] = [];

  constructor(
    private maintenanceService: MaintenanceService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.maintenanceService.getRequests().subscribe(requests => {
      this.requests = requests;
      this.filterRequests();
    });

    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
    });
  }

  filterRequests(): void {
    this.filteredRequests = this.requests.filter(request => {
      const matchesStatus = !this.selectedStatus || request.status === this.selectedStatus;
      const matchesPriority =
        !this.selectedPriority || request.priority === this.selectedPriority;
      return matchesStatus && matchesPriority;
    });
  }

  getRoomNumber(roomId: string): string {
    return this.rooms.find(r => r.id === roomId)?.roomNumber || 'Unknown';
  }

  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      reported: 'Reported',
      acknowledged: 'Acknowledged',
      in_progress: 'In Progress',
      on_hold: 'On Hold',
      completed: 'Completed',
      rejected: 'Rejected'
    };
    return statusMap[status] || status;
  }

  formatCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      plumbing: 'Plumbing',
      electrical: 'Electrical',
      furniture: 'Furniture',
      cleaning: 'Cleaning',
      painting: 'Painting',
      other: 'Other'
    };
    return categoryMap[category] || category;
  }

  formatPriority(priority: string): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }
}
