
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SensoryPreferences } from "@/services/profileService";

interface FeedbackSettingsProps {
  preferences: SensoryPreferences;
  onPreferenceChange: (newPreferences: Partial<SensoryPreferences>) => void;
  previewHaptic: () => void;
  previewFlash: () => void;
}

export const FeedbackSettings = ({ 
  preferences, 
  onPreferenceChange, 
  previewHaptic, 
  previewFlash 
}: FeedbackSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Haptic Intensity</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={previewHaptic}
            className="text-xs"
          >
            Test
          </Button>
        </div>
        <RadioGroup 
          value={preferences.haptic_intensity}
          onValueChange={(value) => onPreferenceChange({ haptic_intensity: value as SensoryPreferences["haptic_intensity"] })}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low_intensity" />
            <Label htmlFor="low_intensity">Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium_intensity" />
            <Label htmlFor="medium_intensity">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high_intensity" />
            <Label htmlFor="high_intensity">High</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Flash Pattern</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={previewFlash}
            className="text-xs"
          >
            Preview
          </Button>
        </div>
        <RadioGroup 
          value={preferences.flash_pattern}
          onValueChange={(value) => onPreferenceChange({ flash_pattern: value as SensoryPreferences["flash_pattern"] })}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="single_flash" />
            <Label htmlFor="single_flash">Single</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="double" id="double_flash" />
            <Label htmlFor="double_flash">Double</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pulse" id="pulse_flash" />
            <Label htmlFor="pulse_flash">Pulse</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Flash Color</Label>
        <RadioGroup 
          value={preferences.flash_color}
          onValueChange={(value) => onPreferenceChange({ flash_color: value as SensoryPreferences["flash_color"] })}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="white" id="white_flash" />
            <Label htmlFor="white_flash" className="flex items-center gap-2">
              <div className="h-4 w-4 bg-white border rounded-full"></div> White
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="blue" id="blue_flash" />
            <Label htmlFor="blue_flash" className="flex items-center gap-2">
              <div className="h-4 w-4 bg-blue-600 rounded-full"></div> Blue
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="pink" id="pink_flash" />
            <Label htmlFor="pink_flash" className="flex items-center gap-2">
              <div className="h-4 w-4 bg-pink-500 rounded-full"></div> Pink
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="rainbow" id="rainbow_flash" />
            <Label htmlFor="rainbow_flash" className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-300 rounded-full"></div> Rainbow
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
