// Database types generated from Supabase schema
// This file provides type safety for all database operations

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
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'player' | 'admin';
          payment_preference: 'weekly' | 'monthly';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'player' | 'admin';
          payment_preference?: 'weekly' | 'monthly';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'player' | 'admin';
          payment_preference?: 'weekly' | 'monthly';
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          date: string;
          start_time: string;
          end_time: string;
          max_players: number;
          venue: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          start_time: string;
          end_time: string;
          max_players?: number;
          venue?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          max_players?: number;
          venue?: string;
          created_by?: string | null;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          status: 'confirmed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          status?: 'confirmed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          status?: 'confirmed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          session_id: string | null;
          amount: number;
          payment_type: 'weekly' | 'monthly';
          status: 'pending' | 'paid' | 'overdue';
          paid_at: string | null;
          month: number | null;
          year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id?: string | null;
          amount: number;
          payment_type: 'weekly' | 'monthly';
          status?: 'pending' | 'paid' | 'overdue';
          paid_at?: string | null;
          month?: number | null;
          year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string | null;
          amount?: number;
          payment_type?: 'weekly' | 'monthly';
          status?: 'pending' | 'paid' | 'overdue';
          paid_at?: string | null;
          month?: number | null;
          year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
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
  };
}
