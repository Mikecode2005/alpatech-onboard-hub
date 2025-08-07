import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BrandLoader from "@/components/BrandLoader";
import { useEffect, useState } from "react";

const Index = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <BrandLoader label="alpatech" />;

  return (
    <div className="min-h-screen bg-hero">
      <Helmet>
        <title>Alpatech Training Portal</title>
        <meta name="description" content="Role-based Alpatech portal for trainees and staff: onboarding, safety, medical forms and PDF reports." />
      </Helmet>
      <main className="container mx-auto py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">Alpatech Training & Safety Portal</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Streamlined onboarding, medical screening and safety workflows for trainees and staff with role-based access.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild variant="hero">
            <Link to="/login">Get Started</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/forms/usee-uact">U-See U-Act</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
