import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER COM IMAGEM E PESQUISA */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1000' }} 
        style={styles.headerImage}
      >
        <View style={styles.overlay}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput 
              placeholder="Pesquisar atividades..." 
              style={styles.searchInput}
              placeholderTextColor="#888"
            />
            <Ionicons name="menu" size={24} color="#6b8e23" />
          </View>
        </View>
      </ImageBackground>

      {/* PAINEL PRINCIPAL */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Olá, Desbravador!</Text>
        <Text style={styles.subtitle}>O que vamos fazer hoje?</Text>

        {/* CARD DE DESTAQUE (ESCUDO/UNIDADE) */}
        <TouchableOpacity style={styles.mainCard}>
          <View style={styles.mainCardContent}>
            <Ionicons name="shield-half" size={50} color="white" />
            <Text style={styles.mainCardTitle}>Unidade Águia</Text>
          </View>
        </TouchableOpacity>

        {/* GRADE DE ATALHOS (GRID) */}
        <View style={styles.grid}>
          <ShortcutCard 
            title="Minha Unidade" 
            icon="people" 
            color="#FFF4E0" 
            onPress={() => {}} 
          />
          <ShortcutCard 
            title="Especialidades" 
            icon="ribbon" 
            color="#E3F2FD" 
            onPress={() => {}} 
          />
          <ShortcutCard 
            title="Agenda" 
            icon="calendar" 
            color="#F1F8E9" 
            onPress={() => router.push('/agenda')} 
          />
          <ShortcutCard 
            title="Requisitos" 
            icon="list" 
            color="#FFFDE7" 
            onPress={() => {}} 
          />
        </View>
      </View>
    </ScrollView>
  );
}

// Componente para os Cards da Grade
function ShortcutCard({ title, icon, color, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: color }]} 
      onPress={onPress}
    >
      <Ionicons name={icon} size={32} color="#6b8e23" />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerImage: { width: '100%', height: 220 },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    justifyContent: 'center', 
    paddingHorizontal: 20 
  },
  searchBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  content: { padding: 20 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  mainCard: {
    backgroundColor: '#2C3E50',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  mainCardContent: { alignItems: 'center' },
  mainCardTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  card: {
    width: (width - 60) / 2,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardText: { marginTop: 10, fontWeight: '600', color: '#333', textAlign: 'center' }
});