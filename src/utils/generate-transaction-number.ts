const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateTransactionNumber(): string {
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  return `TB-${ymd}-${suffix}`;
}
