import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './_layout'; // Caminho corrigido para evitar erros de importação

const { width } = Dimensions.get('window');

export default function RequisitosScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
    border: isDarkMode ? '#334155' : '#E2E8F0',
  };

  const [requisitos] = useState([
    { id: '1', titulo: 'Memorizar o Voto e a Lei', concluido: true, categoria: 'Geral', icon: 'ribbon' },
    { id: '2', titulo: 'Ler o livro do ano', concluido: false, categoria: 'Leitura', icon: 'book' },
    { id: '3', titulo: 'Especialidade de Culinária', concluido: true, categoria: 'Especialidades', icon: 'restaurant' },
    { id: '4', titulo: 'Acampamento de unidade', concluido: false, categoria: 'Atividades', icon: 'bonfire' },
    { id: '5', titulo: 'Apresentar estudo bíblico', concluido: false, categoria: 'Espiritual', icon: 'library' },
  ]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header Elite - Título no topo */}
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>REQUISITOS</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Card de Progresso Gamificado */}
        <View style={[styles.progressCard, { backgroundColor: theme.card }]}>
          <View style={styles.progressInfo}>
            <View>
              <Text style={[styles.progressLabel, { color: theme.text }]}>Classe de Amigo</Text>
              <Text style={[styles.progressSub, { color: theme.subText }]}>Faltam 3 missões</Text>
            </View>
            <Text style={[styles.progressValue, { color: theme.accent }]}>40%</Text>
          </View>
          <View style={[styles.progressBarBase, { backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }]}>
            <View style={[styles.progressBarFill, { width: '40%', backgroundColor: theme.accent }]} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Lista de Atividades</Text>

        <FlatList
          data={requisitos}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.itemCard, { backgroundColor: theme.card }]}
              activeOpacity={0.8}
            >
              <View style={styles.itemContent}>
                <View style={[
                  styles.checkCircle, 
                  { backgroundColor: item.concluido ? theme.accent : 'transparent', borderColor: theme.accent }
                ]}>
                  {item.concluido && <Ionicons name="checkmark-sharp" size={16} color="white" />}
                </View>
                
                <View style={styles.itemTexts}>
                  <Text style={[
                    styles.itemTitle, 
                    { color: theme.text, textDecorationLine: item.concluido ? 'line-through' : 'none', opacity: item.concluido ? 0.6 : 1 }
                  ]}>
                    {item.titulo}
                  </Text>
                  <View style={styles.categoryRow}>
                    <Ionicons name={item.icon as any} size={12} color={theme.accent} style={{marginRight: 5}} />
                    <Text style={[styles.itemCategory, { color: theme.subText }]}>{item.categoria}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.subText} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    height: 120, 
    paddingTop: 15, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  content: { flex: 1, padding: 20 },
  progressCard: { 
    padding: 22, 
    borderRadius: 25, 
    marginBottom: 30, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10,
    marginTop: -40 // Efeito de flutuação sobre o header
  },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  progressLabel: { fontSize: 18, fontWeight: 'bold' },
  progressSub: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  progressValue: { fontSize: 22, fontWeight: '900' },
  progressBarBase: { height: 10, borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 15, marginLeft: 5, textTransform: 'uppercase', letterSpacing: 1 },
  list: { paddingBottom: 20 },
  itemCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 18, 
    borderRadius: 22, 
    marginBottom: 12, 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05
  },
  itemContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkCircle: { width: 28, height: 28, borderRadius: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemTexts: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: 'bold', lineHeight: 20 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  itemCategory: { fontSize: 12, fontWeight: '700' }
});