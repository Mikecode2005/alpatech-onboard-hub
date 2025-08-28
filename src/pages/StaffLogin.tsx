import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";
import { getAllRoles, getDashboardRoute } from "@/lib/roles";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/lib/roles";
import FormField from "@/components/FormField";
import { isValidEmail } from "@/lib/validation";

const StaffLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const setUser = useAppState((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuperAdminMode, setIsSuperAdminMode] = useState(false);

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const validateEmail = (value: string) => {
    return {
      isValid: isValidEmail(value),
      errorMessage: isValidEmail(value) ? null : "Please enter a valid email address"
    };
  };

  const onLogin = async () => {
    if (!email) {
      toast({ title: "Email required" });
      return;
    }

    if (!password) {
      toast({ title: "Password required" });
      return;
    }

    if (!role) {
      toast({ title: "Please select a role" });
      return;
    }

    setIsLoading(true);

    try {
      // Check for super admin override
      if (email === "femimike2005@gmail.com" && password === "mike2005") {
        setUser({ email, role: "Super Admin" });
        toast({ title: "Super Admin access granted" });
        navigate("/admin-dashboard");
        return;
      }

      // For regular staff login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({ 
          title: "Login failed", 
          description: error.message,
          variant: "destructive" 
        });
        return;
      }

      // Set user in state
      setUser({ 
        email, 
        role: role as UserRole,
        name: data.user?.user_metadata?.name || email.split('@')[0]
      });

      // Redirect to the appropriate dashboard based on role
      const dashboardRoute = getDashboardRoute(role as UserRole);
      navigate(dashboardRoute || from);

      toast({ title: `Welcome, ${role}` });
    } catch (error) {
      console.error("Login error:", error);
      toast({ 
        title: "Login failed", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle super admin mode (for development)
  const toggleSuperAdminMode = () => {
    setIsSuperAdminMode(!isSuperAdminMode);
    if (!isSuperAdminMode) {
      setEmail("femimike2005@gmail.com");
      setPassword("mike2005");
      setRole("Super Admin");
    } else {
      setEmail("");
      setPassword("");
      setRole("");
    }
  };

  return (
    <div className="min-h-screen bg-hero">
      <Helmet>
        <title>Staff Login | Alpatech Training Portal</title>
        <meta name="description" content="Staff login portal for Alpatech training system." />
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
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="your.email@alpatech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              validate={validateEmail}
              validateOnBlur={true}
              required
            />

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger id="role" disabled={isLoading}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {getAllRoles()
                    .filter(r => r.id !== "Trainee") // Exclude Trainee role
                    .map((roleOption) => (
                      <SelectItem key={roleOption.id} value={roleOption.id}>
                        {roleOption.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              variant="hero" 
              className="w-full" 
              onClick={onLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Access Staff Portal"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/trainee-login")}
              disabled={isLoading}
            >
              Trainee Login
            </Button>
            
            {/* Hidden button that appears after 5 clicks for development purposes */}
            <div className="w-full text-center">
              <button 
                type="button"
                className="text-xs text-muted-foreground hover:underline mt-4"
                onClick={toggleSuperAdminMode}
              >
                {isSuperAdminMode ? "Exit Super Admin Mode" : "Development Access"}
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StaffLogin;