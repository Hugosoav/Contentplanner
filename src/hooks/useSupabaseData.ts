import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type ClientProfile } from "@/lib/client-data";
import { type ContentItem } from "@/lib/content-data";
import { type Suggestion } from "@/components/AISuggestions";

export function useSupabaseData() {
  const [userId, setUserId] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [contentByClient, setContentByClient] = useState<Record<string, ContentItem[]>>({});
  const [ideasByClient, setIdeasByClient] = useState<Record<string, Suggestion[]>>({});
  const [loading, setLoading] = useState(true);

  // Get user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load all data when userId is available
  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const loadAll = async () => {
      setLoading(true);
      try {
        // Load clients
        const { data: clientRows } = await supabase.from("clients").select("*").order("created_at");
        const loadedClients: ClientProfile[] = (clientRows || []).map((r: any) => ({
          id: r.id,
          name: r.name,
          area: r.area,
          objectives: r.objectives,
          tone: r.tone,
          audience: r.audience,
          platforms: r.platforms || [],
        }));
        setClients(loadedClients);
        if (loadedClients.length > 0) {
          setSelectedClient(loadedClients[0]);
        }

        // Load content items
        const { data: contentRows } = await supabase.from("content_items").select("*").order("created_at");
        const contentMap: Record<string, ContentItem[]> = {};
        (contentRows || []).forEach((r: any) => {
          const item: ContentItem = {
            id: r.id,
            title: r.title,
            description: r.description,
            status: r.status,
            pillar: r.pillar,
            platform: r.platform,
            date: r.date,
            time: r.time,
          };
          if (!contentMap[r.client_id]) contentMap[r.client_id] = [];
          contentMap[r.client_id].push(item);
        });
        setContentByClient(contentMap);

        // Load ideas
        const { data: ideaRows } = await supabase.from("ideas").select("*").order("created_at");
        const ideaMap: Record<string, Suggestion[]> = {};
        (ideaRows || []).forEach((r: any) => {
          const idea: Suggestion = {
            title: r.title,
            description: r.description,
            pillar: r.pillar,
            format: r.format,
            hook: r.hook,
            platform: "",
            suggestedDate: "",
          };
          if (!ideaMap[r.client_id]) ideaMap[r.client_id] = [];
          ideaMap[r.client_id].push(idea);
        });
        setIdeasByClient(ideaMap);
      } catch (e) {
        console.error("Error loading data:", e);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [userId]);

  const addClient = useCallback(async (client: ClientProfile) => {
    if (!userId) return;
    const { data, error } = await supabase.from("clients").insert({
      user_id: userId,
      name: client.name,
      area: client.area,
      objectives: client.objectives,
      tone: client.tone,
      audience: client.audience,
      platforms: client.platforms,
    }).select().single();
    if (error) throw error;
    const newClient: ClientProfile = {
      id: data.id,
      name: data.name,
      area: data.area,
      objectives: data.objectives,
      tone: data.tone,
      audience: data.audience,
      platforms: data.platforms || [],
    };
    setClients((prev) => [...prev, newClient]);
    setSelectedClient(newClient);
    return newClient;
  }, [userId]);

  const deleteClient = useCallback(async (id: string) => {
    await supabase.from("clients").delete().eq("id", id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    setContentByClient((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setIdeasByClient((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }, []);

  const saveContent = useCallback(async (clientId: string, item: ContentItem, isEdit: boolean) => {
    if (!userId) return;
    if (isEdit) {
      await supabase.from("content_items").update({
        title: item.title,
        description: item.description,
        status: item.status,
        pillar: item.pillar,
        platform: item.platform,
        date: item.date,
        time: item.time || null,
      }).eq("id", item.id);
      setContentByClient((prev) => ({
        ...prev,
        [clientId]: (prev[clientId] || []).map((i) => (i.id === item.id ? item : i)),
      }));
    } else {
      const { data, error } = await supabase.from("content_items").insert({
        user_id: userId,
        client_id: clientId,
        title: item.title,
        description: item.description,
        status: item.status,
        pillar: item.pillar,
        platform: item.platform,
        date: item.date,
        time: item.time || null,
      }).select().single();
      if (error) throw error;
      const newItem: ContentItem = { ...item, id: data.id };
      setContentByClient((prev) => ({
        ...prev,
        [clientId]: [...(prev[clientId] || []), newItem],
      }));
    }
  }, [userId]);

  const deleteContent = useCallback(async (clientId: string, contentId: string) => {
    await supabase.from("content_items").delete().eq("id", contentId);
    setContentByClient((prev) => ({
      ...prev,
      [clientId]: (prev[clientId] || []).filter((i) => i.id !== contentId),
    }));
  }, []);

  const moveContent = useCallback(async (clientId: string, contentId: string, newDate: string) => {
    await supabase.from("content_items").update({ date: newDate }).eq("id", contentId);
    setContentByClient((prev) => ({
      ...prev,
      [clientId]: (prev[clientId] || []).map((i) => i.id === contentId ? { ...i, date: newDate } : i),
    }));
  }, []);

  const addIdea = useCallback(async (clientId: string, suggestion: Suggestion) => {
    if (!userId) return;
    await supabase.from("ideas").insert({
      user_id: userId,
      client_id: clientId,
      title: suggestion.title,
      description: suggestion.description,
      pillar: suggestion.pillar,
      format: suggestion.format,
      hook: suggestion.hook,
    });
    setIdeasByClient((prev) => ({
      ...prev,
      [clientId]: [...(prev[clientId] || []), suggestion],
    }));
  }, [userId]);

  return {
    loading,
    userId,
    clients,
    selectedClient,
    setSelectedClient,
    contentByClient,
    ideasByClient,
    addClient,
    deleteClient,
    saveContent,
    deleteContent,
    moveContent,
    addIdea,
  };
}
