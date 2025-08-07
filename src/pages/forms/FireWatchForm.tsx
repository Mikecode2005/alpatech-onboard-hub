import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";

const FireWatchForm = () => {
  const { saveFireWatchForm } = useAppState();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    gender: "Male" as "Male" | "Female",
    age: "",
    specialMedication: false,
    medicationDetails: "",
    healthCondition: false,
    healthConditionDetails: "",
    fireProximityInfo: "",
    weaponPossession: false,
    weaponDetails: "",
    attestationName: "",
    attestationDate: "",
    attestationSignature: undefined as string | undefined,
    companySponsors: "",
    aenlPersonnelRemark: "",
    aenlPersonnelName: "",
    aenlPersonnelSignature: undefined as string | undefined,
    aenlPersonnelDate: "",
  });

  const onSignature = (file: File | null, field: 'attestationSignature' | 'aenlPersonnelSignature') => {
    if (!file) return;
    if (file.size > 200 * 1024) {
      toast({ title: "Signature must be ≤ 200KB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, [field]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const onSubmit = () => {
    if (!form.name || !form.companyName || !form.age) {
      toast({ title: "Please fill in all required fields" });
      return;
    }

    saveFireWatchForm(form);
    toast({ title: "Fire Watch Training Form Submitted Successfully!" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Fire Watch Training Form | Alpatech</title>
        <meta name="description" content="Pre-training engagement assessment form for Fire Watch training." />
      </Helmet>
      <div className="container mx-auto py-10 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              PRE-TRAINING ENGAGEMENT ASSESSMENT FORM
              <div className="text-lg font-normal mt-2">(FIRE-WATCH TRAINING)</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Details Section */}
            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Name of your Company *</Label>
                  <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Gender (Tick as Applicable)</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as "Male" | "Female" })}>
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
                  <Label>Age, Tick as applicable *</Label>
                  <Select value={form.age} onValueChange={(v) => setForm({ ...form, age: v })}>
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

            {/* Medical Information Section */}
            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Medical Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input 
                    id="specialMed" 
                    type="checkbox" 
                    checked={form.specialMedication} 
                    onChange={(e) => setForm({ ...form, specialMedication: e.target.checked })} 
                  />
                  <Label htmlFor="specialMed">Are you on any or special medication?</Label>
                </div>
                
                {form.specialMedication && (
                  <div className="grid gap-2">
                    <Label>If yes, please specify</Label>
                    <Textarea 
                      value={form.medicationDetails} 
                      onChange={(e) => setForm({ ...form, medicationDetails: e.target.value })} 
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input 
                    id="healthCond" 
                    type="checkbox" 
                    checked={form.healthCondition} 
                    onChange={(e) => setForm({ ...form, healthCondition: e.target.checked })} 
                  />
                  <Label htmlFor="healthCond">Do you have any health condition or other reasons that you consider not appropriate for closeness to fire?</Label>
                </div>

                {form.healthCondition && (
                  <div className="grid gap-2">
                    <Label>If yes, please indicate</Label>
                    <Textarea 
                      value={form.healthConditionDetails} 
                      onChange={(e) => setForm({ ...form, healthConditionDetails: e.target.value })} 
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label>Do you have any other personal or confidential information about your health or concerns about being in close proximity to fire/smoke from burning materials?</Label>
                  <Textarea 
                    value={form.fireProximityInfo} 
                    onChange={(e) => setForm({ ...form, fireProximityInfo: e.target.value })}
                    placeholder="If yes, please indicate"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    id="weapon" 
                    type="checkbox" 
                    checked={form.weaponPossession} 
                    onChange={(e) => setForm({ ...form, weaponPossession: e.target.checked })} 
                  />
                  <Label htmlFor="weapon">Are you in possession of any weapon?</Label>
                </div>

                {form.weaponPossession && (
                  <div className="grid gap-2">
                    <Label>If yes, please indicate</Label>
                    <Textarea 
                      value={form.weaponDetails} 
                      onChange={(e) => setForm({ ...form, weaponDetails: e.target.value })} 
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Attestation Section */}
            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Attestation</h3>
              <div className="bg-accent/10 p-4 rounded border">
                <p className="text-sm">
                  I attest that the information I have provided are true, accurate, and complete about myself. I fully understand 
                  that any falsification, omission, or concealment of personal facts or information may subject me to personal 
                  risk or the represented organization that I represent to administrative, civil, or criminal liability. Furthermore, 
                  I am aware that by appending my signature below this attestation, I have read and have understood the 
                  questions and have provided correct answers to all the questions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input value={form.attestationName} onChange={(e) => setForm({ ...form, attestationName: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.attestationDate} onChange={(e) => setForm({ ...form, attestationDate: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Signature (≤ 200KB)</Label>
                  <Input type="file" accept="image/*" onChange={(e) => onSignature(e.target.files?.[0] || null, 'attestationSignature')} />
                </div>
              </div>
              
              {form.attestationSignature && (
                <img src={form.attestationSignature} alt="Attestation signature" className="h-16 border rounded" loading="lazy" />
              )}

              <div className="grid gap-2">
                <Label>Name of Company / Sponsor</Label>
                <Input value={form.companySponsors} onChange={(e) => setForm({ ...form, companySponsors: e.target.value })} />
              </div>
            </section>

            {/* AENL Personnel's Remark Section */}
            <section className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-lg">AENL Personnel's Remark</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Remark</Label>
                  <Textarea 
                    value={form.aenlPersonnelRemark} 
                    onChange={(e) => setForm({ ...form, aenlPersonnelRemark: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Name & Designation</Label>
                    <Input value={form.aenlPersonnelName} onChange={(e) => setForm({ ...form, aenlPersonnelName: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Signature (≤ 200KB)</Label>
                    <Input type="file" accept="image/*" onChange={(e) => onSignature(e.target.files?.[0] || null, 'aenlPersonnelSignature')} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Sign & Date</Label>
                    <Input type="date" value={form.aenlPersonnelDate} onChange={(e) => setForm({ ...form, aenlPersonnelDate: e.target.value })} />
                  </div>
                </div>
                
                {form.aenlPersonnelSignature && (
                  <img src={form.aenlPersonnelSignature} alt="AENL personnel signature" className="h-16 border rounded" loading="lazy" />
                )}
              </div>
            </section>
          </CardContent>
          <CardFooter>
            <Button variant="hero" onClick={onSubmit} className="w-full">Submit Fire Watch Training Form</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FireWatchForm;