import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("recommendation_snapshots")
export class RecommendationSnapshot {
  @PrimaryGeneratedColumn({ name: "id" })
  id!: number;
  @Column({ name: "generated_at", type: "timestamp" })
  generatedAt!: Date;
  @Column({ name: "recommendationIds", type: "json" })
  recommendationIds!: number[];
}
