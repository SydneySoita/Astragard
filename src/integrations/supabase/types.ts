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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      application_reviews: {
        Row: {
          applicant_id: string
          authorship_clarity: number
          category_fit: number
          collaboration_potential: number
          created_at: string
          decision: string
          id: string
          notes: string | null
          portfolio_quality: number
          professional_readiness: number
          protection_alignment: number
          reviewer_id: string | null
          total_score: number | null
          updated_at: string
        }
        Insert: {
          applicant_id: string
          authorship_clarity?: number
          category_fit?: number
          collaboration_potential?: number
          created_at?: string
          decision?: string
          id?: string
          notes?: string | null
          portfolio_quality?: number
          professional_readiness?: number
          protection_alignment?: number
          reviewer_id?: string | null
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          authorship_clarity?: number
          category_fit?: number
          collaboration_potential?: number
          created_at?: string
          decision?: string
          id?: string
          notes?: string | null
          portfolio_quality?: number
          professional_readiness?: number
          protection_alignment?: number
          reviewer_id?: string | null
          total_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      brand_profiles: {
        Row: {
          brand_name: string
          company_name: string
          country: string | null
          created_at: string
          id: string
          industry: string | null
          logo_url: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          brand_name?: string
          company_name?: string
          country?: string | null
          created_at?: string
          id: string
          industry?: string | null
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          brand_name?: string
          company_name?: string
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      collaborations: {
        Row: {
          created_at: string
          id: string
          invitee_id: string
          inviter_id: string
          message: string | null
          project_title: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          invitee_id: string
          inviter_id: string
          message?: string | null
          project_title: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          message?: string | null
          project_title?: string
          status?: string
        }
        Relationships: []
      }
      creative_challenges: {
        Row: {
          ai_preference: string | null
          budget_range: string | null
          collaboration_style: string | null
          contact_company: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          creative_needs: string[]
          description: string
          id: string
          intent: string | null
          ownership_preference: string | null
          stage: string
          status: string
          timeline: string | null
          title: string
          updated_at: string
          use_case: string | null
          user_id: string
        }
        Insert: {
          ai_preference?: string | null
          budget_range?: string | null
          collaboration_style?: string | null
          contact_company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          creative_needs?: string[]
          description?: string
          id?: string
          intent?: string | null
          ownership_preference?: string | null
          stage?: string
          status?: string
          timeline?: string | null
          title?: string
          updated_at?: string
          use_case?: string | null
          user_id: string
        }
        Update: {
          ai_preference?: string | null
          budget_range?: string | null
          collaboration_style?: string | null
          contact_company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          creative_needs?: string[]
          description?: string
          id?: string
          intent?: string | null
          ownership_preference?: string | null
          stage?: string
          status?: string
          timeline?: string | null
          title?: string
          updated_at?: string
          use_case?: string | null
          user_id?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          created_at: string
          engagement_options: string[]
          id: string
          intent: string
          media_type: string | null
          media_url: string | null
          one_liner: string
          pricing_display: string
          pricing_style: string
          status: string
          title: string
          updated_at: string
          use_cases: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          engagement_options?: string[]
          id?: string
          intent?: string
          media_type?: string | null
          media_url?: string | null
          one_liner?: string
          pricing_display?: string
          pricing_style?: string
          status?: string
          title: string
          updated_at?: string
          use_cases?: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          engagement_options?: string[]
          id?: string
          intent?: string
          media_type?: string | null
          media_url?: string | null
          one_liner?: string
          pricing_display?: string
          pricing_style?: string
          status?: string
          title?: string
          updated_at?: string
          use_cases?: string[]
          user_id?: string
        }
        Relationships: []
      }
      match_suggestions: {
        Row: {
          ai_ownership_match: number | null
          budget_match: number | null
          challenge_id: string
          collaboration_match: number | null
          created_at: string
          creative_id: string
          field_match: number | null
          id: string
          intent_match: number | null
          portfolio_relevance: number | null
          reason: string | null
          risk_flags: string[] | null
          status: string
          timeline_match: number | null
          total_score: number | null
          updated_at: string
          use_case_match: number | null
        }
        Insert: {
          ai_ownership_match?: number | null
          budget_match?: number | null
          challenge_id: string
          collaboration_match?: number | null
          created_at?: string
          creative_id: string
          field_match?: number | null
          id?: string
          intent_match?: number | null
          portfolio_relevance?: number | null
          reason?: string | null
          risk_flags?: string[] | null
          status?: string
          timeline_match?: number | null
          total_score?: number | null
          updated_at?: string
          use_case_match?: number | null
        }
        Update: {
          ai_ownership_match?: number | null
          budget_match?: number | null
          challenge_id?: string
          collaboration_match?: number | null
          created_at?: string
          creative_id?: string
          field_match?: number | null
          id?: string
          intent_match?: number | null
          portfolio_relevance?: number | null
          reason?: string | null
          risk_flags?: string[] | null
          status?: string
          timeline_match?: number | null
          total_score?: number | null
          updated_at?: string
          use_case_match?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_suggestions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "creative_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean
          recipient_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      omnificence_articles: {
        Row: {
          author_id: string | null
          body: string | null
          challenge: string | null
          collaboration: string | null
          content_type: string
          cover_image_url: string | null
          created_at: string
          creative_direction: string | null
          curated_by: string | null
          id: string
          learning: string | null
          outcome: string | null
          published_at: string | null
          slug: string
          source_project_id: string | null
          status: string
          subtitle: string | null
          tags: string[]
          teaser: string
          tier: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          challenge?: string | null
          collaboration?: string | null
          content_type?: string
          cover_image_url?: string | null
          created_at?: string
          creative_direction?: string | null
          curated_by?: string | null
          id?: string
          learning?: string | null
          outcome?: string | null
          published_at?: string | null
          slug: string
          source_project_id?: string | null
          status?: string
          subtitle?: string | null
          tags?: string[]
          teaser?: string
          tier?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          challenge?: string | null
          collaboration?: string | null
          content_type?: string
          cover_image_url?: string | null
          created_at?: string
          creative_direction?: string | null
          curated_by?: string | null
          id?: string
          learning?: string | null
          outcome?: string | null
          published_at?: string | null
          slug?: string
          source_project_id?: string | null
          status?: string
          subtitle?: string | null
          tags?: string[]
          teaser?: string
          tier?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      omnificence_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          provider: string | null
          provider_subscription_id: string | null
          started_at: string
          status: string
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          provider?: string | null
          provider_subscription_id?: string | null
          started_at?: string
          status?: string
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          provider?: string | null
          provider_subscription_id?: string | null
          started_at?: string
          status?: string
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_revenue: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          source: string
          status: string
          user_id: string | null
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          source: string
          status?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          source?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          media_type: string | null
          media_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          application_status: string
          authorship_mode: string
          avatar_url: string | null
          bio: string | null
          category: Database["public"]["Enums"]["artist_category"] | null
          city: string | null
          country: string | null
          created_at: string
          display_name: string
          fee_paid: boolean
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_step: number
          portfolio_url: string | null
          professional_name: string | null
          social_links: Json | null
          tier: string
          updated_at: string
          verified: boolean
          website_url: string | null
          years_experience: number | null
        }
        Insert: {
          application_status?: string
          authorship_mode?: string
          avatar_url?: string | null
          bio?: string | null
          category?: Database["public"]["Enums"]["artist_category"] | null
          city?: string | null
          country?: string | null
          created_at?: string
          display_name?: string
          fee_paid?: boolean
          first_name?: string | null
          id: string
          last_name?: string | null
          onboarding_step?: number
          portfolio_url?: string | null
          professional_name?: string | null
          social_links?: Json | null
          tier?: string
          updated_at?: string
          verified?: boolean
          website_url?: string | null
          years_experience?: number | null
        }
        Update: {
          application_status?: string
          authorship_mode?: string
          avatar_url?: string | null
          bio?: string | null
          category?: Database["public"]["Enums"]["artist_category"] | null
          city?: string | null
          country?: string | null
          created_at?: string
          display_name?: string
          fee_paid?: boolean
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_step?: number
          portfolio_url?: string | null
          professional_name?: string | null
          social_links?: Json | null
          tier?: string
          updated_at?: string
          verified?: boolean
          website_url?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          outcome: string | null
          status: string
          submitted_to_incubator: boolean
          title: string
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          outcome?: string | null
          status?: string
          submitted_to_incubator?: boolean
          title: string
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          outcome?: string | null
          status?: string
          submitted_to_incubator?: boolean
          title?: string
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      protection_settings: {
        Row: {
          ai_disclosure_confirmation: boolean
          ai_usage_preference: string | null
          allow_ai_training: boolean
          authorship_confirmation: boolean
          authorship_lock: boolean
          collaboration_preference: string | null
          ownership_preference: string | null
          ownership_respect_confirmation: boolean
          updated_at: string
          user_id: string
          visibility_default: string
          watermark_enabled: boolean
        }
        Insert: {
          ai_disclosure_confirmation?: boolean
          ai_usage_preference?: string | null
          allow_ai_training?: boolean
          authorship_confirmation?: boolean
          authorship_lock?: boolean
          collaboration_preference?: string | null
          ownership_preference?: string | null
          ownership_respect_confirmation?: boolean
          updated_at?: string
          user_id: string
          visibility_default?: string
          watermark_enabled?: boolean
        }
        Update: {
          ai_disclosure_confirmation?: boolean
          ai_usage_preference?: string | null
          allow_ai_training?: boolean
          authorship_confirmation?: boolean
          authorship_lock?: boolean
          collaboration_preference?: string | null
          ownership_preference?: string | null
          ownership_respect_confirmation?: boolean
          updated_at?: string
          user_id?: string
          visibility_default?: string
          watermark_enabled?: boolean
        }
        Relationships: []
      }
      user_agreements: {
        Row: {
          accepted_at: string
          framework_accepted: boolean
          privacy_accepted: boolean
          terms_accepted: boolean
          user_id: string
        }
        Insert: {
          accepted_at?: string
          framework_accepted?: boolean
          privacy_accepted?: boolean
          terms_accepted?: boolean
          user_id: string
        }
        Update: {
          accepted_at?: string
          framework_accepted?: boolean
          privacy_accepted?: boolean
          terms_accepted?: boolean
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_omnificence_access: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      artist_category:
        | "voiceover"
        | "authors"
        | "visual"
        | "game_audio"
        | "product"
        | "musicians"
        | "fashion"
        | "paranormalogy"
        | "science"
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
      app_role: ["admin", "moderator", "user"],
      artist_category: [
        "voiceover",
        "authors",
        "visual",
        "game_audio",
        "product",
        "musicians",
        "fashion",
        "paranormalogy",
        "science",
      ],
    },
  },
} as const
