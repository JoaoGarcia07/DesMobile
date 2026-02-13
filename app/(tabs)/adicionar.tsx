import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function AdicionarScreen() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(''); // Formato YYYY-MM-DD
  const [hora, setHora] = useState(''); // Formato HH:MM
  const router = useRouter();

  const salvarEvento = async () => {
    // Validação simples
    if (!titulo || !data || !hora) {
      Alert.alert("Erro", "Preencha pelo menos o título, a data e a hora.");
      return;
    }

    try {
      // LEMBRE-SE: Use o seu IP 192.168.100.90
      const response = await axios.post('http://192.168.100.90:3000/agenda', {
        titulo,
        descricao,
        data,
        hora
      });

      if (response.data.id) {
        Alert.alert("Sucesso", "Atividade cadastrada na agenda!");
        // Limpa o formulário
        setTitulo('');
        setDescricao('');
        setData('');
        setHora('');
        // Volta para a aba de Agenda para ver o item novo
        router.push('/agenda');
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível salvar no servidor.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nova Atividade</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Título da Atividade</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Reunião de Unidade" 
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="O que teremos hoje?" 
          multiline 
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="2024-05-20" 
              value={data}
              onChangeText={setData}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Hora (HH:MM)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="14:00" 
              value={hora}
              onChangeText={setHora}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={salvarEvento}>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Salvar na Agenda</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#6b8e23', marginTop: 50, marginBottom: 20 },
  form: { marginTop: 10 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { 
    backgroundColor: '#F0F0F0', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20,
    fontSize: 16 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { 
    backgroundColor: '#6b8e23', 
    flexDirection: 'row',
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }
});