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

  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");

  const onLogin = () => {
    if (!email) {
      toast({ title: "Email required" });
      return;
    }

    if (!/^\d{4}$/.test(passcode)) {
      toast({ title: "Enter the 4-digit passcode" });
      return;
    }

    setUser({ email, role: "Trainee", passcode });
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
              />
            </div>

            <div className="grid gap-2">
              <Label>4-Digit Passcode</Label>
              <Input 
                inputMode="numeric" 
                maxLength={4} 
                placeholder="1234" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                className="text-center text-lg tracking-widest"
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
            >
              Access Training Portal
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/staff-login")}
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