export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          job_description: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          created_at: string;
          processing_started_at: string | null;
          completed_at: string | null;
          last_accessed_at: string | null;
        };
        Insert: {
          id?: string;
          job_description: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          created_at?: string;
          processing_started_at?: string | null;
          completed_at?: string | null;
          last_accessed_at?: string | null;
        };
        Update: {
          id?: string;
          job_description?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          created_at?: string;
          processing_started_at?: string | null;
          completed_at?: string | null;
          last_accessed_at?: string | null;
        };
        Relationships: [];
      };
      resumes: {
        Row: {
          id: string;
          session_id: string;
          original_filename: string;
          s3_key: string;
          status: 'pending' | 'processing' | 'processed' | 'failed';
          score: number | null;
          reasoning: string | null;
          processing_started_at: string | null;
          processed_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          original_filename: string;
          s3_key: string;
          status?: 'pending' | 'processing' | 'processed' | 'failed';
          score?: number | null;
          reasoning?: string | null;
          processing_started_at?: string | null;
          processed_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          original_filename?: string;
          s3_key?: string;
          status?: 'pending' | 'processing' | 'processed' | 'failed';
          score?: number | null;
          reasoning?: string | null;
          processing_started_at?: string | null;
          processed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_session';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
