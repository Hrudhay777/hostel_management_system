import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HostelBlock } from '../models/hostel.models';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private blocks$ = new BehaviorSubject<HostelBlock[]>([]);
  private selectedBlock$ = new BehaviorSubject<HostelBlock | null>(null);

  constructor() {
    this.initializeBlocks();
  }

  private initializeBlocks(): void {
    const mockBlocks: HostelBlock[] = [
      {
        id: 'block-001',
        name: 'Boys Hostel',
        location: 'Vizianagaram Campus',
        university: 'Centurion University of Technology and Management',
        city: 'Vizianagaram, Andhra Pradesh',
        floors: 4,
        totalRooms: 68,
        totalBeds: 340,
        occupiedBeds: 238,
        wardenId: 'warden-001',
        wardenName: 'Mr Murthy',
        wardenPhone: '+91-9876543210',
        wardenEmail: 'warden.boys@centurion.edu.in',
        amenities: ['High-Speed WiFi', 'Common Room', 'Laundry Service', 'Dining Hall', 'Study Hall', 'Recreation Area', '24/7 Security', 'CCTV Surveillance'],
        builtYear: 2010,
        description: 'Dedicated boys hostel with modern facilities. All rooms have 5 beds with comfortable accommodation'
      }
    ];
    this.blocks$.next(mockBlocks);
  }

  getBlocks(): Observable<HostelBlock[]> {
    return this.blocks$.asObservable();
  }

  getBlockById(id: string): Observable<HostelBlock | undefined> {
    return new Observable(observer => {
      const block = this.blocks$.getValue().find(b => b.id === id);
      observer.next(block);
      observer.complete();
    });
  }

  selectBlock(block: HostelBlock): void {
    this.selectedBlock$.next(block);
  }

  getSelectedBlock(): Observable<HostelBlock | null> {
    return this.selectedBlock$.asObservable();
  }

  addBlock(block: HostelBlock): void {
    const blocks = this.blocks$.getValue();
    this.blocks$.next([...blocks, block]);
  }

  updateBlock(id: string, updatedBlock: Partial<HostelBlock>): void {
    const blocks = this.blocks$.getValue();
    const index = blocks.findIndex(b => b.id === id);
    if (index !== -1) {
      blocks[index] = { ...blocks[index], ...updatedBlock };
      this.blocks$.next([...blocks]);
    }
  }
}
