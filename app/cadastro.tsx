import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha tudo!"); return;
    }
    try {
      const response = await axios.post('http://192.168.100.85:3000/usuarios', { nome, email, senha });
      if (response.status === 201) {
        Alert.alert("Sucesso", "Usuário criado!"); router.replace('/');
      }
    } catch (e) { Alert.alert("Erro", "Falha ao cadastrar."); }
  };

  return (
    <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000' }} style={{flex:1}}>
      <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)', padding:30, justifyContent:'center'}}>
        <TouchableOpacity onPress={() => router.back()} style={{marginBottom:20}}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity>
        <Text style={{fontSize:32, color:'white', fontWeight:'bold', textAlign:'center', marginBottom:30}}>Criar Conta</Text>
        <View style={{backgroundColor:'white', padding:20, borderRadius:20}}>
          <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
          <TextInput placeholder="E-mail" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput placeholder="Senha" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />
          <TouchableOpacity style={styles.btn} onPress={handleCadastro}><Text style={{color:'white', fontWeight:'bold'}}>CADASTRAR</Text></TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, marginBottom: 15 },
  btn: { backgroundColor: '#6b8e23', padding: 15, borderRadius: 10, alignItems: 'center' }
});