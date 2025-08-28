import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";

const TraineeLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUser = useAppState((s) => s.setUser);
  const passcodes = useAppState((s) => s.passcodes);

  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = () => {
    setIsLoading(true);
    
    if (!email) {
      toast({ title: "Email required" });
      setIsLoading(false);
      return;
    }

    if (!passcode) {
      toast({ title: "Passcode required" });
      setIsLoading(false);
      return;
    }

    // Find matching passcode entry
    const passcodeEntry = passcodes.find(
      (p) => p.traineeEmail.toLowerCase() === email.toLowerCase() && p.code === passcode
    );

    if (!passcodeEntry) {
      toast({ 
        title: "Invalid passcode", 
        description: "The passcode you entered is not valid for this email address."
      });
      setIsLoading(false);
      return;
    }

    if (passcodeEntry.isUsed) {
      toast({ 
        title: "Passcode already used", 
        description: "This passcode has already been used. Please contact your training coordinator."
      });
      setIsLoading(false);
      return;
    }

    // Check if passcode is expired
    const now = new Date();
    const expiryDate = new Date(passcodeEntry.expiresAt);
    if (now > expiryDate) {
      toast({ 
        title: "Passcode expired", 
        description: "This passcode has expired. Please contact your training coordinator for a new one."
      });
      setIsLoading(false);
      return;
    }

    // Mark passcode as used
    const updatePasscodeUsage = useAppState.getState().passcodes.map(p => 
      p.id === passcodeEntry.id 
        ? { ...p, isUsed: true, usedAt: new Date().toISOString() } 
        : p
    );
    useAppState.setState({ passcodes: updatePasscodeUsage });

    // Set user and navigate to onboarding
    setUser({ email, role: "Trainee", passcode });
    setIsLoading(false);
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-hero">
      <Helmet>
        <title>Trainee Login | Alpatech Training Portal</title>
        <meta name="description" content="Trainee login portal for Alpatech training system." />
      </Helmet>
      <div className="container mx-auto py-16 grid place-items-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-2xl mb-2">Alpatech Training Portal</div>
              <div className="text-lg font-normal text-muted-foreground">Trainee Access</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label>Email Address</Label>
              <Input 
                type="email" 
                placeholder="your.email@company.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label>Passcode</Label>
              <Input 
                type="text"
                placeholder="Enter your passcode" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                className="text-center text-lg tracking-widest"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Passcode provided by Training Coordinator via SMS/Email
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              variant="hero" 
              className="w-full" 
              onClick={onLogin}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Access Training Portal"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/staff-login")}
              disabled={isLoading}
            >
              Staff Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TraineeLogin;