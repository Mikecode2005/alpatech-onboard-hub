import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/state/appState";

const Onboarding = () => {
  const navigate = useNavigate();
  const user = useAppState((s) => s.user);
  const [step, setStep] = useState(1);

  const steps = [
    { title: "Welcome", description: "Welcome to Alpatech Training Portal", route: null },
    { title: "No Gift Policy", description: "Acknowledge AENL No Gift Policy", route: "/forms/welcome-policy" },
    { title: "Medical Screening", description: "Complete medical screening forms", route: "/forms/medical-screening" },
    { title: "Course Registration", description: "Complete course registration form", route: "/forms/course-registration" },
    { title: "Completion", description: "Onboarding complete", route: null }
  ];

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
                  <p>This will include medical forms, safety training, and other essential documentation.</p>
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
                  <p>Complete the medical screening form for safety assessment.</p>
                  <p className="text-sm text-muted-foreground">This will be reviewed by our medical team before training approval.</p>
                </div>
              )}
              
              {step === 4 && (
                <div className="space-y-4">
                  <p>Complete your course registration with personal and company details.</p>
                  <p className="text-sm text-muted-foreground">This information helps us prepare appropriate training materials.</p>
                </div>
              )}
              
              {step === 5 && (
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