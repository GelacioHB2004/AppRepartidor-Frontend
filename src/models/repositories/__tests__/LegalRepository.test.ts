import apiClient from '../../../core/apiClient';
import { LegalRepository } from '../LegalRepository';

jest.mock('../../../core/apiClient', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}));

const get = apiClient.get as jest.Mock;

describe('LegalRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('obtiene los términos y condiciones publicados', async () => {
        const documento = {
            titulo: 'Términos y Condiciones',
            contenido: 'Contenido vigente para el uso de la aplicación.',
            version: '1.0',
        };
        get.mockResolvedValueOnce({ data: { documento } });

        await expect(LegalRepository.obtenerTerminos()).resolves.toEqual(documento);

        expect(get).toHaveBeenCalledWith('/legal/terminos');
    });

    test('conserva la información completa del documento recibido', async () => {
        const documento = {
            titulo: 'Términos y Condiciones',
            contenido: 'Contenido legal.',
            version: '2.1',
            fechaPublicacion: '2026-10-24',
            ultimaActualizacion: '2026-10-24',
        };
        get.mockResolvedValueOnce({ data: { documento } });

        const resultado = await LegalRepository.obtenerTerminos();

        expect(resultado).toEqual(documento);
    });

    test('devuelve el mensaje del servidor cuando no obtiene los términos', async () => {
        get.mockRejectedValueOnce({
            response: { data: { error: 'No hay términos publicados' } },
        });

        await expect(LegalRepository.obtenerTerminos()).rejects.toThrow(
            'No hay términos publicados'
        );
    });

    test('devuelve un error controlado cuando falla la conexión', async () => {
        get.mockRejectedValueOnce(new Error('Network Error'));

        await expect(LegalRepository.obtenerTerminos()).rejects.toThrow(
            'Error al obtener términos y condiciones'
        );
    });
});
