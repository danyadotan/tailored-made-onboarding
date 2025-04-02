
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BillReminder } from "@/components/BillReminder";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to Dynamic Bridge: Your Holistic ADHD Growth Partner 🌈\n\nI'm your comprehensive support system, designed to address ADHD challenges through an integrated, compassionate approach. We'll explore cognitive strategies, emotional wellness, and personalized growth techniques.\n\nWhat aspect of your journey would you like to focus on today? Type /commands to discover our holistic support paths."
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBillReminder, setShowBillReminder] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    setTimeout(() => {
      let response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: ""
      };

      const userInput = userMessage.content.toLowerCase();

      if (userInput === "/commands") {
        response.content = "Dynamic Bridge Holistic Support Commands:\n\n" +
          "- /commands – Explore our holistic support paths\n" +
          "- /start – Begin our comprehensive 8-step neurodivergent growth process\n" +
          "- /learn – Deep dive into ADHD neuroscience and adaptive strategies\n" +
          "- /visualize – Create empowering cognitive landscapes\n" +
          "- /commit – Design personalized growth and wellness goals\n" +
          "- /mindful – Integrated cognitive and emotional wellness tools\n" +
          "- /energize – Optimize motivation and personal energy management\n\n" +
          "Which path resonates with your growth journey today?";
      } else if (userInput === "/start") {
        response.content = "Welcome to your guided journey to overcome procrastination! We'll work through 8 steps together:\n\n" +
          "1. First, let's assess your current situation. What specific tasks do you find yourself procrastinating on the most?";
      } else if (userInput === "/learn") {
        response.content = "Understanding procrastination is the first step to overcoming it! Here's what science tells us:\n\n" +
          "Procrastination often stems from:\n" +
          "• Fear of failure or perfectionism\n" +
          "• Task aversion (finding tasks unpleasant)\n" +
          "• Poor time perception (common with ADHD)\n" +
          "• Executive function challenges\n\n" +
          "Would you like to dive deeper into any of these areas, or learn about effective habit formation techniques?";
      } else if (userInput === "/visualize") {
        response.content = "Let's create a mental image of your ideal productive self. Close your eyes for a moment and imagine:\n\n" +
          "You wake up feeling refreshed and energized. Your morning routine flows smoothly. You sit down to work and find yourself easily focusing on tasks, completing them one by one. Distractions seem less appealing. You feel a sense of accomplishment as you check items off your list.\n\n" +
          "What does this version of yourself look like? How do they feel? What's different about their environment?";
      } else if (userInput === "/commit") {
        response.content = "It's time to set concrete goals that will move you forward! Let's create a structured plan:\n\n" +
          "1. What's ONE specific goal you want to achieve in the next week?\n" +
          "2. What are three small steps you can take toward this goal?\n" +
          "3. What potential obstacles might come up, and how will you handle them?\n" +
          "4. How will you track your progress and hold yourself accountable?";
      } else if (userInput === "/relax") {
        response.content = "When we're stressed or overwhelmed, procrastination often increases. Let's practice a quick relaxation technique:\n\n" +
          "1. Take a deep breath in through your nose for 4 counts\n" +
          "2. Hold for 2 counts\n" +
          "3. Exhale slowly through your mouth for 6 counts\n" +
          "4. Repeat 3 more times\n\n" +
          "How do you feel? Remember, you can use this simple technique anytime you feel resistance to starting a task.";
      } else if (userInput === "/tracy") {
        response.content = "Bridge.it is part of the Dynamic Bridge ADHD program, offering specialized support:\n\n" +
          "• Bridge.it - Productivity and procrastination coaching\n" +
          "• Other Dynamic Bridge tools - Career development, mindfulness, and emotional wellbeing\n\n" +
          "Learn more about the Dynamic Bridge program at: https://dynamicbridge.com";
      } else {
        response.content = "Thank you for sharing that with me. Understanding your unique situation helps me provide better support.\n\n" +
          "Would you like to:\n" +
          "1. Explore specific strategies to overcome this challenge?\n" +
          "2. Learn more about the psychology behind it?\n" +
          "3. Start our structured 8-step process (type /start)?\n\n" +
          "Remember, I'm here to help in whatever way works best for you.";
      }

      setMessages((prev) => [...prev, response]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleCommandClick = (command: string) => {
    setInput(command);
    toast({
      title: "Command selected",
      description: `Type or press Enter to submit "${command}"`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {showBillReminder && <BillReminder />}
      
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-bubble ${
                message.role === "user" ? "user-bubble" : "assistant-bubble"
              }`}
            >
              {message.content.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          ))}
          {isProcessing && (
            <div className="chat-bubble assistant-bubble">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="px-4 md:px-6 py-2 bg-accent/10">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground pt-1.5">Quick commands:</span>
          {["/start", "/learn", "/visualize", "/commit", "/relax"].map((cmd) => (
            <Button
              key={cmd}
              variant="outline"
              size="sm"
              className="bg-background/50 text-xs font-mono"
              onClick={() => handleCommandClick(cmd)}
            >
              {cmd}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 border-t">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message or command..."
              className="flex-1"
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
    </div>
  );
};
