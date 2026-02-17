import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { useTheme } from '../_layout'; 

export default function ConfigScreen() {
  const router = useRouter();
  const [notificacoes, setNotificacoes] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  // Cores dinâmicas baseadas no tema global
  const theme = {
    bg: isDarkMode ? '#121212' : '#F8F9FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    subText: isDarkMode ? '#AAAAAA' : '#999999'
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.text }]}>Configurações</Text>

      {/* Seção: Conta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        
        <ConfigItem 
          isDarkMode={isDarkMode} 
          icon="person-outline" 
          label="Editar Perfil" 
          onPress={() => router.push("/editar-perfil" as any)} 
        />

        {/* Agora conectado à tela de Alterar Senha corrigida */}
        <ConfigItem 
          isDarkMode={isDarkMode} 
          icon="lock-closed-outline" 
          label="Alterar Senha" 
          onPress={() => router.push("/alterar-senha" as any)} 
        />
        
        <ConfigItem 
          isDarkMode={isDarkMode} 
          icon="shield-checkmark-outline" 
          label="Privacidade" 
          onPress={() => router.push("/privacidade" as any)} 
        />
      </View>

      {/* Seção: Preferências */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        
        <View style={[styles.itemRow, { backgroundColor: theme.card }]}>
          <View style={styles.iconLabel}>
            <Ionicons name="notifications-outline" size={22} color="#6b8e23" />
            <Text style={[styles.itemText, { color: theme.text }]}>Notificações</Text>
          </View>
          <Switch 
            value={notificacoes} 
            onValueChange={setNotificacoes} 
            trackColor={{ false: "#767577", true: "#6b8e23" }} 
          />
        </View>

        <View style={[styles.itemRow, { backgroundColor: theme.card }]}>
          <View style={styles.iconLabel}>
            <Ionicons name="moon-outline" size={22} color="#6b8e23" />
            <Text style={[styles.itemText, { color: theme.text }]}>Modo Escuro</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme} 
            trackColor={{ false: "#767577", true: "#6b8e23" }} 
          />
        </View>
      </View>

      {/* Seção: Suporte */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        
        <ConfigItem 
          isDarkMode={isDarkMode} 
          icon="help-circle-outline" 
          label="Central de Ajuda" 
          onPress={() => router.push("/ajuda" as any)} 
        />

        <ConfigItem 
          isDarkMode={isDarkMode} 
          icon="document-text-outline" 
          label="Termos de Uso" 
          onPress={() => router.push("/termos" as any)}
        />
        
        <ConfigItem 
          isDarkMode={isDarkMode} 
          icon="information-circle-outline" 
          label="Sobre o App" 
          onPress={() => router.push("/sobre" as any)} 
        />
      </View>

      <Text style={styles.version}>Versão 1.0.0</Text>
    </ScrollView>
  );
}

function ConfigItem({ icon, label, isDarkMode, onPress }: any) {
  const cardColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#333333';

  return (
    <TouchableOpacity 
      style={[styles.itemRow, { backgroundColor: cardColor }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconLabel}>
        <Ionicons name={icon} size={22} color="#6b8e23" />
        <Text style={[styles.itemText, { color: textColor }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginTop: 60, marginBottom: 30 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', marginBottom: 10, textTransform: 'uppercase' },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 12, marginBottom: 8, elevation: 1 },
  iconLabel: { flexDirection: 'row', alignItems: 'center' },
  itemText: { fontSize: 16, marginLeft: 15 },
  version: { textAlign: 'center', color: '#CCC', marginTop: 20, marginBottom: 40, fontSize: 12 }
});