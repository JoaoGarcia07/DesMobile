import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { LinearGradient } from 'expo-linear-gradient'; 
import api from '../../api'; 
import { useTheme } from '../_layout'; 

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter(); 
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({ unidade: "Unidade Águia" });

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23'
  };

  useEffect(() => {
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
      <View style={[styles.centered, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      {/* Header com a imagem de fundo */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000' }} 
        style={styles.headerImage}
      >
        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={styles.overlay}>
          {/* Barra de Pesquisa centralizada na imagem */}
          <View style={styles.searchWrapper}>
             <Ionicons name="search" size={20} color="#AAA" style={styles.searchIcon} />
             <TextInput 
                placeholder="Pesquisar atividades..." 
                placeholderTextColor="#AAA"
                style={styles.searchInput} 
             />
          </View>
        </LinearGradient>
      </ImageBackground>

      {/* Conteúdo principal - Ajustado para não ficar colado */}
      <View style={styles.content}>
        <Text style={[styles.welcomeText, { color: theme.text }]}>Olá, Desbravador!</Text>
        
        {/* Card Principal */}
        <TouchableOpacity 
          style={styles.mainCardShadow}
          activeOpacity={0.9}
          onPress={() => router.push("/unidade-aguia" as any)}
        >
          <LinearGradient colors={['#2C3E50', '#000000']} style={styles.mainCardGradient}>
            <View style={styles.mainCardContent}>
               <View style={styles.shieldCircle}>
                  <Ionicons name="shield-half" size={40} color="white" />
               </View>
               <View>
                  <Text style={styles.mainCardTitle}>{info.unidade}</Text>
                  <Text style={styles.mainCardSub}>Clique para ver detalhes</Text>
               </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.3)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Grade de atalhos */}
        <View style={styles.grid}>
          <ShortcutCard 
            title="Unidade" icon="people" color="#FF9F43" 
            onPress={() => router.push("/unidade" as any)} 
            theme={theme}
          />
          <ShortcutCard 
            title="Especialidades" icon="ribbon" color="#00D2D3" 
            onPress={() => router.push("/especialidades" as any)}
            theme={theme}
          />
          <ShortcutCard 
            title="Agenda" icon="calendar" color="#54A0FF" 
            onPress={() => router.push("/agenda" as any)}
            theme={theme}
          />
          <ShortcutCard 
            title="Requisitos" icon="list" color="#10AC84" 
            onPress={() => router.push("/requisitos" as any)}
            theme={theme}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function ShortcutCard({ title, icon, color, onPress, theme }: any) {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.cardText, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerImage: { width: '100%', height: 260 },
  overlay: { flex: 1, justifyContent: 'center', padding: 20 },
  searchWrapper: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50, elevation: 5 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#333', fontSize: 16 },
  content: { 
    padding: 20, 
    marginTop: 10, // Corrigido: Valor positivo para afastar da imagem
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30 
  },
  welcomeText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    marginTop: 5 // Pequeno ajuste adicional para respiro visual
  },
  mainCardShadow: { borderRadius: 25, elevation: 8, marginBottom: 25 },
  mainCardGradient: { padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mainCardContent: { flexDirection: 'row', alignItems: 'center' },
  shieldCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  mainCardTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  mainCardSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: (width - 55) / 2, height: 130, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 3 },
  iconBox: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  cardText: { fontWeight: 'bold', fontSize: 14 }
});