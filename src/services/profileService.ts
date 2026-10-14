
import { supabase } from "@/integrations/supabase/client";
import { profileUpdateSchema, sensoryPreferencesSchema } from "@/lib/validationSchemas";

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
  notification_style: "visual" | "audio" | "haptic" | "flash" | "both";
  color_scheme: "default" | "high-contrast" | "muted" | "bridge-it";
  notification_timing: "immediate" | "scheduled" | "batched";
  haptic_intensity: "low" | "medium" | "high";
  flash_pattern: "single" | "double" | "pulse";
  flash_color: "white" | "blue" | "pink" | "rainbow";
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
      
      // Create a properly typed profile object
      // Since the database doesn't have all the fields we need yet,
      // we add default values for the missing fields
      
      // Try to get sensory preferences from localStorage (temporary until DB is updated)
      let sensoryPrefs = defaultSensoryPreferences;
      try {
        const stored = localStorage.getItem('sensory_preferences');
        if (stored) {
          sensoryPrefs = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Error loading sensory preferences from localStorage:", e);
      }
      
      const profile: Profile = {
        id: data.id,
        username: data.username || null,
        full_name: data.full_name || null,
        avatar_url: data.avatar_url || null,
        // The following fields don't exist in the database yet, so we use defaults
        sensory_preferences: sensoryPrefs,
        onboarding_completed: (data as any).onboarding_completed || false,
        terms_accepted: (data as any).terms_accepted || false,
        terms_accepted_at: (data as any).terms_accepted_at || null,
        language: (data as any).language || "en"
      };
      
      return profile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const defaultSensoryPreferences: SensoryPreferences = {
  brightness: 100,
  contrast: 100,
  motion_sensitivity: false,
  sound_enabled: true,
  notification_style: "visual",
  color_scheme: "default",
  notification_timing: "immediate",
  haptic_intensity: "medium",
  flash_pattern: "single",
  flash_color: "white"
};

export const updateProfileInSupabase = async (updates: Partial<Profile>): Promise<boolean> => {
  try {
    // Validate profile fields if present
    const fieldsToValidate: Record<string, unknown> = {};
    if (updates.username !== undefined) fieldsToValidate.username = updates.username;
    if (updates.full_name !== undefined) fieldsToValidate.full_name = updates.full_name;
    if (Object.keys(fieldsToValidate).length > 0) {
      profileUpdateSchema.partial().parse(fieldsToValidate);
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Cast needed: schema is missing sensory/onboarding fields until migration is applied
      const { error } = await supabase
        .from('profiles')
        .update(updates as Record<string, unknown>)
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
  try {
    const validated = sensoryPreferencesSchema.parse(preferences);
    localStorage.setItem('sensory_preferences', JSON.stringify(validated));
    return true;
  } catch (error) {
    console.error("Error saving sensory preferences:", error);
    return false;
  }
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
