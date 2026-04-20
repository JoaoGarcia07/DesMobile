import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleCadastro = async () => {
    if (!nome || !usuario || !senha) {
      Alert.alert("Erro", "Preencha tudo!");
      return;
    }

    Alert.alert(
      "Cadastro centralizado",
      "Os usuários do mobile precisam ser cadastrados primeiro no DesbravadoresTeste. Use o painel web/admin para criar ou liberar o aluno."
    );
    router.replace('/');
  };

  return (
    <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000' }} style={{flex:1}}>
      <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)', padding:30, justifyContent:'center'}}>
        <TouchableOpacity onPress={() => router.back()} style={{marginBottom:20}}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={{fontSize:32, color:'white', fontWeight:'bold', textAlign:'center', marginBottom:20}}>Criar Conta</Text>
        <Text style={{color:'white', textAlign:'center', marginBottom:20, lineHeight:22}}>
          O cadastro do aplicativo é sincronizado com o banco do DesbravadoresTeste.
        </Text>
        <View style={{backgroundColor:'white', padding:20, borderRadius:20}}>
          <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
          <TextInput placeholder="Usuário do sistema web" style={styles.input} value={usuario} onChangeText={setUsuario} autoCapitalize="none" />
          <TextInput placeholder="Senha" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />
          <TouchableOpacity style={styles.btn} onPress={handleCadastro}>
            <Text style={{color:'white', fontWeight:'bold'}}>COMO CADASTRAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, marginBottom: 15 },
  btn: { backgroundColor: '#6b8e23', padding: 15, borderRadius: 10, alignItems: 'center' }
});
