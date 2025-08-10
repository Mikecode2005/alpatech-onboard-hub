import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TrainingReports = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Training Reports - Alpatech Training Centre</title>
        <meta name="description" content="Generate and view training reports" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Training Reports</h1>
              <p className="text-muted-foreground">Generate and view comprehensive training reports</p>
            </div>
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Training completion statistics for this month</p>
                <Button className="w-full" variant="secondary">Generate Report</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Individual Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Detailed progress reports for individual trainees</p>
                <Button className="w-full" variant="secondary">View Progress</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certification Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Track certification status and expiry dates</p>
                <Button className="w-full" variant="secondary">View Certifications</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Safety Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Safety training completion and incident reports</p>
                <Button className="w-full" variant="secondary">Safety Report</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equipment Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Training equipment utilization statistics</p>
                <Button className="w-full" variant="secondary">Equipment Report</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Create custom reports with specific parameters</p>
                <Button className="w-full" variant="secondary">Create Custom</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Monthly Training Summary - December 2024</span>
                  <Button size="sm" variant="outline">Download</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Safety Training Completion Report</span>
                  <Button size="sm" variant="outline">Download</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Equipment Utilization Report</span>
                  <Button size="sm" variant="outline">Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TrainingReports;