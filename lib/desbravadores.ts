import { Ionicons } from '@expo/vector-icons';

export type IoniconName = keyof typeof Ionicons.glyphMap;

export type RoleName = 'DESBRAVADOR' | 'MONITOR' | 'DIRETOR' | string;

export type BasicUser = {
  id: number;
  name?: string | null;
  surname?: string | null;
  username?: string | null;
  avatar?: string | null;
  unitRole?: string | null;
  role?: RoleName | null;
  xp?: number | null;
  totalXp?: number | null;
};

export type AchievementItem = {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  xpReward?: number | null;
  rewardType?: string | null;
};

export type ProfilePayload = BasicUser & {
  level?: number | null;
  group?: GroupPayload | null;
  achievements?: AchievementItem[];
};

export type GroupPayload = {
  id: number;
  name?: string | null;
  description?: string | null;
  accentColor?: string | null;
  leader?: BasicUser | number | null;
};

export type GroupDetails = {
  group: GroupPayload;
  members: BasicUser[];
  totalXp: number;
};

export type RequirementProgressItem = {
  id: number;
  title: string;
  category: string;
  classLevel: string;
  description: string;
  iconName?: string | null;
  iconImageUrl?: string | null;
  iconSize?: number | null;
  displayOrder: number;
  completed: boolean;
  completedAt?: string | null;
};

export type RequirementProgress = {
  classLevel: string;
  totalRequirements: number;
  completedRequirements: number;
  remainingRequirements: number;
  completionPercentage: number;
  items: RequirementProgressItem[];
};

export type SpecialtyStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | string;

export type SpecialtyProgressItem = {
  id: number;
  name: string;
  area: string;
  description: string;
  iconName?: string | null;
  iconImageUrl?: string | null;
  iconSize?: number | null;
  accentColor?: string | null;
  status: SpecialtyStatus;
  updatedAt?: string | null;
};

export type XpHistoryItem = {
  id: number;
  amount: number;
  reason: string;
  sourceType?: string | null;
  referenceType?: string | null;
  referenceId?: number | null;
  referenceLabel?: string | null;
  performedBy?: string | null;
  balanceAfter: number;
  levelAfter: number;
  currentLevelXpAfter: number;
  createdAt?: string | null;
};

export type XpSummary = {
  level: number;
  currentXp: number;
  totalXp: number;
  xpForNextLevel: number;
  xpToNextLevel: number;
  achievementXp: number;
  manualXp: number;
  history: XpHistoryItem[];
};

export type SpecialtyProgress = {
  totalSpecialties: number;
  completedSpecialties: number;
  inProgressSpecialties: number;
  notStartedSpecialties: number;
  items: SpecialtyProgressItem[];
};

export type AttendanceStats = {
  totalClasses?: number;
  myPresence?: number;
  percentage?: number | string;
};

const glyphMap = Ionicons.glyphMap as Record<string, number>;

const iconAliases: Record<string, IoniconName> = {
  achievement: 'ribbon',
  activities: 'walk',
  activity: 'walk',
  astronomy: 'star',
  book: 'book',
  books: 'book',
  camp: 'bonfire',
  checklist: 'checkbox',
  communication: 'mic',
  cooking: 'restaurant',
  culinaria: 'restaurant',
  excursion: 'trail-sign',
  excursionismo: 'trail-sign',
  fire: 'bonfire',
  flag: 'flag',
  general: 'grid',
  hammer: 'hammer',
  health: 'medkit',
  hiking: 'trail-sign',
  leadership: 'flag',
  leaf: 'leaf',
  library: 'library',
  list: 'list',
  medkit: 'medkit',
  megaphone: 'megaphone',
  microphone: 'mic',
  mission: 'compass',
  nature: 'leaf',
  pathfinder: 'compass',
  pioneer: 'hammer',
  pioneiria: 'hammer',
  quest: 'sparkles',
  reading: 'book',
  requirement: 'checkmark-circle',
  requirements: 'checkmark-done',
  rescue: 'medkit',
  restaurant: 'restaurant',
  ribbon: 'ribbon',
  science: 'flask',
  search: 'search',
  skill: 'construct',
  specialty: 'ribbon',
  spirituality: 'library',
  star: 'star',
  study: 'school',
  trail: 'trail-sign',
  walk: 'walk',
};

function toText(value?: string | null) {
  return String(value || '').trim();
}

function capitalize(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getFullName(user?: Partial<BasicUser> | null) {
  const parts = [toText(user?.name), toText(user?.surname)].filter(Boolean);
  return parts.join(' ') || toText(user?.username) || 'Desbravador';
}

export function getFirstName(user?: Partial<BasicUser> | null) {
  return getFullName(user).split(' ')[0] || 'Desbravador';
}

export function getInitials(user?: Partial<BasicUser> | null) {
  const parts = [toText(user?.name), toText(user?.surname)].filter(Boolean);

  if (parts.length === 0) {
    const username = toText(user?.username);
    return username.slice(0, 2).toUpperCase() || 'DM';
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function roleLabel(role?: RoleName | null) {
  switch (role) {
    case 'DIRETOR':
      return 'Diretor';
    case 'MONITOR':
      return 'Monitor';
    case 'DESBRAVADOR':
      return 'Desbravador';
    default:
      return 'Membro';
  }
}

export function unitRoleLabel(user?: Partial<BasicUser> | null) {
  return toText(user?.unitRole) || roleLabel(user?.role);
}

export function normalizeAccentColor(color?: string | null, fallback = '#6b8e23') {
  const value = toText(color);
  if (!value) {
    return fallback;
  }

  return value.startsWith('#') ? value : `#${value}`;
}

export function resolveGroupLeader(group?: GroupPayload | null, members: BasicUser[] = []) {
  if (!group?.leader) {
    return null;
  }

  if (typeof group.leader === 'number') {
    return members.find((member) => member.id === group.leader) || null;
  }

  return group.leader;
}

export function specialtyStatusLabel(status?: SpecialtyStatus | null) {
  switch (status) {
    case 'COMPLETED':
      return 'Concluida';
    case 'IN_PROGRESS':
      return 'Em andamento';
    default:
      return 'Nao iniciada';
  }
}

export function specialtyStatusColor(status?: SpecialtyStatus | null) {
  switch (status) {
    case 'COMPLETED':
      return '#10B981';
    case 'IN_PROGRESS':
      return '#F59E0B';
    default:
      return '#94A3B8';
  }
}

export function formatAttendanceDate(dateString?: string | null) {
  const baseDate = dateString ? new Date(`${dateString}T00:00:00`) : new Date();
  if (Number.isNaN(baseDate.getTime())) {
    return 'Hoje';
  }

  const formatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
  }).format(baseDate);

  return capitalize(formatted);
}

export function toLocalIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toAttendancePercentage(value?: number | string | null) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toFixed(1);
  }

  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return parsed.toFixed(1);
  }

  return '0.0';
}

export function resolveBackendIconName(rawValue?: string | null, fallback: IoniconName = 'ribbon'): IoniconName {
  const raw = toText(rawValue).toLowerCase();

  if (!raw) {
    return fallback;
  }

  const variants = Array.from(
    new Set([
      raw,
      raw.replace(/\s+/g, '-'),
      raw.replace(/_/g, '-'),
      raw.replace(/^ion-/, ''),
      raw.replace(/^md-/, ''),
      raw.replace(/^ios-/, ''),
    ])
  );

  for (const variant of variants) {
    if (variant in glyphMap) {
      return variant as IoniconName;
    }

    const outlineVariant = `${variant}-outline`;
    if (outlineVariant in glyphMap) {
      return outlineVariant as IoniconName;
    }
  }

  const tokens = raw
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  for (const token of tokens) {
    const mapped = iconAliases[token];
    if (mapped) {
      return mapped;
    }

    if (token in glyphMap) {
      return token as IoniconName;
    }
  }

  return fallback;
}

export function formatXpAmount(value?: number | null) {
  const amount = Number(value) || 0;
  return `${amount >= 0 ? '+' : ''}${amount} XP`;
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return 'agora';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'agora';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

export function translateXpSource(sourceType?: string | null) {
  switch (sourceType) {
    case 'ACHIEVEMENT_GRANTED':
      return 'Conquista liberada';
    case 'ACHIEVEMENT_REVOKED':
      return 'Conquista revogada';
    case 'ADMIN_ADJUSTMENT':
      return 'Ajuste do admin';
    default:
      return 'Movimentacao';
  }
}
