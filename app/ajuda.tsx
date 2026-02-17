import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './_layout'; // Integrado ao seu Modo Escuro

export default function AjudaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#121212' : '#F8F9FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    subText: isDarkMode ? '#AAAAAA' : '#666666',
  };

  const abrirEmail = () => {
    Linking.openURL('mailto:suporte@desbravadores.com?subject=Suporte App');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      {/* Botão Voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color={isDarkMode ? "white" : "#333"} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Central de Ajuda</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>Como podemos ajudar você hoje?</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Perguntas Frequentes</Text>
        
        <FaqItem 
          theme={theme} 
          pergunta="Como altero minha senha?" 
          resposta="Vá em Configurações > Conta > Alterar Senha para definir uma nova credencial." 
        />
        <FaqItem 
          theme={theme} 
          pergunta="O app funciona offline?" 
          resposta="Sim, algumas funções como consulta de requisitos funcionam sem internet, mas a agenda exige conexão." 
        />
        <FaqItem 
          theme={theme} 
          pergunta="Erro de conexão com o servidor?" 
          resposta="Verifique se o servidor está rodando no IP 192.168.100.85 e se você está na mesma rede." 
        />

        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 30 }]}>Ainda precisa de ajuda?</Text>
        
        <TouchableOpacity style={styles.contactCard} onPress={abrirEmail}>
          <View style={styles.contactIcon}>
            <Ionicons name="mail" size={24} color="white" />
          </View>
          <View>
            <Text style={styles.contactTitle}>Falar com o Suporte</Text>
            <Text style={styles.contactSub}>suporte@desbravadores.com</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function FaqItem({ theme, pergunta, resposta }: any) {
  const [aberto, setAberto] = React.useState(false);

  return (
    <TouchableOpacity 
      style={[styles.faqCard, { backgroundColor: theme.card }]} 
      onPress={() => setAberto(!aberto)}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqText, { color: theme.text }]}>{pergunta}</Text>
        <Ionicons name={aberto ? "chevron-up" : "chevron-down"} size={20} color="#6b8e23" />
      </View>
      {aberto && <Text style={[styles.faqAnswer, { color: theme.subText }]}>{resposta}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { marginTop: 50, marginLeft: 20, width: 40 },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 5 },
  content: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  faqCard: { padding: 18, borderRadius: 15, marginBottom: 10, elevation: 2 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqText: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 10 },
  faqAnswer: { marginTop: 10, fontSize: 14, lineHeight: 20 },
  contactCard: { backgroundColor: '#6b8e23', flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginTop: 10, marginBottom: 50 },
  contactIcon: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 15, marginRight: 15 },
  contactTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  contactSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14 }
});