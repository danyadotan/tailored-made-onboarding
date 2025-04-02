
import { Button } from "@/components/ui/button";
import { X, Info, BookOpen, Target, Sparkles, ThumbsUp, HeartHandshake, Command, Brain, Zap, Lightbulb, Gamepad2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

interface SidebarProps {
  onClose: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const commands = [
    { name: "/commands", icon: <Command className="h-4 w-4 mr-2" />, description: "Lists all available commands" },
    { name: "/start", icon: <Target className="h-4 w-4 mr-2" />, description: "Begin holistic 8-step ADHD growth process" },
    { name: "/learn", icon: <Brain className="h-4 w-4 mr-2" />, description: "Explore ADHD neuroscience and strategies" },
    { name: "/visualize", icon: <Sparkles className="h-4 w-4 mr-2" />, description: "Create empowering mental landscapes" },
    { name: "/commit", icon: <ThumbsUp className="h-4 w-4 mr-2" />, description: "Set personalized growth goals" },
    { name: "/mindful", icon: <Lightbulb className="h-4 w-4 mr-2" />, description: "Holistic cognitive and emotional tools" },
    { name: "/energize", icon: <Zap className="h-4 w-4 mr-2" />, description: "Optimize energy and motivation" }
  ];

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-sidebar-foreground">Dynamic Bridge</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="bg-sidebar-accent rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2 text-sidebar-accent-foreground">
          <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            Welcome to Dynamic Bridge: A holistic ADHD support ecosystem. 
            We integrate neuroscience, psychology, and personalized strategies 
            to empower your unique cognitive journey.
          </p>
        </div>
      </div>

      <Separator className="my-4" />
      
      <div className="space-y-1 mb-4">
        <h3 className="font-medium text-sm text-sidebar-foreground/70 px-2 mb-2">Navigation</h3>
        <Link to="/">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Chat Assistant
          </Button>
        </Link>
        <Link to="/games">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Gamepad2 className="h-4 w-4 mr-2" />
            Interactive Games
          </Button>
        </Link>
      </div>

      <Separator className="my-4" />

      <div className="space-y-1">
        <h3 className="font-medium text-sm text-sidebar-foreground/70 px-2 mb-2">Holistic Growth Commands</h3>
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
          <p className="text-xs text-sidebar-foreground/70 mb-2">Holistic ADHD Growth Ecosystem</p>
          <a 
            href="https://dynamicbridge.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline decoration-dotted hover:decoration-solid"
          >
            Explore Dynamic Bridge Holistic Support
          </a>
        </div>
      </div>
    </div>
  );
};
