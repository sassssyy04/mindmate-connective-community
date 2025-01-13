import { serve } from "https://deno.fresh.run/std@0.204.0/http/server.ts"

const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, max_tokens, temperature, top_p, top_k, repetition_penalty, stop } = await req.json()
    
    const response = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('together_ai')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        max_tokens,
        temperature,
        top_p,
        top_k,
        repetition_penalty,
        stop,
      }),
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})