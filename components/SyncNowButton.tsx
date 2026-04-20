import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SyncNowButtonProps = {
  onPress: () => void | Promise<void>;
  loading?: boolean;
  label?: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
  style?: ViewStyle;
};

export function SyncNowButton({
  onPress,
  loading = false,
  label = 'Atualizar',
  accentColor = '#6b8e23',
  textColor = '#FFFFFF',
  backgroundColor,
  style,
}: SyncNowButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: backgroundColor || accentColor },
        style,
        loading && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          <Ionicons name="refresh" size={16} color={textColor} style={styles.icon} />
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 40,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.85,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
