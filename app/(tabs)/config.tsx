import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../_layout'; // Importação crucial

export default function ConfigScreen() {
  const [notificacoes, setNotificacoes] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  // Cores dinâmicas baseadas no tema
  const theme = {
    bg: isDarkMode ? '#121212' : '#F8F9FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    subText: isDarkMode ? '#AAAAAA' : '#999999'
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.text }]}>Configurações</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <ConfigItem isDarkMode={isDarkMode} icon="person-outline" label="Editar Perfil" />
        <ConfigItem isDarkMode={isDarkMode} icon="lock-closed-outline" label="Alterar Senha" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        
        <View style={[styles.itemRow, { backgroundColor: theme.card }]}>
          <View style={styles.iconLabel}>
            <Ionicons name="notifications-outline" size={22} color="#6b8e23" />
            <Text style={[styles.itemText, { color: theme.text }]}>Notificações</Text>
          </View>
          <Switch value={notificacoes} onValueChange={setNotificacoes} trackColor={{ false: "#767577", true: "#6b8e23" }} />
        </View>

        {/* INTERRUPTOR DO MODO ESCURO CONECTADO AO LAYOUT */}
        <View style={[styles.itemRow, { backgroundColor: theme.card }]}>
          <View style={styles.iconLabel}>
            <Ionicons name="moon-outline" size={22} color="#6b8e23" />
            <Text style={[styles.itemText, { color: theme.text }]}>Modo Escuro</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={toggleTheme} trackColor={{ false: "#767577", true: "#6b8e23" }} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        <ConfigItem isDarkMode={isDarkMode} icon="help-circle-outline" label="Central de Ajuda" />
        <ConfigItem isDarkMode={isDarkMode} icon="information-circle-outline" label="Sobre o App" />
      </View>

      <Text style={styles.version}>Versão 1.0.0</Text>
    </ScrollView>
  );
}

function ConfigItem({ icon, label, isDarkMode }: any) {
  const cardColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#333333';

  return (
    <TouchableOpacity style={[styles.itemRow, { backgroundColor: cardColor }]}>
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