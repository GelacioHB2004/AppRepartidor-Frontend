export function getPasswordStrength(v: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
    if (v.length === 0) return { level: 0, label: '', color: '#E2E8F0' };
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    if (score <= 1) return { level: 1, label: 'Débil', color: '#EF4444' };
    if (score === 2) return { level: 2, label: 'Media', color: '#F59E0B' };
    return { level: 3, label: 'Fuerte', color: '#10B981' };
}
