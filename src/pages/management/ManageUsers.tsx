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
import { Mail, Users, Trash2, Plus } from "lucide-react";

interface StaffEmail {
  id: string;
  email: string;
  role: string;
  created_at: string;
  is_registered: boolean;
}

const ManageUsers = () => {
  const { toast } = useToast();
  const [staffEmails, setStaffEmails] = useState<StaffEmail[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  const staffRoles = [
    "Training Supervisor",
    "Instructor / Team Lead", 
    "Utility Office",
    "Nurse",
    "Safety Coordinator",
    "Operations Manager",
    "Training Coordinator",
    "Chief Operations Officer",
    "Other Staff"
  ];

  useEffect(() => {
    fetchStaffEmails();
  }, []);

  const fetchStaffEmails = async () => {
    try {
      // This would fetch from staff_emails table when implemented
      // For now, showing placeholder data
      setStaffEmails([
        {
          id: "1",
          email: "supervisor@alpatech.com",
          role: "Training Supervisor",
          created_at: new Date().toISOString(),
          is_registered: true
        },
        {
          id: "2", 
          email: "nurse@alpatech.com",
          role: "Nurse",
          created_at: new Date().toISOString(),
          is_registered: false
        }
      ]);
    } catch (error) {
      toast({ title: "Error fetching staff emails", variant: "destructive" });
    }
  };

  const addStaffEmail = async () => {
    if (!newEmail || !selectedRole) {
      toast({ title: "Please enter email and select role", variant: "destructive" });
      return;
    }

    if (staffEmails.some(staff => staff.email === newEmail)) {
      toast({ title: "Email already exists", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const newStaff: StaffEmail = {
        id: Date.now().toString(),
        email: newEmail,
        role: selectedRole,
        created_at: new Date().toISOString(),
        is_registered: false
      };

      setStaffEmails([...staffEmails, newStaff]);
      setNewEmail("");
      setSelectedRole("");
      
      toast({ 
        title: "Staff email added successfully!",
        description: `${newEmail} can now register as ${selectedRole}`
      });
    } catch (error) {
      toast({ title: "Error adding staff email", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const removeStaffEmail = async (id: string) => {
    try {
      setStaffEmails(staffEmails.filter(staff => staff.id !== id));
      toast({ title: "Staff email removed successfully" });
    } catch (error) {
      toast({ title: "Error removing staff email", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Manage Staff Accounts | Alpatech Training Portal</title>
        <meta name="description" content="Add and manage staff email addresses for account registration" />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Manage Staff Accounts</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Users className="h-4 w-4 mr-1" />
            {staffEmails.length} Staff Members
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Staff Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Staff Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="staff@alpatech.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={addStaffEmail} 
                disabled={loading || !newEmail || !selectedRole}
                className="w-full"
                variant="hero"
              >
                {loading ? "Adding..." : "Add Staff Email"}
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
                <span className="font-medium">Registered</span>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  {staffEmails.filter(s => s.is_registered).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                <span className="font-medium">Pending Registration</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                  {staffEmails.filter(s => !s.is_registered).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="font-medium">Total Staff</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  {staffEmails.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Role Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staffRoles.slice(0, 5).map((role) => {
                  const count = staffEmails.filter(s => s.role === role).length;
                  return count > 0 ? (
                    <div key={role} className="flex items-center justify-between p-2 border rounded">
                      <div className="text-sm font-medium">{role}</div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Staff Email List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Added</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffEmails.map((staff) => (
                    <tr key={staff.id} className="border-b hover:bg-accent/50">
                      <td className="p-3 font-medium">{staff.email}</td>
                      <td className="p-3">{staff.role}</td>
                      <td className="p-3">
                        {staff.is_registered ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">Registered</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>
                        )}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(staff.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeStaffEmail(staff.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {staffEmails.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No staff emails added yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageUsers;