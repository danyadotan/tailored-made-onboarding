
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Smile, Frown, Eye, Skull } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type GameState = "ready" | "playing" | "caught" | "success";

export const ExecutiveGame = () => {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [stressLevel, setStressLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [executivePosition, setExecutivePosition] = useState({ x: 0, y: 0 });
  const [executiveDirection, setExecutiveDirection] = useState({ x: 1, y: 1 });
  const [speed, setSpeed] = useState(2);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const executiveRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const { toast } = useToast();

  // Game timer
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameState("success");
          toast({
            title: "Success! You made it!",
            description: "You survived the executive meeting without being noticed!",
          });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, toast]);

  // Move the executive
  const moveExecutive = () => {
    if (gameState !== "playing" || !gameAreaRef.current || !executiveRef.current) return;
    
    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    const executiveRect = executiveRef.current.getBoundingClientRect();
    
    let newX = executivePosition.x + executiveDirection.x * speed;
    let newY = executivePosition.y + executiveDirection.y * speed;
    
    // Check boundaries
    if (newX < 0 || newX > gameAreaRect.width - executiveRect.width) {
      setExecutiveDirection(prev => ({ ...prev, x: -prev.x }));
      newX = executivePosition.x;
    }
    
    if (newY < 0 || newY > gameAreaRect.height - executiveRect.height) {
      setExecutiveDirection(prev => ({ ...prev, y: -prev.y }));
      newY = executivePosition.y;
    }
    
    setExecutivePosition({ x: newX, y: newY });
    animationRef.current = requestAnimationFrame(moveExecutive);
  };

  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(moveExecutive);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState, executivePosition, executiveDirection, speed]);

  // Check for collision
  useEffect(() => {
    const checkCollision = (e: MouseEvent) => {
      if (gameState !== "playing" || !executiveRef.current) return;
      
      const executiveRect = executiveRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const distance = Math.sqrt(
        Math.pow((executiveRect.left + executiveRect.width/2) - mouseX, 2) +
        Math.pow((executiveRect.top + executiveRect.height/2) - mouseY, 2)
      );
      
      // If mouse is very close to executive
      if (distance < 70) {
        setStressLevel(prev => {
          const newLevel = prev + 5;
          if (newLevel >= 100) {
            setGameState("caught");
            toast({
              title: "Oh no! Busted!",
              description: "The executive caught you not acting 'normal' enough!",
              variant: "destructive"
            });
          }
          return Math.min(newLevel, 100);
        });
      } else {
        setStressLevel(prev => Math.max(prev - 0.5, 0));
      }
    };
    
    if (gameState === "playing") {
      document.addEventListener("mousemove", checkCollision);
    }
    
    return () => document.removeEventListener("mousemove", checkCollision);
  }, [gameState, toast]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(30);
    setStressLevel(0);
    setSpeed(2);
    
    // Random starting position
    if (gameAreaRef.current) {
      const width = gameAreaRef.current.clientWidth;
      const height = gameAreaRef.current.clientHeight;
      setExecutivePosition({
        x: Math.random() * (width - 50),
        y: Math.random() * (height - 50)
      });
    }
    
    // Random direction
    setExecutiveDirection({
      x: Math.random() > 0.5 ? 1 : -1,
      y: Math.random() > 0.5 ? 1 : -1
    });
    
    toast({
      title: "Game started!",
      description: "Stay calm and act normal for 30 seconds!",
    });
  };

  const resetGame = () => {
    setGameState("ready");
    setStressLevel(0);
    setTimeLeft(30);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-slate-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Be Ware: An Executive (Ass)hole</h2>
        <p className="text-sm text-muted-foreground mb-4">
          A humorous game about the stress of "masking" in professional environments. Your goal is to avoid
          the executive's attention and act "normal" for 30 seconds. Don't let your stress level get too high!
        </p>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium mr-2">Stress Level:</span>
            <Progress value={stressLevel} className="w-40 h-3" />
          </div>
          
          <div className="flex items-center">
            <span className="font-medium mr-2">Time Left:</span>
            <span className="font-mono">{timeLeft}s</span>
          </div>
        </div>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="relative bg-white border rounded-lg shadow-md h-96 overflow-hidden"
        style={{ cursor: gameState === "playing" ? "none" : "default" }}
      >
        {gameState === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Ready to Play?</h3>
            <p className="text-center max-w-md mb-4">
              Move your cursor carefully to avoid the executive's attention.
              <br />Stay far away from them to keep your stress level low!
            </p>
            <Button onClick={startGame}>Start Game</Button>
          </div>
        )}
        
        {gameState === "caught" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/20 backdrop-blur-sm">
            <Frown className="h-10 w-10 text-destructive mb-4" />
            <h3 className="text-xl font-bold mb-2">Busted!</h3>
            <p className="text-center max-w-md mb-4">
              The executive caught you not acting "normal" enough!
              Your stress level went through the roof.
            </p>
            <Button onClick={resetGame}>Try Again</Button>
          </div>
        )}
        
        {gameState === "success" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 backdrop-blur-sm">
            <Smile className="h-10 w-10 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Victory!</h3>
            <p className="text-center max-w-md mb-4">
              You made it through the entire meeting without attracting unwanted attention.
              Well done on your "masking" skills!
            </p>
            <Button onClick={resetGame}>Play Again</Button>
          </div>
        )}
        
        {gameState === "playing" && (
          <div 
            ref={executiveRef}
            className="absolute flex flex-col items-center justify-center"
            style={{ 
              left: `${executivePosition.x}px`, 
              top: `${executivePosition.y}px`,
              transition: "box-shadow 0.3s ease"
            }}
          >
            <div className="relative">
              <Skull className="h-12 w-12 text-gray-700" />
              <Eye className="h-6 w-6 text-red-500 absolute top-3 left-3 animate-pulse" />
            </div>
            <span className="text-xs font-bold mt-1 whitespace-nowrap bg-white px-1 rounded">EXECUTIVE</span>
          </div>
        )}
      </div>
      
      {gameState === "playing" && (
        <p className="text-sm text-muted-foreground italic text-center">
          Keep your cursor away from the executive! They're watching...
        </p>
      )}
    </div>
  );
};
