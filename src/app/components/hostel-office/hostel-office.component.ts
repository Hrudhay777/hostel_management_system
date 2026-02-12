import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockService } from '../../services/block.service';
import { RoomService } from '../../services/room.service';
import { StudentService } from '../../services/student.service';
import { HostelBlock, HostelOffice } from '../../models/hostel.models';

@Component({
  selector: 'app-hostel-office',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hostel-office-container">
      <!-- Header -->
      <div class="office-header">
        <h1>🏢 Hostel Office</h1>
        <p class="subtitle">Main administrative center for hostel operations and student services</p>
      </div>

      <!-- Office Information -->
      <div class="office-grid">
        <div class="office-card main-office" *ngIf="selectedBlock">
          <div class="office-header-card">
            <h2>{{ selectedBlock.name }} - Hostel Office</h2>
            <p class="location">📍 Ground Floor, Room G01</p>
          </div>

          <div class="office-details">
            <div class="detail-section">
              <h3>📋 Office In Charge</h3>
              <div class="officer-info">
                <div class="info-row">
                  <span class="label">Name:</span>
                  <span class="value">{{ selectedBlock.wardenName }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Designation:</span>
                  <span class="value">Hostel Warden</span>
                </div>
                <div class="info-row">
                  <span class="label">📞 Phone:</span>
                  <span class="value phone-link">{{ selectedBlock.wardenPhone }}</span>
                </div>
                <div class="info-row">
                  <span class="label">📧 Email:</span>
                  <span class="value email-link">{{ selectedBlock.wardenEmail }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>🕐 Office Hours</h3>
              <div class="hours-info">
                <div class="info-row">
                  <span class="label">Weekdays:</span>
                  <span class="value">9:00 AM - 6:00 PM</span>
                </div>
                <div class="info-row">
                  <span class="label">Weekends:</span>
                  <span class="value">10:00 AM - 2:00 PM</span>
                </div>
                <div class="info-row">
                  <span class="label">Emergency Support:</span>
                  <span class="value emergency">24/7 Available</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>🛠️ Services Provided</h3>
              <div class="services-list">
                <div class="service-item" *ngFor="let service of officeServices">
                  <span class="service-icon">✓</span>
                  <span class="service-name">{{ service }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hostel Statistics -->
        <div class="office-card stats-card">
          <h3>📊 Current Hostel Statistics</h3>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-number">{{ totalRooms }}</div>
              <div class="stat-label">Total Rooms</div>
              <div class="stat-subtext">Ground to 4th Floor</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ totalStudents }}</div>
              <div class="stat-label">Occupied Beds</div>
              <div class="stat-subtext">Current Allocation</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ availableBeds }}</div>
              <div class="stat-label">Available Beds</div>
              <div class="stat-subtext">Ready for Allocation</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ occupancyPercentage }}%</div>
              <div class="stat-label">Occupancy Rate</div>
              <div class="stat-subtext">Overall Filling</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floor-wise Room Distribution -->
      <div class="office-card floors-card">
        <h3>🏗️ Floor-wise Room Distribution</h3>
        <div class="floors-grid">
          <div class="floor-card" *ngFor="let floor of floorStats">
            <div class="floor-header">
              <h4>{{ floor.name }}</h4>
              <span class="room-count">{{ floor.roomCount }} Rooms</span>
            </div>
            <div class="floor-info">
              <div class="info-item">
                <span class="info-label">Room Numbers:</span>
                <span class="info-value">{{ floor.roomRange }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Beds:</span>
                <span class="info-value">{{ floor.totalBeds }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Occupied:</span>
                <span class="info-value occupied">{{ floor.occupiedBeds }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Available:</span>
                <span class="info-value available">{{ floor.availableBeds }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="floor.occupancyPercentage"></div>
              </div>
              <span class="occupancy-text">{{ floor.occupancyPercentage }}% Occupied</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Important Guidelines -->
      <div class="office-card guidelines-card">
        <h3>📌 Important Guidelines</h3>
        <div class="guidelines-list">
          <div class="guideline-item">
            <span class="icon">1️⃣</span>
            <div class="guideline-text">
              <h4>Room Allocation</h4>
              <p>Students should contact the hostel office for room allocation and room change requests.</p>
            </div>
          </div>
          <div class="guideline-item">
            <span class="icon">2️⃣</span>
            <div class="guideline-text">
              <h4>Maintenance Requests</h4>
              <p>Report any maintenance issues immediately to the office. Emergency repairs available 24/7.</p>
            </div>
          </div>
          <div class="guideline-item">
            <span class="icon">3️⃣</span>
            <div class="guideline-text">
              <h4>Leave Applications</h4>
              <p>Submit leave applications through the online system or directly at the office with proper documentation.</p>
            </div>
          </div>
          <div class="guideline-item">
            <span class="icon">4️⃣</span>
            <div class="guideline-text">
              <h4>Hostel Rules</h4>
              <p>Maintain discipline, keep rooms clean, and follow hostel rules. Violation may lead to penalties.</p>
            </div>
          </div>
          <div class="guideline-item">
            <span class="icon">5️⃣</span>
            <div class="guideline-text">
              <h4>Fee Payment</h4>
              <p>Pay hostel fees on time through the authorized channels. Late payment attracts penalty.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Contact -->
      <div class="office-card contact-card">
        <h3>📞 Quick Contact</h3>
        <div class="contact-grid">
          <a href="tel:+919876543210" class="contact-item">
            <span class="contact-icon">☎️</span>
            <div class="contact-info">
              <span class="contact-label">Call Warden</span>
              <span class="contact-value">+91-9876543210</span>
            </div>
          </a>
          <a href="mailto:warden.boys@centurion.edu.in" class="contact-item">
            <span class="contact-icon">📧</span>
            <div class="contact-info">
              <span class="contact-label">Email Office</span>
              <span class="contact-value">warden.boys@centurion.edu.in</span>
            </div>
          </a>
          <a href="tel:+919876543212" class="contact-item">
            <span class="contact-icon">🚨</span>
            <div class="contact-info">
              <span class="contact-label">Emergency Number</span>
              <span class="contact-value">+91-9876543212</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hostel-office-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }

    .office-header {
      text-align: center;
      margin-bottom: 3rem;
      animation: fadeIn 0.6s ease;
    }

    .office-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #666;
      margin: 0;
    }

    .office-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .office-card {
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border-top: 3px solid #667eea;
      transition: all 0.3s ease;
      animation: slideIn 0.5s ease;
    }

    .office-card:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-5px);
    }

    .office-header-card {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .office-header-card h2 {
      font-size: 1.5rem;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .location {
      color: #666;
      margin: 0;
      font-size: 0.95rem;
    }

    .detail-section {
      margin-bottom: 2rem;
    }

    .detail-section h3 {
      font-size: 1.2rem;
      color: #667eea;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .officer-info,
    .hours-info {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 0.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: #333;
    }

    .value {
      color: #666;
    }

    .phone-link,
    .email-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .emergency {
      color: #ff6b6b;
      font-weight: 600;
    }

    .services-list {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 0.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .service-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
    }

    .service-icon {
      color: #4facfe;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .service-name {
      color: #333;
      font-size: 0.95rem;
    }

    .main-office {
      grid-column: 1;
    }

    .stats-card {
      grid-column: 2;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .stat-item {
      text-align: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 0.5rem;
      color: white;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .stat-subtext {
      font-size: 0.85rem;
      opacity: 0.9;
    }

    .floors-card {
      margin-bottom: 2rem;
    }

    .floors-card h3 {
      font-size: 1.3rem;
      color: #667eea;
      margin-bottom: 1.5rem;
    }

    .floors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .floor-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
      border: 2px solid #e0e0e0;
      border-radius: 0.5rem;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .floor-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    .floor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #667eea;
    }

    .floor-header h4 {
      color: #667eea;
      margin: 0;
      font-size: 1.1rem;
    }

    .room-count {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .floor-info {
      display: grid;
      gap: 0.75rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      font-size: 0.95rem;
    }

    .info-label {
      color: #666;
      font-weight: 500;
    }

    .info-value {
      color: #333;
      font-weight: 600;
    }

    .info-value.occupied {
      color: #f5576c;
    }

    .info-value.available {
      color: #4facfe;
    }

    .progress-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin: 0.75rem 0;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
      transition: width 0.3s ease;
    }

    .occupancy-text {
      font-size: 0.85rem;
      color: #666;
      display: block;
      text-align: center;
    }

    .guidelines-card {
      margin-bottom: 2rem;
    }

    .guidelines-card h3 {
      font-size: 1.3rem;
      color: #667eea;
      margin-bottom: 1.5rem;
    }

    .guidelines-list {
      display: grid;
      gap: 1.5rem;
    }

    .guideline-item {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 0.5rem;
      border-left: 4px solid #667eea;
      transition: all 0.3s ease;
    }

    .guideline-item:hover {
      background: #f0f0f0;
      border-left-color: #764ba2;
    }

    .icon {
      font-size: 1.5rem;
      min-width: 2rem;
      text-align: center;
    }

    .guideline-text h4 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
    }

    .guideline-text p {
      color: #666;
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .contact-card {
      margin-bottom: 0;
    }

    .contact-card h3 {
      font-size: 1.3rem;
      color: #667eea;
      margin-bottom: 1.5rem;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 0.5rem;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .contact-item:hover {
      border-color: white;
      transform: translateY(-3px);
    }

    .contact-icon {
      font-size: 2rem;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .contact-label {
      font-size: 0.9rem;
      opacity: 0.9;
      font-weight: 600;
    }

    .contact-value {
      font-size: 1rem;
      font-weight: 600;
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

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 768px) {
      .hostel-office-container {
        padding: 1rem;
      }

      .office-grid {
        grid-template-columns: 1fr;
      }

      .main-office,
      .stats-card {
        grid-column: 1;
      }

      .stat-grid {
        grid-template-columns: 1fr;
      }

      .services-list {
        grid-template-columns: 1fr;
      }

      .floors-grid {
        grid-template-columns: 1fr;
      }

      .contact-grid {
        grid-template-columns: 1fr;
      }

      .office-header h1 {
        font-size: 1.8rem;
      }

      .detail-section h3 {
        font-size: 1rem;
      }
    }
  `]
})
export class HostelOfficeComponent implements OnInit {
  selectedBlock: HostelBlock | null = null;
  totalRooms = 0;
  totalStudents = 0;
  availableBeds = 0;
  occupancyPercentage = 0;

  floorStats = [
    {
      name: 'Ground Floor',
      roomRange: '101 - 116',
      roomCount: 16,
      totalBeds: 80,
      occupiedBeds: 0,
      availableBeds: 0,
      occupancyPercentage: 0
    },
    {
      name: 'First Floor',
      roomRange: '201 - 218',
      roomCount: 18,
      totalBeds: 90,
      occupiedBeds: 0,
      availableBeds: 0,
      occupancyPercentage: 0
    },
    {
      name: 'Second Floor',
      roomRange: '301 - 318',
      roomCount: 18,
      totalBeds: 90,
      occupiedBeds: 0,
      availableBeds: 0,
      occupancyPercentage: 0
    },
    {
      name: 'Third Floor',
      roomRange: '401 - 418',
      roomCount: 18,
      totalBeds: 90,
      occupiedBeds: 0,
      availableBeds: 0,
      occupancyPercentage: 0
    }
  ];

  officeServices = [
    'Room Allocation & Changes',
    'Student Registration',
    'Maintenance Request Submission',
    'Leave Application Processing',
    'Fee Collection & Receipt',
    'Hostel Rules & Regulations',
    'Student Grievance Redressal',
    'Emergency Support 24/7',
    'Visitor Management',
    'Room Inspection & Approval',
    'Check-in & Check-out',
    'Document Verification'
  ];

  constructor(
    private blockService: BlockService,
    private roomService: RoomService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadHostelData();
  }

  loadHostelData(): void {
    this.blockService.getBlocks().subscribe(blocks => {
      this.selectedBlock = blocks[0]; // Get Boys Hostel
    });

    this.roomService.getRooms().subscribe(rooms => {
      this.totalRooms = rooms.length;
      let totalOccupied = 0;
      let totalCapacity = 0;

      rooms.forEach(room => {
        totalCapacity += room.capacity;
        totalOccupied += room.occupiedBeds;
      });

      this.totalStudents = totalOccupied;
      this.availableBeds = totalCapacity - totalOccupied;
      this.occupancyPercentage = Math.round((totalOccupied / totalCapacity) * 100);

      // Update floor statistics
      this.updateFloorStats(rooms);
    });
  }

  updateFloorStats(rooms: any[]): void {
    this.floorStats.forEach((floor, index) => {
      const floorRooms = rooms.filter(r => r.floor === index);
      let occupied = 0;
      let capacity = 0;

      floorRooms.forEach(room => {
        capacity += room.capacity;
        occupied += room.occupiedBeds;
      });

      floor.occupiedBeds = occupied;
      floor.availableBeds = capacity - occupied;
      floor.occupancyPercentage = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;
    });
  }
}
