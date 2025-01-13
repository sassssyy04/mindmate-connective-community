import Together from "together-ai";

let apiKey: string | null = null;
let together: Together | null = null;

export function setApiKey(key: string) {
  console.log("Setting API key in togetherAI service");
  apiKey = key;
  together = new Together({ 
    apiKey: key
  });
}

export async function generateAIResponse(userMessage: string) {
  if (!apiKey || !together) {
    console.error("API key not set in togetherAI service");
    throw new Error("API key not set");
  }

  console.log("Generating AI response with Together AI");
  try {
    const response = await together.chat.completions.create({
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
    });

    console.log("Together AI response received:", response);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in Together AI request:", error);
    throw new Error("Failed to generate AI response. Please check your API key and try again.");
  }
}