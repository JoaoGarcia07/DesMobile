import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6b8e23', // Verde oliva da foto
        tabBarInactiveTintColor: '#8e8e8e',
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
      }}
    >
      {/* 1. INÍCIO (Onde estava 'home') */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />

      {/* 2. AGENDA */}
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />,
        }}
      />

      {/* 3. BOTÃO CENTRAL (+) */}
      <Tabs.Screen
        name="adicionar"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={{
              backgroundColor: '#6b8e23',
              width: 50,
              height: 50,
              borderRadius: 25,
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              marginBottom: 10, // Para dar o efeito de saltado da foto
              elevation: 5,    // Sombra no Android
              shadowColor: '#000', // Sombra no iOS
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
            }}>
              <Ionicons name="add" size={35} color="white" />
            </View>
          ),
        }}
      />

      {/* 4. PERFIL */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />

      {/* 5. CONFIGURAÇÕES */}
      <Tabs.Screen
        name="config"
        options={{
          title: 'Config',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}