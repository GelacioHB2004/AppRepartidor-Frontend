import apiClient from '../../core/apiClient';

export type LegalDocument = {
    titulo: string;
    contenido: string;
    version?: string;
    fechaPublicacion?: string;
    ultimaActualizacion?: string;
};

type ApiError = {
    response?: {
        data?: {
            error?: string;
        };
    };
};

export const LegalRepository = {
    async obtenerTerminos(): Promise<LegalDocument> {
        try {
            const response = await apiClient.get('/legal/terminos');
            return response.data.documento;
        } catch (error: unknown) {
            const apiError = error as ApiError;
            throw new Error(apiError.response?.data?.error || 'Error al obtener términos y condiciones');
        }
    },

    async obtenerPoliticas(): Promise<LegalDocument> {
        try {
            const response = await apiClient.get('/legal/politicas');
            return response.data.documento;
        } catch (error: unknown) {
            const apiError = error as ApiError;
            throw new Error(apiError.response?.data?.error || 'Error al obtener políticas de privacidad');
        }
    },
};
