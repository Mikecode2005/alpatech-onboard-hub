/**
 * Role-based authentication utilities
 */

export type UserRole =
  | "Trainee"
  | "Training Supervisor"
  | "Training Coordinator"
  | "Instructor / Team Lead"
  | "Utility Office"
  | "Nurse"
  | "Safety Coordinator"
  | "Operations Manager"
  | "Chief Operations Officer"
  | "Other Staff"
  | "Super Admin";

export interface RolePermission {
  id: string;
  name: string;
  description: string;
}

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  permissions: string[];
  canAccessDashboard: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canManageTrainees: boolean;
  canAssignTraining: boolean;
  canGeneratePasscodes: boolean;
  canApproveRequests: boolean;
  canViewMedicalData: boolean;
  canCreateSafetyForms: boolean;
  canAccessYouSeeUAct: boolean;
  dashboardRoute: string;
}

/**
 * Permissions available in the system
 */
export const PERMISSIONS: Record<string, RolePermission> = {
  VIEW_DASHBOARD: {
    id: 'VIEW_DASHBOARD',
    name: 'View Dashboard',
    description: 'Can view the dashboard'
  },
  MANAGE_USERS: {
    id: 'MANAGE_USERS',
    name: 'Manage Users',
    description: 'Can create, update, and delete users'
  },
  VIEW_REPORTS: {
    id: 'VIEW_REPORTS',
    name: 'View Reports',
    description: 'Can view reports and analytics'
  },
  MANAGE_TRAINEES: {
    id: 'MANAGE_TRAINEES',
    name: 'Manage Trainees',
    description: 'Can manage trainee records'
  },
  ASSIGN_TRAINING: {
    id: 'ASSIGN_TRAINING',
    name: 'Assign Training',
    description: 'Can assign training modules to trainees'
  },
  GENERATE_PASSCODES: {
    id: 'GENERATE_PASSCODES',
    name: 'Generate Passcodes',
    description: 'Can generate passcodes for trainees'
  },
  APPROVE_REQUESTS: {
    id: 'APPROVE_REQUESTS',
    name: 'Approve Requests',
    description: 'Can approve requests and complaints'
  },
  VIEW_MEDICAL_DATA: {
    id: 'VIEW_MEDICAL_DATA',
    name: 'View Medical Data',
    description: 'Can view medical data of trainees'
  },
  CREATE_SAFETY_FORMS: {
    id: 'CREATE_SAFETY_FORMS',
    name: 'Create Safety Forms',
    description: 'Can create safety forms'
  },
  ACCESS_YOU_SEE_U_ACT: {
    id: 'ACCESS_YOU_SEE_U_ACT',
    name: 'Access You See U Act',
    description: 'Can access the You See U Act form'
  },
  ADMIN_ACCESS: {
    id: 'ADMIN_ACCESS',
    name: 'Admin Access',
    description: 'Has full administrative access'
  }
};

/**
 * Role definitions with their permissions
 */
export const ROLES: Record<UserRole, RoleDefinition> = {
  "Trainee": {
    id: "Trainee",
    name: "Trainee",
    description: "Trainee undergoing training",
    permissions: [
      PERMISSIONS.ACCESS_YOU_SEE_U_ACT.id
    ],
    canAccessDashboard: true,
    canManageUsers: false,
    canViewReports: false,
    canManageTrainees: false,
    canAssignTraining: false,
    canGeneratePasscodes: false,
    canApproveRequests: false,
    canViewMedicalData: false,
    canCreateSafetyForms: false,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/dashboard"
  },
  "Training Supervisor": {
    id: "Training Supervisor",
    name: "Training Supervisor",
    description: "Supervises training programs",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD.id,
      PERMISSIONS.MANAGE_TRAINEES.id,
      PERMISSIONS.ASSIGN_TRAINING.id,
      PERMISSIONS.APPROVE_REQUESTS.id,
      PERMISSIONS.ACCESS_YOU_SEE_U_ACT.id,
      PERMISSIONS.VIEW_REPORTS.id
    ],
    canAccessDashboard: true,
    canManageUsers: false,
    canViewReports: true,
    canManageTrainees: true,
    canAssignTraining: true,
    canGeneratePasscodes: false,
    canApproveRequests: true,
    canViewMedicalData: false,
    canCreateSafetyForms: false,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/management/training-supervisor"
  },
  "Training Coordinator": {
    id: "Training Coordinator",
    name: "Training Coordinator",
    description: "Coordinates training activities",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD.id,
      PERMISSIONS.MANAGE_USERS.id,
      PERMISSIONS.MANAGE_TRAINEES.id,
      PERMISSIONS.GENERATE_PASSCODES.id,
      PERMISSIONS.ACCESS_YOU_SEE_U_ACT.id,
      PERMISSIONS.VIEW_REPORTS.id
    ],
    canAccessDashboard: true,
    canManageUsers: true,
    canViewReports: true,
    canManageTrainees: true,
    canAssignTraining: false,
    canGeneratePasscodes: true,
    canApproveRequests: false,
    canViewMedicalData: false,
    canCreateSafetyForms: false,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/management/training-coordinator"
  },
  "Instructor / Team Lead": {
    id: "Instructor / Team Lead",
    name: "Instructor / Team Lead",
    description: "Leads training sessions",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD.id,
      PERMISSIONS.ACCESS_YOU_SEE_U_ACT.id,
      PERMISSIONS.VIEW_REPORTS.id
    ],
    canAccessDashboard: true,
    canManageUsers: false,
    canViewReports: true,
    canManageTrainees: false,
    canAssignTraining: false,
    canGeneratePasscodes: false,
    canApproveRequests: false,
    canViewMedicalData: false,
    canCreateSafetyForms: false,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/instructor-dashboard"
  },
  "Utility Office": {
    id: "Utility Office",
    name: "Utility Office",
    description: "Manages equipment and facilities",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD.id,
      PERMISSIONS.ACCESS_YOU_SEE_U_ACT.id
    ],
    canAccessDashboard: true,
    canManageUsers: false,
    canViewReports: false,
    canManageTrainees: false,
    canAssignTraining: false,
    canGeneratePasscodes: false,
    canApproveRequests: false,
    canViewMedicalData: false,
    canCreateSafetyForms: false,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/utility-dashboard"
  },
  "Nurse": {
    id: "Nurse",
    name: "Nurse",
    description: "Handles medical assessments",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD.id,
      PERMISSIONS.VIEW_MEDICAL_DATA.id,
      PERMISSIONS.ACCESS_YOU_SEE_U_ACT.id
    ],
    canAccessDashboard: true,
    canManageUsers: false,
    canViewReports: false,
    canManageTrainees: false,
    canAssignTraining: false,
    canGeneratePasscodes: false,
    canApproveRequests: false,
    canViewMedicalData: true,
    canCreateSafetyForms: false,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/management/nurse-dashboard"
  },
  "Safety Coordinator": {
    id: "Safety Coordinator",
    name: "Safety Coordinator",
    description: "Ensures safety compliance",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD.id,
      PERMISSIONS.CREATE_SAFETY_FORMS.id,
      PERMISSIONS.ACCESS_YOU_SEE_U_ACT.id
    ],
    canAccessDashboard: true,
    canManageUsers: false,
    canViewReports: false,
    canManageTrainees: false,
    canAssignTraining: false,
    canGeneratePasscodes: false,
    canApproveRequests: false,
    canViewMedicalData: false,
    canCreateSafetyForms: true,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/management/safety-coordinator"
  },
  "Operations Manager": {
    id: "Operations Manager",
    name: "Operations Manager",
    description: "Manages overall operations",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD.id,
      PERMISSIONS.VIEW_REPORTS.id,
      PERMISSIONS.APPROVE_REQUESTS.id,
      PERMISSIONS.ACCESS_YOU_SEE_U_ACT.id
    ],
    canAccessDashboard: true,
    canManageUsers: false,
    canViewReports: true,
    canManageTrainees: false,
    canAssignTraining: false,
    canGeneratePasscodes: false,
    canApproveRequests: true,
    canViewMedicalData: false,
    canCreateSafetyForms: false,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/operations-manager-dashboard"
  },
  "Chief Operations Officer": {
    id: "Chief Operations Officer",
    name: "Chief Operations Officer",
    description: "Highest authority for operations",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD.id,
      PERMISSIONS.VIEW_REPORTS.id,
      PERMISSIONS.APPROVE_REQUESTS.id,
      PERMISSIONS.ACCESS_YOU_SEE_U_ACT.id,
      PERMISSIONS.ADMIN_ACCESS.id
    ],
    canAccessDashboard: true,
    canManageUsers: false,
    canViewReports: true,
    canManageTrainees: false,
    canAssignTraining: false,
    canGeneratePasscodes: false,
    canApproveRequests: true,
    canViewMedicalData: false,
    canCreateSafetyForms: false,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/executive-dashboard"
  },
  "Other Staff": {
    id: "Other Staff",
    name: "Other Staff",
    description: "General staff members",
    permissions: [
      PERMISSIONS.ACCESS_YOU_SEE_U_ACT.id
    ],
    canAccessDashboard: true,
    canManageUsers: false,
    canViewReports: false,
    canManageTrainees: false,
    canAssignTraining: false,
    canGeneratePasscodes: false,
    canApproveRequests: false,
    canViewMedicalData: false,
    canCreateSafetyForms: false,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/staff-dashboard"
  },
  "Super Admin": {
    id: "Super Admin",
    name: "Super Admin",
    description: "Has full system access",
    permissions: Object.values(PERMISSIONS).map(p => p.id),
    canAccessDashboard: true,
    canManageUsers: true,
    canViewReports: true,
    canManageTrainees: true,
    canAssignTraining: true,
    canGeneratePasscodes: true,
    canApproveRequests: true,
    canViewMedicalData: true,
    canCreateSafetyForms: true,
    canAccessYouSeeUAct: true,
    dashboardRoute: "/admin-dashboard"
  }
};

/**
 * Check if a user has a specific permission
 * 
 * @param userRole - The user's role
 * @param permission - The permission to check
 * @returns Whether the user has the permission
 */
export function hasPermission(userRole: UserRole | undefined, permission: string): boolean {
  if (!userRole) return false;
  
  const role = ROLES[userRole];
  if (!role) return false;
  
  return role.permissions.includes(permission);
}

/**
 * Get the dashboard route for a user role
 * 
 * @param userRole - The user's role
 * @returns The dashboard route for the role
 */
export function getDashboardRoute(userRole: UserRole | undefined): string {
  if (!userRole) return "/";
  
  const role = ROLES[userRole];
  if (!role) return "/";
  
  return role.dashboardRoute;
}

/**
 * Get all available roles
 * 
 * @returns Array of role definitions
 */
export function getAllRoles(): RoleDefinition[] {
  return Object.values(ROLES);
}

/**
 * Get all available permissions
 * 
 * @returns Array of permission definitions
 */
export function getAllPermissions(): RolePermission[] {
  return Object.values(PERMISSIONS);
}