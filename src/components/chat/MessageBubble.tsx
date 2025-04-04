
import { useState } from "react";
import { Message } from "@/types/chat";
import { Loader2, Trash, Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageBubbleProps {
  message?: Message;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
}

export const MessageBubble = ({ message, isLoading, onDelete, onEdit }: MessageBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  if (isLoading) {
    return (
      <div className="chat-bubble assistant-bubble">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!message) return null;

  const handleEditClick = () => {
    setEditedContent(message.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onEdit && editedContent.trim()) {
      onEdit(message.id, editedContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={`chat-bubble ${
        message.role === "user" ? "user-bubble" : "assistant-bubble"
      } relative group`}
    >
      {isEditing ? (
        <div className="space-y-2">
          <Textarea 
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px] w-full"
            dir="rtl"
          />
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              <X className="h-4 w-4 mr-1" /> ביטול
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              <Check className="h-4 w-4 mr-1" /> שמור
            </Button>
          </div>
        </div>
      ) : (
        <>
          {message.content.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
          
          {message.role === "user" && (
            <div className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
              {onEdit && (
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleEditClick}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(message.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
