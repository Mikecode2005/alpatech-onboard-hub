import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TraineeLogin from "./pages/TraineeLogin";
import StaffLogin from "./pages/StaffLogin";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import YouSeeUActForm from "./pages/forms/YouSeeUActForm";
import WelcomePolicyForm from "./pages/forms/WelcomePolicyForm";
import CourseRegistrationForm from "./pages/forms/CourseRegistrationForm";
import MedicalScreeningForm from "./pages/forms/MedicalScreeningForm";
import BOSIETForm from "./pages/forms/BOSIETForm";
import FireWatchForm from "./pages/forms/FireWatchForm";
import CSERForm from "./pages/forms/CSERForm";
import SizeForm from "./pages/forms/SizeForm";
import RequestsComplaints from "./pages/RequestsComplaints";
import HighLevelRequests from "./pages/management/HighLevelRequests";
import ExecutiveDashboard from "./pages/management/ExecutiveDashboard";
import AssignTraining from "./pages/management/AssignTraining";
import TrainingCoordinatorDashboard from "./pages/management/TrainingCoordinatorDashboard";
import TrainingSupervisorDashboard from "./pages/management/TrainingSupervisorDashboard";
import SafetyCoordinatorDashboard from "./pages/management/SafetyCoordinatorDashboard";
import NurseDashboard from "./pages/management/NurseDashboard";
import ManageTrainees from "./pages/management/ManageTrainees";
import TrainingReports from "./pages/management/TrainingReports";
import ManageUsers from "./pages/management/ManageUsers";
import GeneratePasscodes from "./pages/management/GeneratePasscodes";
import AllRecords from "./pages/management/AllRecords";
import EquipmentRequests from "./pages/management/EquipmentRequests";
import SizeData from "./pages/management/SizeData";
import EquipmentInventory from "./pages/management/EquipmentInventory";
import MedicalRecords from "./pages/management/MedicalRecords";
import PlaceholderPage from "./pages/placeholder/PlaceholderPage";
import PasscodeManagement from "./pages/management/PasscodeManagement";
import StaffRegistration from "./pages/management/StaffRegistration";
import TrainingSetManagement from "./pages/management/TrainingSetManagement";
import DeskOfficerVerification from "./pages/management/DeskOfficerVerification";
import YouSeeUActData from "./pages/YouSeeUActData";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/trainee-login" element={<TraineeLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - Trainee */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Form Routes */}
            <Route path="/forms/welcome-policy" element={
              <ProtectedRoute>
                <WelcomePolicyForm />
              </ProtectedRoute>
            } />
            <Route path="/forms/course-registration" element={
              <ProtectedRoute>
                <CourseRegistrationForm />
              </ProtectedRoute>
            } />
            <Route path="/forms/medical-screening" element={
              <ProtectedRoute>
                <MedicalScreeningForm />
              </ProtectedRoute>
            } />
            <Route path="/forms/bosiet" element={
              <ProtectedRoute>
                <BOSIETForm />
              </ProtectedRoute>
            } />
            <Route path="/forms/fire-watch" element={
              <ProtectedRoute>
                <FireWatchForm />
              </ProtectedRoute>
            } />
            <Route path="/forms/cseand-r" element={
              <ProtectedRoute>
                <CSERForm />
              </ProtectedRoute>
            } />
            <Route path="/forms/usee-uact" element={
              <ProtectedRoute>
                <YouSeeUActForm />
              </ProtectedRoute>
            } />
            <Route path="/size-forms" element={
              <ProtectedRoute>
                <SizeForm />
              </ProtectedRoute>
            } />

            {/* You See U Act Data */}
            <Route path="/usee-uact-data" element={
              <ProtectedRoute requiredPermissions={["view_usee_uact"]}>
                <YouSeeUActData />
              </ProtectedRoute>
            } />

            {/* Requests & Complaints */}
            <Route path="/requests-complaints" element={
              <ProtectedRoute>
                <RequestsComplaints />
              </ProtectedRoute>
            } />
            <Route path="/high-level-requests" element={
              <ProtectedRoute requiredPermissions={["manage_requests"]}>
                <HighLevelRequests />
              </ProtectedRoute>
            } />

            {/* Management Routes */}
            <Route path="/executive-dashboard" element={
              <ProtectedRoute requiredPermissions={["admin_access"]}>
                <ExecutiveDashboard />
              </ProtectedRoute>
            } />
            <Route path="/assign-training" element={
              <ProtectedRoute requiredPermissions={["manage_trainees"]}>
                <AssignTraining />
              </ProtectedRoute>
            } />
            <Route path="/management/training-coordinator" element={
              <ProtectedRoute requiredAnyPermission={["admin_access"]}>
                <TrainingCoordinatorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/management/training-supervisor" element={
              <ProtectedRoute requiredAnyPermission={["manage_trainees"]}>
                <TrainingSupervisorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/management/safety-coordinator" element={
              <ProtectedRoute requiredPermissions={["create_safety_forms"]}>
                <SafetyCoordinatorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/management/nurse-dashboard" element={
              <ProtectedRoute requiredPermissions={["view_medical_data"]}>
                <NurseDashboard />
              </ProtectedRoute>
            } />
            <Route path="/management/assign-training" element={
              <ProtectedRoute requiredPermissions={["manage_trainees"]}>
                <AssignTraining />
              </ProtectedRoute>
            } />
            <Route path="/management/generate-passcodes" element={
              <ProtectedRoute requiredPermissions={["manage_passcodes"]}>
                <GeneratePasscodes />
              </ProtectedRoute>
            } />
            <Route path="/management/passcode-management" element={
              <ProtectedRoute requiredPermissions={["manage_passcodes"]}>
                <PasscodeManagement />
              </ProtectedRoute>
            } />
            <Route path="/management/manage-users" element={
              <ProtectedRoute requiredPermissions={["manage_users"]}>
                <ManageUsers />
              </ProtectedRoute>
            } />
            <Route path="/management/staff-registration" element={
              <ProtectedRoute requiredPermissions={["manage_users"]}>
                <StaffRegistration />
              </ProtectedRoute>
            } />
            <Route path="/management/manage-trainees" element={
              <ProtectedRoute requiredPermissions={["manage_trainees"]}>
                <ManageTrainees />
              </ProtectedRoute>
            } />
            <Route path="/management/training-sets" element={
              <ProtectedRoute requiredPermissions={["manage_trainees"]}>
                <TrainingSetManagement />
              </ProtectedRoute>
            } />
            <Route path="/management/desk-verification" element={
              <ProtectedRoute>
                <DeskOfficerVerification />
              </ProtectedRoute>
            } />
            <Route path="/management/training-reports" element={
              <ProtectedRoute requiredPermissions={["view_reports"]}>
                <TrainingReports />
              </ProtectedRoute>
            } />
            <Route path="/management/all-records" element={
              <ProtectedRoute requiredPermissions={["admin_access"]}>
                <AllRecords />
              </ProtectedRoute>
            } />
            <Route path="/management/medical-records" element={
              <ProtectedRoute requiredPermissions={["view_medical_data"]}>
                <MedicalRecords />
              </ProtectedRoute>
            } />
            <Route path="/management/high-level-requests" element={
              <ProtectedRoute requiredPermissions={["manage_requests"]}>
                <HighLevelRequests />
              </ProtectedRoute>
            } />
            <Route path="/management/equipment-requests" element={
              <ProtectedRoute>
                <EquipmentRequests />
              </ProtectedRoute>
            } />

            {/* Other Routes */}
            <Route path="/manage-trainees" element={
              <ProtectedRoute requiredPermissions={["manage_trainees"]}>
                <ManageTrainees />
              </ProtectedRoute>
            } />
            <Route path="/training-reports" element={
              <ProtectedRoute requiredPermissions={["view_reports"]}>
                <TrainingReports />
              </ProtectedRoute>
            } />
            <Route path="/manage-users" element={
              <ProtectedRoute requiredPermissions={["manage_users"]}>
                <ManageUsers />
              </ProtectedRoute>
            } />
            <Route path="/generate-passcodes" element={
              <ProtectedRoute requiredPermissions={["manage_passcodes"]}>
                <GeneratePasscodes />
              </ProtectedRoute>
            } />
            <Route path="/passcode-management" element={
              <ProtectedRoute requiredPermissions={["manage_passcodes"]}>
                <PasscodeManagement />
              </ProtectedRoute>
            } />
            <Route path="/all-records" element={
              <ProtectedRoute requiredPermissions={["admin_access"]}>
                <AllRecords />
              </ProtectedRoute>
            } />
            <Route path="/assigned-trainees" element={
              <ProtectedRoute requiredPermissions={["manage_trainees"]}>
                <PlaceholderPage title="Assigned Trainees" description="View trainees assigned to you" />
              </ProtectedRoute>
            } />
            <Route path="/equipment-requests" element={
              <ProtectedRoute>
                <EquipmentRequests />
              </ProtectedRoute>
            } />
            <Route path="/size-data" element={
              <ProtectedRoute>
                <SizeData />
              </ProtectedRoute>
            } />
            <Route path="/equipment-inventory" element={
              <ProtectedRoute>
                <EquipmentInventory />
              </ProtectedRoute>
            } />
            <Route path="/medical-records" element={
              <ProtectedRoute requiredPermissions={["view_medical_data"]}>
                <MedicalRecords />
              </ProtectedRoute>
            } />
            <Route path="/nurse-dashboard" element={
              <ProtectedRoute requiredPermissions={["view_medical_data"]}>
                <NurseDashboard />
              </ProtectedRoute>
            } />
            <Route path="/health-reports" element={
              <ProtectedRoute requiredPermissions={["view_medical_data"]}>
                <PlaceholderPage title="Health Reports" description="Generate and view health reports" />
              </ProtectedRoute>
            } />
            <Route path="/safety-reports" element={
              <ProtectedRoute requiredPermissions={["create_safety_forms"]}>
                <PlaceholderPage title="Safety Reports" description="Manage safety reports and incidents" />
              </ProtectedRoute>
            } />
            <Route path="/create-safety-forms" element={
              <ProtectedRoute requiredPermissions={["create_safety_forms"]}>
                <PlaceholderPage title="Create Safety Forms" description="Create custom safety forms" />
              </ProtectedRoute>
            } />
            <Route path="/safety-complaints" element={
              <ProtectedRoute requiredPermissions={["create_safety_forms"]}>
                <PlaceholderPage title="Safety Complaints" description="Handle safety-related complaints" />
              </ProtectedRoute>
            } />
            <Route path="/training-statistics" element={
              <ProtectedRoute requiredPermissions={["view_reports"]}>
                <PlaceholderPage title="Training Statistics" description="View comprehensive training statistics" />
              </ProtectedRoute>
            } />
            <Route path="/medical-reports-overview" element={
              <ProtectedRoute requiredPermissions={["view_medical_data"]}>
                <PlaceholderPage title="Medical Reports Overview" description="Overview of all medical reports" />
              </ProtectedRoute>
            } />
            <Route path="/user-activity" element={
              <ProtectedRoute requiredPermissions={["admin_access"]}>
                <PlaceholderPage title="User Activity" description="Monitor user activity across the platform" />
              </ProtectedRoute>
            } />
            <Route path="/escalate-to-coo" element={
              <ProtectedRoute>
                <PlaceholderPage title="Escalate to COO" description="Escalate important matters to the Chief Operations Officer" />
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;