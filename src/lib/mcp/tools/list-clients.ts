import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "list_clients",
  title: "List clients",
  description: "List the content dashboards (clients) that belong to the signed-in user.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("clients")
      .select("id, name, area, objectives, tone, audience, platforms")
      .order("created_at");
    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data ?? []) }],
      structuredContent: { clients: data ?? [] },
    };
  },
});
