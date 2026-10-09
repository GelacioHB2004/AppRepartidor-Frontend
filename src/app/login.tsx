import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';

// ─── Helpers de validación ──────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCorreo(value: string): string | null {
    if (!value.trim()) return 'El correo es obligatorio.';
    if (!EMAIL_REGEX.test(value)) return 'Ingresa un correo válido (ej. nombre@ejemplo.com).';
    return null;
}

function validatePassword(value: string): string | null {
    if (!value) return 'La contraseña es obligatoria.';
    if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return null;
}

// ─── Componente de campo con error ─────────────────────────────────────────
interface FieldErrorProps {
    message: string | null;
}
function FieldError({ message }: FieldErrorProps) {
    if (!message) return null;
    return (
        <View className="flex-row items-center mt-1.5 mb-1 px-1 gap-1">
            <MaterialCommunityIcons name="alert-circle-outline" size={13} color="#EF4444" />
            <Text className="text-red-500 text-xs font-medium flex-1">{message}</Text>
        </View>
    );
}

// ─── Pantalla principal ─────────────────────────────────────────────────────
export default function LoginScreen() {
    const router = useRouter();
    const {
        correo, setCorreo,
        password, setPassword,
        isLoading, error, handleLogin
    } = useAuthViewModel();

    const [showPassword, setShowPassword] = useState(false);

    // Errores individuales por campo (se activan al perder el foco o al intentar enviar)
    const [correoError, setCorreoError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Indica si ya se tocó el campo (para no mostrar error antes de interactuar)
    const [correoTouched, setCorreoTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    // ── Handlers de cambio (valida en tiempo real si ya se tocó el campo) ──
    const handleCorreoChange = (text: string) => {
        setCorreo(text);
        if (correoTouched) setCorreoError(validateCorreo(text));
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (passwordTouched) setPasswordError(validatePassword(text));
    };

    // ── Handlers de blur (primer momento de validación) ─────────────────────
    const handleCorreoBlur = () => {
        setCorreoTouched(true);
        setCorreoError(validateCorreo(correo));
    };

    const handlePasswordBlur = () => {
        setPasswordTouched(true);
        setPasswordError(validatePassword(password));
    };

    // ── Submit con validación completa ───────────────────────────────────────
    const handleSubmit = () => {
        // Marcar todos como tocados para mostrar errores
        setCorreoTouched(true);
        setPasswordTouched(true);

        const errCorreo = validateCorreo(correo);
        const errPass = validatePassword(password);

        setCorreoError(errCorreo);
        setPasswordError(errPass);

        // Si hay errores de UI, no continuar
        if (errCorreo || errPass) return;

        // Si pasó las validaciones locales, llamar al ViewModel
        handleLogin();
    };

    // Botón habilitado solo si ambos campos tienen contenido
    const isFormReady = correo.trim().length > 0 && password.length > 0;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#F8F9FD]"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                className="px-6 py-10"
            >
                {/* ── Logo & Header ─────────────────────────────────────── */}
                <View className="items-center mb-6 w-full max-w-sm">
                    <View className="w-36 h-36 rounded-full bg-amber-100 border-4 border-white shadow-lg shadow-amber-500/10 items-center justify-center mb-4 overflow-hidden">
                        <MaterialCommunityIcons name="storefront" size={60} color="#F59E0B" />
                    </View>
                    <Text className="text-3xl font-extrabold text-slate-800 tracking-tight text-center">
                        Repartidores
                    </Text>
                    <Text className="text-slate-500 mt-1.5 text-sm text-center px-4 leading-5">
                        Inicia sesión para gestionar tus entregas de Dulcería Angelitos
                    </Text>
                </View>

                {/* ── Tarjeta del formulario ────────────────────────────── */}
                <View className="bg-white p-7 rounded-[28px] shadow-xl shadow-slate-200/80 border border-slate-100/80 w-full max-w-sm">

                    {/* ── Campo: Correo electrónico ──────────────────────── */}
                    <Text className="text-slate-800 font-bold text-sm mb-2">
                        Correo Electrónico
                    </Text>
                    <View
                        className="flex-row items-center bg-[#F8FAFC] rounded-2xl px-4 py-3.5"
                        style={{
                            borderWidth: 1,
                            borderColor: correoError ? '#EF4444' : '#E2E8F0',
                        }}
                    >
                        <MaterialCommunityIcons
                            name="email-outline"
                            size={20}
                            color={correoError ? '#EF4444' : '#94A3B8'}
                            style={{ marginRight: 10 }}
                        />
                        <TextInput
                            className="flex-1 text-slate-800 text-sm font-medium p-0"
                            placeholder="nombre@ejemplo.com"
                            placeholderTextColor="#94A3B8"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={correo}
                            onChangeText={handleCorreoChange}
                            onBlur={handleCorreoBlur}
                        />
                        {/* Ícono de estado del campo */}
                        {correoTouched && (
                            <MaterialCommunityIcons
                                name={correoError ? 'close-circle' : 'check-circle'}
                                size={18}
                                color={correoError ? '#EF4444' : '#10B981'}
                            />
                        )}
                    </View>
                    {/* Mensaje de error del campo correo */}
                    <FieldError message={correoError} />

                    {/* ── Campo: Contraseña ──────────────────────────────── */}
                    <Text className="text-slate-800 font-bold text-sm mb-2 mt-3">
                        Contraseña
                    </Text>
                    <View
                        className="flex-row items-center bg-[#F8FAFC] rounded-2xl px-4 py-3.5"
                        style={{
                            borderWidth: 1,
                            borderColor: passwordError ? '#EF4444' : '#E2E8F0',
                        }}
                    >
                        <MaterialCommunityIcons
                            name="lock-outline"
                            size={20}
                            color={passwordError ? '#EF4444' : '#94A3B8'}
                            style={{ marginRight: 10 }}
                        />
                        <TextInput
                            className="flex-1 text-slate-800 text-sm font-medium p-0"
                            placeholder="••••••••"
                            placeholderTextColor="#94A3B8"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <MaterialCommunityIcons
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color="#94A3B8"
                            />
                        </TouchableOpacity>
                    </View>
                    {/* Mensaje de error del campo contraseña */}
                    <FieldError message={passwordError} />

                    {/* ── Link: Olvidé mi contraseña ────────────────────── */}
                    <TouchableOpacity
                        onPress={() => router.push('/recovery' as any)}
                        className="self-end mt-2 mb-5"
                    >
                        <Text className="text-[#0047FF] text-sm font-bold">
                            ¿Olvidaste tu contraseña?
                        </Text>
                    </TouchableOpacity>

                    {/* ── Error del servidor (distinto a errores de campo) ─ */}
                    {error && (
                        <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex-row items-start gap-2">
                            <MaterialCommunityIcons name="server-network-off" size={16} color="#DC2626" style={{ marginTop: 1 }} />
                            <Text className="text-red-600 font-medium text-xs flex-1">{error}</Text>
                        </View>
                    )}

                    {/* ── Botón: Iniciar Sesión ──────────────────────────── */}
                    <TouchableOpacity
                        className={`py-4 rounded-2xl flex-row justify-center items-center shadow-lg ${
                            isLoading
                                ? 'bg-blue-400'
                                : isFormReady
                                    ? 'bg-[#0038FF] active:bg-blue-700 shadow-blue-500/30'
                                    : 'bg-slate-300'
                        }`}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className={`font-bold text-base ${isFormReady ? 'text-white' : 'text-slate-400'}`}>
                                Iniciar Sesión
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* ── Link: Registro ────────────────────────────────── */}
                    <View className="mt-6 items-center">
                        <TouchableOpacity onPress={() => router.push('/register' as any)}>
                            <Text className="text-slate-500 text-sm font-medium">
                                ¿No tienes cuenta?{' '}
                                <Text className="text-[#0038FF] font-bold">Regístrate aquí</Text>
                            </Text>
                        </TouchableOpacity>

                        {/* ── Footer de seguridad ───────────────────────── */}
                        <View className="flex-row items-center justify-center mt-5 pt-1">
                            <View className="w-6 h-6 rounded-md bg-indigo-50 items-center justify-center mr-2">
                                <MaterialCommunityIcons name="lock" size={14} color="#6366F1" />
                            </View>
                            <Text className="text-slate-400 text-xs font-medium">
                                Protegido con encriptación segura
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
