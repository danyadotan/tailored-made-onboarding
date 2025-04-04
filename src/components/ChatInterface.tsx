
import { useState, useRef, useEffect } from "react";
import { BillReminder } from "@/components/BillReminder";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { CommandButtons } from "@/components/chat/CommandButtons";
import { MessageInput } from "@/components/chat/MessageInput";
import { ADHDProfile, Message } from "@/types/chat";
import { generateResponse } from "@/utils/responseGenerator";
import { 
  saveMessageToSupabase, 
  getMessagesFromSupabase, 
  deleteMessageFromSupabase,
  updateMessageInSupabase,
  setupRealtimeMessages
} from "@/services/messageService";
import { useToast } from "@/hooks/use-toast";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
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

  // Load messages from Supabase on component mount
  useEffect(() => {
    const loadMessages = async () => {
      const savedMessages = await getMessagesFromSupabase();
      
      // If no messages found, add welcome message
      if (savedMessages.length === 0) {
        const welcomeMessage: Message = {
          id: "welcome",
          role: "assistant",
          content: "ברוך הבא ל-Bridge-IT: שותף להתמודדות עם ADHD 🌈\n\nאני מערכת תמיכה מקיפה, שנועדה לגשר על פערים קוגניטיביים ולהפחית את התחלואה הנלווית ל-ADHD. אנחנו נעבוד יחד על אסטרטגיות קוגניטיביות, רווחה רגשית, וטכניקות צמיחה מותאמות אישית.\n\nעל איזה היבט בהתמודדות שלך תרצה להתמקד היום? הקלד /commands כדי לגלות את מסלולי התמיכה ההוליסטיים שלנו."
        };
        setMessages([welcomeMessage]);
        await saveMessageToSupabase(welcomeMessage);
      } else {
        setMessages(savedMessages);
      }
    };
    
    loadMessages();
  }, []);

  // Setup realtime listener for new messages
  useEffect(() => {
    const cleanup = setupRealtimeMessages((newMessage) => {
      setMessages((prevMessages) => {
        // Check if this message is already in our state
        if (!prevMessages.find(m => m.id === newMessage.id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });
    
    return cleanup;
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageSubmit = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Save user message to Supabase
    await saveMessageToSupabase(userMessage);

    // Create a function within setTimeout to handle async operations
    setTimeout(() => {
      const processResponse = async () => {
        // Generate response
        const response = generateResponse(userMessage, userProfile);
        
        // Update messages state
        setMessages((prev) => [...prev, response]);
        setIsProcessing(false);
        
        // Save assistant response to Supabase
        await saveMessageToSupabase(response);
      };

      // Execute the async function to process the response
      processResponse();
    }, 1500);
  };

  const handleCommandClick = (command: string) => {
    handleMessageSubmit(command);
  };

  const handleDeleteMessage = async (messageId: string) => {
    const success = await deleteMessageFromSupabase(messageId);
    if (success) {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      toast({
        title: "ההודעה נמחקה",
        description: "ההודעה נמחקה בהצלחה",
      });
    } else {
      toast({
        title: "שגיאה במחיקת הודעה",
        description: "לא ניתן היה למחוק את ההודעה, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    const success = await updateMessageInSupabase(messageId, newContent);
    if (success) {
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === messageId ? { ...msg, content: newContent } : msg
        )
      );
      toast({
        title: "ההודעה עודכנה",
        description: "ההודעה עודכנה בהצלחה",
      });
    } else {
      toast({
        title: "שגיאה בעדכון הודעה",
        description: "לא ניתן היה לעדכן את ההודעה, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {showBillReminder && <BillReminder />}
      
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-b from-background to-background/80">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message}
              onDelete={message.role === "user" ? handleDeleteMessage : undefined}
              onEdit={message.role === "user" ? handleEditMessage : undefined}
            />
          ))}
          {isProcessing && <MessageBubble isLoading />}
          <div ref={chatEndRef} />
        </div>
      </div>

      <CommandButtons onCommandClick={handleCommandClick} />
      
      <MessageInput 
        onSubmit={handleMessageSubmit}
        isProcessing={isProcessing}
      />
    </div>
  );
};
