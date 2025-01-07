export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_tracking: {
        Row: {
          activity_type: string
          created_at: string
          duration_minutes: number | null
          id: string
          room_id: string | null
          sleep_hours: number | null
          steps_count: number | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          room_id?: string | null
          sleep_hours?: number | null
          steps_count?: number | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          room_id?: string | null
          sleep_hours?: number | null
          steps_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_tracking_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      member_onboarding: {
        Row: {
          created_at: string
          display_name: string
          id: string
          interests: string[] | null
          preferred_tribes: string[] | null
          status: Database["public"]["Enums"]["onboarding_status"]
          updated_at: string
          user_id: string
          wellness_goals: string[] | null
        }
        Insert: {
          created_at?: string
          display_name?: string
          id?: string
          interests?: string[] | null
          preferred_tribes?: string[] | null
          status?: Database["public"]["Enums"]["onboarding_status"]
          updated_at?: string
          user_id: string
          wellness_goals?: string[] | null
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          interests?: string[] | null
          preferred_tribes?: string[] | null
          status?: Database["public"]["Enums"]["onboarding_status"]
          updated_at?: string
          user_id?: string
          wellness_goals?: string[] | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          room_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          room_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          room_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_members: {
        Row: {
          id: string
          joined_at: string
          room_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          room_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          room_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      sentiment_tracking: {
        Row: {
          confidence_score: number
          created_at: string
          id: string
          message_id: string
          sentiment: Database["public"]["Enums"]["sentiment_type"]
          user_id: string
        }
        Insert: {
          confidence_score: number
          created_at?: string
          id?: string
          message_id: string
          sentiment: Database["public"]["Enums"]["sentiment_type"]
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          id?: string
          message_id?: string
          sentiment?: Database["public"]["Enums"]["sentiment_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sentiment_tracking_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      onboarding_status: "not_started" | "in_progress" | "completed"
      sentiment_type: "positive" | "neutral" | "negative"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
