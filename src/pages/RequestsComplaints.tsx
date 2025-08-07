import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";
import { useNavigate } from "react-router-dom";

const RequestsComplaints = () => {
  const navigate = useNavigate();
  const { submitRequestComplaint, updateRequestComplaintStatus, requestsComplaints, user } = useAppState();
  const { toast } = useToast();

  const [form, setForm] = useState({
    type: "Request" as "Request" | "Complaint",
    title: "",
    description: "",
    to: "Training Supervisor",
  });

  const [showForm, setShowForm] = useState(false);

  const onSubmit = () => {
    if (!form.title || !form.description) {
      toast({ title: "Title and description are required" });
      return;
    }

    submitRequestComplaint({
      type: form.type,
      title: form.title,
      description: form.description,
      from: user?.email || "Unknown",
      to: form.to,
      status: "Pending",
    });

    toast({ title: `${form.type} submitted successfully!` });
    setForm({ type: "Request", title: "", description: "", to: "Training Supervisor" });
    setShowForm(false);
  };

  const canManageRequests = ["Training Supervisor", "Training Coordinator", "Operations Manager", "Chief Operations Officer", "Super Admin"].includes(user?.role || "");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Requests & Complaints | Alpatech</title>
        <meta name="description" content="Submit and manage requests and complaints." />
      </Helmet>
      <div className="container mx-auto py-10 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Requests & Complaints</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="hero" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "New Request/Complaint"}
              </Button>
            </div>
          </div>

          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>Submit New Request/Complaint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "Request" | "Complaint" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Request">Request</SelectItem>
                        <SelectItem value="Complaint">Complaint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Send To</Label>
                    <Select value={form.to} onValueChange={(v) => setForm({ ...form, to: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Training Supervisor">Training Supervisor</SelectItem>
                        <SelectItem value="Training Coordinator">Training Coordinator</SelectItem>
                        <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                        <SelectItem value="Safety Coordinator">Safety Coordinator</SelectItem>
                        <SelectItem value="Chief Operations Officer">Chief Operations Officer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input 
                    placeholder="Brief title of your request/complaint"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Detailed description..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="hero" onClick={onSubmit} className="w-full">
                  Submit {form.type}
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                {canManageRequests ? "All Requests & Complaints" : "My Requests & Complaints"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requestsComplaints.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No requests or complaints found.</p>
              ) : (
                <div className="space-y-4">
                  {requestsComplaints.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.type} from {item.from} to {item.to}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.status === "Resolved" ? "default" : item.status === "In Progress" ? "secondary" : "outline"}>
                            {item.status}
                          </Badge>
                          {canManageRequests && item.status !== "Resolved" && (
                            <Select 
                              value={item.status} 
                              onValueChange={(status) => updateRequestComplaintStatus(item.id, status as any)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      <p className="text-sm mb-2">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(item.createdAt).toLocaleDateString()}
                        {item.resolvedAt && ` • Resolved: ${new Date(item.resolvedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestsComplaints;