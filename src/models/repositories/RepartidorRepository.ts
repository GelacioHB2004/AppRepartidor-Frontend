import apiClient from '../../core/apiClient';

type EvidenciaEntrega = {
    foto: { uri: string; mimeType: string; fileName: string };
    nombreReceptor: string;
    latitud: number;
    longitud: number;
};

/**
 * Repositorio para gestión del panel principal, pedidos y entregas del repartidor.
 * Utilizado por el panel principal (Tarea 02).
 */
export class RepartidorRepository {
    static async obtenerDashboard() {
        try {
            const response = await apiClient.get('/repartidor/dashboard');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Error al obtener dashboard');
        }
    }

    static async obtenerPedidosAsignados() {
        try {
            const response = await apiClient.get('/repartidor/pedidos');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Error al obtener pedidos');
        }
    }

    static async iniciarEntrega(id_pedido: number) {
        try {
            const response = await apiClient.put(`/repartidor/iniciar-entrega/${id_pedido}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Error al iniciar entrega');
        }
    }

    static async confirmarEntrega(id_pedido: number, evidencia: EvidenciaEntrega) {
        try {
            const formData = new FormData();
            formData.append('nombre_receptor', evidencia.nombreReceptor);
            formData.append('latitud', String(evidencia.latitud));
            formData.append('longitud', String(evidencia.longitud));
            formData.append('foto', {
                uri: evidencia.foto.uri,
                type: evidencia.foto.mimeType,
                name: evidencia.foto.fileName,
            } as any);

            const response = await apiClient.put(`/repartidor/entregar/${id_pedido}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Error al confirmar entrega');
        }
    }

    static async obtenerHistorial(fecha_inicio?: string, fecha_fin?: string) {
        try {
            let url = '/repartidor/historial';
            if (fecha_inicio && fecha_fin) {
                url += `?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
            }
            const response = await apiClient.get(url);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Error al obtener historial');
        }
    }
}
