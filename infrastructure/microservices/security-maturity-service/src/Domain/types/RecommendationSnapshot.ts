import { Recommendation } from "./Recommendation";

export interface RecommendationSnapshot {
  id: number;
  generatedAtUtc: Date;
  recommendationIds: number[];
}