
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { updateProfileInSupabase, SensoryPreferences, Profile, defaultSensoryPreferences } from "@/services/profileService";
import { TermsAndWaiver } from "@/components/TermsAndWaiver";
import { SensorySettings } from "@/components/SensorySettings";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { BasicInfoStep } from "@/components/onboarding/BasicInfoStep";
import { StepNavigation } from "@/components/onboarding/StepNavigation";
import { FinalStep } from "@/components/onboarding/FinalStep";

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
            <CardContent>
              <BasicInfoStep profile={profile} updateProfile={updateProfile} />
            </CardContent>
            <CardFooter>
              <StepNavigation onNext={handleNext} showBack={false} />
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
            <CardFooter>
              <StepNavigation onNext={handleNext} onBack={handleBack} />
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
            <CardFooter>
              <StepNavigation onNext={handleNext} onBack={handleBack} />
            </CardFooter>
          </>
        );
        
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">You're All Set!</CardTitle>
            </CardHeader>
            <CardContent>
              <FinalStep loading={loading} onComplete={handleComplete} />
            </CardContent>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-2xl">
        <OnboardingProgress currentStep={step} totalSteps={totalSteps} />
        {renderStep()}
      </Card>
    </div>
  );
};
