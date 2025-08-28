import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/state/appState";

const Onboarding = () => {
  const navigate = useNavigate();
  const user = useAppState((s) => s.user);
  const assignedTrainings = useAppState((s) => s.assignedTrainings);
  const [step, setStep] = useState(1);

  // Base steps that everyone needs to complete
  const baseSteps = [
    { title: "Welcome", description: "Welcome to Alpatech Training Portal", route: null },
    { title: "No Gift Policy", description: "Acknowledge AENL No Gift Policy", route: "/forms/welcome-policy" },
    { title: "Course Registration", description: "Complete course registration form", route: "/forms/course-registration" },
    { title: "Medical Screening", description: "Complete medical screening forms", route: "/forms/medical-screening" },
  ];

  // Dynamic steps based on assigned trainings
  const dynamicSteps = [];
  if (assignedTrainings.includes("BOSIET")) {
    dynamicSteps.push({ 
      title: "BOSIET Form", 
      description: "Complete BOSIET training form", 
      route: "/forms/bosiet" 
    });
  }
  
  if (assignedTrainings.includes("FIRE WATCH")) {
    dynamicSteps.push({ 
      title: "Fire Watch Form", 
      description: "Complete Fire Watch training form", 
      route: "/forms/fire-watch" 
    });
  }
  
  if (assignedTrainings.includes("CSE&R")) {
    dynamicSteps.push({ 
      title: "CSE&R Form", 
      description: "Complete CSE&R training form", 
      route: "/forms/cser" 
    });
  }

  // Final completion step
  const completionStep = [
    { title: "Completion", description: "Onboarding complete", route: null }
  ];

  // Combine all steps
  const steps = [...baseSteps, ...dynamicSteps, ...completionStep];

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      navigate("/trainee-login");
    }
  }, [user, navigate]);

  const handleNext = () => {
    const currentStep = steps[step - 1];
    if (currentStep?.route) {
      navigate(currentStep.route);
    } else if (step < steps.length) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const progress = (step / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Onboarding | Alpatech Training Portal</title>
        <meta name="description" content="Complete your onboarding process with Alpatech Training Portal." />
      </Helmet>
      
      <div className="container mx-auto py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-2xl mb-2">Welcome, {user?.email}</div>
              <div className="text-lg font-normal text-muted-foreground">
                Step {step} of {steps.length}: {steps[step - 1]?.title}
              </div>
            </CardTitle>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                {steps[step - 1]?.description}
              </h3>
              
              {step === 1 && (
                <div className="space-y-4">
                  <p>Welcome to the Alpatech Training Portal. We'll guide you through the onboarding process.</p>
                  <p>This will include the following steps:</p>
                  <ul className="list-disc list-inside text-left">
                    <li>AENL No Gift Policy acknowledgment</li>
                    <li>Course Registration</li>
                    <li>Medical Screening</li>
                    {assignedTrainings.length > 0 && (
                      <li>Training specific forms as assigned by your supervisor</li>
                    )}
                  </ul>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <p>Please read and acknowledge the AENL No Gift Policy before proceeding with your training.</p>
                  <p className="text-sm text-muted-foreground">This policy ensures integrity and professionalism in all training activities.</p>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4">
                  <p>Complete your course registration with personal and company details.</p>
                  <p className="text-sm text-muted-foreground">This information helps us prepare appropriate training materials.</p>
                </div>
              )}
              
              {step === 4 && (
                <div className="space-y-4">
                  <p>Complete the medical screening form for safety assessment.</p>
                  <p className="text-sm text-muted-foreground">This will be reviewed by our medical team before training approval.</p>
                </div>
              )}
              
              {step > 4 && step < steps.length && (
                <div className="space-y-4">
                  <p>Please complete the {steps[step - 1]?.title} as assigned by your training supervisor.</p>
                  <p className="text-sm text-muted-foreground">This form is required for your specific training program.</p>
                </div>
              )}
              
              {step === steps.length && (
                <div className="space-y-4">
                  <p>Congratulations! You have completed the onboarding process.</p>
                  <p>You can now access your dashboard and training materials.</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              <Button onClick={handleNext}>
                {step === steps.length ? "Go to Dashboard" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;