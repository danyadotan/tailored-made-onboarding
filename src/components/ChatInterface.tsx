
import { useState, useRef, useEffect } from "react";
import { BillReminder } from "@/components/BillReminder";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { CommandButtons } from "@/components/chat/CommandButtons";
import { MessageInput } from "@/components/chat/MessageInput";
import { ADHDProfile, Message } from "@/types/chat";
import { generateResponse } from "@/utils/responseGenerator";
import { 
  saveMessageToSupabase, 
  getMessagesFromSupabase, 
  deleteMessageFromSupabase,
  updateMessageInSupabase,
  setupRealtimeMessages
} from "@/services/messageService";
import { getProfileFromSupabase, Profile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Settings, User } from "lucide-react";
import { Onboarding } from "@/components/Onboarding";
import { SensorySettings } from "@/components/SensorySettings";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBillReminder, setShowBillReminder] = useState(true);
  const [userProfile, setUserProfile] = useState<ADHDProfile>({
    timePerception: 60,
    taskInitiation: 50,
    sustainedAttention: 65,
    workingMemory: 55,
    emotionalRegulation: 70,
    optimalWorkPeriods: ["09:00-11:30", "16:00-18:30"],
    commonDistractions: ["social media", "email", "noise"]
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [language, setLanguage] = useState<"en" | "he">("en");
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load profile and messages from Supabase on component mount
  useEffect(() => {
    const loadProfileAndMessages = async () => {
      // Load profile
      const userProfile = await getProfileFromSupabase();
      if (userProfile) {
        setProfile(userProfile);
        setLanguage(userProfile.language || "en");
        
        // Set HTML dir attribute for RTL support
        document.documentElement.dir = userProfile.language === "he" ? "rtl" : "ltr";
        
        // Show onboarding if not completed
        if (!userProfile.onboarding_completed) {
          setShowOnboarding(true);
        }
      } else {
        // No profile found, show onboarding
        setShowOnboarding(true);
      }
      
      // Load messages
      const savedMessages = await getMessagesFromSupabase();
      
      // If no messages found, add welcome message
      if (savedMessages.length === 0) {
        const welcomeMessage: Message = {
          id: "welcome",
          role: "assistant",
          content: "Welcome to Bridge-IT: Your ADHD Support Partner 🌈\n\nI'm a comprehensive support system designed to bridge cognitive gaps and reduce comorbidities associated with ADHD. We'll work together on cognitive strategies, emotional wellbeing, and personalized growth techniques.\n\nWhat aspect of your ADHD experience would you like to focus on today? Type /commands to discover our holistic support pathways."
        };
        setMessages([welcomeMessage]);
        await saveMessageToSupabase(welcomeMessage);
      } else {
        setMessages(savedMessages);
      }
    };
    
    loadProfileAndMessages();
  }, []);

  // Setup realtime listener for new messages
  useEffect(() => {
    const cleanup = setupRealtimeMessages((newMessage) => {
      setMessages((prevMessages) => {
        // Check if this message is already in our state
        if (!prevMessages.find(m => m.id === newMessage.id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });
    
    return cleanup;
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageSubmit = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Save user message to Supabase
    await saveMessageToSupabase(userMessage);

    // Create a function within setTimeout to handle async operations
    setTimeout(() => {
      const processResponse = async () => {
        // Generate response
        const response = generateResponse(userMessage, userProfile);
        
        // Update messages state
        setMessages((prev) => [...prev, response]);
        setIsProcessing(false);
        
        // Save assistant response to Supabase
        await saveMessageToSupabase(response);
      };

      // Execute the async function to process the response
      processResponse();
    }, 1500);
  };

  const handleCommandClick = (command: string) => {
    handleMessageSubmit(command);
  };

  const handleDeleteMessage = async (messageId: string) => {
    const success = await deleteMessageFromSupabase(messageId);
    if (success) {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      toast({
        title: "Message deleted",
        description: "The message was successfully deleted",
      });
    } else {
      toast({
        title: "Error deleting message",
        description: "Could not delete the message, please try again later",
        variant: "destructive",
      });
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    const success = await updateMessageInSupabase(messageId, newContent);
    if (success) {
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === messageId ? { ...msg, content: newContent } : msg
        )
      );
      toast({
        title: "Message updated",
        description: "The message was successfully updated",
      });
    } else {
      toast({
        title: "Error updating message",
        description: "Could not update the message, please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleLanguageChange = (newLanguage: "en" | "he") => {
    setLanguage(newLanguage);
  };
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Reload profile after onboarding
    getProfileFromSupabase().then(userProfile => {
      if (userProfile) {
        setProfile(userProfile);
        setLanguage(userProfile.language || "en");
      }
    });
  };
  
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col h-full bg-layered-deep relative overflow-hidden">
      {/* Animated background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl float-gentle"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-accent/8 rounded-full blur-3xl float-moderate"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-secondary/6 rounded-full blur-2xl float-gentle" style={{animationDelay: '2s'}}></div>
      </div>
      
      {showBillReminder && <BillReminder />}
      
      <div className="relative z-10 flex items-center justify-between p-2 md:p-4 card-depth-2 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                {profile?.username || "Profile"}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Your Profile</SheetTitle>
                <SheetDescription>
                  View and edit your profile information
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                {profile && (
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Full Name</p>
                      <p className="text-muted-foreground">{profile.full_name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Username</p>
                      <p className="text-muted-foreground">{profile.username || "Not set"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Account Status</p>
                      <p className="text-muted-foreground">
                        {profile.terms_accepted ? "Terms Accepted" : "Terms Not Accepted"}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>
                  Customize your experience
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <SensorySettings 
                  initialPreferences={profile?.sensory_preferences || undefined}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          <LanguageToggle 
            currentLanguage={language} 
            onLanguageChange={handleLanguageChange} 
          />
        </div>
      </div>
      
      <div className="relative z-10 flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto relative">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message}
              onDelete={message.role === "user" ? handleDeleteMessage : undefined}
              onEdit={message.role === "user" ? handleEditMessage : undefined}
            />
          ))}
          {isProcessing && <MessageBubble isLoading />}
          <div ref={chatEndRef} />
        </div>
      </div>

      <CommandButtons onCommandClick={handleCommandClick} />
      
      <MessageInput 
        onSubmit={handleMessageSubmit}
        isProcessing={isProcessing}
      />
    </div>
  );
};
