
import { useEffect, useState, useRef } from "react";
import { AlertTriangle, FileUp, Zap, Clock } from "lucide-react";
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
  const [urgencyLevel, setUrgencyLevel] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(7 * 60); // 7 minutes in seconds
  const [isFirstReminder, setIsFirstReminder] = useState(true);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Activate sensory feedback - light flashing and vibration
  useEffect(() => {
    // Light feedback - flash the background color
    let intervalId: number | null = null;
    
    if (open) {
      // Start the vibration if supported
      if ('vibrate' in navigator) {
        // First reminder: 5 buzzes
        if (isFirstReminder) {
          navigator.vibrate([300, 100, 300, 100, 300, 100, 300, 100, 300]);
        } else {
          // Second reminder: 7 buzzes (more urgent)
          navigator.vibrate([300, 100, 300, 100, 300, 100, 300, 100, 300, 100, 300, 100, 300]);
        }
      }
      
      // Start the light flashing
      setIsBuzzing(true);
      
      // Increase urgency over time
      const urgencyInterval = setInterval(() => {
        setUrgencyLevel(prev => {
          if (prev < 95) return prev + 5;
          return prev;
        });
      }, 10000); // Every 10 seconds
      
      return () => {
        // Stop vibration when component unmounts
        if ('vibrate' in navigator) {
          navigator.vibrate(0); // Stop vibration
        }
        setIsBuzzing(false);
        if (intervalId) clearInterval(intervalId);
        clearInterval(urgencyInterval);
      };
    }
  }, [open, isFirstReminder]);

  // Timer effect
  useEffect(() => {
    if (open && timeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up, trigger the next phase
            if (isFirstReminder) {
              // Switch to second reminder phase with 5 minutes
              setIsFirstReminder(false);
              setUrgencyLevel(85); // Increase urgency
              
              // Flash more intensely
              setIsBuzzing(false);
              setTimeout(() => setIsBuzzing(true), 50);
              
              // Show toast
              toast({
                title: "Time's up!",
                description: "Your situation is becoming critical! Please take action now.",
                variant: "destructive"
              });
              
              return 5 * 60; // Reset to 5 minutes
            } else {
              // Final warning
              if ('vibrate' in navigator) {
                // Very long intense vibration for final warning
                navigator.vibrate([800, 200, 800, 200, 800, 200, 800]);
              }
              
              toast({
                title: "CRITICAL WARNING!",
                description: "You are at risk of service disconnection!",
                variant: "destructive"
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
  }, [open, timeRemaining, isFirstReminder, toast]);

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
        variant: "destructive"
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
      
      // Stop vibration
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
    
    // Stop vibration
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

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className={`sm:max-w-md ${isBuzzing ? 'animate-pulse' : ''}`} 
          style={{
            boxShadow: isBuzzing ? '0 0 15px 5px rgba(255, 0, 0, 0.7)' : 'none',
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Urgent: Electricity Bill Action Required
            </DialogTitle>
            <DialogDescription>
              Your electricity bill requires immediate attention. Either payment is due, or we need your receipt for filing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-orange-500">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-medium">Urgency Level:</span>
            </div>
            <Progress value={urgencyLevel} className="h-2 bg-gray-200" 
              style={{
                '--progress-background': urgencyLevel > 80 ? 'rgb(220, 38, 38)' : 'rgb(249, 115, 22)',
              } as React.CSSProperties}
            />
            
            <div className="flex items-center justify-between mt-3 p-2 border border-orange-200 rounded-md bg-orange-50">
              <div className="flex items-center gap-2">
                <Clock className={`h-5 w-5 ${timeRemaining < 60 ? 'text-red-600' : 'text-orange-500'}`} />
                <span className="text-sm font-medium">Time Remaining:</span>
              </div>
              <div className={`font-mono text-lg font-bold ${timeRemaining < 60 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
                {formatTime(timeRemaining)}
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
              Dismiss (Not Recommended)
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
