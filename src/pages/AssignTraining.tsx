import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";
import { useNavigate } from "react-router-dom";

const trainingModules = [
  "BOSIET",
  "FIRE WATCH", 
  "CSE&R"
];

const AssignTraining = () => {
  const navigate = useNavigate();
  const { assignTrainingModules } = useAppState();
  const { toast } = useToast();

  const [traineeEmail, setTraineeEmail] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const handleModuleChange = (module: string, checked: boolean) => {
    if (checked) {
      setSelectedModules(prev => [...prev, module]);
    } else {
      setSelectedModules(prev => prev.filter(m => m !== module));
    }
  };

  const onAssign = () => {
    if (!traineeEmail) {
      toast({ title: "Trainee email is required" });
      return;
    }

    if (selectedModules.length === 0) {
      toast({ title: "Please select at least one training module" });
      return;
    }

    assignTrainingModules(traineeEmail, selectedModules);
    toast({ 
      title: "Training Modules Assigned Successfully!",
      description: `Assigned ${selectedModules.join(", ")} to ${traineeEmail}`
    });
    
    // Reset form
    setTraineeEmail("");
    setSelectedModules([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Assign Training Modules | Alpatech</title>
        <meta name="description" content="Assign training modules to trainees - Training Supervisor access." />
      </Helmet>
      <div className="container mx-auto py-10 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Assign Training Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label>Trainee Email Address</Label>
              <Input 
                type="email"
                placeholder="trainee@company.com"
                value={traineeEmail}
                onChange={(e) => setTraineeEmail(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Select Training Modules</Label>
              <div className="space-y-3">
                {trainingModules.map((module) => (
                  <div key={module} className="flex items-center space-x-3">
                    <Checkbox
                      id={module}
                      checked={selectedModules.includes(module)}
                      onCheckedChange={(checked) => handleModuleChange(module, checked as boolean)}
                    />
                    <Label htmlFor={module} className="text-sm font-medium cursor-pointer">
                      {module === "CSE&R" ? "CSE&R (Confined Space Entry & Rescue)" : module}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {selectedModules.length > 0 && (
              <div className="bg-accent/10 p-4 rounded border">
                <p className="text-sm font-medium mb-2">Selected Modules:</p>
                <ul className="text-sm text-muted-foreground">
                  {selectedModules.map((module) => (
                    <li key={module}>• {module}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex-1">
              Cancel
            </Button>
            <Button variant="hero" onClick={onAssign} className="flex-1">
              Assign Training Modules
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AssignTraining;