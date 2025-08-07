import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const state = useAppState();

  const [step, setStep] = useState(0);

  // Local fields
  const [fullName, setFullName] = useState(state.welcomePolicy?.fullName || "");
  const [signature, setSignature] = useState<string | undefined>(state.welcomePolicy?.signatureDataUrl);
  const [date, setDate] = useState(state.welcomePolicy?.date || "");

  const [courseName, setCourseName] = useState(state.courseRegistration?.courseName || "");
  const [startDate, setStartDate] = useState(state.courseRegistration?.courseStartDate || "");
  const [endDate, setEndDate] = useState(state.courseRegistration?.courseEndDate || "");
  const [firstName, setFirstName] = useState(state.courseRegistration?.firstName || "");
  const [surname, setSurname] = useState(state.courseRegistration?.surname || "");
  const [phone, setPhone] = useState(state.courseRegistration?.phone || "");
  const [email, setEmail] = useState(state.courseRegistration?.email || state.user?.email || "");

  const [hasCondition, setHasCondition] = useState(state.medicalScreening?.hasCondition || false);
  const [medication, setMedication] = useState(state.medicalScreening?.medication || "");
  const [remarks, setRemarks] = useState(state.medicalScreening?.remarks || "");

  const handleSignature = async (f: File | null) => {
    if (!f) return;
    if (f.size > 200 * 1024) {
      toast({ title: "Signature must be ≤ 200KB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSignature(reader.result as string);
    reader.readAsDataURL(f);
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const saveStep = () => {
    if (step === 0) {
      if (!fullName || !date || !signature) {
        toast({ title: "Fill all Welcome fields" });
        return false;
      }
      state.saveWelcomePolicy({ fullName, date, signatureDataUrl: signature });
      return true;
    }
    if (step === 1) {
      if (!courseName || !startDate || !endDate || !firstName || !surname || !email) {
        toast({ title: "All Course Registration fields are required" });
        return false;
      }
      state.saveCourseRegistration({
        courseName,
        courseStartDate: startDate,
        courseEndDate: endDate,
        firstName,
        surname,
        phone,
        email,
      });
      return true;
    }
    if (step === 2) {
      state.saveMedicalScreening({ hasCondition, medication, remarks });
      return true;
    }
    return true;
  };

  const onNext = () => {
    if (saveStep()) {
      next();
    }
  };

  const onSubmitAll = () => {
    if (saveStep()) {
      toast({ title: "Onboarding submitted" });
      navigate("/dashboard?welcome=1");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Onboarding | Alpatech</title>
        <meta name="description" content="Fill mandatory pre-training forms: No Gift Policy, Course Registration and Medical Screening." />
      </Helmet>
      <div className="container mx-auto py-10 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 0 && "Welcome Page – AENL NO GIFT POLICY (THIRD PARTY COMPLIANCE)"}
              {step === 1 && "Course Registration Form"}
              {step === 2 && "Medical Screening Form"}
              {step === 3 && "Review & Submit"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Signature Upload (≤ 200KB)</Label>
                  <Input type="file" accept="image/*" onChange={(e) => handleSignature(e.target.files?.[0] || null)} />
                  {signature && (
                    <img src={signature} alt="Signature preview" className="h-16" loading="lazy" />
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Course Name</Label>
                  <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Course Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Course End Date</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>First Name</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Surname</Label>
                  <Input value={surname} onChange={(e) => setSurname(e.target.value)} />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input id="cond" type="checkbox" checked={hasCondition} onChange={(e) => setHasCondition(e.target.checked)} />
                  <Label htmlFor="cond">I have a health condition to declare</Label>
                </div>
                <div className="grid gap-2">
                  <Label>Medication</Label>
                  <Input value={medication} onChange={(e) => setMedication(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Remarks (auto-shared with Nurse)</Label>
                  <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Preview</h3>
                <div className="text-sm text-muted-foreground">Verify your data before submission.</div>
                <div className="grid gap-4 mt-4">
                  <div>
                    <h4 className="font-medium">Welcome Policy</h4>
                    <p>Name: {fullName}</p>
                    <p>Date: {date}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Course Registration</h4>
                    <p>Course: {courseName}</p>
                    <p>Start: {startDate} · End: {endDate}</p>
                    <p>First Name: {firstName} · Surname: {surname}</p>
                    <p>Email: {email} · Phone: {phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Medical Screening</h4>
                    <p>Condition: {hasCondition ? "Yes" : "No"}</p>
                    <p>Medication: {medication || "None"}</p>
                    <p>Remarks: {remarks || "-"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 0 && step < 4 ? (
              <Button variant="secondary" onClick={back}>Back</Button>
            ) : <span />}
            {step < 3 ? (
              <Button variant="hero" onClick={onNext}>Save & Continue</Button>
            ) : (
              <Button variant="hero" onClick={onSubmitAll}>Submit</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
