import { AlertCategory } from "../enums/AlertCategory";

export type IncidentsByCategoryDto = {
  category: AlertCategory;
  count: number;
};