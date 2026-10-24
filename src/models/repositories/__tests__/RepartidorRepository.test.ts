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
    test('obtiene el historial de entregas sin filtros de fecha', async () => {
        const historial = [{ id_pedido: 21, estado: 'Entregado', total: 350 }];
        get.mockResolvedValueOnce({ data: historial });

        await expect(RepartidorRepository.obtenerHistorial()).resolves.toEqual(historial);

        expect(get).toHaveBeenCalledWith('/repartidor/historial');
    });

    test('obtiene el historial filtrado por fecha inicial y final', async () => {
        const historial = [{ id_pedido: 22, estado: 'Entregado', total: 475.5 }];
        get.mockResolvedValueOnce({ data: historial });

        await expect(
            RepartidorRepository.obtenerHistorial('2026-10-01', '2026-10-24')
        ).resolves.toEqual(historial);

        expect(get).toHaveBeenCalledWith(
            '/repartidor/historial?fecha_inicio=2026-10-01&fecha_fin=2026-10-24'
        );
    });

    test('devuelve todos los datos recibidos en la respuesta del historial', async () => {
        const historial = [
            {
                id_pedido: 23,
                nombre_cliente: 'Laura Torres',
                direccion_entrega: 'Centro',
                telefono_cliente: '7711234567',
                total: '520.00',
            },
        ];
        get.mockResolvedValueOnce({ data: historial });

        const resultado = await RepartidorRepository.obtenerHistorial();

        expect(resultado).toEqual(historial);
    });

    test('devuelve el mensaje del servidor cuando falla la consulta del historial', async () => {
        get.mockRejectedValueOnce({
            response: { data: { error: 'No fue posible consultar las entregas' } },
        });

        await expect(RepartidorRepository.obtenerHistorial()).rejects.toThrow(
            'No fue posible consultar las entregas'
        );
    });

    test('devuelve un error controlado cuando falla la conexión del historial', async () => {
        get.mockRejectedValueOnce(new Error('Network Error'));

        await expect(RepartidorRepository.obtenerHistorial()).rejects.toThrow(
            'Error al obtener historial'
        );
    });
});
