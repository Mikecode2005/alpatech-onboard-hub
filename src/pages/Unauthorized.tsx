import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, LogOut } from 'lucide-react';
import { useAppState } from '@/state/appState';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppState((s) => s.user);
  const reset = useAppState((s) => s.reset);

  const handleLogout = () => {
    reset();
    navigate('/');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Helmet>
        <title>Unauthorized | Alpatech Training Portal</title>
        <meta name="description" content="You do not have permission to access this page." />
      </Helmet>

      <div className="container max-w-md mx-auto p-6">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="rounded-full bg-red-100 p-6">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
          </div>

          <div className="text-sm text-muted-foreground border rounded-md p-4 bg-muted/50 w-full">
            <p className="font-medium">Current User Information:</p>
            <p>Email: {user?.email || 'Not logged in'}</p>
            <p>Role: {user?.role || 'None'}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button 
              variant="default" 
              className="flex items-center gap-2" 
              onClick={goToDashboard}
            >
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;