
import { Message } from "@/types/chat";
import { Loader2 } from "lucide-react";

interface MessageBubbleProps {
  message?: Message;
  isLoading?: boolean;
}

export const MessageBubble = ({ message, isLoading }: MessageBubbleProps) => {
  if (isLoading) {
    return (
      <div className="chat-bubble assistant-bubble">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!message) return null;

  return (
    <div
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
  );
};
