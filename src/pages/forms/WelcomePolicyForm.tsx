import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";
import { useNavigate } from "react-router-dom";
import * as SupabaseServices from "@/integrations/supabase/services";

const WelcomePolicyForm = () => {
  const navigate = useNavigate();
  const { saveWelcomePolicy } = useAppState();
  const { toast } = useToast();
  const user = useAppState((s) => s.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    signatureDataUrl: undefined as string | undefined,
    date: "",
  });

  const handleSignature = async (f: File | null) => {
    if (!f) return;
    if (f.size > 200 * 1024) {
      toast({ title: "Signature must be ≤ 200KB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, signatureDataUrl: reader.result as string }));
    reader.readAsDataURL(f);
  };

  const onSubmit = async () => {
    if (!form.fullName || !form.date || !form.signatureDataUrl) {
      toast({ title: "All fields are required" });
      return;
    }

    if (!user?.email) {
      toast({ 
        title: "Authentication error", 
        description: "Please log in again to submit this form.",
        variant: "destructive"
      });
      navigate("/trainee-login");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to local state
      saveWelcomePolicy(form);
      
      // Save to Supabase
      await SupabaseServices.saveWelcomePolicyToSupabase(user.email, form);
      
      toast({ title: "Welcome Policy Form Submitted Successfully!" });
      navigate("/onboarding");
    } catch (error) {
      console.error("Error saving welcome policy form:", error);
      toast({ 
        title: "Submission error", 
        description: "There was an error submitting your form. Your data has been saved locally.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Welcome Policy Form | Alpatech</title>
        <meta name="description" content="AENL No Gift Policy acknowledgment form for trainees." />
      </Helmet>
      <div className="container mx-auto py-10 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-2xl font-bold mb-2">Welcome to Alpatech Training Centre</div>
              <div className="text-lg font-normal text-muted-foreground">AENL NO GIFT POLICY (THIRD PARTY COMPLIANCE)</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 p-6 rounded-lg border relative">
              <div className="absolute top-2 right-2 text-xs text-muted-foreground opacity-30 rotate-12 font-mono">
                WATERMARK: AENL NO GIFT POLICY
              </div>
              
              <div className="text-sm space-y-4 text-foreground">
                <p className="font-semibold text-lg text-center mb-4">AENL NO GIFT POLICY (THIRD PARTY COMPLIANCE)</p>
                
                <p>Please be informed that AENL advocates the value of <strong>integrity and trustworthiness</strong> in all our business activities. AENL would like to announce that it strictly adheres to a <strong>NO GIFT POLICY</strong>.</p>
                
                <p>The No Gift Policy is adopted by AENL to prevent or appreciate conflicts of interest that may compromise the integrity and position of the company. AENL will not give or receive any form of gift to/from third parties, including trainees, delegates, contractors, or any external personnel, regardless of the purpose and/or intent behind such gift.</p>
                
                <p>This policy is meant to clearly state that <strong>no trainee or delegate</strong> attending training at Alpatech Training Centre is permitted to give any form of gift to Alpatech personnel or training instructors. This includes but is not limited to:</p>
                
                <ul className="list-disc list-inside ml-6 space-y-2">
                  <li>Cash, monetary gifts, or financial considerations</li>
                  <li>Physical items, products, or merchandise</li>
                  <li>Services, favors, or professional assistance</li>
                  <li>Entertainment, hospitality, or social events</li>
                  <li>Any other form of consideration or benefit</li>
                </ul>
                
                <p>Similarly, Alpatech personnel are strictly prohibited from accepting any gifts, favors, or considerations from trainees, delegates, or their representatives.</p>
                
                <p>Alpatech is committed to treating the violation of this policy with the seriousness it deserves, up to and including:</p>
                <ul className="list-disc list-inside ml-6 space-y-1">
                  <li>Immediate termination of training services</li>
                  <li>Reporting violations to appropriate government agencies</li>
                  <li>Legal action where applicable</li>
                  <li>Permanent ban from Alpatech facilities and services</li>
                </ul>
                
                <p>We appreciate your cooperation in helping us maintain the highest standards of integrity and professionalism. Your adherence to this policy assists us in serving you better while maintaining our commitment to ethical business practices.</p>
                
                <div className="bg-primary/10 p-4 rounded border-l-4 border-primary mt-6">
                  <p className="font-semibold">ACKNOWLEDGMENT:</p>
                  <p>By signing below, you acknowledge that you have read, understood, and agree to comply with this NO GIFT POLICY throughout your training period and any future interactions with Alpatech personnel. You understand that violation of this policy may result in immediate termination of services and other consequences as outlined above.</p>
                </div>
              </div>
            </div>
            
            <div className="grid gap-6 mt-8">
              <div className="grid gap-2">
                <Label className="text-base font-semibold">Full Name (as it appears on official documents) *</Label>
                <Input 
                  value={form.fullName} 
                  onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your complete full name"
                  className="text-lg"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="text-base font-semibold">Date of Acknowledgment *</Label>
                <Input 
                  type="date" 
                  value={form.date} 
                  onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                  className="text-lg"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="text-base font-semibold">Digital Signature Upload (≤ 200KB) *</Label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleSignature(e.target.files?.[0] || null)}
                  className="text-base"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  Please upload a clear image of your signature. Accepted formats: JPG, PNG, GIF. Maximum size: 200KB.
                </p>
                {form.signatureDataUrl && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">Signature Preview:</p>
                    <img 
                      src={form.signatureDataUrl} 
                      alt="Signature preview" 
                      className="h-20 border rounded bg-white p-2" 
                      loading="lazy" 
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="hero" 
              onClick={onSubmit}
              className="w-full max-w-md text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "I Acknowledge and Accept the NO GIFT POLICY"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WelcomePolicyForm;