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
import { useRecoveryViewModel } from '../viewmodels/useRecoveryViewModel';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Validación de correo ────────────────────────────────────────────────────
const EMAIL_REGEX = /^[a-zA-Z0-9._+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validateCorreo(v: string): string | null {
    if (!v.trim()) return 'El correo es obligatorio.';
    if (!EMAIL_REGEX.test(v)) return 'Formato invalido. Ejemplo: nombre@dominio.com';
    return null;
}

// ─── Feedback de campo: hint en gris o error en rojo ────────────────────────
function FieldFeedback({ error, hint }: { error: string | null; hint: string }) {
    if (error) {
        return (
            <View className="flex-row items-center mt-1.5 mb-2 px-1 gap-1">
                <MaterialCommunityIcons name="alert-circle-outline" size={13} color="#EF4444" />
                <Text className="text-red-500 text-xs font-medium flex-1">{error}</Text>
            </View>
        );
    }
    return (
        <View className="flex-row items-center mt-1.5 mb-2 px-1 gap-1">
            <MaterialCommunityIcons name="information-outline" size={13} color="#94A3B8" />
            <Text className="text-slate-400 text-xs flex-1">{hint}</Text>
        </View>
    );
}

// ─── Pantalla principal ──────────────────────────────────────────────────────
export default function RecoveryScreen() {
    const router = useRouter();
    const vm = useRecoveryViewModel();

    const [correoError, setCorreoError] = useState<string | null>(null);
    const [correoTouched, setCorreoTouched] = useState(false);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleCorreoChange = (text: string) => {
        vm.setCorreo(text);
        if (correoTouched) setCorreoError(validateCorreo(text));
    };

    const handleCorreoBlur = () => {
        setCorreoTouched(true);
        setCorreoError(validateCorreo(vm.correo));
    };

    const handleSubmit = () => {
        setCorreoTouched(true);
        const err = validateCorreo(vm.correo);
        setCorreoError(err);
        if (err) return;
        vm.handleRequestRecovery();
    };

    const isFormReady = !validateCorreo(vm.correo);

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
                {/* ── Ícono superior ────────────────────────────────────── */}
                <View className="w-20 h-20 bg-[#1E2548] rounded-full items-center justify-center mb-6 border-4 border-white shadow-lg shadow-emerald-500/10">
                    <MaterialCommunityIcons name="email-outline" size={36} color="#10B981" />
                </View>

                {/* ── Tarjeta del formulario ────────────────────────────── */}
                <View className="bg-white p-7 rounded-[28px] shadow-xl shadow-slate-200/80 border border-slate-100/80 w-full max-w-sm">

                    {/* Título y descripción */}
                    <Text className="text-2xl font-extrabold text-slate-800 tracking-tight text-center mb-2">
                        ¿Olvidaste tu contraseña?
                    </Text>
                    <Text className="text-slate-500 text-sm text-center mb-6 leading-5">
                        Ingresa tu correo y te enviaremos un código de 4 dígitos para recuperar tu acceso.
                    </Text>

                    {/* ── Error del servidor ────────────────────────────── */}
                    {vm.error && (
                        <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex-row items-start gap-2">
                            <MaterialCommunityIcons name="server-network-off" size={16} color="#DC2626" style={{ marginTop: 1 }} />
                            <Text className="text-red-600 font-medium text-xs flex-1">{vm.error}</Text>
                        </View>
                    )}

                    {/* ── Campo: Correo Electrónico ─────────────────────── */}
                    <Text className="text-slate-800 font-bold text-sm mb-1.5">Correo Electrónico</Text>
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
                            value={vm.correo}
                            onChangeText={handleCorreoChange}
                            onBlur={handleCorreoBlur}
                            placeholder="Ej. nombre@dominio.com"
                            placeholderTextColor="#94A3B8"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {/* Ícono de estado */}
                        {correoTouched && (
                            <MaterialCommunityIcons
                                name={correoError ? 'close-circle' : 'check-circle'}
                                size={18}
                                color={correoError ? '#EF4444' : '#10B981'}
                            />
                        )}
                    </View>

                    {/* Hint o error debajo del campo */}
                    <FieldFeedback
                        error={correoError}
                        hint="Formato: letras, numeros, puntos o guiones antes del @"
                    />

                    {/* ── Botón: Enviar código ──────────────────────────── */}
                    <TouchableOpacity
                        className={`py-4 rounded-2xl flex-row justify-center items-center shadow-lg w-full mt-2 ${vm.isLoading
                            ? 'bg-blue-400'
                            : isFormReady
                                ? 'bg-[#0038FF] active:bg-blue-700 shadow-blue-500/30'
                                : 'bg-slate-300'
                            }`}
                        onPress={handleSubmit}
                        disabled={vm.isLoading}
                    >
                        {vm.isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className={`font-bold text-base ${isFormReady ? 'text-white' : 'text-slate-400'}`}>
                                Enviar código
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* ── Link: Volver al login ─────────────────────────────── */}
                <View className="mt-6 items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-slate-500 text-sm font-medium">
                            ¿Ya tienes cuenta?{' '}
                            <Text className="text-[#0038FF] font-bold">Inicia sesión</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
