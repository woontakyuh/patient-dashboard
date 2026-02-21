export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function dDay(targetDate: string): string {
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export function postOpMonths(surgeryDate: string): number {
  const surgery = new Date(surgeryDate);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24 * 30)));
}
