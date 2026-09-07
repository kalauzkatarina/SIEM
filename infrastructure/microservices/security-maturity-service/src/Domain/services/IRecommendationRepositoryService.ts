import { Recommendation } from "../types/Recommendation";
import { RecommendationSnapshot } from "../types/RecommendationSnapshot";

export interface IRecommendationRepositoryService {

  getLatestSnapshot(): Promise<RecommendationSnapshot>;
  saveSnapshot(snapshot: RecommendationSnapshot): Promise<void>;

  saveRecommendations(recommendations: Recommendation[]): Promise<number[]>;
  getRecommendationsByIds(ids: number[]): Promise<Recommendation[]>;
}