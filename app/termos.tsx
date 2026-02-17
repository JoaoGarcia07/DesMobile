import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './_layout'; // Integrado ao seu tema global

export default function TermosScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#121212' : '#F8F9FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    subText: isDarkMode ? '#AAAAAA' : '#666666',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      {/* Botão Voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color={isDarkMode ? "white" : "#333"} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Ionicons name="document-text" size={50} color="#6b8e23" />
        <Text style={[styles.title, { color: theme.text }]}>Termos de Uso</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>Última atualização: Fevereiro de 2026</Text>
      </View>

      <View style={styles.content}>
        <TermoTopico 
          theme={theme} 
          titulo="1. Aceitação dos Termos" 
          texto="Ao acessar o aplicativo Desbravadores, você concorda em cumprir estes termos de serviço e todas as leis e regulamentos aplicáveis." 
        />
        
        <TermoTopico 
          theme={theme} 
          titulo="2. Uso da Conta" 
          texto="Você é responsável por manter a confidencialidade dos seus dados de login e por todas as atividades que ocorrem em sua conta." 
        />

        <TermoTopico 
          theme={theme} 
          titulo="3. Conduta do Usuário" 
          texto="O usuário compromete-se a não utilizar o aplicativo para fins ilícitos ou que prejudiquem o funcionamento do sistema e a integridade dos dados." 
        />

        <TermoTopico 
          theme={theme} 
          titulo="4. Privacidade e Dados" 
          texto="A coleta de dados é realizada para fins de gestão do clube, conforme as configurações de IP do servidor local (192.168.100.85)." 
        />
      </View>

      <View style={styles.footerSpacer} />
    </ScrollView>
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
  backButton: { marginTop: 50, marginLeft: 20, width: 40 },
  header: { alignItems: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 10 },
  subtitle: { fontSize: 14, marginTop: 5 },
  content: { paddingHorizontal: 20 },
  topicContainer: { padding: 20, borderRadius: 15, marginBottom: 15, elevation: 2 },
  topicTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  topicText: { fontSize: 15, lineHeight: 22 },
  footerSpacer: { height: 50 }
});