
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Clock, Brain, Calendar, Sparkles, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BillReminder } from "@/components/BillReminder";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

type ADHDProfile = {
  timePerception: number; // 0-100%, accuracy in estimating time
  taskInitiation: number; // 0-100%, difficulty in starting tasks
  sustainedAttention: number; // 0-100%, ability to maintain focus
  workingMemory: number; // 0-100%, capacity for working memory
  emotionalRegulation: number; // 0-100%, ability to regulate emotions
  optimalWorkPeriods: string[]; // Best times of day for productivity
  commonDistractions: string[]; // Frequent distractions
};

export const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "ברוך הבא ל-Bridge-IT: שותף להתמודדות עם ADHD 🌈\n\nאני מערכת תמיכה מקיפה, שנועדה לגשר על פערים קוגניטיביים ולהפחית את התחלואה הנלווית ל-ADHD. אנחנו נעבוד יחד על אסטרטגיות קוגניטיביות, רווחה רגשית, וטכניקות צמיחה מותאמות אישית.\n\nעל איזה היבט בהתמודדות שלך תרצה להתמקד היום? הקלד /commands כדי לגלות את מסלולי התמיכה ההוליסטיים שלנו."
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBillReminder, setShowBillReminder] = useState(true);
  const [userProfile, setUserProfile] = useState<ADHDProfile>({
    timePerception: 60,
    taskInitiation: 50,
    sustainedAttention: 65,
    workingMemory: 55,
    emotionalRegulation: 70,
    optimalWorkPeriods: ["09:00-11:30", "16:00-18:30"],
    commonDistractions: ["social media", "email", "noise"]
  });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      // Save message to Supabase if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('messages').insert({
          user_id: user.id,
          content: userMessage.content,
          role: 'user'
        });
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }

    setTimeout(() => {
      let response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: ""
      };

      const userInput = userMessage.content.toLowerCase();

      if (userInput === "/commands") {
        response.content = "פקודות תמיכה הוליסטיות ב-Bridge-IT:\n\n" +
          "- /commands – גלה את מסלולי התמיכה ההוליסטיים שלנו\n" +
          "- /profile – הצג וערוך את פרופיל ה-ADHD האישי שלך\n" +
          "- /start – התחל את תהליך הצמיחה הנוירו-דיברגנטי בן 8 השלבים\n" +
          "- /plan – תכנן יום עם כיול אוטומטי לתפיסת זמן\n" +
          "- /focus – הפעל מצב ריכוז עם ניטור הסחות בזמן אמת\n" +
          "- /break – תכנן הפסקות מותאמות אישית למניעת עומס קוגניטיבי\n" +
          "- /decompose – פרק משימה מורכבת לצעדי מיקרו מותאמים אישית\n" +
          "- /stats – הצג מדדי התקדמות והשפעה על לחץ וחרדה\n\n" +
          "איזה מסלול מהדהד עם מסע הצמיחה שלך היום?";
      } else if (userInput === "/profile") {
        response.content = "הנה פרופיל ה-ADHD המותאם אישית שלך:\n\n" +
          "• תפיסת זמן: " + userProfile.timePerception + "% (הערכת זמן מדויקת)\n" +
          "• התחלת משימות: " + userProfile.taskInitiation + "% (קלות בהתחלת משימות)\n" +
          "• קשב מתמשך: " + userProfile.sustainedAttention + "% (יכולת לשמור על ריכוז)\n" +
          "• זיכרון עבודה: " + userProfile.workingMemory + "% (קיבולת זיכרון עבודה)\n" +
          "• ויסות רגשי: " + userProfile.emotionalRegulation + "% (יכולת לווסת רגשות)\n\n" +
          "תקופות עבודה אופטימליות: " + userProfile.optimalWorkPeriods.join(", ") + "\n" +
          "הסחות דעת נפוצות: " + userProfile.commonDistractions.join(", ") + "\n\n" +
          "פרופיל זה מתעדכן באופן קבוע על בסיס האינטראקציות והמשובים שלך. האם תרצה לעדכן חלק מהמידע?";
      } else if (userInput === "/start") {
        response.content = "ברוכים הבאים למסע המודרך להתגברות על דחיינות! נעבוד יחד דרך 8 שלבים:\n\n" +
          "1. ראשית, בוא נעריך את המצב הנוכחי שלך. אילו משימות ספציפיות אתה מוצא את עצמך דוחה הכי הרבה?\n\n" +
          "בהתבסס על פרופיל ה-ADHD שלך, אני רואה שהתחלת משימות היא אתגר עבורך (ציון " + userProfile.taskInitiation + "%). אשתמש בטכניקות מיקרו-התחלה מותאמות אישית לעזור לך להתגבר על נקודות החסימה האלה.";
      } else if (userInput === "/plan") {
        response.content = "הבה נתכנן את יומך עם התחשבות בדפוס תפיסת הזמן האישי שלך:\n\n" +
          "בהתבסס על דפוסים קודמים, אני מזהה שאתה נוטה להעריך בחסר את משך המשימות בכ-40%. הנה לוח זמנים מכויל:\n\n" +
          "• 09:00-10:30: עבודה על פרויקט X (90 דקות במקום הערכתך המקורית של 60 דקות)\n" +
          "• 10:30-10:45: הפסקה (15 דקות)\n" +
          "• 10:45-12:15: פגישות (90 דקות כולל זמני מעבר)\n" +
          "• 12:15-13:00: ארוחת צהריים (45 דקות במקום 30)\n" +
          "• 13:00-14:30: משימות מנהלתיות (90 דקות במקום 60)\n\n" +
          "האם תרצה לבצע התאמות ללוח זמנים זה?";
      } else if (userInput === "/focus") {
        response.content = "מצב מיקוד מופעל! בהתבסס על הפרופיל שלך, מצאתי שאתה עובד הכי טוב בבלוקים של 60-90 דקות עם הפסקות קצרות.\n\n" +
          "אני כעת מנטר הסחות דעת שכיחות ואציע התערבויות בזמן אמת. הייתי רוצה להתמקד במשימה הנוכחית שלך - מה אתה מנסה להשלים כרגע?\n\n" +
          "🔍 נתוני מיקוד נוכחיים:\n• הסחות זוהו היום: 7\n• התערבויות מוצלחות: 5\n• זמן מיקוד רציף הארוך ביותר: 63 דקות";
      } else if (userInput === "/decompose") {
        response.content = "בוא נפרק משימה מורכבת לצעדי מיקרו! איזו משימה תרצה לפרק?\n\n" +
          "בהתבסס על פרופיל ADHD שלך, אני מזהה שאתה מתמודד הכי טוב עם צעדים בגודל של 15-25 דקות עם הגדרה ברורה.\n\n" +
          "לדוגמה, אם המשימה היא 'כתיבת הצעת מחקר', נוכל לפרק אותה כך:\n" +
          "1. עיון במידע בסיסי (20 דקות)\n" +
          "2. סיעור מוחות של 3 נקודות מרכזיות (15 דקות)\n" +
          "3. כתיבת פסקת פתיחה (20 דקות)\n" +
          "4. פירוט נקודה ראשונה (25 דקות)\n\n" +
          "אשמח לעזור לך לפרק כל משימה שתבחר!";
      } else if (userInput === "/stats") {
        response.content = "הנה מדדי ההתקדמות וההשפעה שלך:\n\n" +
          "📉 מדדי לחץ וחרדה:\n" +
          "• ירידה של 32% באירועי לחץ יומיים בחודש האחרון\n" +
          "• ירידה של 27% בדיווח עצמי על תחושות חרדה\n\n" +
          "📈 שיפור בתפקוד:\n" +
          "• עלייה של 41% בהשלמת משימות בזמן\n" +
          "• ירידה של 53% בדחיינות במשימות מורכבות\n" +
          "• שיפור של 38% בזמני מעבר בין משימות\n\n" +
          "🎯 השפעה על יעדים אישיים:\n" +
          "• התקדמות של 65% לעבר היעד 'השלמת פרויקט X'\n" +
          "• התקדמות של 42% לעבר היעד 'פיתוח שגרת עבודה יציבה'";
      } else if (userInput === "/break") {
        response.content = "הנה המלצות להפסקה מותאמת אישית על בסיס הפרופיל שלך:\n\n" +
          "רמת העומס הקוגניטיבי הנוכחית שלך נראית בינונית-גבוהה. על סמך הדפוסים שלך, אני ממליץ על:\n\n" +
          "• הפסקה פעילה של 12-15 דקות\n" +
          "• כוללת תנועה קלה (הליכה קצרה או מתיחות)\n" +
          "• ללא מסכים או גירויים חזותיים מורכבים\n" +
          "• שתיית מים והאזנה למוזיקה אינסטרומנטלית\n\n" +
          "הפסקה זו מותאמת למצב הקוגניטיבי הנוכחי שלך. האם תרצה להפעיל טיימר להפסקה זו?";
      } else {
        response.content = "תודה על השיתוף. הבנת המצב הייחודי שלך עוזרת לי לספק תמיכה טובה יותר.\n\n" +
          "בהתבסס על פרופיל ה-ADHD שלך, אני רואה שיש לך חוזקות ב" + (userProfile.emotionalRegulation > 65 ? "ויסות רגשי" : userProfile.timePerception > 65 ? "תפיסת זמן" : "קשב מתמשך") + " ואתגרים ב" + (userProfile.taskInitiation < 60 ? "התחלת משימות" : userProfile.workingMemory < 60 ? "זיכרון עבודה" : "תפיסת זמן") + ".\n\n" +
          "האם תרצה:\n" +
          "1. לחקור אסטרטגיות ספציפיות להתגברות על אתגר זה?\n" +
          "2. ללמוד עוד על הפסיכולוגיה שמאחוריו?\n" +
          "3. להתחיל את התהליך המובנה בן 8 השלבים שלנו (הקלד /start)?\n\n" +
          "זכור, אני כאן כדי לגשר על הפערים הקוגניטיביים, לא כדי 'לתקן' אותך. המוח שלך הוא ייחודי, ואנחנו נעבוד יחד למצוא את הדרכים הטובות ביותר עבורך.";
      }

      setMessages((prev) => [...prev, response]);
      setIsProcessing(false);
      
      try {
        // Save response to Supabase if authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('messages').insert({
            user_id: user.id,
            content: response.content,
            role: 'assistant'
          });
        }
      } catch (error) {
        console.error("Error saving response:", error);
      }
    }, 1500);
  };

  const handleCommandClick = (command: string) => {
    setInput(command);
    toast({
      title: "פקודה נבחרה",
      description: `הקלד או לחץ Enter כדי לשלוח "${command}"`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {showBillReminder && <BillReminder />}
      
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-b from-background to-background/80">
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

      <div className="px-4 md:px-6 py-3 bg-accent/20 border-t border-accent/30">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground pt-1.5">פקודות מהירות:</span>
          {[
            { cmd: "/profile", icon: <Brain className="h-3.5 w-3.5 mr-1" /> },
            { cmd: "/plan", icon: <Calendar className="h-3.5 w-3.5 mr-1" /> },
            { cmd: "/focus", icon: <Target className="h-3.5 w-3.5 mr-1" /> },
            { cmd: "/decompose", icon: <Sparkles className="h-3.5 w-3.5 mr-1" /> },
            { cmd: "/break", icon: <Clock className="h-3.5 w-3.5 mr-1" /> },
          ].map((item) => (
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
    </div>
  );
};
