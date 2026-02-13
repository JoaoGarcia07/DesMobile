import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Deseja realmente encerrar sua sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive", 
          onPress: () => router.replace('/') 
        }
      ]
    );
  };

  const usuario = {
    nome: "João Garcia",
    clube: "Clube de Desbravadores",
    unidade: "Águia",
    cargo: "Conselheiro",
    foto: "https://avatar.iran.liara.run/public/boy" // Link de foto real que funciona
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBackground}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: usuario.foto }} style={styles.avatar} />
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.userName}>{usuario.nome}</Text>
        <Text style={styles.userSubTitle}>{usuario.clube}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}><Text style={styles.statNumber}>12</Text><Text style={styles.statLabel}>Especialidades</Text></View>
          <View style={[styles.statBox, styles.borderLateral]}><Text style={styles.statNumber}>4</Text><Text style={styles.statLabel}>Classes</Text></View>
          <View style={styles.statBox}><Text style={styles.statNumber}>A+</Text><Text style={styles.statLabel}>Sangue</Text></View>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <DetailItem icon="people" label="Unidade" value={usuario.unidade} />
        <DetailItem icon="ribbon" label="Cargo" value={usuario.cargo} />
        <DetailItem icon="mail" label="E-mail" value="joao@teste.com" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function DetailItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <View style={styles.detailItem}>
      <Ionicons name={icon} size={24} color="#6b8e23" />
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerBackground: { backgroundColor: '#6b8e23', height: 160, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: -50, zIndex: 1 },
  avatarContainer: { marginBottom: -60, position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: 'white', backgroundColor: '#EEE' },
  editBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#4A6218', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  infoSection: { marginTop: 70, alignItems: 'center', paddingHorizontal: 20 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  userSubTitle: { fontSize: 16, color: '#666', marginTop: 4 },
  statsContainer: { flexDirection: 'row', marginTop: 25, backgroundColor: 'white', borderRadius: 15, padding: 20, elevation: 4 },
  statBox: { flex: 1, alignItems: 'center' },
  borderLateral: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#EEE' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#6b8e23' },
  statLabel: { fontSize: 12, color: '#999', marginTop: 4 },
  detailsSection: { marginTop: 30, paddingHorizontal: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10 },
  detailTextContainer: { marginLeft: 15 },
  detailLabel: { fontSize: 12, color: '#999' },
  detailValue: { fontSize: 16, fontWeight: '600', color: '#333' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, marginBottom: 50, padding: 15 },
  logoutText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});