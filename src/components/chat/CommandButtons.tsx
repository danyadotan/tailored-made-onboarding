
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Brain, Calendar, Clock, Sparkles, Target } from "lucide-react";

interface CommandButtonsProps {
  onCommandClick: (command: string) => void;
}

export const CommandButtons = ({ onCommandClick }: CommandButtonsProps) => {
  const { toast } = useToast();

  const handleCommandClick = (command: string) => {
    onCommandClick(command);
    toast({
      title: "פקודה נבחרה",
      description: `הקלד או לחץ Enter כדי לשלוח "${command}"`,
    });
  };

  const commands = [
    { cmd: "/profile", icon: <Brain className="h-3.5 w-3.5 mr-1" /> },
    { cmd: "/plan", icon: <Calendar className="h-3.5 w-3.5 mr-1" /> },
    { cmd: "/focus", icon: <Target className="h-3.5 w-3.5 mr-1" /> },
    { cmd: "/decompose", icon: <Sparkles className="h-3.5 w-3.5 mr-1" /> },
    { cmd: "/break", icon: <Clock className="h-3.5 w-3.5 mr-1" /> },
  ];

  return (
    <div className="px-4 md:px-6 py-3 bg-accent/20 border-t border-accent/30">
      <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground pt-1.5">פקודות מהירות:</span>
        {commands.map((item) => (
          <Button
            key={item.cmd}
            variant="outline"
            size="sm"
            className="bg-background/70 text-xs font-mono flex items-center"
            onClick={() => handleCommandClick(item.cmd)}
          >
            {item.icon}
            {item.cmd}
          </Button>
        ))}
      </div>
    </div>
  );
};
