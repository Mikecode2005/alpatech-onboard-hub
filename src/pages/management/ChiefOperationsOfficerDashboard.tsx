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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
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
  MessageSquare,
  TrendingUp,
  Calendar,
  CircleDollarSign,
  Award
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import RequestsList from "@/components/dashboard/RequestsList";
import SafetyObservationsList from "@/components/dashboard/SafetyObservationsList";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Circular progress component
const CircularProgress = ({ value, label, color }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className={color}
            strokeWidth="8"
            strokeDasharray={`${value * 2.51} 251.2`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-lg font-semibold">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  );
};

const ChiefOperationsOfficerDashboard = () => {
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
    equipmentRequests: 0,
    trainingCompletionRate: 0,
    safetyComplianceRate: 0,
    equipmentUtilizationRate: 0
  });
  const [trainingData, setTrainingData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  const [safetyData, setSafetyData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [trainingTrendData, setTrainingTrendData] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [highPriorityRequests, setHighPriorityRequests] = useState([]);
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
        
        // Calculate completion rate
        const completionRate = traineesData.length > 0 
          ? Math.round((completedTrainingsData.length / traineesData.length) * 100) 
          : 0;
        
        // Calculate safety compliance rate (example calculation)
        const safeObservations = safetyObsData.filter(obs => 
          obs.observationType === 'safe_act' || obs.observationType === 'safe_condition'
        ).length;
        const safetyComplianceRate = safetyObsData.length > 0 
          ? Math.round((safeObservations / safetyObsData.length) * 100) 
          : 0;
        
        // Calculate equipment utilization (example calculation)
        const approvedEquipmentRequests = equipmentReqData.filter(req => req.status === 'approved').length;
        const equipmentUtilizationRate = equipmentReqData.length > 0 
          ? Math.round((approvedEquipmentRequests / equipmentReqData.length) * 100) 
          : 0;
        
        setStats({
          totalTrainees: traineesData.length,
          activeTrainees: traineesData.length - completedTrainingsData.length,
          completedTrainees: completedTrainingsData.length,
          pendingRequests,
          resolvedRequests,
          safetyObservations: safetyObsData.length,
          equipmentRequests: equipmentReqData.length,
          trainingCompletionRate: completionRate,
          safetyComplianceRate,
          equipmentUtilizationRate
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
        
        // Generate mock training trend data (in a real app, this would come from the database)
        const mockTrendData = [
          { month: 'Jan', trainees: 20, completions: 15 },
          { month: 'Feb', trainees: 25, completions: 18 },
          { month: 'Mar', trainees: 30, completions: 22 },
          { month: 'Apr', trainees: 35, completions: 25 },
          { month: 'May', trainees: 40, completions: 30 },
          { month: 'Jun', trainees: 45, completions: 35 }
        ];
        
        setTrainingTrendData(mockTrendData);
        
        // Set recent requests
        setRecentRequests(requestsData.slice(0, 5));
        
        // Set high priority requests
        setHighPriorityRequests(
          requestsData
            .filter(req => req.priority === 'high' || req.priority === 'urgent')
            .slice(0, 5)
        );
        
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
        title="Chief Operations Officer Dashboard"
        description="Executive overview of organizational operations and performance"
        icon={<LayoutDashboard className="h-6 w-6 mr-2" />}
      />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="overview">Executive Summary</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Total Trainees" 
              value={stats.totalTrainees} 
              icon={<Users className="h-4 w-4" />} 
              description="Total registered trainees" 
              loading={loading}
            />
            <StatCard 
              title="Safety Observations" 
              value={stats.safetyObservations} 
              icon={<ShieldAlert className="h-4 w-4" />} 
              description="Total safety reports" 
              loading={loading}
            />
            <StatCard 
              title="Equipment Requests" 
              value={stats.equipmentRequests} 
              icon={<Hammer className="h-4 w-4" />} 
              description="Total equipment requests" 
              loading={loading}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Overall organizational performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-around gap-4">
                <CircularProgress 
                  value={stats.trainingCompletionRate} 
                  label="Training Completion" 
                  color="text-blue-500" 
                />
                <CircularProgress 
                  value={stats.safetyComplianceRate} 
                  label="Safety Compliance" 
                  color="text-green-500" 
                />
                <CircularProgress 
                  value={stats.equipmentUtilizationRate} 
                  label="Equipment Utilization" 
                  color="text-amber-500" 
                />
                <CircularProgress 
                  value={requestsData.length > 0 ? Math.round((stats.resolvedRequests / (stats.pendingRequests + stats.resolvedRequests)) * 100) : 0} 
                  label="Request Resolution" 
                  color="text-purple-500" 
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Training Trends</CardTitle>
                <CardDescription>Monthly training registration and completion</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trainingTrendData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="trainees" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="completions" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Safety Observations</CardTitle>
                <CardDescription>Distribution of safety observations by type</CardDescription>
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
                        data={safetyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {safetyData.map((entry, index) => (
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
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>High Priority Requests</CardTitle>
              <CardDescription>Urgent matters requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading high priority requests...</p>
              ) : highPriorityRequests.length > 0 ? (
                <ul className="space-y-2">
                  {highPriorityRequests.map((request) => (
                    <li key={request.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{request.title}</p>
                        <p className="text-sm text-muted-foreground">From: {request.from_email}</p>
                        <p className="text-sm text-muted-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={request.priority === 'urgent' ? 'destructive' : 'default'}>
                          {request.priority}
                        </Badge>
                        <Badge variant={request.status === 'resolved' ? 'outline' : 'secondary'}>
                          {request.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No high priority requests found.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setActiveTab("requests")}>
                View All Requests
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="training" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              title="Completed Training" 
              value={stats.completedTrainees} 
              icon={<CheckCircle2 className="h-4 w-4" />} 
              description="Successfully completed" 
              loading={loading}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Training Completion Rate</CardTitle>
              <CardDescription>Overall training progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Progress</span>
                  <span>{stats.trainingCompletionRate}%</span>
                </div>
                <Progress value={stats.trainingCompletionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Training Status</CardTitle>
                <CardDescription>Distribution of trainee status</CardDescription>
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
                <CardTitle>Training Trends</CardTitle>
                <CardDescription>Monthly training registration and completion</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trainingTrendData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="trainees" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="completions" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="safety" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Safety Observations" 
              value={stats.safetyObservations} 
              icon={<ShieldAlert className="h-4 w-4" />} 
              description="Total safety reports" 
              loading={loading}
            />
            <StatCard 
              title="Safe Acts/Conditions" 
              value={safetyData.filter(item => item.name.includes('Safe')).reduce((sum, item) => sum + item.value, 0)} 
              icon={<CheckCircle2 className="h-4 w-4" />} 
              description="Positive observations" 
              loading={loading}
            />
            <StatCard 
              title="Unsafe Acts/Conditions" 
              value={safetyData.filter(item => item.name.includes('Unsafe')).reduce((sum, item) => sum + item.value, 0)} 
              icon={<AlertCircle className="h-4 w-4" />} 
              description="Requiring attention" 
              loading={loading}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Safety Compliance Rate</CardTitle>
              <CardDescription>Percentage of safe observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Compliance</span>
                  <span>{stats.safetyComplianceRate}%</span>
                </div>
                <Progress value={stats.safetyComplianceRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Safety Observations by Type</CardTitle>
              <CardDescription>Distribution of safety observations</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Safety Observations</CardTitle>
              <CardDescription>Latest safety reports submitted</CardDescription>
            </CardHeader>
            <CardContent>
              <SafetyObservationsList limit={5} />
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                View All Safety Observations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="equipment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Equipment Requests" 
              value={stats.equipmentRequests} 
              icon={<Hammer className="h-4 w-4" />} 
              description="Total equipment requests" 
              loading={loading}
            />
            <StatCard 
              title="Approved Requests" 
              value={equipmentData.find(item => item.name === 'Approved')?.value || 0} 
              icon={<CheckCircle2 className="h-4 w-4" />} 
              description="Approved equipment requests" 
              loading={loading}
            />
            <StatCard 
              title="Pending Requests" 
              value={equipmentData.find(item => item.name === 'Pending')?.value || 0} 
              icon={<ClipboardList className="h-4 w-4" />} 
              description="Awaiting approval" 
              loading={loading}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Equipment Utilization Rate</CardTitle>
              <CardDescription>Percentage of approved equipment requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Utilization</span>
                  <span>{stats.equipmentUtilizationRate}%</span>
                </div>
                <Progress value={stats.equipmentUtilizationRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Equipment Requests by Status</CardTitle>
              <CardDescription>Distribution of equipment request statuses</CardDescription>
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
                      data={equipmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {equipmentData.map((entry, index) => (
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
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Total Requests" 
              value={stats.pendingRequests + stats.resolvedRequests} 
              icon={<MessageSquare className="h-4 w-4" />} 
              description="All requests and complaints" 
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
              title="Resolved Requests" 
              value={stats.resolvedRequests} 
              icon={<CheckCircle2 className="h-4 w-4" />} 
              description="Successfully resolved" 
              loading={loading}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Request Resolution Rate</CardTitle>
              <CardDescription>Percentage of resolved requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Resolution Rate</span>
                  <span>
                    {requestsData.length > 0 
                      ? Math.round((stats.resolvedRequests / (stats.pendingRequests + stats.resolvedRequests)) * 100) 
                      : 0}%
                  </span>
                </div>
                <Progress 
                  value={requestsData.length > 0 
                    ? Math.round((stats.resolvedRequests / (stats.pendingRequests + stats.resolvedRequests)) * 100) 
                    : 0} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
          
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
      </Tabs>
    </DashboardLayout>
  );
};

export default ChiefOperationsOfficerDashboard;