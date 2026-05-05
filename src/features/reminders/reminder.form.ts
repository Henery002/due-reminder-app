export function parseOptionalReminderAmount(value: string): number | undefined {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return undefined;
  }

  const amount = Number(trimmed);
  if (!Number.isFinite(amount)) {
    throw new Error('金额请输入数字，例如 19.9');
  }

  return amount;
}
