
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

interface MessageInputProps {
  onSubmit: (content: string) => void;
  isProcessing: boolean;
}

export const MessageInput = ({ onSubmit, isProcessing }: MessageInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onSubmit(input.trim());
    setInput("");
  };

  return (
    <div className="p-4 md:p-6 border-t">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="הקלד הודעה או פקודה..."
            className="flex-1"
            dir="rtl"
            disabled={isProcessing}
          />
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
