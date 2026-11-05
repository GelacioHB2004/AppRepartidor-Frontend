import apiClient from '../../core/apiClient';

export interface PreferenciasNotificacion {
    pedidosAsignados: boolean;
}

export interface NotificacionRepartidor {
    id_notificacion: number;
    tipo: string;
    referencia_id: number | null;
    titulo: string;
    mensaje: string;
    leida: boolean;
    fecha_creacion: string;
    datos?: { tipo?: string; idPedido?: number } | null;
}

const obtenerMensajeError = (error: any, fallback: string) =>
    error.response?.data?.error || fallback;

export class NotificacionRepository {
    static async registrarToken(expoPushToken: string, plataforma: string) {
        try {
            const response = await apiClient.post('/notificaciones/token', {
                expoPushToken,
                plataforma,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(obtenerMensajeError(error, 'No fue posible activar las notificaciones'));
        }
    }

    static async desregistrarToken(expoPushToken: string) {
        try {
            const response = await apiClient.delete('/notificaciones/token', {
                data: { expoPushToken },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(obtenerMensajeError(error, 'No fue posible desactivar el dispositivo'));
        }
    }

    static async listar(): Promise<NotificacionRepartidor[]> {
        try {
            const response = await apiClient.get('/notificaciones');
            return response.data;
        } catch (error: any) {
            throw new Error(obtenerMensajeError(error, 'No fue posible cargar las notificaciones'));
        }
    }

    static async obtenerPreferencias(): Promise<PreferenciasNotificacion> {
        try {
            const response = await apiClient.get('/notificaciones/preferencias');
            return response.data;
        } catch (error: any) {
            throw new Error(obtenerMensajeError(error, 'No fue posible cargar las preferencias'));
        }
    }

    static async actualizarPreferencias(pedidosAsignados: boolean): Promise<PreferenciasNotificacion> {
        try {
            const response = await apiClient.put('/notificaciones/preferencias', { pedidosAsignados });
            return response.data;
        } catch (error: any) {
            throw new Error(obtenerMensajeError(error, 'No fue posible guardar las preferencias'));
        }
    }

    static async marcarComoLeida(idNotificacion: number) {
        try {
            const response = await apiClient.patch(`/notificaciones/${idNotificacion}/leida`);
            return response.data;
        } catch (error: any) {
            throw new Error(obtenerMensajeError(error, 'No fue posible actualizar la notificacion'));
        }
    }

    static async sincronizar() {
        try {
            const response = await apiClient.post('/notificaciones/sincronizar');
            return response.data;
        } catch (error: any) {
            throw new Error(obtenerMensajeError(error, 'No fue posible sincronizar las notificaciones'));
        }
    }
}
