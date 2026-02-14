import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../_layout"; // Importação do tema global

const { width } = Dimensions.get("window");

export default function PerfilScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme(); // Consumindo o estado do tema

  // Definição de cores baseadas no tema
  const theme = {
    background: isDarkMode ? "#121212" : "#F8F9FA",
    card: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#333333",
    subText: isDarkMode ? "#AAAAAA" : "#666666",
    border: isDarkMode ? "#333333" : "#F0F0F0",
  };

  const handleLogout = () => {
    Alert.alert("Sair da Conta", "Deseja realmente encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          router.replace("/" as any);
        },
      },
    ]);
  };

  const usuario = {
    nome: "João Garcia",
    clube: "Clube de Desbravadores",
    unidade: "Águia",
    cargo: "Conselheiro",
    foto: "https://avatar.iran.liara.run/public/boy",
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBackground}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: usuario.foto }} style={styles.avatar} />
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={[styles.userName, { color: theme.text }]}>{usuario.nome}</Text>
        <Text style={[styles.userSubTitle, { color: theme.subText }]}>{usuario.clube}</Text>

        <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Especialidades</Text>
          </View>
          <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: theme.border }]}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Classes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>A+</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Sangue</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <DetailItem isDarkMode={isDarkMode} icon="people" label="Unidade" value={usuario.unidade} />
        <DetailItem isDarkMode={isDarkMode} icon="ribbon" label="Cargo" value={usuario.cargo} />
        <DetailItem isDarkMode={isDarkMode} icon="mail" label="E-mail" value="joao@teste.com" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function DetailItem({
  icon,
  label,
  value,
  isDarkMode
}: {
  icon: any;
  label: string;
  value: string;
  isDarkMode: boolean;
}) {
  const theme = {
    card: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#333333",
    subText: isDarkMode ? "#AAAAAA" : "#999999",
  };

  return (
    <View style={[styles.detailItem, { backgroundColor: theme.card }]}>
      <Ionicons name={icon} size={24} color="#6b8e23" />
      <View style={styles.detailTextContainer}>
        <Text style={[styles.detailLabel, { color: theme.subText }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBackground: {
    backgroundColor: "#6b8e23",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  avatarContainer: { position: "absolute", bottom: -60, alignItems: "center" },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "white",
    backgroundColor: "#EEE",
  },
  editBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#4A6218",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  infoSection: { marginTop: 70, alignItems: "center", paddingHorizontal: 20 },
  userName: { fontSize: 24, fontWeight: "bold" },
  userSubTitle: { fontSize: 16, marginTop: 4 },
  statsContainer: {
    flexDirection: "row",
    marginTop: 25,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statBox: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#6b8e23" },
  statLabel: { fontSize: 12, marginTop: 4 },
  detailsSection: { marginTop: 30, paddingHorizontal: 20 },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  detailTextContainer: { marginLeft: 15 },
  detailLabel: { fontSize: 12 },
  detailValue: { fontSize: 16, fontWeight: "600" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 50,
    padding: 15,
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});