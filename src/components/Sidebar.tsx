import { Button } from "@/components/ui/button";
import { X, Info, BookOpen, Target, Sparkles, ThumbsUp, HeartHandshake, Command } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  onClose: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const commands = [
    { name: "/commands", icon: <Command className="h-4 w-4 mr-2" />, description: "Lists all available commands" },
    { name: "/start", icon: <Target className="h-4 w-4 mr-2" />, description: "Begin the 8-step guided process" },
    { name: "/learn", icon: <BookOpen className="h-4 w-4 mr-2" />, description: "Explore procrastination psychology" },
    { name: "/visualize", icon: <Sparkles className="h-4 w-4 mr-2" />, description: "Imagine a productive future" },
    { name: "/commit", icon: <ThumbsUp className="h-4 w-4 mr-2" />, description: "Set goals and action steps" },
    { name: "/relax", icon: <HeartHandshake className="h-4 w-4 mr-2" />, description: "Mindfulness techniques" }
  ];

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-sidebar-foreground">Bridge.it</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="bg-sidebar-accent rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2 text-sidebar-accent-foreground">
          <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            I'm Bridge, your AI companion in the Dynamic Bridge ADHD program. 
            I'm here to help you navigate challenges with focus, time management, and goal achievement.
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-1">
        <h3 className="font-medium text-sm text-sidebar-foreground/70 px-2 mb-2">Available Commands</h3>
        {commands.map((command) => (
          <Button
            key={command.name}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <span className="flex items-center">
              {command.icon}
              <span className="font-mono">{command.name}</span>
            </span>
            <span className="ml-2 text-xs text-sidebar-foreground/70">— {command.description}</span>
          </Button>
        ))}
      </div>

      <div className="mt-auto">
        <Separator className="my-4" />
        <div className="px-2 py-2 bg-sidebar-accent/50 rounded-lg">
          <p className="text-xs text-sidebar-foreground/70 mb-2">Part of the Dynamic Bridge ADHD Program</p>
          <a 
            href="https://dynamicbridge.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline decoration-dotted hover:decoration-solid"
          >
            Explore Dynamic Bridge Support Tools
          </a>
        </div>
      </div>
    </div>
  );
};
