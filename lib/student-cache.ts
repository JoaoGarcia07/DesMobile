import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import api, { resolveAssetUrl } from '../api';
import {
  formatDateTime,
  GroupDetails,
  ProfilePayload,
  PasswordResetStatusDTO,
  RequirementProgress,
  RequirementProgressItem,
  SpecialtyProgress,
  SpecialtyProgressItem,
  XpSummary,
} from './desbravadores';
import {
  appendNotifications,
  createAchievementNotifications,
  createResetApprovalNotification,
  createTaskNotifications,
  StudentNotificationItem,
} from './student-events';

type TaskItem = {
  id: number;
  title?: string | null;
  date?: string | null;
  time?: string | null;
};

export type StudentBundle = {
  profile: ProfilePayload | null;
  xpSummary: XpSummary | null;
  requirementsProgress: RequirementProgress | null;
  specialtiesProgress: SpecialtyProgress | null;
  groupDetails: GroupDetails | null;
  tasks: TaskItem[];
  updatedAt: string;
};

export type StudentBundleOptions = {
  notify?: (items: StudentNotificationItem[]) => Promise<void> | void;
};

const CACHE_KEYS = {
  bundle: 'desmobile.student.bundle',
  notifications: 'desmobile.student.notifications',
  resetStatusPrefix: 'desmobile.student.reset-status.',
};

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

async function writeJson(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function readStudentBundleCache() {
  return readJson<StudentBundle>(CACHE_KEYS.bundle);
}

export async function writeStudentBundleCache(bundle: StudentBundle) {
  await writeJson(CACHE_KEYS.bundle, bundle);
}

export async function readStudentNotifications() {
  return (await readJson<StudentNotificationItem[]>(CACHE_KEYS.notifications)) || [];
}

export async function writeStudentNotifications(items: StudentNotificationItem[]) {
  await writeJson(CACHE_KEYS.notifications, items);
}

export async function markStudentNotificationRead(notificationId: string) {
  const items = await readStudentNotifications();
  const nextItems = items.map((item) => item.id === notificationId ? { ...item, read: true } : item);
  await writeStudentNotifications(nextItems);
  return nextItems;
}

export async function markAllStudentNotificationsRead() {
  const items = await readStudentNotifications();
  const nextItems = items.map((item) => ({ ...item, read: true }));
  await writeStudentNotifications(nextItems);
  return nextItems;
}

async function resolveRequirementAssets(progress: RequirementProgress | null) {
  if (!progress) return progress;

  const items = await Promise.all(
    (progress.items || []).map(async (item: RequirementProgressItem) => ({
      ...item,
      iconImageUrlResolved: item.iconImageUrl ? await resolveAssetUrl(item.iconImageUrl) : null,
    }))
  );

  return { ...progress, items };
}

async function resolveSpecialtyAssets(progress: SpecialtyProgress | null) {
  if (!progress) return progress;

  const items = await Promise.all(
    (progress.items || []).map(async (item: SpecialtyProgressItem) => ({
      ...item,
      iconImageUrlResolved: item.iconImageUrl ? await resolveAssetUrl(item.iconImageUrl) : null,
    }))
  );

  return { ...progress, items };
}

export async function fetchStudentBundle() {
  const now = new Date();
  const [profileResponse, xpResponse, requirementsResponse, specialtiesResponse, groupResponse, tasksResponse] = await Promise.all([
    api.get<ProfilePayload>('/api/profile/me'),
    api.get<XpSummary>('/api/profile/me/xp'),
    api.get<RequirementProgress>('/api/profile/me/requirements-progress'),
    api.get<SpecialtyProgress>('/api/profile/me/specialties-progress'),
    api.get<GroupDetails>('/api/groups/me').catch((error) => {
      if (error?.response?.status === 404) {
        return { data: null };
      }
      throw error;
    }),
    api.get(`/api/tasks?year=${now.getFullYear()}&month=${now.getMonth() + 1}&size=20&sort=date,asc&sort=time,asc`),
  ]);

  return {
    profile: profileResponse.data || null,
    xpSummary: xpResponse.data || null,
    requirementsProgress: await resolveRequirementAssets(requirementsResponse.data || null),
    specialtiesProgress: await resolveSpecialtyAssets(specialtiesResponse.data || null),
    groupDetails: groupResponse.data || null,
    tasks: tasksResponse.data?.content || [],
    updatedAt: new Date().toISOString(),
  } satisfies StudentBundle;
}

export async function syncStudentBundle(options?: StudentBundleOptions) {
  const previousBundle = await readStudentBundleCache();
  const previousNotifications = await readStudentNotifications();
  const nextBundle = await fetchStudentBundle();

  await writeStudentBundleCache(nextBundle);

  const notificationItems = appendNotifications(previousNotifications, [
    ...createAchievementNotifications(previousBundle, nextBundle),
    ...createTaskNotifications(previousBundle, nextBundle),
  ]);

  await writeStudentNotifications(notificationItems);

  if (options?.notify) {
    const newItems = notificationItems.filter((item) => !item.read && !previousNotifications.some((previous) => previous.id === item.id));
    if (newItems.length > 0) {
      await options.notify(newItems);
    }
  }

  return nextBundle;
}

export async function readCachedOrFetchStudentBundle(options?: StudentBundleOptions) {
  const cached = await readStudentBundleCache();
  if (cached) {
    return cached;
  }

  return syncStudentBundle(options);
}

export async function readPasswordResetStatus(username: string) {
  return readJson<PasswordResetStatusDTO>(`${CACHE_KEYS.resetStatusPrefix}${username.trim().toLowerCase()}`);
}

export async function syncPasswordResetStatus(
  username: string,
  options?: { notify?: (items: StudentNotificationItem[]) => Promise<void> | void }
) {
  const normalizedUsername = username.trim().toLowerCase();
  if (!normalizedUsername) {
    return null;
  }

  const previousStatus = await readPasswordResetStatus(normalizedUsername);
  const response = await api.get<PasswordResetStatusDTO>('/auth/password-resets/status', {
    params: { username: normalizedUsername },
  });
  const nextStatus = response.data || null;

  await writeJson(`${CACHE_KEYS.resetStatusPrefix}${normalizedUsername}`, nextStatus);

  const resetNotification = createResetApprovalNotification(previousStatus, nextStatus);
  if (resetNotification) {
    const previousNotifications = await readStudentNotifications();
    const nextNotifications = appendNotifications(previousNotifications, [resetNotification]);
    await writeStudentNotifications(nextNotifications);

    if (options?.notify) {
      await options.notify([resetNotification]);
    }
  }

  return nextStatus;
}

export function describeBundleTimestamp(bundle: StudentBundle | null) {
  return bundle?.updatedAt ? formatDateTime(bundle.updatedAt) : 'sem sincronizacao';
}
