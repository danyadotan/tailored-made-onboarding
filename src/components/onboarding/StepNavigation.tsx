
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const StepNavigation = ({ onNext, onBack, showBack = true }: StepNavigationProps) => {
  return (
    <div className="flex justify-between">
      {showBack && onBack ? (
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      ) : (
        <div></div> // Empty div for spacing when back button is hidden
      )}
      
      <Button onClick={onNext}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
    </div>
  );
};
