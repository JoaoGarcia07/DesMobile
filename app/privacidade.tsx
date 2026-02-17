import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './_layout'; // Integrado ao Modo Escuro

export default function PrivacidadeScreen() {
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
        <Ionicons name="shield-half" size={50} color="#6b8e23" />
        <Text style={[styles.title, { color: theme.text }]}>Privacidade</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>Sua segurança é nossa prioridade.</Text>
      </View>

      <View style={styles.content}>
        <PoliticaItem 
          theme={theme} 
          titulo="Coleta de Dados" 
          texto="Coletamos apenas informações essenciais para a gestão do clube, como nome, unidade e cargo, armazenados com segurança em nosso banco de dados local." 
        />
        
        <PoliticaItem 
          theme={theme} 
          titulo="Segurança da Rede" 
          texto="As requisições são feitas via protocolo HTTP dentro da sua rede local (IP 192.168.100.85), garantindo que seus dados não saiam do ambiente controlado." 
        />

        <PoliticaItem 
          theme={theme} 
          titulo="Compartilhamento" 
          texto="O aplicativo Desbravadores não compartilha suas informações pessoais com terceiros ou empresas de publicidade." 
        />

        <PoliticaItem 
          theme={theme} 
          titulo="Seus Direitos" 
          texto="Você pode solicitar a exclusão total dos seus dados ou a alteração de senha a qualquer momento através das configurações da conta." 
        />
      </View>

      <View style={styles.footerSpacer} />
    </ScrollView>
  );
}

function PoliticaItem({ theme, titulo, texto }: any) {
  return (
    <View style={[styles.itemBox, { backgroundColor: theme.card }]}>
      <Text style={[styles.itemTitle, { color: theme.text }]}>{titulo}</Text>
      <Text style={[styles.itemText, { color: theme.subText }]}>{texto}</Text>
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
  itemBox: { padding: 20, borderRadius: 15, marginBottom: 15, elevation: 2 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  itemText: { fontSize: 15, lineHeight: 22 },
  footerSpacer: { height: 50 }
});