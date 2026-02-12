import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel do Desbravador</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card}><Text style={styles.cardText}>Minha Unidade</Text></TouchableOpacity>
        <TouchableOpacity style={styles.card}><Text style={styles.cardText}>Especialidades</Text></TouchableOpacity>
        <TouchableOpacity style={styles.card}><Text style={styles.cardText}>Agenda</Text></TouchableOpacity>
        <TouchableOpacity style={styles.card}><Text style={styles.cardText}>Requisitos</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { backgroundColor: '#002a52', padding: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  grid: { padding: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#fff', padding: 25, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 2 },
  cardText: { color: '#002a52', fontWeight: 'bold', textAlign: 'center' }
});