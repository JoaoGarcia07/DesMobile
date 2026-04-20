export function createStudentTheme(isDarkMode: boolean) {
  return {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
    accentDeep: '#3c5d12',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    overlay: isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(241, 245, 249, 0.9)',
    input: isDarkMode ? '#334155' : '#E2E8F0',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  };
}

export const studentGradients = {
  hero: ['#6b8e23', '#0F172A'] as const,
  progress: ['#6b8e23', '#3c5d12'] as const,
  achievement: ['#FFB347', '#FF7A18'] as const,
};
