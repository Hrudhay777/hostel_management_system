import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockService } from '../../services/block.service';
import { RoomService } from '../../services/room.service';
import { StudentService } from '../../services/student.service';
import { AllocationService } from '../../services/allocation.service';
import { MaintenanceService } from '../../services/maintenance.service';
import { LeaveService } from '../../services/leave.service';
import { HostelBlock, DashboardStats } from '../../models/hostel.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Centurion University Boys Hostel 🏢</h1>
      </div>

      <div class="stats-grid">
        <div class="stat-card stat-card-primary">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <span class="stat-label">Total Students</span>
            <span class="stat-value">{{ stats.totalStudents }}</span>
          </div>
        </div>

        <div class="stat-card stat-card-success">
          <div class="stat-icon">🏢</div>
          <div class="stat-content">
            <span class="stat-label">Total Blocks</span>
            <span class="stat-value">{{ stats.totalBlocks }}</span>
          </div>
        </div>

        <div class="stat-card stat-card-warning">
          <div class="stat-icon">🛏️</div>
          <div class="stat-content">
            <span class="stat-label">Available Beds</span>
            <span class="stat-value">{{ stats.availableBeds }}</span>
          </div>
        </div>

        <div class="stat-card stat-card-danger">
          <div class="stat-icon">🔧</div>
          <div class="stat-content">
            <span class="stat-label">Pending Maintenance</span>
            <span class="stat-value">{{ stats.maintenanceRequestsPending }}</span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card blocks-card">
          <div class="card-header">
            <h2>Hostel Blocks</h2>
            <span class="badge">{{ blocks.length }} Total</span>
          </div>
          <div class="card-body">
            <div class="blocks-list">
              <div class="block-item" *ngFor="let block of blocks">
                <div class="block-info">
                  <h3>{{ block.name }}</h3>
                  <p class="block-location">📍 {{ block.location }}</p>
                  <p class="block-details">
                    {{ block.floors }} Floors • {{ block.totalRooms }} Rooms
                  </p>
                </div>
                <div class="block-capacity">
                  <div class="capacity-bar">
                    <div
                      class="capacity-fill"
                      [style.width.%]="
                        (block.occupiedBeds / block.totalBeds) * 100
                      "
                    ></div>
                  </div>
                  <span class="capacity-text">
                    {{ block.occupiedBeds }}/{{ block.totalBeds }} beds
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card pending-card">
          <div class="card-header">
            <h2>Pending Actions</h2>
            <span class="badge">{{ stats.leaveApplicationsPending }} Leave Apps</span>
          </div>
          <div class="card-body">
            <div class="pending-list">
              <div class="pending-item" *ngIf="stats.leaveApplicationsPending > 0">
                <div class="pending-icon">📋</div>
                <div class="pending-content">
                  <span class="pending-title">Leave Applications</span>
                  <span class="pending-count">{{ stats.leaveApplicationsPending }} pending</span>
                </div>
              </div>
              <div class="pending-item" *ngIf="stats.maintenanceRequestsPending > 0">
                <div class="pending-icon">🔧</div>
                <div class="pending-content">
                  <span class="pending-title">Maintenance Requests</span>
                  <span class="pending-count">{{ stats.maintenanceRequestsPending }} pending</span>
                </div>
              </div>
              <div class="pending-item" *ngIf="stats.maintenanceRequestsPending === 0 && stats.leaveApplicationsPending === 0">
                <p class="no-pending">✅ All caught up!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card full-width-card">
        <div class="card-header">
          <h2>Occupancy Summary</h2>
        </div>
        <div class="card-body">
          <div class="occupancy-grid">
            <div class="occupancy-item">
              <div class="occupancy-chart">
                <svg viewBox="0 0 100 100" class="circle-chart">
                  <circle cx="50" cy="50" r="45" class="circle-bg"></circle>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    class="circle-fill"
                    [style.strokeDashoffset]="
                      282.7 - (stats.occupiedBeds / stats.totalBeds) * 282.7
                    "
                  ></circle>
                </svg>
                <div class="occupancy-text">
                  <span class="occupancy-percentage">
                    {{ ((stats.occupiedBeds / stats.totalBeds) * 100).toFixed(0) }}%
                  </span>
                  <span class="occupancy-label">Occupied</span>
                </div>
              </div>
            </div>
            <div class="occupancy-item">
              <p>
                <strong>Total Beds:</strong> {{ stats.totalBeds }}<br />
                <strong>Occupied:</strong> {{ stats.occupiedBeds }}<br />
                <strong>Available:</strong> {{ stats.availableBeds }}<br />
                <strong>Occupancy Rate:</strong>
                {{ ((stats.occupiedBeds / stats.totalBeds) * 100).toFixed(1) }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
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

      .dashboard-header {
        margin-bottom: 2rem;
      }

      .dashboard-header h1 {
        font-size: 2.5rem;
        color: #333;
        margin: 0 0 0.5rem 0;
        background: linear-gradient(135deg, #8B2318 0%, #216642 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .dashboard-header p {
        color: #666;
        font-size: 1.1rem;
        margin: 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(135deg, #8B2318 0%, #216642 100%);
      }

      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      }

      .stat-card-primary::before {
        background: linear-gradient(135deg, #8B2318 0%, #C73E1D 100%);
      }

      .stat-card-success::before {
        background: linear-gradient(135deg, #216642 0%, #2E8B57 100%);
      }

      .stat-card-warning::before {
        background: linear-gradient(135deg, #DCB824 0%, #E8C547 100%);
      }

      .stat-card-danger::before {
        background: linear-gradient(135deg, #C73E1D 0%, #8B2318 100%);
      }

      .stat-icon {
        font-size: 2.5rem;
      }

      .stat-content {
        display: flex;
        flex-direction: column;
      }

      .stat-label {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 0.5rem;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: bold;
        color: #333;
      }

      .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .card {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .card:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e0e0e0;
        background: linear-gradient(135deg, #faf5f0 0%, #f0e8dd 100%);
      }

      .card-header h2 {
        margin: 0;
        color: #333;
        font-size: 1.3rem;
      }

      .badge {
        background: linear-gradient(135deg, #8B2318 0%, #216642 100%);
        color: white;
        padding: 0.35rem 0.75rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .card-body {
        padding: 1.5rem;
      }

      .blocks-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .block-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 0.5rem;
        border-left: 4px solid #8B2318;
        transition: all 0.3s ease;
      }

      .block-item:hover {
        background: #f0f0f0;
        transform: translateX(5px);
      }

      .block-info h3 {
        margin: 0 0 0.25rem 0;
        color: #333;
      }

      .block-location {
        color: #666;
        font-size: 0.9rem;
        margin: 0.25rem 0;
      }

      .block-details {
        color: #999;
        font-size: 0.85rem;
        margin: 0.25rem 0 0 0;
      }

      .block-capacity {
        flex: 1;
        margin-left: 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .capacity-bar {
        width: 150px;
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
      }

      .capacity-fill {
        height: 100%;
        background: linear-gradient(90deg, #8B2318 0%, #216642 100%);
        transition: width 0.3s ease;
      }

      .capacity-text {
        font-size: 0.85rem;
        color: #666;
      }

      .pending-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .pending-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 0.5rem;
        border-left: 4px solid #DCB824;
      }

      .pending-icon {
        font-size: 1.5rem;
      }

      .pending-content {
        display: flex;
        flex-direction: column;
      }

      .pending-title {
        font-weight: 600;
        color: #333;
      }

      .pending-count {
        font-size: 0.85rem;
        color: #666;
      }

      .no-pending {
        text-align: center;
        color: #666;
        margin: 0;
        padding: 1rem;
      }

      .full-width-card {
        margin-top: 2rem;
      }

      .occupancy-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }

      .occupancy-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .occupancy-chart {
        position: relative;
        width: 200px;
        height: 200px;
        margin-bottom: 1rem;
      }

      .circle-chart {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .circle-bg {
        fill: none;
        stroke: #e0e0e0;
        stroke-width: 8;
      }

      .circle-fill {
        fill: none;
        stroke: url(#grad);
        stroke-width: 8;
        stroke-linecap: round;
        stroke-dasharray: 282.7;
        transition: stroke-dashoffset 0.5s ease;
      }

      .occupancy-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }

      .occupancy-percentage {
        display: block;
        font-size: 2rem;
        font-weight: bold;
        color: #8B2318;
      }

      .occupancy-label {
        display: block;
        color: #666;
        font-size: 0.9rem;
      }

      .occupancy-item p {
        line-height: 1.8;
        color: #666;
      }

      .occupancy-item p strong {
        color: #333;
      }

      @media (max-width: 768px) {
        .dashboard-header h1 {
          font-size: 2rem;
        }

        .stats-grid {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          flex-direction: column;
          text-align: center;
        }

        .content-grid {
          grid-template-columns: 1fr;
        }

        .block-item {
          flex-direction: column;
          align-items: flex-start;
        }

        .block-capacity {
          margin-left: 0;
          width: 100%;
          margin-top: 1rem;
        }

        .occupancy-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class DashboardComponent implements OnInit {
  blocks: HostelBlock[] = [];
  stats: DashboardStats = {
    totalStudents: 0,
    totalBlocks: 0,
    totalRooms: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    maintenanceRequestsPending: 0,
    leaveApplicationsPending: 0
  };

  constructor(
    private blockService: BlockService,
    private roomService: RoomService,
    private studentService: StudentService,
    private allocationService: AllocationService,
    private maintenanceService: MaintenanceService,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load blocks
    this.blockService.getBlocks().subscribe(blocks => {
      this.blocks = blocks;
      this.stats.totalBlocks = blocks.length;
      this.stats.totalBeds = blocks.reduce((sum, b) => sum + b.totalBeds, 0);
      this.stats.occupiedBeds = blocks.reduce((sum, b) => sum + b.occupiedBeds, 0);
      this.stats.availableBeds = this.stats.totalBeds - this.stats.occupiedBeds;
    });

    // Load students count
    this.studentService.getStudents().subscribe(students => {
      this.stats.totalStudents = students.length;
    });

    // Load rooms count
    this.roomService.getRooms().subscribe(rooms => {
      this.stats.totalRooms = rooms.length;
    });

    // Load pending maintenance
    this.maintenanceService.getPendingRequests().subscribe(requests => {
      this.stats.maintenanceRequestsPending = requests.length;
    });

    // Load pending leave applications
    this.leaveService.getPendingApplications().subscribe(apps => {
      this.stats.leaveApplicationsPending = apps.length;
    });
  }
}
