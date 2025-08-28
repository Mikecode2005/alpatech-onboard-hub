import { create } from "zustand";
import * as SupabaseServices from "@/integrations/supabase/services";

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
    
    // Save user to Supabase
    if (user) {
      SupabaseServices.saveUserToSupabase(user)
        .catch(err => console.error("Failed to save user to Supabase:", err));
    }
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
    
    // Save to Supabase
    const user = get().user;
    if (user) {
      SupabaseServices.saveWelcomePolicyToSupabase(user.email, d)
        .catch(err => console.error("Failed to save welcome policy to Supabase:", err));
    }
  },
  
  saveCourseRegistration: (d) => {
    const next = { ...get(), courseRegistration: d } as Partial<AppState>;
    persist(next);
    set({ courseRegistration: d });
    
    // Save to Supabase
    const user = get().user;
    if (user) {
      SupabaseServices.saveCourseRegistrationToSupabase(user.email, d)
        .catch(err => console.error("Failed to save course registration to Supabase:", err));
    }
  },
  
  saveMedicalScreening: (d) => {
    const next = { ...get(), medicalScreening: d } as Partial<AppState>;
    persist(next);
    set({ medicalScreening: d });
    
    // Save to Supabase
    const user = get().user;
    if (user) {
      SupabaseServices.saveMedicalScreeningToSupabase(user.email, d)
        .catch(err => console.error("Failed to save medical screening to Supabase:", err));
    }
  },
  
  saveBOSIETForm: (d) => {
    const next = { ...get(), bosietForm: d } as Partial<AppState>;
    persist(next);
    set({ bosietForm: d });
    
    // Save to Supabase
    const user = get().user;
    if (user) {
      SupabaseServices.saveBOSIETFormToSupabase(user.email, d)
        .catch(err => console.error("Failed to save BOSIET form to Supabase:", err));
    }
  },
  
  saveFireWatchForm: (d) => {
    const next = { ...get(), fireWatchForm: d } as Partial<AppState>;
    persist(next);
    set({ fireWatchForm: d });
    
    // Save to Supabase
    const user = get().user;
    if (user) {
      SupabaseServices.saveFireWatchFormToSupabase(user.email, d)
        .catch(err => console.error("Failed to save Fire Watch form to Supabase:", err));
    }
  },
  
  saveCSERForm: (d) => {
    const next = { ...get(), cserForm: d } as Partial<AppState>;
    persist(next);
    set({ cserForm: d });
    
    // Save to Supabase
    const user = get().user;
    if (user) {
      SupabaseServices.saveCSERFormToSupabase(user.email, d)
        .catch(err => console.error("Failed to save CSE&R form to Supabase:", err));
    }
  },
  
  submitUSeeUAct: (d) => {
    const list = [...(get().useeUactSubmissions || []), d];
    const next = { ...get(), useeUactSubmissions: list } as Partial<AppState>;
    persist(next);
    set({ useeUactSubmissions: list });
    
    // Save to Supabase
    const user = get().user;
    if (user) {
      SupabaseServices.saveUSeeUActFormToSupabase(user.email, d)
        .catch(err => console.error("Failed to save U-See U-Act form to Supabase:", err));
    }
  },
  
  submitSizeForm: (d) => {
    const list = [...(get().sizeSubmissions || []), d];
    const next = { ...get(), sizeSubmissions: list } as Partial<AppState>;
    persist(next);
    set({ sizeSubmissions: list });
    
    // Save to Supabase
    const user = get().user;
    if (user) {
      SupabaseServices.saveSizeFormToSupabase(user.email, d)
        .catch(err => console.error("Failed to save Size form to Supabase:", err));
    }
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
    
    // Save to Supabase
    SupabaseServices.saveRequestComplaintToSupabase(newItem)
      .catch(err => console.error("Failed to save request/complaint to Supabase:", err));
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
    
    // Update in Supabase
    const resolvedAt = status === 'Resolved' ? new Date().toISOString() : undefined;
    SupabaseServices.updateRequestComplaintStatusInSupabase(id, status, resolvedAt)
      .catch(err => console.error("Failed to update request/complaint status in Supabase:", err));
  },
  
  assignTrainingModules: (traineeEmail, modules) => {
    // This would typically be stored per trainee, but for simplicity we'll use a global assignment
    const next = { ...get(), assignedTrainings: modules } as Partial<AppState>;
    persist(next);
    set({ assignedTrainings: modules });
    
    // Save to Supabase
    SupabaseServices.saveTrainingAssignmentsToSupabase(traineeEmail, modules)
      .catch(err => console.error("Failed to save training assignments to Supabase:", err));
  },
  
  getTraineeAssignments: (traineeEmail) => {
    // In a real app, this would fetch assignments specific to the trainee
    // For now, we'll return the global assignments
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
    
    // Save to Supabase
    SupabaseServices.savePasscodeToSupabase(entry)
      .catch(err => console.error("Failed to save passcode to Supabase:", err));
  },
  
  syncWithSupabase: async () => {
    try {
      // Fetch passcodes from Supabase
      const passcodes = await SupabaseServices.getPasscodesFromSupabase();
      set({ passcodes });
      
      // If user is logged in, fetch their training assignments
      const user = get().user;
      if (user) {
        const assignments = await SupabaseServices.getTrainingAssignmentsFromSupabase(user.email);
        set({ assignedTrainings: assignments });
      }
      
      // Update local storage
      const next = { ...get(), passcodes } as Partial<AppState>;
      persist(next);
    } catch (error) {
      console.error("Failed to sync with Supabase:", error);
    }
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