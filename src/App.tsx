import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import YouSeeUActForm from "./pages/forms/YouSeeUActForm";
import BOSIETForm from "./pages/forms/BOSIETForm";
import FireWatchForm from "./pages/forms/FireWatchForm";
import CSERForm from "./pages/forms/CSERForm";
import SizeForm from "./pages/forms/SizeForm";
import RequestsComplaints from "./pages/RequestsComplaints";
import Login from "./pages/Login";

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
            <Route path="/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forms/usee-uact" element={<YouSeeUActForm />} />
            <Route path="/size-forms" element={<SizeForm />} />
            <Route path="/requests-complaints" element={<RequestsComplaints />} />
            <Route path="/forms/bosiet" element={<BOSIETForm />} />
            <Route path="/forms/fire-watch" element={<FireWatchForm />} />
            <Route path="/forms/cseand-r" element={<CSERForm />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;