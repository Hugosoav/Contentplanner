import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "create_idea",
  title: "Save idea",
  description: "Save a content idea to a client's idea bank for the signed-in user.",
  inputSchema: {
    client_id: z.string().describe("Client id the idea belongs to (see list_clients)."),
    title: z.string().trim().min(1).describe("Idea title."),
    description: z.string().default("").describe("What the idea is about."),
    pillar: z
      .enum(["educativo", "autoridade", "engajamento", "vendas", "bastidores"])
      .describe("Content pillar."),
    format: z.string().default("").describe("Format, e.g. Reels, Carrossel, Artigo."),
    hook: z.string().default("").describe("Opening hook for the content."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("ideas")
      .insert({
        user_id: ctx.getUserId(),
        client_id: input.client_id,
        title: input.title,
        description: input.description ?? "",
        pillar: input.pillar,
        format: input.format ?? "",
        hook: input.hook ?? "",
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    return {
      content: [{ type: "text" as const, text: `Saved idea "${data.title}".` }],
      structuredContent: { idea: data },
    };
  },
});
