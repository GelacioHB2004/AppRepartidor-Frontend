import apiClient from '../../../core/apiClient';
import { PerfilRepository } from '../PerfilRepository';

jest.mock('../../../core/apiClient', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        put: jest.fn(),
    },
}));

const get = apiClient.get as jest.Mock;
const put = apiClient.put as jest.Mock;

describe('PerfilRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('obtiene la información del perfil', async () => {
        const perfil = {
            nombre: 'Joni',
            apellidoP: 'Olivares',
            apellidoM: 'Aguilar',
            telefono: '7711234567',
            correo: '20231186@uthh.edu.mx',
        };
        get.mockResolvedValueOnce({ data: { perfil } });

        await expect(PerfilRepository.obtenerPerfil()).resolves.toEqual(perfil);

        expect(get).toHaveBeenCalledWith('/perfil');
    });

    test('actualiza la información editable del perfil', async () => {
        const datos = {
            nombre: 'Joni',
            apellidoP: 'Olivares',
            apellidoM: 'Aguilar',
            telefono: '7711234567',
        };
        const respuesta = { message: 'Perfil actualizado correctamente' };
        put.mockResolvedValueOnce({ data: respuesta });

        await expect(PerfilRepository.actualizarPerfil(datos)).resolves.toEqual(respuesta);

        expect(put).toHaveBeenCalledWith('/perfil', datos);
    });

    test('devuelve el mensaje del servidor cuando no obtiene el perfil', async () => {
        get.mockRejectedValueOnce({
            response: { data: { error: 'No fue posible cargar el perfil' } },
        });

        await expect(PerfilRepository.obtenerPerfil()).rejects.toThrow(
            'No fue posible cargar el perfil'
        );
    });

    test('devuelve un error controlado cuando falla la conexión al obtener el perfil', async () => {
        get.mockRejectedValueOnce(new Error('Network Error'));

        await expect(PerfilRepository.obtenerPerfil()).rejects.toThrow(
            'Error al obtener perfil'
        );
    });

    test('devuelve el mensaje del servidor cuando no actualiza el perfil', async () => {
        put.mockRejectedValueOnce({
            response: { data: { error: 'El teléfono ya está registrado' } },
        });

        await expect(
            PerfilRepository.actualizarPerfil({
                nombre: 'Joni',
                apellidoP: 'Olivares',
                apellidoM: 'Aguilar',
                telefono: '7711234567',
            })
        ).rejects.toThrow('El teléfono ya está registrado');
    });

    test('devuelve un error controlado cuando falla la conexión al actualizar el perfil', async () => {
        put.mockRejectedValueOnce(new Error('Network Error'));

        await expect(
            PerfilRepository.actualizarPerfil({
                nombre: 'Joni',
                apellidoP: 'Olivares',
                apellidoM: 'Aguilar',
                telefono: '7711234567',
            })
        ).rejects.toThrow('Error al actualizar perfil');
    });
});
