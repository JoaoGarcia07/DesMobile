import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConfigScreen() {
  const [notificacoes, setNotificacoes] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Configurações</Text>

      {/* Seção: Conta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <ConfigItem icon="person-outline" label="Editar Perfil" onPress={() => {}} />
        <ConfigItem icon="lock-closed-outline" label="Alterar Senha" onPress={() => {}} />
        <ConfigItem icon="shield-checkmark-outline" label="Privacidade" onPress={() => {}} />
      </View>

      {/* Seção: Preferências */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        
        <View style={styles.itemRow}>
          <View style={styles.iconLabel}>
            <Ionicons name="notifications-outline" size={22} color="#6b8e23" />
            <Text style={styles.itemText}>Notificações</Text>
          </View>
          <Switch 
            value={notificacoes} 
            onValueChange={setNotificacoes}
            trackColor={{ false: "#767577", true: "#6b8e23" }}
          />
        </View>

        <View style={styles.itemRow}>
          <View style={styles.iconLabel}>
            <Ionicons name="moon-outline" size={22} color="#6b8e23" />
            <Text style={styles.itemText}>Modo Escuro</Text>
          </View>
          <Switch 
            value={modoEscuro} 
            onValueChange={setModoEscuro}
            trackColor={{ false: "#767577", true: "#6b8e23" }}
          />
        </View>
      </View>

      {/* Seção: Suporte */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        <ConfigItem icon="help-circle-outline" label="Central de Ajuda" onPress={() => {}} />
        <ConfigItem icon="document-text-outline" label="Termos de Uso" onPress={() => {}} />
        <ConfigItem icon="information-circle-outline" label="Sobre o App" onPress={() => {}} />
      </View>

      <Text style={styles.version}>Versão 1.0.0</Text>
    </ScrollView>
  );
}

// Componente para itens clicáveis
function ConfigItem({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.itemRow} onPress={onPress}>
      <View style={styles.iconLabel}>
        <Ionicons name={icon} size={22} color="#6b8e23" />
        <Text style={styles.itemText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 60, marginBottom: 30 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', marginBottom: 10, textTransform: 'uppercase' },
  itemRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 8,
    elevation: 1
  },
  iconLabel: { flexDirection: 'row', alignItems: 'center' },
  itemText: { fontSize: 16, color: '#333', marginLeft: 15 },
  version: { textAlign: 'center', color: '#CCC', marginTop: 20, marginBottom: 40, fontSize: 12 }
});