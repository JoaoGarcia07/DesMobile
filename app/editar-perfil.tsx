import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './_layout'; // Integrado ao Modo Escuro
import api from '../api'; // Conexão com o backend

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  // Estados para os campos (Iniciam com os dados atuais)
  const [nome, setNome] = useState("João Garcia");
  const [clube, setClube] = useState("Clube de Desbravadores");
  const [unidade, setUnidade] = useState("Águia");

  const theme = {
    bg: isDarkMode ? '#121212' : '#F8F9FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    inputBg: isDarkMode ? '#2D2D2D' : '#F0F0F0',
    placeholder: isDarkMode ? '#888' : '#999',
  };

  const handleSalvar = async () => {
    try {
      // Exemplo de chamada para atualizar no banco via IP .85
      // const response = await api.put('/usuario/atualizar', { nome, clube, unidade });
      
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      {/* Header com Voltar e Salvar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={30} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.text }]}>Editar Perfil</Text>
        <TouchableOpacity onPress={handleSalvar}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.avatarSection}>
        <Image 
          source={{ uri: "https://avatar.iran.liara.run/public/boy" }} 
          style={styles.avatar} 
        />
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Alterar foto de perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <InputLabel theme={theme} label="Nome Completo" value={nome} onChange={setNome} />
        <InputLabel theme={theme} label="Clube" value={clube} onChange={setClube} />
        <InputLabel theme={theme} label="Unidade" value={unidade} onChange={setUnidade} />
        
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#6b8e23" />
          <Text style={[styles.infoText, { color: theme.placeholder }]}>
            Algumas informações são validadas pela secretaria do clube.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function InputLabel({ theme, label, value, onChange }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.placeholder }]}>{label}</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]}
        value={value}
        onChangeText={onChange}
        placeholderTextColor={theme.placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
  topTitle: { fontSize: 18, fontWeight: 'bold' },
  saveText: { color: '#6b8e23', fontSize: 18, fontWeight: 'bold' },
  avatarSection: { alignItems: 'center', marginTop: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  changePhotoButton: { marginTop: 15 },
  changePhotoText: { color: '#6b8e23', fontWeight: '600', fontSize: 16 },
  form: { padding: 25 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: { padding: 15, borderRadius: 12, fontSize: 16 },
  infoBox: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 5 },
  infoText: { marginLeft: 10, fontSize: 13, flex: 1 }
});