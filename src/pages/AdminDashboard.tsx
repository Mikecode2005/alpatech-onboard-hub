import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Key, FileText, Shield, Settings, BarChart3 } from "lucide-react";
import { useAppState } from "@/state/appState";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useAppState((s) => s.user);

  useEffect(() => {
    // Redirect if not super admin
    if (!user || user.role !== "Super Admin") {
      navigate("/staff-login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "Super Admin") {
    return null;
  }

  const adminActions = [
    {
      title: "Manage Users",
      description: "Create and manage staff accounts",
      icon: Users,
      route: "/manage-users",
      variant: "default" as const
    },
    {
      title: "Generate Passcodes",
      description: "Create access codes for new users",
      icon: Key,
      route: "/generate-passcodes",
      variant: "default" as const
    },
    {
      title: "All Records",
      description: "View all system records and data",
      icon: FileText,
      route: "/management/all-records",
      variant: "default" as const
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: Settings,
      route: "/settings",
      variant: "outline" as const
    },
    {
      title: "Security Overview",
      description: "View security logs and alerts",
      icon: Shield,
      route: "/security",
      variant: "outline" as const
    },
    {
      title: "Analytics",
      description: "View system analytics and reports",
      icon: BarChart3,
      route: "/analytics",
      variant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Super Admin Dashboard | Alpatech Training Portal</title>
        <meta name="description" content="Super administrator dashboard for managing the Alpatech training system." />
      </Helmet>
      
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name || user.email}. Manage your training system from here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.route} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Icon className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {action.description}
                  </p>
                  <Button 
                    variant={action.variant}
                    className="w-full"
                    onClick={() => navigate(action.route)}
                  >
                    Access {action.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate("/management/staff-registration")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Create Staff Account
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/management/training-coordinator")}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Training Coordinator Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/management/passcode-management")}
                className="flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                Manage Passcodes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;