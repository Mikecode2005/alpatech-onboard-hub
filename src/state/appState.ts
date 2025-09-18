import { create } from "zustand";
// import * as SupabaseServices from "@/integrations/supabase/services";

export type Role =
  | "Trainee"
  | "Training Supervisor"
  | "Training Coordinator"
  | "Instructor / Team Lead"
  | "Utility Office"
  | "Nurse"
  | "Safety Coordinator"
  | "Operations Manager"
  | "Chief Operations Officer"
  | "Other Staff"
  | "Super Admin";

export interface User {
  email: string;
  role: Role;
  name?: string;
  passcode?: string; // For trainees
}

export interface WelcomePolicyForm {
  fullName: string;
  signatureDataUrl?: string;
  date: string;
}

export interface CourseRegistrationForm {
  courseName: string;
  courseStartDate: string;
  courseEndDate: string;
  firstName: string;
  surname: string;
  companyName?: string;
  dateOfBirth?: string;
  middleName?: string;
  jobTitle?: string;
  courseStartTime?: string;
  courseEndTime?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface MedicalScreeningForm {
  name?: string;
  nameOfCompany?: string;
  gender?: "Male" | "Female";
  age?: string;
  hasCondition?: boolean;
  medication?: string;
  remarks?: string;
  healthConditionDetails?: string;
  fireProximityInfo?: string;
  weaponPossession?: string;
  attestationName?: string;
  attestationDate?: string;
  attestationSignature?: string;
  companySponsors?: string;
}

export interface BOSIETForm {
  name?: string;
  companyName?: string;
  gender?: "Male" | "Female";
  age?: string;
  specialMedication?: boolean;
  medicationDetails?: string;
  healthCondition?: boolean;
  healthConditionDetails?: string;
  fireProximityInfo?: string;
  weaponPossession?: boolean;
  weaponDetails?: string;
  attestationName?: string;
  attestationDate?: string;
  attestationSignature?: string;
  companySponsors?: string;
  aenlPersonnelRemark?: string;
  aenlPersonnelName?: string;
  aenlPersonnelSignature?: string;
  aenlPersonnelDate?: string;
}

export interface FireWatchForm {
  name?: string;
  companyName?: string;
  gender?: "Male" | "Female";
  age?: string;
  specialMedication?: boolean;
  medicationDetails?: string;
  healthCondition?: boolean;
  healthConditionDetails?: string;
  fireProximityInfo?: string;
  weaponPossession?: boolean;
  weaponDetails?: string;
  attestationName?: string;
  attestationDate?: string;
  attestationSignature?: string;
  companySponsors?: string;
  aenlPersonnelRemark?: string;
  aenlPersonnelName?: string;
  aenlPersonnelSignature?: string;
  aenlPersonnelDate?: string;
}

export interface CSERForm {
  name?: string;
  companyName?: string;
  gender?: "Male" | "Female";
  age?: string;
  specialMedication?: boolean;
  medicationDetails?: string;
  healthCondition?: boolean;
  healthConditionDetails?: string;
  fireProximityInfo?: string;
  weaponPossession?: boolean;
  weaponDetails?: string;
  attestationName?: string;
  attestationDate?: string;
  attestationSignature?: string;
  companySponsors?: string;
  aenlPersonnelRemark?: string;
  aenlPersonnelName?: string;
  aenlPersonnelSignature?: string;
  aenlPersonnelDate?: string;
}

export interface USeeUActForm {
  safeActs?: string;
  unsafeActs?: string;
  safeConditions?: string;
  unsafeConditions?: string;
  commendation?: string;
  correctiveAction?: string;
  sustainAction?: string;
  preventReoccur?: string;
  personnelRemark?: { name: string; signatureDataUrl?: string; date?: string };
}

export interface SizeForm {
  traineeId?: string;
  coverallSize?: string;
  shoeSize?: string;
  submittedBy?: string;
  submittedDate?: string;
}

export interface RequestComplaint {
  id: string;
  type: "Request" | "Complaint";
  title: string;
  description: string;
  from: string;
  to: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
  resolvedAt?: string;
}

export interface PasscodeEntry {
  id: string;
  code: string;
  traineeEmail: string;
  isUsed: boolean;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

export interface AppState {
  user?: User;
  assignedTrainings: string[]; // BOSIET, FIRE WATCH, CSE&R
  welcomePolicy?: WelcomePolicyForm;
  courseRegistration?: CourseRegistrationForm;
  medicalScreening?: MedicalScreeningForm;
  bosietForm?: BOSIETForm;
  fireWatchForm?: FireWatchForm;
  cserForm?: CSERForm;
  useeUactSubmissions: USeeUActForm[];
  sizeSubmissions: SizeForm[];
  requestsComplaints: RequestComplaint[];
  passcodes: PasscodeEntry[];
  
  // Actions
  setUser: (user?: User) => void;
  setAssignedTrainings: (mods: string[]) => void;
  saveWelcomePolicy: (d: WelcomePolicyForm) => void;
  saveCourseRegistration: (d: CourseRegistrationForm) => void;
  saveMedicalScreening: (d: MedicalScreeningForm) => void;
  saveBOSIETForm: (d: BOSIETForm) => void;
  saveFireWatchForm: (d: FireWatchForm) => void;
  saveCSERForm: (d: CSERForm) => void;
  submitUSeeUAct: (d: USeeUActForm) => void;
  submitSizeForm: (d: SizeForm) => void;
  submitRequestComplaint: (d: Omit<RequestComplaint, 'id' | 'createdAt'>) => void;
  updateRequestComplaintStatus: (id: string, status: RequestComplaint['status']) => void;
  assignTrainingModules: (traineeEmail: string, modules: string[]) => void;
  getTraineeAssignments: (traineeEmail: string) => string[];
  addPasscode: (traineeEmail: string, code: string, expiresAt: string) => void;
  syncWithSupabase: () => Promise<void>;
  reset: () => void;
}

const storageKey = "alpatech-app-state";

const load = (): Partial<AppState> => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Partial<AppState>) : {};
  } catch {
    return {};
  }
};

const persist = (state: Partial<AppState>) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {}
};

export const useAppState = create<AppState>((set, get) => ({
  ...load(),
  assignedTrainings: load().assignedTrainings || [],
  useeUactSubmissions: load().useeUactSubmissions || [],
  sizeSubmissions: load().sizeSubmissions || [],
  requestsComplaints: load().requestsComplaints || [],
  passcodes: (load() as any).passcodes || [],
  
  setUser: (user) => {
    const next = { ...get(), user } as Partial<AppState>;
    persist(next);
    set({ user });
    
    // For super admin and staff logins, we don't need to save to Supabase profiles 
    // since these are handled differently
    console.log("User set:", user);
  },
  
  setAssignedTrainings: (mods) => {
    const next = { ...get(), assignedTrainings: mods } as Partial<AppState>;
    persist(next);
    set({ assignedTrainings: mods });
  },
  
  saveWelcomePolicy: (d) => {
    const next = { ...get(), welcomePolicy: d } as Partial<AppState>;
    persist(next);
    set({ welcomePolicy: d });
    
    // TODO: Save to Supabase when properly implemented
    console.log("Welcome policy saved:", d);
  },
  
  
  saveCourseRegistration: (d) => {
    const next = { ...get(), courseRegistration: d } as Partial<AppState>;
    persist(next);
    set({ courseRegistration: d });
    console.log("Course registration saved:", d);
  },
  
  saveMedicalScreening: (d) => {
    const next = { ...get(), medicalScreening: d } as Partial<AppState>;
    persist(next);
    set({ medicalScreening: d });
    console.log("Medical screening saved:", d);
  },
  
  saveBOSIETForm: (d) => {
    const next = { ...get(), bosietForm: d } as Partial<AppState>;
    persist(next);
    set({ bosietForm: d });
    console.log("BOSIET form saved:", d);
  },
  
  saveFireWatchForm: (d) => {
    const next = { ...get(), fireWatchForm: d } as Partial<AppState>;
    persist(next);
    set({ fireWatchForm: d });
    console.log("Fire Watch form saved:", d);
  },
  
  saveCSERForm: (d) => {
    const next = { ...get(), cserForm: d } as Partial<AppState>;
    persist(next);
    set({ cserForm: d });
    console.log("CSE&R form saved:", d);
  },
  
  submitUSeeUAct: (d) => {
    const list = [...(get().useeUactSubmissions || []), d];
    const next = { ...get(), useeUactSubmissions: list } as Partial<AppState>;
    persist(next);
    set({ useeUactSubmissions: list });
    console.log("U-See U-Act form submitted:", d);
  },
  
  submitSizeForm: (d) => {
    const list = [...(get().sizeSubmissions || []), d];
    const next = { ...get(), sizeSubmissions: list } as Partial<AppState>;
    persist(next);
    set({ sizeSubmissions: list });
    console.log("Size form submitted:", d);
  },
  
  submitRequestComplaint: (d) => {
    const newItem: RequestComplaint = {
      ...d,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const list = [...(get().requestsComplaints || []), newItem];
    const next = { ...get(), requestsComplaints: list } as Partial<AppState>;
    persist(next);
    set({ requestsComplaints: list });
    console.log("Request/complaint submitted:", newItem);
  },
  
  updateRequestComplaintStatus: (id, status) => {
    const list = get().requestsComplaints.map(item => 
      item.id === id 
        ? { ...item, status, resolvedAt: status === 'Resolved' ? new Date().toISOString() : item.resolvedAt }
        : item
    );
    const next = { ...get(), requestsComplaints: list } as Partial<AppState>;
    persist(next);
    set({ requestsComplaints: list });
    console.log("Request/complaint status updated:", id, status);
  },
  
  assignTrainingModules: (traineeEmail, modules) => {
    const next = { ...get(), assignedTrainings: modules } as Partial<AppState>;
    persist(next);
    set({ assignedTrainings: modules });
    console.log("Training modules assigned:", traineeEmail, modules);
  },
  
  getTraineeAssignments: (traineeEmail) => {
    return get().assignedTrainings || [];
  },
  
  addPasscode: (traineeEmail, code, expiresAt) => {
    const entry: PasscodeEntry = {
      id: Date.now().toString(),
      code,
      traineeEmail,
      isUsed: false,
      createdAt: new Date().toISOString(),
      expiresAt,
    };
    const list = [...(get().passcodes || []), entry];
    const next = { ...get(), passcodes: list } as Partial<AppState>;
    persist(next);
    set({ passcodes: list });
    console.log("Passcode added:", entry);
  },
  
  syncWithSupabase: async () => {
    console.log("Sync with Supabase - not implemented yet");
  },
  
  reset: () => {
    persist({});
    set({
      user: undefined,
      assignedTrainings: [],
      welcomePolicy: undefined,
      courseRegistration: undefined,
      medicalScreening: undefined,
      bosietForm: undefined,
      fireWatchForm: undefined,
      cserForm: undefined,
      useeUactSubmissions: [],
      sizeSubmissions: [],
      requestsComplaints: [],
      passcodes: [],
    });
  },
}));