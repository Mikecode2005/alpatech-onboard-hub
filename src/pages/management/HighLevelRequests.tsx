import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const HighLevelRequests = () => {
  const navigate = useNavigate();

  const sampleRequests = [
    {
      id: 1,
      title: "Budget Increase for Safety Equipment",
      submittedBy: "Operations Manager",
      priority: "High",
      status: "Under Review",
      date: "2024-01-08"
    },
    {
      id: 2,
      title: "New Training Facility Proposal",
      submittedBy: "Training Coordinator",
      priority: "Medium",
      status: "Approved",
      date: "2024-01-05"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "default";
      case "Under Review": return "secondary";
      case "Rejected": return "destructive";
      default: return "outline";
    }
  };

  return (
    <>
      <Helmet>
        <title>High-Level Requests - Alpatech Training Centre</title>
        <meta name="description" content="Executive level requests and proposals management" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">High-Level Requests</h1>
              <p className="text-muted-foreground">Review and manage executive-level requests and proposals</p>
            </div>
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </div>

          <div className="grid gap-6">
            {sampleRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{request.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(request.priority)}>
                        {request.priority} Priority
                      </Badge>
                      <Badge variant={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Submitted by:</span>
                      <p className="text-muted-foreground">{request.submittedBy}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>
                      <p className="text-muted-foreground">{request.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">View Details</Button>
                      {request.status === "Under Review" && (
                        <>
                          <Button size="sm" variant="default">Approve</Button>
                          <Button size="sm" variant="destructive">Reject</Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HighLevelRequests;