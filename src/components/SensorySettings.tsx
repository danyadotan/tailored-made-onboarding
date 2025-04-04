
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Eye, 
  Bell, 
  Vibrate,
  Palette,
} from "lucide-react";
import { SensoryPreferences, updateSensoryPreferences, defaultSensoryPreferences } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisualSettings } from "@/components/sensory/VisualSettings";
import { NotificationSettings } from "@/components/sensory/NotificationSettings";
import { FeedbackSettings } from "@/components/sensory/FeedbackSettings";
import { ThemeSettings } from "@/components/sensory/ThemeSettings";

interface SensorySettingsProps {
  initialPreferences?: SensoryPreferences;
  onPreferencesChange?: (preferences: SensoryPreferences) => void;
}

export const SensorySettings = ({ 
  initialPreferences, 
  onPreferencesChange 
}: SensorySettingsProps) => {
  const [preferences, setPreferences] = useState<SensoryPreferences>(
    initialPreferences || defaultSensoryPreferences
  );
  const { toast } = useToast();

  useEffect(() => {
    // Apply brightness and contrast settings to the app
    document.documentElement.style.filter = `brightness(${preferences.brightness}%) contrast(${preferences.contrast}%)`;
    
    // Apply color scheme if needed
    document.documentElement.setAttribute('data-color-scheme', preferences.color_scheme);

    // Apply motion reduction if needed
    if (preferences.motion_sensitivity) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    // Apply Bridge-IT theme if selected
    if (preferences.color_scheme === "bridge-it") {
      document.documentElement.classList.add('bridge-it-theme');
    } else {
      document.documentElement.classList.remove('bridge-it-theme');
    }

    return () => {
      // Reset filters when component unmounts
      document.documentElement.style.filter = '';
    };
  }, [preferences]);

  const handleChange = (newPreferences: Partial<SensoryPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    if (onPreferencesChange) {
      onPreferencesChange(updatedPreferences);
    }
  };

  const handleSave = async () => {
    const success = await updateSensoryPreferences(preferences);
    if (success) {
      toast({
        title: "Settings saved",
        description: "Your sensory preferences have been updated.",
      });
    } else {
      toast({
        title: "Error saving settings",
        description: "There was a problem updating your preferences.",
        variant: "destructive",
      });
    }
  };

  const previewFlash = () => {
    const flashElement = document.createElement('div');
    flashElement.className = `flash-overlay flash-${preferences.flash_pattern} flash-${preferences.flash_color}`;
    document.body.appendChild(flashElement);
    
    setTimeout(() => {
      document.body.removeChild(flashElement);
    }, 1500);
  };

  const previewHaptic = () => {
    if ("vibrate" in navigator) {
      switch(preferences.haptic_intensity) {
        case "low":
          navigator.vibrate(100);
          break;
        case "medium":
          navigator.vibrate([100, 50, 100]);
          break;
        case "high":
          navigator.vibrate([100, 50, 100, 50, 100]);
          break;
      }
    } else {
      toast({
        title: "Haptic feedback not supported",
        description: "Your device does not support haptic feedback."
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Sensory Settings
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Customize how Bridge-IT interacts with your senses
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Visual</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <Vibrate className="h-4 w-4" />
              <span className="hidden sm:inline">Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual">
            <VisualSettings 
              preferences={preferences} 
              onPreferenceChange={handleChange}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings 
              preferences={preferences} 
              onPreferenceChange={handleChange}
            />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackSettings 
              preferences={preferences} 
              onPreferenceChange={handleChange}
              previewHaptic={previewHaptic}
              previewFlash={previewFlash}
            />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeSettings 
              preferences={preferences} 
              onPreferenceChange={handleChange}
            />
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} className="w-full bg-pink-500 hover:bg-pink-600 text-white mt-6">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};
