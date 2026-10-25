import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { PerfilRepository } from '../models/repositories/PerfilRepository';

export const usePerfilViewModel = () => {
    // Datos del perfil
    const [nombre, setNombre] = useState('');
    const [apellidoP, setApellidoP] = useState('');
    const [apellidoM, setApellidoM] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [fechaRegistro, setFechaRegistro] = useState('');

    // Estados de control
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const cargarPerfil = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const perfil = await PerfilRepository.obtenerPerfil();
            setNombre(perfil.nombre || '');
            setApellidoP(perfil.apellidoP || '');
            setApellidoM(perfil.apellidoM || '');
            setTelefono(perfil.telefono || '');
            setCorreo(perfil.correo || '');
            setNombreCompleto(perfil.nombreCompleto || '');
            setTipoUsuario(perfil.tipoUsuario || '');
            setFechaRegistro(perfil.fechaRegistro || '');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const guardarCambios = async () => {
        if (!nombre.trim() || !apellidoP.trim() || !telefono.trim()) {
            Alert.alert('Campos requeridos', 'El nombre, apellido paterno y teléfono son obligatorios.');
            return false;
        }

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await PerfilRepository.actualizarPerfil({
                nombre: nombre.trim(),
                apellidoP: apellidoP.trim(),
                apellidoM: apellidoM.trim(),
                telefono: telefono.trim(),
            });
            // Actualizar el nombre completo localmente
            setNombreCompleto(`${nombre.trim()} ${apellidoP.trim()} ${apellidoM.trim()}`);
            setSuccessMessage('¡Perfil actualizado con éxito!');
            
            // Limpiar el mensaje de éxito después de 3 segundos
            setTimeout(() => setSuccessMessage(null), 3000);
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        void cargarPerfil();
    }, []);

    return {
        nombre,
        setNombre,
        apellidoP,
        setApellidoP,
        apellidoM,
        setApellidoM,
        telefono,
        setTelefono,
        correo,
        nombreCompleto,
        tipoUsuario,
        fechaRegistro,
        isLoading,
        isSaving,
        error,
        successMessage,
        guardarCambios,
    };
};
