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
  | "Other Staff";

export interface User {
  email: string;
  role: Role;
  name?: string;
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
  address?: string;
  phone?: string;
  email?: string;
}

export interface MedicalScreeningForm {
  hasCondition?: boolean;
  medication?: string;
  remarks?: string;
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

export interface AppState {
  user?: User;
  assignedTrainings: string[]; // e.g., BOSIET, FIRE WATCH, CSE&R
  welcomePolicy?: WelcomePolicyForm;
  courseRegistration?: CourseRegistrationForm;
  medicalScreening?: MedicalScreeningForm;
  useeUactSubmissions: USeeUActForm[];
  setUser: (user?: User) => void;
  setAssignedTrainings: (mods: string[]) => void;
  saveWelcomePolicy: (d: WelcomePolicyForm) => void;
  saveCourseRegistration: (d: CourseRegistrationForm) => void;
  saveMedicalScreening: (d: MedicalScreeningForm) => void;
  submitUSeeUAct: (d: USeeUActForm) => void;
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
  submitUSeeUAct: (d) => {
    const list = [...(get().useeUactSubmissions || []), d];
    const next = { ...get(), useeUactSubmissions: list } as Partial<AppState>;
    persist(next);
    set({ useeUactSubmissions: list });
  },
  reset: () => {
    persist({});
    set({
      user: undefined,
      assignedTrainings: [],
      welcomePolicy: undefined,
      courseRegistration: undefined,
      medicalScreening: undefined,
      useeUactSubmissions: [],
    });
  },
}));
