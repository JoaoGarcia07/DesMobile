import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars'; // Importa o calendário
import axios from 'axios';

// Configuração para o calendário ficar em Português
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
  data: string; // Esperado no formato YYYY-MM-DD
  hora: string;
}

export default function AgendaScreen() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSelecionado, setDiaSelecionado] = useState('');

  useEffect(() => {
    fetchAgenda();
  }, []);

  const fetchAgenda = async () => {
    try {
      const response = await axios.get('http://192.168.100.90:3000/agenda');
      setEventos(response.data);
    } catch (error) {
      console.log("Erro ao buscar agenda:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtra a lista para mostrar apenas eventos do dia clicado no calendário
  const eventosFiltrados = diaSelecionado 
    ? eventos.filter(e => e.data === diaSelecionado)
    : eventos;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda</Text>

      {/* COMPONENTE DE CALENDÁRIO */}
      <Calendar
        onDayPress={day => setDiaSelecionado(day.dateString)}
        markedDates={{
          [diaSelecionado]: { selected: true, disableTouchEvent: true, selectedColor: '#6b8e23' }
        }}
        theme={{
          todayTextColor: '#6b8e23',
          arrowColor: '#6b8e23',
          selectedDayBackgroundColor: '#6b8e23',
        }}
      />

      <View style={styles.divider} />

      {loading ? (
        <ActivityIndicator size="large" color="#6b8e23" />
      ) : (
        <FlatList
          data={eventosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: Evento }) => (
            <View style={styles.card}>
              <Text style={styles.eventTitle}>{item.titulo}</Text>
              <Text style={styles.eventDesc}>{item.descricao}</Text>
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
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6b8e23', marginLeft: 20, marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  card: { backgroundColor: '#f9f9f9', padding: 15, marginHorizontal: 20, marginBottom: 10, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#6b8e23' },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
  eventDesc: { color: '#666', fontSize: 14 },
  eventTime: { color: '#6b8e23', fontWeight: 'bold', marginTop: 5 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});