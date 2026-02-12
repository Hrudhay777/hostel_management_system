import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AllocationService } from '../../services/allocation.service';
import { RoomService } from '../../services/room.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="student-dash">
      <h2>Your Room Details</h2>

      <!-- Not Logged In -->
      <div *ngIf="!userId">
        You are not logged in as a student.
      </div>

      <!-- Logged In -->
      <div *ngIf="userId">

        <!-- No Allocation -->
        <div *ngIf="allocations.length === 0">
          <p>
            No room allocated yet.
            Contact hostel superintendent:
            <strong>hostelmanagement@gmail.com</strong>
          </p>
        </div>

        <!-- Allocation Details -->
        <div *ngFor="let a of allocations" class="allocation-card">
          <h3>Room: {{ a.roomId }}</h3>
          <p><strong>Bed:</strong> {{ a.bedId }}</p>
          <p>
            <strong>Block:</strong> {{ a.blockId }}
            | <strong>Check-in:</strong> {{ a.checkInDate | date }}
          </p>
          <p><strong>Status:</strong> {{ a.status }}</p>

          <!-- Roommates -->
          <div class="room-mates" *ngIf="room && roommates.length">
            <h4>Roommates</h4>
            <ul>
              <li *ngFor="let mate of roommates">
                {{ mate.name }} ({{ mate.registrationNumber }})
              </li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="actions">
            <button (click)="raiseIssue(a)">
              Raise Maintenance Issue
            </button>

            <button (click)="applyLeave()">
              Apply for Leave
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .student-dash {
      padding: 1.5rem;
      max-width: 800px;
      margin: auto;
    }

    h2 {
      margin-bottom: 1rem;
      color: #8B2318;
    }

    .allocation-card {
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    }

    .room-mates ul {
      list-style: disc;
      margin-left: 1.25rem;
    }

    .actions {
      margin-top: 0.75rem;
      display: flex;
      gap: 0.5rem;
    }

    button {
      padding: 0.45rem 0.85rem;
      border-radius: 0.35rem;
      border: none;
      background: #8B2318;
      color: #fff;
      cursor: pointer;
      font-weight: 600;
    }

    button:hover {
      opacity: 0.9;
    }
    `
  ]
})
export class StudentDashboardComponent implements OnInit {

  allocations: any[] = [];
  room: any | null = null;
  roommates: any[] = [];
  userId: string | null = null;

  constructor(
    private auth: AuthService,
    private allocSvc: AllocationService,
    private roomSvc: RoomService,
    private studentSvc: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const user = this.auth.getCurrentUser();
    this.userId = user ? user.id || null : null;

    if (!this.userId) return;

    this.allocSvc.getAllocationsByStudent(this.userId)
      .subscribe(a => {

        this.allocations = a || [];

        if (this.allocations.length > 0) {

          const rId = this.allocations[0].roomId;

          this.roomSvc.getRoomById(rId)
            .subscribe(r => {

              this.room = r;

              if (this.room) {

                const mateIds = (this.room.beds || [])
                  .map((b: any) => b.studentId)
                  .filter((id: any) => id && id !== this.userId);

                if (mateIds.length > 0) {

                  this.studentSvc.getStudents()
                    .subscribe(list => {
                      this.roommates =
                        list.filter(s => mateIds.includes(s.id));
                    });
                }
              }
            });
        }
      });
  }

  raiseIssue(allocation: any) {
    this.router.navigate(['/maintenance']);
  }

  applyLeave() {
    this.router.navigate(['/leave']);
  }
}
