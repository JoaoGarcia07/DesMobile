import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Dimensions, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './_layout'; 

const { width } = Dimensions.get('window');

export default function EspecialidadesScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [search, setSearch] = useState('');

  const theme = {
    overlay: isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(241, 245, 249, 0.9)',
    card: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    input: isDarkMode ? '#334155' : '#E2E8F0',
  };

  const especialidades = [
    { id: '1', nome: 'Astronomia', area: 'Ciência', cor: '#6366F1', icon: 'star' },
    { id: '2', nome: 'Culinária', area: 'Artes Domésticas', cor: '#F59E0B', icon: 'restaurant' },
    { id: '3', nome: 'Resgate Básico', area: 'Saúde', cor: '#EF4444', icon: 'medkit' },
    { id: '4', nome: 'Pioneiria', area: 'Habilidades', cor: '#10B981', icon: 'hammer' },
    { id: '5', nome: 'Vida Selvagem', area: 'Estudo da Natureza', cor: '#06B6D4', icon: 'leaf' },
    { id: '6', nome: 'Oratória', area: 'Comunicação', cor: '#EC4899', icon: 'mic' },
    { id: '7', nome: 'Excursionismo', area: 'Ativ. Recreativas', cor: '#8B5CF6', icon: 'mow-outline' },
    { id: '8', nome: 'Liderança', area: 'Ativ. Missionárias', cor: '#F97316', icon: 'flag' },
  ];

  const filtradas = especialidades.filter(e => e.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1000' }} 
      style={styles.container}
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        
        {/* Header Profissional */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Especialidades</Text>
            <Text style={[styles.headerSub, { color: theme.subText }]}>Exploração e Conhecimento</Text>
          </View>
        </View>

        {/* Busca com Transparência */}
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

        <FlatList
          data={filtradas}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={[styles.iconCircle, { backgroundColor: item.cor + '20' }]}>
                <Ionicons name={item.icon as any} size={28} color={item.cor} />
              </View>
              <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{item.nome}</Text>
              <Text style={[styles.cardArea, { color: theme.subText }]} numberOfLines={1}>{item.area}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 5 },
  header: { marginTop: 60, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  backBtn: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 5 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', letterSpacing: -1 },
  headerSub: { fontSize: 13, fontWeight: '600' },
  searchBox: { marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 50, borderRadius: 15, marginBottom: 20, elevation: 10 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '500' },
  row: { justifyContent: 'space-around', paddingHorizontal: 10 },
  list: { paddingBottom: 50 },
  card: { width: (width - 60) / 2, padding: 18, borderRadius: 25, marginBottom: 15, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2 },
  iconCircle: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  cardArea: { fontSize: 11, fontWeight: '600', marginTop: 4 },
});