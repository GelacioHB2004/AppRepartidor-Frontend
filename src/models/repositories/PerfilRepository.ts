import apiClient from '../../core/apiClient';

export class PerfilRepository {
    static async obtenerPerfil() {
        try {
            const response = await apiClient.get('/perfil');
            return response.data.perfil;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Error al obtener perfil');
        }
    }

    static async actualizarPerfil(datos: {
        nombre: string;
        apellidoP: string;
        apellidoM: string;
        telefono: string;
    }) {
        try {
            const response = await apiClient.put('/perfil', datos);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Error al actualizar perfil');
        }
    }

    static async eliminarCuenta(password: string) {
        try {
            const response = await apiClient.delete('/perfil/cuenta', {
                data: { password },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Error al eliminar la cuenta');
        }
    }
}
