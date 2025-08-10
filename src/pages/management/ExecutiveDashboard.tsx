import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ExecutiveDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Executive Dashboard - Alpatech Training Centre</title>
        <meta name="description" content="Executive overview of training centre operations" />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Executive Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive overview of training centre operations</p>
            </div>
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234</div>
                <p className="text-muted-foreground">Active Trainees</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-muted-foreground">This Month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Safety Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <p className="text-muted-foreground">This Quarter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$125K</div>
                <p className="text-muted-foreground">This Month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-muted-foreground">Current</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">7</div>
                <p className="text-muted-foreground">Require Attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>New trainee enrollment</span>
                  <span className="text-muted-foreground text-sm">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Safety training completed</span>
                  <span className="text-muted-foreground text-sm">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Equipment request approved</span>
                  <span className="text-muted-foreground text-sm">1 day ago</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="secondary">Generate Monthly Report</Button>
                <Button className="w-full" variant="outline">Review Budget Allocations</Button>
                <Button className="w-full" variant="outline">Schedule Staff Meeting</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExecutiveDashboard;