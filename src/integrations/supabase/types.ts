// User and Authentication Types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 
  | 'trainee'
  | 'instructor'
  | 'training_supervisor'
  | 'training_coordinator'
  | 'desk_officer'
  | 'safety_officer'
  | 'nurse'
  | 'operations_manager'
  | 'coo'
  | 'admin';

export interface UserPermissions {
  canViewTrainees: boolean;
  canEditTrainees: boolean;
  canViewStaff: boolean;
  canEditStaff: boolean;
  canGeneratePasscodes: boolean;
  canVerifyTrainees: boolean;
  canAssignTraining: boolean;
  canApproveRequests: boolean;
  canViewMedicalData: boolean;
  canEditMedicalData: boolean;
  canViewSafetyData: boolean;
  canEditSafetyData: boolean;
  canManageEquipment: boolean;
  canRequestEquipment: boolean;
  canApproveEquipment: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canAccessAdminPanel: boolean;
}

// Passcode Types
export interface Passcode {
  id: string;
  code: string;
  email: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
  createdAt: string;
  createdBy: string;
}

// Form Types
export interface WelcomePolicyForm {
  id: string;
  userId: string;
  acknowledgement: boolean;
  signature: string;
  submittedAt: string;
}

export interface CourseRegistrationForm {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  submittedAt: string;
}

export interface MedicalScreeningForm {
  id: string;
  userId: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  hasHeartCondition: boolean;
  hasRespiratoryCondition: boolean;
  hasMobilityIssues: boolean;
  additionalNotes: string;
  submittedAt: string;
}

export interface BOSIETForm {
  id: string;
  userId: string;
  previousTraining: boolean;
  previousTrainingDate?: string;
  previousTrainingProvider?: string;
  canSwim: boolean;
  swimLevel: string;
  medicalClearance: boolean;
  submittedAt: string;
}

export interface FireWatchForm {
  id: string;
  userId: string;
  previousExperience: boolean;
  yearsExperience?: number;
  certifications: string[];
  equipmentFamiliarity: boolean;
  submittedAt: string;
}

export interface CSERForm {
  id: string;
  userId: string;
  previousTraining: boolean;
  previousTrainingDate?: string;
  previousTrainingProvider?: string;
  certifications: string[];
  submittedAt: string;
}

export interface SizeForm {
  id: string;
  userId: string;
  coverallSize: string;
  shoeSize: number;
  helmetSize: string;
  glovesSize: string;
  submittedAt: string;
}

// Training Types
export interface TrainingSet {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  trainingType: string;
  location: string;
  instructor: string;
  maxCapacity: number;
  currentCount: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  createdBy: string;
}

export interface TrainingAssignment {
  id: string;
  userId: string;
  trainingSetId: string;
  assignedAt: string;
  assignedBy: string;
  isOIM: boolean;
  status: 'assigned' | 'in_progress' | 'completed' | 'failed';
}

// Verification Types
export interface TraineeVerification {
  id: string;
  userId: string;
  verificationMethod: 'national_id' | 'drivers_license' | 'passport' | 'work_id' | 'other';
  verificationDetails: string;
  verifiedAt: string;
  verifiedBy: string;
  documentUrl?: string;
}

// Request and Complaint Types
export interface RequestComplaint {
  id: string;
  userId: string;
  userName: string;
  type: 'request' | 'complaint';
  category: string;
  title: string;
  description: string;
  status: 'submitted' | 'in_review' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  resolution?: string;
}

// You See U Act Types
export interface YouSeeUActForm {
  id: string;
  userId: string;
  userName: string;
  observationType: 'safe_act' | 'unsafe_act' | 'safe_condition' | 'unsafe_condition';
  category: string;
  location: string;
  description: string;
  actionTaken?: string;
  submittedAt: string;
  status: 'submitted' | 'in_review' | 'resolved';
  assignedTo?: string;
  resolvedAt?: string;
  resolution?: string;
}

// Equipment Types
export interface EquipmentItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  unit: string;
  location?: string;
  minStockLevel?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  purpose: string;
  trainingSet?: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'partially_returned';
  notes?: string;
  requestedAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  returnDueDate?: string;
  returnedAt?: string;
  items: EquipmentRequestItem[];
}

export interface EquipmentRequestItem {
  id: string;
  requestId: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface EquipmentAssignment {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  requestId: string;
  quantity: number;
  assignedAt: string;
  dueDate?: string;
  returnedAt?: string;
  conditionOnReturn?: string;
  notes?: string;
}

export interface EquipmentMaintenance {
  id: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: string;
  description: string;
  performedBy: string;
  cost?: number;
  maintenanceDate: string;
  nextMaintenanceDate?: string;
  notes?: string;
}

// Dashboard and Analytics Types
export interface TrainingStats {
  totalTrainees: number;
  activeTrainees: number;
  completedTrainees: number;
  upcomingTrainingSets: number;
  completionRate: number;
}

export interface SafetyStats {
  totalObservations: number;
  safeActs: number;
  unsafeActs: number;
  safeConditions: number;
  unsafeConditions: number;
  resolvedObservations: number;
  pendingObservations: number;
}

export interface EquipmentStats {
  totalEquipment: number;
  availableEquipment: number;
  lowStockItems: number;
  activeRequests: number;
  overdueReturns: number;
}