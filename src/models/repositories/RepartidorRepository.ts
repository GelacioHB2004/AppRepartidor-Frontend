import apiClient from '../../core/apiClient';

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

    static async confirmarEntrega(id_pedido: number) {
        try {
            const response = await apiClient.put(`/repartidor/entregar/${id_pedido}`);
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
