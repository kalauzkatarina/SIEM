import { Recommendation } from "../types/Recommendation";

export interface IRecommendationService{
    getRecommendations(): Promise<Recommendation[]>;
}