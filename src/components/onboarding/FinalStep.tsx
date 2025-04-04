
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface FinalStepProps {
  loading: boolean;
  onComplete: () => void;
}

export const FinalStep = ({ loading, onComplete }: FinalStepProps) => {
  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <p>
        Thank you for completing the setup process. Bridge-IT is now personalized to your preferences.
      </p>
      
      <p>
        We're excited to be part of your ADHD management journey!
      </p>
      
      <div className="flex justify-center pt-4">
        <Button onClick={onComplete} disabled={loading}>
          {loading ? "Processing..." : "Start Using Bridge-IT"}
        </Button>
      </div>
    </div>
  );
};
