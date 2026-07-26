import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";

/** Supabase client scoped to the MCP caller so RLS runs as that user. */
export function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function unauthenticated() {
  return {
    content: [{ type: "text" as const, text: "Not authenticated. Connect this MCP server with your Sincro account." }],
    isError: true,
  };
}
