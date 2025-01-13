import { supabase } from "@/integrations/supabase/client";

let apiKey: string | null = null;

export function setApiKey(key: string) {
  console.log("Setting API key in togetherAI service");
  apiKey = key;
}

export async function generateAIResponse(userMessage: string) {
  if (!apiKey) {
    console.error("API key not set in togetherAI service");
    throw new Error("API key not set");
  }

  console.log("Generating AI response with Together AI");
  try {
    const { data, error } = await supabase.functions.invoke('together-ai', {
      body: {
        messages: [
          {
            role: "system",
            content: "You are a compassionate and professional AI therapy assistant. Provide supportive, empathetic responses while maintaining appropriate boundaries and encouraging professional help when needed.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>", "<|eom_id|>"]
      }
    });

    if (error) throw error;
    console.log("Together AI response received:", data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in Together AI request:", error);
    throw new Error("Failed to generate AI response. Please check your API key and try again.");
  }
}