import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Room, RoomType, RoomStatus } from '../models/hostel.models';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:3000/api/rooms';

  constructor(private http: HttpClient) { }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getRoomsByBlock(blockId: string): Observable<Room[]> {
    return this.getRooms().pipe(
      map(rooms => rooms.filter(r => r.blockId === blockId))
    );
  }

  getRoomById(id: string): Observable<Room | undefined> {
    return this.getRooms().pipe(
      map(rooms => rooms.find(r => r.id === id))
    );
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  updateRoom(id: string, updatedRoom: Partial<Room>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedRoom);
  }

  removeRoom(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAvailableRooms(): Observable<Room[]> {
    return this.getRooms().pipe(
      map(rooms => rooms.filter(r => r.status === RoomStatus.AVAILABLE && r.occupiedBeds < r.capacity))
    );
  }
}
