import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, AlertTriangle, FileText, TrendingUp, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/state/appState";

interface SafetyStats {
  activeIncidents: number;
  safetyTrainings: number;
  complianceRate: number;
  inspectionsDue: number;
}

interface SafetyIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  reported_by: string;
  created_at: string;
}

const SafetyCoordinatorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<SafetyStats>({
    activeIncidents: 0,
    safetyTrainings: 0,
    complianceRate: 0,
    inspectionsDue: 0
  });
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "medium" as const
  });
  const [showIncidentForm, setShowIncidentForm] = useState(false);
const [loading, setLoading] = useState(true);
  const useeSubmissions = useAppState((s) => s.useeUactSubmissions);

  useEffect(() => {
    fetchSafetyData();
  }, []);

  const fetchSafetyData = async () => {
    try {
      // Mock data - in real implementation, fetch from database
      setStats({
        activeIncidents: 3,
        safetyTrainings: 45,
        complianceRate: 94.5,
        inspectionsDue: 7
      });

      setIncidents([
        {
          id: "1",
          title: "Equipment Safety Concern",
          description: "Defective harness reported in training area",
          severity: "high",
          status: "investigating",
          reported_by: "John Doe",
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          title: "Near Miss Incident",
          description: "Trainee almost fell during heights training",
          severity: "medium",
          status: "open",
          reported_by: "Jane Smith",
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      toast({ title: "Error fetching safety data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async () => {
    if (!newIncident.title || !newIncident.description) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      const incident: SafetyIncident = {
        id: Date.now().toString(),
        ...newIncident,
        status: "open",
        reported_by: "Safety Coordinator",
        created_at: new Date().toISOString()
      };

      setIncidents([incident, ...incidents]);
      setNewIncident({ title: "", description: "", severity: "medium" });
      setShowIncidentForm(false);
      
      toast({ 
        title: "Safety incident reported",
        description: "Incident has been logged and will be investigated"
      });
    } catch (error) {
      toast({ title: "Error creating incident report", variant: "destructive" });
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">High</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Open</Badge>;
      case 'investigating':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Safety Coordinator Dashboard | Alpatech Training Portal</title>
        <meta name="description" content="Manage safety protocols, incidents, and compliance" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Safety Coordinator Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowIncidentForm(!showIncidentForm)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Safety Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeIncidents}</div>
              <p className="text-xs text-muted-foreground">Under investigation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Trainings</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.safetyTrainings}</div>
              <p className="text-xs text-muted-foreground">Completed this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.complianceRate}%</div>
              <p className="text-xs text-muted-foreground">Above target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inspections Due</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inspectionsDue}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* New Incident Form */}
        {showIncidentForm && (
          <Card>
            <CardHeader>
              <CardTitle>Report Safety Incident</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Incident Title</Label>
                <Input
                  placeholder="Brief description of the incident"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                />
              </div>
              <div>
                <Label>Detailed Description</Label>
                <Textarea
                  placeholder="Provide detailed information about the incident"
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                  rows={4}
                />
              </div>
              <div>
                <Label>Severity Level</Label>
                <select
                  value={newIncident.severity}
                  onChange={(e) => setNewIncident({...newIncident, severity: e.target.value as any})}
                  className="w-full p-2 border rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={createIncident}>
                  Submit Report
                </Button>
                <Button variant="outline" onClick={() => setShowIncidentForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Safety Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                Schedule Safety Briefing
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Emergency Response Drill
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Safety Protocol Updates
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inspections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                Equipment Safety Check
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Facility Inspection
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Fire Safety Systems
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                Regulatory Compliance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Safety Documentation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Audit Preparation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Active Safety Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active safety incidents
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Reported by: {incident.reported_by} • {new Date(incident.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getSeverityBadge(incident.severity)}
                      {getStatusBadge(incident.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* U-SEE U-ACT Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>U-SEE U-ACT Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {useeSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No submissions yet</div>
            ) : (
              <div className="space-y-4">
                {useeSubmissions.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="grid md:grid-cols-2 gap-2">
                      <div><span className="font-medium">Safe Acts:</span> <span className="text-sm text-muted-foreground">{item.safeActs || '-'}</span></div>
                      <div><span className="font-medium">Unsafe Acts:</span> <span className="text-sm text-muted-foreground">{item.unsafeActs || '-'}</span></div>
                      <div><span className="font-medium">Safe Conditions:</span> <span className="text-sm text-muted-foreground">{item.safeConditions || '-'}</span></div>
                      <div><span className="font-medium">Unsafe Conditions:</span> <span className="text-sm text-muted-foreground">{item.unsafeConditions || '-'}</span></div>
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

export default SafetyCoordinatorDashboard;