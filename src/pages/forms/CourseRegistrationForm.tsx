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

const CourseRegistrationForm = () => {
  const navigate = useNavigate();
  const { saveCourseRegistration } = useAppState();
  const { toast } = useToast();
  const user = useAppState((s) => s.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    courseName: "",
    courseStartDate: "",
    courseEndDate: "",
    firstName: "",
    surname: "",
    companyName: "",
    dateOfBirth: "",
    middleName: "",
    jobTitle: "",
    courseStartTime: "",
    courseEndTime: "",
    address: "",
    phone: "",
    email: "",
  });

  const onSubmit = async () => {
    if (!form.courseName || !form.firstName || !form.surname || !form.courseStartDate || !form.courseEndDate) {
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
      saveCourseRegistration(form);
      
      // Save to Supabase
      await SupabaseServices.saveCourseRegistrationToSupabase(user.email, form);
      
      toast({ title: "Course Registration Form Submitted Successfully!" });
      navigate("/forms/medical-screening");
    } catch (error) {
      console.error("Error saving course registration form:", error);
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
        <title>Course Registration Form | Alpatech</title>
        <meta name="description" content="Complete your course registration details for Alpatech training." />
      </Helmet>
      <div className="container mx-auto py-10 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-2xl font-bold mb-2">COURSE REGISTRATION FORM</div>
              <div className="text-sm text-muted-foreground">Please complete this form in BLOCK LETTERS</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 p-4 rounded border">
              <p className="text-sm font-medium text-center">
                ALL FIELDS MARKED WITH * ARE REQUIRED
              </p>
            </div>

            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Course Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Course Name *</Label>
                  <Input 
                    value={form.courseName} 
                    onChange={(e) => setForm({ ...form, courseName: e.target.value.toUpperCase() })}
                    placeholder="ENTER COURSE NAME"
                    style={{ textTransform: 'uppercase' }}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Course Start Date *</Label>
                  <Input 
                    type="date"
                    value={form.courseStartDate} 
                    onChange={(e) => setForm({ ...form, courseStartDate: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Course End Date *</Label>
                  <Input 
                    type="date"
                    value={form.courseEndDate} 
                    onChange={(e) => setForm({ ...form, courseEndDate: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Course Start Time</Label>
                  <Input 
                    type="time"
                    value={form.courseStartTime} 
                    onChange={(e) => setForm({ ...form, courseStartTime: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Course End Time</Label>
                  <Input 
                    type="time"
                    value={form.courseEndTime} 
                    onChange={(e) => setForm({ ...form, courseEndTime: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>First Name *</Label>
                  <Input 
                    value={form.firstName} 
                    onChange={(e) => setForm({ ...form, firstName: e.target.value.toUpperCase() })}
                    placeholder="FIRST NAME"
                    style={{ textTransform: 'uppercase' }}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Middle Name</Label>
                  <Input 
                    value={form.middleName} 
                    onChange={(e) => setForm({ ...form, middleName: e.target.value.toUpperCase() })}
                    placeholder="MIDDLE NAME"
                    style={{ textTransform: 'uppercase' }}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Surname *</Label>
                  <Input 
                    value={form.surname} 
                    onChange={(e) => setForm({ ...form, surname: e.target.value.toUpperCase() })}
                    placeholder="SURNAME"
                    style={{ textTransform: 'uppercase' }}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Date of Birth</Label>
                  <Input 
                    type="date"
                    value={form.dateOfBirth} 
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Company Name</Label>
                  <Input 
                    value={form.companyName} 
                    onChange={(e) => setForm({ ...form, companyName: e.target.value.toUpperCase() })}
                    placeholder="COMPANY NAME"
                    style={{ textTransform: 'uppercase' }}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Job Title</Label>
                  <Input 
                    value={form.jobTitle} 
                    onChange={(e) => setForm({ ...form, jobTitle: e.target.value.toUpperCase() })}
                    placeholder="JOB TITLE"
                    style={{ textTransform: 'uppercase' }}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input 
                    value={form.address} 
                    onChange={(e) => setForm({ ...form, address: e.target.value.toUpperCase() })}
                    placeholder="FULL ADDRESS"
                    style={{ textTransform: 'uppercase' }}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Phone Number</Label>
                  <Input 
                    type="tel"
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+234 XXX XXX XXXX"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email Address</Label>
                  <Input 
                    type="email"
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </section>

            <div className="bg-primary/10 p-4 rounded border-l-4 border-primary">
              <p className="text-sm font-medium">
                Please ensure all information is accurate and complete. This information will be used for your training records and certification.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="hero" 
              onClick={onSubmit}
              className="w-full max-w-md text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Course Registration"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CourseRegistrationForm;