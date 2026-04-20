import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSync, useTheme } from './_layout';
import api, { clearSession, isUnauthorizedError } from '../api';
import {
  type BasicUser,
  type GroupDetails,
  getFullName,
  normalizeAccentColor,
  resolveGroupLeader,
  roleLabel,
  unitRoleLabel,
} from '../lib/desbravadores';

export default function UnidadeAguiaScreen() {
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

        console.log('Erro ao carregar detalhes da unidade:', error);
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

  const leader = resolveGroupLeader(groupDetails?.group, groupDetails?.members || []);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{(groupDetails?.group?.name || 'MINHA UNIDADE').toUpperCase()}</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
        >
          <View style={styles.content}>
            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBadge, { backgroundColor: `${theme.accent}20` }]}>
                  <Ionicons name="megaphone" size={22} color={theme.accent} />
                </View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Descricao da Unidade</Text>
              </View>
              <Text style={[styles.gritoText, { color: theme.subText }]}>
                {groupDetails?.group?.description || 'Nenhuma descricao foi cadastrada para esta unidade.'}
              </Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBadge, { backgroundColor: '#3B82F620' }]}>
                  <Ionicons name="ribbon" size={22} color="#3B82F6" />
                </View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Lider da Unidade</Text>
              </View>
              <Text style={[styles.gritoText, { color: theme.subText }]}>
                {leader ? `${getFullName(leader)} • ${unitRoleLabel(leader)}` : 'Nenhum lider vinculado no momento.'}
              </Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionLabel, { color: theme.text }]}>Membros Ativos</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{groupDetails?.members?.length || 0} Membros</Text>
              </View>
            </View>

            {(groupDetails?.members || []).length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>Sem membros cadastrados</Text>
                <Text style={[styles.emptyText, { color: theme.subText }]}>
                  O cadastro de unidade no DesbravadoresTeste ainda nao possui membros vinculados para este usuario.
                </Text>
              </View>
            ) : (
              groupDetails?.members.map((member, index) => (
                <MembroRow
                  key={member.id}
                  theme={theme}
                  nome={getFullName(member)}
                  cargo={unitRoleLabel(member)}
                  role={roleLabel(member.role)}
                  icon={leader?.id === member.id ? 'shield-half' : index % 2 === 0 ? 'person' : 'star'}
                  color={leader?.id === member.id ? '#EF4444' : index % 2 === 0 ? '#10B981' : '#F59E0B'}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function MembroRow({
  theme,
  nome,
  cargo,
  role,
  icon,
  color,
}: {
  theme: { card: string; text: string; subText: string };
  nome: string;
  cargo: string;
  role: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return (
    <TouchableOpacity style={[styles.membroRow, { backgroundColor: theme.card }]} activeOpacity={0.8}>
      <View style={styles.membroLeft}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={styles.memberTextBlock}>
          <Text style={[styles.membroNome, { color: theme.text }]}>{nome}</Text>
          <Text style={[styles.membroCargo, { color }]}>{cargo}</Text>
        </View>
      </View>
      <Text style={[styles.roleLabel, { color: theme.subText }]}>{role}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 120,
    paddingTop: 45,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2, flexShrink: 1 },
  scrollContent: { paddingBottom: 40 },
  content: { padding: 20 },
  infoCard: { padding: 20, borderRadius: 25, marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBadge: { padding: 8, borderRadius: 12, marginRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: 'bold' },
  gritoText: { fontSize: 15, fontStyle: 'italic', lineHeight: 24, paddingLeft: 5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 15 },
  sectionLabel: { fontSize: 18, fontWeight: '900', marginLeft: 5 },
  countBadge: { backgroundColor: 'rgba(107, 142, 35, 0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  countText: { color: '#6b8e23', fontSize: 12, fontWeight: 'bold' },
  membroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 22, marginBottom: 10, elevation: 2 },
  membroLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  memberTextBlock: { flex: 1 },
  avatarPlaceholder: { width: 46, height: 46, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  membroNome: { fontSize: 16, fontWeight: 'bold' },
  membroCargo: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginTop: 2 },
  roleLabel: { fontSize: 12, fontWeight: '700', textAlign: 'right' },
  emptyState: { padding: 22, borderRadius: 22, alignItems: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
