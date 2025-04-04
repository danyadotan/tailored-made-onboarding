
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile } from "@/services/profileService";

interface BasicInfoStepProps {
  profile: Partial<Profile>;
  updateProfile: (updates: Partial<Profile>) => void;
}

export const BasicInfoStep = ({ profile, updateProfile }: BasicInfoStepProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};
