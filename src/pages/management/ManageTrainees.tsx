import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const ManageTrainees = () => {
  const navigate = useNavigate();

  const sampleTrainees = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      company: "ABC Corporation",
      status: "Active",
      completedModules: 3,
      totalModules: 5
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      company: "XYZ Industries",
      status: "Completed",
      completedModules: 4,
      totalModules: 4
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "secondary";
      case "Completed": return "default";
      case "Pending": return "outline";
      default: return "outline";
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Trainees - Alpatech Training Centre</title>
        <meta name="description" content="Manage trainee accounts and progress" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Trainees</h1>
              <p className="text-muted-foreground">View and manage trainee accounts and progress</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary">Add New Trainee</Button>
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {sampleTrainees.map((trainee) => (
              <Card key={trainee.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{trainee.name}</CardTitle>
                    <Badge variant={getStatusColor(trainee.status)}>
                      {trainee.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="text-muted-foreground">{trainee.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Company:</span>
                      <p className="text-muted-foreground">{trainee.company}</p>
                    </div>
                    <div>
                      <span className="font-medium">Progress:</span>
                      <p className="text-muted-foreground">
                        {trainee.completedModules}/{trainee.totalModules} modules
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">View Details</Button>
                      <Button size="sm" variant="outline">Edit</Button>
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

export default ManageTrainees;