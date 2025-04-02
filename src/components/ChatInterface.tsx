
import { useState, useRef, useEffect } from "react";
import { BillReminder } from "@/components/BillReminder";
import { supabase } from "@/integrations/supabase/client";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { CommandButtons } from "@/components/chat/CommandButtons";
import { MessageInput } from "@/components/chat/MessageInput";
import { ADHDProfile, Message } from "@/types/chat";
import { generateResponse } from "@/utils/responseGenerator";

export const ChatInterface = () => {
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessageToSupabase = async (message: Message) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // We're still using todos table since we're having issues with the messages table
        await supabase.from('todos').insert({
          user_id: user.id,
          title: `Chat: ${message.role}`,
          description: message.content
        });
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

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

  return (
    <div className="flex flex-col h-full">
      {showBillReminder && <BillReminder />}
      
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-b from-background to-background/80">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
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
