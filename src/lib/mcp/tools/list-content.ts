import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "list_content",
  title: "List scheduled content",
  description:
    "List planned content items for the signed-in user, optionally filtered by client, status or date range (YYYY-MM-DD).",
  inputSchema: {
    client_id: z.string().optional().describe("Only return content for this client id."),
    status: z.string().optional().describe("Filter by status: draft, scheduled, published or idea."),
    from: z.string().optional().describe("Earliest date, YYYY-MM-DD."),
    to: z.string().optional().describe("Latest date, YYYY-MM-DD."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ client_id, status, from, to }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let query = supabaseForUser(ctx)
      .from("content_items")
      .select("id, client_id, title, description, status, pillar, platform, date, time")
      .order("date");
    if (client_id) query = query.eq("client_id", client_id);
    if (status) query = query.eq("status", status);
    if (from) query = query.gte("date", from);
    if (to) query = query.lte("date", to);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data ?? []) }],
      structuredContent: { items: data ?? [] },
    };
  },
});
