import { useState } from 'react';
import { AuthRepository } from '../models/repositories/AuthRepository';
import { useRouter } from 'expo-router';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const useRegisterViewModel = () => {
    const router = useRouter();
    const [nombre, setNombre] = useState('');
    const [apellidoP, setApellidoP] = useState('');
    const [apellidoM, setApellidoM] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [codigoRegistro, setCodigoRegistro] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [codigoRegistroError, setCodigoRegistroError] = useState<string | null>(null);

    const handleRegister = async () => {
        setError(null);
        setCodigoRegistroError(null);

        if (!nombre.trim() || !apellidoP.trim() || !correo.trim() || !telefono.trim() || !codigoRegistro.trim() || !password) {
            setError('Por favor, completa todos los campos obligatorios.');
            return;
        }
        if (!EMAIL_REGEX.test(correo.trim())) {
            setError('Ingresa un correo electrónico válido.');
            return;
        }
        if (telefono.replace(/\D/g, '').length < 10) {
            setError('El teléfono debe tener al menos 10 dígitos.');
            return;
        }
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);
        try {
            await AuthRepository.register({
                nombre: nombre.trim(),
                apellidoP: apellidoP.trim(),
                apellidoM: apellidoM.trim(),
                correo: correo.trim().toLowerCase(),
                telefono: telefono.trim(),
                codigoRegistro: codigoRegistro.trim().toUpperCase(),
                password,
            });
            // Navegar a la pantalla de verificación, pasando el correo
            router.push({ pathname: '/verify-account', params: { correo: correo.trim().toLowerCase() } } as any);
        } catch (err: any) {
            if (err.message?.toLowerCase().includes('código de registro')) {
                setCodigoRegistroError('El código de repartidor no es válido, ya fue usado o expiró.');
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        nombre, setNombre,
        apellidoP, setApellidoP,
        apellidoM, setApellidoM,
        correo, setCorreo,
        telefono, setTelefono,
        codigoRegistro, setCodigoRegistro,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        isLoading, error, codigoRegistroError,
        clearCodigoRegistroError: () => setCodigoRegistroError(null),
        handleRegister,
    };
};
