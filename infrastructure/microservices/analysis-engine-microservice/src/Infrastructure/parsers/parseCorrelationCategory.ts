import { CorrelationCategory } from "../../Domain/enums/CorrelationCategory";

export function parseCorrelationCategory(raw: string): CorrelationCategory {
  const key = raw.trim().toUpperCase();

  const values: readonly string[] = Object.values(CorrelationCategory);
  if (values.includes(key)) return key as CorrelationCategory;

  return CorrelationCategory.OTHER;
}