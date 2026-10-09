import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Usamos la IP de tu computadora para que funcione tanto en Web como en tu celular físico
const API_URL = 'http:////10.98.40.21:3000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token JWT a todas las peticiones (excepto login)
apiClient.interceptors.request.use(
    async (config) => {
        try {
            let token = null;
            if (Platform.OS === 'web') {
                token = localStorage.getItem('userToken');
            } else {
                token = await SecureStore.getItemAsync('userToken');
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error obteniendo el token de SecureStore', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
