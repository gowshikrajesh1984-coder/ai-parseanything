/**
 * Utility to sanitize untrusted document extracted content.
 * Prevents HTML/Script injection attacks and ensures text is rendered as safe data.
 */

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizePlainText(input: unknown): string {
  if (input === null || input === undefined) return 'N/A';
  if (typeof input !== 'string') return String(input);
  // Strip control characters while preserving newlines and tabs
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:text/html') ||
    trimmed.startsWith('vbscript:')
  ) {
    return false;
  }
  return trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('blob:');
}
