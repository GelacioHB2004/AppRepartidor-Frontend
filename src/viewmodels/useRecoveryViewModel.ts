import { useState } from 'react';
import { AuthRepository } from '../models/repositories/AuthRepository';
import { useRouter } from 'expo-router';

// Estado compartido entre pantallas de recuperación
export type RecoveryStep = 'email' | 'verify' | 'newPassword';

export const useRecoveryViewModel = () => {
    const router = useRouter();
    const [correo, setCorreo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRequestRecovery = async () => {
        setError(null);
        if (!correo.trim() || !/\S+@\S+\.\S+/.test(correo)) {
            setError('Ingresa un correo electrónico válido.');
            return;
        }
        setIsLoading(true);
        try {
            await AuthRepository.requestRecovery(correo.trim().toLowerCase());
            router.push({ pathname: '/verify-recovery', params: { correo: correo.trim().toLowerCase() } } as any);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyRecovery = async (correoParam: string, codigoIngresado: string) => {
        setError(null);
        setIsLoading(true);
        try {
            await AuthRepository.verifyRecovery(correoParam, codigoIngresado);
            router.push({ pathname: '/new-password', params: { correo: correoParam } } as any);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (correoParam: string) => {
        setError(null);
        if (nuevaPassword.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (nuevaPassword !== confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setIsLoading(true);
        try {
            await AuthRepository.resetPassword(correoParam, nuevaPassword);
            setSuccess('¡Contraseña actualizada! Ya puedes iniciar sesión.');
            setTimeout(() => router.replace('/login' as any), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        correo, setCorreo,
        codigo, setCodigo,
        nuevaPassword, setNuevaPassword,
        confirmarPassword, setConfirmarPassword,
        isLoading, error, success,
        handleRequestRecovery,
        handleVerifyRecovery,
        handleResetPassword,
    };
};
