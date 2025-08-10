import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  pageTitle?: string;
}

const PlaceholderPage = ({ title, description, pageTitle }: PlaceholderPageProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{pageTitle || title} - Alpatech Training Centre</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feature Coming Soon</CardTitle>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🚧</div>
                <h3 className="text-xl font-semibold">Under Development</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This feature is currently being developed and will be available soon. 
                  Thank you for your patience.
                </p>
                <Button onClick={() => navigate("/dashboard")} variant="secondary">
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceholderPage;