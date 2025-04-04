
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  sensory_preferences: SensoryPreferences | null;
  onboarding_completed: boolean;
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  language: "en" | "he";
};

export type SensoryPreferences = {
  brightness: number; // 0-100
  contrast: number; // 0-100
  motion_sensitivity: boolean;
  sound_enabled: boolean;
  notification_style: "visual" | "audio" | "both";
  color_scheme: "default" | "high-contrast" | "muted";
};

export const getProfileFromSupabase = async (): Promise<Profile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data as Profile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const updateProfileInSupabase = async (updates: Partial<Profile>): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        console.error("Error updating profile:", error);
        return false;
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
};

export const updateSensoryPreferences = async (preferences: SensoryPreferences): Promise<boolean> => {
  return updateProfileInSupabase({ sensory_preferences: preferences });
};

export const acceptTerms = async (): Promise<boolean> => {
  return updateProfileInSupabase({ 
    terms_accepted: true, 
    terms_accepted_at: new Date().toISOString() 
  });
};

export const updateLanguage = async (language: "en" | "he"): Promise<boolean> => {
  return updateProfileInSupabase({ language });
};
