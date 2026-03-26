export interface ClientProfile {
  id: string;
  name: string;
  area: string;
  objectives: string;
  tone: string;
  audience: string;
  platforms: string[];
}

export const sampleClients: ClientProfile[] = [
  {
    id: "client-1",
    name: "Studio Wellness",
    area: "Saúde e Bem-estar",
    objectives: "Aumentar agendamentos online em 30% e fortalecer presença no Instagram",
    tone: "Acolhedor, empático e profissional",
    audience: "Mulheres 25-45 anos, interessadas em qualidade de vida e autocuidado",
    platforms: ["instagram", "tiktok", "blog"],
  },
  {
    id: "client-2",
    name: "TechStart Consultoria",
    area: "Tecnologia e Inovação",
    objectives: "Gerar leads qualificados para consultoria B2B e posicionar como autoridade em IA",
    tone: "Técnico mas acessível, confiante e inovador",
    audience: "CTOs, gerentes de TI e founders de startups, 30-50 anos",
    platforms: ["linkedin", "youtube", "blog"],
  },
];
