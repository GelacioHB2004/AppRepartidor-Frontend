import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AuthRepository } from '../models/repositories/AuthRepository';

export const useAuthViewModel = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        if (!correo || !password) {
            setError('Por favor, ingresa correo y contraseña.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await AuthRepository.login(correo, password);
            
            // Si el login fue exitoso, guardamos el token
            if (data.token) {
                if (Platform.OS === 'web') {
                    localStorage.setItem('userToken', data.token);
                } else {
                    await SecureStore.setItemAsync('userToken', data.token);
                }
                
                // Redirigir a la pestaña principal (Inicio / Dashboard)
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
            // Intentar avisar al servidor (no crítico si falla)
            await AuthRepository.logout();
        } catch (err) {
            console.warn('No se pudo cerrar sesión en el servidor.');
        } finally {
            // Siempre limpiar el token local y redirigir al login
            try {
                if (Platform.OS === 'web') {
                    localStorage.removeItem('userToken');
                } else {
                    await SecureStore.deleteItemAsync('userToken');
                }
            } catch (e) {
                console.warn('Error al limpiar token local:', e);
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
        handleLogout
    };
};
