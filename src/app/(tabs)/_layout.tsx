import { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import {
  escucharAperturaDeNotificaciones,
  registrarDispositivoParaNotificaciones,
} from '../../services/notificacionService';

export default function TabLayout() {
  const router = useRouter();

  useEffect(() => {
    void registrarDispositivoParaNotificaciones().catch((error) => {
      console.warn('No fue posible registrar las notificaciones:', error.message);
    });

    let detenerEscucha = () => {};
    void escucharAperturaDeNotificaciones(() => router.push('/(tabs)/pedidos'))
      .then((detener) => { detenerEscucha = detener; })
      .catch((error) => console.warn('No fue posible escuchar notificaciones:', error.message));

    return () => detenerEscucha();
  }, [router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F1F5F9',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: '#0038FF',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: 'Mis Pedidos',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'truck-delivery' : 'truck-delivery-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'clock' : 'clock-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Mi Perfil',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account' : 'account-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
