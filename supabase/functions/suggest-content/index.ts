import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { clientProfile, month, existingContent } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Você é um estrategista de conteúdo digital especializado. Sua tarefa é sugerir conteúdos estratégicos mensais personalizados.

Retorne EXATAMENTE um JSON com a estrutura usando tool calling. Gere 8 sugestões de conteúdo variadas, distribuídas ao longo do mês, cobrindo diferentes pilares (educativo, autoridade, engajamento, vendas, bastidores) e plataformas relevantes.

Cada sugestão deve ter:
- title: título chamativo e específico
- description: descrição detalhada de 1-2 frases
- pillar: um dos pilares (educativo, autoridade, engajamento, vendas, bastidores)
- platform: uma das plataformas do cliente
- suggestedDate: uma data no formato YYYY-MM-DD dentro do mês
- format: formato do conteúdo (carrossel, reels, stories, post, artigo, vídeo longo, thread)
- hook: gancho ou headline chamativa para o conteúdo`;

    const userPrompt = `Perfil do Cliente:
- Nome: ${clientProfile.name}
- Área de atuação: ${clientProfile.area}
- Objetivos estratégicos do mês: ${clientProfile.objectives}
- Tom de voz: ${clientProfile.tone}
- Público-alvo: ${clientProfile.audience}
- Plataformas: ${clientProfile.platforms.join(", ")}

Mês: ${month}

Conteúdos já planejados: ${existingContent?.length ? existingContent.map((c: any) => c.title).join(", ") : "Nenhum"}

Gere 8 sugestões de conteúdo estratégico para este cliente, considerando o perfil, tom de voz e objetivos. Distribua entre os pilares e plataformas de forma equilibrada.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_content",
              description: "Return strategic content suggestions for the month",
              parameters: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        pillar: { type: "string", enum: ["educativo", "autoridade", "engajamento", "vendas", "bastidores"] },
                        platform: { type: "string", enum: ["instagram", "linkedin", "tiktok", "youtube", "blog"] },
                        suggestedDate: { type: "string" },
                        format: { type: "string" },
                        hook: { type: "string" },
                      },
                      required: ["title", "description", "pillar", "platform", "suggestedDate", "format", "hook"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["suggestions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_content" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione fundos nas configurações." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao gerar sugestões" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "Resposta inesperada da IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const suggestions = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("suggest-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
