import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, CheckCircle, AlertCircle, Clock, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Request {
  id: string;
  type: string;
  title: string;
  description: string;
  from_email: string;
  to_role: string;
  status: string;
  created_at: string;
  resolved_at?: string;
  priority?: string;
}

interface RequestsListProps {
  limit?: number;
  filter?: {
    status?: string;
    type?: string;
    priority?: string;
  };
}

const RequestsList = ({ limit, filter }: RequestsListProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(filter?.status || "");
  const [typeFilter, setTypeFilter] = useState(filter?.type || "");
  const [priorityFilter, setPriorityFilter] = useState(filter?.priority || "");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [limit, filter]);

  useEffect(() => {
    filterRequests();
  }, [requests, searchQuery, statusFilter, typeFilter, priorityFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('requests_complaints')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to load requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query) ||
          request.from_email.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter((request) => request.type === typeFilter);
    }
    
    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter((request) => request.priority === priorityFilter);
    }
    
    setFilteredRequests(filtered);
  };

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleResolveRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsResolveDialogOpen(true);
  };

  const submitResolution = async () => {
    if (!selectedRequest) return;
    
    try {
      const { error } = await supabase
        .from('requests_complaints')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution: resolution
        })
        .eq('id', selectedRequest.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Request resolved successfully.",
      });
      
      setIsResolveDialogOpen(false);
      setResolution("");
      fetchRequests();
    } catch (error) {
      console.error("Error resolving request:", error);
      toast({
        title: "Error",
        description: "Failed to resolve request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'in_review':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> In Review</Badge>;
      case 'resolved':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Resolved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><X className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    switch (priority) {
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="request">Request</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading requests...</p>
        </div>
      ) : filteredRequests.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {request.type === 'request' ? 'Request' : 'Complaint'}
                  </Badge>
                </TableCell>
                <TableCell>{request.from_email}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewRequest(request)}>
                      View
                    </Button>
                    {request.status !== 'resolved' && request.status !== 'rejected' && (
                      <Button variant="default" size="sm" onClick={() => handleResolveRequest(request)}>
                        Resolve
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No requests found</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter || typeFilter || priorityFilter
              ? "Try adjusting your search or filters"
              : "There are no requests or complaints at this time"}
          </p>
        </div>
      )}
      
      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedRequest?.title}</DialogTitle>
            <DialogDescription>
              {selectedRequest?.type === 'request' ? 'Request' : 'Complaint'} from {selectedRequest?.from_email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <div className="p-4 rounded-md border bg-muted/20">
                <p className="whitespace-pre-wrap">{selectedRequest?.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <div>{getStatusBadge(selectedRequest?.status || 'pending')}</div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Date Submitted</h4>
                <div>{selectedRequest?.created_at ? new Date(selectedRequest.created_at).toLocaleString() : 'N/A'}</div>
              </div>
            </div>
            {selectedRequest?.status === 'resolved' && (
              <div>
                <h4 className="text-sm font-medium mb-2">Resolution Date</h4>
                <div>{selectedRequest?.resolved_at ? new Date(selectedRequest.resolved_at).toLocaleString() : 'N/A'}</div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedRequest?.status !== 'resolved' && selectedRequest?.status !== 'rejected' && (
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                handleResolveRequest(selectedRequest);
              }}>
                Resolve
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Resolve Request Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Resolve {selectedRequest?.type === 'request' ? 'Request' : 'Complaint'}</DialogTitle>
            <DialogDescription>
              Provide resolution details for "{selectedRequest?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Resolution Notes</h4>
              <Textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Enter resolution details..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitResolution}>
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestsList;