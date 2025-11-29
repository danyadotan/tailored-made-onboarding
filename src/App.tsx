
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfileFromSupabase, Profile as UserProfile } from "@/services/profileService";
import Index from "./pages/Index";
import Games from "./pages/Games";
import ExecutiveGame from "./pages/ExecutiveGame";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Load profile on app start
  useEffect(() => {
    const loadProfile = async () => {
      const userProfile = await getProfileFromSupabase();
      setProfile(userProfile);
      
      if (userProfile) {
        // Apply language settings
        document.documentElement.dir = userProfile.language === "he" ? "rtl" : "ltr";
        
        // Apply color scheme if available
        if (userProfile.sensory_preferences?.color_scheme) {
          document.documentElement.setAttribute(
            'data-color-scheme', 
            userProfile.sensory_preferences.color_scheme
          );
          
          // Add Bridge-IT theme class if selected
          if (userProfile.sensory_preferences.color_scheme === "bridge-it") {
            document.documentElement.classList.add('bridge-it-theme');
          }
        }
        
        // Apply motion reduction if needed
        if (userProfile.sensory_preferences?.motion_sensitivity) {
          document.documentElement.classList.add('reduce-motion');
        }
      }
    };
    
    loadProfile();
  }, []);

  // Apply background effect
  useEffect(() => {
    const bgClass = profile?.sensory_preferences?.color_scheme === "bridge-it" 
      ? "bg-gradient-bridge-it" 
      : "bg-gradient-primary";
    
    document.body.classList.add(bgClass);
    
    return () => {
      document.body.classList.remove(bgClass);
      document.body.classList.remove("bg-gradient-primary");
      document.body.classList.remove("bg-gradient-bridge-it");
    };
  }, [profile?.sensory_preferences?.color_scheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/executive" element={<ExecutiveGame />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
