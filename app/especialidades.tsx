import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { clearSession, isUnauthorizedError } from '../api';
import { createStudentTheme } from '../constants/tokens';
import { normalizeAccentColor, resolveBackendIconName, specialtyStatusColor, specialtyStatusLabel, type SpecialtyProgressItem } from '../lib/desbravadores';
import { dispatchStudentNotifications } from '../lib/notifications';
import { readCachedOrFetchStudentBundle, syncStudentBundle, type StudentBundle } from '../lib/student-cache';
import { useAppSync, useTheme } from './_layout';

const { width } = Dimensions.get('window');

function resolveIconSize(size?: number | null, fallback = 28) {
  const parsed = Number(size);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.max(18, Math.min(parsed, 72));
}

function getItems(bundle: StudentBundle | null) {
  return bundle?.specialtiesProgress?.items || [];
}

export default function EspecialidadesScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { refreshVersion, isRefreshing, triggerRefresh } = useAppSync();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState<StudentBundle | null>(null);

  const theme = createStudentTheme(isDarkMode);

  useEffect(() => {
    let active = true;

    const loadSpecialties = async () => {
      try {
        const cachedBundle = await readCachedOrFetchStudentBundle({ notify: dispatchStudentNotifications });

        if (active) {
          setBundle(cachedBundle);
          setLoading(false);
        }

        const freshBundle = await syncStudentBundle({ notify: dispatchStudentNotifications });
        if (active) {
          setBundle(freshBundle);
        }
      } catch (error) {
        if (isUnauthorizedError(error)) {
          await clearSession();
          router.replace('/');
          return;
        }

        if (active) {
          setLoading(false);
        }
      }
    };

    loadSpecialties();

    return () => {
      active = false;
    };
  }, [refreshVersion, router]);

  const progress = bundle?.specialtiesProgress || null;
  const filteredItems = useMemo(() => {
    const items = getItems(bundle);
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => {
      const name = item.name.toLowerCase();
      const area = item.area.toLowerCase();
      return name.includes(query) || area.includes(query);
    });
  }, [bundle, search]);

  const renderCard = ({ item }: { item: SpecialtyProgressItem }) => {
    const accentColor = normalizeAccentColor(item.accentColor, specialtyStatusColor(item.status));
    const iconName = resolveBackendIconName(item.iconName, 'ribbon');
    const iconSize = resolveIconSize(item.iconSize);

    return (
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]} activeOpacity={0.9}>
        <View style={[styles.iconCircle, { backgroundColor: `${accentColor}20` }]}>
          {item.iconImageUrlResolved ? (
            <Image source={{ uri: item.iconImageUrlResolved }} style={{ width: iconSize, height: iconSize, borderRadius: 12 }} resizeMode="contain" />
          ) : (
            <Ionicons name={iconName} size={iconSize} color={accentColor} />
          )}
        </View>
        <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.cardArea, { color: theme.subText }]} numberOfLines={1}>{item.area}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${specialtyStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: specialtyStatusColor(item.status) }]}>{specialtyStatusLabel(item.status)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1000' }}
      style={styles.container}
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Especialidades</Text>
            <Text style={[styles.headerSub, { color: theme.subText }]}>
              {progress?.completedSpecialties || 0} concluidas de {progress?.totalSpecialties || 0}
            </Text>
          </View>
        </View>

        <View style={[styles.searchBox, { backgroundColor: theme.card }]}>
          <Ionicons name="search" size={20} color={theme.subText} />
          <TextInput
            placeholder="O que vamos aprender hoje?"
            placeholderTextColor={theme.subText}
            style={[styles.searchInput, { color: theme.text }]}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.accent} />
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            numColumns={2}
            keyExtractor={(item) => String(item.id)}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
            renderItem={renderCard}
            ListEmptyComponent={
              <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhuma especialidade encontrada</Text>
                <Text style={[styles.emptyText, { color: theme.subText }]}>
                  As especialidades cadastradas no DesbravadoresTeste aparecerao aqui.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 5 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: 60, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  backBtn: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 5 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', letterSpacing: -1 },
  headerSub: { fontSize: 13, fontWeight: '600' },
  searchBox: { marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 50, borderRadius: 15, marginBottom: 20, elevation: 10 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '500' },
  row: { justifyContent: 'space-around', paddingHorizontal: 10 },
  list: { paddingBottom: 50, flexGrow: 1 },
  card: { width: (width - 60) / 2, padding: 18, borderRadius: 25, marginBottom: 15, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2 },
  iconCircle: { width: 72, height: 72, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' },
  cardTitle: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  cardArea: { fontSize: 11, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  statusBadge: { marginTop: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  statusText: { fontSize: 11, fontWeight: '700' },
  emptyState: { marginHorizontal: 20, marginTop: 40, padding: 24, borderRadius: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
