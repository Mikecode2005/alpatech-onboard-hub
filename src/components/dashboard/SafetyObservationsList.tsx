import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, CheckCircle, AlertCircle, Clock, X, ShieldAlert, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SafetyObservation {
  id: string;
  userId: string;
  userName: string;
  observationType: 'safe_act' | 'unsafe_act' | 'safe_condition' | 'unsafe_condition';
  category: string;
  location: string;
  description: string;
  actionTaken?: string;
  submittedAt: string;
  status: 'submitted' | 'in_review' | 'resolved';
  assignedTo?: string;
  resolvedAt?: string;
  resolution?: string;
}

interface SafetyObservationsListProps {
  limit?: number;
  filter?: {
    status?: string;
    type?: string;
  };
}

const SafetyObservationsList = ({ limit, filter }: SafetyObservationsListProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [observations, setObservations] = useState<SafetyObservation[]>([]);
  const [filteredObservations, setFilteredObservations] = useState<SafetyObservation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(filter?.status || "");
  const [typeFilter, setTypeFilter] = useState(filter?.type || "");
  const [selectedObservation, setSelectedObservation] = useState<SafetyObservation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    fetchObservations();
  }, [limit, filter]);

  useEffect(() => {
    filterObservations();
  }, [observations, searchQuery, statusFilter, typeFilter]);

  const fetchObservations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('you_see_u_act')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match our interface
      const transformedData: SafetyObservation[] = (data || []).map(item => ({
        id: item.id,
        userId: item.observer_email,
        userName: item.observer_name || item.observer_email,
        observationType: item.incident_type === 'safe_act' ? 'safe_act' : 
                         item.incident_type === 'unsafe_act' ? 'unsafe_act' : 
                         item.incident_type === 'safe_condition' ? 'safe_condition' : 'unsafe_condition',
        category: item.incident_type || 'Safety Observation',
        location: item.location || 'Work Area',
        description: item.description || '',
        actionTaken: item.immediate_action,
        submittedAt: item.created_at,
        status: 'submitted',
        resolvedAt: undefined,
        resolution: undefined
      }));
      
      setObservations(transformedData);
    } catch (error) {
      console.error("Error fetching safety observations:", error);
      toast({
        title: "Error",
        description: "Failed to load safety observations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterObservations = () => {
    let filtered = [...observations];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (observation) =>
          observation.description.toLowerCase().includes(query) ||
          observation.location.toLowerCase().includes(query) ||
          observation.userName.toLowerCase().includes(query) ||
          observation.category.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((observation) => observation.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter((observation) => observation.observationType === typeFilter);
    }
    
    setFilteredObservations(filtered);
  };

  const handleViewObservation = (observation: SafetyObservation) => {
    setSelectedObservation(observation);
    setIsViewDialogOpen(true);
  };

  const handleResolveObservation = (observation: SafetyObservation) => {
    setSelectedObservation(observation);
    setIsResolveDialogOpen(true);
  };

  const submitResolution = async () => {
    if (!selectedObservation) return;
    
    try {
      const { error } = await supabase
        .from('you_see_u_act')
        .update({
          description: resolution
        })
        .eq('id', selectedObservation.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Safety observation resolved successfully.",
      });
      
      setIsResolveDialogOpen(false);
      setResolution("");
      fetchObservations();
    } catch (error) {
      console.error("Error resolving safety observation:", error);
      toast({
        title: "Error",
        description: "Failed to resolve safety observation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Submitted</Badge>;
      case 'in_review':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> In Review</Badge>;
      case 'resolved':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'safe_act':
        return <Badge variant="success" className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Safe Act</Badge>;
      case 'unsafe_act':
        return <Badge variant="destructive" className="flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Unsafe Act</Badge>;
      case 'safe_condition':
        return <Badge variant="success" className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Safe Condition</Badge>;
      case 'unsafe_condition':
        return <Badge variant="destructive" className="flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Unsafe Condition</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search observations..."
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
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="safe_act">Safe Act</SelectItem>
                <SelectItem value="unsafe_act">Unsafe Act</SelectItem>
                <SelectItem value="safe_condition">Safe Condition</SelectItem>
                <SelectItem value="unsafe_condition">Unsafe Condition</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading safety observations...</p>
        </div>
      ) : filteredObservations.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredObservations.map((observation) => (
              <TableRow key={observation.id}>
                <TableCell>{getTypeBadge(observation.observationType)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{observation.description}</TableCell>
                <TableCell>{observation.location}</TableCell>
                <TableCell>{observation.userName}</TableCell>
                <TableCell>{new Date(observation.submittedAt).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(observation.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewObservation(observation)}>
                      View
                    </Button>
                    {observation.status !== 'resolved' && (
                      <Button variant="default" size="sm" onClick={() => handleResolveObservation(observation)}>
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
          <ShieldAlert className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No safety observations found</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter || typeFilter
              ? "Try adjusting your search or filters"
              : "There are no safety observations at this time"}
          </p>
        </div>
      )}
      
      {/* View Observation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Safety Observation</DialogTitle>
            <DialogDescription>
              {selectedObservation?.category} reported by {selectedObservation?.userName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <div className="p-4 rounded-md border bg-muted/20">
                <p className="whitespace-pre-wrap">{selectedObservation?.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Location</h4>
                <div>{selectedObservation?.location}</div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Date Submitted</h4>
                <div>{selectedObservation?.submittedAt ? new Date(selectedObservation.submittedAt).toLocaleString() : 'N/A'}</div>
              </div>
            </div>
            {selectedObservation?.actionTaken && (
              <div>
                <h4 className="text-sm font-medium mb-2">Action Taken</h4>
                <div className="p-4 rounded-md border bg-muted/20">
                  <p className="whitespace-pre-wrap">{selectedObservation.actionTaken}</p>
                </div>
              </div>
            )}
            {selectedObservation?.status === 'resolved' && selectedObservation?.resolution && (
              <div>
                <h4 className="text-sm font-medium mb-2">Resolution</h4>
                <div className="p-4 rounded-md border bg-muted/20">
                  <p className="whitespace-pre-wrap">{selectedObservation.resolution}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedObservation?.status !== 'resolved' && (
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                handleResolveObservation(selectedObservation);
              }}>
                Resolve
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Resolve Observation Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Resolve Safety Observation</DialogTitle>
            <DialogDescription>
              Provide resolution details for this safety observation
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Resolution Notes</h4>
              <Textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Enter resolution details and actions taken to prevent recurrence..."
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

export default SafetyObservationsList;