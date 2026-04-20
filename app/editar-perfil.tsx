import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './_layout';
import api, { clearSession, isUnauthorizedError, resolveAssetUrl } from '../api';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [unidade, setUnidade] = useState("Sem unidade");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    inputBg: isDarkMode ? '#2D3748' : '#F1F5F9',
    accent: '#6b8e23',
  };

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await api.get('/api/profile/me');

        if (!active) {
          return;
        }

        const profile = response.data;
        setNome(profile?.name || '');
        setSobrenome(profile?.surname || '');
        setUsuario(profile?.username || '');
        setUnidade(profile?.group?.name || 'Sem unidade');
        setAvatarUrl(await resolveAssetUrl(profile?.avatar));
      } catch (error) {
        if (isUnauthorizedError(error)) {
          await clearSession();
          router.replace('/');
          return;
        }

        Alert.alert("Erro", "Não foi possível carregar o perfil.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  const handleSalvar = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append('name', nome.trim());
      formData.append('surname', sobrenome.trim());

      await api.put('/api/profile/me', formData);

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      router.back();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        await clearSession();
        router.replace('/');
        return;
      }

      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  const avatarSource = avatarUrl
    ? { uri: avatarUrl }
    : { uri: `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(usuario || 'desbravador')}` };

  if (loading) {
    return (
      <View style={[styles.loaderArea, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={[theme.accent, '#0F172A']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDITAR PERFIL</Text>
        <TouchableOpacity onPress={handleSalvar} style={[styles.saveBtn, saving && { opacity: 0.7 }]} disabled={saving}>
          <Text style={styles.saveText}>{saving ? 'Salvando' : 'Salvar'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.imageWrapper}>
            <Image 
              source={avatarSource} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={[styles.changePhotoText, { color: theme.accent }]}>Alterar foto de perfil no sistema web</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <InputLabel theme={theme} label="Nome" value={nome} onChange={setNome} icon="person-outline" />
          <InputLabel theme={theme} label="Sobrenome" value={sobrenome} onChange={setSobrenome} icon="person-outline" />
          <InputLabel theme={theme} label="Usuário" value={usuario} onChange={() => {}} icon="at-outline" editable={false} />
          <InputLabel theme={theme} label="Unidade" value={unidade} onChange={() => {}} icon="ribbon-outline" editable={false} />
          
          <View style={[styles.infoBox, { backgroundColor: theme.card }]}>
            <Ionicons name="information-circle-outline" size={22} color={theme.accent} />
            <Text style={[styles.infoText, { color: theme.subText }]}>
              Usuário, avatar e unidade continuam centralizados no DesbravadoresTeste. Aqui você altera apenas seu nome público.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InputLabel({ theme, label, value, onChange, icon, editable = true }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg }]}>
        <Ionicons name={icon} size={20} color={theme.subText} style={styles.inputIcon} />
        <TextInput 
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChange}
          placeholderTextColor={theme.subText}
          editable={editable}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    height: 120, 
    paddingTop: 45, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 },
  headerTitle: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
  saveBtn: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  saveText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 },
  scrollContent: { paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginTop: 30 },
  imageWrapper: { position: 'relative' },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: 'white' },
  editBadge: { position: 'absolute', bottom: 0, right: 5, backgroundColor: '#6b8e23', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#0F172A' },
  changePhotoButton: { marginTop: 15 },
  changePhotoText: { fontWeight: 'bold', fontSize: 15 },
  form: { padding: 25 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, marginBottom: 8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, fontWeight: '500' },
  infoBox: { flexDirection: 'row', alignItems: 'center', marginTop: 10, padding: 15, borderRadius: 20, elevation: 2 },
  infoText: { marginLeft: 12, fontSize: 13, flex: 1, lineHeight: 18 },
  loaderArea: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
