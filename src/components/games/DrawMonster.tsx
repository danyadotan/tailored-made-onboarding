
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, DownloadIcon, RotateCcw, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DrawMonster = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const { toast } = useToast();

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        setContext(ctx);
        
        // Fill canvas with white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  // Update context when color or brush size changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }
  }, [color, brushSize, context]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (context) {
      context.beginPath();
      
      // Get coordinates
      let x, y;
      if ('touches' in e) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        }
      } else {
        x = e.nativeEvent.offsetX;
        y = e.nativeEvent.offsetY;
      }
      
      if (x !== undefined && y !== undefined) {
        context.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    // Get coordinates
    let x, y;
    if ('touches' in e) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      }
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    if (x !== undefined && y !== undefined) {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      toast({
        title: "Canvas cleared",
        description: "Start creating your monster from scratch",
      });
    }
  };

  const downloadDrawing = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "my-monster.png";
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
      toast({
        title: "Monster saved!",
        description: "You can laugh about it later",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-slate-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Draw Your Least Favorite Monster</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Visualizing your "monsters" (fears, obstacles, or challenges) can help you process and laugh at them later.
          Give shape to what holds you back, then download it to reflect on how these obstacles aren't as scary as they seem.
        </p>
      </div>
      
      <div className="bg-white border rounded-lg shadow-md overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="w-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center space-x-2">
          <label htmlFor="color-picker" className="flex items-center">
            <Palette className="h-4 w-4 mr-1" />
            <span className="sr-only">Choose color</span>
          </label>
          <input 
            id="color-picker"
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="brush-size">Brush size:</label>
          <input 
            id="brush-size"
            type="range" 
            min="1" 
            max="20" 
            value={brushSize} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
        
        <div className="ml-auto flex space-x-2">
          <Button variant="outline" onClick={clearCanvas}>
            <Eraser className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button onClick={downloadDrawing}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Save Monster
          </Button>
        </div>
      </div>
    </div>
  );
};
