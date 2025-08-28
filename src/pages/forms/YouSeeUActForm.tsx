import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";
import FormContainer from "@/components/FormContainer";
import FormSection from "@/components/FormSection";
import TextareaField from "@/components/TextareaField";
import FormField from "@/components/FormField";
import FileUploadField from "@/components/FileUploadField";
import { isRequired } from "@/lib/validation";
import * as SupabaseServices from "@/integrations/supabase/services";

interface YouSeeUActFormData {
  safeActs: string;
  unsafeActs: string;
  safeConditions: string;
  unsafeConditions: string;
  commendation: string;
  correctiveAction: string;
  sustainAction: string;
  preventReoccur: string;
  personnelRemark: {
    name: string;
    signatureDataUrl?: string;
    date: string;
  };
}

const YouSeeUActForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAppState((s) => s.user);
  const submitUSeeUAct = useAppState((s) => s.submitUSeeUAct);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState<YouSeeUActFormData>({
    safeActs: "",
    unsafeActs: "",
    safeConditions: "",
    unsafeConditions: "",
    commendation: "",
    correctiveAction: "",
    sustainAction: "",
    preventReoccur: "",
    personnelRemark: {
      name: user?.name || "",
      signatureDataUrl: undefined,
      date: new Date().toISOString().split("T")[0],
    },
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (field: keyof YouSeeUActFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  
  const handlePersonnelRemarkChange = (field: keyof typeof form.personnelRemark, value: string) => {
    setForm(prev => ({
      ...prev,
      personnelRemark: {
        ...prev.personnelRemark,
        [field]: value,
      },
    }));
    
    // Clear error when field is edited
    if (errors[`personnelRemark.${field}`]) {
      setErrors(prev => ({ ...prev, [`personnelRemark.${field}`]: "" }));
    }
  };
  
  const handleSignatureChange = (file: File | null, dataUrl?: string | null) => {
    setForm(prev => ({
      ...prev,
      personnelRemark: {
        ...prev.personnelRemark,
        signatureDataUrl: dataUrl || undefined,
      },
    }));
    
    // Clear error when field is edited
    if (errors["personnelRemark.signatureDataUrl"]) {
      setErrors(prev => ({ ...prev, "personnelRemark.signatureDataUrl": "" }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Require at least one observation
    if (!form.safeActs && !form.unsafeActs && !form.safeConditions && !form.unsafeConditions) {
      newErrors.observations = "At least one observation is required";
    }
    
    // Require at least one action
    if (!form.correctiveAction && !form.sustainAction && !form.preventReoccur) {
      newErrors.actions = "At least one action is required";
    }
    
    // Validate personnel remark fields
    if (!isRequired(form.personnelRemark.name)) {
      newErrors["personnelRemark.name"] = "Name is required";
    }
    
    if (!form.personnelRemark.signatureDataUrl) {
      newErrors["personnelRemark.signatureDataUrl"] = "Signature is required";
    }
    
    if (!isRequired(form.personnelRemark.date)) {
      newErrors["personnelRemark.date"] = "Date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    if (!user?.email) {
      toast({ 
        title: "Authentication Error", 
        description: "Please log in again to submit this form",
        variant: "destructive"
      });
      navigate("/staff-login");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to local state
      submitUSeeUAct(form);
      
      // Save to Supabase
      if (user?.email) {
        await SupabaseServices.saveUSeeUActFormToSupabase(user.email, form);
      }
      
      toast({
        title: "Form Submitted Successfully",
        description: "Your You See U Act form has been submitted",
      });
      
      // Navigate based on user role
      if (user?.role === "Trainee") {
        navigate("/dashboard");
      } else {
        navigate("/usee-uact-data");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting the form. Your data has been saved locally.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Helmet>
        <title>You See U Act Form | Alpatech Training Portal</title>
        <meta name="description" content="Submit observations and actions for safety and quality improvement" />
      </Helmet>
      
      <FormContainer
        title="YOU SEE U ACT FORM"
        description="Report observations and actions for safety and quality improvement"
        onSubmit={handleSubmit}
        submitText="Submit Form"
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      >
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
          <p className="text-sm text-blue-700">
            <strong>What is You See U Act?</strong> This is a proactive approach to identify and address safety concerns, 
            recognize good practices, and promote continuous improvement. Your observations and suggestions are valuable 
            for maintaining a safe and efficient working environment.
          </p>
        </div>
        
        <FormSection title="Observations" description="Record what you observed">
          {errors.observations && (
            <div className="text-red-500 text-sm mb-4">
              {errors.observations}
            </div>
          )}
          
          <TextareaField
            label="Safe Acts"
            name="safeActs"
            placeholder="Describe any safe behaviors or practices you observed"
            value={form.safeActs}
            onChange={(e) => handleChange("safeActs", e.target.value)}
            rows={3}
          />
          
          <TextareaField
            label="Unsafe Acts"
            name="unsafeActs"
            placeholder="Describe any unsafe behaviors or practices you observed"
            value={form.unsafeActs}
            onChange={(e) => handleChange("unsafeActs", e.target.value)}
            rows={3}
          />
          
          <TextareaField
            label="Safe Conditions"
            name="safeConditions"
            placeholder="Describe any safe conditions or environments you observed"
            value={form.safeConditions}
            onChange={(e) => handleChange("safeConditions", e.target.value)}
            rows={3}
          />
          
          <TextareaField
            label="Unsafe Conditions"
            name="unsafeConditions"
            placeholder="Describe any unsafe conditions or environments you observed"
            value={form.unsafeConditions}
            onChange={(e) => handleChange("unsafeConditions", e.target.value)}
            rows={3}
          />
        </FormSection>
        
        <FormSection title="Recognition & Actions" description="Provide feedback and suggestions">
          <TextareaField
            label="Commendation"
            name="commendation"
            placeholder="Recognize individuals or teams for positive behaviors or actions"
            value={form.commendation}
            onChange={(e) => handleChange("commendation", e.target.value)}
            rows={3}
          />
          
          {errors.actions && (
            <div className="text-red-500 text-sm mb-4">
              {errors.actions}
            </div>
          )}
          
          <TextareaField
            label="Corrective Action"
            name="correctiveAction"
            placeholder="What actions should be taken to address unsafe acts or conditions?"
            value={form.correctiveAction}
            onChange={(e) => handleChange("correctiveAction", e.target.value)}
            rows={3}
          />
          
          <TextareaField
            label="Sustain Action"
            name="sustainAction"
            placeholder="What actions should be taken to maintain and promote safe acts or conditions?"
            value={form.sustainAction}
            onChange={(e) => handleChange("sustainAction", e.target.value)}
            rows={3}
          />
          
          <TextareaField
            label="Prevent Reoccurrence"
            name="preventReoccur"
            placeholder="What can be done to prevent unsafe acts or conditions from happening again?"
            value={form.preventReoccur}
            onChange={(e) => handleChange("preventReoccur", e.target.value)}
            rows={3}
          />
        </FormSection>
        
        <FormSection title="Personnel Remark" description="Your information">
          <FormField
            label="Name"
            name="personnelName"
            placeholder="Your full name"
            value={form.personnelRemark.name}
            onChange={(e) => handlePersonnelRemarkChange("name", e.target.value)}
            required
            error={errors["personnelRemark.name"]}
          />
          
          <FormField
            label="Date"
            name="personnelDate"
            type="date"
            value={form.personnelRemark.date}
            onChange={(e) => handlePersonnelRemarkChange("date", e.target.value)}
            required
            error={errors["personnelRemark.date"]}
          />
          
          <FileUploadField
            label="Signature"
            name="personnelSignature"
            accept="image/*"
            maxSizeInKB={200}
            dataUrl={form.personnelRemark.signatureDataUrl}
            onChange={handleSignatureChange}
            required
            error={errors["personnelRemark.signatureDataUrl"]}
            showPreview={true}
          />
        </FormSection>
      </FormContainer>
    </div>
  );
};

export default YouSeeUActForm;