
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { SensoryPreferences, updateSensoryPreferences } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";

interface SensorySettingsProps {
  initialPreferences?: SensoryPreferences;
  onPreferencesChange?: (preferences: SensoryPreferences) => void;
}

const defaultPreferences: SensoryPreferences = {
  brightness: 100,
  contrast: 100,
  motion_sensitivity: false,
  sound_enabled: true,
  notification_style: "visual",
  color_scheme: "default"
};

export const SensorySettings = ({ 
  initialPreferences, 
  onPreferencesChange 
}: SensorySettingsProps) => {
  const [preferences, setPreferences] = useState<SensoryPreferences>(
    initialPreferences || defaultPreferences
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Sensory Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="brightness">Brightness</Label>
            <span>{preferences.brightness}%</span>
          </div>
          <Slider 
            id="brightness"
            min={50} 
            max={150} 
            step={5}
            value={[preferences.brightness]}
            onValueChange={(values) => handleChange({ brightness: values[0] })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="contrast">Contrast</Label>
            <span>{preferences.contrast}%</span>
          </div>
          <Slider 
            id="contrast"
            min={50} 
            max={150} 
            step={5}
            value={[preferences.contrast]}
            onValueChange={(values) => handleChange({ contrast: values[0] })}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="motion">Reduce Motion</Label>
          <Switch
            id="motion"
            checked={preferences.motion_sensitivity}
            onCheckedChange={(checked) => handleChange({ motion_sensitivity: checked })}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="sound">Enable Sounds</Label>
          <Switch
            id="sound"
            checked={preferences.sound_enabled}
            onCheckedChange={(checked) => handleChange({ sound_enabled: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label>Notification Style</Label>
          <RadioGroup 
            value={preferences.notification_style}
            onValueChange={(value) => handleChange({ notification_style: value as "visual" | "audio" | "both" })}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="visual" id="visual" />
              <Label htmlFor="visual">Visual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="audio" id="audio" />
              <Label htmlFor="audio">Audio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both">Both</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <RadioGroup 
            value={preferences.color_scheme}
            onValueChange={(value) => handleChange({ color_scheme: value as "default" | "high-contrast" | "muted" })}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high-contrast" id="high-contrast" />
              <Label htmlFor="high-contrast">High Contrast</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="muted" id="muted" />
              <Label htmlFor="muted">Muted Colors</Label>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={handleSave} className="w-full">Save Settings</Button>
      </CardContent>
    </Card>
  );
};
