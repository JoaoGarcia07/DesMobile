import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../_layout'; 

export default function TabLayout() {
  const { isDarkMode } = useTheme();

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

      {/* BOTÃO CENTRAL VINCULADO À CHAMADA */}
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

      {/* REMOVE ABAS EXTRAS DO MENU VISUAL */}
      <Tabs.Screen name="adicionar" options={{ href: null }} /> 
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6b8e23',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25, // Efeito saltado para fora da barra
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  }
});