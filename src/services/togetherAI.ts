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
  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "meta-llama/Llama-2-70b-chat-hf",
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
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    console.error("Together AI API error:", response.status, response.statusText);
    throw new Error("Failed to generate AI response");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}