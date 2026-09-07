import { TrendPeriod } from "../../Domain/enums/TrendPeriod";
import { RecommendationContextAvg7dDto } from "../../Domain/types/recommendationContext/RecommendationContextAvg7dDto";
import { RecommendationContextLatestDto } from "../../Domain/types/recommendationContext/RecommendationContextLatestDto";
import { RecommendationContextSeriesPointDto } from "../../Domain/types/recommendationContext/RecommendationContextSeriesPointDto";
import { RecommendationContextIncidentsByCategoryDto } from "../../Domain/types/recommendationContext/RecommendationContextIncidentsByCategoryDto";

export interface IRecommendationContextQuery {
  getLatest(fromUtc: Date, toUtc: Date): Promise<RecommendationContextLatestDto>;

  getAvg(period: TrendPeriod): Promise<RecommendationContextAvg7dDto>;

  getSeries(period: TrendPeriod): Promise<RecommendationContextSeriesPointDto[]>;

  getIncidentsByCategory(
    period: TrendPeriod
  ): Promise<RecommendationContextIncidentsByCategoryDto[]>;
}
