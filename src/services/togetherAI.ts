let apiKey: string | null = null;

export function setApiKey(key: string) {
  apiKey = key;
}

export async function generateAIResponse(userMessage: string) {
  if (!apiKey) {
    throw new Error("API key not set");
  }

  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "togethercomputer/llama-2-70b-chat",
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
    throw new Error("Failed to generate AI response");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}