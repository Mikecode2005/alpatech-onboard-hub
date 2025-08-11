import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, RefreshCw, Key, Clock, User } from "lucide-react";

interface Passcode {
  id: string;
  code: string;
  role: string;
  is_used: boolean;
  used_by?: string;
  created_at: string;
  expires_at: string;
  used_at?: string;
}

const GeneratePasscodes = () => {
  const { toast } = useToast();
  const [passcodes, setPasscodes] = useState<Passcode[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [expiryDays, setExpiryDays] = useState(30);
  const [batchSize, setBatchSize] = useState(1);
  const [loading, setLoading] = useState(false);

  const roles = [
    "Trainee",
    "Training Supervisor", 
    "Instructor / Team Lead",
    "Utility Office",
    "Nurse",
    "Safety Coordinator",
    "Operations Manager",
    "Other Staff"
  ];

  useEffect(() => {
    fetchPasscodes();
  }, []);

  const fetchPasscodes = async () => {
    try {
      const { data, error } = await supabase
        .from('passcodes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPasscodes(data || []);
    } catch (error) {
      console.error('Error fetching passcodes:', error);
      toast({ title: "Error fetching passcodes", variant: "destructive" });
    }
  };

  const generatePasscode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createPasscodes = async () => {
    if (!selectedRole) {
      toast({ title: "Please select a role", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiryDays);

      const newPasscodes = Array.from({ length: batchSize }, () => ({
        code: generatePasscode(),
        role: selectedRole,
        expires_at: expiresAt.toISOString(),
        created_by: "00000000-0000-0000-0000-000000000000" // Placeholder UUID, will be replaced with actual auth in real system
      }));

      const { error } = await supabase
        .from('passcodes')
        .insert(newPasscodes);

      if (error) throw error;

      toast({ 
        title: "Passcodes generated successfully!",
        description: `Generated ${batchSize} passcode(s) for ${selectedRole}`
      });
      
      fetchPasscodes();
    } catch (error) {
      console.error('Error creating passcodes:', error);
      toast({ title: "Error generating passcodes", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const getStatusBadge = (passcode: Passcode) => {
    const now = new Date();
    const expiryDate = new Date(passcode.expires_at);
    
    if (passcode.is_used) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700">Used</Badge>;
    } else if (expiryDate < now) {
      return <Badge variant="outline" className="bg-red-50 text-red-700">Expired</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>;
    }
  };

  const activePasscodes = passcodes.filter(p => !p.is_used && new Date(p.expires_at) > new Date());
  const usedPasscodes = passcodes.filter(p => p.is_used);
  const expiredPasscodes = passcodes.filter(p => !p.is_used && new Date(p.expires_at) <= new Date());

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Generate Passcodes | Alpatech Training Portal</title>
        <meta name="description" content="Generate and manage access passcodes for different user roles" />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Passcode Management</h1>
          <Button onClick={fetchPasscodes} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generate Passcodes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Generate New Passcodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>User Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Expiry (Days)</Label>
                <Input
                  type="number"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value) || 30)}
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <Label>Batch Size</Label>
                <Input
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
                  min="1"
                  max="50"
                />
              </div>

              <Button 
                onClick={createPasscodes} 
                disabled={loading || !selectedRole}
                className="w-full"
                variant="hero"
              >
                {loading ? "Generating..." : "Generate Passcodes"}
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <span className="font-medium">Active Passcodes</span>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  {activePasscodes.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Used Passcodes</span>
                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                  {usedPasscodes.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                <span className="font-medium">Expired Passcodes</span>
                <Badge variant="outline" className="bg-red-100 text-red-700">
                  {expiredPasscodes.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {passcodes.slice(0, 5).map((passcode) => (
                  <div key={passcode.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="text-sm">
                      <div className="font-mono">{passcode.code}</div>
                      <div className="text-muted-foreground">{passcode.role}</div>
                    </div>
                    {getStatusBadge(passcode)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Passcodes List */}
        <Card>
          <CardHeader>
            <CardTitle>All Passcodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Code</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Created</th>
                    <th className="text-left p-3">Expires</th>
                    <th className="text-left p-3">Used By</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passcodes.map((passcode) => (
                    <tr key={passcode.id} className="border-b hover:bg-accent/50">
                      <td className="p-3 font-mono">{passcode.code}</td>
                      <td className="p-3">{passcode.role}</td>
                      <td className="p-3">{getStatusBadge(passcode)}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(passcode.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(passcode.expires_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm">
                        {passcode.used_by ? (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {passcode.used_by}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(passcode.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {passcodes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No passcodes generated yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneratePasscodes;