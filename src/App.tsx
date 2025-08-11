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
import ManageTrainees from "./pages/management/ManageTrainees";
import TrainingReports from "./pages/management/TrainingReports";
import ManageUsers from "./pages/management/ManageUsers";
import GeneratePasscodes from "./pages/management/GeneratePasscodes";
import AllRecords from "./pages/management/AllRecords";
import EquipmentRequests from "./pages/management/EquipmentRequests";
import SizeData from "./pages/management/SizeData";
import EquipmentInventory from "./pages/management/EquipmentInventory";
import MedicalRecords from "./pages/management/MedicalRecords";
import NurseDashboard from "./pages/management/NurseDashboard";
import PlaceholderPage from "./pages/placeholder/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trainee-login" element={<TraineeLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forms/usee-uact" element={<YouSeeUActForm />} />
            <Route path="/forms/welcome-policy" element={<WelcomePolicyForm />} />
            <Route path="/forms/course-registration" element={<CourseRegistrationForm />} />
            <Route path="/forms/medical-screening" element={<MedicalScreeningForm />} />
            <Route path="/size-forms" element={<SizeForm />} />
            <Route path="/requests-complaints" element={<RequestsComplaints />} />
            <Route path="/forms/bosiet" element={<BOSIETForm />} />
            <Route path="/forms/fire-watch" element={<FireWatchForm />} />
            <Route path="/forms/cseand-r" element={<CSERForm />} />
            <Route path="/high-level-requests" element={<HighLevelRequests />} />
            <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
            <Route path="/assign-training" element={<AssignTraining />} />
            <Route path="/manage-trainees" element={<ManageTrainees />} />
            <Route path="/training-reports" element={<TrainingReports />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/generate-passcodes" element={<GeneratePasscodes />} />
            <Route path="/all-records" element={<AllRecords />} />
            <Route path="/assigned-trainees" element={<PlaceholderPage title="Assigned Trainees" description="View trainees assigned to you" />} />
            <Route path="/equipment-requests" element={<EquipmentRequests />} />
            <Route path="/size-data" element={<SizeData />} />
            <Route path="/equipment-inventory" element={<EquipmentInventory />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/nurse-dashboard" element={<NurseDashboard />} />
            <Route path="/health-reports" element={<PlaceholderPage title="Health Reports" description="Generate and view health reports" />} />
            <Route path="/safety-reports" element={<PlaceholderPage title="Safety Reports" description="Manage safety reports and incidents" />} />
            <Route path="/usee-uact-data" element={<PlaceholderPage title="U-See U-Act Data" description="Review U-See U-Act form submissions" />} />
            <Route path="/create-safety-forms" element={<PlaceholderPage title="Create Safety Forms" description="Create custom safety forms" />} />
            <Route path="/safety-complaints" element={<PlaceholderPage title="Safety Complaints" description="Handle safety-related complaints" />} />
            <Route path="/training-statistics" element={<PlaceholderPage title="Training Statistics" description="View comprehensive training statistics" />} />
            <Route path="/medical-reports-overview" element={<PlaceholderPage title="Medical Reports Overview" description="Overview of all medical reports" />} />
            <Route path="/user-activity" element={<PlaceholderPage title="User Activity" description="Monitor user activity across the platform" />} />
            <Route path="/escalate-to-coo" element={<PlaceholderPage title="Escalate to COO" description="Escalate important matters to the Chief Operations Officer" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;