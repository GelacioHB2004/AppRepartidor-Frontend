import apiClient from '../../core/apiClient';

const handleError = (error: any, fallback: string) => {
    if (error.response) throw new Error(error.response.data.error || fallback);
    throw new Error('No se pudo conectar con el servidor');
};

export class AuthRepository {
    static async login(correo: string, password: string) {
        try {
            const response = await apiClient.post('/auth/login', { correo, password });
            return response.data;
        } catch (error: any) {
            handleError(error, 'Error al iniciar sesión');
        }
    }

    static async logout() {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.warn('No se pudo cerrar sesión en el servidor, pero se cerrará localmente.');
        }
    }

    static async register(datos: {
        nombre: string; apellidoP: string; apellidoM: string;
        correo: string; telefono: string; password: string;
    }) {
        try {
            const response = await apiClient.post('/auth/register', datos);
            return response.data;
        } catch (error: any) {
            handleError(error, 'Error al registrar');
        }
    }

    static async verifyAccount(correo: string, codigo: string) {
        try {
            const response = await apiClient.post('/auth/verify-account', { correo, codigo });
            return response.data;
        } catch (error: any) {
            handleError(error, 'Error al verificar cuenta');
        }
    }

    static async resendVerification(correo: string) {
        try {
            const response = await apiClient.post('/auth/resend-verification', { correo });
            return response.data;
        } catch (error: any) {
            handleError(error, 'Error al reenviar código');
        }
    }

    static async requestRecovery(correo: string) {
        try {
            const response = await apiClient.post('/auth/request-recovery', { correo });
            return response.data;
        } catch (error: any) {
            handleError(error, 'Error al solicitar recuperación');
        }
    }

    static async verifyRecovery(correo: string, codigo: string) {
        try {
            const response = await apiClient.post('/auth/verify-recovery', { correo, codigo });
            return response.data;
        } catch (error: any) {
            handleError(error, 'Error al verificar código');
        }
    }

    static async resetPassword(correo: string, nuevaPassword: string) {
        try {
            const response = await apiClient.post('/auth/reset-password', { correo, nuevaPassword });
            return response.data;
        } catch (error: any) {
            handleError(error, 'Error al cambiar contraseña');
        }
    }
}
