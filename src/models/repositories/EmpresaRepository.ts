import apiClient from '../../core/apiClient';

type EmpresaPublica = {
    logo: string | null;
    nombreEmpresa: string;
};

type ApiError = {
    response?: {
        data?: {
            error?: string;
        };
    };
};

export const EmpresaRepository = {
    async obtenerEmpresaActiva(): Promise<EmpresaPublica> {
        try {
            const response = await apiClient.get('/empresa/logo');
            return response.data.empresa;
        } catch (error: unknown) {
            const apiError = error as ApiError;
            throw new Error(apiError.response?.data?.error || 'Error al obtener la empresa');
        }
    },
};
