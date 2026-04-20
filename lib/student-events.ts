import { PasswordResetStatusDTO, ProfilePayload, XpSummary } from './desbravadores';

export type StudentEventKind = 'achievement_unlocked' | 'task_created' | 'password_reset_approved';

export type StudentNotificationItem = {
  id: string;
  kind: StudentEventKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

type TaskItem = {
  id: number;
  title?: string | null;
  date?: string | null;
  time?: string | null;
};

type StudentBundleLike = {
  profile: ProfilePayload | null;
  xpSummary: XpSummary | null;
  tasks: TaskItem[];
};

export function calculateLevelProgress(currentXp?: number | null, xpForNextLevel?: number | null) {
  const current = Math.max(Number(currentXp) || 0, 0);
  const target = Math.max(Number(xpForNextLevel) || 0, 0);

  if (target === 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (current / target) * 100));
}

export function buildLoginPayload(username: string, password: string) {
  return {
    username: String(username || '').trim(),
    password,
  };
}

export function validateResetConfirmation(newPassword: string, confirmPassword: string) {
  if (!newPassword || !confirmPassword) {
    return 'Preencha e confirme a nova senha.';
  }

  if (newPassword !== confirmPassword) {
    return 'A confirmacao da senha nao confere.';
  }

  return null;
}

export function createAchievementNotifications(previous: StudentBundleLike | null, next: StudentBundleLike) {
  const previousIds = new Set((previous?.profile?.achievements || []).map((achievement) => achievement.id));

  return (next.profile?.achievements || [])
    .filter((achievement) => achievement.id && !previousIds.has(achievement.id))
    .map((achievement) => ({
      id: `achievement-${achievement.id}`,
      kind: 'achievement_unlocked' as const,
      title: 'Nova conquista liberada',
      body: `${achievement.name}${achievement.xpReward ? ` • ${achievement.xpReward} XP` : ''}`,
      createdAt: new Date().toISOString(),
      read: false,
    }));
}

export function createTaskNotifications(previous: StudentBundleLike | null, next: StudentBundleLike) {
  const previousIds = new Set((previous?.tasks || []).map((task) => task.id));

  return next.tasks
    .filter((task) => task.id && !previousIds.has(task.id))
    .slice(0, 3)
    .map((task) => ({
      id: `task-${task.id}`,
      kind: 'task_created' as const,
      title: 'Nova atividade no calendario',
      body: `${task.title || 'Atividade'}${task.date ? ` • ${task.date}` : ''}`,
      createdAt: new Date().toISOString(),
      read: false,
    }));
}

export function createResetApprovalNotification(
  previousStatus: PasswordResetStatusDTO | null,
  nextStatus: PasswordResetStatusDTO | null
) {
  const previous = previousStatus?.status || null;
  const next = nextStatus?.status || null;

  if (previous === 'APPROVED' || next !== 'APPROVED') {
    return null;
  }

  return {
    id: `reset-approved-${nextStatus?.approvedAt || nextStatus?.expiresAt || nextStatus?.requestedAt || 'current'}`,
    kind: 'password_reset_approved' as const,
    title: 'Codigo de redefinicao liberado',
    body: nextStatus?.expiresAt
      ? `Seu codigo temporario ja pode ser usado ate ${nextStatus.expiresAt}.`
      : 'Seu codigo temporario ja pode ser usado.',
    createdAt: new Date().toISOString(),
    read: false,
  };
}

export function appendNotifications(previousItems: StudentNotificationItem[], nextItems: StudentNotificationItem[]) {
  const existingIds = new Set(previousItems.map((item) => item.id));
  return [...nextItems.filter((item) => !existingIds.has(item.id)), ...previousItems].slice(0, 40);
}
