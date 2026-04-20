import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../_layout'; 
import { restoreSession } from '../../api';

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    restoreSession().then((token) => {
      if (!active) {
        return;
      }

      if (!token) {
        router.replace('/');
        return;
      }

      setCheckingSession(false);
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (checkingSession) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }]}>
        <ActivityIndicator size="large" color="#6b8e23" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#6b8e23',
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="chamada" 
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={styles.fabButton}>
              <Ionicons name="add" size={35} color="white" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="config"
        options={{
          title: 'Config',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
        }}
      />

      <Tabs.Screen name="adicionar" options={{ href: null }} /> 
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fabButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6b8e23',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  }
});
