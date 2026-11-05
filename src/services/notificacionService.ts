import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { NotificacionRepository } from '../models/repositories/NotificacionRepository';

const PUSH_TOKEN_KEY = 'expoPushToken';
let handlerConfigurado = false;

export const ejecutandoEnExpoGo = () => Constants.appOwnership === 'expo';

const cargarModuloNotificaciones = async () => {
    if (Platform.OS === 'web' || ejecutandoEnExpoGo()) return null;
    return import('expo-notifications');
};

const configurarHandler = async () => {
    if (handlerConfigurado) return;
    const Notifications = await cargarModuloNotificaciones();
    if (!Notifications) return;

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
    handlerConfigurado = true;
};

export const obtenerEstadoPermisoNotificaciones = async () => {
    const Notifications = await cargarModuloNotificaciones();
    if (!Notifications) return 'unavailable';
    return (await Notifications.getPermissionsAsync()).status;
};

export const registrarDispositivoParaNotificaciones = async (): Promise<string | null> => {
    if (Platform.OS === 'web' || ejecutandoEnExpoGo() || !Device.isDevice) return null;

    const Notifications = await cargarModuloNotificaciones();
    if (!Notifications) return null;
    await configurarHandler();

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('pedidos', {
            name: 'Pedidos asignados',
            description: 'Avisos cuando se asigna un nuevo pedido.',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#0038FF',
            sound: 'default',
        });
    }

    const permisosActuales = await Notifications.getPermissionsAsync();
    let estado = permisosActuales.status;
    if (estado !== 'granted') {
        const permisosSolicitados = await Notifications.requestPermissionsAsync();
        estado = permisosSolicitados.status;
    }
    if (estado !== 'granted') return null;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) throw new Error('No se encontro el projectId de EAS.');

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    await NotificacionRepository.registrarToken(token, Platform.OS);
    await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
    await NotificacionRepository.sincronizar();
    return token;
};

export const escucharAperturaDeNotificaciones = async (abrirPedido: () => void) => {
    const Notifications = await cargarModuloNotificaciones();
    if (!Notifications) return () => {};
    await configurarHandler();

    const manejarRespuesta = (response: import('expo-notifications').NotificationResponse) => {
        if (response.notification.request.content.data?.tipo === 'pedido_asignado') {
            abrirPedido();
        }
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(manejarRespuesta);
    const ultimaRespuesta = await Notifications.getLastNotificationResponseAsync();
    if (ultimaRespuesta) manejarRespuesta(ultimaRespuesta);
    return () => subscription.remove();
};

export const desregistrarDispositivoDeNotificaciones = async () => {
    if (Platform.OS === 'web' || ejecutandoEnExpoGo()) return;
    const token = await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
    if (!token) return;

    await NotificacionRepository.desregistrarToken(token);
    await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY);
};
