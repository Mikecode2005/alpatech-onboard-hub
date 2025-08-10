import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";

const AssignTraining = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assignTrainingModules } = useAppState();
  const [traineeEmail, setTraineeEmail] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const trainingModules = [
    "BOSIET",
    "Fire Watch",
    "CSE&R",
    "H2S Safety",
    "First Aid",
    "Helicopter Safety",
    "Confined Space Entry",
    "Working at Heights"
  ];

  const handleModuleChange = (module: string, checked: boolean) => {
    setSelectedModules(prev => 
      checked 
        ? [...prev, module]
        : prev.filter(m => m !== module)
    );
  };

  const onAssign = () => {
    if (!traineeEmail || selectedModules.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please enter trainee email and select at least one module.",
        variant: "destructive"
      });
      return;
    }

    try {
      assignTrainingModules(traineeEmail, selectedModules);
      toast({
        title: "Success",
        description: `Training modules assigned to ${traineeEmail}`,
      });
      setTraineeEmail("");
      setSelectedModules([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign training modules",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Assign Training - Alpatech Training Centre</title>
        <meta name="description" content="Assign training modules to trainees" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Assign Training Modules</h1>
              <p className="text-muted-foreground">Assign specific training modules to trainees</p>
            </div>
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Training Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="traineeEmail">Trainee Email</Label>
                <Input
                  id="traineeEmail"
                  type="email"
                  placeholder="Enter trainee email address"
                  value={traineeEmail}
                  onChange={(e) => setTraineeEmail(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Select Training Modules</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainingModules.map((module) => (
                    <div key={module} className="flex items-center space-x-2">
                      <Checkbox
                        id={module}
                        checked={selectedModules.includes(module)}
                        onCheckedChange={(checked) => 
                          handleModuleChange(module, checked as boolean)
                        }
                      />
                      <Label htmlFor={module} className="text-sm font-normal">
                        {module}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={onAssign} variant="default">
                  Assign Training Modules
                </Button>
                <Button onClick={() => navigate("/dashboard")} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AssignTraining;