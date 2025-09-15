export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bosiet_forms: {
        Row: {
          certification_date: string | null
          created_at: string
          id: string
          medical_fitness: boolean
          previous_bosiet: boolean | null
          swimming_ability: boolean
          trainee_email: string
          trainee_name: string
          updated_at: string
        }
        Insert: {
          certification_date?: string | null
          created_at?: string
          id?: string
          medical_fitness?: boolean
          previous_bosiet?: boolean | null
          swimming_ability?: boolean
          trainee_email: string
          trainee_name: string
          updated_at?: string
        }
        Update: {
          certification_date?: string | null
          created_at?: string
          id?: string
          medical_fitness?: boolean
          previous_bosiet?: boolean | null
          swimming_ability?: boolean
          trainee_email?: string
          trainee_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_registration_forms: {
        Row: {
          accommodation_needs: string | null
          course_type: string
          created_at: string
          experience_level: string | null
          id: string
          preferred_start_date: string | null
          special_requirements: string | null
          trainee_email: string
          trainee_name: string
          updated_at: string
        }
        Insert: {
          accommodation_needs?: string | null
          course_type: string
          created_at?: string
          experience_level?: string | null
          id?: string
          preferred_start_date?: string | null
          special_requirements?: string | null
          trainee_email: string
          trainee_name: string
          updated_at?: string
        }
        Update: {
          accommodation_needs?: string | null
          course_type?: string
          created_at?: string
          experience_level?: string | null
          id?: string
          preferred_start_date?: string | null
          special_requirements?: string | null
          trainee_email?: string
          trainee_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      cser_forms: {
        Row: {
          created_at: string
          id: string
          medical_certificate: boolean
          offshore_experience: string | null
          survival_training: boolean | null
          trainee_email: string
          trainee_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          medical_certificate?: boolean
          offshore_experience?: string | null
          survival_training?: boolean | null
          trainee_email: string
          trainee_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          medical_certificate?: boolean
          offshore_experience?: string | null
          survival_training?: boolean | null
          trainee_email?: string
          trainee_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipment_assignments: {
        Row: {
          assigned_by: string | null
          assigned_date: string
          assigned_to: string
          created_at: string
          equipment_id: string | null
          id: string
          notes: string | null
          quantity: number
          return_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          assigned_date: string
          assigned_to: string
          created_at?: string
          equipment_id?: string | null
          id?: string
          notes?: string | null
          quantity?: number
          return_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          assigned_date?: string
          assigned_to?: string
          created_at?: string
          equipment_id?: string | null
          id?: string
          notes?: string | null
          quantity?: number
          return_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_assignments_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_inventory: {
        Row: {
          available_quantity: number
          category: string
          created_at: string
          id: string
          location: string | null
          model: string | null
          name: string
          notes: string | null
          purchase_date: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["equipment_status"]
          total_quantity: number
          updated_at: string
          warranty_expires: string | null
        }
        Insert: {
          available_quantity?: number
          category: string
          created_at?: string
          id?: string
          location?: string | null
          model?: string | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["equipment_status"]
          total_quantity?: number
          updated_at?: string
          warranty_expires?: string | null
        }
        Update: {
          available_quantity?: number
          category?: string
          created_at?: string
          id?: string
          location?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["equipment_status"]
          total_quantity?: number
          updated_at?: string
          warranty_expires?: string | null
        }
        Relationships: []
      }
      equipment_maintenance: {
        Row: {
          cost: number | null
          created_at: string
          description: string
          equipment_id: string | null
          id: string
          maintenance_date: string
          maintenance_type: string
          next_maintenance_date: string | null
          notes: string | null
          performed_by: string
          status: string
          updated_at: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          description: string
          equipment_id?: string | null
          id?: string
          maintenance_date: string
          maintenance_type: string
          next_maintenance_date?: string | null
          notes?: string | null
          performed_by: string
          status?: string
          updated_at?: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          description?: string
          equipment_id?: string | null
          id?: string
          maintenance_date?: string
          maintenance_type?: string
          next_maintenance_date?: string | null
          notes?: string | null
          performed_by?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_maintenance_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_request_items: {
        Row: {
          created_at: string
          equipment_id: string | null
          id: string
          notes: string | null
          quantity_approved: number | null
          quantity_requested: number
          request_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          equipment_id?: string | null
          id?: string
          notes?: string | null
          quantity_approved?: number | null
          quantity_requested: number
          request_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          equipment_id?: string | null
          id?: string
          notes?: string | null
          quantity_approved?: number | null
          quantity_requested?: number
          request_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_request_items_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "equipment_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_requests: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          created_at: string
          department: string | null
          id: string
          notes: string | null
          priority: string
          purpose: string
          requested_by: string
          requested_date: string
          required_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string
          department?: string | null
          id?: string
          notes?: string | null
          priority?: string
          purpose: string
          requested_by: string
          requested_date: string
          required_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string
          department?: string | null
          id?: string
          notes?: string | null
          priority?: string
          purpose?: string
          requested_by?: string
          requested_date?: string
          required_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      fire_watch_forms: {
        Row: {
          created_at: string
          id: string
          physical_fitness: boolean
          previous_experience: boolean | null
          safety_training: boolean
          trainee_email: string
          trainee_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          physical_fitness?: boolean
          previous_experience?: boolean | null
          safety_training?: boolean
          trainee_email: string
          trainee_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          physical_fitness?: boolean
          previous_experience?: boolean | null
          safety_training?: boolean
          trainee_email?: string
          trainee_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      medical_screening_forms: {
        Row: {
          allergies: string | null
          created_at: string
          doctor_clearance: boolean | null
          fitness_declaration: boolean
          id: string
          medical_conditions: string | null
          medications: string | null
          trainee_email: string
          trainee_name: string
          updated_at: string
          vaccination_status: string | null
        }
        Insert: {
          allergies?: string | null
          created_at?: string
          doctor_clearance?: boolean | null
          fitness_declaration?: boolean
          id?: string
          medical_conditions?: string | null
          medications?: string | null
          trainee_email: string
          trainee_name: string
          updated_at?: string
          vaccination_status?: string | null
        }
        Update: {
          allergies?: string | null
          created_at?: string
          doctor_clearance?: boolean | null
          fitness_declaration?: boolean
          id?: string
          medical_conditions?: string | null
          medications?: string | null
          trainee_email?: string
          trainee_name?: string
          updated_at?: string
          vaccination_status?: string | null
        }
        Relationships: []
      }
      passcodes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          used?: boolean
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean
          used_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      requests_complaints: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          priority: string
          resolution: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["request_status"]
          submitted_by: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          submitted_by: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          submitted_by?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      size_forms: {
        Row: {
          boot_size: string | null
          coverall_size: string | null
          created_at: string
          glove_size: string | null
          helmet_size: string | null
          id: string
          trainee_email: string
          trainee_name: string
          updated_at: string
        }
        Insert: {
          boot_size?: string | null
          coverall_size?: string | null
          created_at?: string
          glove_size?: string | null
          helmet_size?: string | null
          id?: string
          trainee_email: string
          trainee_name: string
          updated_at?: string
        }
        Update: {
          boot_size?: string | null
          coverall_size?: string | null
          created_at?: string
          glove_size?: string | null
          helmet_size?: string | null
          id?: string
          trainee_email?: string
          trainee_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      trainee_verifications: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          status: string
          trainee_email: string
          updated_at: string
          verification_type: string
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          status: string
          trainee_email: string
          updated_at?: string
          verification_type: string
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          trainee_email?: string
          updated_at?: string
          verification_type?: string
          verified_by?: string | null
        }
        Relationships: []
      }
      training_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          end_date: string | null
          id: string
          start_date: string | null
          status: Database["public"]["Enums"]["training_status"]
          trainee_email: string
          training_set_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["training_status"]
          trainee_email: string
          training_set_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["training_status"]
          trainee_email?: string
          training_set_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_assignments_training_set_id_fkey"
            columns: ["training_set_id"]
            isOneToOne: false
            referencedRelation: "training_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      training_completions: {
        Row: {
          certificate_issued: boolean | null
          completion_date: string
          created_at: string
          id: string
          notes: string | null
          score: number | null
          trainee_email: string
          training_set_id: string | null
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          certificate_issued?: boolean | null
          completion_date: string
          created_at?: string
          id?: string
          notes?: string | null
          score?: number | null
          trainee_email: string
          training_set_id?: string | null
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          certificate_issued?: boolean | null
          completion_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          score?: number | null
          trainee_email?: string
          training_set_id?: string | null
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_completions_training_set_id_fkey"
            columns: ["training_set_id"]
            isOneToOne: false
            referencedRelation: "training_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      training_sets: {
        Row: {
          courses: string[]
          created_at: string
          created_by: string | null
          description: string | null
          duration_days: number | null
          id: string
          max_participants: number | null
          name: string
          updated_at: string
        }
        Insert: {
          courses: string[]
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          max_participants?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          courses?: string[]
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          max_participants?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      welcome_policy_forms: {
        Row: {
          address: string
          created_at: string
          data_consent: boolean
          date_of_birth: string
          emergency_contact_name: string
          emergency_contact_phone: string
          id: string
          phone_number: string
          policy_acknowledgment: boolean
          trainee_email: string
          trainee_name: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          data_consent?: boolean
          date_of_birth: string
          emergency_contact_name: string
          emergency_contact_phone: string
          id?: string
          phone_number: string
          policy_acknowledgment?: boolean
          trainee_email: string
          trainee_name: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          data_consent?: boolean
          date_of_birth?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          id?: string
          phone_number?: string
          policy_acknowledgment?: boolean
          trainee_email?: string
          trainee_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      you_see_u_act: {
        Row: {
          created_at: string
          description: string
          id: string
          immediate_action: string | null
          incident_type: string
          location: string
          observer_email: string
          observer_name: string
          photos: string[] | null
          severity: string
          updated_at: string
          witness_details: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          immediate_action?: string | null
          incident_type: string
          location: string
          observer_email: string
          observer_name: string
          photos?: string[] | null
          severity: string
          updated_at?: string
          witness_details?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          immediate_action?: string | null
          incident_type?: string
          location?: string
          observer_email?: string
          observer_name?: string
          photos?: string[] | null
          severity?: string
          updated_at?: string
          witness_details?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      equipment_status: "available" | "assigned" | "maintenance" | "retired"
      request_status: "open" | "in_progress" | "resolved" | "closed"
      training_status: "pending" | "in_progress" | "completed" | "cancelled"
      user_role:
        | "admin"
        | "training_coordinator"
        | "training_supervisor"
        | "safety_coordinator"
        | "nurse"
        | "chief_operations_officer"
        | "operations_manager"
        | "executive"
        | "desk_officer"
        | "trainee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      equipment_status: ["available", "assigned", "maintenance", "retired"],
      request_status: ["open", "in_progress", "resolved", "closed"],
      training_status: ["pending", "in_progress", "completed", "cancelled"],
      user_role: [
        "admin",
        "training_coordinator",
        "training_supervisor",
        "safety_coordinator",
        "nurse",
        "chief_operations_officer",
        "operations_manager",
        "executive",
        "desk_officer",
        "trainee",
      ],
    },
  },
} as const
