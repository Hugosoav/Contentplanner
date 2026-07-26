import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "create_content",
  title: "Create content item",
  description: "Schedule a new content item on a client's calendar for the signed-in user.",
  inputSchema: {
    client_id: z.string().describe("Client id the content belongs to (see list_clients)."),
    title: z.string().trim().min(1).describe("Content title."),
    description: z.string().default("").describe("Short brief or copy for the post."),
    status: z
      .enum(["draft", "scheduled", "published", "idea"])
      .default("draft")
      .describe("Workflow status."),
    pillar: z
      .enum(["educativo", "autoridade", "engajamento", "vendas", "bastidores"])
      .describe("Content pillar."),
    platform: z
      .enum(["instagram", "linkedin", "tiktok", "youtube", "blog"])
      .describe("Target platform."),
    date: z.string().describe("Publish date, YYYY-MM-DD."),
    time: z.string().optional().describe("Publish time, HH:MM."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("content_items")
      .insert({
        user_id: ctx.getUserId(),
        client_id: input.client_id,
        title: input.title,
        description: input.description ?? "",
        status: input.status ?? "draft",
        pillar: input.pillar,
        platform: input.platform,
        date: input.date,
        time: input.time || null,
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text" as const, text: error.message }], isError: true };
    return {
      content: [{ type: "text" as const, text: `Created content "${data.title}" on ${data.date}.` }],
      structuredContent: { item: data },
    };
  },
});
