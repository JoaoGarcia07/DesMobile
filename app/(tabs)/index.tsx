import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api'; // Sobe dois níveis (tabs -> app -> raiz) para achar o api.js

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({ unidade: "Unidade Águia" });

  useEffect(() => {
    // Busca dados reais do seu servidor
    api.get('/api/home')
      .then(res => {
        setInfo(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Erro na Home:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6b8e23" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000' }} 
        style={styles.headerImage}
      >
        <View style={styles.overlay}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput placeholder="Pesquisar atividades..." style={styles.searchInput} />
          </View>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Olá, Desbravador!</Text>
        
        <TouchableOpacity style={styles.mainCard}>
          <Ionicons name="shield-half" size={50} color="white" />
          <Text style={styles.mainCardTitle}>{info.unidade}</Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          <ShortcutCard title="Unidade" icon="people" color="#FFF4E0" />
          <ShortcutCard title="Especialidades" icon="ribbon" color="#E3F2FD" />
          <ShortcutCard title="Agenda" icon="calendar" color="#F1F8E9" />
          <ShortcutCard title="Requisitos" icon="list" color="#FFFDE7" />
        </View>
      </View>
    </ScrollView>
  );
}

// Componente do Card de Atalho
function ShortcutCard({ title, icon, color }: any) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]}>
      <Ionicons name={icon} size={32} color="#4A6218" />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerImage: { width: '100%', height: 220 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', paddingHorizontal: 20 },
  searchBar: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 25, elevation: 5 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  content: { padding: 20 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  mainCard: { backgroundColor: '#2C3E50', borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 20 },
  mainCardTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: (width - 60) / 2, height: 120, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 2 },
  cardText: { marginTop: 10, fontWeight: 'bold', color: '#333' }
});