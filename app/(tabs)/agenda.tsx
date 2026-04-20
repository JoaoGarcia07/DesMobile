import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useAppSync, useTheme } from '../_layout'; 
import api, { clearSession, isUnauthorizedError } from '../../api';

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
  const { refreshVersion, isRefreshing, triggerRefresh } = useAppSync();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [currentMonth, setCurrentMonth] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<any[]>([]);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#6b8e23',
    calendarText: isDarkMode ? '#FFFFFF' : '#2d4150',
  };

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/api/tasks?year=${currentMonth.year}&month=${currentMonth.month}&size=50&sort=date,asc&sort=time,asc`
        );

        if (!active) {
          return;
        }

        setEventos(response.data?.content || []);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          await clearSession();
          router.replace('/');
          return;
        }

        console.log('Erro ao carregar agenda:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      active = false;
    };
  }, [currentMonth, router, refreshVersion]);

  const markedDates = useMemo(() => {
    const palette = ['#2ED573', '#1E90FF', '#FFA502', '#6b8e23'];

    const marks = eventos.reduce((acc: any, item: any, index: number) => {
      if (!item.date) {
        return acc;
      }

      acc[item.date] = {
        ...(acc[item.date] || {}),
        marked: true,
        dotColor: palette[index % palette.length],
      };

      return acc;
    }, {});

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      disableTouchEvent: true,
      selectedColor: theme.accent,
    };

    return marks;
  }, [eventos, selectedDate, theme.accent]);

  const filteredEventos = selectedDate
    ? eventos.filter((item: any) => item.date === selectedDate)
    : eventos;

  const emptyState = !loading && filteredEventos.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>             AGENDA            </Text>
      </LinearGradient>

      <View style={[styles.calendarWrapper, { backgroundColor: theme.card }]}>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          onMonthChange={(date) => setCurrentMonth({ year: date.year, month: date.month })}
          markedDates={markedDates}
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
          <Text style={styles.xpTotalText}>{eventos.length} missão(ões)</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : emptyState ? (
        <ScrollView
          contentContainerStyle={styles.emptyArea}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
        >
          <Ionicons name="calendar-clear-outline" size={42} color={theme.subText} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhuma atividade nesse dia</Text>
          <Text style={[styles.emptyText, { color: theme.subText }]}>
            Selecione outra data ou confira o calendário do mês.
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredEventos}
          keyExtractor={(item: any) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={triggerRefresh} tintColor={theme.accent} />}
          renderItem={({ item, index }) => {
            const colors = ['#2ED573', '#1E90FF', '#FFA502', '#6b8e23'];
            const accentColor = colors[index % colors.length];

            return (
              <TouchableOpacity style={[styles.eventCard, { backgroundColor: theme.card }]}>
                <LinearGradient colors={[accentColor, `${accentColor}99`]} style={styles.typeIndicator} />
                
                <View style={styles.cardContent}>
                  <View style={styles.infoWrapper}>
                    <View style={styles.titleRow}>
                      <Ionicons name="calendar" size={18} color={accentColor} style={{marginRight: 8}} />
                      <Text style={[styles.eventTitle, { color: theme.text }]}>{item.title}</Text>
                    </View>
                    <Text style={[styles.eventSub, { color: theme.subText }]}>
                      {item.date} • {String(item.time || '').slice(0, 5)}
                    </Text>
                    {item.description ? (
                      <Text style={[styles.eventDescription, { color: theme.subText }]} numberOfLines={2}>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>

                  <LinearGradient colors={[`${accentColor}15`, `${accentColor}30`]} style={styles.xpBadge}>
                    <Text style={[styles.xpValue, { color: accentColor }]}>{String(item.time || '').slice(0, 5) || '--:--'}</Text>
                    <Text style={[styles.xpLabel, { color: accentColor }]}>Hora</Text>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    height: 140,
    paddingTop: 20,
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
  eventDescription: { fontSize: 12, marginTop: 6 },
  xpBadge: { 
    width: 60, 
    height: 52, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  xpValue: { fontSize: 14, fontWeight: '900' },
  xpLabel: { fontSize: 8, fontWeight: '900' },
  loaderArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyArea: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 12 },
  emptyText: { textAlign: 'center', marginTop: 8, lineHeight: 20 }
});
