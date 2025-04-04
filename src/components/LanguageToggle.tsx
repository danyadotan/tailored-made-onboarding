
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Language } from "lucide-react";
import { updateLanguage } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";

interface LanguageToggleProps {
  currentLanguage: "en" | "he";
  onLanguageChange?: (language: "en" | "he") => void;
}

export const LanguageToggle = ({ currentLanguage, onLanguageChange }: LanguageToggleProps) => {
  const [language, setLanguage] = useState<"en" | "he">(currentLanguage);
  const { toast } = useToast();

  const handleLanguageChange = async (newLanguage: "en" | "he") => {
    setLanguage(newLanguage);
    
    // Update in Supabase
    const success = await updateLanguage(newLanguage);
    
    if (success) {
      toast({
        title: "Language updated",
        description: newLanguage === "en" 
          ? "The language has been set to English" 
          : "השפה הוגדרה לעברית",
      });
      
      if (onLanguageChange) {
        onLanguageChange(newLanguage);
      }
      
      // Set HTML dir attribute for RTL support
      document.documentElement.dir = newLanguage === "he" ? "rtl" : "ltr";
    } else {
      toast({
        title: "Error",
        description: "Failed to update language preference",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Language className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "bg-accent" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("he")}
          className={language === "he" ? "bg-accent" : ""}
        >
          עברית (Hebrew)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
