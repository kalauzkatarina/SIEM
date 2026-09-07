export function toHourlyWindowStartUtc(d: Date): Date {
  const yyyy = d.getUTCFullYear();
  const mm = d.getUTCMonth();
  const dd = d.getUTCDate();
  const hh = d.getUTCHours();

  return new Date(Date.UTC(yyyy, mm, dd, hh, 0, 0, 0));
}

export function formatWindowStartIsoUtc(d: Date): string {
  return d.toISOString();
}

export function formatWindowStartHumanUtc(d: Date): string {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:00 UTC`;
}
