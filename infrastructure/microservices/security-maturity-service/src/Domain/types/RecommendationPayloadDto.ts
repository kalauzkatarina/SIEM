export type RecommendationPayloadDto = {
  id: number;
  title: string;
  rationale: string;

  priority: string;
  effort: string;
  category: string;

  relatedMetrics: string[];
  suggestedActions: string[];
};