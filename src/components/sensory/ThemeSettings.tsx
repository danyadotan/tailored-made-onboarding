
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SensoryPreferences } from "@/services/profileService";

interface ThemeSettingsProps {
  preferences: SensoryPreferences;
  onPreferenceChange: (newPreferences: Partial<SensoryPreferences>) => void;
}

export const ThemeSettings = ({ preferences, onPreferenceChange }: ThemeSettingsProps) => {
  return (
    <div className="space-y-3">
      <Label>Color Scheme</Label>
      <RadioGroup 
        value={preferences.color_scheme}
        onValueChange={(value) => onPreferenceChange({ color_scheme: value as SensoryPreferences["color_scheme"] })}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        <div className="flex flex-col border rounded-md overflow-hidden">
          <div className="h-12 bg-background"></div>
          <div className="p-3 flex items-center space-x-2">
            <RadioGroupItem value="default" id="default_scheme" />
            <Label htmlFor="default_scheme">Default</Label>
          </div>
        </div>
        
        <div className="flex flex-col border rounded-md overflow-hidden">
          <div className="h-12 bg-black"></div>
          <div className="p-3 flex items-center space-x-2">
            <RadioGroupItem value="high-contrast" id="high-contrast_scheme" />
            <Label htmlFor="high-contrast_scheme">High Contrast</Label>
          </div>
        </div>
        
        <div className="flex flex-col border rounded-md overflow-hidden">
          <div className="h-12 bg-gray-100"></div>
          <div className="p-3 flex items-center space-x-2">
            <RadioGroupItem value="muted" id="muted_scheme" />
            <Label htmlFor="muted_scheme">Muted Colors</Label>
          </div>
        </div>
        
        <div className="flex flex-col border rounded-md overflow-hidden">
          <div className="h-12 bg-[#0035ff]"></div>
          <div className="p-3 flex items-center space-x-2">
            <RadioGroupItem value="bridge-it" id="bridge-it_scheme" />
            <Label htmlFor="bridge-it_scheme">Bridge-IT Theme</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};
