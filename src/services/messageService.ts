
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
        role: item.role,
        content: item.content
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};
