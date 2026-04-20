import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import api, { clearSession } from '../../api';
import { SyncNowButton } from '../../components/SyncNowButton';
import { createStudentTheme } from '../../constants/tokens';
import { readStudentNotifications } from '../../lib/student-cache';
import { useAppSync, useTheme } from '../_layout';

export default function ConfigScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const { refreshVersion, triggerRefresh, isRefreshing } = useAppSync();
  const [role, setRole] = useState('DESBRAVADOR');
  const [unreadCount, setUnreadCount] = useState(0);

  const theme = createStudentTheme(isDarkMode);

  useEffect(() => {
    let active = true;

    api
      .get('/api/profile/me')
      .then((response) => {
        if (active) {
          setRole(response.data?.role || 'DESBRAVADOR');
        }
      })
      .catch(() => {
        if (active) {
          setRole('DESBRAVADOR');
        }
      });

    readStudentNotifications().then((items) => {
      if (active) {
        setUnreadCount(items.filter((item) => !item.read).length);
      }
    });

    return () => {
      active = false;
    };
  }, [refreshVersion]);

  const handleLogout = async () => {
    await clearSession();
    router.replace('/');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONFIGURACOES</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>APARENCIA</Text>
        <View style={[styles.configCard, { backgroundColor: theme.card }]}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#6366F120' }]}>
              <Ionicons name="moon" size={22} color="#6366F1" />
            </View>
            <Text style={[styles.cardText, { color: theme.text }]}>Modo escuro</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={toggleTheme} trackColor={{ false: '#CBD5E1', true: theme.accent }} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 25 }]}>SINCRONIZACAO</Text>
        <View style={[styles.syncCard, { backgroundColor: theme.card }]}>
          <View style={styles.syncCopy}>
            <Text style={[styles.cardText, { color: theme.text }]}>Atualizar dados do servidor</Text>
            <Text style={[styles.syncSubText, { color: theme.subText }]}>
              Reconsulta a API e manda as telas recarregarem os dados mais recentes do painel web.
            </Text>
          </View>
          <SyncNowButton label="Buscar" onPress={triggerRefresh} loading={isRefreshing} accentColor={theme.accent} style={styles.syncAction} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 25 }]}>JORNADA</Text>
        <ConfigItem icon="stats-chart-outline" label="Extrato de XP" color={theme.accent} theme={theme} onPress={() => router.push('/xp' as any)} />
        <ConfigItem
          icon="notifications-outline"
          label={unreadCount > 0 ? `Notificacoes (${unreadCount})` : 'Notificacoes'}
          color="#F59E0B"
          theme={theme}
          onPress={() => router.push('/notificacoes' as any)}
        />

        <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 25 }]}>SEGURANCA</Text>
        <ConfigItem icon="person-outline" label="Editar perfil" color="#3B82F6" theme={theme} onPress={() => router.push('/editar-perfil' as any)} />
        <ConfigItem icon="key-outline" label="Alterar senha" color="#FF4757" theme={theme} onPress={() => router.push('/alterar-senha' as any)} />

        {role === 'MONITOR' || role === 'DIRETOR' ? (
          <>
            <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 25 }]}>GERENCIAMENTO</Text>
            <ConfigItem icon="add-circle-outline" label="Adicionar atividade" color={theme.accent} theme={theme} onPress={() => router.push('/adicionar' as any)} />
            <ConfigItem icon="calendar-outline" label="Gerenciar agenda" color="#1E90FF" theme={theme} onPress={() => router.push('/agenda' as any)} />
          </>
        ) : null}

        <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 25 }]}>SUPORTE E SOBRE</Text>
        <ConfigItem icon="help-buoy-outline" label="Central de ajuda" color="#F59E0B" theme={theme} onPress={() => router.push('/ajuda' as any)} />
        <ConfigItem icon="information-circle-outline" label="Sobre o aplicativo" color="#10B981" theme={theme} onPress={() => router.push('/sobre' as any)} />
        <ConfigItem icon="document-text-outline" label="Termos e privacidade" color="#94A3B8" theme={theme} onPress={() => router.push('/termos' as any)} />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={theme.danger} />
          <Text style={styles.logoutText}>Encerrar sessao</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.subText }]}>Desmobile v2.2.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ConfigItem({ icon, label, color, theme, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.configCard, { backgroundColor: theme.card }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardLeft}>
        <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.cardText, { color: theme.text }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.subText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 120, paddingTop: 45, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 12, marginLeft: 5 },
  configCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 20, marginBottom: 10, elevation: 3 },
  syncCard: { padding: 16, borderRadius: 20, marginBottom: 10, elevation: 3 },
  syncCopy: { marginBottom: 14 },
  syncSubText: { marginTop: 8, fontSize: 13, lineHeight: 19 },
  syncAction: { alignSelf: 'flex-start', minWidth: 112 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardText: { fontSize: 16, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, padding: 10 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  versionContainer: { alignItems: 'center', marginTop: 15, marginBottom: 40 },
  versionText: { fontSize: 11, fontWeight: 'bold', opacity: 0.5 },
});
