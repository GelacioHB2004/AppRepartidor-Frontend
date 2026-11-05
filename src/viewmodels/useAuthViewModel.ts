import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AuthRepository } from '../models/repositories/AuthRepository';
import { desregistrarDispositivoDeNotificaciones } from '../services/notificacionService';

export const useAuthViewModel = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        if (!correo || !password) {
            setError('Por favor, ingresa correo y contrasena.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await AuthRepository.login(correo, password);
            if (data.token) {
                if (Platform.OS === 'web') {
                    localStorage.setItem('userToken', data.token);
                } else {
                    await SecureStore.setItemAsync('userToken', data.token);
                }
                router.replace('/(tabs)' as any);
            }
        } catch (err: any) {
            setError(err.message || 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            try {
                await desregistrarDispositivoDeNotificaciones();
            } catch {
                console.warn('No se pudo desregistrar el dispositivo de notificaciones.');
            }
            await AuthRepository.logout();
        } catch {
            console.warn('No se pudo cerrar sesion en el servidor.');
        } finally {
            try {
                if (Platform.OS === 'web') {
                    localStorage.removeItem('userToken');
                } else {
                    await SecureStore.deleteItemAsync('userToken');
                }
            } catch {
                console.warn('Error al limpiar el token local.');
            }
            setIsLoading(false);
            router.replace('/login' as any);
        }
    };

    return {
        correo,
        setCorreo,
        password,
        setPassword,
        isLoading,
        error,
        handleLogin,
        handleLogout,
    };
};
