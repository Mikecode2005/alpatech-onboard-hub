import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";
import { Copy, RefreshCw, Key, Clock, User } from "lucide-react";


const GeneratePasscodes = () => {
  const { toast } = useToast();
  const passcodes = useAppState((s) => s.passcodes);
  const addPasscode = useAppState((s) => s.addPasscode);
  const [traineeEmail, setTraineeEmail] = useState("");
  const [expiryDays, setExpiryDays] = useState(30);
  const [loading, setLoading] = useState(false);


  const generatePasscode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createPasscode = async () => {
    if (!traineeEmail) {
      toast({ title: "Please enter trainee email", variant: "destructive" });
      return;
    }

    const now = new Date();
    const hasActive = passcodes.some(p => p.traineeEmail.toLowerCase() === traineeEmail.toLowerCase() && !p.isUsed && new Date(p.expiresAt) > now);
    if (hasActive) {
      toast({ title: "Active passcode already exists for this email", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiryDays);
      const code = generatePasscode();

      addPasscode(traineeEmail, code, expiresAt.toISOString());

      toast({ 
        title: "Passcode generated successfully!",
        description: `Generated passcode for ${traineeEmail}`
      });
      
      setTraineeEmail("");
    } catch (error) {
      console.error('Error creating passcode:', error);
      toast({ title: "Error generating passcode", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const getStatusBadge = (passcode: { isUsed: boolean; expiresAt: string }) => {
    const now = new Date();
    const expiryDate = new Date(passcode.expiresAt);
    
    if (passcode.isUsed) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700">Used</Badge>;
    } else if (expiryDate < now) {
      return <Badge variant="outline" className="bg-red-50 text-red-700">Expired</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>;
    }
  };

  const activePasscodes = passcodes.filter(p => !p.isUsed && new Date(p.expiresAt) > new Date());
  const usedPasscodes = passcodes.filter(p => p.isUsed);
  const expiredPasscodes = passcodes.filter(p => !p.isUsed && new Date(p.expiresAt) <= new Date());

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Generate Passcodes | Alpatech Training Portal</title>
        <meta name="description" content="Generate and manage access passcodes for different user roles" />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Passcode Management</h1>
            <Button onClick={() => {}} variant="outline" size="sm">
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
                Generate Trainee Passcode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Trainee Email</Label>
                <Input
                  type="email"
                  placeholder="trainee@company.com"
                  value={traineeEmail}
                  onChange={(e) => setTraineeEmail(e.target.value)}
                />
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

              <Button 
                onClick={createPasscode} 
                disabled={loading || !traineeEmail}
                className="w-full"
                variant="default"
              >
                {loading ? "Generating..." : "Generate Passcode"}
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
                      <div className="text-muted-foreground">Trainee</div>
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
                    <th className="text-left p-3">Trainee Email</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passcodes.map((passcode) => (
                    <tr key={passcode.id} className="border-b hover:bg-accent/50">
                      <td className="p-3 font-mono">{passcode.code}</td>
                      <td className="p-3">Trainee</td>
                      <td className="p-3">{getStatusBadge(passcode)}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(passcode.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(passcode.expiresAt).toLocaleDateString()}
                      </td>
                       <td className="p-3 text-sm">
                         {passcode.traineeEmail || "-"}
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