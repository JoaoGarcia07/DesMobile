import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTheme } from '../_layout'; 

// Configuração do calendário para Português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar','Abr','Mai','Jun','Jul.','Ago','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function AgendaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState('');

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
    calendarText: isDarkMode ? '#FFFFFF' : '#2d4150',
  };

  // Dados dos Eventos (Datas no formato YYYY-MM-DD)
  const eventos = [
    { id: '1', titulo: 'Acampamento Regional', data: '2026-02-20', hora: '08:00', xp: '500', cor: '#2ED573', tipo: 'Aventura', icon: 'bonfire' },
    { id: '2', titulo: 'Reunião de Unidade', data: '2026-02-22', hora: '14:30', xp: '100', cor: '#1E90FF', tipo: 'Treino', icon: 'people' },
    { id: '3', titulo: 'Investidura Especial', data: '2026-02-28', hora: '19:00', xp: '300', cor: '#FFA502', tipo: 'Conquista', icon: 'trophy' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header Estilizado */}
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>             AGENDA            </Text>
      </LinearGradient>

      {/* Seção do Calendário */}
      <View style={[styles.calendarWrapper, { backgroundColor: theme.card }]}>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: theme.accent },
            '2026-02-20': { marked: true, dotColor: '#2ED573' },
            '2026-02-22': { marked: true, dotColor: '#1E90FF' },
            '2026-02-28': { marked: true, dotColor: '#FFA502' },
          }}
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            textSectionTitleColor: theme.subText,
            selectedDayBackgroundColor: theme.accent,
            selectedDayTextColor: '#ffffff',
            todayTextColor: theme.accent,
            dayTextColor: theme.calendarText,
            textDisabledColor: isDarkMode ? '#334155' : '#d9e1e8',
            dotColor: theme.accent,
            monthTextColor: theme.accent,
            indicatorColor: theme.accent,
            textDayFontWeight: '600',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',
          }}
        />
      </View>

      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: theme.text }]}>Eventos Agendados</Text>
        <View style={styles.xpTotalBadge}>
          <Text style={styles.xpTotalText}>900 XP em Jogo</Text>
        </View>
      </View>

      <FlatList
        data={eventos}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.eventCard, { backgroundColor: theme.card }]}>
            <LinearGradient colors={[item.cor, item.cor + '99']} style={styles.typeIndicator} />
            
            <View style={styles.cardContent}>
              <View style={styles.infoWrapper}>
                <View style={styles.titleRow}>
                  <Ionicons name={item.icon as any} size={18} color={item.cor} style={{marginRight: 8}} />
                  <Text style={[styles.eventTitle, { color: theme.text }]}>{item.titulo}</Text>
                </View>
                <Text style={[styles.eventSub, { color: theme.subText }]}>
                  {item.data.split('-')[2]} de Fevereiro • {item.hora}
                </Text>
              </View>

              <LinearGradient colors={[item.cor + '15', item.cor + '30']} style={styles.xpBadge}>
                <Text style={[styles.xpValue, { color: item.cor }]}>+{item.xp}</Text>
                <Text style={[styles.xpLabel, { color: item.cor }]}>XP</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    height: 140, // Você pode aumentar para 150 se quiser mais espaço
    paddingTop: 20, // Diminuímos aqui para o texto subir
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 15 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: '900' },
  calendarWrapper: { 
    marginHorizontal: 20, 
    marginTop: -30, 
    borderRadius: 25, 
    padding: 10, 
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  listHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    marginTop: 20,
    marginBottom: 5
  },
  listTitle: { fontSize: 18, fontWeight: '900' },
  xpTotalBadge: { backgroundColor: 'rgba(107, 142, 35, 0.15)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  xpTotalText: { color: '#6b8e23', fontSize: 11, fontWeight: 'bold' },
  list: { padding: 20 },
  eventCard: { borderRadius: 22, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', elevation: 3 },
  typeIndicator: { width: 6, height: '100%' },
  cardContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 16 },
  infoWrapper: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  eventTitle: { fontSize: 15, fontWeight: 'bold' },
  eventSub: { fontSize: 12, fontWeight: '600' },
  xpBadge: { 
    width: 52, 
    height: 52, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  xpValue: { fontSize: 14, fontWeight: '900' },
  xpLabel: { fontSize: 8, fontWeight: '900' }
});