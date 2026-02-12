import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllocationService } from '../../services/allocation.service';
import { StudentService } from '../../services/student.service';
import { RoomService } from '../../services/room.service';
import { BlockService } from '../../services/block.service';
import { RoomAllocation, Student, Room, HostelBlock } from '../../models/hostel.models';

@Component({
  selector: 'app-allocations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="allocations-container">
      <div class="page-header">
        <h1>Room Allocations</h1>
        <button class="btn btn-primary">+ New Allocation</button>
      </div>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-number">{{ allocations.length }}</span>
          <span class="stat-label">Total Allocations</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ activeAllocations }}</span>
          <span class="stat-label">Active</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ completedAllocations }}</span>
          <span class="stat-label">Completed</span>
        </div>
      </div>

      <div class="table-container">
        <table class="allocations-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Registration No.</th>
              <th>Block</th>
              <th>Room</th>
              <th>Bed</th>
              <th>Status</th>
              <th>Check-in Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let alloc of allocations" [ngClass]="'status-' + alloc.status">
              <td class="student-name">{{ getStudentName(alloc.studentId) }}</td>
              <td>{{ getStudentRegNo(alloc.studentId) }}</td>
              <td>{{ getBlockName(alloc.blockId) }}</td>
              <td>{{ getRoomNumber(alloc.roomId) }}</td>
              <td>Bed {{ getBedNumber(alloc.bedId) }}</td>
              <td>
                <span class="status-badge" [ngClass]="'badge-' + alloc.status">
                  {{ formatStatus(alloc.status) }}
                </span>
              </td>
              <td>{{ alloc.checkInDate | date: 'dd MMM yyyy' }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon">👁️</button>
                  <button class="btn-icon">✏️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .allocations-container {
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
        flex-wrap: wrap;
        gap: 1rem;
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

      .stats-bar {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .stat-item {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        text-align: center;
        border-top: 3px solid #667eea;
      }

      .stat-number {
        display: block;
        font-size: 2rem;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        display: block;
        color: #666;
        font-size: 0.9rem;
      }

      .table-container {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        overflow-x: auto;
      }

      .allocations-table {
        width: 100%;
        border-collapse: collapse;
      }

      .allocations-table thead {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      }

      .allocations-table th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #333;
        border-bottom: 2px solid #e0e0e0;
      }

      .allocations-table td {
        padding: 1rem;
        border-bottom: 1px solid #e0e0e0;
        color: #666;
      }

      .allocations-table tbody tr {
        transition: all 0.3s ease;
      }

      .allocations-table tbody tr:hover {
        background: #f9f9f9;
      }

      .student-name {
        font-weight: 600;
        color: #333;
      }

      .status-badge {
        display: inline-block;
        padding: 0.35rem 0.75rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .badge-checked_in {
        background: #e0ffe0;
        color: #27ae60;
      }

      .badge-allocated {
        background: #e0f2fe;
        color: #0284c7;
      }

      .badge-active {
        background: #fff8e0;
        color: #f39c12;
      }

      .badge-checked_out {
        background: #f0f0f0;
        color: #666;
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
      }

      .btn-icon {
        padding: 0.4rem 0.6rem;
        border: none;
        background: #f0f0f0;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
      }

      .btn-icon:hover {
        background: #667eea;
      }

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .allocations-table {
          font-size: 0.85rem;
        }

        .allocations-table th,
        .allocations-table td {
          padding: 0.75rem 0.5rem;
        }
      }
    `
  ]
})
export class AllocationsComponent implements OnInit {
  allocations: RoomAllocation[] = [];
  students: Student[] = [];
  rooms: Room[] = [];
  blocks: HostelBlock[] = [];
  activeAllocations = 0;
  completedAllocations = 0;

  constructor(
    private allocationService: AllocationService,
    private studentService: StudentService,
    private roomService: RoomService,
    private blockService: BlockService
  ) {}

  ngOnInit(): void {
    this.allocationService.getAllocations().subscribe(allocations => {
      this.allocations = allocations;
      this.activeAllocations = allocations.filter(
        a => a.status === 'checked_in' || a.status === 'active'
      ).length;
      this.completedAllocations = allocations.filter(a => a.status === 'checked_out').length;
    });

    this.studentService.getStudents().subscribe(students => {
      this.students = students;
    });

    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
    });

    this.blockService.getBlocks().subscribe(blocks => {
      this.blocks = blocks;
    });
  }

  getStudentName(studentId: string): string {
    return this.students.find(s => s.id === studentId)?.name || 'Unknown';
  }

  getStudentRegNo(studentId: string): string {
    return this.students.find(s => s.id === studentId)?.registrationNumber || '-';
  }

  getBlockName(blockId: string): string {
    return this.blocks.find(b => b.id === blockId)?.name || 'Unknown';
  }

  getRoomNumber(roomId: string): string {
    return this.rooms.find(r => r.id === roomId)?.roomNumber || '-';
  }

  getBedNumber(bedId: string): string {
    return bedId.split('-')[2] || '-';
  }

  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      checked_in: 'Checked In',
      allocated: 'Allocated',
      active: 'Active',
      checked_out: 'Checked Out'
    };
    return statusMap[status] || status;
  }
}
