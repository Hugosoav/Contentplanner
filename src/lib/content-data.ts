export type ContentStatus = "draft" | "scheduled" | "published" | "idea";
export type ContentPillar = "educativo" | "autoridade" | "engajamento" | "vendas" | "bastidores";
export type ContentPlatform = "instagram" | "linkedin" | "tiktok" | "youtube" | "blog";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  pillar: ContentPillar;
  platform: ContentPlatform;
  date: string; // ISO date
  time?: string;
}

export const pillarColors: Record<ContentPillar, string> = {
  educativo: "bg-info",
  autoridade: "bg-accent",
  engajamento: "bg-success",
  vendas: "bg-warning",
  bastidores: "bg-muted-foreground",
};

export const pillarLabels: Record<ContentPillar, string> = {
  educativo: "Educativo",
  autoridade: "Autoridade",
  engajamento: "Engajamento",
  vendas: "Vendas",
  bastidores: "Bastidores",
};

export const statusLabels: Record<ContentStatus, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  published: "Publicado",
  idea: "Ideia",
};

export const platformLabels: Record<ContentPlatform, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
  blog: "Blog",
};
