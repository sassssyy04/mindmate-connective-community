const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";

export async function generateAIResponse(userMessage: string) {
  const response = await fetch(TOGETHER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
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