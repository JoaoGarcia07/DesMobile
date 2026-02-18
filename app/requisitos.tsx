import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './_layout'; 

export default function RequisitosScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const theme = {
    overlay: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.85)',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
    border: isDarkMode ? '#334155' : '#E2E8F0',
  };

  // Exemplo de requisitos para a classe de Amigo (ou qualquer classe/especialidade)
  const [requisitos, setRequisitos] = useState([
    { id: '1', titulo: 'Memorizar o Voto e a Lei', concluido: true, categoria: 'Geral' },
    { id: '2', titulo: 'Ler o livro do ano', concluido: false, categoria: 'Leitura' },
    { id: '3', titulo: 'Completar a especialidade de Culinária', concluido: true, categoria: 'Especialidades' },
    { id: '4', titulo: 'Participar de um acampamento de unidade', concluido: false, categoria: 'Atividades' },
    { id: '5', titulo: 'Apresentar um estudo bíblico', concluido: false, categoria: 'Espiritual' },
  ]);

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?q=80&w=1000' }} 
      style={styles.container}
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Requisitos</Text>
            <Text style={[styles.headerSub, { color: theme.subText }]}>Classe de Amigo</Text>
          </View>
        </View>

        {/* Card de Progresso Geral */}
        <View style={[styles.progressCard, { backgroundColor: theme.card }]}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: theme.text }]}>Seu Progresso</Text>
            <Text style={[styles.progressValue, { color: theme.accent }]}>40%</Text>
          </View>
          <View style={[styles.progressBarBase, { backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }]}>
            <View style={[styles.progressBarFill, { width: '40%', backgroundColor: theme.accent }]} />
          </View>
        </View>

        <FlatList
          data={requisitos}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.itemCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              activeOpacity={0.7}
            >
              <View style={styles.itemContent}>
                <View style={[styles.checkCircle, { backgroundColor: item.concluido ? theme.accent : 'transparent', borderColor: theme.accent }]}>
                  {item.concluido && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <View style={styles.itemTexts}>
                  <Text style={[styles.itemTitle, { color: theme.text, textDecorationLine: item.concluido ? 'line-through' : 'none' }]}>
                    {item.titulo}
                  </Text>
                  <Text style={[styles.itemCategory, { color: theme.subText }]}>{item.categoria}</Text>
                </View>
              </View>
              <Ionicons name="information-circle-outline" size={22} color={theme.subText} />
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 60, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  backBtn: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 4 },
  headerTitle: { fontSize: 26, fontWeight: 'bold' },
  headerSub: { fontSize: 14, fontWeight: '600' },
  progressCard: { padding: 20, borderRadius: 20, marginBottom: 25, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressLabel: { fontSize: 16, fontWeight: 'bold' },
  progressValue: { fontSize: 18, fontWeight: 'bold' },
  progressBarBase: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  list: { paddingBottom: 40 },
  itemCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderRadius: 18, marginBottom: 12, borderWidth: 1, elevation: 2 },
  itemContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkCircle: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemTexts: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  itemCategory: { fontSize: 12, marginTop: 4, fontWeight: '500' }
});