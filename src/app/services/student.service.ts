import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student, StudentStatus } from '../models/hostel.models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/api/students';
  private currentStudent$ = new BehaviorSubject<Student | null>(null);

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudentById(id: string): Observable<Student | undefined> {
    return this.getStudents().pipe(
      map(students => students.find(s => s.id === id))
    );
  }

  setCurrentStudent(student: Student): void {
    this.currentStudent$.next(student);
  }

  getCurrentStudent(): Observable<Student | null> {
    return this.currentStudent$.asObservable();
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(id: string, updatedStudent: Partial<Student>): Observable<any> {
    // Note: Backend needs PUT endpoint for full update support, strictly speaking.
    // For now we might just log or implement if strict requirement.
    // Given the task, I will implement a basic PUT or just acknowledge it needs backend support.
    // However, to keep it simple and working:
    return this.http.put(`${this.apiUrl}/${id}`, updatedStudent);
  }

  removeStudent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchStudents(query: string): Observable<Student[]> {
    return this.getStudents().pipe(
      map(students =>
        students.filter(s =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.email.toLowerCase().includes(query.toLowerCase()) ||
          s.registrationNumber.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }
}
