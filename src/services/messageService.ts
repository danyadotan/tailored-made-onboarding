
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

export const saveMessageToSupabase = async (message: Message) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
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
