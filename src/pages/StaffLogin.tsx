import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppState, Role } from "@/state/appState";

const staffRoles: Role[] = [
  "Training Supervisor",
  "Training Coordinator", 
  "Instructor / Team Lead",
  "Utility Office",
  "Nurse",
  "Safety Coordinator",
  "Operations Manager",
  "Chief Operations Officer",
  "Other Staff",
  "Super Admin",
];

const StaffLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUser = useAppState((s) => s.setUser);

  const [role, setRole] = useState<Role>("Training Supervisor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const onLogin = () => {
    if (!email) {
      toast({ title: "Email required" });
      return;
    }

    // Super Admin check
    if (email === "femimike2005@gmail.com" && password === "mike2005") {
      setUser({ email, role: "Super Admin" });
      navigate("/dashboard");
      return;
    }

    if (role === "Other Staff" && isRegistering && password.length < 4) {
      toast({ title: "Choose a password (min 4 chars)" });
      return;
    }

    if (!isRegistering && !password) {
      toast({ title: "Password required" });
      return;
    }

    setUser({ email, role });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-hero">
      <Helmet>
        <title>Staff Login | Alpatech Training Portal</title>
        <meta name="description" content="Staff login portal for Alpatech training system with role-based access." />
      </Helmet>
      <div className="container mx-auto py-16 grid place-items-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-2xl mb-2">Alpatech Training Portal</div>
              <div className="text-lg font-normal text-muted-foreground">Staff Access</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {staffRoles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Email Address</Label>
              <Input 
                type="email" 
                placeholder="staff@alpatech.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                {role === "Other Staff" && (
                  <button 
                    className="text-sm text-primary hover:underline" 
                    onClick={() => setIsRegistering(!isRegistering)}
                  >
                    {isRegistering ? "Have an account? Sign in" : "First time? Register"}
                  </button>
                )}
              </div>
              <Input 
                type="password" 
                placeholder={isRegistering ? "Create password" : "Enter password"}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              variant="hero" 
              className="w-full" 
              onClick={onLogin}
            >
              {role === "Other Staff" && isRegistering ? "Create Account" : "Sign In"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/trainee-login")}
            >
              Trainee Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StaffLogin;