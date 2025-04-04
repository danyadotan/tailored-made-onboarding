
import { useState, useEffect } from "react";
import { Profile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";

interface NotificationSystemProps {
  profile: Profile | null;
}

type NotificationType = "reminder" | "alert" | "info" | "success";

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

export const NotificationSystem = ({ profile }: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { toast } = useToast();

  // This is just a mock function to simulate notifications coming in
  useEffect(() => {
    const intervalId = setInterval(() => {
      const shouldNotify = Math.random() > 0.9; // 10% chance of notification for demo
      if (shouldNotify) {
        const mockNotification: AppNotification = {
          id: Date.now().toString(),
          type: ["reminder", "alert", "info", "success"][Math.floor(Math.random() * 4)] as NotificationType,
          title: "Demo Notification",
          message: "This is a simulated notification to demonstrate sensory preferences.",
          time: new Date(),
          read: false
        };
        
        setNotifications(prev => [...prev, mockNotification]);
        triggerNotification(mockNotification);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const triggerNotification = (notification: AppNotification) => {
    const sensoryPrefs = profile?.sensory_preferences;
    
    if (!sensoryPrefs) return;
    
    // Based on notification style preference
    switch (sensoryPrefs.notification_style) {
      case "visual":
        showVisualNotification(notification);
        break;
      case "audio":
        playAudioNotification(notification.type);
        break;
      case "haptic":
        triggerHapticFeedback(sensoryPrefs.haptic_intensity);
        break;
      case "flash":
        triggerFlashNotification(sensoryPrefs.flash_pattern, sensoryPrefs.flash_color);
        break;
      case "both":
        showVisualNotification(notification);
        
        if (sensoryPrefs.sound_enabled) {
          playAudioNotification(notification.type);
        }
        
        if (Math.random() > 0.5) { // Randomly choose between haptic and flash for "both"
          triggerHapticFeedback(sensoryPrefs.haptic_intensity);
        } else {
          triggerFlashNotification(sensoryPrefs.flash_pattern, sensoryPrefs.flash_color);
        }
        break;
    }
  };

  const showVisualNotification = (notification: AppNotification) => {
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "alert" ? "destructive" : "default",
    });
  };

  const playAudioNotification = (type: NotificationType) => {
    // In a real app, you would have different sound files for different notification types
    const audioElement = new Audio();
    
    switch (type) {
      case "reminder":
        audioElement.src = "/sounds/reminder.mp3";
        break;
      case "alert":
        audioElement.src = "/sounds/alert.mp3";
        break;
      case "info":
        audioElement.src = "/sounds/info.mp3";
        break;
      case "success":
        audioElement.src = "/sounds/success.mp3";
        break;
    }
    
    // For this demo, we won't actually play sounds
    console.log("Would play sound for notification type:", type);
  };

  const triggerHapticFeedback = (intensity: "low" | "medium" | "high") => {
    if ("vibrate" in navigator) {
      switch(intensity) {
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
    }
  };

  const triggerFlashNotification = (pattern: string, color: string) => {
    const flashElement = document.createElement('div');
    flashElement.className = `flash-overlay flash-${pattern} flash-${color}`;
    document.body.appendChild(flashElement);
    
    setTimeout(() => {
      document.body.removeChild(flashElement);
    }, 1500);
  };

  // Component doesn't render anything visible directly
  return null;
};
