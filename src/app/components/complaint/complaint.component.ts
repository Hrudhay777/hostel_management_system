import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
import {
  Complaint,
  ComplaintType,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus
} from '../../models/hostel.models';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {

  // ===============================
  // STATE
  // ===============================

  selectedComplaintType: ComplaintType | null = null;
  showComplaintForm = false;
  complaints: Complaint[] = [];

  // ===============================
  // ENUMS FOR TEMPLATE
  // ===============================

  ComplaintType = ComplaintType;
  ComplaintPriority = ComplaintPriority;
  ComplaintCategory = ComplaintCategory;

  // ===============================
  // FORM DATA
  // ===============================

  complaintData = {
    title: '',
    description: '',
    category: ComplaintCategory.OTHER,
    priority: ComplaintPriority.MEDIUM
  };

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  // ===============================
  // LOAD STUDENT COMPLAINTS
  // ===============================
  loadComplaints(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.complaintService.getComplaints().subscribe(all => {
      this.complaints = all.filter(c => c.studentId === user.id);
    });
  }

  // ===============================
  // SELECT TYPE
  // ===============================
  selectComplaintType(type: ComplaintType): void {
    this.selectedComplaintType = type;
    this.showComplaintForm = true;
    this.resetForm();
  }

  // ===============================
  // CLOSE FORM
  // ===============================
  closeComplaintForm(): void {
    this.showComplaintForm = false;
    this.selectedComplaintType = null;
    this.resetForm();
  }

  // ===============================
  // VALIDATE FORM
  // ===============================
  validateForm(): boolean {
    return (
      !!this.selectedComplaintType &&
      this.complaintData.title.trim().length > 0 &&
      this.complaintData.description.trim().length > 0
    );
  }

  // ===============================
  // SUBMIT COMPLAINT
  // ===============================
  submitComplaint(): void {

    if (!this.validateForm()) {
      alert('Please fill all required fields');
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      alert('User not logged in');
      return;
    }

    // Get student name from students service
    this.studentService.getStudents().subscribe(students => {
      const student = students.find(s => s.id === user.id);
      const studentName: string = student && student.name ? student.name : 'Unknown Student';

      const newComplaint: Complaint = {
        id: 'comp-' + Date.now(),
        studentId: user.id!,
        studentName: studentName,
        type: this.selectedComplaintType!,
        category: this.complaintData.category,
        title: this.complaintData.title,
        description: this.complaintData.description,
        priority: this.complaintData.priority,
        status: ComplaintStatus.SUBMITTED,
        createdAt: new Date()
      };

      this.complaintService.addComplaint(newComplaint);

      alert('Complaint Submitted Successfully! Admin will review and resolve it soon. ✅');

      this.closeComplaintForm();
      this.loadComplaints();
    });
  }

  // ===============================
  // RESET FORM
  // ===============================
  resetForm(): void {
    this.complaintData = {
      title: '',
      description: '',
      category: ComplaintCategory.OTHER,
      priority: ComplaintPriority.MEDIUM
    };
  }

  // ===============================
  // CATEGORY OPTIONS
  // ===============================
  getAvailableCategories(): ComplaintCategory[] {
    if (!this.selectedComplaintType) return [ComplaintCategory.OTHER];

    switch (this.selectedComplaintType) {
      case ComplaintType.MAINTENANCE:
        return [
          ComplaintCategory.PLUMBING,
          ComplaintCategory.ELECTRICAL,
          ComplaintCategory.FURNITURE,
          ComplaintCategory.OTHER
        ];

      case ComplaintType.HYGIENE:
        return [
          ComplaintCategory.CLEANLINESS,
          ComplaintCategory.COMMON_AREA,
          ComplaintCategory.OTHER
        ];

      case ComplaintType.SAFETY:
        return [
          ComplaintCategory.SECURITY,
          ComplaintCategory.OTHER
        ];

      default:
        return [ComplaintCategory.OTHER];
    }
  }

  // ===============================
  // STATUS COLOR
  // ===============================
  getStatusColor(status: ComplaintStatus): string {

    const colors: { [key in ComplaintStatus]: string } = {
      submitted: '#FFA500',
      received: '#4169E1',
      under_review: '#9370DB',
      in_progress: '#FF6347',
      resolved: '#228B22',
      closed: '#808080',
      rejected: '#DC143C'
    };

    return colors[status] || '#333';
  }
}
