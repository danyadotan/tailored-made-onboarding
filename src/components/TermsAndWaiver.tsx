
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText } from "lucide-react";
import { acceptTerms } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface TermsAndWaiverProps {
  onAccept: () => void;
}

export const TermsAndWaiver = ({ onAccept }: TermsAndWaiverProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAccept = async () => {
    if (!acceptedTerms || !signature.trim()) {
      toast({
        title: "Required fields",
        description: "Please accept the terms and provide your signature.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await acceptTerms();
      if (success) {
        toast({
          title: "Terms accepted",
          description: "Thank you for accepting the terms and conditions.",
        });
        onAccept();
      } else {
        throw new Error("Failed to save terms acceptance");
      }
    } catch (error) {
      console.error("Error accepting terms:", error);
      toast({
        title: "Error",
        description: "There was a problem accepting the terms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Terms and Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4 h-64 overflow-auto text-sm">
          <h3 className="font-bold mb-2">Bridge-IT: ADHD Assistance App - Terms of Service and Waiver</h3>
          
          <p className="mb-4">By using Bridge-IT, you agree to the following terms and acknowledge the limitations of the service:</p>
          
          <h4 className="font-semibold mb-1">1. Nature of Service</h4>
          <p className="mb-3">Bridge-IT is a supportive tool designed to assist individuals with ADHD. It is not a medical device, treatment, or replacement for professional medical advice, diagnosis, or treatment.</p>
          
          <h4 className="font-semibold mb-1">2. No Medical Claims</h4>
          <p className="mb-3">We do not claim that Bridge-IT can cure, treat, or mitigate ADHD or any other condition. The app is intended to provide organizational support, reminders, and motivational assistance only.</p>
          
          <h4 className="font-semibold mb-1">3. Data Collection and Privacy</h4>
          <p className="mb-3">The app collects usage data, including sensory preferences and interaction patterns, to improve your experience. This data is handled according to our Privacy Policy.</p>
          
          <h4 className="font-semibold mb-1">4. Waiver of Liability</h4>
          <p className="mb-3">You agree that the creators, developers, and operators of Bridge-IT shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use or inability to use the service.</p>
          
          <h4 className="font-semibold mb-1">5. Use with Professional Guidance</h4>
          <p className="mb-3">We recommend using Bridge-IT in conjunction with, not as a replacement for, professional medical advice and treatment plans prescribed by qualified healthcare providers.</p>
          
          <h4 className="font-semibold mb-1">6. Updates and Changes</h4>
          <p className="mb-3">We may update these terms as the app evolves. Continued use after changes constitutes acceptance of the revised terms.</p>
          
          <h4 className="font-semibold mb-1">7. Age Requirement</h4>
          <p className="mb-3">Users must be at least 18 years old or have parental/guardian consent to use Bridge-IT.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            />
            <Label htmlFor="terms" className="leading-normal">
              I have read and agree to the terms and conditions and acknowledge that Bridge-IT is not a medical treatment or substitute for professional care.
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signature">Your Digital Signature (Full Name)</Label>
            <Textarea 
              id="signature" 
              placeholder="Type your full name as your signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAccept} 
          disabled={!acceptedTerms || !signature.trim() || loading}
          className="w-full"
        >
          {loading ? "Processing..." : "Accept and Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
};
