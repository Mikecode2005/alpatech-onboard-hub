import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, ClipboardCheck, AlertTriangle, Calendar, Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SupervisorStats {
  activeTrainees: number;
  pendingApprovals: number;
  completedToday: number;
  medicalReviews: number;
}

interface PendingApproval {
  id: string;
  trainee_name: string;
  module: string;
  completed_at: string;
  status: string;
}

const TrainingSupervisorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<SupervisorStats>({
    activeTrainees: 0,
    pendingApprovals: 0,
    completedToday: 0,
    medicalReviews: 0
  });
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupervisorData();
  }, []);

  const fetchSupervisorData = async () => {
    try {
      // Mock data - in real implementation, fetch from database
      setStats({
        activeTrainees: 23,
        pendingApprovals: 7,
        completedToday: 5,
        medicalReviews: 3
      });

      setPendingApprovals([
        {
          id: "1",
          trainee_name: "John Doe",
          module: "BOSIET",
          completed_at: new Date().toISOString(),
          status: "pending_approval"
        },
        {
          id: "2", 
          trainee_name: "Jane Smith",
          module: "Fire Watch",
          completed_at: new Date().toISOString(),
          status: "pending_approval"
        }
      ]);
    } catch (error) {
      toast({ title: "Error fetching supervisor data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const approveTraining = async (approvalId: string) => {
    try {
      // Update approval status
      const updatedApprovals = pendingApprovals.filter(approval => approval.id !== approvalId);
      setPendingApprovals(updatedApprovals);
      
      toast({ 
        title: "Training approved",
        description: "Trainee has been approved for certification"
      });
    } catch (error) {
      toast({ title: "Error approving training", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Training Supervisor Dashboard | Alpatech Training Portal</title>
        <meta name="description" content="Supervise training progress and approve certifications" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Training Supervisor Dashboard</h1>
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
              <CardTitle className="text-sm font-medium">Active Trainees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTrainees}</div>
              <p className="text-xs text-muted-foreground">Under supervision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
              <p className="text-xs text-muted-foreground">Training sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Reviews</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.medicalReviews}</div>
              <p className="text-xs text-muted-foreground">Flagged for review</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Supervision</CardTitle>
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
                onClick={() => navigate("/management/manage-trainees")} 
                className="w-full justify-start"
                variant="outline"
              >
                Manage Trainees
              </Button>
              <Button 
                onClick={() => navigate("/management/training-reports")} 
                className="w-full justify-start"
                variant="outline"
              >
                View Training Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical & Approvals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate("/management/nurse-dashboard")} 
                className="w-full justify-start"
                variant="outline"
              >
                Review Medical Records
              </Button>
              <Button 
                onClick={() => navigate("/management/medical-records")} 
                className="w-full justify-start"
                variant="outline"
              >
                Medical Records Archive
              </Button>
              <Button 
                onClick={() => navigate("/management/all-records")} 
                className="w-full justify-start"
                variant="outline"
              >
                All Training Records
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Training Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending approvals
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{approval.trainee_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Completed: {approval.module}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(approval.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => approveTraining(approval.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingSupervisorDashboard;