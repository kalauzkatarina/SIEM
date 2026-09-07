import { TrendMetricType } from "../enums/TrendMetricType";
import { KpiSnapshot } from "../models/KpiSnapshot";

export interface IKpiAggregationService {
  resolveMetricValue(snapshot: KpiSnapshot, metric: TrendMetricType): number;
  weightedAverageMetric(snapshots: KpiSnapshot[], metric: TrendMetricType): number;
  sumSampleCount(snapshots: KpiSnapshot[], metric: TrendMetricType): number;
}