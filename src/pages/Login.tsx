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

const roles: Role[] = [
  "Trainee",
  "Training Supervisor",
  "Training Coordinator",
  "Instructor / Team Lead",
  "Utility Office",
  "Nurse",
  "Safety Coordinator",
  "Operations Manager",
  "Chief Operations Officer",
  "Other Staff",
];

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUser = useAppState((s) => s.setUser);

  const [role, setRole] = useState<Role>("Trainee");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [registerOther, setRegisterOther] = useState(false);

  const onSubmit = () => {
    if (!email) {
      toast({ title: "Email required" });
      return;
    }

    if (role === "Trainee") {
      if (!/^\d{4}$/.test(pass)) {
        toast({ title: "Enter the 4-digit passcode" });
        return;
      }
      setUser({ email, role });
      navigate("/onboarding");
      return;
    }

    if (role === "Other Staff" && registerOther && pass.length < 4) {
      toast({ title: "Choose a password (min 4 chars)" });
      return;
    }

    setUser({ email, role });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-hero">
      <Helmet>
        <title>Login | Alpatech Training Portal</title>
        <meta name="description" content="Log in to Alpatech portal by role: trainee, supervisor, nurse, operations and more." />
      </Helmet>
      <div className="container mx-auto py-16 grid place-items-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-center">Select Role & Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {role === "Trainee" ? (
              <div className="grid gap-2">
                <Label>4-digit Passcode</Label>
                <Input inputMode="numeric" maxLength={4} placeholder="1234" value={pass} onChange={(e) => setPass(e.target.value)} />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                  {role === "Other Staff" && (
                    <button className="text-sm text-primary" onClick={() => setRegisterOther((v) => !v)}>
                      {registerOther ? "Have an account? Sign in" : "First time? Register"}
                    </button>
                  )}
                </div>
                <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
              </>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="hero" className="w-full" onClick={onSubmit}>
              {role === "Other Staff" && registerOther ? "Create Account" : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
