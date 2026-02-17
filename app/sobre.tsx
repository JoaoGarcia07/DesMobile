import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './_layout'; // Importando seu tema global

const { width } = Dimensions.get('window');

export default function SobreScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#121212' : '#F8F9FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    subText: isDarkMode ? '#AAAAAA' : '#666666',
    border: isDarkMode ? '#333' : '#EEE',
  };

  const equipe = [
    { nome: "João Garcia", github: "https://github.com/JoaoGarcia07" },
    { nome: "Arthur Vieira", github: "https://github.com/ArthurVieiraaa" },
    { nome: "Silas Tristoni", github: "https://github.com/SilasTristoni" },
    { nome: "Felipe Fernando", github: "https://github.com/FelipeFernando04" },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho com botão de voltar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={isDarkMode ? "white" : "#333"} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Ionicons name="shield-checkmark" size={70} color="#6b8e23" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Desbravadores</Text>
        <Text style={styles.version}>Versão 1.0.0</Text>
      </View>

      <View style={styles.content}>
        {/* Card: Missão */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Nossa Missão</Text>
          <Text style={[styles.description, { color: theme.subText }]}>
            Desenvolver jovens através de atividades práticas, espirituais e sociais, utilizando a tecnologia como aliada na gestão do clube.
          </Text>
        </View>

        {/* Card: Equipe de Desenvolvimento */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Equipe de Desenvolvimento</Text>
          
          {equipe.map((membro, index) => (
            <View key={index} style={[styles.membroRow, { borderBottomWidth: index === equipe.length - 1 ? 0 : 1, borderBottomColor: theme.border }]}>
              <View style={styles.membroInfo}>
                <Ionicons name="person-circle-outline" size={32} color="#6b8e23" />
                <Text style={[styles.membroNome, { color: theme.text }]}>{membro.nome}</Text>
              </View>
              <TouchableOpacity 
                style={styles.miniGithub} 
                onPress={() => Linking.openURL(membro.github)}
              >
                <Ionicons name="logo-github" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Card: Tecnologias */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Tecnologias</Text>
          <View style={styles.techGrid}>
            <View style={styles.tag}><Text style={styles.tagText}>React Native</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>Expo</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>SQLite</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>Node.js</Text></View>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>© 2026 Clube de Desbravadores</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { marginTop: 50, paddingHorizontal: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  logoCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(107, 142, 35, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 28, fontWeight: 'bold' },
  version: { fontSize: 14, color: '#6b8e23', fontWeight: 'bold' },
  content: { paddingHorizontal: 20 },
  card: { borderRadius: 20, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  description: { fontSize: 15, lineHeight: 22 },
  membroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  membroInfo: { flexDirection: 'row', alignItems: 'center' },
  membroNome: { marginLeft: 12, fontSize: 16, fontWeight: '500' },
  miniGithub: { backgroundColor: '#333', padding: 8, borderRadius: 10 },
  techGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: '#6b8e23', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  tagText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  footer: { textAlign: 'center', color: '#999', fontSize: 12, marginBottom: 40 }
});