import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import api from '../../api'; // Usando a config centralizada IP .85
import { useTheme } from '../_layout';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
}

export default function AgendaScreen() {
  const { isDarkMode } = useTheme();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSelecionado, setDiaSelecionado] = useState('');

  const theme = {
    bg: isDarkMode ? '#121212' : '#FFF',
    text: isDarkMode ? '#FFF' : '#333',
    card: isDarkMode ? '#1E1E1E' : '#f9f9f9',
    calendarBg: isDarkMode ? '#1E1E1E' : '#FFF'
  };

  useEffect(() => {
    fetchAgenda();
  }, []);

  const fetchAgenda = async () => {
    try {
      const response = await api.get('/agenda');
      setEventos(response.data);
    } catch (error) {
      console.log("Erro ao buscar agenda:", error);
    } finally {
      setLoading(false);
    }
  };

  const eventosFiltrados = diaSelecionado 
    ? eventos.filter(e => e.data === diaSelecionado)
    : eventos;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={styles.title}>Agenda</Text>

      <Calendar
        onDayPress={day => setDiaSelecionado(day.dateString)}
        markedDates={{
          [diaSelecionado]: { selected: true, disableTouchEvent: true, selectedColor: '#6b8e23' }
        }}
        theme={{
          calendarBackground: theme.calendarBg,
          dayTextColor: theme.text,
          monthTextColor: theme.text,
          todayTextColor: '#6b8e23',
          arrowColor: '#6b8e23',
          selectedDayBackgroundColor: '#6b8e23',
        }}
      />

      <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#eee' }]} />

      {loading ? (
        <ActivityIndicator size="large" color="#6b8e23" />
      ) : (
        <FlatList
          data={eventosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.eventTitle, { color: theme.text }]}>{item.titulo}</Text>
              <Text style={[styles.eventDesc, { color: isDarkMode ? '#AAA' : '#666' }]}>{item.descricao}</Text>
              <Text style={styles.eventTime}>{item.hora}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {diaSelecionado ? `Sem eventos para o dia ${diaSelecionado}` : 'Selecione um dia ou aguarde eventos.'}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6b8e23', marginLeft: 20, marginBottom: 10 },
  divider: { height: 1, marginVertical: 15 },
  card: { padding: 15, marginHorizontal: 20, marginBottom: 10, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#6b8e23', elevation: 2 },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
  eventDesc: { fontSize: 14 },
  eventTime: { color: '#6b8e23', fontWeight: 'bold', marginTop: 5 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});