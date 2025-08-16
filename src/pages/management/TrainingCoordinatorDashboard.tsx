import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, GraduationCap, FileText, Calendar, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TrainingStats {
  totalTrainees: number;
  activeTraining: number;
  completedTraining: number;
  pendingAssignments: number;
}

const TrainingCoordinatorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<TrainingStats>({
    totalTrainees: 0,
    activeTraining: 0,
    completedTraining: 0,
    pendingAssignments: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingStats();
  }, []);

  const fetchTrainingStats = async () => {
    try {
      // In a real implementation, these would be actual database queries
      setStats({
        totalTrainees: 156,
        activeTraining: 34,
        completedTraining: 89,
        pendingAssignments: 12
      });
    } catch (error) {
      toast({ title: "Error fetching training statistics", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Training Coordinator Dashboard | Alpatech Training Portal</title>
        <meta name="description" content="Coordinate and manage all training activities and assignments" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Training Coordinator Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search trainees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trainees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTrainees}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Training</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTraining}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Training</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTraining}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Training Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate("/management/assign-training")} 
                className="w-full justify-start"
                variant="outline"
              >
                Assign Training Modules
              </Button>
              <Button 
                onClick={() => navigate("/management/generate-passcodes")} 
                className="w-full justify-start"
                variant="outline"
              >
                Generate Passcodes
              </Button>
              <Button 
                onClick={() => navigate("/management/manage-trainees")} 
                className="w-full justify-start"
                variant="outline"
              >
                Manage Trainees
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reports & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate("/management/training-reports")} 
                className="w-full justify-start"
                variant="outline"
              >
                Training Reports
              </Button>
              <Button 
                onClick={() => navigate("/management/all-records")} 
                className="w-full justify-start"
                variant="outline"
              >
                All Records
              </Button>
              <Button 
                onClick={() => navigate("/management/medical-records")} 
                className="w-full justify-start"
                variant="outline"
              >
                Medical Records
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate("/management/manage-users")} 
                className="w-full justify-start"
                variant="outline"
              >
                Manage Staff Accounts
              </Button>
              <Button 
                onClick={() => navigate("/management/high-level-requests")} 
                className="w-full justify-start"
                variant="outline"
              >
                High Level Requests
              </Button>
              <Button 
                onClick={() => navigate("/management/equipment-requests")} 
                className="w-full justify-start"
                variant="outline"
              >
                Equipment Requests
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Training Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">BOSIET Training Completion</h4>
                  <p className="text-sm text-muted-foreground">John Doe completed BOSIET training module</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Medical Review Required</h4>
                  <p className="text-sm text-muted-foreground">Jane Smith - medical screening needs nurse review</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">New Training Assignment</h4>
                  <p className="text-sm text-muted-foreground">Fire Watch training assigned to 5 trainees</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">Assigned</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingCoordinatorDashboard;