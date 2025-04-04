
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { SensoryPreferences } from "@/services/profileService";

interface VisualSettingsProps {
  preferences: SensoryPreferences;
  onPreferenceChange: (newPreferences: Partial<SensoryPreferences>) => void;
}

export const VisualSettings = ({ preferences, onPreferenceChange }: VisualSettingsProps) => {
  return (
    <div className="space-y-6">
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
          onValueChange={(values) => onPreferenceChange({ brightness: values[0] })}
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
          onValueChange={(values) => onPreferenceChange({ contrast: values[0] })}
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="motion">Reduce Motion</Label>
        <Switch
          id="motion"
          checked={preferences.motion_sensitivity}
          onCheckedChange={(checked) => onPreferenceChange({ motion_sensitivity: checked })}
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="sound">Enable Sounds</Label>
        <Switch
          id="sound"
          checked={preferences.sound_enabled}
          onCheckedChange={(checked) => onPreferenceChange({ sound_enabled: checked })}
        />
      </div>
    </div>
  );
};
