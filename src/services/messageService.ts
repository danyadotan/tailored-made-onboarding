
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

export const saveMessageToSupabase = async (message: Message) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('messages').insert({
        user_id: user.id,
        role: message.role,
        content: message.content
      });
    }
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

export const getMessagesFromSupabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }
      
      // Transform the Supabase data to match our Message type
      return data.map((item) => ({
        id: item.id,
        role: item.role as "user" | "assistant" | "system",
        content: item.content
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const deleteMessageFromSupabase = async (messageId: string) => {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);
      
    if (error) {
      console.error("Error deleting message:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
};

export const updateMessageInSupabase = async (messageId: string, content: string) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', messageId);
      
    if (error) {
      console.error("Error updating message:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error updating message:", error);
    return false;
  }
};

export const setupRealtimeMessages = (onNewMessage: (message: Message) => void) => {
  const channel = supabase
    .channel('messages-changes')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        const newMessage = {
          id: payload.new.id,
          role: payload.new.role as "user" | "assistant" | "system",
          content: payload.new.content
        };
        onNewMessage(newMessage);
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};
