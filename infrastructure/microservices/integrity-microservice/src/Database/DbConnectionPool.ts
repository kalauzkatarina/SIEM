import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { IntegrityLog } from "../Domain/models/IntegrityLog";
import { Event } from "../Domain/models/Event";

dotenv.config();

// Konekcija 1: Gde upisuješ heševe (tvoj servis)
export const IntegrityDb = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_INTEGRITY_NAME, 
  synchronize: true, // Automatski pravi tabele u tvojoj bazi
  logging: false,
  entities: [IntegrityLog]
});
// Konekcija 2: Gde čitaš eventove (Event servis)
export const EventDb = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  synchronize: false, 
  entities: [Event]
});