import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './_layout'; // Importação corrigida para subir um nível

const { width } = Dimensions.get('window');

export default function TermosScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header Premium - Título posicionado no topo */}
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TERMOS E PRIVACIDADE</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerInfo}>
          <View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
            <Ionicons name="shield-checkmark" size={40} color={theme.accent} />
          </View>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Última atualização: 17 de Fevereiro de 2026
          </Text>
        </View>

        <View style={styles.content}>
          <TermoTopico 
            theme={theme} 
            titulo="1. Aceitação dos Termos" 
            texto="Ao acessar o aplicativo Desbravadores, você concorda em cumprir estes termos de serviço e todas as leis aplicáveis." 
          />
          
          <TermoTopico 
            theme={theme} 
            titulo="2. Uso da Conta e XP" 
            texto="Você é responsável pela integridade dos seus dados de login e pela conquista ética de XP e medalhas no sistema." 
          />

          <TermoTopico 
            theme={theme} 
            titulo="3. Conduta do Desbravador" 
            texto="O usuário compromete-se a utilizar o app para fins de crescimento no clube, respeitando a integridade dos dados e dos outros membros." 
          />

          <TermoTopico 
            theme={theme} 
            titulo="4. Privacidade de Dados" 
            texto="A coleta de dados (nome, unidade e progresso) serve para a gestão do clube e funciona via IP local (192.168.100.85)." 
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.subText }]}>
            Ao usar o Desmobile, você aceita nossa política de segurança.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function TermoTopico({ theme, titulo, texto }: any) {
  return (
    <View style={[styles.topicContainer, { backgroundColor: theme.card }]}>
      <Text style={[styles.topicTitle, { color: theme.text }]}>{titulo}</Text>
      <Text style={[styles.topicText, { color: theme.subText }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    height: 120, 
    paddingTop: 45, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
  scrollContent: { paddingBottom: 40 },
  headerInfo: { alignItems: 'center', padding: 30 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  subtitle: { fontSize: 13, fontWeight: '600' },
  content: { paddingHorizontal: 20 },
  topicContainer: { padding: 20, borderRadius: 22, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  topicTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 10 },
  topicText: { fontSize: 14, lineHeight: 22 },
  footer: { padding: 30, alignItems: 'center' },
  footerText: { fontSize: 12, textAlign: 'center', opacity: 0.7, fontWeight: '600' }
});