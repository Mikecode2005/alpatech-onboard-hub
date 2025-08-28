import { Role } from '@/state/appState';

/**
 * Role-based access control utilities
 */

// Define permission types
export type Permission = 
  | 'view_dashboard'
  | 'manage_trainees'
  | 'manage_staff'
  | 'manage_passcodes'
  | 'view_medical_data'
  | 'edit_medical_data'
  | 'view_training_data'
  | 'edit_training_data'
  | 'create_safety_forms'
  | 'view_safety_data'
  | 'manage_equipment'
  | 'view_reports'
  | 'create_reports'
  | 'manage_requests'
  | 'manage_complaints'
  | 'submit_usee_uact'
  | 'view_usee_uact'
  | 'create_training_sets'
  | 'edit_training_sets'
  | 'view_statistics'
  | 'admin_access'
  | 'super_admin_access';

// Define role permissions
const rolePermissions: Record<Role, Permission[]> = {
  'Trainee': [
    'submit_usee_uact',
  ],
  'Training Supervisor': [
    'view_dashboard',
    'manage_trainees',
    'view_training_data',
    'edit_training_data',
    'manage_requests',
    'manage_complaints',
    'submit_usee_uact',
    'view_usee_uact',
    'create_training_sets',
    'edit_training_sets',
    'view_statistics',
  ],
  'Training Coordinator': [
    'view_dashboard',
    'manage_trainees',
    'manage_staff',
    'manage_passcodes',
    'view_training_data',
    'manage_requests',
    'submit_usee_uact',
    'view_usee_uact',
    'view_statistics',
    'admin_access',
  ],
  'Instructor / Team Lead': [
    'view_dashboard',
    'view_training_data',
    'manage_equipment',
    'submit_usee_uact',
    'view_usee_uact',
    'manage_requests',
  ],
  'Utility Office': [
    'view_dashboard',
    'manage_equipment',
    'submit_usee_uact',
  ],
  'Nurse': [
    'view_dashboard',
    'view_medical_data',
    'edit_medical_data',
    'submit_usee_uact',
    'manage_requests',
  ],
  'Safety Coordinator': [
    'view_dashboard',
    'create_safety_forms',
    'view_safety_data',
    'submit_usee_uact',
    'view_usee_uact',
  ],
  'Operations Manager': [
    'view_dashboard',
    'view_training_data',
    'view_medical_data',
    'view_safety_data',
    'view_statistics',
    'view_reports',
    'create_reports',
    'manage_requests',
    'manage_complaints',
    'submit_usee_uact',
    'view_usee_uact',
  ],
  'Chief Operations Officer': [
    'view_dashboard',
    'view_training_data',
    'view_medical_data',
    'view_safety_data',
    'view_statistics',
    'view_reports',
    'create_reports',
    'manage_requests',
    'manage_complaints',
    'submit_usee_uact',
    'view_usee_uact',
    'admin_access',
  ],
  'Other Staff': [
    'view_dashboard',
    'submit_usee_uact',
    'manage_requests',
  ],
  'Super Admin': [
    'view_dashboard',
    'manage_trainees',
    'manage_staff',
    'manage_passcodes',
    'view_medical_data',
    'edit_medical_data',
    'view_training_data',
    'edit_training_data',
    'create_safety_forms',
    'view_safety_data',
    'manage_equipment',
    'view_reports',
    'create_reports',
    'manage_requests',
    'manage_complaints',
    'submit_usee_uact',
    'view_usee_uact',
    'create_training_sets',
    'edit_training_sets',
    'view_statistics',
    'admin_access',
    'super_admin_access',
  ],
};

/**
 * Check if a user has a specific permission
 * 
 * @param role - The user's role
 * @param permission - The permission to check
 * @returns Whether the user has the permission
 */
export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) || false;
}

/**
 * Check if a user has any of the specified permissions
 * 
 * @param role - The user's role
 * @param permissions - The permissions to check
 * @returns Whether the user has any of the permissions
 */
export function hasAnyPermission(role: Role | undefined, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a user has all of the specified permissions
 * 
 * @param role - The user's role
 * @param permissions - The permissions to check
 * @returns Whether the user has all of the permissions
 */
export function hasAllPermissions(role: Role | undefined, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 * 
 * @param role - The user's role
 * @returns Array of permissions for the role
 */
export function getRolePermissions(role: Role | undefined): Permission[] {
  if (!role) return [];
  return rolePermissions[role] || [];
}

/**
 * Check if a user is a staff member (not a trainee)
 * 
 * @param role - The user's role
 * @returns Whether the user is a staff member
 */
export function isStaff(role: Role | undefined): boolean {
  return role !== undefined && role !== 'Trainee';
}

/**
 * Check if a user is an admin
 * 
 * @param role - The user's role
 * @returns Whether the user is an admin
 */
export function isAdmin(role: Role | undefined): boolean {
  if (!role) return false;
  return hasPermission(role, 'admin_access');
}

/**
 * Check if a user is a super admin
 * 
 * @param role - The user's role
 * @returns Whether the user is a super admin
 */
export function isSuperAdmin(role: Role | undefined): boolean {
  return role === 'Super Admin';
}

/**
 * Get the display name for a role
 * 
 * @param role - The role
 * @returns Display name for the role
 */
export function getRoleDisplayName(role: Role): string {
  return role;
}

/**
 * Get all available roles
 * 
 * @returns Array of all roles
 */
export function getAllRoles(): Role[] {
  return Object.keys(rolePermissions) as Role[];
}

/**
 * Get staff roles (excluding Trainee)
 * 
 * @returns Array of staff roles
 */
export function getStaffRoles(): Role[] {
  return getAllRoles().filter(role => role !== 'Trainee');
}