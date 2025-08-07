import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";

const YouSeeUActForm = () => {
  const { submitUSeeUAct } = useAppState();
  const { toast } = useToast();

  const [form, setForm] = useState({
    safeActs: "",
    unsafeActs: "",
    safeConditions: "",
    unsafeConditions: "",
    commendation: "",
    correctiveAction: "",
    sustainAction: "",
    preventReoccur: "",
    personnelName: "",
    personnelDate: "",
    signatureDataUrl: undefined as string | undefined,
  });

  const onSignature = (file: File | null) => {
    if (!file) return;
    if (file.size > 200 * 1024) {
      toast({ title: "Signature must be ≤ 200KB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, signatureDataUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const onSubmit = () => {
    submitUSeeUAct({
      safeActs: form.safeActs,
      unsafeActs: form.unsafeActs,
      safeConditions: form.safeConditions,
      unsafeConditions: form.unsafeConditions,
      commendation: form.commendation,
      correctiveAction: form.correctiveAction,
      sustainAction: form.sustainAction,
      preventReoccur: form.preventReoccur,
      personnelRemark: { name: form.personnelName, date: form.personnelDate, signatureDataUrl: form.signatureDataUrl },
    });
    toast({ title: "Submitted" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>You See You Act Form | Alpatech</title>
        <meta name="description" content="Report safety observations and actions using the U-See U-Act form." />
      </Helmet>
      <div className="container mx-auto py-10 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>U-SEE U-ACT Observer's Reporting Form</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label>A. SAFE ACTS OBSERVED</Label>
                <Textarea value={form.safeActs} onChange={(e) => setForm({ ...form, safeActs: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>1. COMMENDATION</Label>
                <Textarea value={form.commendation} onChange={(e) => setForm({ ...form, commendation: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>B. UNSAFE ACTS OBSERVED</Label>
                <Textarea value={form.unsafeActs} onChange={(e) => setForm({ ...form, unsafeActs: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>2. IMMEDIATE CORRECTIVE ACTION TAKEN</Label>
                <Textarea value={form.correctiveAction} onChange={(e) => setForm({ ...form, correctiveAction: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>A. SAFE CONDITIONS OBSERVED</Label>
                <Textarea value={form.safeConditions} onChange={(e) => setForm({ ...form, safeConditions: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>1. ACTION TAKEN TO SUSTAIN THE CONDITION</Label>
                <Textarea value={form.sustainAction} onChange={(e) => setForm({ ...form, sustainAction: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>B. UNSAFE CONDITIONS OBSERVED</Label>
                <Textarea value={form.unsafeConditions} onChange={(e) => setForm({ ...form, unsafeConditions: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>FURTHER ACTION TO PREVENT RE-OCCURRENCE</Label>
                <Textarea value={form.preventReoccur} onChange={(e) => setForm({ ...form, preventReoccur: e.target.value })} />
              </div>
            </section>

            <section className="grid gap-3">
              <h3 className="font-medium">AENL Personnel’s Remark</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input value={form.personnelName} onChange={(e) => setForm({ ...form, personnelName: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Signature (≤ 200KB)</Label>
                  <Input type="file" accept="image/*" onChange={(e) => onSignature(e.target.files?.[0] || null)} />
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.personnelDate} onChange={(e) => setForm({ ...form, personnelDate: e.target.value })} />
                </div>
              </div>
            </section>
          </CardContent>
          <CardFooter>
            <Button variant="hero" onClick={onSubmit}>Submit</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default YouSeeUActForm;
