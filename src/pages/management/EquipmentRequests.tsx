import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseServices } from '@/integrations/supabase/services';
import { EquipmentItem, EquipmentRequest, EquipmentRequestItem } from '@/integrations/supabase/types';
import { Plus, Trash, AlertCircle, CheckCircle, XCircle, Clock, FileDown } from 'lucide-react';
import PDFExport from '@/components/PDFExport';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

interface RequestItemInput {
  equipmentId: string;
  equipmentName: string;
  quantity: number;
}

const EquipmentRequests: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabaseServices = useSupabaseServices();
  
  // State for equipment inventory
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([]);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true);
  
  // State for equipment requests
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  // State for new request form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [trainingSet, setTrainingSet] = useState('');
  const [notes, setNotes] = useState('');
  const [requestItems, setRequestItems] = useState<RequestItemInput[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for request details dialog
  const [selectedRequest, setSelectedRequest] = useState<EquipmentRequest | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Fetch equipment inventory
  useEffect(() => {
    const fetchEquipment = async () => {
      setIsLoadingEquipment(true);
      try {
        // This would be replaced with actual Supabase call
        // const { data, error } = await supabaseServices.getEquipmentInventory();
        
        // Mock data for demonstration
        const mockEquipment: EquipmentItem[] = [
          {
            id: '1',
            name: 'Safety Helmet',
            description: 'Standard safety helmet for construction sites',
            category: 'PPE',
            totalQuantity: 50,
            availableQuantity: 35,
            unit: 'piece',
            location: 'Main Storage',
            minStockLevel: 10,
            createdAt: '2025-08-01T00:00:00Z',
            updatedAt: '2025-08-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'Safety Boots',
            description: 'Steel-toed safety boots',
            category: 'PPE',
            totalQuantity: 40,
            availableQuantity: 25,
            unit: 'pair',
            location: 'Main Storage',
            minStockLevel: 8,
            createdAt: '2025-08-01T00:00:00Z',
            updatedAt: '2025-08-01T00:00:00Z'
          },
          {
            id: '3',
            name: 'Fire Extinguisher',
            description: 'Type ABC fire extinguisher',
            category: 'Safety Equipment',
            totalQuantity: 20,
            availableQuantity: 15,
            unit: 'piece',
            location: 'Safety Room',
            minStockLevel: 5,
            createdAt: '2025-08-01T00:00:00Z',
            updatedAt: '2025-08-01T00:00:00Z'
          },
          {
            id: '4',
            name: 'First Aid Kit',
            description: 'Complete first aid kit for emergencies',
            category: 'Medical',
            totalQuantity: 15,
            availableQuantity: 12,
            unit: 'kit',
            location: 'Medical Room',
            minStockLevel: 3,
            createdAt: '2025-08-01T00:00:00Z',
            updatedAt: '2025-08-01T00:00:00Z'
          },
          {
            id: '5',
            name: 'Safety Gloves',
            description: 'Cut-resistant safety gloves',
            category: 'PPE',
            totalQuantity: 100,
            availableQuantity: 75,
            unit: 'pair',
            location: 'Main Storage',
            minStockLevel: 20,
            createdAt: '2025-08-01T00:00:00Z',
            updatedAt: '2025-08-01T00:00:00Z'
          }
        ];
        
        setEquipmentItems(mockEquipment);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        toast({
          title: 'Error',
          description: 'Failed to load equipment inventory',
          variant: 'destructive'
        });
      } finally {
        setIsLoadingEquipment(false);
      }
    };
    
    fetchEquipment();
  }, []);
  
  // Fetch equipment requests
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoadingRequests(true);
      try {
        // This would be replaced with actual Supabase call
        // const { data, error } = await supabaseServices.getEquipmentRequests();
        
        // Mock data for demonstration
        const mockRequests: EquipmentRequest[] = [
          {
            id: '1',
            requesterId: 'user1',
            requesterName: 'John Doe',
            requesterRole: 'instructor',
            purpose: 'Training session on fire safety',
            trainingSet: 'Offshore Group A',
            status: 'pending',
            notes: 'Needed for the upcoming training session',
            requestedAt: '2025-08-20T10:00:00Z',
            updatedAt: '2025-08-20T10:00:00Z',
            returnDueDate: '2025-08-25T17:00:00Z',
            items: [
              {
                id: '101',
                requestId: '1',
                equipmentId: '3',
                equipmentName: 'Fire Extinguisher',
                quantity: 5,
                status: 'pending',
              },
              {
                id: '102',
                requestId: '1',
                equipmentId: '5',
                equipmentName: 'Safety Gloves',
                quantity: 10,
                status: 'pending',
              }
            ]
          },
          {
            id: '2',
            requesterId: 'user2',
            requesterName: 'Jane Smith',
            requesterRole: 'training_supervisor',
            purpose: 'BOSIET training equipment',
            trainingSet: 'Offshore Group B',
            status: 'approved',
            notes: 'Priority for upcoming BOSIET session',
            requestedAt: '2025-08-18T09:30:00Z',
            updatedAt: '2025-08-19T14:00:00Z',
            approvedBy: 'admin1',
            approvedAt: '2025-08-19T14:00:00Z',
            returnDueDate: '2025-08-26T17:00:00Z',
            items: [
              {
                id: '201',
                requestId: '2',
                equipmentId: '1',
                equipmentName: 'Safety Helmet',
                quantity: 15,
                status: 'approved',
              },
              {
                id: '202',
                requestId: '2',
                equipmentId: '2',
                equipmentName: 'Safety Boots',
                quantity: 15,
                status: 'approved',
              },
              {
                id: '203',
                requestId: '2',
                equipmentId: '4',
                equipmentName: 'First Aid Kit',
                quantity: 3,
                status: 'approved',
              }
            ]
          },
          {
            id: '3',
            requesterId: 'user3',
            requesterName: 'Michael Johnson',
            requesterRole: 'instructor',
            purpose: 'Fire Watch training',
            trainingSet: 'Onshore Group C',
            status: 'rejected',
            notes: 'Equipment not available for the requested dates',
            requestedAt: '2025-08-15T11:20:00Z',
            updatedAt: '2025-08-16T09:15:00Z',
            approvedBy: 'admin2',
            approvedAt: '2025-08-16T09:15:00Z',
            returnDueDate: '2025-08-20T17:00:00Z',
            items: [
              {
                id: '301',
                requestId: '3',
                equipmentId: '3',
                equipmentName: 'Fire Extinguisher',
                quantity: 10,
                status: 'rejected',
                notes: 'Not enough available for the requested dates'
              }
            ]
          }
        ];
        
        setRequests(mockRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast({
          title: 'Error',
          description: 'Failed to load equipment requests',
          variant: 'destructive'
        });
      } finally {
        setIsLoadingRequests(false);
      }
    };
    
    fetchRequests();
  }, []);
  
  // Filter requests based on active tab
  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  });
  
  // Add item to request
  const addItemToRequest = () => {
    if (!selectedEquipmentId || selectedQuantity <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please select equipment and enter a valid quantity',
        variant: 'destructive'
      });
      return;
    }
    
    const selectedEquipment = equipmentItems.find(item => item.id === selectedEquipmentId);
    if (!selectedEquipment) {
      toast({
        title: 'Error',
        description: 'Selected equipment not found',
        variant: 'destructive'
      });
      return;
    }
    
    if (selectedQuantity > selectedEquipment.availableQuantity) {
      toast({
        title: 'Invalid Quantity',
        description: `Only ${selectedEquipment.availableQuantity} ${selectedEquipment.unit}(s) available`,
        variant: 'destructive'
      });
      return;
    }
    
    // Check if item already exists in the request
    const existingItemIndex = requestItems.findIndex(item => item.equipmentId === selectedEquipmentId);
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...requestItems];
      updatedItems[existingItemIndex].quantity += selectedQuantity;
      setRequestItems(updatedItems);
    } else {
      // Add new item
      setRequestItems([
        ...requestItems,
        {
          equipmentId: selectedEquipmentId,
          equipmentName: selectedEquipment.name,
          quantity: selectedQuantity
        }
      ]);
    }
    
    // Reset selection
    setSelectedEquipmentId('');
    setSelectedQuantity(1);
  };
  
  // Remove item from request
  const removeItemFromRequest = (index: number) => {
    const updatedItems = [...requestItems];
    updatedItems.splice(index, 1);
    setRequestItems(updatedItems);
  };
  
  // Submit equipment request
  const submitRequest = async () => {
    if (!purpose) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a purpose for the request',
        variant: 'destructive'
      });
      return;
    }
    
    if (requestItems.length === 0) {
      toast({
        title: 'No Items',
        description: 'Please add at least one item to the request',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would be replaced with actual Supabase call
      // const { data, error } = await supabaseServices.createEquipmentRequest({
      //   requesterId: 'current-user-id',
      //   requesterName: 'Current User Name',
      //   requesterRole: 'Current User Role',
      //   purpose,
      //   trainingSet,
      //   notes,
      //   requestedAt: new Date().toISOString(),
      //   returnDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      // }, requestItems);
      
      // Mock successful submission
      setTimeout(() => {
        toast({
          title: 'Request Submitted',
          description: 'Your equipment request has been submitted successfully',
        });
        
        // Reset form and close dialog
        setPurpose('');
        setTrainingSet('');
        setNotes('');
        setRequestItems([]);
        setIsDialogOpen(false);
        setIsSubmitting(false);
        
        // Add the new request to the list (in a real app, we would fetch the updated list)
        const newRequest: EquipmentRequest = {
          id: `new-${Date.now()}`,
          requesterId: 'current-user-id',
          requesterName: 'Current User Name',
          requesterRole: 'instructor',
          purpose,
          trainingSet,
          status: 'pending',
          notes,
          requestedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          returnDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          items: requestItems.map((item, index) => ({
            id: `new-item-${index}`,
            requestId: `new-${Date.now()}`,
            equipmentId: item.equipmentId,
            equipmentName: item.equipmentName,
            quantity: item.quantity,
            status: 'pending'
          }))
        };
        
        setRequests([newRequest, ...requests]);
      }, 1000);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit equipment request',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };
  
  // View request details
  const viewRequestDetails = (request: EquipmentRequest) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };
  
  // Generate PDF for a request
  const generateRequestPDF = async (request: EquipmentRequest): Promise<jsPDF> => {
    const doc = new jsPDF();
    let y = 20;
    
    // Add title
    doc.setFontSize(16);
    doc.text('Equipment Request', 15, y);
    y += 10;
    
    // Add request details
    doc.setFontSize(12);
    doc.text(`Request ID: ${request.id}`, 15, y);
    y += 7;
    doc.text(`Requester: ${request.requesterName} (${request.requesterRole})`, 15, y);
    y += 7;
    doc.text(`Date: ${format(new Date(request.requestedAt), 'PPP')}`, 15, y);
    y += 7;
    doc.text(`Purpose: ${request.purpose}`, 15, y);
    y += 7;
    
    if (request.trainingSet) {
      doc.text(`Training Set: ${request.trainingSet}`, 15, y);
      y += 7;
    }
    
    doc.text(`Status: ${request.status.toUpperCase()}`, 15, y);
    y += 7;
    
    if (request.notes) {
      doc.text(`Notes: ${request.notes}`, 15, y);
      y += 7;
    }
    
    if (request.approvedBy && request.approvedAt) {
      doc.text(`Approved By: ${request.approvedBy}`, 15, y);
      y += 7;
      doc.text(`Approved Date: ${format(new Date(request.approvedAt), 'PPP')}`, 15, y);
      y += 7;
    }
    
    if (request.returnDueDate) {
      doc.text(`Return Due Date: ${format(new Date(request.returnDueDate), 'PPP')}`, 15, y);
      y += 7;
    }
    
    // Add separator
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, 195, y);
    y += 10;
    
    // Add items table header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Equipment', 15, y);
    doc.text('Quantity', 120, y);
    doc.text('Status', 160, y);
    y += 7;
    
    // Add separator
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, 195, y);
    y += 7;
    
    // Add items
    doc.setFont('helvetica', 'normal');
    request.items.forEach(item => {
      doc.text(item.equipmentName, 15, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(item.status.toUpperCase(), 160, y);
      y += 7;
    });
    
    return doc;
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'returned':
        return 'default';
      case 'partially_returned':
        return 'warning';
      default:
        return 'outline';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Equipment Requests - Alpatech Training Centre</title>
        <meta name="description" content="Request and manage equipment for training sessions" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Equipment Requests</h1>
              <p className="text-muted-foreground">Request and manage equipment for training sessions</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Request Equipment</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to request equipment for your training session.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Input
                        id="purpose"
                        placeholder="Purpose of the equipment request"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trainingSet">Training Set (Optional)</Label>
                      <Input
                        id="trainingSet"
                        placeholder="Training set name"
                        value={trainingSet}
                        onChange={(e) => setTrainingSet(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes or requirements"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Add Equipment</h4>
                      
                      <div className="flex gap-2">
                        <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select equipment" />
                          </SelectTrigger>
                          <SelectContent>
                            {equipmentItems.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name} ({item.availableQuantity} available)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          type="number"
                          min="1"
                          placeholder="Quantity"
                          value={selectedQuantity}
                          onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 0)}
                          className="w-[100px]"
                        />
                        
                        <Button type="button" onClick={addItemToRequest}>Add</Button>
                      </div>
                      
                      {requestItems.length > 0 ? (
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Equipment</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {requestItems.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{item.equipmentName}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeItemFromRequest(index)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No items added yet
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={submitRequest} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Equipment Requests</CardTitle>
              <CardDescription>
                View and manage equipment requests for training sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  <TabsTrigger value="returned">Returned</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab}>
                  {isLoadingRequests ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredRequests.length > 0 ? (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Requester</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Training Set</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{request.requesterName}</TableCell>
                              <TableCell>{request.purpose}</TableCell>
                              <TableCell>{request.trainingSet || 'N/A'}</TableCell>
                              <TableCell>{format(new Date(request.requestedAt), 'PP')}</TableCell>
                              <TableCell>{request.items.length}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(request.status)} className="flex items-center gap-1">
                                  {getStatusIcon(request.status)}
                                  {request.status.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => viewRequestDetails(request)}
                                  >
                                    View
                                  </Button>
                                  <PDFExport
                                    generatePDF={() => generateRequestPDF(request)}
                                    filename={`equipment_request_${request.id}.pdf`}
                                    label=""
                                    variant="outline"
                                    size="sm"
                                    showPreview={false}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No equipment requests found.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Request Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Equipment request information and status
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Requester</h4>
                  <p>{selectedRequest.requesterName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
                  <p>{selectedRequest.requesterRole}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p>{format(new Date(selectedRequest.requestedAt), 'PPP')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <Badge variant={getStatusBadgeVariant(selectedRequest.status)} className="mt-1">
                    {selectedRequest.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Purpose</h4>
                  <p>{selectedRequest.purpose}</p>
                </div>
                {selectedRequest.trainingSet && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Training Set</h4>
                    <p>{selectedRequest.trainingSet}</p>
                  </div>
                )}
                {selectedRequest.notes && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                    <p>{selectedRequest.notes}</p>
                  </div>
                )}
                {selectedRequest.approvedBy && selectedRequest.approvedAt && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Approved By</h4>
                      <p>{selectedRequest.approvedBy}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Approved Date</h4>
                      <p>{format(new Date(selectedRequest.approvedAt), 'PPP')}</p>
                    </div>
                  </>
                )}
                {selectedRequest.returnDueDate && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Return Due Date</h4>
                    <p>{format(new Date(selectedRequest.returnDueDate), 'PPP')}</p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Requested Items</h4>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRequest.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.equipmentName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(item.status)}>
                              {item.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {selectedRequest.status === 'rejected' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Request Rejected</AlertTitle>
                  <AlertDescription>
                    {selectedRequest.notes || 'This request has been rejected.'}
                  </AlertDescription>
                </Alert>
              )}
              
              <DialogFooter>
                <PDFExport
                  generatePDF={() => generateRequestPDF(selectedRequest)}
                  filename={`equipment_request_${selectedRequest.id}.pdf`}
                  label="Export as PDF"
                />
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EquipmentRequests;