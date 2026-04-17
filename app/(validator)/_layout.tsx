import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';
import { Colors, Fonts, Sizes } from '../../lib/theme';

export default function AuthorityLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: { marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => <Feather name="eye" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="active"
        options={{
          title: 'Submissions',
          tabBarIcon: ({ color }) => <Feather name="file-text" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    height: Sizes.tabBarHeight,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    marginTop: 2,
  },
});
