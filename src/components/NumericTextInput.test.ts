import { normalizeNumericInput } from './NumericTextInput.helpers';

describe('NumericTextInput helpers', () => {
  it('keeps only digits for integer input', () => {
    expect(normalizeNumericInput('提前 14 天', { decimal: false })).toBe('14');
    expect(normalizeNumericInput('1.5', { decimal: false })).toBe('15');
  });

  it('keeps one decimal point for amount input', () => {
    expect(normalizeNumericInput('¥25a.6.7', { decimal: true })).toBe('25.67');
    expect(normalizeNumericInput('.5', { decimal: true })).toBe('0.5');
  });
});
