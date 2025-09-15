import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/state/appState";
import jsPDF from "jspdf";

const Dashboard = () => {
  const navigate = useNavigate();
  const state = useAppState();
  const { user, welcomePolicy, courseRegistration, medicalScreening, assignedTrainings, requestsComplaints } = state;

  const logout = () => {
    state.reset();
    navigate("/login");
  };

  const generatePdf = async () => {
    const doc = new jsPDF();
    let y = 20;
    
    // Header
    doc.setFontSize(18);
    doc.text("ALPATECH TRAINING CENTRE", 14, y);
    y += 10;
    doc.setFontSize(14);
    doc.text("Trainee Comprehensive Report", 14, y);
    y += 15;
    
    doc.setFontSize(11);
    if (user?.email) {
      doc.text(`Email: ${user.email}`, 14, y);
      y += 8;
    }
    
    // Welcome Policy Section
    if (welcomePolicy) {
      doc.setFont(undefined, "bold");
      doc.text("WELCOME POLICY - AENL NO GIFT POLICY", 14, y);
      doc.setFont(undefined, "normal");
      y += 8;
      doc.text(`Full Name: ${welcomePolicy.fullName}`, 14, y);
      y += 6;
      doc.text(`Date: ${welcomePolicy.date}`, 14, y);
      y += 6;
      if (welcomePolicy.signatureDataUrl) {
        try {
          doc.addImage(welcomePolicy.signatureDataUrl, "PNG", 14, y, 40, 15);
          y += 20;
        } catch (e) {
          doc.text("Signature: [Image attached]", 14, y);
          y += 6;
        }
      }
      y += 5;
    }

    // Course Registration Section
    if (courseRegistration) {
      doc.setFont(undefined, "bold");
      doc.text("COURSE REGISTRATION", 14, y);
      doc.setFont(undefined, "normal");
      y += 8;
      const cr = courseRegistration;
      const courseLines = [
        `Course Name: ${cr.courseName}`,
        `Duration: ${cr.courseStartDate} to ${cr.courseEndDate}`,
        `Student Name: ${cr.firstName} ${cr.middleName || ''} ${cr.surname}`,
        `Company: ${cr.companyName || 'N/A'}`,
        `Email: ${cr.email || ''}`,
        `Phone: ${cr.phone || 'N/A'}`,
        `Job Title: ${cr.jobTitle || 'N/A'}`,
      ];
      courseLines.forEach((line) => {
        doc.text(line, 14, y);
        y += 6;
      });
      y += 5;
    }

    // Medical Screening Section
    if (medicalScreening) {
      doc.setFont(undefined, "bold");
      doc.text("MEDICAL SCREENING", 14, y);
      doc.setFont(undefined, "normal");
      y += 8;
      const ms = medicalScreening;
      const medLines = [
        `Name: ${ms.name || ''}`,
        `Company: ${ms.nameOfCompany || ''}`,
        `Gender: ${ms.gender || ''}`,
        `Age: ${ms.age || ''}`,
        `Special Medication: ${ms.hasCondition ? 'Yes' : 'No'}`,
        `Medication Details: ${ms.medication || 'None'}`,
        `Health Condition Details: ${ms.healthConditionDetails || 'None'}`,
      ];
      medLines.forEach((line) => {
        doc.text(line, 14, y);
        y += 6;
      });
      y += 5;
    }

    // Training Assignments
    if (assignedTrainings.length > 0) {
      doc.setFont(undefined, "bold");
      doc.text("ASSIGNED TRAINING MODULES", 14, y);
      doc.setFont(undefined, "normal");
      y += 8;
      assignedTrainings.forEach((training) => {
        doc.text(`• ${training}`, 14, y);
        y += 6;
      });
    }

    doc.save("alpatech-trainee-comprehensive-report.pdf");
  };

  const traineeNeedsOnboarding = user?.role === "Trainee" && (!welcomePolicy || !courseRegistration || !medicalScreening);
  const pendingRequests = requestsComplaints.filter(r => r.status === "Pending").length;

  const getRoleDashboard = () => {
    switch (user?.role) {
      case "Trainee":
        return (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trainee Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {traineeNeedsOnboarding ? (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-4">Complete Your Onboarding</h3>
                    <p className="text-muted-foreground mb-6">You need to complete all pre-training forms before accessing training modules.</p>
                    <Button asChild variant="hero" size="lg">
                      <Link to="/onboarding">Start Onboarding Process</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Training Status</h3>
                      <Button onClick={generatePdf} variant="secondary">
                        Download Report PDF
                      </Button>
                    </div>
                    
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-500">
                        <span>✅ Welcome Policy</span>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-500">
                        <span>✅ Course Registration</span>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-500">
                        <span>✅ Medical Screening</span>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Assigned Training Modules</h4>
                      {assignedTrainings.length > 0 ? (
                        <div className="grid gap-2">
                          {assignedTrainings.map((training) => (
                            <div key={training} className="flex items-center justify-between p-3 border rounded">
                              <span>{training}</span>
                              <Button asChild size="sm">
                                <Link to={`/forms/${training.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`}>
                                  Start Training
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No training modules assigned yet. Contact your Training Supervisor.</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "Training Supervisor":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Supervision Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Access your dedicated supervisor dashboard with full training oversight capabilities</p>
                <Button onClick={() => navigate("/management/training-supervisor")} className="w-full">
                  Open Training Supervisor Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "Training Coordinator":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Coordination Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Access your comprehensive training coordination dashboard with full management capabilities</p>
                <Button onClick={() => navigate("/management/training-coordinator")} className="w-full">
                  Open Training Coordinator Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "Instructor / Team Lead":
        return (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Instructor / Team Lead Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button asChild variant="hero">
                    <Link to="/assigned-trainees">View Assigned Trainees</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link to="/size-forms">Submit Size Forms</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/equipment-requests">Equipment Requests</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link to="/forms/usee-uact">U-See U-Act Form</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "Utility Office":
        return (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utility Office Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild variant="hero">
                    <Link to="/size-data">View Size Data</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link to="/equipment-inventory">Equipment Inventory</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/requests-complaints">Send Requests</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link to="/forms/usee-uact">U-See U-Act Form</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "Nurse":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nurse Dashboard Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Access your dedicated nurse dashboard for medical record reviews and health assessments</p>
                <Button onClick={() => navigate("/management/nurse-dashboard")} className="w-full">
                  Open Nurse Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "Safety Coordinator":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Safety Coordinator Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Access your comprehensive safety coordination dashboard with incident management and compliance tracking</p>
                <Button onClick={() => navigate("/management/safety-coordinator")} className="w-full">
                  Open Safety Coordinator Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "Operations Manager":
        return (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Operations Manager Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button asChild variant="hero">
                    <Link to="/operations-manager-dashboard">Operations Dashboard</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link to="/toolbox-talk-dashboard">Toolbox Talks</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link to="/medical-reports-overview">Medical Reports</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/escalate-to-coo">Escalate to COO</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link to="/forms/usee-uact">U-See U-Act Form</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "Chief Operations Officer":
        return (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chief Operations Officer Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Executive Overview</h3>
                    <div className="grid gap-4">
                      <Button asChild variant="hero">
                        <Link to="/executive-dashboard">Executive Dashboard</Link>
                      </Button>
                      <Button asChild variant="secondary">
                        <Link to="/high-level-requests">High-Level Requests</Link>
                      </Button>
                      <Button asChild variant="secondary">
                        <Link to="/toolbox-talk-dashboard">Toolbox Talks</Link>
                      </Button>
                      <Button asChild variant="secondary">
                        <Link to="/forms/usee-uact">U-See U-Act Form</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Analytics</h3>
                    <div className="bg-accent/10 p-4 rounded border">
                      <p className="text-sm text-muted-foreground">
                        Comprehensive graphs, circular progress bars, and activity overviews will be displayed here.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "Other Staff":
        return (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild variant="secondary">
                    <Link to="/requests-complaints">Send Requests/Complaints</Link>
                  </Button>
                  <Button asChild variant="hero">
                    <Link to="/forms/usee-uact">U-See U-Act Form</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "Super Admin":
        return (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Super Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                  <p className="text-red-800 font-medium">⚠️ Super Admin Access - Full System Override</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button asChild variant="destructive">
                    <Link to="/system-management">System Management</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link to="/all-users">All Users</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link to="/system-logs">System Logs</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/database-management">Database Management</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please contact your administrator to set up your role permissions.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard | Alpatech Training Portal</title>
        <meta name="description" content="Role-based dashboard for Alpatech training portal with comprehensive functionality." />
      </Helmet>
      <div className="container mx-auto py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome{user?.email ? `, ${user.email}` : ""}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{user?.role || "Guest"}</Badge>
              {user?.role === "Trainee" && user?.passcode && (
                <Badge variant="secondary">Passcode: {user.passcode}</Badge>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>

        {getRoleDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;