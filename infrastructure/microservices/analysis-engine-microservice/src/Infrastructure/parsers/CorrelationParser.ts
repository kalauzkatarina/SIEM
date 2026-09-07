import { CorrelationCandidate } from "../../Domain/types/CorrelationCandidate";
import { CorrelationDTO } from "../../Domain/types/CorrelationDTO";
import { CorrelationCategory } from "../../Domain/enums/CorrelationCategory";
import { JsonValue } from "../../Domain/types/JsonValue";
import { isJsonArray } from "../json/isJsonArray";
import { isJsonObject } from "../json/isJsonObject";
import { parseCorrelationCategory } from "./parseCorrelationCategory";

const ALLOWED_SEVERITY = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;



export function parseCorrelationCandidates(raw: JsonValue): CorrelationCandidate[] {
  if (!isJsonArray(raw)) return [];

  const out: CorrelationCandidate[] = [];

  for (const item of raw) {
    const parsed = parseOne(item);
    if (parsed.ok) out.push(parsed.value);
  }

  return out;
}

function parseOne(
  raw: JsonValue
):
  | { readonly ok: true; readonly value: CorrelationCandidate }
  | { readonly ok: false } {
  if (!isJsonObject(raw)) return { ok: false };

  const correlationDetected = raw["correlationDetected"];
  const confidence = raw["confidence"];
  const description = raw["description"];
  const severityRaw = raw["severity"];
  const categoryRaw = raw["category"];
  const idsRaw = raw["correlatedEventIds"];

  if (typeof correlationDetected !== "boolean") return { ok: false };
  if (typeof confidence !== "number" || confidence < 0 || confidence > 1) return { ok: false };
  if (typeof description !== "string" || description.trim().length === 0) return { ok: false };
  if (typeof severityRaw !== "string") return { ok: false };
  if (typeof categoryRaw !== "string") return { ok: false };
  if (!isJsonArray(idsRaw)) return { ok: false };

  const sev = severityRaw.toUpperCase();
  const severity: CorrelationCandidate["severity"] =
    (ALLOWED_SEVERITY as readonly string[]).includes(sev)
      ? (sev as CorrelationCandidate["severity"])
      : "LOW";

  const category = parseCorrelationCategory(categoryRaw);

  const ids: number[] = [];
  for (const v of idsRaw) {
    if (typeof v === "number" && Number.isFinite(v)) {
      ids.push(Math.trunc(v));
    }
  }

  return {
    ok: true,
    value: {
      correlationDetected,
      description: description.trim(),
      confidence,
      severity,
      category,
      correlatedEventIds: ids,
    },
  };
}
