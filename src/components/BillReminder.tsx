
import { useEffect, useState, useRef } from "react";
import { AlertTriangle, FileUp, Zap, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export function BillReminder() {
  const [open, setOpen] = useState(true);
  const [isBuzzing, setIsBuzzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState(40); // Starting at a lower urgency
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes in seconds
  const [reminderPaused, setReminderPaused] = useState(false);
  const [isFirstReminder, setIsFirstReminder] = useState(true);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Activate sensory feedback - milder light changes, no vibration by default
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (open && !reminderPaused) {
      // Gentler visual indication - only flash every 30 seconds
      const flashInterval = setInterval(() => {
        setIsBuzzing(true);
        setTimeout(() => setIsBuzzing(false), 1000);
      }, 30000);
      
      // Optional vibration only for second phase - single gentle buzz
      if (!isFirstReminder && 'vibrate' in navigator) {
        navigator.vibrate([200]);
      }
      
      // Increase urgency over time, but more gradually
      const urgencyInterval = setInterval(() => {
        setUrgencyLevel(prev => {
          if (prev < 90) return prev + 2;
          return prev;
        });
      }, 20000); // Every 20 seconds
      
      return () => {
        if ('vibrate' in navigator) {
          navigator.vibrate(0);
        }
        setIsBuzzing(false);
        clearInterval(flashInterval);
        clearInterval(urgencyInterval);
      };
    }
  }, [open, isFirstReminder, reminderPaused]);

  // Timer effect - with pause functionality
  useEffect(() => {
    if (open && timeRemaining > 0 && !reminderPaused) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up, trigger the next phase
            if (isFirstReminder) {
              // Switch to second reminder phase with 8 minutes
              setIsFirstReminder(false);
              setUrgencyLevel(60); // Moderate urgency increase
              
              // Show toast
              toast({
                title: "Reminder",
                description: "Your bill still needs attention. Please take action when convenient.",
                variant: "default" // Less alarming variant
              });
              
              return 8 * 60; // 8 minutes for second phase
            } else {
              // Final reminder - not as critical
              toast({
                title: "Final Reminder",
                description: "Please address your electricity bill soon.",
                variant: "default"
              });
              
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [open, timeRemaining, isFirstReminder, reminderPaused, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select your electricity bill receipt to upload",
        variant: "default"
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setUploading(false);
      setOpen(false);
      
      toast({
        title: "Receipt uploaded successfully",
        description: "Your electricity bill receipt has been filed for future reference",
      });
      
      // Stop any ongoing effects
      if ('vibrate' in navigator) {
        navigator.vibrate(0);
      }
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, 2000);
  };

  const handlePay = () => {
    setOpen(false);
    
    // Stop any ongoing effects
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Redirect to a payment page or open payment dialog
    toast({
      title: "Redirecting to payment",
      description: "You'll be taken to the electricity bill payment page",
    });
    
    // This would typically redirect to a payment URL
    // window.location.href = "https://payment-provider.com";
  };

  const togglePause = () => {
    setReminderPaused(prev => !prev);
    
    if (!reminderPaused) {
      // User is pausing the reminder
      toast({
        title: "Reminder paused",
        description: "Take your time to handle this task. Resume when you're ready.",
      });
      
      // Stop any vibration
      if ('vibrate' in navigator) {
        navigator.vibrate(0);
      }
    } else {
      // User is resuming
      toast({
        title: "Reminder resumed",
        description: "Thank you for coming back to this task.",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className={`sm:max-w-md ${isBuzzing ? 'animate-pulse' : ''}`} 
          style={{
            boxShadow: isBuzzing ? '0 0 10px 3px rgba(249, 115, 22, 0.5)' : 'none', // Softer orange glow
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-500"> {/* Changed from destructive to orange */}
              <AlertTriangle className="h-5 w-5" />
              Reminder: Electricity Bill Action Needed
            </DialogTitle>
            <DialogDescription>
              Your electricity bill requires attention. Please submit payment or upload your receipt when convenient.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-500">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">Priority Level:</span>
              </div>
              <Button 
                variant="ghost"
                size="sm"
                onClick={togglePause}
                className="text-xs"
              >
                {reminderPaused ? "Resume Reminder" : "Pause Reminder"}
              </Button>
            </div>
            
            <Progress value={urgencyLevel} className="h-2 bg-gray-200" 
              style={{
                '--progress-background': urgencyLevel > 70 ? 'rgb(249, 115, 22)' : 'rgb(234, 179, 8)',
              } as React.CSSProperties}
            />
            
            <div className="flex items-center justify-between mt-3 p-2 border border-orange-200 rounded-md bg-orange-50">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Time Available:</span>
              </div>
              <div className={`font-mono text-lg font-bold text-orange-600 ${reminderPaused ? 'opacity-50' : ''}`}>
                {reminderPaused ? "Paused" : formatTime(timeRemaining)}
              </div>
            </div>
            
            <div className="grid w-full items-center gap-1.5 mt-4">
              <label htmlFor="receipt" className="flex items-center gap-2 text-sm font-medium">
                <FileUp className="h-5 w-5" />
                Already paid? Upload your receipt
              </label>
              <input
                id="receipt"
                type="file"
                className="mt-2"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="sm:w-auto w-full order-3 sm:order-1"
            >
              Remind Me Later
            </Button>
            <Button 
              onClick={handlePay}
              className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700 order-2"
            >
              Pay Bill Now
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="sm:w-auto w-full bg-green-600 hover:bg-green-700 order-1 sm:order-3"
            >
              {uploading ? "Uploading..." : "Upload Receipt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
