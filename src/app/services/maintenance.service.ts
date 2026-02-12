import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaintenanceRequest, MaintenanceStatus, MaintenancePriority } from '../models/hostel.models';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl = 'http://localhost:3000/api/maintenance';

  constructor(private http: HttpClient) { }

  getRequests(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl);
  }

  getRequestsForRoom(roomId: string): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl).pipe(
      map(requests => requests.filter(r => r.roomId === roomId))
    );
  }

  getRequestsByStatus(status: MaintenanceStatus): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl).pipe(
      map(requests => requests.filter(r => r.status === status))
    );
  }

  addRequest(request: MaintenanceRequest): Observable<MaintenanceRequest> {
    return this.http.post<MaintenanceRequest>(this.apiUrl, request);
  }

  updateRequest(id: string, updatedRequest: Partial<MaintenanceRequest>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedRequest);
  }

  getPendingRequests(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(this.apiUrl).pipe(
      map(requests =>
        requests.filter(r =>
          r.status === MaintenanceStatus.REPORTED ||
          r.status === MaintenanceStatus.ACKNOWLEDGED
        )
      )
    );
  }
}
