export const normalizeRole = (role?: string | null) => {
  const normalized = (role || '').trim().toLowerCase();
  if (normalized === 'seller') return 'seller';
  if (normalized === 'buyer') return 'buyer';
  return normalized;
};
