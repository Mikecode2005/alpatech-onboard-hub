import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseServices } from '@/integrations/supabase/services';
import { EquipmentItem, EquipmentMaintenance } from '@/integrations/supabase/types';
import { Plus, Edit, Trash, AlertCircle, Package, Tool, Calendar, Search } from 'lucide-react';
import PDFExport from '@/components/PDFExport';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

const EquipmentInventory: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabaseServices = useSupabaseServices();
  
  // State for equipment inventory
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<EquipmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // State for equipment item dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  
  // State for new/edit equipment form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [unit, setUnit] = useState('piece');
  const [location, setLocation] = useState('');
  const [minStockLevel, setMinStockLevel] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for maintenance dialog
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState<EquipmentMaintenance[]>([]);
  const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(false);
  
  // State for new maintenance form
  const [maintenanceType, setMaintenanceType] = useState('');
  const [maintenanceDescription, setMaintenanceDescription] = useState('');
  const [performedBy, setPerformedBy] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');
  const [maintenanceCost, setMaintenanceCost] = useState('');
  const [maintenanceNotes, setMaintenanceNotes] = useState('');
  
  // Fetch equipment inventory
  useEffect(() => {
    const fetchEquipment = async () => {
      setIsLoading(true);
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
          },
          {
            id: '6',
            name: 'Safety Harness',
            description: 'Full-body safety harness for height work',
            category: 'PPE',
            totalQuantity: 30,
            availableQuantity: 5,
            unit: 'piece',
            location: 'Equipment Room',
            minStockLevel: 10,
            createdAt: '2025-08-01T00:00:00Z',
            updatedAt: '2025-08-01T00:00:00Z'
          },
          {
            id: '7',
            name: 'Respirator',
            description: 'Half-face respirator with P100 filters',
            category: 'PPE',
            totalQuantity: 25,
            availableQuantity: 2,
            unit: 'piece',
            location: 'Safety Room',
            minStockLevel: 5,
            createdAt: '2025-08-01T00:00:00Z',
            updatedAt: '2025-08-01T00:00:00Z'
          }
        ];
        
        setEquipmentItems(mockEquipment);
        setFilteredItems(mockEquipment);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        toast({
          title: 'Error',
          description: 'Failed to load equipment inventory',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEquipment();
  }, []);
  
  // Filter equipment items based on search term and active tab
  useEffect(() => {
    let filtered = equipmentItems;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (activeTab === 'low_stock') {
      filtered = filtered.filter(item => item.availableQuantity <= item.minStockLevel);
    } else if (activeTab === 'out_of_stock') {
      filtered = filtered.filter(item => item.availableQuantity === 0);
    } else if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.category.toLowerCase() === activeTab.toLowerCase());
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, activeTab, equipmentItems]);
  
  // Get unique categories for tabs
  const categories = ['all', 'low_stock', 'out_of_stock', ...new Set(equipmentItems.map(item => item.category.toLowerCase()))];
  
  // Open dialog for adding new equipment
  const openAddDialog = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setName('');
    setDescription('');
    setCategory('');
    setTotalQuantity(0);
    setAvailableQuantity(0);
    setUnit('piece');
    setLocation('');
    setMinStockLevel(5);
    setIsDialogOpen(true);
  };
  
  // Open dialog for editing equipment
  const openEditDialog = (item: EquipmentItem) => {
    setIsEditMode(true);
    setSelectedItem(item);
    setName(item.name);
    setDescription(item.description || '');
    setCategory(item.category);
    setTotalQuantity(item.totalQuantity);
    setAvailableQuantity(item.availableQuantity);
    setUnit(item.unit);
    setLocation(item.location || '');
    setMinStockLevel(item.minStockLevel || 5);
    setIsDialogOpen(true);
  };
  
  // Submit equipment form
  const handleSubmitEquipment = async () => {
    if (!name || !category || totalQuantity < 0 || availableQuantity < 0 || !unit) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    if (availableQuantity > totalQuantity) {
      toast({
        title: 'Invalid Quantity',
        description: 'Available quantity cannot exceed total quantity',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && selectedItem) {
        // This would be replaced with actual Supabase call
        // const { data, error } = await supabaseServices.updateEquipmentItem(selectedItem.id, {
        //   name,
        //   description,
        //   category,
        //   totalQuantity,
        //   availableQuantity,
        //   unit,
        //   location,
        //   minStockLevel
        // });
        
        // Mock successful update
        setTimeout(() => {
          const updatedItems = equipmentItems.map(item => {
            if (item.id === selectedItem.id) {
              return {
                ...item,
                name,
                description,
                category,
                totalQuantity,
                availableQuantity,
                unit,
                location,
                minStockLevel,
                updatedAt: new Date().toISOString()
              };
            }
            return item;
          });
          
          setEquipmentItems(updatedItems);
          
          toast({
            title: 'Equipment Updated',
            description: `${name} has been updated successfully`,
          });
          
          setIsDialogOpen(false);
          setIsSubmitting(false);
        }, 1000);
      } else {
        // This would be replaced with actual Supabase call
        // const { data, error } = await supabaseServices.createEquipmentItem({
        //   name,
        //   description,
        //   category,
        //   totalQuantity,
        //   availableQuantity,
        //   unit,
        //   location,
        //   minStockLevel
        // });
        
        // Mock successful creation
        setTimeout(() => {
          const newItem: EquipmentItem = {
            id: `new-${Date.now()}`,
            name,
            description,
            category,
            totalQuantity,
            availableQuantity,
            unit,
            location,
            minStockLevel,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setEquipmentItems([...equipmentItems, newItem]);
          
          toast({
            title: 'Equipment Added',
            description: `${name} has been added to inventory`,
          });
          
          setIsDialogOpen(false);
          setIsSubmitting(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving equipment:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} equipment`,
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };
  
  // Delete equipment
  const handleDeleteEquipment = async (item: EquipmentItem) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        // This would be replaced with actual Supabase call
        // const { error } = await supabaseServices.deleteEquipmentItem(item.id);
        
        // Mock successful deletion
        setTimeout(() => {
          const updatedItems = equipmentItems.filter(i => i.id !== item.id);
          setEquipmentItems(updatedItems);
          
          toast({
            title: 'Equipment Deleted',
            description: `${item.name} has been removed from inventory`,
          });
        }, 500);
      } catch (error) {
        console.error('Error deleting equipment:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete equipment',
          variant: 'destructive'
        });
      }
    }
  };
  
  // Open maintenance dialog
  const openMaintenanceDialog = async (item: EquipmentItem) => {
    setSelectedItem(item);
    setIsLoadingMaintenance(true);
    
    try {
      // This would be replaced with actual Supabase call
      // const { data, error } = await supabaseServices.getMaintenanceRecords(item.id);
      
      // Mock maintenance records
      const mockMaintenance: EquipmentMaintenance[] = [
        {
          id: '1',
          equipmentId: item.id,
          equipmentName: item.name,
          maintenanceType: 'Inspection',
          description: 'Regular safety inspection',
          performedBy: 'John Doe',
          maintenanceDate: '2025-07-15T00:00:00Z',
          nextMaintenanceDate: '2025-10-15T00:00:00Z',
          notes: 'All items passed inspection'
        },
        {
          id: '2',
          equipmentId: item.id,
          equipmentName: item.name,
          maintenanceType: 'Repair',
          description: 'Fixed damaged straps',
          performedBy: 'Jane Smith',
          cost: 150,
          maintenanceDate: '2025-06-10T00:00:00Z',
          notes: 'Replaced all straps with new ones'
        }
      ];
      
      setMaintenanceRecords(mockMaintenance);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      toast({
        title: 'Error',
        description: 'Failed to load maintenance records',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingMaintenance(false);
    }
    
    // Reset maintenance form
    setMaintenanceType('');
    setMaintenanceDescription('');
    setPerformedBy('');
    setMaintenanceDate(format(new Date(), 'yyyy-MM-dd'));
    setNextMaintenanceDate('');
    setMaintenanceCost('');
    setMaintenanceNotes('');
    
    setIsMaintenanceDialogOpen(true);
  };
  
  // Submit maintenance record
  const handleSubmitMaintenance = async () => {
    if (!selectedItem || !maintenanceType || !maintenanceDescription || !performedBy || !maintenanceDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would be replaced with actual Supabase call
      // const { data, error } = await supabaseServices.createMaintenanceRecord({
      //   equipmentId: selectedItem.id,
      //   equipmentName: selectedItem.name,
      //   maintenanceType,
      //   description: maintenanceDescription,
      //   performedBy,
      //   maintenanceDate,
      //   nextMaintenanceDate: nextMaintenanceDate || undefined,
      //   cost: maintenanceCost ? parseFloat(maintenanceCost) : undefined,
      //   notes: maintenanceNotes || undefined
      // });
      
      // Mock successful creation
      setTimeout(() => {
        const newRecord: EquipmentMaintenance = {
          id: `new-${Date.now()}`,
          equipmentId: selectedItem.id,
          equipmentName: selectedItem.name,
          maintenanceType,
          description: maintenanceDescription,
          performedBy,
          maintenanceDate: new Date(maintenanceDate).toISOString(),
          nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate).toISOString() : undefined,
          cost: maintenanceCost ? parseFloat(maintenanceCost) : undefined,
          notes: maintenanceNotes
        };
        
        setMaintenanceRecords([newRecord, ...maintenanceRecords]);
        
        // Reset form
        setMaintenanceType('');
        setMaintenanceDescription('');
        setPerformedBy('');
        setMaintenanceDate(format(new Date(), 'yyyy-MM-dd'));
        setNextMaintenanceDate('');
        setMaintenanceCost('');
        setMaintenanceNotes('');
        
        toast({
          title: 'Maintenance Recorded',
          description: 'Maintenance record has been added successfully',
        });
        
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error recording maintenance:', error);
      toast({
        title: 'Error',
        description: 'Failed to record maintenance',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };
  
  // Generate inventory PDF
  const generateInventoryPDF = async (): Promise<jsPDF> => {
    const doc = new jsPDF();
    let y = 20;
    
    // Add title
    doc.setFontSize(16);
    doc.text('Equipment Inventory Report', 15, y);
    y += 10;
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 15, y);
    y += 10;
    
    // Add table header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Name', 15, y);
    doc.text('Category', 80, y);
    doc.text('Total', 130, y);
    doc.text('Available', 150, y);
    doc.text('Location', 180, y);
    y += 7;
    
    // Add separator
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, 195, y);
    y += 7;
    
    // Add items
    doc.setFont('helvetica', 'normal');
    filteredItems.forEach(item => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = 20;
        
        // Add table header on new page
        doc.setFont('helvetica', 'bold');
        doc.text('Name', 15, y);
        doc.text('Category', 80, y);
        doc.text('Total', 130, y);
        doc.text('Available', 150, y);
        doc.text('Location', 180, y);
        y += 7;
        
        // Add separator
        doc.setDrawColor(200, 200, 200);
        doc.line(15, y, 195, y);
        y += 7;
        doc.setFont('helvetica', 'normal');
      }
      
      doc.text(item.name, 15, y);
      doc.text(item.category, 80, y);
      doc.text(item.totalQuantity.toString(), 130, y);
      
      // Highlight low stock
      if (item.availableQuantity <= item.minStockLevel) {
        doc.setTextColor(255, 0, 0);
      }
      doc.text(item.availableQuantity.toString(), 150, y);
      doc.setTextColor(0, 0, 0);
      
      doc.text(item.location || '', 180, y);
      y += 7;
    });
    
    return doc;
  };
  
  // Get stock status badge
  const getStockStatusBadge = (item: EquipmentItem) => {
    if (item.availableQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (item.availableQuantity <= item.minStockLevel) {
      return <Badge variant="warning">Low Stock</Badge>;
    } else {
      return <Badge variant="success">In Stock</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Equipment Inventory - Alpatech Training Centre</title>
        <meta name="description" content="Manage equipment inventory for training sessions" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Equipment Inventory</h1>
              <p className="text-muted-foreground">Manage equipment inventory for training sessions</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
              <PDFExport
                generatePDF={generateInventoryPDF}
                filename="equipment_inventory.pdf"
                label="Export Inventory"
              />
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search equipment..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Equipment Inventory</CardTitle>
              <CardDescription>
                Manage and track all training equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="low_stock">Low Stock</TabsTrigger>
                  <TabsTrigger value="out_of_stock">Out of Stock</TabsTrigger>
                  {categories
                    .filter(cat => !['all', 'low_stock', 'out_of_stock'].includes(cat))
                    .map(category => (
                      <TabsTrigger key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </TabsTrigger>
                    ))
                  }
                </TabsList>
                <TabsContent value={activeTab}>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredItems.length > 0 ? (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Total Quantity</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.totalQuantity} {item.unit}(s)</TableCell>
                              <TableCell>{item.availableQuantity} {item.unit}(s)</TableCell>
                              <TableCell>{item.location || 'N/A'}</TableCell>
                              <TableCell>{getStockStatusBadge(item)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openMaintenanceDialog(item)}
                                  >
                                    <Tool className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteEquipment(item)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No equipment items found.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Equipment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update equipment details in the inventory' : 'Add new equipment to the inventory'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Equipment name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="Equipment category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Equipment description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalQuantity">Total Quantity *</Label>
                <Input
                  id="totalQuantity"
                  type="number"
                  min="0"
                  placeholder="Total quantity"
                  value={totalQuantity}
                  onChange={(e) => setTotalQuantity(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableQuantity">Available Quantity *</Label>
                <Input
                  id="availableQuantity"
                  type="number"
                  min="0"
                  max={totalQuantity}
                  placeholder="Available quantity"
                  value={availableQuantity}
                  onChange={(e) => setAvailableQuantity(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="pair">Pair</SelectItem>
                    <SelectItem value="set">Set</SelectItem>
                    <SelectItem value="kit">Kit</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Storage location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
                <Input
                  id="minStockLevel"
                  type="number"
                  min="0"
                  placeholder="Minimum stock level"
                  value={minStockLevel}
                  onChange={(e) => setMinStockLevel(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEquipment} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Maintenance Dialog */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Equipment Maintenance</DialogTitle>
            <DialogDescription>
              {selectedItem && `View and record maintenance for ${selectedItem.name}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Equipment</h4>
                  <p className="font-medium">{selectedItem.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                  <p>{selectedItem.category}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Maintenance Records</h3>
                {isLoadingMaintenance ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : maintenanceRecords.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Performed By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Next Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {maintenanceRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.maintenanceType}</TableCell>
                            <TableCell>{record.description}</TableCell>
                            <TableCell>{record.performedBy}</TableCell>
                            <TableCell>{format(new Date(record.maintenanceDate), 'PP')}</TableCell>
                            <TableCell>
                              {record.nextMaintenanceDate ? format(new Date(record.nextMaintenanceDate), 'PP') : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-4 border rounded-md">
                    <p className="text-muted-foreground">No maintenance records found.</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Record New Maintenance</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceType">Maintenance Type *</Label>
                      <Select value={maintenanceType} onValueChange={setMaintenanceType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inspection">Inspection</SelectItem>
                          <SelectItem value="Repair">Repair</SelectItem>
                          <SelectItem value="Replacement">Replacement</SelectItem>
                          <SelectItem value="Calibration">Calibration</SelectItem>
                          <SelectItem value="Cleaning">Cleaning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="performedBy">Performed By *</Label>
                      <Input
                        id="performedBy"
                        placeholder="Name of person performing maintenance"
                        value={performedBy}
                        onChange={(e) => setPerformedBy(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceDescription">Description *</Label>
                    <Textarea
                      id="maintenanceDescription"
                      placeholder="Maintenance description"
                      value={maintenanceDescription}
                      onChange={(e) => setMaintenanceDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceDate">Maintenance Date *</Label>
                      <Input
                        id="maintenanceDate"
                        type="date"
                        value={maintenanceDate}
                        onChange={(e) => setMaintenanceDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextMaintenanceDate">Next Maintenance Date</Label>
                      <Input
                        id="nextMaintenanceDate"
                        type="date"
                        value={nextMaintenanceDate}
                        onChange={(e) => setNextMaintenanceDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceCost">Cost</Label>
                      <Input
                        id="maintenanceCost"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Cost"
                        value={maintenanceCost}
                        onChange={(e) => setMaintenanceCost(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceNotes">Notes</Label>
                    <Textarea
                      id="maintenanceNotes"
                      placeholder="Additional notes"
                      value={maintenanceNotes}
                      onChange={(e) => setMaintenanceNotes(e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={handleSubmitMaintenance} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Record Maintenance'}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EquipmentInventory;