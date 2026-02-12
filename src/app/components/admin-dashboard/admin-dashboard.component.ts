import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { RoomService } from '../../services/room.service';
import { AllocationService } from '../../services/allocation.service';
import { ComplaintService } from '../../services/complaint.service';
import { Student } from '../../models/hostel.models';
import { Room, Bed, RoomType, RoomStatus, BedStatus } from '../../models/hostel.models';
import { RoomAllocation, AllocationStatus } from '../../models/hostel.models';
import { Complaint, ComplaintStatus, ComplaintType, ComplaintCategory, ComplaintPriority } from '../../models/hostel.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-dash">
      <div class="dashboard-header">
        <h1>Superintendent — Admin Panel</h1>
        <p class="subtitle">Manage Students, Rooms & Allocations</p>
      </div>

      <div class="dashboard-grid">
        <!-- Students Section -->
        <section class="card">
          <div class="card-header">
            <h2>👥 Students Management</h2>
          </div>
          <div class="card-content">
            <form (ngSubmit)="addStudent()" class="form-grid">
              <div class="form-section-title">Student Information</div>
              <div class="form-group">
                <label>Student Name *</label>
                <input [(ngModel)]="newStudent.name" name="name" placeholder="Enter student name" required />
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input [(ngModel)]="newStudent.email" name="email" placeholder="Enter email address" type="email" required />
              </div>
              <div class="form-group">
                <label>Phone *</label>
                <input [(ngModel)]="newStudent.phone" name="phone" placeholder="Enter phone number" />
              </div>
              <div class="form-group">
                <label>Registration No. *</label>
                <input [(ngModel)]="newStudent.registrationNumber" name="reg" placeholder="e.g., REG001" required />
              </div>
              <div class="form-group">
                <label>Department *</label>
                <input [(ngModel)]="newStudent.department" name="dept" placeholder="Enter department" required />
              </div>
              <div class="form-group">
                <label>Semester *</label>
                <input type="number" min="1" max="8" [(ngModel)]="newStudent.semester" name="semester" placeholder="1-8" />
              </div>
              <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" [(ngModel)]="newStudentDOB" name="dob" />
              </div>

              <div class="form-section-title" style="margin-top: 1.5rem;">Address Information</div>
              <div class="form-group">
                <label>Address</label>
                <input [(ngModel)]="newStudent.address" name="address" placeholder="Street address" />
              </div>
              <div class="form-group">
                <label>City</label>
                <input [(ngModel)]="newStudent.city" name="city" placeholder="City" />
              </div>
              <div class="form-group">
                <label>State</label>
                <input [(ngModel)]="newStudent.state" name="state" placeholder="State" />
              </div>
              <div class="form-group">
                <label>Zip Code</label>
                <input [(ngModel)]="newStudent.zipCode" name="zipCode" placeholder="Zip code" />
              </div>

              <div class="form-section-title" style="margin-top: 1.5rem;">Parent/Guardian Information</div>
              <div class="form-group">
                <label>Parent Name</label>
                <input [(ngModel)]="newStudent.parentName" name="parentName" placeholder="Enter parent name" />
              </div>
              <div class="form-group">
                <label>Parent Phone</label>
                <input [(ngModel)]="newStudent.parentPhone" name="parentPhone" placeholder="Enter parent phone" />
              </div>
              <div class="form-group">
                <label>Parent Email</label>
                <input [(ngModel)]="newStudent.parentEmail" name="parentEmail" placeholder="Enter parent email" type="email" />
              </div>
              <div class="form-group">
                <label>Parent Contact (Primary)</label>
                <input [(ngModel)]="newStudent.parentContact" name="parentContact" placeholder="Primary contact number" />
              </div>

              <div class="form-section-title" style="margin-top: 1.5rem;">Emergency Contact</div>
              <div class="form-group">
                <label>Emergency Contact Name</label>
                <input [(ngModel)]="newStudent.emergencyContact" name="emergencyContact" placeholder="Emergency contact person" />
              </div>
              <div class="form-group">
                <label>Emergency Contact Phone</label>
                <input [(ngModel)]="newStudent.emergencyPhone" name="emergencyPhone" placeholder="Emergency contact phone" />
              </div>

              <button type="submit" class="btn btn-primary" style="margin-top: 1.5rem;">+ Add Student</button>
            </form>

            <div class="section-divider"></div>

            <div class="list-section">
              <h3>Existing Students</h3>
              <div class="student-list">
                <div *ngIf="students.length === 0" class="empty-state">
                  <p>No students added yet</p>
                </div>
                <div *ngFor="let s of students" class="list-item">
                  <div *ngIf="editingStudentId !== s.id" class="item-content">
                    <div class="item-info">
                      <p class="item-title">{{ s.name }}</p>
                      <p class="item-meta">{{ s.registrationNumber }} • {{ s.department }} - Sem {{ s.semester }}</p>
                      <p class="item-meta" style="margin-top: 0.5rem; font-size: 0.85rem;">📧 {{ s.email }} | 📱 {{ s.phone }}</p>
                      <p class="item-meta" style="font-size: 0.85rem;">👤 Parent: {{ s.parentName || s.parentContact }} | 📞 {{ s.parentPhone }}</p>
                      <p class="item-meta" style="font-size: 0.85rem;">📍 {{ s.address }}{{ s.city ? ', ' + s.city : '' }}</p>
                      <p class="item-meta" style="font-size: 0.85rem;">🚨 Emergency: {{ s.emergencyContact || 'N/A' }} • {{ s.emergencyPhone || 'N/A' }}</p>
                    </div>
                    <div class="item-actions">
                      <button class="btn btn-sm btn-edit" (click)="startEditStudent(s)">Edit</button>
                      <button class="btn btn-sm btn-danger" (click)="deleteStudent(s.id)">Delete</button>
                    </div>
                  </div>
                  <div *ngIf="editingStudentId === s.id" class="edit-mode" style="flex-direction: column;">
                    <div class="form-grid">
                      <input [(ngModel)]="editingStudent.name" name="editName" placeholder="Name" />
                      <input [(ngModel)]="editingStudent.email" name="editEmail" placeholder="Email" />
                      <input [(ngModel)]="editingStudent.phone" name="editPhone" placeholder="Phone" />
                      <input [(ngModel)]="editingStudent.parentName" name="editParentName" placeholder="Parent Name" />
                      <input [(ngModel)]="editingStudent.parentPhone" name="editParentPhone" placeholder="Parent Phone" />
                      <input [(ngModel)]="editingStudent.address" name="editAddress" placeholder="Address" />
                    </div>
                    <div class="item-actions" style="margin-top: 0.75rem;">
                      <button class="btn btn-sm btn-success" (click)="saveStudent(s.id)">✓ Save</button>
                      <button class="btn btn-sm btn-secondary" (click)="cancelEditStudent()">✕ Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Rooms Section -->
        <section class="card">
          <div class="card-header">
            <h2>🏠 Rooms Management</h2>
          </div>
          <div class="card-content">
            <form (ngSubmit)="addRoom()" class="form-grid">
              <div class="form-group">
                <label>Block ID</label>
                <input [(ngModel)]="newRoom.blockId" name="blockId" placeholder="e.g., block-001" required />
              </div>
              <div class="form-group">
                <label>Room Number</label>
                <input [(ngModel)]="newRoom.roomNumber" name="roomNumber" placeholder="e.g., 101/201/301" required />
              </div>
              <div class="form-group">
                <label>Capacity (Beds)</label>
                <input type="number" min="1" max="5" [(ngModel)]="newRoom.capacity" name="capacity" placeholder="1-5" required />
              </div>
              <p class="form-help">💡 Floor auto-detected from room number</p>
              <button type="submit" class="btn btn-primary">+ Add Room</button>
            </form>

            <div class="section-divider"></div>

            <div class="list-section">
              <h3>Existing Rooms</h3>
              <div *ngFor="let f of floors" class="floor-group">
                <h4 class="floor-title">{{ getFloorLabel(f) }}</h4>
                <div class="rooms-list">
                  <div *ngIf="roomsForFloor(f).length === 0" class="empty-state">
                    <p>No rooms on this floor</p>
                  </div>
                  <div *ngFor="let r of roomsForFloor(f)" class="list-item">
                    <div *ngIf="editingRoomId !== r.id" class="item-content">
                      <div class="item-info">
                        <p class="item-title">Room {{ r.roomNumber }}</p>
                        <p class="item-meta">Capacity: {{ r.capacity }} • Available: {{ availableCount(r) }}</p>
                      </div>
                      <div class="item-actions">
                        <button class="btn btn-sm btn-edit" (click)="startEditRoom(r)">Edit</button>
                        <button class="btn btn-sm btn-danger" (click)="deleteRoom(r.id)">Delete</button>
                      </div>
                    </div>
                    <div *ngIf="editingRoomId === r.id" class="edit-mode">
                      <input [(ngModel)]="editingRoom.roomNumber" name="editRoomNumber" placeholder="Room #" />
                      <input type="number" min="1" max="5" [(ngModel)]="editingRoom.capacity" name="editCapacity" placeholder="Capacity" />
                      <button class="btn btn-sm btn-success" (click)="saveRoom(r.id)">✓ Save</button>
                      <button class="btn btn-sm btn-secondary" (click)="cancelEditRoom()">✕ Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Allocations Section -->
        <section class="card">
          <div class="card-header">
            <h2>📋 Room Allocations</h2>
          </div>
          <div class="card-content">
            <form (ngSubmit)="allocate()" class="form-grid">
              <div class="form-group">
                <label>Select Student</label>
                <select [(ngModel)]="alloc.studentId" name="studentId" required>
                  <option [value]="''">-- Choose a student --</option>
                  <option *ngFor="let s of students" [value]="s.id">{{ s.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Select Floor</label>
                <select [(ngModel)]="selectedFloor" name="selectedFloor" (change)="onFloorChange()">
                  <option [value]="null">-- Choose a floor --</option>
                  <option *ngFor="let f of floors" [value]="f">{{ getFloorLabel(f) }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Select Room</label>
                <select [(ngModel)]="selectedRoomId" name="selectedRoomId" (change)="onRoomChange()">
                  <option [value]="''">-- Choose a room --</option>
                  <option *ngFor="let r of filteredRooms" [value]="r.id">Room {{ r.roomNumber }} ({{ availableCount(r) }} free)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Select Bed</label>
                <select [(ngModel)]="selectedBedId" name="selectedBedId">
                  <option [value]="''">-- Choose a bed --</option>
                  <option *ngFor="let b of availableBeds" [value]="b.id">Bed {{ b.bedNumber }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">🔗 Allocate Room</button>
            </form>

            <div class="section-divider"></div>

            <div class="list-section">
              <h3>Active Allocations</h3>
              <div class="allocation-list">
                <div *ngIf="allocations.length === 0" class="empty-state">
                  <p>No allocations yet</p>
                </div>
                <div *ngFor="let a of allocations" class="list-item allocation-item">
                  <div class="item-info">
                    <p class="item-title">{{ getStudentName(a.studentId) }}</p>
                    <p class="item-meta">Room {{ getRoomNumber(a.roomId) }} • Bed {{ a.bedId }}</p>
                  </div>
                  <div class="item-actions">
                    <button class="btn btn-sm btn-danger" (click)="deleteAlloc(a.id)">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Complaints Section -->
        <section class="card">
          <div class="card-header">
            <h2>📢 Student Complaints & Requests</h2>
          </div>
          <div class="card-content">
            <form (ngSubmit)="addComplaint()" class="form-grid">
              <div class="form-group">
                <label>Select Student</label>
                <select [(ngModel)]="newComplaint.studentId" name="complaintStudent" required>
                  <option [value]="''">-- Choose a student --</option>
                  <option *ngFor="let s of students" [value]="s.id">{{ s.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Complaint Type</label>
                <select [(ngModel)]="newComplaint.type" name="complaintType" required>
                  <option [value]="''">-- Select type --</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="hygiene">Hygiene</option>
                  <option value="behavior">Behavior</option>
                  <option value="room_issue">Room Issue</option>
                  <option value="roommate">Roommate</option>
                  <option value="safety">Safety</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="newComplaint.category" name="complaintCategory" required>
                  <option [value]="''">-- Select category --</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="furniture">Furniture</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="noise">Noise</option>
                  <option value="security">Security</option>
                  <option value="food_quality">Food Quality</option>
                  <option value="common_area">Common Area</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Priority</label>
                <select [(ngModel)]="newComplaint.priority" name="complaintPriority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div class="form-group">
                <label>Title *</label>
                <input [(ngModel)]="newComplaint.title" name="title" placeholder="Brief title of complaint" required />
              </div>
              <div class="form-group">
                <label>Description *</label>
                <textarea [(ngModel)]="newComplaint.description" name="description" placeholder="Detailed description..." rows="4" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">+ Add Complaint (Admin)</button>
            </form>

            <div class="section-divider"></div>

            <div class="list-section">
              <h3>📝 Student Complaints - Admin Resolution Panel</h3>
              <p style="color: var(--text-muted); margin-bottom: 1rem;">Review and resolve complaints submitted by students</p>
              <div class="filter-buttons" style="margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-filter" [class.active]="complaintFilter === 'all'" (click)="complaintFilter = 'all'; filterComplaints()">All</button>
                <button class="btn btn-filter" [class.active]="complaintFilter === 'submitted'" (click)="complaintFilter = 'submitted'; filterComplaints()">Submitted</button>
                <button class="btn btn-filter" [class.active]="complaintFilter === 'under_review'" (click)="complaintFilter = 'under_review'; filterComplaints()">Under Review</button>
                <button class="btn btn-filter" [class.active]="complaintFilter === 'in_progress'" (click)="complaintFilter = 'in_progress'; filterComplaints()">In Progress</button>
                <button class="btn btn-filter" [class.active]="complaintFilter === 'resolved'" (click)="complaintFilter = 'resolved'; filterComplaints()">Resolved</button>
              </div>

              <div class="complaint-list">
                <div *ngIf="filteredComplaints.length === 0" class="empty-state">
                  <p>No complaints in this category</p>
                </div>
                <div *ngFor="let c of filteredComplaints" class="complaint-item" [ngClass]="'priority-' + c.priority">
                  <div class="complaint-header">
                    <div class="complaint-title">
                      <span class="complaint-badge" [ngClass]="'badge-' + c.priority">{{ c.priority.toUpperCase() }}</span>
                      <h4>{{ c.title }}</h4>
                    </div>
                    <span class="complaint-status" [ngClass]="'status-' + c.status">{{ c.status.replace('_', ' ').toUpperCase() }}</span>
                  </div>
                  <div class="complaint-info">
                    <p><strong>Student:</strong> {{ getStudentName(c.studentId) }}</p>
                    <p><strong>Type:</strong> {{ c.type | titlecase }} | <strong>Category:</strong> {{ c.category | titlecase }}</p>
                    <p><strong>Description:</strong> {{ c.description }}</p>
                    <p *ngIf="c.wardenRemarks" style="color: var(--primary-green);"><strong>Remarks:</strong> {{ c.wardenRemarks }}</p>
                    <p *ngIf="c.resolution" style="color: var(--success-color);"><strong>Resolution:</strong> {{ c.resolution }}</p>
                  </div>
                  <div class="complaint-actions">
                    <div class="action-group">
                      <select [(ngModel)]="complaintActionStatus[c.id]" name="status" (change)="updateComplaintStatus(c.id, complaintActionStatus[c.id])">
                        <option [value]="c.status">{{ c.status.replace('_', ' ') }}</option>
                        <option value="received">Received</option>
                        <option value="under_review">Under Review</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">✅ Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      
                      <div *ngIf="c.status !== 'resolved'" class="resolution-section">
                        <input type="text" [(ngModel)]="complaintResolution[c.id]" name="resolution" placeholder="Enter resolution details..." />
                        <button class="btn btn-sm btn-success" (click)="resolveComplaint(c.id)">Resolve Complaint</button>
                      </div>
                      
                      <input type="text" [(ngModel)]="complaintRemarks[c.id]" name="remarks" placeholder="Add remarks..." />
                      <button class="btn btn-sm btn-info" (click)="addComplaintRemarks(c.id)">Add Remarks</button>
                    </div>
                    <button class="btn btn-sm btn-danger" (click)="deleteComplaint(c.id)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
    .admin-dash {
      padding: 2rem;
      background: linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 100%);
      min-height: 100vh;
    }

    .dashboard-header {
      margin-bottom: 3rem;
      text-align: center;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      color: var(--primary-red);
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1.1rem;
      color: var(--text-light);
      font-weight: 400;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      background: linear-gradient(135deg, var(--primary-red) 0%, var(--primary-green) 100%);
      color: white;
      padding: 1.5rem;
      border-bottom: none;
    }

    .card-header h2 {
      font-size: 1.5rem;
      margin: 0;
      font-weight: 600;
    }

    .card-content {
      padding: 2rem;
    }

    .form-grid {
      display: grid;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text-dark);
    }

    .form-group input,
    .form-group select {
      padding: 0.75rem 1rem;
      border: 1.5px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.95rem;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--primary-red);
      box-shadow: 0 0 0 3px rgba(139, 35, 24, 0.1);
    }

    .form-help {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: 0;
      padding: 0;
    }

    .section-divider {
      border-top: 2px solid #f0f0f0;
      margin: 2rem 0;
    }

    .list-section h3 {
      font-size: 1.2rem;
      color: var(--text-dark);
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    .floor-title {
      font-size: 1rem;
      color: var(--primary-red);
      margin: 1.5rem 0 1rem 0;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }

    .student-list,
    .rooms-list,
    .allocation-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.2rem;
      background: #fafafa;
      border-radius: 8px;
      border-left: 4px solid var(--primary-red);
      transition: all 0.3s ease;
    }

    .list-item:hover {
      background: #f5f5f5;
      border-left-color: var(--primary-green);
    }

    .allocation-item {
      justify-content: space-between;
    }

    .item-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 1rem;
    }

    .item-info {
      flex: 1;
    }

    .item-title {
      font-weight: 600;
      color: var(--text-dark);
      margin: 0;
      font-size: 1rem;
    }

    .item-meta {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0.25rem 0 0 0;
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
    }

    .edit-mode {
      display: flex;
      gap: 0.75rem;
      width: 100%;
      align-items: center;
    }

    .edit-mode input {
      flex: 1;
      padding: 0.6rem;
      border: 1.5px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .empty-state {
      text-align: center;
      padding: 2rem 1rem;
      color: var(--text-muted);
    }

    .empty-state p {
      margin: 0;
      font-size: 1rem;
    }

    /* Button Styles */
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.85rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary-red) 0%, var(--primary-green) 100%);
      color: white;
      width: 100%;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 35, 24, 0.3);
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
      width: auto;
    }

    .btn-edit {
      background: var(--primary-green);
      color: white;
    }

    .btn-edit:hover {
      background: var(--primary-green-light);
    }

    .btn-success {
      background: #4caf50;
      color: white;
    }

    .btn-success:hover {
      background: #45a049;
    }

    .btn-danger {
      background: #f44336;
      color: white;
    }

    .btn-danger:hover {
      background: #da190b;
    }

    .btn-secondary {
      background: #95959;
      color: white;
    }

    .btn-secondary:hover {
      background: #757575;
    }

    @media (max-width: 1200px) {
      .dashboard-grid {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .admin-dash {
        padding: 1rem;
      }

      .dashboard-header h1 {
        font-size: 1.8rem;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-grid {
        display: flex;
        flex-direction: column;
      }

      .item-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .item-actions {
        width: 100%;
        margin-top: 0.75rem;
      }
    }

    /* Form Section Title */
    .form-section-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary-red);
      margin: 1rem 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--primary-red);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Textarea Styling */
    textarea {
      font-family: inherit;
      padding: 0.75rem 1rem;
      border: 1.5px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.95rem;
      resize: vertical;
      transition: all 0.3s ease;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary-red);
      box-shadow: 0 0 0 3px rgba(139, 35, 24, 0.1);
    }

    /* Complaint Styling */
    .complaint-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .complaint-item {
      background: white;
      border: 2px solid #e0e0e0;
      border-left: 5px solid #ffc107;
      border-radius: 8px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .complaint-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .complaint-item.priority-urgent {
      border-left-color: #f44336;
      background: #fff5f5;
    }

    .complaint-item.priority-high {
      border-left-color: #ff9800;
      background: #fff8f0;
    }

    .complaint-item.priority-medium {
      border-left-color: #ffc107;
      background: #fffbf0;
    }

    .complaint-item.priority-low {
      border-left-color: #4caf50;
      background: #f1f8f5;
    }

    .complaint-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .complaint-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .complaint-title h4 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--text-dark);
    }

    .complaint-badge {
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .complaint-badge.badge-urgent {
      background: #f44336;
      color: white;
    }

    .complaint-badge.badge-high {
      background: #ff9800;
      color: white;
    }

    .complaint-badge.badge-medium {
      background: #ffc107;
      color: #333;
    }

    .complaint-badge.badge-low {
      background: #4caf50;
      color: white;
    }

    .complaint-status {
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .complaint-status.status-submitted,
    .complaint-status.status-received {
      background: #bbdefb;
      color: #0d47a1;
    }

    .complaint-status.status-under_review {
      background: #fff9c4;
      color: #f57f17;
    }

    .complaint-status.status-in_progress {
      background: #ffe0b2;
      color: #e65100;
    }

    .complaint-status.status-resolved {
      background: #c8e6c9;
      color: #1b5e20;
    }

    .complaint-status.status-closed {
      background: #e0e0e0;
      color: #424242;
    }

    .complaint-info {
      margin-bottom: 1rem;
    }

    .complaint-info p {
      margin: 0.5rem 0;
      font-size: 0.95rem;
      color: var(--text-dark);
      line-height: 1.5;
    }

    .complaint-actions {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .action-group {
      flex: 1;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .action-group select,
    .action-group input {
      padding: 0.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 0.85rem;
      flex: 1;
    }

    .filter-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .btn-filter {
      padding: 0.5rem 1rem;
      background: #f0f0f0;
      color: var(--text-dark);
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-filter:hover {
      background: #e0e0e0;
    }

    .btn-filter.active {
      background: var(--primary-red);
      color: white;
      border-color: var(--primary-red);
    }

    .form-grid {
      display: grid;
      gap: 1rem;
    }

    @media (min-width: 769px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .complaint-actions {
        flex-wrap: wrap;
      }

      .action-group {
        width: 100%;
      }
    }

    /* Resolution Section Styles */
    .resolution-section {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-top: 0.5rem;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .resolution-section input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    .btn-info {
      background: #2196f3;
      color: white;
    }

    .btn-info:hover {
      background: #1976d2;
    }
    `
  ]
})
export class AdminDashboardComponent implements OnInit {
  students: Student[] = [];
  rooms: Room[] = [];
  allocations: RoomAllocation[] = [];
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];

  newStudent: Partial<Student> = {
    name: '',
    email: '',
    phone: '',
    registrationNumber: '',
    department: '',
    semester: 1,
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentContact: '',
    emergencyContact: '',
    emergencyPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  };
  newStudentDOB: string = '';

  newRoom: Partial<Room> = { blockId: 'block-001', roomNumber: '', floor: 0, capacity: 5 };
  alloc: Partial<RoomAllocation> = { studentId: '', roomId: '' };

  newComplaint: Partial<Complaint> = {
    studentId: '',
    type: ComplaintType.MAINTENANCE,
    category: ComplaintCategory.PLUMBING,
    priority: ComplaintPriority.MEDIUM,
    title: '',
    description: '',
    status: ComplaintStatus.SUBMITTED
  };

  // complaint management
  complaintFilter: string = 'all';
  complaintActionStatus: { [key: string]: string } = {};
  complaintRemarks: { [key: string]: string } = {};
  complaintResolution: { [key: string]: string } = {};

  // editing state
  editingStudentId: string | null = null;
  editingStudent: Partial<Student> = {};

  editingRoomId: string | null = null;
  editingRoom: Partial<Room> = {};

  // allocation selectors and helpers
  floors = [0, 1, 2, 3];  // Ground Floor (0), First (1), Second (2), Third (3)
  selectedFloor: number | null = null;
  filteredRooms: Room[] = [];
  selectedRoomId = '';
  availableBeds: Bed[] = [];
  selectedBedId = '';

  constructor(
    private studentSvc: StudentService,
    private roomSvc: RoomService,
    private allocSvc: AllocationService,
    private complaintSvc: ComplaintService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.studentSvc.getStudents().subscribe(s => (this.students = s || []));
    this.roomSvc.getRooms().subscribe(r => (this.rooms = r || []));
    this.allocSvc.getAllocations().subscribe(a => (this.allocations = a || []));
    this.complaintSvc.getComplaints().subscribe(c => {
      this.complaints = c || [];
      this.filterComplaints();
    });
  }

  addStudent() {
    const id = `std-${Date.now()}`;
    const dob = this.newStudentDOB ? new Date(this.newStudentDOB) : new Date();
    const student: Student = {
      id,
      name: this.newStudent.name || 'Unnamed',
      email: this.newStudent.email || '',
      phone: this.newStudent.phone || '',
      registrationNumber: this.newStudent.registrationNumber || '',
      department: this.newStudent.department || '',
      semester: this.newStudent.semester || 1,
      parentName: this.newStudent.parentName || '',
      parentPhone: this.newStudent.parentPhone || '',
      parentEmail: this.newStudent.parentEmail || '',
      parentContact: this.newStudent.parentContact || '',
      emergencyContact: this.newStudent.emergencyContact || '',
      emergencyPhone: this.newStudent.emergencyPhone || '',
      dateOfBirth: dob,
      address: this.newStudent.address || '',
      city: this.newStudent.city || '',
      state: this.newStudent.state || '',
      zipCode: this.newStudent.zipCode || '',
      avatar: undefined,
      documents: [],
      status: 'active' as any
    };
    this.studentSvc.addStudent(student).subscribe(() => {
      this.refresh();
      this.newStudent = {
        name: '',
        email: '',
        phone: '',
        registrationNumber: '',
        department: '',
        semester: 1,
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        parentContact: '',
        emergencyContact: '',
        emergencyPhone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      };
      this.newStudentDOB = '';
    });
  }

  startEditStudent(s: Student) {
    this.editingStudentId = s.id;
    this.editingStudent = { ...s };
  }

  saveStudent(id: string) {
    this.studentSvc.updateStudent(id, this.editingStudent as Partial<Student>).subscribe(() => {
      this.editingStudentId = null;
      this.editingStudent = {};
      this.refresh();
    });
  }

  cancelEditStudent() {
    this.editingStudentId = null;
    this.editingStudent = {};
  }

  deleteStudent(id: string) {
    this.studentSvc.removeStudent(id).subscribe(() => {
      this.refresh();
    });
  }

  addRoom() {
    const id = `room-${Date.now()}`;
    const roomNum = this.newRoom.roomNumber || '000';
    // Auto-detect floor from room number: 1xx→Floor 0 (Ground), 2xx→Floor 1, 3xx→Floor 2, 4xx→Floor 3
    const firstDigit = parseInt(roomNum.charAt(0));
    let floor = (firstDigit >= 1 && firstDigit <= 4) ? (firstDigit - 1) : 0;
    let capacity = Math.min(5, Math.max(1, Number(this.newRoom.capacity) || 5));
    const beds: Bed[] = [];
    for (let i = 1; i <= capacity; i++) {
      beds.push({ id: `${id}-bed-${i}`, bedNumber: i, status: BedStatus.AVAILABLE, studentId: undefined });
    }
    const room: Room = {
      id,
      blockId: this.newRoom.blockId || 'block-001',
      roomNumber: roomNum,
      floor,
      type: RoomType.QUINTUPLE,
      capacity,
      occupiedBeds: 0,
      beds,
      amenities: ['Fan', 'Light'],
      rentPerMonth: 0,
      status: RoomStatus.AVAILABLE
    };
    this.roomSvc.addRoom(room).subscribe(() => {
      this.newRoom = { blockId: 'block-001', roomNumber: '', floor: 0, capacity: 5 };
      this.refresh();
    });
  }

  // helpers for allocation selectors
  onFloorChange() {
    if (!this.selectedFloor) {
      this.filteredRooms = [];
      return;
    }
    this.filteredRooms = (this.rooms || []).filter(r => r.floor === Number(this.selectedFloor));
    this.selectedRoomId = '';
    this.availableBeds = [];
    this.selectedBedId = '';
  }

  onRoomChange() {
    if (!this.selectedRoomId) {
      this.availableBeds = [];
      this.selectedBedId = '';
      return;
    }
    const room = this.rooms.find(r => r.id === this.selectedRoomId);
    if (!room) {
      this.availableBeds = [];
      this.selectedBedId = '';
      return;
    }
    this.availableBeds = (room.beds || []).filter(b => !b.studentId);
    this.selectedBedId = this.availableBeds.length ? this.availableBeds[0].id : '';
  }

  availableCount(room: Room) {
    return (room.beds || []).filter(b => !b.studentId).length;
  }

  roomsForFloor(f: number): Room[] {
    return (this.rooms || []).filter(r => r.floor === f);
  }

  getFloorLabel(floor: number): string {
    const labels: { [key: number]: string } = {
      0: 'Ground Floor',
      1: 'First Floor',
      2: 'Second Floor',
      3: 'Third Floor'
    };
    return labels[floor] || `Floor ${floor}`;
  }

  getStudentName(studentId: string): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? student.name : studentId;
  }

  getRoomNumber(roomId: string): string {
    const room = this.rooms.find(r => r.id === roomId);
    return room ? room.roomNumber : roomId;
  }

  startEditRoom(r: Room) {
    this.editingRoomId = r.id;
    this.editingRoom = { ...r };
  }

  saveRoom(id: string) {
    this.roomSvc.updateRoom(id, this.editingRoom as Partial<Room>).subscribe(() => {
      this.editingRoomId = null;
      this.editingRoom = {};
      this.refresh();
    });
  }

  cancelEditRoom() {
    this.editingRoomId = null;
    this.editingRoom = {};
  }

  deleteRoom(id: string) {
    this.roomSvc.removeRoom(id).subscribe(() => {
      this.refresh();
    });
  }

  allocate() {
    // require student, floor, room and bed selection
    if (!this.alloc.studentId || !this.selectedFloor || !this.selectedRoomId || !this.selectedBedId) return;
    this.roomSvc.getRoomById(this.selectedRoomId as string).subscribe(room => {
      if (!room) return;
      const bed = (room.beds || []).find(b => b.id === this.selectedBedId && !b.studentId);
      if (!bed) return;

      const allocation: RoomAllocation = {
        id: `alloc-${Date.now()}`,
        studentId: this.alloc.studentId as string,
        roomId: room.id,
        bedId: bed.id,
        blockId: room.blockId,
        checkInDate: new Date(),
        academicYear: '2025-2026',
        semester: 1,
        status: AllocationStatus.ACTIVE,
        allocationDate: new Date(),
        allocatedBy: 'superintendent'
      };

      // mark bed as occupied
      this.roomSvc.updateRoom(room.id, {
        beds: room.beds.map(b => (b.id === bed.id ? { ...b, studentId: allocation.studentId, status: BedStatus.OCCUPIED } : b)),
        occupiedBeds: (room.occupiedBeds || 0) + 1,
        status: RoomStatus.OCCUPIED
      }).subscribe(() => {
        this.allocSvc.addAllocation(allocation).subscribe(() => {
          this.alloc = { studentId: '' };
          this.selectedFloor = null;
          this.selectedRoomId = '';
          this.availableBeds = [];
          this.selectedBedId = '';
          this.refresh();
        });
      });
    });
  }

  deleteAlloc(id: string) {
    this.allocSvc.removeAllocation(id).subscribe(() => {
      this.refresh();
    });
  }

  // Complaint Management Methods
  addComplaint() {
    if (!this.newComplaint.studentId || !this.newComplaint.title || !this.newComplaint.description) {
      alert('Please fill all required fields');
      return;
    }

    const complaint: Complaint = {
      id: `complaint-${Date.now()}`,
      studentId: this.newComplaint.studentId as string,
      studentName: this.getStudentName(this.newComplaint.studentId as string),
      roomId: undefined,
      blockId: undefined,
      type: this.newComplaint.type as any,
      category: this.newComplaint.category as any,
      title: this.newComplaint.title,
      description: this.newComplaint.description,
      priority: this.newComplaint.priority as any,
      status: 'submitted' as any,
      createdAt: new Date(),
      attachments: undefined
    };

    this.complaintSvc.addComplaint(complaint);
    this.newComplaint = {
      studentId: '',
      type: ComplaintType.MAINTENANCE,
      category: ComplaintCategory.PLUMBING,
      priority: ComplaintPriority.MEDIUM,
      title: '',
      description: '',
      status: ComplaintStatus.SUBMITTED
    };
    this.refresh();
  }

  filterComplaints() {
    if (this.complaintFilter === 'all') {
      this.filteredComplaints = this.complaints;
    } else {
      this.filteredComplaints = this.complaints.filter(c => c.status === this.complaintFilter);
    }
  }

  updateComplaintStatus(complaintId: string, newStatus: string) {
    if (newStatus && newStatus !== '') {
      this.complaintSvc.updateComplaint(complaintId, { status: newStatus as any });
      this.refresh();
    }
  }

  addComplaintRemarks(complaintId: string) {
    const remarks = this.complaintRemarks[complaintId];
    if (remarks && remarks.trim()) {
      this.complaintSvc.updateComplaint(complaintId, { wardenRemarks: remarks });
      this.complaintRemarks[complaintId] = '';
      this.refresh();
    }
  }
  
  resolveComplaint(complaintId: string) {
    const resolution = this.complaintResolution[complaintId];
    if (resolution && resolution.trim()) {
      this.complaintSvc.resolveComplaint(complaintId, resolution);
      this.complaintResolution[complaintId] = '';
      this.refresh();
      alert('Complaint resolved successfully!');
    } else {
      alert('Please enter resolution details');
    }
  }

  deleteComplaint(complaintId: string) {
    if (confirm('Are you sure you want to delete this complaint?')) {
      this.complaintSvc.removeComplaint(complaintId);
      this.refresh();
    }
  }
}
