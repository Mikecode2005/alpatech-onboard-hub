import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/state/appState";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Eye, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Download 
} from "lucide-react";
import { hasPermission } from "@/lib/rbac";
import * as SupabaseServices from "@/integrations/supabase/services";

interface USeeUActSubmission {
  id: string;
  submittedBy: string;
  submittedAt: string;
  hasSafeActs: boolean;
  hasUnsafeActs: boolean;
  hasSafeConditions: boolean;
  hasUnsafeConditions: boolean;
  hasCorrectiveAction: boolean;
  status: "New" | "Reviewed" | "Action Required" | "Resolved";
}

const YouSeeUActData: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppState((s) => s.user);
  const useeUactSubmissions = useAppState((s) => s.useeUactSubmissions);
  
  const [selectedSubmission, setSelectedSubmission] = useState<USeeUActSubmission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  
  // Mock data for demonstration
  const [submissions, setSubmissions] = useState<USeeUActSubmission[]>([
    {
      id: "1",
      submittedBy: "John Doe",
      submittedAt: "2025-08-25T10:30:00Z",
      hasSafeActs: true,
      hasUnsafeActs: false,
      hasSafeConditions: true,
      hasUnsafeConditions: false,
      hasCorrectiveAction: false,
      status: "New"
    },
    {
      id: "2",
      submittedBy: "Jane Smith",
      submittedAt: "2025-08-24T14:15:00Z",
      hasSafeActs: false,
      hasUnsafeActs: true,
      hasSafeConditions: false,
      hasUnsafeConditions: true,
      hasCorrectiveAction: true,
      status: "Action Required"
    },
    {
      id: "3",
      submittedBy: "Robert Johnson",
      submittedAt: "2025-08-23T09:45:00Z",
      hasSafeActs: true,
      hasUnsafeActs: true,
      hasSafeConditions: true,
      hasUnsafeConditions: false,
      hasCorrectiveAction: true,
      status: "Reviewed"
    },
    {
      id: "4",
      submittedBy: "Sarah Williams",
      submittedAt: "2025-08-20T16:20:00Z",
      hasSafeActs: false,
      hasUnsafeActs: true,
      hasSafeConditions: false,
      hasUnsafeConditions: true,
      hasCorrectiveAction: true,
      status: "Resolved"
    }
  ]);
  
  // Load submissions from state or Supabase
  useEffect(() => {
    // In a real implementation, we would fetch data from Supabase here
    // For now, we'll use the mock data and add any submissions from local state
    
    const localSubmissions = useeUactSubmissions.map((submission, index) => ({
      id: `local-${index}`,
      submittedBy: submission.personnelRemark?.name || user?.name || "Unknown",
      submittedAt: new Date().toISOString(),
      hasSafeActs: !!submission.safeActs,
      hasUnsafeActs: !!submission.unsafeActs,
      hasSafeConditions: !!submission.safeConditions,
      hasUnsafeConditions: !!submission.unsafeConditions,
      hasCorrectiveAction: !!submission.correctiveAction,
      status: "New"
    }));
    
    setSubmissions([...submissions, ...localSubmissions]);
  }, []);
  
  // Filter submissions based on search term and filters
  const filteredSubmissions = submissions.filter(submission => {
    // Search term filter
    const matchesSearch = 
      submission.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === "all" || 
      submission.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Date filter
    let matchesDate = true;
    const submissionDate = new Date(submission.submittedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    if (dateFilter === "today") {
      matchesDate = submissionDate.toDateString() === today.toDateString();
    } else if (dateFilter === "yesterday") {
      matchesDate = submissionDate.toDateString() === yesterday.toDateString();
    } else if (dateFilter === "last7days") {
      matchesDate = submissionDate >= lastWeek;
    } else if (dateFilter === "last30days") {
      matchesDate = submissionDate >= lastMonth;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  const handleViewSubmission = (submission: USeeUActSubmission) => {
    setSelectedSubmission(submission);
    setIsViewDialogOpen(true);
  };
  
  const handleCreateNew = () => {
    navigate("/forms/usee-uact");
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">New</span>;
      case "Reviewed":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Reviewed</span>;
      case "Action Required":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Action Required</span>;
      case "Resolved":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Resolved</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };
  
  const canCreateForms = user && hasPermission(user.role, "submit_usee_uact");
  const canViewAllForms = user && hasPermission(user.role, "view_usee_uact");
  
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>You See U Act Data | Alpatech Training Portal</title>
        <meta name="description" content="View and manage You See U Act submissions" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">You See U Act Submissions</h1>
        
        {canCreateForms && (
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        )}
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="statusFilter" className="whitespace-nowrap">Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="statusFilter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="action required">Action Required</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="dateFilter" className="whitespace-nowrap">Date:</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger id="dateFilter">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
          <TabsTrigger value="unsafe">Unsafe Acts/Conditions</TabsTrigger>
          <TabsTrigger value="safe">Safe Acts/Conditions</TabsTrigger>
          <TabsTrigger value="action">Action Required</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableCaption>List of all You See U Act submissions</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Observations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.id}</TableCell>
                        <TableCell>{submission.submittedBy}</TableCell>
                        <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {submission.hasSafeActs && (
                              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Safe Acts</span>
                            )}
                            {submission.hasUnsafeActs && (
                              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">Unsafe Acts</span>
                            )}
                            {submission.hasSafeConditions && (
                              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Safe Cond.</span>
                            )}
                            {submission.hasUnsafeConditions && (
                              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">Unsafe Cond.</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewSubmission(submission)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No submissions found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unsafe" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Unsafe Acts and Conditions</h3>
              <p className="text-muted-foreground">
                This tab will show submissions with unsafe acts or conditions that need attention.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="safe" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Safe Acts and Conditions</h3>
              <p className="text-muted-foreground">
                This tab will show submissions highlighting safe acts or conditions to be recognized.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="action" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Action Required</h3>
              <p className="text-muted-foreground">
                This tab will show submissions that require immediate action.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* View Submission Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Submitted by {selectedSubmission?.submittedBy} on {selectedSubmission && formatDate(selectedSubmission.submittedAt)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                {selectedSubmission && getStatusBadge(selectedSubmission.status)}
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Observations</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedSubmission?.hasSafeActs && (
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Safe Acts</span>
                  )}
                  {selectedSubmission?.hasUnsafeActs && (
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">Unsafe Acts</span>
                  )}
                  {selectedSubmission?.hasSafeConditions && (
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Safe Conditions</span>
                  )}
                  {selectedSubmission?.hasUnsafeConditions && (
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">Unsafe Conditions</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-muted-foreground text-sm">
                This dialog would show the full details of the submission, including all observations and recommendations.
                In a real implementation, we would fetch the complete submission data from Supabase.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {user && hasPermission(user.role, "manage_requests") && (
              <Button>Update Status</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YouSeeUActData;