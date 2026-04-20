import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { createStudentTheme } from '../constants/tokens';
import { dispatchStudentNotifications } from '../lib/notifications';
import {
  markAllStudentNotificationsRead,
  markStudentNotificationRead,
  readStudentNotifications,
  syncStudentBundle,
} from '../lib/student-cache';
import { StudentNotificationItem } from '../lib/student-events';
import { useAppSync, useTheme } from './_layout';

function notificationIcon(kind: StudentNotificationItem['kind']) {
  switch (kind) {
    case 'achievement_unlocked':
      return 'ribbon-outline';
    case 'password_reset_approved':
      return 'key-outline';
    default:
      return 'calendar-outline';
  }
}

function notificationColor(kind: StudentNotificationItem['kind']) {
  switch (kind) {
    case 'achievement_unlocked':
      return '#6b8e23';
    case 'password_reset_approved':
      return '#3B82F6';
    default:
      return '#F59E0B';
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { refreshVersion, triggerRefresh, isRefreshing } = useAppSync();
  const [items, setItems] = useState<StudentNotificationItem[]>([]);

  const theme = createStudentTheme(isDarkMode);

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      const storedItems = await readStudentNotifications();
      if (active) {
        setItems(storedItems);
      }

      await syncStudentBundle({ notify: dispatchStudentNotifications });
      const nextItems = await readStudentNotifications();
      if (active) {
        setItems(nextItems);
      }
    };

    loadNotifications();

    return () => {
      active = false;
    };
  }, [refreshVersion]);

  const handleOpenNotification = async (item: StudentNotificationItem) => {
    const nextItems = await markStudentNotificationRead(item.id);
    setItems(nextItems);
  };

  const handleMarkAll = async () => {
    const nextItems = await markAllStudentNotificationsRead();
    setItems(nextItems);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NOTIFICACOES</Text>
        <TouchableOpacity onPress={handleMarkAll} style={styles.markAllBtn}>
          <Text style={styles.markAllText}>Ler tudo</Text>
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const color = notificationColor(item.kind);
          return (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: theme.card,
                  borderColor: item.read ? 'transparent' : `${color}45`,
                },
              ]}
              onPress={() => handleOpenNotification(item)}
              activeOpacity={0.85}
            >
              <View style={[styles.iconWrap, { backgroundColor: `${color}20` }]}>
                <Ionicons name={notificationIcon(item.kind) as any} size={22} color={color} />
              </View>
              <View style={styles.copy}>
                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.body, { color: theme.subText }]}>{item.body}</Text>
                <Text style={[styles.meta, { color: theme.subText }]}>{new Date(item.createdAt).toLocaleString('pt-BR')}</Text>
              </View>
              {!item.read ? <View style={[styles.dot, { backgroundColor: color }]} /> : null}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Nada novo por aqui</Text>
            <Text style={[styles.emptyText, { color: theme.subText }]}>As liberacoes de conquista, aprovacoes de reset e novas atividades vao aparecer nesta caixa.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 120, paddingTop: 45, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  markAllBtn: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  markAllText: { color: 'white', fontSize: 12, fontWeight: '900' },
  list: { padding: 20, paddingBottom: 30 },
  card: { borderRadius: 22, padding: 16, marginBottom: 12, flexDirection: 'row', borderWidth: 1, alignItems: 'center' },
  iconWrap: { width: 46, height: 46, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  copy: { flex: 1 },
  title: { fontSize: 15, fontWeight: '800' },
  body: { marginTop: 4, fontSize: 13, lineHeight: 19 },
  meta: { marginTop: 8, fontSize: 11, fontWeight: '700' },
  dot: { width: 10, height: 10, borderRadius: 5, marginLeft: 12 },
  emptyState: { borderRadius: 22, padding: 22, alignItems: 'center', marginTop: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '800', marginBottom: 8 },
  emptyText: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
