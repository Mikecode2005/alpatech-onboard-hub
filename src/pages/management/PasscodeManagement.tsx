import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasscodeGenerator from "@/components/PasscodeGenerator";
import { useAppState } from "@/state/appState";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const PasscodeManagement = () => {
  const { toast } = useToast();
  const passcodes = useAppState((s) => s.passcodes);
  const assignTrainingModules = useAppState((s) => s.assignTrainingModules);
  
  const [selectedTraineeEmail, setSelectedTraineeEmail] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  
  // Available training modules
  const availableModules = ["BOSIET", "FIRE WATCH", "CSE&R", "YOU SEE U ACT"];
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Handle module selection
  const handleModuleToggle = (module: string) => {
    setSelectedModules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module) 
        : [...prev, module]
    );
  };
  
  // Handle training assignment
  const handleAssignTraining = () => {
    if (!selectedTraineeEmail) return;
    
    assignTrainingModules(selectedTraineeEmail, selectedModules);
    
    toast({
      title: "Training modules assigned",
      description: `Assigned ${selectedModules.length} modules to ${selectedTraineeEmail}`
    });
    
    setAssignDialogOpen(false);
  };
  
  // Open assignment dialog for a trainee
  const openAssignDialog = (email: string) => {
    setSelectedTraineeEmail(email);
    // Get current assignments for this trainee (in a real app, this would be per-trainee)
    const currentAssignments = useAppState.getState().getTraineeAssignments(email);
    setSelectedModules(currentAssignments);
    setAssignDialogOpen(true);
  };
  
  // Get unique trainee emails from passcodes
  const uniqueTrainees = [...new Set(passcodes.map(p => p.traineeEmail))];
  
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Passcode Management | Alpatech Training Portal</title>
        <meta name="description" content="Manage trainee passcodes and training assignments." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Trainee Management</h1>
      
      <Tabs defaultValue="passcodes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="passcodes">Passcode Generator</TabsTrigger>
          <TabsTrigger value="trainees">Trainee Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="passcodes">
          <PasscodeGenerator />
        </TabsContent>
        
        <TabsContent value="trainees">
          <Card>
            <CardHeader>
              <CardTitle>Manage Trainees</CardTitle>
            </CardHeader>
            <CardContent>
              {uniqueTrainees.length > 0 ? (
                <Table>
                  <TableCaption>List of trainees with access</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uniqueTrainees.map((email) => {
                      // Find the most recent passcode for this trainee
                      const traineePasscodes = passcodes
                        .filter(p => p.traineeEmail === email)
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                      
                      const latestPasscode = traineePasscodes[0];
                      const hasActivePasscode = traineePasscodes.some(p => !p.isUsed);
                      
                      return (
                        <TableRow key={email}>
                          <TableCell>{email}</TableCell>
                          <TableCell>
                            {hasActivePasscode ? (
                              <span className="text-green-500">Active</span>
                            ) : (
                              <span className="text-muted-foreground">No active passcode</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openAssignDialog(email)}
                            >
                              Assign Training
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No trainees found. Generate passcodes to add trainees.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for assigning training modules */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Training Modules</DialogTitle>
            <DialogDescription>
              Select training modules for {selectedTraineeEmail}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {availableModules.map((module) => (
              <div key={module} className="flex items-center space-x-2">
                <Checkbox 
                  id={`module-${module}`} 
                  checked={selectedModules.includes(module)}
                  onCheckedChange={() => handleModuleToggle(module)}
                />
                <Label htmlFor={`module-${module}`}>{module}</Label>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTraining}>
              Assign Modules
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PasscodeManagement;