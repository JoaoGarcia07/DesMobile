import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './_layout'; // Integrado ao seu tema global

const { width } = Dimensions.get('window');

export default function AjudaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
  };

  const abrirEmail = () => {
    Linking.openURL('mailto:suporte@desbravadores.com?subject=Suporte App');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header Premium com Título no Topo */}
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AJUDA</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.title, { color: theme.text }]}>Como podemos ajudar?</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>Tire suas dúvidas ou entre em contato com o QG.</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Perguntas Frequentes</Text>
          
          <FaqItem 
            theme={theme} 
            pergunta="Como altero minha senha?" 
            resposta="Vá em Configurações > Segurança > Recuperar Acesso para definir uma nova credencial." 
          />
          <FaqItem 
            theme={theme} 
            pergunta="O app funciona offline?" 
            resposta="Sim, requisitos e manuais ficam salvos, mas a Agenda e Ranking exigem conexão." 
          />
          <FaqItem 
            theme={theme} 
            pergunta="Erro de conexão com o servidor?" 
            resposta="Verifique se a API do DesbravadoresTeste está rodando na máquina host e se o celular está na mesma rede Wi-Fi." 
          />

          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 30 }]}>Ainda com dúvidas?</Text>
          
          {/* Card de Contato Estilo Elite */}
          <TouchableOpacity style={styles.contactCard} onPress={abrirEmail} activeOpacity={0.9}>
            <LinearGradient colors={['#6b8e23', '#4a6318']} style={styles.contactGradient}>
              <View style={styles.contactIcon}>
                <Ionicons name="mail" size={28} color="white" />
              </View>
              <View>
                <Text style={styles.contactTitle}>Falar com o Suporte</Text>
                <Text style={styles.contactSub}>suporte@desbravadores.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" style={{ marginLeft: 'auto' }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function FaqItem({ theme, pergunta, resposta }: any) {
  const [aberto, setAberto] = React.useState(false);

  return (
    <TouchableOpacity 
      style={[styles.faqCard, { backgroundColor: theme.card }]} 
      onPress={() => setAberto(!aberto)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqText, { color: theme.text }]}>{pergunta}</Text>
        <Ionicons name={aberto ? "chevron-up" : "add"} size={22} color={theme.accent} />
      </View>
      {aberto && <Text style={[styles.faqAnswer, { color: theme.subText }]}>{resposta}</Text>}
    </TouchableOpacity>
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
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  scrollContent: { paddingBottom: 40 },
  welcomeSection: { padding: 25, paddingTop: 30 },
  title: { fontSize: 26, fontWeight: 'bold' },
  subtitle: { fontSize: 15, marginTop: 8, lineHeight: 22 },
  content: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 1, marginBottom: 15, marginLeft: 5 },
  faqCard: { padding: 20, borderRadius: 22, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqText: { fontSize: 15, fontWeight: 'bold', flex: 1, marginRight: 10 },
  faqAnswer: { marginTop: 12, fontSize: 14, lineHeight: 22, opacity: 0.8 },
  contactCard: { borderRadius: 25, overflow: 'hidden', marginTop: 10, elevation: 8 },
  contactGradient: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  contactIcon: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 18, marginRight: 15 },
  contactTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  contactSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }
});
