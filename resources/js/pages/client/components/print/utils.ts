/**
 * Safely formats a numeric value for display
 * Handles both string and number inputs
 */
export function formatNumericValue(value: string | number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || value === '') {
    return '0.00';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0.00';
  }

  return numValue.toFixed(decimals);
}
