import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseServices } from '@/integrations/supabase/services';
import { 
  getTrainingCompletionStats, 
  getTrainingCompletionTrend,
  getSafetyStats,
  getSafetyTrend,
  getEquipmentStats,
  getEquipmentByCategory,
  getFormCompletionStats,
  getAverageCompletionTime
} from '@/lib/analytics';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import StatCard from '@/components/charts/StatCard';
import DataTable from '@/components/charts/DataTable';
import PDFExport from '@/components/PDFExport';
import { jsPDF } from 'jspdf';
import { format, subDays } from 'date-fns';
import { 
  Users, 
  Award, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  Package,
  Clock,
  Download
} from 'lucide-react';

const ExecutiveDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabaseServices = useSupabaseServices();
  
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for demonstration
  const [trainingStats, setTrainingStats] = useState({
    totalTrainees: 120,
    activeTrainees: 45,
    completedTrainees: 75,
    upcomingTrainingSets: 3,
    completionRate: 0.85
  });
  
  const [safetyStats, setSafetyStats] = useState({
    totalObservations: 87,
    safeActs: 32,
    unsafeActs: 18,
    safeConditions: 25,
    unsafeConditions: 12,
    resolvedObservations: 65,
    pendingObservations: 22
  });
  
  const [equipmentStats, setEquipmentStats] = useState({
    totalEquipment: 250,
    availableEquipment: 180,
    lowStockItems: 8,
    activeRequests: 12,
    overdueReturns: 5
  });
  
  const [trainingTrend, setTrainingTrend] = useState([
    { date: 'Aug 1', completed: 60, active: 40 },
    { date: 'Aug 8', completed: 65, active: 38 },
    { date: 'Aug 15', completed: 70, active: 35 },
    { date: 'Aug 22', completed: 75, active: 45 }
  ]);
  
  const [safetyTrend, setSafetyTrend] = useState([
    { date: 'Aug 1', safe: 12, unsafe: 8 },
    { date: 'Aug 8', safe: 15, unsafe: 7 },
    { date: 'Aug 15', safe: 18, unsafe: 6 },
    { date: 'Aug 22', safe: 22, unsafe: 9 }
  ]);
  
  const [equipmentByCategory, setEquipmentByCategory] = useState([
    { name: 'PPE', value: 120, color: '#0088FE' },
    { name: 'Safety Equipment', value: 80, color: '#00C49F' },
    { name: 'Medical', value: 40, color: '#FFBB28' },
    { name: 'Training Tools', value: 30, color: '#FF8042' }
  ]);
  
  const [formCompletionStats, setFormCompletionStats] = useState([
    { name: 'Welcome Policy', completed: 110, pending: 10 },
    { name: 'Course Registration', completed: 105, pending: 15 },
    { name: 'Medical Screening', completed: 95, pending: 25 },
    { name: 'BOSIET', completed: 70, pending: 50 },
    { name: 'Fire Watch', completed: 65, pending: 55 },
    { name: 'CSE&R', completed: 60, pending: 60 }
  ]);
  
  const [averageCompletionTime, setAverageCompletionTime] = useState(14);
  
  const [recentTrainees, setRecentTrainees] = useState([
    { id: '001', name: 'John Doe', email: 'john.doe@example.com', trainingSet: 'Offshore Group A', status: 'completed', completionDate: '2025-08-20' },
    { id: '002', name: 'Jane Smith', email: 'jane.smith@example.com', trainingSet: 'Offshore Group A', status: 'completed', completionDate: '2025-08-19' },
    { id: '003', name: 'Michael Johnson', email: 'michael.johnson@example.com', trainingSet: 'Onshore Group B', status: 'active', completionDate: null },
    { id: '004', name: 'Sarah Williams', email: 'sarah.williams@example.com', trainingSet: 'Offshore Group C', status: 'active', completionDate: null },
    { id: '005', name: 'Robert Brown', email: 'robert.brown@example.com', trainingSet: 'Onshore Group B', status: 'completed', completionDate: '2025-08-15' }
  ]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch data from Supabase
        // and use the analytics functions to process it
        
        // For now, we'll just simulate a loading delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);
  
  // Generate dashboard PDF
  const generateDashboardPDF = async (): Promise<jsPDF> => {
    const doc = new jsPDF();
    let y = 20;
    
    // Add title
    doc.setFontSize(16);
    doc.text('Executive Dashboard Report', 15, y);
    y += 10;
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 15, y);
    doc.text(`Reporting Period: Last ${dateRange} days`, 15, y + 5);
    y += 15;
    
    // Add training stats
    doc.setFontSize(14);
    doc.text('Training Overview', 15, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.text(`Total Trainees: ${trainingStats.totalTrainees}`, 15, y);
    doc.text(`Active Trainees: ${trainingStats.activeTrainees}`, 15, y + 5);
    doc.text(`Completed Trainees: ${trainingStats.completedTrainees}`, 15, y + 10);
    doc.text(`Completion Rate: ${(trainingStats.completionRate * 100).toFixed(1)}%`, 15, y + 15);
    doc.text(`Average Completion Time: ${averageCompletionTime} days`, 15, y + 20);
    y += 30;
    
    // Add safety stats
    doc.setFontSize(14);
    doc.text('Safety Observations', 15, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.text(`Total Observations: ${safetyStats.totalObservations}`, 15, y);
    doc.text(`Safe Acts: ${safetyStats.safeActs}`, 15, y + 5);
    doc.text(`Unsafe Acts: ${safetyStats.unsafeActs}`, 15, y + 10);
    doc.text(`Safe Conditions: ${safetyStats.safeConditions}`, 15, y + 15);
    doc.text(`Unsafe Conditions: ${safetyStats.unsafeConditions}`, 15, y + 20);
    doc.text(`Resolved: ${safetyStats.resolvedObservations}`, 15, y + 25);
    doc.text(`Pending: ${safetyStats.pendingObservations}`, 15, y + 30);
    y += 40;
    
    // Add equipment stats
    doc.setFontSize(14);
    doc.text('Equipment Status', 15, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.text(`Total Equipment: ${equipmentStats.totalEquipment}`, 15, y);
    doc.text(`Available Equipment: ${equipmentStats.availableEquipment}`, 15, y + 5);
    doc.text(`Low Stock Items: ${equipmentStats.lowStockItems}`, 15, y + 10);
    doc.text(`Active Requests: ${equipmentStats.activeRequests}`, 15, y + 15);
    doc.text(`Overdue Returns: ${equipmentStats.overdueReturns}`, 15, y + 20);
    
    // Add a new page for form completion stats
    doc.addPage();
    y = 20;
    
    doc.setFontSize(14);
    doc.text('Form Completion Statistics', 15, y);
    y += 10;
    
    doc.setFontSize(10);
    formCompletionStats.forEach((form, index) => {
      const completionRate = form.completed / (form.completed + form.pending) * 100;
      doc.text(`${form.name}: ${completionRate.toFixed(1)}% (${form.completed}/${form.completed + form.pending})`, 15, y + (index * 7));
    });
    
    return doc;
  };

  return (
    <>
      <Helmet>
        <title>Executive Dashboard - Alpatech Training Centre</title>
        <meta name="description" content="Executive dashboard with key metrics and performance indicators" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Executive Dashboard</h1>
              <p className="text-muted-foreground">Key metrics and performance indicators</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Period:</span>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="180">Last 180 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <PDFExport
                generatePDF={generateDashboardPDF}
                filename="executive_dashboard_report.pdf"
                label="Export Report"
              />
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      title="Total Trainees"
                      value={trainingStats.totalTrainees}
                      icon={<Users />}
                      trend={{
                        value: 8,
                        isPositive: true,
                        label: "vs. last period"
                      }}
                    />
                    <StatCard
                      title="Completion Rate"
                      value={`${(trainingStats.completionRate * 100).toFixed(1)}%`}
                      icon={<Award />}
                      trend={{
                        value: 5.2,
                        isPositive: true,
                        label: "vs. last period"
                      }}
                    />
                    <StatCard
                      title="Safety Observations"
                      value={safetyStats.totalObservations}
                      icon={<ShieldCheck />}
                      trend={{
                        value: 12.5,
                        isPositive: true,
                        label: "vs. last period"
                      }}
                    />
                    <StatCard
                      title="Equipment Availability"
                      value={`${(equipmentStats.availableEquipment / equipmentStats.totalEquipment * 100).toFixed(1)}%`}
                      icon={<Package />}
                      trend={{
                        value: 3.1,
                        isPositive: false,
                        label: "vs. last period"
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LineChart
                      title="Training Progress"
                      description="Completed vs. Active Trainees"
                      data={trainingTrend}
                      xAxisDataKey="date"
                      lines={[
                        { dataKey: "completed", name: "Completed", color: "#10B981" },
                        { dataKey: "active", name: "Active", color: "#3B82F6" }
                      ]}
                      height={300}
                    />
                    <LineChart
                      title="Safety Observations"
                      description="Safe vs. Unsafe Observations"
                      data={safetyTrend}
                      xAxisDataKey="date"
                      lines={[
                        { dataKey: "safe", name: "Safe", color: "#10B981" },
                        { dataKey: "unsafe", name: "Unsafe", color: "#EF4444" }
                      ]}
                      height={300}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChart
                      title="Form Completion"
                      description="Completed vs. Pending Forms"
                      data={formCompletionStats}
                      xAxisDataKey="name"
                      bars={[
                        { dataKey: "completed", name: "Completed", color: "#10B981" },
                        { dataKey: "pending", name: "Pending", color: "#F59E0B" }
                      ]}
                      height={300}
                      stacked={true}
                    />
                    <PieChart
                      title="Equipment by Category"
                      description="Distribution of Equipment by Category"
                      data={equipmentByCategory}
                      height={300}
                    />
                  </div>
                  
                  <DataTable
                    title="Recent Trainees"
                    data={recentTrainees}
                    columns={[
                      { header: "ID", accessorKey: "id" },
                      { header: "Name", accessorKey: "name" },
                      { header: "Email", accessorKey: "email" },
                      { header: "Training Set", accessorKey: "trainingSet" },
                      { 
                        header: "Status", 
                        accessorKey: "status",
                        cell: (row) => (
                          <Badge variant={row.status === 'completed' ? 'success' : 'default'}>
                            {row.status.toUpperCase()}
                          </Badge>
                        )
                      },
                      { 
                        header: "Completion Date", 
                        accessorKey: "completionDate",
                        cell: (row) => row.completionDate ? format(new Date(row.completionDate), 'PP') : 'N/A'
                      }
                    ]}
                    searchable={true}
                    pagination={true}
                    pageSize={5}
                    exportData={true}
                    exportFilename="recent_trainees"
                  />
                </div>
              )}
            </TabsContent>
            
            {/* Training Tab */}
            <TabsContent value="training">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      title="Total Trainees"
                      value={trainingStats.totalTrainees}
                      icon={<Users />}
                    />
                    <StatCard
                      title="Active Trainees"
                      value={trainingStats.activeTrainees}
                      icon={<Users />}
                    />
                    <StatCard
                      title="Completed Trainees"
                      value={trainingStats.completedTrainees}
                      icon={<Award />}
                    />
                    <StatCard
                      title="Avg. Completion Time"
                      value={`${averageCompletionTime} days`}
                      icon={<Clock />}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LineChart
                      title="Training Progress Over Time"
                      description="Completed vs. Active Trainees"
                      data={trainingTrend}
                      xAxisDataKey="date"
                      lines={[
                        { dataKey: "completed", name: "Completed", color: "#10B981" },
                        { dataKey: "active", name: "Active", color: "#3B82F6" }
                      ]}
                      height={300}
                    />
                    <BarChart
                      title="Form Completion"
                      description="Completed vs. Pending Forms"
                      data={formCompletionStats}
                      xAxisDataKey="name"
                      bars={[
                        { dataKey: "completed", name: "Completed", color: "#10B981" },
                        { dataKey: "pending", name: "Pending", color: "#F59E0B" }
                      ]}
                      height={300}
                      stacked={true}
                    />
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Training Performance</CardTitle>
                      <CardDescription>Key training metrics and performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Overall Completion Rate</span>
                          <span className="text-sm font-medium">{(trainingStats.completionRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${trainingStats.completionRate * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="pt-4">
                          <h4 className="text-sm font-medium mb-2">Form Completion Rates</h4>
                          {formCompletionStats.map((form, index) => {
                            const total = form.completed + form.pending;
                            const percentage = total > 0 ? (form.completed / total * 100) : 0;
                            
                            return (
                              <div key={index} className="mb-4">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm">{form.name}</span>
                                  <span className="text-sm">{percentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Safety Tab */}
            <TabsContent value="safety">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      title="Total Observations"
                      value={safetyStats.totalObservations}
                      icon={<ShieldCheck />}
                    />
                    <StatCard
                      title="Safe Observations"
                      value={safetyStats.safeActs + safetyStats.safeConditions}
                      valueClassName="text-green-500"
                      icon={<ShieldCheck />}
                    />
                    <StatCard
                      title="Unsafe Observations"
                      value={safetyStats.unsafeActs + safetyStats.unsafeConditions}
                      valueClassName="text-red-500"
                      icon={<AlertTriangle />}
                    />
                    <StatCard
                      title="Resolution Rate"
                      value={`${(safetyStats.resolvedObservations / safetyStats.totalObservations * 100).toFixed(1)}%`}
                      icon={<TrendingUp />}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LineChart
                      title="Safety Observations Over Time"
                      description="Safe vs. Unsafe Observations"
                      data={safetyTrend}
                      xAxisDataKey="date"
                      lines={[
                        { dataKey: "safe", name: "Safe", color: "#10B981" },
                        { dataKey: "unsafe", name: "Unsafe", color: "#EF4444" }
                      ]}
                      height={300}
                    />
                    <PieChart
                      title="Observation Types"
                      description="Distribution of Safety Observations"
                      data={[
                        { name: "Safe Acts", value: safetyStats.safeActs, color: "#10B981" },
                        { name: "Unsafe Acts", value: safetyStats.unsafeActs, color: "#EF4444" },
                        { name: "Safe Conditions", value: safetyStats.safeConditions, color: "#3B82F6" },
                        { name: "Unsafe Conditions", value: safetyStats.unsafeConditions, color: "#F59E0B" }
                      ]}
                      height={300}
                    />
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Safety Performance</CardTitle>
                      <CardDescription>Key safety metrics and performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Resolution Rate</span>
                          <span className="text-sm font-medium">
                            {(safetyStats.resolvedObservations / safetyStats.totalObservations * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${safetyStats.resolvedObservations / safetyStats.totalObservations * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="pt-4">
                          <h4 className="text-sm font-medium mb-2">Observation Breakdown</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Safe Acts</span>
                                <span className="text-sm">{safetyStats.safeActs}</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${safetyStats.safeActs / safetyStats.totalObservations * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Unsafe Acts</span>
                                <span className="text-sm">{safetyStats.unsafeActs}</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full" 
                                  style={{ width: `${safetyStats.unsafeActs / safetyStats.totalObservations * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Safe Conditions</span>
                                <span className="text-sm">{safetyStats.safeConditions}</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${safetyStats.safeConditions / safetyStats.totalObservations * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Unsafe Conditions</span>
                                <span className="text-sm">{safetyStats.unsafeConditions}</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-amber-500 h-2 rounded-full" 
                                  style={{ width: `${safetyStats.unsafeConditions / safetyStats.totalObservations * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Equipment Tab */}
            <TabsContent value="equipment">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      title="Total Equipment"
                      value={equipmentStats.totalEquipment}
                      icon={<Package />}
                    />
                    <StatCard
                      title="Available Equipment"
                      value={equipmentStats.availableEquipment}
                      icon={<Package />}
                    />
                    <StatCard
                      title="Low Stock Items"
                      value={equipmentStats.lowStockItems}
                      valueClassName="text-amber-500"
                      icon={<AlertTriangle />}
                    />
                    <StatCard
                      title="Overdue Returns"
                      value={equipmentStats.overdueReturns}
                      valueClassName="text-red-500"
                      icon={<Clock />}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PieChart
                      title="Equipment by Category"
                      description="Distribution of Equipment by Category"
                      data={equipmentByCategory}
                      height={300}
                    />
                    <BarChart
                      title="Equipment Availability"
                      description="Available vs. In Use Equipment"
                      data={[
                        { name: 'PPE', available: 90, inUse: 30 },
                        { name: 'Safety Equipment', available: 60, inUse: 20 },
                        { name: 'Medical', available: 30, inUse: 10 },
                        { name: 'Training Tools', available: 20, inUse: 10 }
                      ]}
                      xAxisDataKey="name"
                      bars={[
                        { dataKey: "available", name: "Available", color: "#10B981" },
                        { dataKey: "inUse", name: "In Use", color: "#3B82F6" }
                      ]}
                      height={300}
                      stacked={true}
                    />
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Equipment Status</CardTitle>
                      <CardDescription>Current equipment status and utilization</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Overall Availability</span>
                          <span className="text-sm font-medium">
                            {(equipmentStats.availableEquipment / equipmentStats.totalEquipment * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${equipmentStats.availableEquipment / equipmentStats.totalEquipment * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="pt-4">
                          <h4 className="text-sm font-medium mb-2">Equipment Requests</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Active Requests</span>
                                <span className="text-sm">{equipmentStats.activeRequests}</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: '100%' }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Overdue Returns</span>
                                <span className="text-sm">{equipmentStats.overdueReturns}</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full" 
                                  style={{ width: '100%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ExecutiveDashboard;