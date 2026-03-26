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

export const sampleContent: ContentItem[] = [
  { id: "1", title: "5 dicas de produtividade", description: "Carrossel com dicas práticas para o dia a dia", status: "published", pillar: "educativo", platform: "instagram", date: "2026-03-02", time: "10:00" },
  { id: "2", title: "Minha rotina matinal", description: "Vídeo mostrando os bastidores da manhã", status: "published", pillar: "bastidores", platform: "tiktok", date: "2026-03-05", time: "08:00" },
  { id: "3", title: "Case de sucesso: Cliente X", description: "Post sobre resultados alcançados", status: "published", pillar: "autoridade", platform: "linkedin", date: "2026-03-08" },
  { id: "4", title: "Enquete: Qual tema preferem?", description: "Stories interativos para engajar", status: "published", pillar: "engajamento", platform: "instagram", date: "2026-03-10" },
  { id: "5", title: "Lançamento do curso novo", description: "Post de vendas com CTA direto", status: "scheduled", pillar: "vendas", platform: "instagram", date: "2026-03-15", time: "12:00" },
  { id: "6", title: "Tutorial completo de SEO", description: "Vídeo longo explicando SEO para iniciantes", status: "scheduled", pillar: "educativo", platform: "youtube", date: "2026-03-18", time: "14:00" },
  { id: "7", title: "Artigo: Tendências 2026", description: "Blog post sobre tendências do mercado", status: "draft", pillar: "autoridade", platform: "blog", date: "2026-03-22" },
  { id: "8", title: "Desafio de 7 dias", description: "Série de conteúdo interativo", status: "idea", pillar: "engajamento", platform: "tiktok", date: "2026-03-25" },
  { id: "9", title: "Depoimento em vídeo", description: "Cliente compartilhando experiência", status: "idea", pillar: "autoridade", platform: "instagram", date: "2026-03-28" },
  { id: "10", title: "Promoção de Páscoa", description: "Oferta especial por tempo limitado", status: "draft", pillar: "vendas", platform: "instagram", date: "2026-03-30", time: "09:00" },
];
