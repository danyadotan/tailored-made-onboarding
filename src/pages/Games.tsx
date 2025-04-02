
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Focus, Zap, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Games = () => {
  const games = [
    {
      id: "executive",
      title: "אימון תפקודים ניהוליים",
      description: "סדרת משחקים המיועדים לחזק זיכרון עבודה, גמישות קוגניטיבית ובקרת אימפולסים",
      icon: <Brain className="h-8 w-8 text-primary" />,
      status: "available"
    },
    {
      id: "time",
      title: "כיול תפיסת זמן",
      description: "תרגילים אינטראקטיביים לשיפור הערכת זמן והפחתת הטיות אישיות",
      icon: <Clock className="h-8 w-8 text-primary" />,
      status: "coming-soon"
    },
    {
      id: "focus",
      title: "אימון קשב מתמשך",
      description: "משחקים ותרגילים לשיפור היכולת לשמור על מיקוד וריכוז לאורך זמן",
      icon: <Focus className="h-8 w-8 text-primary" />,
      status: "coming-soon"
    },
    {
      id: "motivation",
      title: "מערכת אנרגיה ומוטיבציה",
      description: "כלים אינטראקטיביים לניהול אופטימלי של רמות אנרגיה ומוטיבציה",
      icon: <Zap className="h-8 w-8 text-primary" />,
      status: "coming-soon"
    },
    {
      id: "goals",
      title: "התמודדות עם יעדים",
      description: "טכניקות אינטראקטיביות לפירוק והשגת יעדים מורכבים",
      icon: <Target className="h-8 w-8 text-primary" />,
      status: "coming-soon"
    }
  ];

  return (
    <MainLayout>
      <div className="container py-6 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">משחקים אינטראקטיביים</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            משחקים קוגניטיביים מבוססי מדע המתוכננים לחזק תפקודים ניהוליים ולגשר על פערים קוגניטיביים מרכזיים בADHD
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="flex flex-col overflow-hidden border border-accent/40">
              <CardHeader className="pb-2 flex flex-row items-center gap-3">
                {game.icon}
                <div>
                  <CardTitle className="text-lg">{game.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <CardDescription className="text-foreground/80">
                  {game.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                {game.status === "available" ? (
                  <Link to={`/games/${game.id}`} className="w-full">
                    <Button className="w-full" variant="default">
                      התחל
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    מגיע בקרוב
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Games;
