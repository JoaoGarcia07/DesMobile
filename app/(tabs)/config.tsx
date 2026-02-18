import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../_layout'; //

export default function ConfigScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      {/* Header com Título no Topo */}
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONFIGURAÇÕES</Text>
      </LinearGradient>

      <View style={styles.content}>
        
        {/* SEÇÃO: APARÊNCIA */}
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>APARÊNCIA</Text>
        <View style={[styles.configCard, { backgroundColor: theme.card }]}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#6366F120' }]}>
              <Ionicons name="moon" size={22} color="#6366F1" />
            </View>
            <Text style={[styles.cardText, { color: theme.text }]}>Modo Escuro</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: theme.accent }}
          />
        </View>

        {/* SEÇÃO: SEGURANÇA E ACESSO */}
        <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 25 }]}>SEGURANÇA</Text>
        <ConfigItem 
          icon="person-outline" 
          label="Editar Perfil" 
          color="#3B82F6" 
          theme={theme} 
          onPress={() => router.push('/editar-perfil' as any)} 
        />
        <ConfigItem 
          icon="key-outline" 
          label="Alterar Senha" 
          color="#FF4757" 
          theme={theme} 
          onPress={() => router.push('/alterar-senha' as any)} // Restaurado
        />

        {/* SEÇÃO: GERENCIAMENTO */}
        <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 25 }]}>GERENCIAMENTO</Text>
        <ConfigItem 
          icon="add-circle-outline" 
          label="Adicionar Atividade" 
          color={theme.accent} 
          theme={theme} 
          onPress={() => router.push('/adicionar' as any)} 
        />
        <ConfigItem 
          icon="calendar-outline" 
          label="Gerenciar Agenda" 
          color="#1E90FF" 
          theme={theme} 
          onPress={() => router.push('/agenda' as any)} 
        />

        {/* SEÇÃO: SUPORTE E INFORMAÇÕES */}
        <Text style={[styles.sectionTitle, { color: theme.subText, marginTop: 25 }]}>SUPORTE E SOBRE</Text>
        <ConfigItem 
          icon="help-buoy-outline" 
          label="Central de Ajuda" 
          color="#F59E0B" 
          theme={theme} 
          onPress={() => router.push('/ajuda' as any)} // Restaurado
        />
        <ConfigItem 
          icon="information-circle-outline" 
          label="Sobre o Aplicativo" 
          color="#10B981" 
          theme={theme} 
          onPress={() => router.push('/sobre' as any)} // Restaurado
        />
        <ConfigItem 
          icon="document-text-outline" 
          label="Termos e Privacidade" 
          color="#94A3B8" 
          theme={theme} 
          onPress={() => router.push('/termos' as any)} 
        />

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Encerrar Sessão</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: theme.subText }]}>Desmobile v2.1.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ConfigItem({ icon, label, color, theme, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.configCard, { backgroundColor: theme.card }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.cardText, { color: theme.text }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.subText} />
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
  content: { padding: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 12, marginLeft: 5 },
  configCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 15, 
    borderRadius: 20, 
    marginBottom: 10,
    elevation: 3
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardText: { fontSize: 16, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, padding: 10 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  versionContainer: { alignItems: 'center', marginTop: 15, marginBottom: 40 },
  versionText: { fontSize: 11, fontWeight: 'bold', opacity: 0.5 }
});