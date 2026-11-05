import apiClient from '../../../core/apiClient';
import { NotificacionRepository } from '../NotificacionRepository';

jest.mock('../../../core/apiClient', () => ({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
}));

const post = apiClient.post as jest.Mock;
const get = apiClient.get as jest.Mock;
const put = apiClient.put as jest.Mock;
const patch = apiClient.patch as jest.Mock;

describe('NotificacionRepository', () => {
    beforeEach(() => jest.clearAllMocks());

    test('registra el token push del dispositivo', async () => {
        post.mockResolvedValueOnce({ data: { message: 'ok' } });
        await NotificacionRepository.registrarToken('ExpoPushToken[token-prueba]', 'android');
        expect(post).toHaveBeenCalledWith('/notificaciones/token', {
            expoPushToken: 'ExpoPushToken[token-prueba]',
            plataforma: 'android',
        });
    });

    test('obtiene el historial de notificaciones', async () => {
        const lista = [{ id_notificacion: 1, titulo: 'Nuevo pedido' }];
        get.mockResolvedValueOnce({ data: lista });
        await expect(NotificacionRepository.listar()).resolves.toEqual(lista);
    });

    test('actualiza la preferencia de pedidos asignados', async () => {
        put.mockResolvedValueOnce({ data: { pedidosAsignados: false } });
        await expect(NotificacionRepository.actualizarPreferencias(false))
            .resolves.toEqual({ pedidosAsignados: false });
        expect(put).toHaveBeenCalledWith('/notificaciones/preferencias', { pedidosAsignados: false });
    });

    test('marca una notificacion como leida', async () => {
        patch.mockResolvedValueOnce({ data: { message: 'ok' } });
        await NotificacionRepository.marcarComoLeida(7);
        expect(patch).toHaveBeenCalledWith('/notificaciones/7/leida');
    });

    test('propaga el mensaje del servidor', async () => {
        get.mockRejectedValueOnce({ response: { data: { error: 'Servicio no disponible' } } });
        await expect(NotificacionRepository.listar()).rejects.toThrow('Servicio no disponible');
    });
});
