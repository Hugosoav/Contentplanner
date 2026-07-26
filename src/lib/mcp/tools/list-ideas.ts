import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "list_ideas",
  title: "List saved ideas",
  description: "List the ideas saved in the idea bank for the signed-in user.",
  inputSchema: {
    client_id: z.string().optional().describe("Only return ideas for this client id."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ client_id }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let query = supabaseForUser(ctx)
      .from("ideas")
      .select("id, client_id, title, description, pillar, format, hook")
      .order("created_at");
    if (client_id) query = query.eq("client_id", client_id);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data ?? []) }],
      structuredContent: { ideas: data ?? [] },
    };
  },
});
