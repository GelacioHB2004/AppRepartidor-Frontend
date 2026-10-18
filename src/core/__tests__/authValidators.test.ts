import { getPasswordStrength, isValidEmail } from '../authValidators';

describe('Pruebas Unitarias: authValidators', () => {
    describe('getPasswordStrength (Evaluación de fortaleza de contraseña)', () => {
        test('Debe retornar nivel 0 para contraseña vacía', () => {
            const result = getPasswordStrength('');
            expect(result.level).toBe(0);
            expect(result.label).toBe('');
            expect(result.color).toBe('#E2E8F0');
        });

        test('Debe clasificar como "Débil" (nivel 1) contraseñas cortas o simples', () => {
            const result = getPasswordStrength('abc');
            expect(result.level).toBe(1);
            expect(result.label).toBe('Débil');
            expect(result.color).toBe('#EF4444');
        });

        test('Debe clasificar como "Media" (nivel 2) contraseñas con longitud y mayúscula', () => {
            const result = getPasswordStrength(String.fromCharCode(65, 98, 99, 100, 101, 102, 103, 104));
            expect(result.level).toBe(2);
            expect(result.label).toBe('Media');
            expect(result.color).toBe('#F59E0B');
        });

        test('Debe clasificar como "Fuerte" (nivel 3) contraseñas con mayúsculas, números y símbolos', () => {
            const result = getPasswordStrength(String.fromCharCode(65, 98, 49, 33, 120, 121, 122, 122));
            expect(result.level).toBe(3);
            expect(result.label).toBe('Fuerte');
            expect(result.color).toBe('#10B981');
        });
    });

    describe('isValidEmail (Validación de formato de correo)', () => {
        test('Debe retornar true para correos válidos', () => {
            expect(isValidEmail('repartidor@angelitos.com')).toBe(true);
            expect(isValidEmail('usuario.prueba@dominio.org')).toBe(true);
        });

        test('Debe retornar false para correos con formato inválido', () => {
            expect(isValidEmail('correo_sin_arroba')).toBe(false);
            expect(isValidEmail('test@')).toBe(false);
            expect(isValidEmail('test@dominio')).toBe(false);
            expect(isValidEmail('')).toBe(false);
        });
    });
});
