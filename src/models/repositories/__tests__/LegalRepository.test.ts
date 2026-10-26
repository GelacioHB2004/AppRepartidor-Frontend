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

    test('obtiene las políticas de privacidad publicadas', async () => {
        const documento = {
            titulo: 'Políticas de Privacidad',
            contenido: 'Tratamiento y protección de datos personales.',
            version: '1.0',
        };
        get.mockResolvedValueOnce({ data: { documento } });

        await expect(LegalRepository.obtenerPoliticas()).resolves.toEqual(documento);

        expect(get).toHaveBeenCalledWith('/legal/politicas');
    });

    test('conserva la información completa de las políticas recibidas', async () => {
        const documento = {
            titulo: 'Políticas de Privacidad',
            contenido: 'Contenido de privacidad.',
            version: '2.0',
            fechaPublicacion: '2026-10-24',
            ultimaActualizacion: '2026-10-24',
        };
        get.mockResolvedValueOnce({ data: { documento } });

        const resultado = await LegalRepository.obtenerPoliticas();

        expect(resultado).toEqual(documento);
    });

    test('devuelve el mensaje del servidor cuando no obtiene las políticas', async () => {
        get.mockRejectedValueOnce({
            response: { data: { error: 'No hay políticas publicadas' } },
        });

        await expect(LegalRepository.obtenerPoliticas()).rejects.toThrow(
            'No hay políticas publicadas'
        );
    });

    test('devuelve un error controlado cuando falla la conexión de políticas', async () => {
        get.mockRejectedValueOnce(new Error('Network Error'));

        await expect(LegalRepository.obtenerPoliticas()).rejects.toThrow(
            'Error al obtener políticas de privacidad'
        );
    });
});
