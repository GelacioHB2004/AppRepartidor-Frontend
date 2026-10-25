import apiClient from '../../../core/apiClient';
import { EmpresaRepository } from '../EmpresaRepository';

jest.mock('../../../core/apiClient', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}));

const get = apiClient.get as jest.Mock;

describe('EmpresaRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('obtiene la empresa activa para mostrarla en el login', async () => {
        const empresa = {
            logo: 'https://example.com/logo.png',
            nombreEmpresa: 'Dulcería Angelitos',
        };
        get.mockResolvedValueOnce({ data: { empresa } });

        await expect(EmpresaRepository.obtenerEmpresaActiva()).resolves.toEqual(empresa);

        expect(get).toHaveBeenCalledWith('/empresa/logo');
    });

    test('devuelve el mensaje del servidor cuando no obtiene la empresa', async () => {
        get.mockRejectedValueOnce({
            response: { data: { error: 'No hay una empresa activa' } },
        });

        await expect(EmpresaRepository.obtenerEmpresaActiva()).rejects.toThrow(
            'No hay una empresa activa'
        );
    });

    test('devuelve un error controlado cuando falla la conexión con la empresa', async () => {
        get.mockRejectedValueOnce(new Error('Network Error'));

        await expect(EmpresaRepository.obtenerEmpresaActiva()).rejects.toThrow(
            'Error al obtener la empresa'
        );
    });
});
