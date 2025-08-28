import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/state/appState';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash, Edit, Users, UserCheck, UserX, Crown } from 'lucide-react';

// Interface for a trainee
interface Trainee {
  id: string;
  email: string;
  name: string;
  company: string;
  isOIM?: boolean;
}

// Interface for a training set
interface TrainingSet {
  id: string;
  name: string;
  createdAt: string;
  trainees: Trainee[];
  isApproved: boolean;
}

const TrainingSetManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data for trainees
  const [availableTrainees, setAvailableTrainees] = useState<Trainee[]>([
    { id: '1', email: 'trainee1@example.com', name: 'John Doe', company: 'ABC Corp' },
    { id: '2', email: 'trainee2@example.com', name: 'Jane Smith', company: 'XYZ Ltd' },
    { id: '3', email: 'trainee3@example.com', name: 'Robert Johnson', company: 'ABC Corp' },
    { id: '4', email: 'trainee4@example.com', name: 'Emily Davis', company: 'DEF Inc' },
    { id: '5', email: 'trainee5@example.com', name: 'Michael Wilson', company: 'GHI Co' },
    { id: '6', email: 'trainee6@example.com', name: 'Sarah Brown', company: 'JKL Industries' },
    { id: '7', email: 'trainee7@example.com', name: 'David Miller', company: 'MNO Group' },
    { id: '8', email: 'trainee8@example.com', name: 'Jennifer Taylor', company: 'PQR Solutions' },
  ]);
  
  // State for training sets
  const [trainingSets, setTrainingSets] = useState<TrainingSet[]>([
    {
      id: '1',
      name: 'BOSIET Group 1',
      createdAt: '2025-08-20T10:00:00Z',
      trainees: [
        { id: '1', email: 'trainee1@example.com', name: 'John Doe', company: 'ABC Corp' },
        { id: '2', email: 'trainee2@example.com', name: 'Jane Smith', company: 'XYZ Ltd', isOIM: true },
      ],
      isApproved: true,
    },
    {
      id: '2',
      name: 'Fire Watch Team A',
      createdAt: '2025-08-22T14:30:00Z',
      trainees: [
        { id: '3', email: 'trainee3@example.com', name: 'Robert Johnson', company: 'ABC Corp' },
        { id: '4', email: 'trainee4@example.com', name: 'Emily Davis', company: 'DEF Inc', isOIM: true },
      ],
      isApproved: false,
    },
  ]);
  
  // State for the current set being edited
  const [currentSet, setCurrentSet] = useState<TrainingSet | null>(null);
  const [isCreatingSet, setIsCreatingSet] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [selectedTrainees, setSelectedTrainees] = useState<Trainee[]>([]);
  const [oimTraineeId, setOimTraineeId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState<TrainingSet | null>(null);
  
  // Filter available trainees to exclude those already in sets
  const getFilteredAvailableTrainees = () => {
    const assignedTraineeIds = new Set<string>();
    
    trainingSets.forEach(set => {
      set.trainees.forEach(trainee => {
        assignedTraineeIds.add(trainee.id);
      });
    });
    
    // If editing an existing set, don't exclude its own trainees
    if (currentSet && !isCreatingSet) {
      currentSet.trainees.forEach(trainee => {
        assignedTraineeIds.delete(trainee.id);
      });
    }
    
    return availableTrainees.filter(trainee => !assignedTraineeIds.has(trainee.id));
  };
  
  // Create a new training set
  const handleCreateSet = () => {
    setIsCreatingSet(true);
    setCurrentSet(null);
    setNewSetName('');
    setSelectedTrainees([]);
    setOimTraineeId(null);
    setIsDialogOpen(true);
  };
  
  // Edit an existing training set
  const handleEditSet = (set: TrainingSet) => {
    setIsCreatingSet(false);
    setCurrentSet(set);
    setNewSetName(set.name);
    setSelectedTrainees([...set.trainees]);
    setOimTraineeId(set.trainees.find(t => t.isOIM)?.id || null);
    setIsDialogOpen(true);
  };
  
  // Toggle trainee selection
  const toggleTraineeSelection = (trainee: Trainee) => {
    if (selectedTrainees.some(t => t.id === trainee.id)) {
      setSelectedTrainees(selectedTrainees.filter(t => t.id !== trainee.id));
      if (oimTraineeId === trainee.id) {
        setOimTraineeId(null);
      }
    } else {
      setSelectedTrainees([...selectedTrainees, trainee]);
    }
  };
  
  // Set a trainee as OIM
  const setTraineeAsOIM = (traineeId: string) => {
    setOimTraineeId(traineeId);
  };
  
  // Save the training set
  const saveTrainingSet = () => {
    if (!newSetName.trim()) {
      toast({
        title: 'Set name required',
        description: 'Please enter a name for the training set',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedTrainees.length === 0) {
      toast({
        title: 'No trainees selected',
        description: 'Please select at least one trainee for the training set',
        variant: 'destructive',
      });
      return;
    }
    
    // Update trainees with OIM status
    const updatedTrainees = selectedTrainees.map(trainee => ({
      ...trainee,
      isOIM: trainee.id === oimTraineeId,
    }));
    
    if (isCreatingSet) {
      // Create new set
      const newSet: TrainingSet = {
        id: Date.now().toString(),
        name: newSetName,
        createdAt: new Date().toISOString(),
        trainees: updatedTrainees,
        isApproved: false,
      };
      
      setTrainingSets([...trainingSets, newSet]);
      
      toast({
        title: 'Training set created',
        description: `${newSetName} has been created successfully`,
      });
    } else if (currentSet) {
      // Update existing set
      const updatedSets = trainingSets.map(set => 
        set.id === currentSet.id
          ? { ...set, name: newSetName, trainees: updatedTrainees, isApproved: false }
          : set
      );
      
      setTrainingSets(updatedSets);
      
      toast({
        title: 'Training set updated',
        description: `${newSetName} has been updated successfully`,
      });
    }
    
    setIsDialogOpen(false);
  };
  
  // Approve a training set
  const approveTrainingSet = (set: TrainingSet) => {
    const updatedSets = trainingSets.map(s => 
      s.id === set.id ? { ...s, isApproved: true } : s
    );
    
    setTrainingSets(updatedSets);
    
    toast({
      title: 'Training set approved',
      description: `${set.name} has been approved`,
    });
  };
  
  // Confirm deletion of a training set
  const confirmDeleteSet = (set: TrainingSet) => {
    setSetToDelete(set);
    setIsDeleteDialogOpen(true);
  };
  
  // Delete a training set
  const deleteTrainingSet = () => {
    if (!setToDelete) return;
    
    const updatedSets = trainingSets.filter(set => set.id !== setToDelete.id);
    setTrainingSets(updatedSets);
    
    toast({
      title: 'Training set deleted',
      description: `${setToDelete.name} has been deleted`,
    });
    
    setIsDeleteDialogOpen(false);
    setSetToDelete(null);
  };
  
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Training Set Management | Alpatech Training Portal</title>
        <meta name="description" content="Manage training sets and assign trainees" />
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Training Set Management</h1>
        <Button onClick={handleCreateSet} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Set
        </Button>
      </div>
      
      {trainingSets.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Training Sets</h3>
            <p className="text-muted-foreground mb-4">
              Create your first training set to organize trainees into groups
            </p>
            <Button onClick={handleCreateSet} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Set
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {trainingSets.map(set => (
            <Card key={set.id} className={set.isApproved ? "border-green-200" : ""}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {set.name}
                    {set.isApproved && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Approved
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Created on {new Date(set.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditSet(set)}
                    disabled={set.isApproved}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {!set.isApproved && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => approveTrainingSet(set)}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => confirmDeleteSet(set)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>
                    {set.trainees.length} trainees in this set
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {set.trainees.map(trainee => (
                      <TableRow key={trainee.id}>
                        <TableCell className="font-medium">{trainee.name}</TableCell>
                        <TableCell>{trainee.email}</TableCell>
                        <TableCell>{trainee.company}</TableCell>
                        <TableCell>
                          {trainee.isOIM ? (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                              <Crown className="h-3 w-3 mr-1" />
                              OIM
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Trainee</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create/Edit Training Set Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isCreatingSet ? "Create New Training Set" : "Edit Training Set"}
            </DialogTitle>
            <DialogDescription>
              {isCreatingSet 
                ? "Create a new training set and assign trainees" 
                : "Modify the training set and trainee assignments"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="setName">Set Name</Label>
              <Input 
                id="setName" 
                value={newSetName} 
                onChange={(e) => setNewSetName(e.target.value)} 
                placeholder="Enter a name for this training set"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Select Trainees</Label>
              <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Select</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="w-[100px]">OIM</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...getFilteredAvailableTrainees(), ...selectedTrainees].map(trainee => (
                      <TableRow key={trainee.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedTrainees.some(t => t.id === trainee.id)} 
                            onCheckedChange={() => toggleTraineeSelection(trainee)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{trainee.name}</TableCell>
                        <TableCell>{trainee.email}</TableCell>
                        <TableCell>{trainee.company}</TableCell>
                        <TableCell>
                          <Checkbox 
                            checked={oimTraineeId === trainee.id}
                            onCheckedChange={() => setTraineeAsOIM(trainee.id)}
                            disabled={!selectedTrainees.some(t => t.id === trainee.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-muted-foreground">
                Select trainees for this set and designate one as OIM (Officer In Charge of the Mission)
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTrainingSet}>
              {isCreatingSet ? "Create Set" : "Update Set"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the training set "{setToDelete?.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteTrainingSet}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingSetManagement;