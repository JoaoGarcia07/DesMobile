import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../api"; // IP .85

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Aviso", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post("/login", {
        email: email.trim().toLowerCase(),
        senha: senha.trim(),
      });

      if (response.data.auth) {
        // ENTRA NAS ABAS SUBSTITUINDO O LOGIN
        router.replace("/(tabs)"); 
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro de Conexão", "Servidor fora do ar no IP 192.168.100.85.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000" }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={60} color="white" />
          </View>
          <Text style={styles.title}>Desbravadores</Text>
          <Text style={styles.subtitle}>Painel do Desbravador</Text>
        </View>

        <View style={styles.loginCard}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="joao@teste.com"
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="•••"
              style={styles.input}
              secureTextEntry
              onChangeText={setSenha}
              value={senha}
            />
          </View>

          <TouchableOpacity style={styles.forgotPass} onPress={() => router.push("/recuperar")}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>ENTRAR</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerLink} onPress={() => router.push("/cadastro")}>
          <Text style={styles.registerText}>
            Não tem uma conta? <Text style={styles.boldText}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 20 },
  header: { alignItems: "center", marginBottom: 40 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#6b8e23", justifyContent: "center", alignItems: "center", elevation: 10, marginBottom: 20 },
  title: { fontSize: 36, fontWeight: "bold", color: "white", textShadowColor: "rgba(0, 0, 0, 0.75)", textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
  subtitle: { fontSize: 16, color: "#ddd", marginTop: 5 },
  loginCard: { backgroundColor: "white", width: width * 0.85, padding: 25, borderRadius: 25, elevation: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0f4f8", borderRadius: 15, marginBottom: 15, paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: "#333" },
  forgotPass: { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { color: "#666", fontSize: 14 },
  button: { backgroundColor: "#6b8e23", flexDirection: "row", padding: 18, borderRadius: 15, alignItems: "center", justifyContent: "center", elevation: 5 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 18 },
  registerLink: { marginTop: 30 },
  registerText: { color: "white", fontSize: 15 },
  boldText: { fontWeight: "bold", textDecorationLine: "underline" },
});