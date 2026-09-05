const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2023-06" -> "June 2023", "2015" -> "2015", "2026-09-05" -> "September 2026". */
export function formatDate(iso: string): string {
  const [year, month] = iso.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

export function formatPeriod(start: string, end?: string): string {
  return `${formatDate(start)} – ${end ? formatDate(end) : "present"}`;
}

/** "2026-09-05" -> "Sep 2026". For tight columns. */
export function formatMonthShort(iso: string): string {
  const [year, month] = iso.split("-");
  return month ? `${MONTHS[Number(month) - 1].slice(0, 3)} ${year}` : year;
}
