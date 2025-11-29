import { MainLayout } from "@/components/MainLayout";
import { ExecutiveGame as ExecutiveGameComponent } from "@/components/games/ExecutiveGame";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ExecutiveGame = () => {
  return (
    <MainLayout>
      <div className="container py-6 max-w-4xl">
        <div className="mb-4">
          <Link to="/games">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              חזרה למשחקים
            </Button>
          </Link>
        </div>
        
        <ExecutiveGameComponent />
      </div>
    </MainLayout>
  );
};

export default ExecutiveGame;
