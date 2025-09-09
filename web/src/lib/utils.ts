export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(cents: number) {
  // Display amounts as Indian Rupees (₹), values are in paise
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(cents / 100);
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

