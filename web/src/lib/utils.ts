import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, formatString = 'PPp'): string {
  if (typeof date === 'string') {
    return format(parseISO(date), formatString);
  }
  return format(date, formatString);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadAsJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadAsCSV(data: any[], filename: string): void {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

export function getStatusColor(status: string): string {
  const colors = {
    active: 'text-accent-neon',
    pending: 'text-accent-orange',
    suspended: 'text-red-400',
    completed: 'text-accent-neon',
    failed: 'text-red-400',
    refunded: 'text-accent-orange',
    cancelled: 'text-text-tertiary',
  };
  
  return colors[status as keyof typeof colors] || 'text-text-secondary';
}

export function getStatusBadgeColor(status: string): string {
  const colors = {
    active: 'bg-accent-neon/10 text-accent-neon border-accent-neon/20',
    pending: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
    suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
    completed: 'bg-accent-neon/10 text-accent-neon border-accent-neon/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    refunded: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
    cancelled: 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20',
  };
  
  return colors[status as keyof typeof colors] || 'bg-text-secondary/10 text-text-secondary border-text-secondary/20';
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function generateReceipt(transaction: any): string {
  return `
    AdithiVault Receipt
    ===============
    
    Transaction ID: ${transaction.id}
    Date: ${formatDate(transaction.createdAt)}
    Amount: ${formatCurrency(transaction.amount, transaction.currency)}
    Commission: ${formatCurrency(transaction.commission, transaction.currency)}
    Net Amount: ${formatCurrency(transaction.netAmount, transaction.currency)}
    Status: ${transaction.status.toUpperCase()}
    
    Customer: ${transaction.customerDetails.name}
    ${transaction.customerDetails.email ? `Email: ${transaction.customerDetails.email}` : ''}
    ${transaction.customerDetails.phone ? `Phone: ${transaction.customerDetails.phone}` : ''}
    
    Payment Method: ${transaction.paymentMethod.toUpperCase()}
    Gateway: ${transaction.gateway.toUpperCase()}
    
    Thank you for using AdithiVault!
  `;
}