import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppState } from '@/state/appState';
import { hasPermission, Permission, hasAnyPermission } from '@/lib/rbac';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredAnyPermission?: Permission[];
  redirectTo?: string;
}

/**
 * A component to protect routes based on user permissions
 * 
 * @param children - The route content to render if authorized
 * @param requiredPermissions - Permissions required to access the route (all must match)
 * @param requiredAnyPermission - Any of these permissions grants access
 * @param redirectTo - Where to redirect if unauthorized
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredAnyPermission = [],
  redirectTo = '/staff-login',
}) => {
  const user = useAppState((s) => s.user);
  const location = useLocation();

  // Check if user is logged in
  if (!user) {
    // Redirect to login, but remember where they were trying to go
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has all required permissions
  const hasAllRequired = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(user.role, permission));

  // Check if user has any of the alternative permissions
  const hasAnyRequired = requiredAnyPermission.length === 0 || 
    hasAnyPermission(user.role, requiredAnyPermission);

  // If user doesn't have required permissions, redirect
  if (!hasAllRequired || !hasAnyRequired) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authorized, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;