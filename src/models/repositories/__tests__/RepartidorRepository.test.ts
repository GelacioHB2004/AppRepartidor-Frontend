import apiClient from '../../../core/apiClient';
import { RepartidorRepository } from '../RepartidorRepository';

jest.mock('../../../core/apiClient', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}));

const get = apiClient.get as jest.Mock;

describe('RepartidorRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('obtiene la información del dashboard del repartidor', async () => {
        const dashboard = {
            repartidor_nombre: 'Ana López',
            stats: { pendientes: 2, en_camino: 1, entregados: 4, total_hoy: 7 },
        };
        get.mockResolvedValueOnce({ data: dashboard });

        await expect(RepartidorRepository.obtenerDashboard()).resolves.toEqual(dashboard);

        expect(get).toHaveBeenCalledWith('/repartidor/dashboard');
    });

    test('devuelve el mensaje del servidor cuando no obtiene el dashboard', async () => {
        get.mockRejectedValueOnce({
            response: { data: { error: 'No fue posible cargar el panel principal' } },
        });

        await expect(RepartidorRepository.obtenerDashboard()).rejects.toThrow(
            'No fue posible cargar el panel principal'
        );
    });

    test('devuelve un mensaje controlado ante un error de conexión', async () => {
        get.mockRejectedValueOnce(new Error('Network Error'));

        await expect(RepartidorRepository.obtenerDashboard()).rejects.toThrow(
            'Error al obtener dashboard'
        );
    });
});
