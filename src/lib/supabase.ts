import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Surfaced as a friendly banner rather than a crash, so the app still renders
// for anyone who cloned the repo before creating their Supabase project.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl ?? "http://localhost",
  supabaseAnonKey ?? "public-anon-key",
);

export const PHOTO_BUCKET = "pet-photos";
export const VIDEO_BUCKET = "pet-videos";

export interface PetReport {
  id: string;
  type: "lost" | "found";
  pet_owner_id: string | null;
  pet_name: string | null;
  pet_type: string | null;
  breed: string | null;
  color: string | null;
  location: string | null;
  description: string | null;
  contact_info: string | null;
  status: string | null;
  status_note: string | null;
  photo_url: string | null;
  video_url: string | null;
  is_reunited: boolean;
  created_at: string;
}

export interface HappyTail {
  id: string;
  pet_owner_id: string | null;
  pet_name: string | null;
  pet_type: string | null;
  breed: string | null;
  color: string | null;
  photo_url: string | null;
  story: string | null;
  source_report_id: string | null;
  created_at: string;
}
