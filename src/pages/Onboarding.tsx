import { create } from "zustand";

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
  reset: () => void;
}

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
  
  setUser: (user) => {
    const next = { ...get(), user } as Partial<AppState>;
    persist(next);
    set({ user });
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
  },
  
  saveCourseRegistration: (d) => {
    const next = { ...get(), courseRegistration: d } as Partial<AppState>;
    persist(next);
    set({ courseRegistration: d });
  },
  
  saveMedicalScreening: (d) => {
    const next = { ...get(), medicalScreening: d } as Partial<AppState>;
    persist(next);
    set({ medicalScreening: d });
  },
  
  saveBOSIETForm: (d) => {
    const next = { ...get(), bosietForm: d } as Partial<AppState>;
    persist(next);
    set({ bosietForm: d });
  },
  
  saveFireWatchForm: (d) => {
    const next = { ...get(), fireWatchForm: d } as Partial<AppState>;
    persist(next);
    set({ fireWatchForm: d });
  },
  
  saveCSERForm: (d) => {
    const next = { ...get(), cserForm: d } as Partial<AppState>;
    persist(next);
    set({ cserForm: d });
  },
  
  submitUSeeUAct: (d) => {
    const list = [...(get().useeUactSubmissions || []), d];
    const next = { ...get(), useeUactSubmissions: list } as Partial<AppState>;
    persist(next);
    set({ useeUactSubmissions: list });
  },
  
  submitSizeForm: (d) => {
    const list = [...(get().sizeSubmissions || []), d];
    const next = { ...get(), sizeSubmissions: list } as Partial<AppState>;
    persist(next);
    set({ sizeSubmissions: list });
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
    });
  },
}));