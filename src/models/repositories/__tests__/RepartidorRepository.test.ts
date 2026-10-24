import apiClient from '../../../core/apiClient';
import { RepartidorRepository } from '../RepartidorRepository';

jest.mock('../../../core/apiClient', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        put: jest.fn(),
    },
}));

const get = apiClient.get as jest.Mock;
const put = apiClient.put as jest.Mock;

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

    test('obtiene los pedidos asignados al repartidor', async () => {
        const pedidos = [{ id_pedido: 18, estado: 'Confirmado' }];
        get.mockResolvedValueOnce({ data: pedidos });

        await expect(RepartidorRepository.obtenerPedidosAsignados()).resolves.toEqual(pedidos);

        expect(get).toHaveBeenCalledWith('/repartidor/pedidos');
    });

    test('inicia la entrega del pedido indicado', async () => {
        const response = { message: 'Entrega iniciada' };
        put.mockResolvedValueOnce({ data: response });

        await expect(RepartidorRepository.iniciarEntrega(18)).resolves.toEqual(response);

        expect(put).toHaveBeenCalledWith('/repartidor/iniciar-entrega/18');
    });

    test('envía la evidencia requerida al confirmar una entrega', async () => {
        const response = { message: 'Entrega confirmada' };
        put.mockResolvedValueOnce({ data: response });

        await expect(
            RepartidorRepository.confirmarEntrega(18, {
                foto: {
                    uri: 'file:///evidencia.jpg',
                    mimeType: 'image/jpeg',
                    fileName: 'evidencia.jpg',
                },
                nombreReceptor: 'María Hernández',
                latitud: 20.123456,
                longitud: -98.765432,
            })
        ).resolves.toEqual(response);

        expect(put).toHaveBeenCalledWith(
            '/repartidor/entregar/18',
            expect.any(FormData),
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const formData = put.mock.calls[0][1] as FormData;
        expect(formData.get('nombre_receptor')).toBe('María Hernández');
        expect(formData.get('latitud')).toBe('20.123456');
        expect(formData.get('longitud')).toBe('-98.765432');
        expect(formData.has('foto')).toBe(true);
    });

    test('devuelve un error controlado cuando falla la confirmación', async () => {
        put.mockRejectedValueOnce({
            response: { data: { error: 'No se pudo guardar la evidencia' } },
        });

        await expect(
            RepartidorRepository.confirmarEntrega(18, {
                foto: {
                    uri: 'file:///evidencia.jpg',
                    mimeType: 'image/jpeg',
                    fileName: 'evidencia.jpg',
                },
                nombreReceptor: 'María Hernández',
                latitud: 20.123456,
                longitud: -98.765432,
            })
        ).rejects.toThrow('No se pudo guardar la evidencia');
    });
});
