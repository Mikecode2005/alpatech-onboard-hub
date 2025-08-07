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

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUser = useAppState((s) => s.setUser);

  const [loginType, setLoginType] = useState<"trainee" | "staff">("trainee");
  const [role, setRole] = useState<Role>("Training Supervisor");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [registerOther, setRegisterOther] = useState(false);

  const onTraineeLogin = () => {
    if (!email) {
      toast({ title: "Email required" });
      return;
    }

    if (!/^\d{4}$/.test(pass)) {
      toast({ title: "Enter the 4-digit passcode" });
      return;
    }

    setUser({ email, role: "Trainee", passcode: pass });
    navigate("/onboarding");
  };

  const onStaffLogin = () => {
    if (!email) {
      toast({ title: "Email required" });
      return;
    }

    // Super Admin check
    if (email === "femimike2005@gmail.com" && pass === "mike2005") {
      setUser({ email, role: "Super Admin" });
      navigate("/dashboard");
      return;
    }

    if (role === "Other Staff" && registerOther && pass.length < 4) {
      toast({ title: "Choose a password (min 4 chars)" });
      return;
    }

    if (!registerOther && !pass) {
      toast({ title: "Password required" });
      return;
    }

    setUser({ email, role });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-hero">
      <Helmet>
        <title>Login | Alpatech Training Portal</title>
        <meta name="description" content="Log in to Alpatech portal - separate access for trainees and staff members." />
      </Helmet>
      <div className="container mx-auto py-16 grid place-items-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-center">Alpatech Training Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Type Selection */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={loginType === "trainee" ? "default" : "outline"}
                onClick={() => setLoginType("trainee")}
                className="w-full"
              >
                Trainee Login
              </Button>
              <Button 
                variant={loginType === "staff" ? "default" : "outline"}
                onClick={() => setLoginType("staff")}
                className="w-full"
              >
                Staff Login
              </Button>
            </div>

            {loginType === "staff" && (
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose role" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffRoles.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            {loginType === "trainee" ? (
              <div className="grid gap-2">
                <Label>4-digit Passcode</Label>
                <Input 
                  inputMode="numeric" 
                  maxLength={4} 
                  placeholder="1234" 
                  value={pass} 
                  onChange={(e) => setPass(e.target.value)} 
                />
                <p className="text-sm text-muted-foreground">
                  Passcode provided by Training Coordinator via SMS/Email
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                  {role === "Other Staff" && (
                    <button 
                      className="text-sm text-primary" 
                      onClick={() => setRegisterOther((v) => !v)}
                    >
                      {registerOther ? "Have an account? Sign in" : "First time? Register"}
                    </button>
                  )}
                </div>
                <Input 
                  type="password" 
                  value={pass} 
                  onChange={(e) => setPass(e.target.value)} 
                />
              </>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Button 
              variant="hero" 
              className="w-full" 
              onClick={loginType === "trainee" ? onTraineeLogin : onStaffLogin}
            >
              {loginType === "staff" && role === "Other Staff" && registerOther ? "Create Account" : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;