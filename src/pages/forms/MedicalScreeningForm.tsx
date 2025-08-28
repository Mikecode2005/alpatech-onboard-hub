import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";
import { useNavigate } from "react-router-dom";
import * as SupabaseServices from "@/integrations/supabase/services";

const MedicalScreeningForm = () => {
  const navigate = useNavigate();
  const { saveMedicalScreening } = useAppState();
  const { toast } = useToast();
  const user = useAppState((s) => s.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    nameOfCompany: "",
    gender: "Male" as "Male" | "Female",
    age: "",
    hasCondition: false,
    medication: "",
    remarks: "",
    healthConditionDetails: "",
    fireProximityInfo: "",
    weaponPossession: "",
    attestationName: "",
    attestationDate: "",
    attestationSignature: "",
    companySponsors: "",
  });

  const onSubmit = async () => {
    if (!form.name || !form.nameOfCompany || !form.age) {
      toast({ title: "Please fill in all required fields" });
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
      saveMedicalScreening(form);
      
      // Save to Supabase
      await SupabaseServices.saveMedicalScreeningToSupabase(user.email, form);
      
      toast({ title: "Medical Screening Form Submitted Successfully!" });
      
      // Check if there are assigned trainings to navigate to
      const assignedTrainings = useAppState.getState().assignedTrainings;
      if (assignedTrainings && assignedTrainings.length > 0) {
        // Navigate to the next step in onboarding
        navigate("/onboarding");
      } else {
        // If no assigned trainings, go to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error saving medical screening form:", error);
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
        <title>Medical Screening Form | Alpatech</title>
        <meta name="description" content="Complete your medical screening assessment for training participation." />
      </Helmet>
      <div className="container mx-auto py-10 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-2xl font-bold mb-2">MEDICAL SCREENING FORM</div>
              <div className="text-sm text-muted-foreground">Pre-Training Medical Assessment</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Name *</Label>
                  <Input 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full Name"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Name of Company *</Label>
                  <Input 
                    value={form.nameOfCompany} 
                    onChange={(e) => setForm({ ...form, nameOfCompany: e.target.value })}
                    placeholder="Company Name"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Gender</Label>
                  <Select 
                    value={form.gender} 
                    onValueChange={(v) => setForm({ ...form, gender: v as "Male" | "Female" })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Age *</Label>
                  <Select 
                    value={form.age} 
                    onValueChange={(v) => setForm({ ...form, age: v })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16-20">16-20</SelectItem>
                      <SelectItem value="20-25">20-25</SelectItem>
                      <SelectItem value="25-35">25-35</SelectItem>
                      <SelectItem value="35-40">35-40</SelectItem>
                      <SelectItem value="40-45">40-45</SelectItem>
                      <SelectItem value="45-50">45-50</SelectItem>
                      <SelectItem value="50-55">50-55</SelectItem>
                      <SelectItem value="55+">55 & above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Medical Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input 
                    id="hasCondition" 
                    type="checkbox" 
                    checked={form.hasCondition} 
                    onChange={(e) => setForm({ ...form, hasCondition: e.target.checked })} 
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="hasCondition">Do you have any medical condition that may affect your training?</Label>
                </div>
                
                <div className="grid gap-2">
                  <Label>Current Medications (if any)</Label>
                  <Textarea 
                    value={form.medication} 
                    onChange={(e) => setForm({ ...form, medication: e.target.value })}
                    placeholder="List any medications you are currently taking"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Health Condition Details</Label>
                  <Textarea 
                    value={form.healthConditionDetails} 
                    onChange={(e) => setForm({ ...form, healthConditionDetails: e.target.value })}
                    placeholder="Provide details of any health conditions"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Fire Proximity Information</Label>
                  <Textarea 
                    value={form.fireProximityInfo} 
                    onChange={(e) => setForm({ ...form, fireProximityInfo: e.target.value })}
                    placeholder="Any concerns about working near fire or smoke?"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Weapon Possession</Label>
                  <Input 
                    value={form.weaponPossession} 
                    onChange={(e) => setForm({ ...form, weaponPossession: e.target.value })}
                    placeholder="Are you in possession of any weapon? If yes, specify"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Additional Remarks</Label>
                  <Textarea 
                    value={form.remarks} 
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    placeholder="Any additional medical information or concerns"
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Attestation</h3>
              <div className="bg-accent/10 p-4 rounded border">
                <p className="text-sm">
                  I hereby declare that the information provided above is true and accurate to the best of my knowledge. 
                  I understand that any false information may result in disqualification from the training program.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input 
                    value={form.attestationName} 
                    onChange={(e) => setForm({ ...form, attestationName: e.target.value })} 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={form.attestationDate} 
                    onChange={(e) => setForm({ ...form, attestationDate: e.target.value })} 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Signature</Label>
                  <Input 
                    value={form.attestationSignature} 
                    onChange={(e) => setForm({ ...form, attestationSignature: e.target.value })}
                    placeholder="Digital signature"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Company/Sponsor</Label>
                <Input 
                  value={form.companySponsors} 
                  onChange={(e) => setForm({ ...form, companySponsors: e.target.value })} 
                  placeholder="Name of sponsoring company"
                  disabled={isSubmitting}
                />
              </div>
            </section>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="hero" 
              onClick={onSubmit}
              className="w-full max-w-md text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Medical Screening Form"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MedicalScreeningForm;