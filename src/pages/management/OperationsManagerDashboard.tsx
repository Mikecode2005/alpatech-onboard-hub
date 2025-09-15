import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/state/userContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Users,
  ShieldAlert,
  Hammer,
  FileBarChart,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import RequestsList from "@/components/dashboard/RequestsList";
import SafetyObservationsList from "@/components/dashboard/SafetyObservationsList";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const OperationsManagerDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrainees: 0,
    activeTrainees: 0,
    completedTrainees: 0,
    pendingRequests: 0,
    resolvedRequests: 0,
    safetyObservations: 0,
    equipmentRequests: 0
  });
  const [trainingData, setTrainingData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  const [safetyData, setSafetyData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [safetyObservations, setSafetyObservations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch training statistics
        const { data: traineesData, error: traineesError } = await supabase
          .from('users')
          .select('id, role')
          .eq('role', 'Trainee');
        
        if (traineesError) throw traineesError;
        
        const { data: completedTrainingsData, error: completedError } = await supabase
          .from('training_assignments')
          .select('*')
          .eq('completed', true);
        
        if (completedError) throw completedError;
        
        // Fetch requests data
        const { data: requestsData, error: requestsError } = await supabase
          .from('requests_complaints')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (requestsError) throw requestsError;
        
        // Fetch safety observations (YouSeeUAct forms)
        const { data: safetyObsData, error: safetyError } = await supabase
          .from('usee_uact_forms')
          .select('*')
          .order('submitted_at', { ascending: false });
        
        if (safetyError) throw safetyError;
        
        // Fetch equipment requests
        const { data: equipmentReqData, error: equipmentError } = await supabase
          .from('equipment_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (equipmentError) throw equipmentError;
        
        // Process and set data
        const pendingRequests = requestsData.filter(req => req.status !== 'resolved').length;
        const resolvedRequests = requestsData.filter(req => req.status === 'resolved').length;
        
        setStats({
          totalTrainees: traineesData.length,
          activeTrainees: traineesData.length - completedTrainingsData.length,
          completedTrainees: completedTrainingsData.length,
          pendingRequests,
          resolvedRequests,
          safetyObservations: safetyObsData.length,
          equipmentRequests: equipmentReqData.length
        });
        
        // Set training data for charts
        setTrainingData([
          { name: 'Active Trainees', value: traineesData.length - completedTrainingsData.length },
          { name: 'Completed Training', value: completedTrainingsData.length }
        ]);
        
        // Set requests data for charts
        setRequestsData([
          { name: 'Pending', value: pendingRequests },
          { name: 'Resolved', value: resolvedRequests }
        ]);
        
        // Set safety data for charts
        const safeActs = safetyObsData.filter(obs => obs.observationType === 'safe_act').length;
        const unsafeActs = safetyObsData.filter(obs => obs.observationType === 'unsafe_act').length;
        const safeConditions = safetyObsData.filter(obs => obs.observationType === 'safe_condition').length;
        const unsafeConditions = safetyObsData.filter(obs => obs.observationType === 'unsafe_condition').length;
        
        setSafetyData([
          { name: 'Safe Acts', value: safeActs },
          { name: 'Unsafe Acts', value: unsafeActs },
          { name: 'Safe Conditions', value: safeConditions },
          { name: 'Unsafe Conditions', value: unsafeConditions }
        ]);
        
        // Set equipment data for charts
        const pendingEquipment = equipmentReqData.filter(req => req.status === 'pending').length;
        const approvedEquipment = equipmentReqData.filter(req => req.status === 'approved').length;
        const rejectedEquipment = equipmentReqData.filter(req => req.status === 'rejected').length;
        
        setEquipmentData([
          { name: 'Pending', value: pendingEquipment },
          { name: 'Approved', value: approvedEquipment },
          { name: 'Rejected', value: rejectedEquipment }
        ]);
        
        // Set recent requests
        setRecentRequests(requestsData.slice(0, 5));
        
        // Set safety observations
        setSafetyObservations(safetyObsData.slice(0, 5));
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Operations Manager Dashboard"
        description="Monitor and manage operational activities across the organization"
        icon={<LayoutDashboard className="h-6 w-6 mr-2" />}
      />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Requests & Complaints</TabsTrigger>
          <TabsTrigger value="safety">Safety Data</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Trainees" 
              value={stats.totalTrainees} 
              icon={<Users className="h-4 w-4" />} 
              description="Total registered trainees" 
              loading={loading}
            />
            <StatCard 
              title="Active Trainees" 
              value={stats.activeTrainees} 
              icon={<Activity className="h-4 w-4" />} 
              description="Currently in training" 
              loading={loading}
            />
            <StatCard 
              title="Pending Requests" 
              value={stats.pendingRequests} 
              icon={<ClipboardList className="h-4 w-4" />} 
              description="Awaiting resolution" 
              loading={loading}
            />
            <StatCard 
              title="Safety Observations" 
              value={stats.safetyObservations} 
              icon={<ShieldAlert className="h-4 w-4" />} 
              description="Total safety reports" 
              loading={loading}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Training Status</CardTitle>
                <CardDescription>Overview of trainee progress</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trainingData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {trainingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Requests & Complaints</CardTitle>
                <CardDescription>Status of submitted requests</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={requestsData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Latest requests and complaints</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading recent requests...</p>
                ) : recentRequests.length > 0 ? (
                  <ul className="space-y-2">
                    {recentRequests.map((request) => (
                      <li key={request.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{request.title}</p>
                          <p className="text-sm text-muted-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={request.status === 'resolved' ? 'outline' : 'default'}>
                          {request.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No recent requests found.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setActiveTab("requests")}>
                  View All Requests
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Safety Observations</CardTitle>
                <CardDescription>Recent safety reports</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading safety observations...</p>
                ) : safetyObservations.length > 0 ? (
                  <ul className="space-y-2">
                    {safetyObservations.map((observation) => (
                      <li key={observation.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">{observation.category}</p>
                          <p className="text-sm text-muted-foreground">{observation.location}</p>
                        </div>
                        <Badge variant={observation.observationType.includes('safe') ? 'outline' : 'destructive'}>
                          {observation.observationType.replace('_', ' ')}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No safety observations found.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setActiveTab("safety")}>
                  View All Observations
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Requests & Complaints Management</CardTitle>
              <CardDescription>Review and manage all requests and complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <RequestsList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Data</CardTitle>
              <CardDescription>Review safety observations and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Safety Observations by Type</h3>
                <div className="h-[300px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Loading chart data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={safetyData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <SafetyObservationsList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Access and generate operational reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2">
                  <FileBarChart className="h-6 w-6" />
                  <span>Training Completion Report</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2">
                  <ShieldAlert className="h-6 w-6" />
                  <span>Safety Incidents Report</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2">
                  <Hammer className="h-6 w-6" />
                  <span>Equipment Usage Report</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span>Requests Resolution Report</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>Trainee Performance Report</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span>Custom Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default OperationsManagerDashboard;