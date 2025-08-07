import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/state/appState";
import jsPDF from "jspdf";

const Dashboard = () => {
  const navigate = useNavigate();
  const state = useAppState();
  const { user, welcomePolicy, courseRegistration, medicalScreening, assignedTrainings } = state;

  const logout = () => {
    state.reset();
    navigate("/login");
  };

  const generatePdf = async () => {
    const doc = new jsPDF();
    let y = 12;
    doc.setFontSize(16);
    doc.text("Alpatech – Trainee Report", 14, y);
    y += 8;
    doc.setFontSize(11);
    if (user?.email) doc.text(`Email: ${user.email}`, 14, y), (y += 6);

    doc.setFont(undefined, "bold");
    doc.text("Welcome Policy", 14, y);
    doc.setFont(undefined, "normal");
    y += 6;
    if (welcomePolicy) {
      doc.text(`Name: ${welcomePolicy.fullName}`, 14, y);
      y += 6;
      doc.text(`Date: ${welcomePolicy.date}`, 14, y);
      y += 6;
      if (welcomePolicy.signatureDataUrl) {
        try {
          doc.addImage(welcomePolicy.signatureDataUrl, "PNG", 14, y, 30, 12);
          y += 16;
        } catch {}
      }
    }

    doc.setFont(undefined, "bold");
    doc.text("Course Registration", 14, y);
    doc.setFont(undefined, "normal");
    y += 6;
    if (courseRegistration) {
      const cr = courseRegistration;
      const lines = [
        `Course: ${cr.courseName}`,
        `Start: ${cr.courseStartDate}  End: ${cr.courseEndDate}`,
        `First Name: ${cr.firstName}  Surname: ${cr.surname}`,
        `Email: ${cr.email || ""}  Phone: ${cr.phone || ""}`,
      ];
      lines.forEach((t) => {
        doc.text(t, 14, y);
        y += 6;
      });
    }

    doc.setFont(undefined, "bold");
    doc.text("Medical Screening", 14, y);
    doc.setFont(undefined, "normal");
    y += 6;
    if (medicalScreening) {
      const ms = medicalScreening;
      const lines = [
        `Condition: ${ms.hasCondition ? "Yes" : "No"}`,
        `Medication: ${ms.medication || "-"}`,
        `Remarks: ${ms.remarks || "-"}`,
      ];
      lines.forEach((t) => {
        doc.text(t, 14, y);
        y += 6;
      });
    }

    doc.save("alpatech-trainee-report.pdf");
  };

  const traineeNeedsOnboarding = user?.role === "Trainee" && (!welcomePolicy || !courseRegistration || !medicalScreening);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard | Alpatech</title>
        <meta name="description" content="Role-based dashboard for Alpatech training portal." />
      </Helmet>
      <div className="container mx-auto py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Welcome{user?.email ? `, ${user.email}` : ""}</h1>
            <p className="text-muted-foreground">Role: {user?.role || "Guest"}</p>
          </div>
          <div className="flex gap-3">
            {user?.role === "Trainee" && !traineeNeedsOnboarding && (
              <Button variant="secondary" onClick={generatePdf}>Download PDF</Button>
            )}
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>

        {user?.role === "Trainee" && (
          <Card>
            <CardHeader>
              <CardTitle>Trainee Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {traineeNeedsOnboarding ? (
                <Button asChild variant="hero">
                  <Link to="/onboarding">Complete Onboarding</Link>
                </Button>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground">Assigned trainings: {assignedTrainings.length ? assignedTrainings.join(", ") : "none yet"}</div>
                  <Button asChild variant="hero">
                    <Link to="/forms/usee-uact">Open U-See U-Act</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {user && user.role !== "Trainee" && (
          <Card>
            <CardHeader>
              <CardTitle>Team Tools</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild variant="hero">
                <Link to="/forms/usee-uact">U-See U-Act Form</Link>
              </Button>
              <Button variant="secondary" onClick={generatePdf}>Export Sample PDF</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
