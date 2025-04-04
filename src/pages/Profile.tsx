import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfileFromSupabase, updateProfileInSupabase, Profile as ProfileType } from "@/services/profileService";
import { SensorySettings } from "@/components/SensorySettings";
import { TermsAndWaiver } from "@/components/TermsAndWaiver";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, FileText } from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProfileFromSupabase();
      setProfile(data);
      if (data) {
        setFormData({
          username: data.username || "",
          full_name: data.full_name || ""
        });
      }
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await updateProfileInSupabase({
      username: formData.username,
      full_name: formData.full_name
    });

    if (success) {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      
      // Refresh profile data
      const updatedProfile = await getProfileFromSupabase();
      setProfile(updatedProfile);
      setIsEditing(false);
    } else {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  if (isLoading && !profile) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> 
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Sensory Settings
              </TabsTrigger>
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Terms & Waiver
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">Username</p>
                        <p className="text-lg">{profile?.username || "No username set"}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-sm text-muted-foreground">Full Name</p>
                        <p className="text-lg">{profile?.full_name || "No name set"}</p>
                      </div>
                      
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="Enter your username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input 
                          id="full_name" 
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button type="submit" disabled={isLoading}>
                          Save Changes
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Sensory Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <SensorySettings 
                    initialPreferences={profile?.sensory_preferences || undefined}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle>Terms and Waiver</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.terms_accepted ? (
                    <div className="space-y-4">
                      <p className="text-green-600 font-medium">
                        You have accepted the terms and conditions.
                      </p>
                      {profile.terms_accepted_at && (
                        <p className="text-sm text-muted-foreground">
                          Accepted on: {new Date(profile.terms_accepted_at).toLocaleDateString()}
                        </p>
                      )}
                      <Button onClick={() => window.open("/terms", "_blank")}>
                        View Terms
                      </Button>
                    </div>
                  ) : (
                    <TermsAndWaiver 
                      onAccept={async () => {
                        // Refresh profile data after terms acceptance
                        const updatedProfile = await getProfileFromSupabase();
                        setProfile(updatedProfile);
                      }} 
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
