import { 
  TrainingStats, 
  SafetyStats, 
  EquipmentStats,
  TrainingSet,
  TrainingAssignment,
  YouSeeUActForm,
  EquipmentItem,
  EquipmentRequest
} from '@/integrations/supabase/types';
import { format, subDays, isAfter, parseISO, differenceInDays } from 'date-fns';

/**
 * Hook for accessing analytics data
 */
export const useAnalytics = () => {
  /**
   * Get training completion statistics
   */
  const getTrainingCompletionStats = async (
    startDate?: string,
    endDate?: string,
    trainingSetId?: string
  ): Promise<TrainingStats> => {
    try {
      // In a real implementation, this would make a call to Supabase
      // For now, return mock data
      return {
        totalTrainees: 120,
        activeTrainees: 45,
        completedTrainees: 75,
        upcomingTrainingSets: 3,
        completionRate: 0.85
      };
    } catch (error) {
      console.error('Error fetching training stats:', error);
      throw error;
    }
  };

  /**
   * Get training completion data by date
   */
  const getTrainingCompletionByDate = async (
    startDate?: string,
    endDate?: string
  ): Promise<{ date: string; completed: number; active: number }[]> => {
    try {
      // Mock data for demonstration
      return [
        { date: 'Aug 1', completed: 5, active: 15 },
        { date: 'Aug 2', completed: 8, active: 12 },
        { date: 'Aug 3', completed: 12, active: 10 },
        { date: 'Aug 4', completed: 15, active: 8 },
        { date: 'Aug 5', completed: 18, active: 7 },
        { date: 'Aug 6', completed: 22, active: 5 },
        { date: 'Aug 7', completed: 25, active: 3 },
        { date: 'Aug 8', completed: 28, active: 2 },
        { date: 'Aug 9', completed: 30, active: 0 },
      ];
    } catch (error) {
      console.error('Error fetching training completion by date:', error);
      throw error;
    }
  };

  /**
   * Get training completion data by form type
   */
  const getTrainingCompletionByForm = async (): Promise<{ name: string; completed: number; pending: number }[]> => {
    try {
      // Mock data for demonstration
      return [
        { name: 'Welcome Policy', completed: 100, pending: 20 },
        { name: 'Course Registration', completed: 95, pending: 25 },
        { name: 'Medical Screening', completed: 85, pending: 35 },
        { name: 'BOSIET', completed: 70, pending: 50 },
        { name: 'Fire Watch', completed: 55, pending: 65 },
        { name: 'CSE&R', completed: 40, pending: 80 },
      ];
    } catch (error) {
      console.error('Error fetching training completion by form:', error);
      throw error;
    }
  };

  /**
   * Get medical screening statistics
   */
  const getMedicalScreeningStats = async (): Promise<{
    totalScreenings: number;
    fit: number;
    unfit: number;
    temporarilyUnfit: number;
    pendingReview: number;
  }> => {
    try {
      // Mock data for demonstration
      return {
        totalScreenings: 105,
        fit: 85,
        unfit: 5,
        temporarilyUnfit: 10,
        pendingReview: 5
      };
    } catch (error) {
      console.error('Error fetching medical screening stats:', error);
      throw error;
    }
  };

  /**
   * Get You See U Act statistics
   */
  const getYouSeeUActStats = async (
    startDate?: string,
    endDate?: string
  ): Promise<SafetyStats> => {
    try {
      // Mock data for demonstration
      return {
        totalObservations: 87,
        safeActs: 32,
        unsafeActs: 18,
        safeConditions: 25,
        unsafeConditions: 12,
        resolvedObservations: 65,
        pendingObservations: 22
      };
    } catch (error) {
      console.error('Error fetching You See U Act stats:', error);
      throw error;
    }
  };

  /**
   * Get You See U Act data by category
   */
  const getYouSeeUActByCategory = async (): Promise<{ name: string; value: number; color?: string }[]> => {
    try {
      // Mock data for demonstration
      return [
        { name: 'PPE Usage', value: 25, color: '#0088FE' },
        { name: 'Tool Handling', value: 18, color: '#00C49F' },
        { name: 'Workplace Organization', value: 15, color: '#FFBB28' },
        { name: 'Communication', value: 12, color: '#FF8042' },
        { name: 'Procedure Compliance', value: 10, color: '#8884d8' },
        { name: 'Other', value: 7, color: '#82ca9d' },
      ];
    } catch (error) {
      console.error('Error fetching You See U Act by category:', error);
      throw error;
    }
  };

  /**
   * Get You See U Act data by date
   */
  const getYouSeeUActByDate = async (
    startDate?: string,
    endDate?: string
  ): Promise<{ date: string; safe: number; unsafe: number }[]> => {
    try {
      // Mock data for demonstration
      return [
        { date: 'Aug 1', safe: 5, unsafe: 3 },
        { date: 'Aug 2', safe: 7, unsafe: 3 },
        { date: 'Aug 3', safe: 9, unsafe: 3 },
        { date: 'Aug 4', safe: 5, unsafe: 5 },
        { date: 'Aug 5', safe: 11, unsafe: 3 },
        { date: 'Aug 6', safe: 7, unsafe: 5 },
        { date: 'Aug 7', safe: 13, unsafe: 8 },
      ];
    } catch (error) {
      console.error('Error fetching You See U Act by date:', error);
      throw error;
    }
  };

  /**
   * Get equipment usage statistics
   */
  const getEquipmentStats = async (): Promise<EquipmentStats> => {
    try {
      // Mock data for demonstration
      return {
        totalEquipment: 250,
        availableEquipment: 180,
        lowStockItems: 8,
        activeRequests: 12,
        overdueReturns: 5
      };
    } catch (error) {
      console.error('Error fetching equipment stats:', error);
      throw error;
    }
  };

  /**
   * Get equipment usage by category
   */
  const getEquipmentUsageByCategory = async (): Promise<{ name: string; value: number; color?: string }[]> => {
    try {
      // Mock data for demonstration
      return [
        { name: 'PPE', value: 120, color: '#0088FE' },
        { name: 'Safety Equipment', value: 50, color: '#00C49F' },
        { name: 'Medical', value: 30, color: '#FFBB28' },
        { name: 'Training Tools', value: 40, color: '#FF8042' },
        { name: 'Other', value: 10, color: '#8884d8' },
      ];
    } catch (error) {
      console.error('Error fetching equipment usage by category:', error);
      throw error;
    }
  };

  /**
   * Get equipment requests by status
   */
  const getEquipmentRequestsByStatus = async (): Promise<{ name: string; value: number; color?: string }[]> => {
    try {
      // Mock data for demonstration
      return [
        { name: 'Pending', value: 8, color: '#FFBB28' },
        { name: 'Approved', value: 15, color: '#00C49F' },
        { name: 'Rejected', value: 3, color: '#FF8042' },
        { name: 'Returned', value: 12, color: '#0088FE' },
      ];
    } catch (error) {
      console.error('Error fetching equipment requests by status:', error);
      throw error;
    }
  };

  /**
   * Get equipment requests by date
   */
  const getEquipmentRequestsByDate = async (
    startDate?: string,
    endDate?: string
  ): Promise<{ date: string; requests: number; approvals: number; returns: number }[]> => {
    try {
      // Mock data for demonstration
      return [
        { date: 'Aug 1', requests: 3, approvals: 2, returns: 1 },
        { date: 'Aug 2', requests: 4, approvals: 3, returns: 2 },
        { date: 'Aug 3', requests: 2, approvals: 1, returns: 3 },
        { date: 'Aug 4', requests: 5, approvals: 4, returns: 2 },
        { date: 'Aug 5', requests: 3, approvals: 3, returns: 4 },
        { date: 'Aug 6', requests: 4, approvals: 2, returns: 3 },
        { date: 'Aug 7', requests: 6, approvals: 5, returns: 2 },
      ];
    } catch (error) {
      console.error('Error fetching equipment requests by date:', error);
      throw error;
    }
  };

  /**
   * Get top requested equipment items
   */
  const getTopRequestedEquipment = async (limit: number = 5): Promise<{ name: string; count: number }[]> => {
    try {
      // Mock data for demonstration
      return [
        { name: 'Safety Helmet', count: 25 },
        { name: 'Safety Boots', count: 20 },
        { name: 'Fire Extinguisher', count: 15 },
        { name: 'First Aid Kit', count: 12 },
        { name: 'Safety Gloves', count: 10 },
      ];
    } catch (error) {
      console.error('Error fetching top requested equipment:', error);
      throw error;
    }
  };

  /**
   * Get staff performance metrics
   */
  const getStaffPerformanceMetrics = async (): Promise<{
    name: string;
    role: string;
    traineesManaged: number;
    completionRate: number;
    safetyObservations: number;
  }[]> => {
    try {
      // Mock data for demonstration
      return [
        { name: 'John Doe', role: 'Training Supervisor', traineesManaged: 30, completionRate: 0.92, safetyObservations: 15 },
        { name: 'Jane Smith', role: 'Training Supervisor', traineesManaged: 25, completionRate: 0.88, safetyObservations: 12 },
        { name: 'Michael Johnson', role: 'Instructor', traineesManaged: 20, completionRate: 0.85, safetyObservations: 10 },
        { name: 'Sarah Williams', role: 'Instructor', traineesManaged: 18, completionRate: 0.90, safetyObservations: 8 },
        { name: 'Robert Brown', role: 'Instructor', traineesManaged: 15, completionRate: 0.82, safetyObservations: 7 },
      ];
    } catch (error) {
      console.error('Error fetching staff performance metrics:', error);
      throw error;
    }
  };

  /**
   * Get training completion trend data
   */
  const getTrainingCompletionTrend = (
    assignments: TrainingAssignment[],
    days: number = 30
  ): Array<{ date: string; completed: number; active: number }> => {
    const result = [];
    const today = new Date();
    
    // Generate data for each day
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Count completed assignments up to this date
      const completed = assignments.filter(assignment => 
        assignment.status === 'completed' && 
        parseISO(assignment.updatedAt) <= date
      ).length;
      
      // Count active assignments on this date
      const active = assignments.filter(assignment => 
        assignment.status === 'in_progress' && 
        parseISO(assignment.assignedAt) <= date &&
        (!assignment.updatedAt || parseISO(assignment.updatedAt) > date)
      ).length;
      
      result.push({
        date: format(date, 'MMM d'),
        completed,
        active
      });
    }
    
    return result;
  };

  /**
   * Get safety observation trend data
   */
  const getSafetyTrend = (
    observations: YouSeeUActForm[],
    days: number = 30
  ): Array<{ date: string; safe: number; unsafe: number }> => {
    const result = [];
    const today = new Date();
    
    // Generate data for each day
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Count safe observations (acts + conditions) for this date
      const safe = observations.filter(obs => 
        (obs.observationType === 'safe_act' || obs.observationType === 'safe_condition') &&
        format(parseISO(obs.submittedAt), 'yyyy-MM-dd') === dateStr
      ).length;
      
      // Count unsafe observations (acts + conditions) for this date
      const unsafe = observations.filter(obs => 
        (obs.observationType === 'unsafe_act' || obs.observationType === 'unsafe_condition') &&
        format(parseISO(obs.submittedAt), 'yyyy-MM-dd') === dateStr
      ).length;
      
      result.push({
        date: format(date, 'MMM d'),
        safe,
        unsafe
      });
    }
    
    return result;
  };

  /**
   * Get equipment availability data
   */
  const getEquipmentAvailability = (
    inventory: EquipmentItem[]
  ): Array<{ name: string; available: number; inUse: number }> => {
    return inventory.map(item => ({
      name: item.name,
      available: item.availableQuantity,
      inUse: item.totalQuantity - item.availableQuantity
    }));
  };

  /**
   * Calculate average completion time for training
   */
  const getAverageCompletionTime = (
    assignments: TrainingAssignment[]
  ): number => {
    const completedAssignments = assignments.filter(
      assignment => assignment.status === 'completed'
    );
    
    if (completedAssignments.length === 0) {
      return 0;
    }
    
    const totalDays = completedAssignments.reduce((sum, assignment) => {
      const assignedDate = parseISO(assignment.assignedAt);
      const completedDate = parseISO(assignment.updatedAt);
      return sum + differenceInDays(completedDate, assignedDate);
    }, 0);
    
    return Math.round(totalDays / completedAssignments.length);
  };

  return {
    getTrainingCompletionStats,
    getTrainingCompletionByDate,
    getTrainingCompletionByForm,
    getTrainingCompletionTrend,
    getMedicalScreeningStats,
    getYouSeeUActStats,
    getYouSeeUActByCategory,
    getYouSeeUActByDate,
    getSafetyTrend,
    getEquipmentStats,
    getEquipmentUsageByCategory,
    getEquipmentRequestsByStatus,
    getEquipmentRequestsByDate,
    getTopRequestedEquipment,
    getEquipmentAvailability,
    getStaffPerformanceMetrics,
    getAverageCompletionTime
  };
};