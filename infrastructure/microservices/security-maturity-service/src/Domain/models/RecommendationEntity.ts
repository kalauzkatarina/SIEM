import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { RecommendationPriority } from "../enums/RecommendationPriority";
import { RecommendationEffort } from "../enums/RecommendationEffort";
import { RecommendationCategory } from "../enums/RecommendationCategory";
import { RecommendationMetric } from "../enums/RecommendationMetric";

@Entity("recommendations")
export class RecommendationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  rationale!: string;

  @Column({ type: "enum", enum: RecommendationPriority })
  priority!: RecommendationPriority;

  @Column({ type: "enum", enum: RecommendationEffort })
  effort!: RecommendationEffort;

  @Column({ type: "enum", enum: RecommendationCategory })
  category!: RecommendationCategory;

  @Column({ type: "json" })
  relatedMetrics!: RecommendationMetric[];

  @Column({ type: "json" })
  suggestedActions!: string[];

  @Column({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
