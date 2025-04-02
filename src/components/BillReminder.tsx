
import { useEffect, useState } from "react";
import { AlertTriangle, FileUp, Zap } from "lucide-react";
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
  const { toast } = useToast();

  // Activate sensory feedback - light flashing and vibration
  useEffect(() => {
    // Light feedback - flash the background color
    let intervalId: number | null = null;
    
    if (open) {
      // Start the vibration if supported
      if ('vibrate' in navigator) {
        // Vibration pattern: vibrate for 300ms, pause for 100ms, repeat
        navigator.vibrate([300, 100, 300, 100, 300]);
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
  }, [open]);

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
    }, 2000);
  };

  const handlePay = () => {
    setOpen(false);
    
    // Stop vibration
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
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
        <DialogContent className={`sm:max-w-md ${isBuzzing ? 'animate-pulse' : ''}`} style={{
          boxShadow: isBuzzing ? '0 0 15px 5px rgba(255, 0, 0, 0.7)' : 'none',
        }}>
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
