import dotenv from 'dotenv';
import "reflect-metadata";
import { DataSource } from "typeorm";
import { KpiSnapshotCategoryCount } from '../Domain/models/KpiSnapshotCategoryCount';
import { KpiSnapshot } from '../Domain/models/KpiSnapshot';
import { RecommendationEntity } from "../Domain/models/RecommendationEntity";
import { RecommendationSnapshot } from "../Domain/models/RecommendationSnapshot";

dotenv.config();

export const Db = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  synchronize: true,
  logging: false,
  entities: [
    KpiSnapshot,
    KpiSnapshotCategoryCount,
    RecommendationEntity,
    RecommendationSnapshot,
  ],
});
