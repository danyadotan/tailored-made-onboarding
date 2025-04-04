
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Eye, Bell, Zap, Clock, Sparkles, Vibrate } from "lucide-react";
import { SensoryPreferences } from "@/services/profileService";

interface NotificationSettingsProps {
  preferences: SensoryPreferences;
  onPreferenceChange: (newPreferences: Partial<SensoryPreferences>) => void;
}

export const NotificationSettings = ({ preferences, onPreferenceChange }: NotificationSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Notification Style</Label>
        <RadioGroup 
          value={preferences.notification_style}
          onValueChange={(value) => onPreferenceChange({ notification_style: value as SensoryPreferences["notification_style"] })}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="visual" id="visual" />
            <Label htmlFor="visual" className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> Visual
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="audio" id="audio" />
            <Label htmlFor="audio" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Audio
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="haptic" id="haptic" />
            <Label htmlFor="haptic" className="flex items-center gap-2">
              <Vibrate className="h-4 w-4" /> Haptic
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="flash" id="flash" />
            <Label htmlFor="flash" className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Flash
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Combined
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Notification Timing</Label>
        <RadioGroup 
          value={preferences.notification_timing}
          onValueChange={(value) => onPreferenceChange({ notification_timing: value as SensoryPreferences["notification_timing"] })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="immediate" id="immediate" />
            <Label htmlFor="immediate" className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Immediate (as they happen)
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="scheduled" id="scheduled" />
            <Label htmlFor="scheduled" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Scheduled (at specific times)
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="batched" id="batched" />
            <Label htmlFor="batched" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Batched (grouped periodically)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
