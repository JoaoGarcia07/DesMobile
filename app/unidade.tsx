import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSync, useTheme } from './_layout';
import api, { clearSession, isUnauthorizedError } from '../api';
import {
  type BasicUser,
  type GroupDetails,
  getFullName,
  getInitials,
  normalizeAccentColor,
  roleLabel,
  unitRoleLabel,
} from '../lib/desbravadores';

const memberPalette = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

export default function UnidadeScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { refreshVersion, isRefreshing, triggerRefresh } = useAppSync();
  const [loading, setLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);

  const accentColor = normalizeAccentColor(groupDetails?.group?.accentColor, '#6b8e23');

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: accentColor,
    border: isDarkMode ? '#334155' : '#E2E8F0',
  };

  useEffect(() => {
    let active = true;

    const loadGroup = async () => {
      try {
        const response = await api.get<GroupDetails>('/api/groups/me');

        if (!active) {
          return;
        }

        setGroupDetails(response.data);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setGroupDetails(null);
          return;
        }

        if (isUnauthorizedError(error)) {
          await clearSession();
          router.replace('/');
          return;
        }

        console.log('Erro ao carregar unidade:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadGroup();

    return () => {
      active = false;
    };
  }, [router, refreshVersion]);

  const renderMember = ({ item, index }: { item: BasicUser; index: number }) => {
    const memberColor = memberPalette[index % memberPalette.length];

    return (
      <TouchableOpacity style={[styles.membroCard, { backgroundColor: theme.card }]} activeOpacity={0.85}>
        <View style={styles.membroInfo}>
          <View style={[styles.avatarWrapper, { borderColor: memberColor }]}>
            <View style={[styles.avatarFallback, { backgroundColor: `${memberColor}20` }]}>
              <Text style={[styles.avatarText, { color: memberColor }]}>{getInitials(item)}</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.nome, { color: theme.text }]}>{getFullName(item)}</Text>
            <Text style={[styles.cargo, { color: memberColor }]}>{unitRoleLabel(item)}</Text>
          </View>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: `${theme.accent}15` }]}>
          <Text style={[styles.roleBadgeText, { color: theme.accent }]}>{roleLabel(item.role)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MINHA UNIDADE</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={[styles.statsRow, { backgroundColor: theme.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.accent }]}>{groupDetails?.members?.length || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>MEMBROS</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.accent }]}>{groupDetails?.totalXp || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>PONTOS XP</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {groupDetails?.group?.name || 'Sem unidade atribuida'}
        </Text>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.accent} />
          </View>
        ) : (
          <FlatList
            data={groupDetails?.members || []}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
            renderItem={renderMember}
            ListEmptyComponent={
              <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhuma unidade encontrada</Text>
                <Text style={[styles.emptyText, { color: theme.subText }]}>
                  Assim que o usuario for vinculado a uma unidade no DesbravadoresTeste, os membros aparecerao aqui.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 120,
    paddingTop: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  content: { flex: 1, padding: 20 },
  statsRow: {
    flexDirection: 'row',
    padding: 22,
    borderRadius: 25,
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: -40,
    alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '900' },
  statLabel: { fontSize: 10, fontWeight: '800', marginTop: 4, letterSpacing: 1 },
  statDivider: { width: 1, height: '60%' },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 15, marginLeft: 5, textTransform: 'uppercase', letterSpacing: 1 },
  list: { paddingBottom: 20, flexGrow: 1 },
  membroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 22,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
  },
  membroInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  avatarWrapper: { padding: 2, borderRadius: 30, borderWidth: 2 },
  avatarFallback: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '800' },
  textContainer: { marginLeft: 15, flex: 1 },
  nome: { fontSize: 16, fontWeight: 'bold' },
  cargo: { fontSize: 12, marginTop: 2, fontWeight: '800', textTransform: 'uppercase' },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 },
  roleBadgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  emptyState: { padding: 22, borderRadius: 22, alignItems: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
