// User Roles
export enum UserRole {
  STUDENT = 'student',
  WARDEN = 'warden',
  ADMIN = 'admin',
  MAINTENANCE = 'maintenance'
}

// Block Models
export interface HostelBlock {
  id: string;
  name: string;
  location: string;
  university: string;
  city: string;
  floors: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  wardenId: string;
  wardenName?: string;
  wardenPhone?: string;
  wardenEmail?: string;
  amenities: string[];
  builtYear: number;
  image?: string;
  description?: string;
}

// Hostel Office Model
export interface HostelOffice {
  blockId: string;
  location: string;
  floor: number;
  roomNumber: string;
  officeInCharge: {
    name: string;
    designation: string;
    phone: string;
    email: string;
    availability?: string;
  };
  officeStaff?: {
    name: string;
    role: string;
    contact: string;
  }[];
  services: string[];
  contactEmail?: string;
  contactPhone?: string;
  image?: string;
}

// Room Models
export interface Room {
  id: string;
  blockId: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  capacity: number;
  occupiedBeds: number;
  beds: Bed[];
  amenities: string[];
  rentPerMonth: number;
  status: RoomStatus;
  maintenanceStatus?: MaintenanceStatus;
  lastCleaned?: Date;
  image?: string;
}

export enum RoomType {
  SINGLE = 'single',
  DOUBLE = 'double',
  TRIPLE = 'triple',
  QUAD = 'quad',
  QUINTUPLE = 'quintuple'
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  BLOCKED = 'blocked'
}

export interface Bed {
  id: string;
  bedNumber: number;
  studentId?: string;
  status: BedStatus;
}

export enum BedStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance'
}

// Student Models
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationNumber: string;
  department: string;
  semester: number;
  parentContact: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  dateOfBirth: Date;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  avatar?: string;
  documents: StudentDocument[];
  status: StudentStatus;
}

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LEFT = 'left',
  SUSPENDED = 'suspended'
}

export interface StudentDocument {
  id: string;
  type: string;
  url: string;
  uploadDate: Date;
}

// Room Allocation Models
export interface RoomAllocation {
  id: string;
  studentId: string;
  roomId: string;
  bedId: string;
  blockId: string;
  checkInDate: Date;
  checkOutDate?: Date;
  academicYear: string;
  semester: number;
  status: AllocationStatus;
  allocationDate: Date;
  allocatedBy: string;
}

export enum AllocationStatus {
  ALLOCATED = 'allocated',
  ACTIVE = 'active',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled'
}

// Check-in/Check-out Models
export interface CheckInOut {
  id: string;
  studentId: string;
  allocationId: string;
  type: CheckInOutType;
  timestamp: Date;
  blockId: string;
  roomId: string;
  bedId: string;
  notes?: string;
  verifiedBy: string;
  status: CheckInOutStatus;
}

export enum CheckInOutType {
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out'
}

export enum CheckInOutStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

// Maintenance Models
export interface MaintenanceRequest {
  id: string;
  roomId: string;
  blockId: string;
  reportedBy: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  createdAt: Date;
  assignedTo?: string;
  estimatedCompletionDate?: Date;
  completedAt?: Date;
  images?: string[];
  notes?: string;
}

export enum MaintenanceCategory {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  FURNITURE = 'furniture',
  CLEANING = 'cleaning',
  PAINTING = 'painting',
  OTHER = 'other'
}

export enum MaintenancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum MaintenanceStatus {
  REPORTED = 'reported',
  ACKNOWLEDGED = 'acknowledged',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

// Leave Application Models
export interface LeaveApplication {
  id: string;
  studentId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  type: LeaveType;
  attachments?: string[];
  status: LeaveStatus;
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  parentConsent: boolean;
  wardenComments?: string;
}

export enum LeaveType {
  SEMESTER_BREAK = 'semester_break',
  EMERGENCY = 'emergency',
  MEDICAL = 'medical',
  FESTIVAL = 'festival',
  FAMILY_EVENT = 'family_event',
  OTHER = 'other'
}

export enum LeaveStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  WARDEN_PENDING = 'warden_pending',
  WARDEN_APPROVED = 'warden_approved',
  WARDEN_REJECTED = 'warden_rejected',
  ADMIN_PENDING = 'admin_pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

// Complaint & Request Models
export interface Complaint {
  id: string;
  studentId: string;
  studentName?: string;
  roomId?: string;
  blockId?: string;
  type: ComplaintType;
  category: ComplaintCategory;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: Date;
  updatedAt?: Date;
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: Date;
  attachments?: string[];
  wardenRemarks?: string;
}

export enum ComplaintType {
  MAINTENANCE = 'maintenance',
  HYGIENE = 'hygiene',
  BEHAVIOR = 'behavior',
  ROOM_ISSUE = 'room_issue',
  ROOMMATE = 'roommate',
  SAFETY = 'safety',
  OTHER = 'other'
}

export enum ComplaintCategory {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  FURNITURE = 'furniture',
  CLEANLINESS = 'cleanliness',
  NOISE = 'noise',
  SECURITY = 'security',
  FOOD_QUALITY = 'food_quality',
  COMMON_AREA = 'common_area',
  OTHER = 'other'
}

export enum ComplaintPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ComplaintStatus {
  SUBMITTED = 'submitted',
  RECEIVED = 'received',
  UNDER_REVIEW = 'under_review',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REJECTED = 'rejected'
}

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department?: string;
  designation?: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

// Dashboard Models
export interface DashboardStats {
  totalStudents: number;
  totalBlocks: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  maintenanceRequestsPending: number;
  leaveApplicationsPending: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
}

// Notification Models
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: Date;
}

export enum NotificationType {
  ROOM_ALLOCATED = 'room_allocated',
  LEAVE_APPROVED = 'leave_approved',
  LEAVE_REJECTED = 'leave_rejected',
  MAINTENANCE_UPDATE = 'maintenance_update',
  CHECK_IN_REQUIRED = 'check_in_required',
  ADMIN_ALERT = 'admin_alert'
}
