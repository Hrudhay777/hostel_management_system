import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { BlockService } from '../../services/block.service';
import { Room, RoomStatus, HostelBlock } from '../../models/hostel.models';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rooms-container">
      <div class="page-header">
        <h1>Room Management</h1>
        <div class="header-actions">
          <input
            type="text"
            class="search-input"
            placeholder="Search rooms..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterRooms()"
          />
          <select class="filter-select" [(ngModel)]="selectedBlock" (ngModelChange)="filterRooms()">
            <option value="">All Blocks</option>
            <option *ngFor="let block of blocks" [value]="block.id">{{ block.name }}</option>
          </select>
        </div>
      </div>

      <div class="rooms-grid">
        <div class="room-card" *ngFor="let room of filteredRooms">
          <div class="room-card-header" [ngClass]="'status-' + room.status">
            <span class="room-number">{{ room.roomNumber }}</span>
            <span class="room-status-badge">{{ formatStatus(room.status) }}</span>
          </div>

          <div class="room-card-body">
            <div class="room-info">
              <p><strong>Block:</strong> {{ getBlockName(room.blockId) }}</p>
              <p><strong>Floor:</strong> {{ room.floor }}</p>
              <p><strong>Type:</strong> {{ formatRoomType(room.type) }}</p>
              <p><strong>Rent/Month:</strong> ₹{{ room.rentPerMonth }}</p>
            </div>

            <div class="room-capacity">
              <div class="capacity-label">Bed Capacity</div>
              <div class="capacity-bar">
                <div
                  class="capacity-fill"
                  [style.width.%]="(room.occupiedBeds / room.capacity) * 100"
                ></div>
              </div>
              <div class="capacity-text">
                {{ room.occupiedBeds }} / {{ room.capacity }} beds occupied
              </div>
            </div>

            <div class="room-amenities">
              <strong>Amenities:</strong>
              <div class="amenity-tags">
                <span class="amenity-tag" *ngFor="let amenity of room.amenities">
                  {{ amenity }}
                </span>
              </div>
            </div>

            <div class="room-beds">
              <strong>Beds:</strong>
              <div class="bed-list">
                <div
                  class="bed-item"
                  *ngFor="let bed of room.beds"
                  [ngClass]="'bed-' + bed.status"
                >
                  <span class="bed-number">Bed {{ bed.bedNumber }}</span>
                  <span class="bed-status">{{ formatBedStatus(bed.status) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="room-card-footer">
            <button class="btn btn-primary">View Details</button>
            <button class="btn btn-secondary" *ngIf="room.status !== 'occupied'">
              Edit
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredRooms.length === 0">
        <p>No rooms found</p>
      </div>
    </div>
  `,
  styles: [
    `
      .rooms-container {
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

      .header-actions {
        display: flex;
        gap: 1rem;
        flex: 1;
        min-width: 300px;
      }

      .search-input,
      .filter-select {
        padding: 0.75rem 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        flex: 1;
      }

      .search-input:focus,
      .filter-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .rooms-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .room-card {
        background: white;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
      }

      .room-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      }

      .room-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .room-card-header.status-occupied {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      .room-card-header.status-available {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      .room-card-header.status-maintenance {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }

      .room-number {
        font-size: 1.3rem;
        font-weight: bold;
      }

      .room-status-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
      }

      .room-card-body {
        flex: 1;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .room-info p {
        margin: 0.5rem 0;
        color: #666;
        font-size: 0.95rem;
      }

      .room-info p strong {
        color: #333;
      }

      .room-capacity {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .capacity-label {
        font-weight: 600;
        color: #333;
        font-size: 0.9rem;
      }

      .capacity-bar {
        width: 100%;
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
      }

      .capacity-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        transition: width 0.3s ease;
      }

      .capacity-text {
        font-size: 0.85rem;
        color: #666;
      }

      .room-amenities {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .room-amenities strong {
        font-size: 0.9rem;
        color: #333;
      }

      .amenity-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .amenity-tag {
        background: #f0f0f0;
        color: #666;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
      }

      .room-beds {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .room-beds strong {
        font-size: 0.9rem;
        color: #333;
      }

      .bed-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
      }

      .bed-item {
        padding: 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.85rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        text-align: center;
      }

      .bed-item.bed-occupied {
        background: #ffe0e0;
        color: #c0392b;
      }

      .bed-item.bed-available {
        background: #e0ffe0;
        color: #27ae60;
      }

      .bed-item.bed-reserved {
        background: #fff8e0;
        color: #f39c12;
      }

      .bed-number {
        font-weight: 600;
      }

      .bed-status {
        font-size: 0.75rem;
        opacity: 0.8;
      }

      .room-card-footer {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        border-top: 1px solid #e0e0e0;
      }

      .btn {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .btn-secondary {
        background: #f0f0f0;
        color: #333;
      }

      .btn-secondary:hover {
        background: #e0e0e0;
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
        }

        .header-actions {
          width: 100%;
          flex-direction: column;
        }

        .rooms-grid {
          grid-template-columns: 1fr;
        }

        .bed-list {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  blocks: HostelBlock[] = [];
  searchQuery = '';
  selectedBlock = '';

  constructor(
    private roomService: RoomService,
    private blockService: BlockService
  ) {}

  ngOnInit(): void {
    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
      this.filterRooms();
    });

    this.blockService.getBlocks().subscribe(blocks => {
      this.blocks = blocks;
    });
  }

  filterRooms(): void {
    this.filteredRooms = this.rooms.filter(room => {
      const matchesSearch = room.roomNumber
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesBlock = !this.selectedBlock || room.blockId === this.selectedBlock;
      return matchesSearch && matchesBlock;
    });
  }

  getBlockName(blockId: string): string {
    const block = this.blocks.find(b => b.id === blockId);
    return block?.name || 'Unknown';
  }

  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      occupied: 'Occupied',
      available: 'Available',
      maintenance: 'Maintenance',
      blocked: 'Blocked'
    };
    return statusMap[status] || status;
  }

  formatRoomType(type: string): string {
    const typeMap: { [key: string]: string } = {
      single: 'Single',
      double: 'Double',
      triple: 'Triple',
      quad: 'Quad'
    };
    return typeMap[type] || type;
  }

  formatBedStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      occupied: 'Occupied',
      available: 'Available',
      reserved: 'Reserved',
      maintenance: 'Maintenance'
    };
    return statusMap[status] || status;
  }
}
