import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { StudentNotificationItem } from './student-events';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

let permissionRequested = false;

export async function ensureLocalNotificationPermission() {
  if (Platform.OS === 'web' || permissionRequested) {
    return;
  }

  permissionRequested = true;

  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) {
      return;
    }

    await Notifications.requestPermissionsAsync();
  } catch {}
}

export async function dispatchStudentNotifications(items: StudentNotificationItem[]) {
  if (Platform.OS === 'web' || !items.length) {
    return;
  }

  await ensureLocalNotificationPermission();

  try {
    const permissions = await Notifications.getPermissionsAsync();
    if (!permissions.granted) {
      return;
    }

    for (const item of items.slice(0, 3)) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: item.title,
          body: item.body,
          data: { kind: item.kind, createdAt: item.createdAt },
        },
        trigger: null,
      });
    }
  } catch {}
}
