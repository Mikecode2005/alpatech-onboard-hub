import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const state = useAppState();

  const [step, setStep] = useState(0);

  // Welcome Policy Form Fields
  const [fullName, setFullName] = useState(state.welcomePolicy?.fullName || "");
  const [signature, setSignature] = useState<string | undefined>(state.welcomePolicy?.signatureDataUrl);
  const [date, setDate] = useState(state.welcomePolicy?.date || "");

  // Course Registration Form Fields
  const [courseName, setCourseName] = useState(state.courseRegistration?.courseName || "");
  const [startDate, setStartDate] = useState(state.courseRegistration?.courseStartDate || "");
  const [endDate, setEndDate] = useState(state.courseRegistration?.courseEndDate || "");
  const [firstName, setFirstName] = useState(state.courseRegistration?.firstName || "");
  const [surname, setSurname] = useState(state.courseRegistration?.surname || "");
  const [companyName, setCompanyName] = useState(state.courseRegistration?.companyName || "");
  const [dateOfBirth, setDateOfBirth] = useState(state.courseRegistration?.dateOfBirth || "");
  const [middleName, setMiddleName] = useState(state.courseRegistration?.middleName || "");
  const [jobTitle, setJobTitle] = useState(state.courseRegistration?.jobTitle || "");
  const [courseStartTime, setCourseStartTime] = useState(state.courseRegistration?.courseStartTime || "");
  const [courseEndTime, setCourseEndTime] = useState(state.courseRegistration?.courseEndTime || "");
  const [phone, setPhone] = useState(state.courseRegistration?.phone || "");
  const [email, setEmail] = useState(state.courseRegistration?.email || state.user?.email || "");

  // Medical Screening Form Fields
  const [medName, setMedName] = useState(state.medicalScreening?.name || "");
  const [medCompanyName, setMedCompanyName] = useState(state.medicalScreening?.nameOfCompany || "");
  const [gender, setGender] = useState<"Male" | "Female">(state.medicalScreening?.gender || "Male");
  const [age, setAge] = useState(state.medicalScreening?.age || "");
  const [hasCondition, setHasCondition] = useState(state.medicalScreening?.hasCondition || false);
  const [medication, setMedication] = useState(state.medicalScreening?.medication || "");
  const [remarks, setRemarks] = useState(state.medicalScreening?.remarks || "");
  const [healthConditionDetails, setHealthConditionDetails] = useState(state.medicalScreening?.healthConditionDetails || "");
  const [fireProximityInfo, setFireProximityInfo] = useState(state.medicalScreening?.fireProximityInfo || "");
  const [weaponPossession, setWeaponPossession] = useState(state.medicalScreening?.weaponPossession || "");
  const [attestationName, setAttestationName] = useState(state.medicalScreening?.attestationName || "");
  const [attestationDate, setAttestationDate] = useState(state.medicalScreening?.attestationDate || "");
  const [attestationSignature, setAttestationSignature] = useState(state.medicalScreening?.attestationSignature || "");
  const [companySponsors, setCompanySponsors] = useState(state.medicalScreening?.companySponsors || "");

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

  const handleAttestationSignature = async (f: File | null) => {
    if (!f) return;
    if (f.size > 200 * 1024) {
      toast({ title: "Signature must be ≤ 200KB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAttestationSignature(reader.result as string);
    reader.readAsDataURL(f);
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const saveStep = () => {
    if (step === 0) {
      if (!fullName || !date || !signature) {
        toast({ title: "Fill all Welcome Policy fields" });
        return false;
      }
      state.saveWelcomePolicy({ fullName, date, signatureDataUrl: signature });
      return true;
    }
    if (step === 1) {
      if (!courseName || !startDate || !endDate || !firstName || !surname || !email) {
        toast({ title: "All required Course Registration fields must be filled" });
        return false;
      }
      state.saveCourseRegistration({
        courseName,
        courseStartDate: startDate,
        courseEndDate: endDate,
        firstName,
        surname,
        companyName,
        dateOfBirth,
        middleName,
        jobTitle,
        courseStartTime,
        courseEndTime,
        phone,
        email,
      });
      return true;
    }
    if (step === 2) {
      if (!medName || !medCompanyName || !age) {
        toast({ title: "Name, Company Name, and Age are required" });
        return false;
      }
      state.saveMedicalScreening({ 
        name: medName,
        nameOfCompany: medCompanyName,
        gender,
        age,
        hasCondition, 
        medication, 
        remarks,
        healthConditionDetails,
        fireProximityInfo,
        weaponPossession,
        attestationName,
        attestationDate,
        attestationSignature,
        companySponsors,
      });
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
      toast({ title: "Onboarding completed successfully!" });
      navigate("/dashboard?welcome=1");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Onboarding | Alpatech</title>
        <meta name="description" content="Complete mandatory pre-training forms: Welcome Policy, Course Registration and Medical Screening." />
      </Helmet>
      <div className="container mx-auto py-10 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {step === 0 && (
                <div>
                  <div className="text-lg font-bold mb-2">Welcome Page</div>
                  <div className="text-sm text-muted-foreground bg-accent/20 p-3 rounded border-l-4 border-primary">
                    AENL NO GIFT POLICY (THIRD PARTY COMPLIANCE)
                  </div>
                </div>
              )}
              {step === 1 && "Course Registration Form"}
              {step === 2 && "Medical Screening Form"}
              {step === 3 && "Review & Submit"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <div className="space-y-6">
                <div className="bg-accent/10 p-6 rounded-lg border relative">
                  <div className="absolute top-2 right-2 text-xs text-muted-foreground opacity-50 rotate-12">
                    AENL NO GIFT POLICY (THIRD PARTY COMPLIANCE)
                  </div>
                  <h3 className="font-semibold mb-4">AENL NO GIFT POLICY (THIRD PARTY COMPLIANCE)</h3>
                  <div className="text-sm space-y-3 text-muted-foreground">
                    <p>Please be informed that AENL advocates the value of integrity and trustworthiness in all our business activities. AENL would like to announce that it strictly adheres to a <strong>NO GIFT POLICY</strong>.</p>
                    
                    <p>The No Gift Policy is adopted by AENL to prevent or appreciate conflicts of interest that may compromise the integrity and position of the company. AENL will not give or receive any form of gift to Alpatech personnel or training instructor providing the training, regardless of the purpose and/or intent behind such gift.</p>
                    
                    <p>This policy is meant to clearly state that no trainee or delegate attending training at Alpatech Training Centre is permitted to give any form of gift to Alpatech personnel or training instructor. This includes but is not limited to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Cash or monetary gifts</li>
                      <li>Physical items or products</li>
                      <li>Services or favors</li>
                      <li>Entertainment or hospitality</li>
                      <li>Any other form of consideration</li>
                    </ul>
                    
                    <p>Alpatech is committed to treat the violation of this policy with the seriousness it deserves, up to and including reporting the violations to appropriate government agencies. We appreciate your cooperation in helping us maintain the highest standards of integrity and professionalism.</p>
                    
                    <p className="font-medium">By signing below, you acknowledge that you have read, understood, and agree to comply with this NO GIFT POLICY throughout your training period and any future interactions with Alpatech personnel.</p>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Full Name *</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Date *</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Signature Upload (≤ 200KB) *</Label>
                    <Input type="file" accept="image/*" onChange={(e) => handleSignature(e.target.files?.[0] || null)} />
                    {signature && (
                      <img src={signature} alt="Signature preview" className="h-16 border rounded" loading="lazy" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="bg-accent/10 p-4 rounded border">
                  <p className="text-sm font-medium">Please complete this form in BLOCK LETTERS. All fields marked with * are required.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Course Name *</Label>
                    <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Course Start Date *</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Course End Date *</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Course Start Time</Label>
                    <Input type="time" value={courseStartTime} onChange={(e) => setCourseStartTime(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Course End Time</Label>
                    <Input type="time" value={courseEndTime} onChange={(e) => setCourseEndTime(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>First Name *</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Middle Name</Label>
                    <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Surname *</Label>
                    <Input value={surname} onChange={(e) => setSurname(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Company Name</Label>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Job Title</Label>
                    <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label>Email *</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-accent/10 p-4 rounded border">
                  <p className="text-sm font-medium">Medical Screening Form - Information will be automatically shared with the Nurse</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Name *</Label>
                    <Input value={medName} onChange={(e) => setMedName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Name of Company *</Label>
                    <Input value={medCompanyName} onChange={(e) => setMedCompanyName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Gender</Label>
                    <Select value={gender} onValueChange={(v) => setGender(v as "Male" | "Female")}>
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
                    <Input value={age} onChange={(e) => setAge(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input 
                      id="cond" 
                      type="checkbox" 
                      checked={hasCondition} 
                      onChange={(e) => setHasCondition(e.target.checked)} 
                    />
                    <Label htmlFor="cond">Are you on any special medication?</Label>
                  </div>
                  
                  {hasCondition && (
                    <div className="grid gap-2">
                      <Label>If yes, please specify</Label>
                      <Textarea value={medication} onChange={(e) => setMedication(e.target.value)} />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label>Do you have any health condition or other reasons that you consider not appropriate for closeness to fire?</Label>
                    <Textarea 
                      value={healthConditionDetails} 
                      onChange={(e) => setHealthConditionDetails(e.target.value)}
                      placeholder="If yes, please indicate"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Do you have any other personal or confidential information about your health or concerns about being in close proximity to fire/smoke from burning materials?</Label>
                    <Textarea 
                      value={fireProximityInfo} 
                      onChange={(e) => setFireProximityInfo(e.target.value)}
                      placeholder="If yes, please indicate"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Are you in possession of any weapon?</Label>
                    <Textarea 
                      value={weaponPossession} 
                      onChange={(e) => setWeaponPossession(e.target.value)}
                      placeholder="If yes, please indicate"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">Attestation</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      I attest that the information I have provided are true, accurate, and complete about myself. I fully understand that any falsification, omission, or concealment of personal facts or information may subject me to personal risk or the represented organization that I represent to administrative, civil, or criminal liability. Furthermore, I am aware that by appending my signature below this attestation, I have read and have understood the questions and have provided correct answers to all the questions.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input value={attestationName} onChange={(e) => setAttestationName(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Date</Label>
                        <Input type="date" value={attestationDate} onChange={(e) => setAttestationDate(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Signature (≤ 200KB)</Label>
                        <Input type="file" accept="image/*" onChange={(e) => handleAttestationSignature(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                    
                    {attestationSignature && (
                      <img src={attestationSignature} alt="Attestation signature" className="h-16 border rounded mt-2" loading="lazy" />
                    )}

                    <div className="grid gap-2 mt-4">
                      <Label>Name of Company / Sponsor</Label>
                      <Input value={companySponsors} onChange={(e) => setCompanySponsors(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Review Your Information</h3>
                <div className="text-sm text-muted-foreground mb-6">Please verify all information before final submission.</div>
                
                <div className="grid gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Welcome Policy</h4>
                    <p><strong>Name:</strong> {fullName}</p>
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Signature:</strong> {signature ? "✓ Uploaded" : "Not provided"}</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Course Registration</h4>
                    <p><strong>Course:</strong> {courseName}</p>
                    <p><strong>Duration:</strong> {startDate} to {endDate}</p>
                    <p><strong>Name:</strong> {firstName} {middleName} {surname}</p>
                    <p><strong>Company:</strong> {companyName || "Not specified"}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Phone:</strong> {phone || "Not provided"}</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Medical Screening</h4>
                    <p><strong>Name:</strong> {medName}</p>
                    <p><strong>Company:</strong> {medCompanyName}</p>
                    <p><strong>Gender:</strong> {gender}</p>
                    <p><strong>Age:</strong> {age}</p>
                    <p><strong>Special Medication:</strong> {hasCondition ? "Yes" : "No"}</p>
                    {hasCondition && <p><strong>Medication Details:</strong> {medication}</p>}
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
              <Button variant="hero" onClick={onSubmitAll}>Submit All Forms</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;