import { supabase } from './client';
import {
  User,
  UserRole,
  Passcode,
  WelcomePolicyForm,
  CourseRegistrationForm,
  MedicalScreeningForm,
  BOSIETForm,
  FireWatchForm,
  CSERForm,
  SizeForm,
  TrainingSet,
  TrainingAssignment,
  TrainingCompletion,
  TraineeVerification,
  RequestComplaint,
  YouSeeUAct,
  EquipmentInventory,
  EquipmentRequest,
  EquipmentRequestItem,
  EquipmentAssignment,
  EquipmentMaintenance
} from './types';

// User and Authentication Services
export const createUser = async (email: string, password: string, role: UserRole): Promise<{ user: User | null; error: any }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role
        }
      }
    });

    if (error) {
      throw error;
    }

    return { user: data.user as unknown as User, error: null };
  } catch (error) {
    console.error('Error creating user:', error);
    return { user: null, error };
  }
};

export const loginUser = async (email: string, password: string): Promise<{ user: User | null; error: any }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return { user: data.user as unknown as User, error: null };
  } catch (error) {
    console.error('Error logging in user:', error);
    return { user: null, error };
  }
};

export const logoutUser = async (): Promise<{ error: any }> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error logging out user:', error);
    return { error };
  }
};

export const getCurrentUser = async (): Promise<{ user: User | null; error: any }> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return { user: data.user as unknown as User, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error };
  }
};

// Passcode Services
export const createPasscode = async (email: string): Promise<{ passcode: Passcode | null; error: any }> => {
  try {
    // Generate a random 6-digit passcode
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    const { data, error } = await supabase
      .from('passcodes')
      .insert({
        email,
        code,
        expiresAt: expiresAt.toISOString(),
        used: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { passcode: data as Passcode, error: null };
  } catch (error) {
    console.error('Error creating passcode:', error);
    return { passcode: null, error };
  }
};

export const validatePasscode = async (email: string, code: string): Promise<{ valid: boolean; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('passcodes')
      .select()
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .gt('expiresAt', new Date().toISOString())
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return { valid: false, error: 'Invalid or expired passcode' };
    }

    // Mark passcode as used
    const { error: updateError } = await supabase
      .from('passcodes')
      .update({
        used: true,
        usedAt: new Date().toISOString()
      })
      .eq('id', data.id);

    if (updateError) {
      throw updateError;
    }

    return { valid: true, error: null };
  } catch (error) {
    console.error('Error validating passcode:', error);
    return { valid: false, error };
  }
};

// Form Submission Services
export const submitWelcomePolicyForm = async (form: Omit<WelcomePolicyForm, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: WelcomePolicyForm | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('welcome_policy_forms')
      .insert(form)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as WelcomePolicyForm, error: null };
  } catch (error) {
    console.error('Error submitting welcome policy form:', error);
    return { data: null, error };
  }
};

export const submitCourseRegistrationForm = async (form: Omit<CourseRegistrationForm, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: CourseRegistrationForm | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('course_registration_forms')
      .insert(form)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as CourseRegistrationForm, error: null };
  } catch (error) {
    console.error('Error submitting course registration form:', error);
    return { data: null, error };
  }
};

export const submitMedicalScreeningForm = async (form: Omit<MedicalScreeningForm, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: MedicalScreeningForm | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('medical_screening_forms')
      .insert(form)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as MedicalScreeningForm, error: null };
  } catch (error) {
    console.error('Error submitting medical screening form:', error);
    return { data: null, error };
  }
};

export const submitBOSIETForm = async (form: Omit<BOSIETForm, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: BOSIETForm | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('bosiet_forms')
      .insert(form)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as BOSIETForm, error: null };
  } catch (error) {
    console.error('Error submitting BOSIET form:', error);
    return { data: null, error };
  }
};

export const submitFireWatchForm = async (form: Omit<FireWatchForm, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: FireWatchForm | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('fire_watch_forms')
      .insert(form)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as FireWatchForm, error: null };
  } catch (error) {
    console.error('Error submitting Fire Watch form:', error);
    return { data: null, error };
  }
};

export const submitCSERForm = async (form: Omit<CSERForm, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: CSERForm | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('cser_forms')
      .insert(form)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as CSERForm, error: null };
  } catch (error) {
    console.error('Error submitting CSE&R form:', error);
    return { data: null, error };
  }
};

export const submitSizeForm = async (form: Omit<SizeForm, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: SizeForm | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('size_forms')
      .insert(form)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as SizeForm, error: null };
  } catch (error) {
    console.error('Error submitting size form:', error);
    return { data: null, error };
  }
};

// Training Management Services
export const createTrainingSet = async (trainingSet: Omit<TrainingSet, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: TrainingSet | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('training_sets')
      .insert(trainingSet)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as TrainingSet, error: null };
  } catch (error) {
    console.error('Error creating training set:', error);
    return { data: null, error };
  }
};

export const assignTraineeToSet = async (assignment: Omit<TrainingAssignment, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: TrainingAssignment | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('training_assignments')
      .insert(assignment)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as TrainingAssignment, error: null };
  } catch (error) {
    console.error('Error assigning trainee to set:', error);
    return { data: null, error };
  }
};

export const recordTrainingCompletion = async (completion: Omit<TrainingCompletion, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: TrainingCompletion | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('training_completions')
      .insert(completion)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as TrainingCompletion, error: null };
  } catch (error) {
    console.error('Error recording training completion:', error);
    return { data: null, error };
  }
};

// Verification Services
export const verifyTrainee = async (verification: Omit<TraineeVerification, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: TraineeVerification | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('trainee_verifications')
      .insert(verification)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as TraineeVerification, error: null };
  } catch (error) {
    console.error('Error verifying trainee:', error);
    return { data: null, error };
  }
};

// Request and Complaint Services
export const submitRequestComplaint = async (requestComplaint: Omit<RequestComplaint, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: RequestComplaint | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('requests_complaints')
      .insert(requestComplaint)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as RequestComplaint, error: null };
  } catch (error) {
    console.error('Error submitting request/complaint:', error);
    return { data: null, error };
  }
};

// You See U Act Services
export const submitYouSeeUAct = async (youSeeUAct: Omit<YouSeeUAct, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: YouSeeUAct | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('you_see_u_act')
      .insert(youSeeUAct)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as YouSeeUAct, error: null };
  } catch (error) {
    console.error('Error submitting You See U Act:', error);
    return { data: null, error };
  }
};

// Equipment Inventory Services
export const createEquipmentItem = async (equipment: Omit<EquipmentInventory, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: EquipmentInventory | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('equipment_inventory')
      .insert(equipment)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as EquipmentInventory, error: null };
  } catch (error) {
    console.error('Error creating equipment item:', error);
    return { data: null, error };
  }
};

export const updateEquipmentItem = async (id: string, updates: Partial<EquipmentInventory>): Promise<{ data: EquipmentInventory | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('equipment_inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as EquipmentInventory, error: null };
  } catch (error) {
    console.error('Error updating equipment item:', error);
    return { data: null, error };
  }
};

export const getEquipmentInventory = async (): Promise<{ data: EquipmentInventory[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('equipment_inventory')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return { data: data as EquipmentInventory[], error: null };
  } catch (error) {
    console.error('Error getting equipment inventory:', error);
    return { data: null, error };
  }
};

export const getEquipmentItem = async (id: string): Promise<{ data: EquipmentInventory | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('equipment_inventory')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { data: data as EquipmentInventory, error: null };
  } catch (error) {
    console.error('Error getting equipment item:', error);
    return { data: null, error };
  }
};

export const getLowStockEquipment = async (): Promise<{ data: EquipmentInventory[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('equipment_inventory')
      .select('*')
      .lt('available_quantity', 10)
      .order('available_quantity');

    if (error) {
      throw error;
    }

    return { data: data as EquipmentInventory[], error: null };
  } catch (error) {
    console.error('Error getting low stock equipment:', error);
    return { data: null, error };
  }
};

// Equipment Request Services
export const createEquipmentRequest = async (request: Omit<EquipmentRequest, 'id' | 'created_at' | 'updated_at'>, items: Omit<EquipmentRequestItem, 'id' | 'request_id' | 'created_at' | 'updated_at'>[]): Promise<{ data: EquipmentRequest | null; error: any }> => {
  try {
    // Start a transaction
    const { data: requestData, error: requestError } = await supabase
      .from('equipment_requests')
      .insert(request)
      .select()
      .single();

    if (requestError) {
      throw requestError;
    }

    // Add items to the request
    const requestItems = items.map(item => ({
      ...item,
      request_id: requestData.id
    }));

    const { error: itemsError } = await supabase
      .from('equipment_request_items')
      .insert(requestItems);

    if (itemsError) {
      throw itemsError;
    }

    // Get the complete request with items
    const { data: completeRequest, error: getError } = await supabase
      .from('equipment_requests')
      .select(`
        *,
        items:equipment_request_items(*)
      `)
      .eq('id', requestData.id)
      .single();

    if (getError) {
      throw getError;
    }

    return { data: completeRequest as EquipmentRequest, error: null };
  } catch (error) {
    console.error('Error creating equipment request:', error);
    return { data: null, error };
  }
};

export const getEquipmentRequests = async (status?: string): Promise<{ data: EquipmentRequest[] | null; error: any }> => {
  try {
    let query = supabase
      .from('equipment_requests')
      .select(`
        *,
        items:equipment_request_items(*)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return { data: data as EquipmentRequest[], error: null };
  } catch (error) {
    console.error('Error getting equipment requests:', error);
    return { data: null, error };
  }
};

export const getEquipmentRequest = async (id: string): Promise<{ data: EquipmentRequest | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('equipment_requests')
      .select(`
        *,
        items:equipment_request_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { data: data as EquipmentRequest, error: null };
  } catch (error) {
    console.error('Error getting equipment request:', error);
    return { data: null, error };
  }
};

export const updateEquipmentRequestStatus = async (id: string, status: string, notes?: string): Promise<{ data: EquipmentRequest | null; error: any }> => {
  try {
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'approved' || status === 'partially_approved') {
      updates.approved_by = (await supabase.auth.getUser()).data.user?.id;
      updates.approved_date = new Date().toISOString();
    }

    if (notes) {
      updates.notes = notes;
    }

    const { data, error } = await supabase
      .from('equipment_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as EquipmentRequest, error: null };
  } catch (error) {
    console.error('Error updating equipment request status:', error);
    return { data: null, error };
  }
};

export const updateEquipmentRequestItemStatus = async (id: string, status: string, quantity_approved?: number, notes?: string): Promise<{ data: EquipmentRequestItem | null; error: any }> => {
  try {
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (quantity_approved !== undefined) {
      updates.quantity_approved = quantity_approved;
    }

    if (notes) {
      updates.notes = notes;
    }

    const { data, error } = await supabase
      .from('equipment_request_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as EquipmentRequestItem, error: null };
  } catch (error) {
    console.error('Error updating equipment request item status:', error);
    return { data: null, error };
  }
};

// Equipment Assignment Services
export const createEquipmentAssignment = async (assignment: Omit<EquipmentAssignment, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: EquipmentAssignment | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('equipment_assignments')
      .insert(assignment)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as EquipmentAssignment, error: null };
  } catch (error) {
    console.error('Error creating equipment assignment:', error);
    return { data: null, error };
  }
};

export const getEquipmentAssignments = async (userId?: string): Promise<{ data: EquipmentAssignment[] | null; error: any }> => {
  try {
    let query = supabase
      .from('equipment_assignments')
      .select('*')
      .order('assigned_date', { ascending: false });

    if (userId) {
      query = query.eq('assigned_to', userId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return { data: data as EquipmentAssignment[], error: null };
  } catch (error) {
    console.error('Error getting equipment assignments:', error);
    return { data: null, error };
  }
};

export const updateEquipmentAssignment = async (id: string, updates: Partial<EquipmentAssignment>): Promise<{ data: EquipmentAssignment | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('equipment_assignments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as EquipmentAssignment, error: null };
  } catch (error) {
    console.error('Error updating equipment assignment:', error);
    return { data: null, error };
  }
};

// Equipment Maintenance Services
export const createMaintenanceRecord = async (maintenance: Omit<EquipmentMaintenance, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: EquipmentMaintenance | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('equipment_maintenance')
      .insert(maintenance)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as EquipmentMaintenance, error: null };
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    return { data: null, error };
  }
};

export const getMaintenanceRecords = async (equipmentId?: string): Promise<{ data: EquipmentMaintenance[] | null; error: any }> => {
  try {
    let query = supabase
      .from('equipment_maintenance')
      .select('*')
      .order('maintenance_date', { ascending: false });

    if (equipmentId) {
      query = query.eq('equipment_id', equipmentId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return { data: data as EquipmentMaintenance[], error: null };
  } catch (error) {
    console.error('Error getting maintenance records:', error);
    return { data: null, error };
  }
};

// Hook for using Supabase services
export const useSupabaseServices = () => {
  return {
    // User and Authentication
    createUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    
    // Passcode
    createPasscode,
    validatePasscode,
    
    // Form Submission
    submitWelcomePolicyForm,
    submitCourseRegistrationForm,
    submitMedicalScreeningForm,
    submitBOSIETForm,
    submitFireWatchForm,
    submitCSERForm,
    submitSizeForm,
    
    // Training Management
    createTrainingSet,
    assignTraineeToSet,
    recordTrainingCompletion,
    
    // Verification
    verifyTrainee,
    
    // Request and Complaint
    submitRequestComplaint,
    
    // You See U Act
    submitYouSeeUAct,
    
    // Equipment Inventory
    createEquipmentItem,
    updateEquipmentItem,
    getEquipmentInventory,
    getEquipmentItem,
    getLowStockEquipment,
    
    // Equipment Requests
    createEquipmentRequest,
    getEquipmentRequests,
    getEquipmentRequest,
    updateEquipmentRequestStatus,
    updateEquipmentRequestItemStatus,
    
    // Equipment Assignments
    createEquipmentAssignment,
    getEquipmentAssignments,
    updateEquipmentAssignment,
    
    // Equipment Maintenance
    createMaintenanceRecord,
    getMaintenanceRecords
  };
};