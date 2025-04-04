import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { updateProfileInSupabase, SensoryPreferences, Profile, defaultSensoryPreferences } from "@/services/profileService";
import { TermsAndWaiver } from "@/components/TermsAndWaiver";
import { SensorySettings } from "@/components/SensorySettings";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<Profile>>({
    username: "",
    full_name: "",
    sensory_preferences: defaultSensoryPreferences
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const totalSteps = 4;
  
  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };
  
  const handleSensoryPreferencesChange = (preferences: SensoryPreferences) => {
    updateProfile({ sensory_preferences: preferences });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const success = await updateProfileInSupabase({
        ...profile,
        onboarding_completed: true
      });
      
      if (success) {
        toast({
          title: "Setup complete",
          description: "Your profile has been set up successfully.",
        });
        onComplete();
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "There was a problem completing the setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">Welcome to Bridge-IT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center mb-6">
                Let's set up your profile to personalize your experience. This will help us better assist you with your ADHD management.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    placeholder="Your full name"
                    value={profile.full_name || ""}
                    onChange={(e) => updateProfile({ full_name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Preferred Username</Label>
                  <Input 
                    id="username" 
                    placeholder="Choose a username"
                    value={profile.username || ""}
                    onChange={(e) => updateProfile({ username: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div></div> {/* Empty div for spacing */}
              <Button onClick={handleNext}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </CardFooter>
          </>
        );
        
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">Sensory Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-6">
                Let's customize how Bridge-IT looks and feels to make it comfortable for you.
              </p>
              
              <SensorySettings 
                initialPreferences={profile.sensory_preferences || undefined}
                onPreferencesChange={handleSensoryPreferencesChange}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </CardFooter>
          </>
        );
        
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">Terms and Waiver</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-6">
                Please review and accept our terms and conditions.
              </p>
              
              <TermsAndWaiver onAccept={handleNext} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {/* No next button here as TermsAndWaiver has its own */}
            </CardFooter>
          </>
        );
        
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">You're All Set!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <p>
                Thank you for completing the setup process. Bridge-IT is now personalized to your preferences.
              </p>
              
              <p>
                We're excited to be part of your ADHD management journey!
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? "Processing..." : "Start Using Bridge-IT"}
              </Button>
            </CardFooter>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-2xl">
        <div className="mb-6 mt-4">
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-10 rounded-full ${
                    i + 1 <= step ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>
        
        {renderStep()}
      </Card>
    </div>
  );
};
