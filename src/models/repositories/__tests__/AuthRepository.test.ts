import apiClient from '../../../core/apiClient';
import { AuthRepository } from '../AuthRepository';

jest.mock('../../../core/apiClient', () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
    },
}));

const post = apiClient.post as jest.Mock;

describe('AuthRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('envía las credenciales y devuelve la respuesta de inicio de sesión', async () => {
        const response = { token: 'jwt-de-prueba' };
        post.mockResolvedValueOnce({ data: response });

        await expect(AuthRepository.login('repartidor@angelitos.com', 'Secreta123!')).resolves.toEqual(response);

        expect(post).toHaveBeenCalledWith('/auth/login', {
            correo: 'repartidor@angelitos.com',
            password: 'Secreta123!',
        });
    });

    test('devuelve el mensaje del servidor cuando el inicio de sesión falla', async () => {
        post.mockRejectedValueOnce({
            response: { data: { error: 'Credenciales inválidas' } },
        });

        await expect(AuthRepository.login('repartidor@angelitos.com', 'incorrecta')).rejects.toThrow(
            'Credenciales inválidas'
        );
    });

    test('devuelve un error de conexión cuando no existe respuesta del servidor', async () => {
        post.mockRejectedValueOnce(new Error('Network Error'));

        await expect(AuthRepository.requestRecovery('repartidor@angelitos.com')).rejects.toThrow(
            'No se pudo conectar con el servidor'
        );
    });

    test('envía el código de repartidor al registrar una cuenta', async () => {
        const datos = {
            nombre: 'Ana',
            apellidoP: 'López',
            apellidoM: 'Martínez',
            correo: 'ana@angelitos.com',
            telefono: '7711234567',
            codigoRegistro: 'REP-8K4M-X7Q',
            password: 'Secreta123!',
        };
        post.mockResolvedValueOnce({ data: { message: 'Registro exitoso' } });

        await AuthRepository.register(datos);

        expect(post).toHaveBeenCalledWith('/auth/register', datos);
    });

    test('envía el correo y la nueva contraseña al restablecerla', async () => {
        const response = { message: 'Contraseña actualizada' };
        post.mockResolvedValueOnce({ data: response });

        await expect(
            AuthRepository.resetPassword('repartidor@angelitos.com', 'Nueva123!')
        ).resolves.toEqual(response);

        expect(post).toHaveBeenCalledWith('/auth/reset-password', {
            correo: 'repartidor@angelitos.com',
            nuevaPassword: 'Nueva123!',
        });
    });
});
