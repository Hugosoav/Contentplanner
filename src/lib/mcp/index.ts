import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listClientsTool from "./tools/list-clients";
import listContentTool from "./tools/list-content";
import createContentTool from "./tools/create-content";
import listIdeasTool from "./tools/list-ideas";
import createIdeaTool from "./tools/create-idea";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "sincro-mcp",
  title: "Sincro",
  version: "0.1.0",
  instructions:
    "Tools for Sincro, a multi-client content planning platform. Use `list_clients` to discover the signed-in user's client dashboards, then `list_content` / `create_content` for the editorial calendar and `list_ideas` / `create_idea` for the idea bank. Always pass a client_id from list_clients.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listClientsTool, listContentTool, createContentTool, listIdeasTool, createIdeaTool],
});
