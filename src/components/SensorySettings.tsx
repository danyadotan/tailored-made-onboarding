
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Eye, 
  Bell, 
  Zap, 
  Clock, 
  Sparkles,
  Vibrate,
  Palette,
  Lightbulb
} from "lucide-react";
import { SensoryPreferences, updateSensoryPreferences, defaultSensoryPreferences } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

          <TabsContent value="visual" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-3">
              <Label>Notification Style</Label>
              <RadioGroup 
                value={preferences.notification_style}
                onValueChange={(value) => handleChange({ notification_style: value as SensoryPreferences["notification_style"] })}
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
                onValueChange={(value) => handleChange({ notification_timing: value as SensoryPreferences["notification_timing"] })}
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
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
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
                onValueChange={(value) => handleChange({ haptic_intensity: value as SensoryPreferences["haptic_intensity"] })}
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
                onValueChange={(value) => handleChange({ flash_pattern: value as SensoryPreferences["flash_pattern"] })}
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
                onValueChange={(value) => handleChange({ flash_color: value as SensoryPreferences["flash_color"] })}
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
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <div className="space-y-3">
              <Label>Color Scheme</Label>
              <RadioGroup 
                value={preferences.color_scheme}
                onValueChange={(value) => handleChange({ color_scheme: value as SensoryPreferences["color_scheme"] })}
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
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} className="w-full bg-pink-500 hover:bg-pink-600 text-white mt-6">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};
