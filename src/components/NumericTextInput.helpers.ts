export function normalizeNumericInput(value: string, { decimal = false }: { decimal?: boolean }) {
  if (!decimal) {
    return value.replace(/\D/g, '');
  }

  const [integerPart, ...decimalParts] = value.replace(/[^\d.]/g, '').split('.');
  const normalizedIntegerPart = integerPart.length > 0 ? integerPart : decimalParts.length > 0 ? '0' : '';
  const normalizedDecimalPart = decimalParts.join('');

  return decimalParts.length > 0
    ? `${normalizedIntegerPart}.${normalizedDecimalPart}`
    : normalizedIntegerPart;
}
